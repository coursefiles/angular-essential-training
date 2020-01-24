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
import { dashCaseToCamelCase } from '../../util';
import { AnimationStyleNormalizer } from './animation_style_normalizer';
export class WebAnimationsStyleNormalizer extends AnimationStyleNormalizer {
    /**
     * @param {?} propertyName
     * @param {?} errors
     * @return {?}
     */
    normalizePropertyName(propertyName, errors) {
        return dashCaseToCamelCase(propertyName);
    }
    /**
     * @param {?} userProvidedProperty
     * @param {?} normalizedProperty
     * @param {?} value
     * @param {?} errors
     * @return {?}
     */
    normalizeStyleValue(userProvidedProperty, normalizedProperty, value, errors) {
        /** @type {?} */
        let unit = '';
        /** @type {?} */
        const strVal = value.toString().trim();
        if (DIMENSIONAL_PROP_MAP[normalizedProperty] && value !== 0 && value !== '0') {
            if (typeof value === 'number') {
                unit = 'px';
            }
            else {
                /** @type {?} */
                const valAndSuffixMatch = value.match(/^[+-]?[\d\.]+([a-z]*)$/);
                if (valAndSuffixMatch && valAndSuffixMatch[1].length == 0) {
                    errors.push(`Please provide a CSS unit value for ${userProvidedProperty}:${value}`);
                }
            }
        }
        return strVal + unit;
    }
}
const ɵ0 = /**
 * @return {?}
 */
() => makeBooleanMap('width,height,minWidth,minHeight,maxWidth,maxHeight,left,top,bottom,right,fontSize,outlineWidth,outlineOffset,paddingTop,paddingLeft,paddingBottom,paddingRight,marginTop,marginLeft,marginBottom,marginRight,borderRadius,borderWidth,borderTopWidth,borderLeftWidth,borderRightWidth,borderBottomWidth,textIndent,perspective'
    .split(','));
/** @type {?} */
const DIMENSIONAL_PROP_MAP = ((ɵ0))();
/**
 * @param {?} keys
 * @return {?}
 */
function makeBooleanMap(keys) {
    /** @type {?} */
    const map = {};
    keys.forEach((/**
     * @param {?} key
     * @return {?}
     */
    key => map[key] = true));
    return map;
}
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViX2FuaW1hdGlvbnNfc3R5bGVfbm9ybWFsaXplci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2FuaW1hdGlvbnMvYnJvd3Nlci9zcmMvZHNsL3N0eWxlX25vcm1hbGl6YXRpb24vd2ViX2FuaW1hdGlvbnNfc3R5bGVfbm9ybWFsaXplci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQU9BLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUUvQyxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSw4QkFBOEIsQ0FBQztBQUV0RSxNQUFNLE9BQU8sNEJBQTZCLFNBQVEsd0JBQXdCOzs7Ozs7SUFDeEUscUJBQXFCLENBQUMsWUFBb0IsRUFBRSxNQUFnQjtRQUMxRCxPQUFPLG1CQUFtQixDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzNDLENBQUM7Ozs7Ozs7O0lBRUQsbUJBQW1CLENBQ2Ysb0JBQTRCLEVBQUUsa0JBQTBCLEVBQUUsS0FBb0IsRUFDOUUsTUFBZ0I7O1lBQ2QsSUFBSSxHQUFXLEVBQUU7O2NBQ2YsTUFBTSxHQUFHLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLEVBQUU7UUFFdEMsSUFBSSxvQkFBb0IsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLElBQUksS0FBSyxLQUFLLEdBQUcsRUFBRTtZQUM1RSxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtnQkFDN0IsSUFBSSxHQUFHLElBQUksQ0FBQzthQUNiO2lCQUFNOztzQkFDQyxpQkFBaUIsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDO2dCQUMvRCxJQUFJLGlCQUFpQixJQUFJLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7b0JBQ3pELE1BQU0sQ0FBQyxJQUFJLENBQUMsdUNBQXVDLG9CQUFvQixJQUFJLEtBQUssRUFBRSxDQUFDLENBQUM7aUJBQ3JGO2FBQ0Y7U0FDRjtRQUNELE9BQU8sTUFBTSxHQUFHLElBQUksQ0FBQztJQUN2QixDQUFDO0NBQ0Y7Ozs7QUFHSSxHQUFHLEVBQUUsQ0FBQyxjQUFjLENBQ2hCLGdVQUFnVTtLQUMzVCxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7O01BSG5CLG9CQUFvQixHQUN0QixNQUVzQixFQUFFOzs7OztBQUU1QixTQUFTLGNBQWMsQ0FBQyxJQUFjOztVQUM5QixHQUFHLEdBQTZCLEVBQUU7SUFDeEMsSUFBSSxDQUFDLE9BQU87Ozs7SUFBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLEVBQUMsQ0FBQztJQUNyQyxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge2Rhc2hDYXNlVG9DYW1lbENhc2V9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5pbXBvcnQge0FuaW1hdGlvblN0eWxlTm9ybWFsaXplcn0gZnJvbSAnLi9hbmltYXRpb25fc3R5bGVfbm9ybWFsaXplcic7XG5cbmV4cG9ydCBjbGFzcyBXZWJBbmltYXRpb25zU3R5bGVOb3JtYWxpemVyIGV4dGVuZHMgQW5pbWF0aW9uU3R5bGVOb3JtYWxpemVyIHtcbiAgbm9ybWFsaXplUHJvcGVydHlOYW1lKHByb3BlcnR5TmFtZTogc3RyaW5nLCBlcnJvcnM6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgICByZXR1cm4gZGFzaENhc2VUb0NhbWVsQ2FzZShwcm9wZXJ0eU5hbWUpO1xuICB9XG5cbiAgbm9ybWFsaXplU3R5bGVWYWx1ZShcbiAgICAgIHVzZXJQcm92aWRlZFByb3BlcnR5OiBzdHJpbmcsIG5vcm1hbGl6ZWRQcm9wZXJ0eTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nfG51bWJlcixcbiAgICAgIGVycm9yczogc3RyaW5nW10pOiBzdHJpbmcge1xuICAgIGxldCB1bml0OiBzdHJpbmcgPSAnJztcbiAgICBjb25zdCBzdHJWYWwgPSB2YWx1ZS50b1N0cmluZygpLnRyaW0oKTtcblxuICAgIGlmIChESU1FTlNJT05BTF9QUk9QX01BUFtub3JtYWxpemVkUHJvcGVydHldICYmIHZhbHVlICE9PSAwICYmIHZhbHVlICE9PSAnMCcpIHtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICAgIHVuaXQgPSAncHgnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgdmFsQW5kU3VmZml4TWF0Y2ggPSB2YWx1ZS5tYXRjaCgvXlsrLV0/W1xcZFxcLl0rKFthLXpdKikkLyk7XG4gICAgICAgIGlmICh2YWxBbmRTdWZmaXhNYXRjaCAmJiB2YWxBbmRTdWZmaXhNYXRjaFsxXS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgIGVycm9ycy5wdXNoKGBQbGVhc2UgcHJvdmlkZSBhIENTUyB1bml0IHZhbHVlIGZvciAke3VzZXJQcm92aWRlZFByb3BlcnR5fToke3ZhbHVlfWApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzdHJWYWwgKyB1bml0O1xuICB9XG59XG5cbmNvbnN0IERJTUVOU0lPTkFMX1BST1BfTUFQID1cbiAgICAoKCkgPT4gbWFrZUJvb2xlYW5NYXAoXG4gICAgICAgICAnd2lkdGgsaGVpZ2h0LG1pbldpZHRoLG1pbkhlaWdodCxtYXhXaWR0aCxtYXhIZWlnaHQsbGVmdCx0b3AsYm90dG9tLHJpZ2h0LGZvbnRTaXplLG91dGxpbmVXaWR0aCxvdXRsaW5lT2Zmc2V0LHBhZGRpbmdUb3AscGFkZGluZ0xlZnQscGFkZGluZ0JvdHRvbSxwYWRkaW5nUmlnaHQsbWFyZ2luVG9wLG1hcmdpbkxlZnQsbWFyZ2luQm90dG9tLG1hcmdpblJpZ2h0LGJvcmRlclJhZGl1cyxib3JkZXJXaWR0aCxib3JkZXJUb3BXaWR0aCxib3JkZXJMZWZ0V2lkdGgsYm9yZGVyUmlnaHRXaWR0aCxib3JkZXJCb3R0b21XaWR0aCx0ZXh0SW5kZW50LHBlcnNwZWN0aXZlJ1xuICAgICAgICAgICAgIC5zcGxpdCgnLCcpKSkoKTtcblxuZnVuY3Rpb24gbWFrZUJvb2xlYW5NYXAoa2V5czogc3RyaW5nW10pOiB7W2tleTogc3RyaW5nXTogYm9vbGVhbn0ge1xuICBjb25zdCBtYXA6IHtba2V5OiBzdHJpbmddOiBib29sZWFufSA9IHt9O1xuICBrZXlzLmZvckVhY2goa2V5ID0+IG1hcFtrZXldID0gdHJ1ZSk7XG4gIHJldHVybiBtYXA7XG59XG4iXX0=