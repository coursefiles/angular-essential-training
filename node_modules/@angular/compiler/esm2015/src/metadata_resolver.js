/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { StaticSymbol } from './aot/static_symbol';
import { ngfactoryFilePath } from './aot/util';
import { assertArrayOfStrings, assertInterpolationSymbols } from './assertions';
import * as cpl from './compile_metadata';
import { ChangeDetectionStrategy, Type, ViewEncapsulation, createAttribute, createComponent, createHost, createInject, createInjectable, createInjectionToken, createNgModule, createOptional, createSelf, createSkipSelf } from './core';
import { findLast } from './directive_resolver';
import { Identifiers } from './identifiers';
import { getAllLifecycleHooks } from './lifecycle_reflector';
import { CssSelector } from './selector';
import { SyncAsync, ValueTransformer, isPromise, noUndefined, resolveForwardRef, stringify, syntaxError, visitValue } from './util';
export const ERROR_COMPONENT_TYPE = 'ngComponentType';
// Design notes:
// - don't lazily create metadata:
//   For some metadata, we need to do async work sometimes,
//   so the user has to kick off this loading.
//   But we want to report errors even when the async work is
//   not required to check that the user would have been able
//   to wait correctly.
export class CompileMetadataResolver {
    constructor(_config, _htmlParser, _ngModuleResolver, _directiveResolver, _pipeResolver, _summaryResolver, _schemaRegistry, _directiveNormalizer, _console, _staticSymbolCache, _reflector, _errorCollector) {
        this._config = _config;
        this._htmlParser = _htmlParser;
        this._ngModuleResolver = _ngModuleResolver;
        this._directiveResolver = _directiveResolver;
        this._pipeResolver = _pipeResolver;
        this._summaryResolver = _summaryResolver;
        this._schemaRegistry = _schemaRegistry;
        this._directiveNormalizer = _directiveNormalizer;
        this._console = _console;
        this._staticSymbolCache = _staticSymbolCache;
        this._reflector = _reflector;
        this._errorCollector = _errorCollector;
        this._nonNormalizedDirectiveCache = new Map();
        this._directiveCache = new Map();
        this._summaryCache = new Map();
        this._pipeCache = new Map();
        this._ngModuleCache = new Map();
        this._ngModuleOfTypes = new Map();
        this._shallowModuleCache = new Map();
    }
    getReflector() { return this._reflector; }
    clearCacheFor(type) {
        const dirMeta = this._directiveCache.get(type);
        this._directiveCache.delete(type);
        this._nonNormalizedDirectiveCache.delete(type);
        this._summaryCache.delete(type);
        this._pipeCache.delete(type);
        this._ngModuleOfTypes.delete(type);
        // Clear all of the NgModule as they contain transitive information!
        this._ngModuleCache.clear();
        if (dirMeta) {
            this._directiveNormalizer.clearCacheFor(dirMeta);
        }
    }
    clearCache() {
        this._directiveCache.clear();
        this._nonNormalizedDirectiveCache.clear();
        this._summaryCache.clear();
        this._pipeCache.clear();
        this._ngModuleCache.clear();
        this._ngModuleOfTypes.clear();
        this._directiveNormalizer.clearCache();
    }
    _createProxyClass(baseType, name) {
        let delegate = null;
        const proxyClass = function () {
            if (!delegate) {
                throw new Error(`Illegal state: Class ${name} for type ${stringify(baseType)} is not compiled yet!`);
            }
            return delegate.apply(this, arguments);
        };
        proxyClass.setDelegate = (d) => {
            delegate = d;
            proxyClass.prototype = d.prototype;
        };
        // Make stringify work correctly
        proxyClass.overriddenName = name;
        return proxyClass;
    }
    getGeneratedClass(dirType, name) {
        if (dirType instanceof StaticSymbol) {
            return this._staticSymbolCache.get(ngfactoryFilePath(dirType.filePath), name);
        }
        else {
            return this._createProxyClass(dirType, name);
        }
    }
    getComponentViewClass(dirType) {
        return this.getGeneratedClass(dirType, cpl.viewClassName(dirType, 0));
    }
    getHostComponentViewClass(dirType) {
        return this.getGeneratedClass(dirType, cpl.hostViewClassName(dirType));
    }
    getHostComponentType(dirType) {
        const name = `${cpl.identifierName({ reference: dirType })}_Host`;
        if (dirType instanceof StaticSymbol) {
            return this._staticSymbolCache.get(dirType.filePath, name);
        }
        return this._createProxyClass(dirType, name);
    }
    getRendererType(dirType) {
        if (dirType instanceof StaticSymbol) {
            return this._staticSymbolCache.get(ngfactoryFilePath(dirType.filePath), cpl.rendererTypeName(dirType));
        }
        else {
            // returning an object as proxy,
            // that we fill later during runtime compilation.
            return {};
        }
    }
    getComponentFactory(selector, dirType, inputs, outputs) {
        if (dirType instanceof StaticSymbol) {
            return this._staticSymbolCache.get(ngfactoryFilePath(dirType.filePath), cpl.componentFactoryName(dirType));
        }
        else {
            const hostView = this.getHostComponentViewClass(dirType);
            // Note: ngContentSelectors will be filled later once the template is
            // loaded.
            const createComponentFactory = this._reflector.resolveExternalReference(Identifiers.createComponentFactory);
            return createComponentFactory(selector, dirType, hostView, inputs, outputs, []);
        }
    }
    initComponentFactory(factory, ngContentSelectors) {
        if (!(factory instanceof StaticSymbol)) {
            factory.ngContentSelectors.push(...ngContentSelectors);
        }
    }
    _loadSummary(type, kind) {
        let typeSummary = this._summaryCache.get(type);
        if (!typeSummary) {
            const summary = this._summaryResolver.resolveSummary(type);
            typeSummary = summary ? summary.type : null;
            this._summaryCache.set(type, typeSummary || null);
        }
        return typeSummary && typeSummary.summaryKind === kind ? typeSummary : null;
    }
    getHostComponentMetadata(compMeta, hostViewType) {
        const hostType = this.getHostComponentType(compMeta.type.reference);
        if (!hostViewType) {
            hostViewType = this.getHostComponentViewClass(hostType);
        }
        // Note: ! is ok here as this method should only be called with normalized directive
        // metadata, which always fills in the selector.
        const template = CssSelector.parse(compMeta.selector)[0].getMatchingElementTemplate();
        const templateUrl = '';
        const htmlAst = this._htmlParser.parse(template, templateUrl);
        return cpl.CompileDirectiveMetadata.create({
            isHost: true,
            type: { reference: hostType, diDeps: [], lifecycleHooks: [] },
            template: new cpl.CompileTemplateMetadata({
                encapsulation: ViewEncapsulation.None,
                template,
                templateUrl,
                htmlAst,
                styles: [],
                styleUrls: [],
                ngContentSelectors: [],
                animations: [],
                isInline: true,
                externalStylesheets: [],
                interpolation: null,
                preserveWhitespaces: false,
            }),
            exportAs: null,
            changeDetection: ChangeDetectionStrategy.Default,
            inputs: [],
            outputs: [],
            host: {},
            isComponent: true,
            selector: '*',
            providers: [],
            viewProviders: [],
            queries: [],
            guards: {},
            viewQueries: [],
            componentViewType: hostViewType,
            rendererType: { id: '__Host__', encapsulation: ViewEncapsulation.None, styles: [], data: {} },
            entryComponents: [],
            componentFactory: null
        });
    }
    loadDirectiveMetadata(ngModuleType, directiveType, isSync) {
        if (this._directiveCache.has(directiveType)) {
            return null;
        }
        directiveType = resolveForwardRef(directiveType);
        const { annotation, metadata } = this.getNonNormalizedDirectiveMetadata(directiveType);
        const createDirectiveMetadata = (templateMetadata) => {
            const normalizedDirMeta = new cpl.CompileDirectiveMetadata({
                isHost: false,
                type: metadata.type,
                isComponent: metadata.isComponent,
                selector: metadata.selector,
                exportAs: metadata.exportAs,
                changeDetection: metadata.changeDetection,
                inputs: metadata.inputs,
                outputs: metadata.outputs,
                hostListeners: metadata.hostListeners,
                hostProperties: metadata.hostProperties,
                hostAttributes: metadata.hostAttributes,
                providers: metadata.providers,
                viewProviders: metadata.viewProviders,
                queries: metadata.queries,
                guards: metadata.guards,
                viewQueries: metadata.viewQueries,
                entryComponents: metadata.entryComponents,
                componentViewType: metadata.componentViewType,
                rendererType: metadata.rendererType,
                componentFactory: metadata.componentFactory,
                template: templateMetadata
            });
            if (templateMetadata) {
                this.initComponentFactory(metadata.componentFactory, templateMetadata.ngContentSelectors);
            }
            this._directiveCache.set(directiveType, normalizedDirMeta);
            this._summaryCache.set(directiveType, normalizedDirMeta.toSummary());
            return null;
        };
        if (metadata.isComponent) {
            const template = metadata.template;
            const templateMeta = this._directiveNormalizer.normalizeTemplate({
                ngModuleType,
                componentType: directiveType,
                moduleUrl: this._reflector.componentModuleUrl(directiveType, annotation),
                encapsulation: template.encapsulation,
                template: template.template,
                templateUrl: template.templateUrl,
                styles: template.styles,
                styleUrls: template.styleUrls,
                animations: template.animations,
                interpolation: template.interpolation,
                preserveWhitespaces: template.preserveWhitespaces
            });
            if (isPromise(templateMeta) && isSync) {
                this._reportError(componentStillLoadingError(directiveType), directiveType);
                return null;
            }
            return SyncAsync.then(templateMeta, createDirectiveMetadata);
        }
        else {
            // directive
            createDirectiveMetadata(null);
            return null;
        }
    }
    getNonNormalizedDirectiveMetadata(directiveType) {
        directiveType = resolveForwardRef(directiveType);
        if (!directiveType) {
            return null;
        }
        let cacheEntry = this._nonNormalizedDirectiveCache.get(directiveType);
        if (cacheEntry) {
            return cacheEntry;
        }
        const dirMeta = this._directiveResolver.resolve(directiveType, false);
        if (!dirMeta) {
            return null;
        }
        let nonNormalizedTemplateMetadata = undefined;
        if (createComponent.isTypeOf(dirMeta)) {
            // component
            const compMeta = dirMeta;
            assertArrayOfStrings('styles', compMeta.styles);
            assertArrayOfStrings('styleUrls', compMeta.styleUrls);
            assertInterpolationSymbols('interpolation', compMeta.interpolation);
            const animations = compMeta.animations;
            nonNormalizedTemplateMetadata = new cpl.CompileTemplateMetadata({
                encapsulation: noUndefined(compMeta.encapsulation),
                template: noUndefined(compMeta.template),
                templateUrl: noUndefined(compMeta.templateUrl),
                htmlAst: null,
                styles: compMeta.styles || [],
                styleUrls: compMeta.styleUrls || [],
                animations: animations || [],
                interpolation: noUndefined(compMeta.interpolation),
                isInline: !!compMeta.template,
                externalStylesheets: [],
                ngContentSelectors: [],
                preserveWhitespaces: noUndefined(dirMeta.preserveWhitespaces),
            });
        }
        let changeDetectionStrategy = null;
        let viewProviders = [];
        let entryComponentMetadata = [];
        let selector = dirMeta.selector;
        if (createComponent.isTypeOf(dirMeta)) {
            // Component
            const compMeta = dirMeta;
            changeDetectionStrategy = compMeta.changeDetection;
            if (compMeta.viewProviders) {
                viewProviders = this._getProvidersMetadata(compMeta.viewProviders, entryComponentMetadata, `viewProviders for "${stringifyType(directiveType)}"`, [], directiveType);
            }
            if (compMeta.entryComponents) {
                entryComponentMetadata = flattenAndDedupeArray(compMeta.entryComponents)
                    .map((type) => this._getEntryComponentMetadata(type))
                    .concat(entryComponentMetadata);
            }
            if (!selector) {
                selector = this._schemaRegistry.getDefaultComponentElementName();
            }
        }
        else {
            // Directive
            if (!selector) {
                this._reportError(syntaxError(`Directive ${stringifyType(directiveType)} has no selector, please add it!`), directiveType);
                selector = 'error';
            }
        }
        let providers = [];
        if (dirMeta.providers != null) {
            providers = this._getProvidersMetadata(dirMeta.providers, entryComponentMetadata, `providers for "${stringifyType(directiveType)}"`, [], directiveType);
        }
        let queries = [];
        let viewQueries = [];
        if (dirMeta.queries != null) {
            queries = this._getQueriesMetadata(dirMeta.queries, false, directiveType);
            viewQueries = this._getQueriesMetadata(dirMeta.queries, true, directiveType);
        }
        const metadata = cpl.CompileDirectiveMetadata.create({
            isHost: false,
            selector: selector,
            exportAs: noUndefined(dirMeta.exportAs),
            isComponent: !!nonNormalizedTemplateMetadata,
            type: this._getTypeMetadata(directiveType),
            template: nonNormalizedTemplateMetadata,
            changeDetection: changeDetectionStrategy,
            inputs: dirMeta.inputs || [],
            outputs: dirMeta.outputs || [],
            host: dirMeta.host || {},
            providers: providers || [],
            viewProviders: viewProviders || [],
            queries: queries || [],
            guards: dirMeta.guards || {},
            viewQueries: viewQueries || [],
            entryComponents: entryComponentMetadata,
            componentViewType: nonNormalizedTemplateMetadata ? this.getComponentViewClass(directiveType) :
                null,
            rendererType: nonNormalizedTemplateMetadata ? this.getRendererType(directiveType) : null,
            componentFactory: null
        });
        if (nonNormalizedTemplateMetadata) {
            metadata.componentFactory =
                this.getComponentFactory(selector, directiveType, metadata.inputs, metadata.outputs);
        }
        cacheEntry = { metadata, annotation: dirMeta };
        this._nonNormalizedDirectiveCache.set(directiveType, cacheEntry);
        return cacheEntry;
    }
    /**
     * Gets the metadata for the given directive.
     * This assumes `loadNgModuleDirectiveAndPipeMetadata` has been called first.
     */
    getDirectiveMetadata(directiveType) {
        const dirMeta = this._directiveCache.get(directiveType);
        if (!dirMeta) {
            this._reportError(syntaxError(`Illegal state: getDirectiveMetadata can only be called after loadNgModuleDirectiveAndPipeMetadata for a module that declares it. Directive ${stringifyType(directiveType)}.`), directiveType);
        }
        return dirMeta;
    }
    getDirectiveSummary(dirType) {
        const dirSummary = this._loadSummary(dirType, cpl.CompileSummaryKind.Directive);
        if (!dirSummary) {
            this._reportError(syntaxError(`Illegal state: Could not load the summary for directive ${stringifyType(dirType)}.`), dirType);
        }
        return dirSummary;
    }
    isDirective(type) {
        return !!this._loadSummary(type, cpl.CompileSummaryKind.Directive) ||
            this._directiveResolver.isDirective(type);
    }
    isPipe(type) {
        return !!this._loadSummary(type, cpl.CompileSummaryKind.Pipe) ||
            this._pipeResolver.isPipe(type);
    }
    isNgModule(type) {
        return !!this._loadSummary(type, cpl.CompileSummaryKind.NgModule) ||
            this._ngModuleResolver.isNgModule(type);
    }
    getNgModuleSummary(moduleType, alreadyCollecting = null) {
        let moduleSummary = this._loadSummary(moduleType, cpl.CompileSummaryKind.NgModule);
        if (!moduleSummary) {
            const moduleMeta = this.getNgModuleMetadata(moduleType, false, alreadyCollecting);
            moduleSummary = moduleMeta ? moduleMeta.toSummary() : null;
            if (moduleSummary) {
                this._summaryCache.set(moduleType, moduleSummary);
            }
        }
        return moduleSummary;
    }
    /**
     * Loads the declared directives and pipes of an NgModule.
     */
    loadNgModuleDirectiveAndPipeMetadata(moduleType, isSync, throwIfNotFound = true) {
        const ngModule = this.getNgModuleMetadata(moduleType, throwIfNotFound);
        const loading = [];
        if (ngModule) {
            ngModule.declaredDirectives.forEach((id) => {
                const promise = this.loadDirectiveMetadata(moduleType, id.reference, isSync);
                if (promise) {
                    loading.push(promise);
                }
            });
            ngModule.declaredPipes.forEach((id) => this._loadPipeMetadata(id.reference));
        }
        return Promise.all(loading);
    }
    getShallowModuleMetadata(moduleType) {
        let compileMeta = this._shallowModuleCache.get(moduleType);
        if (compileMeta) {
            return compileMeta;
        }
        const ngModuleMeta = findLast(this._reflector.shallowAnnotations(moduleType), createNgModule.isTypeOf);
        compileMeta = {
            type: this._getTypeMetadata(moduleType),
            rawExports: ngModuleMeta.exports,
            rawImports: ngModuleMeta.imports,
            rawProviders: ngModuleMeta.providers,
        };
        this._shallowModuleCache.set(moduleType, compileMeta);
        return compileMeta;
    }
    getNgModuleMetadata(moduleType, throwIfNotFound = true, alreadyCollecting = null) {
        moduleType = resolveForwardRef(moduleType);
        let compileMeta = this._ngModuleCache.get(moduleType);
        if (compileMeta) {
            return compileMeta;
        }
        const meta = this._ngModuleResolver.resolve(moduleType, throwIfNotFound);
        if (!meta) {
            return null;
        }
        const declaredDirectives = [];
        const exportedNonModuleIdentifiers = [];
        const declaredPipes = [];
        const importedModules = [];
        const exportedModules = [];
        const providers = [];
        const entryComponents = [];
        const bootstrapComponents = [];
        const schemas = [];
        if (meta.imports) {
            flattenAndDedupeArray(meta.imports).forEach((importedType) => {
                let importedModuleType = undefined;
                if (isValidType(importedType)) {
                    importedModuleType = importedType;
                }
                else if (importedType && importedType.ngModule) {
                    const moduleWithProviders = importedType;
                    importedModuleType = moduleWithProviders.ngModule;
                    if (moduleWithProviders.providers) {
                        providers.push(...this._getProvidersMetadata(moduleWithProviders.providers, entryComponents, `provider for the NgModule '${stringifyType(importedModuleType)}'`, [], importedType));
                    }
                }
                if (importedModuleType) {
                    if (this._checkSelfImport(moduleType, importedModuleType))
                        return;
                    if (!alreadyCollecting)
                        alreadyCollecting = new Set();
                    if (alreadyCollecting.has(importedModuleType)) {
                        this._reportError(syntaxError(`${this._getTypeDescriptor(importedModuleType)} '${stringifyType(importedType)}' is imported recursively by the module '${stringifyType(moduleType)}'.`), moduleType);
                        return;
                    }
                    alreadyCollecting.add(importedModuleType);
                    const importedModuleSummary = this.getNgModuleSummary(importedModuleType, alreadyCollecting);
                    alreadyCollecting.delete(importedModuleType);
                    if (!importedModuleSummary) {
                        this._reportError(syntaxError(`Unexpected ${this._getTypeDescriptor(importedType)} '${stringifyType(importedType)}' imported by the module '${stringifyType(moduleType)}'. Please add a @NgModule annotation.`), moduleType);
                        return;
                    }
                    importedModules.push(importedModuleSummary);
                }
                else {
                    this._reportError(syntaxError(`Unexpected value '${stringifyType(importedType)}' imported by the module '${stringifyType(moduleType)}'`), moduleType);
                    return;
                }
            });
        }
        if (meta.exports) {
            flattenAndDedupeArray(meta.exports).forEach((exportedType) => {
                if (!isValidType(exportedType)) {
                    this._reportError(syntaxError(`Unexpected value '${stringifyType(exportedType)}' exported by the module '${stringifyType(moduleType)}'`), moduleType);
                    return;
                }
                if (!alreadyCollecting)
                    alreadyCollecting = new Set();
                if (alreadyCollecting.has(exportedType)) {
                    this._reportError(syntaxError(`${this._getTypeDescriptor(exportedType)} '${stringify(exportedType)}' is exported recursively by the module '${stringifyType(moduleType)}'`), moduleType);
                    return;
                }
                alreadyCollecting.add(exportedType);
                const exportedModuleSummary = this.getNgModuleSummary(exportedType, alreadyCollecting);
                alreadyCollecting.delete(exportedType);
                if (exportedModuleSummary) {
                    exportedModules.push(exportedModuleSummary);
                }
                else {
                    exportedNonModuleIdentifiers.push(this._getIdentifierMetadata(exportedType));
                }
            });
        }
        // Note: This will be modified later, so we rely on
        // getting a new instance every time!
        const transitiveModule = this._getTransitiveNgModuleMetadata(importedModules, exportedModules);
        if (meta.declarations) {
            flattenAndDedupeArray(meta.declarations).forEach((declaredType) => {
                if (!isValidType(declaredType)) {
                    this._reportError(syntaxError(`Unexpected value '${stringifyType(declaredType)}' declared by the module '${stringifyType(moduleType)}'`), moduleType);
                    return;
                }
                const declaredIdentifier = this._getIdentifierMetadata(declaredType);
                if (this.isDirective(declaredType)) {
                    transitiveModule.addDirective(declaredIdentifier);
                    declaredDirectives.push(declaredIdentifier);
                    this._addTypeToModule(declaredType, moduleType);
                }
                else if (this.isPipe(declaredType)) {
                    transitiveModule.addPipe(declaredIdentifier);
                    transitiveModule.pipes.push(declaredIdentifier);
                    declaredPipes.push(declaredIdentifier);
                    this._addTypeToModule(declaredType, moduleType);
                }
                else {
                    this._reportError(syntaxError(`Unexpected ${this._getTypeDescriptor(declaredType)} '${stringifyType(declaredType)}' declared by the module '${stringifyType(moduleType)}'. Please add a @Pipe/@Directive/@Component annotation.`), moduleType);
                    return;
                }
            });
        }
        const exportedDirectives = [];
        const exportedPipes = [];
        exportedNonModuleIdentifiers.forEach((exportedId) => {
            if (transitiveModule.directivesSet.has(exportedId.reference)) {
                exportedDirectives.push(exportedId);
                transitiveModule.addExportedDirective(exportedId);
            }
            else if (transitiveModule.pipesSet.has(exportedId.reference)) {
                exportedPipes.push(exportedId);
                transitiveModule.addExportedPipe(exportedId);
            }
            else {
                this._reportError(syntaxError(`Can't export ${this._getTypeDescriptor(exportedId.reference)} ${stringifyType(exportedId.reference)} from ${stringifyType(moduleType)} as it was neither declared nor imported!`), moduleType);
                return;
            }
        });
        // The providers of the module have to go last
        // so that they overwrite any other provider we already added.
        if (meta.providers) {
            providers.push(...this._getProvidersMetadata(meta.providers, entryComponents, `provider for the NgModule '${stringifyType(moduleType)}'`, [], moduleType));
        }
        if (meta.entryComponents) {
            entryComponents.push(...flattenAndDedupeArray(meta.entryComponents)
                .map(type => this._getEntryComponentMetadata(type)));
        }
        if (meta.bootstrap) {
            flattenAndDedupeArray(meta.bootstrap).forEach(type => {
                if (!isValidType(type)) {
                    this._reportError(syntaxError(`Unexpected value '${stringifyType(type)}' used in the bootstrap property of module '${stringifyType(moduleType)}'`), moduleType);
                    return;
                }
                bootstrapComponents.push(this._getIdentifierMetadata(type));
            });
        }
        entryComponents.push(...bootstrapComponents.map(type => this._getEntryComponentMetadata(type.reference)));
        if (meta.schemas) {
            schemas.push(...flattenAndDedupeArray(meta.schemas));
        }
        compileMeta = new cpl.CompileNgModuleMetadata({
            type: this._getTypeMetadata(moduleType),
            providers,
            entryComponents,
            bootstrapComponents,
            schemas,
            declaredDirectives,
            exportedDirectives,
            declaredPipes,
            exportedPipes,
            importedModules,
            exportedModules,
            transitiveModule,
            id: meta.id || null,
        });
        entryComponents.forEach((id) => transitiveModule.addEntryComponent(id));
        providers.forEach((provider) => transitiveModule.addProvider(provider, compileMeta.type));
        transitiveModule.addModule(compileMeta.type);
        this._ngModuleCache.set(moduleType, compileMeta);
        return compileMeta;
    }
    _checkSelfImport(moduleType, importedModuleType) {
        if (moduleType === importedModuleType) {
            this._reportError(syntaxError(`'${stringifyType(moduleType)}' module can't import itself`), moduleType);
            return true;
        }
        return false;
    }
    _getTypeDescriptor(type) {
        if (isValidType(type)) {
            if (this.isDirective(type)) {
                return 'directive';
            }
            if (this.isPipe(type)) {
                return 'pipe';
            }
            if (this.isNgModule(type)) {
                return 'module';
            }
        }
        if (type.provide) {
            return 'provider';
        }
        return 'value';
    }
    _addTypeToModule(type, moduleType) {
        const oldModule = this._ngModuleOfTypes.get(type);
        if (oldModule && oldModule !== moduleType) {
            this._reportError(syntaxError(`Type ${stringifyType(type)} is part of the declarations of 2 modules: ${stringifyType(oldModule)} and ${stringifyType(moduleType)}! ` +
                `Please consider moving ${stringifyType(type)} to a higher module that imports ${stringifyType(oldModule)} and ${stringifyType(moduleType)}. ` +
                `You can also create a new NgModule that exports and includes ${stringifyType(type)} then import that NgModule in ${stringifyType(oldModule)} and ${stringifyType(moduleType)}.`), moduleType);
            return;
        }
        this._ngModuleOfTypes.set(type, moduleType);
    }
    _getTransitiveNgModuleMetadata(importedModules, exportedModules) {
        // collect `providers` / `entryComponents` from all imported and all exported modules
        const result = new cpl.TransitiveCompileNgModuleMetadata();
        const modulesByToken = new Map();
        importedModules.concat(exportedModules).forEach((modSummary) => {
            modSummary.modules.forEach((mod) => result.addModule(mod));
            modSummary.entryComponents.forEach((comp) => result.addEntryComponent(comp));
            const addedTokens = new Set();
            modSummary.providers.forEach((entry) => {
                const tokenRef = cpl.tokenReference(entry.provider.token);
                let prevModules = modulesByToken.get(tokenRef);
                if (!prevModules) {
                    prevModules = new Set();
                    modulesByToken.set(tokenRef, prevModules);
                }
                const moduleRef = entry.module.reference;
                // Note: the providers of one module may still contain multiple providers
                // per token (e.g. for multi providers), and we need to preserve these.
                if (addedTokens.has(tokenRef) || !prevModules.has(moduleRef)) {
                    prevModules.add(moduleRef);
                    addedTokens.add(tokenRef);
                    result.addProvider(entry.provider, entry.module);
                }
            });
        });
        exportedModules.forEach((modSummary) => {
            modSummary.exportedDirectives.forEach((id) => result.addExportedDirective(id));
            modSummary.exportedPipes.forEach((id) => result.addExportedPipe(id));
        });
        importedModules.forEach((modSummary) => {
            modSummary.exportedDirectives.forEach((id) => result.addDirective(id));
            modSummary.exportedPipes.forEach((id) => result.addPipe(id));
        });
        return result;
    }
    _getIdentifierMetadata(type) {
        type = resolveForwardRef(type);
        return { reference: type };
    }
    isInjectable(type) {
        const annotations = this._reflector.tryAnnotations(type);
        return annotations.some(ann => createInjectable.isTypeOf(ann));
    }
    getInjectableSummary(type) {
        return {
            summaryKind: cpl.CompileSummaryKind.Injectable,
            type: this._getTypeMetadata(type, null, false)
        };
    }
    getInjectableMetadata(type, dependencies = null, throwOnUnknownDeps = true) {
        const typeSummary = this._loadSummary(type, cpl.CompileSummaryKind.Injectable);
        const typeMetadata = typeSummary ?
            typeSummary.type :
            this._getTypeMetadata(type, dependencies, throwOnUnknownDeps);
        const annotations = this._reflector.annotations(type).filter(ann => createInjectable.isTypeOf(ann));
        if (annotations.length === 0) {
            return null;
        }
        const meta = annotations[annotations.length - 1];
        return {
            symbol: type,
            type: typeMetadata,
            providedIn: meta.providedIn,
            useValue: meta.useValue,
            useClass: meta.useClass,
            useExisting: meta.useExisting,
            useFactory: meta.useFactory,
            deps: meta.deps,
        };
    }
    _getTypeMetadata(type, dependencies = null, throwOnUnknownDeps = true) {
        const identifier = this._getIdentifierMetadata(type);
        return {
            reference: identifier.reference,
            diDeps: this._getDependenciesMetadata(identifier.reference, dependencies, throwOnUnknownDeps),
            lifecycleHooks: getAllLifecycleHooks(this._reflector, identifier.reference),
        };
    }
    _getFactoryMetadata(factory, dependencies = null) {
        factory = resolveForwardRef(factory);
        return { reference: factory, diDeps: this._getDependenciesMetadata(factory, dependencies) };
    }
    /**
     * Gets the metadata for the given pipe.
     * This assumes `loadNgModuleDirectiveAndPipeMetadata` has been called first.
     */
    getPipeMetadata(pipeType) {
        const pipeMeta = this._pipeCache.get(pipeType);
        if (!pipeMeta) {
            this._reportError(syntaxError(`Illegal state: getPipeMetadata can only be called after loadNgModuleDirectiveAndPipeMetadata for a module that declares it. Pipe ${stringifyType(pipeType)}.`), pipeType);
        }
        return pipeMeta || null;
    }
    getPipeSummary(pipeType) {
        const pipeSummary = this._loadSummary(pipeType, cpl.CompileSummaryKind.Pipe);
        if (!pipeSummary) {
            this._reportError(syntaxError(`Illegal state: Could not load the summary for pipe ${stringifyType(pipeType)}.`), pipeType);
        }
        return pipeSummary;
    }
    getOrLoadPipeMetadata(pipeType) {
        let pipeMeta = this._pipeCache.get(pipeType);
        if (!pipeMeta) {
            pipeMeta = this._loadPipeMetadata(pipeType);
        }
        return pipeMeta;
    }
    _loadPipeMetadata(pipeType) {
        pipeType = resolveForwardRef(pipeType);
        const pipeAnnotation = this._pipeResolver.resolve(pipeType);
        const pipeMeta = new cpl.CompilePipeMetadata({
            type: this._getTypeMetadata(pipeType),
            name: pipeAnnotation.name,
            pure: !!pipeAnnotation.pure
        });
        this._pipeCache.set(pipeType, pipeMeta);
        this._summaryCache.set(pipeType, pipeMeta.toSummary());
        return pipeMeta;
    }
    _getDependenciesMetadata(typeOrFunc, dependencies, throwOnUnknownDeps = true) {
        let hasUnknownDeps = false;
        const params = dependencies || this._reflector.parameters(typeOrFunc) || [];
        const dependenciesMetadata = params.map((param) => {
            let isAttribute = false;
            let isHost = false;
            let isSelf = false;
            let isSkipSelf = false;
            let isOptional = false;
            let token = null;
            if (Array.isArray(param)) {
                param.forEach((paramEntry) => {
                    if (createHost.isTypeOf(paramEntry)) {
                        isHost = true;
                    }
                    else if (createSelf.isTypeOf(paramEntry)) {
                        isSelf = true;
                    }
                    else if (createSkipSelf.isTypeOf(paramEntry)) {
                        isSkipSelf = true;
                    }
                    else if (createOptional.isTypeOf(paramEntry)) {
                        isOptional = true;
                    }
                    else if (createAttribute.isTypeOf(paramEntry)) {
                        isAttribute = true;
                        token = paramEntry.attributeName;
                    }
                    else if (createInject.isTypeOf(paramEntry)) {
                        token = paramEntry.token;
                    }
                    else if (createInjectionToken.isTypeOf(paramEntry) || paramEntry instanceof StaticSymbol) {
                        token = paramEntry;
                    }
                    else if (isValidType(paramEntry) && token == null) {
                        token = paramEntry;
                    }
                });
            }
            else {
                token = param;
            }
            if (token == null) {
                hasUnknownDeps = true;
                return {};
            }
            return {
                isAttribute,
                isHost,
                isSelf,
                isSkipSelf,
                isOptional,
                token: this._getTokenMetadata(token)
            };
        });
        if (hasUnknownDeps) {
            const depsTokens = dependenciesMetadata.map((dep) => dep.token ? stringifyType(dep.token) : '?').join(', ');
            const message = `Can't resolve all parameters for ${stringifyType(typeOrFunc)}: (${depsTokens}).`;
            if (throwOnUnknownDeps || this._config.strictInjectionParameters) {
                this._reportError(syntaxError(message), typeOrFunc);
            }
            else {
                this._console.warn(`Warning: ${message} This will become an error in Angular v6.x`);
            }
        }
        return dependenciesMetadata;
    }
    _getTokenMetadata(token) {
        token = resolveForwardRef(token);
        let compileToken;
        if (typeof token === 'string') {
            compileToken = { value: token };
        }
        else {
            compileToken = { identifier: { reference: token } };
        }
        return compileToken;
    }
    _getProvidersMetadata(providers, targetEntryComponents, debugInfo, compileProviders = [], type) {
        providers.forEach((provider, providerIdx) => {
            if (Array.isArray(provider)) {
                this._getProvidersMetadata(provider, targetEntryComponents, debugInfo, compileProviders);
            }
            else {
                provider = resolveForwardRef(provider);
                let providerMeta = undefined;
                if (provider && typeof provider === 'object' && provider.hasOwnProperty('provide')) {
                    this._validateProvider(provider);
                    providerMeta = new cpl.ProviderMeta(provider.provide, provider);
                }
                else if (isValidType(provider)) {
                    providerMeta = new cpl.ProviderMeta(provider, { useClass: provider });
                }
                else if (provider === void 0) {
                    this._reportError(syntaxError(`Encountered undefined provider! Usually this means you have a circular dependencies. This might be caused by using 'barrel' index.ts files.`));
                    return;
                }
                else {
                    const providersInfo = providers.reduce((soFar, seenProvider, seenProviderIdx) => {
                        if (seenProviderIdx < providerIdx) {
                            soFar.push(`${stringifyType(seenProvider)}`);
                        }
                        else if (seenProviderIdx == providerIdx) {
                            soFar.push(`?${stringifyType(seenProvider)}?`);
                        }
                        else if (seenProviderIdx == providerIdx + 1) {
                            soFar.push('...');
                        }
                        return soFar;
                    }, [])
                        .join(', ');
                    this._reportError(syntaxError(`Invalid ${debugInfo ? debugInfo : 'provider'} - only instances of Provider and Type are allowed, got: [${providersInfo}]`), type);
                    return;
                }
                if (providerMeta.token ===
                    this._reflector.resolveExternalReference(Identifiers.ANALYZE_FOR_ENTRY_COMPONENTS)) {
                    targetEntryComponents.push(...this._getEntryComponentsFromProvider(providerMeta, type));
                }
                else {
                    compileProviders.push(this.getProviderMetadata(providerMeta));
                }
            }
        });
        return compileProviders;
    }
    _validateProvider(provider) {
        if (provider.hasOwnProperty('useClass') && provider.useClass == null) {
            this._reportError(syntaxError(`Invalid provider for ${stringifyType(provider.provide)}. useClass cannot be ${provider.useClass}.
           Usually it happens when:
           1. There's a circular dependency (might be caused by using index.ts (barrel) files).
           2. Class was used before it was declared. Use forwardRef in this case.`));
        }
    }
    _getEntryComponentsFromProvider(provider, type) {
        const components = [];
        const collectedIdentifiers = [];
        if (provider.useFactory || provider.useExisting || provider.useClass) {
            this._reportError(syntaxError(`The ANALYZE_FOR_ENTRY_COMPONENTS token only supports useValue!`), type);
            return [];
        }
        if (!provider.multi) {
            this._reportError(syntaxError(`The ANALYZE_FOR_ENTRY_COMPONENTS token only supports 'multi = true'!`), type);
            return [];
        }
        extractIdentifiers(provider.useValue, collectedIdentifiers);
        collectedIdentifiers.forEach((identifier) => {
            const entry = this._getEntryComponentMetadata(identifier.reference, false);
            if (entry) {
                components.push(entry);
            }
        });
        return components;
    }
    _getEntryComponentMetadata(dirType, throwIfNotFound = true) {
        const dirMeta = this.getNonNormalizedDirectiveMetadata(dirType);
        if (dirMeta && dirMeta.metadata.isComponent) {
            return { componentType: dirType, componentFactory: dirMeta.metadata.componentFactory };
        }
        const dirSummary = this._loadSummary(dirType, cpl.CompileSummaryKind.Directive);
        if (dirSummary && dirSummary.isComponent) {
            return { componentType: dirType, componentFactory: dirSummary.componentFactory };
        }
        if (throwIfNotFound) {
            throw syntaxError(`${dirType.name} cannot be used as an entry component.`);
        }
        return null;
    }
    _getInjectableTypeMetadata(type, dependencies = null) {
        const typeSummary = this._loadSummary(type, cpl.CompileSummaryKind.Injectable);
        if (typeSummary) {
            return typeSummary.type;
        }
        return this._getTypeMetadata(type, dependencies);
    }
    getProviderMetadata(provider) {
        let compileDeps = undefined;
        let compileTypeMetadata = null;
        let compileFactoryMetadata = null;
        let token = this._getTokenMetadata(provider.token);
        if (provider.useClass) {
            compileTypeMetadata =
                this._getInjectableTypeMetadata(provider.useClass, provider.dependencies);
            compileDeps = compileTypeMetadata.diDeps;
            if (provider.token === provider.useClass) {
                // use the compileTypeMetadata as it contains information about lifecycleHooks...
                token = { identifier: compileTypeMetadata };
            }
        }
        else if (provider.useFactory) {
            compileFactoryMetadata = this._getFactoryMetadata(provider.useFactory, provider.dependencies);
            compileDeps = compileFactoryMetadata.diDeps;
        }
        return {
            token: token,
            useClass: compileTypeMetadata,
            useValue: provider.useValue,
            useFactory: compileFactoryMetadata,
            useExisting: provider.useExisting ? this._getTokenMetadata(provider.useExisting) : undefined,
            deps: compileDeps,
            multi: provider.multi
        };
    }
    _getQueriesMetadata(queries, isViewQuery, directiveType) {
        const res = [];
        Object.keys(queries).forEach((propertyName) => {
            const query = queries[propertyName];
            if (query.isViewQuery === isViewQuery) {
                res.push(this._getQueryMetadata(query, propertyName, directiveType));
            }
        });
        return res;
    }
    _queryVarBindings(selector) { return selector.split(/\s*,\s*/); }
    _getQueryMetadata(q, propertyName, typeOrFunc) {
        let selectors;
        if (typeof q.selector === 'string') {
            selectors =
                this._queryVarBindings(q.selector).map(varName => this._getTokenMetadata(varName));
        }
        else {
            if (!q.selector) {
                this._reportError(syntaxError(`Can't construct a query for the property "${propertyName}" of "${stringifyType(typeOrFunc)}" since the query selector wasn't defined.`), typeOrFunc);
                selectors = [];
            }
            else {
                selectors = [this._getTokenMetadata(q.selector)];
            }
        }
        return {
            selectors,
            first: q.first,
            descendants: q.descendants, propertyName,
            read: q.read ? this._getTokenMetadata(q.read) : null,
            static: q.static
        };
    }
    _reportError(error, type, otherType) {
        if (this._errorCollector) {
            this._errorCollector(error, type);
            if (otherType) {
                this._errorCollector(error, otherType);
            }
        }
        else {
            throw error;
        }
    }
}
function flattenArray(tree, out = []) {
    if (tree) {
        for (let i = 0; i < tree.length; i++) {
            const item = resolveForwardRef(tree[i]);
            if (Array.isArray(item)) {
                flattenArray(item, out);
            }
            else {
                out.push(item);
            }
        }
    }
    return out;
}
function dedupeArray(array) {
    if (array) {
        return Array.from(new Set(array));
    }
    return [];
}
function flattenAndDedupeArray(tree) {
    return dedupeArray(flattenArray(tree));
}
function isValidType(value) {
    return (value instanceof StaticSymbol) || (value instanceof Type);
}
function extractIdentifiers(value, targetIdentifiers) {
    visitValue(value, new _CompileValueConverter(), targetIdentifiers);
}
class _CompileValueConverter extends ValueTransformer {
    visitOther(value, targetIdentifiers) {
        targetIdentifiers.push({ reference: value });
    }
}
function stringifyType(type) {
    if (type instanceof StaticSymbol) {
        return `${type.name} in ${type.filePath}`;
    }
    else {
        return stringify(type);
    }
}
/**
 * Indicates that a component is still being loaded in a synchronous compile.
 */
function componentStillLoadingError(compType) {
    const error = Error(`Can't compile synchronously as ${stringify(compType)} is still being loaded!`);
    error[ERROR_COMPONENT_TYPE] = compType;
    return error;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YWRhdGFfcmVzb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvbWV0YWRhdGFfcmVzb2x2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFlBQVksRUFBb0IsTUFBTSxxQkFBcUIsQ0FBQztBQUNwRSxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDN0MsT0FBTyxFQUFDLG9CQUFvQixFQUFFLDBCQUEwQixFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzlFLE9BQU8sS0FBSyxHQUFHLE1BQU0sb0JBQW9CLENBQUM7QUFHMUMsT0FBTyxFQUFDLHVCQUF1QixFQUEwRixJQUFJLEVBQUUsaUJBQWlCLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixFQUFFLG9CQUFvQixFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsVUFBVSxFQUFFLGNBQWMsRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUVoVSxPQUFPLEVBQW9CLFFBQVEsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ2pFLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDMUMsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFLM0QsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUV2QyxPQUFPLEVBQVUsU0FBUyxFQUFFLGdCQUFnQixFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsaUJBQWlCLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFJM0ksTUFBTSxDQUFDLE1BQU0sb0JBQW9CLEdBQUcsaUJBQWlCLENBQUM7QUFFdEQsZ0JBQWdCO0FBQ2hCLGtDQUFrQztBQUNsQywyREFBMkQ7QUFDM0QsOENB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QztBQUN6QyxDQUFDO0FBRUQsU0FBUyxXQUFXLENBQUMsS0FBVTtJQUM3QixPQUFPLENBQUMsS0FBSyxZQUFZLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxZQUFZLElBQUksQ0FBQyxDQUFDO0FBQ3BFLENBQUM7QUFFRCxTQUFTLGtCQUFrQixDQUFDLEtBQVUsRUFBRSxpQkFBa0Q7SUFDeEYsVUFBVSxDQUFDLEtBQUssRUFBRSxJQUFJLHNCQUFzQixFQUFFLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztBQUNyRSxDQUFDO0FBRUQsTUFBTSxzQkFBdUIsU0FBUSxnQkFBZ0I7SUFDbkQsVUFBVSxDQUFDLEtBQVUsRUFBRSxpQkFBa0Q7UUFDdkUsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7SUFDN0MsQ0FBQztDQUNGO0FBRUQsU0FBUyxhQUFhLENBQUMsSUFBUztJQUM5QixJQUFJLElBQUksWUFBWSxZQUFZLEVBQUU7UUFDaEMsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLE9BQU8sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQzNDO1NBQU07UUFDTCxPQUFPLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN4QjtBQUNILENBQUM7QUFFRDs7R0FFRztBQUNILFNBQVMsMEJBQTBCLENBQUMsUUFBYztJQUNoRCxNQUFNLEtBQUssR0FDUCxLQUFLLENBQUMsa0NBQWtDLFNBQVMsQ0FBQyxRQUFRLENBQUMseUJBQXlCLENBQUMsQ0FBQztJQUN6RixLQUFhLENBQUMsb0JBQW9CLENBQUMsR0FBRyxRQUFRLENBQUM7SUFDaEQsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1N0YXRpY1N5bWJvbCwgU3RhdGljU3ltYm9sQ2FjaGV9IGZyb20gJy4vYW90L3N0YXRpY19zeW1ib2wnO1xuaW1wb3J0IHtuZ2ZhY3RvcnlGaWxlUGF0aH0gZnJvbSAnLi9hb3QvdXRpbCc7XG5pbXBvcnQge2Fzc2VydEFycmF5T2ZTdHJpbmdzLCBhc3NlcnRJbnRlcnBvbGF0aW9uU3ltYm9sc30gZnJvbSAnLi9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGNwbCBmcm9tICcuL2NvbXBpbGVfbWV0YWRhdGEnO1xuaW1wb3J0IHtDb21waWxlUmVmbGVjdG9yfSBmcm9tICcuL2NvbXBpbGVfcmVmbGVjdG9yJztcbmltcG9ydCB7Q29tcGlsZXJDb25maWd9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7Q2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgRGlyZWN0aXZlLCBJbmplY3RhYmxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzLCBQcm92aWRlciwgUXVlcnksIFNjaGVtYU1ldGFkYXRhLCBUeXBlLCBWaWV3RW5jYXBzdWxhdGlvbiwgY3JlYXRlQXR0cmlidXRlLCBjcmVhdGVDb21wb25lbnQsIGNyZWF0ZUhvc3QsIGNyZWF0ZUluamVjdCwgY3JlYXRlSW5qZWN0YWJsZSwgY3JlYXRlSW5qZWN0aW9uVG9rZW4sIGNyZWF0ZU5nTW9kdWxlLCBjcmVhdGVPcHRpb25hbCwgY3JlYXRlU2VsZiwgY3JlYXRlU2tpcFNlbGZ9IGZyb20gJy4vY29yZSc7XG5pbXBvcnQge0RpcmVjdGl2ZU5vcm1hbGl6ZXJ9IGZyb20gJy4vZGlyZWN0aXZlX25vcm1hbGl6ZXInO1xuaW1wb3J0IHtEaXJlY3RpdmVSZXNvbHZlciwgZmluZExhc3R9IGZyb20gJy4vZGlyZWN0aXZlX3Jlc29sdmVyJztcbmltcG9ydCB7SWRlbnRpZmllcnN9IGZyb20gJy4vaWRlbnRpZmllcnMnO1xuaW1wb3J0IHtnZXRBbGxMaWZlY3ljbGVIb29rc30gZnJvbSAnLi9saWZlY3ljbGVfcmVmbGVjdG9yJztcbmltcG9ydCB7SHRtbFBhcnNlcn0gZnJvbSAnLi9tbF9wYXJzZXIvaHRtbF9wYXJzZXInO1xuaW1wb3J0IHtOZ01vZHVsZVJlc29sdmVyfSBmcm9tICcuL25nX21vZHVsZV9yZXNvbHZlcic7XG5pbXBvcnQge1BpcGVSZXNvbHZlcn0gZnJvbSAnLi9waXBlX3Jlc29sdmVyJztcbmltcG9ydCB7RWxlbWVudFNjaGVtYVJlZ2lzdHJ5fSBmcm9tICcuL3NjaGVtYS9lbGVtZW50X3NjaGVtYV9yZWdpc3RyeSc7XG5pbXBvcnQge0Nzc1NlbGVjdG9yfSBmcm9tICcuL3NlbGVjdG9yJztcbmltcG9ydCB7U3VtbWFyeVJlc29sdmVyfSBmcm9tICcuL3N1bW1hcnlfcmVzb2x2ZXInO1xuaW1wb3J0IHtDb25zb2xlLCBTeW5jQXN5bmMsIFZhbHVlVHJhbnNmb3JtZXIsIGlzUHJvbWlzZSwgbm9VbmRlZmluZWQsIHJlc29sdmVGb3J3YXJkUmVmLCBzdHJpbmdpZnksIHN5bnRheEVycm9yLCB2aXNpdFZhbHVlfSBmcm9tICcuL3V0aWwnO1xuXG5leHBvcnQgdHlwZSBFcnJvckNvbGxlY3RvciA9IChlcnJvcjogYW55LCB0eXBlPzogYW55KSA9PiB2b2lkO1xuXG5leHBvcnQgY29uc3QgRVJST1JfQ09NUE9ORU5UX1RZUEUgPSAnbmdDb21wb25lbnRUeXBlJztcblxuLy8gRGVzaWduIG5vdGVzOlxuLy8gLSBkb24ndCBsYXppbHkgY3JlYXRlIG1ldGFkYXRhOlxuLy8gICBGb3Igc29tZSBtZXRhZGF0YSwgd2UgbmVlZCB0byBkbyBhc3luYyB3b3JrIHNvbWV0aW1lcyxcbi8vICAgc28gdGhlIHVzZXIgaGFzIHRvIGtpY2sgb2ZmIHRoaXMgbG9hZGluZy5cbi8vICAgQnV0IHdlIHdhbnQgdG8gcmVwb3J0IGVycm9ycyBldmVuIHdoZW4gdGhlIGFzeW5jIHdvcmsgaXNcbi8vICAgbm90IHJlcXVpcmVkIHRvIGNoZWNrIHRoYXQgdGhlIHVzZXIgd291bGQgaGF2ZSBiZWVuIGFibGVcbi8vICAgdG8gd2FpdCBjb3JyZWN0bHkuXG5leHBvcnQgY2xhc3MgQ29tcGlsZU1ldGFkYXRhUmVzb2x2ZXIge1xuICBwcml2YXRlIF9ub25Ob3JtYWxpemVkRGlyZWN0aXZlQ2FjaGUgPVxuICAgICAgbmV3IE1hcDxUeXBlLCB7YW5ub3RhdGlvbjogRGlyZWN0aXZlLCBtZXRhZGF0YTogY3BsLkNvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YX0+KCk7XG4gIHByaXZhdGUgX2RpcmVjdGl2ZUNhY2hlID0gbmV3IE1hcDxUeXBlLCBjcGwuQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhPigpO1xuICBwcml2YXRlIF9zdW1tYXJ5Q2FjaGUgPSBuZXcgTWFwPFR5cGUsIGNwbC5Db21waWxlVHlwZVN1bW1hcnl8bnVsbD4oKTtcbiAgcHJpdmF0ZSBfcGlwZUNhY2hlID0gbmV3IE1hcDxUeXBlLCBjcGwuQ29tcGlsZVBpcGVNZXRhZGF0YT4oKTtcbiAgcHJpdmF0ZSBfbmdNb2R1bGVDYWNoZSA9IG5ldyBNYXA8VHlwZSwgY3BsLkNvbXBpbGVOZ01vZHVsZU1ldGFkYXRhPigpO1xuICBwcml2YXRlIF9uZ01vZHVsZU9mVHlwZXMgPSBuZXcgTWFwPFR5cGUsIFR5cGU+KCk7XG4gIHByaXZhdGUgX3NoYWxsb3dNb2R1bGVDYWNoZSA9IG5ldyBNYXA8VHlwZSwgY3BsLkNvbXBpbGVTaGFsbG93TW9kdWxlTWV0YWRhdGE+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIF9jb25maWc6IENvbXBpbGVyQ29uZmlnLCBwcml2YXRlIF9odG1sUGFyc2VyOiBIdG1sUGFyc2VyLFxuICAgICAgcHJpdmF0ZSBfbmdNb2R1bGVSZXNvbHZlcjogTmdNb2R1bGVSZXNvbHZlciwgcHJpdmF0ZSBfZGlyZWN0aXZlUmVzb2x2ZXI6IERpcmVjdGl2ZVJlc29sdmVyLFxuICAgICAgcHJpdmF0ZSBfcGlwZVJlc29sdmVyOiBQaXBlUmVzb2x2ZXIsIHByaXZhdGUgX3N1bW1hcnlSZXNvbHZlcjogU3VtbWFyeVJlc29sdmVyPGFueT4sXG4gICAgICBwcml2YXRlIF9zY2hlbWFSZWdpc3RyeTogRWxlbWVudFNjaGVtYVJlZ2lzdHJ5LFxuICAgICAgcHJpdmF0ZSBfZGlyZWN0aXZlTm9ybWFsaXplcjogRGlyZWN0aXZlTm9ybWFsaXplciwgcHJpdmF0ZSBfY29uc29sZTogQ29uc29sZSxcbiAgICAgIHByaXZhdGUgX3N0YXRpY1N5bWJvbENhY2hlOiBTdGF0aWNTeW1ib2xDYWNoZSwgcHJpdmF0ZSBfcmVmbGVjdG9yOiBDb21waWxlUmVmbGVjdG9yLFxuICAgICAgcHJpdmF0ZSBfZXJyb3JDb2xsZWN0b3I/OiBFcnJvckNvbGxlY3Rvcikge31cblxuICBnZXRSZWZsZWN0b3IoKTogQ29tcGlsZVJlZmxlY3RvciB7IHJldHVybiB0aGlzLl9yZWZsZWN0b3I7IH1cblxuICBjbGVhckNhY2hlRm9yKHR5cGU6IFR5cGUpIHtcbiAgICBjb25zdCBkaXJNZXRhID0gdGhpcy5fZGlyZWN0aXZlQ2FjaGUuZ2V0KHR5cGUpO1xuICAgIHRoaXMuX2RpcmVjdGl2ZUNhY2hlLmRlbGV0ZSh0eXBlKTtcbiAgICB0aGlzLl9ub25Ob3JtYWxpemVkRGlyZWN0aXZlQ2FjaGUuZGVsZXRlKHR5cGUpO1xuICAgIHRoaXMuX3N1bW1hcnlDYWNoZS5kZWxldGUodHlwZSk7XG4gICAgdGhpcy5fcGlwZUNhY2hlLmRlbGV0ZSh0eXBlKTtcbiAgICB0aGlzLl9uZ01vZHVsZU9mVHlwZXMuZGVsZXRlKHR5cGUpO1xuICAgIC8vIENsZWFyIGFsbCBvZiB0aGUgTmdNb2R1bGUgYXMgdGhleSBjb250YWluIHRyYW5zaXRpdmUgaW5mb3JtYXRpb24hXG4gICAgdGhpcy5fbmdNb2R1bGVDYWNoZS5jbGVhcigpO1xuICAgIGlmIChkaXJNZXRhKSB7XG4gICAgICB0aGlzLl9kaXJlY3RpdmVOb3JtYWxpemVyLmNsZWFyQ2FjaGVGb3IoZGlyTWV0YSk7XG4gICAgfVxuICB9XG5cbiAgY2xlYXJDYWNoZSgpOiB2b2lkIHtcbiAgICB0aGlzLl9kaXJlY3RpdmVDYWNoZS5jbGVhcigpO1xuICAgIHRoaXMuX25vbk5vcm1hbGl6ZWREaXJlY3RpdmVDYWNoZS5jbGVhcigpO1xuICAgIHRoaXMuX3N1bW1hcnlDYWNoZS5jbGVhcigpO1xuICAgIHRoaXMuX3BpcGVDYWNoZS5jbGVhcigpO1xuICAgIHRoaXMuX25nTW9kdWxlQ2FjaGUuY2xlYXIoKTtcbiAgICB0aGlzLl9uZ01vZHVsZU9mVHlwZXMuY2xlYXIoKTtcbiAgICB0aGlzLl9kaXJlY3RpdmVOb3JtYWxpemVyLmNsZWFyQ2FjaGUoKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZVByb3h5Q2xhc3MoYmFzZVR5cGU6IGFueSwgbmFtZTogc3RyaW5nKTogY3BsLlByb3h5Q2xhc3Mge1xuICAgIGxldCBkZWxlZ2F0ZTogYW55ID0gbnVsbDtcbiAgICBjb25zdCBwcm94eUNsYXNzOiBjcGwuUHJveHlDbGFzcyA9IDxhbnk+ZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIWRlbGVnYXRlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIGBJbGxlZ2FsIHN0YXRlOiBDbGFzcyAke25hbWV9IGZvciB0eXBlICR7c3RyaW5naWZ5KGJhc2VUeXBlKX0gaXMgbm90IGNvbXBpbGVkIHlldCFgKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkZWxlZ2F0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gICAgcHJveHlDbGFzcy5zZXREZWxlZ2F0ZSA9IChkKSA9PiB7XG4gICAgICBkZWxlZ2F0ZSA9IGQ7XG4gICAgICAoPGFueT5wcm94eUNsYXNzKS5wcm90b3R5cGUgPSBkLnByb3RvdHlwZTtcbiAgICB9O1xuICAgIC8vIE1ha2Ugc3RyaW5naWZ5IHdvcmsgY29ycmVjdGx5XG4gICAgKDxhbnk+cHJveHlDbGFzcykub3ZlcnJpZGRlbk5hbWUgPSBuYW1lO1xuICAgIHJldHVybiBwcm94eUNsYXNzO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRHZW5lcmF0ZWRDbGFzcyhkaXJUeXBlOiBhbnksIG5hbWU6IHN0cmluZyk6IFN0YXRpY1N5bWJvbHxjcGwuUHJveHlDbGFzcyB7XG4gICAgaWYgKGRpclR5cGUgaW5zdGFuY2VvZiBTdGF0aWNTeW1ib2wpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zdGF0aWNTeW1ib2xDYWNoZS5nZXQobmdmYWN0b3J5RmlsZVBhdGgoZGlyVHlwZS5maWxlUGF0aCksIG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fY3JlYXRlUHJveHlDbGFzcyhkaXJUeXBlLCBuYW1lKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldENvbXBvbmVudFZpZXdDbGFzcyhkaXJUeXBlOiBhbnkpOiBTdGF0aWNTeW1ib2x8Y3BsLlByb3h5Q2xhc3Mge1xuICAgIHJldHVybiB0aGlzLmdldEdlbmVyYXRlZENsYXNzKGRpclR5cGUsIGNwbC52aWV3Q2xhc3NOYW1lKGRpclR5cGUsIDApKTtcbiAgfVxuXG4gIGdldEhvc3RDb21wb25lbnRWaWV3Q2xhc3MoZGlyVHlwZTogYW55KTogU3RhdGljU3ltYm9sfGNwbC5Qcm94eUNsYXNzIHtcbiAgICByZXR1cm4gdGhpcy5nZXRHZW5lcmF0ZWRDbGFzcyhkaXJUeXBlLCBjcGwuaG9zdFZpZXdDbGFzc05hbWUoZGlyVHlwZSkpO1xuICB9XG5cbiAgZ2V0SG9zdENvbXBvbmVudFR5cGUoZGlyVHlwZTogYW55KTogU3RhdGljU3ltYm9sfGNwbC5Qcm94eUNsYXNzIHtcbiAgICBjb25zdCBuYW1lID0gYCR7Y3BsLmlkZW50aWZpZXJOYW1lKHtyZWZlcmVuY2U6IGRpclR5cGV9KX1fSG9zdGA7XG4gICAgaWYgKGRpclR5cGUgaW5zdGFuY2VvZiBTdGF0aWNTeW1ib2wpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zdGF0aWNTeW1ib2xDYWNoZS5nZXQoZGlyVHlwZS5maWxlUGF0aCwgbmFtZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2NyZWF0ZVByb3h5Q2xhc3MoZGlyVHlwZSwgbmFtZSk7XG4gIH1cblxuICBwcml2YXRlIGdldFJlbmRlcmVyVHlwZShkaXJUeXBlOiBhbnkpOiBTdGF0aWNTeW1ib2x8b2JqZWN0IHtcbiAgICBpZiAoZGlyVHlwZSBpbnN0YW5jZW9mIFN0YXRpY1N5bWJvbCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3N0YXRpY1N5bWJvbENhY2hlLmdldChcbiAgICAgICAgICBuZ2ZhY3RvcnlGaWxlUGF0aChkaXJUeXBlLmZpbGVQYXRoKSwgY3BsLnJlbmRlcmVyVHlwZU5hbWUoZGlyVHlwZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyByZXR1cm5pbmcgYW4gb2JqZWN0IGFzIHByb3h5LFxuICAgICAgLy8gdGhhdCB3ZSBmaWxsIGxhdGVyIGR1cmluZyBydW50aW1lIGNvbXBpbGF0aW9uLlxuICAgICAgcmV0dXJuIDxhbnk+e307XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRDb21wb25lbnRGYWN0b3J5KFxuICAgICAgc2VsZWN0b3I6IHN0cmluZywgZGlyVHlwZTogYW55LCBpbnB1dHM6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9fG51bGwsXG4gICAgICBvdXRwdXRzOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSk6IFN0YXRpY1N5bWJvbHxvYmplY3Qge1xuICAgIGlmIChkaXJUeXBlIGluc3RhbmNlb2YgU3RhdGljU3ltYm9sKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc3RhdGljU3ltYm9sQ2FjaGUuZ2V0KFxuICAgICAgICAgIG5nZmFjdG9yeUZpbGVQYXRoKGRpclR5cGUuZmlsZVBhdGgpLCBjcGwuY29tcG9uZW50RmFjdG9yeU5hbWUoZGlyVHlwZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBob3N0VmlldyA9IHRoaXMuZ2V0SG9zdENvbXBvbmVudFZpZXdDbGFzcyhkaXJUeXBlKTtcbiAgICAgIC8vIE5vdGU6IG5nQ29udGVudFNlbGVjdG9ycyB3aWxsIGJlIGZpbGxlZCBsYXRlciBvbmNlIHRoZSB0ZW1wbGF0ZSBpc1xuICAgICAgLy8gbG9hZGVkLlxuICAgICAgY29uc3QgY3JlYXRlQ29tcG9uZW50RmFjdG9yeSA9XG4gICAgICAgICAgdGhpcy5fcmVmbGVjdG9yLnJlc29sdmVFeHRlcm5hbFJlZmVyZW5jZShJZGVudGlmaWVycy5jcmVhdGVDb21wb25lbnRGYWN0b3J5KTtcbiAgICAgIHJldHVybiBjcmVhdGVDb21wb25lbnRGYWN0b3J5KHNlbGVjdG9yLCBkaXJUeXBlLCA8YW55Pmhvc3RWaWV3LCBpbnB1dHMsIG91dHB1dHMsIFtdKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGluaXRDb21wb25lbnRGYWN0b3J5KGZhY3Rvcnk6IFN0YXRpY1N5bWJvbHxvYmplY3QsIG5nQ29udGVudFNlbGVjdG9yczogc3RyaW5nW10pIHtcbiAgICBpZiAoIShmYWN0b3J5IGluc3RhbmNlb2YgU3RhdGljU3ltYm9sKSkge1xuICAgICAgKGZhY3RvcnkgYXMgYW55KS5uZ0NvbnRlbnRTZWxlY3RvcnMucHVzaCguLi5uZ0NvbnRlbnRTZWxlY3RvcnMpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2xvYWRTdW1tYXJ5KHR5cGU6IGFueSwga2luZDogY3BsLkNvbXBpbGVTdW1tYXJ5S2luZCk6IGNwbC5Db21waWxlVHlwZVN1bW1hcnl8bnVsbCB7XG4gICAgbGV0IHR5cGVTdW1tYXJ5ID0gdGhpcy5fc3VtbWFyeUNhY2hlLmdldCh0eXBlKTtcbiAgICBpZiAoIXR5cGVTdW1tYXJ5KSB7XG4gICAgICBjb25zdCBzdW1tYXJ5ID0gdGhpcy5fc3VtbWFyeVJlc29sdmVyLnJlc29sdmVTdW1tYXJ5KHR5cGUpO1xuICAgICAgdHlwZVN1bW1hcnkgPSBzdW1tYXJ5ID8gc3VtbWFyeS50eXBlIDogbnVsbDtcbiAgICAgIHRoaXMuX3N1bW1hcnlDYWNoZS5zZXQodHlwZSwgdHlwZVN1bW1hcnkgfHwgbnVsbCk7XG4gICAgfVxuICAgIHJldHVybiB0eXBlU3VtbWFyeSAmJiB0eXBlU3VtbWFyeS5zdW1tYXJ5S2luZCA9PT0ga2luZCA/IHR5cGVTdW1tYXJ5IDogbnVsbDtcbiAgfVxuXG4gIGdldEhvc3RDb21wb25lbnRNZXRhZGF0YShcbiAgICAgIGNvbXBNZXRhOiBjcGwuQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhLFxuICAgICAgaG9zdFZpZXdUeXBlPzogU3RhdGljU3ltYm9sfGNwbC5Qcm94eUNsYXNzKTogY3BsLkNvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSB7XG4gICAgY29uc3QgaG9zdFR5cGUgPSB0aGlzLmdldEhvc3RDb21wb25lbnRUeXBlKGNvbXBNZXRhLnR5cGUucmVmZXJlbmNlKTtcbiAgICBpZiAoIWhvc3RWaWV3VHlwZSkge1xuICAgICAgaG9zdFZpZXdUeXBlID0gdGhpcy5nZXRIb3N0Q29tcG9uZW50Vmlld0NsYXNzKGhvc3RUeXBlKTtcbiAgICB9XG4gICAgLy8gTm90ZTogISBpcyBvayBoZXJlIGFzIHRoaXMgbWV0aG9kIHNob3VsZCBvbmx5IGJlIGNhbGxlZCB3aXRoIG5vcm1hbGl6ZWQgZGlyZWN0aXZlXG4gICAgLy8gbWV0YWRhdGEsIHdoaWNoIGFsd2F5cyBmaWxscyBpbiB0aGUgc2VsZWN0b3IuXG4gICAgY29uc3QgdGVtcGxhdGUgPSBDc3NTZWxlY3Rvci5wYXJzZShjb21wTWV0YS5zZWxlY3RvciAhKVswXS5nZXRNYXRjaGluZ0VsZW1lbnRUZW1wbGF0ZSgpO1xuICAgIGNvbnN0IHRlbXBsYXRlVXJsID0gJyc7XG4gICAgY29uc3QgaHRtbEFzdCA9IHRoaXMuX2h0bWxQYXJzZXIucGFyc2UodGVtcGxhdGUsIHRlbXBsYXRlVXJsKTtcbiAgICByZXR1cm4gY3BsLkNvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YS5jcmVhdGUoe1xuICAgICAgaXNIb3N0OiB0cnVlLFxuICAgICAgdHlwZToge3JlZmVyZW5jZTogaG9zdFR5cGUsIGRpRGVwczogW10sIGxpZmVjeWNsZUhvb2tzOiBbXX0sXG4gICAgICB0ZW1wbGF0ZTogbmV3IGNwbC5Db21waWxlVGVtcGxhdGVNZXRhZGF0YSh7XG4gICAgICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gICAgICAgIHRlbXBsYXRlLFxuICAgICAgICB0ZW1wbGF0ZVVybCxcbiAgICAgICAgaHRtbEFzdCxcbiAgICAgICAgc3R5bGVzOiBbXSxcbiAgICAgICAgc3R5bGVVcmxzOiBbXSxcbiAgICAgICAgbmdDb250ZW50U2VsZWN0b3JzOiBbXSxcbiAgICAgICAgYW5pbWF0aW9uczogW10sXG4gICAgICAgIGlzSW5saW5lOiB0cnVlLFxuICAgICAgICBleHRlcm5hbFN0eWxlc2hlZXRzOiBbXSxcbiAgICAgICAgaW50ZXJwb2xhdGlvbjogbnVsbCxcbiAgICAgICAgcHJlc2VydmVXaGl0ZXNwYWNlczogZmFsc2UsXG4gICAgICB9KSxcbiAgICAgIGV4cG9ydEFzOiBudWxsLFxuICAgICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5EZWZhdWx0LFxuICAgICAgaW5wdXRzOiBbXSxcbiAgICAgIG91dHB1dHM6IFtdLFxuICAgICAgaG9zdDoge30sXG4gICAgICBpc0NvbXBvbmVudDogdHJ1ZSxcbiAgICAgIHNlbGVjdG9yOiAnKicsXG4gICAgICBwcm92aWRlcnM6IFtdLFxuICAgICAgdmlld1Byb3ZpZGVyczogW10sXG4gICAgICBxdWVyaWVzOiBbXSxcbiAgICAgIGd1YXJkczoge30sXG4gICAgICB2aWV3UXVlcmllczogW10sXG4gICAgICBjb21wb25lbnRWaWV3VHlwZTogaG9zdFZpZXdUeXBlLFxuICAgICAgcmVuZGVyZXJUeXBlOlxuICAgICAgICAgIHtpZDogJ19fSG9zdF9fJywgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSwgc3R5bGVzOiBbXSwgZGF0YToge319IGFzIG9iamVjdCxcbiAgICAgIGVudHJ5Q29tcG9uZW50czogW10sXG4gICAgICBjb21wb25lbnRGYWN0b3J5OiBudWxsXG4gICAgfSk7XG4gIH1cblxuICBsb2FkRGlyZWN0aXZlTWV0YWRhdGEobmdNb2R1bGVUeXBlOiBhbnksIGRpcmVjdGl2ZVR5cGU6IGFueSwgaXNTeW5jOiBib29sZWFuKTogU3luY0FzeW5jPG51bGw+IHtcbiAgICBpZiAodGhpcy5fZGlyZWN0aXZlQ2FjaGUuaGFzKGRpcmVjdGl2ZVR5cGUpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZGlyZWN0aXZlVHlwZSA9IHJlc29sdmVGb3J3YXJkUmVmKGRpcmVjdGl2ZVR5cGUpO1xuICAgIGNvbnN0IHthbm5vdGF0aW9uLCBtZXRhZGF0YX0gPSB0aGlzLmdldE5vbk5vcm1hbGl6ZWREaXJlY3RpdmVNZXRhZGF0YShkaXJlY3RpdmVUeXBlKSAhO1xuXG4gICAgY29uc3QgY3JlYXRlRGlyZWN0aXZlTWV0YWRhdGEgPSAodGVtcGxhdGVNZXRhZGF0YTogY3BsLkNvbXBpbGVUZW1wbGF0ZU1ldGFkYXRhIHwgbnVsbCkgPT4ge1xuICAgICAgY29uc3Qgbm9ybWFsaXplZERpck1ldGEgPSBuZXcgY3BsLkNvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSh7XG4gICAgICAgIGlzSG9zdDogZmFsc2UsXG4gICAgICAgIHR5cGU6IG1ldGFkYXRhLnR5cGUsXG4gICAgICAgIGlzQ29tcG9uZW50OiBtZXRhZGF0YS5pc0NvbXBvbmVudCxcbiAgICAgICAgc2VsZWN0b3I6IG1ldGFkYXRhLnNlbGVjdG9yLFxuICAgICAgICBleHBvcnRBczogbWV0YWRhdGEuZXhwb3J0QXMsXG4gICAgICAgIGNoYW5nZURldGVjdGlvbjogbWV0YWRhdGEuY2hhbmdlRGV0ZWN0aW9uLFxuICAgICAgICBpbnB1dHM6IG1ldGFkYXRhLmlucHV0cyxcbiAgICAgICAgb3V0cHV0czogbWV0YWRhdGEub3V0cHV0cyxcbiAgICAgICAgaG9zdExpc3RlbmVyczogbWV0YWRhdGEuaG9zdExpc3RlbmVycyxcbiAgICAgICAgaG9zdFByb3BlcnRpZXM6IG1ldGFkYXRhLmhvc3RQcm9wZXJ0aWVzLFxuICAgICAgICBob3N0QXR0cmlidXRlczogbWV0YWRhdGEuaG9zdEF0dHJpYnV0ZXMsXG4gICAgICAgIHByb3ZpZGVyczogbWV0YWRhdGEucHJvdmlkZXJzLFxuICAgICAgICB2aWV3UHJvdmlkZXJzOiBtZXRhZGF0YS52aWV3UHJvdmlkZXJzLFxuICAgICAgICBxdWVyaWVzOiBtZXRhZGF0YS5xdWVyaWVzLFxuICAgICAgICBndWFyZHM6IG1ldGFkYXRhLmd1YXJkcyxcbiAgICAgICAgdmlld1F1ZXJpZXM6IG1ldGFkYXRhLnZpZXdRdWVyaWVzLFxuICAgICAgICBlbnRyeUNvbXBvbmVudHM6IG1ldGFkYXRhLmVudHJ5Q29tcG9uZW50cyxcbiAgICAgICAgY29tcG9uZW50Vmlld1R5cGU6IG1ldGFkYXRhLmNvbXBvbmVudFZpZXdUeXBlLFxuICAgICAgICByZW5kZXJlclR5cGU6IG1ldGFkYXRhLnJlbmRlcmVyVHlwZSxcbiAgICAgICAgY29tcG9uZW50RmFjdG9yeTogbWV0YWRhdGEuY29tcG9uZW50RmFjdG9yeSxcbiAgICAgICAgdGVtcGxhdGU6IHRlbXBsYXRlTWV0YWRhdGFcbiAgICAgIH0pO1xuICAgICAgaWYgKHRlbXBsYXRlTWV0YWRhdGEpIHtcbiAgICAgICAgdGhpcy5pbml0Q29tcG9uZW50RmFjdG9yeShtZXRhZGF0YS5jb21wb25lbnRGYWN0b3J5ICEsIHRlbXBsYXRlTWV0YWRhdGEubmdDb250ZW50U2VsZWN0b3JzKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2RpcmVjdGl2ZUNhY2hlLnNldChkaXJlY3RpdmVUeXBlLCBub3JtYWxpemVkRGlyTWV0YSk7XG4gICAgICB0aGlzLl9zdW1tYXJ5Q2FjaGUuc2V0KGRpcmVjdGl2ZVR5cGUsIG5vcm1hbGl6ZWREaXJNZXRhLnRvU3VtbWFyeSgpKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG5cbiAgICBpZiAobWV0YWRhdGEuaXNDb21wb25lbnQpIHtcbiAgICAgIGNvbnN0IHRlbXBsYXRlID0gbWV0YWRhdGEudGVtcGxhdGUgITtcbiAgICAgIGNvbnN0IHRlbXBsYXRlTWV0YSA9IHRoaXMuX2RpcmVjdGl2ZU5vcm1hbGl6ZXIubm9ybWFsaXplVGVtcGxhdGUoe1xuICAgICAgICBuZ01vZHVsZVR5cGUsXG4gICAgICAgIGNvbXBvbmVudFR5cGU6IGRpcmVjdGl2ZVR5cGUsXG4gICAgICAgIG1vZHVsZVVybDogdGhpcy5fcmVmbGVjdG9yLmNvbXBvbmVudE1vZHVsZVVybChkaXJlY3RpdmVUeXBlLCBhbm5vdGF0aW9uKSxcbiAgICAgICAgZW5jYXBzdWxhdGlvbjogdGVtcGxhdGUuZW5jYXBzdWxhdGlvbixcbiAgICAgICAgdGVtcGxhdGU6IHRlbXBsYXRlLnRlbXBsYXRlLFxuICAgICAgICB0ZW1wbGF0ZVVybDogdGVtcGxhdGUudGVtcGxhdGVVcmwsXG4gICAgICAgIHN0eWxlczogdGVtcGxhdGUuc3R5bGVzLFxuICAgICAgICBzdHlsZVVybHM6IHRlbXBsYXRlLnN0eWxlVXJscyxcbiAgICAgICAgYW5pbWF0aW9uczogdGVtcGxhdGUuYW5pbWF0aW9ucyxcbiAgICAgICAgaW50ZXJwb2xhdGlvbjogdGVtcGxhdGUuaW50ZXJwb2xhdGlvbixcbiAgICAgICAgcHJlc2VydmVXaGl0ZXNwYWNlczogdGVtcGxhdGUucHJlc2VydmVXaGl0ZXNwYWNlc1xuICAgICAgfSk7XG4gICAgICBpZiAoaXNQcm9taXNlKHRlbXBsYXRlTWV0YSkgJiYgaXNTeW5jKSB7XG4gICAgICAgIHRoaXMuX3JlcG9ydEVycm9yKGNvbXBvbmVudFN0aWxsTG9hZGluZ0Vycm9yKGRpcmVjdGl2ZVR5cGUpLCBkaXJlY3RpdmVUeXBlKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gU3luY0FzeW5jLnRoZW4odGVtcGxhdGVNZXRhLCBjcmVhdGVEaXJlY3RpdmVNZXRhZGF0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGRpcmVjdGl2ZVxuICAgICAgY3JlYXRlRGlyZWN0aXZlTWV0YWRhdGEobnVsbCk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBnZXROb25Ob3JtYWxpemVkRGlyZWN0aXZlTWV0YWRhdGEoZGlyZWN0aXZlVHlwZTogYW55KTpcbiAgICAgIHthbm5vdGF0aW9uOiBEaXJlY3RpdmUsIG1ldGFkYXRhOiBjcGwuQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhfXxudWxsIHtcbiAgICBkaXJlY3RpdmVUeXBlID0gcmVzb2x2ZUZvcndhcmRSZWYoZGlyZWN0aXZlVHlwZSk7XG4gICAgaWYgKCFkaXJlY3RpdmVUeXBlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgbGV0IGNhY2hlRW50cnkgPSB0aGlzLl9ub25Ob3JtYWxpemVkRGlyZWN0aXZlQ2FjaGUuZ2V0KGRpcmVjdGl2ZVR5cGUpO1xuICAgIGlmIChjYWNoZUVudHJ5KSB7XG4gICAgICByZXR1cm4gY2FjaGVFbnRyeTtcbiAgICB9XG4gICAgY29uc3QgZGlyTWV0YSA9IHRoaXMuX2RpcmVjdGl2ZVJlc29sdmVyLnJlc29sdmUoZGlyZWN0aXZlVHlwZSwgZmFsc2UpO1xuICAgIGlmICghZGlyTWV0YSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGxldCBub25Ob3JtYWxpemVkVGVtcGxhdGVNZXRhZGF0YTogY3BsLkNvbXBpbGVUZW1wbGF0ZU1ldGFkYXRhID0gdW5kZWZpbmVkICE7XG5cbiAgICBpZiAoY3JlYXRlQ29tcG9uZW50LmlzVHlwZU9mKGRpck1ldGEpKSB7XG4gICAgICAvLyBjb21wb25lbnRcbiAgICAgIGNvbnN0IGNvbXBNZXRhID0gZGlyTWV0YSBhcyBDb21wb25lbnQ7XG4gICAgICBhc3NlcnRBcnJheU9mU3RyaW5ncygnc3R5bGVzJywgY29tcE1ldGEuc3R5bGVzKTtcbiAgICAgIGFzc2VydEFycmF5T2ZTdHJpbmdzKCdzdHlsZVVybHMnLCBjb21wTWV0YS5zdHlsZVVybHMpO1xuICAgICAgYXNzZXJ0SW50ZXJwb2xhdGlvblN5bWJvbHMoJ2ludGVycG9sYXRpb24nLCBjb21wTWV0YS5pbnRlcnBvbGF0aW9uKTtcblxuICAgICAgY29uc3QgYW5pbWF0aW9ucyA9IGNvbXBNZXRhLmFuaW1hdGlvbnM7XG5cbiAgICAgIG5vbk5vcm1hbGl6ZWRUZW1wbGF0ZU1ldGFkYXRhID0gbmV3IGNwbC5Db21waWxlVGVtcGxhdGVNZXRhZGF0YSh7XG4gICAgICAgIGVuY2Fwc3VsYXRpb246IG5vVW5kZWZpbmVkKGNvbXBNZXRhLmVuY2Fwc3VsYXRpb24pLFxuICAgICAgICB0ZW1wbGF0ZTogbm9VbmRlZmluZWQoY29tcE1ldGEudGVtcGxhdGUpLFxuICAgICAgICB0ZW1wbGF0ZVVybDogbm9VbmRlZmluZWQoY29tcE1ldGEudGVtcGxhdGVVcmwpLFxuICAgICAgICBodG1sQXN0OiBudWxsLFxuICAgICAgICBzdHlsZXM6IGNvbXBNZXRhLnN0eWxlcyB8fCBbXSxcbiAgICAgICAgc3R5bGVVcmxzOiBjb21wTWV0YS5zdHlsZVVybHMgfHwgW10sXG4gICAgICAgIGFuaW1hdGlvbnM6IGFuaW1hdGlvbnMgfHwgW10sXG4gICAgICAgIGludGVycG9sYXRpb246IG5vVW5kZWZpbmVkKGNvbXBNZXRhLmludGVycG9sYXRpb24pLFxuICAgICAgICBpc0lubGluZTogISFjb21wTWV0YS50ZW1wbGF0ZSxcbiAgICAgICAgZXh0ZXJuYWxTdHlsZXNoZWV0czogW10sXG4gICAgICAgIG5nQ29udGVudFNlbGVjdG9yczogW10sXG4gICAgICAgIHByZXNlcnZlV2hpdGVzcGFjZXM6IG5vVW5kZWZpbmVkKGRpck1ldGEucHJlc2VydmVXaGl0ZXNwYWNlcyksXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBsZXQgY2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3k6IENoYW5nZURldGVjdGlvblN0cmF0ZWd5ID0gbnVsbCAhO1xuICAgIGxldCB2aWV3UHJvdmlkZXJzOiBjcGwuQ29tcGlsZVByb3ZpZGVyTWV0YWRhdGFbXSA9IFtdO1xuICAgIGxldCBlbnRyeUNvbXBvbmVudE1ldGFkYXRhOiBjcGwuQ29tcGlsZUVudHJ5Q29tcG9uZW50TWV0YWRhdGFbXSA9IFtdO1xuICAgIGxldCBzZWxlY3RvciA9IGRpck1ldGEuc2VsZWN0b3I7XG5cbiAgICBpZiAoY3JlYXRlQ29tcG9uZW50LmlzVHlwZU9mKGRpck1ldGEpKSB7XG4gICAgICAvLyBDb21wb25lbnRcbiAgICAgIGNvbnN0IGNvbXBNZXRhID0gZGlyTWV0YSBhcyBDb21wb25lbnQ7XG4gICAgICBjaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSA9IGNvbXBNZXRhLmNoYW5nZURldGVjdGlvbiAhO1xuICAgICAgaWYgKGNvbXBNZXRhLnZpZXdQcm92aWRlcnMpIHtcbiAgICAgICAgdmlld1Byb3ZpZGVycyA9IHRoaXMuX2dldFByb3ZpZGVyc01ldGFkYXRhKFxuICAgICAgICAgICAgY29tcE1ldGEudmlld1Byb3ZpZGVycywgZW50cnlDb21wb25lbnRNZXRhZGF0YSxcbiAgICAgICAgICAgIGB2aWV3UHJvdmlkZXJzIGZvciBcIiR7c3RyaW5naWZ5VHlwZShkaXJlY3RpdmVUeXBlKX1cImAsIFtdLCBkaXJlY3RpdmVUeXBlKTtcbiAgICAgIH1cbiAgICAgIGlmIChjb21wTWV0YS5lbnRyeUNvbXBvbmVudHMpIHtcbiAgICAgICAgZW50cnlDb21wb25lbnRNZXRhZGF0YSA9IGZsYXR0ZW5BbmREZWR1cGVBcnJheShjb21wTWV0YS5lbnRyeUNvbXBvbmVudHMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCgodHlwZSkgPT4gdGhpcy5fZ2V0RW50cnlDb21wb25lbnRNZXRhZGF0YSh0eXBlKSAhKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jb25jYXQoZW50cnlDb21wb25lbnRNZXRhZGF0YSk7XG4gICAgICB9XG4gICAgICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgICAgIHNlbGVjdG9yID0gdGhpcy5fc2NoZW1hUmVnaXN0cnkuZ2V0RGVmYXVsdENvbXBvbmVudEVsZW1lbnROYW1lKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIERpcmVjdGl2ZVxuICAgICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgICB0aGlzLl9yZXBvcnRFcnJvcihcbiAgICAgICAgICAgIHN5bnRheEVycm9yKFxuICAgICAgICAgICAgICAgIGBEaXJlY3RpdmUgJHtzdHJpbmdpZnlUeXBlKGRpcmVjdGl2ZVR5cGUpfSBoYXMgbm8gc2VsZWN0b3IsIHBsZWFzZSBhZGQgaXQhYCksXG4gICAgICAgICAgICBkaXJlY3RpdmVUeXBlKTtcbiAgICAgICAgc2VsZWN0b3IgPSAnZXJyb3InO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBwcm92aWRlcnM6IGNwbC5Db21waWxlUHJvdmlkZXJNZXRhZGF0YVtdID0gW107XG4gICAgaWYgKGRpck1ldGEucHJvdmlkZXJzICE9IG51bGwpIHtcbiAgICAgIHByb3ZpZGVycyA9IHRoaXMuX2dldFByb3ZpZGVyc01ldGFkYXRhKFxuICAgICAgICAgIGRpck1ldGEucHJvdmlkZXJzLCBlbnRyeUNvbXBvbmVudE1ldGFkYXRhLFxuICAgICAgICAgIGBwcm92aWRlcnMgZm9yIFwiJHtzdHJpbmdpZnlUeXBlKGRpcmVjdGl2ZVR5cGUpfVwiYCwgW10sIGRpcmVjdGl2ZVR5cGUpO1xuICAgIH1cbiAgICBsZXQgcXVlcmllczogY3BsLkNvbXBpbGVRdWVyeU1ldGFkYXRhW10gPSBbXTtcbiAgICBsZXQgdmlld1F1ZXJpZXM6IGNwbC5Db21waWxlUXVlcnlNZXRhZGF0YVtdID0gW107XG4gICAgaWYgKGRpck1ldGEucXVlcmllcyAhPSBudWxsKSB7XG4gICAgICBxdWVyaWVzID0gdGhpcy5fZ2V0UXVlcmllc01ldGFkYXRhKGRpck1ldGEucXVlcmllcywgZmFsc2UsIGRpcmVjdGl2ZVR5cGUpO1xuICAgICAgdmlld1F1ZXJpZXMgPSB0aGlzLl9nZXRRdWVyaWVzTWV0YWRhdGEoZGlyTWV0YS5xdWVyaWVzLCB0cnVlLCBkaXJlY3RpdmVUeXBlKTtcbiAgICB9XG5cbiAgICBjb25zdCBtZXRhZGF0YSA9IGNwbC5Db21waWxlRGlyZWN0aXZlTWV0YWRhdGEuY3JlYXRlKHtcbiAgICAgIGlzSG9zdDogZmFsc2UsXG4gICAgICBzZWxlY3Rvcjogc2VsZWN0b3IsXG4gICAgICBleHBvcnRBczogbm9VbmRlZmluZWQoZGlyTWV0YS5leHBvcnRBcyksXG4gICAgICBpc0NvbXBvbmVudDogISFub25Ob3JtYWxpemVkVGVtcGxhdGVNZXRhZGF0YSxcbiAgICAgIHR5cGU6IHRoaXMuX2dldFR5cGVNZXRhZGF0YShkaXJlY3RpdmVUeXBlKSxcbiAgICAgIHRlbXBsYXRlOiBub25Ob3JtYWxpemVkVGVtcGxhdGVNZXRhZGF0YSxcbiAgICAgIGNoYW5nZURldGVjdGlvbjogY2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gICAgICBpbnB1dHM6IGRpck1ldGEuaW5wdXRzIHx8IFtdLFxuICAgICAgb3V0cHV0czogZGlyTWV0YS5vdXRwdXRzIHx8IFtdLFxuICAgICAgaG9zdDogZGlyTWV0YS5ob3N0IHx8IHt9LFxuICAgICAgcHJvdmlkZXJzOiBwcm92aWRlcnMgfHwgW10sXG4gICAgICB2aWV3UHJvdmlkZXJzOiB2aWV3UHJvdmlkZXJzIHx8IFtdLFxuICAgICAgcXVlcmllczogcXVlcmllcyB8fCBbXSxcbiAgICAgIGd1YXJkczogZGlyTWV0YS5ndWFyZHMgfHwge30sXG4gICAgICB2aWV3UXVlcmllczogdmlld1F1ZXJpZXMgfHwgW10sXG4gICAgICBlbnRyeUNvbXBvbmVudHM6IGVudHJ5Q29tcG9uZW50TWV0YWRhdGEsXG4gICAgICBjb21wb25lbnRWaWV3VHlwZTogbm9uTm9ybWFsaXplZFRlbXBsYXRlTWV0YWRhdGEgPyB0aGlzLmdldENvbXBvbmVudFZpZXdDbGFzcyhkaXJlY3RpdmVUeXBlKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgcmVuZGVyZXJUeXBlOiBub25Ob3JtYWxpemVkVGVtcGxhdGVNZXRhZGF0YSA/IHRoaXMuZ2V0UmVuZGVyZXJUeXBlKGRpcmVjdGl2ZVR5cGUpIDogbnVsbCxcbiAgICAgIGNvbXBvbmVudEZhY3Rvcnk6IG51bGxcbiAgICB9KTtcbiAgICBpZiAobm9uTm9ybWFsaXplZFRlbXBsYXRlTWV0YWRhdGEpIHtcbiAgICAgIG1ldGFkYXRhLmNvbXBvbmVudEZhY3RvcnkgPVxuICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50RmFjdG9yeShzZWxlY3RvciwgZGlyZWN0aXZlVHlwZSwgbWV0YWRhdGEuaW5wdXRzLCBtZXRhZGF0YS5vdXRwdXRzKTtcbiAgICB9XG4gICAgY2FjaGVFbnRyeSA9IHttZXRhZGF0YSwgYW5ub3RhdGlvbjogZGlyTWV0YX07XG4gICAgdGhpcy5fbm9uTm9ybWFsaXplZERpcmVjdGl2ZUNhY2hlLnNldChkaXJlY3RpdmVUeXBlLCBjYWNoZUVudHJ5KTtcbiAgICByZXR1cm4gY2FjaGVFbnRyeTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBtZXRhZGF0YSBmb3IgdGhlIGdpdmVuIGRpcmVjdGl2ZS5cbiAgICogVGhpcyBhc3N1bWVzIGBsb2FkTmdNb2R1bGVEaXJlY3RpdmVBbmRQaXBlTWV0YWRhdGFgIGhhcyBiZWVuIGNhbGxlZCBmaXJzdC5cbiAgICovXG4gIGdldERpcmVjdGl2ZU1ldGFkYXRhKGRpcmVjdGl2ZVR5cGU6IGFueSk6IGNwbC5Db21waWxlRGlyZWN0aXZlTWV0YWRhdGEge1xuICAgIGNvbnN0IGRpck1ldGEgPSB0aGlzLl9kaXJlY3RpdmVDYWNoZS5nZXQoZGlyZWN0aXZlVHlwZSkgITtcbiAgICBpZiAoIWRpck1ldGEpIHtcbiAgICAgIHRoaXMuX3JlcG9ydEVycm9yKFxuICAgICAgICAgIHN5bnRheEVycm9yKFxuICAgICAgICAgICAgICBgSWxsZWdhbCBzdGF0ZTogZ2V0RGlyZWN0aXZlTWV0YWRhdGEgY2FuIG9ubHkgYmUgY2FsbGVkIGFmdGVyIGxvYWROZ01vZHVsZURpcmVjdGl2ZUFuZFBpcGVNZXRhZGF0YSBmb3IgYSBtb2R1bGUgdGhhdCBkZWNsYXJlcyBpdC4gRGlyZWN0aXZlICR7c3RyaW5naWZ5VHlwZShkaXJlY3RpdmVUeXBlKX0uYCksXG4gICAgICAgICAgZGlyZWN0aXZlVHlwZSk7XG4gICAgfVxuICAgIHJldHVybiBkaXJNZXRhO1xuICB9XG5cbiAgZ2V0RGlyZWN0aXZlU3VtbWFyeShkaXJUeXBlOiBhbnkpOiBjcGwuQ29tcGlsZURpcmVjdGl2ZVN1bW1hcnkge1xuICAgIGNvbnN0IGRpclN1bW1hcnkgPVxuICAgICAgICA8Y3BsLkNvbXBpbGVEaXJlY3RpdmVTdW1tYXJ5PnRoaXMuX2xvYWRTdW1tYXJ5KGRpclR5cGUsIGNwbC5Db21waWxlU3VtbWFyeUtpbmQuRGlyZWN0aXZlKTtcbiAgICBpZiAoIWRpclN1bW1hcnkpIHtcbiAgICAgIHRoaXMuX3JlcG9ydEVycm9yKFxuICAgICAgICAgIHN5bnRheEVycm9yKFxuICAgICAgICAgICAgICBgSWxsZWdhbCBzdGF0ZTogQ291bGQgbm90IGxvYWQgdGhlIHN1bW1hcnkgZm9yIGRpcmVjdGl2ZSAke3N0cmluZ2lmeVR5cGUoZGlyVHlwZSl9LmApLFxuICAgICAgICAgIGRpclR5cGUpO1xuICAgIH1cbiAgICByZXR1cm4gZGlyU3VtbWFyeTtcbiAgfVxuXG4gIGlzRGlyZWN0aXZlKHR5cGU6IGFueSkge1xuICAgIHJldHVybiAhIXRoaXMuX2xvYWRTdW1tYXJ5KHR5cGUsIGNwbC5Db21waWxlU3VtbWFyeUtpbmQuRGlyZWN0aXZlKSB8fFxuICAgICAgICB0aGlzLl9kaXJlY3RpdmVSZXNvbHZlci5pc0RpcmVjdGl2ZSh0eXBlKTtcbiAgfVxuXG4gIGlzUGlwZSh0eXBlOiBhbnkpIHtcbiAgICByZXR1cm4gISF0aGlzLl9sb2FkU3VtbWFyeSh0eXBlLCBjcGwuQ29tcGlsZVN1bW1hcnlLaW5kLlBpcGUpIHx8XG4gICAgICAgIHRoaXMuX3BpcGVSZXNvbHZlci5pc1BpcGUodHlwZSk7XG4gIH1cblxuICBpc05nTW9kdWxlKHR5cGU6IGFueSkge1xuICAgIHJldHVybiAhIXRoaXMuX2xvYWRTdW1tYXJ5KHR5cGUsIGNwbC5Db21waWxlU3VtbWFyeUtpbmQuTmdNb2R1bGUpIHx8XG4gICAgICAgIHRoaXMuX25nTW9kdWxlUmVzb2x2ZXIuaXNOZ01vZHVsZSh0eXBlKTtcbiAgfVxuXG4gIGdldE5nTW9kdWxlU3VtbWFyeShtb2R1bGVUeXBlOiBhbnksIGFscmVhZHlDb2xsZWN0aW5nOiBTZXQ8YW55PnxudWxsID0gbnVsbCk6XG4gICAgICBjcGwuQ29tcGlsZU5nTW9kdWxlU3VtbWFyeXxudWxsIHtcbiAgICBsZXQgbW9kdWxlU3VtbWFyeTogY3BsLkNvbXBpbGVOZ01vZHVsZVN1bW1hcnl8bnVsbCA9XG4gICAgICAgIDxjcGwuQ29tcGlsZU5nTW9kdWxlU3VtbWFyeT50aGlzLl9sb2FkU3VtbWFyeShtb2R1bGVUeXBlLCBjcGwuQ29tcGlsZVN1bW1hcnlLaW5kLk5nTW9kdWxlKTtcbiAgICBpZiAoIW1vZHVsZVN1bW1hcnkpIHtcbiAgICAgIGNvbnN0IG1vZHVsZU1ldGEgPSB0aGlzLmdldE5nTW9kdWxlTWV0YWRhdGEobW9kdWxlVHlwZSwgZmFsc2UsIGFscmVhZHlDb2xsZWN0aW5nKTtcbiAgICAgIG1vZHVsZVN1bW1hcnkgPSBtb2R1bGVNZXRhID8gbW9kdWxlTWV0YS50b1N1bW1hcnkoKSA6IG51bGw7XG4gICAgICBpZiAobW9kdWxlU3VtbWFyeSkge1xuICAgICAgICB0aGlzLl9zdW1tYXJ5Q2FjaGUuc2V0KG1vZHVsZVR5cGUsIG1vZHVsZVN1bW1hcnkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbW9kdWxlU3VtbWFyeTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkcyB0aGUgZGVjbGFyZWQgZGlyZWN0aXZlcyBhbmQgcGlwZXMgb2YgYW4gTmdNb2R1bGUuXG4gICAqL1xuICBsb2FkTmdNb2R1bGVEaXJlY3RpdmVBbmRQaXBlTWV0YWRhdGEobW9kdWxlVHlwZTogYW55LCBpc1N5bmM6IGJvb2xlYW4sIHRocm93SWZOb3RGb3VuZCA9IHRydWUpOlxuICAgICAgUHJvbWlzZTxhbnk+IHtcbiAgICBjb25zdCBuZ01vZHVsZSA9IHRoaXMuZ2V0TmdNb2R1bGVNZXRhZGF0YShtb2R1bGVUeXBlLCB0aHJvd0lmTm90Rm91bmQpO1xuICAgIGNvbnN0IGxvYWRpbmc6IFByb21pc2U8YW55PltdID0gW107XG4gICAgaWYgKG5nTW9kdWxlKSB7XG4gICAgICBuZ01vZHVsZS5kZWNsYXJlZERpcmVjdGl2ZXMuZm9yRWFjaCgoaWQpID0+IHtcbiAgICAgICAgY29uc3QgcHJvbWlzZSA9IHRoaXMubG9hZERpcmVjdGl2ZU1ldGFkYXRhKG1vZHVsZVR5cGUsIGlkLnJlZmVyZW5jZSwgaXNTeW5jKTtcbiAgICAgICAgaWYgKHByb21pc2UpIHtcbiAgICAgICAgICBsb2FkaW5nLnB1c2gocHJvbWlzZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgbmdNb2R1bGUuZGVjbGFyZWRQaXBlcy5mb3JFYWNoKChpZCkgPT4gdGhpcy5fbG9hZFBpcGVNZXRhZGF0YShpZC5yZWZlcmVuY2UpKTtcbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKGxvYWRpbmcpO1xuICB9XG5cbiAgZ2V0U2hhbGxvd01vZHVsZU1ldGFkYXRhKG1vZHVsZVR5cGU6IGFueSk6IGNwbC5Db21waWxlU2hhbGxvd01vZHVsZU1ldGFkYXRhfG51bGwge1xuICAgIGxldCBjb21waWxlTWV0YSA9IHRoaXMuX3NoYWxsb3dNb2R1bGVDYWNoZS5nZXQobW9kdWxlVHlwZSk7XG4gICAgaWYgKGNvbXBpbGVNZXRhKSB7XG4gICAgICByZXR1cm4gY29tcGlsZU1ldGE7XG4gICAgfVxuXG4gICAgY29uc3QgbmdNb2R1bGVNZXRhID1cbiAgICAgICAgZmluZExhc3QodGhpcy5fcmVmbGVjdG9yLnNoYWxsb3dBbm5vdGF0aW9ucyhtb2R1bGVUeXBlKSwgY3JlYXRlTmdNb2R1bGUuaXNUeXBlT2YpO1xuXG4gICAgY29tcGlsZU1ldGEgPSB7XG4gICAgICB0eXBlOiB0aGlzLl9nZXRUeXBlTWV0YWRhdGEobW9kdWxlVHlwZSksXG4gICAgICByYXdFeHBvcnRzOiBuZ01vZHVsZU1ldGEuZXhwb3J0cyxcbiAgICAgIHJhd0ltcG9ydHM6IG5nTW9kdWxlTWV0YS5pbXBvcnRzLFxuICAgICAgcmF3UHJvdmlkZXJzOiBuZ01vZHVsZU1ldGEucHJvdmlkZXJzLFxuICAgIH07XG5cbiAgICB0aGlzLl9zaGFsbG93TW9kdWxlQ2FjaGUuc2V0KG1vZHVsZVR5cGUsIGNvbXBpbGVNZXRhKTtcbiAgICByZXR1cm4gY29tcGlsZU1ldGE7XG4gIH1cblxuICBnZXROZ01vZHVsZU1ldGFkYXRhKFxuICAgICAgbW9kdWxlVHlwZTogYW55LCB0aHJvd0lmTm90Rm91bmQgPSB0cnVlLFxuICAgICAgYWxyZWFkeUNvbGxlY3Rpbmc6IFNldDxhbnk+fG51bGwgPSBudWxsKTogY3BsLkNvbXBpbGVOZ01vZHVsZU1ldGFkYXRhfG51bGwge1xuICAgIG1vZHVsZVR5cGUgPSByZXNvbHZlRm9yd2FyZFJlZihtb2R1bGVUeXBlKTtcbiAgICBsZXQgY29tcGlsZU1ldGEgPSB0aGlzLl9uZ01vZHVsZUNhY2hlLmdldChtb2R1bGVUeXBlKTtcbiAgICBpZiAoY29tcGlsZU1ldGEpIHtcbiAgICAgIHJldHVybiBjb21waWxlTWV0YTtcbiAgICB9XG4gICAgY29uc3QgbWV0YSA9IHRoaXMuX25nTW9kdWxlUmVzb2x2ZXIucmVzb2x2ZShtb2R1bGVUeXBlLCB0aHJvd0lmTm90Rm91bmQpO1xuICAgIGlmICghbWV0YSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IGRlY2xhcmVkRGlyZWN0aXZlczogY3BsLkNvbXBpbGVJZGVudGlmaWVyTWV0YWRhdGFbXSA9IFtdO1xuICAgIGNvbnN0IGV4cG9ydGVkTm9uTW9kdWxlSWRlbnRpZmllcnM6IGNwbC5Db21waWxlSWRlbnRpZmllck1ldGFkYXRhW10gPSBbXTtcbiAgICBjb25zdCBkZWNsYXJlZFBpcGVzOiBjcGwuQ29tcGlsZUlkZW50aWZpZXJNZXRhZGF0YVtdID0gW107XG4gICAgY29uc3QgaW1wb3J0ZWRNb2R1bGVzOiBjcGwuQ29tcGlsZU5nTW9kdWxlU3VtbWFyeVtdID0gW107XG4gICAgY29uc3QgZXhwb3J0ZWRNb2R1bGVzOiBjcGwuQ29tcGlsZU5nTW9kdWxlU3VtbWFyeVtdID0gW107XG4gICAgY29uc3QgcHJvdmlkZXJzOiBjcGwuQ29tcGlsZVByb3ZpZGVyTWV0YWRhdGFbXSA9IFtdO1xuICAgIGNvbnN0IGVudHJ5Q29tcG9uZW50czogY3BsLkNvbXBpbGVFbnRyeUNvbXBvbmVudE1ldGFkYXRhW10gPSBbXTtcbiAgICBjb25zdCBib290c3RyYXBDb21wb25lbnRzOiBjcGwuQ29tcGlsZUlkZW50aWZpZXJNZXRhZGF0YVtdID0gW107XG4gICAgY29uc3Qgc2NoZW1hczogU2NoZW1hTWV0YWRhdGFbXSA9IFtdO1xuXG4gICAgaWYgKG1ldGEuaW1wb3J0cykge1xuICAgICAgZmxhdHRlbkFuZERlZHVwZUFycmF5KG1ldGEuaW1wb3J0cykuZm9yRWFjaCgoaW1wb3J0ZWRUeXBlKSA9PiB7XG4gICAgICAgIGxldCBpbXBvcnRlZE1vZHVsZVR5cGU6IFR5cGUgPSB1bmRlZmluZWQgITtcbiAgICAgICAgaWYgKGlzVmFsaWRUeXBlKGltcG9ydGVkVHlwZSkpIHtcbiAgICAgICAgICBpbXBvcnRlZE1vZHVsZVR5cGUgPSBpbXBvcnRlZFR5cGU7XG4gICAgICAgIH0gZWxzZSBpZiAoaW1wb3J0ZWRUeXBlICYmIGltcG9ydGVkVHlwZS5uZ01vZHVsZSkge1xuICAgICAgICAgIGNvbnN0IG1vZHVsZVdpdGhQcm92aWRlcnM6IE1vZHVsZVdpdGhQcm92aWRlcnMgPSBpbXBvcnRlZFR5cGU7XG4gICAgICAgICAgaW1wb3J0ZWRNb2R1bGVUeXBlID0gbW9kdWxlV2l0aFByb3ZpZGVycy5uZ01vZHVsZTtcbiAgICAgICAgICBpZiAobW9kdWxlV2l0aFByb3ZpZGVycy5wcm92aWRlcnMpIHtcbiAgICAgICAgICAgIHByb3ZpZGVycy5wdXNoKC4uLnRoaXMuX2dldFByb3ZpZGVyc01ldGFkYXRhKFxuICAgICAgICAgICAgICAgIG1vZHVsZVdpdGhQcm92aWRlcnMucHJvdmlkZXJzLCBlbnRyeUNvbXBvbmVudHMsXG4gICAgICAgICAgICAgICAgYHByb3ZpZGVyIGZvciB0aGUgTmdNb2R1bGUgJyR7c3RyaW5naWZ5VHlwZShpbXBvcnRlZE1vZHVsZVR5cGUpfSdgLCBbXSxcbiAgICAgICAgICAgICAgICBpbXBvcnRlZFR5cGUpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaW1wb3J0ZWRNb2R1bGVUeXBlKSB7XG4gICAgICAgICAgaWYgKHRoaXMuX2NoZWNrU2VsZkltcG9ydChtb2R1bGVUeXBlLCBpbXBvcnRlZE1vZHVsZVR5cGUpKSByZXR1cm47XG4gICAgICAgICAgaWYgKCFhbHJlYWR5Q29sbGVjdGluZykgYWxyZWFkeUNvbGxlY3RpbmcgPSBuZXcgU2V0KCk7XG4gICAgICAgICAgaWYgKGFscmVhZHlDb2xsZWN0aW5nLmhhcyhpbXBvcnRlZE1vZHVsZVR5cGUpKSB7XG4gICAgICAgICAgICB0aGlzLl9yZXBvcnRFcnJvcihcbiAgICAgICAgICAgICAgICBzeW50YXhFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgYCR7dGhpcy5fZ2V0VHlwZURlc2NyaXB0b3IoaW1wb3J0ZWRNb2R1bGVUeXBlKX0gJyR7c3RyaW5naWZ5VHlwZShpbXBvcnRlZFR5cGUpfScgaXMgaW1wb3J0ZWQgcmVjdXJzaXZlbHkgYnkgdGhlIG1vZHVsZSAnJHtzdHJpbmdpZnlUeXBlKG1vZHVsZVR5cGUpfScuYCksXG4gICAgICAgICAgICAgICAgbW9kdWxlVHlwZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGFscmVhZHlDb2xsZWN0aW5nLmFkZChpbXBvcnRlZE1vZHVsZVR5cGUpO1xuICAgICAgICAgIGNvbnN0IGltcG9ydGVkTW9kdWxlU3VtbWFyeSA9XG4gICAgICAgICAgICAgIHRoaXMuZ2V0TmdNb2R1bGVTdW1tYXJ5KGltcG9ydGVkTW9kdWxlVHlwZSwgYWxyZWFkeUNvbGxlY3RpbmcpO1xuICAgICAgICAgIGFscmVhZHlDb2xsZWN0aW5nLmRlbGV0ZShpbXBvcnRlZE1vZHVsZVR5cGUpO1xuICAgICAgICAgIGlmICghaW1wb3J0ZWRNb2R1bGVTdW1tYXJ5KSB7XG4gICAgICAgICAgICB0aGlzLl9yZXBvcnRFcnJvcihcbiAgICAgICAgICAgICAgICBzeW50YXhFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgYFVuZXhwZWN0ZWQgJHt0aGlzLl9nZXRUeXBlRGVzY3JpcHRvcihpbXBvcnRlZFR5cGUpfSAnJHtzdHJpbmdpZnlUeXBlKGltcG9ydGVkVHlwZSl9JyBpbXBvcnRlZCBieSB0aGUgbW9kdWxlICcke3N0cmluZ2lmeVR5cGUobW9kdWxlVHlwZSl9Jy4gUGxlYXNlIGFkZCBhIEBOZ01vZHVsZSBhbm5vdGF0aW9uLmApLFxuICAgICAgICAgICAgICAgIG1vZHVsZVR5cGUpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpbXBvcnRlZE1vZHVsZXMucHVzaChpbXBvcnRlZE1vZHVsZVN1bW1hcnkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3JlcG9ydEVycm9yKFxuICAgICAgICAgICAgICBzeW50YXhFcnJvcihcbiAgICAgICAgICAgICAgICAgIGBVbmV4cGVjdGVkIHZhbHVlICcke3N0cmluZ2lmeVR5cGUoaW1wb3J0ZWRUeXBlKX0nIGltcG9ydGVkIGJ5IHRoZSBtb2R1bGUgJyR7c3RyaW5naWZ5VHlwZShtb2R1bGVUeXBlKX0nYCksXG4gICAgICAgICAgICAgIG1vZHVsZVR5cGUpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKG1ldGEuZXhwb3J0cykge1xuICAgICAgZmxhdHRlbkFuZERlZHVwZUFycmF5KG1ldGEuZXhwb3J0cykuZm9yRWFjaCgoZXhwb3J0ZWRUeXBlKSA9PiB7XG4gICAgICAgIGlmICghaXNWYWxpZFR5cGUoZXhwb3J0ZWRUeXBlKSkge1xuICAgICAgICAgIHRoaXMuX3JlcG9ydEVycm9yKFxuICAgICAgICAgICAgICBzeW50YXhFcnJvcihcbiAgICAgICAgICAgICAgICAgIGBVbmV4cGVjdGVkIHZhbHVlICcke3N0cmluZ2lmeVR5cGUoZXhwb3J0ZWRUeXBlKX0nIGV4cG9ydGVkIGJ5IHRoZSBtb2R1bGUgJyR7c3RyaW5naWZ5VHlwZShtb2R1bGVUeXBlKX0nYCksXG4gICAgICAgICAgICAgIG1vZHVsZVR5cGUpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWFscmVhZHlDb2xsZWN0aW5nKSBhbHJlYWR5Q29sbGVjdGluZyA9IG5ldyBTZXQoKTtcbiAgICAgICAgaWYgKGFscmVhZHlDb2xsZWN0aW5nLmhhcyhleHBvcnRlZFR5cGUpKSB7XG4gICAgICAgICAgdGhpcy5fcmVwb3J0RXJyb3IoXG4gICAgICAgICAgICAgIHN5bnRheEVycm9yKFxuICAgICAgICAgICAgICAgICAgYCR7dGhpcy5fZ2V0VHlwZURlc2NyaXB0b3IoZXhwb3J0ZWRUeXBlKX0gJyR7c3RyaW5naWZ5KGV4cG9ydGVkVHlwZSl9JyBpcyBleHBvcnRlZCByZWN1cnNpdmVseSBieSB0aGUgbW9kdWxlICcke3N0cmluZ2lmeVR5cGUobW9kdWxlVHlwZSl9J2ApLFxuICAgICAgICAgICAgICBtb2R1bGVUeXBlKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgYWxyZWFkeUNvbGxlY3RpbmcuYWRkKGV4cG9ydGVkVHlwZSk7XG4gICAgICAgIGNvbnN0IGV4cG9ydGVkTW9kdWxlU3VtbWFyeSA9IHRoaXMuZ2V0TmdNb2R1bGVTdW1tYXJ5KGV4cG9ydGVkVHlwZSwgYWxyZWFkeUNvbGxlY3RpbmcpO1xuICAgICAgICBhbHJlYWR5Q29sbGVjdGluZy5kZWxldGUoZXhwb3J0ZWRUeXBlKTtcbiAgICAgICAgaWYgKGV4cG9ydGVkTW9kdWxlU3VtbWFyeSkge1xuICAgICAgICAgIGV4cG9ydGVkTW9kdWxlcy5wdXNoKGV4cG9ydGVkTW9kdWxlU3VtbWFyeSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZXhwb3J0ZWROb25Nb2R1bGVJZGVudGlmaWVycy5wdXNoKHRoaXMuX2dldElkZW50aWZpZXJNZXRhZGF0YShleHBvcnRlZFR5cGUpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gTm90ZTogVGhpcyB3aWxsIGJlIG1vZGlmaWVkIGxhdGVyLCBzbyB3ZSByZWx5IG9uXG4gICAgLy8gZ2V0dGluZyBhIG5ldyBpbnN0YW5jZSBldmVyeSB0aW1lIVxuICAgIGNvbnN0IHRyYW5zaXRpdmVNb2R1bGUgPSB0aGlzLl9nZXRUcmFuc2l0aXZlTmdNb2R1bGVNZXRhZGF0YShpbXBvcnRlZE1vZHVsZXMsIGV4cG9ydGVkTW9kdWxlcyk7XG4gICAgaWYgKG1ldGEuZGVjbGFyYXRpb25zKSB7XG4gICAgICBmbGF0dGVuQW5kRGVkdXBlQXJyYXkobWV0YS5kZWNsYXJhdGlvbnMpLmZvckVhY2goKGRlY2xhcmVkVHlwZSkgPT4ge1xuICAgICAgICBpZiAoIWlzVmFsaWRUeXBlKGRlY2xhcmVkVHlwZSkpIHtcbiAgICAgICAgICB0aGlzLl9yZXBvcnRFcnJvcihcbiAgICAgICAgICAgICAgc3ludGF4RXJyb3IoXG4gICAgICAgICAgICAgICAgICBgVW5leHBlY3RlZCB2YWx1ZSAnJHtzdHJpbmdpZnlUeXBlKGRlY2xhcmVkVHlwZSl9JyBkZWNsYXJlZCBieSB0aGUgbW9kdWxlICcke3N0cmluZ2lmeVR5cGUobW9kdWxlVHlwZSl9J2ApLFxuICAgICAgICAgICAgICBtb2R1bGVUeXBlKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGVjbGFyZWRJZGVudGlmaWVyID0gdGhpcy5fZ2V0SWRlbnRpZmllck1ldGFkYXRhKGRlY2xhcmVkVHlwZSk7XG4gICAgICAgIGlmICh0aGlzLmlzRGlyZWN0aXZlKGRlY2xhcmVkVHlwZSkpIHtcbiAgICAgICAgICB0cmFuc2l0aXZlTW9kdWxlLmFkZERpcmVjdGl2ZShkZWNsYXJlZElkZW50aWZpZXIpO1xuICAgICAgICAgIGRlY2xhcmVkRGlyZWN0aXZlcy5wdXNoKGRlY2xhcmVkSWRlbnRpZmllcik7XG4gICAgICAgICAgdGhpcy5fYWRkVHlwZVRvTW9kdWxlKGRlY2xhcmVkVHlwZSwgbW9kdWxlVHlwZSk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5pc1BpcGUoZGVjbGFyZWRUeXBlKSkge1xuICAgICAgICAgIHRyYW5zaXRpdmVNb2R1bGUuYWRkUGlwZShkZWNsYXJlZElkZW50aWZpZXIpO1xuICAgICAgICAgIHRyYW5zaXRpdmVNb2R1bGUucGlwZXMucHVzaChkZWNsYXJlZElkZW50aWZpZXIpO1xuICAgICAgICAgIGRlY2xhcmVkUGlwZXMucHVzaChkZWNsYXJlZElkZW50aWZpZXIpO1xuICAgICAgICAgIHRoaXMuX2FkZFR5cGVUb01vZHVsZShkZWNsYXJlZFR5cGUsIG1vZHVsZVR5cGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3JlcG9ydEVycm9yKFxuICAgICAgICAgICAgICBzeW50YXhFcnJvcihcbiAgICAgICAgICAgICAgICAgIGBVbmV4cGVjdGVkICR7dGhpcy5fZ2V0VHlwZURlc2NyaXB0b3IoZGVjbGFyZWRUeXBlKX0gJyR7c3RyaW5naWZ5VHlwZShkZWNsYXJlZFR5cGUpfScgZGVjbGFyZWQgYnkgdGhlIG1vZHVsZSAnJHtzdHJpbmdpZnlUeXBlKG1vZHVsZVR5cGUpfScuIFBsZWFzZSBhZGQgYSBAUGlwZS9ARGlyZWN0aXZlL0BDb21wb25lbnQgYW5ub3RhdGlvbi5gKSxcbiAgICAgICAgICAgICAgbW9kdWxlVHlwZSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBleHBvcnRlZERpcmVjdGl2ZXM6IGNwbC5Db21waWxlSWRlbnRpZmllck1ldGFkYXRhW10gPSBbXTtcbiAgICBjb25zdCBleHBvcnRlZFBpcGVzOiBjcGwuQ29tcGlsZUlkZW50aWZpZXJNZXRhZGF0YVtdID0gW107XG4gICAgZXhwb3J0ZWROb25Nb2R1bGVJZGVudGlmaWVycy5mb3JFYWNoKChleHBvcnRlZElkKSA9PiB7XG4gICAgICBpZiAodHJhbnNpdGl2ZU1vZHVsZS5kaXJlY3RpdmVzU2V0LmhhcyhleHBvcnRlZElkLnJlZmVyZW5jZSkpIHtcbiAgICAgICAgZXhwb3J0ZWREaXJlY3RpdmVzLnB1c2goZXhwb3J0ZWRJZCk7XG4gICAgICAgIHRyYW5zaXRpdmVNb2R1bGUuYWRkRXhwb3J0ZWREaXJlY3RpdmUoZXhwb3J0ZWRJZCk7XG4gICAgICB9IGVsc2UgaWYgKHRyYW5zaXRpdmVNb2R1bGUucGlwZXNTZXQuaGFzKGV4cG9ydGVkSWQucmVmZXJlbmNlKSkge1xuICAgICAgICBleHBvcnRlZFBpcGVzLnB1c2goZXhwb3J0ZWRJZCk7XG4gICAgICAgIHRyYW5zaXRpdmVNb2R1bGUuYWRkRXhwb3J0ZWRQaXBlKGV4cG9ydGVkSWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fcmVwb3J0RXJyb3IoXG4gICAgICAgICAgICBzeW50YXhFcnJvcihcbiAgICAgICAgICAgICAgICBgQ2FuJ3QgZXhwb3J0ICR7dGhpcy5fZ2V0VHlwZURlc2NyaXB0b3IoZXhwb3J0ZWRJZC5yZWZlcmVuY2UpfSAke3N0cmluZ2lmeVR5cGUoZXhwb3J0ZWRJZC5yZWZlcmVuY2UpfSBmcm9tICR7c3RyaW5naWZ5VHlwZShtb2R1bGVUeXBlKX0gYXMgaXQgd2FzIG5laXRoZXIgZGVjbGFyZWQgbm9yIGltcG9ydGVkIWApLFxuICAgICAgICAgICAgbW9kdWxlVHlwZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFRoZSBwcm92aWRlcnMgb2YgdGhlIG1vZHVsZSBoYXZlIHRvIGdvIGxhc3RcbiAgICAvLyBzbyB0aGF0IHRoZXkgb3ZlcndyaXRlIGFueSBvdGhlciBwcm92aWRlciB3ZSBhbHJlYWR5IGFkZGVkLlxuICAgIGlmIChtZXRhLnByb3ZpZGVycykge1xuICAgICAgcHJvdmlkZXJzLnB1c2goLi4udGhpcy5fZ2V0UHJvdmlkZXJzTWV0YWRhdGEoXG4gICAgICAgICAgbWV0YS5wcm92aWRlcnMsIGVudHJ5Q29tcG9uZW50cyxcbiAgICAgICAgICBgcHJvdmlkZXIgZm9yIHRoZSBOZ01vZHVsZSAnJHtzdHJpbmdpZnlUeXBlKG1vZHVsZVR5cGUpfSdgLCBbXSwgbW9kdWxlVHlwZSkpO1xuICAgIH1cblxuICAgIGlmIChtZXRhLmVudHJ5Q29tcG9uZW50cykge1xuICAgICAgZW50cnlDb21wb25lbnRzLnB1c2goLi4uZmxhdHRlbkFuZERlZHVwZUFycmF5KG1ldGEuZW50cnlDb21wb25lbnRzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAodHlwZSA9PiB0aGlzLl9nZXRFbnRyeUNvbXBvbmVudE1ldGFkYXRhKHR5cGUpICEpKTtcbiAgICB9XG5cbiAgICBpZiAobWV0YS5ib290c3RyYXApIHtcbiAgICAgIGZsYXR0ZW5BbmREZWR1cGVBcnJheShtZXRhLmJvb3RzdHJhcCkuZm9yRWFjaCh0eXBlID0+IHtcbiAgICAgICAgaWYgKCFpc1ZhbGlkVHlwZSh0eXBlKSkge1xuICAgICAgICAgIHRoaXMuX3JlcG9ydEVycm9yKFxuICAgICAgICAgICAgICBzeW50YXhFcnJvcihcbiAgICAgICAgICAgICAgICAgIGBVbmV4cGVjdGVkIHZhbHVlICcke3N0cmluZ2lmeVR5cGUodHlwZSl9JyB1c2VkIGluIHRoZSBib290c3RyYXAgcHJvcGVydHkgb2YgbW9kdWxlICcke3N0cmluZ2lmeVR5cGUobW9kdWxlVHlwZSl9J2ApLFxuICAgICAgICAgICAgICBtb2R1bGVUeXBlKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgYm9vdHN0cmFwQ29tcG9uZW50cy5wdXNoKHRoaXMuX2dldElkZW50aWZpZXJNZXRhZGF0YSh0eXBlKSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBlbnRyeUNvbXBvbmVudHMucHVzaChcbiAgICAgICAgLi4uYm9vdHN0cmFwQ29tcG9uZW50cy5tYXAodHlwZSA9PiB0aGlzLl9nZXRFbnRyeUNvbXBvbmVudE1ldGFkYXRhKHR5cGUucmVmZXJlbmNlKSAhKSk7XG5cbiAgICBpZiAobWV0YS5zY2hlbWFzKSB7XG4gICAgICBzY2hlbWFzLnB1c2goLi4uZmxhdHRlbkFuZERlZHVwZUFycmF5KG1ldGEuc2NoZW1hcykpO1xuICAgIH1cblxuICAgIGNvbXBpbGVNZXRhID0gbmV3IGNwbC5Db21waWxlTmdNb2R1bGVNZXRhZGF0YSh7XG4gICAgICB0eXBlOiB0aGlzLl9nZXRUeXBlTWV0YWRhdGEobW9kdWxlVHlwZSksXG4gICAgICBwcm92aWRlcnMsXG4gICAgICBlbnRyeUNvbXBvbmVudHMsXG4gICAgICBib290c3RyYXBDb21wb25lbnRzLFxuICAgICAgc2NoZW1hcyxcbiAgICAgIGRlY2xhcmVkRGlyZWN0aXZlcyxcbiAgICAgIGV4cG9ydGVkRGlyZWN0aXZlcyxcbiAgICAgIGRlY2xhcmVkUGlwZXMsXG4gICAgICBleHBvcnRlZFBpcGVzLFxuICAgICAgaW1wb3J0ZWRNb2R1bGVzLFxuICAgICAgZXhwb3J0ZWRNb2R1bGVzLFxuICAgICAgdHJhbnNpdGl2ZU1vZHVsZSxcbiAgICAgIGlkOiBtZXRhLmlkIHx8IG51bGwsXG4gICAgfSk7XG5cbiAgICBlbnRyeUNvbXBvbmVudHMuZm9yRWFjaCgoaWQpID0+IHRyYW5zaXRpdmVNb2R1bGUuYWRkRW50cnlDb21wb25lbnQoaWQpKTtcbiAgICBwcm92aWRlcnMuZm9yRWFjaCgocHJvdmlkZXIpID0+IHRyYW5zaXRpdmVNb2R1bGUuYWRkUHJvdmlkZXIocHJvdmlkZXIsIGNvbXBpbGVNZXRhICEudHlwZSkpO1xuICAgIHRyYW5zaXRpdmVNb2R1bGUuYWRkTW9kdWxlKGNvbXBpbGVNZXRhLnR5cGUpO1xuICAgIHRoaXMuX25nTW9kdWxlQ2FjaGUuc2V0KG1vZHVsZVR5cGUsIGNvbXBpbGVNZXRhKTtcbiAgICByZXR1cm4gY29tcGlsZU1ldGE7XG4gIH1cblxuICBwcml2YXRlIF9jaGVja1NlbGZJbXBvcnQobW9kdWxlVHlwZTogVHlwZSwgaW1wb3J0ZWRNb2R1bGVUeXBlOiBUeXBlKTogYm9vbGVhbiB7XG4gICAgaWYgKG1vZHVsZVR5cGUgPT09IGltcG9ydGVkTW9kdWxlVHlwZSkge1xuICAgICAgdGhpcy5fcmVwb3J0RXJyb3IoXG4gICAgICAgICAgc3ludGF4RXJyb3IoYCcke3N0cmluZ2lmeVR5cGUobW9kdWxlVHlwZSl9JyBtb2R1bGUgY2FuJ3QgaW1wb3J0IGl0c2VsZmApLCBtb2R1bGVUeXBlKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwcml2YXRlIF9nZXRUeXBlRGVzY3JpcHRvcih0eXBlOiBUeXBlKTogc3RyaW5nIHtcbiAgICBpZiAoaXNWYWxpZFR5cGUodHlwZSkpIHtcbiAgICAgIGlmICh0aGlzLmlzRGlyZWN0aXZlKHR5cGUpKSB7XG4gICAgICAgIHJldHVybiAnZGlyZWN0aXZlJztcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuaXNQaXBlKHR5cGUpKSB7XG4gICAgICAgIHJldHVybiAncGlwZSc7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmlzTmdNb2R1bGUodHlwZSkpIHtcbiAgICAgICAgcmV0dXJuICdtb2R1bGUnO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICgodHlwZSBhcyBhbnkpLnByb3ZpZGUpIHtcbiAgICAgIHJldHVybiAncHJvdmlkZXInO1xuICAgIH1cblxuICAgIHJldHVybiAndmFsdWUnO1xuICB9XG5cblxuICBwcml2YXRlIF9hZGRUeXBlVG9Nb2R1bGUodHlwZTogVHlwZSwgbW9kdWxlVHlwZTogVHlwZSkge1xuICAgIGNvbnN0IG9sZE1vZHVsZSA9IHRoaXMuX25nTW9kdWxlT2ZUeXBlcy5nZXQodHlwZSk7XG4gICAgaWYgKG9sZE1vZHVsZSAmJiBvbGRNb2R1bGUgIT09IG1vZHVsZVR5cGUpIHtcbiAgICAgIHRoaXMuX3JlcG9ydEVycm9yKFxuICAgICAgICAgIHN5bnRheEVycm9yKFxuICAgICAgICAgICAgICBgVHlwZSAke3N0cmluZ2lmeVR5cGUodHlwZSl9IGlzIHBhcnQgb2YgdGhlIGRlY2xhcmF0aW9ucyBvZiAyIG1vZHVsZXM6ICR7c3RyaW5naWZ5VHlwZShvbGRNb2R1bGUpfSBhbmQgJHtzdHJpbmdpZnlUeXBlKG1vZHVsZVR5cGUpfSEgYCArXG4gICAgICAgICAgICAgIGBQbGVhc2UgY29uc2lkZXIgbW92aW5nICR7c3RyaW5naWZ5VHlwZSh0eXBlKX0gdG8gYSBoaWdoZXIgbW9kdWxlIHRoYXQgaW1wb3J0cyAke3N0cmluZ2lmeVR5cGUob2xkTW9kdWxlKX0gYW5kICR7c3RyaW5naWZ5VHlwZShtb2R1bGVUeXBlKX0uIGAgK1xuICAgICAgICAgICAgICBgWW91IGNhbiBhbHNvIGNyZWF0ZSBhIG5ldyBOZ01vZHVsZSB0aGF0IGV4cG9ydHMgYW5kIGluY2x1ZGVzICR7c3RyaW5naWZ5VHlwZSh0eXBlKX0gdGhlbiBpbXBvcnQgdGhhdCBOZ01vZHVsZSBpbiAke3N0cmluZ2lmeVR5cGUob2xkTW9kdWxlKX0gYW5kICR7c3RyaW5naWZ5VHlwZShtb2R1bGVUeXBlKX0uYCksXG4gICAgICAgICAgbW9kdWxlVHlwZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX25nTW9kdWxlT2ZUeXBlcy5zZXQodHlwZSwgbW9kdWxlVHlwZSk7XG4gIH1cblxuICBwcml2YXRlIF9nZXRUcmFuc2l0aXZlTmdNb2R1bGVNZXRhZGF0YShcbiAgICAgIGltcG9ydGVkTW9kdWxlczogY3BsLkNvbXBpbGVOZ01vZHVsZVN1bW1hcnlbXSxcbiAgICAgIGV4cG9ydGVkTW9kdWxlczogY3BsLkNvbXBpbGVOZ01vZHVsZVN1bW1hcnlbXSk6IGNwbC5UcmFuc2l0aXZlQ29tcGlsZU5nTW9kdWxlTWV0YWRhdGEge1xuICAgIC8vIGNvbGxlY3QgYHByb3ZpZGVyc2AgLyBgZW50cnlDb21wb25lbnRzYCBmcm9tIGFsbCBpbXBvcnRlZCBhbmQgYWxsIGV4cG9ydGVkIG1vZHVsZXNcbiAgICBjb25zdCByZXN1bHQgPSBuZXcgY3BsLlRyYW5zaXRpdmVDb21waWxlTmdNb2R1bGVNZXRhZGF0YSgpO1xuICAgIGNvbnN0IG1vZHVsZXNCeVRva2VuID0gbmV3IE1hcDxhbnksIFNldDxhbnk+PigpO1xuICAgIGltcG9ydGVkTW9kdWxlcy5jb25jYXQoZXhwb3J0ZWRNb2R1bGVzKS5mb3JFYWNoKChtb2RTdW1tYXJ5KSA9PiB7XG4gICAgICBtb2RTdW1tYXJ5Lm1vZHVsZXMuZm9yRWFjaCgobW9kKSA9PiByZXN1bHQuYWRkTW9kdWxlKG1vZCkpO1xuICAgICAgbW9kU3VtbWFyeS5lbnRyeUNvbXBvbmVudHMuZm9yRWFjaCgoY29tcCkgPT4gcmVzdWx0LmFkZEVudHJ5Q29tcG9uZW50KGNvbXApKTtcbiAgICAgIGNvbnN0IGFkZGVkVG9rZW5zID0gbmV3IFNldDxhbnk+KCk7XG4gICAgICBtb2RTdW1tYXJ5LnByb3ZpZGVycy5mb3JFYWNoKChlbnRyeSkgPT4ge1xuICAgICAgICBjb25zdCB0b2tlblJlZiA9IGNwbC50b2tlblJlZmVyZW5jZShlbnRyeS5wcm92aWRlci50b2tlbik7XG4gICAgICAgIGxldCBwcmV2TW9kdWxlcyA9IG1vZHVsZXNCeVRva2VuLmdldCh0b2tlblJlZik7XG4gICAgICAgIGlmICghcHJldk1vZHVsZXMpIHtcbiAgICAgICAgICBwcmV2TW9kdWxlcyA9IG5ldyBTZXQ8YW55PigpO1xuICAgICAgICAgIG1vZHVsZXNCeVRva2VuLnNldCh0b2tlblJlZiwgcHJldk1vZHVsZXMpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG1vZHVsZVJlZiA9IGVudHJ5Lm1vZHVsZS5yZWZlcmVuY2U7XG4gICAgICAgIC8vIE5vdGU6IHRoZSBwcm92aWRlcnMgb2Ygb25lIG1vZHVsZSBtYXkgc3RpbGwgY29udGFpbiBtdWx0aXBsZSBwcm92aWRlcnNcbiAgICAgICAgLy8gcGVyIHRva2VuIChlLmcuIGZvciBtdWx0aSBwcm92aWRlcnMpLCBhbmQgd2UgbmVlZCB0byBwcmVzZXJ2ZSB0aGVzZS5cbiAgICAgICAgaWYgKGFkZGVkVG9rZW5zLmhhcyh0b2tlblJlZikgfHwgIXByZXZNb2R1bGVzLmhhcyhtb2R1bGVSZWYpKSB7XG4gICAgICAgICAgcHJldk1vZHVsZXMuYWRkKG1vZHVsZVJlZik7XG4gICAgICAgICAgYWRkZWRUb2tlbnMuYWRkKHRva2VuUmVmKTtcbiAgICAgICAgICByZXN1bHQuYWRkUHJvdmlkZXIoZW50cnkucHJvdmlkZXIsIGVudHJ5Lm1vZHVsZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGV4cG9ydGVkTW9kdWxlcy5mb3JFYWNoKChtb2RTdW1tYXJ5KSA9PiB7XG4gICAgICBtb2RTdW1tYXJ5LmV4cG9ydGVkRGlyZWN0aXZlcy5mb3JFYWNoKChpZCkgPT4gcmVzdWx0LmFkZEV4cG9ydGVkRGlyZWN0aXZlKGlkKSk7XG4gICAgICBtb2RTdW1tYXJ5LmV4cG9ydGVkUGlwZXMuZm9yRWFjaCgoaWQpID0+IHJlc3VsdC5hZGRFeHBvcnRlZFBpcGUoaWQpKTtcbiAgICB9KTtcbiAgICBpbXBvcnRlZE1vZHVsZXMuZm9yRWFjaCgobW9kU3VtbWFyeSkgPT4ge1xuICAgICAgbW9kU3VtbWFyeS5leHBvcnRlZERpcmVjdGl2ZXMuZm9yRWFjaCgoaWQpID0+IHJlc3VsdC5hZGREaXJlY3RpdmUoaWQpKTtcbiAgICAgIG1vZFN1bW1hcnkuZXhwb3J0ZWRQaXBlcy5mb3JFYWNoKChpZCkgPT4gcmVzdWx0LmFkZFBpcGUoaWQpKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0SWRlbnRpZmllck1ldGFkYXRhKHR5cGU6IFR5cGUpOiBjcGwuQ29tcGlsZUlkZW50aWZpZXJNZXRhZGF0YSB7XG4gICAgdHlwZSA9IHJlc29sdmVGb3J3YXJkUmVmKHR5cGUpO1xuICAgIHJldHVybiB7cmVmZXJlbmNlOiB0eXBlfTtcbiAgfVxuXG4gIGlzSW5qZWN0YWJsZSh0eXBlOiBhbnkpOiBib29sZWFuIHtcbiAgICBjb25zdCBhbm5vdGF0aW9ucyA9IHRoaXMuX3JlZmxlY3Rvci50cnlBbm5vdGF0aW9ucyh0eXBlKTtcbiAgICByZXR1cm4gYW5ub3RhdGlvbnMuc29tZShhbm4gPT4gY3JlYXRlSW5qZWN0YWJsZS5pc1R5cGVPZihhbm4pKTtcbiAgfVxuXG4gIGdldEluamVjdGFibGVTdW1tYXJ5KHR5cGU6IGFueSk6IGNwbC5Db21waWxlVHlwZVN1bW1hcnkge1xuICAgIHJldHVybiB7XG4gICAgICBzdW1tYXJ5S2luZDogY3BsLkNvbXBpbGVTdW1tYXJ5S2luZC5JbmplY3RhYmxlLFxuICAgICAgdHlwZTogdGhpcy5fZ2V0VHlwZU1ldGFkYXRhKHR5cGUsIG51bGwsIGZhbHNlKVxuICAgIH07XG4gIH1cblxuICBnZXRJbmplY3RhYmxlTWV0YWRhdGEoXG4gICAgICB0eXBlOiBhbnksIGRlcGVuZGVuY2llczogYW55W118bnVsbCA9IG51bGwsXG4gICAgICB0aHJvd09uVW5rbm93bkRlcHM6IGJvb2xlYW4gPSB0cnVlKTogY3BsLkNvbXBpbGVJbmplY3RhYmxlTWV0YWRhdGF8bnVsbCB7XG4gICAgY29uc3QgdHlwZVN1bW1hcnkgPSB0aGlzLl9sb2FkU3VtbWFyeSh0eXBlLCBjcGwuQ29tcGlsZVN1bW1hcnlLaW5kLkluamVjdGFibGUpO1xuICAgIGNvbnN0IHR5cGVNZXRhZGF0YSA9IHR5cGVTdW1tYXJ5ID9cbiAgICAgICAgdHlwZVN1bW1hcnkudHlwZSA6XG4gICAgICAgIHRoaXMuX2dldFR5cGVNZXRhZGF0YSh0eXBlLCBkZXBlbmRlbmNpZXMsIHRocm93T25Vbmtub3duRGVwcyk7XG5cbiAgICBjb25zdCBhbm5vdGF0aW9uczogSW5qZWN0YWJsZVtdID1cbiAgICAgICAgdGhpcy5fcmVmbGVjdG9yLmFubm90YXRpb25zKHR5cGUpLmZpbHRlcihhbm4gPT4gY3JlYXRlSW5qZWN0YWJsZS5pc1R5cGVPZihhbm4pKTtcblxuICAgIGlmIChhbm5vdGF0aW9ucy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IG1ldGEgPSBhbm5vdGF0aW9uc1thbm5vdGF0aW9ucy5sZW5ndGggLSAxXTtcbiAgICByZXR1cm4ge1xuICAgICAgc3ltYm9sOiB0eXBlLFxuICAgICAgdHlwZTogdHlwZU1ldGFkYXRhLFxuICAgICAgcHJvdmlkZWRJbjogbWV0YS5wcm92aWRlZEluLFxuICAgICAgdXNlVmFsdWU6IG1ldGEudXNlVmFsdWUsXG4gICAgICB1c2VDbGFzczogbWV0YS51c2VDbGFzcyxcbiAgICAgIHVzZUV4aXN0aW5nOiBtZXRhLnVzZUV4aXN0aW5nLFxuICAgICAgdXNlRmFjdG9yeTogbWV0YS51c2VGYWN0b3J5LFxuICAgICAgZGVwczogbWV0YS5kZXBzLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIF9nZXRUeXBlTWV0YWRhdGEodHlwZTogVHlwZSwgZGVwZW5kZW5jaWVzOiBhbnlbXXxudWxsID0gbnVsbCwgdGhyb3dPblVua25vd25EZXBzID0gdHJ1ZSk6XG4gICAgICBjcGwuQ29tcGlsZVR5cGVNZXRhZGF0YSB7XG4gICAgY29uc3QgaWRlbnRpZmllciA9IHRoaXMuX2dldElkZW50aWZpZXJNZXRhZGF0YSh0eXBlKTtcbiAgICByZXR1cm4ge1xuICAgICAgcmVmZXJlbmNlOiBpZGVudGlmaWVyLnJlZmVyZW5jZSxcbiAgICAgIGRpRGVwczogdGhpcy5fZ2V0RGVwZW5kZW5jaWVzTWV0YWRhdGEoaWRlbnRpZmllci5yZWZlcmVuY2UsIGRlcGVuZGVuY2llcywgdGhyb3dPblVua25vd25EZXBzKSxcbiAgICAgIGxpZmVjeWNsZUhvb2tzOiBnZXRBbGxMaWZlY3ljbGVIb29rcyh0aGlzLl9yZWZsZWN0b3IsIGlkZW50aWZpZXIucmVmZXJlbmNlKSxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0RmFjdG9yeU1ldGFkYXRhKGZhY3Rvcnk6IEZ1bmN0aW9uLCBkZXBlbmRlbmNpZXM6IGFueVtdfG51bGwgPSBudWxsKTpcbiAgICAgIGNwbC5Db21waWxlRmFjdG9yeU1ldGFkYXRhIHtcbiAgICBmYWN0b3J5ID0gcmVzb2x2ZUZvcndhcmRSZWYoZmFjdG9yeSk7XG4gICAgcmV0dXJuIHtyZWZlcmVuY2U6IGZhY3RvcnksIGRpRGVwczogdGhpcy5fZ2V0RGVwZW5kZW5jaWVzTWV0YWRhdGEoZmFjdG9yeSwgZGVwZW5kZW5jaWVzKX07XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgbWV0YWRhdGEgZm9yIHRoZSBnaXZlbiBwaXBlLlxuICAgKiBUaGlzIGFzc3VtZXMgYGxvYWROZ01vZHVsZURpcmVjdGl2ZUFuZFBpcGVNZXRhZGF0YWAgaGFzIGJlZW4gY2FsbGVkIGZpcnN0LlxuICAgKi9cbiAgZ2V0UGlwZU1ldGFkYXRhKHBpcGVUeXBlOiBhbnkpOiBjcGwuQ29tcGlsZVBpcGVNZXRhZGF0YXxudWxsIHtcbiAgICBjb25zdCBwaXBlTWV0YSA9IHRoaXMuX3BpcGVDYWNoZS5nZXQocGlwZVR5cGUpO1xuICAgIGlmICghcGlwZU1ldGEpIHtcbiAgICAgIHRoaXMuX3JlcG9ydEVycm9yKFxuICAgICAgICAgIHN5bnRheEVycm9yKFxuICAgICAgICAgICAgICBgSWxsZWdhbCBzdGF0ZTogZ2V0UGlwZU1ldGFkYXRhIGNhbiBvbmx5IGJlIGNhbGxlZCBhZnRlciBsb2FkTmdNb2R1bGVEaXJlY3RpdmVBbmRQaXBlTWV0YWRhdGEgZm9yIGEgbW9kdWxlIHRoYXQgZGVjbGFyZXMgaXQuIFBpcGUgJHtzdHJpbmdpZnlUeXBlKHBpcGVUeXBlKX0uYCksXG4gICAgICAgICAgcGlwZVR5cGUpO1xuICAgIH1cbiAgICByZXR1cm4gcGlwZU1ldGEgfHwgbnVsbDtcbiAgfVxuXG4gIGdldFBpcGVTdW1tYXJ5KHBpcGVUeXBlOiBhbnkpOiBjcGwuQ29tcGlsZVBpcGVTdW1tYXJ5IHtcbiAgICBjb25zdCBwaXBlU3VtbWFyeSA9XG4gICAgICAgIDxjcGwuQ29tcGlsZVBpcGVTdW1tYXJ5PnRoaXMuX2xvYWRTdW1tYXJ5KHBpcGVUeXBlLCBjcGwuQ29tcGlsZVN1bW1hcnlLaW5kLlBpcGUpO1xuICAgIGlmICghcGlwZVN1bW1hcnkpIHtcbiAgICAgIHRoaXMuX3JlcG9ydEVycm9yKFxuICAgICAgICAgIHN5bnRheEVycm9yKFxuICAgICAgICAgICAgICBgSWxsZWdhbCBzdGF0ZTogQ291bGQgbm90IGxvYWQgdGhlIHN1bW1hcnkgZm9yIHBpcGUgJHtzdHJpbmdpZnlUeXBlKHBpcGVUeXBlKX0uYCksXG4gICAgICAgICAgcGlwZVR5cGUpO1xuICAgIH1cbiAgICByZXR1cm4gcGlwZVN1bW1hcnk7XG4gIH1cblxuICBnZXRPckxvYWRQaXBlTWV0YWRhdGEocGlwZVR5cGU6IGFueSk6IGNwbC5Db21waWxlUGlwZU1ldGFkYXRhIHtcbiAgICBsZXQgcGlwZU1ldGEgPSB0aGlzLl9waXBlQ2FjaGUuZ2V0KHBpcGVUeXBlKTtcbiAgICBpZiAoIXBpcGVNZXRhKSB7XG4gICAgICBwaXBlTWV0YSA9IHRoaXMuX2xvYWRQaXBlTWV0YWRhdGEocGlwZVR5cGUpO1xuICAgIH1cbiAgICByZXR1cm4gcGlwZU1ldGE7XG4gIH1cblxuICBwcml2YXRlIF9sb2FkUGlwZU1ldGFkYXRhKHBpcGVUeXBlOiBhbnkpOiBjcGwuQ29tcGlsZVBpcGVNZXRhZGF0YSB7XG4gICAgcGlwZVR5cGUgPSByZXNvbHZlRm9yd2FyZFJlZihwaXBlVHlwZSk7XG4gICAgY29uc3QgcGlwZUFubm90YXRpb24gPSB0aGlzLl9waXBlUmVzb2x2ZXIucmVzb2x2ZShwaXBlVHlwZSkgITtcblxuICAgIGNvbnN0IHBpcGVNZXRhID0gbmV3IGNwbC5Db21waWxlUGlwZU1ldGFkYXRhKHtcbiAgICAgIHR5cGU6IHRoaXMuX2dldFR5cGVNZXRhZGF0YShwaXBlVHlwZSksXG4gICAgICBuYW1lOiBwaXBlQW5ub3RhdGlvbi5uYW1lLFxuICAgICAgcHVyZTogISFwaXBlQW5ub3RhdGlvbi5wdXJlXG4gICAgfSk7XG4gICAgdGhpcy5fcGlwZUNhY2hlLnNldChwaXBlVHlwZSwgcGlwZU1ldGEpO1xuICAgIHRoaXMuX3N1bW1hcnlDYWNoZS5zZXQocGlwZVR5cGUsIHBpcGVNZXRhLnRvU3VtbWFyeSgpKTtcbiAgICByZXR1cm4gcGlwZU1ldGE7XG4gIH1cblxuICBwcml2YXRlIF9nZXREZXBlbmRlbmNpZXNNZXRhZGF0YShcbiAgICAgIHR5cGVPckZ1bmM6IFR5cGV8RnVuY3Rpb24sIGRlcGVuZGVuY2llczogYW55W118bnVsbCxcbiAgICAgIHRocm93T25Vbmtub3duRGVwcyA9IHRydWUpOiBjcGwuQ29tcGlsZURpRGVwZW5kZW5jeU1ldGFkYXRhW10ge1xuICAgIGxldCBoYXNVbmtub3duRGVwcyA9IGZhbHNlO1xuICAgIGNvbnN0IHBhcmFtcyA9IGRlcGVuZGVuY2llcyB8fCB0aGlzLl9yZWZsZWN0b3IucGFyYW1ldGVycyh0eXBlT3JGdW5jKSB8fCBbXTtcblxuICAgIGNvbnN0IGRlcGVuZGVuY2llc01ldGFkYXRhOiBjcGwuQ29tcGlsZURpRGVwZW5kZW5jeU1ldGFkYXRhW10gPSBwYXJhbXMubWFwKChwYXJhbSkgPT4ge1xuICAgICAgbGV0IGlzQXR0cmlidXRlID0gZmFsc2U7XG4gICAgICBsZXQgaXNIb3N0ID0gZmFsc2U7XG4gICAgICBsZXQgaXNTZWxmID0gZmFsc2U7XG4gICAgICBsZXQgaXNTa2lwU2VsZiA9IGZhbHNlO1xuICAgICAgbGV0IGlzT3B0aW9uYWwgPSBmYWxzZTtcbiAgICAgIGxldCB0b2tlbjogYW55ID0gbnVsbDtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHBhcmFtKSkge1xuICAgICAgICBwYXJhbS5mb3JFYWNoKChwYXJhbUVudHJ5KSA9PiB7XG4gICAgICAgICAgaWYgKGNyZWF0ZUhvc3QuaXNUeXBlT2YocGFyYW1FbnRyeSkpIHtcbiAgICAgICAgICAgIGlzSG9zdCA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIGlmIChjcmVhdGVTZWxmLmlzVHlwZU9mKHBhcmFtRW50cnkpKSB7XG4gICAgICAgICAgICBpc1NlbGYgPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSBpZiAoY3JlYXRlU2tpcFNlbGYuaXNUeXBlT2YocGFyYW1FbnRyeSkpIHtcbiAgICAgICAgICAgIGlzU2tpcFNlbGYgPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSBpZiAoY3JlYXRlT3B0aW9uYWwuaXNUeXBlT2YocGFyYW1FbnRyeSkpIHtcbiAgICAgICAgICAgIGlzT3B0aW9uYWwgPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSBpZiAoY3JlYXRlQXR0cmlidXRlLmlzVHlwZU9mKHBhcmFtRW50cnkpKSB7XG4gICAgICAgICAgICBpc0F0dHJpYnV0ZSA9IHRydWU7XG4gICAgICAgICAgICB0b2tlbiA9IHBhcmFtRW50cnkuYXR0cmlidXRlTmFtZTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGNyZWF0ZUluamVjdC5pc1R5cGVPZihwYXJhbUVudHJ5KSkge1xuICAgICAgICAgICAgdG9rZW4gPSBwYXJhbUVudHJ5LnRva2VuO1xuICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgIGNyZWF0ZUluamVjdGlvblRva2VuLmlzVHlwZU9mKHBhcmFtRW50cnkpIHx8IHBhcmFtRW50cnkgaW5zdGFuY2VvZiBTdGF0aWNTeW1ib2wpIHtcbiAgICAgICAgICAgIHRva2VuID0gcGFyYW1FbnRyeTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGlzVmFsaWRUeXBlKHBhcmFtRW50cnkpICYmIHRva2VuID09IG51bGwpIHtcbiAgICAgICAgICAgIHRva2VuID0gcGFyYW1FbnRyeTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdG9rZW4gPSBwYXJhbTtcbiAgICAgIH1cbiAgICAgIGlmICh0b2tlbiA9PSBudWxsKSB7XG4gICAgICAgIGhhc1Vua25vd25EZXBzID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBpc0F0dHJpYnV0ZSxcbiAgICAgICAgaXNIb3N0LFxuICAgICAgICBpc1NlbGYsXG4gICAgICAgIGlzU2tpcFNlbGYsXG4gICAgICAgIGlzT3B0aW9uYWwsXG4gICAgICAgIHRva2VuOiB0aGlzLl9nZXRUb2tlbk1ldGFkYXRhKHRva2VuKVxuICAgICAgfTtcblxuICAgIH0pO1xuXG4gICAgaWYgKGhhc1Vua25vd25EZXBzKSB7XG4gICAgICBjb25zdCBkZXBzVG9rZW5zID1cbiAgICAgICAgICBkZXBlbmRlbmNpZXNNZXRhZGF0YS5tYXAoKGRlcCkgPT4gZGVwLnRva2VuID8gc3RyaW5naWZ5VHlwZShkZXAudG9rZW4pIDogJz8nKS5qb2luKCcsICcpO1xuICAgICAgY29uc3QgbWVzc2FnZSA9XG4gICAgICAgICAgYENhbid0IHJlc29sdmUgYWxsIHBhcmFtZXRlcnMgZm9yICR7c3RyaW5naWZ5VHlwZSh0eXBlT3JGdW5jKX06ICgke2RlcHNUb2tlbnN9KS5gO1xuICAgICAgaWYgKHRocm93T25Vbmtub3duRGVwcyB8fCB0aGlzLl9jb25maWcuc3RyaWN0SW5qZWN0aW9uUGFyYW1ldGVycykge1xuICAgICAgICB0aGlzLl9yZXBvcnRFcnJvcihzeW50YXhFcnJvcihtZXNzYWdlKSwgdHlwZU9yRnVuYyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9jb25zb2xlLndhcm4oYFdhcm5pbmc6ICR7bWVzc2FnZX0gVGhpcyB3aWxsIGJlY29tZSBhbiBlcnJvciBpbiBBbmd1bGFyIHY2LnhgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGVwZW5kZW5jaWVzTWV0YWRhdGE7XG4gIH1cblxuICBwcml2YXRlIF9nZXRUb2tlbk1ldGFkYXRhKHRva2VuOiBhbnkpOiBjcGwuQ29tcGlsZVRva2VuTWV0YWRhdGEge1xuICAgIHRva2VuID0gcmVzb2x2ZUZvcndhcmRSZWYodG9rZW4pO1xuICAgIGxldCBjb21waWxlVG9rZW46IGNwbC5Db21waWxlVG9rZW5NZXRhZGF0YTtcbiAgICBpZiAodHlwZW9mIHRva2VuID09PSAnc3RyaW5nJykge1xuICAgICAgY29tcGlsZVRva2VuID0ge3ZhbHVlOiB0b2tlbn07XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbXBpbGVUb2tlbiA9IHtpZGVudGlmaWVyOiB7cmVmZXJlbmNlOiB0b2tlbn19O1xuICAgIH1cbiAgICByZXR1cm4gY29tcGlsZVRva2VuO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0UHJvdmlkZXJzTWV0YWRhdGEoXG4gICAgICBwcm92aWRlcnM6IFByb3ZpZGVyW10sIHRhcmdldEVudHJ5Q29tcG9uZW50czogY3BsLkNvbXBpbGVFbnRyeUNvbXBvbmVudE1ldGFkYXRhW10sXG4gICAgICBkZWJ1Z0luZm8/OiBzdHJpbmcsIGNvbXBpbGVQcm92aWRlcnM6IGNwbC5Db21waWxlUHJvdmlkZXJNZXRhZGF0YVtdID0gW10sXG4gICAgICB0eXBlPzogYW55KTogY3BsLkNvbXBpbGVQcm92aWRlck1ldGFkYXRhW10ge1xuICAgIHByb3ZpZGVycy5mb3JFYWNoKChwcm92aWRlcjogYW55LCBwcm92aWRlcklkeDogbnVtYmVyKSA9PiB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShwcm92aWRlcikpIHtcbiAgICAgICAgdGhpcy5fZ2V0UHJvdmlkZXJzTWV0YWRhdGEocHJvdmlkZXIsIHRhcmdldEVudHJ5Q29tcG9uZW50cywgZGVidWdJbmZvLCBjb21waWxlUHJvdmlkZXJzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByb3ZpZGVyID0gcmVzb2x2ZUZvcndhcmRSZWYocHJvdmlkZXIpO1xuICAgICAgICBsZXQgcHJvdmlkZXJNZXRhOiBjcGwuUHJvdmlkZXJNZXRhID0gdW5kZWZpbmVkICE7XG4gICAgICAgIGlmIChwcm92aWRlciAmJiB0eXBlb2YgcHJvdmlkZXIgPT09ICdvYmplY3QnICYmIHByb3ZpZGVyLmhhc093blByb3BlcnR5KCdwcm92aWRlJykpIHtcbiAgICAgICAgICB0aGlzLl92YWxpZGF0ZVByb3ZpZGVyKHByb3ZpZGVyKTtcbiAgICAgICAgICBwcm92aWRlck1ldGEgPSBuZXcgY3BsLlByb3ZpZGVyTWV0YShwcm92aWRlci5wcm92aWRlLCBwcm92aWRlcik7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNWYWxpZFR5cGUocHJvdmlkZXIpKSB7XG4gICAgICAgICAgcHJvdmlkZXJNZXRhID0gbmV3IGNwbC5Qcm92aWRlck1ldGEocHJvdmlkZXIsIHt1c2VDbGFzczogcHJvdmlkZXJ9KTtcbiAgICAgICAgfSBlbHNlIGlmIChwcm92aWRlciA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgdGhpcy5fcmVwb3J0RXJyb3Ioc3ludGF4RXJyb3IoXG4gICAgICAgICAgICAgIGBFbmNvdW50ZXJlZCB1bmRlZmluZWQgcHJvdmlkZXIhIFVzdWFsbHkgdGhpcyBtZWFucyB5b3UgaGF2ZSBhIGNpcmN1bGFyIGRlcGVuZGVuY2llcy4gVGhpcyBtaWdodCBiZSBjYXVzZWQgYnkgdXNpbmcgJ2JhcnJlbCcgaW5kZXgudHMgZmlsZXMuYCkpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBwcm92aWRlcnNJbmZvID1cbiAgICAgICAgICAgICAgKDxzdHJpbmdbXT5wcm92aWRlcnMucmVkdWNlKFxuICAgICAgICAgICAgICAgICAgIChzb0Zhcjogc3RyaW5nW10sIHNlZW5Qcm92aWRlcjogYW55LCBzZWVuUHJvdmlkZXJJZHg6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgaWYgKHNlZW5Qcm92aWRlcklkeCA8IHByb3ZpZGVySWR4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgIHNvRmFyLnB1c2goYCR7c3RyaW5naWZ5VHlwZShzZWVuUHJvdmlkZXIpfWApO1xuICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzZWVuUHJvdmlkZXJJZHggPT0gcHJvdmlkZXJJZHgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgc29GYXIucHVzaChgPyR7c3RyaW5naWZ5VHlwZShzZWVuUHJvdmlkZXIpfT9gKTtcbiAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2VlblByb3ZpZGVySWR4ID09IHByb3ZpZGVySWR4ICsgMSkge1xuICAgICAgICAgICAgICAgICAgICAgICBzb0Zhci5wdXNoKCcuLi4nKTtcbiAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzb0ZhcjtcbiAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgIFtdKSlcbiAgICAgICAgICAgICAgICAgIC5qb2luKCcsICcpO1xuICAgICAgICAgIHRoaXMuX3JlcG9ydEVycm9yKFxuICAgICAgICAgICAgICBzeW50YXhFcnJvcihcbiAgICAgICAgICAgICAgICAgIGBJbnZhbGlkICR7ZGVidWdJbmZvID8gZGVidWdJbmZvIDogJ3Byb3ZpZGVyJ30gLSBvbmx5IGluc3RhbmNlcyBvZiBQcm92aWRlciBhbmQgVHlwZSBhcmUgYWxsb3dlZCwgZ290OiBbJHtwcm92aWRlcnNJbmZvfV1gKSxcbiAgICAgICAgICAgICAgdHlwZSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm92aWRlck1ldGEudG9rZW4gPT09XG4gICAgICAgICAgICB0aGlzLl9yZWZsZWN0b3IucmVzb2x2ZUV4dGVybmFsUmVmZXJlbmNlKElkZW50aWZpZXJzLkFOQUxZWkVfRk9SX0VOVFJZX0NPTVBPTkVOVFMpKSB7XG4gICAgICAgICAgdGFyZ2V0RW50cnlDb21wb25lbnRzLnB1c2goLi4udGhpcy5fZ2V0RW50cnlDb21wb25lbnRzRnJvbVByb3ZpZGVyKHByb3ZpZGVyTWV0YSwgdHlwZSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbXBpbGVQcm92aWRlcnMucHVzaCh0aGlzLmdldFByb3ZpZGVyTWV0YWRhdGEocHJvdmlkZXJNZXRhKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gY29tcGlsZVByb3ZpZGVycztcbiAgfVxuXG4gIHByaXZhdGUgX3ZhbGlkYXRlUHJvdmlkZXIocHJvdmlkZXI6IGFueSk6IHZvaWQge1xuICAgIGlmIChwcm92aWRlci5oYXNPd25Qcm9wZXJ0eSgndXNlQ2xhc3MnKSAmJiBwcm92aWRlci51c2VDbGFzcyA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9yZXBvcnRFcnJvcihzeW50YXhFcnJvcihcbiAgICAgICAgICBgSW52YWxpZCBwcm92aWRlciBmb3IgJHtzdHJpbmdpZnlUeXBlKHByb3ZpZGVyLnByb3ZpZGUpfS4gdXNlQ2xhc3MgY2Fubm90IGJlICR7cHJvdmlkZXIudXNlQ2xhc3N9LlxuICAgICAgICAgICBVc3VhbGx5IGl0IGhhcHBlbnMgd2hlbjpcbiAgICAgICAgICAgMS4gVGhlcmUncyBhIGNpcmN1bGFyIGRlcGVuZGVuY3kgKG1pZ2h0IGJlIGNhdXNlZCBieSB1c2luZyBpbmRleC50cyAoYmFycmVsKSBmaWxlcykuXG4gICAgICAgICAgIDIuIENsYXNzIHdhcyB1c2VkIGJlZm9yZSBpdCB3YXMgZGVjbGFyZWQuIFVzZSBmb3J3YXJkUmVmIGluIHRoaXMgY2FzZS5gKSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0RW50cnlDb21wb25lbnRzRnJvbVByb3ZpZGVyKHByb3ZpZGVyOiBjcGwuUHJvdmlkZXJNZXRhLCB0eXBlPzogYW55KTpcbiAgICAgIGNwbC5Db21waWxlRW50cnlDb21wb25lbnRNZXRhZGF0YVtdIHtcbiAgICBjb25zdCBjb21wb25lbnRzOiBjcGwuQ29tcGlsZUVudHJ5Q29tcG9uZW50TWV0YWRhdGFbXSA9IFtdO1xuICAgIGNvbnN0IGNvbGxlY3RlZElkZW50aWZpZXJzOiBjcGwuQ29tcGlsZUlkZW50aWZpZXJNZXRhZGF0YVtdID0gW107XG5cbiAgICBpZiAocHJvdmlkZXIudXNlRmFjdG9yeSB8fCBwcm92aWRlci51c2VFeGlzdGluZyB8fCBwcm92aWRlci51c2VDbGFzcykge1xuICAgICAgdGhpcy5fcmVwb3J0RXJyb3IoXG4gICAgICAgICAgc3ludGF4RXJyb3IoYFRoZSBBTkFMWVpFX0ZPUl9FTlRSWV9DT01QT05FTlRTIHRva2VuIG9ubHkgc3VwcG9ydHMgdXNlVmFsdWUhYCksIHR5cGUpO1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGlmICghcHJvdmlkZXIubXVsdGkpIHtcbiAgICAgIHRoaXMuX3JlcG9ydEVycm9yKFxuICAgICAgICAgIHN5bnRheEVycm9yKGBUaGUgQU5BTFlaRV9GT1JfRU5UUllfQ09NUE9ORU5UUyB0b2tlbiBvbmx5IHN1cHBvcnRzICdtdWx0aSA9IHRydWUnIWApLFxuICAgICAgICAgIHR5cGUpO1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGV4dHJhY3RJZGVudGlmaWVycyhwcm92aWRlci51c2VWYWx1ZSwgY29sbGVjdGVkSWRlbnRpZmllcnMpO1xuICAgIGNvbGxlY3RlZElkZW50aWZpZXJzLmZvckVhY2goKGlkZW50aWZpZXIpID0+IHtcbiAgICAgIGNvbnN0IGVudHJ5ID0gdGhpcy5fZ2V0RW50cnlDb21wb25lbnRNZXRhZGF0YShpZGVudGlmaWVyLnJlZmVyZW5jZSwgZmFsc2UpO1xuICAgICAgaWYgKGVudHJ5KSB7XG4gICAgICAgIGNvbXBvbmVudHMucHVzaChlbnRyeSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGNvbXBvbmVudHM7XG4gIH1cblxuICBwcml2YXRlIF9nZXRFbnRyeUNvbXBvbmVudE1ldGFkYXRhKGRpclR5cGU6IGFueSwgdGhyb3dJZk5vdEZvdW5kID0gdHJ1ZSk6XG4gICAgICBjcGwuQ29tcGlsZUVudHJ5Q29tcG9uZW50TWV0YWRhdGF8bnVsbCB7XG4gICAgY29uc3QgZGlyTWV0YSA9IHRoaXMuZ2V0Tm9uTm9ybWFsaXplZERpcmVjdGl2ZU1ldGFkYXRhKGRpclR5cGUpO1xuICAgIGlmIChkaXJNZXRhICYmIGRpck1ldGEubWV0YWRhdGEuaXNDb21wb25lbnQpIHtcbiAgICAgIHJldHVybiB7Y29tcG9uZW50VHlwZTogZGlyVHlwZSwgY29tcG9uZW50RmFjdG9yeTogZGlyTWV0YS5tZXRhZGF0YS5jb21wb25lbnRGYWN0b3J5ICF9O1xuICAgIH1cbiAgICBjb25zdCBkaXJTdW1tYXJ5ID1cbiAgICAgICAgPGNwbC5Db21waWxlRGlyZWN0aXZlU3VtbWFyeT50aGlzLl9sb2FkU3VtbWFyeShkaXJUeXBlLCBjcGwuQ29tcGlsZVN1bW1hcnlLaW5kLkRpcmVjdGl2ZSk7XG4gICAgaWYgKGRpclN1bW1hcnkgJiYgZGlyU3VtbWFyeS5pc0NvbXBvbmVudCkge1xuICAgICAgcmV0dXJuIHtjb21wb25lbnRUeXBlOiBkaXJUeXBlLCBjb21wb25lbnRGYWN0b3J5OiBkaXJTdW1tYXJ5LmNvbXBvbmVudEZhY3RvcnkgIX07XG4gICAgfVxuICAgIGlmICh0aHJvd0lmTm90Rm91bmQpIHtcbiAgICAgIHRocm93IHN5bnRheEVycm9yKGAke2RpclR5cGUubmFtZX0gY2Fubm90IGJlIHVzZWQgYXMgYW4gZW50cnkgY29tcG9uZW50LmApO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgX2dldEluamVjdGFibGVUeXBlTWV0YWRhdGEodHlwZTogVHlwZSwgZGVwZW5kZW5jaWVzOiBhbnlbXXxudWxsID0gbnVsbCk6XG4gICAgICBjcGwuQ29tcGlsZVR5cGVNZXRhZGF0YSB7XG4gICAgY29uc3QgdHlwZVN1bW1hcnkgPSB0aGlzLl9sb2FkU3VtbWFyeSh0eXBlLCBjcGwuQ29tcGlsZVN1bW1hcnlLaW5kLkluamVjdGFibGUpO1xuICAgIGlmICh0eXBlU3VtbWFyeSkge1xuICAgICAgcmV0dXJuIHR5cGVTdW1tYXJ5LnR5cGU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9nZXRUeXBlTWV0YWRhdGEodHlwZSwgZGVwZW5kZW5jaWVzKTtcbiAgfVxuXG4gIGdldFByb3ZpZGVyTWV0YWRhdGEocHJvdmlkZXI6IGNwbC5Qcm92aWRlck1ldGEpOiBjcGwuQ29tcGlsZVByb3ZpZGVyTWV0YWRhdGEge1xuICAgIGxldCBjb21waWxlRGVwczogY3BsLkNvbXBpbGVEaURlcGVuZGVuY3lNZXRhZGF0YVtdID0gdW5kZWZpbmVkICE7XG4gICAgbGV0IGNvbXBpbGVUeXBlTWV0YWRhdGE6IGNwbC5Db21waWxlVHlwZU1ldGFkYXRhID0gbnVsbCAhO1xuICAgIGxldCBjb21waWxlRmFjdG9yeU1ldGFkYXRhOiBjcGwuQ29tcGlsZUZhY3RvcnlNZXRhZGF0YSA9IG51bGwgITtcbiAgICBsZXQgdG9rZW46IGNwbC5Db21waWxlVG9rZW5NZXRhZGF0YSA9IHRoaXMuX2dldFRva2VuTWV0YWRhdGEocHJvdmlkZXIudG9rZW4pO1xuXG4gICAgaWYgKHByb3ZpZGVyLnVzZUNsYXNzKSB7XG4gICAgICBjb21waWxlVHlwZU1ldGFkYXRhID1cbiAgICAgICAgICB0aGlzLl9nZXRJbmplY3RhYmxlVHlwZU1ldGFkYXRhKHByb3ZpZGVyLnVzZUNsYXNzLCBwcm92aWRlci5kZXBlbmRlbmNpZXMpO1xuICAgICAgY29tcGlsZURlcHMgPSBjb21waWxlVHlwZU1ldGFkYXRhLmRpRGVwcztcbiAgICAgIGlmIChwcm92aWRlci50b2tlbiA9PT0gcHJvdmlkZXIudXNlQ2xhc3MpIHtcbiAgICAgICAgLy8gdXNlIHRoZSBjb21waWxlVHlwZU1ldGFkYXRhIGFzIGl0IGNvbnRhaW5zIGluZm9ybWF0aW9uIGFib3V0IGxpZmVjeWNsZUhvb2tzLi4uXG4gICAgICAgIHRva2VuID0ge2lkZW50aWZpZXI6IGNvbXBpbGVUeXBlTWV0YWRhdGF9O1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAocHJvdmlkZXIudXNlRmFjdG9yeSkge1xuICAgICAgY29tcGlsZUZhY3RvcnlNZXRhZGF0YSA9IHRoaXMuX2dldEZhY3RvcnlNZXRhZGF0YShwcm92aWRlci51c2VGYWN0b3J5LCBwcm92aWRlci5kZXBlbmRlbmNpZXMpO1xuICAgICAgY29tcGlsZURlcHMgPSBjb21waWxlRmFjdG9yeU1ldGFkYXRhLmRpRGVwcztcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgdG9rZW46IHRva2VuLFxuICAgICAgdXNlQ2xhc3M6IGNvbXBpbGVUeXBlTWV0YWRhdGEsXG4gICAgICB1c2VWYWx1ZTogcHJvdmlkZXIudXNlVmFsdWUsXG4gICAgICB1c2VGYWN0b3J5OiBjb21waWxlRmFjdG9yeU1ldGFkYXRhLFxuICAgICAgdXNlRXhpc3Rpbmc6IHByb3ZpZGVyLnVzZUV4aXN0aW5nID8gdGhpcy5fZ2V0VG9rZW5NZXRhZGF0YShwcm92aWRlci51c2VFeGlzdGluZykgOiB1bmRlZmluZWQsXG4gICAgICBkZXBzOiBjb21waWxlRGVwcyxcbiAgICAgIG11bHRpOiBwcm92aWRlci5tdWx0aVxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIF9nZXRRdWVyaWVzTWV0YWRhdGEoXG4gICAgICBxdWVyaWVzOiB7W2tleTogc3RyaW5nXTogUXVlcnl9LCBpc1ZpZXdRdWVyeTogYm9vbGVhbixcbiAgICAgIGRpcmVjdGl2ZVR5cGU6IFR5cGUpOiBjcGwuQ29tcGlsZVF1ZXJ5TWV0YWRhdGFbXSB7XG4gICAgY29uc3QgcmVzOiBjcGwuQ29tcGlsZVF1ZXJ5TWV0YWRhdGFbXSA9IFtdO1xuXG4gICAgT2JqZWN0LmtleXMocXVlcmllcykuZm9yRWFjaCgocHJvcGVydHlOYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgIGNvbnN0IHF1ZXJ5ID0gcXVlcmllc1twcm9wZXJ0eU5hbWVdO1xuICAgICAgaWYgKHF1ZXJ5LmlzVmlld1F1ZXJ5ID09PSBpc1ZpZXdRdWVyeSkge1xuICAgICAgICByZXMucHVzaCh0aGlzLl9nZXRRdWVyeU1ldGFkYXRhKHF1ZXJ5LCBwcm9wZXJ0eU5hbWUsIGRpcmVjdGl2ZVR5cGUpKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICBwcml2YXRlIF9xdWVyeVZhckJpbmRpbmdzKHNlbGVjdG9yOiBhbnkpOiBzdHJpbmdbXSB7IHJldHVybiBzZWxlY3Rvci5zcGxpdCgvXFxzKixcXHMqLyk7IH1cblxuICBwcml2YXRlIF9nZXRRdWVyeU1ldGFkYXRhKHE6IFF1ZXJ5LCBwcm9wZXJ0eU5hbWU6IHN0cmluZywgdHlwZU9yRnVuYzogVHlwZXxGdW5jdGlvbik6XG4gICAgICBjcGwuQ29tcGlsZVF1ZXJ5TWV0YWRhdGEge1xuICAgIGxldCBzZWxlY3RvcnM6IGNwbC5Db21waWxlVG9rZW5NZXRhZGF0YVtdO1xuICAgIGlmICh0eXBlb2YgcS5zZWxlY3RvciA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHNlbGVjdG9ycyA9XG4gICAgICAgICAgdGhpcy5fcXVlcnlWYXJCaW5kaW5ncyhxLnNlbGVjdG9yKS5tYXAodmFyTmFtZSA9PiB0aGlzLl9nZXRUb2tlbk1ldGFkYXRhKHZhck5hbWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFxLnNlbGVjdG9yKSB7XG4gICAgICAgIHRoaXMuX3JlcG9ydEVycm9yKFxuICAgICAgICAgICAgc3ludGF4RXJyb3IoXG4gICAgICAgICAgICAgICAgYENhbid0IGNvbnN0cnVjdCBhIHF1ZXJ5IGZvciB0aGUgcHJvcGVydHkgXCIke3Byb3BlcnR5TmFtZX1cIiBvZiBcIiR7c3RyaW5naWZ5VHlwZSh0eXBlT3JGdW5jKX1cIiBzaW5jZSB0aGUgcXVlcnkgc2VsZWN0b3Igd2Fzbid0IGRlZmluZWQuYCksXG4gICAgICAgICAgICB0eXBlT3JGdW5jKTtcbiAgICAgICAgc2VsZWN0b3JzID0gW107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxlY3RvcnMgPSBbdGhpcy5fZ2V0VG9rZW5NZXRhZGF0YShxLnNlbGVjdG9yKV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHNlbGVjdG9ycyxcbiAgICAgIGZpcnN0OiBxLmZpcnN0LFxuICAgICAgZGVzY2VuZGFudHM6IHEuZGVzY2VuZGFudHMsIHByb3BlcnR5TmFtZSxcbiAgICAgIHJlYWQ6IHEucmVhZCA/IHRoaXMuX2dldFRva2VuTWV0YWRhdGEocS5yZWFkKSA6IG51bGwgISxcbiAgICAgIHN0YXRpYzogcS5zdGF0aWNcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBfcmVwb3J0RXJyb3IoZXJyb3I6IGFueSwgdHlwZT86IGFueSwgb3RoZXJUeXBlPzogYW55KSB7XG4gICAgaWYgKHRoaXMuX2Vycm9yQ29sbGVjdG9yKSB7XG4gICAgICB0aGlzLl9lcnJvckNvbGxlY3RvcihlcnJvciwgdHlwZSk7XG4gICAgICBpZiAob3RoZXJUeXBlKSB7XG4gICAgICAgIHRoaXMuX2Vycm9yQ29sbGVjdG9yKGVycm9yLCBvdGhlclR5cGUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZmxhdHRlbkFycmF5KHRyZWU6IGFueVtdLCBvdXQ6IEFycmF5PGFueT4gPSBbXSk6IEFycmF5PGFueT4ge1xuICBpZiAodHJlZSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHJlZS5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgaXRlbSA9IHJlc29sdmVGb3J3YXJkUmVmKHRyZWVbaV0pO1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaXRlbSkpIHtcbiAgICAgICAgZmxhdHRlbkFycmF5KGl0ZW0sIG91dCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXQucHVzaChpdGVtKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gZGVkdXBlQXJyYXkoYXJyYXk6IGFueVtdKTogQXJyYXk8YW55PiB7XG4gIGlmIChhcnJheSkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKG5ldyBTZXQoYXJyYXkpKTtcbiAgfVxuICByZXR1cm4gW107XG59XG5cbmZ1bmN0aW9uIGZsYXR0ZW5BbmREZWR1cGVBcnJheSh0cmVlOiBhbnlbXSk6IEFycmF5PGFueT4ge1xuICByZXR1cm4gZGVkdXBlQXJyYXkoZmxhdHRlbkFycmF5KHRyZWUpKTtcbn1cblxuZnVuY3Rpb24gaXNWYWxpZFR5cGUodmFsdWU6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gKHZhbHVlIGluc3RhbmNlb2YgU3RhdGljU3ltYm9sKSB8fCAodmFsdWUgaW5zdGFuY2VvZiBUeXBlKTtcbn1cblxuZnVuY3Rpb24gZXh0cmFjdElkZW50aWZpZXJzKHZhbHVlOiBhbnksIHRhcmdldElkZW50aWZpZXJzOiBjcGwuQ29tcGlsZUlkZW50aWZpZXJNZXRhZGF0YVtdKSB7XG4gIHZpc2l0VmFsdWUodmFsdWUsIG5ldyBfQ29tcGlsZVZhbHVlQ29udmVydGVyKCksIHRhcmdldElkZW50aWZpZXJzKTtcbn1cblxuY2xhc3MgX0NvbXBpbGVWYWx1ZUNvbnZlcnRlciBleHRlbmRzIFZhbHVlVHJhbnNmb3JtZXIge1xuICB2aXNpdE90aGVyKHZhbHVlOiBhbnksIHRhcmdldElkZW50aWZpZXJzOiBjcGwuQ29tcGlsZUlkZW50aWZpZXJNZXRhZGF0YVtdKTogYW55IHtcbiAgICB0YXJnZXRJZGVudGlmaWVycy5wdXNoKHtyZWZlcmVuY2U6IHZhbHVlfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5VHlwZSh0eXBlOiBhbnkpOiBzdHJpbmcge1xuICBpZiAodHlwZSBpbnN0YW5jZW9mIFN0YXRpY1N5bWJvbCkge1xuICAgIHJldHVybiBgJHt0eXBlLm5hbWV9IGluICR7dHlwZS5maWxlUGF0aH1gO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzdHJpbmdpZnkodHlwZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBJbmRpY2F0ZXMgdGhhdCBhIGNvbXBvbmVudCBpcyBzdGlsbCBiZWluZyBsb2FkZWQgaW4gYSBzeW5jaHJvbm91cyBjb21waWxlLlxuICovXG5mdW5jdGlvbiBjb21wb25lbnRTdGlsbExvYWRpbmdFcnJvcihjb21wVHlwZTogVHlwZSkge1xuICBjb25zdCBlcnJvciA9XG4gICAgICBFcnJvcihgQ2FuJ3QgY29tcGlsZSBzeW5jaHJvbm91c2x5IGFzICR7c3RyaW5naWZ5KGNvbXBUeXBlKX0gaXMgc3RpbGwgYmVpbmcgbG9hZGVkIWApO1xuICAoZXJyb3IgYXMgYW55KVtFUlJPUl9DT01QT05FTlRfVFlQRV0gPSBjb21wVHlwZTtcbiAgcmV0dXJuIGVycm9yO1xufVxuIl19