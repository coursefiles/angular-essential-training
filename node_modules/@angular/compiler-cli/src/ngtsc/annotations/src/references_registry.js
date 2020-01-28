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
        define("@angular/compiler-cli/src/ngtsc/annotations/src/references_registry", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * This registry does nothing, since ngtsc does not currently need
     * this functionality.
     * The ngcc tool implements a working version for its purposes.
     */
    var NoopReferencesRegistry = /** @class */ (function () {
        function NoopReferencesRegistry() {
        }
        NoopReferencesRegistry.prototype.add = function (source) {
            var references = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                references[_i - 1] = arguments[_i];
            }
        };
        return NoopReferencesRegistry;
    }());
    exports.NoopReferencesRegistry = NoopReferencesRegistry;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmZXJlbmNlc19yZWdpc3RyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvYW5ub3RhdGlvbnMvc3JjL3JlZmVyZW5jZXNfcmVnaXN0cnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFrQkg7Ozs7T0FJRztJQUNIO1FBQUE7UUFFQSxDQUFDO1FBREMsb0NBQUcsR0FBSCxVQUFJLE1BQXNCO1lBQUUsb0JBQTBDO2lCQUExQyxVQUEwQyxFQUExQyxxQkFBMEMsRUFBMUMsSUFBMEM7Z0JBQTFDLG1DQUEwQzs7UUFBUyxDQUFDO1FBQ2xGLDZCQUFDO0lBQUQsQ0FBQyxBQUZELElBRUM7SUFGWSx3REFBc0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuaW1wb3J0IHtSZWZlcmVuY2V9IGZyb20gJy4uLy4uL2ltcG9ydHMnO1xuaW1wb3J0IHtEZWNsYXJhdGlvbn0gZnJvbSAnLi4vLi4vcmVmbGVjdGlvbic7XG5cbi8qKlxuICogSW1wbGVtZW50IHRoaXMgaW50ZXJmYWNlIGlmIHlvdSB3YW50IERlY29yYXRvckhhbmRsZXJzIHRvIHJlZ2lzdGVyXG4gKiByZWZlcmVuY2VzIHRoYXQgdGhleSBmaW5kIGluIHRoZWlyIGFuYWx5c2lzIG9mIHRoZSBjb2RlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJlZmVyZW5jZXNSZWdpc3RyeSB7XG4gIC8qKlxuICAgKiBSZWdpc3RlciBvbmUgb3IgbW9yZSByZWZlcmVuY2VzIGluIHRoZSByZWdpc3RyeS5cbiAgICogQHBhcmFtIHJlZmVyZW5jZXMgQSBjb2xsZWN0aW9uIG9mIHJlZmVyZW5jZXMgdG8gcmVnaXN0ZXIuXG4gICAqL1xuICBhZGQoc291cmNlOiB0cy5EZWNsYXJhdGlvbiwgLi4ucmVmZXJlbmNlczogUmVmZXJlbmNlPHRzLkRlY2xhcmF0aW9uPltdKTogdm9pZDtcbn1cblxuLyoqXG4gKiBUaGlzIHJlZ2lzdHJ5IGRvZXMgbm90aGluZywgc2luY2Ugbmd0c2MgZG9lcyBub3QgY3VycmVudGx5IG5lZWRcbiAqIHRoaXMgZnVuY3Rpb25hbGl0eS5cbiAqIFRoZSBuZ2NjIHRvb2wgaW1wbGVtZW50cyBhIHdvcmtpbmcgdmVyc2lvbiBmb3IgaXRzIHB1cnBvc2VzLlxuICovXG5leHBvcnQgY2xhc3MgTm9vcFJlZmVyZW5jZXNSZWdpc3RyeSBpbXBsZW1lbnRzIFJlZmVyZW5jZXNSZWdpc3RyeSB7XG4gIGFkZChzb3VyY2U6IHRzLkRlY2xhcmF0aW9uLCAuLi5yZWZlcmVuY2VzOiBSZWZlcmVuY2U8dHMuRGVjbGFyYXRpb24+W10pOiB2b2lkIHt9XG59Il19