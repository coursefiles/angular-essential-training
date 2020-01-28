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
        define("@angular/compiler/src/render3/view/template", ["require", "exports", "tslib", "@angular/compiler/src/compile_metadata", "@angular/compiler/src/compiler_util/expression_converter", "@angular/compiler/src/core", "@angular/compiler/src/expression_parser/ast", "@angular/compiler/src/expression_parser/lexer", "@angular/compiler/src/expression_parser/parser", "@angular/compiler/src/ml_parser/ast", "@angular/compiler/src/ml_parser/html_parser", "@angular/compiler/src/ml_parser/html_whitespaces", "@angular/compiler/src/ml_parser/interpolation_config", "@angular/compiler/src/ml_parser/tags", "@angular/compiler/src/output/map_util", "@angular/compiler/src/output/output_ast", "@angular/compiler/src/schema/dom_element_schema_registry", "@angular/compiler/src/selector", "@angular/compiler/src/template_parser/binding_parser", "@angular/compiler/src/util", "@angular/compiler/src/render3/r3_ast", "@angular/compiler/src/render3/r3_identifiers", "@angular/compiler/src/render3/r3_template_transform", "@angular/compiler/src/render3/util", "@angular/compiler/src/render3/view/i18n/context", "@angular/compiler/src/render3/view/i18n/meta", "@angular/compiler/src/render3/view/i18n/serializer", "@angular/compiler/src/render3/view/i18n/util", "@angular/compiler/src/render3/view/styling_builder", "@angular/compiler/src/render3/view/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var compile_metadata_1 = require("@angular/compiler/src/compile_metadata");
    var expression_converter_1 = require("@angular/compiler/src/compiler_util/expression_converter");
    var core = require("@angular/compiler/src/core");
    var ast_1 = require("@angular/compiler/src/expression_parser/ast");
    var lexer_1 = require("@angular/compiler/src/expression_parser/lexer");
    var parser_1 = require("@angular/compiler/src/expression_parser/parser");
    var html = require("@angular/compiler/src/ml_parser/ast");
    var html_parser_1 = require("@angular/compiler/src/ml_parser/html_parser");
    var html_whitespaces_1 = require("@angular/compiler/src/ml_parser/html_whitespaces");
    var interpolation_config_1 = require("@angular/compiler/src/ml_parser/interpolation_config");
    var tags_1 = require("@angular/compiler/src/ml_parser/tags");
    var map_util_1 = require("@angular/compiler/src/output/map_util");
    var o = require("@angular/compiler/src/output/output_ast");
    var dom_element_schema_registry_1 = require("@angular/compiler/src/schema/dom_element_schema_registry");
    var selector_1 = require("@angular/compiler/src/selector");
    var binding_parser_1 = require("@angular/compiler/src/template_parser/binding_parser");
    var util_1 = require("@angular/compiler/src/util");
    var t = require("@angular/compiler/src/render3/r3_ast");
    var r3_identifiers_1 = require("@angular/compiler/src/render3/r3_identifiers");
    var r3_template_transform_1 = require("@angular/compiler/src/render3/r3_template_transform");
    var util_2 = require("@angular/compiler/src/render3/util");
    var context_1 = require("@angular/compiler/src/render3/view/i18n/context");
    var meta_1 = require("@angular/compiler/src/render3/view/i18n/meta");
    var serializer_1 = require("@angular/compiler/src/render3/view/i18n/serializer");
    var util_3 = require("@angular/compiler/src/render3/view/i18n/util");
    var styling_builder_1 = require("@angular/compiler/src/render3/view/styling_builder");
    var util_4 = require("@angular/compiler/src/render3/view/util");
    // Selector attribute name of `<ng-content>`
    var NG_CONTENT_SELECT_ATTR = 'select';
    // Attribute name of `ngProjectAs`.
    var NG_PROJECT_AS_ATTR_NAME = 'ngProjectAs';
    // List of supported global targets for event listeners
    var GLOBAL_TARGET_RESOLVERS = new Map([['window', r3_identifiers_1.Identifiers.resolveWindow], ['document', r3_identifiers_1.Identifiers.resolveDocument], ['body', r3_identifiers_1.Identifiers.resolveBody]]);
    var LEADING_TRIVIA_CHARS = [' ', '\n', '\r', '\t'];
    //  if (rf & flags) { .. }
    function renderFlagCheckIfStmt(flags, statements) {
        return o.ifStmt(o.variable(util_4.RENDER_FLAGS).bitwiseAnd(o.literal(flags), null, false), statements);
    }
    exports.renderFlagCheckIfStmt = renderFlagCheckIfStmt;
    function prepareEventListenerParameters(eventAst, handlerName, scope) {
        if (handlerName === void 0) { handlerName = null; }
        if (scope === void 0) { scope = null; }
        var type = eventAst.type, name = eventAst.name, target = eventAst.target, phase = eventAst.phase, handler = eventAst.handler;
        if (target && !GLOBAL_TARGET_RESOLVERS.has(target)) {
            throw new Error("Unexpected global target '" + target + "' defined for '" + name + "' event.\n        Supported list of global targets: " + Array.from(GLOBAL_TARGET_RESOLVERS.keys()) + ".");
        }
        var implicitReceiverExpr = (scope === null || scope.bindingLevel === 0) ?
            o.variable(util_4.CONTEXT_NAME) :
            scope.getOrCreateSharedContextVar(0);
        var bindingExpr = expression_converter_1.convertActionBinding(scope, implicitReceiverExpr, handler, 'b', function () { return util_1.error('Unexpected interpolation'); }, eventAst.handlerSpan);
        var statements = [];
        if (scope) {
            statements.push.apply(statements, tslib_1.__spread(scope.restoreViewStatement()));
            statements.push.apply(statements, tslib_1.__spread(scope.variableDeclarations()));
        }
        statements.push.apply(statements, tslib_1.__spread(bindingExpr.render3Stmts));
        var eventName = type === 1 /* Animation */ ? util_2.prepareSyntheticListenerName(name, phase) : name;
        var fnName = handlerName && compile_metadata_1.sanitizeIdentifier(handlerName);
        var fnArgs = [new o.FnParam('$event', o.DYNAMIC_TYPE)];
        var handlerFn = o.fn(fnArgs, statements, o.INFERRED_TYPE, null, fnName);
        var params = [o.literal(eventName), handlerFn];
        if (target) {
            params.push(o.literal(false), // `useCapture` flag, defaults to `false`
            o.importExpr(GLOBAL_TARGET_RESOLVERS.get(target)));
        }
        return params;
    }
    exports.prepareEventListenerParameters = prepareEventListenerParameters;
    var TemplateDefinitionBuilder = /** @class */ (function () {
        function TemplateDefinitionBuilder(constantPool, parentBindingScope, level, contextName, i18nContext, templateIndex, templateName, directiveMatcher, directives, pipeTypeByName, pipes, _namespace, relativeContextFilePath, i18nUseExternalIds) {
            var _this = this;
            if (level === void 0) { level = 0; }
            this.constantPool = constantPool;
            this.level = level;
            this.contextName = contextName;
            this.i18nContext = i18nContext;
            this.templateIndex = templateIndex;
            this.templateName = templateName;
            this.directiveMatcher = directiveMatcher;
            this.directives = directives;
            this.pipeTypeByName = pipeTypeByName;
            this.pipes = pipes;
            this._namespace = _namespace;
            this.relativeContextFilePath = relativeContextFilePath;
            this.i18nUseExternalIds = i18nUseExternalIds;
            this._dataIndex = 0;
            this._bindingContext = 0;
            this._prefixCode = [];
            /**
             * List of callbacks to generate creation mode instructions. We store them here as we process
             * the template so bindings in listeners are resolved only once all nodes have been visited.
             * This ensures all local refs and context variables are available for matching.
             */
            this._creationCodeFns = [];
            /**
             * List of callbacks to generate update mode instructions. We store them here as we process
             * the template so bindings are resolved only once all nodes have been visited. This ensures
             * all local refs and context variables are available for matching.
             */
            this._updateCodeFns = [];
            /**
             * Memorizes the last node index for which a select instruction has been generated.
             * We're initializing this to -1 to ensure the `select(0)` instruction is generated before any
             * relevant update instructions.
             */
            this._lastNodeIndexWithFlush = -1;
            /** Temporary variable declarations generated from visiting pipes, literals, etc. */
            this._tempVariables = [];
            /**
             * List of callbacks to build nested templates. Nested templates must not be visited until
             * after the parent template has finished visiting all of its nodes. This ensures that all
             * local ref bindings in nested templates are able to find local ref values if the refs
             * are defined after the template declaration.
             */
            this._nestedTemplateFns = [];
            this._unsupported = util_4.unsupported;
            // i18n context local to this template
            this.i18n = null;
            // Number of slots to reserve for pureFunctions
            this._pureFunctionSlots = 0;
            // Number of binding slots
            this._bindingSlots = 0;
            // Projection slots found in the template. Projection slots can distribute projected
            // nodes based on a selector, or can just use the wildcard selector to match
            // all nodes which aren't matching any selector.
            this._ngContentReservedSlots = [];
            // Number of non-default selectors found in all parent templates of this template. We need to
            // track it to properly adjust projection slot index in the `projection` instruction.
            this._ngContentSelectorsOffset = 0;
            // Expression that should be used as implicit receiver when converting template
            // expressions to output AST.
            this._implicitReceiverExpr = null;
            // These should be handled in the template or element directly.
            this.visitReference = util_4.invalid;
            this.visitVariable = util_4.invalid;
            this.visitTextAttribute = util_4.invalid;
            this.visitBoundAttribute = util_4.invalid;
            this.visitBoundEvent = util_4.invalid;
            this._bindingScope = parentBindingScope.nestedScope(level);
            // Turn the relative context file path into an identifier by replacing non-alphanumeric
            // characters with underscores.
            this.fileBasedI18nSuffix = relativeContextFilePath.replace(/[^A-Za-z0-9]/g, '_') + '_';
            this._valueConverter = new ValueConverter(constantPool, function () { return _this.allocateDataSlot(); }, function (numSlots) { return _this.allocatePureFunctionSlots(numSlots); }, function (name, localName, slot, value) {
                var pipeType = pipeTypeByName.get(name);
                if (pipeType) {
                    _this.pipes.add(pipeType);
                }
                _this._bindingScope.set(_this.level, localName, value);
                _this.creationInstruction(null, r3_identifiers_1.Identifiers.pipe, [o.literal(slot), o.literal(name)]);
            });
        }
        TemplateDefinitionBuilder.prototype.registerContextVariables = function (variable) {
            var scopedName = this._bindingScope.freshReferenceName();
            var retrievalLevel = this.level;
            var lhs = o.variable(variable.name + scopedName);
            this._bindingScope.set(retrievalLevel, variable.name, lhs, 1 /* CONTEXT */, function (scope, relativeLevel) {
                var rhs;
                if (scope.bindingLevel === retrievalLevel) {
                    // e.g. ctx
                    rhs = o.variable(util_4.CONTEXT_NAME);
                }
                else {
                    var sharedCtxVar = scope.getSharedContextName(retrievalLevel);
                    // e.g. ctx_r0   OR  x(2);
                    rhs = sharedCtxVar ? sharedCtxVar : generateNextContextExpr(relativeLevel);
                }
                // e.g. const $item$ = x(2).$implicit;
                return [lhs.set(rhs.prop(variable.value || util_4.IMPLICIT_REFERENCE)).toConstDecl()];
            });
        };
        TemplateDefinitionBuilder.prototype.buildTemplateFunction = function (nodes, variables, ngContentSelectorsOffset, i18n) {
            var _this = this;
            if (ngContentSelectorsOffset === void 0) { ngContentSelectorsOffset = 0; }
            this._ngContentSelectorsOffset = ngContentSelectorsOffset;
            if (this._namespace !== r3_identifiers_1.Identifiers.namespaceHTML) {
                this.creationInstruction(null, this._namespace);
            }
            // Create variable bindings
            variables.forEach(function (v) { return _this.registerContextVariables(v); });
            // Initiate i18n context in case:
            // - this template has parent i18n context
            // - or the template has i18n meta associated with it,
            //   but it's not initiated by the Element (e.g. <ng-template i18n>)
            var initI18nContext = this.i18nContext || (util_3.isI18nRootNode(i18n) && !util_3.isSingleI18nIcu(i18n) &&
                !(isSingleElementTemplate(nodes) && nodes[0].i18n === i18n));
            var selfClosingI18nInstruction = hasTextChildrenOnly(nodes);
            if (initI18nContext) {
                this.i18nStart(null, i18n, selfClosingI18nInstruction);
            }
            // This is the initial pass through the nodes of this template. In this pass, we
            // queue all creation mode and update mode instructions for generation in the second
            // pass. It's necessary to separate the passes to ensure local refs are defined before
            // resolving bindings. We also count bindings in this pass as we walk bound expressions.
            t.visitAll(this, nodes);
            // Add total binding count to pure function count so pure function instructions are
            // generated with the correct slot offset when update instructions are processed.
            this._pureFunctionSlots += this._bindingSlots;
            // Pipes are walked in the first pass (to enqueue `pipe()` creation instructions and
            // `pipeBind` update instructions), so we have to update the slot offsets manually
            // to account for bindings.
            this._valueConverter.updatePipeSlotOffsets(this._bindingSlots);
            // Nested templates must be processed before creation instructions so template()
            // instructions can be generated with the correct internal const count.
            this._nestedTemplateFns.forEach(function (buildTemplateFn) { return buildTemplateFn(); });
            // Output the `projectionDef` instruction when some `<ng-content>` tags are present.
            // The `projectionDef` instruction is only emitted for the component template and
            // is skipped for nested templates (<ng-template> tags).
            if (this.level === 0 && this._ngContentReservedSlots.length) {
                var parameters = [];
                // By default the `projectionDef` instructions creates one slot for the wildcard
                // selector if no parameters are passed. Therefore we only want to allocate a new
                // array for the projection slots if the default projection slot is not sufficient.
                if (this._ngContentReservedSlots.length > 1 || this._ngContentReservedSlots[0] !== '*') {
                    var r3ReservedSlots = this._ngContentReservedSlots.map(function (s) { return s !== '*' ? core.parseSelectorToR3Selector(s) : s; });
                    parameters.push(this.constantPool.getConstLiteral(util_4.asLiteral(r3ReservedSlots), true));
                }
                // Since we accumulate ngContent selectors while processing template elements,
                // we *prepend* `projectionDef` to creation instructions block, to put it before
                // any `projection` instructions
                this.creationInstruction(null, r3_identifiers_1.Identifiers.projectionDef, parameters, /* prepend */ true);
            }
            if (initI18nContext) {
                this.i18nEnd(null, selfClosingI18nInstruction);
            }
            // Generate all the creation mode instructions (e.g. resolve bindings in listeners)
            var creationStatements = this._creationCodeFns.map(function (fn) { return fn(); });
            // Generate all the update mode instructions (e.g. resolve property or text bindings)
            var updateStatements = this._updateCodeFns.map(function (fn) { return fn(); });
            //  Variable declaration must occur after binding resolution so we can generate context
            //  instructions that build on each other.
            // e.g. const b = nextContext().$implicit(); const b = nextContext();
            var creationVariables = this._bindingScope.viewSnapshotStatements();
            var updateVariables = this._bindingScope.variableDeclarations().concat(this._tempVariables);
            var creationBlock = creationStatements.length > 0 ?
                [renderFlagCheckIfStmt(1 /* Create */, creationVariables.concat(creationStatements))] :
                [];
            var updateBlock = updateStatements.length > 0 ?
                [renderFlagCheckIfStmt(2 /* Update */, updateVariables.concat(updateStatements))] :
                [];
            return o.fn(
            // i.e. (rf: RenderFlags, ctx: any)
            [new o.FnParam(util_4.RENDER_FLAGS, o.NUMBER_TYPE), new o.FnParam(util_4.CONTEXT_NAME, null)], tslib_1.__spread(this._prefixCode, creationBlock, updateBlock), o.INFERRED_TYPE, null, this.templateName);
        };
        // LocalResolver
        TemplateDefinitionBuilder.prototype.getLocal = function (name) { return this._bindingScope.get(name); };
        // LocalResolver
        TemplateDefinitionBuilder.prototype.notifyImplicitReceiverUse = function () { this._bindingScope.notifyImplicitReceiverUse(); };
        TemplateDefinitionBuilder.prototype.i18nTranslate = function (message, params, ref, transformFn) {
            var _a;
            if (params === void 0) { params = {}; }
            var _ref = ref || o.variable(this.constantPool.uniqueName(util_3.TRANSLATION_PREFIX));
            // Closure Compiler requires const names to start with `MSG_` but disallows any other const to
            // start with `MSG_`. We define a variable starting with `MSG_` just for the `goog.getMsg` call
            var closureVar = this.i18nGenerateClosureVar(message.id);
            var _params = {};
            if (params && Object.keys(params).length) {
                Object.keys(params).forEach(function (key) { return _params[util_3.formatI18nPlaceholderName(key)] = params[key]; });
            }
            var meta = util_3.metaFromI18nMessage(message);
            var content = serializer_1.getSerializedI18nContent(message);
            var statements = util_3.getTranslationDeclStmts(_ref, closureVar, content, meta, _params, transformFn);
            (_a = this.constantPool.statements).push.apply(_a, tslib_1.__spread(statements));
            return _ref;
        };
        TemplateDefinitionBuilder.prototype.i18nAppendBindings = function (expressions) {
            var _this = this;
            if (expressions.length > 0) {
                expressions.forEach(function (expression) { return _this.i18n.appendBinding(expression); });
            }
        };
        TemplateDefinitionBuilder.prototype.i18nBindProps = function (props) {
            var _this = this;
            var bound = {};
            Object.keys(props).forEach(function (key) {
                var prop = props[key];
                if (prop instanceof t.Text) {
                    bound[key] = o.literal(prop.value);
                }
                else {
                    var value = prop.value.visit(_this._valueConverter);
                    _this.allocateBindingSlots(value);
                    if (value instanceof ast_1.Interpolation) {
                        var strings = value.strings, expressions = value.expressions;
                        var _a = _this.i18n, id = _a.id, bindings = _a.bindings;
                        var label = util_3.assembleI18nBoundString(strings, bindings.size, id);
                        _this.i18nAppendBindings(expressions);
                        bound[key] = o.literal(label);
                    }
                }
            });
            return bound;
        };
        TemplateDefinitionBuilder.prototype.i18nGenerateClosureVar = function (messageId) {
            var name;
            var suffix = this.fileBasedI18nSuffix.toUpperCase();
            if (this.i18nUseExternalIds) {
                var prefix = util_3.getTranslationConstPrefix("EXTERNAL_");
                var uniqueSuffix = this.constantPool.uniqueName(suffix);
                name = "" + prefix + compile_metadata_1.sanitizeIdentifier(messageId) + "$$" + uniqueSuffix;
            }
            else {
                var prefix = util_3.getTranslationConstPrefix(suffix);
                name = this.constantPool.uniqueName(prefix);
            }
            return o.variable(name);
        };
        TemplateDefinitionBuilder.prototype.i18nUpdateRef = function (context) {
            var icus = context.icus, meta = context.meta, isRoot = context.isRoot, isResolved = context.isResolved, isEmitted = context.isEmitted;
            if (isRoot && isResolved && !isEmitted && !util_3.isSingleI18nIcu(meta)) {
                context.isEmitted = true;
                var placeholders = context.getSerializedPlaceholders();
                var icuMapping_1 = {};
                var params_1 = placeholders.size ? util_3.placeholdersToParams(placeholders) : {};
                if (icus.size) {
                    icus.forEach(function (refs, key) {
                        if (refs.length === 1) {
                            // if we have one ICU defined for a given
                            // placeholder - just output its reference
                            params_1[key] = refs[0];
                        }
                        else {
                            // ... otherwise we need to activate post-processing
                            // to replace ICU placeholders with proper values
                            var placeholder = util_3.wrapI18nPlaceholder("" + util_3.I18N_ICU_MAPPING_PREFIX + key);
                            params_1[key] = o.literal(placeholder);
                            icuMapping_1[key] = o.literalArr(refs);
                        }
                    });
                }
                // translation requires post processing in 2 cases:
                // - if we have placeholders with multiple values (ex. `START_DIV`: [�#1�, �#2�, ...])
                // - if we have multiple ICUs that refer to the same placeholder name
                var needsPostprocessing = Array.from(placeholders.values()).some(function (value) { return value.length > 1; }) ||
                    Object.keys(icuMapping_1).length;
                var transformFn = void 0;
                if (needsPostprocessing) {
                    transformFn = function (raw) {
                        var args = [raw];
                        if (Object.keys(icuMapping_1).length) {
                            args.push(map_util_1.mapLiteral(icuMapping_1, true));
                        }
                        return instruction(null, r3_identifiers_1.Identifiers.i18nPostprocess, args);
                    };
                }
                this.i18nTranslate(meta, params_1, context.ref, transformFn);
            }
        };
        TemplateDefinitionBuilder.prototype.i18nStart = function (span, meta, selfClosing) {
            if (span === void 0) { span = null; }
            var index = this.allocateDataSlot();
            if (this.i18nContext) {
                this.i18n = this.i18nContext.forkChildContext(index, this.templateIndex, meta);
            }
            else {
                var ref_1 = o.variable(this.constantPool.uniqueName(util_3.TRANSLATION_PREFIX));
                this.i18n = new context_1.I18nContext(index, ref_1, 0, this.templateIndex, meta);
            }
            // generate i18nStart instruction
            var _a = this.i18n, id = _a.id, ref = _a.ref;
            var params = [o.literal(index), ref];
            if (id > 0) {
                // do not push 3rd argument (sub-block id)
                // into i18nStart call for top level i18n context
                params.push(o.literal(id));
            }
            this.creationInstruction(span, selfClosing ? r3_identifiers_1.Identifiers.i18n : r3_identifiers_1.Identifiers.i18nStart, params);
        };
        TemplateDefinitionBuilder.prototype.i18nEnd = function (span, selfClosing) {
            var _this = this;
            if (span === void 0) { span = null; }
            if (!this.i18n) {
                throw new Error('i18nEnd is executed with no i18n context present');
            }
            if (this.i18nContext) {
                this.i18nContext.reconcileChildContext(this.i18n);
                this.i18nUpdateRef(this.i18nContext);
            }
            else {
                this.i18nUpdateRef(this.i18n);
            }
            // setup accumulated bindings
            var _a = this.i18n, index = _a.index, bindings = _a.bindings;
            if (bindings.size) {
                bindings.forEach(function (binding) {
                    _this.updateInstruction(index, span, r3_identifiers_1.Identifiers.i18nExp, function () { return [_this.convertPropertyBinding(binding)]; });
                });
                this.updateInstruction(index, span, r3_identifiers_1.Identifiers.i18nApply, [o.literal(index)]);
            }
            if (!selfClosing) {
                this.creationInstruction(span, r3_identifiers_1.Identifiers.i18nEnd);
            }
            this.i18n = null; // reset local i18n context
        };
        TemplateDefinitionBuilder.prototype.visitContent = function (ngContent) {
            var slot = this.allocateDataSlot();
            var projectionSlotIdx = this._ngContentSelectorsOffset + this._ngContentReservedSlots.length;
            var parameters = [o.literal(slot)];
            var attributes = [];
            this._ngContentReservedSlots.push(ngContent.selector);
            ngContent.attributes.forEach(function (attribute) {
                var name = attribute.name, value = attribute.value;
                if (name === NG_PROJECT_AS_ATTR_NAME) {
                    attributes.push.apply(attributes, tslib_1.__spread(getNgProjectAsLiteral(attribute)));
                }
                else if (name.toLowerCase() !== NG_CONTENT_SELECT_ATTR) {
                    attributes.push(o.literal(name), o.literal(value));
                }
            });
            if (attributes.length > 0) {
                parameters.push(o.literal(projectionSlotIdx), o.literalArr(attributes));
            }
            else if (projectionSlotIdx !== 0) {
                parameters.push(o.literal(projectionSlotIdx));
            }
            this.creationInstruction(ngContent.sourceSpan, r3_identifiers_1.Identifiers.projection, parameters);
        };
        TemplateDefinitionBuilder.prototype.getNamespaceInstruction = function (namespaceKey) {
            switch (namespaceKey) {
                case 'math':
                    return r3_identifiers_1.Identifiers.namespaceMathML;
                case 'svg':
                    return r3_identifiers_1.Identifiers.namespaceSVG;
                default:
                    return r3_identifiers_1.Identifiers.namespaceHTML;
            }
        };
        TemplateDefinitionBuilder.prototype.addNamespaceInstruction = function (nsInstruction, element) {
            this._namespace = nsInstruction;
            this.creationInstruction(element.sourceSpan, nsInstruction);
        };
        TemplateDefinitionBuilder.prototype.visitElement = function (element) {
            var _this = this;
            var e_1, _a;
            var elementIndex = this.allocateDataSlot();
            var stylingBuilder = new styling_builder_1.StylingBuilder(o.literal(elementIndex), null);
            var isNonBindableMode = false;
            var isI18nRootElement = util_3.isI18nRootNode(element.i18n) && !util_3.isSingleI18nIcu(element.i18n);
            if (isI18nRootElement && this.i18n) {
                throw new Error("Could not mark an element as translatable inside of a translatable section");
            }
            var i18nAttrs = [];
            var outputAttrs = [];
            var _b = tslib_1.__read(tags_1.splitNsName(element.name), 2), namespaceKey = _b[0], elementName = _b[1];
            var isNgContainer = tags_1.isNgContainer(element.name);
            try {
                // Handle styling, i18n, ngNonBindable attributes
                for (var _c = tslib_1.__values(element.attributes), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var attr = _d.value;
                    var name_1 = attr.name, value = attr.value;
                    if (name_1 === util_4.NON_BINDABLE_ATTR) {
                        isNonBindableMode = true;
                    }
                    else if (name_1 === 'style') {
                        stylingBuilder.registerStyleAttr(value);
                    }
                    else if (name_1 === 'class') {
                        stylingBuilder.registerClassAttr(value);
                    }
                    else {
                        if (attr.i18n) {
                            // Place attributes into a separate array for i18n processing, but also keep such
                            // attributes in the main list to make them available for directive matching at runtime.
                            // TODO(FW-1248): prevent attributes duplication in `i18nAttributes` and `elementStart`
                            // arguments
                            i18nAttrs.push(attr);
                        }
                        outputAttrs.push(attr);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
            // Match directives on non i18n attributes
            this.matchDirectives(element.name, element);
            // Regular element or ng-container creation mode
            var parameters = [o.literal(elementIndex)];
            if (!isNgContainer) {
                parameters.push(o.literal(elementName));
            }
            // Add the attributes
            var attributes = [];
            var allOtherInputs = [];
            element.inputs.forEach(function (input) {
                var stylingInputWasSet = stylingBuilder.registerBoundInput(input);
                if (!stylingInputWasSet) {
                    if (input.type === 0 /* Property */ && input.i18n) {
                        // Place attributes into a separate array for i18n processing, but also keep such
                        // attributes in the main list to make them available for directive matching at runtime.
                        // TODO(FW-1248): prevent attributes duplication in `i18nAttributes` and `elementStart`
                        // arguments
                        i18nAttrs.push(input);
                    }
                    allOtherInputs.push(input);
                }
            });
            outputAttrs.forEach(function (attr) {
                if (attr.name === NG_PROJECT_AS_ATTR_NAME) {
                    attributes.push.apply(attributes, tslib_1.__spread(getNgProjectAsLiteral(attr)));
                }
                else {
                    attributes.push.apply(attributes, tslib_1.__spread(getAttributeNameLiterals(attr.name), [o.literal(attr.value)]));
                }
            });
            // add attributes for directive and projection matching purposes
            attributes.push.apply(attributes, tslib_1.__spread(this.prepareNonRenderAttrs(allOtherInputs, element.outputs, stylingBuilder)));
            parameters.push(this.toAttrsParam(attributes));
            // local refs (ex.: <div #foo #bar="baz">)
            parameters.push(this.prepareRefsParameter(element.references));
            var wasInNamespace = this._namespace;
            var currentNamespace = this.getNamespaceInstruction(namespaceKey);
            // If the namespace is changing now, include an instruction to change it
            // during element creation.
            if (currentNamespace !== wasInNamespace) {
                this.addNamespaceInstruction(currentNamespace, element);
            }
            if (this.i18n) {
                this.i18n.appendElement(element.i18n, elementIndex);
            }
            var hasChildren = function () {
                if (!isI18nRootElement && _this.i18n) {
                    // we do not append text node instructions and ICUs inside i18n section,
                    // so we exclude them while calculating whether current element has children
                    return !hasTextChildrenOnly(element.children);
                }
                return element.children.length > 0;
            };
            var createSelfClosingInstruction = !stylingBuilder.hasBindings && !isNgContainer &&
                element.outputs.length === 0 && i18nAttrs.length === 0 && !hasChildren();
            var createSelfClosingI18nInstruction = !createSelfClosingInstruction &&
                !stylingBuilder.hasBindings && hasTextChildrenOnly(element.children);
            if (createSelfClosingInstruction) {
                this.creationInstruction(element.sourceSpan, r3_identifiers_1.Identifiers.element, util_4.trimTrailingNulls(parameters));
            }
            else {
                this.creationInstruction(element.sourceSpan, isNgContainer ? r3_identifiers_1.Identifiers.elementContainerStart : r3_identifiers_1.Identifiers.elementStart, util_4.trimTrailingNulls(parameters));
                if (isNonBindableMode) {
                    this.creationInstruction(element.sourceSpan, r3_identifiers_1.Identifiers.disableBindings);
                }
                // process i18n element attributes
                if (i18nAttrs.length) {
                    var hasBindings_1 = false;
                    var i18nAttrArgs_1 = [];
                    i18nAttrs.forEach(function (attr) {
                        var message = attr.i18n;
                        if (attr instanceof t.TextAttribute) {
                            i18nAttrArgs_1.push(o.literal(attr.name), _this.i18nTranslate(message));
                        }
                        else {
                            var converted = attr.value.visit(_this._valueConverter);
                            _this.allocateBindingSlots(converted);
                            if (converted instanceof ast_1.Interpolation) {
                                var placeholders = util_3.assembleBoundTextPlaceholders(message);
                                var params = util_3.placeholdersToParams(placeholders);
                                i18nAttrArgs_1.push(o.literal(attr.name), _this.i18nTranslate(message, params));
                                converted.expressions.forEach(function (expression) {
                                    hasBindings_1 = true;
                                    var binding = _this.convertExpressionBinding(expression);
                                    _this.updateInstruction(elementIndex, element.sourceSpan, r3_identifiers_1.Identifiers.i18nExp, [binding]);
                                });
                            }
                        }
                    });
                    if (i18nAttrArgs_1.length) {
                        var index = o.literal(this.allocateDataSlot());
                        var args = this.constantPool.getConstLiteral(o.literalArr(i18nAttrArgs_1), true);
                        this.creationInstruction(element.sourceSpan, r3_identifiers_1.Identifiers.i18nAttributes, [index, args]);
                        if (hasBindings_1) {
                            this.updateInstruction(elementIndex, element.sourceSpan, r3_identifiers_1.Identifiers.i18nApply, [index]);
                        }
                    }
                }
                // The style bindings code is placed into two distinct blocks within the template function AOT
                // code: creation and update. The creation code contains the `elementStyling` instructions
                // which will apply the collected binding values to the element. `elementStyling` is
                // designed to run inside of `elementStart` and `elementEnd`. The update instructions
                // (things like `elementStyleProp`, `elementClassProp`, etc..) are applied later on in this
                // file
                this.processStylingInstruction(stylingBuilder.buildElementStylingInstruction(element.sourceSpan, this.constantPool), true);
                // Generate Listeners (outputs)
                element.outputs.forEach(function (outputAst) {
                    _this.creationInstruction(outputAst.sourceSpan, r3_identifiers_1.Identifiers.listener, _this.prepareListenerParameter(element.name, outputAst, elementIndex));
                });
                // Note: it's important to keep i18n/i18nStart instructions after i18nAttributes and
                // listeners, to make sure i18nAttributes instruction targets current element at runtime.
                if (isI18nRootElement) {
                    this.i18nStart(element.sourceSpan, element.i18n, createSelfClosingI18nInstruction);
                }
            }
            // the code here will collect all update-level styling instructions and add them to the
            // update block of the template function AOT code. Instructions like `elementStyleProp`,
            // `elementStylingMap`, `elementClassProp` and `elementStylingApply` are all generated
            // and assign in the code below.
            stylingBuilder.buildUpdateLevelInstructions(this._valueConverter).forEach(function (instruction) {
                _this._bindingSlots += instruction.allocateBindingSlots;
                _this.processStylingInstruction(instruction, false);
            });
            // the reason why `undefined` is used is because the renderer understands this as a
            // special value to symbolize that there is no RHS to this binding
            // TODO (matsko): revisit this once FW-959 is approached
            var emptyValueBindInstruction = o.literal(undefined);
            // Generate element input bindings
            allOtherInputs.forEach(function (input) {
                var inputType = input.type;
                if (inputType === 4 /* Animation */) {
                    var value_1 = input.value.visit(_this._valueConverter);
                    // animation bindings can be presented in the following formats:
                    // 1. [@binding]="fooExp"
                    // 2. [@binding]="{value:fooExp, params:{...}}"
                    // 3. [@binding]
                    // 4. @binding
                    // All formats will be valid for when a synthetic binding is created.
                    // The reasoning for this is because the renderer should get each
                    // synthetic binding value in the order of the array that they are
                    // defined in...
                    var hasValue_1 = value_1 instanceof ast_1.LiteralPrimitive ? !!value_1.value : true;
                    _this.allocateBindingSlots(value_1);
                    var bindingName_1 = util_2.prepareSyntheticPropertyName(input.name);
                    _this.updateInstruction(elementIndex, input.sourceSpan, r3_identifiers_1.Identifiers.property, function () {
                        return [
                            o.literal(bindingName_1),
                            (hasValue_1 ? _this.convertPropertyBinding(value_1, /* skipBindFn */ true) :
                                emptyValueBindInstruction),
                        ];
                    });
                }
                else {
                    // we must skip attributes with associated i18n context, since these attributes are handled
                    // separately and corresponding `i18nExp` and `i18nApply` instructions will be generated
                    if (input.i18n)
                        return;
                    var value_2 = input.value.visit(_this._valueConverter);
                    if (value_2 !== undefined) {
                        var params_2 = [];
                        var _a = tslib_1.__read(tags_1.splitNsName(input.name), 2), attrNamespace = _a[0], attrName_1 = _a[1];
                        var isAttributeBinding = inputType === 1 /* Attribute */;
                        var sanitizationRef = resolveSanitizationFn(input.securityContext, isAttributeBinding);
                        if (sanitizationRef)
                            params_2.push(sanitizationRef);
                        if (attrNamespace) {
                            var namespaceLiteral = o.literal(attrNamespace);
                            if (sanitizationRef) {
                                params_2.push(namespaceLiteral);
                            }
                            else {
                                // If there wasn't a sanitization ref, we need to add
                                // an extra param so that we can pass in the namespace.
                                params_2.push(o.literal(null), namespaceLiteral);
                            }
                        }
                        _this.allocateBindingSlots(value_2);
                        if (inputType === 0 /* Property */) {
                            if (value_2 instanceof ast_1.Interpolation) {
                                _this.updateInstruction(elementIndex, input.sourceSpan, getPropertyInterpolationExpression(value_2), function () {
                                    return tslib_1.__spread([o.literal(attrName_1)], _this.getUpdateInstructionArguments(value_2), params_2);
                                });
                            }
                            else {
                                // Bound, un-interpolated properties
                                _this.updateInstruction(elementIndex, input.sourceSpan, r3_identifiers_1.Identifiers.property, function () {
                                    return tslib_1.__spread([o.literal(attrName_1), _this.convertPropertyBinding(value_2, true)], params_2);
                                });
                            }
                        }
                        else {
                            var instruction_1;
                            if (inputType === 2 /* Class */) {
                                instruction_1 = r3_identifiers_1.Identifiers.elementClassProp;
                            }
                            else {
                                instruction_1 = r3_identifiers_1.Identifiers.elementAttribute;
                            }
                            _this.updateInstruction(elementIndex, input.sourceSpan, instruction_1, function () {
                                return tslib_1.__spread([
                                    o.literal(elementIndex), o.literal(attrName_1), _this.convertPropertyBinding(value_2)
                                ], params_2);
                            });
                        }
                    }
                }
            });
            // Traverse element child nodes
            t.visitAll(this, element.children);
            if (!isI18nRootElement && this.i18n) {
                this.i18n.appendElement(element.i18n, elementIndex, true);
            }
            if (!createSelfClosingInstruction) {
                // Finish element construction mode.
                var span = element.endSourceSpan || element.sourceSpan;
                if (isI18nRootElement) {
                    this.i18nEnd(span, createSelfClosingI18nInstruction);
                }
                if (isNonBindableMode) {
                    this.creationInstruction(span, r3_identifiers_1.Identifiers.enableBindings);
                }
                this.creationInstruction(span, isNgContainer ? r3_identifiers_1.Identifiers.elementContainerEnd : r3_identifiers_1.Identifiers.elementEnd);
            }
        };
        TemplateDefinitionBuilder.prototype.visitTemplate = function (template) {
            var _this = this;
            var NG_TEMPLATE_TAG_NAME = 'ng-template';
            var templateIndex = this.allocateDataSlot();
            if (this.i18n) {
                this.i18n.appendTemplate(template.i18n, templateIndex);
            }
            var tagName = compile_metadata_1.sanitizeIdentifier(template.tagName || '');
            var contextName = "" + this.contextName + (tagName ? '_' + tagName : '') + "_" + templateIndex;
            var templateName = contextName + "_Template";
            var parameters = [
                o.literal(templateIndex),
                o.variable(templateName),
                // We don't care about the tag's namespace here, because we infer
                // it based on the parent nodes inside the template instruction.
                o.literal(template.tagName ? tags_1.splitNsName(template.tagName)[1] : template.tagName),
            ];
            // find directives matching on a given <ng-template> node
            this.matchDirectives(NG_TEMPLATE_TAG_NAME, template);
            // prepare attributes parameter (including attributes used for directive matching)
            var attrsExprs = [];
            template.attributes.forEach(function (a) { attrsExprs.push(util_4.asLiteral(a.name), util_4.asLiteral(a.value)); });
            attrsExprs.push.apply(attrsExprs, tslib_1.__spread(this.prepareNonRenderAttrs(template.inputs, template.outputs, undefined, template.templateAttrs)));
            parameters.push(this.toAttrsParam(attrsExprs));
            // local refs (ex.: <ng-template #foo>)
            if (template.references && template.references.length) {
                parameters.push(this.prepareRefsParameter(template.references));
                parameters.push(o.importExpr(r3_identifiers_1.Identifiers.templateRefExtractor));
            }
            // Create the template function
            var templateVisitor = new TemplateDefinitionBuilder(this.constantPool, this._bindingScope, this.level + 1, contextName, this.i18n, templateIndex, templateName, this.directiveMatcher, this.directives, this.pipeTypeByName, this.pipes, this._namespace, this.fileBasedI18nSuffix, this.i18nUseExternalIds);
            // Nested templates must not be visited until after their parent templates have completed
            // processing, so they are queued here until after the initial pass. Otherwise, we wouldn't
            // be able to support bindings in nested templates to local refs that occur after the
            // template definition. e.g. <div *ngIf="showing">{{ foo }}</div>  <div #foo></div>
            this._nestedTemplateFns.push(function () {
                var _a;
                var templateFunctionExpr = templateVisitor.buildTemplateFunction(template.children, template.variables, _this._ngContentReservedSlots.length + _this._ngContentSelectorsOffset, template.i18n);
                _this.constantPool.statements.push(templateFunctionExpr.toDeclStmt(templateName, null));
                if (templateVisitor._ngContentReservedSlots.length) {
                    (_a = _this._ngContentReservedSlots).push.apply(_a, tslib_1.__spread(templateVisitor._ngContentReservedSlots));
                }
            });
            // e.g. template(1, MyComp_Template_1)
            this.creationInstruction(template.sourceSpan, r3_identifiers_1.Identifiers.templateCreate, function () {
                parameters.splice(2, 0, o.literal(templateVisitor.getConstCount()), o.literal(templateVisitor.getVarCount()));
                return util_4.trimTrailingNulls(parameters);
            });
            // handle property bindings e.g. ɵɵproperty('ngForOf', ctx.items), et al;
            this.templatePropertyBindings(template, templateIndex, template.templateAttrs);
            // Only add normal input/output binding instructions on explicit ng-template elements.
            if (template.tagName === NG_TEMPLATE_TAG_NAME) {
                // Add the input bindings
                this.templatePropertyBindings(template, templateIndex, template.inputs);
                // Generate listeners for directive output
                template.outputs.forEach(function (outputAst) {
                    _this.creationInstruction(outputAst.sourceSpan, r3_identifiers_1.Identifiers.listener, _this.prepareListenerParameter('ng_template', outputAst, templateIndex));
                });
            }
        };
        TemplateDefinitionBuilder.prototype.visitBoundText = function (text) {
            var _this = this;
            if (this.i18n) {
                var value_3 = text.value.visit(this._valueConverter);
                this.allocateBindingSlots(value_3);
                if (value_3 instanceof ast_1.Interpolation) {
                    this.i18n.appendBoundText(text.i18n);
                    this.i18nAppendBindings(value_3.expressions);
                }
                return;
            }
            var nodeIndex = this.allocateDataSlot();
            this.creationInstruction(text.sourceSpan, r3_identifiers_1.Identifiers.text, [o.literal(nodeIndex)]);
            var value = text.value.visit(this._valueConverter);
            this.allocateBindingSlots(value);
            this.updateInstruction(nodeIndex, text.sourceSpan, r3_identifiers_1.Identifiers.textBinding, function () { return [o.literal(nodeIndex), _this.convertPropertyBinding(value)]; });
        };
        TemplateDefinitionBuilder.prototype.visitText = function (text) {
            // when a text element is located within a translatable
            // block, we exclude this text element from instructions set,
            // since it will be captured in i18n content and processed at runtime
            if (!this.i18n) {
                this.creationInstruction(text.sourceSpan, r3_identifiers_1.Identifiers.text, [o.literal(this.allocateDataSlot()), o.literal(text.value)]);
            }
        };
        TemplateDefinitionBuilder.prototype.visitIcu = function (icu) {
            var initWasInvoked = false;
            // if an ICU was created outside of i18n block, we still treat
            // it as a translatable entity and invoke i18nStart and i18nEnd
            // to generate i18n context and the necessary instructions
            if (!this.i18n) {
                initWasInvoked = true;
                this.i18nStart(null, icu.i18n, true);
            }
            var i18n = this.i18n;
            var vars = this.i18nBindProps(icu.vars);
            var placeholders = this.i18nBindProps(icu.placeholders);
            // output ICU directly and keep ICU reference in context
            var message = icu.i18n;
            var transformFn = function (raw) {
                return instruction(null, r3_identifiers_1.Identifiers.i18nPostprocess, [raw, map_util_1.mapLiteral(vars, true)]);
            };
            // in case the whole i18n message is a single ICU - we do not need to
            // create a separate top-level translation, we can use the root ref instead
            // and make this ICU a top-level translation
            if (util_3.isSingleI18nIcu(i18n.meta)) {
                this.i18nTranslate(message, placeholders, i18n.ref, transformFn);
            }
            else {
                // output ICU directly and keep ICU reference in context
                var ref = this.i18nTranslate(message, placeholders, undefined, transformFn);
                i18n.appendIcu(util_3.icuFromI18nMessage(message).name, ref);
            }
            if (initWasInvoked) {
                this.i18nEnd(null, true);
            }
            return null;
        };
        TemplateDefinitionBuilder.prototype.allocateDataSlot = function () { return this._dataIndex++; };
        TemplateDefinitionBuilder.prototype.getConstCount = function () { return this._dataIndex; };
        TemplateDefinitionBuilder.prototype.getVarCount = function () { return this._pureFunctionSlots; };
        TemplateDefinitionBuilder.prototype.getNgContentSelectors = function () {
            return this._ngContentReservedSlots.length ?
                this.constantPool.getConstLiteral(util_4.asLiteral(this._ngContentReservedSlots), true) :
                null;
        };
        TemplateDefinitionBuilder.prototype.bindingContext = function () { return "" + this._bindingContext++; };
        TemplateDefinitionBuilder.prototype.templatePropertyBindings = function (template, templateIndex, attrs) {
            var _this = this;
            attrs.forEach(function (input) {
                if (input instanceof t.BoundAttribute) {
                    var value_4 = input.value.visit(_this._valueConverter);
                    _this.allocateBindingSlots(value_4);
                    _this.updateInstruction(templateIndex, template.sourceSpan, r3_identifiers_1.Identifiers.property, function () { return [o.literal(input.name), _this.convertPropertyBinding(value_4, true)]; });
                }
            });
        };
        // Bindings must only be resolved after all local refs have been visited, so all
        // instructions are queued in callbacks that execute once the initial pass has completed.
        // Otherwise, we wouldn't be able to support local refs that are defined after their
        // bindings. e.g. {{ foo }} <div #foo></div>
        TemplateDefinitionBuilder.prototype.instructionFn = function (fns, span, reference, paramsOrFn, prepend) {
            if (prepend === void 0) { prepend = false; }
            fns[prepend ? 'unshift' : 'push'](function () {
                var params = Array.isArray(paramsOrFn) ? paramsOrFn : paramsOrFn();
                return instruction(span, reference, params).toStmt();
            });
        };
        TemplateDefinitionBuilder.prototype.processStylingInstruction = function (instruction, createMode) {
            var _this = this;
            if (instruction) {
                var paramsFn = function () {
                    return instruction.buildParams(function (value) { return _this.convertPropertyBinding(value, true); });
                };
                if (createMode) {
                    this.creationInstruction(instruction.sourceSpan, instruction.reference, paramsFn);
                }
                else {
                    this.updateInstruction(-1, instruction.sourceSpan, instruction.reference, paramsFn);
                }
            }
        };
        TemplateDefinitionBuilder.prototype.creationInstruction = function (span, reference, paramsOrFn, prepend) {
            this.instructionFn(this._creationCodeFns, span, reference, paramsOrFn || [], prepend);
        };
        TemplateDefinitionBuilder.prototype.updateInstruction = function (nodeIndex, span, reference, paramsOrFn) {
            if (this._lastNodeIndexWithFlush < nodeIndex) {
                this.instructionFn(this._updateCodeFns, span, r3_identifiers_1.Identifiers.select, [o.literal(nodeIndex)]);
                this._lastNodeIndexWithFlush = nodeIndex;
            }
            this.instructionFn(this._updateCodeFns, span, reference, paramsOrFn || []);
        };
        TemplateDefinitionBuilder.prototype.allocatePureFunctionSlots = function (numSlots) {
            var originalSlots = this._pureFunctionSlots;
            this._pureFunctionSlots += numSlots;
            return originalSlots;
        };
        TemplateDefinitionBuilder.prototype.allocateBindingSlots = function (value) {
            this._bindingSlots += value instanceof ast_1.Interpolation ? value.expressions.length : 1;
        };
        /**
         * Gets an expression that refers to the implicit receiver. The implicit
         * receiver is always the root level context.
         */
        TemplateDefinitionBuilder.prototype.getImplicitReceiverExpr = function () {
            if (this._implicitReceiverExpr) {
                return this._implicitReceiverExpr;
            }
            return this._implicitReceiverExpr = this.level === 0 ?
                o.variable(util_4.CONTEXT_NAME) :
                this._bindingScope.getOrCreateSharedContextVar(0);
        };
        TemplateDefinitionBuilder.prototype.convertExpressionBinding = function (value) {
            var convertedPropertyBinding = expression_converter_1.convertPropertyBinding(this, this.getImplicitReceiverExpr(), value, this.bindingContext(), expression_converter_1.BindingForm.TrySimple);
            var valExpr = convertedPropertyBinding.currValExpr;
            return o.importExpr(r3_identifiers_1.Identifiers.bind).callFn([valExpr]);
        };
        TemplateDefinitionBuilder.prototype.convertPropertyBinding = function (value, skipBindFn) {
            var _a;
            var interpolationFn = value instanceof ast_1.Interpolation ? interpolate : function () { return util_1.error('Unexpected interpolation'); };
            var convertedPropertyBinding = expression_converter_1.convertPropertyBinding(this, this.getImplicitReceiverExpr(), value, this.bindingContext(), expression_converter_1.BindingForm.TrySimple, interpolationFn);
            var valExpr = convertedPropertyBinding.currValExpr;
            (_a = this._tempVariables).push.apply(_a, tslib_1.__spread(convertedPropertyBinding.stmts));
            return value instanceof ast_1.Interpolation || skipBindFn ? valExpr :
                o.importExpr(r3_identifiers_1.Identifiers.bind).callFn([valExpr]);
        };
        /**
         * Gets a list of argument expressions to pass to an update instruction expression. Also updates
         * the temp variables state with temp variables that were identified as needing to be created
         * while visiting the arguments.
         * @param value The original expression we will be resolving an arguments list from.
         */
        TemplateDefinitionBuilder.prototype.getUpdateInstructionArguments = function (value) {
            var _a;
            var _b = expression_converter_1.convertUpdateArguments(this, this.getImplicitReceiverExpr(), value, this.bindingContext()), args = _b.args, stmts = _b.stmts;
            (_a = this._tempVariables).push.apply(_a, tslib_1.__spread(stmts));
            return args;
        };
        TemplateDefinitionBuilder.prototype.matchDirectives = function (tagName, elOrTpl) {
            var _this = this;
            if (this.directiveMatcher) {
                var selector = createCssSelector(tagName, util_4.getAttrsForDirectiveMatching(elOrTpl));
                this.directiveMatcher.match(selector, function (cssSelector, staticType) { _this.directives.add(staticType); });
            }
        };
        /**
         * Prepares all attribute expression values for the `TAttributes` array.
         *
         * The purpose of this function is to properly construct an attributes array that
         * is passed into the `elementStart` (or just `element`) functions. Because there
         * are many different types of attributes, the array needs to be constructed in a
         * special way so that `elementStart` can properly evaluate them.
         *
         * The format looks like this:
         *
         * ```
         * attrs = [prop, value, prop2, value2,
         *   CLASSES, class1, class2,
         *   STYLES, style1, value1, style2, value2,
         *   BINDINGS, name1, name2, name3,
         *   TEMPLATE, name4, name5, ...]
         * ```
         *
         * Note that this function will fully ignore all synthetic (@foo) attribute values
         * because those values are intended to always be generated as property instructions.
         */
        TemplateDefinitionBuilder.prototype.prepareNonRenderAttrs = function (inputs, outputs, styles, templateAttrs) {
            if (templateAttrs === void 0) { templateAttrs = []; }
            var alreadySeen = new Set();
            var attrExprs = [];
            function addAttrExpr(key, value) {
                if (typeof key === 'string') {
                    if (!alreadySeen.has(key)) {
                        attrExprs.push.apply(attrExprs, tslib_1.__spread(getAttributeNameLiterals(key)));
                        value !== undefined && attrExprs.push(value);
                        alreadySeen.add(key);
                    }
                }
                else {
                    attrExprs.push(o.literal(key));
                }
            }
            // it's important that this occurs before BINDINGS and TEMPLATE because once `elementStart`
            // comes across the BINDINGS or TEMPLATE markers then it will continue reading each value as
            // as single property value cell by cell.
            if (styles) {
                styles.populateInitialStylingAttrs(attrExprs);
            }
            if (inputs.length || outputs.length) {
                var attrsStartIndex = attrExprs.length;
                for (var i = 0; i < inputs.length; i++) {
                    var input = inputs[i];
                    if (input.type !== 4 /* Animation */) {
                        addAttrExpr(input.name);
                    }
                }
                for (var i = 0; i < outputs.length; i++) {
                    var output = outputs[i];
                    if (output.type !== 1 /* Animation */) {
                        addAttrExpr(output.name);
                    }
                }
                // this is a cheap way of adding the marker only after all the input/output
                // values have been filtered (by not including the animation ones) and added
                // to the expressions. The marker is important because it tells the runtime
                // code that this is where attributes without values start...
                if (attrExprs.length) {
                    attrExprs.splice(attrsStartIndex, 0, o.literal(3 /* Bindings */));
                }
            }
            if (templateAttrs.length) {
                attrExprs.push(o.literal(4 /* Template */));
                templateAttrs.forEach(function (attr) { return addAttrExpr(attr.name); });
            }
            return attrExprs;
        };
        TemplateDefinitionBuilder.prototype.toAttrsParam = function (attrsExprs) {
            return attrsExprs.length > 0 ?
                this.constantPool.getConstLiteral(o.literalArr(attrsExprs), true) :
                o.TYPED_NULL_EXPR;
        };
        TemplateDefinitionBuilder.prototype.prepareRefsParameter = function (references) {
            var _this = this;
            if (!references || references.length === 0) {
                return o.TYPED_NULL_EXPR;
            }
            var refsParam = compile_metadata_1.flatten(references.map(function (reference) {
                var slot = _this.allocateDataSlot();
                // Generate the update temporary.
                var variableName = _this._bindingScope.freshReferenceName();
                var retrievalLevel = _this.level;
                var lhs = o.variable(variableName);
                _this._bindingScope.set(retrievalLevel, reference.name, lhs, 0 /* DEFAULT */, function (scope, relativeLevel) {
                    // e.g. nextContext(2);
                    var nextContextStmt = relativeLevel > 0 ? [generateNextContextExpr(relativeLevel).toStmt()] : [];
                    // e.g. const $foo$ = reference(1);
                    var refExpr = lhs.set(o.importExpr(r3_identifiers_1.Identifiers.reference).callFn([o.literal(slot)]));
                    return nextContextStmt.concat(refExpr.toConstDecl());
                }, true);
                return [reference.name, reference.value];
            }));
            return this.constantPool.getConstLiteral(util_4.asLiteral(refsParam), true);
        };
        TemplateDefinitionBuilder.prototype.prepareListenerParameter = function (tagName, outputAst, index) {
            var _this = this;
            return function () {
                var eventName = outputAst.name;
                var bindingFnName = outputAst.type === 1 /* Animation */ ?
                    // synthetic @listener.foo values are treated the exact same as are standard listeners
                    util_2.prepareSyntheticListenerFunctionName(eventName, outputAst.phase) :
                    compile_metadata_1.sanitizeIdentifier(eventName);
                var handlerName = _this.templateName + "_" + tagName + "_" + bindingFnName + "_" + index + "_listener";
                var scope = _this._bindingScope.nestedScope(_this._bindingScope.bindingLevel);
                return prepareEventListenerParameters(outputAst, handlerName, scope);
            };
        };
        return TemplateDefinitionBuilder;
    }());
    exports.TemplateDefinitionBuilder = TemplateDefinitionBuilder;
    var ValueConverter = /** @class */ (function (_super) {
        tslib_1.__extends(ValueConverter, _super);
        function ValueConverter(constantPool, allocateSlot, allocatePureFunctionSlots, definePipe) {
            var _this = _super.call(this) || this;
            _this.constantPool = constantPool;
            _this.allocateSlot = allocateSlot;
            _this.allocatePureFunctionSlots = allocatePureFunctionSlots;
            _this.definePipe = definePipe;
            _this._pipeBindExprs = [];
            return _this;
        }
        // AstMemoryEfficientTransformer
        ValueConverter.prototype.visitPipe = function (pipe, context) {
            // Allocate a slot to create the pipe
            var slot = this.allocateSlot();
            var slotPseudoLocal = "PIPE:" + slot;
            // Allocate one slot for the result plus one slot per pipe argument
            var pureFunctionSlot = this.allocatePureFunctionSlots(2 + pipe.args.length);
            var target = new ast_1.PropertyRead(pipe.span, new ast_1.ImplicitReceiver(pipe.span), slotPseudoLocal);
            var _a = pipeBindingCallInfo(pipe.args), identifier = _a.identifier, isVarLength = _a.isVarLength;
            this.definePipe(pipe.name, slotPseudoLocal, slot, o.importExpr(identifier));
            var args = tslib_1.__spread([pipe.exp], pipe.args);
            var convertedArgs = isVarLength ? this.visitAll([new ast_1.LiteralArray(pipe.span, args)]) : this.visitAll(args);
            var pipeBindExpr = new ast_1.FunctionCall(pipe.span, target, tslib_1.__spread([
                new ast_1.LiteralPrimitive(pipe.span, slot),
                new ast_1.LiteralPrimitive(pipe.span, pureFunctionSlot)
            ], convertedArgs));
            this._pipeBindExprs.push(pipeBindExpr);
            return pipeBindExpr;
        };
        ValueConverter.prototype.updatePipeSlotOffsets = function (bindingSlots) {
            this._pipeBindExprs.forEach(function (pipe) {
                // update the slot offset arg (index 1) to account for binding slots
                var slotOffset = pipe.args[1];
                slotOffset.value += bindingSlots;
            });
        };
        ValueConverter.prototype.visitLiteralArray = function (array, context) {
            var _this = this;
            return new expression_converter_1.BuiltinFunctionCall(array.span, this.visitAll(array.expressions), function (values) {
                // If the literal has calculated (non-literal) elements transform it into
                // calls to literal factories that compose the literal and will cache intermediate
                // values. Otherwise, just return an literal array that contains the values.
                var literal = o.literalArr(values);
                return values.every(function (a) { return a.isConstant(); }) ?
                    _this.constantPool.getConstLiteral(literal, true) :
                    getLiteralFactory(_this.constantPool, literal, _this.allocatePureFunctionSlots);
            });
        };
        ValueConverter.prototype.visitLiteralMap = function (map, context) {
            var _this = this;
            return new expression_converter_1.BuiltinFunctionCall(map.span, this.visitAll(map.values), function (values) {
                // If the literal has calculated (non-literal) elements  transform it into
                // calls to literal factories that compose the literal and will cache intermediate
                // values. Otherwise, just return an literal array that contains the values.
                var literal = o.literalMap(values.map(function (value, index) { return ({ key: map.keys[index].key, value: value, quoted: map.keys[index].quoted }); }));
                return values.every(function (a) { return a.isConstant(); }) ?
                    _this.constantPool.getConstLiteral(literal, true) :
                    getLiteralFactory(_this.constantPool, literal, _this.allocatePureFunctionSlots);
            });
        };
        return ValueConverter;
    }(ast_1.AstMemoryEfficientTransformer));
    exports.ValueConverter = ValueConverter;
    // Pipes always have at least one parameter, the value they operate on
    var pipeBindingIdentifiers = [r3_identifiers_1.Identifiers.pipeBind1, r3_identifiers_1.Identifiers.pipeBind2, r3_identifiers_1.Identifiers.pipeBind3, r3_identifiers_1.Identifiers.pipeBind4];
    function pipeBindingCallInfo(args) {
        var identifier = pipeBindingIdentifiers[args.length];
        return {
            identifier: identifier || r3_identifiers_1.Identifiers.pipeBindV,
            isVarLength: !identifier,
        };
    }
    var pureFunctionIdentifiers = [
        r3_identifiers_1.Identifiers.pureFunction0, r3_identifiers_1.Identifiers.pureFunction1, r3_identifiers_1.Identifiers.pureFunction2, r3_identifiers_1.Identifiers.pureFunction3, r3_identifiers_1.Identifiers.pureFunction4,
        r3_identifiers_1.Identifiers.pureFunction5, r3_identifiers_1.Identifiers.pureFunction6, r3_identifiers_1.Identifiers.pureFunction7, r3_identifiers_1.Identifiers.pureFunction8
    ];
    function pureFunctionCallInfo(args) {
        var identifier = pureFunctionIdentifiers[args.length];
        return {
            identifier: identifier || r3_identifiers_1.Identifiers.pureFunctionV,
            isVarLength: !identifier,
        };
    }
    function instruction(span, reference, params) {
        return o.importExpr(reference, null, span).callFn(params, span);
    }
    // e.g. x(2);
    function generateNextContextExpr(relativeLevelDiff) {
        return o.importExpr(r3_identifiers_1.Identifiers.nextContext)
            .callFn(relativeLevelDiff > 1 ? [o.literal(relativeLevelDiff)] : []);
    }
    function getLiteralFactory(constantPool, literal, allocateSlots) {
        var _a = constantPool.getLiteralFactory(literal), literalFactory = _a.literalFactory, literalFactoryArguments = _a.literalFactoryArguments;
        // Allocate 1 slot for the result plus 1 per argument
        var startSlot = allocateSlots(1 + literalFactoryArguments.length);
        literalFactoryArguments.length > 0 || util_1.error("Expected arguments to a literal factory function");
        var _b = pureFunctionCallInfo(literalFactoryArguments), identifier = _b.identifier, isVarLength = _b.isVarLength;
        // Literal factories are pure functions that only need to be re-invoked when the parameters
        // change.
        var args = [
            o.literal(startSlot),
            literalFactory,
        ];
        if (isVarLength) {
            args.push(o.literalArr(literalFactoryArguments));
        }
        else {
            args.push.apply(args, tslib_1.__spread(literalFactoryArguments));
        }
        return o.importExpr(identifier).callFn(args);
    }
    /**
     * Gets an array of literals that can be added to an expression
     * to represent the name and namespace of an attribute. E.g.
     * `:xlink:href` turns into `[AttributeMarker.NamespaceURI, 'xlink', 'href']`.
     *
     * @param name Name of the attribute, including the namespace.
     */
    function getAttributeNameLiterals(name) {
        var _a = tslib_1.__read(tags_1.splitNsName(name), 2), attributeNamespace = _a[0], attributeName = _a[1];
        var nameLiteral = o.literal(attributeName);
        if (attributeNamespace) {
            return [
                o.literal(0 /* NamespaceURI */), o.literal(attributeNamespace), nameLiteral
            ];
        }
        return [nameLiteral];
    }
    /** The prefix used to get a shared context in BindingScope's map. */
    var SHARED_CONTEXT_KEY = '$$shared_ctx$$';
    var BindingScope = /** @class */ (function () {
        function BindingScope(bindingLevel, parent) {
            if (bindingLevel === void 0) { bindingLevel = 0; }
            if (parent === void 0) { parent = null; }
            this.bindingLevel = bindingLevel;
            this.parent = parent;
            /** Keeps a map from local variables to their BindingData. */
            this.map = new Map();
            this.referenceNameIndex = 0;
            this.restoreViewVariable = null;
        }
        Object.defineProperty(BindingScope, "ROOT_SCOPE", {
            get: function () {
                if (!BindingScope._ROOT_SCOPE) {
                    BindingScope._ROOT_SCOPE = new BindingScope().set(0, '$event', o.variable('$event'));
                }
                return BindingScope._ROOT_SCOPE;
            },
            enumerable: true,
            configurable: true
        });
        BindingScope.prototype.get = function (name) {
            var current = this;
            while (current) {
                var value = current.map.get(name);
                if (value != null) {
                    if (current !== this) {
                        // make a local copy and reset the `declare` state
                        value = {
                            retrievalLevel: value.retrievalLevel,
                            lhs: value.lhs,
                            declareLocalCallback: value.declareLocalCallback,
                            declare: false,
                            priority: value.priority,
                            localRef: value.localRef
                        };
                        // Cache the value locally.
                        this.map.set(name, value);
                        // Possibly generate a shared context var
                        this.maybeGenerateSharedContextVar(value);
                        this.maybeRestoreView(value.retrievalLevel, value.localRef);
                    }
                    if (value.declareLocalCallback && !value.declare) {
                        value.declare = true;
                    }
                    return value.lhs;
                }
                current = current.parent;
            }
            // If we get to this point, we are looking for a property on the top level component
            // - If level === 0, we are on the top and don't need to re-declare `ctx`.
            // - If level > 0, we are in an embedded view. We need to retrieve the name of the
            // local var we used to store the component context, e.g. const $comp$ = x();
            return this.bindingLevel === 0 ? null : this.getComponentProperty(name);
        };
        /**
         * Create a local variable for later reference.
         *
         * @param retrievalLevel The level from which this value can be retrieved
         * @param name Name of the variable.
         * @param lhs AST representing the left hand side of the `let lhs = rhs;`.
         * @param priority The sorting priority of this var
         * @param declareLocalCallback The callback to invoke when declaring this local var
         * @param localRef Whether or not this is a local ref
         */
        BindingScope.prototype.set = function (retrievalLevel, name, lhs, priority, declareLocalCallback, localRef) {
            if (priority === void 0) { priority = 0 /* DEFAULT */; }
            if (this.map.has(name)) {
                if (localRef) {
                    // Do not throw an error if it's a local ref and do not update existing value,
                    // so the first defined ref is always returned.
                    return this;
                }
                util_1.error("The name " + name + " is already defined in scope to be " + this.map.get(name));
            }
            this.map.set(name, {
                retrievalLevel: retrievalLevel,
                lhs: lhs,
                declare: false,
                declareLocalCallback: declareLocalCallback,
                priority: priority,
                localRef: localRef || false
            });
            return this;
        };
        // Implemented as part of LocalResolver.
        BindingScope.prototype.getLocal = function (name) { return this.get(name); };
        // Implemented as part of LocalResolver.
        BindingScope.prototype.notifyImplicitReceiverUse = function () {
            if (this.bindingLevel !== 0) {
                // Since the implicit receiver is accessed in an embedded view, we need to
                // ensure that we declare a shared context variable for the current template
                // in the update variables.
                this.map.get(SHARED_CONTEXT_KEY + 0).declare = true;
            }
        };
        BindingScope.prototype.nestedScope = function (level) {
            var newScope = new BindingScope(level, this);
            if (level > 0)
                newScope.generateSharedContextVar(0);
            return newScope;
        };
        /**
         * Gets or creates a shared context variable and returns its expression. Note that
         * this does not mean that the shared variable will be declared. Variables in the
         * binding scope will be only declared if they are used.
         */
        BindingScope.prototype.getOrCreateSharedContextVar = function (retrievalLevel) {
            var bindingKey = SHARED_CONTEXT_KEY + retrievalLevel;
            if (!this.map.has(bindingKey)) {
                this.generateSharedContextVar(retrievalLevel);
            }
            return this.map.get(bindingKey).lhs;
        };
        BindingScope.prototype.getSharedContextName = function (retrievalLevel) {
            var sharedCtxObj = this.map.get(SHARED_CONTEXT_KEY + retrievalLevel);
            return sharedCtxObj && sharedCtxObj.declare ? sharedCtxObj.lhs : null;
        };
        BindingScope.prototype.maybeGenerateSharedContextVar = function (value) {
            if (value.priority === 1 /* CONTEXT */ &&
                value.retrievalLevel < this.bindingLevel) {
                var sharedCtxObj = this.map.get(SHARED_CONTEXT_KEY + value.retrievalLevel);
                if (sharedCtxObj) {
                    sharedCtxObj.declare = true;
                }
                else {
                    this.generateSharedContextVar(value.retrievalLevel);
                }
            }
        };
        BindingScope.prototype.generateSharedContextVar = function (retrievalLevel) {
            var lhs = o.variable(util_4.CONTEXT_NAME + this.freshReferenceName());
            this.map.set(SHARED_CONTEXT_KEY + retrievalLevel, {
                retrievalLevel: retrievalLevel,
                lhs: lhs,
                declareLocalCallback: function (scope, relativeLevel) {
                    // const ctx_r0 = nextContext(2);
                    return [lhs.set(generateNextContextExpr(relativeLevel)).toConstDecl()];
                },
                declare: false,
                priority: 2 /* SHARED_CONTEXT */,
                localRef: false
            });
        };
        BindingScope.prototype.getComponentProperty = function (name) {
            var componentValue = this.map.get(SHARED_CONTEXT_KEY + 0);
            componentValue.declare = true;
            this.maybeRestoreView(0, false);
            return componentValue.lhs.prop(name);
        };
        BindingScope.prototype.maybeRestoreView = function (retrievalLevel, localRefLookup) {
            // We want to restore the current view in listener fns if:
            // 1 - we are accessing a value in a parent view, which requires walking the view tree rather
            // than using the ctx arg. In this case, the retrieval and binding level will be different.
            // 2 - we are looking up a local ref, which requires restoring the view where the local
            // ref is stored
            if (this.isListenerScope() && (retrievalLevel < this.bindingLevel || localRefLookup)) {
                if (!this.parent.restoreViewVariable) {
                    // parent saves variable to generate a shared `const $s$ = getCurrentView();` instruction
                    this.parent.restoreViewVariable = o.variable(this.parent.freshReferenceName());
                }
                this.restoreViewVariable = this.parent.restoreViewVariable;
            }
        };
        BindingScope.prototype.restoreViewStatement = function () {
            // restoreView($state$);
            return this.restoreViewVariable ?
                [instruction(null, r3_identifiers_1.Identifiers.restoreView, [this.restoreViewVariable]).toStmt()] :
                [];
        };
        BindingScope.prototype.viewSnapshotStatements = function () {
            // const $state$ = getCurrentView();
            var getCurrentViewInstruction = instruction(null, r3_identifiers_1.Identifiers.getCurrentView, []);
            return this.restoreViewVariable ?
                [this.restoreViewVariable.set(getCurrentViewInstruction).toConstDecl()] :
                [];
        };
        BindingScope.prototype.isListenerScope = function () { return this.parent && this.parent.bindingLevel === this.bindingLevel; };
        BindingScope.prototype.variableDeclarations = function () {
            var _this = this;
            var currentContextLevel = 0;
            return Array.from(this.map.values())
                .filter(function (value) { return value.declare; })
                .sort(function (a, b) { return b.retrievalLevel - a.retrievalLevel || b.priority - a.priority; })
                .reduce(function (stmts, value) {
                var levelDiff = _this.bindingLevel - value.retrievalLevel;
                var currStmts = value.declareLocalCallback(_this, levelDiff - currentContextLevel);
                currentContextLevel = levelDiff;
                return stmts.concat(currStmts);
            }, []);
        };
        BindingScope.prototype.freshReferenceName = function () {
            var current = this;
            // Find the top scope as it maintains the global reference count
            while (current.parent)
                current = current.parent;
            var ref = "" + util_4.REFERENCE_PREFIX + current.referenceNameIndex++;
            return ref;
        };
        return BindingScope;
    }());
    exports.BindingScope = BindingScope;
    /**
     * Creates a `CssSelector` given a tag name and a map of attributes
     */
    function createCssSelector(tag, attributes) {
        var cssSelector = new selector_1.CssSelector();
        cssSelector.setElement(tag);
        Object.getOwnPropertyNames(attributes).forEach(function (name) {
            var value = attributes[name];
            cssSelector.addAttribute(name, value);
            if (name.toLowerCase() === 'class') {
                var classes = value.trim().split(/\s+/);
                classes.forEach(function (className) { return cssSelector.addClassName(className); });
            }
        });
        return cssSelector;
    }
    /**
     * Creates an array of expressions out of an `ngProjectAs` attributes
     * which can be added to the instruction parameters.
     */
    function getNgProjectAsLiteral(attribute) {
        // Parse the attribute value into a CssSelectorList. Note that we only take the
        // first selector, because we don't support multiple selectors in ngProjectAs.
        var parsedR3Selector = core.parseSelectorToR3Selector(attribute.value)[0];
        return [o.literal(5 /* ProjectAs */), util_4.asLiteral(parsedR3Selector)];
    }
    function interpolate(args) {
        args = args.slice(1); // Ignore the length prefix added for render2
        switch (args.length) {
            case 3:
                return o.importExpr(r3_identifiers_1.Identifiers.interpolation1).callFn(args);
            case 5:
                return o.importExpr(r3_identifiers_1.Identifiers.interpolation2).callFn(args);
            case 7:
                return o.importExpr(r3_identifiers_1.Identifiers.interpolation3).callFn(args);
            case 9:
                return o.importExpr(r3_identifiers_1.Identifiers.interpolation4).callFn(args);
            case 11:
                return o.importExpr(r3_identifiers_1.Identifiers.interpolation5).callFn(args);
            case 13:
                return o.importExpr(r3_identifiers_1.Identifiers.interpolation6).callFn(args);
            case 15:
                return o.importExpr(r3_identifiers_1.Identifiers.interpolation7).callFn(args);
            case 17:
                return o.importExpr(r3_identifiers_1.Identifiers.interpolation8).callFn(args);
        }
        (args.length >= 19 && args.length % 2 == 1) ||
            util_1.error("Invalid interpolation argument length " + args.length);
        return o.importExpr(r3_identifiers_1.Identifiers.interpolationV).callFn([o.literalArr(args)]);
    }
    /**
     * Gets the instruction to generate for an interpolated property
     * @param interpolation An Interpolation AST
     */
    function getPropertyInterpolationExpression(interpolation) {
        switch (getInterpolationArgsLength(interpolation)) {
            case 1:
                return r3_identifiers_1.Identifiers.propertyInterpolate;
            case 3:
                return r3_identifiers_1.Identifiers.propertyInterpolate1;
            case 5:
                return r3_identifiers_1.Identifiers.propertyInterpolate2;
            case 7:
                return r3_identifiers_1.Identifiers.propertyInterpolate3;
            case 9:
                return r3_identifiers_1.Identifiers.propertyInterpolate4;
            case 11:
                return r3_identifiers_1.Identifiers.propertyInterpolate5;
            case 13:
                return r3_identifiers_1.Identifiers.propertyInterpolate6;
            case 15:
                return r3_identifiers_1.Identifiers.propertyInterpolate7;
            case 17:
                return r3_identifiers_1.Identifiers.propertyInterpolate8;
            default:
                return r3_identifiers_1.Identifiers.propertyInterpolateV;
        }
    }
    /**
     * Gets the number of arguments expected to be passed to a generated instruction in the case of
     * interpolation instructions.
     * @param interpolation An interpolation ast
     */
    function getInterpolationArgsLength(interpolation) {
        var expressions = interpolation.expressions, strings = interpolation.strings;
        if (expressions.length === 1 && strings.length === 2 && strings[0] === '' && strings[1] === '') {
            // If the interpolation has one interpolated value, but the prefix and suffix are both empty
            // strings, we only pass one argument, to a special instruction like `propertyInterpolate` or
            // `textInterpolate`.
            return 1;
        }
        else {
            return expressions.length + strings.length;
        }
    }
    /**
     * Parse a template into render3 `Node`s and additional metadata, with no other dependencies.
     *
     * @param template text of the template to parse
     * @param templateUrl URL to use for source mapping of the parsed template
     * @param options options to modify how the template is parsed
     */
    function parseTemplate(template, templateUrl, options) {
        if (options === void 0) { options = {}; }
        var interpolationConfig = options.interpolationConfig, preserveWhitespaces = options.preserveWhitespaces;
        var bindingParser = makeBindingParser(interpolationConfig);
        var htmlParser = new html_parser_1.HtmlParser();
        var parseResult = htmlParser.parse(template, templateUrl, tslib_1.__assign({}, options, { tokenizeExpansionForms: true, leadingTriviaChars: LEADING_TRIVIA_CHARS }));
        if (parseResult.errors && parseResult.errors.length > 0) {
            return { errors: parseResult.errors, nodes: [], styleUrls: [], styles: [] };
        }
        var rootNodes = parseResult.rootNodes;
        // process i18n meta information (scan attributes, generate ids)
        // before we run whitespace removal process, because existing i18n
        // extraction process (ng xi18n) relies on a raw content to generate
        // message ids
        rootNodes =
            html.visitAll(new meta_1.I18nMetaVisitor(interpolationConfig, !preserveWhitespaces), rootNodes);
        if (!preserveWhitespaces) {
            rootNodes = html.visitAll(new html_whitespaces_1.WhitespaceVisitor(), rootNodes);
            // run i18n meta visitor again in case we remove whitespaces, because
            // that might affect generated i18n message content. During this pass
            // i18n IDs generated at the first pass will be preserved, so we can mimic
            // existing extraction process (ng xi18n)
            rootNodes = html.visitAll(new meta_1.I18nMetaVisitor(interpolationConfig, /* keepI18nAttrs */ false), rootNodes);
        }
        var _a = r3_template_transform_1.htmlAstToRender3Ast(rootNodes, bindingParser), nodes = _a.nodes, errors = _a.errors, styleUrls = _a.styleUrls, styles = _a.styles;
        if (errors && errors.length > 0) {
            return { errors: errors, nodes: [], styleUrls: [], styles: [] };
        }
        return { nodes: nodes, styleUrls: styleUrls, styles: styles };
    }
    exports.parseTemplate = parseTemplate;
    /**
     * Construct a `BindingParser` with a default configuration.
     */
    function makeBindingParser(interpolationConfig) {
        if (interpolationConfig === void 0) { interpolationConfig = interpolation_config_1.DEFAULT_INTERPOLATION_CONFIG; }
        return new binding_parser_1.BindingParser(new parser_1.Parser(new lexer_1.Lexer()), interpolationConfig, new dom_element_schema_registry_1.DomElementSchemaRegistry(), null, []);
    }
    exports.makeBindingParser = makeBindingParser;
    function resolveSanitizationFn(context, isAttribute) {
        switch (context) {
            case core.SecurityContext.HTML:
                return o.importExpr(r3_identifiers_1.Identifiers.sanitizeHtml);
            case core.SecurityContext.SCRIPT:
                return o.importExpr(r3_identifiers_1.Identifiers.sanitizeScript);
            case core.SecurityContext.STYLE:
                // the compiler does not fill in an instruction for [style.prop?] binding
                // values because the style algorithm knows internally what props are subject
                // to sanitization (only [attr.style] values are explicitly sanitized)
                return isAttribute ? o.importExpr(r3_identifiers_1.Identifiers.sanitizeStyle) : null;
            case core.SecurityContext.URL:
                return o.importExpr(r3_identifiers_1.Identifiers.sanitizeUrl);
            case core.SecurityContext.RESOURCE_URL:
                return o.importExpr(r3_identifiers_1.Identifiers.sanitizeResourceUrl);
            default:
                return null;
        }
    }
    exports.resolveSanitizationFn = resolveSanitizationFn;
    function isSingleElementTemplate(children) {
        return children.length === 1 && children[0] instanceof t.Element;
    }
    function isTextNode(node) {
        return node instanceof t.Text || node instanceof t.BoundText || node instanceof t.Icu;
    }
    function hasTextChildrenOnly(children) {
        return children.every(isTextNode);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvcmVuZGVyMy92aWV3L3RlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7OztJQUVILDJFQUFtRTtJQUNuRSxpR0FBK0s7SUFFL0ssaURBQW1DO0lBQ25DLG1FQUFtTztJQUNuTyx1RUFBb0Q7SUFDcEQseUVBQXNEO0lBRXRELDBEQUE0QztJQUM1QywyRUFBdUQ7SUFDdkQscUZBQW1FO0lBQ25FLDZGQUF1RztJQUV2Ryw2REFBc0Y7SUFDdEYsa0VBQWlEO0lBQ2pELDJEQUE2QztJQUU3Qyx3R0FBa0Y7SUFDbEYsMkRBQTREO0lBQzVELHVGQUFtRTtJQUNuRSxtREFBaUM7SUFDakMsd0RBQStCO0lBQy9CLCtFQUFvRDtJQUNwRCw2RkFBNkQ7SUFDN0QsMkRBQXlIO0lBRXpILDJFQUEyQztJQUMzQyxxRUFBNEM7SUFDNUMsaUZBQTJEO0lBQzNELHFFQUFvVTtJQUNwVSxzRkFBOEQ7SUFDOUQsZ0VBQTZMO0lBRzdMLDRDQUE0QztJQUM1QyxJQUFNLHNCQUFzQixHQUFHLFFBQVEsQ0FBQztJQUV4QyxtQ0FBbUM7SUFDbkMsSUFBTSx1QkFBdUIsR0FBRyxhQUFhLENBQUM7SUFFOUMsdURBQXVEO0lBQ3ZELElBQU0sdUJBQXVCLEdBQUcsSUFBSSxHQUFHLENBQ25DLENBQUMsQ0FBQyxRQUFRLEVBQUUsNEJBQUUsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSw0QkFBRSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLDRCQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRWhHLElBQU0sb0JBQW9CLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUVyRCwwQkFB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QUMsZUFBZSxDQUFDLFlBQVk7Z0JBQ3BDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsQ0FBQyw0QkFBRSxDQUFDLG1CQUFtQixDQUFDLENBQUM7WUFDOUM7Z0JBQ0UsT0FBTyxJQUFJLENBQUM7U0FDZjtJQUNILENBQUM7SUFsQkQsc0RBa0JDO0lBRUQsU0FBUyx1QkFBdUIsQ0FBQyxRQUFrQjtRQUNqRCxPQUFPLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDO0lBQ25FLENBQUM7SUFFRCxTQUFTLFVBQVUsQ0FBQyxJQUFZO1FBQzlCLE9BQU8sSUFBSSxZQUFZLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxZQUFZLENBQUMsQ0FBQyxTQUFTLElBQUksSUFBSSxZQUFZLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDeEYsQ0FBQztJQUVELFNBQVMsbUJBQW1CLENBQUMsUUFBa0I7UUFDN0MsT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3BDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7ZmxhdHRlbiwgc2FuaXRpemVJZGVudGlmaWVyfSBmcm9tICcuLi8uLi9jb21waWxlX21ldGFkYXRhJztcbmltcG9ydCB7QmluZGluZ0Zvcm0sIEJ1aWx0aW5GdW5jdGlvbkNhbGwsIExvY2FsUmVzb2x2ZXIsIGNvbnZlcnRBY3Rpb25CaW5kaW5nLCBjb252ZXJ0UHJvcGVydHlCaW5kaW5nLCBjb252ZXJ0VXBkYXRlQXJndW1lbnRzfSBmcm9tICcuLi8uLi9jb21waWxlcl91dGlsL2V4cHJlc3Npb25fY29udmVydGVyJztcbmltcG9ydCB7Q29uc3RhbnRQb29sfSBmcm9tICcuLi8uLi9jb25zdGFudF9wb29sJztcbmltcG9ydCAqIGFzIGNvcmUgZnJvbSAnLi4vLi4vY29yZSc7XG5pbXBvcnQge0FTVCwgQXN0TWVtb3J5RWZmaWNpZW50VHJhbnNmb3JtZXIsIEJpbmRpbmdQaXBlLCBCaW5kaW5nVHlwZSwgRnVuY3Rpb25DYWxsLCBJbXBsaWNpdFJlY2VpdmVyLCBJbnRlcnBvbGF0aW9uLCBMaXRlcmFsQXJyYXksIExpdGVyYWxNYXAsIExpdGVyYWxQcmltaXRpdmUsIFBhcnNlZEV2ZW50VHlwZSwgUHJvcGVydHlSZWFkfSBmcm9tICcuLi8uLi9leHByZXNzaW9uX3BhcnNlci9hc3QnO1xuaW1wb3J0IHtMZXhlcn0gZnJvbSAnLi4vLi4vZXhwcmVzc2lvbl9wYXJzZXIvbGV4ZXInO1xuaW1wb3J0IHtQYXJzZXJ9IGZyb20gJy4uLy4uL2V4cHJlc3Npb25fcGFyc2VyL3BhcnNlcic7XG5pbXBvcnQgKiBhcyBpMThuIGZyb20gJy4uLy4uL2kxOG4vaTE4bl9hc3QnO1xuaW1wb3J0ICogYXMgaHRtbCBmcm9tICcuLi8uLi9tbF9wYXJzZXIvYXN0JztcbmltcG9ydCB7SHRtbFBhcnNlcn0gZnJvbSAnLi4vLi4vbWxfcGFyc2VyL2h0bWxfcGFyc2VyJztcbmltcG9ydCB7V2hpdGVzcGFjZVZpc2l0b3J9IGZyb20gJy4uLy4uL21sX3BhcnNlci9odG1sX3doaXRlc3BhY2VzJztcbmltcG9ydCB7REVGQVVMVF9JTlRFUlBPTEFUSU9OX0NPTkZJRywgSW50ZXJwb2xhdGlvbkNvbmZpZ30gZnJvbSAnLi4vLi4vbWxfcGFyc2VyL2ludGVycG9sYXRpb25fY29uZmlnJztcbmltcG9ydCB7TGV4ZXJSYW5nZX0gZnJvbSAnLi4vLi4vbWxfcGFyc2VyL2xleGVyJztcbmltcG9ydCB7aXNOZ0NvbnRhaW5lciBhcyBjaGVja0lzTmdDb250YWluZXIsIHNwbGl0TnNOYW1lfSBmcm9tICcuLi8uLi9tbF9wYXJzZXIvdGFncyc7XG5pbXBvcnQge21hcExpdGVyYWx9IGZyb20gJy4uLy4uL291dHB1dC9tYXBfdXRpbCc7XG5pbXBvcnQgKiBhcyBvIGZyb20gJy4uLy4uL291dHB1dC9vdXRwdXRfYXN0JztcbmltcG9ydCB7UGFyc2VFcnJvciwgUGFyc2VTb3VyY2VTcGFufSBmcm9tICcuLi8uLi9wYXJzZV91dGlsJztcbmltcG9ydCB7RG9tRWxlbWVudFNjaGVtYVJlZ2lzdHJ5fSBmcm9tICcuLi8uLi9zY2hlbWEvZG9tX2VsZW1lbnRfc2NoZW1hX3JlZ2lzdHJ5JztcbmltcG9ydCB7Q3NzU2VsZWN0b3IsIFNlbGVjdG9yTWF0Y2hlcn0gZnJvbSAnLi4vLi4vc2VsZWN0b3InO1xuaW1wb3J0IHtCaW5kaW5nUGFyc2VyfSBmcm9tICcuLi8uLi90ZW1wbGF0ZV9wYXJzZXIvYmluZGluZ19wYXJzZXInO1xuaW1wb3J0IHtlcnJvcn0gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQgKiBhcyB0IGZyb20gJy4uL3IzX2FzdCc7XG5pbXBvcnQge0lkZW50aWZpZXJzIGFzIFIzfSBmcm9tICcuLi9yM19pZGVudGlmaWVycyc7XG5pbXBvcnQge2h0bWxBc3RUb1JlbmRlcjNBc3R9IGZyb20gJy4uL3IzX3RlbXBsYXRlX3RyYW5zZm9ybSc7XG5pbXBvcnQge3ByZXBhcmVTeW50aGV0aWNMaXN0ZW5lckZ1bmN0aW9uTmFtZSwgcHJlcGFyZVN5bnRoZXRpY0xpc3RlbmVyTmFtZSwgcHJlcGFyZVN5bnRoZXRpY1Byb3BlcnR5TmFtZX0gZnJvbSAnLi4vdXRpbCc7XG5cbmltcG9ydCB7STE4bkNvbnRleHR9IGZyb20gJy4vaTE4bi9jb250ZXh0JztcbmltcG9ydCB7STE4bk1ldGFWaXNpdG9yfSBmcm9tICcuL2kxOG4vbWV0YSc7XG5pbXBvcnQge2dldFNlcmlhbGl6ZWRJMThuQ29udGVudH0gZnJvbSAnLi9pMThuL3NlcmlhbGl6ZXInO1xuaW1wb3J0IHtJMThOX0lDVV9NQVBQSU5HX1BSRUZJWCwgVFJBTlNMQVRJT05fUFJFRklYLCBhc3NlbWJsZUJvdW5kVGV4dFBsYWNlaG9sZGVycywgYXNzZW1ibGVJMThuQm91bmRTdHJpbmcsIGZvcm1hdEkxOG5QbGFjZWhvbGRlck5hbWUsIGdldFRyYW5zbGF0aW9uQ29uc3RQcmVmaXgsIGdldFRyYW5zbGF0aW9uRGVjbFN0bXRzLCBpY3VGcm9tSTE4bk1lc3NhZ2UsIGlzSTE4blJvb3ROb2RlLCBpc1NpbmdsZUkxOG5JY3UsIG1ldGFGcm9tSTE4bk1lc3NhZ2UsIHBsYWNlaG9sZGVyc1RvUGFyYW1zLCB3cmFwSTE4blBsYWNlaG9sZGVyfSBmcm9tICcuL2kxOG4vdXRpbCc7XG5pbXBvcnQge0luc3RydWN0aW9uLCBTdHlsaW5nQnVpbGRlcn0gZnJvbSAnLi9zdHlsaW5nX2J1aWxkZXInO1xuaW1wb3J0IHtDT05URVhUX05BTUUsIElNUExJQ0lUX1JFRkVSRU5DRSwgTk9OX0JJTkRBQkxFX0FUVFIsIFJFRkVSRU5DRV9QUkVGSVgsIFJFTkRFUl9GTEFHUywgYXNMaXRlcmFsLCBnZXRBdHRyc0ZvckRpcmVjdGl2ZU1hdGNoaW5nLCBpbnZhbGlkLCB0cmltVHJhaWxpbmdOdWxscywgdW5zdXBwb3J0ZWR9IGZyb20gJy4vdXRpbCc7XG5cblxuLy8gU2VsZWN0b3IgYXR0cmlidXRlIG5hbWUgb2YgYDxuZy1jb250ZW50PmBcbmNvbnN0IE5HX0NPTlRFTlRfU0VMRUNUX0FUVFIgPSAnc2VsZWN0JztcblxuLy8gQXR0cmlidXRlIG5hbWUgb2YgYG5nUHJvamVjdEFzYC5cbmNvbnN0IE5HX1BST0pFQ1RfQVNfQVRUUl9OQU1FID0gJ25nUHJvamVjdEFzJztcblxuLy8gTGlzdCBvZiBzdXBwb3J0ZWQgZ2xvYmFsIHRhcmdldHMgZm9yIGV2ZW50IGxpc3RlbmVyc1xuY29uc3QgR0xPQkFMX1RBUkdFVF9SRVNPTFZFUlMgPSBuZXcgTWFwPHN0cmluZywgby5FeHRlcm5hbFJlZmVyZW5jZT4oXG4gICAgW1snd2luZG93JywgUjMucmVzb2x2ZVdpbmRvd10sIFsnZG9jdW1lbnQnLCBSMy5yZXNvbHZlRG9jdW1lbnRdLCBbJ2JvZHknLCBSMy5yZXNvbHZlQm9keV1dKTtcblxuY29uc3QgTEVBRElOR19UUklWSUFfQ0hBUlMgPSBbJyAnLCAnXFxuJywgJ1xccicsICdcXHQnXTtcblxuLy8gIGlmIChyZiAmIGZsYWdzKSB7IC4uIH1cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJGbGFnQ2hlY2tJZlN0bXQoXG4gICAgZmxhZ3M6IGNvcmUuUmVuZGVyRmxhZ3MsIHN0YXRlbWVudHM6IG8uU3RhdGVtZW50W10pOiBvLklmU3RtdCB7XG4gIHJldHVybiBvLmlmU3RtdChvLnZhcmlhYmxlKFJFTkRFUl9GTEFHUykuYml0d2lzZUFuZChvLmxpdGVyYWwoZmxhZ3MpLCBudWxsLCBmYWxzZSksIHN0YXRlbWVudHMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJlcGFyZUV2ZW50TGlzdGVuZXJQYXJhbWV0ZXJzKFxuICAgIGV2ZW50QXN0OiB0LkJvdW5kRXZlbnQsIGhhbmRsZXJOYW1lOiBzdHJpbmcgfCBudWxsID0gbnVsbCxcbiAgICBzY29wZTogQmluZGluZ1Njb3BlIHwgbnVsbCA9IG51bGwpOiBvLkV4cHJlc3Npb25bXSB7XG4gIGNvbnN0IHt0eXBlLCBuYW1lLCB0YXJnZXQsIHBoYXNlLCBoYW5kbGVyfSA9IGV2ZW50QXN0O1xuICBpZiAodGFyZ2V0ICYmICFHTE9CQUxfVEFSR0VUX1JFU09MVkVSUy5oYXModGFyZ2V0KSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgVW5leHBlY3RlZCBnbG9iYWwgdGFyZ2V0ICcke3RhcmdldH0nIGRlZmluZWQgZm9yICcke25hbWV9JyBldmVudC5cbiAgICAgICAgU3VwcG9ydGVkIGxpc3Qgb2YgZ2xvYmFsIHRhcmdldHM6ICR7QXJyYXkuZnJvbShHTE9CQUxfVEFSR0VUX1JFU09MVkVSUy5rZXlzKCkpfS5gKTtcbiAgfVxuXG4gIGNvbnN0IGltcGxpY2l0UmVjZWl2ZXJFeHByID0gKHNjb3BlID09PSBudWxsIHx8IHNjb3BlLmJpbmRpbmdMZXZlbCA9PT0gMCkgP1xuICAgICAgby52YXJpYWJsZShDT05URVhUX05BTUUpIDpcbiAgICAgIHNjb3BlLmdldE9yQ3JlYXRlU2hhcmVkQ29udGV4dFZhcigwKTtcbiAgY29uc3QgYmluZGluZ0V4cHIgPSBjb252ZXJ0QWN0aW9uQmluZGluZyhcbiAgICAgIHNjb3BlLCBpbXBsaWNpdFJlY2VpdmVyRXhwciwgaGFuZGxlciwgJ2InLCAoKSA9PiBlcnJvcignVW5leHBlY3RlZCBpbnRlcnBvbGF0aW9uJyksXG4gICAgICBldmVudEFzdC5oYW5kbGVyU3Bhbik7XG5cbiAgY29uc3Qgc3RhdGVtZW50cyA9IFtdO1xuICBpZiAoc2NvcGUpIHtcbiAgICBzdGF0ZW1lbnRzLnB1c2goLi4uc2NvcGUucmVzdG9yZVZpZXdTdGF0ZW1lbnQoKSk7XG4gICAgc3RhdGVtZW50cy5wdXNoKC4uLnNjb3BlLnZhcmlhYmxlRGVjbGFyYXRpb25zKCkpO1xuICB9XG4gIHN0YXRlbWVudHMucHVzaCguLi5iaW5kaW5nRXhwci5yZW5kZXIzU3RtdHMpO1xuXG4gIGNvbnN0IGV2ZW50TmFtZTogc3RyaW5nID1cbiAgICAgIHR5cGUgPT09IFBhcnNlZEV2ZW50VHlwZS5BbmltYXRpb24gPyBwcmVwYXJlU3ludGhldGljTGlzdGVuZXJOYW1lKG5hbWUsIHBoYXNlICEpIDogbmFtZTtcbiAgY29uc3QgZm5OYW1lID0gaGFuZGxlck5hbWUgJiYgc2FuaXRpemVJZGVudGlmaWVyKGhhbmRsZXJOYW1lKTtcbiAgY29uc3QgZm5BcmdzID0gW25ldyBvLkZuUGFyYW0oJyRldmVudCcsIG8uRFlOQU1JQ19UWVBFKV07XG4gIGNvbnN0IGhhbmRsZXJGbiA9IG8uZm4oZm5BcmdzLCBzdGF0ZW1lbnRzLCBvLklORkVSUkVEX1RZUEUsIG51bGwsIGZuTmFtZSk7XG5cbiAgY29uc3QgcGFyYW1zOiBvLkV4cHJlc3Npb25bXSA9IFtvLmxpdGVyYWwoZXZlbnROYW1lKSwgaGFuZGxlckZuXTtcbiAgaWYgKHRhcmdldCkge1xuICAgIHBhcmFtcy5wdXNoKFxuICAgICAgICBvLmxpdGVyYWwoZmFsc2UpLCAgLy8gYHVzZUNhcHR1cmVgIGZsYWcsIGRlZmF1bHRzIHRvIGBmYWxzZWBcbiAgICAgICAgby5pbXBvcnRFeHByKEdMT0JBTF9UQVJHRVRfUkVTT0xWRVJTLmdldCh0YXJnZXQpICEpKTtcbiAgfVxuICByZXR1cm4gcGFyYW1zO1xufVxuXG5leHBvcnQgY2xhc3MgVGVtcGxhdGVEZWZpbml0aW9uQnVpbGRlciBpbXBsZW1lbnRzIHQuVmlzaXRvcjx2b2lkPiwgTG9jYWxSZXNvbHZlciB7XG4gIHByaXZhdGUgX2RhdGFJbmRleCA9IDA7XG4gIHByaXZhdGUgX2JpbmRpbmdDb250ZXh0ID0gMDtcbiAgcHJpdmF0ZSBfcHJlZml4Q29kZTogby5TdGF0ZW1lbnRbXSA9IFtdO1xuICAvKipcbiAgICogTGlzdCBvZiBjYWxsYmFja3MgdG8gZ2VuZXJhdGUgY3JlYXRpb24gbW9kZSBpbnN0cnVjdGlvbnMuIFdlIHN0b3JlIHRoZW0gaGVyZSBhcyB3ZSBwcm9jZXNzXG4gICAqIHRoZSB0ZW1wbGF0ZSBzbyBiaW5kaW5ncyBpbiBsaXN0ZW5lcnMgYXJlIHJlc29sdmVkIG9ubHkgb25jZSBhbGwgbm9kZXMgaGF2ZSBiZWVuIHZpc2l0ZWQuXG4gICAqIFRoaXMgZW5zdXJlcyBhbGwgbG9jYWwgcmVmcyBhbmQgY29udGV4dCB2YXJpYWJsZXMgYXJlIGF2YWlsYWJsZSBmb3IgbWF0Y2hpbmcuXG4gICAqL1xuICBwcml2YXRlIF9jcmVhdGlvbkNvZGVGbnM6ICgoKSA9PiBvLlN0YXRlbWVudClbXSA9IFtdO1xuICAvKipcbiAgICogTGlzdCBvZiBjYWxsYmFja3MgdG8gZ2VuZXJhdGUgdXBkYXRlIG1vZGUgaW5zdHJ1Y3Rpb25zLiBXZSBzdG9yZSB0aGVtIGhlcmUgYXMgd2UgcHJvY2Vzc1xuICAgKiB0aGUgdGVtcGxhdGUgc28gYmluZGluZ3MgYXJlIHJlc29sdmVkIG9ubHkgb25jZSBhbGwgbm9kZXMgaGF2ZSBiZWVuIHZpc2l0ZWQuIFRoaXMgZW5zdXJlc1xuICAgKiBhbGwgbG9jYWwgcmVmcyBhbmQgY29udGV4dCB2YXJpYWJsZXMgYXJlIGF2YWlsYWJsZSBmb3IgbWF0Y2hpbmcuXG4gICAqL1xuICBwcml2YXRlIF91cGRhdGVDb2RlRm5zOiAoKCkgPT4gby5TdGF0ZW1lbnQpW10gPSBbXTtcbiAgLyoqXG4gICAqIE1lbW9yaXplcyB0aGUgbGFzdCBub2RlIGluZGV4IGZvciB3aGljaCBhIHNlbGVjdCBpbnN0cnVjdGlvbiBoYXMgYmVlbiBnZW5lcmF0ZWQuXG4gICAqIFdlJ3JlIGluaXRpYWxpemluZyB0aGlzIHRvIC0xIHRvIGVuc3VyZSB0aGUgYHNlbGVjdCgwKWAgaW5zdHJ1Y3Rpb24gaXMgZ2VuZXJhdGVkIGJlZm9yZSBhbnlcbiAgICogcmVsZXZhbnQgdXBkYXRlIGluc3RydWN0aW9ucy5cbiAgICovXG4gIHByaXZhdGUgX2xhc3ROb2RlSW5kZXhXaXRoRmx1c2g6IG51bWJlciA9IC0xO1xuICAvKiogVGVtcG9yYXJ5IHZhcmlhYmxlIGRlY2xhcmF0aW9ucyBnZW5lcmF0ZWQgZnJvbSB2aXNpdGluZyBwaXBlcywgbGl0ZXJhbHMsIGV0Yy4gKi9cbiAgcHJpdmF0ZSBfdGVtcFZhcmlhYmxlczogby5TdGF0ZW1lbnRbXSA9IFtdO1xuICAvKipcbiAgICogTGlzdCBvZiBjYWxsYmFja3MgdG8gYnVpbGQgbmVzdGVkIHRlbXBsYXRlcy4gTmVzdGVkIHRlbXBsYXRlcyBtdXN0IG5vdCBiZSB2aXNpdGVkIHVudGlsXG4gICAqIGFmdGVyIHRoZSBwYXJlbnQgdGVtcGxhdGUgaGFzIGZpbmlzaGVkIHZpc2l0aW5nIGFsbCBvZiBpdHMgbm9kZXMuIFRoaXMgZW5zdXJlcyB0aGF0IGFsbFxuICAgKiBsb2NhbCByZWYgYmluZGluZ3MgaW4gbmVzdGVkIHRlbXBsYXRlcyBhcmUgYWJsZSB0byBmaW5kIGxvY2FsIHJlZiB2YWx1ZXMgaWYgdGhlIHJlZnNcbiAgICogYXJlIGRlZmluZWQgYWZ0ZXIgdGhlIHRlbXBsYXRlIGRlY2xhcmF0aW9uLlxuICAgKi9cbiAgcHJpdmF0ZSBfbmVzdGVkVGVtcGxhdGVGbnM6ICgoKSA9PiB2b2lkKVtdID0gW107XG4gIC8qKlxuICAgKiBUaGlzIHNjb3BlIGNvbnRhaW5zIGxvY2FsIHZhcmlhYmxlcyBkZWNsYXJlZCBpbiB0aGUgdXBkYXRlIG1vZGUgYmxvY2sgb2YgdGhlIHRlbXBsYXRlLlxuICAgKiAoZS5nLiByZWZzIGFuZCBjb250ZXh0IHZhcnMgaW4gYmluZGluZ3MpXG4gICAqL1xuICBwcml2YXRlIF9iaW5kaW5nU2NvcGU6IEJpbmRpbmdTY29wZTtcbiAgcHJpdmF0ZSBfdmFsdWVDb252ZXJ0ZXI6IFZhbHVlQ29udmVydGVyO1xuICBwcml2YXRlIF91bnN1cHBvcnRlZCA9IHVuc3VwcG9ydGVkO1xuXG4gIC8vIGkxOG4gY29udGV4dCBsb2NhbCB0byB0aGlzIHRlbXBsYXRlXG4gIHByaXZhdGUgaTE4bjogSTE4bkNvbnRleHR8bnVsbCA9IG51bGw7XG5cbiAgLy8gTnVtYmVyIG9mIHNsb3RzIHRvIHJlc2VydmUgZm9yIHB1cmVGdW5jdGlvbnNcbiAgcHJpdmF0ZSBfcHVyZUZ1bmN0aW9uU2xvdHMgPSAwO1xuXG4gIC8vIE51bWJlciBvZiBiaW5kaW5nIHNsb3RzXG4gIHByaXZhdGUgX2JpbmRpbmdTbG90cyA9IDA7XG5cbiAgcHJpdmF0ZSBmaWxlQmFzZWRJMThuU3VmZml4OiBzdHJpbmc7XG5cbiAgLy8gUHJvamVjdGlvbiBzbG90cyBmb3VuZCBpbiB0aGUgdGVtcGxhdGUuIFByb2plY3Rpb24gc2xvdHMgY2FuIGRpc3RyaWJ1dGUgcHJvamVjdGVkXG4gIC8vIG5vZGVzIGJhc2VkIG9uIGEgc2VsZWN0b3IsIG9yIGNhbiBqdXN0IHVzZSB0aGUgd2lsZGNhcmQgc2VsZWN0b3IgdG8gbWF0Y2hcbiAgLy8gYWxsIG5vZGVzIHdoaWNoIGFyZW4ndCBtYXRjaGluZyBhbnkgc2VsZWN0b3IuXG4gIHByaXZhdGUgX25nQ29udGVudFJlc2VydmVkU2xvdHM6IChzdHJpbmd8JyonKVtdID0gW107XG5cbiAgLy8gTnVtYmVyIG9mIG5vbi1kZWZhdWx0IHNlbGVjdG9ycyBmb3VuZCBpbiBhbGwgcGFyZW50IHRlbXBsYXRlcyBvZiB0aGlzIHRlbXBsYXRlLiBXZSBuZWVkIHRvXG4gIC8vIHRyYWNrIGl0IHRvIHByb3Blcmx5IGFkanVzdCBwcm9qZWN0aW9uIHNsb3QgaW5kZXggaW4gdGhlIGBwcm9qZWN0aW9uYCBpbnN0cnVjdGlvbi5cbiAgcHJpdmF0ZSBfbmdDb250ZW50U2VsZWN0b3JzT2Zmc2V0ID0gMDtcblxuICAvLyBFeHByZXNzaW9uIHRoYXQgc2hvdWxkIGJlIHVzZWQgYXMgaW1wbGljaXQgcmVjZWl2ZXIgd2hlbiBjb252ZXJ0aW5nIHRlbXBsYXRlXG4gIC8vIGV4cHJlc3Npb25zIHRvIG91dHB1dCBBU1QuXG4gIHByaXZhdGUgX2ltcGxpY2l0UmVjZWl2ZXJFeHByOiBvLlJlYWRWYXJFeHByfG51bGwgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBjb25zdGFudFBvb2w6IENvbnN0YW50UG9vbCwgcGFyZW50QmluZGluZ1Njb3BlOiBCaW5kaW5nU2NvcGUsIHByaXZhdGUgbGV2ZWwgPSAwLFxuICAgICAgcHJpdmF0ZSBjb250ZXh0TmFtZTogc3RyaW5nfG51bGwsIHByaXZhdGUgaTE4bkNvbnRleHQ6IEkxOG5Db250ZXh0fG51bGwsXG4gICAgICBwcml2YXRlIHRlbXBsYXRlSW5kZXg6IG51bWJlcnxudWxsLCBwcml2YXRlIHRlbXBsYXRlTmFtZTogc3RyaW5nfG51bGwsXG4gICAgICBwcml2YXRlIGRpcmVjdGl2ZU1hdGNoZXI6IFNlbGVjdG9yTWF0Y2hlcnxudWxsLCBwcml2YXRlIGRpcmVjdGl2ZXM6IFNldDxvLkV4cHJlc3Npb24+LFxuICAgICAgcHJpdmF0ZSBwaXBlVHlwZUJ5TmFtZTogTWFwPHN0cmluZywgby5FeHByZXNzaW9uPiwgcHJpdmF0ZSBwaXBlczogU2V0PG8uRXhwcmVzc2lvbj4sXG4gICAgICBwcml2YXRlIF9uYW1lc3BhY2U6IG8uRXh0ZXJuYWxSZWZlcmVuY2UsIHByaXZhdGUgcmVsYXRpdmVDb250ZXh0RmlsZVBhdGg6IHN0cmluZyxcbiAgICAgIHByaXZhdGUgaTE4blVzZUV4dGVybmFsSWRzOiBib29sZWFuKSB7XG4gICAgdGhpcy5fYmluZGluZ1Njb3BlID0gcGFyZW50QmluZGluZ1Njb3BlLm5lc3RlZFNjb3BlKGxldmVsKTtcblxuICAgIC8vIFR1cm4gdGhlIHJlbGF0aXZlIGNvbnRleHQgZmlsZSBwYXRoIGludG8gYW4gaWRlbnRpZmllciBieSByZXBsYWNpbmcgbm9uLWFscGhhbnVtZXJpY1xuICAgIC8vIGNoYXJhY3RlcnMgd2l0aCB1bmRlcnNjb3Jlcy5cbiAgICB0aGlzLmZpbGVCYXNlZEkxOG5TdWZmaXggPSByZWxhdGl2ZUNvbnRleHRGaWxlUGF0aC5yZXBsYWNlKC9bXkEtWmEtejAtOV0vZywgJ18nKSArICdfJztcblxuICAgIHRoaXMuX3ZhbHVlQ29udmVydGVyID0gbmV3IFZhbHVlQ29udmVydGVyKFxuICAgICAgICBjb25zdGFudFBvb2wsICgpID0+IHRoaXMuYWxsb2NhdGVEYXRhU2xvdCgpLFxuICAgICAgICAobnVtU2xvdHM6IG51bWJlcikgPT4gdGhpcy5hbGxvY2F0ZVB1cmVGdW5jdGlvblNsb3RzKG51bVNsb3RzKSxcbiAgICAgICAgKG5hbWUsIGxvY2FsTmFtZSwgc2xvdCwgdmFsdWU6IG8uUmVhZFZhckV4cHIpID0+IHtcbiAgICAgICAgICBjb25zdCBwaXBlVHlwZSA9IHBpcGVUeXBlQnlOYW1lLmdldChuYW1lKTtcbiAgICAgICAgICBpZiAocGlwZVR5cGUpIHtcbiAgICAgICAgICAgIHRoaXMucGlwZXMuYWRkKHBpcGVUeXBlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5fYmluZGluZ1Njb3BlLnNldCh0aGlzLmxldmVsLCBsb2NhbE5hbWUsIHZhbHVlKTtcbiAgICAgICAgICB0aGlzLmNyZWF0aW9uSW5zdHJ1Y3Rpb24obnVsbCwgUjMucGlwZSwgW28ubGl0ZXJhbChzbG90KSwgby5saXRlcmFsKG5hbWUpXSk7XG4gICAgICAgIH0pO1xuICB9XG5cbiAgcmVnaXN0ZXJDb250ZXh0VmFyaWFibGVzKHZhcmlhYmxlOiB0LlZhcmlhYmxlKSB7XG4gICAgY29uc3Qgc2NvcGVkTmFtZSA9IHRoaXMuX2JpbmRpbmdTY29wZS5mcmVzaFJlZmVyZW5jZU5hbWUoKTtcbiAgICBjb25zdCByZXRyaWV2YWxMZXZlbCA9IHRoaXMubGV2ZWw7XG4gICAgY29uc3QgbGhzID0gby52YXJpYWJsZSh2YXJpYWJsZS5uYW1lICsgc2NvcGVkTmFtZSk7XG4gICAgdGhpcy5fYmluZGluZ1Njb3BlLnNldChcbiAgICAgICAgcmV0cmlldmFsTGV2ZWwsIHZhcmlhYmxlLm5hbWUsIGxocywgRGVjbGFyYXRpb25Qcmlvcml0eS5DT05URVhULFxuICAgICAgICAoc2NvcGU6IEJpbmRpbmdTY29wZSwgcmVsYXRpdmVMZXZlbDogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgbGV0IHJoczogby5FeHByZXNzaW9uO1xuICAgICAgICAgIGlmIChzY29wZS5iaW5kaW5nTGV2ZWwgPT09IHJldHJpZXZhbExldmVsKSB7XG4gICAgICAgICAgICAvLyBlLmcuIGN0eFxuICAgICAgICAgICAgcmhzID0gby52YXJpYWJsZShDT05URVhUX05BTUUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBzaGFyZWRDdHhWYXIgPSBzY29wZS5nZXRTaGFyZWRDb250ZXh0TmFtZShyZXRyaWV2YWxMZXZlbCk7XG4gICAgICAgICAgICAvLyBlLmcuIGN0eF9yMCAgIE9SICB4KDIpO1xuICAgICAgICAgICAgcmhzID0gc2hhcmVkQ3R4VmFyID8gc2hhcmVkQ3R4VmFyIDogZ2VuZXJhdGVOZXh0Q29udGV4dEV4cHIocmVsYXRpdmVMZXZlbCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIGUuZy4gY29uc3QgJGl0ZW0kID0geCgyKS4kaW1wbGljaXQ7XG4gICAgICAgICAgcmV0dXJuIFtsaHMuc2V0KHJocy5wcm9wKHZhcmlhYmxlLnZhbHVlIHx8IElNUExJQ0lUX1JFRkVSRU5DRSkpLnRvQ29uc3REZWNsKCldO1xuICAgICAgICB9KTtcbiAgfVxuXG4gIGJ1aWxkVGVtcGxhdGVGdW5jdGlvbihcbiAgICAgIG5vZGVzOiB0Lk5vZGVbXSwgdmFyaWFibGVzOiB0LlZhcmlhYmxlW10sIG5nQ29udGVudFNlbGVjdG9yc09mZnNldDogbnVtYmVyID0gMCxcbiAgICAgIGkxOG4/OiBpMThuLkFTVCk6IG8uRnVuY3Rpb25FeHByIHtcbiAgICB0aGlzLl9uZ0NvbnRlbnRTZWxlY3RvcnNPZmZzZXQgPSBuZ0NvbnRlbnRTZWxlY3RvcnNPZmZzZXQ7XG5cbiAgICBpZiAodGhpcy5fbmFtZXNwYWNlICE9PSBSMy5uYW1lc3BhY2VIVE1MKSB7XG4gICAgICB0aGlzLmNyZWF0aW9uSW5zdHJ1Y3Rpb24obnVsbCwgdGhpcy5fbmFtZXNwYWNlKTtcbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgdmFyaWFibGUgYmluZGluZ3NcbiAgICB2YXJpYWJsZXMuZm9yRWFjaCh2ID0+IHRoaXMucmVnaXN0ZXJDb250ZXh0VmFyaWFibGVzKHYpKTtcblxuICAgIC8vIEluaXRpYXRlIGkxOG4gY29udGV4dCBpbiBjYXNlOlxuICAgIC8vIC0gdGhpcyB0ZW1wbGF0ZSBoYXMgcGFyZW50IGkxOG4gY29udGV4dFxuICAgIC8vIC0gb3IgdGhlIHRlbXBsYXRlIGhhcyBpMThuIG1ldGEgYXNzb2NpYXRlZCB3aXRoIGl0LFxuICAgIC8vICAgYnV0IGl0J3Mgbm90IGluaXRpYXRlZCBieSB0aGUgRWxlbWVudCAoZS5nLiA8bmctdGVtcGxhdGUgaTE4bj4pXG4gICAgY29uc3QgaW5pdEkxOG5Db250ZXh0ID1cbiAgICAgICAgdGhpcy5pMThuQ29udGV4dCB8fCAoaXNJMThuUm9vdE5vZGUoaTE4bikgJiYgIWlzU2luZ2xlSTE4bkljdShpMThuKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAhKGlzU2luZ2xlRWxlbWVudFRlbXBsYXRlKG5vZGVzKSAmJiBub2Rlc1swXS5pMThuID09PSBpMThuKSk7XG4gICAgY29uc3Qgc2VsZkNsb3NpbmdJMThuSW5zdHJ1Y3Rpb24gPSBoYXNUZXh0Q2hpbGRyZW5Pbmx5KG5vZGVzKTtcbiAgICBpZiAoaW5pdEkxOG5Db250ZXh0KSB7XG4gICAgICB0aGlzLmkxOG5TdGFydChudWxsLCBpMThuICEsIHNlbGZDbG9zaW5nSTE4bkluc3RydWN0aW9uKTtcbiAgICB9XG5cbiAgICAvLyBUaGlzIGlzIHRoZSBpbml0aWFsIHBhc3MgdGhyb3VnaCB0aGUgbm9kZXMgb2YgdGhpcyB0ZW1wbGF0ZS4gSW4gdGhpcyBwYXNzLCB3ZVxuICAgIC8vIHF1ZXVlIGFsbCBjcmVhdGlvbiBtb2RlIGFuZCB1cGRhdGUgbW9kZSBpbnN0cnVjdGlvbnMgZm9yIGdlbmVyYXRpb24gaW4gdGhlIHNlY29uZFxuICAgIC8vIHBhc3MuIEl0J3MgbmVjZXNzYXJ5IHRvIHNlcGFyYXRlIHRoZSBwYXNzZXMgdG8gZW5zdXJlIGxvY2FsIHJlZnMgYXJlIGRlZmluZWQgYmVmb3JlXG4gICAgLy8gcmVzb2x2aW5nIGJpbmRpbmdzLiBXZSBhbHNvIGNvdW50IGJpbmRpbmdzIGluIHRoaXMgcGFzcyBhcyB3ZSB3YWxrIGJvdW5kIGV4cHJlc3Npb25zLlxuICAgIHQudmlzaXRBbGwodGhpcywgbm9kZXMpO1xuXG4gICAgLy8gQWRkIHRvdGFsIGJpbmRpbmcgY291bnQgdG8gcHVyZSBmdW5jdGlvbiBjb3VudCBzbyBwdXJlIGZ1bmN0aW9uIGluc3RydWN0aW9ucyBhcmVcbiAgICAvLyBnZW5lcmF0ZWQgd2l0aCB0aGUgY29ycmVjdCBzbG90IG9mZnNldCB3aGVuIHVwZGF0ZSBpbnN0cnVjdGlvbnMgYXJlIHByb2Nlc3NlZC5cbiAgICB0aGlzLl9wdXJlRnVuY3Rpb25TbG90cyArPSB0aGlzLl9iaW5kaW5nU2xvdHM7XG5cbiAgICAvLyBQaXBlcyBhcmUgd2Fsa2VkIGluIHRoZSBmaXJzdCBwYXNzICh0byBlbnF1ZXVlIGBwaXBlKClgIGNyZWF0aW9uIGluc3RydWN0aW9ucyBhbmRcbiAgICAvLyBgcGlwZUJpbmRgIHVwZGF0ZSBpbnN0cnVjdGlvbnMpLCBzbyB3ZSBoYXZlIHRvIHVwZGF0ZSB0aGUgc2xvdCBvZmZzZXRzIG1hbnVhbGx5XG4gICAgLy8gdG8gYWNjb3VudCBmb3IgYmluZGluZ3MuXG4gICAgdGhpcy5fdmFsdWVDb252ZXJ0ZXIudXBkYXRlUGlwZVNsb3RPZmZzZXRzKHRoaXMuX2JpbmRpbmdTbG90cyk7XG5cbiAgICAvLyBOZXN0ZWQgdGVtcGxhdGVzIG11c3QgYmUgcHJvY2Vzc2VkIGJlZm9yZSBjcmVhdGlvbiBpbnN0cnVjdGlvbnMgc28gdGVtcGxhdGUoKVxuICAgIC8vIGluc3RydWN0aW9ucyBjYW4gYmUgZ2VuZXJhdGVkIHdpdGggdGhlIGNvcnJlY3QgaW50ZXJuYWwgY29uc3QgY291bnQuXG4gICAgdGhpcy5fbmVzdGVkVGVtcGxhdGVGbnMuZm9yRWFjaChidWlsZFRlbXBsYXRlRm4gPT4gYnVpbGRUZW1wbGF0ZUZuKCkpO1xuXG4gICAgLy8gT3V0cHV0IHRoZSBgcHJvamVjdGlvbkRlZmAgaW5zdHJ1Y3Rpb24gd2hlbiBzb21lIGA8bmctY29udGVudD5gIHRhZ3MgYXJlIHByZXNlbnQuXG4gICAgLy8gVGhlIGBwcm9qZWN0aW9uRGVmYCBpbnN0cnVjdGlvbiBpcyBvbmx5IGVtaXR0ZWQgZm9yIHRoZSBjb21wb25lbnQgdGVtcGxhdGUgYW5kXG4gICAgLy8gaXMgc2tpcHBlZCBmb3IgbmVzdGVkIHRlbXBsYXRlcyAoPG5nLXRlbXBsYXRlPiB0YWdzKS5cbiAgICBpZiAodGhpcy5sZXZlbCA9PT0gMCAmJiB0aGlzLl9uZ0NvbnRlbnRSZXNlcnZlZFNsb3RzLmxlbmd0aCkge1xuICAgICAgY29uc3QgcGFyYW1ldGVyczogby5FeHByZXNzaW9uW10gPSBbXTtcblxuICAgICAgLy8gQnkgZGVmYXVsdCB0aGUgYHByb2plY3Rpb25EZWZgIGluc3RydWN0aW9ucyBjcmVhdGVzIG9uZSBzbG90IGZvciB0aGUgd2lsZGNhcmRcbiAgICAgIC8vIHNlbGVjdG9yIGlmIG5vIHBhcmFtZXRlcnMgYXJlIHBhc3NlZC4gVGhlcmVmb3JlIHdlIG9ubHkgd2FudCB0byBhbGxvY2F0ZSBhIG5ld1xuICAgICAgLy8gYXJyYXkgZm9yIHRoZSBwcm9qZWN0aW9uIHNsb3RzIGlmIHRoZSBkZWZhdWx0IHByb2plY3Rpb24gc2xvdCBpcyBub3Qgc3VmZmljaWVudC5cbiAgICAgIGlmICh0aGlzLl9uZ0NvbnRlbnRSZXNlcnZlZFNsb3RzLmxlbmd0aCA+IDEgfHwgdGhpcy5fbmdDb250ZW50UmVzZXJ2ZWRTbG90c1swXSAhPT0gJyonKSB7XG4gICAgICAgIGNvbnN0IHIzUmVzZXJ2ZWRTbG90cyA9IHRoaXMuX25nQ29udGVudFJlc2VydmVkU2xvdHMubWFwKFxuICAgICAgICAgICAgcyA9PiBzICE9PSAnKicgPyBjb3JlLnBhcnNlU2VsZWN0b3JUb1IzU2VsZWN0b3IocykgOiBzKTtcbiAgICAgICAgcGFyYW1ldGVycy5wdXNoKHRoaXMuY29uc3RhbnRQb29sLmdldENvbnN0TGl0ZXJhbChhc0xpdGVyYWwocjNSZXNlcnZlZFNsb3RzKSwgdHJ1ZSkpO1xuICAgICAgfVxuXG4gICAgICAvLyBTaW5jZSB3ZSBhY2N1bXVsYXRlIG5nQ29udGVudCBzZWxlY3RvcnMgd2hpbGUgcHJvY2Vzc2luZyB0ZW1wbGF0ZSBlbGVtZW50cyxcbiAgICAgIC8vIHdlICpwcmVwZW5kKiBgcHJvamVjdGlvbkRlZmAgdG8gY3JlYXRpb24gaW5zdHJ1Y3Rpb25zIGJsb2NrLCB0byBwdXQgaXQgYmVmb3JlXG4gICAgICAvLyBhbnkgYHByb2plY3Rpb25gIGluc3RydWN0aW9uc1xuICAgICAgdGhpcy5jcmVhdGlvbkluc3RydWN0aW9uKG51bGwsIFIzLnByb2plY3Rpb25EZWYsIHBhcmFtZXRlcnMsIC8qIHByZXBlbmQgKi8gdHJ1ZSk7XG4gICAgfVxuXG4gICAgaWYgKGluaXRJMThuQ29udGV4dCkge1xuICAgICAgdGhpcy5pMThuRW5kKG51bGwsIHNlbGZDbG9zaW5nSTE4bkluc3RydWN0aW9uKTtcbiAgICB9XG5cbiAgICAvLyBHZW5lcmF0ZSBhbGwgdGhlIGNyZWF0aW9uIG1vZGUgaW5zdHJ1Y3Rpb25zIChlLmcuIHJlc29sdmUgYmluZGluZ3MgaW4gbGlzdGVuZXJzKVxuICAgIGNvbnN0IGNyZWF0aW9uU3RhdGVtZW50cyA9IHRoaXMuX2NyZWF0aW9uQ29kZUZucy5tYXAoKGZuOiAoKSA9PiBvLlN0YXRlbWVudCkgPT4gZm4oKSk7XG5cbiAgICAvLyBHZW5lcmF0ZSBhbGwgdGhlIHVwZGF0ZSBtb2RlIGluc3RydWN0aW9ucyAoZS5nLiByZXNvbHZlIHByb3BlcnR5IG9yIHRleHQgYmluZGluZ3MpXG4gICAgY29uc3QgdXBkYXRlU3RhdGVtZW50cyA9IHRoaXMuX3VwZGF0ZUNvZGVGbnMubWFwKChmbjogKCkgPT4gby5TdGF0ZW1lbnQpID0+IGZuKCkpO1xuXG4gICAgLy8gIFZhcmlhYmxlIGRlY2xhcmF0aW9uIG11c3Qgb2NjdXIgYWZ0ZXIgYmluZGluZyByZXNvbHV0aW9uIHNvIHdlIGNhbiBnZW5lcmF0ZSBjb250ZXh0XG4gICAgLy8gIGluc3RydWN0aW9ucyB0aGF0IGJ1aWxkIG9uIGVhY2ggb3RoZXIuXG4gICAgLy8gZS5nLiBjb25zdCBiID0gbmV4dENvbnRleHQoKS4kaW1wbGljaXQoKTsgY29uc3QgYiA9IG5leHRDb250ZXh0KCk7XG4gICAgY29uc3QgY3JlYXRpb25WYXJpYWJsZXMgPSB0aGlzLl9iaW5kaW5nU2NvcGUudmlld1NuYXBzaG90U3RhdGVtZW50cygpO1xuICAgIGNvbnN0IHVwZGF0ZVZhcmlhYmxlcyA9IHRoaXMuX2JpbmRpbmdTY29wZS52YXJpYWJsZURlY2xhcmF0aW9ucygpLmNvbmNhdCh0aGlzLl90ZW1wVmFyaWFibGVzKTtcblxuICAgIGNvbnN0IGNyZWF0aW9uQmxvY2sgPSBjcmVhdGlvblN0YXRlbWVudHMubGVuZ3RoID4gMCA/XG4gICAgICAgIFtyZW5kZXJGbGFnQ2hlY2tJZlN0bXQoXG4gICAgICAgICAgICBjb3JlLlJlbmRlckZsYWdzLkNyZWF0ZSwgY3JlYXRpb25WYXJpYWJsZXMuY29uY2F0KGNyZWF0aW9uU3RhdGVtZW50cykpXSA6XG4gICAgICAgIFtdO1xuXG4gICAgY29uc3QgdXBkYXRlQmxvY2sgPSB1cGRhdGVTdGF0ZW1lbnRzLmxlbmd0aCA+IDAgP1xuICAgICAgICBbcmVuZGVyRmxhZ0NoZWNrSWZTdG10KGNvcmUuUmVuZGVyRmxhZ3MuVXBkYXRlLCB1cGRhdGVWYXJpYWJsZXMuY29uY2F0KHVwZGF0ZVN0YXRlbWVudHMpKV0gOlxuICAgICAgICBbXTtcblxuICAgIHJldHVybiBvLmZuKFxuICAgICAgICAvLyBpLmUuIChyZjogUmVuZGVyRmxhZ3MsIGN0eDogYW55KVxuICAgICAgICBbbmV3IG8uRm5QYXJhbShSRU5ERVJfRkxBR1MsIG8uTlVNQkVSX1RZUEUpLCBuZXcgby5GblBhcmFtKENPTlRFWFRfTkFNRSwgbnVsbCldLFxuICAgICAgICBbXG4gICAgICAgICAgLy8gVGVtcG9yYXJ5IHZhcmlhYmxlIGRlY2xhcmF0aW9ucyBmb3IgcXVlcnkgcmVmcmVzaCAoaS5lLiBsZXQgX3Q6IGFueTspXG4gICAgICAgICAgLi4udGhpcy5fcHJlZml4Q29kZSxcbiAgICAgICAgICAvLyBDcmVhdGluZyBtb2RlIChpLmUuIGlmIChyZiAmIFJlbmRlckZsYWdzLkNyZWF0ZSkgeyAuLi4gfSlcbiAgICAgICAgICAuLi5jcmVhdGlvbkJsb2NrLFxuICAgICAgICAgIC8vIEJpbmRpbmcgYW5kIHJlZnJlc2ggbW9kZSAoaS5lLiBpZiAocmYgJiBSZW5kZXJGbGFncy5VcGRhdGUpIHsuLi59KVxuICAgICAgICAgIC4uLnVwZGF0ZUJsb2NrLFxuICAgICAgICBdLFxuICAgICAgICBvLklORkVSUkVEX1RZUEUsIG51bGwsIHRoaXMudGVtcGxhdGVOYW1lKTtcbiAgfVxuXG4gIC8vIExvY2FsUmVzb2x2ZXJcbiAgZ2V0TG9jYWwobmFtZTogc3RyaW5nKTogby5FeHByZXNzaW9ufG51bGwgeyByZXR1cm4gdGhpcy5fYmluZGluZ1Njb3BlLmdldChuYW1lKTsgfVxuXG4gIC8vIExvY2FsUmVzb2x2ZXJcbiAgbm90aWZ5SW1wbGljaXRSZWNlaXZlclVzZSgpOiB2b2lkIHsgdGhpcy5fYmluZGluZ1Njb3BlLm5vdGlmeUltcGxpY2l0UmVjZWl2ZXJVc2UoKTsgfVxuXG4gIGkxOG5UcmFuc2xhdGUoXG4gICAgICBtZXNzYWdlOiBpMThuLk1lc3NhZ2UsIHBhcmFtczoge1tuYW1lOiBzdHJpbmddOiBvLkV4cHJlc3Npb259ID0ge30sIHJlZj86IG8uUmVhZFZhckV4cHIsXG4gICAgICB0cmFuc2Zvcm1Gbj86IChyYXc6IG8uUmVhZFZhckV4cHIpID0+IG8uRXhwcmVzc2lvbik6IG8uUmVhZFZhckV4cHIge1xuICAgIGNvbnN0IF9yZWYgPSByZWYgfHwgby52YXJpYWJsZSh0aGlzLmNvbnN0YW50UG9vbC51bmlxdWVOYW1lKFRSQU5TTEFUSU9OX1BSRUZJWCkpO1xuICAgIC8vIENsb3N1cmUgQ29tcGlsZXIgcmVxdWlyZXMgY29uc3QgbmFtZXMgdG8gc3RhcnQgd2l0aCBgTVNHX2AgYnV0IGRpc2FsbG93cyBhbnkgb3RoZXIgY29uc3QgdG9cbiAgICAvLyBzdGFydCB3aXRoIGBNU0dfYC4gV2UgZGVmaW5lIGEgdmFyaWFibGUgc3RhcnRpbmcgd2l0aCBgTVNHX2AganVzdCBmb3IgdGhlIGBnb29nLmdldE1zZ2AgY2FsbFxuICAgIGNvbnN0IGNsb3N1cmVWYXIgPSB0aGlzLmkxOG5HZW5lcmF0ZUNsb3N1cmVWYXIobWVzc2FnZS5pZCk7XG4gICAgY29uc3QgX3BhcmFtczoge1trZXk6IHN0cmluZ106IGFueX0gPSB7fTtcbiAgICBpZiAocGFyYW1zICYmIE9iamVjdC5rZXlzKHBhcmFtcykubGVuZ3RoKSB7XG4gICAgICBPYmplY3Qua2V5cyhwYXJhbXMpLmZvckVhY2goa2V5ID0+IF9wYXJhbXNbZm9ybWF0STE4blBsYWNlaG9sZGVyTmFtZShrZXkpXSA9IHBhcmFtc1trZXldKTtcbiAgICB9XG4gICAgY29uc3QgbWV0YSA9IG1ldGFGcm9tSTE4bk1lc3NhZ2UobWVzc2FnZSk7XG4gICAgY29uc3QgY29udGVudCA9IGdldFNlcmlhbGl6ZWRJMThuQ29udGVudChtZXNzYWdlKTtcbiAgICBjb25zdCBzdGF0ZW1lbnRzID1cbiAgICAgICAgZ2V0VHJhbnNsYXRpb25EZWNsU3RtdHMoX3JlZiwgY2xvc3VyZVZhciwgY29udGVudCwgbWV0YSwgX3BhcmFtcywgdHJhbnNmb3JtRm4pO1xuICAgIHRoaXMuY29uc3RhbnRQb29sLnN0YXRlbWVudHMucHVzaCguLi5zdGF0ZW1lbnRzKTtcbiAgICByZXR1cm4gX3JlZjtcbiAgfVxuXG4gIGkxOG5BcHBlbmRCaW5kaW5ncyhleHByZXNzaW9uczogQVNUW10pIHtcbiAgICBpZiAoZXhwcmVzc2lvbnMubGVuZ3RoID4gMCkge1xuICAgICAgZXhwcmVzc2lvbnMuZm9yRWFjaChleHByZXNzaW9uID0+IHRoaXMuaTE4biAhLmFwcGVuZEJpbmRpbmcoZXhwcmVzc2lvbikpO1xuICAgIH1cbiAgfVxuXG4gIGkxOG5CaW5kUHJvcHMocHJvcHM6IHtba2V5OiBzdHJpbmddOiB0LlRleHQgfCB0LkJvdW5kVGV4dH0pOiB7W2tleTogc3RyaW5nXTogby5FeHByZXNzaW9ufSB7XG4gICAgY29uc3QgYm91bmQ6IHtba2V5OiBzdHJpbmddOiBvLkV4cHJlc3Npb259ID0ge307XG4gICAgT2JqZWN0LmtleXMocHJvcHMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGNvbnN0IHByb3AgPSBwcm9wc1trZXldO1xuICAgICAgaWYgKHByb3AgaW5zdGFuY2VvZiB0LlRleHQpIHtcbiAgICAgICAgYm91bmRba2V5XSA9IG8ubGl0ZXJhbChwcm9wLnZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gcHJvcC52YWx1ZS52aXNpdCh0aGlzLl92YWx1ZUNvbnZlcnRlcik7XG4gICAgICAgIHRoaXMuYWxsb2NhdGVCaW5kaW5nU2xvdHModmFsdWUpO1xuICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBJbnRlcnBvbGF0aW9uKSB7XG4gICAgICAgICAgY29uc3Qge3N0cmluZ3MsIGV4cHJlc3Npb25zfSA9IHZhbHVlO1xuICAgICAgICAgIGNvbnN0IHtpZCwgYmluZGluZ3N9ID0gdGhpcy5pMThuICE7XG4gICAgICAgICAgY29uc3QgbGFiZWwgPSBhc3NlbWJsZUkxOG5Cb3VuZFN0cmluZyhzdHJpbmdzLCBiaW5kaW5ncy5zaXplLCBpZCk7XG4gICAgICAgICAgdGhpcy5pMThuQXBwZW5kQmluZGluZ3MoZXhwcmVzc2lvbnMpO1xuICAgICAgICAgIGJvdW5kW2tleV0gPSBvLmxpdGVyYWwobGFiZWwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGJvdW5kO1xuICB9XG5cbiAgaTE4bkdlbmVyYXRlQ2xvc3VyZVZhcihtZXNzYWdlSWQ6IHN0cmluZyk6IG8uUmVhZFZhckV4cHIge1xuICAgIGxldCBuYW1lOiBzdHJpbmc7XG4gICAgY29uc3Qgc3VmZml4ID0gdGhpcy5maWxlQmFzZWRJMThuU3VmZml4LnRvVXBwZXJDYXNlKCk7XG4gICAgaWYgKHRoaXMuaTE4blVzZUV4dGVybmFsSWRzKSB7XG4gICAgICBjb25zdCBwcmVmaXggPSBnZXRUcmFuc2xhdGlvbkNvbnN0UHJlZml4KGBFWFRFUk5BTF9gKTtcbiAgICAgIGNvbnN0IHVuaXF1ZVN1ZmZpeCA9IHRoaXMuY29uc3RhbnRQb29sLnVuaXF1ZU5hbWUoc3VmZml4KTtcbiAgICAgIG5hbWUgPSBgJHtwcmVmaXh9JHtzYW5pdGl6ZUlkZW50aWZpZXIobWVzc2FnZUlkKX0kJCR7dW5pcXVlU3VmZml4fWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHByZWZpeCA9IGdldFRyYW5zbGF0aW9uQ29uc3RQcmVmaXgoc3VmZml4KTtcbiAgICAgIG5hbWUgPSB0aGlzLmNvbnN0YW50UG9vbC51bmlxdWVOYW1lKHByZWZpeCk7XG4gICAgfVxuICAgIHJldHVybiBvLnZhcmlhYmxlKG5hbWUpO1xuICB9XG5cbiAgaTE4blVwZGF0ZVJlZihjb250ZXh0OiBJMThuQ29udGV4dCk6IHZvaWQge1xuICAgIGNvbnN0IHtpY3VzLCBtZXRhLCBpc1Jvb3QsIGlzUmVzb2x2ZWQsIGlzRW1pdHRlZH0gPSBjb250ZXh0O1xuICAgIGlmIChpc1Jvb3QgJiYgaXNSZXNvbHZlZCAmJiAhaXNFbWl0dGVkICYmICFpc1NpbmdsZUkxOG5JY3UobWV0YSkpIHtcbiAgICAgIGNvbnRleHQuaXNFbWl0dGVkID0gdHJ1ZTtcbiAgICAgIGNvbnN0IHBsYWNlaG9sZGVycyA9IGNvbnRleHQuZ2V0U2VyaWFsaXplZFBsYWNlaG9sZGVycygpO1xuICAgICAgbGV0IGljdU1hcHBpbmc6IHtbbmFtZTogc3RyaW5nXTogby5FeHByZXNzaW9ufSA9IHt9O1xuICAgICAgbGV0IHBhcmFtczoge1tuYW1lOiBzdHJpbmddOiBvLkV4cHJlc3Npb259ID1cbiAgICAgICAgICBwbGFjZWhvbGRlcnMuc2l6ZSA/IHBsYWNlaG9sZGVyc1RvUGFyYW1zKHBsYWNlaG9sZGVycykgOiB7fTtcbiAgICAgIGlmIChpY3VzLnNpemUpIHtcbiAgICAgICAgaWN1cy5mb3JFYWNoKChyZWZzOiBvLkV4cHJlc3Npb25bXSwga2V5OiBzdHJpbmcpID0+IHtcbiAgICAgICAgICBpZiAocmVmcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIC8vIGlmIHdlIGhhdmUgb25lIElDVSBkZWZpbmVkIGZvciBhIGdpdmVuXG4gICAgICAgICAgICAvLyBwbGFjZWhvbGRlciAtIGp1c3Qgb3V0cHV0IGl0cyByZWZlcmVuY2VcbiAgICAgICAgICAgIHBhcmFtc1trZXldID0gcmVmc1swXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gLi4uIG90aGVyd2lzZSB3ZSBuZWVkIHRvIGFjdGl2YXRlIHBvc3QtcHJvY2Vzc2luZ1xuICAgICAgICAgICAgLy8gdG8gcmVwbGFjZSBJQ1UgcGxhY2Vob2xkZXJzIHdpdGggcHJvcGVyIHZhbHVlc1xuICAgICAgICAgICAgY29uc3QgcGxhY2Vob2xkZXI6IHN0cmluZyA9IHdyYXBJMThuUGxhY2Vob2xkZXIoYCR7STE4Tl9JQ1VfTUFQUElOR19QUkVGSVh9JHtrZXl9YCk7XG4gICAgICAgICAgICBwYXJhbXNba2V5XSA9IG8ubGl0ZXJhbChwbGFjZWhvbGRlcik7XG4gICAgICAgICAgICBpY3VNYXBwaW5nW2tleV0gPSBvLmxpdGVyYWxBcnIocmVmcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgLy8gdHJhbnNsYXRpb24gcmVxdWlyZXMgcG9zdCBwcm9jZXNzaW5nIGluIDIgY2FzZXM6XG4gICAgICAvLyAtIGlmIHdlIGhhdmUgcGxhY2Vob2xkZXJzIHdpdGggbXVsdGlwbGUgdmFsdWVzIChleC4gYFNUQVJUX0RJVmA6IFvvv70jMe+/vSwg77+9IzLvv70sIC4uLl0pXG4gICAgICAvLyAtIGlmIHdlIGhhdmUgbXVsdGlwbGUgSUNVcyB0aGF0IHJlZmVyIHRvIHRoZSBzYW1lIHBsYWNlaG9sZGVyIG5hbWVcbiAgICAgIGNvbnN0IG5lZWRzUG9zdHByb2Nlc3NpbmcgPVxuICAgICAgICAgIEFycmF5LmZyb20ocGxhY2Vob2xkZXJzLnZhbHVlcygpKS5zb21lKCh2YWx1ZTogc3RyaW5nW10pID0+IHZhbHVlLmxlbmd0aCA+IDEpIHx8XG4gICAgICAgICAgT2JqZWN0LmtleXMoaWN1TWFwcGluZykubGVuZ3RoO1xuXG4gICAgICBsZXQgdHJhbnNmb3JtRm47XG4gICAgICBpZiAobmVlZHNQb3N0cHJvY2Vzc2luZykge1xuICAgICAgICB0cmFuc2Zvcm1GbiA9IChyYXc6IG8uUmVhZFZhckV4cHIpID0+IHtcbiAgICAgICAgICBjb25zdCBhcmdzOiBvLkV4cHJlc3Npb25bXSA9IFtyYXddO1xuICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhpY3VNYXBwaW5nKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGFyZ3MucHVzaChtYXBMaXRlcmFsKGljdU1hcHBpbmcsIHRydWUpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGluc3RydWN0aW9uKG51bGwsIFIzLmkxOG5Qb3N0cHJvY2VzcywgYXJncyk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICB0aGlzLmkxOG5UcmFuc2xhdGUobWV0YSBhcyBpMThuLk1lc3NhZ2UsIHBhcmFtcywgY29udGV4dC5yZWYsIHRyYW5zZm9ybUZuKTtcbiAgICB9XG4gIH1cblxuICBpMThuU3RhcnQoc3BhbjogUGFyc2VTb3VyY2VTcGFufG51bGwgPSBudWxsLCBtZXRhOiBpMThuLkFTVCwgc2VsZkNsb3Npbmc/OiBib29sZWFuKTogdm9pZCB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmFsbG9jYXRlRGF0YVNsb3QoKTtcbiAgICBpZiAodGhpcy5pMThuQ29udGV4dCkge1xuICAgICAgdGhpcy5pMThuID0gdGhpcy5pMThuQ29udGV4dC5mb3JrQ2hpbGRDb250ZXh0KGluZGV4LCB0aGlzLnRlbXBsYXRlSW5kZXggISwgbWV0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHJlZiA9IG8udmFyaWFibGUodGhpcy5jb25zdGFudFBvb2wudW5pcXVlTmFtZShUUkFOU0xBVElPTl9QUkVGSVgpKTtcbiAgICAgIHRoaXMuaTE4biA9IG5ldyBJMThuQ29udGV4dChpbmRleCwgcmVmLCAwLCB0aGlzLnRlbXBsYXRlSW5kZXgsIG1ldGEpO1xuICAgIH1cblxuICAgIC8vIGdlbmVyYXRlIGkxOG5TdGFydCBpbnN0cnVjdGlvblxuICAgIGNvbnN0IHtpZCwgcmVmfSA9IHRoaXMuaTE4bjtcbiAgICBjb25zdCBwYXJhbXM6IG8uRXhwcmVzc2lvbltdID0gW28ubGl0ZXJhbChpbmRleCksIHJlZl07XG4gICAgaWYgKGlkID4gMCkge1xuICAgICAgLy8gZG8gbm90IHB1c2ggM3JkIGFyZ3VtZW50IChzdWItYmxvY2sgaWQpXG4gICAgICAvLyBpbnRvIGkxOG5TdGFydCBjYWxsIGZvciB0b3AgbGV2ZWwgaTE4biBjb250ZXh0XG4gICAgICBwYXJhbXMucHVzaChvLmxpdGVyYWwoaWQpKTtcbiAgICB9XG4gICAgdGhpcy5jcmVhdGlvbkluc3RydWN0aW9uKHNwYW4sIHNlbGZDbG9zaW5nID8gUjMuaTE4biA6IFIzLmkxOG5TdGFydCwgcGFyYW1zKTtcbiAgfVxuXG4gIGkxOG5FbmQoc3BhbjogUGFyc2VTb3VyY2VTcGFufG51bGwgPSBudWxsLCBzZWxmQ2xvc2luZz86IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaTE4bikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpMThuRW5kIGlzIGV4ZWN1dGVkIHdpdGggbm8gaTE4biBjb250ZXh0IHByZXNlbnQnKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pMThuQ29udGV4dCkge1xuICAgICAgdGhpcy5pMThuQ29udGV4dC5yZWNvbmNpbGVDaGlsZENvbnRleHQodGhpcy5pMThuKTtcbiAgICAgIHRoaXMuaTE4blVwZGF0ZVJlZih0aGlzLmkxOG5Db250ZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pMThuVXBkYXRlUmVmKHRoaXMuaTE4bik7XG4gICAgfVxuXG4gICAgLy8gc2V0dXAgYWNjdW11bGF0ZWQgYmluZGluZ3NcbiAgICBjb25zdCB7aW5kZXgsIGJpbmRpbmdzfSA9IHRoaXMuaTE4bjtcbiAgICBpZiAoYmluZGluZ3Muc2l6ZSkge1xuICAgICAgYmluZGluZ3MuZm9yRWFjaChiaW5kaW5nID0+IHtcbiAgICAgICAgdGhpcy51cGRhdGVJbnN0cnVjdGlvbihcbiAgICAgICAgICAgIGluZGV4LCBzcGFuLCBSMy5pMThuRXhwLCAoKSA9PiBbdGhpcy5jb252ZXJ0UHJvcGVydHlCaW5kaW5nKGJpbmRpbmcpXSk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMudXBkYXRlSW5zdHJ1Y3Rpb24oaW5kZXgsIHNwYW4sIFIzLmkxOG5BcHBseSwgW28ubGl0ZXJhbChpbmRleCldKTtcbiAgICB9XG4gICAgaWYgKCFzZWxmQ2xvc2luZykge1xuICAgICAgdGhpcy5jcmVhdGlvbkluc3RydWN0aW9uKHNwYW4sIFIzLmkxOG5FbmQpO1xuICAgIH1cbiAgICB0aGlzLmkxOG4gPSBudWxsOyAgLy8gcmVzZXQgbG9jYWwgaTE4biBjb250ZXh0XG4gIH1cblxuICB2aXNpdENvbnRlbnQobmdDb250ZW50OiB0LkNvbnRlbnQpIHtcbiAgICBjb25zdCBzbG90ID0gdGhpcy5hbGxvY2F0ZURhdGFTbG90KCk7XG4gICAgY29uc3QgcHJvamVjdGlvblNsb3RJZHggPSB0aGlzLl9uZ0NvbnRlbnRTZWxlY3RvcnNPZmZzZXQgKyB0aGlzLl9uZ0NvbnRlbnRSZXNlcnZlZFNsb3RzLmxlbmd0aDtcbiAgICBjb25zdCBwYXJhbWV0ZXJzOiBvLkV4cHJlc3Npb25bXSA9IFtvLmxpdGVyYWwoc2xvdCldO1xuICAgIGNvbnN0IGF0dHJpYnV0ZXM6IG8uRXhwcmVzc2lvbltdID0gW107XG5cbiAgICB0aGlzLl9uZ0NvbnRlbnRSZXNlcnZlZFNsb3RzLnB1c2gobmdDb250ZW50LnNlbGVjdG9yKTtcblxuICAgIG5nQ29udGVudC5hdHRyaWJ1dGVzLmZvckVhY2goKGF0dHJpYnV0ZSkgPT4ge1xuICAgICAgY29uc3Qge25hbWUsIHZhbHVlfSA9IGF0dHJpYnV0ZTtcbiAgICAgIGlmIChuYW1lID09PSBOR19QUk9KRUNUX0FTX0FUVFJfTkFNRSkge1xuICAgICAgICBhdHRyaWJ1dGVzLnB1c2goLi4uZ2V0TmdQcm9qZWN0QXNMaXRlcmFsKGF0dHJpYnV0ZSkpO1xuICAgICAgfSBlbHNlIGlmIChuYW1lLnRvTG93ZXJDYXNlKCkgIT09IE5HX0NPTlRFTlRfU0VMRUNUX0FUVFIpIHtcbiAgICAgICAgYXR0cmlidXRlcy5wdXNoKG8ubGl0ZXJhbChuYW1lKSwgby5saXRlcmFsKHZhbHVlKSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoYXR0cmlidXRlcy5sZW5ndGggPiAwKSB7XG4gICAgICBwYXJhbWV0ZXJzLnB1c2goby5saXRlcmFsKHByb2plY3Rpb25TbG90SWR4KSwgby5saXRlcmFsQXJyKGF0dHJpYnV0ZXMpKTtcbiAgICB9IGVsc2UgaWYgKHByb2plY3Rpb25TbG90SWR4ICE9PSAwKSB7XG4gICAgICBwYXJhbWV0ZXJzLnB1c2goby5saXRlcmFsKHByb2plY3Rpb25TbG90SWR4KSk7XG4gICAgfVxuXG4gICAgdGhpcy5jcmVhdGlvbkluc3RydWN0aW9uKG5nQ29udGVudC5zb3VyY2VTcGFuLCBSMy5wcm9qZWN0aW9uLCBwYXJhbWV0ZXJzKTtcbiAgfVxuXG5cbiAgZ2V0TmFtZXNwYWNlSW5zdHJ1Y3Rpb24obmFtZXNwYWNlS2V5OiBzdHJpbmd8bnVsbCkge1xuICAgIHN3aXRjaCAobmFtZXNwYWNlS2V5KSB7XG4gICAgICBjYXNlICdtYXRoJzpcbiAgICAgICAgcmV0dXJuIFIzLm5hbWVzcGFjZU1hdGhNTDtcbiAgICAgIGNhc2UgJ3N2Zyc6XG4gICAgICAgIHJldHVybiBSMy5uYW1lc3BhY2VTVkc7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gUjMubmFtZXNwYWNlSFRNTDtcbiAgICB9XG4gIH1cblxuICBhZGROYW1lc3BhY2VJbnN0cnVjdGlvbihuc0luc3RydWN0aW9uOiBvLkV4dGVybmFsUmVmZXJlbmNlLCBlbGVtZW50OiB0LkVsZW1lbnQpIHtcbiAgICB0aGlzLl9uYW1lc3BhY2UgPSBuc0luc3RydWN0aW9uO1xuICAgIHRoaXMuY3JlYXRpb25JbnN0cnVjdGlvbihlbGVtZW50LnNvdXJjZVNwYW4sIG5zSW5zdHJ1Y3Rpb24pO1xuICB9XG5cbiAgdmlzaXRFbGVtZW50KGVsZW1lbnQ6IHQuRWxlbWVudCkge1xuICAgIGNvbnN0IGVsZW1lbnRJbmRleCA9IHRoaXMuYWxsb2NhdGVEYXRhU2xvdCgpO1xuICAgIGNvbnN0IHN0eWxpbmdCdWlsZGVyID0gbmV3IFN0eWxpbmdCdWlsZGVyKG8ubGl0ZXJhbChlbGVtZW50SW5kZXgpLCBudWxsKTtcblxuICAgIGxldCBpc05vbkJpbmRhYmxlTW9kZTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIGNvbnN0IGlzSTE4blJvb3RFbGVtZW50OiBib29sZWFuID1cbiAgICAgICAgaXNJMThuUm9vdE5vZGUoZWxlbWVudC5pMThuKSAmJiAhaXNTaW5nbGVJMThuSWN1KGVsZW1lbnQuaTE4bik7XG5cbiAgICBpZiAoaXNJMThuUm9vdEVsZW1lbnQgJiYgdGhpcy5pMThuKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBtYXJrIGFuIGVsZW1lbnQgYXMgdHJhbnNsYXRhYmxlIGluc2lkZSBvZiBhIHRyYW5zbGF0YWJsZSBzZWN0aW9uYCk7XG4gICAgfVxuXG4gICAgY29uc3QgaTE4bkF0dHJzOiAodC5UZXh0QXR0cmlidXRlIHwgdC5Cb3VuZEF0dHJpYnV0ZSlbXSA9IFtdO1xuICAgIGNvbnN0IG91dHB1dEF0dHJzOiB0LlRleHRBdHRyaWJ1dGVbXSA9IFtdO1xuXG4gICAgY29uc3QgW25hbWVzcGFjZUtleSwgZWxlbWVudE5hbWVdID0gc3BsaXROc05hbWUoZWxlbWVudC5uYW1lKTtcbiAgICBjb25zdCBpc05nQ29udGFpbmVyID0gY2hlY2tJc05nQ29udGFpbmVyKGVsZW1lbnQubmFtZSk7XG5cbiAgICAvLyBIYW5kbGUgc3R5bGluZywgaTE4biwgbmdOb25CaW5kYWJsZSBhdHRyaWJ1dGVzXG4gICAgZm9yIChjb25zdCBhdHRyIG9mIGVsZW1lbnQuYXR0cmlidXRlcykge1xuICAgICAgY29uc3Qge25hbWUsIHZhbHVlfSA9IGF0dHI7XG4gICAgICBpZiAobmFtZSA9PT0gTk9OX0JJTkRBQkxFX0FUVFIpIHtcbiAgICAgICAgaXNOb25CaW5kYWJsZU1vZGUgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChuYW1lID09PSAnc3R5bGUnKSB7XG4gICAgICAgIHN0eWxpbmdCdWlsZGVyLnJlZ2lzdGVyU3R5bGVBdHRyKHZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAobmFtZSA9PT0gJ2NsYXNzJykge1xuICAgICAgICBzdHlsaW5nQnVpbGRlci5yZWdpc3RlckNsYXNzQXR0cih2YWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoYXR0ci5pMThuKSB7XG4gICAgICAgICAgLy8gUGxhY2UgYXR0cmlidXRlcyBpbnRvIGEgc2VwYXJhdGUgYXJyYXkgZm9yIGkxOG4gcHJvY2Vzc2luZywgYnV0IGFsc28ga2VlcCBzdWNoXG4gICAgICAgICAgLy8gYXR0cmlidXRlcyBpbiB0aGUgbWFpbiBsaXN0IHRvIG1ha2UgdGhlbSBhdmFpbGFibGUgZm9yIGRpcmVjdGl2ZSBtYXRjaGluZyBhdCBydW50aW1lLlxuICAgICAgICAgIC8vIFRPRE8oRlctMTI0OCk6IHByZXZlbnQgYXR0cmlidXRlcyBkdXBsaWNhdGlvbiBpbiBgaTE4bkF0dHJpYnV0ZXNgIGFuZCBgZWxlbWVudFN0YXJ0YFxuICAgICAgICAgIC8vIGFyZ3VtZW50c1xuICAgICAgICAgIGkxOG5BdHRycy5wdXNoKGF0dHIpO1xuICAgICAgICB9XG4gICAgICAgIG91dHB1dEF0dHJzLnB1c2goYXR0cik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTWF0Y2ggZGlyZWN0aXZlcyBvbiBub24gaTE4biBhdHRyaWJ1dGVzXG4gICAgdGhpcy5tYXRjaERpcmVjdGl2ZXMoZWxlbWVudC5uYW1lLCBlbGVtZW50KTtcblxuICAgIC8vIFJlZ3VsYXIgZWxlbWVudCBvciBuZy1jb250YWluZXIgY3JlYXRpb24gbW9kZVxuICAgIGNvbnN0IHBhcmFtZXRlcnM6IG8uRXhwcmVzc2lvbltdID0gW28ubGl0ZXJhbChlbGVtZW50SW5kZXgpXTtcbiAgICBpZiAoIWlzTmdDb250YWluZXIpIHtcbiAgICAgIHBhcmFtZXRlcnMucHVzaChvLmxpdGVyYWwoZWxlbWVudE5hbWUpKTtcbiAgICB9XG5cbiAgICAvLyBBZGQgdGhlIGF0dHJpYnV0ZXNcbiAgICBjb25zdCBhdHRyaWJ1dGVzOiBvLkV4cHJlc3Npb25bXSA9IFtdO1xuICAgIGNvbnN0IGFsbE90aGVySW5wdXRzOiB0LkJvdW5kQXR0cmlidXRlW10gPSBbXTtcblxuICAgIGVsZW1lbnQuaW5wdXRzLmZvckVhY2goKGlucHV0OiB0LkJvdW5kQXR0cmlidXRlKSA9PiB7XG4gICAgICBjb25zdCBzdHlsaW5nSW5wdXRXYXNTZXQgPSBzdHlsaW5nQnVpbGRlci5yZWdpc3RlckJvdW5kSW5wdXQoaW5wdXQpO1xuICAgICAgaWYgKCFzdHlsaW5nSW5wdXRXYXNTZXQpIHtcbiAgICAgICAgaWYgKGlucHV0LnR5cGUgPT09IEJpbmRpbmdUeXBlLlByb3BlcnR5ICYmIGlucHV0LmkxOG4pIHtcbiAgICAgICAgICAvLyBQbGFjZSBhdHRyaWJ1dGVzIGludG8gYSBzZXBhcmF0ZSBhcnJheSBmb3IgaTE4biBwcm9jZXNzaW5nLCBidXQgYWxzbyBrZWVwIHN1Y2hcbiAgICAgICAgICAvLyBhdHRyaWJ1dGVzIGluIHRoZSBtYWluIGxpc3QgdG8gbWFrZSB0aGVtIGF2YWlsYWJsZSBmb3IgZGlyZWN0aXZlIG1hdGNoaW5nIGF0IHJ1bnRpbWUuXG4gICAgICAgICAgLy8gVE9ETyhGVy0xMjQ4KTogcHJldmVudCBhdHRyaWJ1dGVzIGR1cGxpY2F0aW9uIGluIGBpMThuQXR0cmlidXRlc2AgYW5kIGBlbGVtZW50U3RhcnRgXG4gICAgICAgICAgLy8gYXJndW1lbnRzXG4gICAgICAgICAgaTE4bkF0dHJzLnB1c2goaW5wdXQpO1xuICAgICAgICB9XG4gICAgICAgIGFsbE90aGVySW5wdXRzLnB1c2goaW5wdXQpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgb3V0cHV0QXR0cnMuZm9yRWFjaChhdHRyID0+IHtcbiAgICAgIGlmIChhdHRyLm5hbWUgPT09IE5HX1BST0pFQ1RfQVNfQVRUUl9OQU1FKSB7XG4gICAgICAgIGF0dHJpYnV0ZXMucHVzaCguLi5nZXROZ1Byb2plY3RBc0xpdGVyYWwoYXR0cikpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXR0cmlidXRlcy5wdXNoKC4uLmdldEF0dHJpYnV0ZU5hbWVMaXRlcmFscyhhdHRyLm5hbWUpLCBvLmxpdGVyYWwoYXR0ci52YWx1ZSkpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gYWRkIGF0dHJpYnV0ZXMgZm9yIGRpcmVjdGl2ZSBhbmQgcHJvamVjdGlvbiBtYXRjaGluZyBwdXJwb3Nlc1xuICAgIGF0dHJpYnV0ZXMucHVzaCguLi50aGlzLnByZXBhcmVOb25SZW5kZXJBdHRycyhhbGxPdGhlcklucHV0cywgZWxlbWVudC5vdXRwdXRzLCBzdHlsaW5nQnVpbGRlcikpO1xuICAgIHBhcmFtZXRlcnMucHVzaCh0aGlzLnRvQXR0cnNQYXJhbShhdHRyaWJ1dGVzKSk7XG5cbiAgICAvLyBsb2NhbCByZWZzIChleC46IDxkaXYgI2ZvbyAjYmFyPVwiYmF6XCI+KVxuICAgIHBhcmFtZXRlcnMucHVzaCh0aGlzLnByZXBhcmVSZWZzUGFyYW1ldGVyKGVsZW1lbnQucmVmZXJlbmNlcykpO1xuXG4gICAgY29uc3Qgd2FzSW5OYW1lc3BhY2UgPSB0aGlzLl9uYW1lc3BhY2U7XG4gICAgY29uc3QgY3VycmVudE5hbWVzcGFjZSA9IHRoaXMuZ2V0TmFtZXNwYWNlSW5zdHJ1Y3Rpb24obmFtZXNwYWNlS2V5KTtcblxuICAgIC8vIElmIHRoZSBuYW1lc3BhY2UgaXMgY2hhbmdpbmcgbm93LCBpbmNsdWRlIGFuIGluc3RydWN0aW9uIHRvIGNoYW5nZSBpdFxuICAgIC8vIGR1cmluZyBlbGVtZW50IGNyZWF0aW9uLlxuICAgIGlmIChjdXJyZW50TmFtZXNwYWNlICE9PSB3YXNJbk5hbWVzcGFjZSkge1xuICAgICAgdGhpcy5hZGROYW1lc3BhY2VJbnN0cnVjdGlvbihjdXJyZW50TmFtZXNwYWNlLCBlbGVtZW50KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pMThuKSB7XG4gICAgICB0aGlzLmkxOG4uYXBwZW5kRWxlbWVudChlbGVtZW50LmkxOG4gISwgZWxlbWVudEluZGV4KTtcbiAgICB9XG5cbiAgICBjb25zdCBoYXNDaGlsZHJlbiA9ICgpID0+IHtcbiAgICAgIGlmICghaXNJMThuUm9vdEVsZW1lbnQgJiYgdGhpcy5pMThuKSB7XG4gICAgICAgIC8vIHdlIGRvIG5vdCBhcHBlbmQgdGV4dCBub2RlIGluc3RydWN0aW9ucyBhbmQgSUNVcyBpbnNpZGUgaTE4biBzZWN0aW9uLFxuICAgICAgICAvLyBzbyB3ZSBleGNsdWRlIHRoZW0gd2hpbGUgY2FsY3VsYXRpbmcgd2hldGhlciBjdXJyZW50IGVsZW1lbnQgaGFzIGNoaWxkcmVuXG4gICAgICAgIHJldHVybiAhaGFzVGV4dENoaWxkcmVuT25seShlbGVtZW50LmNoaWxkcmVuKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBlbGVtZW50LmNoaWxkcmVuLmxlbmd0aCA+IDA7XG4gICAgfTtcblxuICAgIGNvbnN0IGNyZWF0ZVNlbGZDbG9zaW5nSW5zdHJ1Y3Rpb24gPSAhc3R5bGluZ0J1aWxkZXIuaGFzQmluZGluZ3MgJiYgIWlzTmdDb250YWluZXIgJiZcbiAgICAgICAgZWxlbWVudC5vdXRwdXRzLmxlbmd0aCA9PT0gMCAmJiBpMThuQXR0cnMubGVuZ3RoID09PSAwICYmICFoYXNDaGlsZHJlbigpO1xuXG4gICAgY29uc3QgY3JlYXRlU2VsZkNsb3NpbmdJMThuSW5zdHJ1Y3Rpb24gPSAhY3JlYXRlU2VsZkNsb3NpbmdJbnN0cnVjdGlvbiAmJlxuICAgICAgICAhc3R5bGluZ0J1aWxkZXIuaGFzQmluZGluZ3MgJiYgaGFzVGV4dENoaWxkcmVuT25seShlbGVtZW50LmNoaWxkcmVuKTtcblxuICAgIGlmIChjcmVhdGVTZWxmQ2xvc2luZ0luc3RydWN0aW9uKSB7XG4gICAgICB0aGlzLmNyZWF0aW9uSW5zdHJ1Y3Rpb24oZWxlbWVudC5zb3VyY2VTcGFuLCBSMy5lbGVtZW50LCB0cmltVHJhaWxpbmdOdWxscyhwYXJhbWV0ZXJzKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY3JlYXRpb25JbnN0cnVjdGlvbihcbiAgICAgICAgICBlbGVtZW50LnNvdXJjZVNwYW4sIGlzTmdDb250YWluZXIgPyBSMy5lbGVtZW50Q29udGFpbmVyU3RhcnQgOiBSMy5lbGVtZW50U3RhcnQsXG4gICAgICAgICAgdHJpbVRyYWlsaW5nTnVsbHMocGFyYW1ldGVycykpO1xuXG4gICAgICBpZiAoaXNOb25CaW5kYWJsZU1vZGUpIHtcbiAgICAgICAgdGhpcy5jcmVhdGlvbkluc3RydWN0aW9uKGVsZW1lbnQuc291cmNlU3BhbiwgUjMuZGlzYWJsZUJpbmRpbmdzKTtcbiAgICAgIH1cblxuICAgICAgLy8gcHJvY2VzcyBpMThuIGVsZW1lbnQgYXR0cmlidXRlc1xuICAgICAgaWYgKGkxOG5BdHRycy5sZW5ndGgpIHtcbiAgICAgICAgbGV0IGhhc0JpbmRpbmdzOiBib29sZWFuID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IGkxOG5BdHRyQXJnczogby5FeHByZXNzaW9uW10gPSBbXTtcbiAgICAgICAgaTE4bkF0dHJzLmZvckVhY2goYXR0ciA9PiB7XG4gICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGF0dHIuaTE4biAhYXMgaTE4bi5NZXNzYWdlO1xuICAgICAgICAgIGlmIChhdHRyIGluc3RhbmNlb2YgdC5UZXh0QXR0cmlidXRlKSB7XG4gICAgICAgICAgICBpMThuQXR0ckFyZ3MucHVzaChvLmxpdGVyYWwoYXR0ci5uYW1lKSwgdGhpcy5pMThuVHJhbnNsYXRlKG1lc3NhZ2UpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgY29udmVydGVkID0gYXR0ci52YWx1ZS52aXNpdCh0aGlzLl92YWx1ZUNvbnZlcnRlcik7XG4gICAgICAgICAgICB0aGlzLmFsbG9jYXRlQmluZGluZ1Nsb3RzKGNvbnZlcnRlZCk7XG4gICAgICAgICAgICBpZiAoY29udmVydGVkIGluc3RhbmNlb2YgSW50ZXJwb2xhdGlvbikge1xuICAgICAgICAgICAgICBjb25zdCBwbGFjZWhvbGRlcnMgPSBhc3NlbWJsZUJvdW5kVGV4dFBsYWNlaG9sZGVycyhtZXNzYWdlKTtcbiAgICAgICAgICAgICAgY29uc3QgcGFyYW1zID0gcGxhY2Vob2xkZXJzVG9QYXJhbXMocGxhY2Vob2xkZXJzKTtcbiAgICAgICAgICAgICAgaTE4bkF0dHJBcmdzLnB1c2goby5saXRlcmFsKGF0dHIubmFtZSksIHRoaXMuaTE4blRyYW5zbGF0ZShtZXNzYWdlLCBwYXJhbXMpKTtcbiAgICAgICAgICAgICAgY29udmVydGVkLmV4cHJlc3Npb25zLmZvckVhY2goZXhwcmVzc2lvbiA9PiB7XG4gICAgICAgICAgICAgICAgaGFzQmluZGluZ3MgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGNvbnN0IGJpbmRpbmcgPSB0aGlzLmNvbnZlcnRFeHByZXNzaW9uQmluZGluZyhleHByZXNzaW9uKTtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUluc3RydWN0aW9uKGVsZW1lbnRJbmRleCwgZWxlbWVudC5zb3VyY2VTcGFuLCBSMy5pMThuRXhwLCBbYmluZGluZ10pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoaTE4bkF0dHJBcmdzLmxlbmd0aCkge1xuICAgICAgICAgIGNvbnN0IGluZGV4OiBvLkV4cHJlc3Npb24gPSBvLmxpdGVyYWwodGhpcy5hbGxvY2F0ZURhdGFTbG90KCkpO1xuICAgICAgICAgIGNvbnN0IGFyZ3MgPSB0aGlzLmNvbnN0YW50UG9vbC5nZXRDb25zdExpdGVyYWwoby5saXRlcmFsQXJyKGkxOG5BdHRyQXJncyksIHRydWUpO1xuICAgICAgICAgIHRoaXMuY3JlYXRpb25JbnN0cnVjdGlvbihlbGVtZW50LnNvdXJjZVNwYW4sIFIzLmkxOG5BdHRyaWJ1dGVzLCBbaW5kZXgsIGFyZ3NdKTtcbiAgICAgICAgICBpZiAoaGFzQmluZGluZ3MpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlSW5zdHJ1Y3Rpb24oZWxlbWVudEluZGV4LCBlbGVtZW50LnNvdXJjZVNwYW4sIFIzLmkxOG5BcHBseSwgW2luZGV4XSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBzdHlsZSBiaW5kaW5ncyBjb2RlIGlzIHBsYWNlZCBpbnRvIHR3byBkaXN0aW5jdCBibG9ja3Mgd2l0aGluIHRoZSB0ZW1wbGF0ZSBmdW5jdGlvbiBBT1RcbiAgICAgIC8vIGNvZGU6IGNyZWF0aW9uIGFuZCB1cGRhdGUuIFRoZSBjcmVhdGlvbiBjb2RlIGNvbnRhaW5zIHRoZSBgZWxlbWVudFN0eWxpbmdgIGluc3RydWN0aW9uc1xuICAgICAgLy8gd2hpY2ggd2lsbCBhcHBseSB0aGUgY29sbGVjdGVkIGJpbmRpbmcgdmFsdWVzIHRvIHRoZSBlbGVtZW50LiBgZWxlbWVudFN0eWxpbmdgIGlzXG4gICAgICAvLyBkZXNpZ25lZCB0byBydW4gaW5zaWRlIG9mIGBlbGVtZW50U3RhcnRgIGFuZCBgZWxlbWVudEVuZGAuIFRoZSB1cGRhdGUgaW5zdHJ1Y3Rpb25zXG4gICAgICAvLyAodGhpbmdzIGxpa2UgYGVsZW1lbnRTdHlsZVByb3BgLCBgZWxlbWVudENsYXNzUHJvcGAsIGV0Yy4uKSBhcmUgYXBwbGllZCBsYXRlciBvbiBpbiB0aGlzXG4gICAgICAvLyBmaWxlXG4gICAgICB0aGlzLnByb2Nlc3NTdHlsaW5nSW5zdHJ1Y3Rpb24oXG4gICAgICAgICAgc3R5bGluZ0J1aWxkZXIuYnVpbGRFbGVtZW50U3R5bGluZ0luc3RydWN0aW9uKGVsZW1lbnQuc291cmNlU3BhbiwgdGhpcy5jb25zdGFudFBvb2wpLFxuICAgICAgICAgIHRydWUpO1xuXG4gICAgICAvLyBHZW5lcmF0ZSBMaXN0ZW5lcnMgKG91dHB1dHMpXG4gICAgICBlbGVtZW50Lm91dHB1dHMuZm9yRWFjaCgob3V0cHV0QXN0OiB0LkJvdW5kRXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy5jcmVhdGlvbkluc3RydWN0aW9uKFxuICAgICAgICAgICAgb3V0cHV0QXN0LnNvdXJjZVNwYW4sIFIzLmxpc3RlbmVyLFxuICAgICAgICAgICAgdGhpcy5wcmVwYXJlTGlzdGVuZXJQYXJhbWV0ZXIoZWxlbWVudC5uYW1lLCBvdXRwdXRBc3QsIGVsZW1lbnRJbmRleCkpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIE5vdGU6IGl0J3MgaW1wb3J0YW50IHRvIGtlZXAgaTE4bi9pMThuU3RhcnQgaW5zdHJ1Y3Rpb25zIGFmdGVyIGkxOG5BdHRyaWJ1dGVzIGFuZFxuICAgICAgLy8gbGlzdGVuZXJzLCB0byBtYWtlIHN1cmUgaTE4bkF0dHJpYnV0ZXMgaW5zdHJ1Y3Rpb24gdGFyZ2V0cyBjdXJyZW50IGVsZW1lbnQgYXQgcnVudGltZS5cbiAgICAgIGlmIChpc0kxOG5Sb290RWxlbWVudCkge1xuICAgICAgICB0aGlzLmkxOG5TdGFydChlbGVtZW50LnNvdXJjZVNwYW4sIGVsZW1lbnQuaTE4biAhLCBjcmVhdGVTZWxmQ2xvc2luZ0kxOG5JbnN0cnVjdGlvbik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gdGhlIGNvZGUgaGVyZSB3aWxsIGNvbGxlY3QgYWxsIHVwZGF0ZS1sZXZlbCBzdHlsaW5nIGluc3RydWN0aW9ucyBhbmQgYWRkIHRoZW0gdG8gdGhlXG4gICAgLy8gdXBkYXRlIGJsb2NrIG9mIHRoZSB0ZW1wbGF0ZSBmdW5jdGlvbiBBT1QgY29kZS4gSW5zdHJ1Y3Rpb25zIGxpa2UgYGVsZW1lbnRTdHlsZVByb3BgLFxuICAgIC8vIGBlbGVtZW50U3R5bGluZ01hcGAsIGBlbGVtZW50Q2xhc3NQcm9wYCBhbmQgYGVsZW1lbnRTdHlsaW5nQXBwbHlgIGFyZSBhbGwgZ2VuZXJhdGVkXG4gICAgLy8gYW5kIGFzc2lnbiBpbiB0aGUgY29kZSBiZWxvdy5cbiAgICBzdHlsaW5nQnVpbGRlci5idWlsZFVwZGF0ZUxldmVsSW5zdHJ1Y3Rpb25zKHRoaXMuX3ZhbHVlQ29udmVydGVyKS5mb3JFYWNoKGluc3RydWN0aW9uID0+IHtcbiAgICAgIHRoaXMuX2JpbmRpbmdTbG90cyArPSBpbnN0cnVjdGlvbi5hbGxvY2F0ZUJpbmRpbmdTbG90cztcbiAgICAgIHRoaXMucHJvY2Vzc1N0eWxpbmdJbnN0cnVjdGlvbihpbnN0cnVjdGlvbiwgZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgLy8gdGhlIHJlYXNvbiB3aHkgYHVuZGVmaW5lZGAgaXMgdXNlZCBpcyBiZWNhdXNlIHRoZSByZW5kZXJlciB1bmRlcnN0YW5kcyB0aGlzIGFzIGFcbiAgICAvLyBzcGVjaWFsIHZhbHVlIHRvIHN5bWJvbGl6ZSB0aGF0IHRoZXJlIGlzIG5vIFJIUyB0byB0aGlzIGJpbmRpbmdcbiAgICAvLyBUT0RPIChtYXRza28pOiByZXZpc2l0IHRoaXMgb25jZSBGVy05NTkgaXMgYXBwcm9hY2hlZFxuICAgIGNvbnN0IGVtcHR5VmFsdWVCaW5kSW5zdHJ1Y3Rpb24gPSBvLmxpdGVyYWwodW5kZWZpbmVkKTtcblxuICAgIC8vIEdlbmVyYXRlIGVsZW1lbnQgaW5wdXQgYmluZGluZ3NcbiAgICBhbGxPdGhlcklucHV0cy5mb3JFYWNoKChpbnB1dDogdC5Cb3VuZEF0dHJpYnV0ZSkgPT4ge1xuICAgICAgY29uc3QgaW5wdXRUeXBlID0gaW5wdXQudHlwZTtcbiAgICAgIGlmIChpbnB1dFR5cGUgPT09IEJpbmRpbmdUeXBlLkFuaW1hdGlvbikge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGlucHV0LnZhbHVlLnZpc2l0KHRoaXMuX3ZhbHVlQ29udmVydGVyKTtcbiAgICAgICAgLy8gYW5pbWF0aW9uIGJpbmRpbmdzIGNhbiBiZSBwcmVzZW50ZWQgaW4gdGhlIGZvbGxvd2luZyBmb3JtYXRzOlxuICAgICAgICAvLyAxLiBbQGJpbmRpbmddPVwiZm9vRXhwXCJcbiAgICAgICAgLy8gMi4gW0BiaW5kaW5nXT1cInt2YWx1ZTpmb29FeHAsIHBhcmFtczp7Li4ufX1cIlxuICAgICAgICAvLyAzLiBbQGJpbmRpbmddXG4gICAgICAgIC8vIDQuIEBiaW5kaW5nXG4gICAgICAgIC8vIEFsbCBmb3JtYXRzIHdpbGwgYmUgdmFsaWQgZm9yIHdoZW4gYSBzeW50aGV0aWMgYmluZGluZyBpcyBjcmVhdGVkLlxuICAgICAgICAvLyBUaGUgcmVhc29uaW5nIGZvciB0aGlzIGlzIGJlY2F1c2UgdGhlIHJlbmRlcmVyIHNob3VsZCBnZXQgZWFjaFxuICAgICAgICAvLyBzeW50aGV0aWMgYmluZGluZyB2YWx1ZSBpbiB0aGUgb3JkZXIgb2YgdGhlIGFycmF5IHRoYXQgdGhleSBhcmVcbiAgICAgICAgLy8gZGVmaW5lZCBpbi4uLlxuICAgICAgICBjb25zdCBoYXNWYWx1ZSA9IHZhbHVlIGluc3RhbmNlb2YgTGl0ZXJhbFByaW1pdGl2ZSA/ICEhdmFsdWUudmFsdWUgOiB0cnVlO1xuICAgICAgICB0aGlzLmFsbG9jYXRlQmluZGluZ1Nsb3RzKHZhbHVlKTtcbiAgICAgICAgY29uc3QgYmluZGluZ05hbWUgPSBwcmVwYXJlU3ludGhldGljUHJvcGVydHlOYW1lKGlucHV0Lm5hbWUpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlSW5zdHJ1Y3Rpb24oZWxlbWVudEluZGV4LCBpbnB1dC5zb3VyY2VTcGFuLCBSMy5wcm9wZXJ0eSwgKCkgPT4ge1xuICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICBvLmxpdGVyYWwoYmluZGluZ05hbWUpLFxuICAgICAgICAgICAgKGhhc1ZhbHVlID8gdGhpcy5jb252ZXJ0UHJvcGVydHlCaW5kaW5nKHZhbHVlLCAvKiBza2lwQmluZEZuICovIHRydWUpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGVtcHR5VmFsdWVCaW5kSW5zdHJ1Y3Rpb24pLFxuICAgICAgICAgIF07XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gd2UgbXVzdCBza2lwIGF0dHJpYnV0ZXMgd2l0aCBhc3NvY2lhdGVkIGkxOG4gY29udGV4dCwgc2luY2UgdGhlc2UgYXR0cmlidXRlcyBhcmUgaGFuZGxlZFxuICAgICAgICAvLyBzZXBhcmF0ZWx5IGFuZCBjb3JyZXNwb25kaW5nIGBpMThuRXhwYCBhbmQgYGkxOG5BcHBseWAgaW5zdHJ1Y3Rpb25zIHdpbGwgYmUgZ2VuZXJhdGVkXG4gICAgICAgIGlmIChpbnB1dC5pMThuKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgdmFsdWUgPSBpbnB1dC52YWx1ZS52aXNpdCh0aGlzLl92YWx1ZUNvbnZlcnRlcik7XG4gICAgICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgY29uc3QgcGFyYW1zOiBhbnlbXSA9IFtdO1xuICAgICAgICAgIGNvbnN0IFthdHRyTmFtZXNwYWNlLCBhdHRyTmFtZV0gPSBzcGxpdE5zTmFtZShpbnB1dC5uYW1lKTtcbiAgICAgICAgICBjb25zdCBpc0F0dHJpYnV0ZUJpbmRpbmcgPSBpbnB1dFR5cGUgPT09IEJpbmRpbmdUeXBlLkF0dHJpYnV0ZTtcbiAgICAgICAgICBjb25zdCBzYW5pdGl6YXRpb25SZWYgPSByZXNvbHZlU2FuaXRpemF0aW9uRm4oaW5wdXQuc2VjdXJpdHlDb250ZXh0LCBpc0F0dHJpYnV0ZUJpbmRpbmcpO1xuICAgICAgICAgIGlmIChzYW5pdGl6YXRpb25SZWYpIHBhcmFtcy5wdXNoKHNhbml0aXphdGlvblJlZik7XG4gICAgICAgICAgaWYgKGF0dHJOYW1lc3BhY2UpIHtcbiAgICAgICAgICAgIGNvbnN0IG5hbWVzcGFjZUxpdGVyYWwgPSBvLmxpdGVyYWwoYXR0ck5hbWVzcGFjZSk7XG5cbiAgICAgICAgICAgIGlmIChzYW5pdGl6YXRpb25SZWYpIHtcbiAgICAgICAgICAgICAgcGFyYW1zLnB1c2gobmFtZXNwYWNlTGl0ZXJhbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBJZiB0aGVyZSB3YXNuJ3QgYSBzYW5pdGl6YXRpb24gcmVmLCB3ZSBuZWVkIHRvIGFkZFxuICAgICAgICAgICAgICAvLyBhbiBleHRyYSBwYXJhbSBzbyB0aGF0IHdlIGNhbiBwYXNzIGluIHRoZSBuYW1lc3BhY2UuXG4gICAgICAgICAgICAgIHBhcmFtcy5wdXNoKG8ubGl0ZXJhbChudWxsKSwgbmFtZXNwYWNlTGl0ZXJhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuYWxsb2NhdGVCaW5kaW5nU2xvdHModmFsdWUpO1xuXG4gICAgICAgICAgaWYgKGlucHV0VHlwZSA9PT0gQmluZGluZ1R5cGUuUHJvcGVydHkpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEludGVycG9sYXRpb24pIHtcbiAgICAgICAgICAgICAgdGhpcy51cGRhdGVJbnN0cnVjdGlvbihcbiAgICAgICAgICAgICAgICAgIGVsZW1lbnRJbmRleCwgaW5wdXQuc291cmNlU3BhbiwgZ2V0UHJvcGVydHlJbnRlcnBvbGF0aW9uRXhwcmVzc2lvbih2YWx1ZSksXG4gICAgICAgICAgICAgICAgICAoKSA9PlxuICAgICAgICAgICAgICAgICAgICAgIFtvLmxpdGVyYWwoYXR0ck5hbWUpLCAuLi50aGlzLmdldFVwZGF0ZUluc3RydWN0aW9uQXJndW1lbnRzKHZhbHVlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgLi4ucGFyYW1zXSk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIEJvdW5kLCB1bi1pbnRlcnBvbGF0ZWQgcHJvcGVydGllc1xuICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUluc3RydWN0aW9uKGVsZW1lbnRJbmRleCwgaW5wdXQuc291cmNlU3BhbiwgUjMucHJvcGVydHksICgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW28ubGl0ZXJhbChhdHRyTmFtZSksIHRoaXMuY29udmVydFByb3BlcnR5QmluZGluZyh2YWx1ZSwgdHJ1ZSksIC4uLnBhcmFtc107XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgaW5zdHJ1Y3Rpb246IGFueTtcblxuICAgICAgICAgICAgaWYgKGlucHV0VHlwZSA9PT0gQmluZGluZ1R5cGUuQ2xhc3MpIHtcbiAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb24gPSBSMy5lbGVtZW50Q2xhc3NQcm9wO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb24gPSBSMy5lbGVtZW50QXR0cmlidXRlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUluc3RydWN0aW9uKGVsZW1lbnRJbmRleCwgaW5wdXQuc291cmNlU3BhbiwgaW5zdHJ1Y3Rpb24sICgpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICBvLmxpdGVyYWwoZWxlbWVudEluZGV4KSwgby5saXRlcmFsKGF0dHJOYW1lKSwgdGhpcy5jb252ZXJ0UHJvcGVydHlCaW5kaW5nKHZhbHVlKSxcbiAgICAgICAgICAgICAgICAuLi5wYXJhbXNcbiAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gVHJhdmVyc2UgZWxlbWVudCBjaGlsZCBub2Rlc1xuICAgIHQudmlzaXRBbGwodGhpcywgZWxlbWVudC5jaGlsZHJlbik7XG5cbiAgICBpZiAoIWlzSTE4blJvb3RFbGVtZW50ICYmIHRoaXMuaTE4bikge1xuICAgICAgdGhpcy5pMThuLmFwcGVuZEVsZW1lbnQoZWxlbWVudC5pMThuICEsIGVsZW1lbnRJbmRleCwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgaWYgKCFjcmVhdGVTZWxmQ2xvc2luZ0luc3RydWN0aW9uKSB7XG4gICAgICAvLyBGaW5pc2ggZWxlbWVudCBjb25zdHJ1Y3Rpb24gbW9kZS5cbiAgICAgIGNvbnN0IHNwYW4gPSBlbGVtZW50LmVuZFNvdXJjZVNwYW4gfHwgZWxlbWVudC5zb3VyY2VTcGFuO1xuICAgICAgaWYgKGlzSTE4blJvb3RFbGVtZW50KSB7XG4gICAgICAgIHRoaXMuaTE4bkVuZChzcGFuLCBjcmVhdGVTZWxmQ2xvc2luZ0kxOG5JbnN0cnVjdGlvbik7XG4gICAgICB9XG4gICAgICBpZiAoaXNOb25CaW5kYWJsZU1vZGUpIHtcbiAgICAgICAgdGhpcy5jcmVhdGlvbkluc3RydWN0aW9uKHNwYW4sIFIzLmVuYWJsZUJpbmRpbmdzKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY3JlYXRpb25JbnN0cnVjdGlvbihzcGFuLCBpc05nQ29udGFpbmVyID8gUjMuZWxlbWVudENvbnRhaW5lckVuZCA6IFIzLmVsZW1lbnRFbmQpO1xuICAgIH1cbiAgfVxuXG4gIHZpc2l0VGVtcGxhdGUodGVtcGxhdGU6IHQuVGVtcGxhdGUpIHtcbiAgICBjb25zdCBOR19URU1QTEFURV9UQUdfTkFNRSA9ICduZy10ZW1wbGF0ZSc7XG4gICAgY29uc3QgdGVtcGxhdGVJbmRleCA9IHRoaXMuYWxsb2NhdGVEYXRhU2xvdCgpO1xuXG4gICAgaWYgKHRoaXMuaTE4bikge1xuICAgICAgdGhpcy5pMThuLmFwcGVuZFRlbXBsYXRlKHRlbXBsYXRlLmkxOG4gISwgdGVtcGxhdGVJbmRleCk7XG4gICAgfVxuXG4gICAgY29uc3QgdGFnTmFtZSA9IHNhbml0aXplSWRlbnRpZmllcih0ZW1wbGF0ZS50YWdOYW1lIHx8ICcnKTtcbiAgICBjb25zdCBjb250ZXh0TmFtZSA9IGAke3RoaXMuY29udGV4dE5hbWV9JHt0YWdOYW1lID8gJ18nICsgdGFnTmFtZSA6ICcnfV8ke3RlbXBsYXRlSW5kZXh9YDtcbiAgICBjb25zdCB0ZW1wbGF0ZU5hbWUgPSBgJHtjb250ZXh0TmFtZX1fVGVtcGxhdGVgO1xuXG4gICAgY29uc3QgcGFyYW1ldGVyczogby5FeHByZXNzaW9uW10gPSBbXG4gICAgICBvLmxpdGVyYWwodGVtcGxhdGVJbmRleCksXG4gICAgICBvLnZhcmlhYmxlKHRlbXBsYXRlTmFtZSksXG5cbiAgICAgIC8vIFdlIGRvbid0IGNhcmUgYWJvdXQgdGhlIHRhZydzIG5hbWVzcGFjZSBoZXJlLCBiZWNhdXNlIHdlIGluZmVyXG4gICAgICAvLyBpdCBiYXNlZCBvbiB0aGUgcGFyZW50IG5vZGVzIGluc2lkZSB0aGUgdGVtcGxhdGUgaW5zdHJ1Y3Rpb24uXG4gICAgICBvLmxpdGVyYWwodGVtcGxhdGUudGFnTmFtZSA/IHNwbGl0TnNOYW1lKHRlbXBsYXRlLnRhZ05hbWUpWzFdIDogdGVtcGxhdGUudGFnTmFtZSksXG4gICAgXTtcblxuICAgIC8vIGZpbmQgZGlyZWN0aXZlcyBtYXRjaGluZyBvbiBhIGdpdmVuIDxuZy10ZW1wbGF0ZT4gbm9kZVxuICAgIHRoaXMubWF0Y2hEaXJlY3RpdmVzKE5HX1RFTVBMQVRFX1RBR19OQU1FLCB0ZW1wbGF0ZSk7XG5cbiAgICAvLyBwcmVwYXJlIGF0dHJpYnV0ZXMgcGFyYW1ldGVyIChpbmNsdWRpbmcgYXR0cmlidXRlcyB1c2VkIGZvciBkaXJlY3RpdmUgbWF0Y2hpbmcpXG4gICAgY29uc3QgYXR0cnNFeHByczogby5FeHByZXNzaW9uW10gPSBbXTtcbiAgICB0ZW1wbGF0ZS5hdHRyaWJ1dGVzLmZvckVhY2goXG4gICAgICAgIChhOiB0LlRleHRBdHRyaWJ1dGUpID0+IHsgYXR0cnNFeHBycy5wdXNoKGFzTGl0ZXJhbChhLm5hbWUpLCBhc0xpdGVyYWwoYS52YWx1ZSkpOyB9KTtcbiAgICBhdHRyc0V4cHJzLnB1c2goLi4udGhpcy5wcmVwYXJlTm9uUmVuZGVyQXR0cnMoXG4gICAgICAgIHRlbXBsYXRlLmlucHV0cywgdGVtcGxhdGUub3V0cHV0cywgdW5kZWZpbmVkLCB0ZW1wbGF0ZS50ZW1wbGF0ZUF0dHJzKSk7XG4gICAgcGFyYW1ldGVycy5wdXNoKHRoaXMudG9BdHRyc1BhcmFtKGF0dHJzRXhwcnMpKTtcblxuICAgIC8vIGxvY2FsIHJlZnMgKGV4LjogPG5nLXRlbXBsYXRlICNmb28+KVxuICAgIGlmICh0ZW1wbGF0ZS5yZWZlcmVuY2VzICYmIHRlbXBsYXRlLnJlZmVyZW5jZXMubGVuZ3RoKSB7XG4gICAgICBwYXJhbWV0ZXJzLnB1c2godGhpcy5wcmVwYXJlUmVmc1BhcmFtZXRlcih0ZW1wbGF0ZS5yZWZlcmVuY2VzKSk7XG4gICAgICBwYXJhbWV0ZXJzLnB1c2goby5pbXBvcnRFeHByKFIzLnRlbXBsYXRlUmVmRXh0cmFjdG9yKSk7XG4gICAgfVxuXG4gICAgLy8gQ3JlYXRlIHRoZSB0ZW1wbGF0ZSBmdW5jdGlvblxuICAgIGNvbnN0IHRlbXBsYXRlVmlzaXRvciA9IG5ldyBUZW1wbGF0ZURlZmluaXRpb25CdWlsZGVyKFxuICAgICAgICB0aGlzLmNvbnN0YW50UG9vbCwgdGhpcy5fYmluZGluZ1Njb3BlLCB0aGlzLmxldmVsICsgMSwgY29udGV4dE5hbWUsIHRoaXMuaTE4bixcbiAgICAgICAgdGVtcGxhdGVJbmRleCwgdGVtcGxhdGVOYW1lLCB0aGlzLmRpcmVjdGl2ZU1hdGNoZXIsIHRoaXMuZGlyZWN0aXZlcywgdGhpcy5waXBlVHlwZUJ5TmFtZSxcbiAgICAgICAgdGhpcy5waXBlcywgdGhpcy5fbmFtZXNwYWNlLCB0aGlzLmZpbGVCYXNlZEkxOG5TdWZmaXgsIHRoaXMuaTE4blVzZUV4dGVybmFsSWRzKTtcblxuICAgIC8vIE5lc3RlZCB0ZW1wbGF0ZXMgbXVzdCBub3QgYmUgdmlzaXRlZCB1bnRpbCBhZnRlciB0aGVpciBwYXJlbnQgdGVtcGxhdGVzIGhhdmUgY29tcGxldGVkXG4gICAgLy8gcHJvY2Vzc2luZywgc28gdGhleSBhcmUgcXVldWVkIGhlcmUgdW50aWwgYWZ0ZXIgdGhlIGluaXRpYWwgcGFzcy4gT3RoZXJ3aXNlLCB3ZSB3b3VsZG4ndFxuICAgIC8vIGJlIGFibGUgdG8gc3VwcG9ydCBiaW5kaW5ncyBpbiBuZXN0ZWQgdGVtcGxhdGVzIHRvIGxvY2FsIHJlZnMgdGhhdCBvY2N1ciBhZnRlciB0aGVcbiAgICAvLyB0ZW1wbGF0ZSBkZWZpbml0aW9uLiBlLmcuIDxkaXYgKm5nSWY9XCJzaG93aW5nXCI+e3sgZm9vIH19PC9kaXY+ICA8ZGl2ICNmb28+PC9kaXY+XG4gICAgdGhpcy5fbmVzdGVkVGVtcGxhdGVGbnMucHVzaCgoKSA9PiB7XG4gICAgICBjb25zdCB0ZW1wbGF0ZUZ1bmN0aW9uRXhwciA9IHRlbXBsYXRlVmlzaXRvci5idWlsZFRlbXBsYXRlRnVuY3Rpb24oXG4gICAgICAgICAgdGVtcGxhdGUuY2hpbGRyZW4sIHRlbXBsYXRlLnZhcmlhYmxlcyxcbiAgICAgICAgICB0aGlzLl9uZ0NvbnRlbnRSZXNlcnZlZFNsb3RzLmxlbmd0aCArIHRoaXMuX25nQ29udGVudFNlbGVjdG9yc09mZnNldCwgdGVtcGxhdGUuaTE4bik7XG4gICAgICB0aGlzLmNvbnN0YW50UG9vbC5zdGF0ZW1lbnRzLnB1c2godGVtcGxhdGVGdW5jdGlvbkV4cHIudG9EZWNsU3RtdCh0ZW1wbGF0ZU5hbWUsIG51bGwpKTtcbiAgICAgIGlmICh0ZW1wbGF0ZVZpc2l0b3IuX25nQ29udGVudFJlc2VydmVkU2xvdHMubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuX25nQ29udGVudFJlc2VydmVkU2xvdHMucHVzaCguLi50ZW1wbGF0ZVZpc2l0b3IuX25nQ29udGVudFJlc2VydmVkU2xvdHMpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gZS5nLiB0ZW1wbGF0ZSgxLCBNeUNvbXBfVGVtcGxhdGVfMSlcbiAgICB0aGlzLmNyZWF0aW9uSW5zdHJ1Y3Rpb24odGVtcGxhdGUuc291cmNlU3BhbiwgUjMudGVtcGxhdGVDcmVhdGUsICgpID0+IHtcbiAgICAgIHBhcmFtZXRlcnMuc3BsaWNlKFxuICAgICAgICAgIDIsIDAsIG8ubGl0ZXJhbCh0ZW1wbGF0ZVZpc2l0b3IuZ2V0Q29uc3RDb3VudCgpKSxcbiAgICAgICAgICBvLmxpdGVyYWwodGVtcGxhdGVWaXNpdG9yLmdldFZhckNvdW50KCkpKTtcbiAgICAgIHJldHVybiB0cmltVHJhaWxpbmdOdWxscyhwYXJhbWV0ZXJzKTtcbiAgICB9KTtcblxuICAgIC8vIGhhbmRsZSBwcm9wZXJ0eSBiaW5kaW5ncyBlLmcuIMm1ybVwcm9wZXJ0eSgnbmdGb3JPZicsIGN0eC5pdGVtcyksIGV0IGFsO1xuICAgIHRoaXMudGVtcGxhdGVQcm9wZXJ0eUJpbmRpbmdzKHRlbXBsYXRlLCB0ZW1wbGF0ZUluZGV4LCB0ZW1wbGF0ZS50ZW1wbGF0ZUF0dHJzKTtcblxuICAgIC8vIE9ubHkgYWRkIG5vcm1hbCBpbnB1dC9vdXRwdXQgYmluZGluZyBpbnN0cnVjdGlvbnMgb24gZXhwbGljaXQgbmctdGVtcGxhdGUgZWxlbWVudHMuXG4gICAgaWYgKHRlbXBsYXRlLnRhZ05hbWUgPT09IE5HX1RFTVBMQVRFX1RBR19OQU1FKSB7XG4gICAgICAvLyBBZGQgdGhlIGlucHV0IGJpbmRpbmdzXG4gICAgICB0aGlzLnRlbXBsYXRlUHJvcGVydHlCaW5kaW5ncyh0ZW1wbGF0ZSwgdGVtcGxhdGVJbmRleCwgdGVtcGxhdGUuaW5wdXRzKTtcbiAgICAgIC8vIEdlbmVyYXRlIGxpc3RlbmVycyBmb3IgZGlyZWN0aXZlIG91dHB1dFxuICAgICAgdGVtcGxhdGUub3V0cHV0cy5mb3JFYWNoKChvdXRwdXRBc3Q6IHQuQm91bmRFdmVudCkgPT4ge1xuICAgICAgICB0aGlzLmNyZWF0aW9uSW5zdHJ1Y3Rpb24oXG4gICAgICAgICAgICBvdXRwdXRBc3Quc291cmNlU3BhbiwgUjMubGlzdGVuZXIsXG4gICAgICAgICAgICB0aGlzLnByZXBhcmVMaXN0ZW5lclBhcmFtZXRlcignbmdfdGVtcGxhdGUnLCBvdXRwdXRBc3QsIHRlbXBsYXRlSW5kZXgpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIFRoZXNlIHNob3VsZCBiZSBoYW5kbGVkIGluIHRoZSB0ZW1wbGF0ZSBvciBlbGVtZW50IGRpcmVjdGx5LlxuICByZWFkb25seSB2aXNpdFJlZmVyZW5jZSA9IGludmFsaWQ7XG4gIHJlYWRvbmx5IHZpc2l0VmFyaWFibGUgPSBpbnZhbGlkO1xuICByZWFkb25seSB2aXNpdFRleHRBdHRyaWJ1dGUgPSBpbnZhbGlkO1xuICByZWFkb25seSB2aXNpdEJvdW5kQXR0cmlidXRlID0gaW52YWxpZDtcbiAgcmVhZG9ubHkgdmlzaXRCb3VuZEV2ZW50ID0gaW52YWxpZDtcblxuICB2aXNpdEJvdW5kVGV4dCh0ZXh0OiB0LkJvdW5kVGV4dCkge1xuICAgIGlmICh0aGlzLmkxOG4pIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGV4dC52YWx1ZS52aXNpdCh0aGlzLl92YWx1ZUNvbnZlcnRlcik7XG4gICAgICB0aGlzLmFsbG9jYXRlQmluZGluZ1Nsb3RzKHZhbHVlKTtcbiAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEludGVycG9sYXRpb24pIHtcbiAgICAgICAgdGhpcy5pMThuLmFwcGVuZEJvdW5kVGV4dCh0ZXh0LmkxOG4gISk7XG4gICAgICAgIHRoaXMuaTE4bkFwcGVuZEJpbmRpbmdzKHZhbHVlLmV4cHJlc3Npb25zKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBub2RlSW5kZXggPSB0aGlzLmFsbG9jYXRlRGF0YVNsb3QoKTtcblxuICAgIHRoaXMuY3JlYXRpb25JbnN0cnVjdGlvbih0ZXh0LnNvdXJjZVNwYW4sIFIzLnRleHQsIFtvLmxpdGVyYWwobm9kZUluZGV4KV0pO1xuXG4gICAgY29uc3QgdmFsdWUgPSB0ZXh0LnZhbHVlLnZpc2l0KHRoaXMuX3ZhbHVlQ29udmVydGVyKTtcbiAgICB0aGlzLmFsbG9jYXRlQmluZGluZ1Nsb3RzKHZhbHVlKTtcbiAgICB0aGlzLnVwZGF0ZUluc3RydWN0aW9uKFxuICAgICAgICBub2RlSW5kZXgsIHRleHQuc291cmNlU3BhbiwgUjMudGV4dEJpbmRpbmcsXG4gICAgICAgICgpID0+IFtvLmxpdGVyYWwobm9kZUluZGV4KSwgdGhpcy5jb252ZXJ0UHJvcGVydHlCaW5kaW5nKHZhbHVlKV0pO1xuICB9XG5cbiAgdmlzaXRUZXh0KHRleHQ6IHQuVGV4dCkge1xuICAgIC8vIHdoZW4gYSB0ZXh0IGVsZW1lbnQgaXMgbG9jYXRlZCB3aXRoaW4gYSB0cmFuc2xhdGFibGVcbiAgICAvLyBibG9jaywgd2UgZXhjbHVkZSB0aGlzIHRleHQgZWxlbWVudCBmcm9tIGluc3RydWN0aW9ucyBzZXQsXG4gICAgLy8gc2luY2UgaXQgd2lsbCBiZSBjYXB0dXJlZCBpbiBpMThuIGNvbnRlbnQgYW5kIHByb2Nlc3NlZCBhdCBydW50aW1lXG4gICAgaWYgKCF0aGlzLmkxOG4pIHtcbiAgICAgIHRoaXMuY3JlYXRpb25JbnN0cnVjdGlvbihcbiAgICAgICAgICB0ZXh0LnNvdXJjZVNwYW4sIFIzLnRleHQsIFtvLmxpdGVyYWwodGhpcy5hbGxvY2F0ZURhdGFTbG90KCkpLCBvLmxpdGVyYWwodGV4dC52YWx1ZSldKTtcbiAgICB9XG4gIH1cblxuICB2aXNpdEljdShpY3U6IHQuSWN1KSB7XG4gICAgbGV0IGluaXRXYXNJbnZva2VkID0gZmFsc2U7XG5cbiAgICAvLyBpZiBhbiBJQ1Ugd2FzIGNyZWF0ZWQgb3V0c2lkZSBvZiBpMThuIGJsb2NrLCB3ZSBzdGlsbCB0cmVhdFxuICAgIC8vIGl0IGFzIGEgdHJhbnNsYXRhYmxlIGVudGl0eSBhbmQgaW52b2tlIGkxOG5TdGFydCBhbmQgaTE4bkVuZFxuICAgIC8vIHRvIGdlbmVyYXRlIGkxOG4gY29udGV4dCBhbmQgdGhlIG5lY2Vzc2FyeSBpbnN0cnVjdGlvbnNcbiAgICBpZiAoIXRoaXMuaTE4bikge1xuICAgICAgaW5pdFdhc0ludm9rZWQgPSB0cnVlO1xuICAgICAgdGhpcy5pMThuU3RhcnQobnVsbCwgaWN1LmkxOG4gISwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgY29uc3QgaTE4biA9IHRoaXMuaTE4biAhO1xuICAgIGNvbnN0IHZhcnMgPSB0aGlzLmkxOG5CaW5kUHJvcHMoaWN1LnZhcnMpO1xuICAgIGNvbnN0IHBsYWNlaG9sZGVycyA9IHRoaXMuaTE4bkJpbmRQcm9wcyhpY3UucGxhY2Vob2xkZXJzKTtcblxuICAgIC8vIG91dHB1dCBJQ1UgZGlyZWN0bHkgYW5kIGtlZXAgSUNVIHJlZmVyZW5jZSBpbiBjb250ZXh0XG4gICAgY29uc3QgbWVzc2FnZSA9IGljdS5pMThuICFhcyBpMThuLk1lc3NhZ2U7XG4gICAgY29uc3QgdHJhbnNmb3JtRm4gPSAocmF3OiBvLlJlYWRWYXJFeHByKSA9PlxuICAgICAgICBpbnN0cnVjdGlvbihudWxsLCBSMy5pMThuUG9zdHByb2Nlc3MsIFtyYXcsIG1hcExpdGVyYWwodmFycywgdHJ1ZSldKTtcblxuICAgIC8vIGluIGNhc2UgdGhlIHdob2xlIGkxOG4gbWVzc2FnZSBpcyBhIHNpbmdsZSBJQ1UgLSB3ZSBkbyBub3QgbmVlZCB0b1xuICAgIC8vIGNyZWF0ZSBhIHNlcGFyYXRlIHRvcC1sZXZlbCB0cmFuc2xhdGlvbiwgd2UgY2FuIHVzZSB0aGUgcm9vdCByZWYgaW5zdGVhZFxuICAgIC8vIGFuZCBtYWtlIHRoaXMgSUNVIGEgdG9wLWxldmVsIHRyYW5zbGF0aW9uXG4gICAgaWYgKGlzU2luZ2xlSTE4bkljdShpMThuLm1ldGEpKSB7XG4gICAgICB0aGlzLmkxOG5UcmFuc2xhdGUobWVzc2FnZSwgcGxhY2Vob2xkZXJzLCBpMThuLnJlZiwgdHJhbnNmb3JtRm4pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBvdXRwdXQgSUNVIGRpcmVjdGx5IGFuZCBrZWVwIElDVSByZWZlcmVuY2UgaW4gY29udGV4dFxuICAgICAgY29uc3QgcmVmID0gdGhpcy5pMThuVHJhbnNsYXRlKG1lc3NhZ2UsIHBsYWNlaG9sZGVycywgdW5kZWZpbmVkLCB0cmFuc2Zvcm1Gbik7XG4gICAgICBpMThuLmFwcGVuZEljdShpY3VGcm9tSTE4bk1lc3NhZ2UobWVzc2FnZSkubmFtZSwgcmVmKTtcbiAgICB9XG5cbiAgICBpZiAoaW5pdFdhc0ludm9rZWQpIHtcbiAgICAgIHRoaXMuaTE4bkVuZChudWxsLCB0cnVlKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBwcml2YXRlIGFsbG9jYXRlRGF0YVNsb3QoKSB7IHJldHVybiB0aGlzLl9kYXRhSW5kZXgrKzsgfVxuXG4gIGdldENvbnN0Q291bnQoKSB7IHJldHVybiB0aGlzLl9kYXRhSW5kZXg7IH1cblxuICBnZXRWYXJDb3VudCgpIHsgcmV0dXJuIHRoaXMuX3B1cmVGdW5jdGlvblNsb3RzOyB9XG5cbiAgZ2V0TmdDb250ZW50U2VsZWN0b3JzKCk6IG8uRXhwcmVzc2lvbnxudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fbmdDb250ZW50UmVzZXJ2ZWRTbG90cy5sZW5ndGggP1xuICAgICAgICB0aGlzLmNvbnN0YW50UG9vbC5nZXRDb25zdExpdGVyYWwoYXNMaXRlcmFsKHRoaXMuX25nQ29udGVudFJlc2VydmVkU2xvdHMpLCB0cnVlKSA6XG4gICAgICAgIG51bGw7XG4gIH1cblxuICBwcml2YXRlIGJpbmRpbmdDb250ZXh0KCkgeyByZXR1cm4gYCR7dGhpcy5fYmluZGluZ0NvbnRleHQrK31gOyB9XG5cbiAgcHJpdmF0ZSB0ZW1wbGF0ZVByb3BlcnR5QmluZGluZ3MoXG4gICAgICB0ZW1wbGF0ZTogdC5UZW1wbGF0ZSwgdGVtcGxhdGVJbmRleDogbnVtYmVyLCBhdHRyczogKHQuQm91bmRBdHRyaWJ1dGV8dC5UZXh0QXR0cmlidXRlKVtdKSB7XG4gICAgYXR0cnMuZm9yRWFjaChpbnB1dCA9PiB7XG4gICAgICBpZiAoaW5wdXQgaW5zdGFuY2VvZiB0LkJvdW5kQXR0cmlidXRlKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gaW5wdXQudmFsdWUudmlzaXQodGhpcy5fdmFsdWVDb252ZXJ0ZXIpO1xuICAgICAgICB0aGlzLmFsbG9jYXRlQmluZGluZ1Nsb3RzKHZhbHVlKTtcbiAgICAgICAgdGhpcy51cGRhdGVJbnN0cnVjdGlvbihcbiAgICAgICAgICAgIHRlbXBsYXRlSW5kZXgsIHRlbXBsYXRlLnNvdXJjZVNwYW4sIFIzLnByb3BlcnR5LFxuICAgICAgICAgICAgKCkgPT4gW28ubGl0ZXJhbChpbnB1dC5uYW1lKSwgdGhpcy5jb252ZXJ0UHJvcGVydHlCaW5kaW5nKHZhbHVlLCB0cnVlKV0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gQmluZGluZ3MgbXVzdCBvbmx5IGJlIHJlc29sdmVkIGFmdGVyIGFsbCBsb2NhbCByZWZzIGhhdmUgYmVlbiB2aXNpdGVkLCBzbyBhbGxcbiAgLy8gaW5zdHJ1Y3Rpb25zIGFyZSBxdWV1ZWQgaW4gY2FsbGJhY2tzIHRoYXQgZXhlY3V0ZSBvbmNlIHRoZSBpbml0aWFsIHBhc3MgaGFzIGNvbXBsZXRlZC5cbiAgLy8gT3RoZXJ3aXNlLCB3ZSB3b3VsZG4ndCBiZSBhYmxlIHRvIHN1cHBvcnQgbG9jYWwgcmVmcyB0aGF0IGFyZSBkZWZpbmVkIGFmdGVyIHRoZWlyXG4gIC8vIGJpbmRpbmdzLiBlLmcuIHt7IGZvbyB9fSA8ZGl2ICNmb28+PC9kaXY+XG4gIHByaXZhdGUgaW5zdHJ1Y3Rpb25GbihcbiAgICAgIGZuczogKCgpID0+IG8uU3RhdGVtZW50KVtdLCBzcGFuOiBQYXJzZVNvdXJjZVNwYW58bnVsbCwgcmVmZXJlbmNlOiBvLkV4dGVybmFsUmVmZXJlbmNlLFxuICAgICAgcGFyYW1zT3JGbjogby5FeHByZXNzaW9uW118KCgpID0+IG8uRXhwcmVzc2lvbltdKSwgcHJlcGVuZDogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XG4gICAgZm5zW3ByZXBlbmQgPyAndW5zaGlmdCcgOiAncHVzaCddKCgpID0+IHtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IEFycmF5LmlzQXJyYXkocGFyYW1zT3JGbikgPyBwYXJhbXNPckZuIDogcGFyYW1zT3JGbigpO1xuICAgICAgcmV0dXJuIGluc3RydWN0aW9uKHNwYW4sIHJlZmVyZW5jZSwgcGFyYW1zKS50b1N0bXQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgcHJvY2Vzc1N0eWxpbmdJbnN0cnVjdGlvbihpbnN0cnVjdGlvbjogSW5zdHJ1Y3Rpb258bnVsbCwgY3JlYXRlTW9kZTogYm9vbGVhbikge1xuICAgIGlmIChpbnN0cnVjdGlvbikge1xuICAgICAgY29uc3QgcGFyYW1zRm4gPSAoKSA9PlxuICAgICAgICAgIGluc3RydWN0aW9uLmJ1aWxkUGFyYW1zKHZhbHVlID0+IHRoaXMuY29udmVydFByb3BlcnR5QmluZGluZyh2YWx1ZSwgdHJ1ZSkpO1xuICAgICAgaWYgKGNyZWF0ZU1vZGUpIHtcbiAgICAgICAgdGhpcy5jcmVhdGlvbkluc3RydWN0aW9uKGluc3RydWN0aW9uLnNvdXJjZVNwYW4sIGluc3RydWN0aW9uLnJlZmVyZW5jZSwgcGFyYW1zRm4pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy51cGRhdGVJbnN0cnVjdGlvbigtMSwgaW5zdHJ1Y3Rpb24uc291cmNlU3BhbiwgaW5zdHJ1Y3Rpb24ucmVmZXJlbmNlLCBwYXJhbXNGbik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGlvbkluc3RydWN0aW9uKFxuICAgICAgc3BhbjogUGFyc2VTb3VyY2VTcGFufG51bGwsIHJlZmVyZW5jZTogby5FeHRlcm5hbFJlZmVyZW5jZSxcbiAgICAgIHBhcmFtc09yRm4/OiBvLkV4cHJlc3Npb25bXXwoKCkgPT4gby5FeHByZXNzaW9uW10pLCBwcmVwZW5kPzogYm9vbGVhbikge1xuICAgIHRoaXMuaW5zdHJ1Y3Rpb25Gbih0aGlzLl9jcmVhdGlvbkNvZGVGbnMsIHNwYW4sIHJlZmVyZW5jZSwgcGFyYW1zT3JGbiB8fCBbXSwgcHJlcGVuZCk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUluc3RydWN0aW9uKFxuICAgICAgbm9kZUluZGV4OiBudW1iZXIsIHNwYW46IFBhcnNlU291cmNlU3BhbnxudWxsLCByZWZlcmVuY2U6IG8uRXh0ZXJuYWxSZWZlcmVuY2UsXG4gICAgICBwYXJhbXNPckZuPzogby5FeHByZXNzaW9uW118KCgpID0+IG8uRXhwcmVzc2lvbltdKSkge1xuICAgIGlmICh0aGlzLl9sYXN0Tm9kZUluZGV4V2l0aEZsdXNoIDwgbm9kZUluZGV4KSB7XG4gICAgICB0aGlzLmluc3RydWN0aW9uRm4odGhpcy5fdXBkYXRlQ29kZUZucywgc3BhbiwgUjMuc2VsZWN0LCBbby5saXRlcmFsKG5vZGVJbmRleCldKTtcbiAgICAgIHRoaXMuX2xhc3ROb2RlSW5kZXhXaXRoRmx1c2ggPSBub2RlSW5kZXg7XG4gICAgfVxuICAgIHRoaXMuaW5zdHJ1Y3Rpb25Gbih0aGlzLl91cGRhdGVDb2RlRm5zLCBzcGFuLCByZWZlcmVuY2UsIHBhcmFtc09yRm4gfHwgW10pO1xuICB9XG5cbiAgcHJpdmF0ZSBhbGxvY2F0ZVB1cmVGdW5jdGlvblNsb3RzKG51bVNsb3RzOiBudW1iZXIpOiBudW1iZXIge1xuICAgIGNvbnN0IG9yaWdpbmFsU2xvdHMgPSB0aGlzLl9wdXJlRnVuY3Rpb25TbG90cztcbiAgICB0aGlzLl9wdXJlRnVuY3Rpb25TbG90cyArPSBudW1TbG90cztcbiAgICByZXR1cm4gb3JpZ2luYWxTbG90cztcbiAgfVxuXG4gIHByaXZhdGUgYWxsb2NhdGVCaW5kaW5nU2xvdHModmFsdWU6IEFTVHxudWxsKSB7XG4gICAgdGhpcy5fYmluZGluZ1Nsb3RzICs9IHZhbHVlIGluc3RhbmNlb2YgSW50ZXJwb2xhdGlvbiA/IHZhbHVlLmV4cHJlc3Npb25zLmxlbmd0aCA6IDE7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhbiBleHByZXNzaW9uIHRoYXQgcmVmZXJzIHRvIHRoZSBpbXBsaWNpdCByZWNlaXZlci4gVGhlIGltcGxpY2l0XG4gICAqIHJlY2VpdmVyIGlzIGFsd2F5cyB0aGUgcm9vdCBsZXZlbCBjb250ZXh0LlxuICAgKi9cbiAgcHJpdmF0ZSBnZXRJbXBsaWNpdFJlY2VpdmVyRXhwcigpOiBvLlJlYWRWYXJFeHByIHtcbiAgICBpZiAodGhpcy5faW1wbGljaXRSZWNlaXZlckV4cHIpIHtcbiAgICAgIHJldHVybiB0aGlzLl9pbXBsaWNpdFJlY2VpdmVyRXhwcjtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5faW1wbGljaXRSZWNlaXZlckV4cHIgPSB0aGlzLmxldmVsID09PSAwID9cbiAgICAgICAgby52YXJpYWJsZShDT05URVhUX05BTUUpIDpcbiAgICAgICAgdGhpcy5fYmluZGluZ1Njb3BlLmdldE9yQ3JlYXRlU2hhcmVkQ29udGV4dFZhcigwKTtcbiAgfVxuXG4gIHByaXZhdGUgY29udmVydEV4cHJlc3Npb25CaW5kaW5nKHZhbHVlOiBBU1QpOiBvLkV4cHJlc3Npb24ge1xuICAgIGNvbnN0IGNvbnZlcnRlZFByb3BlcnR5QmluZGluZyA9IGNvbnZlcnRQcm9wZXJ0eUJpbmRpbmcoXG4gICAgICAgIHRoaXMsIHRoaXMuZ2V0SW1wbGljaXRSZWNlaXZlckV4cHIoKSwgdmFsdWUsIHRoaXMuYmluZGluZ0NvbnRleHQoKSwgQmluZGluZ0Zvcm0uVHJ5U2ltcGxlKTtcbiAgICBjb25zdCB2YWxFeHByID0gY29udmVydGVkUHJvcGVydHlCaW5kaW5nLmN1cnJWYWxFeHByO1xuXG4gICAgcmV0dXJuIG8uaW1wb3J0RXhwcihSMy5iaW5kKS5jYWxsRm4oW3ZhbEV4cHJdKTtcbiAgfVxuXG4gIHByaXZhdGUgY29udmVydFByb3BlcnR5QmluZGluZyh2YWx1ZTogQVNULCBza2lwQmluZEZuPzogYm9vbGVhbik6IG8uRXhwcmVzc2lvbiB7XG4gICAgY29uc3QgaW50ZXJwb2xhdGlvbkZuID1cbiAgICAgICAgdmFsdWUgaW5zdGFuY2VvZiBJbnRlcnBvbGF0aW9uID8gaW50ZXJwb2xhdGUgOiAoKSA9PiBlcnJvcignVW5leHBlY3RlZCBpbnRlcnBvbGF0aW9uJyk7XG5cbiAgICBjb25zdCBjb252ZXJ0ZWRQcm9wZXJ0eUJpbmRpbmcgPSBjb252ZXJ0UHJvcGVydHlCaW5kaW5nKFxuICAgICAgICB0aGlzLCB0aGlzLmdldEltcGxpY2l0UmVjZWl2ZXJFeHByKCksIHZhbHVlLCB0aGlzLmJpbmRpbmdDb250ZXh0KCksIEJpbmRpbmdGb3JtLlRyeVNpbXBsZSxcbiAgICAgICAgaW50ZXJwb2xhdGlvbkZuKTtcbiAgICBjb25zdCB2YWxFeHByID0gY29udmVydGVkUHJvcGVydHlCaW5kaW5nLmN1cnJWYWxFeHByO1xuICAgIHRoaXMuX3RlbXBWYXJpYWJsZXMucHVzaCguLi5jb252ZXJ0ZWRQcm9wZXJ0eUJpbmRpbmcuc3RtdHMpO1xuXG4gICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgSW50ZXJwb2xhdGlvbiB8fCBza2lwQmluZEZuID8gdmFsRXhwciA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgby5pbXBvcnRFeHByKFIzLmJpbmQpLmNhbGxGbihbdmFsRXhwcl0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSBsaXN0IG9mIGFyZ3VtZW50IGV4cHJlc3Npb25zIHRvIHBhc3MgdG8gYW4gdXBkYXRlIGluc3RydWN0aW9uIGV4cHJlc3Npb24uIEFsc28gdXBkYXRlc1xuICAgKiB0aGUgdGVtcCB2YXJpYWJsZXMgc3RhdGUgd2l0aCB0ZW1wIHZhcmlhYmxlcyB0aGF0IHdlcmUgaWRlbnRpZmllZCBhcyBuZWVkaW5nIHRvIGJlIGNyZWF0ZWRcbiAgICogd2hpbGUgdmlzaXRpbmcgdGhlIGFyZ3VtZW50cy5cbiAgICogQHBhcmFtIHZhbHVlIFRoZSBvcmlnaW5hbCBleHByZXNzaW9uIHdlIHdpbGwgYmUgcmVzb2x2aW5nIGFuIGFyZ3VtZW50cyBsaXN0IGZyb20uXG4gICAqL1xuICBwcml2YXRlIGdldFVwZGF0ZUluc3RydWN0aW9uQXJndW1lbnRzKHZhbHVlOiBBU1QpOiBvLkV4cHJlc3Npb25bXSB7XG4gICAgY29uc3Qge2FyZ3MsIHN0bXRzfSA9XG4gICAgICAgIGNvbnZlcnRVcGRhdGVBcmd1bWVudHModGhpcywgdGhpcy5nZXRJbXBsaWNpdFJlY2VpdmVyRXhwcigpLCB2YWx1ZSwgdGhpcy5iaW5kaW5nQ29udGV4dCgpKTtcblxuICAgIHRoaXMuX3RlbXBWYXJpYWJsZXMucHVzaCguLi5zdG10cyk7XG4gICAgcmV0dXJuIGFyZ3M7XG4gIH1cblxuICBwcml2YXRlIG1hdGNoRGlyZWN0aXZlcyh0YWdOYW1lOiBzdHJpbmcsIGVsT3JUcGw6IHQuRWxlbWVudHx0LlRlbXBsYXRlKSB7XG4gICAgaWYgKHRoaXMuZGlyZWN0aXZlTWF0Y2hlcikge1xuICAgICAgY29uc3Qgc2VsZWN0b3IgPSBjcmVhdGVDc3NTZWxlY3Rvcih0YWdOYW1lLCBnZXRBdHRyc0ZvckRpcmVjdGl2ZU1hdGNoaW5nKGVsT3JUcGwpKTtcbiAgICAgIHRoaXMuZGlyZWN0aXZlTWF0Y2hlci5tYXRjaChcbiAgICAgICAgICBzZWxlY3RvciwgKGNzc1NlbGVjdG9yLCBzdGF0aWNUeXBlKSA9PiB7IHRoaXMuZGlyZWN0aXZlcy5hZGQoc3RhdGljVHlwZSk7IH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQcmVwYXJlcyBhbGwgYXR0cmlidXRlIGV4cHJlc3Npb24gdmFsdWVzIGZvciB0aGUgYFRBdHRyaWJ1dGVzYCBhcnJheS5cbiAgICpcbiAgICogVGhlIHB1cnBvc2Ugb2YgdGhpcyBmdW5jdGlvbiBpcyB0byBwcm9wZXJseSBjb25zdHJ1Y3QgYW4gYXR0cmlidXRlcyBhcnJheSB0aGF0XG4gICAqIGlzIHBhc3NlZCBpbnRvIHRoZSBgZWxlbWVudFN0YXJ0YCAob3IganVzdCBgZWxlbWVudGApIGZ1bmN0aW9ucy4gQmVjYXVzZSB0aGVyZVxuICAgKiBhcmUgbWFueSBkaWZmZXJlbnQgdHlwZXMgb2YgYXR0cmlidXRlcywgdGhlIGFycmF5IG5lZWRzIHRvIGJlIGNvbnN0cnVjdGVkIGluIGFcbiAgICogc3BlY2lhbCB3YXkgc28gdGhhdCBgZWxlbWVudFN0YXJ0YCBjYW4gcHJvcGVybHkgZXZhbHVhdGUgdGhlbS5cbiAgICpcbiAgICogVGhlIGZvcm1hdCBsb29rcyBsaWtlIHRoaXM6XG4gICAqXG4gICAqIGBgYFxuICAgKiBhdHRycyA9IFtwcm9wLCB2YWx1ZSwgcHJvcDIsIHZhbHVlMixcbiAgICogICBDTEFTU0VTLCBjbGFzczEsIGNsYXNzMixcbiAgICogICBTVFlMRVMsIHN0eWxlMSwgdmFsdWUxLCBzdHlsZTIsIHZhbHVlMixcbiAgICogICBCSU5ESU5HUywgbmFtZTEsIG5hbWUyLCBuYW1lMyxcbiAgICogICBURU1QTEFURSwgbmFtZTQsIG5hbWU1LCAuLi5dXG4gICAqIGBgYFxuICAgKlxuICAgKiBOb3RlIHRoYXQgdGhpcyBmdW5jdGlvbiB3aWxsIGZ1bGx5IGlnbm9yZSBhbGwgc3ludGhldGljIChAZm9vKSBhdHRyaWJ1dGUgdmFsdWVzXG4gICAqIGJlY2F1c2UgdGhvc2UgdmFsdWVzIGFyZSBpbnRlbmRlZCB0byBhbHdheXMgYmUgZ2VuZXJhdGVkIGFzIHByb3BlcnR5IGluc3RydWN0aW9ucy5cbiAgICovXG4gIHByaXZhdGUgcHJlcGFyZU5vblJlbmRlckF0dHJzKFxuICAgICAgaW5wdXRzOiB0LkJvdW5kQXR0cmlidXRlW10sIG91dHB1dHM6IHQuQm91bmRFdmVudFtdLCBzdHlsZXM/OiBTdHlsaW5nQnVpbGRlcixcbiAgICAgIHRlbXBsYXRlQXR0cnM6ICh0LkJvdW5kQXR0cmlidXRlfHQuVGV4dEF0dHJpYnV0ZSlbXSA9IFtdKTogby5FeHByZXNzaW9uW10ge1xuICAgIGNvbnN0IGFscmVhZHlTZWVuID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgY29uc3QgYXR0ckV4cHJzOiBvLkV4cHJlc3Npb25bXSA9IFtdO1xuXG4gICAgZnVuY3Rpb24gYWRkQXR0ckV4cHIoa2V5OiBzdHJpbmcgfCBudW1iZXIsIHZhbHVlPzogby5FeHByZXNzaW9uKTogdm9pZCB7XG4gICAgICBpZiAodHlwZW9mIGtleSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgaWYgKCFhbHJlYWR5U2Vlbi5oYXMoa2V5KSkge1xuICAgICAgICAgIGF0dHJFeHBycy5wdXNoKC4uLmdldEF0dHJpYnV0ZU5hbWVMaXRlcmFscyhrZXkpKTtcbiAgICAgICAgICB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIGF0dHJFeHBycy5wdXNoKHZhbHVlKTtcbiAgICAgICAgICBhbHJlYWR5U2Vlbi5hZGQoa2V5KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXR0ckV4cHJzLnB1c2goby5saXRlcmFsKGtleSkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGl0J3MgaW1wb3J0YW50IHRoYXQgdGhpcyBvY2N1cnMgYmVmb3JlIEJJTkRJTkdTIGFuZCBURU1QTEFURSBiZWNhdXNlIG9uY2UgYGVsZW1lbnRTdGFydGBcbiAgICAvLyBjb21lcyBhY3Jvc3MgdGhlIEJJTkRJTkdTIG9yIFRFTVBMQVRFIG1hcmtlcnMgdGhlbiBpdCB3aWxsIGNvbnRpbnVlIHJlYWRpbmcgZWFjaCB2YWx1ZSBhc1xuICAgIC8vIGFzIHNpbmdsZSBwcm9wZXJ0eSB2YWx1ZSBjZWxsIGJ5IGNlbGwuXG4gICAgaWYgKHN0eWxlcykge1xuICAgICAgc3R5bGVzLnBvcHVsYXRlSW5pdGlhbFN0eWxpbmdBdHRycyhhdHRyRXhwcnMpO1xuICAgIH1cblxuICAgIGlmIChpbnB1dHMubGVuZ3RoIHx8IG91dHB1dHMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBhdHRyc1N0YXJ0SW5kZXggPSBhdHRyRXhwcnMubGVuZ3RoO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlucHV0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBpbnB1dCA9IGlucHV0c1tpXTtcbiAgICAgICAgaWYgKGlucHV0LnR5cGUgIT09IEJpbmRpbmdUeXBlLkFuaW1hdGlvbikge1xuICAgICAgICAgIGFkZEF0dHJFeHByKGlucHV0Lm5hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3V0cHV0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBvdXRwdXQgPSBvdXRwdXRzW2ldO1xuICAgICAgICBpZiAob3V0cHV0LnR5cGUgIT09IFBhcnNlZEV2ZW50VHlwZS5BbmltYXRpb24pIHtcbiAgICAgICAgICBhZGRBdHRyRXhwcihvdXRwdXQubmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gdGhpcyBpcyBhIGNoZWFwIHdheSBvZiBhZGRpbmcgdGhlIG1hcmtlciBvbmx5IGFmdGVyIGFsbCB0aGUgaW5wdXQvb3V0cHV0XG4gICAgICAvLyB2YWx1ZXMgaGF2ZSBiZWVuIGZpbHRlcmVkIChieSBub3QgaW5jbHVkaW5nIHRoZSBhbmltYXRpb24gb25lcykgYW5kIGFkZGVkXG4gICAgICAvLyB0byB0aGUgZXhwcmVzc2lvbnMuIFRoZSBtYXJrZXIgaXMgaW1wb3J0YW50IGJlY2F1c2UgaXQgdGVsbHMgdGhlIHJ1bnRpbWVcbiAgICAgIC8vIGNvZGUgdGhhdCB0aGlzIGlzIHdoZXJlIGF0dHJpYnV0ZXMgd2l0aG91dCB2YWx1ZXMgc3RhcnQuLi5cbiAgICAgIGlmIChhdHRyRXhwcnMubGVuZ3RoKSB7XG4gICAgICAgIGF0dHJFeHBycy5zcGxpY2UoYXR0cnNTdGFydEluZGV4LCAwLCBvLmxpdGVyYWwoY29yZS5BdHRyaWJ1dGVNYXJrZXIuQmluZGluZ3MpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGVtcGxhdGVBdHRycy5sZW5ndGgpIHtcbiAgICAgIGF0dHJFeHBycy5wdXNoKG8ubGl0ZXJhbChjb3JlLkF0dHJpYnV0ZU1hcmtlci5UZW1wbGF0ZSkpO1xuICAgICAgdGVtcGxhdGVBdHRycy5mb3JFYWNoKGF0dHIgPT4gYWRkQXR0ckV4cHIoYXR0ci5uYW1lKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGF0dHJFeHBycztcbiAgfVxuXG4gIHByaXZhdGUgdG9BdHRyc1BhcmFtKGF0dHJzRXhwcnM6IG8uRXhwcmVzc2lvbltdKTogby5FeHByZXNzaW9uIHtcbiAgICByZXR1cm4gYXR0cnNFeHBycy5sZW5ndGggPiAwID9cbiAgICAgICAgdGhpcy5jb25zdGFudFBvb2wuZ2V0Q29uc3RMaXRlcmFsKG8ubGl0ZXJhbEFycihhdHRyc0V4cHJzKSwgdHJ1ZSkgOlxuICAgICAgICBvLlRZUEVEX05VTExfRVhQUjtcbiAgfVxuXG4gIHByaXZhdGUgcHJlcGFyZVJlZnNQYXJhbWV0ZXIocmVmZXJlbmNlczogdC5SZWZlcmVuY2VbXSk6IG8uRXhwcmVzc2lvbiB7XG4gICAgaWYgKCFyZWZlcmVuY2VzIHx8IHJlZmVyZW5jZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gby5UWVBFRF9OVUxMX0VYUFI7XG4gICAgfVxuXG4gICAgY29uc3QgcmVmc1BhcmFtID0gZmxhdHRlbihyZWZlcmVuY2VzLm1hcChyZWZlcmVuY2UgPT4ge1xuICAgICAgY29uc3Qgc2xvdCA9IHRoaXMuYWxsb2NhdGVEYXRhU2xvdCgpO1xuICAgICAgLy8gR2VuZXJhdGUgdGhlIHVwZGF0ZSB0ZW1wb3JhcnkuXG4gICAgICBjb25zdCB2YXJpYWJsZU5hbWUgPSB0aGlzLl9iaW5kaW5nU2NvcGUuZnJlc2hSZWZlcmVuY2VOYW1lKCk7XG4gICAgICBjb25zdCByZXRyaWV2YWxMZXZlbCA9IHRoaXMubGV2ZWw7XG4gICAgICBjb25zdCBsaHMgPSBvLnZhcmlhYmxlKHZhcmlhYmxlTmFtZSk7XG4gICAgICB0aGlzLl9iaW5kaW5nU2NvcGUuc2V0KFxuICAgICAgICAgIHJldHJpZXZhbExldmVsLCByZWZlcmVuY2UubmFtZSwgbGhzLFxuICAgICAgICAgIERlY2xhcmF0aW9uUHJpb3JpdHkuREVGQVVMVCwgKHNjb3BlOiBCaW5kaW5nU2NvcGUsIHJlbGF0aXZlTGV2ZWw6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgLy8gZS5nLiBuZXh0Q29udGV4dCgyKTtcbiAgICAgICAgICAgIGNvbnN0IG5leHRDb250ZXh0U3RtdCA9XG4gICAgICAgICAgICAgICAgcmVsYXRpdmVMZXZlbCA+IDAgPyBbZ2VuZXJhdGVOZXh0Q29udGV4dEV4cHIocmVsYXRpdmVMZXZlbCkudG9TdG10KCldIDogW107XG5cbiAgICAgICAgICAgIC8vIGUuZy4gY29uc3QgJGZvbyQgPSByZWZlcmVuY2UoMSk7XG4gICAgICAgICAgICBjb25zdCByZWZFeHByID0gbGhzLnNldChvLmltcG9ydEV4cHIoUjMucmVmZXJlbmNlKS5jYWxsRm4oW28ubGl0ZXJhbChzbG90KV0pKTtcbiAgICAgICAgICAgIHJldHVybiBuZXh0Q29udGV4dFN0bXQuY29uY2F0KHJlZkV4cHIudG9Db25zdERlY2woKSk7XG4gICAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICByZXR1cm4gW3JlZmVyZW5jZS5uYW1lLCByZWZlcmVuY2UudmFsdWVdO1xuICAgIH0pKTtcblxuICAgIHJldHVybiB0aGlzLmNvbnN0YW50UG9vbC5nZXRDb25zdExpdGVyYWwoYXNMaXRlcmFsKHJlZnNQYXJhbSksIHRydWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBwcmVwYXJlTGlzdGVuZXJQYXJhbWV0ZXIodGFnTmFtZTogc3RyaW5nLCBvdXRwdXRBc3Q6IHQuQm91bmRFdmVudCwgaW5kZXg6IG51bWJlcik6XG4gICAgICAoKSA9PiBvLkV4cHJlc3Npb25bXSB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGNvbnN0IGV2ZW50TmFtZTogc3RyaW5nID0gb3V0cHV0QXN0Lm5hbWU7XG4gICAgICBjb25zdCBiaW5kaW5nRm5OYW1lID0gb3V0cHV0QXN0LnR5cGUgPT09IFBhcnNlZEV2ZW50VHlwZS5BbmltYXRpb24gP1xuICAgICAgICAgIC8vIHN5bnRoZXRpYyBAbGlzdGVuZXIuZm9vIHZhbHVlcyBhcmUgdHJlYXRlZCB0aGUgZXhhY3Qgc2FtZSBhcyBhcmUgc3RhbmRhcmQgbGlzdGVuZXJzXG4gICAgICAgICAgcHJlcGFyZVN5bnRoZXRpY0xpc3RlbmVyRnVuY3Rpb25OYW1lKGV2ZW50TmFtZSwgb3V0cHV0QXN0LnBoYXNlICEpIDpcbiAgICAgICAgICBzYW5pdGl6ZUlkZW50aWZpZXIoZXZlbnROYW1lKTtcbiAgICAgIGNvbnN0IGhhbmRsZXJOYW1lID0gYCR7dGhpcy50ZW1wbGF0ZU5hbWV9XyR7dGFnTmFtZX1fJHtiaW5kaW5nRm5OYW1lfV8ke2luZGV4fV9saXN0ZW5lcmA7XG4gICAgICBjb25zdCBzY29wZSA9IHRoaXMuX2JpbmRpbmdTY29wZS5uZXN0ZWRTY29wZSh0aGlzLl9iaW5kaW5nU2NvcGUuYmluZGluZ0xldmVsKTtcbiAgICAgIHJldHVybiBwcmVwYXJlRXZlbnRMaXN0ZW5lclBhcmFtZXRlcnMob3V0cHV0QXN0LCBoYW5kbGVyTmFtZSwgc2NvcGUpO1xuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFZhbHVlQ29udmVydGVyIGV4dGVuZHMgQXN0TWVtb3J5RWZmaWNpZW50VHJhbnNmb3JtZXIge1xuICBwcml2YXRlIF9waXBlQmluZEV4cHJzOiBGdW5jdGlvbkNhbGxbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBjb25zdGFudFBvb2w6IENvbnN0YW50UG9vbCwgcHJpdmF0ZSBhbGxvY2F0ZVNsb3Q6ICgpID0+IG51bWJlcixcbiAgICAgIHByaXZhdGUgYWxsb2NhdGVQdXJlRnVuY3Rpb25TbG90czogKG51bVNsb3RzOiBudW1iZXIpID0+IG51bWJlcixcbiAgICAgIHByaXZhdGUgZGVmaW5lUGlwZTpcbiAgICAgICAgICAobmFtZTogc3RyaW5nLCBsb2NhbE5hbWU6IHN0cmluZywgc2xvdDogbnVtYmVyLCB2YWx1ZTogby5FeHByZXNzaW9uKSA9PiB2b2lkKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIC8vIEFzdE1lbW9yeUVmZmljaWVudFRyYW5zZm9ybWVyXG4gIHZpc2l0UGlwZShwaXBlOiBCaW5kaW5nUGlwZSwgY29udGV4dDogYW55KTogQVNUIHtcbiAgICAvLyBBbGxvY2F0ZSBhIHNsb3QgdG8gY3JlYXRlIHRoZSBwaXBlXG4gICAgY29uc3Qgc2xvdCA9IHRoaXMuYWxsb2NhdGVTbG90KCk7XG4gICAgY29uc3Qgc2xvdFBzZXVkb0xvY2FsID0gYFBJUEU6JHtzbG90fWA7XG4gICAgLy8gQWxsb2NhdGUgb25lIHNsb3QgZm9yIHRoZSByZXN1bHQgcGx1cyBvbmUgc2xvdCBwZXIgcGlwZSBhcmd1bWVudFxuICAgIGNvbnN0IHB1cmVGdW5jdGlvblNsb3QgPSB0aGlzLmFsbG9jYXRlUHVyZUZ1bmN0aW9uU2xvdHMoMiArIHBpcGUuYXJncy5sZW5ndGgpO1xuICAgIGNvbnN0IHRhcmdldCA9IG5ldyBQcm9wZXJ0eVJlYWQocGlwZS5zcGFuLCBuZXcgSW1wbGljaXRSZWNlaXZlcihwaXBlLnNwYW4pLCBzbG90UHNldWRvTG9jYWwpO1xuICAgIGNvbnN0IHtpZGVudGlmaWVyLCBpc1Zhckxlbmd0aH0gPSBwaXBlQmluZGluZ0NhbGxJbmZvKHBpcGUuYXJncyk7XG4gICAgdGhpcy5kZWZpbmVQaXBlKHBpcGUubmFtZSwgc2xvdFBzZXVkb0xvY2FsLCBzbG90LCBvLmltcG9ydEV4cHIoaWRlbnRpZmllcikpO1xuICAgIGNvbnN0IGFyZ3M6IEFTVFtdID0gW3BpcGUuZXhwLCAuLi5waXBlLmFyZ3NdO1xuICAgIGNvbnN0IGNvbnZlcnRlZEFyZ3M6IEFTVFtdID1cbiAgICAgICAgaXNWYXJMZW5ndGggPyB0aGlzLnZpc2l0QWxsKFtuZXcgTGl0ZXJhbEFycmF5KHBpcGUuc3BhbiwgYXJncyldKSA6IHRoaXMudmlzaXRBbGwoYXJncyk7XG5cbiAgICBjb25zdCBwaXBlQmluZEV4cHIgPSBuZXcgRnVuY3Rpb25DYWxsKHBpcGUuc3BhbiwgdGFyZ2V0LCBbXG4gICAgICBuZXcgTGl0ZXJhbFByaW1pdGl2ZShwaXBlLnNwYW4sIHNsb3QpLFxuICAgICAgbmV3IExpdGVyYWxQcmltaXRpdmUocGlwZS5zcGFuLCBwdXJlRnVuY3Rpb25TbG90KSxcbiAgICAgIC4uLmNvbnZlcnRlZEFyZ3MsXG4gICAgXSk7XG4gICAgdGhpcy5fcGlwZUJpbmRFeHBycy5wdXNoKHBpcGVCaW5kRXhwcik7XG4gICAgcmV0dXJuIHBpcGVCaW5kRXhwcjtcbiAgfVxuXG4gIHVwZGF0ZVBpcGVTbG90T2Zmc2V0cyhiaW5kaW5nU2xvdHM6IG51bWJlcikge1xuICAgIHRoaXMuX3BpcGVCaW5kRXhwcnMuZm9yRWFjaCgocGlwZTogRnVuY3Rpb25DYWxsKSA9PiB7XG4gICAgICAvLyB1cGRhdGUgdGhlIHNsb3Qgb2Zmc2V0IGFyZyAoaW5kZXggMSkgdG8gYWNjb3VudCBmb3IgYmluZGluZyBzbG90c1xuICAgICAgY29uc3Qgc2xvdE9mZnNldCA9IHBpcGUuYXJnc1sxXSBhcyBMaXRlcmFsUHJpbWl0aXZlO1xuICAgICAgKHNsb3RPZmZzZXQudmFsdWUgYXMgbnVtYmVyKSArPSBiaW5kaW5nU2xvdHM7XG4gICAgfSk7XG4gIH1cblxuICB2aXNpdExpdGVyYWxBcnJheShhcnJheTogTGl0ZXJhbEFycmF5LCBjb250ZXh0OiBhbnkpOiBBU1Qge1xuICAgIHJldHVybiBuZXcgQnVpbHRpbkZ1bmN0aW9uQ2FsbChhcnJheS5zcGFuLCB0aGlzLnZpc2l0QWxsKGFycmF5LmV4cHJlc3Npb25zKSwgdmFsdWVzID0+IHtcbiAgICAgIC8vIElmIHRoZSBsaXRlcmFsIGhhcyBjYWxjdWxhdGVkIChub24tbGl0ZXJhbCkgZWxlbWVudHMgdHJhbnNmb3JtIGl0IGludG9cbiAgICAgIC8vIGNhbGxzIHRvIGxpdGVyYWwgZmFjdG9yaWVzIHRoYXQgY29tcG9zZSB0aGUgbGl0ZXJhbCBhbmQgd2lsbCBjYWNoZSBpbnRlcm1lZGlhdGVcbiAgICAgIC8vIHZhbHVlcy4gT3RoZXJ3aXNlLCBqdXN0IHJldHVybiBhbiBsaXRlcmFsIGFycmF5IHRoYXQgY29udGFpbnMgdGhlIHZhbHVlcy5cbiAgICAgIGNvbnN0IGxpdGVyYWwgPSBvLmxpdGVyYWxBcnIodmFsdWVzKTtcbiAgICAgIHJldHVybiB2YWx1ZXMuZXZlcnkoYSA9PiBhLmlzQ29uc3RhbnQoKSkgP1xuICAgICAgICAgIHRoaXMuY29uc3RhbnRQb29sLmdldENvbnN0TGl0ZXJhbChsaXRlcmFsLCB0cnVlKSA6XG4gICAgICAgICAgZ2V0TGl0ZXJhbEZhY3RvcnkodGhpcy5jb25zdGFudFBvb2wsIGxpdGVyYWwsIHRoaXMuYWxsb2NhdGVQdXJlRnVuY3Rpb25TbG90cyk7XG4gICAgfSk7XG4gIH1cblxuICB2aXNpdExpdGVyYWxNYXAobWFwOiBMaXRlcmFsTWFwLCBjb250ZXh0OiBhbnkpOiBBU1Qge1xuICAgIHJldHVybiBuZXcgQnVpbHRpbkZ1bmN0aW9uQ2FsbChtYXAuc3BhbiwgdGhpcy52aXNpdEFsbChtYXAudmFsdWVzKSwgdmFsdWVzID0+IHtcbiAgICAgIC8vIElmIHRoZSBsaXRlcmFsIGhhcyBjYWxjdWxhdGVkIChub24tbGl0ZXJhbCkgZWxlbWVudHMgIHRyYW5zZm9ybSBpdCBpbnRvXG4gICAgICAvLyBjYWxscyB0byBsaXRlcmFsIGZhY3RvcmllcyB0aGF0IGNvbXBvc2UgdGhlIGxpdGVyYWwgYW5kIHdpbGwgY2FjaGUgaW50ZXJtZWRpYXRlXG4gICAgICAvLyB2YWx1ZXMuIE90aGVyd2lzZSwganVzdCByZXR1cm4gYW4gbGl0ZXJhbCBhcnJheSB0aGF0IGNvbnRhaW5zIHRoZSB2YWx1ZXMuXG4gICAgICBjb25zdCBsaXRlcmFsID0gby5saXRlcmFsTWFwKHZhbHVlcy5tYXAoXG4gICAgICAgICAgKHZhbHVlLCBpbmRleCkgPT4gKHtrZXk6IG1hcC5rZXlzW2luZGV4XS5rZXksIHZhbHVlLCBxdW90ZWQ6IG1hcC5rZXlzW2luZGV4XS5xdW90ZWR9KSkpO1xuICAgICAgcmV0dXJuIHZhbHVlcy5ldmVyeShhID0+IGEuaXNDb25zdGFudCgpKSA/XG4gICAgICAgICAgdGhpcy5jb25zdGFudFBvb2wuZ2V0Q29uc3RMaXRlcmFsKGxpdGVyYWwsIHRydWUpIDpcbiAgICAgICAgICBnZXRMaXRlcmFsRmFjdG9yeSh0aGlzLmNvbnN0YW50UG9vbCwgbGl0ZXJhbCwgdGhpcy5hbGxvY2F0ZVB1cmVGdW5jdGlvblNsb3RzKTtcbiAgICB9KTtcbiAgfVxufVxuXG4vLyBQaXBlcyBhbHdheXMgaGF2ZSBhdCBsZWFzdCBvbmUgcGFyYW1ldGVyLCB0aGUgdmFsdWUgdGhleSBvcGVyYXRlIG9uXG5jb25zdCBwaXBlQmluZGluZ0lkZW50aWZpZXJzID0gW1IzLnBpcGVCaW5kMSwgUjMucGlwZUJpbmQyLCBSMy5waXBlQmluZDMsIFIzLnBpcGVCaW5kNF07XG5cbmZ1bmN0aW9uIHBpcGVCaW5kaW5nQ2FsbEluZm8oYXJnczogby5FeHByZXNzaW9uW10pIHtcbiAgY29uc3QgaWRlbnRpZmllciA9IHBpcGVCaW5kaW5nSWRlbnRpZmllcnNbYXJncy5sZW5ndGhdO1xuICByZXR1cm4ge1xuICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIgfHwgUjMucGlwZUJpbmRWLFxuICAgIGlzVmFyTGVuZ3RoOiAhaWRlbnRpZmllcixcbiAgfTtcbn1cblxuY29uc3QgcHVyZUZ1bmN0aW9uSWRlbnRpZmllcnMgPSBbXG4gIFIzLnB1cmVGdW5jdGlvbjAsIFIzLnB1cmVGdW5jdGlvbjEsIFIzLnB1cmVGdW5jdGlvbjIsIFIzLnB1cmVGdW5jdGlvbjMsIFIzLnB1cmVGdW5jdGlvbjQsXG4gIFIzLnB1cmVGdW5jdGlvbjUsIFIzLnB1cmVGdW5jdGlvbjYsIFIzLnB1cmVGdW5jdGlvbjcsIFIzLnB1cmVGdW5jdGlvbjhcbl07XG5cbmZ1bmN0aW9uIHB1cmVGdW5jdGlvbkNhbGxJbmZvKGFyZ3M6IG8uRXhwcmVzc2lvbltdKSB7XG4gIGNvbnN0IGlkZW50aWZpZXIgPSBwdXJlRnVuY3Rpb25JZGVudGlmaWVyc1thcmdzLmxlbmd0aF07XG4gIHJldHVybiB7XG4gICAgaWRlbnRpZmllcjogaWRlbnRpZmllciB8fCBSMy5wdXJlRnVuY3Rpb25WLFxuICAgIGlzVmFyTGVuZ3RoOiAhaWRlbnRpZmllcixcbiAgfTtcbn1cblxuZnVuY3Rpb24gaW5zdHJ1Y3Rpb24oXG4gICAgc3BhbjogUGFyc2VTb3VyY2VTcGFuIHwgbnVsbCwgcmVmZXJlbmNlOiBvLkV4dGVybmFsUmVmZXJlbmNlLFxuICAgIHBhcmFtczogby5FeHByZXNzaW9uW10pOiBvLkV4cHJlc3Npb24ge1xuICByZXR1cm4gby5pbXBvcnRFeHByKHJlZmVyZW5jZSwgbnVsbCwgc3BhbikuY2FsbEZuKHBhcmFtcywgc3Bhbik7XG59XG5cbi8vIGUuZy4geCgyKTtcbmZ1bmN0aW9uIGdlbmVyYXRlTmV4dENvbnRleHRFeHByKHJlbGF0aXZlTGV2ZWxEaWZmOiBudW1iZXIpOiBvLkV4cHJlc3Npb24ge1xuICByZXR1cm4gby5pbXBvcnRFeHByKFIzLm5leHRDb250ZXh0KVxuICAgICAgLmNhbGxGbihyZWxhdGl2ZUxldmVsRGlmZiA+IDEgPyBbby5saXRlcmFsKHJlbGF0aXZlTGV2ZWxEaWZmKV0gOiBbXSk7XG59XG5cbmZ1bmN0aW9uIGdldExpdGVyYWxGYWN0b3J5KFxuICAgIGNvbnN0YW50UG9vbDogQ29uc3RhbnRQb29sLCBsaXRlcmFsOiBvLkxpdGVyYWxBcnJheUV4cHIgfCBvLkxpdGVyYWxNYXBFeHByLFxuICAgIGFsbG9jYXRlU2xvdHM6IChudW1TbG90czogbnVtYmVyKSA9PiBudW1iZXIpOiBvLkV4cHJlc3Npb24ge1xuICBjb25zdCB7bGl0ZXJhbEZhY3RvcnksIGxpdGVyYWxGYWN0b3J5QXJndW1lbnRzfSA9IGNvbnN0YW50UG9vbC5nZXRMaXRlcmFsRmFjdG9yeShsaXRlcmFsKTtcbiAgLy8gQWxsb2NhdGUgMSBzbG90IGZvciB0aGUgcmVzdWx0IHBsdXMgMSBwZXIgYXJndW1lbnRcbiAgY29uc3Qgc3RhcnRTbG90ID0gYWxsb2NhdGVTbG90cygxICsgbGl0ZXJhbEZhY3RvcnlBcmd1bWVudHMubGVuZ3RoKTtcbiAgbGl0ZXJhbEZhY3RvcnlBcmd1bWVudHMubGVuZ3RoID4gMCB8fCBlcnJvcihgRXhwZWN0ZWQgYXJndW1lbnRzIHRvIGEgbGl0ZXJhbCBmYWN0b3J5IGZ1bmN0aW9uYCk7XG4gIGNvbnN0IHtpZGVudGlmaWVyLCBpc1Zhckxlbmd0aH0gPSBwdXJlRnVuY3Rpb25DYWxsSW5mbyhsaXRlcmFsRmFjdG9yeUFyZ3VtZW50cyk7XG5cbiAgLy8gTGl0ZXJhbCBmYWN0b3JpZXMgYXJlIHB1cmUgZnVuY3Rpb25zIHRoYXQgb25seSBuZWVkIHRvIGJlIHJlLWludm9rZWQgd2hlbiB0aGUgcGFyYW1ldGVyc1xuICAvLyBjaGFuZ2UuXG4gIGNvbnN0IGFyZ3MgPSBbXG4gICAgby5saXRlcmFsKHN0YXJ0U2xvdCksXG4gICAgbGl0ZXJhbEZhY3RvcnksXG4gIF07XG5cbiAgaWYgKGlzVmFyTGVuZ3RoKSB7XG4gICAgYXJncy5wdXNoKG8ubGl0ZXJhbEFycihsaXRlcmFsRmFjdG9yeUFyZ3VtZW50cykpO1xuICB9IGVsc2Uge1xuICAgIGFyZ3MucHVzaCguLi5saXRlcmFsRmFjdG9yeUFyZ3VtZW50cyk7XG4gIH1cblxuICByZXR1cm4gby5pbXBvcnRFeHByKGlkZW50aWZpZXIpLmNhbGxGbihhcmdzKTtcbn1cblxuLyoqXG4gKiBHZXRzIGFuIGFycmF5IG9mIGxpdGVyYWxzIHRoYXQgY2FuIGJlIGFkZGVkIHRvIGFuIGV4cHJlc3Npb25cbiAqIHRvIHJlcHJlc2VudCB0aGUgbmFtZSBhbmQgbmFtZXNwYWNlIG9mIGFuIGF0dHJpYnV0ZS4gRS5nLlxuICogYDp4bGluazpocmVmYCB0dXJucyBpbnRvIGBbQXR0cmlidXRlTWFya2VyLk5hbWVzcGFjZVVSSSwgJ3hsaW5rJywgJ2hyZWYnXWAuXG4gKlxuICogQHBhcmFtIG5hbWUgTmFtZSBvZiB0aGUgYXR0cmlidXRlLCBpbmNsdWRpbmcgdGhlIG5hbWVzcGFjZS5cbiAqL1xuZnVuY3Rpb24gZ2V0QXR0cmlidXRlTmFtZUxpdGVyYWxzKG5hbWU6IHN0cmluZyk6IG8uTGl0ZXJhbEV4cHJbXSB7XG4gIGNvbnN0IFthdHRyaWJ1dGVOYW1lc3BhY2UsIGF0dHJpYnV0ZU5hbWVdID0gc3BsaXROc05hbWUobmFtZSk7XG4gIGNvbnN0IG5hbWVMaXRlcmFsID0gby5saXRlcmFsKGF0dHJpYnV0ZU5hbWUpO1xuXG4gIGlmIChhdHRyaWJ1dGVOYW1lc3BhY2UpIHtcbiAgICByZXR1cm4gW1xuICAgICAgby5saXRlcmFsKGNvcmUuQXR0cmlidXRlTWFya2VyLk5hbWVzcGFjZVVSSSksIG8ubGl0ZXJhbChhdHRyaWJ1dGVOYW1lc3BhY2UpLCBuYW1lTGl0ZXJhbFxuICAgIF07XG4gIH1cblxuICByZXR1cm4gW25hbWVMaXRlcmFsXTtcbn1cblxuLyoqXG4gKiBGdW5jdGlvbiB3aGljaCBpcyBleGVjdXRlZCB3aGVuZXZlciBhIHZhcmlhYmxlIGlzIHJlZmVyZW5jZWQgZm9yIHRoZSBmaXJzdCB0aW1lIGluIGEgZ2l2ZW5cbiAqIHNjb3BlLlxuICpcbiAqIEl0IGlzIGV4cGVjdGVkIHRoYXQgdGhlIGZ1bmN0aW9uIGNyZWF0ZXMgdGhlIGBjb25zdCBsb2NhbE5hbWUgPSBleHByZXNzaW9uYDsgc3RhdGVtZW50LlxuICovXG5leHBvcnQgdHlwZSBEZWNsYXJlTG9jYWxWYXJDYWxsYmFjayA9IChzY29wZTogQmluZGluZ1Njb3BlLCByZWxhdGl2ZUxldmVsOiBudW1iZXIpID0+IG8uU3RhdGVtZW50W107XG5cbi8qKiBUaGUgcHJlZml4IHVzZWQgdG8gZ2V0IGEgc2hhcmVkIGNvbnRleHQgaW4gQmluZGluZ1Njb3BlJ3MgbWFwLiAqL1xuY29uc3QgU0hBUkVEX0NPTlRFWFRfS0VZID0gJyQkc2hhcmVkX2N0eCQkJztcblxuLyoqXG4gKiBUaGlzIGlzIHVzZWQgd2hlbiBvbmUgcmVmZXJzIHRvIHZhcmlhYmxlIHN1Y2ggYXM6ICdsZXQgYWJjID0gbmV4dENvbnRleHQoMikuJGltcGxpY2l0YC5cbiAqIC0ga2V5IHRvIHRoZSBtYXAgaXMgdGhlIHN0cmluZyBsaXRlcmFsIGBcImFiY1wiYC5cbiAqIC0gdmFsdWUgYHJldHJpZXZhbExldmVsYCBpcyB0aGUgbGV2ZWwgZnJvbSB3aGljaCB0aGlzIHZhbHVlIGNhbiBiZSByZXRyaWV2ZWQsIHdoaWNoIGlzIDIgbGV2ZWxzXG4gKiB1cCBpbiBleGFtcGxlLlxuICogLSB2YWx1ZSBgbGhzYCBpcyB0aGUgbGVmdCBoYW5kIHNpZGUgd2hpY2ggaXMgYW4gQVNUIHJlcHJlc2VudGluZyBgYWJjYC5cbiAqIC0gdmFsdWUgYGRlY2xhcmVMb2NhbENhbGxiYWNrYCBpcyBhIGNhbGxiYWNrIHRoYXQgaXMgaW52b2tlZCB3aGVuIGRlY2xhcmluZyB0aGUgbG9jYWwuXG4gKiAtIHZhbHVlIGBkZWNsYXJlYCBpcyB0cnVlIGlmIHRoaXMgdmFsdWUgbmVlZHMgdG8gYmUgZGVjbGFyZWQuXG4gKiAtIHZhbHVlIGBsb2NhbFJlZmAgaXMgdHJ1ZSBpZiB3ZSBhcmUgc3RvcmluZyBhIGxvY2FsIHJlZmVyZW5jZVxuICogLSB2YWx1ZSBgcHJpb3JpdHlgIGRpY3RhdGVzIHRoZSBzb3J0aW5nIHByaW9yaXR5IG9mIHRoaXMgdmFyIGRlY2xhcmF0aW9uIGNvbXBhcmVkXG4gKiB0byBvdGhlciB2YXIgZGVjbGFyYXRpb25zIG9uIHRoZSBzYW1lIHJldHJpZXZhbCBsZXZlbC4gRm9yIGV4YW1wbGUsIGlmIHRoZXJlIGlzIGFcbiAqIGNvbnRleHQgdmFyaWFibGUgYW5kIGEgbG9jYWwgcmVmIGFjY2Vzc2luZyB0aGUgc2FtZSBwYXJlbnQgdmlldywgdGhlIGNvbnRleHQgdmFyXG4gKiBkZWNsYXJhdGlvbiBzaG91bGQgYWx3YXlzIGNvbWUgYmVmb3JlIHRoZSBsb2NhbCByZWYgZGVjbGFyYXRpb24uXG4gKi9cbnR5cGUgQmluZGluZ0RhdGEgPSB7XG4gIHJldHJpZXZhbExldmVsOiBudW1iZXI7IGxoczogby5SZWFkVmFyRXhwcjsgZGVjbGFyZUxvY2FsQ2FsbGJhY2s/OiBEZWNsYXJlTG9jYWxWYXJDYWxsYmFjaztcbiAgZGVjbGFyZTogYm9vbGVhbjtcbiAgcHJpb3JpdHk6IG51bWJlcjtcbiAgbG9jYWxSZWY6IGJvb2xlYW47XG59O1xuXG4vKipcbiAqIFRoZSBzb3J0aW5nIHByaW9yaXR5IG9mIGEgbG9jYWwgdmFyaWFibGUgZGVjbGFyYXRpb24uIEhpZ2hlciBudW1iZXJzXG4gKiBtZWFuIHRoZSBkZWNsYXJhdGlvbiB3aWxsIGFwcGVhciBmaXJzdCBpbiB0aGUgZ2VuZXJhdGVkIGNvZGUuXG4gKi9cbmNvbnN0IGVudW0gRGVjbGFyYXRpb25Qcmlvcml0eSB7IERFRkFVTFQgPSAwLCBDT05URVhUID0gMSwgU0hBUkVEX0NPTlRFWFQgPSAyIH1cblxuZXhwb3J0IGNsYXNzIEJpbmRpbmdTY29wZSBpbXBsZW1lbnRzIExvY2FsUmVzb2x2ZXIge1xuICAvKiogS2VlcHMgYSBtYXAgZnJvbSBsb2NhbCB2YXJpYWJsZXMgdG8gdGhlaXIgQmluZGluZ0RhdGEuICovXG4gIHByaXZhdGUgbWFwID0gbmV3IE1hcDxzdHJpbmcsIEJpbmRpbmdEYXRhPigpO1xuICBwcml2YXRlIHJlZmVyZW5jZU5hbWVJbmRleCA9IDA7XG4gIHByaXZhdGUgcmVzdG9yZVZpZXdWYXJpYWJsZTogby5SZWFkVmFyRXhwcnxudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBzdGF0aWMgX1JPT1RfU0NPUEU6IEJpbmRpbmdTY29wZTtcblxuICBzdGF0aWMgZ2V0IFJPT1RfU0NPUEUoKTogQmluZGluZ1Njb3BlIHtcbiAgICBpZiAoIUJpbmRpbmdTY29wZS5fUk9PVF9TQ09QRSkge1xuICAgICAgQmluZGluZ1Njb3BlLl9ST09UX1NDT1BFID0gbmV3IEJpbmRpbmdTY29wZSgpLnNldCgwLCAnJGV2ZW50Jywgby52YXJpYWJsZSgnJGV2ZW50JykpO1xuICAgIH1cbiAgICByZXR1cm4gQmluZGluZ1Njb3BlLl9ST09UX1NDT1BFO1xuICB9XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihwdWJsaWMgYmluZGluZ0xldmVsOiBudW1iZXIgPSAwLCBwcml2YXRlIHBhcmVudDogQmluZGluZ1Njb3BlfG51bGwgPSBudWxsKSB7fVxuXG4gIGdldChuYW1lOiBzdHJpbmcpOiBvLkV4cHJlc3Npb258bnVsbCB7XG4gICAgbGV0IGN1cnJlbnQ6IEJpbmRpbmdTY29wZXxudWxsID0gdGhpcztcbiAgICB3aGlsZSAoY3VycmVudCkge1xuICAgICAgbGV0IHZhbHVlID0gY3VycmVudC5tYXAuZ2V0KG5hbWUpO1xuICAgICAgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgaWYgKGN1cnJlbnQgIT09IHRoaXMpIHtcbiAgICAgICAgICAvLyBtYWtlIGEgbG9jYWwgY29weSBhbmQgcmVzZXQgdGhlIGBkZWNsYXJlYCBzdGF0ZVxuICAgICAgICAgIHZhbHVlID0ge1xuICAgICAgICAgICAgcmV0cmlldmFsTGV2ZWw6IHZhbHVlLnJldHJpZXZhbExldmVsLFxuICAgICAgICAgICAgbGhzOiB2YWx1ZS5saHMsXG4gICAgICAgICAgICBkZWNsYXJlTG9jYWxDYWxsYmFjazogdmFsdWUuZGVjbGFyZUxvY2FsQ2FsbGJhY2ssXG4gICAgICAgICAgICBkZWNsYXJlOiBmYWxzZSxcbiAgICAgICAgICAgIHByaW9yaXR5OiB2YWx1ZS5wcmlvcml0eSxcbiAgICAgICAgICAgIGxvY2FsUmVmOiB2YWx1ZS5sb2NhbFJlZlxuICAgICAgICAgIH07XG5cbiAgICAgICAgICAvLyBDYWNoZSB0aGUgdmFsdWUgbG9jYWxseS5cbiAgICAgICAgICB0aGlzLm1hcC5zZXQobmFtZSwgdmFsdWUpO1xuICAgICAgICAgIC8vIFBvc3NpYmx5IGdlbmVyYXRlIGEgc2hhcmVkIGNvbnRleHQgdmFyXG4gICAgICAgICAgdGhpcy5tYXliZUdlbmVyYXRlU2hhcmVkQ29udGV4dFZhcih2YWx1ZSk7XG4gICAgICAgICAgdGhpcy5tYXliZVJlc3RvcmVWaWV3KHZhbHVlLnJldHJpZXZhbExldmVsLCB2YWx1ZS5sb2NhbFJlZik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFsdWUuZGVjbGFyZUxvY2FsQ2FsbGJhY2sgJiYgIXZhbHVlLmRlY2xhcmUpIHtcbiAgICAgICAgICB2YWx1ZS5kZWNsYXJlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWUubGhzO1xuICAgICAgfVxuICAgICAgY3VycmVudCA9IGN1cnJlbnQucGFyZW50O1xuICAgIH1cblxuICAgIC8vIElmIHdlIGdldCB0byB0aGlzIHBvaW50LCB3ZSBhcmUgbG9va2luZyBmb3IgYSBwcm9wZXJ0eSBvbiB0aGUgdG9wIGxldmVsIGNvbXBvbmVudFxuICAgIC8vIC0gSWYgbGV2ZWwgPT09IDAsIHdlIGFyZSBvbiB0aGUgdG9wIGFuZCBkb24ndCBuZWVkIHRvIHJlLWRlY2xhcmUgYGN0eGAuXG4gICAgLy8gLSBJZiBsZXZlbCA+IDAsIHdlIGFyZSBpbiBhbiBlbWJlZGRlZCB2aWV3LiBXZSBuZWVkIHRvIHJldHJpZXZlIHRoZSBuYW1lIG9mIHRoZVxuICAgIC8vIGxvY2FsIHZhciB3ZSB1c2VkIHRvIHN0b3JlIHRoZSBjb21wb25lbnQgY29udGV4dCwgZS5nLiBjb25zdCAkY29tcCQgPSB4KCk7XG4gICAgcmV0dXJuIHRoaXMuYmluZGluZ0xldmVsID09PSAwID8gbnVsbCA6IHRoaXMuZ2V0Q29tcG9uZW50UHJvcGVydHkobmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgbG9jYWwgdmFyaWFibGUgZm9yIGxhdGVyIHJlZmVyZW5jZS5cbiAgICpcbiAgICogQHBhcmFtIHJldHJpZXZhbExldmVsIFRoZSBsZXZlbCBmcm9tIHdoaWNoIHRoaXMgdmFsdWUgY2FuIGJlIHJldHJpZXZlZFxuICAgKiBAcGFyYW0gbmFtZSBOYW1lIG9mIHRoZSB2YXJpYWJsZS5cbiAgICogQHBhcmFtIGxocyBBU1QgcmVwcmVzZW50aW5nIHRoZSBsZWZ0IGhhbmQgc2lkZSBvZiB0aGUgYGxldCBsaHMgPSByaHM7YC5cbiAgICogQHBhcmFtIHByaW9yaXR5IFRoZSBzb3J0aW5nIHByaW9yaXR5IG9mIHRoaXMgdmFyXG4gICAqIEBwYXJhbSBkZWNsYXJlTG9jYWxDYWxsYmFjayBUaGUgY2FsbGJhY2sgdG8gaW52b2tlIHdoZW4gZGVjbGFyaW5nIHRoaXMgbG9jYWwgdmFyXG4gICAqIEBwYXJhbSBsb2NhbFJlZiBXaGV0aGVyIG9yIG5vdCB0aGlzIGlzIGEgbG9jYWwgcmVmXG4gICAqL1xuICBzZXQocmV0cmlldmFsTGV2ZWw6IG51bWJlciwgbmFtZTogc3RyaW5nLCBsaHM6IG8uUmVhZFZhckV4cHIsXG4gICAgICBwcmlvcml0eTogbnVtYmVyID0gRGVjbGFyYXRpb25Qcmlvcml0eS5ERUZBVUxULFxuICAgICAgZGVjbGFyZUxvY2FsQ2FsbGJhY2s/OiBEZWNsYXJlTG9jYWxWYXJDYWxsYmFjaywgbG9jYWxSZWY/OiB0cnVlKTogQmluZGluZ1Njb3BlIHtcbiAgICBpZiAodGhpcy5tYXAuaGFzKG5hbWUpKSB7XG4gICAgICBpZiAobG9jYWxSZWYpIHtcbiAgICAgICAgLy8gRG8gbm90IHRocm93IGFuIGVycm9yIGlmIGl0J3MgYSBsb2NhbCByZWYgYW5kIGRvIG5vdCB1cGRhdGUgZXhpc3RpbmcgdmFsdWUsXG4gICAgICAgIC8vIHNvIHRoZSBmaXJzdCBkZWZpbmVkIHJlZiBpcyBhbHdheXMgcmV0dXJuZWQuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgZXJyb3IoYFRoZSBuYW1lICR7bmFtZX0gaXMgYWxyZWFkeSBkZWZpbmVkIGluIHNjb3BlIHRvIGJlICR7dGhpcy5tYXAuZ2V0KG5hbWUpfWApO1xuICAgIH1cbiAgICB0aGlzLm1hcC5zZXQobmFtZSwge1xuICAgICAgcmV0cmlldmFsTGV2ZWw6IHJldHJpZXZhbExldmVsLFxuICAgICAgbGhzOiBsaHMsXG4gICAgICBkZWNsYXJlOiBmYWxzZSxcbiAgICAgIGRlY2xhcmVMb2NhbENhbGxiYWNrOiBkZWNsYXJlTG9jYWxDYWxsYmFjayxcbiAgICAgIHByaW9yaXR5OiBwcmlvcml0eSxcbiAgICAgIGxvY2FsUmVmOiBsb2NhbFJlZiB8fCBmYWxzZVxuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBMb2NhbFJlc29sdmVyLlxuICBnZXRMb2NhbChuYW1lOiBzdHJpbmcpOiAoby5FeHByZXNzaW9ufG51bGwpIHsgcmV0dXJuIHRoaXMuZ2V0KG5hbWUpOyB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBMb2NhbFJlc29sdmVyLlxuICBub3RpZnlJbXBsaWNpdFJlY2VpdmVyVXNlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmJpbmRpbmdMZXZlbCAhPT0gMCkge1xuICAgICAgLy8gU2luY2UgdGhlIGltcGxpY2l0IHJlY2VpdmVyIGlzIGFjY2Vzc2VkIGluIGFuIGVtYmVkZGVkIHZpZXcsIHdlIG5lZWQgdG9cbiAgICAgIC8vIGVuc3VyZSB0aGF0IHdlIGRlY2xhcmUgYSBzaGFyZWQgY29udGV4dCB2YXJpYWJsZSBmb3IgdGhlIGN1cnJlbnQgdGVtcGxhdGVcbiAgICAgIC8vIGluIHRoZSB1cGRhdGUgdmFyaWFibGVzLlxuICAgICAgdGhpcy5tYXAuZ2V0KFNIQVJFRF9DT05URVhUX0tFWSArIDApICEuZGVjbGFyZSA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgbmVzdGVkU2NvcGUobGV2ZWw6IG51bWJlcik6IEJpbmRpbmdTY29wZSB7XG4gICAgY29uc3QgbmV3U2NvcGUgPSBuZXcgQmluZGluZ1Njb3BlKGxldmVsLCB0aGlzKTtcbiAgICBpZiAobGV2ZWwgPiAwKSBuZXdTY29wZS5nZW5lcmF0ZVNoYXJlZENvbnRleHRWYXIoMCk7XG4gICAgcmV0dXJuIG5ld1Njb3BlO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgb3IgY3JlYXRlcyBhIHNoYXJlZCBjb250ZXh0IHZhcmlhYmxlIGFuZCByZXR1cm5zIGl0cyBleHByZXNzaW9uLiBOb3RlIHRoYXRcbiAgICogdGhpcyBkb2VzIG5vdCBtZWFuIHRoYXQgdGhlIHNoYXJlZCB2YXJpYWJsZSB3aWxsIGJlIGRlY2xhcmVkLiBWYXJpYWJsZXMgaW4gdGhlXG4gICAqIGJpbmRpbmcgc2NvcGUgd2lsbCBiZSBvbmx5IGRlY2xhcmVkIGlmIHRoZXkgYXJlIHVzZWQuXG4gICAqL1xuICBnZXRPckNyZWF0ZVNoYXJlZENvbnRleHRWYXIocmV0cmlldmFsTGV2ZWw6IG51bWJlcik6IG8uUmVhZFZhckV4cHIge1xuICAgIGNvbnN0IGJpbmRpbmdLZXkgPSBTSEFSRURfQ09OVEVYVF9LRVkgKyByZXRyaWV2YWxMZXZlbDtcbiAgICBpZiAoIXRoaXMubWFwLmhhcyhiaW5kaW5nS2V5KSkge1xuICAgICAgdGhpcy5nZW5lcmF0ZVNoYXJlZENvbnRleHRWYXIocmV0cmlldmFsTGV2ZWwpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5tYXAuZ2V0KGJpbmRpbmdLZXkpICEubGhzO1xuICB9XG5cbiAgZ2V0U2hhcmVkQ29udGV4dE5hbWUocmV0cmlldmFsTGV2ZWw6IG51bWJlcik6IG8uUmVhZFZhckV4cHJ8bnVsbCB7XG4gICAgY29uc3Qgc2hhcmVkQ3R4T2JqID0gdGhpcy5tYXAuZ2V0KFNIQVJFRF9DT05URVhUX0tFWSArIHJldHJpZXZhbExldmVsKTtcbiAgICByZXR1cm4gc2hhcmVkQ3R4T2JqICYmIHNoYXJlZEN0eE9iai5kZWNsYXJlID8gc2hhcmVkQ3R4T2JqLmxocyA6IG51bGw7XG4gIH1cblxuICBtYXliZUdlbmVyYXRlU2hhcmVkQ29udGV4dFZhcih2YWx1ZTogQmluZGluZ0RhdGEpIHtcbiAgICBpZiAodmFsdWUucHJpb3JpdHkgPT09IERlY2xhcmF0aW9uUHJpb3JpdHkuQ09OVEVYVCAmJlxuICAgICAgICB2YWx1ZS5yZXRyaWV2YWxMZXZlbCA8IHRoaXMuYmluZGluZ0xldmVsKSB7XG4gICAgICBjb25zdCBzaGFyZWRDdHhPYmogPSB0aGlzLm1hcC5nZXQoU0hBUkVEX0NPTlRFWFRfS0VZICsgdmFsdWUucmV0cmlldmFsTGV2ZWwpO1xuICAgICAgaWYgKHNoYXJlZEN0eE9iaikge1xuICAgICAgICBzaGFyZWRDdHhPYmouZGVjbGFyZSA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmdlbmVyYXRlU2hhcmVkQ29udGV4dFZhcih2YWx1ZS5yZXRyaWV2YWxMZXZlbCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2VuZXJhdGVTaGFyZWRDb250ZXh0VmFyKHJldHJpZXZhbExldmVsOiBudW1iZXIpIHtcbiAgICBjb25zdCBsaHMgPSBvLnZhcmlhYmxlKENPTlRFWFRfTkFNRSArIHRoaXMuZnJlc2hSZWZlcmVuY2VOYW1lKCkpO1xuICAgIHRoaXMubWFwLnNldChTSEFSRURfQ09OVEVYVF9LRVkgKyByZXRyaWV2YWxMZXZlbCwge1xuICAgICAgcmV0cmlldmFsTGV2ZWw6IHJldHJpZXZhbExldmVsLFxuICAgICAgbGhzOiBsaHMsXG4gICAgICBkZWNsYXJlTG9jYWxDYWxsYmFjazogKHNjb3BlOiBCaW5kaW5nU2NvcGUsIHJlbGF0aXZlTGV2ZWw6IG51bWJlcikgPT4ge1xuICAgICAgICAvLyBjb25zdCBjdHhfcjAgPSBuZXh0Q29udGV4dCgyKTtcbiAgICAgICAgcmV0dXJuIFtsaHMuc2V0KGdlbmVyYXRlTmV4dENvbnRleHRFeHByKHJlbGF0aXZlTGV2ZWwpKS50b0NvbnN0RGVjbCgpXTtcbiAgICAgIH0sXG4gICAgICBkZWNsYXJlOiBmYWxzZSxcbiAgICAgIHByaW9yaXR5OiBEZWNsYXJhdGlvblByaW9yaXR5LlNIQVJFRF9DT05URVhULFxuICAgICAgbG9jYWxSZWY6IGZhbHNlXG4gICAgfSk7XG4gIH1cblxuICBnZXRDb21wb25lbnRQcm9wZXJ0eShuYW1lOiBzdHJpbmcpOiBvLkV4cHJlc3Npb24ge1xuICAgIGNvbnN0IGNvbXBvbmVudFZhbHVlID0gdGhpcy5tYXAuZ2V0KFNIQVJFRF9DT05URVhUX0tFWSArIDApICE7XG4gICAgY29tcG9uZW50VmFsdWUuZGVjbGFyZSA9IHRydWU7XG4gICAgdGhpcy5tYXliZVJlc3RvcmVWaWV3KDAsIGZhbHNlKTtcbiAgICByZXR1cm4gY29tcG9uZW50VmFsdWUubGhzLnByb3AobmFtZSk7XG4gIH1cblxuICBtYXliZVJlc3RvcmVWaWV3KHJldHJpZXZhbExldmVsOiBudW1iZXIsIGxvY2FsUmVmTG9va3VwOiBib29sZWFuKSB7XG4gICAgLy8gV2Ugd2FudCB0byByZXN0b3JlIHRoZSBjdXJyZW50IHZpZXcgaW4gbGlzdGVuZXIgZm5zIGlmOlxuICAgIC8vIDEgLSB3ZSBhcmUgYWNjZXNzaW5nIGEgdmFsdWUgaW4gYSBwYXJlbnQgdmlldywgd2hpY2ggcmVxdWlyZXMgd2Fsa2luZyB0aGUgdmlldyB0cmVlIHJhdGhlclxuICAgIC8vIHRoYW4gdXNpbmcgdGhlIGN0eCBhcmcuIEluIHRoaXMgY2FzZSwgdGhlIHJldHJpZXZhbCBhbmQgYmluZGluZyBsZXZlbCB3aWxsIGJlIGRpZmZlcmVudC5cbiAgICAvLyAyIC0gd2UgYXJlIGxvb2tpbmcgdXAgYSBsb2NhbCByZWYsIHdoaWNoIHJlcXVpcmVzIHJlc3RvcmluZyB0aGUgdmlldyB3aGVyZSB0aGUgbG9jYWxcbiAgICAvLyByZWYgaXMgc3RvcmVkXG4gICAgaWYgKHRoaXMuaXNMaXN0ZW5lclNjb3BlKCkgJiYgKHJldHJpZXZhbExldmVsIDwgdGhpcy5iaW5kaW5nTGV2ZWwgfHwgbG9jYWxSZWZMb29rdXApKSB7XG4gICAgICBpZiAoIXRoaXMucGFyZW50ICEucmVzdG9yZVZpZXdWYXJpYWJsZSkge1xuICAgICAgICAvLyBwYXJlbnQgc2F2ZXMgdmFyaWFibGUgdG8gZ2VuZXJhdGUgYSBzaGFyZWQgYGNvbnN0ICRzJCA9IGdldEN1cnJlbnRWaWV3KCk7YCBpbnN0cnVjdGlvblxuICAgICAgICB0aGlzLnBhcmVudCAhLnJlc3RvcmVWaWV3VmFyaWFibGUgPSBvLnZhcmlhYmxlKHRoaXMucGFyZW50ICEuZnJlc2hSZWZlcmVuY2VOYW1lKCkpO1xuICAgICAgfVxuICAgICAgdGhpcy5yZXN0b3JlVmlld1ZhcmlhYmxlID0gdGhpcy5wYXJlbnQgIS5yZXN0b3JlVmlld1ZhcmlhYmxlO1xuICAgIH1cbiAgfVxuXG4gIHJlc3RvcmVWaWV3U3RhdGVtZW50KCk6IG8uU3RhdGVtZW50W10ge1xuICAgIC8vIHJlc3RvcmVWaWV3KCRzdGF0ZSQpO1xuICAgIHJldHVybiB0aGlzLnJlc3RvcmVWaWV3VmFyaWFibGUgP1xuICAgICAgICBbaW5zdHJ1Y3Rpb24obnVsbCwgUjMucmVzdG9yZVZpZXcsIFt0aGlzLnJlc3RvcmVWaWV3VmFyaWFibGVdKS50b1N0bXQoKV0gOlxuICAgICAgICBbXTtcbiAgfVxuXG4gIHZpZXdTbmFwc2hvdFN0YXRlbWVudHMoKTogby5TdGF0ZW1lbnRbXSB7XG4gICAgLy8gY29uc3QgJHN0YXRlJCA9IGdldEN1cnJlbnRWaWV3KCk7XG4gICAgY29uc3QgZ2V0Q3VycmVudFZpZXdJbnN0cnVjdGlvbiA9IGluc3RydWN0aW9uKG51bGwsIFIzLmdldEN1cnJlbnRWaWV3LCBbXSk7XG4gICAgcmV0dXJuIHRoaXMucmVzdG9yZVZpZXdWYXJpYWJsZSA/XG4gICAgICAgIFt0aGlzLnJlc3RvcmVWaWV3VmFyaWFibGUuc2V0KGdldEN1cnJlbnRWaWV3SW5zdHJ1Y3Rpb24pLnRvQ29uc3REZWNsKCldIDpcbiAgICAgICAgW107XG4gIH1cblxuICBpc0xpc3RlbmVyU2NvcGUoKSB7IHJldHVybiB0aGlzLnBhcmVudCAmJiB0aGlzLnBhcmVudC5iaW5kaW5nTGV2ZWwgPT09IHRoaXMuYmluZGluZ0xldmVsOyB9XG5cbiAgdmFyaWFibGVEZWNsYXJhdGlvbnMoKTogby5TdGF0ZW1lbnRbXSB7XG4gICAgbGV0IGN1cnJlbnRDb250ZXh0TGV2ZWwgPSAwO1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMubWFwLnZhbHVlcygpKVxuICAgICAgICAuZmlsdGVyKHZhbHVlID0+IHZhbHVlLmRlY2xhcmUpXG4gICAgICAgIC5zb3J0KChhLCBiKSA9PiBiLnJldHJpZXZhbExldmVsIC0gYS5yZXRyaWV2YWxMZXZlbCB8fCBiLnByaW9yaXR5IC0gYS5wcmlvcml0eSlcbiAgICAgICAgLnJlZHVjZSgoc3RtdHM6IG8uU3RhdGVtZW50W10sIHZhbHVlOiBCaW5kaW5nRGF0YSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGxldmVsRGlmZiA9IHRoaXMuYmluZGluZ0xldmVsIC0gdmFsdWUucmV0cmlldmFsTGV2ZWw7XG4gICAgICAgICAgY29uc3QgY3VyclN0bXRzID0gdmFsdWUuZGVjbGFyZUxvY2FsQ2FsbGJhY2sgISh0aGlzLCBsZXZlbERpZmYgLSBjdXJyZW50Q29udGV4dExldmVsKTtcbiAgICAgICAgICBjdXJyZW50Q29udGV4dExldmVsID0gbGV2ZWxEaWZmO1xuICAgICAgICAgIHJldHVybiBzdG10cy5jb25jYXQoY3VyclN0bXRzKTtcbiAgICAgICAgfSwgW10pIGFzIG8uU3RhdGVtZW50W107XG4gIH1cblxuXG4gIGZyZXNoUmVmZXJlbmNlTmFtZSgpOiBzdHJpbmcge1xuICAgIGxldCBjdXJyZW50OiBCaW5kaW5nU2NvcGUgPSB0aGlzO1xuICAgIC8vIEZpbmQgdGhlIHRvcCBzY29wZSBhcyBpdCBtYWludGFpbnMgdGhlIGdsb2JhbCByZWZlcmVuY2UgY291bnRcbiAgICB3aGlsZSAoY3VycmVudC5wYXJlbnQpIGN1cnJlbnQgPSBjdXJyZW50LnBhcmVudDtcbiAgICBjb25zdCByZWYgPSBgJHtSRUZFUkVOQ0VfUFJFRklYfSR7Y3VycmVudC5yZWZlcmVuY2VOYW1lSW5kZXgrK31gO1xuICAgIHJldHVybiByZWY7XG4gIH1cbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgYENzc1NlbGVjdG9yYCBnaXZlbiBhIHRhZyBuYW1lIGFuZCBhIG1hcCBvZiBhdHRyaWJ1dGVzXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUNzc1NlbGVjdG9yKHRhZzogc3RyaW5nLCBhdHRyaWJ1dGVzOiB7W25hbWU6IHN0cmluZ106IHN0cmluZ30pOiBDc3NTZWxlY3RvciB7XG4gIGNvbnN0IGNzc1NlbGVjdG9yID0gbmV3IENzc1NlbGVjdG9yKCk7XG5cbiAgY3NzU2VsZWN0b3Iuc2V0RWxlbWVudCh0YWcpO1xuXG4gIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGF0dHJpYnV0ZXMpLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICBjb25zdCB2YWx1ZSA9IGF0dHJpYnV0ZXNbbmFtZV07XG5cbiAgICBjc3NTZWxlY3Rvci5hZGRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuICAgIGlmIChuYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdjbGFzcycpIHtcbiAgICAgIGNvbnN0IGNsYXNzZXMgPSB2YWx1ZS50cmltKCkuc3BsaXQoL1xccysvKTtcbiAgICAgIGNsYXNzZXMuZm9yRWFjaChjbGFzc05hbWUgPT4gY3NzU2VsZWN0b3IuYWRkQ2xhc3NOYW1lKGNsYXNzTmFtZSkpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGNzc1NlbGVjdG9yO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgZXhwcmVzc2lvbnMgb3V0IG9mIGFuIGBuZ1Byb2plY3RBc2AgYXR0cmlidXRlc1xuICogd2hpY2ggY2FuIGJlIGFkZGVkIHRvIHRoZSBpbnN0cnVjdGlvbiBwYXJhbWV0ZXJzLlxuICovXG5mdW5jdGlvbiBnZXROZ1Byb2plY3RBc0xpdGVyYWwoYXR0cmlidXRlOiB0LlRleHRBdHRyaWJ1dGUpOiBvLkV4cHJlc3Npb25bXSB7XG4gIC8vIFBhcnNlIHRoZSBhdHRyaWJ1dGUgdmFsdWUgaW50byBhIENzc1NlbGVjdG9yTGlzdC4gTm90ZSB0aGF0IHdlIG9ubHkgdGFrZSB0aGVcbiAgLy8gZmlyc3Qgc2VsZWN0b3IsIGJlY2F1c2Ugd2UgZG9uJ3Qgc3VwcG9ydCBtdWx0aXBsZSBzZWxlY3RvcnMgaW4gbmdQcm9qZWN0QXMuXG4gIGNvbnN0IHBhcnNlZFIzU2VsZWN0b3IgPSBjb3JlLnBhcnNlU2VsZWN0b3JUb1IzU2VsZWN0b3IoYXR0cmlidXRlLnZhbHVlKVswXTtcbiAgcmV0dXJuIFtvLmxpdGVyYWwoY29yZS5BdHRyaWJ1dGVNYXJrZXIuUHJvamVjdEFzKSwgYXNMaXRlcmFsKHBhcnNlZFIzU2VsZWN0b3IpXTtcbn1cblxuZnVuY3Rpb24gaW50ZXJwb2xhdGUoYXJnczogby5FeHByZXNzaW9uW10pOiBvLkV4cHJlc3Npb24ge1xuICBhcmdzID0gYXJncy5zbGljZSgxKTsgIC8vIElnbm9yZSB0aGUgbGVuZ3RoIHByZWZpeCBhZGRlZCBmb3IgcmVuZGVyMlxuICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgY2FzZSAzOlxuICAgICAgcmV0dXJuIG8uaW1wb3J0RXhwcihSMy5pbnRlcnBvbGF0aW9uMSkuY2FsbEZuKGFyZ3MpO1xuICAgIGNhc2UgNTpcbiAgICAgIHJldHVybiBvLmltcG9ydEV4cHIoUjMuaW50ZXJwb2xhdGlvbjIpLmNhbGxGbihhcmdzKTtcbiAgICBjYXNlIDc6XG4gICAgICByZXR1cm4gby5pbXBvcnRFeHByKFIzLmludGVycG9sYXRpb24zKS5jYWxsRm4oYXJncyk7XG4gICAgY2FzZSA5OlxuICAgICAgcmV0dXJuIG8uaW1wb3J0RXhwcihSMy5pbnRlcnBvbGF0aW9uNCkuY2FsbEZuKGFyZ3MpO1xuICAgIGNhc2UgMTE6XG4gICAgICByZXR1cm4gby5pbXBvcnRFeHByKFIzLmludGVycG9sYXRpb241KS5jYWxsRm4oYXJncyk7XG4gICAgY2FzZSAxMzpcbiAgICAgIHJldHVybiBvLmltcG9ydEV4cHIoUjMuaW50ZXJwb2xhdGlvbjYpLmNhbGxGbihhcmdzKTtcbiAgICBjYXNlIDE1OlxuICAgICAgcmV0dXJuIG8uaW1wb3J0RXhwcihSMy5pbnRlcnBvbGF0aW9uNykuY2FsbEZuKGFyZ3MpO1xuICAgIGNhc2UgMTc6XG4gICAgICByZXR1cm4gby5pbXBvcnRFeHByKFIzLmludGVycG9sYXRpb244KS5jYWxsRm4oYXJncyk7XG4gIH1cbiAgKGFyZ3MubGVuZ3RoID49IDE5ICYmIGFyZ3MubGVuZ3RoICUgMiA9PSAxKSB8fFxuICAgICAgZXJyb3IoYEludmFsaWQgaW50ZXJwb2xhdGlvbiBhcmd1bWVudCBsZW5ndGggJHthcmdzLmxlbmd0aH1gKTtcbiAgcmV0dXJuIG8uaW1wb3J0RXhwcihSMy5pbnRlcnBvbGF0aW9uVikuY2FsbEZuKFtvLmxpdGVyYWxBcnIoYXJncyldKTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBpbnN0cnVjdGlvbiB0byBnZW5lcmF0ZSBmb3IgYW4gaW50ZXJwb2xhdGVkIHByb3BlcnR5XG4gKiBAcGFyYW0gaW50ZXJwb2xhdGlvbiBBbiBJbnRlcnBvbGF0aW9uIEFTVFxuICovXG5mdW5jdGlvbiBnZXRQcm9wZXJ0eUludGVycG9sYXRpb25FeHByZXNzaW9uKGludGVycG9sYXRpb246IEludGVycG9sYXRpb24pIHtcbiAgc3dpdGNoIChnZXRJbnRlcnBvbGF0aW9uQXJnc0xlbmd0aChpbnRlcnBvbGF0aW9uKSkge1xuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiBSMy5wcm9wZXJ0eUludGVycG9sYXRlO1xuICAgIGNhc2UgMzpcbiAgICAgIHJldHVybiBSMy5wcm9wZXJ0eUludGVycG9sYXRlMTtcbiAgICBjYXNlIDU6XG4gICAgICByZXR1cm4gUjMucHJvcGVydHlJbnRlcnBvbGF0ZTI7XG4gICAgY2FzZSA3OlxuICAgICAgcmV0dXJuIFIzLnByb3BlcnR5SW50ZXJwb2xhdGUzO1xuICAgIGNhc2UgOTpcbiAgICAgIHJldHVybiBSMy5wcm9wZXJ0eUludGVycG9sYXRlNDtcbiAgICBjYXNlIDExOlxuICAgICAgcmV0dXJuIFIzLnByb3BlcnR5SW50ZXJwb2xhdGU1O1xuICAgIGNhc2UgMTM6XG4gICAgICByZXR1cm4gUjMucHJvcGVydHlJbnRlcnBvbGF0ZTY7XG4gICAgY2FzZSAxNTpcbiAgICAgIHJldHVybiBSMy5wcm9wZXJ0eUludGVycG9sYXRlNztcbiAgICBjYXNlIDE3OlxuICAgICAgcmV0dXJuIFIzLnByb3BlcnR5SW50ZXJwb2xhdGU4O1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gUjMucHJvcGVydHlJbnRlcnBvbGF0ZVY7XG4gIH1cbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBudW1iZXIgb2YgYXJndW1lbnRzIGV4cGVjdGVkIHRvIGJlIHBhc3NlZCB0byBhIGdlbmVyYXRlZCBpbnN0cnVjdGlvbiBpbiB0aGUgY2FzZSBvZlxuICogaW50ZXJwb2xhdGlvbiBpbnN0cnVjdGlvbnMuXG4gKiBAcGFyYW0gaW50ZXJwb2xhdGlvbiBBbiBpbnRlcnBvbGF0aW9uIGFzdFxuICovXG5mdW5jdGlvbiBnZXRJbnRlcnBvbGF0aW9uQXJnc0xlbmd0aChpbnRlcnBvbGF0aW9uOiBJbnRlcnBvbGF0aW9uKSB7XG4gIGNvbnN0IHtleHByZXNzaW9ucywgc3RyaW5nc30gPSBpbnRlcnBvbGF0aW9uO1xuICBpZiAoZXhwcmVzc2lvbnMubGVuZ3RoID09PSAxICYmIHN0cmluZ3MubGVuZ3RoID09PSAyICYmIHN0cmluZ3NbMF0gPT09ICcnICYmIHN0cmluZ3NbMV0gPT09ICcnKSB7XG4gICAgLy8gSWYgdGhlIGludGVycG9sYXRpb24gaGFzIG9uZSBpbnRlcnBvbGF0ZWQgdmFsdWUsIGJ1dCB0aGUgcHJlZml4IGFuZCBzdWZmaXggYXJlIGJvdGggZW1wdHlcbiAgICAvLyBzdHJpbmdzLCB3ZSBvbmx5IHBhc3Mgb25lIGFyZ3VtZW50LCB0byBhIHNwZWNpYWwgaW5zdHJ1Y3Rpb24gbGlrZSBgcHJvcGVydHlJbnRlcnBvbGF0ZWAgb3JcbiAgICAvLyBgdGV4dEludGVycG9sYXRlYC5cbiAgICByZXR1cm4gMTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZXhwcmVzc2lvbnMubGVuZ3RoICsgc3RyaW5ncy5sZW5ndGg7XG4gIH1cbn1cbi8qKlxuICogT3B0aW9ucyB0aGF0IGNhbiBiZSB1c2VkIHRvIG1vZGlmeSBob3cgYSB0ZW1wbGF0ZSBpcyBwYXJzZWQgYnkgYHBhcnNlVGVtcGxhdGUoKWAuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUGFyc2VUZW1wbGF0ZU9wdGlvbnMge1xuICAvKipcbiAgICogSW5jbHVkZSB3aGl0ZXNwYWNlIG5vZGVzIGluIHRoZSBwYXJzZWQgb3V0cHV0LlxuICAgKi9cbiAgcHJlc2VydmVXaGl0ZXNwYWNlcz86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBIb3cgdG8gcGFyc2UgaW50ZXJwb2xhdGlvbiBtYXJrZXJzLlxuICAgKi9cbiAgaW50ZXJwb2xhdGlvbkNvbmZpZz86IEludGVycG9sYXRpb25Db25maWc7XG4gIC8qKlxuICAgKiBUaGUgc3RhcnQgYW5kIGVuZCBwb2ludCBvZiB0aGUgdGV4dCB0byBwYXJzZSB3aXRoaW4gdGhlIGBzb3VyY2VgIHN0cmluZy5cbiAgICogVGhlIGVudGlyZSBgc291cmNlYCBzdHJpbmcgaXMgcGFyc2VkIGlmIHRoaXMgaXMgbm90IHByb3ZpZGVkLlxuICAgKiAqL1xuICByYW5nZT86IExleGVyUmFuZ2U7XG4gIC8qKlxuICAgKiBJZiB0aGlzIHRleHQgaXMgc3RvcmVkIGluIGEgSmF2YVNjcmlwdCBzdHJpbmcsIHRoZW4gd2UgaGF2ZSB0byBkZWFsIHdpdGggZXNjYXBlIHNlcXVlbmNlcy5cbiAgICpcbiAgICogKipFeGFtcGxlIDE6KipcbiAgICpcbiAgICogYGBgXG4gICAqIFwiYWJjXFxcImRlZlxcbmdoaVwiXG4gICAqIGBgYFxuICAgKlxuICAgKiAtIFRoZSBgXFxcImAgbXVzdCBiZSBjb252ZXJ0ZWQgdG8gYFwiYC5cbiAgICogLSBUaGUgYFxcbmAgbXVzdCBiZSBjb252ZXJ0ZWQgdG8gYSBuZXcgbGluZSBjaGFyYWN0ZXIgaW4gYSB0b2tlbixcbiAgICogICBidXQgaXQgc2hvdWxkIG5vdCBpbmNyZW1lbnQgdGhlIGN1cnJlbnQgbGluZSBmb3Igc291cmNlIG1hcHBpbmcuXG4gICAqXG4gICAqICoqRXhhbXBsZSAyOioqXG4gICAqXG4gICAqIGBgYFxuICAgKiBcImFiY1xcXG4gICAqICBkZWZcIlxuICAgKiBgYGBcbiAgICpcbiAgICogVGhlIGxpbmUgY29udGludWF0aW9uIChgXFxgIGZvbGxvd2VkIGJ5IGEgbmV3bGluZSkgc2hvdWxkIGJlIHJlbW92ZWQgZnJvbSBhIHRva2VuXG4gICAqIGJ1dCB0aGUgbmV3IGxpbmUgc2hvdWxkIGluY3JlbWVudCB0aGUgY3VycmVudCBsaW5lIGZvciBzb3VyY2UgbWFwcGluZy5cbiAgICovXG4gIGVzY2FwZWRTdHJpbmc/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIFBhcnNlIGEgdGVtcGxhdGUgaW50byByZW5kZXIzIGBOb2RlYHMgYW5kIGFkZGl0aW9uYWwgbWV0YWRhdGEsIHdpdGggbm8gb3RoZXIgZGVwZW5kZW5jaWVzLlxuICpcbiAqIEBwYXJhbSB0ZW1wbGF0ZSB0ZXh0IG9mIHRoZSB0ZW1wbGF0ZSB0byBwYXJzZVxuICogQHBhcmFtIHRlbXBsYXRlVXJsIFVSTCB0byB1c2UgZm9yIHNvdXJjZSBtYXBwaW5nIG9mIHRoZSBwYXJzZWQgdGVtcGxhdGVcbiAqIEBwYXJhbSBvcHRpb25zIG9wdGlvbnMgdG8gbW9kaWZ5IGhvdyB0aGUgdGVtcGxhdGUgaXMgcGFyc2VkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVRlbXBsYXRlKFxuICAgIHRlbXBsYXRlOiBzdHJpbmcsIHRlbXBsYXRlVXJsOiBzdHJpbmcsIG9wdGlvbnM6IFBhcnNlVGVtcGxhdGVPcHRpb25zID0ge30pOlxuICAgIHtlcnJvcnM/OiBQYXJzZUVycm9yW10sIG5vZGVzOiB0Lk5vZGVbXSwgc3R5bGVVcmxzOiBzdHJpbmdbXSwgc3R5bGVzOiBzdHJpbmdbXX0ge1xuICBjb25zdCB7aW50ZXJwb2xhdGlvbkNvbmZpZywgcHJlc2VydmVXaGl0ZXNwYWNlc30gPSBvcHRpb25zO1xuICBjb25zdCBiaW5kaW5nUGFyc2VyID0gbWFrZUJpbmRpbmdQYXJzZXIoaW50ZXJwb2xhdGlvbkNvbmZpZyk7XG4gIGNvbnN0IGh0bWxQYXJzZXIgPSBuZXcgSHRtbFBhcnNlcigpO1xuICBjb25zdCBwYXJzZVJlc3VsdCA9IGh0bWxQYXJzZXIucGFyc2UoXG4gICAgICB0ZW1wbGF0ZSwgdGVtcGxhdGVVcmwsXG4gICAgICB7Li4ub3B0aW9ucywgdG9rZW5pemVFeHBhbnNpb25Gb3JtczogdHJ1ZSwgbGVhZGluZ1RyaXZpYUNoYXJzOiBMRUFESU5HX1RSSVZJQV9DSEFSU30pO1xuXG4gIGlmIChwYXJzZVJlc3VsdC5lcnJvcnMgJiYgcGFyc2VSZXN1bHQuZXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4ge2Vycm9yczogcGFyc2VSZXN1bHQuZXJyb3JzLCBub2RlczogW10sIHN0eWxlVXJsczogW10sIHN0eWxlczogW119O1xuICB9XG5cbiAgbGV0IHJvb3ROb2RlczogaHRtbC5Ob2RlW10gPSBwYXJzZVJlc3VsdC5yb290Tm9kZXM7XG5cbiAgLy8gcHJvY2VzcyBpMThuIG1ldGEgaW5mb3JtYXRpb24gKHNjYW4gYXR0cmlidXRlcywgZ2VuZXJhdGUgaWRzKVxuICAvLyBiZWZvcmUgd2UgcnVuIHdoaXRlc3BhY2UgcmVtb3ZhbCBwcm9jZXNzLCBiZWNhdXNlIGV4aXN0aW5nIGkxOG5cbiAgLy8gZXh0cmFjdGlvbiBwcm9jZXNzIChuZyB4aTE4bikgcmVsaWVzIG9uIGEgcmF3IGNvbnRlbnQgdG8gZ2VuZXJhdGVcbiAgLy8gbWVzc2FnZSBpZHNcbiAgcm9vdE5vZGVzID1cbiAgICAgIGh0bWwudmlzaXRBbGwobmV3IEkxOG5NZXRhVmlzaXRvcihpbnRlcnBvbGF0aW9uQ29uZmlnLCAhcHJlc2VydmVXaGl0ZXNwYWNlcyksIHJvb3ROb2Rlcyk7XG5cbiAgaWYgKCFwcmVzZXJ2ZVdoaXRlc3BhY2VzKSB7XG4gICAgcm9vdE5vZGVzID0gaHRtbC52aXNpdEFsbChuZXcgV2hpdGVzcGFjZVZpc2l0b3IoKSwgcm9vdE5vZGVzKTtcblxuICAgIC8vIHJ1biBpMThuIG1ldGEgdmlzaXRvciBhZ2FpbiBpbiBjYXNlIHdlIHJlbW92ZSB3aGl0ZXNwYWNlcywgYmVjYXVzZVxuICAgIC8vIHRoYXQgbWlnaHQgYWZmZWN0IGdlbmVyYXRlZCBpMThuIG1lc3NhZ2UgY29udGVudC4gRHVyaW5nIHRoaXMgcGFzc1xuICAgIC8vIGkxOG4gSURzIGdlbmVyYXRlZCBhdCB0aGUgZmlyc3QgcGFzcyB3aWxsIGJlIHByZXNlcnZlZCwgc28gd2UgY2FuIG1pbWljXG4gICAgLy8gZXhpc3RpbmcgZXh0cmFjdGlvbiBwcm9jZXNzIChuZyB4aTE4bilcbiAgICByb290Tm9kZXMgPSBodG1sLnZpc2l0QWxsKFxuICAgICAgICBuZXcgSTE4bk1ldGFWaXNpdG9yKGludGVycG9sYXRpb25Db25maWcsIC8qIGtlZXBJMThuQXR0cnMgKi8gZmFsc2UpLCByb290Tm9kZXMpO1xuICB9XG5cbiAgY29uc3Qge25vZGVzLCBlcnJvcnMsIHN0eWxlVXJscywgc3R5bGVzfSA9IGh0bWxBc3RUb1JlbmRlcjNBc3Qocm9vdE5vZGVzLCBiaW5kaW5nUGFyc2VyKTtcbiAgaWYgKGVycm9ycyAmJiBlcnJvcnMubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiB7ZXJyb3JzLCBub2RlczogW10sIHN0eWxlVXJsczogW10sIHN0eWxlczogW119O1xuICB9XG5cbiAgcmV0dXJuIHtub2Rlcywgc3R5bGVVcmxzLCBzdHlsZXN9O1xufVxuXG4vKipcbiAqIENvbnN0cnVjdCBhIGBCaW5kaW5nUGFyc2VyYCB3aXRoIGEgZGVmYXVsdCBjb25maWd1cmF0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWFrZUJpbmRpbmdQYXJzZXIoXG4gICAgaW50ZXJwb2xhdGlvbkNvbmZpZzogSW50ZXJwb2xhdGlvbkNvbmZpZyA9IERFRkFVTFRfSU5URVJQT0xBVElPTl9DT05GSUcpOiBCaW5kaW5nUGFyc2VyIHtcbiAgcmV0dXJuIG5ldyBCaW5kaW5nUGFyc2VyKFxuICAgICAgbmV3IFBhcnNlcihuZXcgTGV4ZXIoKSksIGludGVycG9sYXRpb25Db25maWcsIG5ldyBEb21FbGVtZW50U2NoZW1hUmVnaXN0cnkoKSwgbnVsbCwgW10pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZVNhbml0aXphdGlvbkZuKGNvbnRleHQ6IGNvcmUuU2VjdXJpdHlDb250ZXh0LCBpc0F0dHJpYnV0ZT86IGJvb2xlYW4pIHtcbiAgc3dpdGNoIChjb250ZXh0KSB7XG4gICAgY2FzZSBjb3JlLlNlY3VyaXR5Q29udGV4dC5IVE1MOlxuICAgICAgcmV0dXJuIG8uaW1wb3J0RXhwcihSMy5zYW5pdGl6ZUh0bWwpO1xuICAgIGNhc2UgY29yZS5TZWN1cml0eUNvbnRleHQuU0NSSVBUOlxuICAgICAgcmV0dXJuIG8uaW1wb3J0RXhwcihSMy5zYW5pdGl6ZVNjcmlwdCk7XG4gICAgY2FzZSBjb3JlLlNlY3VyaXR5Q29udGV4dC5TVFlMRTpcbiAgICAgIC8vIHRoZSBjb21waWxlciBkb2VzIG5vdCBmaWxsIGluIGFuIGluc3RydWN0aW9uIGZvciBbc3R5bGUucHJvcD9dIGJpbmRpbmdcbiAgICAgIC8vIHZhbHVlcyBiZWNhdXNlIHRoZSBzdHlsZSBhbGdvcml0aG0ga25vd3MgaW50ZXJuYWxseSB3aGF0IHByb3BzIGFyZSBzdWJqZWN0XG4gICAgICAvLyB0byBzYW5pdGl6YXRpb24gKG9ubHkgW2F0dHIuc3R5bGVdIHZhbHVlcyBhcmUgZXhwbGljaXRseSBzYW5pdGl6ZWQpXG4gICAgICByZXR1cm4gaXNBdHRyaWJ1dGUgPyBvLmltcG9ydEV4cHIoUjMuc2FuaXRpemVTdHlsZSkgOiBudWxsO1xuICAgIGNhc2UgY29yZS5TZWN1cml0eUNvbnRleHQuVVJMOlxuICAgICAgcmV0dXJuIG8uaW1wb3J0RXhwcihSMy5zYW5pdGl6ZVVybCk7XG4gICAgY2FzZSBjb3JlLlNlY3VyaXR5Q29udGV4dC5SRVNPVVJDRV9VUkw6XG4gICAgICByZXR1cm4gby5pbXBvcnRFeHByKFIzLnNhbml0aXplUmVzb3VyY2VVcmwpO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc1NpbmdsZUVsZW1lbnRUZW1wbGF0ZShjaGlsZHJlbjogdC5Ob2RlW10pOiBjaGlsZHJlbiBpc1t0LkVsZW1lbnRdIHtcbiAgcmV0dXJuIGNoaWxkcmVuLmxlbmd0aCA9PT0gMSAmJiBjaGlsZHJlblswXSBpbnN0YW5jZW9mIHQuRWxlbWVudDtcbn1cblxuZnVuY3Rpb24gaXNUZXh0Tm9kZShub2RlOiB0Lk5vZGUpOiBib29sZWFuIHtcbiAgcmV0dXJuIG5vZGUgaW5zdGFuY2VvZiB0LlRleHQgfHwgbm9kZSBpbnN0YW5jZW9mIHQuQm91bmRUZXh0IHx8IG5vZGUgaW5zdGFuY2VvZiB0LkljdTtcbn1cblxuZnVuY3Rpb24gaGFzVGV4dENoaWxkcmVuT25seShjaGlsZHJlbjogdC5Ob2RlW10pOiBib29sZWFuIHtcbiAgcmV0dXJuIGNoaWxkcmVuLmV2ZXJ5KGlzVGV4dE5vZGUpO1xufVxuIl19