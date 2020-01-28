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
        define("@angular/compiler-cli/src/ngtsc/incremental/src/state", ["require", "exports", "tslib"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    /**
     * Accumulates state between compilations.
     */
    var IncrementalState = /** @class */ (function () {
        function IncrementalState(unchangedFiles, metadata) {
            this.unchangedFiles = unchangedFiles;
            this.metadata = metadata;
        }
        IncrementalState.reconcile = function (previousState, oldProgram, newProgram) {
            var e_1, _a, e_2, _b;
            var unchangedFiles = new Set();
            var metadata = new Map();
            // Compute the set of files that's unchanged.
            var oldFiles = new Set();
            try {
                for (var _c = tslib_1.__values(oldProgram.getSourceFiles()), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var oldFile = _d.value;
                    if (!oldFile.isDeclarationFile) {
                        oldFiles.add(oldFile);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
            try {
                // Look for files in the new program which haven't changed.
                for (var _e = tslib_1.__values(newProgram.getSourceFiles()), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var newFile = _f.value;
                    if (oldFiles.has(newFile)) {
                        unchangedFiles.add(newFile);
                        // Copy over metadata for the unchanged file if available.
                        if (previousState.metadata.has(newFile)) {
                            metadata.set(newFile, previousState.metadata.get(newFile));
                        }
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return new IncrementalState(unchangedFiles, metadata);
        };
        IncrementalState.fresh = function () {
            return new IncrementalState(new Set(), new Map());
        };
        IncrementalState.prototype.safeToSkipEmit = function (sf) {
            if (!this.unchangedFiles.has(sf)) {
                // The file has changed since the last run, and must be re-emitted.
                return false;
            }
            // The file hasn't changed since the last emit. Whether or not it's safe to emit depends on
            // what metadata was gathered about the file.
            if (!this.metadata.has(sf)) {
                // The file has no metadata from the previous or current compilations, so it must be emitted.
                return false;
            }
            var meta = this.metadata.get(sf);
            // Check if this file was explicitly marked as safe. This would only be done if every
            // `DecoratorHandler` agreed that the file didn't depend on any other file's contents.
            if (meta.safeToSkipEmitIfUnchanged) {
                return true;
            }
            // The file wasn't explicitly marked as safe to skip emitting, so require an emit.
            return false;
        };
        IncrementalState.prototype.markFileAsSafeToSkipEmitIfUnchanged = function (sf) {
            this.metadata.set(sf, {
                safeToSkipEmitIfUnchanged: true,
            });
        };
        return IncrementalState;
    }());
    exports.IncrementalState = IncrementalState;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL2luY3JlbWVudGFsL3NyYy9zdGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7SUFJSDs7T0FFRztJQUNIO1FBQ0UsMEJBQ1ksY0FBa0MsRUFDbEMsUUFBMEM7WUFEMUMsbUJBQWMsR0FBZCxjQUFjLENBQW9CO1lBQ2xDLGFBQVEsR0FBUixRQUFRLENBQWtDO1FBQUcsQ0FBQztRQUVuRCwwQkFBUyxHQUFoQixVQUFpQixhQUErQixFQUFFLFVBQXNCLEVBQUUsVUFBc0I7O1lBRTlGLElBQU0sY0FBYyxHQUFHLElBQUksR0FBRyxFQUFpQixDQUFDO1lBQ2hELElBQU0sUUFBUSxHQUFHLElBQUksR0FBRyxFQUErQixDQUFDO1lBRXhELDZDQUE2QztZQUM3QyxJQUFNLFFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBaUIsQ0FBQzs7Z0JBQzFDLEtBQXNCLElBQUEsS0FBQSxpQkFBQSxVQUFVLENBQUMsY0FBYyxFQUFFLENBQUEsZ0JBQUEsNEJBQUU7b0JBQTlDLElBQU0sT0FBTyxXQUFBO29CQUNoQixJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFO3dCQUM5QixRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO3FCQUN2QjtpQkFDRjs7Ozs7Ozs7OztnQkFFRCwyREFBMkQ7Z0JBQzNELEtBQXNCLElBQUEsS0FBQSxpQkFBQSxVQUFVLENBQUMsY0FBYyxFQUFFLENBQUEsZ0JBQUEsNEJBQUU7b0JBQTlDLElBQU0sT0FBTyxXQUFBO29CQUNoQixJQUFJLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUU7d0JBQ3pCLGNBQWMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7d0JBRTVCLDBEQUEwRDt3QkFDMUQsSUFBSSxhQUFhLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRTs0QkFDdkMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFHLENBQUMsQ0FBQzt5QkFDOUQ7cUJBQ0Y7aUJBQ0Y7Ozs7Ozs7OztZQUVELE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUVNLHNCQUFLLEdBQVo7WUFDRSxPQUFPLElBQUksZ0JBQWdCLENBQUMsSUFBSSxHQUFHLEVBQWlCLEVBQUUsSUFBSSxHQUFHLEVBQStCLENBQUMsQ0FBQztRQUNoRyxDQUFDO1FBRUQseUNBQWMsR0FBZCxVQUFlLEVBQWlCO1lBQzlCLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtnQkFDaEMsbUVBQW1FO2dCQUNuRSxPQUFPLEtBQUssQ0FBQzthQUNkO1lBRUQsMkZBQTJGO1lBQzNGLDZDQUE2QztZQUU3QyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7Z0JBQzFCLDZGQUE2RjtnQkFDN0YsT0FBTyxLQUFLLENBQUM7YUFDZDtZQUVELElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBRyxDQUFDO1lBRXJDLHFGQUFxRjtZQUNyRixzRkFBc0Y7WUFDdEYsSUFBSSxJQUFJLENBQUMseUJBQXlCLEVBQUU7Z0JBQ2xDLE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFFRCxrRkFBa0Y7WUFDbEYsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO1FBRUQsOERBQW1DLEdBQW5DLFVBQW9DLEVBQWlCO1lBQ25ELElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRTtnQkFDcEIseUJBQXlCLEVBQUUsSUFBSTthQUNoQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBQ0gsdUJBQUM7SUFBRCxDQUFDLEFBcEVELElBb0VDO0lBcEVZLDRDQUFnQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbi8qKlxuICogQWNjdW11bGF0ZXMgc3RhdGUgYmV0d2VlbiBjb21waWxhdGlvbnMuXG4gKi9cbmV4cG9ydCBjbGFzcyBJbmNyZW1lbnRhbFN0YXRlIHtcbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgdW5jaGFuZ2VkRmlsZXM6IFNldDx0cy5Tb3VyY2VGaWxlPixcbiAgICAgIHByaXZhdGUgbWV0YWRhdGE6IE1hcDx0cy5Tb3VyY2VGaWxlLCBGaWxlTWV0YWRhdGE+KSB7fVxuXG4gIHN0YXRpYyByZWNvbmNpbGUocHJldmlvdXNTdGF0ZTogSW5jcmVtZW50YWxTdGF0ZSwgb2xkUHJvZ3JhbTogdHMuUHJvZ3JhbSwgbmV3UHJvZ3JhbTogdHMuUHJvZ3JhbSk6XG4gICAgICBJbmNyZW1lbnRhbFN0YXRlIHtcbiAgICBjb25zdCB1bmNoYW5nZWRGaWxlcyA9IG5ldyBTZXQ8dHMuU291cmNlRmlsZT4oKTtcbiAgICBjb25zdCBtZXRhZGF0YSA9IG5ldyBNYXA8dHMuU291cmNlRmlsZSwgRmlsZU1ldGFkYXRhPigpO1xuXG4gICAgLy8gQ29tcHV0ZSB0aGUgc2V0IG9mIGZpbGVzIHRoYXQncyB1bmNoYW5nZWQuXG4gICAgY29uc3Qgb2xkRmlsZXMgPSBuZXcgU2V0PHRzLlNvdXJjZUZpbGU+KCk7XG4gICAgZm9yIChjb25zdCBvbGRGaWxlIG9mIG9sZFByb2dyYW0uZ2V0U291cmNlRmlsZXMoKSkge1xuICAgICAgaWYgKCFvbGRGaWxlLmlzRGVjbGFyYXRpb25GaWxlKSB7XG4gICAgICAgIG9sZEZpbGVzLmFkZChvbGRGaWxlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBMb29rIGZvciBmaWxlcyBpbiB0aGUgbmV3IHByb2dyYW0gd2hpY2ggaGF2ZW4ndCBjaGFuZ2VkLlxuICAgIGZvciAoY29uc3QgbmV3RmlsZSBvZiBuZXdQcm9ncmFtLmdldFNvdXJjZUZpbGVzKCkpIHtcbiAgICAgIGlmIChvbGRGaWxlcy5oYXMobmV3RmlsZSkpIHtcbiAgICAgICAgdW5jaGFuZ2VkRmlsZXMuYWRkKG5ld0ZpbGUpO1xuXG4gICAgICAgIC8vIENvcHkgb3ZlciBtZXRhZGF0YSBmb3IgdGhlIHVuY2hhbmdlZCBmaWxlIGlmIGF2YWlsYWJsZS5cbiAgICAgICAgaWYgKHByZXZpb3VzU3RhdGUubWV0YWRhdGEuaGFzKG5ld0ZpbGUpKSB7XG4gICAgICAgICAgbWV0YWRhdGEuc2V0KG5ld0ZpbGUsIHByZXZpb3VzU3RhdGUubWV0YWRhdGEuZ2V0KG5ld0ZpbGUpICEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBJbmNyZW1lbnRhbFN0YXRlKHVuY2hhbmdlZEZpbGVzLCBtZXRhZGF0YSk7XG4gIH1cblxuICBzdGF0aWMgZnJlc2goKTogSW5jcmVtZW50YWxTdGF0ZSB7XG4gICAgcmV0dXJuIG5ldyBJbmNyZW1lbnRhbFN0YXRlKG5ldyBTZXQ8dHMuU291cmNlRmlsZT4oKSwgbmV3IE1hcDx0cy5Tb3VyY2VGaWxlLCBGaWxlTWV0YWRhdGE+KCkpO1xuICB9XG5cbiAgc2FmZVRvU2tpcEVtaXQoc2Y6IHRzLlNvdXJjZUZpbGUpOiBib29sZWFuIHtcbiAgICBpZiAoIXRoaXMudW5jaGFuZ2VkRmlsZXMuaGFzKHNmKSkge1xuICAgICAgLy8gVGhlIGZpbGUgaGFzIGNoYW5nZWQgc2luY2UgdGhlIGxhc3QgcnVuLCBhbmQgbXVzdCBiZSByZS1lbWl0dGVkLlxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIFRoZSBmaWxlIGhhc24ndCBjaGFuZ2VkIHNpbmNlIHRoZSBsYXN0IGVtaXQuIFdoZXRoZXIgb3Igbm90IGl0J3Mgc2FmZSB0byBlbWl0IGRlcGVuZHMgb25cbiAgICAvLyB3aGF0IG1ldGFkYXRhIHdhcyBnYXRoZXJlZCBhYm91dCB0aGUgZmlsZS5cblxuICAgIGlmICghdGhpcy5tZXRhZGF0YS5oYXMoc2YpKSB7XG4gICAgICAvLyBUaGUgZmlsZSBoYXMgbm8gbWV0YWRhdGEgZnJvbSB0aGUgcHJldmlvdXMgb3IgY3VycmVudCBjb21waWxhdGlvbnMsIHNvIGl0IG11c3QgYmUgZW1pdHRlZC5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBtZXRhID0gdGhpcy5tZXRhZGF0YS5nZXQoc2YpICE7XG5cbiAgICAvLyBDaGVjayBpZiB0aGlzIGZpbGUgd2FzIGV4cGxpY2l0bHkgbWFya2VkIGFzIHNhZmUuIFRoaXMgd291bGQgb25seSBiZSBkb25lIGlmIGV2ZXJ5XG4gICAgLy8gYERlY29yYXRvckhhbmRsZXJgIGFncmVlZCB0aGF0IHRoZSBmaWxlIGRpZG4ndCBkZXBlbmQgb24gYW55IG90aGVyIGZpbGUncyBjb250ZW50cy5cbiAgICBpZiAobWV0YS5zYWZlVG9Ta2lwRW1pdElmVW5jaGFuZ2VkKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBUaGUgZmlsZSB3YXNuJ3QgZXhwbGljaXRseSBtYXJrZWQgYXMgc2FmZSB0byBza2lwIGVtaXR0aW5nLCBzbyByZXF1aXJlIGFuIGVtaXQuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgbWFya0ZpbGVBc1NhZmVUb1NraXBFbWl0SWZVbmNoYW5nZWQoc2Y6IHRzLlNvdXJjZUZpbGUpOiB2b2lkIHtcbiAgICB0aGlzLm1ldGFkYXRhLnNldChzZiwge1xuICAgICAgc2FmZVRvU2tpcEVtaXRJZlVuY2hhbmdlZDogdHJ1ZSxcbiAgICB9KTtcbiAgfVxufVxuXG5pbnRlcmZhY2UgRmlsZU1ldGFkYXRhIHtcbiAgc2FmZVRvU2tpcEVtaXRJZlVuY2hhbmdlZDogYm9vbGVhbjtcbn1cbiJdfQ==