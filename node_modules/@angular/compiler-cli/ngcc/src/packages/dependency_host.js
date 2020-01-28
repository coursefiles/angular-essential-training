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
        define("@angular/compiler-cli/ngcc/src/packages/dependency_host", ["require", "exports", "canonical-path", "fs", "typescript", "@angular/compiler-cli/src/ngtsc/path"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var path = require("canonical-path");
    var fs = require("fs");
    var ts = require("typescript");
    var path_1 = require("@angular/compiler-cli/src/ngtsc/path");
    /**
     * Helper functions for computing dependencies.
     */
    var DependencyHost = /** @class */ (function () {
        function DependencyHost() {
        }
        /**
         * Get a list of the resolved paths to all the dependencies of this entry point.
         * @param from An absolute path to the file whose dependencies we want to get.
         * @param dependencies A set that will have the absolute paths of resolved entry points added to
         * it.
         * @param missing A set that will have the dependencies that could not be found added to it.
         * @param deepImports A set that will have the import paths that exist but cannot be mapped to
         * entry-points, i.e. deep-imports.
         * @param internal A set that is used to track internal dependencies to prevent getting stuck in a
         * circular dependency loop.
         */
        DependencyHost.prototype.computeDependencies = function (from, dependencies, missing, deepImports, internal) {
            var _this = this;
            if (dependencies === void 0) { dependencies = new Set(); }
            if (missing === void 0) { missing = new Set(); }
            if (deepImports === void 0) { deepImports = new Set(); }
            if (internal === void 0) { internal = new Set(); }
            var fromContents = fs.readFileSync(from, 'utf8');
            if (!this.hasImportOrReexportStatements(fromContents)) {
                return { dependencies: dependencies, missing: missing, deepImports: deepImports };
            }
            // Parse the source into a TypeScript AST and then walk it looking for imports and re-exports.
            var sf = ts.createSourceFile(from, fromContents, ts.ScriptTarget.ES2015, false, ts.ScriptKind.JS);
            sf.statements
                // filter out statements that are not imports or reexports
                .filter(this.isStringImportOrReexport)
                // Grab the id of the module that is being imported
                .map(function (stmt) { return stmt.moduleSpecifier.text; })
                // Resolve this module id into an absolute path
                .forEach(function (importPath) {
                if (importPath.startsWith('.')) {
                    // This is an internal import so follow it
                    var internalDependency = _this.resolveInternal(from, importPath);
                    // Avoid circular dependencies
                    if (!internal.has(internalDependency)) {
                        internal.add(internalDependency);
                        _this.computeDependencies(internalDependency, dependencies, missing, deepImports, internal);
                    }
                }
                else {
                    var resolvedEntryPoint = _this.tryResolveEntryPoint(from, importPath);
                    if (resolvedEntryPoint !== null) {
                        dependencies.add(resolvedEntryPoint);
                    }
                    else {
                        // If the import could not be resolved as entry point, it either does not exist
                        // at all or is a deep import.
                        var deeplyImportedFile = _this.tryResolve(from, importPath);
                        if (deeplyImportedFile !== null) {
                            deepImports.add(importPath);
                        }
                        else {
                            missing.add(importPath);
                        }
                    }
                }
            });
            return { dependencies: dependencies, missing: missing, deepImports: deepImports };
        };
        /**
         * Resolve an internal module import.
         * @param from the absolute file path from where to start trying to resolve this module
         * @param to the module specifier of the internal dependency to resolve
         * @returns the resolved path to the import.
         */
        DependencyHost.prototype.resolveInternal = function (from, to) {
            var fromDirectory = path.dirname(from);
            // `fromDirectory` is absolute so we don't need to worry about telling `require.resolve`
            // about it by adding it to a `paths` parameter - unlike `tryResolve` below.
            return path_1.AbsoluteFsPath.from(require.resolve(path.resolve(fromDirectory, to)));
        };
        /**
         * We don't want to resolve external dependencies directly because if it is a path to a
         * sub-entry-point (e.g. @angular/animations/browser rather than @angular/animations)
         * then `require.resolve()` may return a path to a UMD bundle, which may actually live
         * in the folder containing the sub-entry-point
         * (e.g. @angular/animations/bundles/animations-browser.umd.js).
         *
         * Instead we try to resolve it as a package, which is what we would need anyway for it to be
         * compilable by ngcc.
         *
         * If `to` is actually a path to a file then this will fail, which is what we want.
         *
         * @param from the file path from where to start trying to resolve this module
         * @param to the module specifier of the dependency to resolve
         * @returns the resolved path to the entry point directory of the import or null
         * if it cannot be resolved.
         */
        DependencyHost.prototype.tryResolveEntryPoint = function (from, to) {
            var entryPoint = this.tryResolve(from, to + "/package.json");
            return entryPoint && path_1.AbsoluteFsPath.from(path.dirname(entryPoint));
        };
        /**
         * Resolve the absolute path of a module from a particular starting point.
         *
         * @param from the file path from where to start trying to resolve this module
         * @param to the module specifier of the dependency to resolve
         * @returns an absolute path to the entry-point of the dependency or null if it could not be
         * resolved.
         */
        DependencyHost.prototype.tryResolve = function (from, to) {
            try {
                return path_1.AbsoluteFsPath.from(require.resolve(to, { paths: [from] }));
            }
            catch (e) {
                return null;
            }
        };
        /**
         * Check whether the given statement is an import with a string literal module specifier.
         * @param stmt the statement node to check.
         * @returns true if the statement is an import with a string literal module specifier.
         */
        DependencyHost.prototype.isStringImportOrReexport = function (stmt) {
            return ts.isImportDeclaration(stmt) ||
                ts.isExportDeclaration(stmt) && !!stmt.moduleSpecifier &&
                    ts.isStringLiteral(stmt.moduleSpecifier);
        };
        /**
         * Check whether a source file needs to be parsed for imports.
         * This is a performance short-circuit, which saves us from creating
         * a TypeScript AST unnecessarily.
         *
         * @param source The content of the source file to check.
         *
         * @returns false if there are definitely no import or re-export statements
         * in this file, true otherwise.
         */
        DependencyHost.prototype.hasImportOrReexportStatements = function (source) {
            return /(import|export)\s.+from/.test(source);
        };
        return DependencyHost;
    }());
    exports.DependencyHost = DependencyHost;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwZW5kZW5jeV9ob3N0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL25nY2Mvc3JjL3BhY2thZ2VzL2RlcGVuZGVuY3lfaG9zdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztJQUVILHFDQUF1QztJQUN2Qyx1QkFBeUI7SUFDekIsK0JBQWlDO0lBRWpDLDZEQUFvRTtJQUVwRTs7T0FFRztJQUNIO1FBQUE7UUEySUEsQ0FBQztRQTFJQzs7Ozs7Ozs7OztXQVVHO1FBQ0gsNENBQW1CLEdBQW5CLFVBQ0ksSUFBb0IsRUFBRSxZQUE2QyxFQUNuRSxPQUFxQyxFQUFFLFdBQXlDLEVBQ2hGLFFBQXlDO1lBSDdDLGlCQWlEQztZQWhEeUIsNkJBQUEsRUFBQSxtQkFBd0MsR0FBRyxFQUFFO1lBQ25FLHdCQUFBLEVBQUEsY0FBZ0MsR0FBRyxFQUFFO1lBQUUsNEJBQUEsRUFBQSxrQkFBb0MsR0FBRyxFQUFFO1lBQ2hGLHlCQUFBLEVBQUEsZUFBb0MsR0FBRyxFQUFFO1lBSzNDLElBQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ25ELElBQUksQ0FBQyxJQUFJLENBQUMsNkJBQTZCLENBQUMsWUFBWSxDQUFDLEVBQUU7Z0JBQ3JELE9BQU8sRUFBQyxZQUFZLGNBQUEsRUFBRSxPQUFPLFNBQUEsRUFBRSxXQUFXLGFBQUEsRUFBQyxDQUFDO2FBQzdDO1lBRUQsOEZBQThGO1lBQzlGLElBQU0sRUFBRSxHQUNKLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzdGLEVBQUUsQ0FBQyxVQUFVO2dCQUNULDBE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T0FBTyxFQUFFLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDO2dCQUMvQixFQUFFLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlO29CQUN0RCxFQUFFLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUMvQyxDQUFDO1FBRUQ7Ozs7Ozs7OztXQVNHO1FBQ0gsc0RBQTZCLEdBQTdCLFVBQThCLE1BQWM7WUFDMUMsT0FBTyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDaEQsQ0FBQztRQUNILHFCQUFDO0lBQUQsQ0FBQyxBQTNJRCxJQTJJQztJQTNJWSx3Q0FBYyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdjYW5vbmljYWwtcGF0aCc7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuaW1wb3J0IHtBYnNvbHV0ZUZzUGF0aCwgUGF0aFNlZ21lbnR9IGZyb20gJy4uLy4uLy4uL3NyYy9uZ3RzYy9wYXRoJztcblxuLyoqXG4gKiBIZWxwZXIgZnVuY3Rpb25zIGZvciBjb21wdXRpbmcgZGVwZW5kZW5jaWVzLlxuICovXG5leHBvcnQgY2xhc3MgRGVwZW5kZW5jeUhvc3Qge1xuICAvKipcbiAgICogR2V0IGEgbGlzdCBvZiB0aGUgcmVzb2x2ZWQgcGF0aHMgdG8gYWxsIHRoZSBkZXBlbmRlbmNpZXMgb2YgdGhpcyBlbnRyeSBwb2ludC5cbiAgICogQHBhcmFtIGZyb20gQW4gYWJzb2x1dGUgcGF0aCB0byB0aGUgZmlsZSB3aG9zZSBkZXBlbmRlbmNpZXMgd2Ugd2FudCB0byBnZXQuXG4gICAqIEBwYXJhbSBkZXBlbmRlbmNpZXMgQSBzZXQgdGhhdCB3aWxsIGhhdmUgdGhlIGFic29sdXRlIHBhdGhzIG9mIHJlc29sdmVkIGVudHJ5IHBvaW50cyBhZGRlZCB0b1xuICAgKiBpdC5cbiAgICogQHBhcmFtIG1pc3NpbmcgQSBzZXQgdGhhdCB3aWxsIGhhdmUgdGhlIGRlcGVuZGVuY2llcyB0aGF0IGNvdWxkIG5vdCBiZSBmb3VuZCBhZGRlZCB0byBpdC5cbiAgICogQHBhcmFtIGRlZXBJbXBvcnRzIEEgc2V0IHRoYXQgd2lsbCBoYXZlIHRoZSBpbXBvcnQgcGF0aHMgdGhhdCBleGlzdCBidXQgY2Fubm90IGJlIG1hcHBlZCB0b1xuICAgKiBlbnRyeS1wb2ludHMsIGkuZS4gZGVlcC1pbXBvcnRzLlxuICAgKiBAcGFyYW0gaW50ZXJuYWwgQSBzZXQgdGhhdCBpcyB1c2VkIHRvIHRyYWNrIGludGVybmFsIGRlcGVuZGVuY2llcyB0byBwcmV2ZW50IGdldHRpbmcgc3R1Y2sgaW4gYVxuICAgKiBjaXJjdWxhciBkZXBlbmRlbmN5IGxvb3AuXG4gICAqL1xuICBjb21wdXRlRGVwZW5kZW5jaWVzKFxuICAgICAgZnJvbTogQWJzb2x1dGVGc1BhdGgsIGRlcGVuZGVuY2llczogU2V0PEFic29sdXRlRnNQYXRoPiA9IG5ldyBTZXQoKSxcbiAgICAgIG1pc3Npbmc6IFNldDxQYXRoU2VnbWVudD4gPSBuZXcgU2V0KCksIGRlZXBJbXBvcnRzOiBTZXQ8UGF0aFNlZ21lbnQ+ID0gbmV3IFNldCgpLFxuICAgICAgaW50ZXJuYWw6IFNldDxBYnNvbHV0ZUZzUGF0aD4gPSBuZXcgU2V0KCkpOiB7XG4gICAgZGVwZW5kZW5jaWVzOiBTZXQ8QWJzb2x1dGVGc1BhdGg+LFxuICAgIG1pc3Npbmc6IFNldDxQYXRoU2VnbWVudD4sXG4gICAgZGVlcEltcG9ydHM6IFNldDxQYXRoU2VnbWVudD5cbiAgfSB7XG4gICAgY29uc3QgZnJvbUNvbnRlbnRzID0gZnMucmVhZEZpbGVTeW5jKGZyb20sICd1dGY4Jyk7XG4gICAgaWYgKCF0aGlzLmhhc0ltcG9ydE9yUmVleHBvcnRTdGF0ZW1lbnRzKGZyb21Db250ZW50cykpIHtcbiAgICAgIHJldHVybiB7ZGVwZW5kZW5jaWVzLCBtaXNzaW5nLCBkZWVwSW1wb3J0c307XG4gICAgfVxuXG4gICAgLy8gUGFyc2UgdGhlIHNvdXJjZSBpbnRvIGEgVHlwZVNjcmlwdCBBU1QgYW5kIHRoZW4gd2FsayBpdCBsb29raW5nIGZvciBpbXBvcnRzIGFuZCByZS1leHBvcnRzLlxuICAgIGNvbnN0IHNmID1cbiAgICAgICAgdHMuY3JlYXRlU291cmNlRmlsZShmcm9tLCBmcm9tQ29udGVudHMsIHRzLlNjcmlwdFRhcmdldC5FUzIwMTUsIGZhbHNlLCB0cy5TY3JpcHRLaW5kLkpTKTtcbiAgICBzZi5zdGF0ZW1lbnRzXG4gICAgICAgIC8vIGZpbHRlciBvdXQgc3RhdGVtZW50cyB0aGF0IGFyZSBub3QgaW1wb3J0cyBvciByZWV4cG9ydHNcbiAgICAgICAgLmZpbHRlcih0aGlzLmlzU3RyaW5nSW1wb3J0T3JSZWV4cG9ydClcbiAgICAgICAgLy8gR3JhYiB0aGUgaWQgb2YgdGhlIG1vZHVsZSB0aGF0IGlzIGJlaW5nIGltcG9ydGVkXG4gICAgICAgIC5tYXAoc3RtdCA9PiBzdG10Lm1vZHVsZVNwZWNpZmllci50ZXh0KVxuICAgICAgICAvLyBSZXNvbHZlIHRoaXMgbW9kdWxlIGlkIGludG8gYW4gYWJzb2x1dGUgcGF0aFxuICAgICAgICAuZm9yRWFjaCgoaW1wb3J0UGF0aDogUGF0aFNlZ21lbnQpID0+IHtcbiAgICAgICAgICBpZiAoaW1wb3J0UGF0aC5zdGFydHNXaXRoKCcuJykpIHtcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wb3J0IHNvIGZvbGxvdyBpdFxuICAgICAgICAgICAgY29uc3QgaW50ZXJuYWxEZXBlbmRlbmN5ID0gdGhpcy5yZXNvbHZlSW50ZXJuYWwoZnJvbSwgaW1wb3J0UGF0aCk7XG4gICAgICAgICAgICAvLyBBdm9pZCBjaXJjdWxhciBkZXBlbmRlbmNpZXNcbiAgICAgICAgICAgIGlmICghaW50ZXJuYWwuaGFzKGludGVybmFsRGVwZW5kZW5jeSkpIHtcbiAgICAgICAgICAgICAgaW50ZXJuYWwuYWRkKGludGVybmFsRGVwZW5kZW5jeSk7XG4gICAgICAgICAgICAgIHRoaXMuY29tcHV0ZURlcGVuZGVuY2llcyhcbiAgICAgICAgICAgICAgICAgIGludGVybmFsRGVwZW5kZW5jeSwgZGVwZW5kZW5jaWVzLCBtaXNzaW5nLCBkZWVwSW1wb3J0cywgaW50ZXJuYWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCByZXNvbHZlZEVudHJ5UG9pbnQgPSB0aGlzLnRyeVJlc29sdmVFbnRyeVBvaW50KGZyb20sIGltcG9ydFBhdGgpO1xuICAgICAgICAgICAgaWYgKHJlc29sdmVkRW50cnlQb2ludCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICBkZXBlbmRlbmNpZXMuYWRkKHJlc29sdmVkRW50cnlQb2ludCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBJZiB0aGUgaW1wb3J0IGNvdWxkIG5vdCBiZSByZXNvbHZlZCBhcyBlbnRyeSBwb2ludCwgaXQgZWl0aGVyIGRvZXMgbm90IGV4aXN0XG4gICAgICAgICAgICAgIC8vIGF0IGFsbCBvciBpcyBhIGRlZXAgaW1wb3J0LlxuICAgICAgICAgICAgICBjb25zdCBkZWVwbHlJbXBvcnRlZEZpbGUgPSB0aGlzLnRyeVJlc29sdmUoZnJvbSwgaW1wb3J0UGF0aCk7XG4gICAgICAgICAgICAgIGlmIChkZWVwbHlJbXBvcnRlZEZpbGUgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBkZWVwSW1wb3J0cy5hZGQoaW1wb3J0UGF0aCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbWlzc2luZy5hZGQoaW1wb3J0UGF0aCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIHJldHVybiB7ZGVwZW5kZW5jaWVzLCBtaXNzaW5nLCBkZWVwSW1wb3J0c307XG4gIH1cblxuICAvKipcbiAgICogUmVzb2x2ZSBhbiBpbnRlcm5hbCBtb2R1bGUgaW1wb3J0LlxuICAgKiBAcGFyYW0gZnJvbSB0aGUgYWJzb2x1dGUgZmlsZSBwYXRoIGZyb20gd2hlcmUgdG8gc3RhcnQgdHJ5aW5nIHRvIHJlc29sdmUgdGhpcyBtb2R1bGVcbiAgICogQHBhcmFtIHRvIHRoZSBtb2R1bGUgc3BlY2lmaWVyIG9mIHRoZSBpbnRlcm5hbCBkZXBlbmRlbmN5IHRvIHJlc29sdmVcbiAgICogQHJldHVybnMgdGhlIHJlc29sdmVkIHBhdGggdG8gdGhlIGltcG9ydC5cbiAgICovXG4gIHJlc29sdmVJbnRlcm5hbChmcm9tOiBBYnNvbHV0ZUZzUGF0aCwgdG86IFBhdGhTZWdtZW50KTogQWJzb2x1dGVGc1BhdGgge1xuICAgIGNvbnN0IGZyb21EaXJlY3RvcnkgPSBwYXRoLmRpcm5hbWUoZnJvbSk7XG4gICAgLy8gYGZyb21EaXJlY3RvcnlgIGlzIGFic29sdXRlIHNvIHdlIGRvbid0IG5lZWQgdG8gd29ycnkgYWJvdXQgdGVsbGluZyBgcmVxdWlyZS5yZXNvbHZlYFxuICAgIC8vIGFib3V0IGl0IGJ5IGFkZGluZyBpdCB0byBhIGBwYXRoc2AgcGFyYW1ldGVyIC0gdW5saWtlIGB0cnlSZXNvbHZlYCBiZWxvdy5cbiAgICByZXR1cm4gQWJzb2x1dGVGc1BhdGguZnJvbShyZXF1aXJlLnJlc29sdmUocGF0aC5yZXNvbHZlKGZyb21EaXJlY3RvcnksIHRvKSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdlIGRvbid0IHdhbnQgdG8gcmVzb2x2ZSBleHRlcm5hbCBkZXBlbmRlbmNpZXMgZGlyZWN0bHkgYmVjYXVzZSBpZiBpdCBpcyBhIHBhdGggdG8gYVxuICAgKiBzdWItZW50cnktcG9pbnQgKGUuZy4gQGFuZ3VsYXIvYW5pbWF0aW9ucy9icm93c2VyIHJhdGhlciB0aGFuIEBhbmd1bGFyL2FuaW1hdGlvbnMpXG4gICAqIHRoZW4gYHJlcXVpcmUucmVzb2x2ZSgpYCBtYXkgcmV0dXJuIGEgcGF0aCB0byBhIFVNRCBidW5kbGUsIHdoaWNoIG1heSBhY3R1YWxseSBsaXZlXG4gICAqIGluIHRoZSBmb2xkZXIgY29udGFpbmluZyB0aGUgc3ViLWVudHJ5LXBvaW50XG4gICAqIChlLmcuIEBhbmd1bGFyL2FuaW1hdGlvbnMvYnVuZGxlcy9hbmltYXRpb25zLWJyb3dzZXIudW1kLmpzKS5cbiAgICpcbiAgICogSW5zdGVhZCB3ZSB0cnkgdG8gcmVzb2x2ZSBpdCBhcyBhIHBhY2thZ2UsIHdoaWNoIGlzIHdoYXQgd2Ugd291bGQgbmVlZCBhbnl3YXkgZm9yIGl0IHRvIGJlXG4gICAqIGNvbXBpbGFibGUgYnkgbmdjYy5cbiAgICpcbiAgICogSWYgYHRvYCBpcyBhY3R1YWxseSBhIHBhdGggdG8gYSBmaWxlIHRoZW4gdGhpcyB3aWxsIGZhaWwsIHdoaWNoIGlzIHdoYXQgd2Ugd2FudC5cbiAgICpcbiAgICogQHBhcmFtIGZyb20gdGhlIGZpbGUgcGF0aCBmcm9tIHdoZXJlIHRvIHN0YXJ0IHRyeWluZyB0byByZXNvbHZlIHRoaXMgbW9kdWxlXG4gICAqIEBwYXJhbSB0byB0aGUgbW9kdWxlIHNwZWNpZmllciBvZiB0aGUgZGVwZW5kZW5jeSB0byByZXNvbHZlXG4gICAqIEByZXR1cm5zIHRoZSByZXNvbHZlZCBwYXRoIHRvIHRoZSBlbnRyeSBwb2ludCBkaXJlY3Rvcnkgb2YgdGhlIGltcG9ydCBvciBudWxsXG4gICAqIGlmIGl0IGNhbm5vdCBiZSByZXNvbHZlZC5cbiAgICovXG4gIHRyeVJlc29sdmVFbnRyeVBvaW50KGZyb206IEFic29sdXRlRnNQYXRoLCB0bzogUGF0aFNlZ21lbnQpOiBBYnNvbHV0ZUZzUGF0aHxudWxsIHtcbiAgICBjb25zdCBlbnRyeVBvaW50ID0gdGhpcy50cnlSZXNvbHZlKGZyb20sIGAke3RvfS9wYWNrYWdlLmpzb25gIGFzIFBhdGhTZWdtZW50KTtcbiAgICByZXR1cm4gZW50cnlQb2ludCAmJiBBYnNvbHV0ZUZzUGF0aC5mcm9tKHBhdGguZGlybmFtZShlbnRyeVBvaW50KSk7XG4gIH1cblxuICAvKipcbiAgICogUmVzb2x2ZSB0aGUgYWJzb2x1dGUgcGF0aCBvZiBhIG1vZHVsZSBmcm9tIGEgcGFydGljdWxhciBzdGFydGluZyBwb2ludC5cbiAgICpcbiAgICogQHBhcmFtIGZyb20gdGhlIGZpbGUgcGF0aCBmcm9tIHdoZXJlIHRvIHN0YXJ0IHRyeWluZyB0byByZXNvbHZlIHRoaXMgbW9kdWxlXG4gICAqIEBwYXJhbSB0byB0aGUgbW9kdWxlIHNwZWNpZmllciBvZiB0aGUgZGVwZW5kZW5jeSB0byByZXNvbHZlXG4gICAqIEByZXR1cm5zIGFuIGFic29sdXRlIHBhdGggdG8gdGhlIGVudHJ5LXBvaW50IG9mIHRoZSBkZXBlbmRlbmN5IG9yIG51bGwgaWYgaXQgY291bGQgbm90IGJlXG4gICAqIHJlc29sdmVkLlxuICAgKi9cbiAgdHJ5UmVzb2x2ZShmcm9tOiBBYnNvbHV0ZUZzUGF0aCwgdG86IFBhdGhTZWdtZW50KTogQWJzb2x1dGVGc1BhdGh8bnVsbCB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBBYnNvbHV0ZUZzUGF0aC5mcm9tKHJlcXVpcmUucmVzb2x2ZSh0bywge3BhdGhzOiBbZnJvbV19KSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgdGhlIGdpdmVuIHN0YXRlbWVudCBpcyBhbiBpbXBvcnQgd2l0aCBhIHN0cmluZyBsaXRlcmFsIG1vZHVsZSBzcGVjaWZpZXIuXG4gICAqIEBwYXJhbSBzdG10IHRoZSBzdGF0ZW1lbnQgbm9kZSB0byBjaGVjay5cbiAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgc3RhdGVtZW50IGlzIGFuIGltcG9ydCB3aXRoIGEgc3RyaW5nIGxpdGVyYWwgbW9kdWxlIHNwZWNpZmllci5cbiAgICovXG4gIGlzU3RyaW5nSW1wb3J0T3JSZWV4cG9ydChzdG10OiB0cy5TdGF0ZW1lbnQpOiBzdG10IGlzIHRzLkltcG9ydERlY2xhcmF0aW9uJlxuICAgICAge21vZHVsZVNwZWNpZmllcjogdHMuU3RyaW5nTGl0ZXJhbH0ge1xuICAgIHJldHVybiB0cy5pc0ltcG9ydERlY2xhcmF0aW9uKHN0bXQpIHx8XG4gICAgICAgIHRzLmlzRXhwb3J0RGVjbGFyYXRpb24oc3RtdCkgJiYgISFzdG10Lm1vZHVsZVNwZWNpZmllciAmJlxuICAgICAgICB0cy5pc1N0cmluZ0xpdGVyYWwoc3RtdC5tb2R1bGVTcGVjaWZpZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgYSBzb3VyY2UgZmlsZSBuZWVkcyB0byBiZSBwYXJzZWQgZm9yIGltcG9ydHMuXG4gICAqIFRoaXMgaXMgYSBwZXJmb3JtYW5jZSBzaG9ydC1jaXJjdWl0LCB3aGljaCBzYXZlcyB1cyBmcm9tIGNyZWF0aW5nXG4gICAqIGEgVHlwZVNjcmlwdCBBU1QgdW5uZWNlc3NhcmlseS5cbiAgICpcbiAgICogQHBhcmFtIHNvdXJjZSBUaGUgY29udGVudCBvZiB0aGUgc291cmNlIGZpbGUgdG8gY2hlY2suXG4gICAqXG4gICAqIEByZXR1cm5zIGZhbHNlIGlmIHRoZXJlIGFyZSBkZWZpbml0ZWx5IG5vIGltcG9ydCBvciByZS1leHBvcnQgc3RhdGVtZW50c1xuICAgKiBpbiB0aGlzIGZpbGUsIHRydWUgb3RoZXJ3aXNlLlxuICAgKi9cbiAgaGFzSW1wb3J0T3JSZWV4cG9ydFN0YXRlbWVudHMoc291cmNlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gLyhpbXBvcnR8ZXhwb3J0KVxccy4rZnJvbS8udGVzdChzb3VyY2UpO1xuICB9XG59XG4iXX0=