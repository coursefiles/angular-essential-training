/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { T_HOST } from '../interfaces/view';
import { appendProjectedNodes } from '../node_manipulation';
import { getProjectAsAttrValue, isNodeMatchingSelectorList, isSelectorInSelectorList } from '../node_selector_matcher';
import { getLView, setIsParent } from '../state';
import { findComponentView } from '../util/view_traversal_utils';
import { createNodeAtIndex } from './shared';
/**
 * Checks a given node against matching projection slots and returns the
 * determined slot index. Returns "null" if no slot matched the given node.
 *
 * This function takes into account the parsed ngProjectAs selector from the
 * node's attributes. If present, it will check whether the ngProjectAs selector
 * matches any of the projection slot selectors.
 * @param {?} tNode
 * @param {?} projectionSlots
 * @return {?}
 */
export function matchingProjectionSlotIndex(tNode, projectionSlots) {
    /** @type {?} */
    let wildcardNgContentIndex = null;
    /** @type {?} */
    const ngProjectAsAttrVal = getProjectAsAttrValue(tNode);
    for (let i = 0; i < projectionSlots.length; i++) {
        /** @type {?} */
        const slotValue = projectionSlots[i];
        // The last wildcard projection slot should match all nodes which aren't matching
        // any selector. This is necessary to be backwards compatible with view engine.
        if (slotValue === '*') {
            wildcardNgContentIndex = i;
            continue;
        }
        // If we ran into an `ngProjectAs` attribute, we should match its parsed selector
        // to the list of selectors, otherwise we fall back to matching against the node.
        if (ngProjectAsAttrVal === null ?
            isNodeMatchingSelectorList(tNode, slotValue, /* isProjectionMode */ true) :
            isSelectorInSelectorList(ngProjectAsAttrVal, slotValue)) {
            return i; // first matching selector "captures" a given node
        }
    }
    return wildcardNgContentIndex;
}
/**
 * Instruction to distribute projectable nodes among <ng-content> occurrences in a given template.
 * It takes all the selectors from the entire component's template and decides where
 * each projected node belongs (it re-distributes nodes among "buckets" where each "bucket" is
 * backed by a selector).
 *
 * This function requires CSS selectors to be provided in 2 forms: parsed (by a compiler) and text,
 * un-parsed form.
 *
 * The parsed form is needed for efficient matching of a node against a given CSS selector.
 * The un-parsed, textual form is needed for support of the ngProjectAs attribute.
 *
 * Having a CSS selector in 2 different formats is not ideal, but alternatives have even more
 * drawbacks:
 * - having only a textual form would require runtime parsing of CSS selectors;
 * - we can't have only a parsed as we can't re-construct textual form from it (as entered by a
 * template author).
 *
 * \@codeGenApi
 * @param {?=} projectionSlots
 * @return {?}
 */
export function ɵɵprojectionDef(projectionSlots) {
    /** @type {?} */
    const componentNode = (/** @type {?} */ (findComponentView(getLView())[T_HOST]));
    if (!componentNode.projection) {
        // If no explicit projection slots are defined, fall back to a single
        // projection slot with the wildcard selector.
        /** @type {?} */
        const numProjectionSlots = projectionSlots ? projectionSlots.length : 1;
        /** @type {?} */
        const projectionHeads = componentNode.projection =
            new Array(numProjectionSlots).fill(null);
        /** @type {?} */
        const tails = projectionHeads.slice();
        /** @type {?} */
        let componentChild = componentNode.child;
        while (componentChild !== null) {
            /** @type {?} */
            const slotIndex = projectionSlots ? matchingProjectionSlotIndex(componentChild, projectionSlots) : 0;
            if (slotIndex !== null) {
                if (tails[slotIndex]) {
                    (/** @type {?} */ (tails[slotIndex])).projectionNext = componentChild;
                }
                else {
                    projectionHeads[slotIndex] = componentChild;
                }
                tails[slotIndex] = componentChild;
            }
            componentChild = componentChild.next;
        }
    }
}
/**
 * Inserts previously re-distributed projected nodes. This instruction must be preceded by a call
 * to the projectionDef instruction.
 *
 * \@codeGenApi
 * @param {?} nodeIndex
 * @param {?=} selectorIndex
 * @param {?=} attrs
 * @return {?}
 */
export function ɵɵprojection(nodeIndex, selectorIndex = 0, attrs) {
    /** @type {?} */
    const lView = getLView();
    /** @type {?} */
    const tProjectionNode = createNodeAtIndex(nodeIndex, 1 /* Projection */, null, null, attrs || null);
    // We can't use viewData[HOST_NODE] because projection nodes can be nested in embedded views.
    if (tProjectionNode.projection === null)
        tProjectionNode.projection = selectorIndex;
    // `<ng-content>` has no content
    setIsParent(false);
    // re-distribution of projectable nodes is stored on a component's view level
    appendProjectedNodes(lView, tProjectionNode, selectorIndex, findComponentView(lView));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvamVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3JlbmRlcjMvaW5zdHJ1Y3Rpb25zL3Byb2plY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQVNBLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUMxQyxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUMxRCxPQUFPLEVBQUMscUJBQXFCLEVBQUUsMEJBQTBCLEVBQUUsd0JBQXdCLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNySCxPQUFPLEVBQUMsUUFBUSxFQUFFLFdBQVcsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUMvQyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSw4QkFBOEIsQ0FBQztBQUUvRCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxVQUFVLENBQUM7Ozs7Ozs7Ozs7OztBQVUzQyxNQUFNLFVBQVUsMkJBQTJCLENBQUMsS0FBWSxFQUFFLGVBQWdDOztRQUVwRixzQkFBc0IsR0FBRyxJQUFJOztVQUMzQixrQkFBa0IsR0FBRyxxQkFBcUIsQ0FBQyxLQUFLLENBQUM7SUFDdkQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7O2NBQ3pDLFNBQVMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLGlGQUFpRjtRQUNqRiwrRUFBK0U7UUFDL0UsSUFBSSxTQUFTLEtBQUssR0FBRyxFQUFFO1lBQ3JCLHNCQUFzQixHQUFHLENBQUMsQ0FBQztZQUMzQixTQUFTO1NBQ1Y7UUFDRCxpRkFBaUY7UUFDakYsaUZBQWlGO1FBQ2pGLElBQUksa0JBQWtCLEtBQUssSUFBSSxDQUFDLENBQUM7WUFDekIsMEJBQTBCLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzNFLHdCQUF3QixDQUFDLGtCQUFrQixFQUFFLFNBQVMsQ0FBQyxFQUFFO1lBQy9ELE9BQU8sQ0FBQyxDQUFDLENBQUUsa0RBQWtEO1NBQzlEO0tBQ0Y7SUFDRCxPQUFPLHNCQUFzQixDQUFDO0FBQ2hDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMkJELE1BQU0sVUFBVSxlQUFlLENBQUMsZUFBaUM7O1VBQ3pELGFBQWEsR0FBRyxtQkFBQSxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFnQjtJQUUzRSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRTs7OztjQUd2QixrQkFBa0IsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7O2NBQ2pFLGVBQWUsR0FBcUIsYUFBYSxDQUFDLFVBQVU7WUFDOUQsSUFBSSxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDOztjQUN0QyxLQUFLLEdBQXFCLGVBQWUsQ0FBQyxLQUFLLEVBQUU7O1lBRW5ELGNBQWMsR0FBZSxhQUFhLENBQUMsS0FBSztRQUVwRCxPQUFPLGNBQWMsS0FBSyxJQUFJLEVBQUU7O2tCQUN4QixTQUFTLEdBQ1gsZUFBZSxDQUFDLENBQUMsQ0FBQywyQkFBMkIsQ0FBQyxjQUFjLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFdEYsSUFBSSxTQUFTLEtBQUssSUFBSSxFQUFFO2dCQUN0QixJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFBRTtvQkFDcEIsbUJBQUEsS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQztpQkFDcEQ7cUJBQU07b0JBQ0wsZUFBZSxDQUFDLFNBQVMsQ0FBQyxHQUFHLGNBQWMsQ0FBQztpQkFDN0M7Z0JBQ0QsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLGNBQWMsQ0FBQzthQUNuQztZQUVELGNBQWMsR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDO1NBQ3RDO0tBQ0Y7QUFDSCxDQUFDOzs7Ozs7Ozs7OztBQWNELE1BQU0sVUFBVSxZQUFZLENBQ3hCLFNBQWlCLEVBQUUsZ0JBQXdCLENBQUMsRUFBRSxLQUFtQjs7VUFDN0QsS0FBSyxHQUFHLFFBQVEsRUFBRTs7VUFDbEIsZUFBZSxHQUNqQixpQkFBaUIsQ0FBQyxTQUFTLHNCQUF3QixJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssSUFBSSxJQUFJLENBQUM7SUFFakYsNkZBQTZGO0lBQzdGLElBQUksZUFBZSxDQUFDLFVBQVUsS0FBSyxJQUFJO1FBQUUsZUFBZSxDQUFDLFVBQVUsR0FBRyxhQUFhLENBQUM7SUFFcEYsZ0NBQWdDO0lBQ2hDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUVuQiw2RUFBNkU7SUFDN0Usb0JBQW9CLENBQUMsS0FBSyxFQUFFLGVBQWUsRUFBRSxhQUFhLEVBQUUsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN4RixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtUQXR0cmlidXRlcywgVEVsZW1lbnROb2RlLCBUTm9kZSwgVE5vZGVUeXBlfSBmcm9tICcuLi9pbnRlcmZhY2VzL25vZGUnO1xuaW1wb3J0IHtQcm9qZWN0aW9uU2xvdHN9IGZyb20gJy4uL2ludGVyZmFjZXMvcHJvamVjdGlvbic7XG5pbXBvcnQge1RfSE9TVH0gZnJvbSAnLi4vaW50ZXJmYWNlcy92aWV3JztcbmltcG9ydCB7YXBwZW5kUHJvamVjdGVkTm9kZXN9IGZyb20gJy4uL25vZGVfbWFuaXB1bGF0aW9uJztcbmltcG9ydCB7Z2V0UHJvamVjdEFzQXR0clZhbHVlLCBpc05vZGVNYXRjaGluZ1NlbGVjdG9yTGlzdCwgaXNTZWxlY3RvckluU2VsZWN0b3JMaXN0fSBmcm9tICcuLi9ub2RlX3NlbGVjdG9yX21hdGNoZXInO1xuaW1wb3J0IHtnZXRMVmlldywgc2V0SXNQYXJlbnR9IGZyb20gJy4uL3N0YXRlJztcbmltcG9ydCB7ZmluZENvbXBvbmVudFZpZXd9IGZyb20gJy4uL3V0aWwvdmlld190cmF2ZXJzYWxfdXRpbHMnO1xuXG5pbXBvcnQge2NyZWF0ZU5vZGVBdEluZGV4fSBmcm9tICcuL3NoYXJlZCc7XG5cbi8qKlxuICogQ2hlY2tzIGEgZ2l2ZW4gbm9kZSBhZ2FpbnN0IG1hdGNoaW5nIHByb2plY3Rpb24gc2xvdHMgYW5kIHJldHVybnMgdGhlXG4gKiBkZXRlcm1pbmVkIHNsb3QgaW5kZXguIFJldHVybnMgXCJudWxsXCIgaWYgbm8gc2xvdCBtYXRjaGVkIHRoZSBnaXZlbiBub2RlLlxuICpcbiAqIFRoaXMgZnVuY3Rpb24gdGFrZXMgaW50byBhY2NvdW50IHRoZSBwYXJzZWQgbmdQcm9qZWN0QXMgc2VsZWN0b3IgZnJvbSB0aGVcbiAqIG5vZGUncyBhdHRyaWJ1dGVzLiBJZiBwcmVzZW50LCBpdCB3aWxsIGNoZWNrIHdoZXRoZXIgdGhlIG5nUHJvamVjdEFzIHNlbGVjdG9yXG4gKiBtYXRjaGVzIGFueSBvZiB0aGUgcHJvamVjdGlvbiBzbG90IHNlbGVjdG9ycy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1hdGNoaW5nUHJvamVjdGlvblNsb3RJbmRleCh0Tm9kZTogVE5vZGUsIHByb2plY3Rpb25TbG90czogUHJvamVjdGlvblNsb3RzKTogbnVtYmVyfFxuICAgIG51bGwge1xuICBsZXQgd2lsZGNhcmROZ0NvbnRlbnRJbmRleCA9IG51bGw7XG4gIGNvbnN0IG5nUHJvamVjdEFzQXR0clZhbCA9IGdldFByb2plY3RBc0F0dHJWYWx1ZSh0Tm9kZSk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvamVjdGlvblNsb3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3Qgc2xvdFZhbHVlID0gcHJvamVjdGlvblNsb3RzW2ldO1xuICAgIC8vIFRoZSBsYXN0IHdpbGRjYXJkIHByb2plY3Rpb24gc2xvdCBzaG91bGQgbWF0Y2ggYWxsIG5vZGVzIHdoaWNoIGFyZW4ndCBtYXRjaGluZ1xuICAgIC8vIGFueSBzZWxlY3Rvci4gVGhpcyBpcyBuZWNlc3NhcnkgdG8gYmUgYmFja3dhcmRzIGNvbXBhdGlibGUgd2l0aCB2aWV3IGVuZ2luZS5cbiAgICBpZiAoc2xvdFZhbHVlID09PSAnKicpIHtcbiAgICAgIHdpbGRjYXJkTmdDb250ZW50SW5kZXggPSBpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIC8vIElmIHdlIHJhbiBpbnRvIGFuIGBuZ1Byb2plY3RBc2AgYXR0cmlidXRlLCB3ZSBzaG91bGQgbWF0Y2ggaXRzIHBhcnNlZCBzZWxlY3RvclxuICAgIC8vIHRvIHRoZSBsaXN0IG9mIHNlbGVjdG9ycywgb3RoZXJ3aXNlIHdlIGZhbGwgYmFjayB0byBtYXRjaGluZyBhZ2FpbnN0IHRoZSBub2RlLlxuICAgIGlmIChuZ1Byb2plY3RBc0F0dHJWYWwgPT09IG51bGwgP1xuICAgICAgICAgICAgaXNOb2RlTWF0Y2hpbmdTZWxlY3Rvckxpc3QodE5vZGUsIHNsb3RWYWx1ZSwgLyogaXNQcm9qZWN0aW9uTW9kZSAqLyB0cnVlKSA6XG4gICAgICAgICAgICBpc1NlbGVjdG9ySW5TZWxlY3Rvckxpc3QobmdQcm9qZWN0QXNBdHRyVmFsLCBzbG90VmFsdWUpKSB7XG4gICAgICByZXR1cm4gaTsgIC8vIGZpcnN0IG1hdGNoaW5nIHNlbGVjdG9yIFwiY2FwdHVyZXNcIiBhIGdpdmVuIG5vZGVcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHdpbGRjYXJkTmdDb250ZW50SW5kZXg7XG59XG5cbi8qKlxuICogSW5zdHJ1Y3Rpb24gdG8gZGlzdHJpYnV0ZSBwcm9qZWN0YWJsZSBub2RlcyBhbW9uZyA8bmctY29udGVudD4gb2NjdXJyZW5jZXMgaW4gYSBnaXZlbiB0ZW1wbGF0ZS5cbiAqIEl0IHRha2VzIGFsbCB0aGUgc2VsZWN0b3JzIGZyb20gdGhlIGVudGlyZSBjb21wb25lbnQncyB0ZW1wbGF0ZSBhbmQgZGVjaWRlcyB3aGVyZVxuICogZWFjaCBwcm9qZWN0ZWQgbm9kZSBiZWxvbmdzIChpdCByZS1kaXN0cmlidXRlcyBub2RlcyBhbW9uZyBcImJ1Y2tldHNcIiB3aGVyZSBlYWNoIFwiYnVja2V0XCIgaXNcbiAqIGJhY2tlZCBieSBhIHNlbGVjdG9yKS5cbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIHJlcXVpcmVzIENTUyBzZWxlY3RvcnMgdG8gYmUgcHJvdmlkZWQgaW4gMiBmb3JtczogcGFyc2VkIChieSBhIGNvbXBpbGVyKSBhbmQgdGV4dCxcbiAqIHVuLXBhcnNlZCBmb3JtLlxuICpcbiAqIFRoZSBwYXJzZWQgZm9ybSBpcyBuZWVkZWQgZm9yIGVmZmljaWVudCBtYXRjaGluZyBvZiBhIG5vZGUgYWdhaW5zdCBhIGdpdmVuIENTUyBzZWxlY3Rvci5cbiAqIFRoZSB1bi1wYXJzZWQsIHRleHR1YWwgZm9ybSBpcyBuZWVkZWQgZm9yIHN1cHBvcnQgb2YgdGhlIG5nUHJvamVjdEFzIGF0dHJpYnV0ZS5cbiAqXG4gKiBIYXZpbmcgYSBDU1Mgc2VsZWN0b3IgaW4gMiBkaWZmZXJlbnQgZm9ybWF0cyBpcyBub3QgaWRlYWwsIGJ1dCBhbHRlcm5hdGl2ZXMgaGF2ZSBldmVuIG1vcmVcbiAqIGRyYXdiYWNrczpcbiAqIC0gaGF2aW5nIG9ubHkgYSB0ZXh0dWFsIGZvcm0gd291bGQgcmVxdWlyZSBydW50aW1lIHBhcnNpbmcgb2YgQ1NTIHNlbGVjdG9ycztcbiAqIC0gd2UgY2FuJ3QgaGF2ZSBvbmx5IGEgcGFyc2VkIGFzIHdlIGNhbid0IHJlLWNvbnN0cnVjdCB0ZXh0dWFsIGZvcm0gZnJvbSBpdCAoYXMgZW50ZXJlZCBieSBhXG4gKiB0ZW1wbGF0ZSBhdXRob3IpLlxuICpcbiAqIEBwYXJhbSBwcm9qZWN0aW9uU2xvdHM/IEEgY29sbGVjdGlvbiBvZiBwcm9qZWN0aW9uIHNsb3RzLiBBIHByb2plY3Rpb24gc2xvdCBjYW4gYmUgYmFzZWRcbiAqICAgICAgICBvbiBhIHBhcnNlZCBDU1Mgc2VsZWN0b3JzIG9yIHNldCB0byB0aGUgd2lsZGNhcmQgc2VsZWN0b3IgKFwiKlwiKSBpbiBvcmRlciB0byBtYXRjaFxuICogICAgICAgIGFsbCBub2RlcyB3aGljaCBkbyBub3QgbWF0Y2ggYW55IHNlbGVjdG9yLiBJZiBub3Qgc3BlY2lmaWVkLCBhIHNpbmdsZSB3aWxkY2FyZFxuICogICAgICAgIHNlbGVjdG9yIHByb2plY3Rpb24gc2xvdCB3aWxsIGJlIGRlZmluZWQuXG4gKlxuICogQGNvZGVHZW5BcGlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIMm1ybVwcm9qZWN0aW9uRGVmKHByb2plY3Rpb25TbG90cz86IFByb2plY3Rpb25TbG90cyk6IHZvaWQge1xuICBjb25zdCBjb21wb25lbnROb2RlID0gZmluZENvbXBvbmVudFZpZXcoZ2V0TFZpZXcoKSlbVF9IT1NUXSBhcyBURWxlbWVudE5vZGU7XG5cbiAgaWYgKCFjb21wb25lbnROb2RlLnByb2plY3Rpb24pIHtcbiAgICAvLyBJZiBubyBleHBsaWNpdCBwcm9qZWN0aW9uIHNsb3RzIGFyZSBkZWZpbmVkLCBmYWxsIGJhY2sgdG8gYSBzaW5nbGVcbiAgICAvLyBwcm9qZWN0aW9uIHNsb3Qgd2l0aCB0aGUgd2lsZGNhcmQgc2VsZWN0b3IuXG4gICAgY29uc3QgbnVtUHJvamVjdGlvblNsb3RzID0gcHJvamVjdGlvblNsb3RzID8gcHJvamVjdGlvblNsb3RzLmxlbmd0aCA6IDE7XG4gICAgY29uc3QgcHJvamVjdGlvbkhlYWRzOiAoVE5vZGUgfCBudWxsKVtdID0gY29tcG9uZW50Tm9kZS5wcm9qZWN0aW9uID1cbiAgICAgICAgbmV3IEFycmF5KG51bVByb2plY3Rpb25TbG90cykuZmlsbChudWxsKTtcbiAgICBjb25zdCB0YWlsczogKFROb2RlIHwgbnVsbClbXSA9IHByb2plY3Rpb25IZWFkcy5zbGljZSgpO1xuXG4gICAgbGV0IGNvbXBvbmVudENoaWxkOiBUTm9kZXxudWxsID0gY29tcG9uZW50Tm9kZS5jaGlsZDtcblxuICAgIHdoaWxlIChjb21wb25lbnRDaGlsZCAhPT0gbnVsbCkge1xuICAgICAgY29uc3Qgc2xvdEluZGV4ID1cbiAgICAgICAgICBwcm9qZWN0aW9uU2xvdHMgPyBtYXRjaGluZ1Byb2plY3Rpb25TbG90SW5kZXgoY29tcG9uZW50Q2hpbGQsIHByb2plY3Rpb25TbG90cykgOiAwO1xuXG4gICAgICBpZiAoc2xvdEluZGV4ICE9PSBudWxsKSB7XG4gICAgICAgIGlmICh0YWlsc1tzbG90SW5kZXhdKSB7XG4gICAgICAgICAgdGFpbHNbc2xvdEluZGV4XSAhLnByb2plY3Rpb25OZXh0ID0gY29tcG9uZW50Q2hpbGQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJvamVjdGlvbkhlYWRzW3Nsb3RJbmRleF0gPSBjb21wb25lbnRDaGlsZDtcbiAgICAgICAgfVxuICAgICAgICB0YWlsc1tzbG90SW5kZXhdID0gY29tcG9uZW50Q2hpbGQ7XG4gICAgICB9XG5cbiAgICAgIGNvbXBvbmVudENoaWxkID0gY29tcG9uZW50Q2hpbGQubmV4dDtcbiAgICB9XG4gIH1cbn1cblxuXG4vKipcbiAqIEluc2VydHMgcHJldmlvdXNseSByZS1kaXN0cmlidXRlZCBwcm9qZWN0ZWQgbm9kZXMuIFRoaXMgaW5zdHJ1Y3Rpb24gbXVzdCBiZSBwcmVjZWRlZCBieSBhIGNhbGxcbiAqIHRvIHRoZSBwcm9qZWN0aW9uRGVmIGluc3RydWN0aW9uLlxuICpcbiAqIEBwYXJhbSBub2RlSW5kZXhcbiAqIEBwYXJhbSBzZWxlY3RvckluZGV4OlxuICogICAgICAgIC0gMCB3aGVuIHRoZSBzZWxlY3RvciBpcyBgKmAgKG9yIHVuc3BlY2lmaWVkIGFzIHRoaXMgaXMgdGhlIGRlZmF1bHQgdmFsdWUpLFxuICogICAgICAgIC0gMSBiYXNlZCBpbmRleCBvZiB0aGUgc2VsZWN0b3IgZnJvbSB0aGUge0BsaW5rIHByb2plY3Rpb25EZWZ9XG4gKlxuICogQGNvZGVHZW5BcGlcbiovXG5leHBvcnQgZnVuY3Rpb24gybXJtXByb2plY3Rpb24oXG4gICAgbm9kZUluZGV4OiBudW1iZXIsIHNlbGVjdG9ySW5kZXg6IG51bWJlciA9IDAsIGF0dHJzPzogVEF0dHJpYnV0ZXMpOiB2b2lkIHtcbiAgY29uc3QgbFZpZXcgPSBnZXRMVmlldygpO1xuICBjb25zdCB0UHJvamVjdGlvbk5vZGUgPVxuICAgICAgY3JlYXRlTm9kZUF0SW5kZXgobm9kZUluZGV4LCBUTm9kZVR5cGUuUHJvamVjdGlvbiwgbnVsbCwgbnVsbCwgYXR0cnMgfHwgbnVsbCk7XG5cbiAgLy8gV2UgY2FuJ3QgdXNlIHZpZXdEYXRhW0hPU1RfTk9ERV0gYmVjYXVzZSBwcm9qZWN0aW9uIG5vZGVzIGNhbiBiZSBuZXN0ZWQgaW4gZW1iZWRkZWQgdmlld3MuXG4gIGlmICh0UHJvamVjdGlvbk5vZGUucHJvamVjdGlvbiA9PT0gbnVsbCkgdFByb2plY3Rpb25Ob2RlLnByb2plY3Rpb24gPSBzZWxlY3RvckluZGV4O1xuXG4gIC8vIGA8bmctY29udGVudD5gIGhhcyBubyBjb250ZW50XG4gIHNldElzUGFyZW50KGZhbHNlKTtcblxuICAvLyByZS1kaXN0cmlidXRpb24gb2YgcHJvamVjdGFibGUgbm9kZXMgaXMgc3RvcmVkIG9uIGEgY29tcG9uZW50J3MgdmlldyBsZXZlbFxuICBhcHBlbmRQcm9qZWN0ZWROb2RlcyhsVmlldywgdFByb2plY3Rpb25Ob2RlLCBzZWxlY3RvckluZGV4LCBmaW5kQ29tcG9uZW50VmlldyhsVmlldykpO1xufVxuIl19