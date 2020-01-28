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
        define("@angular/core/schematics/migrations/injectable-pipe/angular/injectable_pipe_visitor", ["require", "exports", "typescript", "@angular/core/schematics/utils/ng_decorators", "@angular/core/schematics/migrations/injectable-pipe/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const ts = require("typescript");
    const ng_decorators_1 = require("@angular/core/schematics/utils/ng_decorators");
    const util_1 = require("@angular/core/schematics/migrations/injectable-pipe/util");
    /**
     * Goes through all of the descendant nodes of a given node and lists out all of the pipes
     * that don't have `@Injectable`, as well as their `@Pipe` decorator and the import declaration
     * from which we'd need to import the `Injectable` decorator.
     */
    class InjectablePipeVisitor {
        constructor(_typeChecker) {
            this._typeChecker = _typeChecker;
            /**
             * Keeps track of all the classes that have a `Pipe` decorator, but not `Injectable`, as well
             * as a reference to the `Pipe` decorator itself and import declarations from which we'll have
             * to import the `Injectable` decorator.
             */
            this.missingInjectablePipes = [];
        }
        visitNode(node) {
            switch (node.kind) {
                case ts.SyntaxKind.ClassDeclaration:
                    this._visitClassDeclaration(node);
                    break;
            }
            ts.forEachChild(node, node => this.visitNode(node));
        }
        _visitClassDeclaration(node) {
            if (!node.decorators || !node.decorators.length) {
                return;
            }
            const ngDecorators = ng_decorators_1.getAngularDecorators(this._typeChecker, node.decorators);
            const pipeDecorator = ngDecorators.find(decorator => decorator.name === 'Pipe');
            const hasInjectableDecorator = !ngDecorators.some(decorator => decorator.name === util_1.INJECTABLE_DECORATOR_NAME);
            // Skip non-pipe classes and pipes that are already marked as injectable.
            if (pipeDecorator && hasInjectableDecorator) {
                const importNode = pipeDecorator.importNode;
                const namedImports = importNode.importClause && importNode.importClause.namedBindings;
                const needsImport = namedImports && ts.isNamedImports(namedImports) &&
                    !namedImports.elements.some(element => element.name.text === util_1.INJECTABLE_DECORATOR_NAME);
                this.missingInjectablePipes.push({
                    classDeclaration: node,
                    importDeclarationMissingImport: needsImport ? importNode : null,
                    pipeDecorator: pipeDecorator.node
                });
            }
        }
    }
    exports.InjectablePipeVisitor = InjectablePipeVisitor;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5qZWN0YWJsZV9waXBlX3Zpc2l0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NjaGVtYXRpY3MvbWlncmF0aW9ucy9pbmplY3RhYmxlLXBpcGUvYW5ndWxhci9pbmplY3RhYmxlX3BpcGVfdmlzaXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztJQUVILGlDQUFpQztJQUVqQyxnRkFBa0U7SUFDbEUsbUZBQWtEO0lBRWxEOzs7O09BSUc7SUFDSCxNQUFhLHFCQUFxQjtRQVloQyxZQUFvQixZQUE0QjtZQUE1QixpQkFBWSxHQUFaLFlBQVksQ0FBZ0I7WUFYaEQ7Ozs7ZUFJRztZQUNILDJCQUFzQixHQUloQixFQUFFLENBQUM7UUFFMEMsQ0FBQztRQUVwRCxTQUFTLENBQUMsSUFBYTtZQUNyQixRQUFRLElBQUksQ0FBQyxJQUFJLEVBQUU7Z0JBQ2pCLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0I7b0JBQ2pDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUEyQixDQUFDLENBQUM7b0JBQ3pELE1BQU07YUFDVDtZQUVELEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3RELENBQUM7UUFFTyxzQkFBc0IsQ0FBQyxJQUF5QjtZQUN0RCxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFO2dCQUMvQyxPQUFPO2FBQ1I7WUFFRCxNQUFNLFlBQVksR0FBRyxvQ0FBb0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUM5RSxNQUFNLGFBQWEsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksS0FBSyxNQUFNLENBQUMsQ0FBQztZQUNoRixNQUFNLHNCQUFzQixHQUN4QixDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxLQUFLLGdDQUF5QixDQUFDLENBQUM7WUFFbEYseUVBQXlFO1lBQ3pFLElBQUksYUFBYSxJQUFJLHNCQUFzQixFQUFFO2dCQUMzQyxNQUFNLFVBQVUsR0FBRyxhQUFhLENBQUMsVUFBVSxDQUFDO2dCQUM1QyxNQUFNLFlBQVksR0FBRyxVQUFVLENBQUMsWUFBWSxJQUFJLFVBQVUsQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDO2dCQUN0RixNQUFNLFdBQVcsR0FBRyxZQUFZLElBQUksRUFBRSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUM7b0JBQy9ELENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxnQ0FBeUIsQ0FBQyxDQUFDO2dCQUU1RixJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDO29CQUMvQixnQkFBZ0IsRUFBRSxJQUFJO29CQUN0Qiw4QkFBOEIsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSTtvQkFDL0QsYUFBYSxFQUFFLGFBQWEsQ0FBQyxJQUFJO2lCQUNsQyxDQUFDLENBQUM7YUFDSjtRQUNILENBQUM7S0FDRjtJQWhERCxzREFnREMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge2dldEFuZ3VsYXJEZWNvcmF0b3JzfSBmcm9tICcuLi8uLi8uLi91dGlscy9uZ19kZWNvcmF0b3JzJztcbmltcG9ydCB7SU5KRUNUQUJMRV9ERUNPUkFUT1JfTkFNRX0gZnJvbSAnLi4vdXRpbCc7XG5cbi8qKlxuICogR29lcyB0aHJvdWdoIGFsbCBvZiB0aGUgZGVzY2VuZGFudCBub2RlcyBvZiBhIGdpdmVuIG5vZGUgYW5kIGxpc3RzIG91dCBhbGwgb2YgdGhlIHBpcGVzXG4gKiB0aGF0IGRvbid0IGhhdmUgYEBJbmplY3RhYmxlYCwgYXMgd2VsbCBhcyB0aGVpciBgQFBpcGVgIGRlY29yYXRvciBhbmQgdGhlIGltcG9ydCBkZWNsYXJhdGlvblxuICogZnJvbSB3aGljaCB3ZSdkIG5lZWQgdG8gaW1wb3J0IHRoZSBgSW5qZWN0YWJsZWAgZGVjb3JhdG9yLlxuICovXG5leHBvcnQgY2xhc3MgSW5qZWN0YWJsZVBpcGVWaXNpdG9yIHtcbiAgLyoqXG4gICAqIEtlZXBzIHRyYWNrIG9mIGFsbCB0aGUgY2xhc3NlcyB0aGF0IGhhdmUgYSBgUGlwZWAgZGVjb3JhdG9yLCBidXQgbm90IGBJbmplY3RhYmxlYCwgYXMgd2VsbFxuICAgKiBhcyBhIHJlZmVyZW5jZSB0byB0aGUgYFBpcGVgIGRlY29yYXRvciBpdHNlbGYgYW5kIGltcG9ydCBkZWNsYXJhdGlvbnMgZnJvbSB3aGljaCB3ZSdsbCBoYXZlXG4gICAqIHRvIGltcG9ydCB0aGUgYEluamVjdGFibGVgIGRlY29yYXRvci5cbiAgICovXG4gIG1pc3NpbmdJbmplY3RhYmxlUGlwZXM6IHtcbiAgICBjbGFzc0RlY2xhcmF0aW9uOiB0cy5DbGFzc0RlY2xhcmF0aW9uLFxuICAgIGltcG9ydERlY2xhcmF0aW9uTWlzc2luZ0ltcG9ydDogdHMuSW1wb3J0RGVjbGFyYXRpb258bnVsbCxcbiAgICBwaXBlRGVjb3JhdG9yOiB0cy5EZWNvcmF0b3JcbiAgfVtdID0gW107XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfdHlwZUNoZWNrZXI6IHRzLlR5cGVDaGVja2VyKSB7fVxuXG4gIHZpc2l0Tm9kZShub2RlOiB0cy5Ob2RlKSB7XG4gICAgc3dpdGNoIChub2RlLmtpbmQpIHtcbiAgICAgIGNhc2UgdHMuU3ludGF4S2luZC5DbGFzc0RlY2xhcmF0aW9uOlxuICAgICAgICB0aGlzLl92aXNpdENsYXNzRGVjbGFyYXRpb24obm9kZSBhcyB0cy5DbGFzc0RlY2xhcmF0aW9uKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgdHMuZm9yRWFjaENoaWxkKG5vZGUsIG5vZGUgPT4gdGhpcy52aXNpdE5vZGUobm9kZSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdmlzaXRDbGFzc0RlY2xhcmF0aW9uKG5vZGU6IHRzLkNsYXNzRGVjbGFyYXRpb24pIHtcbiAgICBpZiAoIW5vZGUuZGVjb3JhdG9ycyB8fCAhbm9kZS5kZWNvcmF0b3JzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG5nRGVjb3JhdG9ycyA9IGdldEFuZ3VsYXJEZWNvcmF0b3JzKHRoaXMuX3R5cGVDaGVja2VyLCBub2RlLmRlY29yYXRvcnMpO1xuICAgIGNvbnN0IHBpcGVEZWNvcmF0b3IgPSBuZ0RlY29yYXRvcnMuZmluZChkZWNvcmF0b3IgPT4gZGVjb3JhdG9yLm5hbWUgPT09ICdQaXBlJyk7XG4gICAgY29uc3QgaGFzSW5qZWN0YWJsZURlY29yYXRvciA9XG4gICAgICAgICFuZ0RlY29yYXRvcnMuc29tZShkZWNvcmF0b3IgPT4gZGVjb3JhdG9yLm5hbWUgPT09IElOSkVDVEFCTEVfREVDT1JBVE9SX05BTUUpO1xuXG4gICAgLy8gU2tpcCBub24tcGlwZSBjbGFzc2VzIGFuZCBwaXBlcyB0aGF0IGFyZSBhbHJlYWR5IG1hcmtlZCBhcyBpbmplY3RhYmxlLlxuICAgIGlmIChwaXBlRGVjb3JhdG9yICYmIGhhc0luamVjdGFibGVEZWNvcmF0b3IpIHtcbiAgICAgIGNvbnN0IGltcG9ydE5vZGUgPSBwaXBlRGVjb3JhdG9yLmltcG9ydE5vZGU7XG4gICAgICBjb25zdCBuYW1lZEltcG9ydHMgPSBpbXBvcnROb2RlLmltcG9ydENsYXVzZSAmJiBpbXBvcnROb2RlLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzO1xuICAgICAgY29uc3QgbmVlZHNJbXBvcnQgPSBuYW1lZEltcG9ydHMgJiYgdHMuaXNOYW1lZEltcG9ydHMobmFtZWRJbXBvcnRzKSAmJlxuICAgICAgICAgICFuYW1lZEltcG9ydHMuZWxlbWVudHMuc29tZShlbGVtZW50ID0+IGVsZW1lbnQubmFtZS50ZXh0ID09PSBJTkpFQ1RBQkxFX0RFQ09SQVRPUl9OQU1FKTtcblxuICAgICAgdGhpcy5taXNzaW5nSW5qZWN0YWJsZVBpcGVzLnB1c2goe1xuICAgICAgICBjbGFzc0RlY2xhcmF0aW9uOiBub2RlLFxuICAgICAgICBpbXBvcnREZWNsYXJhdGlvbk1pc3NpbmdJbXBvcnQ6IG5lZWRzSW1wb3J0ID8gaW1wb3J0Tm9kZSA6IG51bGwsXG4gICAgICAgIHBpcGVEZWNvcmF0b3I6IHBpcGVEZWNvcmF0b3Iubm9kZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG4iXX0=