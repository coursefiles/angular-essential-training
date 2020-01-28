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
        define("@angular/compiler-cli/src/perform_watch", ["require", "exports", "chokidar", "path", "typescript", "@angular/compiler-cli/src/perform_compile", "@angular/compiler-cli/src/transformers/api", "@angular/compiler-cli/src/transformers/entry_points", "@angular/compiler-cli/src/transformers/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var chokidar = require("chokidar");
    var path = require("path");
    var ts = require("typescript");
    var perform_compile_1 = require("@angular/compiler-cli/src/perform_compile");
    var api = require("@angular/compiler-cli/src/transformers/api");
    var entry_points_1 = require("@angular/compiler-cli/src/transformers/entry_points");
    var util_1 = require("@angular/compiler-cli/src/transformers/util");
    function totalCompilationTimeDiagnostic(timeInMillis) {
        var duration;
        if (timeInMillis > 1000) {
            duration = (timeInMillis / 1000).toPrecision(2) + "s";
        }
        else {
            duration = timeInMillis + "ms";
        }
        return {
            category: ts.DiagnosticCategory.Message,
            messageText: "Total time: " + duration,
            code: api.DEFAULT_ERROR_CODE,
            source: api.SOURCE,
        };
    }
    var FileChangeEvent;
    (function (FileChangeEvent) {
        FileChangeEvent[FileChangeEvent["Change"] = 0] = "Change";
        FileChangeEvent[FileChangeEvent["CreateDelete"] = 1] = "CreateDelete";
        FileChangeEvent[FileChangeEvent["CreateDeleteDir"] = 2] = "CreateDeleteDir";
    })(FileChangeEvent = exports.FileChangeEvent || (exports.FileChangeEvent = {}));
    function createPerformWatchHost(configFileName, reportDiagnostics, existingOptions, createEmitCallback) {
        return {
            reportDiagnostics: reportDiagnostics,
            createCompilerHost: function (options) { return entry_points_1.createCompilerHost({ options: options }); },
            readConfiguration: function () { return perform_compile_1.readConfiguration(configFileName, existingOptions); },
            createEmitCallback: function (options) { return createEmitCallback ? createEmitCallback(options) : undefined; },
            onFileChange: function (options, listener, ready) {
                if (!options.basePath) {
                    reportDiagnostics([{
                            category: ts.DiagnosticCategory.Error,
                            messageText: 'Invalid configuration option. baseDir not specified',
                            source: api.SOURCE,
                            code: api.DEFAULT_ERROR_CODE
                        }]);
                    return { close: function () { } };
                }
                var watcher = chokidar.watch(options.basePath, {
                    // ignore .dotfiles, .js and .map files.
                    // can't ignore other files as we e.g. want to recompile if an `.html` file changes as well.
                    ignored: /((^[\/\\])\..)|(\.js$)|(\.map$)|(\.metadata\.json|node_modules)/,
                    ignoreInitial: true,
                    persistent: true,
                });
                watcher.on('all', function (event, path) {
                    switch (event) {
                        case 'change':
                            listener(FileChangeEvent.Change, path);
                            break;
                        case 'unlink':
                        case 'add':
                            listener(FileChangeEvent.CreateDelete, path);
                            break;
                        case 'unlinkDir':
                        case 'addDir':
                            listener(FileChangeEvent.CreateDeleteDir, path);
                            break;
                    }
                });
                watcher.on('ready', ready);
                return { close: function () { return watcher.close(); }, ready: ready };
            },
            setTimeout: (ts.sys.clearTimeout && ts.sys.setTimeout) || setTimeout,
            clearTimeout: (ts.sys.setTimeout && ts.sys.clearTimeout) || clearTimeout,
        };
    }
    exports.createPerformWatchHost = createPerformWatchHost;
    /**
     * The logic in this function is adapted from `tsc.ts` from TypeScript.
     */
    function performWatchCompilation(host) {
        var cachedProgram; // Program cached from last compilation
        var cachedCompilerHost; // CompilerHost cached from last compilation
        var cachedOptions; // CompilerOptions cached from last compilation
        var timerHandleForRecompilation; // Handle for 0.25s wait timer to trigger recompilation
        var ignoreFilesForWatch = new Set();
        var fileCache = new Map();
        var firstCompileResult = doCompilation();
        // Watch basePath, ignoring .dotfiles
        var resolveReadyPromise;
        var readyPromise = new Promise(function (resolve) { return resolveReadyPromise = resolve; });
        // Note: ! is ok as options are filled after the first compilation
        // Note: ! is ok as resolvedReadyPromise is filled by the previous call
        var fileWatcher = host.onFileChange(cachedOptions.options, watchedFileChanged, resolveReadyPromise);
        return { close: close, ready: function (cb) { return readyPromise.then(cb); }, firstCompileResult: firstCompileResult };
        function cacheEntry(fileName) {
            fileName = path.normalize(fileName);
            var entry = fileCache.get(fileName);
            if (!entry) {
                entry = {};
                fileCache.set(fileName, entry);
            }
            return entry;
        }
        function close() {
            fileWatcher.close();
            if (timerHandleForRecompilation) {
                host.clearTimeout(timerHandleForRecompilation);
                timerHandleForRecompilation = undefined;
            }
        }
        // Invoked to perform initial compilation or re-compilation in watch mode
        function doCompilation() {
            if (!cachedOptions) {
                cachedOptions = host.readConfiguration();
            }
            if (cachedOptions.errors && cachedOptions.errors.length) {
                host.reportDiagnostics(cachedOptions.errors);
                return cachedOptions.errors;
            }
            var startTime = Date.now();
            if (!cachedCompilerHost) {
                cachedCompilerHost = host.createCompilerHost(cachedOptions.options);
                var originalWriteFileCallback_1 = cachedCompilerHost.writeFile;
                cachedCompilerHost.writeFile = function (fileName, data, writeByteOrderMark, onError, sourceFiles) {
                    if (sourceFiles === void 0) { sourceFiles = []; }
                    ignoreFilesForWatch.add(path.normalize(fileName));
                    return originalWriteFileCallback_1(fileName, data, writeByteOrderMark, onError, sourceFiles);
                };
                var originalFileExists_1 = cachedCompilerHost.fileExists;
                cachedCompilerHost.fileExists = function (fileName) {
                    var ce = cacheEntry(fileName);
                    if (ce.exists == null) {
                        ce.exists = originalFileExists_1.call(this, fileName);
                    }
                    return ce.exists;
                };
                var originalGetSourceFile_1 = cachedCompilerHost.getSourceFile;
                cachedCompilerHost.getSourceFile = function (fileName, languageVersion) {
                    var ce = cacheEntry(fileName);
                    if (!ce.sf) {
                        ce.sf = originalGetSourceFile_1.call(this, fileName, languageVersion);
                    }
                    return ce.sf;
                };
                var originalReadFile_1 = cachedCompilerHost.readFile;
                cachedCompilerHost.readFile = function (fileName) {
                    var ce = cacheEntry(fileName);
                    if (ce.content == null) {
                        ce.content = originalReadFile_1.call(this, fileName);
                    }
                    return ce.content;
                };
            }
            ignoreFilesForWatch.clear();
            var oldProgram = cachedProgram;
            // We clear out the `cachedProgram` here as a
            // program can only be used as `oldProgram` 1x
            cachedProgram = undefined;
            var compileResult = perform_compile_1.performCompilation({
                rootNames: cachedOptions.rootNames,
                options: cachedOptions.options,
                host: cachedCompilerHost,
                oldProgram: oldProgram,
                emitCallback: host.createEmitCallback(cachedOptions.options)
            });
            if (compileResult.diagnostics.length) {
                host.reportDiagnostics(compileResult.diagnostics);
            }
            var endTime = Date.now();
            if (cachedOptions.options.diagnostics) {
                var totalTime = (endTime - startTime) / 1000;
                host.reportDiagnostics([totalCompilationTimeDiagnostic(endTime - startTime)]);
            }
            var exitCode = perform_compile_1.exitCodeFromResult(compileResult.diagnostics);
            if (exitCode == 0) {
                cachedProgram = compileResult.program;
                host.reportDiagnostics([util_1.createMessageDiagnostic('Compilation complete. Watching for file changes.')]);
            }
            else {
                host.reportDiagnostics([util_1.createMessageDiagnostic('Compilation failed. Watching for file changes.')]);
            }
            return compileResult.diagnostics;
        }
        function resetOptions() {
            cachedProgram = undefined;
            cachedCompilerHost = undefined;
            cachedOptions = undefined;
        }
        function watchedFileChanged(event, fileName) {
            if (cachedOptions && event === FileChangeEvent.Change &&
                // TODO(chuckj): validate that this is sufficient to skip files that were written.
                // This assumes that the file path we write is the same file path we will receive in the
                // change notification.
                path.normalize(fileName) === path.normalize(cachedOptions.project)) {
                // If the configuration file changes, forget everything and start the recompilation timer
                resetOptions();
            }
            else if (event === FileChangeEvent.CreateDelete || event === FileChangeEvent.CreateDeleteDir) {
                // If a file was added or removed, reread the configuration
                // to determine the new list of root files.
                cachedOptions = undefined;
            }
            if (event === FileChangeEvent.CreateDeleteDir) {
                fileCache.clear();
            }
            else {
                fileCache.delete(path.normalize(fileName));
            }
            if (!ignoreFilesForWatch.has(path.normalize(fileName))) {
                // Ignore the file if the file is one that was written by the compiler.
                startTimerForRecompilation();
            }
        }
        // Upon detecting a file change, wait for 250ms and then perform a recompilation. This gives batch
        // operations (such as saving all modified files in an editor) a chance to complete before we kick
        // off a new compilation.
        function startTimerForRecompilation() {
            if (timerHandleForRecompilation) {
                host.clearTimeout(timerHandleForRecompilation);
            }
            timerHandleForRecompilation = host.setTimeout(recompile, 250);
        }
        function recompile() {
            timerHandleForRecompilation = undefined;
            host.reportDiagnostics([util_1.createMessageDiagnostic('File change detected. Starting incremental compilation.')]);
            doCompilation();
        }
    }
    exports.performWatchCompilation = performWatchCompilation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyZm9ybV93YXRjaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvcGVyZm9ybV93YXRjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztJQUVILG1DQUFxQztJQUNyQywyQkFBNkI7SUFDN0IsK0JBQWlDO0lBRWpDLDZFQUF3SjtJQUN4SixnRUFBMEM7SUFDMUMsb0ZBQStEO0lBQy9ELG9FQUE0RDtJQUU1RCxTQUFTLDhCQUE4QixDQUFDLFlBQW9CO1FBQzFELElBQUksUUFBZ0IsQ0FBQztRQUNyQixJQUFJLFlBQVksR0FBRyxJQUFJLEVBQUU7WUFDdkIsUUFBUSxHQUFNLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsTUFBRyxDQUFDO1NBQ3ZEO2FBQU07WUFDTCxRQUFRLEdBQU0sWUFBWSxPQUFJLENBQUM7U0FDaEM7UUFDRCxPQUFPO1lBQ0wsUUFBUSxFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPO1lBQ3ZDLFdBQVcsRUFBRSxpQkFBZSxRQUFVO1lBQ3RDLElBQUksRUFBRSxHQUFHLENBQUMsa0JBQWtCO1lBQzVCLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTTtTQUNuQixDQUFDO0lBQ0osQ0FBQztJQUVELElBQVksZUFJWDtJQUpELFdBQVksZUFBZTtRQUN6Qix5REFBTSxDQUFBO1FBQ04scUVBQVksQ0FBQTtRQUNaLDJFQUFlLENBQUE7SUFDakIsQ0FBQyxFQUpXLGVBQWUsR0FBZix1QkFBZSxLQUFmLHVCQUFlLFFBSTFCO0lBY0QsU0FBZ0Isc0JBQXNCLENBQ2xDLGNBQXNCLEVBQUUsaUJBQXFELEVBQzdFLGVBQW9DLEVBQUUsa0JBQ2tDO1FBQzFFLE9BQU87WUFDTCxpQkFBaUIsRUFBRSxpQkFBaUI7WUFDcEMsa0JBQWtCLEVBQUUsVUFBQSxPQUFPLElBQUks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Qyw4QkFBdUIsQ0FBQyx5REFBeUQsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxRixhQUFhLEVBQUUsQ0FBQztRQUNsQixDQUFDO0lBQ0gsQ0FBQztJQXpLRCwwREF5S0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCAqIGFzIGNob2tpZGFyIGZyb20gJ2Nob2tpZGFyJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuaW1wb3J0IHtEaWFnbm9zdGljcywgUGFyc2VkQ29uZmlndXJhdGlvbiwgUGVyZm9ybUNvbXBpbGF0aW9uUmVzdWx0LCBleGl0Q29kZUZyb21SZXN1bHQsIHBlcmZvcm1Db21waWxhdGlvbiwgcmVhZENvbmZpZ3VyYXRpb259IGZyb20gJy4vcGVyZm9ybV9jb21waWxlJztcbmltcG9ydCAqIGFzIGFwaSBmcm9tICcuL3RyYW5zZm9ybWVycy9hcGknO1xuaW1wb3J0IHtjcmVhdGVDb21waWxlckhvc3R9IGZyb20gJy4vdHJhbnNmb3JtZXJzL2VudHJ5X3BvaW50cyc7XG5pbXBvcnQge2NyZWF0ZU1lc3NhZ2VEaWFnbm9zdGljfSBmcm9tICcuL3RyYW5zZm9ybWVycy91dGlsJztcblxuZnVuY3Rpb24gdG90YWxDb21waWxhdGlvblRpbWVEaWFnbm9zdGljKHRpbWVJbk1pbGxpczogbnVtYmVyKTogYXBpLkRpYWdub3N0aWMge1xuICBsZXQgZHVyYXRpb246IHN0cmluZztcbiAgaWYgKHRpbWVJbk1pbGxpcyA+IDEwMDApIHtcbiAgICBkdXJhdGlvbiA9IGAkeyh0aW1lSW5NaWxsaXMgLyAxMDAwKS50b1ByZWNpc2lvbigyKX1zYDtcbiAgfSBlbHNlIHtcbiAgICBkdXJhdGlvbiA9IGAke3RpbWVJbk1pbGxpc31tc2A7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBjYXRlZ29yeTogdHMuRGlhZ25vc3RpY0NhdGVnb3J5Lk1lc3NhZ2UsXG4gICAgbWVzc2FnZVRleHQ6IGBUb3RhbCB0aW1lOiAke2R1cmF0aW9ufWAsXG4gICAgY29kZTogYXBpLkRFRkFVTFRfRVJST1JfQ09ERSxcbiAgICBzb3VyY2U6IGFwaS5TT1VSQ0UsXG4gIH07XG59XG5cbmV4cG9ydCBlbnVtIEZpbGVDaGFuZ2VFdmVudCB7XG4gIENoYW5nZSxcbiAgQ3JlYXRlRGVsZXRlLFxuICBDcmVhdGVEZWxldGVEaXIsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGVyZm9ybVdhdGNoSG9zdCB7XG4gIHJlcG9ydERpYWdub3N0aWNzKGRpYWdub3N0aWNzOiBEaWFnbm9zdGljcyk6IHZvaWQ7XG4gIHJlYWRDb25maWd1cmF0aW9uKCk6IFBhcnNlZENvbmZpZ3VyYXRpb247XG4gIGNyZWF0ZUNvbXBpbGVySG9zdChvcHRpb25zOiBhcGkuQ29tcGlsZXJPcHRpb25zKTogYXBpLkNvbXBpbGVySG9zdDtcbiAgY3JlYXRlRW1pdENhbGxiYWNrKG9wdGlvbnM6IGFwaS5Db21waWxlck9wdGlvbnMpOiBhcGkuVHNFbWl0Q2FsbGJhY2t8dW5kZWZpbmVkO1xuICBvbkZpbGVDaGFuZ2UoXG4gICAgICBvcHRpb25zOiBhcGkuQ29tcGlsZXJPcHRpb25zLCBsaXN0ZW5lcjogKGV2ZW50OiBGaWxlQ2hhbmdlRXZlbnQsIGZpbGVOYW1lOiBzdHJpbmcpID0+IHZvaWQsXG4gICAgICByZWFkeTogKCkgPT4gdm9pZCk6IHtjbG9zZTogKCkgPT4gdm9pZH07XG4gIHNldFRpbWVvdXQoY2FsbGJhY2s6ICgpID0+IHZvaWQsIG1zOiBudW1iZXIpOiBhbnk7XG4gIGNsZWFyVGltZW91dCh0aW1lb3V0SWQ6IGFueSk6IHZvaWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVQZXJmb3JtV2F0Y2hIb3N0KFxuICAgIGNvbmZpZ0ZpbGVOYW1lOiBzdHJpbmcsIHJlcG9ydERpYWdub3N0aWNzOiAoZGlhZ25vc3RpY3M6IERpYWdub3N0aWNzKSA9PiB2b2lkLFxuICAgIGV4aXN0aW5nT3B0aW9ucz86IHRzLkNvbXBpbGVyT3B0aW9ucywgY3JlYXRlRW1pdENhbGxiYWNrPzogKG9wdGlvbnM6IGFwaS5Db21waWxlck9wdGlvbnMpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBpLlRzRW1pdENhbGxiYWNrIHwgdW5kZWZpbmVkKTogUGVyZm9ybVdhdGNoSG9zdCB7XG4gIHJldHVybiB7XG4gICAgcmVwb3J0RGlhZ25vc3RpY3M6IHJlcG9ydERpYWdub3N0aWNzLFxuICAgIGNyZWF0ZUNvbXBpbGVySG9zdDogb3B0aW9ucyA9PiBjcmVhdGVDb21waWxlckhvc3Qoe29wdGlvbnN9KSxcbiAgICByZWFkQ29uZmlndXJhdGlvbjogKCkgPT4gcmVhZENvbmZpZ3VyYXRpb24oY29uZmlnRmlsZU5hbWUsIGV4aXN0aW5nT3B0aW9ucyksXG4gICAgY3JlYXRlRW1pdENhbGxiYWNrOiBvcHRpb25zID0+IGNyZWF0ZUVtaXRDYWxsYmFjayA/IGNyZWF0ZUVtaXRDYWxsYmFjayhvcHRpb25zKSA6IHVuZGVmaW5lZCxcbiAgICBvbkZpbGVDaGFuZ2U6IChvcHRpb25zLCBsaXN0ZW5lciwgcmVhZHk6ICgpID0+IHZvaWQpID0+IHtcbiAgICAgIGlmICghb3B0aW9ucy5iYXNlUGF0aCkge1xuICAgICAgICByZXBvcnREaWFnbm9zdGljcyhbe1xuICAgICAgICAgIGNhdGVnb3J5OiB0cy5EaWFnbm9zdGljQ2F0ZWdvcnkuRXJyb3IsXG4gICAgICAgICAgbWVzc2FnZVRleHQ6ICdJbnZhbGlkIGNvbmZpZ3VyYXRpb24gb3B0aW9uLiBiYXNlRGlyIG5vdCBzcGVjaWZpZWQnLFxuICAgICAgICAgIHNvdXJjZTogYXBpLlNPVVJDRSxcbiAgICAgICAgICBjb2RlOiBhcGkuREVGQVVMVF9FUlJPUl9DT0RFXG4gICAgICAgIH1dKTtcbiAgICAgICAgcmV0dXJuIHtjbG9zZTogKCkgPT4ge319O1xuICAgICAgfVxuICAgICAgY29uc3Qgd2F0Y2hlciA9IGNob2tpZGFyLndhdGNoKG9wdGlvbnMuYmFzZVBhdGgsIHtcbiAgICAgICAgLy8gaWdub3JlIC5kb3RmaWxlcywgLmpzIGFuZCAubWFwIGZpbGVzLlxuICAgICAgICAvLyBjYW4ndCBpZ25vcmUgb3RoZXIgZmlsZXMgYXMgd2UgZS5nLiB3YW50IHRvIHJlY29tcGlsZSBpZiBhbiBgLmh0bWxgIGZpbGUgY2hhbmdlcyBhcyB3ZWxsLlxuICAgICAgICBpZ25vcmVkOiAvKCheW1xcL1xcXFxdKVxcLi4pfChcXC5qcyQpfChcXC5tYXAkKXwoXFwubWV0YWRhdGFcXC5qc29ufG5vZGVfbW9kdWxlcykvLFxuICAgICAgICBpZ25vcmVJbml0aWFsOiB0cnVlLFxuICAgICAgICBwZXJzaXN0ZW50OiB0cnVlLFxuICAgICAgfSk7XG4gICAgICB3YXRjaGVyLm9uKCdhbGwnLCAoZXZlbnQ6IHN0cmluZywgcGF0aDogc3RyaW5nKSA9PiB7XG4gICAgICAgIHN3aXRjaCAoZXZlbnQpIHtcbiAgICAgICAgICBjYXNlICdjaGFuZ2UnOlxuICAgICAgICAgICAgbGlzdGVuZXIoRmlsZUNoYW5nZUV2ZW50LkNoYW5nZSwgcGF0aCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICd1bmxpbmsnOlxuICAgICAgICAgIGNhc2UgJ2FkZCc6XG4gICAgICAgICAgICBsaXN0ZW5lcihGaWxlQ2hhbmdlRXZlbnQuQ3JlYXRlRGVsZXRlLCBwYXRoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3VubGlua0Rpcic6XG4gICAgICAgICAgY2FzZSAnYWRkRGlyJzpcbiAgICAgICAgICAgIGxpc3RlbmVyKEZpbGVDaGFuZ2VFdmVudC5DcmVhdGVEZWxldGVEaXIsIHBhdGgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgd2F0Y2hlci5vbigncmVhZHknLCByZWFkeSk7XG4gICAgICByZXR1cm4ge2Nsb3NlOiAoKSA9PiB3YXRjaGVyLmNsb3NlKCksIHJlYWR5fTtcbiAgICB9LFxuICAgIHNldFRpbWVvdXQ6ICh0cy5zeXMuY2xlYXJUaW1lb3V0ICYmIHRzLnN5cy5zZXRUaW1lb3V0KSB8fCBzZXRUaW1lb3V0LFxuICAgIGNsZWFyVGltZW91dDogKHRzLnN5cy5zZXRUaW1lb3V0ICYmIHRzLnN5cy5jbGVhclRpbWVvdXQpIHx8IGNsZWFyVGltZW91dCxcbiAgfTtcbn1cblxuaW50ZXJmYWNlIENhY2hlRW50cnkge1xuICBleGlzdHM/OiBib29sZWFuO1xuICBzZj86IHRzLlNvdXJjZUZpbGU7XG4gIGNvbnRlbnQ/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogVGhlIGxvZ2ljIGluIHRoaXMgZnVuY3Rpb24gaXMgYWRhcHRlZCBmcm9tIGB0c2MudHNgIGZyb20gVHlwZVNjcmlwdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBlcmZvcm1XYXRjaENvbXBpbGF0aW9uKGhvc3Q6IFBlcmZvcm1XYXRjaEhvc3QpOlxuICAgIHtjbG9zZTogKCkgPT4gdm9pZCwgcmVhZHk6IChjYjogKCkgPT4gdm9pZCkgPT4gdm9pZCwgZmlyc3RDb21waWxlUmVzdWx0OiBEaWFnbm9zdGljc30ge1xuICBsZXQgY2FjaGVkUHJvZ3JhbTogYXBpLlByb2dyYW18dW5kZWZpbmVkOyAgICAgICAgICAgIC8vIFByb2dyYW0gY2FjaGVkIGZyb20gbGFzdCBjb21waWxhdGlvblxuICBsZXQgY2FjaGVkQ29tcGlsZXJIb3N0OiBhcGkuQ29tcGlsZXJIb3N0fHVuZGVmaW5lZDsgIC8vIENvbXBpbGVySG9zdCBjYWNoZWQgZnJvbSBsYXN0IGNvbXBpbGF0aW9uXG4gIGxldCBjYWNoZWRPcHRpb25zOiBQYXJzZWRDb25maWd1cmF0aW9ufHVuZGVmaW5lZDsgIC8vIENvbXBpbGVyT3B0aW9ucyBjYWNoZWQgZnJvbSBsYXN0IGNvbXBpbGF0aW9uXG4gIGxldCB0aW1lckhhbmRsZUZvclJlY29tcGlsYXRpb246IGFueTsgIC8vIEhhbmRsZSBmb3IgMC4yNXMgd2FpdCB0aW1lciB0byB0cmlnZ2VyIHJlY29tcGlsYXRpb25cblxuICBjb25zdCBpZ25vcmVGaWxlc0ZvcldhdGNoID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gIGNvbnN0IGZpbGVDYWNoZSA9IG5ldyBNYXA8c3RyaW5nLCBDYWNoZUVudHJ5PigpO1xuXG4gIGNvbnN0IGZpcnN0Q29tcGlsZVJlc3VsdCA9IGRvQ29tcGlsYXRpb24oKTtcblxuICAvLyBXYXRjaCBiYXNlUGF0aCwgaWdub3JpbmcgLmRvdGZpbGVzXG4gIGxldCByZXNvbHZlUmVhZHlQcm9taXNlOiAoKSA9PiB2b2lkO1xuICBjb25zdCByZWFkeVByb21pc2UgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHJlc29sdmVSZWFkeVByb21pc2UgPSByZXNvbHZlKTtcbiAgLy8gTm90ZTogISBpcyBvayBhcyBvcHRpb25zIGFyZSBmaWxsZWQgYWZ0ZXIgdGhlIGZpcnN0IGNvbXBpbGF0aW9uXG4gIC8vIE5vdGU6ICEgaXMgb2sgYXMgcmVzb2x2ZWRSZWFkeVByb21pc2UgaXMgZmlsbGVkIGJ5IHRoZSBwcmV2aW91cyBjYWxsXG4gIGNvbnN0IGZpbGVXYXRjaGVyID1cbiAgICAgIGhvc3Qub25GaWxlQ2hhbmdlKGNhY2hlZE9wdGlvbnMgIS5vcHRpb25zLCB3YXRjaGVkRmlsZUNoYW5nZWQsIHJlc29sdmVSZWFkeVByb21pc2UgISk7XG5cbiAgcmV0dXJuIHtjbG9zZSwgcmVhZHk6IGNiID0+IHJlYWR5UHJvbWlzZS50aGVuKGNiKSwgZmlyc3RDb21waWxlUmVzdWx0fTtcblxuICBmdW5jdGlvbiBjYWNoZUVudHJ5KGZpbGVOYW1lOiBzdHJpbmcpOiBDYWNoZUVudHJ5IHtcbiAgICBmaWxlTmFtZSA9IHBhdGgubm9ybWFsaXplKGZpbGVOYW1lKTtcbiAgICBsZXQgZW50cnkgPSBmaWxlQ2FjaGUuZ2V0KGZpbGVOYW1lKTtcbiAgICBpZiAoIWVudHJ5KSB7XG4gICAgICBlbnRyeSA9IHt9O1xuICAgICAgZmlsZUNhY2hlLnNldChmaWxlTmFtZSwgZW50cnkpO1xuICAgIH1cbiAgICByZXR1cm4gZW50cnk7XG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICBmaWxlV2F0Y2hlci5jbG9zZSgpO1xuICAgIGlmICh0aW1lckhhbmRsZUZvclJlY29tcGlsYXRpb24pIHtcbiAgICAgIGhvc3QuY2xlYXJUaW1lb3V0KHRpbWVySGFuZGxlRm9yUmVjb21waWxhdGlvbik7XG4gICAgICB0aW1lckhhbmRsZUZvclJlY29tcGlsYXRpb24gPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgLy8gSW52b2tlZCB0byBwZXJmb3JtIGluaXRpYWwgY29tcGlsYXRpb24gb3IgcmUtY29tcGlsYXRpb24gaW4gd2F0Y2ggbW9kZVxuICBmdW5jdGlvbiBkb0NvbXBpbGF0aW9uKCk6IERpYWdub3N0aWNzIHtcbiAgICBpZiAoIWNhY2hlZE9wdGlvbnMpIHtcbiAgICAgIGNhY2hlZE9wdGlvbnMgPSBob3N0LnJlYWRDb25maWd1cmF0aW9uKCk7XG4gICAgfVxuICAgIGlmIChjYWNoZWRPcHRpb25zLmVycm9ycyAmJiBjYWNoZWRPcHRpb25zLmVycm9ycy5sZW5ndGgpIHtcbiAgICAgIGhvc3QucmVwb3J0RGlhZ25vc3RpY3MoY2FjaGVkT3B0aW9ucy5lcnJvcnMpO1xuICAgICAgcmV0dXJuIGNhY2hlZE9wdGlvbnMuZXJyb3JzO1xuICAgIH1cbiAgICBjb25zdCBzdGFydFRpbWUgPSBEYXRlLm5vdygpO1xuICAgIGlmICghY2FjaGVkQ29tcGlsZXJIb3N0KSB7XG4gICAgICBjYWNoZWRDb21waWxlckhvc3QgPSBob3N0LmNyZWF0ZUNvbXBpbGVySG9zdChjYWNoZWRPcHRpb25zLm9wdGlvbnMpO1xuICAgICAgY29uc3Qgb3JpZ2luYWxXcml0ZUZpbGVDYWxsYmFjayA9IGNhY2hlZENvbXBpbGVySG9zdC53cml0ZUZpbGU7XG4gICAgICBjYWNoZWRDb21waWxlckhvc3Qud3JpdGVGaWxlID0gZnVuY3Rpb24oXG4gICAgICAgICAgZmlsZU5hbWU6IHN0cmluZywgZGF0YTogc3RyaW5nLCB3cml0ZUJ5dGVPcmRlck1hcms6IGJvb2xlYW4sXG4gICAgICAgICAgb25FcnJvcj86IChtZXNzYWdlOiBzdHJpbmcpID0+IHZvaWQsIHNvdXJjZUZpbGVzOiBSZWFkb25seUFycmF5PHRzLlNvdXJjZUZpbGU+ID0gW10pIHtcbiAgICAgICAgaWdub3JlRmlsZXNGb3JXYXRjaC5hZGQocGF0aC5ub3JtYWxpemUoZmlsZU5hbWUpKTtcbiAgICAgICAgcmV0dXJuIG9yaWdpbmFsV3JpdGVGaWxlQ2FsbGJhY2soZmlsZU5hbWUsIGRhdGEsIHdyaXRlQnl0ZU9yZGVyTWFyaywgb25FcnJvciwgc291cmNlRmlsZXMpO1xuICAgICAgfTtcbiAgICAgIGNvbnN0IG9yaWdpbmFsRmlsZUV4aXN0cyA9IGNhY2hlZENvbXBpbGVySG9zdC5maWxlRXhpc3RzO1xuICAgICAgY2FjaGVkQ29tcGlsZXJIb3N0LmZpbGVFeGlzdHMgPSBmdW5jdGlvbihmaWxlTmFtZTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGNlID0gY2FjaGVFbnRyeShmaWxlTmFtZSk7XG4gICAgICAgIGlmIChjZS5leGlzdHMgPT0gbnVsbCkge1xuICAgICAgICAgIGNlLmV4aXN0cyA9IG9yaWdpbmFsRmlsZUV4aXN0cy5jYWxsKHRoaXMsIGZpbGVOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2UuZXhpc3RzICE7XG4gICAgICB9O1xuICAgICAgY29uc3Qgb3JpZ2luYWxHZXRTb3VyY2VGaWxlID0gY2FjaGVkQ29tcGlsZXJIb3N0LmdldFNvdXJjZUZpbGU7XG4gICAgICBjYWNoZWRDb21waWxlckhvc3QuZ2V0U291cmNlRmlsZSA9IGZ1bmN0aW9uKFxuICAgICAgICAgIGZpbGVOYW1lOiBzdHJpbmcsIGxhbmd1YWdlVmVyc2lvbjogdHMuU2NyaXB0VGFyZ2V0KSB7XG4gICAgICAgIGNvbnN0IGNlID0gY2FjaGVFbnRyeShmaWxlTmFtZSk7XG4gICAgICAgIGlmICghY2Uuc2YpIHtcbiAgICAgICAgICBjZS5zZiA9IG9yaWdpbmFsR2V0U291cmNlRmlsZS5jYWxsKHRoaXMsIGZpbGVOYW1lLCBsYW5ndWFnZVZlcnNpb24pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjZS5zZiAhO1xuICAgICAgfTtcbiAgICAgIGNvbnN0IG9yaWdpbmFsUmVhZEZpbGUgPSBjYWNoZWRDb21waWxlckhvc3QucmVhZEZpbGU7XG4gICAgICBjYWNoZWRDb21waWxlckhvc3QucmVhZEZpbGUgPSBmdW5jdGlvbihmaWxlTmFtZTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGNlID0gY2FjaGVFbnRyeShmaWxlTmFtZSk7XG4gICAgICAgIGlmIChjZS5jb250ZW50ID09IG51bGwpIHtcbiAgICAgICAgICBjZS5jb250ZW50ID0gb3JpZ2luYWxSZWFkRmlsZS5jYWxsKHRoaXMsIGZpbGVOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2UuY29udGVudCAhO1xuICAgICAgfTtcbiAgICB9XG4gICAgaWdub3JlRmlsZXNGb3JXYXRjaC5jbGVhcigpO1xuICAgIGNvbnN0IG9sZFByb2dyYW0gPSBjYWNoZWRQcm9ncmFtO1xuICAgIC8vIFdlIGNsZWFyIG91dCB0aGUgYGNhY2hlZFByb2dyYW1gIGhlcmUgYXMgYVxuICAgIC8vIHByb2dyYW0gY2FuIG9ubHkgYmUgdXNlZCBhcyBgb2xkUHJvZ3JhbWAgMXhcbiAgICBjYWNoZWRQcm9ncmFtID0gdW5kZWZpbmVkO1xuICAgIGNvbnN0IGNvbXBpbGVSZXN1bHQgPSBwZXJmb3JtQ29tcGlsYXRpb24oe1xuICAgICAgcm9vdE5hbWVzOiBjYWNoZWRPcHRpb25zLnJvb3ROYW1lcyxcbiAgICAgIG9wdGlvbnM6IGNhY2hlZE9wdGlvbnMub3B0aW9ucyxcbiAgICAgIGhvc3Q6IGNhY2hlZENvbXBpbGVySG9zdCxcbiAgICAgIG9sZFByb2dyYW06IG9sZFByb2dyYW0sXG4gICAgICBlbWl0Q2FsbGJhY2s6IGhvc3QuY3JlYXRlRW1pdENhbGxiYWNrKGNhY2hlZE9wdGlvbnMub3B0aW9ucylcbiAgICB9KTtcblxuICAgIGlmIChjb21waWxlUmVzdWx0LmRpYWdub3N0aWNzLmxlbmd0aCkge1xuICAgICAgaG9zdC5yZXBvcnREaWFnbm9zdGljcyhjb21waWxlUmVzdWx0LmRpYWdub3N0aWNzKTtcbiAgICB9XG5cbiAgICBjb25zdCBlbmRUaW1lID0gRGF0ZS5ub3coKTtcbiAgICBpZiAoY2FjaGVkT3B0aW9ucy5vcHRpb25zLmRpYWdub3N0aWNzKSB7XG4gICAgICBjb25zdCB0b3RhbFRpbWUgPSAoZW5kVGltZSAtIHN0YXJ0VGltZSkgLyAxMDAwO1xuICAgICAgaG9zdC5yZXBvcnREaWFnbm9zdGljcyhbdG90YWxDb21waWxhdGlvblRpbWVEaWFnbm9zdGljKGVuZFRpbWUgLSBzdGFydFRpbWUpXSk7XG4gICAgfVxuICAgIGNvbnN0IGV4aXRDb2RlID0gZXhpdENvZGVGcm9tUmVzdWx0KGNvbXBpbGVSZXN1bHQuZGlhZ25vc3RpY3MpO1xuICAgIGlmIChleGl0Q29kZSA9PSAwKSB7XG4gICAgICBjYWNoZWRQcm9ncmFtID0gY29tcGlsZVJlc3VsdC5wcm9ncmFtO1xuICAgICAgaG9zdC5yZXBvcnREaWFnbm9zdGljcyhcbiAgICAgICAgICBbY3JlYXRlTWVzc2FnZURpYWdub3N0aWMoJ0NvbXBpbGF0aW9uIGNvbXBsZXRlLiBXYXRjaGluZyBmb3IgZmlsZSBjaGFuZ2VzLicpXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhvc3QucmVwb3J0RGlhZ25vc3RpY3MoXG4gICAgICAgICAgW2NyZWF0ZU1lc3NhZ2VEaWFnbm9zdGljKCdDb21waWxhdGlvbiBmYWlsZWQuIFdhdGNoaW5nIGZvciBmaWxlIGNoYW5nZXMuJyldKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29tcGlsZVJlc3VsdC5kaWFnbm9zdGljcztcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0T3B0aW9ucygpIHtcbiAgICBjYWNoZWRQcm9ncmFtID0gdW5kZWZpbmVkO1xuICAgIGNhY2hlZENvbXBpbGVySG9zdCA9IHVuZGVmaW5lZDtcbiAgICBjYWNoZWRPcHRpb25zID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gd2F0Y2hlZEZpbGVDaGFuZ2VkKGV2ZW50OiBGaWxlQ2hhbmdlRXZlbnQsIGZpbGVOYW1lOiBzdHJpbmcpIHtcbiAgICBpZiAoY2FjaGVkT3B0aW9ucyAmJiBldmVudCA9PT0gRmlsZUNoYW5nZUV2ZW50LkNoYW5nZSAmJlxuICAgICAgICAvLyBUT0RPKGNodWNraik6IHZhbGlkYXRlIHRoYXQgdGhpcyBpcyBzdWZmaWNpZW50IHRvIHNraXAgZmlsZXMgdGhhdCB3ZXJlIHdyaXR0ZW4uXG4gICAgICAgIC8vIFRoaXMgYXNzdW1lcyB0aGF0IHRoZSBmaWxlIHBhdGggd2Ugd3JpdGUgaXMgdGhlIHNhbWUgZmlsZSBwYXRoIHdlIHdpbGwgcmVjZWl2ZSBpbiB0aGVcbiAgICAgICAgLy8gY2hhbmdlIG5vdGlmaWNhdGlvbi5cbiAgICAgICAgcGF0aC5ub3JtYWxpemUoZmlsZU5hbWUpID09PSBwYXRoLm5vcm1hbGl6ZShjYWNoZWRPcHRpb25zLnByb2plY3QpKSB7XG4gICAgICAvLyBJZiB0aGUgY29uZmlndXJhdGlvbiBmaWxlIGNoYW5nZXMsIGZvcmdldCBldmVyeXRoaW5nIGFuZCBzdGFydCB0aGUgcmVjb21waWxhdGlvbiB0aW1lclxuICAgICAgcmVzZXRPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgICAgZXZlbnQgPT09IEZpbGVDaGFuZ2VFdmVudC5DcmVhdGVEZWxldGUgfHwgZXZlbnQgPT09IEZpbGVDaGFuZ2VFdmVudC5DcmVhdGVEZWxldGVEaXIpIHtcbiAgICAgIC8vIElmIGEgZmlsZSB3YXMgYWRkZWQgb3IgcmVtb3ZlZCwgcmVyZWFkIHRoZSBjb25maWd1cmF0aW9uXG4gICAgICAvLyB0byBkZXRlcm1pbmUgdGhlIG5ldyBsaXN0IG9mIHJvb3QgZmlsZXMuXG4gICAgICBjYWNoZWRPcHRpb25zID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGlmIChldmVudCA9PT0gRmlsZUNoYW5nZUV2ZW50LkNyZWF0ZURlbGV0ZURpcikge1xuICAgICAgZmlsZUNhY2hlLmNsZWFyKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZpbGVDYWNoZS5kZWxldGUocGF0aC5ub3JtYWxpemUoZmlsZU5hbWUpKTtcbiAgICB9XG5cbiAgICBpZiAoIWlnbm9yZUZpbGVzRm9yV2F0Y2guaGFzKHBhdGgubm9ybWFsaXplKGZpbGVOYW1lKSkpIHtcbiAgICAgIC8vIElnbm9yZSB0aGUgZmlsZSBpZiB0aGUgZmlsZSBpcyBvbmUgdGhhdCB3YXMgd3JpdHRlbiBieSB0aGUgY29tcGlsZXIuXG4gICAgICBzdGFydFRpbWVyRm9yUmVjb21waWxhdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFVwb24gZGV0ZWN0aW5nIGEgZmlsZSBjaGFuZ2UsIHdhaXQgZm9yIDI1MG1zIGFuZCB0aGVuIHBlcmZvcm0gYSByZWNvbXBpbGF0aW9uLiBUaGlzIGdpdmVzIGJhdGNoXG4gIC8vIG9wZXJhdGlvbnMgKHN1Y2ggYXMgc2F2aW5nIGFsbCBtb2RpZmllZCBmaWxlcyBpbiBhbiBlZGl0b3IpIGEgY2hhbmNlIHRvIGNvbXBsZXRlIGJlZm9yZSB3ZSBraWNrXG4gIC8vIG9mZiBhIG5ldyBjb21waWxhdGlvbi5cbiAgZnVuY3Rpb24gc3RhcnRUaW1lckZvclJlY29tcGlsYXRpb24oKSB7XG4gICAgaWYgKHRpbWVySGFuZGxlRm9yUmVjb21waWxhdGlvbikge1xuICAgICAgaG9zdC5jbGVhclRpbWVvdXQodGltZXJIYW5kbGVGb3JSZWNvbXBpbGF0aW9uKTtcbiAgICB9XG4gICAgdGltZXJIYW5kbGVGb3JSZWNvbXBpbGF0aW9uID0gaG9zdC5zZXRUaW1lb3V0KHJlY29tcGlsZSwgMjUwKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlY29tcGlsZSgpIHtcbiAgICB0aW1lckhhbmRsZUZvclJlY29tcGlsYXRpb24gPSB1bmRlZmluZWQ7XG4gICAgaG9zdC5yZXBvcnREaWFnbm9zdGljcyhcbiAgICAgICAgW2NyZWF0ZU1lc3NhZ2VEaWFnbm9zdGljKCdGaWxlIGNoYW5nZSBkZXRlY3RlZC4gU3RhcnRpbmcgaW5jcmVtZW50YWwgY29tcGlsYXRpb24uJyldKTtcbiAgICBkb0NvbXBpbGF0aW9uKCk7XG4gIH1cbn1cbiJdfQ==