/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
* Equivalent to ES6 spread, add each item to an array.
*
* @param items The items to add
* @param arr The array to which you want to add the items
*/
export function addAllToArray(items, arr) {
    for (var i = 0; i < items.length; i++) {
        arr.push(items[i]);
    }
}
/**
 * Flattens an array.
 */
export function flatten(list, dst) {
    if (dst === undefined)
        dst = list;
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        if (Array.isArray(item)) {
            // we need to inline it.
            if (dst === list) {
                // Our assumption that the list was already flat was wrong and
                // we need to clone flat since we need to write to it.
                dst = list.slice(0, i);
            }
            flatten(item, dst);
        }
        else if (dst !== list) {
            dst.push(item);
        }
    }
    return dst;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJyYXlfdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy91dGlsL2FycmF5X3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVIOzs7OztFQUtFO0FBQ0YsTUFBTSxVQUFVLGFBQWEsQ0FBQyxLQUFZLEVBQUUsR0FBVTtJQUNwRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNyQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3BCO0FBQ0gsQ0FBQztBQUVEOztHQUVHO0FBQ0gsTUFBTSxVQUFVLE9BQU8sQ0FBQyxJQUFXLEVBQUUsR0FBVztJQUM5QyxJQUFJLEdBQUcsS0FBSyxTQUFTO1FBQUUsR0FBRyxHQUFHLElBQUksQ0FBQztJQUNsQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNwQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkIsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3ZCLHdCQUF3QjtZQUN4QixJQUFJLEdBQUcsS0FBSyxJQUFJLEVBQUU7Z0JBQ2hCLDhEQUE4RDtnQkFDOUQsc0RBQXNEO2dCQUN0RCxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDeEI7WUFDRCxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQ3BCO2FBQU0sSUFBSSxHQUFHLEtBQUssSUFBSSxFQUFFO1lBQ3ZCLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDaEI7S0FDRjtJQUNELE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLyoqXG4qIEVxdWl2YWxlbnQgdG8gRVM2IHNwcmVhZCwgYWRkIGVhY2ggaXRlbSB0byBhbiBhcnJheS5cbipcbiogQHBhcmFtIGl0ZW1zIFRoZSBpdGVtcyB0byBhZGRcbiogQHBhcmFtIGFyciBUaGUgYXJyYXkgdG8gd2hpY2ggeW91IHdhbnQgdG8gYWRkIHRoZSBpdGVtc1xuKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRBbGxUb0FycmF5KGl0ZW1zOiBhbnlbXSwgYXJyOiBhbnlbXSkge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgYXJyLnB1c2goaXRlbXNbaV0pO1xuICB9XG59XG5cbi8qKlxuICogRmxhdHRlbnMgYW4gYXJyYXkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmbGF0dGVuKGxpc3Q6IGFueVtdLCBkc3Q/OiBhbnlbXSk6IGFueVtdIHtcbiAgaWYgKGRzdCA9PT0gdW5kZWZpbmVkKSBkc3QgPSBsaXN0O1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgaXRlbSA9IGxpc3RbaV07XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoaXRlbSkpIHtcbiAgICAgIC8vIHdlIG5lZWQgdG8gaW5saW5lIGl0LlxuICAgICAgaWYgKGRzdCA9PT0gbGlzdCkge1xuICAgICAgICAvLyBPdXIgYXNzdW1wdGlvbiB0aGF0IHRoZSBsaXN0IHdhcyBhbHJlYWR5IGZsYXQgd2FzIHdyb25nIGFuZFxuICAgICAgICAvLyB3ZSBuZWVkIHRvIGNsb25lIGZsYXQgc2luY2Ugd2UgbmVlZCB0byB3cml0ZSB0byBpdC5cbiAgICAgICAgZHN0ID0gbGlzdC5zbGljZSgwLCBpKTtcbiAgICAgIH1cbiAgICAgIGZsYXR0ZW4oaXRlbSwgZHN0KTtcbiAgICB9IGVsc2UgaWYgKGRzdCAhPT0gbGlzdCkge1xuICAgICAgZHN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBkc3Q7XG59Il19