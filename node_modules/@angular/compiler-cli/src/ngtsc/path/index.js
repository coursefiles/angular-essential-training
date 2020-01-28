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
        define("@angular/compiler-cli/src/ngtsc/path", ["require", "exports", "@angular/compiler-cli/src/ngtsc/path/src/logical", "@angular/compiler-cli/src/ngtsc/path/src/types"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var logical_1 = require("@angular/compiler-cli/src/ngtsc/path/src/logical");
    exports.LogicalFileSystem = logical_1.LogicalFileSystem;
    exports.LogicalProjectPath = logical_1.LogicalProjectPath;
    var types_1 = require("@angular/compiler-cli/src/ngtsc/path/src/types");
    exports.AbsoluteFsPath = types_1.AbsoluteFsPath;
    exports.PathSegment = types_1.PathSegment;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL3BhdGgvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFFSCw0RUFBb0U7SUFBNUQsc0NBQUEsaUJBQWlCLENBQUE7SUFBRSx1Q0FBQSxrQkFBa0IsQ0FBQTtJQUM3Qyx3RUFBd0Q7SUFBaEQsaUNBQUEsY0FBYyxDQUFBO0lBQUUsOEJBQUEsV0FBVyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5leHBvcnQge0xvZ2ljYWxGaWxlU3lzdGVtLCBMb2dpY2FsUHJvamVjdFBhdGh9IGZyb20gJy4vc3JjL2xvZ2ljYWwnO1xuZXhwb3J0IHtBYnNvbHV0ZUZzUGF0aCwgUGF0aFNlZ21lbnR9IGZyb20gJy4vc3JjL3R5cGVzJztcbiJdfQ==