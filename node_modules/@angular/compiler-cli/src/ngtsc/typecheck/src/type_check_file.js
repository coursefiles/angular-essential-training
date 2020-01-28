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
        define("@angular/compiler-cli/src/ngtsc/typecheck/src/type_check_file", ["require", "exports", "tslib", "path", "typescript", "@angular/compiler-cli/src/ngtsc/imports", "@angular/compiler-cli/src/ngtsc/path", "@angular/compiler-cli/src/ngtsc/translator", "@angular/compiler-cli/src/ngtsc/typecheck/src/environment", "@angular/compiler-cli/src/ngtsc/typecheck/src/type_check_block"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    /// <reference types="node" />
    var path = require("path");
    var ts = require("typescript");
    var imports_1 = require("@angular/compiler-cli/src/ngtsc/imports");
    var path_1 = require("@angular/compiler-cli/src/ngtsc/path");
    var translator_1 = require("@angular/compiler-cli/src/ngtsc/translator");
    var environment_1 = require("@angular/compiler-cli/src/ngtsc/typecheck/src/environment");
    var type_check_block_1 = require("@angular/compiler-cli/src/ngtsc/typecheck/src/type_check_block");
    /**
     * An `Environment` representing the single type-checking file into which most (if not all) Type
     * Check Blocks (TCBs) will be generated.
     *
     * The `TypeCheckFile` hosts multiple TCBs and allows the sharing of declarations (e.g. type
     * constructors) between them. Rather than return such declarations via `getPreludeStatements()`, it
     * hoists them to the top of the generated `ts.SourceFile`.
     */
    var TypeCheckFile = /** @class */ (function (_super) {
        tslib_1.__extends(TypeCheckFile, _super);
        function TypeCheckFile(fileName, config, refEmitter) {
            var _this = _super.call(this, config, new translator_1.ImportManager(new imports_1.NoopImportRewriter(), 'i'), refEmitter, ts.createSourceFile(fileName, '', ts.ScriptTarget.Latest, true)) || this;
            _this.fileName = fileName;
            _this.nextTcbId = 1;
            _this.tcbStatements = [];
            return _this;
        }
        TypeCheckFile.prototype.addTypeCheckBlock = function (ref, meta) {
            var fnId = ts.createIdentifier("_tcb" + this.nextTcbId++);
            var fn = type_check_block_1.generateTypeCheckBlock(this, ref, fnId, meta);
            this.tcbStatements.push(fn);
        };
        TypeCheckFile.prototype.render = function () {
            var e_1, _a, e_2, _b, e_3, _c;
            var source = this.importManager.getAllImports(this.fileName)
                .map(function (i) { return "import * as " + i.qualifier + " from '" + i.specifier + "';"; })
                .join('\n') +
                '\n\n';
            var printer = ts.createPrinter();
            source += '\n';
            try {
                for (var _d = tslib_1.__values(this.pipeInstStatements), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var stmt = _e.value;
                    source += printer.printNode(ts.EmitHint.Unspecified, stmt, this.contextFile) + '\n';
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                }
                finally { if (e_1) throw e_1.error; }
            }
            try {
                for (var _f = tslib_1.__values(this.typeCtorStatements), _g = _f.next(); !_g.done; _g = _f.next()) {
                    var stmt = _g.value;
                    source += printer.printNode(ts.EmitHint.Unspecified, stmt, this.contextFile) + '\n';
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                }
                finally { if (e_2) throw e_2.error; }
            }
            source += '\n';
            try {
                for (var _h = tslib_1.__values(this.tcbStatements), _j = _h.next(); !_j.done; _j = _h.next()) {
                    var stmt = _j.value;
                    source += printer.printNode(ts.EmitHint.Unspecified, stmt, this.contextFile) + '\n';
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return ts.createSourceFile(this.fileName, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
        };
        TypeCheckFile.prototype.getPreludeStatements = function () { return []; };
        return TypeCheckFile;
    }(environment_1.Environment));
    exports.TypeCheckFile = TypeCheckFile;
    function typeCheckFilePath(rootDirs) {
        var shortest = rootDirs.concat([]).sort(function (a, b) { return a.length - b.length; })[0];
        return path_1.AbsoluteFsPath.fromUnchecked(path.posix.join(shortest, '__ng_typecheck__.ts'));
    }
    exports.typeCheckFilePath = typeCheckFilePath;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZV9jaGVja19maWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy90eXBlY2hlY2svc3JjL3R5cGVfY2hlY2tfZmlsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7SUFFSCw4QkFBOEI7SUFDOUIsMkJBQTZCO0lBQzdCLCtCQUFpQztJQUVqQyxtRUFBOEU7SUFDOUUsNkRBQTBDO0lBRTFDLHlFQUErQztJQUcvQyx5RkFBMEM7SUFDMUMsbUdBQTBEO0lBRTFEOzs7Ozs7O09BT0c7SUFDSDtRQUFtQyx5Q0FBVztRQUk1Qyx1QkFBb0IsUUFBZ0IsRUFBRSxNQUEwQixFQUFFLFVBQTRCO1lBQTlGLFlBQ0Usa0JBQ0ksTUFBTSxFQUFFLElBQUksMEJBQWEsQ0FBQyxJQUFJLDRCQUFrQixFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsVUFBVSxFQUNwRSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQyxTQUNyRTtZQUptQixjQUFRLEdBQVIsUUFBUSxDQUFRO1lBSDVCLGVBQVMsR0FBRyxDQUFDLENBQUM7WUFDZCxtQkFBYSxHQUFtQixFQUFFLENBQUM7O1FBTTNDLENBQUM7UUFFRCx5Q0FBaUIsR0FBakIsVUFDSSxHQUFxRCxFQUFFLElBQTRCO1lBQ3JGLElBQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFPLElBQUksQ0FBQyxTQUFTLEVBQUksQ0FBQyxDQUFDO1lBQzVELElBQU0sRUFBRSxHQUFHLHlDQUFzQixDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3pELElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzlCLENBQUM7UUFFRCw4QkFBTSxHQUFOOztZQUNFLElBQUksTUFBTSxHQUFXLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7aUJBQzFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLGlCQUFlLENBQUMsQ0FBQyxTQUFTLGVBQVUsQ0FBQyxDQUFDLFNBQVMsT0FBSSxFQUFuRCxDQUFtRCxDQUFDO2lCQUM3RCxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUNoQyxNQUFNLENBQUM7WUFDWCxJQUFNLE9BQU8sR0FBRyxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDbkMsTUFBTSxJQUFJLElBQUksQ0FBQzs7Z0JBQ2YsS0FBbUIsSUFBQSxLQUFBLGlCQUFBLElBQUksQ0FBQyxrQkFBa0IsQ0FBQSxnQkFBQSw0QkFBRTtvQkFBdkMsSUFBTSxJQUFJLFdBQUE7b0JBQ2IsTUFBTSxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxJQUFJLENBQUM7aUJBQ3JGOzs7Ozs7Ozs7O2dCQUNELEtBQW1CLElBQUEsS0FBQSxpQkFBQSxJQUFJLENBQUMsa0JBQWtCLENBQUEsZ0JBQUEsNEJBQUU7b0JBQXZDLElBQU0sSUFBSSxXQUFBO29CQUNiLE1BQU0sSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsSUFBSSxDQUFDO2lCQUNyRjs7Ozs7Ozs7O1lBQ0QsTUFBTSxJQUFJLElBQUksQ0FBQzs7Z0JBQ2YsS0FBbUIsSUFBQSxLQUFBLGlCQUFBLElBQUksQ0FBQyxhQUFhLENBQUEsZ0JBQUEsNEJBQUU7b0JBQWxDLElBQU0sSUFBSSxXQUFBO29CQUNiLE1BQU0sSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsSUFBSSxDQUFDO2lCQUNyRjs7Ozs7Ozs7O1lBRUQsT0FBTyxFQUFFLENBQUMsZ0JBQWdCLENBQ3RCLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzdFLENBQUM7UUFFRCw0Q0FBb0IsR0FBcEIsY0FBeUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELG9CQUFDO0lBQUQsQ0FBQyxBQXhDRCxDQUFtQyx5QkFBVyxHQXdDN0M7SUF4Q1ksc0NBQWE7SUEwQzFCLFNBQWdCLGlCQUFpQixDQUFDLFFBQTBCO1FBQzFELElBQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBbkIsQ0FBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVFLE9BQU8scUJBQWMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLHFCQUFxQixDQUFDLENBQUMsQ0FBQztJQUN4RixDQUFDO0lBSEQsOENBR0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwibm9kZVwiIC8+XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7Tm9vcEltcG9ydFJld3JpdGVyLCBSZWZlcmVuY2UsIFJlZmVyZW5jZUVtaXR0ZXJ9IGZyb20gJy4uLy4uL2ltcG9ydHMnO1xuaW1wb3J0IHtBYnNvbHV0ZUZzUGF0aH0gZnJvbSAnLi4vLi4vcGF0aCc7XG5pbXBvcnQge0NsYXNzRGVjbGFyYXRpb259IGZyb20gJy4uLy4uL3JlZmxlY3Rpb24nO1xuaW1wb3J0IHtJbXBvcnRNYW5hZ2VyfSBmcm9tICcuLi8uLi90cmFuc2xhdG9yJztcblxuaW1wb3J0IHtUeXBlQ2hlY2tCbG9ja01ldGFkYXRhLCBUeXBlQ2hlY2tpbmdDb25maWd9IGZyb20gJy4vYXBpJztcbmltcG9ydCB7RW52aXJvbm1lbnR9IGZyb20gJy4vZW52aXJvbm1lbnQnO1xuaW1wb3J0IHtnZW5lcmF0ZVR5cGVDaGVja0Jsb2NrfSBmcm9tICcuL3R5cGVfY2hlY2tfYmxvY2snO1xuXG4vKipcbiAqIEFuIGBFbnZpcm9ubWVudGAgcmVwcmVzZW50aW5nIHRoZSBzaW5nbGUgdHlwZS1jaGVja2luZyBmaWxlIGludG8gd2hpY2ggbW9zdCAoaWYgbm90IGFsbCkgVHlwZVxuICogQ2hlY2sgQmxvY2tzIChUQ0JzKSB3aWxsIGJlIGdlbmVyYXRlZC5cbiAqXG4gKiBUaGUgYFR5cGVDaGVja0ZpbGVgIGhvc3RzIG11bHRpcGxlIFRDQnMgYW5kIGFsbG93cyB0aGUgc2hhcmluZyBvZiBkZWNsYXJhdGlvbnMgKGUuZy4gdHlwZVxuICogY29uc3RydWN0b3JzKSBiZXR3ZWVuIHRoZW0uIFJhdGhlciB0aGFuIHJldHVybiBzdWNoIGRlY2xhcmF0aW9ucyB2aWEgYGdldFByZWx1ZGVTdGF0ZW1lbnRzKClgLCBpdFxuICogaG9pc3RzIHRoZW0gdG8gdGhlIHRvcCBvZiB0aGUgZ2VuZXJhdGVkIGB0cy5Tb3VyY2VGaWxlYC5cbiAqL1xuZXhwb3J0IGNsYXNzIFR5cGVDaGVja0ZpbGUgZXh0ZW5kcyBFbnZpcm9ubWVudCB7XG4gIHByaXZhdGUgbmV4dFRjYklkID0gMTtcbiAgcHJpdmF0ZSB0Y2JTdGF0ZW1lbnRzOiB0cy5TdGF0ZW1lbnRbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZmlsZU5hbWU6IHN0cmluZywgY29uZmlnOiBUeXBlQ2hlY2tpbmdDb25maWcsIHJlZkVtaXR0ZXI6IFJlZmVyZW5jZUVtaXR0ZXIpIHtcbiAgICBzdXBlcihcbiAgICAgICAgY29uZmlnLCBuZXcgSW1wb3J0TWFuYWdlcihuZXcgTm9vcEltcG9ydFJld3JpdGVyKCksICdpJyksIHJlZkVtaXR0ZXIsXG4gICAgICAgIHRzLmNyZWF0ZVNvdXJjZUZpbGUoZmlsZU5hbWUsICcnLCB0cy5TY3JpcHRUYXJnZXQuTGF0ZXN0LCB0cnVlKSk7XG4gIH1cblxuICBhZGRUeXBlQ2hlY2tCbG9jayhcbiAgICAgIHJlZjogUmVmZXJlbmNlPENsYXNzRGVjbGFyYXRpb248dHMuQ2xhc3NEZWNsYXJhdGlvbj4+LCBtZXRhOiBUeXBlQ2hlY2tCbG9ja01ldGFkYXRhKTogdm9pZCB7XG4gICAgY29uc3QgZm5JZCA9IHRzLmNyZWF0ZUlkZW50aWZpZXIoYF90Y2Ike3RoaXMubmV4dFRjYklkKyt9YCk7XG4gICAgY29uc3QgZm4gPSBnZW5lcmF0ZVR5cGVDaGVja0Jsb2NrKHRoaXMsIHJlZiwgZm5JZCwgbWV0YSk7XG4gICAgdGhpcy50Y2JTdGF0ZW1lbnRzLnB1c2goZm4pO1xuICB9XG5cbiAgcmVuZGVyKCk6IHRzLlNvdXJjZUZpbGUge1xuICAgIGxldCBzb3VyY2U6IHN0cmluZyA9IHRoaXMuaW1wb3J0TWFuYWdlci5nZXRBbGxJbXBvcnRzKHRoaXMuZmlsZU5hbWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoaSA9PiBgaW1wb3J0ICogYXMgJHtpLnF1YWxpZmllcn0gZnJvbSAnJHtpLnNwZWNpZmllcn0nO2ApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5qb2luKCdcXG4nKSArXG4gICAgICAgICdcXG5cXG4nO1xuICAgIGNvbnN0IHByaW50ZXIgPSB0cy5jcmVhdGVQcmludGVyKCk7XG4gICAgc291cmNlICs9ICdcXG4nO1xuICAgIGZvciAoY29uc3Qgc3RtdCBvZiB0aGlzLnBpcGVJbnN0U3RhdGVtZW50cykge1xuICAgICAgc291cmNlICs9IHByaW50ZXIucHJpbnROb2RlKHRzLkVtaXRIaW50LlVuc3BlY2lmaWVkLCBzdG10LCB0aGlzLmNvbnRleHRGaWxlKSArICdcXG4nO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IHN0bXQgb2YgdGhpcy50eXBlQ3RvclN0YXRlbWVudHMpIHtcbiAgICAgIHNvdXJjZSArPSBwcmludGVyLnByaW50Tm9kZSh0cy5FbWl0SGludC5VbnNwZWNpZmllZCwgc3RtdCwgdGhpcy5jb250ZXh0RmlsZSkgKyAnXFxuJztcbiAgICB9XG4gICAgc291cmNlICs9ICdcXG4nO1xuICAgIGZvciAoY29uc3Qgc3RtdCBvZiB0aGlzLnRjYlN0YXRlbWVudHMpIHtcbiAgICAgIHNvdXJjZSArPSBwcmludGVyLnByaW50Tm9kZSh0cy5FbWl0SGludC5VbnNwZWNpZmllZCwgc3RtdCwgdGhpcy5jb250ZXh0RmlsZSkgKyAnXFxuJztcbiAgICB9XG5cbiAgICByZXR1cm4gdHMuY3JlYXRlU291cmNlRmlsZShcbiAgICAgICAgdGhpcy5maWxlTmFtZSwgc291cmNlLCB0cy5TY3JpcHRUYXJnZXQuTGF0ZXN0LCB0cnVlLCB0cy5TY3JpcHRLaW5kLlRTKTtcbiAgfVxuXG4gIGdldFByZWx1ZGVTdGF0ZW1lbnRzKCk6IHRzLlN0YXRlbWVudFtdIHsgcmV0dXJuIFtdOyB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0eXBlQ2hlY2tGaWxlUGF0aChyb290RGlyczogQWJzb2x1dGVGc1BhdGhbXSk6IEFic29sdXRlRnNQYXRoIHtcbiAgY29uc3Qgc2hvcnRlc3QgPSByb290RGlycy5jb25jYXQoW10pLnNvcnQoKGEsIGIpID0+IGEubGVuZ3RoIC0gYi5sZW5ndGgpWzBdO1xuICByZXR1cm4gQWJzb2x1dGVGc1BhdGguZnJvbVVuY2hlY2tlZChwYXRoLnBvc2l4LmpvaW4oc2hvcnRlc3QsICdfX25nX3R5cGVjaGVja19fLnRzJykpO1xufVxuIl19