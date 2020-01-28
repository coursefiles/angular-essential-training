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
import '../util/ng_dev_mode';
import { getLContext } from './context_discovery';
import { scheduleTick } from './instructions/shared';
import { addPlayerInternal, getOrCreatePlayerContext, getPlayerContext, getPlayersInternal, getStylingContextFromLView, throwInvalidRefError } from './styling/util';
import { getRootContext } from './util/view_traversal_utils';
/**
 * Adds a player to an element, directive or component instance that will later be
 * animated once change detection has passed.
 *
 * When a player is added to a reference it will stay active until `player.destroy()`
 * is called. Once called then the player will be removed from the active players
 * present on the associated ref instance.
 *
 * To get a list of all the active players on an element see [getPlayers].
 *
 * @param {?} ref The element, directive or component that the player will be placed on.
 * @param {?} player The player that will be triggered to play once change detection has run.
 * @return {?}
 */
export function addPlayer(ref, player) {
    /** @type {?} */
    const context = getLContext(ref);
    if (!context) {
        ngDevMode && throwInvalidRefError();
        return;
    }
    /** @type {?} */
    const element = (/** @type {?} */ (context.native));
    /** @type {?} */
    const lView = context.lView;
    /** @type {?} */
    const playerContext = (/** @type {?} */ (getOrCreatePlayerContext(element, context)));
    /** @type {?} */
    const rootContext = getRootContext(lView);
    addPlayerInternal(playerContext, rootContext, element, player, 0, ref);
    scheduleTick(rootContext, 2 /* FlushPlayers */);
}
/**
 * Returns a list of all the active players present on the provided ref instance (which can
 * be an instance of a directive, component or element).
 *
 * This function will only return players that have been added to the ref instance using
 * `addPlayer` or any players that are active through any template styling bindings
 * (`[style]`, `[style.prop]`, `[class]` and `[class.name]`).
 *
 * \@publicApi
 * @param {?} ref
 * @return {?}
 */
export function getPlayers(ref) {
    /** @type {?} */
    const context = getLContext(ref);
    if (!context) {
        ngDevMode && throwInvalidRefError();
        return [];
    }
    /** @type {?} */
    const stylingContext = getStylingContextFromLView(context.nodeIndex, context.lView);
    /** @type {?} */
    const playerContext = stylingContext ? getPlayerContext(stylingContext) : null;
    return playerContext ? getPlayersInternal(playerContext) : [];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3JlbmRlcjMvcGxheWVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQU9BLE9BQU8scUJBQXFCLENBQUM7QUFFN0IsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ2hELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUduRCxPQUFPLEVBQUMsaUJBQWlCLEVBQUUsd0JBQXdCLEVBQUUsZ0JBQWdCLEVBQUUsa0JBQWtCLEVBQUUsMEJBQTBCLEVBQUUsb0JBQW9CLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNuSyxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sNkJBQTZCLENBQUM7Ozs7Ozs7Ozs7Ozs7OztBQWdCM0QsTUFBTSxVQUFVLFNBQVMsQ0FDckIsR0FBd0QsRUFBRSxNQUFjOztVQUNwRSxPQUFPLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQztJQUNoQyxJQUFJLENBQUMsT0FBTyxFQUFFO1FBQ1osU0FBUyxJQUFJLG9CQUFvQixFQUFFLENBQUM7UUFDcEMsT0FBTztLQUNSOztVQUVLLE9BQU8sR0FBRyxtQkFBQSxPQUFPLENBQUMsTUFBTSxFQUFlOztVQUN2QyxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUs7O1VBQ3JCLGFBQWEsR0FBRyxtQkFBQSx3QkFBd0IsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEVBQUU7O1VBQzVELFdBQVcsR0FBRyxjQUFjLENBQUMsS0FBSyxDQUFDO0lBQ3pDLGlCQUFpQixDQUFDLGFBQWEsRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDdkUsWUFBWSxDQUFDLFdBQVcsdUJBQWdDLENBQUM7QUFDM0QsQ0FBQzs7Ozs7Ozs7Ozs7OztBQVlELE1BQU0sVUFBVSxVQUFVLENBQUMsR0FBd0Q7O1VBQzNFLE9BQU8sR0FBRyxXQUFXLENBQUMsR0FBRyxDQUFDO0lBQ2hDLElBQUksQ0FBQyxPQUFPLEVBQUU7UUFDWixTQUFTLElBQUksb0JBQW9CLEVBQUUsQ0FBQztRQUNwQyxPQUFPLEVBQUUsQ0FBQztLQUNYOztVQUVLLGNBQWMsR0FBRywwQkFBMEIsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUM7O1VBQzdFLGFBQWEsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO0lBQzlFLE9BQU8sYUFBYSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQ2hFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgJy4uL3V0aWwvbmdfZGV2X21vZGUnO1xuXG5pbXBvcnQge2dldExDb250ZXh0fSBmcm9tICcuL2NvbnRleHRfZGlzY292ZXJ5JztcbmltcG9ydCB7c2NoZWR1bGVUaWNrfSBmcm9tICcuL2luc3RydWN0aW9ucy9zaGFyZWQnO1xuaW1wb3J0IHtDb21wb25lbnRJbnN0YW5jZSwgRGlyZWN0aXZlSW5zdGFuY2UsIFBsYXllcn0gZnJvbSAnLi9pbnRlcmZhY2VzL3BsYXllcic7XG5pbXBvcnQge1Jvb3RDb250ZXh0RmxhZ3N9IGZyb20gJy4vaW50ZXJmYWNlcy92aWV3JztcbmltcG9ydCB7YWRkUGxheWVySW50ZXJuYWwsIGdldE9yQ3JlYXRlUGxheWVyQ29udGV4dCwgZ2V0UGxheWVyQ29udGV4dCwgZ2V0UGxheWVyc0ludGVybmFsLCBnZXRTdHlsaW5nQ29udGV4dEZyb21MVmlldywgdGhyb3dJbnZhbGlkUmVmRXJyb3J9IGZyb20gJy4vc3R5bGluZy91dGlsJztcbmltcG9ydCB7Z2V0Um9vdENvbnRleHR9IGZyb20gJy4vdXRpbC92aWV3X3RyYXZlcnNhbF91dGlscyc7XG5cblxuLyoqXG4gKiBBZGRzIGEgcGxheWVyIHRvIGFuIGVsZW1lbnQsIGRpcmVjdGl2ZSBvciBjb21wb25lbnQgaW5zdGFuY2UgdGhhdCB3aWxsIGxhdGVyIGJlXG4gKiBhbmltYXRlZCBvbmNlIGNoYW5nZSBkZXRlY3Rpb24gaGFzIHBhc3NlZC5cbiAqXG4gKiBXaGVuIGEgcGxheWVyIGlzIGFkZGVkIHRvIGEgcmVmZXJlbmNlIGl0IHdpbGwgc3RheSBhY3RpdmUgdW50aWwgYHBsYXllci5kZXN0cm95KClgXG4gKiBpcyBjYWxsZWQuIE9uY2UgY2FsbGVkIHRoZW4gdGhlIHBsYXllciB3aWxsIGJlIHJlbW92ZWQgZnJvbSB0aGUgYWN0aXZlIHBsYXllcnNcbiAqIHByZXNlbnQgb24gdGhlIGFzc29jaWF0ZWQgcmVmIGluc3RhbmNlLlxuICpcbiAqIFRvIGdldCBhIGxpc3Qgb2YgYWxsIHRoZSBhY3RpdmUgcGxheWVycyBvbiBhbiBlbGVtZW50IHNlZSBbZ2V0UGxheWVyc10uXG4gKlxuICogQHBhcmFtIHJlZiBUaGUgZWxlbWVudCwgZGlyZWN0aXZlIG9yIGNvbXBvbmVudCB0aGF0IHRoZSBwbGF5ZXIgd2lsbCBiZSBwbGFjZWQgb24uXG4gKiBAcGFyYW0gcGxheWVyIFRoZSBwbGF5ZXIgdGhhdCB3aWxsIGJlIHRyaWdnZXJlZCB0byBwbGF5IG9uY2UgY2hhbmdlIGRldGVjdGlvbiBoYXMgcnVuLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkUGxheWVyKFxuICAgIHJlZjogQ29tcG9uZW50SW5zdGFuY2UgfCBEaXJlY3RpdmVJbnN0YW5jZSB8IEhUTUxFbGVtZW50LCBwbGF5ZXI6IFBsYXllcik6IHZvaWQge1xuICBjb25zdCBjb250ZXh0ID0gZ2V0TENvbnRleHQocmVmKTtcbiAgaWYgKCFjb250ZXh0KSB7XG4gICAgbmdEZXZNb2RlICYmIHRocm93SW52YWxpZFJlZkVycm9yKCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgZWxlbWVudCA9IGNvbnRleHQubmF0aXZlIGFzIEhUTUxFbGVtZW50O1xuICBjb25zdCBsVmlldyA9IGNvbnRleHQubFZpZXc7XG4gIGNvbnN0IHBsYXllckNvbnRleHQgPSBnZXRPckNyZWF0ZVBsYXllckNvbnRleHQoZWxlbWVudCwgY29udGV4dCkgITtcbiAgY29uc3Qgcm9vdENvbnRleHQgPSBnZXRSb290Q29udGV4dChsVmlldyk7XG4gIGFkZFBsYXllckludGVybmFsKHBsYXllckNvbnRleHQsIHJvb3RDb250ZXh0LCBlbGVtZW50LCBwbGF5ZXIsIDAsIHJlZik7XG4gIHNjaGVkdWxlVGljayhyb290Q29udGV4dCwgUm9vdENvbnRleHRGbGFncy5GbHVzaFBsYXllcnMpO1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBsaXN0IG9mIGFsbCB0aGUgYWN0aXZlIHBsYXllcnMgcHJlc2VudCBvbiB0aGUgcHJvdmlkZWQgcmVmIGluc3RhbmNlICh3aGljaCBjYW5cbiAqIGJlIGFuIGluc3RhbmNlIG9mIGEgZGlyZWN0aXZlLCBjb21wb25lbnQgb3IgZWxlbWVudCkuXG4gKlxuICogVGhpcyBmdW5jdGlvbiB3aWxsIG9ubHkgcmV0dXJuIHBsYXllcnMgdGhhdCBoYXZlIGJlZW4gYWRkZWQgdG8gdGhlIHJlZiBpbnN0YW5jZSB1c2luZ1xuICogYGFkZFBsYXllcmAgb3IgYW55IHBsYXllcnMgdGhhdCBhcmUgYWN0aXZlIHRocm91Z2ggYW55IHRlbXBsYXRlIHN0eWxpbmcgYmluZGluZ3NcbiAqIChgW3N0eWxlXWAsIGBbc3R5bGUucHJvcF1gLCBgW2NsYXNzXWAgYW5kIGBbY2xhc3MubmFtZV1gKS5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRQbGF5ZXJzKHJlZjogQ29tcG9uZW50SW5zdGFuY2UgfCBEaXJlY3RpdmVJbnN0YW5jZSB8IEhUTUxFbGVtZW50KTogUGxheWVyW10ge1xuICBjb25zdCBjb250ZXh0ID0gZ2V0TENvbnRleHQocmVmKTtcbiAgaWYgKCFjb250ZXh0KSB7XG4gICAgbmdEZXZNb2RlICYmIHRocm93SW52YWxpZFJlZkVycm9yKCk7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY29uc3Qgc3R5bGluZ0NvbnRleHQgPSBnZXRTdHlsaW5nQ29udGV4dEZyb21MVmlldyhjb250ZXh0Lm5vZGVJbmRleCwgY29udGV4dC5sVmlldyk7XG4gIGNvbnN0IHBsYXllckNvbnRleHQgPSBzdHlsaW5nQ29udGV4dCA/IGdldFBsYXllckNvbnRleHQoc3R5bGluZ0NvbnRleHQpIDogbnVsbDtcbiAgcmV0dXJuIHBsYXllckNvbnRleHQgPyBnZXRQbGF5ZXJzSW50ZXJuYWwocGxheWVyQ29udGV4dCkgOiBbXTtcbn1cbiJdfQ==