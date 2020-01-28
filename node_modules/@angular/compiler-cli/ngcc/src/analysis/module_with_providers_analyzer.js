(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/analysis/module_with_providers_analyzer", ["require", "exports", "typescript", "@angular/compiler-cli/src/ngtsc/imports", "@angular/compiler-cli/ngcc/src/utils"], factory);
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
    var ts = require("typescript");
    var imports_1 = require("@angular/compiler-cli/src/ngtsc/imports");
    var utils_1 = require("@angular/compiler-cli/ngcc/src/utils");
    exports.ModuleWithProvidersAnalyses = Map;
    var ModuleWithProvidersAnalyzer = /** @class */ (function () {
        function ModuleWithProvidersAnalyzer(host, referencesRegistry) {
            this.host = host;
            this.referencesRegistry = referencesRegistry;
        }
        ModuleWithProvidersAnalyzer.prototype.analyzeProgram = function (program) {
            var _this = this;
            var analyses = new exports.ModuleWithProvidersAnalyses();
            var rootFiles = this.getRootFiles(program);
            rootFiles.forEach(function (f) {
                var fns = _this.host.getModuleWithProvidersFunctions(f);
                fns && fns.forEach(function (fn) {
                    var dtsFn = _this.getDtsDeclarationForFunction(fn);
                    var typeParam = dtsFn.type && ts.isTypeReferenceNode(dtsFn.type) &&
                        dtsFn.type.typeArguments && dtsFn.type.typeArguments[0] ||
                        null;
                    if (!typeParam || isAnyKeyword(typeParam)) {
                        // Either we do not have a parameterized type or the type is `any`.
                        var ngModule = fn.ngModule;
                        // For internal (non-library) module references, redirect the module's value declaration
                        // to its type declaration.
                        if (ngModule.viaModule === null) {
                            var dtsNgModule = _this.host.getDtsDeclaration(ngModule.node);
                            if (!dtsNgModule) {
                                throw new Error("No typings declaration can be found for the referenced NgModule class in " + fn.declaration.getText() + ".");
                            }
                            if (!ts.isClassDeclaration(dtsNgModule) || !utils_1.hasNameIdentifier(dtsNgModule)) {
                                throw new Error("The referenced NgModule in " + fn.declaration.getText() + " is not a named class declaration in the typings program; instead we get " + dtsNgModule.getText());
                            }
                            // Record the usage of the internal module as it needs to become an exported symbol
                            _this.referencesRegistry.add(ngModule.node, new imports_1.Reference(ngModule.node));
                            ngModule = { node: dtsNgModule, viaModule: null };
                        }
                        var dtsFile = dtsFn.getSourceFile();
                        var analysis = analyses.get(dtsFile) || [];
                        analysis.push({ declaration: dtsFn, ngModule: ngModule });
                        analyses.set(dtsFile, analysis);
                    }
                });
            });
            return analyses;
        };
        ModuleWithProvidersAnalyzer.prototype.getRootFiles = function (program) {
            return program.getRootFileNames().map(function (f) { return program.getSourceFile(f); }).filter(utils_1.isDefined);
        };
        ModuleWithProvidersAnalyzer.prototype.getDtsDeclarationForFunction = function (fn) {
            var dtsFn = null;
            var containerClass = fn.container && this.host.getClassSymbol(fn.container);
            if (containerClass) {
                var dtsClass = this.host.getDtsDeclaration(containerClass.valueDeclaration);
                // Get the declaration of the matching static method
                dtsFn = dtsClass && ts.isClassDeclaration(dtsClass) ?
                    dtsClass.members
                        .find(function (member) { return ts.isMethodDeclaration(member) && ts.isIdentifier(member.name) &&
                        member.name.text === fn.name; }) :
                    null;
            }
            else {
                dtsFn = this.host.getDtsDeclaration(fn.declaration);
            }
            if (!dtsFn) {
                throw new Error("Matching type declaration for " + fn.declaration.getText() + " is missing");
            }
            if (!isFunctionOrMethod(dtsFn)) {
                throw new Error("Matching type declaration for " + fn.declaration.getText() + " is not a function: " + dtsFn.getText());
            }
            return dtsFn;
        };
        return ModuleWithProvidersAnalyzer;
    }());
    exports.ModuleWithProvidersAnalyzer = ModuleWithProvidersAnalyzer;
    function isFunctionOrMethod(declaration) {
        return ts.isFunctionDeclaration(declaration) || ts.isMethodDeclaration(declaration);
    }
    function isAnyKeyword(typeParam) {
        return typeParam.kind === ts.SyntaxKind.AnyKeyword;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX3dpdGhfcHJvdmlkZXJzX2FuYWx5emVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL25nY2Mvc3JjL2FuYWx5c2lzL21vZHVsZV93aXRoX3Byb3ZpZGVyc19hbmFseXplci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILCtCQUFpQztJQUdqQyxtRUFBcUQ7SUFHckQsOERBQXNEO0lBZ0J6QyxRQUFBLDJCQUEyQixHQUFHLEdBQUcsQ0FBQztJQUUvQztRQUNFLHFDQUFvQixJQUF3QixFQUFVLGtCQUFzQztZQUF4RSxTQUFJLEdBQUosSUFBSSxDQUFvQjtZQUFVLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUFBRyxDQUFDO1FBRWhHLG9EQUFjLEdBQWQsVUFBZSxPQUFtQjtZQUFsQyxpQkFzQ0M7WUFyQ0MsSUFBTSxRQUFRLEdBQUcsSUFBSSxtQ0FBMkIsRUFBRSxDQUFDO1lBQ25ELElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDN0MsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUM7Z0JBQ2pCLElBQU0sR0FBRyxHQUFHLEtBQUksQ0FBQyxJQUFJLENBQUMsK0JBQStCLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pELEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQUEsRUFBRTtvQkFDbkIsSUFBTSxLQUFLLEdBQUcsS0FBSSxDQUFDLDRCQUE0QixDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUNwRCxJQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO3dCQUMxRCxLQUFLLENBQUMsSUFBSSxDQUFDLGFBQWEsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFD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QUFDLElBQUksS0FBSyxFQUFFLENBQUMsSUFBSSxFQUR0QixDQUNzQixDQUFtQixDQUFDLENBQUM7b0JBQzdELElBQUksQ0FBQzthQUNWO2lCQUFNO2dCQUNMLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQzthQUNyRDtZQUNELElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ1YsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQ0FBaUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsZ0JBQWEsQ0FBQyxDQUFDO2FBQ3pGO1lBQ0QsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUM5QixNQUFNLElBQUksS0FBSyxDQUNYLG1DQUFpQyxFQUFFLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSw0QkFBdUIsS0FBSyxDQUFDLE9BQU8sRUFBSSxDQUFDLENBQUM7YUFDeEc7WUFDRCxPQUFPLEtBQUssQ0FBQztRQUNmLENBQUM7UUFDSCxrQ0FBQztJQUFELENBQUMsQUF2RUQsSUF1RUM7SUF2RVksa0VBQTJCO0lBMEV4QyxTQUFTLGtCQUFrQixDQUFDLFdBQTJCO1FBRXJELE9BQU8sRUFBRSxDQUFDLHFCQUFxQixDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN0RixDQUFDO0lBRUQsU0FBUyxZQUFZLENBQUMsU0FBc0I7UUFDMUMsT0FBTyxTQUFTLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDO0lBQ3JELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuaW1wb3J0IHtSZWZlcmVuY2VzUmVnaXN0cnl9IGZyb20gJy4uLy4uLy4uL3NyYy9uZ3RzYy9hbm5vdGF0aW9ucyc7XG5pbXBvcnQge1JlZmVyZW5jZX0gZnJvbSAnLi4vLi4vLi4vc3JjL25ndHNjL2ltcG9ydHMnO1xuaW1wb3J0IHtDbGFzc0RlY2xhcmF0aW9uLCBEZWNsYXJhdGlvbn0gZnJvbSAnLi4vLi4vLi4vc3JjL25ndHNjL3JlZmxlY3Rpb24nO1xuaW1wb3J0IHtNb2R1bGVXaXRoUHJvdmlkZXJzRnVuY3Rpb24sIE5nY2NSZWZsZWN0aW9uSG9zdH0gZnJvbSAnLi4vaG9zdC9uZ2NjX2hvc3QnO1xuaW1wb3J0IHtoYXNOYW1lSWRlbnRpZmllciwgaXNEZWZpbmVkfSBmcm9tICcuLi91dGlscyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTW9kdWxlV2l0aFByb3ZpZGVyc0luZm8ge1xuICAvKipcbiAgICogVGhlIGRlY2xhcmF0aW9uIChpbiB0aGUgLmQudHMgZmlsZSkgb2YgdGhlIGZ1bmN0aW9uIHRoYXQgcmV0dXJuc1xuICAgKiBhIGBNb2R1bGVXaXRoUHJvdmlkZXJzIG9iamVjdCwgYnV0IGhhcyBhIHNpZ25hdHVyZSB0aGF0IG5lZWRzXG4gICAqIGEgdHlwZSBwYXJhbWV0ZXIgYWRkaW5nLlxuICAgKi9cbiAgZGVjbGFyYXRpb246IHRzLk1ldGhvZERlY2xhcmF0aW9ufHRzLkZ1bmN0aW9uRGVjbGFyYXRpb247XG4gIC8qKlxuICAgKiBUaGUgTmdNb2R1bGUgY2xhc3MgZGVjbGFyYXRpb24gKGluIHRoZSAuZC50cyBmaWxlKSB0byBhZGQgYXMgYSB0eXBlIHBhcmFtZXRlci5cbiAgICovXG4gIG5nTW9kdWxlOiBEZWNsYXJhdGlvbjxDbGFzc0RlY2xhcmF0aW9uPjtcbn1cblxuZXhwb3J0IHR5cGUgTW9kdWxlV2l0aFByb3ZpZGVyc0FuYWx5c2VzID0gTWFwPHRzLlNvdXJjZUZpbGUsIE1vZHVsZVdpdGhQcm92aWRlcnNJbmZvW10+O1xuZXhwb3J0IGNvbnN0IE1vZHVsZVdpdGhQcm92aWRlcnNBbmFseXNlcyA9IE1hcDtcblxuZXhwb3J0IGNsYXNzIE1vZHVsZVdpdGhQcm92aWRlcnNBbmFseXplciB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaG9zdDogTmdjY1JlZmxlY3Rpb25Ib3N0LCBwcml2YXRlIHJlZmVyZW5jZXNSZWdpc3RyeTogUmVmZXJlbmNlc1JlZ2lzdHJ5KSB7fVxuXG4gIGFuYWx5emVQcm9ncmFtKHByb2dyYW06IHRzLlByb2dyYW0pOiBNb2R1bGVXaXRoUHJvdmlkZXJzQW5hbHlzZXMge1xuICAgIGNvbnN0IGFuYWx5c2VzID0gbmV3IE1vZHVsZVdpdGhQcm92aWRlcnNBbmFseXNlcygpO1xuICAgIGNvbnN0IHJvb3RGaWxlcyA9IHRoaXMuZ2V0Um9vdEZpbGVzKHByb2dyYW0pO1xuICAgIHJvb3RGaWxlcy5mb3JFYWNoKGYgPT4ge1xuICAgICAgY29uc3QgZm5zID0gdGhpcy5ob3N0LmdldE1vZHVsZVdpdGhQcm92aWRlcnNGdW5jdGlvbnMoZik7XG4gICAgICBmbnMgJiYgZm5zLmZvckVhY2goZm4gPT4ge1xuICAgICAgICBjb25zdCBkdHNGbiA9IHRoaXMuZ2V0RHRzRGVjbGFyYXRpb25Gb3JGdW5jdGlvbihmbik7XG4gICAgICAgIGNvbnN0IHR5cGVQYXJhbSA9IGR0c0ZuLnR5cGUgJiYgdHMuaXNUeXBlUmVmZXJlbmNlTm9kZShkdHNGbi50eXBlKSAmJlxuICAgICAgICAgICAgICAgIGR0c0ZuLnR5cGUudHlwZUFyZ3VtZW50cyAmJiBkdHNGbi50eXBlLnR5cGVBcmd1bWVudHNbMF0gfHxcbiAgICAgICAgICAgIG51bGw7XG4gICAgICAgIGlmICghdHlwZVBhcmFtIHx8IGlzQW55S2V5d29yZCh0eXBlUGFyYW0pKSB7XG4gICAgICAgICAgLy8gRWl0aGVyIHdlIGRvIG5vdCBoYXZlIGEgcGFyYW1ldGVyaXplZCB0eXBlIG9yIHRoZSB0eXBlIGlzIGBhbnlgLlxuICAgICAgICAgIGxldCBuZ01vZHVsZSA9IGZuLm5nTW9kdWxlO1xuICAgICAgICAgIC8vIEZvciBpbnRlcm5hbCAobm9uLWxpYnJhcnkpIG1vZHVsZSByZWZlcmVuY2VzLCByZWRpcmVjdCB0aGUgbW9kdWxlJ3MgdmFsdWUgZGVjbGFyYXRpb25cbiAgICAgICAgICAvLyB0byBpdHMgdHlwZSBkZWNsYXJhdGlvbi5cbiAgICAgICAgICBpZiAobmdNb2R1bGUudmlhTW9kdWxlID09PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCBkdHNOZ01vZHVsZSA9IHRoaXMuaG9zdC5nZXREdHNEZWNsYXJhdGlvbihuZ01vZHVsZS5ub2RlKTtcbiAgICAgICAgICAgIGlmICghZHRzTmdNb2R1bGUpIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgICAgYE5vIHR5cGluZ3MgZGVjbGFyYXRpb24gY2FuIGJlIGZvdW5kIGZvciB0aGUgcmVmZXJlbmNlZCBOZ01vZHVsZSBjbGFzcyBpbiAke2ZuLmRlY2xhcmF0aW9uLmdldFRleHQoKX0uYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXRzLmlzQ2xhc3NEZWNsYXJhdGlvbihkdHNOZ01vZHVsZSkgfHwgIWhhc05hbWVJZGVudGlmaWVyKGR0c05nTW9kdWxlKSkge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgICBgVGhlIHJlZmVyZW5jZWQgTmdNb2R1bGUgaW4gJHtmbi5kZWNsYXJhdGlvbi5nZXRUZXh0KCl9IGlzIG5vdCBhIG5hbWVkIGNsYXNzIGRlY2xhcmF0aW9uIGluIHRoZSB0eXBpbmdzIHByb2dyYW07IGluc3RlYWQgd2UgZ2V0ICR7ZHRzTmdNb2R1bGUuZ2V0VGV4dCgpfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gUmVjb3JkIHRoZSB1c2FnZSBvZiB0aGUgaW50ZXJuYWwgbW9kdWxlIGFzIGl0IG5lZWRzIHRvIGJlY29tZSBhbiBleHBvcnRlZCBzeW1ib2xcbiAgICAgICAgICAgIHRoaXMucmVmZXJlbmNlc1JlZ2lzdHJ5LmFkZChuZ01vZHVsZS5ub2RlLCBuZXcgUmVmZXJlbmNlKG5nTW9kdWxlLm5vZGUpKTtcblxuICAgICAgICAgICAgbmdNb2R1bGUgPSB7bm9kZTogZHRzTmdNb2R1bGUsIHZpYU1vZHVsZTogbnVsbH07XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IGR0c0ZpbGUgPSBkdHNGbi5nZXRTb3VyY2VGaWxlKCk7XG4gICAgICAgICAgY29uc3QgYW5hbHlzaXMgPSBhbmFseXNlcy5nZXQoZHRzRmlsZSkgfHwgW107XG4gICAgICAgICAgYW5hbHlzaXMucHVzaCh7ZGVjbGFyYXRpb246IGR0c0ZuLCBuZ01vZHVsZX0pO1xuICAgICAgICAgIGFuYWx5c2VzLnNldChkdHNGaWxlLCBhbmFseXNpcyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBhbmFseXNlcztcbiAgfVxuXG4gIHByaXZhdGUgZ2V0Um9vdEZpbGVzKHByb2dyYW06IHRzLlByb2dyYW0pOiB0cy5Tb3VyY2VGaWxlW10ge1xuICAgIHJldHVybiBwcm9ncmFtLmdldFJvb3RGaWxlTmFtZXMoKS5tYXAoZiA9PiBwcm9ncmFtLmdldFNvdXJjZUZpbGUoZikpLmZpbHRlcihpc0RlZmluZWQpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXREdHNEZWNsYXJhdGlvbkZvckZ1bmN0aW9uKGZuOiBNb2R1bGVXaXRoUHJvdmlkZXJzRnVuY3Rpb24pIHtcbiAgICBsZXQgZHRzRm46IHRzLkRlY2xhcmF0aW9ufG51bGwgPSBudWxsO1xuICAgIGNvbnN0IGNvbnRhaW5lckNsYXNzID0gZm4uY29udGFpbmVyICYmIHRoaXMuaG9zdC5nZXRDbGFzc1N5bWJvbChmbi5jb250YWluZXIpO1xuICAgIGlmIChjb250YWluZXJDbGFzcykge1xuICAgICAgY29uc3QgZHRzQ2xhc3MgPSB0aGlzLmhvc3QuZ2V0RHRzRGVjbGFyYXRpb24oY29udGFpbmVyQ2xhc3MudmFsdWVEZWNsYXJhdGlvbik7XG4gICAgICAvLyBHZXQgdGhlIGRlY2xhcmF0aW9uIG9mIHRoZSBtYXRjaGluZyBzdGF0aWMgbWV0aG9kXG4gICAgICBkdHNGbiA9IGR0c0NsYXNzICYmIHRzLmlzQ2xhc3NEZWNsYXJhdGlvbihkdHNDbGFzcykgP1xuICAgICAgICAgIGR0c0NsYXNzLm1lbWJlcnNcbiAgICAgICAgICAgICAgLmZpbmQoXG4gICAgICAgICAgICAgICAgICBtZW1iZXIgPT4gdHMuaXNNZXRob2REZWNsYXJhdGlvbihtZW1iZXIpICYmIHRzLmlzSWRlbnRpZmllcihtZW1iZXIubmFtZSkgJiZcbiAgICAgICAgICAgICAgICAgICAgICBtZW1iZXIubmFtZS50ZXh0ID09PSBmbi5uYW1lKSBhcyB0cy5EZWNsYXJhdGlvbiA6XG4gICAgICAgICAgbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgZHRzRm4gPSB0aGlzLmhvc3QuZ2V0RHRzRGVjbGFyYXRpb24oZm4uZGVjbGFyYXRpb24pO1xuICAgIH1cbiAgICBpZiAoIWR0c0ZuKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE1hdGNoaW5nIHR5cGUgZGVjbGFyYXRpb24gZm9yICR7Zm4uZGVjbGFyYXRpb24uZ2V0VGV4dCgpfSBpcyBtaXNzaW5nYCk7XG4gICAgfVxuICAgIGlmICghaXNGdW5jdGlvbk9yTWV0aG9kKGR0c0ZuKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBNYXRjaGluZyB0eXBlIGRlY2xhcmF0aW9uIGZvciAke2ZuLmRlY2xhcmF0aW9uLmdldFRleHQoKX0gaXMgbm90IGEgZnVuY3Rpb246ICR7ZHRzRm4uZ2V0VGV4dCgpfWApO1xuICAgIH1cbiAgICByZXR1cm4gZHRzRm47XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uT3JNZXRob2QoZGVjbGFyYXRpb246IHRzLkRlY2xhcmF0aW9uKTogZGVjbGFyYXRpb24gaXMgdHMuRnVuY3Rpb25EZWNsYXJhdGlvbnxcbiAgICB0cy5NZXRob2REZWNsYXJhdGlvbiB7XG4gIHJldHVybiB0cy5pc0Z1bmN0aW9uRGVjbGFyYXRpb24oZGVjbGFyYXRpb24pIHx8IHRzLmlzTWV0aG9kRGVjbGFyYXRpb24oZGVjbGFyYXRpb24pO1xufVxuXG5mdW5jdGlvbiBpc0FueUtleXdvcmQodHlwZVBhcmFtOiB0cy5UeXBlTm9kZSk6IHR5cGVQYXJhbSBpcyB0cy5LZXl3b3JkVHlwZU5vZGUge1xuICByZXR1cm4gdHlwZVBhcmFtLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuQW55S2V5d29yZDtcbn1cbiJdfQ==