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
const BRAND = '__SANITIZER_TRUSTED_BRAND__';
/** @enum {string} */
const BypassType = {
    Url: 'Url',
    Html: 'Html',
    ResourceUrl: 'ResourceUrl',
    Script: 'Script',
    Style: 'Style',
};
export { BypassType };
/**
 * A branded trusted string used with sanitization.
 *
 * See: {\@link TrustedHtmlString}, {\@link TrustedResourceUrlString}, {\@link TrustedScriptString},
 * {\@link TrustedStyleString}, {\@link TrustedUrlString}
 * @record
 */
export function TrustedString() { }
if (false) {
    /* Skipping unnamed member:
    [BRAND]: BypassType;*/
}
/**
 * A branded trusted string used with sanitization of `html` strings.
 *
 * See: {\@link bypassSanitizationTrustHtml} and {\@link htmlSanitizer}.
 * @record
 */
export function TrustedHtmlString() { }
if (false) {
    /* Skipping unnamed member:
    [BRAND]: BypassType.Html;*/
}
/**
 * A branded trusted string used with sanitization of `style` strings.
 *
 * See: {\@link bypassSanitizationTrustStyle} and {\@link styleSanitizer}.
 * @record
 */
export function TrustedStyleString() { }
if (false) {
    /* Skipping unnamed member:
    [BRAND]: BypassType.Style;*/
}
/**
 * A branded trusted string used with sanitization of `url` strings.
 *
 * See: {\@link bypassSanitizationTrustScript} and {\@link scriptSanitizer}.
 * @record
 */
export function TrustedScriptString() { }
if (false) {
    /* Skipping unnamed member:
    [BRAND]: BypassType.Script;*/
}
/**
 * A branded trusted string used with sanitization of `url` strings.
 *
 * See: {\@link bypassSanitizationTrustUrl} and {\@link urlSanitizer}.
 * @record
 */
export function TrustedUrlString() { }
if (false) {
    /* Skipping unnamed member:
    [BRAND]: BypassType.Url;*/
}
/**
 * A branded trusted string used with sanitization of `resourceUrl` strings.
 *
 * See: {\@link bypassSanitizationTrustResourceUrl} and {\@link resourceUrlSanitizer}.
 * @record
 */
export function TrustedResourceUrlString() { }
if (false) {
    /* Skipping unnamed member:
    [BRAND]: BypassType.ResourceUrl;*/
}
/**
 * @param {?} value
 * @param {?} type
 * @return {?}
 */
export function allowSanitizationBypass(value, type) {
    return (value instanceof String && ((/** @type {?} */ (value)))[BRAND] === type);
}
/**
 * Mark `html` string as trusted.
 *
 * This function wraps the trusted string in `String` and brands it in a way which makes it
 * recognizable to {\@link htmlSanitizer} to be trusted implicitly.
 *
 * @param {?} trustedHtml `html` string which needs to be implicitly trusted.
 * @return {?} a `html` `String` which has been branded to be implicitly trusted.
 */
export function bypassSanitizationTrustHtml(trustedHtml) {
    return bypassSanitizationTrustString(trustedHtml, "Html" /* Html */);
}
/**
 * Mark `style` string as trusted.
 *
 * This function wraps the trusted string in `String` and brands it in a way which makes it
 * recognizable to {\@link styleSanitizer} to be trusted implicitly.
 *
 * @param {?} trustedStyle `style` string which needs to be implicitly trusted.
 * @return {?} a `style` `String` which has been branded to be implicitly trusted.
 */
export function bypassSanitizationTrustStyle(trustedStyle) {
    return bypassSanitizationTrustString(trustedStyle, "Style" /* Style */);
}
/**
 * Mark `script` string as trusted.
 *
 * This function wraps the trusted string in `String` and brands it in a way which makes it
 * recognizable to {\@link scriptSanitizer} to be trusted implicitly.
 *
 * @param {?} trustedScript `script` string which needs to be implicitly trusted.
 * @return {?} a `script` `String` which has been branded to be implicitly trusted.
 */
export function bypassSanitizationTrustScript(trustedScript) {
    return bypassSanitizationTrustString(trustedScript, "Script" /* Script */);
}
/**
 * Mark `url` string as trusted.
 *
 * This function wraps the trusted string in `String` and brands it in a way which makes it
 * recognizable to {\@link urlSanitizer} to be trusted implicitly.
 *
 * @param {?} trustedUrl `url` string which needs to be implicitly trusted.
 * @return {?} a `url` `String` which has been branded to be implicitly trusted.
 */
export function bypassSanitizationTrustUrl(trustedUrl) {
    return bypassSanitizationTrustString(trustedUrl, "Url" /* Url */);
}
/**
 * Mark `url` string as trusted.
 *
 * This function wraps the trusted string in `String` and brands it in a way which makes it
 * recognizable to {\@link resourceUrlSanitizer} to be trusted implicitly.
 *
 * @param {?} trustedResourceUrl `url` string which needs to be implicitly trusted.
 * @return {?} a `url` `String` which has been branded to be implicitly trusted.
 */
export function bypassSanitizationTrustResourceUrl(trustedResourceUrl) {
    return bypassSanitizationTrustString(trustedResourceUrl, "ResourceUrl" /* ResourceUrl */);
}
/**
 * @param {?} trustedString
 * @param {?} mode
 * @return {?}
 */
function bypassSanitizationTrustString(trustedString, mode) {
    /** @type {?} */
    const trusted = (/** @type {?} */ (new String(trustedString)));
    trusted[BRAND] = mode;
    return trusted;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnlwYXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvc2FuaXRpemF0aW9uL2J5cGFzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7TUFRTSxLQUFLLEdBQUcsNkJBQTZCOzs7SUFHekMsS0FBTSxLQUFLO0lBQ1gsTUFBTyxNQUFNO0lBQ2IsYUFBYyxhQUFhO0lBQzNCLFFBQVMsUUFBUTtJQUNqQixPQUFRLE9BQU87Ozs7Ozs7Ozs7QUFTakIsbUNBQXNFOzs7Ozs7Ozs7OztBQU90RSx1Q0FBc0Y7Ozs7Ozs7Ozs7O0FBT3RGLHdDQUF3Rjs7Ozs7Ozs7Ozs7QUFPeEYseUNBQTBGOzs7Ozs7Ozs7OztBQU8xRixzQ0FBb0Y7Ozs7Ozs7Ozs7O0FBT3BGLDhDQUFvRzs7Ozs7Ozs7OztBQUVwRyxNQUFNLFVBQVUsdUJBQXVCLENBQUMsS0FBVSxFQUFFLElBQWdCO0lBQ2xFLE9BQU8sQ0FBQyxLQUFLLFlBQVksTUFBTSxJQUFJLENBQUMsbUJBQUEsS0FBSyxFQUFzQixDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7QUFDcEYsQ0FBQzs7Ozs7Ozs7OztBQVdELE1BQU0sVUFBVSwyQkFBMkIsQ0FBQyxXQUFtQjtJQUM3RCxPQUFPLDZCQUE2QixDQUFDLFdBQVcsb0JBQWtCLENBQUM7QUFDckUsQ0FBQzs7Ozs7Ozs7OztBQVVELE1BQU0sVUFBVSw0QkFBNEIsQ0FBQyxZQUFvQjtJQUMvRCxPQUFPLDZCQUE2QixDQUFDLFlBQVksc0JBQW1CLENBQUM7QUFDdkUsQ0FBQzs7Ozs7Ozs7OztBQVVELE1BQU0sVUFBVSw2QkFBNkIsQ0FBQyxhQUFxQjtJQUNqRSxPQUFPLDZCQUE2QixDQUFDLGFBQWEsd0JBQW9CLENBQUM7QUFDekUsQ0FBQzs7Ozs7Ozs7OztBQVVELE1BQU0sVUFBVSwwQkFBMEIsQ0FBQyxVQUFrQjtJQUMzRCxPQUFPLDZCQUE2QixDQUFDLFVBQVUsa0JBQWlCLENBQUM7QUFDbkUsQ0FBQzs7Ozs7Ozs7OztBQVVELE1BQU0sVUFBVSxrQ0FBa0MsQ0FBQyxrQkFBMEI7SUFFM0UsT0FBTyw2QkFBNkIsQ0FBQyxrQkFBa0Isa0NBQXlCLENBQUM7QUFDbkYsQ0FBQzs7Ozs7O0FBYUQsU0FBUyw2QkFBNkIsQ0FBQyxhQUFxQixFQUFFLElBQWdCOztVQUN0RSxPQUFPLEdBQUcsbUJBQUEsSUFBSSxNQUFNLENBQUMsYUFBYSxDQUFDLEVBQWlCO0lBQzFELE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDdEIsT0FBTyxPQUFPLENBQUM7QUFDakIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuY29uc3QgQlJBTkQgPSAnX19TQU5JVElaRVJfVFJVU1RFRF9CUkFORF9fJztcblxuZXhwb3J0IGNvbnN0IGVudW0gQnlwYXNzVHlwZSB7XG4gIFVybCA9ICdVcmwnLFxuICBIdG1sID0gJ0h0bWwnLFxuICBSZXNvdXJjZVVybCA9ICdSZXNvdXJjZVVybCcsXG4gIFNjcmlwdCA9ICdTY3JpcHQnLFxuICBTdHlsZSA9ICdTdHlsZScsXG59XG5cbi8qKlxuICogQSBicmFuZGVkIHRydXN0ZWQgc3RyaW5nIHVzZWQgd2l0aCBzYW5pdGl6YXRpb24uXG4gKlxuICogU2VlOiB7QGxpbmsgVHJ1c3RlZEh0bWxTdHJpbmd9LCB7QGxpbmsgVHJ1c3RlZFJlc291cmNlVXJsU3RyaW5nfSwge0BsaW5rIFRydXN0ZWRTY3JpcHRTdHJpbmd9LFxuICoge0BsaW5rIFRydXN0ZWRTdHlsZVN0cmluZ30sIHtAbGluayBUcnVzdGVkVXJsU3RyaW5nfVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFRydXN0ZWRTdHJpbmcgZXh0ZW5kcyBTdHJpbmcgeyBbQlJBTkRdOiBCeXBhc3NUeXBlOyB9XG5cbi8qKlxuICogQSBicmFuZGVkIHRydXN0ZWQgc3RyaW5nIHVzZWQgd2l0aCBzYW5pdGl6YXRpb24gb2YgYGh0bWxgIHN0cmluZ3MuXG4gKlxuICogU2VlOiB7QGxpbmsgYnlwYXNzU2FuaXRpemF0aW9uVHJ1c3RIdG1sfSBhbmQge0BsaW5rIGh0bWxTYW5pdGl6ZXJ9LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFRydXN0ZWRIdG1sU3RyaW5nIGV4dGVuZHMgVHJ1c3RlZFN0cmluZyB7IFtCUkFORF06IEJ5cGFzc1R5cGUuSHRtbDsgfVxuXG4vKipcbiAqIEEgYnJhbmRlZCB0cnVzdGVkIHN0cmluZyB1c2VkIHdpdGggc2FuaXRpemF0aW9uIG9mIGBzdHlsZWAgc3RyaW5ncy5cbiAqXG4gKiBTZWU6IHtAbGluayBieXBhc3NTYW5pdGl6YXRpb25UcnVzdFN0eWxlfSBhbmQge0BsaW5rIHN0eWxlU2FuaXRpemVyfS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUcnVzdGVkU3R5bGVTdHJpbmcgZXh0ZW5kcyBUcnVzdGVkU3RyaW5nIHsgW0JSQU5EXTogQnlwYXNzVHlwZS5TdHlsZTsgfVxuXG4vKipcbiAqIEEgYnJhbmRlZCB0cnVzdGVkIHN0cmluZyB1c2VkIHdpdGggc2FuaXRpemF0aW9uIG9mIGB1cmxgIHN0cmluZ3MuXG4gKlxuICogU2VlOiB7QGxpbmsgYnlwYXNzU2FuaXRpemF0aW9uVHJ1c3RTY3JpcHR9IGFuZCB7QGxpbmsgc2NyaXB0U2FuaXRpemVyfS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUcnVzdGVkU2NyaXB0U3RyaW5nIGV4dGVuZHMgVHJ1c3RlZFN0cmluZyB7IFtCUkFORF06IEJ5cGFzc1R5cGUuU2NyaXB0OyB9XG5cbi8qKlxuICogQSBicmFuZGVkIHRydXN0ZWQgc3RyaW5nIHVzZWQgd2l0aCBzYW5pdGl6YXRpb24gb2YgYHVybGAgc3RyaW5ncy5cbiAqXG4gKiBTZWU6IHtAbGluayBieXBhc3NTYW5pdGl6YXRpb25UcnVzdFVybH0gYW5kIHtAbGluayB1cmxTYW5pdGl6ZXJ9LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFRydXN0ZWRVcmxTdHJpbmcgZXh0ZW5kcyBUcnVzdGVkU3RyaW5nIHsgW0JSQU5EXTogQnlwYXNzVHlwZS5Vcmw7IH1cblxuLyoqXG4gKiBBIGJyYW5kZWQgdHJ1c3RlZCBzdHJpbmcgdXNlZCB3aXRoIHNhbml0aXphdGlvbiBvZiBgcmVzb3VyY2VVcmxgIHN0cmluZ3MuXG4gKlxuICogU2VlOiB7QGxpbmsgYnlwYXNzU2FuaXRpemF0aW9uVHJ1c3RSZXNvdXJjZVVybH0gYW5kIHtAbGluayByZXNvdXJjZVVybFNhbml0aXplcn0uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVHJ1c3RlZFJlc291cmNlVXJsU3RyaW5nIGV4dGVuZHMgVHJ1c3RlZFN0cmluZyB7IFtCUkFORF06IEJ5cGFzc1R5cGUuUmVzb3VyY2VVcmw7IH1cblxuZXhwb3J0IGZ1bmN0aW9uIGFsbG93U2FuaXRpemF0aW9uQnlwYXNzKHZhbHVlOiBhbnksIHR5cGU6IEJ5cGFzc1R5cGUpOiBib29sZWFuIHtcbiAgcmV0dXJuICh2YWx1ZSBpbnN0YW5jZW9mIFN0cmluZyAmJiAodmFsdWUgYXMgVHJ1c3RlZFN0eWxlU3RyaW5nKVtCUkFORF0gPT09IHR5cGUpO1xufVxuXG4vKipcbiAqIE1hcmsgYGh0bWxgIHN0cmluZyBhcyB0cnVzdGVkLlxuICpcbiAqIFRoaXMgZnVuY3Rpb24gd3JhcHMgdGhlIHRydXN0ZWQgc3RyaW5nIGluIGBTdHJpbmdgIGFuZCBicmFuZHMgaXQgaW4gYSB3YXkgd2hpY2ggbWFrZXMgaXRcbiAqIHJlY29nbml6YWJsZSB0byB7QGxpbmsgaHRtbFNhbml0aXplcn0gdG8gYmUgdHJ1c3RlZCBpbXBsaWNpdGx5LlxuICpcbiAqIEBwYXJhbSB0cnVzdGVkSHRtbCBgaHRtbGAgc3RyaW5nIHdoaWNoIG5lZWRzIHRvIGJlIGltcGxpY2l0bHkgdHJ1c3RlZC5cbiAqIEByZXR1cm5zIGEgYGh0bWxgIGBTdHJpbmdgIHdoaWNoIGhhcyBiZWVuIGJyYW5kZWQgdG8gYmUgaW1wbGljaXRseSB0cnVzdGVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYnlwYXNzU2FuaXRpemF0aW9uVHJ1c3RIdG1sKHRydXN0ZWRIdG1sOiBzdHJpbmcpOiBUcnVzdGVkSHRtbFN0cmluZyB7XG4gIHJldHVybiBieXBhc3NTYW5pdGl6YXRpb25UcnVzdFN0cmluZyh0cnVzdGVkSHRtbCwgQnlwYXNzVHlwZS5IdG1sKTtcbn1cbi8qKlxuICogTWFyayBgc3R5bGVgIHN0cmluZyBhcyB0cnVzdGVkLlxuICpcbiAqIFRoaXMgZnVuY3Rpb24gd3JhcHMgdGhlIHRydXN0ZWQgc3RyaW5nIGluIGBTdHJpbmdgIGFuZCBicmFuZHMgaXQgaW4gYSB3YXkgd2hpY2ggbWFrZXMgaXRcbiAqIHJlY29nbml6YWJsZSB0byB7QGxpbmsgc3R5bGVTYW5pdGl6ZXJ9IHRvIGJlIHRydXN0ZWQgaW1wbGljaXRseS5cbiAqXG4gKiBAcGFyYW0gdHJ1c3RlZFN0eWxlIGBzdHlsZWAgc3RyaW5nIHdoaWNoIG5lZWRzIHRvIGJlIGltcGxpY2l0bHkgdHJ1c3RlZC5cbiAqIEByZXR1cm5zIGEgYHN0eWxlYCBgU3RyaW5nYCB3aGljaCBoYXMgYmVlbiBicmFuZGVkIHRvIGJlIGltcGxpY2l0bHkgdHJ1c3RlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJ5cGFzc1Nhbml0aXphdGlvblRydXN0U3R5bGUodHJ1c3RlZFN0eWxlOiBzdHJpbmcpOiBUcnVzdGVkU3R5bGVTdHJpbmcge1xuICByZXR1cm4gYnlwYXNzU2FuaXRpemF0aW9uVHJ1c3RTdHJpbmcodHJ1c3RlZFN0eWxlLCBCeXBhc3NUeXBlLlN0eWxlKTtcbn1cbi8qKlxuICogTWFyayBgc2NyaXB0YCBzdHJpbmcgYXMgdHJ1c3RlZC5cbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIHdyYXBzIHRoZSB0cnVzdGVkIHN0cmluZyBpbiBgU3RyaW5nYCBhbmQgYnJhbmRzIGl0IGluIGEgd2F5IHdoaWNoIG1ha2VzIGl0XG4gKiByZWNvZ25pemFibGUgdG8ge0BsaW5rIHNjcmlwdFNhbml0aXplcn0gdG8gYmUgdHJ1c3RlZCBpbXBsaWNpdGx5LlxuICpcbiAqIEBwYXJhbSB0cnVzdGVkU2NyaXB0IGBzY3JpcHRgIHN0cmluZyB3aGljaCBuZWVkcyB0byBiZSBpbXBsaWNpdGx5IHRydXN0ZWQuXG4gKiBAcmV0dXJucyBhIGBzY3JpcHRgIGBTdHJpbmdgIHdoaWNoIGhhcyBiZWVuIGJyYW5kZWQgdG8gYmUgaW1wbGljaXRseSB0cnVzdGVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYnlwYXNzU2FuaXRpemF0aW9uVHJ1c3RTY3JpcHQodHJ1c3RlZFNjcmlwdDogc3RyaW5nKTogVHJ1c3RlZFNjcmlwdFN0cmluZyB7XG4gIHJldHVybiBieXBhc3NTYW5pdGl6YXRpb25UcnVzdFN0cmluZyh0cnVzdGVkU2NyaXB0LCBCeXBhc3NUeXBlLlNjcmlwdCk7XG59XG4vKipcbiAqIE1hcmsgYHVybGAgc3RyaW5nIGFzIHRydXN0ZWQuXG4gKlxuICogVGhpcyBmdW5jdGlvbiB3cmFwcyB0aGUgdHJ1c3RlZCBzdHJpbmcgaW4gYFN0cmluZ2AgYW5kIGJyYW5kcyBpdCBpbiBhIHdheSB3aGljaCBtYWtlcyBpdFxuICogcmVjb2duaXphYmxlIHRvIHtAbGluayB1cmxTYW5pdGl6ZXJ9IHRvIGJlIHRydXN0ZWQgaW1wbGljaXRseS5cbiAqXG4gKiBAcGFyYW0gdHJ1c3RlZFVybCBgdXJsYCBzdHJpbmcgd2hpY2ggbmVlZHMgdG8gYmUgaW1wbGljaXRseSB0cnVzdGVkLlxuICogQHJldHVybnMgYSBgdXJsYCBgU3RyaW5nYCB3aGljaCBoYXMgYmVlbiBicmFuZGVkIHRvIGJlIGltcGxpY2l0bHkgdHJ1c3RlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJ5cGFzc1Nhbml0aXphdGlvblRydXN0VXJsKHRydXN0ZWRVcmw6IHN0cmluZyk6IFRydXN0ZWRVcmxTdHJpbmcge1xuICByZXR1cm4gYnlwYXNzU2FuaXRpemF0aW9uVHJ1c3RTdHJpbmcodHJ1c3RlZFVybCwgQnlwYXNzVHlwZS5VcmwpO1xufVxuLyoqXG4gKiBNYXJrIGB1cmxgIHN0cmluZyBhcyB0cnVzdGVkLlxuICpcbiAqIFRoaXMgZnVuY3Rpb24gd3JhcHMgdGhlIHRydXN0ZWQgc3RyaW5nIGluIGBTdHJpbmdgIGFuZCBicmFuZHMgaXQgaW4gYSB3YXkgd2hpY2ggbWFrZXMgaXRcbiAqIHJlY29nbml6YWJsZSB0byB7QGxpbmsgcmVzb3VyY2VVcmxTYW5pdGl6ZXJ9IHRvIGJlIHRydXN0ZWQgaW1wbGljaXRseS5cbiAqXG4gKiBAcGFyYW0gdHJ1c3RlZFJlc291cmNlVXJsIGB1cmxgIHN0cmluZyB3aGljaCBuZWVkcyB0byBiZSBpbXBsaWNpdGx5IHRydXN0ZWQuXG4gKiBAcmV0dXJucyBhIGB1cmxgIGBTdHJpbmdgIHdoaWNoIGhhcyBiZWVuIGJyYW5kZWQgdG8gYmUgaW1wbGljaXRseSB0cnVzdGVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYnlwYXNzU2FuaXRpemF0aW9uVHJ1c3RSZXNvdXJjZVVybCh0cnVzdGVkUmVzb3VyY2VVcmw6IHN0cmluZyk6XG4gICAgVHJ1c3RlZFJlc291cmNlVXJsU3RyaW5nIHtcbiAgcmV0dXJuIGJ5cGFzc1Nhbml0aXphdGlvblRydXN0U3RyaW5nKHRydXN0ZWRSZXNvdXJjZVVybCwgQnlwYXNzVHlwZS5SZXNvdXJjZVVybCk7XG59XG5cblxuZnVuY3Rpb24gYnlwYXNzU2FuaXRpemF0aW9uVHJ1c3RTdHJpbmcoXG4gICAgdHJ1c3RlZFN0cmluZzogc3RyaW5nLCBtb2RlOiBCeXBhc3NUeXBlLkh0bWwpOiBUcnVzdGVkSHRtbFN0cmluZztcbmZ1bmN0aW9uIGJ5cGFzc1Nhbml0aXphdGlvblRydXN0U3RyaW5nKFxuICAgIHRydXN0ZWRTdHJpbmc6IHN0cmluZywgbW9kZTogQnlwYXNzVHlwZS5TdHlsZSk6IFRydXN0ZWRTdHlsZVN0cmluZztcbmZ1bmN0aW9uIGJ5cGFzc1Nhbml0aXphdGlvblRydXN0U3RyaW5nKFxuICAgIHRydXN0ZWRTdHJpbmc6IHN0cmluZywgbW9kZTogQnlwYXNzVHlwZS5TY3JpcHQpOiBUcnVzdGVkU2NyaXB0U3RyaW5nO1xuZnVuY3Rpb24gYnlwYXNzU2FuaXRpemF0aW9uVHJ1c3RTdHJpbmcoXG4gICAgdHJ1c3RlZFN0cmluZzogc3RyaW5nLCBtb2RlOiBCeXBhc3NUeXBlLlVybCk6IFRydXN0ZWRVcmxTdHJpbmc7XG5mdW5jdGlvbiBieXBhc3NTYW5pdGl6YXRpb25UcnVzdFN0cmluZyhcbiAgICB0cnVzdGVkU3RyaW5nOiBzdHJpbmcsIG1vZGU6IEJ5cGFzc1R5cGUuUmVzb3VyY2VVcmwpOiBUcnVzdGVkUmVzb3VyY2VVcmxTdHJpbmc7XG5mdW5jdGlvbiBieXBhc3NTYW5pdGl6YXRpb25UcnVzdFN0cmluZyh0cnVzdGVkU3RyaW5nOiBzdHJpbmcsIG1vZGU6IEJ5cGFzc1R5cGUpOiBUcnVzdGVkU3RyaW5nIHtcbiAgY29uc3QgdHJ1c3RlZCA9IG5ldyBTdHJpbmcodHJ1c3RlZFN0cmluZykgYXMgVHJ1c3RlZFN0cmluZztcbiAgdHJ1c3RlZFtCUkFORF0gPSBtb2RlO1xuICByZXR1cm4gdHJ1c3RlZDtcbn1cbiJdfQ==