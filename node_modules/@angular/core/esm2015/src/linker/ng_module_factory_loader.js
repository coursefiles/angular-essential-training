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
import { NgModuleFactory as R3NgModuleFactory } from '../render3/ng_module_ref';
import { stringify } from '../util/stringify';
/**
 * Used to load ng module factories.
 *
 * \@publicApi
 * @deprecated the `string` form of `loadChildren` is deprecated, and `NgModuleFactoryLoader` is
 * part of its implementation. See `LoadChildren` for more details.
 * @abstract
 */
export class NgModuleFactoryLoader {
}
if (false) {
    /**
     * @abstract
     * @param {?} path
     * @return {?}
     */
    NgModuleFactoryLoader.prototype.load = function (path) { };
}
/**
 * Map of module-id to the corresponding NgModule.
 * - In pre Ivy we track NgModuleFactory,
 * - In post Ivy we track the NgModuleType
 * @type {?}
 */
const modules = new Map();
/**
 * Registers a loaded module. Should only be called from generated NgModuleFactory code.
 * \@publicApi
 * @param {?} id
 * @param {?} factory
 * @return {?}
 */
export function registerModuleFactory(id, factory) {
    /** @type {?} */
    const existing = (/** @type {?} */ (modules.get(id)));
    assertSameOrNotExisting(id, existing && existing.moduleType, factory.moduleType);
    modules.set(id, factory);
}
/**
 * @param {?} id
 * @param {?} type
 * @param {?} incoming
 * @return {?}
 */
function assertSameOrNotExisting(id, type, incoming) {
    if (type && type !== incoming) {
        throw new Error(`Duplicate module registered for ${id} - ${stringify(type)} vs ${stringify(type.name)}`);
    }
}
/**
 * @param {?} id
 * @param {?} ngModuleType
 * @return {?}
 */
export function registerNgModuleType(id, ngModuleType) {
    /** @type {?} */
    const existing = (/** @type {?} */ (modules.get(id)));
    assertSameOrNotExisting(id, existing, ngModuleType);
    modules.set(id, ngModuleType);
}
/**
 * @return {?}
 */
export function clearModulesForTest() {
    modules.clear();
}
/**
 * @param {?} id
 * @return {?}
 */
export function getModuleFactory__PRE_R3__(id) {
    /** @type {?} */
    const factory = (/** @type {?} */ (modules.get(id)));
    if (!factory)
        throw noModuleError(id);
    return factory;
}
/**
 * @param {?} id
 * @return {?}
 */
export function getModuleFactory__POST_R3__(id) {
    /** @type {?} */
    const type = (/** @type {?} */ (modules.get(id)));
    if (!type)
        throw noModuleError(id);
    return new R3NgModuleFactory(type);
}
/**
 * Returns the NgModuleFactory with the given id, if it exists and has been loaded.
 * Factories for modules that do not specify an `id` cannot be retrieved. Throws if the module
 * cannot be found.
 * \@publicApi
 * @type {?}
 */
export const getModuleFactory = getModuleFactory__PRE_R3__;
/**
 * @param {?} id
 * @return {?}
 */
function noModuleError(id) {
    return new Error(`No module with ID ${id} loaded`);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfbW9kdWxlX2ZhY3RvcnlfbG9hZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvbGlua2VyL25nX21vZHVsZV9mYWN0b3J5X2xvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVNBLE9BQU8sRUFBQyxlQUFlLElBQUksaUJBQWlCLEVBQWUsTUFBTSwwQkFBMEIsQ0FBQztBQUM1RixPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7Ozs7Ozs7OztBQVk1QyxNQUFNLE9BQWdCLHFCQUFxQjtDQUUxQzs7Ozs7OztJQURDLDJEQUEyRDs7Ozs7Ozs7TUFRdkQsT0FBTyxHQUFHLElBQUksR0FBRyxFQUE2Qzs7Ozs7Ozs7QUFNcEUsTUFBTSxVQUFVLHFCQUFxQixDQUFDLEVBQVUsRUFBRSxPQUE2Qjs7VUFDdkUsUUFBUSxHQUFHLG1CQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQXdCO0lBQ3hELHVCQUF1QixDQUFDLEVBQUUsRUFBRSxRQUFRLElBQUksUUFBUSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDakYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDM0IsQ0FBQzs7Ozs7OztBQUVELFNBQVMsdUJBQXVCLENBQUMsRUFBVSxFQUFFLElBQXFCLEVBQUUsUUFBbUI7SUFDckYsSUFBSSxJQUFJLElBQUksSUFBSSxLQUFLLFFBQVEsRUFBRTtRQUM3QixNQUFNLElBQUksS0FBSyxDQUNYLG1DQUFtQyxFQUFFLE1BQU0sU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQzlGO0FBQ0gsQ0FBQzs7Ozs7O0FBRUQsTUFBTSxVQUFVLG9CQUFvQixDQUFDLEVBQVUsRUFBRSxZQUEwQjs7VUFDbkUsUUFBUSxHQUFHLG1CQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQXVCO0lBQ3ZELHVCQUF1QixDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDcEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDaEMsQ0FBQzs7OztBQUVELE1BQU0sVUFBVSxtQkFBbUI7SUFDakMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ2xCLENBQUM7Ozs7O0FBRUQsTUFBTSxVQUFVLDBCQUEwQixDQUFDLEVBQVU7O1VBQzdDLE9BQU8sR0FBRyxtQkFBQSxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUE4QjtJQUM3RCxJQUFJLENBQUMsT0FBTztRQUFFLE1BQU0sYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLE9BQU8sT0FBTyxDQUFDO0FBQ2pCLENBQUM7Ozs7O0FBRUQsTUFBTSxVQUFVLDJCQUEyQixDQUFDLEVBQVU7O1VBQzlDLElBQUksR0FBRyxtQkFBQSxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUF1QjtJQUNuRCxJQUFJLENBQUMsSUFBSTtRQUFFLE1BQU0sYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ25DLE9BQU8sSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNyQyxDQUFDOzs7Ozs7OztBQVFELE1BQU0sT0FBTyxnQkFBZ0IsR0FBeUMsMEJBQTBCOzs7OztBQUVoRyxTQUFTLGFBQWEsQ0FBQyxFQUFVO0lBQy9CLE9BQU8sSUFBSSxLQUFLLENBQUMscUJBQXFCLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDckQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtUeXBlfSBmcm9tICcuLi9pbnRlcmZhY2UvdHlwZSc7XG5pbXBvcnQge05nTW9kdWxlRmFjdG9yeSBhcyBSM05nTW9kdWxlRmFjdG9yeSwgTmdNb2R1bGVUeXBlfSBmcm9tICcuLi9yZW5kZXIzL25nX21vZHVsZV9yZWYnO1xuaW1wb3J0IHtzdHJpbmdpZnl9IGZyb20gJy4uL3V0aWwvc3RyaW5naWZ5JztcblxuaW1wb3J0IHtOZ01vZHVsZUZhY3Rvcnl9IGZyb20gJy4vbmdfbW9kdWxlX2ZhY3RvcnknO1xuXG5cbi8qKlxuICogVXNlZCB0byBsb2FkIG5nIG1vZHVsZSBmYWN0b3JpZXMuXG4gKlxuICogQHB1YmxpY0FwaVxuICogQGRlcHJlY2F0ZWQgdGhlIGBzdHJpbmdgIGZvcm0gb2YgYGxvYWRDaGlsZHJlbmAgaXMgZGVwcmVjYXRlZCwgYW5kIGBOZ01vZHVsZUZhY3RvcnlMb2FkZXJgIGlzXG4gKiBwYXJ0IG9mIGl0cyBpbXBsZW1lbnRhdGlvbi4gU2VlIGBMb2FkQ2hpbGRyZW5gIGZvciBtb3JlIGRldGFpbHMuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBOZ01vZHVsZUZhY3RvcnlMb2FkZXIge1xuICBhYnN0cmFjdCBsb2FkKHBhdGg6IHN0cmluZyk6IFByb21pc2U8TmdNb2R1bGVGYWN0b3J5PGFueT4+O1xufVxuXG4vKipcbiAqIE1hcCBvZiBtb2R1bGUtaWQgdG8gdGhlIGNvcnJlc3BvbmRpbmcgTmdNb2R1bGUuXG4gKiAtIEluIHByZSBJdnkgd2UgdHJhY2sgTmdNb2R1bGVGYWN0b3J5LFxuICogLSBJbiBwb3N0IEl2eSB3ZSB0cmFjayB0aGUgTmdNb2R1bGVUeXBlXG4gKi9cbmNvbnN0IG1vZHVsZXMgPSBuZXcgTWFwPHN0cmluZywgTmdNb2R1bGVGYWN0b3J5PGFueT58TmdNb2R1bGVUeXBlPigpO1xuXG4vKipcbiAqIFJlZ2lzdGVycyBhIGxvYWRlZCBtb2R1bGUuIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBmcm9tIGdlbmVyYXRlZCBOZ01vZHVsZUZhY3RvcnkgY29kZS5cbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyTW9kdWxlRmFjdG9yeShpZDogc3RyaW5nLCBmYWN0b3J5OiBOZ01vZHVsZUZhY3Rvcnk8YW55Pikge1xuICBjb25zdCBleGlzdGluZyA9IG1vZHVsZXMuZ2V0KGlkKSBhcyBOZ01vZHVsZUZhY3Rvcnk8YW55PjtcbiAgYXNzZXJ0U2FtZU9yTm90RXhpc3RpbmcoaWQsIGV4aXN0aW5nICYmIGV4aXN0aW5nLm1vZHVsZVR5cGUsIGZhY3RvcnkubW9kdWxlVHlwZSk7XG4gIG1vZHVsZXMuc2V0KGlkLCBmYWN0b3J5KTtcbn1cblxuZnVuY3Rpb24gYXNzZXJ0U2FtZU9yTm90RXhpc3RpbmcoaWQ6IHN0cmluZywgdHlwZTogVHlwZTxhbnk+fCBudWxsLCBpbmNvbWluZzogVHlwZTxhbnk+KTogdm9pZCB7XG4gIGlmICh0eXBlICYmIHR5cGUgIT09IGluY29taW5nKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgRHVwbGljYXRlIG1vZHVsZSByZWdpc3RlcmVkIGZvciAke2lkfSAtICR7c3RyaW5naWZ5KHR5cGUpfSB2cyAke3N0cmluZ2lmeSh0eXBlLm5hbWUpfWApO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3Rlck5nTW9kdWxlVHlwZShpZDogc3RyaW5nLCBuZ01vZHVsZVR5cGU6IE5nTW9kdWxlVHlwZSkge1xuICBjb25zdCBleGlzdGluZyA9IG1vZHVsZXMuZ2V0KGlkKSBhcyBOZ01vZHVsZVR5cGUgfCBudWxsO1xuICBhc3NlcnRTYW1lT3JOb3RFeGlzdGluZyhpZCwgZXhpc3RpbmcsIG5nTW9kdWxlVHlwZSk7XG4gIG1vZHVsZXMuc2V0KGlkLCBuZ01vZHVsZVR5cGUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJNb2R1bGVzRm9yVGVzdCgpOiB2b2lkIHtcbiAgbW9kdWxlcy5jbGVhcigpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TW9kdWxlRmFjdG9yeV9fUFJFX1IzX18oaWQ6IHN0cmluZyk6IE5nTW9kdWxlRmFjdG9yeTxhbnk+IHtcbiAgY29uc3QgZmFjdG9yeSA9IG1vZHVsZXMuZ2V0KGlkKSBhcyBOZ01vZHVsZUZhY3Rvcnk8YW55PnwgbnVsbDtcbiAgaWYgKCFmYWN0b3J5KSB0aHJvdyBub01vZHVsZUVycm9yKGlkKTtcbiAgcmV0dXJuIGZhY3Rvcnk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRNb2R1bGVGYWN0b3J5X19QT1NUX1IzX18oaWQ6IHN0cmluZyk6IE5nTW9kdWxlRmFjdG9yeTxhbnk+IHtcbiAgY29uc3QgdHlwZSA9IG1vZHVsZXMuZ2V0KGlkKSBhcyBOZ01vZHVsZVR5cGUgfCBudWxsO1xuICBpZiAoIXR5cGUpIHRocm93IG5vTW9kdWxlRXJyb3IoaWQpO1xuICByZXR1cm4gbmV3IFIzTmdNb2R1bGVGYWN0b3J5KHR5cGUpO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIE5nTW9kdWxlRmFjdG9yeSB3aXRoIHRoZSBnaXZlbiBpZCwgaWYgaXQgZXhpc3RzIGFuZCBoYXMgYmVlbiBsb2FkZWQuXG4gKiBGYWN0b3JpZXMgZm9yIG1vZHVsZXMgdGhhdCBkbyBub3Qgc3BlY2lmeSBhbiBgaWRgIGNhbm5vdCBiZSByZXRyaWV2ZWQuIFRocm93cyBpZiB0aGUgbW9kdWxlXG4gKiBjYW5ub3QgYmUgZm91bmQuXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRNb2R1bGVGYWN0b3J5OiAoaWQ6IHN0cmluZykgPT4gTmdNb2R1bGVGYWN0b3J5PGFueT4gPSBnZXRNb2R1bGVGYWN0b3J5X19QUkVfUjNfXztcblxuZnVuY3Rpb24gbm9Nb2R1bGVFcnJvcihpZDogc3RyaW5nLCApOiBFcnJvciB7XG4gIHJldHVybiBuZXcgRXJyb3IoYE5vIG1vZHVsZSB3aXRoIElEICR7aWR9IGxvYWRlZGApO1xufVxuIl19