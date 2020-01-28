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
import { Optional, SkipSelf, ɵɵdefineInjectable } from '../../di';
import { DefaultKeyValueDifferFactory } from './default_keyvalue_differ';
/**
 * A differ that tracks changes made to an object over time.
 *
 * \@publicApi
 * @record
 * @template K, V
 */
export function KeyValueDiffer() { }
if (false) {
    /**
     * Compute a difference between the previous state and the new `object` state.
     *
     * @param {?} object containing the new value.
     * @return {?} an object describing the difference. The return value is only valid until the next
     * `diff()` invocation.
     */
    KeyValueDiffer.prototype.diff = function (object) { };
    /**
     * Compute a difference between the previous state and the new `object` state.
     *
     * @param {?} object containing the new value.
     * @return {?} an object describing the difference. The return value is only valid until the next
     * `diff()` invocation.
     */
    KeyValueDiffer.prototype.diff = function (object) { };
}
/**
 * An object describing the changes in the `Map` or `{[k:string]: string}` since last time
 * `KeyValueDiffer#diff()` was invoked.
 *
 * \@publicApi
 * @record
 * @template K, V
 */
export function KeyValueChanges() { }
if (false) {
    /**
     * Iterate over all changes. `KeyValueChangeRecord` will contain information about changes
     * to each item.
     * @param {?} fn
     * @return {?}
     */
    KeyValueChanges.prototype.forEachItem = function (fn) { };
    /**
     * Iterate over changes in the order of original Map showing where the original items
     * have moved.
     * @param {?} fn
     * @return {?}
     */
    KeyValueChanges.prototype.forEachPreviousItem = function (fn) { };
    /**
     * Iterate over all keys for which values have changed.
     * @param {?} fn
     * @return {?}
     */
    KeyValueChanges.prototype.forEachChangedItem = function (fn) { };
    /**
     * Iterate over all added items.
     * @param {?} fn
     * @return {?}
     */
    KeyValueChanges.prototype.forEachAddedItem = function (fn) { };
    /**
     * Iterate over all removed items.
     * @param {?} fn
     * @return {?}
     */
    KeyValueChanges.prototype.forEachRemovedItem = function (fn) { };
}
/**
 * Record representing the item change information.
 *
 * \@publicApi
 * @record
 * @template K, V
 */
export function KeyValueChangeRecord() { }
if (false) {
    /**
     * Current key in the Map.
     * @type {?}
     */
    KeyValueChangeRecord.prototype.key;
    /**
     * Current value for the key or `null` if removed.
     * @type {?}
     */
    KeyValueChangeRecord.prototype.currentValue;
    /**
     * Previous value for the key or `null` if added.
     * @type {?}
     */
    KeyValueChangeRecord.prototype.previousValue;
}
/**
 * Provides a factory for {\@link KeyValueDiffer}.
 *
 * \@publicApi
 * @record
 */
export function KeyValueDifferFactory() { }
if (false) {
    /**
     * Test to see if the differ knows how to diff this kind of object.
     * @param {?} objects
     * @return {?}
     */
    KeyValueDifferFactory.prototype.supports = function (objects) { };
    /**
     * Create a `KeyValueDiffer`.
     * @template K, V
     * @return {?}
     */
    KeyValueDifferFactory.prototype.create = function () { };
}
/**
 * A repository of different Map diffing strategies used by NgClass, NgStyle, and others.
 *
 * \@publicApi
 */
export class KeyValueDiffers {
    /**
     * @param {?} factories
     */
    constructor(factories) { this.factories = factories; }
    /**
     * @template S
     * @param {?} factories
     * @param {?=} parent
     * @return {?}
     */
    static create(factories, parent) {
        if (parent) {
            /** @type {?} */
            const copied = parent.factories.slice();
            factories = factories.concat(copied);
        }
        return new KeyValueDiffers(factories);
    }
    /**
     * Takes an array of {\@link KeyValueDifferFactory} and returns a provider used to extend the
     * inherited {\@link KeyValueDiffers} instance with the provided factories and return a new
     * {\@link KeyValueDiffers} instance.
     *
     * \@usageNotes
     * ### Example
     *
     * The following example shows how to extend an existing list of factories,
     * which will only be applied to the injector for this component and its children.
     * This step is all that's required to make a new {\@link KeyValueDiffer} available.
     *
     * ```
     * \@Component({
     *   viewProviders: [
     *     KeyValueDiffers.extend([new ImmutableMapDiffer()])
     *   ]
     * })
     * ```
     * @template S
     * @param {?} factories
     * @return {?}
     */
    static extend(factories) {
        return {
            provide: KeyValueDiffers,
            useFactory: (/**
             * @param {?} parent
             * @return {?}
             */
            (parent) => {
                if (!parent) {
                    // Typically would occur when calling KeyValueDiffers.extend inside of dependencies passed
                    // to bootstrap(), which would override default pipes instead of extending them.
                    throw new Error('Cannot extend KeyValueDiffers without a parent injector');
                }
                return KeyValueDiffers.create(factories, parent);
            }),
            // Dependency technically isn't optional, but we can provide a better error message this way.
            deps: [[KeyValueDiffers, new SkipSelf(), new Optional()]]
        };
    }
    /**
     * @param {?} kv
     * @return {?}
     */
    find(kv) {
        /** @type {?} */
        const factory = this.factories.find((/**
         * @param {?} f
         * @return {?}
         */
        f => f.supports(kv)));
        if (factory) {
            return factory;
        }
        throw new Error(`Cannot find a differ supporting object '${kv}'`);
    }
}
/** @nocollapse */
/** @nocollapse */ KeyValueDiffers.ngInjectableDef = ɵɵdefineInjectable({
    providedIn: 'root',
    factory: (/**
     * @nocollapse @return {?}
     */
    () => new KeyValueDiffers([new DefaultKeyValueDifferFactory()]))
});
if (false) {
    /**
     * @nocollapse
     * @type {?}
     */
    KeyValueDiffers.ngInjectableDef;
    /**
     * @deprecated v4.0.0 - Should be private.
     * @type {?}
     */
    KeyValueDiffers.prototype.factories;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5dmFsdWVfZGlmZmVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL2NoYW5nZV9kZXRlY3Rpb24vZGlmZmVycy9rZXl2YWx1ZV9kaWZmZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLFFBQVEsRUFBRSxRQUFRLEVBQWtCLGtCQUFrQixFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQ2hGLE9BQU8sRUFBQyw0QkFBNEIsRUFBQyxNQUFNLDJCQUEyQixDQUFDOzs7Ozs7OztBQVF2RSxvQ0FvQkM7Ozs7Ozs7OztJQVpDLHNEQUFvRDs7Ozs7Ozs7SUFTcEQsc0RBQWtFOzs7Ozs7Ozs7O0FBV3BFLHFDQTJCQzs7Ozs7Ozs7SUF0QkMsMERBQStEOzs7Ozs7O0lBTS9ELGtFQUF1RTs7Ozs7O0lBS3ZFLGlFQUFzRTs7Ozs7O0lBS3RFLCtEQUFvRTs7Ozs7O0lBS3BFLGlFQUFzRTs7Ozs7Ozs7O0FBUXhFLDBDQWVDOzs7Ozs7SUFYQyxtQ0FBZ0I7Ozs7O0lBS2hCLDRDQUE4Qjs7Ozs7SUFLOUIsNkNBQStCOzs7Ozs7OztBQVFqQywyQ0FVQzs7Ozs7OztJQU5DLGtFQUFnQzs7Ozs7O0lBS2hDLHlEQUFxQzs7Ozs7OztBQVF2QyxNQUFNLE9BQU8sZUFBZTs7OztJQVkxQixZQUFZLFNBQWtDLElBQUksSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDOzs7Ozs7O0lBRS9FLE1BQU0sQ0FBQyxNQUFNLENBQUksU0FBa0MsRUFBRSxNQUF3QjtRQUMzRSxJQUFJLE1BQU0sRUFBRTs7a0JBQ0osTUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFO1lBQ3ZDLFNBQVMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3RDO1FBQ0QsT0FBTyxJQUFJLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN4QyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFzQkQsTUFBTSxDQUFDLE1BQU0sQ0FBSSxTQUFrQztRQUNqRCxPQUFPO1lBQ0wsT0FBTyxFQUFFLGVBQWU7WUFDeEIsVUFBVTs7OztZQUFFLENBQUMsTUFBdUIsRUFBRSxFQUFFO2dCQUN0QyxJQUFJLENBQUMsTUFBTSxFQUFFO29CQUNYLDBGQUEwRjtvQkFDMUYsZ0ZBQWdGO29CQUNoRixNQUFNLElBQUksS0FBSyxDQUFDLHlEQUF5RCxDQUFDLENBQUM7aUJBQzVFO2dCQUNELE9BQU8sZUFBZSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDbkQsQ0FBQyxDQUFBOztZQUVELElBQUksRUFBRSxDQUFDLENBQUMsZUFBZSxFQUFFLElBQUksUUFBUSxFQUFFLEVBQUUsSUFBSSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1NBQzFELENBQUM7SUFDSixDQUFDOzs7OztJQUVELElBQUksQ0FBQyxFQUFPOztjQUNKLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUk7Ozs7UUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUM7UUFDeEQsSUFBSSxPQUFPLEVBQUU7WUFDWCxPQUFPLE9BQU8sQ0FBQztTQUNoQjtRQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsMkNBQTJDLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDcEUsQ0FBQzs7O0FBOURNLCtCQUFlLEdBQUcsa0JBQWtCLENBQUM7SUFDMUMsVUFBVSxFQUFFLE1BQU07SUFDbEIsT0FBTzs7O0lBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxlQUFlLENBQUMsQ0FBQyxJQUFJLDRCQUE0QixFQUFFLENBQUMsQ0FBQyxDQUFBO0NBQ3pFLENBQUMsQ0FBQzs7Ozs7O0lBSEgsZ0NBR0c7Ozs7O0lBS0gsb0NBQW1DIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge09wdGlvbmFsLCBTa2lwU2VsZiwgU3RhdGljUHJvdmlkZXIsIMm1ybVkZWZpbmVJbmplY3RhYmxlfSBmcm9tICcuLi8uLi9kaSc7XG5pbXBvcnQge0RlZmF1bHRLZXlWYWx1ZURpZmZlckZhY3Rvcnl9IGZyb20gJy4vZGVmYXVsdF9rZXl2YWx1ZV9kaWZmZXInO1xuXG5cbi8qKlxuICogQSBkaWZmZXIgdGhhdCB0cmFja3MgY2hhbmdlcyBtYWRlIHRvIGFuIG9iamVjdCBvdmVyIHRpbWUuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEtleVZhbHVlRGlmZmVyPEssIFY+IHtcbiAgLyoqXG4gICAqIENvbXB1dGUgYSBkaWZmZXJlbmNlIGJldHdlZW4gdGhlIHByZXZpb3VzIHN0YXRlIGFuZCB0aGUgbmV3IGBvYmplY3RgIHN0YXRlLlxuICAgKlxuICAgKiBAcGFyYW0gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIG5ldyB2YWx1ZS5cbiAgICogQHJldHVybnMgYW4gb2JqZWN0IGRlc2NyaWJpbmcgdGhlIGRpZmZlcmVuY2UuIFRoZSByZXR1cm4gdmFsdWUgaXMgb25seSB2YWxpZCB1bnRpbCB0aGUgbmV4dFxuICAgKiBgZGlmZigpYCBpbnZvY2F0aW9uLlxuICAgKi9cbiAgZGlmZihvYmplY3Q6IE1hcDxLLCBWPik6IEtleVZhbHVlQ2hhbmdlczxLLCBWPnxudWxsO1xuXG4gIC8qKlxuICAgKiBDb21wdXRlIGEgZGlmZmVyZW5jZSBiZXR3ZWVuIHRoZSBwcmV2aW91cyBzdGF0ZSBhbmQgdGhlIG5ldyBgb2JqZWN0YCBzdGF0ZS5cbiAgICpcbiAgICogQHBhcmFtIG9iamVjdCBjb250YWluaW5nIHRoZSBuZXcgdmFsdWUuXG4gICAqIEByZXR1cm5zIGFuIG9iamVjdCBkZXNjcmliaW5nIHRoZSBkaWZmZXJlbmNlLiBUaGUgcmV0dXJuIHZhbHVlIGlzIG9ubHkgdmFsaWQgdW50aWwgdGhlIG5leHRcbiAgICogYGRpZmYoKWAgaW52b2NhdGlvbi5cbiAgICovXG4gIGRpZmYob2JqZWN0OiB7W2tleTogc3RyaW5nXTogVn0pOiBLZXlWYWx1ZUNoYW5nZXM8c3RyaW5nLCBWPnxudWxsO1xuICAvLyBUT0RPKFRTMi4xKTogZGlmZjxLUCBleHRlbmRzIHN0cmluZz4odGhpczogS2V5VmFsdWVEaWZmZXI8S1AsIFY+LCBvYmplY3Q6IFJlY29yZDxLUCwgVj4pOlxuICAvLyBLZXlWYWx1ZURpZmZlcjxLUCwgVj47XG59XG5cbi8qKlxuICogQW4gb2JqZWN0IGRlc2NyaWJpbmcgdGhlIGNoYW5nZXMgaW4gdGhlIGBNYXBgIG9yIGB7W2s6c3RyaW5nXTogc3RyaW5nfWAgc2luY2UgbGFzdCB0aW1lXG4gKiBgS2V5VmFsdWVEaWZmZXIjZGlmZigpYCB3YXMgaW52b2tlZC5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgS2V5VmFsdWVDaGFuZ2VzPEssIFY+IHtcbiAgLyoqXG4gICAqIEl0ZXJhdGUgb3ZlciBhbGwgY2hhbmdlcy4gYEtleVZhbHVlQ2hhbmdlUmVjb3JkYCB3aWxsIGNvbnRhaW4gaW5mb3JtYXRpb24gYWJvdXQgY2hhbmdlc1xuICAgKiB0byBlYWNoIGl0ZW0uXG4gICAqL1xuICBmb3JFYWNoSXRlbShmbjogKHI6IEtleVZhbHVlQ2hhbmdlUmVjb3JkPEssIFY+KSA9PiB2b2lkKTogdm9pZDtcblxuICAvKipcbiAgICogSXRlcmF0ZSBvdmVyIGNoYW5nZXMgaW4gdGhlIG9yZGVyIG9mIG9yaWdpbmFsIE1hcCBzaG93aW5nIHdoZXJlIHRoZSBvcmlnaW5hbCBpdGVtc1xuICAgKiBoYXZlIG1vdmVkLlxuICAgKi9cbiAgZm9yRWFjaFByZXZpb3VzSXRlbShmbjogKHI6IEtleVZhbHVlQ2hhbmdlUmVjb3JkPEssIFY+KSA9PiB2b2lkKTogdm9pZDtcblxuICAvKipcbiAgICogSXRlcmF0ZSBvdmVyIGFsbCBrZXlzIGZvciB3aGljaCB2YWx1ZXMgaGF2ZSBjaGFuZ2VkLlxuICAgKi9cbiAgZm9yRWFjaENoYW5nZWRJdGVtKGZuOiAocjogS2V5VmFsdWVDaGFuZ2VSZWNvcmQ8SywgVj4pID0+IHZvaWQpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBJdGVyYXRlIG92ZXIgYWxsIGFkZGVkIGl0ZW1zLlxuICAgKi9cbiAgZm9yRWFjaEFkZGVkSXRlbShmbjogKHI6IEtleVZhbHVlQ2hhbmdlUmVjb3JkPEssIFY+KSA9PiB2b2lkKTogdm9pZDtcblxuICAvKipcbiAgICogSXRlcmF0ZSBvdmVyIGFsbCByZW1vdmVkIGl0ZW1zLlxuICAgKi9cbiAgZm9yRWFjaFJlbW92ZWRJdGVtKGZuOiAocjogS2V5VmFsdWVDaGFuZ2VSZWNvcmQ8SywgVj4pID0+IHZvaWQpOiB2b2lkO1xufVxuXG4vKipcbiAqIFJlY29yZCByZXByZXNlbnRpbmcgdGhlIGl0ZW0gY2hhbmdlIGluZm9ybWF0aW9uLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBLZXlWYWx1ZUNoYW5nZVJlY29yZDxLLCBWPiB7XG4gIC8qKlxuICAgKiBDdXJyZW50IGtleSBpbiB0aGUgTWFwLlxuICAgKi9cbiAgcmVhZG9ubHkga2V5OiBLO1xuXG4gIC8qKlxuICAgKiBDdXJyZW50IHZhbHVlIGZvciB0aGUga2V5IG9yIGBudWxsYCBpZiByZW1vdmVkLlxuICAgKi9cbiAgcmVhZG9ubHkgY3VycmVudFZhbHVlOiBWfG51bGw7XG5cbiAgLyoqXG4gICAqIFByZXZpb3VzIHZhbHVlIGZvciB0aGUga2V5IG9yIGBudWxsYCBpZiBhZGRlZC5cbiAgICovXG4gIHJlYWRvbmx5IHByZXZpb3VzVmFsdWU6IFZ8bnVsbDtcbn1cblxuLyoqXG4gKiBQcm92aWRlcyBhIGZhY3RvcnkgZm9yIHtAbGluayBLZXlWYWx1ZURpZmZlcn0uXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEtleVZhbHVlRGlmZmVyRmFjdG9yeSB7XG4gIC8qKlxuICAgKiBUZXN0IHRvIHNlZSBpZiB0aGUgZGlmZmVyIGtub3dzIGhvdyB0byBkaWZmIHRoaXMga2luZCBvZiBvYmplY3QuXG4gICAqL1xuICBzdXBwb3J0cyhvYmplY3RzOiBhbnkpOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBgS2V5VmFsdWVEaWZmZXJgLlxuICAgKi9cbiAgY3JlYXRlPEssIFY+KCk6IEtleVZhbHVlRGlmZmVyPEssIFY+O1xufVxuXG4vKipcbiAqIEEgcmVwb3NpdG9yeSBvZiBkaWZmZXJlbnQgTWFwIGRpZmZpbmcgc3RyYXRlZ2llcyB1c2VkIGJ5IE5nQ2xhc3MsIE5nU3R5bGUsIGFuZCBvdGhlcnMuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgY2xhc3MgS2V5VmFsdWVEaWZmZXJzIHtcbiAgLyoqIEBub2NvbGxhcHNlICovXG4gIHN0YXRpYyBuZ0luamVjdGFibGVEZWYgPSDJtcm1ZGVmaW5lSW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxuICAgIGZhY3Rvcnk6ICgpID0+IG5ldyBLZXlWYWx1ZURpZmZlcnMoW25ldyBEZWZhdWx0S2V5VmFsdWVEaWZmZXJGYWN0b3J5KCldKVxuICB9KTtcblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgdjQuMC4wIC0gU2hvdWxkIGJlIHByaXZhdGUuXG4gICAqL1xuICBmYWN0b3JpZXM6IEtleVZhbHVlRGlmZmVyRmFjdG9yeVtdO1xuXG4gIGNvbnN0cnVjdG9yKGZhY3RvcmllczogS2V5VmFsdWVEaWZmZXJGYWN0b3J5W10pIHsgdGhpcy5mYWN0b3JpZXMgPSBmYWN0b3JpZXM7IH1cblxuICBzdGF0aWMgY3JlYXRlPFM+KGZhY3RvcmllczogS2V5VmFsdWVEaWZmZXJGYWN0b3J5W10sIHBhcmVudD86IEtleVZhbHVlRGlmZmVycyk6IEtleVZhbHVlRGlmZmVycyB7XG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgY29uc3QgY29waWVkID0gcGFyZW50LmZhY3Rvcmllcy5zbGljZSgpO1xuICAgICAgZmFjdG9yaWVzID0gZmFjdG9yaWVzLmNvbmNhdChjb3BpZWQpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEtleVZhbHVlRGlmZmVycyhmYWN0b3JpZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRha2VzIGFuIGFycmF5IG9mIHtAbGluayBLZXlWYWx1ZURpZmZlckZhY3Rvcnl9IGFuZCByZXR1cm5zIGEgcHJvdmlkZXIgdXNlZCB0byBleHRlbmQgdGhlXG4gICAqIGluaGVyaXRlZCB7QGxpbmsgS2V5VmFsdWVEaWZmZXJzfSBpbnN0YW5jZSB3aXRoIHRoZSBwcm92aWRlZCBmYWN0b3JpZXMgYW5kIHJldHVybiBhIG5ld1xuICAgKiB7QGxpbmsgS2V5VmFsdWVEaWZmZXJzfSBpbnN0YW5jZS5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICogIyMjIEV4YW1wbGVcbiAgICpcbiAgICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHNob3dzIGhvdyB0byBleHRlbmQgYW4gZXhpc3RpbmcgbGlzdCBvZiBmYWN0b3JpZXMsXG4gICAqIHdoaWNoIHdpbGwgb25seSBiZSBhcHBsaWVkIHRvIHRoZSBpbmplY3RvciBmb3IgdGhpcyBjb21wb25lbnQgYW5kIGl0cyBjaGlsZHJlbi5cbiAgICogVGhpcyBzdGVwIGlzIGFsbCB0aGF0J3MgcmVxdWlyZWQgdG8gbWFrZSBhIG5ldyB7QGxpbmsgS2V5VmFsdWVEaWZmZXJ9IGF2YWlsYWJsZS5cbiAgICpcbiAgICogYGBgXG4gICAqIEBDb21wb25lbnQoe1xuICAgKiAgIHZpZXdQcm92aWRlcnM6IFtcbiAgICogICAgIEtleVZhbHVlRGlmZmVycy5leHRlbmQoW25ldyBJbW11dGFibGVNYXBEaWZmZXIoKV0pXG4gICAqICAgXVxuICAgKiB9KVxuICAgKiBgYGBcbiAgICovXG4gIHN0YXRpYyBleHRlbmQ8Uz4oZmFjdG9yaWVzOiBLZXlWYWx1ZURpZmZlckZhY3RvcnlbXSk6IFN0YXRpY1Byb3ZpZGVyIHtcbiAgICByZXR1cm4ge1xuICAgICAgcHJvdmlkZTogS2V5VmFsdWVEaWZmZXJzLFxuICAgICAgdXNlRmFjdG9yeTogKHBhcmVudDogS2V5VmFsdWVEaWZmZXJzKSA9PiB7XG4gICAgICAgIGlmICghcGFyZW50KSB7XG4gICAgICAgICAgLy8gVHlwaWNhbGx5IHdvdWxkIG9jY3VyIHdoZW4gY2FsbGluZyBLZXlWYWx1ZURpZmZlcnMuZXh0ZW5kIGluc2lkZSBvZiBkZXBlbmRlbmNpZXMgcGFzc2VkXG4gICAgICAgICAgLy8gdG8gYm9vdHN0cmFwKCksIHdoaWNoIHdvdWxkIG92ZXJyaWRlIGRlZmF1bHQgcGlwZXMgaW5zdGVhZCBvZiBleHRlbmRpbmcgdGhlbS5cbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBleHRlbmQgS2V5VmFsdWVEaWZmZXJzIHdpdGhvdXQgYSBwYXJlbnQgaW5qZWN0b3InKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gS2V5VmFsdWVEaWZmZXJzLmNyZWF0ZShmYWN0b3JpZXMsIHBhcmVudCk7XG4gICAgICB9LFxuICAgICAgLy8gRGVwZW5kZW5jeSB0ZWNobmljYWxseSBpc24ndCBvcHRpb25hbCwgYnV0IHdlIGNhbiBwcm92aWRlIGEgYmV0dGVyIGVycm9yIG1lc3NhZ2UgdGhpcyB3YXkuXG4gICAgICBkZXBzOiBbW0tleVZhbHVlRGlmZmVycywgbmV3IFNraXBTZWxmKCksIG5ldyBPcHRpb25hbCgpXV1cbiAgICB9O1xuICB9XG5cbiAgZmluZChrdjogYW55KTogS2V5VmFsdWVEaWZmZXJGYWN0b3J5IHtcbiAgICBjb25zdCBmYWN0b3J5ID0gdGhpcy5mYWN0b3JpZXMuZmluZChmID0+IGYuc3VwcG9ydHMoa3YpKTtcbiAgICBpZiAoZmFjdG9yeSkge1xuICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGZpbmQgYSBkaWZmZXIgc3VwcG9ydGluZyBvYmplY3QgJyR7a3Z9J2ApO1xuICB9XG59XG4iXX0=