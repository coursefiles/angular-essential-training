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
import { assertDefined, assertEqual } from '../../util/assert';
import { assertLContainerOrUndefined } from '../assert';
import { ACTIVE_INDEX, VIEWS } from '../interfaces/container';
import { FLAGS, PARENT, QUERIES, TVIEW, T_HOST } from '../interfaces/view';
import { assertNodeType } from '../node_assert';
import { insertView, removeView } from '../node_manipulation';
import { enterView, getIsParent, getLView, getPreviousOrParentTNode, isCreationMode, leaveView, setIsParent, setPreviousOrParentTNode } from '../state';
import { resetPreOrderHookFlags } from '../util/view_utils';
import { assignTViewNodeToLView, createLView, createTView, refreshDescendantViews } from './shared';
/**
 * Marks the start of an embedded view.
 *
 * \@codeGenApi
 * @param {?} viewBlockId The ID of this view
 * @param {?} consts
 * @param {?} vars
 * @return {?} boolean Whether or not this view is in creation mode
 *
 */
export function ɵɵembeddedViewStart(viewBlockId, consts, vars) {
    /** @type {?} */
    const lView = getLView();
    /** @type {?} */
    const previousOrParentTNode = getPreviousOrParentTNode();
    // The previous node can be a view node if we are processing an inline for loop
    /** @type {?} */
    const containerTNode = previousOrParentTNode.type === 2 /* View */ ?
        (/** @type {?} */ (previousOrParentTNode.parent)) :
        previousOrParentTNode;
    /** @type {?} */
    const lContainer = (/** @type {?} */ (lView[containerTNode.index]));
    ngDevMode && assertNodeType(containerTNode, 0 /* Container */);
    /** @type {?} */
    let viewToRender = scanForView(lContainer, (/** @type {?} */ (lContainer[ACTIVE_INDEX])), viewBlockId);
    if (viewToRender) {
        setIsParent(true);
        enterView(viewToRender, viewToRender[TVIEW].node);
    }
    else {
        // When we create a new LView, we always reset the state of the instructions.
        viewToRender = createLView(lView, getOrCreateEmbeddedTView(viewBlockId, consts, vars, (/** @type {?} */ (containerTNode))), null, 16 /* CheckAlways */, null, null);
        if (lContainer[QUERIES]) {
            viewToRender[QUERIES] = (/** @type {?} */ (lContainer[QUERIES])).createView();
        }
        /** @type {?} */
        const tParentNode = getIsParent() ? previousOrParentTNode :
            previousOrParentTNode && previousOrParentTNode.parent;
        assignTViewNodeToLView(viewToRender[TVIEW], tParentNode, viewBlockId, viewToRender);
        enterView(viewToRender, viewToRender[TVIEW].node);
    }
    if (lContainer) {
        if (isCreationMode(viewToRender)) {
            // it is a new view, insert it into collection of views for a given container
            insertView(viewToRender, lContainer, (/** @type {?} */ (lContainer[ACTIVE_INDEX])));
        }
        (/** @type {?} */ (lContainer[ACTIVE_INDEX]))++;
    }
    return isCreationMode(viewToRender) ? 1 /* Create */ | 2 /* Update */ :
        2 /* Update */;
}
/**
 * Initialize the TView (e.g. static data) for the active embedded view.
 *
 * Each embedded view block must create or retrieve its own TView. Otherwise, the embedded view's
 * static data for a particular node would overwrite the static data for a node in the view above
 * it with the same index (since it's in the same template).
 *
 * @param {?} viewIndex The index of the TView in TNode.tViews
 * @param {?} consts The number of nodes, local refs, and pipes in this template
 * @param {?} vars The number of bindings and pure function bindings in this template
 * @param {?} parent
 * @return {?} TView
 */
function getOrCreateEmbeddedTView(viewIndex, consts, vars, parent) {
    /** @type {?} */
    const tView = getLView()[TVIEW];
    ngDevMode && assertNodeType(parent, 0 /* Container */);
    /** @type {?} */
    const containerTViews = (/** @type {?} */ (parent.tViews));
    ngDevMode && assertDefined(containerTViews, 'TView expected');
    ngDevMode && assertEqual(Array.isArray(containerTViews), true, 'TViews should be in an array');
    if (viewIndex >= containerTViews.length || containerTViews[viewIndex] == null) {
        containerTViews[viewIndex] = createTView(viewIndex, null, consts, vars, tView.directiveRegistry, tView.pipeRegistry, null, null);
    }
    return containerTViews[viewIndex];
}
/**
 * Looks for a view with a given view block id inside a provided LContainer.
 * Removes views that need to be deleted in the process.
 *
 * @param {?} lContainer to search for views
 * @param {?} startIdx starting index in the views array to search from
 * @param {?} viewBlockId exact view block id to look for
 * @return {?} index of a found view or -1 if not found
 */
function scanForView(lContainer, startIdx, viewBlockId) {
    /** @type {?} */
    const views = lContainer[VIEWS];
    for (let i = startIdx; i < views.length; i++) {
        /** @type {?} */
        const viewAtPositionId = views[i][TVIEW].id;
        if (viewAtPositionId === viewBlockId) {
            return views[i];
        }
        else if (viewAtPositionId < viewBlockId) {
            // found a view that should not be at this position - remove
            removeView(lContainer, i);
        }
        else {
            // found a view with id greater than the one we are searching for
            // which means that required view doesn't exist and can't be found at
            // later positions in the views array - stop the searchdef.cont here
            break;
        }
    }
    return null;
}
/**
 * Marks the end of an embedded view.
 *
 * \@codeGenApi
 * @return {?}
 */
export function ɵɵembeddedViewEnd() {
    /** @type {?} */
    const lView = getLView();
    /** @type {?} */
    const viewHost = lView[T_HOST];
    if (isCreationMode(lView)) {
        refreshDescendantViews(lView); // creation mode pass
        lView[FLAGS] &= ~4 /* CreationMode */;
    }
    resetPreOrderHookFlags(lView);
    refreshDescendantViews(lView); // update mode pass
    // update mode pass
    /** @type {?} */
    const lContainer = (/** @type {?} */ (lView[PARENT]));
    ngDevMode && assertLContainerOrUndefined(lContainer);
    leaveView((/** @type {?} */ (lContainer[PARENT])));
    setPreviousOrParentTNode((/** @type {?} */ (viewHost)));
    setIsParent(false);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1iZWRkZWRfdmlldy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3JlbmRlcjMvaW5zdHJ1Y3Rpb25zL2VtYmVkZGVkX3ZpZXcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsYUFBYSxFQUFFLFdBQVcsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzdELE9BQU8sRUFBQywyQkFBMkIsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUN0RCxPQUFPLEVBQUMsWUFBWSxFQUFjLEtBQUssRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBR3hFLE9BQU8sRUFBQyxLQUFLLEVBQXFCLE1BQU0sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFTLE1BQU0sRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ25HLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUMsVUFBVSxFQUFFLFVBQVUsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQzVELE9BQU8sRUFBQyxTQUFTLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSx3QkFBd0IsRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSx3QkFBd0IsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUN0SixPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUMxRCxPQUFPLEVBQUMsc0JBQXNCLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxzQkFBc0IsRUFBQyxNQUFNLFVBQVUsQ0FBQzs7Ozs7Ozs7Ozs7QUFVbEcsTUFBTSxVQUFVLG1CQUFtQixDQUMvQixXQUFtQixFQUFFLE1BQWMsRUFBRSxJQUFZOztVQUM3QyxLQUFLLEdBQUcsUUFBUSxFQUFFOztVQUNsQixxQkFBcUIsR0FBRyx3QkFBd0IsRUFBRTs7O1VBRWxELGNBQWMsR0FBRyxxQkFBcUIsQ0FBQyxJQUFJLGlCQUFtQixDQUFDLENBQUM7UUFDbEUsbUJBQUEscUJBQXFCLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUNoQyxxQkFBcUI7O1VBQ25CLFVBQVUsR0FBRyxtQkFBQSxLQUFLLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxFQUFjO0lBRTVELFNBQVMsSUFBSSxjQUFjLENBQUMsY0FBYyxvQkFBc0IsQ0FBQzs7UUFDN0QsWUFBWSxHQUFHLFdBQVcsQ0FBQyxVQUFVLEVBQUUsbUJBQUEsVUFBVSxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsV0FBVyxDQUFDO0lBRW5GLElBQUksWUFBWSxFQUFFO1FBQ2hCLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQixTQUFTLENBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNuRDtTQUFNO1FBQ0wsNkVBQTZFO1FBQzdFLFlBQVksR0FBRyxXQUFXLENBQ3RCLEtBQUssRUFDTCx3QkFBd0IsQ0FBQyxXQUFXLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxtQkFBQSxjQUFjLEVBQWtCLENBQUMsRUFBRSxJQUFJLHdCQUNuRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFeEMsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDdkIsWUFBWSxDQUFDLE9BQU8sQ0FBQyxHQUFHLG1CQUFBLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDO1NBQzVEOztjQUVLLFdBQVcsR0FBRyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQztZQUN2QixxQkFBcUIsSUFBSSxxQkFBcUIsQ0FBQyxNQUFNO1FBQ3pGLHNCQUFzQixDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQ3BGLFNBQVMsQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ25EO0lBQ0QsSUFBSSxVQUFVLEVBQUU7UUFDZCxJQUFJLGNBQWMsQ0FBQyxZQUFZLENBQUMsRUFBRTtZQUNoQyw2RUFBNkU7WUFDN0UsVUFBVSxDQUFDLFlBQVksRUFBRSxVQUFVLEVBQUUsbUJBQUEsVUFBVSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNsRTtRQUNELG1CQUFBLFVBQVUsQ0FBQyxZQUFZLENBQUMsRUFBRSxFQUFFLENBQUM7S0FDOUI7SUFDRCxPQUFPLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsK0JBQXVDLENBQUMsQ0FBQztzQkFDdkIsQ0FBQztBQUMzRCxDQUFDOzs7Ozs7Ozs7Ozs7OztBQWVELFNBQVMsd0JBQXdCLENBQzdCLFNBQWlCLEVBQUUsTUFBYyxFQUFFLElBQVksRUFBRSxNQUFzQjs7VUFDbkUsS0FBSyxHQUFHLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQztJQUMvQixTQUFTLElBQUksY0FBYyxDQUFDLE1BQU0sb0JBQXNCLENBQUM7O1VBQ25ELGVBQWUsR0FBRyxtQkFBQSxNQUFNLENBQUMsTUFBTSxFQUFXO0lBQ2hELFNBQVMsSUFBSSxhQUFhLENBQUMsZUFBZSxFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDOUQsU0FBUyxJQUFJLFdBQVcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxFQUFFLElBQUksRUFBRSw4QkFBOEIsQ0FBQyxDQUFDO0lBQy9GLElBQUksU0FBUyxJQUFJLGVBQWUsQ0FBQyxNQUFNLElBQUksZUFBZSxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUksRUFBRTtRQUM3RSxlQUFlLENBQUMsU0FBUyxDQUFDLEdBQUcsV0FBVyxDQUNwQyxTQUFTLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxZQUFZLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQzdGO0lBQ0QsT0FBTyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDcEMsQ0FBQzs7Ozs7Ozs7OztBQVlELFNBQVMsV0FBVyxDQUFDLFVBQXNCLEVBQUUsUUFBZ0IsRUFBRSxXQUFtQjs7VUFDMUUsS0FBSyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUM7SUFDL0IsS0FBSyxJQUFJLENBQUMsR0FBRyxRQUFRLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7O2NBQ3RDLGdCQUFnQixHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO1FBQzNDLElBQUksZ0JBQWdCLEtBQUssV0FBVyxFQUFFO1lBQ3BDLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2pCO2FBQU0sSUFBSSxnQkFBZ0IsR0FBRyxXQUFXLEVBQUU7WUFDekMsNERBQTREO1lBQzVELFVBQVUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDM0I7YUFBTTtZQUNMLGlFQUFpRTtZQUNqRSxxRUFBcUU7WUFDckUsb0VBQW9FO1lBQ3BFLE1BQU07U0FDUDtLQUNGO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDOzs7Ozs7O0FBT0QsTUFBTSxVQUFVLGlCQUFpQjs7VUFDekIsS0FBSyxHQUFHLFFBQVEsRUFBRTs7VUFDbEIsUUFBUSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7SUFFOUIsSUFBSSxjQUFjLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDekIsc0JBQXNCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBRSxxQkFBcUI7UUFDckQsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLHFCQUF3QixDQUFDO0tBQzFDO0lBQ0Qsc0JBQXNCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUIsc0JBQXNCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBRSxtQkFBbUI7OztVQUM3QyxVQUFVLEdBQUcsbUJBQUEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFjO0lBQzlDLFNBQVMsSUFBSSwyQkFBMkIsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNyRCxTQUFTLENBQUMsbUJBQUEsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNoQyx3QkFBd0IsQ0FBQyxtQkFBQSxRQUFRLEVBQUUsQ0FBQyxDQUFDO0lBQ3JDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNyQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2Fzc2VydERlZmluZWQsIGFzc2VydEVxdWFsfSBmcm9tICcuLi8uLi91dGlsL2Fzc2VydCc7XG5pbXBvcnQge2Fzc2VydExDb250YWluZXJPclVuZGVmaW5lZH0gZnJvbSAnLi4vYXNzZXJ0JztcbmltcG9ydCB7QUNUSVZFX0lOREVYLCBMQ29udGFpbmVyLCBWSUVXU30gZnJvbSAnLi4vaW50ZXJmYWNlcy9jb250YWluZXInO1xuaW1wb3J0IHtSZW5kZXJGbGFnc30gZnJvbSAnLi4vaW50ZXJmYWNlcy9kZWZpbml0aW9uJztcbmltcG9ydCB7VENvbnRhaW5lck5vZGUsIFROb2RlVHlwZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9ub2RlJztcbmltcG9ydCB7RkxBR1MsIExWaWV3LCBMVmlld0ZsYWdzLCBQQVJFTlQsIFFVRVJJRVMsIFRWSUVXLCBUVmlldywgVF9IT1NUfSBmcm9tICcuLi9pbnRlcmZhY2VzL3ZpZXcnO1xuaW1wb3J0IHthc3NlcnROb2RlVHlwZX0gZnJvbSAnLi4vbm9kZV9hc3NlcnQnO1xuaW1wb3J0IHtpbnNlcnRWaWV3LCByZW1vdmVWaWV3fSBmcm9tICcuLi9ub2RlX21hbmlwdWxhdGlvbic7XG5pbXBvcnQge2VudGVyVmlldywgZ2V0SXNQYXJlbnQsIGdldExWaWV3LCBnZXRQcmV2aW91c09yUGFyZW50VE5vZGUsIGlzQ3JlYXRpb25Nb2RlLCBsZWF2ZVZpZXcsIHNldElzUGFyZW50LCBzZXRQcmV2aW91c09yUGFyZW50VE5vZGV9IGZyb20gJy4uL3N0YXRlJztcbmltcG9ydCB7cmVzZXRQcmVPcmRlckhvb2tGbGFnc30gZnJvbSAnLi4vdXRpbC92aWV3X3V0aWxzJztcbmltcG9ydCB7YXNzaWduVFZpZXdOb2RlVG9MVmlldywgY3JlYXRlTFZpZXcsIGNyZWF0ZVRWaWV3LCByZWZyZXNoRGVzY2VuZGFudFZpZXdzfSBmcm9tICcuL3NoYXJlZCc7XG5cbi8qKlxuICogTWFya3MgdGhlIHN0YXJ0IG9mIGFuIGVtYmVkZGVkIHZpZXcuXG4gKlxuICogQHBhcmFtIHZpZXdCbG9ja0lkIFRoZSBJRCBvZiB0aGlzIHZpZXdcbiAqIEByZXR1cm4gYm9vbGVhbiBXaGV0aGVyIG9yIG5vdCB0aGlzIHZpZXcgaXMgaW4gY3JlYXRpb24gbW9kZVxuICpcbiAqIEBjb2RlR2VuQXBpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiDJtcm1ZW1iZWRkZWRWaWV3U3RhcnQoXG4gICAgdmlld0Jsb2NrSWQ6IG51bWJlciwgY29uc3RzOiBudW1iZXIsIHZhcnM6IG51bWJlcik6IFJlbmRlckZsYWdzIHtcbiAgY29uc3QgbFZpZXcgPSBnZXRMVmlldygpO1xuICBjb25zdCBwcmV2aW91c09yUGFyZW50VE5vZGUgPSBnZXRQcmV2aW91c09yUGFyZW50VE5vZGUoKTtcbiAgLy8gVGhlIHByZXZpb3VzIG5vZGUgY2FuIGJlIGEgdmlldyBub2RlIGlmIHdlIGFyZSBwcm9jZXNzaW5nIGFuIGlubGluZSBmb3IgbG9vcFxuICBjb25zdCBjb250YWluZXJUTm9kZSA9IHByZXZpb3VzT3JQYXJlbnRUTm9kZS50eXBlID09PSBUTm9kZVR5cGUuVmlldyA/XG4gICAgICBwcmV2aW91c09yUGFyZW50VE5vZGUucGFyZW50ICEgOlxuICAgICAgcHJldmlvdXNPclBhcmVudFROb2RlO1xuICBjb25zdCBsQ29udGFpbmVyID0gbFZpZXdbY29udGFpbmVyVE5vZGUuaW5kZXhdIGFzIExDb250YWluZXI7XG5cbiAgbmdEZXZNb2RlICYmIGFzc2VydE5vZGVUeXBlKGNvbnRhaW5lclROb2RlLCBUTm9kZVR5cGUuQ29udGFpbmVyKTtcbiAgbGV0IHZpZXdUb1JlbmRlciA9IHNjYW5Gb3JWaWV3KGxDb250YWluZXIsIGxDb250YWluZXJbQUNUSVZFX0lOREVYXSAhLCB2aWV3QmxvY2tJZCk7XG5cbiAgaWYgKHZpZXdUb1JlbmRlcikge1xuICAgIHNldElzUGFyZW50KHRydWUpO1xuICAgIGVudGVyVmlldyh2aWV3VG9SZW5kZXIsIHZpZXdUb1JlbmRlcltUVklFV10ubm9kZSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gV2hlbiB3ZSBjcmVhdGUgYSBuZXcgTFZpZXcsIHdlIGFsd2F5cyByZXNldCB0aGUgc3RhdGUgb2YgdGhlIGluc3RydWN0aW9ucy5cbiAgICB2aWV3VG9SZW5kZXIgPSBjcmVhdGVMVmlldyhcbiAgICAgICAgbFZpZXcsXG4gICAgICAgIGdldE9yQ3JlYXRlRW1iZWRkZWRUVmlldyh2aWV3QmxvY2tJZCwgY29uc3RzLCB2YXJzLCBjb250YWluZXJUTm9kZSBhcyBUQ29udGFpbmVyTm9kZSksIG51bGwsXG4gICAgICAgIExWaWV3RmxhZ3MuQ2hlY2tBbHdheXMsIG51bGwsIG51bGwpO1xuXG4gICAgaWYgKGxDb250YWluZXJbUVVFUklFU10pIHtcbiAgICAgIHZpZXdUb1JlbmRlcltRVUVSSUVTXSA9IGxDb250YWluZXJbUVVFUklFU10gIS5jcmVhdGVWaWV3KCk7XG4gICAgfVxuXG4gICAgY29uc3QgdFBhcmVudE5vZGUgPSBnZXRJc1BhcmVudCgpID8gcHJldmlvdXNPclBhcmVudFROb2RlIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2aW91c09yUGFyZW50VE5vZGUgJiYgcHJldmlvdXNPclBhcmVudFROb2RlLnBhcmVudDtcbiAgICBhc3NpZ25UVmlld05vZGVUb0xWaWV3KHZpZXdUb1JlbmRlcltUVklFV10sIHRQYXJlbnROb2RlLCB2aWV3QmxvY2tJZCwgdmlld1RvUmVuZGVyKTtcbiAgICBlbnRlclZpZXcodmlld1RvUmVuZGVyLCB2aWV3VG9SZW5kZXJbVFZJRVddLm5vZGUpO1xuICB9XG4gIGlmIChsQ29udGFpbmVyKSB7XG4gICAgaWYgKGlzQ3JlYXRpb25Nb2RlKHZpZXdUb1JlbmRlcikpIHtcbiAgICAgIC8vIGl0IGlzIGEgbmV3IHZpZXcsIGluc2VydCBpdCBpbnRvIGNvbGxlY3Rpb24gb2Ygdmlld3MgZm9yIGEgZ2l2ZW4gY29udGFpbmVyXG4gICAgICBpbnNlcnRWaWV3KHZpZXdUb1JlbmRlciwgbENvbnRhaW5lciwgbENvbnRhaW5lcltBQ1RJVkVfSU5ERVhdICEpO1xuICAgIH1cbiAgICBsQ29udGFpbmVyW0FDVElWRV9JTkRFWF0gISsrO1xuICB9XG4gIHJldHVybiBpc0NyZWF0aW9uTW9kZSh2aWV3VG9SZW5kZXIpID8gUmVuZGVyRmxhZ3MuQ3JlYXRlIHwgUmVuZGVyRmxhZ3MuVXBkYXRlIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZW5kZXJGbGFncy5VcGRhdGU7XG59XG5cbi8qKlxuICogSW5pdGlhbGl6ZSB0aGUgVFZpZXcgKGUuZy4gc3RhdGljIGRhdGEpIGZvciB0aGUgYWN0aXZlIGVtYmVkZGVkIHZpZXcuXG4gKlxuICogRWFjaCBlbWJlZGRlZCB2aWV3IGJsb2NrIG11c3QgY3JlYXRlIG9yIHJldHJpZXZlIGl0cyBvd24gVFZpZXcuIE90aGVyd2lzZSwgdGhlIGVtYmVkZGVkIHZpZXcnc1xuICogc3RhdGljIGRhdGEgZm9yIGEgcGFydGljdWxhciBub2RlIHdvdWxkIG92ZXJ3cml0ZSB0aGUgc3RhdGljIGRhdGEgZm9yIGEgbm9kZSBpbiB0aGUgdmlldyBhYm92ZVxuICogaXQgd2l0aCB0aGUgc2FtZSBpbmRleCAoc2luY2UgaXQncyBpbiB0aGUgc2FtZSB0ZW1wbGF0ZSkuXG4gKlxuICogQHBhcmFtIHZpZXdJbmRleCBUaGUgaW5kZXggb2YgdGhlIFRWaWV3IGluIFROb2RlLnRWaWV3c1xuICogQHBhcmFtIGNvbnN0cyBUaGUgbnVtYmVyIG9mIG5vZGVzLCBsb2NhbCByZWZzLCBhbmQgcGlwZXMgaW4gdGhpcyB0ZW1wbGF0ZVxuICogQHBhcmFtIHZhcnMgVGhlIG51bWJlciBvZiBiaW5kaW5ncyBhbmQgcHVyZSBmdW5jdGlvbiBiaW5kaW5ncyBpbiB0aGlzIHRlbXBsYXRlXG4gKiBAcGFyYW0gY29udGFpbmVyIFRoZSBwYXJlbnQgY29udGFpbmVyIGluIHdoaWNoIHRvIGxvb2sgZm9yIHRoZSB2aWV3J3Mgc3RhdGljIGRhdGFcbiAqIEByZXR1cm5zIFRWaWV3XG4gKi9cbmZ1bmN0aW9uIGdldE9yQ3JlYXRlRW1iZWRkZWRUVmlldyhcbiAgICB2aWV3SW5kZXg6IG51bWJlciwgY29uc3RzOiBudW1iZXIsIHZhcnM6IG51bWJlciwgcGFyZW50OiBUQ29udGFpbmVyTm9kZSk6IFRWaWV3IHtcbiAgY29uc3QgdFZpZXcgPSBnZXRMVmlldygpW1RWSUVXXTtcbiAgbmdEZXZNb2RlICYmIGFzc2VydE5vZGVUeXBlKHBhcmVudCwgVE5vZGVUeXBlLkNvbnRhaW5lcik7XG4gIGNvbnN0IGNvbnRhaW5lclRWaWV3cyA9IHBhcmVudC50Vmlld3MgYXMgVFZpZXdbXTtcbiAgbmdEZXZNb2RlICYmIGFzc2VydERlZmluZWQoY29udGFpbmVyVFZpZXdzLCAnVFZpZXcgZXhwZWN0ZWQnKTtcbiAgbmdEZXZNb2RlICYmIGFzc2VydEVxdWFsKEFycmF5LmlzQXJyYXkoY29udGFpbmVyVFZpZXdzKSwgdHJ1ZSwgJ1RWaWV3cyBzaG91bGQgYmUgaW4gYW4gYXJyYXknKTtcbiAgaWYgKHZpZXdJbmRleCA+PSBjb250YWluZXJUVmlld3MubGVuZ3RoIHx8IGNvbnRhaW5lclRWaWV3c1t2aWV3SW5kZXhdID09IG51bGwpIHtcbiAgICBjb250YWluZXJUVmlld3Nbdmlld0luZGV4XSA9IGNyZWF0ZVRWaWV3KFxuICAgICAgICB2aWV3SW5kZXgsIG51bGwsIGNvbnN0cywgdmFycywgdFZpZXcuZGlyZWN0aXZlUmVnaXN0cnksIHRWaWV3LnBpcGVSZWdpc3RyeSwgbnVsbCwgbnVsbCk7XG4gIH1cbiAgcmV0dXJuIGNvbnRhaW5lclRWaWV3c1t2aWV3SW5kZXhdO1xufVxuXG5cbi8qKlxuICogTG9va3MgZm9yIGEgdmlldyB3aXRoIGEgZ2l2ZW4gdmlldyBibG9jayBpZCBpbnNpZGUgYSBwcm92aWRlZCBMQ29udGFpbmVyLlxuICogUmVtb3ZlcyB2aWV3cyB0aGF0IG5lZWQgdG8gYmUgZGVsZXRlZCBpbiB0aGUgcHJvY2Vzcy5cbiAqXG4gKiBAcGFyYW0gbENvbnRhaW5lciB0byBzZWFyY2ggZm9yIHZpZXdzXG4gKiBAcGFyYW0gc3RhcnRJZHggc3RhcnRpbmcgaW5kZXggaW4gdGhlIHZpZXdzIGFycmF5IHRvIHNlYXJjaCBmcm9tXG4gKiBAcGFyYW0gdmlld0Jsb2NrSWQgZXhhY3QgdmlldyBibG9jayBpZCB0byBsb29rIGZvclxuICogQHJldHVybnMgaW5kZXggb2YgYSBmb3VuZCB2aWV3IG9yIC0xIGlmIG5vdCBmb3VuZFxuICovXG5mdW5jdGlvbiBzY2FuRm9yVmlldyhsQ29udGFpbmVyOiBMQ29udGFpbmVyLCBzdGFydElkeDogbnVtYmVyLCB2aWV3QmxvY2tJZDogbnVtYmVyKTogTFZpZXd8bnVsbCB7XG4gIGNvbnN0IHZpZXdzID0gbENvbnRhaW5lcltWSUVXU107XG4gIGZvciAobGV0IGkgPSBzdGFydElkeDsgaSA8IHZpZXdzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3Qgdmlld0F0UG9zaXRpb25JZCA9IHZpZXdzW2ldW1RWSUVXXS5pZDtcbiAgICBpZiAodmlld0F0UG9zaXRpb25JZCA9PT0gdmlld0Jsb2NrSWQpIHtcbiAgICAgIHJldHVybiB2aWV3c1tpXTtcbiAgICB9IGVsc2UgaWYgKHZpZXdBdFBvc2l0aW9uSWQgPCB2aWV3QmxvY2tJZCkge1xuICAgICAgLy8gZm91bmQgYSB2aWV3IHRoYXQgc2hvdWxkIG5vdCBiZSBhdCB0aGlzIHBvc2l0aW9uIC0gcmVtb3ZlXG4gICAgICByZW1vdmVWaWV3KGxDb250YWluZXIsIGkpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBmb3VuZCBhIHZpZXcgd2l0aCBpZCBncmVhdGVyIHRoYW4gdGhlIG9uZSB3ZSBhcmUgc2VhcmNoaW5nIGZvclxuICAgICAgLy8gd2hpY2ggbWVhbnMgdGhhdCByZXF1aXJlZCB2aWV3IGRvZXNuJ3QgZXhpc3QgYW5kIGNhbid0IGJlIGZvdW5kIGF0XG4gICAgICAvLyBsYXRlciBwb3NpdGlvbnMgaW4gdGhlIHZpZXdzIGFycmF5IC0gc3RvcCB0aGUgc2VhcmNoZGVmLmNvbnQgaGVyZVxuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIE1hcmtzIHRoZSBlbmQgb2YgYW4gZW1iZWRkZWQgdmlldy5cbiAqXG4gKiBAY29kZUdlbkFwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gybXJtWVtYmVkZGVkVmlld0VuZCgpOiB2b2lkIHtcbiAgY29uc3QgbFZpZXcgPSBnZXRMVmlldygpO1xuICBjb25zdCB2aWV3SG9zdCA9IGxWaWV3W1RfSE9TVF07XG5cbiAgaWYgKGlzQ3JlYXRpb25Nb2RlKGxWaWV3KSkge1xuICAgIHJlZnJlc2hEZXNjZW5kYW50Vmlld3MobFZpZXcpOyAgLy8gY3JlYXRpb24gbW9kZSBwYXNzXG4gICAgbFZpZXdbRkxBR1NdICY9IH5MVmlld0ZsYWdzLkNyZWF0aW9uTW9kZTtcbiAgfVxuICByZXNldFByZU9yZGVySG9va0ZsYWdzKGxWaWV3KTtcbiAgcmVmcmVzaERlc2NlbmRhbnRWaWV3cyhsVmlldyk7ICAvLyB1cGRhdGUgbW9kZSBwYXNzXG4gIGNvbnN0IGxDb250YWluZXIgPSBsVmlld1tQQVJFTlRdIGFzIExDb250YWluZXI7XG4gIG5nRGV2TW9kZSAmJiBhc3NlcnRMQ29udGFpbmVyT3JVbmRlZmluZWQobENvbnRhaW5lcik7XG4gIGxlYXZlVmlldyhsQ29udGFpbmVyW1BBUkVOVF0gISk7XG4gIHNldFByZXZpb3VzT3JQYXJlbnRUTm9kZSh2aWV3SG9zdCAhKTtcbiAgc2V0SXNQYXJlbnQoZmFsc2UpO1xufVxuIl19