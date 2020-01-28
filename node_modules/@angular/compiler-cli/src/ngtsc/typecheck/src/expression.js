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
        define("@angular/compiler-cli/src/ngtsc/typecheck/src/expression", ["require", "exports", "@angular/compiler", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var compiler_1 = require("@angular/compiler");
    var ts = require("typescript");
    var NULL_AS_ANY = ts.createAsExpression(ts.createNull(), ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword));
    var UNDEFINED = ts.createIdentifier('undefined');
    var BINARY_OPS = new Map([
        ['+', ts.SyntaxKind.PlusToken],
        ['-', ts.SyntaxKind.MinusToken],
        ['<', ts.SyntaxKind.LessThanToken],
        ['>', ts.SyntaxKind.GreaterThanToken],
        ['<=', ts.SyntaxKind.LessThanEqualsToken],
        ['>=', ts.SyntaxKind.GreaterThanEqualsToken],
        ['==', ts.SyntaxKind.EqualsEqualsToken],
        ['===', ts.SyntaxKind.EqualsEqualsEqualsToken],
        ['*', ts.SyntaxKind.AsteriskToken],
        ['/', ts.SyntaxKind.SlashToken],
        ['%', ts.SyntaxKind.PercentToken],
        ['!=', ts.SyntaxKind.ExclamationEqualsToken],
        ['!==', ts.SyntaxKind.ExclamationEqualsEqualsToken],
        ['||', ts.SyntaxKind.BarBarToken],
        ['&&', ts.SyntaxKind.AmpersandAmpersandToken],
        ['&', ts.SyntaxKind.AmpersandToken],
        ['|', ts.SyntaxKind.BarToken],
    ]);
    /**
     * Convert an `AST` to TypeScript code directly, without going through an intermediate `Expression`
     * AST.
     */
    function astToTypescript(ast, maybeResolve, config) {
        var resolved = maybeResolve(ast);
        if (resolved !== null) {
            return resolved;
        }
        // Branch based on the type of expression being processed.
        if (ast instanceof compiler_1.ASTWithSource) {
            // Fall through to the underlying AST.
            return astToTypescript(ast.ast, maybeResolve, config);
        }
        else if (ast instanceof compiler_1.PropertyRead) {
            // This is a normal property read - convert the receiver to an expression and emit the correct
            // TypeScript expression to read the property.
            var receiver = astToTypescript(ast.receiver, maybeResolve, config);
            return ts.createPropertyAccess(receiver, ast.name);
        }
        else if (ast instanceof compiler_1.Interpolation) {
            return astArrayToExpression(ast.expressions, maybeResolve, config);
        }
        else if (ast instanceof compiler_1.Binary) {
            var lhs = astToTypescript(ast.left, maybeResolve, config);
            var rhs = astToTypescript(ast.right, maybeResolve, config);
            var op = BINARY_OPS.get(ast.operation);
            if (op === undefined) {
                throw new Error("Unsupported Binary.operation: " + ast.operation);
            }
            return ts.createBinary(lhs, op, rhs);
        }
        else if (ast instanceof compiler_1.LiteralPrimitive) {
            if (ast.value === undefined) {
                return ts.createIdentifier('undefined');
            }
            else if (ast.value === null) {
                return ts.createNull();
            }
            else {
                return ts.createLiteral(ast.value);
            }
        }
        else if (ast instanceof compiler_1.MethodCall) {
            var receiver = astToTypescript(ast.receiver, maybeResolve, config);
            var method = ts.createPropertyAccess(receiver, ast.name);
            var args = ast.args.map(function (expr) { return astToTypescript(expr, maybeResolve, config); });
            return ts.createCall(method, undefined, args);
        }
        else if (ast instanceof compiler_1.Conditional) {
            var condExpr = astToTypescript(ast.condition, maybeResolve, config);
            var trueExpr = astToTypescript(ast.trueExp, maybeResolve, config);
            var falseExpr = astToTypescript(ast.falseExp, maybeResolve, config);
            return ts.createParen(ts.createConditional(condExpr, trueExpr, falseExpr));
        }
        else if (ast instanceof compiler_1.LiteralArray) {
            var elements = ast.expressions.map(function (expr) { return astToTypescript(expr, maybeResolve, config); });
            return ts.createArrayLiteral(elements);
        }
        else if (ast instanceof compiler_1.LiteralMap) {
            var properties = ast.keys.map(function (_a, idx) {
                var key = _a.key;
                var value = astToTypescript(ast.values[idx], maybeResolve, config);
                return ts.createPropertyAssignment(ts.createStringLiteral(key), value);
            });
            return ts.createObjectLiteral(properties, true);
        }
        else if (ast instanceof compiler_1.KeyedRead) {
            var receiver = astToTypescript(ast.obj, maybeResolve, config);
            var key = astToTypescript(ast.key, maybeResolve, config);
            return ts.createElementAccess(receiver, key);
        }
        else if (ast instanceof compiler_1.NonNullAssert) {
            var expr = astToTypescript(ast.expression, maybeResolve, config);
            return ts.createNonNullExpression(expr);
        }
        else if (ast instanceof compiler_1.PrefixNot) {
            return ts.createLogicalNot(astToTypescript(ast.expression, maybeResolve, config));
        }
        else if (ast instanceof compiler_1.SafePropertyRead) {
            // A safe property expression a?.b takes the form `(a != null ? a!.b : whenNull)`, where
            // whenNull is either of type 'any' or or 'undefined' depending on strictness. The non-null
            // assertion is necessary because in practice 'a' may be a method call expression, which won't
            // have a narrowed type when repeated in the ternary true branch.
            var receiver = astToTypescript(ast.receiver, maybeResolve, config);
            var expr = ts.createPropertyAccess(ts.createNonNullExpression(receiver), ast.name);
            var whenNull = config.strictSafeNavigationTypes ? UNDEFINED : NULL_AS_ANY;
            return safeTernary(receiver, expr, whenNull);
        }
        else if (ast instanceof compiler_1.SafeMethodCall) {
            var receiver = astToTypescript(ast.receiver, maybeResolve, config);
            // See the comment in SafePropertyRead above for an explanation of the need for the non-null
            // assertion here.
            var method = ts.createPropertyAccess(ts.createNonNullExpression(receiver), ast.name);
            var args = ast.args.map(function (expr) { return astToTypescript(expr, maybeResolve, config); });
            var expr = ts.createCall(method, undefined, args);
            var whenNull = config.strictSafeNavigationTypes ? UNDEFINED : NULL_AS_ANY;
            return safeTernary(receiver, expr, whenNull);
        }
        else {
            throw new Error("Unknown node type: " + Object.getPrototypeOf(ast).constructor);
        }
    }
    exports.astToTypescript = astToTypescript;
    /**
     * Convert an array of `AST` expressions into a single `ts.Expression`, by converting them all
     * and separating them with commas.
     */
    function astArrayToExpression(astArray, maybeResolve, config) {
        // Reduce the `asts` array into a `ts.Expression`. Multiple expressions are combined into a
        // `ts.BinaryExpression` with a comma separator. First make a copy of the input array, as
        // it will be modified during the reduction.
        var asts = astArray.slice();
        return asts.reduce(function (lhs, ast) { return ts.createBinary(lhs, ts.SyntaxKind.CommaToken, astToTypescript(ast, maybeResolve, config)); }, astToTypescript(asts.pop(), maybeResolve, config));
    }
    function safeTernary(lhs, whenNotNull, whenNull) {
        var notNullComp = ts.createBinary(lhs, ts.SyntaxKind.ExclamationEqualsToken, ts.createNull());
        var ternary = ts.createConditional(notNullComp, whenNotNull, whenNull);
        return ts.createParen(ternary);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwcmVzc2lvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvdHlwZWNoZWNrL3NyYy9leHByZXNzaW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBRUgsOENBQXNPO0lBQ3RPLCtCQUFpQztJQUlqQyxJQUFNLFdBQVcsR0FDYixFQUFFLENBQUMsa0JBQWtCLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDL0YsSUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBRW5ELElBQU0sVUFBVSxHQUFHLElBQUksR0FBRyxDQUF3QjtRQUNoRCxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQztRQUM5QixDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQztRQUMvQixDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQztRQUNsQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDO1FBQ3JDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUM7UUFDekMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxzQkFBc0IsQ0FBQztRQUM1QyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDO1FBQ3ZDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsdUJBQXVCLENBQUM7UUFDOUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFD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Q0FBQztRQUN6RSxPQUFPLEVBQUUsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDakMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtBU1QsIEFTVFdpdGhTb3VyY2UsIEJpbmFyeSwgQ29uZGl0aW9uYWwsIEludGVycG9sYXRpb24sIEtleWVkUmVhZCwgTGl0ZXJhbEFycmF5LCBMaXRlcmFsTWFwLCBMaXRlcmFsUHJpbWl0aXZlLCBNZXRob2RDYWxsLCBOb25OdWxsQXNzZXJ0LCBQcmVmaXhOb3QsIFByb3BlcnR5UmVhZCwgU2FmZU1ldGhvZENhbGwsIFNhZmVQcm9wZXJ0eVJlYWR9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge1R5cGVDaGVja2luZ0NvbmZpZ30gZnJvbSAnLi9hcGknO1xuXG5jb25zdCBOVUxMX0FTX0FOWSA9XG4gICAgdHMuY3JlYXRlQXNFeHByZXNzaW9uKHRzLmNyZWF0ZU51bGwoKSwgdHMuY3JlYXRlS2V5d29yZFR5cGVOb2RlKHRzLlN5bnRheEtpbmQuQW55S2V5d29yZCkpO1xuY29uc3QgVU5ERUZJTkVEID0gdHMuY3JlYXRlSWRlbnRpZmllcigndW5kZWZpbmVkJyk7XG5cbmNvbnN0IEJJTkFSWV9PUFMgPSBuZXcgTWFwPHN0cmluZywgdHMuU3ludGF4S2luZD4oW1xuICBbJysnLCB0cy5TeW50YXhLaW5kLlBsdXNUb2tlbl0sXG4gIFsnLScsIHRzLlN5bnRheEtpbmQuTWludXNUb2tlbl0sXG4gIFsnPCcsIHRzLlN5bnRheEtpbmQuTGVzc1RoYW5Ub2tlbl0sXG4gIFsnPicsIHRzLlN5bnRheEtpbmQuR3JlYXRlclRoYW5Ub2tlbl0sXG4gIFsnPD0nLCB0cy5TeW50YXhLaW5kLkxlc3NUaGFuRXF1YWxzVG9rZW5dLFxuICBbJz49JywgdHMuU3ludGF4S2luZC5HcmVhdGVyVGhhbkVxdWFsc1Rva2VuXSxcbiAgWyc9PScsIHRzLlN5bnRheEtpbmQuRXF1YWxzRXF1YWxzVG9rZW5dLFxuICBbJz09PScsIHRzLlN5bnRheEtpbmQuRXF1YWxzRXF1YWxzRXF1YWxzVG9rZW5dLFxuICBbJyonLCB0cy5TeW50YXhLaW5kLkFzdGVyaXNrVG9rZW5dLFxuICBbJy8nLCB0cy5TeW50YXhLaW5kLlNsYXNoVG9rZW5dLFxuICBbJyUnLCB0cy5TeW50YXhLaW5kLlBlcmNlbnRUb2tlbl0sXG4gIFsnIT0nLCB0cy5TeW50YXhLaW5kLkV4Y2xhbWF0aW9uRXF1YWxzVG9rZW5dLFxuICBbJyE9PScsIHRzLlN5bnRheEtpbmQuRXhjbGFtYXRpb25FcXVhbHNFcXVhbHNUb2tlbl0sXG4gIFsnfHwnLCB0cy5TeW50YXhLaW5kLkJhckJhclRva2VuXSxcbiAgWycmJicsIHRzLlN5bnRheEtpbmQuQW1wZXJzYW5kQW1wZXJzYW5kVG9rZW5dLFxuICBbJyYnLCB0cy5TeW50YXhLaW5kLkFtcGVyc2FuZFRva2VuXSxcbiAgWyd8JywgdHMuU3ludGF4S2luZC5CYXJUb2tlbl0sXG5dKTtcblxuLyoqXG4gKiBDb252ZXJ0IGFuIGBBU1RgIHRvIFR5cGVTY3JpcHQgY29kZSBkaXJlY3RseSwgd2l0aG91dCBnb2luZyB0aHJvdWdoIGFuIGludGVybWVkaWF0ZSBgRXhwcmVzc2lvbmBcbiAqIEFTVC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFzdFRvVHlwZXNjcmlwdChcbiAgICBhc3Q6IEFTVCwgbWF5YmVSZXNvbHZlOiAoYXN0OiBBU1QpID0+IHRzLkV4cHJlc3Npb24gfCBudWxsLFxuICAgIGNvbmZpZzogVHlwZUNoZWNraW5nQ29uZmlnKTogdHMuRXhwcmVzc2lvbiB7XG4gIGNvbnN0IHJlc29sdmVkID0gbWF5YmVSZXNvbHZlKGFzdCk7XG4gIGlmIChyZXNvbHZlZCAhPT0gbnVsbCkge1xuICAgIHJldHVybiByZXNvbHZlZDtcbiAgfVxuICAvLyBCcmFuY2ggYmFzZWQgb24gdGhlIHR5cGUgb2YgZXhwcmVzc2lvbiBiZWluZyBwcm9jZXNzZWQuXG4gIGlmIChhc3QgaW5zdGFuY2VvZiBBU1RXaXRoU291cmNlKSB7XG4gICAgLy8gRmFsbCB0aHJvdWdoIHRvIHRoZSB1bmRlcmx5aW5nIEFTVC5cbiAgICByZXR1cm4gYXN0VG9UeXBlc2NyaXB0KGFzdC5hc3QsIG1heWJlUmVzb2x2ZSwgY29uZmlnKTtcbiAgfSBlbHNlIGlmIChhc3QgaW5zdGFuY2VvZiBQcm9wZXJ0eVJlYWQpIHtcbiAgICAvLyBUaGlzIGlzIGEgbm9ybWFsIHByb3BlcnR5IHJlYWQgLSBjb252ZXJ0IHRoZSByZWNlaXZlciB0byBhbiBleHByZXNzaW9uIGFuZCBlbWl0IHRoZSBjb3JyZWN0XG4gICAgLy8gVHlwZVNjcmlwdCBleHByZXNzaW9uIHRvIHJlYWQgdGhlIHByb3BlcnR5LlxuICAgIGNvbnN0IHJlY2VpdmVyID0gYXN0VG9UeXBlc2NyaXB0KGFzdC5yZWNlaXZlciwgbWF5YmVSZXNvbHZlLCBjb25maWcpO1xuICAgIHJldHVybiB0cy5jcmVhdGVQcm9wZXJ0eUFjY2VzcyhyZWNlaXZlciwgYXN0Lm5hbWUpO1xuICB9IGVsc2UgaWYgKGFzdCBpbnN0YW5jZW9mIEludGVycG9sYXRpb24pIHtcbiAgICByZXR1cm4gYXN0QXJyYXlUb0V4cHJlc3Npb24oYXN0LmV4cHJlc3Npb25zLCBtYXliZVJlc29sdmUsIGNvbmZpZyk7XG4gIH0gZWxzZSBpZiAoYXN0IGluc3RhbmNlb2YgQmluYXJ5KSB7XG4gICAgY29uc3QgbGhzID0gYXN0VG9UeXBlc2NyaXB0KGFzdC5sZWZ0LCBtYXliZVJlc29sdmUsIGNvbmZpZyk7XG4gICAgY29uc3QgcmhzID0gYXN0VG9UeXBlc2NyaXB0KGFzdC5yaWdodCwgbWF5YmVSZXNvbHZlLCBjb25maWcpO1xuICAgIGNvbnN0IG9wID0gQklOQVJZX09QUy5nZXQoYXN0Lm9wZXJhdGlvbik7XG4gICAgaWYgKG9wID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgQmluYXJ5Lm9wZXJhdGlvbjogJHthc3Qub3BlcmF0aW9ufWApO1xuICAgIH1cbiAgICByZXR1cm4gdHMuY3JlYXRlQmluYXJ5KGxocywgb3AgYXMgYW55LCByaHMpO1xuICB9IGVsc2UgaWYgKGFzdCBpbnN0YW5jZW9mIExpdGVyYWxQcmltaXRpdmUpIHtcbiAgICBpZiAoYXN0LnZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0cy5jcmVhdGVJZGVudGlmaWVyKCd1bmRlZmluZWQnKTtcbiAgICB9IGVsc2UgaWYgKGFzdC52YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRzLmNyZWF0ZU51bGwoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRzLmNyZWF0ZUxpdGVyYWwoYXN0LnZhbHVlKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoYXN0IGluc3RhbmNlb2YgTWV0aG9kQ2FsbCkge1xuICAgIGNvbnN0IHJlY2VpdmVyID0gYXN0VG9UeXBlc2NyaXB0KGFzdC5yZWNlaXZlciwgbWF5YmVSZXNvbHZlLCBjb25maWcpO1xuICAgIGNvbnN0IG1ldGhvZCA9IHRzLmNyZWF0ZVByb3BlcnR5QWNjZXNzKHJlY2VpdmVyLCBhc3QubmFtZSk7XG4gICAgY29uc3QgYXJncyA9IGFzdC5hcmdzLm1hcChleHByID0+IGFzdFRvVHlwZXNjcmlwdChleHByLCBtYXliZVJlc29sdmUsIGNvbmZpZykpO1xuICAgIHJldHVybiB0cy5jcmVhdGVDYWxsKG1ldGhvZCwgdW5kZWZpbmVkLCBhcmdzKTtcbiAgfSBlbHNlIGlmIChhc3QgaW5zdGFuY2VvZiBDb25kaXRpb25hbCkge1xuICAgIGNvbnN0IGNvbmRFeHByID0gYXN0VG9UeXBlc2NyaXB0KGFzdC5jb25kaXRpb24sIG1heWJlUmVzb2x2ZSwgY29uZmlnKTtcbiAgICBjb25zdCB0cnVlRXhwciA9IGFzdFRvVHlwZXNjcmlwdChhc3QudHJ1ZUV4cCwgbWF5YmVSZXNvbHZlLCBjb25maWcpO1xuICAgIGNvbnN0IGZhbHNlRXhwciA9IGFzdFRvVHlwZXNjcmlwdChhc3QuZmFsc2VFeHAsIG1heWJlUmVzb2x2ZSwgY29uZmlnKTtcbiAgICByZXR1cm4gdHMuY3JlYXRlUGFyZW4odHMuY3JlYXRlQ29uZGl0aW9uYWwoY29uZEV4cHIsIHRydWVFeHByLCBmYWxzZUV4cHIpKTtcbiAgfSBlbHNlIGlmIChhc3QgaW5zdGFuY2VvZiBMaXRlcmFsQXJyYXkpIHtcbiAgICBjb25zdCBlbGVtZW50cyA9IGFzdC5leHByZXNzaW9ucy5tYXAoZXhwciA9PiBhc3RUb1R5cGVzY3JpcHQoZXhwciwgbWF5YmVSZXNvbHZlLCBjb25maWcpKTtcbiAgICByZXR1cm4gdHMuY3JlYXRlQXJyYXlMaXRlcmFsKGVsZW1lbnRzKTtcbiAgfSBlbHNlIGlmIChhc3QgaW5zdGFuY2VvZiBMaXRlcmFsTWFwKSB7XG4gICAgY29uc3QgcHJvcGVydGllcyA9IGFzdC5rZXlzLm1hcCgoe2tleX0sIGlkeCkgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSBhc3RUb1R5cGVzY3JpcHQoYXN0LnZhbHVlc1tpZHhdLCBtYXliZVJlc29sdmUsIGNvbmZpZyk7XG4gICAgICByZXR1cm4gdHMuY3JlYXRlUHJvcGVydHlBc3NpZ25tZW50KHRzLmNyZWF0ZVN0cmluZ0xpdGVyYWwoa2V5KSwgdmFsdWUpO1xuICAgIH0pO1xuICAgIHJldHVybiB0cy5jcmVhdGVPYmplY3RMaXRlcmFsKHByb3BlcnRpZXMsIHRydWUpO1xuICB9IGVsc2UgaWYgKGFzdCBpbnN0YW5jZW9mIEtleWVkUmVhZCkge1xuICAgIGNvbnN0IHJlY2VpdmVyID0gYXN0VG9UeXBlc2NyaXB0KGFzdC5vYmosIG1heWJlUmVzb2x2ZSwgY29uZmlnKTtcbiAgICBjb25zdCBrZXkgPSBhc3RUb1R5cGVzY3JpcHQoYXN0LmtleSwgbWF5YmVSZXNvbHZlLCBjb25maWcpO1xuICAgIHJldHVybiB0cy5jcmVhdGVFbGVtZW50QWNjZXNzKHJlY2VpdmVyLCBrZXkpO1xuICB9IGVsc2UgaWYgKGFzdCBpbnN0YW5jZW9mIE5vbk51bGxBc3NlcnQpIHtcbiAgICBjb25zdCBleHByID0gYXN0VG9UeXBlc2NyaXB0KGFzdC5leHByZXNzaW9uLCBtYXliZVJlc29sdmUsIGNvbmZpZyk7XG4gICAgcmV0dXJuIHRzLmNyZWF0ZU5vbk51bGxFeHByZXNzaW9uKGV4cHIpO1xuICB9IGVsc2UgaWYgKGFzdCBpbnN0YW5jZW9mIFByZWZpeE5vdCkge1xuICAgIHJldHVybiB0cy5jcmVhdGVMb2dpY2FsTm90KGFzdFRvVHlwZXNjcmlwdChhc3QuZXhwcmVzc2lvbiwgbWF5YmVSZXNvbHZlLCBjb25maWcpKTtcbiAgfSBlbHNlIGlmIChhc3QgaW5zdGFuY2VvZiBTYWZlUHJvcGVydHlSZWFkKSB7XG4gICAgLy8gQSBzYWZlIHByb3BlcnR5IGV4cHJlc3Npb24gYT8uYiB0YWtlcyB0aGUgZm9ybSBgKGEgIT0gbnVsbCA/IGEhLmIgOiB3aGVuTnVsbClgLCB3aGVyZVxuICAgIC8vIHdoZW5OdWxsIGlzIGVpdGhlciBvZiB0eXBlICdhbnknIG9yIG9yICd1bmRlZmluZWQnIGRlcGVuZGluZyBvbiBzdHJpY3RuZXNzLiBUaGUgbm9uLW51bGxcbiAgICAvLyBhc3NlcnRpb24gaXMgbmVjZXNzYXJ5IGJlY2F1c2UgaW4gcHJhY3RpY2UgJ2EnIG1heSBiZSBhIG1ldGhvZCBjYWxsIGV4cHJlc3Npb24sIHdoaWNoIHdvbid0XG4gICAgLy8gaGF2ZSBhIG5hcnJvd2VkIHR5cGUgd2hlbiByZXBlYXRlZCBpbiB0aGUgdGVybmFyeSB0cnVlIGJyYW5jaC5cbiAgICBjb25zdCByZWNlaXZlciA9IGFzdFRvVHlwZXNjcmlwdChhc3QucmVjZWl2ZXIsIG1heWJlUmVzb2x2ZSwgY29uZmlnKTtcbiAgICBjb25zdCBleHByID0gdHMuY3JlYXRlUHJvcGVydHlBY2Nlc3ModHMuY3JlYXRlTm9uTnVsbEV4cHJlc3Npb24ocmVjZWl2ZXIpLCBhc3QubmFtZSk7XG4gICAgY29uc3Qgd2hlbk51bGwgPSBjb25maWcuc3RyaWN0U2FmZU5hdmlnYXRpb25UeXBlcyA/IFVOREVGSU5FRCA6IE5VTExfQVNfQU5ZO1xuICAgIHJldHVybiBzYWZlVGVybmFyeShyZWNlaXZlciwgZXhwciwgd2hlbk51bGwpO1xuICB9IGVsc2UgaWYgKGFzdCBpbnN0YW5jZW9mIFNhZmVNZXRob2RDYWxsKSB7XG4gICAgY29uc3QgcmVjZWl2ZXIgPSBhc3RUb1R5cGVzY3JpcHQoYXN0LnJlY2VpdmVyLCBtYXliZVJlc29sdmUsIGNvbmZpZyk7XG4gICAgLy8gU2VlIHRoZSBjb21tZW50IGluIFNhZmVQcm9wZXJ0eVJlYWQgYWJvdmUgZm9yIGFuIGV4cGxhbmF0aW9uIG9mIHRoZSBuZWVkIGZvciB0aGUgbm9uLW51bGxcbiAgICAvLyBhc3NlcnRpb24gaGVyZS5cbiAgICBjb25zdCBtZXRob2QgPSB0cy5jcmVhdGVQcm9wZXJ0eUFjY2Vzcyh0cy5jcmVhdGVOb25OdWxsRXhwcmVzc2lvbihyZWNlaXZlciksIGFzdC5uYW1lKTtcbiAgICBjb25zdCBhcmdzID0gYXN0LmFyZ3MubWFwKGV4cHIgPT4gYXN0VG9UeXBlc2NyaXB0KGV4cHIsIG1heWJlUmVzb2x2ZSwgY29uZmlnKSk7XG4gICAgY29uc3QgZXhwciA9IHRzLmNyZWF0ZUNhbGwobWV0aG9kLCB1bmRlZmluZWQsIGFyZ3MpO1xuICAgIGNvbnN0IHdoZW5OdWxsID0gY29uZmlnLnN0cmljdFNhZmVOYXZpZ2F0aW9uVHlwZXMgPyBVTkRFRklORUQgOiBOVUxMX0FTX0FOWTtcbiAgICByZXR1cm4gc2FmZVRlcm5hcnkocmVjZWl2ZXIsIGV4cHIsIHdoZW5OdWxsKTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gbm9kZSB0eXBlOiAke09iamVjdC5nZXRQcm90b3R5cGVPZihhc3QpLmNvbnN0cnVjdG9yfWApO1xuICB9XG59XG5cbi8qKlxuICogQ29udmVydCBhbiBhcnJheSBvZiBgQVNUYCBleHByZXNzaW9ucyBpbnRvIGEgc2luZ2xlIGB0cy5FeHByZXNzaW9uYCwgYnkgY29udmVydGluZyB0aGVtIGFsbFxuICogYW5kIHNlcGFyYXRpbmcgdGhlbSB3aXRoIGNvbW1hcy5cbiAqL1xuZnVuY3Rpb24gYXN0QXJyYXlUb0V4cHJlc3Npb24oXG4gICAgYXN0QXJyYXk6IEFTVFtdLCBtYXliZVJlc29sdmU6IChhc3Q6IEFTVCkgPT4gdHMuRXhwcmVzc2lvbiB8IG51bGwsXG4gICAgY29uZmlnOiBUeXBlQ2hlY2tpbmdDb25maWcpOiB0cy5FeHByZXNzaW9uIHtcbiAgLy8gUmVkdWNlIHRoZSBgYXN0c2AgYXJyYXkgaW50byBhIGB0cy5FeHByZXNzaW9uYC4gTXVsdGlwbGUgZXhwcmVzc2lvbnMgYXJlIGNvbWJpbmVkIGludG8gYVxuICAvLyBgdHMuQmluYXJ5RXhwcmVzc2lvbmAgd2l0aCBhIGNvbW1hIHNlcGFyYXRvci4gRmlyc3QgbWFrZSBhIGNvcHkgb2YgdGhlIGlucHV0IGFycmF5LCBhc1xuICAvLyBpdCB3aWxsIGJlIG1vZGlmaWVkIGR1cmluZyB0aGUgcmVkdWN0aW9uLlxuICBjb25zdCBhc3RzID0gYXN0QXJyYXkuc2xpY2UoKTtcbiAgcmV0dXJuIGFzdHMucmVkdWNlKFxuICAgICAgKGxocywgYXN0KSA9PiB0cy5jcmVhdGVCaW5hcnkoXG4gICAgICAgICAgbGhzLCB0cy5TeW50YXhLaW5kLkNvbW1hVG9rZW4sIGFzdFRvVHlwZXNjcmlwdChhc3QsIG1heWJlUmVzb2x2ZSwgY29uZmlnKSksXG4gICAgICBhc3RUb1R5cGVzY3JpcHQoYXN0cy5wb3AoKSAhLCBtYXliZVJlc29sdmUsIGNvbmZpZykpO1xufVxuXG5mdW5jdGlvbiBzYWZlVGVybmFyeShcbiAgICBsaHM6IHRzLkV4cHJlc3Npb24sIHdoZW5Ob3ROdWxsOiB0cy5FeHByZXNzaW9uLCB3aGVuTnVsbDogdHMuRXhwcmVzc2lvbik6IHRzLkV4cHJlc3Npb24ge1xuICBjb25zdCBub3ROdWxsQ29tcCA9IHRzLmNyZWF0ZUJpbmFyeShsaHMsIHRzLlN5bnRheEtpbmQuRXhjbGFtYXRpb25FcXVhbHNUb2tlbiwgdHMuY3JlYXRlTnVsbCgpKTtcbiAgY29uc3QgdGVybmFyeSA9IHRzLmNyZWF0ZUNvbmRpdGlvbmFsKG5vdE51bGxDb21wLCB3aGVuTm90TnVsbCwgd2hlbk51bGwpO1xuICByZXR1cm4gdHMuY3JlYXRlUGFyZW4odGVybmFyeSk7XG59XG4iXX0=