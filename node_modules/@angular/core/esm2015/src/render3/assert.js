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
import { assertDefined, assertEqual, throwError } from '../util/assert';
import { getComponentDef, getNgModuleDef } from './definition';
import { isLContainer, isLView } from './util/view_utils';
/**
 * @param {?} actual
 * @param {?=} msg
 * @return {?}
 */
export function assertComponentType(actual, msg = 'Type passed in is not ComponentType, it does not have \'ngComponentDef\' property.') {
    if (!getComponentDef(actual)) {
        throwError(msg);
    }
}
/**
 * @param {?} actual
 * @param {?=} msg
 * @return {?}
 */
export function assertNgModuleType(actual, msg = 'Type passed in is not NgModuleType, it does not have \'ngModuleDef\' property.') {
    if (!getNgModuleDef(actual)) {
        throwError(msg);
    }
}
/**
 * @param {?} isParent
 * @return {?}
 */
export function assertPreviousIsParent(isParent) {
    assertEqual(isParent, true, 'previousOrParentTNode should be a parent');
}
/**
 * @param {?} tNode
 * @return {?}
 */
export function assertHasParent(tNode) {
    assertDefined(tNode.parent, 'previousOrParentTNode should have a parent');
}
/**
 * @param {?} lView
 * @param {?} index
 * @param {?=} arr
 * @return {?}
 */
export function assertDataNext(lView, index, arr) {
    if (arr == null)
        arr = lView;
    assertEqual(arr.length, index, `index ${index} expected to be at the end of arr (length ${arr.length})`);
}
/**
 * @param {?} value
 * @return {?}
 */
export function assertLContainerOrUndefined(value) {
    value && assertEqual(isLContainer(value), true, 'Expecting LContainer or undefined or null');
}
/**
 * @param {?} value
 * @return {?}
 */
export function assertLContainer(value) {
    assertDefined(value, 'LContainer must be defined');
    assertEqual(isLContainer(value), true, 'Expecting LContainer');
}
/**
 * @param {?} value
 * @return {?}
 */
export function assertLViewOrUndefined(value) {
    value && assertEqual(isLView(value), true, 'Expecting LView or undefined or null');
}
/**
 * @param {?} value
 * @return {?}
 */
export function assertLView(value) {
    assertDefined(value, 'LView must be defined');
    assertEqual(isLView(value), true, 'Expecting LView');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXJ0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvcmVuZGVyMy9hc3NlcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsYUFBYSxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUV0RSxPQUFPLEVBQUMsZUFBZSxFQUFFLGNBQWMsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUc3RCxPQUFPLEVBQUMsWUFBWSxFQUFFLE9BQU8sRUFBQyxNQUFNLG1CQUFtQixDQUFDOzs7Ozs7QUFHeEQsTUFBTSxVQUFVLG1CQUFtQixDQUMvQixNQUFXLEVBQ1gsTUFDSSxvRkFBb0Y7SUFDMUYsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUM1QixVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDakI7QUFDSCxDQUFDOzs7Ozs7QUFFRCxNQUFNLFVBQVUsa0JBQWtCLENBQzlCLE1BQVcsRUFDWCxNQUNJLGdGQUFnRjtJQUN0RixJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQzNCLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNqQjtBQUNILENBQUM7Ozs7O0FBRUQsTUFBTSxVQUFVLHNCQUFzQixDQUFDLFFBQWlCO0lBQ3RELFdBQVcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLDBDQUEwQyxDQUFDLENBQUM7QUFDMUUsQ0FBQzs7Ozs7QUFFRCxNQUFNLFVBQVUsZUFBZSxDQUFDLEtBQVk7SUFDMUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsNENBQTRDLENBQUMsQ0FBQztBQUM1RSxDQUFDOzs7Ozs7O0FBRUQsTUFBTSxVQUFVLGNBQWMsQ0FBQyxLQUFZLEVBQUUsS0FBYSxFQUFFLEdBQVc7SUFDckUsSUFBSSxHQUFHLElBQUksSUFBSTtRQUFFLEdBQUcsR0FBRyxLQUFLLENBQUM7SUFDN0IsV0FBVyxDQUNQLEdBQUcsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLFNBQVMsS0FBSyw2Q0FBNkMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDbkcsQ0FBQzs7Ozs7QUFFRCxNQUFNLFVBQVUsMkJBQTJCLENBQUMsS0FBVTtJQUNwRCxLQUFLLElBQUksV0FBVyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLEVBQUUsMkNBQTJDLENBQUMsQ0FBQztBQUMvRixDQUFDOzs7OztBQUVELE1BQU0sVUFBVSxnQkFBZ0IsQ0FBQyxLQUFVO0lBQ3pDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsNEJBQTRCLENBQUMsQ0FBQztJQUNuRCxXQUFXLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO0FBQ2pFLENBQUM7Ozs7O0FBRUQsTUFBTSxVQUFVLHNCQUFzQixDQUFDLEtBQVU7SUFDL0MsS0FBSyxJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxFQUFFLHNDQUFzQyxDQUFDLENBQUM7QUFDckYsQ0FBQzs7Ozs7QUFFRCxNQUFNLFVBQVUsV0FBVyxDQUFDLEtBQVU7SUFDcEMsYUFBYSxDQUFDLEtBQUssRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO0lBQzlDLFdBQVcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxFQUFFLGlCQUFpQixDQUFDLENBQUM7QUFDdkQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHthc3NlcnREZWZpbmVkLCBhc3NlcnRFcXVhbCwgdGhyb3dFcnJvcn0gZnJvbSAnLi4vdXRpbC9hc3NlcnQnO1xuXG5pbXBvcnQge2dldENvbXBvbmVudERlZiwgZ2V0TmdNb2R1bGVEZWZ9IGZyb20gJy4vZGVmaW5pdGlvbic7XG5pbXBvcnQge1ROb2RlfSBmcm9tICcuL2ludGVyZmFjZXMvbm9kZSc7XG5pbXBvcnQge0xWaWV3fSBmcm9tICcuL2ludGVyZmFjZXMvdmlldyc7XG5pbXBvcnQge2lzTENvbnRhaW5lciwgaXNMVmlld30gZnJvbSAnLi91dGlsL3ZpZXdfdXRpbHMnO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRDb21wb25lbnRUeXBlKFxuICAgIGFjdHVhbDogYW55LFxuICAgIG1zZzogc3RyaW5nID1cbiAgICAgICAgJ1R5cGUgcGFzc2VkIGluIGlzIG5vdCBDb21wb25lbnRUeXBlLCBpdCBkb2VzIG5vdCBoYXZlIFxcJ25nQ29tcG9uZW50RGVmXFwnIHByb3BlcnR5LicpIHtcbiAgaWYgKCFnZXRDb21wb25lbnREZWYoYWN0dWFsKSkge1xuICAgIHRocm93RXJyb3IobXNnKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0TmdNb2R1bGVUeXBlKFxuICAgIGFjdHVhbDogYW55LFxuICAgIG1zZzogc3RyaW5nID1cbiAgICAgICAgJ1R5cGUgcGFzc2VkIGluIGlzIG5vdCBOZ01vZHVsZVR5cGUsIGl0IGRvZXMgbm90IGhhdmUgXFwnbmdNb2R1bGVEZWZcXCcgcHJvcGVydHkuJykge1xuICBpZiAoIWdldE5nTW9kdWxlRGVmKGFjdHVhbCkpIHtcbiAgICB0aHJvd0Vycm9yKG1zZyk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydFByZXZpb3VzSXNQYXJlbnQoaXNQYXJlbnQ6IGJvb2xlYW4pIHtcbiAgYXNzZXJ0RXF1YWwoaXNQYXJlbnQsIHRydWUsICdwcmV2aW91c09yUGFyZW50VE5vZGUgc2hvdWxkIGJlIGEgcGFyZW50Jyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRIYXNQYXJlbnQodE5vZGU6IFROb2RlKSB7XG4gIGFzc2VydERlZmluZWQodE5vZGUucGFyZW50LCAncHJldmlvdXNPclBhcmVudFROb2RlIHNob3VsZCBoYXZlIGEgcGFyZW50Jyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnREYXRhTmV4dChsVmlldzogTFZpZXcsIGluZGV4OiBudW1iZXIsIGFycj86IGFueVtdKSB7XG4gIGlmIChhcnIgPT0gbnVsbCkgYXJyID0gbFZpZXc7XG4gIGFzc2VydEVxdWFsKFxuICAgICAgYXJyLmxlbmd0aCwgaW5kZXgsIGBpbmRleCAke2luZGV4fSBleHBlY3RlZCB0byBiZSBhdCB0aGUgZW5kIG9mIGFyciAobGVuZ3RoICR7YXJyLmxlbmd0aH0pYCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRMQ29udGFpbmVyT3JVbmRlZmluZWQodmFsdWU6IGFueSk6IHZvaWQge1xuICB2YWx1ZSAmJiBhc3NlcnRFcXVhbChpc0xDb250YWluZXIodmFsdWUpLCB0cnVlLCAnRXhwZWN0aW5nIExDb250YWluZXIgb3IgdW5kZWZpbmVkIG9yIG51bGwnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydExDb250YWluZXIodmFsdWU6IGFueSk6IHZvaWQge1xuICBhc3NlcnREZWZpbmVkKHZhbHVlLCAnTENvbnRhaW5lciBtdXN0IGJlIGRlZmluZWQnKTtcbiAgYXNzZXJ0RXF1YWwoaXNMQ29udGFpbmVyKHZhbHVlKSwgdHJ1ZSwgJ0V4cGVjdGluZyBMQ29udGFpbmVyJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRMVmlld09yVW5kZWZpbmVkKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgdmFsdWUgJiYgYXNzZXJ0RXF1YWwoaXNMVmlldyh2YWx1ZSksIHRydWUsICdFeHBlY3RpbmcgTFZpZXcgb3IgdW5kZWZpbmVkIG9yIG51bGwnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydExWaWV3KHZhbHVlOiBhbnkpIHtcbiAgYXNzZXJ0RGVmaW5lZCh2YWx1ZSwgJ0xWaWV3IG11c3QgYmUgZGVmaW5lZCcpO1xuICBhc3NlcnRFcXVhbChpc0xWaWV3KHZhbHVlKSwgdHJ1ZSwgJ0V4cGVjdGluZyBMVmlldycpO1xufVxuIl19