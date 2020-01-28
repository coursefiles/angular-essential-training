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
import { ɵɵinject } from '../injector_compatibility';
import { getInjectableDef, getInjectorDef, ɵɵdefineInjectable, ɵɵdefineInjector } from '../interface/defs';
/**
 * A mapping of the \@angular/core API surface used in generated expressions to the actual symbols.
 *
 * This should be kept up to date with the public exports of \@angular/core.
 * @type {?}
 */
export const angularCoreDiEnv = {
    'ɵɵdefineInjectable': ɵɵdefineInjectable,
    'ɵɵdefineInjector': ɵɵdefineInjector,
    'ɵɵinject': ɵɵinject,
    'ɵɵgetFactoryOf': getFactoryOf,
};
/**
 * @template T
 * @param {?} type
 * @return {?}
 */
function getFactoryOf(type) {
    /** @type {?} */
    const typeAny = (/** @type {?} */ (type));
    /** @type {?} */
    const def = getInjectableDef(typeAny) || getInjectorDef(typeAny);
    if (!def || def.factory === undefined) {
        return null;
    }
    return def.factory;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW52aXJvbm1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9kaS9qaXQvZW52aXJvbm1lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFTQSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFDbkQsT0FBTyxFQUFDLGdCQUFnQixFQUFFLGNBQWMsRUFBRSxrQkFBa0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLG1CQUFtQixDQUFDOzs7Ozs7O0FBU3pHLE1BQU0sT0FBTyxnQkFBZ0IsR0FBK0I7SUFDMUQsb0JBQW9CLEVBQUUsa0JBQWtCO0lBQ3hDLGtCQUFrQixFQUFFLGdCQUFnQjtJQUNwQyxVQUFVLEVBQUUsUUFBUTtJQUNwQixnQkFBZ0IsRUFBRSxZQUFZO0NBQy9COzs7Ozs7QUFFRCxTQUFTLFlBQVksQ0FBSSxJQUFlOztVQUNoQyxPQUFPLEdBQUcsbUJBQUEsSUFBSSxFQUFPOztVQUNyQixHQUFHLEdBQUcsZ0JBQWdCLENBQUksT0FBTyxDQUFDLElBQUksY0FBYyxDQUFJLE9BQU8sQ0FBQztJQUN0RSxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLEtBQUssU0FBUyxFQUFFO1FBQ3JDLE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFDRCxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUM7QUFDckIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtUeXBlfSBmcm9tICcuLi8uLi9pbnRlcmZhY2UvdHlwZSc7XG5pbXBvcnQge8m1ybVpbmplY3R9IGZyb20gJy4uL2luamVjdG9yX2NvbXBhdGliaWxpdHknO1xuaW1wb3J0IHtnZXRJbmplY3RhYmxlRGVmLCBnZXRJbmplY3RvckRlZiwgybXJtWRlZmluZUluamVjdGFibGUsIMm1ybVkZWZpbmVJbmplY3Rvcn0gZnJvbSAnLi4vaW50ZXJmYWNlL2RlZnMnO1xuXG5cblxuLyoqXG4gKiBBIG1hcHBpbmcgb2YgdGhlIEBhbmd1bGFyL2NvcmUgQVBJIHN1cmZhY2UgdXNlZCBpbiBnZW5lcmF0ZWQgZXhwcmVzc2lvbnMgdG8gdGhlIGFjdHVhbCBzeW1ib2xzLlxuICpcbiAqIFRoaXMgc2hvdWxkIGJlIGtlcHQgdXAgdG8gZGF0ZSB3aXRoIHRoZSBwdWJsaWMgZXhwb3J0cyBvZiBAYW5ndWxhci9jb3JlLlxuICovXG5leHBvcnQgY29uc3QgYW5ndWxhckNvcmVEaUVudjoge1tuYW1lOiBzdHJpbmddOiBGdW5jdGlvbn0gPSB7XG4gICfJtcm1ZGVmaW5lSW5qZWN0YWJsZSc6IMm1ybVkZWZpbmVJbmplY3RhYmxlLFxuICAnybXJtWRlZmluZUluamVjdG9yJzogybXJtWRlZmluZUluamVjdG9yLFxuICAnybXJtWluamVjdCc6IMm1ybVpbmplY3QsXG4gICfJtcm1Z2V0RmFjdG9yeU9mJzogZ2V0RmFjdG9yeU9mLFxufTtcblxuZnVuY3Rpb24gZ2V0RmFjdG9yeU9mPFQ+KHR5cGU6IFR5cGU8YW55Pik6ICgodHlwZTogVHlwZTxUPnwgbnVsbCkgPT4gVCl8bnVsbCB7XG4gIGNvbnN0IHR5cGVBbnkgPSB0eXBlIGFzIGFueTtcbiAgY29uc3QgZGVmID0gZ2V0SW5qZWN0YWJsZURlZjxUPih0eXBlQW55KSB8fCBnZXRJbmplY3RvckRlZjxUPih0eXBlQW55KTtcbiAgaWYgKCFkZWYgfHwgZGVmLmZhY3RvcnkgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiBkZWYuZmFjdG9yeTtcbn1cbiJdfQ==