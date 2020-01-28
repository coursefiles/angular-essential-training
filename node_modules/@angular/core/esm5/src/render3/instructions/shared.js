import { ErrorHandler } from '../../error_handler';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '../../metadata/schema';
import { validateAgainstEventProperties } from '../../sanitization/sanitization';
import { assertDataInRange, assertDefined, assertDomNode, assertEqual, assertLessThan, assertNotEqual } from '../../util/assert';
import { normalizeDebugBindingName, normalizeDebugBindingValue } from '../../util/ng_reflect';
import { assertLView, assertPreviousIsParent } from '../assert';
import { attachPatchData, getComponentViewByInstance } from '../context_discovery';
import { attachLContainerDebug, attachLViewDebug } from '../debug';
import { diPublicInInjector, getNodeInjectable, getOrCreateNodeInjectorForNode } from '../di';
import { throwMultipleComponentError } from '../errors';
import { executeHooks, executePreOrderHooks, registerPreOrderHooks } from '../hooks';
import { ACTIVE_INDEX, VIEWS } from '../interfaces/container';
import { INJECTOR_BLOOM_PARENT_SIZE, NodeInjectorFactory } from '../interfaces/injector';
import { isProceduralRenderer } from '../interfaces/renderer';
import { BINDING_INDEX, CHILD_HEAD, CHILD_TAIL, CLEANUP, CONTEXT, DECLARATION_VIEW, FLAGS, HEADER_OFFSET, HOST, INJECTOR, NEXT, PARENT, QUERIES, RENDERER, RENDERER_FACTORY, SANITIZER, TVIEW, T_HOST } from '../interfaces/view';
import { assertNodeOfPossibleTypes, assertNodeType } from '../node_assert';
import { isNodeMatchingSelectorList } from '../node_selector_matcher';
import { enterView, getBindingsEnabled, getCheckNoChangesMode, getIsParent, getLView, getNamespace, getPreviousOrParentTNode, getSelectedIndex, incrementActiveDirectiveId, isCreationMode, leaveView, resetComponentState, setActiveHostElement, setBindingRoot, setCheckNoChangesMode, setCurrentDirectiveDef, setCurrentQueryIndex, setIsParent, setPreviousOrParentTNode, setSelectedIndex, ɵɵnamespaceHTML } from '../state';
import { initializeStaticContext as initializeStaticStylingContext } from '../styling/class_and_style_bindings';
import { ANIMATION_PROP_PREFIX, isAnimationProp } from '../styling/util';
import { NO_CHANGE } from '../tokens';
import { attrsStylingIndexOf } from '../util/attrs_utils';
import { INTERPOLATION_DELIMITER, stringifyForError } from '../util/misc_utils';
import { getLViewParent, getRootContext } from '../util/view_traversal_utils';
import { getComponentViewByIndex, getNativeByIndex, getNativeByTNode, getTNode, isComponent, isComponentDef, isContentQueryHost, isRootView, readPatchedLView, resetPreOrderHookFlags, unwrapRNode, viewAttachedToChangeDetector } from '../util/view_utils';
var ɵ0 = function () { return Promise.resolve(null); };
/**
 * A permanent marker promise which signifies that the current CD tree is
 * clean.
 */
var _CLEAN_PROMISE = (ɵ0)();
/**
 * Refreshes the view, executing the following steps in that order:
 * triggers init hooks, refreshes dynamic embedded views, triggers content hooks, sets host
 * bindings, refreshes child components.
 * Note: view hooks are triggered later when leaving the view.
 */
export function refreshDescendantViews(lView) {
    var tView = lView[TVIEW];
    var creationMode = isCreationMode(lView);
    // This needs to be set before children are processed to support recursive components
    tView.firstTemplatePass = false;
    // Resetting the bindingIndex of the current LView as the next steps may trigger change detection.
    lView[BINDING_INDEX] = tView.bindingStartIndex;
    // If this is a creation pass, we should not call lifecycle hooks or evaluate bindings.
    // This will be done in the update pass.
    if (!creationMode) {
        var checkNoChangesMode = getCheckNoChangesMode();
        executePreOrderHooks(lView, tView, checkNoChangesMode, undefined);
        refreshDynamicEmbeddedViews(lView);
        // Content query results must be refreshed before content hooks are called.
        refreshContentQueries(tView, lView);
        resetPreOrderHookFlags(lView);
        executeHooks(lView, tView.contentHooks, tView.contentCheckHooks, checkNoChangesMode, 1 /* AfterContentInitHooksToBeRun */, undefined);
        setHostBindings(tView, lView);
    }
    // We resolve content queries specifically marked as `static` in creation mode. Dynamic
    // content queries are resolved during change detection (i.e. update mode), after embedded
    // views are refreshed (see block above).
    if (creationMode && tView.staticContentQueries) {
        refreshContentQueries(tView, lView);
    }
    refreshChildComponents(tView.components);
}
/** Sets the host bindings for the current view. */
export function setHostBindings(tView, viewData) {
    var selectedIndex = getSelectedIndex();
    try {
        if (tView.expandoInstructions) {
            var bindingRootIndex = viewData[BINDING_INDEX] = tView.expandoStartIndex;
            setBindingRoot(bindingRootIndex);
            var currentDirectiveIndex = -1;
            var currentElementIndex = -1;
            for (var i = 0; i < tView.expandoInstructions.length; i++) {
                var instruction = tView.expandoInstructions[i];
                if (typeof instruction === 'number') {
                    if (instruction <= 0) {
                        // Negative numbers mean that we are starting new EXPANDO block and need to update
                        // the current element and directive index.
                        currentElementIndex = -instruction;
                        setActiveHostElement(currentElementIndex);
                        // Injector block and providers are taken into account.
                        var providerCount = tView.expandoInstructions[++i];
                        bindingRootIndex += INJECTOR_BLOOM_PARENT_SIZE + providerCount;
                        currentDirectiveIndex = bindingRootIndex;
                    }
                    else {
                        // This is either the injector size (so the binding root can skip over directives
                        // and get to the first set of host bindings on this node) or the host var count
                        // (to get to the next set of host bindings on this node).
                        bindingRootIndex += instruction;
                    }
                    setBindingRoot(bindingRootIndex);
                }
                else {
                    // If it's not a number, it's a host binding function that needs to be executed.
                    if (instruction !== null) {
                        viewData[BINDING_INDEX] = bindingRootIndex;
                        var hostCtx = unwrapRNode(viewData[currentDirectiveIndex]);
                        instruction(2 /* Update */, hostCtx, currentElementIndex);
                        // Each directive gets a uniqueId value that is the same for both
                        // create and update calls when the hostBindings function is called. The
                        // directive uniqueId is not set anywhere--it is just incremented between
                        // each hostBindings call and is useful for helping instruction code
                        // uniquely determine which directive is currently active when executed.
                        incrementActiveDirectiveId();
                    }
                    currentDirectiveIndex++;
                }
            }
        }
    }
    finally {
        setActiveHostElement(selectedIndex);
    }
}
/** Refreshes content queries for all directives in the given view. */
function refreshContentQueries(tView, lView) {
    if (tView.contentQueries != null) {
        setCurrentQueryIndex(0);
        for (var i = 0; i < tView.contentQueries.length; i++) {
            var directiveDefIdx = tView.contentQueries[i];
            var directiveDef = tView.data[directiveDefIdx];
            ngDevMode &&
                assertDefined(directiveDef.contentQueries, 'contentQueries function should be defined');
            directiveDef.contentQueries(2 /* Update */, lView[directiveDefIdx], directiveDefIdx);
        }
    }
}
/** Refreshes child components in the current view. */
function refreshChildComponents(components) {
    if (components != null) {
        for (var i = 0; i < components.length; i++) {
            componentRefresh(components[i]);
        }
    }
}
/**
 * Creates a native element from a tag name, using a renderer.
 * @param name the tag name
 * @param overriddenRenderer Optional A renderer to override the default one
 * @returns the element created
 */
export function elementCreate(name, overriddenRenderer) {
    var native;
    var rendererToUse = overriddenRenderer || getLView()[RENDERER];
    var namespace = getNamespace();
    if (isProceduralRenderer(rendererToUse)) {
        native = rendererToUse.createElement(name, namespace);
    }
    else {
        if (namespace === null) {
            native = rendererToUse.createElement(name);
        }
        else {
            native = rendererToUse.createElementNS(namespace, name);
        }
    }
    return native;
}
export function createLView(parentLView, tView, context, flags, host, tHostNode, rendererFactory, renderer, sanitizer, injector) {
    var lView = tView.blueprint.slice();
    lView[HOST] = host;
    lView[FLAGS] = flags | 4 /* CreationMode */ | 128 /* Attached */ | 8 /* FirstLViewPass */;
    resetPreOrderHookFlags(lView);
    lView[PARENT] = lView[DECLARATION_VIEW] = parentLView;
    lView[CONTEXT] = context;
    lView[RENDERER_FACTORY] = (rendererFactory || parentLView && parentLView[RENDERER_FACTORY]);
    ngDevMode && assertDefined(lView[RENDERER_FACTORY], 'RendererFactory is required');
    lView[RENDERER] = (renderer || parentLView && parentLView[RENDERER]);
    ngDevMode && assertDefined(lView[RENDERER], 'Renderer is required');
    lView[SANITIZER] = sanitizer || parentLView && parentLView[SANITIZER] || null;
    lView[INJECTOR] = injector || parentLView && parentLView[INJECTOR] || null;
    lView[T_HOST] = tHostNode;
    ngDevMode && attachLViewDebug(lView);
    return lView;
}
export function createNodeAtIndex(index, type, native, name, attrs) {
    var lView = getLView();
    var tView = lView[TVIEW];
    var adjustedIndex = index + HEADER_OFFSET;
    ngDevMode &&
        assertLessThan(adjustedIndex, lView.length, "Slot should have been initialized with null");
    lView[adjustedIndex] = native;
    var previousOrParentTNode = getPreviousOrParentTNode();
    var isParent = getIsParent();
    var tNode = tView.data[adjustedIndex];
    if (tNode == null) {
        var parent_1 = isParent ? previousOrParentTNode : previousOrParentTNode && previousOrParentTNode.parent;
        // Parents cannot cross component boundaries because components will be used in multiple places,
        // so it's only set if the view is the same.
        var parentInSameView = parent_1 && parent_1 !== lView[T_HOST];
        var tParentNode = parentInSameView ? parent_1 : null;
        tNode = tView.data[adjustedIndex] = createTNode(tParentNode, type, adjustedIndex, name, attrs);
    }
    // Now link ourselves into the tree.
    // We need this even if tNode exists, otherwise we might end up pointing to unexisting tNodes when
    // we use i18n (especially with ICU expressions that update the DOM during the update phase).
    if (previousOrParentTNode) {
        if (isParent && previousOrParentTNode.child == null &&
            (tNode.parent !== null || previousOrParentTNode.type === 2 /* View */)) {
            // We are in the same view, which means we are adding content node to the parent view.
            previousOrParentTNode.child = tNode;
        }
        else if (!isParent) {
            previousOrParentTNode.next = tNode;
        }
    }
    if (tView.firstChild == null) {
        tView.firstChild = tNode;
    }
    setPreviousOrParentTNode(tNode);
    setIsParent(true);
    return tNode;
}
export function assignTViewNodeToLView(tView, tParentNode, index, lView) {
    // View nodes are not stored in data because they can be added / removed at runtime (which
    // would cause indices to change). Their TNodes are instead stored in tView.node.
    var tNode = tView.node;
    if (tNode == null) {
        ngDevMode && tParentNode &&
            assertNodeOfPossibleTypes(tParentNode, 3 /* Element */, 0 /* Container */);
        tView.node = tNode = createTNode(tParentNode, //
        2 /* View */, index, null, null);
    }
    return lView[T_HOST] = tNode;
}
/**
 * When elements are created dynamically after a view blueprint is created (e.g. through
 * i18nApply() or ComponentFactory.create), we need to adjust the blueprint for future
 * template passes.
 */
export function allocExpando(view, numSlotsToAlloc) {
    var tView = view[TVIEW];
    if (tView.firstTemplatePass) {
        for (var i = 0; i < numSlotsToAlloc; i++) {
            tView.blueprint.push(null);
            tView.data.push(null);
            view.push(null);
        }
        // We should only increment the expando start index if there aren't already directives
        // and injectors saved in the "expando" section
        if (!tView.expandoInstructions) {
            tView.expandoStartIndex += numSlotsToAlloc;
        }
        else {
            // Since we're adding the dynamic nodes into the expando section, we need to let the host
            // bindings know that they should skip x slots
            tView.expandoInstructions.push(numSlotsToAlloc);
        }
    }
}
//////////////////////////
//// Render
//////////////////////////
/**
 *
 * @param hostNode Existing node to render into.
 * @param templateFn Template function with the instructions.
 * @param consts The number of nodes, local refs, and pipes in this template
 * @param context to pass into the template.
 * @param providedRendererFactory renderer factory to use
 * @param host The host element node to use
 * @param directives Directive defs that should be used for matching
 * @param pipes Pipe defs that should be used for matching
 */
export function renderTemplate(hostNode, templateFn, consts, vars, context, providedRendererFactory, componentView, directives, pipes, sanitizer) {
    if (componentView === null) {
        resetComponentState();
        var renderer = providedRendererFactory.createRenderer(null, null);
        // We need to create a root view so it's possible to look up the host element through its index
        var hostLView = createLView(null, createTView(-1, null, 1, 0, null, null, null, null), {}, 16 /* CheckAlways */ | 512 /* IsRoot */, null, null, providedRendererFactory, renderer);
        enterView(hostLView, null); // SUSPECT! why do we need to enter the View?
        var componentTView = getOrCreateTView(templateFn, consts, vars, directives || null, pipes || null, null, null);
        var hostTNode = createNodeAtIndex(0, 3 /* Element */, hostNode, null, null);
        componentView = createLView(hostLView, componentTView, context, 16 /* CheckAlways */, hostNode, hostTNode, providedRendererFactory, renderer, sanitizer);
    }
    renderComponentOrTemplate(componentView, context, templateFn);
    return componentView;
}
/**
 * Used for creating the LViewNode of a dynamic embedded view,
 * either through ViewContainerRef.createEmbeddedView() or TemplateRef.createEmbeddedView().
 * Such lViewNode will then be renderer with renderEmbeddedTemplate() (see below).
 */
export function createEmbeddedViewAndNode(tView, context, declarationView, queries, injectorIndex) {
    var _isParent = getIsParent();
    var _previousOrParentTNode = getPreviousOrParentTNode();
    setIsParent(true);
    setPreviousOrParentTNode(null);
    var lView = createLView(declarationView, tView, context, 16 /* CheckAlways */, null, null);
    lView[DECLARATION_VIEW] = declarationView;
    if (queries) {
        lView[QUERIES] = queries.createView();
    }
    assignTViewNodeToLView(tView, null, -1, lView);
    if (tView.firstTemplatePass) {
        tView.node.injectorIndex = injectorIndex;
    }
    setIsParent(_isParent);
    setPreviousOrParentTNode(_previousOrParentTNode);
    return lView;
}
/**
 * Used for rendering embedded views (e.g. dynamically created views)
 *
 * Dynamically created views must store/retrieve their TViews differently from component views
 * because their template functions are nested in the template functions of their hosts, creating
 * closures. If their host template happens to be an embedded template in a loop (e.g. ngFor inside
 * an ngFor), the nesting would mean we'd have multiple instances of the template function, so we
 * can't store TViews in the template function itself (as we do for comps). Instead, we store the
 * TView for dynamically created views on their host TNode, which only has one instance.
 */
export function renderEmbeddedTemplate(viewToRender, tView, context) {
    var _isParent = getIsParent();
    var _previousOrParentTNode = getPreviousOrParentTNode();
    var oldView;
    if (viewToRender[FLAGS] & 512 /* IsRoot */) {
        // This is a root view inside the view tree
        tickRootContext(getRootContext(viewToRender));
    }
    else {
        try {
            setIsParent(true);
            setPreviousOrParentTNode(null);
            oldView = enterView(viewToRender, viewToRender[T_HOST]);
            resetPreOrderHookFlags(viewToRender);
            executeTemplate(tView.template, getRenderFlags(viewToRender), context);
            // This must be set to false immediately after the first creation run because in an
            // ngFor loop, all the views will be created together before update mode runs and turns
            // off firstTemplatePass. If we don't set it here, instances will perform directive
            // matching, etc again and again.
            viewToRender[TVIEW].firstTemplatePass = false;
            refreshDescendantViews(viewToRender);
        }
        finally {
            leaveView(oldView);
            setIsParent(_isParent);
            setPreviousOrParentTNode(_previousOrParentTNode);
        }
    }
}
function renderComponentOrTemplate(hostView, context, templateFn) {
    var rendererFactory = hostView[RENDERER_FACTORY];
    var oldView = enterView(hostView, hostView[T_HOST]);
    var normalExecutionPath = !getCheckNoChangesMode();
    var creationModeIsActive = isCreationMode(hostView);
    try {
        if (normalExecutionPath && !creationModeIsActive && rendererFactory.begin) {
            rendererFactory.begin();
        }
        if (creationModeIsActive) {
            // creation mode pass
            templateFn && executeTemplate(templateFn, 1 /* Create */, context);
            refreshDescendantViews(hostView);
            hostView[FLAGS] &= ~4 /* CreationMode */;
        }
        // update mode pass
        resetPreOrderHookFlags(hostView);
        templateFn && executeTemplate(templateFn, 2 /* Update */, context);
        refreshDescendantViews(hostView);
    }
    finally {
        if (normalExecutionPath && !creationModeIsActive && rendererFactory.end) {
            rendererFactory.end();
        }
        leaveView(oldView);
    }
}
function executeTemplate(templateFn, rf, context) {
    ɵɵnamespaceHTML();
    var prevSelectedIndex = getSelectedIndex();
    try {
        setActiveHostElement(null);
        templateFn(rf, context);
    }
    finally {
        setSelectedIndex(prevSelectedIndex);
    }
}
/**
 * This function returns the default configuration of rendering flags depending on when the
 * template is in creation mode or update mode. Update block and create block are
 * always run separately.
 */
function getRenderFlags(view) {
    return isCreationMode(view) ? 1 /* Create */ : 2 /* Update */;
}
//////////////////////////
//// Element
//////////////////////////
/**
 * Appropriately sets `stylingTemplate` on a TNode
 *
 * Does not apply styles to DOM nodes
 *
 * @param tNode The node whose `stylingTemplate` to set
 * @param attrs The attribute array source to set the attributes from
 * @param attrsStartIndex Optional start index to start processing the `attrs` from
 */
export function setNodeStylingTemplate(tView, tNode, attrs, attrsStartIndex) {
    if (tView.firstTemplatePass && !tNode.stylingTemplate) {
        var stylingAttrsStartIndex = attrsStylingIndexOf(attrs, attrsStartIndex);
        if (stylingAttrsStartIndex >= 0) {
            tNode.stylingTemplate = initializeStaticStylingContext(attrs, stylingAttrsStartIndex);
        }
    }
}
export function executeContentQueries(tView, tNode, lView) {
    if (isContentQueryHost(tNode)) {
        var start = tNode.directiveStart;
        var end = tNode.directiveEnd;
        for (var directiveIndex = start; directiveIndex < end; directiveIndex++) {
            var def = tView.data[directiveIndex];
            if (def.contentQueries) {
                def.contentQueries(1 /* Create */, lView[directiveIndex], directiveIndex);
            }
        }
    }
}
/**
 * Creates directive instances and populates local refs.
 *
 * @param localRefs Local refs of the node in question
 * @param localRefExtractor mapping function that extracts local ref value from TNode
 */
export function createDirectivesAndLocals(tView, lView, localRefs, localRefExtractor) {
    if (localRefExtractor === void 0) { localRefExtractor = getNativeByTNode; }
    if (!getBindingsEnabled())
        return;
    var previousOrParentTNode = getPreviousOrParentTNode();
    if (tView.firstTemplatePass) {
        ngDevMode && ngDevMode.firstTemplatePass++;
        resolveDirectives(tView, lView, findDirectiveMatches(tView, lView, previousOrParentTNode), previousOrParentTNode, localRefs || null);
    }
    instantiateAllDirectives(tView, lView, previousOrParentTNode);
    invokeDirectivesHostBindings(tView, lView, previousOrParentTNode);
    saveResolvedLocalsInData(lView, previousOrParentTNode, localRefExtractor);
}
/**
 * Takes a list of local names and indices and pushes the resolved local variable values
 * to LView in the same order as they are loaded in the template with load().
 */
function saveResolvedLocalsInData(viewData, tNode, localRefExtractor) {
    var localNames = tNode.localNames;
    if (localNames) {
        var localIndex = tNode.index + 1;
        for (var i = 0; i < localNames.length; i += 2) {
            var index = localNames[i + 1];
            var value = index === -1 ?
                localRefExtractor(tNode, viewData) :
                viewData[index];
            viewData[localIndex++] = value;
        }
    }
}
/**
 * Gets TView from a template function or creates a new TView
 * if it doesn't already exist.
 *
 * @param templateFn The template from which to get static data
 * @param consts The number of nodes, local refs, and pipes in this view
 * @param vars The number of bindings and pure function bindings in this view
 * @param directives Directive defs that should be saved on TView
 * @param pipes Pipe defs that should be saved on TView
 * @param viewQuery View query that should be saved on TView
 * @param schemas Schemas that should be saved on TView
 * @returns TView
 */
export function getOrCreateTView(templateFn, consts, vars, directives, pipes, viewQuery, schemas) {
    // TODO(misko): reading `ngPrivateData` here is problematic for two reasons
    // 1. It is a megamorphic call on each invocation.
    // 2. For nested embedded views (ngFor inside ngFor) the template instance is per
    //    outer template invocation, which means that no such property will exist
    // Correct solution is to only put `ngPrivateData` on the Component template
    // and not on embedded templates.
    return templateFn.ngPrivateData ||
        (templateFn.ngPrivateData = createTView(-1, templateFn, consts, vars, directives, pipes, viewQuery, schemas));
}
/**
 * Creates a TView instance
 *
 * @param viewIndex The viewBlockId for inline views, or -1 if it's a component/dynamic
 * @param templateFn Template function
 * @param consts The number of nodes, local refs, and pipes in this template
 * @param directives Registry of directives for this view
 * @param pipes Registry of pipes for this view
 * @param viewQuery View queries for this view
 * @param schemas Schemas for this view
 */
export function createTView(viewIndex, templateFn, consts, vars, directives, pipes, viewQuery, schemas) {
    ngDevMode && ngDevMode.tView++;
    var bindingStartIndex = HEADER_OFFSET + consts;
    // This length does not yet contain host bindings from child directives because at this point,
    // we don't know which directives are active on this template. As soon as a directive is matched
    // that has a host binding, we will update the blueprint with that def's hostVars count.
    var initialViewLength = bindingStartIndex + vars;
    var blueprint = createViewBlueprint(bindingStartIndex, initialViewLength);
    return blueprint[TVIEW] = {
        id: viewIndex,
        blueprint: blueprint,
        template: templateFn,
        viewQuery: viewQuery,
        node: null,
        data: blueprint.slice().fill(null, bindingStartIndex),
        bindingStartIndex: bindingStartIndex,
        viewQueryStartIndex: initialViewLength,
        expandoStartIndex: initialViewLength,
        expandoInstructions: null,
        firstTemplatePass: true,
        staticViewQueries: false,
        staticContentQueries: false,
        preOrderHooks: null,
        preOrderCheckHooks: null,
        contentHooks: null,
        contentCheckHooks: null,
        viewHooks: null,
        viewCheckHooks: null,
        destroyHooks: null,
        cleanup: null,
        contentQueries: null,
        components: null,
        directiveRegistry: typeof directives === 'function' ? directives() : directives,
        pipeRegistry: typeof pipes === 'function' ? pipes() : pipes,
        firstChild: null,
        schemas: schemas,
    };
}
function createViewBlueprint(bindingStartIndex, initialViewLength) {
    var blueprint = new Array(initialViewLength)
        .fill(null, 0, bindingStartIndex)
        .fill(NO_CHANGE, bindingStartIndex);
    blueprint[BINDING_INDEX] = bindingStartIndex;
    return blueprint;
}
export function createError(text, token) {
    return new Error("Renderer: " + text + " [" + stringifyForError(token) + "]");
}
/**
 * Locates the host native element, used for bootstrapping existing nodes into rendering pipeline.
 *
 * @param elementOrSelector Render element or CSS selector to locate the element.
 */
export function locateHostElement(factory, elementOrSelector) {
    var defaultRenderer = factory.createRenderer(null, null);
    var rNode = typeof elementOrSelector === 'string' ?
        (isProceduralRenderer(defaultRenderer) ?
            defaultRenderer.selectRootElement(elementOrSelector) :
            defaultRenderer.querySelector(elementOrSelector)) :
        elementOrSelector;
    if (ngDevMode && !rNode) {
        if (typeof elementOrSelector === 'string') {
            throw createError('Host node with selector not found:', elementOrSelector);
        }
        else {
            throw createError('Host node is required:', elementOrSelector);
        }
    }
    return rNode;
}
/**
 * Saves context for this cleanup function in LView.cleanupInstances.
 *
 * On the first template pass, saves in TView:
 * - Cleanup function
 * - Index of context we just saved in LView.cleanupInstances
 */
export function storeCleanupWithContext(lView, context, cleanupFn) {
    var lCleanup = getCleanup(lView);
    lCleanup.push(context);
    if (lView[TVIEW].firstTemplatePass) {
        getTViewCleanup(lView).push(cleanupFn, lCleanup.length - 1);
    }
}
/**
 * Saves the cleanup function itself in LView.cleanupInstances.
 *
 * This is necessary for functions that are wrapped with their contexts, like in renderer2
 * listeners.
 *
 * On the first template pass, the index of the cleanup function is saved in TView.
 */
export function storeCleanupFn(view, cleanupFn) {
    getCleanup(view).push(cleanupFn);
    if (view[TVIEW].firstTemplatePass) {
        getTViewCleanup(view).push(view[CLEANUP].length - 1, null);
    }
}
/**
 * Constructs a TNode object from the arguments.
 *
 * @param type The type of the node
 * @param adjustedIndex The index of the TNode in TView.data, adjusted for HEADER_OFFSET
 * @param tagName The tag name of the node
 * @param attrs The attributes defined on this node
 * @param tViews Any TViews attached to this node
 * @returns the TNode object
 */
export function createTNode(tParent, type, adjustedIndex, tagName, attrs) {
    ngDevMode && ngDevMode.tNode++;
    return {
        type: type,
        index: adjustedIndex,
        injectorIndex: tParent ? tParent.injectorIndex : -1,
        directiveStart: -1,
        directiveEnd: -1,
        propertyMetadataStartIndex: -1,
        propertyMetadataEndIndex: -1,
        flags: 0,
        providerIndexes: 0,
        tagName: tagName,
        attrs: attrs,
        localNames: null,
        initialInputs: undefined,
        inputs: undefined,
        outputs: undefined,
        tViews: null,
        next: null,
        projectionNext: null,
        child: null,
        parent: tParent,
        stylingTemplate: null,
        projection: null,
        onElementCreationFns: null,
    };
}
/**
 * Consolidates all inputs or outputs of all directives on this logical node.
 *
 * @param tNode
 * @param direction whether to consider inputs or outputs
 * @returns PropertyAliases|null aggregate of all properties if any, `null` otherwise
 */
export function generatePropertyAliases(tNode, direction) {
    var tView = getLView()[TVIEW];
    var propStore = null;
    var start = tNode.directiveStart;
    var end = tNode.directiveEnd;
    if (end > start) {
        var isInput = direction === 0 /* Input */;
        var defs = tView.data;
        for (var i = start; i < end; i++) {
            var directiveDef = defs[i];
            var propertyAliasMap = isInput ? directiveDef.inputs : directiveDef.outputs;
            for (var publicName in propertyAliasMap) {
                if (propertyAliasMap.hasOwnProperty(publicName)) {
                    propStore = propStore || {};
                    var internalName = propertyAliasMap[publicName];
                    var hasProperty = propStore.hasOwnProperty(publicName);
                    hasProperty ? propStore[publicName].push(i, publicName, internalName) :
                        (propStore[publicName] = [i, publicName, internalName]);
                }
            }
        }
    }
    return propStore;
}
/**
* Mapping between attributes names that don't correspond to their element property names.
*/
var ATTR_TO_PROP = {
    'class': 'className',
    'for': 'htmlFor',
    'formaction': 'formAction',
    'innerHtml': 'innerHTML',
    'readonly': 'readOnly',
    'tabindex': 'tabIndex',
};
export function elementPropertyInternal(index, propName, value, sanitizer, nativeOnly, loadRendererFn) {
    if (value === NO_CHANGE)
        return;
    var lView = getLView();
    var element = getNativeByIndex(index, lView);
    var tNode = getTNode(index, lView);
    var inputData;
    var dataValue;
    if (!nativeOnly && (inputData = initializeTNodeInputs(tNode)) &&
        (dataValue = inputData[propName])) {
        setInputsForProperty(lView, dataValue, value);
        if (isComponent(tNode))
            markDirtyIfOnPush(lView, index + HEADER_OFFSET);
        if (ngDevMode) {
            if (tNode.type === 3 /* Element */ || tNode.type === 0 /* Container */) {
                /**
                 * dataValue is an array containing runtime input or output names for the directives:
                 * i+0: directive instance index
                 * i+1: publicName
                 * i+2: privateName
                 *
                 * e.g. [0, 'change', 'change-minified']
                 * we want to set the reflected property with the privateName: dataValue[i+2]
                 */
                for (var i = 0; i < dataValue.length; i += 3) {
                    setNgReflectProperty(lView, element, tNode.type, dataValue[i + 2], value);
                }
            }
        }
    }
    else if (tNode.type === 3 /* Element */) {
        propName = ATTR_TO_PROP[propName] || propName;
        if (ngDevMode) {
            validateAgainstEventProperties(propName);
            validateAgainstUnknownProperties(lView, element, propName, tNode);
            ngDevMode.rendererSetProperty++;
        }
        savePropertyDebugData(tNode, lView, propName, lView[TVIEW].data, nativeOnly);
        var renderer = loadRendererFn ? loadRendererFn(tNode, lView) : lView[RENDERER];
        // It is assumed that the sanitizer is only added when the compiler determines that the property
        // is risky, so sanitization can be done without further checks.
        value = sanitizer != null ? sanitizer(value, tNode.tagName || '', propName) : value;
        if (isProceduralRenderer(renderer)) {
            renderer.setProperty(element, propName, value);
        }
        else if (!isAnimationProp(propName)) {
            element.setProperty ? element.setProperty(propName, value) :
                element[propName] = value;
        }
    }
    else if (tNode.type === 0 /* Container */) {
        // If the node is a container and the property didn't
        // match any of the inputs or schemas we should throw.
        if (ngDevMode && !matchingSchemas(lView, tNode.tagName)) {
            throw createUnknownPropertyError(propName, tNode);
        }
    }
}
/** If node is an OnPush component, marks its LView dirty. */
function markDirtyIfOnPush(lView, viewIndex) {
    ngDevMode && assertLView(lView);
    var childComponentLView = getComponentViewByIndex(viewIndex, lView);
    if (!(childComponentLView[FLAGS] & 16 /* CheckAlways */)) {
        childComponentLView[FLAGS] |= 64 /* Dirty */;
    }
}
export function setNgReflectProperty(lView, element, type, attrName, value) {
    var _a;
    var renderer = lView[RENDERER];
    attrName = normalizeDebugBindingName(attrName);
    var debugValue = normalizeDebugBindingValue(value);
    if (type === 3 /* Element */) {
        if (value == null) {
            isProceduralRenderer(renderer) ? renderer.removeAttribute(element, attrName) :
                element.removeAttribute(attrName);
        }
        else {
            isProceduralRenderer(renderer) ?
                renderer.setAttribute(element, attrName, debugValue) :
                element.setAttribute(attrName, debugValue);
        }
    }
    else {
        var textContent = "bindings=" + JSON.stringify((_a = {}, _a[attrName] = debugValue, _a), null, 2);
        if (isProceduralRenderer(renderer)) {
            renderer.setValue(element, textContent);
        }
        else {
            element.textContent = textContent;
        }
    }
}
function validateAgainstUnknownProperties(hostView, element, propName, tNode) {
    // If the tag matches any of the schemas we shouldn't throw.
    if (matchingSchemas(hostView, tNode.tagName)) {
        return;
    }
    // If prop is not a known property of the HTML element...
    if (!(propName in element) &&
        // and we are in a browser context... (web worker nodes should be skipped)
        typeof Node === 'function' && element instanceof Node &&
        // and isn't a synthetic animation property...
        propName[0] !== ANIMATION_PROP_PREFIX) {
        // ... it is probably a user error and we should throw.
        throw createUnknownPropertyError(propName, tNode);
    }
}
function matchingSchemas(hostView, tagName) {
    var schemas = hostView[TVIEW].schemas;
    if (schemas !== null) {
        for (var i = 0; i < schemas.length; i++) {
            var schema = schemas[i];
            if (schema === NO_ERRORS_SCHEMA ||
                schema === CUSTOM_ELEMENTS_SCHEMA && tagName && tagName.indexOf('-') > -1) {
                return true;
            }
        }
    }
    return false;
}
/**
* Stores debugging data for this property binding on first template pass.
* This enables features like DebugElement.properties.
*/
function savePropertyDebugData(tNode, lView, propName, tData, nativeOnly) {
    var lastBindingIndex = lView[BINDING_INDEX] - 1;
    // Bind/interpolation functions save binding metadata in the last binding index,
    // but leave the property name blank. If the interpolation delimiter is at the 0
    // index, we know that this is our first pass and the property name still needs to
    // be set.
    var bindingMetadata = tData[lastBindingIndex];
    if (bindingMetadata[0] == INTERPOLATION_DELIMITER) {
        tData[lastBindingIndex] = propName + bindingMetadata;
        // We don't want to store indices for host bindings because they are stored in a
        // different part of LView (the expando section).
        if (!nativeOnly) {
            if (tNode.propertyMetadataStartIndex == -1) {
                tNode.propertyMetadataStartIndex = lastBindingIndex;
            }
            tNode.propertyMetadataEndIndex = lastBindingIndex + 1;
        }
    }
}
/**
* Creates an error that should be thrown when encountering an unknown property on an element.
* @param propName Name of the invalid property.
* @param tNode Node on which we encountered the error.
*/
function createUnknownPropertyError(propName, tNode) {
    return new Error("Template error: Can't bind to '" + propName + "' since it isn't a known property of '" + tNode.tagName + "'.");
}
/**
 * Instantiate a root component.
 */
export function instantiateRootComponent(tView, viewData, def) {
    var rootTNode = getPreviousOrParentTNode();
    if (tView.firstTemplatePass) {
        if (def.providersResolver)
            def.providersResolver(def);
        generateExpandoInstructionBlock(tView, rootTNode, 1);
        baseResolveDirective(tView, viewData, def, def.factory);
    }
    var directive = getNodeInjectable(tView.data, viewData, viewData.length - 1, rootTNode);
    postProcessBaseDirective(viewData, rootTNode, directive);
    return directive;
}
/**
 * Resolve the matched directives on a node.
 */
function resolveDirectives(tView, viewData, directives, tNode, localRefs) {
    // Please make sure to have explicit type for `exportsMap`. Inferred type triggers bug in tsickle.
    ngDevMode && assertEqual(tView.firstTemplatePass, true, 'should run on first template pass only');
    var exportsMap = localRefs ? { '': -1 } : null;
    if (directives) {
        initNodeFlags(tNode, tView.data.length, directives.length);
        // When the same token is provided by several directives on the same node, some rules apply in
        // the viewEngine:
        // - viewProviders have priority over providers
        // - the last directive in NgModule.declarations has priority over the previous one
        // So to match these rules, the order in which providers are added in the arrays is very
        // important.
        for (var i = 0; i < directives.length; i++) {
            var def = directives[i];
            if (def.providersResolver)
                def.providersResolver(def);
        }
        generateExpandoInstructionBlock(tView, tNode, directives.length);
        var initialPreOrderHooksLength = (tView.preOrderHooks && tView.preOrderHooks.length) || 0;
        var initialPreOrderCheckHooksLength = (tView.preOrderCheckHooks && tView.preOrderCheckHooks.length) || 0;
        var nodeIndex = tNode.index - HEADER_OFFSET;
        for (var i = 0; i < directives.length; i++) {
            var def = directives[i];
            var directiveDefIdx = tView.data.length;
            baseResolveDirective(tView, viewData, def, def.factory);
            saveNameToExportMap(tView.data.length - 1, def, exportsMap);
            // Init hooks are queued now so ngOnInit is called in host components before
            // any projected components.
            registerPreOrderHooks(directiveDefIdx, def, tView, nodeIndex, initialPreOrderHooksLength, initialPreOrderCheckHooksLength);
        }
    }
    if (exportsMap)
        cacheMatchingLocalNames(tNode, localRefs, exportsMap);
}
/**
 * Instantiate all the directives that were previously resolved on the current node.
 */
function instantiateAllDirectives(tView, lView, tNode) {
    var start = tNode.directiveStart;
    var end = tNode.directiveEnd;
    if (!tView.firstTemplatePass && start < end) {
        getOrCreateNodeInjectorForNode(tNode, lView);
    }
    for (var i = start; i < end; i++) {
        var def = tView.data[i];
        if (isComponentDef(def)) {
            addComponentLogic(lView, tNode, def);
        }
        var directive = getNodeInjectable(tView.data, lView, i, tNode);
        postProcessDirective(lView, directive, def, i);
    }
}
function invokeDirectivesHostBindings(tView, viewData, tNode) {
    var start = tNode.directiveStart;
    var end = tNode.directiveEnd;
    var expando = tView.expandoInstructions;
    var firstTemplatePass = tView.firstTemplatePass;
    var elementIndex = tNode.index - HEADER_OFFSET;
    var selectedIndex = getSelectedIndex();
    try {
        setActiveHostElement(elementIndex);
        for (var i = start; i < end; i++) {
            var def = tView.data[i];
            var directive = viewData[i];
            if (def.hostBindings) {
                invokeHostBindingsInCreationMode(def, expando, directive, tNode, firstTemplatePass);
                // Each directive gets a uniqueId value that is the same for both
                // create and update calls when the hostBindings function is called. The
                // directive uniqueId is not set anywhere--it is just incremented between
                // each hostBindings call and is useful for helping instruction code
                // uniquely determine which directive is currently active when executed.
                incrementActiveDirectiveId();
            }
            else if (firstTemplatePass) {
                expando.push(null);
            }
        }
    }
    finally {
        setActiveHostElement(selectedIndex);
    }
}
export function invokeHostBindingsInCreationMode(def, expando, directive, tNode, firstTemplatePass) {
    var previousExpandoLength = expando.length;
    setCurrentDirectiveDef(def);
    var elementIndex = tNode.index - HEADER_OFFSET;
    def.hostBindings(1 /* Create */, directive, elementIndex);
    setCurrentDirectiveDef(null);
    // `hostBindings` function may or may not contain `allocHostVars` call
    // (e.g. it may not if it only contains host listeners), so we need to check whether
    // `expandoInstructions` has changed and if not - we still push `hostBindings` to
    // expando block, to make sure we execute it for DI cycle
    if (previousExpandoLength === expando.length && firstTemplatePass) {
        expando.push(def.hostBindings);
    }
}
/**
* Generates a new block in TView.expandoInstructions for this node.
*
* Each expando block starts with the element index (turned negative so we can distinguish
* it from the hostVar count) and the directive count. See more in VIEW_DATA.md.
*/
export function generateExpandoInstructionBlock(tView, tNode, directiveCount) {
    ngDevMode && assertEqual(tView.firstTemplatePass, true, 'Expando block should only be generated on first template pass.');
    var elementIndex = -(tNode.index - HEADER_OFFSET);
    var providerStartIndex = tNode.providerIndexes & 65535 /* ProvidersStartIndexMask */;
    var providerCount = tView.data.length - providerStartIndex;
    (tView.expandoInstructions || (tView.expandoInstructions = [])).push(elementIndex, providerCount, directiveCount);
}
/**
 * Process a directive on the current node after its creation.
 */
function postProcessDirective(viewData, directive, def, directiveDefIdx) {
    var previousOrParentTNode = getPreviousOrParentTNode();
    postProcessBaseDirective(viewData, previousOrParentTNode, directive);
    ngDevMode && assertDefined(previousOrParentTNode, 'previousOrParentTNode');
    if (previousOrParentTNode && previousOrParentTNode.attrs) {
        setInputsFromAttrs(directiveDefIdx, directive, def, previousOrParentTNode);
    }
    if (viewData[TVIEW].firstTemplatePass && def.contentQueries) {
        previousOrParentTNode.flags |= 4 /* hasContentQuery */;
    }
    if (isComponentDef(def)) {
        var componentView = getComponentViewByIndex(previousOrParentTNode.index, viewData);
        componentView[CONTEXT] = directive;
    }
}
/**
 * A lighter version of postProcessDirective() that is used for the root component.
 */
function postProcessBaseDirective(lView, previousOrParentTNode, directive) {
    var native = getNativeByTNode(previousOrParentTNode, lView);
    ngDevMode && assertEqual(lView[BINDING_INDEX], lView[TVIEW].bindingStartIndex, 'directives should be created before any bindings');
    ngDevMode && assertPreviousIsParent(getIsParent());
    attachPatchData(directive, lView);
    if (native) {
        attachPatchData(native, lView);
    }
}
/**
* Matches the current node against all available selectors.
* If a component is matched (at most one), it is returned in first position in the array.
*/
function findDirectiveMatches(tView, viewData, tNode) {
    ngDevMode && assertEqual(tView.firstTemplatePass, true, 'should run on first template pass only');
    var registry = tView.directiveRegistry;
    var matches = null;
    if (registry) {
        for (var i = 0; i < registry.length; i++) {
            var def = registry[i];
            if (isNodeMatchingSelectorList(tNode, def.selectors, /* isProjectionMode */ false)) {
                matches || (matches = []);
                diPublicInInjector(getOrCreateNodeInjectorForNode(getPreviousOrParentTNode(), viewData), viewData, def.type);
                if (isComponentDef(def)) {
                    if (tNode.flags & 1 /* isComponent */)
                        throwMultipleComponentError(tNode);
                    tNode.flags = 1 /* isComponent */;
                    // The component is always stored first with directives after.
                    matches.unshift(def);
                }
                else {
                    matches.push(def);
                }
            }
        }
    }
    return matches;
}
/** Stores index of component's host element so it will be queued for view refresh during CD. */
export function queueComponentIndexForCheck(previousOrParentTNode) {
    var tView = getLView()[TVIEW];
    ngDevMode &&
        assertEqual(tView.firstTemplatePass, true, 'Should only be called in first template pass.');
    (tView.components || (tView.components = [])).push(previousOrParentTNode.index);
}
/** Caches local names and their matching directive indices for query and template lookups. */
function cacheMatchingLocalNames(tNode, localRefs, exportsMap) {
    if (localRefs) {
        var localNames = tNode.localNames = [];
        // Local names must be stored in tNode in the same order that localRefs are defined
        // in the template to ensure the data is loaded in the same slots as their refs
        // in the template (for template queries).
        for (var i = 0; i < localRefs.length; i += 2) {
            var index = exportsMap[localRefs[i + 1]];
            if (index == null)
                throw new Error("Export of name '" + localRefs[i + 1] + "' not found!");
            localNames.push(localRefs[i], index);
        }
    }
}
/**
* Builds up an export map as directives are created, so local refs can be quickly mapped
* to their directive instances.
*/
function saveNameToExportMap(index, def, exportsMap) {
    if (exportsMap) {
        if (def.exportAs) {
            for (var i = 0; i < def.exportAs.length; i++) {
                exportsMap[def.exportAs[i]] = index;
            }
        }
        if (def.template)
            exportsMap[''] = index;
    }
}
/**
 * Initializes the flags on the current node, setting all indices to the initial index,
 * the directive count to 0, and adding the isComponent flag.
 * @param index the initial index
 */
export function initNodeFlags(tNode, index, numberOfDirectives) {
    var flags = tNode.flags;
    ngDevMode && assertEqual(flags === 0 || flags === 1 /* isComponent */, true, 'expected node flags to not be initialized');
    ngDevMode && assertNotEqual(numberOfDirectives, tNode.directiveEnd - tNode.directiveStart, 'Reached the max number of directives');
    // When the first directive is created on a node, save the index
    tNode.flags = flags & 1 /* isComponent */;
    tNode.directiveStart = index;
    tNode.directiveEnd = index + numberOfDirectives;
    tNode.providerIndexes = index;
}
function baseResolveDirective(tView, viewData, def, directiveFactory) {
    tView.data.push(def);
    var nodeInjectorFactory = new NodeInjectorFactory(directiveFactory, isComponentDef(def), null);
    tView.blueprint.push(nodeInjectorFactory);
    viewData.push(nodeInjectorFactory);
}
function addComponentLogic(lView, previousOrParentTNode, def) {
    var native = getNativeByTNode(previousOrParentTNode, lView);
    var tView = getOrCreateTView(def.template, def.consts, def.vars, def.directiveDefs, def.pipeDefs, def.viewQuery, def.schemas);
    // Only component views should be added to the view tree directly. Embedded views are
    // accessed through their containers because they may be removed / re-added later.
    var rendererFactory = lView[RENDERER_FACTORY];
    var componentView = addToViewTree(lView, createLView(lView, tView, null, def.onPush ? 64 /* Dirty */ : 16 /* CheckAlways */, lView[previousOrParentTNode.index], previousOrParentTNode, rendererFactory, lView[RENDERER_FACTORY].createRenderer(native, def)));
    componentView[T_HOST] = previousOrParentTNode;
    // Component view will always be created before any injected LContainers,
    // so this is a regular element, wrap it with the component view
    lView[previousOrParentTNode.index] = componentView;
    if (lView[TVIEW].firstTemplatePass) {
        queueComponentIndexForCheck(previousOrParentTNode);
    }
}
/**
 * Sets initial input properties on directive instances from attribute data
 *
 * @param directiveIndex Index of the directive in directives array
 * @param instance Instance of the directive on which to set the initial inputs
 * @param def The directive def that contains the list of inputs
 * @param tNode The static data for this node
 */
function setInputsFromAttrs(directiveIndex, instance, def, tNode) {
    var initialInputData = tNode.initialInputs;
    if (initialInputData === undefined || directiveIndex >= initialInputData.length) {
        initialInputData = generateInitialInputs(directiveIndex, def.inputs, tNode);
    }
    var initialInputs = initialInputData[directiveIndex];
    if (initialInputs) {
        var setInput = def.setInput;
        for (var i = 0; i < initialInputs.length;) {
            var publicName = initialInputs[i++];
            var privateName = initialInputs[i++];
            var value = initialInputs[i++];
            if (setInput) {
                def.setInput(instance, value, publicName, privateName);
            }
            else {
                instance[privateName] = value;
            }
            if (ngDevMode) {
                var lView = getLView();
                var nativeElement = getNativeByTNode(tNode, lView);
                setNgReflectProperty(lView, nativeElement, tNode.type, privateName, value);
            }
        }
    }
}
/**
 * Generates initialInputData for a node and stores it in the template's static storage
 * so subsequent template invocations don't have to recalculate it.
 *
 * initialInputData is an array containing values that need to be set as input properties
 * for directives on this node, but only once on creation. We need this array to support
 * the case where you set an @Input property of a directive using attribute-like syntax.
 * e.g. if you have a `name` @Input, you can set it once like this:
 *
 * <my-component name="Bess"></my-component>
 *
 * @param directiveIndex Index to store the initial input data
 * @param inputs The list of inputs from the directive def
 * @param tNode The static data on this node
 */
function generateInitialInputs(directiveIndex, inputs, tNode) {
    var initialInputData = tNode.initialInputs || (tNode.initialInputs = []);
    initialInputData[directiveIndex] = null;
    var attrs = tNode.attrs;
    var i = 0;
    while (i < attrs.length) {
        var attrName = attrs[i];
        if (attrName === 0 /* NamespaceURI */) {
            // We do not allow inputs on namespaced attributes.
            i += 4;
            continue;
        }
        else if (attrName === 5 /* ProjectAs */) {
            // Skip over the `ngProjectAs` value.
            i += 2;
            continue;
        }
        // If we hit any other attribute markers, we're done anyway. None of those are valid inputs.
        if (typeof attrName === 'number')
            break;
        var minifiedInputName = inputs[attrName];
        var attrValue = attrs[i + 1];
        if (minifiedInputName !== undefined) {
            var inputsToStore = initialInputData[directiveIndex] || (initialInputData[directiveIndex] = []);
            inputsToStore.push(attrName, minifiedInputName, attrValue);
        }
        i += 2;
    }
    return initialInputData;
}
//////////////////////////
//// ViewContainer & View
//////////////////////////
/**
 * Creates a LContainer, either from a container instruction, or for a ViewContainerRef.
 *
 * @param hostNative The host element for the LContainer
 * @param hostTNode The host TNode for the LContainer
 * @param currentView The parent view of the LContainer
 * @param native The native comment element
 * @param isForViewContainerRef Optional a flag indicating the ViewContainerRef case
 * @returns LContainer
 */
export function createLContainer(hostNative, currentView, native, tNode, isForViewContainerRef) {
    ngDevMode && assertDomNode(native);
    ngDevMode && assertLView(currentView);
    var lContainer = [
        hostNative,
        true,
        isForViewContainerRef ? -1 : 0,
        currentView,
        null,
        null,
        tNode,
        native,
        [],
    ];
    ngDevMode && attachLContainerDebug(lContainer);
    return lContainer;
}
/**
 * Goes over dynamic embedded views (ones created through ViewContainerRef APIs) and refreshes them
 * by executing an associated template function.
 */
function refreshDynamicEmbeddedViews(lView) {
    for (var current = lView[CHILD_HEAD]; current !== null; current = current[NEXT]) {
        // Note: current can be an LView or an LContainer instance, but here we are only interested
        // in LContainer. We can tell it's an LContainer because its length is less than the LView
        // header.
        if (current.length < HEADER_OFFSET && current[ACTIVE_INDEX] === -1) {
            var container = current;
            for (var i = 0; i < container[VIEWS].length; i++) {
                var dynamicViewData = container[VIEWS][i];
                // The directives and pipes are not needed here as an existing view is only being refreshed.
                ngDevMode && assertDefined(dynamicViewData[TVIEW], 'TView must be allocated');
                renderEmbeddedTemplate(dynamicViewData, dynamicViewData[TVIEW], dynamicViewData[CONTEXT]);
            }
        }
    }
}
/////////////
/**
 * Refreshes components by entering the component view and processing its bindings, queries, etc.
 *
 * @param adjustedElementIndex  Element index in LView[] (adjusted for HEADER_OFFSET)
 */
export function componentRefresh(adjustedElementIndex) {
    var lView = getLView();
    ngDevMode && assertDataInRange(lView, adjustedElementIndex);
    var hostView = getComponentViewByIndex(adjustedElementIndex, lView);
    ngDevMode && assertNodeType(lView[TVIEW].data[adjustedElementIndex], 3 /* Element */);
    // Only components in creation mode, attached CheckAlways
    // components or attached, dirty OnPush components should be checked
    if ((viewAttachedToChangeDetector(hostView) || isCreationMode(lView)) &&
        hostView[FLAGS] & (16 /* CheckAlways */ | 64 /* Dirty */)) {
        syncViewWithBlueprint(hostView);
        checkView(hostView, hostView[CONTEXT]);
    }
}
/**
 * Syncs an LView instance with its blueprint if they have gotten out of sync.
 *
 * Typically, blueprints and their view instances should always be in sync, so the loop here
 * will be skipped. However, consider this case of two components side-by-side:
 *
 * App template:
 * ```
 * <comp></comp>
 * <comp></comp>
 * ```
 *
 * The following will happen:
 * 1. App template begins processing.
 * 2. First <comp> is matched as a component and its LView is created.
 * 3. Second <comp> is matched as a component and its LView is created.
 * 4. App template completes processing, so it's time to check child templates.
 * 5. First <comp> template is checked. It has a directive, so its def is pushed to blueprint.
 * 6. Second <comp> template is checked. Its blueprint has been updated by the first
 * <comp> template, but its LView was created before this update, so it is out of sync.
 *
 * Note that embedded views inside ngFor loops will never be out of sync because these views
 * are processed as soon as they are created.
 *
 * @param componentView The view to sync
 */
function syncViewWithBlueprint(componentView) {
    var componentTView = componentView[TVIEW];
    for (var i = componentView.length; i < componentTView.blueprint.length; i++) {
        componentView[i] = componentTView.blueprint[i];
    }
}
/**
 * Adds LView or LContainer to the end of the current view tree.
 *
 * This structure will be used to traverse through nested views to remove listeners
 * and call onDestroy callbacks.
 *
 * @param lView The view where LView or LContainer should be added
 * @param adjustedHostIndex Index of the view's host node in LView[], adjusted for header
 * @param lViewOrLContainer The LView or LContainer to add to the view tree
 * @returns The state passed in
 */
export function addToViewTree(lView, lViewOrLContainer) {
    // TODO(benlesh/misko): This implementation is incorrect, because it always adds the LContainer to
    // the end of the queue, which means if the developer retrieves the LContainers from RNodes out of
    // order, the change detection will run out of order, as the act of retrieving the the LContainer
    // from the RNode is what adds it to the queue.
    if (lView[CHILD_HEAD]) {
        lView[CHILD_TAIL][NEXT] = lViewOrLContainer;
    }
    else {
        lView[CHILD_HEAD] = lViewOrLContainer;
    }
    lView[CHILD_TAIL] = lViewOrLContainer;
    return lViewOrLContainer;
}
///////////////////////////////
//// Change detection
///////////////////////////////
/**
 * Marks current view and all ancestors dirty.
 *
 * Returns the root view because it is found as a byproduct of marking the view tree
 * dirty, and can be used by methods that consume markViewDirty() to easily schedule
 * change detection. Otherwise, such methods would need to traverse up the view tree
 * an additional time to get the root view and schedule a tick on it.
 *
 * @param lView The starting LView to mark dirty
 * @returns the root LView
 */
export function markViewDirty(lView) {
    while (lView) {
        lView[FLAGS] |= 64 /* Dirty */;
        var parent_2 = getLViewParent(lView);
        // Stop traversing up as soon as you find a root view that wasn't attached to any container
        if (isRootView(lView) && !parent_2) {
            return lView;
        }
        // continue otherwise
        lView = parent_2;
    }
    return null;
}
/**
 * Used to schedule change detection on the whole application.
 *
 * Unlike `tick`, `scheduleTick` coalesces multiple calls into one change detection run.
 * It is usually called indirectly by calling `markDirty` when the view needs to be
 * re-rendered.
 *
 * Typically `scheduleTick` uses `requestAnimationFrame` to coalesce multiple
 * `scheduleTick` requests. The scheduling function can be overridden in
 * `renderComponent`'s `scheduler` option.
 */
export function scheduleTick(rootContext, flags) {
    var nothingScheduled = rootContext.flags === 0 /* Empty */;
    rootContext.flags |= flags;
    if (nothingScheduled && rootContext.clean == _CLEAN_PROMISE) {
        var res_1;
        rootContext.clean = new Promise(function (r) { return res_1 = r; });
        rootContext.scheduler(function () {
            if (rootContext.flags & 1 /* DetectChanges */) {
                rootContext.flags &= ~1 /* DetectChanges */;
                tickRootContext(rootContext);
            }
            if (rootContext.flags & 2 /* FlushPlayers */) {
                rootContext.flags &= ~2 /* FlushPlayers */;
                var playerHandler = rootContext.playerHandler;
                if (playerHandler) {
                    playerHandler.flushPlayers();
                }
            }
            rootContext.clean = _CLEAN_PROMISE;
            res_1(null);
        });
    }
}
export function tickRootContext(rootContext) {
    for (var i = 0; i < rootContext.components.length; i++) {
        var rootComponent = rootContext.components[i];
        renderComponentOrTemplate(readPatchedLView(rootComponent), rootComponent);
    }
}
export function detectChangesInternal(view, context) {
    var rendererFactory = view[RENDERER_FACTORY];
    if (rendererFactory.begin)
        rendererFactory.begin();
    try {
        if (isCreationMode(view)) {
            checkView(view, context); // creation mode pass
        }
        checkView(view, context); // update mode pass
    }
    catch (error) {
        handleError(view, error);
        throw error;
    }
    finally {
        if (rendererFactory.end)
            rendererFactory.end();
    }
}
/**
 * Synchronously perform change detection on a root view and its components.
 *
 * @param lView The view which the change detection should be performed on.
 */
export function detectChangesInRootView(lView) {
    tickRootContext(lView[CONTEXT]);
}
/**
 * Checks the change detector and its children, and throws if any changes are detected.
 *
 * This is used in development mode to verify that running change detection doesn't
 * introduce other changes.
 */
export function checkNoChanges(component) {
    var view = getComponentViewByInstance(component);
    checkNoChangesInternal(view, component);
}
export function checkNoChangesInternal(view, context) {
    setCheckNoChangesMode(true);
    try {
        detectChangesInternal(view, context);
    }
    finally {
        setCheckNoChangesMode(false);
    }
}
/**
 * Checks the change detector on a root view and its components, and throws if any changes are
 * detected.
 *
 * This is used in development mode to verify that running change detection doesn't
 * introduce other changes.
 *
 * @param lView The view which the change detection should be checked on.
 */
export function checkNoChangesInRootView(lView) {
    setCheckNoChangesMode(true);
    try {
        detectChangesInRootView(lView);
    }
    finally {
        setCheckNoChangesMode(false);
    }
}
/** Checks the view of the component provided. Does not gate on dirty checks or execute doCheck. */
export function checkView(hostView, component) {
    var hostTView = hostView[TVIEW];
    var oldView = enterView(hostView, hostView[T_HOST]);
    var templateFn = hostTView.template;
    var creationMode = isCreationMode(hostView);
    try {
        resetPreOrderHookFlags(hostView);
        creationMode && executeViewQueryFn(1 /* Create */, hostTView, component);
        executeTemplate(templateFn, getRenderFlags(hostView), component);
        refreshDescendantViews(hostView);
        // Only check view queries again in creation mode if there are static view queries
        if (!creationMode || hostTView.staticViewQueries) {
            executeViewQueryFn(2 /* Update */, hostTView, component);
        }
    }
    finally {
        leaveView(oldView);
    }
}
function executeViewQueryFn(flags, tView, component) {
    var viewQuery = tView.viewQuery;
    if (viewQuery) {
        setCurrentQueryIndex(tView.viewQueryStartIndex);
        viewQuery(flags, component);
    }
}
///////////////////////////////
//// Bindings & interpolations
///////////////////////////////
/**
 * Creates binding metadata for a particular binding and stores it in
 * TView.data. These are generated in order to support DebugElement.properties.
 *
 * Each binding / interpolation will have one (including attribute bindings)
 * because at the time of binding, we don't know to which instruction the binding
 * belongs. It is always stored in TView.data at the index of the last binding
 * value in LView (e.g. for interpolation8, it would be stored at the index of
 * the 8th value).
 *
 * @param lView The LView that contains the current binding index.
 * @param prefix The static prefix string
 * @param suffix The static suffix string
 *
 * @returns Newly created binding metadata string for this binding or null
 */
export function storeBindingMetadata(lView, prefix, suffix) {
    if (prefix === void 0) { prefix = ''; }
    if (suffix === void 0) { suffix = ''; }
    var tData = lView[TVIEW].data;
    var lastBindingIndex = lView[BINDING_INDEX] - 1;
    var value = INTERPOLATION_DELIMITER + prefix + INTERPOLATION_DELIMITER + suffix;
    return tData[lastBindingIndex] == null ? (tData[lastBindingIndex] = value) : null;
}
export var CLEAN_PROMISE = _CLEAN_PROMISE;
export function initializeTNodeInputs(tNode) {
    // If tNode.inputs is undefined, a listener has created outputs, but inputs haven't
    // yet been checked.
    if (tNode) {
        if (tNode.inputs === undefined) {
            // mark inputs as checked
            tNode.inputs = generatePropertyAliases(tNode, 0 /* Input */);
        }
        return tNode.inputs;
    }
    return null;
}
export function getCleanup(view) {
    // top level variables should not be exported for performance reasons (PERF_NOTES.md)
    return view[CLEANUP] || (view[CLEANUP] = []);
}
function getTViewCleanup(view) {
    return view[TVIEW].cleanup || (view[TVIEW].cleanup = []);
}
/**
 * There are cases where the sub component's renderer needs to be included
 * instead of the current renderer (see the componentSyntheticHost* instructions).
 */
export function loadComponentRenderer(tNode, lView) {
    var componentLView = lView[tNode.index];
    return componentLView[RENDERER];
}
/** Handles an error thrown in an LView. */
export function handleError(lView, error) {
    var injector = lView[INJECTOR];
    var errorHandler = injector ? injector.get(ErrorHandler, null) : null;
    errorHandler && errorHandler.handleError(error);
}
/**
 * Set the inputs of directives at the current node to corresponding value.
 *
 * @param lView the `LView` which contains the directives.
 * @param inputs mapping between the public "input" name and privately-known,
 * possibly minified, property names to write to.
 * @param value Value to set.
 */
export function setInputsForProperty(lView, inputs, value) {
    var tView = lView[TVIEW];
    for (var i = 0; i < inputs.length;) {
        var index = inputs[i++];
        var publicName = inputs[i++];
        var privateName = inputs[i++];
        var instance = lView[index];
        ngDevMode && assertDataInRange(lView, index);
        var def = tView.data[index];
        var setInput = def.setInput;
        if (setInput) {
            def.setInput(instance, value, publicName, privateName);
        }
        else {
            instance[privateName] = value;
        }
    }
}
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvcmVuZGVyMy9pbnN0cnVjdGlvbnMvc2hhcmVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVFBLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUVqRCxPQUFPLEVBQUMsc0JBQXNCLEVBQUUsZ0JBQWdCLEVBQWlCLE1BQU0sdUJBQXVCLENBQUM7QUFDL0YsT0FBTyxFQUFDLDhCQUE4QixFQUFDLE1BQU0saUNBQWlDLENBQUM7QUFFL0UsT0FBTyxFQUFDLGlCQUFpQixFQUFFLGFBQWEsRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUMvSCxPQUFPLEVBQUMseUJBQXlCLEVBQUUsMEJBQTBCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUM1RixPQUFPLEVBQUMsV0FBVyxFQUFFLHNCQUFzQixFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQzlELE9BQU8sRUFBQyxlQUFlLEVBQUUsMEJBQTBCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUNqRixPQUFPLEVBQUMscUJBQXFCLEVBQUUsZ0JBQWdCLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDakUsT0FBTyxFQUFDLGtCQUFrQixFQUFFLGlCQUFpQixFQUFFLDhCQUE4QixFQUFDLE1BQU0sT0FBTyxDQUFDO0FBQzVGLE9BQU8sRUFBQywyQkFBMkIsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUN0RCxPQUFPLEVBQUMsWUFBWSxFQUFFLG9CQUFvQixFQUFFLHFCQUFxQixFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQ25GLE9BQU8sRUFBQyxZQUFZLEVBQWMsS0FBSyxFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFFeEUsT0FBTyxFQUFDLDBCQUEwQixFQUFFLG1CQUFtQixFQUFDLE1BQU0s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TSxDQUFDLENBQUMsRUFBRSxDQUFXLENBQUM7UUFDcEMsSUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFXLENBQUM7UUFDekMsSUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFXLENBQUM7UUFDMUMsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlCLFNBQVMsSUFBSSxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDN0MsSUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQXNCLENBQUM7UUFDbkQsSUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQztRQUM5QixJQUFJLFFBQVEsRUFBRTtZQUNaLEdBQUcsQ0FBQyxRQUFVLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7U0FDMUQ7YUFBTTtZQUNMLFFBQVEsQ0FBQyxXQUFXLENBQUMsR0FBRyxLQUFLLENBQUM7U0FDL0I7S0FDRjtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0luamVjdG9yfSBmcm9tICcuLi8uLi9kaSc7XG5pbXBvcnQge0Vycm9ySGFuZGxlcn0gZnJvbSAnLi4vLi4vZXJyb3JfaGFuZGxlcic7XG5pbXBvcnQge1R5cGV9IGZyb20gJy4uLy4uL2ludGVyZmFjZS90eXBlJztcbmltcG9ydCB7Q1VTVE9NX0VMRU1FTlRTX1NDSEVNQSwgTk9fRVJST1JTX1NDSEVNQSwgU2NoZW1hTWV0YWRhdGF9IGZyb20gJy4uLy4uL21ldGFkYXRhL3NjaGVtYSc7XG5pbXBvcnQge3ZhbGlkYXRlQWdhaW5zdEV2ZW50UHJvcGVydGllc30gZnJvbSAnLi4vLi4vc2FuaXRpemF0aW9uL3Nhbml0aXphdGlvbic7XG5pbXBvcnQge1Nhbml0aXplcn0gZnJvbSAnLi4vLi4vc2FuaXRpemF0aW9uL3NlY3VyaXR5JztcbmltcG9ydCB7YXNzZXJ0RGF0YUluUmFuZ2UsIGFzc2VydERlZmluZWQsIGFzc2VydERvbU5vZGUsIGFzc2VydEVxdWFsLCBhc3NlcnRMZXNzVGhhbiwgYXNzZXJ0Tm90RXF1YWx9IGZyb20gJy4uLy4uL3V0aWwvYXNzZXJ0JztcbmltcG9ydCB7bm9ybWFsaXplRGVidWdCaW5kaW5nTmFtZSwgbm9ybWFsaXplRGVidWdCaW5kaW5nVmFsdWV9IGZyb20gJy4uLy4uL3V0aWwvbmdfcmVmbGVjdCc7XG5pbXBvcnQge2Fzc2VydExWaWV3LCBhc3NlcnRQcmV2aW91c0lzUGFyZW50fSBmcm9tICcuLi9hc3NlcnQnO1xuaW1wb3J0IHthdHRhY2hQYXRjaERhdGEsIGdldENvbXBvbmVudFZpZXdCeUluc3RhbmNlfSBmcm9tICcuLi9jb250ZXh0X2Rpc2NvdmVyeSc7XG5pbXBvcnQge2F0dGFjaExDb250YWluZXJEZWJ1ZywgYXR0YWNoTFZpZXdEZWJ1Z30gZnJvbSAnLi4vZGVidWcnO1xuaW1wb3J0IHtkaVB1YmxpY0luSW5qZWN0b3IsIGdldE5vZGVJbmplY3RhYmxlLCBnZXRPckNyZWF0ZU5vZGVJbmplY3RvckZvck5vZGV9IGZyb20gJy4uL2RpJztcbmltcG9ydCB7dGhyb3dNdWx0aXBsZUNvbXBvbmVudEVycm9yfSBmcm9tICcuLi9lcnJvcnMnO1xuaW1wb3J0IHtleGVjdXRlSG9va3MsIGV4ZWN1dGVQcmVPcmRlckhvb2tzLCByZWdpc3RlclByZU9yZGVySG9va3N9IGZyb20gJy4uL2hvb2tzJztcbmltcG9ydCB7QUNUSVZFX0lOREVYLCBMQ29udGFpbmVyLCBWSUVXU30gZnJvbSAnLi4vaW50ZXJmYWNlcy9jb250YWluZXInO1xuaW1wb3J0IHtDb21wb25lbnREZWYsIENvbXBvbmVudFRlbXBsYXRlLCBEaXJlY3RpdmVEZWYsIERpcmVjdGl2ZURlZkxpc3RPckZhY3RvcnksIFBpcGVEZWZMaXN0T3JGYWN0b3J5LCBSZW5kZXJGbGFncywgVmlld1F1ZXJpZXNGdW5jdGlvbn0gZnJvbSAnLi4vaW50ZXJmYWNlcy9kZWZpbml0aW9uJztcbmltcG9ydCB7SU5KRUNUT1JfQkxPT01fUEFSRU5UX1NJWkUsIE5vZGVJbmplY3RvckZhY3Rvcnl9IGZyb20gJy4uL2ludGVyZmFjZXMvaW5qZWN0b3InO1xuaW1wb3J0IHtBdHRyaWJ1dGVNYXJrZXIsIEluaXRpYWxJbnB1dERhdGEsIEluaXRpYWxJbnB1dHMsIExvY2FsUmVmRXh0cmFjdG9yLCBQcm9wZXJ0eUFsaWFzVmFsdWUsIFByb3BlcnR5QWxpYXNlcywgVEF0dHJpYnV0ZXMsIFRDb250YWluZXJOb2RlLCBURWxlbWVudENvbnRhaW5lck5vZGUsIFRFbGVtZW50Tm9kZSwgVEljdUNvbnRhaW5lck5vZGUsIFROb2RlLCBUTm9kZUZsYWdzLCBUTm9kZVByb3ZpZGVySW5kZXhlcywgVE5vZGVUeXBlLCBUUHJvamVjdGlvbk5vZGUsIFRWaWV3Tm9kZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9ub2RlJztcbmltcG9ydCB7TFF1ZXJpZXN9IGZyb20gJy4uL2ludGVyZmFjZXMvcXVlcnknO1xuaW1wb3J0IHtSQ29tbWVudCwgUkVsZW1lbnQsIFJUZXh0LCBSZW5kZXJlcjMsIFJlbmRlcmVyRmFjdG9yeTMsIGlzUHJvY2VkdXJhbFJlbmRlcmVyfSBmcm9tICcuLi9pbnRlcmZhY2VzL3JlbmRlcmVyJztcbmltcG9ydCB7U2FuaXRpemVyRm59IGZyb20gJy4uL2ludGVyZmFjZXMvc2FuaXRpemF0aW9uJztcbmltcG9ydCB7U3R5bGluZ0NvbnRleHR9IGZyb20gJy4uL2ludGVyZmFjZXMvc3R5bGluZyc7XG5pbXBvcnQge0JJTkRJTkdfSU5ERVgsIENISUxEX0hFQUQsIENISUxEX1RBSUwsIENMRUFOVVAsIENPTlRFWFQsIERFQ0xBUkFUSU9OX1ZJRVcsIEV4cGFuZG9JbnN0cnVjdGlvbnMsIEZMQUdTLCBIRUFERVJfT0ZGU0VULCBIT1NULCBJTkpFQ1RPUiwgSW5pdFBoYXNlU3RhdGUsIExWaWV3LCBMVmlld0ZsYWdzLCBORVhULCBQQVJFTlQsIFFVRVJJRVMsIFJFTkRFUkVSLCBSRU5ERVJFUl9GQUNUT1JZLCBSb290Q29udGV4dCwgUm9vdENvbnRleHRGbGFncywgU0FOSVRJWkVSLCBURGF0YSwgVFZJRVcsIFRWaWV3LCBUX0hPU1R9IGZyb20gJy4uL2ludGVyZmFjZXMvdmlldyc7XG5pbXBvcnQge2Fzc2VydE5vZGVPZlBvc3NpYmxlVHlwZXMsIGFzc2VydE5vZGVUeXBlfSBmcm9tICcuLi9ub2RlX2Fzc2VydCc7XG5pbXBvcnQge2lzTm9kZU1hdGNoaW5nU2VsZWN0b3JMaXN0fSBmcm9tICcuLi9ub2RlX3NlbGVjdG9yX21hdGNoZXInO1xuaW1wb3J0IHtlbnRlclZpZXcsIGdldEJpbmRpbmdzRW5hYmxlZCwgZ2V0Q2hlY2tOb0NoYW5nZXNNb2RlLCBnZXRJc1BhcmVudCwgZ2V0TFZpZXcsIGdldE5hbWVzcGFjZSwgZ2V0UHJldmlvdXNPclBhcmVudFROb2RlLCBnZXRTZWxlY3RlZEluZGV4LCBpbmNyZW1lbnRBY3RpdmVEaXJlY3RpdmVJZCwgaXNDcmVhdGlvbk1vZGUsIGxlYXZlVmlldywgcmVzZXRDb21wb25lbnRTdGF0ZSwgc2V0QWN0aXZlSG9zdEVsZW1lbnQsIHNldEJpbmRpbmdSb290LCBzZXRDaGVja05vQ2hhbmdlc01vZGUsIHNldEN1cnJlbnREaXJlY3RpdmVEZWYsIHNldEN1cnJlbnRRdWVyeUluZGV4LCBzZXRJc1BhcmVudCwgc2V0UHJldmlvdXNPclBhcmVudFROb2RlLCBzZXRTZWxlY3RlZEluZGV4LCDJtcm1bmFtZXNwYWNlSFRNTH0gZnJvbSAnLi4vc3RhdGUnO1xuaW1wb3J0IHtpbml0aWFsaXplU3RhdGljQ29udGV4dCBhcyBpbml0aWFsaXplU3RhdGljU3R5bGluZ0NvbnRleHR9IGZyb20gJy4uL3N0eWxpbmcvY2xhc3NfYW5kX3N0eWxlX2JpbmRpbmdzJztcbmltcG9ydCB7QU5JTUFUSU9OX1BST1BfUFJFRklYLCBpc0FuaW1hdGlvblByb3B9IGZyb20gJy4uL3N0eWxpbmcvdXRpbCc7XG5pbXBvcnQge05PX0NIQU5HRX0gZnJvbSAnLi4vdG9rZW5zJztcbmltcG9ydCB7YXR0cnNTdHlsaW5nSW5kZXhPZn0gZnJvbSAnLi4vdXRpbC9hdHRyc191dGlscyc7XG5pbXBvcnQge0lOVEVSUE9MQVRJT05fREVMSU1JVEVSLCBzdHJpbmdpZnlGb3JFcnJvcn0gZnJvbSAnLi4vdXRpbC9taXNjX3V0aWxzJztcbmltcG9ydCB7Z2V0TFZpZXdQYXJlbnQsIGdldFJvb3RDb250ZXh0fSBmcm9tICcuLi91dGlsL3ZpZXdfdHJhdmVyc2FsX3V0aWxzJztcbmltcG9ydCB7Z2V0Q29tcG9uZW50Vmlld0J5SW5kZXgsIGdldE5hdGl2ZUJ5SW5kZXgsIGdldE5hdGl2ZUJ5VE5vZGUsIGdldFROb2RlLCBpc0NvbXBvbmVudCwgaXNDb21wb25lbnREZWYsIGlzQ29udGVudFF1ZXJ5SG9zdCwgaXNSb290VmlldywgcmVhZFBhdGNoZWRMVmlldywgcmVzZXRQcmVPcmRlckhvb2tGbGFncywgdW53cmFwUk5vZGUsIHZpZXdBdHRhY2hlZFRvQ2hhbmdlRGV0ZWN0b3J9IGZyb20gJy4uL3V0aWwvdmlld191dGlscyc7XG5cblxuXG4vKipcbiAqIEEgcGVybWFuZW50IG1hcmtlciBwcm9taXNlIHdoaWNoIHNpZ25pZmllcyB0aGF0IHRoZSBjdXJyZW50IENEIHRyZWUgaXNcbiAqIGNsZWFuLlxuICovXG5jb25zdCBfQ0xFQU5fUFJPTUlTRSA9ICgoKSA9PiBQcm9taXNlLnJlc29sdmUobnVsbCkpKCk7XG5cbmV4cG9ydCBjb25zdCBlbnVtIEJpbmRpbmdEaXJlY3Rpb24ge1xuICBJbnB1dCxcbiAgT3V0cHV0LFxufVxuXG4vKipcbiAqIFJlZnJlc2hlcyB0aGUgdmlldywgZXhlY3V0aW5nIHRoZSBmb2xsb3dpbmcgc3RlcHMgaW4gdGhhdCBvcmRlcjpcbiAqIHRyaWdnZXJzIGluaXQgaG9va3MsIHJlZnJlc2hlcyBkeW5hbWljIGVtYmVkZGVkIHZpZXdzLCB0cmlnZ2VycyBjb250ZW50IGhvb2tzLCBzZXRzIGhvc3RcbiAqIGJpbmRpbmdzLCByZWZyZXNoZXMgY2hpbGQgY29tcG9uZW50cy5cbiAqIE5vdGU6IHZpZXcgaG9va3MgYXJlIHRyaWdnZXJlZCBsYXRlciB3aGVuIGxlYXZpbmcgdGhlIHZpZXcuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWZyZXNoRGVzY2VuZGFudFZpZXdzKGxWaWV3OiBMVmlldykge1xuICBjb25zdCB0VmlldyA9IGxWaWV3W1RWSUVXXTtcbiAgY29uc3QgY3JlYXRpb25Nb2RlID0gaXNDcmVhdGlvbk1vZGUobFZpZXcpO1xuXG4gIC8vIFRoaXMgbmVlZHMgdG8gYmUgc2V0IGJlZm9yZSBjaGlsZHJlbiBhcmUgcHJvY2Vzc2VkIHRvIHN1cHBvcnQgcmVjdXJzaXZlIGNvbXBvbmVudHNcbiAgdFZpZXcuZmlyc3RUZW1wbGF0ZVBhc3MgPSBmYWxzZTtcblxuICAvLyBSZXNldHRpbmcgdGhlIGJpbmRpbmdJbmRleCBvZiB0aGUgY3VycmVudCBMVmlldyBhcyB0aGUgbmV4dCBzdGVwcyBtYXkgdHJpZ2dlciBjaGFuZ2UgZGV0ZWN0aW9uLlxuICBsVmlld1tCSU5ESU5HX0lOREVYXSA9IHRWaWV3LmJpbmRpbmdTdGFydEluZGV4O1xuXG4gIC8vIElmIHRoaXMgaXMgYSBjcmVhdGlvbiBwYXNzLCB3ZSBzaG91bGQgbm90IGNhbGwgbGlmZWN5Y2xlIGhvb2tzIG9yIGV2YWx1YXRlIGJpbmRpbmdzLlxuICAvLyBUaGlzIHdpbGwgYmUgZG9uZSBpbiB0aGUgdXBkYXRlIHBhc3MuXG4gIGlmICghY3JlYXRpb25Nb2RlKSB7XG4gICAgY29uc3QgY2hlY2tOb0NoYW5nZXNNb2RlID0gZ2V0Q2hlY2tOb0NoYW5nZXNNb2RlKCk7XG5cbiAgICBleGVjdXRlUHJlT3JkZXJIb29rcyhsVmlldywgdFZpZXcsIGNoZWNrTm9DaGFuZ2VzTW9kZSwgdW5kZWZpbmVkKTtcblxuICAgIHJlZnJlc2hEeW5hbWljRW1iZWRkZWRWaWV3cyhsVmlldyk7XG5cbiAgICAvLyBDb250ZW50IHF1ZXJ5IHJlc3VsdHMgbXVzdCBiZSByZWZyZXNoZWQgYmVmb3JlIGNvbnRlbnQgaG9va3MgYXJlIGNhbGxlZC5cbiAgICByZWZyZXNoQ29udGVudFF1ZXJpZXModFZpZXcsIGxWaWV3KTtcblxuICAgIHJlc2V0UHJlT3JkZXJIb29rRmxhZ3MobFZpZXcpO1xuICAgIGV4ZWN1dGVIb29rcyhcbiAgICAgICAgbFZpZXcsIHRWaWV3LmNvbnRlbnRIb29rcywgdFZpZXcuY29udGVudENoZWNrSG9va3MsIGNoZWNrTm9DaGFuZ2VzTW9kZSxcbiAgICAgICAgSW5pdFBoYXNlU3RhdGUuQWZ0ZXJDb250ZW50SW5pdEhvb2tzVG9CZVJ1biwgdW5kZWZpbmVkKTtcblxuICAgIHNldEhvc3RCaW5kaW5ncyh0VmlldywgbFZpZXcpO1xuICB9XG5cbiAgLy8gV2UgcmVzb2x2ZSBjb250ZW50IHF1ZXJpZXMgc3BlY2lmaWNhbGx5IG1hcmtlZCBhcyBgc3RhdGljYCBpbiBjcmVhdGlvbiBtb2RlLiBEeW5hbWljXG4gIC8vIGNvbnRlbnQgcXVlcmllcyBhcmUgcmVzb2x2ZWQgZHVyaW5nIGNoYW5nZSBkZXRlY3Rpb24gKGkuZS4gdXBkYXRlIG1vZGUpLCBhZnRlciBlbWJlZGRlZFxuICAvLyB2aWV3cyBhcmUgcmVmcmVzaGVkIChzZWUgYmxvY2sgYWJvdmUpLlxuICBpZiAoY3JlYXRpb25Nb2RlICYmIHRWaWV3LnN0YXRpY0NvbnRlbnRRdWVyaWVzKSB7XG4gICAgcmVmcmVzaENvbnRlbnRRdWVyaWVzKHRWaWV3LCBsVmlldyk7XG4gIH1cblxuICByZWZyZXNoQ2hpbGRDb21wb25lbnRzKHRWaWV3LmNvbXBvbmVudHMpO1xufVxuXG5cbi8qKiBTZXRzIHRoZSBob3N0IGJpbmRpbmdzIGZvciB0aGUgY3VycmVudCB2aWV3LiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldEhvc3RCaW5kaW5ncyh0VmlldzogVFZpZXcsIHZpZXdEYXRhOiBMVmlldyk6IHZvaWQge1xuICBjb25zdCBzZWxlY3RlZEluZGV4ID0gZ2V0U2VsZWN0ZWRJbmRleCgpO1xuICB0cnkge1xuICAgIGlmICh0Vmlldy5leHBhbmRvSW5zdHJ1Y3Rpb25zKSB7XG4gICAgICBsZXQgYmluZGluZ1Jvb3RJbmRleCA9IHZpZXdEYXRhW0JJTkRJTkdfSU5ERVhdID0gdFZpZXcuZXhwYW5kb1N0YXJ0SW5kZXg7XG4gICAgICBzZXRCaW5kaW5nUm9vdChiaW5kaW5nUm9vdEluZGV4KTtcbiAgICAgIGxldCBjdXJyZW50RGlyZWN0aXZlSW5kZXggPSAtMTtcbiAgICAgIGxldCBjdXJyZW50RWxlbWVudEluZGV4ID0gLTE7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRWaWV3LmV4cGFuZG9JbnN0cnVjdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgaW5zdHJ1Y3Rpb24gPSB0Vmlldy5leHBhbmRvSW5zdHJ1Y3Rpb25zW2ldO1xuICAgICAgICBpZiAodHlwZW9mIGluc3RydWN0aW9uID09PSAnbnVtYmVyJykge1xuICAgICAgICAgIGlmIChpbnN0cnVjdGlvbiA8PSAwKSB7XG4gICAgICAgICAgICAvLyBOZWdhdGl2ZSBudW1iZXJzIG1lYW4gdGhhdCB3ZSBhcmUgc3RhcnRpbmcgbmV3IEVYUEFORE8gYmxvY2sgYW5kIG5lZWQgdG8gdXBkYXRlXG4gICAgICAgICAgICAvLyB0aGUgY3VycmVudCBlbGVtZW50IGFuZCBkaXJlY3RpdmUgaW5kZXguXG4gICAgICAgICAgICBjdXJyZW50RWxlbWVudEluZGV4ID0gLWluc3RydWN0aW9uO1xuICAgICAgICAgICAgc2V0QWN0aXZlSG9zdEVsZW1lbnQoY3VycmVudEVsZW1lbnRJbmRleCk7XG5cbiAgICAgICAgICAgIC8vIEluamVjdG9yIGJsb2NrIGFuZCBwcm92aWRlcnMgYXJlIHRha2VuIGludG8gYWNjb3VudC5cbiAgICAgICAgICAgIGNvbnN0IHByb3ZpZGVyQ291bnQgPSAodFZpZXcuZXhwYW5kb0luc3RydWN0aW9uc1srK2ldIGFzIG51bWJlcik7XG4gICAgICAgICAgICBiaW5kaW5nUm9vdEluZGV4ICs9IElOSkVDVE9SX0JMT09NX1BBUkVOVF9TSVpFICsgcHJvdmlkZXJDb3VudDtcblxuICAgICAgICAgICAgY3VycmVudERpcmVjdGl2ZUluZGV4ID0gYmluZGluZ1Jvb3RJbmRleDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gVGhpcyBpcyBlaXRoZXIgdGhlIGluamVjdG9yIHNpemUgKHNvIHRoZSBiaW5kaW5nIHJvb3QgY2FuIHNraXAgb3ZlciBkaXJlY3RpdmVzXG4gICAgICAgICAgICAvLyBhbmQgZ2V0IHRvIHRoZSBmaXJzdCBzZXQgb2YgaG9zdCBiaW5kaW5ncyBvbiB0aGlzIG5vZGUpIG9yIHRoZSBob3N0IHZhciBjb3VudFxuICAgICAgICAgICAgLy8gKHRvIGdldCB0byB0aGUgbmV4dCBzZXQgb2YgaG9zdCBiaW5kaW5ncyBvbiB0aGlzIG5vZGUpLlxuICAgICAgICAgICAgYmluZGluZ1Jvb3RJbmRleCArPSBpbnN0cnVjdGlvbjtcbiAgICAgICAgICB9XG4gICAgICAgICAgc2V0QmluZGluZ1Jvb3QoYmluZGluZ1Jvb3RJbmRleCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gSWYgaXQncyBub3QgYSBudW1iZXIsIGl0J3MgYSBob3N0IGJpbmRpbmcgZnVuY3Rpb24gdGhhdCBuZWVkcyB0byBiZSBleGVjdXRlZC5cbiAgICAgICAgICBpZiAoaW5zdHJ1Y3Rpb24gIT09IG51bGwpIHtcbiAgICAgICAgICAgIHZpZXdEYXRhW0JJTkRJTkdfSU5ERVhdID0gYmluZGluZ1Jvb3RJbmRleDtcbiAgICAgICAgICAgIGNvbnN0IGhvc3RDdHggPSB1bndyYXBSTm9kZSh2aWV3RGF0YVtjdXJyZW50RGlyZWN0aXZlSW5kZXhdKTtcbiAgICAgICAgICAgIGluc3RydWN0aW9uKFJlbmRlckZsYWdzLlVwZGF0ZSwgaG9zdEN0eCwgY3VycmVudEVsZW1lbnRJbmRleCk7XG5cbiAgICAgICAgICAgIC8vIEVhY2ggZGlyZWN0aXZlIGdldHMgYSB1bmlxdWVJZCB2YWx1ZSB0aGF0IGlzIHRoZSBzYW1lIGZvciBib3RoXG4gICAgICAgICAgICAvLyBjcmVhdGUgYW5kIHVwZGF0ZSBjYWxscyB3aGVuIHRoZSBob3N0QmluZGluZ3MgZnVuY3Rpb24gaXMgY2FsbGVkLiBUaGVcbiAgICAgICAgICAgIC8vIGRpcmVjdGl2ZSB1bmlxdWVJZCBpcyBub3Qgc2V0IGFueXdoZXJlLS1pdCBpcyBqdXN0IGluY3JlbWVudGVkIGJldHdlZW5cbiAgICAgICAgICAgIC8vIGVhY2ggaG9zdEJpbmRpbmdzIGNhbGwgYW5kIGlzIHVzZWZ1bCBmb3IgaGVscGluZyBpbnN0cnVjdGlvbiBjb2RlXG4gICAgICAgICAgICAvLyB1bmlxdWVseSBkZXRlcm1pbmUgd2hpY2ggZGlyZWN0aXZlIGlzIGN1cnJlbnRseSBhY3RpdmUgd2hlbiBleGVjdXRlZC5cbiAgICAgICAgICAgIGluY3JlbWVudEFjdGl2ZURpcmVjdGl2ZUlkKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGN1cnJlbnREaXJlY3RpdmVJbmRleCsrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IGZpbmFsbHkge1xuICAgIHNldEFjdGl2ZUhvc3RFbGVtZW50KHNlbGVjdGVkSW5kZXgpO1xuICB9XG59XG5cbi8qKiBSZWZyZXNoZXMgY29udGVudCBxdWVyaWVzIGZvciBhbGwgZGlyZWN0aXZlcyBpbiB0aGUgZ2l2ZW4gdmlldy4gKi9cbmZ1bmN0aW9uIHJlZnJlc2hDb250ZW50UXVlcmllcyh0VmlldzogVFZpZXcsIGxWaWV3OiBMVmlldyk6IHZvaWQge1xuICBpZiAodFZpZXcuY29udGVudFF1ZXJpZXMgIT0gbnVsbCkge1xuICAgIHNldEN1cnJlbnRRdWVyeUluZGV4KDApO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdFZpZXcuY29udGVudFF1ZXJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGRpcmVjdGl2ZURlZklkeCA9IHRWaWV3LmNvbnRlbnRRdWVyaWVzW2ldO1xuICAgICAgY29uc3QgZGlyZWN0aXZlRGVmID0gdFZpZXcuZGF0YVtkaXJlY3RpdmVEZWZJZHhdIGFzIERpcmVjdGl2ZURlZjxhbnk+O1xuICAgICAgbmdEZXZNb2RlICYmXG4gICAgICAgICAgYXNzZXJ0RGVmaW5lZChkaXJlY3RpdmVEZWYuY29udGVudFF1ZXJpZXMsICdjb250ZW50UXVlcmllcyBmdW5jdGlvbiBzaG91bGQgYmUgZGVmaW5lZCcpO1xuICAgICAgZGlyZWN0aXZlRGVmLmNvbnRlbnRRdWVyaWVzICEoUmVuZGVyRmxhZ3MuVXBkYXRlLCBsVmlld1tkaXJlY3RpdmVEZWZJZHhdLCBkaXJlY3RpdmVEZWZJZHgpO1xuICAgIH1cbiAgfVxufVxuXG4vKiogUmVmcmVzaGVzIGNoaWxkIGNvbXBvbmVudHMgaW4gdGhlIGN1cnJlbnQgdmlldy4gKi9cbmZ1bmN0aW9uIHJlZnJlc2hDaGlsZENvbXBvbmVudHMoY29tcG9uZW50czogbnVtYmVyW10gfCBudWxsKTogdm9pZCB7XG4gIGlmIChjb21wb25lbnRzICE9IG51bGwpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbXBvbmVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbXBvbmVudFJlZnJlc2goY29tcG9uZW50c1tpXSk7XG4gICAgfVxuICB9XG59XG5cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmF0aXZlIGVsZW1lbnQgZnJvbSBhIHRhZyBuYW1lLCB1c2luZyBhIHJlbmRlcmVyLlxuICogQHBhcmFtIG5hbWUgdGhlIHRhZyBuYW1lXG4gKiBAcGFyYW0gb3ZlcnJpZGRlblJlbmRlcmVyIE9wdGlvbmFsIEEgcmVuZGVyZXIgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHQgb25lXG4gKiBAcmV0dXJucyB0aGUgZWxlbWVudCBjcmVhdGVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBlbGVtZW50Q3JlYXRlKG5hbWU6IHN0cmluZywgb3ZlcnJpZGRlblJlbmRlcmVyPzogUmVuZGVyZXIzKTogUkVsZW1lbnQge1xuICBsZXQgbmF0aXZlOiBSRWxlbWVudDtcbiAgY29uc3QgcmVuZGVyZXJUb1VzZSA9IG92ZXJyaWRkZW5SZW5kZXJlciB8fCBnZXRMVmlldygpW1JFTkRFUkVSXTtcblxuICBjb25zdCBuYW1lc3BhY2UgPSBnZXROYW1lc3BhY2UoKTtcblxuICBpZiAoaXNQcm9jZWR1cmFsUmVuZGVyZXIocmVuZGVyZXJUb1VzZSkpIHtcbiAgICBuYXRpdmUgPSByZW5kZXJlclRvVXNlLmNyZWF0ZUVsZW1lbnQobmFtZSwgbmFtZXNwYWNlKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAobmFtZXNwYWNlID09PSBudWxsKSB7XG4gICAgICBuYXRpdmUgPSByZW5kZXJlclRvVXNlLmNyZWF0ZUVsZW1lbnQobmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hdGl2ZSA9IHJlbmRlcmVyVG9Vc2UuY3JlYXRlRWxlbWVudE5TKG5hbWVzcGFjZSwgbmFtZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBuYXRpdmU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVMVmlldzxUPihcbiAgICBwYXJlbnRMVmlldzogTFZpZXcgfCBudWxsLCB0VmlldzogVFZpZXcsIGNvbnRleHQ6IFQgfCBudWxsLCBmbGFnczogTFZpZXdGbGFncyxcbiAgICBob3N0OiBSRWxlbWVudCB8IG51bGwsIHRIb3N0Tm9kZTogVFZpZXdOb2RlIHwgVEVsZW1lbnROb2RlIHwgbnVsbCxcbiAgICByZW5kZXJlckZhY3Rvcnk/OiBSZW5kZXJlckZhY3RvcnkzIHwgbnVsbCwgcmVuZGVyZXI/OiBSZW5kZXJlcjMgfCBudWxsLFxuICAgIHNhbml0aXplcj86IFNhbml0aXplciB8IG51bGwsIGluamVjdG9yPzogSW5qZWN0b3IgfCBudWxsKTogTFZpZXcge1xuICBjb25zdCBsVmlldyA9IHRWaWV3LmJsdWVwcmludC5zbGljZSgpIGFzIExWaWV3O1xuICBsVmlld1tIT1NUXSA9IGhvc3Q7XG4gIGxWaWV3W0ZMQUdTXSA9IGZsYWdzIHwgTFZpZXdGbGFncy5DcmVhdGlvbk1vZGUgfCBMVmlld0ZsYWdzLkF0dGFjaGVkIHwgTFZpZXdGbGFncy5GaXJzdExWaWV3UGFzcztcbiAgcmVzZXRQcmVPcmRlckhvb2tGbGFncyhsVmlldyk7XG4gIGxWaWV3W1BBUkVOVF0gPSBsVmlld1tERUNMQVJBVElPTl9WSUVXXSA9IHBhcmVudExWaWV3O1xuICBsVmlld1tDT05URVhUXSA9IGNvbnRleHQ7XG4gIGxWaWV3W1JFTkRFUkVSX0ZBQ1RPUlldID0gKHJlbmRlcmVyRmFjdG9yeSB8fCBwYXJlbnRMVmlldyAmJiBwYXJlbnRMVmlld1tSRU5ERVJFUl9GQUNUT1JZXSkgITtcbiAgbmdEZXZNb2RlICYmIGFzc2VydERlZmluZWQobFZpZXdbUkVOREVSRVJfRkFDVE9SWV0sICdSZW5kZXJlckZhY3RvcnkgaXMgcmVxdWlyZWQnKTtcbiAgbFZpZXdbUkVOREVSRVJdID0gKHJlbmRlcmVyIHx8IHBhcmVudExWaWV3ICYmIHBhcmVudExWaWV3W1JFTkRFUkVSXSkgITtcbiAgbmdEZXZNb2RlICYmIGFzc2VydERlZmluZWQobFZpZXdbUkVOREVSRVJdLCAnUmVuZGVyZXIgaXMgcmVxdWlyZWQnKTtcbiAgbFZpZXdbU0FOSVRJWkVSXSA9IHNhbml0aXplciB8fCBwYXJlbnRMVmlldyAmJiBwYXJlbnRMVmlld1tTQU5JVElaRVJdIHx8IG51bGwgITtcbiAgbFZpZXdbSU5KRUNUT1IgYXMgYW55XSA9IGluamVjdG9yIHx8IHBhcmVudExWaWV3ICYmIHBhcmVudExWaWV3W0lOSkVDVE9SXSB8fCBudWxsO1xuICBsVmlld1tUX0hPU1RdID0gdEhvc3ROb2RlO1xuICBuZ0Rldk1vZGUgJiYgYXR0YWNoTFZpZXdEZWJ1ZyhsVmlldyk7XG4gIHJldHVybiBsVmlldztcbn1cblxuLyoqXG4gKiBDcmVhdGUgYW5kIHN0b3JlcyB0aGUgVE5vZGUsIGFuZCBob29rcyBpdCB1cCB0byB0aGUgdHJlZS5cbiAqXG4gKiBAcGFyYW0gaW5kZXggVGhlIGluZGV4IGF0IHdoaWNoIHRoZSBUTm9kZSBzaG91bGQgYmUgc2F2ZWQgKG51bGwgaWYgdmlldywgc2luY2UgdGhleSBhcmUgbm90XG4gKiBzYXZlZCkuXG4gKiBAcGFyYW0gdHlwZSBUaGUgdHlwZSBvZiBUTm9kZSB0byBjcmVhdGVcbiAqIEBwYXJhbSBuYXRpdmUgVGhlIG5hdGl2ZSBlbGVtZW50IGZvciB0aGlzIG5vZGUsIGlmIGFwcGxpY2FibGVcbiAqIEBwYXJhbSBuYW1lIFRoZSB0YWcgbmFtZSBvZiB0aGUgYXNzb2NpYXRlZCBuYXRpdmUgZWxlbWVudCwgaWYgYXBwbGljYWJsZVxuICogQHBhcmFtIGF0dHJzIEFueSBhdHRycyBmb3IgdGhlIG5hdGl2ZSBlbGVtZW50LCBpZiBhcHBsaWNhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVOb2RlQXRJbmRleChcbiAgICBpbmRleDogbnVtYmVyLCB0eXBlOiBUTm9kZVR5cGUuRWxlbWVudCwgbmF0aXZlOiBSRWxlbWVudCB8IFJUZXh0IHwgbnVsbCwgbmFtZTogc3RyaW5nIHwgbnVsbCxcbiAgICBhdHRyczogVEF0dHJpYnV0ZXMgfCBudWxsKTogVEVsZW1lbnROb2RlO1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU5vZGVBdEluZGV4KFxuICAgIGluZGV4OiBudW1iZXIsIHR5cGU6IFROb2RlVHlwZS5Db250YWluZXIsIG5hdGl2ZTogUkNvbW1lbnQsIG5hbWU6IHN0cmluZyB8IG51bGwsXG4gICAgYXR0cnM6IFRBdHRyaWJ1dGVzIHwgbnVsbCk6IFRDb250YWluZXJOb2RlO1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU5vZGVBdEluZGV4KFxuICAgIGluZGV4OiBudW1iZXIsIHR5cGU6IFROb2RlVHlwZS5Qcm9qZWN0aW9uLCBuYXRpdmU6IG51bGwsIG5hbWU6IG51bGwsXG4gICAgYXR0cnM6IFRBdHRyaWJ1dGVzIHwgbnVsbCk6IFRQcm9qZWN0aW9uTm9kZTtcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVOb2RlQXRJbmRleChcbiAgICBpbmRleDogbnVtYmVyLCB0eXBlOiBUTm9kZVR5cGUuRWxlbWVudENvbnRhaW5lciwgbmF0aXZlOiBSQ29tbWVudCwgbmFtZTogc3RyaW5nIHwgbnVsbCxcbiAgICBhdHRyczogVEF0dHJpYnV0ZXMgfCBudWxsKTogVEVsZW1lbnRDb250YWluZXJOb2RlO1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU5vZGVBdEluZGV4KFxuICAgIGluZGV4OiBudW1iZXIsIHR5cGU6IFROb2RlVHlwZS5JY3VDb250YWluZXIsIG5hdGl2ZTogUkNvbW1lbnQsIG5hbWU6IG51bGwsXG4gICAgYXR0cnM6IFRBdHRyaWJ1dGVzIHwgbnVsbCk6IFRFbGVtZW50Q29udGFpbmVyTm9kZTtcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVOb2RlQXRJbmRleChcbiAgICBpbmRleDogbnVtYmVyLCB0eXBlOiBUTm9kZVR5cGUsIG5hdGl2ZTogUlRleHQgfCBSRWxlbWVudCB8IFJDb21tZW50IHwgbnVsbCwgbmFtZTogc3RyaW5nIHwgbnVsbCxcbiAgICBhdHRyczogVEF0dHJpYnV0ZXMgfCBudWxsKTogVEVsZW1lbnROb2RlJlRDb250YWluZXJOb2RlJlRFbGVtZW50Q29udGFpbmVyTm9kZSZUUHJvamVjdGlvbk5vZGUmXG4gICAgVEljdUNvbnRhaW5lck5vZGUge1xuICBjb25zdCBsVmlldyA9IGdldExWaWV3KCk7XG4gIGNvbnN0IHRWaWV3ID0gbFZpZXdbVFZJRVddO1xuICBjb25zdCBhZGp1c3RlZEluZGV4ID0gaW5kZXggKyBIRUFERVJfT0ZGU0VUO1xuICBuZ0Rldk1vZGUgJiZcbiAgICAgIGFzc2VydExlc3NUaGFuKGFkanVzdGVkSW5kZXgsIGxWaWV3Lmxlbmd0aCwgYFNsb3Qgc2hvdWxkIGhhdmUgYmVlbiBpbml0aWFsaXplZCB3aXRoIG51bGxgKTtcbiAgbFZpZXdbYWRqdXN0ZWRJbmRleF0gPSBuYXRpdmU7XG5cbiAgY29uc3QgcHJldmlvdXNPclBhcmVudFROb2RlID0gZ2V0UHJldmlvdXNPclBhcmVudFROb2RlKCk7XG4gIGNvbnN0IGlzUGFyZW50ID0gZ2V0SXNQYXJlbnQoKTtcbiAgbGV0IHROb2RlID0gdFZpZXcuZGF0YVthZGp1c3RlZEluZGV4XSBhcyBUTm9kZTtcbiAgaWYgKHROb2RlID09IG51bGwpIHtcbiAgICBjb25zdCBwYXJlbnQgPVxuICAgICAgICBpc1BhcmVudCA/IHByZXZpb3VzT3JQYXJlbnRUTm9kZSA6IHByZXZpb3VzT3JQYXJlbnRUTm9kZSAmJiBwcmV2aW91c09yUGFyZW50VE5vZGUucGFyZW50O1xuXG4gICAgLy8gUGFyZW50cyBjYW5ub3QgY3Jvc3MgY29tcG9uZW50IGJvdW5kYXJpZXMgYmVjYXVzZSBjb21wb25lbnRzIHdpbGwgYmUgdXNlZCBpbiBtdWx0aXBsZSBwbGFjZXMsXG4gICAgLy8gc28gaXQncyBvbmx5IHNldCBpZiB0aGUgdmlldyBpcyB0aGUgc2FtZS5cbiAgICBjb25zdCBwYXJlbnRJblNhbWVWaWV3ID0gcGFyZW50ICYmIHBhcmVudCAhPT0gbFZpZXdbVF9IT1NUXTtcbiAgICBjb25zdCB0UGFyZW50Tm9kZSA9IHBhcmVudEluU2FtZVZpZXcgPyBwYXJlbnQgYXMgVEVsZW1lbnROb2RlIHwgVENvbnRhaW5lck5vZGUgOiBudWxsO1xuXG4gICAgdE5vZGUgPSB0Vmlldy5kYXRhW2FkanVzdGVkSW5kZXhdID0gY3JlYXRlVE5vZGUodFBhcmVudE5vZGUsIHR5cGUsIGFkanVzdGVkSW5kZXgsIG5hbWUsIGF0dHJzKTtcbiAgfVxuXG4gIC8vIE5vdyBsaW5rIG91cnNlbHZlcyBpbnRvIHRoZSB0cmVlLlxuICAvLyBXZSBuZWVkIHRoaXMgZXZlbiBpZiB0Tm9kZSBleGlzdHMsIG90aGVyd2lzZSB3ZSBtaWdodCBlbmQgdXAgcG9pbnRpbmcgdG8gdW5leGlzdGluZyB0Tm9kZXMgd2hlblxuICAvLyB3ZSB1c2UgaTE4biAoZXNwZWNpYWxseSB3aXRoIElDVSBleHByZXNzaW9ucyB0aGF0IHVwZGF0ZSB0aGUgRE9NIGR1cmluZyB0aGUgdXBkYXRlIHBoYXNlKS5cbiAgaWYgKHByZXZpb3VzT3JQYXJlbnRUTm9kZSkge1xuICAgIGlmIChpc1BhcmVudCAmJiBwcmV2aW91c09yUGFyZW50VE5vZGUuY2hpbGQgPT0gbnVsbCAmJlxuICAgICAgICAodE5vZGUucGFyZW50ICE9PSBudWxsIHx8IHByZXZpb3VzT3JQYXJlbnRUTm9kZS50eXBlID09PSBUTm9kZVR5cGUuVmlldykpIHtcbiAgICAgIC8vIFdlIGFyZSBpbiB0aGUgc2FtZSB2aWV3LCB3aGljaCBtZWFucyB3ZSBhcmUgYWRkaW5nIGNvbnRlbnQgbm9kZSB0byB0aGUgcGFyZW50IHZpZXcuXG4gICAgICBwcmV2aW91c09yUGFyZW50VE5vZGUuY2hpbGQgPSB0Tm9kZTtcbiAgICB9IGVsc2UgaWYgKCFpc1BhcmVudCkge1xuICAgICAgcHJldmlvdXNPclBhcmVudFROb2RlLm5leHQgPSB0Tm9kZTtcbiAgICB9XG4gIH1cblxuICBpZiAodFZpZXcuZmlyc3RDaGlsZCA9PSBudWxsKSB7XG4gICAgdFZpZXcuZmlyc3RDaGlsZCA9IHROb2RlO1xuICB9XG5cbiAgc2V0UHJldmlvdXNPclBhcmVudFROb2RlKHROb2RlKTtcbiAgc2V0SXNQYXJlbnQodHJ1ZSk7XG4gIHJldHVybiB0Tm9kZSBhcyBURWxlbWVudE5vZGUgJiBUVmlld05vZGUgJiBUQ29udGFpbmVyTm9kZSAmIFRFbGVtZW50Q29udGFpbmVyTm9kZSAmXG4gICAgICBUUHJvamVjdGlvbk5vZGUgJiBUSWN1Q29udGFpbmVyTm9kZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2lnblRWaWV3Tm9kZVRvTFZpZXcoXG4gICAgdFZpZXc6IFRWaWV3LCB0UGFyZW50Tm9kZTogVE5vZGUgfCBudWxsLCBpbmRleDogbnVtYmVyLCBsVmlldzogTFZpZXcpOiBUVmlld05vZGUge1xuICAvLyBWaWV3IG5vZGVzIGFyZSBub3Qgc3RvcmVkIGluIGRhdGEgYmVjYXVzZSB0aGV5IGNhbiBiZSBhZGRlZCAvIHJlbW92ZWQgYXQgcnVudGltZSAod2hpY2hcbiAgLy8gd291bGQgY2F1c2UgaW5kaWNlcyB0byBjaGFuZ2UpLiBUaGVpciBUTm9kZXMgYXJlIGluc3RlYWQgc3RvcmVkIGluIHRWaWV3Lm5vZGUuXG4gIGxldCB0Tm9kZSA9IHRWaWV3Lm5vZGU7XG4gIGlmICh0Tm9kZSA9PSBudWxsKSB7XG4gICAgbmdEZXZNb2RlICYmIHRQYXJlbnROb2RlICYmXG4gICAgICAgIGFzc2VydE5vZGVPZlBvc3NpYmxlVHlwZXModFBhcmVudE5vZGUsIFROb2RlVHlwZS5FbGVtZW50LCBUTm9kZVR5cGUuQ29udGFpbmVyKTtcbiAgICB0Vmlldy5ub2RlID0gdE5vZGUgPSBjcmVhdGVUTm9kZShcbiAgICAgICAgdFBhcmVudE5vZGUgYXMgVEVsZW1lbnROb2RlIHwgVENvbnRhaW5lck5vZGUgfCBudWxsLCAgLy9cbiAgICAgICAgVE5vZGVUeXBlLlZpZXcsIGluZGV4LCBudWxsLCBudWxsKSBhcyBUVmlld05vZGU7XG4gIH1cblxuICByZXR1cm4gbFZpZXdbVF9IT1NUXSA9IHROb2RlIGFzIFRWaWV3Tm9kZTtcbn1cblxuXG4vKipcbiAqIFdoZW4gZWxlbWVudHMgYXJlIGNyZWF0ZWQgZHluYW1pY2FsbHkgYWZ0ZXIgYSB2aWV3IGJsdWVwcmludCBpcyBjcmVhdGVkIChlLmcuIHRocm91Z2hcbiAqIGkxOG5BcHBseSgpIG9yIENvbXBvbmVudEZhY3RvcnkuY3JlYXRlKSwgd2UgbmVlZCB0byBhZGp1c3QgdGhlIGJsdWVwcmludCBmb3IgZnV0dXJlXG4gKiB0ZW1wbGF0ZSBwYXNzZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhbGxvY0V4cGFuZG8odmlldzogTFZpZXcsIG51bVNsb3RzVG9BbGxvYzogbnVtYmVyKSB7XG4gIGNvbnN0IHRWaWV3ID0gdmlld1tUVklFV107XG4gIGlmICh0Vmlldy5maXJzdFRlbXBsYXRlUGFzcykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtU2xvdHNUb0FsbG9jOyBpKyspIHtcbiAgICAgIHRWaWV3LmJsdWVwcmludC5wdXNoKG51bGwpO1xuICAgICAgdFZpZXcuZGF0YS5wdXNoKG51bGwpO1xuICAgICAgdmlldy5wdXNoKG51bGwpO1xuICAgIH1cblxuICAgIC8vIFdlIHNob3VsZCBvbmx5IGluY3JlbWVudCB0aGUgZXhwYW5kbyBzdGFydCBpbmRleCBpZiB0aGVyZSBhcmVuJ3QgYWxyZWFkeSBkaXJlY3RpdmVzXG4gICAgLy8gYW5kIGluamVjdG9ycyBzYXZlZCBpbiB0aGUgXCJleHBhbmRvXCIgc2VjdGlvblxuICAgIGlmICghdFZpZXcuZXhwYW5kb0luc3RydWN0aW9ucykge1xuICAgICAgdFZpZXcuZXhwYW5kb1N0YXJ0SW5kZXggKz0gbnVtU2xvdHNUb0FsbG9jO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBTaW5jZSB3ZSdyZSBhZGRpbmcgdGhlIGR5bmFtaWMgbm9kZXMgaW50byB0aGUgZXhwYW5kbyBzZWN0aW9uLCB3ZSBuZWVkIHRvIGxldCB0aGUgaG9zdFxuICAgICAgLy8gYmluZGluZ3Mga25vdyB0aGF0IHRoZXkgc2hvdWxkIHNraXAgeCBzbG90c1xuICAgICAgdFZpZXcuZXhwYW5kb0luc3RydWN0aW9ucy5wdXNoKG51bVNsb3RzVG9BbGxvYyk7XG4gICAgfVxuICB9XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8gUmVuZGVyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4vKipcbiAqXG4gKiBAcGFyYW0gaG9zdE5vZGUgRXhpc3Rpbmcgbm9kZSB0byByZW5kZXIgaW50by5cbiAqIEBwYXJhbSB0ZW1wbGF0ZUZuIFRlbXBsYXRlIGZ1bmN0aW9uIHdpdGggdGhlIGluc3RydWN0aW9ucy5cbiAqIEBwYXJhbSBjb25zdHMgVGhlIG51bWJlciBvZiBub2RlcywgbG9jYWwgcmVmcywgYW5kIHBpcGVzIGluIHRoaXMgdGVtcGxhdGVcbiAqIEBwYXJhbSBjb250ZXh0IHRvIHBhc3MgaW50byB0aGUgdGVtcGxhdGUuXG4gKiBAcGFyYW0gcHJvdmlkZWRSZW5kZXJlckZhY3RvcnkgcmVuZGVyZXIgZmFjdG9yeSB0byB1c2VcbiAqIEBwYXJhbSBob3N0IFRoZSBob3N0IGVsZW1lbnQgbm9kZSB0byB1c2VcbiAqIEBwYXJhbSBkaXJlY3RpdmVzIERpcmVjdGl2ZSBkZWZzIHRoYXQgc2hvdWxkIGJlIHVzZWQgZm9yIG1hdGNoaW5nXG4gKiBAcGFyYW0gcGlwZXMgUGlwZSBkZWZzIHRoYXQgc2hvdWxkIGJlIHVzZWQgZm9yIG1hdGNoaW5nXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJUZW1wbGF0ZTxUPihcbiAgICBob3N0Tm9kZTogUkVsZW1lbnQsIHRlbXBsYXRlRm46IENvbXBvbmVudFRlbXBsYXRlPFQ+LCBjb25zdHM6IG51bWJlciwgdmFyczogbnVtYmVyLCBjb250ZXh0OiBULFxuICAgIHByb3ZpZGVkUmVuZGVyZXJGYWN0b3J5OiBSZW5kZXJlckZhY3RvcnkzLCBjb21wb25lbnRWaWV3OiBMVmlldyB8IG51bGwsXG4gICAgZGlyZWN0aXZlcz86IERpcmVjdGl2ZURlZkxpc3RPckZhY3RvcnkgfCBudWxsLCBwaXBlcz86IFBpcGVEZWZMaXN0T3JGYWN0b3J5IHwgbnVsbCxcbiAgICBzYW5pdGl6ZXI/OiBTYW5pdGl6ZXIgfCBudWxsKTogTFZpZXcge1xuICBpZiAoY29tcG9uZW50VmlldyA9PT0gbnVsbCkge1xuICAgIHJlc2V0Q29tcG9uZW50U3RhdGUoKTtcbiAgICBjb25zdCByZW5kZXJlciA9IHByb3ZpZGVkUmVuZGVyZXJGYWN0b3J5LmNyZWF0ZVJlbmRlcmVyKG51bGwsIG51bGwpO1xuXG4gICAgLy8gV2UgbmVlZCB0byBjcmVhdGUgYSByb290IHZpZXcgc28gaXQncyBwb3NzaWJsZSB0byBsb29rIHVwIHRoZSBob3N0IGVsZW1lbnQgdGhyb3VnaCBpdHMgaW5kZXhcbiAgICBjb25zdCBob3N0TFZpZXcgPSBjcmVhdGVMVmlldyhcbiAgICAgICAgbnVsbCwgY3JlYXRlVFZpZXcoLTEsIG51bGwsIDEsIDAsIG51bGwsIG51bGwsIG51bGwsIG51bGwpLCB7fSxcbiAgICAgICAgTFZpZXdGbGFncy5DaGVja0Fsd2F5cyB8IExWaWV3RmxhZ3MuSXNSb290LCBudWxsLCBudWxsLCBwcm92aWRlZFJlbmRlcmVyRmFjdG9yeSwgcmVuZGVyZXIpO1xuICAgIGVudGVyVmlldyhob3N0TFZpZXcsIG51bGwpOyAgLy8gU1VTUEVDVCEgd2h5IGRvIHdlIG5lZWQgdG8gZW50ZXIgdGhlIFZpZXc/XG5cbiAgICBjb25zdCBjb21wb25lbnRUVmlldyA9XG4gICAgICAgIGdldE9yQ3JlYXRlVFZpZXcodGVtcGxhdGVGbiwgY29uc3RzLCB2YXJzLCBkaXJlY3RpdmVzIHx8IG51bGwsIHBpcGVzIHx8IG51bGwsIG51bGwsIG51bGwpO1xuICAgIGNvbnN0IGhvc3RUTm9kZSA9IGNyZWF0ZU5vZGVBdEluZGV4KDAsIFROb2RlVHlwZS5FbGVtZW50LCBob3N0Tm9kZSwgbnVsbCwgbnVsbCk7XG4gICAgY29tcG9uZW50VmlldyA9IGNyZWF0ZUxWaWV3KFxuICAgICAgICBob3N0TFZpZXcsIGNvbXBvbmVudFRWaWV3LCBjb250ZXh0LCBMVmlld0ZsYWdzLkNoZWNrQWx3YXlzLCBob3N0Tm9kZSwgaG9zdFROb2RlLFxuICAgICAgICBwcm92aWRlZFJlbmRlcmVyRmFjdG9yeSwgcmVuZGVyZXIsIHNhbml0aXplcik7XG4gIH1cbiAgcmVuZGVyQ29tcG9uZW50T3JUZW1wbGF0ZShjb21wb25lbnRWaWV3LCBjb250ZXh0LCB0ZW1wbGF0ZUZuKTtcbiAgcmV0dXJuIGNvbXBvbmVudFZpZXc7XG59XG5cbi8qKlxuICogVXNlZCBmb3IgY3JlYXRpbmcgdGhlIExWaWV3Tm9kZSBvZiBhIGR5bmFtaWMgZW1iZWRkZWQgdmlldyxcbiAqIGVpdGhlciB0aHJvdWdoIFZpZXdDb250YWluZXJSZWYuY3JlYXRlRW1iZWRkZWRWaWV3KCkgb3IgVGVtcGxhdGVSZWYuY3JlYXRlRW1iZWRkZWRWaWV3KCkuXG4gKiBTdWNoIGxWaWV3Tm9kZSB3aWxsIHRoZW4gYmUgcmVuZGVyZXIgd2l0aCByZW5kZXJFbWJlZGRlZFRlbXBsYXRlKCkgKHNlZSBiZWxvdykuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFbWJlZGRlZFZpZXdBbmROb2RlPFQ+KFxuICAgIHRWaWV3OiBUVmlldywgY29udGV4dDogVCwgZGVjbGFyYXRpb25WaWV3OiBMVmlldywgcXVlcmllczogTFF1ZXJpZXMgfCBudWxsLFxuICAgIGluamVjdG9ySW5kZXg6IG51bWJlcik6IExWaWV3IHtcbiAgY29uc3QgX2lzUGFyZW50ID0gZ2V0SXNQYXJlbnQoKTtcbiAgY29uc3QgX3ByZXZpb3VzT3JQYXJlbnRUTm9kZSA9IGdldFByZXZpb3VzT3JQYXJlbnRUTm9kZSgpO1xuICBzZXRJc1BhcmVudCh0cnVlKTtcbiAgc2V0UHJldmlvdXNPclBhcmVudFROb2RlKG51bGwgISk7XG5cbiAgY29uc3QgbFZpZXcgPSBjcmVhdGVMVmlldyhkZWNsYXJhdGlvblZpZXcsIHRWaWV3LCBjb250ZXh0LCBMVmlld0ZsYWdzLkNoZWNrQWx3YXlzLCBudWxsLCBudWxsKTtcbiAgbFZpZXdbREVDTEFSQVRJT05fVklFV10gPSBkZWNsYXJhdGlvblZpZXc7XG5cbiAgaWYgKHF1ZXJpZXMpIHtcbiAgICBsVmlld1tRVUVSSUVTXSA9IHF1ZXJpZXMuY3JlYXRlVmlldygpO1xuICB9XG4gIGFzc2lnblRWaWV3Tm9kZVRvTFZpZXcodFZpZXcsIG51bGwsIC0xLCBsVmlldyk7XG5cbiAgaWYgKHRWaWV3LmZpcnN0VGVtcGxhdGVQYXNzKSB7XG4gICAgdFZpZXcubm9kZSAhLmluamVjdG9ySW5kZXggPSBpbmplY3RvckluZGV4O1xuICB9XG5cbiAgc2V0SXNQYXJlbnQoX2lzUGFyZW50KTtcbiAgc2V0UHJldmlvdXNPclBhcmVudFROb2RlKF9wcmV2aW91c09yUGFyZW50VE5vZGUpO1xuICByZXR1cm4gbFZpZXc7XG59XG5cbi8qKlxuICogVXNlZCBmb3IgcmVuZGVyaW5nIGVtYmVkZGVkIHZpZXdzIChlLmcuIGR5bmFtaWNhbGx5IGNyZWF0ZWQgdmlld3MpXG4gKlxuICogRHluYW1pY2FsbHkgY3JlYXRlZCB2aWV3cyBtdXN0IHN0b3JlL3JldHJpZXZlIHRoZWlyIFRWaWV3cyBkaWZmZXJlbnRseSBmcm9tIGNvbXBvbmVudCB2aWV3c1xuICogYmVjYXVzZSB0aGVpciB0ZW1wbGF0ZSBmdW5jdGlvbnMgYXJlIG5lc3RlZCBpbiB0aGUgdGVtcGxhdGUgZnVuY3Rpb25zIG9mIHRoZWlyIGhvc3RzLCBjcmVhdGluZ1xuICogY2xvc3VyZXMuIElmIHRoZWlyIGhvc3QgdGVtcGxhdGUgaGFwcGVucyB0byBiZSBhbiBlbWJlZGRlZCB0ZW1wbGF0ZSBpbiBhIGxvb3AgKGUuZy4gbmdGb3IgaW5zaWRlXG4gKiBhbiBuZ0ZvciksIHRoZSBuZXN0aW5nIHdvdWxkIG1lYW4gd2UnZCBoYXZlIG11bHRpcGxlIGluc3RhbmNlcyBvZiB0aGUgdGVtcGxhdGUgZnVuY3Rpb24sIHNvIHdlXG4gKiBjYW4ndCBzdG9yZSBUVmlld3MgaW4gdGhlIHRlbXBsYXRlIGZ1bmN0aW9uIGl0c2VsZiAoYXMgd2UgZG8gZm9yIGNvbXBzKS4gSW5zdGVhZCwgd2Ugc3RvcmUgdGhlXG4gKiBUVmlldyBmb3IgZHluYW1pY2FsbHkgY3JlYXRlZCB2aWV3cyBvbiB0aGVpciBob3N0IFROb2RlLCB3aGljaCBvbmx5IGhhcyBvbmUgaW5zdGFuY2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJFbWJlZGRlZFRlbXBsYXRlPFQ+KHZpZXdUb1JlbmRlcjogTFZpZXcsIHRWaWV3OiBUVmlldywgY29udGV4dDogVCkge1xuICBjb25zdCBfaXNQYXJlbnQgPSBnZXRJc1BhcmVudCgpO1xuICBjb25zdCBfcHJldmlvdXNPclBhcmVudFROb2RlID0gZ2V0UHJldmlvdXNPclBhcmVudFROb2RlKCk7XG4gIGxldCBvbGRWaWV3OiBMVmlldztcbiAgaWYgKHZpZXdUb1JlbmRlcltGTEFHU10gJiBMVmlld0ZsYWdzLklzUm9vdCkge1xuICAgIC8vIFRoaXMgaXMgYSByb290IHZpZXcgaW5zaWRlIHRoZSB2aWV3IHRyZWVcbiAgICB0aWNrUm9vdENvbnRleHQoZ2V0Um9vdENvbnRleHQodmlld1RvUmVuZGVyKSk7XG4gIH0gZWxzZSB7XG4gICAgdHJ5IHtcbiAgICAgIHNldElzUGFyZW50KHRydWUpO1xuICAgICAgc2V0UHJldmlvdXNPclBhcmVudFROb2RlKG51bGwgISk7XG5cbiAgICAgIG9sZFZpZXcgPSBlbnRlclZpZXcodmlld1RvUmVuZGVyLCB2aWV3VG9SZW5kZXJbVF9IT1NUXSk7XG4gICAgICByZXNldFByZU9yZGVySG9va0ZsYWdzKHZpZXdUb1JlbmRlcik7XG4gICAgICBleGVjdXRlVGVtcGxhdGUodFZpZXcudGVtcGxhdGUgISwgZ2V0UmVuZGVyRmxhZ3Modmlld1RvUmVuZGVyKSwgY29udGV4dCk7XG5cbiAgICAgIC8vIFRoaXMgbXVzdCBiZSBzZXQgdG8gZmFsc2UgaW1tZWRpYXRlbHkgYWZ0ZXIgdGhlIGZpcnN0IGNyZWF0aW9uIHJ1biBiZWNhdXNlIGluIGFuXG4gICAgICAvLyBuZ0ZvciBsb29wLCBhbGwgdGhlIHZpZXdzIHdpbGwgYmUgY3JlYXRlZCB0b2dldGhlciBiZWZvcmUgdXBkYXRlIG1vZGUgcnVucyBhbmQgdHVybnNcbiAgICAgIC8vIG9mZiBmaXJzdFRlbXBsYXRlUGFzcy4gSWYgd2UgZG9uJ3Qgc2V0IGl0IGhlcmUsIGluc3RhbmNlcyB3aWxsIHBlcmZvcm0gZGlyZWN0aXZlXG4gICAgICAvLyBtYXRjaGluZywgZXRjIGFnYWluIGFuZCBhZ2Fpbi5cbiAgICAgIHZpZXdUb1JlbmRlcltUVklFV10uZmlyc3RUZW1wbGF0ZVBhc3MgPSBmYWxzZTtcblxuICAgICAgcmVmcmVzaERlc2NlbmRhbnRWaWV3cyh2aWV3VG9SZW5kZXIpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBsZWF2ZVZpZXcob2xkVmlldyAhKTtcbiAgICAgIHNldElzUGFyZW50KF9pc1BhcmVudCk7XG4gICAgICBzZXRQcmV2aW91c09yUGFyZW50VE5vZGUoX3ByZXZpb3VzT3JQYXJlbnRUTm9kZSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHJlbmRlckNvbXBvbmVudE9yVGVtcGxhdGU8VD4oXG4gICAgaG9zdFZpZXc6IExWaWV3LCBjb250ZXh0OiBULCB0ZW1wbGF0ZUZuPzogQ29tcG9uZW50VGVtcGxhdGU8VD4pIHtcbiAgY29uc3QgcmVuZGVyZXJGYWN0b3J5ID0gaG9zdFZpZXdbUkVOREVSRVJfRkFDVE9SWV07XG4gIGNvbnN0IG9sZFZpZXcgPSBlbnRlclZpZXcoaG9zdFZpZXcsIGhvc3RWaWV3W1RfSE9TVF0pO1xuICBjb25zdCBub3JtYWxFeGVjdXRpb25QYXRoID0gIWdldENoZWNrTm9DaGFuZ2VzTW9kZSgpO1xuICBjb25zdCBjcmVhdGlvbk1vZGVJc0FjdGl2ZSA9IGlzQ3JlYXRpb25Nb2RlKGhvc3RWaWV3KTtcbiAgdHJ5IHtcbiAgICBpZiAobm9ybWFsRXhlY3V0aW9uUGF0aCAmJiAhY3JlYXRpb25Nb2RlSXNBY3RpdmUgJiYgcmVuZGVyZXJGYWN0b3J5LmJlZ2luKSB7XG4gICAgICByZW5kZXJlckZhY3RvcnkuYmVnaW4oKTtcbiAgICB9XG5cbiAgICBpZiAoY3JlYXRpb25Nb2RlSXNBY3RpdmUpIHtcbiAgICAgIC8vIGNyZWF0aW9uIG1vZGUgcGFzc1xuICAgICAgdGVtcGxhdGVGbiAmJiBleGVjdXRlVGVtcGxhdGUodGVtcGxhdGVGbiwgUmVuZGVyRmxhZ3MuQ3JlYXRlLCBjb250ZXh0KTtcblxuICAgICAgcmVmcmVzaERlc2NlbmRhbnRWaWV3cyhob3N0Vmlldyk7XG4gICAgICBob3N0Vmlld1tGTEFHU10gJj0gfkxWaWV3RmxhZ3MuQ3JlYXRpb25Nb2RlO1xuICAgIH1cblxuICAgIC8vIHVwZGF0ZSBtb2RlIHBhc3NcbiAgICByZXNldFByZU9yZGVySG9va0ZsYWdzKGhvc3RWaWV3KTtcbiAgICB0ZW1wbGF0ZUZuICYmIGV4ZWN1dGVUZW1wbGF0ZSh0ZW1wbGF0ZUZuLCBSZW5kZXJGbGFncy5VcGRhdGUsIGNvbnRleHQpO1xuICAgIHJlZnJlc2hEZXNjZW5kYW50Vmlld3MoaG9zdFZpZXcpO1xuICB9IGZpbmFsbHkge1xuICAgIGlmIChub3JtYWxFeGVjdXRpb25QYXRoICYmICFjcmVhdGlvbk1vZGVJc0FjdGl2ZSAmJiByZW5kZXJlckZhY3RvcnkuZW5kKSB7XG4gICAgICByZW5kZXJlckZhY3RvcnkuZW5kKCk7XG4gICAgfVxuICAgIGxlYXZlVmlldyhvbGRWaWV3KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBleGVjdXRlVGVtcGxhdGU8VD4odGVtcGxhdGVGbjogQ29tcG9uZW50VGVtcGxhdGU8VD4sIHJmOiBSZW5kZXJGbGFncywgY29udGV4dDogVCkge1xuICDJtcm1bmFtZXNwYWNlSFRNTCgpO1xuICBjb25zdCBwcmV2U2VsZWN0ZWRJbmRleCA9IGdldFNlbGVjdGVkSW5kZXgoKTtcbiAgdHJ5IHtcbiAgICBzZXRBY3RpdmVIb3N0RWxlbWVudChudWxsKTtcbiAgICB0ZW1wbGF0ZUZuKHJmLCBjb250ZXh0KTtcbiAgfSBmaW5hbGx5IHtcbiAgICBzZXRTZWxlY3RlZEluZGV4KHByZXZTZWxlY3RlZEluZGV4KTtcbiAgfVxufVxuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gcmV0dXJucyB0aGUgZGVmYXVsdCBjb25maWd1cmF0aW9uIG9mIHJlbmRlcmluZyBmbGFncyBkZXBlbmRpbmcgb24gd2hlbiB0aGVcbiAqIHRlbXBsYXRlIGlzIGluIGNyZWF0aW9uIG1vZGUgb3IgdXBkYXRlIG1vZGUuIFVwZGF0ZSBibG9jayBhbmQgY3JlYXRlIGJsb2NrIGFyZVxuICogYWx3YXlzIHJ1biBzZXBhcmF0ZWx5LlxuICovXG5mdW5jdGlvbiBnZXRSZW5kZXJGbGFncyh2aWV3OiBMVmlldyk6IFJlbmRlckZsYWdzIHtcbiAgcmV0dXJuIGlzQ3JlYXRpb25Nb2RlKHZpZXcpID8gUmVuZGVyRmxhZ3MuQ3JlYXRlIDogUmVuZGVyRmxhZ3MuVXBkYXRlO1xufVxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8vLyBFbGVtZW50XG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4vKipcbiAqIEFwcHJvcHJpYXRlbHkgc2V0cyBgc3R5bGluZ1RlbXBsYXRlYCBvbiBhIFROb2RlXG4gKlxuICogRG9lcyBub3QgYXBwbHkgc3R5bGVzIHRvIERPTSBub2Rlc1xuICpcbiAqIEBwYXJhbSB0Tm9kZSBUaGUgbm9kZSB3aG9zZSBgc3R5bGluZ1RlbXBsYXRlYCB0byBzZXRcbiAqIEBwYXJhbSBhdHRycyBUaGUgYXR0cmlidXRlIGFycmF5IHNvdXJjZSB0byBzZXQgdGhlIGF0dHJpYnV0ZXMgZnJvbVxuICogQHBhcmFtIGF0dHJzU3RhcnRJbmRleCBPcHRpb25hbCBzdGFydCBpbmRleCB0byBzdGFydCBwcm9jZXNzaW5nIHRoZSBgYXR0cnNgIGZyb21cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldE5vZGVTdHlsaW5nVGVtcGxhdGUoXG4gICAgdFZpZXc6IFRWaWV3LCB0Tm9kZTogVE5vZGUsIGF0dHJzOiBUQXR0cmlidXRlcywgYXR0cnNTdGFydEluZGV4OiBudW1iZXIpIHtcbiAgaWYgKHRWaWV3LmZpcnN0VGVtcGxhdGVQYXNzICYmICF0Tm9kZS5zdHlsaW5nVGVtcGxhdGUpIHtcbiAgICBjb25zdCBzdHlsaW5nQXR0cnNTdGFydEluZGV4ID0gYXR0cnNTdHlsaW5nSW5kZXhPZihhdHRycywgYXR0cnNTdGFydEluZGV4KTtcbiAgICBpZiAoc3R5bGluZ0F0dHJzU3RhcnRJbmRleCA+PSAwKSB7XG4gICAgICB0Tm9kZS5zdHlsaW5nVGVtcGxhdGUgPSBpbml0aWFsaXplU3RhdGljU3R5bGluZ0NvbnRleHQoYXR0cnMsIHN0eWxpbmdBdHRyc1N0YXJ0SW5kZXgpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZXhlY3V0ZUNvbnRlbnRRdWVyaWVzKHRWaWV3OiBUVmlldywgdE5vZGU6IFROb2RlLCBsVmlldzogTFZpZXcpIHtcbiAgaWYgKGlzQ29udGVudFF1ZXJ5SG9zdCh0Tm9kZSkpIHtcbiAgICBjb25zdCBzdGFydCA9IHROb2RlLmRpcmVjdGl2ZVN0YXJ0O1xuICAgIGNvbnN0IGVuZCA9IHROb2RlLmRpcmVjdGl2ZUVuZDtcbiAgICBmb3IgKGxldCBkaXJlY3RpdmVJbmRleCA9IHN0YXJ0OyBkaXJlY3RpdmVJbmRleCA8IGVuZDsgZGlyZWN0aXZlSW5kZXgrKykge1xuICAgICAgY29uc3QgZGVmID0gdFZpZXcuZGF0YVtkaXJlY3RpdmVJbmRleF0gYXMgRGlyZWN0aXZlRGVmPGFueT47XG4gICAgICBpZiAoZGVmLmNvbnRlbnRRdWVyaWVzKSB7XG4gICAgICAgIGRlZi5jb250ZW50UXVlcmllcyhSZW5kZXJGbGFncy5DcmVhdGUsIGxWaWV3W2RpcmVjdGl2ZUluZGV4XSwgZGlyZWN0aXZlSW5kZXgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5cbi8qKlxuICogQ3JlYXRlcyBkaXJlY3RpdmUgaW5zdGFuY2VzIGFuZCBwb3B1bGF0ZXMgbG9jYWwgcmVmcy5cbiAqXG4gKiBAcGFyYW0gbG9jYWxSZWZzIExvY2FsIHJlZnMgb2YgdGhlIG5vZGUgaW4gcXVlc3Rpb25cbiAqIEBwYXJhbSBsb2NhbFJlZkV4dHJhY3RvciBtYXBwaW5nIGZ1bmN0aW9uIHRoYXQgZXh0cmFjdHMgbG9jYWwgcmVmIHZhbHVlIGZyb20gVE5vZGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZURpcmVjdGl2ZXNBbmRMb2NhbHMoXG4gICAgdFZpZXc6IFRWaWV3LCBsVmlldzogTFZpZXcsIGxvY2FsUmVmczogc3RyaW5nW10gfCBudWxsIHwgdW5kZWZpbmVkLFxuICAgIGxvY2FsUmVmRXh0cmFjdG9yOiBMb2NhbFJlZkV4dHJhY3RvciA9IGdldE5hdGl2ZUJ5VE5vZGUpIHtcbiAgaWYgKCFnZXRCaW5kaW5nc0VuYWJsZWQoKSkgcmV0dXJuO1xuICBjb25zdCBwcmV2aW91c09yUGFyZW50VE5vZGUgPSBnZXRQcmV2aW91c09yUGFyZW50VE5vZGUoKTtcbiAgaWYgKHRWaWV3LmZpcnN0VGVtcGxhdGVQYXNzKSB7XG4gICAgbmdEZXZNb2RlICYmIG5nRGV2TW9kZS5maXJzdFRlbXBsYXRlUGFzcysrO1xuICAgIHJlc29sdmVEaXJlY3RpdmVzKFxuICAgICAgICB0VmlldywgbFZpZXcsIGZpbmREaXJlY3RpdmVNYXRjaGVzKHRWaWV3LCBsVmlldywgcHJldmlvdXNPclBhcmVudFROb2RlKSxcbiAgICAgICAgcHJldmlvdXNPclBhcmVudFROb2RlLCBsb2NhbFJlZnMgfHwgbnVsbCk7XG4gIH1cbiAgaW5zdGFudGlhdGVBbGxEaXJlY3RpdmVzKHRWaWV3LCBsVmlldywgcHJldmlvdXNPclBhcmVudFROb2RlKTtcbiAgaW52b2tlRGlyZWN0aXZlc0hvc3RCaW5kaW5ncyh0VmlldywgbFZpZXcsIHByZXZpb3VzT3JQYXJlbnRUTm9kZSk7XG4gIHNhdmVSZXNvbHZlZExvY2Fsc0luRGF0YShsVmlldywgcHJldmlvdXNPclBhcmVudFROb2RlLCBsb2NhbFJlZkV4dHJhY3Rvcik7XG59XG5cbi8qKlxuICogVGFrZXMgYSBsaXN0IG9mIGxvY2FsIG5hbWVzIGFuZCBpbmRpY2VzIGFuZCBwdXNoZXMgdGhlIHJlc29sdmVkIGxvY2FsIHZhcmlhYmxlIHZhbHVlc1xuICogdG8gTFZpZXcgaW4gdGhlIHNhbWUgb3JkZXIgYXMgdGhleSBhcmUgbG9hZGVkIGluIHRoZSB0ZW1wbGF0ZSB3aXRoIGxvYWQoKS5cbiAqL1xuZnVuY3Rpb24gc2F2ZVJlc29sdmVkTG9jYWxzSW5EYXRhKFxuICAgIHZpZXdEYXRhOiBMVmlldywgdE5vZGU6IFROb2RlLCBsb2NhbFJlZkV4dHJhY3RvcjogTG9jYWxSZWZFeHRyYWN0b3IpOiB2b2lkIHtcbiAgY29uc3QgbG9jYWxOYW1lcyA9IHROb2RlLmxvY2FsTmFtZXM7XG4gIGlmIChsb2NhbE5hbWVzKSB7XG4gICAgbGV0IGxvY2FsSW5kZXggPSB0Tm9kZS5pbmRleCArIDE7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsb2NhbE5hbWVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgICBjb25zdCBpbmRleCA9IGxvY2FsTmFtZXNbaSArIDFdIGFzIG51bWJlcjtcbiAgICAgIGNvbnN0IHZhbHVlID0gaW5kZXggPT09IC0xID9cbiAgICAgICAgICBsb2NhbFJlZkV4dHJhY3RvcihcbiAgICAgICAgICAgICAgdE5vZGUgYXMgVEVsZW1lbnROb2RlIHwgVENvbnRhaW5lck5vZGUgfCBURWxlbWVudENvbnRhaW5lck5vZGUsIHZpZXdEYXRhKSA6XG4gICAgICAgICAgdmlld0RhdGFbaW5kZXhdO1xuICAgICAgdmlld0RhdGFbbG9jYWxJbmRleCsrXSA9IHZhbHVlO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEdldHMgVFZpZXcgZnJvbSBhIHRlbXBsYXRlIGZ1bmN0aW9uIG9yIGNyZWF0ZXMgYSBuZXcgVFZpZXdcbiAqIGlmIGl0IGRvZXNuJ3QgYWxyZWFkeSBleGlzdC5cbiAqXG4gKiBAcGFyYW0gdGVtcGxhdGVGbiBUaGUgdGVtcGxhdGUgZnJvbSB3aGljaCB0byBnZXQgc3RhdGljIGRhdGFcbiAqIEBwYXJhbSBjb25zdHMgVGhlIG51bWJlciBvZiBub2RlcywgbG9jYWwgcmVmcywgYW5kIHBpcGVzIGluIHRoaXMgdmlld1xuICogQHBhcmFtIHZhcnMgVGhlIG51bWJlciBvZiBiaW5kaW5ncyBhbmQgcHVyZSBmdW5jdGlvbiBiaW5kaW5ncyBpbiB0aGlzIHZpZXdcbiAqIEBwYXJhbSBkaXJlY3RpdmVzIERpcmVjdGl2ZSBkZWZzIHRoYXQgc2hvdWxkIGJlIHNhdmVkIG9uIFRWaWV3XG4gKiBAcGFyYW0gcGlwZXMgUGlwZSBkZWZzIHRoYXQgc2hvdWxkIGJlIHNhdmVkIG9uIFRWaWV3XG4gKiBAcGFyYW0gdmlld1F1ZXJ5IFZpZXcgcXVlcnkgdGhhdCBzaG91bGQgYmUgc2F2ZWQgb24gVFZpZXdcbiAqIEBwYXJhbSBzY2hlbWFzIFNjaGVtYXMgdGhhdCBzaG91bGQgYmUgc2F2ZWQgb24gVFZpZXdcbiAqIEByZXR1cm5zIFRWaWV3XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRPckNyZWF0ZVRWaWV3KFxuICAgIHRlbXBsYXRlRm46IENvbXBvbmVudFRlbXBsYXRlPGFueT4sIGNvbnN0czogbnVtYmVyLCB2YXJzOiBudW1iZXIsXG4gICAgZGlyZWN0aXZlczogRGlyZWN0aXZlRGVmTGlzdE9yRmFjdG9yeSB8IG51bGwsIHBpcGVzOiBQaXBlRGVmTGlzdE9yRmFjdG9yeSB8IG51bGwsXG4gICAgdmlld1F1ZXJ5OiBWaWV3UXVlcmllc0Z1bmN0aW9uPGFueT58IG51bGwsIHNjaGVtYXM6IFNjaGVtYU1ldGFkYXRhW10gfCBudWxsKTogVFZpZXcge1xuICAvLyBUT0RPKG1pc2tvKTogcmVhZGluZyBgbmdQcml2YXRlRGF0YWAgaGVyZSBpcyBwcm9ibGVtYXRpYyBmb3IgdHdvIHJlYXNvbnNcbiAgLy8gMS4gSXQgaXMgYSBtZWdhbW9ycGhpYyBjYWxsIG9uIGVhY2ggaW52b2NhdGlvbi5cbiAgLy8gMi4gRm9yIG5lc3RlZCBlbWJlZGRlZCB2aWV3cyAobmdGb3IgaW5zaWRlIG5nRm9yKSB0aGUgdGVtcGxhdGUgaW5zdGFuY2UgaXMgcGVyXG4gIC8vICAgIG91dGVyIHRlbXBsYXRlIGludm9jYXRpb24sIHdoaWNoIG1lYW5zIHRoYXQgbm8gc3VjaCBwcm9wZXJ0eSB3aWxsIGV4aXN0XG4gIC8vIENvcnJlY3Qgc29sdXRpb24gaXMgdG8gb25seSBwdXQgYG5nUHJpdmF0ZURhdGFgIG9uIHRoZSBDb21wb25lbnQgdGVtcGxhdGVcbiAgLy8gYW5kIG5vdCBvbiBlbWJlZGRlZCB0ZW1wbGF0ZXMuXG5cbiAgcmV0dXJuIHRlbXBsYXRlRm4ubmdQcml2YXRlRGF0YSB8fFxuICAgICAgKHRlbXBsYXRlRm4ubmdQcml2YXRlRGF0YSA9IGNyZWF0ZVRWaWV3KFxuICAgICAgICAgICAtMSwgdGVtcGxhdGVGbiwgY29uc3RzLCB2YXJzLCBkaXJlY3RpdmVzLCBwaXBlcywgdmlld1F1ZXJ5LCBzY2hlbWFzKSBhcyBuZXZlcik7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIFRWaWV3IGluc3RhbmNlXG4gKlxuICogQHBhcmFtIHZpZXdJbmRleCBUaGUgdmlld0Jsb2NrSWQgZm9yIGlubGluZSB2aWV3cywgb3IgLTEgaWYgaXQncyBhIGNvbXBvbmVudC9keW5hbWljXG4gKiBAcGFyYW0gdGVtcGxhdGVGbiBUZW1wbGF0ZSBmdW5jdGlvblxuICogQHBhcmFtIGNvbnN0cyBUaGUgbnVtYmVyIG9mIG5vZGVzLCBsb2NhbCByZWZzLCBhbmQgcGlwZXMgaW4gdGhpcyB0ZW1wbGF0ZVxuICogQHBhcmFtIGRpcmVjdGl2ZXMgUmVnaXN0cnkgb2YgZGlyZWN0aXZlcyBmb3IgdGhpcyB2aWV3XG4gKiBAcGFyYW0gcGlwZXMgUmVnaXN0cnkgb2YgcGlwZXMgZm9yIHRoaXMgdmlld1xuICogQHBhcmFtIHZpZXdRdWVyeSBWaWV3IHF1ZXJpZXMgZm9yIHRoaXMgdmlld1xuICogQHBhcmFtIHNjaGVtYXMgU2NoZW1hcyBmb3IgdGhpcyB2aWV3XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUVmlldyhcbiAgICB2aWV3SW5kZXg6IG51bWJlciwgdGVtcGxhdGVGbjogQ29tcG9uZW50VGVtcGxhdGU8YW55PnwgbnVsbCwgY29uc3RzOiBudW1iZXIsIHZhcnM6IG51bWJlcixcbiAgICBkaXJlY3RpdmVzOiBEaXJlY3RpdmVEZWZMaXN0T3JGYWN0b3J5IHwgbnVsbCwgcGlwZXM6IFBpcGVEZWZMaXN0T3JGYWN0b3J5IHwgbnVsbCxcbiAgICB2aWV3UXVlcnk6IFZpZXdRdWVyaWVzRnVuY3Rpb248YW55PnwgbnVsbCwgc2NoZW1hczogU2NoZW1hTWV0YWRhdGFbXSB8IG51bGwpOiBUVmlldyB7XG4gIG5nRGV2TW9kZSAmJiBuZ0Rldk1vZGUudFZpZXcrKztcbiAgY29uc3QgYmluZGluZ1N0YXJ0SW5kZXggPSBIRUFERVJfT0ZGU0VUICsgY29uc3RzO1xuICAvLyBUaGlzIGxlbmd0aCBkb2VzIG5vdCB5ZXQgY29udGFpbiBob3N0IGJpbmRpbmdzIGZyb20gY2hpbGQgZGlyZWN0aXZlcyBiZWNhdXNlIGF0IHRoaXMgcG9pbnQsXG4gIC8vIHdlIGRvbid0IGtub3cgd2hpY2ggZGlyZWN0aXZlcyBhcmUgYWN0aXZlIG9uIHRoaXMgdGVtcGxhdGUuIEFzIHNvb24gYXMgYSBkaXJlY3RpdmUgaXMgbWF0Y2hlZFxuICAvLyB0aGF0IGhhcyBhIGhvc3QgYmluZGluZywgd2Ugd2lsbCB1cGRhdGUgdGhlIGJsdWVwcmludCB3aXRoIHRoYXQgZGVmJ3MgaG9zdFZhcnMgY291bnQuXG4gIGNvbnN0IGluaXRpYWxWaWV3TGVuZ3RoID0gYmluZGluZ1N0YXJ0SW5kZXggKyB2YXJzO1xuICBjb25zdCBibHVlcHJpbnQgPSBjcmVhdGVWaWV3Qmx1ZXByaW50KGJpbmRpbmdTdGFydEluZGV4LCBpbml0aWFsVmlld0xlbmd0aCk7XG4gIHJldHVybiBibHVlcHJpbnRbVFZJRVcgYXMgYW55XSA9IHtcbiAgICBpZDogdmlld0luZGV4LFxuICAgIGJsdWVwcmludDogYmx1ZXByaW50LFxuICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZUZuLFxuICAgIHZpZXdRdWVyeTogdmlld1F1ZXJ5LFxuICAgIG5vZGU6IG51bGwgISxcbiAgICBkYXRhOiBibHVlcHJpbnQuc2xpY2UoKS5maWxsKG51bGwsIGJpbmRpbmdTdGFydEluZGV4KSxcbiAgICBiaW5kaW5nU3RhcnRJbmRleDogYmluZGluZ1N0YXJ0SW5kZXgsXG4gICAgdmlld1F1ZXJ5U3RhcnRJbmRleDogaW5pdGlhbFZpZXdMZW5ndGgsXG4gICAgZXhwYW5kb1N0YXJ0SW5kZXg6IGluaXRpYWxWaWV3TGVuZ3RoLFxuICAgIGV4cGFuZG9JbnN0cnVjdGlvbnM6IG51bGwsXG4gICAgZmlyc3RUZW1wbGF0ZVBhc3M6IHRydWUsXG4gICAgc3RhdGljVmlld1F1ZXJpZXM6IGZhbHNlLFxuICAgIHN0YXRpY0NvbnRlbnRRdWVyaWVzOiBmYWxzZSxcbiAgICBwcmVPcmRlckhvb2tzOiBudWxsLFxuICAgIHByZU9yZGVyQ2hlY2tIb29rczogbnVsbCxcbiAgICBjb250ZW50SG9va3M6IG51bGwsXG4gICAgY29udGVudENoZWNrSG9va3M6IG51bGwsXG4gICAgdmlld0hvb2tzOiBudWxsLFxuICAgIHZpZXdDaGVja0hvb2tzOiBudWxsLFxuICAgIGRlc3Ryb3lIb29rczogbnVsbCxcbiAgICBjbGVhbnVwOiBudWxsLFxuICAgIGNvbnRlbnRRdWVyaWVzOiBudWxsLFxuICAgIGNvbXBvbmVudHM6IG51bGwsXG4gICAgZGlyZWN0aXZlUmVnaXN0cnk6IHR5cGVvZiBkaXJlY3RpdmVzID09PSAnZnVuY3Rpb24nID8gZGlyZWN0aXZlcygpIDogZGlyZWN0aXZlcyxcbiAgICBwaXBlUmVnaXN0cnk6IHR5cGVvZiBwaXBlcyA9PT0gJ2Z1bmN0aW9uJyA/IHBpcGVzKCkgOiBwaXBlcyxcbiAgICBmaXJzdENoaWxkOiBudWxsLFxuICAgIHNjaGVtYXM6IHNjaGVtYXMsXG4gIH07XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVZpZXdCbHVlcHJpbnQoYmluZGluZ1N0YXJ0SW5kZXg6IG51bWJlciwgaW5pdGlhbFZpZXdMZW5ndGg6IG51bWJlcik6IExWaWV3IHtcbiAgY29uc3QgYmx1ZXByaW50ID0gbmV3IEFycmF5KGluaXRpYWxWaWV3TGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbGwobnVsbCwgMCwgYmluZGluZ1N0YXJ0SW5kZXgpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsbChOT19DSEFOR0UsIGJpbmRpbmdTdGFydEluZGV4KSBhcyBMVmlldztcbiAgYmx1ZXByaW50W0JJTkRJTkdfSU5ERVhdID0gYmluZGluZ1N0YXJ0SW5kZXg7XG4gIHJldHVybiBibHVlcHJpbnQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFcnJvcih0ZXh0OiBzdHJpbmcsIHRva2VuOiBhbnkpIHtcbiAgcmV0dXJuIG5ldyBFcnJvcihgUmVuZGVyZXI6ICR7dGV4dH0gWyR7c3RyaW5naWZ5Rm9yRXJyb3IodG9rZW4pfV1gKTtcbn1cblxuXG4vKipcbiAqIExvY2F0ZXMgdGhlIGhvc3QgbmF0aXZlIGVsZW1lbnQsIHVzZWQgZm9yIGJvb3RzdHJhcHBpbmcgZXhpc3Rpbmcgbm9kZXMgaW50byByZW5kZXJpbmcgcGlwZWxpbmUuXG4gKlxuICogQHBhcmFtIGVsZW1lbnRPclNlbGVjdG9yIFJlbmRlciBlbGVtZW50IG9yIENTUyBzZWxlY3RvciB0byBsb2NhdGUgdGhlIGVsZW1lbnQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsb2NhdGVIb3N0RWxlbWVudChcbiAgICBmYWN0b3J5OiBSZW5kZXJlckZhY3RvcnkzLCBlbGVtZW50T3JTZWxlY3RvcjogUkVsZW1lbnQgfCBzdHJpbmcpOiBSRWxlbWVudHxudWxsIHtcbiAgY29uc3QgZGVmYXVsdFJlbmRlcmVyID0gZmFjdG9yeS5jcmVhdGVSZW5kZXJlcihudWxsLCBudWxsKTtcbiAgY29uc3Qgck5vZGUgPSB0eXBlb2YgZWxlbWVudE9yU2VsZWN0b3IgPT09ICdzdHJpbmcnID9cbiAgICAgIChpc1Byb2NlZHVyYWxSZW5kZXJlcihkZWZhdWx0UmVuZGVyZXIpID9cbiAgICAgICAgICAgZGVmYXVsdFJlbmRlcmVyLnNlbGVjdFJvb3RFbGVtZW50KGVsZW1lbnRPclNlbGVjdG9yKSA6XG4gICAgICAgICAgIGRlZmF1bHRSZW5kZXJlci5xdWVyeVNlbGVjdG9yKGVsZW1lbnRPclNlbGVjdG9yKSkgOlxuICAgICAgZWxlbWVudE9yU2VsZWN0b3I7XG4gIGlmIChuZ0Rldk1vZGUgJiYgIXJOb2RlKSB7XG4gICAgaWYgKHR5cGVvZiBlbGVtZW50T3JTZWxlY3RvciA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IGNyZWF0ZUVycm9yKCdIb3N0IG5vZGUgd2l0aCBzZWxlY3RvciBub3QgZm91bmQ6JywgZWxlbWVudE9yU2VsZWN0b3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBjcmVhdGVFcnJvcignSG9zdCBub2RlIGlzIHJlcXVpcmVkOicsIGVsZW1lbnRPclNlbGVjdG9yKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJOb2RlO1xufVxuXG4vKipcbiAqIFNhdmVzIGNvbnRleHQgZm9yIHRoaXMgY2xlYW51cCBmdW5jdGlvbiBpbiBMVmlldy5jbGVhbnVwSW5zdGFuY2VzLlxuICpcbiAqIE9uIHRoZSBmaXJzdCB0ZW1wbGF0ZSBwYXNzLCBzYXZlcyBpbiBUVmlldzpcbiAqIC0gQ2xlYW51cCBmdW5jdGlvblxuICogLSBJbmRleCBvZiBjb250ZXh0IHdlIGp1c3Qgc2F2ZWQgaW4gTFZpZXcuY2xlYW51cEluc3RhbmNlc1xuICovXG5leHBvcnQgZnVuY3Rpb24gc3RvcmVDbGVhbnVwV2l0aENvbnRleHQobFZpZXc6IExWaWV3LCBjb250ZXh0OiBhbnksIGNsZWFudXBGbjogRnVuY3Rpb24pOiB2b2lkIHtcbiAgY29uc3QgbENsZWFudXAgPSBnZXRDbGVhbnVwKGxWaWV3KTtcbiAgbENsZWFudXAucHVzaChjb250ZXh0KTtcblxuICBpZiAobFZpZXdbVFZJRVddLmZpcnN0VGVtcGxhdGVQYXNzKSB7XG4gICAgZ2V0VFZpZXdDbGVhbnVwKGxWaWV3KS5wdXNoKGNsZWFudXBGbiwgbENsZWFudXAubGVuZ3RoIC0gMSk7XG4gIH1cbn1cblxuLyoqXG4gKiBTYXZlcyB0aGUgY2xlYW51cCBmdW5jdGlvbiBpdHNlbGYgaW4gTFZpZXcuY2xlYW51cEluc3RhbmNlcy5cbiAqXG4gKiBUaGlzIGlzIG5lY2Vzc2FyeSBmb3IgZnVuY3Rpb25zIHRoYXQgYXJlIHdyYXBwZWQgd2l0aCB0aGVpciBjb250ZXh0cywgbGlrZSBpbiByZW5kZXJlcjJcbiAqIGxpc3RlbmVycy5cbiAqXG4gKiBPbiB0aGUgZmlyc3QgdGVtcGxhdGUgcGFzcywgdGhlIGluZGV4IG9mIHRoZSBjbGVhbnVwIGZ1bmN0aW9uIGlzIHNhdmVkIGluIFRWaWV3LlxuICovXG5leHBvcnQgZnVuY3Rpb24gc3RvcmVDbGVhbnVwRm4odmlldzogTFZpZXcsIGNsZWFudXBGbjogRnVuY3Rpb24pOiB2b2lkIHtcbiAgZ2V0Q2xlYW51cCh2aWV3KS5wdXNoKGNsZWFudXBGbik7XG5cbiAgaWYgKHZpZXdbVFZJRVddLmZpcnN0VGVtcGxhdGVQYXNzKSB7XG4gICAgZ2V0VFZpZXdDbGVhbnVwKHZpZXcpLnB1c2godmlld1tDTEVBTlVQXSAhLmxlbmd0aCAtIDEsIG51bGwpO1xuICB9XG59XG5cbi8vIFRPRE86IFJlbW92ZSB0aGlzIHdoZW4gdGhlIGlzc3VlIGlzIHJlc29sdmVkLlxuLyoqXG4gKiBUc2lja2xlIGhhcyBhIGJ1ZyB3aGVyZSBpdCBjcmVhdGVzIGFuIGluZmluaXRlIGxvb3AgZm9yIGEgZnVuY3Rpb24gcmV0dXJuaW5nIGl0c2VsZi5cbiAqIFRoaXMgaXMgYSB0ZW1wb3JhcnkgdHlwZSB0aGF0IHdpbGwgYmUgcmVtb3ZlZCB3aGVuIHRoZSBpc3N1ZSBpcyByZXNvbHZlZC5cbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL3RzaWNrbGUvaXNzdWVzLzEwMDkpXG4gKi9cbmV4cG9ydCB0eXBlIFRzaWNrbGVJc3N1ZTEwMDkgPSBhbnk7XG5cbi8qKlxuICogQ29uc3RydWN0cyBhIFROb2RlIG9iamVjdCBmcm9tIHRoZSBhcmd1bWVudHMuXG4gKlxuICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgdGhlIG5vZGVcbiAqIEBwYXJhbSBhZGp1c3RlZEluZGV4IFRoZSBpbmRleCBvZiB0aGUgVE5vZGUgaW4gVFZpZXcuZGF0YSwgYWRqdXN0ZWQgZm9yIEhFQURFUl9PRkZTRVRcbiAqIEBwYXJhbSB0YWdOYW1lIFRoZSB0YWcgbmFtZSBvZiB0aGUgbm9kZVxuICogQHBhcmFtIGF0dHJzIFRoZSBhdHRyaWJ1dGVzIGRlZmluZWQgb24gdGhpcyBub2RlXG4gKiBAcGFyYW0gdFZpZXdzIEFueSBUVmlld3MgYXR0YWNoZWQgdG8gdGhpcyBub2RlXG4gKiBAcmV0dXJucyB0aGUgVE5vZGUgb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUTm9kZShcbiAgICB0UGFyZW50OiBURWxlbWVudE5vZGUgfCBUQ29udGFpbmVyTm9kZSB8IG51bGwsIHR5cGU6IFROb2RlVHlwZSwgYWRqdXN0ZWRJbmRleDogbnVtYmVyLFxuICAgIHRhZ05hbWU6IHN0cmluZyB8IG51bGwsIGF0dHJzOiBUQXR0cmlidXRlcyB8IG51bGwpOiBUTm9kZSB7XG4gIG5nRGV2TW9kZSAmJiBuZ0Rldk1vZGUudE5vZGUrKztcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiB0eXBlLFxuICAgIGluZGV4OiBhZGp1c3RlZEluZGV4LFxuICAgIGluamVjdG9ySW5kZXg6IHRQYXJlbnQgPyB0UGFyZW50LmluamVjdG9ySW5kZXggOiAtMSxcbiAgICBkaXJlY3RpdmVTdGFydDogLTEsXG4gICAgZGlyZWN0aXZlRW5kOiAtMSxcbiAgICBwcm9wZXJ0eU1ldGFkYXRhU3RhcnRJbmRleDogLTEsXG4gICAgcHJvcGVydHlNZXRhZGF0YUVuZEluZGV4OiAtMSxcbiAgICBmbGFnczogMCxcbiAgICBwcm92aWRlckluZGV4ZXM6IDAsXG4gICAgdGFnTmFtZTogdGFnTmFtZSxcbiAgICBhdHRyczogYXR0cnMsXG4gICAgbG9jYWxOYW1lczogbnVsbCxcbiAgICBpbml0aWFsSW5wdXRzOiB1bmRlZmluZWQsXG4gICAgaW5wdXRzOiB1bmRlZmluZWQsXG4gICAgb3V0cHV0czogdW5kZWZpbmVkLFxuICAgIHRWaWV3czogbnVsbCxcbiAgICBuZXh0OiBudWxsLFxuICAgIHByb2plY3Rpb25OZXh0OiBudWxsLFxuICAgIGNoaWxkOiBudWxsLFxuICAgIHBhcmVudDogdFBhcmVudCxcbiAgICBzdHlsaW5nVGVtcGxhdGU6IG51bGwsXG4gICAgcHJvamVjdGlvbjogbnVsbCxcbiAgICBvbkVsZW1lbnRDcmVhdGlvbkZuczogbnVsbCxcbiAgfTtcbn1cblxuXG4vKipcbiAqIENvbnNvbGlkYXRlcyBhbGwgaW5wdXRzIG9yIG91dHB1dHMgb2YgYWxsIGRpcmVjdGl2ZXMgb24gdGhpcyBsb2dpY2FsIG5vZGUuXG4gKlxuICogQHBhcmFtIHROb2RlXG4gKiBAcGFyYW0gZGlyZWN0aW9uIHdoZXRoZXIgdG8gY29uc2lkZXIgaW5wdXRzIG9yIG91dHB1dHNcbiAqIEByZXR1cm5zIFByb3BlcnR5QWxpYXNlc3xudWxsIGFnZ3JlZ2F0ZSBvZiBhbGwgcHJvcGVydGllcyBpZiBhbnksIGBudWxsYCBvdGhlcndpc2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlUHJvcGVydHlBbGlhc2VzKHROb2RlOiBUTm9kZSwgZGlyZWN0aW9uOiBCaW5kaW5nRGlyZWN0aW9uKTogUHJvcGVydHlBbGlhc2VzfFxuICAgIG51bGwge1xuICBjb25zdCB0VmlldyA9IGdldExWaWV3KClbVFZJRVddO1xuICBsZXQgcHJvcFN0b3JlOiBQcm9wZXJ0eUFsaWFzZXN8bnVsbCA9IG51bGw7XG4gIGNvbnN0IHN0YXJ0ID0gdE5vZGUuZGlyZWN0aXZlU3RhcnQ7XG4gIGNvbnN0IGVuZCA9IHROb2RlLmRpcmVjdGl2ZUVuZDtcblxuICBpZiAoZW5kID4gc3RhcnQpIHtcbiAgICBjb25zdCBpc0lucHV0ID0gZGlyZWN0aW9uID09PSBCaW5kaW5nRGlyZWN0aW9uLklucHV0O1xuICAgIGNvbnN0IGRlZnMgPSB0Vmlldy5kYXRhO1xuXG4gICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICAgIGNvbnN0IGRpcmVjdGl2ZURlZiA9IGRlZnNbaV0gYXMgRGlyZWN0aXZlRGVmPGFueT47XG4gICAgICBjb25zdCBwcm9wZXJ0eUFsaWFzTWFwOiB7W3B1YmxpY05hbWU6IHN0cmluZ106IHN0cmluZ30gPVxuICAgICAgICAgIGlzSW5wdXQgPyBkaXJlY3RpdmVEZWYuaW5wdXRzIDogZGlyZWN0aXZlRGVmLm91dHB1dHM7XG4gICAgICBmb3IgKGxldCBwdWJsaWNOYW1lIGluIHByb3BlcnR5QWxpYXNNYXApIHtcbiAgICAgICAgaWYgKHByb3BlcnR5QWxpYXNNYXAuaGFzT3duUHJvcGVydHkocHVibGljTmFtZSkpIHtcbiAgICAgICAgICBwcm9wU3RvcmUgPSBwcm9wU3RvcmUgfHwge307XG4gICAgICAgICAgY29uc3QgaW50ZXJuYWxOYW1lID0gcHJvcGVydHlBbGlhc01hcFtwdWJsaWNOYW1lXTtcbiAgICAgICAgICBjb25zdCBoYXNQcm9wZXJ0eSA9IHByb3BTdG9yZS5oYXNPd25Qcm9wZXJ0eShwdWJsaWNOYW1lKTtcbiAgICAgICAgICBoYXNQcm9wZXJ0eSA/IHByb3BTdG9yZVtwdWJsaWNOYW1lXS5wdXNoKGksIHB1YmxpY05hbWUsIGludGVybmFsTmFtZSkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgKHByb3BTdG9yZVtwdWJsaWNOYW1lXSA9IFtpLCBwdWJsaWNOYW1lLCBpbnRlcm5hbE5hbWVdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcHJvcFN0b3JlO1xufVxuXG4vKipcbiogTWFwcGluZyBiZXR3ZWVuIGF0dHJpYnV0ZXMgbmFtZXMgdGhhdCBkb24ndCBjb3JyZXNwb25kIHRvIHRoZWlyIGVsZW1lbnQgcHJvcGVydHkgbmFtZXMuXG4qL1xuY29uc3QgQVRUUl9UT19QUk9QOiB7W25hbWU6IHN0cmluZ106IHN0cmluZ30gPSB7XG4gICdjbGFzcyc6ICdjbGFzc05hbWUnLFxuICAnZm9yJzogJ2h0bWxGb3InLFxuICAnZm9ybWFjdGlvbic6ICdmb3JtQWN0aW9uJyxcbiAgJ2lubmVySHRtbCc6ICdpbm5lckhUTUwnLFxuICAncmVhZG9ubHknOiAncmVhZE9ubHknLFxuICAndGFiaW5kZXgnOiAndGFiSW5kZXgnLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGVsZW1lbnRQcm9wZXJ0eUludGVybmFsPFQ+KFxuICAgIGluZGV4OiBudW1iZXIsIHByb3BOYW1lOiBzdHJpbmcsIHZhbHVlOiBUIHwgTk9fQ0hBTkdFLCBzYW5pdGl6ZXI/OiBTYW5pdGl6ZXJGbiB8IG51bGwsXG4gICAgbmF0aXZlT25seT86IGJvb2xlYW4sXG4gICAgbG9hZFJlbmRlcmVyRm4/OiAoKHROb2RlOiBUTm9kZSwgbFZpZXc6IExWaWV3KSA9PiBSZW5kZXJlcjMpIHwgbnVsbCk6IHZvaWQge1xuICBpZiAodmFsdWUgPT09IE5PX0NIQU5HRSkgcmV0dXJuO1xuICBjb25zdCBsVmlldyA9IGdldExWaWV3KCk7XG4gIGNvbnN0IGVsZW1lbnQgPSBnZXROYXRpdmVCeUluZGV4KGluZGV4LCBsVmlldykgYXMgUkVsZW1lbnQgfCBSQ29tbWVudDtcbiAgY29uc3QgdE5vZGUgPSBnZXRUTm9kZShpbmRleCwgbFZpZXcpO1xuICBsZXQgaW5wdXREYXRhOiBQcm9wZXJ0eUFsaWFzZXN8bnVsbHx1bmRlZmluZWQ7XG4gIGxldCBkYXRhVmFsdWU6IFByb3BlcnR5QWxpYXNWYWx1ZXx1bmRlZmluZWQ7XG4gIGlmICghbmF0aXZlT25seSAmJiAoaW5wdXREYXRhID0gaW5pdGlhbGl6ZVROb2RlSW5wdXRzKHROb2RlKSkgJiZcbiAgICAgIChkYXRhVmFsdWUgPSBpbnB1dERhdGFbcHJvcE5hbWVdKSkge1xuICAgIHNldElucHV0c0ZvclByb3BlcnR5KGxWaWV3LCBkYXRhVmFsdWUsIHZhbHVlKTtcbiAgICBpZiAoaXNDb21wb25lbnQodE5vZGUpKSBtYXJrRGlydHlJZk9uUHVzaChsVmlldywgaW5kZXggKyBIRUFERVJfT0ZGU0VUKTtcbiAgICBpZiAobmdEZXZNb2RlKSB7XG4gICAgICBpZiAodE5vZGUudHlwZSA9PT0gVE5vZGVUeXBlLkVsZW1lbnQgfHwgdE5vZGUudHlwZSA9PT0gVE5vZGVUeXBlLkNvbnRhaW5lcikge1xuICAgICAgICAvKipcbiAgICAgICAgICogZGF0YVZhbHVlIGlzIGFuIGFycmF5IGNvbnRhaW5pbmcgcnVudGltZSBpbnB1dCBvciBvdXRwdXQgbmFtZXMgZm9yIHRoZSBkaXJlY3RpdmVzOlxuICAgICAgICAgKiBpKzA6IGRpcmVjdGl2ZSBpbnN0YW5jZSBpbmRleFxuICAgICAgICAgKiBpKzE6IHB1YmxpY05hbWVcbiAgICAgICAgICogaSsyOiBwcml2YXRlTmFtZVxuICAgICAgICAgKlxuICAgICAgICAgKiBlLmcuIFswLCAnY2hhbmdlJywgJ2NoYW5nZS1taW5pZmllZCddXG4gICAgICAgICAqIHdlIHdhbnQgdG8gc2V0IHRoZSByZWZsZWN0ZWQgcHJvcGVydHkgd2l0aCB0aGUgcHJpdmF0ZU5hbWU6IGRhdGFWYWx1ZVtpKzJdXG4gICAgICAgICAqL1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFWYWx1ZS5sZW5ndGg7IGkgKz0gMykge1xuICAgICAgICAgIHNldE5nUmVmbGVjdFByb3BlcnR5KGxWaWV3LCBlbGVtZW50LCB0Tm9kZS50eXBlLCBkYXRhVmFsdWVbaSArIDJdIGFzIHN0cmluZywgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKHROb2RlLnR5cGUgPT09IFROb2RlVHlwZS5FbGVtZW50KSB7XG4gICAgcHJvcE5hbWUgPSBBVFRSX1RPX1BST1BbcHJvcE5hbWVdIHx8IHByb3BOYW1lO1xuXG4gICAgaWYgKG5nRGV2TW9kZSkge1xuICAgICAgdmFsaWRhdGVBZ2FpbnN0RXZlbnRQcm9wZXJ0aWVzKHByb3BOYW1lKTtcbiAgICAgIHZhbGlkYXRlQWdhaW5zdFVua25vd25Qcm9wZXJ0aWVzKGxWaWV3LCBlbGVtZW50LCBwcm9wTmFtZSwgdE5vZGUpO1xuICAgICAgbmdEZXZNb2RlLnJlbmRlcmVyU2V0UHJvcGVydHkrKztcbiAgICB9XG5cbiAgICBzYXZlUHJvcGVydHlEZWJ1Z0RhdGEodE5vZGUsIGxWaWV3LCBwcm9wTmFtZSwgbFZpZXdbVFZJRVddLmRhdGEsIG5hdGl2ZU9ubHkpO1xuXG4gICAgY29uc3QgcmVuZGVyZXIgPSBsb2FkUmVuZGVyZXJGbiA/IGxvYWRSZW5kZXJlckZuKHROb2RlLCBsVmlldykgOiBsVmlld1tSRU5ERVJFUl07XG4gICAgLy8gSXQgaXMgYXNzdW1lZCB0aGF0IHRoZSBzYW5pdGl6ZXIgaXMgb25seSBhZGRlZCB3aGVuIHRoZSBjb21waWxlciBkZXRlcm1pbmVzIHRoYXQgdGhlIHByb3BlcnR5XG4gICAgLy8gaXMgcmlza3ksIHNvIHNhbml0aXphdGlvbiBjYW4gYmUgZG9uZSB3aXRob3V0IGZ1cnRoZXIgY2hlY2tzLlxuICAgIHZhbHVlID0gc2FuaXRpemVyICE9IG51bGwgPyAoc2FuaXRpemVyKHZhbHVlLCB0Tm9kZS50YWdOYW1lIHx8ICcnLCBwcm9wTmFtZSkgYXMgYW55KSA6IHZhbHVlO1xuICAgIGlmIChpc1Byb2NlZHVyYWxSZW5kZXJlcihyZW5kZXJlcikpIHtcbiAgICAgIHJlbmRlcmVyLnNldFByb3BlcnR5KGVsZW1lbnQgYXMgUkVsZW1lbnQsIHByb3BOYW1lLCB2YWx1ZSk7XG4gICAgfSBlbHNlIGlmICghaXNBbmltYXRpb25Qcm9wKHByb3BOYW1lKSkge1xuICAgICAgKGVsZW1lbnQgYXMgUkVsZW1lbnQpLnNldFByb3BlcnR5ID8gKGVsZW1lbnQgYXMgYW55KS5zZXRQcm9wZXJ0eShwcm9wTmFtZSwgdmFsdWUpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChlbGVtZW50IGFzIGFueSlbcHJvcE5hbWVdID0gdmFsdWU7XG4gICAgfVxuICB9IGVsc2UgaWYgKHROb2RlLnR5cGUgPT09IFROb2RlVHlwZS5Db250YWluZXIpIHtcbiAgICAvLyBJZiB0aGUgbm9kZSBpcyBhIGNvbnRhaW5lciBhbmQgdGhlIHByb3BlcnR5IGRpZG4ndFxuICAgIC8vIG1hdGNoIGFueSBvZiB0aGUgaW5wdXRzIG9yIHNjaGVtYXMgd2Ugc2hvdWxkIHRocm93LlxuICAgIGlmIChuZ0Rldk1vZGUgJiYgIW1hdGNoaW5nU2NoZW1hcyhsVmlldywgdE5vZGUudGFnTmFtZSkpIHtcbiAgICAgIHRocm93IGNyZWF0ZVVua25vd25Qcm9wZXJ0eUVycm9yKHByb3BOYW1lLCB0Tm9kZSk7XG4gICAgfVxuICB9XG59XG5cbi8qKiBJZiBub2RlIGlzIGFuIE9uUHVzaCBjb21wb25lbnQsIG1hcmtzIGl0cyBMVmlldyBkaXJ0eS4gKi9cbmZ1bmN0aW9uIG1hcmtEaXJ0eUlmT25QdXNoKGxWaWV3OiBMVmlldywgdmlld0luZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgbmdEZXZNb2RlICYmIGFzc2VydExWaWV3KGxWaWV3KTtcbiAgY29uc3QgY2hpbGRDb21wb25lbnRMVmlldyA9IGdldENvbXBvbmVudFZpZXdCeUluZGV4KHZpZXdJbmRleCwgbFZpZXcpO1xuICBpZiAoIShjaGlsZENvbXBvbmVudExWaWV3W0ZMQUdTXSAmIExWaWV3RmxhZ3MuQ2hlY2tBbHdheXMpKSB7XG4gICAgY2hpbGRDb21wb25lbnRMVmlld1tGTEFHU10gfD0gTFZpZXdGbGFncy5EaXJ0eTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0TmdSZWZsZWN0UHJvcGVydHkoXG4gICAgbFZpZXc6IExWaWV3LCBlbGVtZW50OiBSRWxlbWVudCB8IFJDb21tZW50LCB0eXBlOiBUTm9kZVR5cGUsIGF0dHJOYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcbiAgY29uc3QgcmVuZGVyZXIgPSBsVmlld1tSRU5ERVJFUl07XG4gIGF0dHJOYW1lID0gbm9ybWFsaXplRGVidWdCaW5kaW5nTmFtZShhdHRyTmFtZSk7XG4gIGNvbnN0IGRlYnVnVmFsdWUgPSBub3JtYWxpemVEZWJ1Z0JpbmRpbmdWYWx1ZSh2YWx1ZSk7XG4gIGlmICh0eXBlID09PSBUTm9kZVR5cGUuRWxlbWVudCkge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgICBpc1Byb2NlZHVyYWxSZW5kZXJlcihyZW5kZXJlcikgPyByZW5kZXJlci5yZW1vdmVBdHRyaWJ1dGUoKGVsZW1lbnQgYXMgUkVsZW1lbnQpLCBhdHRyTmFtZSkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGVsZW1lbnQgYXMgUkVsZW1lbnQpLnJlbW92ZUF0dHJpYnV0ZShhdHRyTmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlzUHJvY2VkdXJhbFJlbmRlcmVyKHJlbmRlcmVyKSA/XG4gICAgICAgICAgcmVuZGVyZXIuc2V0QXR0cmlidXRlKChlbGVtZW50IGFzIFJFbGVtZW50KSwgYXR0ck5hbWUsIGRlYnVnVmFsdWUpIDpcbiAgICAgICAgICAoZWxlbWVudCBhcyBSRWxlbWVudCkuc2V0QXR0cmlidXRlKGF0dHJOYW1lLCBkZWJ1Z1ZhbHVlKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgdGV4dENvbnRlbnQgPSBgYmluZGluZ3M9JHtKU09OLnN0cmluZ2lmeSh7W2F0dHJOYW1lXTogZGVidWdWYWx1ZX0sIG51bGwsIDIpfWA7XG4gICAgaWYgKGlzUHJvY2VkdXJhbFJlbmRlcmVyKHJlbmRlcmVyKSkge1xuICAgICAgcmVuZGVyZXIuc2V0VmFsdWUoKGVsZW1lbnQgYXMgUkNvbW1lbnQpLCB0ZXh0Q29udGVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIChlbGVtZW50IGFzIFJDb21tZW50KS50ZXh0Q29udGVudCA9IHRleHRDb250ZW50O1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZUFnYWluc3RVbmtub3duUHJvcGVydGllcyhcbiAgICBob3N0VmlldzogTFZpZXcsIGVsZW1lbnQ6IFJFbGVtZW50IHwgUkNvbW1lbnQsIHByb3BOYW1lOiBzdHJpbmcsIHROb2RlOiBUTm9kZSkge1xuICAvLyBJZiB0aGUgdGFnIG1hdGNoZXMgYW55IG9mIHRoZSBzY2hlbWFzIHdlIHNob3VsZG4ndCB0aHJvdy5cbiAgaWYgKG1hdGNoaW5nU2NoZW1hcyhob3N0VmlldywgdE5vZGUudGFnTmFtZSkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBJZiBwcm9wIGlzIG5vdCBhIGtub3duIHByb3BlcnR5IG9mIHRoZSBIVE1MIGVsZW1lbnQuLi5cbiAgaWYgKCEocHJvcE5hbWUgaW4gZWxlbWVudCkgJiZcbiAgICAgIC8vIGFuZCB3ZSBhcmUgaW4gYSBicm93c2VyIGNvbnRleHQuLi4gKHdlYiB3b3JrZXIgbm9kZXMgc2hvdWxkIGJlIHNraXBwZWQpXG4gICAgICB0eXBlb2YgTm9kZSA9PT0gJ2Z1bmN0aW9uJyAmJiBlbGVtZW50IGluc3RhbmNlb2YgTm9kZSAmJlxuICAgICAgLy8gYW5kIGlzbid0IGEgc3ludGhldGljIGFuaW1hdGlvbiBwcm9wZXJ0eS4uLlxuICAgICAgcHJvcE5hbWVbMF0gIT09IEFOSU1BVElPTl9QUk9QX1BSRUZJWCkge1xuICAgIC8vIC4uLiBpdCBpcyBwcm9iYWJseSBhIHVzZXIgZXJyb3IgYW5kIHdlIHNob3VsZCB0aHJvdy5cbiAgICB0aHJvdyBjcmVhdGVVbmtub3duUHJvcGVydHlFcnJvcihwcm9wTmFtZSwgdE5vZGUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1hdGNoaW5nU2NoZW1hcyhob3N0VmlldzogTFZpZXcsIHRhZ05hbWU6IHN0cmluZyB8IG51bGwpOiBib29sZWFuIHtcbiAgY29uc3Qgc2NoZW1hcyA9IGhvc3RWaWV3W1RWSUVXXS5zY2hlbWFzO1xuXG4gIGlmIChzY2hlbWFzICE9PSBudWxsKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzY2hlbWFzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBzY2hlbWEgPSBzY2hlbWFzW2ldO1xuICAgICAgaWYgKHNjaGVtYSA9PT0gTk9fRVJST1JTX1NDSEVNQSB8fFxuICAgICAgICAgIHNjaGVtYSA9PT0gQ1VTVE9NX0VMRU1FTlRTX1NDSEVNQSAmJiB0YWdOYW1lICYmIHRhZ05hbWUuaW5kZXhPZignLScpID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiogU3RvcmVzIGRlYnVnZ2luZyBkYXRhIGZvciB0aGlzIHByb3BlcnR5IGJpbmRpbmcgb24gZmlyc3QgdGVtcGxhdGUgcGFzcy5cbiogVGhpcyBlbmFibGVzIGZlYXR1cmVzIGxpa2UgRGVidWdFbGVtZW50LnByb3BlcnRpZXMuXG4qL1xuZnVuY3Rpb24gc2F2ZVByb3BlcnR5RGVidWdEYXRhKFxuICAgIHROb2RlOiBUTm9kZSwgbFZpZXc6IExWaWV3LCBwcm9wTmFtZTogc3RyaW5nLCB0RGF0YTogVERhdGEsXG4gICAgbmF0aXZlT25seTogYm9vbGVhbiB8IHVuZGVmaW5lZCk6IHZvaWQge1xuICBjb25zdCBsYXN0QmluZGluZ0luZGV4ID0gbFZpZXdbQklORElOR19JTkRFWF0gLSAxO1xuXG4gIC8vIEJpbmQvaW50ZXJwb2xhdGlvbiBmdW5jdGlvbnMgc2F2ZSBiaW5kaW5nIG1ldGFkYXRhIGluIHRoZSBsYXN0IGJpbmRpbmcgaW5kZXgsXG4gIC8vIGJ1dCBsZWF2ZSB0aGUgcHJvcGVydHkgbmFtZSBibGFuay4gSWYgdGhlIGludGVycG9sYXRpb24gZGVsaW1pdGVyIGlzIGF0IHRoZSAwXG4gIC8vIGluZGV4LCB3ZSBrbm93IHRoYXQgdGhpcyBpcyBvdXIgZmlyc3QgcGFzcyBhbmQgdGhlIHByb3BlcnR5IG5hbWUgc3RpbGwgbmVlZHMgdG9cbiAgLy8gYmUgc2V0LlxuICBjb25zdCBiaW5kaW5nTWV0YWRhdGEgPSB0RGF0YVtsYXN0QmluZGluZ0luZGV4XSBhcyBzdHJpbmc7XG4gIGlmIChiaW5kaW5nTWV0YWRhdGFbMF0gPT0gSU5URVJQT0xBVElPTl9ERUxJTUlURVIpIHtcbiAgICB0RGF0YVtsYXN0QmluZGluZ0luZGV4XSA9IHByb3BOYW1lICsgYmluZGluZ01ldGFkYXRhO1xuXG4gICAgLy8gV2UgZG9uJ3Qgd2FudCB0byBzdG9yZSBpbmRpY2VzIGZvciBob3N0IGJpbmRpbmdzIGJlY2F1c2UgdGhleSBhcmUgc3RvcmVkIGluIGFcbiAgICAvLyBkaWZmZXJlbnQgcGFydCBvZiBMVmlldyAodGhlIGV4cGFuZG8gc2VjdGlvbikuXG4gICAgaWYgKCFuYXRpdmVPbmx5KSB7XG4gICAgICBpZiAodE5vZGUucHJvcGVydHlNZXRhZGF0YVN0YXJ0SW5kZXggPT0gLTEpIHtcbiAgICAgICAgdE5vZGUucHJvcGVydHlNZXRhZGF0YVN0YXJ0SW5kZXggPSBsYXN0QmluZGluZ0luZGV4O1xuICAgICAgfVxuICAgICAgdE5vZGUucHJvcGVydHlNZXRhZGF0YUVuZEluZGV4ID0gbGFzdEJpbmRpbmdJbmRleCArIDE7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuKiBDcmVhdGVzIGFuIGVycm9yIHRoYXQgc2hvdWxkIGJlIHRocm93biB3aGVuIGVuY291bnRlcmluZyBhbiB1bmtub3duIHByb3BlcnR5IG9uIGFuIGVsZW1lbnQuXG4qIEBwYXJhbSBwcm9wTmFtZSBOYW1lIG9mIHRoZSBpbnZhbGlkIHByb3BlcnR5LlxuKiBAcGFyYW0gdE5vZGUgTm9kZSBvbiB3aGljaCB3ZSBlbmNvdW50ZXJlZCB0aGUgZXJyb3IuXG4qL1xuZnVuY3Rpb24gY3JlYXRlVW5rbm93blByb3BlcnR5RXJyb3IocHJvcE5hbWU6IHN0cmluZywgdE5vZGU6IFROb2RlKTogRXJyb3Ige1xuICByZXR1cm4gbmV3IEVycm9yKFxuICAgICAgYFRlbXBsYXRlIGVycm9yOiBDYW4ndCBiaW5kIHRvICcke3Byb3BOYW1lfScgc2luY2UgaXQgaXNuJ3QgYSBrbm93biBwcm9wZXJ0eSBvZiAnJHt0Tm9kZS50YWdOYW1lfScuYCk7XG59XG5cbi8qKlxuICogSW5zdGFudGlhdGUgYSByb290IGNvbXBvbmVudC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluc3RhbnRpYXRlUm9vdENvbXBvbmVudDxUPihcbiAgICB0VmlldzogVFZpZXcsIHZpZXdEYXRhOiBMVmlldywgZGVmOiBDb21wb25lbnREZWY8VD4pOiBUIHtcbiAgY29uc3Qgcm9vdFROb2RlID0gZ2V0UHJldmlvdXNPclBhcmVudFROb2RlKCk7XG4gIGlmICh0Vmlldy5maXJzdFRlbXBsYXRlUGFzcykge1xuICAgIGlmIChkZWYucHJvdmlkZXJzUmVzb2x2ZXIpIGRlZi5wcm92aWRlcnNSZXNvbHZlcihkZWYpO1xuICAgIGdlbmVyYXRlRXhwYW5kb0luc3RydWN0aW9uQmxvY2sodFZpZXcsIHJvb3RUTm9kZSwgMSk7XG4gICAgYmFzZVJlc29sdmVEaXJlY3RpdmUodFZpZXcsIHZpZXdEYXRhLCBkZWYsIGRlZi5mYWN0b3J5KTtcbiAgfVxuICBjb25zdCBkaXJlY3RpdmUgPVxuICAgICAgZ2V0Tm9kZUluamVjdGFibGUodFZpZXcuZGF0YSwgdmlld0RhdGEsIHZpZXdEYXRhLmxlbmd0aCAtIDEsIHJvb3RUTm9kZSBhcyBURWxlbWVudE5vZGUpO1xuICBwb3N0UHJvY2Vzc0Jhc2VEaXJlY3RpdmUodmlld0RhdGEsIHJvb3RUTm9kZSwgZGlyZWN0aXZlKTtcbiAgcmV0dXJuIGRpcmVjdGl2ZTtcbn1cblxuLyoqXG4gKiBSZXNvbHZlIHRoZSBtYXRjaGVkIGRpcmVjdGl2ZXMgb24gYSBub2RlLlxuICovXG5mdW5jdGlvbiByZXNvbHZlRGlyZWN0aXZlcyhcbiAgICB0VmlldzogVFZpZXcsIHZpZXdEYXRhOiBMVmlldywgZGlyZWN0aXZlczogRGlyZWN0aXZlRGVmPGFueT5bXSB8IG51bGwsIHROb2RlOiBUTm9kZSxcbiAgICBsb2NhbFJlZnM6IHN0cmluZ1tdIHwgbnVsbCk6IHZvaWQge1xuICAvLyBQbGVhc2UgbWFrZSBzdXJlIHRvIGhhdmUgZXhwbGljaXQgdHlwZSBmb3IgYGV4cG9ydHNNYXBgLiBJbmZlcnJlZCB0eXBlIHRyaWdnZXJzIGJ1ZyBpbiB0c2lja2xlLlxuICBuZ0Rldk1vZGUgJiYgYXNzZXJ0RXF1YWwodFZpZXcuZmlyc3RUZW1wbGF0ZVBhc3MsIHRydWUsICdzaG91bGQgcnVuIG9uIGZpcnN0IHRlbXBsYXRlIHBhc3Mgb25seScpO1xuICBjb25zdCBleHBvcnRzTWFwOiAoe1trZXk6IHN0cmluZ106IG51bWJlcn0gfCBudWxsKSA9IGxvY2FsUmVmcyA/IHsnJzogLTF9IDogbnVsbDtcbiAgaWYgKGRpcmVjdGl2ZXMpIHtcbiAgICBpbml0Tm9kZUZsYWdzKHROb2RlLCB0Vmlldy5kYXRhLmxlbmd0aCwgZGlyZWN0aXZlcy5sZW5ndGgpO1xuICAgIC8vIFdoZW4gdGhlIHNhbWUgdG9rZW4gaXMgcHJvdmlkZWQgYnkgc2V2ZXJhbCBkaXJlY3RpdmVzIG9uIHRoZSBzYW1lIG5vZGUsIHNvbWUgcnVsZXMgYXBwbHkgaW5cbiAgICAvLyB0aGUgdmlld0VuZ2luZTpcbiAgICAvLyAtIHZpZXdQcm92aWRlcnMgaGF2ZSBwcmlvcml0eSBvdmVyIHByb3ZpZGVyc1xuICAgIC8vIC0gdGhlIGxhc3QgZGlyZWN0aXZlIGluIE5nTW9kdWxlLmRlY2xhcmF0aW9ucyBoYXMgcHJpb3JpdHkgb3ZlciB0aGUgcHJldmlvdXMgb25lXG4gICAgLy8gU28gdG8gbWF0Y2ggdGhlc2UgcnVsZXMsIHRoZSBvcmRlciBpbiB3aGljaCBwcm92aWRlcnMgYXJlIGFkZGVkIGluIHRoZSBhcnJheXMgaXMgdmVyeVxuICAgIC8vIGltcG9ydGFudC5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRpcmVjdGl2ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGRlZiA9IGRpcmVjdGl2ZXNbaV0gYXMgRGlyZWN0aXZlRGVmPGFueT47XG4gICAgICBpZiAoZGVmLnByb3ZpZGVyc1Jlc29sdmVyKSBkZWYucHJvdmlkZXJzUmVzb2x2ZXIoZGVmKTtcbiAgICB9XG4gICAgZ2VuZXJhdGVFeHBhbmRvSW5zdHJ1Y3Rpb25CbG9jayh0VmlldywgdE5vZGUsIGRpcmVjdGl2ZXMubGVuZ3RoKTtcbiAgICBjb25zdCBpbml0aWFsUHJlT3JkZXJIb29rc0xlbmd0aCA9ICh0Vmlldy5wcmVPcmRlckhvb2tzICYmIHRWaWV3LnByZU9yZGVySG9va3MubGVuZ3RoKSB8fCAwO1xuICAgIGNvbnN0IGluaXRpYWxQcmVPcmRlckNoZWNrSG9va3NMZW5ndGggPVxuICAgICAgICAodFZpZXcucHJlT3JkZXJDaGVja0hvb2tzICYmIHRWaWV3LnByZU9yZGVyQ2hlY2tIb29rcy5sZW5ndGgpIHx8IDA7XG4gICAgY29uc3Qgbm9kZUluZGV4ID0gdE5vZGUuaW5kZXggLSBIRUFERVJfT0ZGU0VUO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGlyZWN0aXZlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgZGVmID0gZGlyZWN0aXZlc1tpXSBhcyBEaXJlY3RpdmVEZWY8YW55PjtcblxuICAgICAgY29uc3QgZGlyZWN0aXZlRGVmSWR4ID0gdFZpZXcuZGF0YS5sZW5ndGg7XG4gICAgICBiYXNlUmVzb2x2ZURpcmVjdGl2ZSh0Vmlldywgdmlld0RhdGEsIGRlZiwgZGVmLmZhY3RvcnkpO1xuXG4gICAgICBzYXZlTmFtZVRvRXhwb3J0TWFwKHRWaWV3LmRhdGEgIS5sZW5ndGggLSAxLCBkZWYsIGV4cG9ydHNNYXApO1xuXG4gICAgICAvLyBJbml0IGhvb2tzIGFyZSBxdWV1ZWQgbm93IHNvIG5nT25Jbml0IGlzIGNhbGxlZCBpbiBob3N0IGNvbXBvbmVudHMgYmVmb3JlXG4gICAgICAvLyBhbnkgcHJvamVjdGVkIGNvbXBvbmVudHMuXG4gICAgICByZWdpc3RlclByZU9yZGVySG9va3MoXG4gICAgICAgICAgZGlyZWN0aXZlRGVmSWR4LCBkZWYsIHRWaWV3LCBub2RlSW5kZXgsIGluaXRpYWxQcmVPcmRlckhvb2tzTGVuZ3RoLFxuICAgICAgICAgIGluaXRpYWxQcmVPcmRlckNoZWNrSG9va3NMZW5ndGgpO1xuICAgIH1cbiAgfVxuICBpZiAoZXhwb3J0c01hcCkgY2FjaGVNYXRjaGluZ0xvY2FsTmFtZXModE5vZGUsIGxvY2FsUmVmcywgZXhwb3J0c01hcCk7XG59XG5cbi8qKlxuICogSW5zdGFudGlhdGUgYWxsIHRoZSBkaXJlY3RpdmVzIHRoYXQgd2VyZSBwcmV2aW91c2x5IHJlc29sdmVkIG9uIHRoZSBjdXJyZW50IG5vZGUuXG4gKi9cbmZ1bmN0aW9uIGluc3RhbnRpYXRlQWxsRGlyZWN0aXZlcyh0VmlldzogVFZpZXcsIGxWaWV3OiBMVmlldywgdE5vZGU6IFROb2RlKSB7XG4gIGNvbnN0IHN0YXJ0ID0gdE5vZGUuZGlyZWN0aXZlU3RhcnQ7XG4gIGNvbnN0IGVuZCA9IHROb2RlLmRpcmVjdGl2ZUVuZDtcbiAgaWYgKCF0Vmlldy5maXJzdFRlbXBsYXRlUGFzcyAmJiBzdGFydCA8IGVuZCkge1xuICAgIGdldE9yQ3JlYXRlTm9kZUluamVjdG9yRm9yTm9kZShcbiAgICAgICAgdE5vZGUgYXMgVEVsZW1lbnROb2RlIHwgVENvbnRhaW5lck5vZGUgfCBURWxlbWVudENvbnRhaW5lck5vZGUsIGxWaWV3KTtcbiAgfVxuICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIGNvbnN0IGRlZiA9IHRWaWV3LmRhdGFbaV0gYXMgRGlyZWN0aXZlRGVmPGFueT47XG4gICAgaWYgKGlzQ29tcG9uZW50RGVmKGRlZikpIHtcbiAgICAgIGFkZENvbXBvbmVudExvZ2ljKGxWaWV3LCB0Tm9kZSwgZGVmIGFzIENvbXBvbmVudERlZjxhbnk+KTtcbiAgICB9XG4gICAgY29uc3QgZGlyZWN0aXZlID0gZ2V0Tm9kZUluamVjdGFibGUodFZpZXcuZGF0YSwgbFZpZXcgISwgaSwgdE5vZGUgYXMgVEVsZW1lbnROb2RlKTtcbiAgICBwb3N0UHJvY2Vzc0RpcmVjdGl2ZShsVmlldywgZGlyZWN0aXZlLCBkZWYsIGkpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGludm9rZURpcmVjdGl2ZXNIb3N0QmluZGluZ3ModFZpZXc6IFRWaWV3LCB2aWV3RGF0YTogTFZpZXcsIHROb2RlOiBUTm9kZSkge1xuICBjb25zdCBzdGFydCA9IHROb2RlLmRpcmVjdGl2ZVN0YXJ0O1xuICBjb25zdCBlbmQgPSB0Tm9kZS5kaXJlY3RpdmVFbmQ7XG4gIGNvbnN0IGV4cGFuZG8gPSB0Vmlldy5leHBhbmRvSW5zdHJ1Y3Rpb25zICE7XG4gIGNvbnN0IGZpcnN0VGVtcGxhdGVQYXNzID0gdFZpZXcuZmlyc3RUZW1wbGF0ZVBhc3M7XG4gIGNvbnN0IGVsZW1lbnRJbmRleCA9IHROb2RlLmluZGV4IC0gSEVBREVSX09GRlNFVDtcbiAgY29uc3Qgc2VsZWN0ZWRJbmRleCA9IGdldFNlbGVjdGVkSW5kZXgoKTtcbiAgdHJ5IHtcbiAgICBzZXRBY3RpdmVIb3N0RWxlbWVudChlbGVtZW50SW5kZXgpO1xuXG4gICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICAgIGNvbnN0IGRlZiA9IHRWaWV3LmRhdGFbaV0gYXMgRGlyZWN0aXZlRGVmPGFueT47XG4gICAgICBjb25zdCBkaXJlY3RpdmUgPSB2aWV3RGF0YVtpXTtcbiAgICAgIGlmIChkZWYuaG9zdEJpbmRpbmdzKSB7XG4gICAgICAgIGludm9rZUhvc3RCaW5kaW5nc0luQ3JlYXRpb25Nb2RlKGRlZiwgZXhwYW5kbywgZGlyZWN0aXZlLCB0Tm9kZSwgZmlyc3RUZW1wbGF0ZVBhc3MpO1xuXG4gICAgICAgIC8vIEVhY2ggZGlyZWN0aXZlIGdldHMgYSB1bmlxdWVJZCB2YWx1ZSB0aGF0IGlzIHRoZSBzYW1lIGZvciBib3RoXG4gICAgICAgIC8vIGNyZWF0ZSBhbmQgdXBkYXRlIGNhbGxzIHdoZW4gdGhlIGhvc3RCaW5kaW5ncyBmdW5jdGlvbiBpcyBjYWxsZWQuIFRoZVxuICAgICAgICAvLyBkaXJlY3RpdmUgdW5pcXVlSWQgaXMgbm90IHNldCBhbnl3aGVyZS0taXQgaXMganVzdCBpbmNyZW1lbnRlZCBiZXR3ZWVuXG4gICAgICAgIC8vIGVhY2ggaG9zdEJpbmRpbmdzIGNhbGwgYW5kIGlzIHVzZWZ1bCBmb3IgaGVscGluZyBpbnN0cnVjdGlvbiBjb2RlXG4gICAgICAgIC8vIHVuaXF1ZWx5IGRldGVybWluZSB3aGljaCBkaXJlY3RpdmUgaXMgY3VycmVudGx5IGFjdGl2ZSB3aGVuIGV4ZWN1dGVkLlxuICAgICAgICBpbmNyZW1lbnRBY3RpdmVEaXJlY3RpdmVJZCgpO1xuICAgICAgfSBlbHNlIGlmIChmaXJzdFRlbXBsYXRlUGFzcykge1xuICAgICAgICBleHBhbmRvLnB1c2gobnVsbCk7XG4gICAgICB9XG4gICAgfVxuICB9IGZpbmFsbHkge1xuICAgIHNldEFjdGl2ZUhvc3RFbGVtZW50KHNlbGVjdGVkSW5kZXgpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnZva2VIb3N0QmluZGluZ3NJbkNyZWF0aW9uTW9kZShcbiAgICBkZWY6IERpcmVjdGl2ZURlZjxhbnk+LCBleHBhbmRvOiBFeHBhbmRvSW5zdHJ1Y3Rpb25zLCBkaXJlY3RpdmU6IGFueSwgdE5vZGU6IFROb2RlLFxuICAgIGZpcnN0VGVtcGxhdGVQYXNzOiBib29sZWFuKSB7XG4gIGNvbnN0IHByZXZpb3VzRXhwYW5kb0xlbmd0aCA9IGV4cGFuZG8ubGVuZ3RoO1xuICBzZXRDdXJyZW50RGlyZWN0aXZlRGVmKGRlZik7XG4gIGNvbnN0IGVsZW1lbnRJbmRleCA9IHROb2RlLmluZGV4IC0gSEVBREVSX09GRlNFVDtcbiAgZGVmLmhvc3RCaW5kaW5ncyAhKFJlbmRlckZsYWdzLkNyZWF0ZSwgZGlyZWN0aXZlLCBlbGVtZW50SW5kZXgpO1xuICBzZXRDdXJyZW50RGlyZWN0aXZlRGVmKG51bGwpO1xuICAvLyBgaG9zdEJpbmRpbmdzYCBmdW5jdGlvbiBtYXkgb3IgbWF5IG5vdCBjb250YWluIGBhbGxvY0hvc3RWYXJzYCBjYWxsXG4gIC8vIChlLmcuIGl0IG1heSBub3QgaWYgaXQgb25seSBjb250YWlucyBob3N0IGxpc3RlbmVycyksIHNvIHdlIG5lZWQgdG8gY2hlY2sgd2hldGhlclxuICAvLyBgZXhwYW5kb0luc3RydWN0aW9uc2AgaGFzIGNoYW5nZWQgYW5kIGlmIG5vdCAtIHdlIHN0aWxsIHB1c2ggYGhvc3RCaW5kaW5nc2AgdG9cbiAgLy8gZXhwYW5kbyBibG9jaywgdG8gbWFrZSBzdXJlIHdlIGV4ZWN1dGUgaXQgZm9yIERJIGN5Y2xlXG4gIGlmIChwcmV2aW91c0V4cGFuZG9MZW5ndGggPT09IGV4cGFuZG8ubGVuZ3RoICYmIGZpcnN0VGVtcGxhdGVQYXNzKSB7XG4gICAgZXhwYW5kby5wdXNoKGRlZi5ob3N0QmluZGluZ3MpO1xuICB9XG59XG5cbi8qKlxuKiBHZW5lcmF0ZXMgYSBuZXcgYmxvY2sgaW4gVFZpZXcuZXhwYW5kb0luc3RydWN0aW9ucyBmb3IgdGhpcyBub2RlLlxuKlxuKiBFYWNoIGV4cGFuZG8gYmxvY2sgc3RhcnRzIHdpdGggdGhlIGVsZW1lbnQgaW5kZXggKHR1cm5lZCBuZWdhdGl2ZSBzbyB3ZSBjYW4gZGlzdGluZ3Vpc2hcbiogaXQgZnJvbSB0aGUgaG9zdFZhciBjb3VudCkgYW5kIHRoZSBkaXJlY3RpdmUgY291bnQuIFNlZSBtb3JlIGluIFZJRVdfREFUQS5tZC5cbiovXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVFeHBhbmRvSW5zdHJ1Y3Rpb25CbG9jayhcbiAgICB0VmlldzogVFZpZXcsIHROb2RlOiBUTm9kZSwgZGlyZWN0aXZlQ291bnQ6IG51bWJlcik6IHZvaWQge1xuICBuZ0Rldk1vZGUgJiYgYXNzZXJ0RXF1YWwoXG4gICAgICAgICAgICAgICAgICAgdFZpZXcuZmlyc3RUZW1wbGF0ZVBhc3MsIHRydWUsXG4gICAgICAgICAgICAgICAgICAgJ0V4cGFuZG8gYmxvY2sgc2hvdWxkIG9ubHkgYmUgZ2VuZXJhdGVkIG9uIGZpcnN0IHRlbXBsYXRlIHBhc3MuJyk7XG5cbiAgY29uc3QgZWxlbWVudEluZGV4ID0gLSh0Tm9kZS5pbmRleCAtIEhFQURFUl9PRkZTRVQpO1xuICBjb25zdCBwcm92aWRlclN0YXJ0SW5kZXggPSB0Tm9kZS5wcm92aWRlckluZGV4ZXMgJiBUTm9kZVByb3ZpZGVySW5kZXhlcy5Qcm92aWRlcnNTdGFydEluZGV4TWFzaztcbiAgY29uc3QgcHJvdmlkZXJDb3VudCA9IHRWaWV3LmRhdGEubGVuZ3RoIC0gcHJvdmlkZXJTdGFydEluZGV4O1xuICAodFZpZXcuZXhwYW5kb0luc3RydWN0aW9ucyB8fCAodFZpZXcuZXhwYW5kb0luc3RydWN0aW9ucyA9IFtcbiAgIF0pKS5wdXNoKGVsZW1lbnRJbmRleCwgcHJvdmlkZXJDb3VudCwgZGlyZWN0aXZlQ291bnQpO1xufVxuXG4vKipcbiAqIFByb2Nlc3MgYSBkaXJlY3RpdmUgb24gdGhlIGN1cnJlbnQgbm9kZSBhZnRlciBpdHMgY3JlYXRpb24uXG4gKi9cbmZ1bmN0aW9uIHBvc3RQcm9jZXNzRGlyZWN0aXZlPFQ+KFxuICAgIHZpZXdEYXRhOiBMVmlldywgZGlyZWN0aXZlOiBULCBkZWY6IERpcmVjdGl2ZURlZjxUPiwgZGlyZWN0aXZlRGVmSWR4OiBudW1iZXIpOiB2b2lkIHtcbiAgY29uc3QgcHJldmlvdXNPclBhcmVudFROb2RlID0gZ2V0UHJldmlvdXNPclBhcmVudFROb2RlKCk7XG4gIHBvc3RQcm9jZXNzQmFzZURpcmVjdGl2ZSh2aWV3RGF0YSwgcHJldmlvdXNPclBhcmVudFROb2RlLCBkaXJlY3RpdmUpO1xuICBuZ0Rldk1vZGUgJiYgYXNzZXJ0RGVmaW5lZChwcmV2aW91c09yUGFyZW50VE5vZGUsICdwcmV2aW91c09yUGFyZW50VE5vZGUnKTtcbiAgaWYgKHByZXZpb3VzT3JQYXJlbnRUTm9kZSAmJiBwcmV2aW91c09yUGFyZW50VE5vZGUuYXR0cnMpIHtcbiAgICBzZXRJbnB1dHNGcm9tQXR0cnMoZGlyZWN0aXZlRGVmSWR4LCBkaXJlY3RpdmUsIGRlZiwgcHJldmlvdXNPclBhcmVudFROb2RlKTtcbiAgfVxuXG4gIGlmICh2aWV3RGF0YVtUVklFV10uZmlyc3RUZW1wbGF0ZVBhc3MgJiYgZGVmLmNvbnRlbnRRdWVyaWVzKSB7XG4gICAgcHJldmlvdXNPclBhcmVudFROb2RlLmZsYWdzIHw9IFROb2RlRmxhZ3MuaGFzQ29udGVudFF1ZXJ5O1xuICB9XG5cbiAgaWYgKGlzQ29tcG9uZW50RGVmKGRlZikpIHtcbiAgICBjb25zdCBjb21wb25lbnRWaWV3ID0gZ2V0Q29tcG9uZW50Vmlld0J5SW5kZXgocHJldmlvdXNPclBhcmVudFROb2RlLmluZGV4LCB2aWV3RGF0YSk7XG4gICAgY29tcG9uZW50Vmlld1tDT05URVhUXSA9IGRpcmVjdGl2ZTtcbiAgfVxufVxuXG4vKipcbiAqIEEgbGlnaHRlciB2ZXJzaW9uIG9mIHBvc3RQcm9jZXNzRGlyZWN0aXZlKCkgdGhhdCBpcyB1c2VkIGZvciB0aGUgcm9vdCBjb21wb25lbnQuXG4gKi9cbmZ1bmN0aW9uIHBvc3RQcm9jZXNzQmFzZURpcmVjdGl2ZTxUPihcbiAgICBsVmlldzogTFZpZXcsIHByZXZpb3VzT3JQYXJlbnRUTm9kZTogVE5vZGUsIGRpcmVjdGl2ZTogVCk6IHZvaWQge1xuICBjb25zdCBuYXRpdmUgPSBnZXROYXRpdmVCeVROb2RlKHByZXZpb3VzT3JQYXJlbnRUTm9kZSwgbFZpZXcpO1xuXG4gIG5nRGV2TW9kZSAmJiBhc3NlcnRFcXVhbChcbiAgICAgICAgICAgICAgICAgICBsVmlld1tCSU5ESU5HX0lOREVYXSwgbFZpZXdbVFZJRVddLmJpbmRpbmdTdGFydEluZGV4LFxuICAgICAgICAgICAgICAgICAgICdkaXJlY3RpdmVzIHNob3VsZCBiZSBjcmVhdGVkIGJlZm9yZSBhbnkgYmluZGluZ3MnKTtcbiAgbmdEZXZNb2RlICYmIGFzc2VydFByZXZpb3VzSXNQYXJlbnQoZ2V0SXNQYXJlbnQoKSk7XG5cbiAgYXR0YWNoUGF0Y2hEYXRhKGRpcmVjdGl2ZSwgbFZpZXcpO1xuICBpZiAobmF0aXZlKSB7XG4gICAgYXR0YWNoUGF0Y2hEYXRhKG5hdGl2ZSwgbFZpZXcpO1xuICB9XG59XG5cblxuXG4vKipcbiogTWF0Y2hlcyB0aGUgY3VycmVudCBub2RlIGFnYWluc3QgYWxsIGF2YWlsYWJsZSBzZWxlY3RvcnMuXG4qIElmIGEgY29tcG9uZW50IGlzIG1hdGNoZWQgKGF0IG1vc3Qgb25lKSwgaXQgaXMgcmV0dXJuZWQgaW4gZmlyc3QgcG9zaXRpb24gaW4gdGhlIGFycmF5LlxuKi9cbmZ1bmN0aW9uIGZpbmREaXJlY3RpdmVNYXRjaGVzKHRWaWV3OiBUVmlldywgdmlld0RhdGE6IExWaWV3LCB0Tm9kZTogVE5vZGUpOiBEaXJlY3RpdmVEZWY8YW55PltdfFxuICAgIG51bGwge1xuICBuZ0Rldk1vZGUgJiYgYXNzZXJ0RXF1YWwodFZpZXcuZmlyc3RUZW1wbGF0ZVBhc3MsIHRydWUsICdzaG91bGQgcnVuIG9uIGZpcnN0IHRlbXBsYXRlIHBhc3Mgb25seScpO1xuICBjb25zdCByZWdpc3RyeSA9IHRWaWV3LmRpcmVjdGl2ZVJlZ2lzdHJ5O1xuICBsZXQgbWF0Y2hlczogYW55W118bnVsbCA9IG51bGw7XG4gIGlmIChyZWdpc3RyeSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVnaXN0cnkubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGRlZiA9IHJlZ2lzdHJ5W2ldIGFzIENvbXBvbmVudERlZjxhbnk+fCBEaXJlY3RpdmVEZWY8YW55PjtcbiAgICAgIGlmIChpc05vZGVNYXRjaGluZ1NlbGVjdG9yTGlzdCh0Tm9kZSwgZGVmLnNlbGVjdG9ycyAhLCAvKiBpc1Byb2plY3Rpb25Nb2RlICovIGZhbHNlKSkge1xuICAgICAgICBtYXRjaGVzIHx8IChtYXRjaGVzID0gW10pO1xuICAgICAgICBkaVB1YmxpY0luSW5qZWN0b3IoXG4gICAgICAgICAgICBnZXRPckNyZWF0ZU5vZGVJbmplY3RvckZvck5vZGUoXG4gICAgICAgICAgICAgICAgZ2V0UHJldmlvdXNPclBhcmVudFROb2RlKCkgYXMgVEVsZW1lbnROb2RlIHwgVENvbnRhaW5lck5vZGUgfCBURWxlbWVudENvbnRhaW5lck5vZGUsXG4gICAgICAgICAgICAgICAgdmlld0RhdGEpLFxuICAgICAgICAgICAgdmlld0RhdGEsIGRlZi50eXBlKTtcblxuICAgICAgICBpZiAoaXNDb21wb25lbnREZWYoZGVmKSkge1xuICAgICAgICAgIGlmICh0Tm9kZS5mbGFncyAmIFROb2RlRmxhZ3MuaXNDb21wb25lbnQpIHRocm93TXVsdGlwbGVDb21wb25lbnRFcnJvcih0Tm9kZSk7XG4gICAgICAgICAgdE5vZGUuZmxhZ3MgPSBUTm9kZUZsYWdzLmlzQ29tcG9uZW50O1xuXG4gICAgICAgICAgLy8gVGhlIGNvbXBvbmVudCBpcyBhbHdheXMgc3RvcmVkIGZpcnN0IHdpdGggZGlyZWN0aXZlcyBhZnRlci5cbiAgICAgICAgICBtYXRjaGVzLnVuc2hpZnQoZGVmKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtYXRjaGVzLnB1c2goZGVmKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gbWF0Y2hlcztcbn1cblxuLyoqIFN0b3JlcyBpbmRleCBvZiBjb21wb25lbnQncyBob3N0IGVsZW1lbnQgc28gaXQgd2lsbCBiZSBxdWV1ZWQgZm9yIHZpZXcgcmVmcmVzaCBkdXJpbmcgQ0QuICovXG5leHBvcnQgZnVuY3Rpb24gcXVldWVDb21wb25lbnRJbmRleEZvckNoZWNrKHByZXZpb3VzT3JQYXJlbnRUTm9kZTogVE5vZGUpOiB2b2lkIHtcbiAgY29uc3QgdFZpZXcgPSBnZXRMVmlldygpW1RWSUVXXTtcbiAgbmdEZXZNb2RlICYmXG4gICAgICBhc3NlcnRFcXVhbCh0Vmlldy5maXJzdFRlbXBsYXRlUGFzcywgdHJ1ZSwgJ1Nob3VsZCBvbmx5IGJlIGNhbGxlZCBpbiBmaXJzdCB0ZW1wbGF0ZSBwYXNzLicpO1xuICAodFZpZXcuY29tcG9uZW50cyB8fCAodFZpZXcuY29tcG9uZW50cyA9IFtdKSkucHVzaChwcmV2aW91c09yUGFyZW50VE5vZGUuaW5kZXgpO1xufVxuXG5cbi8qKiBDYWNoZXMgbG9jYWwgbmFtZXMgYW5kIHRoZWlyIG1hdGNoaW5nIGRpcmVjdGl2ZSBpbmRpY2VzIGZvciBxdWVyeSBhbmQgdGVtcGxhdGUgbG9va3Vwcy4gKi9cbmZ1bmN0aW9uIGNhY2hlTWF0Y2hpbmdMb2NhbE5hbWVzKFxuICAgIHROb2RlOiBUTm9kZSwgbG9jYWxSZWZzOiBzdHJpbmdbXSB8IG51bGwsIGV4cG9ydHNNYXA6IHtba2V5OiBzdHJpbmddOiBudW1iZXJ9KTogdm9pZCB7XG4gIGlmIChsb2NhbFJlZnMpIHtcbiAgICBjb25zdCBsb2NhbE5hbWVzOiAoc3RyaW5nIHwgbnVtYmVyKVtdID0gdE5vZGUubG9jYWxOYW1lcyA9IFtdO1xuXG4gICAgLy8gTG9jYWwgbmFtZXMgbXVzdCBiZSBzdG9yZWQgaW4gdE5vZGUgaW4gdGhlIHNhbWUgb3JkZXIgdGhhdCBsb2NhbFJlZnMgYXJlIGRlZmluZWRcbiAgICAvLyBpbiB0aGUgdGVtcGxhdGUgdG8gZW5zdXJlIHRoZSBkYXRhIGlzIGxvYWRlZCBpbiB0aGUgc2FtZSBzbG90cyBhcyB0aGVpciByZWZzXG4gICAgLy8gaW4gdGhlIHRlbXBsYXRlIChmb3IgdGVtcGxhdGUgcXVlcmllcykuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsb2NhbFJlZnMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gZXhwb3J0c01hcFtsb2NhbFJlZnNbaSArIDFdXTtcbiAgICAgIGlmIChpbmRleCA9PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoYEV4cG9ydCBvZiBuYW1lICcke2xvY2FsUmVmc1tpICsgMV19JyBub3QgZm91bmQhYCk7XG4gICAgICBsb2NhbE5hbWVzLnB1c2gobG9jYWxSZWZzW2ldLCBpbmRleCk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuKiBCdWlsZHMgdXAgYW4gZXhwb3J0IG1hcCBhcyBkaXJlY3RpdmVzIGFyZSBjcmVhdGVkLCBzbyBsb2NhbCByZWZzIGNhbiBiZSBxdWlja2x5IG1hcHBlZFxuKiB0byB0aGVpciBkaXJlY3RpdmUgaW5zdGFuY2VzLlxuKi9cbmZ1bmN0aW9uIHNhdmVOYW1lVG9FeHBvcnRNYXAoXG4gICAgaW5kZXg6IG51bWJlciwgZGVmOiBEaXJlY3RpdmVEZWY8YW55PnwgQ29tcG9uZW50RGVmPGFueT4sXG4gICAgZXhwb3J0c01hcDoge1trZXk6IHN0cmluZ106IG51bWJlcn0gfCBudWxsKSB7XG4gIGlmIChleHBvcnRzTWFwKSB7XG4gICAgaWYgKGRlZi5leHBvcnRBcykge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkZWYuZXhwb3J0QXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZXhwb3J0c01hcFtkZWYuZXhwb3J0QXNbaV1dID0gaW5kZXg7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICgoZGVmIGFzIENvbXBvbmVudERlZjxhbnk+KS50ZW1wbGF0ZSkgZXhwb3J0c01hcFsnJ10gPSBpbmRleDtcbiAgfVxufVxuXG4vKipcbiAqIEluaXRpYWxpemVzIHRoZSBmbGFncyBvbiB0aGUgY3VycmVudCBub2RlLCBzZXR0aW5nIGFsbCBpbmRpY2VzIHRvIHRoZSBpbml0aWFsIGluZGV4LFxuICogdGhlIGRpcmVjdGl2ZSBjb3VudCB0byAwLCBhbmQgYWRkaW5nIHRoZSBpc0NvbXBvbmVudCBmbGFnLlxuICogQHBhcmFtIGluZGV4IHRoZSBpbml0aWFsIGluZGV4XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0Tm9kZUZsYWdzKHROb2RlOiBUTm9kZSwgaW5kZXg6IG51bWJlciwgbnVtYmVyT2ZEaXJlY3RpdmVzOiBudW1iZXIpIHtcbiAgY29uc3QgZmxhZ3MgPSB0Tm9kZS5mbGFncztcbiAgbmdEZXZNb2RlICYmIGFzc2VydEVxdWFsKFxuICAgICAgICAgICAgICAgICAgIGZsYWdzID09PSAwIHx8IGZsYWdzID09PSBUTm9kZUZsYWdzLmlzQ29tcG9uZW50LCB0cnVlLFxuICAgICAgICAgICAgICAgICAgICdleHBlY3RlZCBub2RlIGZsYWdzIHRvIG5vdCBiZSBpbml0aWFsaXplZCcpO1xuXG4gIG5nRGV2TW9kZSAmJiBhc3NlcnROb3RFcXVhbChcbiAgICAgICAgICAgICAgICAgICBudW1iZXJPZkRpcmVjdGl2ZXMsIHROb2RlLmRpcmVjdGl2ZUVuZCAtIHROb2RlLmRpcmVjdGl2ZVN0YXJ0LFxuICAgICAgICAgICAgICAgICAgICdSZWFjaGVkIHRoZSBtYXggbnVtYmVyIG9mIGRpcmVjdGl2ZXMnKTtcbiAgLy8gV2hlbiB0aGUgZmlyc3QgZGlyZWN0aXZlIGlzIGNyZWF0ZWQgb24gYSBub2RlLCBzYXZlIHRoZSBpbmRleFxuICB0Tm9kZS5mbGFncyA9IGZsYWdzICYgVE5vZGVGbGFncy5pc0NvbXBvbmVudDtcbiAgdE5vZGUuZGlyZWN0aXZlU3RhcnQgPSBpbmRleDtcbiAgdE5vZGUuZGlyZWN0aXZlRW5kID0gaW5kZXggKyBudW1iZXJPZkRpcmVjdGl2ZXM7XG4gIHROb2RlLnByb3ZpZGVySW5kZXhlcyA9IGluZGV4O1xufVxuXG5mdW5jdGlvbiBiYXNlUmVzb2x2ZURpcmVjdGl2ZTxUPihcbiAgICB0VmlldzogVFZpZXcsIHZpZXdEYXRhOiBMVmlldywgZGVmOiBEaXJlY3RpdmVEZWY8VD4sXG4gICAgZGlyZWN0aXZlRmFjdG9yeTogKHQ6IFR5cGU8VD58IG51bGwpID0+IGFueSkge1xuICB0Vmlldy5kYXRhLnB1c2goZGVmKTtcbiAgY29uc3Qgbm9kZUluamVjdG9yRmFjdG9yeSA9IG5ldyBOb2RlSW5qZWN0b3JGYWN0b3J5KGRpcmVjdGl2ZUZhY3RvcnksIGlzQ29tcG9uZW50RGVmKGRlZiksIG51bGwpO1xuICB0Vmlldy5ibHVlcHJpbnQucHVzaChub2RlSW5qZWN0b3JGYWN0b3J5KTtcbiAgdmlld0RhdGEucHVzaChub2RlSW5qZWN0b3JGYWN0b3J5KTtcbn1cblxuZnVuY3Rpb24gYWRkQ29tcG9uZW50TG9naWM8VD4oXG4gICAgbFZpZXc6IExWaWV3LCBwcmV2aW91c09yUGFyZW50VE5vZGU6IFROb2RlLCBkZWY6IENvbXBvbmVudERlZjxUPik6IHZvaWQge1xuICBjb25zdCBuYXRpdmUgPSBnZXROYXRpdmVCeVROb2RlKHByZXZpb3VzT3JQYXJlbnRUTm9kZSwgbFZpZXcpO1xuXG4gIGNvbnN0IHRWaWV3ID0gZ2V0T3JDcmVhdGVUVmlldyhcbiAgICAgIGRlZi50ZW1wbGF0ZSwgZGVmLmNvbnN0cywgZGVmLnZhcnMsIGRlZi5kaXJlY3RpdmVEZWZzLCBkZWYucGlwZURlZnMsIGRlZi52aWV3UXVlcnksXG4gICAgICBkZWYuc2NoZW1hcyk7XG5cbiAgLy8gT25seSBjb21wb25lbnQgdmlld3Mgc2hvdWxkIGJlIGFkZGVkIHRvIHRoZSB2aWV3IHRyZWUgZGlyZWN0bHkuIEVtYmVkZGVkIHZpZXdzIGFyZVxuICAvLyBhY2Nlc3NlZCB0aHJvdWdoIHRoZWlyIGNvbnRhaW5lcnMgYmVjYXVzZSB0aGV5IG1heSBiZSByZW1vdmVkIC8gcmUtYWRkZWQgbGF0ZXIuXG4gIGNvbnN0IHJlbmRlcmVyRmFjdG9yeSA9IGxWaWV3W1JFTkRFUkVSX0ZBQ1RPUlldO1xuICBjb25zdCBjb21wb25lbnRWaWV3ID0gYWRkVG9WaWV3VHJlZShcbiAgICAgIGxWaWV3LCBjcmVhdGVMVmlldyhcbiAgICAgICAgICAgICAgICAgbFZpZXcsIHRWaWV3LCBudWxsLCBkZWYub25QdXNoID8gTFZpZXdGbGFncy5EaXJ0eSA6IExWaWV3RmxhZ3MuQ2hlY2tBbHdheXMsXG4gICAgICAgICAgICAgICAgIGxWaWV3W3ByZXZpb3VzT3JQYXJlbnRUTm9kZS5pbmRleF0sIHByZXZpb3VzT3JQYXJlbnRUTm9kZSBhcyBURWxlbWVudE5vZGUsXG4gICAgICAgICAgICAgICAgIHJlbmRlcmVyRmFjdG9yeSwgbFZpZXdbUkVOREVSRVJfRkFDVE9SWV0uY3JlYXRlUmVuZGVyZXIobmF0aXZlIGFzIFJFbGVtZW50LCBkZWYpKSk7XG5cbiAgY29tcG9uZW50Vmlld1tUX0hPU1RdID0gcHJldmlvdXNPclBhcmVudFROb2RlIGFzIFRFbGVtZW50Tm9kZTtcblxuICAvLyBDb21wb25lbnQgdmlldyB3aWxsIGFsd2F5cyBiZSBjcmVhdGVkIGJlZm9yZSBhbnkgaW5qZWN0ZWQgTENvbnRhaW5lcnMsXG4gIC8vIHNvIHRoaXMgaXMgYSByZWd1bGFyIGVsZW1lbnQsIHdyYXAgaXQgd2l0aCB0aGUgY29tcG9uZW50IHZpZXdcbiAgbFZpZXdbcHJldmlvdXNPclBhcmVudFROb2RlLmluZGV4XSA9IGNvbXBvbmVudFZpZXc7XG5cbiAgaWYgKGxWaWV3W1RWSUVXXS5maXJzdFRlbXBsYXRlUGFzcykge1xuICAgIHF1ZXVlQ29tcG9uZW50SW5kZXhGb3JDaGVjayhwcmV2aW91c09yUGFyZW50VE5vZGUpO1xuICB9XG59XG5cbi8qKlxuICogU2V0cyBpbml0aWFsIGlucHV0IHByb3BlcnRpZXMgb24gZGlyZWN0aXZlIGluc3RhbmNlcyBmcm9tIGF0dHJpYnV0ZSBkYXRhXG4gKlxuICogQHBhcmFtIGRpcmVjdGl2ZUluZGV4IEluZGV4IG9mIHRoZSBkaXJlY3RpdmUgaW4gZGlyZWN0aXZlcyBhcnJheVxuICogQHBhcmFtIGluc3RhbmNlIEluc3RhbmNlIG9mIHRoZSBkaXJlY3RpdmUgb24gd2hpY2ggdG8gc2V0IHRoZSBpbml0aWFsIGlucHV0c1xuICogQHBhcmFtIGRlZiBUaGUgZGlyZWN0aXZlIGRlZiB0aGF0IGNvbnRhaW5zIHRoZSBsaXN0IG9mIGlucHV0c1xuICogQHBhcmFtIHROb2RlIFRoZSBzdGF0aWMgZGF0YSBmb3IgdGhpcyBub2RlXG4gKi9cbmZ1bmN0aW9uIHNldElucHV0c0Zyb21BdHRyczxUPihcbiAgICBkaXJlY3RpdmVJbmRleDogbnVtYmVyLCBpbnN0YW5jZTogVCwgZGVmOiBEaXJlY3RpdmVEZWY8VD4sIHROb2RlOiBUTm9kZSk6IHZvaWQge1xuICBsZXQgaW5pdGlhbElucHV0RGF0YSA9IHROb2RlLmluaXRpYWxJbnB1dHMgYXMgSW5pdGlhbElucHV0RGF0YSB8IHVuZGVmaW5lZDtcbiAgaWYgKGluaXRpYWxJbnB1dERhdGEgPT09IHVuZGVmaW5lZCB8fCBkaXJlY3RpdmVJbmRleCA+PSBpbml0aWFsSW5wdXREYXRhLmxlbmd0aCkge1xuICAgIGluaXRpYWxJbnB1dERhdGEgPSBnZW5lcmF0ZUluaXRpYWxJbnB1dHMoZGlyZWN0aXZlSW5kZXgsIGRlZi5pbnB1dHMsIHROb2RlKTtcbiAgfVxuXG4gIGNvbnN0IGluaXRpYWxJbnB1dHM6IEluaXRpYWxJbnB1dHN8bnVsbCA9IGluaXRpYWxJbnB1dERhdGFbZGlyZWN0aXZlSW5kZXhdO1xuICBpZiAoaW5pdGlhbElucHV0cykge1xuICAgIGNvbnN0IHNldElucHV0ID0gZGVmLnNldElucHV0O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5pdGlhbElucHV0cy5sZW5ndGg7KSB7XG4gICAgICBjb25zdCBwdWJsaWNOYW1lID0gaW5pdGlhbElucHV0c1tpKytdO1xuICAgICAgY29uc3QgcHJpdmF0ZU5hbWUgPSBpbml0aWFsSW5wdXRzW2krK107XG4gICAgICBjb25zdCB2YWx1ZSA9IGluaXRpYWxJbnB1dHNbaSsrXTtcbiAgICAgIGlmIChzZXRJbnB1dCkge1xuICAgICAgICBkZWYuc2V0SW5wdXQgIShpbnN0YW5jZSwgdmFsdWUsIHB1YmxpY05hbWUsIHByaXZhdGVOYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIChpbnN0YW5jZSBhcyBhbnkpW3ByaXZhdGVOYW1lXSA9IHZhbHVlO1xuICAgICAgfVxuICAgICAgaWYgKG5nRGV2TW9kZSkge1xuICAgICAgICBjb25zdCBsVmlldyA9IGdldExWaWV3KCk7XG4gICAgICAgIGNvbnN0IG5hdGl2ZUVsZW1lbnQgPSBnZXROYXRpdmVCeVROb2RlKHROb2RlLCBsVmlldykgYXMgUkVsZW1lbnQ7XG4gICAgICAgIHNldE5nUmVmbGVjdFByb3BlcnR5KGxWaWV3LCBuYXRpdmVFbGVtZW50LCB0Tm9kZS50eXBlLCBwcml2YXRlTmFtZSwgdmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEdlbmVyYXRlcyBpbml0aWFsSW5wdXREYXRhIGZvciBhIG5vZGUgYW5kIHN0b3JlcyBpdCBpbiB0aGUgdGVtcGxhdGUncyBzdGF0aWMgc3RvcmFnZVxuICogc28gc3Vic2VxdWVudCB0ZW1wbGF0ZSBpbnZvY2F0aW9ucyBkb24ndCBoYXZlIHRvIHJlY2FsY3VsYXRlIGl0LlxuICpcbiAqIGluaXRpYWxJbnB1dERhdGEgaXMgYW4gYXJyYXkgY29udGFpbmluZyB2YWx1ZXMgdGhhdCBuZWVkIHRvIGJlIHNldCBhcyBpbnB1dCBwcm9wZXJ0aWVzXG4gKiBmb3IgZGlyZWN0aXZlcyBvbiB0aGlzIG5vZGUsIGJ1dCBvbmx5IG9uY2Ugb24gY3JlYXRpb24uIFdlIG5lZWQgdGhpcyBhcnJheSB0byBzdXBwb3J0XG4gKiB0aGUgY2FzZSB3aGVyZSB5b3Ugc2V0IGFuIEBJbnB1dCBwcm9wZXJ0eSBvZiBhIGRpcmVjdGl2ZSB1c2luZyBhdHRyaWJ1dGUtbGlrZSBzeW50YXguXG4gKiBlLmcuIGlmIHlvdSBoYXZlIGEgYG5hbWVgIEBJbnB1dCwgeW91IGNhbiBzZXQgaXQgb25jZSBsaWtlIHRoaXM6XG4gKlxuICogPG15LWNvbXBvbmVudCBuYW1lPVwiQmVzc1wiPjwvbXktY29tcG9uZW50PlxuICpcbiAqIEBwYXJhbSBkaXJlY3RpdmVJbmRleCBJbmRleCB0byBzdG9yZSB0aGUgaW5pdGlhbCBpbnB1dCBkYXRhXG4gKiBAcGFyYW0gaW5wdXRzIFRoZSBsaXN0IG9mIGlucHV0cyBmcm9tIHRoZSBkaXJlY3RpdmUgZGVmXG4gKiBAcGFyYW0gdE5vZGUgVGhlIHN0YXRpYyBkYXRhIG9uIHRoaXMgbm9kZVxuICovXG5mdW5jdGlvbiBnZW5lcmF0ZUluaXRpYWxJbnB1dHMoXG4gICAgZGlyZWN0aXZlSW5kZXg6IG51bWJlciwgaW5wdXRzOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSwgdE5vZGU6IFROb2RlKTogSW5pdGlhbElucHV0RGF0YSB7XG4gIGNvbnN0IGluaXRpYWxJbnB1dERhdGE6IEluaXRpYWxJbnB1dERhdGEgPSB0Tm9kZS5pbml0aWFsSW5wdXRzIHx8ICh0Tm9kZS5pbml0aWFsSW5wdXRzID0gW10pO1xuICBpbml0aWFsSW5wdXREYXRhW2RpcmVjdGl2ZUluZGV4XSA9IG51bGw7XG5cbiAgY29uc3QgYXR0cnMgPSB0Tm9kZS5hdHRycyAhO1xuICBsZXQgaSA9IDA7XG4gIHdoaWxlIChpIDwgYXR0cnMubGVuZ3RoKSB7XG4gICAgY29uc3QgYXR0ck5hbWUgPSBhdHRyc1tpXTtcbiAgICBpZiAoYXR0ck5hbWUgPT09IEF0dHJpYnV0ZU1hcmtlci5OYW1lc3BhY2VVUkkpIHtcbiAgICAgIC8vIFdlIGRvIG5vdCBhbGxvdyBpbnB1dHMgb24gbmFtZXNwYWNlZCBhdHRyaWJ1dGVzLlxuICAgICAgaSArPSA0O1xuICAgICAgY29udGludWU7XG4gICAgfSBlbHNlIGlmIChhdHRyTmFtZSA9PT0gQXR0cmlidXRlTWFya2VyLlByb2plY3RBcykge1xuICAgICAgLy8gU2tpcCBvdmVyIHRoZSBgbmdQcm9qZWN0QXNgIHZhbHVlLlxuICAgICAgaSArPSAyO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gSWYgd2UgaGl0IGFueSBvdGhlciBhdHRyaWJ1dGUgbWFya2Vycywgd2UncmUgZG9uZSBhbnl3YXkuIE5vbmUgb2YgdGhvc2UgYXJlIHZhbGlkIGlucHV0cy5cbiAgICBpZiAodHlwZW9mIGF0dHJOYW1lID09PSAnbnVtYmVyJykgYnJlYWs7XG5cbiAgICBjb25zdCBtaW5pZmllZElucHV0TmFtZSA9IGlucHV0c1thdHRyTmFtZSBhcyBzdHJpbmddO1xuICAgIGNvbnN0IGF0dHJWYWx1ZSA9IGF0dHJzW2kgKyAxXTtcblxuICAgIGlmIChtaW5pZmllZElucHV0TmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCBpbnB1dHNUb1N0b3JlOiBJbml0aWFsSW5wdXRzID1cbiAgICAgICAgICBpbml0aWFsSW5wdXREYXRhW2RpcmVjdGl2ZUluZGV4XSB8fCAoaW5pdGlhbElucHV0RGF0YVtkaXJlY3RpdmVJbmRleF0gPSBbXSk7XG4gICAgICBpbnB1dHNUb1N0b3JlLnB1c2goYXR0ck5hbWUgYXMgc3RyaW5nLCBtaW5pZmllZElucHV0TmFtZSwgYXR0clZhbHVlIGFzIHN0cmluZyk7XG4gICAgfVxuXG4gICAgaSArPSAyO1xuICB9XG4gIHJldHVybiBpbml0aWFsSW5wdXREYXRhO1xufVxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8vLyBWaWV3Q29udGFpbmVyICYgVmlld1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuLyoqXG4gKiBDcmVhdGVzIGEgTENvbnRhaW5lciwgZWl0aGVyIGZyb20gYSBjb250YWluZXIgaW5zdHJ1Y3Rpb24sIG9yIGZvciBhIFZpZXdDb250YWluZXJSZWYuXG4gKlxuICogQHBhcmFtIGhvc3ROYXRpdmUgVGhlIGhvc3QgZWxlbWVudCBmb3IgdGhlIExDb250YWluZXJcbiAqIEBwYXJhbSBob3N0VE5vZGUgVGhlIGhvc3QgVE5vZGUgZm9yIHRoZSBMQ29udGFpbmVyXG4gKiBAcGFyYW0gY3VycmVudFZpZXcgVGhlIHBhcmVudCB2aWV3IG9mIHRoZSBMQ29udGFpbmVyXG4gKiBAcGFyYW0gbmF0aXZlIFRoZSBuYXRpdmUgY29tbWVudCBlbGVtZW50XG4gKiBAcGFyYW0gaXNGb3JWaWV3Q29udGFpbmVyUmVmIE9wdGlvbmFsIGEgZmxhZyBpbmRpY2F0aW5nIHRoZSBWaWV3Q29udGFpbmVyUmVmIGNhc2VcbiAqIEByZXR1cm5zIExDb250YWluZXJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUxDb250YWluZXIoXG4gICAgaG9zdE5hdGl2ZTogUkVsZW1lbnQgfCBSQ29tbWVudCB8IFN0eWxpbmdDb250ZXh0IHwgTFZpZXcsIGN1cnJlbnRWaWV3OiBMVmlldywgbmF0aXZlOiBSQ29tbWVudCxcbiAgICB0Tm9kZTogVE5vZGUsIGlzRm9yVmlld0NvbnRhaW5lclJlZj86IGJvb2xlYW4pOiBMQ29udGFpbmVyIHtcbiAgbmdEZXZNb2RlICYmIGFzc2VydERvbU5vZGUobmF0aXZlKTtcbiAgbmdEZXZNb2RlICYmIGFzc2VydExWaWV3KGN1cnJlbnRWaWV3KTtcbiAgY29uc3QgbENvbnRhaW5lcjogTENvbnRhaW5lciA9IFtcbiAgICBob3N0TmF0aXZlLCAgLy8gaG9zdCBuYXRpdmVcbiAgICB0cnVlLCAgICAgICAgLy8gQm9vbGVhbiBgdHJ1ZWAgaW4gdGhpcyBwb3NpdGlvbiBzaWduaWZpZXMgdGhhdCB0aGlzIGlzIGFuIGBMQ29udGFpbmVyYFxuICAgIGlzRm9yVmlld0NvbnRhaW5lclJlZiA/IC0xIDogMCwgIC8vIGFjdGl2ZSBpbmRleFxuICAgIGN1cnJlbnRWaWV3LCAgICAgICAgICAgICAgICAgICAgIC8vIHBhcmVudFxuICAgIG51bGwsICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5leHRcbiAgICBudWxsLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBxdWVyaWVzXG4gICAgdE5vZGUsICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdF9ob3N0XG4gICAgbmF0aXZlLCAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbmF0aXZlXG4gICAgW10sICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdmlld3NcbiAgXTtcbiAgbmdEZXZNb2RlICYmIGF0dGFjaExDb250YWluZXJEZWJ1ZyhsQ29udGFpbmVyKTtcbiAgcmV0dXJuIGxDb250YWluZXI7XG59XG5cblxuLyoqXG4gKiBHb2VzIG92ZXIgZHluYW1pYyBlbWJlZGRlZCB2aWV3cyAob25lcyBjcmVhdGVkIHRocm91Z2ggVmlld0NvbnRhaW5lclJlZiBBUElzKSBhbmQgcmVmcmVzaGVzIHRoZW1cbiAqIGJ5IGV4ZWN1dGluZyBhbiBhc3NvY2lhdGVkIHRlbXBsYXRlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiByZWZyZXNoRHluYW1pY0VtYmVkZGVkVmlld3MobFZpZXc6IExWaWV3KSB7XG4gIGZvciAobGV0IGN1cnJlbnQgPSBsVmlld1tDSElMRF9IRUFEXTsgY3VycmVudCAhPT0gbnVsbDsgY3VycmVudCA9IGN1cnJlbnRbTkVYVF0pIHtcbiAgICAvLyBOb3RlOiBjdXJyZW50IGNhbiBiZSBhbiBMVmlldyBvciBhbiBMQ29udGFpbmVyIGluc3RhbmNlLCBidXQgaGVyZSB3ZSBhcmUgb25seSBpbnRlcmVzdGVkXG4gICAgLy8gaW4gTENvbnRhaW5lci4gV2UgY2FuIHRlbGwgaXQncyBhbiBMQ29udGFpbmVyIGJlY2F1c2UgaXRzIGxlbmd0aCBpcyBsZXNzIHRoYW4gdGhlIExWaWV3XG4gICAgLy8gaGVhZGVyLlxuICAgIGlmIChjdXJyZW50Lmxlbmd0aCA8IEhFQURFUl9PRkZTRVQgJiYgY3VycmVudFtBQ1RJVkVfSU5ERVhdID09PSAtMSkge1xuICAgICAgY29uc3QgY29udGFpbmVyID0gY3VycmVudCBhcyBMQ29udGFpbmVyO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb250YWluZXJbVklFV1NdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGR5bmFtaWNWaWV3RGF0YSA9IGNvbnRhaW5lcltWSUVXU11baV07XG4gICAgICAgIC8vIFRoZSBkaXJlY3RpdmVzIGFuZCBwaXBlcyBhcmUgbm90IG5lZWRlZCBoZXJlIGFzIGFuIGV4aXN0aW5nIHZpZXcgaXMgb25seSBiZWluZyByZWZyZXNoZWQuXG4gICAgICAgIG5nRGV2TW9kZSAmJiBhc3NlcnREZWZpbmVkKGR5bmFtaWNWaWV3RGF0YVtUVklFV10sICdUVmlldyBtdXN0IGJlIGFsbG9jYXRlZCcpO1xuICAgICAgICByZW5kZXJFbWJlZGRlZFRlbXBsYXRlKGR5bmFtaWNWaWV3RGF0YSwgZHluYW1pY1ZpZXdEYXRhW1RWSUVXXSwgZHluYW1pY1ZpZXdEYXRhW0NPTlRFWFRdICEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5cblxuLy8vLy8vLy8vLy8vL1xuXG4vKipcbiAqIFJlZnJlc2hlcyBjb21wb25lbnRzIGJ5IGVudGVyaW5nIHRoZSBjb21wb25lbnQgdmlldyBhbmQgcHJvY2Vzc2luZyBpdHMgYmluZGluZ3MsIHF1ZXJpZXMsIGV0Yy5cbiAqXG4gKiBAcGFyYW0gYWRqdXN0ZWRFbGVtZW50SW5kZXggIEVsZW1lbnQgaW5kZXggaW4gTFZpZXdbXSAoYWRqdXN0ZWQgZm9yIEhFQURFUl9PRkZTRVQpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21wb25lbnRSZWZyZXNoKGFkanVzdGVkRWxlbWVudEluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgY29uc3QgbFZpZXcgPSBnZXRMVmlldygpO1xuICBuZ0Rldk1vZGUgJiYgYXNzZXJ0RGF0YUluUmFuZ2UobFZpZXcsIGFkanVzdGVkRWxlbWVudEluZGV4KTtcbiAgY29uc3QgaG9zdFZpZXcgPSBnZXRDb21wb25lbnRWaWV3QnlJbmRleChhZGp1c3RlZEVsZW1lbnRJbmRleCwgbFZpZXcpO1xuICBuZ0Rldk1vZGUgJiYgYXNzZXJ0Tm9kZVR5cGUobFZpZXdbVFZJRVddLmRhdGFbYWRqdXN0ZWRFbGVtZW50SW5kZXhdIGFzIFROb2RlLCBUTm9kZVR5cGUuRWxlbWVudCk7XG5cbiAgLy8gT25seSBjb21wb25lbnRzIGluIGNyZWF0aW9uIG1vZGUsIGF0dGFjaGVkIENoZWNrQWx3YXlzXG4gIC8vIGNvbXBvbmVudHMgb3IgYXR0YWNoZWQsIGRpcnR5IE9uUHVzaCBjb21wb25lbnRzIHNob3VsZCBiZSBjaGVja2VkXG4gIGlmICgodmlld0F0dGFjaGVkVG9DaGFuZ2VEZXRlY3Rvcihob3N0VmlldykgfHwgaXNDcmVhdGlvbk1vZGUobFZpZXcpKSAmJlxuICAgICAgaG9zdFZpZXdbRkxBR1NdICYgKExWaWV3RmxhZ3MuQ2hlY2tBbHdheXMgfCBMVmlld0ZsYWdzLkRpcnR5KSkge1xuICAgIHN5bmNWaWV3V2l0aEJsdWVwcmludChob3N0Vmlldyk7XG4gICAgY2hlY2tWaWV3KGhvc3RWaWV3LCBob3N0Vmlld1tDT05URVhUXSk7XG4gIH1cbn1cblxuLyoqXG4gKiBTeW5jcyBhbiBMVmlldyBpbnN0YW5jZSB3aXRoIGl0cyBibHVlcHJpbnQgaWYgdGhleSBoYXZlIGdvdHRlbiBvdXQgb2Ygc3luYy5cbiAqXG4gKiBUeXBpY2FsbHksIGJsdWVwcmludHMgYW5kIHRoZWlyIHZpZXcgaW5zdGFuY2VzIHNob3VsZCBhbHdheXMgYmUgaW4gc3luYywgc28gdGhlIGxvb3AgaGVyZVxuICogd2lsbCBiZSBza2lwcGVkLiBIb3dldmVyLCBjb25zaWRlciB0aGlzIGNhc2Ugb2YgdHdvIGNvbXBvbmVudHMgc2lkZS1ieS1zaWRlOlxuICpcbiAqIEFwcCB0ZW1wbGF0ZTpcbiAqIGBgYFxuICogPGNvbXA+PC9jb21wPlxuICogPGNvbXA+PC9jb21wPlxuICogYGBgXG4gKlxuICogVGhlIGZvbGxvd2luZyB3aWxsIGhhcHBlbjpcbiAqIDEuIEFwcCB0ZW1wbGF0ZSBiZWdpbnMgcHJvY2Vzc2luZy5cbiAqIDIuIEZpcnN0IDxjb21wPiBpcyBtYXRjaGVkIGFzIGEgY29tcG9uZW50IGFuZCBpdHMgTFZpZXcgaXMgY3JlYXRlZC5cbiAqIDMuIFNlY29uZCA8Y29tcD4gaXMgbWF0Y2hlZCBhcyBhIGNvbXBvbmVudCBhbmQgaXRzIExWaWV3IGlzIGNyZWF0ZWQuXG4gKiA0LiBBcHAgdGVtcGxhdGUgY29tcGxldGVzIHByb2Nlc3NpbmcsIHNvIGl0J3MgdGltZSB0byBjaGVjayBjaGlsZCB0ZW1wbGF0ZXMuXG4gKiA1LiBGaXJzdCA8Y29tcD4gdGVtcGxhdGUgaXMgY2hlY2tlZC4gSXQgaGFzIGEgZGlyZWN0aXZlLCBzbyBpdHMgZGVmIGlzIHB1c2hlZCB0byBibHVlcHJpbnQuXG4gKiA2LiBTZWNvbmQgPGNvbXA+IHRlbXBsYXRlIGlzIGNoZWNrZWQuIEl0cyBibHVlcHJpbnQgaGFzIGJlZW4gdXBkYXRlZCBieSB0aGUgZmlyc3RcbiAqIDxjb21wPiB0ZW1wbGF0ZSwgYnV0IGl0cyBMVmlldyB3YXMgY3JlYXRlZCBiZWZvcmUgdGhpcyB1cGRhdGUsIHNvIGl0IGlzIG91dCBvZiBzeW5jLlxuICpcbiAqIE5vdGUgdGhhdCBlbWJlZGRlZCB2aWV3cyBpbnNpZGUgbmdGb3IgbG9vcHMgd2lsbCBuZXZlciBiZSBvdXQgb2Ygc3luYyBiZWNhdXNlIHRoZXNlIHZpZXdzXG4gKiBhcmUgcHJvY2Vzc2VkIGFzIHNvb24gYXMgdGhleSBhcmUgY3JlYXRlZC5cbiAqXG4gKiBAcGFyYW0gY29tcG9uZW50VmlldyBUaGUgdmlldyB0byBzeW5jXG4gKi9cbmZ1bmN0aW9uIHN5bmNWaWV3V2l0aEJsdWVwcmludChjb21wb25lbnRWaWV3OiBMVmlldykge1xuICBjb25zdCBjb21wb25lbnRUVmlldyA9IGNvbXBvbmVudFZpZXdbVFZJRVddO1xuICBmb3IgKGxldCBpID0gY29tcG9uZW50Vmlldy5sZW5ndGg7IGkgPCBjb21wb25lbnRUVmlldy5ibHVlcHJpbnQubGVuZ3RoOyBpKyspIHtcbiAgICBjb21wb25lbnRWaWV3W2ldID0gY29tcG9uZW50VFZpZXcuYmx1ZXByaW50W2ldO1xuICB9XG59XG5cbi8qKlxuICogQWRkcyBMVmlldyBvciBMQ29udGFpbmVyIHRvIHRoZSBlbmQgb2YgdGhlIGN1cnJlbnQgdmlldyB0cmVlLlxuICpcbiAqIFRoaXMgc3RydWN0dXJlIHdpbGwgYmUgdXNlZCB0byB0cmF2ZXJzZSB0aHJvdWdoIG5lc3RlZCB2aWV3cyB0byByZW1vdmUgbGlzdGVuZXJzXG4gKiBhbmQgY2FsbCBvbkRlc3Ryb3kgY2FsbGJhY2tzLlxuICpcbiAqIEBwYXJhbSBsVmlldyBUaGUgdmlldyB3aGVyZSBMVmlldyBvciBMQ29udGFpbmVyIHNob3VsZCBiZSBhZGRlZFxuICogQHBhcmFtIGFkanVzdGVkSG9zdEluZGV4IEluZGV4IG9mIHRoZSB2aWV3J3MgaG9zdCBub2RlIGluIExWaWV3W10sIGFkanVzdGVkIGZvciBoZWFkZXJcbiAqIEBwYXJhbSBsVmlld09yTENvbnRhaW5lciBUaGUgTFZpZXcgb3IgTENvbnRhaW5lciB0byBhZGQgdG8gdGhlIHZpZXcgdHJlZVxuICogQHJldHVybnMgVGhlIHN0YXRlIHBhc3NlZCBpblxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkVG9WaWV3VHJlZTxUIGV4dGVuZHMgTFZpZXd8TENvbnRhaW5lcj4obFZpZXc6IExWaWV3LCBsVmlld09yTENvbnRhaW5lcjogVCk6IFQge1xuICAvLyBUT0RPKGJlbmxlc2gvbWlza28pOiBUaGlzIGltcGxlbWVudGF0aW9uIGlzIGluY29ycmVjdCwgYmVjYXVzZSBpdCBhbHdheXMgYWRkcyB0aGUgTENvbnRhaW5lciB0b1xuICAvLyB0aGUgZW5kIG9mIHRoZSBxdWV1ZSwgd2hpY2ggbWVhbnMgaWYgdGhlIGRldmVsb3BlciByZXRyaWV2ZXMgdGhlIExDb250YWluZXJzIGZyb20gUk5vZGVzIG91dCBvZlxuICAvLyBvcmRlciwgdGhlIGNoYW5nZSBkZXRlY3Rpb24gd2lsbCBydW4gb3V0IG9mIG9yZGVyLCBhcyB0aGUgYWN0IG9mIHJldHJpZXZpbmcgdGhlIHRoZSBMQ29udGFpbmVyXG4gIC8vIGZyb20gdGhlIFJOb2RlIGlzIHdoYXQgYWRkcyBpdCB0byB0aGUgcXVldWUuXG4gIGlmIChsVmlld1tDSElMRF9IRUFEXSkge1xuICAgIGxWaWV3W0NISUxEX1RBSUxdICFbTkVYVF0gPSBsVmlld09yTENvbnRhaW5lcjtcbiAgfSBlbHNlIHtcbiAgICBsVmlld1tDSElMRF9IRUFEXSA9IGxWaWV3T3JMQ29udGFpbmVyO1xuICB9XG4gIGxWaWV3W0NISUxEX1RBSUxdID0gbFZpZXdPckxDb250YWluZXI7XG4gIHJldHVybiBsVmlld09yTENvbnRhaW5lcjtcbn1cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8vLyBDaGFuZ2UgZGV0ZWN0aW9uXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblxuLyoqXG4gKiBNYXJrcyBjdXJyZW50IHZpZXcgYW5kIGFsbCBhbmNlc3RvcnMgZGlydHkuXG4gKlxuICogUmV0dXJucyB0aGUgcm9vdCB2aWV3IGJlY2F1c2UgaXQgaXMgZm91bmQgYXMgYSBieXByb2R1Y3Qgb2YgbWFya2luZyB0aGUgdmlldyB0cmVlXG4gKiBkaXJ0eSwgYW5kIGNhbiBiZSB1c2VkIGJ5IG1ldGhvZHMgdGhhdCBjb25zdW1lIG1hcmtWaWV3RGlydHkoKSB0byBlYXNpbHkgc2NoZWR1bGVcbiAqIGNoYW5nZSBkZXRlY3Rpb24uIE90aGVyd2lzZSwgc3VjaCBtZXRob2RzIHdvdWxkIG5lZWQgdG8gdHJhdmVyc2UgdXAgdGhlIHZpZXcgdHJlZVxuICogYW4gYWRkaXRpb25hbCB0aW1lIHRvIGdldCB0aGUgcm9vdCB2aWV3IGFuZCBzY2hlZHVsZSBhIHRpY2sgb24gaXQuXG4gKlxuICogQHBhcmFtIGxWaWV3IFRoZSBzdGFydGluZyBMVmlldyB0byBtYXJrIGRpcnR5XG4gKiBAcmV0dXJucyB0aGUgcm9vdCBMVmlld1xuICovXG5leHBvcnQgZnVuY3Rpb24gbWFya1ZpZXdEaXJ0eShsVmlldzogTFZpZXcpOiBMVmlld3xudWxsIHtcbiAgd2hpbGUgKGxWaWV3KSB7XG4gICAgbFZpZXdbRkxBR1NdIHw9IExWaWV3RmxhZ3MuRGlydHk7XG4gICAgY29uc3QgcGFyZW50ID0gZ2V0TFZpZXdQYXJlbnQobFZpZXcpO1xuICAgIC8vIFN0b3AgdHJhdmVyc2luZyB1cCBhcyBzb29uIGFzIHlvdSBmaW5kIGEgcm9vdCB2aWV3IHRoYXQgd2Fzbid0IGF0dGFjaGVkIHRvIGFueSBjb250YWluZXJcbiAgICBpZiAoaXNSb290VmlldyhsVmlldykgJiYgIXBhcmVudCkge1xuICAgICAgcmV0dXJuIGxWaWV3O1xuICAgIH1cbiAgICAvLyBjb250aW51ZSBvdGhlcndpc2VcbiAgICBsVmlldyA9IHBhcmVudCAhO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG5cbi8qKlxuICogVXNlZCB0byBzY2hlZHVsZSBjaGFuZ2UgZGV0ZWN0aW9uIG9uIHRoZSB3aG9sZSBhcHBsaWNhdGlvbi5cbiAqXG4gKiBVbmxpa2UgYHRpY2tgLCBgc2NoZWR1bGVUaWNrYCBjb2FsZXNjZXMgbXVsdGlwbGUgY2FsbHMgaW50byBvbmUgY2hhbmdlIGRldGVjdGlvbiBydW4uXG4gKiBJdCBpcyB1c3VhbGx5IGNhbGxlZCBpbmRpcmVjdGx5IGJ5IGNhbGxpbmcgYG1hcmtEaXJ0eWAgd2hlbiB0aGUgdmlldyBuZWVkcyB0byBiZVxuICogcmUtcmVuZGVyZWQuXG4gKlxuICogVHlwaWNhbGx5IGBzY2hlZHVsZVRpY2tgIHVzZXMgYHJlcXVlc3RBbmltYXRpb25GcmFtZWAgdG8gY29hbGVzY2UgbXVsdGlwbGVcbiAqIGBzY2hlZHVsZVRpY2tgIHJlcXVlc3RzLiBUaGUgc2NoZWR1bGluZyBmdW5jdGlvbiBjYW4gYmUgb3ZlcnJpZGRlbiBpblxuICogYHJlbmRlckNvbXBvbmVudGAncyBgc2NoZWR1bGVyYCBvcHRpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzY2hlZHVsZVRpY2socm9vdENvbnRleHQ6IFJvb3RDb250ZXh0LCBmbGFnczogUm9vdENvbnRleHRGbGFncykge1xuICBjb25zdCBub3RoaW5nU2NoZWR1bGVkID0gcm9vdENvbnRleHQuZmxhZ3MgPT09IFJvb3RDb250ZXh0RmxhZ3MuRW1wdHk7XG4gIHJvb3RDb250ZXh0LmZsYWdzIHw9IGZsYWdzO1xuXG4gIGlmIChub3RoaW5nU2NoZWR1bGVkICYmIHJvb3RDb250ZXh0LmNsZWFuID09IF9DTEVBTl9QUk9NSVNFKSB7XG4gICAgbGV0IHJlczogbnVsbHwoKHZhbDogbnVsbCkgPT4gdm9pZCk7XG4gICAgcm9vdENvbnRleHQuY2xlYW4gPSBuZXcgUHJvbWlzZTxudWxsPigocikgPT4gcmVzID0gcik7XG4gICAgcm9vdENvbnRleHQuc2NoZWR1bGVyKCgpID0+IHtcbiAgICAgIGlmIChyb290Q29udGV4dC5mbGFncyAmIFJvb3RDb250ZXh0RmxhZ3MuRGV0ZWN0Q2hhbmdlcykge1xuICAgICAgICByb290Q29udGV4dC5mbGFncyAmPSB+Um9vdENvbnRleHRGbGFncy5EZXRlY3RDaGFuZ2VzO1xuICAgICAgICB0aWNrUm9vdENvbnRleHQocm9vdENvbnRleHQpO1xuICAgICAgfVxuXG4gICAgICBpZiAocm9vdENvbnRleHQuZmxhZ3MgJiBSb290Q29udGV4dEZsYWdzLkZsdXNoUGxheWVycykge1xuICAgICAgICByb290Q29udGV4dC5mbGFncyAmPSB+Um9vdENvbnRleHRGbGFncy5GbHVzaFBsYXllcnM7XG4gICAgICAgIGNvbnN0IHBsYXllckhhbmRsZXIgPSByb290Q29udGV4dC5wbGF5ZXJIYW5kbGVyO1xuICAgICAgICBpZiAocGxheWVySGFuZGxlcikge1xuICAgICAgICAgIHBsYXllckhhbmRsZXIuZmx1c2hQbGF5ZXJzKCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcm9vdENvbnRleHQuY2xlYW4gPSBfQ0xFQU5fUFJPTUlTRTtcbiAgICAgIHJlcyAhKG51bGwpO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0aWNrUm9vdENvbnRleHQocm9vdENvbnRleHQ6IFJvb3RDb250ZXh0KSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcm9vdENvbnRleHQuY29tcG9uZW50cy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHJvb3RDb21wb25lbnQgPSByb290Q29udGV4dC5jb21wb25lbnRzW2ldO1xuICAgIHJlbmRlckNvbXBvbmVudE9yVGVtcGxhdGUocmVhZFBhdGNoZWRMVmlldyhyb290Q29tcG9uZW50KSAhLCByb290Q29tcG9uZW50KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGV0ZWN0Q2hhbmdlc0ludGVybmFsPFQ+KHZpZXc6IExWaWV3LCBjb250ZXh0OiBUKSB7XG4gIGNvbnN0IHJlbmRlcmVyRmFjdG9yeSA9IHZpZXdbUkVOREVSRVJfRkFDVE9SWV07XG5cbiAgaWYgKHJlbmRlcmVyRmFjdG9yeS5iZWdpbikgcmVuZGVyZXJGYWN0b3J5LmJlZ2luKCk7XG5cbiAgdHJ5IHtcbiAgICBpZiAoaXNDcmVhdGlvbk1vZGUodmlldykpIHtcbiAgICAgIGNoZWNrVmlldyh2aWV3LCBjb250ZXh0KTsgIC8vIGNyZWF0aW9uIG1vZGUgcGFzc1xuICAgIH1cbiAgICBjaGVja1ZpZXcodmlldywgY29udGV4dCk7ICAvLyB1cGRhdGUgbW9kZSBwYXNzXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgaGFuZGxlRXJyb3IodmlldywgZXJyb3IpO1xuICAgIHRocm93IGVycm9yO1xuICB9IGZpbmFsbHkge1xuICAgIGlmIChyZW5kZXJlckZhY3RvcnkuZW5kKSByZW5kZXJlckZhY3RvcnkuZW5kKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBTeW5jaHJvbm91c2x5IHBlcmZvcm0gY2hhbmdlIGRldGVjdGlvbiBvbiBhIHJvb3QgdmlldyBhbmQgaXRzIGNvbXBvbmVudHMuXG4gKlxuICogQHBhcmFtIGxWaWV3IFRoZSB2aWV3IHdoaWNoIHRoZSBjaGFuZ2UgZGV0ZWN0aW9uIHNob3VsZCBiZSBwZXJmb3JtZWQgb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXRlY3RDaGFuZ2VzSW5Sb290VmlldyhsVmlldzogTFZpZXcpOiB2b2lkIHtcbiAgdGlja1Jvb3RDb250ZXh0KGxWaWV3W0NPTlRFWFRdIGFzIFJvb3RDb250ZXh0KTtcbn1cblxuXG4vKipcbiAqIENoZWNrcyB0aGUgY2hhbmdlIGRldGVjdG9yIGFuZCBpdHMgY2hpbGRyZW4sIGFuZCB0aHJvd3MgaWYgYW55IGNoYW5nZXMgYXJlIGRldGVjdGVkLlxuICpcbiAqIFRoaXMgaXMgdXNlZCBpbiBkZXZlbG9wbWVudCBtb2RlIHRvIHZlcmlmeSB0aGF0IHJ1bm5pbmcgY2hhbmdlIGRldGVjdGlvbiBkb2Vzbid0XG4gKiBpbnRyb2R1Y2Ugb3RoZXIgY2hhbmdlcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrTm9DaGFuZ2VzPFQ+KGNvbXBvbmVudDogVCk6IHZvaWQge1xuICBjb25zdCB2aWV3ID0gZ2V0Q29tcG9uZW50Vmlld0J5SW5zdGFuY2UoY29tcG9uZW50KTtcbiAgY2hlY2tOb0NoYW5nZXNJbnRlcm5hbDxUPih2aWV3LCBjb21wb25lbnQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tOb0NoYW5nZXNJbnRlcm5hbDxUPih2aWV3OiBMVmlldywgY29udGV4dDogVCkge1xuICBzZXRDaGVja05vQ2hhbmdlc01vZGUodHJ1ZSk7XG4gIHRyeSB7XG4gICAgZGV0ZWN0Q2hhbmdlc0ludGVybmFsKHZpZXcsIGNvbnRleHQpO1xuICB9IGZpbmFsbHkge1xuICAgIHNldENoZWNrTm9DaGFuZ2VzTW9kZShmYWxzZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDaGVja3MgdGhlIGNoYW5nZSBkZXRlY3RvciBvbiBhIHJvb3QgdmlldyBhbmQgaXRzIGNvbXBvbmVudHMsIGFuZCB0aHJvd3MgaWYgYW55IGNoYW5nZXMgYXJlXG4gKiBkZXRlY3RlZC5cbiAqXG4gKiBUaGlzIGlzIHVzZWQgaW4gZGV2ZWxvcG1lbnQgbW9kZSB0byB2ZXJpZnkgdGhhdCBydW5uaW5nIGNoYW5nZSBkZXRlY3Rpb24gZG9lc24ndFxuICogaW50cm9kdWNlIG90aGVyIGNoYW5nZXMuXG4gKlxuICogQHBhcmFtIGxWaWV3IFRoZSB2aWV3IHdoaWNoIHRoZSBjaGFuZ2UgZGV0ZWN0aW9uIHNob3VsZCBiZSBjaGVja2VkIG9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tOb0NoYW5nZXNJblJvb3RWaWV3KGxWaWV3OiBMVmlldyk6IHZvaWQge1xuICBzZXRDaGVja05vQ2hhbmdlc01vZGUodHJ1ZSk7XG4gIHRyeSB7XG4gICAgZGV0ZWN0Q2hhbmdlc0luUm9vdFZpZXcobFZpZXcpO1xuICB9IGZpbmFsbHkge1xuICAgIHNldENoZWNrTm9DaGFuZ2VzTW9kZShmYWxzZSk7XG4gIH1cbn1cblxuLyoqIENoZWNrcyB0aGUgdmlldyBvZiB0aGUgY29tcG9uZW50IHByb3ZpZGVkLiBEb2VzIG5vdCBnYXRlIG9uIGRpcnR5IGNoZWNrcyBvciBleGVjdXRlIGRvQ2hlY2suICovXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tWaWV3PFQ+KGhvc3RWaWV3OiBMVmlldywgY29tcG9uZW50OiBUKSB7XG4gIGNvbnN0IGhvc3RUVmlldyA9IGhvc3RWaWV3W1RWSUVXXTtcbiAgY29uc3Qgb2xkVmlldyA9IGVudGVyVmlldyhob3N0VmlldywgaG9zdFZpZXdbVF9IT1NUXSk7XG4gIGNvbnN0IHRlbXBsYXRlRm4gPSBob3N0VFZpZXcudGVtcGxhdGUgITtcbiAgY29uc3QgY3JlYXRpb25Nb2RlID0gaXNDcmVhdGlvbk1vZGUoaG9zdFZpZXcpO1xuXG4gIHRyeSB7XG4gICAgcmVzZXRQcmVPcmRlckhvb2tGbGFncyhob3N0Vmlldyk7XG4gICAgY3JlYXRpb25Nb2RlICYmIGV4ZWN1dGVWaWV3UXVlcnlGbihSZW5kZXJGbGFncy5DcmVhdGUsIGhvc3RUVmlldywgY29tcG9uZW50KTtcbiAgICBleGVjdXRlVGVtcGxhdGUodGVtcGxhdGVGbiwgZ2V0UmVuZGVyRmxhZ3MoaG9zdFZpZXcpLCBjb21wb25lbnQpO1xuICAgIHJlZnJlc2hEZXNjZW5kYW50Vmlld3MoaG9zdFZpZXcpO1xuICAgIC8vIE9ubHkgY2hlY2sgdmlldyBxdWVyaWVzIGFnYWluIGluIGNyZWF0aW9uIG1vZGUgaWYgdGhlcmUgYXJlIHN0YXRpYyB2aWV3IHF1ZXJpZXNcbiAgICBpZiAoIWNyZWF0aW9uTW9kZSB8fCBob3N0VFZpZXcuc3RhdGljVmlld1F1ZXJpZXMpIHtcbiAgICAgIGV4ZWN1dGVWaWV3UXVlcnlGbihSZW5kZXJGbGFncy5VcGRhdGUsIGhvc3RUVmlldywgY29tcG9uZW50KTtcbiAgICB9XG4gIH0gZmluYWxseSB7XG4gICAgbGVhdmVWaWV3KG9sZFZpZXcpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGV4ZWN1dGVWaWV3UXVlcnlGbjxUPihmbGFnczogUmVuZGVyRmxhZ3MsIHRWaWV3OiBUVmlldywgY29tcG9uZW50OiBUKTogdm9pZCB7XG4gIGNvbnN0IHZpZXdRdWVyeSA9IHRWaWV3LnZpZXdRdWVyeTtcbiAgaWYgKHZpZXdRdWVyeSkge1xuICAgIHNldEN1cnJlbnRRdWVyeUluZGV4KHRWaWV3LnZpZXdRdWVyeVN0YXJ0SW5kZXgpO1xuICAgIHZpZXdRdWVyeShmbGFncywgY29tcG9uZW50KTtcbiAgfVxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8gQmluZGluZ3MgJiBpbnRlcnBvbGF0aW9uc1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4vKipcbiAqIENyZWF0ZXMgYmluZGluZyBtZXRhZGF0YSBmb3IgYSBwYXJ0aWN1bGFyIGJpbmRpbmcgYW5kIHN0b3JlcyBpdCBpblxuICogVFZpZXcuZGF0YS4gVGhlc2UgYXJlIGdlbmVyYXRlZCBpbiBvcmRlciB0byBzdXBwb3J0IERlYnVnRWxlbWVudC5wcm9wZXJ0aWVzLlxuICpcbiAqIEVhY2ggYmluZGluZyAvIGludGVycG9sYXRpb24gd2lsbCBoYXZlIG9uZSAoaW5jbHVkaW5nIGF0dHJpYnV0ZSBiaW5kaW5ncylcbiAqIGJlY2F1c2UgYXQgdGhlIHRpbWUgb2YgYmluZGluZywgd2UgZG9uJ3Qga25vdyB0byB3aGljaCBpbnN0cnVjdGlvbiB0aGUgYmluZGluZ1xuICogYmVsb25ncy4gSXQgaXMgYWx3YXlzIHN0b3JlZCBpbiBUVmlldy5kYXRhIGF0IHRoZSBpbmRleCBvZiB0aGUgbGFzdCBiaW5kaW5nXG4gKiB2YWx1ZSBpbiBMVmlldyAoZS5nLiBmb3IgaW50ZXJwb2xhdGlvbjgsIGl0IHdvdWxkIGJlIHN0b3JlZCBhdCB0aGUgaW5kZXggb2ZcbiAqIHRoZSA4dGggdmFsdWUpLlxuICpcbiAqIEBwYXJhbSBsVmlldyBUaGUgTFZpZXcgdGhhdCBjb250YWlucyB0aGUgY3VycmVudCBiaW5kaW5nIGluZGV4LlxuICogQHBhcmFtIHByZWZpeCBUaGUgc3RhdGljIHByZWZpeCBzdHJpbmdcbiAqIEBwYXJhbSBzdWZmaXggVGhlIHN0YXRpYyBzdWZmaXggc3RyaW5nXG4gKlxuICogQHJldHVybnMgTmV3bHkgY3JlYXRlZCBiaW5kaW5nIG1ldGFkYXRhIHN0cmluZyBmb3IgdGhpcyBiaW5kaW5nIG9yIG51bGxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0b3JlQmluZGluZ01ldGFkYXRhKGxWaWV3OiBMVmlldywgcHJlZml4ID0gJycsIHN1ZmZpeCA9ICcnKTogc3RyaW5nfG51bGwge1xuICBjb25zdCB0RGF0YSA9IGxWaWV3W1RWSUVXXS5kYXRhO1xuICBjb25zdCBsYXN0QmluZGluZ0luZGV4ID0gbFZpZXdbQklORElOR19JTkRFWF0gLSAxO1xuICBjb25zdCB2YWx1ZSA9IElOVEVSUE9MQVRJT05fREVMSU1JVEVSICsgcHJlZml4ICsgSU5URVJQT0xBVElPTl9ERUxJTUlURVIgKyBzdWZmaXg7XG5cbiAgcmV0dXJuIHREYXRhW2xhc3RCaW5kaW5nSW5kZXhdID09IG51bGwgPyAodERhdGFbbGFzdEJpbmRpbmdJbmRleF0gPSB2YWx1ZSkgOiBudWxsO1xufVxuXG5leHBvcnQgY29uc3QgQ0xFQU5fUFJPTUlTRSA9IF9DTEVBTl9QUk9NSVNFO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZVROb2RlSW5wdXRzKHROb2RlOiBUTm9kZSB8IG51bGwpOiBQcm9wZXJ0eUFsaWFzZXN8bnVsbCB7XG4gIC8vIElmIHROb2RlLmlucHV0cyBpcyB1bmRlZmluZWQsIGEgbGlzdGVuZXIgaGFzIGNyZWF0ZWQgb3V0cHV0cywgYnV0IGlucHV0cyBoYXZlbid0XG4gIC8vIHlldCBiZWVuIGNoZWNrZWQuXG4gIGlmICh0Tm9kZSkge1xuICAgIGlmICh0Tm9kZS5pbnB1dHMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gbWFyayBpbnB1dHMgYXMgY2hlY2tlZFxuICAgICAgdE5vZGUuaW5wdXRzID0gZ2VuZXJhdGVQcm9wZXJ0eUFsaWFzZXModE5vZGUsIEJpbmRpbmdEaXJlY3Rpb24uSW5wdXQpO1xuICAgIH1cbiAgICByZXR1cm4gdE5vZGUuaW5wdXRzO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDbGVhbnVwKHZpZXc6IExWaWV3KTogYW55W10ge1xuICAvLyB0b3AgbGV2ZWwgdmFyaWFibGVzIHNob3VsZCBub3QgYmUgZXhwb3J0ZWQgZm9yIHBlcmZvcm1hbmNlIHJlYXNvbnMgKFBFUkZfTk9URVMubWQpXG4gIHJldHVybiB2aWV3W0NMRUFOVVBdIHx8ICh2aWV3W0NMRUFOVVBdID0gW10pO1xufVxuXG5mdW5jdGlvbiBnZXRUVmlld0NsZWFudXAodmlldzogTFZpZXcpOiBhbnlbXSB7XG4gIHJldHVybiB2aWV3W1RWSUVXXS5jbGVhbnVwIHx8ICh2aWV3W1RWSUVXXS5jbGVhbnVwID0gW10pO1xufVxuXG4vKipcbiAqIFRoZXJlIGFyZSBjYXNlcyB3aGVyZSB0aGUgc3ViIGNvbXBvbmVudCdzIHJlbmRlcmVyIG5lZWRzIHRvIGJlIGluY2x1ZGVkXG4gKiBpbnN0ZWFkIG9mIHRoZSBjdXJyZW50IHJlbmRlcmVyIChzZWUgdGhlIGNvbXBvbmVudFN5bnRoZXRpY0hvc3QqIGluc3RydWN0aW9ucykuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsb2FkQ29tcG9uZW50UmVuZGVyZXIodE5vZGU6IFROb2RlLCBsVmlldzogTFZpZXcpOiBSZW5kZXJlcjMge1xuICBjb25zdCBjb21wb25lbnRMVmlldyA9IGxWaWV3W3ROb2RlLmluZGV4XSBhcyBMVmlldztcbiAgcmV0dXJuIGNvbXBvbmVudExWaWV3W1JFTkRFUkVSXTtcbn1cblxuLyoqIEhhbmRsZXMgYW4gZXJyb3IgdGhyb3duIGluIGFuIExWaWV3LiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZUVycm9yKGxWaWV3OiBMVmlldywgZXJyb3I6IGFueSk6IHZvaWQge1xuICBjb25zdCBpbmplY3RvciA9IGxWaWV3W0lOSkVDVE9SXTtcbiAgY29uc3QgZXJyb3JIYW5kbGVyID0gaW5qZWN0b3IgPyBpbmplY3Rvci5nZXQoRXJyb3JIYW5kbGVyLCBudWxsKSA6IG51bGw7XG4gIGVycm9ySGFuZGxlciAmJiBlcnJvckhhbmRsZXIuaGFuZGxlRXJyb3IoZXJyb3IpO1xufVxuXG4vKipcbiAqIFNldCB0aGUgaW5wdXRzIG9mIGRpcmVjdGl2ZXMgYXQgdGhlIGN1cnJlbnQgbm9kZSB0byBjb3JyZXNwb25kaW5nIHZhbHVlLlxuICpcbiAqIEBwYXJhbSBsVmlldyB0aGUgYExWaWV3YCB3aGljaCBjb250YWlucyB0aGUgZGlyZWN0aXZlcy5cbiAqIEBwYXJhbSBpbnB1dHMgbWFwcGluZyBiZXR3ZWVuIHRoZSBwdWJsaWMgXCJpbnB1dFwiIG5hbWUgYW5kIHByaXZhdGVseS1rbm93bixcbiAqIHBvc3NpYmx5IG1pbmlmaWVkLCBwcm9wZXJ0eSBuYW1lcyB0byB3cml0ZSB0by5cbiAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSB0byBzZXQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRJbnB1dHNGb3JQcm9wZXJ0eShsVmlldzogTFZpZXcsIGlucHV0czogUHJvcGVydHlBbGlhc1ZhbHVlLCB2YWx1ZTogYW55KTogdm9pZCB7XG4gIGNvbnN0IHRWaWV3ID0gbFZpZXdbVFZJRVddO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGlucHV0cy5sZW5ndGg7KSB7XG4gICAgY29uc3QgaW5kZXggPSBpbnB1dHNbaSsrXSBhcyBudW1iZXI7XG4gICAgY29uc3QgcHVibGljTmFtZSA9IGlucHV0c1tpKytdIGFzIHN0cmluZztcbiAgICBjb25zdCBwcml2YXRlTmFtZSA9IGlucHV0c1tpKytdIGFzIHN0cmluZztcbiAgICBjb25zdCBpbnN0YW5jZSA9IGxWaWV3W2luZGV4XTtcbiAgICBuZ0Rldk1vZGUgJiYgYXNzZXJ0RGF0YUluUmFuZ2UobFZpZXcsIGluZGV4KTtcbiAgICBjb25zdCBkZWYgPSB0Vmlldy5kYXRhW2luZGV4XSBhcyBEaXJlY3RpdmVEZWY8YW55PjtcbiAgICBjb25zdCBzZXRJbnB1dCA9IGRlZi5zZXRJbnB1dDtcbiAgICBpZiAoc2V0SW5wdXQpIHtcbiAgICAgIGRlZi5zZXRJbnB1dCAhKGluc3RhbmNlLCB2YWx1ZSwgcHVibGljTmFtZSwgcHJpdmF0ZU5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbnN0YW5jZVtwcml2YXRlTmFtZV0gPSB2YWx1ZTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==