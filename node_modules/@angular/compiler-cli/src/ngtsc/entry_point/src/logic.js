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
        define("@angular/compiler-cli/src/ngtsc/entry_point/src/logic", ["require", "exports", "tslib", "@angular/compiler-cli/src/ngtsc/util/src/typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var typescript_1 = require("@angular/compiler-cli/src/ngtsc/util/src/typescript");
    function findFlatIndexEntryPoint(rootFiles) {
        var e_1, _a;
        // There are two ways for a file to be recognized as the flat module index:
        // 1) if it's the only file!!!!!!
        // 2) (deprecated) if it's named 'index.ts' and has the shortest path of all such files.
        var tsFiles = rootFiles.filter(function (file) { return typescript_1.isNonDeclarationTsPath(file); });
        var resolvedEntryPoint = null;
        if (tsFiles.length === 1) {
            // There's only one file - this is the flat module index.
            resolvedEntryPoint = tsFiles[0];
        }
        else {
            try {
                // In the event there's more than one TS file, one of them can still be selected as the
                // flat module index if it's named 'index.ts'. If there's more than one 'index.ts', the one
                // with the shortest path wins.
                //
                // This behavior is DEPRECATED and only exists to support existing usages.
                for (var tsFiles_1 = tslib_1.__values(tsFiles), tsFiles_1_1 = tsFiles_1.next(); !tsFiles_1_1.done; tsFiles_1_1 = tsFiles_1.next()) {
                    var tsFile = tsFiles_1_1.value;
                    if (tsFile.endsWith('/index.ts') &&
                        (resolvedEntryPoint === null || tsFile.length <= resolvedEntryPoint.length)) {
                        resolvedEntryPoint = tsFile;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (tsFiles_1_1 && !tsFiles_1_1.done && (_a = tsFiles_1.return)) _a.call(tsFiles_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        return resolvedEntryPoint;
    }
    exports.findFlatIndexEntryPoint = findFlatIndexEntryPoint;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL2VudHJ5X3BvaW50L3NyYy9sb2dpYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7SUFHSCxrRkFBaUU7SUFFakUsU0FBZ0IsdUJBQXVCLENBQUMsU0FBd0M7O1FBQzlFLDJFQUEyRTtRQUMzRSxpQ0FBaUM7UUFDakMsd0ZBQXdGO1FBQ3hGLElBQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxtQ0FBc0IsQ0FBQyxJQUFJLENBQUMsRUFBNUIsQ0FBNEIsQ0FBQyxDQUFDO1FBQ3ZFLElBQUksa0JBQWtCLEdBQWdCLElBQUksQ0FBQztRQUUzQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3hCLHlEQUF5RDtZQUN6RCxrQkFBa0IsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDakM7YUFBTTs7Z0JBQ0wsdUZBQXVGO2dCQUN2RiwyRkFBMkY7Z0JBQzNGLCtCQUErQjtnQkFDL0IsRUFBRTtnQkFDRiwwRUFBMEU7Z0JBQzFFLEtBQXFCLElBQUEsWUFBQSxpQkFBQSxPQUFPLENBQUEsZ0NBQUEscURBQUU7b0JBQXpCLElBQU0sTUFBTSxvQkFBQTtvQkFDZixJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDO3dCQUM1QixDQUFDLGtCQUFrQixLQUFLLElBQUksSUFBSSxNQUFNLENBQUMsTUFBTSxJQUFJLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxFQUFFO3dCQUMvRSxrQkFBa0IsR0FBRyxNQUFNLENBQUM7cUJBQzdCO2lCQUNGOzs7Ozs7Ozs7U0FDRjtRQUVELE9BQU8sa0JBQWtCLENBQUM7SUFDNUIsQ0FBQztJQXpCRCwwREF5QkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7QWJzb2x1dGVGc1BhdGh9IGZyb20gJy4uLy4uL3BhdGgvc3JjL3R5cGVzJztcbmltcG9ydCB7aXNOb25EZWNsYXJhdGlvblRzUGF0aH0gZnJvbSAnLi4vLi4vdXRpbC9zcmMvdHlwZXNjcmlwdCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kRmxhdEluZGV4RW50cnlQb2ludChyb290RmlsZXM6IFJlYWRvbmx5QXJyYXk8QWJzb2x1dGVGc1BhdGg+KTogc3RyaW5nfG51bGwge1xuICAvLyBUaGVyZSBhcmUgdHdvIHdheXMgZm9yIGEgZmlsZSB0byBiZSByZWNvZ25pemVkIGFzIHRoZSBmbGF0IG1vZHVsZSBpbmRleDpcbiAgLy8gMSkgaWYgaXQncyB0aGUgb25seSBmaWxlISEhISEhXG4gIC8vIDIpIChkZXByZWNhdGVkKSBpZiBpdCdzIG5hbWVkICdpbmRleC50cycgYW5kIGhhcyB0aGUgc2hvcnRlc3QgcGF0aCBvZiBhbGwgc3VjaCBmaWxlcy5cbiAgY29uc3QgdHNGaWxlcyA9IHJvb3RGaWxlcy5maWx0ZXIoZmlsZSA9PiBpc05vbkRlY2xhcmF0aW9uVHNQYXRoKGZpbGUpKTtcbiAgbGV0IHJlc29sdmVkRW50cnlQb2ludDogc3RyaW5nfG51bGwgPSBudWxsO1xuXG4gIGlmICh0c0ZpbGVzLmxlbmd0aCA9PT0gMSkge1xuICAgIC8vIFRoZXJlJ3Mgb25seSBvbmUgZmlsZSAtIHRoaXMgaXMgdGhlIGZsYXQgbW9kdWxlIGluZGV4LlxuICAgIHJlc29sdmVkRW50cnlQb2ludCA9IHRzRmlsZXNbMF07XG4gIH0gZWxzZSB7XG4gICAgLy8gSW4gdGhlIGV2ZW50IHRoZXJlJ3MgbW9yZSB0aGFuIG9uZSBUUyBmaWxlLCBvbmUgb2YgdGhlbSBjYW4gc3RpbGwgYmUgc2VsZWN0ZWQgYXMgdGhlXG4gICAgLy8gZmxhdCBtb2R1bGUgaW5kZXggaWYgaXQncyBuYW1lZCAnaW5kZXgudHMnLiBJZiB0aGVyZSdzIG1vcmUgdGhhbiBvbmUgJ2luZGV4LnRzJywgdGhlIG9uZVxuICAgIC8vIHdpdGggdGhlIHNob3J0ZXN0IHBhdGggd2lucy5cbiAgICAvL1xuICAgIC8vIFRoaXMgYmVoYXZpb3IgaXMgREVQUkVDQVRFRCBhbmQgb25seSBleGlzdHMgdG8gc3VwcG9ydCBleGlzdGluZyB1c2FnZXMuXG4gICAgZm9yIChjb25zdCB0c0ZpbGUgb2YgdHNGaWxlcykge1xuICAgICAgaWYgKHRzRmlsZS5lbmRzV2l0aCgnL2luZGV4LnRzJykgJiZcbiAgICAgICAgICAocmVzb2x2ZWRFbnRyeVBvaW50ID09PSBudWxsIHx8IHRzRmlsZS5sZW5ndGggPD0gcmVzb2x2ZWRFbnRyeVBvaW50Lmxlbmd0aCkpIHtcbiAgICAgICAgcmVzb2x2ZWRFbnRyeVBvaW50ID0gdHNGaWxlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXNvbHZlZEVudHJ5UG9pbnQ7XG59XG4iXX0=