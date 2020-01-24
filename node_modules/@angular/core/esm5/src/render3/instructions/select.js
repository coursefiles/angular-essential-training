/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { assertGreaterThan, assertLessThan } from '../../util/assert';
import { executePreOrderHooks } from '../hooks';
import { HEADER_OFFSET, TVIEW } from '../interfaces/view';
import { getCheckNoChangesMode, getLView, setSelectedIndex } from '../state';
/**
 * Selects an element for later binding instructions.
 *
 * Used in conjunction with instructions like {@link property} to act on elements with specified
 * indices, for example those created with {@link element} or {@link elementStart}.
 *
 * ```ts
 * (rf: RenderFlags, ctx: any) => {
 *   if (rf & 1) {
 *     element(0, 'div');
 *   }
 *   if (rf & 2) {
 *     select(0); // Select the <div/> created above.
 *     property('title', 'test');
 *   }
 *  }
 * ```
 * @param index the index of the item to act on with the following instructions
 *
 * @codeGenApi
 */
export function ɵɵselect(index) {
    ngDevMode && assertGreaterThan(index, -1, 'Invalid index');
    ngDevMode &&
        assertLessThan(index, getLView().length - HEADER_OFFSET, 'Should be within range for the view data');
    var lView = getLView();
    // Flush the initial hooks for elements in the view that have been added up to this point.
    executePreOrderHooks(lView, lView[TVIEW], getCheckNoChangesMode(), index);
    // We must set the selected index *after* running the hooks, because hooks may have side-effects
    // that cause other template functions to run, thus updating the selected index, which is global
    // state. If we run `setSelectedIndex` *before* we run the hooks, in some cases the selected index
    // will be altered by the time we leave the `ɵɵselect` instruction.
    setSelectedIndex(index);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvcmVuZGVyMy9pbnN0cnVjdGlvbnMvc2VsZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFBQyxpQkFBaUIsRUFBRSxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNwRSxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDOUMsT0FBTyxFQUFDLGFBQWEsRUFBRSxLQUFLLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUN4RCxPQUFPLEVBQUMscUJBQXFCLEVBQUUsUUFBUSxFQUFFLGdCQUFnQixFQUFDLE1BQU0sVUFBVSxDQUFDO0FBRTNFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW9CRztBQUNILE1BQU0sVUFBVSxRQUFRLENBQUMsS0FBYTtJQUNwQyxTQUFTLElBQUksaUJBQWlCLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQzNELFNBQVM7UUFDTCxjQUFjLENBQ1YsS0FBSyxFQUFFLFFBQVEsRUFBRSxDQUFDLE1BQU0sR0FBRyxhQUFhLEVBQUUsMENBQTBDLENBQUMsQ0FBQztJQUM5RixJQUFNLEtBQUssR0FBRyxRQUFRLEVBQUUsQ0FBQztJQUV6QiwwRkFBMEY7SUFDMUYsb0JBQW9CLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxxQkFBcUIsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRTFFLGdHQUFnRztJQUNoRyxnR0FBZ0c7SUFDaEcsa0dBQWtHO0lBQ2xHLG1FQUFtRTtJQUNuRSxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMxQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHthc3NlcnRHcmVhdGVyVGhhbiwgYXNzZXJ0TGVzc1RoYW59IGZyb20gJy4uLy4uL3V0aWwvYXNzZXJ0JztcbmltcG9ydCB7ZXhlY3V0ZVByZU9yZGVySG9va3N9IGZyb20gJy4uL2hvb2tzJztcbmltcG9ydCB7SEVBREVSX09GRlNFVCwgVFZJRVd9IGZyb20gJy4uL2ludGVyZmFjZXMvdmlldyc7XG5pbXBvcnQge2dldENoZWNrTm9DaGFuZ2VzTW9kZSwgZ2V0TFZpZXcsIHNldFNlbGVjdGVkSW5kZXh9IGZyb20gJy4uL3N0YXRlJztcblxuLyoqXG4gKiBTZWxlY3RzIGFuIGVsZW1lbnQgZm9yIGxhdGVyIGJpbmRpbmcgaW5zdHJ1Y3Rpb25zLlxuICpcbiAqIFVzZWQgaW4gY29uanVuY3Rpb24gd2l0aCBpbnN0cnVjdGlvbnMgbGlrZSB7QGxpbmsgcHJvcGVydHl9IHRvIGFjdCBvbiBlbGVtZW50cyB3aXRoIHNwZWNpZmllZFxuICogaW5kaWNlcywgZm9yIGV4YW1wbGUgdGhvc2UgY3JlYXRlZCB3aXRoIHtAbGluayBlbGVtZW50fSBvciB7QGxpbmsgZWxlbWVudFN0YXJ0fS5cbiAqXG4gKiBgYGB0c1xuICogKHJmOiBSZW5kZXJGbGFncywgY3R4OiBhbnkpID0+IHtcbiAqICAgaWYgKHJmICYgMSkge1xuICogICAgIGVsZW1lbnQoMCwgJ2RpdicpO1xuICogICB9XG4gKiAgIGlmIChyZiAmIDIpIHtcbiAqICAgICBzZWxlY3QoMCk7IC8vIFNlbGVjdCB0aGUgPGRpdi8+IGNyZWF0ZWQgYWJvdmUuXG4gKiAgICAgcHJvcGVydHkoJ3RpdGxlJywgJ3Rlc3QnKTtcbiAqICAgfVxuICogIH1cbiAqIGBgYFxuICogQHBhcmFtIGluZGV4IHRoZSBpbmRleCBvZiB0aGUgaXRlbSB0byBhY3Qgb24gd2l0aCB0aGUgZm9sbG93aW5nIGluc3RydWN0aW9uc1xuICpcbiAqIEBjb2RlR2VuQXBpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiDJtcm1c2VsZWN0KGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgbmdEZXZNb2RlICYmIGFzc2VydEdyZWF0ZXJUaGFuKGluZGV4LCAtMSwgJ0ludmFsaWQgaW5kZXgnKTtcbiAgbmdEZXZNb2RlICYmXG4gICAgICBhc3NlcnRMZXNzVGhhbihcbiAgICAgICAgICBpbmRleCwgZ2V0TFZpZXcoKS5sZW5ndGggLSBIRUFERVJfT0ZGU0VULCAnU2hvdWxkIGJlIHdpdGhpbiByYW5nZSBmb3IgdGhlIHZpZXcgZGF0YScpO1xuICBjb25zdCBsVmlldyA9IGdldExWaWV3KCk7XG5cbiAgLy8gRmx1c2ggdGhlIGluaXRpYWwgaG9va3MgZm9yIGVsZW1lbnRzIGluIHRoZSB2aWV3IHRoYXQgaGF2ZSBiZWVuIGFkZGVkIHVwIHRvIHRoaXMgcG9pbnQuXG4gIGV4ZWN1dGVQcmVPcmRlckhvb2tzKGxWaWV3LCBsVmlld1tUVklFV10sIGdldENoZWNrTm9DaGFuZ2VzTW9kZSgpLCBpbmRleCk7XG5cbiAgLy8gV2UgbXVzdCBzZXQgdGhlIHNlbGVjdGVkIGluZGV4ICphZnRlciogcnVubmluZyB0aGUgaG9va3MsIGJlY2F1c2UgaG9va3MgbWF5IGhhdmUgc2lkZS1lZmZlY3RzXG4gIC8vIHRoYXQgY2F1c2Ugb3RoZXIgdGVtcGxhdGUgZnVuY3Rpb25zIHRvIHJ1biwgdGh1cyB1cGRhdGluZyB0aGUgc2VsZWN0ZWQgaW5kZXgsIHdoaWNoIGlzIGdsb2JhbFxuICAvLyBzdGF0ZS4gSWYgd2UgcnVuIGBzZXRTZWxlY3RlZEluZGV4YCAqYmVmb3JlKiB3ZSBydW4gdGhlIGhvb2tzLCBpbiBzb21lIGNhc2VzIHRoZSBzZWxlY3RlZCBpbmRleFxuICAvLyB3aWxsIGJlIGFsdGVyZWQgYnkgdGhlIHRpbWUgd2UgbGVhdmUgdGhlIGDJtcm1c2VsZWN0YCBpbnN0cnVjdGlvbi5cbiAgc2V0U2VsZWN0ZWRJbmRleChpbmRleCk7XG59XG4iXX0=