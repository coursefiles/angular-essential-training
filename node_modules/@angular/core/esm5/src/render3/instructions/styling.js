import { assertEqual } from '../../util/assert';
import { FLAGS, HEADER_OFFSET, RENDERER } from '../interfaces/view';
import { getActiveDirectiveId, getActiveDirectiveSuperClassDepth, getLView, getPreviousOrParentTNode, getSelectedIndex } from '../state';
import { getInitialClassNameValue, renderStyling, updateClassProp as updateElementClassProp, updateContextWithBindings, updateStyleProp as updateElementStyleProp, updateStylingMap } from '../styling/class_and_style_bindings';
import { enqueueHostInstruction, registerHostDirective } from '../styling/host_instructions_queue';
import { BoundPlayerFactory } from '../styling/player_factory';
import { DEFAULT_TEMPLATE_DIRECTIVE_INDEX } from '../styling/shared';
import { getCachedStylingContext, setCachedStylingContext } from '../styling/state';
import { allocateOrUpdateDirectiveIntoContext, createEmptyStylingContext, forceClassesAsString, forceStylesAsString, getStylingContextFromLView, hasClassInput, hasStyleInput } from '../styling/util';
import { NO_CHANGE } from '../tokens';
import { renderStringify } from '../util/misc_utils';
import { getRootContext } from '../util/view_traversal_utils';
import { getTNode } from '../util/view_utils';
import { scheduleTick, setInputsForProperty } from './shared';
/*
 * The contents of this file include the instructions for all styling-related
 * operations in Angular.
 *
 * The instructions present in this file are:
 *
 * Template level styling instructions:
 * - elementStyling
 * - elementStylingMap
 * - elementStyleProp
 * - elementClassProp
 * - elementStylingApply
 *
 * Host bindings level styling instructions:
 * - elementHostStyling
 * - elementHostStylingMap
 * - elementHostStyleProp
 * - elementHostClassProp
 * - elementHostStylingApply
 */
/**
 * Allocates style and class binding properties on the element during creation mode.
 *
 * This instruction is meant to be called during creation mode to register all
 * dynamic style and class bindings on the element. Note that this is only used
 * for binding values (see `elementStart` to learn how to assign static styling
 * values to an element).
 *
 * @param classBindingNames An array containing bindable class names.
 *        The `elementClassProp` instruction refers to the class name by index in
 *        this array (i.e. `['foo', 'bar']` means `foo=0` and `bar=1`).
 * @param styleBindingNames An array containing bindable style properties.
 *        The `elementStyleProp` instruction refers to the class name by index in
 *        this array (i.e. `['width', 'height']` means `width=0` and `height=1`).
 * @param styleSanitizer An optional sanitizer function that will be used to sanitize any CSS
 *        style values that are applied to the element (during rendering).
 *
 * @codeGenApi
 */
export function ɵɵelementStyling(classBindingNames, styleBindingNames, styleSanitizer) {
    var tNode = getPreviousOrParentTNode();
    if (!tNode.stylingTemplate) {
        tNode.stylingTemplate = createEmptyStylingContext();
    }
    // calling the function below ensures that the template's binding values
    // are applied as the first set of bindings into the context. If any other
    // styling bindings are set on the same element (by directives and/or
    // components) then they will be applied at the end of the `elementEnd`
    // instruction (because directives are created first before styling is
    // executed for a new element).
    initElementStyling(tNode, classBindingNames, styleBindingNames, styleSanitizer, DEFAULT_TEMPLATE_DIRECTIVE_INDEX);
}
/**
 * Allocates style and class binding properties on the host element during creation mode
 * within the host bindings function of a directive or component.
 *
 * This instruction is meant to be called during creation mode to register all
 * dynamic style and class host bindings on the host element of a directive or
 * component. Note that this is only used for binding values (see `elementHostAttrs`
 * to learn how to assign static styling values to the host element).
 *
 * @param classBindingNames An array containing bindable class names.
 *        The `elementHostClassProp` instruction refers to the class name by index in
 *        this array (i.e. `['foo', 'bar']` means `foo=0` and `bar=1`).
 * @param styleBindingNames An array containing bindable style properties.
 *        The `elementHostStyleProp` instruction refers to the class name by index in
 *        this array (i.e. `['width', 'height']` means `width=0` and `height=1`).
 * @param styleSanitizer An optional sanitizer function that will be used to sanitize any CSS
 *        style values that are applied to the element (during rendering).
 *        Note that the sanitizer instance itself is tied to the provided `directive` and
 *        will not be used if the same property is assigned in another directive or
 *        on the element directly.
 *
 * @codeGenApi
 */
export function ɵɵelementHostStyling(classBindingNames, styleBindingNames, styleSanitizer) {
    var tNode = getPreviousOrParentTNode();
    if (!tNode.stylingTemplate) {
        tNode.stylingTemplate = createEmptyStylingContext();
    }
    var directiveStylingIndex = getActiveDirectiveStylingIndex();
    // despite the binding being applied in a queue (below), the allocation
    // of the directive into the context happens right away. The reason for
    // this is to retain the ordering of the directives (which is important
    // for the prioritization of bindings).
    allocateOrUpdateDirectiveIntoContext(tNode.stylingTemplate, directiveStylingIndex);
    var fns = tNode.onElementCreationFns = tNode.onElementCreationFns || [];
    fns.push(function () {
        initElementStyling(tNode, classBindingNames, styleBindingNames, styleSanitizer, directiveStylingIndex);
        registerHostDirective(tNode.stylingTemplate, directiveStylingIndex);
    });
}
function initElementStyling(tNode, classBindingNames, styleBindingNames, styleSanitizer, directiveStylingIndex) {
    updateContextWithBindings(tNode.stylingTemplate, directiveStylingIndex, classBindingNames, styleBindingNames, styleSanitizer);
}
/**
 * Update a style binding on an element with the provided value.
 *
 * If the style value is falsy then it will be removed from the element
 * (or assigned a different value depending if there are any styles placed
 * on the element with `elementStylingMap` or any static styles that are
 * present from when the element was created with `elementStyling`).
 *
 * Note that the styling element is updated as part of `elementStylingApply`.
 *
 * @param index Index of the element's with which styling is associated.
 * @param styleIndex Index of style to update. This index value refers to the
 *        index of the style in the style bindings array that was passed into
 *        `elementStyling`.
 * @param value New value to write (falsy to remove). Note that if a directive also
 *        attempts to write to the same binding value (via `elementHostStyleProp`)
 *        then it will only be able to do so if the binding value assigned via
 *        `elementStyleProp` is falsy (or doesn't exist at all).
 * @param suffix Optional suffix. Used with scalar values to add unit such as `px`.
 *        Note that when a suffix is provided then the underlying sanitizer will
 *        be ignored.
 * @param forceOverride Whether or not to update the styling value immediately
 *        (despite the other bindings possibly having priority)
 *
 * @codeGenApi
 */
export function ɵɵelementStyleProp(index, styleIndex, value, suffix, forceOverride) {
    var valueToAdd = resolveStylePropValue(value, suffix);
    var stylingContext = getStylingContext(index, getLView());
    updateElementStyleProp(stylingContext, styleIndex, valueToAdd, DEFAULT_TEMPLATE_DIRECTIVE_INDEX, forceOverride);
}
/**
 * Update a host style binding value on the host element within a component/directive.
 *
 * If the style value is falsy then it will be removed from the host element
 * (or assigned a different value depending if there are any styles placed
 * on the same element with `elementHostStylingMap` or any static styles that
 * are present from when the element was patched with `elementHostStyling`).
 *
 * Note that the styling applied to the host element once
 * `elementHostStylingApply` is called.
 *
 * @param styleIndex Index of style to update. This index value refers to the
 *        index of the style in the style bindings array that was passed into
 *        `elementHostStyling`.
 * @param value New value to write (falsy to remove). The value may or may not
 *        be applied to the element depending on the template/component/directive
 *        prioritization (see `interfaces/styling.ts`)
 * @param suffix Optional suffix. Used with scalar values to add unit such as `px`.
 *        Note that when a suffix is provided then the underlying sanitizer will
 *        be ignored.
 * @param forceOverride Whether or not to update the styling value immediately
 *        (despite the other bindings possibly having priority)
 *
 * @codeGenApi
 */
export function ɵɵelementHostStyleProp(styleIndex, value, suffix, forceOverride) {
    var directiveStylingIndex = getActiveDirectiveStylingIndex();
    var hostElementIndex = getSelectedIndex();
    var stylingContext = getStylingContext(hostElementIndex, getLView());
    var valueToAdd = resolveStylePropValue(value, suffix);
    var args = [stylingContext, styleIndex, valueToAdd, directiveStylingIndex, forceOverride];
    enqueueHostInstruction(stylingContext, directiveStylingIndex, updateElementStyleProp, args);
}
function resolveStylePropValue(value, suffix) {
    var valueToAdd = null;
    if (value !== null) {
        if (suffix) {
            // when a suffix is applied then it will bypass
            // sanitization entirely (b/c a new string is created)
            valueToAdd = renderStringify(value) + suffix;
        }
        else {
            // sanitization happens by dealing with a String value
            // this means that the string value will be passed through
            // into the style rendering later (which is where the value
            // will be sanitized before it is applied)
            valueToAdd = value;
        }
    }
    return valueToAdd;
}
/**
 * Update a class binding on an element with the provided value.
 *
 * This instruction is meant to handle the `[class.foo]="exp"` case and,
 * therefore, the class binding itself must already be allocated using
 * `elementStyling` within the creation block.
 *
 * @param index Index of the element's with which styling is associated.
 * @param classIndex Index of class to toggle. This index value refers to the
 *        index of the class in the class bindings array that was passed into
 *        `elementStyling` (which is meant to be called before this
 *        function is).
 * @param value A true/false value which will turn the class on or off.
 * @param forceOverride Whether or not this value will be applied regardless
 *        of where it is being set within the styling priority structure.
 *
 * @codeGenApi
 */
export function ɵɵelementClassProp(index, classIndex, value, forceOverride) {
    var input = (value instanceof BoundPlayerFactory) ?
        value :
        booleanOrNull(value);
    var stylingContext = getStylingContext(index, getLView());
    updateElementClassProp(stylingContext, classIndex, input, DEFAULT_TEMPLATE_DIRECTIVE_INDEX, forceOverride);
}
/**
 * Update a class host binding for a directive's/component's host element within
 * the host bindings function.
 *
 * This instruction is meant to handle the `@HostBinding('class.foo')` case and,
 * therefore, the class binding itself must already be allocated using
 * `elementHostStyling` within the creation block.
 *
 * @param classIndex Index of class to toggle. This index value refers to the
 *        index of the class in the class bindings array that was passed into
 *        `elementHostStlying` (which is meant to be called before this
 *        function is).
 * @param value A true/false value which will turn the class on or off.
 * @param forceOverride Whether or not this value will be applied regardless
 *        of where it is being set within the stylings priority structure.
 *
 * @codeGenApi
 */
export function ɵɵelementHostClassProp(classIndex, value, forceOverride) {
    var directiveStylingIndex = getActiveDirectiveStylingIndex();
    var hostElementIndex = getSelectedIndex();
    var stylingContext = getStylingContext(hostElementIndex, getLView());
    var input = (value instanceof BoundPlayerFactory) ?
        value :
        booleanOrNull(value);
    var args = [stylingContext, classIndex, input, directiveStylingIndex, forceOverride];
    enqueueHostInstruction(stylingContext, directiveStylingIndex, updateElementClassProp, args);
}
function booleanOrNull(value) {
    if (typeof value === 'boolean')
        return value;
    return value ? true : null;
}
/**
 * Update style and/or class bindings using object literals on an element.
 *
 * This instruction is meant to apply styling via the `[style]="exp"` and `[class]="exp"` template
 * bindings. When styles/classes are applied to the element they will then be updated with
 * respect to any styles/classes set with `elementStyleProp` or `elementClassProp`. If any
 * styles or classes are set to falsy then they will be removed from the element.
 *
 * Note that the styling instruction will not be applied until `elementStylingApply` is called.
 *
 * @param index Index of the element's with which styling is associated.
 * @param classes A key/value map or string of CSS classes that will be added to the
 *        given element. Any missing classes (that have already been applied to the element
 *        beforehand) will be removed (unset) from the element's list of CSS classes.
 * @param styles A key/value style map of the styles that will be applied to the given element.
 *        Any missing styles (that have already been applied to the element beforehand) will be
 *        removed (unset) from the element's styling.
 *
 * @codeGenApi
 */
export function ɵɵelementStylingMap(index, classes, styles) {
    var lView = getLView();
    var stylingContext = getStylingContext(index, lView);
    var tNode = getTNode(index, lView);
    // inputs are only evaluated from a template binding into a directive, therefore,
    // there should not be a situation where a directive host bindings function
    // evaluates the inputs (this should only happen in the template function)
    if (hasClassInput(tNode) && classes !== NO_CHANGE) {
        var initialClasses = getInitialClassNameValue(stylingContext);
        var classInputVal = (initialClasses.length ? (initialClasses + ' ') : '') + forceClassesAsString(classes);
        setInputsForProperty(lView, tNode.inputs['class'], classInputVal);
        classes = NO_CHANGE;
    }
    if (hasStyleInput(tNode) && styles !== NO_CHANGE) {
        var initialStyles = getInitialClassNameValue(stylingContext);
        var styleInputVal = (initialStyles.length ? (initialStyles + ' ') : '') + forceStylesAsString(styles);
        setInputsForProperty(lView, tNode.inputs['style'], styleInputVal);
        styles = NO_CHANGE;
    }
    updateStylingMap(stylingContext, classes, styles);
}
/**
 * Update style and/or class host bindings using object literals on an element within the host
 * bindings function for a directive/component.
 *
 * This instruction is meant to apply styling via the `@HostBinding('style')` and
 * `@HostBinding('class')` bindings for a component's or directive's host element.
 * When styles/classes are applied to the host element they will then be updated
 * with respect to any styles/classes set with `elementHostStyleProp` or
 * `elementHostClassProp`. If any styles or classes are set to falsy then they
 * will be removed from the element.
 *
 * Note that the styling instruction will not be applied until
 * `elementHostStylingApply` is called.
 *
 * @param classes A key/value map or string of CSS classes that will be added to the
 *        given element. Any missing classes (that have already been applied to the element
 *        beforehand) will be removed (unset) from the element's list of CSS classes.
 * @param styles A key/value style map of the styles that will be applied to the given element.
 *        Any missing styles (that have already been applied to the element beforehand) will be
 *        removed (unset) from the element's styling.
 *
 * @codeGenApi
 */
export function ɵɵelementHostStylingMap(classes, styles) {
    var directiveStylingIndex = getActiveDirectiveStylingIndex();
    var hostElementIndex = getSelectedIndex();
    var stylingContext = getStylingContext(hostElementIndex, getLView());
    var args = [stylingContext, classes, styles, directiveStylingIndex];
    enqueueHostInstruction(stylingContext, directiveStylingIndex, updateStylingMap, args);
}
/**
 * Apply all style and class binding values to the element.
 *
 * This instruction is meant to be run after `elementStylingMap`, `elementStyleProp`
 * or `elementClassProp` instructions have been run and will only apply styling to
 * the element if any styling bindings have been updated.
 *
 * @param index Index of the element's with which styling is associated.
 *
 * @codeGenApi
 */
export function ɵɵelementStylingApply(index) {
    elementStylingApplyInternal(DEFAULT_TEMPLATE_DIRECTIVE_INDEX, index);
}
/**
 * Apply all style and class host binding values to the element.
 *
 * This instruction is meant to be run after `elementHostStylingMap`,
 * `elementHostStyleProp` or `elementHostClassProp` instructions have
 * been run and will only apply styling to the host element if any
 * styling bindings have been updated.
 *
 * @codeGenApi
 */
export function ɵɵelementHostStylingApply() {
    elementStylingApplyInternal(getActiveDirectiveStylingIndex(), getSelectedIndex());
}
export function elementStylingApplyInternal(directiveStylingIndex, index) {
    var lView = getLView();
    var tNode = getTNode(index, lView);
    // if a non-element value is being processed then we can't render values
    // on the element at all therefore by setting the renderer to null then
    // the styling apply code knows not to actually apply the values...
    var renderer = tNode.type === 3 /* Element */ ? lView[RENDERER] : null;
    var isFirstRender = (lView[FLAGS] & 8 /* FirstLViewPass */) !== 0;
    var stylingContext = getStylingContext(index, lView);
    var totalPlayersQueued = renderStyling(stylingContext, renderer, lView, isFirstRender, null, null, directiveStylingIndex);
    if (totalPlayersQueued > 0) {
        var rootContext = getRootContext(lView);
        scheduleTick(rootContext, 2 /* FlushPlayers */);
    }
    // because select(n) may not run between every instruction, the cached styling
    // context may not get cleared between elements. The reason for this is because
    // styling bindings (like `[style]` and `[class]`) are not recognized as property
    // bindings by default so a select(n) instruction is not generated. To ensure the
    // context is loaded correctly for the next element the cache below is pre-emptively
    // cleared because there is no code in Angular that applies more styling code after a
    // styling flush has occurred. Note that this will be fixed once FW-1254 lands.
    setCachedStylingContext(null);
}
export function getActiveDirectiveStylingIndex() {
    // whenever a directive's hostBindings function is called a uniqueId value
    // is assigned. Normally this is enough to help distinguish one directive
    // from another for the styling context, but there are situations where a
    // sub-class directive could inherit and assign styling in concert with a
    // parent directive. To help the styling code distinguish between a parent
    // sub-classed directive the inheritance depth is taken into account as well.
    return getActiveDirectiveId() + getActiveDirectiveSuperClassDepth();
}
function getStylingContext(index, lView) {
    var context = getCachedStylingContext();
    if (!context) {
        context = getStylingContextFromLView(index + HEADER_OFFSET, lView);
        setCachedStylingContext(context);
    }
    else if (ngDevMode) {
        var actualContext = getStylingContextFromLView(index + HEADER_OFFSET, lView);
        assertEqual(context, actualContext, 'The cached styling context is invalid');
    }
    return context;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R5bGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3JlbmRlcjMvaW5zdHJ1Y3Rpb25zL3N0eWxpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBUUEsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBRzlDLE9BQU8sRUFBQyxLQUFLLEVBQUUsYUFBYSxFQUFxQixRQUFRLEVBQW1CLE1BQU0sb0JBQW9CLENBQUM7QUFDdkcsT0FBTyxFQUFDLG9CQUFvQixFQUFFLGlDQUFpQyxFQUFFLFFBQVEsRUFBRSx3QkFBd0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUN2SSxPQUFPLEVBQUMsd0JBQXdCLEVBQUUsYUFBYSxFQUFFLGVBQWUsSUFBSSxzQkFBc0IsRUFBRSx5QkFBeUIsRUFBRSxlQUFlLElBQUksc0JBQXNCLEVBQUUsZ0JBQWdCLEVBQUMsTUFBTSxxQ0FBcUMsQ0FBQztBQUMvTixPQUFPLEVBQVcsc0JBQXNCLEVBQUUscUJBQXFCLEVBQUMsTUFBTSxvQ0FBb0MsQ0FBQztBQUMzRyxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUM3RCxPQUFPLEVBQUMsZ0NBQWdDLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNuRSxPQUFPLEVBQUMsdUJBQXVCLEVBQUUsdUJBQXVCLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUNsRixPQUFPLEVBQUMsb0NBQW9DLEVBQUUseUJBQXlCLEVBQUUsb0JBQW9CLEVBQUUsbUJBQW1CLEVBQUUsMEJBQTBCLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3JNLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDcEMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ25ELE9BQU8s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Q0FBQyxDQUFDO1FBQy9FLFdBQVcsQ0FBQyxPQUFPLEVBQUUsYUFBYSxFQUFFLHVDQUF1QyxDQUFDLENBQUM7S0FDOUU7SUFDRCxPQUFPLE9BQU8sQ0FBQztBQUNqQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtTdHlsZVNhbml0aXplRm59IGZyb20gJy4uLy4uL3Nhbml0aXphdGlvbi9zdHlsZV9zYW5pdGl6ZXInO1xuaW1wb3J0IHthc3NlcnRFcXVhbH0gZnJvbSAnLi4vLi4vdXRpbC9hc3NlcnQnO1xuaW1wb3J0IHtUTm9kZSwgVE5vZGVUeXBlfSBmcm9tICcuLi9pbnRlcmZhY2VzL25vZGUnO1xuaW1wb3J0IHtQbGF5ZXJGYWN0b3J5fSBmcm9tICcuLi9pbnRlcmZhY2VzL3BsYXllcic7XG5pbXBvcnQge0ZMQUdTLCBIRUFERVJfT0ZGU0VULCBMVmlldywgTFZpZXdGbGFncywgUkVOREVSRVIsIFJvb3RDb250ZXh0RmxhZ3N9IGZyb20gJy4uL2ludGVyZmFjZXMvdmlldyc7XG5pbXBvcnQge2dldEFjdGl2ZURpcmVjdGl2ZUlkLCBnZXRBY3RpdmVEaXJlY3RpdmVTdXBlckNsYXNzRGVwdGgsIGdldExWaWV3LCBnZXRQcmV2aW91c09yUGFyZW50VE5vZGUsIGdldFNlbGVjdGVkSW5kZXh9IGZyb20gJy4uL3N0YXRlJztcbmltcG9ydCB7Z2V0SW5pdGlhbENsYXNzTmFtZVZhbHVlLCByZW5kZXJTdHlsaW5nLCB1cGRhdGVDbGFzc1Byb3AgYXMgdXBkYXRlRWxlbWVudENsYXNzUHJvcCwgdXBkYXRlQ29udGV4dFdpdGhCaW5kaW5ncywgdXBkYXRlU3R5bGVQcm9wIGFzIHVwZGF0ZUVsZW1lbnRTdHlsZVByb3AsIHVwZGF0ZVN0eWxpbmdNYXB9IGZyb20gJy4uL3N0eWxpbmcvY2xhc3NfYW5kX3N0eWxlX2JpbmRpbmdzJztcbmltcG9ydCB7UGFyYW1zT2YsIGVucXVldWVIb3N0SW5zdHJ1Y3Rpb24sIHJlZ2lzdGVySG9zdERpcmVjdGl2ZX0gZnJvbSAnLi4vc3R5bGluZy9ob3N0X2luc3RydWN0aW9uc19xdWV1ZSc7XG5pbXBvcnQge0JvdW5kUGxheWVyRmFjdG9yeX0gZnJvbSAnLi4vc3R5bGluZy9wbGF5ZXJfZmFjdG9yeSc7XG5pbXBvcnQge0RFRkFVTFRfVEVNUExBVEVfRElSRUNUSVZFX0lOREVYfSBmcm9tICcuLi9zdHlsaW5nL3NoYXJlZCc7XG5pbXBvcnQge2dldENhY2hlZFN0eWxpbmdDb250ZXh0LCBzZXRDYWNoZWRTdHlsaW5nQ29udGV4dH0gZnJvbSAnLi4vc3R5bGluZy9zdGF0ZSc7XG5pbXBvcnQge2FsbG9jYXRlT3JVcGRhdGVEaXJlY3RpdmVJbnRvQ29udGV4dCwgY3JlYXRlRW1wdHlTdHlsaW5nQ29udGV4dCwgZm9yY2VDbGFzc2VzQXNTdHJpbmcsIGZvcmNlU3R5bGVzQXNTdHJpbmcsIGdldFN0eWxpbmdDb250ZXh0RnJvbUxWaWV3LCBoYXNDbGFzc0lucHV0LCBoYXNTdHlsZUlucHV0fSBmcm9tICcuLi9zdHlsaW5nL3V0aWwnO1xuaW1wb3J0IHtOT19DSEFOR0V9IGZyb20gJy4uL3Rva2Vucyc7XG5pbXBvcnQge3JlbmRlclN0cmluZ2lmeX0gZnJvbSAnLi4vdXRpbC9taXNjX3V0aWxzJztcbmltcG9ydCB7Z2V0Um9vdENvbnRleHR9IGZyb20gJy4uL3V0aWwvdmlld190cmF2ZXJzYWxfdXRpbHMnO1xuaW1wb3J0IHtnZXRUTm9kZX0gZnJvbSAnLi4vdXRpbC92aWV3X3V0aWxzJztcblxuaW1wb3J0IHtzY2hlZHVsZVRpY2ssIHNldElucHV0c0ZvclByb3BlcnR5fSBmcm9tICcuL3NoYXJlZCc7XG5cblxuXG4vKlxuICogVGhlIGNvbnRlbnRzIG9mIHRoaXMgZmlsZSBpbmNsdWRlIHRoZSBpbnN0cnVjdGlvbnMgZm9yIGFsbCBzdHlsaW5nLXJlbGF0ZWRcbiAqIG9wZXJhdGlvbnMgaW4gQW5ndWxhci5cbiAqXG4gKiBUaGUgaW5zdHJ1Y3Rpb25zIHByZXNlbnQgaW4gdGhpcyBmaWxlIGFyZTpcbiAqXG4gKiBUZW1wbGF0ZSBsZXZlbCBzdHlsaW5nIGluc3RydWN0aW9uczpcbiAqIC0gZWxlbWVudFN0eWxpbmdcbiAqIC0gZWxlbWVudFN0eWxpbmdNYXBcbiAqIC0gZWxlbWVudFN0eWxlUHJvcFxuICogLSBlbGVtZW50Q2xhc3NQcm9wXG4gKiAtIGVsZW1lbnRTdHlsaW5nQXBwbHlcbiAqXG4gKiBIb3N0IGJpbmRpbmdzIGxldmVsIHN0eWxpbmcgaW5zdHJ1Y3Rpb25zOlxuICogLSBlbGVtZW50SG9zdFN0eWxpbmdcbiAqIC0gZWxlbWVudEhvc3RTdHlsaW5nTWFwXG4gKiAtIGVsZW1lbnRIb3N0U3R5bGVQcm9wXG4gKiAtIGVsZW1lbnRIb3N0Q2xhc3NQcm9wXG4gKiAtIGVsZW1lbnRIb3N0U3R5bGluZ0FwcGx5XG4gKi9cblxuLyoqXG4gKiBBbGxvY2F0ZXMgc3R5bGUgYW5kIGNsYXNzIGJpbmRpbmcgcHJvcGVydGllcyBvbiB0aGUgZWxlbWVudCBkdXJpbmcgY3JlYXRpb24gbW9kZS5cbiAqXG4gKiBUaGlzIGluc3RydWN0aW9uIGlzIG1lYW50IHRvIGJlIGNhbGxlZCBkdXJpbmcgY3JlYXRpb24gbW9kZSB0byByZWdpc3RlciBhbGxcbiAqIGR5bmFtaWMgc3R5bGUgYW5kIGNsYXNzIGJpbmRpbmdzIG9uIHRoZSBlbGVtZW50LiBOb3RlIHRoYXQgdGhpcyBpcyBvbmx5IHVzZWRcbiAqIGZvciBiaW5kaW5nIHZhbHVlcyAoc2VlIGBlbGVtZW50U3RhcnRgIHRvIGxlYXJuIGhvdyB0byBhc3NpZ24gc3RhdGljIHN0eWxpbmdcbiAqIHZhbHVlcyB0byBhbiBlbGVtZW50KS5cbiAqXG4gKiBAcGFyYW0gY2xhc3NCaW5kaW5nTmFtZXMgQW4gYXJyYXkgY29udGFpbmluZyBiaW5kYWJsZSBjbGFzcyBuYW1lcy5cbiAqICAgICAgICBUaGUgYGVsZW1lbnRDbGFzc1Byb3BgIGluc3RydWN0aW9uIHJlZmVycyB0byB0aGUgY2xhc3MgbmFtZSBieSBpbmRleCBpblxuICogICAgICAgIHRoaXMgYXJyYXkgKGkuZS4gYFsnZm9vJywgJ2JhciddYCBtZWFucyBgZm9vPTBgIGFuZCBgYmFyPTFgKS5cbiAqIEBwYXJhbSBzdHlsZUJpbmRpbmdOYW1lcyBBbiBhcnJheSBjb250YWluaW5nIGJpbmRhYmxlIHN0eWxlIHByb3BlcnRpZXMuXG4gKiAgICAgICAgVGhlIGBlbGVtZW50U3R5bGVQcm9wYCBpbnN0cnVjdGlvbiByZWZlcnMgdG8gdGhlIGNsYXNzIG5hbWUgYnkgaW5kZXggaW5cbiAqICAgICAgICB0aGlzIGFycmF5IChpLmUuIGBbJ3dpZHRoJywgJ2hlaWdodCddYCBtZWFucyBgd2lkdGg9MGAgYW5kIGBoZWlnaHQ9MWApLlxuICogQHBhcmFtIHN0eWxlU2FuaXRpemVyIEFuIG9wdGlvbmFsIHNhbml0aXplciBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgdXNlZCB0byBzYW5pdGl6ZSBhbnkgQ1NTXG4gKiAgICAgICAgc3R5bGUgdmFsdWVzIHRoYXQgYXJlIGFwcGxpZWQgdG8gdGhlIGVsZW1lbnQgKGR1cmluZyByZW5kZXJpbmcpLlxuICpcbiAqIEBjb2RlR2VuQXBpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiDJtcm1ZWxlbWVudFN0eWxpbmcoXG4gICAgY2xhc3NCaW5kaW5nTmFtZXM/OiBzdHJpbmdbXSB8IG51bGwsIHN0eWxlQmluZGluZ05hbWVzPzogc3RyaW5nW10gfCBudWxsLFxuICAgIHN0eWxlU2FuaXRpemVyPzogU3R5bGVTYW5pdGl6ZUZuIHwgbnVsbCk6IHZvaWQge1xuICBjb25zdCB0Tm9kZSA9IGdldFByZXZpb3VzT3JQYXJlbnRUTm9kZSgpO1xuICBpZiAoIXROb2RlLnN0eWxpbmdUZW1wbGF0ZSkge1xuICAgIHROb2RlLnN0eWxpbmdUZW1wbGF0ZSA9IGNyZWF0ZUVtcHR5U3R5bGluZ0NvbnRleHQoKTtcbiAgfVxuXG4gIC8vIGNhbGxpbmcgdGhlIGZ1bmN0aW9uIGJlbG93IGVuc3VyZXMgdGhhdCB0aGUgdGVtcGxhdGUncyBiaW5kaW5nIHZhbHVlc1xuICAvLyBhcmUgYXBwbGllZCBhcyB0aGUgZmlyc3Qgc2V0IG9mIGJpbmRpbmdzIGludG8gdGhlIGNvbnRleHQuIElmIGFueSBvdGhlclxuICAvLyBzdHlsaW5nIGJpbmRpbmdzIGFyZSBzZXQgb24gdGhlIHNhbWUgZWxlbWVudCAoYnkgZGlyZWN0aXZlcyBhbmQvb3JcbiAgLy8gY29tcG9uZW50cykgdGhlbiB0aGV5IHdpbGwgYmUgYXBwbGllZCBhdCB0aGUgZW5kIG9mIHRoZSBgZWxlbWVudEVuZGBcbiAgLy8gaW5zdHJ1Y3Rpb24gKGJlY2F1c2UgZGlyZWN0aXZlcyBhcmUgY3JlYXRlZCBmaXJzdCBiZWZvcmUgc3R5bGluZyBpc1xuICAvLyBleGVjdXRlZCBmb3IgYSBuZXcgZWxlbWVudCkuXG4gIGluaXRFbGVtZW50U3R5bGluZyhcbiAgICAgIHROb2RlLCBjbGFzc0JpbmRpbmdOYW1lcywgc3R5bGVCaW5kaW5nTmFtZXMsIHN0eWxlU2FuaXRpemVyLFxuICAgICAgREVGQVVMVF9URU1QTEFURV9ESVJFQ1RJVkVfSU5ERVgpO1xufVxuXG4vKipcbiAqIEFsbG9jYXRlcyBzdHlsZSBhbmQgY2xhc3MgYmluZGluZyBwcm9wZXJ0aWVzIG9uIHRoZSBob3N0IGVsZW1lbnQgZHVyaW5nIGNyZWF0aW9uIG1vZGVcbiAqIHdpdGhpbiB0aGUgaG9zdCBiaW5kaW5ncyBmdW5jdGlvbiBvZiBhIGRpcmVjdGl2ZSBvciBjb21wb25lbnQuXG4gKlxuICogVGhpcyBpbnN0cnVjdGlvbiBpcyBtZWFudCB0byBiZSBjYWxsZWQgZHVyaW5nIGNyZWF0aW9uIG1vZGUgdG8gcmVnaXN0ZXIgYWxsXG4gKiBkeW5hbWljIHN0eWxlIGFuZCBjbGFzcyBob3N0IGJpbmRpbmdzIG9uIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBkaXJlY3RpdmUgb3JcbiAqIGNvbXBvbmVudC4gTm90ZSB0aGF0IHRoaXMgaXMgb25seSB1c2VkIGZvciBiaW5kaW5nIHZhbHVlcyAoc2VlIGBlbGVtZW50SG9zdEF0dHJzYFxuICogdG8gbGVhcm4gaG93IHRvIGFzc2lnbiBzdGF0aWMgc3R5bGluZyB2YWx1ZXMgdG8gdGhlIGhvc3QgZWxlbWVudCkuXG4gKlxuICogQHBhcmFtIGNsYXNzQmluZGluZ05hbWVzIEFuIGFycmF5IGNvbnRhaW5pbmcgYmluZGFibGUgY2xhc3MgbmFtZXMuXG4gKiAgICAgICAgVGhlIGBlbGVtZW50SG9zdENsYXNzUHJvcGAgaW5zdHJ1Y3Rpb24gcmVmZXJzIHRvIHRoZSBjbGFzcyBuYW1lIGJ5IGluZGV4IGluXG4gKiAgICAgICAgdGhpcyBhcnJheSAoaS5lLiBgWydmb28nLCAnYmFyJ11gIG1lYW5zIGBmb289MGAgYW5kIGBiYXI9MWApLlxuICogQHBhcmFtIHN0eWxlQmluZGluZ05hbWVzIEFuIGFycmF5IGNvbnRhaW5pbmcgYmluZGFibGUgc3R5bGUgcHJvcGVydGllcy5cbiAqICAgICAgICBUaGUgYGVsZW1lbnRIb3N0U3R5bGVQcm9wYCBpbnN0cnVjdGlvbiByZWZlcnMgdG8gdGhlIGNsYXNzIG5hbWUgYnkgaW5kZXggaW5cbiAqICAgICAgICB0aGlzIGFycmF5IChpLmUuIGBbJ3dpZHRoJywgJ2hlaWdodCddYCBtZWFucyBgd2lkdGg9MGAgYW5kIGBoZWlnaHQ9MWApLlxuICogQHBhcmFtIHN0eWxlU2FuaXRpemVyIEFuIG9wdGlvbmFsIHNhbml0aXplciBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgdXNlZCB0byBzYW5pdGl6ZSBhbnkgQ1NTXG4gKiAgICAgICAgc3R5bGUgdmFsdWVzIHRoYXQgYXJlIGFwcGxpZWQgdG8gdGhlIGVsZW1lbnQgKGR1cmluZyByZW5kZXJpbmcpLlxuICogICAgICAgIE5vdGUgdGhhdCB0aGUgc2FuaXRpemVyIGluc3RhbmNlIGl0c2VsZiBpcyB0aWVkIHRvIHRoZSBwcm92aWRlZCBgZGlyZWN0aXZlYCBhbmRcbiAqICAgICAgICB3aWxsIG5vdCBiZSB1c2VkIGlmIHRoZSBzYW1lIHByb3BlcnR5IGlzIGFzc2lnbmVkIGluIGFub3RoZXIgZGlyZWN0aXZlIG9yXG4gKiAgICAgICAgb24gdGhlIGVsZW1lbnQgZGlyZWN0bHkuXG4gKlxuICogQGNvZGVHZW5BcGlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIMm1ybVlbGVtZW50SG9zdFN0eWxpbmcoXG4gICAgY2xhc3NCaW5kaW5nTmFtZXM/OiBzdHJpbmdbXSB8IG51bGwsIHN0eWxlQmluZGluZ05hbWVzPzogc3RyaW5nW10gfCBudWxsLFxuICAgIHN0eWxlU2FuaXRpemVyPzogU3R5bGVTYW5pdGl6ZUZuIHwgbnVsbCk6IHZvaWQge1xuICBjb25zdCB0Tm9kZSA9IGdldFByZXZpb3VzT3JQYXJlbnRUTm9kZSgpO1xuICBpZiAoIXROb2RlLnN0eWxpbmdUZW1wbGF0ZSkge1xuICAgIHROb2RlLnN0eWxpbmdUZW1wbGF0ZSA9IGNyZWF0ZUVtcHR5U3R5bGluZ0NvbnRleHQoKTtcbiAgfVxuXG4gIGNvbnN0IGRpcmVjdGl2ZVN0eWxpbmdJbmRleCA9IGdldEFjdGl2ZURpcmVjdGl2ZVN0eWxpbmdJbmRleCgpO1xuXG4gIC8vIGRlc3BpdGUgdGhlIGJpbmRpbmcgYmVpbmcgYXBwbGllZCBpbiBhIHF1ZXVlIChiZWxvdyksIHRoZSBhbGxvY2F0aW9uXG4gIC8vIG9mIHRoZSBkaXJlY3RpdmUgaW50byB0aGUgY29udGV4dCBoYXBwZW5zIHJpZ2h0IGF3YXkuIFRoZSByZWFzb24gZm9yXG4gIC8vIHRoaXMgaXMgdG8gcmV0YWluIHRoZSBvcmRlcmluZyBvZiB0aGUgZGlyZWN0aXZlcyAod2hpY2ggaXMgaW1wb3J0YW50XG4gIC8vIGZvciB0aGUgcHJpb3JpdGl6YXRpb24gb2YgYmluZGluZ3MpLlxuICBhbGxvY2F0ZU9yVXBkYXRlRGlyZWN0aXZlSW50b0NvbnRleHQodE5vZGUuc3R5bGluZ1RlbXBsYXRlLCBkaXJlY3RpdmVTdHlsaW5nSW5kZXgpO1xuXG4gIGNvbnN0IGZucyA9IHROb2RlLm9uRWxlbWVudENyZWF0aW9uRm5zID0gdE5vZGUub25FbGVtZW50Q3JlYXRpb25GbnMgfHwgW107XG4gIGZucy5wdXNoKCgpID0+IHtcbiAgICBpbml0RWxlbWVudFN0eWxpbmcoXG4gICAgICAgIHROb2RlLCBjbGFzc0JpbmRpbmdOYW1lcywgc3R5bGVCaW5kaW5nTmFtZXMsIHN0eWxlU2FuaXRpemVyLCBkaXJlY3RpdmVTdHlsaW5nSW5kZXgpO1xuICAgIHJlZ2lzdGVySG9zdERpcmVjdGl2ZSh0Tm9kZS5zdHlsaW5nVGVtcGxhdGUgISwgZGlyZWN0aXZlU3R5bGluZ0luZGV4KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGluaXRFbGVtZW50U3R5bGluZyhcbiAgICB0Tm9kZTogVE5vZGUsIGNsYXNzQmluZGluZ05hbWVzOiBzdHJpbmdbXSB8IG51bGwgfCB1bmRlZmluZWQsXG4gICAgc3R5bGVCaW5kaW5nTmFtZXM6IHN0cmluZ1tdIHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgICBzdHlsZVNhbml0aXplcjogU3R5bGVTYW5pdGl6ZUZuIHwgbnVsbCB8IHVuZGVmaW5lZCwgZGlyZWN0aXZlU3R5bGluZ0luZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgdXBkYXRlQ29udGV4dFdpdGhCaW5kaW5ncyhcbiAgICAgIHROb2RlLnN0eWxpbmdUZW1wbGF0ZSAhLCBkaXJlY3RpdmVTdHlsaW5nSW5kZXgsIGNsYXNzQmluZGluZ05hbWVzLCBzdHlsZUJpbmRpbmdOYW1lcyxcbiAgICAgIHN0eWxlU2FuaXRpemVyKTtcbn1cblxuXG4vKipcbiAqIFVwZGF0ZSBhIHN0eWxlIGJpbmRpbmcgb24gYW4gZWxlbWVudCB3aXRoIHRoZSBwcm92aWRlZCB2YWx1ZS5cbiAqXG4gKiBJZiB0aGUgc3R5bGUgdmFsdWUgaXMgZmFsc3kgdGhlbiBpdCB3aWxsIGJlIHJlbW92ZWQgZnJvbSB0aGUgZWxlbWVudFxuICogKG9yIGFzc2lnbmVkIGEgZGlmZmVyZW50IHZhbHVlIGRlcGVuZGluZyBpZiB0aGVyZSBhcmUgYW55IHN0eWxlcyBwbGFjZWRcbiAqIG9uIHRoZSBlbGVtZW50IHdpdGggYGVsZW1lbnRTdHlsaW5nTWFwYCBvciBhbnkgc3RhdGljIHN0eWxlcyB0aGF0IGFyZVxuICogcHJlc2VudCBmcm9tIHdoZW4gdGhlIGVsZW1lbnQgd2FzIGNyZWF0ZWQgd2l0aCBgZWxlbWVudFN0eWxpbmdgKS5cbiAqXG4gKiBOb3RlIHRoYXQgdGhlIHN0eWxpbmcgZWxlbWVudCBpcyB1cGRhdGVkIGFzIHBhcnQgb2YgYGVsZW1lbnRTdHlsaW5nQXBwbHlgLlxuICpcbiAqIEBwYXJhbSBpbmRleCBJbmRleCBvZiB0aGUgZWxlbWVudCdzIHdpdGggd2hpY2ggc3R5bGluZyBpcyBhc3NvY2lhdGVkLlxuICogQHBhcmFtIHN0eWxlSW5kZXggSW5kZXggb2Ygc3R5bGUgdG8gdXBkYXRlLiBUaGlzIGluZGV4IHZhbHVlIHJlZmVycyB0byB0aGVcbiAqICAgICAgICBpbmRleCBvZiB0aGUgc3R5bGUgaW4gdGhlIHN0eWxlIGJpbmRpbmdzIGFycmF5IHRoYXQgd2FzIHBhc3NlZCBpbnRvXG4gKiAgICAgICAgYGVsZW1lbnRTdHlsaW5nYC5cbiAqIEBwYXJhbSB2YWx1ZSBOZXcgdmFsdWUgdG8gd3JpdGUgKGZhbHN5IHRvIHJlbW92ZSkuIE5vdGUgdGhhdCBpZiBhIGRpcmVjdGl2ZSBhbHNvXG4gKiAgICAgICAgYXR0ZW1wdHMgdG8gd3JpdGUgdG8gdGhlIHNhbWUgYmluZGluZyB2YWx1ZSAodmlhIGBlbGVtZW50SG9zdFN0eWxlUHJvcGApXG4gKiAgICAgICAgdGhlbiBpdCB3aWxsIG9ubHkgYmUgYWJsZSB0byBkbyBzbyBpZiB0aGUgYmluZGluZyB2YWx1ZSBhc3NpZ25lZCB2aWFcbiAqICAgICAgICBgZWxlbWVudFN0eWxlUHJvcGAgaXMgZmFsc3kgKG9yIGRvZXNuJ3QgZXhpc3QgYXQgYWxsKS5cbiAqIEBwYXJhbSBzdWZmaXggT3B0aW9uYWwgc3VmZml4LiBVc2VkIHdpdGggc2NhbGFyIHZhbHVlcyB0byBhZGQgdW5pdCBzdWNoIGFzIGBweGAuXG4gKiAgICAgICAgTm90ZSB0aGF0IHdoZW4gYSBzdWZmaXggaXMgcHJvdmlkZWQgdGhlbiB0aGUgdW5kZXJseWluZyBzYW5pdGl6ZXIgd2lsbFxuICogICAgICAgIGJlIGlnbm9yZWQuXG4gKiBAcGFyYW0gZm9yY2VPdmVycmlkZSBXaGV0aGVyIG9yIG5vdCB0byB1cGRhdGUgdGhlIHN0eWxpbmcgdmFsdWUgaW1tZWRpYXRlbHlcbiAqICAgICAgICAoZGVzcGl0ZSB0aGUgb3RoZXIgYmluZGluZ3MgcG9zc2libHkgaGF2aW5nIHByaW9yaXR5KVxuICpcbiAqIEBjb2RlR2VuQXBpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiDJtcm1ZWxlbWVudFN0eWxlUHJvcChcbiAgICBpbmRleDogbnVtYmVyLCBzdHlsZUluZGV4OiBudW1iZXIsIHZhbHVlOiBzdHJpbmcgfCBudW1iZXIgfCBTdHJpbmcgfCBQbGF5ZXJGYWN0b3J5IHwgbnVsbCxcbiAgICBzdWZmaXg/OiBzdHJpbmcgfCBudWxsLCBmb3JjZU92ZXJyaWRlPzogYm9vbGVhbik6IHZvaWQge1xuICBjb25zdCB2YWx1ZVRvQWRkID0gcmVzb2x2ZVN0eWxlUHJvcFZhbHVlKHZhbHVlLCBzdWZmaXgpO1xuICBjb25zdCBzdHlsaW5nQ29udGV4dCA9IGdldFN0eWxpbmdDb250ZXh0KGluZGV4LCBnZXRMVmlldygpKTtcbiAgdXBkYXRlRWxlbWVudFN0eWxlUHJvcChcbiAgICAgIHN0eWxpbmdDb250ZXh0LCBzdHlsZUluZGV4LCB2YWx1ZVRvQWRkLCBERUZBVUxUX1RFTVBMQVRFX0RJUkVDVElWRV9JTkRFWCwgZm9yY2VPdmVycmlkZSk7XG59XG5cbi8qKlxuICogVXBkYXRlIGEgaG9zdCBzdHlsZSBiaW5kaW5nIHZhbHVlIG9uIHRoZSBob3N0IGVsZW1lbnQgd2l0aGluIGEgY29tcG9uZW50L2RpcmVjdGl2ZS5cbiAqXG4gKiBJZiB0aGUgc3R5bGUgdmFsdWUgaXMgZmFsc3kgdGhlbiBpdCB3aWxsIGJlIHJlbW92ZWQgZnJvbSB0aGUgaG9zdCBlbGVtZW50XG4gKiAob3IgYXNzaWduZWQgYSBkaWZmZXJlbnQgdmFsdWUgZGVwZW5kaW5nIGlmIHRoZXJlIGFyZSBhbnkgc3R5bGVzIHBsYWNlZFxuICogb24gdGhlIHNhbWUgZWxlbWVudCB3aXRoIGBlbGVtZW50SG9zdFN0eWxpbmdNYXBgIG9yIGFueSBzdGF0aWMgc3R5bGVzIHRoYXRcbiAqIGFyZSBwcmVzZW50IGZyb20gd2hlbiB0aGUgZWxlbWVudCB3YXMgcGF0Y2hlZCB3aXRoIGBlbGVtZW50SG9zdFN0eWxpbmdgKS5cbiAqXG4gKiBOb3RlIHRoYXQgdGhlIHN0eWxpbmcgYXBwbGllZCB0byB0aGUgaG9zdCBlbGVtZW50IG9uY2VcbiAqIGBlbGVtZW50SG9zdFN0eWxpbmdBcHBseWAgaXMgY2FsbGVkLlxuICpcbiAqIEBwYXJhbSBzdHlsZUluZGV4IEluZGV4IG9mIHN0eWxlIHRvIHVwZGF0ZS4gVGhpcyBpbmRleCB2YWx1ZSByZWZlcnMgdG8gdGhlXG4gKiAgICAgICAgaW5kZXggb2YgdGhlIHN0eWxlIGluIHRoZSBzdHlsZSBiaW5kaW5ncyBhcnJheSB0aGF0IHdhcyBwYXNzZWQgaW50b1xuICogICAgICAgIGBlbGVtZW50SG9zdFN0eWxpbmdgLlxuICogQHBhcmFtIHZhbHVlIE5ldyB2YWx1ZSB0byB3cml0ZSAoZmFsc3kgdG8gcmVtb3ZlKS4gVGhlIHZhbHVlIG1heSBvciBtYXkgbm90XG4gKiAgICAgICAgYmUgYXBwbGllZCB0byB0aGUgZWxlbWVudCBkZXBlbmRpbmcgb24gdGhlIHRlbXBsYXRlL2NvbXBvbmVudC9kaXJlY3RpdmVcbiAqICAgICAgICBwcmlvcml0aXphdGlvbiAoc2VlIGBpbnRlcmZhY2VzL3N0eWxpbmcudHNgKVxuICogQHBhcmFtIHN1ZmZpeCBPcHRpb25hbCBzdWZmaXguIFVzZWQgd2l0aCBzY2FsYXIgdmFsdWVzIHRvIGFkZCB1bml0IHN1Y2ggYXMgYHB4YC5cbiAqICAgICAgICBOb3RlIHRoYXQgd2hlbiBhIHN1ZmZpeCBpcyBwcm92aWRlZCB0aGVuIHRoZSB1bmRlcmx5aW5nIHNhbml0aXplciB3aWxsXG4gKiAgICAgICAgYmUgaWdub3JlZC5cbiAqIEBwYXJhbSBmb3JjZU92ZXJyaWRlIFdoZXRoZXIgb3Igbm90IHRvIHVwZGF0ZSB0aGUgc3R5bGluZyB2YWx1ZSBpbW1lZGlhdGVseVxuICogICAgICAgIChkZXNwaXRlIHRoZSBvdGhlciBiaW5kaW5ncyBwb3NzaWJseSBoYXZpbmcgcHJpb3JpdHkpXG4gKlxuICogQGNvZGVHZW5BcGlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIMm1ybVlbGVtZW50SG9zdFN0eWxlUHJvcChcbiAgICBzdHlsZUluZGV4OiBudW1iZXIsIHZhbHVlOiBzdHJpbmcgfCBudW1iZXIgfCBTdHJpbmcgfCBQbGF5ZXJGYWN0b3J5IHwgbnVsbCxcbiAgICBzdWZmaXg/OiBzdHJpbmcgfCBudWxsLCBmb3JjZU92ZXJyaWRlPzogYm9vbGVhbik6IHZvaWQge1xuICBjb25zdCBkaXJlY3RpdmVTdHlsaW5nSW5kZXggPSBnZXRBY3RpdmVEaXJlY3RpdmVTdHlsaW5nSW5kZXgoKTtcbiAgY29uc3QgaG9zdEVsZW1lbnRJbmRleCA9IGdldFNlbGVjdGVkSW5kZXgoKTtcblxuICBjb25zdCBzdHlsaW5nQ29udGV4dCA9IGdldFN0eWxpbmdDb250ZXh0KGhvc3RFbGVtZW50SW5kZXgsIGdldExWaWV3KCkpO1xuICBjb25zdCB2YWx1ZVRvQWRkID0gcmVzb2x2ZVN0eWxlUHJvcFZhbHVlKHZhbHVlLCBzdWZmaXgpO1xuICBjb25zdCBhcmdzOiBQYXJhbXNPZjx0eXBlb2YgdXBkYXRlRWxlbWVudFN0eWxlUHJvcD4gPVxuICAgICAgW3N0eWxpbmdDb250ZXh0LCBzdHlsZUluZGV4LCB2YWx1ZVRvQWRkLCBkaXJlY3RpdmVTdHlsaW5nSW5kZXgsIGZvcmNlT3ZlcnJpZGVdO1xuICBlbnF1ZXVlSG9zdEluc3RydWN0aW9uKHN0eWxpbmdDb250ZXh0LCBkaXJlY3RpdmVTdHlsaW5nSW5kZXgsIHVwZGF0ZUVsZW1lbnRTdHlsZVByb3AsIGFyZ3MpO1xufVxuXG5mdW5jdGlvbiByZXNvbHZlU3R5bGVQcm9wVmFsdWUoXG4gICAgdmFsdWU6IHN0cmluZyB8IG51bWJlciB8IFN0cmluZyB8IFBsYXllckZhY3RvcnkgfCBudWxsLCBzdWZmaXg6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpIHtcbiAgbGV0IHZhbHVlVG9BZGQ6IHN0cmluZ3xudWxsID0gbnVsbDtcbiAgaWYgKHZhbHVlICE9PSBudWxsKSB7XG4gICAgaWYgKHN1ZmZpeCkge1xuICAgICAgLy8gd2hlbiBhIHN1ZmZpeCBpcyBhcHBsaWVkIHRoZW4gaXQgd2lsbCBieXBhc3NcbiAgICAgIC8vIHNhbml0aXphdGlvbiBlbnRpcmVseSAoYi9jIGEgbmV3IHN0cmluZyBpcyBjcmVhdGVkKVxuICAgICAgdmFsdWVUb0FkZCA9IHJlbmRlclN0cmluZ2lmeSh2YWx1ZSkgKyBzdWZmaXg7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHNhbml0aXphdGlvbiBoYXBwZW5zIGJ5IGRlYWxpbmcgd2l0aCBhIFN0cmluZyB2YWx1ZVxuICAgICAgLy8gdGhpcyBtZWFucyB0aGF0IHRoZSBzdHJpbmcgdmFsdWUgd2lsbCBiZSBwYXNzZWQgdGhyb3VnaFxuICAgICAgLy8gaW50byB0aGUgc3R5bGUgcmVuZGVyaW5nIGxhdGVyICh3aGljaCBpcyB3aGVyZSB0aGUgdmFsdWVcbiAgICAgIC8vIHdpbGwgYmUgc2FuaXRpemVkIGJlZm9yZSBpdCBpcyBhcHBsaWVkKVxuICAgICAgdmFsdWVUb0FkZCA9IHZhbHVlIGFzIGFueSBhcyBzdHJpbmc7XG4gICAgfVxuICB9XG4gIHJldHVybiB2YWx1ZVRvQWRkO1xufVxuXG5cbi8qKlxuICogVXBkYXRlIGEgY2xhc3MgYmluZGluZyBvbiBhbiBlbGVtZW50IHdpdGggdGhlIHByb3ZpZGVkIHZhbHVlLlxuICpcbiAqIFRoaXMgaW5zdHJ1Y3Rpb24gaXMgbWVhbnQgdG8gaGFuZGxlIHRoZSBgW2NsYXNzLmZvb109XCJleHBcImAgY2FzZSBhbmQsXG4gKiB0aGVyZWZvcmUsIHRoZSBjbGFzcyBiaW5kaW5nIGl0c2VsZiBtdXN0IGFscmVhZHkgYmUgYWxsb2NhdGVkIHVzaW5nXG4gKiBgZWxlbWVudFN0eWxpbmdgIHdpdGhpbiB0aGUgY3JlYXRpb24gYmxvY2suXG4gKlxuICogQHBhcmFtIGluZGV4IEluZGV4IG9mIHRoZSBlbGVtZW50J3Mgd2l0aCB3aGljaCBzdHlsaW5nIGlzIGFzc29jaWF0ZWQuXG4gKiBAcGFyYW0gY2xhc3NJbmRleCBJbmRleCBvZiBjbGFzcyB0byB0b2dnbGUuIFRoaXMgaW5kZXggdmFsdWUgcmVmZXJzIHRvIHRoZVxuICogICAgICAgIGluZGV4IG9mIHRoZSBjbGFzcyBpbiB0aGUgY2xhc3MgYmluZGluZ3MgYXJyYXkgdGhhdCB3YXMgcGFzc2VkIGludG9cbiAqICAgICAgICBgZWxlbWVudFN0eWxpbmdgICh3aGljaCBpcyBtZWFudCB0byBiZSBjYWxsZWQgYmVmb3JlIHRoaXNcbiAqICAgICAgICBmdW5jdGlvbiBpcykuXG4gKiBAcGFyYW0gdmFsdWUgQSB0cnVlL2ZhbHNlIHZhbHVlIHdoaWNoIHdpbGwgdHVybiB0aGUgY2xhc3Mgb24gb3Igb2ZmLlxuICogQHBhcmFtIGZvcmNlT3ZlcnJpZGUgV2hldGhlciBvciBub3QgdGhpcyB2YWx1ZSB3aWxsIGJlIGFwcGxpZWQgcmVnYXJkbGVzc1xuICogICAgICAgIG9mIHdoZXJlIGl0IGlzIGJlaW5nIHNldCB3aXRoaW4gdGhlIHN0eWxpbmcgcHJpb3JpdHkgc3RydWN0dXJlLlxuICpcbiAqIEBjb2RlR2VuQXBpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiDJtcm1ZWxlbWVudENsYXNzUHJvcChcbiAgICBpbmRleDogbnVtYmVyLCBjbGFzc0luZGV4OiBudW1iZXIsIHZhbHVlOiBib29sZWFuIHwgUGxheWVyRmFjdG9yeSxcbiAgICBmb3JjZU92ZXJyaWRlPzogYm9vbGVhbik6IHZvaWQge1xuICBjb25zdCBpbnB1dCA9ICh2YWx1ZSBpbnN0YW5jZW9mIEJvdW5kUGxheWVyRmFjdG9yeSkgP1xuICAgICAgKHZhbHVlIGFzIEJvdW5kUGxheWVyRmFjdG9yeTxib29sZWFufG51bGw+KSA6XG4gICAgICBib29sZWFuT3JOdWxsKHZhbHVlKTtcbiAgY29uc3Qgc3R5bGluZ0NvbnRleHQgPSBnZXRTdHlsaW5nQ29udGV4dChpbmRleCwgZ2V0TFZpZXcoKSk7XG4gIHVwZGF0ZUVsZW1lbnRDbGFzc1Byb3AoXG4gICAgICBzdHlsaW5nQ29udGV4dCwgY2xhc3NJbmRleCwgaW5wdXQsIERFRkFVTFRfVEVNUExBVEVfRElSRUNUSVZFX0lOREVYLCBmb3JjZU92ZXJyaWRlKTtcbn1cblxuXG4vKipcbiAqIFVwZGF0ZSBhIGNsYXNzIGhvc3QgYmluZGluZyBmb3IgYSBkaXJlY3RpdmUncy9jb21wb25lbnQncyBob3N0IGVsZW1lbnQgd2l0aGluXG4gKiB0aGUgaG9zdCBiaW5kaW5ncyBmdW5jdGlvbi5cbiAqXG4gKiBUaGlzIGluc3RydWN0aW9uIGlzIG1lYW50IHRvIGhhbmRsZSB0aGUgYEBIb3N0QmluZGluZygnY2xhc3MuZm9vJylgIGNhc2UgYW5kLFxuICogdGhlcmVmb3JlLCB0aGUgY2xhc3MgYmluZGluZyBpdHNlbGYgbXVzdCBhbHJlYWR5IGJlIGFsbG9jYXRlZCB1c2luZ1xuICogYGVsZW1lbnRIb3N0U3R5bGluZ2Agd2l0aGluIHRoZSBjcmVhdGlvbiBibG9jay5cbiAqXG4gKiBAcGFyYW0gY2xhc3NJbmRleCBJbmRleCBvZiBjbGFzcyB0byB0b2dnbGUuIFRoaXMgaW5kZXggdmFsdWUgcmVmZXJzIHRvIHRoZVxuICogICAgICAgIGluZGV4IG9mIHRoZSBjbGFzcyBpbiB0aGUgY2xhc3MgYmluZGluZ3MgYXJyYXkgdGhhdCB3YXMgcGFzc2VkIGludG9cbiAqICAgICAgICBgZWxlbWVudEhvc3RTdGx5aW5nYCAod2hpY2ggaXMgbWVhbnQgdG8gYmUgY2FsbGVkIGJlZm9yZSB0aGlzXG4gKiAgICAgICAgZnVuY3Rpb24gaXMpLlxuICogQHBhcmFtIHZhbHVlIEEgdHJ1ZS9mYWxzZSB2YWx1ZSB3aGljaCB3aWxsIHR1cm4gdGhlIGNsYXNzIG9uIG9yIG9mZi5cbiAqIEBwYXJhbSBmb3JjZU92ZXJyaWRlIFdoZXRoZXIgb3Igbm90IHRoaXMgdmFsdWUgd2lsbCBiZSBhcHBsaWVkIHJlZ2FyZGxlc3NcbiAqICAgICAgICBvZiB3aGVyZSBpdCBpcyBiZWluZyBzZXQgd2l0aGluIHRoZSBzdHlsaW5ncyBwcmlvcml0eSBzdHJ1Y3R1cmUuXG4gKlxuICogQGNvZGVHZW5BcGlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIMm1ybVlbGVtZW50SG9zdENsYXNzUHJvcChcbiAgICBjbGFzc0luZGV4OiBudW1iZXIsIHZhbHVlOiBib29sZWFuIHwgUGxheWVyRmFjdG9yeSwgZm9yY2VPdmVycmlkZT86IGJvb2xlYW4pOiB2b2lkIHtcbiAgY29uc3QgZGlyZWN0aXZlU3R5bGluZ0luZGV4ID0gZ2V0QWN0aXZlRGlyZWN0aXZlU3R5bGluZ0luZGV4KCk7XG4gIGNvbnN0IGhvc3RFbGVtZW50SW5kZXggPSBnZXRTZWxlY3RlZEluZGV4KCk7XG4gIGNvbnN0IHN0eWxpbmdDb250ZXh0ID0gZ2V0U3R5bGluZ0NvbnRleHQoaG9zdEVsZW1lbnRJbmRleCwgZ2V0TFZpZXcoKSk7XG5cbiAgY29uc3QgaW5wdXQgPSAodmFsdWUgaW5zdGFuY2VvZiBCb3VuZFBsYXllckZhY3RvcnkpID9cbiAgICAgICh2YWx1ZSBhcyBCb3VuZFBsYXllckZhY3Rvcnk8Ym9vbGVhbnxudWxsPikgOlxuICAgICAgYm9vbGVhbk9yTnVsbCh2YWx1ZSk7XG5cbiAgY29uc3QgYXJnczogUGFyYW1zT2Y8dHlwZW9mIHVwZGF0ZUVsZW1lbnRDbGFzc1Byb3A+ID1cbiAgICAgIFtzdHlsaW5nQ29udGV4dCwgY2xhc3NJbmRleCwgaW5wdXQsIGRpcmVjdGl2ZVN0eWxpbmdJbmRleCwgZm9yY2VPdmVycmlkZV07XG4gIGVucXVldWVIb3N0SW5zdHJ1Y3Rpb24oc3R5bGluZ0NvbnRleHQsIGRpcmVjdGl2ZVN0eWxpbmdJbmRleCwgdXBkYXRlRWxlbWVudENsYXNzUHJvcCwgYXJncyk7XG59XG5cbmZ1bmN0aW9uIGJvb2xlYW5Pck51bGwodmFsdWU6IGFueSk6IGJvb2xlYW58bnVsbCB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJykgcmV0dXJuIHZhbHVlO1xuICByZXR1cm4gdmFsdWUgPyB0cnVlIDogbnVsbDtcbn1cblxuXG4vKipcbiAqIFVwZGF0ZSBzdHlsZSBhbmQvb3IgY2xhc3MgYmluZGluZ3MgdXNpbmcgb2JqZWN0IGxpdGVyYWxzIG9uIGFuIGVsZW1lbnQuXG4gKlxuICogVGhpcyBpbnN0cnVjdGlvbiBpcyBtZWFudCB0byBhcHBseSBzdHlsaW5nIHZpYSB0aGUgYFtzdHlsZV09XCJleHBcImAgYW5kIGBbY2xhc3NdPVwiZXhwXCJgIHRlbXBsYXRlXG4gKiBiaW5kaW5ncy4gV2hlbiBzdHlsZXMvY2xhc3NlcyBhcmUgYXBwbGllZCB0byB0aGUgZWxlbWVudCB0aGV5IHdpbGwgdGhlbiBiZSB1cGRhdGVkIHdpdGhcbiAqIHJlc3BlY3QgdG8gYW55IHN0eWxlcy9jbGFzc2VzIHNldCB3aXRoIGBlbGVtZW50U3R5bGVQcm9wYCBvciBgZWxlbWVudENsYXNzUHJvcGAuIElmIGFueVxuICogc3R5bGVzIG9yIGNsYXNzZXMgYXJlIHNldCB0byBmYWxzeSB0aGVuIHRoZXkgd2lsbCBiZSByZW1vdmVkIGZyb20gdGhlIGVsZW1lbnQuXG4gKlxuICogTm90ZSB0aGF0IHRoZSBzdHlsaW5nIGluc3RydWN0aW9uIHdpbGwgbm90IGJlIGFwcGxpZWQgdW50aWwgYGVsZW1lbnRTdHlsaW5nQXBwbHlgIGlzIGNhbGxlZC5cbiAqXG4gKiBAcGFyYW0gaW5kZXggSW5kZXggb2YgdGhlIGVsZW1lbnQncyB3aXRoIHdoaWNoIHN0eWxpbmcgaXMgYXNzb2NpYXRlZC5cbiAqIEBwYXJhbSBjbGFzc2VzIEEga2V5L3ZhbHVlIG1hcCBvciBzdHJpbmcgb2YgQ1NTIGNsYXNzZXMgdGhhdCB3aWxsIGJlIGFkZGVkIHRvIHRoZVxuICogICAgICAgIGdpdmVuIGVsZW1lbnQuIEFueSBtaXNzaW5nIGNsYXNzZXMgKHRoYXQgaGF2ZSBhbHJlYWR5IGJlZW4gYXBwbGllZCB0byB0aGUgZWxlbWVudFxuICogICAgICAgIGJlZm9yZWhhbmQpIHdpbGwgYmUgcmVtb3ZlZCAodW5zZXQpIGZyb20gdGhlIGVsZW1lbnQncyBsaXN0IG9mIENTUyBjbGFzc2VzLlxuICogQHBhcmFtIHN0eWxlcyBBIGtleS92YWx1ZSBzdHlsZSBtYXAgb2YgdGhlIHN0eWxlcyB0aGF0IHdpbGwgYmUgYXBwbGllZCB0byB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAqICAgICAgICBBbnkgbWlzc2luZyBzdHlsZXMgKHRoYXQgaGF2ZSBhbHJlYWR5IGJlZW4gYXBwbGllZCB0byB0aGUgZWxlbWVudCBiZWZvcmVoYW5kKSB3aWxsIGJlXG4gKiAgICAgICAgcmVtb3ZlZCAodW5zZXQpIGZyb20gdGhlIGVsZW1lbnQncyBzdHlsaW5nLlxuICpcbiAqIEBjb2RlR2VuQXBpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiDJtcm1ZWxlbWVudFN0eWxpbmdNYXAoXG4gICAgaW5kZXg6IG51bWJlciwgY2xhc3Nlczoge1trZXk6IHN0cmluZ106IGFueX0gfCBzdHJpbmcgfCBOT19DSEFOR0UgfCBudWxsLFxuICAgIHN0eWxlcz86IHtbc3R5bGVOYW1lOiBzdHJpbmddOiBhbnl9IHwgTk9fQ0hBTkdFIHwgbnVsbCk6IHZvaWQge1xuICBjb25zdCBsVmlldyA9IGdldExWaWV3KCk7XG4gIGNvbnN0IHN0eWxpbmdDb250ZXh0ID0gZ2V0U3R5bGluZ0NvbnRleHQoaW5kZXgsIGxWaWV3KTtcbiAgY29uc3QgdE5vZGUgPSBnZXRUTm9kZShpbmRleCwgbFZpZXcpO1xuXG4gIC8vIGlucHV0cyBhcmUgb25seSBldmFsdWF0ZWQgZnJvbSBhIHRlbXBsYXRlIGJpbmRpbmcgaW50byBhIGRpcmVjdGl2ZSwgdGhlcmVmb3JlLFxuICAvLyB0aGVyZSBzaG91bGQgbm90IGJlIGEgc2l0dWF0aW9uIHdoZXJlIGEgZGlyZWN0aXZlIGhvc3QgYmluZGluZ3MgZnVuY3Rpb25cbiAgLy8gZXZhbHVhdGVzIHRoZSBpbnB1dHMgKHRoaXMgc2hvdWxkIG9ubHkgaGFwcGVuIGluIHRoZSB0ZW1wbGF0ZSBmdW5jdGlvbilcbiAgaWYgKGhhc0NsYXNzSW5wdXQodE5vZGUpICYmIGNsYXNzZXMgIT09IE5PX0NIQU5HRSkge1xuICAgIGNvbnN0IGluaXRpYWxDbGFzc2VzID0gZ2V0SW5pdGlhbENsYXNzTmFtZVZhbHVlKHN0eWxpbmdDb250ZXh0KTtcbiAgICBjb25zdCBjbGFzc0lucHV0VmFsID1cbiAgICAgICAgKGluaXRpYWxDbGFzc2VzLmxlbmd0aCA/IChpbml0aWFsQ2xhc3NlcyArICcgJykgOiAnJykgKyBmb3JjZUNsYXNzZXNBc1N0cmluZyhjbGFzc2VzKTtcbiAgICBzZXRJbnB1dHNGb3JQcm9wZXJ0eShsVmlldywgdE5vZGUuaW5wdXRzICFbJ2NsYXNzJ10gISwgY2xhc3NJbnB1dFZhbCk7XG4gICAgY2xhc3NlcyA9IE5PX0NIQU5HRTtcbiAgfVxuXG4gIGlmIChoYXNTdHlsZUlucHV0KHROb2RlKSAmJiBzdHlsZXMgIT09IE5PX0NIQU5HRSkge1xuICAgIGNvbnN0IGluaXRpYWxTdHlsZXMgPSBnZXRJbml0aWFsQ2xhc3NOYW1lVmFsdWUoc3R5bGluZ0NvbnRleHQpO1xuICAgIGNvbnN0IHN0eWxlSW5wdXRWYWwgPVxuICAgICAgICAoaW5pdGlhbFN0eWxlcy5sZW5ndGggPyAoaW5pdGlhbFN0eWxlcyArICcgJykgOiAnJykgKyBmb3JjZVN0eWxlc0FzU3RyaW5nKHN0eWxlcyk7XG4gICAgc2V0SW5wdXRzRm9yUHJvcGVydHkobFZpZXcsIHROb2RlLmlucHV0cyAhWydzdHlsZSddICEsIHN0eWxlSW5wdXRWYWwpO1xuICAgIHN0eWxlcyA9IE5PX0NIQU5HRTtcbiAgfVxuXG4gIHVwZGF0ZVN0eWxpbmdNYXAoc3R5bGluZ0NvbnRleHQsIGNsYXNzZXMsIHN0eWxlcyk7XG59XG5cblxuLyoqXG4gKiBVcGRhdGUgc3R5bGUgYW5kL29yIGNsYXNzIGhvc3QgYmluZGluZ3MgdXNpbmcgb2JqZWN0IGxpdGVyYWxzIG9uIGFuIGVsZW1lbnQgd2l0aGluIHRoZSBob3N0XG4gKiBiaW5kaW5ncyBmdW5jdGlvbiBmb3IgYSBkaXJlY3RpdmUvY29tcG9uZW50LlxuICpcbiAqIFRoaXMgaW5zdHJ1Y3Rpb24gaXMgbWVhbnQgdG8gYXBwbHkgc3R5bGluZyB2aWEgdGhlIGBASG9zdEJpbmRpbmcoJ3N0eWxlJylgIGFuZFxuICogYEBIb3N0QmluZGluZygnY2xhc3MnKWAgYmluZGluZ3MgZm9yIGEgY29tcG9uZW50J3Mgb3IgZGlyZWN0aXZlJ3MgaG9zdCBlbGVtZW50LlxuICogV2hlbiBzdHlsZXMvY2xhc3NlcyBhcmUgYXBwbGllZCB0byB0aGUgaG9zdCBlbGVtZW50IHRoZXkgd2lsbCB0aGVuIGJlIHVwZGF0ZWRcbiAqIHdpdGggcmVzcGVjdCB0byBhbnkgc3R5bGVzL2NsYXNzZXMgc2V0IHdpdGggYGVsZW1lbnRIb3N0U3R5bGVQcm9wYCBvclxuICogYGVsZW1lbnRIb3N0Q2xhc3NQcm9wYC4gSWYgYW55IHN0eWxlcyBvciBjbGFzc2VzIGFyZSBzZXQgdG8gZmFsc3kgdGhlbiB0aGV5XG4gKiB3aWxsIGJlIHJlbW92ZWQgZnJvbSB0aGUgZWxlbWVudC5cbiAqXG4gKiBOb3RlIHRoYXQgdGhlIHN0eWxpbmcgaW5zdHJ1Y3Rpb24gd2lsbCBub3QgYmUgYXBwbGllZCB1bnRpbFxuICogYGVsZW1lbnRIb3N0U3R5bGluZ0FwcGx5YCBpcyBjYWxsZWQuXG4gKlxuICogQHBhcmFtIGNsYXNzZXMgQSBrZXkvdmFsdWUgbWFwIG9yIHN0cmluZyBvZiBDU1MgY2xhc3NlcyB0aGF0IHdpbGwgYmUgYWRkZWQgdG8gdGhlXG4gKiAgICAgICAgZ2l2ZW4gZWxlbWVudC4gQW55IG1pc3NpbmcgY2xhc3NlcyAodGhhdCBoYXZlIGFscmVhZHkgYmVlbiBhcHBsaWVkIHRvIHRoZSBlbGVtZW50XG4gKiAgICAgICAgYmVmb3JlaGFuZCkgd2lsbCBiZSByZW1vdmVkICh1bnNldCkgZnJvbSB0aGUgZWxlbWVudCdzIGxpc3Qgb2YgQ1NTIGNsYXNzZXMuXG4gKiBAcGFyYW0gc3R5bGVzIEEga2V5L3ZhbHVlIHN0eWxlIG1hcCBvZiB0aGUgc3R5bGVzIHRoYXQgd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBnaXZlbiBlbGVtZW50LlxuICogICAgICAgIEFueSBtaXNzaW5nIHN0eWxlcyAodGhhdCBoYXZlIGFscmVhZHkgYmVlbiBhcHBsaWVkIHRvIHRoZSBlbGVtZW50IGJlZm9yZWhhbmQpIHdpbGwgYmVcbiAqICAgICAgICByZW1vdmVkICh1bnNldCkgZnJvbSB0aGUgZWxlbWVudCdzIHN0eWxpbmcuXG4gKlxuICogQGNvZGVHZW5BcGlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIMm1ybVlbGVtZW50SG9zdFN0eWxpbmdNYXAoXG4gICAgY2xhc3Nlczoge1trZXk6IHN0cmluZ106IGFueX0gfCBzdHJpbmcgfCBOT19DSEFOR0UgfCBudWxsLFxuICAgIHN0eWxlcz86IHtbc3R5bGVOYW1lOiBzdHJpbmddOiBhbnl9IHwgTk9fQ0hBTkdFIHwgbnVsbCk6IHZvaWQge1xuICBjb25zdCBkaXJlY3RpdmVTdHlsaW5nSW5kZXggPSBnZXRBY3RpdmVEaXJlY3RpdmVTdHlsaW5nSW5kZXgoKTtcbiAgY29uc3QgaG9zdEVsZW1lbnRJbmRleCA9IGdldFNlbGVjdGVkSW5kZXgoKTtcbiAgY29uc3Qgc3R5bGluZ0NvbnRleHQgPSBnZXRTdHlsaW5nQ29udGV4dChob3N0RWxlbWVudEluZGV4LCBnZXRMVmlldygpKTtcbiAgY29uc3QgYXJnczogUGFyYW1zT2Y8dHlwZW9mIHVwZGF0ZVN0eWxpbmdNYXA+ID1cbiAgICAgIFtzdHlsaW5nQ29udGV4dCwgY2xhc3Nlcywgc3R5bGVzLCBkaXJlY3RpdmVTdHlsaW5nSW5kZXhdO1xuICBlbnF1ZXVlSG9zdEluc3RydWN0aW9uKHN0eWxpbmdDb250ZXh0LCBkaXJlY3RpdmVTdHlsaW5nSW5kZXgsIHVwZGF0ZVN0eWxpbmdNYXAsIGFyZ3MpO1xufVxuXG5cbi8qKlxuICogQXBwbHkgYWxsIHN0eWxlIGFuZCBjbGFzcyBiaW5kaW5nIHZhbHVlcyB0byB0aGUgZWxlbWVudC5cbiAqXG4gKiBUaGlzIGluc3RydWN0aW9uIGlzIG1lYW50IHRvIGJlIHJ1biBhZnRlciBgZWxlbWVudFN0eWxpbmdNYXBgLCBgZWxlbWVudFN0eWxlUHJvcGBcbiAqIG9yIGBlbGVtZW50Q2xhc3NQcm9wYCBpbnN0cnVjdGlvbnMgaGF2ZSBiZWVuIHJ1biBhbmQgd2lsbCBvbmx5IGFwcGx5IHN0eWxpbmcgdG9cbiAqIHRoZSBlbGVtZW50IGlmIGFueSBzdHlsaW5nIGJpbmRpbmdzIGhhdmUgYmVlbiB1cGRhdGVkLlxuICpcbiAqIEBwYXJhbSBpbmRleCBJbmRleCBvZiB0aGUgZWxlbWVudCdzIHdpdGggd2hpY2ggc3R5bGluZyBpcyBhc3NvY2lhdGVkLlxuICpcbiAqIEBjb2RlR2VuQXBpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiDJtcm1ZWxlbWVudFN0eWxpbmdBcHBseShpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gIGVsZW1lbnRTdHlsaW5nQXBwbHlJbnRlcm5hbChERUZBVUxUX1RFTVBMQVRFX0RJUkVDVElWRV9JTkRFWCwgaW5kZXgpO1xufVxuXG4vKipcbiAqIEFwcGx5IGFsbCBzdHlsZSBhbmQgY2xhc3MgaG9zdCBiaW5kaW5nIHZhbHVlcyB0byB0aGUgZWxlbWVudC5cbiAqXG4gKiBUaGlzIGluc3RydWN0aW9uIGlzIG1lYW50IHRvIGJlIHJ1biBhZnRlciBgZWxlbWVudEhvc3RTdHlsaW5nTWFwYCxcbiAqIGBlbGVtZW50SG9zdFN0eWxlUHJvcGAgb3IgYGVsZW1lbnRIb3N0Q2xhc3NQcm9wYCBpbnN0cnVjdGlvbnMgaGF2ZVxuICogYmVlbiBydW4gYW5kIHdpbGwgb25seSBhcHBseSBzdHlsaW5nIHRvIHRoZSBob3N0IGVsZW1lbnQgaWYgYW55XG4gKiBzdHlsaW5nIGJpbmRpbmdzIGhhdmUgYmVlbiB1cGRhdGVkLlxuICpcbiAqIEBjb2RlR2VuQXBpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiDJtcm1ZWxlbWVudEhvc3RTdHlsaW5nQXBwbHkoKTogdm9pZCB7XG4gIGVsZW1lbnRTdHlsaW5nQXBwbHlJbnRlcm5hbChnZXRBY3RpdmVEaXJlY3RpdmVTdHlsaW5nSW5kZXgoKSwgZ2V0U2VsZWN0ZWRJbmRleCgpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVsZW1lbnRTdHlsaW5nQXBwbHlJbnRlcm5hbChkaXJlY3RpdmVTdHlsaW5nSW5kZXg6IG51bWJlciwgaW5kZXg6IG51bWJlcik6IHZvaWQge1xuICBjb25zdCBsVmlldyA9IGdldExWaWV3KCk7XG4gIGNvbnN0IHROb2RlID0gZ2V0VE5vZGUoaW5kZXgsIGxWaWV3KTtcblxuICAvLyBpZiBhIG5vbi1lbGVtZW50IHZhbHVlIGlzIGJlaW5nIHByb2Nlc3NlZCB0aGVuIHdlIGNhbid0IHJlbmRlciB2YWx1ZXNcbiAgLy8gb24gdGhlIGVsZW1lbnQgYXQgYWxsIHRoZXJlZm9yZSBieSBzZXR0aW5nIHRoZSByZW5kZXJlciB0byBudWxsIHRoZW5cbiAgLy8gdGhlIHN0eWxpbmcgYXBwbHkgY29kZSBrbm93cyBub3QgdG8gYWN0dWFsbHkgYXBwbHkgdGhlIHZhbHVlcy4uLlxuICBjb25zdCByZW5kZXJlciA9IHROb2RlLnR5cGUgPT09IFROb2RlVHlwZS5FbGVtZW50ID8gbFZpZXdbUkVOREVSRVJdIDogbnVsbDtcbiAgY29uc3QgaXNGaXJzdFJlbmRlciA9IChsVmlld1tGTEFHU10gJiBMVmlld0ZsYWdzLkZpcnN0TFZpZXdQYXNzKSAhPT0gMDtcbiAgY29uc3Qgc3R5bGluZ0NvbnRleHQgPSBnZXRTdHlsaW5nQ29udGV4dChpbmRleCwgbFZpZXcpO1xuICBjb25zdCB0b3RhbFBsYXllcnNRdWV1ZWQgPSByZW5kZXJTdHlsaW5nKFxuICAgICAgc3R5bGluZ0NvbnRleHQsIHJlbmRlcmVyLCBsVmlldywgaXNGaXJzdFJlbmRlciwgbnVsbCwgbnVsbCwgZGlyZWN0aXZlU3R5bGluZ0luZGV4KTtcbiAgaWYgKHRvdGFsUGxheWVyc1F1ZXVlZCA+IDApIHtcbiAgICBjb25zdCByb290Q29udGV4dCA9IGdldFJvb3RDb250ZXh0KGxWaWV3KTtcbiAgICBzY2hlZHVsZVRpY2socm9vdENvbnRleHQsIFJvb3RDb250ZXh0RmxhZ3MuRmx1c2hQbGF5ZXJzKTtcbiAgfVxuXG4gIC8vIGJlY2F1c2Ugc2VsZWN0KG4pIG1heSBub3QgcnVuIGJldHdlZW4gZXZlcnkgaW5zdHJ1Y3Rpb24sIHRoZSBjYWNoZWQgc3R5bGluZ1xuICAvLyBjb250ZXh0IG1heSBub3QgZ2V0IGNsZWFyZWQgYmV0d2VlbiBlbGVtZW50cy4gVGhlIHJlYXNvbiBmb3IgdGhpcyBpcyBiZWNhdXNlXG4gIC8vIHN0eWxpbmcgYmluZGluZ3MgKGxpa2UgYFtzdHlsZV1gIGFuZCBgW2NsYXNzXWApIGFyZSBub3QgcmVjb2duaXplZCBhcyBwcm9wZXJ0eVxuICAvLyBiaW5kaW5ncyBieSBkZWZhdWx0IHNvIGEgc2VsZWN0KG4pIGluc3RydWN0aW9uIGlzIG5vdCBnZW5lcmF0ZWQuIFRvIGVuc3VyZSB0aGVcbiAgLy8gY29udGV4dCBpcyBsb2FkZWQgY29ycmVjdGx5IGZvciB0aGUgbmV4dCBlbGVtZW50IHRoZSBjYWNoZSBiZWxvdyBpcyBwcmUtZW1wdGl2ZWx5XG4gIC8vIGNsZWFyZWQgYmVjYXVzZSB0aGVyZSBpcyBubyBjb2RlIGluIEFuZ3VsYXIgdGhhdCBhcHBsaWVzIG1vcmUgc3R5bGluZyBjb2RlIGFmdGVyIGFcbiAgLy8gc3R5bGluZyBmbHVzaCBoYXMgb2NjdXJyZWQuIE5vdGUgdGhhdCB0aGlzIHdpbGwgYmUgZml4ZWQgb25jZSBGVy0xMjU0IGxhbmRzLlxuICBzZXRDYWNoZWRTdHlsaW5nQ29udGV4dChudWxsKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFjdGl2ZURpcmVjdGl2ZVN0eWxpbmdJbmRleCgpIHtcbiAgLy8gd2hlbmV2ZXIgYSBkaXJlY3RpdmUncyBob3N0QmluZGluZ3MgZnVuY3Rpb24gaXMgY2FsbGVkIGEgdW5pcXVlSWQgdmFsdWVcbiAgLy8gaXMgYXNzaWduZWQuIE5vcm1hbGx5IHRoaXMgaXMgZW5vdWdoIHRvIGhlbHAgZGlzdGluZ3Vpc2ggb25lIGRpcmVjdGl2ZVxuICAvLyBmcm9tIGFub3RoZXIgZm9yIHRoZSBzdHlsaW5nIGNvbnRleHQsIGJ1dCB0aGVyZSBhcmUgc2l0dWF0aW9ucyB3aGVyZSBhXG4gIC8vIHN1Yi1jbGFzcyBkaXJlY3RpdmUgY291bGQgaW5oZXJpdCBhbmQgYXNzaWduIHN0eWxpbmcgaW4gY29uY2VydCB3aXRoIGFcbiAgLy8gcGFyZW50IGRpcmVjdGl2ZS4gVG8gaGVscCB0aGUgc3R5bGluZyBjb2RlIGRpc3Rpbmd1aXNoIGJldHdlZW4gYSBwYXJlbnRcbiAgLy8gc3ViLWNsYXNzZWQgZGlyZWN0aXZlIHRoZSBpbmhlcml0YW5jZSBkZXB0aCBpcyB0YWtlbiBpbnRvIGFjY291bnQgYXMgd2VsbC5cbiAgcmV0dXJuIGdldEFjdGl2ZURpcmVjdGl2ZUlkKCkgKyBnZXRBY3RpdmVEaXJlY3RpdmVTdXBlckNsYXNzRGVwdGgoKTtcbn1cblxuZnVuY3Rpb24gZ2V0U3R5bGluZ0NvbnRleHQoaW5kZXg6IG51bWJlciwgbFZpZXc6IExWaWV3KSB7XG4gIGxldCBjb250ZXh0ID0gZ2V0Q2FjaGVkU3R5bGluZ0NvbnRleHQoKTtcbiAgaWYgKCFjb250ZXh0KSB7XG4gICAgY29udGV4dCA9IGdldFN0eWxpbmdDb250ZXh0RnJvbUxWaWV3KGluZGV4ICsgSEVBREVSX09GRlNFVCwgbFZpZXcpO1xuICAgIHNldENhY2hlZFN0eWxpbmdDb250ZXh0KGNvbnRleHQpO1xuICB9IGVsc2UgaWYgKG5nRGV2TW9kZSkge1xuICAgIGNvbnN0IGFjdHVhbENvbnRleHQgPSBnZXRTdHlsaW5nQ29udGV4dEZyb21MVmlldyhpbmRleCArIEhFQURFUl9PRkZTRVQsIGxWaWV3KTtcbiAgICBhc3NlcnRFcXVhbChjb250ZXh0LCBhY3R1YWxDb250ZXh0LCAnVGhlIGNhY2hlZCBzdHlsaW5nIGNvbnRleHQgaXMgaW52YWxpZCcpO1xuICB9XG4gIHJldHVybiBjb250ZXh0O1xufVxuIl19