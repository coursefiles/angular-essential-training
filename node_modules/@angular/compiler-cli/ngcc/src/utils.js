(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/utils", ["require", "exports", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var ts = require("typescript");
    function getOriginalSymbol(checker) {
        return function (symbol) {
            return ts.SymbolFlags.Alias & symbol.flags ? checker.getAliasedSymbol(symbol) : symbol;
        };
    }
    exports.getOriginalSymbol = getOriginalSymbol;
    function isDefined(value) {
        return (value !== undefined) && (value !== null);
    }
    exports.isDefined = isDefined;
    function getNameText(name) {
        return ts.isIdentifier(name) || ts.isLiteralExpression(name) ? name.text : name.getText();
    }
    exports.getNameText = getNameText;
    /**
     * Parse down the AST and capture all the nodes that satisfy the test.
     * @param node The start node.
     * @param test The function that tests whether a node should be included.
     * @returns a collection of nodes that satisfy the test.
     */
    function findAll(node, test) {
        var nodes = [];
        findAllVisitor(node);
        return nodes;
        function findAllVisitor(n) {
            if (test(n)) {
                nodes.push(n);
            }
            else {
                n.forEachChild(function (child) { return findAllVisitor(child); });
            }
        }
    }
    exports.findAll = findAll;
    /**
     * Does the given declaration have a name which is an identifier?
     * @param declaration The declaration to test.
     * @returns true if the declaration has an identifier for a name.
     */
    function hasNameIdentifier(declaration) {
        var namedDeclaration = declaration;
        return namedDeclaration.name !== undefined && ts.isIdentifier(namedDeclaration.name);
    }
    exports.hasNameIdentifier = hasNameIdentifier;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvbmdjYy9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQTs7Ozs7O09BTUc7SUFDSCwrQkFBaUM7SUFFakMsU0FBZ0IsaUJBQWlCLENBQUMsT0FBdUI7UUFDdkQsT0FBTyxVQUFTLE1BQWlCO1lBQy9CLE9BQU8sRUFBRSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDekYsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUpELDhDQUlDO0lBRUQsU0FBZ0IsU0FBUyxDQUFJLEtBQTJCO1FBQ3RELE9BQU8sQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUZELDhCQUVDO0lBRUQsU0FBZ0IsV0FBVyxDQUFDLElBQXNDO1FBQ2hFLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM1RixDQUFDO0lBRkQsa0NBRUM7SUFFRDs7Ozs7T0FLRztJQUNILFNBQWdCLE9BQU8sQ0FBSSxJQUFhLEVBQUUsSUFBNEM7UUFDcEYsSUFBTSxLQUFLLEdBQVEsRUFBRSxDQUFDO1FBQ3RCLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyQixPQUFPLEtBQUssQ0FBQztRQUViLFNBQVMsY0FBYyxDQUFDLENBQVU7WUFDaEMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ1gsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNmO2lCQUFNO2dCQUNMLENBQUMsQ0FBQyxZQUFZLENBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxjQUFjLENBQUMsS0FBSyxDQUFDLEVBQXJCLENBQXFCLENBQUMsQ0FBQzthQUNoRDtRQUNILENBQUM7SUFDSCxDQUFDO0lBWkQsMEJBWUM7SUFFRDs7OztPQUlHO0lBQ0gsU0FBZ0IsaUJBQWlCLENBQUMsV0FBMkI7UUFFM0QsSUFBTSxnQkFBZ0IsR0FBb0MsV0FBVyxDQUFDO1FBQ3RFLE9BQU8sZ0JBQWdCLENBQUMsSUFBSSxLQUFLLFNBQVMsSUFBSSxFQUFFLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZGLENBQUM7SUFKRCw4Q0FJQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0T3JpZ2luYWxTeW1ib2woY2hlY2tlcjogdHMuVHlwZUNoZWNrZXIpOiAoc3ltYm9sOiB0cy5TeW1ib2wpID0+IHRzLlN5bWJvbCB7XG4gIHJldHVybiBmdW5jdGlvbihzeW1ib2w6IHRzLlN5bWJvbCkge1xuICAgIHJldHVybiB0cy5TeW1ib2xGbGFncy5BbGlhcyAmIHN5bWJvbC5mbGFncyA/IGNoZWNrZXIuZ2V0QWxpYXNlZFN5bWJvbChzeW1ib2wpIDogc3ltYm9sO1xuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNEZWZpbmVkPFQ+KHZhbHVlOiBUIHwgdW5kZWZpbmVkIHwgbnVsbCk6IHZhbHVlIGlzIFQge1xuICByZXR1cm4gKHZhbHVlICE9PSB1bmRlZmluZWQpICYmICh2YWx1ZSAhPT0gbnVsbCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROYW1lVGV4dChuYW1lOiB0cy5Qcm9wZXJ0eU5hbWUgfCB0cy5CaW5kaW5nTmFtZSk6IHN0cmluZyB7XG4gIHJldHVybiB0cy5pc0lkZW50aWZpZXIobmFtZSkgfHwgdHMuaXNMaXRlcmFsRXhwcmVzc2lvbihuYW1lKSA/IG5hbWUudGV4dCA6IG5hbWUuZ2V0VGV4dCgpO1xufVxuXG4vKipcbiAqIFBhcnNlIGRvd24gdGhlIEFTVCBhbmQgY2FwdHVyZSBhbGwgdGhlIG5vZGVzIHRoYXQgc2F0aXNmeSB0aGUgdGVzdC5cbiAqIEBwYXJhbSBub2RlIFRoZSBzdGFydCBub2RlLlxuICogQHBhcmFtIHRlc3QgVGhlIGZ1bmN0aW9uIHRoYXQgdGVzdHMgd2hldGhlciBhIG5vZGUgc2hvdWxkIGJlIGluY2x1ZGVkLlxuICogQHJldHVybnMgYSBjb2xsZWN0aW9uIG9mIG5vZGVzIHRoYXQgc2F0aXNmeSB0aGUgdGVzdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRBbGw8VD4obm9kZTogdHMuTm9kZSwgdGVzdDogKG5vZGU6IHRzLk5vZGUpID0+IG5vZGUgaXMgdHMuTm9kZSAmIFQpOiBUW10ge1xuICBjb25zdCBub2RlczogVFtdID0gW107XG4gIGZpbmRBbGxWaXNpdG9yKG5vZGUpO1xuICByZXR1cm4gbm9kZXM7XG5cbiAgZnVuY3Rpb24gZmluZEFsbFZpc2l0b3IobjogdHMuTm9kZSkge1xuICAgIGlmICh0ZXN0KG4pKSB7XG4gICAgICBub2Rlcy5wdXNoKG4pO1xuICAgIH0gZWxzZSB7XG4gICAgICBuLmZvckVhY2hDaGlsZChjaGlsZCA9PiBmaW5kQWxsVmlzaXRvcihjaGlsZCkpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIERvZXMgdGhlIGdpdmVuIGRlY2xhcmF0aW9uIGhhdmUgYSBuYW1lIHdoaWNoIGlzIGFuIGlkZW50aWZpZXI/XG4gKiBAcGFyYW0gZGVjbGFyYXRpb24gVGhlIGRlY2xhcmF0aW9uIHRvIHRlc3QuXG4gKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBkZWNsYXJhdGlvbiBoYXMgYW4gaWRlbnRpZmllciBmb3IgYSBuYW1lLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFzTmFtZUlkZW50aWZpZXIoZGVjbGFyYXRpb246IHRzLkRlY2xhcmF0aW9uKTogZGVjbGFyYXRpb24gaXMgdHMuRGVjbGFyYXRpb24mXG4gICAge25hbWU6IHRzLklkZW50aWZpZXJ9IHtcbiAgY29uc3QgbmFtZWREZWNsYXJhdGlvbjogdHMuRGVjbGFyYXRpb24me25hbWU/OiB0cy5Ob2RlfSA9IGRlY2xhcmF0aW9uO1xuICByZXR1cm4gbmFtZWREZWNsYXJhdGlvbi5uYW1lICE9PSB1bmRlZmluZWQgJiYgdHMuaXNJZGVudGlmaWVyKG5hbWVkRGVjbGFyYXRpb24ubmFtZSk7XG59XG4iXX0=