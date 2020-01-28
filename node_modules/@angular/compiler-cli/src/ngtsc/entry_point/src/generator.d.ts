/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/entry_point/src/generator" />
import * as ts from 'typescript';
import { ShimGenerator } from '../../shims';
export declare class FlatIndexGenerator implements ShimGenerator {
    readonly entryPoint: string;
    readonly moduleName: string | null;
    readonly flatIndexPath: string;
    constructor(entryPoint: string, relativeFlatIndexPath: string, moduleName: string | null);
    recognize(fileName: string): boolean;
    generate(): ts.SourceFile;
}
