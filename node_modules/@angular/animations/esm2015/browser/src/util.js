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
import { sequence } from '@angular/animations';
import { isNode } from './render/shared';
/** @type {?} */
export const ONE_SECOND = 1000;
/** @type {?} */
export const SUBSTITUTION_EXPR_START = '{{';
/** @type {?} */
export const SUBSTITUTION_EXPR_END = '}}';
/** @type {?} */
export const ENTER_CLASSNAME = 'ng-enter';
/** @type {?} */
export const LEAVE_CLASSNAME = 'ng-leave';
/** @type {?} */
export const ENTER_SELECTOR = '.ng-enter';
/** @type {?} */
export const LEAVE_SELECTOR = '.ng-leave';
/** @type {?} */
export const NG_TRIGGER_CLASSNAME = 'ng-trigger';
/** @type {?} */
export const NG_TRIGGER_SELECTOR = '.ng-trigger';
/** @type {?} */
export const NG_ANIMATING_CLASSNAME = 'ng-animating';
/** @type {?} */
export const NG_ANIMATING_SELECTOR = '.ng-animating';
/**
 * @param {?} value
 * @return {?}
 */
export function resolveTimingValue(value) {
    if (typeof value == 'number')
        return value;
    /** @type {?} */
    const matches = ((/** @type {?} */ (value))).match(/^(-?[\.\d]+)(m?s)/);
    if (!matches || matches.length < 2)
        return 0;
    return _convertTimeValueToMS(parseFloat(matches[1]), matches[2]);
}
/**
 * @param {?} value
 * @param {?} unit
 * @return {?}
 */
function _convertTimeValueToMS(value, unit) {
    switch (unit) {
        case 's':
            return value * ONE_SECOND;
        default: // ms or something else
            return value;
    }
}
/**
 * @param {?} timings
 * @param {?} errors
 * @param {?=} allowNegativeValues
 * @return {?}
 */
export function resolveTiming(timings, errors, allowNegativeValues) {
    return timings.hasOwnProperty('duration') ?
        (/** @type {?} */ (timings)) :
        parseTimeExpression((/** @type {?} */ (timings)), errors, allowNegativeValues);
}
/**
 * @param {?} exp
 * @param {?} errors
 * @param {?=} allowNegativeValues
 * @return {?}
 */
function parseTimeExpression(exp, errors, allowNegativeValues) {
    /** @type {?} */
    const regex = /^(-?[\.\d]+)(m?s)(?:\s+(-?[\.\d]+)(m?s))?(?:\s+([-a-z]+(?:\(.+?\))?))?$/i;
    /** @type {?} */
    let duration;
    /** @type {?} */
    let delay = 0;
    /** @type {?} */
    let easing = '';
    if (typeof exp === 'string') {
        /** @type {?} */
        const matches = exp.match(regex);
        if (matches === null) {
            errors.push(`The provided timing value "${exp}" is invalid.`);
            return { duration: 0, delay: 0, easing: '' };
        }
        duration = _convertTimeValueToMS(parseFloat(matches[1]), matches[2]);
        /** @type {?} */
        const delayMatch = matches[3];
        if (delayMatch != null) {
            delay = _convertTimeValueToMS(parseFloat(delayMatch), matches[4]);
        }
        /** @type {?} */
        const easingVal = matches[5];
        if (easingVal) {
            easing = easingVal;
        }
    }
    else {
        duration = (/** @type {?} */ (exp));
    }
    if (!allowNegativeValues) {
        /** @type {?} */
        let containsErrors = false;
        /** @type {?} */
        let startIndex = errors.length;
        if (duration < 0) {
            errors.push(`Duration values below 0 are not allowed for this animation step.`);
            containsErrors = true;
        }
        if (delay < 0) {
            errors.push(`Delay values below 0 are not allowed for this animation step.`);
            containsErrors = true;
        }
        if (containsErrors) {
            errors.splice(startIndex, 0, `The provided timing value "${exp}" is invalid.`);
        }
    }
    return { duration, delay, easing };
}
/**
 * @param {?} obj
 * @param {?=} destination
 * @return {?}
 */
export function copyObj(obj, destination = {}) {
    Object.keys(obj).forEach((/**
     * @param {?} prop
     * @return {?}
     */
    prop => { destination[prop] = obj[prop]; }));
    return destination;
}
/**
 * @param {?} styles
 * @return {?}
 */
export function normalizeStyles(styles) {
    /** @type {?} */
    const normalizedStyles = {};
    if (Array.isArray(styles)) {
        styles.forEach((/**
         * @param {?} data
         * @return {?}
         */
        data => copyStyles(data, false, normalizedStyles)));
    }
    else {
        copyStyles(styles, false, normalizedStyles);
    }
    return normalizedStyles;
}
/**
 * @param {?} styles
 * @param {?} readPrototype
 * @param {?=} destination
 * @return {?}
 */
export function copyStyles(styles, readPrototype, destination = {}) {
    if (readPrototype) {
        // we make use of a for-in loop so that the
        // prototypically inherited properties are
        // revealed from the backFill map
        for (let prop in styles) {
            destination[prop] = styles[prop];
        }
    }
    else {
        copyObj(styles, destination);
    }
    return destination;
}
/**
 * @param {?} element
 * @param {?} key
 * @param {?} value
 * @return {?}
 */
function getStyleAttributeString(element, key, value) {
    // Return the key-value pair string to be added to the style attribute for the
    // given CSS style key.
    if (value) {
        return key + ':' + value + ';';
    }
    else {
        return '';
    }
}
/**
 * @param {?} element
 * @return {?}
 */
function writeStyleAttribute(element) {
    // Read the style property of the element and manually reflect it to the
    // style attribute. This is needed because Domino on platform-server doesn't
    // understand the full set of allowed CSS properties and doesn't reflect some
    // of them automatically.
    /** @type {?} */
    let styleAttrValue = '';
    for (let i = 0; i < element.style.length; i++) {
        /** @type {?} */
        const key = element.style.item(i);
        styleAttrValue += getStyleAttributeString(element, key, element.style.getPropertyValue(key));
    }
    for (const key in element.style) {
        // Skip internal Domino properties that don't need to be reflected.
        if (!element.style.hasOwnProperty(key) || key.startsWith('_')) {
            continue;
        }
        /** @type {?} */
        const dashKey = camelCaseToDashCase(key);
        styleAttrValue += getStyleAttributeString(element, dashKey, element.style[key]);
    }
    element.setAttribute('style', styleAttrValue);
}
/**
 * @param {?} element
 * @param {?} styles
 * @param {?=} formerStyles
 * @return {?}
 */
export function setStyles(element, styles, formerStyles) {
    if (element['style']) {
        Object.keys(styles).forEach((/**
         * @param {?} prop
         * @return {?}
         */
        prop => {
            /** @type {?} */
            const camelProp = dashCaseToCamelCase(prop);
            if (formerStyles && !formerStyles.hasOwnProperty(prop)) {
                formerStyles[prop] = element.style[camelProp];
            }
            element.style[camelProp] = styles[prop];
        }));
        // On the server set the 'style' attribute since it's not automatically reflected.
        if (isNode()) {
            writeStyleAttribute(element);
        }
    }
}
/**
 * @param {?} element
 * @param {?} styles
 * @return {?}
 */
export function eraseStyles(element, styles) {
    if (element['style']) {
        Object.keys(styles).forEach((/**
         * @param {?} prop
         * @return {?}
         */
        prop => {
            /** @type {?} */
            const camelProp = dashCaseToCamelCase(prop);
            element.style[camelProp] = '';
        }));
        // On the server set the 'style' attribute since it's not automatically reflected.
        if (isNode()) {
            writeStyleAttribute(element);
        }
    }
}
/**
 * @param {?} steps
 * @return {?}
 */
export function normalizeAnimationEntry(steps) {
    if (Array.isArray(steps)) {
        if (steps.length == 1)
            return steps[0];
        return sequence(steps);
    }
    return (/** @type {?} */ (steps));
}
/**
 * @param {?} value
 * @param {?} options
 * @param {?} errors
 * @return {?}
 */
export function validateStyleParams(value, options, errors) {
    /** @type {?} */
    const params = options.params || {};
    /** @type {?} */
    const matches = extractStyleParams(value);
    if (matches.length) {
        matches.forEach((/**
         * @param {?} varName
         * @return {?}
         */
        varName => {
            if (!params.hasOwnProperty(varName)) {
                errors.push(`Unable to resolve the local animation param ${varName} in the given list of values`);
            }
        }));
    }
}
/** @type {?} */
const PARAM_REGEX = new RegExp(`${SUBSTITUTION_EXPR_START}\\s*(.+?)\\s*${SUBSTITUTION_EXPR_END}`, 'g');
/**
 * @param {?} value
 * @return {?}
 */
export function extractStyleParams(value) {
    /** @type {?} */
    let params = [];
    if (typeof value === 'string') {
        /** @type {?} */
        const val = value.toString();
        /** @type {?} */
        let match;
        while (match = PARAM_REGEX.exec(val)) {
            params.push((/** @type {?} */ (match[1])));
        }
        PARAM_REGEX.lastIndex = 0;
    }
    return params;
}
/**
 * @param {?} value
 * @param {?} params
 * @param {?} errors
 * @return {?}
 */
export function interpolateParams(value, params, errors) {
    /** @type {?} */
    const original = value.toString();
    /** @type {?} */
    const str = original.replace(PARAM_REGEX, (/**
     * @param {?} _
     * @param {?} varName
     * @return {?}
     */
    (_, varName) => {
        /** @type {?} */
        let localVal = params[varName];
        // this means that the value was never overridden by the data passed in by the user
        if (!params.hasOwnProperty(varName)) {
            errors.push(`Please provide a value for the animation param ${varName}`);
            localVal = '';
        }
        return localVal.toString();
    }));
    // we do this to assert that numeric values stay as they are
    return str == original ? value : str;
}
/**
 * @param {?} iterator
 * @return {?}
 */
export function iteratorToArray(iterator) {
    /** @type {?} */
    const arr = [];
    /** @type {?} */
    let item = iterator.next();
    while (!item.done) {
        arr.push(item.value);
        item = iterator.next();
    }
    return arr;
}
/**
 * @param {?} source
 * @param {?} destination
 * @return {?}
 */
export function mergeAnimationOptions(source, destination) {
    if (source.params) {
        /** @type {?} */
        const p0 = source.params;
        if (!destination.params) {
            destination.params = {};
        }
        /** @type {?} */
        const p1 = destination.params;
        Object.keys(p0).forEach((/**
         * @param {?} param
         * @return {?}
         */
        param => {
            if (!p1.hasOwnProperty(param)) {
                p1[param] = p0[param];
            }
        }));
    }
    return destination;
}
/** @type {?} */
const DASH_CASE_REGEXP = /-+([a-z0-9])/g;
/**
 * @param {?} input
 * @return {?}
 */
export function dashCaseToCamelCase(input) {
    return input.replace(DASH_CASE_REGEXP, (/**
     * @param {...?} m
     * @return {?}
     */
    (...m) => m[1].toUpperCase()));
}
/**
 * @param {?} input
 * @return {?}
 */
function camelCaseToDashCase(input) {
    return input.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
/**
 * @param {?} duration
 * @param {?} delay
 * @return {?}
 */
export function allowPreviousPlayerStylesMerge(duration, delay) {
    return duration === 0 || delay === 0;
}
/**
 * @param {?} element
 * @param {?} keyframes
 * @param {?} previousStyles
 * @return {?}
 */
export function balancePreviousStylesIntoKeyframes(element, keyframes, previousStyles) {
    /** @type {?} */
    const previousStyleProps = Object.keys(previousStyles);
    if (previousStyleProps.length && keyframes.length) {
        /** @type {?} */
        let startingKeyframe = keyframes[0];
        /** @type {?} */
        let missingStyleProps = [];
        previousStyleProps.forEach((/**
         * @param {?} prop
         * @return {?}
         */
        prop => {
            if (!startingKeyframe.hasOwnProperty(prop)) {
                missingStyleProps.push(prop);
            }
            startingKeyframe[prop] = previousStyles[prop];
        }));
        if (missingStyleProps.length) {
            // tslint:disable-next-line
            for (var i = 1; i < keyframes.length; i++) {
                /** @type {?} */
                let kf = keyframes[i];
                missingStyleProps.forEach((/**
                 * @param {?} prop
                 * @return {?}
                 */
                function (prop) { kf[prop] = computeStyle(element, prop); }));
            }
        }
    }
    return keyframes;
}
/**
 * @param {?} visitor
 * @param {?} node
 * @param {?} context
 * @return {?}
 */
export function visitDslNode(visitor, node, context) {
    switch (node.type) {
        case 7 /* Trigger */:
            return visitor.visitTrigger(node, context);
        case 0 /* State */:
            return visitor.visitState(node, context);
        case 1 /* Transition */:
            return visitor.visitTransition(node, context);
        case 2 /* Sequence */:
            return visitor.visitSequence(node, context);
        case 3 /* Group */:
            return visitor.visitGroup(node, context);
        case 4 /* Animate */:
            return visitor.visitAnimate(node, context);
        case 5 /* Keyframes */:
            return visitor.visitKeyframes(node, context);
        case 6 /* Style */:
            return visitor.visitStyle(node, context);
        case 8 /* Reference */:
            return visitor.visitReference(node, context);
        case 9 /* AnimateChild */:
            return visitor.visitAnimateChild(node, context);
        case 10 /* AnimateRef */:
            return visitor.visitAnimateRef(node, context);
        case 11 /* Query */:
            return visitor.visitQuery(node, context);
        case 12 /* Stagger */:
            return visitor.visitStagger(node, context);
        default:
            throw new Error(`Unable to resolve animation metadata node #${node.type}`);
    }
}
/**
 * @param {?} element
 * @param {?} prop
 * @return {?}
 */
export function computeStyle(element, prop) {
    return ((/** @type {?} */ (window.getComputedStyle(element))))[prop];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2FuaW1hdGlvbnMvYnJvd3Nlci9zcmMvdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQU9BLE9BQU8sRUFBNkUsUUFBUSxFQUFhLE1BQU0scUJBQXFCLENBQUM7QUFHckksT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLGlCQUFpQixDQUFDOztBQUV2QyxNQUFNLE9BQU8sVUFBVSxHQUFHLElBQUk7O0FBRTlCLE1BQU0sT0FBTyx1QkFBdUIsR0FBRyxJQUFJOztBQUMzQyxNQUFNLE9BQU8scUJBQXFCLEdBQUcsSUFBSTs7QUFDekMsTUFBTSxPQUFPLGVBQWUsR0FBRyxVQUFVOztBQUN6QyxNQUFNLE9BQU8sZUFBZSxHQUFHLFVBQVU7O0FBQ3pDLE1BQU0sT0FBTyxjQUFjLEdBQUcsV0FBVzs7QUFDekMsTUFBTSxPQUFPLGNBQWMsR0FBRyxXQUFXOztBQUN6QyxNQUFNLE9BQU8sb0JBQW9CLEdBQUcsWUFBWTs7QUFDaEQsTUFBTSxPQUFPLG1CQUFtQixHQUFHLGFBQWE7O0FBQ2hELE1BQU0sT0FBTyxzQkFBc0IsR0FBRyxjQUFjOztBQUNwRCxNQUFNLE9BQU8scUJBQXFCLEdBQUcsZUFBZTs7Ozs7QUFFcEQsTUFBTSxVQUFVLGtCQUFrQixDQUFDLEtBQXNCO0lBQ3ZELElBQUksT0FBTyxLQUFLLElBQUksUUFBUTtRQUFFLE9BQU8sS0FBSyxDQUFDOztVQUVyQyxPQUFPLEdBQUcsQ0FBQyxtQkFBQSxLQUFLLEVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQztJQUM1RCxJQUFJLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQztRQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRTdDLE9BQU8scUJBQXFCLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9B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QUFDO1FBQzNDO1lBQ0UsT0FBTyxPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM3QztZQUNFLE9BQU8sT0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDL0M7WUFDRSxPQUFPLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzNDO1lBQ0UsT0FBTyxPQUFPLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMvQztZQUNFLE9BQU8sT0FBTyxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNsRDtZQUNFLE9BQU8sT0FBTyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDaEQ7WUFDRSxPQUFPLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzNDO1lBQ0UsT0FBTyxPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM3QztZQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMsOENBQThDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0tBQzlFO0FBQ0gsQ0FBQzs7Ozs7O0FBRUQsTUFBTSxVQUFVLFlBQVksQ0FBQyxPQUFZLEVBQUUsSUFBWTtJQUNyRCxPQUFPLENBQUMsbUJBQUssTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxFQUFBLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2RCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtBbmltYXRlVGltaW5ncywgQW5pbWF0aW9uTWV0YWRhdGEsIEFuaW1hdGlvbk1ldGFkYXRhVHlwZSwgQW5pbWF0aW9uT3B0aW9ucywgc2VxdWVuY2UsIMm1U3R5bGVEYXRhfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7QXN0IGFzIEFuaW1hdGlvbkFzdCwgQXN0VmlzaXRvciBhcyBBbmltYXRpb25Bc3RWaXNpdG9yfSBmcm9tICcuL2RzbC9hbmltYXRpb25fYXN0JztcbmltcG9ydCB7QW5pbWF0aW9uRHNsVmlzaXRvcn0gZnJvbSAnLi9kc2wvYW5pbWF0aW9uX2RzbF92aXNpdG9yJztcbmltcG9ydCB7aXNOb2RlfSBmcm9tICcuL3JlbmRlci9zaGFyZWQnO1xuXG5leHBvcnQgY29uc3QgT05FX1NFQ09ORCA9IDEwMDA7XG5cbmV4cG9ydCBjb25zdCBTVUJTVElUVVRJT05fRVhQUl9TVEFSVCA9ICd7eyc7XG5leHBvcnQgY29uc3QgU1VCU1RJVFVUSU9OX0VYUFJfRU5EID0gJ319JztcbmV4cG9ydCBjb25zdCBFTlRFUl9DTEFTU05BTUUgPSAnbmctZW50ZXInO1xuZXhwb3J0IGNvbnN0IExFQVZFX0NMQVNTTkFNRSA9ICduZy1sZWF2ZSc7XG5leHBvcnQgY29uc3QgRU5URVJfU0VMRUNUT1IgPSAnLm5nLWVudGVyJztcbmV4cG9ydCBjb25zdCBMRUFWRV9TRUxFQ1RPUiA9ICcubmctbGVhdmUnO1xuZXhwb3J0IGNvbnN0IE5HX1RSSUdHRVJfQ0xBU1NOQU1FID0gJ25nLXRyaWdnZXInO1xuZXhwb3J0IGNvbnN0IE5HX1RSSUdHRVJfU0VMRUNUT1IgPSAnLm5nLXRyaWdnZXInO1xuZXhwb3J0IGNvbnN0IE5HX0FOSU1BVElOR19DTEFTU05BTUUgPSAnbmctYW5pbWF0aW5nJztcbmV4cG9ydCBjb25zdCBOR19BTklNQVRJTkdfU0VMRUNUT1IgPSAnLm5nLWFuaW1hdGluZyc7XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlVGltaW5nVmFsdWUodmFsdWU6IHN0cmluZyB8IG51bWJlcikge1xuICBpZiAodHlwZW9mIHZhbHVlID09ICdudW1iZXInKSByZXR1cm4gdmFsdWU7XG5cbiAgY29uc3QgbWF0Y2hlcyA9ICh2YWx1ZSBhcyBzdHJpbmcpLm1hdGNoKC9eKC0/W1xcLlxcZF0rKShtP3MpLyk7XG4gIGlmICghbWF0Y2hlcyB8fCBtYXRjaGVzLmxlbmd0aCA8IDIpIHJldHVybiAwO1xuXG4gIHJldHVybiBfY29udmVydFRpbWVWYWx1ZVRvTVMocGFyc2VGbG9hdChtYXRjaGVzWzFdKSwgbWF0Y2hlc1syXSk7XG59XG5cbmZ1bmN0aW9uIF9jb252ZXJ0VGltZVZhbHVlVG9NUyh2YWx1ZTogbnVtYmVyLCB1bml0OiBzdHJpbmcpOiBudW1iZXIge1xuICBzd2l0Y2ggKHVuaXQpIHtcbiAgICBjYXNlICdzJzpcbiAgICAgIHJldHVybiB2YWx1ZSAqIE9ORV9TRUNPTkQ7XG4gICAgZGVmYXVsdDogIC8vIG1zIG9yIHNvbWV0aGluZyBlbHNlXG4gICAgICByZXR1cm4gdmFsdWU7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVUaW1pbmcoXG4gICAgdGltaW5nczogc3RyaW5nIHwgbnVtYmVyIHwgQW5pbWF0ZVRpbWluZ3MsIGVycm9yczogYW55W10sIGFsbG93TmVnYXRpdmVWYWx1ZXM/OiBib29sZWFuKSB7XG4gIHJldHVybiB0aW1pbmdzLmhhc093blByb3BlcnR5KCdkdXJhdGlvbicpID9cbiAgICAgIDxBbmltYXRlVGltaW5ncz50aW1pbmdzIDpcbiAgICAgIHBhcnNlVGltZUV4cHJlc3Npb24oPHN0cmluZ3xudW1iZXI+dGltaW5ncywgZXJyb3JzLCBhbGxvd05lZ2F0aXZlVmFsdWVzKTtcbn1cblxuZnVuY3Rpb24gcGFyc2VUaW1lRXhwcmVzc2lvbihcbiAgICBleHA6IHN0cmluZyB8IG51bWJlciwgZXJyb3JzOiBzdHJpbmdbXSwgYWxsb3dOZWdhdGl2ZVZhbHVlcz86IGJvb2xlYW4pOiBBbmltYXRlVGltaW5ncyB7XG4gIGNvbnN0IHJlZ2V4ID0gL14oLT9bXFwuXFxkXSspKG0/cykoPzpcXHMrKC0/W1xcLlxcZF0rKShtP3MpKT8oPzpcXHMrKFstYS16XSsoPzpcXCguKz9cXCkpPykpPyQvaTtcbiAgbGV0IGR1cmF0aW9uOiBudW1iZXI7XG4gIGxldCBkZWxheTogbnVtYmVyID0gMDtcbiAgbGV0IGVhc2luZzogc3RyaW5nID0gJyc7XG4gIGlmICh0eXBlb2YgZXhwID09PSAnc3RyaW5nJykge1xuICAgIGNvbnN0IG1hdGNoZXMgPSBleHAubWF0Y2gocmVnZXgpO1xuICAgIGlmIChtYXRjaGVzID09PSBudWxsKSB7XG4gICAgICBlcnJvcnMucHVzaChgVGhlIHByb3ZpZGVkIHRpbWluZyB2YWx1ZSBcIiR7ZXhwfVwiIGlzIGludmFsaWQuYCk7XG4gICAgICByZXR1cm4ge2R1cmF0aW9uOiAwLCBkZWxheTogMCwgZWFzaW5nOiAnJ307XG4gICAgfVxuXG4gICAgZHVyYXRpb24gPSBfY29udmVydFRpbWVWYWx1ZVRvTVMocGFyc2VGbG9hdChtYXRjaGVzWzFdKSwgbWF0Y2hlc1syXSk7XG5cbiAgICBjb25zdCBkZWxheU1hdGNoID0gbWF0Y2hlc1szXTtcbiAgICBpZiAoZGVsYXlNYXRjaCAhPSBudWxsKSB7XG4gICAgICBkZWxheSA9IF9jb252ZXJ0VGltZVZhbHVlVG9NUyhwYXJzZUZsb2F0KGRlbGF5TWF0Y2gpLCBtYXRjaGVzWzRdKTtcbiAgICB9XG5cbiAgICBjb25zdCBlYXNpbmdWYWwgPSBtYXRjaGVzWzVdO1xuICAgIGlmIChlYXNpbmdWYWwpIHtcbiAgICAgIGVhc2luZyA9IGVhc2luZ1ZhbDtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZHVyYXRpb24gPSA8bnVtYmVyPmV4cDtcbiAgfVxuXG4gIGlmICghYWxsb3dOZWdhdGl2ZVZhbHVlcykge1xuICAgIGxldCBjb250YWluc0Vycm9ycyA9IGZhbHNlO1xuICAgIGxldCBzdGFydEluZGV4ID0gZXJyb3JzLmxlbmd0aDtcbiAgICBpZiAoZHVyYXRpb24gPCAwKSB7XG4gICAgICBlcnJvcnMucHVzaChgRHVyYXRpb24gdmFsdWVzIGJlbG93IDAgYXJlIG5vdCBhbGxvd2VkIGZvciB0aGlzIGFuaW1hdGlvbiBzdGVwLmApO1xuICAgICAgY29udGFpbnNFcnJvcnMgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZGVsYXkgPCAwKSB7XG4gICAgICBlcnJvcnMucHVzaChgRGVsYXkgdmFsdWVzIGJlbG93IDAgYXJlIG5vdCBhbGxvd2VkIGZvciB0aGlzIGFuaW1hdGlvbiBzdGVwLmApO1xuICAgICAgY29udGFpbnNFcnJvcnMgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoY29udGFpbnNFcnJvcnMpIHtcbiAgICAgIGVycm9ycy5zcGxpY2Uoc3RhcnRJbmRleCwgMCwgYFRoZSBwcm92aWRlZCB0aW1pbmcgdmFsdWUgXCIke2V4cH1cIiBpcyBpbnZhbGlkLmApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7ZHVyYXRpb24sIGRlbGF5LCBlYXNpbmd9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29weU9iaihcbiAgICBvYmo6IHtba2V5OiBzdHJpbmddOiBhbnl9LCBkZXN0aW5hdGlvbjoge1trZXk6IHN0cmluZ106IGFueX0gPSB7fSk6IHtba2V5OiBzdHJpbmddOiBhbnl9IHtcbiAgT2JqZWN0LmtleXMob2JqKS5mb3JFYWNoKHByb3AgPT4geyBkZXN0aW5hdGlvbltwcm9wXSA9IG9ialtwcm9wXTsgfSk7XG4gIHJldHVybiBkZXN0aW5hdGlvbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZVN0eWxlcyhzdHlsZXM6IMm1U3R5bGVEYXRhIHwgybVTdHlsZURhdGFbXSk6IMm1U3R5bGVEYXRhIHtcbiAgY29uc3Qgbm9ybWFsaXplZFN0eWxlczogybVTdHlsZURhdGEgPSB7fTtcbiAgaWYgKEFycmF5LmlzQXJyYXkoc3R5bGVzKSkge1xuICAgIHN0eWxlcy5mb3JFYWNoKGRhdGEgPT4gY29weVN0eWxlcyhkYXRhLCBmYWxzZSwgbm9ybWFsaXplZFN0eWxlcykpO1xuICB9IGVsc2Uge1xuICAgIGNvcHlTdHlsZXMoc3R5bGVzLCBmYWxzZSwgbm9ybWFsaXplZFN0eWxlcyk7XG4gIH1cbiAgcmV0dXJuIG5vcm1hbGl6ZWRTdHlsZXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb3B5U3R5bGVzKFxuICAgIHN0eWxlczogybVTdHlsZURhdGEsIHJlYWRQcm90b3R5cGU6IGJvb2xlYW4sIGRlc3RpbmF0aW9uOiDJtVN0eWxlRGF0YSA9IHt9KTogybVTdHlsZURhdGEge1xuICBpZiAocmVhZFByb3RvdHlwZSkge1xuICAgIC8vIHdlIG1ha2UgdXNlIG9mIGEgZm9yLWluIGxvb3Agc28gdGhhdCB0aGVcbiAgICAvLyBwcm90b3R5cGljYWxseSBpbmhlcml0ZWQgcHJvcGVydGllcyBhcmVcbiAgICAvLyByZXZlYWxlZCBmcm9tIHRoZSBiYWNrRmlsbCBtYXBcbiAgICBmb3IgKGxldCBwcm9wIGluIHN0eWxlcykge1xuICAgICAgZGVzdGluYXRpb25bcHJvcF0gPSBzdHlsZXNbcHJvcF07XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGNvcHlPYmooc3R5bGVzLCBkZXN0aW5hdGlvbik7XG4gIH1cbiAgcmV0dXJuIGRlc3RpbmF0aW9uO1xufVxuXG5mdW5jdGlvbiBnZXRTdHlsZUF0dHJpYnV0ZVN0cmluZyhlbGVtZW50OiBhbnksIGtleTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XG4gIC8vIFJldHVybiB0aGUga2V5LXZhbHVlIHBhaXIgc3RyaW5nIHRvIGJlIGFkZGVkIHRvIHRoZSBzdHlsZSBhdHRyaWJ1dGUgZm9yIHRoZVxuICAvLyBnaXZlbiBDU1Mgc3R5bGUga2V5LlxuICBpZiAodmFsdWUpIHtcbiAgICByZXR1cm4ga2V5ICsgJzonICsgdmFsdWUgKyAnOyc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG59XG5cbmZ1bmN0aW9uIHdyaXRlU3R5bGVBdHRyaWJ1dGUoZWxlbWVudDogYW55KSB7XG4gIC8vIFJlYWQgdGhlIHN0eWxlIHByb3BlcnR5IG9mIHRoZSBlbGVtZW50IGFuZCBtYW51YWxseSByZWZsZWN0IGl0IHRvIHRoZVxuICAvLyBzdHlsZSBhdHRyaWJ1dGUuIFRoaXMgaXMgbmVlZGVkIGJlY2F1c2UgRG9taW5vIG9uIHBsYXRmb3JtLXNlcnZlciBkb2Vzbid0XG4gIC8vIHVuZGVyc3RhbmQgdGhlIGZ1bGwgc2V0IG9mIGFsbG93ZWQgQ1NTIHByb3BlcnRpZXMgYW5kIGRvZXNuJ3QgcmVmbGVjdCBzb21lXG4gIC8vIG9mIHRoZW0gYXV0b21hdGljYWxseS5cbiAgbGV0IHN0eWxlQXR0clZhbHVlID0gJyc7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZWxlbWVudC5zdHlsZS5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGtleSA9IGVsZW1lbnQuc3R5bGUuaXRlbShpKTtcbiAgICBzdHlsZUF0dHJWYWx1ZSArPSBnZXRTdHlsZUF0dHJpYnV0ZVN0cmluZyhlbGVtZW50LCBrZXksIGVsZW1lbnQuc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShrZXkpKTtcbiAgfVxuICBmb3IgKGNvbnN0IGtleSBpbiBlbGVtZW50LnN0eWxlKSB7XG4gICAgLy8gU2tpcCBpbnRlcm5hbCBEb21pbm8gcHJvcGVydGllcyB0aGF0IGRvbid0IG5lZWQgdG8gYmUgcmVmbGVjdGVkLlxuICAgIGlmICghZWxlbWVudC5zdHlsZS5oYXNPd25Qcm9wZXJ0eShrZXkpIHx8IGtleS5zdGFydHNXaXRoKCdfJykpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBjb25zdCBkYXNoS2V5ID0gY2FtZWxDYXNlVG9EYXNoQ2FzZShrZXkpO1xuICAgIHN0eWxlQXR0clZhbHVlICs9IGdldFN0eWxlQXR0cmlidXRlU3RyaW5nKGVsZW1lbnQsIGRhc2hLZXksIGVsZW1lbnQuc3R5bGVba2V5XSk7XG4gIH1cbiAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgc3R5bGVBdHRyVmFsdWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0U3R5bGVzKGVsZW1lbnQ6IGFueSwgc3R5bGVzOiDJtVN0eWxlRGF0YSwgZm9ybWVyU3R5bGVzPzoge1trZXk6IHN0cmluZ106IGFueX0pIHtcbiAgaWYgKGVsZW1lbnRbJ3N0eWxlJ10pIHtcbiAgICBPYmplY3Qua2V5cyhzdHlsZXMpLmZvckVhY2gocHJvcCA9PiB7XG4gICAgICBjb25zdCBjYW1lbFByb3AgPSBkYXNoQ2FzZVRvQ2FtZWxDYXNlKHByb3ApO1xuICAgICAgaWYgKGZvcm1lclN0eWxlcyAmJiAhZm9ybWVyU3R5bGVzLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgIGZvcm1lclN0eWxlc1twcm9wXSA9IGVsZW1lbnQuc3R5bGVbY2FtZWxQcm9wXTtcbiAgICAgIH1cbiAgICAgIGVsZW1lbnQuc3R5bGVbY2FtZWxQcm9wXSA9IHN0eWxlc1twcm9wXTtcbiAgICB9KTtcbiAgICAvLyBPbiB0aGUgc2VydmVyIHNldCB0aGUgJ3N0eWxlJyBhdHRyaWJ1dGUgc2luY2UgaXQncyBub3QgYXV0b21hdGljYWxseSByZWZsZWN0ZWQuXG4gICAgaWYgKGlzTm9kZSgpKSB7XG4gICAgICB3cml0ZVN0eWxlQXR0cmlidXRlKGVsZW1lbnQpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZXJhc2VTdHlsZXMoZWxlbWVudDogYW55LCBzdHlsZXM6IMm1U3R5bGVEYXRhKSB7XG4gIGlmIChlbGVtZW50WydzdHlsZSddKSB7XG4gICAgT2JqZWN0LmtleXMoc3R5bGVzKS5mb3JFYWNoKHByb3AgPT4ge1xuICAgICAgY29uc3QgY2FtZWxQcm9wID0gZGFzaENhc2VUb0NhbWVsQ2FzZShwcm9wKTtcbiAgICAgIGVsZW1lbnQuc3R5bGVbY2FtZWxQcm9wXSA9ICcnO1xuICAgIH0pO1xuICAgIC8vIE9uIHRoZSBzZXJ2ZXIgc2V0IHRoZSAnc3R5bGUnIGF0dHJpYnV0ZSBzaW5jZSBpdCdzIG5vdCBhdXRvbWF0aWNhbGx5IHJlZmxlY3RlZC5cbiAgICBpZiAoaXNOb2RlKCkpIHtcbiAgICAgIHdyaXRlU3R5bGVBdHRyaWJ1dGUoZWxlbWVudCk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVBbmltYXRpb25FbnRyeShzdGVwczogQW5pbWF0aW9uTWV0YWRhdGEgfCBBbmltYXRpb25NZXRhZGF0YVtdKTpcbiAgICBBbmltYXRpb25NZXRhZGF0YSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHN0ZXBzKSkge1xuICAgIGlmIChzdGVwcy5sZW5ndGggPT0gMSkgcmV0dXJuIHN0ZXBzWzBdO1xuICAgIHJldHVybiBzZXF1ZW5jZShzdGVwcyk7XG4gIH1cbiAgcmV0dXJuIHN0ZXBzIGFzIEFuaW1hdGlvbk1ldGFkYXRhO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVTdHlsZVBhcmFtcyhcbiAgICB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyLCBvcHRpb25zOiBBbmltYXRpb25PcHRpb25zLCBlcnJvcnM6IGFueVtdKSB7XG4gIGNvbnN0IHBhcmFtcyA9IG9wdGlvbnMucGFyYW1zIHx8IHt9O1xuICBjb25zdCBtYXRjaGVzID0gZXh0cmFjdFN0eWxlUGFyYW1zKHZhbHVlKTtcbiAgaWYgKG1hdGNoZXMubGVuZ3RoKSB7XG4gICAgbWF0Y2hlcy5mb3JFYWNoKHZhck5hbWUgPT4ge1xuICAgICAgaWYgKCFwYXJhbXMuaGFzT3duUHJvcGVydHkodmFyTmFtZSkpIHtcbiAgICAgICAgZXJyb3JzLnB1c2goXG4gICAgICAgICAgICBgVW5hYmxlIHRvIHJlc29sdmUgdGhlIGxvY2FsIGFuaW1hdGlvbiBwYXJhbSAke3Zhck5hbWV9IGluIHRoZSBnaXZlbiBsaXN0IG9mIHZhbHVlc2ApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IFBBUkFNX1JFR0VYID1cbiAgICBuZXcgUmVnRXhwKGAke1NVQlNUSVRVVElPTl9FWFBSX1NUQVJUfVxcXFxzKiguKz8pXFxcXHMqJHtTVUJTVElUVVRJT05fRVhQUl9FTkR9YCwgJ2cnKTtcbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0U3R5bGVQYXJhbXModmFsdWU6IHN0cmluZyB8IG51bWJlcik6IHN0cmluZ1tdIHtcbiAgbGV0IHBhcmFtczogc3RyaW5nW10gPSBbXTtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICBjb25zdCB2YWwgPSB2YWx1ZS50b1N0cmluZygpO1xuXG4gICAgbGV0IG1hdGNoOiBhbnk7XG4gICAgd2hpbGUgKG1hdGNoID0gUEFSQU1fUkVHRVguZXhlYyh2YWwpKSB7XG4gICAgICBwYXJhbXMucHVzaChtYXRjaFsxXSBhcyBzdHJpbmcpO1xuICAgIH1cbiAgICBQQVJBTV9SRUdFWC5sYXN0SW5kZXggPSAwO1xuICB9XG4gIHJldHVybiBwYXJhbXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnRlcnBvbGF0ZVBhcmFtcyhcbiAgICB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyLCBwYXJhbXM6IHtbbmFtZTogc3RyaW5nXTogYW55fSwgZXJyb3JzOiBhbnlbXSk6IHN0cmluZ3xudW1iZXIge1xuICBjb25zdCBvcmlnaW5hbCA9IHZhbHVlLnRvU3RyaW5nKCk7XG4gIGNvbnN0IHN0ciA9IG9yaWdpbmFsLnJlcGxhY2UoUEFSQU1fUkVHRVgsIChfLCB2YXJOYW1lKSA9PiB7XG4gICAgbGV0IGxvY2FsVmFsID0gcGFyYW1zW3Zhck5hbWVdO1xuICAgIC8vIHRoaXMgbWVhbnMgdGhhdCB0aGUgdmFsdWUgd2FzIG5ldmVyIG92ZXJyaWRkZW4gYnkgdGhlIGRhdGEgcGFzc2VkIGluIGJ5IHRoZSB1c2VyXG4gICAgaWYgKCFwYXJhbXMuaGFzT3duUHJvcGVydHkodmFyTmFtZSkpIHtcbiAgICAgIGVycm9ycy5wdXNoKGBQbGVhc2UgcHJvdmlkZSBhIHZhbHVlIGZvciB0aGUgYW5pbWF0aW9uIHBhcmFtICR7dmFyTmFtZX1gKTtcbiAgICAgIGxvY2FsVmFsID0gJyc7XG4gICAgfVxuICAgIHJldHVybiBsb2NhbFZhbC50b1N0cmluZygpO1xuICB9KTtcblxuICAvLyB3ZSBkbyB0aGlzIHRvIGFzc2VydCB0aGF0IG51bWVyaWMgdmFsdWVzIHN0YXkgYXMgdGhleSBhcmVcbiAgcmV0dXJuIHN0ciA9PSBvcmlnaW5hbCA/IHZhbHVlIDogc3RyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXRlcmF0b3JUb0FycmF5KGl0ZXJhdG9yOiBhbnkpOiBhbnlbXSB7XG4gIGNvbnN0IGFycjogYW55W10gPSBbXTtcbiAgbGV0IGl0ZW0gPSBpdGVyYXRvci5uZXh0KCk7XG4gIHdoaWxlICghaXRlbS5kb25lKSB7XG4gICAgYXJyLnB1c2goaXRlbS52YWx1ZSk7XG4gICAgaXRlbSA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgfVxuICByZXR1cm4gYXJyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VBbmltYXRpb25PcHRpb25zKFxuICAgIHNvdXJjZTogQW5pbWF0aW9uT3B0aW9ucywgZGVzdGluYXRpb246IEFuaW1hdGlvbk9wdGlvbnMpOiBBbmltYXRpb25PcHRpb25zIHtcbiAgaWYgKHNvdXJjZS5wYXJhbXMpIHtcbiAgICBjb25zdCBwMCA9IHNvdXJjZS5wYXJhbXM7XG4gICAgaWYgKCFkZXN0aW5hdGlvbi5wYXJhbXMpIHtcbiAgICAgIGRlc3RpbmF0aW9uLnBhcmFtcyA9IHt9O1xuICAgIH1cbiAgICBjb25zdCBwMSA9IGRlc3RpbmF0aW9uLnBhcmFtcztcbiAgICBPYmplY3Qua2V5cyhwMCkuZm9yRWFjaChwYXJhbSA9PiB7XG4gICAgICBpZiAoIXAxLmhhc093blByb3BlcnR5KHBhcmFtKSkge1xuICAgICAgICBwMVtwYXJhbV0gPSBwMFtwYXJhbV07XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIGRlc3RpbmF0aW9uO1xufVxuXG5jb25zdCBEQVNIX0NBU0VfUkVHRVhQID0gLy0rKFthLXowLTldKS9nO1xuZXhwb3J0IGZ1bmN0aW9uIGRhc2hDYXNlVG9DYW1lbENhc2UoaW5wdXQ6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBpbnB1dC5yZXBsYWNlKERBU0hfQ0FTRV9SRUdFWFAsICguLi5tOiBhbnlbXSkgPT4gbVsxXS50b1VwcGVyQ2FzZSgpKTtcbn1cblxuZnVuY3Rpb24gY2FtZWxDYXNlVG9EYXNoQ2FzZShpbnB1dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIGlucHV0LnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pL2csICckMS0kMicpLnRvTG93ZXJDYXNlKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhbGxvd1ByZXZpb3VzUGxheWVyU3R5bGVzTWVyZ2UoZHVyYXRpb246IG51bWJlciwgZGVsYXk6IG51bWJlcikge1xuICByZXR1cm4gZHVyYXRpb24gPT09IDAgfHwgZGVsYXkgPT09IDA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBiYWxhbmNlUHJldmlvdXNTdHlsZXNJbnRvS2V5ZnJhbWVzKFxuICAgIGVsZW1lbnQ6IGFueSwga2V5ZnJhbWVzOiB7W2tleTogc3RyaW5nXTogYW55fVtdLCBwcmV2aW91c1N0eWxlczoge1trZXk6IHN0cmluZ106IGFueX0pIHtcbiAgY29uc3QgcHJldmlvdXNTdHlsZVByb3BzID0gT2JqZWN0LmtleXMocHJldmlvdXNTdHlsZXMpO1xuICBpZiAocHJldmlvdXNTdHlsZVByb3BzLmxlbmd0aCAmJiBrZXlmcmFtZXMubGVuZ3RoKSB7XG4gICAgbGV0IHN0YXJ0aW5nS2V5ZnJhbWUgPSBrZXlmcmFtZXNbMF07XG4gICAgbGV0IG1pc3NpbmdTdHlsZVByb3BzOiBzdHJpbmdbXSA9IFtdO1xuICAgIHByZXZpb3VzU3R5bGVQcm9wcy5mb3JFYWNoKHByb3AgPT4ge1xuICAgICAgaWYgKCFzdGFydGluZ0tleWZyYW1lLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgIG1pc3NpbmdTdHlsZVByb3BzLnB1c2gocHJvcCk7XG4gICAgICB9XG4gICAgICBzdGFydGluZ0tleWZyYW1lW3Byb3BdID0gcHJldmlvdXNTdHlsZXNbcHJvcF07XG4gICAgfSk7XG5cbiAgICBpZiAobWlzc2luZ1N0eWxlUHJvcHMubGVuZ3RoKSB7XG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbiAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwga2V5ZnJhbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBrZiA9IGtleWZyYW1lc1tpXTtcbiAgICAgICAgbWlzc2luZ1N0eWxlUHJvcHMuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7IGtmW3Byb3BdID0gY29tcHV0ZVN0eWxlKGVsZW1lbnQsIHByb3ApOyB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGtleWZyYW1lcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZpc2l0RHNsTm9kZShcbiAgICB2aXNpdG9yOiBBbmltYXRpb25Ec2xWaXNpdG9yLCBub2RlOiBBbmltYXRpb25NZXRhZGF0YSwgY29udGV4dDogYW55KTogYW55O1xuZXhwb3J0IGZ1bmN0aW9uIHZpc2l0RHNsTm9kZShcbiAgICB2aXNpdG9yOiBBbmltYXRpb25Bc3RWaXNpdG9yLCBub2RlOiBBbmltYXRpb25Bc3Q8QW5pbWF0aW9uTWV0YWRhdGFUeXBlPiwgY29udGV4dDogYW55KTogYW55O1xuZXhwb3J0IGZ1bmN0aW9uIHZpc2l0RHNsTm9kZSh2aXNpdG9yOiBhbnksIG5vZGU6IGFueSwgY29udGV4dDogYW55KTogYW55IHtcbiAgc3dpdGNoIChub2RlLnR5cGUpIHtcbiAgICBjYXNlIEFuaW1hdGlvbk1ldGFkYXRhVHlwZS5UcmlnZ2VyOlxuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRUcmlnZ2VyKG5vZGUsIGNvbnRleHQpO1xuICAgIGNhc2UgQW5pbWF0aW9uTWV0YWRhdGFUeXBlLlN0YXRlOlxuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRTdGF0ZShub2RlLCBjb250ZXh0KTtcbiAgICBjYXNlIEFuaW1hdGlvbk1ldGFkYXRhVHlwZS5UcmFuc2l0aW9uOlxuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRUcmFuc2l0aW9uKG5vZGUsIGNvbnRleHQpO1xuICAgIGNhc2UgQW5pbWF0aW9uTWV0YWRhdGFUeXBlLlNlcXVlbmNlOlxuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRTZXF1ZW5jZShub2RlLCBjb250ZXh0KTtcbiAgICBjYXNlIEFuaW1hdGlvbk1ldGFkYXRhVHlwZS5Hcm91cDpcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0R3JvdXAobm9kZSwgY29udGV4dCk7XG4gICAgY2FzZSBBbmltYXRpb25NZXRhZGF0YVR5cGUuQW5pbWF0ZTpcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0QW5pbWF0ZShub2RlLCBjb250ZXh0KTtcbiAgICBjYXNlIEFuaW1hdGlvbk1ldGFkYXRhVHlwZS5LZXlmcmFtZXM6XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdEtleWZyYW1lcyhub2RlLCBjb250ZXh0KTtcbiAgICBjYXNlIEFuaW1hdGlvbk1ldGFkYXRhVHlwZS5TdHlsZTpcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0U3R5bGUobm9kZSwgY29udGV4dCk7XG4gICAgY2FzZSBBbmltYXRpb25NZXRhZGF0YVR5cGUuUmVmZXJlbmNlOlxuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRSZWZlcmVuY2Uobm9kZSwgY29udGV4dCk7XG4gICAgY2FzZSBBbmltYXRpb25NZXRhZGF0YVR5cGUuQW5pbWF0ZUNoaWxkOlxuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRBbmltYXRlQ2hpbGQobm9kZSwgY29udGV4dCk7XG4gICAgY2FzZSBBbmltYXRpb25NZXRhZGF0YVR5cGUuQW5pbWF0ZVJlZjpcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0QW5pbWF0ZVJlZihub2RlLCBjb250ZXh0KTtcbiAgICBjYXNlIEFuaW1hdGlvbk1ldGFkYXRhVHlwZS5RdWVyeTpcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0UXVlcnkobm9kZSwgY29udGV4dCk7XG4gICAgY2FzZSBBbmltYXRpb25NZXRhZGF0YVR5cGUuU3RhZ2dlcjpcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0U3RhZ2dlcihub2RlLCBjb250ZXh0KTtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gcmVzb2x2ZSBhbmltYXRpb24gbWV0YWRhdGEgbm9kZSAjJHtub2RlLnR5cGV9YCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXB1dGVTdHlsZShlbGVtZW50OiBhbnksIHByb3A6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiAoPGFueT53aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KSlbcHJvcF07XG59XG4iXX0=