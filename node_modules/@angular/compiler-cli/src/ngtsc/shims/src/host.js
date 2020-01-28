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
        define("@angular/compiler-cli/src/ngtsc/shims/src/host", ["require", "exports", "@angular/compiler-cli/src/ngtsc/path/src/types"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var types_1 = require("@angular/compiler-cli/src/ngtsc/path/src/types");
    /**
     * A wrapper around a `ts.CompilerHost` which supports generated files.
     */
    var GeneratedShimsHostWrapper = /** @class */ (function () {
        function GeneratedShimsHostWrapper(delegate, shimGenerators) {
            this.delegate = delegate;
            this.shimGenerators = shimGenerators;
            if (delegate.resolveModuleNames !== undefined) {
                this.resolveModuleNames =
                    function (moduleNames, containingFile, reusedNames, redirectedReference) {
                        return delegate.resolveModuleNames(moduleNames, containingFile, reusedNames, redirectedReference);
                    };
            }
            if (delegate.resolveTypeReferenceDirectives) {
                this.resolveTypeReferenceDirectives = function (names, containingFile) {
                    return delegate.resolveTypeReferenceDirectives(names, containingFile);
                };
            }
            if (delegate.directoryExists !== undefined) {
                this.directoryExists = function (directoryName) { return delegate.directoryExists(directoryName); };
            }
            if (delegate.getDirectories !== undefined) {
                this.getDirectories = function (path) { return delegate.getDirectories(path); };
            }
        }
        GeneratedShimsHostWrapper.prototype.getSourceFile = function (fileName, languageVersion, onError, shouldCreateNewSourceFile) {
            var _this = this;
            for (var i = 0; i < this.shimGenerators.length; i++) {
                var generator = this.shimGenerators[i];
                // TypeScript internal paths are guaranteed to be POSIX-like absolute file paths.
                var absoluteFsPath = types_1.AbsoluteFsPath.fromUnchecked(fileName);
                if (generator.recognize(absoluteFsPath)) {
                    var readFile = function (originalFile) {
                        return _this.delegate.getSourceFile(originalFile, languageVersion, onError, shouldCreateNewSourceFile) ||
                            null;
                    };
                    return generator.generate(absoluteFsPath, readFile) || undefined;
                }
            }
            return this.delegate.getSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile);
        };
        GeneratedShimsHostWrapper.prototype.getDefaultLibFileName = function (options) {
            return this.delegate.getDefaultLibFileName(options);
        };
        GeneratedShimsHostWrapper.prototype.writeFile = function (fileName, data, writeByteOrderMark, onError, sourceFiles) {
            return this.delegate.writeFile(fileName, data, writeByteOrderMark, onError, sourceFiles);
        };
        GeneratedShimsHostWrapper.prototype.getCurrentDirectory = function () { return this.delegate.getCurrentDirectory(); };
        GeneratedShimsHostWrapper.prototype.getCanonicalFileName = function (fileName) {
            return this.delegate.getCanonicalFileName(fileName);
        };
        GeneratedShimsHostWrapper.prototype.useCaseSensitiveFileNames = function () { return this.delegate.useCaseSensitiveFileNames(); };
        GeneratedShimsHostWrapper.prototype.getNewLine = function () { return this.delegate.getNewLine(); };
        GeneratedShimsHostWrapper.prototype.fileExists = function (fileName) {
            // Consider the file as existing whenever
            //  1) it really does exist in the delegate host, or
            //  2) at least one of the shim generators recognizes it
            // Note that we can pass the file name as branded absolute fs path because TypeScript
            // internally only passes POSIX-like paths.
            return this.delegate.fileExists(fileName) ||
                this.shimGenerators.some(function (gen) { return gen.recognize(types_1.AbsoluteFsPath.fromUnchecked(fileName)); });
        };
        GeneratedShimsHostWrapper.prototype.readFile = function (fileName) { return this.delegate.readFile(fileName); };
        return GeneratedShimsHostWrapper;
    }());
    exports.GeneratedShimsHostWrapper = GeneratedShimsHostWrapper;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9zdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2Mvc2hpbXMvc3JjL2hvc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFHSCx3RUFBb0Q7SUFvQnBEOztPQUVHO0lBQ0g7UUFDRSxtQ0FBb0IsUUFBeUIsRUFBVSxjQUErQjtZQUFsRSxhQUFRLEdBQVIsUUFBUSxDQUFpQjtZQUFVLG1CQUFjLEdBQWQsY0FBYyxDQUFpQjtZQUNwRixJQUFJLFFBQVEsQ0FBQyxrQkFBa0IsS0FBSyxTQUFTLEVBQUU7Z0JBQzdDLElBQUksQ0FBQyxrQkFBa0I7b0JBQ25CLFVBQUMsV0FBcUIsRUFBRSxjQUFzQixFQUFFLFdBQXNCLEVBQ3JFLG1CQUFpRDt3QkFDOUMsT0FBQSxRQUFRLENBQUMsa0JBQW9CLENBQ3pCLFdBQVcsRUFBRSxjQUFjLEVBQUUsV0FBVyxFQUFFLG1CQUFtQixDQUFDO29CQURsRSxDQUNrRSxDQUFDO2FBQzVFO1lBQ0QsSUFBSSxRQUFRLENBQUMsOEJBQThCLEVBQUU7Z0JBTTNDLElBQUksQ0FBQyw4QkFBOEIsR0FBRyxVQUFDLEtBQWUsRUFBRSxjQUFzQjtvQkFDMUUsT0FBQyxRQUFRLENBQUMsOEJBQXNFLENBQzVFLEtBQUssRUFBRSxjQUFjLENBQUM7Z0JBRDFCLENBQzBCLENBQUM7YUFDaEM7WUFDRCxJQUFJLFFBQVEsQ0FBQyxlQUFlLEtBQUssU0FBUyxFQUFFO2dCQUMxQyxJQUFJLENBQUMsZUFBZSxHQUFHLFVBQUMsYUFBcUIsSUFBSyxPQUFBLFFBQVEsQ0FBQyxlQUFpQixDQUFDLGFBQWEsQ0FBQyxFQUF6QyxDQUF5QyxDQUFDO2FBQzdGO1lBQ0QsSUFBSSxRQUFRLENBQUMsY0FBYyxLQUFLLFNBQVMsRUFBRTtnQkFDekMsSUFBSSxDQUFDLGNBQWMsR0FBRyxVQUFDLElBQVks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Ii8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQge0Fic29sdXRlRnNQYXRofSBmcm9tICcuLi8uLi9wYXRoL3NyYy90eXBlcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2hpbUdlbmVyYXRvciB7XG4gIC8qKlxuICAgKiBSZXR1cm5zIGB0cnVlYCBpZiB0aGlzIGdlbmVyYXRvciBpcyBpbnRlbmRlZCB0byBoYW5kbGUgdGhlIGdpdmVuIGZpbGUuXG4gICAqL1xuICByZWNvZ25pemUoZmlsZU5hbWU6IEFic29sdXRlRnNQYXRoKTogYm9vbGVhbjtcblxuICAvKipcbiAgICogR2VuZXJhdGUgYSBzaGltJ3MgYHRzLlNvdXJjZUZpbGVgIGZvciB0aGUgZ2l2ZW4gb3JpZ2luYWwgZmlsZS5cbiAgICpcbiAgICogYHJlYWRGaWxlYCBpcyBhIGZ1bmN0aW9uIHdoaWNoIGFsbG93cyB0aGUgZ2VuZXJhdG9yIHRvIGxvb2sgdXAgdGhlIGNvbnRlbnRzIG9mIGV4aXN0aW5nIHNvdXJjZVxuICAgKiBmaWxlcy4gSXQgcmV0dXJucyBudWxsIGlmIHRoZSByZXF1ZXN0ZWQgZmlsZSBkb2Vzbid0IGV4aXN0LlxuICAgKlxuICAgKiBJZiBgZ2VuZXJhdGVgIHJldHVybnMgbnVsbCwgdGhlbiB0aGUgc2hpbSBnZW5lcmF0b3IgZGVjbGluZXMgdG8gZ2VuZXJhdGUgdGhlIGZpbGUgYWZ0ZXIgYWxsLlxuICAgKi9cbiAgZ2VuZXJhdGUoZ2VuRmlsZU5hbWU6IEFic29sdXRlRnNQYXRoLCByZWFkRmlsZTogKGZpbGVOYW1lOiBzdHJpbmcpID0+IHRzLlNvdXJjZUZpbGUgfCBudWxsKTpcbiAgICAgIHRzLlNvdXJjZUZpbGV8bnVsbDtcbn1cblxuLyoqXG4gKiBBIHdyYXBwZXIgYXJvdW5kIGEgYHRzLkNvbXBpbGVySG9zdGAgd2hpY2ggc3VwcG9ydHMgZ2VuZXJhdGVkIGZpbGVzLlxuICovXG5leHBvcnQgY2xhc3MgR2VuZXJhdGVkU2hpbXNIb3N0V3JhcHBlciBpbXBsZW1lbnRzIHRzLkNvbXBpbGVySG9zdCB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZGVsZWdhdGU6IHRzLkNvbXBpbGVySG9zdCwgcHJpdmF0ZSBzaGltR2VuZXJhdG9yczogU2hpbUdlbmVyYXRvcltdKSB7XG4gICAgaWYgKGRlbGVnYXRlLnJlc29sdmVNb2R1bGVOYW1lcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnJlc29sdmVNb2R1bGVOYW1lcyA9XG4gICAgICAgICAgKG1vZHVsZU5hbWVzOiBzdHJpbmdbXSwgY29udGFpbmluZ0ZpbGU6IHN0cmluZywgcmV1c2VkTmFtZXM/OiBzdHJpbmdbXSxcbiAgICAgICAgICAgcmVkaXJlY3RlZFJlZmVyZW5jZT86IHRzLlJlc29sdmVkUHJvamVjdFJlZmVyZW5jZSkgPT5cbiAgICAgICAgICAgICAgZGVsZWdhdGUucmVzb2x2ZU1vZHVsZU5hbWVzICEoXG4gICAgICAgICAgICAgICAgICBtb2R1bGVOYW1lcywgY29udGFpbmluZ0ZpbGUsIHJldXNlZE5hbWVzLCByZWRpcmVjdGVkUmVmZXJlbmNlKTtcbiAgICB9XG4gICAgaWYgKGRlbGVnYXRlLnJlc29sdmVUeXBlUmVmZXJlbmNlRGlyZWN0aXZlcykge1xuICAgICAgLy8gQmFja3dhcmQgY29tcGF0aWJpbGl0eSB3aXRoIFR5cGVTY3JpcHQgMi45IGFuZCBvbGRlciBzaW5jZSByZXR1cm5cbiAgICAgIC8vIHR5cGUgaGFzIGNoYW5nZWQgZnJvbSAodHMuUmVzb2x2ZWRUeXBlUmVmZXJlbmNlRGlyZWN0aXZlIHwgdW5kZWZpbmVkKVtdXG4gICAgICAvLyB0byB0cy5SZXNvbHZlZFR5cGVSZWZlcmVuY2VEaXJlY3RpdmVbXSBpbiBUeXBlc2NyaXB0IDMuMFxuICAgICAgdHlwZSB0czNSZXNvbHZlVHlwZVJlZmVyZW5jZURpcmVjdGl2ZXMgPSAobmFtZXM6IHN0cmluZ1tdLCBjb250YWluaW5nRmlsZTogc3RyaW5nKSA9PlxuICAgICAgICAgIHRzLlJlc29sdmVkVHlwZVJlZmVyZW5jZURpcmVjdGl2ZVtdO1xuICAgICAgdGhpcy5yZXNvbHZlVHlwZVJlZmVyZW5jZURpcmVjdGl2ZXMgPSAobmFtZXM6IHN0cmluZ1tdLCBjb250YWluaW5nRmlsZTogc3RyaW5nKSA9PlxuICAgICAgICAgIChkZWxlZ2F0ZS5yZXNvbHZlVHlwZVJlZmVyZW5jZURpcmVjdGl2ZXMgYXMgdHMzUmVzb2x2ZVR5cGVSZWZlcmVuY2VEaXJlY3RpdmVzKSAhKFxuICAgICAgICAgICAgICBuYW1lcywgY29udGFpbmluZ0ZpbGUpO1xuICAgIH1cbiAgICBpZiAoZGVsZWdhdGUuZGlyZWN0b3J5RXhpc3RzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuZGlyZWN0b3J5RXhpc3RzID0gKGRpcmVjdG9yeU5hbWU6IHN0cmluZykgPT4gZGVsZWdhdGUuZGlyZWN0b3J5RXhpc3RzICEoZGlyZWN0b3J5TmFtZSk7XG4gICAgfVxuICAgIGlmIChkZWxlZ2F0ZS5nZXREaXJlY3RvcmllcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmdldERpcmVjdG9yaWVzID0gKHBhdGg6IHN0cmluZykgPT4gZGVsZWdhdGUuZ2V0RGlyZWN0b3JpZXMgIShwYXRoKTtcbiAgICB9XG4gIH1cblxuICByZXNvbHZlTW9kdWxlTmFtZXM/OlxuICAgICAgKG1vZHVsZU5hbWVzOiBzdHJpbmdbXSwgY29udGFpbmluZ0ZpbGU6IHN0cmluZywgcmV1c2VkTmFtZXM/OiBzdHJpbmdbXSxcbiAgICAgICByZWRpcmVjdGVkUmVmZXJlbmNlPzogdHMuUmVzb2x2ZWRQcm9qZWN0UmVmZXJlbmNlKSA9PiAodHMuUmVzb2x2ZWRNb2R1bGUgfCB1bmRlZmluZWQpW107XG5cbiAgcmVzb2x2ZVR5cGVSZWZlcmVuY2VEaXJlY3RpdmVzPzpcbiAgICAgIChuYW1lczogc3RyaW5nW10sIGNvbnRhaW5pbmdGaWxlOiBzdHJpbmcpID0+IHRzLlJlc29sdmVkVHlwZVJlZmVyZW5jZURpcmVjdGl2ZVtdO1xuXG4gIGRpcmVjdG9yeUV4aXN0cz86IChkaXJlY3RvcnlOYW1lOiBzdHJpbmcpID0+IGJvb2xlYW47XG5cbiAgZ2V0U291cmNlRmlsZShcbiAgICAgIGZpbGVOYW1lOiBzdHJpbmcsIGxhbmd1YWdlVmVyc2lvbjogdHMuU2NyaXB0VGFyZ2V0LFxuICAgICAgb25FcnJvcj86ICgobWVzc2FnZTogc3RyaW5nKSA9PiB2b2lkKXx1bmRlZmluZWQsXG4gICAgICBzaG91bGRDcmVhdGVOZXdTb3VyY2VGaWxlPzogYm9vbGVhbnx1bmRlZmluZWQpOiB0cy5Tb3VyY2VGaWxlfHVuZGVmaW5lZCB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNoaW1HZW5lcmF0b3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBnZW5lcmF0b3IgPSB0aGlzLnNoaW1HZW5lcmF0b3JzW2ldO1xuICAgICAgLy8gVHlwZVNjcmlwdCBpbnRlcm5hbCBwYXRocyBhcmUgZ3VhcmFudGVlZCB0byBiZSBQT1NJWC1saWtlIGFic29sdXRlIGZpbGUgcGF0aHMuXG4gICAgICBjb25zdCBhYnNvbHV0ZUZzUGF0aCA9IEFic29sdXRlRnNQYXRoLmZyb21VbmNoZWNrZWQoZmlsZU5hbWUpO1xuICAgICAgaWYgKGdlbmVyYXRvci5yZWNvZ25pemUoYWJzb2x1dGVGc1BhdGgpKSB7XG4gICAgICAgIGNvbnN0IHJlYWRGaWxlID0gKG9yaWdpbmFsRmlsZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZGVsZWdhdGUuZ2V0U291cmNlRmlsZShcbiAgICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsRmlsZSwgbGFuZ3VhZ2VWZXJzaW9uLCBvbkVycm9yLCBzaG91bGRDcmVhdGVOZXdTb3VyY2VGaWxlKSB8fFxuICAgICAgICAgICAgICBudWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBnZW5lcmF0b3IuZ2VuZXJhdGUoYWJzb2x1dGVGc1BhdGgsIHJlYWRGaWxlKSB8fCB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmRlbGVnYXRlLmdldFNvdXJjZUZpbGUoXG4gICAgICAgIGZpbGVOYW1lLCBsYW5ndWFnZVZlcnNpb24sIG9uRXJyb3IsIHNob3VsZENyZWF0ZU5ld1NvdXJjZUZpbGUpO1xuICB9XG5cbiAgZ2V0RGVmYXVsdExpYkZpbGVOYW1lKG9wdGlvbnM6IHRzLkNvbXBpbGVyT3B0aW9ucyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZGVsZWdhdGUuZ2V0RGVmYXVsdExpYkZpbGVOYW1lKG9wdGlvbnMpO1xuICB9XG5cbiAgd3JpdGVGaWxlKFxuICAgICAgZmlsZU5hbWU6IHN0cmluZywgZGF0YTogc3RyaW5nLCB3cml0ZUJ5dGVPcmRlck1hcms6IGJvb2xlYW4sXG4gICAgICBvbkVycm9yOiAoKG1lc3NhZ2U6IHN0cmluZykgPT4gdm9pZCl8dW5kZWZpbmVkLFxuICAgICAgc291cmNlRmlsZXM6IFJlYWRvbmx5QXJyYXk8dHMuU291cmNlRmlsZT58dW5kZWZpbmVkKTogdm9pZCB7XG4gICAgcmV0dXJuIHRoaXMuZGVsZWdhdGUud3JpdGVGaWxlKGZpbGVOYW1lLCBkYXRhLCB3cml0ZUJ5dGVPcmRlck1hcmssIG9uRXJyb3IsIHNvdXJjZUZpbGVzKTtcbiAgfVxuXG4gIGdldEN1cnJlbnREaXJlY3RvcnkoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuZGVsZWdhdGUuZ2V0Q3VycmVudERpcmVjdG9yeSgpOyB9XG5cbiAgZ2V0RGlyZWN0b3JpZXM/OiAocGF0aDogc3RyaW5nKSA9PiBzdHJpbmdbXTtcblxuICBnZXRDYW5vbmljYWxGaWxlTmFtZShmaWxlTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5kZWxlZ2F0ZS5nZXRDYW5vbmljYWxGaWxlTmFtZShmaWxlTmFtZSk7XG4gIH1cblxuICB1c2VDYXNlU2Vuc2l0aXZlRmlsZU5hbWVzKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5kZWxlZ2F0ZS51c2VDYXNlU2Vuc2l0aXZlRmlsZU5hbWVzKCk7IH1cblxuICBnZXROZXdMaW5lKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmRlbGVnYXRlLmdldE5ld0xpbmUoKTsgfVxuXG4gIGZpbGVFeGlzdHMoZmlsZU5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIC8vIENvbnNpZGVyIHRoZSBmaWxlIGFzIGV4aXN0aW5nIHdoZW5ldmVyXG4gICAgLy8gIDEpIGl0IHJlYWxseSBkb2VzIGV4aXN0IGluIHRoZSBkZWxlZ2F0ZSBob3N0LCBvclxuICAgIC8vICAyKSBhdCBsZWFzdCBvbmUgb2YgdGhlIHNoaW0gZ2VuZXJhdG9ycyByZWNvZ25pemVzIGl0XG4gICAgLy8gTm90ZSB0aGF0IHdlIGNhbiBwYXNzIHRoZSBmaWxlIG5hbWUgYXMgYnJhbmRlZCBhYnNvbHV0ZSBmcyBwYXRoIGJlY2F1c2UgVHlwZVNjcmlwdFxuICAgIC8vIGludGVybmFsbHkgb25seSBwYXNzZXMgUE9TSVgtbGlrZSBwYXRocy5cbiAgICByZXR1cm4gdGhpcy5kZWxlZ2F0ZS5maWxlRXhpc3RzKGZpbGVOYW1lKSB8fFxuICAgICAgICB0aGlzLnNoaW1HZW5lcmF0b3JzLnNvbWUoZ2VuID0+IGdlbi5yZWNvZ25pemUoQWJzb2x1dGVGc1BhdGguZnJvbVVuY2hlY2tlZChmaWxlTmFtZSkpKTtcbiAgfVxuXG4gIHJlYWRGaWxlKGZpbGVOYW1lOiBzdHJpbmcpOiBzdHJpbmd8dW5kZWZpbmVkIHsgcmV0dXJuIHRoaXMuZGVsZWdhdGUucmVhZEZpbGUoZmlsZU5hbWUpOyB9XG59XG4iXX0=