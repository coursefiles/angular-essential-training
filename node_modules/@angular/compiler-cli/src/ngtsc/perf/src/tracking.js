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
        define("@angular/compiler-cli/src/ngtsc/perf/src/tracking", ["require", "exports", "fs", "path", "typescript", "@angular/compiler-cli/src/ngtsc/perf/src/clock"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /// <reference types="node" />
    var fs = require("fs");
    var path = require("path");
    var ts = require("typescript");
    var clock_1 = require("@angular/compiler-cli/src/ngtsc/perf/src/clock");
    var PerfTracker = /** @class */ (function () {
        function PerfTracker(zeroTime) {
            this.zeroTime = zeroTime;
            this.nextSpanId = 1;
            this.log = [];
            this.enabled = true;
        }
        PerfTracker.zeroedToNow = function () { return new PerfTracker(clock_1.mark()); };
        PerfTracker.prototype.mark = function (name, node, category, detail) {
            var msg = this.makeLogMessage(PerfLogEventType.MARK, name, node, category, detail, undefined);
            this.log.push(msg);
        };
        PerfTracker.prototype.start = function (name, node, category, detail) {
            var span = this.nextSpanId++;
            var msg = this.makeLogMessage(PerfLogEventType.SPAN_OPEN, name, node, category, detail, span);
            this.log.push(msg);
            return span;
        };
        PerfTracker.prototype.stop = function (span) {
            this.log.push({
                type: PerfLogEventType.SPAN_CLOSE,
                span: span,
                stamp: clock_1.timeSinceInMicros(this.zeroTime),
            });
        };
        PerfTracker.prototype.makeLogMessage = function (type, name, node, category, detail, span) {
            var msg = {
                type: type,
                name: name,
                stamp: clock_1.timeSinceInMicros(this.zeroTime),
            };
            if (category !== undefined) {
                msg.category = category;
            }
            if (detail !== undefined) {
                msg.detail = detail;
            }
            if (span !== undefined) {
                msg.span = span;
            }
            if (node !== undefined) {
                msg.file = node.getSourceFile().fileName;
                if (!ts.isSourceFile(node)) {
                    var name_1 = ts.getNameOfDeclaration(node);
                    if (name_1 !== undefined && ts.isIdentifier(name_1)) {
                        msg.declaration = name_1.text;
                    }
                }
            }
            return msg;
        };
        PerfTracker.prototype.asJson = function () { return this.log; };
        PerfTracker.prototype.serializeToFile = function (target, host) {
            var json = JSON.stringify(this.log, null, 2);
            if (target.startsWith('ts:')) {
                target = target.substr('ts:'.length);
                var outFile = path.posix.resolve(host.getCurrentDirectory(), target);
                host.writeFile(outFile, json, false);
            }
            else {
                var outFile = path.posix.resolve(host.getCurrentDirectory(), target);
                fs.writeFileSync(outFile, json);
            }
        };
        return PerfTracker;
    }());
    exports.PerfTracker = PerfTracker;
    var PerfLogEventType;
    (function (PerfLogEventType) {
        PerfLogEventType[PerfLogEventType["SPAN_OPEN"] = 0] = "SPAN_OPEN";
        PerfLogEventType[PerfLogEventType["SPAN_CLOSE"] = 1] = "SPAN_CLOSE";
        PerfLogEventType[PerfLogEventType["MARK"] = 2] = "MARK";
    })(PerfLogEventType = exports.PerfLogEventType || (exports.PerfLogEventType = {}));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhY2tpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL3BlcmYvc3JjL3RyYWNraW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBRUgsOEJBQThCO0lBQzlCLHVCQUF5QjtJQUN6QiwyQkFBNkI7SUFFN0IsK0JBQWlDO0lBR2pDLHdFQUF3RDtJQUV4RDtRQU1FLHFCQUE0QixRQUFnQjtZQUFoQixhQUFRLEdBQVIsUUFBUSxDQUFRO1lBTHBDLGVBQVUsR0FBRyxDQUFDLENBQUM7WUFDZixRQUFHLEdBQW1CLEVBQUUsQ0FBQztZQUV4QixZQUFPLEdBQUcsSUFBSSxDQUFDO1FBRXVCLENBQUM7UUFFekMsdUJBQVcsR0FBbEIsY0FBb0MsT0FBTyxJQUFJLFdBQVcsQ0FBQyxZQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVyRSwwQkFBSSxHQUFKLFVBQUssSUFBWSxFQUFFLElBQW1DLEVBQUUsUUFBaUIsRUFBRSxNQUFlO1lBRXhGLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztZQUNoRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNyQixDQUFDO1FBRUQsMkJBQUssR0FBTCxVQUFNLElBQVksRUFBRSxJQUFtQyxFQUFFLFFBQWlCLEVBQUUsTUFBZTtZQUV6RixJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDL0IsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFR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bUVBQVUsQ0FBQTtRQUNWLHVEQUFJLENBQUE7SUFDTixDQUFDLEVBSlcsZ0JBQWdCLEdBQWhCLHdCQUFnQixLQUFoQix3QkFBZ0IsUUFJM0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwibm9kZVwiIC8+XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuaW1wb3J0IHtQZXJmUmVjb3JkZXJ9IGZyb20gJy4vYXBpJztcbmltcG9ydCB7SHJUaW1lLCBtYXJrLCB0aW1lU2luY2VJbk1pY3Jvc30gZnJvbSAnLi9jbG9jayc7XG5cbmV4cG9ydCBjbGFzcyBQZXJmVHJhY2tlciBpbXBsZW1lbnRzIFBlcmZSZWNvcmRlciB7XG4gIHByaXZhdGUgbmV4dFNwYW5JZCA9IDE7XG4gIHByaXZhdGUgbG9nOiBQZXJmTG9nRXZlbnRbXSA9IFtdO1xuXG4gIHJlYWRvbmx5IGVuYWJsZWQgPSB0cnVlO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IocHJpdmF0ZSB6ZXJvVGltZTogSHJUaW1lKSB7fVxuXG4gIHN0YXRpYyB6ZXJvZWRUb05vdygpOiBQZXJmVHJhY2tlciB7IHJldHVybiBuZXcgUGVyZlRyYWNrZXIobWFyaygpKTsgfVxuXG4gIG1hcmsobmFtZTogc3RyaW5nLCBub2RlPzogdHMuU291cmNlRmlsZXx0cy5EZWNsYXJhdGlvbiwgY2F0ZWdvcnk/OiBzdHJpbmcsIGRldGFpbD86IHN0cmluZyk6XG4gICAgICB2b2lkIHtcbiAgICBjb25zdCBtc2cgPSB0aGlzLm1ha2VMb2dNZXNzYWdlKFBlcmZMb2dFdmVudFR5cGUuTUFSSywgbmFtZSwgbm9kZSwgY2F0ZWdvcnksIGRldGFpbCwgdW5kZWZpbmVkKTtcbiAgICB0aGlzLmxvZy5wdXNoKG1zZyk7XG4gIH1cblxuICBzdGFydChuYW1lOiBzdHJpbmcsIG5vZGU/OiB0cy5Tb3VyY2VGaWxlfHRzLkRlY2xhcmF0aW9uLCBjYXRlZ29yeT86IHN0cmluZywgZGV0YWlsPzogc3RyaW5nKTpcbiAgICAgIG51bWJlciB7XG4gICAgY29uc3Qgc3BhbiA9IHRoaXMubmV4dFNwYW5JZCsrO1xuICAgIGNvbnN0IG1zZyA9IHRoaXMubWFrZUxvZ01lc3NhZ2UoUGVyZkxvZ0V2ZW50VHlwZS5TUEFOX09QRU4sIG5hbWUsIG5vZGUsIGNhdGVnb3J5LCBkZXRhaWwsIHNwYW4pO1xuICAgIHRoaXMubG9nLnB1c2gobXNnKTtcbiAgICByZXR1cm4gc3BhbjtcbiAgfVxuXG4gIHN0b3Aoc3BhbjogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5sb2cucHVzaCh7XG4gICAgICB0eXBlOiBQZXJmTG9nRXZlbnRUeXBlLlNQQU5fQ0xPU0UsXG4gICAgICBzcGFuLFxuICAgICAgc3RhbXA6IHRpbWVTaW5jZUluTWljcm9zKHRoaXMuemVyb1RpbWUpLFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBtYWtlTG9nTWVzc2FnZShcbiAgICAgIHR5cGU6IFBlcmZMb2dFdmVudFR5cGUsIG5hbWU6IHN0cmluZywgbm9kZTogdHMuU291cmNlRmlsZXx0cy5EZWNsYXJhdGlvbnx1bmRlZmluZWQsXG4gICAgICBjYXRlZ29yeTogc3RyaW5nfHVuZGVmaW5lZCwgZGV0YWlsOiBzdHJpbmd8dW5kZWZpbmVkLCBzcGFuOiBudW1iZXJ8dW5kZWZpbmVkKTogUGVyZkxvZ0V2ZW50IHtcbiAgICBjb25zdCBtc2c6IFBlcmZMb2dFdmVudCA9IHtcbiAgICAgIHR5cGUsXG4gICAgICBuYW1lLFxuICAgICAgc3RhbXA6IHRpbWVTaW5jZUluTWljcm9zKHRoaXMuemVyb1RpbWUpLFxuICAgIH07XG4gICAgaWYgKGNhdGVnb3J5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIG1zZy5jYXRlZ29yeSA9IGNhdGVnb3J5O1xuICAgIH1cbiAgICBpZiAoZGV0YWlsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIG1zZy5kZXRhaWwgPSBkZXRhaWw7XG4gICAgfVxuICAgIGlmIChzcGFuICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIG1zZy5zcGFuID0gc3BhbjtcbiAgICB9XG4gICAgaWYgKG5vZGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgbXNnLmZpbGUgPSBub2RlLmdldFNvdXJjZUZpbGUoKS5maWxlTmFtZTtcbiAgICAgIGlmICghdHMuaXNTb3VyY2VGaWxlKG5vZGUpKSB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSB0cy5nZXROYW1lT2ZEZWNsYXJhdGlvbihub2RlKTtcbiAgICAgICAgaWYgKG5hbWUgIT09IHVuZGVmaW5lZCAmJiB0cy5pc0lkZW50aWZpZXIobmFtZSkpIHtcbiAgICAgICAgICBtc2cuZGVjbGFyYXRpb24gPSBuYW1lLnRleHQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1zZztcbiAgfVxuXG4gIGFzSnNvbigpOiB1bmtub3duIHsgcmV0dXJuIHRoaXMubG9nOyB9XG5cbiAgc2VyaWFsaXplVG9GaWxlKHRhcmdldDogc3RyaW5nLCBob3N0OiB0cy5Db21waWxlckhvc3QpOiB2b2lkIHtcbiAgICBjb25zdCBqc29uID0gSlNPTi5zdHJpbmdpZnkodGhpcy5sb2csIG51bGwsIDIpO1xuXG4gICAgaWYgKHRhcmdldC5zdGFydHNXaXRoKCd0czonKSkge1xuICAgICAgdGFyZ2V0ID0gdGFyZ2V0LnN1YnN0cigndHM6Jy5sZW5ndGgpO1xuICAgICAgY29uc3Qgb3V0RmlsZSA9IHBhdGgucG9zaXgucmVzb2x2ZShob3N0LmdldEN1cnJlbnREaXJlY3RvcnkoKSwgdGFyZ2V0KTtcbiAgICAgIGhvc3Qud3JpdGVGaWxlKG91dEZpbGUsIGpzb24sIGZhbHNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgb3V0RmlsZSA9IHBhdGgucG9zaXgucmVzb2x2ZShob3N0LmdldEN1cnJlbnREaXJlY3RvcnkoKSwgdGFyZ2V0KTtcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMob3V0RmlsZSwganNvbik7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGVyZkxvZ0V2ZW50IHtcbiAgbmFtZT86IHN0cmluZztcbiAgc3Bhbj86IG51bWJlcjtcbiAgZmlsZT86IHN0cmluZztcbiAgZGVjbGFyYXRpb24/OiBzdHJpbmc7XG4gIHR5cGU6IFBlcmZMb2dFdmVudFR5cGU7XG4gIGNhdGVnb3J5Pzogc3RyaW5nO1xuICBkZXRhaWw/OiBzdHJpbmc7XG4gIHN0YW1wOiBudW1iZXI7XG59XG5cbmV4cG9ydCBlbnVtIFBlcmZMb2dFdmVudFR5cGUge1xuICBTUEFOX09QRU4sXG4gIFNQQU5fQ0xPU0UsXG4gIE1BUkssXG59XG4iXX0=