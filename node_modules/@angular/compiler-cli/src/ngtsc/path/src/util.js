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
        define("@angular/compiler-cli/src/ngtsc/path/src/util", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //  TODO(alxhub): Unify this file with `util/src/path`.
    var TS_DTS_JS_EXTENSION = /(?:\.d)?\.ts$|\.js$/;
    var ABSOLUTE_PATH = /^([a-zA-Z]:\/|\/)/;
    /**
     * Convert Windows-style separators to POSIX separators.
     */
    function normalizeSeparators(path) {
        // TODO: normalize path only for OS that need it.
        return path.replace(/\\/g, '/');
    }
    exports.normalizeSeparators = normalizeSeparators;
    /**
     * Remove a .ts, .d.ts, or .js extension from a file name.
     */
    function stripExtension(path) {
        return path.replace(TS_DTS_JS_EXTENSION, '');
    }
    exports.stripExtension = stripExtension;
    /**
     * Returns true if the normalized path is an absolute path.
     */
    function isAbsolutePath(path) {
        // TODO: use regExp based on OS in the future
        return ABSOLUTE_PATH.test(path);
    }
    exports.isAbsolutePath = isAbsolutePath;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvcGF0aC9zcmMvdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztJQUVILHVEQUF1RDtJQUV2RCxJQUFNLG1CQUFtQixHQUFHLHFCQUFxQixDQUFDO0lBQ2xELElBQU0sYUFBYSxHQUFHLG1CQUFtQixDQUFDO0lBRTFDOztPQUVHO0lBQ0gsU0FBZ0IsbUJBQW1CLENBQUMsSUFBWTtRQUM5QyxpREFBaUQ7UUFDakQsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBSEQsa0RBR0M7SUFFRDs7T0FFRztJQUNILFNBQWdCLGNBQWMsQ0FBQyxJQUFZO1FBQ3pDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRkQsd0NBRUM7SUFFRDs7T0FFRztJQUNILFNBQWdCLGNBQWMsQ0FBQyxJQUFZO1FBQ3pDLDZDQUE2QztRQUM3QyxPQUFPLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUhELHdDQUdDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vLyAgVE9ETyhhbHhodWIpOiBVbmlmeSB0aGlzIGZpbGUgd2l0aCBgdXRpbC9zcmMvcGF0aGAuXG5cbmNvbnN0IFRTX0RUU19KU19FWFRFTlNJT04gPSAvKD86XFwuZCk/XFwudHMkfFxcLmpzJC87XG5jb25zdCBBQlNPTFVURV9QQVRIID0gL14oW2EtekEtWl06XFwvfFxcLykvO1xuXG4vKipcbiAqIENvbnZlcnQgV2luZG93cy1zdHlsZSBzZXBhcmF0b3JzIHRvIFBPU0lYIHNlcGFyYXRvcnMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVTZXBhcmF0b3JzKHBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG4gIC8vIFRPRE86IG5vcm1hbGl6ZSBwYXRoIG9ubHkgZm9yIE9TIHRoYXQgbmVlZCBpdC5cbiAgcmV0dXJuIHBhdGgucmVwbGFjZSgvXFxcXC9nLCAnLycpO1xufVxuXG4vKipcbiAqIFJlbW92ZSBhIC50cywgLmQudHMsIG9yIC5qcyBleHRlbnNpb24gZnJvbSBhIGZpbGUgbmFtZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0cmlwRXh0ZW5zaW9uKHBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBwYXRoLnJlcGxhY2UoVFNfRFRTX0pTX0VYVEVOU0lPTiwgJycpO1xufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgbm9ybWFsaXplZCBwYXRoIGlzIGFuIGFic29sdXRlIHBhdGguXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Fic29sdXRlUGF0aChwYXRoOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgLy8gVE9ETzogdXNlIHJlZ0V4cCBiYXNlZCBvbiBPUyBpbiB0aGUgZnV0dXJlXG4gIHJldHVybiBBQlNPTFVURV9QQVRILnRlc3QocGF0aCk7XG59XG4iXX0=