/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/core/schematics/migrations/static-queries/strategies/usage_strategy/usage_strategy", ["require", "exports", "typescript", "@angular/core/schematics/utils/parse_html", "@angular/core/schematics/utils/typescript/property_name", "@angular/core/schematics/migrations/static-queries/angular/query-definition", "@angular/core/schematics/migrations/static-queries/strategies/usage_strategy/declaration_usage_visitor", "@angular/core/schematics/migrations/static-queries/strategies/usage_strategy/super_class_context", "@angular/core/schematics/migrations/static-queries/strategies/usage_strategy/template_usage_visitor"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const ts = require("typescript");
    const parse_html_1 = require("@angular/core/schematics/utils/parse_html");
    const property_name_1 = require("@angular/core/schematics/utils/typescript/property_name");
    const query_definition_1 = require("@angular/core/schematics/migrations/static-queries/angular/query-definition");
    const declaration_usage_visitor_1 = require("@angular/core/schematics/migrations/static-queries/strategies/usage_strategy/declaration_usage_visitor");
    const super_class_context_1 = require("@angular/core/schematics/migrations/static-queries/strategies/usage_strategy/super_class_context");
    const template_usage_visitor_1 = require("@angular/core/schematics/migrations/static-queries/strategies/usage_strategy/template_usage_visitor");
    /**
     * Object that maps a given type of query to a list of lifecycle hooks that
     * could be used to access such a query statically.
     */
    const STATIC_QUERY_LIFECYCLE_HOOKS = {
        [query_definition_1.QueryType.ViewChild]: ['ngOnChanges', 'ngOnInit', 'ngDoCheck', 'ngAfterContentInit', 'ngAfterContentChecked'],
        [query_definition_1.QueryType.ContentChild]: ['ngOnChanges', 'ngOnInit', 'ngDoCheck'],
    };
    /**
     * Query timing strategy that determines the timing of a given query by inspecting how
     * the query is accessed within the project's TypeScript source files. Read more about
     * this strategy here: https://hackmd.io/s/Hymvc2OKE
     */
    class QueryUsageStrategy {
        constructor(classMetadata, typeChecker) {
            this.classMetadata = classMetadata;
            this.typeChecker = typeChecker;
        }
        setup() { }
        /**
         * Analyzes the usage of the given query and determines the query timing based
         * on the current usage of the query.
         */
        detectTiming(query) {
            if (query.property === null) {
                return { timing: null, message: 'Queries defined on accessors cannot be analyzed.' };
            }
            const usage = this.analyzeQueryUsage(query.container, query, []);
            if (usage === declaration_usage_visitor_1.ResolvedUsage.AMBIGUOUS) {
                return {
                    timing: query_definition_1.QueryTiming.STATIC,
                    message: 'Query timing is ambiguous. Please check if the query can be marked as dynamic.'
                };
            }
            else if (usage === declaration_usage_visitor_1.ResolvedUsage.SYNCHRONOUS) {
                return { timing: query_definition_1.QueryTiming.STATIC };
            }
            else {
                return { timing: query_definition_1.QueryTiming.DYNAMIC };
            }
        }
        /**
         * Checks whether a given query is used statically within the given class, its super
         * class or derived classes.
         */
        analyzeQueryUsage(classDecl, query, knownInputNames, functionCtx = new Map(), visitInheritedClasses = true) {
            const usageVisitor = new declaration_usage_visitor_1.DeclarationUsageVisitor(query.property, this.typeChecker, functionCtx);
            const classMetadata = this.classMetadata.get(classDecl);
            let usage = declaration_usage_visitor_1.ResolvedUsage.ASYNCHRONOUS;
            // In case there is metadata for the current class, we collect all resolved Angular input
            // names and add them to the list of known inputs that need to be checked for usages of
            // the current query. e.g. queries used in an @Input() *setter* are always static.
            if (classMetadata) {
                knownInputNames.push(...classMetadata.ngInputNames);
            }
            // Array of TypeScript nodes which can contain usages of the given query in
            // order to access it statically.
            const possibleStaticQueryNodes = filterQueryClassMemberNodes(classDecl, query, knownInputNames);
            // In case nodes that can possibly access a query statically have been found, check
            // if the query declaration is synchronously used within any of these nodes.
            if (possibleStaticQueryNodes.length) {
                possibleStaticQueryNodes.forEach(n => usage = combineResolvedUsage(usage, usageVisitor.getResolvedNodeUsage(n)));
            }
            if (!classMetadata) {
                return usage;
            }
            // In case there is a component template for the current class, we check if the
            // template statically accesses the current query. In case that's true, the query
            // can be marked as static.
            if (classMetadata.template && property_name_1.hasPropertyNameText(query.property.name)) {
                const template = classMetadata.template;
                const parsedHtml = parse_html_1.parseHtmlGracefully(template.content, template.filePath);
                const htmlVisitor = new template_usage_visitor_1.TemplateUsageVisitor(query.property.name.text);
                if (parsedHtml && htmlVisitor.isQueryUsedStatically(parsedHtml)) {
                    return declaration_usage_visitor_1.ResolvedUsage.SYNCHRONOUS;
                }
            }
            // In case derived classes should also be analyzed, we determine the classes that derive
            // from the current class and check if these have input setters or lifecycle hooks that
            // use the query statically.
            if (visitInheritedClasses) {
                classMetadata.derivedClasses.forEach(derivedClass => {
                    usage = combineResolvedUsage(usage, this.analyzeQueryUsage(derivedClass, query, knownInputNames));
                });
            }
            // In case the current class has a super class, we determine declared abstract function-like
            // declarations in the super-class that are implemented in the current class. The super class
            // will then be analyzed with the abstract declarations mapped to the implemented TypeScript
            // nodes. This allows us to handle queries which are used in super classes through derived
            // abstract method declarations.
            if (classMetadata.superClass) {
                const superClassDecl = classMetadata.superClass;
                // Update the function context to map abstract declaration nodes to their implementation
                // node in the base class. This ensures that the declaration usage visitor can analyze
                // abstract class member declarations.
                super_class_context_1.updateSuperClassAbstractMembersContext(classDecl, functionCtx, this.classMetadata);
                usage = combineResolvedUsage(usage, this.analyzeQueryUsage(superClassDecl, query, [], functionCtx, false));
            }
            return usage;
        }
    }
    exports.QueryUsageStrategy = QueryUsageStrategy;
    /**
     * Combines two resolved usages based on a fixed priority. "Synchronous" takes
     * precedence over "Ambiguous" whereas ambiguous takes precedence over "Asynchronous".
     */
    function combineResolvedUsage(base, target) {
        if (base === declaration_usage_visitor_1.ResolvedUsage.SYNCHRONOUS) {
            return base;
        }
        else if (target !== declaration_usage_visitor_1.ResolvedUsage.ASYNCHRONOUS) {
            return target;
        }
        else {
            return declaration_usage_visitor_1.ResolvedUsage.ASYNCHRONOUS;
        }
    }
    /**
     * Filters all class members from the class declaration that can access the
     * given query statically (e.g. ngOnInit lifecycle hook or @Input setters)
     */
    function filterQueryClassMemberNodes(classDecl, query, knownInputNames) {
        // Returns an array of TypeScript nodes which can contain usages of the given query
        // in order to access it statically. e.g.
        //  (1) queries used in the "ngOnInit" lifecycle hook are static.
        //  (2) inputs with setters can access queries statically.
        return classDecl.members
            .filter(m => {
            if (ts.isMethodDeclaration(m) && m.body && property_name_1.hasPropertyNameText(m.name) &&
                STATIC_QUERY_LIFECYCLE_HOOKS[query.type].indexOf(m.name.text) !== -1) {
                return true;
            }
            else if (knownInputNames && ts.isSetAccessor(m) && m.body && property_name_1.hasPropertyNameText(m.name) &&
                knownInputNames.indexOf(m.name.text) !== -1) {
                return true;
            }
            return false;
        })
            .map((member) => member.body);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNhZ2Vfc3RyYXRlZ3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NjaGVtYXRpY3MvbWlncmF0aW9ucy9zdGF0aWMtcXVlcmllcy9zdHJhdGVnaWVzL3VzYWdlX3N0cmF0ZWd5L3VzYWdlX3N0cmF0ZWd5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBRUgsaUNBQWlDO0lBRWpDLDBFQUFpRTtJQUNqRSwyRkFBK0U7SUFFL0Usa0hBQXlGO0lBR3pGLHNKQUFvRztJQUNwRywwSUFBNkU7SUFDN0UsZ0pBQThEO0lBRzlEOzs7T0FHRztJQUNILE1BQU0sNEJBQTRCLEdBQUc7UUFDbkMsQ0FBQyw0QkFBUyxDQUFDLFNBQVMsQ0FBQyxFQUNqQixDQUFDLGFBQWEsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLG9CQUFvQixFQUFFLHVCQUF1QixDQUFDO1FBQzNGLENBQUMsNEJBQVMsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxVQUFVLEVBQUUsV0FBVyxDQUFDO0tBQ25FLENBQUM7SUFFRjs7OztPQUlHO0lBQ0gsTUFBYSxrQkFBa0I7UUFDN0IsWUFBb0IsYUFBK0IsRUFBVSxXQUEyQjtZQUFwRSxrQkFBYSxHQUFiLGFBQWEsQ0FBa0I7WUFBVSxnQkFBVyxHQUFYLFdBQVcsQ0FBZ0I7UUFBRyxDQUFDO1FBRTVGLEtBQUssS0FBSSxDQUFDO1FBRVY7OztXQUdHO1FBQ0gsWUFBWSxDQUFDLEtBQXdCO1lBQ25DLElBQUksS0FBSyxDQUFDLFFBQVEsS0FBSyxJQUFJLEVBQUU7Z0JBQzNCLE9BQU8sRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxrREFBa0QsRUFBQyxDQUFDO2FBQ3BGO1lBRUQsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUs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bEUsNEJBQTRCLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO2dCQUN4RSxPQUFPLElBQUksQ0FBQzthQUNiO2lCQUFNLElBQ0gsZUFBZSxJQUFJLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxtQ0FBbUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUMvRSxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7Z0JBQy9DLE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFDRCxPQUFPLEtBQUssQ0FBQztRQUNmLENBQUMsQ0FBQzthQUNELEdBQUcsQ0FBQyxDQUFDLE1BQXdELEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFNLENBQUMsQ0FBQztJQUN4RixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuaW1wb3J0IHtwYXJzZUh0bWxHcmFjZWZ1bGx5fSBmcm9tICcuLi8uLi8uLi8uLi91dGlscy9wYXJzZV9odG1sJztcbmltcG9ydCB7aGFzUHJvcGVydHlOYW1lVGV4dH0gZnJvbSAnLi4vLi4vLi4vLi4vdXRpbHMvdHlwZXNjcmlwdC9wcm9wZXJ0eV9uYW1lJztcbmltcG9ydCB7Q2xhc3NNZXRhZGF0YU1hcH0gZnJvbSAnLi4vLi4vYW5ndWxhci9uZ19xdWVyeV92aXNpdG9yJztcbmltcG9ydCB7TmdRdWVyeURlZmluaXRpb24sIFF1ZXJ5VGltaW5nLCBRdWVyeVR5cGV9IGZyb20gJy4uLy4uL2FuZ3VsYXIvcXVlcnktZGVmaW5pdGlvbic7XG5pbXBvcnQge1RpbWluZ1Jlc3VsdCwgVGltaW5nU3RyYXRlZ3l9IGZyb20gJy4uL3RpbWluZy1zdHJhdGVneSc7XG5cbmltcG9ydCB7RGVjbGFyYXRpb25Vc2FnZVZpc2l0b3IsIEZ1bmN0aW9uQ29udGV4dCwgUmVzb2x2ZWRVc2FnZX0gZnJvbSAnLi9kZWNsYXJhdGlvbl91c2FnZV92aXNpdG9yJztcbmltcG9ydCB7dXBkYXRlU3VwZXJDbGFzc0Fic3RyYWN0TWVtYmVyc0NvbnRleHR9IGZyb20gJy4vc3VwZXJfY2xhc3NfY29udGV4dCc7XG5pbXBvcnQge1RlbXBsYXRlVXNhZ2VWaXNpdG9yfSBmcm9tICcuL3RlbXBsYXRlX3VzYWdlX3Zpc2l0b3InO1xuXG5cbi8qKlxuICogT2JqZWN0IHRoYXQgbWFwcyBhIGdpdmVuIHR5cGUgb2YgcXVlcnkgdG8gYSBsaXN0IG9mIGxpZmVjeWNsZSBob29rcyB0aGF0XG4gKiBjb3VsZCBiZSB1c2VkIHRvIGFjY2VzcyBzdWNoIGEgcXVlcnkgc3RhdGljYWxseS5cbiAqL1xuY29uc3QgU1RBVElDX1FVRVJZX0xJRkVDWUNMRV9IT09LUyA9IHtcbiAgW1F1ZXJ5VHlwZS5WaWV3Q2hpbGRdOlxuICAgICAgWyduZ09uQ2hhbmdlcycsICduZ09uSW5pdCcsICduZ0RvQ2hlY2snLCAnbmdBZnRlckNvbnRlbnRJbml0JywgJ25nQWZ0ZXJDb250ZW50Q2hlY2tlZCddLFxuICBbUXVlcnlUeXBlLkNvbnRlbnRDaGlsZF06IFsnbmdPbkNoYW5nZXMnLCAnbmdPbkluaXQnLCAnbmdEb0NoZWNrJ10sXG59O1xuXG4vKipcbiAqIFF1ZXJ5IHRpbWluZyBzdHJhdGVneSB0aGF0IGRldGVybWluZXMgdGhlIHRpbWluZyBvZiBhIGdpdmVuIHF1ZXJ5IGJ5IGluc3BlY3RpbmcgaG93XG4gKiB0aGUgcXVlcnkgaXMgYWNjZXNzZWQgd2l0aGluIHRoZSBwcm9qZWN0J3MgVHlwZVNjcmlwdCBzb3VyY2UgZmlsZXMuIFJlYWQgbW9yZSBhYm91dFxuICogdGhpcyBzdHJhdGVneSBoZXJlOiBodHRwczovL2hhY2ttZC5pby9zL0h5bXZjMk9LRVxuICovXG5leHBvcnQgY2xhc3MgUXVlcnlVc2FnZVN0cmF0ZWd5IGltcGxlbWVudHMgVGltaW5nU3RyYXRlZ3kge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNsYXNzTWV0YWRhdGE6IENsYXNzTWV0YWRhdGFNYXAsIHByaXZhdGUgdHlwZUNoZWNrZXI6IHRzLlR5cGVDaGVja2VyKSB7fVxuXG4gIHNldHVwKCkge31cblxuICAvKipcbiAgICogQW5hbHl6ZXMgdGhlIHVzYWdlIG9mIHRoZSBnaXZlbiBxdWVyeSBhbmQgZGV0ZXJtaW5lcyB0aGUgcXVlcnkgdGltaW5nIGJhc2VkXG4gICAqIG9uIHRoZSBjdXJyZW50IHVzYWdlIG9mIHRoZSBxdWVyeS5cbiAgICovXG4gIGRldGVjdFRpbWluZyhxdWVyeTogTmdRdWVyeURlZmluaXRpb24pOiBUaW1pbmdSZXN1bHQge1xuICAgIGlmIChxdWVyeS5wcm9wZXJ0eSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHt0aW1pbmc6IG51bGwsIG1lc3NhZ2U6ICdRdWVyaWVzIGRlZmluZWQgb24gYWNjZXNzb3JzIGNhbm5vdCBiZSBhbmFseXplZC4nfTtcbiAgICB9XG5cbiAgICBjb25zdCB1c2FnZSA9IHRoaXMuYW5hbHl6ZVF1ZXJ5VXNhZ2UocXVlcnkuY29udGFpbmVyLCBxdWVyeSwgW10pO1xuXG4gICAgaWYgKHVzYWdlID09PSBSZXNvbHZlZFVzYWdlLkFNQklHVU9VUykge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGltaW5nOiBRdWVyeVRpbWluZy5TVEFUSUMsXG4gICAgICAgIG1lc3NhZ2U6ICdRdWVyeSB0aW1pbmcgaXMgYW1iaWd1b3VzLiBQbGVhc2UgY2hlY2sgaWYgdGhlIHF1ZXJ5IGNhbiBiZSBtYXJrZWQgYXMgZHluYW1pYy4nXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAodXNhZ2UgPT09IFJlc29sdmVkVXNhZ2UuU1lOQ0hST05PVVMpIHtcbiAgICAgIHJldHVybiB7dGltaW5nOiBRdWVyeVRpbWluZy5TVEFUSUN9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge3RpbWluZzogUXVlcnlUaW1pbmcuRFlOQU1JQ307XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyB3aGV0aGVyIGEgZ2l2ZW4gcXVlcnkgaXMgdXNlZCBzdGF0aWNhbGx5IHdpdGhpbiB0aGUgZ2l2ZW4gY2xhc3MsIGl0cyBzdXBlclxuICAgKiBjbGFzcyBvciBkZXJpdmVkIGNsYXNzZXMuXG4gICAqL1xuICBwcml2YXRlIGFuYWx5emVRdWVyeVVzYWdlKFxuICAgICAgY2xhc3NEZWNsOiB0cy5DbGFzc0RlY2xhcmF0aW9uLCBxdWVyeTogTmdRdWVyeURlZmluaXRpb24sIGtub3duSW5wdXROYW1lczogc3RyaW5nW10sXG4gICAgICBmdW5jdGlvbkN0eDogRnVuY3Rpb25Db250ZXh0ID0gbmV3IE1hcCgpLCB2aXNpdEluaGVyaXRlZENsYXNzZXMgPSB0cnVlKTogUmVzb2x2ZWRVc2FnZSB7XG4gICAgY29uc3QgdXNhZ2VWaXNpdG9yID1cbiAgICAgICAgbmV3IERlY2xhcmF0aW9uVXNhZ2VWaXNpdG9yKHF1ZXJ5LnByb3BlcnR5ICEsIHRoaXMudHlwZUNoZWNrZXIsIGZ1bmN0aW9uQ3R4KTtcbiAgICBjb25zdCBjbGFzc01ldGFkYXRhID0gdGhpcy5jbGFzc01ldGFkYXRhLmdldChjbGFzc0RlY2wpO1xuICAgIGxldCB1c2FnZTogUmVzb2x2ZWRVc2FnZSA9IFJlc29sdmVkVXNhZ2UuQVNZTkNIUk9OT1VTO1xuXG4gICAgLy8gSW4gY2FzZSB0aGVyZSBpcyBtZXRhZGF0YSBmb3IgdGhlIGN1cnJlbnQgY2xhc3MsIHdlIGNvbGxlY3QgYWxsIHJlc29sdmVkIEFuZ3VsYXIgaW5wdXRcbiAgICAvLyBuYW1lcyBhbmQgYWRkIHRoZW0gdG8gdGhlIGxpc3Qgb2Yga25vd24gaW5wdXRzIHRoYXQgbmVlZCB0byBiZSBjaGVja2VkIGZvciB1c2FnZXMgb2ZcbiAgICAvLyB0aGUgY3VycmVudCBxdWVyeS4gZS5nLiBxdWVyaWVzIHVzZWQgaW4gYW4gQElucHV0KCkgKnNldHRlciogYXJlIGFsd2F5cyBzdGF0aWMuXG4gICAgaWYgKGNsYXNzTWV0YWRhdGEpIHtcbiAgICAgIGtub3duSW5wdXROYW1lcy5wdXNoKC4uLmNsYXNzTWV0YWRhdGEubmdJbnB1dE5hbWVzKTtcbiAgICB9XG5cbiAgICAvLyBBcnJheSBvZiBUeXBlU2NyaXB0IG5vZGVzIHdoaWNoIGNhbiBjb250YWluIHVzYWdlcyBvZiB0aGUgZ2l2ZW4gcXVlcnkgaW5cbiAgICAvLyBvcmRlciB0byBhY2Nlc3MgaXQgc3RhdGljYWxseS5cbiAgICBjb25zdCBwb3NzaWJsZVN0YXRpY1F1ZXJ5Tm9kZXMgPSBmaWx0ZXJRdWVyeUNsYXNzTWVtYmVyTm9kZXMoY2xhc3NEZWNsLCBxdWVyeSwga25vd25JbnB1dE5hbWVzKTtcblxuICAgIC8vIEluIGNhc2Ugbm9kZXMgdGhhdCBjYW4gcG9zc2libHkgYWNjZXNzIGEgcXVlcnkgc3RhdGljYWxseSBoYXZlIGJlZW4gZm91bmQsIGNoZWNrXG4gICAgLy8gaWYgdGhlIHF1ZXJ5IGRlY2xhcmF0aW9uIGlzIHN5bmNocm9ub3VzbHkgdXNlZCB3aXRoaW4gYW55IG9mIHRoZXNlIG5vZGVzLlxuICAgIGlmIChwb3NzaWJsZVN0YXRpY1F1ZXJ5Tm9kZXMubGVuZ3RoKSB7XG4gICAgICBwb3NzaWJsZVN0YXRpY1F1ZXJ5Tm9kZXMuZm9yRWFjaChcbiAgICAgICAgICBuID0+IHVzYWdlID0gY29tYmluZVJlc29sdmVkVXNhZ2UodXNhZ2UsIHVzYWdlVmlzaXRvci5nZXRSZXNvbHZlZE5vZGVVc2FnZShuKSkpO1xuICAgIH1cblxuICAgIGlmICghY2xhc3NNZXRhZGF0YSkge1xuICAgICAgcmV0dXJuIHVzYWdlO1xuICAgIH1cblxuICAgIC8vIEluIGNhc2UgdGhlcmUgaXMgYSBjb21wb25lbnQgdGVtcGxhdGUgZm9yIHRoZSBjdXJyZW50IGNsYXNzLCB3ZSBjaGVjayBpZiB0aGVcbiAgICAvLyB0ZW1wbGF0ZSBzdGF0aWNhbGx5IGFjY2Vzc2VzIHRoZSBjdXJyZW50IHF1ZXJ5LiBJbiBjYXNlIHRoYXQncyB0cnVlLCB0aGUgcXVlcnlcbiAgICAvLyBjYW4gYmUgbWFya2VkIGFzIHN0YXRpYy5cbiAgICBpZiAoY2xhc3NNZXRhZGF0YS50ZW1wbGF0ZSAmJiBoYXNQcm9wZXJ0eU5hbWVUZXh0KHF1ZXJ5LnByb3BlcnR5ICEubmFtZSkpIHtcbiAgICAgIGNvbnN0IHRlbXBsYXRlID0gY2xhc3NNZXRhZGF0YS50ZW1wbGF0ZTtcbiAgICAgIGNvbnN0IHBhcnNlZEh0bWwgPSBwYXJzZUh0bWxHcmFjZWZ1bGx5KHRlbXBsYXRlLmNvbnRlbnQsIHRlbXBsYXRlLmZpbGVQYXRoKTtcbiAgICAgIGNvbnN0IGh0bWxWaXNpdG9yID0gbmV3IFRlbXBsYXRlVXNhZ2VWaXNpdG9yKHF1ZXJ5LnByb3BlcnR5ICEubmFtZS50ZXh0KTtcblxuICAgICAgaWYgKHBhcnNlZEh0bWwgJiYgaHRtbFZpc2l0b3IuaXNRdWVyeVVzZWRTdGF0aWNhbGx5KHBhcnNlZEh0bWwpKSB7XG4gICAgICAgIHJldHVybiBSZXNvbHZlZFVzYWdlLlNZTkNIUk9OT1VTO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEluIGNhc2UgZGVyaXZlZCBjbGFzc2VzIHNob3VsZCBhbHNvIGJlIGFuYWx5emVkLCB3ZSBkZXRlcm1pbmUgdGhlIGNsYXNzZXMgdGhhdCBkZXJpdmVcbiAgICAvLyBmcm9tIHRoZSBjdXJyZW50IGNsYXNzIGFuZCBjaGVjayBpZiB0aGVzZSBoYXZlIGlucHV0IHNldHRlcnMgb3IgbGlmZWN5Y2xlIGhvb2tzIHRoYXRcbiAgICAvLyB1c2UgdGhlIHF1ZXJ5IHN0YXRpY2FsbHkuXG4gICAgaWYgKHZpc2l0SW5oZXJpdGVkQ2xhc3Nlcykge1xuICAgICAgY2xhc3NNZXRhZGF0YS5kZXJpdmVkQ2xhc3Nlcy5mb3JFYWNoKGRlcml2ZWRDbGFzcyA9PiB7XG4gICAgICAgIHVzYWdlID0gY29tYmluZVJlc29sdmVkVXNhZ2UoXG4gICAgICAgICAgICB1c2FnZSwgdGhpcy5hbmFseXplUXVlcnlVc2FnZShkZXJpdmVkQ2xhc3MsIHF1ZXJ5LCBrbm93bklucHV0TmFtZXMpKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEluIGNhc2UgdGhlIGN1cnJlbnQgY2xhc3MgaGFzIGEgc3VwZXIgY2xhc3MsIHdlIGRldGVybWluZSBkZWNsYXJlZCBhYnN0cmFjdCBmdW5jdGlvbi1saWtlXG4gICAgLy8gZGVjbGFyYXRpb25zIGluIHRoZSBzdXBlci1jbGFzcyB0aGF0IGFyZSBpbXBsZW1lbnRlZCBpbiB0aGUgY3VycmVudCBjbGFzcy4gVGhlIHN1cGVyIGNsYXNzXG4gICAgLy8gd2lsbCB0aGVuIGJlIGFuYWx5emVkIHdpdGggdGhlIGFic3RyYWN0IGRlY2xhcmF0aW9ucyBtYXBwZWQgdG8gdGhlIGltcGxlbWVudGVkIFR5cGVTY3JpcHRcbiAgICAvLyBub2Rlcy4gVGhpcyBhbGxvd3MgdXMgdG8gaGFuZGxlIHF1ZXJpZXMgd2hpY2ggYXJlIHVzZWQgaW4gc3VwZXIgY2xhc3NlcyB0aHJvdWdoIGRlcml2ZWRcbiAgICAvLyBhYnN0cmFjdCBtZXRob2QgZGVjbGFyYXRpb25zLlxuICAgIGlmIChjbGFzc01ldGFkYXRhLnN1cGVyQ2xhc3MpIHtcbiAgICAgIGNvbnN0IHN1cGVyQ2xhc3NEZWNsID0gY2xhc3NNZXRhZGF0YS5zdXBlckNsYXNzO1xuXG4gICAgICAvLyBVcGRhdGUgdGhlIGZ1bmN0aW9uIGNvbnRleHQgdG8gbWFwIGFic3RyYWN0IGRlY2xhcmF0aW9uIG5vZGVzIHRvIHRoZWlyIGltcGxlbWVudGF0aW9uXG4gICAgICAvLyBub2RlIGluIHRoZSBiYXNlIGNsYXNzLiBUaGlzIGVuc3VyZXMgdGhhdCB0aGUgZGVjbGFyYXRpb24gdXNhZ2UgdmlzaXRvciBjYW4gYW5hbHl6ZVxuICAgICAgLy8gYWJzdHJhY3QgY2xhc3MgbWVtYmVyIGRlY2xhcmF0aW9ucy5cbiAgICAgIHVwZGF0ZVN1cGVyQ2xhc3NBYnN0cmFjdE1lbWJlcnNDb250ZXh0KGNsYXNzRGVjbCwgZnVuY3Rpb25DdHgsIHRoaXMuY2xhc3NNZXRhZGF0YSk7XG5cbiAgICAgIHVzYWdlID0gY29tYmluZVJlc29sdmVkVXNhZ2UoXG4gICAgICAgICAgdXNhZ2UsIHRoaXMuYW5hbHl6ZVF1ZXJ5VXNhZ2Uoc3VwZXJDbGFzc0RlY2wsIHF1ZXJ5LCBbXSwgZnVuY3Rpb25DdHgsIGZhbHNlKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHVzYWdlO1xuICB9XG59XG5cbi8qKlxuICogQ29tYmluZXMgdHdvIHJlc29sdmVkIHVzYWdlcyBiYXNlZCBvbiBhIGZpeGVkIHByaW9yaXR5LiBcIlN5bmNocm9ub3VzXCIgdGFrZXNcbiAqIHByZWNlZGVuY2Ugb3ZlciBcIkFtYmlndW91c1wiIHdoZXJlYXMgYW1iaWd1b3VzIHRha2VzIHByZWNlZGVuY2Ugb3ZlciBcIkFzeW5jaHJvbm91c1wiLlxuICovXG5mdW5jdGlvbiBjb21iaW5lUmVzb2x2ZWRVc2FnZShiYXNlOiBSZXNvbHZlZFVzYWdlLCB0YXJnZXQ6IFJlc29sdmVkVXNhZ2UpOiBSZXNvbHZlZFVzYWdlIHtcbiAgaWYgKGJhc2UgPT09IFJlc29sdmVkVXNhZ2UuU1lOQ0hST05PVVMpIHtcbiAgICByZXR1cm4gYmFzZTtcbiAgfSBlbHNlIGlmICh0YXJnZXQgIT09IFJlc29sdmVkVXNhZ2UuQVNZTkNIUk9OT1VTKSB7XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gUmVzb2x2ZWRVc2FnZS5BU1lOQ0hST05PVVM7XG4gIH1cbn1cblxuLyoqXG4gKiBGaWx0ZXJzIGFsbCBjbGFzcyBtZW1iZXJzIGZyb20gdGhlIGNsYXNzIGRlY2xhcmF0aW9uIHRoYXQgY2FuIGFjY2VzcyB0aGVcbiAqIGdpdmVuIHF1ZXJ5IHN0YXRpY2FsbHkgKGUuZy4gbmdPbkluaXQgbGlmZWN5Y2xlIGhvb2sgb3IgQElucHV0IHNldHRlcnMpXG4gKi9cbmZ1bmN0aW9uIGZpbHRlclF1ZXJ5Q2xhc3NNZW1iZXJOb2RlcyhcbiAgICBjbGFzc0RlY2w6IHRzLkNsYXNzRGVjbGFyYXRpb24sIHF1ZXJ5OiBOZ1F1ZXJ5RGVmaW5pdGlvbixcbiAgICBrbm93bklucHV0TmFtZXM6IHN0cmluZ1tdKTogdHMuQmxvY2tbXSB7XG4gIC8vIFJldHVybnMgYW4gYXJyYXkgb2YgVHlwZVNjcmlwdCBub2RlcyB3aGljaCBjYW4gY29udGFpbiB1c2FnZXMgb2YgdGhlIGdpdmVuIHF1ZXJ5XG4gIC8vIGluIG9yZGVyIHRvIGFjY2VzcyBpdCBzdGF0aWNhbGx5LiBlLmcuXG4gIC8vICAoMSkgcXVlcmllcyB1c2VkIGluIHRoZSBcIm5nT25Jbml0XCIgbGlmZWN5Y2xlIGhvb2sgYXJlIHN0YXRpYy5cbiAgLy8gICgyKSBpbnB1dHMgd2l0aCBzZXR0ZXJzIGNhbiBhY2Nlc3MgcXVlcmllcyBzdGF0aWNhbGx5LlxuICByZXR1cm4gY2xhc3NEZWNsLm1lbWJlcnNcbiAgICAgIC5maWx0ZXIobSA9PiB7XG4gICAgICAgIGlmICh0cy5pc01ldGhvZERlY2xhcmF0aW9uKG0pICYmIG0uYm9keSAmJiBoYXNQcm9wZXJ0eU5hbWVUZXh0KG0ubmFtZSkgJiZcbiAgICAgICAgICAgIFNUQVRJQ19RVUVSWV9MSUZFQ1lDTEVfSE9PS1NbcXVlcnkudHlwZV0uaW5kZXhPZihtLm5hbWUudGV4dCkgIT09IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICBrbm93bklucHV0TmFtZXMgJiYgdHMuaXNTZXRBY2Nlc3NvcihtKSAmJiBtLmJvZHkgJiYgaGFzUHJvcGVydHlOYW1lVGV4dChtLm5hbWUpICYmXG4gICAgICAgICAgICBrbm93bklucHV0TmFtZXMuaW5kZXhPZihtLm5hbWUudGV4dCkgIT09IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSlcbiAgICAgIC5tYXAoKG1lbWJlcjogdHMuU2V0QWNjZXNzb3JEZWNsYXJhdGlvbiB8IHRzLk1ldGhvZERlY2xhcmF0aW9uKSA9PiBtZW1iZXIuYm9keSAhKTtcbn1cbiJdfQ==