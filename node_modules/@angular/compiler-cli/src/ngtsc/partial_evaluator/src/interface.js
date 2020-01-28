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
        define("@angular/compiler-cli/src/ngtsc/partial_evaluator/src/interface", ["require", "exports", "@angular/compiler-cli/src/ngtsc/partial_evaluator/src/interpreter"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var interpreter_1 = require("@angular/compiler-cli/src/ngtsc/partial_evaluator/src/interpreter");
    var PartialEvaluator = /** @class */ (function () {
        function PartialEvaluator(host, checker) {
            this.host = host;
            this.checker = checker;
        }
        PartialEvaluator.prototype.evaluate = function (expr, foreignFunctionResolver, visitedFilesCb) {
            var interpreter = new interpreter_1.StaticInterpreter(this.host, this.checker, visitedFilesCb);
            if (visitedFilesCb) {
                visitedFilesCb(expr.getSourceFile());
            }
            return interpreter.visit(expr, {
                absoluteModuleName: null,
                resolutionContext: expr.getSourceFile().fileName,
                scope: new Map(), foreignFunctionResolver: foreignFunctionResolver,
            });
        };
        return PartialEvaluator;
    }());
    exports.PartialEvaluator = PartialEvaluator;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJmYWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy9wYXJ0aWFsX2V2YWx1YXRvci9zcmMvaW50ZXJmYWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBT0gsaUdBQWdEO0lBU2hEO1FBQ0UsMEJBQW9CLElBQW9CLEVBQVUsT0FBdUI7WUFBckQsU0FBSSxHQUFKLElBQUksQ0FBZ0I7WUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFnQjtRQUFHLENBQUM7UUFFN0UsbUNBQVEsR0FBUixVQUNJLElBQW1CLEVBQUUsdUJBQWlELEVBQ3RFLGNBQXFDO1lBQ3ZDLElBQU0sV0FBVyxHQUFHLElBQUksK0JBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1lBQ25GLElBQUksY0FBYyxFQUFFO2dCQUNsQixjQUFjLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7YUFDdEM7WUFDRCxPQUFPLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFO2dCQUM3QixrQkFBa0IsRUFBRSxJQUFJO2dCQUN4QixpQkFBaUIsRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsUUFBUTtnQkFDaEQsS0FBSyxFQUFFLElBQUksR0FBRyxFQUEwQyxFQUFFLHVCQUF1Qix5QkFBQTthQUNsRixDQUFDLENBQUM7UUFDTCxDQUFDO1FBQ0gsdUJBQUM7SUFBRCxDQUFDLEFBaEJELElBZ0JDO0lBaEJZLDRDQUFnQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7UmVmZXJlbmNlfSBmcm9tICcuLi8uLi9pbXBvcnRzJztcbmltcG9ydCB7UmVmbGVjdGlvbkhvc3R9IGZyb20gJy4uLy4uL3JlZmxlY3Rpb24nO1xuXG5pbXBvcnQge1N0YXRpY0ludGVycHJldGVyfSBmcm9tICcuL2ludGVycHJldGVyJztcbmltcG9ydCB7UmVzb2x2ZWRWYWx1ZX0gZnJvbSAnLi9yZXN1bHQnO1xuXG5leHBvcnQgdHlwZSBGb3JlaWduRnVuY3Rpb25SZXNvbHZlciA9XG4gICAgKG5vZGU6IFJlZmVyZW5jZTx0cy5GdW5jdGlvbkRlY2xhcmF0aW9ufHRzLk1ldGhvZERlY2xhcmF0aW9ufHRzLkZ1bmN0aW9uRXhwcmVzc2lvbj4sXG4gICAgIGFyZ3M6IFJlYWRvbmx5QXJyYXk8dHMuRXhwcmVzc2lvbj4pID0+IHRzLkV4cHJlc3Npb24gfCBudWxsO1xuXG5leHBvcnQgdHlwZSBWaXNpdGVkRmlsZXNDYWxsYmFjayA9IChzZjogdHMuU291cmNlRmlsZSkgPT4gdm9pZDtcblxuZXhwb3J0IGNsYXNzIFBhcnRpYWxFdmFsdWF0b3Ige1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGhvc3Q6IFJlZmxlY3Rpb25Ib3N0LCBwcml2YXRlIGNoZWNrZXI6IHRzLlR5cGVDaGVja2VyKSB7fVxuXG4gIGV2YWx1YXRlKFxuICAgICAgZXhwcjogdHMuRXhwcmVzc2lvbiwgZm9yZWlnbkZ1bmN0aW9uUmVzb2x2ZXI/OiBGb3JlaWduRnVuY3Rpb25SZXNvbHZlcixcbiAgICAgIHZpc2l0ZWRGaWxlc0NiPzogVmlzaXRlZEZpbGVzQ2FsbGJhY2spOiBSZXNvbHZlZFZhbHVlIHtcbiAgICBjb25zdCBpbnRlcnByZXRlciA9IG5ldyBTdGF0aWNJbnRlcnByZXRlcih0aGlzLmhvc3QsIHRoaXMuY2hlY2tlciwgdmlzaXRlZEZpbGVzQ2IpO1xuICAgIGlmICh2aXNpdGVkRmlsZXNDYikge1xuICAgICAgdmlzaXRlZEZpbGVzQ2IoZXhwci5nZXRTb3VyY2VGaWxlKCkpO1xuICAgIH1cbiAgICByZXR1cm4gaW50ZXJwcmV0ZXIudmlzaXQoZXhwciwge1xuICAgICAgYWJzb2x1dGVNb2R1bGVOYW1lOiBudWxsLFxuICAgICAgcmVzb2x1dGlvbkNvbnRleHQ6IGV4cHIuZ2V0U291cmNlRmlsZSgpLmZpbGVOYW1lLFxuICAgICAgc2NvcGU6IG5ldyBNYXA8dHMuUGFyYW1ldGVyRGVjbGFyYXRpb24sIFJlc29sdmVkVmFsdWU+KCksIGZvcmVpZ25GdW5jdGlvblJlc29sdmVyLFxuICAgIH0pO1xuICB9XG59XG4iXX0=