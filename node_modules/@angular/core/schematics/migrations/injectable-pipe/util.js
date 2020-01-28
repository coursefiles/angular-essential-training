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
        define("@angular/core/schematics/migrations/injectable-pipe/util", ["require", "exports", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const ts = require("typescript");
    /** Name of the Injectable decorator. */
    exports.INJECTABLE_DECORATOR_NAME = 'Injectable';
    /**
     * Adds an import to a named import node, if the import does not exist already.
     * @param node Node to which to add the import.
     * @param importName Name of the import that should be added.
     */
    function addImport(node, importName) {
        const elements = node.elements;
        const isAlreadyImported = elements.some(element => element.name.text === importName);
        if (!isAlreadyImported) {
            return ts.updateNamedImports(node, [...elements, ts.createImportSpecifier(undefined, ts.createIdentifier(importName))]);
        }
        return node;
    }
    exports.addImport = addImport;
    /** Gets the named imports node from an import declaration. */
    function getNamedImports(node) {
        const importClause = node.importClause;
        const namedImports = importClause && importClause.namedBindings;
        return (namedImports && ts.isNamedImports(namedImports)) ? namedImports : null;
    }
    exports.getNamedImports = getNamedImports;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc2NoZW1hdGljcy9taWdyYXRpb25zL2luamVjdGFibGUtcGlwZS91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBRUgsaUNBQWlDO0lBRWpDLHdDQUF3QztJQUMzQixRQUFBLHlCQUF5QixHQUFHLFlBQVksQ0FBQztJQUV0RDs7OztPQUlHO0lBQ0gsU0FBZ0IsU0FBUyxDQUFDLElBQXFCLEVBQUUsVUFBa0I7UUFDakUsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUMvQixNQUFNLGlCQUFpQixHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxVQUFVLENBQUMsQ0FBQztRQUVyRixJQUFJLENBQUMsaUJBQWlCLEVBQUU7WUFDdEIsT0FBTyxFQUFFLENBQUMsa0JBQWtCLENBQ3hCLElBQUksRUFBRSxDQUFDLEdBQUcsUUFBUSxFQUFFLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2hHO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBVkQsOEJBVUM7SUFFRCw4REFBOEQ7SUFDOUQsU0FBZ0IsZUFBZSxDQUFDLElBQTBCO1FBQ3hELE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7UUFDdkMsTUFBTSxZQUFZLEdBQUcsWUFBWSxJQUFJLFlBQVksQ0FBQyxhQUFhLENBQUM7UUFDaEUsT0FBTyxDQUFDLFlBQVksSUFBSSxFQUFFLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ2pGLENBQUM7SUFKRCwwQ0FJQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbi8qKiBOYW1lIG9mIHRoZSBJbmplY3RhYmxlIGRlY29yYXRvci4gKi9cbmV4cG9ydCBjb25zdCBJTkpFQ1RBQkxFX0RFQ09SQVRPUl9OQU1FID0gJ0luamVjdGFibGUnO1xuXG4vKipcbiAqIEFkZHMgYW4gaW1wb3J0IHRvIGEgbmFtZWQgaW1wb3J0IG5vZGUsIGlmIHRoZSBpbXBvcnQgZG9lcyBub3QgZXhpc3QgYWxyZWFkeS5cbiAqIEBwYXJhbSBub2RlIE5vZGUgdG8gd2hpY2ggdG8gYWRkIHRoZSBpbXBvcnQuXG4gKiBAcGFyYW0gaW1wb3J0TmFtZSBOYW1lIG9mIHRoZSBpbXBvcnQgdGhhdCBzaG91bGQgYmUgYWRkZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRJbXBvcnQobm9kZTogdHMuTmFtZWRJbXBvcnRzLCBpbXBvcnROYW1lOiBzdHJpbmcpIHtcbiAgY29uc3QgZWxlbWVudHMgPSBub2RlLmVsZW1lbnRzO1xuICBjb25zdCBpc0FscmVhZHlJbXBvcnRlZCA9IGVsZW1lbnRzLnNvbWUoZWxlbWVudCA9PiBlbGVtZW50Lm5hbWUudGV4dCA9PT0gaW1wb3J0TmFtZSk7XG5cbiAgaWYgKCFpc0FscmVhZHlJbXBvcnRlZCkge1xuICAgIHJldHVybiB0cy51cGRhdGVOYW1lZEltcG9ydHMoXG4gICAgICAgIG5vZGUsIFsuLi5lbGVtZW50cywgdHMuY3JlYXRlSW1wb3J0U3BlY2lmaWVyKHVuZGVmaW5lZCwgdHMuY3JlYXRlSWRlbnRpZmllcihpbXBvcnROYW1lKSldKTtcbiAgfVxuXG4gIHJldHVybiBub2RlO1xufVxuXG4vKiogR2V0cyB0aGUgbmFtZWQgaW1wb3J0cyBub2RlIGZyb20gYW4gaW1wb3J0IGRlY2xhcmF0aW9uLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE5hbWVkSW1wb3J0cyhub2RlOiB0cy5JbXBvcnREZWNsYXJhdGlvbik6IHRzLk5hbWVkSW1wb3J0c3xudWxsIHtcbiAgY29uc3QgaW1wb3J0Q2xhdXNlID0gbm9kZS5pbXBvcnRDbGF1c2U7XG4gIGNvbnN0IG5hbWVkSW1wb3J0cyA9IGltcG9ydENsYXVzZSAmJiBpbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncztcbiAgcmV0dXJuIChuYW1lZEltcG9ydHMgJiYgdHMuaXNOYW1lZEltcG9ydHMobmFtZWRJbXBvcnRzKSkgPyBuYW1lZEltcG9ydHMgOiBudWxsO1xufVxuIl19