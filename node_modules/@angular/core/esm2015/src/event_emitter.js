/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/// <reference types="rxjs" />
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <reference types="rxjs" />
import { Subject, Subscription } from 'rxjs';
/**
 * Use in directives and components to emit custom events synchronously
 * or asynchronously, and register handlers for those events by subscribing
 * to an instance.
 *
 * \@usageNotes
 *
 * In the following example, a component defines two output properties
 * that create event emitters. When the title is clicked, the emitter
 * emits an open or close event to toggle the current visibility state.
 *
 * ```
 * \@Component({
 *   selector: 'zippy',
 *   template: `
 *   <div class="zippy">
 *     <div (click)="toggle()">Toggle</div>
 *     <div [hidden]="!visible">
 *       <ng-content></ng-content>
 *     </div>
 *  </div>`})
 * export class Zippy {
 *   visible: boolean = true;
 * \@Output() open: EventEmitter<any> = new EventEmitter();
 * \@Output() close: EventEmitter<any> = new EventEmitter();
 *
 *   toggle() {
 *     this.visible = !this.visible;
 *     if (this.visible) {
 *       this.open.emit(null);
 *     } else {
 *       this.close.emit(null);
 *     }
 *   }
 * }
 * ```
 *
 * Access the event object with the `$event` argument passed to the output event
 * handler:
 *
 * ```
 * <zippy (open)="onOpen($event)" (close)="onClose($event)"></zippy>
 * ```
 *
 * ### Notes
 *
 * Uses Rx.Observable but provides an adapter to make it work as specified here:
 * https://github.com/jhusain/observable-spec
 *
 * Once a reference implementation of the spec is available, switch to it.
 *
 * \@publicApi
 * @template T
 */
export class EventEmitter extends Subject {
    // tslint:disable-line
    /**
     * Creates an instance of this class that can
     * deliver events synchronously or asynchronously.
     *
     * @param {?=} isAsync When true, deliver events asynchronously.
     *
     */
    constructor(isAsync = false) {
        super();
        this.__isAsync = isAsync;
    }
    /**
     * Emits an event containing a given value.
     * @param {?=} value The value to emit.
     * @return {?}
     */
    emit(value) { super.next(value); }
    /**
     * Registers handlers for events emitted by this instance.
     * @param {?=} generatorOrNext When supplied, a custom handler for emitted events.
     * @param {?=} error When supplied, a custom handler for an error notification
     * from this emitter.
     * @param {?=} complete When supplied, a custom handler for a completion
     * notification from this emitter.
     * @return {?}
     */
    subscribe(generatorOrNext, error, complete) {
        /** @type {?} */
        let schedulerFn;
        /** @type {?} */
        let errorFn = (/**
         * @param {?} err
         * @return {?}
         */
        (err) => null);
        /** @type {?} */
        let completeFn = (/**
         * @return {?}
         */
        () => null);
        if (generatorOrNext && typeof generatorOrNext === 'object') {
            schedulerFn = this.__isAsync ? (/**
             * @param {?} value
             * @return {?}
             */
            (value) => {
                setTimeout((/**
                 * @return {?}
                 */
                () => generatorOrNext.next(value)));
            }) : (/**
             * @param {?} value
             * @return {?}
             */
            (value) => { generatorOrNext.next(value); });
            if (generatorOrNext.error) {
                errorFn = this.__isAsync ? (/**
                 * @param {?} err
                 * @return {?}
                 */
                (err) => { setTimeout((/**
                 * @return {?}
                 */
                () => generatorOrNext.error(err))); }) :
                    (/**
                     * @param {?} err
                     * @return {?}
                     */
                    (err) => { generatorOrNext.error(err); });
            }
            if (generatorOrNext.complete) {
                completeFn = this.__isAsync ? (/**
                 * @return {?}
                 */
                () => { setTimeout((/**
                 * @return {?}
                 */
                () => generatorOrNext.complete())); }) :
                    (/**
                     * @return {?}
                     */
                    () => { generatorOrNext.complete(); });
            }
        }
        else {
            schedulerFn = this.__isAsync ? (/**
             * @param {?} value
             * @return {?}
             */
            (value) => { setTimeout((/**
             * @return {?}
             */
            () => generatorOrNext(value))); }) :
                (/**
                 * @param {?} value
                 * @return {?}
                 */
                (value) => { generatorOrNext(value); });
            if (error) {
                errorFn =
                    this.__isAsync ? (/**
                     * @param {?} err
                     * @return {?}
                     */
                    (err) => { setTimeout((/**
                     * @return {?}
                     */
                    () => error(err))); }) : (/**
                     * @param {?} err
                     * @return {?}
                     */
                    (err) => { error(err); });
            }
            if (complete) {
                completeFn =
                    this.__isAsync ? (/**
                     * @return {?}
                     */
                    () => { setTimeout((/**
                     * @return {?}
                     */
                    () => complete())); }) : (/**
                     * @return {?}
                     */
                    () => { complete(); });
            }
        }
        /** @type {?} */
        const sink = super.subscribe(schedulerFn, errorFn, completeFn);
        if (generatorOrNext instanceof Subscription) {
            generatorOrNext.add(sink);
        }
        return sink;
    }
}
if (false) {
    /**
     * Internal
     * @type {?}
     */
    EventEmitter.prototype.__isAsync;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRfZW1pdHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL2V2ZW50X2VtaXR0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQVFBLDhCQUE4Qjs7Ozs7Ozs7O0FBRTlCLE9BQU8sRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFDLE1BQU0sTUFBTSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUQzQyxNQUFNLE9BQU8sWUFBZ0IsU0FBUSxPQUFVOzs7Ozs7Ozs7SUFpQjdDLFlBQVksVUFBbUIsS0FBSztRQUNsQyxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO0lBQzNCLENBQUM7Ozs7OztJQU1ELElBQUksQ0FBQyxLQUFTLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7Ozs7SUFVdEMsU0FBUyxDQUFDLGVBQXFCLEVBQUUsS0FBVyxFQUFFLFFBQWM7O1lBQ3RELFdBQTRCOztZQUM1QixPQUFPOzs7O1FBQUcsQ0FBQyxHQUFRLEVBQU8sRUFBRSxDQUFDLElBQUksQ0FBQTs7WUFDakMsVUFBVTs7O1FBQUcsR0FBUSxFQUFFLENBQUMsSUFBSSxDQUFBO1FBRWhDLElBQUksZUFBZSxJQUFJLE9BQU8sZUFBZSxLQUFLLFFBQVEsRUFBRTtZQUMxRCxXQUFXLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDOzs7O1lBQUMsQ0FBQyxLQUFVLEVBQUUsRUFBRTtnQkFDNUMsVUFBVTs7O2dCQUFDLEdBQUcsRUFBRSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUMsQ0FBQztZQUNoRCxDQUFDLEVBQUMsQ0FBQzs7OztZQUFDLENBQUMsS0FBVSxFQUFFLEVBQUUsR0FBRyxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBLENBQUM7WUFFckQsSUFBSSxlQUFlLENBQUMsS0FBSyxFQUFFO2dCQUN6QixPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDOzs7O2dCQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsR0FBRyxVQUFVOzs7Z0JBQUMsR0FBRyxFQUFFLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUM7Ozs7O29CQUM1RCxDQUFDLEdBQUcsRUFBRSxFQUFFLEdBQUcsZUFBZSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQSxDQUFDO2FBQ3JFO1lBRUQsSUFBSSxlQUFlLENBQUMsUUFBUSxFQUFFO2dCQUM1QixVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDOzs7Z0JBQUMsR0FBRyxFQUFFLEdBQUcsVUFBVTs7O2dCQUFDLEdBQUcsRUFBRSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUM7Ozs7b0JBQ3pELEdBQUcsRUFBRSxHQUFHLGVBQWUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQSxDQUFDO2FBQ3JFO1NBQ0Y7YUFBTTtZQUNMLFdBQVcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7Ozs7WUFBQyxDQUFDLEtBQVUsRUFBRSxFQUFFLEdBQUcsVUFBVTs7O1lBQUMsR0FBRyxFQUFFLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQzs7Ozs7Z0JBQy9ELENBQUMsS0FBVSxFQUFFLEVBQUUsR0FBRyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUEsQ0FBQztZQUUzRSxJQUFJLEtBQUssRUFBRTtnQkFDVCxPQUFPO29CQUNILElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzs7OztvQkFBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLEdBQUcsVUFBVTs7O29CQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUM7Ozs7b0JBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQSxDQUFDO2FBQzVGO1lBRUQsSUFBSSxRQUFRLEVBQUU7Z0JBQ1osVUFBVTtvQkFDTixJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7OztvQkFBQyxHQUFHLEVBQUUsR0FBRyxVQUFVOzs7b0JBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDOzs7b0JBQUMsR0FBRyxFQUFFLEdBQUcsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUEsQ0FBQzthQUN0RjtTQUNGOztjQUVLLElBQUksR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxPQUFPLEVBQUUsVUFBVSxDQUFDO1FBRTlELElBQUksZUFBZSxZQUFZLFlBQVksRUFBRTtZQUMzQyxlQUFlLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzNCO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0NBQ0Y7Ozs7OztJQXRFQyxpQ0FBbUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwicnhqc1wiIC8+XG5cbmltcG9ydCB7U3ViamVjdCwgU3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcblxuLyoqXG4gKiBVc2UgaW4gZGlyZWN0aXZlcyBhbmQgY29tcG9uZW50cyB0byBlbWl0IGN1c3RvbSBldmVudHMgc3luY2hyb25vdXNseVxuICogb3IgYXN5bmNocm9ub3VzbHksIGFuZCByZWdpc3RlciBoYW5kbGVycyBmb3IgdGhvc2UgZXZlbnRzIGJ5IHN1YnNjcmliaW5nXG4gKiB0byBhbiBpbnN0YW5jZS5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqIEluIHRoZSBmb2xsb3dpbmcgZXhhbXBsZSwgYSBjb21wb25lbnQgZGVmaW5lcyB0d28gb3V0cHV0IHByb3BlcnRpZXNcbiAqIHRoYXQgY3JlYXRlIGV2ZW50IGVtaXR0ZXJzLiBXaGVuIHRoZSB0aXRsZSBpcyBjbGlja2VkLCB0aGUgZW1pdHRlclxuICogZW1pdHMgYW4gb3BlbiBvciBjbG9zZSBldmVudCB0byB0b2dnbGUgdGhlIGN1cnJlbnQgdmlzaWJpbGl0eSBzdGF0ZS5cbiAqXG4gKiBgYGBcbiAqIEBDb21wb25lbnQoe1xuICogICBzZWxlY3RvcjogJ3ppcHB5JyxcbiAqICAgdGVtcGxhdGU6IGBcbiAqICAgPGRpdiBjbGFzcz1cInppcHB5XCI+XG4gKiAgICAgPGRpdiAoY2xpY2spPVwidG9nZ2xlKClcIj5Ub2dnbGU8L2Rpdj5cbiAqICAgICA8ZGl2IFtoaWRkZW5dPVwiIXZpc2libGVcIj5cbiAqICAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAqICAgICA8L2Rpdj5cbiAqICA8L2Rpdj5gfSlcbiAqIGV4cG9ydCBjbGFzcyBaaXBweSB7XG4gKiAgIHZpc2libGU6IGJvb2xlYW4gPSB0cnVlO1xuICogICBAT3V0cHV0KCkgb3BlbjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gKiAgIEBPdXRwdXQoKSBjbG9zZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gKlxuICogICB0b2dnbGUoKSB7XG4gKiAgICAgdGhpcy52aXNpYmxlID0gIXRoaXMudmlzaWJsZTtcbiAqICAgICBpZiAodGhpcy52aXNpYmxlKSB7XG4gKiAgICAgICB0aGlzLm9wZW4uZW1pdChudWxsKTtcbiAqICAgICB9IGVsc2Uge1xuICogICAgICAgdGhpcy5jbG9zZS5lbWl0KG51bGwpO1xuICogICAgIH1cbiAqICAgfVxuICogfVxuICogYGBgXG4gKlxuICogQWNjZXNzIHRoZSBldmVudCBvYmplY3Qgd2l0aCB0aGUgYCRldmVudGAgYXJndW1lbnQgcGFzc2VkIHRvIHRoZSBvdXRwdXQgZXZlbnRcbiAqIGhhbmRsZXI6XG4gKlxuICogYGBgXG4gKiA8emlwcHkgKG9wZW4pPVwib25PcGVuKCRldmVudClcIiAoY2xvc2UpPVwib25DbG9zZSgkZXZlbnQpXCI+PC96aXBweT5cbiAqIGBgYFxuICpcbiAqICMjIyBOb3Rlc1xuICpcbiAqIFVzZXMgUnguT2JzZXJ2YWJsZSBidXQgcHJvdmlkZXMgYW4gYWRhcHRlciB0byBtYWtlIGl0IHdvcmsgYXMgc3BlY2lmaWVkIGhlcmU6XG4gKiBodHRwczovL2dpdGh1Yi5jb20vamh1c2Fpbi9vYnNlcnZhYmxlLXNwZWNcbiAqXG4gKiBPbmNlIGEgcmVmZXJlbmNlIGltcGxlbWVudGF0aW9uIG9mIHRoZSBzcGVjIGlzIGF2YWlsYWJsZSwgc3dpdGNoIHRvIGl0LlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNsYXNzIEV2ZW50RW1pdHRlcjxUPiBleHRlbmRzIFN1YmplY3Q8VD4ge1xuICAvLyBUT0RPOiBtYXJrIHRoaXMgYXMgaW50ZXJuYWwgb25jZSBhbGwgdGhlIGZhY2FkZXMgYXJlIGdvbmVcbiAgLy8gd2UgY2FuJ3QgbWFyayBpdCBhcyBpbnRlcm5hbCBub3cgYmVjYXVzZSBFdmVudEVtaXR0ZXIgZXhwb3J0ZWQgdmlhIEBhbmd1bGFyL2NvcmUgd291bGQgbm90XG4gIC8vIGNvbnRhaW4gdGhpcyBwcm9wZXJ0eSBtYWtpbmcgaXQgaW5jb21wYXRpYmxlIHdpdGggYWxsIHRoZSBjb2RlIHRoYXQgdXNlcyBFdmVudEVtaXR0ZXIgdmlhXG4gIC8vIGZhY2FkZXMsIHdoaWNoIGFyZSBsb2NhbCB0byB0aGUgY29kZSBhbmQgZG8gbm90IGhhdmUgdGhpcyBwcm9wZXJ0eSBzdHJpcHBlZC5cbiAgLyoqXG4gICAqIEludGVybmFsXG4gICAqL1xuICBfX2lzQXN5bmM6IGJvb2xlYW47ICAvLyB0c2xpbnQ6ZGlzYWJsZS1saW5lXG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhpcyBjbGFzcyB0aGF0IGNhblxuICAgKiBkZWxpdmVyIGV2ZW50cyBzeW5jaHJvbm91c2x5IG9yIGFzeW5jaHJvbm91c2x5LlxuICAgKlxuICAgKiBAcGFyYW0gaXNBc3luYyBXaGVuIHRydWUsIGRlbGl2ZXIgZXZlbnRzIGFzeW5jaHJvbm91c2x5LlxuICAgKlxuICAgKi9cbiAgY29uc3RydWN0b3IoaXNBc3luYzogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9faXNBc3luYyA9IGlzQXN5bmM7XG4gIH1cblxuICAvKipcbiAgICogRW1pdHMgYW4gZXZlbnQgY29udGFpbmluZyBhIGdpdmVuIHZhbHVlLlxuICAgKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIGVtaXQuXG4gICAqL1xuICBlbWl0KHZhbHVlPzogVCkgeyBzdXBlci5uZXh0KHZhbHVlKTsgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgaGFuZGxlcnMgZm9yIGV2ZW50cyBlbWl0dGVkIGJ5IHRoaXMgaW5zdGFuY2UuXG4gICAqIEBwYXJhbSBnZW5lcmF0b3JPck5leHQgV2hlbiBzdXBwbGllZCwgYSBjdXN0b20gaGFuZGxlciBmb3IgZW1pdHRlZCBldmVudHMuXG4gICAqIEBwYXJhbSBlcnJvciBXaGVuIHN1cHBsaWVkLCBhIGN1c3RvbSBoYW5kbGVyIGZvciBhbiBlcnJvciBub3RpZmljYXRpb25cbiAgICogZnJvbSB0aGlzIGVtaXR0ZXIuXG4gICAqIEBwYXJhbSBjb21wbGV0ZSBXaGVuIHN1cHBsaWVkLCBhIGN1c3RvbSBoYW5kbGVyIGZvciBhIGNvbXBsZXRpb25cbiAgICogbm90aWZpY2F0aW9uIGZyb20gdGhpcyBlbWl0dGVyLlxuICAgKi9cbiAgc3Vic2NyaWJlKGdlbmVyYXRvck9yTmV4dD86IGFueSwgZXJyb3I/OiBhbnksIGNvbXBsZXRlPzogYW55KTogU3Vic2NyaXB0aW9uIHtcbiAgICBsZXQgc2NoZWR1bGVyRm46ICh0OiBhbnkpID0+IGFueTtcbiAgICBsZXQgZXJyb3JGbiA9IChlcnI6IGFueSk6IGFueSA9PiBudWxsO1xuICAgIGxldCBjb21wbGV0ZUZuID0gKCk6IGFueSA9PiBudWxsO1xuXG4gICAgaWYgKGdlbmVyYXRvck9yTmV4dCAmJiB0eXBlb2YgZ2VuZXJhdG9yT3JOZXh0ID09PSAnb2JqZWN0Jykge1xuICAgICAgc2NoZWR1bGVyRm4gPSB0aGlzLl9faXNBc3luYyA/ICh2YWx1ZTogYW55KSA9PiB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gZ2VuZXJhdG9yT3JOZXh0Lm5leHQodmFsdWUpKTtcbiAgICAgIH0gOiAodmFsdWU6IGFueSkgPT4geyBnZW5lcmF0b3JPck5leHQubmV4dCh2YWx1ZSk7IH07XG5cbiAgICAgIGlmIChnZW5lcmF0b3JPck5leHQuZXJyb3IpIHtcbiAgICAgICAgZXJyb3JGbiA9IHRoaXMuX19pc0FzeW5jID8gKGVycikgPT4geyBzZXRUaW1lb3V0KCgpID0+IGdlbmVyYXRvck9yTmV4dC5lcnJvcihlcnIpKTsgfSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChlcnIpID0+IHsgZ2VuZXJhdG9yT3JOZXh0LmVycm9yKGVycik7IH07XG4gICAgICB9XG5cbiAgICAgIGlmIChnZW5lcmF0b3JPck5leHQuY29tcGxldGUpIHtcbiAgICAgICAgY29tcGxldGVGbiA9IHRoaXMuX19pc0FzeW5jID8gKCkgPT4geyBzZXRUaW1lb3V0KCgpID0+IGdlbmVyYXRvck9yTmV4dC5jb21wbGV0ZSgpKTsgfSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHsgZ2VuZXJhdG9yT3JOZXh0LmNvbXBsZXRlKCk7IH07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHNjaGVkdWxlckZuID0gdGhpcy5fX2lzQXN5bmMgPyAodmFsdWU6IGFueSkgPT4geyBzZXRUaW1lb3V0KCgpID0+IGdlbmVyYXRvck9yTmV4dCh2YWx1ZSkpOyB9IDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodmFsdWU6IGFueSkgPT4geyBnZW5lcmF0b3JPck5leHQodmFsdWUpOyB9O1xuXG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgZXJyb3JGbiA9XG4gICAgICAgICAgICB0aGlzLl9faXNBc3luYyA/IChlcnIpID0+IHsgc2V0VGltZW91dCgoKSA9PiBlcnJvcihlcnIpKTsgfSA6IChlcnIpID0+IHsgZXJyb3IoZXJyKTsgfTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbXBsZXRlKSB7XG4gICAgICAgIGNvbXBsZXRlRm4gPVxuICAgICAgICAgICAgdGhpcy5fX2lzQXN5bmMgPyAoKSA9PiB7IHNldFRpbWVvdXQoKCkgPT4gY29tcGxldGUoKSk7IH0gOiAoKSA9PiB7IGNvbXBsZXRlKCk7IH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgc2luayA9IHN1cGVyLnN1YnNjcmliZShzY2hlZHVsZXJGbiwgZXJyb3JGbiwgY29tcGxldGVGbik7XG5cbiAgICBpZiAoZ2VuZXJhdG9yT3JOZXh0IGluc3RhbmNlb2YgU3Vic2NyaXB0aW9uKSB7XG4gICAgICBnZW5lcmF0b3JPck5leHQuYWRkKHNpbmspO1xuICAgIH1cblxuICAgIHJldHVybiBzaW5rO1xuICB9XG59XG4iXX0=