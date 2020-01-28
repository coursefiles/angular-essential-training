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
        define("@angular/compiler-cli/src/ngtsc/imports/src/emitter", ["require", "exports", "tslib", "@angular/compiler", "@angular/compiler/src/compiler", "typescript", "@angular/compiler-cli/src/ngtsc/path", "@angular/compiler-cli/src/ngtsc/util/src/typescript", "@angular/compiler-cli/src/ngtsc/imports/src/find_export", "@angular/compiler-cli/src/ngtsc/imports/src/references"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var compiler_1 = require("@angular/compiler");
    var compiler_2 = require("@angular/compiler/src/compiler");
    var ts = require("typescript");
    var path_1 = require("@angular/compiler-cli/src/ngtsc/path");
    var typescript_1 = require("@angular/compiler-cli/src/ngtsc/util/src/typescript");
    var find_export_1 = require("@angular/compiler-cli/src/ngtsc/imports/src/find_export");
    var references_1 = require("@angular/compiler-cli/src/ngtsc/imports/src/references");
    /**
     * Generates `Expression`s which refer to `Reference`s in a given context.
     *
     * A `ReferenceEmitter` uses one or more `ReferenceEmitStrategy` implementations to produce an
     * `Expression` which refers to a `Reference` in the context of a particular file.
     */
    var ReferenceEmitter = /** @class */ (function () {
        function ReferenceEmitter(strategies) {
            this.strategies = strategies;
        }
        ReferenceEmitter.prototype.emit = function (ref, context, importMode) {
            var e_1, _a;
            if (importMode === void 0) { importMode = references_1.ImportMode.UseExistingImport; }
            try {
                for (var _b = tslib_1.__values(this.strategies), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var strategy = _c.value;
                    var emitted = strategy.emit(ref, context, importMode);
                    if (emitted !== null) {
                        return emitted;
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
            throw new Error("Unable to write a reference to " + typescript_1.nodeNameForError(ref.node) + " in " + ref.node.getSourceFile().fileName + " from " + context.fileName);
        };
        return ReferenceEmitter;
    }());
    exports.ReferenceEmitter = ReferenceEmitter;
    /**
     * A `ReferenceEmitStrategy` which will refer to declarations by any local `ts.Identifier`s, if
     * such identifiers are available.
     */
    var LocalIdentifierStrategy = /** @class */ (function () {
        function LocalIdentifierStrategy() {
        }
        LocalIdentifierStrategy.prototype.emit = function (ref, context, importMode) {
            // If the emitter has specified ForceNewImport, then LocalIdentifierStrategy should not use a
            // local identifier at all, *except* in the source file where the node is actually declared.
            if (importMode === references_1.ImportMode.ForceNewImport &&
                typescript_1.getSourceFile(ref.node) !== typescript_1.getSourceFile(context)) {
                return null;
            }
            // A Reference can have multiple identities in different files, so it may already have an
            // Identifier in the requested context file.
            var identifier = ref.getIdentityIn(context);
            if (identifier !== null) {
                return new compiler_1.WrappedNodeExpr(identifier);
            }
            else {
                return null;
            }
        };
        return LocalIdentifierStrategy;
    }());
    exports.LocalIdentifierStrategy = LocalIdentifierStrategy;
    /**
     * A `ReferenceEmitStrategy` which will refer to declarations that come from `node_modules` using
     * an absolute import.
     *
     * Part of this strategy involves looking at the target entry point and identifying the exported
     * name of the targeted declaration, as it might be different from the declared name (e.g. a
     * directive might be declared as FooDirImpl, but exported as FooDir). If no export can be found
     * which maps back to the original directive, an error is thrown.
     */
    var AbsoluteModuleStrategy = /** @class */ (function () {
        function AbsoluteModuleStrategy(program, checker, options, host) {
            this.program = program;
            this.checker = checker;
            this.options = options;
            this.host = host;
            /**
             * A cache of the exports of specific modules, because resolving a module to its exports is a
             * costly operation.
             */
            this.moduleExportsCache = new Map();
        }
        AbsoluteModuleStrategy.prototype.emit = function (ref, context, importMode) {
            if (ref.bestGuessOwningModule === null) {
                // There is no module name available for this Reference, meaning it was arrived at via a
                // relative path.
                return null;
            }
            else if (!typescript_1.isDeclaration(ref.node)) {
                // It's not possible to import something which isn't a declaration.
                throw new Error('Debug assert: importing a Reference to non-declaration?');
            }
            // Try to find the exported name of the declaration, if one is available.
            var _a = ref.bestGuessOwningModule, specifier = _a.specifier, resolutionContext = _a.resolutionContext;
            var symbolName = this.resolveImportName(specifier, ref.node, resolutionContext);
            if (symbolName === null) {
                // TODO(alxhub): make this error a ts.Diagnostic pointing at whatever caused this import to be
                // triggered.
                throw new Error("Symbol " + ref.debugName + " declared in " + typescript_1.getSourceFile(ref.node).fileName + " is not exported from " + specifier + " (import into " + context.fileName + ")");
            }
            return new compiler_1.ExternalExpr(new compiler_2.ExternalReference(specifier, symbolName));
        };
        AbsoluteModuleStrategy.prototype.resolveImportName = function (moduleName, target, fromFile) {
            var exports = this.getExportsOfModule(moduleName, fromFile);
            if (exports !== null && exports.has(target)) {
                return exports.get(target);
            }
            else {
                return null;
            }
        };
        AbsoluteModuleStrategy.prototype.getExportsOfModule = function (moduleName, fromFile) {
            if (!this.moduleExportsCache.has(moduleName)) {
                this.moduleExportsCache.set(moduleName, this.enumerateExportsOfModule(moduleName, fromFile));
            }
            return this.moduleExportsCache.get(moduleName);
        };
        AbsoluteModuleStrategy.prototype.enumerateExportsOfModule = function (specifier, fromFile) {
            var e_2, _a;
            // First, resolve the module specifier to its entry point, and get the ts.Symbol for it.
            var resolved = ts.resolveModuleName(specifier, fromFile, this.options, this.host);
            if (resolved.resolvedModule === undefined) {
                return null;
            }
            var entryPointFile = this.program.getSourceFile(resolved.resolvedModule.resolvedFileName);
            if (entryPointFile === undefined) {
                return null;
            }
            var entryPointSymbol = this.checker.getSymbolAtLocation(entryPointFile);
            if (entryPointSymbol === undefined) {
                return null;
            }
            // Next, build a Map of all the ts.Declarations exported via the specifier and their exported
            // names.
            var exportMap = new Map();
            var exports = this.checker.getExportsOfModule(entryPointSymbol);
            try {
                for (var exports_1 = tslib_1.__values(exports), exports_1_1 = exports_1.next(); !exports_1_1.done; exports_1_1 = exports_1.next()) {
                    var expSymbol = exports_1_1.value;
                    // Resolve export symbols to their actual declarations.
                    var declSymbol = expSymbol.flags & ts.SymbolFlags.Alias ?
                        this.checker.getAliasedSymbol(expSymbol) :
                        expSymbol;
                    // At this point the valueDeclaration of the symbol should be defined.
                    var decl = declSymbol.valueDeclaration;
                    if (decl === undefined) {
                        continue;
                    }
                    // Prefer importing the symbol via its declared name, but take any export of it otherwise.
                    if (declSymbol.name === expSymbol.name || !exportMap.has(decl)) {
                        exportMap.set(decl, expSymbol.name);
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (exports_1_1 && !exports_1_1.done && (_a = exports_1.return)) _a.call(exports_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return exportMap;
        };
        return AbsoluteModuleStrategy;
    }());
    exports.AbsoluteModuleStrategy = AbsoluteModuleStrategy;
    /**
     * A `ReferenceEmitStrategy` which will refer to declarations via relative paths, provided they're
     * both in the logical project "space" of paths.
     *
     * This is trickier than it sounds, as the two files may be in different root directories in the
     * project. Simply calculating a file system relative path between the two is not sufficient.
     * Instead, `LogicalProjectPath`s are used.
     */
    var LogicalProjectStrategy = /** @class */ (function () {
        function LogicalProjectStrategy(checker, logicalFs) {
            this.checker = checker;
            this.logicalFs = logicalFs;
        }
        LogicalProjectStrategy.prototype.emit = function (ref, context) {
            var destSf = typescript_1.getSourceFile(ref.node);
            // Compute the relative path from the importing file to the file being imported. This is done
            // as a logical path computation, because the two files might be in different rootDirs.
            var destPath = this.logicalFs.logicalPathOfSf(destSf);
            if (destPath === null) {
                // The imported file is not within the logical project filesystem.
                return null;
            }
            var originPath = this.logicalFs.logicalPathOfSf(context);
            if (originPath === null) {
                throw new Error("Debug assert: attempt to import from " + context.fileName + " but it's outside the program?");
            }
            // There's no way to emit a relative reference from a file to itself.
            if (destPath === originPath) {
                return null;
            }
            var name = find_export_1.findExportedNameOfNode(ref.node, destSf, this.checker);
            if (name === null) {
                // The target declaration isn't exported from the file it's declared in. This is an issue!
                return null;
            }
            // With both files expressed as LogicalProjectPaths, getting the module specifier as a relative
            // path is now straightforward.
            var moduleName = path_1.LogicalProjectPath.relativePathBetween(originPath, destPath);
            return new compiler_1.ExternalExpr({ moduleName: moduleName, name: name });
        };
        return LogicalProjectStrategy;
    }());
    exports.LogicalProjectStrategy = LogicalProjectStrategy;
    /**
     * A `ReferenceEmitStrategy` which uses a `FileToModuleHost` to generate absolute import references.
     */
    var FileToModuleStrategy = /** @class */ (function () {
        function FileToModuleStrategy(checker, fileToModuleHost) {
            this.checker = checker;
            this.fileToModuleHost = fileToModuleHost;
        }
        FileToModuleStrategy.prototype.emit = function (ref, context) {
            var destSf = typescript_1.getSourceFile(ref.node);
            var name = find_export_1.findExportedNameOfNode(ref.node, destSf, this.checker);
            if (name === null) {
                return null;
            }
            var moduleName = this.fileToModuleHost.fileNameToModuleName(destSf.fileName, context.fileName);
            return new compiler_1.ExternalExpr({ moduleName: moduleName, name: name });
        };
        return FileToModuleStrategy;
    }());
    exports.FileToModuleStrategy = FileToModuleStrategy;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1pdHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvaW1wb3J0cy9zcmMvZW1pdHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7SUFFSCw4Q0FBNEU7SUFDNUUsMkRBQWlFO0lBQ2pFLCtCQUFpQztJQUVqQyw2REFBaUU7SUFDakUsa0ZBQXlGO0lBRXpGLHVGQUFxRDtJQUNyRCxxRkFBbUQ7SUFxQ25EOzs7OztPQUtHO0lBQ0g7UUFDRSwwQkFBb0IsVUFBbUM7WUFBbkMsZUFBVSxHQUFWLFVBQVUsQ0FBeUI7UUFBRyxDQUFDO1FBRTNELCtCQUFJLEdBQUosVUFDSSxHQUFjLEVBQUUsT0FBc0IsRUFDdEMsVUFBcUQ7O1lBQXJELDJCQUFBLEVBQUEsYUFBeUIsdUJBQVUsQ0FBQyxpQkFBaUI7O2dCQUN2RCxLQUF1QixJQUFBLEtBQUEsaUJBQUEsSUFBSSxDQUFDLFVBQVUsQ0FBQSxnQkFBQSw0QkFBRTtvQkFBbkMsSUFBTSxRQUFRLFdBQUE7b0JBQ2pCLElBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztvQkFDeEQsSUFBSSxPQUFPLEtBQUssSUFBSSxFQUFFO3dCQUNwQixPQUFPLE9BQU8sQ0FBQztxQkFDaEI7aUJBQ0Y7Ozs7Ozs7OztZQUNELE1BQU0sSUFBSSxLQUFLLENBQ1gsb0NBQWtDLDZCQUFnQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBTyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLFFBQVEsY0FBUyxPQUFPLENBQUMsUUFBVSxDQUFDLENBQUM7UUFDdkksQ0FBQztRQUNILHVCQUFDO0lBQUQsQ0FBQyxBQWZELElBZUM7SUFmWSw0Q0FBZ0I7SUFpQjdCOzs7T0FHRztJQUNI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QUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3BFLElBQUksSUFBSSxLQUFLLElBQUksRUFBRTtnQkFDakIsT0FBTyxJQUFJLENBQUM7YUFDYjtZQUVELElBQU0sVUFBVSxHQUNaLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUVsRixPQUFPLElBQUksdUJBQVksQ0FBQyxFQUFDLFVBQVUsWUFBQSxFQUFFLElBQUksTUFBQSxFQUFDLENBQUMsQ0FBQztRQUM5QyxDQUFDO1FBQ0gsMkJBQUM7SUFBRCxDQUFDLEFBZkQsSUFlQztJQWZZLG9EQUFvQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtFeHByZXNzaW9uLCBFeHRlcm5hbEV4cHIsIFdyYXBwZWROb2RlRXhwcn0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuaW1wb3J0IHtFeHRlcm5hbFJlZmVyZW5jZX0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXIvc3JjL2NvbXBpbGVyJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge0xvZ2ljYWxGaWxlU3lzdGVtLCBMb2dpY2FsUHJvamVjdFBhdGh9IGZyb20gJy4uLy4uL3BhdGgnO1xuaW1wb3J0IHtnZXRTb3VyY2VGaWxlLCBpc0RlY2xhcmF0aW9uLCBub2RlTmFtZUZvckVycm9yfSBmcm9tICcuLi8uLi91dGlsL3NyYy90eXBlc2NyaXB0JztcblxuaW1wb3J0IHtmaW5kRXhwb3J0ZWROYW1lT2ZOb2RlfSBmcm9tICcuL2ZpbmRfZXhwb3J0JztcbmltcG9ydCB7SW1wb3J0TW9kZSwgUmVmZXJlbmNlfSBmcm9tICcuL3JlZmVyZW5jZXMnO1xuXG4vKipcbiAqIEEgaG9zdCB3aGljaCBzdXBwb3J0cyBhbiBvcGVyYXRpb24gdG8gY29udmVydCBhIGZpbGUgbmFtZSBpbnRvIGEgbW9kdWxlIG5hbWUuXG4gKlxuICogVGhpcyBvcGVyYXRpb24gaXMgdHlwaWNhbGx5IGltcGxlbWVudGVkIGFzIHBhcnQgb2YgdGhlIGNvbXBpbGVyIGhvc3QgcGFzc2VkIHRvIG5ndHNjIHdoZW4gcnVubmluZ1xuICogdW5kZXIgYSBidWlsZCB0b29sIGxpa2UgQmF6ZWwgb3IgQmxhemUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRmlsZVRvTW9kdWxlSG9zdCB7XG4gIGZpbGVOYW1lVG9Nb2R1bGVOYW1lKGltcG9ydGVkRmlsZVBhdGg6IHN0cmluZywgY29udGFpbmluZ0ZpbGVQYXRoOiBzdHJpbmcpOiBzdHJpbmc7XG59XG5cbi8qKlxuICogQSBwYXJ0aWN1bGFyIHN0cmF0ZWd5IGZvciBnZW5lcmF0aW5nIGFuIGV4cHJlc3Npb24gd2hpY2ggcmVmZXJzIHRvIGEgYFJlZmVyZW5jZWAuXG4gKlxuICogVGhlcmUgYXJlIG1hbnkgcG90ZW50aWFsIHdheXMgYSBnaXZlbiBgUmVmZXJlbmNlYCBjb3VsZCBiZSByZWZlcnJlZCB0byBpbiB0aGUgY29udGV4dCBvZiBhIGdpdmVuXG4gKiBmaWxlLiBBIGxvY2FsIGRlY2xhcmF0aW9uIGNvdWxkIGJlIGF2YWlsYWJsZSwgdGhlIGBSZWZlcmVuY2VgIGNvdWxkIGJlIGltcG9ydGFibGUgdmlhIGEgcmVsYXRpdmVcbiAqIGltcG9ydCB3aXRoaW4gdGhlIHByb2plY3QsIG9yIGFuIGFic29sdXRlIGltcG9ydCBpbnRvIGBub2RlX21vZHVsZXNgIG1pZ2h0IGJlIG5lY2Vzc2FyeS5cbiAqXG4gKiBEaWZmZXJlbnQgYFJlZmVyZW5jZUVtaXRTdHJhdGVneWAgaW1wbGVtZW50YXRpb25zIGltcGxlbWVudCBzcGVjaWZpYyBsb2dpYyBmb3IgZ2VuZXJhdGluZyBzdWNoXG4gKiByZWZlcmVuY2VzLiBBIHNpbmdsZSBzdHJhdGVneSAoc3VjaCBhcyB1c2luZyBhIGxvY2FsIGRlY2xhcmF0aW9uKSBtYXkgbm90IGFsd2F5cyBiZSBhYmxlIHRvXG4gKiBnZW5lcmF0ZSBhbiBleHByZXNzaW9uIGZvciBldmVyeSBgUmVmZXJlbmNlYCAoZm9yIGV4YW1wbGUsIGlmIG5vIGxvY2FsIGlkZW50aWZpZXIgaXMgYXZhaWxhYmxlKSxcbiAqIGFuZCBtYXkgcmV0dXJuIGBudWxsYCBpbiBzdWNoIGEgY2FzZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSZWZlcmVuY2VFbWl0U3RyYXRlZ3kge1xuICAvKipcbiAgICogRW1pdCBhbiBgRXhwcmVzc2lvbmAgd2hpY2ggcmVmZXJzIHRvIHRoZSBnaXZlbiBgUmVmZXJlbmNlYCBpbiB0aGUgY29udGV4dCBvZiBhIHBhcnRpY3VsYXJcbiAgICogc291cmNlIGZpbGUsIGlmIHBvc3NpYmxlLlxuICAgKlxuICAgKiBAcGFyYW0gcmVmIHRoZSBgUmVmZXJlbmNlYCBmb3Igd2hpY2ggdG8gZ2VuZXJhdGUgYW4gZXhwcmVzc2lvblxuICAgKiBAcGFyYW0gY29udGV4dCB0aGUgc291cmNlIGZpbGUgaW4gd2hpY2ggdGhlIGBFeHByZXNzaW9uYCBtdXN0IGJlIHZhbGlkXG4gICAqIEBwYXJhbSBpbXBvcnRNb2RlIGEgZmxhZyB3aGljaCBjb250cm9scyB3aGV0aGVyIGltcG9ydHMgc2hvdWxkIGJlIGdlbmVyYXRlZCBvciBub3RcbiAgICogQHJldHVybnMgYW4gYEV4cHJlc3Npb25gIHdoaWNoIHJlZmVycyB0byB0aGUgYFJlZmVyZW5jZWAsIG9yIGBudWxsYCBpZiBub25lIGNhbiBiZSBnZW5lcmF0ZWRcbiAgICovXG4gIGVtaXQocmVmOiBSZWZlcmVuY2UsIGNvbnRleHQ6IHRzLlNvdXJjZUZpbGUsIGltcG9ydE1vZGU6IEltcG9ydE1vZGUpOiBFeHByZXNzaW9ufG51bGw7XG59XG5cbi8qKlxuICogR2VuZXJhdGVzIGBFeHByZXNzaW9uYHMgd2hpY2ggcmVmZXIgdG8gYFJlZmVyZW5jZWBzIGluIGEgZ2l2ZW4gY29udGV4dC5cbiAqXG4gKiBBIGBSZWZlcmVuY2VFbWl0dGVyYCB1c2VzIG9uZSBvciBtb3JlIGBSZWZlcmVuY2VFbWl0U3RyYXRlZ3lgIGltcGxlbWVudGF0aW9ucyB0byBwcm9kdWNlIGFuXG4gKiBgRXhwcmVzc2lvbmAgd2hpY2ggcmVmZXJzIHRvIGEgYFJlZmVyZW5jZWAgaW4gdGhlIGNvbnRleHQgb2YgYSBwYXJ0aWN1bGFyIGZpbGUuXG4gKi9cbmV4cG9ydCBjbGFzcyBSZWZlcmVuY2VFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzdHJhdGVnaWVzOiBSZWZlcmVuY2VFbWl0U3RyYXRlZ3lbXSkge31cblxuICBlbWl0KFxuICAgICAgcmVmOiBSZWZlcmVuY2UsIGNvbnRleHQ6IHRzLlNvdXJjZUZpbGUsXG4gICAgICBpbXBvcnRNb2RlOiBJbXBvcnRNb2RlwqA9IEltcG9ydE1vZGUuVXNlRXhpc3RpbmdJbXBvcnQpOiBFeHByZXNzaW9uIHtcbiAgICBmb3IgKGNvbnN0IHN0cmF0ZWd5IG9mIHRoaXMuc3RyYXRlZ2llcykge1xuICAgICAgY29uc3QgZW1pdHRlZCA9IHN0cmF0ZWd5LmVtaXQocmVmLCBjb250ZXh0LCBpbXBvcnRNb2RlKTtcbiAgICAgIGlmIChlbWl0dGVkICE9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBlbWl0dGVkO1xuICAgICAgfVxuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBVbmFibGUgdG8gd3JpdGUgYSByZWZlcmVuY2UgdG8gJHtub2RlTmFtZUZvckVycm9yKHJlZi5ub2RlKX0gaW4gJHtyZWYubm9kZS5nZXRTb3VyY2VGaWxlKCkuZmlsZU5hbWV9IGZyb20gJHtjb250ZXh0LmZpbGVOYW1lfWApO1xuICB9XG59XG5cbi8qKlxuICogQSBgUmVmZXJlbmNlRW1pdFN0cmF0ZWd5YCB3aGljaCB3aWxsIHJlZmVyIHRvIGRlY2xhcmF0aW9ucyBieSBhbnkgbG9jYWwgYHRzLklkZW50aWZpZXJgcywgaWZcbiAqIHN1Y2ggaWRlbnRpZmllcnMgYXJlIGF2YWlsYWJsZS5cbiAqL1xuZXhwb3J0IGNsYXNzIExvY2FsSWRlbnRpZmllclN0cmF0ZWd5IGltcGxlbWVudHMgUmVmZXJlbmNlRW1pdFN0cmF0ZWd5IHtcbiAgZW1pdChyZWY6IFJlZmVyZW5jZTx0cy5Ob2RlPiwgY29udGV4dDogdHMuU291cmNlRmlsZSwgaW1wb3J0TW9kZTogSW1wb3J0TW9kZSk6IEV4cHJlc3Npb258bnVsbCB7XG4gICAgLy8gSWYgdGhlIGVtaXR0ZXIgaGFzIHNwZWNpZmllZCBGb3JjZU5ld0ltcG9ydCwgdGhlbiBMb2NhbElkZW50aWZpZXJTdHJhdGVneSBzaG91bGQgbm90IHVzZSBhXG4gICAgLy8gbG9jYWwgaWRlbnRpZmllciBhdCBhbGwsICpleGNlcHQqIGluIHRoZSBzb3VyY2UgZmlsZSB3aGVyZSB0aGUgbm9kZSBpcyBhY3R1YWxseSBkZWNsYXJlZC5cbiAgICBpZiAoaW1wb3J0TW9kZSA9PT0gSW1wb3J0TW9kZS5Gb3JjZU5ld0ltcG9ydCAmJlxuICAgICAgICBnZXRTb3VyY2VGaWxlKHJlZi5ub2RlKSAhPT0gZ2V0U291cmNlRmlsZShjb250ZXh0KSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gQSBSZWZlcmVuY2UgY2FuIGhhdmUgbXVsdGlwbGUgaWRlbnRpdGllcyBpbiBkaWZmZXJlbnQgZmlsZXMsIHNvIGl0IG1heSBhbHJlYWR5IGhhdmUgYW5cbiAgICAvLyBJZGVudGlmaWVyIGluIHRoZSByZXF1ZXN0ZWQgY29udGV4dCBmaWxlLlxuICAgIGNvbnN0IGlkZW50aWZpZXIgPSByZWYuZ2V0SWRlbnRpdHlJbihjb250ZXh0KTtcbiAgICBpZiAoaWRlbnRpZmllciAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG5ldyBXcmFwcGVkTm9kZUV4cHIoaWRlbnRpZmllcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEEgYFJlZmVyZW5jZUVtaXRTdHJhdGVneWAgd2hpY2ggd2lsbCByZWZlciB0byBkZWNsYXJhdGlvbnMgdGhhdCBjb21lIGZyb20gYG5vZGVfbW9kdWxlc2AgdXNpbmdcbiAqIGFuIGFic29sdXRlIGltcG9ydC5cbiAqXG4gKiBQYXJ0IG9mIHRoaXMgc3RyYXRlZ3kgaW52b2x2ZXMgbG9va2luZyBhdCB0aGUgdGFyZ2V0IGVudHJ5IHBvaW50IGFuZCBpZGVudGlmeWluZyB0aGUgZXhwb3J0ZWRcbiAqIG5hbWUgb2YgdGhlIHRhcmdldGVkIGRlY2xhcmF0aW9uLCBhcyBpdCBtaWdodCBiZSBkaWZmZXJlbnQgZnJvbSB0aGUgZGVjbGFyZWQgbmFtZSAoZS5nLiBhXG4gKiBkaXJlY3RpdmUgbWlnaHQgYmUgZGVjbGFyZWQgYXMgRm9vRGlySW1wbCwgYnV0IGV4cG9ydGVkIGFzIEZvb0RpcikuIElmIG5vIGV4cG9ydCBjYW4gYmUgZm91bmRcbiAqIHdoaWNoIG1hcHMgYmFjayB0byB0aGUgb3JpZ2luYWwgZGlyZWN0aXZlLCBhbiBlcnJvciBpcyB0aHJvd24uXG4gKi9cbmV4cG9ydCBjbGFzcyBBYnNvbHV0ZU1vZHVsZVN0cmF0ZWd5IGltcGxlbWVudHMgUmVmZXJlbmNlRW1pdFN0cmF0ZWd5IHtcbiAgLyoqXG4gICAqIEEgY2FjaGUgb2YgdGhlIGV4cG9ydHMgb2Ygc3BlY2lmaWMgbW9kdWxlcywgYmVjYXVzZSByZXNvbHZpbmcgYSBtb2R1bGUgdG8gaXRzIGV4cG9ydHMgaXMgYVxuICAgKiBjb3N0bHkgb3BlcmF0aW9uLlxuICAgKi9cbiAgcHJpdmF0ZSBtb2R1bGVFeHBvcnRzQ2FjaGUgPSBuZXcgTWFwPHN0cmluZywgTWFwPHRzLkRlY2xhcmF0aW9uLCBzdHJpbmc+fG51bGw+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIHByb2dyYW06IHRzLlByb2dyYW0sIHByaXZhdGUgY2hlY2tlcjogdHMuVHlwZUNoZWNrZXIsXG4gICAgICBwcml2YXRlIG9wdGlvbnM6IHRzLkNvbXBpbGVyT3B0aW9ucywgcHJpdmF0ZSBob3N0OiB0cy5Db21waWxlckhvc3QpIHt9XG5cbiAgZW1pdChyZWY6IFJlZmVyZW5jZTx0cy5Ob2RlPiwgY29udGV4dDogdHMuU291cmNlRmlsZSwgaW1wb3J0TW9kZTogSW1wb3J0TW9kZSk6IEV4cHJlc3Npb258bnVsbCB7XG4gICAgaWYgKHJlZi5iZXN0R3Vlc3NPd25pbmdNb2R1bGUgPT09IG51bGwpIHtcbiAgICAgIC8vIFRoZXJlIGlzIG5vIG1vZHVsZSBuYW1lIGF2YWlsYWJsZSBmb3IgdGhpcyBSZWZlcmVuY2UsIG1lYW5pbmcgaXQgd2FzIGFycml2ZWQgYXQgdmlhIGFcbiAgICAgIC8vIHJlbGF0aXZlIHBhdGguXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2UgaWYgKCFpc0RlY2xhcmF0aW9uKHJlZi5ub2RlKSkge1xuICAgICAgLy8gSXQncyBub3QgcG9zc2libGUgdG8gaW1wb3J0IHNvbWV0aGluZyB3aGljaCBpc24ndCBhIGRlY2xhcmF0aW9uLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdEZWJ1ZyBhc3NlcnQ6IGltcG9ydGluZyBhIFJlZmVyZW5jZSB0byBub24tZGVjbGFyYXRpb24/Jyk7XG4gICAgfVxuXG4gICAgLy8gVHJ5IHRvIGZpbmQgdGhlIGV4cG9ydGVkIG5hbWUgb2YgdGhlIGRlY2xhcmF0aW9uLCBpZiBvbmUgaXMgYXZhaWxhYmxlLlxuICAgIGNvbnN0IHtzcGVjaWZpZXIsIHJlc29sdXRpb25Db250ZXh0fSA9IHJlZi5iZXN0R3Vlc3NPd25pbmdNb2R1bGU7XG4gICAgY29uc3Qgc3ltYm9sTmFtZSA9IHRoaXMucmVzb2x2ZUltcG9ydE5hbWUoc3BlY2lmaWVyLCByZWYubm9kZSwgcmVzb2x1dGlvbkNvbnRleHQpO1xuICAgIGlmIChzeW1ib2xOYW1lID09PSBudWxsKSB7XG4gICAgICAvLyBUT0RPKGFseGh1Yik6IG1ha2UgdGhpcyBlcnJvciBhIHRzLkRpYWdub3N0aWMgcG9pbnRpbmcgYXQgd2hhdGV2ZXIgY2F1c2VkIHRoaXMgaW1wb3J0IHRvIGJlXG4gICAgICAvLyB0cmlnZ2VyZWQuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYFN5bWJvbCAke3JlZi5kZWJ1Z05hbWV9IGRlY2xhcmVkIGluICR7Z2V0U291cmNlRmlsZShyZWYubm9kZSkuZmlsZU5hbWV9IGlzIG5vdCBleHBvcnRlZCBmcm9tICR7c3BlY2lmaWVyfSAoaW1wb3J0IGludG8gJHtjb250ZXh0LmZpbGVOYW1lfSlgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEV4dGVybmFsRXhwcihuZXcgRXh0ZXJuYWxSZWZlcmVuY2Uoc3BlY2lmaWVyLCBzeW1ib2xOYW1lKSk7XG4gIH1cblxuICBwcml2YXRlIHJlc29sdmVJbXBvcnROYW1lKG1vZHVsZU5hbWU6IHN0cmluZywgdGFyZ2V0OiB0cy5EZWNsYXJhdGlvbiwgZnJvbUZpbGU6IHN0cmluZyk6IHN0cmluZ1xuICAgICAgfG51bGwge1xuICAgIGNvbnN0IGV4cG9ydHMgPSB0aGlzLmdldEV4cG9ydHNPZk1vZHVsZShtb2R1bGVOYW1lLCBmcm9tRmlsZSk7XG4gICAgaWYgKGV4cG9ydHMgIT09IG51bGwgJiYgZXhwb3J0cy5oYXModGFyZ2V0KSkge1xuICAgICAgcmV0dXJuIGV4cG9ydHMuZ2V0KHRhcmdldCkgITtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRFeHBvcnRzT2ZNb2R1bGUobW9kdWxlTmFtZTogc3RyaW5nLCBmcm9tRmlsZTogc3RyaW5nKTpcbiAgICAgIE1hcDx0cy5EZWNsYXJhdGlvbiwgc3RyaW5nPnxudWxsIHtcbiAgICBpZiAoIXRoaXMubW9kdWxlRXhwb3J0c0NhY2hlLmhhcyhtb2R1bGVOYW1lKSkge1xuICAgICAgdGhpcy5tb2R1bGVFeHBvcnRzQ2FjaGUuc2V0KG1vZHVsZU5hbWUsIHRoaXMuZW51bWVyYXRlRXhwb3J0c09mTW9kdWxlKG1vZHVsZU5hbWUsIGZyb21GaWxlKSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLm1vZHVsZUV4cG9ydHNDYWNoZS5nZXQobW9kdWxlTmFtZSkgITtcbiAgfVxuXG4gIHByaXZhdGUgZW51bWVyYXRlRXhwb3J0c09mTW9kdWxlKHNwZWNpZmllcjogc3RyaW5nLCBmcm9tRmlsZTogc3RyaW5nKTpcbiAgICAgIE1hcDx0cy5EZWNsYXJhdGlvbiwgc3RyaW5nPnxudWxsIHtcbiAgICAvLyBGaXJzdCwgcmVzb2x2ZSB0aGUgbW9kdWxlIHNwZWNpZmllciB0byBpdHMgZW50cnkgcG9pbnQsIGFuZCBnZXQgdGhlIHRzLlN5bWJvbCBmb3IgaXQuXG4gICAgY29uc3QgcmVzb2x2ZWQgPSB0cy5yZXNvbHZlTW9kdWxlTmFtZShzcGVjaWZpZXIsIGZyb21GaWxlLCB0aGlzLm9wdGlvbnMsIHRoaXMuaG9zdCk7XG4gICAgaWYgKHJlc29sdmVkLnJlc29sdmVkTW9kdWxlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGVudHJ5UG9pbnRGaWxlID0gdGhpcy5wcm9ncmFtLmdldFNvdXJjZUZpbGUocmVzb2x2ZWQucmVzb2x2ZWRNb2R1bGUucmVzb2x2ZWRGaWxlTmFtZSk7XG4gICAgaWYgKGVudHJ5UG9pbnRGaWxlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGVudHJ5UG9pbnRTeW1ib2wgPSB0aGlzLmNoZWNrZXIuZ2V0U3ltYm9sQXRMb2NhdGlvbihlbnRyeVBvaW50RmlsZSk7XG4gICAgaWYgKGVudHJ5UG9pbnRTeW1ib2wgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gTmV4dCwgYnVpbGQgYSBNYXAgb2YgYWxsIHRoZSB0cy5EZWNsYXJhdGlvbnMgZXhwb3J0ZWQgdmlhIHRoZSBzcGVjaWZpZXIgYW5kIHRoZWlyIGV4cG9ydGVkXG4gICAgLy8gbmFtZXMuXG4gICAgY29uc3QgZXhwb3J0TWFwID0gbmV3IE1hcDx0cy5EZWNsYXJhdGlvbiwgc3RyaW5nPigpO1xuXG4gICAgY29uc3QgZXhwb3J0cyA9IHRoaXMuY2hlY2tlci5nZXRFeHBvcnRzT2ZNb2R1bGUoZW50cnlQb2ludFN5bWJvbCk7XG4gICAgZm9yIChjb25zdCBleHBTeW1ib2wgb2YgZXhwb3J0cykge1xuICAgICAgLy8gUmVzb2x2ZSBleHBvcnQgc3ltYm9scyB0byB0aGVpciBhY3R1YWwgZGVjbGFyYXRpb25zLlxuICAgICAgY29uc3QgZGVjbFN5bWJvbCA9IGV4cFN5bWJvbC5mbGFncyAmIHRzLlN5bWJvbEZsYWdzLkFsaWFzID9cbiAgICAgICAgICB0aGlzLmNoZWNrZXIuZ2V0QWxpYXNlZFN5bWJvbChleHBTeW1ib2wpIDpcbiAgICAgICAgICBleHBTeW1ib2w7XG5cbiAgICAgIC8vIEF0IHRoaXMgcG9pbnQgdGhlIHZhbHVlRGVjbGFyYXRpb24gb2YgdGhlIHN5bWJvbCBzaG91bGQgYmUgZGVmaW5lZC5cbiAgICAgIGNvbnN0IGRlY2wgPSBkZWNsU3ltYm9sLnZhbHVlRGVjbGFyYXRpb247XG4gICAgICBpZiAoZGVjbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBQcmVmZXIgaW1wb3J0aW5nIHRoZSBzeW1ib2wgdmlhIGl0cyBkZWNsYXJlZCBuYW1lLCBidXQgdGFrZSBhbnkgZXhwb3J0IG9mIGl0IG90aGVyd2lzZS5cbiAgICAgIGlmIChkZWNsU3ltYm9sLm5hbWUgPT09IGV4cFN5bWJvbC5uYW1lIHx8ICFleHBvcnRNYXAuaGFzKGRlY2wpKSB7XG4gICAgICAgIGV4cG9ydE1hcC5zZXQoZGVjbCwgZXhwU3ltYm9sLm5hbWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBleHBvcnRNYXA7XG4gIH1cbn1cblxuLyoqXG4gKiBBIGBSZWZlcmVuY2VFbWl0U3RyYXRlZ3lgIHdoaWNoIHdpbGwgcmVmZXIgdG8gZGVjbGFyYXRpb25zIHZpYSByZWxhdGl2ZSBwYXRocywgcHJvdmlkZWQgdGhleSdyZVxuICogYm90aCBpbiB0aGUgbG9naWNhbCBwcm9qZWN0IFwic3BhY2VcIiBvZiBwYXRocy5cbiAqXG4gKiBUaGlzIGlzIHRyaWNraWVyIHRoYW4gaXQgc291bmRzLCBhcyB0aGUgdHdvIGZpbGVzIG1heSBiZSBpbiBkaWZmZXJlbnQgcm9vdCBkaXJlY3RvcmllcyBpbiB0aGVcbiAqIHByb2plY3QuIFNpbXBseSBjYWxjdWxhdGluZyBhIGZpbGUgc3lzdGVtIHJlbGF0aXZlIHBhdGggYmV0d2VlbiB0aGUgdHdvIGlzIG5vdCBzdWZmaWNpZW50LlxuICogSW5zdGVhZCwgYExvZ2ljYWxQcm9qZWN0UGF0aGBzIGFyZSB1c2VkLlxuICovXG5leHBvcnQgY2xhc3MgTG9naWNhbFByb2plY3RTdHJhdGVneSBpbXBsZW1lbnRzIFJlZmVyZW5jZUVtaXRTdHJhdGVneSB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY2hlY2tlcjogdHMuVHlwZUNoZWNrZXIsIHByaXZhdGUgbG9naWNhbEZzOiBMb2dpY2FsRmlsZVN5c3RlbSkge31cblxuICBlbWl0KHJlZjogUmVmZXJlbmNlPHRzLk5vZGU+LCBjb250ZXh0OiB0cy5Tb3VyY2VGaWxlKTogRXhwcmVzc2lvbnxudWxsIHtcbiAgICBjb25zdCBkZXN0U2YgPSBnZXRTb3VyY2VGaWxlKHJlZi5ub2RlKTtcblxuICAgIC8vIENvbXB1dGUgdGhlIHJlbGF0aXZlIHBhdGggZnJvbSB0aGUgaW1wb3J0aW5nIGZpbGUgdG8gdGhlIGZpbGUgYmVpbmcgaW1wb3J0ZWQuIFRoaXMgaXMgZG9uZVxuICAgIC8vIGFzIGEgbG9naWNhbCBwYXRoIGNvbXB1dGF0aW9uLCBiZWNhdXNlIHRoZSB0d28gZmlsZXMgbWlnaHQgYmUgaW4gZGlmZmVyZW50IHJvb3REaXJzLlxuICAgIGNvbnN0IGRlc3RQYXRoID0gdGhpcy5sb2dpY2FsRnMubG9naWNhbFBhdGhPZlNmKGRlc3RTZik7XG4gICAgaWYgKGRlc3RQYXRoID09PSBudWxsKSB7XG4gICAgICAvLyBUaGUgaW1wb3J0ZWQgZmlsZSBpcyBub3Qgd2l0aGluIHRoZSBsb2dpY2FsIHByb2plY3QgZmlsZXN5c3RlbS5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IG9yaWdpblBhdGggPSB0aGlzLmxvZ2ljYWxGcy5sb2dpY2FsUGF0aE9mU2YoY29udGV4dCk7XG4gICAgaWYgKG9yaWdpblBhdGggPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgRGVidWcgYXNzZXJ0OiBhdHRlbXB0IHRvIGltcG9ydCBmcm9tICR7Y29udGV4dC5maWxlTmFtZX0gYnV0IGl0J3Mgb3V0c2lkZSB0aGUgcHJvZ3JhbT9gKTtcbiAgICB9XG5cbiAgICAvLyBUaGVyZSdzIG5vIHdheSB0byBlbWl0IGEgcmVsYXRpdmUgcmVmZXJlbmNlIGZyb20gYSBmaWxlIHRvIGl0c2VsZi5cbiAgICBpZiAoZGVzdFBhdGggPT09IG9yaWdpblBhdGgpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IG5hbWUgPSBmaW5kRXhwb3J0ZWROYW1lT2ZOb2RlKHJlZi5ub2RlLCBkZXN0U2YsIHRoaXMuY2hlY2tlcik7XG4gICAgaWYgKG5hbWUgPT09IG51bGwpIHtcbiAgICAgIC8vIFRoZSB0YXJnZXQgZGVjbGFyYXRpb24gaXNuJ3QgZXhwb3J0ZWQgZnJvbSB0aGUgZmlsZSBpdCdzIGRlY2xhcmVkIGluLiBUaGlzIGlzIGFuIGlzc3VlIVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gV2l0aCBib3RoIGZpbGVzIGV4cHJlc3NlZCBhcyBMb2dpY2FsUHJvamVjdFBhdGhzLCBnZXR0aW5nIHRoZSBtb2R1bGUgc3BlY2lmaWVyIGFzIGEgcmVsYXRpdmVcbiAgICAvLyBwYXRoIGlzIG5vdyBzdHJhaWdodGZvcndhcmQuXG4gICAgY29uc3QgbW9kdWxlTmFtZSA9IExvZ2ljYWxQcm9qZWN0UGF0aC5yZWxhdGl2ZVBhdGhCZXR3ZWVuKG9yaWdpblBhdGgsIGRlc3RQYXRoKTtcbiAgICByZXR1cm4gbmV3IEV4dGVybmFsRXhwcih7bW9kdWxlTmFtZSwgbmFtZX0pO1xuICB9XG59XG5cbi8qKlxuICogQSBgUmVmZXJlbmNlRW1pdFN0cmF0ZWd5YCB3aGljaCB1c2VzIGEgYEZpbGVUb01vZHVsZUhvc3RgIHRvIGdlbmVyYXRlIGFic29sdXRlIGltcG9ydCByZWZlcmVuY2VzLlxuICovXG5leHBvcnQgY2xhc3MgRmlsZVRvTW9kdWxlU3RyYXRlZ3kgaW1wbGVtZW50cyBSZWZlcmVuY2VFbWl0U3RyYXRlZ3kge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNoZWNrZXI6IHRzLlR5cGVDaGVja2VyLCBwcml2YXRlIGZpbGVUb01vZHVsZUhvc3Q6IEZpbGVUb01vZHVsZUhvc3QpIHt9XG5cbiAgZW1pdChyZWY6IFJlZmVyZW5jZTx0cy5Ob2RlPiwgY29udGV4dDogdHMuU291cmNlRmlsZSk6IEV4cHJlc3Npb258bnVsbCB7XG4gICAgY29uc3QgZGVzdFNmID0gZ2V0U291cmNlRmlsZShyZWYubm9kZSk7XG4gICAgY29uc3QgbmFtZSA9IGZpbmRFeHBvcnRlZE5hbWVPZk5vZGUocmVmLm5vZGUsIGRlc3RTZiwgdGhpcy5jaGVja2VyKTtcbiAgICBpZiAobmFtZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgbW9kdWxlTmFtZSA9XG4gICAgICAgIHRoaXMuZmlsZVRvTW9kdWxlSG9zdC5maWxlTmFtZVRvTW9kdWxlTmFtZShkZXN0U2YuZmlsZU5hbWUsIGNvbnRleHQuZmlsZU5hbWUpO1xuXG4gICAgcmV0dXJuIG5ldyBFeHRlcm5hbEV4cHIoe21vZHVsZU5hbWUsIG5hbWV9KTtcbiAgfVxufVxuIl19