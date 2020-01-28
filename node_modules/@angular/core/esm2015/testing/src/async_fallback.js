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
/** @type {?} */
const _global = (/** @type {?} */ ((typeof window === 'undefined' ? global : window)));
/**
 * Wraps a test function in an asynchronous test zone. The test will automatically
 * complete when all asynchronous calls within this zone are done. Can be used
 * to wrap an {\@link inject} call.
 *
 * Example:
 *
 * ```
 * it('...', async(inject([AClass], (object) => {
 *   object.doSomething.then(() => {
 *     expect(...);
 *   })
 * });
 * ```
 *
 *
 * @param {?} fn
 * @return {?}
 */
export function asyncFallback(fn) {
    // If we're running using the Jasmine test framework, adapt to call the 'done'
    // function when asynchronous activity is finished.
    if (_global.jasmine) {
        // Not using an arrow function to preserve context passed from call site
        return (/**
         * @param {?} done
         * @return {?}
         */
        function (done) {
            if (!done) {
                // if we run beforeEach in @angular/core/testing/testing_internal then we get no done
                // fake it here and assume sync.
                done = (/**
                 * @return {?}
                 */
                function () { });
                done.fail = (/**
                 * @param {?} e
                 * @return {?}
                 */
                function (e) { throw e; });
            }
            runInTestZone(fn, this, done, (/**
             * @param {?} err
             * @return {?}
             */
            (err) => {
                if (typeof err === 'string') {
                    return done.fail(new Error((/** @type {?} */ (err))));
                }
                else {
                    done.fail(err);
                }
            }));
        });
    }
    // Otherwise, return a promise which will resolve when asynchronous activity
    // is finished. This will be correctly consumed by the Mocha framework with
    // it('...', async(myFn)); or can be used in a custom framework.
    // Not using an arrow function to preserve context passed from call site
    return (/**
     * @return {?}
     */
    function () {
        return new Promise((/**
         * @param {?} finishCallback
         * @param {?} failCallback
         * @return {?}
         */
        (finishCallback, failCallback) => {
            runInTestZone(fn, this, finishCallback, failCallback);
        }));
    });
}
/**
 * @param {?} fn
 * @param {?} context
 * @param {?} finishCallback
 * @param {?} failCallback
 * @return {?}
 */
function runInTestZone(fn, context, finishCallback, failCallback) {
    /** @type {?} */
    const currentZone = Zone.current;
    /** @type {?} */
    const AsyncTestZoneSpec = ((/** @type {?} */ (Zone)))['AsyncTestZoneSpec'];
    if (AsyncTestZoneSpec === undefined) {
        throw new Error('AsyncTestZoneSpec is needed for the async() test helper but could not be found. ' +
            'Please make sure that your environment includes zone.js/dist/async-test.js');
    }
    /** @type {?} */
    const ProxyZoneSpec = (/** @type {?} */ (((/** @type {?} */ (Zone)))['ProxyZoneSpec']));
    if (ProxyZoneSpec === undefined) {
        throw new Error('ProxyZoneSpec is needed for the async() test helper but could not be found. ' +
            'Please make sure that your environment includes zone.js/dist/proxy.js');
    }
    /** @type {?} */
    const proxyZoneSpec = ProxyZoneSpec.get();
    ProxyZoneSpec.assertPresent();
    // We need to create the AsyncTestZoneSpec outside the ProxyZone.
    // If we do it in ProxyZone then we will get to infinite recursion.
    /** @type {?} */
    const proxyZone = Zone.current.getZoneWith('ProxyZoneSpec');
    /** @type {?} */
    const previousDelegate = proxyZoneSpec.getDelegate();
    (/** @type {?} */ ((/** @type {?} */ (proxyZone)).parent)).run((/**
     * @return {?}
     */
    () => {
        /** @type {?} */
        const testZoneSpec = new AsyncTestZoneSpec((/**
         * @return {?}
         */
        () => {
            // Need to restore the original zone.
            currentZone.run((/**
             * @return {?}
             */
            () => {
                if (proxyZoneSpec.getDelegate() == testZoneSpec) {
                    // Only reset the zone spec if it's sill this one. Otherwise, assume it's OK.
                    proxyZoneSpec.setDelegate(previousDelegate);
                }
                finishCallback();
            }));
        }), (/**
         * @param {?} error
         * @return {?}
         */
        (error) => {
            // Need to restore the original zone.
            currentZone.run((/**
             * @return {?}
             */
            () => {
                if (proxyZoneSpec.getDelegate() == testZoneSpec) {
                    // Only reset the zone spec if it's sill this one. Otherwise, assume it's OK.
                    proxyZoneSpec.setDelegate(previousDelegate);
                }
                failCallback(error);
            }));
        }), 'test');
        proxyZoneSpec.setDelegate(testZoneSpec);
    }));
    return Zone.current.runGuarded(fn, context);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN5bmNfZmFsbGJhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3Rpbmcvc3JjL2FzeW5jX2ZhbGxiYWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztNQWNNLE9BQU8sR0FBRyxtQkFBSyxDQUFDLE9BQU8sTUFBTSxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQnRFLE1BQU0sVUFBVSxhQUFhLENBQUMsRUFBWTtJQUN4Qyw4RUFBOEU7SUFDOUUsbURBQW1EO0lBQ25ELElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRTtRQUNuQix3RUFBd0U7UUFDeEU7Ozs7UUFBTyxVQUFTLElBQVM7WUFDdkIsSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDVCxxRkFBcUY7Z0JBQ3JGLGdDQUFnQztnQkFDaEMsSUFBSTs7O2dCQUFHLGNBQVksQ0FBQyxDQUFBLENBQUM7Z0JBQ3JCLElBQUksQ0FBQyxJQUFJOzs7O2dCQUFHLFVBQVMsQ0FBTSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBLENBQUM7YUFDM0M7WUFDRCxhQUFhLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJOzs7O1lBQUUsQ0FBQyxHQUFRLEVBQUUsRUFBRTtnQkFDekMsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUU7b0JBQzNCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxtQkFBUSxHQUFHLEVBQUEsQ0FBQyxDQUFDLENBQUM7aUJBQzFDO3FCQUFNO29CQUNMLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ2hCO1lBQ0gsQ0FBQyxFQUFDLENBQUM7UUFDTCxDQUFDLEVBQUM7S0FDSDtJQUNELDRFQUE0RTtJQUM1RSwyRUFBMkU7SUFDM0UsZ0VBQWdFO0lBQ2hFLHdFQUF3RTtJQUN4RTs7O0lBQU87UUFDTCxPQUFPLElBQUksT0FBTzs7Ozs7UUFBTyxDQUFDLGNBQWMsRUFBRSxZQUFZLEVBQUUsRUFBRTtZQUN4RCxhQUFhLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDeEQsQ0FBQyxFQUFDLENBQUM7SUFDTCxDQUFDLEVBQUM7QUFDSixDQUFDOzs7Ozs7OztBQUVELFNBQVMsYUFBYSxDQUNsQixFQUFZLEVBQUUsT0FBWSxFQUFFLGNBQXdCLEVBQUUsWUFBc0I7O1VBQ3hFLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTzs7VUFDMUIsaUJBQWlCLEdBQUcsQ0FBQyxtQkFBQSxJQUFJLEVBQU8sQ0FBQyxDQUFDLG1CQUFtQixDQUFDO0lBQzVELElBQUksaUJBQWlCLEtBQUssU0FBUyxFQUFFO1FBQ25DLE1BQU0sSUFBSSxLQUFLLENBQ1gsa0ZBQWtGO1lBQ2xGLDRFQUE0RSxDQUFDLENBQUM7S0FDbkY7O1VBQ0ssYUFBYSxHQUFHLG1CQUFBLENBQUMsbUJBQUEsSUFBSSxFQUFPLENBQUMsQ0FBQyxlQUFlLENBQUMsRUFHbkQ7SUFDRCxJQUFJLGFBQWEsS0FBSyxTQUFTLEVBQUU7UUFDL0IsTUFBTSxJQUFJLEtBQUssQ0FDWCw4RUFBOEU7WUFDOUUsdUVBQXVFLENBQUMsQ0FBQztLQUM5RTs7VUFDSyxhQUFhLEdBQUcsYUFBYSxDQUFDLEdBQUcsRUFBRTtJQUN6QyxhQUFhLENBQUMsYUFBYSxFQUFFLENBQUM7Ozs7VUFHeEIsU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQzs7VUFDckQsZ0JBQWdCLEdBQUcsYUFBYSxDQUFDLFdBQVcsRUFBRTtJQUNwRCxtQkFBQSxtQkFBQSxTQUFTLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHOzs7SUFBQyxHQUFHLEVBQUU7O2NBQ3RCLFlBQVksR0FBYSxJQUFJLGlCQUFpQjs7O1FBQ2hELEdBQUcsRUFBRTtZQUNILHFDQUFxQztZQUNyQyxXQUFXLENBQUMsR0FBRzs7O1lBQUMsR0FBRyxFQUFFO2dCQUNuQixJQUFJLGFBQWEsQ0FBQyxXQUFXLEVBQUUsSUFBSSxZQUFZLEVBQUU7b0JBQy9DLDZFQUE2RTtvQkFDN0UsYUFBYSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2lCQUM3QztnQkFDRCxjQUFjLEVBQUUsQ0FBQztZQUNuQixDQUFDLEVBQUMsQ0FBQztRQUNMLENBQUM7Ozs7UUFDRCxDQUFDLEtBQVUsRUFBRSxFQUFFO1lBQ2IscUNBQXFDO1lBQ3JDLFdBQVcsQ0FBQyxHQUFHOzs7WUFBQyxHQUFHLEVBQUU7Z0JBQ25CLElBQUksYUFBYSxDQUFDLFdBQVcsRUFBRSxJQUFJLFlBQVksRUFBRTtvQkFDL0MsNkVBQTZFO29CQUM3RSxhQUFhLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUM7aUJBQzdDO2dCQUNELFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN0QixDQUFDLEVBQUMsQ0FBQztRQUNMLENBQUMsR0FDRCxNQUFNLENBQUM7UUFDWCxhQUFhLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzFDLENBQUMsRUFBQyxDQUFDO0lBQ0gsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDOUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLyoqXG4gKiBhc3luYyBoYXMgYmVlbiBtb3ZlZCB0byB6b25lLmpzXG4gKiB0aGlzIGZpbGUgaXMgZm9yIGZhbGxiYWNrIGluIGNhc2Ugb2xkIHZlcnNpb24gb2Ygem9uZS5qcyBpcyB1c2VkXG4gKi9cbmRlY2xhcmUgdmFyIGdsb2JhbDogYW55O1xuXG5jb25zdCBfZ2xvYmFsID0gPGFueT4odHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOiB3aW5kb3cpO1xuXG4vKipcbiAqIFdyYXBzIGEgdGVzdCBmdW5jdGlvbiBpbiBhbiBhc3luY2hyb25vdXMgdGVzdCB6b25lLiBUaGUgdGVzdCB3aWxsIGF1dG9tYXRpY2FsbHlcbiAqIGNvbXBsZXRlIHdoZW4gYWxsIGFzeW5jaHJvbm91cyBjYWxscyB3aXRoaW4gdGhpcyB6b25lIGFyZSBkb25lLiBDYW4gYmUgdXNlZFxuICogdG8gd3JhcCBhbiB7QGxpbmsgaW5qZWN0fSBjYWxsLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogYGBgXG4gKiBpdCgnLi4uJywgYXN5bmMoaW5qZWN0KFtBQ2xhc3NdLCAob2JqZWN0KSA9PiB7XG4gKiAgIG9iamVjdC5kb1NvbWV0aGluZy50aGVuKCgpID0+IHtcbiAqICAgICBleHBlY3QoLi4uKTtcbiAqICAgfSlcbiAqIH0pO1xuICogYGBgXG4gKlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFzeW5jRmFsbGJhY2soZm46IEZ1bmN0aW9uKTogKGRvbmU6IGFueSkgPT4gYW55IHtcbiAgLy8gSWYgd2UncmUgcnVubmluZyB1c2luZyB0aGUgSmFzbWluZSB0ZXN0IGZyYW1ld29yaywgYWRhcHQgdG8gY2FsbCB0aGUgJ2RvbmUnXG4gIC8vIGZ1bmN0aW9uIHdoZW4gYXN5bmNocm9ub3VzIGFjdGl2aXR5IGlzIGZpbmlzaGVkLlxuICBpZiAoX2dsb2JhbC5qYXNtaW5lKSB7XG4gICAgLy8gTm90IHVzaW5nIGFuIGFycm93IGZ1bmN0aW9uIHRvIHByZXNlcnZlIGNvbnRleHQgcGFzc2VkIGZyb20gY2FsbCBzaXRlXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGRvbmU6IGFueSkge1xuICAgICAgaWYgKCFkb25lKSB7XG4gICAgICAgIC8vIGlmIHdlIHJ1biBiZWZvcmVFYWNoIGluIEBhbmd1bGFyL2NvcmUvdGVzdGluZy90ZXN0aW5nX2ludGVybmFsIHRoZW4gd2UgZ2V0IG5vIGRvbmVcbiAgICAgICAgLy8gZmFrZSBpdCBoZXJlIGFuZCBhc3N1bWUgc3luYy5cbiAgICAgICAgZG9uZSA9IGZ1bmN0aW9uKCkge307XG4gICAgICAgIGRvbmUuZmFpbCA9IGZ1bmN0aW9uKGU6IGFueSkgeyB0aHJvdyBlOyB9O1xuICAgICAgfVxuICAgICAgcnVuSW5UZXN0Wm9uZShmbiwgdGhpcywgZG9uZSwgKGVycjogYW55KSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgZXJyID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIHJldHVybiBkb25lLmZhaWwobmV3IEVycm9yKDxzdHJpbmc+ZXJyKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZG9uZS5mYWlsKGVycik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG4gIH1cbiAgLy8gT3RoZXJ3aXNlLCByZXR1cm4gYSBwcm9taXNlIHdoaWNoIHdpbGwgcmVzb2x2ZSB3aGVuIGFzeW5jaHJvbm91cyBhY3Rpdml0eVxuICAvLyBpcyBmaW5pc2hlZC4gVGhpcyB3aWxsIGJlIGNvcnJlY3RseSBjb25zdW1lZCBieSB0aGUgTW9jaGEgZnJhbWV3b3JrIHdpdGhcbiAgLy8gaXQoJy4uLicsIGFzeW5jKG15Rm4pKTsgb3IgY2FuIGJlIHVzZWQgaW4gYSBjdXN0b20gZnJhbWV3b3JrLlxuICAvLyBOb3QgdXNpbmcgYW4gYXJyb3cgZnVuY3Rpb24gdG8gcHJlc2VydmUgY29udGV4dCBwYXNzZWQgZnJvbSBjYWxsIHNpdGVcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigoZmluaXNoQ2FsbGJhY2ssIGZhaWxDYWxsYmFjaykgPT4ge1xuICAgICAgcnVuSW5UZXN0Wm9uZShmbiwgdGhpcywgZmluaXNoQ2FsbGJhY2ssIGZhaWxDYWxsYmFjayk7XG4gICAgfSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHJ1bkluVGVzdFpvbmUoXG4gICAgZm46IEZ1bmN0aW9uLCBjb250ZXh0OiBhbnksIGZpbmlzaENhbGxiYWNrOiBGdW5jdGlvbiwgZmFpbENhbGxiYWNrOiBGdW5jdGlvbikge1xuICBjb25zdCBjdXJyZW50Wm9uZSA9IFpvbmUuY3VycmVudDtcbiAgY29uc3QgQXN5bmNUZXN0Wm9uZVNwZWMgPSAoWm9uZSBhcyBhbnkpWydBc3luY1Rlc3Rab25lU3BlYyddO1xuICBpZiAoQXN5bmNUZXN0Wm9uZVNwZWMgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0FzeW5jVGVzdFpvbmVTcGVjIGlzIG5lZWRlZCBmb3IgdGhlIGFzeW5jKCkgdGVzdCBoZWxwZXIgYnV0IGNvdWxkIG5vdCBiZSBmb3VuZC4gJyArXG4gICAgICAgICdQbGVhc2UgbWFrZSBzdXJlIHRoYXQgeW91ciBlbnZpcm9ubWVudCBpbmNsdWRlcyB6b25lLmpzL2Rpc3QvYXN5bmMtdGVzdC5qcycpO1xuICB9XG4gIGNvbnN0IFByb3h5Wm9uZVNwZWMgPSAoWm9uZSBhcyBhbnkpWydQcm94eVpvbmVTcGVjJ10gYXMge1xuICAgIGdldCgpOiB7c2V0RGVsZWdhdGUoc3BlYzogWm9uZVNwZWMpOiB2b2lkOyBnZXREZWxlZ2F0ZSgpOiBab25lU3BlYzt9O1xuICAgIGFzc2VydFByZXNlbnQ6ICgpID0+IHZvaWQ7XG4gIH07XG4gIGlmIChQcm94eVpvbmVTcGVjID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdQcm94eVpvbmVTcGVjIGlzIG5lZWRlZCBmb3IgdGhlIGFzeW5jKCkgdGVzdCBoZWxwZXIgYnV0IGNvdWxkIG5vdCBiZSBmb3VuZC4gJyArXG4gICAgICAgICdQbGVhc2UgbWFrZSBzdXJlIHRoYXQgeW91ciBlbnZpcm9ubWVudCBpbmNsdWRlcyB6b25lLmpzL2Rpc3QvcHJveHkuanMnKTtcbiAgfVxuICBjb25zdCBwcm94eVpvbmVTcGVjID0gUHJveHlab25lU3BlYy5nZXQoKTtcbiAgUHJveHlab25lU3BlYy5hc3NlcnRQcmVzZW50KCk7XG4gIC8vIFdlIG5lZWQgdG8gY3JlYXRlIHRoZSBBc3luY1Rlc3Rab25lU3BlYyBvdXRzaWRlIHRoZSBQcm94eVpvbmUuXG4gIC8vIElmIHdlIGRvIGl0IGluIFByb3h5Wm9uZSB0aGVuIHdlIHdpbGwgZ2V0IHRvIGluZmluaXRlIHJlY3Vyc2lvbi5cbiAgY29uc3QgcHJveHlab25lID0gWm9uZS5jdXJyZW50LmdldFpvbmVXaXRoKCdQcm94eVpvbmVTcGVjJyk7XG4gIGNvbnN0IHByZXZpb3VzRGVsZWdhdGUgPSBwcm94eVpvbmVTcGVjLmdldERlbGVnYXRlKCk7XG4gIHByb3h5Wm9uZSAhLnBhcmVudCAhLnJ1bigoKSA9PiB7XG4gICAgY29uc3QgdGVzdFpvbmVTcGVjOiBab25lU3BlYyA9IG5ldyBBc3luY1Rlc3Rab25lU3BlYyhcbiAgICAgICAgKCkgPT4ge1xuICAgICAgICAgIC8vIE5lZWQgdG8gcmVzdG9yZSB0aGUgb3JpZ2luYWwgem9uZS5cbiAgICAgICAgICBjdXJyZW50Wm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHByb3h5Wm9uZVNwZWMuZ2V0RGVsZWdhdGUoKSA9PSB0ZXN0Wm9uZVNwZWMpIHtcbiAgICAgICAgICAgICAgLy8gT25seSByZXNldCB0aGUgem9uZSBzcGVjIGlmIGl0J3Mgc2lsbCB0aGlzIG9uZS4gT3RoZXJ3aXNlLCBhc3N1bWUgaXQncyBPSy5cbiAgICAgICAgICAgICAgcHJveHlab25lU3BlYy5zZXREZWxlZ2F0ZShwcmV2aW91c0RlbGVnYXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbmlzaENhbGxiYWNrKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIChlcnJvcjogYW55KSA9PiB7XG4gICAgICAgICAgLy8gTmVlZCB0byByZXN0b3JlIHRoZSBvcmlnaW5hbCB6b25lLlxuICAgICAgICAgIGN1cnJlbnRab25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICBpZiAocHJveHlab25lU3BlYy5nZXREZWxlZ2F0ZSgpID09IHRlc3Rab25lU3BlYykge1xuICAgICAgICAgICAgICAvLyBPbmx5IHJlc2V0IHRoZSB6b25lIHNwZWMgaWYgaXQncyBzaWxsIHRoaXMgb25lLiBPdGhlcndpc2UsIGFzc3VtZSBpdCdzIE9LLlxuICAgICAgICAgICAgICBwcm94eVpvbmVTcGVjLnNldERlbGVnYXRlKHByZXZpb3VzRGVsZWdhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmFpbENhbGxiYWNrKGVycm9yKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgJ3Rlc3QnKTtcbiAgICBwcm94eVpvbmVTcGVjLnNldERlbGVnYXRlKHRlc3Rab25lU3BlYyk7XG4gIH0pO1xuICByZXR1cm4gWm9uZS5jdXJyZW50LnJ1bkd1YXJkZWQoZm4sIGNvbnRleHQpO1xufVxuIl19