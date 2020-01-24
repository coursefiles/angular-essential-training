(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/packages/entry_point_bundle", ["require", "exports", "canonical-path", "typescript", "@angular/compiler-cli/src/ngtsc/path", "@angular/compiler-cli/ngcc/src/packages/bundle_program"], factory);
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
    var canonical_path_1 = require("canonical-path");
    var ts = require("typescript");
    var path_1 = require("@angular/compiler-cli/src/ngtsc/path");
    var bundle_program_1 = require("@angular/compiler-cli/ngcc/src/packages/bundle_program");
    /**
     * Get an object that describes a formatted bundle for an entry-point.
     * @param entryPointPath The path to the entry-point that contains the bundle.
     * @param formatPath The path to the source files for this bundle.
     * @param typingsPath The path to the typings files if we should transform them with this bundle.
     * @param isCore This entry point is the Angular core package.
     * @param format The underlying format of the bundle.
     * @param transformDts Whether to transform the typings along with this bundle.
     */
    function makeEntryPointBundle(entryPointPath, formatPath, typingsPath, isCore, formatProperty, format, transformDts) {
        // Create the TS program and necessary helpers.
        var options = {
            allowJs: true,
            maxNodeModuleJsDepth: Infinity,
            rootDir: entryPointPath,
        };
        var host = ts.createCompilerHost(options);
        var rootDirs = [path_1.AbsoluteFsPath.from(entryPointPath)];
        // Create the bundle programs, as necessary.
        var src = bundle_program_1.makeBundleProgram(isCore, canonical_path_1.resolve(entryPointPath, formatPath), 'r3_symbols.js', options, host);
        var dts = transformDts ?
            bundle_program_1.makeBundleProgram(isCore, canonical_path_1.resolve(entryPointPath, typingsPath), 'r3_symbols.d.ts', options, host) :
            null;
        var isFlatCore = isCore && src.r3SymbolsFile === null;
        return { format: format, formatProperty: formatProperty, rootDirs: rootDirs, isCore: isCore, isFlatCore: isFlatCore, src: src, dts: dts };
    }
    exports.makeEntryPointBundle = makeEntryPointBundle;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50cnlfcG9pbnRfYnVuZGxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL25nY2Mvc3JjL3BhY2thZ2VzL2VudHJ5X3BvaW50X2J1bmRsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILGlEQUF1QztJQUN2QywrQkFBaUM7SUFFakMsNkRBQXVEO0lBQ3ZELHlGQUFrRTtJQW1CbEU7Ozs7Ozs7O09BUUc7SUFDSCxTQUFnQixvQkFBb0IsQ0FDaEMsY0FBc0IsRUFBRSxVQUFrQixFQUFFLFdBQW1CLEVBQUUsTUFBZSxFQUNoRixjQUFzQyxFQUFFLE1BQXdCLEVBQ2hFLFlBQXFCO1FBQ3ZCLCtDQUErQztRQUMvQyxJQUFNLE9BQU8sR0FBdUI7WUFDbEMsT0FBTyxFQUFFLElBQUk7WUFDYixvQkFBb0IsRUFBRSxRQUFRO1lBQzlCLE9BQU8sRUFBRSxjQUFjO1NBQ3hCLENBQUM7UUFDRixJQUFNLElBQUksR0FBRyxFQUFFLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDNUMsSUFBTSxRQUFRLEdBQUcsQ0FBQyxxQkFBYyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1FBRXZELDRDQUE0QztRQUM1QyxJQUFNLEdBQUcsR0FBRyxrQ0FBaUIsQ0FDekIsTUFBTSxFQUFFLHdCQUFPLENBQUMsY0FBYyxFQUFFLFVBQVUsQ0FBQyxFQUFFLGVBQWUsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDakYsSUFBTSxHQUFHLEdBQUcsWUFBWSxDQUFDLENBQUM7WUFDdEIsa0NBQWlCLENBQ2IsTUFBTSxFQUFFLHdCQUFPLENBQUMsY0FBYyxFQUFFLFdBQVcsQ0FBQyxFQUFFLGlCQUFpQixFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3JGLElBQUksQ0FBQztRQUNULElBQU0sVUFBVSxHQUFHLE1BQU0sSUFBSSxHQUFHLENBQUMsYUFBYSxLQUFLLElBQUksQ0FBQztRQUV4RCxPQUFPLEVBQUMsTUFBTSxRQUFBLEVBQUUsY0FBYyxnQkFBQSxFQUFFLFFBQVEsVUFBQSxFQUFFLE1BQU0sUUFBQSxFQUFFLFVBQVUsWUFBQSxFQUFFLEdBQUcsS0FBQSxFQUFFLEdBQUcsS0FBQSxFQUFDLENBQUM7SUFDMUUsQ0FBQztJQXZCRCxvREF1QkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge3Jlc29sdmV9IGZyb20gJ2Nhbm9uaWNhbC1wYXRoJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge0Fic29sdXRlRnNQYXRofSBmcm9tICcuLi8uLi8uLi9zcmMvbmd0c2MvcGF0aCc7XG5pbXBvcnQge0J1bmRsZVByb2dyYW0sIG1ha2VCdW5kbGVQcm9ncmFtfSBmcm9tICcuL2J1bmRsZV9wcm9ncmFtJztcbmltcG9ydCB7RW50cnlQb2ludEZvcm1hdCwgRW50cnlQb2ludEpzb25Qcm9wZXJ0eX0gZnJvbSAnLi9lbnRyeV9wb2ludCc7XG5cblxuXG4vKipcbiAqIEEgYnVuZGxlIG9mIGZpbGVzIGFuZCBwYXRocyAoYW5kIFRTIHByb2dyYW1zKSB0aGF0IGNvcnJlc3BvbmQgdG8gYSBwYXJ0aWN1bGFyXG4gKiBmb3JtYXQgb2YgYSBwYWNrYWdlIGVudHJ5LXBvaW50LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEVudHJ5UG9pbnRCdW5kbGUge1xuICBmb3JtYXRQcm9wZXJ0eTogRW50cnlQb2ludEpzb25Qcm9wZXJ0eTtcbiAgZm9ybWF0OiBFbnRyeVBvaW50Rm9ybWF0O1xuICBpc0NvcmU6IGJvb2xlYW47XG4gIGlzRmxhdENvcmU6IGJvb2xlYW47XG4gIHJvb3REaXJzOiBBYnNvbHV0ZUZzUGF0aFtdO1xuICBzcmM6IEJ1bmRsZVByb2dyYW07XG4gIGR0czogQnVuZGxlUHJvZ3JhbXxudWxsO1xufVxuXG4vKipcbiAqIEdldCBhbiBvYmplY3QgdGhhdCBkZXNjcmliZXMgYSBmb3JtYXR0ZWQgYnVuZGxlIGZvciBhbiBlbnRyeS1wb2ludC5cbiAqIEBwYXJhbSBlbnRyeVBvaW50UGF0aCBUaGUgcGF0aCB0byB0aGUgZW50cnktcG9pbnQgdGhhdCBjb250YWlucyB0aGUgYnVuZGxlLlxuICogQHBhcmFtIGZvcm1hdFBhdGggVGhlIHBhdGggdG8gdGhlIHNvdXJjZSBmaWxlcyBmb3IgdGhpcyBidW5kbGUuXG4gKiBAcGFyYW0gdHlwaW5nc1BhdGggVGhlIHBhdGggdG8gdGhlIHR5cGluZ3MgZmlsZXMgaWYgd2Ugc2hvdWxkIHRyYW5zZm9ybSB0aGVtIHdpdGggdGhpcyBidW5kbGUuXG4gKiBAcGFyYW0gaXNDb3JlIFRoaXMgZW50cnkgcG9pbnQgaXMgdGhlIEFuZ3VsYXIgY29yZSBwYWNrYWdlLlxuICogQHBhcmFtIGZvcm1hdCBUaGUgdW5kZXJseWluZyBmb3JtYXQgb2YgdGhlIGJ1bmRsZS5cbiAqIEBwYXJhbSB0cmFuc2Zvcm1EdHMgV2hldGhlciB0byB0cmFuc2Zvcm0gdGhlIHR5cGluZ3MgYWxvbmcgd2l0aCB0aGlzIGJ1bmRsZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1ha2VFbnRyeVBvaW50QnVuZGxlKFxuICAgIGVudHJ5UG9pbnRQYXRoOiBzdHJpbmcsIGZvcm1hdFBhdGg6IHN0cmluZywgdHlwaW5nc1BhdGg6IHN0cmluZywgaXNDb3JlOiBib29sZWFuLFxuICAgIGZvcm1hdFByb3BlcnR5OiBFbnRyeVBvaW50SnNvblByb3BlcnR5LCBmb3JtYXQ6IEVudHJ5UG9pbnRGb3JtYXQsXG4gICAgdHJhbnNmb3JtRHRzOiBib29sZWFuKTogRW50cnlQb2ludEJ1bmRsZXxudWxsIHtcbiAgLy8gQ3JlYXRlIHRoZSBUUyBwcm9ncmFtIGFuZCBuZWNlc3NhcnkgaGVscGVycy5cbiAgY29uc3Qgb3B0aW9uczogdHMuQ29tcGlsZXJPcHRpb25zID0ge1xuICAgIGFsbG93SnM6IHRydWUsXG4gICAgbWF4Tm9kZU1vZHVsZUpzRGVwdGg6IEluZmluaXR5LFxuICAgIHJvb3REaXI6IGVudHJ5UG9pbnRQYXRoLFxuICB9O1xuICBjb25zdCBob3N0ID0gdHMuY3JlYXRlQ29tcGlsZXJIb3N0KG9wdGlvbnMpO1xuICBjb25zdCByb290RGlycyA9IFtBYnNvbHV0ZUZzUGF0aC5mcm9tKGVudHJ5UG9pbnRQYXRoKV07XG5cbiAgLy8gQ3JlYXRlIHRoZSBidW5kbGUgcHJvZ3JhbXMsIGFzIG5lY2Vzc2FyeS5cbiAgY29uc3Qgc3JjID0gbWFrZUJ1bmRsZVByb2dyYW0oXG4gICAgICBpc0NvcmUsIHJlc29sdmUoZW50cnlQb2ludFBhdGgsIGZvcm1hdFBhdGgpLCAncjNfc3ltYm9scy5qcycsIG9wdGlvbnMsIGhvc3QpO1xuICBjb25zdCBkdHMgPSB0cmFuc2Zvcm1EdHMgP1xuICAgICAgbWFrZUJ1bmRsZVByb2dyYW0oXG4gICAgICAgICAgaXNDb3JlLCByZXNvbHZlKGVudHJ5UG9pbnRQYXRoLCB0eXBpbmdzUGF0aCksICdyM19zeW1ib2xzLmQudHMnLCBvcHRpb25zLCBob3N0KSA6XG4gICAgICBudWxsO1xuICBjb25zdCBpc0ZsYXRDb3JlID0gaXNDb3JlICYmIHNyYy5yM1N5bWJvbHNGaWxlID09PSBudWxsO1xuXG4gIHJldHVybiB7Zm9ybWF0LCBmb3JtYXRQcm9wZXJ0eSwgcm9vdERpcnMsIGlzQ29yZSwgaXNGbGF0Q29yZSwgc3JjLCBkdHN9O1xufVxuIl19