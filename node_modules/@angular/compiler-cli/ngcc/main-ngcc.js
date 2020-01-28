#!/usr/bin/env node
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/main-ngcc", ["require", "exports", "canonical-path", "yargs", "@angular/compiler-cli/ngcc/src/main", "@angular/compiler-cli/ngcc/src/logging/console_logger"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var path = require("canonical-path");
    var yargs = require("yargs");
    var main_1 = require("@angular/compiler-cli/ngcc/src/main");
    var console_logger_1 = require("@angular/compiler-cli/ngcc/src/logging/console_logger");
    // CLI entry point
    if (require.main === module) {
        var args = process.argv.slice(2);
        var options = yargs
            .option('s', {
            alias: 'source',
            describe: 'A path (relative to the working directory) of the `node_modules` folder to process.',
            default: './node_modules'
        })
            .option('f', { alias: 'formats', hidden: true, array: true })
            .option('p', {
            alias: 'properties',
            array: true,
            describe: 'An array of names of properties in package.json to compile (e.g. `module` or `es2015`)\n' +
                'Each of these properties should hold the path to a bundle-format.\n' +
                'If provided, only the specified properties are considered for processing.\n' +
                'If not provided, all the supported format properties (e.g. fesm2015, fesm5, es2015, esm2015, esm5, main, module) in the package.json are considered.'
        })
            .option('t', {
            alias: 'target',
            describe: 'A relative path (from the `source` path) to a single entry-point to process (plus its dependencies).',
        })
            .option('first-only', {
            describe: 'If specified then only the first matching package.json property will be compiled.',
            type: 'boolean'
        })
            .option('l', {
            alias: 'loglevel',
            describe: 'The lowest severity logging message that should be output.',
            choices: ['debug', 'info', 'warn', 'error'],
        })
            .help()
            .parse(args);
        if (options['f'] && options['f'].length) {
            console.error('The formats option (-f/--formats) has been removed. Consider the properties option (-p/--properties) instead.');
            process.exit(1);
        }
        var baseSourcePath = path.resolve(options['s'] || './node_modules');
        var propertiesToConsider = options['p'];
        var targetEntryPointPath = options['t'] ? options['t'] : undefined;
        var compileAllFormats = !options['first-only'];
        var logLevel = options['l'];
        try {
            main_1.mainNgcc({
                basePath: baseSourcePath,
                propertiesToConsider: propertiesToConsider,
                targetEntryPointPath: targetEntryPointPath,
                compileAllFormats: compileAllFormats,
                logger: logLevel && new console_logger_1.ConsoleLogger(console_logger_1.LogLevel[logLevel]),
            });
            process.exitCode = 0;
        }
        catch (e) {
            console.error(e.stack || e.message);
            process.exitCode = 1;
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi1uZ2NjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL25nY2MvbWFpbi1uZ2NjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUNBOzs7Ozs7T0FNRztJQUNILHFDQUF1QztJQUN2Qyw2QkFBK0I7SUFFL0IsNERBQW9DO0lBQ3BDLHdGQUFxRTtJQUVyRSxrQkFBa0I7SUFDbEIsSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTtRQUMzQixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQyxJQUFNLE9BQU8sR0FDVCxLQUFLO2FBQ0EsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNYLEtBQUssRUFBRSxRQUFRO1lBQ2YsUUFBUSxFQUNKLHFGQUFxRjtZQUN6RixPQUFPLEVBQUUsZ0JBQWdCO1NBQzFCLENBQUM7YUFDRCxNQUFNLENBQUMsR0FBRyxFQUFFLEVBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUMsQ0FBQzthQUMxRCxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ1gsS0FBSyxFQUFFLFlBQVk7WUFDbkIsS0FBSyxFQUFFLElBQUk7WUFDWCxRQUFRLEVBQ0osMEZBQTBGO2dCQUMxRixxRUFBcUU7Z0JBQ3JFLDZFQUE2RTtnQkFDN0Usc0pBQXNKO1NBQzNKLENBQUM7YUFDRCxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ1gsS0FBSyxFQUFFLFFBQVE7WUFDZixRQUFRLEVBQ0osc0dBQXNHO1NBQzNHLENBQUM7YUFDRCxNQUFNLENBQUMsWUFBWSxFQUFFO1lBQ3BCLFFBQVEsRUFDSixtRkFBbUY7WUFDdkYsSUFBSSxFQUFFLFNBQVM7U0FDaEIsQ0FBQzthQUNELE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDWCxLQUFLLEVBQUUsVUFBVTtZQUNqQixRQUFRLEVBQUUsNERBQTREO1lBQ3RFLE9BQU8sRUFBRSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQztTQUM1QyxDQUFDO2FBQ0QsSUFBSSxFQUFFO2FBQ04sS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXJCLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUU7WUFDdkMsT0FBTyxDQUFDLEtBQUssQ0FDVCwrR0FBK0csQ0FBQyxDQUFDO1lBQ3JILE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDakI7UUFDRCxJQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3RFLElBQU0sb0JBQW9CLEdBQWEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BELElBQU0sb0JBQW9CLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUNyRSxJQUFNLGlCQUFpQixHQUFHLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ2pELElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQXNDLENBQUM7UUFDbkUsSUFBSTtZQUNGLGVBQVEsQ0FBQztnQkFDUCxRQUFRLEVBQUUsY0FBYztnQkFDeEIsb0JBQW9CLHNCQUFBO2dCQUNwQixvQkFBb0Isc0JBQUE7Z0JBQ3BCLGlCQUFpQixtQkFBQTtnQkFDakIsTUFBTSxFQUFFLFFBQVEsSUFBSSxJQUFJLDhCQUFhLENBQUMseUJBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUMxRCxDQUFDLENBQUM7WUFDSCxPQUFPLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztTQUN0QjtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNwQyxPQUFPLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztTQUN0QjtLQUNGIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdjYW5vbmljYWwtcGF0aCc7XG5pbXBvcnQgKiBhcyB5YXJncyBmcm9tICd5YXJncyc7XG5cbmltcG9ydCB7bWFpbk5nY2N9IGZyb20gJy4vc3JjL21haW4nO1xuaW1wb3J0IHtDb25zb2xlTG9nZ2VyLCBMb2dMZXZlbH0gZnJvbSAnLi9zcmMvbG9nZ2luZy9jb25zb2xlX2xvZ2dlcic7XG5cbi8vIENMSSBlbnRyeSBwb2ludFxuaWYgKHJlcXVpcmUubWFpbiA9PT0gbW9kdWxlKSB7XG4gIGNvbnN0IGFyZ3MgPSBwcm9jZXNzLmFyZ3Yuc2xpY2UoMik7XG4gIGNvbnN0IG9wdGlvbnMgPVxuICAgICAgeWFyZ3NcbiAgICAgICAgICAub3B0aW9uKCdzJywge1xuICAgICAgICAgICAgYWxpYXM6ICdzb3VyY2UnLFxuICAgICAgICAgICAgZGVzY3JpYmU6XG4gICAgICAgICAgICAgICAgJ0EgcGF0aCAocmVsYXRpdmUgdG8gdGhlIHdvcmtpbmcgZGlyZWN0b3J5KSBvZiB0aGUgYG5vZGVfbW9kdWxlc2AgZm9sZGVyIHRvIHByb2Nlc3MuJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICcuL25vZGVfbW9kdWxlcydcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5vcHRpb24oJ2YnLCB7YWxpYXM6ICdmb3JtYXRzJywgaGlkZGVuOsKgdHJ1ZSwgYXJyYXk6IHRydWV9KVxuICAgICAgICAgIC5vcHRpb24oJ3AnLCB7XG4gICAgICAgICAgICBhbGlhczogJ3Byb3BlcnRpZXMnLFxuICAgICAgICAgICAgYXJyYXk6IHRydWUsXG4gICAgICAgICAgICBkZXNjcmliZTpcbiAgICAgICAgICAgICAgICAnQW4gYXJyYXkgb2YgbmFtZXMgb2YgcHJvcGVydGllcyBpbiBwYWNrYWdlLmpzb24gdG8gY29tcGlsZSAoZS5nLiBgbW9kdWxlYCBvciBgZXMyMDE1YClcXG4nICtcbiAgICAgICAgICAgICAgICAnRWFjaCBvZiB0aGVzZSBwcm9wZXJ0aWVzIHNob3VsZCBob2xkIHRoZSBwYXRoIHRvIGEgYnVuZGxlLWZvcm1hdC5cXG4nICtcbiAgICAgICAgICAgICAgICAnSWYgcHJvdmlkZWQsIG9ubHkgdGhlIHNwZWNpZmllZCBwcm9wZXJ0aWVzIGFyZSBjb25zaWRlcmVkIGZvciBwcm9jZXNzaW5nLlxcbicgK1xuICAgICAgICAgICAgICAgICdJZiBub3QgcHJvdmlkZWQsIGFsbCB0aGUgc3VwcG9ydGVkIGZvcm1hdCBwcm9wZXJ0aWVzIChlLmcuIGZlc20yMDE1LCBmZXNtNSwgZXMyMDE1LCBlc20yMDE1LCBlc201LCBtYWluLCBtb2R1bGUpIGluIHRoZSBwYWNrYWdlLmpzb24gYXJlIGNvbnNpZGVyZWQuJ1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9wdGlvbigndCcsIHtcbiAgICAgICAgICAgIGFsaWFzOiAndGFyZ2V0JyxcbiAgICAgICAgICAgIGRlc2NyaWJlOlxuICAgICAgICAgICAgICAgICdBIHJlbGF0aXZlIHBhdGggKGZyb20gdGhlIGBzb3VyY2VgIHBhdGgpIHRvIGEgc2luZ2xlIGVudHJ5LXBvaW50IHRvIHByb2Nlc3MgKHBsdXMgaXRzIGRlcGVuZGVuY2llcykuJyxcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5vcHRpb24oJ2ZpcnN0LW9ubHknLCB7XG4gICAgICAgICAgICBkZXNjcmliZTpcbiAgICAgICAgICAgICAgICAnSWYgc3BlY2lmaWVkIHRoZW4gb25seSB0aGUgZmlyc3QgbWF0Y2hpbmcgcGFja2FnZS5qc29uIHByb3BlcnR5IHdpbGwgYmUgY29tcGlsZWQuJyxcbiAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9wdGlvbignbCcsIHtcbiAgICAgICAgICAgIGFsaWFzOiAnbG9nbGV2ZWwnLFxuICAgICAgICAgICAgZGVzY3JpYmU6ICdUaGUgbG93ZXN0IHNldmVyaXR5IGxvZ2dpbmcgbWVzc2FnZSB0aGF0IHNob3VsZCBiZSBvdXRwdXQuJyxcbiAgICAgICAgICAgIGNob2ljZXM6IFsnZGVidWcnLCAnaW5mbycsICd3YXJuJywgJ2Vycm9yJ10sXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuaGVscCgpXG4gICAgICAgICAgLnBhcnNlKGFyZ3MpO1xuXG4gIGlmIChvcHRpb25zWydmJ10gJiYgb3B0aW9uc1snZiddLmxlbmd0aCkge1xuICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICdUaGUgZm9ybWF0cyBvcHRpb24gKC1mLy0tZm9ybWF0cykgaGFzIGJlZW4gcmVtb3ZlZC4gQ29uc2lkZXIgdGhlIHByb3BlcnRpZXMgb3B0aW9uICgtcC8tLXByb3BlcnRpZXMpIGluc3RlYWQuJyk7XG4gICAgcHJvY2Vzcy5leGl0KDEpO1xuICB9XG4gIGNvbnN0IGJhc2VTb3VyY2VQYXRoID0gcGF0aC5yZXNvbHZlKG9wdGlvbnNbJ3MnXSB8fCAnLi9ub2RlX21vZHVsZXMnKTtcbiAgY29uc3QgcHJvcGVydGllc1RvQ29uc2lkZXI6IHN0cmluZ1tdID0gb3B0aW9uc1sncCddO1xuICBjb25zdCB0YXJnZXRFbnRyeVBvaW50UGF0aCA9IG9wdGlvbnNbJ3QnXSA/IG9wdGlvbnNbJ3QnXSA6IHVuZGVmaW5lZDtcbiAgY29uc3QgY29tcGlsZUFsbEZvcm1hdHMgPSAhb3B0aW9uc1snZmlyc3Qtb25seSddO1xuICBjb25zdCBsb2dMZXZlbCA9IG9wdGlvbnNbJ2wnXSBhcyBrZXlvZiB0eXBlb2YgTG9nTGV2ZWwgfCB1bmRlZmluZWQ7XG4gIHRyeSB7XG4gICAgbWFpbk5nY2Moe1xuICAgICAgYmFzZVBhdGg6IGJhc2VTb3VyY2VQYXRoLFxuICAgICAgcHJvcGVydGllc1RvQ29uc2lkZXIsXG4gICAgICB0YXJnZXRFbnRyeVBvaW50UGF0aCxcbiAgICAgIGNvbXBpbGVBbGxGb3JtYXRzLFxuICAgICAgbG9nZ2VyOiBsb2dMZXZlbCAmJiBuZXcgQ29uc29sZUxvZ2dlcihMb2dMZXZlbFtsb2dMZXZlbF0pLFxuICAgIH0pO1xuICAgIHByb2Nlc3MuZXhpdENvZGUgPSAwO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrIHx8IGUubWVzc2FnZSk7XG4gICAgcHJvY2Vzcy5leGl0Q29kZSA9IDE7XG4gIH1cbn1cbiJdfQ==