/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/core/schematics/migrations/injectable-pipe/angular/injectable_pipe_visitor" />
import * as ts from 'typescript';
/**
 * Goes through all of the descendant nodes of a given node and lists out all of the pipes
 * that don't have `@Injectable`, as well as their `@Pipe` decorator and the import declaration
 * from which we'd need to import the `Injectable` decorator.
 */
export declare class InjectablePipeVisitor {
    private _typeChecker;
    /**
     * Keeps track of all the classes that have a `Pipe` decorator, but not `Injectable`, as well
     * as a reference to the `Pipe` decorator itself and import declarations from which we'll have
     * to import the `Injectable` decorator.
     */
    missingInjectablePipes: {
        classDeclaration: ts.ClassDeclaration;
        importDeclarationMissingImport: ts.ImportDeclaration | null;
        pipeDecorator: ts.Decorator;
    }[];
    constructor(_typeChecker: ts.TypeChecker);
    visitNode(node: ts.Node): void;
    private _visitClassDeclaration;
}
