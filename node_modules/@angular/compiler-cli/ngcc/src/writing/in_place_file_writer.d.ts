/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/ngcc/src/writing/in_place_file_writer" />
import { EntryPoint } from '../packages/entry_point';
import { EntryPointBundle } from '../packages/entry_point_bundle';
import { FileInfo } from '../rendering/renderer';
import { FileWriter } from './file_writer';
/**
 * This FileWriter overwrites the transformed file, in-place, while creating
 * a back-up of the original file with an extra `.bak` extension.
 */
export declare class InPlaceFileWriter implements FileWriter {
    writeBundle(_entryPoint: EntryPoint, _bundle: EntryPointBundle, transformedFiles: FileInfo[]): void;
    protected writeFileAndBackup(file: FileInfo): void;
}
