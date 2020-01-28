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
        define("@angular/compiler-cli/ngcc/src/main", ["require", "exports", "tslib", "canonical-path", "fs", "@angular/compiler-cli/src/ngtsc/path", "@angular/compiler-cli/ngcc/src/logging/console_logger", "@angular/compiler-cli/ngcc/src/packages/build_marker", "@angular/compiler-cli/ngcc/src/packages/dependency_host", "@angular/compiler-cli/ngcc/src/packages/dependency_resolver", "@angular/compiler-cli/ngcc/src/packages/entry_point", "@angular/compiler-cli/ngcc/src/packages/entry_point_bundle", "@angular/compiler-cli/ngcc/src/packages/entry_point_finder", "@angular/compiler-cli/ngcc/src/packages/transformer", "@angular/compiler-cli/ngcc/src/writing/in_place_file_writer", "@angular/compiler-cli/ngcc/src/writing/new_entry_point_file_writer"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var canonical_path_1 = require("canonical-path");
    var fs_1 = require("fs");
    var path_1 = require("@angular/compiler-cli/src/ngtsc/path");
    var console_logger_1 = require("@angular/compiler-cli/ngcc/src/logging/console_logger");
    var build_marker_1 = require("@angular/compiler-cli/ngcc/src/packages/build_marker");
    var dependency_host_1 = require("@angular/compiler-cli/ngcc/src/packages/dependency_host");
    var dependency_resolver_1 = require("@angular/compiler-cli/ngcc/src/packages/dependency_resolver");
    var entry_point_1 = require("@angular/compiler-cli/ngcc/src/packages/entry_point");
    var entry_point_bundle_1 = require("@angular/compiler-cli/ngcc/src/packages/entry_point_bundle");
    var entry_point_finder_1 = require("@angular/compiler-cli/ngcc/src/packages/entry_point_finder");
    var transformer_1 = require("@angular/compiler-cli/ngcc/src/packages/transformer");
    var in_place_file_writer_1 = require("@angular/compiler-cli/ngcc/src/writing/in_place_file_writer");
    var new_entry_point_file_writer_1 = require("@angular/compiler-cli/ngcc/src/writing/new_entry_point_file_writer");
    var SUPPORTED_FORMATS = ['esm5', 'esm2015'];
    /**
     * This is the main entry-point into ngcc (aNGular Compatibility Compiler).
     *
     * You can call this function to process one or more npm packages, to ensure
     * that they are compatible with the ivy compiler (ngtsc).
     *
     * @param options The options telling ngcc what to compile and how.
     */
    function mainNgcc(_a) {
        var basePath = _a.basePath, targetEntryPointPath = _a.targetEntryPointPath, _b = _a.propertiesToConsider, propertiesToConsider = _b === void 0 ? entry_point_1.SUPPORTED_FORMAT_PROPERTIES : _b, _c = _a.compileAllFormats, compileAllFormats = _c === void 0 ? true : _c, _d = _a.createNewEntryPointFormats, createNewEntryPointFormats = _d === void 0 ? false : _d, _e = _a.logger, logger = _e === void 0 ? new console_logger_1.ConsoleLogger(console_logger_1.LogLevel.info) : _e;
        var transformer = new transformer_1.Transformer(logger, basePath);
        var host = new dependency_host_1.DependencyHost();
        var resolver = new dependency_resolver_1.DependencyResolver(logger, host);
        var finder = new entry_point_finder_1.EntryPointFinder(logger, resolver);
        var fileWriter = getFileWriter(createNewEntryPointFormats);
        var absoluteTargetEntryPointPath = targetEntryPointPath ?
            path_1.AbsoluteFsPath.from(canonical_path_1.resolve(basePath, targetEntryPointPath)) :
            undefined;
        if (absoluteTargetEntryPointPath &&
            hasProcessedTargetEntryPoint(absoluteTargetEntryPointPath, propertiesToConsider, compileAllFormats)) {
            logger.debug('The target entry-point has already been processed');
            return;
        }
        var entryPoints = finder.findEntryPoints(path_1.AbsoluteFsPath.from(basePath), absoluteTargetEntryPointPath).entryPoints;
        if (absoluteTargetEntryPointPath && entryPoints.every(function (entryPoint) {
            return entryPoint.path !== absoluteTargetEntryPointPath;
        })) {
            // If we get here, then the requested entry-point did not contain anything compiled by
            // the old Angular compiler. Therefore there is nothing for ngcc to do.
            // So mark all formats in this entry-point as processed so that clients of ngcc can avoid
            // triggering ngcc for this entry-point in the future.
            var packageJsonPath_1 = path_1.AbsoluteFsPath.from(canonical_path_1.resolve(absoluteTargetEntryPointPath, 'package.json'));
            var packageJson_1 = JSON.parse(fs_1.readFileSync(packageJsonPath_1, 'utf8'));
            propertiesToConsider.forEach(function (formatProperty) {
                if (packageJson_1[formatProperty])
                    build_marker_1.markAsProcessed(packageJson_1, packageJsonPath_1, formatProperty);
            });
            return;
        }
        entryPoints.forEach(function (entryPoint) {
            // Are we compiling the Angular core?
            var isCore = entryPoint.name === '@angular/core';
            var compiledFormats = new Set();
            var entryPointPackageJson = entryPoint.packageJson;
            var entryPointPackageJsonPath = path_1.AbsoluteFsPath.from(canonical_path_1.resolve(entryPoint.path, 'package.json'));
            var hasProcessedDts = build_marker_1.hasBeenProcessed(entryPointPackageJson, 'typings');
            for (var i = 0; i < propertiesToConsider.length; i++) {
                var property = propertiesToConsider[i];
                var formatPath = entryPointPackageJson[property];
                var format = entry_point_1.getEntryPointFormat(property);
                // No format then this property is not supposed to be compiled.
                if (!formatPath || !format || SUPPORTED_FORMATS.indexOf(format) === -1)
                    continue;
                if (build_marker_1.hasBeenProcessed(entryPointPackageJson, property)) {
                    compiledFormats.add(formatPath);
                    logger.debug("Skipping " + entryPoint.name + " : " + property + " (already compiled).");
                    continue;
                }
                var isFirstFormat = compiledFormats.size === 0;
                var processDts = !hasProcessedDts && isFirstFormat;
                // We don't break if this if statement fails because we still want to mark
                // the property as processed even if its underlying format has been built already.
                if (!compiledFormats.has(formatPath) && (compileAllFormats || isFirstFormat)) {
                    var bundle = entry_point_bundle_1.makeEntryPointBundle(entryPoint.path, formatPath, entryPoint.typings, isCore, property, format, processDts);
                    if (bundle) {
                        logger.info("Compiling " + entryPoint.name + " : " + property + " as " + format);
                        var transformedFiles = transformer.transform(bundle);
                        fileWriter.writeBundle(entryPoint, bundle, transformedFiles);
                        compiledFormats.add(formatPath);
                    }
                    else {
                        logger.warn("Skipping " + entryPoint.name + " : " + format + " (no valid entry point file for this format).");
                    }
                }
                else if (!compileAllFormats) {
                    logger.debug("Skipping " + entryPoint.name + " : " + property + " (already compiled).");
                }
                // Either this format was just compiled or its underlying format was compiled because of a
                // previous property.
                if (compiledFormats.has(formatPath)) {
                    build_marker_1.markAsProcessed(entryPointPackageJson, entryPointPackageJsonPath, property);
                    if (processDts) {
                        build_marker_1.markAsProcessed(entryPointPackageJson, entryPointPackageJsonPath, 'typings');
                    }
                }
            }
            if (compiledFormats.size === 0) {
                throw new Error("Failed to compile any formats for entry-point at (" + entryPoint.path + "). Tried " + propertiesToConsider + ".");
            }
        });
    }
    exports.mainNgcc = mainNgcc;
    function getFileWriter(createNewEntryPointFormats) {
        return createNewEntryPointFormats ? new new_entry_point_file_writer_1.NewEntryPointFileWriter() : new in_place_file_writer_1.InPlaceFileWriter();
    }
    function hasProcessedTargetEntryPoint(targetPath, propertiesToConsider, compileAllFormats) {
        var e_1, _a;
        var packageJsonPath = path_1.AbsoluteFsPath.from(canonical_path_1.resolve(targetPath, 'package.json'));
        var packageJson = JSON.parse(fs_1.readFileSync(packageJsonPath, 'utf8'));
        try {
            for (var propertiesToConsider_1 = tslib_1.__values(propertiesToConsider), propertiesToConsider_1_1 = propertiesToConsider_1.next(); !propertiesToConsider_1_1.done; propertiesToConsider_1_1 = propertiesToConsider_1.next()) {
                var property = propertiesToConsider_1_1.value;
                if (packageJson[property]) {
                    // Here is a property that should be processed
                    if (build_marker_1.hasBeenProcessed(packageJson, property)) {
                        if (!compileAllFormats) {
                            // It has been processed and we only need one, so we are done.
                            return true;
                        }
                    }
                    else {
                        // It has not been processed but we need all of them, so we are done.
                        return false;
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (propertiesToConsider_1_1 && !propertiesToConsider_1_1.done && (_a = propertiesToConsider_1.return)) _a.call(propertiesToConsider_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // Either all formats need to be compiled and there were none that were unprocessed,
        // Or only the one matching format needs to be compiled but there was at least one matching
        // property before the first processed format that was unprocessed.
        return true;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9uZ2NjL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7OztJQUVILGlEQUF1QztJQUN2Qyx5QkFBZ0M7SUFFaEMsNkRBQW9EO0lBRXBELHdGQUFpRTtJQUVqRSxxRkFBMEU7SUFDMUUsMkZBQTBEO0lBQzFELG1HQUFrRTtJQUNsRSxtRkFBa0k7SUFDbEksaUdBQW1FO0lBQ25FLGlHQUErRDtJQUMvRCxtRkFBbUQ7SUFFbkQsb0dBQWlFO0lBQ2pFLGtIQUE4RTtJQXNDOUUsSUFBTSxpQkFBaUIsR0FBdUIsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFFbEU7Ozs7Ozs7T0FPRztJQUNILFNBQWdCLFFBQVEsQ0FBQyxFQUd3RDtZQUh2RCxzQkFBUSxFQUFFLDhDQUFvQixFQUM5Qiw0QkFBa0QsRUFBbEQscUZBQWtELEVBQ2xELHlCQUF3QixFQUF4Qiw2Q0FBd0IsRUFBRSxrQ0FBa0MsRUFBbEMsdURBQWtDLEVBQzVELGNBQXlDLEVBQXpDLGdHQUF5QztRQUNqRSxJQUFNLFdBQVcsR0FBRyxJQUFJLHlCQUFXLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3RELElBQU0sSUFBSSxHQUFHLElBQUksZ0NBQWMsRUFBRSxDQUFDO1FBQ2xDLElBQU0sUUFBUSxHQUFHLElBQUksd0NBQWtCLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3RELElBQU0sTUFBTSxHQUFHLElBQUkscUNBQWdCLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3RELElBQU0sVUFBVSxHQUFHLGFBQWEsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1FBRTdELElBQU0sNEJBQTRCLEdBQUcsb0JBQW9CLENBQUMsQ0FBQztZQUN2RCxxQkFBYyxDQUFDLElB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bCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge3Jlc29sdmV9IGZyb20gJ2Nhbm9uaWNhbC1wYXRoJztcbmltcG9ydCB7cmVhZEZpbGVTeW5jfSBmcm9tICdmcyc7XG5cbmltcG9ydCB7QWJzb2x1dGVGc1BhdGh9IGZyb20gJy4uLy4uL3NyYy9uZ3RzYy9wYXRoJztcblxuaW1wb3J0IHtDb25zb2xlTG9nZ2VyLCBMb2dMZXZlbH0gZnJvbSAnLi9sb2dnaW5nL2NvbnNvbGVfbG9nZ2VyJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuL2xvZ2dpbmcvbG9nZ2VyJztcbmltcG9ydCB7aGFzQmVlblByb2Nlc3NlZCwgbWFya0FzUHJvY2Vzc2VkfSBmcm9tICcuL3BhY2thZ2VzL2J1aWxkX21hcmtlcic7XG5pbXBvcnQge0RlcGVuZGVuY3lIb3N0fSBmcm9tICcuL3BhY2thZ2VzL2RlcGVuZGVuY3lfaG9zdCc7XG5pbXBvcnQge0RlcGVuZGVuY3lSZXNvbHZlcn0gZnJvbSAnLi9wYWNrYWdlcy9kZXBlbmRlbmN5X3Jlc29sdmVyJztcbmltcG9ydCB7RW50cnlQb2ludEZvcm1hdCwgRW50cnlQb2ludEpzb25Qcm9wZXJ0eSwgU1VQUE9SVEVEX0ZPUk1BVF9QUk9QRVJUSUVTLCBnZXRFbnRyeVBvaW50Rm9ybWF0fSBmcm9tICcuL3BhY2thZ2VzL2VudHJ5X3BvaW50JztcbmltcG9ydCB7bWFrZUVudHJ5UG9pbnRCdW5kbGV9IGZyb20gJy4vcGFja2FnZXMvZW50cnlfcG9pbnRfYnVuZGxlJztcbmltcG9ydCB7RW50cnlQb2ludEZpbmRlcn0gZnJvbSAnLi9wYWNrYWdlcy9lbnRyeV9wb2ludF9maW5kZXInO1xuaW1wb3J0IHtUcmFuc2Zvcm1lcn0gZnJvbSAnLi9wYWNrYWdlcy90cmFuc2Zvcm1lcic7XG5pbXBvcnQge0ZpbGVXcml0ZXJ9IGZyb20gJy4vd3JpdGluZy9maWxlX3dyaXRlcic7XG5pbXBvcnQge0luUGxhY2VGaWxlV3JpdGVyfSBmcm9tICcuL3dyaXRpbmcvaW5fcGxhY2VfZmlsZV93cml0ZXInO1xuaW1wb3J0IHtOZXdFbnRyeVBvaW50RmlsZVdyaXRlcn0gZnJvbSAnLi93cml0aW5nL25ld19lbnRyeV9wb2ludF9maWxlX3dyaXRlcic7XG5cblxuXG4vKipcbiAqIFRoZSBvcHRpb25zIHRvIGNvbmZpZ3VyZSB0aGUgbmdjYyBjb21waWxlci5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBOZ2NjT3B0aW9ucyB7XG4gIC8qKiBUaGUgYWJzb2x1dGUgcGF0aCB0byB0aGUgYG5vZGVfbW9kdWxlc2AgZm9sZGVyIHRoYXQgY29udGFpbnMgdGhlIHBhY2thZ2VzIHRvIHByb2Nlc3MuICovXG4gIGJhc2VQYXRoOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgcGF0aCB0byB0aGUgcHJpbWFyeSBwYWNrYWdlIHRvIGJlIHByb2Nlc3NlZC4gSWYgbm90IGFic29sdXRlIHRoZW4gaXQgbXVzdCBiZSByZWxhdGl2ZSB0b1xuICAgKiBgYmFzZVBhdGhgLlxuICAgKlxuICAgKiBBbGwgaXRzIGRlcGVuZGVuY2llcyB3aWxsIG5lZWQgdG8gYmUgcHJvY2Vzc2VkIHRvby5cbiAgICovXG4gIHRhcmdldEVudHJ5UG9pbnRQYXRoPzogc3RyaW5nO1xuICAvKipcbiAgICogV2hpY2ggZW50cnktcG9pbnQgcHJvcGVydGllcyBpbiB0aGUgcGFja2FnZS5qc29uIHRvIGNvbnNpZGVyIHdoZW4gcHJvY2Vzc2luZyBhbiBlbnRyeS1wb2ludC5cbiAgICogRWFjaCBwcm9wZXJ0eSBzaG91bGQgaG9sZCBhIHBhdGggdG8gdGhlIHBhcnRpY3VsYXIgYnVuZGxlIGZvcm1hdCBmb3IgdGhlIGVudHJ5LXBvaW50LlxuICAgKiBEZWZhdWx0cyB0byBhbGwgdGhlIHByb3BlcnRpZXMgaW4gdGhlIHBhY2thZ2UuanNvbi5cbiAgICovXG4gIHByb3BlcnRpZXNUb0NvbnNpZGVyPzogc3RyaW5nW107XG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIHByb2Nlc3MgYWxsIGZvcm1hdHMgc3BlY2lmaWVkIGJ5IChgcHJvcGVydGllc1RvQ29uc2lkZXJgKSAgb3IgdG8gc3RvcCBwcm9jZXNzaW5nXG4gICAqIHRoaXMgZW50cnktcG9pbnQgYXQgdGhlIGZpcnN0IG1hdGNoaW5nIGZvcm1hdC4gRGVmYXVsdHMgdG8gYHRydWVgLlxuICAgKi9cbiAgY29tcGlsZUFsbEZvcm1hdHM/OiBib29sZWFuO1xuICAvKipcbiAgICogV2hldGhlciB0byBjcmVhdGUgbmV3IGVudHJ5LXBvaW50cyBidW5kbGVzIHJhdGhlciB0aGFuIG92ZXJ3cml0aW5nIHRoZSBvcmlnaW5hbCBmaWxlcy5cbiAgICovXG4gIGNyZWF0ZU5ld0VudHJ5UG9pbnRGb3JtYXRzPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFByb3ZpZGUgYSBsb2dnZXIgdGhhdCB3aWxsIGJlIGNhbGxlZCB3aXRoIGxvZyBtZXNzYWdlcy5cbiAgICovXG4gIGxvZ2dlcj86IExvZ2dlcjtcbn1cblxuY29uc3QgU1VQUE9SVEVEX0ZPUk1BVFM6IEVudHJ5UG9pbnRGb3JtYXRbXSA9IFsnZXNtNScsICdlc20yMDE1J107XG5cbi8qKlxuICogVGhpcyBpcyB0aGUgbWFpbiBlbnRyeS1wb2ludCBpbnRvIG5nY2MgKGFOR3VsYXIgQ29tcGF0aWJpbGl0eSBDb21waWxlcikuXG4gKlxuICogWW91IGNhbiBjYWxsIHRoaXMgZnVuY3Rpb24gdG8gcHJvY2VzcyBvbmUgb3IgbW9yZSBucG0gcGFja2FnZXMsIHRvIGVuc3VyZVxuICogdGhhdCB0aGV5IGFyZSBjb21wYXRpYmxlIHdpdGggdGhlIGl2eSBjb21waWxlciAobmd0c2MpLlxuICpcbiAqIEBwYXJhbSBvcHRpb25zIFRoZSBvcHRpb25zIHRlbGxpbmcgbmdjYyB3aGF0IHRvIGNvbXBpbGUgYW5kIGhvdy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1haW5OZ2NjKHtiYXNlUGF0aCwgdGFyZ2V0RW50cnlQb2ludFBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXNUb0NvbnNpZGVyID0gU1VQUE9SVEVEX0ZPUk1BVF9QUk9QRVJUSUVTLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBjb21waWxlQWxsRm9ybWF0cyA9IHRydWUsIGNyZWF0ZU5ld0VudHJ5UG9pbnRGb3JtYXRzID0gZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlciA9IG5ldyBDb25zb2xlTG9nZ2VyKExvZ0xldmVsLmluZm8pfTogTmdjY09wdGlvbnMpOiB2b2lkIHtcbiAgY29uc3QgdHJhbnNmb3JtZXIgPSBuZXcgVHJhbnNmb3JtZXIobG9nZ2VyLCBiYXNlUGF0aCk7XG4gIGNvbnN0IGhvc3QgPSBuZXcgRGVwZW5kZW5jeUhvc3QoKTtcbiAgY29uc3QgcmVzb2x2ZXIgPSBuZXcgRGVwZW5kZW5jeVJlc29sdmVyKGxvZ2dlciwgaG9zdCk7XG4gIGNvbnN0IGZpbmRlciA9IG5ldyBFbnRyeVBvaW50RmluZGVyKGxvZ2dlciwgcmVzb2x2ZXIpO1xuICBjb25zdCBmaWxlV3JpdGVyID0gZ2V0RmlsZVdyaXRlcihjcmVhdGVOZXdFbnRyeVBvaW50Rm9ybWF0cyk7XG5cbiAgY29uc3QgYWJzb2x1dGVUYXJnZXRFbnRyeVBvaW50UGF0aCA9IHRhcmdldEVudHJ5UG9pbnRQYXRoID9cbiAgICAgIEFic29sdXRlRnNQYXRoLmZyb20ocmVzb2x2ZShiYXNlUGF0aCwgdGFyZ2V0RW50cnlQb2ludFBhdGgpKSA6XG4gICAgICB1bmRlZmluZWQ7XG5cbiAgaWYgKGFic29sdXRlVGFyZ2V0RW50cnlQb2ludFBhdGggJiZcbiAgICAgIGhhc1Byb2Nlc3NlZFRhcmdldEVudHJ5UG9pbnQoXG4gICAgICAgICAgYWJzb2x1dGVUYXJnZXRFbnRyeVBvaW50UGF0aCwgcHJvcGVydGllc1RvQ29uc2lkZXIsIGNvbXBpbGVBbGxGb3JtYXRzKSkge1xuICAgIGxvZ2dlci5kZWJ1ZygnVGhlIHRhcmdldCBlbnRyeS1wb2ludCBoYXMgYWxyZWFkeSBiZWVuIHByb2Nlc3NlZCcpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHtlbnRyeVBvaW50c30gPVxuICAgICAgZmluZGVyLmZpbmRFbnRyeVBvaW50cyhBYnNvbHV0ZUZzUGF0aC5mcm9tKGJhc2VQYXRoKSwgYWJzb2x1dGVUYXJnZXRFbnRyeVBvaW50UGF0aCk7XG5cbiAgaWYgKGFic29sdXRlVGFyZ2V0RW50cnlQb2ludFBhdGggJiYgZW50cnlQb2ludHMuZXZlcnkoZW50cnlQb2ludCA9PiB7XG4gICAgICAgIHJldHVybiBlbnRyeVBvaW50LnBhdGggIT09IGFic29sdXRlVGFyZ2V0RW50cnlQb2ludFBhdGg7XG4gICAgICB9KSkge1xuICAgIC8vIElmIHdlIGdldCBoZXJlLCB0aGVuIHRoZSByZXF1ZXN0ZWQgZW50cnktcG9pbnQgZGlkIG5vdCBjb250YWluIGFueXRoaW5nIGNvbXBpbGVkIGJ5XG4gICAgLy8gdGhlIG9sZCBBbmd1bGFyIGNvbXBpbGVyLiBUaGVyZWZvcmUgdGhlcmUgaXMgbm90aGluZyBmb3IgbmdjYyB0byBkby5cbiAgICAvLyBTbyBtYXJrIGFsbCBmb3JtYXRzIGluIHRoaXMgZW50cnktcG9pbnQgYXMgcHJvY2Vzc2VkIHNvIHRoYXQgY2xpZW50cyBvZiBuZ2NjIGNhbiBhdm9pZFxuICAgIC8vIHRyaWdnZXJpbmcgbmdjYyBmb3IgdGhpcyBlbnRyeS1wb2ludCBpbiB0aGUgZnV0dXJlLlxuICAgIGNvbnN0IHBhY2thZ2VKc29uUGF0aCA9XG4gICAgICAgIEFic29sdXRlRnNQYXRoLmZyb20ocmVzb2x2ZShhYnNvbHV0ZVRhcmdldEVudHJ5UG9pbnRQYXRoLCAncGFja2FnZS5qc29uJykpO1xuICAgIGNvbnN0IHBhY2thZ2VKc29uID0gSlNPTi5wYXJzZShyZWFkRmlsZVN5bmMocGFja2FnZUpzb25QYXRoLCAndXRmOCcpKTtcbiAgICBwcm9wZXJ0aWVzVG9Db25zaWRlci5mb3JFYWNoKGZvcm1hdFByb3BlcnR5ID0+IHtcbiAgICAgIGlmIChwYWNrYWdlSnNvbltmb3JtYXRQcm9wZXJ0eV0pXG4gICAgICAgIG1hcmtBc1Byb2Nlc3NlZChwYWNrYWdlSnNvbiwgcGFja2FnZUpzb25QYXRoLCBmb3JtYXRQcm9wZXJ0eSBhcyBFbnRyeVBvaW50SnNvblByb3BlcnR5KTtcbiAgICB9KTtcbiAgICByZXR1cm47XG4gIH1cblxuICBlbnRyeVBvaW50cy5mb3JFYWNoKGVudHJ5UG9pbnQgPT4ge1xuICAgIC8vIEFyZSB3ZSBjb21waWxpbmcgdGhlIEFuZ3VsYXIgY29yZT9cbiAgICBjb25zdCBpc0NvcmUgPSBlbnRyeVBvaW50Lm5hbWUgPT09ICdAYW5ndWxhci9jb3JlJztcblxuICAgIGNvbnN0IGNvbXBpbGVkRm9ybWF0cyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnN0IGVudHJ5UG9pbnRQYWNrYWdlSnNvbiA9IGVudHJ5UG9pbnQucGFja2FnZUpzb247XG4gICAgY29uc3QgZW50cnlQb2ludFBhY2thZ2VKc29uUGF0aCA9IEFic29sdXRlRnNQYXRoLmZyb20ocmVzb2x2ZShlbnRyeVBvaW50LnBhdGgsICdwYWNrYWdlLmpzb24nKSk7XG5cbiAgICBjb25zdCBoYXNQcm9jZXNzZWREdHMgPSBoYXNCZWVuUHJvY2Vzc2VkKGVudHJ5UG9pbnRQYWNrYWdlSnNvbiwgJ3R5cGluZ3MnKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvcGVydGllc1RvQ29uc2lkZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHByb3BlcnR5ID0gcHJvcGVydGllc1RvQ29uc2lkZXJbaV0gYXMgRW50cnlQb2ludEpzb25Qcm9wZXJ0eTtcbiAgICAgIGNvbnN0IGZvcm1hdFBhdGggPSBlbnRyeVBvaW50UGFja2FnZUpzb25bcHJvcGVydHldO1xuICAgICAgY29uc3QgZm9ybWF0ID0gZ2V0RW50cnlQb2ludEZvcm1hdChwcm9wZXJ0eSk7XG5cbiAgICAgIC8vIE5vIGZvcm1hdCB0aGVuIHRoaXMgcHJvcGVydHkgaXMgbm90IHN1cHBvc2VkIHRvIGJlIGNvbXBpbGVkLlxuICAgICAgaWYgKCFmb3JtYXRQYXRoIHx8ICFmb3JtYXQgfHwgU1VQUE9SVEVEX0ZPUk1BVFMuaW5kZXhPZihmb3JtYXQpID09PSAtMSkgY29udGludWU7XG5cbiAgICAgIGlmIChoYXNCZWVuUHJvY2Vzc2VkKGVudHJ5UG9pbnRQYWNrYWdlSnNvbiwgcHJvcGVydHkpKSB7XG4gICAgICAgIGNvbXBpbGVkRm9ybWF0cy5hZGQoZm9ybWF0UGF0aCk7XG4gICAgICAgIGxvZ2dlci5kZWJ1ZyhgU2tpcHBpbmcgJHtlbnRyeVBvaW50Lm5hbWV9IDogJHtwcm9wZXJ0eX0gKGFscmVhZHkgY29tcGlsZWQpLmApO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgaXNGaXJzdEZvcm1hdCA9IGNvbXBpbGVkRm9ybWF0cy5zaXplID09PSAwO1xuICAgICAgY29uc3QgcHJvY2Vzc0R0cyA9ICFoYXNQcm9jZXNzZWREdHMgJiYgaXNGaXJzdEZvcm1hdDtcblxuICAgICAgLy8gV2UgZG9uJ3QgYnJlYWsgaWYgdGhpcyBpZiBzdGF0ZW1lbnQgZmFpbHMgYmVjYXVzZSB3ZSBzdGlsbCB3YW50IHRvIG1hcmtcbiAgICAgIC8vIHRoZSBwcm9wZXJ0eSBhcyBwcm9jZXNzZWQgZXZlbiBpZiBpdHMgdW5kZXJseWluZyBmb3JtYXQgaGFzIGJlZW4gYnVpbHQgYWxyZWFkeS5cbiAgICAgIGlmICghY29tcGlsZWRGb3JtYXRzLmhhcyhmb3JtYXRQYXRoKSAmJiAoY29tcGlsZUFsbEZvcm1hdHMgfHwgaXNGaXJzdEZvcm1hdCkpIHtcbiAgICAgICAgY29uc3QgYnVuZGxlID0gbWFrZUVudHJ5UG9pbnRCdW5kbGUoXG4gICAgICAgICAgICBlbnRyeVBvaW50LnBhdGgsIGZvcm1hdFBhdGgsIGVudHJ5UG9pbnQudHlwaW5ncywgaXNDb3JlLCBwcm9wZXJ0eSwgZm9ybWF0LCBwcm9jZXNzRHRzKTtcbiAgICAgICAgaWYgKGJ1bmRsZSkge1xuICAgICAgICAgIGxvZ2dlci5pbmZvKGBDb21waWxpbmcgJHtlbnRyeVBvaW50Lm5hbWV9IDogJHtwcm9wZXJ0eX0gYXMgJHtmb3JtYXR9YCk7XG4gICAgICAgICAgY29uc3QgdHJhbnNmb3JtZWRGaWxlcyA9IHRyYW5zZm9ybWVyLnRyYW5zZm9ybShidW5kbGUpO1xuICAgICAgICAgIGZpbGVXcml0ZXIud3JpdGVCdW5kbGUoZW50cnlQb2ludCwgYnVuZGxlLCB0cmFuc2Zvcm1lZEZpbGVzKTtcbiAgICAgICAgICBjb21waWxlZEZvcm1hdHMuYWRkKGZvcm1hdFBhdGgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvZ2dlci53YXJuKFxuICAgICAgICAgICAgICBgU2tpcHBpbmcgJHtlbnRyeVBvaW50Lm5hbWV9IDogJHtmb3JtYXR9IChubyB2YWxpZCBlbnRyeSBwb2ludCBmaWxlIGZvciB0aGlzIGZvcm1hdCkuYCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoIWNvbXBpbGVBbGxGb3JtYXRzKSB7XG4gICAgICAgIGxvZ2dlci5kZWJ1ZyhgU2tpcHBpbmcgJHtlbnRyeVBvaW50Lm5hbWV9IDogJHtwcm9wZXJ0eX0gKGFscmVhZHkgY29tcGlsZWQpLmApO1xuICAgICAgfVxuXG4gICAgICAvLyBFaXRoZXIgdGhpcyBmb3JtYXQgd2FzIGp1c3QgY29tcGlsZWQgb3IgaXRzIHVuZGVybHlpbmcgZm9ybWF0IHdhcyBjb21waWxlZCBiZWNhdXNlIG9mIGFcbiAgICAgIC8vIHByZXZpb3VzIHByb3BlcnR5LlxuICAgICAgaWYgKGNvbXBpbGVkRm9ybWF0cy5oYXMoZm9ybWF0UGF0aCkpIHtcbiAgICAgICAgbWFya0FzUHJvY2Vzc2VkKGVudHJ5UG9pbnRQYWNrYWdlSnNvbiwgZW50cnlQb2ludFBhY2thZ2VKc29uUGF0aCwgcHJvcGVydHkpO1xuICAgICAgICBpZiAocHJvY2Vzc0R0cykge1xuICAgICAgICAgIG1hcmtBc1Byb2Nlc3NlZChlbnRyeVBvaW50UGFja2FnZUpzb24sIGVudHJ5UG9pbnRQYWNrYWdlSnNvblBhdGgsICd0eXBpbmdzJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY29tcGlsZWRGb3JtYXRzLnNpemUgPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgRmFpbGVkIHRvIGNvbXBpbGUgYW55IGZvcm1hdHMgZm9yIGVudHJ5LXBvaW50IGF0ICgke2VudHJ5UG9pbnQucGF0aH0pLiBUcmllZCAke3Byb3BlcnRpZXNUb0NvbnNpZGVyfS5gKTtcbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRGaWxlV3JpdGVyKGNyZWF0ZU5ld0VudHJ5UG9pbnRGb3JtYXRzOiBib29sZWFuKTogRmlsZVdyaXRlciB7XG4gIHJldHVybiBjcmVhdGVOZXdFbnRyeVBvaW50Rm9ybWF0cyA/IG5ldyBOZXdFbnRyeVBvaW50RmlsZVdyaXRlcigpIDogbmV3IEluUGxhY2VGaWxlV3JpdGVyKCk7XG59XG5cbmZ1bmN0aW9uIGhhc1Byb2Nlc3NlZFRhcmdldEVudHJ5UG9pbnQoXG4gICAgdGFyZ2V0UGF0aDogQWJzb2x1dGVGc1BhdGgsIHByb3BlcnRpZXNUb0NvbnNpZGVyOiBzdHJpbmdbXSwgY29tcGlsZUFsbEZvcm1hdHM6IGJvb2xlYW4pIHtcbiAgY29uc3QgcGFja2FnZUpzb25QYXRoID0gQWJzb2x1dGVGc1BhdGguZnJvbShyZXNvbHZlKHRhcmdldFBhdGgsICdwYWNrYWdlLmpzb24nKSk7XG4gIGNvbnN0IHBhY2thZ2VKc29uID0gSlNPTi5wYXJzZShyZWFkRmlsZVN5bmMocGFja2FnZUpzb25QYXRoLCAndXRmOCcpKTtcblxuICBmb3IgKGNvbnN0IHByb3BlcnR5IG9mIHByb3BlcnRpZXNUb0NvbnNpZGVyKSB7XG4gICAgaWYgKHBhY2thZ2VKc29uW3Byb3BlcnR5XSkge1xuICAgICAgLy8gSGVyZSBpcyBhIHByb3BlcnR5IHRoYXQgc2hvdWxkIGJlIHByb2Nlc3NlZFxuICAgICAgaWYgKGhhc0JlZW5Qcm9jZXNzZWQocGFja2FnZUpzb24sIHByb3BlcnR5IGFzIEVudHJ5UG9pbnRKc29uUHJvcGVydHkpKSB7XG4gICAgICAgIGlmICghY29tcGlsZUFsbEZvcm1hdHMpIHtcbiAgICAgICAgICAvLyBJdCBoYXMgYmVlbiBwcm9jZXNzZWQgYW5kIHdlIG9ubHkgbmVlZCBvbmUsIHNvIHdlIGFyZSBkb25lLlxuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBJdCBoYXMgbm90IGJlZW4gcHJvY2Vzc2VkIGJ1dCB3ZSBuZWVkIGFsbCBvZiB0aGVtLCBzbyB3ZSBhcmUgZG9uZS5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvLyBFaXRoZXIgYWxsIGZvcm1hdHMgbmVlZCB0byBiZSBjb21waWxlZCBhbmQgdGhlcmUgd2VyZSBub25lIHRoYXQgd2VyZSB1bnByb2Nlc3NlZCxcbiAgLy8gT3Igb25seSB0aGUgb25lIG1hdGNoaW5nIGZvcm1hdCBuZWVkcyB0byBiZSBjb21waWxlZCBidXQgdGhlcmUgd2FzIGF0IGxlYXN0IG9uZSBtYXRjaGluZ1xuICAvLyBwcm9wZXJ0eSBiZWZvcmUgdGhlIGZpcnN0IHByb2Nlc3NlZCBmb3JtYXQgdGhhdCB3YXMgdW5wcm9jZXNzZWQuXG4gIHJldHVybiB0cnVlO1xufVxuIl19