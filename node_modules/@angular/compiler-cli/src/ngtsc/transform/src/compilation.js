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
        define("@angular/compiler-cli/src/ngtsc/transform/src/compilation", ["require", "exports", "tslib", "typescript", "@angular/compiler-cli/src/ngtsc/diagnostics", "@angular/compiler-cli/src/ngtsc/reflection", "@angular/compiler-cli/src/ngtsc/util/src/typescript", "@angular/compiler-cli/src/ngtsc/transform/src/api", "@angular/compiler-cli/src/ngtsc/transform/src/declaration"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var ts = require("typescript");
    var diagnostics_1 = require("@angular/compiler-cli/src/ngtsc/diagnostics");
    var reflection_1 = require("@angular/compiler-cli/src/ngtsc/reflection");
    var typescript_1 = require("@angular/compiler-cli/src/ngtsc/util/src/typescript");
    var api_1 = require("@angular/compiler-cli/src/ngtsc/transform/src/api");
    var declaration_1 = require("@angular/compiler-cli/src/ngtsc/transform/src/declaration");
    var EMPTY_ARRAY = [];
    /**
     * Manages a compilation of Ivy decorators into static fields across an entire ts.Program.
     *
     * The compilation is stateful - source files are analyzed and records of the operations that need
     * to be performed during the transform/emit process are maintained internally.
     */
    var IvyCompilation = /** @class */ (function () {
        /**
         * @param handlers array of `DecoratorHandler`s which will be executed against each class in the
         * program
         * @param checker TypeScript `TypeChecker` instance for the program
         * @param reflector `ReflectionHost` through which all reflection operations will be performed
         * @param coreImportsFrom a TypeScript `SourceFile` which exports symbols needed for Ivy imports
         * when compiling @angular/core, or `null` if the current program is not @angular/core. This is
         * `null` in most cases.
         */
        function IvyCompilation(handlers, checker, reflector, importRewriter, incrementalState, perf, sourceToFactorySymbols) {
            this.handlers = handlers;
            this.checker = checker;
            this.reflector = reflector;
            this.importRewriter = importRewriter;
            this.incrementalState = incrementalState;
            this.perf = perf;
            this.sourceToFactorySymbols = sourceToFactorySymbols;
            /**
             * Tracks classes which have been analyzed and found to have an Ivy decorator, and the
             * information recorded about them for later compilation.
             */
            this.ivyClasses = new Map();
            /**
             * Tracks factory information which needs to be generated.
             */
            /**
             * Tracks the `DtsFileTransformer`s for each TS file that needs .d.ts transformations.
             */
            this.dtsMap = new Map();
            this.reexportMap = new Map();
            this._diagnostics = [];
        }
        Object.defineProperty(IvyCompilation.prototype, "exportStatements", {
            get: function () { return this.reexportMap; },
            enumerable: true,
            configurable: true
        });
        IvyCompilation.prototype.analyzeSync = function (sf) { return this.analyze(sf, false); };
        IvyCompilation.prototype.analyzeAsync = function (sf) { return this.analyze(sf, true); };
        IvyCompilation.prototype.detectHandlersForClass = function (node) {
            var e_1, _a;
            // The first step is to reflect the decorators.
            var classDecorators = this.reflector.getDecoratorsOfDeclaration(node);
            var ivyClass = null;
            try {
                // Look through the DecoratorHandlers to see if any are relevant.
                for (var _b = tslib_1.__values(this.handlers), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var handler = _c.value;
                    // An adapter is relevant if it matches one of the decorators on the class.
                    var detected = handler.detect(node, classDecorators);
                    if (detected === undefined) {
                        // This handler didn't match.
                        continue;
                    }
                    var isPrimaryHandler = handler.precedence === api_1.HandlerPrecedence.PRIMARY;
                    var isWeakHandler = handler.precedence === api_1.HandlerPrecedence.WEAK;
                    var match = {
                        handler: handler,
                        analyzed: null, detected: detected,
                    };
                    if (ivyClass === null) {
                        // This is the first handler to match this class. This path is a fast path through which
                        // most classes will flow.
                        ivyClass = {
                            matchedHandlers: [match],
                            hasPrimaryHandler: isPrimaryHandler,
                            hasWeakHandlers: isWeakHandler,
                        };
                        this.ivyClasses.set(node, ivyClass);
                    }
                    else {
                        // This is at least the second handler to match this class. This is a slower path that some
                        // classes will go through, which validates that the set of decorators applied to the class
                        // is valid.
                        // Validate according to rules as follows:
                        //
                        // * WEAK handlers are removed if a non-WEAK handler matches.
                        // * Only one PRIMARY handler can match at a time. Any other PRIMARY handler matching a
                        //   class with an existing PRIMARY handler is an error.
                        if (!isWeakHandler && ivyClass.hasWeakHandlers) {
                            // The current handler is not a WEAK handler, but the class has other WEAK handlers.
                            // Remove them.
                            ivyClass.matchedHandlers = ivyClass.matchedHandlers.filter(function (field) { return field.handler.precedence !== api_1.HandlerPrecedence.WEAK; });
                            ivyClass.hasWeakHandlers = false;
                        }
                        else if (isWeakHandler && !ivyClass.hasWeakHandlers) {
                            // The current handler is a WEAK handler, but the class has non-WEAK handlers already.
                            // Drop the current one.
                            continue;
                        }
                        if (isPrimaryHandler && ivyClass.hasPrimaryHandler) {
                            // The class already has a PRIMARY handler, and another one just matched.
                            this._diagnostics.push({
                                category: ts.DiagnosticCategory.Error,
                                code: Number('-99' + diagnostics_1.ErrorCode.DECORATOR_COLLISION),
                                file: typescript_1.getSourceFile(node),
                                start: node.getStart(undefined, false),
                                length: node.getWidth(),
                                messageText: 'Two incompatible decorators on class',
                            });
                            this.ivyClasses.delete(node);
                            return null;
                        }
                        // Otherwise, it's safe to accept the multiple decorators here. Update some of the metadata
                        // regarding this class.
                        ivyClass.matchedHandlers.push(match);
                        ivyClass.hasPrimaryHandler = ivyClass.hasPrimaryHandler || isPrimaryHandler;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return ivyClass;
        };
        IvyCompilation.prototype.analyze = function (sf, preanalyze) {
            var _this = this;
            var promises = [];
            // This flag begins as true for the file. If even one handler is matched and does not explicitly
            // state that analysis/emit can be skipped, then the flag will be set to false.
            var allowSkipAnalysisAndEmit = true;
            var analyzeClass = function (node) {
                var e_2, _a;
                var ivyClass = _this.detectHandlersForClass(node);
                // If the class has no Ivy behavior (or had errors), skip it.
                if (ivyClass === null) {
                    return;
                }
                var _loop_1 = function (match) {
                    // The analyze() function will run the analysis phase of the handler.
                    var analyze = function () {
                        var _a;
                        var analyzeClassSpan = _this.perf.start('analyzeClass', node);
                        try {
                            match.analyzed = match.handler.analyze(node, match.detected.metadata);
                            if (match.analyzed.diagnostics !== undefined) {
                                (_a = _this._diagnostics).push.apply(_a, tslib_1.__spread(match.analyzed.diagnostics));
                            }
                            if (match.analyzed.factorySymbolName !== undefined &&
                                _this.sourceToFactorySymbols !== null &&
                                _this.sourceToFactorySymbols.has(sf.fileName)) {
                                _this.sourceToFactorySymbols.get(sf.fileName).add(match.analyzed.factorySymbolName);
                            }
                            // Update the allowSkipAnalysisAndEmit flag - it will only remain true if match.analyzed
                            // also explicitly specifies a value of true for the flag.
                            allowSkipAnalysisAndEmit =
                                allowSkipAnalysisAndEmit && (!!match.analyzed.allowSkipAnalysisAndEmit);
                        }
                        catch (err) {
                            if (err instanceof diagnostics_1.FatalDiagnosticError) {
                                _this._diagnostics.push(err.toDiagnostic());
                            }
                            else {
                                throw err;
                            }
                        }
                        finally {
                            _this.perf.stop(analyzeClassSpan);
                        }
                    };
                    // If preanalysis was requested and a preanalysis step exists, then run preanalysis.
                    // Otherwise, skip directly to analysis.
                    if (preanalyze && match.handler.preanalyze !== undefined) {
                        // Preanalysis might return a Promise, indicating an async operation was necessary. Or it
                        // might return undefined, indicating no async step was needed and analysis can proceed
                        // immediately.
                        var preanalysis = match.handler.preanalyze(node, match.detected.metadata);
                        if (preanalysis !== undefined) {
                            // Await the results of preanalysis before running analysis.
                            promises.push(preanalysis.then(analyze));
                        }
                        else {
                            // No async preanalysis needed, skip directly to analysis.
                            analyze();
                        }
                    }
                    else {
                        // Not in preanalysis mode or not needed for this handler, skip directly to analysis.
                        analyze();
                    }
                };
                try {
                    // Loop through each matched handler that needs to be analyzed and analyze it, either
                    // synchronously or asynchronously.
                    for (var _b = tslib_1.__values(ivyClass.matchedHandlers), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var match = _c.value;
                        _loop_1(match);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            };
            var visit = function (node) {
                // Process nodes recursively, and look for class declarations with decorators.
                if (reflection_1.isNamedClassDeclaration(node)) {
                    analyzeClass(node);
                }
                ts.forEachChild(node, visit);
            };
            visit(sf);
            var updateIncrementalState = function () {
                if (allowSkipAnalysisAndEmit) {
                    _this.incrementalState.markFileAsSafeToSkipEmitIfUnchanged(sf);
                }
            };
            if (preanalyze && promises.length > 0) {
                return Promise.all(promises).then(function () {
                    updateIncrementalState();
                    return undefined;
                });
            }
            else {
                updateIncrementalState();
                return undefined;
            }
        };
        IvyCompilation.prototype.resolve = function () {
            var _this = this;
            var resolveSpan = this.perf.start('resolve');
            this.ivyClasses.forEach(function (ivyClass, node) {
                var e_3, _a, e_4, _b, _c;
                try {
                    for (var _d = tslib_1.__values(ivyClass.matchedHandlers), _e = _d.next(); !_e.done; _e = _d.next()) {
                        var match = _e.value;
                        if (match.handler.resolve !== undefined && match.analyzed !== null &&
                            match.analyzed.analysis !== undefined) {
                            var resolveClassSpan = _this.perf.start('resolveClass', node);
                            try {
                                var res = match.handler.resolve(node, match.analyzed.analysis);
                                if (res.reexports !== undefined) {
                                    var fileName = node.getSourceFile().fileName;
                                    if (!_this.reexportMap.has(fileName)) {
                                        _this.reexportMap.set(fileName, new Map());
                                    }
                                    var fileReexports = _this.reexportMap.get(fileName);
                                    try {
                                        for (var _f = tslib_1.__values(res.reexports), _g = _f.next(); !_g.done; _g = _f.next()) {
                                            var reexport = _g.value;
                                            fileReexports.set(reexport.asAlias, [reexport.fromModule, reexport.symbolName]);
                                        }
                                    }
                                    catch (e_4_1) { e_4 = { error: e_4_1 }; }
                                    finally {
                                        try {
                                            if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                                        }
                                        finally { if (e_4) throw e_4.error; }
                                    }
                                }
                                if (res.diagnostics !== undefined) {
                                    (_c = _this._diagnostics).push.apply(_c, tslib_1.__spread(res.diagnostics));
                                }
                            }
                            catch (err) {
                                if (err instanceof diagnostics_1.FatalDiagnosticError) {
                                    _this._diagnostics.push(err.toDiagnostic());
                                }
                                else {
                                    throw err;
                                }
                            }
                            finally {
                                _this.perf.stop(resolveClassSpan);
                            }
                        }
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            });
            this.perf.stop(resolveSpan);
        };
        IvyCompilation.prototype.typeCheck = function (context) {
            this.ivyClasses.forEach(function (ivyClass, node) {
                var e_5, _a;
                try {
                    for (var _b = tslib_1.__values(ivyClass.matchedHandlers), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var match = _c.value;
                        if (match.handler.typeCheck !== undefined && match.analyzed !== null &&
                            match.analyzed.analysis !== undefined) {
                            match.handler.typeCheck(context, node, match.analyzed.analysis);
                        }
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
            });
        };
        /**
         * Perform a compilation operation on the given class declaration and return instructions to an
         * AST transformer if any are available.
         */
        IvyCompilation.prototype.compileIvyFieldFor = function (node, constantPool) {
            var e_6, _a;
            // Look to see whether the original node was analyzed. If not, there's nothing to do.
            var original = ts.getOriginalNode(node);
            if (!reflection_1.isNamedClassDeclaration(original) || !this.ivyClasses.has(original)) {
                return undefined;
            }
            var ivyClass = this.ivyClasses.get(original);
            var res = [];
            try {
                for (var _b = tslib_1.__values(ivyClass.matchedHandlers), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var match = _c.value;
                    if (match.analyzed === null || match.analyzed.analysis === undefined) {
                        continue;
                    }
                    var compileSpan = this.perf.start('compileClass', original);
                    var compileMatchRes = match.handler.compile(node, match.analyzed.analysis, constantPool);
                    this.perf.stop(compileSpan);
                    if (!Array.isArray(compileMatchRes)) {
                        res.push(compileMatchRes);
                    }
                    else {
                        res.push.apply(res, tslib_1.__spread(compileMatchRes));
                    }
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_6) throw e_6.error; }
            }
            // Look up the .d.ts transformer for the input file and record that at least one field was
            // generated, which will allow the .d.ts to be transformed later.
            var fileName = original.getSourceFile().fileName;
            var dtsTransformer = this.getDtsTransformer(fileName);
            dtsTransformer.recordStaticField(reflection_1.reflectNameOfDeclaration(node), res);
            // Return the instruction to the transformer so the fields will be added.
            return res.length > 0 ? res : undefined;
        };
        /**
         * Lookup the `ts.Decorator` which triggered transformation of a particular class declaration.
         */
        IvyCompilation.prototype.ivyDecoratorsFor = function (node) {
            var e_7, _a;
            var original = ts.getOriginalNode(node);
            if (!reflection_1.isNamedClassDeclaration(original) || !this.ivyClasses.has(original)) {
                return EMPTY_ARRAY;
            }
            var ivyClass = this.ivyClasses.get(original);
            var decorators = [];
            try {
                for (var _b = tslib_1.__values(ivyClass.matchedHandlers), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var match = _c.value;
                    if (match.analyzed === null || match.analyzed.analysis === undefined) {
                        continue;
                    }
                    if (match.detected.trigger !== null && ts.isDecorator(match.detected.trigger)) {
                        decorators.push(match.detected.trigger);
                    }
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_7) throw e_7.error; }
            }
            return decorators;
        };
        /**
         * Process a declaration file and return a transformed version that incorporates the changes
         * made to the source file.
         */
        IvyCompilation.prototype.transformedDtsFor = function (file, context) {
            // No need to transform if it's not a declarations file, or if no changes have been requested
            // to the input file.
            // Due to the way TypeScript afterDeclarations transformers work, the SourceFile path is the
            // same as the original .ts.
            // The only way we know it's actually a declaration file is via the isDeclarationFile property.
            if (!file.isDeclarationFile || !this.dtsMap.has(file.fileName)) {
                return file;
            }
            // Return the transformed source.
            return this.dtsMap.get(file.fileName).transform(file, context);
        };
        Object.defineProperty(IvyCompilation.prototype, "diagnostics", {
            get: function () { return this._diagnostics; },
            enumerable: true,
            configurable: true
        });
        IvyCompilation.prototype.getDtsTransformer = function (tsFileName) {
            if (!this.dtsMap.has(tsFileName)) {
                this.dtsMap.set(tsFileName, new declaration_1.DtsFileTransformer(this.importRewriter));
            }
            return this.dtsMap.get(tsFileName);
        };
        return IvyCompilation;
    }());
    exports.IvyCompilation = IvyCompilation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL3RyYW5zZm9ybS9zcmMvY29tcGlsYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7O0lBR0gsK0JBQWlDO0lBRWpDLDJFQUFrRTtJQUlsRSx5RUFBcUg7SUFFckgsa0ZBQXdEO0lBRXhELHlFQUF1RztJQUN2Ryx5RkFBaUQ7SUFFakQsSUFBTSxXQUFXLEdBQVEsRUFBRSxDQUFDO0lBbUI1Qjs7Ozs7T0FLRztJQUNIO1FBb0JFOzs7Ozs7OztXQVFHO1FBQ0gsd0JBQ1ksUUFBc0MsRUFBVSxPQUF1QixFQUN2RSxTQUF5QixFQUFVLGNBQThCLEVBQ2pFLGdCQUFrQyxFQUFVLElBQWtCLEVBQzlELHNCQUFxRDtZQUhyRCxhQUFRLEdBQVIsUUFBUSxDQUE4QjtZQUFVLFlBQU8sR0FBUCxPQUFPLENBQWdCO1lBQ3ZFLGNBQVMsR0FBVCxTQUFTLENBQWdCO1lBQVUsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1lBQ2pFLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7WUFBVSxTQUFJLEdBQUosSUFBSSxDQUFjO1lBQzlELDJCQUFzQixHQUF0QixzQkFBc0IsQ0FBK0I7WUFoQ2pFOzs7ZUFHRztZQUNLLGVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBOEIsQ0FBQztZQUUzRDs7ZUFFRztZQUVIOztlQUVHO1lBQ0ssV0FBTSxHQUFHLElBQUksR0FBRyxFQUE4QixDQUFDO1lBRS9DLGdCQUFXLEdBQUcsSUFBSSxHQUFHLEVBQXlDLENBQUM7WUFDL0QsaUJBQVksR0FBb0IsRUFBRSxDQUFDO1FBZ0J5QixDQUFDO1FBR3JFLHNCQUFJLDRDQUFnQjtpQkFBcEIsY0FBcUUsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQzs7O1dBQUE7UUFF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QWlCLEdBQXpCLFVBQTBCLFVBQWtCO1lBQzFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRTtnQkFDaEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLElBQUksZ0NBQWtCLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7YUFDMUU7WUFDRCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBRyxDQUFDO1FBQ3ZDLENBQUM7UUFDSCxxQkFBQztJQUFELENBQUMsQUF6V0QsSUF5V0M7SUF6V1ksd0NBQWMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29uc3RhbnRQb29sfSBmcm9tICdAYW5ndWxhci9jb21waWxlcic7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuaW1wb3J0IHtFcnJvckNvZGUsIEZhdGFsRGlhZ25vc3RpY0Vycm9yfSBmcm9tICcuLi8uLi9kaWFnbm9zdGljcyc7XG5pbXBvcnQge0ltcG9ydFJld3JpdGVyfSBmcm9tICcuLi8uLi9pbXBvcnRzJztcbmltcG9ydCB7SW5jcmVtZW50YWxTdGF0ZX0gZnJvbSAnLi4vLi4vaW5jcmVtZW50YWwnO1xuaW1wb3J0IHtQZXJmUmVjb3JkZXJ9IGZyb20gJy4uLy4uL3BlcmYnO1xuaW1wb3J0IHtDbGFzc0RlY2xhcmF0aW9uLCBSZWZsZWN0aW9uSG9zdCwgaXNOYW1lZENsYXNzRGVjbGFyYXRpb24sIHJlZmxlY3ROYW1lT2ZEZWNsYXJhdGlvbn0gZnJvbSAnLi4vLi4vcmVmbGVjdGlvbic7XG5pbXBvcnQge1R5cGVDaGVja0NvbnRleHR9IGZyb20gJy4uLy4uL3R5cGVjaGVjayc7XG5pbXBvcnQge2dldFNvdXJjZUZpbGV9IGZyb20gJy4uLy4uL3V0aWwvc3JjL3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge0FuYWx5c2lzT3V0cHV0LCBDb21waWxlUmVzdWx0LCBEZWNvcmF0b3JIYW5kbGVyLCBEZXRlY3RSZXN1bHQsIEhhbmRsZXJQcmVjZWRlbmNlfSBmcm9tICcuL2FwaSc7XG5pbXBvcnQge0R0c0ZpbGVUcmFuc2Zvcm1lcn0gZnJvbSAnLi9kZWNsYXJhdGlvbic7XG5cbmNvbnN0IEVNUFRZX0FSUkFZOiBhbnkgPSBbXTtcblxuLyoqXG4gKiBSZWNvcmQgb2YgYW4gYWRhcHRlciB3aGljaCBkZWNpZGVkIHRvIGVtaXQgYSBzdGF0aWMgZmllbGQsIGFuZCB0aGUgYW5hbHlzaXMgaXQgcGVyZm9ybWVkIHRvXG4gKiBwcmVwYXJlIGZvciB0aGF0IG9wZXJhdGlvbi5cbiAqL1xuaW50ZXJmYWNlIE1hdGNoZWRIYW5kbGVyPEEsIE0+IHtcbiAgaGFuZGxlcjogRGVjb3JhdG9ySGFuZGxlcjxBLCBNPjtcbiAgYW5hbHl6ZWQ6IEFuYWx5c2lzT3V0cHV0PEE+fG51bGw7XG4gIGRldGVjdGVkOiBEZXRlY3RSZXN1bHQ8TT47XG59XG5cbmludGVyZmFjZSBJdnlDbGFzcyB7XG4gIG1hdGNoZWRIYW5kbGVyczogTWF0Y2hlZEhhbmRsZXI8YW55LCBhbnk+W107XG5cbiAgaGFzV2Vha0hhbmRsZXJzOiBib29sZWFuO1xuICBoYXNQcmltYXJ5SGFuZGxlcjogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBNYW5hZ2VzIGEgY29tcGlsYXRpb24gb2YgSXZ5IGRlY29yYXRvcnMgaW50byBzdGF0aWMgZmllbGRzIGFjcm9zcyBhbiBlbnRpcmUgdHMuUHJvZ3JhbS5cbiAqXG4gKiBUaGUgY29tcGlsYXRpb24gaXMgc3RhdGVmdWwgLSBzb3VyY2UgZmlsZXMgYXJlIGFuYWx5emVkIGFuZCByZWNvcmRzIG9mIHRoZSBvcGVyYXRpb25zIHRoYXQgbmVlZFxuICogdG8gYmUgcGVyZm9ybWVkIGR1cmluZyB0aGUgdHJhbnNmb3JtL2VtaXQgcHJvY2VzcyBhcmUgbWFpbnRhaW5lZCBpbnRlcm5hbGx5LlxuICovXG5leHBvcnQgY2xhc3MgSXZ5Q29tcGlsYXRpb24ge1xuICAvKipcbiAgICogVHJhY2tzIGNsYXNzZXMgd2hpY2ggaGF2ZSBiZWVuIGFuYWx5emVkIGFuZCBmb3VuZCB0byBoYXZlIGFuIEl2eSBkZWNvcmF0b3IsIGFuZCB0aGVcbiAgICogaW5mb3JtYXRpb24gcmVjb3JkZWQgYWJvdXQgdGhlbSBmb3IgbGF0ZXIgY29tcGlsYXRpb24uXG4gICAqL1xuICBwcml2YXRlIGl2eUNsYXNzZXMgPSBuZXcgTWFwPENsYXNzRGVjbGFyYXRpb24sIEl2eUNsYXNzPigpO1xuXG4gIC8qKlxuICAgKiBUcmFja3MgZmFjdG9yeSBpbmZvcm1hdGlvbiB3aGljaCBuZWVkcyB0byBiZSBnZW5lcmF0ZWQuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBUcmFja3MgdGhlIGBEdHNGaWxlVHJhbnNmb3JtZXJgcyBmb3IgZWFjaCBUUyBmaWxlIHRoYXQgbmVlZHMgLmQudHMgdHJhbnNmb3JtYXRpb25zLlxuICAgKi9cbiAgcHJpdmF0ZSBkdHNNYXAgPSBuZXcgTWFwPHN0cmluZywgRHRzRmlsZVRyYW5zZm9ybWVyPigpO1xuXG4gIHByaXZhdGUgcmVleHBvcnRNYXAgPSBuZXcgTWFwPHN0cmluZywgTWFwPHN0cmluZywgW3N0cmluZywgc3RyaW5nXT4+KCk7XG4gIHByaXZhdGUgX2RpYWdub3N0aWNzOiB0cy5EaWFnbm9zdGljW10gPSBbXTtcblxuXG4gIC8qKlxuICAgKiBAcGFyYW0gaGFuZGxlcnMgYXJyYXkgb2YgYERlY29yYXRvckhhbmRsZXJgcyB3aGljaCB3aWxsIGJlIGV4ZWN1dGVkIGFnYWluc3QgZWFjaCBjbGFzcyBpbiB0aGVcbiAgICogcHJvZ3JhbVxuICAgKiBAcGFyYW0gY2hlY2tlciBUeXBlU2NyaXB0IGBUeXBlQ2hlY2tlcmAgaW5zdGFuY2UgZm9yIHRoZSBwcm9ncmFtXG4gICAqIEBwYXJhbSByZWZsZWN0b3IgYFJlZmxlY3Rpb25Ib3N0YCB0aHJvdWdoIHdoaWNoIGFsbCByZWZsZWN0aW9uIG9wZXJhdGlvbnMgd2lsbCBiZSBwZXJmb3JtZWRcbiAgICogQHBhcmFtIGNvcmVJbXBvcnRzRnJvbSBhIFR5cGVTY3JpcHQgYFNvdXJjZUZpbGVgIHdoaWNoIGV4cG9ydHMgc3ltYm9scyBuZWVkZWQgZm9yIEl2eSBpbXBvcnRzXG4gICAqIHdoZW4gY29tcGlsaW5nIEBhbmd1bGFyL2NvcmUsIG9yIGBudWxsYCBpZiB0aGUgY3VycmVudCBwcm9ncmFtIGlzIG5vdCBAYW5ndWxhci9jb3JlLiBUaGlzIGlzXG4gICAqIGBudWxsYCBpbiBtb3N0IGNhc2VzLlxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIGhhbmRsZXJzOiBEZWNvcmF0b3JIYW5kbGVyPGFueSwgYW55PltdLCBwcml2YXRlIGNoZWNrZXI6IHRzLlR5cGVDaGVja2VyLFxuICAgICAgcHJpdmF0ZSByZWZsZWN0b3I6IFJlZmxlY3Rpb25Ib3N0LCBwcml2YXRlIGltcG9ydFJld3JpdGVyOiBJbXBvcnRSZXdyaXRlcixcbiAgICAgIHByaXZhdGUgaW5jcmVtZW50YWxTdGF0ZTogSW5jcmVtZW50YWxTdGF0ZSwgcHJpdmF0ZSBwZXJmOiBQZXJmUmVjb3JkZXIsXG4gICAgICBwcml2YXRlIHNvdXJjZVRvRmFjdG9yeVN5bWJvbHM6IE1hcDxzdHJpbmcsIFNldDxzdHJpbmc+PnxudWxsKSB7fVxuXG5cbiAgZ2V0IGV4cG9ydFN0YXRlbWVudHMoKTogTWFwPHN0cmluZywgTWFwPHN0cmluZywgW3N0cmluZywgc3RyaW5nXT4+IHsgcmV0dXJuIHRoaXMucmVleHBvcnRNYXA7IH1cblxuICBhbmFseXplU3luYyhzZjogdHMuU291cmNlRmlsZSk6IHZvaWQgeyByZXR1cm4gdGhpcy5hbmFseXplKHNmLCBmYWxzZSk7IH1cblxuICBhbmFseXplQXN5bmMoc2Y6IHRzLlNvdXJjZUZpbGUpOiBQcm9taXNlPHZvaWQ+fHVuZGVmaW5lZCB7IHJldHVybiB0aGlzLmFuYWx5emUoc2YsIHRydWUpOyB9XG5cbiAgcHJpdmF0ZSBkZXRlY3RIYW5kbGVyc0ZvckNsYXNzKG5vZGU6IENsYXNzRGVjbGFyYXRpb24pOiBJdnlDbGFzc3xudWxsIHtcbiAgICAvLyBUaGUgZmlyc3Qgc3RlcCBpcyB0byByZWZsZWN0IHRoZSBkZWNvcmF0b3JzLlxuICAgIGNvbnN0IGNsYXNzRGVjb3JhdG9ycyA9IHRoaXMucmVmbGVjdG9yLmdldERlY29yYXRvcnNPZkRlY2xhcmF0aW9uKG5vZGUpO1xuICAgIGxldCBpdnlDbGFzczogSXZ5Q2xhc3N8bnVsbCA9IG51bGw7XG5cbiAgICAvLyBMb29rIHRocm91Z2ggdGhlIERlY29yYXRvckhhbmRsZXJzIHRvIHNlZSBpZiBhbnkgYXJlIHJlbGV2YW50LlxuICAgIGZvciAoY29uc3QgaGFuZGxlciBvZiB0aGlzLmhhbmRsZXJzKSB7XG4gICAgICAvLyBBbiBhZGFwdGVyIGlzIHJlbGV2YW50IGlmIGl0IG1hdGNoZXMgb25lIG9mIHRoZSBkZWNvcmF0b3JzIG9uIHRoZSBjbGFzcy5cbiAgICAgIGNvbnN0IGRldGVjdGVkID0gaGFuZGxlci5kZXRlY3Qobm9kZSwgY2xhc3NEZWNvcmF0b3JzKTtcbiAgICAgIGlmIChkZXRlY3RlZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIFRoaXMgaGFuZGxlciBkaWRuJ3QgbWF0Y2guXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBpc1ByaW1hcnlIYW5kbGVyID0gaGFuZGxlci5wcmVjZWRlbmNlID09PSBIYW5kbGVyUHJlY2VkZW5jZS5QUklNQVJZO1xuICAgICAgY29uc3QgaXNXZWFrSGFuZGxlciA9IGhhbmRsZXIucHJlY2VkZW5jZSA9PT0gSGFuZGxlclByZWNlZGVuY2UuV0VBSztcbiAgICAgIGNvbnN0IG1hdGNoID0ge1xuICAgICAgICBoYW5kbGVyLFxuICAgICAgICBhbmFseXplZDogbnVsbCwgZGV0ZWN0ZWQsXG4gICAgICB9O1xuXG4gICAgICBpZiAoaXZ5Q2xhc3MgPT09IG51bGwpIHtcbiAgICAgICAgLy8gVGhpcyBpcyB0aGUgZmlyc3QgaGFuZGxlciB0byBtYXRjaCB0aGlzIGNsYXNzLiBUaGlzIHBhdGggaXMgYSBmYXN0IHBhdGggdGhyb3VnaCB3aGljaFxuICAgICAgICAvLyBtb3N0IGNsYXNzZXMgd2lsbCBmbG93LlxuICAgICAgICBpdnlDbGFzcyA9IHtcbiAgICAgICAgICBtYXRjaGVkSGFuZGxlcnM6IFttYXRjaF0sXG4gICAgICAgICAgaGFzUHJpbWFyeUhhbmRsZXI6IGlzUHJpbWFyeUhhbmRsZXIsXG4gICAgICAgICAgaGFzV2Vha0hhbmRsZXJzOiBpc1dlYWtIYW5kbGVyLFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLml2eUNsYXNzZXMuc2V0KG5vZGUsIGl2eUNsYXNzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRoaXMgaXMgYXQgbGVhc3QgdGhlIHNlY29uZCBoYW5kbGVyIHRvIG1hdGNoIHRoaXMgY2xhc3MuIFRoaXMgaXMgYSBzbG93ZXIgcGF0aCB0aGF0IHNvbWVcbiAgICAgICAgLy8gY2xhc3NlcyB3aWxsIGdvIHRocm91Z2gsIHdoaWNoIHZhbGlkYXRlcyB0aGF0IHRoZSBzZXQgb2YgZGVjb3JhdG9ycyBhcHBsaWVkIHRvIHRoZSBjbGFzc1xuICAgICAgICAvLyBpcyB2YWxpZC5cblxuICAgICAgICAvLyBWYWxpZGF0ZSBhY2NvcmRpbmcgdG8gcnVsZXMgYXMgZm9sbG93czpcbiAgICAgICAgLy9cbiAgICAgICAgLy8gKiBXRUFLIGhhbmRsZXJzIGFyZSByZW1vdmVkIGlmIGEgbm9uLVdFQUsgaGFuZGxlciBtYXRjaGVzLlxuICAgICAgICAvLyAqIE9ubHkgb25lIFBSSU1BUlkgaGFuZGxlciBjYW4gbWF0Y2ggYXQgYSB0aW1lLiBBbnkgb3RoZXIgUFJJTUFSWSBoYW5kbGVyIG1hdGNoaW5nIGFcbiAgICAgICAgLy8gICBjbGFzcyB3aXRoIGFuIGV4aXN0aW5nIFBSSU1BUlkgaGFuZGxlciBpcyBhbiBlcnJvci5cblxuICAgICAgICBpZiAoIWlzV2Vha0hhbmRsZXIgJiYgaXZ5Q2xhc3MuaGFzV2Vha0hhbmRsZXJzKSB7XG4gICAgICAgICAgLy8gVGhlIGN1cnJlbnQgaGFuZGxlciBpcyBub3QgYSBXRUFLIGhhbmRsZXIsIGJ1dCB0aGUgY2xhc3MgaGFzIG90aGVyIFdFQUsgaGFuZGxlcnMuXG4gICAgICAgICAgLy8gUmVtb3ZlIHRoZW0uXG4gICAgICAgICAgaXZ5Q2xhc3MubWF0Y2hlZEhhbmRsZXJzID0gaXZ5Q2xhc3MubWF0Y2hlZEhhbmRsZXJzLmZpbHRlcihcbiAgICAgICAgICAgICAgZmllbGQgPT4gZmllbGQuaGFuZGxlci5wcmVjZWRlbmNlICE9PSBIYW5kbGVyUHJlY2VkZW5jZS5XRUFLKTtcbiAgICAgICAgICBpdnlDbGFzcy5oYXNXZWFrSGFuZGxlcnMgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIGlmIChpc1dlYWtIYW5kbGVyICYmICFpdnlDbGFzcy5oYXNXZWFrSGFuZGxlcnMpIHtcbiAgICAgICAgICAvLyBUaGUgY3VycmVudCBoYW5kbGVyIGlzIGEgV0VBSyBoYW5kbGVyLCBidXQgdGhlIGNsYXNzIGhhcyBub24tV0VBSyBoYW5kbGVycyBhbHJlYWR5LlxuICAgICAgICAgIC8vIERyb3AgdGhlIGN1cnJlbnQgb25lLlxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzUHJpbWFyeUhhbmRsZXIgJiYgaXZ5Q2xhc3MuaGFzUHJpbWFyeUhhbmRsZXIpIHtcbiAgICAgICAgICAvLyBUaGUgY2xhc3MgYWxyZWFkeSBoYXMgYSBQUklNQVJZIGhhbmRsZXIsIGFuZCBhbm90aGVyIG9uZSBqdXN0IG1hdGNoZWQuXG4gICAgICAgICAgdGhpcy5fZGlhZ25vc3RpY3MucHVzaCh7XG4gICAgICAgICAgICBjYXRlZ29yeTogdHMuRGlhZ25vc3RpY0NhdGVnb3J5LkVycm9yLFxuICAgICAgICAgICAgY29kZTogTnVtYmVyKCctOTknICsgRXJyb3JDb2RlLkRFQ09SQVRPUl9DT0xMSVNJT04pLFxuICAgICAgICAgICAgZmlsZTogZ2V0U291cmNlRmlsZShub2RlKSxcbiAgICAgICAgICAgIHN0YXJ0OiBub2RlLmdldFN0YXJ0KHVuZGVmaW5lZCwgZmFsc2UpLFxuICAgICAgICAgICAgbGVuZ3RoOiBub2RlLmdldFdpZHRoKCksXG4gICAgICAgICAgICBtZXNzYWdlVGV4dDogJ1R3byBpbmNvbXBhdGlibGUgZGVjb3JhdG9ycyBvbiBjbGFzcycsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5pdnlDbGFzc2VzLmRlbGV0ZShub2RlKTtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE90aGVyd2lzZSwgaXQncyBzYWZlIHRvIGFjY2VwdCB0aGUgbXVsdGlwbGUgZGVjb3JhdG9ycyBoZXJlLiBVcGRhdGUgc29tZSBvZiB0aGUgbWV0YWRhdGFcbiAgICAgICAgLy8gcmVnYXJkaW5nIHRoaXMgY2xhc3MuXG4gICAgICAgIGl2eUNsYXNzLm1hdGNoZWRIYW5kbGVycy5wdXNoKG1hdGNoKTtcbiAgICAgICAgaXZ5Q2xhc3MuaGFzUHJpbWFyeUhhbmRsZXIgPSBpdnlDbGFzcy5oYXNQcmltYXJ5SGFuZGxlciB8fCBpc1ByaW1hcnlIYW5kbGVyO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBpdnlDbGFzcztcbiAgfVxuXG4gIC8qKlxuICAgKiBBbmFseXplIGEgc291cmNlIGZpbGUgYW5kIHByb2R1Y2UgZGlhZ25vc3RpY3MgZm9yIGl0IChpZiBhbnkpLlxuICAgKi9cbiAgcHJpdmF0ZSBhbmFseXplKHNmOiB0cy5Tb3VyY2VGaWxlLCBwcmVhbmFseXplOiBmYWxzZSk6IHVuZGVmaW5lZDtcbiAgcHJpdmF0ZSBhbmFseXplKHNmOiB0cy5Tb3VyY2VGaWxlLCBwcmVhbmFseXplOiB0cnVlKTogUHJvbWlzZTx2b2lkPnx1bmRlZmluZWQ7XG4gIHByaXZhdGUgYW5hbHl6ZShzZjogdHMuU291cmNlRmlsZSwgcHJlYW5hbHl6ZTogYm9vbGVhbik6IFByb21pc2U8dm9pZD58dW5kZWZpbmVkIHtcbiAgICBjb25zdCBwcm9taXNlczogUHJvbWlzZTx2b2lkPltdID0gW107XG5cbiAgICAvLyBUaGlzIGZsYWcgYmVnaW5zIGFzIHRydWUgZm9yIHRoZSBmaWxlLiBJZiBldmVuIG9uZSBoYW5kbGVyIGlzIG1hdGNoZWQgYW5kIGRvZXMgbm90IGV4cGxpY2l0bHlcbiAgICAvLyBzdGF0ZSB0aGF0IGFuYWx5c2lzL2VtaXQgY2FuIGJlIHNraXBwZWQsIHRoZW4gdGhlIGZsYWcgd2lsbCBiZSBzZXQgdG8gZmFsc2UuXG4gICAgbGV0IGFsbG93U2tpcEFuYWx5c2lzQW5kRW1pdCA9IHRydWU7XG5cbiAgICBjb25zdCBhbmFseXplQ2xhc3MgPSAobm9kZTogQ2xhc3NEZWNsYXJhdGlvbik6IHZvaWQgPT4ge1xuICAgICAgY29uc3QgaXZ5Q2xhc3MgPSB0aGlzLmRldGVjdEhhbmRsZXJzRm9yQ2xhc3Mobm9kZSk7XG5cbiAgICAgIC8vIElmIHRoZSBjbGFzcyBoYXMgbm8gSXZ5IGJlaGF2aW9yIChvciBoYWQgZXJyb3JzKSwgc2tpcCBpdC5cbiAgICAgIGlmIChpdnlDbGFzcyA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIExvb3AgdGhyb3VnaCBlYWNoIG1hdGNoZWQgaGFuZGxlciB0aGF0IG5lZWRzIHRvIGJlIGFuYWx5emVkIGFuZCBhbmFseXplIGl0LCBlaXRoZXJcbiAgICAgIC8vIHN5bmNocm9ub3VzbHkgb3IgYXN5bmNocm9ub3VzbHkuXG4gICAgICBmb3IgKGNvbnN0IG1hdGNoIG9mIGl2eUNsYXNzLm1hdGNoZWRIYW5kbGVycykge1xuICAgICAgICAvLyBUaGUgYW5hbHl6ZSgpIGZ1bmN0aW9uIHdpbGwgcnVuIHRoZSBhbmFseXNpcyBwaGFzZSBvZiB0aGUgaGFuZGxlci5cbiAgICAgICAgY29uc3QgYW5hbHl6ZSA9ICgpID0+IHtcbiAgICAgICAgICBjb25zdCBhbmFseXplQ2xhc3NTcGFuID0gdGhpcy5wZXJmLnN0YXJ0KCdhbmFseXplQ2xhc3MnLCBub2RlKTtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgbWF0Y2guYW5hbHl6ZWQgPSBtYXRjaC5oYW5kbGVyLmFuYWx5emUobm9kZSwgbWF0Y2guZGV0ZWN0ZWQubWV0YWRhdGEpO1xuXG4gICAgICAgICAgICBpZiAobWF0Y2guYW5hbHl6ZWQuZGlhZ25vc3RpY3MgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICB0aGlzLl9kaWFnbm9zdGljcy5wdXNoKC4uLm1hdGNoLmFuYWx5emVkLmRpYWdub3N0aWNzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG1hdGNoLmFuYWx5emVkLmZhY3RvcnlTeW1ib2xOYW1lICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgICAgICB0aGlzLnNvdXJjZVRvRmFjdG9yeVN5bWJvbHMgIT09IG51bGwgJiZcbiAgICAgICAgICAgICAgICB0aGlzLnNvdXJjZVRvRmFjdG9yeVN5bWJvbHMuaGFzKHNmLmZpbGVOYW1lKSkge1xuICAgICAgICAgICAgICB0aGlzLnNvdXJjZVRvRmFjdG9yeVN5bWJvbHMuZ2V0KHNmLmZpbGVOYW1lKSAhLmFkZChtYXRjaC5hbmFseXplZC5mYWN0b3J5U3ltYm9sTmFtZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgYWxsb3dTa2lwQW5hbHlzaXNBbmRFbWl0IGZsYWcgLSBpdCB3aWxsIG9ubHkgcmVtYWluIHRydWUgaWYgbWF0Y2guYW5hbHl6ZWRcbiAgICAgICAgICAgIC8vIGFsc28gZXhwbGljaXRseSBzcGVjaWZpZXMgYSB2YWx1ZSBvZiB0cnVlIGZvciB0aGUgZmxhZy5cbiAgICAgICAgICAgIGFsbG93U2tpcEFuYWx5c2lzQW5kRW1pdCA9XG4gICAgICAgICAgICAgICAgYWxsb3dTa2lwQW5hbHlzaXNBbmRFbWl0ICYmICghIW1hdGNoLmFuYWx5emVkLmFsbG93U2tpcEFuYWx5c2lzQW5kRW1pdCk7XG5cbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGlmIChlcnIgaW5zdGFuY2VvZiBGYXRhbERpYWdub3N0aWNFcnJvcikge1xuICAgICAgICAgICAgICB0aGlzLl9kaWFnbm9zdGljcy5wdXNoKGVyci50b0RpYWdub3N0aWMoKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRoaXMucGVyZi5zdG9wKGFuYWx5emVDbGFzc1NwYW4pO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyBJZiBwcmVhbmFseXNpcyB3YXMgcmVxdWVzdGVkIGFuZCBhIHByZWFuYWx5c2lzIHN0ZXAgZXhpc3RzLCB0aGVuIHJ1biBwcmVhbmFseXNpcy5cbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBza2lwIGRpcmVjdGx5IHRvIGFuYWx5c2lzLlxuICAgICAgICBpZiAocHJlYW5hbHl6ZSAmJiBtYXRjaC5oYW5kbGVyLnByZWFuYWx5emUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIC8vIFByZWFuYWx5c2lzIG1pZ2h0IHJldHVybiBhIFByb21pc2UsIGluZGljYXRpbmcgYW4gYXN5bmMgb3BlcmF0aW9uIHdhcyBuZWNlc3NhcnkuIE9yIGl0XG4gICAgICAgICAgLy8gbWlnaHQgcmV0dXJuIHVuZGVmaW5lZCwgaW5kaWNhdGluZyBubyBhc3luYyBzdGVwIHdhcyBuZWVkZWQgYW5kIGFuYWx5c2lzIGNhbiBwcm9jZWVkXG4gICAgICAgICAgLy8gaW1tZWRpYXRlbHkuXG4gICAgICAgICAgY29uc3QgcHJlYW5hbHlzaXMgPSBtYXRjaC5oYW5kbGVyLnByZWFuYWx5emUobm9kZSwgbWF0Y2guZGV0ZWN0ZWQubWV0YWRhdGEpO1xuICAgICAgICAgIGlmIChwcmVhbmFseXNpcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBBd2FpdCB0aGUgcmVzdWx0cyBvZiBwcmVhbmFseXNpcyBiZWZvcmUgcnVubmluZyBhbmFseXNpcy5cbiAgICAgICAgICAgIHByb21pc2VzLnB1c2gocHJlYW5hbHlzaXMudGhlbihhbmFseXplKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE5vIGFzeW5jIHByZWFuYWx5c2lzIG5lZWRlZCwgc2tpcCBkaXJlY3RseSB0byBhbmFseXNpcy5cbiAgICAgICAgICAgIGFuYWx5emUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gTm90IGluIHByZWFuYWx5c2lzIG1vZGUgb3Igbm90IG5lZWRlZCBmb3IgdGhpcyBoYW5kbGVyLCBza2lwIGRpcmVjdGx5IHRvIGFuYWx5c2lzLlxuICAgICAgICAgIGFuYWx5emUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCB2aXNpdCA9IChub2RlOiB0cy5Ob2RlKTogdm9pZCA9PiB7XG4gICAgICAvLyBQcm9jZXNzIG5vZGVzIHJlY3Vyc2l2ZWx5LCBhbmQgbG9vayBmb3IgY2xhc3MgZGVjbGFyYXRpb25zIHdpdGggZGVjb3JhdG9ycy5cbiAgICAgIGlmIChpc05hbWVkQ2xhc3NEZWNsYXJhdGlvbihub2RlKSkge1xuICAgICAgICBhbmFseXplQ2xhc3Mobm9kZSk7XG4gICAgICB9XG4gICAgICB0cy5mb3JFYWNoQ2hpbGQobm9kZSwgdmlzaXQpO1xuICAgIH07XG5cbiAgICB2aXNpdChzZik7XG5cbiAgICBjb25zdCB1cGRhdGVJbmNyZW1lbnRhbFN0YXRlID0gKCkgPT4ge1xuICAgICAgaWYgKGFsbG93U2tpcEFuYWx5c2lzQW5kRW1pdCkge1xuICAgICAgICB0aGlzLmluY3JlbWVudGFsU3RhdGUubWFya0ZpbGVBc1NhZmVUb1NraXBFbWl0SWZVbmNoYW5nZWQoc2YpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAocHJlYW5hbHl6ZSAmJiBwcm9taXNlcy5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oKCkgPT4ge1xuICAgICAgICB1cGRhdGVJbmNyZW1lbnRhbFN0YXRlKCk7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdXBkYXRlSW5jcmVtZW50YWxTdGF0ZSgpO1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICByZXNvbHZlKCk6IHZvaWQge1xuICAgIGNvbnN0IHJlc29sdmVTcGFuID0gdGhpcy5wZXJmLnN0YXJ0KCdyZXNvbHZlJyk7XG4gICAgdGhpcy5pdnlDbGFzc2VzLmZvckVhY2goKGl2eUNsYXNzLCBub2RlKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IG1hdGNoIG9mIGl2eUNsYXNzLm1hdGNoZWRIYW5kbGVycykge1xuICAgICAgICBpZiAobWF0Y2guaGFuZGxlci5yZXNvbHZlICE9PSB1bmRlZmluZWQgJiYgbWF0Y2guYW5hbHl6ZWQgIT09IG51bGwgJiZcbiAgICAgICAgICAgIG1hdGNoLmFuYWx5emVkLmFuYWx5c2lzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBjb25zdCByZXNvbHZlQ2xhc3NTcGFuID0gdGhpcy5wZXJmLnN0YXJ0KCdyZXNvbHZlQ2xhc3MnLCBub2RlKTtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmVzID0gbWF0Y2guaGFuZGxlci5yZXNvbHZlKG5vZGUsIG1hdGNoLmFuYWx5emVkLmFuYWx5c2lzKTtcbiAgICAgICAgICAgIGlmIChyZXMucmVleHBvcnRzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgY29uc3QgZmlsZU5hbWUgPSBub2RlLmdldFNvdXJjZUZpbGUoKS5maWxlTmFtZTtcbiAgICAgICAgICAgICAgaWYgKCF0aGlzLnJlZXhwb3J0TWFwLmhhcyhmaWxlTmFtZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlZXhwb3J0TWFwLnNldChmaWxlTmFtZSwgbmV3IE1hcDxzdHJpbmcsIFtzdHJpbmcsIHN0cmluZ10+KCkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGNvbnN0IGZpbGVSZWV4cG9ydHMgPSB0aGlzLnJlZXhwb3J0TWFwLmdldChmaWxlTmFtZSkgITtcbiAgICAgICAgICAgICAgZm9yIChjb25zdCByZWV4cG9ydCBvZiByZXMucmVleHBvcnRzKSB7XG4gICAgICAgICAgICAgICAgZmlsZVJlZXhwb3J0cy5zZXQocmVleHBvcnQuYXNBbGlhcywgW3JlZXhwb3J0LmZyb21Nb2R1bGUsIHJlZXhwb3J0LnN5bWJvbE5hbWVdKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJlcy5kaWFnbm9zdGljcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIHRoaXMuX2RpYWdub3N0aWNzLnB1c2goLi4ucmVzLmRpYWdub3N0aWNzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGlmIChlcnIgaW5zdGFuY2VvZiBGYXRhbERpYWdub3N0aWNFcnJvcikge1xuICAgICAgICAgICAgICB0aGlzLl9kaWFnbm9zdGljcy5wdXNoKGVyci50b0RpYWdub3N0aWMoKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRoaXMucGVyZi5zdG9wKHJlc29sdmVDbGFzc1NwYW4pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMucGVyZi5zdG9wKHJlc29sdmVTcGFuKTtcbiAgfVxuXG4gIHR5cGVDaGVjayhjb250ZXh0OiBUeXBlQ2hlY2tDb250ZXh0KTogdm9pZCB7XG4gICAgdGhpcy5pdnlDbGFzc2VzLmZvckVhY2goKGl2eUNsYXNzLCBub2RlKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IG1hdGNoIG9mIGl2eUNsYXNzLm1hdGNoZWRIYW5kbGVycykge1xuICAgICAgICBpZiAobWF0Y2guaGFuZGxlci50eXBlQ2hlY2sgIT09IHVuZGVmaW5lZCAmJiBtYXRjaC5hbmFseXplZCAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgbWF0Y2guYW5hbHl6ZWQuYW5hbHlzaXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIG1hdGNoLmhhbmRsZXIudHlwZUNoZWNrKGNvbnRleHQsIG5vZGUsIG1hdGNoLmFuYWx5emVkLmFuYWx5c2lzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFBlcmZvcm0gYSBjb21waWxhdGlvbiBvcGVyYXRpb24gb24gdGhlIGdpdmVuIGNsYXNzIGRlY2xhcmF0aW9uIGFuZCByZXR1cm4gaW5zdHJ1Y3Rpb25zIHRvIGFuXG4gICAqIEFTVCB0cmFuc2Zvcm1lciBpZiBhbnkgYXJlIGF2YWlsYWJsZS5cbiAgICovXG4gIGNvbXBpbGVJdnlGaWVsZEZvcihub2RlOiB0cy5EZWNsYXJhdGlvbiwgY29uc3RhbnRQb29sOiBDb25zdGFudFBvb2wpOiBDb21waWxlUmVzdWx0W118dW5kZWZpbmVkIHtcbiAgICAvLyBMb29rIHRvIHNlZSB3aGV0aGVyIHRoZSBvcmlnaW5hbCBub2RlIHdhcyBhbmFseXplZC4gSWYgbm90LCB0aGVyZSdzIG5vdGhpbmcgdG8gZG8uXG4gICAgY29uc3Qgb3JpZ2luYWwgPSB0cy5nZXRPcmlnaW5hbE5vZGUobm9kZSkgYXMgdHlwZW9mIG5vZGU7XG4gICAgaWYgKCFpc05hbWVkQ2xhc3NEZWNsYXJhdGlvbihvcmlnaW5hbCkgfHwgIXRoaXMuaXZ5Q2xhc3Nlcy5oYXMob3JpZ2luYWwpKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IGl2eUNsYXNzID0gdGhpcy5pdnlDbGFzc2VzLmdldChvcmlnaW5hbCkgITtcblxuICAgIGxldCByZXM6IENvbXBpbGVSZXN1bHRbXSA9IFtdO1xuXG4gICAgZm9yIChjb25zdCBtYXRjaCBvZiBpdnlDbGFzcy5tYXRjaGVkSGFuZGxlcnMpIHtcbiAgICAgIGlmIChtYXRjaC5hbmFseXplZCA9PT0gbnVsbCB8fCBtYXRjaC5hbmFseXplZC5hbmFseXNpcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjb21waWxlU3BhbiA9IHRoaXMucGVyZi5zdGFydCgnY29tcGlsZUNsYXNzJywgb3JpZ2luYWwpO1xuICAgICAgY29uc3QgY29tcGlsZU1hdGNoUmVzID1cbiAgICAgICAgICBtYXRjaC5oYW5kbGVyLmNvbXBpbGUobm9kZSBhcyBDbGFzc0RlY2xhcmF0aW9uLCBtYXRjaC5hbmFseXplZC5hbmFseXNpcywgY29uc3RhbnRQb29sKTtcbiAgICAgIHRoaXMucGVyZi5zdG9wKGNvbXBpbGVTcGFuKTtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShjb21waWxlTWF0Y2hSZXMpKSB7XG4gICAgICAgIHJlcy5wdXNoKGNvbXBpbGVNYXRjaFJlcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXMucHVzaCguLi5jb21waWxlTWF0Y2hSZXMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIExvb2sgdXAgdGhlIC5kLnRzIHRyYW5zZm9ybWVyIGZvciB0aGUgaW5wdXQgZmlsZSBhbmQgcmVjb3JkIHRoYXQgYXQgbGVhc3Qgb25lIGZpZWxkIHdhc1xuICAgIC8vIGdlbmVyYXRlZCwgd2hpY2ggd2lsbCBhbGxvdyB0aGUgLmQudHMgdG8gYmUgdHJhbnNmb3JtZWQgbGF0ZXIuXG4gICAgY29uc3QgZmlsZU5hbWUgPSBvcmlnaW5hbC5nZXRTb3VyY2VGaWxlKCkuZmlsZU5hbWU7XG4gICAgY29uc3QgZHRzVHJhbnNmb3JtZXIgPSB0aGlzLmdldER0c1RyYW5zZm9ybWVyKGZpbGVOYW1lKTtcbiAgICBkdHNUcmFuc2Zvcm1lci5yZWNvcmRTdGF0aWNGaWVsZChyZWZsZWN0TmFtZU9mRGVjbGFyYXRpb24obm9kZSkgISwgcmVzKTtcblxuICAgIC8vIFJldHVybiB0aGUgaW5zdHJ1Y3Rpb24gdG8gdGhlIHRyYW5zZm9ybWVyIHNvIHRoZSBmaWVsZHMgd2lsbCBiZSBhZGRlZC5cbiAgICByZXR1cm4gcmVzLmxlbmd0aCA+IDAgPyByZXMgOiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogTG9va3VwIHRoZSBgdHMuRGVjb3JhdG9yYCB3aGljaCB0cmlnZ2VyZWQgdHJhbnNmb3JtYXRpb24gb2YgYSBwYXJ0aWN1bGFyIGNsYXNzIGRlY2xhcmF0aW9uLlxuICAgKi9cbiAgaXZ5RGVjb3JhdG9yc0Zvcihub2RlOiB0cy5EZWNsYXJhdGlvbik6IHRzLkRlY29yYXRvcltdIHtcbiAgICBjb25zdCBvcmlnaW5hbCA9IHRzLmdldE9yaWdpbmFsTm9kZShub2RlKSBhcyB0eXBlb2Ygbm9kZTtcblxuICAgIGlmICghaXNOYW1lZENsYXNzRGVjbGFyYXRpb24ob3JpZ2luYWwpIHx8ICF0aGlzLml2eUNsYXNzZXMuaGFzKG9yaWdpbmFsKSkge1xuICAgICAgcmV0dXJuIEVNUFRZX0FSUkFZO1xuICAgIH1cbiAgICBjb25zdCBpdnlDbGFzcyA9IHRoaXMuaXZ5Q2xhc3Nlcy5nZXQob3JpZ2luYWwpICE7XG4gICAgY29uc3QgZGVjb3JhdG9yczogdHMuRGVjb3JhdG9yW10gPSBbXTtcblxuICAgIGZvciAoY29uc3QgbWF0Y2ggb2YgaXZ5Q2xhc3MubWF0Y2hlZEhhbmRsZXJzKSB7XG4gICAgICBpZiAobWF0Y2guYW5hbHl6ZWQgPT09IG51bGwgfHwgbWF0Y2guYW5hbHl6ZWQuYW5hbHlzaXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmIChtYXRjaC5kZXRlY3RlZC50cmlnZ2VyICE9PSBudWxsICYmIHRzLmlzRGVjb3JhdG9yKG1hdGNoLmRldGVjdGVkLnRyaWdnZXIpKSB7XG4gICAgICAgIGRlY29yYXRvcnMucHVzaChtYXRjaC5kZXRlY3RlZC50cmlnZ2VyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGVjb3JhdG9ycztcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9jZXNzIGEgZGVjbGFyYXRpb24gZmlsZSBhbmQgcmV0dXJuIGEgdHJhbnNmb3JtZWQgdmVyc2lvbiB0aGF0IGluY29ycG9yYXRlcyB0aGUgY2hhbmdlc1xuICAgKiBtYWRlIHRvIHRoZSBzb3VyY2UgZmlsZS5cbiAgICovXG4gIHRyYW5zZm9ybWVkRHRzRm9yKGZpbGU6IHRzLlNvdXJjZUZpbGUsIGNvbnRleHQ6IHRzLlRyYW5zZm9ybWF0aW9uQ29udGV4dCk6IHRzLlNvdXJjZUZpbGUge1xuICAgIC8vIE5vIG5lZWQgdG8gdHJhbnNmb3JtIGlmIGl0J3Mgbm90IGEgZGVjbGFyYXRpb25zIGZpbGUsIG9yIGlmIG5vIGNoYW5nZXMgaGF2ZSBiZWVuIHJlcXVlc3RlZFxuICAgIC8vIHRvIHRoZSBpbnB1dCBmaWxlLlxuICAgIC8vIER1ZSB0byB0aGUgd2F5IFR5cGVTY3JpcHQgYWZ0ZXJEZWNsYXJhdGlvbnMgdHJhbnNmb3JtZXJzIHdvcmssIHRoZSBTb3VyY2VGaWxlIHBhdGggaXMgdGhlXG4gICAgLy8gc2FtZSBhcyB0aGUgb3JpZ2luYWwgLnRzLlxuICAgIC8vIFRoZSBvbmx5IHdheSB3ZSBrbm93IGl0J3MgYWN0dWFsbHkgYSBkZWNsYXJhdGlvbiBmaWxlIGlzIHZpYSB0aGUgaXNEZWNsYXJhdGlvbkZpbGUgcHJvcGVydHkuXG4gICAgaWYgKCFmaWxlLmlzRGVjbGFyYXRpb25GaWxlIHx8ICF0aGlzLmR0c01hcC5oYXMoZmlsZS5maWxlTmFtZSkpIHtcbiAgICAgIHJldHVybiBmaWxlO1xuICAgIH1cblxuICAgIC8vIFJldHVybiB0aGUgdHJhbnNmb3JtZWQgc291cmNlLlxuICAgIHJldHVybiB0aGlzLmR0c01hcC5nZXQoZmlsZS5maWxlTmFtZSkgIS50cmFuc2Zvcm0oZmlsZSwgY29udGV4dCk7XG4gIH1cblxuICBnZXQgZGlhZ25vc3RpY3MoKTogUmVhZG9ubHlBcnJheTx0cy5EaWFnbm9zdGljPiB7IHJldHVybiB0aGlzLl9kaWFnbm9zdGljczsgfVxuXG4gIHByaXZhdGUgZ2V0RHRzVHJhbnNmb3JtZXIodHNGaWxlTmFtZTogc3RyaW5nKTogRHRzRmlsZVRyYW5zZm9ybWVyIHtcbiAgICBpZiAoIXRoaXMuZHRzTWFwLmhhcyh0c0ZpbGVOYW1lKSkge1xuICAgICAgdGhpcy5kdHNNYXAuc2V0KHRzRmlsZU5hbWUsIG5ldyBEdHNGaWxlVHJhbnNmb3JtZXIodGhpcy5pbXBvcnRSZXdyaXRlcikpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5kdHNNYXAuZ2V0KHRzRmlsZU5hbWUpICE7XG4gIH1cbn1cbiJdfQ==