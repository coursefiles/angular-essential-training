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
        define("@angular/compiler-cli/src/ngtsc/util/src/typescript", ["require", "exports", "tslib", "typescript", "@angular/compiler-cli/src/ngtsc/path"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var TS = /\.tsx?$/i;
    var D_TS = /\.d\.ts$/i;
    var ts = require("typescript");
    var path_1 = require("@angular/compiler-cli/src/ngtsc/path");
    function isDtsPath(filePath) {
        return D_TS.test(filePath);
    }
    exports.isDtsPath = isDtsPath;
    function isNonDeclarationTsPath(filePath) {
        return TS.test(filePath) && !D_TS.test(filePath);
    }
    exports.isNonDeclarationTsPath = isNonDeclarationTsPath;
    function isFromDtsFile(node) {
        var sf = node.getSourceFile();
        if (sf === undefined) {
            sf = ts.getOriginalNode(node).getSourceFile();
        }
        return sf !== undefined && sf.isDeclarationFile;
    }
    exports.isFromDtsFile = isFromDtsFile;
    function nodeNameForError(node) {
        if (node.name !== undefined && ts.isIdentifier(node.name)) {
            return node.name.text;
        }
        else {
            var kind = ts.SyntaxKind[node.kind];
            var _a = ts.getLineAndCharacterOfPosition(node.getSourceFile(), node.getStart()), line = _a.line, character = _a.character;
            return kind + "@" + line + ":" + character;
        }
    }
    exports.nodeNameForError = nodeNameForError;
    function getSourceFile(node) {
        // In certain transformation contexts, `ts.Node.getSourceFile()` can actually return `undefined`,
        // despite the type signature not allowing it. In that event, get the `ts.SourceFile` via the
        // original node instead (which works).
        var directSf = node.getSourceFile();
        return directSf !== undefined ? directSf : ts.getOriginalNode(node).getSourceFile();
    }
    exports.getSourceFile = getSourceFile;
    function identifierOfNode(decl) {
        if (decl.name !== undefined && ts.isIdentifier(decl.name)) {
            return decl.name;
        }
        else {
            return null;
        }
    }
    exports.identifierOfNode = identifierOfNode;
    function isDeclaration(node) {
        return false || ts.isEnumDeclaration(node) || ts.isClassDeclaration(node) ||
            ts.isFunctionDeclaration(node) || ts.isVariableDeclaration(node);
    }
    exports.isDeclaration = isDeclaration;
    function isExported(node) {
        var topLevel = node;
        if (ts.isVariableDeclaration(node) && ts.isVariableDeclarationList(node.parent)) {
            topLevel = node.parent.parent;
        }
        return topLevel.modifiers !== undefined &&
            topLevel.modifiers.some(function (modifier) { return modifier.kind === ts.SyntaxKind.ExportKeyword; });
    }
    exports.isExported = isExported;
    function getRootDirs(host, options) {
        var rootDirs = [];
        if (options.rootDirs !== undefined) {
            rootDirs.push.apply(rootDirs, tslib_1.__spread(options.rootDirs));
        }
        else if (options.rootDir !== undefined) {
            rootDirs.push(options.rootDir);
        }
        else {
            rootDirs.push(host.getCurrentDirectory());
        }
        // In Windows the above might not always return posix separated paths
        // See:
        // https://github.com/Microsoft/TypeScript/blob/3f7357d37f66c842d70d835bc925ec2a873ecfec/src/compiler/sys.ts#L650
        // Also compiler options might be set via an API which doesn't normalize paths
        return rootDirs.map(function (rootDir) { return path_1.AbsoluteFsPath.from(rootDir); });
    }
    exports.getRootDirs = getRootDirs;
    function nodeDebugInfo(node) {
        var sf = getSourceFile(node);
        var _a = ts.getLineAndCharacterOfPosition(sf, node.pos), line = _a.line, character = _a.character;
        return "[" + sf.fileName + ": " + ts.SyntaxKind[node.kind] + " @ " + line + ":" + character + "]";
    }
    exports.nodeDebugInfo = nodeDebugInfo;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXNjcmlwdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvdXRpbC9zcmMvdHlwZXNjcmlwdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7SUFFSCxJQUFNLEVBQUUsR0FBRyxVQUFVLENBQUM7SUFDdEIsSUFBTSxJQUFJLEdBQUcsV0FBVyxDQUFDO0lBRXpCLCtCQUFpQztJQUNqQyw2REFBMEM7SUFFMUMsU0FBZ0IsU0FBUyxDQUFDLFFBQWdCO1FBQ3hDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRkQsOEJBRUM7SUFFRCxTQUFnQixzQkFBc0IsQ0FBQyxRQUFnQjtRQUNyRCxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFGRCx3REFFQztJQUVELFNBQWdCLGFBQWEsQ0FBQyxJQUFhO1FBQ3pDLElBQUksRUFBRSxHQUE0QixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDdkQsSUFBSSxFQUFFLEtBQUssU0FBUyxFQUFFO1lBQ3BCLEVBQUUsR0FBRyxFQUFFLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDO1NBQy9DO1FBQ0QsT0FBTyxFQUFFLEtBQUssU0FBUyxJQUFJLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztJQUNsRCxDQUFDO0lBTkQsc0NBTUM7SUFFRCxTQUFnQixnQkFBZ0IsQ0FBQyxJQUFnQztRQUMvRCxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUyxJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3pELE9BQU8sSUFBSSxD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QWE7UUFDekMsSUFBTSxFQUFFLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pCLElBQUEsbURBQWtFLEVBQWpFLGNBQUksRUFBRSx3QkFBMkQsQ0FBQztRQUN6RSxPQUFPLE1BQUksRUFBRSxDQUFDLFFBQVEsVUFBSyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBTSxJQUFJLFNBQUksU0FBUyxNQUFHLENBQUM7SUFDaEYsQ0FBQztJQUpELHNDQUlDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5jb25zdCBUUyA9IC9cXC50c3g/JC9pO1xuY29uc3QgRF9UUyA9IC9cXC5kXFwudHMkL2k7XG5cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuaW1wb3J0IHtBYnNvbHV0ZUZzUGF0aH0gZnJvbSAnLi4vLi4vcGF0aCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0R0c1BhdGgoZmlsZVBhdGg6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gRF9UUy50ZXN0KGZpbGVQYXRoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTm9uRGVjbGFyYXRpb25Uc1BhdGgoZmlsZVBhdGg6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gVFMudGVzdChmaWxlUGF0aCkgJiYgIURfVFMudGVzdChmaWxlUGF0aCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Zyb21EdHNGaWxlKG5vZGU6IHRzLk5vZGUpOiBib29sZWFuIHtcbiAgbGV0IHNmOiB0cy5Tb3VyY2VGaWxlfHVuZGVmaW5lZCA9IG5vZGUuZ2V0U291cmNlRmlsZSgpO1xuICBpZiAoc2YgPT09IHVuZGVmaW5lZCkge1xuICAgIHNmID0gdHMuZ2V0T3JpZ2luYWxOb2RlKG5vZGUpLmdldFNvdXJjZUZpbGUoKTtcbiAgfVxuICByZXR1cm4gc2YgIT09IHVuZGVmaW5lZCAmJiBzZi5pc0RlY2xhcmF0aW9uRmlsZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vZGVOYW1lRm9yRXJyb3Iobm9kZTogdHMuTm9kZSAmIHtuYW1lPzogdHMuTm9kZX0pOiBzdHJpbmcge1xuICBpZiAobm9kZS5uYW1lICE9PSB1bmRlZmluZWQgJiYgdHMuaXNJZGVudGlmaWVyKG5vZGUubmFtZSkpIHtcbiAgICByZXR1cm4gbm9kZS5uYW1lLnRleHQ7XG4gIH0gZWxzZSB7XG4gICAgY29uc3Qga2luZCA9IHRzLlN5bnRheEtpbmRbbm9kZS5raW5kXTtcbiAgICBjb25zdCB7bGluZSwgY2hhcmFjdGVyfSA9XG4gICAgICAgIHRzLmdldExpbmVBbmRDaGFyYWN0ZXJPZlBvc2l0aW9uKG5vZGUuZ2V0U291cmNlRmlsZSgpLCBub2RlLmdldFN0YXJ0KCkpO1xuICAgIHJldHVybiBgJHtraW5kfUAke2xpbmV9OiR7Y2hhcmFjdGVyfWA7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNvdXJjZUZpbGUobm9kZTogdHMuTm9kZSk6IHRzLlNvdXJjZUZpbGUge1xuICAvLyBJbiBjZXJ0YWluIHRyYW5zZm9ybWF0aW9uIGNvbnRleHRzLCBgdHMuTm9kZS5nZXRTb3VyY2VGaWxlKClgIGNhbiBhY3R1YWxseSByZXR1cm4gYHVuZGVmaW5lZGAsXG4gIC8vIGRlc3BpdGUgdGhlIHR5cGUgc2lnbmF0dXJlIG5vdCBhbGxvd2luZyBpdC4gSW4gdGhhdCBldmVudCwgZ2V0IHRoZSBgdHMuU291cmNlRmlsZWAgdmlhIHRoZVxuICAvLyBvcmlnaW5hbCBub2RlIGluc3RlYWQgKHdoaWNoIHdvcmtzKS5cbiAgY29uc3QgZGlyZWN0U2YgPSBub2RlLmdldFNvdXJjZUZpbGUoKSBhcyB0cy5Tb3VyY2VGaWxlIHwgdW5kZWZpbmVkO1xuICByZXR1cm4gZGlyZWN0U2YgIT09IHVuZGVmaW5lZCA/IGRpcmVjdFNmIDogdHMuZ2V0T3JpZ2luYWxOb2RlKG5vZGUpLmdldFNvdXJjZUZpbGUoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlkZW50aWZpZXJPZk5vZGUoZGVjbDogdHMuTm9kZSAmIHtuYW1lPzogdHMuTm9kZX0pOiB0cy5JZGVudGlmaWVyfG51bGwge1xuICBpZiAoZGVjbC5uYW1lICE9PSB1bmRlZmluZWQgJiYgdHMuaXNJZGVudGlmaWVyKGRlY2wubmFtZSkpIHtcbiAgICByZXR1cm4gZGVjbC5uYW1lO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RlY2xhcmF0aW9uKG5vZGU6IHRzLk5vZGUpOiBub2RlIGlzIHRzLkRlY2xhcmF0aW9uIHtcbiAgcmV0dXJuIGZhbHNlIHx8IHRzLmlzRW51bURlY2xhcmF0aW9uKG5vZGUpIHx8IHRzLmlzQ2xhc3NEZWNsYXJhdGlvbihub2RlKSB8fFxuICAgICAgdHMuaXNGdW5jdGlvbkRlY2xhcmF0aW9uKG5vZGUpIHx8IHRzLmlzVmFyaWFibGVEZWNsYXJhdGlvbihub2RlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRXhwb3J0ZWQobm9kZTogdHMuRGVjbGFyYXRpb24pOiBib29sZWFuIHtcbiAgbGV0IHRvcExldmVsOiB0cy5Ob2RlID0gbm9kZTtcbiAgaWYgKHRzLmlzVmFyaWFibGVEZWNsYXJhdGlvbihub2RlKSAmJiB0cy5pc1ZhcmlhYmxlRGVjbGFyYXRpb25MaXN0KG5vZGUucGFyZW50KSkge1xuICAgIHRvcExldmVsID0gbm9kZS5wYXJlbnQucGFyZW50O1xuICB9XG4gIHJldHVybiB0b3BMZXZlbC5tb2RpZmllcnMgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgdG9wTGV2ZWwubW9kaWZpZXJzLnNvbWUobW9kaWZpZXIgPT4gbW9kaWZpZXIua2luZCA9PT0gdHMuU3ludGF4S2luZC5FeHBvcnRLZXl3b3JkKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFJvb3REaXJzKGhvc3Q6IHRzLkNvbXBpbGVySG9zdCwgb3B0aW9uczogdHMuQ29tcGlsZXJPcHRpb25zKTogQWJzb2x1dGVGc1BhdGhbXSB7XG4gIGNvbnN0IHJvb3REaXJzOiBzdHJpbmdbXSA9IFtdO1xuICBpZiAob3B0aW9ucy5yb290RGlycyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcm9vdERpcnMucHVzaCguLi5vcHRpb25zLnJvb3REaXJzKTtcbiAgfSBlbHNlIGlmIChvcHRpb25zLnJvb3REaXIgIT09IHVuZGVmaW5lZCkge1xuICAgIHJvb3REaXJzLnB1c2gob3B0aW9ucy5yb290RGlyKTtcbiAgfSBlbHNlIHtcbiAgICByb290RGlycy5wdXNoKGhvc3QuZ2V0Q3VycmVudERpcmVjdG9yeSgpKTtcbiAgfVxuXG4gIC8vIEluIFdpbmRvd3MgdGhlIGFib3ZlIG1pZ2h0IG5vdCBhbHdheXMgcmV0dXJuIHBvc2l4IHNlcGFyYXRlZCBwYXRoc1xuICAvLyBTZWU6XG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9ibG9iLzNmNzM1N2QzN2Y2NmM4NDJkNzBkODM1YmM5MjVlYzJhODczZWNmZWMvc3JjL2NvbXBpbGVyL3N5cy50cyNMNjUwXG4gIC8vIEFsc28gY29tcGlsZXIgb3B0aW9ucyBtaWdodCBiZSBzZXQgdmlhIGFuIEFQSSB3aGljaCBkb2Vzbid0IG5vcm1hbGl6ZSBwYXRoc1xuICByZXR1cm4gcm9vdERpcnMubWFwKHJvb3REaXIgPT4gQWJzb2x1dGVGc1BhdGguZnJvbShyb290RGlyKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub2RlRGVidWdJbmZvKG5vZGU6IHRzLk5vZGUpOiBzdHJpbmcge1xuICBjb25zdCBzZiA9IGdldFNvdXJjZUZpbGUobm9kZSk7XG4gIGNvbnN0IHtsaW5lLCBjaGFyYWN0ZXJ9ID0gdHMuZ2V0TGluZUFuZENoYXJhY3Rlck9mUG9zaXRpb24oc2YsIG5vZGUucG9zKTtcbiAgcmV0dXJuIGBbJHtzZi5maWxlTmFtZX06ICR7dHMuU3ludGF4S2luZFtub2RlLmtpbmRdfSBAICR7bGluZX06JHtjaGFyYWN0ZXJ9XWA7XG59XG4iXX0=