#!/usr/bin/env node
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
        define("@angular/compiler-cli/src/main", ["require", "exports", "tslib", "reflect-metadata", "typescript", "@angular/compiler-cli/src/ngtsc/diagnostics", "@angular/compiler-cli/src/transformers/api", "@angular/compiler-cli/src/transformers/util", "@angular/compiler-cli/src/perform_compile", "@angular/compiler-cli/src/perform_watch"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    // Must be imported first, because Angular decorators throw on load.
    require("reflect-metadata");
    var ts = require("typescript");
    var diagnostics_1 = require("@angular/compiler-cli/src/ngtsc/diagnostics");
    var api = require("@angular/compiler-cli/src/transformers/api");
    var util_1 = require("@angular/compiler-cli/src/transformers/util");
    var perform_compile_1 = require("@angular/compiler-cli/src/perform_compile");
    var perform_watch_1 = require("@angular/compiler-cli/src/perform_watch");
    function main(args, consoleError, config, customTransformers, programReuse) {
        if (consoleError === void 0) { consoleError = console.error; }
        var _a = config || readNgcCommandLineAndConfiguration(args), project = _a.project, rootNames = _a.rootNames, options = _a.options, configErrors = _a.errors, watch = _a.watch, emitFlags = _a.emitFlags;
        if (configErrors.length) {
            return reportErrorsAndExit(configErrors, /*options*/ undefined, consoleError);
        }
        if (watch) {
            var result = watchMode(project, options, consoleError);
            return reportErrorsAndExit(result.firstCompileResult, options, consoleError);
        }
        var oldProgram;
        if (programReuse !== undefined) {
            oldProgram = programReuse.program;
        }
        var _b = perform_compile_1.performCompilation({
            rootNames: rootNames,
            options: options,
            emitFlags: emitFlags,
            oldProgram: oldProgram,
            emitCallback: createEmitCallback(options), customTransformers: customTransformers
        }), compileDiags = _b.diagnostics, program = _b.program;
        if (programReuse !== undefined) {
            programReuse.program = program;
        }
        return reportErrorsAndExit(compileDiags, options, consoleError);
    }
    exports.main = main;
    function mainDiagnosticsForTest(args, config) {
        var _a = config || readNgcCommandLineAndConfiguration(args), project = _a.project, rootNames = _a.rootNames, options = _a.options, configErrors = _a.errors, watch = _a.watch, emitFlags = _a.emitFlags;
        if (configErrors.length) {
            return configErrors;
        }
        var compileDiags = perform_compile_1.performCompilation({ rootNames: rootNames, options: options, emitFlags: emitFlags, emitCallback: createEmitCallback(options) }).diagnostics;
        return compileDiags;
    }
    exports.mainDiagnosticsForTest = mainDiagnosticsForTest;
    function createEmitCallback(options) {
        var transformDecorators = !options.enableIvy && options.annotationsAs !== 'decorators';
        var transformTypesToClosure = options.annotateForClosureCompiler;
        if (!transformDecorators && !transformTypesToClosure) {
            return undefined;
        }
        if (transformDecorators) {
            // This is needed as a workaround for https://github.com/angular/tsickle/issues/635
            // Otherwise tsickle might emit references to non imported values
            // as TypeScript elided the import.
            options.emitDecoratorMetadata = true;
        }
        var tsickleHost = {
            shouldSkipTsickleProcessing: function (fileName) {
                return /\.d\.ts$/.test(fileName) || util_1.GENERATED_FILES.test(fileName);
            },
            pathToModuleName: function (context, importPath) { return ''; },
            shouldIgnoreWarningsForPath: function (filePath) { return false; },
            fileNameToModuleId: function (fileName) { return fileName; },
            googmodule: false,
            untyped: true,
            convertIndexImportShorthand: false, transformDecorators: transformDecorators, transformTypesToClosure: transformTypesToClosure,
        };
        if (options.annotateForClosureCompiler || options.annotationsAs === 'static fields') {
            return function (_a) {
                var program = _a.program, targetSourceFile = _a.targetSourceFile, writeFile = _a.writeFile, cancellationToken = _a.cancellationToken, emitOnlyDtsFiles = _a.emitOnlyDtsFiles, _b = _a.customTransformers, customTransformers = _b === void 0 ? {} : _b, host = _a.host, options = _a.options;
                // tslint:disable-next-line:no-require-imports only depend on tsickle if requested
                return require('tsickle').emitWithTsickle(program, tslib_1.__assign({}, tsickleHost, { options: options, host: host }), host, options, targetSourceFile, writeFile, cancellationToken, emitOnlyDtsFiles, {
                    beforeTs: customTransformers.before,
                    afterTs: customTransformers.after,
                });
            };
        }
        else {
            return function (_a) {
                var program = _a.program, targetSourceFile = _a.targetSourceFile, writeFile = _a.writeFile, cancellationToken = _a.cancellationToken, emitOnlyDtsFiles = _a.emitOnlyDtsFiles, _b = _a.customTransformers, customTransformers = _b === void 0 ? {} : _b;
                return program.emit(targetSourceFile, writeFile, cancellationToken, emitOnlyDtsFiles, { after: customTransformers.after, before: customTransformers.before });
            };
        }
    }
    function readNgcCommandLineAndConfiguration(args) {
        var options = {};
        var parsedArgs = require('minimist')(args);
        if (parsedArgs.i18nFile)
            options.i18nInFile = parsedArgs.i18nFile;
        if (parsedArgs.i18nFormat)
            options.i18nInFormat = parsedArgs.i18nFormat;
        if (parsedArgs.locale)
            options.i18nInLocale = parsedArgs.locale;
        var mt = parsedArgs.missingTranslation;
        if (mt === 'error' || mt === 'warning' || mt === 'ignore') {
            options.i18nInMissingTranslations = mt;
        }
        var config = readCommandLineAndConfiguration(args, options, ['i18nFile', 'i18nFormat', 'locale', 'missingTranslation', 'watch']);
        var watch = parsedArgs.w || parsedArgs.watch;
        return tslib_1.__assign({}, config, { watch: watch });
    }
    exports.readNgcCommandLineAndConfiguration = readNgcCommandLineAndConfiguration;
    function readCommandLineAndConfiguration(args, existingOptions, ngCmdLineOptions) {
        if (existingOptions === void 0) { existingOptions = {}; }
        if (ngCmdLineOptions === void 0) { ngCmdLineOptions = []; }
        var cmdConfig = ts.parseCommandLine(args);
        var project = cmdConfig.options.project || '.';
        var cmdErrors = cmdConfig.errors.filter(function (e) {
            if (typeof e.messageText === 'string') {
                var msg_1 = e.messageText;
                return !ngCmdLineOptions.some(function (o) { return msg_1.indexOf(o) >= 0; });
            }
            return true;
        });
        if (cmdErrors.length) {
            return {
                project: project,
                rootNames: [],
                options: cmdConfig.options,
                errors: cmdErrors,
                emitFlags: api.EmitFlags.Default
            };
        }
        var allDiagnostics = [];
        var config = perform_compile_1.readConfiguration(project, cmdConfig.options);
        var options = tslib_1.__assign({}, config.options, existingOptions);
        if (options.locale) {
            options.i18nInLocale = options.locale;
        }
        return {
            project: project,
            rootNames: config.rootNames, options: options,
            errors: config.errors,
            emitFlags: config.emitFlags
        };
    }
    exports.readCommandLineAndConfiguration = readCommandLineAndConfiguration;
    function getFormatDiagnosticsHost(options) {
        var basePath = options ? options.basePath : undefined;
        return {
            getCurrentDirectory: function () { return basePath || ts.sys.getCurrentDirectory(); },
            // We need to normalize the path separators here because by default, TypeScript
            // compiler hosts use posix canonical paths. In order to print consistent diagnostics,
            // we also normalize the paths.
            getCanonicalFileName: function (fileName) { return fileName.replace(/\\/g, '/'); },
            getNewLine: function () {
                // Manually determine the proper new line string based on the passed compiler
                // options. There is no public TypeScript function that returns the corresponding
                // new line string. see: https://github.com/Microsoft/TypeScript/issues/29581
                if (options && options.newLine !== undefined) {
                    return options.newLine === ts.NewLineKind.LineFeed ? '\n' : '\r\n';
                }
                return ts.sys.newLine;
            },
        };
    }
    function reportErrorsAndExit(allDiagnostics, options, consoleError) {
        if (consoleError === void 0) { consoleError = console.error; }
        var errorsAndWarnings = perform_compile_1.filterErrorsAndWarnings(allDiagnostics);
        if (errorsAndWarnings.length) {
            var formatHost = getFormatDiagnosticsHost(options);
            if (options && options.enableIvy === true) {
                var ngDiagnostics = errorsAndWarnings.filter(api.isNgDiagnostic);
                var tsDiagnostics = errorsAndWarnings.filter(api.isTsDiagnostic);
                consoleError(diagnostics_1.replaceTsWithNgInErrors(ts.formatDiagnosticsWithColorAndContext(tsDiagnostics, formatHost)));
                consoleError(perform_compile_1.formatDiagnostics(ngDiagnostics, formatHost));
            }
            else {
                consoleError(perform_compile_1.formatDiagnostics(errorsAndWarnings, formatHost));
            }
        }
        return perform_compile_1.exitCodeFromResult(allDiagnostics);
    }
    function watchMode(project, options, consoleError) {
        return perform_watch_1.performWatchCompilation(perform_watch_1.createPerformWatchHost(project, function (diagnostics) {
            consoleError(perform_compile_1.formatDiagnostics(diagnostics, getFormatDiagnosticsHost(options)));
        }, options, function (options) { return createEmitCallback(options); }));
    }
    exports.watchMode = watchMode;
    // CLI entry point
    if (require.main === module) {
        var args = process.argv.slice(2);
        process.exitCode = main(args);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0E7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7O0lBRUgsb0VBQW9FO0lBQ3BFLDRCQUEwQjtJQUUxQiwrQkFBaUM7SUFHakMsMkVBQTREO0lBQzVELGdFQUEwQztJQUMxQyxvRUFBb0Q7SUFFcEQsNkVBQW9NO0lBQ3BNLHlFQUFnRjtJQUVoRixTQUFnQixJQUFJLENBQ2hCLElBQWMsRUFBRSxZQUFpRCxFQUNqRSxNQUErQixFQUFFLGtCQUEyQyxFQUFFLFlBRTdFO1FBSGUsNkJBQUEsRUFBQSxlQUFvQyxPQUFPLENBQUMsS0FBSztRQUkvRCxJQUFBLHVEQUNrRCxFQURqRCxvQkFBTyxFQUFFLHdCQUFTLEVBQUUsb0JBQU8sRUFBRSx3QkFBb0IsRUFBRSxnQkFBSyxFQUFFLHdCQUNULENBQUM7UUFDdkQsSUFBSSxZQUFZLENBQUMsTUFBTSxFQUFFO1lBQ3ZCLE9BQU8sbUJBQW1CLENBQUMsWUFBWSxFQUFFLFdBQVcsQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUM7U0FDL0U7UUFDRCxJQUFJLEtBQUssRUFBRTtZQUNULElBQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQ3pELE9BQU8sbUJBQW1CLENBQUMsTUFBTSxDQUFDLGtCQUFrQixFQUFFLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztTQUM5RTtRQUVELElBQUksVUFBaUMsQ0FBQztRQUN0QyxJQUFJLFlBQVksS0FBSyxTQUFTLEVBQUU7WUFDOUIsVUFBVSxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUM7U0FDbkM7UUFFSyxJQUFBOzs7Ozs7VUFNSixFQU5LLDZCQUF5QixFQUFFLG9CQU1oQyxDQUFDO1FBQ0gsSUFBSSxZQUFZLEtBQUssU0FB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SSxLQUFLLE1BQU0sRUFBRTtRQUMzQixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQyxPQUFPLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUMvQiIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcbi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8gTXVzdCBiZSBpbXBvcnRlZCBmaXJzdCwgYmVjYXVzZSBBbmd1bGFyIGRlY29yYXRvcnMgdGhyb3cgb24gbG9hZC5cbmltcG9ydCAncmVmbGVjdC1tZXRhZGF0YSc7XG5cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuaW1wb3J0ICogYXMgdHNpY2tsZSBmcm9tICd0c2lja2xlJztcblxuaW1wb3J0IHtyZXBsYWNlVHNXaXRoTmdJbkVycm9yc30gZnJvbSAnLi9uZ3RzYy9kaWFnbm9zdGljcyc7XG5pbXBvcnQgKiBhcyBhcGkgZnJvbSAnLi90cmFuc2Zvcm1lcnMvYXBpJztcbmltcG9ydCB7R0VORVJBVEVEX0ZJTEVTfSBmcm9tICcuL3RyYW5zZm9ybWVycy91dGlsJztcblxuaW1wb3J0IHtleGl0Q29kZUZyb21SZXN1bHQsIHBlcmZvcm1Db21waWxhdGlvbiwgcmVhZENvbmZpZ3VyYXRpb24sIGZvcm1hdERpYWdub3N0aWNzLCBEaWFnbm9zdGljcywgUGFyc2VkQ29uZmlndXJhdGlvbiwgUGVyZm9ybUNvbXBpbGF0aW9uUmVzdWx0LCBmaWx0ZXJFcnJvcnNBbmRXYXJuaW5nc30gZnJvbSAnLi9wZXJmb3JtX2NvbXBpbGUnO1xuaW1wb3J0IHtwZXJmb3JtV2F0Y2hDb21waWxhdGlvbizCoGNyZWF0ZVBlcmZvcm1XYXRjaEhvc3R9IGZyb20gJy4vcGVyZm9ybV93YXRjaCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWluKFxuICAgIGFyZ3M6IHN0cmluZ1tdLCBjb25zb2xlRXJyb3I6IChzOiBzdHJpbmcpID0+IHZvaWQgPSBjb25zb2xlLmVycm9yLFxuICAgIGNvbmZpZz86IE5nY1BhcnNlZENvbmZpZ3VyYXRpb24sIGN1c3RvbVRyYW5zZm9ybWVycz86IGFwaS5DdXN0b21UcmFuc2Zvcm1lcnMsIHByb2dyYW1SZXVzZT86IHtcbiAgICAgIHByb2dyYW06IGFwaS5Qcm9ncmFtIHwgdW5kZWZpbmVkLFxuICAgIH0pOiBudW1iZXIge1xuICBsZXQge3Byb2plY3QsIHJvb3ROYW1lcywgb3B0aW9ucywgZXJyb3JzOiBjb25maWdFcnJvcnMsIHdhdGNoLCBlbWl0RmxhZ3N9ID1cbiAgICAgIGNvbmZpZyB8fCByZWFkTmdjQ29tbWFuZExpbmVBbmRDb25maWd1cmF0aW9uKGFyZ3MpO1xuICBpZiAoY29uZmlnRXJyb3JzLmxlbmd0aCkge1xuICAgIHJldHVybiByZXBvcnRFcnJvcnNBbmRFeGl0KGNvbmZpZ0Vycm9ycywgLypvcHRpb25zKi8gdW5kZWZpbmVkLCBjb25zb2xlRXJyb3IpO1xuICB9XG4gIGlmICh3YXRjaCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHdhdGNoTW9kZShwcm9qZWN0LCBvcHRpb25zLCBjb25zb2xlRXJyb3IpO1xuICAgIHJldHVybiByZXBvcnRFcnJvcnNBbmRFeGl0KHJlc3VsdC5maXJzdENvbXBpbGVSZXN1bHQsIG9wdGlvbnMsIGNvbnNvbGVFcnJvcik7XG4gIH1cblxuICBsZXQgb2xkUHJvZ3JhbTogYXBpLlByb2dyYW18dW5kZWZpbmVkO1xuICBpZiAocHJvZ3JhbVJldXNlICE9PSB1bmRlZmluZWQpIHtcbiAgICBvbGRQcm9ncmFtID0gcHJvZ3JhbVJldXNlLnByb2dyYW07XG4gIH1cblxuICBjb25zdCB7ZGlhZ25vc3RpY3M6IGNvbXBpbGVEaWFncywgcHJvZ3JhbX0gPSBwZXJmb3JtQ29tcGlsYXRpb24oe1xuICAgIHJvb3ROYW1lcyxcbiAgICBvcHRpb25zLFxuICAgIGVtaXRGbGFncyxcbiAgICBvbGRQcm9ncmFtLFxuICAgIGVtaXRDYWxsYmFjazogY3JlYXRlRW1pdENhbGxiYWNrKG9wdGlvbnMpLCBjdXN0b21UcmFuc2Zvcm1lcnNcbiAgfSk7XG4gIGlmIChwcm9ncmFtUmV1c2UgIT09IHVuZGVmaW5lZCkge1xuICAgIHByb2dyYW1SZXVzZS5wcm9ncmFtID0gcHJvZ3JhbTtcbiAgfVxuICByZXR1cm4gcmVwb3J0RXJyb3JzQW5kRXhpdChjb21waWxlRGlhZ3MsIG9wdGlvbnMsIGNvbnNvbGVFcnJvcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWluRGlhZ25vc3RpY3NGb3JUZXN0KFxuICAgIGFyZ3M6IHN0cmluZ1tdLCBjb25maWc/OiBOZ2NQYXJzZWRDb25maWd1cmF0aW9uKTogUmVhZG9ubHlBcnJheTx0cy5EaWFnbm9zdGljfGFwaS5EaWFnbm9zdGljPiB7XG4gIGxldCB7cHJvamVjdCwgcm9vdE5hbWVzLCBvcHRpb25zLCBlcnJvcnM6IGNvbmZpZ0Vycm9ycywgd2F0Y2gsIGVtaXRGbGFnc30gPVxuICAgICAgY29uZmlnIHx8IHJlYWROZ2NDb21tYW5kTGluZUFuZENvbmZpZ3VyYXRpb24oYXJncyk7XG4gIGlmIChjb25maWdFcnJvcnMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGNvbmZpZ0Vycm9ycztcbiAgfVxuICBjb25zdCB7ZGlhZ25vc3RpY3M6IGNvbXBpbGVEaWFnc30gPSBwZXJmb3JtQ29tcGlsYXRpb24oXG4gICAgICB7cm9vdE5hbWVzLCBvcHRpb25zLCBlbWl0RmxhZ3MsIGVtaXRDYWxsYmFjazogY3JlYXRlRW1pdENhbGxiYWNrKG9wdGlvbnMpfSk7XG4gIHJldHVybiBjb21waWxlRGlhZ3M7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUVtaXRDYWxsYmFjayhvcHRpb25zOiBhcGkuQ29tcGlsZXJPcHRpb25zKTogYXBpLlRzRW1pdENhbGxiYWNrfHVuZGVmaW5lZCB7XG4gIGNvbnN0IHRyYW5zZm9ybURlY29yYXRvcnMgPSAhb3B0aW9ucy5lbmFibGVJdnkgJiYgb3B0aW9ucy5hbm5vdGF0aW9uc0FzICE9PSAnZGVjb3JhdG9ycyc7XG4gIGNvbnN0IHRyYW5zZm9ybVR5cGVzVG9DbG9zdXJlID0gb3B0aW9ucy5hbm5vdGF0ZUZvckNsb3N1cmVDb21waWxlcjtcbiAgaWYgKCF0cmFuc2Zvcm1EZWNvcmF0b3JzICYmICF0cmFuc2Zvcm1UeXBlc1RvQ2xvc3VyZSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgaWYgKHRyYW5zZm9ybURlY29yYXRvcnMpIHtcbiAgICAvLyBUaGlzIGlzIG5lZWRlZCBhcyBhIHdvcmthcm91bmQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL3RzaWNrbGUvaXNzdWVzLzYzNVxuICAgIC8vIE90aGVyd2lzZSB0c2lja2xlIG1pZ2h0IGVtaXQgcmVmZXJlbmNlcyB0byBub24gaW1wb3J0ZWQgdmFsdWVzXG4gICAgLy8gYXMgVHlwZVNjcmlwdCBlbGlkZWQgdGhlIGltcG9ydC5cbiAgICBvcHRpb25zLmVtaXREZWNvcmF0b3JNZXRhZGF0YSA9IHRydWU7XG4gIH1cbiAgY29uc3QgdHNpY2tsZUhvc3Q6IFBpY2s8XG4gICAgICB0c2lja2xlLlRzaWNrbGVIb3N0LCAnc2hvdWxkU2tpcFRzaWNrbGVQcm9jZXNzaW5nJ3wncGF0aFRvTW9kdWxlTmFtZSd8XG4gICAgICAnc2hvdWxkSWdub3JlV2FybmluZ3NGb3JQYXRoJ3wnZmlsZU5hbWVUb01vZHVsZUlkJ3wnZ29vZ21vZHVsZSd8J3VudHlwZWQnfFxuICAgICAgJ2NvbnZlcnRJbmRleEltcG9ydFNob3J0aGFuZCd8J3RyYW5zZm9ybURlY29yYXRvcnMnfCd0cmFuc2Zvcm1UeXBlc1RvQ2xvc3VyZSc+ID0ge1xuICAgIHNob3VsZFNraXBUc2lja2xlUHJvY2Vzc2luZzogKGZpbGVOYW1lKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC9cXC5kXFwudHMkLy50ZXN0KGZpbGVOYW1lKSB8fCBHRU5FUkFURURfRklMRVMudGVzdChmaWxlTmFtZSksXG4gICAgcGF0aFRvTW9kdWxlTmFtZTogKGNvbnRleHQsIGltcG9ydFBhdGgpID0+ICcnLFxuICAgIHNob3VsZElnbm9yZVdhcm5pbmdzRm9yUGF0aDogKGZpbGVQYXRoKSA9PiBmYWxzZSxcbiAgICBmaWxlTmFtZVRvTW9kdWxlSWQ6IChmaWxlTmFtZSkgPT4gZmlsZU5hbWUsXG4gICAgZ29vZ21vZHVsZTogZmFsc2UsXG4gICAgdW50eXBlZDogdHJ1ZSxcbiAgICBjb252ZXJ0SW5kZXhJbXBvcnRTaG9ydGhhbmQ6IGZhbHNlLCB0cmFuc2Zvcm1EZWNvcmF0b3JzLCB0cmFuc2Zvcm1UeXBlc1RvQ2xvc3VyZSxcbiAgfTtcblxuICBpZiAob3B0aW9ucy5hbm5vdGF0ZUZvckNsb3N1cmVDb21waWxlciB8fCBvcHRpb25zLmFubm90YXRpb25zQXMgPT09ICdzdGF0aWMgZmllbGRzJykge1xuICAgIHJldHVybiAoe1xuICAgICAgICAgICAgIHByb2dyYW0sXG4gICAgICAgICAgICAgdGFyZ2V0U291cmNlRmlsZSxcbiAgICAgICAgICAgICB3cml0ZUZpbGUsXG4gICAgICAgICAgICAgY2FuY2VsbGF0aW9uVG9rZW4sXG4gICAgICAgICAgICAgZW1pdE9ubHlEdHNGaWxlcyxcbiAgICAgICAgICAgICBjdXN0b21UcmFuc2Zvcm1lcnMgPSB7fSxcbiAgICAgICAgICAgICBob3N0LFxuICAgICAgICAgICAgIG9wdGlvbnNcbiAgICAgICAgICAgfSkgPT5cbiAgICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1yZXF1aXJlLWltcG9ydHMgb25seSBkZXBlbmQgb24gdHNpY2tsZSBpZiByZXF1ZXN0ZWRcbiAgICAgICAgcmVxdWlyZSgndHNpY2tsZScpLmVtaXRXaXRoVHNpY2tsZShcbiAgICAgICAgICAgIHByb2dyYW0sIHsuLi50c2lja2xlSG9zdCwgb3B0aW9ucywgaG9zdH0sIGhvc3QsIG9wdGlvbnMsIHRhcmdldFNvdXJjZUZpbGUsIHdyaXRlRmlsZSxcbiAgICAgICAgICAgIGNhbmNlbGxhdGlvblRva2VuLCBlbWl0T25seUR0c0ZpbGVzLCB7XG4gICAgICAgICAgICAgIGJlZm9yZVRzOiBjdXN0b21UcmFuc2Zvcm1lcnMuYmVmb3JlLFxuICAgICAgICAgICAgICBhZnRlclRzOiBjdXN0b21UcmFuc2Zvcm1lcnMuYWZ0ZXIsXG4gICAgICAgICAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gKHtcbiAgICAgICAgICAgICBwcm9ncmFtLFxuICAgICAgICAgICAgIHRhcmdldFNvdXJjZUZpbGUsXG4gICAgICAgICAgICAgd3JpdGVGaWxlLFxuICAgICAgICAgICAgIGNhbmNlbGxhdGlvblRva2VuLFxuICAgICAgICAgICAgIGVtaXRPbmx5RHRzRmlsZXMsXG4gICAgICAgICAgICAgY3VzdG9tVHJhbnNmb3JtZXJzID0ge30sXG4gICAgICAgICAgIH0pID0+XG4gICAgICAgICAgICAgICBwcm9ncmFtLmVtaXQoXG4gICAgICAgICAgICAgICAgICAgdGFyZ2V0U291cmNlRmlsZSwgd3JpdGVGaWxlLCBjYW5jZWxsYXRpb25Ub2tlbiwgZW1pdE9ubHlEdHNGaWxlcyxcbiAgICAgICAgICAgICAgICAgICB7YWZ0ZXI6IGN1c3RvbVRyYW5zZm9ybWVycy5hZnRlciwgYmVmb3JlOiBjdXN0b21UcmFuc2Zvcm1lcnMuYmVmb3JlfSk7XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBOZ2NQYXJzZWRDb25maWd1cmF0aW9uIGV4dGVuZHMgUGFyc2VkQ29uZmlndXJhdGlvbiB7IHdhdGNoPzogYm9vbGVhbjsgfVxuXG5leHBvcnQgZnVuY3Rpb24gcmVhZE5nY0NvbW1hbmRMaW5lQW5kQ29uZmlndXJhdGlvbihhcmdzOiBzdHJpbmdbXSk6IE5nY1BhcnNlZENvbmZpZ3VyYXRpb24ge1xuICBjb25zdCBvcHRpb25zOiBhcGkuQ29tcGlsZXJPcHRpb25zID0ge307XG4gIGNvbnN0IHBhcnNlZEFyZ3MgPSByZXF1aXJlKCdtaW5pbWlzdCcpKGFyZ3MpO1xuICBpZiAocGFyc2VkQXJncy5pMThuRmlsZSkgb3B0aW9ucy5pMThuSW5GaWxlID0gcGFyc2VkQXJncy5pMThuRmlsZTtcbiAgaWYgKHBhcnNlZEFyZ3MuaTE4bkZvcm1hdCkgb3B0aW9ucy5pMThuSW5Gb3JtYXQgPSBwYXJzZWRBcmdzLmkxOG5Gb3JtYXQ7XG4gIGlmIChwYXJzZWRBcmdzLmxvY2FsZSkgb3B0aW9ucy5pMThuSW5Mb2NhbGUgPSBwYXJzZWRBcmdzLmxvY2FsZTtcbiAgY29uc3QgbXQgPSBwYXJzZWRBcmdzLm1pc3NpbmdUcmFuc2xhdGlvbjtcbiAgaWYgKG10ID09PSAnZXJyb3InIHx8IG10ID09PSAnd2FybmluZycgfHwgbXQgPT09ICdpZ25vcmUnKSB7XG4gICAgb3B0aW9ucy5pMThuSW5NaXNzaW5nVHJhbnNsYXRpb25zID0gbXQ7XG4gIH1cbiAgY29uc3QgY29uZmlnID0gcmVhZENvbW1hbmRMaW5lQW5kQ29uZmlndXJhdGlvbihcbiAgICAgIGFyZ3MsIG9wdGlvbnMsIFsnaTE4bkZpbGUnLCAnaTE4bkZvcm1hdCcsICdsb2NhbGUnLCAnbWlzc2luZ1RyYW5zbGF0aW9uJywgJ3dhdGNoJ10pO1xuICBjb25zdCB3YXRjaCA9IHBhcnNlZEFyZ3MudyB8fCBwYXJzZWRBcmdzLndhdGNoO1xuICByZXR1cm4gey4uLmNvbmZpZywgd2F0Y2h9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVhZENvbW1hbmRMaW5lQW5kQ29uZmlndXJhdGlvbihcbiAgICBhcmdzOiBzdHJpbmdbXSwgZXhpc3RpbmdPcHRpb25zOiBhcGkuQ29tcGlsZXJPcHRpb25zID0ge30sXG4gICAgbmdDbWRMaW5lT3B0aW9uczogc3RyaW5nW10gPSBbXSk6IFBhcnNlZENvbmZpZ3VyYXRpb24ge1xuICBsZXQgY21kQ29uZmlnID0gdHMucGFyc2VDb21tYW5kTGluZShhcmdzKTtcbiAgY29uc3QgcHJvamVjdCA9IGNtZENvbmZpZy5vcHRpb25zLnByb2plY3QgfHwgJy4nO1xuICBjb25zdCBjbWRFcnJvcnMgPSBjbWRDb25maWcuZXJyb3JzLmZpbHRlcihlID0+IHtcbiAgICBpZiAodHlwZW9mIGUubWVzc2FnZVRleHQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb25zdCBtc2cgPSBlLm1lc3NhZ2VUZXh0O1xuICAgICAgcmV0dXJuICFuZ0NtZExpbmVPcHRpb25zLnNvbWUobyA9PiBtc2cuaW5kZXhPZihvKSA+PSAwKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH0pO1xuICBpZiAoY21kRXJyb3JzLmxlbmd0aCkge1xuICAgIHJldHVybiB7XG4gICAgICBwcm9qZWN0LFxuICAgICAgcm9vdE5hbWVzOiBbXSxcbiAgICAgIG9wdGlvbnM6IGNtZENvbmZpZy5vcHRpb25zLFxuICAgICAgZXJyb3JzOiBjbWRFcnJvcnMsXG4gICAgICBlbWl0RmxhZ3M6IGFwaS5FbWl0RmxhZ3MuRGVmYXVsdFxuICAgIH07XG4gIH1cbiAgY29uc3QgYWxsRGlhZ25vc3RpY3M6IERpYWdub3N0aWNzID0gW107XG4gIGNvbnN0IGNvbmZpZyA9IHJlYWRDb25maWd1cmF0aW9uKHByb2plY3QsIGNtZENvbmZpZy5vcHRpb25zKTtcbiAgY29uc3Qgb3B0aW9ucyA9IHsuLi5jb25maWcub3B0aW9ucywgLi4uZXhpc3RpbmdPcHRpb25zfTtcbiAgaWYgKG9wdGlvbnMubG9jYWxlKSB7XG4gICAgb3B0aW9ucy5pMThuSW5Mb2NhbGUgPSBvcHRpb25zLmxvY2FsZTtcbiAgfVxuICByZXR1cm4ge1xuICAgIHByb2plY3QsXG4gICAgcm9vdE5hbWVzOiBjb25maWcucm9vdE5hbWVzLCBvcHRpb25zLFxuICAgIGVycm9yczogY29uZmlnLmVycm9ycyxcbiAgICBlbWl0RmxhZ3M6IGNvbmZpZy5lbWl0RmxhZ3NcbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0Rm9ybWF0RGlhZ25vc3RpY3NIb3N0KG9wdGlvbnM/OiBhcGkuQ29tcGlsZXJPcHRpb25zKTogdHMuRm9ybWF0RGlhZ25vc3RpY3NIb3N0IHtcbiAgY29uc3QgYmFzZVBhdGggPSBvcHRpb25zID8gb3B0aW9ucy5iYXNlUGF0aCA6IHVuZGVmaW5lZDtcbiAgcmV0dXJuIHtcbiAgICBnZXRDdXJyZW50RGlyZWN0b3J5OiAoKSA9PiBiYXNlUGF0aCB8fCB0cy5zeXMuZ2V0Q3VycmVudERpcmVjdG9yeSgpLFxuICAgIC8vIFdlIG5lZWQgdG8gbm9ybWFsaXplIHRoZSBwYXRoIHNlcGFyYXRvcnMgaGVyZSBiZWNhdXNlIGJ5IGRlZmF1bHQsIFR5cGVTY3JpcHRcbiAgICAvLyBjb21waWxlciBob3N0cyB1c2UgcG9zaXggY2Fub25pY2FsIHBhdGhzLiBJbiBvcmRlciB0byBwcmludCBjb25zaXN0ZW50IGRpYWdub3N0aWNzLFxuICAgIC8vIHdlIGFsc28gbm9ybWFsaXplIHRoZSBwYXRocy5cbiAgICBnZXRDYW5vbmljYWxGaWxlTmFtZTogZmlsZU5hbWUgPT4gZmlsZU5hbWUucmVwbGFjZSgvXFxcXC9nLCAnLycpLFxuICAgIGdldE5ld0xpbmU6ICgpID0+IHtcbiAgICAgIC8vIE1hbnVhbGx5IGRldGVybWluZSB0aGUgcHJvcGVyIG5ldyBsaW5lIHN0cmluZyBiYXNlZCBvbiB0aGUgcGFzc2VkIGNvbXBpbGVyXG4gICAgICAvLyBvcHRpb25zLiBUaGVyZSBpcyBubyBwdWJsaWMgVHlwZVNjcmlwdCBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmdcbiAgICAgIC8vIG5ldyBsaW5lIHN0cmluZy4gc2VlOiBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzI5NTgxXG4gICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLm5ld0xpbmUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5uZXdMaW5lID09PSB0cy5OZXdMaW5lS2luZC5MaW5lRmVlZCA/ICdcXG4nIDogJ1xcclxcbic7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHMuc3lzLm5ld0xpbmU7XG4gICAgfSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gcmVwb3J0RXJyb3JzQW5kRXhpdChcbiAgICBhbGxEaWFnbm9zdGljczogRGlhZ25vc3RpY3MsIG9wdGlvbnM/OiBhcGkuQ29tcGlsZXJPcHRpb25zLFxuICAgIGNvbnNvbGVFcnJvcjogKHM6IHN0cmluZykgPT4gdm9pZCA9IGNvbnNvbGUuZXJyb3IpOiBudW1iZXIge1xuICBjb25zdCBlcnJvcnNBbmRXYXJuaW5ncyA9IGZpbHRlckVycm9yc0FuZFdhcm5pbmdzKGFsbERpYWdub3N0aWNzKTtcbiAgaWYgKGVycm9yc0FuZFdhcm5pbmdzLmxlbmd0aCkge1xuICAgIGNvbnN0IGZvcm1hdEhvc3QgPSBnZXRGb3JtYXREaWFnbm9zdGljc0hvc3Qob3B0aW9ucyk7XG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5lbmFibGVJdnkgPT09IHRydWUpIHtcbiAgICAgIGNvbnN0IG5nRGlhZ25vc3RpY3MgPSBlcnJvcnNBbmRXYXJuaW5ncy5maWx0ZXIoYXBpLmlzTmdEaWFnbm9zdGljKTtcbiAgICAgIGNvbnN0IHRzRGlhZ25vc3RpY3MgPSBlcnJvcnNBbmRXYXJuaW5ncy5maWx0ZXIoYXBpLmlzVHNEaWFnbm9zdGljKTtcbiAgICAgIGNvbnNvbGVFcnJvcihyZXBsYWNlVHNXaXRoTmdJbkVycm9ycyhcbiAgICAgICAgICB0cy5mb3JtYXREaWFnbm9zdGljc1dpdGhDb2xvckFuZENvbnRleHQodHNEaWFnbm9zdGljcywgZm9ybWF0SG9zdCkpKTtcbiAgICAgIGNvbnNvbGVFcnJvcihmb3JtYXREaWFnbm9zdGljcyhuZ0RpYWdub3N0aWNzLCBmb3JtYXRIb3N0KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGVFcnJvcihmb3JtYXREaWFnbm9zdGljcyhlcnJvcnNBbmRXYXJuaW5ncywgZm9ybWF0SG9zdCkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZXhpdENvZGVGcm9tUmVzdWx0KGFsbERpYWdub3N0aWNzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdhdGNoTW9kZShcbiAgICBwcm9qZWN0OiBzdHJpbmcsIG9wdGlvbnM6IGFwaS5Db21waWxlck9wdGlvbnMsIGNvbnNvbGVFcnJvcjogKHM6IHN0cmluZykgPT4gdm9pZCkge1xuICByZXR1cm4gcGVyZm9ybVdhdGNoQ29tcGlsYXRpb24oY3JlYXRlUGVyZm9ybVdhdGNoSG9zdChwcm9qZWN0LCBkaWFnbm9zdGljcyA9PiB7XG4gICAgY29uc29sZUVycm9yKGZvcm1hdERpYWdub3N0aWNzKGRpYWdub3N0aWNzLCBnZXRGb3JtYXREaWFnbm9zdGljc0hvc3Qob3B0aW9ucykpKTtcbiAgfSwgb3B0aW9ucywgb3B0aW9ucyA9PiBjcmVhdGVFbWl0Q2FsbGJhY2sob3B0aW9ucykpKTtcbn1cblxuLy8gQ0xJIGVudHJ5IHBvaW50XG5pZiAocmVxdWlyZS5tYWluID09PSBtb2R1bGUpIHtcbiAgY29uc3QgYXJncyA9IHByb2Nlc3MuYXJndi5zbGljZSgyKTtcbiAgcHJvY2Vzcy5leGl0Q29kZSA9IG1haW4oYXJncyk7XG59XG4iXX0=