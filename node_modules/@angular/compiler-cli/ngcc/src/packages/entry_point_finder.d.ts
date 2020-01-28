/// <amd-module name="@angular/compiler-cli/ngcc/src/packages/entry_point_finder" />
import { AbsoluteFsPath } from '../../../src/ngtsc/path';
import { Logger } from '../logging/logger';
import { DependencyResolver, SortedEntryPointsInfo } from './dependency_resolver';
export declare class EntryPointFinder {
    private logger;
    private resolver;
    constructor(logger: Logger, resolver: DependencyResolver);
    /**
     * Search the given directory, and sub-directories, for Angular package entry points.
     * @param sourceDirectory An absolute path to the directory to search for entry points.
     */
    findEntryPoints(sourceDirectory: AbsoluteFsPath, targetEntryPointPath?: AbsoluteFsPath): SortedEntryPointsInfo;
    /**
     * Look for entry points that need to be compiled, starting at the source directory.
     * The function will recurse into directories that start with `@...`, e.g. `@angular/...`.
     * @param sourceDirectory An absolute path to the root directory where searching begins.
     */
    private walkDirectoryForEntryPoints;
    /**
     * Recurse the folder structure looking for all the entry points
     * @param packagePath The absolute path to an npm package that may contain entry points
     * @returns An array of entry points that were discovered.
     */
    private getEntryPointsForPackage;
    /**
     * Recursively walk a directory and its sub-directories, applying a given
     * function to each directory.
     * @param dir the directory to recursively walk.
     * @param fn the function to apply to each directory.
     */
    private walkDirectory;
}
