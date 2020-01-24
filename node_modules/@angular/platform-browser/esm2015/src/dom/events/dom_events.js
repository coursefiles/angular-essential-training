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
import { DOCUMENT, isPlatformServer } from '@angular/common';
import { Inject, Injectable, NgZone, Optional, PLATFORM_ID } from '@angular/core';
import { EventManagerPlugin } from './event_manager';
const ɵ0 = /**
 * @return {?}
 */
() => (typeof Zone !== 'undefined') && ((/** @type {?} */ (Zone)))['__symbol__'] ||
    (/**
     * @param {?} v
     * @return {?}
     */
    function (v) { return '__zone_symbol__' + v; });
/**
 * Detect if Zone is present. If it is then use simple zone aware 'addEventListener'
 * since Angular can do much more
 * efficient bookkeeping than Zone can, because we have additional information. This speeds up
 * addEventListener by 3x.
 * @type {?}
 */
const __symbol__ = ((ɵ0))();
/** @type {?} */
const ADD_EVENT_LISTENER = __symbol__('addEventListener');
/** @type {?} */
const REMOVE_EVENT_LISTENER = __symbol__('removeEventListener');
/** @type {?} */
const symbolNames = {};
/** @type {?} */
const FALSE = 'FALSE';
/** @type {?} */
const ANGULAR = 'ANGULAR';
/** @type {?} */
const NATIVE_ADD_LISTENER = 'addEventListener';
/** @type {?} */
const NATIVE_REMOVE_LISTENER = 'removeEventListener';
// use the same symbol string which is used in zone.js
/** @type {?} */
const stopSymbol = '__zone_symbol__propagationStopped';
/** @type {?} */
const stopMethodSymbol = '__zone_symbol__stopImmediatePropagation';
const ɵ1 = /**
 * @return {?}
 */
() => {
    /** @type {?} */
    const blackListedEvents = (typeof Zone !== 'undefined') && ((/** @type {?} */ (Zone)))[__symbol__('BLACK_LISTED_EVENTS')];
    if (blackListedEvents) {
        /** @type {?} */
        const res = {};
        blackListedEvents.forEach((/**
         * @param {?} eventName
         * @return {?}
         */
        eventName => { res[eventName] = eventName; }));
        return res;
    }
    return undefined;
};
/** @type {?} */
const blackListedMap = ((ɵ1))();
/** @type {?} */
const isBlackListedEvent = (/**
 * @param {?} eventName
 * @return {?}
 */
function (eventName) {
    if (!blackListedMap) {
        return false;
    }
    return blackListedMap.hasOwnProperty(eventName);
});
const ɵ2 = isBlackListedEvent;
/**
 * @record
 */
function TaskData() { }
if (false) {
    /** @type {?} */
    TaskData.prototype.zone;
    /** @type {?} */
    TaskData.prototype.handler;
}
// a global listener to handle all dom event,
// so we do not need to create a closure every time
/** @type {?} */
const globalListener = (/**
 * @param {?} event
 * @return {?}
 */
function (event) {
    /** @type {?} */
    const symbolName = symbolNames[event.type];
    if (!symbolName) {
        return;
    }
    /** @type {?} */
    const taskDatas = this[symbolName];
    if (!taskDatas) {
        return;
    }
    /** @type {?} */
    const args = [event];
    if (taskDatas.length === 1) {
        // if taskDatas only have one element, just invoke it
        /** @type {?} */
        const taskData = taskDatas[0];
        if (taskData.zone !== Zone.current) {
            // only use Zone.run when Zone.current not equals to stored zone
            return taskData.zone.run(taskData.handler, this, args);
        }
        else {
            return taskData.handler.apply(this, args);
        }
    }
    else {
        // copy tasks as a snapshot to avoid event handlers remove
        // itself or others
        /** @type {?} */
        const copiedTasks = taskDatas.slice();
        for (let i = 0; i < copiedTasks.length; i++) {
            // if other listener call event.stopImmediatePropagation
            // just break
            if (((/** @type {?} */ (event)))[stopSymbol] === true) {
                break;
            }
            /** @type {?} */
            const taskData = copiedTasks[i];
            if (taskData.zone !== Zone.current) {
                // only use Zone.run when Zone.current not equals to stored zone
                taskData.zone.run(taskData.handler, this, args);
            }
            else {
                taskData.handler.apply(this, args);
            }
        }
    }
});
const ɵ3 = globalListener;
export class DomEventsPlugin extends EventManagerPlugin {
    /**
     * @param {?} doc
     * @param {?} ngZone
     * @param {?} platformId
     */
    constructor(doc, ngZone, platformId) {
        super(doc);
        this.ngZone = ngZone;
        if (!platformId || !isPlatformServer(platformId)) {
            this.patchEvent();
        }
    }
    /**
     * @private
     * @return {?}
     */
    patchEvent() {
        if (typeof Event === 'undefined' || !Event || !Event.prototype) {
            return;
        }
        if (((/** @type {?} */ (Event.prototype)))[stopMethodSymbol]) {
            // already patched by zone.js
            return;
        }
        /** @type {?} */
        const delegate = ((/** @type {?} */ (Event.prototype)))[stopMethodSymbol] =
            Event.prototype.stopImmediatePropagation;
        Event.prototype.stopImmediatePropagation = (/**
         * @return {?}
         */
        function () {
            if (this) {
                this[stopSymbol] = true;
            }
            // should call native delegate in case
            // in some environment part of the application
            // will not use the patched Event
            delegate && delegate.apply(this, arguments);
        });
    }
    // This plugin should come last in the list of plugins, because it accepts all
    // events.
    /**
     * @param {?} eventName
     * @return {?}
     */
    supports(eventName) { return true; }
    /**
     * @param {?} element
     * @param {?} eventName
     * @param {?} handler
     * @return {?}
     */
    addEventListener(element, eventName, handler) {
        /**
         * This code is about to add a listener to the DOM. If Zone.js is present, than
         * `addEventListener` has been patched. The patched code adds overhead in both
         * memory and speed (3x slower) than native. For this reason if we detect that
         * Zone.js is present we use a simple version of zone aware addEventListener instead.
         * The result is faster registration and the zone will be restored.
         * But ZoneSpec.onScheduleTask, ZoneSpec.onInvokeTask, ZoneSpec.onCancelTask
         * will not be invoked
         * We also do manual zone restoration in element.ts renderEventHandlerClosure method.
         *
         * NOTE: it is possible that the element is from different iframe, and so we
         * have to check before we execute the method.
         * @type {?}
         */
        const self = this;
        /** @type {?} */
        const zoneJsLoaded = element[ADD_EVENT_LISTENER];
        /** @type {?} */
        let callback = (/** @type {?} */ (handler));
        // if zonejs is loaded and current zone is not ngZone
        // we keep Zone.current on target for later restoration.
        if (zoneJsLoaded && (!NgZone.isInAngularZone() || isBlackListedEvent(eventName))) {
            /** @type {?} */
            let symbolName = symbolNames[eventName];
            if (!symbolName) {
                symbolName = symbolNames[eventName] = __symbol__(ANGULAR + eventName + FALSE);
            }
            /** @type {?} */
            let taskDatas = ((/** @type {?} */ (element)))[symbolName];
            /** @type {?} */
            const globalListenerRegistered = taskDatas && taskDatas.length > 0;
            if (!taskDatas) {
                taskDatas = ((/** @type {?} */ (element)))[symbolName] = [];
            }
            /** @type {?} */
            const zone = isBlackListedEvent(eventName) ? Zone.root : Zone.current;
            if (taskDatas.length === 0) {
                taskDatas.push({ zone: zone, handler: callback });
            }
            else {
                /** @type {?} */
                let callbackRegistered = false;
                for (let i = 0; i < taskDatas.length; i++) {
                    if (taskDatas[i].handler === callback) {
                        callbackRegistered = true;
                        break;
                    }
                }
                if (!callbackRegistered) {
                    taskDatas.push({ zone: zone, handler: callback });
                }
            }
            if (!globalListenerRegistered) {
                element[ADD_EVENT_LISTENER](eventName, globalListener, false);
            }
        }
        else {
            element[NATIVE_ADD_LISTENER](eventName, callback, false);
        }
        return (/**
         * @return {?}
         */
        () => this.removeEventListener(element, eventName, callback));
    }
    /**
     * @param {?} target
     * @param {?} eventName
     * @param {?} callback
     * @return {?}
     */
    removeEventListener(target, eventName, callback) {
        /** @type {?} */
        let underlyingRemove = target[REMOVE_EVENT_LISTENER];
        // zone.js not loaded, use native removeEventListener
        if (!underlyingRemove) {
            return target[NATIVE_REMOVE_LISTENER].apply(target, [eventName, callback, false]);
        }
        /** @type {?} */
        let symbolName = symbolNames[eventName];
        /** @type {?} */
        let taskDatas = symbolName && target[symbolName];
        if (!taskDatas) {
            // addEventListener not using patched version
            // just call native removeEventListener
            return target[NATIVE_REMOVE_LISTENER].apply(target, [eventName, callback, false]);
        }
        // fix issue 20532, should be able to remove
        // listener which was added inside of ngZone
        /** @type {?} */
        let found = false;
        for (let i = 0; i < taskDatas.length; i++) {
            // remove listener from taskDatas if the callback equals
            if (taskDatas[i].handler === callback) {
                found = true;
                taskDatas.splice(i, 1);
                break;
            }
        }
        if (found) {
            if (taskDatas.length === 0) {
                // all listeners are removed, we can remove the globalListener from target
                underlyingRemove.apply(target, [eventName, globalListener, false]);
            }
        }
        else {
            // not found in taskDatas, the callback may be added inside of ngZone
            // use native remove listener to remove the callback
            target[NATIVE_REMOVE_LISTENER].apply(target, [eventName, callback, false]);
        }
    }
}
DomEventsPlugin.decorators = [
    { type: Injectable }
];
/** @nocollapse */
DomEventsPlugin.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
    { type: NgZone },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [PLATFORM_ID,] }] }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    DomEventsPlugin.prototype.ngZone;
}
export { ɵ0, ɵ1, ɵ2, ɵ3 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tX2V2ZW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLWJyb3dzZXIvc3JjL2RvbS9ldmVudHMvZG9tX2V2ZW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFBQyxRQUFRLEVBQUUsZ0JBQWdCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUMzRCxPQUFPLEVBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUVoRixPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQzs7OztBQVM5QyxHQUFHLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxLQUFLLFdBQVcsQ0FBQyxJQUFJLENBQUMsbUJBQUEsSUFBSSxFQUFPLENBQUMsQ0FBQyxZQUFZLENBQUM7Ozs7O0lBQzlELFVBQVMsQ0FBUyxJQUFZLE9BQU8saUJBQWlCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBOzs7Ozs7OztNQUZoRSxVQUFVLEdBQ1osTUFDbUUsRUFBRTs7TUFDbkUsa0JBQWtCLEdBQXVCLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQzs7TUFDdkUscUJBQXFCLEdBQTBCLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQzs7TUFFaEYsV0FBVyxHQUE0QixFQUFFOztNQUV6QyxLQUFLLEdBQUcsT0FBTzs7TUFDZixPQUFPLEdBQUcsU0FBUzs7TUFDbkIsbUJBQW1CLEdBQUcsa0JBQWtCOztNQUN4QyxzQkFBc0IsR0FBRyxxQkFBcUI7OztNQUc5QyxVQUFVLEdBQUcsbUNBQW1DOztNQUNoRCxnQkFBZ0IsR0FBRyx5Q0FBeUM7Ozs7QUFHMUMsR0FBRyxFQUFFOztVQUNyQixpQkFBaUIsR0FDbkIsQ0FBQyxPQUFPLElBQUksS0FBSyxXQUFXLENBQUMsSUFBSSxDQUFDLG1CQUFBLElB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Q0FBQyxPQUFPLEtBQUssUUFBUSxFQUFFO2dCQUNyQyxLQUFLLEdBQUcsSUFBSSxDQUFDO2dCQUNiLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUN2QixNQUFNO2FBQ1A7U0FDRjtRQUNELElBQUksS0FBSyxFQUFFO1lBQ1QsSUFBSSxTQUFTLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtnQkFDMUIsMEVBQTBFO2dCQUMxRSxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsU0FBUyxFQUFFLGNBQWMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO2FBQ3BFO1NBQ0Y7YUFBTTtZQUNMLHFFQUFxRTtZQUNyRSxvREFBb0Q7WUFDcEQsTUFBTSxDQUFDLHNCQUFzQixDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztTQUM1RTtJQUNILENBQUM7OztZQS9IRixVQUFVOzs7OzRDQUdKLE1BQU0sU0FBQyxRQUFRO1lBakdNLE1BQU07NENBa0czQixRQUFRLFlBQUksTUFBTSxTQUFDLFdBQVc7Ozs7Ozs7SUFESCxpQ0FBc0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RE9DVU1FTlQsIGlzUGxhdGZvcm1TZXJ2ZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0luamVjdCwgSW5qZWN0YWJsZSwgTmdab25lLCBPcHRpb25hbCwgUExBVEZPUk1fSUR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0V2ZW50TWFuYWdlclBsdWdpbn0gZnJvbSAnLi9ldmVudF9tYW5hZ2VyJztcblxuLyoqXG4gKiBEZXRlY3QgaWYgWm9uZSBpcyBwcmVzZW50LiBJZiBpdCBpcyB0aGVuIHVzZSBzaW1wbGUgem9uZSBhd2FyZSAnYWRkRXZlbnRMaXN0ZW5lcidcbiAqIHNpbmNlIEFuZ3VsYXIgY2FuIGRvIG11Y2ggbW9yZVxuICogZWZmaWNpZW50IGJvb2trZWVwaW5nIHRoYW4gWm9uZSBjYW4sIGJlY2F1c2Ugd2UgaGF2ZSBhZGRpdGlvbmFsIGluZm9ybWF0aW9uLiBUaGlzIHNwZWVkcyB1cFxuICogYWRkRXZlbnRMaXN0ZW5lciBieSAzeC5cbiAqL1xuY29uc3QgX19zeW1ib2xfXyA9XG4gICAgKCgpID0+ICh0eXBlb2YgWm9uZSAhPT0gJ3VuZGVmaW5lZCcpICYmIChab25lIGFzIGFueSlbJ19fc3ltYm9sX18nXSB8fFxuICAgICAgICAgZnVuY3Rpb24odjogc3RyaW5nKTogc3RyaW5nIHsgcmV0dXJuICdfX3pvbmVfc3ltYm9sX18nICsgdjsgfSkoKTtcbmNvbnN0IEFERF9FVkVOVF9MSVNURU5FUjogJ2FkZEV2ZW50TGlzdGVuZXInID0gX19zeW1ib2xfXygnYWRkRXZlbnRMaXN0ZW5lcicpO1xuY29uc3QgUkVNT1ZFX0VWRU5UX0xJU1RFTkVSOiAncmVtb3ZlRXZlbnRMaXN0ZW5lcicgPSBfX3N5bWJvbF9fKCdyZW1vdmVFdmVudExpc3RlbmVyJyk7XG5cbmNvbnN0IHN5bWJvbE5hbWVzOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSA9IHt9O1xuXG5jb25zdCBGQUxTRSA9ICdGQUxTRSc7XG5jb25zdCBBTkdVTEFSID0gJ0FOR1VMQVInO1xuY29uc3QgTkFUSVZFX0FERF9MSVNURU5FUiA9ICdhZGRFdmVudExpc3RlbmVyJztcbmNvbnN0IE5BVElWRV9SRU1PVkVfTElTVEVORVIgPSAncmVtb3ZlRXZlbnRMaXN0ZW5lcic7XG5cbi8vIHVzZSB0aGUgc2FtZSBzeW1ib2wgc3RyaW5nIHdoaWNoIGlzIHVzZWQgaW4gem9uZS5qc1xuY29uc3Qgc3RvcFN5bWJvbCA9ICdfX3pvbmVfc3ltYm9sX19wcm9wYWdhdGlvblN0b3BwZWQnO1xuY29uc3Qgc3RvcE1ldGhvZFN5bWJvbCA9ICdfX3pvbmVfc3ltYm9sX19zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24nO1xuXG5cbmNvbnN0IGJsYWNrTGlzdGVkTWFwID0gKCgpID0+IHtcbiAgY29uc3QgYmxhY2tMaXN0ZWRFdmVudHM6IHN0cmluZ1tdID1cbiAgICAgICh0eXBlb2YgWm9uZSAhPT0gJ3VuZGVmaW5lZCcpICYmIChab25lIGFzIGFueSlbX19zeW1ib2xfXygnQkxBQ0tfTElTVEVEX0VWRU5UUycpXTtcbiAgaWYgKGJsYWNrTGlzdGVkRXZlbnRzKSB7XG4gICAgY29uc3QgcmVzOiB7W2V2ZW50TmFtZTogc3RyaW5nXTogc3RyaW5nfSA9IHt9O1xuICAgIGJsYWNrTGlzdGVkRXZlbnRzLmZvckVhY2goZXZlbnROYW1lID0+IHsgcmVzW2V2ZW50TmFtZV0gPSBldmVudE5hbWU7IH0pO1xuICAgIHJldHVybiByZXM7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn0pKCk7XG5cblxuY29uc3QgaXNCbGFja0xpc3RlZEV2ZW50ID0gZnVuY3Rpb24oZXZlbnROYW1lOiBzdHJpbmcpIHtcbiAgaWYgKCFibGFja0xpc3RlZE1hcCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gYmxhY2tMaXN0ZWRNYXAuaGFzT3duUHJvcGVydHkoZXZlbnROYW1lKTtcbn07XG5cbmludGVyZmFjZSBUYXNrRGF0YSB7XG4gIHpvbmU6IGFueTtcbiAgaGFuZGxlcjogRnVuY3Rpb247XG59XG5cbi8vIGEgZ2xvYmFsIGxpc3RlbmVyIHRvIGhhbmRsZSBhbGwgZG9tIGV2ZW50LFxuLy8gc28gd2UgZG8gbm90IG5lZWQgdG8gY3JlYXRlIGEgY2xvc3VyZSBldmVyeSB0aW1lXG5jb25zdCBnbG9iYWxMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50OiBFdmVudCkge1xuICBjb25zdCBzeW1ib2xOYW1lID0gc3ltYm9sTmFtZXNbZXZlbnQudHlwZV07XG4gIGlmICghc3ltYm9sTmFtZSkge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCB0YXNrRGF0YXM6IFRhc2tEYXRhW10gPSB0aGlzW3N5bWJvbE5hbWVdO1xuICBpZiAoIXRhc2tEYXRhcykge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBhcmdzOiBhbnkgPSBbZXZlbnRdO1xuICBpZiAodGFza0RhdGFzLmxlbmd0aCA9PT0gMSkge1xuICAgIC8vIGlmIHRhc2tEYXRhcyBvbmx5IGhhdmUgb25lIGVsZW1lbnQsIGp1c3QgaW52b2tlIGl0XG4gICAgY29uc3QgdGFza0RhdGEgPSB0YXNrRGF0YXNbMF07XG4gICAgaWYgKHRhc2tEYXRhLnpvbmUgIT09IFpvbmUuY3VycmVudCkge1xuICAgICAgLy8gb25seSB1c2UgWm9uZS5ydW4gd2hlbiBab25lLmN1cnJlbnQgbm90IGVxdWFscyB0byBzdG9yZWQgem9uZVxuICAgICAgcmV0dXJuIHRhc2tEYXRhLnpvbmUucnVuKHRhc2tEYXRhLmhhbmRsZXIsIHRoaXMsIGFyZ3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGFza0RhdGEuaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gY29weSB0YXNrcyBhcyBhIHNuYXBzaG90IHRvIGF2b2lkIGV2ZW50IGhhbmRsZXJzIHJlbW92ZVxuICAgIC8vIGl0c2VsZiBvciBvdGhlcnNcbiAgICBjb25zdCBjb3BpZWRUYXNrcyA9IHRhc2tEYXRhcy5zbGljZSgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29waWVkVGFza3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vIGlmIG90aGVyIGxpc3RlbmVyIGNhbGwgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uXG4gICAgICAvLyBqdXN0IGJyZWFrXG4gICAgICBpZiAoKGV2ZW50IGFzIGFueSlbc3RvcFN5bWJvbF0gPT09IHRydWUpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjb25zdCB0YXNrRGF0YSA9IGNvcGllZFRhc2tzW2ldO1xuICAgICAgaWYgKHRhc2tEYXRhLnpvbmUgIT09IFpvbmUuY3VycmVudCkge1xuICAgICAgICAvLyBvbmx5IHVzZSBab25lLnJ1biB3aGVuIFpvbmUuY3VycmVudCBub3QgZXF1YWxzIHRvIHN0b3JlZCB6b25lXG4gICAgICAgIHRhc2tEYXRhLnpvbmUucnVuKHRhc2tEYXRhLmhhbmRsZXIsIHRoaXMsIGFyZ3MpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFza0RhdGEuaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBEb21FdmVudHNQbHVnaW4gZXh0ZW5kcyBFdmVudE1hbmFnZXJQbHVnaW4ge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIEBJbmplY3QoRE9DVU1FTlQpIGRvYzogYW55LCBwcml2YXRlIG5nWm9uZTogTmdab25lLFxuICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChQTEFURk9STV9JRCkgcGxhdGZvcm1JZDoge318bnVsbCkge1xuICAgIHN1cGVyKGRvYyk7XG5cbiAgICBpZiAoIXBsYXRmb3JtSWQgfHwgIWlzUGxhdGZvcm1TZXJ2ZXIocGxhdGZvcm1JZCkpIHtcbiAgICAgIHRoaXMucGF0Y2hFdmVudCgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcGF0Y2hFdmVudCgpIHtcbiAgICBpZiAodHlwZW9mIEV2ZW50ID09PSAndW5kZWZpbmVkJyB8fCAhRXZlbnQgfHwgIUV2ZW50LnByb3RvdHlwZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoKEV2ZW50LnByb3RvdHlwZSBhcyBhbnkpW3N0b3BNZXRob2RTeW1ib2xdKSB7XG4gICAgICAvLyBhbHJlYWR5IHBhdGNoZWQgYnkgem9uZS5qc1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBkZWxlZ2F0ZSA9IChFdmVudC5wcm90b3R5cGUgYXMgYW55KVtzdG9wTWV0aG9kU3ltYm9sXSA9XG4gICAgICAgIEV2ZW50LnByb3RvdHlwZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb247XG4gICAgRXZlbnQucHJvdG90eXBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMpIHtcbiAgICAgICAgdGhpc1tzdG9wU3ltYm9sXSA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIC8vIHNob3VsZCBjYWxsIG5hdGl2ZSBkZWxlZ2F0ZSBpbiBjYXNlXG4gICAgICAvLyBpbiBzb21lIGVudmlyb25tZW50IHBhcnQgb2YgdGhlIGFwcGxpY2F0aW9uXG4gICAgICAvLyB3aWxsIG5vdCB1c2UgdGhlIHBhdGNoZWQgRXZlbnRcbiAgICAgIGRlbGVnYXRlICYmIGRlbGVnYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfVxuXG4gIC8vIFRoaXMgcGx1Z2luIHNob3VsZCBjb21lIGxhc3QgaW4gdGhlIGxpc3Qgb2YgcGx1Z2lucywgYmVjYXVzZSBpdCBhY2NlcHRzIGFsbFxuICAvLyBldmVudHMuXG4gIHN1cHBvcnRzKGV2ZW50TmFtZTogc3RyaW5nKTogYm9vbGVhbiB7IHJldHVybiB0cnVlOyB9XG5cbiAgYWRkRXZlbnRMaXN0ZW5lcihlbGVtZW50OiBIVE1MRWxlbWVudCwgZXZlbnROYW1lOiBzdHJpbmcsIGhhbmRsZXI6IEZ1bmN0aW9uKTogRnVuY3Rpb24ge1xuICAgIC8qKlxuICAgICAqIFRoaXMgY29kZSBpcyBhYm91dCB0byBhZGQgYSBsaXN0ZW5lciB0byB0aGUgRE9NLiBJZiBab25lLmpzIGlzIHByZXNlbnQsIHRoYW5cbiAgICAgKiBgYWRkRXZlbnRMaXN0ZW5lcmAgaGFzIGJlZW4gcGF0Y2hlZC4gVGhlIHBhdGNoZWQgY29kZSBhZGRzIG92ZXJoZWFkIGluIGJvdGhcbiAgICAgKiBtZW1vcnkgYW5kIHNwZWVkICgzeCBzbG93ZXIpIHRoYW4gbmF0aXZlLiBGb3IgdGhpcyByZWFzb24gaWYgd2UgZGV0ZWN0IHRoYXRcbiAgICAgKiBab25lLmpzIGlzIHByZXNlbnQgd2UgdXNlIGEgc2ltcGxlIHZlcnNpb24gb2Ygem9uZSBhd2FyZSBhZGRFdmVudExpc3RlbmVyIGluc3RlYWQuXG4gICAgICogVGhlIHJlc3VsdCBpcyBmYXN0ZXIgcmVnaXN0cmF0aW9uIGFuZCB0aGUgem9uZSB3aWxsIGJlIHJlc3RvcmVkLlxuICAgICAqIEJ1dCBab25lU3BlYy5vblNjaGVkdWxlVGFzaywgWm9uZVNwZWMub25JbnZva2VUYXNrLCBab25lU3BlYy5vbkNhbmNlbFRhc2tcbiAgICAgKiB3aWxsIG5vdCBiZSBpbnZva2VkXG4gICAgICogV2UgYWxzbyBkbyBtYW51YWwgem9uZSByZXN0b3JhdGlvbiBpbiBlbGVtZW50LnRzIHJlbmRlckV2ZW50SGFuZGxlckNsb3N1cmUgbWV0aG9kLlxuICAgICAqXG4gICAgICogTk9URTogaXQgaXMgcG9zc2libGUgdGhhdCB0aGUgZWxlbWVudCBpcyBmcm9tIGRpZmZlcmVudCBpZnJhbWUsIGFuZCBzbyB3ZVxuICAgICAqIGhhdmUgdG8gY2hlY2sgYmVmb3JlIHdlIGV4ZWN1dGUgdGhlIG1ldGhvZC5cbiAgICAgKi9cbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCB6b25lSnNMb2FkZWQgPSBlbGVtZW50W0FERF9FVkVOVF9MSVNURU5FUl07XG4gICAgbGV0IGNhbGxiYWNrOiBFdmVudExpc3RlbmVyID0gaGFuZGxlciBhcyBFdmVudExpc3RlbmVyO1xuICAgIC8vIGlmIHpvbmVqcyBpcyBsb2FkZWQgYW5kIGN1cnJlbnQgem9uZSBpcyBub3Qgbmdab25lXG4gICAgLy8gd2Uga2VlcCBab25lLmN1cnJlbnQgb24gdGFyZ2V0IGZvciBsYXRlciByZXN0b3JhdGlvbi5cbiAgICBpZiAoem9uZUpzTG9hZGVkICYmICghTmdab25lLmlzSW5Bbmd1bGFyWm9uZSgpIHx8IGlzQmxhY2tMaXN0ZWRFdmVudChldmVudE5hbWUpKSkge1xuICAgICAgbGV0IHN5bWJvbE5hbWUgPSBzeW1ib2xOYW1lc1tldmVudE5hbWVdO1xuICAgICAgaWYgKCFzeW1ib2xOYW1lKSB7XG4gICAgICAgIHN5bWJvbE5hbWUgPSBzeW1ib2xOYW1lc1tldmVudE5hbWVdID0gX19zeW1ib2xfXyhBTkdVTEFSICsgZXZlbnROYW1lICsgRkFMU0UpO1xuICAgICAgfVxuICAgICAgbGV0IHRhc2tEYXRhczogVGFza0RhdGFbXSA9IChlbGVtZW50IGFzIGFueSlbc3ltYm9sTmFtZV07XG4gICAgICBjb25zdCBnbG9iYWxMaXN0ZW5lclJlZ2lzdGVyZWQgPSB0YXNrRGF0YXMgJiYgdGFza0RhdGFzLmxlbmd0aCA+IDA7XG4gICAgICBpZiAoIXRhc2tEYXRhcykge1xuICAgICAgICB0YXNrRGF0YXMgPSAoZWxlbWVudCBhcyBhbnkpW3N5bWJvbE5hbWVdID0gW107XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHpvbmUgPSBpc0JsYWNrTGlzdGVkRXZlbnQoZXZlbnROYW1lKSA/IFpvbmUucm9vdCA6IFpvbmUuY3VycmVudDtcbiAgICAgIGlmICh0YXNrRGF0YXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRhc2tEYXRhcy5wdXNoKHt6b25lOiB6b25lLCBoYW5kbGVyOiBjYWxsYmFja30pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGNhbGxiYWNrUmVnaXN0ZXJlZCA9IGZhbHNlO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhc2tEYXRhcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmICh0YXNrRGF0YXNbaV0uaGFuZGxlciA9PT0gY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGNhbGxiYWNrUmVnaXN0ZXJlZCA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFjYWxsYmFja1JlZ2lzdGVyZWQpIHtcbiAgICAgICAgICB0YXNrRGF0YXMucHVzaCh7em9uZTogem9uZSwgaGFuZGxlcjogY2FsbGJhY2t9KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIWdsb2JhbExpc3RlbmVyUmVnaXN0ZXJlZCkge1xuICAgICAgICBlbGVtZW50W0FERF9FVkVOVF9MSVNURU5FUl0oZXZlbnROYW1lLCBnbG9iYWxMaXN0ZW5lciwgZmFsc2UpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50W05BVElWRV9BRERfTElTVEVORVJdKGV2ZW50TmFtZSwgY2FsbGJhY2ssIGZhbHNlKTtcbiAgICB9XG4gICAgcmV0dXJuICgpID0+IHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihlbGVtZW50LCBldmVudE5hbWUsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIHJlbW92ZUV2ZW50TGlzdGVuZXIodGFyZ2V0OiBhbnksIGV2ZW50TmFtZTogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24pOiB2b2lkIHtcbiAgICBsZXQgdW5kZXJseWluZ1JlbW92ZSA9IHRhcmdldFtSRU1PVkVfRVZFTlRfTElTVEVORVJdO1xuICAgIC8vIHpvbmUuanMgbm90IGxvYWRlZCwgdXNlIG5hdGl2ZSByZW1vdmVFdmVudExpc3RlbmVyXG4gICAgaWYgKCF1bmRlcmx5aW5nUmVtb3ZlKSB7XG4gICAgICByZXR1cm4gdGFyZ2V0W05BVElWRV9SRU1PVkVfTElTVEVORVJdLmFwcGx5KHRhcmdldCwgW2V2ZW50TmFtZSwgY2FsbGJhY2ssIGZhbHNlXSk7XG4gICAgfVxuICAgIGxldCBzeW1ib2xOYW1lID0gc3ltYm9sTmFtZXNbZXZlbnROYW1lXTtcbiAgICBsZXQgdGFza0RhdGFzOiBUYXNrRGF0YVtdID0gc3ltYm9sTmFtZSAmJiB0YXJnZXRbc3ltYm9sTmFtZV07XG4gICAgaWYgKCF0YXNrRGF0YXMpIHtcbiAgICAgIC8vIGFkZEV2ZW50TGlzdGVuZXIgbm90IHVzaW5nIHBhdGNoZWQgdmVyc2lvblxuICAgICAgLy8ganVzdCBjYWxsIG5hdGl2ZSByZW1vdmVFdmVudExpc3RlbmVyXG4gICAgICByZXR1cm4gdGFyZ2V0W05BVElWRV9SRU1PVkVfTElTVEVORVJdLmFwcGx5KHRhcmdldCwgW2V2ZW50TmFtZSwgY2FsbGJhY2ssIGZhbHNlXSk7XG4gICAgfVxuICAgIC8vIGZpeCBpc3N1ZSAyMDUzMiwgc2hvdWxkIGJlIGFibGUgdG8gcmVtb3ZlXG4gICAgLy8gbGlzdGVuZXIgd2hpY2ggd2FzIGFkZGVkIGluc2lkZSBvZiBuZ1pvbmVcbiAgICBsZXQgZm91bmQgPSBmYWxzZTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhc2tEYXRhcy5sZW5ndGg7IGkrKykge1xuICAgICAgLy8gcmVtb3ZlIGxpc3RlbmVyIGZyb20gdGFza0RhdGFzIGlmIHRoZSBjYWxsYmFjayBlcXVhbHNcbiAgICAgIGlmICh0YXNrRGF0YXNbaV0uaGFuZGxlciA9PT0gY2FsbGJhY2spIHtcbiAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICB0YXNrRGF0YXMuc3BsaWNlKGksIDEpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZvdW5kKSB7XG4gICAgICBpZiAodGFza0RhdGFzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAvLyBhbGwgbGlzdGVuZXJzIGFyZSByZW1vdmVkLCB3ZSBjYW4gcmVtb3ZlIHRoZSBnbG9iYWxMaXN0ZW5lciBmcm9tIHRhcmdldFxuICAgICAgICB1bmRlcmx5aW5nUmVtb3ZlLmFwcGx5KHRhcmdldCwgW2V2ZW50TmFtZSwgZ2xvYmFsTGlzdGVuZXIsIGZhbHNlXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIG5vdCBmb3VuZCBpbiB0YXNrRGF0YXMsIHRoZSBjYWxsYmFjayBtYXkgYmUgYWRkZWQgaW5zaWRlIG9mIG5nWm9uZVxuICAgICAgLy8gdXNlIG5hdGl2ZSByZW1vdmUgbGlzdGVuZXIgdG8gcmVtb3ZlIHRoZSBjYWxsYmFja1xuICAgICAgdGFyZ2V0W05BVElWRV9SRU1PVkVfTElTVEVORVJdLmFwcGx5KHRhcmdldCwgW2V2ZW50TmFtZSwgY2FsbGJhY2ssIGZhbHNlXSk7XG4gICAgfVxuICB9XG59XG4iXX0=