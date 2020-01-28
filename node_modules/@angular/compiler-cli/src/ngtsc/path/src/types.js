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
        define("@angular/compiler-cli/src/ngtsc/path/src/types", ["require", "exports", "@angular/compiler-cli/src/ngtsc/path/src/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require("@angular/compiler-cli/src/ngtsc/path/src/util");
    /**
     * Contains utility functions for creating and manipulating `AbsoluteFsPath`s.
     */
    exports.AbsoluteFsPath = {
        /**
         * Convert the path `str` to an `AbsoluteFsPath`, throwing an error if it's not an absolute path.
         */
        from: function (str) {
            var normalized = util_1.normalizeSeparators(str);
            if (!util_1.isAbsolutePath(normalized)) {
                throw new Error("Internal Error: AbsoluteFsPath.from(" + str + "): path is not absolute");
            }
            return normalized;
        },
        /**
         * Assume that the path `str` is an `AbsoluteFsPath` in the correct format already.
         */
        fromUnchecked: function (str) { return str; },
        /**
         * Extract an `AbsoluteFsPath` from a `ts.SourceFile`.
         *
         * This is cheaper than calling `AbsoluteFsPath.from(sf.fileName)`, as source files already have
         * their file path in absolute POSIX format.
         */
        fromSourceFile: function (sf) {
            // ts.SourceFile paths are always absolute.
            return sf.fileName;
        },
    };
    /**
     * Contains utility functions for creating and manipulating `PathSegment`s.
     */
    exports.PathSegment = {
        /**
         * Convert the path `str` to a `PathSegment`, throwing an error if it's not a relative path.
         */
        fromFsPath: function (str) {
            var normalized = util_1.normalizeSeparators(str);
            if (util_1.isAbsolutePath(normalized)) {
                throw new Error("Internal Error: PathSegment.fromFsPath(" + str + "): path is not relative");
            }
            return normalized;
        },
        /**
         * Convert the path `str` to a `PathSegment`, while assuming that `str` is already normalized.
         */
        fromUnchecked: function (str) { return str; },
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL3BhdGgvc3JjL3R5cGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBSUgsc0VBQTJEO0lBd0IzRDs7T0FFRztJQUNVLFFBQUEsY0FBYyxHQUFHO1FBQzVCOztXQUVHO1FBQ0gsSUFBSSxFQUFFLFVBQVMsR0FBVztZQUN4QixJQUFNLFVBQVUsR0FBRywwQkFBbUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM1QyxJQUFJLENBQUMscUJBQWMsQ0FBQyxVQUFVLENBQUMsRUFBRTtnQkFDL0IsTUFBTSxJQUFJLEtBQUssQ0FBQyx5Q0FBdUMsR0FBRyw0QkFBeUIsQ0FBQyxDQUFDO2FBQ3RGO1lBQ0QsT0FBTyxVQUE0QixDQUFDO1FBQ3RDLENBQUM7UUFFRDs7V0FFRztRQUNILGFBQWEsRUFBRSxVQUFTLEdBQVcsSUFBb0IsT0FBTyxHQUFxQixDQUFDLENBQUEsQ0FBQztRQUVyRjs7Ozs7V0FLRztRQUNILGNBQWMsRUFBRSxVQUFTLEVBQWlCO1lBQ3hDLDJDQUEyQztZQUMzQyxPQUFPLEVBQUUsQ0FBQyxRQUEwQixDQUFDO1FBQ3ZDLENBQUM7S0FDRixDQUFDO0lBRUY7O09BRUc7SUFDVSxRQUFBLFdBQVcsR0FBRztRQUN6Qjs7V0FFRztRQUNILFVBQVUsRUFBRSxVQUFTLEdBQVc7WUFDOUIsSUFBTSxVQUFVLEdBQUcsMEJBQW1CLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDNUMsSUFBSSxxQkFBYyxDQUFDLFVBQVUsQ0FBQyxFQUFFO2dCQUM5QixNQUFNLElBQUksS0FBSyxDQUFDLDRDQUEwQyxHQUFHLDRCQUF5QixDQUFDLENBQUM7YUFDekY7WUFDRCxPQUFPLFVBQXlCLENBQUM7UUFDbkMsQ0FBQztRQUVEOztXQUVHO1FBQ0gsYUFBYSxFQUFFLFVBQVMsR0FBVyxJQUFpQixPQUFPLEdBQWtCLENBQUMsQ0FBQSxDQUFDO0tBQ2hGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge2lzQWJzb2x1dGVQYXRoLCBub3JtYWxpemVTZXBhcmF0b3JzfSBmcm9tICcuL3V0aWwnO1xuXG4vKipcbiAqIEEgYHN0cmluZ2AgcmVwcmVzZW50aW5nIGEgc3BlY2lmaWMgdHlwZSBvZiBwYXRoLCB3aXRoIGEgcGFydGljdWxhciBicmFuZCBgQmAuXG4gKlxuICogQSBgc3RyaW5nYCBpcyBub3QgYXNzaWduYWJsZSB0byBhIGBCcmFuZGVkUGF0aGAsIGJ1dCBhIGBCcmFuZGVkUGF0aGAgaXMgYXNzaWduYWJsZSB0byBhIGBzdHJpbmdgLlxuICogVHdvIGBCcmFuZGVkUGF0aGBzIHdpdGggZGlmZmVyZW50IGJyYW5kcyBhcmUgbm90IG11dHVhbGx5IGFzc2lnbmFibGUuXG4gKi9cbmV4cG9ydCB0eXBlIEJyYW5kZWRQYXRoPEIgZXh0ZW5kcyBzdHJpbmc+ID0gc3RyaW5nICYge1xuICBfYnJhbmQ6IEI7XG59O1xuXG4vKipcbiAqIEEgZnVsbHkgcXVhbGlmaWVkIHBhdGggaW4gdGhlIGZpbGUgc3lzdGVtLCBpbiBQT1NJWCBmb3JtLlxuICovXG5leHBvcnQgdHlwZSBBYnNvbHV0ZUZzUGF0aCA9IEJyYW5kZWRQYXRoPCdBYnNvbHV0ZUZzUGF0aCc+O1xuXG4vKipcbiAqIEEgcGF0aCB0aGF0J3MgcmVsYXRpdmUgdG8gYW5vdGhlciAodW5zcGVjaWZpZWQpIHJvb3QuXG4gKlxuICogVGhpcyBkb2VzIG5vdCBuZWNlc3NhcmlseSBoYXZlIHRvIHJlZmVyIHRvIGEgcGh5c2ljYWwgZmlsZS5cbiAqL1xuZXhwb3J0IHR5cGUgUGF0aFNlZ21lbnQgPSBCcmFuZGVkUGF0aDwnUGF0aFNlZ21lbnQnPjtcblxuLyoqXG4gKiBDb250YWlucyB1dGlsaXR5IGZ1bmN0aW9ucyBmb3IgY3JlYXRpbmcgYW5kIG1hbmlwdWxhdGluZyBgQWJzb2x1dGVGc1BhdGhgcy5cbiAqL1xuZXhwb3J0IGNvbnN0IEFic29sdXRlRnNQYXRoID0ge1xuICAvKipcbiAgICogQ29udmVydCB0aGUgcGF0aCBgc3RyYCB0byBhbiBgQWJzb2x1dGVGc1BhdGhgLCB0aHJvd2luZyBhbiBlcnJvciBpZiBpdCdzIG5vdCBhbiBhYnNvbHV0ZSBwYXRoLlxuICAgKi9cbiAgZnJvbTogZnVuY3Rpb24oc3RyOiBzdHJpbmcpOiBBYnNvbHV0ZUZzUGF0aCB7XG4gICAgY29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZVNlcGFyYXRvcnMoc3RyKTtcbiAgICBpZiAoIWlzQWJzb2x1dGVQYXRoKG5vcm1hbGl6ZWQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludGVybmFsIEVycm9yOiBBYnNvbHV0ZUZzUGF0aC5mcm9tKCR7c3RyfSk6IHBhdGggaXMgbm90IGFic29sdXRlYCk7XG4gICAgfVxuICAgIHJldHVybiBub3JtYWxpemVkIGFzIEFic29sdXRlRnNQYXRoO1xuICB9LFxuXG4gIC8qKlxuICAgKiBBc3N1bWUgdGhhdCB0aGUgcGF0aCBgc3RyYCBpcyBhbiBgQWJzb2x1dGVGc1BhdGhgIGluIHRoZSBjb3JyZWN0IGZvcm1hdCBhbHJlYWR5LlxuICAgKi9cbiAgZnJvbVVuY2hlY2tlZDogZnVuY3Rpb24oc3RyOiBzdHJpbmcpOiBBYnNvbHV0ZUZzUGF0aCB7IHJldHVybiBzdHIgYXMgQWJzb2x1dGVGc1BhdGg7fSxcblxuICAvKipcbiAgICogRXh0cmFjdCBhbiBgQWJzb2x1dGVGc1BhdGhgIGZyb20gYSBgdHMuU291cmNlRmlsZWAuXG4gICAqXG4gICAqIFRoaXMgaXMgY2hlYXBlciB0aGFuIGNhbGxpbmcgYEFic29sdXRlRnNQYXRoLmZyb20oc2YuZmlsZU5hbWUpYCwgYXMgc291cmNlIGZpbGVzIGFscmVhZHkgaGF2ZVxuICAgKiB0aGVpciBmaWxlIHBhdGggaW4gYWJzb2x1dGUgUE9TSVggZm9ybWF0LlxuICAgKi9cbiAgZnJvbVNvdXJjZUZpbGU6IGZ1bmN0aW9uKHNmOiB0cy5Tb3VyY2VGaWxlKTogQWJzb2x1dGVGc1BhdGgge1xuICAgIC8vIHRzLlNvdXJjZUZpbGUgcGF0aHMgYXJlIGFsd2F5cyBhYnNvbHV0ZS5cbiAgICByZXR1cm4gc2YuZmlsZU5hbWUgYXMgQWJzb2x1dGVGc1BhdGg7XG4gIH0sXG59O1xuXG4vKipcbiAqIENvbnRhaW5zIHV0aWxpdHkgZnVuY3Rpb25zIGZvciBjcmVhdGluZyBhbmQgbWFuaXB1bGF0aW5nIGBQYXRoU2VnbWVudGBzLlxuICovXG5leHBvcnQgY29uc3QgUGF0aFNlZ21lbnQgPSB7XG4gIC8qKlxuICAgKiBDb252ZXJ0IHRoZSBwYXRoIGBzdHJgIHRvIGEgYFBhdGhTZWdtZW50YCwgdGhyb3dpbmcgYW4gZXJyb3IgaWYgaXQncyBub3QgYSByZWxhdGl2ZSBwYXRoLlxuICAgKi9cbiAgZnJvbUZzUGF0aDogZnVuY3Rpb24oc3RyOiBzdHJpbmcpOiBQYXRoU2VnbWVudCB7XG4gICAgY29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZVNlcGFyYXRvcnMoc3RyKTtcbiAgICBpZiAoaXNBYnNvbHV0ZVBhdGgobm9ybWFsaXplZCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW50ZXJuYWwgRXJyb3I6IFBhdGhTZWdtZW50LmZyb21Gc1BhdGgoJHtzdHJ9KTogcGF0aCBpcyBub3QgcmVsYXRpdmVgKTtcbiAgICB9XG4gICAgcmV0dXJuIG5vcm1hbGl6ZWQgYXMgUGF0aFNlZ21lbnQ7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENvbnZlcnQgdGhlIHBhdGggYHN0cmAgdG8gYSBgUGF0aFNlZ21lbnRgLCB3aGlsZSBhc3N1bWluZyB0aGF0IGBzdHJgIGlzIGFscmVhZHkgbm9ybWFsaXplZC5cbiAgICovXG4gIGZyb21VbmNoZWNrZWQ6IGZ1bmN0aW9uKHN0cjogc3RyaW5nKTogUGF0aFNlZ21lbnQgeyByZXR1cm4gc3RyIGFzIFBhdGhTZWdtZW50O30sXG59O1xuIl19