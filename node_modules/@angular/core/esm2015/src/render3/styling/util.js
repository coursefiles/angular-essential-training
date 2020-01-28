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
import '../../util/ng_dev_mode';
import { getLContext } from '../context_discovery';
import { HEADER_OFFSET, HOST } from '../interfaces/view';
import { getTNode, isStylingContext } from '../util/view_utils';
import { CorePlayerHandler } from './core_player_handler';
import { DEFAULT_TEMPLATE_DIRECTIVE_INDEX } from './shared';
/** @type {?} */
export const ANIMATION_PROP_PREFIX = '@';
/**
 * @param {?=} wrappedElement
 * @param {?=} sanitizer
 * @param {?=} initialStyles
 * @param {?=} initialClasses
 * @return {?}
 */
export function createEmptyStylingContext(wrappedElement, sanitizer, initialStyles, initialClasses) {
    /** @type {?} */
    const context = [
        wrappedElement || null,
        0,
        (/** @type {?} */ ([])),
        initialStyles || [null, null],
        initialClasses || [null, null],
        [0, 0],
        [0],
        [0],
        null,
        null,
    ];
    // whenever a context is created there is always a `null` directive
    // that is registered (which is a placeholder for the "template").
    allocateOrUpdateDirectiveIntoContext(context, DEFAULT_TEMPLATE_DIRECTIVE_INDEX);
    return context;
}
/**
 * Allocates (registers) a directive into the directive registry within the provided styling
 * context.
 *
 * For each and every `[style]`, `[style.prop]`, `[class]`, `[class.name]` binding
 * (as well as static style and class attributes) a directive, component or template
 * is marked as the owner. When an owner is determined (this happens when the template
 * is first passed over) the directive owner is allocated into the styling context. When
 * this happens, each owner gets its own index value. This then ensures that once any
 * style and/or class binding are assigned into the context then they are marked to
 * that directive's index value.
 *
 * @param {?} context the target StylingContext
 * @param {?} directiveIndex
 * @param {?=} singlePropValuesIndex
 * @param {?=} styleSanitizer
 * @return {?} the index where the directive was inserted into
 */
export function allocateOrUpdateDirectiveIntoContext(context, directiveIndex, singlePropValuesIndex = -1, styleSanitizer) {
    /** @type {?} */
    const directiveRegistry = context[2 /* DirectiveRegistryPosition */];
    /** @type {?} */
    const index = directiveIndex * 2 /* Size */;
    // we preemptively make space into the directives array and then
    // assign values slot-by-slot to ensure that if the directive ordering
    // changes then it will still function
    /** @type {?} */
    const limit = index + 2 /* Size */;
    for (let i = directiveRegistry.length; i < limit; i += 2 /* Size */) {
        // -1 is used to signal that the directive has been allocated, but
        // no actual style or class bindings have been registered yet...
        directiveRegistry.push(-1, null);
    }
    /** @type {?} */
    const propValuesStartPosition = index + 0 /* SinglePropValuesIndexOffset */;
    if (singlePropValuesIndex >= 0 && directiveRegistry[propValuesStartPosition] === -1) {
        directiveRegistry[propValuesStartPosition] = singlePropValuesIndex;
        directiveRegistry[index + 1 /* StyleSanitizerOffset */] =
            styleSanitizer || null;
    }
}
/**
 * Used clone a copy of a pre-computed template of a styling context.
 *
 * A pre-computed template is designed to be computed once for a given element
 * (instructions.ts has logic for caching this).
 * @param {?} element
 * @param {?} templateStyleContext
 * @return {?}
 */
export function allocStylingContext(element, templateStyleContext) {
    // each instance gets a copy
    /** @type {?} */
    const context = (/** @type {?} */ ((/** @type {?} */ (templateStyleContext.slice()))));
    // the HEADER values contain arrays which also need
    // to be copied over into the new context
    for (let i = 0; i < 10 /* SingleStylesStartPosition */; i++) {
        /** @type {?} */
        const value = templateStyleContext[i];
        if (Array.isArray(value)) {
            context[i] = value.slice();
        }
    }
    context[0 /* ElementPosition */] = element;
    // this will prevent any other directives from extending the context
    context[1 /* MasterFlagPosition */] |= 16 /* BindingAllocationLocked */;
    return context;
}
/**
 * Retrieve the `StylingContext` at a given index.
 *
 * This method lazily creates the `StylingContext`. This is because in most cases
 * we have styling without any bindings. Creating `StylingContext` eagerly would mean that
 * every style declaration such as `<div style="color: red">` would result `StyleContext`
 * which would create unnecessary memory pressure.
 *
 * @param {?} index Index of the style allocation. See: `elementStyling`.
 * @param {?} viewData The view to search for the styling context
 * @return {?}
 */
export function getStylingContextFromLView(index, viewData) {
    /** @type {?} */
    let storageIndex = index;
    /** @type {?} */
    let slotValue = viewData[storageIndex];
    /** @type {?} */
    let wrapper = viewData;
    while (Array.isArray(slotValue)) {
        wrapper = slotValue;
        slotValue = (/** @type {?} */ (slotValue[HOST]));
    }
    if (isStylingContext(wrapper)) {
        return wrapper;
    }
    else {
        // This is an LView or an LContainer
        /** @type {?} */
        const stylingTemplate = getTNode(index - HEADER_OFFSET, viewData).stylingTemplate;
        if (wrapper !== viewData) {
            storageIndex = HOST;
        }
        return wrapper[storageIndex] = stylingTemplate ?
            allocStylingContext(slotValue, stylingTemplate) :
            createEmptyStylingContext(slotValue);
    }
}
/**
 * @param {?} name
 * @return {?}
 */
export function isAnimationProp(name) {
    return name[0] === ANIMATION_PROP_PREFIX;
}
/**
 * @param {?} tNode
 * @return {?}
 */
export function hasClassInput(tNode) {
    return (tNode.flags & 8 /* hasClassInput */) !== 0;
}
/**
 * @param {?} tNode
 * @return {?}
 */
export function hasStyleInput(tNode) {
    return (tNode.flags & 16 /* hasStyleInput */) !== 0;
}
/**
 * @param {?} classes
 * @return {?}
 */
export function forceClassesAsString(classes) {
    if (classes && typeof classes !== 'string') {
        classes = Object.keys(classes).join(' ');
    }
    return ((/** @type {?} */ (classes))) || '';
}
/**
 * @param {?} styles
 * @return {?}
 */
export function forceStylesAsString(styles) {
    /** @type {?} */
    let str = '';
    if (styles) {
        /** @type {?} */
        const props = Object.keys(styles);
        for (let i = 0; i < props.length; i++) {
            /** @type {?} */
            const prop = props[i];
            str += (i ? ';' : '') + `${prop}:${styles[prop]}`;
        }
    }
    return str;
}
/**
 * @param {?} playerContext
 * @param {?} rootContext
 * @param {?} element
 * @param {?} player
 * @param {?} playerContextIndex
 * @param {?=} ref
 * @return {?}
 */
export function addPlayerInternal(playerContext, rootContext, element, player, playerContextIndex, ref) {
    ref = ref || element;
    if (playerContextIndex) {
        playerContext[playerContextIndex] = player;
    }
    else {
        playerContext.push(player);
    }
    if (player) {
        player.addEventListener(200 /* Destroyed */, (/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            const index = playerContext.indexOf(player);
            /** @type {?} */
            const nonFactoryPlayerIndex = playerContext[0 /* NonBuilderPlayersStart */];
            // if the player is being removed from the factory side of the context
            // (which is where the [style] and [class] bindings do their thing) then
            // that side of the array cannot be resized since the respective bindings
            // have pointer index values that point to the associated factory instance
            if (index) {
                if (index < nonFactoryPlayerIndex) {
                    playerContext[index] = null;
                }
                else {
                    playerContext.splice(index, 1);
                }
            }
            player.destroy();
        }));
        /** @type {?} */
        const playerHandler = rootContext.playerHandler || (rootContext.playerHandler = new CorePlayerHandler());
        playerHandler.queuePlayer(player, ref);
        return true;
    }
    return false;
}
/**
 * @param {?} playerContext
 * @return {?}
 */
export function getPlayersInternal(playerContext) {
    /** @type {?} */
    const players = [];
    /** @type {?} */
    const nonFactoryPlayersStart = playerContext[0 /* NonBuilderPlayersStart */];
    // add all factory-based players (which are apart of [style] and [class] bindings)
    for (let i = 1 /* PlayerBuildersStartPosition */ + 1 /* PlayerOffsetPosition */; i < nonFactoryPlayersStart; i += 2 /* PlayerAndPlayerBuildersTupleSize */) {
        /** @type {?} */
        const player = (/** @type {?} */ (playerContext[i]));
        if (player) {
            players.push(player);
        }
    }
    // add all custom players (not apart of [style] and [class] bindings)
    for (let i = nonFactoryPlayersStart; i < playerContext.length; i++) {
        players.push((/** @type {?} */ (playerContext[i])));
    }
    return players;
}
/**
 * @param {?} target
 * @param {?=} context
 * @return {?}
 */
export function getOrCreatePlayerContext(target, context) {
    context = context || (/** @type {?} */ (getLContext(target)));
    if (!context) {
        ngDevMode && throwInvalidRefError();
        return null;
    }
    const { lView, nodeIndex } = context;
    /** @type {?} */
    const stylingContext = getStylingContextFromLView(nodeIndex, lView);
    return getPlayerContext(stylingContext) || allocPlayerContext(stylingContext);
}
/**
 * @param {?} stylingContext
 * @return {?}
 */
export function getPlayerContext(stylingContext) {
    return stylingContext[9 /* PlayerContext */];
}
/**
 * @param {?} data
 * @return {?}
 */
export function allocPlayerContext(data) {
    return data[9 /* PlayerContext */] =
        [5 /* SinglePlayerBuildersStartPosition */, null, null, null, null];
}
/**
 * @return {?}
 */
export function throwInvalidRefError() {
    throw new Error('Only elements that exist in an Angular application can be used for animations');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3JlbmRlcjMvc3R5bGluZy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBT0EsT0FBTyx3QkFBd0IsQ0FBQztBQUdoQyxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFPakQsT0FBTyxFQUFDLGFBQWEsRUFBRSxJQUFJLEVBQXFCLE1BQU0sb0JBQW9CLENBQUM7QUFDM0UsT0FBTyxFQUFDLFFBQVEsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBRTlELE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3hELE9BQU8sRUFBQyxnQ0FBZ0MsRUFBQyxNQUFNLFVBQVUsQ0FBQzs7QUFFMUQsTUFBTSxPQUFPLHFCQUFxQixHQUFHLEdBQUc7Ozs7Ozs7O0FBRXhDLE1BQU0sVUFBVSx5QkFBeUIsQ0FDckMsY0FBcUQsRUFBRSxTQUFrQyxFQUN6RixhQUEyQyxFQUMzQyxjQUE0Qzs7VUFDeEMsT0FBTyxHQUFtQjtRQUM5QixjQUFjLElBQUksSUFBSTtRQUN0QixDQUFDO1FBQ0QsbUJBQUEsRUFBRSxFQUFPO1FBQ1QsYUFBYSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztRQUM3QixjQUFjLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO1FBQzlCLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNOLENBQUMsQ0FBQyxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJO1FBQ0osSUFBSTtLQUNMO0lBRUQsbUVBQW1FO0lBQ25FLGtFQUFrRTtJQUNsRSxvQ0FBb0MsQ0FBQyxPQUFPLEVBQUUsZ0NBQWdDLENBQUMsQ0FBQztJQUNoRixPQUFPLE9BQU8sQ0FBQztBQUNqQixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7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LENBQUMsQ0FBQztBQUNyRixDQUFDOzs7O0FBRUQsTUFBTSxVQUFVLG9CQUFvQjtJQUNsQyxNQUFNLElBQUksS0FBSyxDQUFDLCtFQUErRSxDQUFDLENBQUM7QUFDbkcsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCAnLi4vLi4vdXRpbC9uZ19kZXZfbW9kZSc7XG5cbmltcG9ydCB7U3R5bGVTYW5pdGl6ZUZufSBmcm9tICcuLi8uLi9zYW5pdGl6YXRpb24vc3R5bGVfc2FuaXRpemVyJztcbmltcG9ydCB7Z2V0TENvbnRleHR9IGZyb20gJy4uL2NvbnRleHRfZGlzY292ZXJ5JztcbmltcG9ydCB7TENvbnRhaW5lcn0gZnJvbSAnLi4vaW50ZXJmYWNlcy9jb250YWluZXInO1xuaW1wb3J0IHtMQ29udGV4dH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9jb250ZXh0JztcbmltcG9ydCB7QXR0cmlidXRlTWFya2VyLCBUQXR0cmlidXRlcywgVE5vZGUsIFROb2RlRmxhZ3N9IGZyb20gJy4uL2ludGVyZmFjZXMvbm9kZSc7XG5pbXBvcnQge1BsYXlTdGF0ZSwgUGxheWVyLCBQbGF5ZXJDb250ZXh0LCBQbGF5ZXJJbmRleH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9wbGF5ZXInO1xuaW1wb3J0IHtSRWxlbWVudH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9yZW5kZXJlcic7XG5pbXBvcnQge0RpcmVjdGl2ZVJlZ2lzdHJ5VmFsdWVzSW5kZXgsIEluaXRpYWxTdHlsaW5nVmFsdWVzLCBTdHlsaW5nQ29udGV4dCwgU3R5bGluZ0ZsYWdzLCBTdHlsaW5nSW5kZXh9IGZyb20gJy4uL2ludGVyZmFjZXMvc3R5bGluZyc7XG5pbXBvcnQge0hFQURFUl9PRkZTRVQsIEhPU1QsIExWaWV3LCBSb290Q29udGV4dH0gZnJvbSAnLi4vaW50ZXJmYWNlcy92aWV3JztcbmltcG9ydCB7Z2V0VE5vZGUsIGlzU3R5bGluZ0NvbnRleHR9IGZyb20gJy4uL3V0aWwvdmlld191dGlscyc7XG5cbmltcG9ydCB7Q29yZVBsYXllckhhbmRsZXJ9IGZyb20gJy4vY29yZV9wbGF5ZXJfaGFuZGxlcic7XG5pbXBvcnQge0RFRkFVTFRfVEVNUExBVEVfRElSRUNUSVZFX0lOREVYfSBmcm9tICcuL3NoYXJlZCc7XG5cbmV4cG9ydCBjb25zdCBBTklNQVRJT05fUFJPUF9QUkVGSVggPSAnQCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFbXB0eVN0eWxpbmdDb250ZXh0KFxuICAgIHdyYXBwZWRFbGVtZW50PzogTENvbnRhaW5lciB8IExWaWV3IHwgUkVsZW1lbnQgfCBudWxsLCBzYW5pdGl6ZXI/OiBTdHlsZVNhbml0aXplRm4gfCBudWxsLFxuICAgIGluaXRpYWxTdHlsZXM/OiBJbml0aWFsU3R5bGluZ1ZhbHVlcyB8IG51bGwsXG4gICAgaW5pdGlhbENsYXNzZXM/OiBJbml0aWFsU3R5bGluZ1ZhbHVlcyB8IG51bGwpOiBTdHlsaW5nQ29udGV4dCB7XG4gIGNvbnN0IGNvbnRleHQ6IFN0eWxpbmdDb250ZXh0ID0gW1xuICAgIHdyYXBwZWRFbGVtZW50IHx8IG51bGwsICAgICAgICAgIC8vIEVsZW1lbnRcbiAgICAwLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNYXN0ZXJGbGFnc1xuICAgIFtdIGFzIGFueSwgICAgICAgICAgICAgICAgICAgICAgIC8vIERpcmVjdGl2ZVJlZnMgKHRoaXMgZ2V0cyBmaWxsZWQgYmVsb3cpXG4gICAgaW5pdGlhbFN0eWxlcyB8fCBbbnVsbCwgbnVsbF0sICAgLy8gSW5pdGlhbFN0eWxlc1xuICAgIGluaXRpYWxDbGFzc2VzIHx8IFtudWxsLCBudWxsXSwgIC8vIEluaXRpYWxDbGFzc2VzXG4gICAgWzAsIDBdLCAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2luZ2xlUHJvcE9mZnNldHNcbiAgICBbMF0sICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDYWNoZWRNdWx0aUNsYXNzVmFsdWVcbiAgICBbMF0sICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDYWNoZWRNdWx0aVN0eWxlVmFsdWVcbiAgICBudWxsLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBIb3N0QnVmZmVyXG4gICAgbnVsbCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUGxheWVyQ29udGV4dFxuICBdO1xuXG4gIC8vIHdoZW5ldmVyIGEgY29udGV4dCBpcyBjcmVhdGVkIHRoZXJlIGlzIGFsd2F5cyBhIGBudWxsYCBkaXJlY3RpdmVcbiAgLy8gdGhhdCBpcyByZWdpc3RlcmVkICh3aGljaCBpcyBhIHBsYWNlaG9sZGVyIGZvciB0aGUgXCJ0ZW1wbGF0ZVwiKS5cbiAgYWxsb2NhdGVPclVwZGF0ZURpcmVjdGl2ZUludG9Db250ZXh0KGNvbnRleHQsIERFRkFVTFRfVEVNUExBVEVfRElSRUNUSVZFX0lOREVYKTtcbiAgcmV0dXJuIGNvbnRleHQ7XG59XG5cbi8qKlxuICogQWxsb2NhdGVzIChyZWdpc3RlcnMpIGEgZGlyZWN0aXZlIGludG8gdGhlIGRpcmVjdGl2ZSByZWdpc3RyeSB3aXRoaW4gdGhlIHByb3ZpZGVkIHN0eWxpbmdcbiAqIGNvbnRleHQuXG4gKlxuICogRm9yIGVhY2ggYW5kIGV2ZXJ5IGBbc3R5bGVdYCwgYFtzdHlsZS5wcm9wXWAsIGBbY2xhc3NdYCwgYFtjbGFzcy5uYW1lXWAgYmluZGluZ1xuICogKGFzIHdlbGwgYXMgc3RhdGljIHN0eWxlIGFuZCBjbGFzcyBhdHRyaWJ1dGVzKSBhIGRpcmVjdGl2ZSwgY29tcG9uZW50IG9yIHRlbXBsYXRlXG4gKiBpcyBtYXJrZWQgYXMgdGhlIG93bmVyLiBXaGVuIGFuIG93bmVyIGlzIGRldGVybWluZWQgKHRoaXMgaGFwcGVucyB3aGVuIHRoZSB0ZW1wbGF0ZVxuICogaXMgZmlyc3QgcGFzc2VkIG92ZXIpIHRoZSBkaXJlY3RpdmUgb3duZXIgaXMgYWxsb2NhdGVkIGludG8gdGhlIHN0eWxpbmcgY29udGV4dC4gV2hlblxuICogdGhpcyBoYXBwZW5zLCBlYWNoIG93bmVyIGdldHMgaXRzIG93biBpbmRleCB2YWx1ZS4gVGhpcyB0aGVuIGVuc3VyZXMgdGhhdCBvbmNlIGFueVxuICogc3R5bGUgYW5kL29yIGNsYXNzIGJpbmRpbmcgYXJlIGFzc2lnbmVkIGludG8gdGhlIGNvbnRleHQgdGhlbiB0aGV5IGFyZSBtYXJrZWQgdG9cbiAqIHRoYXQgZGlyZWN0aXZlJ3MgaW5kZXggdmFsdWUuXG4gKlxuICogQHBhcmFtIGNvbnRleHQgdGhlIHRhcmdldCBTdHlsaW5nQ29udGV4dFxuICogQHBhcmFtIGRpcmVjdGl2ZVJlZiB0aGUgZGlyZWN0aXZlIHRoYXQgd2lsbCBiZSBhbGxvY2F0ZWQgaW50byB0aGUgY29udGV4dFxuICogQHJldHVybnMgdGhlIGluZGV4IHdoZXJlIHRoZSBkaXJlY3RpdmUgd2FzIGluc2VydGVkIGludG9cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFsbG9jYXRlT3JVcGRhdGVEaXJlY3RpdmVJbnRvQ29udGV4dChcbiAgICBjb250ZXh0OiBTdHlsaW5nQ29udGV4dCwgZGlyZWN0aXZlSW5kZXg6IG51bWJlciwgc2luZ2xlUHJvcFZhbHVlc0luZGV4OiBudW1iZXIgPSAtMSxcbiAgICBzdHlsZVNhbml0aXplcj86IFN0eWxlU2FuaXRpemVGbiB8IG51bGwgfCB1bmRlZmluZWQpOiB2b2lkIHtcbiAgY29uc3QgZGlyZWN0aXZlUmVnaXN0cnkgPSBjb250ZXh0W1N0eWxpbmdJbmRleC5EaXJlY3RpdmVSZWdpc3RyeVBvc2l0aW9uXTtcblxuICBjb25zdCBpbmRleCA9IGRpcmVjdGl2ZUluZGV4ICogRGlyZWN0aXZlUmVnaXN0cnlWYWx1ZXNJbmRleC5TaXplO1xuICAvLyB3ZSBwcmVlbXB0aXZlbHkgbWFrZSBzcGFjZSBpbnRvIHRoZSBkaXJlY3RpdmVzIGFycmF5IGFuZCB0aGVuXG4gIC8vIGFzc2lnbiB2YWx1ZXMgc2xvdC1ieS1zbG90IHRvIGVuc3VyZSB0aGF0IGlmIHRoZSBkaXJlY3RpdmUgb3JkZXJpbmdcbiAgLy8gY2hhbmdlcyB0aGVuIGl0IHdpbGwgc3RpbGwgZnVuY3Rpb25cbiAgY29uc3QgbGltaXQgPSBpbmRleCArIERpcmVjdGl2ZVJlZ2lzdHJ5VmFsdWVzSW5kZXguU2l6ZTtcbiAgZm9yIChsZXQgaSA9IGRpcmVjdGl2ZVJlZ2lzdHJ5Lmxlbmd0aDsgaSA8IGxpbWl0OyBpICs9IERpcmVjdGl2ZVJlZ2lzdHJ5VmFsdWVzSW5kZXguU2l6ZSkge1xuICAgIC8vIC0xIGlzIHVzZWQgdG8gc2lnbmFsIHRoYXQgdGhlIGRpcmVjdGl2ZSBoYXMgYmVlbiBhbGxvY2F0ZWQsIGJ1dFxuICAgIC8vIG5vIGFjdHVhbCBzdHlsZSBvciBjbGFzcyBiaW5kaW5ncyBoYXZlIGJlZW4gcmVnaXN0ZXJlZCB5ZXQuLi5cbiAgICBkaXJlY3RpdmVSZWdpc3RyeS5wdXNoKC0xLCBudWxsKTtcbiAgfVxuXG4gIGNvbnN0IHByb3BWYWx1ZXNTdGFydFBvc2l0aW9uID0gaW5kZXggKyBEaXJlY3RpdmVSZWdpc3RyeVZhbHVlc0luZGV4LlNpbmdsZVByb3BWYWx1ZXNJbmRleE9mZnNldDtcbiAgaWYgKHNpbmdsZVByb3BWYWx1ZXNJbmRleCA+PSAwICYmIGRpcmVjdGl2ZVJlZ2lzdHJ5W3Byb3BWYWx1ZXNTdGFydFBvc2l0aW9uXSA9PT0gLTEpIHtcbiAgICBkaXJlY3RpdmVSZWdpc3RyeVtwcm9wVmFsdWVzU3RhcnRQb3NpdGlvbl0gPSBzaW5nbGVQcm9wVmFsdWVzSW5kZXg7XG4gICAgZGlyZWN0aXZlUmVnaXN0cnlbaW5kZXggKyBEaXJlY3RpdmVSZWdpc3RyeVZhbHVlc0luZGV4LlN0eWxlU2FuaXRpemVyT2Zmc2V0XSA9XG4gICAgICAgIHN0eWxlU2FuaXRpemVyIHx8IG51bGw7XG4gIH1cbn1cblxuLyoqXG4gKiBVc2VkIGNsb25lIGEgY29weSBvZiBhIHByZS1jb21wdXRlZCB0ZW1wbGF0ZSBvZiBhIHN0eWxpbmcgY29udGV4dC5cbiAqXG4gKiBBIHByZS1jb21wdXRlZCB0ZW1wbGF0ZSBpcyBkZXNpZ25lZCB0byBiZSBjb21wdXRlZCBvbmNlIGZvciBhIGdpdmVuIGVsZW1lbnRcbiAqIChpbnN0cnVjdGlvbnMudHMgaGFzIGxvZ2ljIGZvciBjYWNoaW5nIHRoaXMpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYWxsb2NTdHlsaW5nQ29udGV4dChcbiAgICBlbGVtZW50OiBSRWxlbWVudCB8IG51bGwsIHRlbXBsYXRlU3R5bGVDb250ZXh0OiBTdHlsaW5nQ29udGV4dCk6IFN0eWxpbmdDb250ZXh0IHtcbiAgLy8gZWFjaCBpbnN0YW5jZSBnZXRzIGEgY29weVxuICBjb25zdCBjb250ZXh0ID0gdGVtcGxhdGVTdHlsZUNvbnRleHQuc2xpY2UoKSBhcyBhbnkgYXMgU3R5bGluZ0NvbnRleHQ7XG5cbiAgLy8gdGhlIEhFQURFUiB2YWx1ZXMgY29udGFpbiBhcnJheXMgd2hpY2ggYWxzbyBuZWVkXG4gIC8vIHRvIGJlIGNvcGllZCBvdmVyIGludG8gdGhlIG5ldyBjb250ZXh0XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgU3R5bGluZ0luZGV4LlNpbmdsZVN0eWxlc1N0YXJ0UG9zaXRpb247IGkrKykge1xuICAgIGNvbnN0IHZhbHVlID0gdGVtcGxhdGVTdHlsZUNvbnRleHRbaV07XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICBjb250ZXh0W2ldID0gdmFsdWUuc2xpY2UoKTtcbiAgICB9XG4gIH1cblxuICBjb250ZXh0W1N0eWxpbmdJbmRleC5FbGVtZW50UG9zaXRpb25dID0gZWxlbWVudDtcblxuICAvLyB0aGlzIHdpbGwgcHJldmVudCBhbnkgb3RoZXIgZGlyZWN0aXZlcyBmcm9tIGV4dGVuZGluZyB0aGUgY29udGV4dFxuICBjb250ZXh0W1N0eWxpbmdJbmRleC5NYXN0ZXJGbGFnUG9zaXRpb25dIHw9IFN0eWxpbmdGbGFncy5CaW5kaW5nQWxsb2NhdGlvbkxvY2tlZDtcbiAgcmV0dXJuIGNvbnRleHQ7XG59XG5cbi8qKlxuICogUmV0cmlldmUgdGhlIGBTdHlsaW5nQ29udGV4dGAgYXQgYSBnaXZlbiBpbmRleC5cbiAqXG4gKiBUaGlzIG1ldGhvZCBsYXppbHkgY3JlYXRlcyB0aGUgYFN0eWxpbmdDb250ZXh0YC4gVGhpcyBpcyBiZWNhdXNlIGluIG1vc3QgY2FzZXNcbiAqIHdlIGhhdmUgc3R5bGluZyB3aXRob3V0IGFueSBiaW5kaW5ncy4gQ3JlYXRpbmcgYFN0eWxpbmdDb250ZXh0YCBlYWdlcmx5IHdvdWxkIG1lYW4gdGhhdFxuICogZXZlcnkgc3R5bGUgZGVjbGFyYXRpb24gc3VjaCBhcyBgPGRpdiBzdHlsZT1cImNvbG9yOiByZWRcIj5gIHdvdWxkIHJlc3VsdCBgU3R5bGVDb250ZXh0YFxuICogd2hpY2ggd291bGQgY3JlYXRlIHVubmVjZXNzYXJ5IG1lbW9yeSBwcmVzc3VyZS5cbiAqXG4gKiBAcGFyYW0gaW5kZXggSW5kZXggb2YgdGhlIHN0eWxlIGFsbG9jYXRpb24uIFNlZTogYGVsZW1lbnRTdHlsaW5nYC5cbiAqIEBwYXJhbSB2aWV3RGF0YSBUaGUgdmlldyB0byBzZWFyY2ggZm9yIHRoZSBzdHlsaW5nIGNvbnRleHRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFN0eWxpbmdDb250ZXh0RnJvbUxWaWV3KGluZGV4OiBudW1iZXIsIHZpZXdEYXRhOiBMVmlldyk6IFN0eWxpbmdDb250ZXh0IHtcbiAgbGV0IHN0b3JhZ2VJbmRleCA9IGluZGV4O1xuICBsZXQgc2xvdFZhbHVlOiBMQ29udGFpbmVyfExWaWV3fFN0eWxpbmdDb250ZXh0fFJFbGVtZW50ID0gdmlld0RhdGFbc3RvcmFnZUluZGV4XTtcbiAgbGV0IHdyYXBwZXI6IExDb250YWluZXJ8TFZpZXd8U3R5bGluZ0NvbnRleHQgPSB2aWV3RGF0YTtcblxuICB3aGlsZSAoQXJyYXkuaXNBcnJheShzbG90VmFsdWUpKSB7XG4gICAgd3JhcHBlciA9IHNsb3RWYWx1ZTtcbiAgICBzbG90VmFsdWUgPSBzbG90VmFsdWVbSE9TVF0gYXMgTFZpZXcgfCBTdHlsaW5nQ29udGV4dCB8IFJFbGVtZW50O1xuICB9XG5cbiAgaWYgKGlzU3R5bGluZ0NvbnRleHQod3JhcHBlcikpIHtcbiAgICByZXR1cm4gd3JhcHBlcjtcbiAgfSBlbHNlIHtcbiAgICAvLyBUaGlzIGlzIGFuIExWaWV3IG9yIGFuIExDb250YWluZXJcbiAgICBjb25zdCBzdHlsaW5nVGVtcGxhdGUgPSBnZXRUTm9kZShpbmRleCAtIEhFQURFUl9PRkZTRVQsIHZpZXdEYXRhKS5zdHlsaW5nVGVtcGxhdGU7XG5cbiAgICBpZiAod3JhcHBlciAhPT0gdmlld0RhdGEpIHtcbiAgICAgIHN0b3JhZ2VJbmRleCA9IEhPU1Q7XG4gICAgfVxuXG4gICAgcmV0dXJuIHdyYXBwZXJbc3RvcmFnZUluZGV4XSA9IHN0eWxpbmdUZW1wbGF0ZSA/XG4gICAgICAgIGFsbG9jU3R5bGluZ0NvbnRleHQoc2xvdFZhbHVlLCBzdHlsaW5nVGVtcGxhdGUpIDpcbiAgICAgICAgY3JlYXRlRW1wdHlTdHlsaW5nQ29udGV4dChzbG90VmFsdWUpO1xuICB9XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQW5pbWF0aW9uUHJvcChuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIG5hbWVbMF0gPT09IEFOSU1BVElPTl9QUk9QX1BSRUZJWDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhc0NsYXNzSW5wdXQodE5vZGU6IFROb2RlKSB7XG4gIHJldHVybiAodE5vZGUuZmxhZ3MgJiBUTm9kZUZsYWdzLmhhc0NsYXNzSW5wdXQpICE9PSAwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzU3R5bGVJbnB1dCh0Tm9kZTogVE5vZGUpIHtcbiAgcmV0dXJuICh0Tm9kZS5mbGFncyAmIFROb2RlRmxhZ3MuaGFzU3R5bGVJbnB1dCkgIT09IDA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JjZUNsYXNzZXNBc1N0cmluZyhjbGFzc2VzOiBzdHJpbmcgfCB7W2tleTogc3RyaW5nXTogYW55fSB8IG51bGwgfCB1bmRlZmluZWQpOlxuICAgIHN0cmluZyB7XG4gIGlmIChjbGFzc2VzICYmIHR5cGVvZiBjbGFzc2VzICE9PSAnc3RyaW5nJykge1xuICAgIGNsYXNzZXMgPSBPYmplY3Qua2V5cyhjbGFzc2VzKS5qb2luKCcgJyk7XG4gIH1cbiAgcmV0dXJuIChjbGFzc2VzIGFzIHN0cmluZykgfHwgJyc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JjZVN0eWxlc0FzU3RyaW5nKHN0eWxlczoge1trZXk6IHN0cmluZ106IGFueX0gfCBudWxsIHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgbGV0IHN0ciA9ICcnO1xuICBpZiAoc3R5bGVzKSB7XG4gICAgY29uc3QgcHJvcHMgPSBPYmplY3Qua2V5cyhzdHlsZXMpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHByb3AgPSBwcm9wc1tpXTtcbiAgICAgIHN0ciArPSAoaSA/ICc7JyA6ICcnKSArIGAke3Byb3B9OiR7c3R5bGVzW3Byb3BdfWA7XG4gICAgfVxuICB9XG4gIHJldHVybiBzdHI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRQbGF5ZXJJbnRlcm5hbChcbiAgICBwbGF5ZXJDb250ZXh0OiBQbGF5ZXJDb250ZXh0LCByb290Q29udGV4dDogUm9vdENvbnRleHQsIGVsZW1lbnQ6IEhUTUxFbGVtZW50LFxuICAgIHBsYXllcjogUGxheWVyIHwgbnVsbCwgcGxheWVyQ29udGV4dEluZGV4OiBudW1iZXIsIHJlZj86IGFueSk6IGJvb2xlYW4ge1xuICByZWYgPSByZWYgfHwgZWxlbWVudDtcbiAgaWYgKHBsYXllckNvbnRleHRJbmRleCkge1xuICAgIHBsYXllckNvbnRleHRbcGxheWVyQ29udGV4dEluZGV4XSA9IHBsYXllcjtcbiAgfSBlbHNlIHtcbiAgICBwbGF5ZXJDb250ZXh0LnB1c2gocGxheWVyKTtcbiAgfVxuXG4gIGlmIChwbGF5ZXIpIHtcbiAgICBwbGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcihQbGF5U3RhdGUuRGVzdHJveWVkLCAoKSA9PiB7XG4gICAgICBjb25zdCBpbmRleCA9IHBsYXllckNvbnRleHQuaW5kZXhPZihwbGF5ZXIpO1xuICAgICAgY29uc3Qgbm9uRmFjdG9yeVBsYXllckluZGV4ID0gcGxheWVyQ29udGV4dFtQbGF5ZXJJbmRleC5Ob25CdWlsZGVyUGxheWVyc1N0YXJ0XTtcblxuICAgICAgLy8gaWYgdGhlIHBsYXllciBpcyBiZWluZyByZW1vdmVkIGZyb20gdGhlIGZhY3Rvcnkgc2lkZSBvZiB0aGUgY29udGV4dFxuICAgICAgLy8gKHdoaWNoIGlzIHdoZXJlIHRoZSBbc3R5bGVdIGFuZCBbY2xhc3NdIGJpbmRpbmdzIGRvIHRoZWlyIHRoaW5nKSB0aGVuXG4gICAgICAvLyB0aGF0IHNpZGUgb2YgdGhlIGFycmF5IGNhbm5vdCBiZSByZXNpemVkIHNpbmNlIHRoZSByZXNwZWN0aXZlIGJpbmRpbmdzXG4gICAgICAvLyBoYXZlIHBvaW50ZXIgaW5kZXggdmFsdWVzIHRoYXQgcG9pbnQgdG8gdGhlIGFzc29jaWF0ZWQgZmFjdG9yeSBpbnN0YW5jZVxuICAgICAgaWYgKGluZGV4KSB7XG4gICAgICAgIGlmIChpbmRleCA8IG5vbkZhY3RvcnlQbGF5ZXJJbmRleCkge1xuICAgICAgICAgIHBsYXllckNvbnRleHRbaW5kZXhdID0gbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwbGF5ZXJDb250ZXh0LnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHBsYXllci5kZXN0cm95KCk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBwbGF5ZXJIYW5kbGVyID1cbiAgICAgICAgcm9vdENvbnRleHQucGxheWVySGFuZGxlciB8fCAocm9vdENvbnRleHQucGxheWVySGFuZGxlciA9IG5ldyBDb3JlUGxheWVySGFuZGxlcigpKTtcbiAgICBwbGF5ZXJIYW5kbGVyLnF1ZXVlUGxheWVyKHBsYXllciwgcmVmKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBsYXllcnNJbnRlcm5hbChwbGF5ZXJDb250ZXh0OiBQbGF5ZXJDb250ZXh0KTogUGxheWVyW10ge1xuICBjb25zdCBwbGF5ZXJzOiBQbGF5ZXJbXSA9IFtdO1xuICBjb25zdCBub25GYWN0b3J5UGxheWVyc1N0YXJ0ID0gcGxheWVyQ29udGV4dFtQbGF5ZXJJbmRleC5Ob25CdWlsZGVyUGxheWVyc1N0YXJ0XTtcblxuICAvLyBhZGQgYWxsIGZhY3RvcnktYmFzZWQgcGxheWVycyAod2hpY2ggYXJlIGFwYXJ0IG9mIFtzdHlsZV0gYW5kIFtjbGFzc10gYmluZGluZ3MpXG4gIGZvciAobGV0IGkgPSBQbGF5ZXJJbmRleC5QbGF5ZXJCdWlsZGVyc1N0YXJ0UG9zaXRpb24gKyBQbGF5ZXJJbmRleC5QbGF5ZXJPZmZzZXRQb3NpdGlvbjtcbiAgICAgICBpIDwgbm9uRmFjdG9yeVBsYXllcnNTdGFydDsgaSArPSBQbGF5ZXJJbmRleC5QbGF5ZXJBbmRQbGF5ZXJCdWlsZGVyc1R1cGxlU2l6ZSkge1xuICAgIGNvbnN0IHBsYXllciA9IHBsYXllckNvbnRleHRbaV0gYXMgUGxheWVyIHwgbnVsbDtcbiAgICBpZiAocGxheWVyKSB7XG4gICAgICBwbGF5ZXJzLnB1c2gocGxheWVyKTtcbiAgICB9XG4gIH1cblxuICAvLyBhZGQgYWxsIGN1c3RvbSBwbGF5ZXJzIChub3QgYXBhcnQgb2YgW3N0eWxlXSBhbmQgW2NsYXNzXSBiaW5kaW5ncylcbiAgZm9yIChsZXQgaSA9IG5vbkZhY3RvcnlQbGF5ZXJzU3RhcnQ7IGkgPCBwbGF5ZXJDb250ZXh0Lmxlbmd0aDsgaSsrKSB7XG4gICAgcGxheWVycy5wdXNoKHBsYXllckNvbnRleHRbaV0gYXMgUGxheWVyKTtcbiAgfVxuXG4gIHJldHVybiBwbGF5ZXJzO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRPckNyZWF0ZVBsYXllckNvbnRleHQodGFyZ2V0OiB7fSwgY29udGV4dD86IExDb250ZXh0IHwgbnVsbCk6IFBsYXllckNvbnRleHR8XG4gICAgbnVsbCB7XG4gIGNvbnRleHQgPSBjb250ZXh0IHx8IGdldExDb250ZXh0KHRhcmdldCkgITtcbiAgaWYgKCFjb250ZXh0KSB7XG4gICAgbmdEZXZNb2RlICYmIHRocm93SW52YWxpZFJlZkVycm9yKCk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCB7bFZpZXcsIG5vZGVJbmRleH0gPSBjb250ZXh0O1xuICBjb25zdCBzdHlsaW5nQ29udGV4dCA9IGdldFN0eWxpbmdDb250ZXh0RnJvbUxWaWV3KG5vZGVJbmRleCwgbFZpZXcpO1xuICByZXR1cm4gZ2V0UGxheWVyQ29udGV4dChzdHlsaW5nQ29udGV4dCkgfHwgYWxsb2NQbGF5ZXJDb250ZXh0KHN0eWxpbmdDb250ZXh0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBsYXllckNvbnRleHQoc3R5bGluZ0NvbnRleHQ6IFN0eWxpbmdDb250ZXh0KTogUGxheWVyQ29udGV4dHxudWxsIHtcbiAgcmV0dXJuIHN0eWxpbmdDb250ZXh0W1N0eWxpbmdJbmRleC5QbGF5ZXJDb250ZXh0XTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFsbG9jUGxheWVyQ29udGV4dChkYXRhOiBTdHlsaW5nQ29udGV4dCk6IFBsYXllckNvbnRleHQge1xuICByZXR1cm4gZGF0YVtTdHlsaW5nSW5kZXguUGxheWVyQ29udGV4dF0gPVxuICAgICAgICAgICAgIFtQbGF5ZXJJbmRleC5TaW5nbGVQbGF5ZXJCdWlsZGVyc1N0YXJ0UG9zaXRpb24sIG51bGwsIG51bGwsIG51bGwsIG51bGxdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGhyb3dJbnZhbGlkUmVmRXJyb3IoKSB7XG4gIHRocm93IG5ldyBFcnJvcignT25seSBlbGVtZW50cyB0aGF0IGV4aXN0IGluIGFuIEFuZ3VsYXIgYXBwbGljYXRpb24gY2FuIGJlIHVzZWQgZm9yIGFuaW1hdGlvbnMnKTtcbn1cbiJdfQ==