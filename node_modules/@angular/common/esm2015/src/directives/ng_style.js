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
import { Directive, Input, ɵɵdefineDirective, ɵɵelementHostStyling, ɵɵelementHostStylingApply, ɵɵelementHostStylingMap } from '@angular/core';
import { NgStyleImpl, NgStyleImplProvider } from './ng_style_impl';
/*
 * NgStyle (as well as NgClass) behaves differently when loaded in the VE and when not.
 *
 * If the VE is present (which is for older versions of Angular) then NgStyle will inject
 * the legacy diffing algorithm as a service and delegate all styling changes to that.
 *
 * If the VE is not present then NgStyle will normalize (through the injected service) and
 * then write all styling changes to the `[style]` binding directly (through a host binding).
 * Then Angular will notice the host binding change and treat the changes as styling
 * changes and apply them via the core styling instructions that exist within Angular.
 */
// used when the VE is present
/** @type {?} */
export const ngStyleDirectiveDef__PRE_R3__ = undefined;
// used when the VE is not present (note the directive will
// never be instantiated normally because it is apart of a
// base class)
const ɵ0 = /**
 * @return {?}
 */
function () { }, ɵ1 = /**
 * @return {?}
 */
() => { }, ɵ2 = /**
 * @param {?} rf
 * @param {?} ctx
 * @param {?} elIndex
 * @return {?}
 */
function (rf, ctx, elIndex) {
    if (rf & 1 /* Create */) {
        ɵɵelementHostStyling();
    }
    if (rf & 2 /* Update */) {
        ɵɵelementHostStylingMap(null, ctx.getValue());
        ɵɵelementHostStylingApply();
    }
};
/** @type {?} */
export const ngStyleDirectiveDef__POST_R3__ = ɵɵdefineDirective({
    type: (/** @type {?} */ ((ɵ0))),
    selectors: (/** @type {?} */ (null)),
    factory: (ɵ1),
    hostBindings: (ɵ2)
});
/** @type {?} */
export const ngStyleDirectiveDef = ngStyleDirectiveDef__PRE_R3__;
/**
 * Serves as the base non-VE container for NgStyle.
 *
 * While this is a base class that NgStyle extends from, the
 * class itself acts as a container for non-VE code to setup
 * a link to the `[style]` host binding (via the static
 * `ngDirectiveDef` property on the class).
 *
 * Note that the `ngDirectiveDef` property's code is switched
 * depending if VE is present or not (this allows for the
 * binding code to be set only for newer versions of Angular).
 *
 * \@publicApi
 */
export class NgStyleBase {
    /**
     * @param {?} _delegate
     */
    constructor(_delegate) {
        this._delegate = _delegate;
    }
    /**
     * @return {?}
     */
    getValue() { return this._delegate.getValue(); }
}
/** @nocollapse */ NgStyleBase.ngDirectiveDef = ngStyleDirectiveDef;
if (false) {
    /** @nocollapse @type {?} */
    NgStyleBase.ngDirectiveDef;
    /**
     * @type {?}
     * @protected
     */
    NgStyleBase.prototype._delegate;
}
/**
 * \@ngModule CommonModule
 *
 * \@usageNotes
 *
 * Set the font of the containing element to the result of an expression.
 *
 * ```
 * <some-element [ngStyle]="{'font-style': styleExp}">...</some-element>
 * ```
 *
 * Set the width of the containing element to a pixel value returned by an expression.
 *
 * ```
 * <some-element [ngStyle]="{'max-width.px': widthExp}">...</some-element>
 * ```
 *
 * Set a collection of style values using an expression that returns key-value pairs.
 *
 * ```
 * <some-element [ngStyle]="objExp">...</some-element>
 * ```
 *
 * \@description
 *
 * An attribute directive that updates styles for the containing HTML element.
 * Sets one or more style properties, specified as colon-separated key-value pairs.
 * The key is a style name, with an optional `.<unit>` suffix
 * (such as 'top.px', 'font-style.em').
 * The value is an expression to be evaluated.
 * The resulting non-null value, expressed in the given unit,
 * is assigned to the given style property.
 * If the result of evaluation is null, the corresponding style is removed.
 *
 * \@publicApi
 */
export class NgStyle extends NgStyleBase {
    /**
     * @param {?} delegate
     */
    constructor(delegate) { super(delegate); }
    /**
     * @param {?} value
     * @return {?}
     */
    set ngStyle(value) { this._delegate.setNgStyle(value); }
    /**
     * @return {?}
     */
    ngDoCheck() { this._delegate.applyChanges(); }
}
NgStyle.decorators = [
    { type: Directive, args: [{ selector: '[ngStyle]', providers: [NgStyleImplProvider] },] }
];
/** @nocollapse */
NgStyle.ctorParameters = () => [
    { type: NgStyleImpl }
];
NgStyle.propDecorators = {
    ngStyle: [{ type: Input, args: ['ngStyle',] }]
};
export { ɵ0, ɵ1, ɵ2 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfc3R5bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vc3JjL2RpcmVjdGl2ZXMvbmdfc3R5bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFPQSxPQUFPLEVBQUMsU0FBUyxFQUFXLEtBQUssRUFBZ0IsaUJBQWlCLEVBQUUsb0JBQW9CLEVBQUUseUJBQXlCLEVBQUUsdUJBQXVCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFbkssT0FBTyxFQUFDLFdBQVcsRUFBRSxtQkFBbUIsRUFBQyxNQUFNLGlCQUFpQixDQUFDOzs7Ozs7Ozs7Ozs7OztBQWlCakUsTUFBTSxPQUFPLDZCQUE2QixHQUFHLFNBQVM7Ozs7Ozs7QUFNOUMsY0FBWSxDQUFDOzs7QUFFVixHQUFHLEVBQUUsR0FBRSxDQUFDOzs7Ozs7QUFDSCxVQUFTLEVBQWdCLEVBQUUsR0FBUSxFQUFFLE9BQWU7SUFDaEUsSUFBSSxFQUFFLGlCQUFzQixFQUFFO1FBQzVCLG9CQUFvQixFQUFFLENBQUM7S0FDeEI7SUFDRCxJQUFJLEVBQUUsaUJBQXNCLEVBQUU7UUFDNUIsdUJBQXVCLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQzlDLHlCQUF5QixFQUFFLENBQUM7S0FDN0I7QUFDSCxDQUFDOztBQVpILE1BQU0sT0FBTyw4QkFBOEIsR0FBRyxpQkFBaUIsQ0FBQztJQUM5RCxJQUFJLEVBQUUseUJBQW9CO0lBQzFCLFNBQVMsRUFBRSxtQkFBQSxJQUFJLEVBQU87SUFDdEIsT0FBTyxNQUFVO0lBQ2pCLFlBQVksTUFRWDtDQUNGLENBQUM7O0FBRUYsTUFBTSxPQUFPLG1CQUFtQixHQUFHLDZCQUE2Qjs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JoRSxNQUFNLE9BQU8sV0FBVzs7OztJQUd0QixZQUFzQixTQUFzQjtRQUF0QixjQUFTLEdBQVQsU0FBUyxDQUFhO0lBQUcsQ0FBQzs7OztJQUVoRCxRQUFRLEtBQUssT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFKekMsMEJBQWMsR0FBUSxtQkFBbUIsQ0FBQzs7O0lBQWpELDJCQUFpRDs7Ozs7SUFFckMsZ0NBQWdDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBDOUMsTUFBTSxPQUFPLE9BQVEsU0FBUSxXQUFXOzs7O0lBQ3RDLFlBQVksUUFBcUIsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7OztJQUV2RCxJQUNJLE9BQU8sQ0FBQyxLQUFrQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzs7OztJQUVyRixTQUFTLEtBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUM7OztZQVAvQyxTQUFTLFNBQUMsRUFBQyxRQUFRLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxDQUFDLG1CQUFtQixDQUFDLEVBQUM7Ozs7WUFqRzVELFdBQVc7OztzQkFxR2hCLEtBQUssU0FBQyxTQUFTIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtEaXJlY3RpdmUsIERvQ2hlY2ssIElucHV0LCDJtVJlbmRlckZsYWdzLCDJtcm1ZGVmaW5lRGlyZWN0aXZlLCDJtcm1ZWxlbWVudEhvc3RTdHlsaW5nLCDJtcm1ZWxlbWVudEhvc3RTdHlsaW5nQXBwbHksIMm1ybVlbGVtZW50SG9zdFN0eWxpbmdNYXB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge05nU3R5bGVJbXBsLCBOZ1N0eWxlSW1wbFByb3ZpZGVyfSBmcm9tICcuL25nX3N0eWxlX2ltcGwnO1xuXG5cblxuLypcbiAqIE5nU3R5bGUgKGFzIHdlbGwgYXMgTmdDbGFzcykgYmVoYXZlcyBkaWZmZXJlbnRseSB3aGVuIGxvYWRlZCBpbiB0aGUgVkUgYW5kIHdoZW4gbm90LlxuICpcbiAqIElmIHRoZSBWRSBpcyBwcmVzZW50ICh3aGljaCBpcyBmb3Igb2xkZXIgdmVyc2lvbnMgb2YgQW5ndWxhcikgdGhlbiBOZ1N0eWxlIHdpbGwgaW5qZWN0XG4gKiB0aGUgbGVnYWN5IGRpZmZpbmcgYWxnb3JpdGhtIGFzIGEgc2VydmljZSBhbmQgZGVsZWdhdGUgYWxsIHN0eWxpbmcgY2hhbmdlcyB0byB0aGF0LlxuICpcbiAqIElmIHRoZSBWRSBpcyBub3QgcHJlc2VudCB0aGVuIE5nU3R5bGUgd2lsbCBub3JtYWxpemUgKHRocm91Z2ggdGhlIGluamVjdGVkIHNlcnZpY2UpIGFuZFxuICogdGhlbiB3cml0ZSBhbGwgc3R5bGluZyBjaGFuZ2VzIHRvIHRoZSBgW3N0eWxlXWAgYmluZGluZyBkaXJlY3RseSAodGhyb3VnaCBhIGhvc3QgYmluZGluZykuXG4gKiBUaGVuIEFuZ3VsYXIgd2lsbCBub3RpY2UgdGhlIGhvc3QgYmluZGluZyBjaGFuZ2UgYW5kIHRyZWF0IHRoZSBjaGFuZ2VzIGFzIHN0eWxpbmdcbiAqIGNoYW5nZXMgYW5kIGFwcGx5IHRoZW0gdmlhIHRoZSBjb3JlIHN0eWxpbmcgaW5zdHJ1Y3Rpb25zIHRoYXQgZXhpc3Qgd2l0aGluIEFuZ3VsYXIuXG4gKi9cblxuLy8gdXNlZCB3aGVuIHRoZSBWRSBpcyBwcmVzZW50XG5leHBvcnQgY29uc3QgbmdTdHlsZURpcmVjdGl2ZURlZl9fUFJFX1IzX18gPSB1bmRlZmluZWQ7XG5cbi8vIHVzZWQgd2hlbiB0aGUgVkUgaXMgbm90IHByZXNlbnQgKG5vdGUgdGhlIGRpcmVjdGl2ZSB3aWxsXG4vLyBuZXZlciBiZSBpbnN0YW50aWF0ZWQgbm9ybWFsbHkgYmVjYXVzZSBpdCBpcyBhcGFydCBvZiBhXG4vLyBiYXNlIGNsYXNzKVxuZXhwb3J0IGNvbnN0IG5nU3R5bGVEaXJlY3RpdmVEZWZfX1BPU1RfUjNfXyA9IMm1ybVkZWZpbmVEaXJlY3RpdmUoe1xuICB0eXBlOiBmdW5jdGlvbigpIHt9IGFzIGFueSxcbiAgc2VsZWN0b3JzOiBudWxsIGFzIGFueSxcbiAgZmFjdG9yeTogKCkgPT4ge30sXG4gIGhvc3RCaW5kaW5nczogZnVuY3Rpb24ocmY6IMm1UmVuZGVyRmxhZ3MsIGN0eDogYW55LCBlbEluZGV4OiBudW1iZXIpIHtcbiAgICBpZiAocmYgJiDJtVJlbmRlckZsYWdzLkNyZWF0ZSkge1xuICAgICAgybXJtWVsZW1lbnRIb3N0U3R5bGluZygpO1xuICAgIH1cbiAgICBpZiAocmYgJiDJtVJlbmRlckZsYWdzLlVwZGF0ZSkge1xuICAgICAgybXJtWVsZW1lbnRIb3N0U3R5bGluZ01hcChudWxsLCBjdHguZ2V0VmFsdWUoKSk7XG4gICAgICDJtcm1ZWxlbWVudEhvc3RTdHlsaW5nQXBwbHkoKTtcbiAgICB9XG4gIH1cbn0pO1xuXG5leHBvcnQgY29uc3QgbmdTdHlsZURpcmVjdGl2ZURlZiA9IG5nU3R5bGVEaXJlY3RpdmVEZWZfX1BSRV9SM19fO1xuXG4vKipcbiAqIFNlcnZlcyBhcyB0aGUgYmFzZSBub24tVkUgY29udGFpbmVyIGZvciBOZ1N0eWxlLlxuICpcbiAqIFdoaWxlIHRoaXMgaXMgYSBiYXNlIGNsYXNzIHRoYXQgTmdTdHlsZSBleHRlbmRzIGZyb20sIHRoZVxuICogY2xhc3MgaXRzZWxmIGFjdHMgYXMgYSBjb250YWluZXIgZm9yIG5vbi1WRSBjb2RlIHRvIHNldHVwXG4gKiBhIGxpbmsgdG8gdGhlIGBbc3R5bGVdYCBob3N0IGJpbmRpbmcgKHZpYSB0aGUgc3RhdGljXG4gKiBgbmdEaXJlY3RpdmVEZWZgIHByb3BlcnR5IG9uIHRoZSBjbGFzcykuXG4gKlxuICogTm90ZSB0aGF0IHRoZSBgbmdEaXJlY3RpdmVEZWZgIHByb3BlcnR5J3MgY29kZSBpcyBzd2l0Y2hlZFxuICogZGVwZW5kaW5nIGlmIFZFIGlzIHByZXNlbnQgb3Igbm90ICh0aGlzIGFsbG93cyBmb3IgdGhlXG4gKiBiaW5kaW5nIGNvZGUgdG8gYmUgc2V0IG9ubHkgZm9yIG5ld2VyIHZlcnNpb25zIG9mIEFuZ3VsYXIpLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNsYXNzIE5nU3R5bGVCYXNlIHtcbiAgc3RhdGljIG5nRGlyZWN0aXZlRGVmOiBhbnkgPSBuZ1N0eWxlRGlyZWN0aXZlRGVmO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBfZGVsZWdhdGU6IE5nU3R5bGVJbXBsKSB7fVxuXG4gIGdldFZhbHVlKCkgeyByZXR1cm4gdGhpcy5fZGVsZWdhdGUuZ2V0VmFsdWUoKTsgfVxufVxuXG4vKipcbiAqIEBuZ01vZHVsZSBDb21tb25Nb2R1bGVcbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqIFNldCB0aGUgZm9udCBvZiB0aGUgY29udGFpbmluZyBlbGVtZW50IHRvIHRoZSByZXN1bHQgb2YgYW4gZXhwcmVzc2lvbi5cbiAqXG4gKiBgYGBcbiAqIDxzb21lLWVsZW1lbnQgW25nU3R5bGVdPVwieydmb250LXN0eWxlJzogc3R5bGVFeHB9XCI+Li4uPC9zb21lLWVsZW1lbnQ+XG4gKiBgYGBcbiAqXG4gKiBTZXQgdGhlIHdpZHRoIG9mIHRoZSBjb250YWluaW5nIGVsZW1lbnQgdG8gYSBwaXhlbCB2YWx1ZSByZXR1cm5lZCBieSBhbiBleHByZXNzaW9uLlxuICpcbiAqIGBgYFxuICogPHNvbWUtZWxlbWVudCBbbmdTdHlsZV09XCJ7J21heC13aWR0aC5weCc6IHdpZHRoRXhwfVwiPi4uLjwvc29tZS1lbGVtZW50PlxuICogYGBgXG4gKlxuICogU2V0IGEgY29sbGVjdGlvbiBvZiBzdHlsZSB2YWx1ZXMgdXNpbmcgYW4gZXhwcmVzc2lvbiB0aGF0IHJldHVybnMga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIGBgYFxuICogPHNvbWUtZWxlbWVudCBbbmdTdHlsZV09XCJvYmpFeHBcIj4uLi48L3NvbWUtZWxlbWVudD5cbiAqIGBgYFxuICpcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqIEFuIGF0dHJpYnV0ZSBkaXJlY3RpdmUgdGhhdCB1cGRhdGVzIHN0eWxlcyBmb3IgdGhlIGNvbnRhaW5pbmcgSFRNTCBlbGVtZW50LlxuICogU2V0cyBvbmUgb3IgbW9yZSBzdHlsZSBwcm9wZXJ0aWVzLCBzcGVjaWZpZWQgYXMgY29sb24tc2VwYXJhdGVkIGtleS12YWx1ZSBwYWlycy5cbiAqIFRoZSBrZXkgaXMgYSBzdHlsZSBuYW1lLCB3aXRoIGFuIG9wdGlvbmFsIGAuPHVuaXQ+YCBzdWZmaXhcbiAqIChzdWNoIGFzICd0b3AucHgnLCAnZm9udC1zdHlsZS5lbScpLlxuICogVGhlIHZhbHVlIGlzIGFuIGV4cHJlc3Npb24gdG8gYmUgZXZhbHVhdGVkLlxuICogVGhlIHJlc3VsdGluZyBub24tbnVsbCB2YWx1ZSwgZXhwcmVzc2VkIGluIHRoZSBnaXZlbiB1bml0LFxuICogaXMgYXNzaWduZWQgdG8gdGhlIGdpdmVuIHN0eWxlIHByb3BlcnR5LlxuICogSWYgdGhlIHJlc3VsdCBvZiBldmFsdWF0aW9uIGlzIG51bGwsIHRoZSBjb3JyZXNwb25kaW5nIHN0eWxlIGlzIHJlbW92ZWQuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ1tuZ1N0eWxlXScsIHByb3ZpZGVyczogW05nU3R5bGVJbXBsUHJvdmlkZXJdfSlcbmV4cG9ydCBjbGFzcyBOZ1N0eWxlIGV4dGVuZHMgTmdTdHlsZUJhc2UgaW1wbGVtZW50cyBEb0NoZWNrIHtcbiAgY29uc3RydWN0b3IoZGVsZWdhdGU6IE5nU3R5bGVJbXBsKSB7IHN1cGVyKGRlbGVnYXRlKTsgfVxuXG4gIEBJbnB1dCgnbmdTdHlsZScpXG4gIHNldCBuZ1N0eWxlKHZhbHVlOiB7W2tsYXNzOiBzdHJpbmddOiBhbnl9fG51bGwpIHsgdGhpcy5fZGVsZWdhdGUuc2V0TmdTdHlsZSh2YWx1ZSk7IH1cblxuICBuZ0RvQ2hlY2soKSB7IHRoaXMuX2RlbGVnYXRlLmFwcGx5Q2hhbmdlcygpOyB9XG59XG4iXX0=