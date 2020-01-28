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
import { assertDefined } from '../../util/assert';
import { global } from '../../util/global';
import { getComponent, getContext, getDirectives, getHostElement, getInjector, getListeners, getPlayers, getRootComponents, getViewComponent, markDirty } from '../global_utils_api';
/**
 * This value reflects the property on the window where the dev
 * tools are patched (window.ng).
 *
 * @type {?}
 */
export const GLOBAL_PUBLISH_EXPANDO_KEY = 'ng';
/** @type {?} */
let _published = false;
/**
 * Publishes a collection of default debug tools onto`window.ng`.
 *
 * These functions are available globally when Angular is in development
 * mode and are automatically stripped away from prod mode is on.
 * @return {?}
 */
export function publishDefaultGlobalUtils() {
    if (!_published) {
        _published = true;
        publishGlobalUtil('getComponent', getComponent);
        publishGlobalUtil('getContext', getContext);
        publishGlobalUtil('getListeners', getListeners);
        publishGlobalUtil('getViewComponent', getViewComponent);
        publishGlobalUtil('getHostElement', getHostElement);
        publishGlobalUtil('getInjector', getInjector);
        publishGlobalUtil('getRootComponents', getRootComponents);
        publishGlobalUtil('getDirectives', getDirectives);
        publishGlobalUtil('getPlayers', getPlayers);
        publishGlobalUtil('markDirty', markDirty);
    }
}
/**
 * Publishes the given function to `window.ng` so that it can be
 * used from the browser console when an application is not in production.
 * @param {?} name
 * @param {?} fn
 * @return {?}
 */
export function publishGlobalUtil(name, fn) {
    /** @type {?} */
    const w = (/** @type {?} */ ((/** @type {?} */ (global))));
    ngDevMode && assertDefined(fn, 'function not defined');
    if (w) {
        /** @type {?} */
        let container = w[GLOBAL_PUBLISH_EXPANDO_KEY];
        if (!container) {
            container = w[GLOBAL_PUBLISH_EXPANDO_KEY] = {};
        }
        container[name] = fn;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYmFsX3V0aWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvcmVuZGVyMy91dGlsL2dsb2JhbF91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQU9BLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNoRCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFFekMsT0FBTyxFQUFDLFlBQVksRUFBRSxVQUFVLEVBQUUsYUFBYSxFQUFFLGNBQWMsRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxnQkFBZ0IsRUFBRSxTQUFTLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQzs7Ozs7OztBQW9CbkwsTUFBTSxPQUFPLDBCQUEwQixHQUFHLElBQUk7O0lBRTFDLFVBQVUsR0FBRyxLQUFLOzs7Ozs7OztBQU90QixNQUFNLFVBQVUseUJBQXlCO0lBQ3ZDLElBQUksQ0FBQyxVQUFVLEVBQUU7UUFDZixVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLGlCQUFpQixDQUFDLGNBQWMsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUNoRCxpQkFBaUIsQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDNUMsaUJBQWlCLENBQUMsY0FBYyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQ2hELGlCQUFpQixDQUFDLGtCQUFrQixFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFDeEQsaUJBQWlCLENBQUMsZ0JBQWdCLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDcEQsaUJBQWlCLENBQUMsYUFBYSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQzlDLGlCQUFpQixDQUFDLG1CQUFtQixFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFDMUQsaUJBQWlCLENBQUMsZUFBZSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ2xELGlCQUFpQixDQUFDLFlBQVksRUFBRSxVQUFVLENBQUMsQ0FBQztRQUM1QyxpQkFBaUIsQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7S0FDM0M7QUFDSCxDQUFDOzs7Ozs7OztBQVVELE1BQU0sVUFBVSxpQkFBaUIsQ0FBQyxJQUFZLEVBQUUsRUFBWTs7VUFDcEQsQ0FBQyxHQUFHLG1CQUFBLG1CQUFBLE1BQU0sRUFBTyxFQUEwQjtJQUNqRCxTQUFTLElBQUksYUFBYSxDQUFDLEVBQUUsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO0lBQ3ZELElBQUksQ0FBQyxFQUFFOztZQUNELFNBQVMsR0FBRyxDQUFDLENBQUMsMEJBQTBCLENBQUM7UUFDN0MsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNkLFNBQVMsR0FBRyxDQUFDLENBQUMsMEJBQTBCLENBQUMsR0FBRyxFQUFFLENBQUM7U0FDaEQ7UUFDRCxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0tBQ3RCO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7YXNzZXJ0RGVmaW5lZH0gZnJvbSAnLi4vLi4vdXRpbC9hc3NlcnQnO1xuaW1wb3J0IHtnbG9iYWx9IGZyb20gJy4uLy4uL3V0aWwvZ2xvYmFsJztcblxuaW1wb3J0IHtnZXRDb21wb25lbnQsIGdldENvbnRleHQsIGdldERpcmVjdGl2ZXMsIGdldEhvc3RFbGVtZW50LCBnZXRJbmplY3RvciwgZ2V0TGlzdGVuZXJzLCBnZXRQbGF5ZXJzLCBnZXRSb290Q29tcG9uZW50cywgZ2V0Vmlld0NvbXBvbmVudCwgbWFya0RpcnR5fSBmcm9tICcuLi9nbG9iYWxfdXRpbHNfYXBpJztcblxuXG5cbi8qKlxuICogVGhpcyBmaWxlIGludHJvZHVjZXMgc2VyaWVzIG9mIGdsb2JhbGx5IGFjY2Vzc2libGUgZGVidWcgdG9vbHNcbiAqIHRvIGFsbG93IGZvciB0aGUgQW5ndWxhciBkZWJ1Z2dpbmcgc3RvcnkgdG8gZnVuY3Rpb24uXG4gKlxuICogVG8gc2VlIHRoaXMgaW4gYWN0aW9uIHJ1biB0aGUgZm9sbG93aW5nIGNvbW1hbmQ6XG4gKlxuICogICBiYXplbCBydW4gLS1kZWZpbmU9Y29tcGlsZT1hb3RcbiAqICAgLy9wYWNrYWdlcy9jb3JlL3Rlc3QvYnVuZGxpbmcvdG9kbzpkZXZzZXJ2ZXJcbiAqXG4gKiAgVGhlbiBsb2FkIGBsb2NhbGhvc3Q6NTQzMmAgYW5kIHN0YXJ0IHVzaW5nIHRoZSBjb25zb2xlIHRvb2xzLlxuICovXG5cbi8qKlxuICogVGhpcyB2YWx1ZSByZWZsZWN0cyB0aGUgcHJvcGVydHkgb24gdGhlIHdpbmRvdyB3aGVyZSB0aGUgZGV2XG4gKiB0b29scyBhcmUgcGF0Y2hlZCAod2luZG93Lm5nKS5cbiAqICovXG5leHBvcnQgY29uc3QgR0xPQkFMX1BVQkxJU0hfRVhQQU5ET19LRVkgPSAnbmcnO1xuXG5sZXQgX3B1Ymxpc2hlZCA9IGZhbHNlO1xuLyoqXG4gKiBQdWJsaXNoZXMgYSBjb2xsZWN0aW9uIG9mIGRlZmF1bHQgZGVidWcgdG9vbHMgb250b2B3aW5kb3cubmdgLlxuICpcbiAqIFRoZXNlIGZ1bmN0aW9ucyBhcmUgYXZhaWxhYmxlIGdsb2JhbGx5IHdoZW4gQW5ndWxhciBpcyBpbiBkZXZlbG9wbWVudFxuICogbW9kZSBhbmQgYXJlIGF1dG9tYXRpY2FsbHkgc3RyaXBwZWQgYXdheSBmcm9tIHByb2QgbW9kZSBpcyBvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHB1Ymxpc2hEZWZhdWx0R2xvYmFsVXRpbHMoKSB7XG4gIGlmICghX3B1Ymxpc2hlZCkge1xuICAgIF9wdWJsaXNoZWQgPSB0cnVlO1xuICAgIHB1Ymxpc2hHbG9iYWxVdGlsKCdnZXRDb21wb25lbnQnLCBnZXRDb21wb25lbnQpO1xuICAgIHB1Ymxpc2hHbG9iYWxVdGlsKCdnZXRDb250ZXh0JywgZ2V0Q29udGV4dCk7XG4gICAgcHVibGlzaEdsb2JhbFV0aWwoJ2dldExpc3RlbmVycycsIGdldExpc3RlbmVycyk7XG4gICAgcHVibGlzaEdsb2JhbFV0aWwoJ2dldFZpZXdDb21wb25lbnQnLCBnZXRWaWV3Q29tcG9uZW50KTtcbiAgICBwdWJsaXNoR2xvYmFsVXRpbCgnZ2V0SG9zdEVsZW1lbnQnLCBnZXRIb3N0RWxlbWVudCk7XG4gICAgcHVibGlzaEdsb2JhbFV0aWwoJ2dldEluamVjdG9yJywgZ2V0SW5qZWN0b3IpO1xuICAgIHB1Ymxpc2hHbG9iYWxVdGlsKCdnZXRSb290Q29tcG9uZW50cycsIGdldFJvb3RDb21wb25lbnRzKTtcbiAgICBwdWJsaXNoR2xvYmFsVXRpbCgnZ2V0RGlyZWN0aXZlcycsIGdldERpcmVjdGl2ZXMpO1xuICAgIHB1Ymxpc2hHbG9iYWxVdGlsKCdnZXRQbGF5ZXJzJywgZ2V0UGxheWVycyk7XG4gICAgcHVibGlzaEdsb2JhbFV0aWwoJ21hcmtEaXJ0eScsIG1hcmtEaXJ0eSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlY2xhcmUgdHlwZSBHbG9iYWxEZXZNb2RlQ29udGFpbmVyID0ge1xuICBbR0xPQkFMX1BVQkxJU0hfRVhQQU5ET19LRVldOiB7W2ZuTmFtZTogc3RyaW5nXTogRnVuY3Rpb259O1xufTtcblxuLyoqXG4gKiBQdWJsaXNoZXMgdGhlIGdpdmVuIGZ1bmN0aW9uIHRvIGB3aW5kb3cubmdgIHNvIHRoYXQgaXQgY2FuIGJlXG4gKiB1c2VkIGZyb20gdGhlIGJyb3dzZXIgY29uc29sZSB3aGVuIGFuIGFwcGxpY2F0aW9uIGlzIG5vdCBpbiBwcm9kdWN0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcHVibGlzaEdsb2JhbFV0aWwobmFtZTogc3RyaW5nLCBmbjogRnVuY3Rpb24pOiB2b2lkIHtcbiAgY29uc3QgdyA9IGdsb2JhbCBhcyBhbnkgYXMgR2xvYmFsRGV2TW9kZUNvbnRhaW5lcjtcbiAgbmdEZXZNb2RlICYmIGFzc2VydERlZmluZWQoZm4sICdmdW5jdGlvbiBub3QgZGVmaW5lZCcpO1xuICBpZiAodykge1xuICAgIGxldCBjb250YWluZXIgPSB3W0dMT0JBTF9QVUJMSVNIX0VYUEFORE9fS0VZXTtcbiAgICBpZiAoIWNvbnRhaW5lcikge1xuICAgICAgY29udGFpbmVyID0gd1tHTE9CQUxfUFVCTElTSF9FWFBBTkRPX0tFWV0gPSB7fTtcbiAgICB9XG4gICAgY29udGFpbmVyW25hbWVdID0gZm47XG4gIH1cbn1cbiJdfQ==