/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { EmittedFiles } from '@angular-devkit/build-webpack';
import { Path, virtualFs } from '@angular-devkit/core';
import { Observable } from 'rxjs';
import { ExtraEntryPoint } from '../../../browser/schema';
export interface WriteIndexHtmlOptions {
    host: virtualFs.Host;
    outputPath: Path;
    indexPath: Path;
    ES5BuildFiles: EmittedFiles[];
    ES2015BuildFiles: EmittedFiles[];
    baseHref?: string;
    deployUrl?: string;
    sri?: boolean;
    scripts?: ExtraEntryPoint[];
    styles?: ExtraEntryPoint[];
}
export declare function writeIndexHtml({ host, outputPath, indexPath, ES5BuildFiles, ES2015BuildFiles, baseHref, deployUrl, sri, scripts, styles, }: WriteIndexHtmlOptions): Observable<void>;
