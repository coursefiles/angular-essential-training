/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// Below are constants for LView indices to help us look up LView members
// without having to remember the specific indices.
// Uglify will inline these when minifying so there shouldn't be a cost.
/** @type {?} */
export const HOST = 0;
/** @type {?} */
export const TVIEW = 1;
/** @type {?} */
export const FLAGS = 2;
/** @type {?} */
export const PARENT = 3;
/** @type {?} */
export const NEXT = 4;
/** @type {?} */
export const QUERIES = 5;
/** @type {?} */
export const T_HOST = 6;
/** @type {?} */
export const BINDING_INDEX = 7;
/** @type {?} */
export const CLEANUP = 8;
/** @type {?} */
export const CONTEXT = 9;
/** @type {?} */
export const INJECTOR = 10;
/** @type {?} */
export const RENDERER_FACTORY = 11;
/** @type {?} */
export const RENDERER = 12;
/** @type {?} */
export const SANITIZER = 13;
/** @type {?} */
export const CHILD_HEAD = 14;
/** @type {?} */
export const CHILD_TAIL = 15;
/** @type {?} */
export const CONTENT_QUERIES = 16;
/** @type {?} */
export const DECLARATION_VIEW = 17;
/** @type {?} */
export const PREORDER_HOOK_FLAGS = 18;
/**
 * Size of LView's header. Necessary to adjust for it when setting slots.
 * @type {?}
 */
export const HEADER_OFFSET = 20;
/**
 * @record
 */
export function OpaqueViewState() { }
if (false) {
    /** @type {?} */
    OpaqueViewState.prototype.__brand__;
}
/**
 * `LView` stores all of the information needed to process the instructions as
 * they are invoked from the template. Each embedded view and component view has its
 * own `LView`. When processing a particular view, we set the `viewData` to that
 * `LView`. When that view is done processing, the `viewData` is set back to
 * whatever the original `viewData` was before (the parent `LView`).
 *
 * Keeping separate state for each view facilities view insertion / deletion, so we
 * don't have to edit the data array based on which views are present.
 * @record
 */
export function LView() { }
if (false) {
    /* Skipping unnamed member:
    [HOST]: RElement|StylingContext|null;*/
    /* Skipping unnamed member:
    readonly[TVIEW]: TView;*/
    /* Skipping unnamed member:
    [FLAGS]: LViewFlags;*/
    /* Skipping unnamed member:
    [PARENT]: LView|LContainer|null;*/
    /* Skipping unnamed member:
    [NEXT]: LView|LContainer|null;*/
    /* Skipping unnamed member:
    [QUERIES]: LQueries|null;*/
    /* Skipping unnamed member:
    [T_HOST]: TViewNode|TElementNode|null;*/
    /* Skipping unnamed member:
    [BINDING_INDEX]: number;*/
    /* Skipping unnamed member:
    [CLEANUP]: any[]|null;*/
    /* Skipping unnamed member:
    [CONTEXT]: {}|RootContext|null;*/
    /* Skipping unnamed member:
    readonly[INJECTOR]: Injector|null;*/
    /* Skipping unnamed member:
    [RENDERER_FACTORY]: RendererFactory3;*/
    /* Skipping unnamed member:
    [RENDERER]: Renderer3;*/
    /* Skipping unnamed member:
    [SANITIZER]: Sanitizer|null;*/
    /* Skipping unnamed member:
    [CHILD_HEAD]: LView|LContainer|null;*/
    /* Skipping unnamed member:
    [CHILD_TAIL]: LView|LContainer|null;*/
    /* Skipping unnamed member:
    [CONTENT_QUERIES]: QueryList<any>[]|null;*/
    /* Skipping unnamed member:
    [DECLARATION_VIEW]: LView|null;*/
    /* Skipping unnamed member:
    [PREORDER_HOOK_FLAGS]: PreOrderHookFlags;*/
}
/** @enum {number} */
const LViewFlags = {
    /** The state of the init phase on the first 2 bits */
    InitPhaseStateIncrementer: 1,
    InitPhaseStateMask: 3,
    /**
     * Whether or not the view is in creationMode.
     *
     * This must be stored in the view rather than using `data` as a marker so that
     * we can properly support embedded views. Otherwise, when exiting a child view
     * back into the parent view, `data` will be defined and `creationMode` will be
     * improperly reported as false.
     */
    CreationMode: 4,
    /**
     * Whether or not this LView instance is on its first processing pass.
     *
     * An LView instance is considered to be on its "first pass" until it
     * has completed one creation mode run and one update mode run. At this
     * time, the flag is turned off.
     */
    FirstLViewPass: 8,
    /** Whether this view has default change detection strategy (checks always) or onPush */
    CheckAlways: 16,
    /**
     * Whether or not manual change detection is turned on for onPush components.
     *
     * This is a special mode that only marks components dirty in two cases:
     * 1) There has been a change to an @Input property
     * 2) `markDirty()` has been called manually by the user
     *
     * Note that in this mode, the firing of events does NOT mark components
     * dirty automatically.
     *
     * Manual mode is turned off by default for backwards compatibility, as events
     * automatically mark OnPush components dirty in View Engine.
     *
     * TODO: Add a public API to ChangeDetectionStrategy to turn this mode on
     */
    ManualOnPush: 32,
    /** Whether or not this view is currently dirty (needing check) */
    Dirty: 64,
    /** Whether or not this view is currently attached to change detection tree. */
    Attached: 128,
    /** Whether or not this view is destroyed. */
    Destroyed: 256,
    /** Whether or not this view is the root view */
    IsRoot: 512,
    /**
     * Index of the current init phase on last 22 bits
     */
    IndexWithinInitPhaseIncrementer: 1024,
    IndexWithinInitPhaseShift: 10,
    IndexWithinInitPhaseReset: 1023,
};
export { LViewFlags };
/** @enum {number} */
const InitPhaseState = {
    OnInitHooksToBeRun: 0,
    AfterContentInitHooksToBeRun: 1,
    AfterViewInitHooksToBeRun: 2,
    InitPhaseCompleted: 3,
};
export { InitPhaseState };
/** @enum {number} */
const PreOrderHookFlags = {
    /** The index of the next pre-order hook to be called in the hooks array, on the first 16
       bits */
    IndexOfTheNextPreOrderHookMaskMask: 65535,
    /**
     * The number of init hooks that have already been called, on the last 16 bits
     */
    NumberOfInitHooksCalledIncrementer: 65536,
    NumberOfInitHooksCalledShift: 16,
    NumberOfInitHooksCalledMask: 4294901760,
};
export { PreOrderHookFlags };
/**
 * Set of instructions used to process host bindings efficiently.
 *
 * See VIEW_DATA.md for more information.
 * @record
 */
export function ExpandoInstructions() { }
/**
 * The static data for an LView (shared between all templates of a
 * given type).
 *
 * Stored on the template function as ngPrivateData.
 * @record
 */
export function TView() { }
if (false) {
    /**
     * ID for inline views to determine whether a view is the same as the previous view
     * in a certain position. If it's not, we know the new view needs to be inserted
     * and the one that exists needs to be removed (e.g. if/else statements)
     *
     * If this is -1, then this is a component view or a dynamically created view.
     * @type {?}
     */
    TView.prototype.id;
    /**
     * This is a blueprint used to generate LView instances for this TView. Copying this
     * blueprint is faster than creating a new LView from scratch.
     * @type {?}
     */
    TView.prototype.blueprint;
    /**
     * The template function used to refresh the view of dynamically created views
     * and components. Will be null for inline views.
     * @type {?}
     */
    TView.prototype.template;
    /**
     * A function containing query-related instructions.
     * @type {?}
     */
    TView.prototype.viewQuery;
    /**
     * Pointer to the `TNode` that represents the root of the view.
     *
     * If this is a `TViewNode` for an `LViewNode`, this is an embedded view of a container.
     * We need this pointer to be able to efficiently find this node when inserting the view
     * into an anchor.
     *
     * If this is a `TElementNode`, this is the view of a root component. It has exactly one
     * root TNode.
     *
     * If this is null, this is the view of a component that is not at root. We do not store
     * the host TNodes for child component views because they can potentially have several
     * different host TNodes, depending on where the component is being used. These host
     * TNodes cannot be shared (due to different indices, etc).
     * @type {?}
     */
    TView.prototype.node;
    /**
     * Whether or not this template has been processed.
     * @type {?}
     */
    TView.prototype.firstTemplatePass;
    /**
     * Static data equivalent of LView.data[]. Contains TNodes, PipeDefInternal or TI18n.
     * @type {?}
     */
    TView.prototype.data;
    /**
     * The binding start index is the index at which the data array
     * starts to store bindings only. Saving this value ensures that we
     * will begin reading bindings at the correct point in the array when
     * we are in update mode.
     * @type {?}
     */
    TView.prototype.bindingStartIndex;
    /**
     * The index where the "expando" section of `LView` begins. The expando
     * section contains injectors, directive instances, and host binding values.
     * Unlike the "consts" and "vars" sections of `LView`, the length of this
     * section cannot be calculated at compile-time because directives are matched
     * at runtime to preserve locality.
     *
     * We store this start index so we know where to start checking host bindings
     * in `setHostBindings`.
     * @type {?}
     */
    TView.prototype.expandoStartIndex;
    /**
     * Whether or not there are any static view queries tracked on this view.
     *
     * We store this so we know whether or not we should do a view query
     * refresh after creation mode to collect static query results.
     * @type {?}
     */
    TView.prototype.staticViewQueries;
    /**
     * Whether or not there are any static content queries tracked on this view.
     *
     * We store this so we know whether or not we should do a content query
     * refresh after creation mode to collect static query results.
     * @type {?}
     */
    TView.prototype.staticContentQueries;
    /**
     * The index where the viewQueries section of `LView` begins. This section contains
     * view queries defined for a component/directive.
     *
     * We store this start index so we know where the list of view queries starts.
     * This is required when we invoke view queries at runtime. We invoke queries one by one and
     * increment query index after each iteration. This information helps us to reset index back to
     * the beginning of view query list before we invoke view queries again.
     * @type {?}
     */
    TView.prototype.viewQueryStartIndex;
    /**
     * A reference to the first child node located in the view.
     * @type {?}
     */
    TView.prototype.firstChild;
    /**
     * Set of instructions used to process host bindings efficiently.
     *
     * See VIEW_DATA.md for more information.
     * @type {?}
     */
    TView.prototype.expandoInstructions;
    /**
     * Full registry of directives and components that may be found in this view.
     *
     * It's necessary to keep a copy of the full def list on the TView so it's possible
     * to render template functions without a host component.
     * @type {?}
     */
    TView.prototype.directiveRegistry;
    /**
     * Full registry of pipes that may be found in this view.
     *
     * The property is either an array of `PipeDefs`s or a function which returns the array of
     * `PipeDefs`s. The function is necessary to be able to support forward declarations.
     *
     * It's necessary to keep a copy of the full def list on the TView so it's possible
     * to render template functions without a host component.
     * @type {?}
     */
    TView.prototype.pipeRegistry;
    /**
     * Array of ngOnInit, ngOnChanges and ngDoCheck hooks that should be executed for this view in
     * creation mode.
     *
     * Even indices: Directive index
     * Odd indices: Hook function
     * @type {?}
     */
    TView.prototype.preOrderHooks;
    /**
     * Array of ngOnChanges and ngDoCheck hooks that should be executed for this view in update mode.
     *
     * Even indices: Directive index
     * Odd indices: Hook function
     * @type {?}
     */
    TView.prototype.preOrderCheckHooks;
    /**
     * Array of ngAfterContentInit and ngAfterContentChecked hooks that should be executed
     * for this view in creation mode.
     *
     * Even indices: Directive index
     * Odd indices: Hook function
     * @type {?}
     */
    TView.prototype.contentHooks;
    /**
     * Array of ngAfterContentChecked hooks that should be executed for this view in update
     * mode.
     *
     * Even indices: Directive index
     * Odd indices: Hook function
     * @type {?}
     */
    TView.prototype.contentCheckHooks;
    /**
     * Array of ngAfterViewInit and ngAfterViewChecked hooks that should be executed for
     * this view in creation mode.
     *
     * Even indices: Directive index
     * Odd indices: Hook function
     * @type {?}
     */
    TView.prototype.viewHooks;
    /**
     * Array of ngAfterViewChecked hooks that should be executed for this view in
     * update mode.
     *
     * Even indices: Directive index
     * Odd indices: Hook function
     * @type {?}
     */
    TView.prototype.viewCheckHooks;
    /**
     * Array of ngOnDestroy hooks that should be executed when this view is destroyed.
     *
     * Even indices: Directive index
     * Odd indices: Hook function
     * @type {?}
     */
    TView.prototype.destroyHooks;
    /**
     * When a view is destroyed, listeners need to be released and outputs need to be
     * unsubscribed. This cleanup array stores both listener data (in chunks of 4)
     * and output data (in chunks of 2) for a particular view. Combining the arrays
     * saves on memory (70 bytes per array) and on a few bytes of code size (for two
     * separate for loops).
     *
     * If it's a native DOM listener or output subscription being stored:
     * 1st index is: event name  `name = tView.cleanup[i+0]`
     * 2nd index is: index of native element or a function that retrieves global target (window,
     *               document or body) reference based on the native element:
     *    `typeof idxOrTargetGetter === 'function'`: global target getter function
     *    `typeof idxOrTargetGetter === 'number'`: index of native element
     *
     * 3rd index is: index of listener function `listener = lView[CLEANUP][tView.cleanup[i+2]]`
     * 4th index is: `useCaptureOrIndx = tView.cleanup[i+3]`
     *    `typeof useCaptureOrIndx == 'boolean' : useCapture boolean
     *    `typeof useCaptureOrIndx == 'number':
     *         `useCaptureOrIndx >= 0` `removeListener = LView[CLEANUP][useCaptureOrIndx]`
     *         `useCaptureOrIndx <  0` `subscription = LView[CLEANUP][-useCaptureOrIndx]`
     *
     * If it's an output subscription or query list destroy hook:
     * 1st index is: output unsubscribe function / query list destroy function
     * 2nd index is: index of function context in LView.cleanupInstances[]
     *               `tView.cleanup[i+0].call(lView[CLEANUP][tView.cleanup[i+1]])`
     * @type {?}
     */
    TView.prototype.cleanup;
    /**
     * A list of element indices for child components that will need to be
     * refreshed when the current view has finished its check. These indices have
     * already been adjusted for the HEADER_OFFSET.
     *
     * @type {?}
     */
    TView.prototype.components;
    /**
     * A list of indices for child directives that have content queries.
     * @type {?}
     */
    TView.prototype.contentQueries;
    /**
     * Set of schemas that declare elements to be allowed inside the view.
     * @type {?}
     */
    TView.prototype.schemas;
}
/** @enum {number} */
const RootContextFlags = {
    Empty: 0, DetectChanges: 1, FlushPlayers: 2,
};
export { RootContextFlags };
/**
 * RootContext contains information which is shared for all components which
 * were bootstrapped with {\@link renderComponent}.
 * @record
 */
export function RootContext() { }
if (false) {
    /**
     * A function used for scheduling change detection in the future. Usually
     * this is `requestAnimationFrame`.
     * @type {?}
     */
    RootContext.prototype.scheduler;
    /**
     * A promise which is resolved when all components are considered clean (not dirty).
     *
     * This promise is overwritten every time a first call to {\@link markDirty} is invoked.
     * @type {?}
     */
    RootContext.prototype.clean;
    /**
     * RootComponents - The components that were instantiated by the call to
     * {\@link renderComponent}.
     * @type {?}
     */
    RootContext.prototype.components;
    /**
     * The player flushing handler to kick off all animations
     * @type {?}
     */
    RootContext.prototype.playerHandler;
    /**
     * What render-related operations to run once a scheduler has been set
     * @type {?}
     */
    RootContext.prototype.flags;
}
// Note: This hack is necessary so we don't erroneously get a circular dependency
// failure based on types.
/** @type {?} */
export const unusedValueExportToPlacateAjd = 1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3JlbmRlcjMvaW50ZXJmYWNlcy92aWV3LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQTZCQSxNQUFNLE9BQU8sSUFBSSxHQUFHLENBQUM7O0FBQ3JCLE1BQU0sT0FBTyxLQUFLLEdBQUcsQ0FBQzs7QUFDdEIsTUFBTSxPQUFPLEtBQUssR0FBRyxDQUFDOztBQUN0QixNQUFNLE9BQU8sTUFBTSxHQUFHLENBQUM7O0FBQ3ZCLE1BQU0sT0FBTyxJQUFJLEdBQUcsQ0FBQzs7QUFDckIsTUFBTSxPQUFPLE9BQU8sR0FBRyxDQUFDOztBQUN4QixNQUFNLE9BQU8sTUFBTSxHQUFHLENBQUM7O0FBQ3ZCLE1BQU0sT0FBTyxhQUFhLEdBQUcsQ0FBQzs7QUFDOUIsTUFBTSxPQUFPLE9BQU8sR0FBRyxDQUFDOztBQUN4QixNQUFNLE9BQU8sT0FBTyxHQUFHLENBQUM7O0FBQ3hCLE1BQU0sT0FBTyxRQUFRLEdBQUcsRUFBRTs7QUFDMUIsTUFBTSxPQUFPLGdCQUFnQixHQUFHLEVBQUU7O0FBQ2xDLE1BQU0sT0FBTyxRQUFRLEdBQUcsRUFBRTs7QUFDMUIsTUFBTSxPQUFPLFNBQVMsR0FBRyxFQUFFOztBQUMzQixNQUFNLE9BQU8sVUFBVSxHQUFHLEVBQUU7O0FBQzVCLE1BQU0sT0FBTyxVQUFVLEdBQUcsRUFBRTs7QUFDNUIsTUFBTSxPQUFPLGVBQWUsR0FBRyxFQUFFOztBQUNqQyxNQUFNLE9BQU8sZ0JBQWdCLEdBQUcsRUFBRTs7QUFDbEMsTUFBTSxPQUFPLG1CQUFtQixHQUFHLEVBQUU7Ozs7O0FBRXJDLE1BQU0sT0FBTyxhQUFhLEdBQUcsRUFBRTs7OztBQU0vQixxQ0FFQzs7O0lBREMsb0NBQWlFOzs7Ozs7Ozs7Ozs7O0FBY25FLDJCQXlKQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUlDLHNEQUFzRDtJQUN0RCw0QkFBeUM7SUFDekMscUJBQWtDO0lBRWxDOzs7Ozs7O09BT0c7SUFDSCxlQUE0QjtJQUU1Qjs7Ozs7O09BTUc7SUFDSCxpQkFBOEI7SUFFOUIsd0ZBQXdGO0lBQ3hGLGVBQTJCO0lBRTNCOzs7Ozs7Ozs7Ozs7OztPQWNHO0lBQ0gsZ0JBQTRCO0lBRTVCLGtFQUFrRTtJQUNsRSxTQUFzQjtJQUV0QiwrRUFBK0U7SUFDL0UsYUFBeUI7SUFFekIsNkNBQTZDO0lBQzdDLGNBQTBCO0lBRTFCLGdEQUFnRDtJQUNoRCxXQUF1QjtJQUV2Qjs7T0FFRztJQUNILHFDQUFnRDtJQUNoRCw2QkFBOEI7SUFDOUIsK0JBQTBDOzs7OztJQVcxQyxxQkFBeUI7SUFDekIsK0JBQW1DO0lBQ25DLDRCQUFnQztJQUNoQyxxQkFBeUI7Ozs7O0lBS3pCO2NBQ1U7SUFDVix5Q0FBd0Q7SUFFeEQ7O09BRUc7SUFDSCx5Q0FBeUQ7SUFDekQsZ0NBQWlDO0lBQ2pDLHVDQUFnRTs7Ozs7Ozs7O0FBUWxFLHlDQUE0Rjs7Ozs7Ozs7QUFRNUYsMkJBME9DOzs7Ozs7Ozs7O0lBbE9DLG1CQUFvQjs7Ozs7O0lBTXBCLDBCQUFpQjs7Ozs7O0lBTWpCLHlCQUFxQzs7Ozs7SUFLckMsMEJBQXdDOzs7Ozs7Ozs7Ozs7Ozs7OztJQWlCeEMscUJBQWtDOzs7OztJQUdsQyxrQ0FBMkI7Ozs7O0lBRzNCLHFCQUFZOzs7Ozs7OztJQVFaLGtDQUEwQjs7Ozs7Ozs7Ozs7O0lBWTFCLGtDQUEwQjs7Ozs7Ozs7SUFRMUIsa0NBQTJCOzs7Ozs7OztJQVEzQixxQ0FBOEI7Ozs7Ozs7Ozs7O0lBVzlCLG9DQUE0Qjs7Ozs7SUFLNUIsMkJBQXVCOzs7Ozs7O0lBT3ZCLG9DQUE4Qzs7Ozs7Ozs7SUFROUMsa0NBQXlDOzs7Ozs7Ozs7OztJQVd6Qyw2QkFBK0I7Ozs7Ozs7OztJQVMvQiw4QkFBNkI7Ozs7Ozs7O0lBUTdCLG1DQUFrQzs7Ozs7Ozs7O0lBU2xDLDZCQUE0Qjs7Ozs7Ozs7O0lBUzVCLGtDQUFpQzs7Ozs7Ozs7O0lBU2pDLDBCQUF5Qjs7Ozs7Ozs7O0lBU3pCLCtCQUE4Qjs7Ozs7Ozs7SUFROUIsNkJBQTRCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBNEI1Qix3QkFBb0I7Ozs7Ozs7O0lBUXBCLDJCQUEwQjs7Ozs7SUFLMUIsK0JBQThCOzs7OztJQUs5Qix3QkFBK0I7Ozs7SUFHRyxRQUFZLEVBQUUsZ0JBQW9CLEVBQUUsZUFBbUI7Ozs7Ozs7O0FBTzNGLGlDQTZCQzs7Ozs7OztJQXhCQyxnQ0FBd0M7Ozs7Ozs7SUFPeEMsNEJBQXFCOzs7Ozs7SUFNckIsaUNBQWlCOzs7OztJQUtqQixvQ0FBa0M7Ozs7O0lBS2xDLDRCQUF3Qjs7Ozs7QUFrRDFCLE1BQU0sT0FBTyw2QkFBNkIsR0FBRyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0luamVjdGlvblRva2VufSBmcm9tICcuLi8uLi9kaS9pbmplY3Rpb25fdG9rZW4nO1xuaW1wb3J0IHtJbmplY3Rvcn0gZnJvbSAnLi4vLi4vZGkvaW5qZWN0b3InO1xuaW1wb3J0IHtUeXBlfSBmcm9tICcuLi8uLi9pbnRlcmZhY2UvdHlwZSc7XG5pbXBvcnQge1F1ZXJ5TGlzdH0gZnJvbSAnLi4vLi4vbGlua2VyJztcbmltcG9ydCB7U2NoZW1hTWV0YWRhdGF9IGZyb20gJy4uLy4uL21ldGFkYXRhJztcbmltcG9ydCB7U2FuaXRpemVyfSBmcm9tICcuLi8uLi9zYW5pdGl6YXRpb24vc2VjdXJpdHknO1xuXG5pbXBvcnQge0xDb250YWluZXJ9IGZyb20gJy4vY29udGFpbmVyJztcbmltcG9ydCB7Q29tcG9uZW50RGVmLCBDb21wb25lbnRUZW1wbGF0ZSwgRGlyZWN0aXZlRGVmLCBEaXJlY3RpdmVEZWZMaXN0LCBIb3N0QmluZGluZ3NGdW5jdGlvbiwgUGlwZURlZiwgUGlwZURlZkxpc3QsIFZpZXdRdWVyaWVzRnVuY3Rpb259IGZyb20gJy4vZGVmaW5pdGlvbic7XG5pbXBvcnQge0kxOG5VcGRhdGVPcENvZGVzLCBUSTE4bn0gZnJvbSAnLi9pMThuJztcbmltcG9ydCB7VEVsZW1lbnROb2RlLCBUTm9kZSwgVFZpZXdOb2RlfSBmcm9tICcuL25vZGUnO1xuaW1wb3J0IHtQbGF5ZXJIYW5kbGVyfSBmcm9tICcuL3BsYXllcic7XG5pbXBvcnQge0xRdWVyaWVzfSBmcm9tICcuL3F1ZXJ5JztcbmltcG9ydCB7UkVsZW1lbnQsIFJlbmRlcmVyMywgUmVuZGVyZXJGYWN0b3J5M30gZnJvbSAnLi9yZW5kZXJlcic7XG5pbXBvcnQge1N0eWxpbmdDb250ZXh0fSBmcm9tICcuL3N0eWxpbmcnO1xuXG5cblxuLy8gQmVsb3cgYXJlIGNvbnN0YW50cyBmb3IgTFZpZXcgaW5kaWNlcyB0byBoZWxwIHVzIGxvb2sgdXAgTFZpZXcgbWVtYmVyc1xuLy8gd2l0aG91dCBoYXZpbmcgdG8gcmVtZW1iZXIgdGhlIHNwZWNpZmljIGluZGljZXMuXG4vLyBVZ2xpZnkgd2lsbCBpbmxpbmUgdGhlc2Ugd2hlbiBtaW5pZnlpbmcgc28gdGhlcmUgc2hvdWxkbid0IGJlIGEgY29zdC5cbmV4cG9ydCBjb25zdCBIT1NUID0gMDtcbmV4cG9ydCBjb25zdCBUVklFVyA9IDE7XG5leHBvcnQgY29uc3QgRkxBR1MgPSAyO1xuZXhwb3J0IGNvbnN0IFBBUkVOVCA9IDM7XG5leHBvcnQgY29uc3QgTkVYVCA9IDQ7XG5leHBvcnQgY29uc3QgUVVFUklFUyA9IDU7XG5leHBvcnQgY29uc3QgVF9IT1NUID0gNjtcbmV4cG9ydCBjb25zdCBCSU5ESU5HX0lOREVYID0gNztcbmV4cG9ydCBjb25zdCBDTEVBTlVQID0gODtcbmV4cG9ydCBjb25zdCBDT05URVhUID0gOTtcbmV4cG9ydCBjb25zdCBJTkpFQ1RPUiA9IDEwO1xuZXhwb3J0IGNvbnN0IFJFTkRFUkVSX0ZBQ1RPUlkgPSAxMTtcbmV4cG9ydCBjb25zdCBSRU5ERVJFUiA9IDEyO1xuZXhwb3J0IGNvbnN0IFNBTklUSVpFUiA9IDEzO1xuZXhwb3J0IGNvbnN0IENISUxEX0hFQUQgPSAxNDtcbmV4cG9ydCBjb25zdCBDSElMRF9UQUlMID0gMTU7XG5leHBvcnQgY29uc3QgQ09OVEVOVF9RVUVSSUVTID0gMTY7XG5leHBvcnQgY29uc3QgREVDTEFSQVRJT05fVklFVyA9IDE3O1xuZXhwb3J0IGNvbnN0IFBSRU9SREVSX0hPT0tfRkxBR1MgPSAxODtcbi8qKiBTaXplIG9mIExWaWV3J3MgaGVhZGVyLiBOZWNlc3NhcnkgdG8gYWRqdXN0IGZvciBpdCB3aGVuIHNldHRpbmcgc2xvdHMuICAqL1xuZXhwb3J0IGNvbnN0IEhFQURFUl9PRkZTRVQgPSAyMDtcblxuXG4vLyBUaGlzIGludGVyZmFjZSByZXBsYWNlcyB0aGUgcmVhbCBMVmlldyBpbnRlcmZhY2UgaWYgaXQgaXMgYW4gYXJnIG9yIGFcbi8vIHJldHVybiB2YWx1ZSBvZiBhIHB1YmxpYyBpbnN0cnVjdGlvbi4gVGhpcyBlbnN1cmVzIHdlIGRvbid0IG5lZWQgdG8gZXhwb3NlXG4vLyB0aGUgYWN0dWFsIGludGVyZmFjZSwgd2hpY2ggc2hvdWxkIGJlIGtlcHQgcHJpdmF0ZS5cbmV4cG9ydCBpbnRlcmZhY2UgT3BhcXVlVmlld1N0YXRlIHtcbiAgJ19fYnJhbmRfXyc6ICdCcmFuZCBmb3IgT3BhcXVlVmlld1N0YXRlIHRoYXQgbm90aGluZyB3aWxsIG1hdGNoJztcbn1cblxuXG4vKipcbiAqIGBMVmlld2Agc3RvcmVzIGFsbCBvZiB0aGUgaW5mb3JtYXRpb24gbmVlZGVkIHRvIHByb2Nlc3MgdGhlIGluc3RydWN0aW9ucyBhc1xuICogdGhleSBhcmUgaW52b2tlZCBmcm9tIHRoZSB0ZW1wbGF0ZS4gRWFjaCBlbWJlZGRlZCB2aWV3IGFuZCBjb21wb25lbnQgdmlldyBoYXMgaXRzXG4gKiBvd24gYExWaWV3YC4gV2hlbiBwcm9jZXNzaW5nIGEgcGFydGljdWxhciB2aWV3LCB3ZSBzZXQgdGhlIGB2aWV3RGF0YWAgdG8gdGhhdFxuICogYExWaWV3YC4gV2hlbiB0aGF0IHZpZXcgaXMgZG9uZSBwcm9jZXNzaW5nLCB0aGUgYHZpZXdEYXRhYCBpcyBzZXQgYmFjayB0b1xuICogd2hhdGV2ZXIgdGhlIG9yaWdpbmFsIGB2aWV3RGF0YWAgd2FzIGJlZm9yZSAodGhlIHBhcmVudCBgTFZpZXdgKS5cbiAqXG4gKiBLZWVwaW5nIHNlcGFyYXRlIHN0YXRlIGZvciBlYWNoIHZpZXcgZmFjaWxpdGllcyB2aWV3IGluc2VydGlvbiAvIGRlbGV0aW9uLCBzbyB3ZVxuICogZG9uJ3QgaGF2ZSB0byBlZGl0IHRoZSBkYXRhIGFycmF5IGJhc2VkIG9uIHdoaWNoIHZpZXdzIGFyZSBwcmVzZW50LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIExWaWV3IGV4dGVuZHMgQXJyYXk8YW55PiB7XG4gIC8qKlxuICAgKiBUaGUgaG9zdCBub2RlIGZvciB0aGlzIExWaWV3IGluc3RhbmNlLCBpZiB0aGlzIGlzIGEgY29tcG9uZW50IHZpZXcuXG4gICAqXG4gICAqIElmIHRoaXMgaXMgYW4gZW1iZWRkZWQgdmlldywgSE9TVCB3aWxsIGJlIG51bGwuXG4gICAqXG4gICAqIElmIHRoZSBjb21wb25lbnQgdXNlcyBob3N0IGJpbmRpbmdzIGZvciBzdHlsaW5nIHRoYXQgdGhlIGBSRWxlbWVudGAgd2lsbCBiZSB3cmFwcGVkIHdpdGhcbiAgICogYFN0eWxpbmdDb250ZXh0YC5cbiAgICovXG4gIFtIT1NUXTogUkVsZW1lbnR8U3R5bGluZ0NvbnRleHR8bnVsbDtcblxuICAvKipcbiAgICogVGhlIHN0YXRpYyBkYXRhIGZvciB0aGlzIHZpZXcuIFdlIG5lZWQgYSByZWZlcmVuY2UgdG8gdGhpcyBzbyB3ZSBjYW4gZWFzaWx5IHdhbGsgdXAgdGhlXG4gICAqIG5vZGUgdHJlZSBpbiBESSBhbmQgZ2V0IHRoZSBUVmlldy5kYXRhIGFycmF5IGFzc29jaWF0ZWQgd2l0aCBhIG5vZGUgKHdoZXJlIHRoZVxuICAgKiBkaXJlY3RpdmUgZGVmcyBhcmUgc3RvcmVkKS5cbiAgICovXG4gIHJlYWRvbmx5W1RWSUVXXTogVFZpZXc7XG5cbiAgLyoqIEZsYWdzIGZvciB0aGlzIHZpZXcuIFNlZSBMVmlld0ZsYWdzIGZvciBtb3JlIGluZm8uICovXG4gIFtGTEFHU106IExWaWV3RmxhZ3M7XG5cbiAgLyoqXG4gICAqIFRoaXMgbWF5IHN0b3JlIGFuIHtAbGluayBMVmlld30gb3Ige0BsaW5rIExDb250YWluZXJ9LlxuICAgKlxuICAgKiBgTFZpZXdgIC0gVGhlIHBhcmVudCB2aWV3LiBUaGlzIGlzIG5lZWRlZCB3aGVuIHdlIGV4aXQgdGhlIHZpZXcgYW5kIG11c3QgcmVzdG9yZSB0aGUgcHJldmlvdXNcbiAgICogTFZpZXcuIFdpdGhvdXQgdGhpcywgdGhlIHJlbmRlciBtZXRob2Qgd291bGQgaGF2ZSB0byBrZWVwIGEgc3RhY2sgb2ZcbiAgICogdmlld3MgYXMgaXQgaXMgcmVjdXJzaXZlbHkgcmVuZGVyaW5nIHRlbXBsYXRlcy5cbiAgICpcbiAgICogYExDb250YWluZXJgIC0gVGhlIGN1cnJlbnQgdmlldyBpcyBwYXJ0IG9mIGEgY29udGFpbmVyLCBhbmQgaXMgYW4gZW1iZWRkZWQgdmlldy5cbiAgICovXG4gIFtQQVJFTlRdOiBMVmlld3xMQ29udGFpbmVyfG51bGw7XG5cbiAgLyoqXG4gICAqXG4gICAqIFRoZSBuZXh0IHNpYmxpbmcgTFZpZXcgb3IgTENvbnRhaW5lci5cbiAgICpcbiAgICogQWxsb3dzIHVzIHRvIHByb3BhZ2F0ZSBiZXR3ZWVuIHNpYmxpbmcgdmlldyBzdGF0ZXMgdGhhdCBhcmVuJ3QgaW4gdGhlIHNhbWVcbiAgICogY29udGFpbmVyLiBFbWJlZGRlZCB2aWV3cyBhbHJlYWR5IGhhdmUgYSBub2RlLm5leHQsIGJ1dCBpdCBpcyBvbmx5IHNldCBmb3JcbiAgICogdmlld3MgaW4gdGhlIHNhbWUgY29udGFpbmVyLiBXZSBuZWVkIGEgd2F5IHRvIGxpbmsgY29tcG9uZW50IHZpZXdzIGFuZCB2aWV3c1xuICAgKiBhY3Jvc3MgY29udGFpbmVycyBhcyB3ZWxsLlxuICAgKi9cbiAgW05FWFRdOiBMVmlld3xMQ29udGFpbmVyfG51bGw7XG5cbiAgLyoqIFF1ZXJpZXMgYWN0aXZlIGZvciB0aGlzIHZpZXcgLSBub2RlcyBmcm9tIGEgdmlldyBhcmUgcmVwb3J0ZWQgdG8gdGhvc2UgcXVlcmllcy4gKi9cbiAgW1FVRVJJRVNdOiBMUXVlcmllc3xudWxsO1xuXG4gIC8qKlxuICAgKiBQb2ludGVyIHRvIHRoZSBgVFZpZXdOb2RlYCBvciBgVEVsZW1lbnROb2RlYCB3aGljaCByZXByZXNlbnRzIHRoZSByb290IG9mIHRoZSB2aWV3LlxuICAgKlxuICAgKiBJZiBgVFZpZXdOb2RlYCwgdGhpcyBpcyBhbiBlbWJlZGRlZCB2aWV3IG9mIGEgY29udGFpbmVyLiBXZSBuZWVkIHRoaXMgdG8gYmUgYWJsZSB0b1xuICAgKiBlZmZpY2llbnRseSBmaW5kIHRoZSBgTFZpZXdOb2RlYCB3aGVuIGluc2VydGluZyB0aGUgdmlldyBpbnRvIGFuIGFuY2hvci5cbiAgICpcbiAgICogSWYgYFRFbGVtZW50Tm9kZWAsIHRoaXMgaXMgdGhlIExWaWV3IG9mIGEgY29tcG9uZW50LlxuICAgKlxuICAgKiBJZiBudWxsLCB0aGlzIGlzIHRoZSByb290IHZpZXcgb2YgYW4gYXBwbGljYXRpb24gKHJvb3QgY29tcG9uZW50IGlzIGluIHRoaXMgdmlldykuXG4gICAqL1xuICBbVF9IT1NUXTogVFZpZXdOb2RlfFRFbGVtZW50Tm9kZXxudWxsO1xuXG4gIC8qKlxuICAgKiBUaGUgYmluZGluZyBpbmRleCB3ZSBzaG91bGQgYWNjZXNzIG5leHQuXG4gICAqXG4gICAqIFRoaXMgaXMgc3RvcmVkIHNvIHRoYXQgYmluZGluZ3MgY2FuIGNvbnRpbnVlIHdoZXJlIHRoZXkgbGVmdCBvZmZcbiAgICogaWYgYSB2aWV3IGlzIGxlZnQgbWlkd2F5IHRocm91Z2ggcHJvY2Vzc2luZyBiaW5kaW5ncyAoZS5nLiBpZiB0aGVyZSBpc1xuICAgKiBhIHNldHRlciB0aGF0IGNyZWF0ZXMgYW4gZW1iZWRkZWQgdmlldywgbGlrZSBpbiBuZ0lmKS5cbiAgICovXG4gIFtCSU5ESU5HX0lOREVYXTogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBXaGVuIGEgdmlldyBpcyBkZXN0cm95ZWQsIGxpc3RlbmVycyBuZWVkIHRvIGJlIHJlbGVhc2VkIGFuZCBvdXRwdXRzIG5lZWQgdG8gYmVcbiAgICogdW5zdWJzY3JpYmVkLiBUaGlzIGNvbnRleHQgYXJyYXkgc3RvcmVzIGJvdGggbGlzdGVuZXIgZnVuY3Rpb25zIHdyYXBwZWQgd2l0aFxuICAgKiB0aGVpciBjb250ZXh0IGFuZCBvdXRwdXQgc3Vic2NyaXB0aW9uIGluc3RhbmNlcyBmb3IgYSBwYXJ0aWN1bGFyIHZpZXcuXG4gICAqXG4gICAqIFRoZXNlIGNoYW5nZSBwZXIgTFZpZXcgaW5zdGFuY2UsIHNvIHRoZXkgY2Fubm90IGJlIHN0b3JlZCBvbiBUVmlldy4gSW5zdGVhZCxcbiAgICogVFZpZXcuY2xlYW51cCBzYXZlcyBhbiBpbmRleCB0byB0aGUgbmVjZXNzYXJ5IGNvbnRleHQgaW4gdGhpcyBhcnJheS5cbiAgICovXG4gIC8vIFRPRE86IGZsYXR0ZW4gaW50byBMVmlld1tdXG4gIFtDTEVBTlVQXTogYW55W118bnVsbDtcblxuICAvKipcbiAgICogLSBGb3IgZHluYW1pYyB2aWV3cywgdGhpcyBpcyB0aGUgY29udGV4dCB3aXRoIHdoaWNoIHRvIHJlbmRlciB0aGUgdGVtcGxhdGUgKGUuZy5cbiAgICogICBgTmdGb3JDb250ZXh0YCksIG9yIGB7fWAgaWYgbm90IGRlZmluZWQgZXhwbGljaXRseS5cbiAgICogLSBGb3Igcm9vdCB2aWV3IG9mIHRoZSByb290IGNvbXBvbmVudCB0aGUgY29udGV4dCBjb250YWlucyBjaGFuZ2UgZGV0ZWN0aW9uIGRhdGEuXG4gICAqIC0gRm9yIG5vbi1yb290IGNvbXBvbmVudHMsIHRoZSBjb250ZXh0IGlzIHRoZSBjb21wb25lbnQgaW5zdGFuY2UsXG4gICAqIC0gRm9yIGlubGluZSB2aWV3cywgdGhlIGNvbnRleHQgaXMgbnVsbC5cbiAgICovXG4gIFtDT05URVhUXToge318Um9vdENvbnRleHR8bnVsbDtcblxuICAvKiogQW4gb3B0aW9uYWwgTW9kdWxlIEluamVjdG9yIHRvIGJlIHVzZWQgYXMgZmFsbCBiYWNrIGFmdGVyIEVsZW1lbnQgSW5qZWN0b3JzIGFyZSBjb25zdWx0ZWQuICovXG4gIHJlYWRvbmx5W0lOSkVDVE9SXTogSW5qZWN0b3J8bnVsbDtcblxuICAvKiogUmVuZGVyZXIgdG8gYmUgdXNlZCBmb3IgdGhpcyB2aWV3LiAqL1xuICBbUkVOREVSRVJfRkFDVE9SWV06IFJlbmRlcmVyRmFjdG9yeTM7XG5cbiAgLyoqIFJlbmRlcmVyIHRvIGJlIHVzZWQgZm9yIHRoaXMgdmlldy4gKi9cbiAgW1JFTkRFUkVSXTogUmVuZGVyZXIzO1xuXG4gIC8qKiBBbiBvcHRpb25hbCBjdXN0b20gc2FuaXRpemVyLiAqL1xuICBbU0FOSVRJWkVSXTogU2FuaXRpemVyfG51bGw7XG5cbiAgLyoqXG4gICAqIFJlZmVyZW5jZSB0byB0aGUgZmlyc3QgTFZpZXcgb3IgTENvbnRhaW5lciBiZW5lYXRoIHRoaXMgTFZpZXcgaW5cbiAgICogdGhlIGhpZXJhcmNoeS5cbiAgICpcbiAgICogTmVjZXNzYXJ5IHRvIHN0b3JlIHRoaXMgc28gdmlld3MgY2FuIHRyYXZlcnNlIHRocm91Z2ggdGhlaXIgbmVzdGVkIHZpZXdzXG4gICAqIHRvIHJlbW92ZSBsaXN0ZW5lcnMgYW5kIGNhbGwgb25EZXN0cm95IGNhbGxiYWNrcy5cbiAgICovXG4gIFtDSElMRF9IRUFEXTogTFZpZXd8TENvbnRhaW5lcnxudWxsO1xuXG4gIC8qKlxuICAgKiBUaGUgbGFzdCBMVmlldyBvciBMQ29udGFpbmVyIGJlbmVhdGggdGhpcyBMVmlldyBpbiB0aGUgaGllcmFyY2h5LlxuICAgKlxuICAgKiBUaGUgdGFpbCBhbGxvd3MgdXMgdG8gcXVpY2tseSBhZGQgYSBuZXcgc3RhdGUgdG8gdGhlIGVuZCBvZiB0aGUgdmlldyBsaXN0XG4gICAqIHdpdGhvdXQgaGF2aW5nIHRvIHByb3BhZ2F0ZSBzdGFydGluZyBmcm9tIHRoZSBmaXJzdCBjaGlsZC5cbiAgICovXG4gIFtDSElMRF9UQUlMXTogTFZpZXd8TENvbnRhaW5lcnxudWxsO1xuXG4gIC8qKlxuICAgKiBTdG9yZXMgUXVlcnlMaXN0cyBhc3NvY2lhdGVkIHdpdGggY29udGVudCBxdWVyaWVzIG9mIGEgZGlyZWN0aXZlLiBUaGlzIGRhdGEgc3RydWN0dXJlIGlzXG4gICAqIGZpbGxlZC1pbiBhcyBwYXJ0IG9mIGEgZGlyZWN0aXZlIGNyZWF0aW9uIHByb2Nlc3MgYW5kIGlzIGxhdGVyIHVzZWQgdG8gcmV0cmlldmUgYSBRdWVyeUxpc3QgdG9cbiAgICogYmUgcmVmcmVzaGVkLlxuICAgKi9cbiAgW0NPTlRFTlRfUVVFUklFU106IFF1ZXJ5TGlzdDxhbnk+W118bnVsbDtcblxuICAvKipcbiAgICogVmlldyB3aGVyZSB0aGlzIHZpZXcncyB0ZW1wbGF0ZSB3YXMgZGVjbGFyZWQuXG4gICAqXG4gICAqIE9ubHkgYXBwbGljYWJsZSBmb3IgZHluYW1pY2FsbHkgY3JlYXRlZCB2aWV3cy4gV2lsbCBiZSBudWxsIGZvciBpbmxpbmUvY29tcG9uZW50IHZpZXdzLlxuICAgKlxuICAgKiBUaGUgdGVtcGxhdGUgZm9yIGEgZHluYW1pY2FsbHkgY3JlYXRlZCB2aWV3IG1heSBiZSBkZWNsYXJlZCBpbiBhIGRpZmZlcmVudCB2aWV3IHRoYW5cbiAgICogaXQgaXMgaW5zZXJ0ZWQuIFdlIGFscmVhZHkgdHJhY2sgdGhlIFwiaW5zZXJ0aW9uIHZpZXdcIiAodmlldyB3aGVyZSB0aGUgdGVtcGxhdGUgd2FzXG4gICAqIGluc2VydGVkKSBpbiBMVmlld1tQQVJFTlRdLCBidXQgd2UgYWxzbyBuZWVkIGFjY2VzcyB0byB0aGUgXCJkZWNsYXJhdGlvbiB2aWV3XCJcbiAgICogKHZpZXcgd2hlcmUgdGhlIHRlbXBsYXRlIHdhcyBkZWNsYXJlZCkuIE90aGVyd2lzZSwgd2Ugd291bGRuJ3QgYmUgYWJsZSB0byBjYWxsIHRoZVxuICAgKiB2aWV3J3MgdGVtcGxhdGUgZnVuY3Rpb24gd2l0aCB0aGUgcHJvcGVyIGNvbnRleHRzLiBDb250ZXh0IHNob3VsZCBiZSBpbmhlcml0ZWQgZnJvbVxuICAgKiB0aGUgZGVjbGFyYXRpb24gdmlldyB0cmVlLCBub3QgdGhlIGluc2VydGlvbiB2aWV3IHRyZWUuXG4gICAqXG4gICAqIEV4YW1wbGUgKEFwcENvbXBvbmVudCB0ZW1wbGF0ZSk6XG4gICAqXG4gICAqIDxuZy10ZW1wbGF0ZSAjZm9vPjwvbmctdGVtcGxhdGU+ICAgICAgIDwtLSBkZWNsYXJlZCBoZXJlIC0tPlxuICAgKiA8c29tZS1jb21wIFt0cGxdPVwiZm9vXCI+PC9zb21lLWNvbXA+ICAgIDwtLSBpbnNlcnRlZCBpbnNpZGUgdGhpcyBjb21wb25lbnQgLS0+XG4gICAqXG4gICAqIFRoZSA8bmctdGVtcGxhdGU+IGFib3ZlIGlzIGRlY2xhcmVkIGluIHRoZSBBcHBDb21wb25lbnQgdGVtcGxhdGUsIGJ1dCBpdCB3aWxsIGJlIHBhc3NlZCBpbnRvXG4gICAqIFNvbWVDb21wIGFuZCBpbnNlcnRlZCB0aGVyZS4gSW4gdGhpcyBjYXNlLCB0aGUgZGVjbGFyYXRpb24gdmlldyB3b3VsZCBiZSB0aGUgQXBwQ29tcG9uZW50LFxuICAgKiBidXQgdGhlIGluc2VydGlvbiB2aWV3IHdvdWxkIGJlIFNvbWVDb21wLiBXaGVuIHdlIGFyZSByZW1vdmluZyB2aWV3cywgd2Ugd291bGQgd2FudCB0b1xuICAgKiB0cmF2ZXJzZSB0aHJvdWdoIHRoZSBpbnNlcnRpb24gdmlldyB0byBjbGVhbiB1cCBsaXN0ZW5lcnMuIFdoZW4gd2UgYXJlIGNhbGxpbmcgdGhlXG4gICAqIHRlbXBsYXRlIGZ1bmN0aW9uIGR1cmluZyBjaGFuZ2UgZGV0ZWN0aW9uLCB3ZSBuZWVkIHRoZSBkZWNsYXJhdGlvbiB2aWV3IHRvIGdldCBpbmhlcml0ZWRcbiAgICogY29udGV4dC5cbiAgICovXG4gIFtERUNMQVJBVElPTl9WSUVXXTogTFZpZXd8bnVsbDtcblxuICAvKipcbiAgICogTW9yZSBmbGFncyBmb3IgdGhpcyB2aWV3LiBTZWUgUHJlT3JkZXJIb29rRmxhZ3MgZm9yIG1vcmUgaW5mby5cbiAgICovXG4gIFtQUkVPUkRFUl9IT09LX0ZMQUdTXTogUHJlT3JkZXJIb29rRmxhZ3M7XG59XG5cbi8qKiBGbGFncyBhc3NvY2lhdGVkIHdpdGggYW4gTFZpZXcgKHNhdmVkIGluIExWaWV3W0ZMQUdTXSkgKi9cbmV4cG9ydCBjb25zdCBlbnVtIExWaWV3RmxhZ3Mge1xuICAvKiogVGhlIHN0YXRlIG9mIHRoZSBpbml0IHBoYXNlIG9uIHRoZSBmaXJzdCAyIGJpdHMgKi9cbiAgSW5pdFBoYXNlU3RhdGVJbmNyZW1lbnRlciA9IDBiMDAwMDAwMDAwMDEsXG4gIEluaXRQaGFzZVN0YXRlTWFzayA9IDBiMDAwMDAwMDAwMTEsXG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgb3Igbm90IHRoZSB2aWV3IGlzIGluIGNyZWF0aW9uTW9kZS5cbiAgICpcbiAgICogVGhpcyBtdXN0IGJlIHN0b3JlZCBpbiB0aGUgdmlldyByYXRoZXIgdGhhbiB1c2luZyBgZGF0YWAgYXMgYSBtYXJrZXIgc28gdGhhdFxuICAgKiB3ZSBjYW4gcHJvcGVybHkgc3VwcG9ydCBlbWJlZGRlZCB2aWV3cy4gT3RoZXJ3aXNlLCB3aGVuIGV4aXRpbmcgYSBjaGlsZCB2aWV3XG4gICAqIGJhY2sgaW50byB0aGUgcGFyZW50IHZpZXcsIGBkYXRhYCB3aWxsIGJlIGRlZmluZWQgYW5kIGBjcmVhdGlvbk1vZGVgIHdpbGwgYmVcbiAgICogaW1wcm9wZXJseSByZXBvcnRlZCBhcyBmYWxzZS5cbiAgICovXG4gIENyZWF0aW9uTW9kZSA9IDBiMDAwMDAwMDAxMDAsXG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgb3Igbm90IHRoaXMgTFZpZXcgaW5zdGFuY2UgaXMgb24gaXRzIGZpcnN0IHByb2Nlc3NpbmcgcGFzcy5cbiAgICpcbiAgICogQW4gTFZpZXcgaW5zdGFuY2UgaXMgY29uc2lkZXJlZCB0byBiZSBvbiBpdHMgXCJmaXJzdCBwYXNzXCIgdW50aWwgaXRcbiAgICogaGFzIGNvbXBsZXRlZCBvbmUgY3JlYXRpb24gbW9kZSBydW4gYW5kIG9uZSB1cGRhdGUgbW9kZSBydW4uIEF0IHRoaXNcbiAgICogdGltZSwgdGhlIGZsYWcgaXMgdHVybmVkIG9mZi5cbiAgICovXG4gIEZpcnN0TFZpZXdQYXNzID0gMGIwMDAwMDAwMTAwMCxcblxuICAvKiogV2hldGhlciB0aGlzIHZpZXcgaGFzIGRlZmF1bHQgY2hhbmdlIGRldGVjdGlvbiBzdHJhdGVneSAoY2hlY2tzIGFsd2F5cykgb3Igb25QdXNoICovXG4gIENoZWNrQWx3YXlzID0gMGIwMDAwMDAxMDAwMCxcblxuICAvKipcbiAgICogV2hldGhlciBvciBub3QgbWFudWFsIGNoYW5nZSBkZXRlY3Rpb24gaXMgdHVybmVkIG9uIGZvciBvblB1c2ggY29tcG9uZW50cy5cbiAgICpcbiAgICogVGhpcyBpcyBhIHNwZWNpYWwgbW9kZSB0aGF0IG9ubHkgbWFya3MgY29tcG9uZW50cyBkaXJ0eSBpbiB0d28gY2FzZXM6XG4gICAqIDEpIFRoZXJlIGhhcyBiZWVuIGEgY2hhbmdlIHRvIGFuIEBJbnB1dCBwcm9wZXJ0eVxuICAgKiAyKSBgbWFya0RpcnR5KClgIGhhcyBiZWVuIGNhbGxlZCBtYW51YWxseSBieSB0aGUgdXNlclxuICAgKlxuICAgKiBOb3RlIHRoYXQgaW4gdGhpcyBtb2RlLCB0aGUgZmlyaW5nIG9mIGV2ZW50cyBkb2VzIE5PVCBtYXJrIGNvbXBvbmVudHNcbiAgICogZGlydHkgYXV0b21hdGljYWxseS5cbiAgICpcbiAgICogTWFudWFsIG1vZGUgaXMgdHVybmVkIG9mZiBieSBkZWZhdWx0IGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSwgYXMgZXZlbnRzXG4gICAqIGF1dG9tYXRpY2FsbHkgbWFyayBPblB1c2ggY29tcG9uZW50cyBkaXJ0eSBpbiBWaWV3IEVuZ2luZS5cbiAgICpcbiAgICogVE9ETzogQWRkIGEgcHVibGljIEFQSSB0byBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSB0byB0dXJuIHRoaXMgbW9kZSBvblxuICAgKi9cbiAgTWFudWFsT25QdXNoID0gMGIwMDAwMDEwMDAwMCxcblxuICAvKiogV2hldGhlciBvciBub3QgdGhpcyB2aWV3IGlzIGN1cnJlbnRseSBkaXJ0eSAobmVlZGluZyBjaGVjaykgKi9cbiAgRGlydHkgPSAwYjAwMDAwMTAwMDAwMCxcblxuICAvKiogV2hldGhlciBvciBub3QgdGhpcyB2aWV3IGlzIGN1cnJlbnRseSBhdHRhY2hlZCB0byBjaGFuZ2UgZGV0ZWN0aW9uIHRyZWUuICovXG4gIEF0dGFjaGVkID0gMGIwMDAwMTAwMDAwMDAsXG5cbiAgLyoqIFdoZXRoZXIgb3Igbm90IHRoaXMgdmlldyBpcyBkZXN0cm95ZWQuICovXG4gIERlc3Ryb3llZCA9IDBiMDAwMTAwMDAwMDAwLFxuXG4gIC8qKiBXaGV0aGVyIG9yIG5vdCB0aGlzIHZpZXcgaXMgdGhlIHJvb3QgdmlldyAqL1xuICBJc1Jvb3QgPSAwYjAwMTAwMDAwMDAwMCxcblxuICAvKipcbiAgICogSW5kZXggb2YgdGhlIGN1cnJlbnQgaW5pdCBwaGFzZSBvbiBsYXN0IDIyIGJpdHNcbiAgICovXG4gIEluZGV4V2l0aGluSW5pdFBoYXNlSW5jcmVtZW50ZXIgPSAwYjAxMDAwMDAwMDAwMCxcbiAgSW5kZXhXaXRoaW5Jbml0UGhhc2VTaGlmdCA9IDEwLFxuICBJbmRleFdpdGhpbkluaXRQaGFzZVJlc2V0ID0gMGIwMDExMTExMTExMTEsXG59XG5cbi8qKlxuICogUG9zc2libGUgc3RhdGVzIG9mIHRoZSBpbml0IHBoYXNlOlxuICogLSAwMDogT25Jbml0IGhvb2tzIHRvIGJlIHJ1bi5cbiAqIC0gMDE6IEFmdGVyQ29udGVudEluaXQgaG9va3MgdG8gYmUgcnVuXG4gKiAtIDEwOiBBZnRlclZpZXdJbml0IGhvb2tzIHRvIGJlIHJ1blxuICogLSAxMTogQWxsIGluaXQgaG9va3MgaGF2ZSBiZWVuIHJ1blxuICovXG5leHBvcnQgY29uc3QgZW51bSBJbml0UGhhc2VTdGF0ZSB7XG4gIE9uSW5pdEhvb2tzVG9CZVJ1biA9IDBiMDAsXG4gIEFmdGVyQ29udGVudEluaXRIb29rc1RvQmVSdW4gPSAwYjAxLFxuICBBZnRlclZpZXdJbml0SG9va3NUb0JlUnVuID0gMGIxMCxcbiAgSW5pdFBoYXNlQ29tcGxldGVkID0gMGIxMSxcbn1cblxuLyoqIE1vcmUgZmxhZ3MgYXNzb2NpYXRlZCB3aXRoIGFuIExWaWV3IChzYXZlZCBpbiBMVmlld1tGTEFHU19NT1JFXSkgKi9cbmV4cG9ydCBjb25zdCBlbnVtIFByZU9yZGVySG9va0ZsYWdzIHtcbiAgLyoqIFRoZSBpbmRleCBvZiB0aGUgbmV4dCBwcmUtb3JkZXIgaG9vayB0byBiZSBjYWxsZWQgaW4gdGhlIGhvb2tzIGFycmF5LCBvbiB0aGUgZmlyc3QgMTZcbiAgICAgYml0cyAqL1xuICBJbmRleE9mVGhlTmV4dFByZU9yZGVySG9va01hc2tNYXNrID0gMGIwMTExMTExMTExMTExMTExMSxcblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBpbml0IGhvb2tzIHRoYXQgaGF2ZSBhbHJlYWR5IGJlZW4gY2FsbGVkLCBvbiB0aGUgbGFzdCAxNiBiaXRzXG4gICAqL1xuICBOdW1iZXJPZkluaXRIb29rc0NhbGxlZEluY3JlbWVudGVyID0gMGIwMTAwMDAwMDAwMDAwMDAwMDAsXG4gIE51bWJlck9mSW5pdEhvb2tzQ2FsbGVkU2hpZnQgPSAxNixcbiAgTnVtYmVyT2ZJbml0SG9va3NDYWxsZWRNYXNrID0gMGIxMTExMTExMTExMTExMTExMDAwMDAwMDAwMDAwMDAwMCxcbn1cblxuLyoqXG4gKiBTZXQgb2YgaW5zdHJ1Y3Rpb25zIHVzZWQgdG8gcHJvY2VzcyBob3N0IGJpbmRpbmdzIGVmZmljaWVudGx5LlxuICpcbiAqIFNlZSBWSUVXX0RBVEEubWQgZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRXhwYW5kb0luc3RydWN0aW9ucyBleHRlbmRzIEFycmF5PG51bWJlcnxIb3N0QmluZGluZ3NGdW5jdGlvbjxhbnk+fG51bGw+IHt9XG5cbi8qKlxuICogVGhlIHN0YXRpYyBkYXRhIGZvciBhbiBMVmlldyAoc2hhcmVkIGJldHdlZW4gYWxsIHRlbXBsYXRlcyBvZiBhXG4gKiBnaXZlbiB0eXBlKS5cbiAqXG4gKiBTdG9yZWQgb24gdGhlIHRlbXBsYXRlIGZ1bmN0aW9uIGFzIG5nUHJpdmF0ZURhdGEuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVFZpZXcge1xuICAvKipcbiAgICogSUQgZm9yIGlubGluZSB2aWV3cyB0byBkZXRlcm1pbmUgd2hldGhlciBhIHZpZXcgaXMgdGhlIHNhbWUgYXMgdGhlIHByZXZpb3VzIHZpZXdcbiAgICogaW4gYSBjZXJ0YWluIHBvc2l0aW9uLiBJZiBpdCdzIG5vdCwgd2Uga25vdyB0aGUgbmV3IHZpZXcgbmVlZHMgdG8gYmUgaW5zZXJ0ZWRcbiAgICogYW5kIHRoZSBvbmUgdGhhdCBleGlzdHMgbmVlZHMgdG8gYmUgcmVtb3ZlZCAoZS5nLiBpZi9lbHNlIHN0YXRlbWVudHMpXG4gICAqXG4gICAqIElmIHRoaXMgaXMgLTEsIHRoZW4gdGhpcyBpcyBhIGNvbXBvbmVudCB2aWV3IG9yIGEgZHluYW1pY2FsbHkgY3JlYXRlZCB2aWV3LlxuICAgKi9cbiAgcmVhZG9ubHkgaWQ6IG51bWJlcjtcblxuICAvKipcbiAgICogVGhpcyBpcyBhIGJsdWVwcmludCB1c2VkIHRvIGdlbmVyYXRlIExWaWV3IGluc3RhbmNlcyBmb3IgdGhpcyBUVmlldy4gQ29weWluZyB0aGlzXG4gICAqIGJsdWVwcmludCBpcyBmYXN0ZXIgdGhhbiBjcmVhdGluZyBhIG5ldyBMVmlldyBmcm9tIHNjcmF0Y2guXG4gICAqL1xuICBibHVlcHJpbnQ6IExWaWV3O1xuXG4gIC8qKlxuICAgKiBUaGUgdGVtcGxhdGUgZnVuY3Rpb24gdXNlZCB0byByZWZyZXNoIHRoZSB2aWV3IG9mIGR5bmFtaWNhbGx5IGNyZWF0ZWQgdmlld3NcbiAgICogYW5kIGNvbXBvbmVudHMuIFdpbGwgYmUgbnVsbCBmb3IgaW5saW5lIHZpZXdzLlxuICAgKi9cbiAgdGVtcGxhdGU6IENvbXBvbmVudFRlbXBsYXRlPHt9PnxudWxsO1xuXG4gIC8qKlxuICAgKiBBIGZ1bmN0aW9uIGNvbnRhaW5pbmcgcXVlcnktcmVsYXRlZCBpbnN0cnVjdGlvbnMuXG4gICAqL1xuICB2aWV3UXVlcnk6IFZpZXdRdWVyaWVzRnVuY3Rpb248e30+fG51bGw7XG5cbiAgLyoqXG4gICAqIFBvaW50ZXIgdG8gdGhlIGBUTm9kZWAgdGhhdCByZXByZXNlbnRzIHRoZSByb290IG9mIHRoZSB2aWV3LlxuICAgKlxuICAgKiBJZiB0aGlzIGlzIGEgYFRWaWV3Tm9kZWAgZm9yIGFuIGBMVmlld05vZGVgLCB0aGlzIGlzIGFuIGVtYmVkZGVkIHZpZXcgb2YgYSBjb250YWluZXIuXG4gICAqIFdlIG5lZWQgdGhpcyBwb2ludGVyIHRvIGJlIGFibGUgdG8gZWZmaWNpZW50bHkgZmluZCB0aGlzIG5vZGUgd2hlbiBpbnNlcnRpbmcgdGhlIHZpZXdcbiAgICogaW50byBhbiBhbmNob3IuXG4gICAqXG4gICAqIElmIHRoaXMgaXMgYSBgVEVsZW1lbnROb2RlYCwgdGhpcyBpcyB0aGUgdmlldyBvZiBhIHJvb3QgY29tcG9uZW50LiBJdCBoYXMgZXhhY3RseSBvbmVcbiAgICogcm9vdCBUTm9kZS5cbiAgICpcbiAgICogSWYgdGhpcyBpcyBudWxsLCB0aGlzIGlzIHRoZSB2aWV3IG9mIGEgY29tcG9uZW50IHRoYXQgaXMgbm90IGF0IHJvb3QuIFdlIGRvIG5vdCBzdG9yZVxuICAgKiB0aGUgaG9zdCBUTm9kZXMgZm9yIGNoaWxkIGNvbXBvbmVudCB2aWV3cyBiZWNhdXNlIHRoZXkgY2FuIHBvdGVudGlhbGx5IGhhdmUgc2V2ZXJhbFxuICAgKiBkaWZmZXJlbnQgaG9zdCBUTm9kZXMsIGRlcGVuZGluZyBvbiB3aGVyZSB0aGUgY29tcG9uZW50IGlzIGJlaW5nIHVzZWQuIFRoZXNlIGhvc3RcbiAgICogVE5vZGVzIGNhbm5vdCBiZSBzaGFyZWQgKGR1ZSB0byBkaWZmZXJlbnQgaW5kaWNlcywgZXRjKS5cbiAgICovXG4gIG5vZGU6IFRWaWV3Tm9kZXxURWxlbWVudE5vZGV8bnVsbDtcblxuICAvKiogV2hldGhlciBvciBub3QgdGhpcyB0ZW1wbGF0ZSBoYXMgYmVlbiBwcm9jZXNzZWQuICovXG4gIGZpcnN0VGVtcGxhdGVQYXNzOiBib29sZWFuO1xuXG4gIC8qKiBTdGF0aWMgZGF0YSBlcXVpdmFsZW50IG9mIExWaWV3LmRhdGFbXS4gQ29udGFpbnMgVE5vZGVzLCBQaXBlRGVmSW50ZXJuYWwgb3IgVEkxOG4uICovXG4gIGRhdGE6IFREYXRhO1xuXG4gIC8qKlxuICAgKiBUaGUgYmluZGluZyBzdGFydCBpbmRleCBpcyB0aGUgaW5kZXggYXQgd2hpY2ggdGhlIGRhdGEgYXJyYXlcbiAgICogc3RhcnRzIHRvIHN0b3JlIGJpbmRpbmdzIG9ubHkuIFNhdmluZyB0aGlzIHZhbHVlIGVuc3VyZXMgdGhhdCB3ZVxuICAgKiB3aWxsIGJlZ2luIHJlYWRpbmcgYmluZGluZ3MgYXQgdGhlIGNvcnJlY3QgcG9pbnQgaW4gdGhlIGFycmF5IHdoZW5cbiAgICogd2UgYXJlIGluIHVwZGF0ZSBtb2RlLlxuICAgKi9cbiAgYmluZGluZ1N0YXJ0SW5kZXg6IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIGluZGV4IHdoZXJlIHRoZSBcImV4cGFuZG9cIiBzZWN0aW9uIG9mIGBMVmlld2AgYmVnaW5zLiBUaGUgZXhwYW5kb1xuICAgKiBzZWN0aW9uIGNvbnRhaW5zIGluamVjdG9ycywgZGlyZWN0aXZlIGluc3RhbmNlcywgYW5kIGhvc3QgYmluZGluZyB2YWx1ZXMuXG4gICAqIFVubGlrZSB0aGUgXCJjb25zdHNcIiBhbmQgXCJ2YXJzXCIgc2VjdGlvbnMgb2YgYExWaWV3YCwgdGhlIGxlbmd0aCBvZiB0aGlzXG4gICAqIHNlY3Rpb24gY2Fubm90IGJlIGNhbGN1bGF0ZWQgYXQgY29tcGlsZS10aW1lIGJlY2F1c2UgZGlyZWN0aXZlcyBhcmUgbWF0Y2hlZFxuICAgKiBhdCBydW50aW1lIHRvIHByZXNlcnZlIGxvY2FsaXR5LlxuICAgKlxuICAgKiBXZSBzdG9yZSB0aGlzIHN0YXJ0IGluZGV4IHNvIHdlIGtub3cgd2hlcmUgdG8gc3RhcnQgY2hlY2tpbmcgaG9zdCBiaW5kaW5nc1xuICAgKiBpbiBgc2V0SG9zdEJpbmRpbmdzYC5cbiAgICovXG4gIGV4cGFuZG9TdGFydEluZGV4OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgb3Igbm90IHRoZXJlIGFyZSBhbnkgc3RhdGljIHZpZXcgcXVlcmllcyB0cmFja2VkIG9uIHRoaXMgdmlldy5cbiAgICpcbiAgICogV2Ugc3RvcmUgdGhpcyBzbyB3ZSBrbm93IHdoZXRoZXIgb3Igbm90IHdlIHNob3VsZCBkbyBhIHZpZXcgcXVlcnlcbiAgICogcmVmcmVzaCBhZnRlciBjcmVhdGlvbiBtb2RlIHRvIGNvbGxlY3Qgc3RhdGljIHF1ZXJ5IHJlc3VsdHMuXG4gICAqL1xuICBzdGF0aWNWaWV3UXVlcmllczogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciBvciBub3QgdGhlcmUgYXJlIGFueSBzdGF0aWMgY29udGVudCBxdWVyaWVzIHRyYWNrZWQgb24gdGhpcyB2aWV3LlxuICAgKlxuICAgKiBXZSBzdG9yZSB0aGlzIHNvIHdlIGtub3cgd2hldGhlciBvciBub3Qgd2Ugc2hvdWxkIGRvIGEgY29udGVudCBxdWVyeVxuICAgKiByZWZyZXNoIGFmdGVyIGNyZWF0aW9uIG1vZGUgdG8gY29sbGVjdCBzdGF0aWMgcXVlcnkgcmVzdWx0cy5cbiAgICovXG4gIHN0YXRpY0NvbnRlbnRRdWVyaWVzOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgaW5kZXggd2hlcmUgdGhlIHZpZXdRdWVyaWVzIHNlY3Rpb24gb2YgYExWaWV3YCBiZWdpbnMuIFRoaXMgc2VjdGlvbiBjb250YWluc1xuICAgKiB2aWV3IHF1ZXJpZXMgZGVmaW5lZCBmb3IgYSBjb21wb25lbnQvZGlyZWN0aXZlLlxuICAgKlxuICAgKiBXZSBzdG9yZSB0aGlzIHN0YXJ0IGluZGV4IHNvIHdlIGtub3cgd2hlcmUgdGhlIGxpc3Qgb2YgdmlldyBxdWVyaWVzIHN0YXJ0cy5cbiAgICogVGhpcyBpcyByZXF1aXJlZCB3aGVuIHdlIGludm9rZSB2aWV3IHF1ZXJpZXMgYXQgcnVudGltZS4gV2UgaW52b2tlIHF1ZXJpZXMgb25lIGJ5IG9uZSBhbmRcbiAgICogaW5jcmVtZW50IHF1ZXJ5IGluZGV4IGFmdGVyIGVhY2ggaXRlcmF0aW9uLiBUaGlzIGluZm9ybWF0aW9uIGhlbHBzIHVzIHRvIHJlc2V0IGluZGV4IGJhY2sgdG9cbiAgICogdGhlIGJlZ2lubmluZyBvZiB2aWV3IHF1ZXJ5IGxpc3QgYmVmb3JlIHdlIGludm9rZSB2aWV3IHF1ZXJpZXMgYWdhaW4uXG4gICAqL1xuICB2aWV3UXVlcnlTdGFydEluZGV4OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEEgcmVmZXJlbmNlIHRvIHRoZSBmaXJzdCBjaGlsZCBub2RlIGxvY2F0ZWQgaW4gdGhlIHZpZXcuXG4gICAqL1xuICBmaXJzdENoaWxkOiBUTm9kZXxudWxsO1xuXG4gIC8qKlxuICAgKiBTZXQgb2YgaW5zdHJ1Y3Rpb25zIHVzZWQgdG8gcHJvY2VzcyBob3N0IGJpbmRpbmdzIGVmZmljaWVudGx5LlxuICAgKlxuICAgKiBTZWUgVklFV19EQVRBLm1kIGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICAgKi9cbiAgZXhwYW5kb0luc3RydWN0aW9uczogRXhwYW5kb0luc3RydWN0aW9uc3xudWxsO1xuXG4gIC8qKlxuICAgKiBGdWxsIHJlZ2lzdHJ5IG9mIGRpcmVjdGl2ZXMgYW5kIGNvbXBvbmVudHMgdGhhdCBtYXkgYmUgZm91bmQgaW4gdGhpcyB2aWV3LlxuICAgKlxuICAgKiBJdCdzIG5lY2Vzc2FyeSB0byBrZWVwIGEgY29weSBvZiB0aGUgZnVsbCBkZWYgbGlzdCBvbiB0aGUgVFZpZXcgc28gaXQncyBwb3NzaWJsZVxuICAgKiB0byByZW5kZXIgdGVtcGxhdGUgZnVuY3Rpb25zIHdpdGhvdXQgYSBob3N0IGNvbXBvbmVudC5cbiAgICovXG4gIGRpcmVjdGl2ZVJlZ2lzdHJ5OiBEaXJlY3RpdmVEZWZMaXN0fG51bGw7XG5cbiAgLyoqXG4gICAqIEZ1bGwgcmVnaXN0cnkgb2YgcGlwZXMgdGhhdCBtYXkgYmUgZm91bmQgaW4gdGhpcyB2aWV3LlxuICAgKlxuICAgKiBUaGUgcHJvcGVydHkgaXMgZWl0aGVyIGFuIGFycmF5IG9mIGBQaXBlRGVmc2BzIG9yIGEgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyB0aGUgYXJyYXkgb2ZcbiAgICogYFBpcGVEZWZzYHMuIFRoZSBmdW5jdGlvbiBpcyBuZWNlc3NhcnkgdG8gYmUgYWJsZSB0byBzdXBwb3J0IGZvcndhcmQgZGVjbGFyYXRpb25zLlxuICAgKlxuICAgKiBJdCdzIG5lY2Vzc2FyeSB0byBrZWVwIGEgY29weSBvZiB0aGUgZnVsbCBkZWYgbGlzdCBvbiB0aGUgVFZpZXcgc28gaXQncyBwb3NzaWJsZVxuICAgKiB0byByZW5kZXIgdGVtcGxhdGUgZnVuY3Rpb25zIHdpdGhvdXQgYSBob3N0IGNvbXBvbmVudC5cbiAgICovXG4gIHBpcGVSZWdpc3RyeTogUGlwZURlZkxpc3R8bnVsbDtcblxuICAvKipcbiAgICogQXJyYXkgb2YgbmdPbkluaXQsIG5nT25DaGFuZ2VzIGFuZCBuZ0RvQ2hlY2sgaG9va3MgdGhhdCBzaG91bGQgYmUgZXhlY3V0ZWQgZm9yIHRoaXMgdmlldyBpblxuICAgKiBjcmVhdGlvbiBtb2RlLlxuICAgKlxuICAgKiBFdmVuIGluZGljZXM6IERpcmVjdGl2ZSBpbmRleFxuICAgKiBPZGQgaW5kaWNlczogSG9vayBmdW5jdGlvblxuICAgKi9cbiAgcHJlT3JkZXJIb29rczogSG9va0RhdGF8bnVsbDtcblxuICAvKipcbiAgICogQXJyYXkgb2YgbmdPbkNoYW5nZXMgYW5kIG5nRG9DaGVjayBob29rcyB0aGF0IHNob3VsZCBiZSBleGVjdXRlZCBmb3IgdGhpcyB2aWV3IGluIHVwZGF0ZSBtb2RlLlxuICAgKlxuICAgKiBFdmVuIGluZGljZXM6IERpcmVjdGl2ZSBpbmRleFxuICAgKiBPZGQgaW5kaWNlczogSG9vayBmdW5jdGlvblxuICAgKi9cbiAgcHJlT3JkZXJDaGVja0hvb2tzOiBIb29rRGF0YXxudWxsO1xuXG4gIC8qKlxuICAgKiBBcnJheSBvZiBuZ0FmdGVyQ29udGVudEluaXQgYW5kIG5nQWZ0ZXJDb250ZW50Q2hlY2tlZCBob29rcyB0aGF0IHNob3VsZCBiZSBleGVjdXRlZFxuICAgKiBmb3IgdGhpcyB2aWV3IGluIGNyZWF0aW9uIG1vZGUuXG4gICAqXG4gICAqIEV2ZW4gaW5kaWNlczogRGlyZWN0aXZlIGluZGV4XG4gICAqIE9kZCBpbmRpY2VzOiBIb29rIGZ1bmN0aW9uXG4gICAqL1xuICBjb250ZW50SG9va3M6IEhvb2tEYXRhfG51bGw7XG5cbiAgLyoqXG4gICAqIEFycmF5IG9mIG5nQWZ0ZXJDb250ZW50Q2hlY2tlZCBob29rcyB0aGF0IHNob3VsZCBiZSBleGVjdXRlZCBmb3IgdGhpcyB2aWV3IGluIHVwZGF0ZVxuICAgKiBtb2RlLlxuICAgKlxuICAgKiBFdmVuIGluZGljZXM6IERpcmVjdGl2ZSBpbmRleFxuICAgKiBPZGQgaW5kaWNlczogSG9vayBmdW5jdGlvblxuICAgKi9cbiAgY29udGVudENoZWNrSG9va3M6IEhvb2tEYXRhfG51bGw7XG5cbiAgLyoqXG4gICAqIEFycmF5IG9mIG5nQWZ0ZXJWaWV3SW5pdCBhbmQgbmdBZnRlclZpZXdDaGVja2VkIGhvb2tzIHRoYXQgc2hvdWxkIGJlIGV4ZWN1dGVkIGZvclxuICAgKiB0aGlzIHZpZXcgaW4gY3JlYXRpb24gbW9kZS5cbiAgICpcbiAgICogRXZlbiBpbmRpY2VzOiBEaXJlY3RpdmUgaW5kZXhcbiAgICogT2RkIGluZGljZXM6IEhvb2sgZnVuY3Rpb25cbiAgICovXG4gIHZpZXdIb29rczogSG9va0RhdGF8bnVsbDtcblxuICAvKipcbiAgICogQXJyYXkgb2YgbmdBZnRlclZpZXdDaGVja2VkIGhvb2tzIHRoYXQgc2hvdWxkIGJlIGV4ZWN1dGVkIGZvciB0aGlzIHZpZXcgaW5cbiAgICogdXBkYXRlIG1vZGUuXG4gICAqXG4gICAqIEV2ZW4gaW5kaWNlczogRGlyZWN0aXZlIGluZGV4XG4gICAqIE9kZCBpbmRpY2VzOiBIb29rIGZ1bmN0aW9uXG4gICAqL1xuICB2aWV3Q2hlY2tIb29rczogSG9va0RhdGF8bnVsbDtcblxuICAvKipcbiAgICogQXJyYXkgb2YgbmdPbkRlc3Ryb3kgaG9va3MgdGhhdCBzaG91bGQgYmUgZXhlY3V0ZWQgd2hlbiB0aGlzIHZpZXcgaXMgZGVzdHJveWVkLlxuICAgKlxuICAgKiBFdmVuIGluZGljZXM6IERpcmVjdGl2ZSBpbmRleFxuICAgKiBPZGQgaW5kaWNlczogSG9vayBmdW5jdGlvblxuICAgKi9cbiAgZGVzdHJveUhvb2tzOiBIb29rRGF0YXxudWxsO1xuXG4gIC8qKlxuICAgKiBXaGVuIGEgdmlldyBpcyBkZXN0cm95ZWQsIGxpc3RlbmVycyBuZWVkIHRvIGJlIHJlbGVhc2VkIGFuZCBvdXRwdXRzIG5lZWQgdG8gYmVcbiAgICogdW5zdWJzY3JpYmVkLiBUaGlzIGNsZWFudXAgYXJyYXkgc3RvcmVzIGJvdGggbGlzdGVuZXIgZGF0YSAoaW4gY2h1bmtzIG9mIDQpXG4gICAqIGFuZCBvdXRwdXQgZGF0YSAoaW4gY2h1bmtzIG9mIDIpIGZvciBhIHBhcnRpY3VsYXIgdmlldy4gQ29tYmluaW5nIHRoZSBhcnJheXNcbiAgICogc2F2ZXMgb24gbWVtb3J5ICg3MCBieXRlcyBwZXIgYXJyYXkpIGFuZCBvbiBhIGZldyBieXRlcyBvZiBjb2RlIHNpemUgKGZvciB0d29cbiAgICogc2VwYXJhdGUgZm9yIGxvb3BzKS5cbiAgICpcbiAgICogSWYgaXQncyBhIG5hdGl2ZSBET00gbGlzdGVuZXIgb3Igb3V0cHV0IHN1YnNjcmlwdGlvbiBiZWluZyBzdG9yZWQ6XG4gICAqIDFzdCBpbmRleCBpczogZXZlbnQgbmFtZSAgYG5hbWUgPSB0Vmlldy5jbGVhbnVwW2krMF1gXG4gICAqIDJuZCBpbmRleCBpczogaW5kZXggb2YgbmF0aXZlIGVsZW1lbnQgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHJpZXZlcyBnbG9iYWwgdGFyZ2V0ICh3aW5kb3csXG4gICAqICAgICAgICAgICAgICAgZG9jdW1lbnQgb3IgYm9keSkgcmVmZXJlbmNlIGJhc2VkIG9uIHRoZSBuYXRpdmUgZWxlbWVudDpcbiAgICogICAgYHR5cGVvZiBpZHhPclRhcmdldEdldHRlciA9PT0gJ2Z1bmN0aW9uJ2A6IGdsb2JhbCB0YXJnZXQgZ2V0dGVyIGZ1bmN0aW9uXG4gICAqICAgIGB0eXBlb2YgaWR4T3JUYXJnZXRHZXR0ZXIgPT09ICdudW1iZXInYDogaW5kZXggb2YgbmF0aXZlIGVsZW1lbnRcbiAgICpcbiAgICogM3JkIGluZGV4IGlzOiBpbmRleCBvZiBsaXN0ZW5lciBmdW5jdGlvbiBgbGlzdGVuZXIgPSBsVmlld1tDTEVBTlVQXVt0Vmlldy5jbGVhbnVwW2krMl1dYFxuICAgKiA0dGggaW5kZXggaXM6IGB1c2VDYXB0dXJlT3JJbmR4ID0gdFZpZXcuY2xlYW51cFtpKzNdYFxuICAgKiAgICBgdHlwZW9mIHVzZUNhcHR1cmVPckluZHggPT0gJ2Jvb2xlYW4nIDogdXNlQ2FwdHVyZSBib29sZWFuXG4gICAqICAgIGB0eXBlb2YgdXNlQ2FwdHVyZU9ySW5keCA9PSAnbnVtYmVyJzpcbiAgICogICAgICAgICBgdXNlQ2FwdHVyZU9ySW5keCA+PSAwYCBgcmVtb3ZlTGlzdGVuZXIgPSBMVmlld1tDTEVBTlVQXVt1c2VDYXB0dXJlT3JJbmR4XWBcbiAgICogICAgICAgICBgdXNlQ2FwdHVyZU9ySW5keCA8ICAwYCBgc3Vic2NyaXB0aW9uID0gTFZpZXdbQ0xFQU5VUF1bLXVzZUNhcHR1cmVPckluZHhdYFxuICAgKlxuICAgKiBJZiBpdCdzIGFuIG91dHB1dCBzdWJzY3JpcHRpb24gb3IgcXVlcnkgbGlzdCBkZXN0cm95IGhvb2s6XG4gICAqIDFzdCBpbmRleCBpczogb3V0cHV0IHVuc3Vic2NyaWJlIGZ1bmN0aW9uIC8gcXVlcnkgbGlzdCBkZXN0cm95IGZ1bmN0aW9uXG4gICAqIDJuZCBpbmRleCBpczogaW5kZXggb2YgZnVuY3Rpb24gY29udGV4dCBpbiBMVmlldy5jbGVhbnVwSW5zdGFuY2VzW11cbiAgICogICAgICAgICAgICAgICBgdFZpZXcuY2xlYW51cFtpKzBdLmNhbGwobFZpZXdbQ0xFQU5VUF1bdFZpZXcuY2xlYW51cFtpKzFdXSlgXG4gICAqL1xuICBjbGVhbnVwOiBhbnlbXXxudWxsO1xuXG4gIC8qKlxuICAgKiBBIGxpc3Qgb2YgZWxlbWVudCBpbmRpY2VzIGZvciBjaGlsZCBjb21wb25lbnRzIHRoYXQgd2lsbCBuZWVkIHRvIGJlXG4gICAqIHJlZnJlc2hlZCB3aGVuIHRoZSBjdXJyZW50IHZpZXcgaGFzIGZpbmlzaGVkIGl0cyBjaGVjay4gVGhlc2UgaW5kaWNlcyBoYXZlXG4gICAqIGFscmVhZHkgYmVlbiBhZGp1c3RlZCBmb3IgdGhlIEhFQURFUl9PRkZTRVQuXG4gICAqXG4gICAqL1xuICBjb21wb25lbnRzOiBudW1iZXJbXXxudWxsO1xuXG4gIC8qKlxuICAgKiBBIGxpc3Qgb2YgaW5kaWNlcyBmb3IgY2hpbGQgZGlyZWN0aXZlcyB0aGF0IGhhdmUgY29udGVudCBxdWVyaWVzLlxuICAgKi9cbiAgY29udGVudFF1ZXJpZXM6IG51bWJlcltdfG51bGw7XG5cbiAgLyoqXG4gICAqIFNldCBvZiBzY2hlbWFzIHRoYXQgZGVjbGFyZSBlbGVtZW50cyB0byBiZSBhbGxvd2VkIGluc2lkZSB0aGUgdmlldy5cbiAgICovXG4gIHNjaGVtYXM6IFNjaGVtYU1ldGFkYXRhW118bnVsbDtcbn1cblxuZXhwb3J0IGNvbnN0IGVudW0gUm9vdENvbnRleHRGbGFncyB7RW1wdHkgPSAwYjAwLCBEZXRlY3RDaGFuZ2VzID0gMGIwMSwgRmx1c2hQbGF5ZXJzID0gMGIxMH1cblxuXG4vKipcbiAqIFJvb3RDb250ZXh0IGNvbnRhaW5zIGluZm9ybWF0aW9uIHdoaWNoIGlzIHNoYXJlZCBmb3IgYWxsIGNvbXBvbmVudHMgd2hpY2hcbiAqIHdlcmUgYm9vdHN0cmFwcGVkIHdpdGgge0BsaW5rIHJlbmRlckNvbXBvbmVudH0uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUm9vdENvbnRleHQge1xuICAvKipcbiAgICogQSBmdW5jdGlvbiB1c2VkIGZvciBzY2hlZHVsaW5nIGNoYW5nZSBkZXRlY3Rpb24gaW4gdGhlIGZ1dHVyZS4gVXN1YWxseVxuICAgKiB0aGlzIGlzIGByZXF1ZXN0QW5pbWF0aW9uRnJhbWVgLlxuICAgKi9cbiAgc2NoZWR1bGVyOiAod29ya0ZuOiAoKSA9PiB2b2lkKSA9PiB2b2lkO1xuXG4gIC8qKlxuICAgKiBBIHByb21pc2Ugd2hpY2ggaXMgcmVzb2x2ZWQgd2hlbiBhbGwgY29tcG9uZW50cyBhcmUgY29uc2lkZXJlZCBjbGVhbiAobm90IGRpcnR5KS5cbiAgICpcbiAgICogVGhpcyBwcm9taXNlIGlzIG92ZXJ3cml0dGVuIGV2ZXJ5IHRpbWUgYSBmaXJzdCBjYWxsIHRvIHtAbGluayBtYXJrRGlydHl9IGlzIGludm9rZWQuXG4gICAqL1xuICBjbGVhbjogUHJvbWlzZTxudWxsPjtcblxuICAvKipcbiAgICogUm9vdENvbXBvbmVudHMgLSBUaGUgY29tcG9uZW50cyB0aGF0IHdlcmUgaW5zdGFudGlhdGVkIGJ5IHRoZSBjYWxsIHRvXG4gICAqIHtAbGluayByZW5kZXJDb21wb25lbnR9LlxuICAgKi9cbiAgY29tcG9uZW50czoge31bXTtcblxuICAvKipcbiAgICogVGhlIHBsYXllciBmbHVzaGluZyBoYW5kbGVyIHRvIGtpY2sgb2ZmIGFsbCBhbmltYXRpb25zXG4gICAqL1xuICBwbGF5ZXJIYW5kbGVyOiBQbGF5ZXJIYW5kbGVyfG51bGw7XG5cbiAgLyoqXG4gICAqIFdoYXQgcmVuZGVyLXJlbGF0ZWQgb3BlcmF0aW9ucyB0byBydW4gb25jZSBhIHNjaGVkdWxlciBoYXMgYmVlbiBzZXRcbiAgICovXG4gIGZsYWdzOiBSb290Q29udGV4dEZsYWdzO1xufVxuXG4vKipcbiAqIEFycmF5IG9mIGhvb2tzIHRoYXQgc2hvdWxkIGJlIGV4ZWN1dGVkIGZvciBhIHZpZXcgYW5kIHRoZWlyIGRpcmVjdGl2ZSBpbmRpY2VzLlxuICpcbiAqIEZvciBlYWNoIG5vZGUgb2YgdGhlIHZpZXcsIHRoZSBmb2xsb3dpbmcgZGF0YSBpcyBzdG9yZWQ6XG4gKiAxKSBOb2RlIGluZGV4IChvcHRpb25hbClcbiAqIDIpIEEgc2VyaWVzIG9mIG51bWJlci9mdW5jdGlvbiBwYWlycyB3aGVyZTpcbiAqICAtIGV2ZW4gaW5kaWNlcyBhcmUgZGlyZWN0aXZlIGluZGljZXNcbiAqICAtIG9kZCBpbmRpY2VzIGFyZSBob29rIGZ1bmN0aW9uc1xuICpcbiAqIFNwZWNpYWwgY2FzZXM6XG4gKiAgLSBhIG5lZ2F0aXZlIGRpcmVjdGl2ZSBpbmRleCBmbGFncyBhbiBpbml0IGhvb2sgKG5nT25Jbml0LCBuZ0FmdGVyQ29udGVudEluaXQsIG5nQWZ0ZXJWaWV3SW5pdClcbiAqL1xuZXhwb3J0IHR5cGUgSG9va0RhdGEgPSAobnVtYmVyIHwgKCgpID0+IHZvaWQpKVtdO1xuXG4vKipcbiAqIFN0YXRpYyBkYXRhIHRoYXQgY29ycmVzcG9uZHMgdG8gdGhlIGluc3RhbmNlLXNwZWNpZmljIGRhdGEgYXJyYXkgb24gYW4gTFZpZXcuXG4gKlxuICogRWFjaCBub2RlJ3Mgc3RhdGljIGRhdGEgaXMgc3RvcmVkIGluIHREYXRhIGF0IHRoZSBzYW1lIGluZGV4IHRoYXQgaXQncyBzdG9yZWRcbiAqIGluIHRoZSBkYXRhIGFycmF5LiAgQW55IG5vZGVzIHRoYXQgZG8gbm90IGhhdmUgc3RhdGljIGRhdGEgc3RvcmUgYSBudWxsIHZhbHVlIGluXG4gKiB0RGF0YSB0byBhdm9pZCBhIHNwYXJzZSBhcnJheS5cbiAqXG4gKiBFYWNoIHBpcGUncyBkZWZpbml0aW9uIGlzIHN0b3JlZCBoZXJlIGF0IHRoZSBzYW1lIGluZGV4IGFzIGl0cyBwaXBlIGluc3RhbmNlIGluXG4gKiB0aGUgZGF0YSBhcnJheS5cbiAqXG4gKiBFYWNoIGhvc3QgcHJvcGVydHkncyBuYW1lIGlzIHN0b3JlZCBoZXJlIGF0IHRoZSBzYW1lIGluZGV4IGFzIGl0cyB2YWx1ZSBpbiB0aGVcbiAqIGRhdGEgYXJyYXkuXG4gKlxuICogRWFjaCBwcm9wZXJ0eSBiaW5kaW5nIG5hbWUgaXMgc3RvcmVkIGhlcmUgYXQgdGhlIHNhbWUgaW5kZXggYXMgaXRzIHZhbHVlIGluXG4gKiB0aGUgZGF0YSBhcnJheS4gSWYgdGhlIGJpbmRpbmcgaXMgYW4gaW50ZXJwb2xhdGlvbiwgdGhlIHN0YXRpYyBzdHJpbmcgdmFsdWVzXG4gKiBhcmUgc3RvcmVkIHBhcmFsbGVsIHRvIHRoZSBkeW5hbWljIHZhbHVlcy4gRXhhbXBsZTpcbiAqXG4gKiBpZD1cInByZWZpeCB7eyB2MCB9fSBhIHt7IHYxIH19IGIge3sgdjIgfX0gc3VmZml4XCJcbiAqXG4gKiBMVmlldyAgICAgICB8ICAgVFZpZXcuZGF0YVxuICotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqICB2MCB2YWx1ZSAgIHwgICAnYSdcbiAqICB2MSB2YWx1ZSAgIHwgICAnYidcbiAqICB2MiB2YWx1ZSAgIHwgICBpZCDvv70gcHJlZml4IO+/vSBzdWZmaXhcbiAqXG4gKiBJbmplY3RvciBibG9vbSBmaWx0ZXJzIGFyZSBhbHNvIHN0b3JlZCBoZXJlLlxuICovXG5leHBvcnQgdHlwZSBURGF0YSA9XG4gICAgKFROb2RlIHwgUGlwZURlZjxhbnk+fCBEaXJlY3RpdmVEZWY8YW55PnwgQ29tcG9uZW50RGVmPGFueT58IG51bWJlciB8IFR5cGU8YW55PnxcbiAgICAgSW5qZWN0aW9uVG9rZW48YW55PnwgVEkxOG4gfCBJMThuVXBkYXRlT3BDb2RlcyB8IG51bGwgfCBzdHJpbmcpW107XG5cbi8vIE5vdGU6IFRoaXMgaGFjayBpcyBuZWNlc3Nhcnkgc28gd2UgZG9uJ3QgZXJyb25lb3VzbHkgZ2V0IGEgY2lyY3VsYXIgZGVwZW5kZW5jeVxuLy8gZmFpbHVyZSBiYXNlZCBvbiB0eXBlcy5cbmV4cG9ydCBjb25zdCB1bnVzZWRWYWx1ZUV4cG9ydFRvUGxhY2F0ZUFqZCA9IDE7XG4iXX0=