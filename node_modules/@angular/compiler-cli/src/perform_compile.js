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
        define("@angular/compiler-cli/src/perform_compile", ["require", "exports", "tslib", "@angular/compiler", "fs", "path", "typescript", "@angular/compiler-cli/src/transformers/api", "@angular/compiler-cli/src/transformers/entry_points", "@angular/compiler-cli/src/transformers/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var compiler_1 = require("@angular/compiler");
    var fs = require("fs");
    var path = require("path");
    var ts = require("typescript");
    var api = require("@angular/compiler-cli/src/transformers/api");
    var ng = require("@angular/compiler-cli/src/transformers/entry_points");
    var util_1 = require("@angular/compiler-cli/src/transformers/util");
    var TS_EXT = /\.ts$/;
    function filterErrorsAndWarnings(diagnostics) {
        return diagnostics.filter(function (d) { return d.category !== ts.DiagnosticCategory.Message; });
    }
    exports.filterErrorsAndWarnings = filterErrorsAndWarnings;
    var defaultFormatHost = {
        getCurrentDirectory: function () { return ts.sys.getCurrentDirectory(); },
        getCanonicalFileName: function (fileName) { return fileName; },
        getNewLine: function () { return ts.sys.newLine; }
    };
    function displayFileName(fileName, host) {
        return path.relative(host.getCurrentDirectory(), host.getCanonicalFileName(fileName));
    }
    function formatDiagnosticPosition(position, host) {
        if (host === void 0) { host = defaultFormatHost; }
        return displayFileName(position.fileName, host) + "(" + (position.line + 1) + "," + (position.column + 1) + ")";
    }
    exports.formatDiagnosticPosition = formatDiagnosticPosition;
    function flattenDiagnosticMessageChain(chain, host) {
        if (host === void 0) { host = defaultFormatHost; }
        var result = chain.messageText;
        var indent = 1;
        var current = chain.next;
        var newLine = host.getNewLine();
        while (current) {
            result += newLine;
            for (var i = 0; i < indent; i++) {
                result += '  ';
            }
            result += current.messageText;
            var position = current.position;
            if (position) {
                result += " at " + formatDiagnosticPosition(position, host);
            }
            current = current.next;
            indent++;
        }
        return result;
    }
    exports.flattenDiagnosticMessageChain = flattenDiagnosticMessageChain;
    function formatDiagnostic(diagnostic, host) {
        if (host === void 0) { host = defaultFormatHost; }
        var result = '';
        var newLine = host.getNewLine();
        var span = diagnostic.span;
        if (span) {
            result += formatDiagnosticPosition({
                fileName: span.start.file.url,
                line: span.start.line,
                column: span.start.col
            }, host) + ": ";
        }
        else if (diagnostic.position) {
            result += formatDiagnosticPosition(diagnostic.position, host) + ": ";
        }
        if (diagnostic.span && diagnostic.span.details) {
            result += ": " + diagnostic.span.details + ", " + diagnostic.messageText + newLine;
        }
        else if (diagnostic.chain) {
            result += flattenDiagnosticMessageChain(diagnostic.chain, host) + "." + newLine;
        }
        else {
            result += ": " + diagnostic.messageText + newLine;
        }
        return result;
    }
    exports.formatDiagnostic = formatDiagnostic;
    function formatDiagnostics(diags, host) {
        if (host === void 0) { host = defaultFormatHost; }
        if (diags && diags.length) {
            return diags
                .map(function (diagnostic) {
                if (api.isTsDiagnostic(diagnostic)) {
                    return ts.formatDiagnostics([diagnostic], host);
                }
                else {
                    return formatDiagnostic(diagnostic, host);
                }
            })
                .join('');
        }
        else {
            return '';
        }
    }
    exports.formatDiagnostics = formatDiagnostics;
    function calcProjectFileAndBasePath(project) {
        var projectIsDir = fs.lstatSync(project).isDirectory();
        var projectFile = projectIsDir ? path.join(project, 'tsconfig.json') : project;
        var projectDir = projectIsDir ? project : path.dirname(project);
        var basePath = path.resolve(process.cwd(), projectDir);
        return { projectFile: projectFile, basePath: basePath };
    }
    exports.calcProjectFileAndBasePath = calcProjectFileAndBasePath;
    function createNgCompilerOptions(basePath, config, tsOptions) {
        // enableIvy `ngtsc` is an alias for `true`.
        if (config.angularCompilerOptions && config.angularCompilerOptions.enableIvy === 'ngtsc') {
            config.angularCompilerOptions.enableIvy = true;
        }
        return tslib_1.__assign({}, tsOptions, config.angularCompilerOptions, { genDir: basePath, basePath: basePath });
    }
    exports.createNgCompilerOptions = createNgCompilerOptions;
    function readConfiguration(project, existingOptions) {
        try {
            var _a = calcProjectFileAndBasePath(project), projectFile = _a.projectFile, basePath = _a.basePath;
            var readExtendedConfigFile_1 = function (configFile, existingConfig) {
                var _a = ts.readConfigFile(configFile, ts.sys.readFile), config = _a.config, error = _a.error;
                if (error) {
                    return { error: error };
                }
                // we are only interested into merging 'angularCompilerOptions' as
                // other options like 'compilerOptions' are merged by TS
                var baseConfig = existingConfig || config;
                if (existingConfig) {
                    baseConfig.angularCompilerOptions = tslib_1.__assign({}, config.angularCompilerOptions, baseConfig.angularCompilerOptions);
                }
                if (config.extends) {
                    var extendedConfigPath = path.resolve(path.dirname(configFile), config.extends);
                    extendedConfigPath = path.extname(extendedConfigPath) ? extendedConfigPath :
                        extendedConfigPath + ".json";
                    if (fs.existsSync(extendedConfigPath)) {
                        // Call read config recursively as TypeScript only merges CompilerOptions
                        return readExtendedConfigFile_1(extendedConfigPath, baseConfig);
                    }
                }
                return { config: baseConfig };
            };
            var _b = readExtendedConfigFile_1(projectFile), config = _b.config, error = _b.error;
            if (error) {
                return {
                    project: project,
                    errors: [error],
                    rootNames: [],
                    options: {},
                    emitFlags: api.EmitFlags.Default
                };
            }
            var parseConfigHost = {
                useCaseSensitiveFileNames: true,
                fileExists: fs.existsSync,
                readDirectory: ts.sys.readDirectory,
                readFile: ts.sys.readFile
            };
            var configFileName = path.resolve(process.cwd(), projectFile);
            var parsed = ts.parseJsonConfigFileContent(config, parseConfigHost, basePath, existingOptions, configFileName);
            var rootNames = parsed.fileNames.map(function (f) { return path.normalize(f); });
            var options = createNgCompilerOptions(basePath, config, parsed.options);
            var emitFlags = api.EmitFlags.Default;
            if (!(options.skipMetadataEmit || options.flatModuleOutFile)) {
                emitFlags |= api.EmitFlags.Metadata;
            }
            if (options.skipTemplateCodegen) {
                emitFlags = emitFlags & ~api.EmitFlags.Codegen;
            }
            return { project: projectFile, rootNames: rootNames, options: options, errors: parsed.errors, emitFlags: emitFlags };
        }
        catch (e) {
            var errors = [{
                    category: ts.DiagnosticCategory.Error,
                    messageText: e.stack,
                    source: api.SOURCE,
                    code: api.UNKNOWN_ERROR_CODE
                }];
            return { project: '', errors: errors, rootNames: [], options: {}, emitFlags: api.EmitFlags.Default };
        }
    }
    exports.readConfiguration = readConfiguration;
    function exitCodeFromResult(diags) {
        if (!diags || filterErrorsAndWarnings(diags).length === 0) {
            // If we have a result and didn't get any errors, we succeeded.
            return 0;
        }
        // Return 2 if any of the errors were unknown.
        return diags.some(function (d) { return d.source === 'angular' && d.code === api.UNKNOWN_ERROR_CODE; }) ? 2 : 1;
    }
    exports.exitCodeFromResult = exitCodeFromResult;
    function performCompilation(_a) {
        var rootNames = _a.rootNames, options = _a.options, host = _a.host, oldProgram = _a.oldProgram, emitCallback = _a.emitCallback, mergeEmitResultsCallback = _a.mergeEmitResultsCallback, _b = _a.gatherDiagnostics, gatherDiagnostics = _b === void 0 ? defaultGatherDiagnostics : _b, customTransformers = _a.customTransformers, _c = _a.emitFlags, emitFlags = _c === void 0 ? api.EmitFlags.Default : _c;
        var program;
        var emitResult;
        var allDiagnostics = [];
        try {
            if (!host) {
                host = ng.createCompilerHost({ options: options });
            }
            program = ng.createProgram({ rootNames: rootNames, host: host, options: options, oldProgram: oldProgram });
            var beforeDiags = Date.now();
            allDiagnostics.push.apply(allDiagnostics, tslib_1.__spread(gatherDiagnostics(program)));
            if (options.diagnostics) {
                var afterDiags = Date.now();
                allDiagnostics.push(util_1.createMessageDiagnostic("Time for diagnostics: " + (afterDiags - beforeDiags) + "ms."));
            }
            if (!hasErrors(allDiagnostics)) {
                emitResult =
                    program.emit({ emitCallback: emitCallback, mergeEmitResultsCallback: mergeEmitResultsCallback, customTransformers: customTransformers, emitFlags: emitFlags });
                allDiagnostics.push.apply(allDiagnostics, tslib_1.__spread(emitResult.diagnostics));
                return { diagnostics: allDiagnostics, program: program, emitResult: emitResult };
            }
            return { diagnostics: allDiagnostics, program: program };
        }
        catch (e) {
            var errMsg = void 0;
            var code = void 0;
            if (compiler_1.isSyntaxError(e)) {
                // don't report the stack for syntax errors as they are well known errors.
                errMsg = e.message;
                code = api.DEFAULT_ERROR_CODE;
            }
            else {
                errMsg = e.stack;
                // It is not a syntax error we might have a program with unknown state, discard it.
                program = undefined;
                code = api.UNKNOWN_ERROR_CODE;
            }
            allDiagnostics.push({ category: ts.DiagnosticCategory.Error, messageText: errMsg, code: code, source: api.SOURCE });
            return { diagnostics: allDiagnostics, program: program };
        }
    }
    exports.performCompilation = performCompilation;
    function defaultGatherDiagnostics(program) {
        var allDiagnostics = [];
        function checkDiagnostics(diags) {
            if (diags) {
                allDiagnostics.push.apply(allDiagnostics, tslib_1.__spread(diags));
                return !hasErrors(diags);
            }
            return true;
        }
        var checkOtherDiagnostics = true;
        // Check parameter diagnostics
        checkOtherDiagnostics = checkOtherDiagnostics &&
            checkDiagnostics(tslib_1.__spread(program.getTsOptionDiagnostics(), program.getNgOptionDiagnostics()));
        // Check syntactic diagnostics
        checkOtherDiagnostics =
            checkOtherDiagnostics && checkDiagnostics(program.getTsSyntacticDiagnostics());
        // Check TypeScript semantic and Angular structure diagnostics
        checkOtherDiagnostics =
            checkOtherDiagnostics &&
                checkDiagnostics(tslib_1.__spread(program.getTsSemanticDiagnostics(), program.getNgStructuralDiagnostics()));
        // Check Angular semantic diagnostics
        checkOtherDiagnostics =
            checkOtherDiagnostics && checkDiagnostics(program.getNgSemanticDiagnostics());
        return allDiagnostics;
    }
    function hasErrors(diags) {
        return diags.some(function (d) { return d.category === ts.DiagnosticCategory.Error; });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyZm9ybV9jb21waWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9wZXJmb3JtX2NvbXBpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7O0lBRUgsOENBQXVFO0lBQ3ZFLHVCQUF5QjtJQUN6QiwyQkFBNkI7SUFDN0IsK0JBQWlDO0lBRWpDLGdFQUEwQztJQUMxQyx3RUFBa0Q7SUFDbEQsb0VBQTREO0lBRTVELElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQztJQUl2QixTQUFnQix1QkFBdUIsQ0FBQyxXQUF3QjtRQUM5RCxPQUFPLFdBQVcsQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsUUFBUSxLQUFLLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQTVDLENBQTRDLENBQUMsQ0FBQztJQUMvRSxDQUFDO0lBRkQsMERBRUM7SUFFRCxJQUFNLGlCQUFpQixHQUE2QjtRQUNsRCxtQkFBbUIsRUFBRSxjQUFNLE9BQUEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxFQUE1QixDQUE0QjtRQUN2RCxvQkFBb0IsRUFBRSxVQUFBLFFBQVEsSUFBSSxPQUFBLFFBQVEsRUFBUixDQUFRO1FBQzFDLFVBQVUsRUFBRSxjQUFNLE9BQUEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQWQsQ0FBYztLQUNqQyxDQUFDO0lBRUYsU0FBUyxlQUFlLENBQUMsUUFBZ0IsRUFBRSxJQUE4QjtRQUN2RSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDeEYsQ0FBQztJQUVELFNBQWdCLHdCQUF3QixDQUNwQyxRQUFrQixFQUFFLElBQWtEO1FBQWxELHFCQUFBLEVB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QUMsQ0FBQztJQUNyRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1Bvc2l0aW9uLCBpc1N5bnRheEVycm9yLCBzeW50YXhFcnJvcn0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQgKiBhcyBhcGkgZnJvbSAnLi90cmFuc2Zvcm1lcnMvYXBpJztcbmltcG9ydCAqIGFzIG5nIGZyb20gJy4vdHJhbnNmb3JtZXJzL2VudHJ5X3BvaW50cyc7XG5pbXBvcnQge2NyZWF0ZU1lc3NhZ2VEaWFnbm9zdGljfSBmcm9tICcuL3RyYW5zZm9ybWVycy91dGlsJztcblxuY29uc3QgVFNfRVhUID0gL1xcLnRzJC87XG5cbmV4cG9ydCB0eXBlIERpYWdub3N0aWNzID0gUmVhZG9ubHlBcnJheTx0cy5EaWFnbm9zdGljfGFwaS5EaWFnbm9zdGljPjtcblxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckVycm9yc0FuZFdhcm5pbmdzKGRpYWdub3N0aWNzOiBEaWFnbm9zdGljcyk6IERpYWdub3N0aWNzIHtcbiAgcmV0dXJuIGRpYWdub3N0aWNzLmZpbHRlcihkID0+IGQuY2F0ZWdvcnkgIT09IHRzLkRpYWdub3N0aWNDYXRlZ29yeS5NZXNzYWdlKTtcbn1cblxuY29uc3QgZGVmYXVsdEZvcm1hdEhvc3Q6IHRzLkZvcm1hdERpYWdub3N0aWNzSG9zdCA9IHtcbiAgZ2V0Q3VycmVudERpcmVjdG9yeTogKCkgPT4gdHMuc3lzLmdldEN1cnJlbnREaXJlY3RvcnkoKSxcbiAgZ2V0Q2Fub25pY2FsRmlsZU5hbWU6IGZpbGVOYW1lID0+IGZpbGVOYW1lLFxuICBnZXROZXdMaW5lOiAoKSA9PiB0cy5zeXMubmV3TGluZVxufTtcblxuZnVuY3Rpb24gZGlzcGxheUZpbGVOYW1lKGZpbGVOYW1lOiBzdHJpbmcsIGhvc3Q6IHRzLkZvcm1hdERpYWdub3N0aWNzSG9zdCk6IHN0cmluZyB7XG4gIHJldHVybiBwYXRoLnJlbGF0aXZlKGhvc3QuZ2V0Q3VycmVudERpcmVjdG9yeSgpLCBob3N0LmdldENhbm9uaWNhbEZpbGVOYW1lKGZpbGVOYW1lKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXREaWFnbm9zdGljUG9zaXRpb24oXG4gICAgcG9zaXRpb246IFBvc2l0aW9uLCBob3N0OiB0cy5Gb3JtYXREaWFnbm9zdGljc0hvc3QgPSBkZWZhdWx0Rm9ybWF0SG9zdCk6IHN0cmluZyB7XG4gIHJldHVybiBgJHtkaXNwbGF5RmlsZU5hbWUocG9zaXRpb24uZmlsZU5hbWUsIGhvc3QpfSgke3Bvc2l0aW9uLmxpbmUgKyAxfSwke3Bvc2l0aW9uLmNvbHVtbisxfSlgO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmxhdHRlbkRpYWdub3N0aWNNZXNzYWdlQ2hhaW4oXG4gICAgY2hhaW46IGFwaS5EaWFnbm9zdGljTWVzc2FnZUNoYWluLCBob3N0OiB0cy5Gb3JtYXREaWFnbm9zdGljc0hvc3QgPSBkZWZhdWx0Rm9ybWF0SG9zdCk6IHN0cmluZyB7XG4gIGxldCByZXN1bHQgPSBjaGFpbi5tZXNzYWdlVGV4dDtcbiAgbGV0IGluZGVudCA9IDE7XG4gIGxldCBjdXJyZW50ID0gY2hhaW4ubmV4dDtcbiAgY29uc3QgbmV3TGluZSA9IGhvc3QuZ2V0TmV3TGluZSgpO1xuICB3aGlsZSAoY3VycmVudCkge1xuICAgIHJlc3VsdCArPSBuZXdMaW5lO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5kZW50OyBpKyspIHtcbiAgICAgIHJlc3VsdCArPSAnICAnO1xuICAgIH1cbiAgICByZXN1bHQgKz0gY3VycmVudC5tZXNzYWdlVGV4dDtcbiAgICBjb25zdCBwb3NpdGlvbiA9IGN1cnJlbnQucG9zaXRpb247XG4gICAgaWYgKHBvc2l0aW9uKSB7XG4gICAgICByZXN1bHQgKz0gYCBhdCAke2Zvcm1hdERpYWdub3N0aWNQb3NpdGlvbihwb3NpdGlvbiwgaG9zdCl9YDtcbiAgICB9XG4gICAgY3VycmVudCA9IGN1cnJlbnQubmV4dDtcbiAgICBpbmRlbnQrKztcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0RGlhZ25vc3RpYyhcbiAgICBkaWFnbm9zdGljOiBhcGkuRGlhZ25vc3RpYywgaG9zdDogdHMuRm9ybWF0RGlhZ25vc3RpY3NIb3N0ID0gZGVmYXVsdEZvcm1hdEhvc3QpIHtcbiAgbGV0IHJlc3VsdCA9ICcnO1xuICBjb25zdCBuZXdMaW5lID0gaG9zdC5nZXROZXdMaW5lKCk7XG4gIGNvbnN0IHNwYW4gPSBkaWFnbm9zdGljLnNwYW47XG4gIGlmIChzcGFuKSB7XG4gICAgcmVzdWx0ICs9IGAke2Zvcm1hdERpYWdub3N0aWNQb3NpdGlvbih7XG4gICAgICBmaWxlTmFtZTogc3Bhbi5zdGFydC5maWxlLnVybCxcbiAgICAgIGxpbmU6IHNwYW4uc3RhcnQubGluZSxcbiAgICAgIGNvbHVtbjogc3Bhbi5zdGFydC5jb2xcbiAgICB9LCBob3N0KX06IGA7XG4gIH0gZWxzZSBpZiAoZGlhZ25vc3RpYy5wb3NpdGlvbikge1xuICAgIHJlc3VsdCArPSBgJHtmb3JtYXREaWFnbm9zdGljUG9zaXRpb24oZGlhZ25vc3RpYy5wb3NpdGlvbiwgaG9zdCl9OiBgO1xuICB9XG4gIGlmIChkaWFnbm9zdGljLnNwYW4gJiYgZGlhZ25vc3RpYy5zcGFuLmRldGFpbHMpIHtcbiAgICByZXN1bHQgKz0gYDogJHtkaWFnbm9zdGljLnNwYW4uZGV0YWlsc30sICR7ZGlhZ25vc3RpYy5tZXNzYWdlVGV4dH0ke25ld0xpbmV9YDtcbiAgfSBlbHNlIGlmIChkaWFnbm9zdGljLmNoYWluKSB7XG4gICAgcmVzdWx0ICs9IGAke2ZsYXR0ZW5EaWFnbm9zdGljTWVzc2FnZUNoYWluKGRpYWdub3N0aWMuY2hhaW4sIGhvc3QpfS4ke25ld0xpbmV9YDtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQgKz0gYDogJHtkaWFnbm9zdGljLm1lc3NhZ2VUZXh0fSR7bmV3TGluZX1gO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXREaWFnbm9zdGljcyhcbiAgICBkaWFnczogRGlhZ25vc3RpY3MsIGhvc3Q6IHRzLkZvcm1hdERpYWdub3N0aWNzSG9zdCA9IGRlZmF1bHRGb3JtYXRIb3N0KTogc3RyaW5nIHtcbiAgaWYgKGRpYWdzICYmIGRpYWdzLmxlbmd0aCkge1xuICAgIHJldHVybiBkaWFnc1xuICAgICAgICAubWFwKGRpYWdub3N0aWMgPT4ge1xuICAgICAgICAgIGlmIChhcGkuaXNUc0RpYWdub3N0aWMoZGlhZ25vc3RpYykpIHtcbiAgICAgICAgICAgIHJldHVybiB0cy5mb3JtYXREaWFnbm9zdGljcyhbZGlhZ25vc3RpY10sIGhvc3QpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZm9ybWF0RGlhZ25vc3RpYyhkaWFnbm9zdGljLCBob3N0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5qb2luKCcnKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBQYXJzZWRDb25maWd1cmF0aW9uIHtcbiAgcHJvamVjdDogc3RyaW5nO1xuICBvcHRpb25zOiBhcGkuQ29tcGlsZXJPcHRpb25zO1xuICByb290TmFtZXM6IHN0cmluZ1tdO1xuICBlbWl0RmxhZ3M6IGFwaS5FbWl0RmxhZ3M7XG4gIGVycm9yczogRGlhZ25vc3RpY3M7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjYWxjUHJvamVjdEZpbGVBbmRCYXNlUGF0aChwcm9qZWN0OiBzdHJpbmcpOlxuICAgIHtwcm9qZWN0RmlsZTogc3RyaW5nLCBiYXNlUGF0aDogc3RyaW5nfSB7XG4gIGNvbnN0IHByb2plY3RJc0RpciA9IGZzLmxzdGF0U3luYyhwcm9qZWN0KS5pc0RpcmVjdG9yeSgpO1xuICBjb25zdCBwcm9qZWN0RmlsZSA9IHByb2plY3RJc0RpciA/IHBhdGguam9pbihwcm9qZWN0LCAndHNjb25maWcuanNvbicpIDogcHJvamVjdDtcbiAgY29uc3QgcHJvamVjdERpciA9IHByb2plY3RJc0RpciA/IHByb2plY3QgOiBwYXRoLmRpcm5hbWUocHJvamVjdCk7XG4gIGNvbnN0IGJhc2VQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksIHByb2plY3REaXIpO1xuICByZXR1cm4ge3Byb2plY3RGaWxlLCBiYXNlUGF0aH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVOZ0NvbXBpbGVyT3B0aW9ucyhcbiAgICBiYXNlUGF0aDogc3RyaW5nLCBjb25maWc6IGFueSwgdHNPcHRpb25zOiB0cy5Db21waWxlck9wdGlvbnMpOiBhcGkuQ29tcGlsZXJPcHRpb25zIHtcbiAgLy8gZW5hYmxlSXZ5IGBuZ3RzY2AgaXMgYW4gYWxpYXMgZm9yIGB0cnVlYC5cbiAgaWYgKGNvbmZpZy5hbmd1bGFyQ29tcGlsZXJPcHRpb25zICYmIGNvbmZpZy5hbmd1bGFyQ29tcGlsZXJPcHRpb25zLmVuYWJsZUl2eSA9PT0gJ25ndHNjJykge1xuICAgIGNvbmZpZy5hbmd1bGFyQ29tcGlsZXJPcHRpb25zLmVuYWJsZUl2eSA9IHRydWU7XG4gIH1cbiAgcmV0dXJuIHsuLi50c09wdGlvbnMsIC4uLmNvbmZpZy5hbmd1bGFyQ29tcGlsZXJPcHRpb25zLCBnZW5EaXI6IGJhc2VQYXRoLCBiYXNlUGF0aH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWFkQ29uZmlndXJhdGlvbihcbiAgICBwcm9qZWN0OiBzdHJpbmcsIGV4aXN0aW5nT3B0aW9ucz86IHRzLkNvbXBpbGVyT3B0aW9ucyk6IFBhcnNlZENvbmZpZ3VyYXRpb24ge1xuICB0cnkge1xuICAgIGNvbnN0IHtwcm9qZWN0RmlsZSwgYmFzZVBhdGh9ID0gY2FsY1Byb2plY3RGaWxlQW5kQmFzZVBhdGgocHJvamVjdCk7XG5cbiAgICBjb25zdCByZWFkRXh0ZW5kZWRDb25maWdGaWxlID1cbiAgICAgICAgKGNvbmZpZ0ZpbGU6IHN0cmluZywgZXhpc3RpbmdDb25maWc/OiBhbnkpOiB7Y29uZmlnPzogYW55LCBlcnJvcj86IHRzLkRpYWdub3N0aWN9ID0+IHtcbiAgICAgICAgICBjb25zdCB7Y29uZmlnLCBlcnJvcn0gPSB0cy5yZWFkQ29uZmlnRmlsZShjb25maWdGaWxlLCB0cy5zeXMucmVhZEZpbGUpO1xuXG4gICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4ge2Vycm9yfTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyB3ZSBhcmUgb25seSBpbnRlcmVzdGVkIGludG8gbWVyZ2luZyAnYW5ndWxhckNvbXBpbGVyT3B0aW9ucycgYXNcbiAgICAgICAgICAvLyBvdGhlciBvcHRpb25zIGxpa2UgJ2NvbXBpbGVyT3B0aW9ucycgYXJlIG1lcmdlZCBieSBUU1xuICAgICAgICAgIGNvbnN0IGJhc2VDb25maWcgPSBleGlzdGluZ0NvbmZpZyB8fCBjb25maWc7XG4gICAgICAgICAgaWYgKGV4aXN0aW5nQ29uZmlnKSB7XG4gICAgICAgICAgICBiYXNlQ29uZmlnLmFuZ3VsYXJDb21waWxlck9wdGlvbnMgPSB7Li4uY29uZmlnLmFuZ3VsYXJDb21waWxlck9wdGlvbnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uYmFzZUNvbmZpZy5hbmd1bGFyQ29tcGlsZXJPcHRpb25zfTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoY29uZmlnLmV4dGVuZHMpIHtcbiAgICAgICAgICAgIGxldCBleHRlbmRlZENvbmZpZ1BhdGggPSBwYXRoLnJlc29sdmUocGF0aC5kaXJuYW1lKGNvbmZpZ0ZpbGUpLCBjb25maWcuZXh0ZW5kcyk7XG4gICAgICAgICAgICBleHRlbmRlZENvbmZpZ1BhdGggPSBwYXRoLmV4dG5hbWUoZXh0ZW5kZWRDb25maWdQYXRoKSA/IGV4dGVuZGVkQ29uZmlnUGF0aCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAke2V4dGVuZGVkQ29uZmlnUGF0aH0uanNvbmA7XG5cbiAgICAgICAgICAgIGlmIChmcy5leGlzdHNTeW5jKGV4dGVuZGVkQ29uZmlnUGF0aCkpIHtcbiAgICAgICAgICAgICAgLy8gQ2FsbCByZWFkIGNvbmZpZyByZWN1cnNpdmVseSBhcyBUeXBlU2NyaXB0IG9ubHkgbWVyZ2VzIENvbXBpbGVyT3B0aW9uc1xuICAgICAgICAgICAgICByZXR1cm4gcmVhZEV4dGVuZGVkQ29uZmlnRmlsZShleHRlbmRlZENvbmZpZ1BhdGgsIGJhc2VDb25maWcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB7Y29uZmlnOiBiYXNlQ29uZmlnfTtcbiAgICAgICAgfTtcblxuICAgIGNvbnN0IHtjb25maWcsIGVycm9yfSA9IHJlYWRFeHRlbmRlZENvbmZpZ0ZpbGUocHJvamVjdEZpbGUpO1xuXG4gICAgaWYgKGVycm9yKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwcm9qZWN0LFxuICAgICAgICBlcnJvcnM6IFtlcnJvcl0sXG4gICAgICAgIHJvb3ROYW1lczogW10sXG4gICAgICAgIG9wdGlvbnM6IHt9LFxuICAgICAgICBlbWl0RmxhZ3M6IGFwaS5FbWl0RmxhZ3MuRGVmYXVsdFxuICAgICAgfTtcbiAgICB9XG4gICAgY29uc3QgcGFyc2VDb25maWdIb3N0ID0ge1xuICAgICAgdXNlQ2FzZVNlbnNpdGl2ZUZpbGVOYW1lczogdHJ1ZSxcbiAgICAgIGZpbGVFeGlzdHM6IGZzLmV4aXN0c1N5bmMsXG4gICAgICByZWFkRGlyZWN0b3J5OiB0cy5zeXMucmVhZERpcmVjdG9yeSxcbiAgICAgIHJlYWRGaWxlOiB0cy5zeXMucmVhZEZpbGVcbiAgICB9O1xuICAgIGNvbnN0IGNvbmZpZ0ZpbGVOYW1lID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksIHByb2plY3RGaWxlKTtcbiAgICBjb25zdCBwYXJzZWQgPSB0cy5wYXJzZUpzb25Db25maWdGaWxlQ29udGVudChcbiAgICAgICAgY29uZmlnLCBwYXJzZUNvbmZpZ0hvc3QsIGJhc2VQYXRoLCBleGlzdGluZ09wdGlvbnMsIGNvbmZpZ0ZpbGVOYW1lKTtcbiAgICBjb25zdCByb290TmFtZXMgPSBwYXJzZWQuZmlsZU5hbWVzLm1hcChmID0+IHBhdGgubm9ybWFsaXplKGYpKTtcblxuICAgIGNvbnN0IG9wdGlvbnMgPSBjcmVhdGVOZ0NvbXBpbGVyT3B0aW9ucyhiYXNlUGF0aCwgY29uZmlnLCBwYXJzZWQub3B0aW9ucyk7XG4gICAgbGV0IGVtaXRGbGFncyA9IGFwaS5FbWl0RmxhZ3MuRGVmYXVsdDtcbiAgICBpZiAoIShvcHRpb25zLnNraXBNZXRhZGF0YUVtaXQgfHwgb3B0aW9ucy5mbGF0TW9kdWxlT3V0RmlsZSkpIHtcbiAgICAgIGVtaXRGbGFncyB8PSBhcGkuRW1pdEZsYWdzLk1ldGFkYXRhO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy5za2lwVGVtcGxhdGVDb2RlZ2VuKSB7XG4gICAgICBlbWl0RmxhZ3MgPSBlbWl0RmxhZ3MgJiB+YXBpLkVtaXRGbGFncy5Db2RlZ2VuO1xuICAgIH1cbiAgICByZXR1cm4ge3Byb2plY3Q6IHByb2plY3RGaWxlLCByb290TmFtZXMsIG9wdGlvbnMsIGVycm9yczogcGFyc2VkLmVycm9ycywgZW1pdEZsYWdzfTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnN0IGVycm9yczogRGlhZ25vc3RpY3MgPSBbe1xuICAgICAgY2F0ZWdvcnk6IHRzLkRpYWdub3N0aWNDYXRlZ29yeS5FcnJvcixcbiAgICAgIG1lc3NhZ2VUZXh0OiBlLnN0YWNrLFxuICAgICAgc291cmNlOiBhcGkuU09VUkNFLFxuICAgICAgY29kZTogYXBpLlVOS05PV05fRVJST1JfQ09ERVxuICAgIH1dO1xuICAgIHJldHVybiB7cHJvamVjdDogJycsIGVycm9ycywgcm9vdE5hbWVzOiBbXSwgb3B0aW9uczoge30sIGVtaXRGbGFnczogYXBpLkVtaXRGbGFncy5EZWZhdWx0fTtcbiAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFBlcmZvcm1Db21waWxhdGlvblJlc3VsdCB7XG4gIGRpYWdub3N0aWNzOiBEaWFnbm9zdGljcztcbiAgcHJvZ3JhbT86IGFwaS5Qcm9ncmFtO1xuICBlbWl0UmVzdWx0PzogdHMuRW1pdFJlc3VsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV4aXRDb2RlRnJvbVJlc3VsdChkaWFnczogRGlhZ25vc3RpY3MgfCB1bmRlZmluZWQpOiBudW1iZXIge1xuICBpZiAoIWRpYWdzIHx8IGZpbHRlckVycm9yc0FuZFdhcm5pbmdzKGRpYWdzKS5sZW5ndGggPT09IDApIHtcbiAgICAvLyBJZiB3ZSBoYXZlIGEgcmVzdWx0IGFuZCBkaWRuJ3QgZ2V0IGFueSBlcnJvcnMsIHdlIHN1Y2NlZWRlZC5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIC8vIFJldHVybiAyIGlmIGFueSBvZiB0aGUgZXJyb3JzIHdlcmUgdW5rbm93bi5cbiAgcmV0dXJuIGRpYWdzLnNvbWUoZCA9PiBkLnNvdXJjZSA9PT0gJ2FuZ3VsYXInICYmIGQuY29kZSA9PT0gYXBpLlVOS05PV05fRVJST1JfQ09ERSkgPyAyIDogMTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBlcmZvcm1Db21waWxhdGlvbih7cm9vdE5hbWVzLCBvcHRpb25zLCBob3N0LCBvbGRQcm9ncmFtLCBlbWl0Q2FsbGJhY2ssXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXJnZUVtaXRSZXN1bHRzQ2FsbGJhY2ssXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnYXRoZXJEaWFnbm9zdGljcyA9IGRlZmF1bHRHYXRoZXJEaWFnbm9zdGljcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1c3RvbVRyYW5zZm9ybWVycywgZW1pdEZsYWdzID0gYXBpLkVtaXRGbGFncy5EZWZhdWx0fToge1xuICByb290TmFtZXM6IHN0cmluZ1tdLFxuICBvcHRpb25zOiBhcGkuQ29tcGlsZXJPcHRpb25zLFxuICBob3N0PzogYXBpLkNvbXBpbGVySG9zdCxcbiAgb2xkUHJvZ3JhbT86IGFwaS5Qcm9ncmFtLFxuICBlbWl0Q2FsbGJhY2s/OiBhcGkuVHNFbWl0Q2FsbGJhY2ssXG4gIG1lcmdlRW1pdFJlc3VsdHNDYWxsYmFjaz86IGFwaS5Uc01lcmdlRW1pdFJlc3VsdHNDYWxsYmFjayxcbiAgZ2F0aGVyRGlhZ25vc3RpY3M/OiAocHJvZ3JhbTogYXBpLlByb2dyYW0pID0+IERpYWdub3N0aWNzLFxuICBjdXN0b21UcmFuc2Zvcm1lcnM/OiBhcGkuQ3VzdG9tVHJhbnNmb3JtZXJzLFxuICBlbWl0RmxhZ3M/OiBhcGkuRW1pdEZsYWdzXG59KTogUGVyZm9ybUNvbXBpbGF0aW9uUmVzdWx0IHtcbiAgbGV0IHByb2dyYW06IGFwaS5Qcm9ncmFtfHVuZGVmaW5lZDtcbiAgbGV0IGVtaXRSZXN1bHQ6IHRzLkVtaXRSZXN1bHR8dW5kZWZpbmVkO1xuICBsZXQgYWxsRGlhZ25vc3RpY3M6IEFycmF5PHRzLkRpYWdub3N0aWN8YXBpLkRpYWdub3N0aWM+ID0gW107XG4gIHRyeSB7XG4gICAgaWYgKCFob3N0KSB7XG4gICAgICBob3N0ID0gbmcuY3JlYXRlQ29tcGlsZXJIb3N0KHtvcHRpb25zfSk7XG4gICAgfVxuXG4gICAgcHJvZ3JhbSA9IG5nLmNyZWF0ZVByb2dyYW0oe3Jvb3ROYW1lcywgaG9zdCwgb3B0aW9ucywgb2xkUHJvZ3JhbX0pO1xuXG4gICAgY29uc3QgYmVmb3JlRGlhZ3MgPSBEYXRlLm5vdygpO1xuICAgIGFsbERpYWdub3N0aWNzLnB1c2goLi4uZ2F0aGVyRGlhZ25vc3RpY3MocHJvZ3JhbSAhKSk7XG4gICAgaWYgKG9wdGlvbnMuZGlhZ25vc3RpY3MpIHtcbiAgICAgIGNvbnN0IGFmdGVyRGlhZ3MgPSBEYXRlLm5vdygpO1xuICAgICAgYWxsRGlhZ25vc3RpY3MucHVzaChcbiAgICAgICAgICBjcmVhdGVNZXNzYWdlRGlhZ25vc3RpYyhgVGltZSBmb3IgZGlhZ25vc3RpY3M6ICR7YWZ0ZXJEaWFncyAtIGJlZm9yZURpYWdzfW1zLmApKTtcbiAgICB9XG5cbiAgICBpZiAoIWhhc0Vycm9ycyhhbGxEaWFnbm9zdGljcykpIHtcbiAgICAgIGVtaXRSZXN1bHQgPVxuICAgICAgICAgIHByb2dyYW0gIS5lbWl0KHtlbWl0Q2FsbGJhY2ssIG1lcmdlRW1pdFJlc3VsdHNDYWxsYmFjaywgY3VzdG9tVHJhbnNmb3JtZXJzLCBlbWl0RmxhZ3N9KTtcbiAgICAgIGFsbERpYWdub3N0aWNzLnB1c2goLi4uZW1pdFJlc3VsdC5kaWFnbm9zdGljcyk7XG4gICAgICByZXR1cm4ge2RpYWdub3N0aWNzOiBhbGxEaWFnbm9zdGljcywgcHJvZ3JhbSwgZW1pdFJlc3VsdH07XG4gICAgfVxuICAgIHJldHVybiB7ZGlhZ25vc3RpY3M6IGFsbERpYWdub3N0aWNzLCBwcm9ncmFtfTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGxldCBlcnJNc2c6IHN0cmluZztcbiAgICBsZXQgY29kZTogbnVtYmVyO1xuICAgIGlmIChpc1N5bnRheEVycm9yKGUpKSB7XG4gICAgICAvLyBkb24ndCByZXBvcnQgdGhlIHN0YWNrIGZvciBzeW50YXggZXJyb3JzIGFzIHRoZXkgYXJlIHdlbGwga25vd24gZXJyb3JzLlxuICAgICAgZXJyTXNnID0gZS5tZXNzYWdlO1xuICAgICAgY29kZSA9IGFwaS5ERUZBVUxUX0VSUk9SX0NPREU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVyck1zZyA9IGUuc3RhY2s7XG4gICAgICAvLyBJdCBpcyBub3QgYSBzeW50YXggZXJyb3Igd2UgbWlnaHQgaGF2ZSBhIHByb2dyYW0gd2l0aCB1bmtub3duIHN0YXRlLCBkaXNjYXJkIGl0LlxuICAgICAgcHJvZ3JhbSA9IHVuZGVmaW5lZDtcbiAgICAgIGNvZGUgPSBhcGkuVU5LTk9XTl9FUlJPUl9DT0RFO1xuICAgIH1cbiAgICBhbGxEaWFnbm9zdGljcy5wdXNoKFxuICAgICAgICB7Y2F0ZWdvcnk6IHRzLkRpYWdub3N0aWNDYXRlZ29yeS5FcnJvciwgbWVzc2FnZVRleHQ6IGVyck1zZywgY29kZSwgc291cmNlOiBhcGkuU09VUkNFfSk7XG4gICAgcmV0dXJuIHtkaWFnbm9zdGljczogYWxsRGlhZ25vc3RpY3MsIHByb2dyYW19O1xuICB9XG59XG5mdW5jdGlvbiBkZWZhdWx0R2F0aGVyRGlhZ25vc3RpY3MocHJvZ3JhbTogYXBpLlByb2dyYW0pOiBEaWFnbm9zdGljcyB7XG4gIGNvbnN0IGFsbERpYWdub3N0aWNzOiBBcnJheTx0cy5EaWFnbm9zdGljfGFwaS5EaWFnbm9zdGljPiA9IFtdO1xuXG4gIGZ1bmN0aW9uIGNoZWNrRGlhZ25vc3RpY3MoZGlhZ3M6IERpYWdub3N0aWNzIHwgdW5kZWZpbmVkKSB7XG4gICAgaWYgKGRpYWdzKSB7XG4gICAgICBhbGxEaWFnbm9zdGljcy5wdXNoKC4uLmRpYWdzKTtcbiAgICAgIHJldHVybiAhaGFzRXJyb3JzKGRpYWdzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBsZXQgY2hlY2tPdGhlckRpYWdub3N0aWNzID0gdHJ1ZTtcbiAgLy8gQ2hlY2sgcGFyYW1ldGVyIGRpYWdub3N0aWNzXG4gIGNoZWNrT3RoZXJEaWFnbm9zdGljcyA9IGNoZWNrT3RoZXJEaWFnbm9zdGljcyAmJlxuICAgICAgY2hlY2tEaWFnbm9zdGljcyhbLi4ucHJvZ3JhbS5nZXRUc09wdGlvbkRpYWdub3N0aWNzKCksIC4uLnByb2dyYW0uZ2V0TmdPcHRpb25EaWFnbm9zdGljcygpXSk7XG5cbiAgLy8gQ2hlY2sgc3ludGFjdGljIGRpYWdub3N0aWNzXG4gIGNoZWNrT3RoZXJEaWFnbm9zdGljcyA9XG4gICAgICBjaGVja090aGVyRGlhZ25vc3RpY3MgJiYgY2hlY2tEaWFnbm9zdGljcyhwcm9ncmFtLmdldFRzU3ludGFjdGljRGlhZ25vc3RpY3MoKSBhcyBEaWFnbm9zdGljcyk7XG5cbiAgLy8gQ2hlY2sgVHlwZVNjcmlwdCBzZW1hbnRpYyBhbmQgQW5ndWxhciBzdHJ1Y3R1cmUgZGlhZ25vc3RpY3NcbiAgY2hlY2tPdGhlckRpYWdub3N0aWNzID1cbiAgICAgIGNoZWNrT3RoZXJEaWFnbm9zdGljcyAmJlxuICAgICAgY2hlY2tEaWFnbm9zdGljcyhcbiAgICAgICAgICBbLi4ucHJvZ3JhbS5nZXRUc1NlbWFudGljRGlhZ25vc3RpY3MoKSwgLi4ucHJvZ3JhbS5nZXROZ1N0cnVjdHVyYWxEaWFnbm9zdGljcygpXSk7XG5cbiAgLy8gQ2hlY2sgQW5ndWxhciBzZW1hbnRpYyBkaWFnbm9zdGljc1xuICBjaGVja090aGVyRGlhZ25vc3RpY3MgPVxuICAgICAgY2hlY2tPdGhlckRpYWdub3N0aWNzICYmIGNoZWNrRGlhZ25vc3RpY3MocHJvZ3JhbS5nZXROZ1NlbWFudGljRGlhZ25vc3RpY3MoKSBhcyBEaWFnbm9zdGljcyk7XG5cbiAgcmV0dXJuIGFsbERpYWdub3N0aWNzO1xufVxuXG5mdW5jdGlvbiBoYXNFcnJvcnMoZGlhZ3M6IERpYWdub3N0aWNzKSB7XG4gIHJldHVybiBkaWFncy5zb21lKGQgPT4gZC5jYXRlZ29yeSA9PT0gdHMuRGlhZ25vc3RpY0NhdGVnb3J5LkVycm9yKTtcbn1cbiJdfQ==