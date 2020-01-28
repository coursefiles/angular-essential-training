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
import { Location } from '@angular/common';
import { APP_BOOTSTRAP_LISTENER } from '@angular/core';
import { Router } from '@angular/router';
import { UpgradeModule } from '@angular/upgrade/static';
const ɵ0 = (locationSyncBootstrapListener);
/**
 * \@description
 *
 * Creates an initializer that in addition to setting up the Angular
 * router sets up the ngRoute integration.
 *
 * ```
 * \@NgModule({
 *  imports: [
 *   RouterModule.forRoot(SOME_ROUTES),
 *   UpgradeModule
 * ],
 * providers: [
 *   RouterUpgradeInitializer
 * ]
 * })
 * export class AppModule {
 *   ngDoBootstrap() {}
 * }
 * ```
 *
 * \@publicApi
 * @type {?}
 */
export const RouterUpgradeInitializer = {
    provide: APP_BOOTSTRAP_LISTENER,
    multi: true,
    useFactory: (/** @type {?} */ (ɵ0)),
    deps: [UpgradeModule]
};
/**
 * \@internal
 * @param {?} ngUpgrade
 * @return {?}
 */
export function locationSyncBootstrapListener(ngUpgrade) {
    return (/**
     * @return {?}
     */
    () => { setUpLocationSync(ngUpgrade); });
}
/**
 * \@description
 *
 * Sets up a location synchronization.
 *
 * History.pushState does not fire onPopState, so the Angular location
 * doesn't detect it. The workaround is to attach a location change listener
 *
 * \@publicApi
 * @param {?} ngUpgrade
 * @param {?=} urlType
 * @return {?}
 */
export function setUpLocationSync(ngUpgrade, urlType = 'path') {
    if (!ngUpgrade.$injector) {
        throw new Error(`
        RouterUpgradeInitializer can be used only after UpgradeModule.bootstrap has been called.
        Remove RouterUpgradeInitializer and call setUpLocationSync after UpgradeModule.bootstrap.
      `);
    }
    /** @type {?} */
    const router = ngUpgrade.injector.get(Router);
    /** @type {?} */
    const location = ngUpgrade.injector.get(Location);
    ngUpgrade.$injector.get('$rootScope')
        .$on('$locationChangeStart', (/**
     * @param {?} _
     * @param {?} next
     * @param {?} __
     * @return {?}
     */
    (_, next, __) => {
        /** @type {?} */
        let url;
        if (urlType === 'path') {
            url = resolveUrl(next);
        }
        else if (urlType === 'hash') {
            // Remove the first hash from the URL
            /** @type {?} */
            const hashIdx = next.indexOf('#');
            url = resolveUrl(next.substring(0, hashIdx) + next.substring(hashIdx + 1));
        }
        else {
            throw 'Invalid URLType passed to setUpLocationSync: ' + urlType;
        }
        /** @type {?} */
        const path = location.normalize(url.pathname);
        router.navigateByUrl(path + url.search + url.hash);
    }));
}
/**
 * Normalize and parse a URL.
 *
 * - Normalizing means that a relative URL will be resolved into an absolute URL in the context of
 *   the application document.
 * - Parsing means that the anchor's `protocol`, `hostname`, `port`, `pathname` and related
 *   properties are all populated to reflect the normalized URL.
 *
 * While this approach has wide compatibility, it doesn't work as expected on IE. On IE, normalizing
 * happens similar to other browsers, but the parsed components will not be set. (E.g. if you assign
 * `a.href = 'foo'`, then `a.protocol`, `a.host`, etc. will not be correctly updated.)
 * We work around that by performing the parsing in a 2nd step by taking a previously normalized URL
 * and assigning it again. This correctly populates all properties.
 *
 * See
 * https://github.com/angular/angular.js/blob/2c7400e7d07b0f6cec1817dab40b9250ce8ebce6/src/ng/urlUtils.js#L26-L33
 * for more info.
 * @type {?}
 */
let anchor;
/**
 * @param {?} url
 * @return {?}
 */
function resolveUrl(url) {
    if (!anchor) {
        anchor = document.createElement('a');
    }
    anchor.setAttribute('href', url);
    anchor.setAttribute('href', anchor.href);
    return {
        // IE does not start `pathname` with `/` like other browsers.
        pathname: `/${anchor.pathname.replace(/^\//, '')}`,
        search: anchor.search,
        hash: anchor.hash
    };
}
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBncmFkZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3JvdXRlci91cGdyYWRlL3NyYy91cGdyYWRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFBQyxzQkFBc0IsRUFBK0IsTUFBTSxlQUFlLENBQUM7QUFDbkYsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztXQTRCeEMsQ0FBQSw2QkFBNkIsQ0FBMkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFIdEYsTUFBTSxPQUFPLHdCQUF3QixHQUFHO0lBQ3RDLE9BQU8sRUFBRSxzQkFBc0I7SUFDL0IsS0FBSyxFQUFFLElBQUk7SUFDWCxVQUFVLEVBQUUsdUJBQXdFO0lBQ3BGLElBQUksRUFBRSxDQUFDLGFBQWEsQ0FBQztDQUN0Qjs7Ozs7O0FBS0QsTUFBTSxVQUFVLDZCQUE2QixDQUFDLFNBQXdCO0lBQ3BFOzs7SUFBTyxHQUFHLEVBQUUsR0FBRyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQztBQUNqRCxDQUFDOzs7Ozs7Ozs7Ozs7OztBQVlELE1BQU0sVUFBVSxpQkFBaUIsQ0FBQyxTQUF3QixFQUFFLFVBQTJCLE1BQU07SUFDM0YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUU7UUFDeEIsTUFBTSxJQUFJLEtBQUssQ0FBQzs7O09BR2IsQ0FBQyxDQUFDO0tBQ047O1VBRUssTUFBTSxHQUFXLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQzs7VUFDL0MsUUFBUSxHQUFhLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztJQUUzRCxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUM7U0FDaEMsR0FBRyxDQUFDLHNCQUFzQjs7Ozs7O0lBQUUsQ0FBQyxDQUFNLEVBQUUsSUFBWSxFQUFFLEVBQVUsRUFBRSxFQUFFOztZQUM1RCxHQUFHO1FBQ1AsSUFBSSxPQUFPLEtBQUssTUFBTSxFQUFFO1lBQ3RCLEdBQUcsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDeEI7YUFBTSxJQUFJLE9BQU8sS0FBSyxNQUFNLEVBQUU7OztrQkFFdkIsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDO1lBQ2pDLEdBQUcsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM1RTthQUFNO1lBQ0wsTUFBTSwrQ0FBK0MsR0FBRyxPQUFPLENBQUM7U0FDakU7O2NBQ0ssSUFBSSxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztRQUM3QyxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyRCxDQUFDLEVBQUMsQ0FBQztBQUNULENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBb0JHLE1BQW1DOzs7OztBQUN2QyxTQUFTLFVBQVUsQ0FBQyxHQUFXO0lBQzdCLElBQUksQ0FBQyxNQUFNLEVBQUU7UUFDWCxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUN0QztJQUVELE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ2pDLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUV6QyxPQUFPOztRQUVMLFFBQVEsRUFBRSxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtRQUNsRCxNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU07UUFDckIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO0tBQ2xCLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0xvY2F0aW9ufSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtBUFBfQk9PVFNUUkFQX0xJU1RFTkVSLCBDb21wb25lbnRSZWYsIEluamVjdGlvblRva2VufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Um91dGVyfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHtVcGdyYWRlTW9kdWxlfSBmcm9tICdAYW5ndWxhci91cGdyYWRlL3N0YXRpYyc7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKlxuICogQ3JlYXRlcyBhbiBpbml0aWFsaXplciB0aGF0IGluIGFkZGl0aW9uIHRvIHNldHRpbmcgdXAgdGhlIEFuZ3VsYXJcbiAqIHJvdXRlciBzZXRzIHVwIHRoZSBuZ1JvdXRlIGludGVncmF0aW9uLlxuICpcbiAqIGBgYFxuICogQE5nTW9kdWxlKHtcbiAqICBpbXBvcnRzOiBbXG4gKiAgIFJvdXRlck1vZHVsZS5mb3JSb290KFNPTUVfUk9VVEVTKSxcbiAqICAgVXBncmFkZU1vZHVsZVxuICogXSxcbiAqIHByb3ZpZGVyczogW1xuICogICBSb3V0ZXJVcGdyYWRlSW5pdGlhbGl6ZXJcbiAqIF1cbiAqIH0pXG4gKiBleHBvcnQgY2xhc3MgQXBwTW9kdWxlIHtcbiAqICAgbmdEb0Jvb3RzdHJhcCgpIHt9XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBjb25zdCBSb3V0ZXJVcGdyYWRlSW5pdGlhbGl6ZXIgPSB7XG4gIHByb3ZpZGU6IEFQUF9CT09UU1RSQVBfTElTVEVORVIsXG4gIG11bHRpOiB0cnVlLFxuICB1c2VGYWN0b3J5OiBsb2NhdGlvblN5bmNCb290c3RyYXBMaXN0ZW5lciBhcyhuZ1VwZ3JhZGU6IFVwZ3JhZGVNb2R1bGUpID0+ICgpID0+IHZvaWQsXG4gIGRlcHM6IFtVcGdyYWRlTW9kdWxlXVxufTtcblxuLyoqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxvY2F0aW9uU3luY0Jvb3RzdHJhcExpc3RlbmVyKG5nVXBncmFkZTogVXBncmFkZU1vZHVsZSkge1xuICByZXR1cm4gKCkgPT4geyBzZXRVcExvY2F0aW9uU3luYyhuZ1VwZ3JhZGUpOyB9O1xufVxuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqIFNldHMgdXAgYSBsb2NhdGlvbiBzeW5jaHJvbml6YXRpb24uXG4gKlxuICogSGlzdG9yeS5wdXNoU3RhdGUgZG9lcyBub3QgZmlyZSBvblBvcFN0YXRlLCBzbyB0aGUgQW5ndWxhciBsb2NhdGlvblxuICogZG9lc24ndCBkZXRlY3QgaXQuIFRoZSB3b3JrYXJvdW5kIGlzIHRvIGF0dGFjaCBhIGxvY2F0aW9uIGNoYW5nZSBsaXN0ZW5lclxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldFVwTG9jYXRpb25TeW5jKG5nVXBncmFkZTogVXBncmFkZU1vZHVsZSwgdXJsVHlwZTogJ3BhdGgnIHwgJ2hhc2gnID0gJ3BhdGgnKSB7XG4gIGlmICghbmdVcGdyYWRlLiRpbmplY3Rvcikge1xuICAgIHRocm93IG5ldyBFcnJvcihgXG4gICAgICAgIFJvdXRlclVwZ3JhZGVJbml0aWFsaXplciBjYW4gYmUgdXNlZCBvbmx5IGFmdGVyIFVwZ3JhZGVNb2R1bGUuYm9vdHN0cmFwIGhhcyBiZWVuIGNhbGxlZC5cbiAgICAgICAgUmVtb3ZlIFJvdXRlclVwZ3JhZGVJbml0aWFsaXplciBhbmQgY2FsbCBzZXRVcExvY2F0aW9uU3luYyBhZnRlciBVcGdyYWRlTW9kdWxlLmJvb3RzdHJhcC5cbiAgICAgIGApO1xuICB9XG5cbiAgY29uc3Qgcm91dGVyOiBSb3V0ZXIgPSBuZ1VwZ3JhZGUuaW5qZWN0b3IuZ2V0KFJvdXRlcik7XG4gIGNvbnN0IGxvY2F0aW9uOiBMb2NhdGlvbiA9IG5nVXBncmFkZS5pbmplY3Rvci5nZXQoTG9jYXRpb24pO1xuXG4gIG5nVXBncmFkZS4kaW5qZWN0b3IuZ2V0KCckcm9vdFNjb3BlJylcbiAgICAgIC4kb24oJyRsb2NhdGlvbkNoYW5nZVN0YXJ0JywgKF86IGFueSwgbmV4dDogc3RyaW5nLCBfXzogc3RyaW5nKSA9PiB7XG4gICAgICAgIGxldCB1cmw7XG4gICAgICAgIGlmICh1cmxUeXBlID09PSAncGF0aCcpIHtcbiAgICAgICAgICB1cmwgPSByZXNvbHZlVXJsKG5leHQpO1xuICAgICAgICB9IGVsc2UgaWYgKHVybFR5cGUgPT09ICdoYXNoJykge1xuICAgICAgICAgIC8vIFJlbW92ZSB0aGUgZmlyc3QgaGFzaCBmcm9tIHRoZSBVUkxcbiAgICAgICAgICBjb25zdCBoYXNoSWR4ID0gbmV4dC5pbmRleE9mKCcjJyk7XG4gICAgICAgICAgdXJsID0gcmVzb2x2ZVVybChuZXh0LnN1YnN0cmluZygwLCBoYXNoSWR4KSArIG5leHQuc3Vic3RyaW5nKGhhc2hJZHggKyAxKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgJ0ludmFsaWQgVVJMVHlwZSBwYXNzZWQgdG8gc2V0VXBMb2NhdGlvblN5bmM6ICcgKyB1cmxUeXBlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBhdGggPSBsb2NhdGlvbi5ub3JtYWxpemUodXJsLnBhdGhuYW1lKTtcbiAgICAgICAgcm91dGVyLm5hdmlnYXRlQnlVcmwocGF0aCArIHVybC5zZWFyY2ggKyB1cmwuaGFzaCk7XG4gICAgICB9KTtcbn1cblxuLyoqXG4gKiBOb3JtYWxpemUgYW5kIHBhcnNlIGEgVVJMLlxuICpcbiAqIC0gTm9ybWFsaXppbmcgbWVhbnMgdGhhdCBhIHJlbGF0aXZlIFVSTCB3aWxsIGJlIHJlc29sdmVkIGludG8gYW4gYWJzb2x1dGUgVVJMIGluIHRoZSBjb250ZXh0IG9mXG4gKiAgIHRoZSBhcHBsaWNhdGlvbiBkb2N1bWVudC5cbiAqIC0gUGFyc2luZyBtZWFucyB0aGF0IHRoZSBhbmNob3IncyBgcHJvdG9jb2xgLCBgaG9zdG5hbWVgLCBgcG9ydGAsIGBwYXRobmFtZWAgYW5kIHJlbGF0ZWRcbiAqICAgcHJvcGVydGllcyBhcmUgYWxsIHBvcHVsYXRlZCB0byByZWZsZWN0IHRoZSBub3JtYWxpemVkIFVSTC5cbiAqXG4gKiBXaGlsZSB0aGlzIGFwcHJvYWNoIGhhcyB3aWRlIGNvbXBhdGliaWxpdHksIGl0IGRvZXNuJ3Qgd29yayBhcyBleHBlY3RlZCBvbiBJRS4gT24gSUUsIG5vcm1hbGl6aW5nXG4gKiBoYXBwZW5zIHNpbWlsYXIgdG8gb3RoZXIgYnJvd3NlcnMsIGJ1dCB0aGUgcGFyc2VkIGNvbXBvbmVudHMgd2lsbCBub3QgYmUgc2V0LiAoRS5nLiBpZiB5b3UgYXNzaWduXG4gKiBgYS5ocmVmID0gJ2ZvbydgLCB0aGVuIGBhLnByb3RvY29sYCwgYGEuaG9zdGAsIGV0Yy4gd2lsbCBub3QgYmUgY29ycmVjdGx5IHVwZGF0ZWQuKVxuICogV2Ugd29yayBhcm91bmQgdGhhdCBieSBwZXJmb3JtaW5nIHRoZSBwYXJzaW5nIGluIGEgMm5kIHN0ZXAgYnkgdGFraW5nIGEgcHJldmlvdXNseSBub3JtYWxpemVkIFVSTFxuICogYW5kIGFzc2lnbmluZyBpdCBhZ2Fpbi4gVGhpcyBjb3JyZWN0bHkgcG9wdWxhdGVzIGFsbCBwcm9wZXJ0aWVzLlxuICpcbiAqIFNlZVxuICogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci5qcy9ibG9iLzJjNzQwMGU3ZDA3YjBmNmNlYzE4MTdkYWI0MGI5MjUwY2U4ZWJjZTYvc3JjL25nL3VybFV0aWxzLmpzI0wyNi1MMzNcbiAqIGZvciBtb3JlIGluZm8uXG4gKi9cbmxldCBhbmNob3I6IEhUTUxBbmNob3JFbGVtZW50fHVuZGVmaW5lZDtcbmZ1bmN0aW9uIHJlc29sdmVVcmwodXJsOiBzdHJpbmcpOiB7cGF0aG5hbWU6IHN0cmluZywgc2VhcmNoOiBzdHJpbmcsIGhhc2g6IHN0cmluZ30ge1xuICBpZiAoIWFuY2hvcikge1xuICAgIGFuY2hvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgfVxuXG4gIGFuY2hvci5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCB1cmwpO1xuICBhbmNob3Iuc2V0QXR0cmlidXRlKCdocmVmJywgYW5jaG9yLmhyZWYpO1xuXG4gIHJldHVybiB7XG4gICAgLy8gSUUgZG9lcyBub3Qgc3RhcnQgYHBhdGhuYW1lYCB3aXRoIGAvYCBsaWtlIG90aGVyIGJyb3dzZXJzLlxuICAgIHBhdGhuYW1lOiBgLyR7YW5jaG9yLnBhdGhuYW1lLnJlcGxhY2UoL15cXC8vLCAnJyl9YCxcbiAgICBzZWFyY2g6IGFuY2hvci5zZWFyY2gsXG4gICAgaGFzaDogYW5jaG9yLmhhc2hcbiAgfTtcbn1cbiJdfQ==