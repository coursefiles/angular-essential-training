(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/packages/entry_point_finder", ["require", "exports", "tslib", "canonical-path", "fs", "@angular/compiler-cli/src/ngtsc/path", "@angular/compiler-cli/ngcc/src/packages/entry_point"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var path = require("canonical-path");
    var fs = require("fs");
    var path_1 = require("@angular/compiler-cli/src/ngtsc/path");
    var entry_point_1 = require("@angular/compiler-cli/ngcc/src/packages/entry_point");
    var EntryPointFinder = /** @class */ (function () {
        function EntryPointFinder(logger, resolver) {
            this.logger = logger;
            this.resolver = resolver;
        }
        /**
         * Search the given directory, and sub-directories, for Angular package entry points.
         * @param sourceDirectory An absolute path to the directory to search for entry points.
         */
        EntryPointFinder.prototype.findEntryPoints = function (sourceDirectory, targetEntryPointPath) {
            var unsortedEntryPoints = this.walkDirectoryForEntryPoints(sourceDirectory);
            var targetEntryPoint = targetEntryPointPath ?
                unsortedEntryPoints.find(function (entryPoint) { return entryPoint.path === targetEntryPointPath; }) :
                undefined;
            return this.resolver.sortEntryPointsByDependency(unsortedEntryPoints, targetEntryPoint);
        };
        /**
         * Look for entry points that need to be compiled, starting at the source directory.
         * The function will recurse into directories that start with `@...`, e.g. `@angular/...`.
         * @param sourceDirectory An absolute path to the root directory where searching begins.
         */
        EntryPointFinder.prototype.walkDirectoryForEntryPoints = function (sourceDirectory) {
            var _this = this;
            var entryPoints = [];
            fs.readdirSync(sourceDirectory)
                // Not interested in hidden files
                .filter(function (p) { return !p.startsWith('.'); })
                // Ignore node_modules
                .filter(function (p) { return p !== 'node_modules'; })
                // Only interested in directories (and only those that are not symlinks)
                .filter(function (p) {
                var stat = fs.lstatSync(path.resolve(sourceDirectory, p));
                return stat.isDirectory() && !stat.isSymbolicLink();
            })
                .forEach(function (p) {
                // Either the directory is a potential package or a namespace containing packages (e.g
                // `@angular`).
                var packagePath = path_1.AbsoluteFsPath.from(path.join(sourceDirectory, p));
                if (p.startsWith('@')) {
                    entryPoints.push.apply(entryPoints, tslib_1.__spread(_this.walkDirectoryForEntryPoints(packagePath)));
                }
                else {
                    entryPoints.push.apply(entryPoints, tslib_1.__spread(_this.getEntryPointsForPackage(packagePath)));
                    // Also check for any nested node_modules in this package
                    var nestedNodeModulesPath = path_1.AbsoluteFsPath.from(path.resolve(packagePath, 'node_modules'));
                    if (fs.existsSync(nestedNodeModulesPath)) {
                        entryPoints.push.apply(entryPoints, tslib_1.__spread(_this.walkDirectoryForEntryPoints(nestedNodeModulesPath)));
                    }
                }
            });
            return entryPoints;
        };
        /**
         * Recurse the folder structure looking for all the entry points
         * @param packagePath The absolute path to an npm package that may contain entry points
         * @returns An array of entry points that were discovered.
         */
        EntryPointFinder.prototype.getEntryPointsForPackage = function (packagePath) {
            var _this = this;
            var entryPoints = [];
            // Try to get an entry point from the top level package directory
            var topLevelEntryPoint = entry_point_1.getEntryPointInfo(this.logger, packagePath, packagePath);
            if (topLevelEntryPoint !== null) {
                entryPoints.push(topLevelEntryPoint);
            }
            // Now search all the directories of this package for possible entry points
            this.walkDirectory(packagePath, function (subdir) {
                var subEntryPoint = entry_point_1.getEntryPointInfo(_this.logger, packagePath, subdir);
                if (subEntryPoint !== null) {
                    entryPoints.push(subEntryPoint);
                }
            });
            return entryPoints;
        };
        /**
         * Recursively walk a directory and its sub-directories, applying a given
         * function to each directory.
         * @param dir the directory to recursively walk.
         * @param fn the function to apply to each directory.
         */
        EntryPointFinder.prototype.walkDirectory = function (dir, fn) {
            var _this = this;
            return fs
                .readdirSync(dir)
                // Not interested in hidden files
                .filter(function (p) { return !p.startsWith('.'); })
                // Ignore node_modules
                .filter(function (p) { return p !== 'node_modules'; })
                // Only interested in directories (and only those that are not symlinks)
                .filter(function (p) {
                var stat = fs.lstatSync(path.resolve(dir, p));
                return stat.isDirectory() && !stat.isSymbolicLink();
            })
                .forEach(function (subDir) {
                var resolvedSubDir = path_1.AbsoluteFsPath.from(path.resolve(dir, subDir));
                fn(resolvedSubDir);
                _this.walkDirectory(resolvedSubDir, fn);
            });
        };
        return EntryPointFinder;
    }());
    exports.EntryPointFinder = EntryPointFinder;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50cnlfcG9pbnRfZmluZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL25nY2Mvc3JjL3BhY2thZ2VzL2VudHJ5X3BvaW50X2ZpbmRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFBQTs7Ozs7O09BTUc7SUFDSCxxQ0FBdUM7SUFDdkMsdUJBQXlCO0lBRXpCLDZEQUF1RDtJQUl2RCxtRkFBNEQ7SUFHNUQ7UUFDRSwwQkFBb0IsTUFBYyxFQUFVLFFBQTRCO1lBQXBELFdBQU0sR0FBTixNQUFNLENBQVE7WUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFvQjtRQUFHLENBQUM7UUFDNUU7OztXQUdHO1FBQ0gsMENBQWUsR0FBZixVQUFnQixlQUErQixFQUFFLG9CQUFxQztZQUVwRixJQUFNLG1CQUFtQixHQUFHLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUM5RSxJQUFNLGdCQUFnQixHQUFHLG9CQUFvQixDQUFDLENBQUM7Z0JBQzNDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxVQUFBLFVBQVUsSUFBSSxPQUFBLFVBQVUsQ0FBQyxJQUFJLEtBQUssb0JBQW9CLEVBQXhDLENBQXdDLENBQUMsQ0FBQyxDQUFDO2dCQUNsRixTQUFTLENBQUM7WUFDZCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsMkJBQTJCLENBQUMsbUJBQW1CLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUMxRixDQUFDO1FBRUQ7Ozs7V0FJRztRQUNLLHNEQUEyQixHQUFuQyxVQUFvQyxlQUErQjtZQUFuRSxpQkE4QkM7WUE3QkMsSUFBTSxXQUFXLEdBQWlCLEVBQUUsQ0FBQztZQUNyQyxFQUFFLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQztnQkFDM0IsaUNBQWlDO2lCQUNoQyxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsQ0FB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QWMsRUFBcEIsQ0FBb0IsQ0FBQztnQkFDbEMsd0VBQXdFO2lCQUN2RSxNQUFNLENBQUMsVUFBQSxDQUFDO2dCQUNQLElBQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEQsT0FBTyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDdEQsQ0FBQyxDQUFDO2lCQUNELE9BQU8sQ0FBQyxVQUFBLE1BQU07Z0JBQ2IsSUFBTSxjQUFjLEdBQUcscUJBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDdEUsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUNuQixLQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUN6QyxDQUFDLENBQUMsQ0FBQztRQUNULENBQUM7UUFDSCx1QkFBQztJQUFELENBQUMsQUFyR0QsSUFxR0M7SUFyR1ksNENBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdjYW5vbmljYWwtcGF0aCc7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5cbmltcG9ydCB7QWJzb2x1dGVGc1BhdGh9IGZyb20gJy4uLy4uLy4uL3NyYy9uZ3RzYy9wYXRoJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuLi9sb2dnaW5nL2xvZ2dlcic7XG5cbmltcG9ydCB7RGVwZW5kZW5jeVJlc29sdmVyLCBTb3J0ZWRFbnRyeVBvaW50c0luZm99IGZyb20gJy4vZGVwZW5kZW5jeV9yZXNvbHZlcic7XG5pbXBvcnQge0VudHJ5UG9pbnQsIGdldEVudHJ5UG9pbnRJbmZvfSBmcm9tICcuL2VudHJ5X3BvaW50JztcblxuXG5leHBvcnQgY2xhc3MgRW50cnlQb2ludEZpbmRlciB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbG9nZ2VyOiBMb2dnZXIsIHByaXZhdGUgcmVzb2x2ZXI6IERlcGVuZGVuY3lSZXNvbHZlcikge31cbiAgLyoqXG4gICAqIFNlYXJjaCB0aGUgZ2l2ZW4gZGlyZWN0b3J5LCBhbmQgc3ViLWRpcmVjdG9yaWVzLCBmb3IgQW5ndWxhciBwYWNrYWdlIGVudHJ5IHBvaW50cy5cbiAgICogQHBhcmFtIHNvdXJjZURpcmVjdG9yeSBBbiBhYnNvbHV0ZSBwYXRoIHRvIHRoZSBkaXJlY3RvcnkgdG8gc2VhcmNoIGZvciBlbnRyeSBwb2ludHMuXG4gICAqL1xuICBmaW5kRW50cnlQb2ludHMoc291cmNlRGlyZWN0b3J5OiBBYnNvbHV0ZUZzUGF0aCwgdGFyZ2V0RW50cnlQb2ludFBhdGg/OiBBYnNvbHV0ZUZzUGF0aCk6XG4gICAgICBTb3J0ZWRFbnRyeVBvaW50c0luZm8ge1xuICAgIGNvbnN0IHVuc29ydGVkRW50cnlQb2ludHMgPSB0aGlzLndhbGtEaXJlY3RvcnlGb3JFbnRyeVBvaW50cyhzb3VyY2VEaXJlY3RvcnkpO1xuICAgIGNvbnN0IHRhcmdldEVudHJ5UG9pbnQgPSB0YXJnZXRFbnRyeVBvaW50UGF0aCA/XG4gICAgICAgIHVuc29ydGVkRW50cnlQb2ludHMuZmluZChlbnRyeVBvaW50ID0+IGVudHJ5UG9pbnQucGF0aCA9PT0gdGFyZ2V0RW50cnlQb2ludFBhdGgpIDpcbiAgICAgICAgdW5kZWZpbmVkO1xuICAgIHJldHVybiB0aGlzLnJlc29sdmVyLnNvcnRFbnRyeVBvaW50c0J5RGVwZW5kZW5jeSh1bnNvcnRlZEVudHJ5UG9pbnRzLCB0YXJnZXRFbnRyeVBvaW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb29rIGZvciBlbnRyeSBwb2ludHMgdGhhdCBuZWVkIHRvIGJlIGNvbXBpbGVkLCBzdGFydGluZyBhdCB0aGUgc291cmNlIGRpcmVjdG9yeS5cbiAgICogVGhlIGZ1bmN0aW9uIHdpbGwgcmVjdXJzZSBpbnRvIGRpcmVjdG9yaWVzIHRoYXQgc3RhcnQgd2l0aCBgQC4uLmAsIGUuZy4gYEBhbmd1bGFyLy4uLmAuXG4gICAqIEBwYXJhbSBzb3VyY2VEaXJlY3RvcnkgQW4gYWJzb2x1dGUgcGF0aCB0byB0aGUgcm9vdCBkaXJlY3Rvcnkgd2hlcmUgc2VhcmNoaW5nIGJlZ2lucy5cbiAgICovXG4gIHByaXZhdGUgd2Fsa0RpcmVjdG9yeUZvckVudHJ5UG9pbnRzKHNvdXJjZURpcmVjdG9yeTogQWJzb2x1dGVGc1BhdGgpOiBFbnRyeVBvaW50W10ge1xuICAgIGNvbnN0IGVudHJ5UG9pbnRzOiBFbnRyeVBvaW50W10gPSBbXTtcbiAgICBmcy5yZWFkZGlyU3luYyhzb3VyY2VEaXJlY3RvcnkpXG4gICAgICAgIC8vIE5vdCBpbnRlcmVzdGVkIGluIGhpZGRlbiBmaWxlc1xuICAgICAgICAuZmlsdGVyKHAgPT4gIXAuc3RhcnRzV2l0aCgnLicpKVxuICAgICAgICAvLyBJZ25vcmUgbm9kZV9tb2R1bGVzXG4gICAgICAgIC5maWx0ZXIocCA9PiBwICE9PSAnbm9kZV9tb2R1bGVzJylcbiAgICAgICAgLy8gT25seSBpbnRlcmVzdGVkIGluIGRpcmVjdG9yaWVzIChhbmQgb25seSB0aG9zZSB0aGF0IGFyZSBub3Qgc3ltbGlua3MpXG4gICAgICAgIC5maWx0ZXIocCA9PiB7XG4gICAgICAgICAgY29uc3Qgc3RhdCA9IGZzLmxzdGF0U3luYyhwYXRoLnJlc29sdmUoc291cmNlRGlyZWN0b3J5LCBwKSk7XG4gICAgICAgICAgcmV0dXJuIHN0YXQuaXNEaXJlY3RvcnkoKSAmJiAhc3RhdC5pc1N5bWJvbGljTGluaygpO1xuICAgICAgICB9KVxuICAgICAgICAuZm9yRWFjaChwID0+IHtcbiAgICAgICAgICAvLyBFaXRoZXIgdGhlIGRpcmVjdG9yeSBpcyBhIHBvdGVudGlhbCBwYWNrYWdlIG9yIGEgbmFtZXNwYWNlIGNvbnRhaW5pbmcgcGFja2FnZXMgKGUuZ1xuICAgICAgICAgIC8vIGBAYW5ndWxhcmApLlxuICAgICAgICAgIGNvbnN0IHBhY2thZ2VQYXRoID0gQWJzb2x1dGVGc1BhdGguZnJvbShwYXRoLmpvaW4oc291cmNlRGlyZWN0b3J5LCBwKSk7XG4gICAgICAgICAgaWYgKHAuc3RhcnRzV2l0aCgnQCcpKSB7XG4gICAgICAgICAgICBlbnRyeVBvaW50cy5wdXNoKC4uLnRoaXMud2Fsa0RpcmVjdG9yeUZvckVudHJ5UG9pbnRzKHBhY2thZ2VQYXRoKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVudHJ5UG9pbnRzLnB1c2goLi4udGhpcy5nZXRFbnRyeVBvaW50c0ZvclBhY2thZ2UocGFja2FnZVBhdGgpKTtcblxuICAgICAgICAgICAgLy8gQWxzbyBjaGVjayBmb3IgYW55IG5lc3RlZCBub2RlX21vZHVsZXMgaW4gdGhpcyBwYWNrYWdlXG4gICAgICAgICAgICBjb25zdCBuZXN0ZWROb2RlTW9kdWxlc1BhdGggPVxuICAgICAgICAgICAgICAgIEFic29sdXRlRnNQYXRoLmZyb20ocGF0aC5yZXNvbHZlKHBhY2thZ2VQYXRoLCAnbm9kZV9tb2R1bGVzJykpO1xuICAgICAgICAgICAgaWYgKGZzLmV4aXN0c1N5bmMobmVzdGVkTm9kZU1vZHVsZXNQYXRoKSkge1xuICAgICAgICAgICAgICBlbnRyeVBvaW50cy5wdXNoKC4uLnRoaXMud2Fsa0RpcmVjdG9yeUZvckVudHJ5UG9pbnRzKG5lc3RlZE5vZGVNb2R1bGVzUGF0aCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgcmV0dXJuIGVudHJ5UG9pbnRzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlY3Vyc2UgdGhlIGZvbGRlciBzdHJ1Y3R1cmUgbG9va2luZyBmb3IgYWxsIHRoZSBlbnRyeSBwb2ludHNcbiAgICogQHBhcmFtIHBhY2thZ2VQYXRoIFRoZSBhYnNvbHV0ZSBwYXRoIHRvIGFuIG5wbSBwYWNrYWdlIHRoYXQgbWF5IGNvbnRhaW4gZW50cnkgcG9pbnRzXG4gICAqIEByZXR1cm5zIEFuIGFycmF5IG9mIGVudHJ5IHBvaW50cyB0aGF0IHdlcmUgZGlzY292ZXJlZC5cbiAgICovXG4gIHByaXZhdGUgZ2V0RW50cnlQb2ludHNGb3JQYWNrYWdlKHBhY2thZ2VQYXRoOiBBYnNvbHV0ZUZzUGF0aCk6IEVudHJ5UG9pbnRbXSB7XG4gICAgY29uc3QgZW50cnlQb2ludHM6IEVudHJ5UG9pbnRbXSA9IFtdO1xuXG4gICAgLy8gVHJ5IHRvIGdldCBhbiBlbnRyeSBwb2ludCBmcm9tIHRoZSB0b3AgbGV2ZWwgcGFja2FnZSBkaXJlY3RvcnlcbiAgICBjb25zdCB0b3BMZXZlbEVudHJ5UG9pbnQgPSBnZXRFbnRyeVBvaW50SW5mbyh0aGlzLmxvZ2dlciwgcGFja2FnZVBhdGgsIHBhY2thZ2VQYXRoKTtcbiAgICBpZiAodG9wTGV2ZWxFbnRyeVBvaW50ICE9PSBudWxsKSB7XG4gICAgICBlbnRyeVBvaW50cy5wdXNoKHRvcExldmVsRW50cnlQb2ludCk7XG4gICAgfVxuXG4gICAgLy8gTm93IHNlYXJjaCBhbGwgdGhlIGRpcmVjdG9yaWVzIG9mIHRoaXMgcGFja2FnZSBmb3IgcG9zc2libGUgZW50cnkgcG9pbnRzXG4gICAgdGhpcy53YWxrRGlyZWN0b3J5KHBhY2thZ2VQYXRoLCBzdWJkaXIgPT4ge1xuICAgICAgY29uc3Qgc3ViRW50cnlQb2ludCA9IGdldEVudHJ5UG9pbnRJbmZvKHRoaXMubG9nZ2VyLCBwYWNrYWdlUGF0aCwgc3ViZGlyKTtcbiAgICAgIGlmIChzdWJFbnRyeVBvaW50ICE9PSBudWxsKSB7XG4gICAgICAgIGVudHJ5UG9pbnRzLnB1c2goc3ViRW50cnlQb2ludCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZW50cnlQb2ludHM7XG4gIH1cblxuICAvKipcbiAgICogUmVjdXJzaXZlbHkgd2FsayBhIGRpcmVjdG9yeSBhbmQgaXRzIHN1Yi1kaXJlY3RvcmllcywgYXBwbHlpbmcgYSBnaXZlblxuICAgKiBmdW5jdGlvbiB0byBlYWNoIGRpcmVjdG9yeS5cbiAgICogQHBhcmFtIGRpciB0aGUgZGlyZWN0b3J5IHRvIHJlY3Vyc2l2ZWx5IHdhbGsuXG4gICAqIEBwYXJhbSBmbiB0aGUgZnVuY3Rpb24gdG8gYXBwbHkgdG8gZWFjaCBkaXJlY3RvcnkuXG4gICAqL1xuICBwcml2YXRlIHdhbGtEaXJlY3RvcnkoZGlyOiBBYnNvbHV0ZUZzUGF0aCwgZm46IChkaXI6IEFic29sdXRlRnNQYXRoKSA9PiB2b2lkKSB7XG4gICAgcmV0dXJuIGZzXG4gICAgICAgIC5yZWFkZGlyU3luYyhkaXIpXG4gICAgICAgIC8vIE5vdCBpbnRlcmVzdGVkIGluIGhpZGRlbiBmaWxlc1xuICAgICAgICAuZmlsdGVyKHAgPT4gIXAuc3RhcnRzV2l0aCgnLicpKVxuICAgICAgICAvLyBJZ25vcmUgbm9kZV9tb2R1bGVzXG4gICAgICAgIC5maWx0ZXIocCA9PiBwICE9PSAnbm9kZV9tb2R1bGVzJylcbiAgICAgICAgLy8gT25seSBpbnRlcmVzdGVkIGluIGRpcmVjdG9yaWVzIChhbmQgb25seSB0aG9zZSB0aGF0IGFyZSBub3Qgc3ltbGlua3MpXG4gICAgICAgIC5maWx0ZXIocCA9PiB7XG4gICAgICAgICAgY29uc3Qgc3RhdCA9IGZzLmxzdGF0U3luYyhwYXRoLnJlc29sdmUoZGlyLCBwKSk7XG4gICAgICAgICAgcmV0dXJuIHN0YXQuaXNEaXJlY3RvcnkoKSAmJiAhc3RhdC5pc1N5bWJvbGljTGluaygpO1xuICAgICAgICB9KVxuICAgICAgICAuZm9yRWFjaChzdWJEaXIgPT4ge1xuICAgICAgICAgIGNvbnN0IHJlc29sdmVkU3ViRGlyID0gQWJzb2x1dGVGc1BhdGguZnJvbShwYXRoLnJlc29sdmUoZGlyLCBzdWJEaXIpKTtcbiAgICAgICAgICBmbihyZXNvbHZlZFN1YkRpcik7XG4gICAgICAgICAgdGhpcy53YWxrRGlyZWN0b3J5KHJlc29sdmVkU3ViRGlyLCBmbik7XG4gICAgICAgIH0pO1xuICB9XG59XG4iXX0=