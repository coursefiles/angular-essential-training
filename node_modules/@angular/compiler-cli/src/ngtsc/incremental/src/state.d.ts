/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/incremental/src/state" />
import * as ts from 'typescript';
/**
 * Accumulates state between compilations.
 */
export declare class IncrementalState {
    private unchangedFiles;
    private metadata;
    private constructor();
    static reconcile(previousState: IncrementalState, oldProgram: ts.Program, newProgram: ts.Program): IncrementalState;
    static fresh(): IncrementalState;
    safeToSkipEmit(sf: ts.SourceFile): boolean;
    markFileAsSafeToSkipEmitIfUnchanged(sf: ts.SourceFile): void;
}
