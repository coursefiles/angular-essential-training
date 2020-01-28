/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/core/schematics/migrations/injectable-pipe/util" />
import * as ts from 'typescript';
/** Name of the Injectable decorator. */
export declare const INJECTABLE_DECORATOR_NAME = "Injectable";
/**
 * Adds an import to a named import node, if the import does not exist already.
 * @param node Node to which to add the import.
 * @param importName Name of the import that should be added.
 */
export declare function addImport(node: ts.NamedImports, importName: string): ts.NamedImports;
/** Gets the named imports node from an import declaration. */
export declare function getNamedImports(node: ts.ImportDeclaration): ts.NamedImports | null;
