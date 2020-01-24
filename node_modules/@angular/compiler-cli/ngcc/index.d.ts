/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/ngcc" />
export { ConsoleLogger, LogLevel } from './src/logging/console_logger';
export { Logger } from './src/logging/logger';
export { NgccOptions, mainNgcc as process } from './src/main';
export declare function hasBeenProcessed(packageJson: object, format: string): boolean;
