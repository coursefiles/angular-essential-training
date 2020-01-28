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
 * \@publicApi
 * @abstract
 */
export class AnimationStyleNormalizer {
}
if (false) {
    /**
     * @abstract
     * @param {?} propertyName
     * @param {?} errors
     * @return {?}
     */
    AnimationStyleNormalizer.prototype.normalizePropertyName = function (propertyName, errors) { };
    /**
     * @abstract
     * @param {?} userProvidedProperty
     * @param {?} normalizedProperty
     * @param {?} value
     * @param {?} errors
     * @return {?}
     */
    AnimationStyleNormalizer.prototype.normalizeStyleValue = function (userProvidedProperty, normalizedProperty, value, errors) { };
}
/**
 * \@publicApi
 */
export class NoopAnimationStyleNormalizer {
    /**
     * @param {?} propertyName
     * @param {?} errors
     * @return {?}
     */
    normalizePropertyName(propertyName, errors) { return propertyName; }
    /**
     * @param {?} userProvidedProperty
     * @param {?} normalizedProperty
     * @param {?} value
     * @param {?} errors
     * @return {?}
     */
    normalizeStyleValue(userProvidedProperty, normalizedProperty, value, errors) {
        return (/** @type {?} */ (value));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX3N0eWxlX25vcm1hbGl6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9hbmltYXRpb25zL2Jyb3dzZXIvc3JjL2RzbC9zdHlsZV9ub3JtYWxpemF0aW9uL2FuaW1hdGlvbl9zdHlsZV9ub3JtYWxpemVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQVdBLE1BQU0sT0FBZ0Isd0JBQXdCO0NBSzdDOzs7Ozs7OztJQUpDLCtGQUErRTs7Ozs7Ozs7O0lBQy9FLGdJQUU4Qjs7Ozs7QUFNaEMsTUFBTSxPQUFPLDRCQUE0Qjs7Ozs7O0lBQ3ZDLHFCQUFxQixDQUFDLFlBQW9CLEVBQUUsTUFBZ0IsSUFBWSxPQUFPLFlBQVksQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7O0lBRTlGLG1CQUFtQixDQUNmLG9CQUE0QixFQUFFLGtCQUEwQixFQUFFLEtBQW9CLEVBQzlFLE1BQWdCO1FBQ2xCLE9BQU8sbUJBQUssS0FBSyxFQUFBLENBQUM7SUFDcEIsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vKipcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFuaW1hdGlvblN0eWxlTm9ybWFsaXplciB7XG4gIGFic3RyYWN0IG5vcm1hbGl6ZVByb3BlcnR5TmFtZShwcm9wZXJ0eU5hbWU6IHN0cmluZywgZXJyb3JzOiBzdHJpbmdbXSk6IHN0cmluZztcbiAgYWJzdHJhY3Qgbm9ybWFsaXplU3R5bGVWYWx1ZShcbiAgICAgIHVzZXJQcm92aWRlZFByb3BlcnR5OiBzdHJpbmcsIG5vcm1hbGl6ZWRQcm9wZXJ0eTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nfG51bWJlcixcbiAgICAgIGVycm9yczogc3RyaW5nW10pOiBzdHJpbmc7XG59XG5cbi8qKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgY2xhc3MgTm9vcEFuaW1hdGlvblN0eWxlTm9ybWFsaXplciB7XG4gIG5vcm1hbGl6ZVByb3BlcnR5TmFtZShwcm9wZXJ0eU5hbWU6IHN0cmluZywgZXJyb3JzOiBzdHJpbmdbXSk6IHN0cmluZyB7IHJldHVybiBwcm9wZXJ0eU5hbWU7IH1cblxuICBub3JtYWxpemVTdHlsZVZhbHVlKFxuICAgICAgdXNlclByb3ZpZGVkUHJvcGVydHk6IHN0cmluZywgbm9ybWFsaXplZFByb3BlcnR5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmd8bnVtYmVyLFxuICAgICAgZXJyb3JzOiBzdHJpbmdbXSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIDxhbnk+dmFsdWU7XG4gIH1cbn1cbiJdfQ==