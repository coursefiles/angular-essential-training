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
import { ɵisPromise as isPromise } from '@angular/core';
import { global } from '@angular/core/src/util/global';
import { AsyncTestCompleter } from './async_test_completer';
import { getTestBed } from './test_bed';
export { AsyncTestCompleter } from './async_test_completer';
export { inject } from './test_bed';
export { Log } from './logger';
export { MockNgZone } from './ng_zone_mock';
/** @type {?} */
export const proxy = (/**
 * @param {?} t
 * @return {?}
 */
(t) => t);
/** @type {?} */
const _global = (/** @type {?} */ ((typeof window === 'undefined' ? global : window)));
/** @type {?} */
export const afterEach = _global.afterEach;
/** @type {?} */
export const expect = _global.expect;
/** @type {?} */
const jsmBeforeEach = _global.beforeEach;
/** @type {?} */
const jsmDescribe = _global.describe;
/** @type {?} */
const jsmDDescribe = _global.fdescribe;
/** @type {?} */
const jsmXDescribe = _global.xdescribe;
/** @type {?} */
const jsmIt = _global.it;
/** @type {?} */
const jsmFIt = _global.fit;
/** @type {?} */
const jsmXIt = _global.xit;
/** @type {?} */
const runnerStack = [];
jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000;
/** @type {?} */
const globalTimeOut = jasmine.DEFAULT_TIMEOUT_INTERVAL;
/** @type {?} */
const testBed = getTestBed();
/**
 * Mechanism to run `beforeEach()` functions of Angular tests.
 *
 * Note: Jasmine own `beforeEach` is used by this library to handle DI providers.
 */
class BeforeEachRunner {
    /**
     * @param {?} _parent
     */
    constructor(_parent) {
        this._parent = _parent;
        this._fns = [];
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    beforeEach(fn) { this._fns.push(fn); }
    /**
     * @return {?}
     */
    run() {
        if (this._parent)
            this._parent.run();
        this._fns.forEach((/**
         * @param {?} fn
         * @return {?}
         */
        (fn) => { fn(); }));
    }
}
if (false) {
    /**
     * @type {?}
     * @private
     */
    BeforeEachRunner.prototype._fns;
    /**
     * @type {?}
     * @private
     */
    BeforeEachRunner.prototype._parent;
}
// Reset the test providers before each test
jsmBeforeEach((/**
 * @return {?}
 */
() => { testBed.resetTestingModule(); }));
/**
 * @param {?} jsmFn
 * @param {...?} args
 * @return {?}
 */
function _describe(jsmFn, ...args) {
    /** @type {?} */
    const parentRunner = runnerStack.length === 0 ? null : runnerStack[runnerStack.length - 1];
    /** @type {?} */
    const runner = new BeforeEachRunner((/** @type {?} */ (parentRunner)));
    runnerStack.push(runner);
    /** @type {?} */
    const suite = jsmFn(...args);
    runnerStack.pop();
    return suite;
}
/**
 * @param {...?} args
 * @return {?}
 */
export function describe(...args) {
    return _describe(jsmDescribe, ...args);
}
/**
 * @param {...?} args
 * @return {?}
 */
export function ddescribe(...args) {
    return _describe(jsmDDescribe, ...args);
}
/**
 * @param {...?} args
 * @return {?}
 */
export function xdescribe(...args) {
    return _describe(jsmXDescribe, ...args);
}
/**
 * @param {?} fn
 * @return {?}
 */
export function beforeEach(fn) {
    if (runnerStack.length > 0) {
        // Inside a describe block, beforeEach() uses a BeforeEachRunner
        runnerStack[runnerStack.length - 1].beforeEach(fn);
    }
    else {
        // Top level beforeEach() are delegated to jasmine
        jsmBeforeEach(fn);
    }
}
/**
 * Allows overriding default providers defined in test_injector.js.
 *
 * The given function must return a list of DI providers.
 *
 * Example:
 *
 *   beforeEachProviders(() => [
 *     {provide: Compiler, useClass: MockCompiler},
 *     {provide: SomeToken, useValue: myValue},
 *   ]);
 * @param {?} fn
 * @return {?}
 */
export function beforeEachProviders(fn) {
    jsmBeforeEach((/**
     * @return {?}
     */
    () => {
        /** @type {?} */
        const providers = fn();
        if (!providers)
            return;
        testBed.configureTestingModule({ providers: providers });
    }));
}
/**
 * @param {?} jsmFn
 * @param {?} testName
 * @param {?} testFn
 * @param {?=} testTimeout
 * @return {?}
 */
function _it(jsmFn, testName, testFn, testTimeout = 0) {
    if (runnerStack.length == 0) {
        // This left here intentionally, as we should never get here, and it aids debugging.
        // tslint:disable-next-line
        debugger;
        throw new Error('Empty Stack!');
    }
    /** @type {?} */
    const runner = runnerStack[runnerStack.length - 1];
    /** @type {?} */
    const timeout = Math.max(globalTimeOut, testTimeout);
    jsmFn(testName, (/**
     * @param {?} done
     * @return {?}
     */
    (done) => {
        /** @type {?} */
        const completerProvider = {
            provide: AsyncTestCompleter,
            useFactory: (/**
             * @return {?}
             */
            () => {
                // Mark the test as async when an AsyncTestCompleter is injected in an it()
                return new AsyncTestCompleter();
            })
        };
        testBed.configureTestingModule({ providers: [completerProvider] });
        runner.run();
        if (testFn.length === 0) {
            /** @type {?} */
            const retVal = testFn();
            if (isPromise(retVal)) {
                // Asynchronous test function that returns a Promise - wait for completion.
                retVal.then(done, done.fail);
            }
            else {
                // Synchronous test function - complete immediately.
                done();
            }
        }
        else {
            // Asynchronous test function that takes in 'done' parameter.
            testFn(done);
        }
    }), timeout);
}
/**
 * @param {?} expectation
 * @param {?} assertion
 * @param {?=} timeout
 * @return {?}
 */
export function it(expectation, assertion, timeout) {
    return _it(jsmIt, expectation, assertion, timeout);
}
/**
 * @param {?} expectation
 * @param {?} assertion
 * @param {?=} timeout
 * @return {?}
 */
export function fit(expectation, assertion, timeout) {
    return _it(jsmFIt, expectation, assertion, timeout);
}
/**
 * @param {?} expectation
 * @param {?} assertion
 * @param {?=} timeout
 * @return {?}
 */
export function xit(expectation, assertion, timeout) {
    return _it(jsmXIt, expectation, assertion, timeout);
}
export class SpyObject {
    /**
     * @param {?=} type
     */
    constructor(type) {
        if (type) {
            for (const prop in type.prototype) {
                /** @type {?} */
                let m = null;
                try {
                    m = type.prototype[prop];
                }
                catch (_a) {
                    // As we are creating spys for abstract classes,
                    // these classes might have getters that throw when they are accessed.
                    // As we are only auto creating spys for methods, this
                    // should not matter.
                }
                if (typeof m === 'function') {
                    this.spy(prop);
                }
            }
        }
    }
    /**
     * @param {?} name
     * @return {?}
     */
    spy(name) {
        if (!((/** @type {?} */ (this)))[name]) {
            ((/** @type {?} */ (this)))[name] = jasmine.createSpy(name);
        }
        return ((/** @type {?} */ (this)))[name];
    }
    /**
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    prop(name, value) { ((/** @type {?} */ (this)))[name] = value; }
    /**
     * @param {?=} object
     * @param {?=} config
     * @param {?=} overrides
     * @return {?}
     */
    static stub(object = null, config = null, overrides = null) {
        if (!(object instanceof SpyObject)) {
            overrides = config;
            config = object;
            object = new SpyObject();
        }
        /** @type {?} */
        const m = Object.assign({}, config, overrides);
        Object.keys(m).forEach((/**
         * @param {?} key
         * @return {?}
         */
        key => { object.spy(key).and.returnValue(m[key]); }));
        return object;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdGluZ19pbnRlcm5hbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdGluZy9zcmMvdGVzdGluZ19pbnRlcm5hbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFBQyxVQUFVLElBQUksU0FBUyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3RELE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQztBQUVyRCxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUMxRCxPQUFPLEVBQUMsVUFBVSxFQUFTLE1BQU0sWUFBWSxDQUFDO0FBRTlDLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQzFELE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFFbEMsb0JBQWMsVUFBVSxDQUFDO0FBQ3pCLDJCQUFjLGdCQUFnQixDQUFDOztBQUUvQixNQUFNLE9BQU8sS0FBSzs7OztBQUFtQixDQUFDLENBQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFBOztNQUU1QyxPQUFPLEdBQUcsbUJBQUssQ0FBQyxPQUFPLE1BQU0sS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUE7O0FBRXRFLE1BQU0sT0FBTyxTQUFTLEdBQWEsT0FBTyxDQUFDLFNBQVM7O0FBQ3BELE1BQU0sT0FBTyxNQUFNLEdBQTBDLE9BQU8sQ0FBQyxNQUFNOztNQUVyRSxhQUFhLEdBQUcsT0FBTyxDQUFDLFVBQVU7O01BQ2xDLFdBQVcsR0FBRyxPQUFPLENBQUMsUUFBUTs7TUFDOUIsWUFBWSxHQUFHLE9BQU8sQ0FBQyxTQUFTOztNQUNoQyxZQUFZLEdBQUcsT0FBTyxDQUFDLFNBQVM7O01BQ2hDLEtBQUssR0FBRyxPQUFPLENBQUMsRUFBRTs7TUFDbEIs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QUFJLENBQUMsRUFBRTtZQUN4QixDQUFDLG1CQUFBLElBQUksRUFBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMvQztRQUNELE9BQU8sQ0FBQyxtQkFBQSxJQUFJLEVBQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdCLENBQUM7Ozs7OztJQUVELElBQUksQ0FBQyxJQUFZLEVBQUUsS0FBVSxJQUFJLENBQUMsbUJBQUEsSUFBSSxFQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDOzs7Ozs7O0lBRS9ELE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBYyxJQUFJLEVBQUUsU0FBYyxJQUFJLEVBQUUsWUFBaUIsSUFBSTtRQUN2RSxJQUFJLENBQUMsQ0FBQyxNQUFNLFlBQVksU0FBUyxDQUFDLEVBQUU7WUFDbEMsU0FBUyxHQUFHLE1BQU0sQ0FBQztZQUNuQixNQUFNLEdBQUcsTUFBTSxDQUFDO1lBQ2hCLE1BQU0sR0FBRyxJQUFJLFNBQVMsRUFBRSxDQUFDO1NBQzFCOztjQUVLLENBQUMscUJBQU8sTUFBTSxFQUFLLFNBQVMsQ0FBQztRQUNuQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU87Ozs7UUFBQyxHQUFHLENBQUMsRUFBRSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDO1FBQzVFLE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHvJtWlzUHJvbWlzZSBhcyBpc1Byb21pc2V9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtnbG9iYWx9IGZyb20gJ0Bhbmd1bGFyL2NvcmUvc3JjL3V0aWwvZ2xvYmFsJztcblxuaW1wb3J0IHtBc3luY1Rlc3RDb21wbGV0ZXJ9IGZyb20gJy4vYXN5bmNfdGVzdF9jb21wbGV0ZXInO1xuaW1wb3J0IHtnZXRUZXN0QmVkLCBpbmplY3R9IGZyb20gJy4vdGVzdF9iZWQnO1xuXG5leHBvcnQge0FzeW5jVGVzdENvbXBsZXRlcn0gZnJvbSAnLi9hc3luY190ZXN0X2NvbXBsZXRlcic7XG5leHBvcnQge2luamVjdH0gZnJvbSAnLi90ZXN0X2JlZCc7XG5cbmV4cG9ydCAqIGZyb20gJy4vbG9nZ2VyJztcbmV4cG9ydCAqIGZyb20gJy4vbmdfem9uZV9tb2NrJztcblxuZXhwb3J0IGNvbnN0IHByb3h5OiBDbGFzc0RlY29yYXRvciA9ICh0OiBhbnkpID0+IHQ7XG5cbmNvbnN0IF9nbG9iYWwgPSA8YW55Pih0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHdpbmRvdyk7XG5cbmV4cG9ydCBjb25zdCBhZnRlckVhY2g6IEZ1bmN0aW9uID0gX2dsb2JhbC5hZnRlckVhY2g7XG5leHBvcnQgY29uc3QgZXhwZWN0OiA8VD4oYWN0dWFsOiBUKSA9PiBqYXNtaW5lLk1hdGNoZXJzPFQ+ID0gX2dsb2JhbC5leHBlY3Q7XG5cbmNvbnN0IGpzbUJlZm9yZUVhY2ggPSBfZ2xvYmFsLmJlZm9yZUVhY2g7XG5jb25zdCBqc21EZXNjcmliZSA9IF9nbG9iYWwuZGVzY3JpYmU7XG5jb25zdCBqc21ERGVzY3JpYmUgPSBfZ2xvYmFsLmZkZXNjcmliZTtcbmNvbnN0IGpzbVhEZXNjcmliZSA9IF9nbG9iYWwueGRlc2NyaWJlO1xuY29uc3QganNtSXQgPSBfZ2xvYmFsLml0O1xuY29uc3QganNtRkl0ID0gX2dsb2JhbC5maXQ7XG5jb25zdCBqc21YSXQgPSBfZ2xvYmFsLnhpdDtcblxuY29uc3QgcnVubmVyU3RhY2s6IEJlZm9yZUVhY2hSdW5uZXJbXSA9IFtdO1xuamFzbWluZS5ERUZBVUxUX1RJTUVPVVRfSU5URVJWQUwgPSAzMDAwO1xuY29uc3QgZ2xvYmFsVGltZU91dCA9IGphc21pbmUuREVGQVVMVF9USU1FT1VUX0lOVEVSVkFMO1xuXG5jb25zdCB0ZXN0QmVkID0gZ2V0VGVzdEJlZCgpO1xuXG4vKipcbiAqIE1lY2hhbmlzbSB0byBydW4gYGJlZm9yZUVhY2goKWAgZnVuY3Rpb25zIG9mIEFuZ3VsYXIgdGVzdHMuXG4gKlxuICogTm90ZTogSmFzbWluZSBvd24gYGJlZm9yZUVhY2hgIGlzIHVzZWQgYnkgdGhpcyBsaWJyYXJ5IHRvIGhhbmRsZSBESSBwcm92aWRlcnMuXG4gKi9cbmNsYXNzIEJlZm9yZUVhY2hSdW5uZXIge1xuICBwcml2YXRlIF9mbnM6IEFycmF5PEZ1bmN0aW9uPiA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3BhcmVudDogQmVmb3JlRWFjaFJ1bm5lcikge31cblxuICBiZWZvcmVFYWNoKGZuOiBGdW5jdGlvbik6IHZvaWQgeyB0aGlzLl9mbnMucHVzaChmbik7IH1cblxuICBydW4oKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3BhcmVudCkgdGhpcy5fcGFyZW50LnJ1bigpO1xuICAgIHRoaXMuX2Zucy5mb3JFYWNoKChmbikgPT4geyBmbigpOyB9KTtcbiAgfVxufVxuXG4vLyBSZXNldCB0aGUgdGVzdCBwcm92aWRlcnMgYmVmb3JlIGVhY2ggdGVzdFxuanNtQmVmb3JlRWFjaCgoKSA9PiB7IHRlc3RCZWQucmVzZXRUZXN0aW5nTW9kdWxlKCk7IH0pO1xuXG5mdW5jdGlvbiBfZGVzY3JpYmUoanNtRm46IEZ1bmN0aW9uLCAuLi5hcmdzOiBhbnlbXSkge1xuICBjb25zdCBwYXJlbnRSdW5uZXIgPSBydW5uZXJTdGFjay5sZW5ndGggPT09IDAgPyBudWxsIDogcnVubmVyU3RhY2tbcnVubmVyU3RhY2subGVuZ3RoIC0gMV07XG4gIGNvbnN0IHJ1bm5lciA9IG5ldyBCZWZvcmVFYWNoUnVubmVyKHBhcmVudFJ1bm5lciAhKTtcbiAgcnVubmVyU3RhY2sucHVzaChydW5uZXIpO1xuICBjb25zdCBzdWl0ZSA9IGpzbUZuKC4uLmFyZ3MpO1xuICBydW5uZXJTdGFjay5wb3AoKTtcbiAgcmV0dXJuIHN1aXRlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVzY3JpYmUoLi4uYXJnczogYW55W10pOiB2b2lkIHtcbiAgcmV0dXJuIF9kZXNjcmliZShqc21EZXNjcmliZSwgLi4uYXJncyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZGVzY3JpYmUoLi4uYXJnczogYW55W10pOiB2b2lkIHtcbiAgcmV0dXJuIF9kZXNjcmliZShqc21ERGVzY3JpYmUsIC4uLmFyZ3MpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24geGRlc2NyaWJlKC4uLmFyZ3M6IGFueVtdKTogdm9pZCB7XG4gIHJldHVybiBfZGVzY3JpYmUoanNtWERlc2NyaWJlLCAuLi5hcmdzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJlZm9yZUVhY2goZm46IEZ1bmN0aW9uKTogdm9pZCB7XG4gIGlmIChydW5uZXJTdGFjay5sZW5ndGggPiAwKSB7XG4gICAgLy8gSW5zaWRlIGEgZGVzY3JpYmUgYmxvY2ssIGJlZm9yZUVhY2goKSB1c2VzIGEgQmVmb3JlRWFjaFJ1bm5lclxuICAgIHJ1bm5lclN0YWNrW3J1bm5lclN0YWNrLmxlbmd0aCAtIDFdLmJlZm9yZUVhY2goZm4pO1xuICB9IGVsc2Uge1xuICAgIC8vIFRvcCBsZXZlbCBiZWZvcmVFYWNoKCkgYXJlIGRlbGVnYXRlZCB0byBqYXNtaW5lXG4gICAganNtQmVmb3JlRWFjaChmbik7XG4gIH1cbn1cblxuLyoqXG4gKiBBbGxvd3Mgb3ZlcnJpZGluZyBkZWZhdWx0IHByb3ZpZGVycyBkZWZpbmVkIGluIHRlc3RfaW5qZWN0b3IuanMuXG4gKlxuICogVGhlIGdpdmVuIGZ1bmN0aW9uIG11c3QgcmV0dXJuIGEgbGlzdCBvZiBESSBwcm92aWRlcnMuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiAgIGJlZm9yZUVhY2hQcm92aWRlcnMoKCkgPT4gW1xuICogICAgIHtwcm92aWRlOiBDb21waWxlciwgdXNlQ2xhc3M6IE1vY2tDb21waWxlcn0sXG4gKiAgICAge3Byb3ZpZGU6IFNvbWVUb2tlbiwgdXNlVmFsdWU6IG15VmFsdWV9LFxuICogICBdKTtcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJlZm9yZUVhY2hQcm92aWRlcnMoZm46IEZ1bmN0aW9uKTogdm9pZCB7XG4gIGpzbUJlZm9yZUVhY2goKCkgPT4ge1xuICAgIGNvbnN0IHByb3ZpZGVycyA9IGZuKCk7XG4gICAgaWYgKCFwcm92aWRlcnMpIHJldHVybjtcbiAgICB0ZXN0QmVkLmNvbmZpZ3VyZVRlc3RpbmdNb2R1bGUoe3Byb3ZpZGVyczogcHJvdmlkZXJzfSk7XG4gIH0pO1xufVxuXG5cbmZ1bmN0aW9uIF9pdChcbiAgICBqc21GbjogRnVuY3Rpb24sIHRlc3ROYW1lOiBzdHJpbmcsIHRlc3RGbjogKGRvbmU/OiBEb25lRm4pID0+IGFueSwgdGVzdFRpbWVvdXQgPSAwKTogdm9pZCB7XG4gIGlmIChydW5uZXJTdGFjay5sZW5ndGggPT0gMCkge1xuICAgIC8vIFRoaXMgbGVmdCBoZXJlIGludGVudGlvbmFsbHksIGFzIHdlIHNob3VsZCBuZXZlciBnZXQgaGVyZSwgYW5kIGl0IGFpZHMgZGVidWdnaW5nLlxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxuICAgIGRlYnVnZ2VyO1xuICAgIHRocm93IG5ldyBFcnJvcignRW1wdHkgU3RhY2shJyk7XG4gIH1cbiAgY29uc3QgcnVubmVyID0gcnVubmVyU3RhY2tbcnVubmVyU3RhY2subGVuZ3RoIC0gMV07XG4gIGNvbnN0IHRpbWVvdXQgPSBNYXRoLm1heChnbG9iYWxUaW1lT3V0LCB0ZXN0VGltZW91dCk7XG5cbiAganNtRm4odGVzdE5hbWUsIChkb25lOiBEb25lRm4pID0+IHtcbiAgICBjb25zdCBjb21wbGV0ZXJQcm92aWRlciA9IHtcbiAgICAgIHByb3ZpZGU6IEFzeW5jVGVzdENvbXBsZXRlcixcbiAgICAgIHVzZUZhY3Rvcnk6ICgpID0+IHtcbiAgICAgICAgLy8gTWFyayB0aGUgdGVzdCBhcyBhc3luYyB3aGVuIGFuIEFzeW5jVGVzdENvbXBsZXRlciBpcyBpbmplY3RlZCBpbiBhbiBpdCgpXG4gICAgICAgIHJldHVybiBuZXcgQXN5bmNUZXN0Q29tcGxldGVyKCk7XG4gICAgICB9XG4gICAgfTtcbiAgICB0ZXN0QmVkLmNvbmZpZ3VyZVRlc3RpbmdNb2R1bGUoe3Byb3ZpZGVyczogW2NvbXBsZXRlclByb3ZpZGVyXX0pO1xuICAgIHJ1bm5lci5ydW4oKTtcblxuICAgIGlmICh0ZXN0Rm4ubGVuZ3RoID09PSAwKSB7XG4gICAgICBjb25zdCByZXRWYWwgPSB0ZXN0Rm4oKTtcbiAgICAgIGlmIChpc1Byb21pc2UocmV0VmFsKSkge1xuICAgICAgICAvLyBBc3luY2hyb25vdXMgdGVzdCBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBQcm9taXNlIC0gd2FpdCBmb3IgY29tcGxldGlvbi5cbiAgICAgICAgcmV0VmFsLnRoZW4oZG9uZSwgZG9uZS5mYWlsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFN5bmNocm9ub3VzIHRlc3QgZnVuY3Rpb24gLSBjb21wbGV0ZSBpbW1lZGlhdGVseS5cbiAgICAgICAgZG9uZSgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBBc3luY2hyb25vdXMgdGVzdCBmdW5jdGlvbiB0aGF0IHRha2VzIGluICdkb25lJyBwYXJhbWV0ZXIuXG4gICAgICB0ZXN0Rm4oZG9uZSk7XG4gICAgfVxuICB9LCB0aW1lb3V0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGl0KGV4cGVjdGF0aW9uOiBzdHJpbmcsIGFzc2VydGlvbjogKGRvbmU6IERvbmVGbikgPT4gYW55LCB0aW1lb3V0PzogbnVtYmVyKTogdm9pZCB7XG4gIHJldHVybiBfaXQoanNtSXQsIGV4cGVjdGF0aW9uLCBhc3NlcnRpb24sIHRpbWVvdXQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZml0KGV4cGVjdGF0aW9uOiBzdHJpbmcsIGFzc2VydGlvbjogKGRvbmU6IERvbmVGbikgPT4gYW55LCB0aW1lb3V0PzogbnVtYmVyKTogdm9pZCB7XG4gIHJldHVybiBfaXQoanNtRkl0LCBleHBlY3RhdGlvbiwgYXNzZXJ0aW9uLCB0aW1lb3V0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHhpdChleHBlY3RhdGlvbjogc3RyaW5nLCBhc3NlcnRpb246IChkb25lOiBEb25lRm4pID0+IGFueSwgdGltZW91dD86IG51bWJlcik6IHZvaWQge1xuICByZXR1cm4gX2l0KGpzbVhJdCwgZXhwZWN0YXRpb24sIGFzc2VydGlvbiwgdGltZW91dCk7XG59XG5cbmV4cG9ydCBjbGFzcyBTcHlPYmplY3Qge1xuICBjb25zdHJ1Y3Rvcih0eXBlPzogYW55KSB7XG4gICAgaWYgKHR5cGUpIHtcbiAgICAgIGZvciAoY29uc3QgcHJvcCBpbiB0eXBlLnByb3RvdHlwZSkge1xuICAgICAgICBsZXQgbTogYW55ID0gbnVsbDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBtID0gdHlwZS5wcm90b3R5cGVbcHJvcF07XG4gICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgIC8vIEFzIHdlIGFyZSBjcmVhdGluZyBzcHlzIGZvciBhYnN0cmFjdCBjbGFzc2VzLFxuICAgICAgICAgIC8vIHRoZXNlIGNsYXNzZXMgbWlnaHQgaGF2ZSBnZXR0ZXJzIHRoYXQgdGhyb3cgd2hlbiB0aGV5IGFyZSBhY2Nlc3NlZC5cbiAgICAgICAgICAvLyBBcyB3ZSBhcmUgb25seSBhdXRvIGNyZWF0aW5nIHNweXMgZm9yIG1ldGhvZHMsIHRoaXNcbiAgICAgICAgICAvLyBzaG91bGQgbm90IG1hdHRlci5cbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIG0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICB0aGlzLnNweShwcm9wKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNweShuYW1lOiBzdHJpbmcpIHtcbiAgICBpZiAoISh0aGlzIGFzIGFueSlbbmFtZV0pIHtcbiAgICAgICh0aGlzIGFzIGFueSlbbmFtZV0gPSBqYXNtaW5lLmNyZWF0ZVNweShuYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuICh0aGlzIGFzIGFueSlbbmFtZV07XG4gIH1cblxuICBwcm9wKG5hbWU6IHN0cmluZywgdmFsdWU6IGFueSkgeyAodGhpcyBhcyBhbnkpW25hbWVdID0gdmFsdWU7IH1cblxuICBzdGF0aWMgc3R1YihvYmplY3Q6IGFueSA9IG51bGwsIGNvbmZpZzogYW55ID0gbnVsbCwgb3ZlcnJpZGVzOiBhbnkgPSBudWxsKSB7XG4gICAgaWYgKCEob2JqZWN0IGluc3RhbmNlb2YgU3B5T2JqZWN0KSkge1xuICAgICAgb3ZlcnJpZGVzID0gY29uZmlnO1xuICAgICAgY29uZmlnID0gb2JqZWN0O1xuICAgICAgb2JqZWN0ID0gbmV3IFNweU9iamVjdCgpO1xuICAgIH1cblxuICAgIGNvbnN0IG0gPSB7Li4uY29uZmlnLCAuLi5vdmVycmlkZXN9O1xuICAgIE9iamVjdC5rZXlzKG0pLmZvckVhY2goa2V5ID0+IHsgb2JqZWN0LnNweShrZXkpLmFuZC5yZXR1cm5WYWx1ZShtW2tleV0pOyB9KTtcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG59XG4iXX0=