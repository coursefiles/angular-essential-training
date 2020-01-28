/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { allowPreviousPlayerStylesMerge, balancePreviousStylesIntoKeyframes, copyStyles } from '../../util';
import { CssKeyframesDriver } from '../css_keyframes/css_keyframes_driver';
import { containsElement, invokeQuery, isBrowser, matchesElement, validateStyleProperty } from '../shared';
import { packageNonAnimatableStyles } from '../special_cased_styles';
import { WebAnimationsPlayer } from './web_animations_player';
export class WebAnimationsDriver {
    constructor() {
        this._isNativeImpl = /\{\s*\[native\s+code\]\s*\}/.test(getElementAnimateFn().toString());
        this._cssKeyframesDriver = new CssKeyframesDriver();
    }
    /**
     * @param {?} prop
     * @return {?}
     */
    validateStyleProperty(prop) { return validateStyleProperty(prop); }
    /**
     * @param {?} element
     * @param {?} selector
     * @return {?}
     */
    matchesElement(element, selector) {
        return matchesElement(element, selector);
    }
    /**
     * @param {?} elm1
     * @param {?} elm2
     * @return {?}
     */
    containsElement(elm1, elm2) { return containsElement(elm1, elm2); }
    /**
     * @param {?} element
     * @param {?} selector
     * @param {?} multi
     * @return {?}
     */
    query(element, selector, multi) {
        return invokeQuery(element, selector, multi);
    }
    /**
     * @param {?} element
     * @param {?} prop
     * @param {?=} defaultValue
     * @return {?}
     */
    computeStyle(element, prop, defaultValue) {
        return (/** @type {?} */ (((/** @type {?} */ (window.getComputedStyle(element))))[prop]));
    }
    /**
     * @param {?} supported
     * @return {?}
     */
    overrideWebAnimationsSupport(supported) { this._isNativeImpl = supported; }
    /**
     * @param {?} element
     * @param {?} keyframes
     * @param {?} duration
     * @param {?} delay
     * @param {?} easing
     * @param {?=} previousPlayers
     * @param {?=} scrubberAccessRequested
     * @return {?}
     */
    animate(element, keyframes, duration, delay, easing, previousPlayers = [], scrubberAccessRequested) {
        /** @type {?} */
        const useKeyframes = !scrubberAccessRequested && !this._isNativeImpl;
        if (useKeyframes) {
            return this._cssKeyframesDriver.animate(element, keyframes, duration, delay, easing, previousPlayers);
        }
        /** @type {?} */
        const fill = delay == 0 ? 'both' : 'forwards';
        /** @type {?} */
        const playerOptions = { duration, delay, fill };
        // we check for this to avoid having a null|undefined value be present
        // for the easing (which results in an error for certain browsers #9752)
        if (easing) {
            playerOptions['easing'] = easing;
        }
        /** @type {?} */
        const previousStyles = {};
        /** @type {?} */
        const previousWebAnimationPlayers = (/** @type {?} */ (previousPlayers.filter((/**
         * @param {?} player
         * @return {?}
         */
        player => player instanceof WebAnimationsPlayer))));
        if (allowPreviousPlayerStylesMerge(duration, delay)) {
            previousWebAnimationPlayers.forEach((/**
             * @param {?} player
             * @return {?}
             */
            player => {
                /** @type {?} */
                let styles = player.currentSnapshot;
                Object.keys(styles).forEach((/**
                 * @param {?} prop
                 * @return {?}
                 */
                prop => previousStyles[prop] = styles[prop]));
            }));
        }
        keyframes = keyframes.map((/**
         * @param {?} styles
         * @return {?}
         */
        styles => copyStyles(styles, false)));
        keyframes = balancePreviousStylesIntoKeyframes(element, keyframes, previousStyles);
        /** @type {?} */
        const specialStyles = packageNonAnimatableStyles(element, keyframes);
        return new WebAnimationsPlayer(element, keyframes, playerOptions, specialStyles);
    }
}
if (false) {
    /**
     * @type {?}
     * @private
     */
    WebAnimationsDriver.prototype._isNativeImpl;
    /**
     * @type {?}
     * @private
     */
    WebAnimationsDriver.prototype._cssKeyframesDriver;
}
/**
 * @return {?}
 */
export function supportsWebAnimations() {
    return typeof getElementAnimateFn() === 'function';
}
/**
 * @return {?}
 */
function getElementAnimateFn() {
    return (isBrowser() && ((/** @type {?} */ (Element))).prototype['animate']) || {};
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViX2FuaW1hdGlvbnNfZHJpdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYW5pbWF0aW9ucy9icm93c2VyL3NyYy9yZW5kZXIvd2ViX2FuaW1hdGlvbnMvd2ViX2FuaW1hdGlvbnNfZHJpdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFTQSxPQUFPLEVBQUMsOEJBQThCLEVBQUUsa0NBQWtDLEVBQUUsVUFBVSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBRTFHLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLHVDQUF1QyxDQUFDO0FBQ3pFLE9BQU8sRUFBQyxlQUFlLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxjQUFjLEVBQUUscUJBQXFCLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDekcsT0FBTyxFQUFDLDBCQUEwQixFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFFbkUsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFFNUQsTUFBTSxPQUFPLG1CQUFtQjtJQUFoQztRQUNVLGtCQUFhLEdBQUcsNkJBQTZCLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUNyRix3QkFBbUIsR0FBRyxJQUFJLGtCQUFrQixFQUFFLENBQUM7SUFxRHpELENBQUM7Ozs7O0lBbkRDLHFCQUFxQixDQUFDLElBQVksSUFBYSxPQUFPLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs7Ozs7O0lBRXBGLGNBQWMsQ0FBQyxPQUFZLEVBQUUsUUFBZ0I7UUFDM0MsT0FBTyxjQUFjLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzNDLENBQUM7Ozs7OztJQUVELGVBQWUsQ0FBQyxJQUFTLEVBQUUsSUFBUyxJQUFhLE9BQU8sZUFBZSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFD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cEUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7QW5pbWF0aW9uUGxheWVyLCDJtVN0eWxlRGF0YX0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5cbmltcG9ydCB7YWxsb3dQcmV2aW91c1BsYXllclN0eWxlc01lcmdlLCBiYWxhbmNlUHJldmlvdXNTdHlsZXNJbnRvS2V5ZnJhbWVzLCBjb3B5U3R5bGVzfSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7QW5pbWF0aW9uRHJpdmVyfSBmcm9tICcuLi9hbmltYXRpb25fZHJpdmVyJztcbmltcG9ydCB7Q3NzS2V5ZnJhbWVzRHJpdmVyfSBmcm9tICcuLi9jc3Nfa2V5ZnJhbWVzL2Nzc19rZXlmcmFtZXNfZHJpdmVyJztcbmltcG9ydCB7Y29udGFpbnNFbGVtZW50LCBpbnZva2VRdWVyeSwgaXNCcm93c2VyLCBtYXRjaGVzRWxlbWVudCwgdmFsaWRhdGVTdHlsZVByb3BlcnR5fSBmcm9tICcuLi9zaGFyZWQnO1xuaW1wb3J0IHtwYWNrYWdlTm9uQW5pbWF0YWJsZVN0eWxlc30gZnJvbSAnLi4vc3BlY2lhbF9jYXNlZF9zdHlsZXMnO1xuXG5pbXBvcnQge1dlYkFuaW1hdGlvbnNQbGF5ZXJ9IGZyb20gJy4vd2ViX2FuaW1hdGlvbnNfcGxheWVyJztcblxuZXhwb3J0IGNsYXNzIFdlYkFuaW1hdGlvbnNEcml2ZXIgaW1wbGVtZW50cyBBbmltYXRpb25Ecml2ZXIge1xuICBwcml2YXRlIF9pc05hdGl2ZUltcGwgPSAvXFx7XFxzKlxcW25hdGl2ZVxccytjb2RlXFxdXFxzKlxcfS8udGVzdChnZXRFbGVtZW50QW5pbWF0ZUZuKCkudG9TdHJpbmcoKSk7XG4gIHByaXZhdGUgX2Nzc0tleWZyYW1lc0RyaXZlciA9IG5ldyBDc3NLZXlmcmFtZXNEcml2ZXIoKTtcblxuICB2YWxpZGF0ZVN0eWxlUHJvcGVydHkocHJvcDogc3RyaW5nKTogYm9vbGVhbiB7IHJldHVybiB2YWxpZGF0ZVN0eWxlUHJvcGVydHkocHJvcCk7IH1cblxuICBtYXRjaGVzRWxlbWVudChlbGVtZW50OiBhbnksIHNlbGVjdG9yOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gbWF0Y2hlc0VsZW1lbnQoZWxlbWVudCwgc2VsZWN0b3IpO1xuICB9XG5cbiAgY29udGFpbnNFbGVtZW50KGVsbTE6IGFueSwgZWxtMjogYW55KTogYm9vbGVhbiB7IHJldHVybiBjb250YWluc0VsZW1lbnQoZWxtMSwgZWxtMik7IH1cblxuICBxdWVyeShlbGVtZW50OiBhbnksIHNlbGVjdG9yOiBzdHJpbmcsIG11bHRpOiBib29sZWFuKTogYW55W10ge1xuICAgIHJldHVybiBpbnZva2VRdWVyeShlbGVtZW50LCBzZWxlY3RvciwgbXVsdGkpO1xuICB9XG5cbiAgY29tcHV0ZVN0eWxlKGVsZW1lbnQ6IGFueSwgcHJvcDogc3RyaW5nLCBkZWZhdWx0VmFsdWU/OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiAod2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkgYXMgYW55KVtwcm9wXSBhcyBzdHJpbmc7XG4gIH1cblxuICBvdmVycmlkZVdlYkFuaW1hdGlvbnNTdXBwb3J0KHN1cHBvcnRlZDogYm9vbGVhbikgeyB0aGlzLl9pc05hdGl2ZUltcGwgPSBzdXBwb3J0ZWQ7IH1cblxuICBhbmltYXRlKFxuICAgICAgZWxlbWVudDogYW55LCBrZXlmcmFtZXM6IMm1U3R5bGVEYXRhW10sIGR1cmF0aW9uOiBudW1iZXIsIGRlbGF5OiBudW1iZXIsIGVhc2luZzogc3RyaW5nLFxuICAgICAgcHJldmlvdXNQbGF5ZXJzOiBBbmltYXRpb25QbGF5ZXJbXSA9IFtdLCBzY3J1YmJlckFjY2Vzc1JlcXVlc3RlZD86IGJvb2xlYW4pOiBBbmltYXRpb25QbGF5ZXIge1xuICAgIGNvbnN0IHVzZUtleWZyYW1lcyA9ICFzY3J1YmJlckFjY2Vzc1JlcXVlc3RlZCAmJiAhdGhpcy5faXNOYXRpdmVJbXBsO1xuICAgIGlmICh1c2VLZXlmcmFtZXMpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jc3NLZXlmcmFtZXNEcml2ZXIuYW5pbWF0ZShcbiAgICAgICAgICBlbGVtZW50LCBrZXlmcmFtZXMsIGR1cmF0aW9uLCBkZWxheSwgZWFzaW5nLCBwcmV2aW91c1BsYXllcnMpO1xuICAgIH1cblxuICAgIGNvbnN0IGZpbGwgPSBkZWxheSA9PSAwID8gJ2JvdGgnIDogJ2ZvcndhcmRzJztcbiAgICBjb25zdCBwbGF5ZXJPcHRpb25zOiB7W2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyfSA9IHtkdXJhdGlvbiwgZGVsYXksIGZpbGx9O1xuICAgIC8vIHdlIGNoZWNrIGZvciB0aGlzIHRvIGF2b2lkIGhhdmluZyBhIG51bGx8dW5kZWZpbmVkIHZhbHVlIGJlIHByZXNlbnRcbiAgICAvLyBmb3IgdGhlIGVhc2luZyAod2hpY2ggcmVzdWx0cyBpbiBhbiBlcnJvciBmb3IgY2VydGFpbiBicm93c2VycyAjOTc1MilcbiAgICBpZiAoZWFzaW5nKSB7XG4gICAgICBwbGF5ZXJPcHRpb25zWydlYXNpbmcnXSA9IGVhc2luZztcbiAgICB9XG5cbiAgICBjb25zdCBwcmV2aW91c1N0eWxlczoge1trZXk6IHN0cmluZ106IGFueX0gPSB7fTtcbiAgICBjb25zdCBwcmV2aW91c1dlYkFuaW1hdGlvblBsYXllcnMgPSA8V2ViQW5pbWF0aW9uc1BsYXllcltdPnByZXZpb3VzUGxheWVycy5maWx0ZXIoXG4gICAgICAgIHBsYXllciA9PiBwbGF5ZXIgaW5zdGFuY2VvZiBXZWJBbmltYXRpb25zUGxheWVyKTtcblxuICAgIGlmIChhbGxvd1ByZXZpb3VzUGxheWVyU3R5bGVzTWVyZ2UoZHVyYXRpb24sIGRlbGF5KSkge1xuICAgICAgcHJldmlvdXNXZWJBbmltYXRpb25QbGF5ZXJzLmZvckVhY2gocGxheWVyID0+IHtcbiAgICAgICAgbGV0IHN0eWxlcyA9IHBsYXllci5jdXJyZW50U25hcHNob3Q7XG4gICAgICAgIE9iamVjdC5rZXlzKHN0eWxlcykuZm9yRWFjaChwcm9wID0+IHByZXZpb3VzU3R5bGVzW3Byb3BdID0gc3R5bGVzW3Byb3BdKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGtleWZyYW1lcyA9IGtleWZyYW1lcy5tYXAoc3R5bGVzID0+IGNvcHlTdHlsZXMoc3R5bGVzLCBmYWxzZSkpO1xuICAgIGtleWZyYW1lcyA9IGJhbGFuY2VQcmV2aW91c1N0eWxlc0ludG9LZXlmcmFtZXMoZWxlbWVudCwga2V5ZnJhbWVzLCBwcmV2aW91c1N0eWxlcyk7XG4gICAgY29uc3Qgc3BlY2lhbFN0eWxlcyA9IHBhY2thZ2VOb25BbmltYXRhYmxlU3R5bGVzKGVsZW1lbnQsIGtleWZyYW1lcyk7XG4gICAgcmV0dXJuIG5ldyBXZWJBbmltYXRpb25zUGxheWVyKGVsZW1lbnQsIGtleWZyYW1lcywgcGxheWVyT3B0aW9ucywgc3BlY2lhbFN0eWxlcyk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN1cHBvcnRzV2ViQW5pbWF0aW9ucygpIHtcbiAgcmV0dXJuIHR5cGVvZiBnZXRFbGVtZW50QW5pbWF0ZUZuKCkgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGdldEVsZW1lbnRBbmltYXRlRm4oKTogYW55IHtcbiAgcmV0dXJuIChpc0Jyb3dzZXIoKSAmJiAoPGFueT5FbGVtZW50KS5wcm90b3R5cGVbJ2FuaW1hdGUnXSkgfHwge307XG59XG4iXX0=