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
import { AUTO_STYLE, ɵPRE_STYLE as PRE_STYLE } from '@angular/animations';
import { copyObj, copyStyles, interpolateParams, iteratorToArray, resolveTiming, resolveTimingValue, visitDslNode } from '../util';
import { createTimelineInstruction } from './animation_timeline_instruction';
import { ElementInstructionMap } from './element_instruction_map';
/** @type {?} */
const ONE_FRAME_IN_MILLISECONDS = 1;
/** @type {?} */
const ENTER_TOKEN = ':enter';
/** @type {?} */
const ENTER_TOKEN_REGEX = new RegExp(ENTER_TOKEN, 'g');
/** @type {?} */
const LEAVE_TOKEN = ':leave';
/** @type {?} */
const LEAVE_TOKEN_REGEX = new RegExp(LEAVE_TOKEN, 'g');
/*
 * The code within this file aims to generate web-animations-compatible keyframes from Angular's
 * animation DSL code.
 *
 * The code below will be converted from:
 *
 * ```
 * sequence([
 *   style({ opacity: 0 }),
 *   animate(1000, style({ opacity: 0 }))
 * ])
 * ```
 *
 * To:
 * ```
 * keyframes = [{ opacity: 0, offset: 0 }, { opacity: 1, offset: 1 }]
 * duration = 1000
 * delay = 0
 * easing = ''
 * ```
 *
 * For this operation to cover the combination of animation verbs (style, animate, group, etc...) a
 * combination of prototypical inheritance, AST traversal and merge-sort-like algorithms are used.
 *
 * [AST Traversal]
 * Each of the animation verbs, when executed, will return an string-map object representing what
 * type of action it is (style, animate, group, etc...) and the data associated with it. This means
 * that when functional composition mix of these functions is evaluated (like in the example above)
 * then it will end up producing a tree of objects representing the animation itself.
 *
 * When this animation object tree is processed by the visitor code below it will visit each of the
 * verb statements within the visitor. And during each visit it will build the context of the
 * animation keyframes by interacting with the `TimelineBuilder`.
 *
 * [TimelineBuilder]
 * This class is responsible for tracking the styles and building a series of keyframe objects for a
 * timeline between a start and end time. The builder starts off with an initial timeline and each
 * time the AST comes across a `group()`, `keyframes()` or a combination of the two wihtin a
 * `sequence()` then it will generate a sub timeline for each step as well as a new one after
 * they are complete.
 *
 * As the AST is traversed, the timing state on each of the timelines will be incremented. If a sub
 * timeline was created (based on one of the cases above) then the parent timeline will attempt to
 * merge the styles used within the sub timelines into itself (only with group() this will happen).
 * This happens with a merge operation (much like how the merge works in mergesort) and it will only
 * copy the most recently used styles from the sub timelines into the parent timeline. This ensures
 * that if the styles are used later on in another phase of the animation then they will be the most
 * up-to-date values.
 *
 * [How Missing Styles Are Updated]
 * Each timeline has a `backFill` property which is responsible for filling in new styles into
 * already processed keyframes if a new style shows up later within the animation sequence.
 *
 * ```
 * sequence([
 *   style({ width: 0 }),
 *   animate(1000, style({ width: 100 })),
 *   animate(1000, style({ width: 200 })),
 *   animate(1000, style({ width: 300 }))
 *   animate(1000, style({ width: 400, height: 400 })) // notice how `height` doesn't exist anywhere
 * else
 * ])
 * ```
 *
 * What is happening here is that the `height` value is added later in the sequence, but is missing
 * from all previous animation steps. Therefore when a keyframe is created it would also be missing
 * from all previous keyframes up until where it is first used. For the timeline keyframe generation
 * to properly fill in the style it will place the previous value (the value from the parent
 * timeline) or a default value of `*` into the backFill object. Given that each of the keyframe
 * styles are objects that prototypically inhert from the backFill object, this means that if a
 * value is added into the backFill then it will automatically propagate any missing values to all
 * keyframes. Therefore the missing `height` value will be properly filled into the already
 * processed keyframes.
 *
 * When a sub-timeline is created it will have its own backFill property. This is done so that
 * styles present within the sub-timeline do not accidentally seep into the previous/future timeline
 * keyframes
 *
 * (For prototypically-inherited contents to be detected a `for(i in obj)` loop must be used.)
 *
 * [Validation]
 * The code in this file is not responsible for validation. That functionality happens with within
 * the `AnimationValidatorVisitor` code.
 */
/**
 * @param {?} driver
 * @param {?} rootElement
 * @param {?} ast
 * @param {?} enterClassName
 * @param {?} leaveClassName
 * @param {?=} startingStyles
 * @param {?=} finalStyles
 * @param {?=} options
 * @param {?=} subInstructions
 * @param {?=} errors
 * @return {?}
 */
export function buildAnimationTimelines(driver, rootElement, ast, enterClassName, leaveClassName, startingStyles = {}, finalStyles = {}, options, subInstructions, errors = []) {
    return new AnimationTimelineBuilderVisitor().buildKeyframes(driver, rootElement, ast, enterClassName, leaveClassName, startingStyles, finalStyles, options, subInstructions, errors);
}
export class AnimationTimelineBuilderVisitor {
    /**
     * @param {?} driver
     * @param {?} rootElement
     * @param {?} ast
     * @param {?} enterClassName
     * @param {?} leaveClassName
     * @param {?} startingStyles
     * @param {?} finalStyles
     * @param {?} options
     * @param {?=} subInstructions
     * @param {?=} errors
     * @return {?}
     */
    buildKeyframes(driver, rootElement, ast, enterClassName, leaveClassName, startingStyles, finalStyles, options, subInstructions, errors = []) {
        subInstructions = subInstructions || new ElementInstructionMap();
        /** @type {?} */
        const context = new AnimationTimelineContext(driver, rootElement, subInstructions, enterClassName, leaveClassName, errors, []);
        context.options = options;
        context.currentTimeline.setStyles([startingStyles], null, context.errors, options);
        visitDslNode(this, ast, context);
        // this checks to see if an actual animation happened
        /** @type {?} */
        const timelines = context.timelines.filter((/**
         * @param {?} timeline
         * @return {?}
         */
        timeline => timeline.containsAnimation()));
        if (timelines.length && Object.keys(finalStyles).length) {
            /** @type {?} */
            const tl = timelines[timelines.length - 1];
            if (!tl.allowOnlyTimelineStyles()) {
                tl.setStyles([finalStyles], null, context.errors, options);
            }
        }
        return timelines.length ? timelines.map((/**
         * @param {?} timeline
         * @return {?}
         */
        timeline => timeline.buildKeyframes())) :
            [createTimelineInstruction(rootElement, [], [], [], 0, 0, '', false)];
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitTrigger(ast, context) {
        // these values are not visited in this AST
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitState(ast, context) {
        // these values are not visited in this AST
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitTransition(ast, context) {
        // these values are not visited in this AST
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitAnimateChild(ast, context) {
        /** @type {?} */
        const elementInstructions = context.subInstructions.consume(context.element);
        if (elementInstructions) {
            /** @type {?} */
            const innerContext = context.createSubContext(ast.options);
            /** @type {?} */
            const startTime = context.currentTimeline.currentTime;
            /** @type {?} */
            const endTime = this._visitSubInstructions(elementInstructions, innerContext, (/** @type {?} */ (innerContext.options)));
            if (startTime != endTime) {
                // we do this on the upper context because we created a sub context for
                // the sub child animations
                context.transformIntoNewTimeline(endTime);
            }
        }
        context.previousNode = ast;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitAnimateRef(ast, context) {
        /** @type {?} */
        const innerContext = context.createSubContext(ast.options);
        innerContext.transformIntoNewTimeline();
        this.visitReference(ast.animation, innerContext);
        context.transformIntoNewTimeline(innerContext.currentTimeline.currentTime);
        context.previousNode = ast;
    }
    /**
     * @private
     * @param {?} instructions
     * @param {?} context
     * @param {?} options
     * @return {?}
     */
    _visitSubInstructions(instructions, context, options) {
        /** @type {?} */
        const startTime = context.currentTimeline.currentTime;
        /** @type {?} */
        let furthestTime = startTime;
        // this is a special-case for when a user wants to skip a sub
        // animation from being fired entirely.
        /** @type {?} */
        const duration = options.duration != null ? resolveTimingValue(options.duration) : null;
        /** @type {?} */
        const delay = options.delay != null ? resolveTimingValue(options.delay) : null;
        if (duration !== 0) {
            instructions.forEach((/**
             * @param {?} instruction
             * @return {?}
             */
            instruction => {
                /** @type {?} */
                const instructionTimings = context.appendInstructionToTimeline(instruction, duration, delay);
                furthestTime =
                    Math.max(furthestTime, instructionTimings.duration + instructionTimings.delay);
            }));
        }
        return furthestTime;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitReference(ast, context) {
        context.updateOptions(ast.options, true);
        visitDslNode(this, ast.animation, context);
        context.previousNode = ast;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitSequence(ast, context) {
        /** @type {?} */
        const subContextCount = context.subContextCount;
        /** @type {?} */
        let ctx = context;
        /** @type {?} */
        const options = ast.options;
        if (options && (options.params || options.delay)) {
            ctx = context.createSubContext(options);
            ctx.transformIntoNewTimeline();
            if (options.delay != null) {
                if (ctx.previousNode.type == 6 /* Style */) {
                    ctx.currentTimeline.snapshotCurrentStyles();
                    ctx.previousNode = DEFAULT_NOOP_PREVIOUS_NODE;
                }
                /** @type {?} */
                const delay = resolveTimingValue(options.delay);
                ctx.delayNextStep(delay);
            }
        }
        if (ast.steps.length) {
            ast.steps.forEach((/**
             * @param {?} s
             * @return {?}
             */
            s => visitDslNode(this, s, ctx)));
            // this is here just incase the inner steps only contain or end with a style() call
            ctx.currentTimeline.applyStylesToKeyframe();
            // this means that some animation function within the sequence
            // ended up creating a sub timeline (which means the current
            // timeline cannot overlap with the contents of the sequence)
            if (ctx.subContextCount > subContextCount) {
                ctx.transformIntoNewTimeline();
            }
        }
        context.previousNode = ast;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitGroup(ast, context) {
        /** @type {?} */
        const innerTimelines = [];
        /** @type {?} */
        let furthestTime = context.currentTimeline.currentTime;
        /** @type {?} */
        const delay = ast.options && ast.options.delay ? resolveTimingValue(ast.options.delay) : 0;
        ast.steps.forEach((/**
         * @param {?} s
         * @return {?}
         */
        s => {
            /** @type {?} */
            const innerContext = context.createSubContext(ast.options);
            if (delay) {
                innerContext.delayNextStep(delay);
            }
            visitDslNode(this, s, innerContext);
            furthestTime = Math.max(furthestTime, innerContext.currentTimeline.currentTime);
            innerTimelines.push(innerContext.currentTimeline);
        }));
        // this operation is run after the AST loop because otherwise
        // if the parent timeline's collected styles were updated then
        // it would pass in invalid data into the new-to-be forked items
        innerTimelines.forEach((/**
         * @param {?} timeline
         * @return {?}
         */
        timeline => context.currentTimeline.mergeTimelineCollectedStyles(timeline)));
        context.transformIntoNewTimeline(furthestTime);
        context.previousNode = ast;
    }
    /**
     * @private
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    _visitTiming(ast, context) {
        if (((/** @type {?} */ (ast))).dynamic) {
            /** @type {?} */
            const strValue = ((/** @type {?} */ (ast))).strValue;
            /** @type {?} */
            const timingValue = context.params ? interpolateParams(strValue, context.params, context.errors) : strValue;
            return resolveTiming(timingValue, context.errors);
        }
        else {
            return { duration: ast.duration, delay: ast.delay, easing: ast.easing };
        }
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitAnimate(ast, context) {
        /** @type {?} */
        const timings = context.currentAnimateTimings = this._visitTiming(ast.timings, context);
        /** @type {?} */
        const timeline = context.currentTimeline;
        if (timings.delay) {
            context.incrementTime(timings.delay);
            timeline.snapshotCurrentStyles();
        }
        /** @type {?} */
        const style = ast.style;
        if (style.type == 5 /* Keyframes */) {
            this.visitKeyframes(style, context);
        }
        else {
            context.incrementTime(timings.duration);
            this.visitStyle((/** @type {?} */ (style)), context);
            timeline.applyStylesToKeyframe();
        }
        context.currentAnimateTimings = null;
        context.previousNode = ast;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitStyle(ast, context) {
        /** @type {?} */
        const timeline = context.currentTimeline;
        /** @type {?} */
        const timings = (/** @type {?} */ (context.currentAnimateTimings));
        // this is a special case for when a style() call
        // directly follows  an animate() call (but not inside of an animate() call)
        if (!timings && timeline.getCurrentStyleProperties().length) {
            timeline.forwardFrame();
        }
        /** @type {?} */
        const easing = (timings && timings.easing) || ast.easing;
        if (ast.isEmptyStep) {
            timeline.applyEmptyStep(easing);
        }
        else {
            timeline.setStyles(ast.styles, easing, context.errors, context.options);
        }
        context.previousNode = ast;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitKeyframes(ast, context) {
        /** @type {?} */
        const currentAnimateTimings = (/** @type {?} */ (context.currentAnimateTimings));
        /** @type {?} */
        const startTime = ((/** @type {?} */ (context.currentTimeline))).duration;
        /** @type {?} */
        const duration = currentAnimateTimings.duration;
        /** @type {?} */
        const innerContext = context.createSubContext();
        /** @type {?} */
        const innerTimeline = innerContext.currentTimeline;
        innerTimeline.easing = currentAnimateTimings.easing;
        ast.styles.forEach((/**
         * @param {?} step
         * @return {?}
         */
        step => {
            /** @type {?} */
            const offset = step.offset || 0;
            innerTimeline.forwardTime(offset * duration);
            innerTimeline.setStyles(step.styles, step.easing, context.errors, context.options);
            innerTimeline.applyStylesToKeyframe();
        }));
        // this will ensure that the parent timeline gets all the styles from
        // the child even if the new timeline below is not used
        context.currentTimeline.mergeTimelineCollectedStyles(innerTimeline);
        // we do this because the window between this timeline and the sub timeline
        // should ensure that the styles within are exactly the same as they were before
        context.transformIntoNewTimeline(startTime + duration);
        context.previousNode = ast;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitQuery(ast, context) {
        // in the event that the first step before this is a style step we need
        // to ensure the styles are applied before the children are animated
        /** @type {?} */
        const startTime = context.currentTimeline.currentTime;
        /** @type {?} */
        const options = (/** @type {?} */ ((ast.options || {})));
        /** @type {?} */
        const delay = options.delay ? resolveTimingValue(options.delay) : 0;
        if (delay && (context.previousNode.type === 6 /* Style */ ||
            (startTime == 0 && context.currentTimeline.getCurrentStyleProperties().length))) {
            context.currentTimeline.snapshotCurrentStyles();
            context.previousNode = DEFAULT_NOOP_PREVIOUS_NODE;
        }
        /** @type {?} */
        let furthestTime = startTime;
        /** @type {?} */
        const elms = context.invokeQuery(ast.selector, ast.originalSelector, ast.limit, ast.includeSelf, options.optional ? true : false, context.errors);
        context.currentQueryTotal = elms.length;
        /** @type {?} */
        let sameElementTimeline = null;
        elms.forEach((/**
         * @param {?} element
         * @param {?} i
         * @return {?}
         */
        (element, i) => {
            context.currentQueryIndex = i;
            /** @type {?} */
            const innerContext = context.createSubContext(ast.options, element);
            if (delay) {
                innerContext.delayNextStep(delay);
            }
            if (element === context.element) {
                sameElementTimeline = innerContext.currentTimeline;
            }
            visitDslNode(this, ast.animation, innerContext);
            // this is here just incase the inner steps only contain or end
            // with a style() call (which is here to signal that this is a preparatory
            // call to style an element before it is animated again)
            innerContext.currentTimeline.applyStylesToKeyframe();
            /** @type {?} */
            const endTime = innerContext.currentTimeline.currentTime;
            furthestTime = Math.max(furthestTime, endTime);
        }));
        context.currentQueryIndex = 0;
        context.currentQueryTotal = 0;
        context.transformIntoNewTimeline(furthestTime);
        if (sameElementTimeline) {
            context.currentTimeline.mergeTimelineCollectedStyles(sameElementTimeline);
            context.currentTimeline.snapshotCurrentStyles();
        }
        context.previousNode = ast;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitStagger(ast, context) {
        /** @type {?} */
        const parentContext = (/** @type {?} */ (context.parentContext));
        /** @type {?} */
        const tl = context.currentTimeline;
        /** @type {?} */
        const timings = ast.timings;
        /** @type {?} */
        const duration = Math.abs(timings.duration);
        /** @type {?} */
        const maxTime = duration * (context.currentQueryTotal - 1);
        /** @type {?} */
        let delay = duration * context.currentQueryIndex;
        /** @type {?} */
        let staggerTransformer = timings.duration < 0 ? 'reverse' : timings.easing;
        switch (staggerTransformer) {
            case 'reverse':
                delay = maxTime - delay;
                break;
            case 'full':
                delay = parentContext.currentStaggerTime;
                break;
        }
        /** @type {?} */
        const timeline = context.currentTimeline;
        if (delay) {
            timeline.delayNextStep(delay);
        }
        /** @type {?} */
        const startingTime = timeline.currentTime;
        visitDslNode(this, ast.animation, context);
        context.previousNode = ast;
        // time = duration + delay
        // the reason why this computation is so complex is because
        // the inner timeline may either have a delay value or a stretched
        // keyframe depending on if a subtimeline is not used or is used.
        parentContext.currentStaggerTime =
            (tl.currentTime - startingTime) + (tl.startTime - parentContext.currentTimeline.startTime);
    }
}
/** @type {?} */
const DEFAULT_NOOP_PREVIOUS_NODE = (/** @type {?} */ ({}));
export class AnimationTimelineContext {
    /**
     * @param {?} _driver
     * @param {?} element
     * @param {?} subInstructions
     * @param {?} _enterClassName
     * @param {?} _leaveClassName
     * @param {?} errors
     * @param {?} timelines
     * @param {?=} initialTimeline
     */
    constructor(_driver, element, subInstructions, _enterClassName, _leaveClassName, errors, timelines, initialTimeline) {
        this._driver = _driver;
        this.element = element;
        this.subInstructions = subInstructions;
        this._enterClassName = _enterClassName;
        this._leaveClassName = _leaveClassName;
        this.errors = errors;
        this.timelines = timelines;
        this.parentContext = null;
        this.currentAnimateTimings = null;
        this.previousNode = DEFAULT_NOOP_PREVIOUS_NODE;
        this.subContextCount = 0;
        this.options = {};
        this.currentQueryIndex = 0;
        this.currentQueryTotal = 0;
        this.currentStaggerTime = 0;
        this.currentTimeline = initialTimeline || new TimelineBuilder(this._driver, element, 0);
        timelines.push(this.currentTimeline);
    }
    /**
     * @return {?}
     */
    get params() { return this.options.params; }
    /**
     * @param {?} options
     * @param {?=} skipIfExists
     * @return {?}
     */
    updateOptions(options, skipIfExists) {
        if (!options)
            return;
        /** @type {?} */
        const newOptions = (/** @type {?} */ (options));
        /** @type {?} */
        let optionsToUpdate = this.options;
        // NOTE: this will get patched up when other animation methods support duration overrides
        if (newOptions.duration != null) {
            ((/** @type {?} */ (optionsToUpdate))).duration = resolveTimingValue(newOptions.duration);
        }
        if (newOptions.delay != null) {
            optionsToUpdate.delay = resolveTimingValue(newOptions.delay);
        }
        /** @type {?} */
        const newParams = newOptions.params;
        if (newParams) {
            /** @type {?} */
            let paramsToUpdate = (/** @type {?} */ (optionsToUpdate.params));
            if (!paramsToUpdate) {
                paramsToUpdate = this.options.params = {};
            }
            Object.keys(newParams).forEach((/**
             * @param {?} name
             * @return {?}
             */
            name => {
                if (!skipIfExists || !paramsToUpdate.hasOwnProperty(name)) {
                    paramsToUpdate[name] = interpolateParams(newParams[name], paramsToUpdate, this.errors);
                }
            }));
        }
    }
    /**
     * @private
     * @return {?}
     */
    _copyOptions() {
        /** @type {?} */
        const options = {};
        if (this.options) {
            /** @type {?} */
            const oldParams = this.options.params;
            if (oldParams) {
                /** @type {?} */
                const params = options['params'] = {};
                Object.keys(oldParams).forEach((/**
                 * @param {?} name
                 * @return {?}
                 */
                name => { params[name] = oldParams[name]; }));
            }
        }
        return options;
    }
    /**
     * @param {?=} options
     * @param {?=} element
     * @param {?=} newTime
     * @return {?}
     */
    createSubContext(options = null, element, newTime) {
        /** @type {?} */
        const target = element || this.element;
        /** @type {?} */
        const context = new AnimationTimelineContext(this._driver, target, this.subInstructions, this._enterClassName, this._leaveClassName, this.errors, this.timelines, this.currentTimeline.fork(target, newTime || 0));
        context.previousNode = this.previousNode;
        context.currentAnimateTimings = this.currentAnimateTimings;
        context.options = this._copyOptions();
        context.updateOptions(options);
        context.currentQueryIndex = this.currentQueryIndex;
        context.currentQueryTotal = this.currentQueryTotal;
        context.parentContext = this;
        this.subContextCount++;
        return context;
    }
    /**
     * @param {?=} newTime
     * @return {?}
     */
    transformIntoNewTimeline(newTime) {
        this.previousNode = DEFAULT_NOOP_PREVIOUS_NODE;
        this.currentTimeline = this.currentTimeline.fork(this.element, newTime);
        this.timelines.push(this.currentTimeline);
        return this.currentTimeline;
    }
    /**
     * @param {?} instruction
     * @param {?} duration
     * @param {?} delay
     * @return {?}
     */
    appendInstructionToTimeline(instruction, duration, delay) {
        /** @type {?} */
        const updatedTimings = {
            duration: duration != null ? duration : instruction.duration,
            delay: this.currentTimeline.currentTime + (delay != null ? delay : 0) + instruction.delay,
            easing: ''
        };
        /** @type {?} */
        const builder = new SubTimelineBuilder(this._driver, instruction.element, instruction.keyframes, instruction.preStyleProps, instruction.postStyleProps, updatedTimings, instruction.stretchStartingKeyframe);
        this.timelines.push(builder);
        return updatedTimings;
    }
    /**
     * @param {?} time
     * @return {?}
     */
    incrementTime(time) {
        this.currentTimeline.forwardTime(this.currentTimeline.duration + time);
    }
    /**
     * @param {?} delay
     * @return {?}
     */
    delayNextStep(delay) {
        // negative delays are not yet supported
        if (delay > 0) {
            this.currentTimeline.delayNextStep(delay);
        }
    }
    /**
     * @param {?} selector
     * @param {?} originalSelector
     * @param {?} limit
     * @param {?} includeSelf
     * @param {?} optional
     * @param {?} errors
     * @return {?}
     */
    invokeQuery(selector, originalSelector, limit, includeSelf, optional, errors) {
        /** @type {?} */
        let results = [];
        if (includeSelf) {
            results.push(this.element);
        }
        if (selector.length > 0) { // if :self is only used then the selector is empty
            selector = selector.replace(ENTER_TOKEN_REGEX, '.' + this._enterClassName);
            selector = selector.replace(LEAVE_TOKEN_REGEX, '.' + this._leaveClassName);
            /** @type {?} */
            const multi = limit != 1;
            /** @type {?} */
            let elements = this._driver.query(this.element, selector, multi);
            if (limit !== 0) {
                elements = limit < 0 ? elements.slice(elements.length + limit, elements.length) :
                    elements.slice(0, limit);
            }
            results.push(...elements);
        }
        if (!optional && results.length == 0) {
            errors.push(`\`query("${originalSelector}")\` returned zero elements. (Use \`query("${originalSelector}", { optional: true })\` if you wish to allow this.)`);
        }
        return results;
    }
}
if (false) {
    /** @type {?} */
    AnimationTimelineContext.prototype.parentContext;
    /** @type {?} */
    AnimationTimelineContext.prototype.currentTimeline;
    /** @type {?} */
    AnimationTimelineContext.prototype.currentAnimateTimings;
    /** @type {?} */
    AnimationTimelineContext.prototype.previousNode;
    /** @type {?} */
    AnimationTimelineContext.prototype.subContextCount;
    /** @type {?} */
    AnimationTimelineContext.prototype.options;
    /** @type {?} */
    AnimationTimelineContext.prototype.currentQueryIndex;
    /** @type {?} */
    AnimationTimelineContext.prototype.currentQueryTotal;
    /** @type {?} */
    AnimationTimelineContext.prototype.currentStaggerTime;
    /**
     * @type {?}
     * @private
     */
    AnimationTimelineContext.prototype._driver;
    /** @type {?} */
    AnimationTimelineContext.prototype.element;
    /** @type {?} */
    AnimationTimelineContext.prototype.subInstructions;
    /**
     * @type {?}
     * @private
     */
    AnimationTimelineContext.prototype._enterClassName;
    /**
     * @type {?}
     * @private
     */
    AnimationTimelineContext.prototype._leaveClassName;
    /** @type {?} */
    AnimationTimelineContext.prototype.errors;
    /** @type {?} */
    AnimationTimelineContext.prototype.timelines;
}
export class TimelineBuilder {
    /**
     * @param {?} _driver
     * @param {?} element
     * @param {?} startTime
     * @param {?=} _elementTimelineStylesLookup
     */
    constructor(_driver, element, startTime, _elementTimelineStylesLookup) {
        this._driver = _driver;
        this.element = element;
        this.startTime = startTime;
        this._elementTimelineStylesLookup = _elementTimelineStylesLookup;
        this.duration = 0;
        this._previousKeyframe = {};
        this._currentKeyframe = {};
        this._keyframes = new Map();
        this._styleSummary = {};
        this._pendingStyles = {};
        this._backFill = {};
        this._currentEmptyStepKeyframe = null;
        if (!this._elementTimelineStylesLookup) {
            this._elementTimelineStylesLookup = new Map();
        }
        this._localTimelineStyles = Object.create(this._backFill, {});
        this._globalTimelineStyles = (/** @type {?} */ (this._elementTimelineStylesLookup.get(element)));
        if (!this._globalTimelineStyles) {
            this._globalTimelineStyles = this._localTimelineStyles;
            this._elementTimelineStylesLookup.set(element, this._localTimelineStyles);
        }
        this._loadKeyframe();
    }
    /**
     * @return {?}
     */
    containsAnimation() {
        switch (this._keyframes.size) {
            case 0:
                return false;
            case 1:
                return this.getCurrentStyleProperties().length > 0;
            default:
                return true;
        }
    }
    /**
     * @return {?}
     */
    getCurrentStyleProperties() { return Object.keys(this._currentKeyframe); }
    /**
     * @return {?}
     */
    get currentTime() { return this.startTime + this.duration; }
    /**
     * @param {?} delay
     * @return {?}
     */
    delayNextStep(delay) {
        // in the event that a style() step is placed right before a stagger()
        // and that style() step is the very first style() value in the animation
        // then we need to make a copy of the keyframe [0, copy, 1] so that the delay
        // properly applies the style() values to work with the stagger...
        /** @type {?} */
        const hasPreStyleStep = this._keyframes.size == 1 && Object.keys(this._pendingStyles).length;
        if (this.duration || hasPreStyleStep) {
            this.forwardTime(this.currentTime + delay);
            if (hasPreStyleStep) {
                this.snapshotCurrentStyles();
            }
        }
        else {
            this.startTime += delay;
        }
    }
    /**
     * @param {?} element
     * @param {?=} currentTime
     * @return {?}
     */
    fork(element, currentTime) {
        this.applyStylesToKeyframe();
        return new TimelineBuilder(this._driver, element, currentTime || this.currentTime, this._elementTimelineStylesLookup);
    }
    /**
     * @private
     * @return {?}
     */
    _loadKeyframe() {
        if (this._currentKeyframe) {
            this._previousKeyframe = this._currentKeyframe;
        }
        this._currentKeyframe = (/** @type {?} */ (this._keyframes.get(this.duration)));
        if (!this._currentKeyframe) {
            this._currentKeyframe = Object.create(this._backFill, {});
            this._keyframes.set(this.duration, this._currentKeyframe);
        }
    }
    /**
     * @return {?}
     */
    forwardFrame() {
        this.duration += ONE_FRAME_IN_MILLISECONDS;
        this._loadKeyframe();
    }
    /**
     * @param {?} time
     * @return {?}
     */
    forwardTime(time) {
        this.applyStylesToKeyframe();
        this.duration = time;
        this._loadKeyframe();
    }
    /**
     * @private
     * @param {?} prop
     * @param {?} value
     * @return {?}
     */
    _updateStyle(prop, value) {
        this._localTimelineStyles[prop] = value;
        this._globalTimelineStyles[prop] = value;
        this._styleSummary[prop] = { time: this.currentTime, value };
    }
    /**
     * @return {?}
     */
    allowOnlyTimelineStyles() { return this._currentEmptyStepKeyframe !== this._currentKeyframe; }
    /**
     * @param {?} easing
     * @return {?}
     */
    applyEmptyStep(easing) {
        if (easing) {
            this._previousKeyframe['easing'] = easing;
        }
        // special case for animate(duration):
        // all missing styles are filled with a `*` value then
        // if any destination styles are filled in later on the same
        // keyframe then they will override the overridden styles
        // We use `_globalTimelineStyles` here because there may be
        // styles in previous keyframes that are not present in this timeline
        Object.keys(this._globalTimelineStyles).forEach((/**
         * @param {?} prop
         * @return {?}
         */
        prop => {
            this._backFill[prop] = this._globalTimelineStyles[prop] || AUTO_STYLE;
            this._currentKeyframe[prop] = AUTO_STYLE;
        }));
        this._currentEmptyStepKeyframe = this._currentKeyframe;
    }
    /**
     * @param {?} input
     * @param {?} easing
     * @param {?} errors
     * @param {?=} options
     * @return {?}
     */
    setStyles(input, easing, errors, options) {
        if (easing) {
            this._previousKeyframe['easing'] = easing;
        }
        /** @type {?} */
        const params = (options && options.params) || {};
        /** @type {?} */
        const styles = flattenStyles(input, this._globalTimelineStyles);
        Object.keys(styles).forEach((/**
         * @param {?} prop
         * @return {?}
         */
        prop => {
            /** @type {?} */
            const val = interpolateParams(styles[prop], params, errors);
            this._pendingStyles[prop] = val;
            if (!this._localTimelineStyles.hasOwnProperty(prop)) {
                this._backFill[prop] = this._globalTimelineStyles.hasOwnProperty(prop) ?
                    this._globalTimelineStyles[prop] :
                    AUTO_STYLE;
            }
            this._updateStyle(prop, val);
        }));
    }
    /**
     * @return {?}
     */
    applyStylesToKeyframe() {
        /** @type {?} */
        const styles = this._pendingStyles;
        /** @type {?} */
        const props = Object.keys(styles);
        if (props.length == 0)
            return;
        this._pendingStyles = {};
        props.forEach((/**
         * @param {?} prop
         * @return {?}
         */
        prop => {
            /** @type {?} */
            const val = styles[prop];
            this._currentKeyframe[prop] = val;
        }));
        Object.keys(this._localTimelineStyles).forEach((/**
         * @param {?} prop
         * @return {?}
         */
        prop => {
            if (!this._currentKeyframe.hasOwnProperty(prop)) {
                this._currentKeyframe[prop] = this._localTimelineStyles[prop];
            }
        }));
    }
    /**
     * @return {?}
     */
    snapshotCurrentStyles() {
        Object.keys(this._localTimelineStyles).forEach((/**
         * @param {?} prop
         * @return {?}
         */
        prop => {
            /** @type {?} */
            const val = this._localTimelineStyles[prop];
            this._pendingStyles[prop] = val;
            this._updateStyle(prop, val);
        }));
    }
    /**
     * @return {?}
     */
    getFinalKeyframe() { return this._keyframes.get(this.duration); }
    /**
     * @return {?}
     */
    get properties() {
        /** @type {?} */
        const properties = [];
        for (let prop in this._currentKeyframe) {
            properties.push(prop);
        }
        return properties;
    }
    /**
     * @param {?} timeline
     * @return {?}
     */
    mergeTimelineCollectedStyles(timeline) {
        Object.keys(timeline._styleSummary).forEach((/**
         * @param {?} prop
         * @return {?}
         */
        prop => {
            /** @type {?} */
            const details0 = this._styleSummary[prop];
            /** @type {?} */
            const details1 = timeline._styleSummary[prop];
            if (!details0 || details1.time > details0.time) {
                this._updateStyle(prop, details1.value);
            }
        }));
    }
    /**
     * @return {?}
     */
    buildKeyframes() {
        this.applyStylesToKeyframe();
        /** @type {?} */
        const preStyleProps = new Set();
        /** @type {?} */
        const postStyleProps = new Set();
        /** @type {?} */
        const isEmpty = this._keyframes.size === 1 && this.duration === 0;
        /** @type {?} */
        let finalKeyframes = [];
        this._keyframes.forEach((/**
         * @param {?} keyframe
         * @param {?} time
         * @return {?}
         */
        (keyframe, time) => {
            /** @type {?} */
            const finalKeyframe = copyStyles(keyframe, true);
            Object.keys(finalKeyframe).forEach((/**
             * @param {?} prop
             * @return {?}
             */
            prop => {
                /** @type {?} */
                const value = finalKeyframe[prop];
                if (value == PRE_STYLE) {
                    preStyleProps.add(prop);
                }
                else if (value == AUTO_STYLE) {
                    postStyleProps.add(prop);
                }
            }));
            if (!isEmpty) {
                finalKeyframe['offset'] = time / this.duration;
            }
            finalKeyframes.push(finalKeyframe);
        }));
        /** @type {?} */
        const preProps = preStyleProps.size ? iteratorToArray(preStyleProps.values()) : [];
        /** @type {?} */
        const postProps = postStyleProps.size ? iteratorToArray(postStyleProps.values()) : [];
        // special case for a 0-second animation (which is designed just to place styles onscreen)
        if (isEmpty) {
            /** @type {?} */
            const kf0 = finalKeyframes[0];
            /** @type {?} */
            const kf1 = copyObj(kf0);
            kf0['offset'] = 0;
            kf1['offset'] = 1;
            finalKeyframes = [kf0, kf1];
        }
        return createTimelineInstruction(this.element, finalKeyframes, preProps, postProps, this.duration, this.startTime, this.easing, false);
    }
}
if (false) {
    /** @type {?} */
    TimelineBuilder.prototype.duration;
    /** @type {?} */
    TimelineBuilder.prototype.easing;
    /**
     * @type {?}
     * @private
     */
    TimelineBuilder.prototype._previousKeyframe;
    /**
     * @type {?}
     * @private
     */
    TimelineBuilder.prototype._currentKeyframe;
    /**
     * @type {?}
     * @private
     */
    TimelineBuilder.prototype._keyframes;
    /**
     * @type {?}
     * @private
     */
    TimelineBuilder.prototype._styleSummary;
    /**
     * @type {?}
     * @private
     */
    TimelineBuilder.prototype._localTimelineStyles;
    /**
     * @type {?}
     * @private
     */
    TimelineBuilder.prototype._globalTimelineStyles;
    /**
     * @type {?}
     * @private
     */
    TimelineBuilder.prototype._pendingStyles;
    /**
     * @type {?}
     * @private
     */
    TimelineBuilder.prototype._backFill;
    /**
     * @type {?}
     * @private
     */
    TimelineBuilder.prototype._currentEmptyStepKeyframe;
    /**
     * @type {?}
     * @private
     */
    TimelineBuilder.prototype._driver;
    /** @type {?} */
    TimelineBuilder.prototype.element;
    /** @type {?} */
    TimelineBuilder.prototype.startTime;
    /**
     * @type {?}
     * @private
     */
    TimelineBuilder.prototype._elementTimelineStylesLookup;
}
class SubTimelineBuilder extends TimelineBuilder {
    /**
     * @param {?} driver
     * @param {?} element
     * @param {?} keyframes
     * @param {?} preStyleProps
     * @param {?} postStyleProps
     * @param {?} timings
     * @param {?=} _stretchStartingKeyframe
     */
    constructor(driver, element, keyframes, preStyleProps, postStyleProps, timings, _stretchStartingKeyframe = false) {
        super(driver, element, timings.delay);
        this.element = element;
        this.keyframes = keyframes;
        this.preStyleProps = preStyleProps;
        this.postStyleProps = postStyleProps;
        this._stretchStartingKeyframe = _stretchStartingKeyframe;
        this.timings = { duration: timings.duration, delay: timings.delay, easing: timings.easing };
    }
    /**
     * @return {?}
     */
    containsAnimation() { return this.keyframes.length > 1; }
    /**
     * @return {?}
     */
    buildKeyframes() {
        /** @type {?} */
        let keyframes = this.keyframes;
        let { delay, duration, easing } = this.timings;
        if (this._stretchStartingKeyframe && delay) {
            /** @type {?} */
            const newKeyframes = [];
            /** @type {?} */
            const totalTime = duration + delay;
            /** @type {?} */
            const startingGap = delay / totalTime;
            // the original starting keyframe now starts once the delay is done
            /** @type {?} */
            const newFirstKeyframe = copyStyles(keyframes[0], false);
            newFirstKeyframe['offset'] = 0;
            newKeyframes.push(newFirstKeyframe);
            /** @type {?} */
            const oldFirstKeyframe = copyStyles(keyframes[0], false);
            oldFirstKeyframe['offset'] = roundOffset(startingGap);
            newKeyframes.push(oldFirstKeyframe);
            /*
                    When the keyframe is stretched then it means that the delay before the animation
                    starts is gone. Instead the first keyframe is placed at the start of the animation
                    and it is then copied to where it starts when the original delay is over. This basically
                    means nothing animates during that delay, but the styles are still renderered. For this
                    to work the original offset values that exist in the original keyframes must be "warped"
                    so that they can take the new keyframe + delay into account.
            
                    delay=1000, duration=1000, keyframes = 0 .5 1
            
                    turns into
            
                    delay=0, duration=2000, keyframes = 0 .33 .66 1
                   */
            // offsets between 1 ... n -1 are all warped by the keyframe stretch
            /** @type {?} */
            const limit = keyframes.length - 1;
            for (let i = 1; i <= limit; i++) {
                /** @type {?} */
                let kf = copyStyles(keyframes[i], false);
                /** @type {?} */
                const oldOffset = (/** @type {?} */ (kf['offset']));
                /** @type {?} */
                const timeAtKeyframe = delay + oldOffset * duration;
                kf['offset'] = roundOffset(timeAtKeyframe / totalTime);
                newKeyframes.push(kf);
            }
            // the new starting keyframe should be added at the start
            duration = totalTime;
            delay = 0;
            easing = '';
            keyframes = newKeyframes;
        }
        return createTimelineInstruction(this.element, keyframes, this.preStyleProps, this.postStyleProps, duration, delay, easing, true);
    }
}
if (false) {
    /** @type {?} */
    SubTimelineBuilder.prototype.timings;
    /** @type {?} */
    SubTimelineBuilder.prototype.element;
    /** @type {?} */
    SubTimelineBuilder.prototype.keyframes;
    /** @type {?} */
    SubTimelineBuilder.prototype.preStyleProps;
    /** @type {?} */
    SubTimelineBuilder.prototype.postStyleProps;
    /**
     * @type {?}
     * @private
     */
    SubTimelineBuilder.prototype._stretchStartingKeyframe;
}
/**
 * @param {?} offset
 * @param {?=} decimalPoints
 * @return {?}
 */
function roundOffset(offset, decimalPoints = 3) {
    /** @type {?} */
    const mult = Math.pow(10, decimalPoints - 1);
    return Math.round(offset * mult) / mult;
}
/**
 * @param {?} input
 * @param {?} allStyles
 * @return {?}
 */
function flattenStyles(input, allStyles) {
    /** @type {?} */
    const styles = {};
    /** @type {?} */
    let allProperties;
    input.forEach((/**
     * @param {?} token
     * @return {?}
     */
    token => {
        if (token === '*') {
            allProperties = allProperties || Object.keys(allStyles);
            allProperties.forEach((/**
             * @param {?} prop
             * @return {?}
             */
            prop => { styles[prop] = AUTO_STYLE; }));
        }
        else {
            copyStyles((/** @type {?} */ (token)), false, styles);
        }
    }));
    return styles;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX3RpbWVsaW5lX2J1aWxkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9hbmltYXRpb25zL2Jyb3dzZXIvc3JjL2RzbC9hbmltYXRpb25fdGltZWxpbmVfYnVpbGRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQU9BLE9BQU8sRUFBQyxVQUFVLEVBQXVHLFVBQVUsSUFBSSxTQUFTLEVBQWEsTUFBTSxxQkFBcUIsQ0FBQztBQUd6TCxPQUFPLEVBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxlQUFlLEVBQUUsYUFBYSxFQUFFLGtCQUFrQixFQUFFLFlBQVksRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUdqSSxPQUFPLEVBQStCLHlCQUF5QixFQUFDLE1BQU0sa0NBQWtDLENBQUM7QUFDekcsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sMkJBQTJCLENBQUM7O01BRTFELHlCQUF5QixHQUFHLENBQUM7O01BQzdCLFdBQVcsR0FBRyxRQUFROztNQUN0QixpQkFBaUIsR0FBRyxJQUFJLE1BQU0sQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDOztNQUNoRCxXQUFXLEdBQUcsUUFBUTs7TUFDdEIsaUJBQWlCLEdBQUcsSUFBSSxNQUFNLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFzRnRELE1BQU0sVUFBVSx1QkFBdUIsQ0FDbkMsTUFBdUIsRUFBRSxXQUFnQixFQUFFLEdBQStCLEVBQzFFLGNBQXNCLEVBQUUsY0FBc0IsRUFBRSxpQkFBNkIsRUFBRSxFQUMvRSxjQUEwQixFQUFFLEVBQUUsT0FBeUIsRUFDdkQsZUFBdUMsRUFBRSxTQUFnQixFQUFFO0lBQzdELE9BQU8sSUFBSSwrQkFBK0IsRUFBRSxDQUFDLGNBQWMsQ0FDdkQsTUFBTSxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsV0FBVyxFQUNyRixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3hDLENBQUM7QUFFRCxNQUFNLE9BQU8sK0JBQStCOzs7Ozs7Ozs7Ozs7OztJQUMxQyxjQUFjLENBQ1YsTUFBdUIsRUFBRSxXQUFnQixFQUFFLEdBQStCLEVBQzFFLGNBQXNCLEVBQUUsY0FBc0IsRUFBRSxjQUEwQixFQUMxRSxXQUF1QixFQUFFLE9BQXlCLEVBQUUsZUFBdUMsRUFDM0YsU0FBZ0IsRUFBRTtRQUNwQixlQUFlLEdBQUcsZUFBZSxJQUFJLElBQUkscUJBQXFCLEVBQUUsQ0FBQzs7Y0FDM0QsT0FBTyxHQUFHLElBQUksd0JBQXdCLENBQ3hDLE1BQU0sRUFBRSxXQUFXLEVBQUUsZUFBZSxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQztRQUNyRixPQUFPLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUMxQixPQUFPLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRW5GLFlBQVksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDOzs7Y0FHM0IsU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTTs7OztRQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLGlCQUFpQixFQUFFLEVBQUM7UUFDcEYsSUFBSSxTQUFTLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxFQUFFOztrQkFDakQsRUFBRSxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUMxQyxJQUFJLENBQUMsRUFBRSxDQUFDLHVCQUF1QixFQUFFLEVBQUU7Z0JBQ2pDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQzthQUM1RDtTQUNGO1FBRUQsT0FBTyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRzs7OztRQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxFQUFDLENBQUMsQ0FBQztZQUN0RCxDQUFDLHlCQUF5QixDQUFDLFdBQVcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ2xHLENBQUM7Ozs7OztJQUVELFlBQVksQ0FBQyxHQUFlLEVBQUUsT0FBaUM7UUFDN0QsMkNBQTJDO0lBQzdDLENBQUM7Ozs7OztJQUVELFVBQVUsQ0FBQyxHQUFhLEVBQUUsT0FBaUM7UUFDekQsMkNBQTJDO0lBQzdDLENBQUM7Ozs7OztJQUVELGVBQWUsQ0FBQyxHQUFrQixFQUFFLE9BQWlDO1FBQ25FLDJDQUEyQztJQUM3QyxDQUFDOzs7Ozs7SUFFRCxpQkFBaUIsQ0FBQyxHQUFvQixFQUFFLE9BQWlDOztjQUNqRSxtQkFBbUIsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO1FBQzVFLElBQUksbUJBQW1CLEVBQUU7O2tCQUNqQixZQUFZLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7O2tCQUNwRCxTQUFTLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxXQUFXOztrQkFDL0MsT0FBTyxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FDdEMsbUJBQW1CLEVBQUUsWUFBWSxFQUFFLG1CQUFBLFlBQVksQ0FBQyxPQUFPLEVBQXVCLENBQUM7WUFDbkYsSUFBSSxTQUFTLElBQUksT0FBTyxFQUFFO2dCQUN4Qix1RUFBdUU7Z0JBQ3ZFLDJCQUEyQjtnQkFDM0IsT0FBTyxDQUFDLHdCQUF3QixDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQzNDO1NBQ0Y7UUFDRCxPQUFPLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQztJQUM3QixDQUFDOzs7Ozs7SUFFRCxlQUFlLENBQUMsR0FBa0IsRUFBRSxPQUFpQzs7Y0FDN0QsWUFBWSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDO1FBQzFELFlBQVksQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUNqRCxPQUFPLENBQUMsd0JBQXdCLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUMzRSxPQUFPLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQztJQUM3QixDQUFDOzs7Ozs7OztJQUVPLHFCQUFxQixDQUN6QixZQUE0QyxFQUFFLE9BQWlDLEVBQy9FLE9BQTRCOztjQUN4QixTQUFTLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxXQUFXOztZQUNqRCxZQUFZLEdBQUcsU0FBUzs7OztjQUl0QixRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSTs7Y0FDakYsS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7UUFDOUUsSUFBSSxRQUFRLEtBQUssQ0FBQyxFQUFFO1lBQ2xCLFlBQVksQ0FBQyxPQUFPOzs7O1lBQUMsV0FBVyxDQUFDLEVBQUU7O3NCQUMzQixrQkFBa0IsR0FDcEIsT0FBTyxDQUFDLDJCQUEyQixDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDO2dCQUNyRSxZQUFZO29CQUNSLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLGtCQUFrQixDQUFDLFFBQVEsR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNyRixDQUFDLEVBQUMsQ0FBQztTQUNKO1FBRUQsT0FBTyxZQUFZLENBQUM7SUFDdEIsQ0FBQzs7Ozs7O0lBRUQsY0FBYyxDQUFDLEdBQWlCLEVBQUUsT0FBaUM7UUFDakUsT0FBTyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3pDLFlBQVksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMzQyxPQUFPLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQztJQUM3QixDQUFDOzs7Ozs7SUFFRCxhQUFhLENBQUMsR0FBZ0IsRUFBRSxPQUFpQzs7Y0FDekQsZUFBZSxHQUFHLE9BQU8sQ0FBQyxlQUFlOztZQUMzQyxHQUFHLEdBQUcsT0FBTzs7Y0FDWCxPQUFPLEdBQUcsR0FBRyxDQUFDLE9BQU87UUFFM0IsSUFBSSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNoRCxHQUFHLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3hDLEdBQUcsQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO1lBRS9CLElBQUksT0FBTyxDQUFDLEtBQUssSUFBSSxJQUFJLEVBQUU7Z0JBQ3pCLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLGlCQUErQixFQUFFO29CQUN4RCxHQUFHLENBQUMsZUFBZSxDQUFDLHFCQUFxQixFQUFFLENBQUM7b0JBQzVDLEdBQUcsQ0FBQyxZQUFZLEdBQUcsMEJBQTBCLENBQUM7aUJBQy9DOztzQkFFSyxLQUFLLEdBQUcsa0JBQWtCLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztnQkFDL0MsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUMxQjtTQUNGO1FBRUQsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUNwQixHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU87Ozs7WUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDLENBQUM7WUFFbkQsbUZBQW1GO1lBQ25GLEdBQUcsQ0FBQyxlQUFlLENBQUMscUJBQXFCLEVBQUUsQ0FBQztZQUU1Qyw4REFBOEQ7WUFDOUQsNERBQTREO1lBQzVELDZEQUE2RDtZQUM3RCxJQUFJLEdBQUcsQ0FBQyxlQUFlLEdBQUcsZUFBZSxFQUFFO2dCQUN6QyxHQUFHLENBQUMsd0JBQXdCLEVBQUUsQ0FBQzthQUNoQztTQUNGO1FBRUQsT0FBTyxDQUFDLFlBQVksR0FBRyxHQUFHLENBQUM7SUFDN0IsQ0FBQzs7Ozs7O0lBRUQsVUFBVSxDQUFDLEdBQWEsRUFBRSxPQUFpQzs7Y0FDbkQsY0FBYyxHQUFzQixFQUFFOztZQUN4QyxZQUFZLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxXQUFXOztjQUNoRCxLQUFLLEdBQUcsR0FBRyxDQUFDLE9BQU8sSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUxRixHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU87Ozs7UUFBQyxDQUFDLENBQUMsRUFBRTs7a0JBQ2QsWUFBWSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDO1lBQzFELElBQUksS0FBSyxFQUFFO2dCQUNULFlBQVksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDbkM7WUFFRCxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQztZQUNwQyxZQUFZLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNoRixjQUFjLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUNwRCxDQUFDLEVBQUMsQ0FBQztRQUVILDZEQUE2RDtRQUM3RCw4REFBOEQ7UUFDOUQsZ0VBQWdFO1FBQ2hFLGNBQWMsQ0FBQyxPQUFPOzs7O1FBQ2xCLFFBQVEsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyw0QkFBNEIsQ0FBQyxRQUFRLENBQUMsRUFBQyxDQUFDO1FBQ2hGLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUMvQyxPQUFPLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQztJQUM3QixDQUFDOzs7Ozs7O0lBRU8sWUFBWSxDQUFDLEdBQWMsRUFBRSxPQUFpQztRQUNwRSxJQUFJLENBQUMsbUJBQUEsR0FBRyxFQUFvQixDQUFDLENBQUMsT0FBTyxFQUFFOztrQkFDL0IsUUFBUSxHQUFHLENBQUMsbUJBQUEsR0FBRyxFQUFvQixDQUFDLENBQUMsUUFBUTs7a0JBQzdDLFdBQVcsR0FDYixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVE7WUFDM0YsT0FBTyxhQUFhLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNuRDthQUFNO1lBQ0wsT0FBTyxFQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxFQUFDLENBQUM7U0FDdkU7SUFDSCxDQUFDOzs7Ozs7SUFFRCxZQUFZLENBQUMsR0FBZSxFQUFFLE9BQWlDOztjQUN2RCxPQUFPLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUM7O2NBQ2pGLFFBQVEsR0FBRyxPQUFPLENBQUMsZUFBZTtRQUN4QyxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUU7WUFDakIsT0FBTyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDckMsUUFBUSxDQUFDLHFCQUFxQixFQUFFLENBQUM7U0FDbEM7O2NBRUssS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLO1FBQ3ZCLElBQUksS0FBSyxDQUFDLElBQUkscUJBQW1DLEVBQUU7WUFDakQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDckM7YUFBTTtZQUNMLE9BQU8sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3hDLElBQUksQ0FBQyxVQUFVLENBQUMsbUJBQUEsS0FBSyxFQUFZLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDNUMsUUFBUSxDQUFDLHFCQUFxQixFQUFFLENBQUM7U0FDbEM7UUFFRCxPQUFPLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDO1FBQ3JDLE9BQU8sQ0FBQyxZQUFZLEdBQUcsR0FBRyxDQUFDO0lBQzdCLENBQUM7Ozs7OztJQUVELFVBQVUsQ0FBQyxHQUFhLEVBQUUsT0FBaUM7O2NBQ25ELFFBQVEsR0FBRyxPQUFPLENBQUMsZUFBZTs7Y0FDbEMsT0FBTyxHQUFHLG1CQUFBLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRTtRQUUvQyxpREFBaUQ7UUFDakQsNEVBQTRFO1FBQzVFLElBQUksQ0FBQyxPQUFPLElBQUksUUFBUSxDQUFDLHlCQUF5QixFQUFFLENBQUMsTUFBTSxFQUFFO1lBQzNELFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztTQUN6Qjs7Y0FFSyxNQUFNLEdBQUcsQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxNQUFNO1FBQ3hELElBQUksR0FBRyxDQUFDLFdBQVcsRUFBRTtZQUNuQixRQUFRLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ2pDO2FBQU07WUFDTCxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3pFO1FBRUQsT0FBTyxDQUFDLFlBQVksR0FBRyxHQUFHLENBQUM7SUFDN0IsQ0FBQzs7Ozs7O0lBRUQsY0FBYyxDQUFDLEdBQWlCLEVBQUUsT0FBaUM7O2NBQzNELHFCQUFxQixHQUFHLG1CQUFBLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRTs7Y0FDdkQsU0FBUyxHQUFHLENBQUMsbUJBQUEsT0FBTyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsUUFBUTs7Y0FDaEQsUUFBUSxHQUFHLHFCQUFxQixDQUFDLFFBQVE7O2NBQ3pDLFlBQVksR0FBRyxPQUFPLENBQUMsZ0JBQWdCLEVBQUU7O2NBQ3pDLGFBQWEsR0FBRyxZQUFZLENBQUMsZUFBZTtRQUNsRCxhQUFhLENBQUMsTUFBTSxHQUFHLHFCQUFxQixDQUFDLE1BQU0sQ0FBQztRQUVwRCxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU87Ozs7UUFBQyxJQUFJLENBQUMsRUFBRTs7a0JBQ2xCLE1BQU0sR0FBVyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUM7WUFDdkMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLENBQUM7WUFDN0MsYUFBYSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDbkYsYUFBYSxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFDeEMsQ0FBQyxFQUFDLENBQUM7UUFFSCxxRUFBcUU7UUFDckUsdURBQXVEO1FBQ3ZELE9BQU8sQ0FBQyxlQUFlLENBQUMsNEJBQTRCLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFcEUsMkVBQTJFO1FBQzNFLGdGQUFnRjtRQUNoRixPQUFPLENBQUMsd0JBQXdCLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZELE9BQU8sQ0FBQyxZQUFZLEdBQUcsR0FBRyxDQUFDO0lBQzdCLENBQUM7Ozs7OztJQUVELFVBQVUsQ0FBQyxHQUFhLEVBQUUsT0FBaUM7Ozs7Y0FHbkQsU0FBUyxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsV0FBVzs7Y0FDL0MsT0FBTyxHQUFHLG1CQUFBLENBQUMsR0FBRyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsRUFBeUI7O2NBQ3RELEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFbkUsSUFBSSxLQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksa0JBQWdDO1lBQ3pELENBQUMsU0FBUyxJQUFJLENBQUMsSUFBSSxPQUFPLENBQUMsZUFBZSxDQUFDLHlCQUF5QixFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRTtZQUM3RixPQUFPLENBQUMsZUFBZSxDQUFDLHFCQUFxQixFQUFFLENBQUM7WUFDaEQsT0FBTyxDQUFDLFlBQVksR0FBRywwQkFBMEIsQ0FBQztTQUNuRDs7WUFFRyxZQUFZLEdBQUcsU0FBUzs7Y0FDdEIsSUFBSSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQzVCLEdBQUcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLGdCQUFnQixFQUFFLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLFdBQVcsRUFDOUQsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUVwRCxPQUFPLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7WUFDcEMsbUJBQW1CLEdBQXlCLElBQUk7UUFDcEQsSUFBSSxDQUFDLE9BQU87Ozs7O1FBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFFMUIsT0FBTyxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQzs7a0JBQ3hCLFlBQVksR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUM7WUFDbkUsSUFBSSxLQUFLLEVBQUU7Z0JBQ1QsWUFBWSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNuQztZQUVELElBQUksT0FBTyxLQUFLLE9BQU8sQ0FBQyxPQUFPLEVBQUU7Z0JBQy9CLG1CQUFtQixHQUFHLFlBQVksQ0FBQyxlQUFlLENBQUM7YUFDcEQ7WUFFRCxZQUFZLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFFaEQsK0RBQStEO1lBQy9ELDBFQUEwRTtZQUMxRSx3REFBd0Q7WUFDeEQsWUFBWSxDQUFDLGVBQWUsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDOztrQkFFL0MsT0FBTyxHQUFHLFlBQVksQ0FBQyxlQUFlLENBQUMsV0FBVztZQUN4RCxZQUFZLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDakQsQ0FBQyxFQUFDLENBQUM7UUFFSCxPQUFPLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDO1FBQzlCLE9BQU8sQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUM7UUFDOUIsT0FBTyxDQUFDLHdCQUF3QixDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRS9DLElBQUksbUJBQW1CLEVBQUU7WUFDdkIsT0FBTyxDQUFDLGVBQWUsQ0FBQyw0QkFBNEIsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1lBQzFFLE9BQU8sQ0FBQyxlQUFlLENBQUMscUJBQXFCLEVBQUUsQ0FBQztTQUNqRDtRQUVELE9BQU8sQ0FBQyxZQUFZLEdBQUcsR0FBRyxDQUFDO0lBQzdCLENBQUM7Ozs7OztJQUVELFlBQVksQ0FBQyxHQUFlLEVBQUUsT0FBaUM7O2NBQ3ZELGFBQWEsR0FBRyxtQkFBQSxPQUFPLENBQUMsYUFBYSxFQUFFOztjQUN2QyxFQUFFLEdBQUcsT0FBTyxDQUFDLGVBQWU7O2NBQzVCLE9BQU8sR0FBRyxHQUFHLENBQUMsT0FBTzs7Y0FDckIsUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQzs7Y0FDckMsT0FBTyxHQUFHLFFBQVEsR0FBRyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUM7O1lBQ3RELEtBQUssR0FBRyxRQUFRLEdBQUcsT0FBTyxDQUFDLGlCQUFpQjs7WUFFNUMsa0JBQWtCLEdBQUcsT0FBTyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU07UUFDMUUsUUFBUSxrQkFBa0IsRUFBRTtZQUMxQixLQUFLLFNBQVM7Z0JBQ1osS0FBSyxHQUFHLE9BQU8sR0FBRyxLQUFLLENBQUM7Z0JBQ3hCLE1BQU07WUFDUixLQUFLLE1BQU07Z0JBQ1QsS0FBSyxHQUFHLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQztnQkFDekMsTUFBTTtTQUNUOztjQUVLLFFBQVEsR0FBRyxPQUFPLENBQUMsZUFBZTtRQUN4QyxJQUFJLEtBQUssRUFBRTtZQUNULFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDL0I7O2NBRUssWUFBWSxHQUFHLFFBQVEsQ0FBQyxXQUFXO1FBQ3pDLFlBQVksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMzQyxPQUFPLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQztRQUUzQiwwQkFBMEI7UUFDMUIsMkRBQTJEO1FBQzNELGtFQUFrRTtRQUNsRSxpRUFBaUU7UUFDakUsYUFBYSxDQUFDLGtCQUFrQjtZQUM1QixDQUFDLEVBQUUsQ0FBQyxXQUFXLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsU0FBUyxHQUFHLGFBQWEsQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDakcsQ0FBQztDQUNGOztNQU1LLDBCQUEwQixHQUFHLG1CQUE0QixFQUFFLEVBQUE7QUFDakUsTUFBTSxPQUFPLHdCQUF3Qjs7Ozs7Ozs7Ozs7SUFXbkMsWUFDWSxPQUF3QixFQUFTLE9BQVksRUFDOUMsZUFBc0MsRUFBVSxlQUF1QixFQUN0RSxlQUF1QixFQUFTLE1BQWEsRUFBUyxTQUE0QixFQUMxRixlQUFpQztRQUh6QixZQUFPLEdBQVAsT0FBTyxDQUFpQjtRQUFTLFlBQU8sR0FBUCxPQUFPLENBQUs7UUFDOUMsb0JBQWUsR0FBZixlQUFlLENBQXVCO1FBQVUsb0JBQWUsR0FBZixlQUFlLENBQVE7UUFDdEUsb0JBQWUsR0FBZixlQUFlLENBQVE7UUFBUyxXQUFNLEdBQU4sTUFBTSxDQUFPO1FBQVMsY0FBUyxHQUFULFNBQVMsQ0FBbUI7UUFidkYsa0JBQWEsR0FBa0MsSUFBSSxDQUFDO1FBRXBELDBCQUFxQixHQUF3QixJQUFJLENBQUM7UUFDbEQsaUJBQVksR0FBK0IsMEJBQTBCLENBQUM7UUFDdEUsb0JBQWUsR0FBRyxDQUFDLENBQUM7UUFDcEIsWUFBTyxHQUFxQixFQUFFLENBQUM7UUFDL0Isc0JBQWlCLEdBQVcsQ0FBQyxDQUFDO1FBQzlCLHNCQUFpQixHQUFXLENBQUMsQ0FBQztRQUM5Qix1QkFBa0IsR0FBVyxDQUFDLENBQUM7UUFPcEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLElBQUksSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDeEYsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDdkMsQ0FBQzs7OztJQUVELElBQUksTUFBTSxLQUFLLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDOzs7Ozs7SUFFNUMsYUFBYSxDQUFDLE9BQThCLEVBQUUsWUFBc0I7UUFDbEUsSUFBSSxDQUFDLE9BQU87WUFBRSxPQUFPOztjQUVmLFVBQVUsR0FBRyxtQkFBQSxPQUFPLEVBQU87O1lBQzdCLGVBQWUsR0FBRyxJQUFJLENBQUMsT0FBTztRQUVsQyx5RkFBeUY7UUFDekYsSUFBSSxVQUFVLENBQUMsUUFBUSxJQUFJLElBQUksRUFBRTtZQUMvQixDQUFDLG1CQUFBLGVBQWUsRUFBTyxDQUFDLENBQUMsUUFBUSxHQUFHLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUM3RTtRQUVELElBQUksVUFBVSxDQUFDLEtBQUssSUFBSSxJQUFJLEVBQUU7WUFDNUIsZUFBZSxDQUFDLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDOUQ7O2NBRUssU0FBUyxHQUFHLFVBQVUsQ0FBQyxNQUFNO1FBQ25DLElBQUksU0FBUyxFQUFFOztnQkFDVCxjQUFjLEdBQTBCLG1CQUFBLGVBQWUsQ0FBQyxNQUFNLEVBQUU7WUFDcEUsSUFBSSxDQUFDLGNBQWMsRUFBRTtnQkFDbkIsY0FBYyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQzthQUMzQztZQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTzs7OztZQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNwQyxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRTtvQkFDekQsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxjQUFjLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2lCQUN4RjtZQUNILENBQUMsRUFBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDOzs7OztJQUVPLFlBQVk7O2NBQ1osT0FBTyxHQUFxQixFQUFFO1FBQ3BDLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTs7a0JBQ1YsU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTTtZQUNyQyxJQUFJLFNBQVMsRUFBRTs7c0JBQ1AsTUFBTSxHQUEwQixPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRTtnQkFDNUQsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPOzs7O2dCQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDO2FBQzdFO1NBQ0Y7UUFDRCxPQUFPLE9BQU8sQ0FBQztJQUNqQixDQUFDOzs7Ozs7O0lBRUQsZ0JBQWdCLENBQUMsVUFBaUMsSUFBSSxFQUFFLE9BQWEsRUFBRSxPQUFnQjs7Y0FFL0UsTUFBTSxHQUFHLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTzs7Y0FDaEMsT0FBTyxHQUFHLElBQUksd0JBQXdCLENBQ3hDLElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsZUFBZSxFQUN0RixJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNqRixPQUFPLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7UUFDekMsT0FBTyxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQztRQUUzRCxPQUFPLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN0QyxPQUFPLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRS9CLE9BQU8sQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUM7UUFDbkQsT0FBTyxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztRQUNuRCxPQUFPLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUM3QixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDdkIsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQzs7Ozs7SUFFRCx3QkFBd0IsQ0FBQyxPQUFnQjtRQUN2QyxJQUFJLENBQUMsWUFBWSxHQUFHLDBCQUEwQixDQUFDO1FBQy9DLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN4RSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDMUMsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDO0lBQzlCLENBQUM7Ozs7Ozs7SUFFRCwyQkFBMkIsQ0FDdkIsV0FBeUMsRUFBRSxRQUFxQixFQUNoRSxLQUFrQjs7Y0FDZCxjQUFjLEdBQW1CO1lBQ3JDLFFBQVEsRUFBRSxRQUFRLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxRQUFRO1lBQzVELEtBQUssRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsR0FBRyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLEtBQUs7WUFDekYsTUFBTSxFQUFFLEVBQUU7U0FDWDs7Y0FDSyxPQUFPLEdBQUcsSUFBSSxrQkFBa0IsQ0FDbEMsSUFBSSxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLGFBQWEsRUFDbkYsV0FBVyxDQUFDLGNBQWMsRUFBRSxjQUFjLEVBQUUsV0FBVyxDQUFDLHVCQUF1QixDQUFDO1FBQ3BGLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzdCLE9BQU8sY0FBYyxDQUFDO0lBQ3hCLENBQUM7Ozs7O0lBRUQsYUFBYSxDQUFDLElBQVk7UUFDeEIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDekUsQ0FBQzs7Ozs7SUFFRCxhQUFhLENBQUMsS0FBYTtRQUN6Qix3Q0FBd0M7UUFDeEMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFO1lBQ2IsSUFBSSxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDM0M7SUFDSCxDQUFDOzs7Ozs7Ozs7O0lBRUQsV0FBVyxDQUNQLFFBQWdCLEVBQUUsZ0JBQXdCLEVBQUUsS0FBYSxFQUFFLFdBQW9CLEVBQy9FLFFBQWlCLEVBQUUsTUFBYTs7WUFDOUIsT0FBTyxHQUFVLEVBQUU7UUFDdkIsSUFBSSxXQUFXLEVBQUU7WUFDZixPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUM1QjtRQUNELElBQUksUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsRUFBRyxtREFBbUQ7WUFDN0UsUUFBUSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUMzRSxRQUFRLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDOztrQkFDckUsS0FBSyxHQUFHLEtBQUssSUFBSSxDQUFDOztnQkFDcEIsUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQztZQUNoRSxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUU7Z0JBQ2YsUUFBUSxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxLQUFLLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQzFELFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO2FBQ2pEO1lBQ0QsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDO1NBQzNCO1FBRUQsSUFBSSxDQUFDLFFBQVEsSUFBSSxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtZQUNwQyxNQUFNLENBQUMsSUFBSSxDQUNQLFlBQVksZ0JBQWdCLDhDQUE4QyxnQkFBZ0Isc0RBQXNELENBQUMsQ0FBQztTQUN2SjtRQUNELE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7Q0FDRjs7O0lBNUlDLGlEQUEyRDs7SUFDM0QsbURBQXdDOztJQUN4Qyx5REFBeUQ7O0lBQ3pELGdEQUE2RTs7SUFDN0UsbURBQTJCOztJQUMzQiwyQ0FBc0M7O0lBQ3RDLHFEQUFxQzs7SUFDckMscURBQXFDOztJQUNyQyxzREFBc0M7Ozs7O0lBR2xDLDJDQUFnQzs7SUFBRSwyQ0FBbUI7O0lBQ3JELG1EQUE2Qzs7Ozs7SUFBRSxtREFBK0I7Ozs7O0lBQzlFLG1EQUErQjs7SUFBRSwwQ0FBb0I7O0lBQUUsNkNBQW1DOztBQWtJaEcsTUFBTSxPQUFPLGVBQWU7Ozs7Ozs7SUFjMUIsWUFDWSxPQUF3QixFQUFTLE9BQVksRUFBUyxTQUFpQixFQUN2RSw0QkFBbUQ7UUFEbkQsWUFBTyxHQUFQLE9BQU8sQ0FBaUI7UUFBUyxZQUFPLEdBQVAsT0FBTyxDQUFLO1FBQVMsY0FBUyxHQUFULFNBQVMsQ0FBUTtRQUN2RSxpQ0FBNEIsR0FBNUIsNEJBQTRCLENBQXVCO1FBZnhELGFBQVEsR0FBVyxDQUFDLENBQUM7UUFHcEIsc0JBQWlCLEdBQWUsRUFBRSxDQUFDO1FBQ25DLHFCQUFnQixHQUFlLEVBQUUsQ0FBQztRQUNsQyxlQUFVLEdBQUcsSUFBSSxHQUFHLEVBQXNCLENBQUM7UUFDM0Msa0JBQWEsR0FBa0MsRUFBRSxDQUFDO1FBR2xELG1CQUFjLEdBQWUsRUFBRSxDQUFDO1FBQ2hDLGNBQVMsR0FBZSxFQUFFLENBQUM7UUFDM0IsOEJBQXlCLEdBQW9CLElBQUksQ0FBQztRQUt4RCxJQUFJLENBQUMsSUFBSSxDQUFDLDRCQUE0QixFQUFFO1lBQ3RDLElBQUksQ0FBQyw0QkFBNEIsR0FBRyxJQUFJLEdBQUcsRUFBbUIsQ0FBQztTQUNoRTtRQUVELElBQUksQ0FBQyxvQkFBb0IsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDOUQsSUFBSSxDQUFDLHFCQUFxQixHQUFHLG1CQUFBLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztRQUM5RSxJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFxQixFQUFFO1lBQy9CLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUM7WUFDdkQsSUFBSSxDQUFDLDRCQUE0QixDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7U0FDM0U7UUFDRCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDdkIsQ0FBQzs7OztJQUVELGlCQUFpQjtRQUNmLFFBQVEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUU7WUFDNUIsS0FBSyxDQUFDO2dCQUNKLE9BQU8sS0FBSyxDQUFDO1lBQ2YsS0FBSyxDQUFDO2dCQUNKLE9BQU8sSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUNyRDtnQkFDRSxPQUFPLElBQUksQ0FBQztTQUNmO0lBQ0gsQ0FBQzs7OztJQUVELHlCQUF5QixLQUFlLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7SUFFcEYsSUFBSSxXQUFXLEtBQUssT0FBTyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDOzs7OztJQUU1RCxhQUFhLENBQUMsS0FBYTs7Ozs7O2NBS25CLGVBQWUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsTUFBTTtRQUU1RixJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksZUFBZSxFQUFFO1lBQ3BDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsQ0FBQztZQUMzQyxJQUFJLGVBQWUsRUFBRTtnQkFDbkIsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7YUFDOUI7U0FDRjthQUFNO1lBQ0wsSUFBSSxDQUFDLFNBQVMsSUFBSSxLQUFLLENBQUM7U0FDekI7SUFDSCxDQUFDOzs7Ozs7SUFFRCxJQUFJLENBQUMsT0FBWSxFQUFFLFdBQW9CO1FBQ3JDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQzdCLE9BQU8sSUFBSSxlQUFlLENBQ3RCLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFdBQVcsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0lBQ2pHLENBQUM7Ozs7O0lBRU8sYUFBYTtRQUNuQixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUN6QixJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDO1NBQ2hEO1FBQ0QsSUFBSSxDQUFDLGdCQUFnQixHQUFHLG1CQUFBLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO1FBQzdELElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDMUIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUMxRCxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1NBQzNEO0lBQ0gsQ0FBQzs7OztJQUVELFlBQVk7UUFDVixJQUFJLENBQUMsUUFBUSxJQUFJLHlCQUF5QixDQUFDO1FBQzNDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUN2QixDQUFDOzs7OztJQUVELFdBQVcsQ0FBQyxJQUFZO1FBQ3RCLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUN2QixDQUFDOzs7Ozs7O0lBRU8sWUFBWSxDQUFDLElBQVksRUFBRSxLQUFvQjtRQUNyRCxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDekMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFDLElBQUksRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLEtBQUssRUFBQyxDQUFDO0lBQzdELENBQUM7Ozs7SUFFRCx1QkFBdUIsS0FBSyxPQUFPLElBQUksQ0FBQyx5QkFBeUIsS0FBSyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDOzs7OztJQUU5RixjQUFjLENBQUMsTUFBbUI7UUFDaEMsSUFBSSxNQUFNLEVBQUU7WUFDVixJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLEdBQUcsTUFBTSxDQUFDO1NBQzNDO1FBRUQsc0NBQXNDO1FBQ3RDLHNEQUFzRDtRQUN0RCw0REFBNEQ7UUFDNUQseURBQXlEO1FBQ3pELDJEQUEyRDtRQUMzRCxxRUFBcUU7UUFDckUsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQyxPQUFPOzs7O1FBQUMsSUFBSSxDQUFDLEVBQUU7WUFDckQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLElBQUksVUFBVSxDQUFDO1lBQ3RFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxVQUFVLENBQUM7UUFDM0MsQ0FBQyxFQUFDLENBQUM7UUFDSCxJQUFJLENBQUMseUJBQXlCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDO0lBQ3pELENBQUM7Ozs7Ozs7O0lBRUQsU0FBUyxDQUNMLEtBQTRCLEVBQUUsTUFBbUIsRUFBRSxNQUFhLEVBQ2hFLE9BQTBCO1FBQzVCLElBQUksTUFBTSxFQUFFO1lBQ1YsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxHQUFHLE1BQU0sQ0FBQztTQUMzQzs7Y0FFSyxNQUFNLEdBQUcsQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7O2NBQzFDLE1BQU0sR0FBRyxhQUFhLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQztRQUMvRCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU87Ozs7UUFBQyxJQUFJLENBQUMsRUFBRTs7a0JBQzNCLEdBQUcsR0FBRyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQztZQUMzRCxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUNoQyxJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDbkQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ3BFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNsQyxVQUFVLENBQUM7YUFDaEI7WUFDRCxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztRQUMvQixDQUFDLEVBQUMsQ0FBQztJQUNMLENBQUM7Ozs7SUFFRCxxQkFBcUI7O2NBQ2IsTUFBTSxHQUFHLElBQUksQ0FBQyxjQUFjOztjQUM1QixLQUFLLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDakMsSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUM7WUFBRSxPQUFPO1FBRTlCLElBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDO1FBRXpCLEtBQUssQ0FBQyxPQUFPOzs7O1FBQUMsSUFBSSxDQUFDLEVBQUU7O2tCQUNiLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ3hCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDcEMsQ0FBQyxFQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLE9BQU87Ozs7UUFBQyxJQUFJLENBQUMsRUFBRTtZQUNwRCxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDL0MsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUMvRDtRQUNILENBQUMsRUFBQyxDQUFDO0lBQ0wsQ0FBQzs7OztJQUVELHFCQUFxQjtRQUNuQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLE9BQU87Ozs7UUFBQyxJQUFJLENBQUMsRUFBRTs7a0JBQzlDLEdBQUcsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDO1lBQzNDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQy9CLENBQUMsRUFBQyxDQUFDO0lBQ0wsQ0FBQzs7OztJQUVELGdCQUFnQixLQUFLLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7OztJQUVqRSxJQUFJLFVBQVU7O2NBQ04sVUFBVSxHQUFhLEVBQUU7UUFDL0IsS0FBSyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDdEMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN2QjtRQUNELE9BQU8sVUFBVSxDQUFDO0lBQ3BCLENBQUM7Ozs7O0lBRUQsNEJBQTRCLENBQUMsUUFBeUI7UUFDcEQsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTzs7OztRQUFDLElBQUksQ0FBQyxFQUFFOztrQkFDM0MsUUFBUSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDOztrQkFDbkMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDO1lBQzdDLElBQUksQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSSxFQUFFO2dCQUM5QyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDekM7UUFDSCxDQUFDLEVBQUMsQ0FBQztJQUNMLENBQUM7Ozs7SUFFRCxjQUFjO1FBQ1osSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7O2NBQ3ZCLGFBQWEsR0FBRyxJQUFJLEdBQUcsRUFBVTs7Y0FDakMsY0FBYyxHQUFHLElBQUksR0FBRyxFQUFVOztjQUNsQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssQ0FBQzs7WUFFN0QsY0FBYyxHQUFpQixFQUFFO1FBQ3JDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTzs7Ozs7UUFBQyxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsRUFBRTs7a0JBQ25DLGFBQWEsR0FBRyxVQUFVLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQztZQUNoRCxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU87Ozs7WUFBQyxJQUFJLENBQUMsRUFBRTs7c0JBQ2xDLEtBQUssR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDO2dCQUNqQyxJQUFJLEtBQUssSUFBSSxTQUFTLEVBQUU7b0JBQ3RCLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ3pCO3FCQUFNLElBQUksS0FBSyxJQUFJLFVBQVUsRUFBRTtvQkFDOUIsY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDMUI7WUFDSCxDQUFDLEVBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ1osYUFBYSxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO2FBQ2hEO1lBQ0QsY0FBYyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNyQyxDQUFDLEVBQUMsQ0FBQzs7Y0FFRyxRQUFRLEdBQWEsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFOztjQUN0RixTQUFTLEdBQWEsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBRS9GLDBGQUEwRjtRQUMxRixJQUFJLE9BQU8sRUFBRTs7a0JBQ0wsR0FBRyxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUM7O2tCQUN2QixHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztZQUN4QixHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2xCLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbEIsY0FBYyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQzdCO1FBRUQsT0FBTyx5QkFBeUIsQ0FDNUIsSUFBSSxDQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQ2hGLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDMUIsQ0FBQztDQUNGOzs7SUE5TkMsbUNBQTRCOztJQUU1QixpQ0FBK0I7Ozs7O0lBQy9CLDRDQUEyQzs7Ozs7SUFDM0MsMkNBQTBDOzs7OztJQUMxQyxxQ0FBbUQ7Ozs7O0lBQ25ELHdDQUEwRDs7Ozs7SUFDMUQsK0NBQXlDOzs7OztJQUN6QyxnREFBMEM7Ozs7O0lBQzFDLHlDQUF3Qzs7Ozs7SUFDeEMsb0NBQW1DOzs7OztJQUNuQyxvREFBMEQ7Ozs7O0lBR3RELGtDQUFnQzs7SUFBRSxrQ0FBbUI7O0lBQUUsb0NBQXdCOzs7OztJQUMvRSx1REFBMkQ7O0FBaU5qRSxNQUFNLGtCQUFtQixTQUFRLGVBQWU7Ozs7Ozs7Ozs7SUFHOUMsWUFDSSxNQUF1QixFQUFTLE9BQVksRUFBUyxTQUF1QixFQUNyRSxhQUF1QixFQUFTLGNBQXdCLEVBQUUsT0FBdUIsRUFDaEYsMkJBQW9DLEtBQUs7UUFDbkQsS0FBSyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBSEosWUFBTyxHQUFQLE9BQU8sQ0FBSztRQUFTLGNBQVMsR0FBVCxTQUFTLENBQWM7UUFDckUsa0JBQWEsR0FBYixhQUFhLENBQVU7UUFBUyxtQkFBYyxHQUFkLGNBQWMsQ0FBVTtRQUN2RCw2QkFBd0IsR0FBeEIsd0JBQXdCLENBQWlCO1FBRW5ELElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU0sRUFBQyxDQUFDO0lBQzVGLENBQUM7Ozs7SUFFRCxpQkFBaUIsS0FBYyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7SUFFbEUsY0FBYzs7WUFDUixTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVM7WUFDMUIsRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBQyxHQUFHLElBQUksQ0FBQyxPQUFPO1FBQzVDLElBQUksSUFBSSxDQUFDLHdCQUF3QixJQUFJLEtBQUssRUFBRTs7a0JBQ3BDLFlBQVksR0FBaUIsRUFBRTs7a0JBQy9CLFNBQVMsR0FBRyxRQUFRLEdBQUcsS0FBSzs7a0JBQzVCLFdBQVcsR0FBRyxLQUFLLEdBQUcsU0FBUzs7O2tCQUcvQixnQkFBZ0IsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQztZQUN4RCxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDL0IsWUFBWSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOztrQkFFOUIsZ0JBQWdCLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUM7WUFDeEQsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3RELFlBQVksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7a0JBa0I5QixLQUFLLEdBQUcsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDO1lBQ2xDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7O29CQUMzQixFQUFFLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUM7O3NCQUNsQyxTQUFTLEdBQUcsbUJBQUEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFVOztzQkFDbEMsY0FBYyxHQUFHLEtBQUssR0FBRyxTQUFTLEdBQUcsUUFBUTtnQkFDbkQsRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxjQUFjLEdBQUcsU0FBUyxDQUFDLENBQUM7Z0JBQ3ZELFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7YUFDdkI7WUFFRCx5REFBeUQ7WUFDekQsUUFBUSxHQUFHLFNBQVMsQ0FBQztZQUNyQixLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBQ1YsTUFBTSxHQUFHLEVBQUUsQ0FBQztZQUVaLFNBQVMsR0FBRyxZQUFZLENBQUM7U0FDMUI7UUFFRCxPQUFPLHlCQUF5QixDQUM1QixJQUFJLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQ3pGLElBQUksQ0FBQyxDQUFDO0lBQ1osQ0FBQztDQUNGOzs7SUFsRUMscUNBQStCOztJQUdGLHFDQUFtQjs7SUFBRSx1Q0FBOEI7O0lBQzVFLDJDQUE4Qjs7SUFBRSw0Q0FBK0I7Ozs7O0lBQy9ELHNEQUFpRDs7Ozs7OztBQStEdkQsU0FBUyxXQUFXLENBQUMsTUFBYyxFQUFFLGFBQWEsR0FBRyxDQUFDOztVQUM5QyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsYUFBYSxHQUFHLENBQUMsQ0FBQztJQUM1QyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztBQUMxQyxDQUFDOzs7Ozs7QUFFRCxTQUFTLGFBQWEsQ0FBQyxLQUE4QixFQUFFLFNBQXFCOztVQUNwRSxNQUFNLEdBQWUsRUFBRTs7UUFDekIsYUFBdUI7SUFDM0IsS0FBSyxDQUFDLE9BQU87Ozs7SUFBQyxLQUFLLENBQUMsRUFBRTtRQUNwQixJQUFJLEtBQUssS0FBSyxHQUFHLEVBQUU7WUFDakIsYUFBYSxHQUFHLGFBQWEsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3hELGFBQWEsQ0FBQyxPQUFPOzs7O1lBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUM7U0FDL0Q7YUFBTTtZQUNMLFVBQVUsQ0FBQyxtQkFBQSxLQUFLLEVBQWMsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDaEQ7SUFDSCxDQUFDLEVBQUMsQ0FBQztJQUNILE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0FVVE9fU1RZTEUsIEFuaW1hdGVDaGlsZE9wdGlvbnMsIEFuaW1hdGVUaW1pbmdzLCBBbmltYXRpb25NZXRhZGF0YVR5cGUsIEFuaW1hdGlvbk9wdGlvbnMsIEFuaW1hdGlvblF1ZXJ5T3B0aW9ucywgybVQUkVfU1RZTEUgYXMgUFJFX1NUWUxFLCDJtVN0eWxlRGF0YX0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5cbmltcG9ydCB7QW5pbWF0aW9uRHJpdmVyfSBmcm9tICcuLi9yZW5kZXIvYW5pbWF0aW9uX2RyaXZlcic7XG5pbXBvcnQge2NvcHlPYmosIGNvcHlTdHlsZXMsIGludGVycG9sYXRlUGFyYW1zLCBpdGVyYXRvclRvQXJyYXksIHJlc29sdmVUaW1pbmcsIHJlc29sdmVUaW1pbmdWYWx1ZSwgdmlzaXREc2xOb2RlfSBmcm9tICcuLi91dGlsJztcblxuaW1wb3J0IHtBbmltYXRlQXN0LCBBbmltYXRlQ2hpbGRBc3QsIEFuaW1hdGVSZWZBc3QsIEFzdCwgQXN0VmlzaXRvciwgRHluYW1pY1RpbWluZ0FzdCwgR3JvdXBBc3QsIEtleWZyYW1lc0FzdCwgUXVlcnlBc3QsIFJlZmVyZW5jZUFzdCwgU2VxdWVuY2VBc3QsIFN0YWdnZXJBc3QsIFN0YXRlQXN0LCBTdHlsZUFzdCwgVGltaW5nQXN0LCBUcmFuc2l0aW9uQXN0LCBUcmlnZ2VyQXN0fSBmcm9tICcuL2FuaW1hdGlvbl9hc3QnO1xuaW1wb3J0IHtBbmltYXRpb25UaW1lbGluZUluc3RydWN0aW9uLCBjcmVhdGVUaW1lbGluZUluc3RydWN0aW9ufSBmcm9tICcuL2FuaW1hdGlvbl90aW1lbGluZV9pbnN0cnVjdGlvbic7XG5pbXBvcnQge0VsZW1lbnRJbnN0cnVjdGlvbk1hcH0gZnJvbSAnLi9lbGVtZW50X2luc3RydWN0aW9uX21hcCc7XG5cbmNvbnN0IE9ORV9GUkFNRV9JTl9NSUxMSVNFQ09ORFMgPSAxO1xuY29uc3QgRU5URVJfVE9LRU4gPSAnOmVudGVyJztcbmNvbnN0IEVOVEVSX1RPS0VOX1JFR0VYID0gbmV3IFJlZ0V4cChFTlRFUl9UT0tFTiwgJ2cnKTtcbmNvbnN0IExFQVZFX1RPS0VOID0gJzpsZWF2ZSc7XG5jb25zdCBMRUFWRV9UT0tFTl9SRUdFWCA9IG5ldyBSZWdFeHAoTEVBVkVfVE9LRU4sICdnJyk7XG5cbi8qXG4gKiBUaGUgY29kZSB3aXRoaW4gdGhpcyBmaWxlIGFpbXMgdG8gZ2VuZXJhdGUgd2ViLWFuaW1hdGlvbnMtY29tcGF0aWJsZSBrZXlmcmFtZXMgZnJvbSBBbmd1bGFyJ3NcbiAqIGFuaW1hdGlvbiBEU0wgY29kZS5cbiAqXG4gKiBUaGUgY29kZSBiZWxvdyB3aWxsIGJlIGNvbnZlcnRlZCBmcm9tOlxuICpcbiAqIGBgYFxuICogc2VxdWVuY2UoW1xuICogICBzdHlsZSh7IG9wYWNpdHk6IDAgfSksXG4gKiAgIGFuaW1hdGUoMTAwMCwgc3R5bGUoeyBvcGFjaXR5OiAwIH0pKVxuICogXSlcbiAqIGBgYFxuICpcbiAqIFRvOlxuICogYGBgXG4gKiBrZXlmcmFtZXMgPSBbeyBvcGFjaXR5OiAwLCBvZmZzZXQ6IDAgfSwgeyBvcGFjaXR5OiAxLCBvZmZzZXQ6IDEgfV1cbiAqIGR1cmF0aW9uID0gMTAwMFxuICogZGVsYXkgPSAwXG4gKiBlYXNpbmcgPSAnJ1xuICogYGBgXG4gKlxuICogRm9yIHRoaXMgb3BlcmF0aW9uIHRvIGNvdmVyIHRoZSBjb21iaW5hdGlvbiBvZiBhbmltYXRpb24gdmVyYnMgKHN0eWxlLCBhbmltYXRlLCBncm91cCwgZXRjLi4uKSBhXG4gKiBjb21iaW5hdGlvbiBvZiBwcm90b3R5cGljYWwgaW5oZXJpdGFuY2UsIEFTVCB0cmF2ZXJzYWwgYW5kIG1lcmdlLXNvcnQtbGlrZSBhbGdvcml0aG1zIGFyZSB1c2VkLlxuICpcbiAqIFtBU1QgVHJhdmVyc2FsXVxuICogRWFjaCBvZiB0aGUgYW5pbWF0aW9uIHZlcmJzLCB3aGVuIGV4ZWN1dGVkLCB3aWxsIHJldHVybiBhbiBzdHJpbmctbWFwIG9iamVjdCByZXByZXNlbnRpbmcgd2hhdFxuICogdHlwZSBvZiBhY3Rpb24gaXQgaXMgKHN0eWxlLCBhbmltYXRlLCBncm91cCwgZXRjLi4uKSBhbmQgdGhlIGRhdGEgYXNzb2NpYXRlZCB3aXRoIGl0LiBUaGlzIG1lYW5zXG4gKiB0aGF0IHdoZW4gZnVuY3Rpb25hbCBjb21wb3NpdGlvbiBtaXggb2YgdGhlc2UgZnVuY3Rpb25zIGlzIGV2YWx1YXRlZCAobGlrZSBpbiB0aGUgZXhhbXBsZSBhYm92ZSlcbiAqIHRoZW4gaXQgd2lsbCBlbmQgdXAgcHJvZHVjaW5nIGEgdHJlZSBvZiBvYmplY3RzIHJlcHJlc2VudGluZyB0aGUgYW5pbWF0aW9uIGl0c2VsZi5cbiAqXG4gKiBXaGVuIHRoaXMgYW5pbWF0aW9uIG9iamVjdCB0cmVlIGlzIHByb2Nlc3NlZCBieSB0aGUgdmlzaXRvciBjb2RlIGJlbG93IGl0IHdpbGwgdmlzaXQgZWFjaCBvZiB0aGVcbiAqIHZlcmIgc3RhdGVtZW50cyB3aXRoaW4gdGhlIHZpc2l0b3IuIEFuZCBkdXJpbmcgZWFjaCB2aXNpdCBpdCB3aWxsIGJ1aWxkIHRoZSBjb250ZXh0IG9mIHRoZVxuICogYW5pbWF0aW9uIGtleWZyYW1lcyBieSBpbnRlcmFjdGluZyB3aXRoIHRoZSBgVGltZWxpbmVCdWlsZGVyYC5cbiAqXG4gKiBbVGltZWxpbmVCdWlsZGVyXVxuICogVGhpcyBjbGFzcyBpcyByZXNwb25zaWJsZSBmb3IgdHJhY2tpbmcgdGhlIHN0eWxlcyBhbmQgYnVpbGRpbmcgYSBzZXJpZXMgb2Yga2V5ZnJhbWUgb2JqZWN0cyBmb3IgYVxuICogdGltZWxpbmUgYmV0d2VlbiBhIHN0YXJ0IGFuZCBlbmQgdGltZS4gVGhlIGJ1aWxkZXIgc3RhcnRzIG9mZiB3aXRoIGFuIGluaXRpYWwgdGltZWxpbmUgYW5kIGVhY2hcbiAqIHRpbWUgdGhlIEFTVCBjb21lcyBhY3Jvc3MgYSBgZ3JvdXAoKWAsIGBrZXlmcmFtZXMoKWAgb3IgYSBjb21iaW5hdGlvbiBvZiB0aGUgdHdvIHdpaHRpbiBhXG4gKiBgc2VxdWVuY2UoKWAgdGhlbiBpdCB3aWxsIGdlbmVyYXRlIGEgc3ViIHRpbWVsaW5lIGZvciBlYWNoIHN0ZXAgYXMgd2VsbCBhcyBhIG5ldyBvbmUgYWZ0ZXJcbiAqIHRoZXkgYXJlIGNvbXBsZXRlLlxuICpcbiAqIEFzIHRoZSBBU1QgaXMgdHJhdmVyc2VkLCB0aGUgdGltaW5nIHN0YXRlIG9uIGVhY2ggb2YgdGhlIHRpbWVsaW5lcyB3aWxsIGJlIGluY3JlbWVudGVkLiBJZiBhIHN1YlxuICogdGltZWxpbmUgd2FzIGNyZWF0ZWQgKGJhc2VkIG9uIG9uZSBvZiB0aGUgY2FzZXMgYWJvdmUpIHRoZW4gdGhlIHBhcmVudCB0aW1lbGluZSB3aWxsIGF0dGVtcHQgdG9cbiAqIG1lcmdlIHRoZSBzdHlsZXMgdXNlZCB3aXRoaW4gdGhlIHN1YiB0aW1lbGluZXMgaW50byBpdHNlbGYgKG9ubHkgd2l0aCBncm91cCgpIHRoaXMgd2lsbCBoYXBwZW4pLlxuICogVGhpcyBoYXBwZW5zIHdpdGggYSBtZXJnZSBvcGVyYXRpb24gKG11Y2ggbGlrZSBob3cgdGhlIG1lcmdlIHdvcmtzIGluIG1lcmdlc29ydCkgYW5kIGl0IHdpbGwgb25seVxuICogY29weSB0aGUgbW9zdCByZWNlbnRseSB1c2VkIHN0eWxlcyBmcm9tIHRoZSBzdWIgdGltZWxpbmVzIGludG8gdGhlIHBhcmVudCB0aW1lbGluZS4gVGhpcyBlbnN1cmVzXG4gKiB0aGF0IGlmIHRoZSBzdHlsZXMgYXJlIHVzZWQgbGF0ZXIgb24gaW4gYW5vdGhlciBwaGFzZSBvZiB0aGUgYW5pbWF0aW9uIHRoZW4gdGhleSB3aWxsIGJlIHRoZSBtb3N0XG4gKiB1cC10by1kYXRlIHZhbHVlcy5cbiAqXG4gKiBbSG93IE1pc3NpbmcgU3R5bGVzIEFyZSBVcGRhdGVkXVxuICogRWFjaCB0aW1lbGluZSBoYXMgYSBgYmFja0ZpbGxgIHByb3BlcnR5IHdoaWNoIGlzIHJlc3BvbnNpYmxlIGZvciBmaWxsaW5nIGluIG5ldyBzdHlsZXMgaW50b1xuICogYWxyZWFkeSBwcm9jZXNzZWQga2V5ZnJhbWVzIGlmIGEgbmV3IHN0eWxlIHNob3dzIHVwIGxhdGVyIHdpdGhpbiB0aGUgYW5pbWF0aW9uIHNlcXVlbmNlLlxuICpcbiAqIGBgYFxuICogc2VxdWVuY2UoW1xuICogICBzdHlsZSh7IHdpZHRoOiAwIH0pLFxuICogICBhbmltYXRlKDEwMDAsIHN0eWxlKHsgd2lkdGg6IDEwMCB9KSksXG4gKiAgIGFuaW1hdGUoMTAwMCwgc3R5bGUoeyB3aWR0aDogMjAwIH0pKSxcbiAqICAgYW5pbWF0ZSgxMDAwLCBzdHlsZSh7IHdpZHRoOiAzMDAgfSkpXG4gKiAgIGFuaW1hdGUoMTAwMCwgc3R5bGUoeyB3aWR0aDogNDAwLCBoZWlnaHQ6IDQwMCB9KSkgLy8gbm90aWNlIGhvdyBgaGVpZ2h0YCBkb2Vzbid0IGV4aXN0IGFueXdoZXJlXG4gKiBlbHNlXG4gKiBdKVxuICogYGBgXG4gKlxuICogV2hhdCBpcyBoYXBwZW5pbmcgaGVyZSBpcyB0aGF0IHRoZSBgaGVpZ2h0YCB2YWx1ZSBpcyBhZGRlZCBsYXRlciBpbiB0aGUgc2VxdWVuY2UsIGJ1dCBpcyBtaXNzaW5nXG4gKiBmcm9tIGFsbCBwcmV2aW91cyBhbmltYXRpb24gc3RlcHMuIFRoZXJlZm9yZSB3aGVuIGEga2V5ZnJhbWUgaXMgY3JlYXRlZCBpdCB3b3VsZCBhbHNvIGJlIG1pc3NpbmdcbiAqIGZyb20gYWxsIHByZXZpb3VzIGtleWZyYW1lcyB1cCB1bnRpbCB3aGVyZSBpdCBpcyBmaXJzdCB1c2VkLiBGb3IgdGhlIHRpbWVsaW5lIGtleWZyYW1lIGdlbmVyYXRpb25cbiAqIHRvIHByb3Blcmx5IGZpbGwgaW4gdGhlIHN0eWxlIGl0IHdpbGwgcGxhY2UgdGhlIHByZXZpb3VzIHZhbHVlICh0aGUgdmFsdWUgZnJvbSB0aGUgcGFyZW50XG4gKiB0aW1lbGluZSkgb3IgYSBkZWZhdWx0IHZhbHVlIG9mIGAqYCBpbnRvIHRoZSBiYWNrRmlsbCBvYmplY3QuIEdpdmVuIHRoYXQgZWFjaCBvZiB0aGUga2V5ZnJhbWVcbiAqIHN0eWxlcyBhcmUgb2JqZWN0cyB0aGF0IHByb3RvdHlwaWNhbGx5IGluaGVydCBmcm9tIHRoZSBiYWNrRmlsbCBvYmplY3QsIHRoaXMgbWVhbnMgdGhhdCBpZiBhXG4gKiB2YWx1ZSBpcyBhZGRlZCBpbnRvIHRoZSBiYWNrRmlsbCB0aGVuIGl0IHdpbGwgYXV0b21hdGljYWxseSBwcm9wYWdhdGUgYW55IG1pc3NpbmcgdmFsdWVzIHRvIGFsbFxuICoga2V5ZnJhbWVzLiBUaGVyZWZvcmUgdGhlIG1pc3NpbmcgYGhlaWdodGAgdmFsdWUgd2lsbCBiZSBwcm9wZXJseSBmaWxsZWQgaW50byB0aGUgYWxyZWFkeVxuICogcHJvY2Vzc2VkIGtleWZyYW1lcy5cbiAqXG4gKiBXaGVuIGEgc3ViLXRpbWVsaW5lIGlzIGNyZWF0ZWQgaXQgd2lsbCBoYXZlIGl0cyBvd24gYmFja0ZpbGwgcHJvcGVydHkuIFRoaXMgaXMgZG9uZSBzbyB0aGF0XG4gKiBzdHlsZXMgcHJlc2VudCB3aXRoaW4gdGhlIHN1Yi10aW1lbGluZSBkbyBub3QgYWNjaWRlbnRhbGx5IHNlZXAgaW50byB0aGUgcHJldmlvdXMvZnV0dXJlIHRpbWVsaW5lXG4gKiBrZXlmcmFtZXNcbiAqXG4gKiAoRm9yIHByb3RvdHlwaWNhbGx5LWluaGVyaXRlZCBjb250ZW50cyB0byBiZSBkZXRlY3RlZCBhIGBmb3IoaSBpbiBvYmopYCBsb29wIG11c3QgYmUgdXNlZC4pXG4gKlxuICogW1ZhbGlkYXRpb25dXG4gKiBUaGUgY29kZSBpbiB0aGlzIGZpbGUgaXMgbm90IHJlc3BvbnNpYmxlIGZvciB2YWxpZGF0aW9uLiBUaGF0IGZ1bmN0aW9uYWxpdHkgaGFwcGVucyB3aXRoIHdpdGhpblxuICogdGhlIGBBbmltYXRpb25WYWxpZGF0b3JWaXNpdG9yYCBjb2RlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRBbmltYXRpb25UaW1lbGluZXMoXG4gICAgZHJpdmVyOiBBbmltYXRpb25Ecml2ZXIsIHJvb3RFbGVtZW50OiBhbnksIGFzdDogQXN0PEFuaW1hdGlvbk1ldGFkYXRhVHlwZT4sXG4gICAgZW50ZXJDbGFzc05hbWU6IHN0cmluZywgbGVhdmVDbGFzc05hbWU6IHN0cmluZywgc3RhcnRpbmdTdHlsZXM6IMm1U3R5bGVEYXRhID0ge30sXG4gICAgZmluYWxTdHlsZXM6IMm1U3R5bGVEYXRhID0ge30sIG9wdGlvbnM6IEFuaW1hdGlvbk9wdGlvbnMsXG4gICAgc3ViSW5zdHJ1Y3Rpb25zPzogRWxlbWVudEluc3RydWN0aW9uTWFwLCBlcnJvcnM6IGFueVtdID0gW10pOiBBbmltYXRpb25UaW1lbGluZUluc3RydWN0aW9uW10ge1xuICByZXR1cm4gbmV3IEFuaW1hdGlvblRpbWVsaW5lQnVpbGRlclZpc2l0b3IoKS5idWlsZEtleWZyYW1lcyhcbiAgICAgIGRyaXZlciwgcm9vdEVsZW1lbnQsIGFzdCwgZW50ZXJDbGFzc05hbWUsIGxlYXZlQ2xhc3NOYW1lLCBzdGFydGluZ1N0eWxlcywgZmluYWxTdHlsZXMsXG4gICAgICBvcHRpb25zLCBzdWJJbnN0cnVjdGlvbnMsIGVycm9ycyk7XG59XG5cbmV4cG9ydCBjbGFzcyBBbmltYXRpb25UaW1lbGluZUJ1aWxkZXJWaXNpdG9yIGltcGxlbWVudHMgQXN0VmlzaXRvciB7XG4gIGJ1aWxkS2V5ZnJhbWVzKFxuICAgICAgZHJpdmVyOiBBbmltYXRpb25Ecml2ZXIsIHJvb3RFbGVtZW50OiBhbnksIGFzdDogQXN0PEFuaW1hdGlvbk1ldGFkYXRhVHlwZT4sXG4gICAgICBlbnRlckNsYXNzTmFtZTogc3RyaW5nLCBsZWF2ZUNsYXNzTmFtZTogc3RyaW5nLCBzdGFydGluZ1N0eWxlczogybVTdHlsZURhdGEsXG4gICAgICBmaW5hbFN0eWxlczogybVTdHlsZURhdGEsIG9wdGlvbnM6IEFuaW1hdGlvbk9wdGlvbnMsIHN1Ykluc3RydWN0aW9ucz86IEVsZW1lbnRJbnN0cnVjdGlvbk1hcCxcbiAgICAgIGVycm9yczogYW55W10gPSBbXSk6IEFuaW1hdGlvblRpbWVsaW5lSW5zdHJ1Y3Rpb25bXSB7XG4gICAgc3ViSW5zdHJ1Y3Rpb25zID0gc3ViSW5zdHJ1Y3Rpb25zIHx8IG5ldyBFbGVtZW50SW5zdHJ1Y3Rpb25NYXAoKTtcbiAgICBjb25zdCBjb250ZXh0ID0gbmV3IEFuaW1hdGlvblRpbWVsaW5lQ29udGV4dChcbiAgICAgICAgZHJpdmVyLCByb290RWxlbWVudCwgc3ViSW5zdHJ1Y3Rpb25zLCBlbnRlckNsYXNzTmFtZSwgbGVhdmVDbGFzc05hbWUsIGVycm9ycywgW10pO1xuICAgIGNvbnRleHQub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgY29udGV4dC5jdXJyZW50VGltZWxpbmUuc2V0U3R5bGVzKFtzdGFydGluZ1N0eWxlc10sIG51bGwsIGNvbnRleHQuZXJyb3JzLCBvcHRpb25zKTtcblxuICAgIHZpc2l0RHNsTm9kZSh0aGlzLCBhc3QsIGNvbnRleHQpO1xuXG4gICAgLy8gdGhpcyBjaGVja3MgdG8gc2VlIGlmIGFuIGFjdHVhbCBhbmltYXRpb24gaGFwcGVuZWRcbiAgICBjb25zdCB0aW1lbGluZXMgPSBjb250ZXh0LnRpbWVsaW5lcy5maWx0ZXIodGltZWxpbmUgPT4gdGltZWxpbmUuY29udGFpbnNBbmltYXRpb24oKSk7XG4gICAgaWYgKHRpbWVsaW5lcy5sZW5ndGggJiYgT2JqZWN0LmtleXMoZmluYWxTdHlsZXMpLmxlbmd0aCkge1xuICAgICAgY29uc3QgdGwgPSB0aW1lbGluZXNbdGltZWxpbmVzLmxlbmd0aCAtIDFdO1xuICAgICAgaWYgKCF0bC5hbGxvd09ubHlUaW1lbGluZVN0eWxlcygpKSB7XG4gICAgICAgIHRsLnNldFN0eWxlcyhbZmluYWxTdHlsZXNdLCBudWxsLCBjb250ZXh0LmVycm9ycywgb3B0aW9ucyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRpbWVsaW5lcy5sZW5ndGggPyB0aW1lbGluZXMubWFwKHRpbWVsaW5lID0+IHRpbWVsaW5lLmJ1aWxkS2V5ZnJhbWVzKCkpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtjcmVhdGVUaW1lbGluZUluc3RydWN0aW9uKHJvb3RFbGVtZW50LCBbXSwgW10sIFtdLCAwLCAwLCAnJywgZmFsc2UpXTtcbiAgfVxuXG4gIHZpc2l0VHJpZ2dlcihhc3Q6IFRyaWdnZXJBc3QsIGNvbnRleHQ6IEFuaW1hdGlvblRpbWVsaW5lQ29udGV4dCk6IGFueSB7XG4gICAgLy8gdGhlc2UgdmFsdWVzIGFyZSBub3QgdmlzaXRlZCBpbiB0aGlzIEFTVFxuICB9XG5cbiAgdmlzaXRTdGF0ZShhc3Q6IFN0YXRlQXN0LCBjb250ZXh0OiBBbmltYXRpb25UaW1lbGluZUNvbnRleHQpOiBhbnkge1xuICAgIC8vIHRoZXNlIHZhbHVlcyBhcmUgbm90IHZpc2l0ZWQgaW4gdGhpcyBBU1RcbiAgfVxuXG4gIHZpc2l0VHJhbnNpdGlvbihhc3Q6IFRyYW5zaXRpb25Bc3QsIGNvbnRleHQ6IEFuaW1hdGlvblRpbWVsaW5lQ29udGV4dCk6IGFueSB7XG4gICAgLy8gdGhlc2UgdmFsdWVzIGFyZSBub3QgdmlzaXRlZCBpbiB0aGlzIEFTVFxuICB9XG5cbiAgdmlzaXRBbmltYXRlQ2hpbGQoYXN0OiBBbmltYXRlQ2hpbGRBc3QsIGNvbnRleHQ6IEFuaW1hdGlvblRpbWVsaW5lQ29udGV4dCk6IGFueSB7XG4gICAgY29uc3QgZWxlbWVudEluc3RydWN0aW9ucyA9IGNvbnRleHQuc3ViSW5zdHJ1Y3Rpb25zLmNvbnN1bWUoY29udGV4dC5lbGVtZW50KTtcbiAgICBpZiAoZWxlbWVudEluc3RydWN0aW9ucykge1xuICAgICAgY29uc3QgaW5uZXJDb250ZXh0ID0gY29udGV4dC5jcmVhdGVTdWJDb250ZXh0KGFzdC5vcHRpb25zKTtcbiAgICAgIGNvbnN0IHN0YXJ0VGltZSA9IGNvbnRleHQuY3VycmVudFRpbWVsaW5lLmN1cnJlbnRUaW1lO1xuICAgICAgY29uc3QgZW5kVGltZSA9IHRoaXMuX3Zpc2l0U3ViSW5zdHJ1Y3Rpb25zKFxuICAgICAgICAgIGVsZW1lbnRJbnN0cnVjdGlvbnMsIGlubmVyQ29udGV4dCwgaW5uZXJDb250ZXh0Lm9wdGlvbnMgYXMgQW5pbWF0ZUNoaWxkT3B0aW9ucyk7XG4gICAgICBpZiAoc3RhcnRUaW1lICE9IGVuZFRpbWUpIHtcbiAgICAgICAgLy8gd2UgZG8gdGhpcyBvbiB0aGUgdXBwZXIgY29udGV4dCBiZWNhdXNlIHdlIGNyZWF0ZWQgYSBzdWIgY29udGV4dCBmb3JcbiAgICAgICAgLy8gdGhlIHN1YiBjaGlsZCBhbmltYXRpb25zXG4gICAgICAgIGNvbnRleHQudHJhbnNmb3JtSW50b05ld1RpbWVsaW5lKGVuZFRpbWUpO1xuICAgICAgfVxuICAgIH1cbiAgICBjb250ZXh0LnByZXZpb3VzTm9kZSA9IGFzdDtcbiAgfVxuXG4gIHZpc2l0QW5pbWF0ZVJlZihhc3Q6IEFuaW1hdGVSZWZBc3QsIGNvbnRleHQ6IEFuaW1hdGlvblRpbWVsaW5lQ29udGV4dCk6IGFueSB7XG4gICAgY29uc3QgaW5uZXJDb250ZXh0ID0gY29udGV4dC5jcmVhdGVTdWJDb250ZXh0KGFzdC5vcHRpb25zKTtcbiAgICBpbm5lckNvbnRleHQudHJhbnNmb3JtSW50b05ld1RpbWVsaW5lKCk7XG4gICAgdGhpcy52aXNpdFJlZmVyZW5jZShhc3QuYW5pbWF0aW9uLCBpbm5lckNvbnRleHQpO1xuICAgIGNvbnRleHQudHJhbnNmb3JtSW50b05ld1RpbWVsaW5lKGlubmVyQ29udGV4dC5jdXJyZW50VGltZWxpbmUuY3VycmVudFRpbWUpO1xuICAgIGNvbnRleHQucHJldmlvdXNOb2RlID0gYXN0O1xuICB9XG5cbiAgcHJpdmF0ZSBfdmlzaXRTdWJJbnN0cnVjdGlvbnMoXG4gICAgICBpbnN0cnVjdGlvbnM6IEFuaW1hdGlvblRpbWVsaW5lSW5zdHJ1Y3Rpb25bXSwgY29udGV4dDogQW5pbWF0aW9uVGltZWxpbmVDb250ZXh0LFxuICAgICAgb3B0aW9uczogQW5pbWF0ZUNoaWxkT3B0aW9ucyk6IG51bWJlciB7XG4gICAgY29uc3Qgc3RhcnRUaW1lID0gY29udGV4dC5jdXJyZW50VGltZWxpbmUuY3VycmVudFRpbWU7XG4gICAgbGV0IGZ1cnRoZXN0VGltZSA9IHN0YXJ0VGltZTtcblxuICAgIC8vIHRoaXMgaXMgYSBzcGVjaWFsLWNhc2UgZm9yIHdoZW4gYSB1c2VyIHdhbnRzIHRvIHNraXAgYSBzdWJcbiAgICAvLyBhbmltYXRpb24gZnJvbSBiZWluZyBmaXJlZCBlbnRpcmVseS5cbiAgICBjb25zdCBkdXJhdGlvbiA9IG9wdGlvbnMuZHVyYXRpb24gIT0gbnVsbCA/IHJlc29sdmVUaW1pbmdWYWx1ZShvcHRpb25zLmR1cmF0aW9uKSA6IG51bGw7XG4gICAgY29uc3QgZGVsYXkgPSBvcHRpb25zLmRlbGF5ICE9IG51bGwgPyByZXNvbHZlVGltaW5nVmFsdWUob3B0aW9ucy5kZWxheSkgOiBudWxsO1xuICAgIGlmIChkdXJhdGlvbiAhPT0gMCkge1xuICAgICAgaW5zdHJ1Y3Rpb25zLmZvckVhY2goaW5zdHJ1Y3Rpb24gPT4ge1xuICAgICAgICBjb25zdCBpbnN0cnVjdGlvblRpbWluZ3MgPVxuICAgICAgICAgICAgY29udGV4dC5hcHBlbmRJbnN0cnVjdGlvblRvVGltZWxpbmUoaW5zdHJ1Y3Rpb24sIGR1cmF0aW9uLCBkZWxheSk7XG4gICAgICAgIGZ1cnRoZXN0VGltZSA9XG4gICAgICAgICAgICBNYXRoLm1heChmdXJ0aGVzdFRpbWUsIGluc3RydWN0aW9uVGltaW5ncy5kdXJhdGlvbiArIGluc3RydWN0aW9uVGltaW5ncy5kZWxheSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVydGhlc3RUaW1lO1xuICB9XG5cbiAgdmlzaXRSZWZlcmVuY2UoYXN0OiBSZWZlcmVuY2VBc3QsIGNvbnRleHQ6IEFuaW1hdGlvblRpbWVsaW5lQ29udGV4dCkge1xuICAgIGNvbnRleHQudXBkYXRlT3B0aW9ucyhhc3Qub3B0aW9ucywgdHJ1ZSk7XG4gICAgdmlzaXREc2xOb2RlKHRoaXMsIGFzdC5hbmltYXRpb24sIGNvbnRleHQpO1xuICAgIGNvbnRleHQucHJldmlvdXNOb2RlID0gYXN0O1xuICB9XG5cbiAgdmlzaXRTZXF1ZW5jZShhc3Q6IFNlcXVlbmNlQXN0LCBjb250ZXh0OiBBbmltYXRpb25UaW1lbGluZUNvbnRleHQpIHtcbiAgICBjb25zdCBzdWJDb250ZXh0Q291bnQgPSBjb250ZXh0LnN1YkNvbnRleHRDb3VudDtcbiAgICBsZXQgY3R4ID0gY29udGV4dDtcbiAgICBjb25zdCBvcHRpb25zID0gYXN0Lm9wdGlvbnM7XG5cbiAgICBpZiAob3B0aW9ucyAmJiAob3B0aW9ucy5wYXJhbXMgfHwgb3B0aW9ucy5kZWxheSkpIHtcbiAgICAgIGN0eCA9IGNvbnRleHQuY3JlYXRlU3ViQ29udGV4dChvcHRpb25zKTtcbiAgICAgIGN0eC50cmFuc2Zvcm1JbnRvTmV3VGltZWxpbmUoKTtcblxuICAgICAgaWYgKG9wdGlvbnMuZGVsYXkgIT0gbnVsbCkge1xuICAgICAgICBpZiAoY3R4LnByZXZpb3VzTm9kZS50eXBlID09IEFuaW1hdGlvbk1ldGFkYXRhVHlwZS5TdHlsZSkge1xuICAgICAgICAgIGN0eC5jdXJyZW50VGltZWxpbmUuc25hcHNob3RDdXJyZW50U3R5bGVzKCk7XG4gICAgICAgICAgY3R4LnByZXZpb3VzTm9kZSA9IERFRkFVTFRfTk9PUF9QUkVWSU9VU19OT0RFO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGVsYXkgPSByZXNvbHZlVGltaW5nVmFsdWUob3B0aW9ucy5kZWxheSk7XG4gICAgICAgIGN0eC5kZWxheU5leHRTdGVwKGRlbGF5KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYXN0LnN0ZXBzLmxlbmd0aCkge1xuICAgICAgYXN0LnN0ZXBzLmZvckVhY2gocyA9PiB2aXNpdERzbE5vZGUodGhpcywgcywgY3R4KSk7XG5cbiAgICAgIC8vIHRoaXMgaXMgaGVyZSBqdXN0IGluY2FzZSB0aGUgaW5uZXIgc3RlcHMgb25seSBjb250YWluIG9yIGVuZCB3aXRoIGEgc3R5bGUoKSBjYWxsXG4gICAgICBjdHguY3VycmVudFRpbWVsaW5lLmFwcGx5U3R5bGVzVG9LZXlmcmFtZSgpO1xuXG4gICAgICAvLyB0aGlzIG1lYW5zIHRoYXQgc29tZSBhbmltYXRpb24gZnVuY3Rpb24gd2l0aGluIHRoZSBzZXF1ZW5jZVxuICAgICAgLy8gZW5kZWQgdXAgY3JlYXRpbmcgYSBzdWIgdGltZWxpbmUgKHdoaWNoIG1lYW5zIHRoZSBjdXJyZW50XG4gICAgICAvLyB0aW1lbGluZSBjYW5ub3Qgb3ZlcmxhcCB3aXRoIHRoZSBjb250ZW50cyBvZiB0aGUgc2VxdWVuY2UpXG4gICAgICBpZiAoY3R4LnN1YkNvbnRleHRDb3VudCA+IHN1YkNvbnRleHRDb3VudCkge1xuICAgICAgICBjdHgudHJhbnNmb3JtSW50b05ld1RpbWVsaW5lKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29udGV4dC5wcmV2aW91c05vZGUgPSBhc3Q7XG4gIH1cblxuICB2aXNpdEdyb3VwKGFzdDogR3JvdXBBc3QsIGNvbnRleHQ6IEFuaW1hdGlvblRpbWVsaW5lQ29udGV4dCkge1xuICAgIGNvbnN0IGlubmVyVGltZWxpbmVzOiBUaW1lbGluZUJ1aWxkZXJbXSA9IFtdO1xuICAgIGxldCBmdXJ0aGVzdFRpbWUgPSBjb250ZXh0LmN1cnJlbnRUaW1lbGluZS5jdXJyZW50VGltZTtcbiAgICBjb25zdCBkZWxheSA9IGFzdC5vcHRpb25zICYmIGFzdC5vcHRpb25zLmRlbGF5ID8gcmVzb2x2ZVRpbWluZ1ZhbHVlKGFzdC5vcHRpb25zLmRlbGF5KSA6IDA7XG5cbiAgICBhc3Quc3RlcHMuZm9yRWFjaChzID0+IHtcbiAgICAgIGNvbnN0IGlubmVyQ29udGV4dCA9IGNvbnRleHQuY3JlYXRlU3ViQ29udGV4dChhc3Qub3B0aW9ucyk7XG4gICAgICBpZiAoZGVsYXkpIHtcbiAgICAgICAgaW5uZXJDb250ZXh0LmRlbGF5TmV4dFN0ZXAoZGVsYXkpO1xuICAgICAgfVxuXG4gICAgICB2aXNpdERzbE5vZGUodGhpcywgcywgaW5uZXJDb250ZXh0KTtcbiAgICAgIGZ1cnRoZXN0VGltZSA9IE1hdGgubWF4KGZ1cnRoZXN0VGltZSwgaW5uZXJDb250ZXh0LmN1cnJlbnRUaW1lbGluZS5jdXJyZW50VGltZSk7XG4gICAgICBpbm5lclRpbWVsaW5lcy5wdXNoKGlubmVyQ29udGV4dC5jdXJyZW50VGltZWxpbmUpO1xuICAgIH0pO1xuXG4gICAgLy8gdGhpcyBvcGVyYXRpb24gaXMgcnVuIGFmdGVyIHRoZSBBU1QgbG9vcCBiZWNhdXNlIG90aGVyd2lzZVxuICAgIC8vIGlmIHRoZSBwYXJlbnQgdGltZWxpbmUncyBjb2xsZWN0ZWQgc3R5bGVzIHdlcmUgdXBkYXRlZCB0aGVuXG4gICAgLy8gaXQgd291bGQgcGFzcyBpbiBpbnZhbGlkIGRhdGEgaW50byB0aGUgbmV3LXRvLWJlIGZvcmtlZCBpdGVtc1xuICAgIGlubmVyVGltZWxpbmVzLmZvckVhY2goXG4gICAgICAgIHRpbWVsaW5lID0+IGNvbnRleHQuY3VycmVudFRpbWVsaW5lLm1lcmdlVGltZWxpbmVDb2xsZWN0ZWRTdHlsZXModGltZWxpbmUpKTtcbiAgICBjb250ZXh0LnRyYW5zZm9ybUludG9OZXdUaW1lbGluZShmdXJ0aGVzdFRpbWUpO1xuICAgIGNvbnRleHQucHJldmlvdXNOb2RlID0gYXN0O1xuICB9XG5cbiAgcHJpdmF0ZSBfdmlzaXRUaW1pbmcoYXN0OiBUaW1pbmdBc3QsIGNvbnRleHQ6IEFuaW1hdGlvblRpbWVsaW5lQ29udGV4dCk6IEFuaW1hdGVUaW1pbmdzIHtcbiAgICBpZiAoKGFzdCBhcyBEeW5hbWljVGltaW5nQXN0KS5keW5hbWljKSB7XG4gICAgICBjb25zdCBzdHJWYWx1ZSA9IChhc3QgYXMgRHluYW1pY1RpbWluZ0FzdCkuc3RyVmFsdWU7XG4gICAgICBjb25zdCB0aW1pbmdWYWx1ZSA9XG4gICAgICAgICAgY29udGV4dC5wYXJhbXMgPyBpbnRlcnBvbGF0ZVBhcmFtcyhzdHJWYWx1ZSwgY29udGV4dC5wYXJhbXMsIGNvbnRleHQuZXJyb3JzKSA6IHN0clZhbHVlO1xuICAgICAgcmV0dXJuIHJlc29sdmVUaW1pbmcodGltaW5nVmFsdWUsIGNvbnRleHQuZXJyb3JzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtkdXJhdGlvbjogYXN0LmR1cmF0aW9uLCBkZWxheTogYXN0LmRlbGF5LCBlYXNpbmc6IGFzdC5lYXNpbmd9O1xuICAgIH1cbiAgfVxuXG4gIHZpc2l0QW5pbWF0ZShhc3Q6IEFuaW1hdGVBc3QsIGNvbnRleHQ6IEFuaW1hdGlvblRpbWVsaW5lQ29udGV4dCkge1xuICAgIGNvbnN0IHRpbWluZ3MgPSBjb250ZXh0LmN1cnJlbnRBbmltYXRlVGltaW5ncyA9IHRoaXMuX3Zpc2l0VGltaW5nKGFzdC50aW1pbmdzLCBjb250ZXh0KTtcbiAgICBjb25zdCB0aW1lbGluZSA9IGNvbnRleHQuY3VycmVudFRpbWVsaW5lO1xuICAgIGlmICh0aW1pbmdzLmRlbGF5KSB7XG4gICAgICBjb250ZXh0LmluY3JlbWVudFRpbWUodGltaW5ncy5kZWxheSk7XG4gICAgICB0aW1lbGluZS5zbmFwc2hvdEN1cnJlbnRTdHlsZXMoKTtcbiAgICB9XG5cbiAgICBjb25zdCBzdHlsZSA9IGFzdC5zdHlsZTtcbiAgICBpZiAoc3R5bGUudHlwZSA9PSBBbmltYXRpb25NZXRhZGF0YVR5cGUuS2V5ZnJhbWVzKSB7XG4gICAgICB0aGlzLnZpc2l0S2V5ZnJhbWVzKHN0eWxlLCBjb250ZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29udGV4dC5pbmNyZW1lbnRUaW1lKHRpbWluZ3MuZHVyYXRpb24pO1xuICAgICAgdGhpcy52aXNpdFN0eWxlKHN0eWxlIGFzIFN0eWxlQXN0LCBjb250ZXh0KTtcbiAgICAgIHRpbWVsaW5lLmFwcGx5U3R5bGVzVG9LZXlmcmFtZSgpO1xuICAgIH1cblxuICAgIGNvbnRleHQuY3VycmVudEFuaW1hdGVUaW1pbmdzID0gbnVsbDtcbiAgICBjb250ZXh0LnByZXZpb3VzTm9kZSA9IGFzdDtcbiAgfVxuXG4gIHZpc2l0U3R5bGUoYXN0OiBTdHlsZUFzdCwgY29udGV4dDogQW5pbWF0aW9uVGltZWxpbmVDb250ZXh0KSB7XG4gICAgY29uc3QgdGltZWxpbmUgPSBjb250ZXh0LmN1cnJlbnRUaW1lbGluZTtcbiAgICBjb25zdCB0aW1pbmdzID0gY29udGV4dC5jdXJyZW50QW5pbWF0ZVRpbWluZ3MgITtcblxuICAgIC8vIHRoaXMgaXMgYSBzcGVjaWFsIGNhc2UgZm9yIHdoZW4gYSBzdHlsZSgpIGNhbGxcbiAgICAvLyBkaXJlY3RseSBmb2xsb3dzICBhbiBhbmltYXRlKCkgY2FsbCAoYnV0IG5vdCBpbnNpZGUgb2YgYW4gYW5pbWF0ZSgpIGNhbGwpXG4gICAgaWYgKCF0aW1pbmdzICYmIHRpbWVsaW5lLmdldEN1cnJlbnRTdHlsZVByb3BlcnRpZXMoKS5sZW5ndGgpIHtcbiAgICAgIHRpbWVsaW5lLmZvcndhcmRGcmFtZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IGVhc2luZyA9ICh0aW1pbmdzICYmIHRpbWluZ3MuZWFzaW5nKSB8fCBhc3QuZWFzaW5nO1xuICAgIGlmIChhc3QuaXNFbXB0eVN0ZXApIHtcbiAgICAgIHRpbWVsaW5lLmFwcGx5RW1wdHlTdGVwKGVhc2luZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRpbWVsaW5lLnNldFN0eWxlcyhhc3Quc3R5bGVzLCBlYXNpbmcsIGNvbnRleHQuZXJyb3JzLCBjb250ZXh0Lm9wdGlvbnMpO1xuICAgIH1cblxuICAgIGNvbnRleHQucHJldmlvdXNOb2RlID0gYXN0O1xuICB9XG5cbiAgdmlzaXRLZXlmcmFtZXMoYXN0OiBLZXlmcmFtZXNBc3QsIGNvbnRleHQ6IEFuaW1hdGlvblRpbWVsaW5lQ29udGV4dCkge1xuICAgIGNvbnN0IGN1cnJlbnRBbmltYXRlVGltaW5ncyA9IGNvbnRleHQuY3VycmVudEFuaW1hdGVUaW1pbmdzICE7XG4gICAgY29uc3Qgc3RhcnRUaW1lID0gKGNvbnRleHQuY3VycmVudFRpbWVsaW5lICEpLmR1cmF0aW9uO1xuICAgIGNvbnN0IGR1cmF0aW9uID0gY3VycmVudEFuaW1hdGVUaW1pbmdzLmR1cmF0aW9uO1xuICAgIGNvbnN0IGlubmVyQ29udGV4dCA9IGNvbnRleHQuY3JlYXRlU3ViQ29udGV4dCgpO1xuICAgIGNvbnN0IGlubmVyVGltZWxpbmUgPSBpbm5lckNvbnRleHQuY3VycmVudFRpbWVsaW5lO1xuICAgIGlubmVyVGltZWxpbmUuZWFzaW5nID0gY3VycmVudEFuaW1hdGVUaW1pbmdzLmVhc2luZztcblxuICAgIGFzdC5zdHlsZXMuZm9yRWFjaChzdGVwID0+IHtcbiAgICAgIGNvbnN0IG9mZnNldDogbnVtYmVyID0gc3RlcC5vZmZzZXQgfHwgMDtcbiAgICAgIGlubmVyVGltZWxpbmUuZm9yd2FyZFRpbWUob2Zmc2V0ICogZHVyYXRpb24pO1xuICAgICAgaW5uZXJUaW1lbGluZS5zZXRTdHlsZXMoc3RlcC5zdHlsZXMsIHN0ZXAuZWFzaW5nLCBjb250ZXh0LmVycm9ycywgY29udGV4dC5vcHRpb25zKTtcbiAgICAgIGlubmVyVGltZWxpbmUuYXBwbHlTdHlsZXNUb0tleWZyYW1lKCk7XG4gICAgfSk7XG5cbiAgICAvLyB0aGlzIHdpbGwgZW5zdXJlIHRoYXQgdGhlIHBhcmVudCB0aW1lbGluZSBnZXRzIGFsbCB0aGUgc3R5bGVzIGZyb21cbiAgICAvLyB0aGUgY2hpbGQgZXZlbiBpZiB0aGUgbmV3IHRpbWVsaW5lIGJlbG93IGlzIG5vdCB1c2VkXG4gICAgY29udGV4dC5jdXJyZW50VGltZWxpbmUubWVyZ2VUaW1lbGluZUNvbGxlY3RlZFN0eWxlcyhpbm5lclRpbWVsaW5lKTtcblxuICAgIC8vIHdlIGRvIHRoaXMgYmVjYXVzZSB0aGUgd2luZG93IGJldHdlZW4gdGhpcyB0aW1lbGluZSBhbmQgdGhlIHN1YiB0aW1lbGluZVxuICAgIC8vIHNob3VsZCBlbnN1cmUgdGhhdCB0aGUgc3R5bGVzIHdpdGhpbiBhcmUgZXhhY3RseSB0aGUgc2FtZSBhcyB0aGV5IHdlcmUgYmVmb3JlXG4gICAgY29udGV4dC50cmFuc2Zvcm1JbnRvTmV3VGltZWxpbmUoc3RhcnRUaW1lICsgZHVyYXRpb24pO1xuICAgIGNvbnRleHQucHJldmlvdXNOb2RlID0gYXN0O1xuICB9XG5cbiAgdmlzaXRRdWVyeShhc3Q6IFF1ZXJ5QXN0LCBjb250ZXh0OiBBbmltYXRpb25UaW1lbGluZUNvbnRleHQpIHtcbiAgICAvLyBpbiB0aGUgZXZlbnQgdGhhdCB0aGUgZmlyc3Qgc3RlcCBiZWZvcmUgdGhpcyBpcyBhIHN0eWxlIHN0ZXAgd2UgbmVlZFxuICAgIC8vIHRvIGVuc3VyZSB0aGUgc3R5bGVzIGFyZSBhcHBsaWVkIGJlZm9yZSB0aGUgY2hpbGRyZW4gYXJlIGFuaW1hdGVkXG4gICAgY29uc3Qgc3RhcnRUaW1lID0gY29udGV4dC5jdXJyZW50VGltZWxpbmUuY3VycmVudFRpbWU7XG4gICAgY29uc3Qgb3B0aW9ucyA9IChhc3Qub3B0aW9ucyB8fCB7fSkgYXMgQW5pbWF0aW9uUXVlcnlPcHRpb25zO1xuICAgIGNvbnN0IGRlbGF5ID0gb3B0aW9ucy5kZWxheSA/IHJlc29sdmVUaW1pbmdWYWx1ZShvcHRpb25zLmRlbGF5KSA6IDA7XG5cbiAgICBpZiAoZGVsYXkgJiYgKGNvbnRleHQucHJldmlvdXNOb2RlLnR5cGUgPT09IEFuaW1hdGlvbk1ldGFkYXRhVHlwZS5TdHlsZSB8fFxuICAgICAgICAgICAgICAgICAgKHN0YXJ0VGltZSA9PSAwICYmIGNvbnRleHQuY3VycmVudFRpbWVsaW5lLmdldEN1cnJlbnRTdHlsZVByb3BlcnRpZXMoKS5sZW5ndGgpKSkge1xuICAgICAgY29udGV4dC5jdXJyZW50VGltZWxpbmUuc25hcHNob3RDdXJyZW50U3R5bGVzKCk7XG4gICAgICBjb250ZXh0LnByZXZpb3VzTm9kZSA9IERFRkFVTFRfTk9PUF9QUkVWSU9VU19OT0RFO1xuICAgIH1cblxuICAgIGxldCBmdXJ0aGVzdFRpbWUgPSBzdGFydFRpbWU7XG4gICAgY29uc3QgZWxtcyA9IGNvbnRleHQuaW52b2tlUXVlcnkoXG4gICAgICAgIGFzdC5zZWxlY3RvciwgYXN0Lm9yaWdpbmFsU2VsZWN0b3IsIGFzdC5saW1pdCwgYXN0LmluY2x1ZGVTZWxmLFxuICAgICAgICBvcHRpb25zLm9wdGlvbmFsID8gdHJ1ZSA6IGZhbHNlLCBjb250ZXh0LmVycm9ycyk7XG5cbiAgICBjb250ZXh0LmN1cnJlbnRRdWVyeVRvdGFsID0gZWxtcy5sZW5ndGg7XG4gICAgbGV0IHNhbWVFbGVtZW50VGltZWxpbmU6IFRpbWVsaW5lQnVpbGRlcnxudWxsID0gbnVsbDtcbiAgICBlbG1zLmZvckVhY2goKGVsZW1lbnQsIGkpID0+IHtcblxuICAgICAgY29udGV4dC5jdXJyZW50UXVlcnlJbmRleCA9IGk7XG4gICAgICBjb25zdCBpbm5lckNvbnRleHQgPSBjb250ZXh0LmNyZWF0ZVN1YkNvbnRleHQoYXN0Lm9wdGlvbnMsIGVsZW1lbnQpO1xuICAgICAgaWYgKGRlbGF5KSB7XG4gICAgICAgIGlubmVyQ29udGV4dC5kZWxheU5leHRTdGVwKGRlbGF5KTtcbiAgICAgIH1cblxuICAgICAgaWYgKGVsZW1lbnQgPT09IGNvbnRleHQuZWxlbWVudCkge1xuICAgICAgICBzYW1lRWxlbWVudFRpbWVsaW5lID0gaW5uZXJDb250ZXh0LmN1cnJlbnRUaW1lbGluZTtcbiAgICAgIH1cblxuICAgICAgdmlzaXREc2xOb2RlKHRoaXMsIGFzdC5hbmltYXRpb24sIGlubmVyQ29udGV4dCk7XG5cbiAgICAgIC8vIHRoaXMgaXMgaGVyZSBqdXN0IGluY2FzZSB0aGUgaW5uZXIgc3RlcHMgb25seSBjb250YWluIG9yIGVuZFxuICAgICAgLy8gd2l0aCBhIHN0eWxlKCkgY2FsbCAod2hpY2ggaXMgaGVyZSB0byBzaWduYWwgdGhhdCB0aGlzIGlzIGEgcHJlcGFyYXRvcnlcbiAgICAgIC8vIGNhbGwgdG8gc3R5bGUgYW4gZWxlbWVudCBiZWZvcmUgaXQgaXMgYW5pbWF0ZWQgYWdhaW4pXG4gICAgICBpbm5lckNvbnRleHQuY3VycmVudFRpbWVsaW5lLmFwcGx5U3R5bGVzVG9LZXlmcmFtZSgpO1xuXG4gICAgICBjb25zdCBlbmRUaW1lID0gaW5uZXJDb250ZXh0LmN1cnJlbnRUaW1lbGluZS5jdXJyZW50VGltZTtcbiAgICAgIGZ1cnRoZXN0VGltZSA9IE1hdGgubWF4KGZ1cnRoZXN0VGltZSwgZW5kVGltZSk7XG4gICAgfSk7XG5cbiAgICBjb250ZXh0LmN1cnJlbnRRdWVyeUluZGV4ID0gMDtcbiAgICBjb250ZXh0LmN1cnJlbnRRdWVyeVRvdGFsID0gMDtcbiAgICBjb250ZXh0LnRyYW5zZm9ybUludG9OZXdUaW1lbGluZShmdXJ0aGVzdFRpbWUpO1xuXG4gICAgaWYgKHNhbWVFbGVtZW50VGltZWxpbmUpIHtcbiAgICAgIGNvbnRleHQuY3VycmVudFRpbWVsaW5lLm1lcmdlVGltZWxpbmVDb2xsZWN0ZWRTdHlsZXMoc2FtZUVsZW1lbnRUaW1lbGluZSk7XG4gICAgICBjb250ZXh0LmN1cnJlbnRUaW1lbGluZS5zbmFwc2hvdEN1cnJlbnRTdHlsZXMoKTtcbiAgICB9XG5cbiAgICBjb250ZXh0LnByZXZpb3VzTm9kZSA9IGFzdDtcbiAgfVxuXG4gIHZpc2l0U3RhZ2dlcihhc3Q6IFN0YWdnZXJBc3QsIGNvbnRleHQ6IEFuaW1hdGlvblRpbWVsaW5lQ29udGV4dCkge1xuICAgIGNvbnN0IHBhcmVudENvbnRleHQgPSBjb250ZXh0LnBhcmVudENvbnRleHQgITtcbiAgICBjb25zdCB0bCA9IGNvbnRleHQuY3VycmVudFRpbWVsaW5lO1xuICAgIGNvbnN0IHRpbWluZ3MgPSBhc3QudGltaW5ncztcbiAgICBjb25zdCBkdXJhdGlvbiA9IE1hdGguYWJzKHRpbWluZ3MuZHVyYXRpb24pO1xuICAgIGNvbnN0IG1heFRpbWUgPSBkdXJhdGlvbiAqIChjb250ZXh0LmN1cnJlbnRRdWVyeVRvdGFsIC0gMSk7XG4gICAgbGV0IGRlbGF5ID0gZHVyYXRpb24gKiBjb250ZXh0LmN1cnJlbnRRdWVyeUluZGV4O1xuXG4gICAgbGV0IHN0YWdnZXJUcmFuc2Zvcm1lciA9IHRpbWluZ3MuZHVyYXRpb24gPCAwID8gJ3JldmVyc2UnIDogdGltaW5ncy5lYXNpbmc7XG4gICAgc3dpdGNoIChzdGFnZ2VyVHJhbnNmb3JtZXIpIHtcbiAgICAgIGNhc2UgJ3JldmVyc2UnOlxuICAgICAgICBkZWxheSA9IG1heFRpbWUgLSBkZWxheTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdmdWxsJzpcbiAgICAgICAgZGVsYXkgPSBwYXJlbnRDb250ZXh0LmN1cnJlbnRTdGFnZ2VyVGltZTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgY29uc3QgdGltZWxpbmUgPSBjb250ZXh0LmN1cnJlbnRUaW1lbGluZTtcbiAgICBpZiAoZGVsYXkpIHtcbiAgICAgIHRpbWVsaW5lLmRlbGF5TmV4dFN0ZXAoZGVsYXkpO1xuICAgIH1cblxuICAgIGNvbnN0IHN0YXJ0aW5nVGltZSA9IHRpbWVsaW5lLmN1cnJlbnRUaW1lO1xuICAgIHZpc2l0RHNsTm9kZSh0aGlzLCBhc3QuYW5pbWF0aW9uLCBjb250ZXh0KTtcbiAgICBjb250ZXh0LnByZXZpb3VzTm9kZSA9IGFzdDtcblxuICAgIC8vIHRpbWUgPSBkdXJhdGlvbiArIGRlbGF5XG4gICAgLy8gdGhlIHJlYXNvbiB3aHkgdGhpcyBjb21wdXRhdGlvbiBpcyBzbyBjb21wbGV4IGlzIGJlY2F1c2VcbiAgICAvLyB0aGUgaW5uZXIgdGltZWxpbmUgbWF5IGVpdGhlciBoYXZlIGEgZGVsYXkgdmFsdWUgb3IgYSBzdHJldGNoZWRcbiAgICAvLyBrZXlmcmFtZSBkZXBlbmRpbmcgb24gaWYgYSBzdWJ0aW1lbGluZSBpcyBub3QgdXNlZCBvciBpcyB1c2VkLlxuICAgIHBhcmVudENvbnRleHQuY3VycmVudFN0YWdnZXJUaW1lID1cbiAgICAgICAgKHRsLmN1cnJlbnRUaW1lIC0gc3RhcnRpbmdUaW1lKSArICh0bC5zdGFydFRpbWUgLSBwYXJlbnRDb250ZXh0LmN1cnJlbnRUaW1lbGluZS5zdGFydFRpbWUpO1xuICB9XG59XG5cbmV4cG9ydCBkZWNsYXJlIHR5cGUgU3R5bGVBdFRpbWUgPSB7XG4gIHRpbWU6IG51bWJlcjsgdmFsdWU6IHN0cmluZyB8IG51bWJlcjtcbn07XG5cbmNvbnN0IERFRkFVTFRfTk9PUF9QUkVWSU9VU19OT0RFID0gPEFzdDxBbmltYXRpb25NZXRhZGF0YVR5cGU+Pnt9O1xuZXhwb3J0IGNsYXNzIEFuaW1hdGlvblRpbWVsaW5lQ29udGV4dCB7XG4gIHB1YmxpYyBwYXJlbnRDb250ZXh0OiBBbmltYXRpb25UaW1lbGluZUNvbnRleHR8bnVsbCA9IG51bGw7XG4gIHB1YmxpYyBjdXJyZW50VGltZWxpbmU6IFRpbWVsaW5lQnVpbGRlcjtcbiAgcHVibGljIGN1cnJlbnRBbmltYXRlVGltaW5nczogQW5pbWF0ZVRpbWluZ3N8bnVsbCA9IG51bGw7XG4gIHB1YmxpYyBwcmV2aW91c05vZGU6IEFzdDxBbmltYXRpb25NZXRhZGF0YVR5cGU+ID0gREVGQVVMVF9OT09QX1BSRVZJT1VTX05PREU7XG4gIHB1YmxpYyBzdWJDb250ZXh0Q291bnQgPSAwO1xuICBwdWJsaWMgb3B0aW9uczogQW5pbWF0aW9uT3B0aW9ucyA9IHt9O1xuICBwdWJsaWMgY3VycmVudFF1ZXJ5SW5kZXg6IG51bWJlciA9IDA7XG4gIHB1YmxpYyBjdXJyZW50UXVlcnlUb3RhbDogbnVtYmVyID0gMDtcbiAgcHVibGljIGN1cnJlbnRTdGFnZ2VyVGltZTogbnVtYmVyID0gMDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgX2RyaXZlcjogQW5pbWF0aW9uRHJpdmVyLCBwdWJsaWMgZWxlbWVudDogYW55LFxuICAgICAgcHVibGljIHN1Ykluc3RydWN0aW9uczogRWxlbWVudEluc3RydWN0aW9uTWFwLCBwcml2YXRlIF9lbnRlckNsYXNzTmFtZTogc3RyaW5nLFxuICAgICAgcHJpdmF0ZSBfbGVhdmVDbGFzc05hbWU6IHN0cmluZywgcHVibGljIGVycm9yczogYW55W10sIHB1YmxpYyB0aW1lbGluZXM6IFRpbWVsaW5lQnVpbGRlcltdLFxuICAgICAgaW5pdGlhbFRpbWVsaW5lPzogVGltZWxpbmVCdWlsZGVyKSB7XG4gICAgdGhpcy5jdXJyZW50VGltZWxpbmUgPSBpbml0aWFsVGltZWxpbmUgfHwgbmV3IFRpbWVsaW5lQnVpbGRlcih0aGlzLl9kcml2ZXIsIGVsZW1lbnQsIDApO1xuICAgIHRpbWVsaW5lcy5wdXNoKHRoaXMuY3VycmVudFRpbWVsaW5lKTtcbiAgfVxuXG4gIGdldCBwYXJhbXMoKSB7IHJldHVybiB0aGlzLm9wdGlvbnMucGFyYW1zOyB9XG5cbiAgdXBkYXRlT3B0aW9ucyhvcHRpb25zOiBBbmltYXRpb25PcHRpb25zfG51bGwsIHNraXBJZkV4aXN0cz86IGJvb2xlYW4pIHtcbiAgICBpZiAoIW9wdGlvbnMpIHJldHVybjtcblxuICAgIGNvbnN0IG5ld09wdGlvbnMgPSBvcHRpb25zIGFzIGFueTtcbiAgICBsZXQgb3B0aW9uc1RvVXBkYXRlID0gdGhpcy5vcHRpb25zO1xuXG4gICAgLy8gTk9URTogdGhpcyB3aWxsIGdldCBwYXRjaGVkIHVwIHdoZW4gb3RoZXIgYW5pbWF0aW9uIG1ldGhvZHMgc3VwcG9ydCBkdXJhdGlvbiBvdmVycmlkZXNcbiAgICBpZiAobmV3T3B0aW9ucy5kdXJhdGlvbiAhPSBudWxsKSB7XG4gICAgICAob3B0aW9uc1RvVXBkYXRlIGFzIGFueSkuZHVyYXRpb24gPSByZXNvbHZlVGltaW5nVmFsdWUobmV3T3B0aW9ucy5kdXJhdGlvbik7XG4gICAgfVxuXG4gICAgaWYgKG5ld09wdGlvbnMuZGVsYXkgIT0gbnVsbCkge1xuICAgICAgb3B0aW9uc1RvVXBkYXRlLmRlbGF5ID0gcmVzb2x2ZVRpbWluZ1ZhbHVlKG5ld09wdGlvbnMuZGVsYXkpO1xuICAgIH1cblxuICAgIGNvbnN0IG5ld1BhcmFtcyA9IG5ld09wdGlvbnMucGFyYW1zO1xuICAgIGlmIChuZXdQYXJhbXMpIHtcbiAgICAgIGxldCBwYXJhbXNUb1VwZGF0ZToge1tuYW1lOiBzdHJpbmddOiBhbnl9ID0gb3B0aW9uc1RvVXBkYXRlLnBhcmFtcyAhO1xuICAgICAgaWYgKCFwYXJhbXNUb1VwZGF0ZSkge1xuICAgICAgICBwYXJhbXNUb1VwZGF0ZSA9IHRoaXMub3B0aW9ucy5wYXJhbXMgPSB7fTtcbiAgICAgIH1cblxuICAgICAgT2JqZWN0LmtleXMobmV3UGFyYW1zKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgICBpZiAoIXNraXBJZkV4aXN0cyB8fCAhcGFyYW1zVG9VcGRhdGUuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgICBwYXJhbXNUb1VwZGF0ZVtuYW1lXSA9IGludGVycG9sYXRlUGFyYW1zKG5ld1BhcmFtc1tuYW1lXSwgcGFyYW1zVG9VcGRhdGUsIHRoaXMuZXJyb3JzKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfY29weU9wdGlvbnMoKSB7XG4gICAgY29uc3Qgb3B0aW9uczogQW5pbWF0aW9uT3B0aW9ucyA9IHt9O1xuICAgIGlmICh0aGlzLm9wdGlvbnMpIHtcbiAgICAgIGNvbnN0IG9sZFBhcmFtcyA9IHRoaXMub3B0aW9ucy5wYXJhbXM7XG4gICAgICBpZiAob2xkUGFyYW1zKSB7XG4gICAgICAgIGNvbnN0IHBhcmFtczoge1tuYW1lOiBzdHJpbmddOiBhbnl9ID0gb3B0aW9uc1sncGFyYW1zJ10gPSB7fTtcbiAgICAgICAgT2JqZWN0LmtleXMob2xkUGFyYW1zKS5mb3JFYWNoKG5hbWUgPT4geyBwYXJhbXNbbmFtZV0gPSBvbGRQYXJhbXNbbmFtZV07IH0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3B0aW9ucztcbiAgfVxuXG4gIGNyZWF0ZVN1YkNvbnRleHQob3B0aW9uczogQW5pbWF0aW9uT3B0aW9uc3xudWxsID0gbnVsbCwgZWxlbWVudD86IGFueSwgbmV3VGltZT86IG51bWJlcik6XG4gICAgICBBbmltYXRpb25UaW1lbGluZUNvbnRleHQge1xuICAgIGNvbnN0IHRhcmdldCA9IGVsZW1lbnQgfHwgdGhpcy5lbGVtZW50O1xuICAgIGNvbnN0IGNvbnRleHQgPSBuZXcgQW5pbWF0aW9uVGltZWxpbmVDb250ZXh0KFxuICAgICAgICB0aGlzLl9kcml2ZXIsIHRhcmdldCwgdGhpcy5zdWJJbnN0cnVjdGlvbnMsIHRoaXMuX2VudGVyQ2xhc3NOYW1lLCB0aGlzLl9sZWF2ZUNsYXNzTmFtZSxcbiAgICAgICAgdGhpcy5lcnJvcnMsIHRoaXMudGltZWxpbmVzLCB0aGlzLmN1cnJlbnRUaW1lbGluZS5mb3JrKHRhcmdldCwgbmV3VGltZSB8fCAwKSk7XG4gICAgY29udGV4dC5wcmV2aW91c05vZGUgPSB0aGlzLnByZXZpb3VzTm9kZTtcbiAgICBjb250ZXh0LmN1cnJlbnRBbmltYXRlVGltaW5ncyA9IHRoaXMuY3VycmVudEFuaW1hdGVUaW1pbmdzO1xuXG4gICAgY29udGV4dC5vcHRpb25zID0gdGhpcy5fY29weU9wdGlvbnMoKTtcbiAgICBjb250ZXh0LnVwZGF0ZU9wdGlvbnMob3B0aW9ucyk7XG5cbiAgICBjb250ZXh0LmN1cnJlbnRRdWVyeUluZGV4ID0gdGhpcy5jdXJyZW50UXVlcnlJbmRleDtcbiAgICBjb250ZXh0LmN1cnJlbnRRdWVyeVRvdGFsID0gdGhpcy5jdXJyZW50UXVlcnlUb3RhbDtcbiAgICBjb250ZXh0LnBhcmVudENvbnRleHQgPSB0aGlzO1xuICAgIHRoaXMuc3ViQ29udGV4dENvdW50Kys7XG4gICAgcmV0dXJuIGNvbnRleHQ7XG4gIH1cblxuICB0cmFuc2Zvcm1JbnRvTmV3VGltZWxpbmUobmV3VGltZT86IG51bWJlcikge1xuICAgIHRoaXMucHJldmlvdXNOb2RlID0gREVGQVVMVF9OT09QX1BSRVZJT1VTX05PREU7XG4gICAgdGhpcy5jdXJyZW50VGltZWxpbmUgPSB0aGlzLmN1cnJlbnRUaW1lbGluZS5mb3JrKHRoaXMuZWxlbWVudCwgbmV3VGltZSk7XG4gICAgdGhpcy50aW1lbGluZXMucHVzaCh0aGlzLmN1cnJlbnRUaW1lbGluZSk7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudFRpbWVsaW5lO1xuICB9XG5cbiAgYXBwZW5kSW5zdHJ1Y3Rpb25Ub1RpbWVsaW5lKFxuICAgICAgaW5zdHJ1Y3Rpb246IEFuaW1hdGlvblRpbWVsaW5lSW5zdHJ1Y3Rpb24sIGR1cmF0aW9uOiBudW1iZXJ8bnVsbCxcbiAgICAgIGRlbGF5OiBudW1iZXJ8bnVsbCk6IEFuaW1hdGVUaW1pbmdzIHtcbiAgICBjb25zdCB1cGRhdGVkVGltaW5nczogQW5pbWF0ZVRpbWluZ3MgPSB7XG4gICAgICBkdXJhdGlvbjogZHVyYXRpb24gIT0gbnVsbCA/IGR1cmF0aW9uIDogaW5zdHJ1Y3Rpb24uZHVyYXRpb24sXG4gICAgICBkZWxheTogdGhpcy5jdXJyZW50VGltZWxpbmUuY3VycmVudFRpbWUgKyAoZGVsYXkgIT0gbnVsbCA/IGRlbGF5IDogMCkgKyBpbnN0cnVjdGlvbi5kZWxheSxcbiAgICAgIGVhc2luZzogJydcbiAgICB9O1xuICAgIGNvbnN0IGJ1aWxkZXIgPSBuZXcgU3ViVGltZWxpbmVCdWlsZGVyKFxuICAgICAgICB0aGlzLl9kcml2ZXIsIGluc3RydWN0aW9uLmVsZW1lbnQsIGluc3RydWN0aW9uLmtleWZyYW1lcywgaW5zdHJ1Y3Rpb24ucHJlU3R5bGVQcm9wcyxcbiAgICAgICAgaW5zdHJ1Y3Rpb24ucG9zdFN0eWxlUHJvcHMsIHVwZGF0ZWRUaW1pbmdzLCBpbnN0cnVjdGlvbi5zdHJldGNoU3RhcnRpbmdLZXlmcmFtZSk7XG4gICAgdGhpcy50aW1lbGluZXMucHVzaChidWlsZGVyKTtcbiAgICByZXR1cm4gdXBkYXRlZFRpbWluZ3M7XG4gIH1cblxuICBpbmNyZW1lbnRUaW1lKHRpbWU6IG51bWJlcikge1xuICAgIHRoaXMuY3VycmVudFRpbWVsaW5lLmZvcndhcmRUaW1lKHRoaXMuY3VycmVudFRpbWVsaW5lLmR1cmF0aW9uICsgdGltZSk7XG4gIH1cblxuICBkZWxheU5leHRTdGVwKGRlbGF5OiBudW1iZXIpIHtcbiAgICAvLyBuZWdhdGl2ZSBkZWxheXMgYXJlIG5vdCB5ZXQgc3VwcG9ydGVkXG4gICAgaWYgKGRlbGF5ID4gMCkge1xuICAgICAgdGhpcy5jdXJyZW50VGltZWxpbmUuZGVsYXlOZXh0U3RlcChkZWxheSk7XG4gICAgfVxuICB9XG5cbiAgaW52b2tlUXVlcnkoXG4gICAgICBzZWxlY3Rvcjogc3RyaW5nLCBvcmlnaW5hbFNlbGVjdG9yOiBzdHJpbmcsIGxpbWl0OiBudW1iZXIsIGluY2x1ZGVTZWxmOiBib29sZWFuLFxuICAgICAgb3B0aW9uYWw6IGJvb2xlYW4sIGVycm9yczogYW55W10pOiBhbnlbXSB7XG4gICAgbGV0IHJlc3VsdHM6IGFueVtdID0gW107XG4gICAgaWYgKGluY2x1ZGVTZWxmKSB7XG4gICAgICByZXN1bHRzLnB1c2godGhpcy5lbGVtZW50KTtcbiAgICB9XG4gICAgaWYgKHNlbGVjdG9yLmxlbmd0aCA+IDApIHsgIC8vIGlmIDpzZWxmIGlzIG9ubHkgdXNlZCB0aGVuIHRoZSBzZWxlY3RvciBpcyBlbXB0eVxuICAgICAgc2VsZWN0b3IgPSBzZWxlY3Rvci5yZXBsYWNlKEVOVEVSX1RPS0VOX1JFR0VYLCAnLicgKyB0aGlzLl9lbnRlckNsYXNzTmFtZSk7XG4gICAgICBzZWxlY3RvciA9IHNlbGVjdG9yLnJlcGxhY2UoTEVBVkVfVE9LRU5fUkVHRVgsICcuJyArIHRoaXMuX2xlYXZlQ2xhc3NOYW1lKTtcbiAgICAgIGNvbnN0IG11bHRpID0gbGltaXQgIT0gMTtcbiAgICAgIGxldCBlbGVtZW50cyA9IHRoaXMuX2RyaXZlci5xdWVyeSh0aGlzLmVsZW1lbnQsIHNlbGVjdG9yLCBtdWx0aSk7XG4gICAgICBpZiAobGltaXQgIT09IDApIHtcbiAgICAgICAgZWxlbWVudHMgPSBsaW1pdCA8IDAgPyBlbGVtZW50cy5zbGljZShlbGVtZW50cy5sZW5ndGggKyBsaW1pdCwgZWxlbWVudHMubGVuZ3RoKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudHMuc2xpY2UoMCwgbGltaXQpO1xuICAgICAgfVxuICAgICAgcmVzdWx0cy5wdXNoKC4uLmVsZW1lbnRzKTtcbiAgICB9XG5cbiAgICBpZiAoIW9wdGlvbmFsICYmIHJlc3VsdHMubGVuZ3RoID09IDApIHtcbiAgICAgIGVycm9ycy5wdXNoKFxuICAgICAgICAgIGBcXGBxdWVyeShcIiR7b3JpZ2luYWxTZWxlY3Rvcn1cIilcXGAgcmV0dXJuZWQgemVybyBlbGVtZW50cy4gKFVzZSBcXGBxdWVyeShcIiR7b3JpZ2luYWxTZWxlY3Rvcn1cIiwgeyBvcHRpb25hbDogdHJ1ZSB9KVxcYCBpZiB5b3Ugd2lzaCB0byBhbGxvdyB0aGlzLilgKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cbn1cblxuXG5leHBvcnQgY2xhc3MgVGltZWxpbmVCdWlsZGVyIHtcbiAgcHVibGljIGR1cmF0aW9uOiBudW1iZXIgPSAwO1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcHVibGljIGVhc2luZyAhOiBzdHJpbmcgfCBudWxsO1xuICBwcml2YXRlIF9wcmV2aW91c0tleWZyYW1lOiDJtVN0eWxlRGF0YSA9IHt9O1xuICBwcml2YXRlIF9jdXJyZW50S2V5ZnJhbWU6IMm1U3R5bGVEYXRhID0ge307XG4gIHByaXZhdGUgX2tleWZyYW1lcyA9IG5ldyBNYXA8bnVtYmVyLCDJtVN0eWxlRGF0YT4oKTtcbiAgcHJpdmF0ZSBfc3R5bGVTdW1tYXJ5OiB7W3Byb3A6IHN0cmluZ106IFN0eWxlQXRUaW1lfSA9IHt9O1xuICBwcml2YXRlIF9sb2NhbFRpbWVsaW5lU3R5bGVzOiDJtVN0eWxlRGF0YTtcbiAgcHJpdmF0ZSBfZ2xvYmFsVGltZWxpbmVTdHlsZXM6IMm1U3R5bGVEYXRhO1xuICBwcml2YXRlIF9wZW5kaW5nU3R5bGVzOiDJtVN0eWxlRGF0YSA9IHt9O1xuICBwcml2YXRlIF9iYWNrRmlsbDogybVTdHlsZURhdGEgPSB7fTtcbiAgcHJpdmF0ZSBfY3VycmVudEVtcHR5U3RlcEtleWZyYW1lOiDJtVN0eWxlRGF0YXxudWxsID0gbnVsbDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgX2RyaXZlcjogQW5pbWF0aW9uRHJpdmVyLCBwdWJsaWMgZWxlbWVudDogYW55LCBwdWJsaWMgc3RhcnRUaW1lOiBudW1iZXIsXG4gICAgICBwcml2YXRlIF9lbGVtZW50VGltZWxpbmVTdHlsZXNMb29rdXA/OiBNYXA8YW55LCDJtVN0eWxlRGF0YT4pIHtcbiAgICBpZiAoIXRoaXMuX2VsZW1lbnRUaW1lbGluZVN0eWxlc0xvb2t1cCkge1xuICAgICAgdGhpcy5fZWxlbWVudFRpbWVsaW5lU3R5bGVzTG9va3VwID0gbmV3IE1hcDxhbnksIMm1U3R5bGVEYXRhPigpO1xuICAgIH1cblxuICAgIHRoaXMuX2xvY2FsVGltZWxpbmVTdHlsZXMgPSBPYmplY3QuY3JlYXRlKHRoaXMuX2JhY2tGaWxsLCB7fSk7XG4gICAgdGhpcy5fZ2xvYmFsVGltZWxpbmVTdHlsZXMgPSB0aGlzLl9lbGVtZW50VGltZWxpbmVTdHlsZXNMb29rdXAuZ2V0KGVsZW1lbnQpICE7XG4gICAgaWYgKCF0aGlzLl9nbG9iYWxUaW1lbGluZVN0eWxlcykge1xuICAgICAgdGhpcy5fZ2xvYmFsVGltZWxpbmVTdHlsZXMgPSB0aGlzLl9sb2NhbFRpbWVsaW5lU3R5bGVzO1xuICAgICAgdGhpcy5fZWxlbWVudFRpbWVsaW5lU3R5bGVzTG9va3VwLnNldChlbGVtZW50LCB0aGlzLl9sb2NhbFRpbWVsaW5lU3R5bGVzKTtcbiAgICB9XG4gICAgdGhpcy5fbG9hZEtleWZyYW1lKCk7XG4gIH1cblxuICBjb250YWluc0FuaW1hdGlvbigpOiBib29sZWFuIHtcbiAgICBzd2l0Y2ggKHRoaXMuX2tleWZyYW1lcy5zaXplKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q3VycmVudFN0eWxlUHJvcGVydGllcygpLmxlbmd0aCA+IDA7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBnZXRDdXJyZW50U3R5bGVQcm9wZXJ0aWVzKCk6IHN0cmluZ1tdIHsgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuX2N1cnJlbnRLZXlmcmFtZSk7IH1cblxuICBnZXQgY3VycmVudFRpbWUoKSB7IHJldHVybiB0aGlzLnN0YXJ0VGltZSArIHRoaXMuZHVyYXRpb247IH1cblxuICBkZWxheU5leHRTdGVwKGRlbGF5OiBudW1iZXIpIHtcbiAgICAvLyBpbiB0aGUgZXZlbnQgdGhhdCBhIHN0eWxlKCkgc3RlcCBpcyBwbGFjZWQgcmlnaHQgYmVmb3JlIGEgc3RhZ2dlcigpXG4gICAgLy8gYW5kIHRoYXQgc3R5bGUoKSBzdGVwIGlzIHRoZSB2ZXJ5IGZpcnN0IHN0eWxlKCkgdmFsdWUgaW4gdGhlIGFuaW1hdGlvblxuICAgIC8vIHRoZW4gd2UgbmVlZCB0byBtYWtlIGEgY29weSBvZiB0aGUga2V5ZnJhbWUgWzAsIGNvcHksIDFdIHNvIHRoYXQgdGhlIGRlbGF5XG4gICAgLy8gcHJvcGVybHkgYXBwbGllcyB0aGUgc3R5bGUoKSB2YWx1ZXMgdG8gd29yayB3aXRoIHRoZSBzdGFnZ2VyLi4uXG4gICAgY29uc3QgaGFzUHJlU3R5bGVTdGVwID0gdGhpcy5fa2V5ZnJhbWVzLnNpemUgPT0gMSAmJiBPYmplY3Qua2V5cyh0aGlzLl9wZW5kaW5nU3R5bGVzKS5sZW5ndGg7XG5cbiAgICBpZiAodGhpcy5kdXJhdGlvbiB8fCBoYXNQcmVTdHlsZVN0ZXApIHtcbiAgICAgIHRoaXMuZm9yd2FyZFRpbWUodGhpcy5jdXJyZW50VGltZSArIGRlbGF5KTtcbiAgICAgIGlmIChoYXNQcmVTdHlsZVN0ZXApIHtcbiAgICAgICAgdGhpcy5zbmFwc2hvdEN1cnJlbnRTdHlsZXMoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdGFydFRpbWUgKz0gZGVsYXk7XG4gICAgfVxuICB9XG5cbiAgZm9yayhlbGVtZW50OiBhbnksIGN1cnJlbnRUaW1lPzogbnVtYmVyKTogVGltZWxpbmVCdWlsZGVyIHtcbiAgICB0aGlzLmFwcGx5U3R5bGVzVG9LZXlmcmFtZSgpO1xuICAgIHJldHVybiBuZXcgVGltZWxpbmVCdWlsZGVyKFxuICAgICAgICB0aGlzLl9kcml2ZXIsIGVsZW1lbnQsIGN1cnJlbnRUaW1lIHx8IHRoaXMuY3VycmVudFRpbWUsIHRoaXMuX2VsZW1lbnRUaW1lbGluZVN0eWxlc0xvb2t1cCk7XG4gIH1cblxuICBwcml2YXRlIF9sb2FkS2V5ZnJhbWUoKSB7XG4gICAgaWYgKHRoaXMuX2N1cnJlbnRLZXlmcmFtZSkge1xuICAgICAgdGhpcy5fcHJldmlvdXNLZXlmcmFtZSA9IHRoaXMuX2N1cnJlbnRLZXlmcmFtZTtcbiAgICB9XG4gICAgdGhpcy5fY3VycmVudEtleWZyYW1lID0gdGhpcy5fa2V5ZnJhbWVzLmdldCh0aGlzLmR1cmF0aW9uKSAhO1xuICAgIGlmICghdGhpcy5fY3VycmVudEtleWZyYW1lKSB7XG4gICAgICB0aGlzLl9jdXJyZW50S2V5ZnJhbWUgPSBPYmplY3QuY3JlYXRlKHRoaXMuX2JhY2tGaWxsLCB7fSk7XG4gICAgICB0aGlzLl9rZXlmcmFtZXMuc2V0KHRoaXMuZHVyYXRpb24sIHRoaXMuX2N1cnJlbnRLZXlmcmFtZSk7XG4gICAgfVxuICB9XG5cbiAgZm9yd2FyZEZyYW1lKCkge1xuICAgIHRoaXMuZHVyYXRpb24gKz0gT05FX0ZSQU1FX0lOX01JTExJU0VDT05EUztcbiAgICB0aGlzLl9sb2FkS2V5ZnJhbWUoKTtcbiAgfVxuXG4gIGZvcndhcmRUaW1lKHRpbWU6IG51bWJlcikge1xuICAgIHRoaXMuYXBwbHlTdHlsZXNUb0tleWZyYW1lKCk7XG4gICAgdGhpcy5kdXJhdGlvbiA9IHRpbWU7XG4gICAgdGhpcy5fbG9hZEtleWZyYW1lKCk7XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVTdHlsZShwcm9wOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmd8bnVtYmVyKSB7XG4gICAgdGhpcy5fbG9jYWxUaW1lbGluZVN0eWxlc1twcm9wXSA9IHZhbHVlO1xuICAgIHRoaXMuX2dsb2JhbFRpbWVsaW5lU3R5bGVzW3Byb3BdID0gdmFsdWU7XG4gICAgdGhpcy5fc3R5bGVTdW1tYXJ5W3Byb3BdID0ge3RpbWU6IHRoaXMuY3VycmVudFRpbWUsIHZhbHVlfTtcbiAgfVxuXG4gIGFsbG93T25seVRpbWVsaW5lU3R5bGVzKCkgeyByZXR1cm4gdGhpcy5fY3VycmVudEVtcHR5U3RlcEtleWZyYW1lICE9PSB0aGlzLl9jdXJyZW50S2V5ZnJhbWU7IH1cblxuICBhcHBseUVtcHR5U3RlcChlYXNpbmc6IHN0cmluZ3xudWxsKSB7XG4gICAgaWYgKGVhc2luZykge1xuICAgICAgdGhpcy5fcHJldmlvdXNLZXlmcmFtZVsnZWFzaW5nJ10gPSBlYXNpbmc7XG4gICAgfVxuXG4gICAgLy8gc3BlY2lhbCBjYXNlIGZvciBhbmltYXRlKGR1cmF0aW9uKTpcbiAgICAvLyBhbGwgbWlzc2luZyBzdHlsZXMgYXJlIGZpbGxlZCB3aXRoIGEgYCpgIHZhbHVlIHRoZW5cbiAgICAvLyBpZiBhbnkgZGVzdGluYXRpb24gc3R5bGVzIGFyZSBmaWxsZWQgaW4gbGF0ZXIgb24gdGhlIHNhbWVcbiAgICAvLyBrZXlmcmFtZSB0aGVuIHRoZXkgd2lsbCBvdmVycmlkZSB0aGUgb3ZlcnJpZGRlbiBzdHlsZXNcbiAgICAvLyBXZSB1c2UgYF9nbG9iYWxUaW1lbGluZVN0eWxlc2AgaGVyZSBiZWNhdXNlIHRoZXJlIG1heSBiZVxuICAgIC8vIHN0eWxlcyBpbiBwcmV2aW91cyBrZXlmcmFtZXMgdGhhdCBhcmUgbm90IHByZXNlbnQgaW4gdGhpcyB0aW1lbGluZVxuICAgIE9iamVjdC5rZXlzKHRoaXMuX2dsb2JhbFRpbWVsaW5lU3R5bGVzKS5mb3JFYWNoKHByb3AgPT4ge1xuICAgICAgdGhpcy5fYmFja0ZpbGxbcHJvcF0gPSB0aGlzLl9nbG9iYWxUaW1lbGluZVN0eWxlc1twcm9wXSB8fCBBVVRPX1NUWUxFO1xuICAgICAgdGhpcy5fY3VycmVudEtleWZyYW1lW3Byb3BdID0gQVVUT19TVFlMRTtcbiAgICB9KTtcbiAgICB0aGlzLl9jdXJyZW50RW1wdHlTdGVwS2V5ZnJhbWUgPSB0aGlzLl9jdXJyZW50S2V5ZnJhbWU7XG4gIH1cblxuICBzZXRTdHlsZXMoXG4gICAgICBpbnB1dDogKMm1U3R5bGVEYXRhfHN0cmluZylbXSwgZWFzaW5nOiBzdHJpbmd8bnVsbCwgZXJyb3JzOiBhbnlbXSxcbiAgICAgIG9wdGlvbnM/OiBBbmltYXRpb25PcHRpb25zKSB7XG4gICAgaWYgKGVhc2luZykge1xuICAgICAgdGhpcy5fcHJldmlvdXNLZXlmcmFtZVsnZWFzaW5nJ10gPSBlYXNpbmc7XG4gICAgfVxuXG4gICAgY29uc3QgcGFyYW1zID0gKG9wdGlvbnMgJiYgb3B0aW9ucy5wYXJhbXMpIHx8IHt9O1xuICAgIGNvbnN0IHN0eWxlcyA9IGZsYXR0ZW5TdHlsZXMoaW5wdXQsIHRoaXMuX2dsb2JhbFRpbWVsaW5lU3R5bGVzKTtcbiAgICBPYmplY3Qua2V5cyhzdHlsZXMpLmZvckVhY2gocHJvcCA9PiB7XG4gICAgICBjb25zdCB2YWwgPSBpbnRlcnBvbGF0ZVBhcmFtcyhzdHlsZXNbcHJvcF0sIHBhcmFtcywgZXJyb3JzKTtcbiAgICAgIHRoaXMuX3BlbmRpbmdTdHlsZXNbcHJvcF0gPSB2YWw7XG4gICAgICBpZiAoIXRoaXMuX2xvY2FsVGltZWxpbmVTdHlsZXMuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgdGhpcy5fYmFja0ZpbGxbcHJvcF0gPSB0aGlzLl9nbG9iYWxUaW1lbGluZVN0eWxlcy5oYXNPd25Qcm9wZXJ0eShwcm9wKSA/XG4gICAgICAgICAgICB0aGlzLl9nbG9iYWxUaW1lbGluZVN0eWxlc1twcm9wXSA6XG4gICAgICAgICAgICBBVVRPX1NUWUxFO1xuICAgICAgfVxuICAgICAgdGhpcy5fdXBkYXRlU3R5bGUocHJvcCwgdmFsKTtcbiAgICB9KTtcbiAgfVxuXG4gIGFwcGx5U3R5bGVzVG9LZXlmcmFtZSgpIHtcbiAgICBjb25zdCBzdHlsZXMgPSB0aGlzLl9wZW5kaW5nU3R5bGVzO1xuICAgIGNvbnN0IHByb3BzID0gT2JqZWN0LmtleXMoc3R5bGVzKTtcbiAgICBpZiAocHJvcHMubGVuZ3RoID09IDApIHJldHVybjtcblxuICAgIHRoaXMuX3BlbmRpbmdTdHlsZXMgPSB7fTtcblxuICAgIHByb3BzLmZvckVhY2gocHJvcCA9PiB7XG4gICAgICBjb25zdCB2YWwgPSBzdHlsZXNbcHJvcF07XG4gICAgICB0aGlzLl9jdXJyZW50S2V5ZnJhbWVbcHJvcF0gPSB2YWw7XG4gICAgfSk7XG5cbiAgICBPYmplY3Qua2V5cyh0aGlzLl9sb2NhbFRpbWVsaW5lU3R5bGVzKS5mb3JFYWNoKHByb3AgPT4ge1xuICAgICAgaWYgKCF0aGlzLl9jdXJyZW50S2V5ZnJhbWUuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgdGhpcy5fY3VycmVudEtleWZyYW1lW3Byb3BdID0gdGhpcy5fbG9jYWxUaW1lbGluZVN0eWxlc1twcm9wXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHNuYXBzaG90Q3VycmVudFN0eWxlcygpIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLl9sb2NhbFRpbWVsaW5lU3R5bGVzKS5mb3JFYWNoKHByb3AgPT4ge1xuICAgICAgY29uc3QgdmFsID0gdGhpcy5fbG9jYWxUaW1lbGluZVN0eWxlc1twcm9wXTtcbiAgICAgIHRoaXMuX3BlbmRpbmdTdHlsZXNbcHJvcF0gPSB2YWw7XG4gICAgICB0aGlzLl91cGRhdGVTdHlsZShwcm9wLCB2YWwpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0RmluYWxLZXlmcmFtZSgpIHsgcmV0dXJuIHRoaXMuX2tleWZyYW1lcy5nZXQodGhpcy5kdXJhdGlvbik7IH1cblxuICBnZXQgcHJvcGVydGllcygpIHtcbiAgICBjb25zdCBwcm9wZXJ0aWVzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGZvciAobGV0IHByb3AgaW4gdGhpcy5fY3VycmVudEtleWZyYW1lKSB7XG4gICAgICBwcm9wZXJ0aWVzLnB1c2gocHJvcCk7XG4gICAgfVxuICAgIHJldHVybiBwcm9wZXJ0aWVzO1xuICB9XG5cbiAgbWVyZ2VUaW1lbGluZUNvbGxlY3RlZFN0eWxlcyh0aW1lbGluZTogVGltZWxpbmVCdWlsZGVyKSB7XG4gICAgT2JqZWN0LmtleXModGltZWxpbmUuX3N0eWxlU3VtbWFyeSkuZm9yRWFjaChwcm9wID0+IHtcbiAgICAgIGNvbnN0IGRldGFpbHMwID0gdGhpcy5fc3R5bGVTdW1tYXJ5W3Byb3BdO1xuICAgICAgY29uc3QgZGV0YWlsczEgPSB0aW1lbGluZS5fc3R5bGVTdW1tYXJ5W3Byb3BdO1xuICAgICAgaWYgKCFkZXRhaWxzMCB8fCBkZXRhaWxzMS50aW1lID4gZGV0YWlsczAudGltZSkge1xuICAgICAgICB0aGlzLl91cGRhdGVTdHlsZShwcm9wLCBkZXRhaWxzMS52YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBidWlsZEtleWZyYW1lcygpOiBBbmltYXRpb25UaW1lbGluZUluc3RydWN0aW9uIHtcbiAgICB0aGlzLmFwcGx5U3R5bGVzVG9LZXlmcmFtZSgpO1xuICAgIGNvbnN0IHByZVN0eWxlUHJvcHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBjb25zdCBwb3N0U3R5bGVQcm9wcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnN0IGlzRW1wdHkgPSB0aGlzLl9rZXlmcmFtZXMuc2l6ZSA9PT0gMSAmJiB0aGlzLmR1cmF0aW9uID09PSAwO1xuXG4gICAgbGV0IGZpbmFsS2V5ZnJhbWVzOiDJtVN0eWxlRGF0YVtdID0gW107XG4gICAgdGhpcy5fa2V5ZnJhbWVzLmZvckVhY2goKGtleWZyYW1lLCB0aW1lKSA9PiB7XG4gICAgICBjb25zdCBmaW5hbEtleWZyYW1lID0gY29weVN0eWxlcyhrZXlmcmFtZSwgdHJ1ZSk7XG4gICAgICBPYmplY3Qua2V5cyhmaW5hbEtleWZyYW1lKS5mb3JFYWNoKHByb3AgPT4ge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGZpbmFsS2V5ZnJhbWVbcHJvcF07XG4gICAgICAgIGlmICh2YWx1ZSA9PSBQUkVfU1RZTEUpIHtcbiAgICAgICAgICBwcmVTdHlsZVByb3BzLmFkZChwcm9wKTtcbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PSBBVVRPX1NUWUxFKSB7XG4gICAgICAgICAgcG9zdFN0eWxlUHJvcHMuYWRkKHByb3ApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmICghaXNFbXB0eSkge1xuICAgICAgICBmaW5hbEtleWZyYW1lWydvZmZzZXQnXSA9IHRpbWUgLyB0aGlzLmR1cmF0aW9uO1xuICAgICAgfVxuICAgICAgZmluYWxLZXlmcmFtZXMucHVzaChmaW5hbEtleWZyYW1lKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHByZVByb3BzOiBzdHJpbmdbXSA9IHByZVN0eWxlUHJvcHMuc2l6ZSA/IGl0ZXJhdG9yVG9BcnJheShwcmVTdHlsZVByb3BzLnZhbHVlcygpKSA6IFtdO1xuICAgIGNvbnN0IHBvc3RQcm9wczogc3RyaW5nW10gPSBwb3N0U3R5bGVQcm9wcy5zaXplID8gaXRlcmF0b3JUb0FycmF5KHBvc3RTdHlsZVByb3BzLnZhbHVlcygpKSA6IFtdO1xuXG4gICAgLy8gc3BlY2lhbCBjYXNlIGZvciBhIDAtc2Vjb25kIGFuaW1hdGlvbiAod2hpY2ggaXMgZGVzaWduZWQganVzdCB0byBwbGFjZSBzdHlsZXMgb25zY3JlZW4pXG4gICAgaWYgKGlzRW1wdHkpIHtcbiAgICAgIGNvbnN0IGtmMCA9IGZpbmFsS2V5ZnJhbWVzWzBdO1xuICAgICAgY29uc3Qga2YxID0gY29weU9iaihrZjApO1xuICAgICAga2YwWydvZmZzZXQnXSA9IDA7XG4gICAgICBrZjFbJ29mZnNldCddID0gMTtcbiAgICAgIGZpbmFsS2V5ZnJhbWVzID0gW2tmMCwga2YxXTtcbiAgICB9XG5cbiAgICByZXR1cm4gY3JlYXRlVGltZWxpbmVJbnN0cnVjdGlvbihcbiAgICAgICAgdGhpcy5lbGVtZW50LCBmaW5hbEtleWZyYW1lcywgcHJlUHJvcHMsIHBvc3RQcm9wcywgdGhpcy5kdXJhdGlvbiwgdGhpcy5zdGFydFRpbWUsXG4gICAgICAgIHRoaXMuZWFzaW5nLCBmYWxzZSk7XG4gIH1cbn1cblxuY2xhc3MgU3ViVGltZWxpbmVCdWlsZGVyIGV4dGVuZHMgVGltZWxpbmVCdWlsZGVyIHtcbiAgcHVibGljIHRpbWluZ3M6IEFuaW1hdGVUaW1pbmdzO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgZHJpdmVyOiBBbmltYXRpb25Ecml2ZXIsIHB1YmxpYyBlbGVtZW50OiBhbnksIHB1YmxpYyBrZXlmcmFtZXM6IMm1U3R5bGVEYXRhW10sXG4gICAgICBwdWJsaWMgcHJlU3R5bGVQcm9wczogc3RyaW5nW10sIHB1YmxpYyBwb3N0U3R5bGVQcm9wczogc3RyaW5nW10sIHRpbWluZ3M6IEFuaW1hdGVUaW1pbmdzLFxuICAgICAgcHJpdmF0ZSBfc3RyZXRjaFN0YXJ0aW5nS2V5ZnJhbWU6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIHN1cGVyKGRyaXZlciwgZWxlbWVudCwgdGltaW5ncy5kZWxheSk7XG4gICAgdGhpcy50aW1pbmdzID0ge2R1cmF0aW9uOiB0aW1pbmdzLmR1cmF0aW9uLCBkZWxheTogdGltaW5ncy5kZWxheSwgZWFzaW5nOiB0aW1pbmdzLmVhc2luZ307XG4gIH1cblxuICBjb250YWluc0FuaW1hdGlvbigpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMua2V5ZnJhbWVzLmxlbmd0aCA+IDE7IH1cblxuICBidWlsZEtleWZyYW1lcygpOiBBbmltYXRpb25UaW1lbGluZUluc3RydWN0aW9uIHtcbiAgICBsZXQga2V5ZnJhbWVzID0gdGhpcy5rZXlmcmFtZXM7XG4gICAgbGV0IHtkZWxheSwgZHVyYXRpb24sIGVhc2luZ30gPSB0aGlzLnRpbWluZ3M7XG4gICAgaWYgKHRoaXMuX3N0cmV0Y2hTdGFydGluZ0tleWZyYW1lICYmIGRlbGF5KSB7XG4gICAgICBjb25zdCBuZXdLZXlmcmFtZXM6IMm1U3R5bGVEYXRhW10gPSBbXTtcbiAgICAgIGNvbnN0IHRvdGFsVGltZSA9IGR1cmF0aW9uICsgZGVsYXk7XG4gICAgICBjb25zdCBzdGFydGluZ0dhcCA9IGRlbGF5IC8gdG90YWxUaW1lO1xuXG4gICAgICAvLyB0aGUgb3JpZ2luYWwgc3RhcnRpbmcga2V5ZnJhbWUgbm93IHN0YXJ0cyBvbmNlIHRoZSBkZWxheSBpcyBkb25lXG4gICAgICBjb25zdCBuZXdGaXJzdEtleWZyYW1lID0gY29weVN0eWxlcyhrZXlmcmFtZXNbMF0sIGZhbHNlKTtcbiAgICAgIG5ld0ZpcnN0S2V5ZnJhbWVbJ29mZnNldCddID0gMDtcbiAgICAgIG5ld0tleWZyYW1lcy5wdXNoKG5ld0ZpcnN0S2V5ZnJhbWUpO1xuXG4gICAgICBjb25zdCBvbGRGaXJzdEtleWZyYW1lID0gY29weVN0eWxlcyhrZXlmcmFtZXNbMF0sIGZhbHNlKTtcbiAgICAgIG9sZEZpcnN0S2V5ZnJhbWVbJ29mZnNldCddID0gcm91bmRPZmZzZXQoc3RhcnRpbmdHYXApO1xuICAgICAgbmV3S2V5ZnJhbWVzLnB1c2gob2xkRmlyc3RLZXlmcmFtZSk7XG5cbiAgICAgIC8qXG4gICAgICAgIFdoZW4gdGhlIGtleWZyYW1lIGlzIHN0cmV0Y2hlZCB0aGVuIGl0IG1lYW5zIHRoYXQgdGhlIGRlbGF5IGJlZm9yZSB0aGUgYW5pbWF0aW9uXG4gICAgICAgIHN0YXJ0cyBpcyBnb25lLiBJbnN0ZWFkIHRoZSBmaXJzdCBrZXlmcmFtZSBpcyBwbGFjZWQgYXQgdGhlIHN0YXJ0IG9mIHRoZSBhbmltYXRpb25cbiAgICAgICAgYW5kIGl0IGlzIHRoZW4gY29waWVkIHRvIHdoZXJlIGl0IHN0YXJ0cyB3aGVuIHRoZSBvcmlnaW5hbCBkZWxheSBpcyBvdmVyLiBUaGlzIGJhc2ljYWxseVxuICAgICAgICBtZWFucyBub3RoaW5nIGFuaW1hdGVzIGR1cmluZyB0aGF0IGRlbGF5LCBidXQgdGhlIHN0eWxlcyBhcmUgc3RpbGwgcmVuZGVyZXJlZC4gRm9yIHRoaXNcbiAgICAgICAgdG8gd29yayB0aGUgb3JpZ2luYWwgb2Zmc2V0IHZhbHVlcyB0aGF0IGV4aXN0IGluIHRoZSBvcmlnaW5hbCBrZXlmcmFtZXMgbXVzdCBiZSBcIndhcnBlZFwiXG4gICAgICAgIHNvIHRoYXQgdGhleSBjYW4gdGFrZSB0aGUgbmV3IGtleWZyYW1lICsgZGVsYXkgaW50byBhY2NvdW50LlxuXG4gICAgICAgIGRlbGF5PTEwMDAsIGR1cmF0aW9uPTEwMDAsIGtleWZyYW1lcyA9IDAgLjUgMVxuXG4gICAgICAgIHR1cm5zIGludG9cblxuICAgICAgICBkZWxheT0wLCBkdXJhdGlvbj0yMDAwLCBrZXlmcmFtZXMgPSAwIC4zMyAuNjYgMVxuICAgICAgICovXG5cbiAgICAgIC8vIG9mZnNldHMgYmV0d2VlbiAxIC4uLiBuIC0xIGFyZSBhbGwgd2FycGVkIGJ5IHRoZSBrZXlmcmFtZSBzdHJldGNoXG4gICAgICBjb25zdCBsaW1pdCA9IGtleWZyYW1lcy5sZW5ndGggLSAxO1xuICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gbGltaXQ7IGkrKykge1xuICAgICAgICBsZXQga2YgPSBjb3B5U3R5bGVzKGtleWZyYW1lc1tpXSwgZmFsc2UpO1xuICAgICAgICBjb25zdCBvbGRPZmZzZXQgPSBrZlsnb2Zmc2V0J10gYXMgbnVtYmVyO1xuICAgICAgICBjb25zdCB0aW1lQXRLZXlmcmFtZSA9IGRlbGF5ICsgb2xkT2Zmc2V0ICogZHVyYXRpb247XG4gICAgICAgIGtmWydvZmZzZXQnXSA9IHJvdW5kT2Zmc2V0KHRpbWVBdEtleWZyYW1lIC8gdG90YWxUaW1lKTtcbiAgICAgICAgbmV3S2V5ZnJhbWVzLnB1c2goa2YpO1xuICAgICAgfVxuXG4gICAgICAvLyB0aGUgbmV3IHN0YXJ0aW5nIGtleWZyYW1lIHNob3VsZCBiZSBhZGRlZCBhdCB0aGUgc3RhcnRcbiAgICAgIGR1cmF0aW9uID0gdG90YWxUaW1lO1xuICAgICAgZGVsYXkgPSAwO1xuICAgICAgZWFzaW5nID0gJyc7XG5cbiAgICAgIGtleWZyYW1lcyA9IG5ld0tleWZyYW1lcztcbiAgICB9XG5cbiAgICByZXR1cm4gY3JlYXRlVGltZWxpbmVJbnN0cnVjdGlvbihcbiAgICAgICAgdGhpcy5lbGVtZW50LCBrZXlmcmFtZXMsIHRoaXMucHJlU3R5bGVQcm9wcywgdGhpcy5wb3N0U3R5bGVQcm9wcywgZHVyYXRpb24sIGRlbGF5LCBlYXNpbmcsXG4gICAgICAgIHRydWUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJvdW5kT2Zmc2V0KG9mZnNldDogbnVtYmVyLCBkZWNpbWFsUG9pbnRzID0gMyk6IG51bWJlciB7XG4gIGNvbnN0IG11bHQgPSBNYXRoLnBvdygxMCwgZGVjaW1hbFBvaW50cyAtIDEpO1xuICByZXR1cm4gTWF0aC5yb3VuZChvZmZzZXQgKiBtdWx0KSAvIG11bHQ7XG59XG5cbmZ1bmN0aW9uIGZsYXR0ZW5TdHlsZXMoaW5wdXQ6ICjJtVN0eWxlRGF0YSB8IHN0cmluZylbXSwgYWxsU3R5bGVzOiDJtVN0eWxlRGF0YSkge1xuICBjb25zdCBzdHlsZXM6IMm1U3R5bGVEYXRhID0ge307XG4gIGxldCBhbGxQcm9wZXJ0aWVzOiBzdHJpbmdbXTtcbiAgaW5wdXQuZm9yRWFjaCh0b2tlbiA9PiB7XG4gICAgaWYgKHRva2VuID09PSAnKicpIHtcbiAgICAgIGFsbFByb3BlcnRpZXMgPSBhbGxQcm9wZXJ0aWVzIHx8IE9iamVjdC5rZXlzKGFsbFN0eWxlcyk7XG4gICAgICBhbGxQcm9wZXJ0aWVzLmZvckVhY2gocHJvcCA9PiB7IHN0eWxlc1twcm9wXSA9IEFVVE9fU1RZTEU7IH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb3B5U3R5bGVzKHRva2VuIGFzIMm1U3R5bGVEYXRhLCBmYWxzZSwgc3R5bGVzKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gc3R5bGVzO1xufVxuIl19