/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { isDevMode } from '../util/is_dev_mode';
import { _sanitizeUrl } from './url_sanitizer';
/**
 * Regular expression for safe style values.
 *
 * Quotes (" and ') are allowed, but a check must be done elsewhere to ensure they're balanced.
 *
 * ',' allows multiple values to be assigned to the same property (e.g. background-attachment or
 * font-family) and hence could allow multiple values to get injected, but that should pose no risk
 * of XSS.
 *
 * The function expression checks only for XSS safety, not for CSS validity.
 *
 * This regular expression was taken from the Closure sanitization library, and augmented for
 * transformation values.
 */
var VALUES = '[-,."\'%_!# a-zA-Z0-9]+';
var TRANSFORMATION_FNS = '(?:matrix|translate|scale|rotate|skew|perspective)(?:X|Y|3d)?';
var COLOR_FNS = '(?:rgb|hsl)a?';
var GRADIENTS = '(?:repeating-)?(?:linear|radial)-gradient';
var CSS3_FNS = '(?:calc|attr)';
var FN_ARGS = '\\([-0-9.%, #a-zA-Z]+\\)';
var SAFE_STYLE_VALUE = new RegExp("^(" + VALUES + "|" +
    ("(?:" + TRANSFORMATION_FNS + "|" + COLOR_FNS + "|" + GRADIENTS + "|" + CSS3_FNS + ")") +
    (FN_ARGS + ")$"), 'g');
/**
 * Matches a `url(...)` value with an arbitrary argument as long as it does
 * not contain parentheses.
 *
 * The URL value still needs to be sanitized separately.
 *
 * `url(...)` values are a very common use case, e.g. for `background-image`. With carefully crafted
 * CSS style rules, it is possible to construct an information leak with `url` values in CSS, e.g.
 * by observing whether scroll bars are displayed, or character ranges used by a font face
 * definition.
 *
 * Angular only allows binding CSS values (as opposed to entire CSS rules), so it is unlikely that
 * binding a URL value without further cooperation from the page will cause an information leak, and
 * if so, it is just a leak, not a full blown XSS vulnerability.
 *
 * Given the common use case, low likelihood of attack vector, and low impact of an attack, this
 * code is permissive and allows URLs that sanitize otherwise.
 */
var URL_RE = /^url\(([^)]+)\)$/;
/**
 * Checks that quotes (" and ') are properly balanced inside a string. Assumes
 * that neither escape (\) nor any other character that could result in
 * breaking out of a string parsing context are allowed;
 * see http://www.w3.org/TR/css3-syntax/#string-token-diagram.
 *
 * This code was taken from the Closure sanitization library.
 */
function hasBalancedQuotes(value) {
    var outsideSingle = true;
    var outsideDouble = true;
    for (var i = 0; i < value.length; i++) {
        var c = value.charAt(i);
        if (c === '\'' && outsideDouble) {
            outsideSingle = !outsideSingle;
        }
        else if (c === '"' && outsideSingle) {
            outsideDouble = !outsideDouble;
        }
    }
    return outsideSingle && outsideDouble;
}
/**
 * Sanitizes the given untrusted CSS style property value (i.e. not an entire object, just a single
 * value) and returns a value that is safe to use in a browser environment.
 */
export function _sanitizeStyle(value) {
    value = String(value).trim(); // Make sure it's actually a string.
    if (!value)
        return '';
    // Single url(...) values are supported, but only for URLs that sanitize cleanly. See above for
    // reasoning behind this.
    var urlMatch = value.match(URL_RE);
    if ((urlMatch && _sanitizeUrl(urlMatch[1]) === urlMatch[1]) ||
        value.match(SAFE_STYLE_VALUE) && hasBalancedQuotes(value)) {
        return value; // Safe style values.
    }
    if (isDevMode()) {
        console.warn("WARNING: sanitizing unsafe style value " + value + " (see http://g.co/ng/security#xss).");
    }
    return 'unsafe';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R5bGVfc2FuaXRpemVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvc2FuaXRpemF0aW9uL3N0eWxlX3Nhbml0aXplci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDOUMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBRzdDOzs7Ozs7Ozs7Ozs7O0dBYUc7QUFDSCxJQUFNLE1BQU0sR0FBRyx5QkFBeUIsQ0FBQztBQUN6QyxJQUFNLGtCQUFrQixHQUFHLCtEQUErRCxDQUFDO0FBQzNGLElBQU0sU0FBUyxHQUFHLGVBQWUsQ0FBQztBQUNsQyxJQUFNLFNBQVMsR0FBRywyQ0FBMkMsQ0FBQztBQUM5RCxJQUFNLFFBQVEsR0FBRyxlQUFlLENBQUM7QUFDakMsSUFBTSxPQUFPLEdBQUcsMEJBQTBCLENBQUM7QUFDM0MsSUFBTSxnQkFBZ0IsR0FBRyxJQUFJLE1BQU0sQ0FDL0IsT0FBSyxNQUFNLE1BQUc7S0FDVixRQUFNLGtCQUFrQixTQUFJLFNBQVMsU0FBSSxTQUFTLFNBQUksUUFBUSxNQUFHLENBQUE7S0FDOUQsT0FBTyxPQUFJLENBQUEsRUFDbEIsR0FBRyxDQUFDLENBQUM7QUFFVDs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7QUFDSCxJQUFNLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQztBQUVsQzs7Ozs7OztHQU9HO0FBQ0gsU0FBUyxpQkFBaUIsQ0FBQyxLQUFhO0lBQ3RDLElBQUksYUFBYSxHQUFHLElBQUksQ0FBQztJQUN6QixJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUM7SUFDekIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDckMsSUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQixJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksYUFBYSxFQUFFO1lBQy9CLGFBQWEsR0FBRyxDQUFDLGFBQWEsQ0FBQztTQUNoQzthQUFNLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxhQUFhLEVBQUU7WUFDckMsYUFBYSxHQUFHLENBQUMsYUFBYSxDQUFDO1NBQ2hDO0tBQ0Y7SUFDRCxPQUFPLGFBQWEsSUFBSSxhQUFhLENBQUM7QUFDeEMsQ0FBQztBQUVEOzs7R0FHRztBQUNILE1BQU0sVUFBVSxjQUFjLENBQUMsS0FBYTtJQUMxQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUUsb0NBQW9DO0lBQ25FLElBQUksQ0FBQyxLQUFLO1FBQUUsT0FBTyxFQUFFLENBQUM7SUFFdEIsK0ZBQStGO0lBQy9GLHlCQUF5QjtJQUN6QixJQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3JDLElBQUksQ0FBQyxRQUFRLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2RCxLQUFLLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLElBQUksaUJBQWlCLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDN0QsT0FBTyxLQUFLLENBQUMsQ0FBRSxxQkFBcUI7S0FDckM7SUFFRCxJQUFJLFNBQVMsRUFBRSxFQUFFO1FBQ2YsT0FBTyxDQUFDLElBQUksQ0FDUiw0Q0FBMEMsS0FBSyx3Q0FBcUMsQ0FBQyxDQUFDO0tBQzNGO0lBRUQsT0FBTyxRQUFRLENBQUM7QUFDbEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtpc0Rldk1vZGV9IGZyb20gJy4uL3V0aWwvaXNfZGV2X21vZGUnO1xuaW1wb3J0IHtfc2FuaXRpemVVcmx9IGZyb20gJy4vdXJsX3Nhbml0aXplcic7XG5cblxuLyoqXG4gKiBSZWd1bGFyIGV4cHJlc3Npb24gZm9yIHNhZmUgc3R5bGUgdmFsdWVzLlxuICpcbiAqIFF1b3RlcyAoXCIgYW5kICcpIGFyZSBhbGxvd2VkLCBidXQgYSBjaGVjayBtdXN0IGJlIGRvbmUgZWxzZXdoZXJlIHRvIGVuc3VyZSB0aGV5J3JlIGJhbGFuY2VkLlxuICpcbiAqICcsJyBhbGxvd3MgbXVsdGlwbGUgdmFsdWVzIHRvIGJlIGFzc2lnbmVkIHRvIHRoZSBzYW1lIHByb3BlcnR5IChlLmcuIGJhY2tncm91bmQtYXR0YWNobWVudCBvclxuICogZm9udC1mYW1pbHkpIGFuZCBoZW5jZSBjb3VsZCBhbGxvdyBtdWx0aXBsZSB2YWx1ZXMgdG8gZ2V0IGluamVjdGVkLCBidXQgdGhhdCBzaG91bGQgcG9zZSBubyByaXNrXG4gKiBvZiBYU1MuXG4gKlxuICogVGhlIGZ1bmN0aW9uIGV4cHJlc3Npb24gY2hlY2tzIG9ubHkgZm9yIFhTUyBzYWZldHksIG5vdCBmb3IgQ1NTIHZhbGlkaXR5LlxuICpcbiAqIFRoaXMgcmVndWxhciBleHByZXNzaW9uIHdhcyB0YWtlbiBmcm9tIHRoZSBDbG9zdXJlIHNhbml0aXphdGlvbiBsaWJyYXJ5LCBhbmQgYXVnbWVudGVkIGZvclxuICogdHJhbnNmb3JtYXRpb24gdmFsdWVzLlxuICovXG5jb25zdCBWQUxVRVMgPSAnWy0sLlwiXFwnJV8hIyBhLXpBLVowLTldKyc7XG5jb25zdCBUUkFOU0ZPUk1BVElPTl9GTlMgPSAnKD86bWF0cml4fHRyYW5zbGF0ZXxzY2FsZXxyb3RhdGV8c2tld3xwZXJzcGVjdGl2ZSkoPzpYfFl8M2QpPyc7XG5jb25zdCBDT0xPUl9GTlMgPSAnKD86cmdifGhzbClhPyc7XG5jb25zdCBHUkFESUVOVFMgPSAnKD86cmVwZWF0aW5nLSk/KD86bGluZWFyfHJhZGlhbCktZ3JhZGllbnQnO1xuY29uc3QgQ1NTM19GTlMgPSAnKD86Y2FsY3xhdHRyKSc7XG5jb25zdCBGTl9BUkdTID0gJ1xcXFwoWy0wLTkuJSwgI2EtekEtWl0rXFxcXCknO1xuY29uc3QgU0FGRV9TVFlMRV9WQUxVRSA9IG5ldyBSZWdFeHAoXG4gICAgYF4oJHtWQUxVRVN9fGAgK1xuICAgICAgICBgKD86JHtUUkFOU0ZPUk1BVElPTl9GTlN9fCR7Q09MT1JfRk5TfXwke0dSQURJRU5UU318JHtDU1MzX0ZOU30pYCArXG4gICAgICAgIGAke0ZOX0FSR1N9KSRgLFxuICAgICdnJyk7XG5cbi8qKlxuICogTWF0Y2hlcyBhIGB1cmwoLi4uKWAgdmFsdWUgd2l0aCBhbiBhcmJpdHJhcnkgYXJndW1lbnQgYXMgbG9uZyBhcyBpdCBkb2VzXG4gKiBub3QgY29udGFpbiBwYXJlbnRoZXNlcy5cbiAqXG4gKiBUaGUgVVJMIHZhbHVlIHN0aWxsIG5lZWRzIHRvIGJlIHNhbml0aXplZCBzZXBhcmF0ZWx5LlxuICpcbiAqIGB1cmwoLi4uKWAgdmFsdWVzIGFyZSBhIHZlcnkgY29tbW9uIHVzZSBjYXNlLCBlLmcuIGZvciBgYmFja2dyb3VuZC1pbWFnZWAuIFdpdGggY2FyZWZ1bGx5IGNyYWZ0ZWRcbiAqIENTUyBzdHlsZSBydWxlcywgaXQgaXMgcG9zc2libGUgdG8gY29uc3RydWN0IGFuIGluZm9ybWF0aW9uIGxlYWsgd2l0aCBgdXJsYCB2YWx1ZXMgaW4gQ1NTLCBlLmcuXG4gKiBieSBvYnNlcnZpbmcgd2hldGhlciBzY3JvbGwgYmFycyBhcmUgZGlzcGxheWVkLCBvciBjaGFyYWN0ZXIgcmFuZ2VzIHVzZWQgYnkgYSBmb250IGZhY2VcbiAqIGRlZmluaXRpb24uXG4gKlxuICogQW5ndWxhciBvbmx5IGFsbG93cyBiaW5kaW5nIENTUyB2YWx1ZXMgKGFzIG9wcG9zZWQgdG8gZW50aXJlIENTUyBydWxlcyksIHNvIGl0IGlzIHVubGlrZWx5IHRoYXRcbiAqIGJpbmRpbmcgYSBVUkwgdmFsdWUgd2l0aG91dCBmdXJ0aGVyIGNvb3BlcmF0aW9uIGZyb20gdGhlIHBhZ2Ugd2lsbCBjYXVzZSBhbiBpbmZvcm1hdGlvbiBsZWFrLCBhbmRcbiAqIGlmIHNvLCBpdCBpcyBqdXN0IGEgbGVhaywgbm90IGEgZnVsbCBibG93biBYU1MgdnVsbmVyYWJpbGl0eS5cbiAqXG4gKiBHaXZlbiB0aGUgY29tbW9uIHVzZSBjYXNlLCBsb3cgbGlrZWxpaG9vZCBvZiBhdHRhY2sgdmVjdG9yLCBhbmQgbG93IGltcGFjdCBvZiBhbiBhdHRhY2ssIHRoaXNcbiAqIGNvZGUgaXMgcGVybWlzc2l2ZSBhbmQgYWxsb3dzIFVSTHMgdGhhdCBzYW5pdGl6ZSBvdGhlcndpc2UuXG4gKi9cbmNvbnN0IFVSTF9SRSA9IC9edXJsXFwoKFteKV0rKVxcKSQvO1xuXG4vKipcbiAqIENoZWNrcyB0aGF0IHF1b3RlcyAoXCIgYW5kICcpIGFyZSBwcm9wZXJseSBiYWxhbmNlZCBpbnNpZGUgYSBzdHJpbmcuIEFzc3VtZXNcbiAqIHRoYXQgbmVpdGhlciBlc2NhcGUgKFxcKSBub3IgYW55IG90aGVyIGNoYXJhY3RlciB0aGF0IGNvdWxkIHJlc3VsdCBpblxuICogYnJlYWtpbmcgb3V0IG9mIGEgc3RyaW5nIHBhcnNpbmcgY29udGV4dCBhcmUgYWxsb3dlZDtcbiAqIHNlZSBodHRwOi8vd3d3LnczLm9yZy9UUi9jc3MzLXN5bnRheC8jc3RyaW5nLXRva2VuLWRpYWdyYW0uXG4gKlxuICogVGhpcyBjb2RlIHdhcyB0YWtlbiBmcm9tIHRoZSBDbG9zdXJlIHNhbml0aXphdGlvbiBsaWJyYXJ5LlxuICovXG5mdW5jdGlvbiBoYXNCYWxhbmNlZFF1b3Rlcyh2YWx1ZTogc3RyaW5nKSB7XG4gIGxldCBvdXRzaWRlU2luZ2xlID0gdHJ1ZTtcbiAgbGV0IG91dHNpZGVEb3VibGUgPSB0cnVlO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgYyA9IHZhbHVlLmNoYXJBdChpKTtcbiAgICBpZiAoYyA9PT0gJ1xcJycgJiYgb3V0c2lkZURvdWJsZSkge1xuICAgICAgb3V0c2lkZVNpbmdsZSA9ICFvdXRzaWRlU2luZ2xlO1xuICAgIH0gZWxzZSBpZiAoYyA9PT0gJ1wiJyAmJiBvdXRzaWRlU2luZ2xlKSB7XG4gICAgICBvdXRzaWRlRG91YmxlID0gIW91dHNpZGVEb3VibGU7XG4gICAgfVxuICB9XG4gIHJldHVybiBvdXRzaWRlU2luZ2xlICYmIG91dHNpZGVEb3VibGU7XG59XG5cbi8qKlxuICogU2FuaXRpemVzIHRoZSBnaXZlbiB1bnRydXN0ZWQgQ1NTIHN0eWxlIHByb3BlcnR5IHZhbHVlIChpLmUuIG5vdCBhbiBlbnRpcmUgb2JqZWN0LCBqdXN0IGEgc2luZ2xlXG4gKiB2YWx1ZSkgYW5kIHJldHVybnMgYSB2YWx1ZSB0aGF0IGlzIHNhZmUgdG8gdXNlIGluIGEgYnJvd3NlciBlbnZpcm9ubWVudC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIF9zYW5pdGl6ZVN0eWxlKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuICB2YWx1ZSA9IFN0cmluZyh2YWx1ZSkudHJpbSgpOyAgLy8gTWFrZSBzdXJlIGl0J3MgYWN0dWFsbHkgYSBzdHJpbmcuXG4gIGlmICghdmFsdWUpIHJldHVybiAnJztcblxuICAvLyBTaW5nbGUgdXJsKC4uLikgdmFsdWVzIGFyZSBzdXBwb3J0ZWQsIGJ1dCBvbmx5IGZvciBVUkxzIHRoYXQgc2FuaXRpemUgY2xlYW5seS4gU2VlIGFib3ZlIGZvclxuICAvLyByZWFzb25pbmcgYmVoaW5kIHRoaXMuXG4gIGNvbnN0IHVybE1hdGNoID0gdmFsdWUubWF0Y2goVVJMX1JFKTtcbiAgaWYgKCh1cmxNYXRjaCAmJiBfc2FuaXRpemVVcmwodXJsTWF0Y2hbMV0pID09PSB1cmxNYXRjaFsxXSkgfHxcbiAgICAgIHZhbHVlLm1hdGNoKFNBRkVfU1RZTEVfVkFMVUUpICYmIGhhc0JhbGFuY2VkUXVvdGVzKHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZTsgIC8vIFNhZmUgc3R5bGUgdmFsdWVzLlxuICB9XG5cbiAgaWYgKGlzRGV2TW9kZSgpKSB7XG4gICAgY29uc29sZS53YXJuKFxuICAgICAgICBgV0FSTklORzogc2FuaXRpemluZyB1bnNhZmUgc3R5bGUgdmFsdWUgJHt2YWx1ZX0gKHNlZSBodHRwOi8vZy5jby9uZy9zZWN1cml0eSN4c3MpLmApO1xuICB9XG5cbiAgcmV0dXJuICd1bnNhZmUnO1xufVxuXG5cbi8qKlxuICogVXNlZCB0byBpbnRlcmNlcHQgYW5kIHNhbml0aXplIHN0eWxlIHZhbHVlcyBiZWZvcmUgdGhleSBhcmUgd3JpdHRlbiB0byB0aGUgcmVuZGVyZXIuXG4gKlxuICogVGhpcyBmdW5jdGlvbiBpcyBkZXNpZ25lZCB0byBiZSBjYWxsZWQgaW4gdHdvIG1vZGVzLiBXaGVuIGEgdmFsdWUgaXMgbm90IHByb3ZpZGVkXG4gKiB0aGVuIHRoZSBmdW5jdGlvbiB3aWxsIHJldHVybiBhIGJvb2xlYW4gd2hldGhlciBhIHByb3BlcnR5IHdpbGwgYmUgc2FuaXRpemVkIGxhdGVyLlxuICogSWYgYSB2YWx1ZSBpcyBwcm92aWRlZCB0aGVuIHRoZSBzYW5pdGl6ZWQgdmVyc2lvbiBvZiB0aGF0IHdpbGwgYmUgcmV0dXJuZWQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU3R5bGVTYW5pdGl6ZUZuIHtcbiAgLyoqIFRoaXMgbW9kZSBpcyBkZXNpZ25lZCB0byBpbnN0cnVjdCB3aGV0aGVyIHRoZSBwcm9wZXJ0eSB3aWxsIGJlIHVzZWQgZm9yIHNhbml0aXphdGlvblxuICAgKiBhdCBhIGxhdGVyIHBvaW50ICovXG4gIChwcm9wOiBzdHJpbmcpOiBib29sZWFuO1xuICAvKiogVGhpcyBtb2RlIGlzIGRlc2lnbmVkIHRvIHNhbml0aXplIHRoZSBwcm92aWRlZCB2YWx1ZSAqL1xuICAocHJvcDogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogc3RyaW5nO1xufVxuIl19