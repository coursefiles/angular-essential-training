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
        define("@angular/compiler/src/compiler", ["require", "exports", "tslib", "@angular/compiler/src/core", "@angular/compiler/src/jit_compiler_facade", "@angular/compiler/src/util", "@angular/compiler/src/version", "@angular/compiler/src/template_parser/template_ast", "@angular/compiler/src/config", "@angular/compiler/src/compile_metadata", "@angular/compiler/src/aot/compiler_factory", "@angular/compiler/src/aot/compiler", "@angular/compiler/src/aot/generated_file", "@angular/compiler/src/aot/formatted_error", "@angular/compiler/src/aot/static_reflector", "@angular/compiler/src/aot/static_symbol", "@angular/compiler/src/aot/static_symbol_resolver", "@angular/compiler/src/aot/summary_resolver", "@angular/compiler/src/aot/util", "@angular/compiler/src/ast_path", "@angular/compiler/src/summary_resolver", "@angular/compiler/src/identifiers", "@angular/compiler/src/jit/compiler", "@angular/compiler/src/compile_reflector", "@angular/compiler/src/url_resolver", "@angular/compiler/src/resource_loader", "@angular/compiler/src/constant_pool", "@angular/compiler/src/directive_resolver", "@angular/compiler/src/pipe_resolver", "@angular/compiler/src/ng_module_resolver", "@angular/compiler/src/ml_parser/interpolation_config", "@angular/compiler/src/schema/element_schema_registry", "@angular/compiler/src/i18n/index", "@angular/compiler/src/directive_normalizer", "@angular/compiler/src/expression_parser/ast", "@angular/compiler/src/expression_parser/lexer", "@angular/compiler/src/expression_parser/parser", "@angular/compiler/src/metadata_resolver", "@angular/compiler/src/ml_parser/ast", "@angular/compiler/src/ml_parser/html_parser", "@angular/compiler/src/ml_parser/html_tags", "@angular/compiler/src/ml_parser/interpolation_config", "@angular/compiler/src/ml_parser/tags", "@angular/compiler/src/ng_module_compiler", "@angular/compiler/src/output/output_ast", "@angular/compiler/src/output/abstract_emitter", "@angular/compiler/src/output/output_jit", "@angular/compiler/src/output/ts_emitter", "@angular/compiler/src/parse_util", "@angular/compiler/src/schema/dom_element_schema_registry", "@angular/compiler/src/selector", "@angular/compiler/src/style_compiler", "@angular/compiler/src/template_parser/template_parser", "@angular/compiler/src/view_compiler/view_compiler", "@angular/compiler/src/util", "@angular/compiler/src/injectable_compiler_2", "@angular/compiler/src/render3/r3_ast", "@angular/compiler/src/render3/view/t2_binder", "@angular/compiler/src/render3/r3_identifiers", "@angular/compiler/src/render3/r3_factory", "@angular/compiler/src/render3/r3_module_compiler", "@angular/compiler/src/render3/r3_pipe_compiler", "@angular/compiler/src/render3/view/template", "@angular/compiler/src/render3/view/compiler", "@angular/compiler/src/jit_compiler_facade"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    //////////////////////////////////////
    // THIS FILE HAS GLOBAL SIDE EFFECT //
    //       (see bottom of file)       //
    //////////////////////////////////////
    /**
     * @module
     * @description
     * Entry point for all APIs of the compiler package.
     *
     * <div class="callout is-critical">
     *   <header>Unstable APIs</header>
     *   <p>
     *     All compiler apis are currently considered experimental and private!
     *   </p>
     *   <p>
     *     We expect the APIs in this package to keep on changing. Do not rely on them.
     *   </p>
     * </div>
     */
    var core = require("@angular/compiler/src/core");
    exports.core = core;
    var jit_compiler_facade_1 = require("@angular/compiler/src/jit_compiler_facade");
    var util_1 = require("@angular/compiler/src/util");
    tslib_1.__exportStar(require("@angular/compiler/src/version"), exports);
    tslib_1.__exportStar(require("@angular/compiler/src/template_parser/template_ast"), exports);
    var config_1 = require("@angular/compiler/src/config");
    exports.CompilerConfig = config_1.CompilerConfig;
    exports.preserveWhitespacesDefault = config_1.preserveWhitespacesDefault;
    tslib_1.__exportStar(require("@angular/compiler/src/compile_metadata"), exports);
    tslib_1.__exportStar(require("@angular/compiler/src/aot/compiler_factory"), exports);
    tslib_1.__exportStar(require("@angular/compiler/src/aot/compiler"), exports);
    tslib_1.__exportStar(require("@angular/compiler/src/aot/generated_file"), exports);
    tslib_1.__exportStar(require("@angular/compiler/src/aot/formatted_error"), exports);
    tslib_1.__exportStar(require("@angular/compiler/src/aot/static_reflector"), exports);
    tslib_1.__exportStar(require("@angular/compiler/src/aot/static_symbol"), exports);
    tslib_1.__exportStar(require("@angular/compiler/src/aot/static_symbol_resolver"), exports);
    tslib_1.__exportStar(require("@angular/compiler/src/aot/summary_resolver"), exports);
    var util_2 = require("@angular/compiler/src/aot/util");
    exports.isLoweredSymbol = util_2.isLoweredSymbol;
    exports.createLoweredSymbol = util_2.createLoweredSymbol;
    tslib_1.__exportStar(require("@angular/compiler/src/ast_path"), exports);
    tslib_1.__exportStar(require("@angular/compiler/src/summary_resolver"), exports);
    var identifiers_1 = require("@angular/compiler/src/identifiers");
    exports.Identifiers = identifiers_1.Identifiers;
    var compiler_1 = require("@angular/compiler/src/jit/compiler");
    exports.JitCompiler = compiler_1.JitCompiler;
    tslib_1.__exportStar(require("@angular/compiler/src/compile_reflector"), exports);
    tslib_1.__exportStar(require("@angular/compiler/src/url_resolver"), exports);
    tslib_1.__exportStar(require("@angular/compiler/src/resource_loader"), exports);
    var constant_pool_1 = require("@angular/compiler/src/constant_pool");
    exports.ConstantPool = constant_pool_1.ConstantPool;
    var directive_resolver_1 = require("@angular/compiler/src/directive_resolver");
    exports.DirectiveResolver = directive_resolver_1.DirectiveResolver;
    var pipe_resolver_1 = require("@angular/compiler/src/pipe_resolver");
    exports.PipeResolver = pipe_resolver_1.PipeResolver;
    var ng_module_resolver_1 = require("@angular/compiler/src/ng_module_resolver");
    exports.NgModuleResolver = ng_module_resolver_1.NgModuleResolver;
    var interpolation_config_1 = require("@angular/compiler/src/ml_parser/interpolation_config");
    exports.DEFAULT_INTERPOLATION_CONFIG = interpolation_config_1.DEFAULT_INTERPOLATION_CONFIG;
    exports.InterpolationConfig = interpolation_config_1.InterpolationConfig;
    tslib_1.__exportStar(require("@angular/compiler/src/schema/element_schema_registry"), exports);
    tslib_1.__exportStar(require("@angular/compiler/src/i18n/index"), exports);
    tslib_1.__exportStar(require("@angular/compiler/src/directive_normalizer"), exports);
    tslib_1.__exportStar(require("@angular/compiler/src/expression_parser/ast"), exports);
    tslib_1.__exportStar(require("@angular/compiler/src/expression_parser/lexer"), exports);
    tslib_1.__exportStar(require("@angular/compiler/src/expression_parser/parser"), exports);
    tslib_1.__exportStar(require("@angular/compiler/src/metadata_resolver"), exports);
    tslib_1.__exportStar(require("@angular/compiler/src/ml_parser/ast"), exports);
    tslib_1.__exportStar(require("@angular/compiler/src/ml_parser/html_parser"), exports);
    tslib_1.__exportStar(require("@angular/compiler/src/ml_parser/html_tags"), exports);
    tslib_1.__exportStar(require("@angular/compiler/src/ml_parser/interpolation_config"), exports);
    tslib_1.__exportStar(require("@angular/compiler/src/ml_parser/tags"), exports);
    var ng_module_compiler_1 = require("@angular/compiler/src/ng_module_compiler");
    exports.NgModuleCompiler = ng_module_compiler_1.NgModuleCompiler;
    var output_ast_1 = require("@angular/compiler/src/output/output_ast");
    exports.ArrayType = output_ast_1.ArrayType;
    exports.AssertNotNull = output_ast_1.AssertNotNull;
    exports.DYNAMIC_TYPE = output_ast_1.DYNAMIC_TYPE;
    exports.BinaryOperator = output_ast_1.BinaryOperator;
    exports.BinaryOperatorExpr = output_ast_1.BinaryOperatorExpr;
    exports.BuiltinMethod = output_ast_1.BuiltinMethod;
    exports.BuiltinType = output_ast_1.BuiltinType;
    exports.BuiltinTypeName = output_ast_1.BuiltinTypeName;
    exports.BuiltinVar = output_ast_1.BuiltinVar;
    exports.CastExpr = output_ast_1.CastExpr;
    exports.ClassField = output_ast_1.ClassField;
    exports.ClassMethod = output_ast_1.ClassMethod;
    exports.ClassStmt = output_ast_1.ClassStmt;
    exports.CommaExpr = output_ast_1.CommaExpr;
    exports.CommentStmt = output_ast_1.CommentStmt;
    exports.ConditionalExpr = output_ast_1.ConditionalExpr;
    exports.DeclareFunctionStmt = output_ast_1.DeclareFunctionStmt;
    exports.DeclareVarStmt = output_ast_1.DeclareVarStmt;
    exports.Expression = output_ast_1.Expression;
    exports.ExpressionStatement = output_ast_1.ExpressionStatement;
    exports.ExpressionType = output_ast_1.ExpressionType;
    exports.ExternalExpr = output_ast_1.ExternalExpr;
    exports.ExternalReference = output_ast_1.ExternalReference;
    exports.literalMap = output_ast_1.literalMap;
    exports.FunctionExpr = output_ast_1.FunctionExpr;
    exports.IfStmt = output_ast_1.IfStmt;
    exports.InstantiateExpr = output_ast_1.InstantiateExpr;
    exports.InvokeFunctionExpr = output_ast_1.InvokeFunctionExpr;
    exports.InvokeMethodExpr = output_ast_1.InvokeMethodExpr;
    exports.JSDocCommentStmt = output_ast_1.JSDocCommentStmt;
    exports.LiteralArrayExpr = output_ast_1.LiteralArrayExpr;
    exports.LiteralExpr = output_ast_1.LiteralExpr;
    exports.LiteralMapExpr = output_ast_1.LiteralMapExpr;
    exports.MapType = output_ast_1.MapType;
    exports.NotExpr = output_ast_1.NotExpr;
    exports.ReadKeyExpr = output_ast_1.ReadKeyExpr;
    exports.ReadPropExpr = output_ast_1.ReadPropExpr;
    exports.ReadVarExpr = output_ast_1.ReadVarExpr;
    exports.ReturnStatement = output_ast_1.ReturnStatement;
    exports.ThrowStmt = output_ast_1.ThrowStmt;
    exports.TryCatchStmt = output_ast_1.TryCatchStmt;
    exports.Type = output_ast_1.Type;
    exports.WrappedNodeExpr = output_ast_1.WrappedNodeExpr;
    exports.WriteKeyExpr = output_ast_1.WriteKeyExpr;
    exports.WritePropExpr = output_ast_1.WritePropExpr;
    exports.WriteVarExpr = output_ast_1.WriteVarExpr;
    exports.StmtModifier = output_ast_1.StmtModifier;
    exports.Statement = output_ast_1.Statement;
    exports.TypeofExpr = output_ast_1.TypeofExpr;
    exports.collectExternalReferences = output_ast_1.collectExternalReferences;
    var abstract_emitter_1 = require("@angular/compiler/src/output/abstract_emitter");
    exports.EmitterVisitorContext = abstract_emitter_1.EmitterVisitorContext;
    var output_jit_1 = require("@angular/compiler/src/output/output_jit");
    exports.JitEvaluator = output_jit_1.JitEvaluator;
    tslib_1.__exportStar(require("@angular/compiler/src/output/ts_emitter"), exports);
    tslib_1.__exportStar(require("@angular/compiler/src/parse_util"), exports);
    tslib_1.__exportStar(require("@angular/compiler/src/schema/dom_element_schema_registry"), exports);
    tslib_1.__exportStar(require("@angular/compiler/src/selector"), exports);
    tslib_1.__exportStar(require("@angular/compiler/src/style_compiler"), exports);
    tslib_1.__exportStar(require("@angular/compiler/src/template_parser/template_parser"), exports);
    var view_compiler_1 = require("@angular/compiler/src/view_compiler/view_compiler");
    exports.ViewCompiler = view_compiler_1.ViewCompiler;
    exports.findStaticQueryIds = view_compiler_1.findStaticQueryIds;
    exports.staticViewQueryIds = view_compiler_1.staticViewQueryIds;
    var util_3 = require("@angular/compiler/src/util");
    exports.getParseErrors = util_3.getParseErrors;
    exports.isSyntaxError = util_3.isSyntaxError;
    exports.syntaxError = util_3.syntaxError;
    exports.Version = util_3.Version;
    tslib_1.__exportStar(require("@angular/compiler/src/injectable_compiler_2"), exports);
    var r3_ast_1 = require("@angular/compiler/src/render3/r3_ast");
    exports.TmplAstBoundAttribute = r3_ast_1.BoundAttribute;
    exports.TmplAstBoundEvent = r3_ast_1.BoundEvent;
    exports.TmplAstBoundText = r3_ast_1.BoundText;
    exports.TmplAstContent = r3_ast_1.Content;
    exports.TmplAstElement = r3_ast_1.Element;
    exports.TmplAstReference = r3_ast_1.Reference;
    exports.TmplAstTemplate = r3_ast_1.Template;
    exports.TmplAstText = r3_ast_1.Text;
    exports.TmplAstTextAttribute = r3_ast_1.TextAttribute;
    exports.TmplAstVariable = r3_ast_1.Variable;
    tslib_1.__exportStar(require("@angular/compiler/src/render3/view/t2_binder"), exports);
    var r3_identifiers_1 = require("@angular/compiler/src/render3/r3_identifiers");
    exports.R3Identifiers = r3_identifiers_1.Identifiers;
    var r3_factory_1 = require("@angular/compiler/src/render3/r3_factory");
    exports.R3ResolvedDependencyType = r3_factory_1.R3ResolvedDependencyType;
    var r3_module_compiler_1 = require("@angular/compiler/src/render3/r3_module_compiler");
    exports.compileInjector = r3_module_compiler_1.compileInjector;
    exports.compileNgModule = r3_module_compiler_1.compileNgModule;
    var r3_pipe_compiler_1 = require("@angular/compiler/src/render3/r3_pipe_compiler");
    exports.compilePipeFromMetadata = r3_pipe_compiler_1.compilePipeFromMetadata;
    var template_1 = require("@angular/compiler/src/render3/view/template");
    exports.makeBindingParser = template_1.makeBindingParser;
    exports.parseTemplate = template_1.parseTemplate;
    var compiler_2 = require("@angular/compiler/src/render3/view/compiler");
    exports.compileBaseDefFromMetadata = compiler_2.compileBaseDefFromMetadata;
    exports.compileComponentFromMetadata = compiler_2.compileComponentFromMetadata;
    exports.compileDirectiveFromMetadata = compiler_2.compileDirectiveFromMetadata;
    exports.parseHostBindings = compiler_2.parseHostBindings;
    exports.verifyHostBindings = compiler_2.verifyHostBindings;
    var jit_compiler_facade_2 = require("@angular/compiler/src/jit_compiler_facade");
    exports.publishFacade = jit_compiler_facade_2.publishFacade;
    // This file only reexports content of the `src` folder. Keep it that way.
    // This function call has a global side effects and publishes the compiler into global namespace for
    // the late binding of the Compiler to the @angular/core for jit compilation.
    jit_compiler_facade_1.publishFacade(util_1.global);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvY29tcGlsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7O0lBRUgsc0NBQXNDO0lBQ3RDLHNDQUFzQztJQUN0QyxzQ0FBc0M7SUFDdEMsc0NBQXNDO0lBRXRDOzs7Ozs7Ozs7Ozs7OztPQWNHO0lBRUgsaURBQStCO0lBSXZCLG9CQUFJO0lBSFosaUZBQW9EO0lBQ3BELG1EQUE4QjtJQUk5Qix3RUFBMEI7SUFDMUIsNkZBQStDO0lBQy9DLHVEQUFvRTtJQUE1RCxrQ0FBQSxjQUFjLENBQUE7SUFBRSw4Q0FBQSwwQkFBMEIsQ0FBQTtJQUNsRCxpRkFBbUM7SUFDbkMscUZBQXVDO0lBQ3ZDLDZFQUErQjtJQUMvQixtRkFBcUM7SUFHckMsb0ZBQXNDO0lBRXRDLHFGQUF1QztJQUN2QyxrRkFBb0M7SUFDcEMsMkZBQTZDO0lBQzdDLHFGQUF1QztJQUN2Qyx1REFBZ0U7SUFBeEQsaUNBQUEsZUFBZSxDQUFBO0lBQUUscUNBQUEsbUJBQW1CLENBQUE7SUFFNUMseUVBQTJCO0lBQzNCLGlGQUFtQztJQUNuQyxpRUFBMEM7SUFBbEMsb0NBQUEsV0FBVyxDQUFBO0lBQ25CLCtEQUEyQztJQUFuQyxpQ0FBQSxXQUFXLENBQUE7SUFDbkIsa0ZBQW9DO0lBQ3BDLDZFQUErQjtJQUMvQixnRkFBa0M7SUFDbEMscUVBQTZDO0lBQXJDLHVDQUFBLFlBQVksQ0FBQTtJQUNwQiwrRUFBdUQ7SUFBL0MsaURBQUEsaUJBQWlCLENBQUE7SUFDekIscUVBQTZDO0lBQXJDLHVDQUFBLFlBQVksQ0FBQTtJQUNwQiwrRUFBc0Q7SUFBOUMsZ0RBQUEsZ0JBQWdCLENBQUE7SUFDeEIsNkZBQW1HO0lBQTNGLDhEQUFBLDRCQUE0QixDQUFBO0lBQUUscURBQUEsbUJBQW1CLENBQUE7SUFDekQsK0ZBQWlE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SUFBRSx3Q0FBQSxhQUFhLENBQXdCO0lBQUUsbUNBQUEsUUFBUSxDQUFtQjtJQUUvVSx1RkFBeUM7SUFDekMsK0VBQXNFO0lBQTlELHlDQUFBLFdBQVcsQ0FBaUI7SUFDcEMsdUVBQXVHO0lBQXRELGdEQUFBLHdCQUF3QixDQUFBO0lBQ3pFLHVGQUFzSDtJQUE5RywrQ0FBQSxlQUFlLENBQUE7SUFBRSwrQ0FBQSxlQUFlLENBQUE7SUFDeEMsbUZBQW1GO0lBQTNFLHFEQUFBLHVCQUF1QixDQUFBO0lBQy9CLHdFQUF5RTtJQUFqRSx1Q0FBQSxpQkFBaUIsQ0FBQTtJQUFFLG1DQUFBLGFBQWEsQ0FBQTtJQUV4Qyx3RUFBNk07SUFBck0sZ0RBQUEsMEJBQTBCLENBQUE7SUFBcUIsa0RBQUEsNEJBQTRCLENBQUE7SUFBRSxrREFBQSw0QkFBNEIsQ0FBQTtJQUFFLHVDQUFBLGlCQUFpQixDQUFBO0lBQXNCLHdDQUFBLGtCQUFrQixDQUFBO0lBQzVLLGlGQUFvRDtJQUE1Qyw4Q0FBQSxhQUFhLENBQUE7SUFDckIsMEVBQTBFO0lBRTFFLG9HQUFvRztJQUNwRyw2RUFBNkU7SUFDN0UsbUNBQWEsQ0FBQyxhQUFNLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFRISVMgRklMRSBIQVMgR0xPQkFMIFNJREUgRUZGRUNUIC8vXG4vLyAgICAgICAoc2VlIGJvdHRvbSBvZiBmaWxlKSAgICAgICAvL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuLyoqXG4gKiBAbW9kdWxlXG4gKiBAZGVzY3JpcHRpb25cbiAqIEVudHJ5IHBvaW50IGZvciBhbGwgQVBJcyBvZiB0aGUgY29tcGlsZXIgcGFja2FnZS5cbiAqXG4gKiA8ZGl2IGNsYXNzPVwiY2FsbG91dCBpcy1jcml0aWNhbFwiPlxuICogICA8aGVhZGVyPlVuc3RhYmxlIEFQSXM8L2hlYWRlcj5cbiAqICAgPHA+XG4gKiAgICAgQWxsIGNvbXBpbGVyIGFwaXMgYXJlIGN1cnJlbnRseSBjb25zaWRlcmVkIGV4cGVyaW1lbnRhbCBhbmQgcHJpdmF0ZSFcbiAqICAgPC9wPlxuICogICA8cD5cbiAqICAgICBXZSBleHBlY3QgdGhlIEFQSXMgaW4gdGhpcyBwYWNrYWdlIHRvIGtlZXAgb24gY2hhbmdpbmcuIERvIG5vdCByZWx5IG9uIHRoZW0uXG4gKiAgIDwvcD5cbiAqIDwvZGl2PlxuICovXG5cbmltcG9ydCAqIGFzIGNvcmUgZnJvbSAnLi9jb3JlJztcbmltcG9ydCB7cHVibGlzaEZhY2FkZX0gZnJvbSAnLi9qaXRfY29tcGlsZXJfZmFjYWRlJztcbmltcG9ydCB7Z2xvYmFsfSBmcm9tICcuL3V0aWwnO1xuXG5leHBvcnQge2NvcmV9O1xuXG5leHBvcnQgKiBmcm9tICcuL3ZlcnNpb24nO1xuZXhwb3J0ICogZnJvbSAnLi90ZW1wbGF0ZV9wYXJzZXIvdGVtcGxhdGVfYXN0JztcbmV4cG9ydCB7Q29tcGlsZXJDb25maWcsIHByZXNlcnZlV2hpdGVzcGFjZXNEZWZhdWx0fSBmcm9tICcuL2NvbmZpZyc7XG5leHBvcnQgKiBmcm9tICcuL2NvbXBpbGVfbWV0YWRhdGEnO1xuZXhwb3J0ICogZnJvbSAnLi9hb3QvY29tcGlsZXJfZmFjdG9yeSc7XG5leHBvcnQgKiBmcm9tICcuL2FvdC9jb21waWxlcic7XG5leHBvcnQgKiBmcm9tICcuL2FvdC9nZW5lcmF0ZWRfZmlsZSc7XG5leHBvcnQgKiBmcm9tICcuL2FvdC9jb21waWxlcl9vcHRpb25zJztcbmV4cG9ydCAqIGZyb20gJy4vYW90L2NvbXBpbGVyX2hvc3QnO1xuZXhwb3J0ICogZnJvbSAnLi9hb3QvZm9ybWF0dGVkX2Vycm9yJztcbmV4cG9ydCAqIGZyb20gJy4vYW90L3BhcnRpYWxfbW9kdWxlJztcbmV4cG9ydCAqIGZyb20gJy4vYW90L3N0YXRpY19yZWZsZWN0b3InO1xuZXhwb3J0ICogZnJvbSAnLi9hb3Qvc3RhdGljX3N5bWJvbCc7XG5leHBvcnQgKiBmcm9tICcuL2FvdC9zdGF0aWNfc3ltYm9sX3Jlc29sdmVyJztcbmV4cG9ydCAqIGZyb20gJy4vYW90L3N1bW1hcnlfcmVzb2x2ZXInO1xuZXhwb3J0IHtpc0xvd2VyZWRTeW1ib2wsIGNyZWF0ZUxvd2VyZWRTeW1ib2x9IGZyb20gJy4vYW90L3V0aWwnO1xuZXhwb3J0IHtMYXp5Um91dGV9IGZyb20gJy4vYW90L2xhenlfcm91dGVzJztcbmV4cG9ydCAqIGZyb20gJy4vYXN0X3BhdGgnO1xuZXhwb3J0ICogZnJvbSAnLi9zdW1tYXJ5X3Jlc29sdmVyJztcbmV4cG9ydCB7SWRlbnRpZmllcnN9IGZyb20gJy4vaWRlbnRpZmllcnMnO1xuZXhwb3J0IHtKaXRDb21waWxlcn0gZnJvbSAnLi9qaXQvY29tcGlsZXInO1xuZXhwb3J0ICogZnJvbSAnLi9jb21waWxlX3JlZmxlY3Rvcic7XG5leHBvcnQgKiBmcm9tICcuL3VybF9yZXNvbHZlcic7XG5leHBvcnQgKiBmcm9tICcuL3Jlc291cmNlX2xvYWRlcic7XG5leHBvcnQge0NvbnN0YW50UG9vbH0gZnJvbSAnLi9jb25zdGFudF9wb29sJztcbmV4cG9ydCB7RGlyZWN0aXZlUmVzb2x2ZXJ9IGZyb20gJy4vZGlyZWN0aXZlX3Jlc29sdmVyJztcbmV4cG9ydCB7UGlwZVJlc29sdmVyfSBmcm9tICcuL3BpcGVfcmVzb2x2ZXInO1xuZXhwb3J0IHtOZ01vZHVsZVJlc29sdmVyfSBmcm9tICcuL25nX21vZHVsZV9yZXNvbHZlcic7XG5leHBvcnQge0RFRkFVTFRfSU5URVJQT0xBVElPTl9DT05GSUcsIEludGVycG9sYXRpb25Db25maWd9IGZyb20gJy4vbWxfcGFyc2VyL2ludGVycG9sYXRpb25fY29uZmlnJztcbmV4cG9ydCAqIGZyb20gJy4vc2NoZW1hL2VsZW1lbnRfc2NoZW1hX3JlZ2lzdHJ5JztcbmV4cG9ydCAqIGZyb20gJy4vaTE4bi9pbmRleCc7XG5leHBvcnQgKiBmcm9tICcuL2RpcmVjdGl2ZV9ub3JtYWxpemVyJztcbmV4cG9ydCAqIGZyb20gJy4vZXhwcmVzc2lvbl9wYXJzZXIvYXN0JztcbmV4cG9ydCAqIGZyb20gJy4vZXhwcmVzc2lvbl9wYXJzZXIvbGV4ZXInO1xuZXhwb3J0ICogZnJvbSAnLi9leHByZXNzaW9uX3BhcnNlci9wYXJzZXInO1xuZXhwb3J0ICogZnJvbSAnLi9tZXRhZGF0YV9yZXNvbHZlcic7XG5leHBvcnQgKiBmcm9tICcuL21sX3BhcnNlci9hc3QnO1xuZXhwb3J0ICogZnJvbSAnLi9tbF9wYXJzZXIvaHRtbF9wYXJzZXInO1xuZXhwb3J0ICogZnJvbSAnLi9tbF9wYXJzZXIvaHRtbF90YWdzJztcbmV4cG9ydCAqIGZyb20gJy4vbWxfcGFyc2VyL2ludGVycG9sYXRpb25fY29uZmlnJztcbmV4cG9ydCAqIGZyb20gJy4vbWxfcGFyc2VyL3RhZ3MnO1xuZXhwb3J0IHtMZXhlclJhbmdlfSBmcm9tICcuL21sX3BhcnNlci9sZXhlcic7XG5leHBvcnQge05nTW9kdWxlQ29tcGlsZXJ9IGZyb20gJy4vbmdfbW9kdWxlX2NvbXBpbGVyJztcbmV4cG9ydCB7QXJyYXlUeXBlLCBBc3NlcnROb3ROdWxsLCBEWU5BTUlDX1RZUEUsIEJpbmFyeU9wZXJhdG9yLCBCaW5hcnlPcGVyYXRvckV4cHIsIEJ1aWx0aW5NZXRob2QsIEJ1aWx0aW5UeXBlLCBCdWlsdGluVHlwZU5hbWUsIEJ1aWx0aW5WYXIsIENhc3RFeHByLCBDbGFzc0ZpZWxkLCBDbGFzc01ldGhvZCwgQ2xhc3NTdG10LCBDb21tYUV4cHIsIENvbW1lbnRTdG10LCBDb25kaXRpb25hbEV4cHIsIERlY2xhcmVGdW5jdGlvblN0bXQsIERlY2xhcmVWYXJTdG10LCBFeHByZXNzaW9uLCBFeHByZXNzaW9uU3RhdGVtZW50LCBFeHByZXNzaW9uVHlwZSwgRXhwcmVzc2lvblZpc2l0b3IsIEV4dGVybmFsRXhwciwgRXh0ZXJuYWxSZWZlcmVuY2UsIGxpdGVyYWxNYXAsIEZ1bmN0aW9uRXhwciwgSWZTdG10LCBJbnN0YW50aWF0ZUV4cHIsIEludm9rZUZ1bmN0aW9uRXhwciwgSW52b2tlTWV0aG9kRXhwciwgSlNEb2NDb21tZW50U3RtdCwgTGl0ZXJhbEFycmF5RXhwciwgTGl0ZXJhbEV4cHIsIExpdGVyYWxNYXBFeHByLCBNYXBUeXBlLCBOb3RFeHByLCBSZWFkS2V5RXhwciwgUmVhZFByb3BFeHByLCBSZWFkVmFyRXhwciwgUmV0dXJuU3RhdGVtZW50LCBTdGF0ZW1lbnRWaXNpdG9yLCBUaHJvd1N0bXQsIFRyeUNhdGNoU3RtdCwgVHlwZSwgVHlwZVZpc2l0b3IsIFdyYXBwZWROb2RlRXhwciwgV3JpdGVLZXlFeHByLCBXcml0ZVByb3BFeHByLCBXcml0ZVZhckV4cHIsIFN0bXRNb2RpZmllciwgU3RhdGVtZW50LCBUeXBlb2ZFeHByLCBjb2xsZWN0RXh0ZXJuYWxSZWZlcmVuY2VzfSBmcm9tICcuL291dHB1dC9vdXRwdXRfYXN0JztcbmV4cG9ydCB7RW1pdHRlclZpc2l0b3JDb250ZXh0fSBmcm9tICcuL291dHB1dC9hYnN0cmFjdF9lbWl0dGVyJztcbmV4cG9ydCB7Sml0RXZhbHVhdG9yfSBmcm9tICcuL291dHB1dC9vdXRwdXRfaml0JztcbmV4cG9ydCAqIGZyb20gJy4vb3V0cHV0L3RzX2VtaXR0ZXInO1xuZXhwb3J0ICogZnJvbSAnLi9wYXJzZV91dGlsJztcbmV4cG9ydCAqIGZyb20gJy4vc2NoZW1hL2RvbV9lbGVtZW50X3NjaGVtYV9yZWdpc3RyeSc7XG5leHBvcnQgKiBmcm9tICcuL3NlbGVjdG9yJztcbmV4cG9ydCAqIGZyb20gJy4vc3R5bGVfY29tcGlsZXInO1xuZXhwb3J0ICogZnJvbSAnLi90ZW1wbGF0ZV9wYXJzZXIvdGVtcGxhdGVfcGFyc2VyJztcbmV4cG9ydCB7Vmlld0NvbXBpbGVyLCBmaW5kU3RhdGljUXVlcnlJZHMsIHN0YXRpY1ZpZXdRdWVyeUlkc30gZnJvbSAnLi92aWV3X2NvbXBpbGVyL3ZpZXdfY29tcGlsZXInO1xuZXhwb3J0IHtnZXRQYXJzZUVycm9ycywgaXNTeW50YXhFcnJvciwgc3ludGF4RXJyb3IsIFZlcnNpb259IGZyb20gJy4vdXRpbCc7XG5leHBvcnQge1NvdXJjZU1hcH0gZnJvbSAnLi9vdXRwdXQvc291cmNlX21hcCc7XG5leHBvcnQgKiBmcm9tICcuL2luamVjdGFibGVfY29tcGlsZXJfMic7XG5leHBvcnQgKiBmcm9tICcuL3JlbmRlcjMvdmlldy9hcGknO1xuZXhwb3J0IHtCb3VuZEF0dHJpYnV0ZSBhcyBUbXBsQXN0Qm91bmRBdHRyaWJ1dGUsIEJvdW5kRXZlbnQgYXMgVG1wbEFzdEJvdW5kRXZlbnQsIEJvdW5kVGV4dCBhcyBUbXBsQXN0Qm91bmRUZXh0LCBDb250ZW50IGFzIFRtcGxBc3RDb250ZW50LCBFbGVtZW50IGFzIFRtcGxBc3RFbGVtZW50LCBOb2RlIGFzIFRtcGxBc3ROb2RlLCBSZWZlcmVuY2UgYXMgVG1wbEFzdFJlZmVyZW5jZSwgVGVtcGxhdGUgYXMgVG1wbEFzdFRlbXBsYXRlLCBUZXh0IGFzIFRtcGxBc3RUZXh0LCBUZXh0QXR0cmlidXRlIGFzIFRtcGxBc3RUZXh0QXR0cmlidXRlLCBWYXJpYWJsZSBhcyBUbXBsQXN0VmFyaWFibGUsfSBmcm9tICcuL3JlbmRlcjMvcjNfYXN0JztcbmV4cG9ydCAqIGZyb20gJy4vcmVuZGVyMy92aWV3L3QyX2FwaSc7XG5leHBvcnQgKiBmcm9tICcuL3JlbmRlcjMvdmlldy90Ml9iaW5kZXInO1xuZXhwb3J0IHtJZGVudGlmaWVycyBhcyBSM0lkZW50aWZpZXJzfSBmcm9tICcuL3JlbmRlcjMvcjNfaWRlbnRpZmllcnMnO1xuZXhwb3J0IHtSM0RlcGVuZGVuY3lNZXRhZGF0YSwgUjNGYWN0b3J5TWV0YWRhdGEsIFIzUmVzb2x2ZWREZXBlbmRlbmN5VHlwZX0gZnJvbSAnLi9yZW5kZXIzL3IzX2ZhY3RvcnknO1xuZXhwb3J0IHtjb21waWxlSW5qZWN0b3IsIGNvbXBpbGVOZ01vZHVsZSwgUjNJbmplY3Rvck1ldGFkYXRhLCBSM05nTW9kdWxlTWV0YWRhdGF9IGZyb20gJy4vcmVuZGVyMy9yM19tb2R1bGVfY29tcGlsZXInO1xuZXhwb3J0IHtjb21waWxlUGlwZUZyb21NZXRhZGF0YSwgUjNQaXBlTWV0YWRhdGF9IGZyb20gJy4vcmVuZGVyMy9yM19waXBlX2NvbXBpbGVyJztcbmV4cG9ydCB7bWFrZUJpbmRpbmdQYXJzZXIsIHBhcnNlVGVtcGxhdGV9IGZyb20gJy4vcmVuZGVyMy92aWV3L3RlbXBsYXRlJztcbmV4cG9ydCB7UjNSZWZlcmVuY2V9IGZyb20gJy4vcmVuZGVyMy91dGlsJztcbmV4cG9ydCB7Y29tcGlsZUJhc2VEZWZGcm9tTWV0YWRhdGEsIFIzQmFzZVJlZk1ldGFEYXRhLCBjb21waWxlQ29tcG9uZW50RnJvbU1ldGFkYXRhLCBjb21waWxlRGlyZWN0aXZlRnJvbU1ldGFkYXRhLCBwYXJzZUhvc3RCaW5kaW5ncywgUGFyc2VkSG9zdEJpbmRpbmdzLCB2ZXJpZnlIb3N0QmluZGluZ3N9IGZyb20gJy4vcmVuZGVyMy92aWV3L2NvbXBpbGVyJztcbmV4cG9ydCB7cHVibGlzaEZhY2FkZX0gZnJvbSAnLi9qaXRfY29tcGlsZXJfZmFjYWRlJztcbi8vIFRoaXMgZmlsZSBvbmx5IHJlZXhwb3J0cyBjb250ZW50IG9mIHRoZSBgc3JjYCBmb2xkZXIuIEtlZXAgaXQgdGhhdCB3YXkuXG5cbi8vIFRoaXMgZnVuY3Rpb24gY2FsbCBoYXMgYSBnbG9iYWwgc2lkZSBlZmZlY3RzIGFuZCBwdWJsaXNoZXMgdGhlIGNvbXBpbGVyIGludG8gZ2xvYmFsIG5hbWVzcGFjZSBmb3Jcbi8vIHRoZSBsYXRlIGJpbmRpbmcgb2YgdGhlIENvbXBpbGVyIHRvIHRoZSBAYW5ndWxhci9jb3JlIGZvciBqaXQgY29tcGlsYXRpb24uXG5wdWJsaXNoRmFjYWRlKGdsb2JhbCk7Il19