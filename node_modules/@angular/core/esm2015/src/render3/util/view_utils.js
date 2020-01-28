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
import { assertDataInRange, assertDefined, assertGreaterThan, assertLessThan } from '../../util/assert';
import { TYPE } from '../interfaces/container';
import { MONKEY_PATCH_KEY_NAME } from '../interfaces/context';
import { FLAGS, HEADER_OFFSET, HOST, PARENT, PREORDER_HOOK_FLAGS, TVIEW } from '../interfaces/view';
/**
 * For efficiency reasons we often put several different data types (`RNode`, `LView`, `LContainer`,
 * `StylingContext`) in same location in `LView`. This is because we don't want to pre-allocate
 * space for it because the storage is sparse. This file contains utilities for dealing with such
 * data types.
 *
 * How do we know what is stored at a given location in `LView`.
 * - `Array.isArray(value) === false` => `RNode` (The normal storage value)
 * - `Array.isArray(value) === true` => then the `value[0]` represents the wrapped value.
 *   - `typeof value[TYPE] === 'object'` => `LView`
 *      - This happens when we have a component at a given location
 *   - `typeof value[TYPE] === 'number'` => `StylingContext`
 *      - This happens when we have style/class binding at a given location.
 *   - `typeof value[TYPE] === true` => `LContainer`
 *      - This happens when we have `LContainer` binding at a given location.
 *
 *
 * NOTE: it is assumed that `Array.isArray` and `typeof` operations are very efficient.
 */
/**
 * Returns `RNode`.
 * @param {?} value wrapped value of `RNode`, `LView`, `LContainer`, `StylingContext`
 * @return {?}
 */
export function unwrapRNode(value) {
    while (Array.isArray(value)) {
        value = (/** @type {?} */ (value[HOST]));
    }
    return (/** @type {?} */ (value));
}
/**
 * Returns `LView` or `null` if not found.
 * @param {?} value wrapped value of `RNode`, `LView`, `LContainer`, `StylingContext`
 * @return {?}
 */
export function unwrapLView(value) {
    while (Array.isArray(value)) {
        // This check is same as `isLView()` but we don't call at as we don't want to call
        // `Array.isArray()` twice and give JITer more work for inlining.
        if (typeof value[TYPE] === 'object')
            return (/** @type {?} */ (value));
        value = (/** @type {?} */ (value[HOST]));
    }
    return null;
}
/**
 * Returns `LContainer` or `null` if not found.
 * @param {?} value wrapped value of `RNode`, `LView`, `LContainer`, `StylingContext`
 * @return {?}
 */
export function unwrapLContainer(value) {
    while (Array.isArray(value)) {
        // This check is same as `isLContainer()` but we don't call at as we don't want to call
        // `Array.isArray()` twice and give JITer more work for inlining.
        if (value[TYPE] === true)
            return (/** @type {?} */ (value));
        value = (/** @type {?} */ (value[HOST]));
    }
    return null;
}
/**
 * Returns `StylingContext` or `null` if not found.
 * @param {?} value wrapped value of `RNode`, `LView`, `LContainer`, `StylingContext`
 * @return {?}
 */
export function unwrapStylingContext(value) {
    while (Array.isArray(value)) {
        // This check is same as `isStylingContext()` but we don't call at as we don't want to call
        // `Array.isArray()` twice and give JITer more work for inlining.
        if (typeof value[TYPE] === 'number')
            return (/** @type {?} */ (value));
        value = (/** @type {?} */ (value[HOST]));
    }
    return null;
}
/**
 * True if `value` is `LView`.
 * @param {?} value wrapped value of `RNode`, `LView`, `LContainer`, `StylingContext`
 * @return {?}
 */
export function isLView(value) {
    return Array.isArray(value) && typeof value[TYPE] === 'object';
}
/**
 * True if `value` is `LContainer`.
 * @param {?} value wrapped value of `RNode`, `LView`, `LContainer`, `StylingContext`
 * @return {?}
 */
export function isLContainer(value) {
    return Array.isArray(value) && value[TYPE] === true;
}
/**
 * True if `value` is `StylingContext`.
 * @param {?} value wrapped value of `RNode`, `LView`, `LContainer`, `StylingContext`
 * @return {?}
 */
export function isStylingContext(value) {
    return Array.isArray(value) && typeof value[TYPE] === 'number';
}
/**
 * Retrieves an element value from the provided `viewData`, by unwrapping
 * from any containers, component views, or style contexts.
 * @param {?} index
 * @param {?} lView
 * @return {?}
 */
export function getNativeByIndex(index, lView) {
    return unwrapRNode(lView[index + HEADER_OFFSET]);
}
/**
 * @param {?} tNode
 * @param {?} hostView
 * @return {?}
 */
export function getNativeByTNode(tNode, hostView) {
    return unwrapRNode(hostView[tNode.index]);
}
/**
 * A helper function that returns `true` if a given `TNode` has any matching directives.
 * @param {?} tNode
 * @return {?}
 */
export function hasDirectives(tNode) {
    return tNode.directiveEnd > tNode.directiveStart;
}
/**
 * @param {?} index
 * @param {?} view
 * @return {?}
 */
export function getTNode(index, view) {
    ngDevMode && assertGreaterThan(index, -1, 'wrong index for TNode');
    ngDevMode && assertLessThan(index, view[TVIEW].data.length, 'wrong index for TNode');
    return (/** @type {?} */ (view[TVIEW].data[index + HEADER_OFFSET]));
}
/**
 * Retrieves a value from any `LView` or `TData`.
 * @template T
 * @param {?} view
 * @param {?} index
 * @return {?}
 */
export function loadInternal(view, index) {
    ngDevMode && assertDataInRange(view, index + HEADER_OFFSET);
    return view[index + HEADER_OFFSET];
}
/**
 * @param {?} nodeIndex
 * @param {?} hostView
 * @return {?}
 */
export function getComponentViewByIndex(nodeIndex, hostView) {
    // Could be an LView or an LContainer. If LContainer, unwrap to find LView.
    /** @type {?} */
    const slotValue = hostView[nodeIndex];
    /** @type {?} */
    const lView = isLView(slotValue) ? slotValue : slotValue[HOST];
    return lView;
}
/**
 * @param {?} tNode
 * @return {?}
 */
export function isContentQueryHost(tNode) {
    return (tNode.flags & 4 /* hasContentQuery */) !== 0;
}
/**
 * @param {?} tNode
 * @return {?}
 */
export function isComponent(tNode) {
    return (tNode.flags & 1 /* isComponent */) === 1 /* isComponent */;
}
/**
 * @template T
 * @param {?} def
 * @return {?}
 */
export function isComponentDef(def) {
    return ((/** @type {?} */ (def))).template !== null;
}
/**
 * @param {?} target
 * @return {?}
 */
export function isRootView(target) {
    return (target[FLAGS] & 512 /* IsRoot */) !== 0;
}
/**
 * Returns the monkey-patch value data present on the target (which could be
 * a component, directive or a DOM node).
 * @param {?} target
 * @return {?}
 */
export function readPatchedData(target) {
    ngDevMode && assertDefined(target, 'Target expected');
    return target[MONKEY_PATCH_KEY_NAME];
}
/**
 * @param {?} target
 * @return {?}
 */
export function readPatchedLView(target) {
    /** @type {?} */
    const value = readPatchedData(target);
    if (value) {
        return Array.isArray(value) ? value : ((/** @type {?} */ (value))).lView;
    }
    return null;
}
/**
 * Returns a boolean for whether the view is attached to the change detection tree.
 *
 * Note: This determines whether a view should be checked, not whether it's inserted
 * into a container. For that, you'll want `viewAttachedToContainer` below.
 * @param {?} view
 * @return {?}
 */
export function viewAttachedToChangeDetector(view) {
    return (view[FLAGS] & 128 /* Attached */) === 128 /* Attached */;
}
/**
 * Returns a boolean for whether the view is attached to a container.
 * @param {?} view
 * @return {?}
 */
export function viewAttachedToContainer(view) {
    return isLContainer(view[PARENT]);
}
/**
 * Resets the pre-order hook flags of the view.
 * @param {?} lView the LView on which the flags are reset
 * @return {?}
 */
export function resetPreOrderHookFlags(lView) {
    lView[PREORDER_HOOK_FLAGS] = 0;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld191dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3JlbmRlcjMvdXRpbC92aWV3X3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLGlCQUFpQixFQUFFLGFBQWEsRUFBRSxpQkFBaUIsRUFBRSxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUN0RyxPQUFPLEVBQWEsSUFBSSxFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFDekQsT0FBTyxFQUFXLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFLdEUsT0FBTyxFQUFDLEtBQUssRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFxQixNQUFNLEVBQUUsbUJBQW1CLEVBQVMsS0FBSyxFQUFDLE1BQU0sb0JBQW9CLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE0QjVILE1BQU0sVUFBVSxXQUFXLENBQUMsS0FBa0Q7SUFDNUUsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQzNCLEtBQUssR0FBRyxtQkFBQSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQU8sQ0FBQztLQUM1QjtJQUNELE9BQU8sbUJBQUEsS0FBSyxFQUFTLENBQUM7QUFDeEIsQ0FBQzs7Ozs7O0FBTUQsTUFBTSxVQUFVLFdBQVcsQ0FBQyxLQUFrRDtJQUM1RSxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDM0Isa0ZBQWtGO1FBQ2xGLGlFQUFpRTtRQUNqRSxJQUFJLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLFFBQVE7WUFBRSxPQUFPLG1CQUFBLEtBQUssRUFBUyxDQUFDO1FBQzNELEtBQUssR0FBRyxtQkFBQSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQU8sQ0FBQztLQUM1QjtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2Qs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QyxtQkFBQSxLQUFLLEVBQVksQ0FBQyxDQUFDLEtBQUssQ0FBQztLQUNqRTtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQzs7Ozs7Ozs7O0FBUUQsTUFBTSxVQUFVLDRCQUE0QixDQUFDLElBQVc7SUFDdEQsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMscUJBQXNCLENBQUMsdUJBQXdCLENBQUM7QUFDckUsQ0FBQzs7Ozs7O0FBR0QsTUFBTSxVQUFVLHVCQUF1QixDQUFDLElBQVc7SUFDakQsT0FBTyxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDcEMsQ0FBQzs7Ozs7O0FBTUQsTUFBTSxVQUFVLHNCQUFzQixDQUFDLEtBQVk7SUFDakQsS0FBSyxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2pDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7YXNzZXJ0RGF0YUluUmFuZ2UsIGFzc2VydERlZmluZWQsIGFzc2VydEdyZWF0ZXJUaGFuLCBhc3NlcnRMZXNzVGhhbn0gZnJvbSAnLi4vLi4vdXRpbC9hc3NlcnQnO1xuaW1wb3J0IHtMQ29udGFpbmVyLCBUWVBFfSBmcm9tICcuLi9pbnRlcmZhY2VzL2NvbnRhaW5lcic7XG5pbXBvcnQge0xDb250ZXh0LCBNT05LRVlfUEFUQ0hfS0VZX05BTUV9IGZyb20gJy4uL2ludGVyZmFjZXMvY29udGV4dCc7XG5pbXBvcnQge0NvbXBvbmVudERlZiwgRGlyZWN0aXZlRGVmfSBmcm9tICcuLi9pbnRlcmZhY2VzL2RlZmluaXRpb24nO1xuaW1wb3J0IHtUTm9kZSwgVE5vZGVGbGFnc30gZnJvbSAnLi4vaW50ZXJmYWNlcy9ub2RlJztcbmltcG9ydCB7Uk5vZGV9IGZyb20gJy4uL2ludGVyZmFjZXMvcmVuZGVyZXInO1xuaW1wb3J0IHtTdHlsaW5nQ29udGV4dH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9zdHlsaW5nJztcbmltcG9ydCB7RkxBR1MsIEhFQURFUl9PRkZTRVQsIEhPU1QsIExWaWV3LCBMVmlld0ZsYWdzLCBQQVJFTlQsIFBSRU9SREVSX0hPT0tfRkxBR1MsIFREYXRhLCBUVklFV30gZnJvbSAnLi4vaW50ZXJmYWNlcy92aWV3JztcblxuXG5cbi8qKlxuICogRm9yIGVmZmljaWVuY3kgcmVhc29ucyB3ZSBvZnRlbiBwdXQgc2V2ZXJhbCBkaWZmZXJlbnQgZGF0YSB0eXBlcyAoYFJOb2RlYCwgYExWaWV3YCwgYExDb250YWluZXJgLFxuICogYFN0eWxpbmdDb250ZXh0YCkgaW4gc2FtZSBsb2NhdGlvbiBpbiBgTFZpZXdgLiBUaGlzIGlzIGJlY2F1c2Ugd2UgZG9uJ3Qgd2FudCB0byBwcmUtYWxsb2NhdGVcbiAqIHNwYWNlIGZvciBpdCBiZWNhdXNlIHRoZSBzdG9yYWdlIGlzIHNwYXJzZS4gVGhpcyBmaWxlIGNvbnRhaW5zIHV0aWxpdGllcyBmb3IgZGVhbGluZyB3aXRoIHN1Y2hcbiAqIGRhdGEgdHlwZXMuXG4gKlxuICogSG93IGRvIHdlIGtub3cgd2hhdCBpcyBzdG9yZWQgYXQgYSBnaXZlbiBsb2NhdGlvbiBpbiBgTFZpZXdgLlxuICogLSBgQXJyYXkuaXNBcnJheSh2YWx1ZSkgPT09IGZhbHNlYCA9PiBgUk5vZGVgIChUaGUgbm9ybWFsIHN0b3JhZ2UgdmFsdWUpXG4gKiAtIGBBcnJheS5pc0FycmF5KHZhbHVlKSA9PT0gdHJ1ZWAgPT4gdGhlbiB0aGUgYHZhbHVlWzBdYCByZXByZXNlbnRzIHRoZSB3cmFwcGVkIHZhbHVlLlxuICogICAtIGB0eXBlb2YgdmFsdWVbVFlQRV0gPT09ICdvYmplY3QnYCA9PiBgTFZpZXdgXG4gKiAgICAgIC0gVGhpcyBoYXBwZW5zIHdoZW4gd2UgaGF2ZSBhIGNvbXBvbmVudCBhdCBhIGdpdmVuIGxvY2F0aW9uXG4gKiAgIC0gYHR5cGVvZiB2YWx1ZVtUWVBFXSA9PT0gJ251bWJlcidgID0+IGBTdHlsaW5nQ29udGV4dGBcbiAqICAgICAgLSBUaGlzIGhhcHBlbnMgd2hlbiB3ZSBoYXZlIHN0eWxlL2NsYXNzIGJpbmRpbmcgYXQgYSBnaXZlbiBsb2NhdGlvbi5cbiAqICAgLSBgdHlwZW9mIHZhbHVlW1RZUEVdID09PSB0cnVlYCA9PiBgTENvbnRhaW5lcmBcbiAqICAgICAgLSBUaGlzIGhhcHBlbnMgd2hlbiB3ZSBoYXZlIGBMQ29udGFpbmVyYCBiaW5kaW5nIGF0IGEgZ2l2ZW4gbG9jYXRpb24uXG4gKlxuICpcbiAqIE5PVEU6IGl0IGlzIGFzc3VtZWQgdGhhdCBgQXJyYXkuaXNBcnJheWAgYW5kIGB0eXBlb2ZgIG9wZXJhdGlvbnMgYXJlIHZlcnkgZWZmaWNpZW50LlxuICovXG5cbi8qKlxuICogUmV0dXJucyBgUk5vZGVgLlxuICogQHBhcmFtIHZhbHVlIHdyYXBwZWQgdmFsdWUgb2YgYFJOb2RlYCwgYExWaWV3YCwgYExDb250YWluZXJgLCBgU3R5bGluZ0NvbnRleHRgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bndyYXBSTm9kZSh2YWx1ZTogUk5vZGUgfCBMVmlldyB8IExDb250YWluZXIgfCBTdHlsaW5nQ29udGV4dCk6IFJOb2RlIHtcbiAgd2hpbGUgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgdmFsdWUgPSB2YWx1ZVtIT1NUXSBhcyBhbnk7XG4gIH1cbiAgcmV0dXJuIHZhbHVlIGFzIFJOb2RlO1xufVxuXG4vKipcbiAqIFJldHVybnMgYExWaWV3YCBvciBgbnVsbGAgaWYgbm90IGZvdW5kLlxuICogQHBhcmFtIHZhbHVlIHdyYXBwZWQgdmFsdWUgb2YgYFJOb2RlYCwgYExWaWV3YCwgYExDb250YWluZXJgLCBgU3R5bGluZ0NvbnRleHRgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bndyYXBMVmlldyh2YWx1ZTogUk5vZGUgfCBMVmlldyB8IExDb250YWluZXIgfCBTdHlsaW5nQ29udGV4dCk6IExWaWV3fG51bGwge1xuICB3aGlsZSAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAvLyBUaGlzIGNoZWNrIGlzIHNhbWUgYXMgYGlzTFZpZXcoKWAgYnV0IHdlIGRvbid0IGNhbGwgYXQgYXMgd2UgZG9uJ3Qgd2FudCB0byBjYWxsXG4gICAgLy8gYEFycmF5LmlzQXJyYXkoKWAgdHdpY2UgYW5kIGdpdmUgSklUZXIgbW9yZSB3b3JrIGZvciBpbmxpbmluZy5cbiAgICBpZiAodHlwZW9mIHZhbHVlW1RZUEVdID09PSAnb2JqZWN0JykgcmV0dXJuIHZhbHVlIGFzIExWaWV3O1xuICAgIHZhbHVlID0gdmFsdWVbSE9TVF0gYXMgYW55O1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIFJldHVybnMgYExDb250YWluZXJgIG9yIGBudWxsYCBpZiBub3QgZm91bmQuXG4gKiBAcGFyYW0gdmFsdWUgd3JhcHBlZCB2YWx1ZSBvZiBgUk5vZGVgLCBgTFZpZXdgLCBgTENvbnRhaW5lcmAsIGBTdHlsaW5nQ29udGV4dGBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVud3JhcExDb250YWluZXIodmFsdWU6IFJOb2RlIHwgTFZpZXcgfCBMQ29udGFpbmVyIHwgU3R5bGluZ0NvbnRleHQpOiBMQ29udGFpbmVyfFxuICAgIG51bGwge1xuICB3aGlsZSAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAvLyBUaGlzIGNoZWNrIGlzIHNhbWUgYXMgYGlzTENvbnRhaW5lcigpYCBidXQgd2UgZG9uJ3QgY2FsbCBhdCBhcyB3ZSBkb24ndCB3YW50IHRvIGNhbGxcbiAgICAvLyBgQXJyYXkuaXNBcnJheSgpYCB0d2ljZSBhbmQgZ2l2ZSBKSVRlciBtb3JlIHdvcmsgZm9yIGlubGluaW5nLlxuICAgIGlmICh2YWx1ZVtUWVBFXSA9PT0gdHJ1ZSkgcmV0dXJuIHZhbHVlIGFzIExDb250YWluZXI7XG4gICAgdmFsdWUgPSB2YWx1ZVtIT1NUXSBhcyBhbnk7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8qKlxuICogUmV0dXJucyBgU3R5bGluZ0NvbnRleHRgIG9yIGBudWxsYCBpZiBub3QgZm91bmQuXG4gKiBAcGFyYW0gdmFsdWUgd3JhcHBlZCB2YWx1ZSBvZiBgUk5vZGVgLCBgTFZpZXdgLCBgTENvbnRhaW5lcmAsIGBTdHlsaW5nQ29udGV4dGBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVud3JhcFN0eWxpbmdDb250ZXh0KHZhbHVlOiBSTm9kZSB8IExWaWV3IHwgTENvbnRhaW5lciB8IFN0eWxpbmdDb250ZXh0KTpcbiAgICBTdHlsaW5nQ29udGV4dHxudWxsIHtcbiAgd2hpbGUgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgLy8gVGhpcyBjaGVjayBpcyBzYW1lIGFzIGBpc1N0eWxpbmdDb250ZXh0KClgIGJ1dCB3ZSBkb24ndCBjYWxsIGF0IGFzIHdlIGRvbid0IHdhbnQgdG8gY2FsbFxuICAgIC8vIGBBcnJheS5pc0FycmF5KClgIHR3aWNlIGFuZCBnaXZlIEpJVGVyIG1vcmUgd29yayBmb3IgaW5saW5pbmcuXG4gICAgaWYgKHR5cGVvZiB2YWx1ZVtUWVBFXSA9PT0gJ251bWJlcicpIHJldHVybiB2YWx1ZSBhcyBTdHlsaW5nQ29udGV4dDtcbiAgICB2YWx1ZSA9IHZhbHVlW0hPU1RdIGFzIGFueTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuLyoqXG4gKiBUcnVlIGlmIGB2YWx1ZWAgaXMgYExWaWV3YC5cbiAqIEBwYXJhbSB2YWx1ZSB3cmFwcGVkIHZhbHVlIG9mIGBSTm9kZWAsIGBMVmlld2AsIGBMQ29udGFpbmVyYCwgYFN0eWxpbmdDb250ZXh0YFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNMVmlldyh2YWx1ZTogUk5vZGUgfCBMVmlldyB8IExDb250YWluZXIgfCBTdHlsaW5nQ29udGV4dCB8IHt9IHwgbnVsbCk6XG4gICAgdmFsdWUgaXMgTFZpZXcge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgdHlwZW9mIHZhbHVlW1RZUEVdID09PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBUcnVlIGlmIGB2YWx1ZWAgaXMgYExDb250YWluZXJgLlxuICogQHBhcmFtIHZhbHVlIHdyYXBwZWQgdmFsdWUgb2YgYFJOb2RlYCwgYExWaWV3YCwgYExDb250YWluZXJgLCBgU3R5bGluZ0NvbnRleHRgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0xDb250YWluZXIodmFsdWU6IFJOb2RlIHwgTFZpZXcgfCBMQ29udGFpbmVyIHwgU3R5bGluZ0NvbnRleHQgfCB7fSB8IG51bGwpOlxuICAgIHZhbHVlIGlzIExDb250YWluZXIge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWVbVFlQRV0gPT09IHRydWU7XG59XG5cbi8qKlxuICogVHJ1ZSBpZiBgdmFsdWVgIGlzIGBTdHlsaW5nQ29udGV4dGAuXG4gKiBAcGFyYW0gdmFsdWUgd3JhcHBlZCB2YWx1ZSBvZiBgUk5vZGVgLCBgTFZpZXdgLCBgTENvbnRhaW5lcmAsIGBTdHlsaW5nQ29udGV4dGBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzU3R5bGluZ0NvbnRleHQodmFsdWU6IFJOb2RlIHwgTFZpZXcgfCBMQ29udGFpbmVyIHwgU3R5bGluZ0NvbnRleHQgfCB7fSB8IG51bGwpOlxuICAgIHZhbHVlIGlzIFN0eWxpbmdDb250ZXh0IHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsdWUpICYmIHR5cGVvZiB2YWx1ZVtUWVBFXSA9PT0gJ251bWJlcic7XG59XG5cbi8qKlxuICogUmV0cmlldmVzIGFuIGVsZW1lbnQgdmFsdWUgZnJvbSB0aGUgcHJvdmlkZWQgYHZpZXdEYXRhYCwgYnkgdW53cmFwcGluZ1xuICogZnJvbSBhbnkgY29udGFpbmVycywgY29tcG9uZW50IHZpZXdzLCBvciBzdHlsZSBjb250ZXh0cy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE5hdGl2ZUJ5SW5kZXgoaW5kZXg6IG51bWJlciwgbFZpZXc6IExWaWV3KTogUk5vZGUge1xuICByZXR1cm4gdW53cmFwUk5vZGUobFZpZXdbaW5kZXggKyBIRUFERVJfT0ZGU0VUXSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROYXRpdmVCeVROb2RlKHROb2RlOiBUTm9kZSwgaG9zdFZpZXc6IExWaWV3KTogUk5vZGUge1xuICByZXR1cm4gdW53cmFwUk5vZGUoaG9zdFZpZXdbdE5vZGUuaW5kZXhdKTtcbn1cblxuLyoqXG4gKiBBIGhlbHBlciBmdW5jdGlvbiB0aGF0IHJldHVybnMgYHRydWVgIGlmIGEgZ2l2ZW4gYFROb2RlYCBoYXMgYW55IG1hdGNoaW5nIGRpcmVjdGl2ZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYXNEaXJlY3RpdmVzKHROb2RlOiBUTm9kZSk6IGJvb2xlYW4ge1xuICByZXR1cm4gdE5vZGUuZGlyZWN0aXZlRW5kID4gdE5vZGUuZGlyZWN0aXZlU3RhcnQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUTm9kZShpbmRleDogbnVtYmVyLCB2aWV3OiBMVmlldyk6IFROb2RlIHtcbiAgbmdEZXZNb2RlICYmIGFzc2VydEdyZWF0ZXJUaGFuKGluZGV4LCAtMSwgJ3dyb25nIGluZGV4IGZvciBUTm9kZScpO1xuICBuZ0Rldk1vZGUgJiYgYXNzZXJ0TGVzc1RoYW4oaW5kZXgsIHZpZXdbVFZJRVddLmRhdGEubGVuZ3RoLCAnd3JvbmcgaW5kZXggZm9yIFROb2RlJyk7XG4gIHJldHVybiB2aWV3W1RWSUVXXS5kYXRhW2luZGV4ICsgSEVBREVSX09GRlNFVF0gYXMgVE5vZGU7XG59XG5cbi8qKiBSZXRyaWV2ZXMgYSB2YWx1ZSBmcm9tIGFueSBgTFZpZXdgIG9yIGBURGF0YWAuICovXG5leHBvcnQgZnVuY3Rpb24gbG9hZEludGVybmFsPFQ+KHZpZXc6IExWaWV3IHwgVERhdGEsIGluZGV4OiBudW1iZXIpOiBUIHtcbiAgbmdEZXZNb2RlICYmIGFzc2VydERhdGFJblJhbmdlKHZpZXcsIGluZGV4ICsgSEVBREVSX09GRlNFVCk7XG4gIHJldHVybiB2aWV3W2luZGV4ICsgSEVBREVSX09GRlNFVF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb21wb25lbnRWaWV3QnlJbmRleChub2RlSW5kZXg6IG51bWJlciwgaG9zdFZpZXc6IExWaWV3KTogTFZpZXcge1xuICAvLyBDb3VsZCBiZSBhbiBMVmlldyBvciBhbiBMQ29udGFpbmVyLiBJZiBMQ29udGFpbmVyLCB1bndyYXAgdG8gZmluZCBMVmlldy5cbiAgY29uc3Qgc2xvdFZhbHVlID0gaG9zdFZpZXdbbm9kZUluZGV4XTtcbiAgY29uc3QgbFZpZXcgPSBpc0xWaWV3KHNsb3RWYWx1ZSkgPyBzbG90VmFsdWUgOiBzbG90VmFsdWVbSE9TVF07XG4gIHJldHVybiBsVmlldztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQ29udGVudFF1ZXJ5SG9zdCh0Tm9kZTogVE5vZGUpOiBib29sZWFuIHtcbiAgcmV0dXJuICh0Tm9kZS5mbGFncyAmIFROb2RlRmxhZ3MuaGFzQ29udGVudFF1ZXJ5KSAhPT0gMDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQ29tcG9uZW50KHROb2RlOiBUTm9kZSk6IGJvb2xlYW4ge1xuICByZXR1cm4gKHROb2RlLmZsYWdzICYgVE5vZGVGbGFncy5pc0NvbXBvbmVudCkgPT09IFROb2RlRmxhZ3MuaXNDb21wb25lbnQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NvbXBvbmVudERlZjxUPihkZWY6IERpcmVjdGl2ZURlZjxUPik6IGRlZiBpcyBDb21wb25lbnREZWY8VD4ge1xuICByZXR1cm4gKGRlZiBhcyBDb21wb25lbnREZWY8VD4pLnRlbXBsYXRlICE9PSBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNSb290Vmlldyh0YXJnZXQ6IExWaWV3KTogYm9vbGVhbiB7XG4gIHJldHVybiAodGFyZ2V0W0ZMQUdTXSAmIExWaWV3RmxhZ3MuSXNSb290KSAhPT0gMDtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBtb25rZXktcGF0Y2ggdmFsdWUgZGF0YSBwcmVzZW50IG9uIHRoZSB0YXJnZXQgKHdoaWNoIGNvdWxkIGJlXG4gKiBhIGNvbXBvbmVudCwgZGlyZWN0aXZlIG9yIGEgRE9NIG5vZGUpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVhZFBhdGNoZWREYXRhKHRhcmdldDogYW55KTogTFZpZXd8TENvbnRleHR8bnVsbCB7XG4gIG5nRGV2TW9kZSAmJiBhc3NlcnREZWZpbmVkKHRhcmdldCwgJ1RhcmdldCBleHBlY3RlZCcpO1xuICByZXR1cm4gdGFyZ2V0W01PTktFWV9QQVRDSF9LRVlfTkFNRV07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWFkUGF0Y2hlZExWaWV3KHRhcmdldDogYW55KTogTFZpZXd8bnVsbCB7XG4gIGNvbnN0IHZhbHVlID0gcmVhZFBhdGNoZWREYXRhKHRhcmdldCk7XG4gIGlmICh2YWx1ZSkge1xuICAgIHJldHVybiBBcnJheS5pc0FycmF5KHZhbHVlKSA/IHZhbHVlIDogKHZhbHVlIGFzIExDb250ZXh0KS5sVmlldztcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgYm9vbGVhbiBmb3Igd2hldGhlciB0aGUgdmlldyBpcyBhdHRhY2hlZCB0byB0aGUgY2hhbmdlIGRldGVjdGlvbiB0cmVlLlxuICpcbiAqIE5vdGU6IFRoaXMgZGV0ZXJtaW5lcyB3aGV0aGVyIGEgdmlldyBzaG91bGQgYmUgY2hlY2tlZCwgbm90IHdoZXRoZXIgaXQncyBpbnNlcnRlZFxuICogaW50byBhIGNvbnRhaW5lci4gRm9yIHRoYXQsIHlvdSdsbCB3YW50IGB2aWV3QXR0YWNoZWRUb0NvbnRhaW5lcmAgYmVsb3cuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2aWV3QXR0YWNoZWRUb0NoYW5nZURldGVjdG9yKHZpZXc6IExWaWV3KTogYm9vbGVhbiB7XG4gIHJldHVybiAodmlld1tGTEFHU10gJiBMVmlld0ZsYWdzLkF0dGFjaGVkKSA9PT0gTFZpZXdGbGFncy5BdHRhY2hlZDtcbn1cblxuLyoqIFJldHVybnMgYSBib29sZWFuIGZvciB3aGV0aGVyIHRoZSB2aWV3IGlzIGF0dGFjaGVkIHRvIGEgY29udGFpbmVyLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHZpZXdBdHRhY2hlZFRvQ29udGFpbmVyKHZpZXc6IExWaWV3KTogYm9vbGVhbiB7XG4gIHJldHVybiBpc0xDb250YWluZXIodmlld1tQQVJFTlRdKTtcbn1cblxuLyoqXG4gKiBSZXNldHMgdGhlIHByZS1vcmRlciBob29rIGZsYWdzIG9mIHRoZSB2aWV3LlxuICogQHBhcmFtIGxWaWV3IHRoZSBMVmlldyBvbiB3aGljaCB0aGUgZmxhZ3MgYXJlIHJlc2V0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXNldFByZU9yZGVySG9va0ZsYWdzKGxWaWV3OiBMVmlldykge1xuICBsVmlld1tQUkVPUkRFUl9IT09LX0ZMQUdTXSA9IDA7XG59XG4iXX0=