/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/path/src/util" />
/**
 * Convert Windows-style separators to POSIX separators.
 */
export declare function normalizeSeparators(path: string): string;
/**
 * Remove a .ts, .d.ts, or .js extension from a file name.
 */
export declare function stripExtension(path: string): string;
/**
 * Returns true if the normalized path is an absolute path.
 */
export declare function isAbsolutePath(path: string): boolean;
