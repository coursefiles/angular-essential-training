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
        define("@angular/compiler-cli/src/ngtsc/shims/src/typecheck_shim", ["require", "exports", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ts = require("typescript");
    /**
     * A `ShimGenerator` which adds a type-checking file to the `ts.Program`.
     *
     * This is a requirement for performant template type-checking, as TypeScript will only reuse
     * information in the main program when creating the type-checking program if the set of files in
     * each are exactly the same. Thus, the main program also needs the synthetic type-checking file.
     */
    var TypeCheckShimGenerator = /** @class */ (function () {
        function TypeCheckShimGenerator(typeCheckFile) {
            this.typeCheckFile = typeCheckFile;
        }
        TypeCheckShimGenerator.prototype.recognize = function (fileName) { return fileName === this.typeCheckFile; };
        TypeCheckShimGenerator.prototype.generate = function (genFileName, readFile) {
            return ts.createSourceFile(genFileName, 'export const USED_FOR_NG_TYPE_CHECKING = true;', ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
        };
        return TypeCheckShimGenerator;
    }());
    exports.TypeCheckShimGenerator = TypeCheckShimGenerator;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZWNoZWNrX3NoaW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL3NoaW1zL3NyYy90eXBlY2hlY2tfc2hpbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztJQUVILCtCQUFpQztJQU1qQzs7Ozs7O09BTUc7SUFDSDtRQUNFLGdDQUFvQixhQUE2QjtZQUE3QixrQkFBYSxHQUFiLGFBQWEsQ0FBZ0I7UUFBRyxDQUFDO1FBRXJELDBDQUFTLEdBQVQsVUFBVSxRQUF3QixJQUFhLE9BQU8sUUFBUSxLQUFLLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1FBRXhGLHlDQUFRLEdBQVIsVUFBUyxXQUEyQixFQUFFLFFBQW9EO1lBRXhGLE9BQU8sRUFBRSxDQUFDLGdCQUFnQixDQUN0QixXQUFXLEVBQUUsZ0RBQWdELEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUMzRixFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3hCLENBQUM7UUFDSCw2QkFBQztJQUFELENBQUMsQUFYRCxJQVdDO0lBWFksd0RBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuaW1wb3J0IHtBYnNvbHV0ZUZzUGF0aH0gZnJvbSAnLi4vLi4vcGF0aCc7XG5cbmltcG9ydCB7U2hpbUdlbmVyYXRvcn0gZnJvbSAnLi9ob3N0JztcblxuLyoqXG4gKiBBIGBTaGltR2VuZXJhdG9yYCB3aGljaCBhZGRzIGEgdHlwZS1jaGVja2luZyBmaWxlIHRvIHRoZSBgdHMuUHJvZ3JhbWAuXG4gKlxuICogVGhpcyBpcyBhIHJlcXVpcmVtZW50IGZvciBwZXJmb3JtYW50IHRlbXBsYXRlIHR5cGUtY2hlY2tpbmcsIGFzIFR5cGVTY3JpcHQgd2lsbCBvbmx5IHJldXNlXG4gKiBpbmZvcm1hdGlvbiBpbiB0aGUgbWFpbiBwcm9ncmFtIHdoZW4gY3JlYXRpbmcgdGhlIHR5cGUtY2hlY2tpbmcgcHJvZ3JhbSBpZiB0aGUgc2V0IG9mIGZpbGVzIGluXG4gKiBlYWNoIGFyZSBleGFjdGx5IHRoZSBzYW1lLiBUaHVzLCB0aGUgbWFpbiBwcm9ncmFtIGFsc28gbmVlZHMgdGhlIHN5bnRoZXRpYyB0eXBlLWNoZWNraW5nIGZpbGUuXG4gKi9cbmV4cG9ydCBjbGFzcyBUeXBlQ2hlY2tTaGltR2VuZXJhdG9yIGltcGxlbWVudHMgU2hpbUdlbmVyYXRvciB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgdHlwZUNoZWNrRmlsZTogQWJzb2x1dGVGc1BhdGgpIHt9XG5cbiAgcmVjb2duaXplKGZpbGVOYW1lOiBBYnNvbHV0ZUZzUGF0aCk6IGJvb2xlYW4geyByZXR1cm4gZmlsZU5hbWUgPT09IHRoaXMudHlwZUNoZWNrRmlsZTsgfVxuXG4gIGdlbmVyYXRlKGdlbkZpbGVOYW1lOiBBYnNvbHV0ZUZzUGF0aCwgcmVhZEZpbGU6IChmaWxlTmFtZTogc3RyaW5nKSA9PiB0cy5Tb3VyY2VGaWxlIHwgbnVsbCk6XG4gICAgICB0cy5Tb3VyY2VGaWxlfG51bGwge1xuICAgIHJldHVybiB0cy5jcmVhdGVTb3VyY2VGaWxlKFxuICAgICAgICBnZW5GaWxlTmFtZSwgJ2V4cG9ydCBjb25zdCBVU0VEX0ZPUl9OR19UWVBFX0NIRUNLSU5HID0gdHJ1ZTsnLCB0cy5TY3JpcHRUYXJnZXQuTGF0ZXN0LCB0cnVlLFxuICAgICAgICB0cy5TY3JpcHRLaW5kLlRTKTtcbiAgfVxufVxuIl19