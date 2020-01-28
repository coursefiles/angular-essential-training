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
        define("@angular/compiler-cli/src/ngtsc/imports/src/resolver", ["require", "exports", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ts = require("typescript");
    /**
     * Used by `RouterEntryPointManager` and `NgModuleRouteAnalyzer` (which is in turn is used by
     * `NgModuleDecoratorHandler`) for resolving the module source-files references in lazy-loaded
     * routes (relative to the source-file containing the `NgModule` that provides the route
     * definitions).
     */
    var ModuleResolver = /** @class */ (function () {
        function ModuleResolver(program, compilerOptions, host) {
            this.program = program;
            this.compilerOptions = compilerOptions;
            this.host = host;
        }
        ModuleResolver.prototype.resolveModuleName = function (module, containingFile) {
            var resolved = ts.resolveModuleName(module, containingFile.fileName, this.compilerOptions, this.host)
                .resolvedModule;
            if (resolved === undefined) {
                return null;
            }
            return this.program.getSourceFile(resolved.resolvedFileName) || null;
        };
        return ModuleResolver;
    }());
    exports.ModuleResolver = ModuleResolver;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL2ltcG9ydHMvc3JjL3Jlc29sdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBRUgsK0JBQWlDO0lBU2pDOzs7OztPQUtHO0lBQ0g7UUFDRSx3QkFDWSxPQUFtQixFQUFVLGVBQW1DLEVBQ2hFLElBQXFCO1lBRHJCLFlBQU8sR0FBUCxPQUFPLENBQVk7WUFBVSxvQkFBZSxHQUFmLGVBQWUsQ0FBb0I7WUFDaEUsU0FBSSxHQUFKLElBQUksQ0FBaUI7UUFBRyxDQUFDO1FBRXJDLDBDQUFpQixHQUFqQixVQUFrQixNQUFjLEVBQUUsY0FBNkI7WUFDN0QsSUFBTSxRQUFRLEdBQ1YsRUFBRSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxjQUFjLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQztpQkFDakYsY0FBYyxDQUFDO1lBQ3hCLElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtnQkFDMUIsT0FBTyxJQUFJLENBQUM7YUFDYjtZQUNELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLElBQUksSUFBSSxDQUFDO1FBQ3ZFLENBQUM7UUFDSCxxQkFBQztJQUFELENBQUMsQUFkRCxJQWNDO0lBZFksd0NBQWMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge1JlZmVyZW5jZX0gZnJvbSAnLi9yZWZlcmVuY2VzJztcblxuZXhwb3J0IGludGVyZmFjZSBSZWZlcmVuY2VSZXNvbHZlciB7XG4gIHJlc29sdmUoZGVjbDogdHMuRGVjbGFyYXRpb24sIGltcG9ydEZyb21IaW50OiBzdHJpbmd8bnVsbCwgZnJvbUZpbGU6IHN0cmluZyk6XG4gICAgICBSZWZlcmVuY2U8dHMuRGVjbGFyYXRpb24+O1xufVxuXG4vKipcbiAqIFVzZWQgYnkgYFJvdXRlckVudHJ5UG9pbnRNYW5hZ2VyYCBhbmQgYE5nTW9kdWxlUm91dGVBbmFseXplcmAgKHdoaWNoIGlzIGluIHR1cm4gaXMgdXNlZCBieVxuICogYE5nTW9kdWxlRGVjb3JhdG9ySGFuZGxlcmApIGZvciByZXNvbHZpbmcgdGhlIG1vZHVsZSBzb3VyY2UtZmlsZXMgcmVmZXJlbmNlcyBpbiBsYXp5LWxvYWRlZFxuICogcm91dGVzIChyZWxhdGl2ZSB0byB0aGUgc291cmNlLWZpbGUgY29udGFpbmluZyB0aGUgYE5nTW9kdWxlYCB0aGF0IHByb3ZpZGVzIHRoZSByb3V0ZVxuICogZGVmaW5pdGlvbnMpLlxuICovXG5leHBvcnQgY2xhc3MgTW9kdWxlUmVzb2x2ZXIge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgcHJvZ3JhbTogdHMuUHJvZ3JhbSwgcHJpdmF0ZSBjb21waWxlck9wdGlvbnM6IHRzLkNvbXBpbGVyT3B0aW9ucyxcbiAgICAgIHByaXZhdGUgaG9zdDogdHMuQ29tcGlsZXJIb3N0KSB7fVxuXG4gIHJlc29sdmVNb2R1bGVOYW1lKG1vZHVsZTogc3RyaW5nLCBjb250YWluaW5nRmlsZTogdHMuU291cmNlRmlsZSk6IHRzLlNvdXJjZUZpbGV8bnVsbCB7XG4gICAgY29uc3QgcmVzb2x2ZWQgPVxuICAgICAgICB0cy5yZXNvbHZlTW9kdWxlTmFtZShtb2R1bGUsIGNvbnRhaW5pbmdGaWxlLmZpbGVOYW1lLCB0aGlzLmNvbXBpbGVyT3B0aW9ucywgdGhpcy5ob3N0KVxuICAgICAgICAgICAgLnJlc29sdmVkTW9kdWxlO1xuICAgIGlmIChyZXNvbHZlZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucHJvZ3JhbS5nZXRTb3VyY2VGaWxlKHJlc29sdmVkLnJlc29sdmVkRmlsZU5hbWUpIHx8IG51bGw7XG4gIH1cbn1cbiJdfQ==