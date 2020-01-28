/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/path/src/types" />
import * as ts from 'typescript';
/**
 * A `string` representing a specific type of path, with a particular brand `B`.
 *
 * A `string` is not assignable to a `BrandedPath`, but a `BrandedPath` is assignable to a `string`.
 * Two `BrandedPath`s with different brands are not mutually assignable.
 */
export declare type BrandedPath<B extends string> = string & {
    _brand: B;
};
/**
 * A fully qualified path in the file system, in POSIX form.
 */
export declare type AbsoluteFsPath = BrandedPath<'AbsoluteFsPath'>;
/**
 * A path that's relative to another (unspecified) root.
 *
 * This does not necessarily have to refer to a physical file.
 */
export declare type PathSegment = BrandedPath<'PathSegment'>;
/**
 * Contains utility functions for creating and manipulating `AbsoluteFsPath`s.
 */
export declare const AbsoluteFsPath: {
    /**
     * Convert the path `str` to an `AbsoluteFsPath`, throwing an error if it's not an absolute path.
     */
    from: (str: string) => BrandedPath<"AbsoluteFsPath">;
    /**
     * Assume that the path `str` is an `AbsoluteFsPath` in the correct format already.
     */
    fromUnchecked: (str: string) => BrandedPath<"AbsoluteFsPath">;
    /**
     * Extract an `AbsoluteFsPath` from a `ts.SourceFile`.
     *
     * This is cheaper than calling `AbsoluteFsPath.from(sf.fileName)`, as source files already have
     * their file path in absolute POSIX format.
     */
    fromSourceFile: (sf: ts.SourceFile) => BrandedPath<"AbsoluteFsPath">;
};
/**
 * Contains utility functions for creating and manipulating `PathSegment`s.
 */
export declare const PathSegment: {
    /**
     * Convert the path `str` to a `PathSegment`, throwing an error if it's not a relative path.
     */
    fromFsPath: (str: string) => BrandedPath<"PathSegment">;
    /**
     * Convert the path `str` to a `PathSegment`, while assuming that `str` is already normalized.
     */
    fromUnchecked: (str: string) => BrandedPath<"PathSegment">;
};
