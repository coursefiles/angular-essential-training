(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler/src/parse_util", ["require", "exports", "@angular/compiler/src/chars", "@angular/compiler/src/compile_metadata"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var chars = require("@angular/compiler/src/chars");
    var compile_metadata_1 = require("@angular/compiler/src/compile_metadata");
    var ParseLocation = /** @class */ (function () {
        function ParseLocation(file, offset, line, col) {
            this.file = file;
            this.offset = offset;
            this.line = line;
            this.col = col;
        }
        ParseLocation.prototype.toString = function () {
            return this.offset != null ? this.file.url + "@" + this.line + ":" + this.col : this.file.url;
        };
        ParseLocation.prototype.moveBy = function (delta) {
            var source = this.file.content;
            var len = source.length;
            var offset = this.offset;
            var line = this.line;
            var col = this.col;
            while (offset > 0 && delta < 0) {
                offset--;
                delta++;
                var ch = source.charCodeAt(offset);
                if (ch == chars.$LF) {
                    line--;
                    var priorLine = source.substr(0, offset - 1).lastIndexOf(String.fromCharCode(chars.$LF));
                    col = priorLine > 0 ? offset - priorLine : offset;
                }
                else {
                    col--;
                }
            }
            while (offset < len && delta > 0) {
                var ch = source.charCodeAt(offset);
                offset++;
                delta--;
                if (ch == chars.$LF) {
                    line++;
                    col = 0;
                }
                else {
                    col++;
                }
            }
            return new ParseLocation(this.file, offset, line, col);
        };
        // Return the source around the location
        // Up to `maxChars` or `maxLines` on each side of the location
        ParseLocation.prototype.getContext = function (maxChars, maxLines) {
            var content = this.file.content;
            var startOffset = this.offset;
            if (startOffset != null) {
                if (startOffset > content.length - 1) {
                    startOffset = content.length - 1;
                }
                var endOffset = startOffset;
                var ctxChars = 0;
                var ctxLines = 0;
                while (ctxChars < maxChars && startOffset > 0) {
                    startOffset--;
                    ctxChars++;
                    if (content[startOffset] == '\n') {
                        if (++ctxLines == maxLines) {
                            break;
                        }
                    }
                }
                ctxChars = 0;
                ctxLines = 0;
                while (ctxChars < maxChars && endOffset < content.length - 1) {
                    endOffset++;
                    ctxChars++;
                    if (content[endOffset] == '\n') {
                        if (++ctxLines == maxLines) {
                            break;
                        }
                    }
                }
                return {
                    before: content.substring(startOffset, this.offset),
                    after: content.substring(this.offset, endOffset + 1),
                };
            }
            return null;
        };
        return ParseLocation;
    }());
    exports.ParseLocation = ParseLocation;
    var ParseSourceFile = /** @class */ (function () {
        function ParseSourceFile(content, url) {
            this.content = content;
            this.url = url;
        }
        return ParseSourceFile;
    }());
    exports.ParseSourceFile = ParseSourceFile;
    var ParseSourceSpan = /** @class */ (function () {
        function ParseSourceSpan(start, end, details) {
            if (details === void 0) { details = null; }
            this.start = start;
            this.end = end;
            this.details = details;
        }
        ParseSourceSpan.prototype.toString = function () {
            return this.start.file.content.substring(this.start.offset, this.end.offset);
        };
        return ParseSourceSpan;
    }());
    exports.ParseSourceSpan = ParseSourceSpan;
    var ParseErrorLevel;
    (function (ParseErrorLevel) {
        ParseErrorLevel[ParseErrorLevel["WARNING"] = 0] = "WARNING";
        ParseErrorLevel[ParseErrorLevel["ERROR"] = 1] = "ERROR";
    })(ParseErrorLevel = exports.ParseErrorLevel || (exports.ParseErrorLevel = {}));
    var ParseError = /** @class */ (function () {
        function ParseError(span, msg, level) {
            if (level === void 0) { level = ParseErrorLevel.ERROR; }
            this.span = span;
            this.msg = msg;
            this.level = level;
        }
        ParseError.prototype.contextualMessage = function () {
            var ctx = this.span.start.getContext(100, 3);
            return ctx ? this.msg + " (\"" + ctx.before + "[" + ParseErrorLevel[this.level] + " ->]" + ctx.after + "\")" :
                this.msg;
        };
        ParseError.prototype.toString = function () {
            var details = this.span.details ? ", " + this.span.details : '';
            return this.contextualMessage() + ": " + this.span.start + details;
        };
        return ParseError;
    }());
    exports.ParseError = ParseError;
    function typeSourceSpan(kind, type) {
        var moduleUrl = compile_metadata_1.identifierModuleUrl(type);
        var sourceFileName = moduleUrl != null ? "in " + kind + " " + compile_metadata_1.identifierName(type) + " in " + moduleUrl :
            "in " + kind + " " + compile_metadata_1.identifierName(type);
        var sourceFile = new ParseSourceFile('', sourceFileName);
        return new ParseSourceSpan(new ParseLocation(sourceFile, -1, -1, -1), new ParseLocation(sourceFile, -1, -1, -1));
    }
    exports.typeSourceSpan = typeSourceSpan;
    /**
     * Generates Source Span object for a given R3 Type for JIT mode.
     *
     * @param kind Component or Directive.
     * @param typeName name of the Component or Directive.
     * @param sourceUrl reference to Component or Directive source.
     * @returns instance of ParseSourceSpan that represent a given Component or Directive.
     */
    function r3JitTypeSourceSpan(kind, typeName, sourceUrl) {
        var sourceFileName = "in " + kind + " " + typeName + " in " + sourceUrl;
        var sourceFile = new ParseSourceFile('', sourceFileName);
        return new ParseSourceSpan(new ParseLocation(sourceFile, -1, -1, -1), new ParseLocation(sourceFile, -1, -1, -1));
    }
    exports.r3JitTypeSourceSpan = r3JitTypeSourceSpan;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VfdXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9wYXJzZV91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBQUE7Ozs7OztPQU1HO0lBQ0gsbURBQWlDO0lBQ2pDLDJFQUFrRztJQUdsRztRQUNFLHVCQUNXLElBQXFCLEVBQVMsTUFBYyxFQUFTLElBQVksRUFDakUsR0FBVztZQURYLFNBQUksR0FBSixJQUFJLENBQWlCO1lBQVMsV0FBTSxHQUFOLE1BQU0sQ0FBUTtZQUFTLFNBQUksR0FBSixJQUFJLENBQVE7WUFDakUsUUFBRyxHQUFILEdBQUcsQ0FBUTtRQUFHLENBQUM7UUFFMUIsZ0NBQVEsR0FBUjtZQUNFLE9BQU8sSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxTQUFJLElBQUksQ0FBQyxJQUFJLFNBQUksSUFBSSxDQUFDLEdBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDM0YsQ0FBQztRQUVELDhCQUFNLEdBQU4sVUFBTyxLQUFhO1lBQ2xCLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQ2pDLElBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7WUFDMUIsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUN6QixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3JCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7WUFDbkIsT0FBTyxNQUFNLEdBQUcsQ0FBQyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7Z0JBQzlCLE1BQU0sRUFBRSxDQUFDO2dCQUNULEtBQUssRUFBRSxDQUFDO2dCQUNSLElBQU0sRUFBRSxH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LEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVGLENBQUM7SUFQRCx3Q0FPQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxTQUFnQixtQkFBbUIsQ0FDL0IsSUFBWSxFQUFFLFFBQWdCLEVBQUUsU0FBaUI7UUFDbkQsSUFBTSxjQUFjLEdBQUcsUUFBTSxJQUFJLFNBQUksUUFBUSxZQUFPLFNBQVcsQ0FBQztRQUNoRSxJQUFNLFVBQVUsR0FBRyxJQUFJLGVBQWUsQ0FBQyxFQUFFLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDM0QsT0FBTyxJQUFJLGVBQWUsQ0FDdEIsSUFBSSxhQUFhLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxhQUFhLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1RixDQUFDO0lBTkQsa0RBTUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgKiBhcyBjaGFycyBmcm9tICcuL2NoYXJzJztcbmltcG9ydCB7Q29tcGlsZUlkZW50aWZpZXJNZXRhZGF0YSwgaWRlbnRpZmllck1vZHVsZVVybCwgaWRlbnRpZmllck5hbWV9IGZyb20gJy4vY29tcGlsZV9tZXRhZGF0YSc7XG5pbXBvcnQge2Vycm9yfSBmcm9tICcuL3V0aWwnO1xuXG5leHBvcnQgY2xhc3MgUGFyc2VMb2NhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHVibGljIGZpbGU6IFBhcnNlU291cmNlRmlsZSwgcHVibGljIG9mZnNldDogbnVtYmVyLCBwdWJsaWMgbGluZTogbnVtYmVyLFxuICAgICAgcHVibGljIGNvbDogbnVtYmVyKSB7fVxuXG4gIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMub2Zmc2V0ICE9IG51bGwgPyBgJHt0aGlzLmZpbGUudXJsfUAke3RoaXMubGluZX06JHt0aGlzLmNvbH1gIDogdGhpcy5maWxlLnVybDtcbiAgfVxuXG4gIG1vdmVCeShkZWx0YTogbnVtYmVyKTogUGFyc2VMb2NhdGlvbiB7XG4gICAgY29uc3Qgc291cmNlID0gdGhpcy5maWxlLmNvbnRlbnQ7XG4gICAgY29uc3QgbGVuID0gc291cmNlLmxlbmd0aDtcbiAgICBsZXQgb2Zmc2V0ID0gdGhpcy5vZmZzZXQ7XG4gICAgbGV0IGxpbmUgPSB0aGlzLmxpbmU7XG4gICAgbGV0IGNvbCA9IHRoaXMuY29sO1xuICAgIHdoaWxlIChvZmZzZXQgPiAwICYmIGRlbHRhIDwgMCkge1xuICAgICAgb2Zmc2V0LS07XG4gICAgICBkZWx0YSsrO1xuICAgICAgY29uc3QgY2ggPSBzb3VyY2UuY2hhckNvZGVBdChvZmZzZXQpO1xuICAgICAgaWYgKGNoID09IGNoYXJzLiRMRikge1xuICAgICAgICBsaW5lLS07XG4gICAgICAgIGNvbnN0IHByaW9yTGluZSA9IHNvdXJjZS5zdWJzdHIoMCwgb2Zmc2V0IC0gMSkubGFzdEluZGV4T2YoU3RyaW5nLmZyb21DaGFyQ29kZShjaGFycy4kTEYpKTtcbiAgICAgICAgY29sID0gcHJpb3JMaW5lID4gMCA/IG9mZnNldCAtIHByaW9yTGluZSA6IG9mZnNldDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbC0tO1xuICAgICAgfVxuICAgIH1cbiAgICB3aGlsZSAob2Zmc2V0IDwgbGVuICYmIGRlbHRhID4gMCkge1xuICAgICAgY29uc3QgY2ggPSBzb3VyY2UuY2hhckNvZGVBdChvZmZzZXQpO1xuICAgICAgb2Zmc2V0Kys7XG4gICAgICBkZWx0YS0tO1xuICAgICAgaWYgKGNoID09IGNoYXJzLiRMRikge1xuICAgICAgICBsaW5lKys7XG4gICAgICAgIGNvbCA9IDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb2wrKztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQYXJzZUxvY2F0aW9uKHRoaXMuZmlsZSwgb2Zmc2V0LCBsaW5lLCBjb2wpO1xuICB9XG5cbiAgLy8gUmV0dXJuIHRoZSBzb3VyY2UgYXJvdW5kIHRoZSBsb2NhdGlvblxuICAvLyBVcCB0byBgbWF4Q2hhcnNgIG9yIGBtYXhMaW5lc2Agb24gZWFjaCBzaWRlIG9mIHRoZSBsb2NhdGlvblxuICBnZXRDb250ZXh0KG1heENoYXJzOiBudW1iZXIsIG1heExpbmVzOiBudW1iZXIpOiB7YmVmb3JlOiBzdHJpbmcsIGFmdGVyOiBzdHJpbmd9fG51bGwge1xuICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLmZpbGUuY29udGVudDtcbiAgICBsZXQgc3RhcnRPZmZzZXQgPSB0aGlzLm9mZnNldDtcblxuICAgIGlmIChzdGFydE9mZnNldCAhPSBudWxsKSB7XG4gICAgICBpZiAoc3RhcnRPZmZzZXQgPiBjb250ZW50Lmxlbmd0aCAtIDEpIHtcbiAgICAgICAgc3RhcnRPZmZzZXQgPSBjb250ZW50Lmxlbmd0aCAtIDE7XG4gICAgICB9XG4gICAgICBsZXQgZW5kT2Zmc2V0ID0gc3RhcnRPZmZzZXQ7XG4gICAgICBsZXQgY3R4Q2hhcnMgPSAwO1xuICAgICAgbGV0IGN0eExpbmVzID0gMDtcblxuICAgICAgd2hpbGUgKGN0eENoYXJzIDwgbWF4Q2hhcnMgJiYgc3RhcnRPZmZzZXQgPiAwKSB7XG4gICAgICAgIHN0YXJ0T2Zmc2V0LS07XG4gICAgICAgIGN0eENoYXJzKys7XG4gICAgICAgIGlmIChjb250ZW50W3N0YXJ0T2Zmc2V0XSA9PSAnXFxuJykge1xuICAgICAgICAgIGlmICgrK2N0eExpbmVzID09IG1heExpbmVzKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY3R4Q2hhcnMgPSAwO1xuICAgICAgY3R4TGluZXMgPSAwO1xuICAgICAgd2hpbGUgKGN0eENoYXJzIDwgbWF4Q2hhcnMgJiYgZW5kT2Zmc2V0IDwgY29udGVudC5sZW5ndGggLSAxKSB7XG4gICAgICAgIGVuZE9mZnNldCsrO1xuICAgICAgICBjdHhDaGFycysrO1xuICAgICAgICBpZiAoY29udGVudFtlbmRPZmZzZXRdID09ICdcXG4nKSB7XG4gICAgICAgICAgaWYgKCsrY3R4TGluZXMgPT0gbWF4TGluZXMpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBiZWZvcmU6IGNvbnRlbnQuc3Vic3RyaW5nKHN0YXJ0T2Zmc2V0LCB0aGlzLm9mZnNldCksXG4gICAgICAgIGFmdGVyOiBjb250ZW50LnN1YnN0cmluZyh0aGlzLm9mZnNldCwgZW5kT2Zmc2V0ICsgMSksXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQYXJzZVNvdXJjZUZpbGUge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgY29udGVudDogc3RyaW5nLCBwdWJsaWMgdXJsOiBzdHJpbmcpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBQYXJzZVNvdXJjZVNwYW4ge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHB1YmxpYyBzdGFydDogUGFyc2VMb2NhdGlvbiwgcHVibGljIGVuZDogUGFyc2VMb2NhdGlvbiwgcHVibGljIGRldGFpbHM6IHN0cmluZ3xudWxsID0gbnVsbCkge31cblxuICB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0LmZpbGUuY29udGVudC5zdWJzdHJpbmcodGhpcy5zdGFydC5vZmZzZXQsIHRoaXMuZW5kLm9mZnNldCk7XG4gIH1cbn1cblxuZXhwb3J0IGVudW0gUGFyc2VFcnJvckxldmVsIHtcbiAgV0FSTklORyxcbiAgRVJST1IsXG59XG5cbmV4cG9ydCBjbGFzcyBQYXJzZUVycm9yIHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwdWJsaWMgc3BhbjogUGFyc2VTb3VyY2VTcGFuLCBwdWJsaWMgbXNnOiBzdHJpbmcsXG4gICAgICBwdWJsaWMgbGV2ZWw6IFBhcnNlRXJyb3JMZXZlbCA9IFBhcnNlRXJyb3JMZXZlbC5FUlJPUikge31cblxuICBjb250ZXh0dWFsTWVzc2FnZSgpOiBzdHJpbmcge1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuc3Bhbi5zdGFydC5nZXRDb250ZXh0KDEwMCwgMyk7XG4gICAgcmV0dXJuIGN0eCA/IGAke3RoaXMubXNnfSAoXCIke2N0eC5iZWZvcmV9WyR7UGFyc2VFcnJvckxldmVsW3RoaXMubGV2ZWxdfSAtPl0ke2N0eC5hZnRlcn1cIilgIDpcbiAgICAgICAgICAgICAgICAgdGhpcy5tc2c7XG4gIH1cblxuICB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgIGNvbnN0IGRldGFpbHMgPSB0aGlzLnNwYW4uZGV0YWlscyA/IGAsICR7dGhpcy5zcGFuLmRldGFpbHN9YCA6ICcnO1xuICAgIHJldHVybiBgJHt0aGlzLmNvbnRleHR1YWxNZXNzYWdlKCl9OiAke3RoaXMuc3Bhbi5zdGFydH0ke2RldGFpbHN9YDtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdHlwZVNvdXJjZVNwYW4oa2luZDogc3RyaW5nLCB0eXBlOiBDb21waWxlSWRlbnRpZmllck1ldGFkYXRhKTogUGFyc2VTb3VyY2VTcGFuIHtcbiAgY29uc3QgbW9kdWxlVXJsID0gaWRlbnRpZmllck1vZHVsZVVybCh0eXBlKTtcbiAgY29uc3Qgc291cmNlRmlsZU5hbWUgPSBtb2R1bGVVcmwgIT0gbnVsbCA/IGBpbiAke2tpbmR9ICR7aWRlbnRpZmllck5hbWUodHlwZSl9IGluICR7bW9kdWxlVXJsfWAgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYGluICR7a2luZH0gJHtpZGVudGlmaWVyTmFtZSh0eXBlKX1gO1xuICBjb25zdCBzb3VyY2VGaWxlID0gbmV3IFBhcnNlU291cmNlRmlsZSgnJywgc291cmNlRmlsZU5hbWUpO1xuICByZXR1cm4gbmV3IFBhcnNlU291cmNlU3BhbihcbiAgICAgIG5ldyBQYXJzZUxvY2F0aW9uKHNvdXJjZUZpbGUsIC0xLCAtMSwgLTEpLCBuZXcgUGFyc2VMb2NhdGlvbihzb3VyY2VGaWxlLCAtMSwgLTEsIC0xKSk7XG59XG5cbi8qKlxuICogR2VuZXJhdGVzIFNvdXJjZSBTcGFuIG9iamVjdCBmb3IgYSBnaXZlbiBSMyBUeXBlIGZvciBKSVQgbW9kZS5cbiAqXG4gKiBAcGFyYW0ga2luZCBDb21wb25lbnQgb3IgRGlyZWN0aXZlLlxuICogQHBhcmFtIHR5cGVOYW1lIG5hbWUgb2YgdGhlIENvbXBvbmVudCBvciBEaXJlY3RpdmUuXG4gKiBAcGFyYW0gc291cmNlVXJsIHJlZmVyZW5jZSB0byBDb21wb25lbnQgb3IgRGlyZWN0aXZlIHNvdXJjZS5cbiAqIEByZXR1cm5zIGluc3RhbmNlIG9mIFBhcnNlU291cmNlU3BhbiB0aGF0IHJlcHJlc2VudCBhIGdpdmVuIENvbXBvbmVudCBvciBEaXJlY3RpdmUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByM0ppdFR5cGVTb3VyY2VTcGFuKFxuICAgIGtpbmQ6IHN0cmluZywgdHlwZU5hbWU6IHN0cmluZywgc291cmNlVXJsOiBzdHJpbmcpOiBQYXJzZVNvdXJjZVNwYW4ge1xuICBjb25zdCBzb3VyY2VGaWxlTmFtZSA9IGBpbiAke2tpbmR9ICR7dHlwZU5hbWV9IGluICR7c291cmNlVXJsfWA7XG4gIGNvbnN0IHNvdXJjZUZpbGUgPSBuZXcgUGFyc2VTb3VyY2VGaWxlKCcnLCBzb3VyY2VGaWxlTmFtZSk7XG4gIHJldHVybiBuZXcgUGFyc2VTb3VyY2VTcGFuKFxuICAgICAgbmV3IFBhcnNlTG9jYXRpb24oc291cmNlRmlsZSwgLTEsIC0xLCAtMSksIG5ldyBQYXJzZUxvY2F0aW9uKHNvdXJjZUZpbGUsIC0xLCAtMSwgLTEpKTtcbn0iXX0=