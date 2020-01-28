/// <amd-module name="@angular/compiler-cli/ngcc/src/packages/entry_point_bundle" />
import { AbsoluteFsPath } from '../../../src/ngtsc/path';
import { BundleProgram } from './bundle_program';
import { EntryPointFormat, EntryPointJsonProperty } from './entry_point';
/**
 * A bundle of files and paths (and TS programs) that correspond to a particular
 * format of a package entry-point.
 */
export interface EntryPointBundle {
    formatProperty: EntryPointJsonProperty;
    format: EntryPointFormat;
    isCore: boolean;
    isFlatCore: boolean;
    rootDirs: AbsoluteFsPath[];
    src: BundleProgram;
    dts: BundleProgram | null;
}
/**
 * Get an object that describes a formatted bundle for an entry-point.
 * @param entryPointPath The path to the entry-point that contains the bundle.
 * @param formatPath The path to the source files for this bundle.
 * @param typingsPath The path to the typings files if we should transform them with this bundle.
 * @param isCore This entry point is the Angular core package.
 * @param format The underlying format of the bundle.
 * @param transformDts Whether to transform the typings along with this bundle.
 */
export declare function makeEntryPointBundle(entryPointPath: string, formatPath: string, typingsPath: string, isCore: boolean, formatProperty: EntryPointJsonProperty, format: EntryPointFormat, transformDts: boolean): EntryPointBundle | null;
