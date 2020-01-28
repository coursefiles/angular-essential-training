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
        define("@angular/compiler-cli/ngcc", ["require", "exports", "@angular/compiler-cli/ngcc/src/packages/build_marker", "@angular/compiler-cli/ngcc/src/logging/console_logger", "@angular/compiler-cli/ngcc/src/main"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var build_marker_1 = require("@angular/compiler-cli/ngcc/src/packages/build_marker");
    var console_logger_1 = require("@angular/compiler-cli/ngcc/src/logging/console_logger");
    exports.ConsoleLogger = console_logger_1.ConsoleLogger;
    exports.LogLevel = console_logger_1.LogLevel;
    var main_1 = require("@angular/compiler-cli/ngcc/src/main");
    exports.process = main_1.mainNgcc;
    function hasBeenProcessed(packageJson, format) {
        // We are wrapping this function to hide the internal types.
        return build_marker_1.hasBeenProcessed(packageJson, format);
    }
    exports.hasBeenProcessed = hasBeenProcessed;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvbmdjYy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztJQUVILHFGQUFrRjtJQUdsRix3RkFBcUU7SUFBN0QseUNBQUEsYUFBYSxDQUFBO0lBQUUsb0NBQUEsUUFBUSxDQUFBO0lBRS9CLDREQUE0RDtJQUF2Qyx5QkFBQSxRQUFRLENBQVc7SUFFeEMsU0FBZ0IsZ0JBQWdCLENBQUMsV0FBbUIsRUFBRSxNQUFjO1FBQ2xFLDREQUE0RDtRQUM1RCxPQUFPLCtCQUFpQixDQUFDLFdBQW9DLEVBQUUsTUFBZ0MsQ0FBQyxDQUFDO0lBQ25HLENBQUM7SUFIRCw0Q0FHQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtoYXNCZWVuUHJvY2Vzc2VkIGFzIF9oYXNCZWVuUHJvY2Vzc2VkfSBmcm9tICcuL3NyYy9wYWNrYWdlcy9idWlsZF9tYXJrZXInO1xuaW1wb3J0IHtFbnRyeVBvaW50SnNvblByb3BlcnR5LCBFbnRyeVBvaW50UGFja2FnZUpzb259IGZyb20gJy4vc3JjL3BhY2thZ2VzL2VudHJ5X3BvaW50JztcblxuZXhwb3J0IHtDb25zb2xlTG9nZ2VyLCBMb2dMZXZlbH0gZnJvbSAnLi9zcmMvbG9nZ2luZy9jb25zb2xlX2xvZ2dlcic7XG5leHBvcnQge0xvZ2dlcn0gZnJvbSAnLi9zcmMvbG9nZ2luZy9sb2dnZXInO1xuZXhwb3J0IHtOZ2NjT3B0aW9ucywgbWFpbk5nY2MgYXMgcHJvY2Vzc30gZnJvbSAnLi9zcmMvbWFpbic7XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNCZWVuUHJvY2Vzc2VkKHBhY2thZ2VKc29uOiBvYmplY3QsIGZvcm1hdDogc3RyaW5nKSB7XG4gIC8vIFdlIGFyZSB3cmFwcGluZyB0aGlzIGZ1bmN0aW9uIHRvIGhpZGUgdGhlIGludGVybmFsIHR5cGVzLlxuICByZXR1cm4gX2hhc0JlZW5Qcm9jZXNzZWQocGFja2FnZUpzb24gYXMgRW50cnlQb2ludFBhY2thZ2VKc29uLCBmb3JtYXQgYXMgRW50cnlQb2ludEpzb25Qcm9wZXJ0eSk7XG59XG4iXX0=