(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/packages/bundle_program", ["require", "exports", "tslib", "canonical-path", "fs", "typescript"], factory);
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
    var canonical_path_1 = require("canonical-path");
    var fs_1 = require("fs");
    var ts = require("typescript");
    /**
     * Create a bundle program.
     */
    function makeBundleProgram(isCore, path, r3FileName, options, host) {
        var r3SymbolsPath = isCore ? findR3SymbolsPath(canonical_path_1.dirname(path), r3FileName) : null;
        var rootPaths = r3SymbolsPath ? [path, r3SymbolsPath] : [path];
        var program = ts.createProgram(rootPaths, options, host);
        var file = program.getSourceFile(path);
        var r3SymbolsFile = r3SymbolsPath && program.getSourceFile(r3SymbolsPath) || null;
        return { program: program, options: options, host: host, path: path, file: file, r3SymbolsPath: r3SymbolsPath, r3SymbolsFile: r3SymbolsFile };
    }
    exports.makeBundleProgram = makeBundleProgram;
    /**
     * Search the given directory hierarchy to find the path to the `r3_symbols` file.
     */
    function findR3SymbolsPath(directory, filename) {
        var e_1, _a;
        var r3SymbolsFilePath = canonical_path_1.resolve(directory, filename);
        if (fs_1.existsSync(r3SymbolsFilePath)) {
            return r3SymbolsFilePath;
        }
        var subDirectories = fs_1.readdirSync(directory)
            // Not interested in hidden files
            .filter(function (p) { return !p.startsWith('.'); })
            // Ignore node_modules
            .filter(function (p) { return p !== 'node_modules'; })
            // Only interested in directories (and only those that are not symlinks)
            .filter(function (p) {
            var stat = fs_1.lstatSync(canonical_path_1.resolve(directory, p));
            return stat.isDirectory() && !stat.isSymbolicLink();
        });
        try {
            for (var subDirectories_1 = tslib_1.__values(subDirectories), subDirectories_1_1 = subDirectories_1.next(); !subDirectories_1_1.done; subDirectories_1_1 = subDirectories_1.next()) {
                var subDirectory = subDirectories_1_1.value;
                var r3SymbolsFilePath_1 = findR3SymbolsPath(canonical_path_1.resolve(directory, subDirectory), filename);
                if (r3SymbolsFilePath_1) {
                    return r3SymbolsFilePath_1;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (subDirectories_1_1 && !subDirectories_1_1.done && (_a = subDirectories_1.return)) _a.call(subDirectories_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return null;
    }
    exports.findR3SymbolsPath = findR3SymbolsPath;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlX3Byb2dyYW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvbmdjYy9zcmMvcGFja2FnZXMvYnVuZGxlX3Byb2dyYW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQUE7Ozs7OztPQU1HO0lBQ0gsaURBQWdEO0lBQ2hELHlCQUFzRDtJQUN0RCwrQkFBaUM7SUFvQmpDOztPQUVHO0lBQ0gsU0FBZ0IsaUJBQWlCLENBQzdCLE1BQWUsRUFBRSxJQUFZLEVBQUUsVUFBa0IsRUFBRSxPQUEyQixFQUM5RSxJQUFxQjtRQUN2QixJQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLHdCQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNuRixJQUFNLFNBQVMsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pFLElBQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMzRCxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBRyxDQUFDO1FBQzNDLElBQU0sYUFBYSxHQUFHLGFBQWEsSUFBSSxPQUFPLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxJQUFJLElBQUksQ0FBQztRQUVwRixPQUFPLEVBQUMsT0FBTyxTQUFBLEVBQUUsT0FBTyxTQUFBLEVBQUUsSUFBSSxNQUFBLEVBQUUsSUFBSSxNQUFBLEVBQUUsSUFBSSxNQUFBLEVBQUUsYUFBYSxlQUFBLEVBQUUsYUFBYSxlQUFBLEVBQUMsQ0FBQztJQUM1RSxDQUFDO0lBVkQsOENBVUM7SUFFRDs7T0FFRztJQUNILFNBQWdCLGlCQUFpQixDQUFDLFNBQWlCLEVBQUUsUUFBZ0I7O1FBQ25FLElBQU0saUJBQWlCLEdBQUcsd0JBQU8sQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDdkQsSUFBSSxlQUFVLENBQUMsaUJBQWlCLENBQUMsRUFBRTtZQUNqQyxPQUFPLGlCQUFpQixDQUFDO1NBQzFCO1FBRUQsSUFBTSxjQUFjLEdBQ2hCLGdCQUFXLENBQUMsU0FBUyxDQUFDO1lBQ2xCLGlDQUFpQzthQUNoQyxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQWxCLENBQWtCLENBQUM7WUFDaEMsc0JBQXNCO2FBQ3JCLE1BQU0sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsS0FBSyxjQUFjLEVBQXBCLENBQW9CLENBQUM7WUFDbEMsd0VBQXdFO2FBQ3ZFLE1BQU0sQ0FBQyxVQUFBLENBQUM7WUFDUCxJQUFNLElBQUksR0FBRyxjQUFTLENBQUMsd0JBQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QyxPQUFPLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN0RCxDQUFDLENBQUMsQ0FBQzs7WUFFWCxLQUEyQixJQUFBLG1CQUFBLGlCQUFBLGNBQWMsQ0FBQSw4Q0FBQSwwRUFBRTtnQkFBdEMsSUFBTSxZQUFZLDJCQUFBO2dCQUNyQixJQUFNLG1CQUFpQixHQUFHLGlCQUFpQixDQUFDLHdCQUFPLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUMxRixJQUFJLG1CQUFpQixFQUFFO29CQUNyQixPQUFPLG1CQUFpQixDQUFDO2lCQUMxQjthQUNGOzs7Ozs7Ozs7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUExQkQsOENBMEJDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtkaXJuYW1lLCByZXNvbHZlfSBmcm9tICdjYW5vbmljYWwtcGF0aCc7XG5pbXBvcnQge2V4aXN0c1N5bmMsIGxzdGF0U3luYywgcmVhZGRpclN5bmN9IGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG4vKipcbiogQW4gZW50cnkgcG9pbnQgYnVuZGxlIGNvbnRhaW5zIG9uZSBvciB0d28gcHJvZ3JhbXMsIGUuZy4gYHNyY2AgYW5kIGBkdHNgLFxuKiB0aGF0IGFyZSBjb21waWxlZCB2aWEgVHlwZVNjcmlwdC5cbipcbiogVG8gYWlkIHdpdGggcHJvY2Vzc2luZyB0aGUgcHJvZ3JhbSwgdGhpcyBpbnRlcmZhY2UgZXhwb3NlcyB0aGUgcHJvZ3JhbSBpdHNlbGYsXG4qIGFzIHdlbGwgYXMgcGF0aCBhbmQgVFMgZmlsZSBvZiB0aGUgZW50cnktcG9pbnQgdG8gdGhlIHByb2dyYW0gYW5kIHRoZSByM1N5bWJvbHNcbiogZmlsZSwgaWYgYXBwcm9wcmlhdGUuXG4qL1xuZXhwb3J0IGludGVyZmFjZSBCdW5kbGVQcm9ncmFtIHtcbiAgcHJvZ3JhbTogdHMuUHJvZ3JhbTtcbiAgb3B0aW9uczogdHMuQ29tcGlsZXJPcHRpb25zO1xuICBob3N0OiB0cy5Db21waWxlckhvc3Q7XG4gIHBhdGg6IHN0cmluZztcbiAgZmlsZTogdHMuU291cmNlRmlsZTtcbiAgcjNTeW1ib2xzUGF0aDogc3RyaW5nfG51bGw7XG4gIHIzU3ltYm9sc0ZpbGU6IHRzLlNvdXJjZUZpbGV8bnVsbDtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBidW5kbGUgcHJvZ3JhbS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1ha2VCdW5kbGVQcm9ncmFtKFxuICAgIGlzQ29yZTogYm9vbGVhbiwgcGF0aDogc3RyaW5nLCByM0ZpbGVOYW1lOiBzdHJpbmcsIG9wdGlvbnM6IHRzLkNvbXBpbGVyT3B0aW9ucyxcbiAgICBob3N0OiB0cy5Db21waWxlckhvc3QpOiBCdW5kbGVQcm9ncmFtIHtcbiAgY29uc3QgcjNTeW1ib2xzUGF0aCA9IGlzQ29yZSA/IGZpbmRSM1N5bWJvbHNQYXRoKGRpcm5hbWUocGF0aCksIHIzRmlsZU5hbWUpIDogbnVsbDtcbiAgY29uc3Qgcm9vdFBhdGhzID0gcjNTeW1ib2xzUGF0aCA/IFtwYXRoLCByM1N5bWJvbHNQYXRoXSA6IFtwYXRoXTtcbiAgY29uc3QgcHJvZ3JhbSA9IHRzLmNyZWF0ZVByb2dyYW0ocm9vdFBhdGhzLCBvcHRpb25zLCBob3N0KTtcbiAgY29uc3QgZmlsZSA9IHByb2dyYW0uZ2V0U291cmNlRmlsZShwYXRoKSAhO1xuICBjb25zdCByM1N5bWJvbHNGaWxlID0gcjNTeW1ib2xzUGF0aCAmJiBwcm9ncmFtLmdldFNvdXJjZUZpbGUocjNTeW1ib2xzUGF0aCkgfHwgbnVsbDtcblxuICByZXR1cm4ge3Byb2dyYW0sIG9wdGlvbnMsIGhvc3QsIHBhdGgsIGZpbGUsIHIzU3ltYm9sc1BhdGgsIHIzU3ltYm9sc0ZpbGV9O1xufVxuXG4vKipcbiAqIFNlYXJjaCB0aGUgZ2l2ZW4gZGlyZWN0b3J5IGhpZXJhcmNoeSB0byBmaW5kIHRoZSBwYXRoIHRvIHRoZSBgcjNfc3ltYm9sc2AgZmlsZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRSM1N5bWJvbHNQYXRoKGRpcmVjdG9yeTogc3RyaW5nLCBmaWxlbmFtZTogc3RyaW5nKTogc3RyaW5nfG51bGwge1xuICBjb25zdCByM1N5bWJvbHNGaWxlUGF0aCA9IHJlc29sdmUoZGlyZWN0b3J5LCBmaWxlbmFtZSk7XG4gIGlmIChleGlzdHNTeW5jKHIzU3ltYm9sc0ZpbGVQYXRoKSkge1xuICAgIHJldHVybiByM1N5bWJvbHNGaWxlUGF0aDtcbiAgfVxuXG4gIGNvbnN0IHN1YkRpcmVjdG9yaWVzID1cbiAgICAgIHJlYWRkaXJTeW5jKGRpcmVjdG9yeSlcbiAgICAgICAgICAvLyBOb3QgaW50ZXJlc3RlZCBpbiBoaWRkZW4gZmlsZXNcbiAgICAgICAgICAuZmlsdGVyKHAgPT4gIXAuc3RhcnRzV2l0aCgnLicpKVxuICAgICAgICAgIC8vIElnbm9yZSBub2RlX21vZHVsZXNcbiAgICAgICAgICAuZmlsdGVyKHAgPT4gcCAhPT0gJ25vZGVfbW9kdWxlcycpXG4gICAgICAgICAgLy8gT25seSBpbnRlcmVzdGVkIGluIGRpcmVjdG9yaWVzIChhbmQgb25seSB0aG9zZSB0aGF0IGFyZSBub3Qgc3ltbGlua3MpXG4gICAgICAgICAgLmZpbHRlcihwID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXQgPSBsc3RhdFN5bmMocmVzb2x2ZShkaXJlY3RvcnksIHApKTtcbiAgICAgICAgICAgIHJldHVybiBzdGF0LmlzRGlyZWN0b3J5KCkgJiYgIXN0YXQuaXNTeW1ib2xpY0xpbmsoKTtcbiAgICAgICAgICB9KTtcblxuICBmb3IgKGNvbnN0IHN1YkRpcmVjdG9yeSBvZiBzdWJEaXJlY3Rvcmllcykge1xuICAgIGNvbnN0IHIzU3ltYm9sc0ZpbGVQYXRoID0gZmluZFIzU3ltYm9sc1BhdGgocmVzb2x2ZShkaXJlY3RvcnksIHN1YkRpcmVjdG9yeSwgKSwgZmlsZW5hbWUpO1xuICAgIGlmIChyM1N5bWJvbHNGaWxlUGF0aCkge1xuICAgICAgcmV0dXJuIHIzU3ltYm9sc0ZpbGVQYXRoO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuIl19