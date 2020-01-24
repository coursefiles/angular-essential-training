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
        define("@angular/compiler-cli/src/ngtsc/entry_point/src/generator", ["require", "exports", "path", "typescript", "@angular/compiler-cli/src/ngtsc/util/src/path"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /// <reference types="node" />
    var path = require("path");
    var ts = require("typescript");
    var path_1 = require("@angular/compiler-cli/src/ngtsc/util/src/path");
    var FlatIndexGenerator = /** @class */ (function () {
        function FlatIndexGenerator(entryPoint, relativeFlatIndexPath, moduleName) {
            this.entryPoint = entryPoint;
            this.moduleName = moduleName;
            this.flatIndexPath = path.posix.join(path.posix.dirname(entryPoint), relativeFlatIndexPath)
                .replace(/\.js$/, '') +
                '.ts';
        }
        FlatIndexGenerator.prototype.recognize = function (fileName) { return fileName === this.flatIndexPath; };
        FlatIndexGenerator.prototype.generate = function () {
            var relativeEntryPoint = path_1.relativePathBetween(this.flatIndexPath, this.entryPoint);
            var contents = "/**\n * Generated bundle index. Do not edit.\n */\n\nexport * from '" + relativeEntryPoint + "';\n";
            var genFile = ts.createSourceFile(this.flatIndexPath, contents, ts.ScriptTarget.ES2015, true, ts.ScriptKind.TS);
            if (this.moduleName !== null) {
                genFile.moduleName = this.moduleName;
            }
            return genFile;
        };
        return FlatIndexGenerator;
    }());
    exports.FlatIndexGenerator = FlatIndexGenerator;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy9lbnRyeV9wb2ludC9zcmMvZ2VuZXJhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBRUgsOEJBQThCO0lBRTlCLDJCQUE2QjtJQUM3QiwrQkFBaUM7SUFHakMsc0VBQXdEO0lBRXhEO1FBR0UsNEJBQ2EsVUFBa0IsRUFBRSxxQkFBNkIsRUFDakQsVUFBdUI7WUFEdkIsZUFBVSxHQUFWLFVBQVUsQ0FBUTtZQUNsQixlQUFVLEdBQVYsVUFBVSxDQUFhO1lBQ2xDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUscUJBQXFCLENBQUM7aUJBQ2pFLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDO2dCQUMxQyxLQUFLLENBQUM7UUFDWixDQUFDO1FBRUQsc0NBQVMsR0FBVCxVQUFVLFFBQWdCLElBQWEsT0FBTyxRQUFRLEtBQUssSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7UUFFaEYscUNBQVEsR0FBUjtZQUNFLElBQU0sa0JBQWtCLEdBQUcsMEJBQW1CLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDcEYsSUFBTSxRQUFRLEdBQUcseUVBSUosa0JBQWtCLFNBQ2xDLENBQUM7WUFDRSxJQUFNLE9BQU8sR0FBRyxFQUFFLENBQUMsZ0JBQWdCLENBQy9CLElBQUksQ0FBQyxhQUFhLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2xGLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxJQUFJLEVBQUU7Z0JBQzVCLE9BQU8sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQzthQUN0QztZQUNELE9BQU8sT0FBTyxDQUFDO1FBQ2pCLENBQUM7UUFDSCx5QkFBQztJQUFELENBQUMsQUE1QkQsSUE0QkM7SUE1QlksZ0RBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cIm5vZGVcIiAvPlxuXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7U2hpbUdlbmVyYXRvcn0gZnJvbSAnLi4vLi4vc2hpbXMnO1xuaW1wb3J0IHtyZWxhdGl2ZVBhdGhCZXR3ZWVufSBmcm9tICcuLi8uLi91dGlsL3NyYy9wYXRoJztcblxuZXhwb3J0IGNsYXNzIEZsYXRJbmRleEdlbmVyYXRvciBpbXBsZW1lbnRzIFNoaW1HZW5lcmF0b3Ige1xuICByZWFkb25seSBmbGF0SW5kZXhQYXRoOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICByZWFkb25seSBlbnRyeVBvaW50OiBzdHJpbmcsIHJlbGF0aXZlRmxhdEluZGV4UGF0aDogc3RyaW5nLFxuICAgICAgcmVhZG9ubHkgbW9kdWxlTmFtZTogc3RyaW5nfG51bGwpIHtcbiAgICB0aGlzLmZsYXRJbmRleFBhdGggPSBwYXRoLnBvc2l4LmpvaW4ocGF0aC5wb3NpeC5kaXJuYW1lKGVudHJ5UG9pbnQpLCByZWxhdGl2ZUZsYXRJbmRleFBhdGgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXC5qcyQvLCAnJykgK1xuICAgICAgICAnLnRzJztcbiAgfVxuXG4gIHJlY29nbml6ZShmaWxlTmFtZTogc3RyaW5nKTogYm9vbGVhbiB7IHJldHVybiBmaWxlTmFtZSA9PT0gdGhpcy5mbGF0SW5kZXhQYXRoOyB9XG5cbiAgZ2VuZXJhdGUoKTogdHMuU291cmNlRmlsZSB7XG4gICAgY29uc3QgcmVsYXRpdmVFbnRyeVBvaW50ID0gcmVsYXRpdmVQYXRoQmV0d2Vlbih0aGlzLmZsYXRJbmRleFBhdGgsIHRoaXMuZW50cnlQb2ludCk7XG4gICAgY29uc3QgY29udGVudHMgPSBgLyoqXG4gKiBHZW5lcmF0ZWQgYnVuZGxlIGluZGV4LiBEbyBub3QgZWRpdC5cbiAqL1xuXG5leHBvcnQgKiBmcm9tICcke3JlbGF0aXZlRW50cnlQb2ludH0nO1xuYDtcbiAgICBjb25zdCBnZW5GaWxlID0gdHMuY3JlYXRlU291cmNlRmlsZShcbiAgICAgICAgdGhpcy5mbGF0SW5kZXhQYXRoLCBjb250ZW50cywgdHMuU2NyaXB0VGFyZ2V0LkVTMjAxNSwgdHJ1ZSwgdHMuU2NyaXB0S2luZC5UUyk7XG4gICAgaWYgKHRoaXMubW9kdWxlTmFtZSAhPT0gbnVsbCkge1xuICAgICAgZ2VuRmlsZS5tb2R1bGVOYW1lID0gdGhpcy5tb2R1bGVOYW1lO1xuICAgIH1cbiAgICByZXR1cm4gZ2VuRmlsZTtcbiAgfVxufVxuIl19