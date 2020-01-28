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
        define("@angular/compiler-cli/src/ngtsc/path/src/logical", ["require", "exports", "tslib", "path", "@angular/compiler-cli/src/ngtsc/path/src/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    /// <reference types="node" />
    var path = require("path");
    var util_1 = require("@angular/compiler-cli/src/ngtsc/path/src/util");
    exports.LogicalProjectPath = {
        /**
         * Get the relative path between two `LogicalProjectPath`s.
         *
         * This will return a `PathSegment` which would be a valid module specifier to use in `from` when
         * importing from `to`.
         */
        relativePathBetween: function (from, to) {
            var relativePath = path.posix.relative(path.posix.dirname(from), to);
            if (!relativePath.startsWith('../')) {
                relativePath = ('./' + relativePath);
            }
            return relativePath;
        },
    };
    /**
     * A utility class which can translate absolute paths to source files into logical paths in
     * TypeScript's logical file system, based on the root directories of the project.
     */
    var LogicalFileSystem = /** @class */ (function () {
        function LogicalFileSystem(rootDirs) {
            /**
             * A cache of file paths to project paths, because computation of these paths is slightly
             * expensive.
             */
            this.cache = new Map();
            // Make a copy and sort it by length in reverse order (longest first). This speeds up lookups,
            // since there's no need to keep going through the array once a match is found.
            this.rootDirs = rootDirs.concat([]).sort(function (a, b) { return b.length - a.length; });
        }
        /**
         * Get the logical path in the project of a `ts.SourceFile`.
         *
         * This method is provided as a convenient alternative to calling
         * `logicalPathOfFile(AbsoluteFsPath.fromSourceFile(sf))`.
         */
        LogicalFileSystem.prototype.logicalPathOfSf = function (sf) {
            return this.logicalPathOfFile(sf.fileName);
        };
        /**
         * Get the logical path in the project of a source file.
         *
         * @returns A `LogicalProjectPath` to the source file, or `null` if the source file is not in any
         * of the TS project's root directories.
         */
        LogicalFileSystem.prototype.logicalPathOfFile = function (physicalFile) {
            var e_1, _a;
            if (!this.cache.has(physicalFile)) {
                var logicalFile = null;
                try {
                    for (var _b = tslib_1.__values(this.rootDirs), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var rootDir = _c.value;
                        if (physicalFile.startsWith(rootDir)) {
                            logicalFile = this.createLogicalProjectPath(physicalFile, rootDir);
                            // The logical project does not include any special "node_modules" nested directories.
                            if (logicalFile.indexOf('/node_modules/') !== -1) {
                                logicalFile = null;
                            }
                            else {
                                break;
                            }
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                this.cache.set(physicalFile, logicalFile);
            }
            return this.cache.get(physicalFile);
        };
        LogicalFileSystem.prototype.createLogicalProjectPath = function (file, rootDir) {
            var logicalPath = util_1.stripExtension(file.substr(rootDir.length));
            return (logicalPath.startsWith('/') ? logicalPath : '/' + logicalPath);
        };
        return LogicalFileSystem;
    }());
    exports.LogicalFileSystem = LogicalFileSystem;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naWNhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvcGF0aC9zcmMvbG9naWNhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7SUFFSCw4QkFBOEI7SUFDOUIsMkJBQTZCO0lBSzdCLHNFQUFzQztJQVV6QixRQUFBLGtCQUFrQixHQUFHO1FBQ2hDOzs7OztXQUtHO1FBQ0gsbUJBQW1CLEVBQUUsVUFBUyxJQUF3QixFQUFFLEVBQXNCO1lBQzVFLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3JFLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNuQyxZQUFZLEdBQUcsQ0FBQyxJQUFJLEdBQUcsWUFBWSxDQUFDLENBQUM7YUFDdEM7WUFDRCxPQUFPLFlBQTJCLENBQUM7UUFDckMsQ0FBQztLQUNGLENBQUM7SUFFRjs7O09BR0c7SUFDSDtRQVlFLDJCQUFZLFFBQTBCO1lBTnRDOzs7ZUFHRztZQUNLLFVBQUssR0FBaUQsSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUd0RSw4RkFBOEY7WUFDOUYsK0VBQStFO1lBQy9FLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFuQixDQUFtQixDQUFDLENBQUM7UUFDMUUsQ0FBQztRQUVEOzs7OztXQUtHO1FBQ0gsMkNBQWUsR0FBZixVQUFnQixFQUFpQjtZQUMvQixPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsUUFBMEIsQ0FBQyxDQUFDO1FBQy9ELENBQUM7UUFFRDs7Ozs7V0FLRztRQUNILDZDQUFpQixHQUFqQixVQUFrQixZQUE0Qjs7WUFDNUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFO2dCQUNqQyxJQUFJLFdBQVcsR0FBNEIsSUFBSSxDQUFDOztvQkFDaEQsS0FBc0IsSUFBQSxLQUFBLGlCQUFBLElBQUksQ0FBQyxRQUFRLENBQUEsZ0JBQUEsNEJBQUU7d0JBQWhDLElBQU0sT0FBTyxXQUFBO3dCQUNoQixJQUFJLFlBQVksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUU7NEJBQ3BDLFdBQVcsR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFDOzRCQUNuRSxzRkFBc0Y7NEJBQ3RGLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO2dDQUNoRCxXQUFXLEdBQUcsSUFBSSxDQUFDOzZCQUNwQjtpQ0FBTTtnQ0FDTCxNQUFNOzZCQUNQO3lCQUNGO3FCQUNGOzs7Ozs7Ozs7Z0JBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLFdBQVcsQ0FBQyxDQUFDO2FBQzNDO1lBQ0QsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUcsQ0FBQztRQUN4QyxDQUFDO1FBRU8sb0RBQXdCLEdBQWhDLFVBQWlDLElBQW9CLEVBQUUsT0FBdUI7WUFFNUUsSUFBTSxXQUFXLEdBQUcscUJBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2hFLE9BQU8sQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxXQUFXLENBQXVCLENBQUM7UUFDL0YsQ0FBQztRQUNILHdCQUFDO0lBQUQsQ0FBQyxBQTFERCxJQTBEQztJQTFEWSw4Q0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwibm9kZVwiIC8+XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuaW1wb3J0IHtBYnNvbHV0ZUZzUGF0aCwgQnJhbmRlZFBhdGgsIFBhdGhTZWdtZW50fSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7c3RyaXBFeHRlbnNpb259IGZyb20gJy4vdXRpbCc7XG5cbi8qKlxuICogQSBwYXRoIHRoYXQncyByZWxhdGl2ZSB0byB0aGUgbG9naWNhbCByb290IG9mIGEgVHlwZVNjcmlwdCBwcm9qZWN0IChvbmUgb2YgdGhlIHByb2plY3Qnc1xuICogcm9vdERpcnMpLlxuICpcbiAqIFBhdGhzIGluIHRoZSB0eXBlIHN5c3RlbSB1c2UgUE9TSVggZm9ybWF0LlxuICovXG5leHBvcnQgdHlwZSBMb2dpY2FsUHJvamVjdFBhdGggPSBCcmFuZGVkUGF0aDwnTG9naWNhbFByb2plY3RQYXRoJz47XG5cbmV4cG9ydCBjb25zdCBMb2dpY2FsUHJvamVjdFBhdGggPSB7XG4gIC8qKlxuICAgKiBHZXQgdGhlIHJlbGF0aXZlIHBhdGggYmV0d2VlbiB0d28gYExvZ2ljYWxQcm9qZWN0UGF0aGBzLlxuICAgKlxuICAgKiBUaGlzIHdpbGwgcmV0dXJuIGEgYFBhdGhTZWdtZW50YCB3aGljaCB3b3VsZCBiZSBhIHZhbGlkIG1vZHVsZSBzcGVjaWZpZXIgdG8gdXNlIGluIGBmcm9tYCB3aGVuXG4gICAqIGltcG9ydGluZyBmcm9tIGB0b2AuXG4gICAqL1xuICByZWxhdGl2ZVBhdGhCZXR3ZWVuOiBmdW5jdGlvbihmcm9tOiBMb2dpY2FsUHJvamVjdFBhdGgsIHRvOiBMb2dpY2FsUHJvamVjdFBhdGgpOiBQYXRoU2VnbWVudCB7XG4gICAgbGV0IHJlbGF0aXZlUGF0aCA9IHBhdGgucG9zaXgucmVsYXRpdmUocGF0aC5wb3NpeC5kaXJuYW1lKGZyb20pLCB0byk7XG4gICAgaWYgKCFyZWxhdGl2ZVBhdGguc3RhcnRzV2l0aCgnLi4vJykpIHtcbiAgICAgIHJlbGF0aXZlUGF0aCA9ICgnLi8nICsgcmVsYXRpdmVQYXRoKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlbGF0aXZlUGF0aCBhcyBQYXRoU2VnbWVudDtcbiAgfSxcbn07XG5cbi8qKlxuICogQSB1dGlsaXR5IGNsYXNzIHdoaWNoIGNhbiB0cmFuc2xhdGUgYWJzb2x1dGUgcGF0aHMgdG8gc291cmNlIGZpbGVzIGludG8gbG9naWNhbCBwYXRocyBpblxuICogVHlwZVNjcmlwdCdzIGxvZ2ljYWwgZmlsZSBzeXN0ZW0sIGJhc2VkIG9uIHRoZSByb290IGRpcmVjdG9yaWVzIG9mIHRoZSBwcm9qZWN0LlxuICovXG5leHBvcnQgY2xhc3MgTG9naWNhbEZpbGVTeXN0ZW0ge1xuICAvKipcbiAgICogVGhlIHJvb3QgZGlyZWN0b3JpZXMgb2YgdGhlIHByb2plY3QsIHNvcnRlZCB3aXRoIHRoZSBsb25nZXN0IHBhdGggZmlyc3QuXG4gICAqL1xuICBwcml2YXRlIHJvb3REaXJzOiBBYnNvbHV0ZUZzUGF0aFtdO1xuXG4gIC8qKlxuICAgKiBBIGNhY2hlIG9mIGZpbGUgcGF0aHMgdG8gcHJvamVjdCBwYXRocywgYmVjYXVzZSBjb21wdXRhdGlvbiBvZiB0aGVzZSBwYXRocyBpcyBzbGlnaHRseVxuICAgKiBleHBlbnNpdmUuXG4gICAqL1xuICBwcml2YXRlIGNhY2hlOiBNYXA8QWJzb2x1dGVGc1BhdGgsIExvZ2ljYWxQcm9qZWN0UGF0aHxudWxsPiA9IG5ldyBNYXAoKTtcblxuICBjb25zdHJ1Y3Rvcihyb290RGlyczogQWJzb2x1dGVGc1BhdGhbXSkge1xuICAgIC8vIE1ha2UgYSBjb3B5IGFuZCBzb3J0IGl0IGJ5IGxlbmd0aCBpbiByZXZlcnNlIG9yZGVyIChsb25nZXN0IGZpcnN0KS4gVGhpcyBzcGVlZHMgdXAgbG9va3VwcyxcbiAgICAvLyBzaW5jZSB0aGVyZSdzIG5vIG5lZWQgdG8ga2VlcCBnb2luZyB0aHJvdWdoIHRoZSBhcnJheSBvbmNlIGEgbWF0Y2ggaXMgZm91bmQuXG4gICAgdGhpcy5yb290RGlycyA9IHJvb3REaXJzLmNvbmNhdChbXSkuc29ydCgoYSwgYikgPT4gYi5sZW5ndGggLSBhLmxlbmd0aCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBsb2dpY2FsIHBhdGggaW4gdGhlIHByb2plY3Qgb2YgYSBgdHMuU291cmNlRmlsZWAuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGlzIHByb3ZpZGVkIGFzIGEgY29udmVuaWVudCBhbHRlcm5hdGl2ZSB0byBjYWxsaW5nXG4gICAqIGBsb2dpY2FsUGF0aE9mRmlsZShBYnNvbHV0ZUZzUGF0aC5mcm9tU291cmNlRmlsZShzZikpYC5cbiAgICovXG4gIGxvZ2ljYWxQYXRoT2ZTZihzZjogdHMuU291cmNlRmlsZSk6IExvZ2ljYWxQcm9qZWN0UGF0aHxudWxsIHtcbiAgICByZXR1cm4gdGhpcy5sb2dpY2FsUGF0aE9mRmlsZShzZi5maWxlTmFtZSBhcyBBYnNvbHV0ZUZzUGF0aCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBsb2dpY2FsIHBhdGggaW4gdGhlIHByb2plY3Qgb2YgYSBzb3VyY2UgZmlsZS5cbiAgICpcbiAgICogQHJldHVybnMgQSBgTG9naWNhbFByb2plY3RQYXRoYCB0byB0aGUgc291cmNlIGZpbGUsIG9yIGBudWxsYCBpZiB0aGUgc291cmNlIGZpbGUgaXMgbm90IGluIGFueVxuICAgKiBvZiB0aGUgVFMgcHJvamVjdCdzIHJvb3QgZGlyZWN0b3JpZXMuXG4gICAqL1xuICBsb2dpY2FsUGF0aE9mRmlsZShwaHlzaWNhbEZpbGU6IEFic29sdXRlRnNQYXRoKTogTG9naWNhbFByb2plY3RQYXRofG51bGwge1xuICAgIGlmICghdGhpcy5jYWNoZS5oYXMocGh5c2ljYWxGaWxlKSkge1xuICAgICAgbGV0IGxvZ2ljYWxGaWxlOiBMb2dpY2FsUHJvamVjdFBhdGh8bnVsbCA9IG51bGw7XG4gICAgICBmb3IgKGNvbnN0IHJvb3REaXIgb2YgdGhpcy5yb290RGlycykge1xuICAgICAgICBpZiAocGh5c2ljYWxGaWxlLnN0YXJ0c1dpdGgocm9vdERpcikpIHtcbiAgICAgICAgICBsb2dpY2FsRmlsZSA9IHRoaXMuY3JlYXRlTG9naWNhbFByb2plY3RQYXRoKHBoeXNpY2FsRmlsZSwgcm9vdERpcik7XG4gICAgICAgICAgLy8gVGhlIGxvZ2ljYWwgcHJvamVjdCBkb2VzIG5vdCBpbmNsdWRlIGFueSBzcGVjaWFsIFwibm9kZV9tb2R1bGVzXCIgbmVzdGVkIGRpcmVjdG9yaWVzLlxuICAgICAgICAgIGlmIChsb2dpY2FsRmlsZS5pbmRleE9mKCcvbm9kZV9tb2R1bGVzLycpICE9PSAtMSkge1xuICAgICAgICAgICAgbG9naWNhbEZpbGUgPSBudWxsO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuY2FjaGUuc2V0KHBoeXNpY2FsRmlsZSwgbG9naWNhbEZpbGUpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jYWNoZS5nZXQocGh5c2ljYWxGaWxlKSAhO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVMb2dpY2FsUHJvamVjdFBhdGgoZmlsZTogQWJzb2x1dGVGc1BhdGgsIHJvb3REaXI6IEFic29sdXRlRnNQYXRoKTpcbiAgICAgIExvZ2ljYWxQcm9qZWN0UGF0aCB7XG4gICAgY29uc3QgbG9naWNhbFBhdGggPSBzdHJpcEV4dGVuc2lvbihmaWxlLnN1YnN0cihyb290RGlyLmxlbmd0aCkpO1xuICAgIHJldHVybiAobG9naWNhbFBhdGguc3RhcnRzV2l0aCgnLycpID8gbG9naWNhbFBhdGggOiAnLycgKyBsb2dpY2FsUGF0aCkgYXMgTG9naWNhbFByb2plY3RQYXRoO1xuICB9XG59XG4iXX0=