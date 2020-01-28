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
/**
 * Used for tracking queries (e.g. ViewChild, ContentChild).
 * @record
 */
export function LQueries() { }
if (false) {
    /**
     * The parent LQueries instance.
     *
     * When there is a content query, a new LQueries instance is created to avoid mutating any
     * existing LQueries. After we are done searching content children, the parent property allows
     * us to traverse back up to the original LQueries instance to continue to search for matches
     * in the main view.
     * @type {?}
     */
    LQueries.prototype.parent;
    /**
     * Ask queries to prepare copy of itself. This assures that tracking new queries on content nodes
     * doesn't mutate list of queries tracked on a parent node. We will clone LQueries before
     * constructing content queries.
     * @return {?}
     */
    LQueries.prototype.clone = function () { };
    /**
     * Notify `LQueries` that a new `TNode` has been created and needs to be added to query results
     * if matching query predicate.
     * @param {?} tNode
     * @return {?}
     */
    LQueries.prototype.addNode = function (tNode) { };
    /**
     * Notify `LQueries` that a new `TNode` has been created and needs to be added to query results
     * if matching query predicate. This is a special mode invoked if the query container has to
     * be created out of order (e.g. view created in the constructor of a directive).
     * @param {?} tNode
     * @return {?}
     */
    LQueries.prototype.insertNodeBeforeViews = function (tNode) { };
    /**
     * Notify `LQueries` that a new LContainer was added to ivy data structures. As a result we need
     * to prepare room for views that might be inserted into this container.
     * @return {?}
     */
    LQueries.prototype.container = function () { };
    /**
     * Notify `LQueries` that a new `LView` has been created. As a result we need to prepare room
     * and collect nodes that match query predicate.
     * @return {?}
     */
    LQueries.prototype.createView = function () { };
    /**
     * Notify `LQueries` that a new `LView` has been added to `LContainer`. As a result all
     * the matching nodes from this view should be added to container's queries.
     * @param {?} newViewIndex
     * @return {?}
     */
    LQueries.prototype.insertView = function (newViewIndex) { };
    /**
     * Notify `LQueries` that an `LView` has been removed from `LContainer`. As a result all
     * the matching nodes from this view should be removed from container's queries.
     * @return {?}
     */
    LQueries.prototype.removeView = function () { };
    /**
     * Add additional `QueryList` to track.
     *
     * @template T
     * @param {?} queryList `QueryList` to update with changes.
     * @param {?} predicate Either `Type` or selector array of [key, value] predicates.
     * @param {?=} descend If true the query will recursively apply to the children.
     * @param {?=} read Indicates which token should be read from DI for this query.
     * @return {?}
     */
    LQueries.prototype.track = function (queryList, predicate, descend, read) { };
}
// Note: This hack is necessary so we don't erroneously get a circular dependency
// failure based on types.
/** @type {?} */
export const unusedValueExportToPlacateAjd = 1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9yZW5kZXIzL2ludGVyZmFjZXMvcXVlcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBZUEsOEJBa0VDOzs7Ozs7Ozs7OztJQXpEQywwQkFBc0I7Ozs7Ozs7SUFPdEIsMkNBQWtCOzs7Ozs7O0lBTWxCLGtEQUF3RTs7Ozs7Ozs7SUFPeEUsZ0VBQXNGOzs7Ozs7SUFNdEYsK0NBQTJCOzs7Ozs7SUFNM0IsZ0RBQTRCOzs7Ozs7O0lBTTVCLDREQUF1Qzs7Ozs7O0lBTXZDLGdEQUFtQjs7Ozs7Ozs7Ozs7SUFVbkIsOEVBRTBCOzs7OztBQUs1QixNQUFNLE9BQU8sNkJBQTZCLEdBQUcsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtUeXBlfSBmcm9tICcuLi8uLi9pbnRlcmZhY2UvdHlwZSc7XG5pbXBvcnQge1F1ZXJ5TGlzdH0gZnJvbSAnLi4vLi4vbGlua2VyJztcblxuaW1wb3J0IHtUQ29udGFpbmVyTm9kZSwgVEVsZW1lbnRDb250YWluZXJOb2RlLCBURWxlbWVudE5vZGUsIFROb2RlfSBmcm9tICcuL25vZGUnO1xuXG5cbi8qKiBVc2VkIGZvciB0cmFja2luZyBxdWVyaWVzIChlLmcuIFZpZXdDaGlsZCwgQ29udGVudENoaWxkKS4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTFF1ZXJpZXMge1xuICAvKipcbiAgICogVGhlIHBhcmVudCBMUXVlcmllcyBpbnN0YW5jZS5cbiAgICpcbiAgICogV2hlbiB0aGVyZSBpcyBhIGNvbnRlbnQgcXVlcnksIGEgbmV3IExRdWVyaWVzIGluc3RhbmNlIGlzIGNyZWF0ZWQgdG8gYXZvaWQgbXV0YXRpbmcgYW55XG4gICAqIGV4aXN0aW5nIExRdWVyaWVzLiBBZnRlciB3ZSBhcmUgZG9uZSBzZWFyY2hpbmcgY29udGVudCBjaGlsZHJlbiwgdGhlIHBhcmVudCBwcm9wZXJ0eSBhbGxvd3NcbiAgICogdXMgdG8gdHJhdmVyc2UgYmFjayB1cCB0byB0aGUgb3JpZ2luYWwgTFF1ZXJpZXMgaW5zdGFuY2UgdG8gY29udGludWUgdG8gc2VhcmNoIGZvciBtYXRjaGVzXG4gICAqIGluIHRoZSBtYWluIHZpZXcuXG4gICAqL1xuICBwYXJlbnQ6IExRdWVyaWVzfG51bGw7XG5cbiAgLyoqXG4gICAqIEFzayBxdWVyaWVzIHRvIHByZXBhcmUgY29weSBvZiBpdHNlbGYuIFRoaXMgYXNzdXJlcyB0aGF0IHRyYWNraW5nIG5ldyBxdWVyaWVzIG9uIGNvbnRlbnQgbm9kZXNcbiAgICogZG9lc24ndCBtdXRhdGUgbGlzdCBvZiBxdWVyaWVzIHRyYWNrZWQgb24gYSBwYXJlbnQgbm9kZS4gV2Ugd2lsbCBjbG9uZSBMUXVlcmllcyBiZWZvcmVcbiAgICogY29uc3RydWN0aW5nIGNvbnRlbnQgcXVlcmllcy5cbiAgICovXG4gIGNsb25lKCk6IExRdWVyaWVzO1xuXG4gIC8qKlxuICAgKiBOb3RpZnkgYExRdWVyaWVzYCB0aGF0IGEgbmV3IGBUTm9kZWAgaGFzIGJlZW4gY3JlYXRlZCBhbmQgbmVlZHMgdG8gYmUgYWRkZWQgdG8gcXVlcnkgcmVzdWx0c1xuICAgKiBpZiBtYXRjaGluZyBxdWVyeSBwcmVkaWNhdGUuXG4gICAqL1xuICBhZGROb2RlKHROb2RlOiBURWxlbWVudE5vZGV8VENvbnRhaW5lck5vZGV8VEVsZW1lbnRDb250YWluZXJOb2RlKTogdm9pZDtcblxuICAvKipcbiAgICogTm90aWZ5IGBMUXVlcmllc2AgdGhhdCBhIG5ldyBgVE5vZGVgIGhhcyBiZWVuIGNyZWF0ZWQgYW5kIG5lZWRzIHRvIGJlIGFkZGVkIHRvIHF1ZXJ5IHJlc3VsdHNcbiAgICogaWYgbWF0Y2hpbmcgcXVlcnkgcHJlZGljYXRlLiBUaGlzIGlzIGEgc3BlY2lhbCBtb2RlIGludm9rZWQgaWYgdGhlIHF1ZXJ5IGNvbnRhaW5lciBoYXMgdG9cbiAgICogYmUgY3JlYXRlZCBvdXQgb2Ygb3JkZXIgKGUuZy4gdmlldyBjcmVhdGVkIGluIHRoZSBjb25zdHJ1Y3RvciBvZiBhIGRpcmVjdGl2ZSkuXG4gICAqL1xuICBpbnNlcnROb2RlQmVmb3JlVmlld3ModE5vZGU6IFRFbGVtZW50Tm9kZXxUQ29udGFpbmVyTm9kZXxURWxlbWVudENvbnRhaW5lck5vZGUpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBOb3RpZnkgYExRdWVyaWVzYCB0aGF0IGEgbmV3IExDb250YWluZXIgd2FzIGFkZGVkIHRvIGl2eSBkYXRhIHN0cnVjdHVyZXMuIEFzIGEgcmVzdWx0IHdlIG5lZWRcbiAgICogdG8gcHJlcGFyZSByb29tIGZvciB2aWV3cyB0aGF0IG1pZ2h0IGJlIGluc2VydGVkIGludG8gdGhpcyBjb250YWluZXIuXG4gICAqL1xuICBjb250YWluZXIoKTogTFF1ZXJpZXN8bnVsbDtcblxuICAvKipcbiAgICogTm90aWZ5IGBMUXVlcmllc2AgdGhhdCBhIG5ldyBgTFZpZXdgIGhhcyBiZWVuIGNyZWF0ZWQuIEFzIGEgcmVzdWx0IHdlIG5lZWQgdG8gcHJlcGFyZSByb29tXG4gICAqIGFuZCBjb2xsZWN0IG5vZGVzIHRoYXQgbWF0Y2ggcXVlcnkgcHJlZGljYXRlLlxuICAgKi9cbiAgY3JlYXRlVmlldygpOiBMUXVlcmllc3xudWxsO1xuXG4gIC8qKlxuICAgKiBOb3RpZnkgYExRdWVyaWVzYCB0aGF0IGEgbmV3IGBMVmlld2AgaGFzIGJlZW4gYWRkZWQgdG8gYExDb250YWluZXJgLiBBcyBhIHJlc3VsdCBhbGxcbiAgICogdGhlIG1hdGNoaW5nIG5vZGVzIGZyb20gdGhpcyB2aWV3IHNob3VsZCBiZSBhZGRlZCB0byBjb250YWluZXIncyBxdWVyaWVzLlxuICAgKi9cbiAgaW5zZXJ0VmlldyhuZXdWaWV3SW5kZXg6IG51bWJlcik6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIE5vdGlmeSBgTFF1ZXJpZXNgIHRoYXQgYW4gYExWaWV3YCBoYXMgYmVlbiByZW1vdmVkIGZyb20gYExDb250YWluZXJgLiBBcyBhIHJlc3VsdCBhbGxcbiAgICogdGhlIG1hdGNoaW5nIG5vZGVzIGZyb20gdGhpcyB2aWV3IHNob3VsZCBiZSByZW1vdmVkIGZyb20gY29udGFpbmVyJ3MgcXVlcmllcy5cbiAgICovXG4gIHJlbW92ZVZpZXcoKTogdm9pZDtcblxuICAvKipcbiAgICogQWRkIGFkZGl0aW9uYWwgYFF1ZXJ5TGlzdGAgdG8gdHJhY2suXG4gICAqXG4gICAqIEBwYXJhbSBxdWVyeUxpc3QgYFF1ZXJ5TGlzdGAgdG8gdXBkYXRlIHdpdGggY2hhbmdlcy5cbiAgICogQHBhcmFtIHByZWRpY2F0ZSBFaXRoZXIgYFR5cGVgIG9yIHNlbGVjdG9yIGFycmF5IG9mIFtrZXksIHZhbHVlXSBwcmVkaWNhdGVzLlxuICAgKiBAcGFyYW0gZGVzY2VuZCBJZiB0cnVlIHRoZSBxdWVyeSB3aWxsIHJlY3Vyc2l2ZWx5IGFwcGx5IHRvIHRoZSBjaGlsZHJlbi5cbiAgICogQHBhcmFtIHJlYWQgSW5kaWNhdGVzIHdoaWNoIHRva2VuIHNob3VsZCBiZSByZWFkIGZyb20gREkgZm9yIHRoaXMgcXVlcnkuXG4gICAqL1xuICB0cmFjazxUPihcbiAgICAgIHF1ZXJ5TGlzdDogUXVlcnlMaXN0PFQ+LCBwcmVkaWNhdGU6IFR5cGU8YW55PnxzdHJpbmdbXSwgZGVzY2VuZD86IGJvb2xlYW4sXG4gICAgICByZWFkPzogVHlwZTxUPik6IHZvaWQ7XG59XG5cbi8vIE5vdGU6IFRoaXMgaGFjayBpcyBuZWNlc3Nhcnkgc28gd2UgZG9uJ3QgZXJyb25lb3VzbHkgZ2V0IGEgY2lyY3VsYXIgZGVwZW5kZW5jeVxuLy8gZmFpbHVyZSBiYXNlZCBvbiB0eXBlcy5cbmV4cG9ydCBjb25zdCB1bnVzZWRWYWx1ZUV4cG9ydFRvUGxhY2F0ZUFqZCA9IDE7XG4iXX0=