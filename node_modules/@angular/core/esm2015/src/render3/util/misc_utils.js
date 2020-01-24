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
import { global } from '../../util/global';
/**
 * Returns whether the values are different from a change detection stand point.
 *
 * Constraints are relaxed in checkNoChanges mode. See `devModeEqual` for details.
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
export function isDifferent(a, b) {
    // NaN is the only value that is not equal to itself so the first
    // test checks if both a and b are not NaN
    return !(a !== a && b !== b) && a !== b;
}
/**
 * Used for stringify render output in Ivy.
 * Important! This function is very performance-sensitive and we should
 * be extra careful not to introduce megamorphic reads in it.
 * @param {?} value
 * @return {?}
 */
export function renderStringify(value) {
    if (typeof value === 'function')
        return value.name || value;
    if (typeof value === 'string')
        return value;
    if (value == null)
        return '';
    return '' + value;
}
/**
 * Used to stringify a value so that it can be displayed in an error message.
 * Important! This function contains a megamorphic read and should only be
 * used for error messages.
 * @param {?} value
 * @return {?}
 */
export function stringifyForError(value) {
    if (typeof value === 'object' && value != null && typeof value.type === 'function') {
        return value.type.name || value.type;
    }
    return renderStringify(value);
}
const ɵ0 = /**
 * @return {?}
 */
() => (typeof requestAnimationFrame !== 'undefined' && requestAnimationFrame || // browser only
    setTimeout // everything else
).bind(global);
/** @type {?} */
export const defaultScheduler = ((ɵ0))();
/**
 *
 * \@codeGenApi
 * @param {?} element
 * @return {?}
 */
export function ɵɵresolveWindow(element) {
    return { name: 'window', target: element.ownerDocument.defaultView };
}
/**
 *
 * \@codeGenApi
 * @param {?} element
 * @return {?}
 */
export function ɵɵresolveDocument(element) {
    return { name: 'document', target: element.ownerDocument };
}
/**
 *
 * \@codeGenApi
 * @param {?} element
 * @return {?}
 */
export function ɵɵresolveBody(element) {
    return { name: 'body', target: element.ownerDocument.body };
}
/**
 * The special delimiter we use to separate property names, prefixes, and suffixes
 * in property binding metadata. See storeBindingMetadata().
 *
 * We intentionally use the Unicode "REPLACEMENT CHARACTER" (U+FFFD) as a delimiter
 * because it is a very uncommon character that is unlikely to be part of a user's
 * property names or interpolation strings. If it is in fact used in a property
 * binding, DebugElement.properties will not return the correct value for that
 * binding. However, there should be no runtime effect for real applications.
 *
 * This character is typically rendered as a question mark inside of a diamond.
 * See https://en.wikipedia.org/wiki/Specials_(Unicode_block)
 *
 * @type {?}
 */
export const INTERPOLATION_DELIMITER = `�`;
/**
 * Determines whether or not the given string is a property metadata string.
 * See storeBindingMetadata().
 * @param {?} str
 * @return {?}
 */
export function isPropMetadataString(str) {
    return str.indexOf(INTERPOLATION_DELIMITER) >= 0;
}
/**
 * Unwrap a value which might be behind a closure (for forward declaration reasons).
 * @template T
 * @param {?} value
 * @return {?}
 */
export function maybeUnwrapFn(value) {
    if (value instanceof Function) {
        return value();
    }
    else {
        return value;
    }
}
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlzY191dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3JlbmRlcjMvdXRpbC9taXNjX3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLG1CQUFtQixDQUFDOzs7Ozs7Ozs7QUFRekMsTUFBTSxVQUFVLFdBQVcsQ0FBQyxDQUFNLEVBQUUsQ0FBTTtJQUN4QyxpRUFBaUU7SUFDakUsMENBQTBDO0lBQzFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDMUMsQ0FBQzs7Ozs7Ozs7QUFPRCxNQUFNLFVBQVUsZUFBZSxDQUFDLEtBQVU7SUFDeEMsSUFBSSxPQUFPLEtBQUssS0FBSyxVQUFVO1FBQUUsT0FBTyxLQUFLLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQztJQUM1RCxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVE7UUFBRSxPQUFPLEtBQUssQ0FBQztJQUM1QyxJQUFJLEtBQUssSUFBSSxJQUFJO1FBQUUsT0FBTyxFQUFFLENBQUM7SUFDN0IsT0FBTyxFQUFFLEdBQUcsS0FBSyxDQUFDO0FBQ3BCLENBQUM7Ozs7Ozs7O0FBUUQsTUFBTSxVQUFVLGlCQUFpQixDQUFDLEtBQVU7SUFDMUMsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksS0FBSyxJQUFJLElBQUksSUFBSSxPQUFPLEtBQUssQ0FBQyxJQUFJLEtBQUssVUFBVSxFQUFFO1FBQ2xGLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQztLQUN0QztJQUVELE9BQU8sZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2hDLENBQUM7Ozs7QUFJSSxHQUFHLEVBQUUsQ0FDRCxDQUFDLE9BQU8scUJBQXFCLEtBQUssV0FBVyxJQUFJLHFCQUFxQixJQUFLLGVBQWU7SUFDekYsVUFBVSxDQUFFLGtCQUFrQjtDQUM3QixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7O0FBSnhCLE1BQU0sT0FBTyxnQkFBZ0IsR0FDekIsTUFHcUIsRUFBRTs7Ozs7OztBQU0zQixNQUFNLFVBQVUsZUFBZSxDQUFDLE9BQTZDO0lBQzNFLE9BQU8sRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsYUFBYSxDQUFDLFdBQVcsRUFBQyxDQUFDO0FBQ3JFLENBQUM7Ozs7Ozs7QUFNRCxNQUFNLFVBQVUsaUJBQWlCLENBQUMsT0FBNkM7SUFDN0UsT0FBTyxFQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxhQUFhLEVBQUMsQ0FBQztBQUMzRCxDQUFDOzs7Ozs7O0FBTUQsTUFBTSxVQUFVLGFBQWEsQ0FBQyxPQUE2QztJQUN6RSxPQUFPLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUMsQ0FBQztBQUM1RCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JELE1BQU0sT0FBTyx1QkFBdUIsR0FBRyxHQUFHOzs7Ozs7O0FBTTFDLE1BQU0sVUFBVSxvQkFBb0IsQ0FBQyxHQUFXO0lBQzlDLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNuRCxDQUFDOzs7Ozs7O0FBS0QsTUFBTSxVQUFVLGFBQWEsQ0FBSSxLQUFvQjtJQUNuRCxJQUFJLEtBQUssWUFBWSxRQUFRLEVBQUU7UUFDN0IsT0FBTyxLQUFLLEVBQUUsQ0FBQztLQUNoQjtTQUFNO1FBQ0wsT0FBTyxLQUFLLENBQUM7S0FDZDtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Z2xvYmFsfSBmcm9tICcuLi8uLi91dGlsL2dsb2JhbCc7XG5pbXBvcnQge1JFbGVtZW50fSBmcm9tICcuLi9pbnRlcmZhY2VzL3JlbmRlcmVyJztcblxuLyoqXG4gKiBSZXR1cm5zIHdoZXRoZXIgdGhlIHZhbHVlcyBhcmUgZGlmZmVyZW50IGZyb20gYSBjaGFuZ2UgZGV0ZWN0aW9uIHN0YW5kIHBvaW50LlxuICpcbiAqIENvbnN0cmFpbnRzIGFyZSByZWxheGVkIGluIGNoZWNrTm9DaGFuZ2VzIG1vZGUuIFNlZSBgZGV2TW9kZUVxdWFsYCBmb3IgZGV0YWlscy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRGlmZmVyZW50KGE6IGFueSwgYjogYW55KTogYm9vbGVhbiB7XG4gIC8vIE5hTiBpcyB0aGUgb25seSB2YWx1ZSB0aGF0IGlzIG5vdCBlcXVhbCB0byBpdHNlbGYgc28gdGhlIGZpcnN0XG4gIC8vIHRlc3QgY2hlY2tzIGlmIGJvdGggYSBhbmQgYiBhcmUgbm90IE5hTlxuICByZXR1cm4gIShhICE9PSBhICYmIGIgIT09IGIpICYmIGEgIT09IGI7XG59XG5cbi8qKlxuICogVXNlZCBmb3Igc3RyaW5naWZ5IHJlbmRlciBvdXRwdXQgaW4gSXZ5LlxuICogSW1wb3J0YW50ISBUaGlzIGZ1bmN0aW9uIGlzIHZlcnkgcGVyZm9ybWFuY2Utc2Vuc2l0aXZlIGFuZCB3ZSBzaG91bGRcbiAqIGJlIGV4dHJhIGNhcmVmdWwgbm90IHRvIGludHJvZHVjZSBtZWdhbW9ycGhpYyByZWFkcyBpbiBpdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlclN0cmluZ2lmeSh2YWx1ZTogYW55KTogc3RyaW5nIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykgcmV0dXJuIHZhbHVlLm5hbWUgfHwgdmFsdWU7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSByZXR1cm4gdmFsdWU7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSByZXR1cm4gJyc7XG4gIHJldHVybiAnJyArIHZhbHVlO1xufVxuXG5cbi8qKlxuICogVXNlZCB0byBzdHJpbmdpZnkgYSB2YWx1ZSBzbyB0aGF0IGl0IGNhbiBiZSBkaXNwbGF5ZWQgaW4gYW4gZXJyb3IgbWVzc2FnZS5cbiAqIEltcG9ydGFudCEgVGhpcyBmdW5jdGlvbiBjb250YWlucyBhIG1lZ2Ftb3JwaGljIHJlYWQgYW5kIHNob3VsZCBvbmx5IGJlXG4gKiB1c2VkIGZvciBlcnJvciBtZXNzYWdlcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0cmluZ2lmeUZvckVycm9yKHZhbHVlOiBhbnkpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUudHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiB2YWx1ZS50eXBlLm5hbWUgfHwgdmFsdWUudHlwZTtcbiAgfVxuXG4gIHJldHVybiByZW5kZXJTdHJpbmdpZnkodmFsdWUpO1xufVxuXG5cbmV4cG9ydCBjb25zdCBkZWZhdWx0U2NoZWR1bGVyID1cbiAgICAoKCkgPT5cbiAgICAgICAgICh0eXBlb2YgcmVxdWVzdEFuaW1hdGlvbkZyYW1lICE9PSAndW5kZWZpbmVkJyAmJiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgIC8vIGJyb3dzZXIgb25seVxuICAgICAgICAgIHNldFRpbWVvdXQgIC8vIGV2ZXJ5dGhpbmcgZWxzZVxuICAgICAgICAgICkuYmluZChnbG9iYWwpKSgpO1xuXG4vKipcbiAqXG4gKiBAY29kZUdlbkFwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gybXJtXJlc29sdmVXaW5kb3coZWxlbWVudDogUkVsZW1lbnQgJiB7b3duZXJEb2N1bWVudDogRG9jdW1lbnR9KSB7XG4gIHJldHVybiB7bmFtZTogJ3dpbmRvdycsIHRhcmdldDogZWxlbWVudC5vd25lckRvY3VtZW50LmRlZmF1bHRWaWV3fTtcbn1cblxuLyoqXG4gKlxuICogQGNvZGVHZW5BcGlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIMm1ybVyZXNvbHZlRG9jdW1lbnQoZWxlbWVudDogUkVsZW1lbnQgJiB7b3duZXJEb2N1bWVudDogRG9jdW1lbnR9KSB7XG4gIHJldHVybiB7bmFtZTogJ2RvY3VtZW50JywgdGFyZ2V0OiBlbGVtZW50Lm93bmVyRG9jdW1lbnR9O1xufVxuXG4vKipcbiAqXG4gKiBAY29kZUdlbkFwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gybXJtXJlc29sdmVCb2R5KGVsZW1lbnQ6IFJFbGVtZW50ICYge293bmVyRG9jdW1lbnQ6IERvY3VtZW50fSkge1xuICByZXR1cm4ge25hbWU6ICdib2R5JywgdGFyZ2V0OiBlbGVtZW50Lm93bmVyRG9jdW1lbnQuYm9keX07XG59XG5cbi8qKlxuICogVGhlIHNwZWNpYWwgZGVsaW1pdGVyIHdlIHVzZSB0byBzZXBhcmF0ZSBwcm9wZXJ0eSBuYW1lcywgcHJlZml4ZXMsIGFuZCBzdWZmaXhlc1xuICogaW4gcHJvcGVydHkgYmluZGluZyBtZXRhZGF0YS4gU2VlIHN0b3JlQmluZGluZ01ldGFkYXRhKCkuXG4gKlxuICogV2UgaW50ZW50aW9uYWxseSB1c2UgdGhlIFVuaWNvZGUgXCJSRVBMQUNFTUVOVCBDSEFSQUNURVJcIiAoVStGRkZEKSBhcyBhIGRlbGltaXRlclxuICogYmVjYXVzZSBpdCBpcyBhIHZlcnkgdW5jb21tb24gY2hhcmFjdGVyIHRoYXQgaXMgdW5saWtlbHkgdG8gYmUgcGFydCBvZiBhIHVzZXInc1xuICogcHJvcGVydHkgbmFtZXMgb3IgaW50ZXJwb2xhdGlvbiBzdHJpbmdzLiBJZiBpdCBpcyBpbiBmYWN0IHVzZWQgaW4gYSBwcm9wZXJ0eVxuICogYmluZGluZywgRGVidWdFbGVtZW50LnByb3BlcnRpZXMgd2lsbCBub3QgcmV0dXJuIHRoZSBjb3JyZWN0IHZhbHVlIGZvciB0aGF0XG4gKiBiaW5kaW5nLiBIb3dldmVyLCB0aGVyZSBzaG91bGQgYmUgbm8gcnVudGltZSBlZmZlY3QgZm9yIHJlYWwgYXBwbGljYXRpb25zLlxuICpcbiAqIFRoaXMgY2hhcmFjdGVyIGlzIHR5cGljYWxseSByZW5kZXJlZCBhcyBhIHF1ZXN0aW9uIG1hcmsgaW5zaWRlIG9mIGEgZGlhbW9uZC5cbiAqIFNlZSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9TcGVjaWFsc18oVW5pY29kZV9ibG9jaylcbiAqXG4gKi9cbmV4cG9ydCBjb25zdCBJTlRFUlBPTEFUSU9OX0RFTElNSVRFUiA9IGDvv71gO1xuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciBvciBub3QgdGhlIGdpdmVuIHN0cmluZyBpcyBhIHByb3BlcnR5IG1ldGFkYXRhIHN0cmluZy5cbiAqIFNlZSBzdG9yZUJpbmRpbmdNZXRhZGF0YSgpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNQcm9wTWV0YWRhdGFTdHJpbmcoc3RyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIHN0ci5pbmRleE9mKElOVEVSUE9MQVRJT05fREVMSU1JVEVSKSA+PSAwO1xufVxuXG4vKipcbiAqIFVud3JhcCBhIHZhbHVlIHdoaWNoIG1pZ2h0IGJlIGJlaGluZCBhIGNsb3N1cmUgKGZvciBmb3J3YXJkIGRlY2xhcmF0aW9uIHJlYXNvbnMpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWF5YmVVbndyYXBGbjxUPih2YWx1ZTogVCB8ICgoKSA9PiBUKSk6IFQge1xuICBpZiAodmFsdWUgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgIHJldHVybiB2YWx1ZSgpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxufVxuIl19