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
import { DECLARATION_VIEW, T_HOST } from './interfaces/view';
import { getParentInjectorViewOffset } from './util/injector_utils';
/**
 * @param {?} tNode
 * @return {?}
 */
export function applyOnCreateInstructions(tNode) {
    // there may be some instructions that need to run in a specific
    // order because the CREATE block in a directive runs before the
    // CREATE block in a template. To work around this instructions
    // can get access to the function array below and defer any code
    // to run after the element is created.
    /** @type {?} */
    let fns;
    if (fns = tNode.onElementCreationFns) {
        for (let i = 0; i < fns.length; i++) {
            fns[i]();
        }
        tNode.onElementCreationFns = null;
    }
}
/**
 * Unwraps a parent injector location number to find the view offset from the current injector,
 * then walks up the declaration view tree until the TNode of the parent injector is found.
 *
 * @param {?} location The location of the parent injector, which contains the view offset
 * @param {?} startView The LView instance from which to start walking up the view tree
 * @param {?} startTNode The TNode instance of the starting element
 * @return {?} The TNode of the parent injector
 */
export function getParentInjectorTNode(location, startView, startTNode) {
    if (startTNode.parent && startTNode.parent.injectorIndex !== -1) {
        // view offset is 0
        /** @type {?} */
        const injectorIndex = startTNode.parent.injectorIndex;
        /** @type {?} */
        let parentTNode = startTNode.parent;
        while (parentTNode.parent != null && injectorIndex == parentTNode.injectorIndex) {
            parentTNode = parentTNode.parent;
        }
        return parentTNode;
    }
    /** @type {?} */
    let viewOffset = getParentInjectorViewOffset(location);
    // view offset is 1
    /** @type {?} */
    let parentView = startView;
    /** @type {?} */
    let parentTNode = (/** @type {?} */ (startView[T_HOST]));
    // view offset is superior to 1
    while (viewOffset > 1) {
        parentView = (/** @type {?} */ (parentView[DECLARATION_VIEW]));
        parentTNode = (/** @type {?} */ (parentView[T_HOST]));
        viewOffset--;
    }
    return parentTNode;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZV91dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvcmVuZGVyMy9ub2RlX3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFVQSxPQUFPLEVBQUMsZ0JBQWdCLEVBQVMsTUFBTSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDbEUsT0FBTyxFQUFDLDJCQUEyQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7Ozs7O0FBRWxFLE1BQU0sVUFBVSx5QkFBeUIsQ0FBQyxLQUFZOzs7Ozs7O1FBTWhELEdBQW9CO0lBQ3hCLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxvQkFBb0IsRUFBRTtRQUNwQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNuQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztTQUNWO1FBQ0QsS0FBSyxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQztLQUNuQztBQUNILENBQUM7Ozs7Ozs7Ozs7QUFXRCxNQUFNLFVBQVUsc0JBQXNCLENBQ2xDLFFBQWtDLEVBQUUsU0FBZ0IsRUFBRSxVQUFpQjtJQUV6RSxJQUFJLFVBQVUsQ0FBQyxNQUFNLElBQUksVUFBVSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEtBQUssQ0FBQyxDQUFDLEVBQUU7OztjQUV6RCxhQUFhLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxhQUFhOztZQUNqRCxXQUFXLEdBQUcsVUFBVSxDQUFDLE1BQU07UUFDbkMsT0FBTyxXQUFXLENBQUMsTUFBTSxJQUFJLElBQUksSUFBSSxhQUFhLElBQUksV0FBVyxDQUFDLGFBQWEsRUFBRTtZQUMvRSxXQUFXLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQztTQUNsQztRQUNELE9BQU8sV0FBVyxDQUFDO0tBQ3BCOztRQUNHLFVBQVUsR0FBRywyQkFBMkIsQ0FBQyxRQUFRLENBQUM7OztRQUVsRCxVQUFVLEdBQUcsU0FBUzs7UUFDdEIsV0FBVyxHQUFHLG1CQUFBLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBZ0I7SUFDbkQsK0JBQStCO0lBQy9CLE9BQU8sVUFBVSxHQUFHLENBQUMsRUFBRTtRQUNyQixVQUFVLEdBQUcsbUJBQUEsVUFBVSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQztRQUM1QyxXQUFXLEdBQUcsbUJBQUEsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFnQixDQUFDO1FBQ2pELFVBQVUsRUFBRSxDQUFDO0tBQ2Q7SUFDRCxPQUFPLFdBQVcsQ0FBQztBQUNyQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1JlbGF0aXZlSW5qZWN0b3JMb2NhdGlvbn0gZnJvbSAnLi9pbnRlcmZhY2VzL2luamVjdG9yJztcbmltcG9ydCB7VENvbnRhaW5lck5vZGUsIFRFbGVtZW50Tm9kZSwgVE5vZGV9IGZyb20gJy4vaW50ZXJmYWNlcy9ub2RlJztcbmltcG9ydCB7REVDTEFSQVRJT05fVklFVywgTFZpZXcsIFRfSE9TVH0gZnJvbSAnLi9pbnRlcmZhY2VzL3ZpZXcnO1xuaW1wb3J0IHtnZXRQYXJlbnRJbmplY3RvclZpZXdPZmZzZXR9IGZyb20gJy4vdXRpbC9pbmplY3Rvcl91dGlscyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBhcHBseU9uQ3JlYXRlSW5zdHJ1Y3Rpb25zKHROb2RlOiBUTm9kZSkge1xuICAvLyB0aGVyZSBtYXkgYmUgc29tZSBpbnN0cnVjdGlvbnMgdGhhdCBuZWVkIHRvIHJ1biBpbiBhIHNwZWNpZmljXG4gIC8vIG9yZGVyIGJlY2F1c2UgdGhlIENSRUFURSBibG9jayBpbiBhIGRpcmVjdGl2ZSBydW5zIGJlZm9yZSB0aGVcbiAgLy8gQ1JFQVRFIGJsb2NrIGluIGEgdGVtcGxhdGUuIFRvIHdvcmsgYXJvdW5kIHRoaXMgaW5zdHJ1Y3Rpb25zXG4gIC8vIGNhbiBnZXQgYWNjZXNzIHRvIHRoZSBmdW5jdGlvbiBhcnJheSBiZWxvdyBhbmQgZGVmZXIgYW55IGNvZGVcbiAgLy8gdG8gcnVuIGFmdGVyIHRoZSBlbGVtZW50IGlzIGNyZWF0ZWQuXG4gIGxldCBmbnM6IEZ1bmN0aW9uW118bnVsbDtcbiAgaWYgKGZucyA9IHROb2RlLm9uRWxlbWVudENyZWF0aW9uRm5zKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGZuc1tpXSgpO1xuICAgIH1cbiAgICB0Tm9kZS5vbkVsZW1lbnRDcmVhdGlvbkZucyA9IG51bGw7XG4gIH1cbn1cblxuLyoqXG4gKiBVbndyYXBzIGEgcGFyZW50IGluamVjdG9yIGxvY2F0aW9uIG51bWJlciB0byBmaW5kIHRoZSB2aWV3IG9mZnNldCBmcm9tIHRoZSBjdXJyZW50IGluamVjdG9yLFxuICogdGhlbiB3YWxrcyB1cCB0aGUgZGVjbGFyYXRpb24gdmlldyB0cmVlIHVudGlsIHRoZSBUTm9kZSBvZiB0aGUgcGFyZW50IGluamVjdG9yIGlzIGZvdW5kLlxuICpcbiAqIEBwYXJhbSBsb2NhdGlvbiBUaGUgbG9jYXRpb24gb2YgdGhlIHBhcmVudCBpbmplY3Rvciwgd2hpY2ggY29udGFpbnMgdGhlIHZpZXcgb2Zmc2V0XG4gKiBAcGFyYW0gc3RhcnRWaWV3IFRoZSBMVmlldyBpbnN0YW5jZSBmcm9tIHdoaWNoIHRvIHN0YXJ0IHdhbGtpbmcgdXAgdGhlIHZpZXcgdHJlZVxuICogQHBhcmFtIHN0YXJ0VE5vZGUgVGhlIFROb2RlIGluc3RhbmNlIG9mIHRoZSBzdGFydGluZyBlbGVtZW50XG4gKiBAcmV0dXJucyBUaGUgVE5vZGUgb2YgdGhlIHBhcmVudCBpbmplY3RvclxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFyZW50SW5qZWN0b3JUTm9kZShcbiAgICBsb2NhdGlvbjogUmVsYXRpdmVJbmplY3RvckxvY2F0aW9uLCBzdGFydFZpZXc6IExWaWV3LCBzdGFydFROb2RlOiBUTm9kZSk6IFRFbGVtZW50Tm9kZXxcbiAgICBUQ29udGFpbmVyTm9kZXxudWxsIHtcbiAgaWYgKHN0YXJ0VE5vZGUucGFyZW50ICYmIHN0YXJ0VE5vZGUucGFyZW50LmluamVjdG9ySW5kZXggIT09IC0xKSB7XG4gICAgLy8gdmlldyBvZmZzZXQgaXMgMFxuICAgIGNvbnN0IGluamVjdG9ySW5kZXggPSBzdGFydFROb2RlLnBhcmVudC5pbmplY3RvckluZGV4O1xuICAgIGxldCBwYXJlbnRUTm9kZSA9IHN0YXJ0VE5vZGUucGFyZW50O1xuICAgIHdoaWxlIChwYXJlbnRUTm9kZS5wYXJlbnQgIT0gbnVsbCAmJiBpbmplY3RvckluZGV4ID09IHBhcmVudFROb2RlLmluamVjdG9ySW5kZXgpIHtcbiAgICAgIHBhcmVudFROb2RlID0gcGFyZW50VE5vZGUucGFyZW50O1xuICAgIH1cbiAgICByZXR1cm4gcGFyZW50VE5vZGU7XG4gIH1cbiAgbGV0IHZpZXdPZmZzZXQgPSBnZXRQYXJlbnRJbmplY3RvclZpZXdPZmZzZXQobG9jYXRpb24pO1xuICAvLyB2aWV3IG9mZnNldCBpcyAxXG4gIGxldCBwYXJlbnRWaWV3ID0gc3RhcnRWaWV3O1xuICBsZXQgcGFyZW50VE5vZGUgPSBzdGFydFZpZXdbVF9IT1NUXSBhcyBURWxlbWVudE5vZGU7XG4gIC8vIHZpZXcgb2Zmc2V0IGlzIHN1cGVyaW9yIHRvIDFcbiAgd2hpbGUgKHZpZXdPZmZzZXQgPiAxKSB7XG4gICAgcGFyZW50VmlldyA9IHBhcmVudFZpZXdbREVDTEFSQVRJT05fVklFV10gITtcbiAgICBwYXJlbnRUTm9kZSA9IHBhcmVudFZpZXdbVF9IT1NUXSBhcyBURWxlbWVudE5vZGU7XG4gICAgdmlld09mZnNldC0tO1xuICB9XG4gIHJldHVybiBwYXJlbnRUTm9kZTtcbn1cbiJdfQ==