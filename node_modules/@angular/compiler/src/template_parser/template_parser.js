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
        define("@angular/compiler/src/template_parser/template_parser", ["require", "exports", "tslib", "@angular/compiler/src/compile_metadata", "@angular/compiler/src/expression_parser/ast", "@angular/compiler/src/identifiers", "@angular/compiler/src/ml_parser/ast", "@angular/compiler/src/ml_parser/html_parser", "@angular/compiler/src/ml_parser/html_whitespaces", "@angular/compiler/src/ml_parser/icu_ast_expander", "@angular/compiler/src/ml_parser/interpolation_config", "@angular/compiler/src/ml_parser/tags", "@angular/compiler/src/parse_util", "@angular/compiler/src/provider_analyzer", "@angular/compiler/src/selector", "@angular/compiler/src/style_url_resolver", "@angular/compiler/src/util", "@angular/compiler/src/template_parser/binding_parser", "@angular/compiler/src/template_parser/template_ast", "@angular/compiler/src/template_parser/template_preparser"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var compile_metadata_1 = require("@angular/compiler/src/compile_metadata");
    var ast_1 = require("@angular/compiler/src/expression_parser/ast");
    var identifiers_1 = require("@angular/compiler/src/identifiers");
    var html = require("@angular/compiler/src/ml_parser/ast");
    var html_parser_1 = require("@angular/compiler/src/ml_parser/html_parser");
    var html_whitespaces_1 = require("@angular/compiler/src/ml_parser/html_whitespaces");
    var icu_ast_expander_1 = require("@angular/compiler/src/ml_parser/icu_ast_expander");
    var interpolation_config_1 = require("@angular/compiler/src/ml_parser/interpolation_config");
    var tags_1 = require("@angular/compiler/src/ml_parser/tags");
    var parse_util_1 = require("@angular/compiler/src/parse_util");
    var provider_analyzer_1 = require("@angular/compiler/src/provider_analyzer");
    var selector_1 = require("@angular/compiler/src/selector");
    var style_url_resolver_1 = require("@angular/compiler/src/style_url_resolver");
    var util_1 = require("@angular/compiler/src/util");
    var binding_parser_1 = require("@angular/compiler/src/template_parser/binding_parser");
    var t = require("@angular/compiler/src/template_parser/template_ast");
    var template_preparser_1 = require("@angular/compiler/src/template_parser/template_preparser");
    var BIND_NAME_REGEXP = /^(?:(?:(?:(bind-)|(let-)|(ref-|#)|(on-)|(bindon-)|(@))(.+))|\[\(([^\)]+)\)\]|\[([^\]]+)\]|\(([^\)]+)\))$/;
    // Group 1 = "bind-"
    var KW_BIND_IDX = 1;
    // Group 2 = "let-"
    var KW_LET_IDX = 2;
    // Group 3 = "ref-/#"
    var KW_REF_IDX = 3;
    // Group 4 = "on-"
    var KW_ON_IDX = 4;
    // Group 5 = "bindon-"
    var KW_BINDON_IDX = 5;
    // Group 6 = "@"
    var KW_AT_IDX = 6;
    // Group 7 = the identifier after "bind-", "let-", "ref-/#", "on-", "bindon-" or "@"
    var IDENT_KW_IDX = 7;
    // Group 8 = identifier inside [()]
    var IDENT_BANANA_BOX_IDX = 8;
    // Group 9 = identifier inside []
    var IDENT_PROPERTY_IDX = 9;
    // Group 10 = identifier inside ()
    var IDENT_EVENT_IDX = 10;
    var TEMPLATE_ATTR_PREFIX = '*';
    var CLASS_ATTR = 'class';
    var _TEXT_CSS_SELECTOR;
    function TEXT_CSS_SELECTOR() {
        if (!_TEXT_CSS_SELECTOR) {
            _TEXT_CSS_SELECTOR = selector_1.CssSelector.parse('*')[0];
        }
        return _TEXT_CSS_SELECTOR;
    }
    var TemplateParseError = /** @class */ (function (_super) {
        tslib_1.__extends(TemplateParseError, _super);
        function TemplateParseError(message, span, level) {
            return _super.call(this, span, message, level) || this;
        }
        return TemplateParseError;
    }(parse_util_1.ParseError));
    exports.TemplateParseError = TemplateParseError;
    var TemplateParseResult = /** @class */ (function () {
        function TemplateParseResult(templateAst, usedPipes, errors) {
            this.templateAst = templateAst;
            this.usedPipes = usedPipes;
            this.errors = errors;
        }
        return TemplateParseResult;
    }());
    exports.TemplateParseResult = TemplateParseResult;
    var TemplateParser = /** @class */ (function () {
        function TemplateParser(_config, _reflector, _exprParser, _schemaRegistry, _htmlParser, _console, transforms) {
            this._config = _config;
            this._reflector = _reflector;
            this._exprParser = _exprParser;
            this._schemaRegistry = _schemaRegistry;
            this._htmlParser = _htmlParser;
            this._console = _console;
            this.transforms = transforms;
        }
        Object.defineProperty(TemplateParser.prototype, "expressionParser", {
            get: function () { return this._exprParser; },
            enumerable: true,
            configurable: true
        });
        TemplateParser.prototype.parse = function (component, template, directives, pipes, schemas, templateUrl, preserveWhitespaces) {
            var result = this.tryParse(component, template, directives, pipes, schemas, templateUrl, preserveWhitespaces);
            var warnings = result.errors.filter(function (error) { return error.level === parse_util_1.ParseErrorLevel.WARNING; });
            var errors = result.errors.filter(function (error) { return error.level === parse_util_1.ParseErrorLevel.ERROR; });
            if (warnings.length > 0) {
                this._console.warn("Template parse warnings:\n" + warnings.join('\n'));
            }
            if (errors.length > 0) {
                var errorString = errors.join('\n');
                throw util_1.syntaxError("Template parse errors:\n" + errorString, errors);
            }
            return { template: result.templateAst, pipes: result.usedPipes };
        };
        TemplateParser.prototype.tryParse = function (component, template, directives, pipes, schemas, templateUrl, preserveWhitespaces) {
            var htmlParseResult = typeof template === 'string' ?
                this._htmlParser.parse(template, templateUrl, {
                    tokenizeExpansionForms: true,
                    interpolationConfig: this.getInterpolationConfig(component)
                }) :
                template;
            if (!preserveWhitespaces) {
                htmlParseResult = html_whitespaces_1.removeWhitespaces(htmlParseResult);
            }
            return this.tryParseHtml(this.expandHtml(htmlParseResult), component, directives, pipes, schemas);
        };
        TemplateParser.prototype.tryParseHtml = function (htmlAstWithErrors, component, directives, pipes, schemas) {
            var result;
            var errors = htmlAstWithErrors.errors;
            var usedPipes = [];
            if (htmlAstWithErrors.rootNodes.length > 0) {
                var uniqDirectives = removeSummaryDuplicates(directives);
                var uniqPipes = removeSummaryDuplicates(pipes);
                var providerViewContext = new provider_analyzer_1.ProviderViewContext(this._reflector, component);
                var interpolationConfig = undefined;
                if (component.template && component.template.interpolation) {
                    interpolationConfig = {
                        start: component.template.interpolation[0],
                        end: component.template.interpolation[1]
                    };
                }
                var bindingParser = new binding_parser_1.BindingParser(this._exprParser, interpolationConfig, this._schemaRegistry, uniqPipes, errors);
                var parseVisitor = new TemplateParseVisitor(this._reflector, this._config, providerViewContext, uniqDirectives, bindingParser, this._schemaRegistry, schemas, errors);
                result = html.visitAll(parseVisitor, htmlAstWithErrors.rootNodes, EMPTY_ELEMENT_CONTEXT);
                errors.push.apply(errors, tslib_1.__spread(providerViewContext.errors));
                usedPipes.push.apply(usedPipes, tslib_1.__spread(bindingParser.getUsedPipes()));
            }
            else {
                result = [];
            }
            this._assertNoReferenceDuplicationOnTemplate(result, errors);
            if (errors.length > 0) {
                return new TemplateParseResult(result, usedPipes, errors);
            }
            if (this.transforms) {
                this.transforms.forEach(function (transform) { result = t.templateVisitAll(transform, result); });
            }
            return new TemplateParseResult(result, usedPipes, errors);
        };
        TemplateParser.prototype.expandHtml = function (htmlAstWithErrors, forced) {
            if (forced === void 0) { forced = false; }
            var errors = htmlAstWithErrors.errors;
            if (errors.length == 0 || forced) {
                // Transform ICU messages to angular directives
                var expandedHtmlAst = icu_ast_expander_1.expandNodes(htmlAstWithErrors.rootNodes);
                errors.push.apply(errors, tslib_1.__spread(expandedHtmlAst.errors));
                htmlAstWithErrors = new html_parser_1.ParseTreeResult(expandedHtmlAst.nodes, errors);
            }
            return htmlAstWithErrors;
        };
        TemplateParser.prototype.getInterpolationConfig = function (component) {
            if (component.template) {
                return interpolation_config_1.InterpolationConfig.fromArray(component.template.interpolation);
            }
            return undefined;
        };
        /** @internal */
        TemplateParser.prototype._assertNoReferenceDuplicationOnTemplate = function (result, errors) {
            var existingReferences = [];
            result.filter(function (element) { return !!element.references; })
                .forEach(function (element) { return element.references.forEach(function (reference) {
                var name = reference.name;
                if (existingReferences.indexOf(name) < 0) {
                    existingReferences.push(name);
                }
                else {
                    var error = new TemplateParseError("Reference \"#" + name + "\" is defined several times", reference.sourceSpan, parse_util_1.ParseErrorLevel.ERROR);
                    errors.push(error);
                }
            }); });
        };
        return TemplateParser;
    }());
    exports.TemplateParser = TemplateParser;
    var TemplateParseVisitor = /** @class */ (function () {
        function TemplateParseVisitor(reflector, config, providerViewContext, directives, _bindingParser, _schemaRegistry, _schemas, _targetErrors) {
            var _this = this;
            this.reflector = reflector;
            this.config = config;
            this.providerViewContext = providerViewContext;
            this._bindingParser = _bindingParser;
            this._schemaRegistry = _schemaRegistry;
            this._schemas = _schemas;
            this._targetErrors = _targetErrors;
            this.selectorMatcher = new selector_1.SelectorMatcher();
            this.directivesIndex = new Map();
            this.ngContentCount = 0;
            // Note: queries start with id 1 so we can use the number in a Bloom filter!
            this.contentQueryStartId = providerViewContext.component.viewQueries.length + 1;
            directives.forEach(function (directive, index) {
                var selector = selector_1.CssSelector.parse(directive.selector);
                _this.selectorMatcher.addSelectables(selector, directive);
                _this.directivesIndex.set(directive, index);
            });
        }
        TemplateParseVisitor.prototype.visitExpansion = function (expansion, context) { return null; };
        TemplateParseVisitor.prototype.visitExpansionCase = function (expansionCase, context) { return null; };
        TemplateParseVisitor.prototype.visitText = function (text, parent) {
            var ngContentIndex = parent.findNgContentIndex(TEXT_CSS_SELECTOR());
            var valueNoNgsp = html_whitespaces_1.replaceNgsp(text.value);
            var expr = this._bindingParser.parseInterpolation(valueNoNgsp, text.sourceSpan);
            return expr ? new t.BoundTextAst(expr, ngContentIndex, text.sourceSpan) :
                new t.TextAst(valueNoNgsp, ngContentIndex, text.sourceSpan);
        };
        TemplateParseVisitor.prototype.visitAttribute = function (attribute, context) {
            return new t.AttrAst(attribute.name, attribute.value, attribute.sourceSpan);
        };
        TemplateParseVisitor.prototype.visitComment = function (comment, context) { return null; };
        TemplateParseVisitor.prototype.visitElement = function (element, parent) {
            var _this = this;
            var queryStartIndex = this.contentQueryStartId;
            var elName = element.name;
            var preparsedElement = template_preparser_1.preparseElement(element);
            if (preparsedElement.type === template_preparser_1.PreparsedElementType.SCRIPT ||
                preparsedElement.type === template_preparser_1.PreparsedElementType.STYLE) {
                // Skipping <script> for security reasons
                // Skipping <style> as we already processed them
                // in the StyleCompiler
                return null;
            }
            if (preparsedElement.type === template_preparser_1.PreparsedElementType.STYLESHEET &&
                style_url_resolver_1.isStyleUrlResolvable(preparsedElement.hrefAttr)) {
                // Skipping stylesheets with either relative urls or package scheme as we already processed
                // them in the StyleCompiler
                return null;
            }
            var matchableAttrs = [];
            var elementOrDirectiveProps = [];
            var elementOrDirectiveRefs = [];
            var elementVars = [];
            var events = [];
            var templateElementOrDirectiveProps = [];
            var templateMatchableAttrs = [];
            var templateElementVars = [];
            var hasInlineTemplates = false;
            var attrs = [];
            var isTemplateElement = tags_1.isNgTemplate(element.name);
            element.attrs.forEach(function (attr) {
                var parsedVariables = [];
                var hasBinding = _this._parseAttr(isTemplateElement, attr, matchableAttrs, elementOrDirectiveProps, events, elementOrDirectiveRefs, elementVars);
                elementVars.push.apply(elementVars, tslib_1.__spread(parsedVariables.map(function (v) { return t.VariableAst.fromParsedVariable(v); })));
                var templateValue;
                var templateKey;
                var normalizedName = _this._normalizeAttributeName(attr.name);
                if (normalizedName.startsWith(TEMPLATE_ATTR_PREFIX)) {
                    templateValue = attr.value;
                    templateKey = normalizedName.substring(TEMPLATE_ATTR_PREFIX.length);
                }
                var hasTemplateBinding = templateValue != null;
                if (hasTemplateBinding) {
                    if (hasInlineTemplates) {
                        _this._reportError("Can't have multiple template bindings on one element. Use only one attribute prefixed with *", attr.sourceSpan);
                    }
                    hasInlineTemplates = true;
                    var parsedVariables_1 = [];
                    _this._bindingParser.parseInlineTemplateBinding(templateKey, templateValue, attr.sourceSpan, templateMatchableAttrs, templateElementOrDirectiveProps, parsedVariables_1);
                    templateElementVars.push.apply(templateElementVars, tslib_1.__spread(parsedVariables_1.map(function (v) { return t.VariableAst.fromParsedVariable(v); })));
                }
                if (!hasBinding && !hasTemplateBinding) {
                    // don't include the bindings as attributes as well in the AST
                    attrs.push(_this.visitAttribute(attr, null));
                    matchableAttrs.push([attr.name, attr.value]);
                }
            });
            var elementCssSelector = createElementCssSelector(elName, matchableAttrs);
            var _a = this._parseDirectives(this.selectorMatcher, elementCssSelector), directiveMetas = _a.directives, matchElement = _a.matchElement;
            var references = [];
            var boundDirectivePropNames = new Set();
            var directiveAsts = this._createDirectiveAsts(isTemplateElement, element.name, directiveMetas, elementOrDirectiveProps, elementOrDirectiveRefs, element.sourceSpan, references, boundDirectivePropNames);
            var elementProps = this._createElementPropertyAsts(element.name, elementOrDirectiveProps, boundDirectivePropNames);
            var isViewRoot = parent.isTemplateElement || hasInlineTemplates;
            var providerContext = new provider_analyzer_1.ProviderElementContext(this.providerViewContext, parent.providerContext, isViewRoot, directiveAsts, attrs, references, isTemplateElement, queryStartIndex, element.sourceSpan);
            var children = html.visitAll(preparsedElement.nonBindable ? NON_BINDABLE_VISITOR : this, element.children, ElementContext.create(isTemplateElement, directiveAsts, isTemplateElement ? parent.providerContext : providerContext));
            providerContext.afterElement();
            // Override the actual selector when the `ngProjectAs` attribute is provided
            var projectionSelector = preparsedElement.projectAs != '' ?
                selector_1.CssSelector.parse(preparsedElement.projectAs)[0] :
                elementCssSelector;
            var ngContentIndex = parent.findNgContentIndex(projectionSelector);
            var parsedElement;
            if (preparsedElement.type === template_preparser_1.PreparsedElementType.NG_CONTENT) {
                // `<ng-content>` element
                if (element.children && !element.children.every(_isEmptyTextNode)) {
                    this._reportError("<ng-content> element cannot have content.", element.sourceSpan);
                }
                parsedElement = new t.NgContentAst(this.ngContentCount++, hasInlineTemplates ? null : ngContentIndex, element.sourceSpan);
            }
            else if (isTemplateElement) {
                // `<ng-template>` element
                this._assertAllEventsPublishedByDirectives(directiveAsts, events);
                this._assertNoComponentsNorElementBindingsOnTemplate(directiveAsts, elementProps, element.sourceSpan);
                parsedElement = new t.EmbeddedTemplateAst(attrs, events, references, elementVars, providerContext.transformedDirectiveAsts, providerContext.transformProviders, providerContext.transformedHasViewContainer, providerContext.queryMatches, children, hasInlineTemplates ? null : ngContentIndex, element.sourceSpan);
            }
            else {
                // element other than `<ng-content>` and `<ng-template>`
                this._assertElementExists(matchElement, element);
                this._assertOnlyOneComponent(directiveAsts, element.sourceSpan);
                var ngContentIndex_1 = hasInlineTemplates ? null : parent.findNgContentIndex(projectionSelector);
                parsedElement = new t.ElementAst(elName, attrs, elementProps, events, references, providerContext.transformedDirectiveAsts, providerContext.transformProviders, providerContext.transformedHasViewContainer, providerContext.queryMatches, children, hasInlineTemplates ? null : ngContentIndex_1, element.sourceSpan, element.endSourceSpan || null);
            }
            if (hasInlineTemplates) {
                // The element as a *-attribute
                var templateQueryStartIndex = this.contentQueryStartId;
                var templateSelector = createElementCssSelector('ng-template', templateMatchableAttrs);
                var directives = this._parseDirectives(this.selectorMatcher, templateSelector).directives;
                var templateBoundDirectivePropNames = new Set();
                var templateDirectiveAsts = this._createDirectiveAsts(true, elName, directives, templateElementOrDirectiveProps, [], element.sourceSpan, [], templateBoundDirectivePropNames);
                var templateElementProps = this._createElementPropertyAsts(elName, templateElementOrDirectiveProps, templateBoundDirectivePropNames);
                this._assertNoComponentsNorElementBindingsOnTemplate(templateDirectiveAsts, templateElementProps, element.sourceSpan);
                var templateProviderContext = new provider_analyzer_1.ProviderElementContext(this.providerViewContext, parent.providerContext, parent.isTemplateElement, templateDirectiveAsts, [], [], true, templateQueryStartIndex, element.sourceSpan);
                templateProviderContext.afterElement();
                parsedElement = new t.EmbeddedTemplateAst([], [], [], templateElementVars, templateProviderContext.transformedDirectiveAsts, templateProviderContext.transformProviders, templateProviderContext.transformedHasViewContainer, templateProviderContext.queryMatches, [parsedElement], ngContentIndex, element.sourceSpan);
            }
            return parsedElement;
        };
        TemplateParseVisitor.prototype._parseAttr = function (isTemplateElement, attr, targetMatchableAttrs, targetProps, targetEvents, targetRefs, targetVars) {
            var name = this._normalizeAttributeName(attr.name);
            var value = attr.value;
            var srcSpan = attr.sourceSpan;
            var boundEvents = [];
            var bindParts = name.match(BIND_NAME_REGEXP);
            var hasBinding = false;
            if (bindParts !== null) {
                hasBinding = true;
                if (bindParts[KW_BIND_IDX] != null) {
                    this._bindingParser.parsePropertyBinding(bindParts[IDENT_KW_IDX], value, false, srcSpan, targetMatchableAttrs, targetProps);
                }
                else if (bindParts[KW_LET_IDX]) {
                    if (isTemplateElement) {
                        var identifier = bindParts[IDENT_KW_IDX];
                        this._parseVariable(identifier, value, srcSpan, targetVars);
                    }
                    else {
                        this._reportError("\"let-\" is only supported on ng-template elements.", srcSpan);
                    }
                }
                else if (bindParts[KW_REF_IDX]) {
                    var identifier = bindParts[IDENT_KW_IDX];
                    this._parseReference(identifier, value, srcSpan, targetRefs);
                }
                else if (bindParts[KW_ON_IDX]) {
                    this._bindingParser.parseEvent(bindParts[IDENT_KW_IDX], value, srcSpan, attr.valueSpan || srcSpan, targetMatchableAttrs, boundEvents);
                }
                else if (bindParts[KW_BINDON_IDX]) {
                    this._bindingParser.parsePropertyBinding(bindParts[IDENT_KW_IDX], value, false, srcSpan, targetMatchableAttrs, targetProps);
                    this._parseAssignmentEvent(bindParts[IDENT_KW_IDX], value, srcSpan, attr.valueSpan || srcSpan, targetMatchableAttrs, boundEvents);
                }
                else if (bindParts[KW_AT_IDX]) {
                    this._bindingParser.parseLiteralAttr(name, value, srcSpan, targetMatchableAttrs, targetProps);
                }
                else if (bindParts[IDENT_BANANA_BOX_IDX]) {
                    this._bindingParser.parsePropertyBinding(bindParts[IDENT_BANANA_BOX_IDX], value, false, srcSpan, targetMatchableAttrs, targetProps);
                    this._parseAssignmentEvent(bindParts[IDENT_BANANA_BOX_IDX], value, srcSpan, attr.valueSpan || srcSpan, targetMatchableAttrs, boundEvents);
                }
                else if (bindParts[IDENT_PROPERTY_IDX]) {
                    this._bindingParser.parsePropertyBinding(bindParts[IDENT_PROPERTY_IDX], value, false, srcSpan, targetMatchableAttrs, targetProps);
                }
                else if (bindParts[IDENT_EVENT_IDX]) {
                    this._bindingParser.parseEvent(bindParts[IDENT_EVENT_IDX], value, srcSpan, attr.valueSpan || srcSpan, targetMatchableAttrs, boundEvents);
                }
            }
            else {
                hasBinding = this._bindingParser.parsePropertyInterpolation(name, value, srcSpan, targetMatchableAttrs, targetProps);
            }
            if (!hasBinding) {
                this._bindingParser.parseLiteralAttr(name, value, srcSpan, targetMatchableAttrs, targetProps);
            }
            targetEvents.push.apply(targetEvents, tslib_1.__spread(boundEvents.map(function (e) { return t.BoundEventAst.fromParsedEvent(e); })));
            return hasBinding;
        };
        TemplateParseVisitor.prototype._normalizeAttributeName = function (attrName) {
            return /^data-/i.test(attrName) ? attrName.substring(5) : attrName;
        };
        TemplateParseVisitor.prototype._parseVariable = function (identifier, value, sourceSpan, targetVars) {
            if (identifier.indexOf('-') > -1) {
                this._reportError("\"-\" is not allowed in variable names", sourceSpan);
            }
            targetVars.push(new t.VariableAst(identifier, value, sourceSpan));
        };
        TemplateParseVisitor.prototype._parseReference = function (identifier, value, sourceSpan, targetRefs) {
            if (identifier.indexOf('-') > -1) {
                this._reportError("\"-\" is not allowed in reference names", sourceSpan);
            }
            targetRefs.push(new ElementOrDirectiveRef(identifier, value, sourceSpan));
        };
        TemplateParseVisitor.prototype._parseAssignmentEvent = function (name, expression, sourceSpan, valueSpan, targetMatchableAttrs, targetEvents) {
            this._bindingParser.parseEvent(name + "Change", expression + "=$event", sourceSpan, valueSpan, targetMatchableAttrs, targetEvents);
        };
        TemplateParseVisitor.prototype._parseDirectives = function (selectorMatcher, elementCssSelector) {
            var _this = this;
            // Need to sort the directives so that we get consistent results throughout,
            // as selectorMatcher uses Maps inside.
            // Also deduplicate directives as they might match more than one time!
            var directives = new Array(this.directivesIndex.size);
            // Whether any directive selector matches on the element name
            var matchElement = false;
            selectorMatcher.match(elementCssSelector, function (selector, directive) {
                directives[_this.directivesIndex.get(directive)] = directive;
                matchElement = matchElement || selector.hasElementSelector();
            });
            return {
                directives: directives.filter(function (dir) { return !!dir; }),
                matchElement: matchElement,
            };
        };
        TemplateParseVisitor.prototype._createDirectiveAsts = function (isTemplateElement, elementName, directives, props, elementOrDirectiveRefs, elementSourceSpan, targetReferences, targetBoundDirectivePropNames) {
            var _this = this;
            var matchedReferences = new Set();
            var component = null;
            var directiveAsts = directives.map(function (directive) {
                var sourceSpan = new parse_util_1.ParseSourceSpan(elementSourceSpan.start, elementSourceSpan.end, "Directive " + compile_metadata_1.identifierName(directive.type));
                if (directive.isComponent) {
                    component = directive;
                }
                var directiveProperties = [];
                var boundProperties = _this._bindingParser.createDirectiveHostPropertyAsts(directive, elementName, sourceSpan);
                var hostProperties = boundProperties.map(function (prop) { return t.BoundElementPropertyAst.fromBoundProperty(prop); });
                // Note: We need to check the host properties here as well,
                // as we don't know the element name in the DirectiveWrapperCompiler yet.
                hostProperties = _this._checkPropertiesInSchema(elementName, hostProperties);
                var parsedEvents = _this._bindingParser.createDirectiveHostEventAsts(directive, sourceSpan);
                _this._createDirectivePropertyAsts(directive.inputs, props, directiveProperties, targetBoundDirectivePropNames);
                elementOrDirectiveRefs.forEach(function (elOrDirRef) {
                    if ((elOrDirRef.value.length === 0 && directive.isComponent) ||
                        (elOrDirRef.isReferenceToDirective(directive))) {
                        targetReferences.push(new t.ReferenceAst(elOrDirRef.name, identifiers_1.createTokenForReference(directive.type.reference), elOrDirRef.value, elOrDirRef.sourceSpan));
                        matchedReferences.add(elOrDirRef.name);
                    }
                });
                var hostEvents = parsedEvents.map(function (e) { return t.BoundEventAst.fromParsedEvent(e); });
                var contentQueryStartId = _this.contentQueryStartId;
                _this.contentQueryStartId += directive.queries.length;
                return new t.DirectiveAst(directive, directiveProperties, hostProperties, hostEvents, contentQueryStartId, sourceSpan);
            });
            elementOrDirectiveRefs.forEach(function (elOrDirRef) {
                if (elOrDirRef.value.length > 0) {
                    if (!matchedReferences.has(elOrDirRef.name)) {
                        _this._reportError("There is no directive with \"exportAs\" set to \"" + elOrDirRef.value + "\"", elOrDirRef.sourceSpan);
                    }
                }
                else if (!component) {
                    var refToken = null;
                    if (isTemplateElement) {
                        refToken = identifiers_1.createTokenForExternalReference(_this.reflector, identifiers_1.Identifiers.TemplateRef);
                    }
                    targetReferences.push(new t.ReferenceAst(elOrDirRef.name, refToken, elOrDirRef.value, elOrDirRef.sourceSpan));
                }
            });
            return directiveAsts;
        };
        TemplateParseVisitor.prototype._createDirectivePropertyAsts = function (directiveProperties, boundProps, targetBoundDirectiveProps, targetBoundDirectivePropNames) {
            if (directiveProperties) {
                var boundPropsByName_1 = new Map();
                boundProps.forEach(function (boundProp) {
                    var prevValue = boundPropsByName_1.get(boundProp.name);
                    if (!prevValue || prevValue.isLiteral) {
                        // give [a]="b" a higher precedence than a="b" on the same element
                        boundPropsByName_1.set(boundProp.name, boundProp);
                    }
                });
                Object.keys(directiveProperties).forEach(function (dirProp) {
                    var elProp = directiveProperties[dirProp];
                    var boundProp = boundPropsByName_1.get(elProp);
                    // Bindings are optional, so this binding only needs to be set up if an expression is given.
                    if (boundProp) {
                        targetBoundDirectivePropNames.add(boundProp.name);
                        if (!isEmptyExpression(boundProp.expression)) {
                            targetBoundDirectiveProps.push(new t.BoundDirectivePropertyAst(dirProp, boundProp.name, boundProp.expression, boundProp.sourceSpan));
                        }
                    }
                });
            }
        };
        TemplateParseVisitor.prototype._createElementPropertyAsts = function (elementName, props, boundDirectivePropNames) {
            var _this = this;
            var boundElementProps = [];
            props.forEach(function (prop) {
                if (!prop.isLiteral && !boundDirectivePropNames.has(prop.name)) {
                    var boundProp = _this._bindingParser.createBoundElementProperty(elementName, prop);
                    boundElementProps.push(t.BoundElementPropertyAst.fromBoundProperty(boundProp));
                }
            });
            return this._checkPropertiesInSchema(elementName, boundElementProps);
        };
        TemplateParseVisitor.prototype._findComponentDirectives = function (directives) {
            return directives.filter(function (directive) { return directive.directive.isComponent; });
        };
        TemplateParseVisitor.prototype._findComponentDirectiveNames = function (directives) {
            return this._findComponentDirectives(directives)
                .map(function (directive) { return compile_metadata_1.identifierName(directive.directive.type); });
        };
        TemplateParseVisitor.prototype._assertOnlyOneComponent = function (directives, sourceSpan) {
            var componentTypeNames = this._findComponentDirectiveNames(directives);
            if (componentTypeNames.length > 1) {
                this._reportError("More than one component matched on this element.\n" +
                    "Make sure that only one component's selector can match a given element.\n" +
                    ("Conflicting components: " + componentTypeNames.join(',')), sourceSpan);
            }
        };
        /**
         * Make sure that non-angular tags conform to the schemas.
         *
         * Note: An element is considered an angular tag when at least one directive selector matches the
         * tag name.
         *
         * @param matchElement Whether any directive has matched on the tag name
         * @param element the html element
         */
        TemplateParseVisitor.prototype._assertElementExists = function (matchElement, element) {
            var elName = element.name.replace(/^:xhtml:/, '');
            if (!matchElement && !this._schemaRegistry.hasElement(elName, this._schemas)) {
                var errorMsg = "'" + elName + "' is not a known element:\n";
                errorMsg +=
                    "1. If '" + elName + "' is an Angular component, then verify that it is part of this module.\n";
                if (elName.indexOf('-') > -1) {
                    errorMsg +=
                        "2. If '" + elName + "' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the '@NgModule.schemas' of this component to suppress this message.";
                }
                else {
                    errorMsg +=
                        "2. To allow any element add 'NO_ERRORS_SCHEMA' to the '@NgModule.schemas' of this component.";
                }
                this._reportError(errorMsg, element.sourceSpan);
            }
        };
        TemplateParseVisitor.prototype._assertNoComponentsNorElementBindingsOnTemplate = function (directives, elementProps, sourceSpan) {
            var _this = this;
            var componentTypeNames = this._findComponentDirectiveNames(directives);
            if (componentTypeNames.length > 0) {
                this._reportError("Components on an embedded template: " + componentTypeNames.join(','), sourceSpan);
            }
            elementProps.forEach(function (prop) {
                _this._reportError("Property binding " + prop.name + " not used by any directive on an embedded template. Make sure that the property name is spelled correctly and all directives are listed in the \"@NgModule.declarations\".", sourceSpan);
            });
        };
        TemplateParseVisitor.prototype._assertAllEventsPublishedByDirectives = function (directives, events) {
            var _this = this;
            var allDirectiveEvents = new Set();
            directives.forEach(function (directive) {
                Object.keys(directive.directive.outputs).forEach(function (k) {
                    var eventName = directive.directive.outputs[k];
                    allDirectiveEvents.add(eventName);
                });
            });
            events.forEach(function (event) {
                if (event.target != null || !allDirectiveEvents.has(event.name)) {
                    _this._reportError("Event binding " + event.fullName + " not emitted by any directive on an embedded template. Make sure that the event name is spelled correctly and all directives are listed in the \"@NgModule.declarations\".", event.sourceSpan);
                }
            });
        };
        TemplateParseVisitor.prototype._checkPropertiesInSchema = function (elementName, boundProps) {
            var _this = this;
            // Note: We can't filter out empty expressions before this method,
            // as we still want to validate them!
            return boundProps.filter(function (boundProp) {
                if (boundProp.type === 0 /* Property */ &&
                    !_this._schemaRegistry.hasProperty(elementName, boundProp.name, _this._schemas)) {
                    var errorMsg = "Can't bind to '" + boundProp.name + "' since it isn't a known property of '" + elementName + "'.";
                    if (elementName.startsWith('ng-')) {
                        errorMsg +=
                            "\n1. If '" + boundProp.name + "' is an Angular directive, then add 'CommonModule' to the '@NgModule.imports' of this component." +
                                "\n2. To allow any property add 'NO_ERRORS_SCHEMA' to the '@NgModule.schemas' of this component.";
                    }
                    else if (elementName.indexOf('-') > -1) {
                        errorMsg +=
                            "\n1. If '" + elementName + "' is an Angular component and it has '" + boundProp.name + "' input, then verify that it is part of this module." +
                                ("\n2. If '" + elementName + "' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the '@NgModule.schemas' of this component to suppress this message.") +
                                "\n3. To allow any property add 'NO_ERRORS_SCHEMA' to the '@NgModule.schemas' of this component.";
                    }
                    _this._reportError(errorMsg, boundProp.sourceSpan);
                }
                return !isEmptyExpression(boundProp.value);
            });
        };
        TemplateParseVisitor.prototype._reportError = function (message, sourceSpan, level) {
            if (level === void 0) { level = parse_util_1.ParseErrorLevel.ERROR; }
            this._targetErrors.push(new parse_util_1.ParseError(sourceSpan, message, level));
        };
        return TemplateParseVisitor;
    }());
    var NonBindableVisitor = /** @class */ (function () {
        function NonBindableVisitor() {
        }
        NonBindableVisitor.prototype.visitElement = function (ast, parent) {
            var preparsedElement = template_preparser_1.preparseElement(ast);
            if (preparsedElement.type === template_preparser_1.PreparsedElementType.SCRIPT ||
                preparsedElement.type === template_preparser_1.PreparsedElementType.STYLE ||
                preparsedElement.type === template_preparser_1.PreparsedElementType.STYLESHEET) {
                // Skipping <script> for security reasons
                // Skipping <style> and stylesheets as we already processed them
                // in the StyleCompiler
                return null;
            }
            var attrNameAndValues = ast.attrs.map(function (attr) { return [attr.name, attr.value]; });
            var selector = createElementCssSelector(ast.name, attrNameAndValues);
            var ngContentIndex = parent.findNgContentIndex(selector);
            var children = html.visitAll(this, ast.children, EMPTY_ELEMENT_CONTEXT);
            return new t.ElementAst(ast.name, html.visitAll(this, ast.attrs), [], [], [], [], [], false, [], children, ngContentIndex, ast.sourceSpan, ast.endSourceSpan);
        };
        NonBindableVisitor.prototype.visitComment = function (comment, context) { return null; };
        NonBindableVisitor.prototype.visitAttribute = function (attribute, context) {
            return new t.AttrAst(attribute.name, attribute.value, attribute.sourceSpan);
        };
        NonBindableVisitor.prototype.visitText = function (text, parent) {
            var ngContentIndex = parent.findNgContentIndex(TEXT_CSS_SELECTOR());
            return new t.TextAst(text.value, ngContentIndex, text.sourceSpan);
        };
        NonBindableVisitor.prototype.visitExpansion = function (expansion, context) { return expansion; };
        NonBindableVisitor.prototype.visitExpansionCase = function (expansionCase, context) { return expansionCase; };
        return NonBindableVisitor;
    }());
    /**
     * A reference to an element or directive in a template. E.g., the reference in this template:
     *
     * <div #myMenu="coolMenu">
     *
     * would be {name: 'myMenu', value: 'coolMenu', sourceSpan: ...}
     */
    var ElementOrDirectiveRef = /** @class */ (function () {
        function ElementOrDirectiveRef(name, value, sourceSpan) {
            this.name = name;
            this.value = value;
            this.sourceSpan = sourceSpan;
        }
        /** Gets whether this is a reference to the given directive. */
        ElementOrDirectiveRef.prototype.isReferenceToDirective = function (directive) {
            return splitExportAs(directive.exportAs).indexOf(this.value) !== -1;
        };
        return ElementOrDirectiveRef;
    }());
    /** Splits a raw, potentially comma-delimited `exportAs` value into an array of names. */
    function splitExportAs(exportAs) {
        return exportAs ? exportAs.split(',').map(function (e) { return e.trim(); }) : [];
    }
    function splitClasses(classAttrValue) {
        return classAttrValue.trim().split(/\s+/g);
    }
    exports.splitClasses = splitClasses;
    var ElementContext = /** @class */ (function () {
        function ElementContext(isTemplateElement, _ngContentIndexMatcher, _wildcardNgContentIndex, providerContext) {
            this.isTemplateElement = isTemplateElement;
            this._ngContentIndexMatcher = _ngContentIndexMatcher;
            this._wildcardNgContentIndex = _wildcardNgContentIndex;
            this.providerContext = providerContext;
        }
        ElementContext.create = function (isTemplateElement, directives, providerContext) {
            var matcher = new selector_1.SelectorMatcher();
            var wildcardNgContentIndex = null;
            var component = directives.find(function (directive) { return directive.directive.isComponent; });
            if (component) {
                var ngContentSelectors = component.directive.template.ngContentSelectors;
                for (var i = 0; i < ngContentSelectors.length; i++) {
                    var selector = ngContentSelectors[i];
                    if (selector === '*') {
                        wildcardNgContentIndex = i;
                    }
                    else {
                        matcher.addSelectables(selector_1.CssSelector.parse(ngContentSelectors[i]), i);
                    }
                }
            }
            return new ElementContext(isTemplateElement, matcher, wildcardNgContentIndex, providerContext);
        };
        ElementContext.prototype.findNgContentIndex = function (selector) {
            var ngContentIndices = [];
            this._ngContentIndexMatcher.match(selector, function (selector, ngContentIndex) { ngContentIndices.push(ngContentIndex); });
            ngContentIndices.sort();
            if (this._wildcardNgContentIndex != null) {
                ngContentIndices.push(this._wildcardNgContentIndex);
            }
            return ngContentIndices.length > 0 ? ngContentIndices[0] : null;
        };
        return ElementContext;
    }());
    function createElementCssSelector(elementName, attributes) {
        var cssSelector = new selector_1.CssSelector();
        var elNameNoNs = tags_1.splitNsName(elementName)[1];
        cssSelector.setElement(elNameNoNs);
        for (var i = 0; i < attributes.length; i++) {
            var attrName = attributes[i][0];
            var attrNameNoNs = tags_1.splitNsName(attrName)[1];
            var attrValue = attributes[i][1];
            cssSelector.addAttribute(attrNameNoNs, attrValue);
            if (attrName.toLowerCase() == CLASS_ATTR) {
                var classes = splitClasses(attrValue);
                classes.forEach(function (className) { return cssSelector.addClassName(className); });
            }
        }
        return cssSelector;
    }
    exports.createElementCssSelector = createElementCssSelector;
    var EMPTY_ELEMENT_CONTEXT = new ElementContext(true, new selector_1.SelectorMatcher(), null, null);
    var NON_BINDABLE_VISITOR = new NonBindableVisitor();
    function _isEmptyTextNode(node) {
        return node instanceof html.Text && node.value.trim().length == 0;
    }
    function removeSummaryDuplicates(items) {
        var map = new Map();
        items.forEach(function (item) {
            if (!map.get(item.type.reference)) {
                map.set(item.type.reference, item);
            }
        });
        return Array.from(map.values());
    }
    exports.removeSummaryDuplicates = removeSummaryDuplicates;
    function isEmptyExpression(ast) {
        if (ast instanceof ast_1.ASTWithSource) {
            ast = ast.ast;
        }
        return ast instanceof ast_1.EmptyExpr;
    }
    exports.isEmptyExpression = isEmptyExpression;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGVfcGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL3RlbXBsYXRlX3BhcnNlci90ZW1wbGF0ZV9wYXJzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7O0lBRUgsMkVBQXFLO0lBSXJLLG1FQUFvSDtJQUVwSCxpRUFBcUc7SUFDckcsMERBQXlDO0lBQ3pDLDJFQUFxRTtJQUNyRSxxRkFBNkU7SUFDN0UscUZBQTBEO0lBQzFELDZGQUFzRTtJQUN0RSw2REFBNEQ7SUFDNUQsK0RBQTJFO0lBQzNFLDZFQUFpRjtJQUVqRiwyREFBeUQ7SUFDekQsK0VBQTJEO0lBQzNELG1EQUE2QztJQUU3Qyx1RkFBK0M7SUFDL0Msc0VBQW9DO0lBQ3BDLCtGQUEyRTtJQUUzRSxJQUFNLGdCQUFnQixHQUNsQiwwR0FBMEcsQ0FBQztJQUUvRyxvQkFBb0I7SUFDcEIsSUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDO0lBQ3RCLG1CQUFtQjtJQUNuQixJQUFNLFVBQVUsR0FBRyxDQUFDLENBQUM7SUFDckIscUJBQXFCO0lBQ3JCLElBQU0sVUFBVSxHQUFHLENBQUMsQ0FBQztJQUNyQixrQkFBa0I7SUFDbEIsSUFBTSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQ3BCLHNCQUFzQjtJQUN0QixJQUFNLGFBQWEsR0FBRyxDQUFDLENBQUM7SUFDeEIsZ0JBQWdCO0lBQ2hCLElBQU0sU0FBUyxHQUFHLENBQUMsQ0FBQztJQUNwQixvRkFBb0Y7SUFDcEYsSUFBTSxZQUFZLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZCLG1DQUFtQztJQUNuQyxJQUFNLG9CQUFvQixHQUFHLENBQUMsQ0FBQztJQUMvQixpQ0FBaUM7SUFDakMsSUFBTSxrQkFBa0IsR0FBRyxDQUFDLENBQUM7SUFDN0Isa0NBQWtDO0lBQ2xDLElBQU0sZUFBZSxHQUFHLEVBQUUsQ0FBQztJ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REFtQkM7SUFFRCxJQUFNLHFCQUFxQixHQUFHLElBQUksY0FBYyxDQUFDLElBQUksRUFBRSxJQUFJLDBCQUFlLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDMUYsSUFBTSxvQkFBb0IsR0FBRyxJQUFJLGtCQUFrQixFQUFFLENBQUM7SUFFdEQsU0FBUyxnQkFBZ0IsQ0FBQyxJQUFlO1FBQ3ZDLE9BQU8sSUFBSSxZQUFZLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFFRCxTQUFnQix1QkFBdUIsQ0FBdUMsS0FBVTtRQUN0RixJQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsRUFBVSxDQUFDO1FBRTlCLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJO1lBQ2pCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUU7Z0JBQ2pDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7YUFDcEM7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBVkQsMERBVUM7SUFFRCxTQUFnQixpQkFBaUIsQ0FBQyxHQUFRO1FBQ3hDLElBQUksR0FBRyxZQUFZLG1CQUFhLEVBQUU7WUFDaEMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUM7U0FDZjtRQUNELE9BQU8sR0FBRyxZQUFZLGVBQVMsQ0FBQztJQUNsQyxDQUFDO0lBTEQsOENBS0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhLCBDb21waWxlRGlyZWN0aXZlU3VtbWFyeSwgQ29tcGlsZVBpcGVTdW1tYXJ5LCBDb21waWxlVG9rZW5NZXRhZGF0YSwgQ29tcGlsZVR5cGVNZXRhZGF0YSwgaWRlbnRpZmllck5hbWV9IGZyb20gJy4uL2NvbXBpbGVfbWV0YWRhdGEnO1xuaW1wb3J0IHtDb21waWxlUmVmbGVjdG9yfSBmcm9tICcuLi9jb21waWxlX3JlZmxlY3Rvcic7XG5pbXBvcnQge0NvbXBpbGVyQ29uZmlnfSBmcm9tICcuLi9jb25maWcnO1xuaW1wb3J0IHtTY2hlbWFNZXRhZGF0YX0gZnJvbSAnLi4vY29yZSc7XG5pbXBvcnQge0FTVCwgQVNUV2l0aFNvdXJjZSwgRW1wdHlFeHByLCBQYXJzZWRFdmVudCwgUGFyc2VkUHJvcGVydHksIFBhcnNlZFZhcmlhYmxlfSBmcm9tICcuLi9leHByZXNzaW9uX3BhcnNlci9hc3QnO1xuaW1wb3J0IHtQYXJzZXJ9IGZyb20gJy4uL2V4cHJlc3Npb25fcGFyc2VyL3BhcnNlcic7XG5pbXBvcnQge0lkZW50aWZpZXJzLCBjcmVhdGVUb2tlbkZvckV4dGVybmFsUmVmZXJlbmNlLCBjcmVhdGVUb2tlbkZvclJlZmVyZW5jZX0gZnJvbSAnLi4vaWRlbnRpZmllcnMnO1xuaW1wb3J0ICogYXMgaHRtbCBmcm9tICcuLi9tbF9wYXJzZXIvYXN0JztcbmltcG9ydCB7SHRtbFBhcnNlciwgUGFyc2VUcmVlUmVzdWx0fSBmcm9tICcuLi9tbF9wYXJzZXIvaHRtbF9wYXJzZXInO1xuaW1wb3J0IHtyZW1vdmVXaGl0ZXNwYWNlcywgcmVwbGFjZU5nc3B9IGZyb20gJy4uL21sX3BhcnNlci9odG1sX3doaXRlc3BhY2VzJztcbmltcG9ydCB7ZXhwYW5kTm9kZXN9IGZyb20gJy4uL21sX3BhcnNlci9pY3VfYXN0X2V4cGFuZGVyJztcbmltcG9ydCB7SW50ZXJwb2xhdGlvbkNvbmZpZ30gZnJvbSAnLi4vbWxfcGFyc2VyL2ludGVycG9sYXRpb25fY29uZmlnJztcbmltcG9ydCB7aXNOZ1RlbXBsYXRlLCBzcGxpdE5zTmFtZX0gZnJvbSAnLi4vbWxfcGFyc2VyL3RhZ3MnO1xuaW1wb3J0IHtQYXJzZUVycm9yLCBQYXJzZUVycm9yTGV2ZWwsIFBhcnNlU291cmNlU3Bhbn0gZnJvbSAnLi4vcGFyc2VfdXRpbCc7XG5pbXBvcnQge1Byb3ZpZGVyRWxlbWVudENvbnRleHQsIFByb3ZpZGVyVmlld0NvbnRleHR9IGZyb20gJy4uL3Byb3ZpZGVyX2FuYWx5emVyJztcbmltcG9ydCB7RWxlbWVudFNjaGVtYVJlZ2lzdHJ5fSBmcm9tICcuLi9zY2hlbWEvZWxlbWVudF9zY2hlbWFfcmVnaXN0cnknO1xuaW1wb3J0IHtDc3NTZWxlY3RvciwgU2VsZWN0b3JNYXRjaGVyfSBmcm9tICcuLi9zZWxlY3Rvcic7XG5pbXBvcnQge2lzU3R5bGVVcmxSZXNvbHZhYmxlfSBmcm9tICcuLi9zdHlsZV91cmxfcmVzb2x2ZXInO1xuaW1wb3J0IHtDb25zb2xlLCBzeW50YXhFcnJvcn0gZnJvbSAnLi4vdXRpbCc7XG5cbmltcG9ydCB7QmluZGluZ1BhcnNlcn0gZnJvbSAnLi9iaW5kaW5nX3BhcnNlcic7XG5pbXBvcnQgKiBhcyB0IGZyb20gJy4vdGVtcGxhdGVfYXN0JztcbmltcG9ydCB7UHJlcGFyc2VkRWxlbWVudFR5cGUsIHByZXBhcnNlRWxlbWVudH0gZnJvbSAnLi90ZW1wbGF0ZV9wcmVwYXJzZXInO1xuXG5jb25zdCBCSU5EX05BTUVfUkVHRVhQID1cbiAgICAvXig/Oig/Oig/OihiaW5kLSl8KGxldC0pfChyZWYtfCMpfChvbi0pfChiaW5kb24tKXwoQCkpKC4rKSl8XFxbXFwoKFteXFwpXSspXFwpXFxdfFxcWyhbXlxcXV0rKVxcXXxcXCgoW15cXCldKylcXCkpJC87XG5cbi8vIEdyb3VwIDEgPSBcImJpbmQtXCJcbmNvbnN0IEtXX0JJTkRfSURYID0gMTtcbi8vIEdyb3VwIDIgPSBcImxldC1cIlxuY29uc3QgS1dfTEVUX0lEWCA9IDI7XG4vLyBHcm91cCAzID0gXCJyZWYtLyNcIlxuY29uc3QgS1dfUkVGX0lEWCA9IDM7XG4vLyBHcm91cCA0ID0gXCJvbi1cIlxuY29uc3QgS1dfT05fSURYID0gNDtcbi8vIEdyb3VwIDUgPSBcImJpbmRvbi1cIlxuY29uc3QgS1dfQklORE9OX0lEWCA9IDU7XG4vLyBHcm91cCA2ID0gXCJAXCJcbmNvbnN0IEtXX0FUX0lEWCA9IDY7XG4vLyBHcm91cCA3ID0gdGhlIGlkZW50aWZpZXIgYWZ0ZXIgXCJiaW5kLVwiLCBcImxldC1cIiwgXCJyZWYtLyNcIiwgXCJvbi1cIiwgXCJiaW5kb24tXCIgb3IgXCJAXCJcbmNvbnN0IElERU5UX0tXX0lEWCA9IDc7XG4vLyBHcm91cCA4ID0gaWRlbnRpZmllciBpbnNpZGUgWygpXVxuY29uc3QgSURFTlRfQkFOQU5BX0JPWF9JRFggPSA4O1xuLy8gR3JvdXAgOSA9IGlkZW50aWZpZXIgaW5zaWRlIFtdXG5jb25zdCBJREVOVF9QUk9QRVJUWV9JRFggPSA5O1xuLy8gR3JvdXAgMTAgPSBpZGVudGlmaWVyIGluc2lkZSAoKVxuY29uc3QgSURFTlRfRVZFTlRfSURYID0gMTA7XG5cbmNvbnN0IFRFTVBMQVRFX0FUVFJfUFJFRklYID0gJyonO1xuY29uc3QgQ0xBU1NfQVRUUiA9ICdjbGFzcyc7XG5cbmxldCBfVEVYVF9DU1NfU0VMRUNUT1IgITogQ3NzU2VsZWN0b3I7XG5mdW5jdGlvbiBURVhUX0NTU19TRUxFQ1RPUigpOiBDc3NTZWxlY3RvciB7XG4gIGlmICghX1RFWFRfQ1NTX1NFTEVDVE9SKSB7XG4gICAgX1RFWFRfQ1NTX1NFTEVDVE9SID0gQ3NzU2VsZWN0b3IucGFyc2UoJyonKVswXTtcbiAgfVxuICByZXR1cm4gX1RFWFRfQ1NTX1NFTEVDVE9SO1xufVxuXG5leHBvcnQgY2xhc3MgVGVtcGxhdGVQYXJzZUVycm9yIGV4dGVuZHMgUGFyc2VFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2U6IHN0cmluZywgc3BhbjogUGFyc2VTb3VyY2VTcGFuLCBsZXZlbDogUGFyc2VFcnJvckxldmVsKSB7XG4gICAgc3VwZXIoc3BhbiwgbWVzc2FnZSwgbGV2ZWwpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZVBhcnNlUmVzdWx0IHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwdWJsaWMgdGVtcGxhdGVBc3Q/OiB0LlRlbXBsYXRlQXN0W10sIHB1YmxpYyB1c2VkUGlwZXM/OiBDb21waWxlUGlwZVN1bW1hcnlbXSxcbiAgICAgIHB1YmxpYyBlcnJvcnM/OiBQYXJzZUVycm9yW10pIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZVBhcnNlciB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBfY29uZmlnOiBDb21waWxlckNvbmZpZywgcHJpdmF0ZSBfcmVmbGVjdG9yOiBDb21waWxlUmVmbGVjdG9yLFxuICAgICAgcHJpdmF0ZSBfZXhwclBhcnNlcjogUGFyc2VyLCBwcml2YXRlIF9zY2hlbWFSZWdpc3RyeTogRWxlbWVudFNjaGVtYVJlZ2lzdHJ5LFxuICAgICAgcHJpdmF0ZSBfaHRtbFBhcnNlcjogSHRtbFBhcnNlciwgcHJpdmF0ZSBfY29uc29sZTogQ29uc29sZSxcbiAgICAgIHB1YmxpYyB0cmFuc2Zvcm1zOiB0LlRlbXBsYXRlQXN0VmlzaXRvcltdKSB7fVxuXG4gIHB1YmxpYyBnZXQgZXhwcmVzc2lvblBhcnNlcigpIHsgcmV0dXJuIHRoaXMuX2V4cHJQYXJzZXI7IH1cblxuICBwYXJzZShcbiAgICAgIGNvbXBvbmVudDogQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhLCB0ZW1wbGF0ZTogc3RyaW5nfFBhcnNlVHJlZVJlc3VsdCxcbiAgICAgIGRpcmVjdGl2ZXM6IENvbXBpbGVEaXJlY3RpdmVTdW1tYXJ5W10sIHBpcGVzOiBDb21waWxlUGlwZVN1bW1hcnlbXSwgc2NoZW1hczogU2NoZW1hTWV0YWRhdGFbXSxcbiAgICAgIHRlbXBsYXRlVXJsOiBzdHJpbmcsXG4gICAgICBwcmVzZXJ2ZVdoaXRlc3BhY2VzOiBib29sZWFuKToge3RlbXBsYXRlOiB0LlRlbXBsYXRlQXN0W10sIHBpcGVzOiBDb21waWxlUGlwZVN1bW1hcnlbXX0ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMudHJ5UGFyc2UoXG4gICAgICAgIGNvbXBvbmVudCwgdGVtcGxhdGUsIGRpcmVjdGl2ZXMsIHBpcGVzLCBzY2hlbWFzLCB0ZW1wbGF0ZVVybCwgcHJlc2VydmVXaGl0ZXNwYWNlcyk7XG4gICAgY29uc3Qgd2FybmluZ3MgPSByZXN1bHQuZXJyb3JzICEuZmlsdGVyKGVycm9yID0+IGVycm9yLmxldmVsID09PSBQYXJzZUVycm9yTGV2ZWwuV0FSTklORyk7XG5cbiAgICBjb25zdCBlcnJvcnMgPSByZXN1bHQuZXJyb3JzICEuZmlsdGVyKGVycm9yID0+IGVycm9yLmxldmVsID09PSBQYXJzZUVycm9yTGV2ZWwuRVJST1IpO1xuXG4gICAgaWYgKHdhcm5pbmdzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuX2NvbnNvbGUud2FybihgVGVtcGxhdGUgcGFyc2Ugd2FybmluZ3M6XFxuJHt3YXJuaW5ncy5qb2luKCdcXG4nKX1gKTtcbiAgICB9XG5cbiAgICBpZiAoZXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGVycm9yU3RyaW5nID0gZXJyb3JzLmpvaW4oJ1xcbicpO1xuICAgICAgdGhyb3cgc3ludGF4RXJyb3IoYFRlbXBsYXRlIHBhcnNlIGVycm9yczpcXG4ke2Vycm9yU3RyaW5nfWAsIGVycm9ycyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHt0ZW1wbGF0ZTogcmVzdWx0LnRlbXBsYXRlQXN0ICEsIHBpcGVzOiByZXN1bHQudXNlZFBpcGVzICF9O1xuICB9XG5cbiAgdHJ5UGFyc2UoXG4gICAgICBjb21wb25lbnQ6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSwgdGVtcGxhdGU6IHN0cmluZ3xQYXJzZVRyZWVSZXN1bHQsXG4gICAgICBkaXJlY3RpdmVzOiBDb21waWxlRGlyZWN0aXZlU3VtbWFyeVtdLCBwaXBlczogQ29tcGlsZVBpcGVTdW1tYXJ5W10sIHNjaGVtYXM6IFNjaGVtYU1ldGFkYXRhW10sXG4gICAgICB0ZW1wbGF0ZVVybDogc3RyaW5nLCBwcmVzZXJ2ZVdoaXRlc3BhY2VzOiBib29sZWFuKTogVGVtcGxhdGVQYXJzZVJlc3VsdCB7XG4gICAgbGV0IGh0bWxQYXJzZVJlc3VsdCA9IHR5cGVvZiB0ZW1wbGF0ZSA9PT0gJ3N0cmluZycgP1xuICAgICAgICB0aGlzLl9odG1sUGFyc2VyICEucGFyc2UodGVtcGxhdGUsIHRlbXBsYXRlVXJsLCB7XG4gICAgICAgICAgdG9rZW5pemVFeHBhbnNpb25Gb3JtczogdHJ1ZSxcbiAgICAgICAgICBpbnRlcnBvbGF0aW9uQ29uZmlnOiB0aGlzLmdldEludGVycG9sYXRpb25Db25maWcoY29tcG9uZW50KVxuICAgICAgICB9KSA6XG4gICAgICAgIHRlbXBsYXRlO1xuXG4gICAgaWYgKCFwcmVzZXJ2ZVdoaXRlc3BhY2VzKSB7XG4gICAgICBodG1sUGFyc2VSZXN1bHQgPSByZW1vdmVXaGl0ZXNwYWNlcyhodG1sUGFyc2VSZXN1bHQpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnRyeVBhcnNlSHRtbChcbiAgICAgICAgdGhpcy5leHBhbmRIdG1sKGh0bWxQYXJzZVJlc3VsdCksIGNvbXBvbmVudCwgZGlyZWN0aXZlcywgcGlwZXMsIHNjaGVtYXMpO1xuICB9XG5cbiAgdHJ5UGFyc2VIdG1sKFxuICAgICAgaHRtbEFzdFdpdGhFcnJvcnM6IFBhcnNlVHJlZVJlc3VsdCwgY29tcG9uZW50OiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEsXG4gICAgICBkaXJlY3RpdmVzOiBDb21waWxlRGlyZWN0aXZlU3VtbWFyeVtdLCBwaXBlczogQ29tcGlsZVBpcGVTdW1tYXJ5W10sXG4gICAgICBzY2hlbWFzOiBTY2hlbWFNZXRhZGF0YVtdKTogVGVtcGxhdGVQYXJzZVJlc3VsdCB7XG4gICAgbGV0IHJlc3VsdDogdC5UZW1wbGF0ZUFzdFtdO1xuICAgIGNvbnN0IGVycm9ycyA9IGh0bWxBc3RXaXRoRXJyb3JzLmVycm9ycztcbiAgICBjb25zdCB1c2VkUGlwZXM6IENvbXBpbGVQaXBlU3VtbWFyeVtdID0gW107XG4gICAgaWYgKGh0bWxBc3RXaXRoRXJyb3JzLnJvb3ROb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCB1bmlxRGlyZWN0aXZlcyA9IHJlbW92ZVN1bW1hcnlEdXBsaWNhdGVzKGRpcmVjdGl2ZXMpO1xuICAgICAgY29uc3QgdW5pcVBpcGVzID0gcmVtb3ZlU3VtbWFyeUR1cGxpY2F0ZXMocGlwZXMpO1xuICAgICAgY29uc3QgcHJvdmlkZXJWaWV3Q29udGV4dCA9IG5ldyBQcm92aWRlclZpZXdDb250ZXh0KHRoaXMuX3JlZmxlY3RvciwgY29tcG9uZW50KTtcbiAgICAgIGxldCBpbnRlcnBvbGF0aW9uQ29uZmlnOiBJbnRlcnBvbGF0aW9uQ29uZmlnID0gdW5kZWZpbmVkICE7XG4gICAgICBpZiAoY29tcG9uZW50LnRlbXBsYXRlICYmIGNvbXBvbmVudC50ZW1wbGF0ZS5pbnRlcnBvbGF0aW9uKSB7XG4gICAgICAgIGludGVycG9sYXRpb25Db25maWcgPSB7XG4gICAgICAgICAgc3RhcnQ6IGNvbXBvbmVudC50ZW1wbGF0ZS5pbnRlcnBvbGF0aW9uWzBdLFxuICAgICAgICAgIGVuZDogY29tcG9uZW50LnRlbXBsYXRlLmludGVycG9sYXRpb25bMV1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGJpbmRpbmdQYXJzZXIgPSBuZXcgQmluZGluZ1BhcnNlcihcbiAgICAgICAgICB0aGlzLl9leHByUGFyc2VyLCBpbnRlcnBvbGF0aW9uQ29uZmlnICEsIHRoaXMuX3NjaGVtYVJlZ2lzdHJ5LCB1bmlxUGlwZXMsIGVycm9ycyk7XG4gICAgICBjb25zdCBwYXJzZVZpc2l0b3IgPSBuZXcgVGVtcGxhdGVQYXJzZVZpc2l0b3IoXG4gICAgICAgICAgdGhpcy5fcmVmbGVjdG9yLCB0aGlzLl9jb25maWcsIHByb3ZpZGVyVmlld0NvbnRleHQsIHVuaXFEaXJlY3RpdmVzLCBiaW5kaW5nUGFyc2VyLFxuICAgICAgICAgIHRoaXMuX3NjaGVtYVJlZ2lzdHJ5LCBzY2hlbWFzLCBlcnJvcnMpO1xuICAgICAgcmVzdWx0ID0gaHRtbC52aXNpdEFsbChwYXJzZVZpc2l0b3IsIGh0bWxBc3RXaXRoRXJyb3JzLnJvb3ROb2RlcywgRU1QVFlfRUxFTUVOVF9DT05URVhUKTtcbiAgICAgIGVycm9ycy5wdXNoKC4uLnByb3ZpZGVyVmlld0NvbnRleHQuZXJyb3JzKTtcbiAgICAgIHVzZWRQaXBlcy5wdXNoKC4uLmJpbmRpbmdQYXJzZXIuZ2V0VXNlZFBpcGVzKCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQgPSBbXTtcbiAgICB9XG4gICAgdGhpcy5fYXNzZXJ0Tm9SZWZlcmVuY2VEdXBsaWNhdGlvbk9uVGVtcGxhdGUocmVzdWx0LCBlcnJvcnMpO1xuXG4gICAgaWYgKGVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gbmV3IFRlbXBsYXRlUGFyc2VSZXN1bHQocmVzdWx0LCB1c2VkUGlwZXMsIGVycm9ycyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudHJhbnNmb3Jtcykge1xuICAgICAgdGhpcy50cmFuc2Zvcm1zLmZvckVhY2goXG4gICAgICAgICAgKHRyYW5zZm9ybTogdC5UZW1wbGF0ZUFzdFZpc2l0b3IpID0+IHsgcmVzdWx0ID0gdC50ZW1wbGF0ZVZpc2l0QWxsKHRyYW5zZm9ybSwgcmVzdWx0KTsgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBUZW1wbGF0ZVBhcnNlUmVzdWx0KHJlc3VsdCwgdXNlZFBpcGVzLCBlcnJvcnMpO1xuICB9XG5cbiAgZXhwYW5kSHRtbChodG1sQXN0V2l0aEVycm9yczogUGFyc2VUcmVlUmVzdWx0LCBmb3JjZWQ6IGJvb2xlYW4gPSBmYWxzZSk6IFBhcnNlVHJlZVJlc3VsdCB7XG4gICAgY29uc3QgZXJyb3JzOiBQYXJzZUVycm9yW10gPSBodG1sQXN0V2l0aEVycm9ycy5lcnJvcnM7XG5cbiAgICBpZiAoZXJyb3JzLmxlbmd0aCA9PSAwIHx8IGZvcmNlZCkge1xuICAgICAgLy8gVHJhbnNmb3JtIElDVSBtZXNzYWdlcyB0byBhbmd1bGFyIGRpcmVjdGl2ZXNcbiAgICAgIGNvbnN0IGV4cGFuZGVkSHRtbEFzdCA9IGV4cGFuZE5vZGVzKGh0bWxBc3RXaXRoRXJyb3JzLnJvb3ROb2Rlcyk7XG4gICAgICBlcnJvcnMucHVzaCguLi5leHBhbmRlZEh0bWxBc3QuZXJyb3JzKTtcbiAgICAgIGh0bWxBc3RXaXRoRXJyb3JzID0gbmV3IFBhcnNlVHJlZVJlc3VsdChleHBhbmRlZEh0bWxBc3Qubm9kZXMsIGVycm9ycyk7XG4gICAgfVxuICAgIHJldHVybiBodG1sQXN0V2l0aEVycm9ycztcbiAgfVxuXG4gIGdldEludGVycG9sYXRpb25Db25maWcoY29tcG9uZW50OiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEpOiBJbnRlcnBvbGF0aW9uQ29uZmlnfHVuZGVmaW5lZCB7XG4gICAgaWYgKGNvbXBvbmVudC50ZW1wbGF0ZSkge1xuICAgICAgcmV0dXJuIEludGVycG9sYXRpb25Db25maWcuZnJvbUFycmF5KGNvbXBvbmVudC50ZW1wbGF0ZS5pbnRlcnBvbGF0aW9uKTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2Fzc2VydE5vUmVmZXJlbmNlRHVwbGljYXRpb25PblRlbXBsYXRlKHJlc3VsdDogdC5UZW1wbGF0ZUFzdFtdLCBlcnJvcnM6IFRlbXBsYXRlUGFyc2VFcnJvcltdKTpcbiAgICAgIHZvaWQge1xuICAgIGNvbnN0IGV4aXN0aW5nUmVmZXJlbmNlczogc3RyaW5nW10gPSBbXTtcblxuICAgIHJlc3VsdC5maWx0ZXIoZWxlbWVudCA9PiAhISg8YW55PmVsZW1lbnQpLnJlZmVyZW5jZXMpXG4gICAgICAgIC5mb3JFYWNoKGVsZW1lbnQgPT4gKDxhbnk+ZWxlbWVudCkucmVmZXJlbmNlcy5mb3JFYWNoKChyZWZlcmVuY2U6IHQuUmVmZXJlbmNlQXN0KSA9PiB7XG4gICAgICAgICAgY29uc3QgbmFtZSA9IHJlZmVyZW5jZS5uYW1lO1xuICAgICAgICAgIGlmIChleGlzdGluZ1JlZmVyZW5jZXMuaW5kZXhPZihuYW1lKSA8IDApIHtcbiAgICAgICAgICAgIGV4aXN0aW5nUmVmZXJlbmNlcy5wdXNoKG5hbWUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBUZW1wbGF0ZVBhcnNlRXJyb3IoXG4gICAgICAgICAgICAgICAgYFJlZmVyZW5jZSBcIiMke25hbWV9XCIgaXMgZGVmaW5lZCBzZXZlcmFsIHRpbWVzYCwgcmVmZXJlbmNlLnNvdXJjZVNwYW4sXG4gICAgICAgICAgICAgICAgUGFyc2VFcnJvckxldmVsLkVSUk9SKTtcbiAgICAgICAgICAgIGVycm9ycy5wdXNoKGVycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgfVxufVxuXG5jbGFzcyBUZW1wbGF0ZVBhcnNlVmlzaXRvciBpbXBsZW1lbnRzIGh0bWwuVmlzaXRvciB7XG4gIHNlbGVjdG9yTWF0Y2hlciA9IG5ldyBTZWxlY3Rvck1hdGNoZXIoKTtcbiAgZGlyZWN0aXZlc0luZGV4ID0gbmV3IE1hcDxDb21waWxlRGlyZWN0aXZlU3VtbWFyeSwgbnVtYmVyPigpO1xuICBuZ0NvbnRlbnRDb3VudCA9IDA7XG4gIGNvbnRlbnRRdWVyeVN0YXJ0SWQ6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgcmVmbGVjdG9yOiBDb21waWxlUmVmbGVjdG9yLCBwcml2YXRlIGNvbmZpZzogQ29tcGlsZXJDb25maWcsXG4gICAgICBwdWJsaWMgcHJvdmlkZXJWaWV3Q29udGV4dDogUHJvdmlkZXJWaWV3Q29udGV4dCwgZGlyZWN0aXZlczogQ29tcGlsZURpcmVjdGl2ZVN1bW1hcnlbXSxcbiAgICAgIHByaXZhdGUgX2JpbmRpbmdQYXJzZXI6IEJpbmRpbmdQYXJzZXIsIHByaXZhdGUgX3NjaGVtYVJlZ2lzdHJ5OiBFbGVtZW50U2NoZW1hUmVnaXN0cnksXG4gICAgICBwcml2YXRlIF9zY2hlbWFzOiBTY2hlbWFNZXRhZGF0YVtdLCBwcml2YXRlIF90YXJnZXRFcnJvcnM6IFRlbXBsYXRlUGFyc2VFcnJvcltdKSB7XG4gICAgLy8gTm90ZTogcXVlcmllcyBzdGFydCB3aXRoIGlkIDEgc28gd2UgY2FuIHVzZSB0aGUgbnVtYmVyIGluIGEgQmxvb20gZmlsdGVyIVxuICAgIHRoaXMuY29udGVudFF1ZXJ5U3RhcnRJZCA9IHByb3ZpZGVyVmlld0NvbnRleHQuY29tcG9uZW50LnZpZXdRdWVyaWVzLmxlbmd0aCArIDE7XG4gICAgZGlyZWN0aXZlcy5mb3JFYWNoKChkaXJlY3RpdmUsIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCBzZWxlY3RvciA9IENzc1NlbGVjdG9yLnBhcnNlKGRpcmVjdGl2ZS5zZWxlY3RvciAhKTtcbiAgICAgIHRoaXMuc2VsZWN0b3JNYXRjaGVyLmFkZFNlbGVjdGFibGVzKHNlbGVjdG9yLCBkaXJlY3RpdmUpO1xuICAgICAgdGhpcy5kaXJlY3RpdmVzSW5kZXguc2V0KGRpcmVjdGl2ZSwgaW5kZXgpO1xuICAgIH0pO1xuICB9XG5cbiAgdmlzaXRFeHBhbnNpb24oZXhwYW5zaW9uOiBodG1sLkV4cGFuc2lvbiwgY29udGV4dDogYW55KTogYW55IHsgcmV0dXJuIG51bGw7IH1cblxuICB2aXNpdEV4cGFuc2lvbkNhc2UoZXhwYW5zaW9uQ2FzZTogaHRtbC5FeHBhbnNpb25DYXNlLCBjb250ZXh0OiBhbnkpOiBhbnkgeyByZXR1cm4gbnVsbDsgfVxuXG4gIHZpc2l0VGV4dCh0ZXh0OiBodG1sLlRleHQsIHBhcmVudDogRWxlbWVudENvbnRleHQpOiBhbnkge1xuICAgIGNvbnN0IG5nQ29udGVudEluZGV4ID0gcGFyZW50LmZpbmROZ0NvbnRlbnRJbmRleChURVhUX0NTU19TRUxFQ1RPUigpKSAhO1xuICAgIGNvbnN0IHZhbHVlTm9OZ3NwID0gcmVwbGFjZU5nc3AodGV4dC52YWx1ZSk7XG4gICAgY29uc3QgZXhwciA9IHRoaXMuX2JpbmRpbmdQYXJzZXIucGFyc2VJbnRlcnBvbGF0aW9uKHZhbHVlTm9OZ3NwLCB0ZXh0LnNvdXJjZVNwYW4gISk7XG4gICAgcmV0dXJuIGV4cHIgPyBuZXcgdC5Cb3VuZFRleHRBc3QoZXhwciwgbmdDb250ZW50SW5kZXgsIHRleHQuc291cmNlU3BhbiAhKSA6XG4gICAgICAgICAgICAgICAgICBuZXcgdC5UZXh0QXN0KHZhbHVlTm9OZ3NwLCBuZ0NvbnRlbnRJbmRleCwgdGV4dC5zb3VyY2VTcGFuICEpO1xuICB9XG5cbiAgdmlzaXRBdHRyaWJ1dGUoYXR0cmlidXRlOiBodG1sLkF0dHJpYnV0ZSwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gbmV3IHQuQXR0ckFzdChhdHRyaWJ1dGUubmFtZSwgYXR0cmlidXRlLnZhbHVlLCBhdHRyaWJ1dGUuc291cmNlU3Bhbik7XG4gIH1cblxuICB2aXNpdENvbW1lbnQoY29tbWVudDogaHRtbC5Db21tZW50LCBjb250ZXh0OiBhbnkpOiBhbnkgeyByZXR1cm4gbnVsbDsgfVxuXG4gIHZpc2l0RWxlbWVudChlbGVtZW50OiBodG1sLkVsZW1lbnQsIHBhcmVudDogRWxlbWVudENvbnRleHQpOiBhbnkge1xuICAgIGNvbnN0IHF1ZXJ5U3RhcnRJbmRleCA9IHRoaXMuY29udGVudFF1ZXJ5U3RhcnRJZDtcbiAgICBjb25zdCBlbE5hbWUgPSBlbGVtZW50Lm5hbWU7XG4gICAgY29uc3QgcHJlcGFyc2VkRWxlbWVudCA9IHByZXBhcnNlRWxlbWVudChlbGVtZW50KTtcbiAgICBpZiAocHJlcGFyc2VkRWxlbWVudC50eXBlID09PSBQcmVwYXJzZWRFbGVtZW50VHlwZS5TQ1JJUFQgfHxcbiAgICAgICAgcHJlcGFyc2VkRWxlbWVudC50eXBlID09PSBQcmVwYXJzZWRFbGVtZW50VHlwZS5TVFlMRSkge1xuICAgICAgLy8gU2tpcHBpbmcgPHNjcmlwdD4gZm9yIHNlY3VyaXR5IHJlYXNvbnNcbiAgICAgIC8vIFNraXBwaW5nIDxzdHlsZT4gYXMgd2UgYWxyZWFkeSBwcm9jZXNzZWQgdGhlbVxuICAgICAgLy8gaW4gdGhlIFN0eWxlQ29tcGlsZXJcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAocHJlcGFyc2VkRWxlbWVudC50eXBlID09PSBQcmVwYXJzZWRFbGVtZW50VHlwZS5TVFlMRVNIRUVUICYmXG4gICAgICAgIGlzU3R5bGVVcmxSZXNvbHZhYmxlKHByZXBhcnNlZEVsZW1lbnQuaHJlZkF0dHIpKSB7XG4gICAgICAvLyBTa2lwcGluZyBzdHlsZXNoZWV0cyB3aXRoIGVpdGhlciByZWxhdGl2ZSB1cmxzIG9yIHBhY2thZ2Ugc2NoZW1lIGFzIHdlIGFscmVhZHkgcHJvY2Vzc2VkXG4gICAgICAvLyB0aGVtIGluIHRoZSBTdHlsZUNvbXBpbGVyXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBtYXRjaGFibGVBdHRyczogW3N0cmluZywgc3RyaW5nXVtdID0gW107XG4gICAgY29uc3QgZWxlbWVudE9yRGlyZWN0aXZlUHJvcHM6IFBhcnNlZFByb3BlcnR5W10gPSBbXTtcbiAgICBjb25zdCBlbGVtZW50T3JEaXJlY3RpdmVSZWZzOiBFbGVtZW50T3JEaXJlY3RpdmVSZWZbXSA9IFtdO1xuICAgIGNvbnN0IGVsZW1lbnRWYXJzOiB0LlZhcmlhYmxlQXN0W10gPSBbXTtcbiAgICBjb25zdCBldmVudHM6IHQuQm91bmRFdmVudEFzdFtdID0gW107XG5cbiAgICBjb25zdCB0ZW1wbGF0ZUVsZW1lbnRPckRpcmVjdGl2ZVByb3BzOiBQYXJzZWRQcm9wZXJ0eVtdID0gW107XG4gICAgY29uc3QgdGVtcGxhdGVNYXRjaGFibGVBdHRyczogW3N0cmluZywgc3RyaW5nXVtdID0gW107XG4gICAgY29uc3QgdGVtcGxhdGVFbGVtZW50VmFyczogdC5WYXJpYWJsZUFzdFtdID0gW107XG5cbiAgICBsZXQgaGFzSW5saW5lVGVtcGxhdGVzID0gZmFsc2U7XG4gICAgY29uc3QgYXR0cnM6IHQuQXR0ckFzdFtdID0gW107XG4gICAgY29uc3QgaXNUZW1wbGF0ZUVsZW1lbnQgPSBpc05nVGVtcGxhdGUoZWxlbWVudC5uYW1lKTtcblxuICAgIGVsZW1lbnQuYXR0cnMuZm9yRWFjaChhdHRyID0+IHtcbiAgICAgIGNvbnN0IHBhcnNlZFZhcmlhYmxlczogUGFyc2VkVmFyaWFibGVbXSA9IFtdO1xuICAgICAgY29uc3QgaGFzQmluZGluZyA9IHRoaXMuX3BhcnNlQXR0cihcbiAgICAgICAgICBpc1RlbXBsYXRlRWxlbWVudCwgYXR0ciwgbWF0Y2hhYmxlQXR0cnMsIGVsZW1lbnRPckRpcmVjdGl2ZVByb3BzLCBldmVudHMsXG4gICAgICAgICAgZWxlbWVudE9yRGlyZWN0aXZlUmVmcywgZWxlbWVudFZhcnMpO1xuICAgICAgZWxlbWVudFZhcnMucHVzaCguLi5wYXJzZWRWYXJpYWJsZXMubWFwKHYgPT4gdC5WYXJpYWJsZUFzdC5mcm9tUGFyc2VkVmFyaWFibGUodikpKTtcblxuICAgICAgbGV0IHRlbXBsYXRlVmFsdWU6IHN0cmluZ3x1bmRlZmluZWQ7XG4gICAgICBsZXQgdGVtcGxhdGVLZXk6IHN0cmluZ3x1bmRlZmluZWQ7XG4gICAgICBjb25zdCBub3JtYWxpemVkTmFtZSA9IHRoaXMuX25vcm1hbGl6ZUF0dHJpYnV0ZU5hbWUoYXR0ci5uYW1lKTtcblxuICAgICAgaWYgKG5vcm1hbGl6ZWROYW1lLnN0YXJ0c1dpdGgoVEVNUExBVEVfQVRUUl9QUkVGSVgpKSB7XG4gICAgICAgIHRlbXBsYXRlVmFsdWUgPSBhdHRyLnZhbHVlO1xuICAgICAgICB0ZW1wbGF0ZUtleSA9IG5vcm1hbGl6ZWROYW1lLnN1YnN0cmluZyhURU1QTEFURV9BVFRSX1BSRUZJWC5sZW5ndGgpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBoYXNUZW1wbGF0ZUJpbmRpbmcgPSB0ZW1wbGF0ZVZhbHVlICE9IG51bGw7XG4gICAgICBpZiAoaGFzVGVtcGxhdGVCaW5kaW5nKSB7XG4gICAgICAgIGlmIChoYXNJbmxpbmVUZW1wbGF0ZXMpIHtcbiAgICAgICAgICB0aGlzLl9yZXBvcnRFcnJvcihcbiAgICAgICAgICAgICAgYENhbid0IGhhdmUgbXVsdGlwbGUgdGVtcGxhdGUgYmluZGluZ3Mgb24gb25lIGVsZW1lbnQuIFVzZSBvbmx5IG9uZSBhdHRyaWJ1dGUgcHJlZml4ZWQgd2l0aCAqYCxcbiAgICAgICAgICAgICAgYXR0ci5zb3VyY2VTcGFuKTtcbiAgICAgICAgfVxuICAgICAgICBoYXNJbmxpbmVUZW1wbGF0ZXMgPSB0cnVlO1xuICAgICAgICBjb25zdCBwYXJzZWRWYXJpYWJsZXM6IFBhcnNlZFZhcmlhYmxlW10gPSBbXTtcbiAgICAgICAgdGhpcy5fYmluZGluZ1BhcnNlci5wYXJzZUlubGluZVRlbXBsYXRlQmluZGluZyhcbiAgICAgICAgICAgIHRlbXBsYXRlS2V5ICEsIHRlbXBsYXRlVmFsdWUgISwgYXR0ci5zb3VyY2VTcGFuLCB0ZW1wbGF0ZU1hdGNoYWJsZUF0dHJzLFxuICAgICAgICAgICAgdGVtcGxhdGVFbGVtZW50T3JEaXJlY3RpdmVQcm9wcywgcGFyc2VkVmFyaWFibGVzKTtcbiAgICAgICAgdGVtcGxhdGVFbGVtZW50VmFycy5wdXNoKC4uLnBhcnNlZFZhcmlhYmxlcy5tYXAodiA9PiB0LlZhcmlhYmxlQXN0LmZyb21QYXJzZWRWYXJpYWJsZSh2KSkpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWhhc0JpbmRpbmcgJiYgIWhhc1RlbXBsYXRlQmluZGluZykge1xuICAgICAgICAvLyBkb24ndCBpbmNsdWRlIHRoZSBiaW5kaW5ncyBhcyBhdHRyaWJ1dGVzIGFzIHdlbGwgaW4gdGhlIEFTVFxuICAgICAgICBhdHRycy5wdXNoKHRoaXMudmlzaXRBdHRyaWJ1dGUoYXR0ciwgbnVsbCkpO1xuICAgICAgICBtYXRjaGFibGVBdHRycy5wdXNoKFthdHRyLm5hbWUsIGF0dHIudmFsdWVdKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IGVsZW1lbnRDc3NTZWxlY3RvciA9IGNyZWF0ZUVsZW1lbnRDc3NTZWxlY3RvcihlbE5hbWUsIG1hdGNoYWJsZUF0dHJzKTtcbiAgICBjb25zdCB7ZGlyZWN0aXZlczogZGlyZWN0aXZlTWV0YXMsIG1hdGNoRWxlbWVudH0gPVxuICAgICAgICB0aGlzLl9wYXJzZURpcmVjdGl2ZXModGhpcy5zZWxlY3Rvck1hdGNoZXIsIGVsZW1lbnRDc3NTZWxlY3Rvcik7XG4gICAgY29uc3QgcmVmZXJlbmNlczogdC5SZWZlcmVuY2VBc3RbXSA9IFtdO1xuICAgIGNvbnN0IGJvdW5kRGlyZWN0aXZlUHJvcE5hbWVzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgY29uc3QgZGlyZWN0aXZlQXN0cyA9IHRoaXMuX2NyZWF0ZURpcmVjdGl2ZUFzdHMoXG4gICAgICAgIGlzVGVtcGxhdGVFbGVtZW50LCBlbGVtZW50Lm5hbWUsIGRpcmVjdGl2ZU1ldGFzLCBlbGVtZW50T3JEaXJlY3RpdmVQcm9wcyxcbiAgICAgICAgZWxlbWVudE9yRGlyZWN0aXZlUmVmcywgZWxlbWVudC5zb3VyY2VTcGFuICEsIHJlZmVyZW5jZXMsIGJvdW5kRGlyZWN0aXZlUHJvcE5hbWVzKTtcbiAgICBjb25zdCBlbGVtZW50UHJvcHM6IHQuQm91bmRFbGVtZW50UHJvcGVydHlBc3RbXSA9IHRoaXMuX2NyZWF0ZUVsZW1lbnRQcm9wZXJ0eUFzdHMoXG4gICAgICAgIGVsZW1lbnQubmFtZSwgZWxlbWVudE9yRGlyZWN0aXZlUHJvcHMsIGJvdW5kRGlyZWN0aXZlUHJvcE5hbWVzKTtcbiAgICBjb25zdCBpc1ZpZXdSb290ID0gcGFyZW50LmlzVGVtcGxhdGVFbGVtZW50IHx8IGhhc0lubGluZVRlbXBsYXRlcztcblxuICAgIGNvbnN0IHByb3ZpZGVyQ29udGV4dCA9IG5ldyBQcm92aWRlckVsZW1lbnRDb250ZXh0KFxuICAgICAgICB0aGlzLnByb3ZpZGVyVmlld0NvbnRleHQsIHBhcmVudC5wcm92aWRlckNvbnRleHQgISwgaXNWaWV3Um9vdCwgZGlyZWN0aXZlQXN0cywgYXR0cnMsXG4gICAgICAgIHJlZmVyZW5jZXMsIGlzVGVtcGxhdGVFbGVtZW50LCBxdWVyeVN0YXJ0SW5kZXgsIGVsZW1lbnQuc291cmNlU3BhbiAhKTtcblxuICAgIGNvbnN0IGNoaWxkcmVuOiB0LlRlbXBsYXRlQXN0W10gPSBodG1sLnZpc2l0QWxsKFxuICAgICAgICBwcmVwYXJzZWRFbGVtZW50Lm5vbkJpbmRhYmxlID8gTk9OX0JJTkRBQkxFX1ZJU0lUT1IgOiB0aGlzLCBlbGVtZW50LmNoaWxkcmVuLFxuICAgICAgICBFbGVtZW50Q29udGV4dC5jcmVhdGUoXG4gICAgICAgICAgICBpc1RlbXBsYXRlRWxlbWVudCwgZGlyZWN0aXZlQXN0cyxcbiAgICAgICAgICAgIGlzVGVtcGxhdGVFbGVtZW50ID8gcGFyZW50LnByb3ZpZGVyQ29udGV4dCAhIDogcHJvdmlkZXJDb250ZXh0KSk7XG4gICAgcHJvdmlkZXJDb250ZXh0LmFmdGVyRWxlbWVudCgpO1xuICAgIC8vIE92ZXJyaWRlIHRoZSBhY3R1YWwgc2VsZWN0b3Igd2hlbiB0aGUgYG5nUHJvamVjdEFzYCBhdHRyaWJ1dGUgaXMgcHJvdmlkZWRcbiAgICBjb25zdCBwcm9qZWN0aW9uU2VsZWN0b3IgPSBwcmVwYXJzZWRFbGVtZW50LnByb2plY3RBcyAhPSAnJyA/XG4gICAgICAgIENzc1NlbGVjdG9yLnBhcnNlKHByZXBhcnNlZEVsZW1lbnQucHJvamVjdEFzKVswXSA6XG4gICAgICAgIGVsZW1lbnRDc3NTZWxlY3RvcjtcbiAgICBjb25zdCBuZ0NvbnRlbnRJbmRleCA9IHBhcmVudC5maW5kTmdDb250ZW50SW5kZXgocHJvamVjdGlvblNlbGVjdG9yKSAhO1xuICAgIGxldCBwYXJzZWRFbGVtZW50OiB0LlRlbXBsYXRlQXN0O1xuXG4gICAgaWYgKHByZXBhcnNlZEVsZW1lbnQudHlwZSA9PT0gUHJlcGFyc2VkRWxlbWVudFR5cGUuTkdfQ09OVEVOVCkge1xuICAgICAgLy8gYDxuZy1jb250ZW50PmAgZWxlbWVudFxuICAgICAgaWYgKGVsZW1lbnQuY2hpbGRyZW4gJiYgIWVsZW1lbnQuY2hpbGRyZW4uZXZlcnkoX2lzRW1wdHlUZXh0Tm9kZSkpIHtcbiAgICAgICAgdGhpcy5fcmVwb3J0RXJyb3IoYDxuZy1jb250ZW50PiBlbGVtZW50IGNhbm5vdCBoYXZlIGNvbnRlbnQuYCwgZWxlbWVudC5zb3VyY2VTcGFuICEpO1xuICAgICAgfVxuXG4gICAgICBwYXJzZWRFbGVtZW50ID0gbmV3IHQuTmdDb250ZW50QXN0KFxuICAgICAgICAgIHRoaXMubmdDb250ZW50Q291bnQrKywgaGFzSW5saW5lVGVtcGxhdGVzID8gbnVsbCAhIDogbmdDb250ZW50SW5kZXgsXG4gICAgICAgICAgZWxlbWVudC5zb3VyY2VTcGFuICEpO1xuICAgIH0gZWxzZSBpZiAoaXNUZW1wbGF0ZUVsZW1lbnQpIHtcbiAgICAgIC8vIGA8bmctdGVtcGxhdGU+YCBlbGVtZW50XG4gICAgICB0aGlzLl9hc3NlcnRBbGxFdmVudHNQdWJsaXNoZWRCeURpcmVjdGl2ZXMoZGlyZWN0aXZlQXN0cywgZXZlbnRzKTtcbiAgICAgIHRoaXMuX2Fzc2VydE5vQ29tcG9uZW50c05vckVsZW1lbnRCaW5kaW5nc09uVGVtcGxhdGUoXG4gICAgICAgICAgZGlyZWN0aXZlQXN0cywgZWxlbWVudFByb3BzLCBlbGVtZW50LnNvdXJjZVNwYW4gISk7XG5cbiAgICAgIHBhcnNlZEVsZW1lbnQgPSBuZXcgdC5FbWJlZGRlZFRlbXBsYXRlQXN0KFxuICAgICAgICAgIGF0dHJzLCBldmVudHMsIHJlZmVyZW5jZXMsIGVsZW1lbnRWYXJzLCBwcm92aWRlckNvbnRleHQudHJhbnNmb3JtZWREaXJlY3RpdmVBc3RzLFxuICAgICAgICAgIHByb3ZpZGVyQ29udGV4dC50cmFuc2Zvcm1Qcm92aWRlcnMsIHByb3ZpZGVyQ29udGV4dC50cmFuc2Zvcm1lZEhhc1ZpZXdDb250YWluZXIsXG4gICAgICAgICAgcHJvdmlkZXJDb250ZXh0LnF1ZXJ5TWF0Y2hlcywgY2hpbGRyZW4sIGhhc0lubGluZVRlbXBsYXRlcyA/IG51bGwgISA6IG5nQ29udGVudEluZGV4LFxuICAgICAgICAgIGVsZW1lbnQuc291cmNlU3BhbiAhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gZWxlbWVudCBvdGhlciB0aGFuIGA8bmctY29udGVudD5gIGFuZCBgPG5nLXRlbXBsYXRlPmBcbiAgICAgIHRoaXMuX2Fzc2VydEVsZW1lbnRFeGlzdHMobWF0Y2hFbGVtZW50LCBlbGVtZW50KTtcbiAgICAgIHRoaXMuX2Fzc2VydE9ubHlPbmVDb21wb25lbnQoZGlyZWN0aXZlQXN0cywgZWxlbWVudC5zb3VyY2VTcGFuICEpO1xuXG4gICAgICBjb25zdCBuZ0NvbnRlbnRJbmRleCA9XG4gICAgICAgICAgaGFzSW5saW5lVGVtcGxhdGVzID8gbnVsbCA6IHBhcmVudC5maW5kTmdDb250ZW50SW5kZXgocHJvamVjdGlvblNlbGVjdG9yKTtcbiAgICAgIHBhcnNlZEVsZW1lbnQgPSBuZXcgdC5FbGVtZW50QXN0KFxuICAgICAgICAgIGVsTmFtZSwgYXR0cnMsIGVsZW1lbnRQcm9wcywgZXZlbnRzLCByZWZlcmVuY2VzLCBwcm92aWRlckNvbnRleHQudHJhbnNmb3JtZWREaXJlY3RpdmVBc3RzLFxuICAgICAgICAgIHByb3ZpZGVyQ29udGV4dC50cmFuc2Zvcm1Qcm92aWRlcnMsIHByb3ZpZGVyQ29udGV4dC50cmFuc2Zvcm1lZEhhc1ZpZXdDb250YWluZXIsXG4gICAgICAgICAgcHJvdmlkZXJDb250ZXh0LnF1ZXJ5TWF0Y2hlcywgY2hpbGRyZW4sIGhhc0lubGluZVRlbXBsYXRlcyA/IG51bGwgOiBuZ0NvbnRlbnRJbmRleCxcbiAgICAgICAgICBlbGVtZW50LnNvdXJjZVNwYW4sIGVsZW1lbnQuZW5kU291cmNlU3BhbiB8fCBudWxsKTtcbiAgICB9XG5cbiAgICBpZiAoaGFzSW5saW5lVGVtcGxhdGVzKSB7XG4gICAgICAvLyBUaGUgZWxlbWVudCBhcyBhICotYXR0cmlidXRlXG4gICAgICBjb25zdCB0ZW1wbGF0ZVF1ZXJ5U3RhcnRJbmRleCA9IHRoaXMuY29udGVudFF1ZXJ5U3RhcnRJZDtcbiAgICAgIGNvbnN0IHRlbXBsYXRlU2VsZWN0b3IgPSBjcmVhdGVFbGVtZW50Q3NzU2VsZWN0b3IoJ25nLXRlbXBsYXRlJywgdGVtcGxhdGVNYXRjaGFibGVBdHRycyk7XG4gICAgICBjb25zdCB7ZGlyZWN0aXZlc30gPSB0aGlzLl9wYXJzZURpcmVjdGl2ZXModGhpcy5zZWxlY3Rvck1hdGNoZXIsIHRlbXBsYXRlU2VsZWN0b3IpO1xuICAgICAgY29uc3QgdGVtcGxhdGVCb3VuZERpcmVjdGl2ZVByb3BOYW1lcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgICAgY29uc3QgdGVtcGxhdGVEaXJlY3RpdmVBc3RzID0gdGhpcy5fY3JlYXRlRGlyZWN0aXZlQXN0cyhcbiAgICAgICAgICB0cnVlLCBlbE5hbWUsIGRpcmVjdGl2ZXMsIHRlbXBsYXRlRWxlbWVudE9yRGlyZWN0aXZlUHJvcHMsIFtdLCBlbGVtZW50LnNvdXJjZVNwYW4gISwgW10sXG4gICAgICAgICAgdGVtcGxhdGVCb3VuZERpcmVjdGl2ZVByb3BOYW1lcyk7XG4gICAgICBjb25zdCB0ZW1wbGF0ZUVsZW1lbnRQcm9wczogdC5Cb3VuZEVsZW1lbnRQcm9wZXJ0eUFzdFtdID0gdGhpcy5fY3JlYXRlRWxlbWVudFByb3BlcnR5QXN0cyhcbiAgICAgICAgICBlbE5hbWUsIHRlbXBsYXRlRWxlbWVudE9yRGlyZWN0aXZlUHJvcHMsIHRlbXBsYXRlQm91bmREaXJlY3RpdmVQcm9wTmFtZXMpO1xuICAgICAgdGhpcy5fYXNzZXJ0Tm9Db21wb25lbnRzTm9yRWxlbWVudEJpbmRpbmdzT25UZW1wbGF0ZShcbiAgICAgICAgICB0ZW1wbGF0ZURpcmVjdGl2ZUFzdHMsIHRlbXBsYXRlRWxlbWVudFByb3BzLCBlbGVtZW50LnNvdXJjZVNwYW4gISk7XG4gICAgICBjb25zdCB0ZW1wbGF0ZVByb3ZpZGVyQ29udGV4dCA9IG5ldyBQcm92aWRlckVsZW1lbnRDb250ZXh0KFxuICAgICAgICAgIHRoaXMucHJvdmlkZXJWaWV3Q29udGV4dCwgcGFyZW50LnByb3ZpZGVyQ29udGV4dCAhLCBwYXJlbnQuaXNUZW1wbGF0ZUVsZW1lbnQsXG4gICAgICAgICAgdGVtcGxhdGVEaXJlY3RpdmVBc3RzLCBbXSwgW10sIHRydWUsIHRlbXBsYXRlUXVlcnlTdGFydEluZGV4LCBlbGVtZW50LnNvdXJjZVNwYW4gISk7XG4gICAgICB0ZW1wbGF0ZVByb3ZpZGVyQ29udGV4dC5hZnRlckVsZW1lbnQoKTtcblxuICAgICAgcGFyc2VkRWxlbWVudCA9IG5ldyB0LkVtYmVkZGVkVGVtcGxhdGVBc3QoXG4gICAgICAgICAgW10sIFtdLCBbXSwgdGVtcGxhdGVFbGVtZW50VmFycywgdGVtcGxhdGVQcm92aWRlckNvbnRleHQudHJhbnNmb3JtZWREaXJlY3RpdmVBc3RzLFxuICAgICAgICAgIHRlbXBsYXRlUHJvdmlkZXJDb250ZXh0LnRyYW5zZm9ybVByb3ZpZGVycyxcbiAgICAgICAgICB0ZW1wbGF0ZVByb3ZpZGVyQ29udGV4dC50cmFuc2Zvcm1lZEhhc1ZpZXdDb250YWluZXIsIHRlbXBsYXRlUHJvdmlkZXJDb250ZXh0LnF1ZXJ5TWF0Y2hlcyxcbiAgICAgICAgICBbcGFyc2VkRWxlbWVudF0sIG5nQ29udGVudEluZGV4LCBlbGVtZW50LnNvdXJjZVNwYW4gISk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcnNlZEVsZW1lbnQ7XG4gIH1cblxuICBwcml2YXRlIF9wYXJzZUF0dHIoXG4gICAgICBpc1RlbXBsYXRlRWxlbWVudDogYm9vbGVhbiwgYXR0cjogaHRtbC5BdHRyaWJ1dGUsIHRhcmdldE1hdGNoYWJsZUF0dHJzOiBzdHJpbmdbXVtdLFxuICAgICAgdGFyZ2V0UHJvcHM6IFBhcnNlZFByb3BlcnR5W10sIHRhcmdldEV2ZW50czogdC5Cb3VuZEV2ZW50QXN0W10sXG4gICAgICB0YXJnZXRSZWZzOiBFbGVtZW50T3JEaXJlY3RpdmVSZWZbXSwgdGFyZ2V0VmFyczogdC5WYXJpYWJsZUFzdFtdKTogYm9vbGVhbiB7XG4gICAgY29uc3QgbmFtZSA9IHRoaXMuX25vcm1hbGl6ZUF0dHJpYnV0ZU5hbWUoYXR0ci5uYW1lKTtcbiAgICBjb25zdCB2YWx1ZSA9IGF0dHIudmFsdWU7XG4gICAgY29uc3Qgc3JjU3BhbiA9IGF0dHIuc291cmNlU3BhbjtcblxuICAgIGNvbnN0IGJvdW5kRXZlbnRzOiBQYXJzZWRFdmVudFtdID0gW107XG4gICAgY29uc3QgYmluZFBhcnRzID0gbmFtZS5tYXRjaChCSU5EX05BTUVfUkVHRVhQKTtcbiAgICBsZXQgaGFzQmluZGluZyA9IGZhbHNlO1xuXG4gICAgaWYgKGJpbmRQYXJ0cyAhPT0gbnVsbCkge1xuICAgICAgaGFzQmluZGluZyA9IHRydWU7XG4gICAgICBpZiAoYmluZFBhcnRzW0tXX0JJTkRfSURYXSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuX2JpbmRpbmdQYXJzZXIucGFyc2VQcm9wZXJ0eUJpbmRpbmcoXG4gICAgICAgICAgICBiaW5kUGFydHNbSURFTlRfS1dfSURYXSwgdmFsdWUsIGZhbHNlLCBzcmNTcGFuLCB0YXJnZXRNYXRjaGFibGVBdHRycywgdGFyZ2V0UHJvcHMpO1xuXG4gICAgICB9IGVsc2UgaWYgKGJpbmRQYXJ0c1tLV19MRVRfSURYXSkge1xuICAgICAgICBpZiAoaXNUZW1wbGF0ZUVsZW1lbnQpIHtcbiAgICAgICAgICBjb25zdCBpZGVudGlmaWVyID0gYmluZFBhcnRzW0lERU5UX0tXX0lEWF07XG4gICAgICAgICAgdGhpcy5fcGFyc2VWYXJpYWJsZShpZGVudGlmaWVyLCB2YWx1ZSwgc3JjU3BhbiwgdGFyZ2V0VmFycyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fcmVwb3J0RXJyb3IoYFwibGV0LVwiIGlzIG9ubHkgc3VwcG9ydGVkIG9uIG5nLXRlbXBsYXRlIGVsZW1lbnRzLmAsIHNyY1NwYW4pO1xuICAgICAgICB9XG5cbiAgICAgIH0gZWxzZSBpZiAoYmluZFBhcnRzW0tXX1JFRl9JRFhdKSB7XG4gICAgICAgIGNvbnN0IGlkZW50aWZpZXIgPSBiaW5kUGFydHNbSURFTlRfS1dfSURYXTtcbiAgICAgICAgdGhpcy5fcGFyc2VSZWZlcmVuY2UoaWRlbnRpZmllciwgdmFsdWUsIHNyY1NwYW4sIHRhcmdldFJlZnMpO1xuXG4gICAgICB9IGVsc2UgaWYgKGJpbmRQYXJ0c1tLV19PTl9JRFhdKSB7XG4gICAgICAgIHRoaXMuX2JpbmRpbmdQYXJzZXIucGFyc2VFdmVudChcbiAgICAgICAgICAgIGJpbmRQYXJ0c1tJREVOVF9LV19JRFhdLCB2YWx1ZSwgc3JjU3BhbiwgYXR0ci52YWx1ZVNwYW4gfHwgc3JjU3BhbixcbiAgICAgICAgICAgIHRhcmdldE1hdGNoYWJsZUF0dHJzLCBib3VuZEV2ZW50cyk7XG5cbiAgICAgIH0gZWxzZSBpZiAoYmluZFBhcnRzW0tXX0JJTkRPTl9JRFhdKSB7XG4gICAgICAgIHRoaXMuX2JpbmRpbmdQYXJzZXIucGFyc2VQcm9wZXJ0eUJpbmRpbmcoXG4gICAgICAgICAgICBiaW5kUGFydHNbSURFTlRfS1dfSURYXSwgdmFsdWUsIGZhbHNlLCBzcmNTcGFuLCB0YXJnZXRNYXRjaGFibGVBdHRycywgdGFyZ2V0UHJvcHMpO1xuICAgICAgICB0aGlzLl9wYXJzZUFzc2lnbm1lbnRFdmVudChcbiAgICAgICAgICAgIGJpbmRQYXJ0c1tJREVOVF9LV19JRFhdLCB2YWx1ZSwgc3JjU3BhbiwgYXR0ci52YWx1ZVNwYW4gfHwgc3JjU3BhbixcbiAgICAgICAgICAgIHRhcmdldE1hdGNoYWJsZUF0dHJzLCBib3VuZEV2ZW50cyk7XG5cbiAgICAgIH0gZWxzZSBpZiAoYmluZFBhcnRzW0tXX0FUX0lEWF0pIHtcbiAgICAgICAgdGhpcy5fYmluZGluZ1BhcnNlci5wYXJzZUxpdGVyYWxBdHRyKFxuICAgICAgICAgICAgbmFtZSwgdmFsdWUsIHNyY1NwYW4sIHRhcmdldE1hdGNoYWJsZUF0dHJzLCB0YXJnZXRQcm9wcyk7XG5cbiAgICAgIH0gZWxzZSBpZiAoYmluZFBhcnRzW0lERU5UX0JBTkFOQV9CT1hfSURYXSkge1xuICAgICAgICB0aGlzLl9iaW5kaW5nUGFyc2VyLnBhcnNlUHJvcGVydHlCaW5kaW5nKFxuICAgICAgICAgICAgYmluZFBhcnRzW0lERU5UX0JBTkFOQV9CT1hfSURYXSwgdmFsdWUsIGZhbHNlLCBzcmNTcGFuLCB0YXJnZXRNYXRjaGFibGVBdHRycyxcbiAgICAgICAgICAgIHRhcmdldFByb3BzKTtcbiAgICAgICAgdGhpcy5fcGFyc2VBc3NpZ25tZW50RXZlbnQoXG4gICAgICAgICAgICBiaW5kUGFydHNbSURFTlRfQkFOQU5BX0JPWF9JRFhdLCB2YWx1ZSwgc3JjU3BhbiwgYXR0ci52YWx1ZVNwYW4gfHwgc3JjU3BhbixcbiAgICAgICAgICAgIHRhcmdldE1hdGNoYWJsZUF0dHJzLCBib3VuZEV2ZW50cyk7XG5cbiAgICAgIH0gZWxzZSBpZiAoYmluZFBhcnRzW0lERU5UX1BST1BFUlRZX0lEWF0pIHtcbiAgICAgICAgdGhpcy5fYmluZGluZ1BhcnNlci5wYXJzZVByb3BlcnR5QmluZGluZyhcbiAgICAgICAgICAgIGJpbmRQYXJ0c1tJREVOVF9QUk9QRVJUWV9JRFhdLCB2YWx1ZSwgZmFsc2UsIHNyY1NwYW4sIHRhcmdldE1hdGNoYWJsZUF0dHJzLFxuICAgICAgICAgICAgdGFyZ2V0UHJvcHMpO1xuXG4gICAgICB9IGVsc2UgaWYgKGJpbmRQYXJ0c1tJREVOVF9FVkVOVF9JRFhdKSB7XG4gICAgICAgIHRoaXMuX2JpbmRpbmdQYXJzZXIucGFyc2VFdmVudChcbiAgICAgICAgICAgIGJpbmRQYXJ0c1tJREVOVF9FVkVOVF9JRFhdLCB2YWx1ZSwgc3JjU3BhbiwgYXR0ci52YWx1ZVNwYW4gfHwgc3JjU3BhbixcbiAgICAgICAgICAgIHRhcmdldE1hdGNoYWJsZUF0dHJzLCBib3VuZEV2ZW50cyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGhhc0JpbmRpbmcgPSB0aGlzLl9iaW5kaW5nUGFyc2VyLnBhcnNlUHJvcGVydHlJbnRlcnBvbGF0aW9uKFxuICAgICAgICAgIG5hbWUsIHZhbHVlLCBzcmNTcGFuLCB0YXJnZXRNYXRjaGFibGVBdHRycywgdGFyZ2V0UHJvcHMpO1xuICAgIH1cblxuICAgIGlmICghaGFzQmluZGluZykge1xuICAgICAgdGhpcy5fYmluZGluZ1BhcnNlci5wYXJzZUxpdGVyYWxBdHRyKG5hbWUsIHZhbHVlLCBzcmNTcGFuLCB0YXJnZXRNYXRjaGFibGVBdHRycywgdGFyZ2V0UHJvcHMpO1xuICAgIH1cblxuICAgIHRhcmdldEV2ZW50cy5wdXNoKC4uLmJvdW5kRXZlbnRzLm1hcChlID0+IHQuQm91bmRFdmVudEFzdC5mcm9tUGFyc2VkRXZlbnQoZSkpKTtcblxuICAgIHJldHVybiBoYXNCaW5kaW5nO1xuICB9XG5cbiAgcHJpdmF0ZSBfbm9ybWFsaXplQXR0cmlidXRlTmFtZShhdHRyTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gL15kYXRhLS9pLnRlc3QoYXR0ck5hbWUpID8gYXR0ck5hbWUuc3Vic3RyaW5nKDUpIDogYXR0ck5hbWU7XG4gIH1cblxuICBwcml2YXRlIF9wYXJzZVZhcmlhYmxlKFxuICAgICAgaWRlbnRpZmllcjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW4sIHRhcmdldFZhcnM6IHQuVmFyaWFibGVBc3RbXSkge1xuICAgIGlmIChpZGVudGlmaWVyLmluZGV4T2YoJy0nKSA+IC0xKSB7XG4gICAgICB0aGlzLl9yZXBvcnRFcnJvcihgXCItXCIgaXMgbm90IGFsbG93ZWQgaW4gdmFyaWFibGUgbmFtZXNgLCBzb3VyY2VTcGFuKTtcbiAgICB9XG5cbiAgICB0YXJnZXRWYXJzLnB1c2gobmV3IHQuVmFyaWFibGVBc3QoaWRlbnRpZmllciwgdmFsdWUsIHNvdXJjZVNwYW4pKTtcbiAgfVxuXG4gIHByaXZhdGUgX3BhcnNlUmVmZXJlbmNlKFxuICAgICAgaWRlbnRpZmllcjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW4sXG4gICAgICB0YXJnZXRSZWZzOiBFbGVtZW50T3JEaXJlY3RpdmVSZWZbXSkge1xuICAgIGlmIChpZGVudGlmaWVyLmluZGV4T2YoJy0nKSA+IC0xKSB7XG4gICAgICB0aGlzLl9yZXBvcnRFcnJvcihgXCItXCIgaXMgbm90IGFsbG93ZWQgaW4gcmVmZXJlbmNlIG5hbWVzYCwgc291cmNlU3Bhbik7XG4gICAgfVxuXG4gICAgdGFyZ2V0UmVmcy5wdXNoKG5ldyBFbGVtZW50T3JEaXJlY3RpdmVSZWYoaWRlbnRpZmllciwgdmFsdWUsIHNvdXJjZVNwYW4pKTtcbiAgfVxuXG4gIHByaXZhdGUgX3BhcnNlQXNzaWdubWVudEV2ZW50KFxuICAgICAgbmFtZTogc3RyaW5nLCBleHByZXNzaW9uOiBzdHJpbmcsIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3BhbiwgdmFsdWVTcGFuOiBQYXJzZVNvdXJjZVNwYW4sXG4gICAgICB0YXJnZXRNYXRjaGFibGVBdHRyczogc3RyaW5nW11bXSwgdGFyZ2V0RXZlbnRzOiBQYXJzZWRFdmVudFtdKSB7XG4gICAgdGhpcy5fYmluZGluZ1BhcnNlci5wYXJzZUV2ZW50KFxuICAgICAgICBgJHtuYW1lfUNoYW5nZWAsIGAke2V4cHJlc3Npb259PSRldmVudGAsIHNvdXJjZVNwYW4sIHZhbHVlU3BhbiwgdGFyZ2V0TWF0Y2hhYmxlQXR0cnMsXG4gICAgICAgIHRhcmdldEV2ZW50cyk7XG4gIH1cblxuICBwcml2YXRlIF9wYXJzZURpcmVjdGl2ZXMoc2VsZWN0b3JNYXRjaGVyOiBTZWxlY3Rvck1hdGNoZXIsIGVsZW1lbnRDc3NTZWxlY3RvcjogQ3NzU2VsZWN0b3IpOlxuICAgICAge2RpcmVjdGl2ZXM6IENvbXBpbGVEaXJlY3RpdmVTdW1tYXJ5W10sIG1hdGNoRWxlbWVudDogYm9vbGVhbn0ge1xuICAgIC8vIE5lZWQgdG8gc29ydCB0aGUgZGlyZWN0aXZlcyBzbyB0aGF0IHdlIGdldCBjb25zaXN0ZW50IHJlc3VsdHMgdGhyb3VnaG91dCxcbiAgICAvLyBhcyBzZWxlY3Rvck1hdGNoZXIgdXNlcyBNYXBzIGluc2lkZS5cbiAgICAvLyBBbHNvIGRlZHVwbGljYXRlIGRpcmVjdGl2ZXMgYXMgdGhleSBtaWdodCBtYXRjaCBtb3JlIHRoYW4gb25lIHRpbWUhXG4gICAgY29uc3QgZGlyZWN0aXZlcyA9IG5ldyBBcnJheSh0aGlzLmRpcmVjdGl2ZXNJbmRleC5zaXplKTtcbiAgICAvLyBXaGV0aGVyIGFueSBkaXJlY3RpdmUgc2VsZWN0b3IgbWF0Y2hlcyBvbiB0aGUgZWxlbWVudCBuYW1lXG4gICAgbGV0IG1hdGNoRWxlbWVudCA9IGZhbHNlO1xuXG4gICAgc2VsZWN0b3JNYXRjaGVyLm1hdGNoKGVsZW1lbnRDc3NTZWxlY3RvciwgKHNlbGVjdG9yLCBkaXJlY3RpdmUpID0+IHtcbiAgICAgIGRpcmVjdGl2ZXNbdGhpcy5kaXJlY3RpdmVzSW5kZXguZ2V0KGRpcmVjdGl2ZSkgIV0gPSBkaXJlY3RpdmU7XG4gICAgICBtYXRjaEVsZW1lbnQgPSBtYXRjaEVsZW1lbnQgfHwgc2VsZWN0b3IuaGFzRWxlbWVudFNlbGVjdG9yKCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgZGlyZWN0aXZlczogZGlyZWN0aXZlcy5maWx0ZXIoZGlyID0+ICEhZGlyKSxcbiAgICAgIG1hdGNoRWxlbWVudCxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBfY3JlYXRlRGlyZWN0aXZlQXN0cyhcbiAgICAgIGlzVGVtcGxhdGVFbGVtZW50OiBib29sZWFuLCBlbGVtZW50TmFtZTogc3RyaW5nLCBkaXJlY3RpdmVzOiBDb21waWxlRGlyZWN0aXZlU3VtbWFyeVtdLFxuICAgICAgcHJvcHM6IFBhcnNlZFByb3BlcnR5W10sIGVsZW1lbnRPckRpcmVjdGl2ZVJlZnM6IEVsZW1lbnRPckRpcmVjdGl2ZVJlZltdLFxuICAgICAgZWxlbWVudFNvdXJjZVNwYW46IFBhcnNlU291cmNlU3BhbiwgdGFyZ2V0UmVmZXJlbmNlczogdC5SZWZlcmVuY2VBc3RbXSxcbiAgICAgIHRhcmdldEJvdW5kRGlyZWN0aXZlUHJvcE5hbWVzOiBTZXQ8c3RyaW5nPik6IHQuRGlyZWN0aXZlQXN0W10ge1xuICAgIGNvbnN0IG1hdGNoZWRSZWZlcmVuY2VzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgbGV0IGNvbXBvbmVudDogQ29tcGlsZURpcmVjdGl2ZVN1bW1hcnkgPSBudWxsICE7XG5cbiAgICBjb25zdCBkaXJlY3RpdmVBc3RzID0gZGlyZWN0aXZlcy5tYXAoKGRpcmVjdGl2ZSkgPT4ge1xuICAgICAgY29uc3Qgc291cmNlU3BhbiA9IG5ldyBQYXJzZVNvdXJjZVNwYW4oXG4gICAgICAgICAgZWxlbWVudFNvdXJjZVNwYW4uc3RhcnQsIGVsZW1lbnRTb3VyY2VTcGFuLmVuZCxcbiAgICAgICAgICBgRGlyZWN0aXZlICR7aWRlbnRpZmllck5hbWUoZGlyZWN0aXZlLnR5cGUpfWApO1xuXG4gICAgICBpZiAoZGlyZWN0aXZlLmlzQ29tcG9uZW50KSB7XG4gICAgICAgIGNvbXBvbmVudCA9IGRpcmVjdGl2ZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGRpcmVjdGl2ZVByb3BlcnRpZXM6IHQuQm91bmREaXJlY3RpdmVQcm9wZXJ0eUFzdFtdID0gW107XG4gICAgICBjb25zdCBib3VuZFByb3BlcnRpZXMgPVxuICAgICAgICAgIHRoaXMuX2JpbmRpbmdQYXJzZXIuY3JlYXRlRGlyZWN0aXZlSG9zdFByb3BlcnR5QXN0cyhkaXJlY3RpdmUsIGVsZW1lbnROYW1lLCBzb3VyY2VTcGFuKSAhO1xuXG4gICAgICBsZXQgaG9zdFByb3BlcnRpZXMgPVxuICAgICAgICAgIGJvdW5kUHJvcGVydGllcy5tYXAocHJvcCA9PiB0LkJvdW5kRWxlbWVudFByb3BlcnR5QXN0LmZyb21Cb3VuZFByb3BlcnR5KHByb3ApKTtcbiAgICAgIC8vIE5vdGU6IFdlIG5lZWQgdG8gY2hlY2sgdGhlIGhvc3QgcHJvcGVydGllcyBoZXJlIGFzIHdlbGwsXG4gICAgICAvLyBhcyB3ZSBkb24ndCBrbm93IHRoZSBlbGVtZW50IG5hbWUgaW4gdGhlIERpcmVjdGl2ZVdyYXBwZXJDb21waWxlciB5ZXQuXG4gICAgICBob3N0UHJvcGVydGllcyA9IHRoaXMuX2NoZWNrUHJvcGVydGllc0luU2NoZW1hKGVsZW1lbnROYW1lLCBob3N0UHJvcGVydGllcyk7XG4gICAgICBjb25zdCBwYXJzZWRFdmVudHMgPVxuICAgICAgICAgIHRoaXMuX2JpbmRpbmdQYXJzZXIuY3JlYXRlRGlyZWN0aXZlSG9zdEV2ZW50QXN0cyhkaXJlY3RpdmUsIHNvdXJjZVNwYW4pICE7XG4gICAgICB0aGlzLl9jcmVhdGVEaXJlY3RpdmVQcm9wZXJ0eUFzdHMoXG4gICAgICAgICAgZGlyZWN0aXZlLmlucHV0cywgcHJvcHMsIGRpcmVjdGl2ZVByb3BlcnRpZXMsIHRhcmdldEJvdW5kRGlyZWN0aXZlUHJvcE5hbWVzKTtcbiAgICAgIGVsZW1lbnRPckRpcmVjdGl2ZVJlZnMuZm9yRWFjaCgoZWxPckRpclJlZikgPT4ge1xuICAgICAgICBpZiAoKGVsT3JEaXJSZWYudmFsdWUubGVuZ3RoID09PSAwICYmIGRpcmVjdGl2ZS5pc0NvbXBvbmVudCkgfHxcbiAgICAgICAgICAgIChlbE9yRGlyUmVmLmlzUmVmZXJlbmNlVG9EaXJlY3RpdmUoZGlyZWN0aXZlKSkpIHtcbiAgICAgICAgICB0YXJnZXRSZWZlcmVuY2VzLnB1c2gobmV3IHQuUmVmZXJlbmNlQXN0KFxuICAgICAgICAgICAgICBlbE9yRGlyUmVmLm5hbWUsIGNyZWF0ZVRva2VuRm9yUmVmZXJlbmNlKGRpcmVjdGl2ZS50eXBlLnJlZmVyZW5jZSksIGVsT3JEaXJSZWYudmFsdWUsXG4gICAgICAgICAgICAgIGVsT3JEaXJSZWYuc291cmNlU3BhbikpO1xuICAgICAgICAgIG1hdGNoZWRSZWZlcmVuY2VzLmFkZChlbE9yRGlyUmVmLm5hbWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGhvc3RFdmVudHMgPSBwYXJzZWRFdmVudHMubWFwKGUgPT4gdC5Cb3VuZEV2ZW50QXN0LmZyb21QYXJzZWRFdmVudChlKSk7XG4gICAgICBjb25zdCBjb250ZW50UXVlcnlTdGFydElkID0gdGhpcy5jb250ZW50UXVlcnlTdGFydElkO1xuICAgICAgdGhpcy5jb250ZW50UXVlcnlTdGFydElkICs9IGRpcmVjdGl2ZS5xdWVyaWVzLmxlbmd0aDtcbiAgICAgIHJldHVybiBuZXcgdC5EaXJlY3RpdmVBc3QoXG4gICAgICAgICAgZGlyZWN0aXZlLCBkaXJlY3RpdmVQcm9wZXJ0aWVzLCBob3N0UHJvcGVydGllcywgaG9zdEV2ZW50cywgY29udGVudFF1ZXJ5U3RhcnRJZCxcbiAgICAgICAgICBzb3VyY2VTcGFuKTtcbiAgICB9KTtcblxuICAgIGVsZW1lbnRPckRpcmVjdGl2ZVJlZnMuZm9yRWFjaCgoZWxPckRpclJlZikgPT4ge1xuICAgICAgaWYgKGVsT3JEaXJSZWYudmFsdWUubGVuZ3RoID4gMCkge1xuICAgICAgICBpZiAoIW1hdGNoZWRSZWZlcmVuY2VzLmhhcyhlbE9yRGlyUmVmLm5hbWUpKSB7XG4gICAgICAgICAgdGhpcy5fcmVwb3J0RXJyb3IoXG4gICAgICAgICAgICAgIGBUaGVyZSBpcyBubyBkaXJlY3RpdmUgd2l0aCBcImV4cG9ydEFzXCIgc2V0IHRvIFwiJHtlbE9yRGlyUmVmLnZhbHVlfVwiYCxcbiAgICAgICAgICAgICAgZWxPckRpclJlZi5zb3VyY2VTcGFuKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICghY29tcG9uZW50KSB7XG4gICAgICAgIGxldCByZWZUb2tlbjogQ29tcGlsZVRva2VuTWV0YWRhdGEgPSBudWxsICE7XG4gICAgICAgIGlmIChpc1RlbXBsYXRlRWxlbWVudCkge1xuICAgICAgICAgIHJlZlRva2VuID0gY3JlYXRlVG9rZW5Gb3JFeHRlcm5hbFJlZmVyZW5jZSh0aGlzLnJlZmxlY3RvciwgSWRlbnRpZmllcnMuVGVtcGxhdGVSZWYpO1xuICAgICAgICB9XG4gICAgICAgIHRhcmdldFJlZmVyZW5jZXMucHVzaChcbiAgICAgICAgICAgIG5ldyB0LlJlZmVyZW5jZUFzdChlbE9yRGlyUmVmLm5hbWUsIHJlZlRva2VuLCBlbE9yRGlyUmVmLnZhbHVlLCBlbE9yRGlyUmVmLnNvdXJjZVNwYW4pKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZGlyZWN0aXZlQXN0cztcbiAgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZURpcmVjdGl2ZVByb3BlcnR5QXN0cyhcbiAgICAgIGRpcmVjdGl2ZVByb3BlcnRpZXM6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9LCBib3VuZFByb3BzOiBQYXJzZWRQcm9wZXJ0eVtdLFxuICAgICAgdGFyZ2V0Qm91bmREaXJlY3RpdmVQcm9wczogdC5Cb3VuZERpcmVjdGl2ZVByb3BlcnR5QXN0W10sXG4gICAgICB0YXJnZXRCb3VuZERpcmVjdGl2ZVByb3BOYW1lczogU2V0PHN0cmluZz4pIHtcbiAgICBpZiAoZGlyZWN0aXZlUHJvcGVydGllcykge1xuICAgICAgY29uc3QgYm91bmRQcm9wc0J5TmFtZSA9IG5ldyBNYXA8c3RyaW5nLCBQYXJzZWRQcm9wZXJ0eT4oKTtcbiAgICAgIGJvdW5kUHJvcHMuZm9yRWFjaChib3VuZFByb3AgPT4ge1xuICAgICAgICBjb25zdCBwcmV2VmFsdWUgPSBib3VuZFByb3BzQnlOYW1lLmdldChib3VuZFByb3AubmFtZSk7XG4gICAgICAgIGlmICghcHJldlZhbHVlIHx8IHByZXZWYWx1ZS5pc0xpdGVyYWwpIHtcbiAgICAgICAgICAvLyBnaXZlIFthXT1cImJcIiBhIGhpZ2hlciBwcmVjZWRlbmNlIHRoYW4gYT1cImJcIiBvbiB0aGUgc2FtZSBlbGVtZW50XG4gICAgICAgICAgYm91bmRQcm9wc0J5TmFtZS5zZXQoYm91bmRQcm9wLm5hbWUsIGJvdW5kUHJvcCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBPYmplY3Qua2V5cyhkaXJlY3RpdmVQcm9wZXJ0aWVzKS5mb3JFYWNoKGRpclByb3AgPT4ge1xuICAgICAgICBjb25zdCBlbFByb3AgPSBkaXJlY3RpdmVQcm9wZXJ0aWVzW2RpclByb3BdO1xuICAgICAgICBjb25zdCBib3VuZFByb3AgPSBib3VuZFByb3BzQnlOYW1lLmdldChlbFByb3ApO1xuXG4gICAgICAgIC8vIEJpbmRpbmdzIGFyZSBvcHRpb25hbCwgc28gdGhpcyBiaW5kaW5nIG9ubHkgbmVlZHMgdG8gYmUgc2V0IHVwIGlmIGFuIGV4cHJlc3Npb24gaXMgZ2l2ZW4uXG4gICAgICAgIGlmIChib3VuZFByb3ApIHtcbiAgICAgICAgICB0YXJnZXRCb3VuZERpcmVjdGl2ZVByb3BOYW1lcy5hZGQoYm91bmRQcm9wLm5hbWUpO1xuICAgICAgICAgIGlmICghaXNFbXB0eUV4cHJlc3Npb24oYm91bmRQcm9wLmV4cHJlc3Npb24pKSB7XG4gICAgICAgICAgICB0YXJnZXRCb3VuZERpcmVjdGl2ZVByb3BzLnB1c2gobmV3IHQuQm91bmREaXJlY3RpdmVQcm9wZXJ0eUFzdChcbiAgICAgICAgICAgICAgICBkaXJQcm9wLCBib3VuZFByb3AubmFtZSwgYm91bmRQcm9wLmV4cHJlc3Npb24sIGJvdW5kUHJvcC5zb3VyY2VTcGFuKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9jcmVhdGVFbGVtZW50UHJvcGVydHlBc3RzKFxuICAgICAgZWxlbWVudE5hbWU6IHN0cmluZywgcHJvcHM6IFBhcnNlZFByb3BlcnR5W10sXG4gICAgICBib3VuZERpcmVjdGl2ZVByb3BOYW1lczogU2V0PHN0cmluZz4pOiB0LkJvdW5kRWxlbWVudFByb3BlcnR5QXN0W10ge1xuICAgIGNvbnN0IGJvdW5kRWxlbWVudFByb3BzOiB0LkJvdW5kRWxlbWVudFByb3BlcnR5QXN0W10gPSBbXTtcblxuICAgIHByb3BzLmZvckVhY2goKHByb3A6IFBhcnNlZFByb3BlcnR5KSA9PiB7XG4gICAgICBpZiAoIXByb3AuaXNMaXRlcmFsICYmICFib3VuZERpcmVjdGl2ZVByb3BOYW1lcy5oYXMocHJvcC5uYW1lKSkge1xuICAgICAgICBjb25zdCBib3VuZFByb3AgPSB0aGlzLl9iaW5kaW5nUGFyc2VyLmNyZWF0ZUJvdW5kRWxlbWVudFByb3BlcnR5KGVsZW1lbnROYW1lLCBwcm9wKTtcbiAgICAgICAgYm91bmRFbGVtZW50UHJvcHMucHVzaCh0LkJvdW5kRWxlbWVudFByb3BlcnR5QXN0LmZyb21Cb3VuZFByb3BlcnR5KGJvdW5kUHJvcCkpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLl9jaGVja1Byb3BlcnRpZXNJblNjaGVtYShlbGVtZW50TmFtZSwgYm91bmRFbGVtZW50UHJvcHMpO1xuICB9XG5cbiAgcHJpdmF0ZSBfZmluZENvbXBvbmVudERpcmVjdGl2ZXMoZGlyZWN0aXZlczogdC5EaXJlY3RpdmVBc3RbXSk6IHQuRGlyZWN0aXZlQXN0W10ge1xuICAgIHJldHVybiBkaXJlY3RpdmVzLmZpbHRlcihkaXJlY3RpdmUgPT4gZGlyZWN0aXZlLmRpcmVjdGl2ZS5pc0NvbXBvbmVudCk7XG4gIH1cblxuICBwcml2YXRlIF9maW5kQ29tcG9uZW50RGlyZWN0aXZlTmFtZXMoZGlyZWN0aXZlczogdC5EaXJlY3RpdmVBc3RbXSk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5fZmluZENvbXBvbmVudERpcmVjdGl2ZXMoZGlyZWN0aXZlcylcbiAgICAgICAgLm1hcChkaXJlY3RpdmUgPT4gaWRlbnRpZmllck5hbWUoZGlyZWN0aXZlLmRpcmVjdGl2ZS50eXBlKSAhKTtcbiAgfVxuXG4gIHByaXZhdGUgX2Fzc2VydE9ubHlPbmVDb21wb25lbnQoZGlyZWN0aXZlczogdC5EaXJlY3RpdmVBc3RbXSwgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuKSB7XG4gICAgY29uc3QgY29tcG9uZW50VHlwZU5hbWVzID0gdGhpcy5fZmluZENvbXBvbmVudERpcmVjdGl2ZU5hbWVzKGRpcmVjdGl2ZXMpO1xuICAgIGlmIChjb21wb25lbnRUeXBlTmFtZXMubGVuZ3RoID4gMSkge1xuICAgICAgdGhpcy5fcmVwb3J0RXJyb3IoXG4gICAgICAgICAgYE1vcmUgdGhhbiBvbmUgY29tcG9uZW50IG1hdGNoZWQgb24gdGhpcyBlbGVtZW50LlxcbmAgK1xuICAgICAgICAgICAgICBgTWFrZSBzdXJlIHRoYXQgb25seSBvbmUgY29tcG9uZW50J3Mgc2VsZWN0b3IgY2FuIG1hdGNoIGEgZ2l2ZW4gZWxlbWVudC5cXG5gICtcbiAgICAgICAgICAgICAgYENvbmZsaWN0aW5nIGNvbXBvbmVudHM6ICR7Y29tcG9uZW50VHlwZU5hbWVzLmpvaW4oJywnKX1gLFxuICAgICAgICAgIHNvdXJjZVNwYW4pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlIHN1cmUgdGhhdCBub24tYW5ndWxhciB0YWdzIGNvbmZvcm0gdG8gdGhlIHNjaGVtYXMuXG4gICAqXG4gICAqIE5vdGU6IEFuIGVsZW1lbnQgaXMgY29uc2lkZXJlZCBhbiBhbmd1bGFyIHRhZyB3aGVuIGF0IGxlYXN0IG9uZSBkaXJlY3RpdmUgc2VsZWN0b3IgbWF0Y2hlcyB0aGVcbiAgICogdGFnIG5hbWUuXG4gICAqXG4gICAqIEBwYXJhbSBtYXRjaEVsZW1lbnQgV2hldGhlciBhbnkgZGlyZWN0aXZlIGhhcyBtYXRjaGVkIG9uIHRoZSB0YWcgbmFtZVxuICAgKiBAcGFyYW0gZWxlbWVudCB0aGUgaHRtbCBlbGVtZW50XG4gICAqL1xuICBwcml2YXRlIF9hc3NlcnRFbGVtZW50RXhpc3RzKG1hdGNoRWxlbWVudDogYm9vbGVhbiwgZWxlbWVudDogaHRtbC5FbGVtZW50KSB7XG4gICAgY29uc3QgZWxOYW1lID0gZWxlbWVudC5uYW1lLnJlcGxhY2UoL146eGh0bWw6LywgJycpO1xuXG4gICAgaWYgKCFtYXRjaEVsZW1lbnQgJiYgIXRoaXMuX3NjaGVtYVJlZ2lzdHJ5Lmhhc0VsZW1lbnQoZWxOYW1lLCB0aGlzLl9zY2hlbWFzKSkge1xuICAgICAgbGV0IGVycm9yTXNnID0gYCcke2VsTmFtZX0nIGlzIG5vdCBhIGtub3duIGVsZW1lbnQ6XFxuYDtcbiAgICAgIGVycm9yTXNnICs9XG4gICAgICAgICAgYDEuIElmICcke2VsTmFtZX0nIGlzIGFuIEFuZ3VsYXIgY29tcG9uZW50LCB0aGVuIHZlcmlmeSB0aGF0IGl0IGlzIHBhcnQgb2YgdGhpcyBtb2R1bGUuXFxuYDtcbiAgICAgIGlmIChlbE5hbWUuaW5kZXhPZignLScpID4gLTEpIHtcbiAgICAgICAgZXJyb3JNc2cgKz1cbiAgICAgICAgICAgIGAyLiBJZiAnJHtlbE5hbWV9JyBpcyBhIFdlYiBDb21wb25lbnQgdGhlbiBhZGQgJ0NVU1RPTV9FTEVNRU5UU19TQ0hFTUEnIHRvIHRoZSAnQE5nTW9kdWxlLnNjaGVtYXMnIG9mIHRoaXMgY29tcG9uZW50IHRvIHN1cHByZXNzIHRoaXMgbWVzc2FnZS5gO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZXJyb3JNc2cgKz1cbiAgICAgICAgICAgIGAyLiBUbyBhbGxvdyBhbnkgZWxlbWVudCBhZGQgJ05PX0VSUk9SU19TQ0hFTUEnIHRvIHRoZSAnQE5nTW9kdWxlLnNjaGVtYXMnIG9mIHRoaXMgY29tcG9uZW50LmA7XG4gICAgICB9XG4gICAgICB0aGlzLl9yZXBvcnRFcnJvcihlcnJvck1zZywgZWxlbWVudC5zb3VyY2VTcGFuICEpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2Fzc2VydE5vQ29tcG9uZW50c05vckVsZW1lbnRCaW5kaW5nc09uVGVtcGxhdGUoXG4gICAgICBkaXJlY3RpdmVzOiB0LkRpcmVjdGl2ZUFzdFtdLCBlbGVtZW50UHJvcHM6IHQuQm91bmRFbGVtZW50UHJvcGVydHlBc3RbXSxcbiAgICAgIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3Bhbikge1xuICAgIGNvbnN0IGNvbXBvbmVudFR5cGVOYW1lczogc3RyaW5nW10gPSB0aGlzLl9maW5kQ29tcG9uZW50RGlyZWN0aXZlTmFtZXMoZGlyZWN0aXZlcyk7XG4gICAgaWYgKGNvbXBvbmVudFR5cGVOYW1lcy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLl9yZXBvcnRFcnJvcihcbiAgICAgICAgICBgQ29tcG9uZW50cyBvbiBhbiBlbWJlZGRlZCB0ZW1wbGF0ZTogJHtjb21wb25lbnRUeXBlTmFtZXMuam9pbignLCcpfWAsIHNvdXJjZVNwYW4pO1xuICAgIH1cbiAgICBlbGVtZW50UHJvcHMuZm9yRWFjaChwcm9wID0+IHtcbiAgICAgIHRoaXMuX3JlcG9ydEVycm9yKFxuICAgICAgICAgIGBQcm9wZXJ0eSBiaW5kaW5nICR7cHJvcC5uYW1lfSBub3QgdXNlZCBieSBhbnkgZGlyZWN0aXZlIG9uIGFuIGVtYmVkZGVkIHRlbXBsYXRlLiBNYWtlIHN1cmUgdGhhdCB0aGUgcHJvcGVydHkgbmFtZSBpcyBzcGVsbGVkIGNvcnJlY3RseSBhbmQgYWxsIGRpcmVjdGl2ZXMgYXJlIGxpc3RlZCBpbiB0aGUgXCJATmdNb2R1bGUuZGVjbGFyYXRpb25zXCIuYCxcbiAgICAgICAgICBzb3VyY2VTcGFuKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2Fzc2VydEFsbEV2ZW50c1B1Ymxpc2hlZEJ5RGlyZWN0aXZlcyhcbiAgICAgIGRpcmVjdGl2ZXM6IHQuRGlyZWN0aXZlQXN0W10sIGV2ZW50czogdC5Cb3VuZEV2ZW50QXN0W10pIHtcbiAgICBjb25zdCBhbGxEaXJlY3RpdmVFdmVudHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcblxuICAgIGRpcmVjdGl2ZXMuZm9yRWFjaChkaXJlY3RpdmUgPT4ge1xuICAgICAgT2JqZWN0LmtleXMoZGlyZWN0aXZlLmRpcmVjdGl2ZS5vdXRwdXRzKS5mb3JFYWNoKGsgPT4ge1xuICAgICAgICBjb25zdCBldmVudE5hbWUgPSBkaXJlY3RpdmUuZGlyZWN0aXZlLm91dHB1dHNba107XG4gICAgICAgIGFsbERpcmVjdGl2ZUV2ZW50cy5hZGQoZXZlbnROYW1lKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZXZlbnRzLmZvckVhY2goZXZlbnQgPT4ge1xuICAgICAgaWYgKGV2ZW50LnRhcmdldCAhPSBudWxsIHx8ICFhbGxEaXJlY3RpdmVFdmVudHMuaGFzKGV2ZW50Lm5hbWUpKSB7XG4gICAgICAgIHRoaXMuX3JlcG9ydEVycm9yKFxuICAgICAgICAgICAgYEV2ZW50IGJpbmRpbmcgJHtldmVudC5mdWxsTmFtZX0gbm90IGVtaXR0ZWQgYnkgYW55IGRpcmVjdGl2ZSBvbiBhbiBlbWJlZGRlZCB0ZW1wbGF0ZS4gTWFrZSBzdXJlIHRoYXQgdGhlIGV2ZW50IG5hbWUgaXMgc3BlbGxlZCBjb3JyZWN0bHkgYW5kIGFsbCBkaXJlY3RpdmVzIGFyZSBsaXN0ZWQgaW4gdGhlIFwiQE5nTW9kdWxlLmRlY2xhcmF0aW9uc1wiLmAsXG4gICAgICAgICAgICBldmVudC5zb3VyY2VTcGFuKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2NoZWNrUHJvcGVydGllc0luU2NoZW1hKGVsZW1lbnROYW1lOiBzdHJpbmcsIGJvdW5kUHJvcHM6IHQuQm91bmRFbGVtZW50UHJvcGVydHlBc3RbXSk6XG4gICAgICB0LkJvdW5kRWxlbWVudFByb3BlcnR5QXN0W10ge1xuICAgIC8vIE5vdGU6IFdlIGNhbid0IGZpbHRlciBvdXQgZW1wdHkgZXhwcmVzc2lvbnMgYmVmb3JlIHRoaXMgbWV0aG9kLFxuICAgIC8vIGFzIHdlIHN0aWxsIHdhbnQgdG8gdmFsaWRhdGUgdGhlbSFcbiAgICByZXR1cm4gYm91bmRQcm9wcy5maWx0ZXIoKGJvdW5kUHJvcCkgPT4ge1xuICAgICAgaWYgKGJvdW5kUHJvcC50eXBlID09PSB0LlByb3BlcnR5QmluZGluZ1R5cGUuUHJvcGVydHkgJiZcbiAgICAgICAgICAhdGhpcy5fc2NoZW1hUmVnaXN0cnkuaGFzUHJvcGVydHkoZWxlbWVudE5hbWUsIGJvdW5kUHJvcC5uYW1lLCB0aGlzLl9zY2hlbWFzKSkge1xuICAgICAgICBsZXQgZXJyb3JNc2cgPVxuICAgICAgICAgICAgYENhbid0IGJpbmQgdG8gJyR7Ym91bmRQcm9wLm5hbWV9JyBzaW5jZSBpdCBpc24ndCBhIGtub3duIHByb3BlcnR5IG9mICcke2VsZW1lbnROYW1lfScuYDtcbiAgICAgICAgaWYgKGVsZW1lbnROYW1lLnN0YXJ0c1dpdGgoJ25nLScpKSB7XG4gICAgICAgICAgZXJyb3JNc2cgKz1cbiAgICAgICAgICAgICAgYFxcbjEuIElmICcke2JvdW5kUHJvcC5uYW1lfScgaXMgYW4gQW5ndWxhciBkaXJlY3RpdmUsIHRoZW4gYWRkICdDb21tb25Nb2R1bGUnIHRvIHRoZSAnQE5nTW9kdWxlLmltcG9ydHMnIG9mIHRoaXMgY29tcG9uZW50LmAgK1xuICAgICAgICAgICAgICBgXFxuMi4gVG8gYWxsb3cgYW55IHByb3BlcnR5IGFkZCAnTk9fRVJST1JTX1NDSEVNQScgdG8gdGhlICdATmdNb2R1bGUuc2NoZW1hcycgb2YgdGhpcyBjb21wb25lbnQuYDtcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50TmFtZS5pbmRleE9mKCctJykgPiAtMSkge1xuICAgICAgICAgIGVycm9yTXNnICs9XG4gICAgICAgICAgICAgIGBcXG4xLiBJZiAnJHtlbGVtZW50TmFtZX0nIGlzIGFuIEFuZ3VsYXIgY29tcG9uZW50IGFuZCBpdCBoYXMgJyR7Ym91bmRQcm9wLm5hbWV9JyBpbnB1dCwgdGhlbiB2ZXJpZnkgdGhhdCBpdCBpcyBwYXJ0IG9mIHRoaXMgbW9kdWxlLmAgK1xuICAgICAgICAgICAgICBgXFxuMi4gSWYgJyR7ZWxlbWVudE5hbWV9JyBpcyBhIFdlYiBDb21wb25lbnQgdGhlbiBhZGQgJ0NVU1RPTV9FTEVNRU5UU19TQ0hFTUEnIHRvIHRoZSAnQE5nTW9kdWxlLnNjaGVtYXMnIG9mIHRoaXMgY29tcG9uZW50IHRvIHN1cHByZXNzIHRoaXMgbWVzc2FnZS5gICtcbiAgICAgICAgICAgICAgYFxcbjMuIFRvIGFsbG93IGFueSBwcm9wZXJ0eSBhZGQgJ05PX0VSUk9SU19TQ0hFTUEnIHRvIHRoZSAnQE5nTW9kdWxlLnNjaGVtYXMnIG9mIHRoaXMgY29tcG9uZW50LmA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcmVwb3J0RXJyb3IoZXJyb3JNc2csIGJvdW5kUHJvcC5zb3VyY2VTcGFuKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAhaXNFbXB0eUV4cHJlc3Npb24oYm91bmRQcm9wLnZhbHVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3JlcG9ydEVycm9yKFxuICAgICAgbWVzc2FnZTogc3RyaW5nLCBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW4sXG4gICAgICBsZXZlbDogUGFyc2VFcnJvckxldmVsID0gUGFyc2VFcnJvckxldmVsLkVSUk9SKSB7XG4gICAgdGhpcy5fdGFyZ2V0RXJyb3JzLnB1c2gobmV3IFBhcnNlRXJyb3Ioc291cmNlU3BhbiwgbWVzc2FnZSwgbGV2ZWwpKTtcbiAgfVxufVxuXG5jbGFzcyBOb25CaW5kYWJsZVZpc2l0b3IgaW1wbGVtZW50cyBodG1sLlZpc2l0b3Ige1xuICB2aXNpdEVsZW1lbnQoYXN0OiBodG1sLkVsZW1lbnQsIHBhcmVudDogRWxlbWVudENvbnRleHQpOiB0LkVsZW1lbnRBc3R8bnVsbCB7XG4gICAgY29uc3QgcHJlcGFyc2VkRWxlbWVudCA9IHByZXBhcnNlRWxlbWVudChhc3QpO1xuICAgIGlmIChwcmVwYXJzZWRFbGVtZW50LnR5cGUgPT09IFByZXBhcnNlZEVsZW1lbnRUeXBlLlNDUklQVCB8fFxuICAgICAgICBwcmVwYXJzZWRFbGVtZW50LnR5cGUgPT09IFByZXBhcnNlZEVsZW1lbnRUeXBlLlNUWUxFIHx8XG4gICAgICAgIHByZXBhcnNlZEVsZW1lbnQudHlwZSA9PT0gUHJlcGFyc2VkRWxlbWVudFR5cGUuU1RZTEVTSEVFVCkge1xuICAgICAgLy8gU2tpcHBpbmcgPHNjcmlwdD4gZm9yIHNlY3VyaXR5IHJlYXNvbnNcbiAgICAgIC8vIFNraXBwaW5nIDxzdHlsZT4gYW5kIHN0eWxlc2hlZXRzIGFzIHdlIGFscmVhZHkgcHJvY2Vzc2VkIHRoZW1cbiAgICAgIC8vIGluIHRoZSBTdHlsZUNvbXBpbGVyXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBhdHRyTmFtZUFuZFZhbHVlcyA9IGFzdC5hdHRycy5tYXAoKGF0dHIpOiBbc3RyaW5nLCBzdHJpbmddID0+IFthdHRyLm5hbWUsIGF0dHIudmFsdWVdKTtcbiAgICBjb25zdCBzZWxlY3RvciA9IGNyZWF0ZUVsZW1lbnRDc3NTZWxlY3Rvcihhc3QubmFtZSwgYXR0ck5hbWVBbmRWYWx1ZXMpO1xuICAgIGNvbnN0IG5nQ29udGVudEluZGV4ID0gcGFyZW50LmZpbmROZ0NvbnRlbnRJbmRleChzZWxlY3Rvcik7XG4gICAgY29uc3QgY2hpbGRyZW46IHQuVGVtcGxhdGVBc3RbXSA9IGh0bWwudmlzaXRBbGwodGhpcywgYXN0LmNoaWxkcmVuLCBFTVBUWV9FTEVNRU5UX0NPTlRFWFQpO1xuICAgIHJldHVybiBuZXcgdC5FbGVtZW50QXN0KFxuICAgICAgICBhc3QubmFtZSwgaHRtbC52aXNpdEFsbCh0aGlzLCBhc3QuYXR0cnMpLCBbXSwgW10sIFtdLCBbXSwgW10sIGZhbHNlLCBbXSwgY2hpbGRyZW4sXG4gICAgICAgIG5nQ29udGVudEluZGV4LCBhc3Quc291cmNlU3BhbiwgYXN0LmVuZFNvdXJjZVNwYW4pO1xuICB9XG4gIHZpc2l0Q29tbWVudChjb21tZW50OiBodG1sLkNvbW1lbnQsIGNvbnRleHQ6IGFueSk6IGFueSB7IHJldHVybiBudWxsOyB9XG5cbiAgdmlzaXRBdHRyaWJ1dGUoYXR0cmlidXRlOiBodG1sLkF0dHJpYnV0ZSwgY29udGV4dDogYW55KTogdC5BdHRyQXN0IHtcbiAgICByZXR1cm4gbmV3IHQuQXR0ckFzdChhdHRyaWJ1dGUubmFtZSwgYXR0cmlidXRlLnZhbHVlLCBhdHRyaWJ1dGUuc291cmNlU3Bhbik7XG4gIH1cblxuICB2aXNpdFRleHQodGV4dDogaHRtbC5UZXh0LCBwYXJlbnQ6IEVsZW1lbnRDb250ZXh0KTogdC5UZXh0QXN0IHtcbiAgICBjb25zdCBuZ0NvbnRlbnRJbmRleCA9IHBhcmVudC5maW5kTmdDb250ZW50SW5kZXgoVEVYVF9DU1NfU0VMRUNUT1IoKSkgITtcbiAgICByZXR1cm4gbmV3IHQuVGV4dEFzdCh0ZXh0LnZhbHVlLCBuZ0NvbnRlbnRJbmRleCwgdGV4dC5zb3VyY2VTcGFuICEpO1xuICB9XG5cbiAgdmlzaXRFeHBhbnNpb24oZXhwYW5zaW9uOiBodG1sLkV4cGFuc2lvbiwgY29udGV4dDogYW55KTogYW55IHsgcmV0dXJuIGV4cGFuc2lvbjsgfVxuXG4gIHZpc2l0RXhwYW5zaW9uQ2FzZShleHBhbnNpb25DYXNlOiBodG1sLkV4cGFuc2lvbkNhc2UsIGNvbnRleHQ6IGFueSk6IGFueSB7IHJldHVybiBleHBhbnNpb25DYXNlOyB9XG59XG5cbi8qKlxuICogQSByZWZlcmVuY2UgdG8gYW4gZWxlbWVudCBvciBkaXJlY3RpdmUgaW4gYSB0ZW1wbGF0ZS4gRS5nLiwgdGhlIHJlZmVyZW5jZSBpbiB0aGlzIHRlbXBsYXRlOlxuICpcbiAqIDxkaXYgI215TWVudT1cImNvb2xNZW51XCI+XG4gKlxuICogd291bGQgYmUge25hbWU6ICdteU1lbnUnLCB2YWx1ZTogJ2Nvb2xNZW51Jywgc291cmNlU3BhbjogLi4ufVxuICovXG5jbGFzcyBFbGVtZW50T3JEaXJlY3RpdmVSZWYge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nLCBwdWJsaWMgdmFsdWU6IHN0cmluZywgcHVibGljIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3Bhbikge31cblxuICAvKiogR2V0cyB3aGV0aGVyIHRoaXMgaXMgYSByZWZlcmVuY2UgdG8gdGhlIGdpdmVuIGRpcmVjdGl2ZS4gKi9cbiAgaXNSZWZlcmVuY2VUb0RpcmVjdGl2ZShkaXJlY3RpdmU6IENvbXBpbGVEaXJlY3RpdmVTdW1tYXJ5KSB7XG4gICAgcmV0dXJuIHNwbGl0RXhwb3J0QXMoZGlyZWN0aXZlLmV4cG9ydEFzKS5pbmRleE9mKHRoaXMudmFsdWUpICE9PSAtMTtcbiAgfVxufVxuXG4vKiogU3BsaXRzIGEgcmF3LCBwb3RlbnRpYWxseSBjb21tYS1kZWxpbWl0ZWQgYGV4cG9ydEFzYCB2YWx1ZSBpbnRvIGFuIGFycmF5IG9mIG5hbWVzLiAqL1xuZnVuY3Rpb24gc3BsaXRFeHBvcnRBcyhleHBvcnRBczogc3RyaW5nIHwgbnVsbCk6IHN0cmluZ1tdIHtcbiAgcmV0dXJuIGV4cG9ydEFzID8gZXhwb3J0QXMuc3BsaXQoJywnKS5tYXAoZSA9PiBlLnRyaW0oKSkgOiBbXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNwbGl0Q2xhc3NlcyhjbGFzc0F0dHJWYWx1ZTogc3RyaW5nKTogc3RyaW5nW10ge1xuICByZXR1cm4gY2xhc3NBdHRyVmFsdWUudHJpbSgpLnNwbGl0KC9cXHMrL2cpO1xufVxuXG5jbGFzcyBFbGVtZW50Q29udGV4dCB7XG4gIHN0YXRpYyBjcmVhdGUoXG4gICAgICBpc1RlbXBsYXRlRWxlbWVudDogYm9vbGVhbiwgZGlyZWN0aXZlczogdC5EaXJlY3RpdmVBc3RbXSxcbiAgICAgIHByb3ZpZGVyQ29udGV4dDogUHJvdmlkZXJFbGVtZW50Q29udGV4dCk6IEVsZW1lbnRDb250ZXh0IHtcbiAgICBjb25zdCBtYXRjaGVyID0gbmV3IFNlbGVjdG9yTWF0Y2hlcigpO1xuICAgIGxldCB3aWxkY2FyZE5nQ29udGVudEluZGV4OiBudW1iZXIgPSBudWxsICE7XG4gICAgY29uc3QgY29tcG9uZW50ID0gZGlyZWN0aXZlcy5maW5kKGRpcmVjdGl2ZSA9PiBkaXJlY3RpdmUuZGlyZWN0aXZlLmlzQ29tcG9uZW50KTtcbiAgICBpZiAoY29tcG9uZW50KSB7XG4gICAgICBjb25zdCBuZ0NvbnRlbnRTZWxlY3RvcnMgPSBjb21wb25lbnQuZGlyZWN0aXZlLnRlbXBsYXRlICEubmdDb250ZW50U2VsZWN0b3JzO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZ0NvbnRlbnRTZWxlY3RvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3Qgc2VsZWN0b3IgPSBuZ0NvbnRlbnRTZWxlY3RvcnNbaV07XG4gICAgICAgIGlmIChzZWxlY3RvciA9PT0gJyonKSB7XG4gICAgICAgICAgd2lsZGNhcmROZ0NvbnRlbnRJbmRleCA9IGk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWF0Y2hlci5hZGRTZWxlY3RhYmxlcyhDc3NTZWxlY3Rvci5wYXJzZShuZ0NvbnRlbnRTZWxlY3RvcnNbaV0pLCBpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3IEVsZW1lbnRDb250ZXh0KGlzVGVtcGxhdGVFbGVtZW50LCBtYXRjaGVyLCB3aWxkY2FyZE5nQ29udGVudEluZGV4LCBwcm92aWRlckNvbnRleHQpO1xuICB9XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHVibGljIGlzVGVtcGxhdGVFbGVtZW50OiBib29sZWFuLCBwcml2YXRlIF9uZ0NvbnRlbnRJbmRleE1hdGNoZXI6IFNlbGVjdG9yTWF0Y2hlcixcbiAgICAgIHByaXZhdGUgX3dpbGRjYXJkTmdDb250ZW50SW5kZXg6IG51bWJlcnxudWxsLFxuICAgICAgcHVibGljIHByb3ZpZGVyQ29udGV4dDogUHJvdmlkZXJFbGVtZW50Q29udGV4dHxudWxsKSB7fVxuXG4gIGZpbmROZ0NvbnRlbnRJbmRleChzZWxlY3RvcjogQ3NzU2VsZWN0b3IpOiBudW1iZXJ8bnVsbCB7XG4gICAgY29uc3QgbmdDb250ZW50SW5kaWNlczogbnVtYmVyW10gPSBbXTtcbiAgICB0aGlzLl9uZ0NvbnRlbnRJbmRleE1hdGNoZXIubWF0Y2goXG4gICAgICAgIHNlbGVjdG9yLCAoc2VsZWN0b3IsIG5nQ29udGVudEluZGV4KSA9PiB7IG5nQ29udGVudEluZGljZXMucHVzaChuZ0NvbnRlbnRJbmRleCk7IH0pO1xuICAgIG5nQ29udGVudEluZGljZXMuc29ydCgpO1xuICAgIGlmICh0aGlzLl93aWxkY2FyZE5nQ29udGVudEluZGV4ICE9IG51bGwpIHtcbiAgICAgIG5nQ29udGVudEluZGljZXMucHVzaCh0aGlzLl93aWxkY2FyZE5nQ29udGVudEluZGV4KTtcbiAgICB9XG4gICAgcmV0dXJuIG5nQ29udGVudEluZGljZXMubGVuZ3RoID4gMCA/IG5nQ29udGVudEluZGljZXNbMF0gOiBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFbGVtZW50Q3NzU2VsZWN0b3IoXG4gICAgZWxlbWVudE5hbWU6IHN0cmluZywgYXR0cmlidXRlczogW3N0cmluZywgc3RyaW5nXVtdKTogQ3NzU2VsZWN0b3Ige1xuICBjb25zdCBjc3NTZWxlY3RvciA9IG5ldyBDc3NTZWxlY3RvcigpO1xuICBjb25zdCBlbE5hbWVOb05zID0gc3BsaXROc05hbWUoZWxlbWVudE5hbWUpWzFdO1xuXG4gIGNzc1NlbGVjdG9yLnNldEVsZW1lbnQoZWxOYW1lTm9Ocyk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBhdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgYXR0ck5hbWUgPSBhdHRyaWJ1dGVzW2ldWzBdO1xuICAgIGNvbnN0IGF0dHJOYW1lTm9OcyA9IHNwbGl0TnNOYW1lKGF0dHJOYW1lKVsxXTtcbiAgICBjb25zdCBhdHRyVmFsdWUgPSBhdHRyaWJ1dGVzW2ldWzFdO1xuXG4gICAgY3NzU2VsZWN0b3IuYWRkQXR0cmlidXRlKGF0dHJOYW1lTm9OcywgYXR0clZhbHVlKTtcbiAgICBpZiAoYXR0ck5hbWUudG9Mb3dlckNhc2UoKSA9PSBDTEFTU19BVFRSKSB7XG4gICAgICBjb25zdCBjbGFzc2VzID0gc3BsaXRDbGFzc2VzKGF0dHJWYWx1ZSk7XG4gICAgICBjbGFzc2VzLmZvckVhY2goY2xhc3NOYW1lID0+IGNzc1NlbGVjdG9yLmFkZENsYXNzTmFtZShjbGFzc05hbWUpKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNzc1NlbGVjdG9yO1xufVxuXG5jb25zdCBFTVBUWV9FTEVNRU5UX0NPTlRFWFQgPSBuZXcgRWxlbWVudENvbnRleHQodHJ1ZSwgbmV3IFNlbGVjdG9yTWF0Y2hlcigpLCBudWxsLCBudWxsKTtcbmNvbnN0IE5PTl9CSU5EQUJMRV9WSVNJVE9SID0gbmV3IE5vbkJpbmRhYmxlVmlzaXRvcigpO1xuXG5mdW5jdGlvbiBfaXNFbXB0eVRleHROb2RlKG5vZGU6IGh0bWwuTm9kZSk6IGJvb2xlYW4ge1xuICByZXR1cm4gbm9kZSBpbnN0YW5jZW9mIGh0bWwuVGV4dCAmJiBub2RlLnZhbHVlLnRyaW0oKS5sZW5ndGggPT0gMDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZVN1bW1hcnlEdXBsaWNhdGVzPFQgZXh0ZW5kc3t0eXBlOiBDb21waWxlVHlwZU1ldGFkYXRhfT4oaXRlbXM6IFRbXSk6IFRbXSB7XG4gIGNvbnN0IG1hcCA9IG5ldyBNYXA8YW55LCBUPigpO1xuXG4gIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICBpZiAoIW1hcC5nZXQoaXRlbS50eXBlLnJlZmVyZW5jZSkpIHtcbiAgICAgIG1hcC5zZXQoaXRlbS50eXBlLnJlZmVyZW5jZSwgaXRlbSk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gQXJyYXkuZnJvbShtYXAudmFsdWVzKCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNFbXB0eUV4cHJlc3Npb24oYXN0OiBBU1QpOiBib29sZWFuIHtcbiAgaWYgKGFzdCBpbnN0YW5jZW9mIEFTVFdpdGhTb3VyY2UpIHtcbiAgICBhc3QgPSBhc3QuYXN0O1xuICB9XG4gIHJldHVybiBhc3QgaW5zdGFuY2VvZiBFbXB0eUV4cHI7XG59XG4iXX0=