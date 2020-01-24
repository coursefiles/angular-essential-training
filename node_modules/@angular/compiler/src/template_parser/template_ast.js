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
        define("@angular/compiler/src/template_parser/template_ast", ["require", "exports", "tslib"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var _a;
    /**
     * A segment of text within the template.
     */
    var TextAst = /** @class */ (function () {
        function TextAst(value, ngContentIndex, sourceSpan) {
            this.value = value;
            this.ngContentIndex = ngContentIndex;
            this.sourceSpan = sourceSpan;
        }
        TextAst.prototype.visit = function (visitor, context) { return visitor.visitText(this, context); };
        return TextAst;
    }());
    exports.TextAst = TextAst;
    /**
     * A bound expression within the text of a template.
     */
    var BoundTextAst = /** @class */ (function () {
        function BoundTextAst(value, ngContentIndex, sourceSpan) {
            this.value = value;
            this.ngContentIndex = ngContentIndex;
            this.sourceSpan = sourceSpan;
        }
        BoundTextAst.prototype.visit = function (visitor, context) {
            return visitor.visitBoundText(this, context);
        };
        return BoundTextAst;
    }());
    exports.BoundTextAst = BoundTextAst;
    /**
     * A plain attribute on an element.
     */
    var AttrAst = /** @class */ (function () {
        function AttrAst(name, value, sourceSpan) {
            this.name = name;
            this.value = value;
            this.sourceSpan = sourceSpan;
        }
        AttrAst.prototype.visit = function (visitor, context) { return visitor.visitAttr(this, context); };
        return AttrAst;
    }());
    exports.AttrAst = AttrAst;
    var BoundPropertyMapping = (_a = {},
        _a[4 /* Animation */] = 4 /* Animation */,
        _a[1 /* Attribute */] = 1 /* Attribute */,
        _a[2 /* Class */] = 2 /* Class */,
        _a[0 /* Property */] = 0 /* Property */,
        _a[3 /* Style */] = 3 /* Style */,
        _a);
    /**
     * A binding for an element property (e.g. `[property]="expression"`) or an animation trigger (e.g.
     * `[@trigger]="stateExp"`)
     */
    var BoundElementPropertyAst = /** @class */ (function () {
        function BoundElementPropertyAst(name, type, securityContext, value, unit, sourceSpan) {
            this.name = name;
            this.type = type;
            this.securityContext = securityContext;
            this.value = value;
            this.unit = unit;
            this.sourceSpan = sourceSpan;
            this.isAnimation = this.type === 4 /* Animation */;
        }
        BoundElementPropertyAst.fromBoundProperty = function (prop) {
            var type = BoundPropertyMapping[prop.type];
            return new BoundElementPropertyAst(prop.name, type, prop.securityContext, prop.value, prop.unit, prop.sourceSpan);
        };
        BoundElementPropertyAst.prototype.visit = function (visitor, context) {
            return visitor.visitElementProperty(this, context);
        };
        return BoundElementPropertyAst;
    }());
    exports.BoundElementPropertyAst = BoundElementPropertyAst;
    /**
     * A binding for an element event (e.g. `(event)="handler()"`) or an animation trigger event (e.g.
     * `(@trigger.phase)="callback($event)"`).
     */
    var BoundEventAst = /** @class */ (function () {
        function BoundEventAst(name, target, phase, handler, sourceSpan, handlerSpan) {
            this.name = name;
            this.target = target;
            this.phase = phase;
            this.handler = handler;
            this.sourceSpan = sourceSpan;
            this.handlerSpan = handlerSpan;
            this.fullName = BoundEventAst.calcFullName(this.name, this.target, this.phase);
            this.isAnimation = !!this.phase;
        }
        BoundEventAst.calcFullName = function (name, target, phase) {
            if (target) {
                return target + ":" + name;
            }
            if (phase) {
                return "@" + name + "." + phase;
            }
            return name;
        };
        BoundEventAst.fromParsedEvent = function (event) {
            var target = event.type === 0 /* Regular */ ? event.targetOrPhase : null;
            var phase = event.type === 1 /* Animation */ ? event.targetOrPhase : null;
            return new BoundEventAst(event.name, target, phase, event.handler, event.sourceSpan, event.handlerSpan);
        };
        BoundEventAst.prototype.visit = function (visitor, context) {
            return visitor.visitEvent(this, context);
        };
        return BoundEventAst;
    }());
    exports.BoundEventAst = BoundEventAst;
    /**
     * A reference declaration on an element (e.g. `let someName="expression"`).
     */
    var ReferenceAst = /** @class */ (function () {
        function ReferenceAst(name, value, originalValue, sourceSpan) {
            this.name = name;
            this.value = value;
            this.originalValue = originalValue;
            this.sourceSpan = sourceSpan;
        }
        ReferenceAst.prototype.visit = function (visitor, context) {
            return visitor.visitReference(this, context);
        };
        return ReferenceAst;
    }());
    exports.ReferenceAst = ReferenceAst;
    /**
     * A variable declaration on a <ng-template> (e.g. `var-someName="someLocalName"`).
     */
    var VariableAst = /** @class */ (function () {
        function VariableAst(name, value, sourceSpan) {
            this.name = name;
            this.value = value;
            this.sourceSpan = sourceSpan;
        }
        VariableAst.fromParsedVariable = function (v) {
            return new VariableAst(v.name, v.value, v.sourceSpan);
        };
        VariableAst.prototype.visit = function (visitor, context) {
            return visitor.visitVariable(this, context);
        };
        return VariableAst;
    }());
    exports.VariableAst = VariableAst;
    /**
     * An element declaration in a template.
     */
    var ElementAst = /** @class */ (function () {
        function ElementAst(name, attrs, inputs, outputs, references, directives, providers, hasViewContainer, queryMatches, children, ngContentIndex, sourceSpan, endSourceSpan) {
            this.name = name;
            this.attrs = attrs;
            this.inputs = inputs;
            this.outputs = outputs;
            this.references = references;
            this.directives = directives;
            this.providers = providers;
            this.hasViewContainer = hasViewContainer;
            this.queryMatches = queryMatches;
            this.children = children;
            this.ngContentIndex = ngContentIndex;
            this.sourceSpan = sourceSpan;
            this.endSourceSpan = endSourceSpan;
        }
        ElementAst.prototype.visit = function (visitor, context) {
            return visitor.visitElement(this, context);
        };
        return ElementAst;
    }());
    exports.ElementAst = ElementAst;
    /**
     * A `<ng-template>` element included in an Angular template.
     */
    var EmbeddedTemplateAst = /** @class */ (function () {
        function EmbeddedTemplateAst(attrs, outputs, references, variables, directives, providers, hasViewContainer, queryMatches, children, ngContentIndex, sourceSpan) {
            this.attrs = attrs;
            this.outputs = outputs;
            this.references = references;
            this.variables = variables;
            this.directives = directives;
            this.providers = providers;
            this.hasViewContainer = hasViewContainer;
            this.queryMatches = queryMatches;
            this.children = children;
            this.ngContentIndex = ngContentIndex;
            this.sourceSpan = sourceSpan;
        }
        EmbeddedTemplateAst.prototype.visit = function (visitor, context) {
            return visitor.visitEmbeddedTemplate(this, context);
        };
        return EmbeddedTemplateAst;
    }());
    exports.EmbeddedTemplateAst = EmbeddedTemplateAst;
    /**
     * A directive property with a bound value (e.g. `*ngIf="condition").
     */
    var BoundDirectivePropertyAst = /** @class */ (function () {
        function BoundDirectivePropertyAst(directiveName, templateName, value, sourceSpan) {
            this.directiveName = directiveName;
            this.templateName = templateName;
            this.value = value;
            this.sourceSpan = sourceSpan;
        }
        BoundDirectivePropertyAst.prototype.visit = function (visitor, context) {
            return visitor.visitDirectiveProperty(this, context);
        };
        return BoundDirectivePropertyAst;
    }());
    exports.BoundDirectivePropertyAst = BoundDirectivePropertyAst;
    /**
     * A directive declared on an element.
     */
    var DirectiveAst = /** @class */ (function () {
        function DirectiveAst(directive, inputs, hostProperties, hostEvents, contentQueryStartId, sourceSpan) {
            this.directive = directive;
            this.inputs = inputs;
            this.hostProperties = hostProperties;
            this.hostEvents = hostEvents;
            this.contentQueryStartId = contentQueryStartId;
            this.sourceSpan = sourceSpan;
        }
        DirectiveAst.prototype.visit = function (visitor, context) {
            return visitor.visitDirective(this, context);
        };
        return DirectiveAst;
    }());
    exports.DirectiveAst = DirectiveAst;
    /**
     * A provider declared on an element
     */
    var ProviderAst = /** @class */ (function () {
        function ProviderAst(token, multiProvider, eager, providers, providerType, lifecycleHooks, sourceSpan, isModule) {
            this.token = token;
            this.multiProvider = multiProvider;
            this.eager = eager;
            this.providers = providers;
            this.providerType = providerType;
            this.lifecycleHooks = lifecycleHooks;
            this.sourceSpan = sourceSpan;
            this.isModule = isModule;
        }
        ProviderAst.prototype.visit = function (visitor, context) {
            // No visit method in the visitor for now...
            return null;
        };
        return ProviderAst;
    }());
    exports.ProviderAst = ProviderAst;
    var ProviderAstType;
    (function (ProviderAstType) {
        ProviderAstType[ProviderAstType["PublicService"] = 0] = "PublicService";
        ProviderAstType[ProviderAstType["PrivateService"] = 1] = "PrivateService";
        ProviderAstType[ProviderAstType["Component"] = 2] = "Component";
        ProviderAstType[ProviderAstType["Directive"] = 3] = "Directive";
        ProviderAstType[ProviderAstType["Builtin"] = 4] = "Builtin";
    })(ProviderAstType = exports.ProviderAstType || (exports.ProviderAstType = {}));
    /**
     * Position where content is to be projected (instance of `<ng-content>` in a template).
     */
    var NgContentAst = /** @class */ (function () {
        function NgContentAst(index, ngContentIndex, sourceSpan) {
            this.index = index;
            this.ngContentIndex = ngContentIndex;
            this.sourceSpan = sourceSpan;
        }
        NgContentAst.prototype.visit = function (visitor, context) {
            return visitor.visitNgContent(this, context);
        };
        return NgContentAst;
    }());
    exports.NgContentAst = NgContentAst;
    /**
     * A visitor that accepts each node but doesn't do anything. It is intended to be used
     * as the base class for a visitor that is only interested in a subset of the node types.
     */
    var NullTemplateVisitor = /** @class */ (function () {
        function NullTemplateVisitor() {
        }
        NullTemplateVisitor.prototype.visitNgContent = function (ast, context) { };
        NullTemplateVisitor.prototype.visitEmbeddedTemplate = function (ast, context) { };
        NullTemplateVisitor.prototype.visitElement = function (ast, context) { };
        NullTemplateVisitor.prototype.visitReference = function (ast, context) { };
        NullTemplateVisitor.prototype.visitVariable = function (ast, context) { };
        NullTemplateVisitor.prototype.visitEvent = function (ast, context) { };
        NullTemplateVisitor.prototype.visitElementProperty = function (ast, context) { };
        NullTemplateVisitor.prototype.visitAttr = function (ast, context) { };
        NullTemplateVisitor.prototype.visitBoundText = function (ast, context) { };
        NullTemplateVisitor.prototype.visitText = function (ast, context) { };
        NullTemplateVisitor.prototype.visitDirective = function (ast, context) { };
        NullTemplateVisitor.prototype.visitDirectiveProperty = function (ast, context) { };
        return NullTemplateVisitor;
    }());
    exports.NullTemplateVisitor = NullTemplateVisitor;
    /**
     * Base class that can be used to build a visitor that visits each node
     * in an template ast recursively.
     */
    var RecursiveTemplateAstVisitor = /** @class */ (function (_super) {
        tslib_1.__extends(RecursiveTemplateAstVisitor, _super);
        function RecursiveTemplateAstVisitor() {
            return _super.call(this) || this;
        }
        // Nodes with children
        RecursiveTemplateAstVisitor.prototype.visitEmbeddedTemplate = function (ast, context) {
            return this.visitChildren(context, function (visit) {
                visit(ast.attrs);
                visit(ast.references);
                visit(ast.variables);
                visit(ast.directives);
                visit(ast.providers);
                visit(ast.children);
            });
        };
        RecursiveTemplateAstVisitor.prototype.visitElement = function (ast, context) {
            return this.visitChildren(context, function (visit) {
                visit(ast.attrs);
                visit(ast.inputs);
                visit(ast.outputs);
                visit(ast.references);
                visit(ast.directives);
                visit(ast.providers);
                visit(ast.children);
            });
        };
        RecursiveTemplateAstVisitor.prototype.visitDirective = function (ast, context) {
            return this.visitChildren(context, function (visit) {
                visit(ast.inputs);
                visit(ast.hostProperties);
                visit(ast.hostEvents);
            });
        };
        RecursiveTemplateAstVisitor.prototype.visitChildren = function (context, cb) {
            var results = [];
            var t = this;
            function visit(children) {
                if (children && children.length)
                    results.push(templateVisitAll(t, children, context));
            }
            cb(visit);
            return [].concat.apply([], results);
        };
        return RecursiveTemplateAstVisitor;
    }(NullTemplateVisitor));
    exports.RecursiveTemplateAstVisitor = RecursiveTemplateAstVisitor;
    /**
     * Visit every node in a list of {@link TemplateAst}s with the given {@link TemplateAstVisitor}.
     */
    function templateVisitAll(visitor, asts, context) {
        if (context === void 0) { context = null; }
        var result = [];
        var visit = visitor.visit ?
            function (ast) { return visitor.visit(ast, context) || ast.visit(visitor, context); } :
            function (ast) { return ast.visit(visitor, context); };
        asts.forEach(function (ast) {
            var astResult = visit(ast);
            if (astResult) {
                result.push(astResult);
            }
        });
        return result;
    }
    exports.templateVisitAll = templateVisitAll;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGVfYXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL3RlbXBsYXRlX3BhcnNlci90ZW1wbGF0ZV9hc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7OztJQTBCSDs7T0FFRztJQUNIO1FBQ0UsaUJBQ1csS0FBYSxFQUFTLGNBQXNCLEVBQVMsVUFBMkI7WUFBaEYsVUFBSyxHQUFMLEtBQUssQ0FBUTtZQUFTLG1CQUFjLEdBQWQsY0FBYyxDQUFRO1lBQVMsZUFBVSxHQUFWLFVBQVUsQ0FBaUI7UUFBRyxDQUFDO1FBQy9GLHVCQUFLLEdBQUwsVUFBTSxPQUEyQixFQUFFLE9BQVksSUFBUyxPQUFPLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwRyxjQUFDO0lBQUQsQ0FBQyxBQUpELElBSUM7SUFKWSwwQkFBTztJQU1wQjs7T0FFRztJQUNIO1FBQ0Usc0JBQ1csS0FBVSxFQUFTLGNBQXNCLEVBQVMsVUFBMkI7WUFBN0UsVUFBSyxHQUFMLEtBQUssQ0FBSztZQUFTLG1CQUFjLEdBQWQsY0FBYyxDQUFRO1lBQVMsZUFBVSxHQUFWLFVBQVUsQ0FBaUI7UUFBRyxDQUFDO1FBQzVGLDRCQUFLLEdBQUwsVUFBTSxPQUEyQixFQUFFLE9BQVk7WUFDN0MsT0FBTyxPQUFPLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMvQyxDQUFDO1FBQ0gsbUJBQUM7SUFBRCxDQUFDLEFBTkQsSUFNQztJQU5ZLG9DQUFZO0lBUXpCOztPQUVHO0lBQ0g7UUFDRSxpQkFBbUIsSUFBWSxFQUFTLEtBQWEsRUFBUyxVQUEyQjtZQUF0RSxTQUFJLEdBQUosSUFBSSxDQUFRO1lBQVMsVUFBSyxHQUFMLEtBQUssQ0FBUTtZQUFTLGVBQVUsR0FBVixVQUFVLENB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RyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDekIsVUFBQyxHQUFnQixJQUFLLE9BQUEsT0FBTyxDQUFDLEtBQU8sQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEVBQTVELENBQTRELENBQUMsQ0FBQztZQUNwRixVQUFDLEdBQWdCLElBQUssT0FBQSxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsRUFBM0IsQ0FBMkIsQ0FBQztRQUN0RCxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQUEsR0FBRztZQUNkLElBQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM3QixJQUFJLFNBQVMsRUFBRTtnQkFDYixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQ3hCO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBYkQsNENBYUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7QXN0UGF0aH0gZnJvbSAnLi4vYXN0X3BhdGgnO1xuaW1wb3J0IHtDb21waWxlRGlyZWN0aXZlU3VtbWFyeSwgQ29tcGlsZVByb3ZpZGVyTWV0YWRhdGEsIENvbXBpbGVUb2tlbk1ldGFkYXRhfSBmcm9tICcuLi9jb21waWxlX21ldGFkYXRhJztcbmltcG9ydCB7U2VjdXJpdHlDb250ZXh0fSBmcm9tICcuLi9jb3JlJztcbmltcG9ydCB7QVNULCBCaW5kaW5nVHlwZSwgQm91bmRFbGVtZW50UHJvcGVydHksIFBhcnNlZEV2ZW50LCBQYXJzZWRFdmVudFR5cGUsIFBhcnNlZFZhcmlhYmxlfSBmcm9tICcuLi9leHByZXNzaW9uX3BhcnNlci9hc3QnO1xuaW1wb3J0IHtMaWZlY3ljbGVIb29rc30gZnJvbSAnLi4vbGlmZWN5Y2xlX3JlZmxlY3Rvcic7XG5pbXBvcnQge1BhcnNlU291cmNlU3Bhbn0gZnJvbSAnLi4vcGFyc2VfdXRpbCc7XG5cblxuXG4vKipcbiAqIEFuIEFic3RyYWN0IFN5bnRheCBUcmVlIG5vZGUgcmVwcmVzZW50aW5nIHBhcnQgb2YgYSBwYXJzZWQgQW5ndWxhciB0ZW1wbGF0ZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUZW1wbGF0ZUFzdCB7XG4gIC8qKlxuICAgKiBUaGUgc291cmNlIHNwYW4gZnJvbSB3aGljaCB0aGlzIG5vZGUgd2FzIHBhcnNlZC5cbiAgICovXG4gIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3BhbjtcblxuICAvKipcbiAgICogVmlzaXQgdGhpcyBub2RlIGFuZCBwb3NzaWJseSB0cmFuc2Zvcm0gaXQuXG4gICAqL1xuICB2aXNpdCh2aXNpdG9yOiBUZW1wbGF0ZUFzdFZpc2l0b3IsIGNvbnRleHQ6IGFueSk6IGFueTtcbn1cblxuLyoqXG4gKiBBIHNlZ21lbnQgb2YgdGV4dCB3aXRoaW4gdGhlIHRlbXBsYXRlLlxuICovXG5leHBvcnQgY2xhc3MgVGV4dEFzdCBpbXBsZW1lbnRzIFRlbXBsYXRlQXN0IHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwdWJsaWMgdmFsdWU6IHN0cmluZywgcHVibGljIG5nQ29udGVudEluZGV4OiBudW1iZXIsIHB1YmxpYyBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW4pIHt9XG4gIHZpc2l0KHZpc2l0b3I6IFRlbXBsYXRlQXN0VmlzaXRvciwgY29udGV4dDogYW55KTogYW55IHsgcmV0dXJuIHZpc2l0b3IudmlzaXRUZXh0KHRoaXMsIGNvbnRleHQpOyB9XG59XG5cbi8qKlxuICogQSBib3VuZCBleHByZXNzaW9uIHdpdGhpbiB0aGUgdGV4dCBvZiBhIHRlbXBsYXRlLlxuICovXG5leHBvcnQgY2xhc3MgQm91bmRUZXh0QXN0IGltcGxlbWVudHMgVGVtcGxhdGVBc3Qge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHB1YmxpYyB2YWx1ZTogQVNULCBwdWJsaWMgbmdDb250ZW50SW5kZXg6IG51bWJlciwgcHVibGljIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3Bhbikge31cbiAgdmlzaXQodmlzaXRvcjogVGVtcGxhdGVBc3RWaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0Qm91bmRUZXh0KHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cbi8qKlxuICogQSBwbGFpbiBhdHRyaWJ1dGUgb24gYW4gZWxlbWVudC5cbiAqL1xuZXhwb3J0IGNsYXNzIEF0dHJBc3QgaW1wbGVtZW50cyBUZW1wbGF0ZUFzdCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcsIHB1YmxpYyB2YWx1ZTogc3RyaW5nLCBwdWJsaWMgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuKSB7fVxuICB2aXNpdCh2aXNpdG9yOiBUZW1wbGF0ZUFzdFZpc2l0b3IsIGNvbnRleHQ6IGFueSk6IGFueSB7IHJldHVybiB2aXNpdG9yLnZpc2l0QXR0cih0aGlzLCBjb250ZXh0KTsgfVxufVxuXG5leHBvcnQgY29uc3QgZW51bSBQcm9wZXJ0eUJpbmRpbmdUeXBlIHtcbiAgLy8gQSBub3JtYWwgYmluZGluZyB0byBhIHByb3BlcnR5IChlLmcuIGBbcHJvcGVydHldPVwiZXhwcmVzc2lvblwiYCkuXG4gIFByb3BlcnR5LFxuICAvLyBBIGJpbmRpbmcgdG8gYW4gZWxlbWVudCBhdHRyaWJ1dGUgKGUuZy4gYFthdHRyLm5hbWVdPVwiZXhwcmVzc2lvblwiYCkuXG4gIEF0dHJpYnV0ZSxcbiAgLy8gQSBiaW5kaW5nIHRvIGEgQ1NTIGNsYXNzIChlLmcuIGBbY2xhc3MubmFtZV09XCJjb25kaXRpb25cImApLlxuICBDbGFzcyxcbiAgLy8gQSBiaW5kaW5nIHRvIGEgc3R5bGUgcnVsZSAoZS5nLiBgW3N0eWxlLnJ1bGVdPVwiZXhwcmVzc2lvblwiYCkuXG4gIFN0eWxlLFxuICAvLyBBIGJpbmRpbmcgdG8gYW4gYW5pbWF0aW9uIHJlZmVyZW5jZSAoZS5nLiBgW2FuaW1hdGUua2V5XT1cImV4cHJlc3Npb25cImApLlxuICBBbmltYXRpb24sXG59XG5cbmNvbnN0IEJvdW5kUHJvcGVydHlNYXBwaW5nID0ge1xuICBbQmluZGluZ1R5cGUuQW5pbWF0aW9uXTogUHJvcGVydHlCaW5kaW5nVHlwZS5BbmltYXRpb24sXG4gIFtCaW5kaW5nVHlwZS5BdHRyaWJ1dGVdOiBQcm9wZXJ0eUJpbmRpbmdUeXBlLkF0dHJpYnV0ZSxcbiAgW0JpbmRpbmdUeXBlLkNsYXNzXTogUHJvcGVydHlCaW5kaW5nVHlwZS5DbGFzcyxcbiAgW0JpbmRpbmdUeXBlLlByb3BlcnR5XTogUHJvcGVydHlCaW5kaW5nVHlwZS5Qcm9wZXJ0eSxcbiAgW0JpbmRpbmdUeXBlLlN0eWxlXTogUHJvcGVydHlCaW5kaW5nVHlwZS5TdHlsZSxcbn07XG5cbi8qKlxuICogQSBiaW5kaW5nIGZvciBhbiBlbGVtZW50IHByb3BlcnR5IChlLmcuIGBbcHJvcGVydHldPVwiZXhwcmVzc2lvblwiYCkgb3IgYW4gYW5pbWF0aW9uIHRyaWdnZXIgKGUuZy5cbiAqIGBbQHRyaWdnZXJdPVwic3RhdGVFeHBcImApXG4gKi9cbmV4cG9ydCBjbGFzcyBCb3VuZEVsZW1lbnRQcm9wZXJ0eUFzdCBpbXBsZW1lbnRzIFRlbXBsYXRlQXN0IHtcbiAgcmVhZG9ubHkgaXNBbmltYXRpb246IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwdWJsaWMgbmFtZTogc3RyaW5nLCBwdWJsaWMgdHlwZTogUHJvcGVydHlCaW5kaW5nVHlwZSxcbiAgICAgIHB1YmxpYyBzZWN1cml0eUNvbnRleHQ6IFNlY3VyaXR5Q29udGV4dCwgcHVibGljIHZhbHVlOiBBU1QsIHB1YmxpYyB1bml0OiBzdHJpbmd8bnVsbCxcbiAgICAgIHB1YmxpYyBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW4pIHtcbiAgICB0aGlzLmlzQW5pbWF0aW9uID0gdGhpcy50eXBlID09PSBQcm9wZXJ0eUJpbmRpbmdUeXBlLkFuaW1hdGlvbjtcbiAgfVxuXG4gIHN0YXRpYyBmcm9tQm91bmRQcm9wZXJ0eShwcm9wOiBCb3VuZEVsZW1lbnRQcm9wZXJ0eSkge1xuICAgIGNvbnN0IHR5cGUgPSBCb3VuZFByb3BlcnR5TWFwcGluZ1twcm9wLnR5cGVdO1xuICAgIHJldHVybiBuZXcgQm91bmRFbGVtZW50UHJvcGVydHlBc3QoXG4gICAgICAgIHByb3AubmFtZSwgdHlwZSwgcHJvcC5zZWN1cml0eUNvbnRleHQsIHByb3AudmFsdWUsIHByb3AudW5pdCwgcHJvcC5zb3VyY2VTcGFuKTtcbiAgfVxuXG4gIHZpc2l0KHZpc2l0b3I6IFRlbXBsYXRlQXN0VmlzaXRvciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdEVsZW1lbnRQcm9wZXJ0eSh0aGlzLCBjb250ZXh0KTtcbiAgfVxufVxuXG4vKipcbiAqIEEgYmluZGluZyBmb3IgYW4gZWxlbWVudCBldmVudCAoZS5nLiBgKGV2ZW50KT1cImhhbmRsZXIoKVwiYCkgb3IgYW4gYW5pbWF0aW9uIHRyaWdnZXIgZXZlbnQgKGUuZy5cbiAqIGAoQHRyaWdnZXIucGhhc2UpPVwiY2FsbGJhY2soJGV2ZW50KVwiYCkuXG4gKi9cbmV4cG9ydCBjbGFzcyBCb3VuZEV2ZW50QXN0IGltcGxlbWVudHMgVGVtcGxhdGVBc3Qge1xuICByZWFkb25seSBmdWxsTmFtZTogc3RyaW5nO1xuICByZWFkb25seSBpc0FuaW1hdGlvbjogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHB1YmxpYyBuYW1lOiBzdHJpbmcsIHB1YmxpYyB0YXJnZXQ6IHN0cmluZ3xudWxsLCBwdWJsaWMgcGhhc2U6IHN0cmluZ3xudWxsLFxuICAgICAgcHVibGljIGhhbmRsZXI6IEFTVCwgcHVibGljIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3BhbixcbiAgICAgIHB1YmxpYyBoYW5kbGVyU3BhbjogUGFyc2VTb3VyY2VTcGFuKSB7XG4gICAgdGhpcy5mdWxsTmFtZSA9IEJvdW5kRXZlbnRBc3QuY2FsY0Z1bGxOYW1lKHRoaXMubmFtZSwgdGhpcy50YXJnZXQsIHRoaXMucGhhc2UpO1xuICAgIHRoaXMuaXNBbmltYXRpb24gPSAhIXRoaXMucGhhc2U7XG4gIH1cblxuICBzdGF0aWMgY2FsY0Z1bGxOYW1lKG5hbWU6IHN0cmluZywgdGFyZ2V0OiBzdHJpbmd8bnVsbCwgcGhhc2U6IHN0cmluZ3xudWxsKTogc3RyaW5nIHtcbiAgICBpZiAodGFyZ2V0KSB7XG4gICAgICByZXR1cm4gYCR7dGFyZ2V0fToke25hbWV9YDtcbiAgICB9XG4gICAgaWYgKHBoYXNlKSB7XG4gICAgICByZXR1cm4gYEAke25hbWV9LiR7cGhhc2V9YDtcbiAgICB9XG5cbiAgICByZXR1cm4gbmFtZTtcbiAgfVxuXG4gIHN0YXRpYyBmcm9tUGFyc2VkRXZlbnQoZXZlbnQ6IFBhcnNlZEV2ZW50KSB7XG4gICAgY29uc3QgdGFyZ2V0OiBzdHJpbmd8bnVsbCA9IGV2ZW50LnR5cGUgPT09IFBhcnNlZEV2ZW50VHlwZS5SZWd1bGFyID8gZXZlbnQudGFyZ2V0T3JQaGFzZSA6IG51bGw7XG4gICAgY29uc3QgcGhhc2U6IHN0cmluZ3xudWxsID1cbiAgICAgICAgZXZlbnQudHlwZSA9PT0gUGFyc2VkRXZlbnRUeXBlLkFuaW1hdGlvbiA/IGV2ZW50LnRhcmdldE9yUGhhc2UgOiBudWxsO1xuICAgIHJldHVybiBuZXcgQm91bmRFdmVudEFzdChcbiAgICAgICAgZXZlbnQubmFtZSwgdGFyZ2V0LCBwaGFzZSwgZXZlbnQuaGFuZGxlciwgZXZlbnQuc291cmNlU3BhbiwgZXZlbnQuaGFuZGxlclNwYW4pO1xuICB9XG5cbiAgdmlzaXQodmlzaXRvcjogVGVtcGxhdGVBc3RWaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RXZlbnQodGhpcywgY29udGV4dCk7XG4gIH1cbn1cblxuLyoqXG4gKiBBIHJlZmVyZW5jZSBkZWNsYXJhdGlvbiBvbiBhbiBlbGVtZW50IChlLmcuIGBsZXQgc29tZU5hbWU9XCJleHByZXNzaW9uXCJgKS5cbiAqL1xuZXhwb3J0IGNsYXNzIFJlZmVyZW5jZUFzdCBpbXBsZW1lbnRzIFRlbXBsYXRlQXN0IHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwdWJsaWMgbmFtZTogc3RyaW5nLCBwdWJsaWMgdmFsdWU6IENvbXBpbGVUb2tlbk1ldGFkYXRhLCBwdWJsaWMgb3JpZ2luYWxWYWx1ZTogc3RyaW5nLFxuICAgICAgcHVibGljIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3Bhbikge31cbiAgdmlzaXQodmlzaXRvcjogVGVtcGxhdGVBc3RWaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0UmVmZXJlbmNlKHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cbi8qKlxuICogQSB2YXJpYWJsZSBkZWNsYXJhdGlvbiBvbiBhIDxuZy10ZW1wbGF0ZT4gKGUuZy4gYHZhci1zb21lTmFtZT1cInNvbWVMb2NhbE5hbWVcImApLlxuICovXG5leHBvcnQgY2xhc3MgVmFyaWFibGVBc3QgaW1wbGVtZW50cyBUZW1wbGF0ZUFzdCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcsIHB1YmxpYyB2YWx1ZTogc3RyaW5nLCBwdWJsaWMgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuKSB7fVxuXG4gIHN0YXRpYyBmcm9tUGFyc2VkVmFyaWFibGUodjogUGFyc2VkVmFyaWFibGUpIHtcbiAgICByZXR1cm4gbmV3IFZhcmlhYmxlQXN0KHYubmFtZSwgdi52YWx1ZSwgdi5zb3VyY2VTcGFuKTtcbiAgfVxuXG4gIHZpc2l0KHZpc2l0b3I6IFRlbXBsYXRlQXN0VmlzaXRvciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdFZhcmlhYmxlKHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cbi8qKlxuICogQW4gZWxlbWVudCBkZWNsYXJhdGlvbiBpbiBhIHRlbXBsYXRlLlxuICovXG5leHBvcnQgY2xhc3MgRWxlbWVudEFzdCBpbXBsZW1lbnRzIFRlbXBsYXRlQXN0IHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwdWJsaWMgbmFtZTogc3RyaW5nLCBwdWJsaWMgYXR0cnM6IEF0dHJBc3RbXSwgcHVibGljIGlucHV0czogQm91bmRFbGVtZW50UHJvcGVydHlBc3RbXSxcbiAgICAgIHB1YmxpYyBvdXRwdXRzOiBCb3VuZEV2ZW50QXN0W10sIHB1YmxpYyByZWZlcmVuY2VzOiBSZWZlcmVuY2VBc3RbXSxcbiAgICAgIHB1YmxpYyBkaXJlY3RpdmVzOiBEaXJlY3RpdmVBc3RbXSwgcHVibGljIHByb3ZpZGVyczogUHJvdmlkZXJBc3RbXSxcbiAgICAgIHB1YmxpYyBoYXNWaWV3Q29udGFpbmVyOiBib29sZWFuLCBwdWJsaWMgcXVlcnlNYXRjaGVzOiBRdWVyeU1hdGNoW10sXG4gICAgICBwdWJsaWMgY2hpbGRyZW46IFRlbXBsYXRlQXN0W10sIHB1YmxpYyBuZ0NvbnRlbnRJbmRleDogbnVtYmVyfG51bGwsXG4gICAgICBwdWJsaWMgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuLCBwdWJsaWMgZW5kU291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFufG51bGwpIHt9XG5cbiAgdmlzaXQodmlzaXRvcjogVGVtcGxhdGVBc3RWaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RWxlbWVudCh0aGlzLCBjb250ZXh0KTtcbiAgfVxufVxuXG4vKipcbiAqIEEgYDxuZy10ZW1wbGF0ZT5gIGVsZW1lbnQgaW5jbHVkZWQgaW4gYW4gQW5ndWxhciB0ZW1wbGF0ZS5cbiAqL1xuZXhwb3J0IGNsYXNzIEVtYmVkZGVkVGVtcGxhdGVBc3QgaW1wbGVtZW50cyBUZW1wbGF0ZUFzdCB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHVibGljIGF0dHJzOiBBdHRyQXN0W10sIHB1YmxpYyBvdXRwdXRzOiBCb3VuZEV2ZW50QXN0W10sIHB1YmxpYyByZWZlcmVuY2VzOiBSZWZlcmVuY2VBc3RbXSxcbiAgICAgIHB1YmxpYyB2YXJpYWJsZXM6IFZhcmlhYmxlQXN0W10sIHB1YmxpYyBkaXJlY3RpdmVzOiBEaXJlY3RpdmVBc3RbXSxcbiAgICAgIHB1YmxpYyBwcm92aWRlcnM6IFByb3ZpZGVyQXN0W10sIHB1YmxpYyBoYXNWaWV3Q29udGFpbmVyOiBib29sZWFuLFxuICAgICAgcHVibGljIHF1ZXJ5TWF0Y2hlczogUXVlcnlNYXRjaFtdLCBwdWJsaWMgY2hpbGRyZW46IFRlbXBsYXRlQXN0W10sXG4gICAgICBwdWJsaWMgbmdDb250ZW50SW5kZXg6IG51bWJlciwgcHVibGljIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3Bhbikge31cblxuICB2aXNpdCh2aXNpdG9yOiBUZW1wbGF0ZUFzdFZpc2l0b3IsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXRFbWJlZGRlZFRlbXBsYXRlKHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgcHJvcGVydHkgd2l0aCBhIGJvdW5kIHZhbHVlIChlLmcuIGAqbmdJZj1cImNvbmRpdGlvblwiKS5cbiAqL1xuZXhwb3J0IGNsYXNzIEJvdW5kRGlyZWN0aXZlUHJvcGVydHlBc3QgaW1wbGVtZW50cyBUZW1wbGF0ZUFzdCB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHVibGljIGRpcmVjdGl2ZU5hbWU6IHN0cmluZywgcHVibGljIHRlbXBsYXRlTmFtZTogc3RyaW5nLCBwdWJsaWMgdmFsdWU6IEFTVCxcbiAgICAgIHB1YmxpYyBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW4pIHt9XG4gIHZpc2l0KHZpc2l0b3I6IFRlbXBsYXRlQXN0VmlzaXRvciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdERpcmVjdGl2ZVByb3BlcnR5KHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgZGVjbGFyZWQgb24gYW4gZWxlbWVudC5cbiAqL1xuZXhwb3J0IGNsYXNzIERpcmVjdGl2ZUFzdCBpbXBsZW1lbnRzIFRlbXBsYXRlQXN0IHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwdWJsaWMgZGlyZWN0aXZlOiBDb21waWxlRGlyZWN0aXZlU3VtbWFyeSwgcHVibGljIGlucHV0czogQm91bmREaXJlY3RpdmVQcm9wZXJ0eUFzdFtdLFxuICAgICAgcHVibGljIGhvc3RQcm9wZXJ0aWVzOiBCb3VuZEVsZW1lbnRQcm9wZXJ0eUFzdFtdLCBwdWJsaWMgaG9zdEV2ZW50czogQm91bmRFdmVudEFzdFtdLFxuICAgICAgcHVibGljIGNvbnRlbnRRdWVyeVN0YXJ0SWQ6IG51bWJlciwgcHVibGljIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3Bhbikge31cbiAgdmlzaXQodmlzaXRvcjogVGVtcGxhdGVBc3RWaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RGlyZWN0aXZlKHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cbi8qKlxuICogQSBwcm92aWRlciBkZWNsYXJlZCBvbiBhbiBlbGVtZW50XG4gKi9cbmV4cG9ydCBjbGFzcyBQcm92aWRlckFzdCBpbXBsZW1lbnRzIFRlbXBsYXRlQXN0IHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwdWJsaWMgdG9rZW46IENvbXBpbGVUb2tlbk1ldGFkYXRhLCBwdWJsaWMgbXVsdGlQcm92aWRlcjogYm9vbGVhbiwgcHVibGljIGVhZ2VyOiBib29sZWFuLFxuICAgICAgcHVibGljIHByb3ZpZGVyczogQ29tcGlsZVByb3ZpZGVyTWV0YWRhdGFbXSwgcHVibGljIHByb3ZpZGVyVHlwZTogUHJvdmlkZXJBc3RUeXBlLFxuICAgICAgcHVibGljIGxpZmVjeWNsZUhvb2tzOiBMaWZlY3ljbGVIb29rc1tdLCBwdWJsaWMgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuLFxuICAgICAgcmVhZG9ubHkgaXNNb2R1bGU6IGJvb2xlYW4pIHt9XG5cbiAgdmlzaXQodmlzaXRvcjogVGVtcGxhdGVBc3RWaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIC8vIE5vIHZpc2l0IG1ldGhvZCBpbiB0aGUgdmlzaXRvciBmb3Igbm93Li4uXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IGVudW0gUHJvdmlkZXJBc3RUeXBlIHtcbiAgUHVibGljU2VydmljZSxcbiAgUHJpdmF0ZVNlcnZpY2UsXG4gIENvbXBvbmVudCxcbiAgRGlyZWN0aXZlLFxuICBCdWlsdGluXG59XG5cbi8qKlxuICogUG9zaXRpb24gd2hlcmUgY29udGVudCBpcyB0byBiZSBwcm9qZWN0ZWQgKGluc3RhbmNlIG9mIGA8bmctY29udGVudD5gIGluIGEgdGVtcGxhdGUpLlxuICovXG5leHBvcnQgY2xhc3MgTmdDb250ZW50QXN0IGltcGxlbWVudHMgVGVtcGxhdGVBc3Qge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHB1YmxpYyBpbmRleDogbnVtYmVyLCBwdWJsaWMgbmdDb250ZW50SW5kZXg6IG51bWJlciwgcHVibGljIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3Bhbikge31cbiAgdmlzaXQodmlzaXRvcjogVGVtcGxhdGVBc3RWaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0TmdDb250ZW50KHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUXVlcnlNYXRjaCB7XG4gIHF1ZXJ5SWQ6IG51bWJlcjtcbiAgdmFsdWU6IENvbXBpbGVUb2tlbk1ldGFkYXRhO1xufVxuXG4vKipcbiAqIEEgdmlzaXRvciBmb3Ige0BsaW5rIFRlbXBsYXRlQXN0fSB0cmVlcyB0aGF0IHdpbGwgcHJvY2VzcyBlYWNoIG5vZGUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVGVtcGxhdGVBc3RWaXNpdG9yIHtcbiAgLy8gUmV0dXJuaW5nIGEgdHJ1dGh5IHZhbHVlIGZyb20gYHZpc2l0KClgIHdpbGwgcHJldmVudCBgdGVtcGxhdGVWaXNpdEFsbCgpYCBmcm9tIHRoZSBjYWxsIHRvXG4gIC8vIHRoZSB0eXBlZCBtZXRob2QgYW5kIHJlc3VsdCByZXR1cm5lZCB3aWxsIGJlY29tZSB0aGUgcmVzdWx0IGluY2x1ZGVkIGluIGB2aXNpdEFsbCgpYHNcbiAgLy8gcmVzdWx0IGFycmF5LlxuICB2aXNpdD8oYXN0OiBUZW1wbGF0ZUFzdCwgY29udGV4dDogYW55KTogYW55O1xuXG4gIHZpc2l0TmdDb250ZW50KGFzdDogTmdDb250ZW50QXN0LCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0RW1iZWRkZWRUZW1wbGF0ZShhc3Q6IEVtYmVkZGVkVGVtcGxhdGVBc3QsIGNvbnRleHQ6IGFueSk6IGFueTtcbiAgdmlzaXRFbGVtZW50KGFzdDogRWxlbWVudEFzdCwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdFJlZmVyZW5jZShhc3Q6IFJlZmVyZW5jZUFzdCwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdFZhcmlhYmxlKGFzdDogVmFyaWFibGVBc3QsIGNvbnRleHQ6IGFueSk6IGFueTtcbiAgdmlzaXRFdmVudChhc3Q6IEJvdW5kRXZlbnRBc3QsIGNvbnRleHQ6IGFueSk6IGFueTtcbiAgdmlzaXRFbGVtZW50UHJvcGVydHkoYXN0OiBCb3VuZEVsZW1lbnRQcm9wZXJ0eUFzdCwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdEF0dHIoYXN0OiBBdHRyQXN0LCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0Qm91bmRUZXh0KGFzdDogQm91bmRUZXh0QXN0LCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0VGV4dChhc3Q6IFRleHRBc3QsIGNvbnRleHQ6IGFueSk6IGFueTtcbiAgdmlzaXREaXJlY3RpdmUoYXN0OiBEaXJlY3RpdmVBc3QsIGNvbnRleHQ6IGFueSk6IGFueTtcbiAgdmlzaXREaXJlY3RpdmVQcm9wZXJ0eShhc3Q6IEJvdW5kRGlyZWN0aXZlUHJvcGVydHlBc3QsIGNvbnRleHQ6IGFueSk6IGFueTtcbn1cblxuLyoqXG4gKiBBIHZpc2l0b3IgdGhhdCBhY2NlcHRzIGVhY2ggbm9kZSBidXQgZG9lc24ndCBkbyBhbnl0aGluZy4gSXQgaXMgaW50ZW5kZWQgdG8gYmUgdXNlZFxuICogYXMgdGhlIGJhc2UgY2xhc3MgZm9yIGEgdmlzaXRvciB0aGF0IGlzIG9ubHkgaW50ZXJlc3RlZCBpbiBhIHN1YnNldCBvZiB0aGUgbm9kZSB0eXBlcy5cbiAqL1xuZXhwb3J0IGNsYXNzIE51bGxUZW1wbGF0ZVZpc2l0b3IgaW1wbGVtZW50cyBUZW1wbGF0ZUFzdFZpc2l0b3Ige1xuICB2aXNpdE5nQ29udGVudChhc3Q6IE5nQ29udGVudEFzdCwgY29udGV4dDogYW55KTogdm9pZCB7fVxuICB2aXNpdEVtYmVkZGVkVGVtcGxhdGUoYXN0OiBFbWJlZGRlZFRlbXBsYXRlQXN0LCBjb250ZXh0OiBhbnkpOiB2b2lkIHt9XG4gIHZpc2l0RWxlbWVudChhc3Q6IEVsZW1lbnRBc3QsIGNvbnRleHQ6IGFueSk6IHZvaWQge31cbiAgdmlzaXRSZWZlcmVuY2UoYXN0OiBSZWZlcmVuY2VBc3QsIGNvbnRleHQ6IGFueSk6IHZvaWQge31cbiAgdmlzaXRWYXJpYWJsZShhc3Q6IFZhcmlhYmxlQXN0LCBjb250ZXh0OiBhbnkpOiB2b2lkIHt9XG4gIHZpc2l0RXZlbnQoYXN0OiBCb3VuZEV2ZW50QXN0LCBjb250ZXh0OiBhbnkpOiB2b2lkIHt9XG4gIHZpc2l0RWxlbWVudFByb3BlcnR5KGFzdDogQm91bmRFbGVtZW50UHJvcGVydHlBc3QsIGNvbnRleHQ6IGFueSk6IHZvaWQge31cbiAgdmlzaXRBdHRyKGFzdDogQXR0ckFzdCwgY29udGV4dDogYW55KTogdm9pZCB7fVxuICB2aXNpdEJvdW5kVGV4dChhc3Q6IEJvdW5kVGV4dEFzdCwgY29udGV4dDogYW55KTogdm9pZCB7fVxuICB2aXNpdFRleHQoYXN0OiBUZXh0QXN0LCBjb250ZXh0OiBhbnkpOiB2b2lkIHt9XG4gIHZpc2l0RGlyZWN0aXZlKGFzdDogRGlyZWN0aXZlQXN0LCBjb250ZXh0OiBhbnkpOiB2b2lkIHt9XG4gIHZpc2l0RGlyZWN0aXZlUHJvcGVydHkoYXN0OiBCb3VuZERpcmVjdGl2ZVByb3BlcnR5QXN0LCBjb250ZXh0OiBhbnkpOiB2b2lkIHt9XG59XG5cbi8qKlxuICogQmFzZSBjbGFzcyB0aGF0IGNhbiBiZSB1c2VkIHRvIGJ1aWxkIGEgdmlzaXRvciB0aGF0IHZpc2l0cyBlYWNoIG5vZGVcbiAqIGluIGFuIHRlbXBsYXRlIGFzdCByZWN1cnNpdmVseS5cbiAqL1xuZXhwb3J0IGNsYXNzIFJlY3Vyc2l2ZVRlbXBsYXRlQXN0VmlzaXRvciBleHRlbmRzIE51bGxUZW1wbGF0ZVZpc2l0b3IgaW1wbGVtZW50cyBUZW1wbGF0ZUFzdFZpc2l0b3Ige1xuICBjb25zdHJ1Y3RvcigpIHsgc3VwZXIoKTsgfVxuXG4gIC8vIE5vZGVzIHdpdGggY2hpbGRyZW5cbiAgdmlzaXRFbWJlZGRlZFRlbXBsYXRlKGFzdDogRW1iZWRkZWRUZW1wbGF0ZUFzdCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGNvbnRleHQsIHZpc2l0ID0+IHtcbiAgICAgIHZpc2l0KGFzdC5hdHRycyk7XG4gICAgICB2aXNpdChhc3QucmVmZXJlbmNlcyk7XG4gICAgICB2aXNpdChhc3QudmFyaWFibGVzKTtcbiAgICAgIHZpc2l0KGFzdC5kaXJlY3RpdmVzKTtcbiAgICAgIHZpc2l0KGFzdC5wcm92aWRlcnMpO1xuICAgICAgdmlzaXQoYXN0LmNoaWxkcmVuKTtcbiAgICB9KTtcbiAgfVxuXG4gIHZpc2l0RWxlbWVudChhc3Q6IEVsZW1lbnRBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjb250ZXh0LCB2aXNpdCA9PiB7XG4gICAgICB2aXNpdChhc3QuYXR0cnMpO1xuICAgICAgdmlzaXQoYXN0LmlucHV0cyk7XG4gICAgICB2aXNpdChhc3Qub3V0cHV0cyk7XG4gICAgICB2aXNpdChhc3QucmVmZXJlbmNlcyk7XG4gICAgICB2aXNpdChhc3QuZGlyZWN0aXZlcyk7XG4gICAgICB2aXNpdChhc3QucHJvdmlkZXJzKTtcbiAgICAgIHZpc2l0KGFzdC5jaGlsZHJlbik7XG4gICAgfSk7XG4gIH1cblxuICB2aXNpdERpcmVjdGl2ZShhc3Q6IERpcmVjdGl2ZUFzdCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGNvbnRleHQsIHZpc2l0ID0+IHtcbiAgICAgIHZpc2l0KGFzdC5pbnB1dHMpO1xuICAgICAgdmlzaXQoYXN0Lmhvc3RQcm9wZXJ0aWVzKTtcbiAgICAgIHZpc2l0KGFzdC5ob3N0RXZlbnRzKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCB2aXNpdENoaWxkcmVuPFQgZXh0ZW5kcyBUZW1wbGF0ZUFzdD4oXG4gICAgICBjb250ZXh0OiBhbnksXG4gICAgICBjYjogKHZpc2l0OiAoPFYgZXh0ZW5kcyBUZW1wbGF0ZUFzdD4oY2hpbGRyZW46IFZbXXx1bmRlZmluZWQpID0+IHZvaWQpKSA9PiB2b2lkKSB7XG4gICAgbGV0IHJlc3VsdHM6IGFueVtdW10gPSBbXTtcbiAgICBsZXQgdCA9IHRoaXM7XG4gICAgZnVuY3Rpb24gdmlzaXQ8VCBleHRlbmRzIFRlbXBsYXRlQXN0PihjaGlsZHJlbjogVFtdIHwgdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoY2hpbGRyZW4gJiYgY2hpbGRyZW4ubGVuZ3RoKSByZXN1bHRzLnB1c2godGVtcGxhdGVWaXNpdEFsbCh0LCBjaGlsZHJlbiwgY29udGV4dCkpO1xuICAgIH1cbiAgICBjYih2aXNpdCk7XG4gICAgcmV0dXJuIFtdLmNvbmNhdC5hcHBseShbXSwgcmVzdWx0cyk7XG4gIH1cbn1cblxuLyoqXG4gKiBWaXNpdCBldmVyeSBub2RlIGluIGEgbGlzdCBvZiB7QGxpbmsgVGVtcGxhdGVBc3R9cyB3aXRoIHRoZSBnaXZlbiB7QGxpbmsgVGVtcGxhdGVBc3RWaXNpdG9yfS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRlbXBsYXRlVmlzaXRBbGwoXG4gICAgdmlzaXRvcjogVGVtcGxhdGVBc3RWaXNpdG9yLCBhc3RzOiBUZW1wbGF0ZUFzdFtdLCBjb250ZXh0OiBhbnkgPSBudWxsKTogYW55W10ge1xuICBjb25zdCByZXN1bHQ6IGFueVtdID0gW107XG4gIGNvbnN0IHZpc2l0ID0gdmlzaXRvci52aXNpdCA/XG4gICAgICAoYXN0OiBUZW1wbGF0ZUFzdCkgPT4gdmlzaXRvci52aXNpdCAhKGFzdCwgY29udGV4dCkgfHwgYXN0LnZpc2l0KHZpc2l0b3IsIGNvbnRleHQpIDpcbiAgICAgIChhc3Q6IFRlbXBsYXRlQXN0KSA9PiBhc3QudmlzaXQodmlzaXRvciwgY29udGV4dCk7XG4gIGFzdHMuZm9yRWFjaChhc3QgPT4ge1xuICAgIGNvbnN0IGFzdFJlc3VsdCA9IHZpc2l0KGFzdCk7XG4gICAgaWYgKGFzdFJlc3VsdCkge1xuICAgICAgcmVzdWx0LnB1c2goYXN0UmVzdWx0KTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgdHlwZSBUZW1wbGF0ZUFzdFBhdGggPSBBc3RQYXRoPFRlbXBsYXRlQXN0PjtcbiJdfQ==