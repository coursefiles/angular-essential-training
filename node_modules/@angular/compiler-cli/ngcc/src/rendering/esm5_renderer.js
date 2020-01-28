(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/rendering/esm5_renderer", ["require", "exports", "tslib", "typescript", "@angular/compiler-cli/ngcc/src/host/esm5_host", "@angular/compiler-cli/ngcc/src/rendering/esm_renderer"], factory);
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
    var ts = require("typescript");
    var esm5_host_1 = require("@angular/compiler-cli/ngcc/src/host/esm5_host");
    var esm_renderer_1 = require("@angular/compiler-cli/ngcc/src/rendering/esm_renderer");
    var Esm5Renderer = /** @class */ (function (_super) {
        tslib_1.__extends(Esm5Renderer, _super);
        function Esm5Renderer(logger, host, isCore, bundle, sourcePath) {
            return _super.call(this, logger, host, isCore, bundle, sourcePath) || this;
        }
        /**
         * Add the definitions to each decorated class
         */
        Esm5Renderer.prototype.addDefinitions = function (output, compiledClass, definitions) {
            var iifeBody = esm5_host_1.getIifeBody(compiledClass.declaration);
            if (!iifeBody) {
                throw new Error("Compiled class declaration is not inside an IIFE: " + compiledClass.name + " in " + compiledClass.declaration.getSourceFile().fileName);
            }
            var returnStatement = iifeBody.statements.find(ts.isReturnStatement);
            if (!returnStatement) {
                throw new Error("Compiled class wrapper IIFE does not have a return statement: " + compiledClass.name + " in " + compiledClass.declaration.getSourceFile().fileName);
            }
            var insertionPoint = returnStatement.getFullStart();
            output.appendLeft(insertionPoint, '\n' + definitions);
        };
        return Esm5Renderer;
    }(esm_renderer_1.EsmRenderer));
    exports.Esm5Renderer = Esm5Renderer;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXNtNV9yZW5kZXJlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9uZ2NjL3NyYy9yZW5kZXJpbmcvZXNtNV9yZW5kZXJlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFBQTs7Ozs7O09BTUc7SUFDSCwrQkFBaUM7SUFFakMsMkVBQThDO0lBRzlDLHNGQUEyQztJQUkzQztRQUFrQyx3Q0FBVztRQUMzQyxzQkFDSSxNQUFjLEVBQUUsSUFBd0IsRUFBRSxNQUFlLEVBQUUsTUFBd0IsRUFDbkYsVUFBa0I7bUJBQ3BCLGtCQUFNLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxVQUFVLENBQUM7UUFDakQsQ0FBQztRQUVEOztXQUVHO1FBQ0gscUNBQWMsR0FBZCxVQUFlLE1BQW1CLEVBQUUsYUFBNEIsRUFBRSxXQUFtQjtZQUNuRixJQUFNLFFBQVEsR0FBRyx1QkFBVyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUN4RCxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNiLE1BQU0sSUFBSSxLQUFLLENBQ1gsdURBQXFELGFBQWEsQ0FBQyxJQUFJLFlBQU8sYUFBYSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxRQUFVLENBQUMsQ0FBQzthQUN6STtZQUVELElBQU0sZUFBZSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQ3ZFLElBQUksQ0FBQyxlQUFlLEVBQUU7Z0JBQ3BCLE1BQU0sSUFBSSxLQUFLLENBQ1gsbUVBQWlFLGFBQWEsQ0FBQyxJQUFJLFlBQU8sYUFBYSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxRQUFVLENBQUMsQ0FBQzthQUNySjtZQUVELElBQU0sY0FBYyxHQUFHLGVBQWUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUN0RCxNQUFNLENBQUMsVUFBVSxDQUFDLGNBQWMsRUFBRSxJQUFJLEdBQUcsV0FBVyxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUNILG1CQUFDO0lBQUQsQ0FBQyxBQTFCRCxDQUFrQywwQkFBVyxHQTBCNUM7SUExQlksb0NBQVkiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcbmltcG9ydCBNYWdpY1N0cmluZyBmcm9tICdtYWdpYy1zdHJpbmcnO1xuaW1wb3J0IHtnZXRJaWZlQm9keX0gZnJvbSAnLi4vaG9zdC9lc201X2hvc3QnO1xuaW1wb3J0IHtOZ2NjUmVmbGVjdGlvbkhvc3R9IGZyb20gJy4uL2hvc3QvbmdjY19ob3N0JztcbmltcG9ydCB7Q29tcGlsZWRDbGFzc30gZnJvbSAnLi4vYW5hbHlzaXMvZGVjb3JhdGlvbl9hbmFseXplcic7XG5pbXBvcnQge0VzbVJlbmRlcmVyfSBmcm9tICcuL2VzbV9yZW5kZXJlcic7XG5pbXBvcnQge0VudHJ5UG9pbnRCdW5kbGV9IGZyb20gJy4uL3BhY2thZ2VzL2VudHJ5X3BvaW50X2J1bmRsZSc7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi4vbG9nZ2luZy9sb2dnZXInO1xuXG5leHBvcnQgY2xhc3MgRXNtNVJlbmRlcmVyIGV4dGVuZHMgRXNtUmVuZGVyZXIge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIGxvZ2dlcjogTG9nZ2VyLCBob3N0OiBOZ2NjUmVmbGVjdGlvbkhvc3QsIGlzQ29yZTogYm9vbGVhbiwgYnVuZGxlOiBFbnRyeVBvaW50QnVuZGxlLFxuICAgICAgc291cmNlUGF0aDogc3RyaW5nKSB7XG4gICAgc3VwZXIobG9nZ2VyLCBob3N0LCBpc0NvcmUsIGJ1bmRsZSwgc291cmNlUGF0aCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIHRoZSBkZWZpbml0aW9ucyB0byBlYWNoIGRlY29yYXRlZCBjbGFzc1xuICAgKi9cbiAgYWRkRGVmaW5pdGlvbnMob3V0cHV0OiBNYWdpY1N0cmluZywgY29tcGlsZWRDbGFzczogQ29tcGlsZWRDbGFzcywgZGVmaW5pdGlvbnM6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IGlpZmVCb2R5ID0gZ2V0SWlmZUJvZHkoY29tcGlsZWRDbGFzcy5kZWNsYXJhdGlvbik7XG4gICAgaWYgKCFpaWZlQm9keSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBDb21waWxlZCBjbGFzcyBkZWNsYXJhdGlvbiBpcyBub3QgaW5zaWRlIGFuIElJRkU6ICR7Y29tcGlsZWRDbGFzcy5uYW1lfSBpbiAke2NvbXBpbGVkQ2xhc3MuZGVjbGFyYXRpb24uZ2V0U291cmNlRmlsZSgpLmZpbGVOYW1lfWApO1xuICAgIH1cblxuICAgIGNvbnN0IHJldHVyblN0YXRlbWVudCA9IGlpZmVCb2R5LnN0YXRlbWVudHMuZmluZCh0cy5pc1JldHVyblN0YXRlbWVudCk7XG4gICAgaWYgKCFyZXR1cm5TdGF0ZW1lbnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgQ29tcGlsZWQgY2xhc3Mgd3JhcHBlciBJSUZFIGRvZXMgbm90IGhhdmUgYSByZXR1cm4gc3RhdGVtZW50OiAke2NvbXBpbGVkQ2xhc3MubmFtZX0gaW4gJHtjb21waWxlZENsYXNzLmRlY2xhcmF0aW9uLmdldFNvdXJjZUZpbGUoKS5maWxlTmFtZX1gKTtcbiAgICB9XG5cbiAgICBjb25zdCBpbnNlcnRpb25Qb2ludCA9IHJldHVyblN0YXRlbWVudC5nZXRGdWxsU3RhcnQoKTtcbiAgICBvdXRwdXQuYXBwZW5kTGVmdChpbnNlcnRpb25Qb2ludCwgJ1xcbicgKyBkZWZpbml0aW9ucyk7XG4gIH1cbn1cbiJdfQ==