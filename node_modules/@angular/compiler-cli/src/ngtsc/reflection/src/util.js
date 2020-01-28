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
        define("@angular/compiler-cli/src/ngtsc/reflection/src/util", ["require", "exports", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ts = require("typescript");
    function isNamedClassDeclaration(node) {
        return ts.isClassDeclaration(node) && (node.name !== undefined);
    }
    exports.isNamedClassDeclaration = isNamedClassDeclaration;
    function isNamedFunctionDeclaration(node) {
        return ts.isFunctionDeclaration(node) && (node.name !== undefined);
    }
    exports.isNamedFunctionDeclaration = isNamedFunctionDeclaration;
    function isNamedVariableDeclaration(node) {
        return ts.isVariableDeclaration(node) && (node.name !== undefined);
    }
    exports.isNamedVariableDeclaration = isNamedVariableDeclaration;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvcmVmbGVjdGlvbi9zcmMvdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztJQUVILCtCQUFpQztJQUtqQyxTQUFnQix1QkFBdUIsQ0FBQyxJQUFhO1FBRW5ELE9BQU8sRUFBRSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBSEQsMERBR0M7SUFFRCxTQUFnQiwwQkFBMEIsQ0FBQyxJQUFhO1FBRXRELE9BQU8sRUFBRSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsQ0FBQztJQUNyRSxDQUFDO0lBSEQsZ0VBR0M7SUFFRCxTQUFnQiwwQkFBMEIsQ0FBQyxJQUFhO1FBRXRELE9BQU8sRUFBRSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsQ0FBQztJQUNyRSxDQUFDO0lBSEQsZ0VBR0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge0NsYXNzRGVjbGFyYXRpb259IGZyb20gJy4vaG9zdCc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTmFtZWRDbGFzc0RlY2xhcmF0aW9uKG5vZGU6IHRzLk5vZGUpOlxuICAgIG5vZGUgaXMgQ2xhc3NEZWNsYXJhdGlvbjx0cy5DbGFzc0RlY2xhcmF0aW9uPiZ7bmFtZTogdHMuSWRlbnRpZmllcn0ge1xuICByZXR1cm4gdHMuaXNDbGFzc0RlY2xhcmF0aW9uKG5vZGUpICYmIChub2RlLm5hbWUgIT09IHVuZGVmaW5lZCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc05hbWVkRnVuY3Rpb25EZWNsYXJhdGlvbihub2RlOiB0cy5Ob2RlKTpcbiAgICBub2RlIGlzIENsYXNzRGVjbGFyYXRpb248dHMuRnVuY3Rpb25EZWNsYXJhdGlvbj4me25hbWU6IHRzLklkZW50aWZpZXJ9IHtcbiAgcmV0dXJuIHRzLmlzRnVuY3Rpb25EZWNsYXJhdGlvbihub2RlKSAmJiAobm9kZS5uYW1lICE9PSB1bmRlZmluZWQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNOYW1lZFZhcmlhYmxlRGVjbGFyYXRpb24obm9kZTogdHMuTm9kZSk6XG4gICAgbm9kZSBpcyBDbGFzc0RlY2xhcmF0aW9uPHRzLlZhcmlhYmxlRGVjbGFyYXRpb24+JntuYW1lOiB0cy5JZGVudGlmaWVyfSB7XG4gIHJldHVybiB0cy5pc1ZhcmlhYmxlRGVjbGFyYXRpb24obm9kZSkgJiYgKG5vZGUubmFtZSAhPT0gdW5kZWZpbmVkKTtcbn1cbiJdfQ==