/// <amd-module name="@angular/compiler-cli/ngcc/src/analysis/decoration_analyzer" />
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ConstantPool } from '@angular/compiler';
import * as ts from 'typescript';
import { ReferencesRegistry, ResourceLoader } from '../../../src/ngtsc/annotations';
import { CycleAnalyzer, ImportGraph } from '../../../src/ngtsc/cycles';
import { ModuleResolver, ReferenceEmitter } from '../../../src/ngtsc/imports';
import { CompoundMetadataReader, CompoundMetadataRegistry, DtsMetadataReader, LocalMetadataRegistry } from '../../../src/ngtsc/metadata';
import { PartialEvaluator } from '../../../src/ngtsc/partial_evaluator';
import { AbsoluteFsPath } from '../../../src/ngtsc/path';
import { LocalModuleScopeRegistry, MetadataDtsModuleScopeResolver } from '../../../src/ngtsc/scope';
import { CompileResult, DecoratorHandler } from '../../../src/ngtsc/transform';
import { DecoratedClass } from '../host/decorated_class';
import { NgccReflectionHost } from '../host/ngcc_host';
export interface AnalyzedFile {
    sourceFile: ts.SourceFile;
    analyzedClasses: AnalyzedClass[];
}
export interface AnalyzedClass extends DecoratedClass {
    diagnostics?: ts.Diagnostic[];
    matches: {
        handler: DecoratorHandler<any, any>;
        analysis: any;
    }[];
}
export interface CompiledClass extends AnalyzedClass {
    compilation: CompileResult[];
}
export interface CompiledFile {
    compiledClasses: CompiledClass[];
    sourceFile: ts.SourceFile;
    constantPool: ConstantPool;
}
export declare type DecorationAnalyses = Map<ts.SourceFile, CompiledFile>;
export declare const DecorationAnalyses: MapConstructor;
export interface MatchingHandler<A, M> {
    handler: DecoratorHandler<A, M>;
    detected: M;
}
/**
 * Simple class that resolves and loads files directly from the filesystem.
 */
declare class NgccResourceLoader implements ResourceLoader {
    canPreload: boolean;
    preload(): undefined | Promise<void>;
    load(url: string): string;
    resolve(url: string, containingFile: string): string;
}
/**
 * This Analyzer will analyze the files that have decorated classes that need to be transformed.
 */
export declare class DecorationAnalyzer {
    private program;
    private options;
    private host;
    private typeChecker;
    private reflectionHost;
    private referencesRegistry;
    private rootDirs;
    private isCore;
    resourceManager: NgccResourceLoader;
    metaRegistry: LocalMetadataRegistry;
    dtsMetaReader: DtsMetadataReader;
    fullMetaReader: CompoundMetadataReader;
    refEmitter: ReferenceEmitter;
    dtsModuleScopeResolver: MetadataDtsModuleScopeResolver;
    scopeRegistry: LocalModuleScopeRegistry;
    fullRegistry: CompoundMetadataRegistry;
    evaluator: PartialEvaluator;
    moduleResolver: ModuleResolver;
    importGraph: ImportGraph;
    cycleAnalyzer: CycleAnalyzer;
    handlers: DecoratorHandler<any, any>[];
    constructor(program: ts.Program, options: ts.CompilerOptions, host: ts.CompilerHost, typeChecker: ts.TypeChecker, reflectionHost: NgccReflectionHost, referencesRegistry: ReferencesRegistry, rootDirs: AbsoluteFsPath[], isCore: boolean);
    /**
     * Analyze a program to find all the decorated files should be transformed.
     *
     * @returns a map of the source files to the analysis for those files.
     */
    analyzeProgram(): DecorationAnalyses;
    protected analyzeFile(sourceFile: ts.SourceFile): AnalyzedFile | undefined;
    protected analyzeClass(clazz: DecoratedClass): AnalyzedClass | null;
    protected compileFile(analyzedFile: AnalyzedFile): CompiledFile;
    protected compileClass(clazz: AnalyzedClass, constantPool: ConstantPool): CompileResult[];
    protected resolveFile(analyzedFile: AnalyzedFile): void;
}
export {};
