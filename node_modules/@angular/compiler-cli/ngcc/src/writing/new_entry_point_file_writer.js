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
        define("@angular/compiler-cli/ngcc/src/writing/new_entry_point_file_writer", ["require", "exports", "tslib", "canonical-path", "fs", "shelljs", "@angular/compiler-cli/src/ngtsc/path", "@angular/compiler-cli/src/ngtsc/util/src/typescript", "@angular/compiler-cli/ngcc/src/writing/in_place_file_writer"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var canonical_path_1 = require("canonical-path");
    var fs_1 = require("fs");
    var shelljs_1 = require("shelljs");
    var path_1 = require("@angular/compiler-cli/src/ngtsc/path");
    var typescript_1 = require("@angular/compiler-cli/src/ngtsc/util/src/typescript");
    var in_place_file_writer_1 = require("@angular/compiler-cli/ngcc/src/writing/in_place_file_writer");
    var NGCC_DIRECTORY = '__ivy_ngcc__';
    /**
     * This FileWriter creates a copy of the original entry-point, then writes the transformed
     * files onto the files in this copy, and finally updates the package.json with a new
     * entry-point format property that points to this new entry-point.
     *
     * If there are transformed typings files in this bundle, they are updated in-place (see the
     * `InPlaceFileWriter`).
     */
    var NewEntryPointFileWriter = /** @class */ (function (_super) {
        tslib_1.__extends(NewEntryPointFileWriter, _super);
        function NewEntryPointFileWriter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        NewEntryPointFileWriter.prototype.writeBundle = function (entryPoint, bundle, transformedFiles) {
            var _this = this;
            // The new folder is at the root of the overall package
            var ngccFolder = path_1.AbsoluteFsPath.fromUnchecked(canonical_path_1.join(entryPoint.package, NGCC_DIRECTORY));
            this.copyBundle(bundle, entryPoint.package, ngccFolder);
            transformedFiles.forEach(function (file) { return _this.writeFile(file, entryPoint.package, ngccFolder); });
            this.updatePackageJson(entryPoint, bundle.formatProperty, ngccFolder);
        };
        NewEntryPointFileWriter.prototype.copyBundle = function (bundle, packagePath, ngccFolder) {
            bundle.src.program.getSourceFiles().forEach(function (sourceFile) {
                var relativePath = canonical_path_1.relative(packagePath, sourceFile.fileName);
                var isOutsidePackage = relativePath.startsWith('..');
                if (!sourceFile.isDeclarationFile && !isOutsidePackage) {
                    var newFilePath = canonical_path_1.join(ngccFolder, relativePath);
                    shelljs_1.mkdir('-p', canonical_path_1.dirname(newFilePath));
                    shelljs_1.cp(sourceFile.fileName, newFilePath);
                }
            });
        };
        NewEntryPointFileWriter.prototype.writeFile = function (file, packagePath, ngccFolder) {
            if (typescript_1.isDtsPath(file.path.replace(/\.map$/, ''))) {
                // This is either `.d.ts` or `.d.ts.map` file
                _super.prototype.writeFileAndBackup.call(this, file);
            }
            else {
                var relativePath = canonical_path_1.relative(packagePath, file.path);
                var newFilePath = canonical_path_1.join(ngccFolder, relativePath);
                shelljs_1.mkdir('-p', canonical_path_1.dirname(newFilePath));
                fs_1.writeFileSync(newFilePath, file.contents, 'utf8');
            }
        };
        NewEntryPointFileWriter.prototype.updatePackageJson = function (entryPoint, formatProperty, ngccFolder) {
            var formatPath = canonical_path_1.join(entryPoint.path, entryPoint.packageJson[formatProperty]);
            var newFormatPath = canonical_path_1.join(ngccFolder, canonical_path_1.relative(entryPoint.package, formatPath));
            var newFormatProperty = formatProperty + '_ivy_ngcc';
            entryPoint.packageJson[newFormatProperty] = canonical_path_1.relative(entryPoint.path, newFormatPath);
            fs_1.writeFileSync(canonical_path_1.join(entryPoint.path, 'package.json'), JSON.stringify(entryPoint.packageJson));
        };
        return NewEntryPointFileWriter;
    }(in_place_file_writer_1.InPlaceFileWriter));
    exports.NewEntryPointFileWriter = NewEntryPointFileWriter;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV3X2VudHJ5X3BvaW50X2ZpbGVfd3JpdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL25nY2Mvc3JjL3dyaXRpbmcvbmV3X2VudHJ5X3BvaW50X2ZpbGVfd3JpdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7OztJQUVILGlEQUF1RDtJQUN2RCx5QkFBaUM7SUFDakMsbUNBQWtDO0lBRWxDLDZEQUF1RDtJQUN2RCxrRkFBaUU7SUFLakUsb0dBQXlEO0lBRXpELElBQU0sY0FBYyxHQUFHLGNBQWMsQ0FBQztJQUV0Qzs7Ozs7OztPQU9HO0lBQ0g7UUFBNkMsbURBQWlCO1FBQTlEOztRQTJDQSxDQUFDO1FBMUNDLDZDQUFXLEdBQVgsVUFBWSxVQUFzQixFQUFFLE1BQXdCLEVBQUUsZ0JBQTRCO1lBQTFGLGlCQU1DO1lBTEMsdURBQXVEO1lBQ3ZELElBQU0sVUFBVSxHQUFHLHFCQUFjLENBQUMsYUFBYSxDQUFDLHFCQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDO1lBQzFGLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDeEQsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsS0FBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsRUFBcEQsQ0FBb0QsQ0FBQyxDQUFDO1lBQ3ZGLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLGNBQWMsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUN4RSxDQUFDO1FBRVMsNENBQVUsR0FBcEIsVUFDSSxNQUF3QixFQUFFLFdBQTJCLEVBQUUsVUFBMEI7WUFDbkYsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLENBQUMsT0FBTyxDQUFDLFVBQUEsVUFBVTtnQkFDcEQsSUFBTSxZQUFZLEdBQUcseUJBQVEsQ0FBQyxXQUFXLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNoRSxJQUFNLGdCQUFnQixHQUFHLFlBQVksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3ZELElBQUksQ0FBQyxVQUFVLENBQUMsaUJBQWlCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtvQkFDdEQsSUFBTSxXQUFXLEdBQUcscUJBQUksQ0FBQyxVQUFVLEVBQUUsWUFBWSxDQUFDLENBQUM7b0JBQ25ELGVBQUssQ0FBQyxJQUFJLEVBQUUsd0JBQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO29CQUNsQyxZQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsQ0FBQztpQkFDdEM7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFFUywyQ0FBUyxHQUFuQixVQUFvQixJQUFjLEVBQUUsV0FBMkIsRUFBRSxVQUEwQjtZQUV6RixJQUFJLHNCQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUU7Z0JBQzlDLDZDQUE2QztnQkFDN0MsaUJBQU0sa0JBQWtCLFlBQUMsSUFBSSxDQUFDLENBQUM7YUFDaEM7aUJBQU07Z0JBQ0wsSUFBTSxZQUFZLEdBQUcseUJBQVEsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN0RCxJQUFNLFdBQVcsR0FBRyxxQkFBSSxDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsQ0FBQztnQkFDbkQsZUFBSyxDQUFDLElBQUksRUFBRSx3QkFBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xDLGtCQUFhLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7YUFDbkQ7UUFDSCxDQUFDO1FBRVMsbURBQWlCLEdBQTNCLFVBQ0ksVUFBc0IsRUFBRSxjQUFzQyxFQUFFLFVBQTBCO1lBQzVGLElBQU0sVUFBVSxHQUFHLHFCQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBRyxDQUFDLENBQUM7WUFDbkYsSUFBTSxhQUFhLEdBQUcscUJBQUksQ0FBQyxVQUFVLEVBQUUseUJBQVEsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDakYsSUFBTSxpQkFBaUIsR0FBRyxjQUFjLEdBQUcsV0FBVyxDQUFDO1lBQ3RELFVBQVUsQ0FBQyxXQUFtQixDQUFDLGlCQUFpQixDQUFDLEdBQUcseUJBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBQzlGLGtCQUFhLENBQUMscUJBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDL0YsQ0FBQztRQUNILDhCQUFDO0lBQUQsQ0FBQyxBQTNDRCxDQUE2Qyx3Q0FBaUIsR0EyQzdEO0lBM0NZLDBEQUF1QiIsInNvdXJjZXNDb250ZW50IjpbIlxuLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2Rpcm5hbWUsIGpvaW4sIHJlbGF0aXZlfSBmcm9tICdjYW5vbmljYWwtcGF0aCc7XG5pbXBvcnQge3dyaXRlRmlsZVN5bmN9IGZyb20gJ2ZzJztcbmltcG9ydCB7Y3AsIG1rZGlyfSBmcm9tICdzaGVsbGpzJztcblxuaW1wb3J0IHtBYnNvbHV0ZUZzUGF0aH0gZnJvbSAnLi4vLi4vLi4vc3JjL25ndHNjL3BhdGgnO1xuaW1wb3J0IHtpc0R0c1BhdGh9IGZyb20gJy4uLy4uLy4uL3NyYy9uZ3RzYy91dGlsL3NyYy90eXBlc2NyaXB0JztcbmltcG9ydCB7RW50cnlQb2ludCwgRW50cnlQb2ludEpzb25Qcm9wZXJ0eX0gZnJvbSAnLi4vcGFja2FnZXMvZW50cnlfcG9pbnQnO1xuaW1wb3J0IHtFbnRyeVBvaW50QnVuZGxlfSBmcm9tICcuLi9wYWNrYWdlcy9lbnRyeV9wb2ludF9idW5kbGUnO1xuaW1wb3J0IHtGaWxlSW5mb30gZnJvbSAnLi4vcmVuZGVyaW5nL3JlbmRlcmVyJztcblxuaW1wb3J0IHtJblBsYWNlRmlsZVdyaXRlcn0gZnJvbSAnLi9pbl9wbGFjZV9maWxlX3dyaXRlcic7XG5cbmNvbnN0IE5HQ0NfRElSRUNUT1JZID0gJ19faXZ5X25nY2NfXyc7XG5cbi8qKlxuICogVGhpcyBGaWxlV3JpdGVyIGNyZWF0ZXMgYSBjb3B5IG9mIHRoZSBvcmlnaW5hbCBlbnRyeS1wb2ludCwgdGhlbiB3cml0ZXMgdGhlIHRyYW5zZm9ybWVkXG4gKiBmaWxlcyBvbnRvIHRoZSBmaWxlcyBpbiB0aGlzIGNvcHksIGFuZCBmaW5hbGx5IHVwZGF0ZXMgdGhlIHBhY2thZ2UuanNvbiB3aXRoIGEgbmV3XG4gKiBlbnRyeS1wb2ludCBmb3JtYXQgcHJvcGVydHkgdGhhdCBwb2ludHMgdG8gdGhpcyBuZXcgZW50cnktcG9pbnQuXG4gKlxuICogSWYgdGhlcmUgYXJlIHRyYW5zZm9ybWVkIHR5cGluZ3MgZmlsZXMgaW4gdGhpcyBidW5kbGUsIHRoZXkgYXJlIHVwZGF0ZWQgaW4tcGxhY2UgKHNlZSB0aGVcbiAqIGBJblBsYWNlRmlsZVdyaXRlcmApLlxuICovXG5leHBvcnQgY2xhc3MgTmV3RW50cnlQb2ludEZpbGVXcml0ZXIgZXh0ZW5kcyBJblBsYWNlRmlsZVdyaXRlciB7XG4gIHdyaXRlQnVuZGxlKGVudHJ5UG9pbnQ6IEVudHJ5UG9pbnQsIGJ1bmRsZTogRW50cnlQb2ludEJ1bmRsZSwgdHJhbnNmb3JtZWRGaWxlczogRmlsZUluZm9bXSkge1xuICAgIC8vIFRoZSBuZXcgZm9sZGVyIGlzIGF0IHRoZSByb290IG9mIHRoZSBvdmVyYWxsIHBhY2thZ2VcbiAgICBjb25zdCBuZ2NjRm9sZGVyID0gQWJzb2x1dGVGc1BhdGguZnJvbVVuY2hlY2tlZChqb2luKGVudHJ5UG9pbnQucGFja2FnZSwgTkdDQ19ESVJFQ1RPUlkpKTtcbiAgICB0aGlzLmNvcHlCdW5kbGUoYnVuZGxlLCBlbnRyeVBvaW50LnBhY2thZ2UsIG5nY2NGb2xkZXIpO1xuICAgIHRyYW5zZm9ybWVkRmlsZXMuZm9yRWFjaChmaWxlID0+IHRoaXMud3JpdGVGaWxlKGZpbGUsIGVudHJ5UG9pbnQucGFja2FnZSwgbmdjY0ZvbGRlcikpO1xuICAgIHRoaXMudXBkYXRlUGFja2FnZUpzb24oZW50cnlQb2ludCwgYnVuZGxlLmZvcm1hdFByb3BlcnR5LCBuZ2NjRm9sZGVyKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBjb3B5QnVuZGxlKFxuICAgICAgYnVuZGxlOiBFbnRyeVBvaW50QnVuZGxlLCBwYWNrYWdlUGF0aDogQWJzb2x1dGVGc1BhdGgsIG5nY2NGb2xkZXI6IEFic29sdXRlRnNQYXRoKSB7XG4gICAgYnVuZGxlLnNyYy5wcm9ncmFtLmdldFNvdXJjZUZpbGVzKCkuZm9yRWFjaChzb3VyY2VGaWxlID0+IHtcbiAgICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IHJlbGF0aXZlKHBhY2thZ2VQYXRoLCBzb3VyY2VGaWxlLmZpbGVOYW1lKTtcbiAgICAgIGNvbnN0IGlzT3V0c2lkZVBhY2thZ2UgPSByZWxhdGl2ZVBhdGguc3RhcnRzV2l0aCgnLi4nKTtcbiAgICAgIGlmICghc291cmNlRmlsZS5pc0RlY2xhcmF0aW9uRmlsZSAmJiAhaXNPdXRzaWRlUGFja2FnZSkge1xuICAgICAgICBjb25zdCBuZXdGaWxlUGF0aCA9IGpvaW4obmdjY0ZvbGRlciwgcmVsYXRpdmVQYXRoKTtcbiAgICAgICAgbWtkaXIoJy1wJywgZGlybmFtZShuZXdGaWxlUGF0aCkpO1xuICAgICAgICBjcChzb3VyY2VGaWxlLmZpbGVOYW1lLCBuZXdGaWxlUGF0aCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgd3JpdGVGaWxlKGZpbGU6IEZpbGVJbmZvLCBwYWNrYWdlUGF0aDogQWJzb2x1dGVGc1BhdGgsIG5nY2NGb2xkZXI6IEFic29sdXRlRnNQYXRoKTpcbiAgICAgIHZvaWQge1xuICAgIGlmIChpc0R0c1BhdGgoZmlsZS5wYXRoLnJlcGxhY2UoL1xcLm1hcCQvLCAnJykpKSB7XG4gICAgICAvLyBUaGlzIGlzIGVpdGhlciBgLmQudHNgIG9yIGAuZC50cy5tYXBgIGZpbGVcbiAgICAgIHN1cGVyLndyaXRlRmlsZUFuZEJhY2t1cChmaWxlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcmVsYXRpdmVQYXRoID0gcmVsYXRpdmUocGFja2FnZVBhdGgsIGZpbGUucGF0aCk7XG4gICAgICBjb25zdCBuZXdGaWxlUGF0aCA9IGpvaW4obmdjY0ZvbGRlciwgcmVsYXRpdmVQYXRoKTtcbiAgICAgIG1rZGlyKCctcCcsIGRpcm5hbWUobmV3RmlsZVBhdGgpKTtcbiAgICAgIHdyaXRlRmlsZVN5bmMobmV3RmlsZVBhdGgsIGZpbGUuY29udGVudHMsICd1dGY4Jyk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIHVwZGF0ZVBhY2thZ2VKc29uKFxuICAgICAgZW50cnlQb2ludDogRW50cnlQb2ludCwgZm9ybWF0UHJvcGVydHk6IEVudHJ5UG9pbnRKc29uUHJvcGVydHksIG5nY2NGb2xkZXI6IEFic29sdXRlRnNQYXRoKSB7XG4gICAgY29uc3QgZm9ybWF0UGF0aCA9IGpvaW4oZW50cnlQb2ludC5wYXRoLCBlbnRyeVBvaW50LnBhY2thZ2VKc29uW2Zvcm1hdFByb3BlcnR5XSAhKTtcbiAgICBjb25zdCBuZXdGb3JtYXRQYXRoID0gam9pbihuZ2NjRm9sZGVyLCByZWxhdGl2ZShlbnRyeVBvaW50LnBhY2thZ2UsIGZvcm1hdFBhdGgpKTtcbiAgICBjb25zdCBuZXdGb3JtYXRQcm9wZXJ0eSA9IGZvcm1hdFByb3BlcnR5ICsgJ19pdnlfbmdjYyc7XG4gICAgKGVudHJ5UG9pbnQucGFja2FnZUpzb24gYXMgYW55KVtuZXdGb3JtYXRQcm9wZXJ0eV0gPSByZWxhdGl2ZShlbnRyeVBvaW50LnBhdGgsIG5ld0Zvcm1hdFBhdGgpO1xuICAgIHdyaXRlRmlsZVN5bmMoam9pbihlbnRyeVBvaW50LnBhdGgsICdwYWNrYWdlLmpzb24nKSwgSlNPTi5zdHJpbmdpZnkoZW50cnlQb2ludC5wYWNrYWdlSnNvbikpO1xuICB9XG59XG4iXX0=