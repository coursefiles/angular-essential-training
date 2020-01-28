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
 * Represents a set of CSS styles for use in an animation style.
 * @record
 */
export function ɵStyleData() { }
/** @enum {number} */
const AnimationMetadataType = {
    /**
     * Associates a named animation state with a set of CSS styles.
     * See `state()`
     */
    State: 0,
    /**
     * Data for a transition from one animation state to another.
     * See `transition()`
     */
    Transition: 1,
    /**
     * Contains a set of animation steps.
     * See `sequence()`
     */
    Sequence: 2,
    /**
     * Contains a set of animation steps.
     * See `{@link animations/group group()}`
     */
    Group: 3,
    /**
     * Contains an animation step.
     * See `animate()`
     */
    Animate: 4,
    /**
     * Contains a set of animation steps.
     * See `keyframes()`
     */
    Keyframes: 5,
    /**
     * Contains a set of CSS property-value pairs into a named style.
     * See `style()`
     */
    Style: 6,
    /**
     * Associates an animation with an entry trigger that can be attached to an element.
     * See `trigger()`
     */
    Trigger: 7,
    /**
     * Contains a re-usable animation.
     * See `animation()`
     */
    Reference: 8,
    /**
     * Contains data to use in executing child animations returned by a query.
     * See `animateChild()`
     */
    AnimateChild: 9,
    /**
     * Contains animation parameters for a re-usable animation.
     * See `useAnimation()`
     */
    AnimateRef: 10,
    /**
     * Contains child-animation query data.
     * See `query()`
     */
    Query: 11,
    /**
     * Contains data for staggering an animation sequence.
     * See `stagger()`
     */
    Stagger: 12,
};
export { AnimationMetadataType };
/**
 * Specifies automatic styling.
 *
 * \@publicApi
 * @type {?}
 */
export const AUTO_STYLE = '*';
/**
 * Base for animation data structures.
 *
 * \@publicApi
 * @record
 */
export function AnimationMetadata() { }
if (false) {
    /** @type {?} */
    AnimationMetadata.prototype.type;
}
/**
 * Contains an animation trigger. Instantiated and returned by the
 * `trigger()` function.
 *
 * \@publicApi
 * @record
 */
export function AnimationTriggerMetadata() { }
if (false) {
    /**
     * The trigger name, used to associate it with an element. Unique within the component.
     * @type {?}
     */
    AnimationTriggerMetadata.prototype.name;
    /**
     * An animation definition object, containing an array of state and transition declarations.
     * @type {?}
     */
    AnimationTriggerMetadata.prototype.definitions;
    /**
     * An options object containing a delay and
     * developer-defined parameters that provide styling defaults and
     * can be overridden on invocation. Default delay is 0.
     * @type {?}
     */
    AnimationTriggerMetadata.prototype.options;
}
/**
 * Encapsulates an animation state by associating a state name with a set of CSS styles.
 * Instantiated and returned by the `state()` function.
 *
 * \@publicApi
 * @record
 */
export function AnimationStateMetadata() { }
if (false) {
    /**
     * The state name, unique within the component.
     * @type {?}
     */
    AnimationStateMetadata.prototype.name;
    /**
     *  The CSS styles associated with this state.
     * @type {?}
     */
    AnimationStateMetadata.prototype.styles;
    /**
     * An options object containing
     * developer-defined parameters that provide styling defaults and
     * can be overridden on invocation.
     * @type {?|undefined}
     */
    AnimationStateMetadata.prototype.options;
}
/**
 * Encapsulates an animation transition. Instantiated and returned by the
 * `transition()` function.
 *
 * \@publicApi
 * @record
 */
export function AnimationTransitionMetadata() { }
if (false) {
    /**
     * An expression that describes a state change.
     * @type {?}
     */
    AnimationTransitionMetadata.prototype.expr;
    /**
     * One or more animation objects to which this transition applies.
     * @type {?}
     */
    AnimationTransitionMetadata.prototype.animation;
    /**
     * An options object containing a delay and
     * developer-defined parameters that provide styling defaults and
     * can be overridden on invocation. Default delay is 0.
     * @type {?}
     */
    AnimationTransitionMetadata.prototype.options;
}
/**
 * Encapsulates a reusable animation, which is a collection of individual animation steps.
 * Instantiated and returned by the `animation()` function, and
 * passed to the `useAnimation()` function.
 *
 * \@publicApi
 * @record
 */
export function AnimationReferenceMetadata() { }
if (false) {
    /**
     *  One or more animation step objects.
     * @type {?}
     */
    AnimationReferenceMetadata.prototype.animation;
    /**
     * An options object containing a delay and
     * developer-defined parameters that provide styling defaults and
     * can be overridden on invocation. Default delay is 0.
     * @type {?}
     */
    AnimationReferenceMetadata.prototype.options;
}
/**
 * Encapsulates an animation query. Instantiated and returned by
 * the `query()` function.
 *
 * \@publicApi
 * @record
 */
export function AnimationQueryMetadata() { }
if (false) {
    /**
     *  The CSS selector for this query.
     * @type {?}
     */
    AnimationQueryMetadata.prototype.selector;
    /**
     * One or more animation step objects.
     * @type {?}
     */
    AnimationQueryMetadata.prototype.animation;
    /**
     * A query options object.
     * @type {?}
     */
    AnimationQueryMetadata.prototype.options;
}
/**
 * Encapsulates a keyframes sequence. Instantiated and returned by
 * the `keyframes()` function.
 *
 * \@publicApi
 * @record
 */
export function AnimationKeyframesSequenceMetadata() { }
if (false) {
    /**
     * An array of animation styles.
     * @type {?}
     */
    AnimationKeyframesSequenceMetadata.prototype.steps;
}
/**
 * Encapsulates an animation style. Instantiated and returned by
 * the `style()` function.
 *
 * \@publicApi
 * @record
 */
export function AnimationStyleMetadata() { }
if (false) {
    /**
     * A set of CSS style properties.
     * @type {?}
     */
    AnimationStyleMetadata.prototype.styles;
    /**
     * A percentage of the total animate time at which the style is to be applied.
     * @type {?}
     */
    AnimationStyleMetadata.prototype.offset;
}
/**
 * Encapsulates an animation step. Instantiated and returned by
 * the `animate()` function.
 *
 * \@publicApi
 * @record
 */
export function AnimationAnimateMetadata() { }
if (false) {
    /**
     * The timing data for the step.
     * @type {?}
     */
    AnimationAnimateMetadata.prototype.timings;
    /**
     * A set of styles used in the step.
     * @type {?}
     */
    AnimationAnimateMetadata.prototype.styles;
}
/**
 * Encapsulates a child animation, that can be run explicitly when the parent is run.
 * Instantiated and returned by the `animateChild` function.
 *
 * \@publicApi
 * @record
 */
export function AnimationAnimateChildMetadata() { }
if (false) {
    /**
     * An options object containing a delay and
     * developer-defined parameters that provide styling defaults and
     * can be overridden on invocation. Default delay is 0.
     * @type {?}
     */
    AnimationAnimateChildMetadata.prototype.options;
}
/**
 * Encapsulates a reusable animation.
 * Instantiated and returned by the `useAnimation()` function.
 *
 * \@publicApi
 * @record
 */
export function AnimationAnimateRefMetadata() { }
if (false) {
    /**
     * An animation reference object.
     * @type {?}
     */
    AnimationAnimateRefMetadata.prototype.animation;
    /**
     * An options object containing a delay and
     * developer-defined parameters that provide styling defaults and
     * can be overridden on invocation. Default delay is 0.
     * @type {?}
     */
    AnimationAnimateRefMetadata.prototype.options;
}
/**
 * Encapsulates an animation sequence.
 * Instantiated and returned by the `sequence()` function.
 *
 * \@publicApi
 * @record
 */
export function AnimationSequenceMetadata() { }
if (false) {
    /**
     *  An array of animation step objects.
     * @type {?}
     */
    AnimationSequenceMetadata.prototype.steps;
    /**
     * An options object containing a delay and
     * developer-defined parameters that provide styling defaults and
     * can be overridden on invocation. Default delay is 0.
     * @type {?}
     */
    AnimationSequenceMetadata.prototype.options;
}
/**
 * Encapsulates an animation group.
 * Instantiated and returned by the `{\@link animations/group group()}` function.
 *
 * \@publicApi
 * @record
 */
export function AnimationGroupMetadata() { }
if (false) {
    /**
     * One or more animation or style steps that form this group.
     * @type {?}
     */
    AnimationGroupMetadata.prototype.steps;
    /**
     * An options object containing a delay and
     * developer-defined parameters that provide styling defaults and
     * can be overridden on invocation. Default delay is 0.
     * @type {?}
     */
    AnimationGroupMetadata.prototype.options;
}
/**
 * Encapsulates parameters for staggering the start times of a set of animation steps.
 * Instantiated and returned by the `stagger()` function.
 *
 * \@publicApi
 *
 * @record
 */
export function AnimationStaggerMetadata() { }
if (false) {
    /**
     * The timing data for the steps.
     * @type {?}
     */
    AnimationStaggerMetadata.prototype.timings;
    /**
     * One or more animation steps.
     * @type {?}
     */
    AnimationStaggerMetadata.prototype.animation;
}
/**
 * Creates a named animation trigger, containing a  list of `state()`
 * and `transition()` entries to be evaluated when the expression
 * bound to the trigger changes.
 *
 * \@usageNotes
 * Define an animation trigger in the `animations` section of `\@Component` metadata.
 * In the template, reference the trigger by name and bind it to a trigger expression that
 * evaluates to a defined animation state, using the following format:
 *
 * `[\@triggerName]="expression"`
 *
 * Animation trigger bindings convert all values to strings, and then match the
 * previous and current values against any linked transitions.
 * Booleans can be specified as `1` or `true` and `0` or `false`.
 *
 * ### Usage Example
 *
 * The following example creates an animation trigger reference based on the provided
 * name value.
 * The provided animation value is expected to be an array consisting of state and
 * transition declarations.
 *
 * ```typescript
 * \@Component({
 *   selector: "my-component",
 *   templateUrl: "my-component-tpl.html",
 *   animations: [
 *     trigger("myAnimationTrigger", [
 *       state(...),
 *       state(...),
 *       transition(...),
 *       transition(...)
 *     ])
 *   ]
 * })
 * class MyComponent {
 *   myStatusExp = "something";
 * }
 * ```
 *
 * The template associated with this component makes use of the defined trigger
 * by binding to an element within its template code.
 *
 * ```html
 * <!-- somewhere inside of my-component-tpl.html -->
 * <div [\@myAnimationTrigger]="myStatusExp">...</div>
 * ```
 *
 * ### Using an inline function
 * The `transition` animation method also supports reading an inline function which can decide
 * if its associated animation should be run.
 *
 * ```typescript
 * // this method is run each time the `myAnimationTrigger` trigger value changes.
 * function myInlineMatcherFn(fromState: string, toState: string, element: any, params: {[key:
 * string]: any}): boolean {
 *   // notice that `element` and `params` are also available here
 *   return toState == 'yes-please-animate';
 * }
 *  /
 *   selector: 'my-component',
 *   templateUrl: 'my-component-tpl.html',
 *   animations: [
 *     trigger('myAnimationTrigger', [
 *       transition(myInlineMatcherFn, [
 *         // the animation sequence code
 *       ]),
 *     ])
 *   ]
 * })
 * class MyComponent {
 *   myStatusExp = "yes-please-animate";
 * }
 * ```
 *
 * ### Disabling Animations
 * When true, the special animation control binding `\@.disabled` binding prevents
 * all animations from rendering.
 * Place the  `\@.disabled` binding on an element to disable
 * animations on the element itself, as well as any inner animation triggers
 * within the element.
 *
 * The following example shows how to use this feature:
 *
 * ```typescript /
 *   selector: 'my-component',
 *   template: `
 *     <div [\@.disabled]="isDisabled">
 *       <div [\@childAnimation]="exp"></div>
 *     </div>
 *   `,
 *   animations: [
 *     trigger("childAnimation", [
 *       // ...
 *     ])
 *   ]
 * })
 * class MyComponent {
 *   isDisabled = true;
 *   exp = '...';
 * }
 * ```
 *
 * When `\@.disabled` is true, it prevents the `\@childAnimation` trigger from animating,
 * along with any inner animations.
 *
 * ### Disable animations application-wide
 * When an area of the template is set to have animations disabled,
 * **all** inner components have their animations disabled as well.
 * This means that you can disable all animations for an app
 * by placing a host binding set on `\@.disabled` on the topmost Angular component.
 *
 * ```typescript
 * import {Component, HostBinding} from '\@angular/core';
 *  /
 *   selector: 'app-component',
 *   templateUrl: 'app.component.html',
 * })
 * class AppComponent {
 * \@HostBinding('@.disabled')
 *   public animationsDisabled = true;
 * }
 * ```
 *
 * ### Overriding disablement of inner animations
 * Despite inner animations being disabled, a parent animation can `query()`
 * for inner elements located in disabled areas of the template and still animate
 * them if needed. This is also the case for when a sub animation is
 * queried by a parent and then later animated using `animateChild()`.
 *
 * ### Detecting when an animation is disabled
 * If a region of the DOM (or the entire application) has its animations disabled, the animation
 * trigger callbacks still fire, but for zero seconds. When the callback fires, it provides
 * an instance of an `AnimationEvent`. If animations are disabled,
 * the `.disabled` flag on the event is true.
 *
 * \@publicApi
 * @param {?} name An identifying string.
 * @param {?} definitions  An animation definition object, containing an array of `state()`
 * and `transition()` declarations.
 *
 * @return {?} An object that encapsulates the trigger data.
 *
 */
export function trigger(name, definitions) {
    return { type: 7 /* Trigger */, name, definitions, options: {} };
}
/**
 * Defines an animation step that combines styling information with timing information.
 *
 * \@usageNotes
 * Call within an animation `sequence()`, `{\@link animations/group group()}`, or
 * `transition()` call to specify an animation step
 * that applies given style data to the parent animation for a given amount of time.
 *
 * ### Syntax Examples
 * **Timing examples**
 *
 * The following examples show various `timings` specifications.
 * - `animate(500)` : Duration is 500 milliseconds.
 * - `animate("1s")` : Duration is 1000 milliseconds.
 * - `animate("100ms 0.5s")` : Duration is 100 milliseconds, delay is 500 milliseconds.
 * - `animate("5s ease-in")` : Duration is 5000 milliseconds, easing in.
 * - `animate("5s 10ms cubic-bezier(.17,.67,.88,.1)")` : Duration is 5000 milliseconds, delay is 10
 * milliseconds, easing according to a bezier curve.
 *
 * **Style examples**
 *
 * The following example calls `style()` to set a single CSS style.
 * ```typescript
 * animate(500, style({ background: "red" }))
 * ```
 * The following example calls `keyframes()` to set a CSS style
 * to different values for successive keyframes.
 * ```typescript
 * animate(500, keyframes(
 *  [
 *   style({ background: "blue" })),
 *   style({ background: "red" }))
 *  ])
 * ```
 *
 * \@publicApi
 * @param {?} timings Sets `AnimateTimings` for the parent animation.
 * A string in the format "duration [delay] [easing]".
 *  - Duration and delay are expressed as a number and optional time unit,
 * such as "1s" or "10ms" for one second and 10 milliseconds, respectively.
 * The default unit is milliseconds.
 *  - The easing value controls how the animation accelerates and decelerates
 * during its runtime. Value is one of  `ease`, `ease-in`, `ease-out`,
 * `ease-in-out`, or a `cubic-bezier()` function call.
 * If not supplied, no easing is applied.
 *
 * For example, the string "1s 100ms ease-out" specifies a duration of
 * 1000 milliseconds, and delay of 100 ms, and the "ease-out" easing style,
 * which decelerates near the end of the duration.
 * @param {?=} styles Sets AnimationStyles for the parent animation.
 * A function call to either `style()` or `keyframes()`
 * that returns a collection of CSS style entries to be applied to the parent animation.
 * When null, uses the styles from the destination state.
 * This is useful when describing an animation step that will complete an animation;
 * see "Animating to the final state" in `transitions()`.
 * @return {?} An object that encapsulates the animation step.
 *
 */
export function animate(timings, styles = null) {
    return { type: 4 /* Animate */, styles, timings };
}
/**
 * \@description Defines a list of animation steps to be run in parallel.
 *
 * \@usageNotes
 * Grouped animations are useful when a series of styles must be
 * animated at different starting times and closed off at different ending times.
 *
 * When called within a `sequence()` or a
 * `transition()` call, does not continue to the next
 * instruction until all of the inner animation steps have completed.
 *
 * \@publicApi
 * @param {?} steps An array of animation step objects.
 * - When steps are defined by `style()` or `animate()`
 * function calls, each call within the group is executed instantly.
 * - To specify offset styles to be applied at a later time, define steps with
 * `keyframes()`, or use `animate()` calls with a delay value.
 * For example:
 *
 * ```typescript
 * group([
 *   animate("1s", style({ background: "black" })),
 *   animate("2s", style({ color: "white" }))
 * ])
 * ```
 *
 * @param {?=} options An options object containing a delay and
 * developer-defined parameters that provide styling defaults and
 * can be overridden on invocation.
 *
 * @return {?} An object that encapsulates the group data.
 *
 */
export function group(steps, options = null) {
    return { type: 3 /* Group */, steps, options };
}
/**
 * Defines a list of animation steps to be run sequentially, one by one.
 *
 * \@usageNotes
 * When you pass an array of steps to a
 * `transition()` call, the steps run sequentially by default.
 * Compare this to the `{\@link animations/group group()}` call, which runs animation steps in parallel.
 *
 * When a sequence is used within a `{\@link animations/group group()}` or a `transition()` call,
 * execution continues to the next instruction only after each of the inner animation
 * steps have completed.
 *
 * \@publicApi
 *
 * @param {?} steps An array of animation step objects.
 * - Steps defined by `style()` calls apply the styling data immediately.
 * - Steps defined by `animate()` calls apply the styling data over time
 *   as specified by the timing data.
 *
 * ```typescript
 * sequence([
 *   style({ opacity: 0 })),
 *   animate("1s", style({ opacity: 1 }))
 * ])
 * ```
 *
 * @param {?=} options An options object containing a delay and
 * developer-defined parameters that provide styling defaults and
 * can be overridden on invocation.
 *
 * @return {?} An object that encapsulates the sequence data.
 *
 */
export function sequence(steps, options = null) {
    return { type: 2 /* Sequence */, steps, options };
}
/**
 * Declares a key/value object containing CSS properties/styles that
 * can then be used for an animation `state`, within an animation `sequence`,
 * or as styling data for calls to `animate()` and `keyframes()`.
 *
 * \@usageNotes
 * The following examples create animation styles that collect a set of
 * CSS property values:
 *
 * ```typescript
 * // string values for CSS properties
 * style({ background: "red", color: "blue" })
 *
 * // numerical pixel values
 * style({ width: 100, height: 0 })
 * ```
 *
 * The following example uses auto-styling to allow a component to animate from
 * a height of 0 up to the height of the parent element:
 *
 * ```
 * style({ height: 0 }),
 * animate("1s", style({ height: "*" }))
 * ```
 *
 * \@publicApi
 *
 * @param {?} tokens A set of CSS styles or HTML styles associated with an animation state.
 * The value can be any of the following:
 * - A key-value style pair associating a CSS property with a value.
 * - An array of key-value style pairs.
 * - An asterisk (*), to use auto-styling, where styles are derived from the element
 * being animated and applied to the animation when it starts.
 *
 * Auto-styling can be used to define a state that depends on layout or other
 * environmental factors.
 *
 * @return {?} An object that encapsulates the style data.
 *
 */
export function style(tokens) {
    return { type: 6 /* Style */, styles: tokens, offset: null };
}
/**
 * Declares an animation state within a trigger attached to an element.
 *
 * \@usageNotes
 * Use the `trigger()` function to register states to an animation trigger.
 * Use the `transition()` function to animate between states.
 * When a state is active within a component, its associated styles persist on the element,
 * even when the animation ends.
 *
 * \@publicApi
 *
 * @param {?} name One or more names for the defined state in a comma-separated string.
 * The following reserved state names can be supplied to define a style for specific use
 * cases:
 *
 * - `void` You can associate styles with this name to be used when
 * the element is detached from the application. For example, when an `ngIf` evaluates
 * to false, the state of the associated element is void.
 *  - `*` (asterisk) Indicates the default state. You can associate styles with this name
 * to be used as the fallback when the state that is being animated is not declared
 * within the trigger.
 *
 * @param {?} styles A set of CSS styles associated with this state, created using the
 * `style()` function.
 * This set of styles persists on the element once the state has been reached.
 * @param {?=} options Parameters that can be passed to the state when it is invoked.
 * 0 or more key-value pairs.
 * @return {?} An object that encapsulates the new state data.
 *
 */
export function state(name, styles, options) {
    return { type: 0 /* State */, name, styles, options };
}
/**
 * Defines a set of animation styles, associating each style with an optional `offset` value.
 *
 * \@usageNotes
 * Use with the `animate()` call. Instead of applying animations
 * from the current state
 * to the destination state, keyframes describe how each style entry is applied and at what point
 * within the animation arc.
 * Compare [CSS Keyframe Animations](https://www.w3schools.com/css/css3_animations.asp).
 *
 * ### Usage
 *
 * In the following example, the offset values describe
 * when each `backgroundColor` value is applied. The color is red at the start, and changes to
 * blue when 20% of the total time has elapsed.
 *
 * ```typescript
 * // the provided offset values
 * animate("5s", keyframes([
 *   style({ backgroundColor: "red", offset: 0 }),
 *   style({ backgroundColor: "blue", offset: 0.2 }),
 *   style({ backgroundColor: "orange", offset: 0.3 }),
 *   style({ backgroundColor: "black", offset: 1 })
 * ]))
 * ```
 *
 * If there are no `offset` values specified in the style entries, the offsets
 * are calculated automatically.
 *
 * ```typescript
 * animate("5s", keyframes([
 *   style({ backgroundColor: "red" }) // offset = 0
 *   style({ backgroundColor: "blue" }) // offset = 0.33
 *   style({ backgroundColor: "orange" }) // offset = 0.66
 *   style({ backgroundColor: "black" }) // offset = 1
 * ]))
 * ```
 * \@publicApi
 * @param {?} steps A set of animation styles with optional offset data.
 * The optional `offset` value for a style specifies a percentage of the total animation
 * time at which that style is applied.
 * @return {?} An object that encapsulates the keyframes data.
 *
 */
export function keyframes(steps) {
    return { type: 5 /* Keyframes */, steps };
}
/**
 * Declares an animation transition as a sequence of animation steps to run when a given
 * condition is satisfied. The condition is a Boolean expression or function that compares
 * the previous and current animation states, and returns true if this transition should occur.
 * When the state criteria of a defined transition are met, the associated animation is
 * triggered.
 *
 * \@usageNotes
 * The template associated with a component binds an animation trigger to an element.
 *
 * ```HTML
 * <!-- somewhere inside of my-component-tpl.html -->
 * <div [\@myAnimationTrigger]="myStatusExp">...</div>
 * ```
 *
 * All transitions are defined within an animation trigger,
 * along with named states that the transitions change to and from.
 *
 * ```typescript
 * trigger("myAnimationTrigger", [
 *  // define states
 *  state("on", style({ background: "green" })),
 *  state("off", style({ background: "grey" })),
 *  ...]
 * ```
 *
 * Note that when you call the `sequence()` function within a `{\@link animations/group group()}`
 * or a `transition()` call, execution does not continue to the next instruction
 * until each of the inner animation steps have completed.
 *
 * ### Syntax examples
 *
 * The following examples define transitions between the two defined states (and default states),
 * using various options:
 *
 * ```typescript
 * // Transition occurs when the state value
 * // bound to "myAnimationTrigger" changes from "on" to "off"
 * transition("on => off", animate(500))
 * // Run the same animation for both directions
 * transition("on <=> off", animate(500))
 * // Define multiple state-change pairs separated by commas
 * transition("on => off, off => void", animate(500))
 * ```
 *
 * ### Special values for state-change expressions
 *
 * - Catch-all state change for when an element is inserted into the page and the
 * destination state is unknown:
 *
 * ```typescript
 * transition("void => *", [
 *  style({ opacity: 0 }),
 *  animate(500)
 *  ])
 * ```
 *
 * - Capture a state change between any states:
 *
 *  `transition("* => *", animate("1s 0s"))`
 *
 * - Entry and exit transitions:
 *
 * ```typescript
 * transition(":enter", [
 *   style({ opacity: 0 }),
 *   animate(500, style({ opacity: 1 }))
 *   ]),
 * transition(":leave", [
 *   animate(500, style({ opacity: 0 }))
 *   ])
 * ```
 *
 * - Use `:increment` and `:decrement` to initiate transitions:
 *
 * ```typescript
 * transition(":increment", group([
 *  query(':enter', [
 *     style({ left: '100%' }),
 *     animate('0.5s ease-out', style('*'))
 *   ]),
 *  query(':leave', [
 *     animate('0.5s ease-out', style({ left: '-100%' }))
 *  ])
 * ]))
 *
 * transition(":decrement", group([
 *  query(':enter', [
 *     style({ left: '100%' }),
 *     animate('0.5s ease-out', style('*'))
 *   ]),
 *  query(':leave', [
 *     animate('0.5s ease-out', style({ left: '-100%' }))
 *  ])
 * ]))
 * ```
 *
 * ### State-change functions
 *
 * Here is an example of a `fromState` specified as a state-change function that invokes an
 * animation when true:
 *
 * ```typescript
 * transition((fromState, toState) =>
 *  {
 *   return fromState == "off" && toState == "on";
 *  },
 *  animate("1s 0s"))
 * ```
 *
 * ### Animating to the final state
 *
 * If the final step in a transition is a call to `animate()` that uses a timing value
 * with no style data, that step is automatically considered the final animation arc,
 * for the element to reach the final state. Angular automatically adds or removes
 * CSS styles to ensure that the element is in the correct final state.
 *
 * The following example defines a transition that starts by hiding the element,
 * then makes sure that it animates properly to whatever state is currently active for trigger:
 *
 * ```typescript
 * transition("void => *", [
 *   style({ opacity: 0 }),
 *   animate(500)
 *  ])
 * ```
 * ### Boolean value matching
 * If a trigger binding value is a Boolean, it can be matched using a transition expression
 * that compares true and false or 1 and 0. For example:
 *
 * ```
 * // in the template
 * <div [\@openClose]="open ? true : false">...</div>
 * // in the component metadata
 * trigger('openClose', [
 *   state('true', style({ height: '*' })),
 *   state('false', style({ height: '0px' })),
 *   transition('false <=> true', animate(500))
 * ])
 * ```
 *
 * \@publicApi
 *
 * @param {?} stateChangeExpr A Boolean expression or function that compares the previous and current
 * animation states, and returns true if this transition should occur. Note that  "true" and "false"
 * match 1 and 0, respectively. An expression is evaluated each time a state change occurs in the
 * animation trigger element.
 * The animation steps run when the expression evaluates to true.
 *
 * - A state-change string takes the form "state1 => state2", where each side is a defined animation
 * state, or an asterix (*) to refer to a dynamic start or end state.
 *   - The expression string can contain multiple comma-separated statements;
 * for example "state1 => state2, state3 => state4".
 *   - Special values `:enter` and `:leave` initiate a transition on the entry and exit states,
 * equivalent to  "void => *"  and "* => void".
 *   - Special values `:increment` and `:decrement` initiate a transition when a numeric value has
 * increased or decreased in value.
 * - A function is executed each time a state change occurs in the animation trigger element.
 * The animation steps run when the function returns true.
 *
 * @param {?} steps One or more animation objects, as returned by the `animate()` or
 * `sequence()` function, that form a transformation from one state to another.
 * A sequence is used by default when you pass an array.
 * @param {?=} options An options object that can contain a delay value for the start of the animation,
 * and additional developer-defined parameters. Provided values for additional parameters are used
 * as defaults, and override values can be passed to the caller on invocation.
 * @return {?} An object that encapsulates the transition data.
 *
 */
export function transition(stateChangeExpr, steps, options = null) {
    return { type: 1 /* Transition */, expr: stateChangeExpr, animation: steps, options };
}
/**
 * Produces a reusable animation that can be invoked in another animation or sequence,
 * by calling the `useAnimation()` function.
 *
 * \@usageNotes
 * The following example defines a reusable animation, providing some default parameter
 * values.
 *
 * ```typescript
 * var fadeAnimation = animation([
 *   style({ opacity: '{{ start }}' }),
 *   animate('{{ time }}',
 *   style({ opacity: '{{ end }}'}))
 *   ],
 *   { params: { time: '1000ms', start: 0, end: 1 }});
 * ```
 *
 * The following invokes the defined animation with a call to `useAnimation()`,
 * passing in override parameter values.
 *
 * ```js
 * useAnimation(fadeAnimation, {
 *   params: {
 *     time: '2s',
 *     start: 1,
 *     end: 0
 *   }
 * })
 * ```
 *
 * If any of the passed-in parameter values are missing from this call,
 * the default values are used. If one or more parameter values are missing before a step is
 * animated, `useAnimation()` throws an error.
 *
 * \@publicApi
 * @param {?} steps One or more animation objects, as returned by the `animate()`
 * or `sequence()` function, that form a transformation from one state to another.
 * A sequence is used by default when you pass an array.
 * @param {?=} options An options object that can contain a delay value for the start of the
 * animation, and additional developer-defined parameters.
 * Provided values for additional parameters are used as defaults,
 * and override values can be passed to the caller on invocation.
 * @return {?} An object that encapsulates the animation data.
 *
 */
export function animation(steps, options = null) {
    return { type: 8 /* Reference */, animation: steps, options };
}
/**
 * Executes a queried inner animation element within an animation sequence.
 *
 * \@usageNotes
 * Each time an animation is triggered in Angular, the parent animation
 * has priority and any child animations are blocked. In order
 * for a child animation to run, the parent animation must query each of the elements
 * containing child animations, and run them using this function.
 *
 * Note that this feature is designed to be used with `query()` and it will only work
 * with animations that are assigned using the Angular animation library. CSS keyframes
 * and transitions are not handled by this API.
 *
 * \@publicApi
 * @param {?=} options An options object that can contain a delay value for the start of the
 * animation, and additional override values for developer-defined parameters.
 * @return {?} An object that encapsulates the child animation data.
 *
 */
export function animateChild(options = null) {
    return { type: 9 /* AnimateChild */, options };
}
/**
 * Starts a reusable animation that is created using the `animation()` function.
 *
 * \@publicApi
 * @param {?} animation The reusable animation to start.
 * @param {?=} options An options object that can contain a delay value for the start of
 * the animation, and additional override values for developer-defined parameters.
 * @return {?} An object that contains the animation parameters.
 *
 */
export function useAnimation(animation, options = null) {
    return { type: 10 /* AnimateRef */, animation, options };
}
/**
 * Finds one or more inner elements within the current element that is
 * being animated within a sequence. Use with `animate()`.
 *
 * \@usageNotes
 * Tokens can be merged into a combined query selector string. For example:
 *
 * ```typescript
 *  query(':self, .record:enter, .record:leave, \@subTrigger', [...])
 * ```
 *
 * The `query()` function collects multiple elements and works internally by using
 * `element.querySelectorAll`. Use the `limit` field of an options object to limit
 * the total number of items to be collected. For example:
 *
 * ```js
 * query('div', [
 *   animate(...),
 *   animate(...)
 * ], { limit: 1 })
 * ```
 *
 * By default, throws an error when zero items are found. Set the
 * `optional` flag to ignore this error. For example:
 *
 * ```js
 * query('.some-element-that-may-not-be-there', [
 *   animate(...),
 *   animate(...)
 * ], { optional: true })
 * ```
 *
 * ### Usage Example
 *
 * The following example queries for inner elements and animates them
 * individually using `animate()`.
 *
 * ```typescript
 * \@Component({
 *   selector: 'inner',
 *   template: `
 *     <div [\@queryAnimation]="exp">
 *       <h1>Title</h1>
 *       <div class="content">
 *         Blah blah blah
 *       </div>
 *     </div>
 *   `,
 *   animations: [
 *    trigger('queryAnimation', [
 *      transition('* => goAnimate', [
 *        // hide the inner elements
 *        query('h1', style({ opacity: 0 })),
 *        query('.content', style({ opacity: 0 })),
 *
 *        // animate the inner elements in, one by one
 *        query('h1', animate(1000, style({ opacity: 1 }))),
 *        query('.content', animate(1000, style({ opacity: 1 }))),
 *      ])
 *    ])
 *  ]
 * })
 * class Cmp {
 *   exp = '';
 *
 *   goAnimate() {
 *     this.exp = 'goAnimate';
 *   }
 * }
 * ```
 *
 * \@publicApi
 * @param {?} selector The element to query, or a set of elements that contain Angular-specific
 * characteristics, specified with one or more of the following tokens.
 *  - `query(":enter")` or `query(":leave")` : Query for newly inserted/removed elements.
 *  - `query(":animating")` : Query all currently animating elements.
 *  - `query("\@triggerName")` : Query elements that contain an animation trigger.
 *  - `query("\@*")` : Query all elements that contain an animation triggers.
 *  - `query(":self")` : Include the current element into the animation sequence.
 *
 * @param {?} animation One or more animation steps to apply to the queried element or elements.
 * An array is treated as an animation sequence.
 * @param {?=} options An options object. Use the 'limit' field to limit the total number of
 * items to collect.
 * @return {?} An object that encapsulates the query data.
 *
 */
export function query(selector, animation, options = null) {
    return { type: 11 /* Query */, selector, animation, options };
}
/**
 * Use within an animation `query()` call to issue a timing gap after
 * each queried item is animated.
 *
 * \@usageNotes
 * In the following example, a container element wraps a list of items stamped out
 * by an `ngFor`. The container element contains an animation trigger that will later be set
 * to query for each of the inner items.
 *
 * Each time items are added, the opacity fade-in animation runs,
 * and each removed item is faded out.
 * When either of these animations occur, the stagger effect is
 * applied after each item's animation is started.
 *
 * ```html
 * <!-- list.component.html -->
 * <button (click)="toggle()">Show / Hide Items</button>
 * <hr />
 * <div [\@listAnimation]="items.length">
 *   <div *ngFor="let item of items">
 *     {{ item }}
 *   </div>
 * </div>
 * ```
 *
 * Here is the component code:
 *
 * ```typescript
 * import {trigger, transition, style, animate, query, stagger} from '\@angular/animations';
 * \@Component({
 *   templateUrl: 'list.component.html',
 *   animations: [
 *     trigger('listAnimation', [
 *     ...
 *     ])
 *   ]
 * })
 * class ListComponent {
 *   items = [];
 *
 *   showItems() {
 *     this.items = [0,1,2,3,4];
 *   }
 *
 *   hideItems() {
 *     this.items = [];
 *   }
 *
 *   toggle() {
 *     this.items.length ? this.hideItems() : this.showItems();
 *    }
 *  }
 * ```
 *
 * Here is the animation trigger code:
 *
 * ```typescript
 * trigger('listAnimation', [
 *   transition('* => *', [ // each time the binding value changes
 *     query(':leave', [
 *       stagger(100, [
 *         animate('0.5s', style({ opacity: 0 }))
 *       ])
 *     ]),
 *     query(':enter', [
 *       style({ opacity: 0 }),
 *       stagger(100, [
 *         animate('0.5s', style({ opacity: 1 }))
 *       ])
 *     ])
 *   ])
 * ])
 * ```
 *
 * \@publicApi
 * @param {?} timings A delay value.
 * @param {?} animation One ore more animation steps.
 * @return {?} An object that encapsulates the stagger data.
 *
 */
export function stagger(timings, animation) {
    return { type: 12 /* Stagger */, timings, animation };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX21ldGFkYXRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYW5pbWF0aW9ucy9zcmMvYW5pbWF0aW9uX21ldGFkYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQVdBLGdDQUE2RDs7O0lBbUYzRDs7O09BR0c7SUFDSCxRQUFTO0lBQ1Q7OztPQUdHO0lBQ0gsYUFBYztJQUNkOzs7T0FHRztJQUNILFdBQVk7SUFDWjs7O09BR0c7SUFDSCxRQUFTO0lBQ1Q7OztPQUdHO0lBQ0gsVUFBVztJQUNYOzs7T0FHRztJQUNILFlBQWE7SUFDYjs7O09BR0c7SUFDSCxRQUFTO0lBQ1Q7OztPQUdHO0lBQ0gsVUFBVztJQUNYOzs7T0FHRztJQUNILFlBQWE7SUFDYjs7O09BR0c7SUFDSCxlQUFnQjtJQUNoQjs7O09BR0c7SUFDSCxjQUFlO0lBQ2Y7OztPQUdHO0lBQ0gsU0FBVTtJQUNWOzs7T0FHRztJQUNILFdBQVk7Ozs7Ozs7OztBQVFkLE1BQU0sT0FBTyxVQUFVLEdBQUcsR0FBRzs7Ozs7OztBQU83Qix1Q0FBbUU7OztJQUE5QixpQ0FBNEI7Ozs7Ozs7OztBQVFqRSw4Q0FlQzs7Ozs7O0lBWEMsd0NBQWE7Ozs7O0lBSWIsK0NBQWlDOzs7Ozs7O0lBTWpDLDJDQUErQzs7Ozs7Ozs7O0FBU2pELDRDQWVDOzs7Ozs7SUFYQyxzQ0FBYTs7Ozs7SUFJYix3Q0FBK0I7Ozs7Ozs7SUFNL0IseUNBQTBDOzs7Ozs7Ozs7QUFTNUMsaURBaUJDOzs7Ozs7SUFiQywyQ0FFaUQ7Ozs7O0lBSWpELGdEQUFpRDs7Ozs7OztJQU1qRCw4Q0FBK0I7Ozs7Ozs7Ozs7QUFVakMsZ0RBV0M7Ozs7OztJQVBDLCtDQUFpRDs7Ozs7OztJQU1qRCw2Q0FBK0I7Ozs7Ozs7OztBQVNqQyw0Q0FhQzs7Ozs7O0lBVEMsMENBQWlCOzs7OztJQUlqQiwyQ0FBaUQ7Ozs7O0lBSWpELHlDQUFvQzs7Ozs7Ozs7O0FBU3RDLHdEQUtDOzs7Ozs7SUFEQyxtREFBZ0M7Ozs7Ozs7OztBQVNsQyw0Q0FTQzs7Ozs7O0lBTEMsd0NBQXlGOzs7OztJQUl6Rix3Q0FBb0I7Ozs7Ozs7OztBQVN0Qiw4Q0FTQzs7Ozs7O0lBTEMsMkNBQXNDOzs7OztJQUl0QywwQ0FBdUU7Ozs7Ozs7OztBQVN6RSxtREFPQzs7Ozs7Ozs7SUFEQyxnREFBK0I7Ozs7Ozs7OztBQVNqQyxpREFXQzs7Ozs7O0lBUEMsZ0RBQXNDOzs7Ozs7O0lBTXRDLDhDQUErQjs7Ozs7Ozs7O0FBU2pDLCtDQVdDOzs7Ozs7SUFQQywwQ0FBMkI7Ozs7Ozs7SUFNM0IsNENBQStCOzs7Ozs7Ozs7QUFTakMsNENBV0M7Ozs7OztJQVBDLHVDQUEyQjs7Ozs7OztJQU0zQix5Q0FBK0I7Ozs7Ozs7Ozs7QUErQmpDLDhDQVNDOzs7Ozs7SUFMQywyQ0FBdUI7Ozs7O0lBSXZCLDZDQUFpRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUpuRCxNQUFNLFVBQVUsT0FBTyxDQUFDLElBQVksRUFBRSxXQUFnQztJQUNwRSxPQUFPLEVBQUMsSUFBSSxpQkFBK0IsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUMsQ0FBQztBQUMvRSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTRERCxNQUFNLFVBQVUsT0FBTyxDQUNuQixPQUF3QixFQUFFLFNBQ2YsSUFBSTtJQUNqQixPQUFPLEVBQUMsSUFBSSxpQkFBK0IsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFDLENBQUM7QUFDaEUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1DRCxNQUFNLFVBQVUsS0FBSyxDQUNqQixLQUEwQixFQUFFLFVBQW1DLElBQUk7SUFDckUsT0FBTyxFQUFDLElBQUksZUFBNkIsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFDLENBQUM7QUFDN0QsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtDRCxNQUFNLFVBQVUsUUFBUSxDQUFDLEtBQTBCLEVBQUUsVUFBbUMsSUFBSTtJQUUxRixPQUFPLEVBQUMsSUFBSSxrQkFBZ0MsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFDLENBQUM7QUFDaEUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5Q0QsTUFBTSxVQUFVLEtBQUssQ0FDakIsTUFDMkM7SUFDN0MsT0FBTyxFQUFDLElBQUksZUFBNkIsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUMsQ0FBQztBQUMzRSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBK0JELE1BQU0sVUFBVSxLQUFLLENBQ2pCLElBQVksRUFBRSxNQUE4QixFQUM1QyxPQUF5QztJQUMzQyxPQUFPLEVBQUMsSUFBSSxlQUE2QixFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFDLENBQUM7QUFDcEUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBK0NELE1BQU0sVUFBVSxTQUFTLENBQUMsS0FBK0I7SUFDdkQsT0FBTyxFQUFDLElBQUksbUJBQWlDLEVBQUUsS0FBSyxFQUFDLENBQUM7QUFDeEQsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwS0QsTUFBTSxVQUFVLFVBQVUsQ0FDdEIsZUFDc0UsRUFDdEUsS0FBOEMsRUFDOUMsVUFBbUMsSUFBSTtJQUN6QyxPQUFPLEVBQUMsSUFBSSxvQkFBa0MsRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFDLENBQUM7QUFDcEcsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQStDRCxNQUFNLFVBQVUsU0FBUyxDQUNyQixLQUE4QyxFQUM5QyxVQUFtQyxJQUFJO0lBQ3pDLE9BQU8sRUFBQyxJQUFJLG1CQUFpQyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFDLENBQUM7QUFDNUUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQkQsTUFBTSxVQUFVLFlBQVksQ0FBQyxVQUFzQyxJQUFJO0lBRXJFLE9BQU8sRUFBQyxJQUFJLHNCQUFvQyxFQUFFLE9BQU8sRUFBQyxDQUFDO0FBQzdELENBQUM7Ozs7Ozs7Ozs7O0FBWUQsTUFBTSxVQUFVLFlBQVksQ0FDeEIsU0FBcUMsRUFDckMsVUFBbUMsSUFBSTtJQUN6QyxPQUFPLEVBQUMsSUFBSSxxQkFBa0MsRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFDLENBQUM7QUFDdEUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlGRCxNQUFNLFVBQVUsS0FBSyxDQUNqQixRQUFnQixFQUFFLFNBQWtELEVBQ3BFLFVBQXdDLElBQUk7SUFDOUMsT0FBTyxFQUFDLElBQUksZ0JBQTZCLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUMsQ0FBQztBQUMzRSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrRkQsTUFBTSxVQUFVLE9BQU8sQ0FDbkIsT0FBd0IsRUFDeEIsU0FBa0Q7SUFDcEQsT0FBTyxFQUFDLElBQUksa0JBQStCLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBQyxDQUFDO0FBQ25FLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8qKlxuICogUmVwcmVzZW50cyBhIHNldCBvZiBDU1Mgc3R5bGVzIGZvciB1c2UgaW4gYW4gYW5pbWF0aW9uIHN0eWxlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIMm1U3R5bGVEYXRhIHsgW2tleTogc3RyaW5nXTogc3RyaW5nfG51bWJlcjsgfVxuXG4vKipcbiAqIFJlcHJlc2VudHMgYW5pbWF0aW9uLXN0ZXAgdGltaW5nIHBhcmFtZXRlcnMgZm9yIGFuIGFuaW1hdGlvbiBzdGVwLlxuICogQHNlZSBgYW5pbWF0ZSgpYFxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGRlY2xhcmUgdHlwZSBBbmltYXRlVGltaW5ncyA9IHtcbiAgLyoqXG4gICAqIFRoZSBmdWxsIGR1cmF0aW9uIG9mIGFuIGFuaW1hdGlvbiBzdGVwLiBBIG51bWJlciBhbmQgb3B0aW9uYWwgdGltZSB1bml0LFxuICAgKiBzdWNoIGFzIFwiMXNcIiBvciBcIjEwbXNcIiBmb3Igb25lIHNlY29uZCBhbmQgMTAgbWlsbGlzZWNvbmRzLCByZXNwZWN0aXZlbHkuXG4gICAqIFRoZSBkZWZhdWx0IHVuaXQgaXMgbWlsbGlzZWNvbmRzLlxuICAgKi9cbiAgZHVyYXRpb246IG51bWJlcixcbiAgLyoqXG4gICAqIFRoZSBkZWxheSBpbiBhcHBseWluZyBhbiBhbmltYXRpb24gc3RlcC4gQSBudW1iZXIgYW5kIG9wdGlvbmFsIHRpbWUgdW5pdC5cbiAgICogVGhlIGRlZmF1bHQgdW5pdCBpcyBtaWxsaXNlY29uZHMuXG4gICAqL1xuICBkZWxheTogbnVtYmVyLFxuICAvKipcbiAgICogQW4gZWFzaW5nIHN0eWxlIHRoYXQgY29udHJvbHMgaG93IGFuIGFuaW1hdGlvbnMgc3RlcCBhY2NlbGVyYXRlc1xuICAgKiBhbmQgZGVjZWxlcmF0ZXMgZHVyaW5nIGl0cyBydW4gdGltZS4gQW4gZWFzaW5nIGZ1bmN0aW9uIHN1Y2ggYXMgYGN1YmljLWJlemllcigpYCxcbiAgICogb3Igb25lIG9mIHRoZSBmb2xsb3dpbmcgY29uc3RhbnRzOlxuICAgKiAtIGBlYXNlLWluYFxuICAgKiAtIGBlYXNlLW91dGBcbiAgICogLSBgZWFzZS1pbi1hbmQtb3V0YFxuICAgKi9cbiAgZWFzaW5nOiBzdHJpbmcgfCBudWxsXG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvbiBPcHRpb25zIHRoYXQgY29udHJvbCBhbmltYXRpb24gc3R5bGluZyBhbmQgdGltaW5nLlxuICpcbiAqIFRoZSBmb2xsb3dpbmcgYW5pbWF0aW9uIGZ1bmN0aW9ucyBhY2NlcHQgYEFuaW1hdGlvbk9wdGlvbnNgIGRhdGE6XG4gKlxuICogLSBgdHJhbnNpdGlvbigpYFxuICogLSBgc2VxdWVuY2UoKWBcbiAqIC0gYHtAbGluayBhbmltYXRpb25zL2dyb3VwIGdyb3VwKCl9YFxuICogLSBgcXVlcnkoKWBcbiAqIC0gYGFuaW1hdGlvbigpYFxuICogLSBgdXNlQW5pbWF0aW9uKClgXG4gKiAtIGBhbmltYXRlQ2hpbGQoKWBcbiAqXG4gKiBQcm9ncmFtbWF0aWMgYW5pbWF0aW9ucyBidWlsdCB1c2luZyB0aGUgYEFuaW1hdGlvbkJ1aWxkZXJgIHNlcnZpY2UgYWxzb1xuICogbWFrZSB1c2Ugb2YgYEFuaW1hdGlvbk9wdGlvbnNgLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIEFuaW1hdGlvbk9wdGlvbnMge1xuICAvKipcbiAgICogU2V0cyBhIHRpbWUtZGVsYXkgZm9yIGluaXRpYXRpbmcgYW4gYW5pbWF0aW9uIGFjdGlvbi5cbiAgICogQSBudW1iZXIgYW5kIG9wdGlvbmFsIHRpbWUgdW5pdCwgc3VjaCBhcyBcIjFzXCIgb3IgXCIxMG1zXCIgZm9yIG9uZSBzZWNvbmRcbiAgICogYW5kIDEwIG1pbGxpc2Vjb25kcywgcmVzcGVjdGl2ZWx5LlRoZSBkZWZhdWx0IHVuaXQgaXMgbWlsbGlzZWNvbmRzLlxuICAgKiBEZWZhdWx0IHZhbHVlIGlzIDAsIG1lYW5pbmcgbm8gZGVsYXkuXG4gICAqL1xuICBkZWxheT86IG51bWJlcnxzdHJpbmc7XG4gIC8qKlxuICAqIEEgc2V0IG9mIGRldmVsb3Blci1kZWZpbmVkIHBhcmFtZXRlcnMgdGhhdCBtb2RpZnkgc3R5bGluZyBhbmQgdGltaW5nXG4gICogd2hlbiBhbiBhbmltYXRpb24gYWN0aW9uIHN0YXJ0cy4gQW4gYXJyYXkgb2Yga2V5LXZhbHVlIHBhaXJzLCB3aGVyZSB0aGUgcHJvdmlkZWQgdmFsdWVcbiAgKiBpcyB1c2VkIGFzIGEgZGVmYXVsdC5cbiAgKi9cbiAgcGFyYW1zPzoge1tuYW1lOiBzdHJpbmddOiBhbnl9O1xufVxuXG4vKipcbiAqIEFkZHMgZHVyYXRpb24gb3B0aW9ucyB0byBjb250cm9sIGFuaW1hdGlvbiBzdHlsaW5nIGFuZCB0aW1pbmcgZm9yIGEgY2hpbGQgYW5pbWF0aW9uLlxuICpcbiAqIEBzZWUgYGFuaW1hdGVDaGlsZCgpYFxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIEFuaW1hdGVDaGlsZE9wdGlvbnMgZXh0ZW5kcyBBbmltYXRpb25PcHRpb25zIHsgZHVyYXRpb24/OiBudW1iZXJ8c3RyaW5nOyB9XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uIENvbnN0YW50cyBmb3IgdGhlIGNhdGVnb3JpZXMgb2YgcGFyYW1ldGVycyB0aGF0IGNhbiBiZSBkZWZpbmVkIGZvciBhbmltYXRpb25zLlxuICpcbiAqIEEgY29ycmVzcG9uZGluZyBmdW5jdGlvbiBkZWZpbmVzIGEgc2V0IG9mIHBhcmFtZXRlcnMgZm9yIGVhY2ggY2F0ZWdvcnksIGFuZFxuICogY29sbGVjdHMgdGhlbSBpbnRvIGEgY29ycmVzcG9uZGluZyBgQW5pbWF0aW9uTWV0YWRhdGFgIG9iamVjdC5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBjb25zdCBlbnVtIEFuaW1hdGlvbk1ldGFkYXRhVHlwZSB7XG4gIC8qKlxuICAgKiBBc3NvY2lhdGVzIGEgbmFtZWQgYW5pbWF0aW9uIHN0YXRlIHdpdGggYSBzZXQgb2YgQ1NTIHN0eWxlcy5cbiAgICogU2VlIGBzdGF0ZSgpYFxuICAgKi9cbiAgU3RhdGUgPSAwLFxuICAvKipcbiAgICogRGF0YSBmb3IgYSB0cmFuc2l0aW9uIGZyb20gb25lIGFuaW1hdGlvbiBzdGF0ZSB0byBhbm90aGVyLlxuICAgKiBTZWUgYHRyYW5zaXRpb24oKWBcbiAgICovXG4gIFRyYW5zaXRpb24gPSAxLFxuICAvKipcbiAgICogQ29udGFpbnMgYSBzZXQgb2YgYW5pbWF0aW9uIHN0ZXBzLlxuICAgKiBTZWUgYHNlcXVlbmNlKClgXG4gICAqL1xuICBTZXF1ZW5jZSA9IDIsXG4gIC8qKlxuICAgKiBDb250YWlucyBhIHNldCBvZiBhbmltYXRpb24gc3RlcHMuXG4gICAqIFNlZSBge0BsaW5rIGFuaW1hdGlvbnMvZ3JvdXAgZ3JvdXAoKX1gXG4gICAqL1xuICBHcm91cCA9IDMsXG4gIC8qKlxuICAgKiBDb250YWlucyBhbiBhbmltYXRpb24gc3RlcC5cbiAgICogU2VlIGBhbmltYXRlKClgXG4gICAqL1xuICBBbmltYXRlID0gNCxcbiAgLyoqXG4gICAqIENvbnRhaW5zIGEgc2V0IG9mIGFuaW1hdGlvbiBzdGVwcy5cbiAgICogU2VlIGBrZXlmcmFtZXMoKWBcbiAgICovXG4gIEtleWZyYW1lcyA9IDUsXG4gIC8qKlxuICAgKiBDb250YWlucyBhIHNldCBvZiBDU1MgcHJvcGVydHktdmFsdWUgcGFpcnMgaW50byBhIG5hbWVkIHN0eWxlLlxuICAgKiBTZWUgYHN0eWxlKClgXG4gICAqL1xuICBTdHlsZSA9IDYsXG4gIC8qKlxuICAgKiBBc3NvY2lhdGVzIGFuIGFuaW1hdGlvbiB3aXRoIGFuIGVudHJ5IHRyaWdnZXIgdGhhdCBjYW4gYmUgYXR0YWNoZWQgdG8gYW4gZWxlbWVudC5cbiAgICogU2VlIGB0cmlnZ2VyKClgXG4gICAqL1xuICBUcmlnZ2VyID0gNyxcbiAgLyoqXG4gICAqIENvbnRhaW5zIGEgcmUtdXNhYmxlIGFuaW1hdGlvbi5cbiAgICogU2VlIGBhbmltYXRpb24oKWBcbiAgICovXG4gIFJlZmVyZW5jZSA9IDgsXG4gIC8qKlxuICAgKiBDb250YWlucyBkYXRhIHRvIHVzZSBpbiBleGVjdXRpbmcgY2hpbGQgYW5pbWF0aW9ucyByZXR1cm5lZCBieSBhIHF1ZXJ5LlxuICAgKiBTZWUgYGFuaW1hdGVDaGlsZCgpYFxuICAgKi9cbiAgQW5pbWF0ZUNoaWxkID0gOSxcbiAgLyoqXG4gICAqIENvbnRhaW5zIGFuaW1hdGlvbiBwYXJhbWV0ZXJzIGZvciBhIHJlLXVzYWJsZSBhbmltYXRpb24uXG4gICAqIFNlZSBgdXNlQW5pbWF0aW9uKClgXG4gICAqL1xuICBBbmltYXRlUmVmID0gMTAsXG4gIC8qKlxuICAgKiBDb250YWlucyBjaGlsZC1hbmltYXRpb24gcXVlcnkgZGF0YS5cbiAgICogU2VlIGBxdWVyeSgpYFxuICAgKi9cbiAgUXVlcnkgPSAxMSxcbiAgLyoqXG4gICAqIENvbnRhaW5zIGRhdGEgZm9yIHN0YWdnZXJpbmcgYW4gYW5pbWF0aW9uIHNlcXVlbmNlLlxuICAgKiBTZWUgYHN0YWdnZXIoKWBcbiAgICovXG4gIFN0YWdnZXIgPSAxMlxufVxuXG4vKipcbiAqIFNwZWNpZmllcyBhdXRvbWF0aWMgc3R5bGluZy5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBjb25zdCBBVVRPX1NUWUxFID0gJyonO1xuXG4vKipcbiAqIEJhc2UgZm9yIGFuaW1hdGlvbiBkYXRhIHN0cnVjdHVyZXMuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFuaW1hdGlvbk1ldGFkYXRhIHsgdHlwZTogQW5pbWF0aW9uTWV0YWRhdGFUeXBlOyB9XG5cbi8qKlxuICogQ29udGFpbnMgYW4gYW5pbWF0aW9uIHRyaWdnZXIuIEluc3RhbnRpYXRlZCBhbmQgcmV0dXJuZWQgYnkgdGhlXG4gKiBgdHJpZ2dlcigpYCBmdW5jdGlvbi5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhIGV4dGVuZHMgQW5pbWF0aW9uTWV0YWRhdGEge1xuICAvKipcbiAgICAqIFRoZSB0cmlnZ2VyIG5hbWUsIHVzZWQgdG8gYXNzb2NpYXRlIGl0IHdpdGggYW4gZWxlbWVudC4gVW5pcXVlIHdpdGhpbiB0aGUgY29tcG9uZW50LlxuICAgICovXG4gIG5hbWU6IHN0cmluZztcbiAgLyoqXG4gICAqIEFuIGFuaW1hdGlvbiBkZWZpbml0aW9uIG9iamVjdCwgY29udGFpbmluZyBhbiBhcnJheSBvZiBzdGF0ZSBhbmQgdHJhbnNpdGlvbiBkZWNsYXJhdGlvbnMuXG4gICAqL1xuICBkZWZpbml0aW9uczogQW5pbWF0aW9uTWV0YWRhdGFbXTtcbiAgLyoqXG4gICAqIEFuIG9wdGlvbnMgb2JqZWN0IGNvbnRhaW5pbmcgYSBkZWxheSBhbmRcbiAgICogZGV2ZWxvcGVyLWRlZmluZWQgcGFyYW1ldGVycyB0aGF0IHByb3ZpZGUgc3R5bGluZyBkZWZhdWx0cyBhbmRcbiAgICogY2FuIGJlIG92ZXJyaWRkZW4gb24gaW52b2NhdGlvbi4gRGVmYXVsdCBkZWxheSBpcyAwLlxuICAgKi9cbiAgb3B0aW9uczoge3BhcmFtcz86IHtbbmFtZTogc3RyaW5nXTogYW55fX18bnVsbDtcbn1cblxuLyoqXG4gKiBFbmNhcHN1bGF0ZXMgYW4gYW5pbWF0aW9uIHN0YXRlIGJ5IGFzc29jaWF0aW5nIGEgc3RhdGUgbmFtZSB3aXRoIGEgc2V0IG9mIENTUyBzdHlsZXMuXG4gKiBJbnN0YW50aWF0ZWQgYW5kIHJldHVybmVkIGJ5IHRoZSBgc3RhdGUoKWAgZnVuY3Rpb24uXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFuaW1hdGlvblN0YXRlTWV0YWRhdGEgZXh0ZW5kcyBBbmltYXRpb25NZXRhZGF0YSB7XG4gIC8qKlxuICAgKiBUaGUgc3RhdGUgbmFtZSwgdW5pcXVlIHdpdGhpbiB0aGUgY29tcG9uZW50LlxuICAgKi9cbiAgbmFtZTogc3RyaW5nO1xuICAvKipcbiAgICogIFRoZSBDU1Mgc3R5bGVzIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHN0YXRlLlxuICAgKi9cbiAgc3R5bGVzOiBBbmltYXRpb25TdHlsZU1ldGFkYXRhO1xuICAvKipcbiAgICogQW4gb3B0aW9ucyBvYmplY3QgY29udGFpbmluZ1xuICAgKiBkZXZlbG9wZXItZGVmaW5lZCBwYXJhbWV0ZXJzIHRoYXQgcHJvdmlkZSBzdHlsaW5nIGRlZmF1bHRzIGFuZFxuICAgKiBjYW4gYmUgb3ZlcnJpZGRlbiBvbiBpbnZvY2F0aW9uLlxuICAgKi9cbiAgb3B0aW9ucz86IHtwYXJhbXM6IHtbbmFtZTogc3RyaW5nXTogYW55fX07XG59XG5cbi8qKlxuICogRW5jYXBzdWxhdGVzIGFuIGFuaW1hdGlvbiB0cmFuc2l0aW9uLiBJbnN0YW50aWF0ZWQgYW5kIHJldHVybmVkIGJ5IHRoZVxuICogYHRyYW5zaXRpb24oKWAgZnVuY3Rpb24uXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFuaW1hdGlvblRyYW5zaXRpb25NZXRhZGF0YSBleHRlbmRzIEFuaW1hdGlvbk1ldGFkYXRhIHtcbiAgLyoqXG4gICAqIEFuIGV4cHJlc3Npb24gdGhhdCBkZXNjcmliZXMgYSBzdGF0ZSBjaGFuZ2UuXG4gICAqL1xuICBleHByOiBzdHJpbmd8XG4gICAgICAoKGZyb21TdGF0ZTogc3RyaW5nLCB0b1N0YXRlOiBzdHJpbmcsIGVsZW1lbnQ/OiBhbnksXG4gICAgICAgIHBhcmFtcz86IHtba2V5OiBzdHJpbmddOiBhbnl9KSA9PiBib29sZWFuKTtcbiAgLyoqXG4gICAqIE9uZSBvciBtb3JlIGFuaW1hdGlvbiBvYmplY3RzIHRvIHdoaWNoIHRoaXMgdHJhbnNpdGlvbiBhcHBsaWVzLlxuICAgKi9cbiAgYW5pbWF0aW9uOiBBbmltYXRpb25NZXRhZGF0YXxBbmltYXRpb25NZXRhZGF0YVtdO1xuICAvKipcbiAgICogQW4gb3B0aW9ucyBvYmplY3QgY29udGFpbmluZyBhIGRlbGF5IGFuZFxuICAgKiBkZXZlbG9wZXItZGVmaW5lZCBwYXJhbWV0ZXJzIHRoYXQgcHJvdmlkZSBzdHlsaW5nIGRlZmF1bHRzIGFuZFxuICAgKiBjYW4gYmUgb3ZlcnJpZGRlbiBvbiBpbnZvY2F0aW9uLiBEZWZhdWx0IGRlbGF5IGlzIDAuXG4gICAqL1xuICBvcHRpb25zOiBBbmltYXRpb25PcHRpb25zfG51bGw7XG59XG5cbi8qKlxuICogRW5jYXBzdWxhdGVzIGEgcmV1c2FibGUgYW5pbWF0aW9uLCB3aGljaCBpcyBhIGNvbGxlY3Rpb24gb2YgaW5kaXZpZHVhbCBhbmltYXRpb24gc3RlcHMuXG4gKiBJbnN0YW50aWF0ZWQgYW5kIHJldHVybmVkIGJ5IHRoZSBgYW5pbWF0aW9uKClgIGZ1bmN0aW9uLCBhbmRcbiAqIHBhc3NlZCB0byB0aGUgYHVzZUFuaW1hdGlvbigpYCBmdW5jdGlvbi5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQW5pbWF0aW9uUmVmZXJlbmNlTWV0YWRhdGEgZXh0ZW5kcyBBbmltYXRpb25NZXRhZGF0YSB7XG4gIC8qKlxuICAgKiAgT25lIG9yIG1vcmUgYW5pbWF0aW9uIHN0ZXAgb2JqZWN0cy5cbiAgICovXG4gIGFuaW1hdGlvbjogQW5pbWF0aW9uTWV0YWRhdGF8QW5pbWF0aW9uTWV0YWRhdGFbXTtcbiAgLyoqXG4gICAqIEFuIG9wdGlvbnMgb2JqZWN0IGNvbnRhaW5pbmcgYSBkZWxheSBhbmRcbiAgICogZGV2ZWxvcGVyLWRlZmluZWQgcGFyYW1ldGVycyB0aGF0IHByb3ZpZGUgc3R5bGluZyBkZWZhdWx0cyBhbmRcbiAgICogY2FuIGJlIG92ZXJyaWRkZW4gb24gaW52b2NhdGlvbi4gRGVmYXVsdCBkZWxheSBpcyAwLlxuICAgKi9cbiAgb3B0aW9uczogQW5pbWF0aW9uT3B0aW9uc3xudWxsO1xufVxuXG4vKipcbiAqIEVuY2Fwc3VsYXRlcyBhbiBhbmltYXRpb24gcXVlcnkuIEluc3RhbnRpYXRlZCBhbmQgcmV0dXJuZWQgYnlcbiAqIHRoZSBgcXVlcnkoKWAgZnVuY3Rpb24uXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFuaW1hdGlvblF1ZXJ5TWV0YWRhdGEgZXh0ZW5kcyBBbmltYXRpb25NZXRhZGF0YSB7XG4gIC8qKlxuICAgKiAgVGhlIENTUyBzZWxlY3RvciBmb3IgdGhpcyBxdWVyeS5cbiAgICovXG4gIHNlbGVjdG9yOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBPbmUgb3IgbW9yZSBhbmltYXRpb24gc3RlcCBvYmplY3RzLlxuICAgKi9cbiAgYW5pbWF0aW9uOiBBbmltYXRpb25NZXRhZGF0YXxBbmltYXRpb25NZXRhZGF0YVtdO1xuICAvKipcbiAgICogQSBxdWVyeSBvcHRpb25zIG9iamVjdC5cbiAgICovXG4gIG9wdGlvbnM6IEFuaW1hdGlvblF1ZXJ5T3B0aW9uc3xudWxsO1xufVxuXG4vKipcbiAqIEVuY2Fwc3VsYXRlcyBhIGtleWZyYW1lcyBzZXF1ZW5jZS4gSW5zdGFudGlhdGVkIGFuZCByZXR1cm5lZCBieVxuICogdGhlIGBrZXlmcmFtZXMoKWAgZnVuY3Rpb24uXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFuaW1hdGlvbktleWZyYW1lc1NlcXVlbmNlTWV0YWRhdGEgZXh0ZW5kcyBBbmltYXRpb25NZXRhZGF0YSB7XG4gIC8qKlxuICAgKiBBbiBhcnJheSBvZiBhbmltYXRpb24gc3R5bGVzLlxuICAgKi9cbiAgc3RlcHM6IEFuaW1hdGlvblN0eWxlTWV0YWRhdGFbXTtcbn1cblxuLyoqXG4gKiBFbmNhcHN1bGF0ZXMgYW4gYW5pbWF0aW9uIHN0eWxlLiBJbnN0YW50aWF0ZWQgYW5kIHJldHVybmVkIGJ5XG4gKiB0aGUgYHN0eWxlKClgIGZ1bmN0aW9uLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBbmltYXRpb25TdHlsZU1ldGFkYXRhIGV4dGVuZHMgQW5pbWF0aW9uTWV0YWRhdGEge1xuICAvKipcbiAgICogQSBzZXQgb2YgQ1NTIHN0eWxlIHByb3BlcnRpZXMuXG4gICAqL1xuICBzdHlsZXM6ICcqJ3x7W2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyfXxBcnJheTx7W2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyfXwnKic+O1xuICAvKipcbiAgICogQSBwZXJjZW50YWdlIG9mIHRoZSB0b3RhbCBhbmltYXRlIHRpbWUgYXQgd2hpY2ggdGhlIHN0eWxlIGlzIHRvIGJlIGFwcGxpZWQuXG4gICAqL1xuICBvZmZzZXQ6IG51bWJlcnxudWxsO1xufVxuXG4vKipcbiAqIEVuY2Fwc3VsYXRlcyBhbiBhbmltYXRpb24gc3RlcC4gSW5zdGFudGlhdGVkIGFuZCByZXR1cm5lZCBieVxuICogdGhlIGBhbmltYXRlKClgIGZ1bmN0aW9uLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBbmltYXRpb25BbmltYXRlTWV0YWRhdGEgZXh0ZW5kcyBBbmltYXRpb25NZXRhZGF0YSB7XG4gIC8qKlxuICAgKiBUaGUgdGltaW5nIGRhdGEgZm9yIHRoZSBzdGVwLlxuICAgKi9cbiAgdGltaW5nczogc3RyaW5nfG51bWJlcnxBbmltYXRlVGltaW5ncztcbiAgLyoqXG4gICAqIEEgc2V0IG9mIHN0eWxlcyB1c2VkIGluIHRoZSBzdGVwLlxuICAgKi9cbiAgc3R5bGVzOiBBbmltYXRpb25TdHlsZU1ldGFkYXRhfEFuaW1hdGlvbktleWZyYW1lc1NlcXVlbmNlTWV0YWRhdGF8bnVsbDtcbn1cblxuLyoqXG4gKiBFbmNhcHN1bGF0ZXMgYSBjaGlsZCBhbmltYXRpb24sIHRoYXQgY2FuIGJlIHJ1biBleHBsaWNpdGx5IHdoZW4gdGhlIHBhcmVudCBpcyBydW4uXG4gKiBJbnN0YW50aWF0ZWQgYW5kIHJldHVybmVkIGJ5IHRoZSBgYW5pbWF0ZUNoaWxkYCBmdW5jdGlvbi5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQW5pbWF0aW9uQW5pbWF0ZUNoaWxkTWV0YWRhdGEgZXh0ZW5kcyBBbmltYXRpb25NZXRhZGF0YSB7XG4gIC8qKlxuICAgKiBBbiBvcHRpb25zIG9iamVjdCBjb250YWluaW5nIGEgZGVsYXkgYW5kXG4gICAqIGRldmVsb3Blci1kZWZpbmVkIHBhcmFtZXRlcnMgdGhhdCBwcm92aWRlIHN0eWxpbmcgZGVmYXVsdHMgYW5kXG4gICAqIGNhbiBiZSBvdmVycmlkZGVuIG9uIGludm9jYXRpb24uIERlZmF1bHQgZGVsYXkgaXMgMC5cbiAgICovXG4gIG9wdGlvbnM6IEFuaW1hdGlvbk9wdGlvbnN8bnVsbDtcbn1cblxuLyoqXG4gKiBFbmNhcHN1bGF0ZXMgYSByZXVzYWJsZSBhbmltYXRpb24uXG4gKiBJbnN0YW50aWF0ZWQgYW5kIHJldHVybmVkIGJ5IHRoZSBgdXNlQW5pbWF0aW9uKClgIGZ1bmN0aW9uLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBbmltYXRpb25BbmltYXRlUmVmTWV0YWRhdGEgZXh0ZW5kcyBBbmltYXRpb25NZXRhZGF0YSB7XG4gIC8qKlxuICAgKiBBbiBhbmltYXRpb24gcmVmZXJlbmNlIG9iamVjdC5cbiAgICovXG4gIGFuaW1hdGlvbjogQW5pbWF0aW9uUmVmZXJlbmNlTWV0YWRhdGE7XG4gIC8qKlxuICAgKiBBbiBvcHRpb25zIG9iamVjdCBjb250YWluaW5nIGEgZGVsYXkgYW5kXG4gICAqIGRldmVsb3Blci1kZWZpbmVkIHBhcmFtZXRlcnMgdGhhdCBwcm92aWRlIHN0eWxpbmcgZGVmYXVsdHMgYW5kXG4gICAqIGNhbiBiZSBvdmVycmlkZGVuIG9uIGludm9jYXRpb24uIERlZmF1bHQgZGVsYXkgaXMgMC5cbiAgICovXG4gIG9wdGlvbnM6IEFuaW1hdGlvbk9wdGlvbnN8bnVsbDtcbn1cblxuLyoqXG4gKiBFbmNhcHN1bGF0ZXMgYW4gYW5pbWF0aW9uIHNlcXVlbmNlLlxuICogSW5zdGFudGlhdGVkIGFuZCByZXR1cm5lZCBieSB0aGUgYHNlcXVlbmNlKClgIGZ1bmN0aW9uLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBbmltYXRpb25TZXF1ZW5jZU1ldGFkYXRhIGV4dGVuZHMgQW5pbWF0aW9uTWV0YWRhdGEge1xuICAvKipcbiAgICogIEFuIGFycmF5IG9mIGFuaW1hdGlvbiBzdGVwIG9iamVjdHMuXG4gICAqL1xuICBzdGVwczogQW5pbWF0aW9uTWV0YWRhdGFbXTtcbiAgLyoqXG4gICAqIEFuIG9wdGlvbnMgb2JqZWN0IGNvbnRhaW5pbmcgYSBkZWxheSBhbmRcbiAgICogZGV2ZWxvcGVyLWRlZmluZWQgcGFyYW1ldGVycyB0aGF0IHByb3ZpZGUgc3R5bGluZyBkZWZhdWx0cyBhbmRcbiAgICogY2FuIGJlIG92ZXJyaWRkZW4gb24gaW52b2NhdGlvbi4gRGVmYXVsdCBkZWxheSBpcyAwLlxuICAgKi9cbiAgb3B0aW9uczogQW5pbWF0aW9uT3B0aW9uc3xudWxsO1xufVxuXG4vKipcbiAqIEVuY2Fwc3VsYXRlcyBhbiBhbmltYXRpb24gZ3JvdXAuXG4gKiBJbnN0YW50aWF0ZWQgYW5kIHJldHVybmVkIGJ5IHRoZSBge0BsaW5rIGFuaW1hdGlvbnMvZ3JvdXAgZ3JvdXAoKX1gIGZ1bmN0aW9uLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBbmltYXRpb25Hcm91cE1ldGFkYXRhIGV4dGVuZHMgQW5pbWF0aW9uTWV0YWRhdGEge1xuICAvKipcbiAgICogT25lIG9yIG1vcmUgYW5pbWF0aW9uIG9yIHN0eWxlIHN0ZXBzIHRoYXQgZm9ybSB0aGlzIGdyb3VwLlxuICAgKi9cbiAgc3RlcHM6IEFuaW1hdGlvbk1ldGFkYXRhW107XG4gIC8qKlxuICAgKiBBbiBvcHRpb25zIG9iamVjdCBjb250YWluaW5nIGEgZGVsYXkgYW5kXG4gICAqIGRldmVsb3Blci1kZWZpbmVkIHBhcmFtZXRlcnMgdGhhdCBwcm92aWRlIHN0eWxpbmcgZGVmYXVsdHMgYW5kXG4gICAqIGNhbiBiZSBvdmVycmlkZGVuIG9uIGludm9jYXRpb24uIERlZmF1bHQgZGVsYXkgaXMgMC5cbiAgICovXG4gIG9wdGlvbnM6IEFuaW1hdGlvbk9wdGlvbnN8bnVsbDtcbn1cblxuLyoqXG4gKiBFbmNhcHN1bGF0ZXMgYW5pbWF0aW9uIHF1ZXJ5IG9wdGlvbnMuXG4gKiBQYXNzZWQgdG8gdGhlIGBxdWVyeSgpYCBmdW5jdGlvbi5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBBbmltYXRpb25RdWVyeU9wdGlvbnMgZXh0ZW5kcyBBbmltYXRpb25PcHRpb25zIHtcbiAgLyoqXG4gICAqIFRydWUgaWYgdGhpcyBxdWVyeSBpcyBvcHRpb25hbCwgZmFsc2UgaWYgaXQgaXMgcmVxdWlyZWQuIERlZmF1bHQgaXMgZmFsc2UuXG4gICAqIEEgcmVxdWlyZWQgcXVlcnkgdGhyb3dzIGFuIGVycm9yIGlmIG5vIGVsZW1lbnRzIGFyZSByZXRyaWV2ZWQgd2hlblxuICAgKiB0aGUgcXVlcnkgaXMgZXhlY3V0ZWQuIEFuIG9wdGlvbmFsIHF1ZXJ5IGRvZXMgbm90LlxuICAgKlxuICAgKi9cbiAgb3B0aW9uYWw/OiBib29sZWFuO1xuICAvKipcbiAgICogQSBtYXhpbXVtIHRvdGFsIG51bWJlciBvZiByZXN1bHRzIHRvIHJldHVybiBmcm9tIHRoZSBxdWVyeS5cbiAgICogSWYgbmVnYXRpdmUsIHJlc3VsdHMgYXJlIGxpbWl0ZWQgZnJvbSB0aGUgZW5kIG9mIHRoZSBxdWVyeSBsaXN0IHRvd2FyZHMgdGhlIGJlZ2lubmluZy5cbiAgICogQnkgZGVmYXVsdCwgcmVzdWx0cyBhcmUgbm90IGxpbWl0ZWQuXG4gICAqL1xuICBsaW1pdD86IG51bWJlcjtcbn1cblxuLyoqXG4gKiBFbmNhcHN1bGF0ZXMgcGFyYW1ldGVycyBmb3Igc3RhZ2dlcmluZyB0aGUgc3RhcnQgdGltZXMgb2YgYSBzZXQgb2YgYW5pbWF0aW9uIHN0ZXBzLlxuICogSW5zdGFudGlhdGVkIGFuZCByZXR1cm5lZCBieSB0aGUgYHN0YWdnZXIoKWAgZnVuY3Rpb24uXG4gKlxuICogQHB1YmxpY0FwaVxuICoqL1xuZXhwb3J0IGludGVyZmFjZSBBbmltYXRpb25TdGFnZ2VyTWV0YWRhdGEgZXh0ZW5kcyBBbmltYXRpb25NZXRhZGF0YSB7XG4gIC8qKlxuICAgKiBUaGUgdGltaW5nIGRhdGEgZm9yIHRoZSBzdGVwcy5cbiAgICovXG4gIHRpbWluZ3M6IHN0cmluZ3xudW1iZXI7XG4gIC8qKlxuICAgKiBPbmUgb3IgbW9yZSBhbmltYXRpb24gc3RlcHMuXG4gICAqL1xuICBhbmltYXRpb246IEFuaW1hdGlvbk1ldGFkYXRhfEFuaW1hdGlvbk1ldGFkYXRhW107XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5hbWVkIGFuaW1hdGlvbiB0cmlnZ2VyLCBjb250YWluaW5nIGEgIGxpc3Qgb2YgYHN0YXRlKClgXG4gKiBhbmQgYHRyYW5zaXRpb24oKWAgZW50cmllcyB0byBiZSBldmFsdWF0ZWQgd2hlbiB0aGUgZXhwcmVzc2lvblxuICogYm91bmQgdG8gdGhlIHRyaWdnZXIgY2hhbmdlcy5cbiAqXG4gKiBAcGFyYW0gbmFtZSBBbiBpZGVudGlmeWluZyBzdHJpbmcuXG4gKiBAcGFyYW0gZGVmaW5pdGlvbnMgIEFuIGFuaW1hdGlvbiBkZWZpbml0aW9uIG9iamVjdCwgY29udGFpbmluZyBhbiBhcnJheSBvZiBgc3RhdGUoKWBcbiAqIGFuZCBgdHJhbnNpdGlvbigpYCBkZWNsYXJhdGlvbnMuXG4gKlxuICogQHJldHVybiBBbiBvYmplY3QgdGhhdCBlbmNhcHN1bGF0ZXMgdGhlIHRyaWdnZXIgZGF0YS5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICogRGVmaW5lIGFuIGFuaW1hdGlvbiB0cmlnZ2VyIGluIHRoZSBgYW5pbWF0aW9uc2Agc2VjdGlvbiBvZiBgQENvbXBvbmVudGAgbWV0YWRhdGEuXG4gKiBJbiB0aGUgdGVtcGxhdGUsIHJlZmVyZW5jZSB0aGUgdHJpZ2dlciBieSBuYW1lIGFuZCBiaW5kIGl0IHRvIGEgdHJpZ2dlciBleHByZXNzaW9uIHRoYXRcbiAqIGV2YWx1YXRlcyB0byBhIGRlZmluZWQgYW5pbWF0aW9uIHN0YXRlLCB1c2luZyB0aGUgZm9sbG93aW5nIGZvcm1hdDpcbiAqXG4gKiBgW0B0cmlnZ2VyTmFtZV09XCJleHByZXNzaW9uXCJgXG4gKlxuICogQW5pbWF0aW9uIHRyaWdnZXIgYmluZGluZ3MgY29udmVydCBhbGwgdmFsdWVzIHRvIHN0cmluZ3MsIGFuZCB0aGVuIG1hdGNoIHRoZVxuICogcHJldmlvdXMgYW5kIGN1cnJlbnQgdmFsdWVzIGFnYWluc3QgYW55IGxpbmtlZCB0cmFuc2l0aW9ucy5cbiAqIEJvb2xlYW5zIGNhbiBiZSBzcGVjaWZpZWQgYXMgYDFgIG9yIGB0cnVlYCBhbmQgYDBgIG9yIGBmYWxzZWAuXG4gKlxuICogIyMjIFVzYWdlIEV4YW1wbGVcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgY3JlYXRlcyBhbiBhbmltYXRpb24gdHJpZ2dlciByZWZlcmVuY2UgYmFzZWQgb24gdGhlIHByb3ZpZGVkXG4gKiBuYW1lIHZhbHVlLlxuICogVGhlIHByb3ZpZGVkIGFuaW1hdGlvbiB2YWx1ZSBpcyBleHBlY3RlZCB0byBiZSBhbiBhcnJheSBjb25zaXN0aW5nIG9mIHN0YXRlIGFuZFxuICogdHJhbnNpdGlvbiBkZWNsYXJhdGlvbnMuXG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogQENvbXBvbmVudCh7XG4gKiAgIHNlbGVjdG9yOiBcIm15LWNvbXBvbmVudFwiLFxuICogICB0ZW1wbGF0ZVVybDogXCJteS1jb21wb25lbnQtdHBsLmh0bWxcIixcbiAqICAgYW5pbWF0aW9uczogW1xuICogICAgIHRyaWdnZXIoXCJteUFuaW1hdGlvblRyaWdnZXJcIiwgW1xuICogICAgICAgc3RhdGUoLi4uKSxcbiAqICAgICAgIHN0YXRlKC4uLiksXG4gKiAgICAgICB0cmFuc2l0aW9uKC4uLiksXG4gKiAgICAgICB0cmFuc2l0aW9uKC4uLilcbiAqICAgICBdKVxuICogICBdXG4gKiB9KVxuICogY2xhc3MgTXlDb21wb25lbnQge1xuICogICBteVN0YXR1c0V4cCA9IFwic29tZXRoaW5nXCI7XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBUaGUgdGVtcGxhdGUgYXNzb2NpYXRlZCB3aXRoIHRoaXMgY29tcG9uZW50IG1ha2VzIHVzZSBvZiB0aGUgZGVmaW5lZCB0cmlnZ2VyXG4gKiBieSBiaW5kaW5nIHRvIGFuIGVsZW1lbnQgd2l0aGluIGl0cyB0ZW1wbGF0ZSBjb2RlLlxuICpcbiAqIGBgYGh0bWxcbiAqIDwhLS0gc29tZXdoZXJlIGluc2lkZSBvZiBteS1jb21wb25lbnQtdHBsLmh0bWwgLS0+XG4gKiA8ZGl2IFtAbXlBbmltYXRpb25UcmlnZ2VyXT1cIm15U3RhdHVzRXhwXCI+Li4uPC9kaXY+XG4gKiBgYGBcbiAqXG4gKiAjIyMgVXNpbmcgYW4gaW5saW5lIGZ1bmN0aW9uXG4gKiBUaGUgYHRyYW5zaXRpb25gIGFuaW1hdGlvbiBtZXRob2QgYWxzbyBzdXBwb3J0cyByZWFkaW5nIGFuIGlubGluZSBmdW5jdGlvbiB3aGljaCBjYW4gZGVjaWRlXG4gKiBpZiBpdHMgYXNzb2NpYXRlZCBhbmltYXRpb24gc2hvdWxkIGJlIHJ1bi5cbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiAvLyB0aGlzIG1ldGhvZCBpcyBydW4gZWFjaCB0aW1lIHRoZSBgbXlBbmltYXRpb25UcmlnZ2VyYCB0cmlnZ2VyIHZhbHVlIGNoYW5nZXMuXG4gKiBmdW5jdGlvbiBteUlubGluZU1hdGNoZXJGbihmcm9tU3RhdGU6IHN0cmluZywgdG9TdGF0ZTogc3RyaW5nLCBlbGVtZW50OiBhbnksIHBhcmFtczoge1trZXk6XG4gc3RyaW5nXTogYW55fSk6IGJvb2xlYW4ge1xuICogICAvLyBub3RpY2UgdGhhdCBgZWxlbWVudGAgYW5kIGBwYXJhbXNgIGFyZSBhbHNvIGF2YWlsYWJsZSBoZXJlXG4gKiAgIHJldHVybiB0b1N0YXRlID09ICd5ZXMtcGxlYXNlLWFuaW1hdGUnO1xuICogfVxuICpcbiAqIEBDb21wb25lbnQoe1xuICogICBzZWxlY3RvcjogJ215LWNvbXBvbmVudCcsXG4gKiAgIHRlbXBsYXRlVXJsOiAnbXktY29tcG9uZW50LXRwbC5odG1sJyxcbiAqICAgYW5pbWF0aW9uczogW1xuICogICAgIHRyaWdnZXIoJ215QW5pbWF0aW9uVHJpZ2dlcicsIFtcbiAqICAgICAgIHRyYW5zaXRpb24obXlJbmxpbmVNYXRjaGVyRm4sIFtcbiAqICAgICAgICAgLy8gdGhlIGFuaW1hdGlvbiBzZXF1ZW5jZSBjb2RlXG4gKiAgICAgICBdKSxcbiAqICAgICBdKVxuICogICBdXG4gKiB9KVxuICogY2xhc3MgTXlDb21wb25lbnQge1xuICogICBteVN0YXR1c0V4cCA9IFwieWVzLXBsZWFzZS1hbmltYXRlXCI7XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiAjIyMgRGlzYWJsaW5nIEFuaW1hdGlvbnNcbiAqIFdoZW4gdHJ1ZSwgdGhlIHNwZWNpYWwgYW5pbWF0aW9uIGNvbnRyb2wgYmluZGluZyBgQC5kaXNhYmxlZGAgYmluZGluZyBwcmV2ZW50c1xuICogYWxsIGFuaW1hdGlvbnMgZnJvbSByZW5kZXJpbmcuXG4gKiBQbGFjZSB0aGUgIGBALmRpc2FibGVkYCBiaW5kaW5nIG9uIGFuIGVsZW1lbnQgdG8gZGlzYWJsZVxuICogYW5pbWF0aW9ucyBvbiB0aGUgZWxlbWVudCBpdHNlbGYsIGFzIHdlbGwgYXMgYW55IGlubmVyIGFuaW1hdGlvbiB0cmlnZ2Vyc1xuICogd2l0aGluIHRoZSBlbGVtZW50LlxuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBzaG93cyBob3cgdG8gdXNlIHRoaXMgZmVhdHVyZTpcbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBAQ29tcG9uZW50KHtcbiAqICAgc2VsZWN0b3I6ICdteS1jb21wb25lbnQnLFxuICogICB0ZW1wbGF0ZTogYFxuICogICAgIDxkaXYgW0AuZGlzYWJsZWRdPVwiaXNEaXNhYmxlZFwiPlxuICogICAgICAgPGRpdiBbQGNoaWxkQW5pbWF0aW9uXT1cImV4cFwiPjwvZGl2PlxuICogICAgIDwvZGl2PlxuICogICBgLFxuICogICBhbmltYXRpb25zOiBbXG4gKiAgICAgdHJpZ2dlcihcImNoaWxkQW5pbWF0aW9uXCIsIFtcbiAqICAgICAgIC8vIC4uLlxuICogICAgIF0pXG4gKiAgIF1cbiAqIH0pXG4gKiBjbGFzcyBNeUNvbXBvbmVudCB7XG4gKiAgIGlzRGlzYWJsZWQgPSB0cnVlO1xuICogICBleHAgPSAnLi4uJztcbiAqIH1cbiAqIGBgYFxuICpcbiAqIFdoZW4gYEAuZGlzYWJsZWRgIGlzIHRydWUsIGl0IHByZXZlbnRzIHRoZSBgQGNoaWxkQW5pbWF0aW9uYCB0cmlnZ2VyIGZyb20gYW5pbWF0aW5nLFxuICogYWxvbmcgd2l0aCBhbnkgaW5uZXIgYW5pbWF0aW9ucy5cbiAqXG4gKiAjIyMgRGlzYWJsZSBhbmltYXRpb25zIGFwcGxpY2F0aW9uLXdpZGVcbiAqIFdoZW4gYW4gYXJlYSBvZiB0aGUgdGVtcGxhdGUgaXMgc2V0IHRvIGhhdmUgYW5pbWF0aW9ucyBkaXNhYmxlZCxcbiAqICoqYWxsKiogaW5uZXIgY29tcG9uZW50cyBoYXZlIHRoZWlyIGFuaW1hdGlvbnMgZGlzYWJsZWQgYXMgd2VsbC5cbiAqIFRoaXMgbWVhbnMgdGhhdCB5b3UgY2FuIGRpc2FibGUgYWxsIGFuaW1hdGlvbnMgZm9yIGFuIGFwcFxuICogYnkgcGxhY2luZyBhIGhvc3QgYmluZGluZyBzZXQgb24gYEAuZGlzYWJsZWRgIG9uIHRoZSB0b3Btb3N0IEFuZ3VsYXIgY29tcG9uZW50LlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGltcG9ydCB7Q29tcG9uZW50LCBIb3N0QmluZGluZ30gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG4gKlxuICogQENvbXBvbmVudCh7XG4gKiAgIHNlbGVjdG9yOiAnYXBwLWNvbXBvbmVudCcsXG4gKiAgIHRlbXBsYXRlVXJsOiAnYXBwLmNvbXBvbmVudC5odG1sJyxcbiAqIH0pXG4gKiBjbGFzcyBBcHBDb21wb25lbnQge1xuICogICBASG9zdEJpbmRpbmcoJ0AuZGlzYWJsZWQnKVxuICogICBwdWJsaWMgYW5pbWF0aW9uc0Rpc2FibGVkID0gdHJ1ZTtcbiAqIH1cbiAqIGBgYFxuICpcbiAqICMjIyBPdmVycmlkaW5nIGRpc2FibGVtZW50IG9mIGlubmVyIGFuaW1hdGlvbnNcbiAqIERlc3BpdGUgaW5uZXIgYW5pbWF0aW9ucyBiZWluZyBkaXNhYmxlZCwgYSBwYXJlbnQgYW5pbWF0aW9uIGNhbiBgcXVlcnkoKWBcbiAqIGZvciBpbm5lciBlbGVtZW50cyBsb2NhdGVkIGluIGRpc2FibGVkIGFyZWFzIG9mIHRoZSB0ZW1wbGF0ZSBhbmQgc3RpbGwgYW5pbWF0ZVxuICogdGhlbSBpZiBuZWVkZWQuIFRoaXMgaXMgYWxzbyB0aGUgY2FzZSBmb3Igd2hlbiBhIHN1YiBhbmltYXRpb24gaXNcbiAqIHF1ZXJpZWQgYnkgYSBwYXJlbnQgYW5kIHRoZW4gbGF0ZXIgYW5pbWF0ZWQgdXNpbmcgYGFuaW1hdGVDaGlsZCgpYC5cbiAqXG4gKiAjIyMgRGV0ZWN0aW5nIHdoZW4gYW4gYW5pbWF0aW9uIGlzIGRpc2FibGVkXG4gKiBJZiBhIHJlZ2lvbiBvZiB0aGUgRE9NIChvciB0aGUgZW50aXJlIGFwcGxpY2F0aW9uKSBoYXMgaXRzIGFuaW1hdGlvbnMgZGlzYWJsZWQsIHRoZSBhbmltYXRpb25cbiAqIHRyaWdnZXIgY2FsbGJhY2tzIHN0aWxsIGZpcmUsIGJ1dCBmb3IgemVybyBzZWNvbmRzLiBXaGVuIHRoZSBjYWxsYmFjayBmaXJlcywgaXQgcHJvdmlkZXNcbiAqIGFuIGluc3RhbmNlIG9mIGFuIGBBbmltYXRpb25FdmVudGAuIElmIGFuaW1hdGlvbnMgYXJlIGRpc2FibGVkLFxuICogdGhlIGAuZGlzYWJsZWRgIGZsYWcgb24gdGhlIGV2ZW50IGlzIHRydWUuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gdHJpZ2dlcihuYW1lOiBzdHJpbmcsIGRlZmluaXRpb25zOiBBbmltYXRpb25NZXRhZGF0YVtdKTogQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhIHtcbiAgcmV0dXJuIHt0eXBlOiBBbmltYXRpb25NZXRhZGF0YVR5cGUuVHJpZ2dlciwgbmFtZSwgZGVmaW5pdGlvbnMsIG9wdGlvbnM6IHt9fTtcbn1cblxuLyoqXG4gKiBEZWZpbmVzIGFuIGFuaW1hdGlvbiBzdGVwIHRoYXQgY29tYmluZXMgc3R5bGluZyBpbmZvcm1hdGlvbiB3aXRoIHRpbWluZyBpbmZvcm1hdGlvbi5cbiAqXG4gKiBAcGFyYW0gdGltaW5ncyBTZXRzIGBBbmltYXRlVGltaW5nc2AgZm9yIHRoZSBwYXJlbnQgYW5pbWF0aW9uLlxuICogQSBzdHJpbmcgaW4gdGhlIGZvcm1hdCBcImR1cmF0aW9uIFtkZWxheV0gW2Vhc2luZ11cIi5cbiAqICAtIER1cmF0aW9uIGFuZCBkZWxheSBhcmUgZXhwcmVzc2VkIGFzIGEgbnVtYmVyIGFuZCBvcHRpb25hbCB0aW1lIHVuaXQsXG4gKiBzdWNoIGFzIFwiMXNcIiBvciBcIjEwbXNcIiBmb3Igb25lIHNlY29uZCBhbmQgMTAgbWlsbGlzZWNvbmRzLCByZXNwZWN0aXZlbHkuXG4gKiBUaGUgZGVmYXVsdCB1bml0IGlzIG1pbGxpc2Vjb25kcy5cbiAqICAtIFRoZSBlYXNpbmcgdmFsdWUgY29udHJvbHMgaG93IHRoZSBhbmltYXRpb24gYWNjZWxlcmF0ZXMgYW5kIGRlY2VsZXJhdGVzXG4gKiBkdXJpbmcgaXRzIHJ1bnRpbWUuIFZhbHVlIGlzIG9uZSBvZiAgYGVhc2VgLCBgZWFzZS1pbmAsIGBlYXNlLW91dGAsXG4gKiBgZWFzZS1pbi1vdXRgLCBvciBhIGBjdWJpYy1iZXppZXIoKWAgZnVuY3Rpb24gY2FsbC5cbiAqIElmIG5vdCBzdXBwbGllZCwgbm8gZWFzaW5nIGlzIGFwcGxpZWQuXG4gKlxuICogRm9yIGV4YW1wbGUsIHRoZSBzdHJpbmcgXCIxcyAxMDBtcyBlYXNlLW91dFwiIHNwZWNpZmllcyBhIGR1cmF0aW9uIG9mXG4gKiAxMDAwIG1pbGxpc2Vjb25kcywgYW5kIGRlbGF5IG9mIDEwMCBtcywgYW5kIHRoZSBcImVhc2Utb3V0XCIgZWFzaW5nIHN0eWxlLFxuICogd2hpY2ggZGVjZWxlcmF0ZXMgbmVhciB0aGUgZW5kIG9mIHRoZSBkdXJhdGlvbi5cbiAqIEBwYXJhbSBzdHlsZXMgU2V0cyBBbmltYXRpb25TdHlsZXMgZm9yIHRoZSBwYXJlbnQgYW5pbWF0aW9uLlxuICogQSBmdW5jdGlvbiBjYWxsIHRvIGVpdGhlciBgc3R5bGUoKWAgb3IgYGtleWZyYW1lcygpYFxuICogdGhhdCByZXR1cm5zIGEgY29sbGVjdGlvbiBvZiBDU1Mgc3R5bGUgZW50cmllcyB0byBiZSBhcHBsaWVkIHRvIHRoZSBwYXJlbnQgYW5pbWF0aW9uLlxuICogV2hlbiBudWxsLCB1c2VzIHRoZSBzdHlsZXMgZnJvbSB0aGUgZGVzdGluYXRpb24gc3RhdGUuXG4gKiBUaGlzIGlzIHVzZWZ1bCB3aGVuIGRlc2NyaWJpbmcgYW4gYW5pbWF0aW9uIHN0ZXAgdGhhdCB3aWxsIGNvbXBsZXRlIGFuIGFuaW1hdGlvbjtcbiAqIHNlZSBcIkFuaW1hdGluZyB0byB0aGUgZmluYWwgc3RhdGVcIiBpbiBgdHJhbnNpdGlvbnMoKWAuXG4gKiBAcmV0dXJucyBBbiBvYmplY3QgdGhhdCBlbmNhcHN1bGF0ZXMgdGhlIGFuaW1hdGlvbiBzdGVwLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKiBDYWxsIHdpdGhpbiBhbiBhbmltYXRpb24gYHNlcXVlbmNlKClgLCBge0BsaW5rIGFuaW1hdGlvbnMvZ3JvdXAgZ3JvdXAoKX1gLCBvclxuICogYHRyYW5zaXRpb24oKWAgY2FsbCB0byBzcGVjaWZ5IGFuIGFuaW1hdGlvbiBzdGVwXG4gKiB0aGF0IGFwcGxpZXMgZ2l2ZW4gc3R5bGUgZGF0YSB0byB0aGUgcGFyZW50IGFuaW1hdGlvbiBmb3IgYSBnaXZlbiBhbW91bnQgb2YgdGltZS5cbiAqXG4gKiAjIyMgU3ludGF4IEV4YW1wbGVzXG4gKiAqKlRpbWluZyBleGFtcGxlcyoqXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlcyBzaG93IHZhcmlvdXMgYHRpbWluZ3NgIHNwZWNpZmljYXRpb25zLlxuICogLSBgYW5pbWF0ZSg1MDApYCA6IER1cmF0aW9uIGlzIDUwMCBtaWxsaXNlY29uZHMuXG4gKiAtIGBhbmltYXRlKFwiMXNcIilgIDogRHVyYXRpb24gaXMgMTAwMCBtaWxsaXNlY29uZHMuXG4gKiAtIGBhbmltYXRlKFwiMTAwbXMgMC41c1wiKWAgOiBEdXJhdGlvbiBpcyAxMDAgbWlsbGlzZWNvbmRzLCBkZWxheSBpcyA1MDAgbWlsbGlzZWNvbmRzLlxuICogLSBgYW5pbWF0ZShcIjVzIGVhc2UtaW5cIilgIDogRHVyYXRpb24gaXMgNTAwMCBtaWxsaXNlY29uZHMsIGVhc2luZyBpbi5cbiAqIC0gYGFuaW1hdGUoXCI1cyAxMG1zIGN1YmljLWJlemllciguMTcsLjY3LC44OCwuMSlcIilgIDogRHVyYXRpb24gaXMgNTAwMCBtaWxsaXNlY29uZHMsIGRlbGF5IGlzIDEwXG4gKiBtaWxsaXNlY29uZHMsIGVhc2luZyBhY2NvcmRpbmcgdG8gYSBiZXppZXIgY3VydmUuXG4gKlxuICogKipTdHlsZSBleGFtcGxlcyoqXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIGNhbGxzIGBzdHlsZSgpYCB0byBzZXQgYSBzaW5nbGUgQ1NTIHN0eWxlLlxuICogYGBgdHlwZXNjcmlwdFxuICogYW5pbWF0ZSg1MDAsIHN0eWxlKHsgYmFja2dyb3VuZDogXCJyZWRcIiB9KSlcbiAqIGBgYFxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIGNhbGxzIGBrZXlmcmFtZXMoKWAgdG8gc2V0IGEgQ1NTIHN0eWxlXG4gKiB0byBkaWZmZXJlbnQgdmFsdWVzIGZvciBzdWNjZXNzaXZlIGtleWZyYW1lcy5cbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGFuaW1hdGUoNTAwLCBrZXlmcmFtZXMoXG4gKiAgW1xuICogICBzdHlsZSh7IGJhY2tncm91bmQ6IFwiYmx1ZVwiIH0pKSxcbiAqICAgc3R5bGUoeyBiYWNrZ3JvdW5kOiBcInJlZFwiIH0pKVxuICogIF0pXG4gKiBgYGBcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhbmltYXRlKFxuICAgIHRpbWluZ3M6IHN0cmluZyB8IG51bWJlciwgc3R5bGVzOiBBbmltYXRpb25TdHlsZU1ldGFkYXRhIHwgQW5pbWF0aW9uS2V5ZnJhbWVzU2VxdWVuY2VNZXRhZGF0YSB8XG4gICAgICAgIG51bGwgPSBudWxsKTogQW5pbWF0aW9uQW5pbWF0ZU1ldGFkYXRhIHtcbiAgcmV0dXJuIHt0eXBlOiBBbmltYXRpb25NZXRhZGF0YVR5cGUuQW5pbWF0ZSwgc3R5bGVzLCB0aW1pbmdzfTtcbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb24gRGVmaW5lcyBhIGxpc3Qgb2YgYW5pbWF0aW9uIHN0ZXBzIHRvIGJlIHJ1biBpbiBwYXJhbGxlbC5cbiAqXG4gKiBAcGFyYW0gc3RlcHMgQW4gYXJyYXkgb2YgYW5pbWF0aW9uIHN0ZXAgb2JqZWN0cy5cbiAqIC0gV2hlbiBzdGVwcyBhcmUgZGVmaW5lZCBieSBgc3R5bGUoKWAgb3IgYGFuaW1hdGUoKWBcbiAqIGZ1bmN0aW9uIGNhbGxzLCBlYWNoIGNhbGwgd2l0aGluIHRoZSBncm91cCBpcyBleGVjdXRlZCBpbnN0YW50bHkuXG4gKiAtIFRvIHNwZWNpZnkgb2Zmc2V0IHN0eWxlcyB0byBiZSBhcHBsaWVkIGF0IGEgbGF0ZXIgdGltZSwgZGVmaW5lIHN0ZXBzIHdpdGhcbiAqIGBrZXlmcmFtZXMoKWAsIG9yIHVzZSBgYW5pbWF0ZSgpYCBjYWxscyB3aXRoIGEgZGVsYXkgdmFsdWUuXG4gKiBGb3IgZXhhbXBsZTpcbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBncm91cChbXG4gKiAgIGFuaW1hdGUoXCIxc1wiLCBzdHlsZSh7IGJhY2tncm91bmQ6IFwiYmxhY2tcIiB9KSksXG4gKiAgIGFuaW1hdGUoXCIyc1wiLCBzdHlsZSh7IGNvbG9yOiBcIndoaXRlXCIgfSkpXG4gKiBdKVxuICogYGBgXG4gKlxuICogQHBhcmFtIG9wdGlvbnMgQW4gb3B0aW9ucyBvYmplY3QgY29udGFpbmluZyBhIGRlbGF5IGFuZFxuICogZGV2ZWxvcGVyLWRlZmluZWQgcGFyYW1ldGVycyB0aGF0IHByb3ZpZGUgc3R5bGluZyBkZWZhdWx0cyBhbmRcbiAqIGNhbiBiZSBvdmVycmlkZGVuIG9uIGludm9jYXRpb24uXG4gKlxuICogQHJldHVybiBBbiBvYmplY3QgdGhhdCBlbmNhcHN1bGF0ZXMgdGhlIGdyb3VwIGRhdGEuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqIEdyb3VwZWQgYW5pbWF0aW9ucyBhcmUgdXNlZnVsIHdoZW4gYSBzZXJpZXMgb2Ygc3R5bGVzIG11c3QgYmVcbiAqIGFuaW1hdGVkIGF0IGRpZmZlcmVudCBzdGFydGluZyB0aW1lcyBhbmQgY2xvc2VkIG9mZiBhdCBkaWZmZXJlbnQgZW5kaW5nIHRpbWVzLlxuICpcbiAqIFdoZW4gY2FsbGVkIHdpdGhpbiBhIGBzZXF1ZW5jZSgpYCBvciBhXG4gKiBgdHJhbnNpdGlvbigpYCBjYWxsLCBkb2VzIG5vdCBjb250aW51ZSB0byB0aGUgbmV4dFxuICogaW5zdHJ1Y3Rpb24gdW50aWwgYWxsIG9mIHRoZSBpbm5lciBhbmltYXRpb24gc3RlcHMgaGF2ZSBjb21wbGV0ZWQuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ3JvdXAoXG4gICAgc3RlcHM6IEFuaW1hdGlvbk1ldGFkYXRhW10sIG9wdGlvbnM6IEFuaW1hdGlvbk9wdGlvbnMgfCBudWxsID0gbnVsbCk6IEFuaW1hdGlvbkdyb3VwTWV0YWRhdGEge1xuICByZXR1cm4ge3R5cGU6IEFuaW1hdGlvbk1ldGFkYXRhVHlwZS5Hcm91cCwgc3RlcHMsIG9wdGlvbnN9O1xufVxuXG4vKipcbiAqIERlZmluZXMgYSBsaXN0IG9mIGFuaW1hdGlvbiBzdGVwcyB0byBiZSBydW4gc2VxdWVudGlhbGx5LCBvbmUgYnkgb25lLlxuICpcbiAqIEBwYXJhbSBzdGVwcyBBbiBhcnJheSBvZiBhbmltYXRpb24gc3RlcCBvYmplY3RzLlxuICogLSBTdGVwcyBkZWZpbmVkIGJ5IGBzdHlsZSgpYCBjYWxscyBhcHBseSB0aGUgc3R5bGluZyBkYXRhIGltbWVkaWF0ZWx5LlxuICogLSBTdGVwcyBkZWZpbmVkIGJ5IGBhbmltYXRlKClgIGNhbGxzIGFwcGx5IHRoZSBzdHlsaW5nIGRhdGEgb3ZlciB0aW1lXG4gKiAgIGFzIHNwZWNpZmllZCBieSB0aGUgdGltaW5nIGRhdGEuXG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogc2VxdWVuY2UoW1xuICogICBzdHlsZSh7IG9wYWNpdHk6IDAgfSkpLFxuICogICBhbmltYXRlKFwiMXNcIiwgc3R5bGUoeyBvcGFjaXR5OiAxIH0pKVxuICogXSlcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSBvcHRpb25zIEFuIG9wdGlvbnMgb2JqZWN0IGNvbnRhaW5pbmcgYSBkZWxheSBhbmRcbiAqIGRldmVsb3Blci1kZWZpbmVkIHBhcmFtZXRlcnMgdGhhdCBwcm92aWRlIHN0eWxpbmcgZGVmYXVsdHMgYW5kXG4gKiBjYW4gYmUgb3ZlcnJpZGRlbiBvbiBpbnZvY2F0aW9uLlxuICpcbiAqIEByZXR1cm4gQW4gb2JqZWN0IHRoYXQgZW5jYXBzdWxhdGVzIHRoZSBzZXF1ZW5jZSBkYXRhLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKiBXaGVuIHlvdSBwYXNzIGFuIGFycmF5IG9mIHN0ZXBzIHRvIGFcbiAqIGB0cmFuc2l0aW9uKClgIGNhbGwsIHRoZSBzdGVwcyBydW4gc2VxdWVudGlhbGx5IGJ5IGRlZmF1bHQuXG4gKiBDb21wYXJlIHRoaXMgdG8gdGhlIGB7QGxpbmsgYW5pbWF0aW9ucy9ncm91cCBncm91cCgpfWAgY2FsbCwgd2hpY2ggcnVucyBhbmltYXRpb24gc3RlcHMgaW4gcGFyYWxsZWwuXG4gKlxuICogV2hlbiBhIHNlcXVlbmNlIGlzIHVzZWQgd2l0aGluIGEgYHtAbGluayBhbmltYXRpb25zL2dyb3VwIGdyb3VwKCl9YCBvciBhIGB0cmFuc2l0aW9uKClgIGNhbGwsXG4gKiBleGVjdXRpb24gY29udGludWVzIHRvIHRoZSBuZXh0IGluc3RydWN0aW9uIG9ubHkgYWZ0ZXIgZWFjaCBvZiB0aGUgaW5uZXIgYW5pbWF0aW9uXG4gKiBzdGVwcyBoYXZlIGNvbXBsZXRlZC5cbiAqXG4gKiBAcHVibGljQXBpXG4gKiovXG5leHBvcnQgZnVuY3Rpb24gc2VxdWVuY2Uoc3RlcHM6IEFuaW1hdGlvbk1ldGFkYXRhW10sIG9wdGlvbnM6IEFuaW1hdGlvbk9wdGlvbnMgfCBudWxsID0gbnVsbCk6XG4gICAgQW5pbWF0aW9uU2VxdWVuY2VNZXRhZGF0YSB7XG4gIHJldHVybiB7dHlwZTogQW5pbWF0aW9uTWV0YWRhdGFUeXBlLlNlcXVlbmNlLCBzdGVwcywgb3B0aW9uc307XG59XG5cbi8qKlxuICogRGVjbGFyZXMgYSBrZXkvdmFsdWUgb2JqZWN0IGNvbnRhaW5pbmcgQ1NTIHByb3BlcnRpZXMvc3R5bGVzIHRoYXRcbiAqIGNhbiB0aGVuIGJlIHVzZWQgZm9yIGFuIGFuaW1hdGlvbiBgc3RhdGVgLCB3aXRoaW4gYW4gYW5pbWF0aW9uIGBzZXF1ZW5jZWAsXG4gKiBvciBhcyBzdHlsaW5nIGRhdGEgZm9yIGNhbGxzIHRvIGBhbmltYXRlKClgIGFuZCBga2V5ZnJhbWVzKClgLlxuICpcbiAqIEBwYXJhbSB0b2tlbnMgQSBzZXQgb2YgQ1NTIHN0eWxlcyBvciBIVE1MIHN0eWxlcyBhc3NvY2lhdGVkIHdpdGggYW4gYW5pbWF0aW9uIHN0YXRlLlxuICogVGhlIHZhbHVlIGNhbiBiZSBhbnkgb2YgdGhlIGZvbGxvd2luZzpcbiAqIC0gQSBrZXktdmFsdWUgc3R5bGUgcGFpciBhc3NvY2lhdGluZyBhIENTUyBwcm9wZXJ0eSB3aXRoIGEgdmFsdWUuXG4gKiAtIEFuIGFycmF5IG9mIGtleS12YWx1ZSBzdHlsZSBwYWlycy5cbiAqIC0gQW4gYXN0ZXJpc2sgKCopLCB0byB1c2UgYXV0by1zdHlsaW5nLCB3aGVyZSBzdHlsZXMgYXJlIGRlcml2ZWQgZnJvbSB0aGUgZWxlbWVudFxuICogYmVpbmcgYW5pbWF0ZWQgYW5kIGFwcGxpZWQgdG8gdGhlIGFuaW1hdGlvbiB3aGVuIGl0IHN0YXJ0cy5cbiAqXG4gKiBBdXRvLXN0eWxpbmcgY2FuIGJlIHVzZWQgdG8gZGVmaW5lIGEgc3RhdGUgdGhhdCBkZXBlbmRzIG9uIGxheW91dCBvciBvdGhlclxuICogZW52aXJvbm1lbnRhbCBmYWN0b3JzLlxuICpcbiAqIEByZXR1cm4gQW4gb2JqZWN0IHRoYXQgZW5jYXBzdWxhdGVzIHRoZSBzdHlsZSBkYXRhLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGVzIGNyZWF0ZSBhbmltYXRpb24gc3R5bGVzIHRoYXQgY29sbGVjdCBhIHNldCBvZlxuICogQ1NTIHByb3BlcnR5IHZhbHVlczpcbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiAvLyBzdHJpbmcgdmFsdWVzIGZvciBDU1MgcHJvcGVydGllc1xuICogc3R5bGUoeyBiYWNrZ3JvdW5kOiBcInJlZFwiLCBjb2xvcjogXCJibHVlXCIgfSlcbiAqXG4gKiAvLyBudW1lcmljYWwgcGl4ZWwgdmFsdWVzXG4gKiBzdHlsZSh7IHdpZHRoOiAxMDAsIGhlaWdodDogMCB9KVxuICogYGBgXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHVzZXMgYXV0by1zdHlsaW5nIHRvIGFsbG93IGEgY29tcG9uZW50IHRvIGFuaW1hdGUgZnJvbVxuICogYSBoZWlnaHQgb2YgMCB1cCB0byB0aGUgaGVpZ2h0IG9mIHRoZSBwYXJlbnQgZWxlbWVudDpcbiAqXG4gKiBgYGBcbiAqIHN0eWxlKHsgaGVpZ2h0OiAwIH0pLFxuICogYW5pbWF0ZShcIjFzXCIsIHN0eWxlKHsgaGVpZ2h0OiBcIipcIiB9KSlcbiAqIGBgYFxuICpcbiAqIEBwdWJsaWNBcGlcbiAqKi9cbmV4cG9ydCBmdW5jdGlvbiBzdHlsZShcbiAgICB0b2tlbnM6ICcqJyB8IHtba2V5OiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXJ9IHxcbiAgICBBcnJheTwnKid8e1trZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlcn0+KTogQW5pbWF0aW9uU3R5bGVNZXRhZGF0YSB7XG4gIHJldHVybiB7dHlwZTogQW5pbWF0aW9uTWV0YWRhdGFUeXBlLlN0eWxlLCBzdHlsZXM6IHRva2Vucywgb2Zmc2V0OiBudWxsfTtcbn1cblxuLyoqXG4gKiBEZWNsYXJlcyBhbiBhbmltYXRpb24gc3RhdGUgd2l0aGluIGEgdHJpZ2dlciBhdHRhY2hlZCB0byBhbiBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSBuYW1lIE9uZSBvciBtb3JlIG5hbWVzIGZvciB0aGUgZGVmaW5lZCBzdGF0ZSBpbiBhIGNvbW1hLXNlcGFyYXRlZCBzdHJpbmcuXG4gKiBUaGUgZm9sbG93aW5nIHJlc2VydmVkIHN0YXRlIG5hbWVzIGNhbiBiZSBzdXBwbGllZCB0byBkZWZpbmUgYSBzdHlsZSBmb3Igc3BlY2lmaWMgdXNlXG4gKiBjYXNlczpcbiAqXG4gKiAtIGB2b2lkYCBZb3UgY2FuIGFzc29jaWF0ZSBzdHlsZXMgd2l0aCB0aGlzIG5hbWUgdG8gYmUgdXNlZCB3aGVuXG4gKiB0aGUgZWxlbWVudCBpcyBkZXRhY2hlZCBmcm9tIHRoZSBhcHBsaWNhdGlvbi4gRm9yIGV4YW1wbGUsIHdoZW4gYW4gYG5nSWZgIGV2YWx1YXRlc1xuICogdG8gZmFsc2UsIHRoZSBzdGF0ZSBvZiB0aGUgYXNzb2NpYXRlZCBlbGVtZW50IGlzIHZvaWQuXG4gKiAgLSBgKmAgKGFzdGVyaXNrKSBJbmRpY2F0ZXMgdGhlIGRlZmF1bHQgc3RhdGUuIFlvdSBjYW4gYXNzb2NpYXRlIHN0eWxlcyB3aXRoIHRoaXMgbmFtZVxuICogdG8gYmUgdXNlZCBhcyB0aGUgZmFsbGJhY2sgd2hlbiB0aGUgc3RhdGUgdGhhdCBpcyBiZWluZyBhbmltYXRlZCBpcyBub3QgZGVjbGFyZWRcbiAqIHdpdGhpbiB0aGUgdHJpZ2dlci5cbiAqXG4gKiBAcGFyYW0gc3R5bGVzIEEgc2V0IG9mIENTUyBzdHlsZXMgYXNzb2NpYXRlZCB3aXRoIHRoaXMgc3RhdGUsIGNyZWF0ZWQgdXNpbmcgdGhlXG4gKiBgc3R5bGUoKWAgZnVuY3Rpb24uXG4gKiBUaGlzIHNldCBvZiBzdHlsZXMgcGVyc2lzdHMgb24gdGhlIGVsZW1lbnQgb25jZSB0aGUgc3RhdGUgaGFzIGJlZW4gcmVhY2hlZC5cbiAqIEBwYXJhbSBvcHRpb25zIFBhcmFtZXRlcnMgdGhhdCBjYW4gYmUgcGFzc2VkIHRvIHRoZSBzdGF0ZSB3aGVuIGl0IGlzIGludm9rZWQuXG4gKiAwIG9yIG1vcmUga2V5LXZhbHVlIHBhaXJzLlxuICogQHJldHVybiBBbiBvYmplY3QgdGhhdCBlbmNhcHN1bGF0ZXMgdGhlIG5ldyBzdGF0ZSBkYXRhLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKiBVc2UgdGhlIGB0cmlnZ2VyKClgIGZ1bmN0aW9uIHRvIHJlZ2lzdGVyIHN0YXRlcyB0byBhbiBhbmltYXRpb24gdHJpZ2dlci5cbiAqIFVzZSB0aGUgYHRyYW5zaXRpb24oKWAgZnVuY3Rpb24gdG8gYW5pbWF0ZSBiZXR3ZWVuIHN0YXRlcy5cbiAqIFdoZW4gYSBzdGF0ZSBpcyBhY3RpdmUgd2l0aGluIGEgY29tcG9uZW50LCBpdHMgYXNzb2NpYXRlZCBzdHlsZXMgcGVyc2lzdCBvbiB0aGUgZWxlbWVudCxcbiAqIGV2ZW4gd2hlbiB0aGUgYW5pbWF0aW9uIGVuZHMuXG4gKlxuICogQHB1YmxpY0FwaVxuICoqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0YXRlKFxuICAgIG5hbWU6IHN0cmluZywgc3R5bGVzOiBBbmltYXRpb25TdHlsZU1ldGFkYXRhLFxuICAgIG9wdGlvbnM/OiB7cGFyYW1zOiB7W25hbWU6IHN0cmluZ106IGFueX19KTogQW5pbWF0aW9uU3RhdGVNZXRhZGF0YSB7XG4gIHJldHVybiB7dHlwZTogQW5pbWF0aW9uTWV0YWRhdGFUeXBlLlN0YXRlLCBuYW1lLCBzdHlsZXMsIG9wdGlvbnN9O1xufVxuXG4vKipcbiAqIERlZmluZXMgYSBzZXQgb2YgYW5pbWF0aW9uIHN0eWxlcywgYXNzb2NpYXRpbmcgZWFjaCBzdHlsZSB3aXRoIGFuIG9wdGlvbmFsIGBvZmZzZXRgIHZhbHVlLlxuICpcbiAqIEBwYXJhbSBzdGVwcyBBIHNldCBvZiBhbmltYXRpb24gc3R5bGVzIHdpdGggb3B0aW9uYWwgb2Zmc2V0IGRhdGEuXG4gKiBUaGUgb3B0aW9uYWwgYG9mZnNldGAgdmFsdWUgZm9yIGEgc3R5bGUgc3BlY2lmaWVzIGEgcGVyY2VudGFnZSBvZiB0aGUgdG90YWwgYW5pbWF0aW9uXG4gKiB0aW1lIGF0IHdoaWNoIHRoYXQgc3R5bGUgaXMgYXBwbGllZC5cbiAqIEByZXR1cm5zIEFuIG9iamVjdCB0aGF0IGVuY2Fwc3VsYXRlcyB0aGUga2V5ZnJhbWVzIGRhdGEuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqIFVzZSB3aXRoIHRoZSBgYW5pbWF0ZSgpYCBjYWxsLiBJbnN0ZWFkIG9mIGFwcGx5aW5nIGFuaW1hdGlvbnNcbiAqIGZyb20gdGhlIGN1cnJlbnQgc3RhdGVcbiAqIHRvIHRoZSBkZXN0aW5hdGlvbiBzdGF0ZSwga2V5ZnJhbWVzIGRlc2NyaWJlIGhvdyBlYWNoIHN0eWxlIGVudHJ5IGlzIGFwcGxpZWQgYW5kIGF0IHdoYXQgcG9pbnRcbiAqIHdpdGhpbiB0aGUgYW5pbWF0aW9uIGFyYy5cbiAqIENvbXBhcmUgW0NTUyBLZXlmcmFtZSBBbmltYXRpb25zXShodHRwczovL3d3dy53M3NjaG9vbHMuY29tL2Nzcy9jc3MzX2FuaW1hdGlvbnMuYXNwKS5cbiAqXG4gKiAjIyMgVXNhZ2VcbiAqXG4gKiBJbiB0aGUgZm9sbG93aW5nIGV4YW1wbGUsIHRoZSBvZmZzZXQgdmFsdWVzIGRlc2NyaWJlXG4gKiB3aGVuIGVhY2ggYGJhY2tncm91bmRDb2xvcmAgdmFsdWUgaXMgYXBwbGllZC4gVGhlIGNvbG9yIGlzIHJlZCBhdCB0aGUgc3RhcnQsIGFuZCBjaGFuZ2VzIHRvXG4gKiBibHVlIHdoZW4gMjAlIG9mIHRoZSB0b3RhbCB0aW1lIGhhcyBlbGFwc2VkLlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIC8vIHRoZSBwcm92aWRlZCBvZmZzZXQgdmFsdWVzXG4gKiBhbmltYXRlKFwiNXNcIiwga2V5ZnJhbWVzKFtcbiAqICAgc3R5bGUoeyBiYWNrZ3JvdW5kQ29sb3I6IFwicmVkXCIsIG9mZnNldDogMCB9KSxcbiAqICAgc3R5bGUoeyBiYWNrZ3JvdW5kQ29sb3I6IFwiYmx1ZVwiLCBvZmZzZXQ6IDAuMiB9KSxcbiAqICAgc3R5bGUoeyBiYWNrZ3JvdW5kQ29sb3I6IFwib3JhbmdlXCIsIG9mZnNldDogMC4zIH0pLFxuICogICBzdHlsZSh7IGJhY2tncm91bmRDb2xvcjogXCJibGFja1wiLCBvZmZzZXQ6IDEgfSlcbiAqIF0pKVxuICogYGBgXG4gKlxuICogSWYgdGhlcmUgYXJlIG5vIGBvZmZzZXRgIHZhbHVlcyBzcGVjaWZpZWQgaW4gdGhlIHN0eWxlIGVudHJpZXMsIHRoZSBvZmZzZXRzXG4gKiBhcmUgY2FsY3VsYXRlZCBhdXRvbWF0aWNhbGx5LlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGFuaW1hdGUoXCI1c1wiLCBrZXlmcmFtZXMoW1xuICogICBzdHlsZSh7IGJhY2tncm91bmRDb2xvcjogXCJyZWRcIiB9KSAvLyBvZmZzZXQgPSAwXG4gKiAgIHN0eWxlKHsgYmFja2dyb3VuZENvbG9yOiBcImJsdWVcIiB9KSAvLyBvZmZzZXQgPSAwLjMzXG4gKiAgIHN0eWxlKHsgYmFja2dyb3VuZENvbG9yOiBcIm9yYW5nZVwiIH0pIC8vIG9mZnNldCA9IDAuNjZcbiAqICAgc3R5bGUoeyBiYWNrZ3JvdW5kQ29sb3I6IFwiYmxhY2tcIiB9KSAvLyBvZmZzZXQgPSAxXG4gKiBdKSlcbiAqYGBgXG5cbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGtleWZyYW1lcyhzdGVwczogQW5pbWF0aW9uU3R5bGVNZXRhZGF0YVtdKTogQW5pbWF0aW9uS2V5ZnJhbWVzU2VxdWVuY2VNZXRhZGF0YSB7XG4gIHJldHVybiB7dHlwZTogQW5pbWF0aW9uTWV0YWRhdGFUeXBlLktleWZyYW1lcywgc3RlcHN9O1xufVxuXG4vKipcbiAqIERlY2xhcmVzIGFuIGFuaW1hdGlvbiB0cmFuc2l0aW9uIGFzIGEgc2VxdWVuY2Ugb2YgYW5pbWF0aW9uIHN0ZXBzIHRvIHJ1biB3aGVuIGEgZ2l2ZW5cbiAqIGNvbmRpdGlvbiBpcyBzYXRpc2ZpZWQuIFRoZSBjb25kaXRpb24gaXMgYSBCb29sZWFuIGV4cHJlc3Npb24gb3IgZnVuY3Rpb24gdGhhdCBjb21wYXJlc1xuICogdGhlIHByZXZpb3VzIGFuZCBjdXJyZW50IGFuaW1hdGlvbiBzdGF0ZXMsIGFuZCByZXR1cm5zIHRydWUgaWYgdGhpcyB0cmFuc2l0aW9uIHNob3VsZCBvY2N1ci5cbiAqIFdoZW4gdGhlIHN0YXRlIGNyaXRlcmlhIG9mIGEgZGVmaW5lZCB0cmFuc2l0aW9uIGFyZSBtZXQsIHRoZSBhc3NvY2lhdGVkIGFuaW1hdGlvbiBpc1xuICogdHJpZ2dlcmVkLlxuICpcbiAqIEBwYXJhbSBzdGF0ZUNoYW5nZUV4cHIgQSBCb29sZWFuIGV4cHJlc3Npb24gb3IgZnVuY3Rpb24gdGhhdCBjb21wYXJlcyB0aGUgcHJldmlvdXMgYW5kIGN1cnJlbnRcbiAqIGFuaW1hdGlvbiBzdGF0ZXMsIGFuZCByZXR1cm5zIHRydWUgaWYgdGhpcyB0cmFuc2l0aW9uIHNob3VsZCBvY2N1ci4gTm90ZSB0aGF0ICBcInRydWVcIiBhbmQgXCJmYWxzZVwiXG4gKiBtYXRjaCAxIGFuZCAwLCByZXNwZWN0aXZlbHkuIEFuIGV4cHJlc3Npb24gaXMgZXZhbHVhdGVkIGVhY2ggdGltZSBhIHN0YXRlIGNoYW5nZSBvY2N1cnMgaW4gdGhlXG4gKiBhbmltYXRpb24gdHJpZ2dlciBlbGVtZW50LlxuICogVGhlIGFuaW1hdGlvbiBzdGVwcyBydW4gd2hlbiB0aGUgZXhwcmVzc2lvbiBldmFsdWF0ZXMgdG8gdHJ1ZS5cbiAqXG4gKiAtIEEgc3RhdGUtY2hhbmdlIHN0cmluZyB0YWtlcyB0aGUgZm9ybSBcInN0YXRlMSA9PiBzdGF0ZTJcIiwgd2hlcmUgZWFjaCBzaWRlIGlzIGEgZGVmaW5lZCBhbmltYXRpb25cbiAqIHN0YXRlLCBvciBhbiBhc3Rlcml4ICgqKSB0byByZWZlciB0byBhIGR5bmFtaWMgc3RhcnQgb3IgZW5kIHN0YXRlLlxuICogICAtIFRoZSBleHByZXNzaW9uIHN0cmluZyBjYW4gY29udGFpbiBtdWx0aXBsZSBjb21tYS1zZXBhcmF0ZWQgc3RhdGVtZW50cztcbiAqIGZvciBleGFtcGxlIFwic3RhdGUxID0+IHN0YXRlMiwgc3RhdGUzID0+IHN0YXRlNFwiLlxuICogICAtIFNwZWNpYWwgdmFsdWVzIGA6ZW50ZXJgIGFuZCBgOmxlYXZlYCBpbml0aWF0ZSBhIHRyYW5zaXRpb24gb24gdGhlIGVudHJ5IGFuZCBleGl0IHN0YXRlcyxcbiAqIGVxdWl2YWxlbnQgdG8gIFwidm9pZCA9PiAqXCIgIGFuZCBcIiogPT4gdm9pZFwiLlxuICogICAtIFNwZWNpYWwgdmFsdWVzIGA6aW5jcmVtZW50YCBhbmQgYDpkZWNyZW1lbnRgIGluaXRpYXRlIGEgdHJhbnNpdGlvbiB3aGVuIGEgbnVtZXJpYyB2YWx1ZSBoYXNcbiAqIGluY3JlYXNlZCBvciBkZWNyZWFzZWQgaW4gdmFsdWUuXG4gKiAtIEEgZnVuY3Rpb24gaXMgZXhlY3V0ZWQgZWFjaCB0aW1lIGEgc3RhdGUgY2hhbmdlIG9jY3VycyBpbiB0aGUgYW5pbWF0aW9uIHRyaWdnZXIgZWxlbWVudC5cbiAqIFRoZSBhbmltYXRpb24gc3RlcHMgcnVuIHdoZW4gdGhlIGZ1bmN0aW9uIHJldHVybnMgdHJ1ZS5cbiAqXG4gKiBAcGFyYW0gc3RlcHMgT25lIG9yIG1vcmUgYW5pbWF0aW9uIG9iamVjdHMsIGFzIHJldHVybmVkIGJ5IHRoZSBgYW5pbWF0ZSgpYCBvclxuICogYHNlcXVlbmNlKClgIGZ1bmN0aW9uLCB0aGF0IGZvcm0gYSB0cmFuc2Zvcm1hdGlvbiBmcm9tIG9uZSBzdGF0ZSB0byBhbm90aGVyLlxuICogQSBzZXF1ZW5jZSBpcyB1c2VkIGJ5IGRlZmF1bHQgd2hlbiB5b3UgcGFzcyBhbiBhcnJheS5cbiAqIEBwYXJhbSBvcHRpb25zIEFuIG9wdGlvbnMgb2JqZWN0IHRoYXQgY2FuIGNvbnRhaW4gYSBkZWxheSB2YWx1ZSBmb3IgdGhlIHN0YXJ0IG9mIHRoZSBhbmltYXRpb24sXG4gKiBhbmQgYWRkaXRpb25hbCBkZXZlbG9wZXItZGVmaW5lZCBwYXJhbWV0ZXJzLiBQcm92aWRlZCB2YWx1ZXMgZm9yIGFkZGl0aW9uYWwgcGFyYW1ldGVycyBhcmUgdXNlZFxuICogYXMgZGVmYXVsdHMsIGFuZCBvdmVycmlkZSB2YWx1ZXMgY2FuIGJlIHBhc3NlZCB0byB0aGUgY2FsbGVyIG9uIGludm9jYXRpb24uXG4gKiBAcmV0dXJucyBBbiBvYmplY3QgdGhhdCBlbmNhcHN1bGF0ZXMgdGhlIHRyYW5zaXRpb24gZGF0YS5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICogVGhlIHRlbXBsYXRlIGFzc29jaWF0ZWQgd2l0aCBhIGNvbXBvbmVudCBiaW5kcyBhbiBhbmltYXRpb24gdHJpZ2dlciB0byBhbiBlbGVtZW50LlxuICpcbiAqIGBgYEhUTUxcbiAqIDwhLS0gc29tZXdoZXJlIGluc2lkZSBvZiBteS1jb21wb25lbnQtdHBsLmh0bWwgLS0+XG4gKiA8ZGl2IFtAbXlBbmltYXRpb25UcmlnZ2VyXT1cIm15U3RhdHVzRXhwXCI+Li4uPC9kaXY+XG4gKiBgYGBcbiAqXG4gKiBBbGwgdHJhbnNpdGlvbnMgYXJlIGRlZmluZWQgd2l0aGluIGFuIGFuaW1hdGlvbiB0cmlnZ2VyLFxuICogYWxvbmcgd2l0aCBuYW1lZCBzdGF0ZXMgdGhhdCB0aGUgdHJhbnNpdGlvbnMgY2hhbmdlIHRvIGFuZCBmcm9tLlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIHRyaWdnZXIoXCJteUFuaW1hdGlvblRyaWdnZXJcIiwgW1xuICogIC8vIGRlZmluZSBzdGF0ZXNcbiAqICBzdGF0ZShcIm9uXCIsIHN0eWxlKHsgYmFja2dyb3VuZDogXCJncmVlblwiIH0pKSxcbiAqICBzdGF0ZShcIm9mZlwiLCBzdHlsZSh7IGJhY2tncm91bmQ6IFwiZ3JleVwiIH0pKSxcbiAqICAuLi5dXG4gKiBgYGBcbiAqXG4gKiBOb3RlIHRoYXQgd2hlbiB5b3UgY2FsbCB0aGUgYHNlcXVlbmNlKClgIGZ1bmN0aW9uIHdpdGhpbiBhIGB7QGxpbmsgYW5pbWF0aW9ucy9ncm91cCBncm91cCgpfWBcbiAqIG9yIGEgYHRyYW5zaXRpb24oKWAgY2FsbCwgZXhlY3V0aW9uIGRvZXMgbm90IGNvbnRpbnVlIHRvIHRoZSBuZXh0IGluc3RydWN0aW9uXG4gKiB1bnRpbCBlYWNoIG9mIHRoZSBpbm5lciBhbmltYXRpb24gc3RlcHMgaGF2ZSBjb21wbGV0ZWQuXG4gKlxuICogIyMjIFN5bnRheCBleGFtcGxlc1xuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZXMgZGVmaW5lIHRyYW5zaXRpb25zIGJldHdlZW4gdGhlIHR3byBkZWZpbmVkIHN0YXRlcyAoYW5kIGRlZmF1bHQgc3RhdGVzKSxcbiAqIHVzaW5nIHZhcmlvdXMgb3B0aW9uczpcbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiAvLyBUcmFuc2l0aW9uIG9jY3VycyB3aGVuIHRoZSBzdGF0ZSB2YWx1ZVxuICogLy8gYm91bmQgdG8gXCJteUFuaW1hdGlvblRyaWdnZXJcIiBjaGFuZ2VzIGZyb20gXCJvblwiIHRvIFwib2ZmXCJcbiAqIHRyYW5zaXRpb24oXCJvbiA9PiBvZmZcIiwgYW5pbWF0ZSg1MDApKVxuICogLy8gUnVuIHRoZSBzYW1lIGFuaW1hdGlvbiBmb3IgYm90aCBkaXJlY3Rpb25zXG4gKiB0cmFuc2l0aW9uKFwib24gPD0+IG9mZlwiLCBhbmltYXRlKDUwMCkpXG4gKiAvLyBEZWZpbmUgbXVsdGlwbGUgc3RhdGUtY2hhbmdlIHBhaXJzIHNlcGFyYXRlZCBieSBjb21tYXNcbiAqIHRyYW5zaXRpb24oXCJvbiA9PiBvZmYsIG9mZiA9PiB2b2lkXCIsIGFuaW1hdGUoNTAwKSlcbiAqIGBgYFxuICpcbiAqICMjIyBTcGVjaWFsIHZhbHVlcyBmb3Igc3RhdGUtY2hhbmdlIGV4cHJlc3Npb25zXG4gKlxuICogLSBDYXRjaC1hbGwgc3RhdGUgY2hhbmdlIGZvciB3aGVuIGFuIGVsZW1lbnQgaXMgaW5zZXJ0ZWQgaW50byB0aGUgcGFnZSBhbmQgdGhlXG4gKiBkZXN0aW5hdGlvbiBzdGF0ZSBpcyB1bmtub3duOlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIHRyYW5zaXRpb24oXCJ2b2lkID0+ICpcIiwgW1xuICogIHN0eWxlKHsgb3BhY2l0eTogMCB9KSxcbiAqICBhbmltYXRlKDUwMClcbiAqICBdKVxuICogYGBgXG4gKlxuICogLSBDYXB0dXJlIGEgc3RhdGUgY2hhbmdlIGJldHdlZW4gYW55IHN0YXRlczpcbiAqXG4gKiAgYHRyYW5zaXRpb24oXCIqID0+ICpcIiwgYW5pbWF0ZShcIjFzIDBzXCIpKWBcbiAqXG4gKiAtIEVudHJ5IGFuZCBleGl0IHRyYW5zaXRpb25zOlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIHRyYW5zaXRpb24oXCI6ZW50ZXJcIiwgW1xuICogICBzdHlsZSh7IG9wYWNpdHk6IDAgfSksXG4gKiAgIGFuaW1hdGUoNTAwLCBzdHlsZSh7IG9wYWNpdHk6IDEgfSkpXG4gKiAgIF0pLFxuICogdHJhbnNpdGlvbihcIjpsZWF2ZVwiLCBbXG4gKiAgIGFuaW1hdGUoNTAwLCBzdHlsZSh7IG9wYWNpdHk6IDAgfSkpXG4gKiAgIF0pXG4gKiBgYGBcbiAqXG4gKiAtIFVzZSBgOmluY3JlbWVudGAgYW5kIGA6ZGVjcmVtZW50YCB0byBpbml0aWF0ZSB0cmFuc2l0aW9uczpcbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiB0cmFuc2l0aW9uKFwiOmluY3JlbWVudFwiLCBncm91cChbXG4gKiAgcXVlcnkoJzplbnRlcicsIFtcbiAqICAgICBzdHlsZSh7IGxlZnQ6ICcxMDAlJyB9KSxcbiAqICAgICBhbmltYXRlKCcwLjVzIGVhc2Utb3V0Jywgc3R5bGUoJyonKSlcbiAqICAgXSksXG4gKiAgcXVlcnkoJzpsZWF2ZScsIFtcbiAqICAgICBhbmltYXRlKCcwLjVzIGVhc2Utb3V0Jywgc3R5bGUoeyBsZWZ0OiAnLTEwMCUnIH0pKVxuICogIF0pXG4gKiBdKSlcbiAqXG4gKiB0cmFuc2l0aW9uKFwiOmRlY3JlbWVudFwiLCBncm91cChbXG4gKiAgcXVlcnkoJzplbnRlcicsIFtcbiAqICAgICBzdHlsZSh7IGxlZnQ6ICcxMDAlJyB9KSxcbiAqICAgICBhbmltYXRlKCcwLjVzIGVhc2Utb3V0Jywgc3R5bGUoJyonKSlcbiAqICAgXSksXG4gKiAgcXVlcnkoJzpsZWF2ZScsIFtcbiAqICAgICBhbmltYXRlKCcwLjVzIGVhc2Utb3V0Jywgc3R5bGUoeyBsZWZ0OiAnLTEwMCUnIH0pKVxuICogIF0pXG4gKiBdKSlcbiAqIGBgYFxuICpcbiAqICMjIyBTdGF0ZS1jaGFuZ2UgZnVuY3Rpb25zXG4gKlxuICogSGVyZSBpcyBhbiBleGFtcGxlIG9mIGEgYGZyb21TdGF0ZWAgc3BlY2lmaWVkIGFzIGEgc3RhdGUtY2hhbmdlIGZ1bmN0aW9uIHRoYXQgaW52b2tlcyBhblxuICogYW5pbWF0aW9uIHdoZW4gdHJ1ZTpcbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiB0cmFuc2l0aW9uKChmcm9tU3RhdGUsIHRvU3RhdGUpID0+XG4gKiAge1xuICogICByZXR1cm4gZnJvbVN0YXRlID09IFwib2ZmXCIgJiYgdG9TdGF0ZSA9PSBcIm9uXCI7XG4gKiAgfSxcbiAqICBhbmltYXRlKFwiMXMgMHNcIikpXG4gKiBgYGBcbiAqXG4gKiAjIyMgQW5pbWF0aW5nIHRvIHRoZSBmaW5hbCBzdGF0ZVxuICpcbiAqIElmIHRoZSBmaW5hbCBzdGVwIGluIGEgdHJhbnNpdGlvbiBpcyBhIGNhbGwgdG8gYGFuaW1hdGUoKWAgdGhhdCB1c2VzIGEgdGltaW5nIHZhbHVlXG4gKiB3aXRoIG5vIHN0eWxlIGRhdGEsIHRoYXQgc3RlcCBpcyBhdXRvbWF0aWNhbGx5IGNvbnNpZGVyZWQgdGhlIGZpbmFsIGFuaW1hdGlvbiBhcmMsXG4gKiBmb3IgdGhlIGVsZW1lbnQgdG8gcmVhY2ggdGhlIGZpbmFsIHN0YXRlLiBBbmd1bGFyIGF1dG9tYXRpY2FsbHkgYWRkcyBvciByZW1vdmVzXG4gKiBDU1Mgc3R5bGVzIHRvIGVuc3VyZSB0aGF0IHRoZSBlbGVtZW50IGlzIGluIHRoZSBjb3JyZWN0IGZpbmFsIHN0YXRlLlxuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBkZWZpbmVzIGEgdHJhbnNpdGlvbiB0aGF0IHN0YXJ0cyBieSBoaWRpbmcgdGhlIGVsZW1lbnQsXG4gKiB0aGVuIG1ha2VzIHN1cmUgdGhhdCBpdCBhbmltYXRlcyBwcm9wZXJseSB0byB3aGF0ZXZlciBzdGF0ZSBpcyBjdXJyZW50bHkgYWN0aXZlIGZvciB0cmlnZ2VyOlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIHRyYW5zaXRpb24oXCJ2b2lkID0+ICpcIiwgW1xuICogICBzdHlsZSh7IG9wYWNpdHk6IDAgfSksXG4gKiAgIGFuaW1hdGUoNTAwKVxuICogIF0pXG4gKiBgYGBcbiAqICMjIyBCb29sZWFuIHZhbHVlIG1hdGNoaW5nXG4gKiBJZiBhIHRyaWdnZXIgYmluZGluZyB2YWx1ZSBpcyBhIEJvb2xlYW4sIGl0IGNhbiBiZSBtYXRjaGVkIHVzaW5nIGEgdHJhbnNpdGlvbiBleHByZXNzaW9uXG4gKiB0aGF0IGNvbXBhcmVzIHRydWUgYW5kIGZhbHNlIG9yIDEgYW5kIDAuIEZvciBleGFtcGxlOlxuICpcbiAqIGBgYFxuICogLy8gaW4gdGhlIHRlbXBsYXRlXG4gKiA8ZGl2IFtAb3BlbkNsb3NlXT1cIm9wZW4gPyB0cnVlIDogZmFsc2VcIj4uLi48L2Rpdj5cbiAqIC8vIGluIHRoZSBjb21wb25lbnQgbWV0YWRhdGFcbiAqIHRyaWdnZXIoJ29wZW5DbG9zZScsIFtcbiAqICAgc3RhdGUoJ3RydWUnLCBzdHlsZSh7IGhlaWdodDogJyonIH0pKSxcbiAqICAgc3RhdGUoJ2ZhbHNlJywgc3R5bGUoeyBoZWlnaHQ6ICcwcHgnIH0pKSxcbiAqICAgdHJhbnNpdGlvbignZmFsc2UgPD0+IHRydWUnLCBhbmltYXRlKDUwMCkpXG4gKiBdKVxuICogYGBgXG4gKlxuICogQHB1YmxpY0FwaVxuICoqL1xuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zaXRpb24oXG4gICAgc3RhdGVDaGFuZ2VFeHByOiBzdHJpbmcgfCAoKGZyb21TdGF0ZTogc3RyaW5nLCB0b1N0YXRlOiBzdHJpbmcsIGVsZW1lbnQ/OiBhbnksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtcz86IHtba2V5OiBzdHJpbmddOiBhbnl9KSA9PiBib29sZWFuKSxcbiAgICBzdGVwczogQW5pbWF0aW9uTWV0YWRhdGEgfCBBbmltYXRpb25NZXRhZGF0YVtdLFxuICAgIG9wdGlvbnM6IEFuaW1hdGlvbk9wdGlvbnMgfCBudWxsID0gbnVsbCk6IEFuaW1hdGlvblRyYW5zaXRpb25NZXRhZGF0YSB7XG4gIHJldHVybiB7dHlwZTogQW5pbWF0aW9uTWV0YWRhdGFUeXBlLlRyYW5zaXRpb24sIGV4cHI6IHN0YXRlQ2hhbmdlRXhwciwgYW5pbWF0aW9uOiBzdGVwcywgb3B0aW9uc307XG59XG5cbi8qKlxuICogUHJvZHVjZXMgYSByZXVzYWJsZSBhbmltYXRpb24gdGhhdCBjYW4gYmUgaW52b2tlZCBpbiBhbm90aGVyIGFuaW1hdGlvbiBvciBzZXF1ZW5jZSxcbiAqIGJ5IGNhbGxpbmcgdGhlIGB1c2VBbmltYXRpb24oKWAgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHN0ZXBzIE9uZSBvciBtb3JlIGFuaW1hdGlvbiBvYmplY3RzLCBhcyByZXR1cm5lZCBieSB0aGUgYGFuaW1hdGUoKWBcbiAqIG9yIGBzZXF1ZW5jZSgpYCBmdW5jdGlvbiwgdGhhdCBmb3JtIGEgdHJhbnNmb3JtYXRpb24gZnJvbSBvbmUgc3RhdGUgdG8gYW5vdGhlci5cbiAqIEEgc2VxdWVuY2UgaXMgdXNlZCBieSBkZWZhdWx0IHdoZW4geW91IHBhc3MgYW4gYXJyYXkuXG4gKiBAcGFyYW0gb3B0aW9ucyBBbiBvcHRpb25zIG9iamVjdCB0aGF0IGNhbiBjb250YWluIGEgZGVsYXkgdmFsdWUgZm9yIHRoZSBzdGFydCBvZiB0aGVcbiAqIGFuaW1hdGlvbiwgYW5kIGFkZGl0aW9uYWwgZGV2ZWxvcGVyLWRlZmluZWQgcGFyYW1ldGVycy5cbiAqIFByb3ZpZGVkIHZhbHVlcyBmb3IgYWRkaXRpb25hbCBwYXJhbWV0ZXJzIGFyZSB1c2VkIGFzIGRlZmF1bHRzLFxuICogYW5kIG92ZXJyaWRlIHZhbHVlcyBjYW4gYmUgcGFzc2VkIHRvIHRoZSBjYWxsZXIgb24gaW52b2NhdGlvbi5cbiAqIEByZXR1cm5zIEFuIG9iamVjdCB0aGF0IGVuY2Fwc3VsYXRlcyB0aGUgYW5pbWF0aW9uIGRhdGEuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBkZWZpbmVzIGEgcmV1c2FibGUgYW5pbWF0aW9uLCBwcm92aWRpbmcgc29tZSBkZWZhdWx0IHBhcmFtZXRlclxuICogdmFsdWVzLlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIHZhciBmYWRlQW5pbWF0aW9uID0gYW5pbWF0aW9uKFtcbiAqICAgc3R5bGUoeyBvcGFjaXR5OiAne3sgc3RhcnQgfX0nIH0pLFxuICogICBhbmltYXRlKCd7eyB0aW1lIH19JyxcbiAqICAgc3R5bGUoeyBvcGFjaXR5OiAne3sgZW5kIH19J30pKVxuICogICBdLFxuICogICB7IHBhcmFtczogeyB0aW1lOiAnMTAwMG1zJywgc3RhcnQ6IDAsIGVuZDogMSB9fSk7XG4gKiBgYGBcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGludm9rZXMgdGhlIGRlZmluZWQgYW5pbWF0aW9uIHdpdGggYSBjYWxsIHRvIGB1c2VBbmltYXRpb24oKWAsXG4gKiBwYXNzaW5nIGluIG92ZXJyaWRlIHBhcmFtZXRlciB2YWx1ZXMuXG4gKlxuICogYGBganNcbiAqIHVzZUFuaW1hdGlvbihmYWRlQW5pbWF0aW9uLCB7XG4gKiAgIHBhcmFtczoge1xuICogICAgIHRpbWU6ICcycycsXG4gKiAgICAgc3RhcnQ6IDEsXG4gKiAgICAgZW5kOiAwXG4gKiAgIH1cbiAqIH0pXG4gKiBgYGBcbiAqXG4gKiBJZiBhbnkgb2YgdGhlIHBhc3NlZC1pbiBwYXJhbWV0ZXIgdmFsdWVzIGFyZSBtaXNzaW5nIGZyb20gdGhpcyBjYWxsLFxuICogdGhlIGRlZmF1bHQgdmFsdWVzIGFyZSB1c2VkLiBJZiBvbmUgb3IgbW9yZSBwYXJhbWV0ZXIgdmFsdWVzIGFyZSBtaXNzaW5nIGJlZm9yZSBhIHN0ZXAgaXNcbiAqIGFuaW1hdGVkLCBgdXNlQW5pbWF0aW9uKClgIHRocm93cyBhbiBlcnJvci5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhbmltYXRpb24oXG4gICAgc3RlcHM6IEFuaW1hdGlvbk1ldGFkYXRhIHwgQW5pbWF0aW9uTWV0YWRhdGFbXSxcbiAgICBvcHRpb25zOiBBbmltYXRpb25PcHRpb25zIHwgbnVsbCA9IG51bGwpOiBBbmltYXRpb25SZWZlcmVuY2VNZXRhZGF0YSB7XG4gIHJldHVybiB7dHlwZTogQW5pbWF0aW9uTWV0YWRhdGFUeXBlLlJlZmVyZW5jZSwgYW5pbWF0aW9uOiBzdGVwcywgb3B0aW9uc307XG59XG5cbi8qKlxuICogRXhlY3V0ZXMgYSBxdWVyaWVkIGlubmVyIGFuaW1hdGlvbiBlbGVtZW50IHdpdGhpbiBhbiBhbmltYXRpb24gc2VxdWVuY2UuXG4gKlxuICogQHBhcmFtIG9wdGlvbnMgQW4gb3B0aW9ucyBvYmplY3QgdGhhdCBjYW4gY29udGFpbiBhIGRlbGF5IHZhbHVlIGZvciB0aGUgc3RhcnQgb2YgdGhlXG4gKiBhbmltYXRpb24sIGFuZCBhZGRpdGlvbmFsIG92ZXJyaWRlIHZhbHVlcyBmb3IgZGV2ZWxvcGVyLWRlZmluZWQgcGFyYW1ldGVycy5cbiAqIEByZXR1cm4gQW4gb2JqZWN0IHRoYXQgZW5jYXBzdWxhdGVzIHRoZSBjaGlsZCBhbmltYXRpb24gZGF0YS5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICogRWFjaCB0aW1lIGFuIGFuaW1hdGlvbiBpcyB0cmlnZ2VyZWQgaW4gQW5ndWxhciwgdGhlIHBhcmVudCBhbmltYXRpb25cbiAqIGhhcyBwcmlvcml0eSBhbmQgYW55IGNoaWxkIGFuaW1hdGlvbnMgYXJlIGJsb2NrZWQuIEluIG9yZGVyXG4gKiBmb3IgYSBjaGlsZCBhbmltYXRpb24gdG8gcnVuLCB0aGUgcGFyZW50IGFuaW1hdGlvbiBtdXN0IHF1ZXJ5IGVhY2ggb2YgdGhlIGVsZW1lbnRzXG4gKiBjb250YWluaW5nIGNoaWxkIGFuaW1hdGlvbnMsIGFuZCBydW4gdGhlbSB1c2luZyB0aGlzIGZ1bmN0aW9uLlxuICpcbiAqIE5vdGUgdGhhdCB0aGlzIGZlYXR1cmUgaXMgZGVzaWduZWQgdG8gYmUgdXNlZCB3aXRoIGBxdWVyeSgpYCBhbmQgaXQgd2lsbCBvbmx5IHdvcmtcbiAqIHdpdGggYW5pbWF0aW9ucyB0aGF0IGFyZSBhc3NpZ25lZCB1c2luZyB0aGUgQW5ndWxhciBhbmltYXRpb24gbGlicmFyeS4gQ1NTIGtleWZyYW1lc1xuICogYW5kIHRyYW5zaXRpb25zIGFyZSBub3QgaGFuZGxlZCBieSB0aGlzIEFQSS5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhbmltYXRlQ2hpbGQob3B0aW9uczogQW5pbWF0ZUNoaWxkT3B0aW9ucyB8IG51bGwgPSBudWxsKTpcbiAgICBBbmltYXRpb25BbmltYXRlQ2hpbGRNZXRhZGF0YSB7XG4gIHJldHVybiB7dHlwZTogQW5pbWF0aW9uTWV0YWRhdGFUeXBlLkFuaW1hdGVDaGlsZCwgb3B0aW9uc307XG59XG5cbi8qKlxuICogU3RhcnRzIGEgcmV1c2FibGUgYW5pbWF0aW9uIHRoYXQgaXMgY3JlYXRlZCB1c2luZyB0aGUgYGFuaW1hdGlvbigpYCBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0gYW5pbWF0aW9uIFRoZSByZXVzYWJsZSBhbmltYXRpb24gdG8gc3RhcnQuXG4gKiBAcGFyYW0gb3B0aW9ucyBBbiBvcHRpb25zIG9iamVjdCB0aGF0IGNhbiBjb250YWluIGEgZGVsYXkgdmFsdWUgZm9yIHRoZSBzdGFydCBvZlxuICogdGhlIGFuaW1hdGlvbiwgYW5kIGFkZGl0aW9uYWwgb3ZlcnJpZGUgdmFsdWVzIGZvciBkZXZlbG9wZXItZGVmaW5lZCBwYXJhbWV0ZXJzLlxuICogQHJldHVybiBBbiBvYmplY3QgdGhhdCBjb250YWlucyB0aGUgYW5pbWF0aW9uIHBhcmFtZXRlcnMuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gdXNlQW5pbWF0aW9uKFxuICAgIGFuaW1hdGlvbjogQW5pbWF0aW9uUmVmZXJlbmNlTWV0YWRhdGEsXG4gICAgb3B0aW9uczogQW5pbWF0aW9uT3B0aW9ucyB8IG51bGwgPSBudWxsKTogQW5pbWF0aW9uQW5pbWF0ZVJlZk1ldGFkYXRhIHtcbiAgcmV0dXJuIHt0eXBlOiBBbmltYXRpb25NZXRhZGF0YVR5cGUuQW5pbWF0ZVJlZiwgYW5pbWF0aW9uLCBvcHRpb25zfTtcbn1cblxuLyoqXG4gKiBGaW5kcyBvbmUgb3IgbW9yZSBpbm5lciBlbGVtZW50cyB3aXRoaW4gdGhlIGN1cnJlbnQgZWxlbWVudCB0aGF0IGlzXG4gKiBiZWluZyBhbmltYXRlZCB3aXRoaW4gYSBzZXF1ZW5jZS4gVXNlIHdpdGggYGFuaW1hdGUoKWAuXG4gKlxuICogQHBhcmFtIHNlbGVjdG9yIFRoZSBlbGVtZW50IHRvIHF1ZXJ5LCBvciBhIHNldCBvZiBlbGVtZW50cyB0aGF0IGNvbnRhaW4gQW5ndWxhci1zcGVjaWZpY1xuICogY2hhcmFjdGVyaXN0aWNzLCBzcGVjaWZpZWQgd2l0aCBvbmUgb3IgbW9yZSBvZiB0aGUgZm9sbG93aW5nIHRva2Vucy5cbiAqICAtIGBxdWVyeShcIjplbnRlclwiKWAgb3IgYHF1ZXJ5KFwiOmxlYXZlXCIpYCA6IFF1ZXJ5IGZvciBuZXdseSBpbnNlcnRlZC9yZW1vdmVkIGVsZW1lbnRzLlxuICogIC0gYHF1ZXJ5KFwiOmFuaW1hdGluZ1wiKWAgOiBRdWVyeSBhbGwgY3VycmVudGx5IGFuaW1hdGluZyBlbGVtZW50cy5cbiAqICAtIGBxdWVyeShcIkB0cmlnZ2VyTmFtZVwiKWAgOiBRdWVyeSBlbGVtZW50cyB0aGF0IGNvbnRhaW4gYW4gYW5pbWF0aW9uIHRyaWdnZXIuXG4gKiAgLSBgcXVlcnkoXCJAKlwiKWAgOiBRdWVyeSBhbGwgZWxlbWVudHMgdGhhdCBjb250YWluIGFuIGFuaW1hdGlvbiB0cmlnZ2Vycy5cbiAqICAtIGBxdWVyeShcIjpzZWxmXCIpYCA6IEluY2x1ZGUgdGhlIGN1cnJlbnQgZWxlbWVudCBpbnRvIHRoZSBhbmltYXRpb24gc2VxdWVuY2UuXG4gKlxuICogQHBhcmFtIGFuaW1hdGlvbiBPbmUgb3IgbW9yZSBhbmltYXRpb24gc3RlcHMgdG8gYXBwbHkgdG8gdGhlIHF1ZXJpZWQgZWxlbWVudCBvciBlbGVtZW50cy5cbiAqIEFuIGFycmF5IGlzIHRyZWF0ZWQgYXMgYW4gYW5pbWF0aW9uIHNlcXVlbmNlLlxuICogQHBhcmFtIG9wdGlvbnMgQW4gb3B0aW9ucyBvYmplY3QuIFVzZSB0aGUgJ2xpbWl0JyBmaWVsZCB0byBsaW1pdCB0aGUgdG90YWwgbnVtYmVyIG9mXG4gKiBpdGVtcyB0byBjb2xsZWN0LlxuICogQHJldHVybiBBbiBvYmplY3QgdGhhdCBlbmNhcHN1bGF0ZXMgdGhlIHF1ZXJ5IGRhdGEuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqIFRva2VucyBjYW4gYmUgbWVyZ2VkIGludG8gYSBjb21iaW5lZCBxdWVyeSBzZWxlY3RvciBzdHJpbmcuIEZvciBleGFtcGxlOlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqICBxdWVyeSgnOnNlbGYsIC5yZWNvcmQ6ZW50ZXIsIC5yZWNvcmQ6bGVhdmUsIEBzdWJUcmlnZ2VyJywgWy4uLl0pXG4gKiBgYGBcbiAqXG4gKiBUaGUgYHF1ZXJ5KClgIGZ1bmN0aW9uIGNvbGxlY3RzIG11bHRpcGxlIGVsZW1lbnRzIGFuZCB3b3JrcyBpbnRlcm5hbGx5IGJ5IHVzaW5nXG4gKiBgZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsYC4gVXNlIHRoZSBgbGltaXRgIGZpZWxkIG9mIGFuIG9wdGlvbnMgb2JqZWN0IHRvIGxpbWl0XG4gKiB0aGUgdG90YWwgbnVtYmVyIG9mIGl0ZW1zIHRvIGJlIGNvbGxlY3RlZC4gRm9yIGV4YW1wbGU6XG4gKlxuICogYGBganNcbiAqIHF1ZXJ5KCdkaXYnLCBbXG4gKiAgIGFuaW1hdGUoLi4uKSxcbiAqICAgYW5pbWF0ZSguLi4pXG4gKiBdLCB7IGxpbWl0OiAxIH0pXG4gKiBgYGBcbiAqXG4gKiBCeSBkZWZhdWx0LCB0aHJvd3MgYW4gZXJyb3Igd2hlbiB6ZXJvIGl0ZW1zIGFyZSBmb3VuZC4gU2V0IHRoZVxuICogYG9wdGlvbmFsYCBmbGFnIHRvIGlnbm9yZSB0aGlzIGVycm9yLiBGb3IgZXhhbXBsZTpcbiAqXG4gKiBgYGBqc1xuICogcXVlcnkoJy5zb21lLWVsZW1lbnQtdGhhdC1tYXktbm90LWJlLXRoZXJlJywgW1xuICogICBhbmltYXRlKC4uLiksXG4gKiAgIGFuaW1hdGUoLi4uKVxuICogXSwgeyBvcHRpb25hbDogdHJ1ZSB9KVxuICogYGBgXG4gKlxuICogIyMjIFVzYWdlIEV4YW1wbGVcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgcXVlcmllcyBmb3IgaW5uZXIgZWxlbWVudHMgYW5kIGFuaW1hdGVzIHRoZW1cbiAqIGluZGl2aWR1YWxseSB1c2luZyBgYW5pbWF0ZSgpYC4gXG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogQENvbXBvbmVudCh7XG4gKiAgIHNlbGVjdG9yOiAnaW5uZXInLFxuICogICB0ZW1wbGF0ZTogYFxuICogICAgIDxkaXYgW0BxdWVyeUFuaW1hdGlvbl09XCJleHBcIj5cbiAqICAgICAgIDxoMT5UaXRsZTwvaDE+XG4gKiAgICAgICA8ZGl2IGNsYXNzPVwiY29udGVudFwiPlxuICogICAgICAgICBCbGFoIGJsYWggYmxhaFxuICogICAgICAgPC9kaXY+XG4gKiAgICAgPC9kaXY+XG4gKiAgIGAsXG4gKiAgIGFuaW1hdGlvbnM6IFtcbiAqICAgIHRyaWdnZXIoJ3F1ZXJ5QW5pbWF0aW9uJywgW1xuICogICAgICB0cmFuc2l0aW9uKCcqID0+IGdvQW5pbWF0ZScsIFtcbiAqICAgICAgICAvLyBoaWRlIHRoZSBpbm5lciBlbGVtZW50c1xuICogICAgICAgIHF1ZXJ5KCdoMScsIHN0eWxlKHsgb3BhY2l0eTogMCB9KSksXG4gKiAgICAgICAgcXVlcnkoJy5jb250ZW50Jywgc3R5bGUoeyBvcGFjaXR5OiAwIH0pKSxcbiAqXG4gKiAgICAgICAgLy8gYW5pbWF0ZSB0aGUgaW5uZXIgZWxlbWVudHMgaW4sIG9uZSBieSBvbmVcbiAqICAgICAgICBxdWVyeSgnaDEnLCBhbmltYXRlKDEwMDAsIHN0eWxlKHsgb3BhY2l0eTogMSB9KSkpLFxuICogICAgICAgIHF1ZXJ5KCcuY29udGVudCcsIGFuaW1hdGUoMTAwMCwgc3R5bGUoeyBvcGFjaXR5OiAxIH0pKSksXG4gKiAgICAgIF0pXG4gKiAgICBdKVxuICogIF1cbiAqIH0pXG4gKiBjbGFzcyBDbXAge1xuICogICBleHAgPSAnJztcbiAqXG4gKiAgIGdvQW5pbWF0ZSgpIHtcbiAqICAgICB0aGlzLmV4cCA9ICdnb0FuaW1hdGUnO1xuICogICB9XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBxdWVyeShcbiAgICBzZWxlY3Rvcjogc3RyaW5nLCBhbmltYXRpb246IEFuaW1hdGlvbk1ldGFkYXRhIHwgQW5pbWF0aW9uTWV0YWRhdGFbXSxcbiAgICBvcHRpb25zOiBBbmltYXRpb25RdWVyeU9wdGlvbnMgfCBudWxsID0gbnVsbCk6IEFuaW1hdGlvblF1ZXJ5TWV0YWRhdGEge1xuICByZXR1cm4ge3R5cGU6IEFuaW1hdGlvbk1ldGFkYXRhVHlwZS5RdWVyeSwgc2VsZWN0b3IsIGFuaW1hdGlvbiwgb3B0aW9uc307XG59XG5cbi8qKlxuICogVXNlIHdpdGhpbiBhbiBhbmltYXRpb24gYHF1ZXJ5KClgIGNhbGwgdG8gaXNzdWUgYSB0aW1pbmcgZ2FwIGFmdGVyXG4gKiBlYWNoIHF1ZXJpZWQgaXRlbSBpcyBhbmltYXRlZC5cbiAqXG4gKiBAcGFyYW0gdGltaW5ncyBBIGRlbGF5IHZhbHVlLlxuICogQHBhcmFtIGFuaW1hdGlvbiBPbmUgb3JlIG1vcmUgYW5pbWF0aW9uIHN0ZXBzLlxuICogQHJldHVybnMgQW4gb2JqZWN0IHRoYXQgZW5jYXBzdWxhdGVzIHRoZSBzdGFnZ2VyIGRhdGEuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqIEluIHRoZSBmb2xsb3dpbmcgZXhhbXBsZSwgYSBjb250YWluZXIgZWxlbWVudCB3cmFwcyBhIGxpc3Qgb2YgaXRlbXMgc3RhbXBlZCBvdXRcbiAqIGJ5IGFuIGBuZ0ZvcmAuIFRoZSBjb250YWluZXIgZWxlbWVudCBjb250YWlucyBhbiBhbmltYXRpb24gdHJpZ2dlciB0aGF0IHdpbGwgbGF0ZXIgYmUgc2V0XG4gKiB0byBxdWVyeSBmb3IgZWFjaCBvZiB0aGUgaW5uZXIgaXRlbXMuXG4gKlxuICogRWFjaCB0aW1lIGl0ZW1zIGFyZSBhZGRlZCwgdGhlIG9wYWNpdHkgZmFkZS1pbiBhbmltYXRpb24gcnVucyxcbiAqIGFuZCBlYWNoIHJlbW92ZWQgaXRlbSBpcyBmYWRlZCBvdXQuXG4gKiBXaGVuIGVpdGhlciBvZiB0aGVzZSBhbmltYXRpb25zIG9jY3VyLCB0aGUgc3RhZ2dlciBlZmZlY3QgaXNcbiAqIGFwcGxpZWQgYWZ0ZXIgZWFjaCBpdGVtJ3MgYW5pbWF0aW9uIGlzIHN0YXJ0ZWQuXG4gKlxuICogYGBgaHRtbFxuICogPCEtLSBsaXN0LmNvbXBvbmVudC5odG1sIC0tPlxuICogPGJ1dHRvbiAoY2xpY2spPVwidG9nZ2xlKClcIj5TaG93IC8gSGlkZSBJdGVtczwvYnV0dG9uPlxuICogPGhyIC8+XG4gKiA8ZGl2IFtAbGlzdEFuaW1hdGlvbl09XCJpdGVtcy5sZW5ndGhcIj5cbiAqICAgPGRpdiAqbmdGb3I9XCJsZXQgaXRlbSBvZiBpdGVtc1wiPlxuICogICAgIHt7IGl0ZW0gfX1cbiAqICAgPC9kaXY+XG4gKiA8L2Rpdj5cbiAqIGBgYFxuICpcbiAqIEhlcmUgaXMgdGhlIGNvbXBvbmVudCBjb2RlOlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGltcG9ydCB7dHJpZ2dlciwgdHJhbnNpdGlvbiwgc3R5bGUsIGFuaW1hdGUsIHF1ZXJ5LCBzdGFnZ2VyfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbiAqIEBDb21wb25lbnQoe1xuICogICB0ZW1wbGF0ZVVybDogJ2xpc3QuY29tcG9uZW50Lmh0bWwnLFxuICogICBhbmltYXRpb25zOiBbXG4gKiAgICAgdHJpZ2dlcignbGlzdEFuaW1hdGlvbicsIFtcbiAqICAgICAuLi5cbiAqICAgICBdKVxuICogICBdXG4gKiB9KVxuICogY2xhc3MgTGlzdENvbXBvbmVudCB7XG4gKiAgIGl0ZW1zID0gW107XG4gKlxuICogICBzaG93SXRlbXMoKSB7XG4gKiAgICAgdGhpcy5pdGVtcyA9IFswLDEsMiwzLDRdO1xuICogICB9XG4gKlxuICogICBoaWRlSXRlbXMoKSB7XG4gKiAgICAgdGhpcy5pdGVtcyA9IFtdO1xuICogICB9XG4gKlxuICogICB0b2dnbGUoKSB7XG4gKiAgICAgdGhpcy5pdGVtcy5sZW5ndGggPyB0aGlzLmhpZGVJdGVtcygpIDogdGhpcy5zaG93SXRlbXMoKTtcbiAqICAgIH1cbiAqICB9XG4gKiBgYGBcbiAqXG4gKiBIZXJlIGlzIHRoZSBhbmltYXRpb24gdHJpZ2dlciBjb2RlOlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIHRyaWdnZXIoJ2xpc3RBbmltYXRpb24nLCBbXG4gKiAgIHRyYW5zaXRpb24oJyogPT4gKicsIFsgLy8gZWFjaCB0aW1lIHRoZSBiaW5kaW5nIHZhbHVlIGNoYW5nZXNcbiAqICAgICBxdWVyeSgnOmxlYXZlJywgW1xuICogICAgICAgc3RhZ2dlcigxMDAsIFtcbiAqICAgICAgICAgYW5pbWF0ZSgnMC41cycsIHN0eWxlKHsgb3BhY2l0eTogMCB9KSlcbiAqICAgICAgIF0pXG4gKiAgICAgXSksXG4gKiAgICAgcXVlcnkoJzplbnRlcicsIFtcbiAqICAgICAgIHN0eWxlKHsgb3BhY2l0eTogMCB9KSxcbiAqICAgICAgIHN0YWdnZXIoMTAwLCBbXG4gKiAgICAgICAgIGFuaW1hdGUoJzAuNXMnLCBzdHlsZSh7IG9wYWNpdHk6IDEgfSkpXG4gKiAgICAgICBdKVxuICogICAgIF0pXG4gKiAgIF0pXG4gKiBdKVxuICogYGBgXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gc3RhZ2dlcihcbiAgICB0aW1pbmdzOiBzdHJpbmcgfCBudW1iZXIsXG4gICAgYW5pbWF0aW9uOiBBbmltYXRpb25NZXRhZGF0YSB8IEFuaW1hdGlvbk1ldGFkYXRhW10pOiBBbmltYXRpb25TdGFnZ2VyTWV0YWRhdGEge1xuICByZXR1cm4ge3R5cGU6IEFuaW1hdGlvbk1ldGFkYXRhVHlwZS5TdGFnZ2VyLCB0aW1pbmdzLCBhbmltYXRpb259O1xufVxuIl19