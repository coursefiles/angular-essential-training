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
        define("@angular/language-service/src/language_service", ["require", "exports", "tslib", "@angular/compiler", "@angular/language-service/src/completions", "@angular/language-service/src/definitions", "@angular/language-service/src/diagnostics", "@angular/language-service/src/hover", "@angular/language-service/src/types"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var compiler_1 = require("@angular/compiler");
    var completions_1 = require("@angular/language-service/src/completions");
    var definitions_1 = require("@angular/language-service/src/definitions");
    var diagnostics_1 = require("@angular/language-service/src/diagnostics");
    var hover_1 = require("@angular/language-service/src/hover");
    var types_1 = require("@angular/language-service/src/types");
    /**
     * Create an instance of an Angular `LanguageService`.
     *
     * @publicApi
     */
    function createLanguageService(host) {
        return new LanguageServiceImpl(host);
    }
    exports.createLanguageService = createLanguageService;
    var LanguageServiceImpl = /** @class */ (function () {
        function LanguageServiceImpl(host) {
            this.host = host;
        }
        Object.defineProperty(LanguageServiceImpl.prototype, "metadataResolver", {
            get: function () { return this.host.resolver; },
            enumerable: true,
            configurable: true
        });
        LanguageServiceImpl.prototype.getTemplateReferences = function () { return this.host.getTemplateReferences(); };
        LanguageServiceImpl.prototype.getDiagnostics = function (fileName) {
            var results = [];
            var templates = this.host.getTemplates(fileName);
            if (templates && templates.length) {
                results.push.apply(results, tslib_1.__spread(diagnostics_1.getTemplateDiagnostics(fileName, this, templates)));
            }
            var declarations = this.host.getDeclarations(fileName);
            if (declarations && declarations.length) {
                var summary = this.host.getAnalyzedModules();
                results.push.apply(results, tslib_1.__spread(diagnostics_1.getDeclarationDiagnostics(declarations, summary)));
            }
            return uniqueBySpan(results);
        };
        LanguageServiceImpl.prototype.getPipesAt = function (fileName, position) {
            var templateInfo = this.getTemplateAstAtPosition(fileName, position);
            if (templateInfo) {
                return templateInfo.pipes;
            }
            return [];
        };
        LanguageServiceImpl.prototype.getCompletionsAt = function (fileName, position) {
            var templateInfo = this.getTemplateAstAtPosition(fileName, position);
            if (templateInfo) {
                return completions_1.getTemplateCompletions(templateInfo);
            }
        };
        LanguageServiceImpl.prototype.getDefinitionAt = function (fileName, position) {
            var templateInfo = this.getTemplateAstAtPosition(fileName, position);
            if (templateInfo) {
                return definitions_1.getDefinition(templateInfo);
            }
        };
        LanguageServiceImpl.prototype.getHoverAt = function (fileName, position) {
            var templateInfo = this.getTemplateAstAtPosition(fileName, position);
            if (templateInfo) {
                return hover_1.getHover(templateInfo);
            }
        };
        LanguageServiceImpl.prototype.getTemplateAstAtPosition = function (fileName, position) {
            var template = this.host.getTemplateAt(fileName, position);
            if (template) {
                var astResult = this.getTemplateAst(template, fileName);
                if (astResult && astResult.htmlAst && astResult.templateAst && astResult.directive &&
                    astResult.directives && astResult.pipes && astResult.expressionParser)
                    return {
                        position: position,
                        fileName: fileName,
                        template: template,
                        htmlAst: astResult.htmlAst,
                        directive: astResult.directive,
                        directives: astResult.directives,
                        pipes: astResult.pipes,
                        templateAst: astResult.templateAst,
                        expressionParser: astResult.expressionParser
                    };
            }
            return undefined;
        };
        LanguageServiceImpl.prototype.getTemplateAst = function (template, contextFile) {
            var _this = this;
            var result = undefined;
            try {
                var resolvedMetadata = this.metadataResolver.getNonNormalizedDirectiveMetadata(template.type);
                var metadata = resolvedMetadata && resolvedMetadata.metadata;
                if (metadata) {
                    var rawHtmlParser = new compiler_1.HtmlParser();
                    var htmlParser = new compiler_1.I18NHtmlParser(rawHtmlParser);
                    var expressionParser = new compiler_1.Parser(new compiler_1.Lexer());
                    var config = new compiler_1.CompilerConfig();
                    var parser = new compiler_1.TemplateParser(config, this.host.resolver.getReflector(), expressionParser, new compiler_1.DomElementSchemaRegistry(), htmlParser, null, []);
                    var htmlResult = htmlParser.parse(template.source, '', { tokenizeExpansionForms: true });
                    var analyzedModules = this.host.getAnalyzedModules();
                    var errors = undefined;
                    var ngModule = analyzedModules.ngModuleByPipeOrDirective.get(template.type);
                    if (!ngModule) {
                        // Reported by the the declaration diagnostics.
                        ngModule = findSuitableDefaultModule(analyzedModules);
                    }
                    if (ngModule) {
                        var resolvedDirectives = ngModule.transitiveModule.directives.map(function (d) { return _this.host.resolver.getNonNormalizedDirectiveMetadata(d.reference); });
                        var directives = removeMissing(resolvedDirectives).map(function (d) { return d.metadata.toSummary(); });
                        var pipes = ngModule.transitiveModule.pipes.map(function (p) { return _this.host.resolver.getOrLoadPipeMetadata(p.reference).toSummary(); });
                        var schemas = ngModule.schemas;
                        var parseResult = parser.tryParseHtml(htmlResult, metadata, directives, pipes, schemas);
                        result = {
                            htmlAst: htmlResult.rootNodes,
                            templateAst: parseResult.templateAst,
                            directive: metadata, directives: directives, pipes: pipes,
                            parseErrors: parseResult.errors, expressionParser: expressionParser, errors: errors
                        };
                    }
                }
            }
            catch (e) {
                var span = template.span;
                if (e.fileName == contextFile) {
                    span = template.query.getSpanAt(e.line, e.column) || span;
                }
                result = { errors: [{ kind: types_1.DiagnosticKind.Error, message: e.message, span: span }] };
            }
            return result || {};
        };
        return LanguageServiceImpl;
    }());
    function removeMissing(values) {
        return values.filter(function (e) { return !!e; });
    }
    function uniqueBySpan(elements) {
        var e_1, _a;
        if (elements) {
            var result = [];
            var map = new Map();
            try {
                for (var elements_1 = tslib_1.__values(elements), elements_1_1 = elements_1.next(); !elements_1_1.done; elements_1_1 = elements_1.next()) {
                    var element = elements_1_1.value;
                    var span = element.span;
                    var set = map.get(span.start);
                    if (!set) {
                        set = new Set();
                        map.set(span.start, set);
                    }
                    if (!set.has(span.end)) {
                        set.add(span.end);
                        result.push(element);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (elements_1_1 && !elements_1_1.done && (_a = elements_1.return)) _a.call(elements_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return result;
        }
    }
    function findSuitableDefaultModule(modules) {
        var e_2, _a;
        var result = undefined;
        var resultSize = 0;
        try {
            for (var _b = tslib_1.__values(modules.ngModules), _c = _b.next(); !_c.done; _c = _b.next()) {
                var module_1 = _c.value;
                var moduleSize = module_1.transitiveModule.directives.length;
                if (moduleSize > resultSize) {
                    result = module_1;
                    resultSize = moduleSize;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return result;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFuZ3VhZ2Vfc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xhbmd1YWdlLXNlcnZpY2Uvc3JjL2xhbmd1YWdlX3NlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7O0lBRUgsOENBQStOO0lBRy9OLHlFQUFxRDtJQUNyRCx5RUFBNEM7SUFDNUMseUVBQWdGO0lBQ2hGLDZEQUFpQztJQUNqQyw2REFBbUs7SUFHbks7Ozs7T0FJRztJQUNILFNBQWdCLHFCQUFxQixDQUFDLElBQXlCO1FBQzdELE9BQU8sSUFBSSxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRkQsc0RBRUM7SUFFRDtRQUNFLDZCQUFvQixJQUF5QjtZQUF6QixTQUFJLEdBQUosSUFBSSxDQUFxQjtRQUFHLENBQUM7UUFFakQsc0JBQVksaURBQWdCO2lCQUE1QixjQUEwRCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzs7O1dBQUE7UUFFdEYsbURBQXFCLEdBQXJCLGNBQW9DLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUUvRSw0Q0FBYyxHQUFkLFVBQWUsUUFBZ0I7WUFDN0IsSUFBSSxPQUFPLEdBQWdCLEVBQUUsQ0FBQztZQUM5QixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNqRCxJQUFJLFNBQVMsSUFBSSxTQUFTLENBQUMsTUFBTSxFQUFFO2dCQUNqQyxPQUFPLENBQUMsSUFBSSxPQUFaLE9BQU8sbUJBQVMsb0NBQXNCLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsR0FBRTthQUNwRTtZQUVELElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxD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QyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTt3QkFDdEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQ2xCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7cUJBQ3RCO2lCQUNGOzs7Ozs7Ozs7WUFDRCxPQUFPLE1BQU0sQ0FBQztTQUNmO0lBQ0gsQ0FBQztJQUVELFNBQVMseUJBQXlCLENBQUMsT0FBMEI7O1FBQzNELElBQUksTUFBTSxHQUFzQyxTQUFTLENBQUM7UUFDMUQsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDOztZQUNuQixLQUFxQixJQUFBLEtBQUEsaUJBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQSxnQkFBQSw0QkFBRTtnQkFBbkMsSUFBTSxRQUFNLFdBQUE7Z0JBQ2YsSUFBTSxVQUFVLEdBQUcsUUFBTSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7Z0JBQzdELElBQUksVUFBVSxHQUFHLFVBQVUsRUFBRTtvQkFDM0IsTUFBTSxHQUFHLFFBQU0sQ0FBQztvQkFDaEIsVUFBVSxHQUFHLFVBQVUsQ0FBQztpQkFDekI7YUFDRjs7Ozs7Ozs7O1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21waWxlTWV0YWRhdGFSZXNvbHZlciwgQ29tcGlsZU5nTW9kdWxlTWV0YWRhdGEsIENvbXBpbGVQaXBlU3VtbWFyeSwgQ29tcGlsZXJDb25maWcsIERvbUVsZW1lbnRTY2hlbWFSZWdpc3RyeSwgSHRtbFBhcnNlciwgSTE4Tkh0bWxQYXJzZXIsIExleGVyLCBOZ0FuYWx5emVkTW9kdWxlcywgUGFyc2VyLCBUZW1wbGF0ZVBhcnNlcn0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuXG5pbXBvcnQge0FzdFJlc3VsdCwgVGVtcGxhdGVJbmZvfSBmcm9tICcuL2NvbW1vbic7XG5pbXBvcnQge2dldFRlbXBsYXRlQ29tcGxldGlvbnN9IGZyb20gJy4vY29tcGxldGlvbnMnO1xuaW1wb3J0IHtnZXREZWZpbml0aW9ufSBmcm9tICcuL2RlZmluaXRpb25zJztcbmltcG9ydCB7Z2V0RGVjbGFyYXRpb25EaWFnbm9zdGljcywgZ2V0VGVtcGxhdGVEaWFnbm9zdGljc30gZnJvbSAnLi9kaWFnbm9zdGljcyc7XG5pbXBvcnQge2dldEhvdmVyfSBmcm9tICcuL2hvdmVyJztcbmltcG9ydCB7Q29tcGxldGlvbnMsIERlZmluaXRpb24sIERpYWdub3N0aWMsIERpYWdub3N0aWNLaW5kLCBEaWFnbm9zdGljcywgSG92ZXIsIExhbmd1YWdlU2VydmljZSwgTGFuZ3VhZ2VTZXJ2aWNlSG9zdCwgUGlwZXMsIFNwYW4sIFRlbXBsYXRlU291cmNlfSBmcm9tICcuL3R5cGVzJztcblxuXG4vKipcbiAqIENyZWF0ZSBhbiBpbnN0YW5jZSBvZiBhbiBBbmd1bGFyIGBMYW5ndWFnZVNlcnZpY2VgLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUxhbmd1YWdlU2VydmljZShob3N0OiBMYW5ndWFnZVNlcnZpY2VIb3N0KTogTGFuZ3VhZ2VTZXJ2aWNlIHtcbiAgcmV0dXJuIG5ldyBMYW5ndWFnZVNlcnZpY2VJbXBsKGhvc3QpO1xufVxuXG5jbGFzcyBMYW5ndWFnZVNlcnZpY2VJbXBsIGltcGxlbWVudHMgTGFuZ3VhZ2VTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBob3N0OiBMYW5ndWFnZVNlcnZpY2VIb3N0KSB7fVxuXG4gIHByaXZhdGUgZ2V0IG1ldGFkYXRhUmVzb2x2ZXIoKTogQ29tcGlsZU1ldGFkYXRhUmVzb2x2ZXIgeyByZXR1cm4gdGhpcy5ob3N0LnJlc29sdmVyOyB9XG5cbiAgZ2V0VGVtcGxhdGVSZWZlcmVuY2VzKCk6IHN0cmluZ1tdIHsgcmV0dXJuIHRoaXMuaG9zdC5nZXRUZW1wbGF0ZVJlZmVyZW5jZXMoKTsgfVxuXG4gIGdldERpYWdub3N0aWNzKGZpbGVOYW1lOiBzdHJpbmcpOiBEaWFnbm9zdGljc3x1bmRlZmluZWQge1xuICAgIGxldCByZXN1bHRzOiBEaWFnbm9zdGljcyA9IFtdO1xuICAgIGxldCB0ZW1wbGF0ZXMgPSB0aGlzLmhvc3QuZ2V0VGVtcGxhdGVzKGZpbGVOYW1lKTtcbiAgICBpZiAodGVtcGxhdGVzICYmIHRlbXBsYXRlcy5sZW5ndGgpIHtcbiAgICAgIHJlc3VsdHMucHVzaCguLi5nZXRUZW1wbGF0ZURpYWdub3N0aWNzKGZpbGVOYW1lLCB0aGlzLCB0ZW1wbGF0ZXMpKTtcbiAgICB9XG5cbiAgICBsZXQgZGVjbGFyYXRpb25zID0gdGhpcy5ob3N0LmdldERlY2xhcmF0aW9ucyhmaWxlTmFtZSk7XG4gICAgaWYgKGRlY2xhcmF0aW9ucyAmJiBkZWNsYXJhdGlvbnMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBzdW1tYXJ5ID0gdGhpcy5ob3N0LmdldEFuYWx5emVkTW9kdWxlcygpO1xuICAgICAgcmVzdWx0cy5wdXNoKC4uLmdldERlY2xhcmF0aW9uRGlhZ25vc3RpY3MoZGVjbGFyYXRpb25zLCBzdW1tYXJ5KSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuaXF1ZUJ5U3BhbihyZXN1bHRzKTtcbiAgfVxuXG4gIGdldFBpcGVzQXQoZmlsZU5hbWU6IHN0cmluZywgcG9zaXRpb246IG51bWJlcik6IENvbXBpbGVQaXBlU3VtbWFyeVtdIHtcbiAgICBsZXQgdGVtcGxhdGVJbmZvID0gdGhpcy5nZXRUZW1wbGF0ZUFzdEF0UG9zaXRpb24oZmlsZU5hbWUsIHBvc2l0aW9uKTtcbiAgICBpZiAodGVtcGxhdGVJbmZvKSB7XG4gICAgICByZXR1cm4gdGVtcGxhdGVJbmZvLnBpcGVzO1xuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH1cblxuICBnZXRDb21wbGV0aW9uc0F0KGZpbGVOYW1lOiBzdHJpbmcsIHBvc2l0aW9uOiBudW1iZXIpOiBDb21wbGV0aW9ucyB7XG4gICAgbGV0IHRlbXBsYXRlSW5mbyA9IHRoaXMuZ2V0VGVtcGxhdGVBc3RBdFBvc2l0aW9uKGZpbGVOYW1lLCBwb3NpdGlvbik7XG4gICAgaWYgKHRlbXBsYXRlSW5mbykge1xuICAgICAgcmV0dXJuIGdldFRlbXBsYXRlQ29tcGxldGlvbnModGVtcGxhdGVJbmZvKTtcbiAgICB9XG4gIH1cblxuICBnZXREZWZpbml0aW9uQXQoZmlsZU5hbWU6IHN0cmluZywgcG9zaXRpb246IG51bWJlcik6IERlZmluaXRpb24ge1xuICAgIGxldCB0ZW1wbGF0ZUluZm8gPSB0aGlzLmdldFRlbXBsYXRlQXN0QXRQb3NpdGlvbihmaWxlTmFtZSwgcG9zaXRpb24pO1xuICAgIGlmICh0ZW1wbGF0ZUluZm8pIHtcbiAgICAgIHJldHVybiBnZXREZWZpbml0aW9uKHRlbXBsYXRlSW5mbyk7XG4gICAgfVxuICB9XG5cbiAgZ2V0SG92ZXJBdChmaWxlTmFtZTogc3RyaW5nLCBwb3NpdGlvbjogbnVtYmVyKTogSG92ZXJ8dW5kZWZpbmVkIHtcbiAgICBsZXQgdGVtcGxhdGVJbmZvID0gdGhpcy5nZXRUZW1wbGF0ZUFzdEF0UG9zaXRpb24oZmlsZU5hbWUsIHBvc2l0aW9uKTtcbiAgICBpZiAodGVtcGxhdGVJbmZvKSB7XG4gICAgICByZXR1cm4gZ2V0SG92ZXIodGVtcGxhdGVJbmZvKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldFRlbXBsYXRlQXN0QXRQb3NpdGlvbihmaWxlTmFtZTogc3RyaW5nLCBwb3NpdGlvbjogbnVtYmVyKTogVGVtcGxhdGVJbmZvfHVuZGVmaW5lZCB7XG4gICAgbGV0IHRlbXBsYXRlID0gdGhpcy5ob3N0LmdldFRlbXBsYXRlQXQoZmlsZU5hbWUsIHBvc2l0aW9uKTtcbiAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgIGxldCBhc3RSZXN1bHQgPSB0aGlzLmdldFRlbXBsYXRlQXN0KHRlbXBsYXRlLCBmaWxlTmFtZSk7XG4gICAgICBpZiAoYXN0UmVzdWx0ICYmIGFzdFJlc3VsdC5odG1sQXN0ICYmIGFzdFJlc3VsdC50ZW1wbGF0ZUFzdCAmJiBhc3RSZXN1bHQuZGlyZWN0aXZlICYmXG4gICAgICAgICAgYXN0UmVzdWx0LmRpcmVjdGl2ZXMgJiYgYXN0UmVzdWx0LnBpcGVzICYmIGFzdFJlc3VsdC5leHByZXNzaW9uUGFyc2VyKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHBvc2l0aW9uLFxuICAgICAgICAgIGZpbGVOYW1lLFxuICAgICAgICAgIHRlbXBsYXRlLFxuICAgICAgICAgIGh0bWxBc3Q6IGFzdFJlc3VsdC5odG1sQXN0LFxuICAgICAgICAgIGRpcmVjdGl2ZTogYXN0UmVzdWx0LmRpcmVjdGl2ZSxcbiAgICAgICAgICBkaXJlY3RpdmVzOiBhc3RSZXN1bHQuZGlyZWN0aXZlcyxcbiAgICAgICAgICBwaXBlczogYXN0UmVzdWx0LnBpcGVzLFxuICAgICAgICAgIHRlbXBsYXRlQXN0OiBhc3RSZXN1bHQudGVtcGxhdGVBc3QsXG4gICAgICAgICAgZXhwcmVzc2lvblBhcnNlcjogYXN0UmVzdWx0LmV4cHJlc3Npb25QYXJzZXJcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGdldFRlbXBsYXRlQXN0KHRlbXBsYXRlOiBUZW1wbGF0ZVNvdXJjZSwgY29udGV4dEZpbGU6IHN0cmluZyk6IEFzdFJlc3VsdCB7XG4gICAgbGV0IHJlc3VsdDogQXN0UmVzdWx0fHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzb2x2ZWRNZXRhZGF0YSA9XG4gICAgICAgICAgdGhpcy5tZXRhZGF0YVJlc29sdmVyLmdldE5vbk5vcm1hbGl6ZWREaXJlY3RpdmVNZXRhZGF0YSh0ZW1wbGF0ZS50eXBlIGFzIGFueSk7XG4gICAgICBjb25zdCBtZXRhZGF0YSA9IHJlc29sdmVkTWV0YWRhdGEgJiYgcmVzb2x2ZWRNZXRhZGF0YS5tZXRhZGF0YTtcbiAgICAgIGlmIChtZXRhZGF0YSkge1xuICAgICAgICBjb25zdCByYXdIdG1sUGFyc2VyID0gbmV3IEh0bWxQYXJzZXIoKTtcbiAgICAgICAgY29uc3QgaHRtbFBhcnNlciA9IG5ldyBJMThOSHRtbFBhcnNlcihyYXdIdG1sUGFyc2VyKTtcbiAgICAgICAgY29uc3QgZXhwcmVzc2lvblBhcnNlciA9IG5ldyBQYXJzZXIobmV3IExleGVyKCkpO1xuICAgICAgICBjb25zdCBjb25maWcgPSBuZXcgQ29tcGlsZXJDb25maWcoKTtcbiAgICAgICAgY29uc3QgcGFyc2VyID0gbmV3IFRlbXBsYXRlUGFyc2VyKFxuICAgICAgICAgICAgY29uZmlnLCB0aGlzLmhvc3QucmVzb2x2ZXIuZ2V0UmVmbGVjdG9yKCksIGV4cHJlc3Npb25QYXJzZXIsXG4gICAgICAgICAgICBuZXcgRG9tRWxlbWVudFNjaGVtYVJlZ2lzdHJ5KCksIGh0bWxQYXJzZXIsIG51bGwgISwgW10pO1xuICAgICAgICBjb25zdCBodG1sUmVzdWx0ID0gaHRtbFBhcnNlci5wYXJzZSh0ZW1wbGF0ZS5zb3VyY2UsICcnLCB7dG9rZW5pemVFeHBhbnNpb25Gb3JtczogdHJ1ZX0pO1xuICAgICAgICBjb25zdCBhbmFseXplZE1vZHVsZXMgPSB0aGlzLmhvc3QuZ2V0QW5hbHl6ZWRNb2R1bGVzKCk7XG4gICAgICAgIGxldCBlcnJvcnM6IERpYWdub3N0aWNbXXx1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gICAgICAgIGxldCBuZ01vZHVsZSA9IGFuYWx5emVkTW9kdWxlcy5uZ01vZHVsZUJ5UGlwZU9yRGlyZWN0aXZlLmdldCh0ZW1wbGF0ZS50eXBlKTtcbiAgICAgICAgaWYgKCFuZ01vZHVsZSkge1xuICAgICAgICAgIC8vIFJlcG9ydGVkIGJ5IHRoZSB0aGUgZGVjbGFyYXRpb24gZGlhZ25vc3RpY3MuXG4gICAgICAgICAgbmdNb2R1bGUgPSBmaW5kU3VpdGFibGVEZWZhdWx0TW9kdWxlKGFuYWx5emVkTW9kdWxlcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5nTW9kdWxlKSB7XG4gICAgICAgICAgY29uc3QgcmVzb2x2ZWREaXJlY3RpdmVzID0gbmdNb2R1bGUudHJhbnNpdGl2ZU1vZHVsZS5kaXJlY3RpdmVzLm1hcChcbiAgICAgICAgICAgICAgZCA9PiB0aGlzLmhvc3QucmVzb2x2ZXIuZ2V0Tm9uTm9ybWFsaXplZERpcmVjdGl2ZU1ldGFkYXRhKGQucmVmZXJlbmNlKSk7XG4gICAgICAgICAgY29uc3QgZGlyZWN0aXZlcyA9IHJlbW92ZU1pc3NpbmcocmVzb2x2ZWREaXJlY3RpdmVzKS5tYXAoZCA9PiBkLm1ldGFkYXRhLnRvU3VtbWFyeSgpKTtcbiAgICAgICAgICBjb25zdCBwaXBlcyA9IG5nTW9kdWxlLnRyYW5zaXRpdmVNb2R1bGUucGlwZXMubWFwKFxuICAgICAgICAgICAgICBwID0+IHRoaXMuaG9zdC5yZXNvbHZlci5nZXRPckxvYWRQaXBlTWV0YWRhdGEocC5yZWZlcmVuY2UpLnRvU3VtbWFyeSgpKTtcbiAgICAgICAgICBjb25zdCBzY2hlbWFzID0gbmdNb2R1bGUuc2NoZW1hcztcbiAgICAgICAgICBjb25zdCBwYXJzZVJlc3VsdCA9IHBhcnNlci50cnlQYXJzZUh0bWwoaHRtbFJlc3VsdCwgbWV0YWRhdGEsIGRpcmVjdGl2ZXMsIHBpcGVzLCBzY2hlbWFzKTtcbiAgICAgICAgICByZXN1bHQgPSB7XG4gICAgICAgICAgICBodG1sQXN0OiBodG1sUmVzdWx0LnJvb3ROb2RlcyxcbiAgICAgICAgICAgIHRlbXBsYXRlQXN0OiBwYXJzZVJlc3VsdC50ZW1wbGF0ZUFzdCxcbiAgICAgICAgICAgIGRpcmVjdGl2ZTogbWV0YWRhdGEsIGRpcmVjdGl2ZXMsIHBpcGVzLFxuICAgICAgICAgICAgcGFyc2VFcnJvcnM6IHBhcnNlUmVzdWx0LmVycm9ycywgZXhwcmVzc2lvblBhcnNlciwgZXJyb3JzXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGxldCBzcGFuID0gdGVtcGxhdGUuc3BhbjtcbiAgICAgIGlmIChlLmZpbGVOYW1lID09IGNvbnRleHRGaWxlKSB7XG4gICAgICAgIHNwYW4gPSB0ZW1wbGF0ZS5xdWVyeS5nZXRTcGFuQXQoZS5saW5lLCBlLmNvbHVtbikgfHwgc3BhbjtcbiAgICAgIH1cbiAgICAgIHJlc3VsdCA9IHtlcnJvcnM6IFt7a2luZDogRGlhZ25vc3RpY0tpbmQuRXJyb3IsIG1lc3NhZ2U6IGUubWVzc2FnZSwgc3Bhbn1dfTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdCB8fCB7fTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZW1vdmVNaXNzaW5nPFQ+KHZhbHVlczogKFQgfCBudWxsIHwgdW5kZWZpbmVkKVtdKTogVFtdIHtcbiAgcmV0dXJuIHZhbHVlcy5maWx0ZXIoZSA9PiAhIWUpIGFzIFRbXTtcbn1cblxuZnVuY3Rpb24gdW5pcXVlQnlTcGFuIDwgVCBleHRlbmRzIHtcbiAgc3BhbjogU3Bhbjtcbn1cbj4gKGVsZW1lbnRzOiBUW10gfCB1bmRlZmluZWQpOiBUW118dW5kZWZpbmVkIHtcbiAgaWYgKGVsZW1lbnRzKSB7XG4gICAgY29uc3QgcmVzdWx0OiBUW10gPSBbXTtcbiAgICBjb25zdCBtYXAgPSBuZXcgTWFwPG51bWJlciwgU2V0PG51bWJlcj4+KCk7XG4gICAgZm9yIChjb25zdCBlbGVtZW50IG9mIGVsZW1lbnRzKSB7XG4gICAgICBsZXQgc3BhbiA9IGVsZW1lbnQuc3BhbjtcbiAgICAgIGxldCBzZXQgPSBtYXAuZ2V0KHNwYW4uc3RhcnQpO1xuICAgICAgaWYgKCFzZXQpIHtcbiAgICAgICAgc2V0ID0gbmV3IFNldCgpO1xuICAgICAgICBtYXAuc2V0KHNwYW4uc3RhcnQsIHNldCk7XG4gICAgICB9XG4gICAgICBpZiAoIXNldC5oYXMoc3Bhbi5lbmQpKSB7XG4gICAgICAgIHNldC5hZGQoc3Bhbi5lbmQpO1xuICAgICAgICByZXN1bHQucHVzaChlbGVtZW50KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG5mdW5jdGlvbiBmaW5kU3VpdGFibGVEZWZhdWx0TW9kdWxlKG1vZHVsZXM6IE5nQW5hbHl6ZWRNb2R1bGVzKTogQ29tcGlsZU5nTW9kdWxlTWV0YWRhdGF8dW5kZWZpbmVkIHtcbiAgbGV0IHJlc3VsdDogQ29tcGlsZU5nTW9kdWxlTWV0YWRhdGF8dW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICBsZXQgcmVzdWx0U2l6ZSA9IDA7XG4gIGZvciAoY29uc3QgbW9kdWxlIG9mIG1vZHVsZXMubmdNb2R1bGVzKSB7XG4gICAgY29uc3QgbW9kdWxlU2l6ZSA9IG1vZHVsZS50cmFuc2l0aXZlTW9kdWxlLmRpcmVjdGl2ZXMubGVuZ3RoO1xuICAgIGlmIChtb2R1bGVTaXplID4gcmVzdWx0U2l6ZSkge1xuICAgICAgcmVzdWx0ID0gbW9kdWxlO1xuICAgICAgcmVzdWx0U2l6ZSA9IG1vZHVsZVNpemU7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG4iXX0=