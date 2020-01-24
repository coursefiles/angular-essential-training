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
        define("@angular/core/schematics/migrations/injectable-pipe", ["require", "exports", "@angular-devkit/schematics", "path", "typescript", "@angular/core/schematics/utils/project_tsconfig_paths", "@angular/core/schematics/utils/typescript/parse_tsconfig", "@angular/core/schematics/migrations/injectable-pipe/angular/injectable_pipe_visitor", "@angular/core/schematics/migrations/injectable-pipe/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const schematics_1 = require("@angular-devkit/schematics");
    const path_1 = require("path");
    const ts = require("typescript");
    const project_tsconfig_paths_1 = require("@angular/core/schematics/utils/project_tsconfig_paths");
    const parse_tsconfig_1 = require("@angular/core/schematics/utils/typescript/parse_tsconfig");
    const injectable_pipe_visitor_1 = require("@angular/core/schematics/migrations/injectable-pipe/angular/injectable_pipe_visitor");
    const util_1 = require("@angular/core/schematics/migrations/injectable-pipe/util");
    /**
     * Runs a migration over a TypeScript project that adds an `@Injectable`
     * annotation to all classes that have `@Pipe`.
     */
    function default_1() {
        return (tree) => {
            const { buildPaths, testPaths } = project_tsconfig_paths_1.getProjectTsConfigPaths(tree);
            const basePath = process.cwd();
            const allPaths = [...buildPaths, ...testPaths];
            if (!allPaths.length) {
                throw new schematics_1.SchematicsException('Could not find any tsconfig file. Cannot add Injectable annotation to pipes.');
            }
            for (const tsconfigPath of allPaths) {
                runInjectablePipeMigration(tree, tsconfigPath, basePath);
            }
        };
    }
    exports.default = default_1;
    function runInjectablePipeMigration(tree, tsconfigPath, basePath) {
        const parsed = parse_tsconfig_1.parseTsconfigFile(tsconfigPath, path_1.dirname(tsconfigPath));
        const host = ts.createCompilerHost(parsed.options, true);
        // We need to overwrite the host "readFile" method, as we want the TypeScript
        // program to be based on the file contents in the virtual file tree. Otherwise
        // if we run the migration for multiple tsconfig files which have intersecting
        // source files, it can end up updating query definitions multiple times.
        host.readFile = fileName => {
            const buffer = tree.read(path_1.relative(basePath, fileName));
            // Strip BOM as otherwise TSC methods (Ex: getWidth) will return an offset which
            // which breaks the CLI UpdateRecorder.
            // See: https://github.com/angular/angular/pull/30719
            return buffer ? buffer.toString().replace(/^\uFEFF/, '') : undefined;
        };
        const program = ts.createProgram(parsed.fileNames, parsed.options, host);
        const typeChecker = program.getTypeChecker();
        const visitor = new injectable_pipe_visitor_1.InjectablePipeVisitor(typeChecker);
        const sourceFiles = program.getSourceFiles().filter(f => !f.isDeclarationFile && !program.isSourceFileFromExternalLibrary(f));
        const printer = ts.createPrinter();
        sourceFiles.forEach(sourceFile => visitor.visitNode(sourceFile));
        visitor.missingInjectablePipes.forEach(data => {
            const { classDeclaration, importDeclarationMissingImport } = data;
            const sourceFile = classDeclaration.getSourceFile();
            const update = tree.beginUpdate(path_1.relative(basePath, sourceFile.fileName));
            // Note that we don't need to go through the AST to insert the decorator, because the change
            // is pretty basic. Also this has a better chance of preserving the user's formatting.
            update.insertLeft(classDeclaration.getStart(), `@${util_1.INJECTABLE_DECORATOR_NAME}()\n`);
            // Add @Injectable to the imports if it isn't imported already. Note that this doesn't deal with
            // the case where there aren't any imports for `@angular/core` at all. We don't need to handle
            // it because the Pipe decorator won't be recognized if it hasn't been imported from Angular.
            if (importDeclarationMissingImport) {
                const namedImports = util_1.getNamedImports(importDeclarationMissingImport);
                if (namedImports) {
                    update.remove(namedImports.getStart(), namedImports.getWidth());
                    update.insertRight(namedImports.getStart(), printer.printNode(ts.EmitHint.Unspecified, util_1.addImport(namedImports, util_1.INJECTABLE_DECORATOR_NAME), sourceFile));
                }
            }
            tree.commitUpdate(update);
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NjaGVtYXRpY3MvbWlncmF0aW9ucy9pbmplY3RhYmxlLXBpcGUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFFSCwyREFBMkU7SUFDM0UsK0JBQXVDO0lBQ3ZDLGlDQUFpQztJQUVqQyxrR0FBMkU7SUFDM0UsNkZBQXdFO0lBRXhFLGlJQUF3RTtJQUN4RSxtRkFBNkU7SUFFN0U7OztPQUdHO0lBQ0g7UUFDRSxPQUFPLENBQUMsSUFBVSxFQUFFLEVBQUU7WUFDcEIsTUFBTSxFQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUMsR0FBRyxnREFBdUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM5RCxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDL0IsTUFBTSxRQUFRLEdBQUcsQ0FBQyxHQUFHLFVBQVUsRUFBRSxHQUFHLFNBQVMsQ0FBQyxDQUFDO1lBRS9DLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFO2dCQUNwQixNQUFNLElBQUksZ0NBQW1CLENBQ3pCLDhFQUE4RSxDQUFDLENBQUM7YUFDckY7WUFFRCxLQUFLLE1BQU0sWUFBWSxJQUFJLFFBQVEsRUFBRTtnQkFDbkMsMEJBQTBCLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQzthQUMxRDtRQUNILENBQUMsQ0FBQztJQUNKLENBQUM7SUFmRCw0QkFlQztJQUVELFNBQVMsMEJBQTBCLENBQUMsSUFBVSxFQUFFLFlBQW9CLEVBQUUsUUFBZ0I7UUFDcEYsTUFBTSxNQUFNLEdBQUcsa0NBQWlCLENBQUMsWUFBWSxFQUFFLGNBQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBQ3RFLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRXpELDZFQUE2RTtRQUM3RSwrRUFBK0U7UUFDL0UsOEVBQThFO1FBQzlFLHlFQUF5RTtRQUN6RSxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxFQUFFO1lBQ3pCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBUSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ3ZELGdGQUFnRjtZQUNoRix1Q0FBdUM7WUFDdkMscURBQXFEO1lBQ3JELE9BQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQ3ZFLENBQUMsQ0FBQztRQUVGLE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3pFLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUM3QyxNQUFNLE9BQU8sR0FBRyxJQUFJLCtDQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3ZELE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxNQUFNLENBQy9DLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLElBQUksQ0FBQyxPQUFPLENBQUMsK0JBQStCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5RSxNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUM7UUFFbkMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUVqRSxPQUFPLENBQUMsc0JBQXNCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzVDLE1BQU0sRUFBQyxnQkFBZ0IsRUFBRSw4QkFBOEIsRUFBQyxHQUFHLElBQUksQ0FBQztZQUNoRSxNQUFNLFVBQVUsR0FBRyxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUNwRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGVBQVEsQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFFekUsNEZBQTRGO1lBQzVGLHNGQUFzRjtZQUN0RixNQUFNLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksZ0NBQXlCLE1BQU0sQ0FBQyxDQUFDO1lBRXBGLGdHQUFnRztZQUNoRyw4RkFBOEY7WUFDOUYsNkZBQTZGO1lBQzdGLElBQUksOEJBQThCLEVBQUU7Z0JBQ2xDLE1BQU0sWUFBWSxHQUFHLHNCQUFlLENBQUMsOEJBQThCLENBQUMsQ0FBQztnQkFFckUsSUFBSSxZQUFZLEVBQUU7b0JBQ2hCLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxFQUFFLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO29CQUNoRSxNQUFNLENBQUMsV0FBVyxDQUNkLFlBQVksQ0FBQyxRQUFRLEVBQUUsRUFDdkIsT0FBTyxDQUFDLFNBQVMsQ0FDYixFQUFFLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxnQkFBUyxDQUFDLFlBQVksRUFBRSxnQ0FBeUIsQ0FBQyxFQUMzRSxVQUFVLENBQUMsQ0FBQyxDQUFDO2lCQUN0QjthQUNGO1lBRUQsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7UnVsZSwgU2NoZW1hdGljc0V4Y2VwdGlvbiwgVHJlZX0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtkaXJuYW1lLCByZWxhdGl2ZX0gZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuaW1wb3J0IHtnZXRQcm9qZWN0VHNDb25maWdQYXRoc30gZnJvbSAnLi4vLi4vdXRpbHMvcHJvamVjdF90c2NvbmZpZ19wYXRocyc7XG5pbXBvcnQge3BhcnNlVHNjb25maWdGaWxlfSBmcm9tICcuLi8uLi91dGlscy90eXBlc2NyaXB0L3BhcnNlX3RzY29uZmlnJztcblxuaW1wb3J0IHtJbmplY3RhYmxlUGlwZVZpc2l0b3J9IGZyb20gJy4vYW5ndWxhci9pbmplY3RhYmxlX3BpcGVfdmlzaXRvcic7XG5pbXBvcnQge0lOSkVDVEFCTEVfREVDT1JBVE9SX05BTUUsIGFkZEltcG9ydCwgZ2V0TmFtZWRJbXBvcnRzfSBmcm9tICcuL3V0aWwnO1xuXG4vKipcbiAqIFJ1bnMgYSBtaWdyYXRpb24gb3ZlciBhIFR5cGVTY3JpcHQgcHJvamVjdCB0aGF0IGFkZHMgYW4gYEBJbmplY3RhYmxlYFxuICogYW5ub3RhdGlvbiB0byBhbGwgY2xhc3NlcyB0aGF0IGhhdmUgYEBQaXBlYC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKTogUnVsZSB7XG4gIHJldHVybiAodHJlZTogVHJlZSkgPT4ge1xuICAgIGNvbnN0IHtidWlsZFBhdGhzLCB0ZXN0UGF0aHN9ID0gZ2V0UHJvamVjdFRzQ29uZmlnUGF0aHModHJlZSk7XG4gICAgY29uc3QgYmFzZVBhdGggPSBwcm9jZXNzLmN3ZCgpO1xuICAgIGNvbnN0IGFsbFBhdGhzID0gWy4uLmJ1aWxkUGF0aHMsIC4uLnRlc3RQYXRoc107XG5cbiAgICBpZiAoIWFsbFBhdGhzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oXG4gICAgICAgICAgJ0NvdWxkIG5vdCBmaW5kIGFueSB0c2NvbmZpZyBmaWxlLiBDYW5ub3QgYWRkIEluamVjdGFibGUgYW5ub3RhdGlvbiB0byBwaXBlcy4nKTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IHRzY29uZmlnUGF0aCBvZiBhbGxQYXRocykge1xuICAgICAgcnVuSW5qZWN0YWJsZVBpcGVNaWdyYXRpb24odHJlZSwgdHNjb25maWdQYXRoLCBiYXNlUGF0aCk7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBydW5JbmplY3RhYmxlUGlwZU1pZ3JhdGlvbih0cmVlOiBUcmVlLCB0c2NvbmZpZ1BhdGg6IHN0cmluZywgYmFzZVBhdGg6IHN0cmluZykge1xuICBjb25zdCBwYXJzZWQgPSBwYXJzZVRzY29uZmlnRmlsZSh0c2NvbmZpZ1BhdGgsIGRpcm5hbWUodHNjb25maWdQYXRoKSk7XG4gIGNvbnN0IGhvc3QgPSB0cy5jcmVhdGVDb21waWxlckhvc3QocGFyc2VkLm9wdGlvbnMsIHRydWUpO1xuXG4gIC8vIFdlIG5lZWQgdG8gb3ZlcndyaXRlIHRoZSBob3N0IFwicmVhZEZpbGVcIiBtZXRob2QsIGFzIHdlIHdhbnQgdGhlIFR5cGVTY3JpcHRcbiAgLy8gcHJvZ3JhbSB0byBiZSBiYXNlZCBvbiB0aGUgZmlsZSBjb250ZW50cyBpbiB0aGUgdmlydHVhbCBmaWxlIHRyZWUuIE90aGVyd2lzZVxuICAvLyBpZiB3ZSBydW4gdGhlIG1pZ3JhdGlvbiBmb3IgbXVsdGlwbGUgdHNjb25maWcgZmlsZXMgd2hpY2ggaGF2ZSBpbnRlcnNlY3RpbmdcbiAgLy8gc291cmNlIGZpbGVzLCBpdCBjYW4gZW5kIHVwIHVwZGF0aW5nIHF1ZXJ5IGRlZmluaXRpb25zIG11bHRpcGxlIHRpbWVzLlxuICBob3N0LnJlYWRGaWxlID0gZmlsZU5hbWUgPT4ge1xuICAgIGNvbnN0IGJ1ZmZlciA9IHRyZWUucmVhZChyZWxhdGl2ZShiYXNlUGF0aCwgZmlsZU5hbWUpKTtcbiAgICAvLyBTdHJpcCBCT00gYXMgb3RoZXJ3aXNlIFRTQyBtZXRob2RzIChFeDogZ2V0V2lkdGgpIHdpbGwgcmV0dXJuIGFuIG9mZnNldCB3aGljaFxuICAgIC8vIHdoaWNoIGJyZWFrcyB0aGUgQ0xJIFVwZGF0ZVJlY29yZGVyLlxuICAgIC8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9wdWxsLzMwNzE5XG4gICAgcmV0dXJuIGJ1ZmZlciA/IGJ1ZmZlci50b1N0cmluZygpLnJlcGxhY2UoL15cXHVGRUZGLywgJycpIDogdW5kZWZpbmVkO1xuICB9O1xuXG4gIGNvbnN0IHByb2dyYW0gPSB0cy5jcmVhdGVQcm9ncmFtKHBhcnNlZC5maWxlTmFtZXMsIHBhcnNlZC5vcHRpb25zLCBob3N0KTtcbiAgY29uc3QgdHlwZUNoZWNrZXIgPSBwcm9ncmFtLmdldFR5cGVDaGVja2VyKCk7XG4gIGNvbnN0IHZpc2l0b3IgPSBuZXcgSW5qZWN0YWJsZVBpcGVWaXNpdG9yKHR5cGVDaGVja2VyKTtcbiAgY29uc3Qgc291cmNlRmlsZXMgPSBwcm9ncmFtLmdldFNvdXJjZUZpbGVzKCkuZmlsdGVyKFxuICAgICAgZiA9PiAhZi5pc0RlY2xhcmF0aW9uRmlsZSAmJiAhcHJvZ3JhbS5pc1NvdXJjZUZpbGVGcm9tRXh0ZXJuYWxMaWJyYXJ5KGYpKTtcbiAgY29uc3QgcHJpbnRlciA9IHRzLmNyZWF0ZVByaW50ZXIoKTtcblxuICBzb3VyY2VGaWxlcy5mb3JFYWNoKHNvdXJjZUZpbGUgPT4gdmlzaXRvci52aXNpdE5vZGUoc291cmNlRmlsZSkpO1xuXG4gIHZpc2l0b3IubWlzc2luZ0luamVjdGFibGVQaXBlcy5mb3JFYWNoKGRhdGEgPT4ge1xuICAgIGNvbnN0IHtjbGFzc0RlY2xhcmF0aW9uLCBpbXBvcnREZWNsYXJhdGlvbk1pc3NpbmdJbXBvcnR9ID0gZGF0YTtcbiAgICBjb25zdCBzb3VyY2VGaWxlID0gY2xhc3NEZWNsYXJhdGlvbi5nZXRTb3VyY2VGaWxlKCk7XG4gICAgY29uc3QgdXBkYXRlID0gdHJlZS5iZWdpblVwZGF0ZShyZWxhdGl2ZShiYXNlUGF0aCwgc291cmNlRmlsZS5maWxlTmFtZSkpO1xuXG4gICAgLy8gTm90ZSB0aGF0IHdlIGRvbid0IG5lZWQgdG8gZ28gdGhyb3VnaCB0aGUgQVNUIHRvIGluc2VydCB0aGUgZGVjb3JhdG9yLCBiZWNhdXNlIHRoZSBjaGFuZ2VcbiAgICAvLyBpcyBwcmV0dHkgYmFzaWMuIEFsc28gdGhpcyBoYXMgYSBiZXR0ZXIgY2hhbmNlIG9mIHByZXNlcnZpbmcgdGhlIHVzZXIncyBmb3JtYXR0aW5nLlxuICAgIHVwZGF0ZS5pbnNlcnRMZWZ0KGNsYXNzRGVjbGFyYXRpb24uZ2V0U3RhcnQoKSwgYEAke0lOSkVDVEFCTEVfREVDT1JBVE9SX05BTUV9KClcXG5gKTtcblxuICAgIC8vIEFkZCBASW5qZWN0YWJsZSB0byB0aGUgaW1wb3J0cyBpZiBpdCBpc24ndCBpbXBvcnRlZCBhbHJlYWR5LiBOb3RlIHRoYXQgdGhpcyBkb2Vzbid0IGRlYWwgd2l0aFxuICAgIC8vIHRoZSBjYXNlIHdoZXJlIHRoZXJlIGFyZW4ndCBhbnkgaW1wb3J0cyBmb3IgYEBhbmd1bGFyL2NvcmVgIGF0IGFsbC4gV2UgZG9uJ3QgbmVlZCB0byBoYW5kbGVcbiAgICAvLyBpdCBiZWNhdXNlIHRoZSBQaXBlIGRlY29yYXRvciB3b24ndCBiZSByZWNvZ25pemVkIGlmIGl0IGhhc24ndCBiZWVuIGltcG9ydGVkIGZyb20gQW5ndWxhci5cbiAgICBpZiAoaW1wb3J0RGVjbGFyYXRpb25NaXNzaW5nSW1wb3J0KSB7XG4gICAgICBjb25zdCBuYW1lZEltcG9ydHMgPSBnZXROYW1lZEltcG9ydHMoaW1wb3J0RGVjbGFyYXRpb25NaXNzaW5nSW1wb3J0KTtcblxuICAgICAgaWYgKG5hbWVkSW1wb3J0cykge1xuICAgICAgICB1cGRhdGUucmVtb3ZlKG5hbWVkSW1wb3J0cy5nZXRTdGFydCgpLCBuYW1lZEltcG9ydHMuZ2V0V2lkdGgoKSk7XG4gICAgICAgIHVwZGF0ZS5pbnNlcnRSaWdodChcbiAgICAgICAgICAgIG5hbWVkSW1wb3J0cy5nZXRTdGFydCgpLFxuICAgICAgICAgICAgcHJpbnRlci5wcmludE5vZGUoXG4gICAgICAgICAgICAgICAgdHMuRW1pdEhpbnQuVW5zcGVjaWZpZWQsIGFkZEltcG9ydChuYW1lZEltcG9ydHMsIElOSkVDVEFCTEVfREVDT1JBVE9SX05BTUUpLFxuICAgICAgICAgICAgICAgIHNvdXJjZUZpbGUpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0cmVlLmNvbW1pdFVwZGF0ZSh1cGRhdGUpO1xuICB9KTtcbn1cbiJdfQ==