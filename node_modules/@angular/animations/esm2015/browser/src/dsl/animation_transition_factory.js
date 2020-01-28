/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { getOrSetAsInMap } from '../render/shared';
import { copyObj, interpolateParams, iteratorToArray } from '../util';
import { buildAnimationTimelines } from './animation_timeline_builder';
import { createTransitionInstruction } from './animation_transition_instruction';
/** @type {?} */
const EMPTY_OBJECT = {};
export class AnimationTransitionFactory {
    /**
     * @param {?} _triggerName
     * @param {?} ast
     * @param {?} _stateStyles
     */
    constructor(_triggerName, ast, _stateStyles) {
        this._triggerName = _triggerName;
        this.ast = ast;
        this._stateStyles = _stateStyles;
    }
    /**
     * @param {?} currentState
     * @param {?} nextState
     * @param {?} element
     * @param {?} params
     * @return {?}
     */
    match(currentState, nextState, element, params) {
        return oneOrMoreTransitionsMatch(this.ast.matchers, currentState, nextState, element, params);
    }
    /**
     * @param {?} stateName
     * @param {?} params
     * @param {?} errors
     * @return {?}
     */
    buildStyles(stateName, params, errors) {
        /** @type {?} */
        const backupStateStyler = this._stateStyles['*'];
        /** @type {?} */
        const stateStyler = this._stateStyles[stateName];
        /** @type {?} */
        const backupStyles = backupStateStyler ? backupStateStyler.buildStyles(params, errors) : {};
        return stateStyler ? stateStyler.buildStyles(params, errors) : backupStyles;
    }
    /**
     * @param {?} driver
     * @param {?} element
     * @param {?} currentState
     * @param {?} nextState
     * @param {?} enterClassName
     * @param {?} leaveClassName
     * @param {?=} currentOptions
     * @param {?=} nextOptions
     * @param {?=} subInstructions
     * @param {?=} skipAstBuild
     * @return {?}
     */
    build(driver, element, currentState, nextState, enterClassName, leaveClassName, currentOptions, nextOptions, subInstructions, skipAstBuild) {
        /** @type {?} */
        const errors = [];
        /** @type {?} */
        const transitionAnimationParams = this.ast.options && this.ast.options.params || EMPTY_OBJECT;
        /** @type {?} */
        const currentAnimationParams = currentOptions && currentOptions.params || EMPTY_OBJECT;
        /** @type {?} */
        const currentStateStyles = this.buildStyles(currentState, currentAnimationParams, errors);
        /** @type {?} */
        const nextAnimationParams = nextOptions && nextOptions.params || EMPTY_OBJECT;
        /** @type {?} */
        const nextStateStyles = this.buildStyles(nextState, nextAnimationParams, errors);
        /** @type {?} */
        const queriedElements = new Set();
        /** @type {?} */
        const preStyleMap = new Map();
        /** @type {?} */
        const postStyleMap = new Map();
        /** @type {?} */
        const isRemoval = nextState === 'void';
        /** @type {?} */
        const animationOptions = { params: Object.assign({}, transitionAnimationParams, nextAnimationParams) };
        /** @type {?} */
        const timelines = skipAstBuild ? [] : buildAnimationTimelines(driver, element, this.ast.animation, enterClassName, leaveClassName, currentStateStyles, nextStateStyles, animationOptions, subInstructions, errors);
        /** @type {?} */
        let totalTime = 0;
        timelines.forEach((/**
         * @param {?} tl
         * @return {?}
         */
        tl => { totalTime = Math.max(tl.duration + tl.delay, totalTime); }));
        if (errors.length) {
            return createTransitionInstruction(element, this._triggerName, currentState, nextState, isRemoval, currentStateStyles, nextStateStyles, [], [], preStyleMap, postStyleMap, totalTime, errors);
        }
        timelines.forEach((/**
         * @param {?} tl
         * @return {?}
         */
        tl => {
            /** @type {?} */
            const elm = tl.element;
            /** @type {?} */
            const preProps = getOrSetAsInMap(preStyleMap, elm, {});
            tl.preStyleProps.forEach((/**
             * @param {?} prop
             * @return {?}
             */
            prop => preProps[prop] = true));
            /** @type {?} */
            const postProps = getOrSetAsInMap(postStyleMap, elm, {});
            tl.postStyleProps.forEach((/**
             * @param {?} prop
             * @return {?}
             */
            prop => postProps[prop] = true));
            if (elm !== element) {
                queriedElements.add(elm);
            }
        }));
        /** @type {?} */
        const queriedElementsList = iteratorToArray(queriedElements.values());
        return createTransitionInstruction(element, this._triggerName, currentState, nextState, isRemoval, currentStateStyles, nextStateStyles, timelines, queriedElementsList, preStyleMap, postStyleMap, totalTime);
    }
}
if (false) {
    /**
     * @type {?}
     * @private
     */
    AnimationTransitionFactory.prototype._triggerName;
    /** @type {?} */
    AnimationTransitionFactory.prototype.ast;
    /**
     * @type {?}
     * @private
     */
    AnimationTransitionFactory.prototype._stateStyles;
}
/**
 * @param {?} matchFns
 * @param {?} currentState
 * @param {?} nextState
 * @param {?} element
 * @param {?} params
 * @return {?}
 */
function oneOrMoreTransitionsMatch(matchFns, currentState, nextState, element, params) {
    return matchFns.some((/**
     * @param {?} fn
     * @return {?}
     */
    fn => fn(currentState, nextState, element, params)));
}
export class AnimationStateStyles {
    /**
     * @param {?} styles
     * @param {?} defaultParams
     */
    constructor(styles, defaultParams) {
        this.styles = styles;
        this.defaultParams = defaultParams;
    }
    /**
     * @param {?} params
     * @param {?} errors
     * @return {?}
     */
    buildStyles(params, errors) {
        /** @type {?} */
        const finalStyles = {};
        /** @type {?} */
        const combinedParams = copyObj(this.defaultParams);
        Object.keys(params).forEach((/**
         * @param {?} key
         * @return {?}
         */
        key => {
            /** @type {?} */
            const value = params[key];
            if (value != null) {
                combinedParams[key] = value;
            }
        }));
        this.styles.styles.forEach((/**
         * @param {?} value
         * @return {?}
         */
        value => {
            if (typeof value !== 'string') {
                /** @type {?} */
                const styleObj = (/** @type {?} */ (value));
                Object.keys(styleObj).forEach((/**
                 * @param {?} prop
                 * @return {?}
                 */
                prop => {
                    /** @type {?} */
                    let val = styleObj[prop];
                    if (val.length > 1) {
                        val = interpolateParams(val, combinedParams, errors);
                    }
                    finalStyles[prop] = val;
                }));
            }
        }));
        return finalStyles;
    }
}
if (false) {
    /**
     * @type {?}
     * @private
     */
    AnimationStateStyles.prototype.styles;
    /**
     * @type {?}
     * @private
     */
    AnimationStateStyles.prototype.defaultParams;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX3RyYW5zaXRpb25fZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2FuaW1hdGlvbnMvYnJvd3Nlci9zcmMvZHNsL2FuaW1hdGlvbl90cmFuc2l0aW9uX2ZhY3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQVVBLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUNqRCxPQUFPLEVBQUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLGVBQWUsRUFBd0IsTUFBTSxTQUFTLENBQUM7QUFHM0YsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0sOEJBQThCLENBQUM7QUFFckUsT0FBTyxFQUFpQywyQkFBMkIsRUFBQyxNQUFNLG9DQUFvQyxDQUFDOztNQUd6RyxZQUFZLEdBQUcsRUFBRTtBQUV2QixNQUFNLE9BQU8sMEJBQTBCOzs7Ozs7SUFDckMsWUFDWSxZQUFvQixFQUFTLEdBQWtCLEVBQy9DLFlBQXlEO1FBRHpELGlCQUFZLEdBQVosWUFBWSxDQUFRO1FBQVMsUUFBRyxHQUFILEdBQUcsQ0FBZTtRQUMvQyxpQkFBWSxHQUFaLFlBQVksQ0FBNkM7SUFBRyxDQUFDOzs7Ozs7OztJQUV6RSxLQUFLLENBQUMsWUFBaUIsRUFBRSxTQUFjLEVBQUUsT0FBWSxFQUFFLE1BQTRCO1FBQ2pGLE9BQU8seUJBQXlCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDaEcsQ0FBQzs7Ozs7OztJQUVELFdBQVcsQ0FBQyxTQUFpQixFQUFFLE1BQTRCLEVBQUUsTUFBYTs7Y0FDbEUsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUM7O2NBQzFDLFdBQVcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQzs7Y0FDMUMs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QyxNQUFNLENBQUMsQ0FBQyxPQUFPOzs7O1FBQUMsR0FBRyxDQUFDLEVBQUU7O2tCQUMxQixLQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQztZQUN6QixJQUFJLEtBQUssSUFBSSxJQUFJLEVBQUU7Z0JBQ2pCLGNBQWMsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7YUFDN0I7UUFDSCxDQUFDLEVBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU87Ozs7UUFBQyxLQUFLLENBQUMsRUFBRTtZQUNqQyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTs7c0JBQ3ZCLFFBQVEsR0FBRyxtQkFBQSxLQUFLLEVBQU87Z0JBQzdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTzs7OztnQkFBQyxJQUFJLENBQUMsRUFBRTs7d0JBQy9CLEdBQUcsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO29CQUN4QixJQUFJLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO3dCQUNsQixHQUFHLEdBQUcsaUJBQWlCLENBQUMsR0FBRyxFQUFFLGNBQWMsRUFBRSxNQUFNLENBQUMsQ0FBQztxQkFDdEQ7b0JBQ0QsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQztnQkFDMUIsQ0FBQyxFQUFDLENBQUM7YUFDSjtRQUNILENBQUMsRUFBQyxDQUFDO1FBQ0gsT0FBTyxXQUFXLENBQUM7SUFDckIsQ0FBQztDQUNGOzs7Ozs7SUF6QmEsc0NBQXdCOzs7OztJQUFFLDZDQUEyQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7QW5pbWF0aW9uT3B0aW9ucywgybVTdHlsZURhdGF9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuXG5pbXBvcnQge0FuaW1hdGlvbkRyaXZlcn0gZnJvbSAnLi4vcmVuZGVyL2FuaW1hdGlvbl9kcml2ZXInO1xuaW1wb3J0IHtnZXRPclNldEFzSW5NYXB9IGZyb20gJy4uL3JlbmRlci9zaGFyZWQnO1xuaW1wb3J0IHtjb3B5T2JqLCBpbnRlcnBvbGF0ZVBhcmFtcywgaXRlcmF0b3JUb0FycmF5LCBtZXJnZUFuaW1hdGlvbk9wdGlvbnN9IGZyb20gJy4uL3V0aWwnO1xuXG5pbXBvcnQge1N0eWxlQXN0LCBUcmFuc2l0aW9uQXN0fSBmcm9tICcuL2FuaW1hdGlvbl9hc3QnO1xuaW1wb3J0IHtidWlsZEFuaW1hdGlvblRpbWVsaW5lc30gZnJvbSAnLi9hbmltYXRpb25fdGltZWxpbmVfYnVpbGRlcic7XG5pbXBvcnQge1RyYW5zaXRpb25NYXRjaGVyRm59IGZyb20gJy4vYW5pbWF0aW9uX3RyYW5zaXRpb25fZXhwcic7XG5pbXBvcnQge0FuaW1hdGlvblRyYW5zaXRpb25JbnN0cnVjdGlvbiwgY3JlYXRlVHJhbnNpdGlvbkluc3RydWN0aW9ufSBmcm9tICcuL2FuaW1hdGlvbl90cmFuc2l0aW9uX2luc3RydWN0aW9uJztcbmltcG9ydCB7RWxlbWVudEluc3RydWN0aW9uTWFwfSBmcm9tICcuL2VsZW1lbnRfaW5zdHJ1Y3Rpb25fbWFwJztcblxuY29uc3QgRU1QVFlfT0JKRUNUID0ge307XG5cbmV4cG9ydCBjbGFzcyBBbmltYXRpb25UcmFuc2l0aW9uRmFjdG9yeSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBfdHJpZ2dlck5hbWU6IHN0cmluZywgcHVibGljIGFzdDogVHJhbnNpdGlvbkFzdCxcbiAgICAgIHByaXZhdGUgX3N0YXRlU3R5bGVzOiB7W3N0YXRlTmFtZTogc3RyaW5nXTogQW5pbWF0aW9uU3RhdGVTdHlsZXN9KSB7fVxuXG4gIG1hdGNoKGN1cnJlbnRTdGF0ZTogYW55LCBuZXh0U3RhdGU6IGFueSwgZWxlbWVudDogYW55LCBwYXJhbXM6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIG9uZU9yTW9yZVRyYW5zaXRpb25zTWF0Y2godGhpcy5hc3QubWF0Y2hlcnMsIGN1cnJlbnRTdGF0ZSwgbmV4dFN0YXRlLCBlbGVtZW50LCBwYXJhbXMpO1xuICB9XG5cbiAgYnVpbGRTdHlsZXMoc3RhdGVOYW1lOiBzdHJpbmcsIHBhcmFtczoge1trZXk6IHN0cmluZ106IGFueX0sIGVycm9yczogYW55W10pIHtcbiAgICBjb25zdCBiYWNrdXBTdGF0ZVN0eWxlciA9IHRoaXMuX3N0YXRlU3R5bGVzWycqJ107XG4gICAgY29uc3Qgc3RhdGVTdHlsZXIgPSB0aGlzLl9zdGF0ZVN0eWxlc1tzdGF0ZU5hbWVdO1xuICAgIGNvbnN0IGJhY2t1cFN0eWxlcyA9IGJhY2t1cFN0YXRlU3R5bGVyID8gYmFja3VwU3RhdGVTdHlsZXIuYnVpbGRTdHlsZXMocGFyYW1zLCBlcnJvcnMpIDoge307XG4gICAgcmV0dXJuIHN0YXRlU3R5bGVyID8gc3RhdGVTdHlsZXIuYnVpbGRTdHlsZXMocGFyYW1zLCBlcnJvcnMpIDogYmFja3VwU3R5bGVzO1xuICB9XG5cbiAgYnVpbGQoXG4gICAgICBkcml2ZXI6IEFuaW1hdGlvbkRyaXZlciwgZWxlbWVudDogYW55LCBjdXJyZW50U3RhdGU6IGFueSwgbmV4dFN0YXRlOiBhbnksXG4gICAgICBlbnRlckNsYXNzTmFtZTogc3RyaW5nLCBsZWF2ZUNsYXNzTmFtZTogc3RyaW5nLCBjdXJyZW50T3B0aW9ucz86IEFuaW1hdGlvbk9wdGlvbnMsXG4gICAgICBuZXh0T3B0aW9ucz86IEFuaW1hdGlvbk9wdGlvbnMsIHN1Ykluc3RydWN0aW9ucz86IEVsZW1lbnRJbnN0cnVjdGlvbk1hcCxcbiAgICAgIHNraXBBc3RCdWlsZD86IGJvb2xlYW4pOiBBbmltYXRpb25UcmFuc2l0aW9uSW5zdHJ1Y3Rpb24ge1xuICAgIGNvbnN0IGVycm9yczogYW55W10gPSBbXTtcblxuICAgIGNvbnN0IHRyYW5zaXRpb25BbmltYXRpb25QYXJhbXMgPSB0aGlzLmFzdC5vcHRpb25zICYmIHRoaXMuYXN0Lm9wdGlvbnMucGFyYW1zIHx8IEVNUFRZX09CSkVDVDtcbiAgICBjb25zdCBjdXJyZW50QW5pbWF0aW9uUGFyYW1zID0gY3VycmVudE9wdGlvbnMgJiYgY3VycmVudE9wdGlvbnMucGFyYW1zIHx8IEVNUFRZX09CSkVDVDtcbiAgICBjb25zdCBjdXJyZW50U3RhdGVTdHlsZXMgPSB0aGlzLmJ1aWxkU3R5bGVzKGN1cnJlbnRTdGF0ZSwgY3VycmVudEFuaW1hdGlvblBhcmFtcywgZXJyb3JzKTtcbiAgICBjb25zdCBuZXh0QW5pbWF0aW9uUGFyYW1zID0gbmV4dE9wdGlvbnMgJiYgbmV4dE9wdGlvbnMucGFyYW1zIHx8IEVNUFRZX09CSkVDVDtcbiAgICBjb25zdCBuZXh0U3RhdGVTdHlsZXMgPSB0aGlzLmJ1aWxkU3R5bGVzKG5leHRTdGF0ZSwgbmV4dEFuaW1hdGlvblBhcmFtcywgZXJyb3JzKTtcblxuICAgIGNvbnN0IHF1ZXJpZWRFbGVtZW50cyA9IG5ldyBTZXQ8YW55PigpO1xuICAgIGNvbnN0IHByZVN0eWxlTWFwID0gbmV3IE1hcDxhbnksIHtbcHJvcDogc3RyaW5nXTogYm9vbGVhbn0+KCk7XG4gICAgY29uc3QgcG9zdFN0eWxlTWFwID0gbmV3IE1hcDxhbnksIHtbcHJvcDogc3RyaW5nXTogYm9vbGVhbn0+KCk7XG4gICAgY29uc3QgaXNSZW1vdmFsID0gbmV4dFN0YXRlID09PSAndm9pZCc7XG5cbiAgICBjb25zdCBhbmltYXRpb25PcHRpb25zID0ge3BhcmFtczogey4uLnRyYW5zaXRpb25BbmltYXRpb25QYXJhbXMsIC4uLm5leHRBbmltYXRpb25QYXJhbXN9fTtcblxuICAgIGNvbnN0IHRpbWVsaW5lcyA9IHNraXBBc3RCdWlsZCA/IFtdIDogYnVpbGRBbmltYXRpb25UaW1lbGluZXMoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHJpdmVyLCBlbGVtZW50LCB0aGlzLmFzdC5hbmltYXRpb24sIGVudGVyQ2xhc3NOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlYXZlQ2xhc3NOYW1lLCBjdXJyZW50U3RhdGVTdHlsZXMsIG5leHRTdGF0ZVN0eWxlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb25PcHRpb25zLCBzdWJJbnN0cnVjdGlvbnMsIGVycm9ycyk7XG5cbiAgICBsZXQgdG90YWxUaW1lID0gMDtcbiAgICB0aW1lbGluZXMuZm9yRWFjaCh0bCA9PiB7IHRvdGFsVGltZSA9IE1hdGgubWF4KHRsLmR1cmF0aW9uICsgdGwuZGVsYXksIHRvdGFsVGltZSk7IH0pO1xuXG4gICAgaWYgKGVycm9ycy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBjcmVhdGVUcmFuc2l0aW9uSW5zdHJ1Y3Rpb24oXG4gICAgICAgICAgZWxlbWVudCwgdGhpcy5fdHJpZ2dlck5hbWUsIGN1cnJlbnRTdGF0ZSwgbmV4dFN0YXRlLCBpc1JlbW92YWwsIGN1cnJlbnRTdGF0ZVN0eWxlcyxcbiAgICAgICAgICBuZXh0U3RhdGVTdHlsZXMsIFtdLCBbXSwgcHJlU3R5bGVNYXAsIHBvc3RTdHlsZU1hcCwgdG90YWxUaW1lLCBlcnJvcnMpO1xuICAgIH1cblxuICAgIHRpbWVsaW5lcy5mb3JFYWNoKHRsID0+IHtcbiAgICAgIGNvbnN0IGVsbSA9IHRsLmVsZW1lbnQ7XG4gICAgICBjb25zdCBwcmVQcm9wcyA9IGdldE9yU2V0QXNJbk1hcChwcmVTdHlsZU1hcCwgZWxtLCB7fSk7XG4gICAgICB0bC5wcmVTdHlsZVByb3BzLmZvckVhY2gocHJvcCA9PiBwcmVQcm9wc1twcm9wXSA9IHRydWUpO1xuXG4gICAgICBjb25zdCBwb3N0UHJvcHMgPSBnZXRPclNldEFzSW5NYXAocG9zdFN0eWxlTWFwLCBlbG0sIHt9KTtcbiAgICAgIHRsLnBvc3RTdHlsZVByb3BzLmZvckVhY2gocHJvcCA9PiBwb3N0UHJvcHNbcHJvcF0gPSB0cnVlKTtcblxuICAgICAgaWYgKGVsbSAhPT0gZWxlbWVudCkge1xuICAgICAgICBxdWVyaWVkRWxlbWVudHMuYWRkKGVsbSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBxdWVyaWVkRWxlbWVudHNMaXN0ID0gaXRlcmF0b3JUb0FycmF5KHF1ZXJpZWRFbGVtZW50cy52YWx1ZXMoKSk7XG4gICAgcmV0dXJuIGNyZWF0ZVRyYW5zaXRpb25JbnN0cnVjdGlvbihcbiAgICAgICAgZWxlbWVudCwgdGhpcy5fdHJpZ2dlck5hbWUsIGN1cnJlbnRTdGF0ZSwgbmV4dFN0YXRlLCBpc1JlbW92YWwsIGN1cnJlbnRTdGF0ZVN0eWxlcyxcbiAgICAgICAgbmV4dFN0YXRlU3R5bGVzLCB0aW1lbGluZXMsIHF1ZXJpZWRFbGVtZW50c0xpc3QsIHByZVN0eWxlTWFwLCBwb3N0U3R5bGVNYXAsIHRvdGFsVGltZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gb25lT3JNb3JlVHJhbnNpdGlvbnNNYXRjaChcbiAgICBtYXRjaEZuczogVHJhbnNpdGlvbk1hdGNoZXJGbltdLCBjdXJyZW50U3RhdGU6IGFueSwgbmV4dFN0YXRlOiBhbnksIGVsZW1lbnQ6IGFueSxcbiAgICBwYXJhbXM6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogYm9vbGVhbiB7XG4gIHJldHVybiBtYXRjaEZucy5zb21lKGZuID0+IGZuKGN1cnJlbnRTdGF0ZSwgbmV4dFN0YXRlLCBlbGVtZW50LCBwYXJhbXMpKTtcbn1cblxuZXhwb3J0IGNsYXNzIEFuaW1hdGlvblN0YXRlU3R5bGVzIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzdHlsZXM6IFN0eWxlQXN0LCBwcml2YXRlIGRlZmF1bHRQYXJhbXM6IHtba2V5OiBzdHJpbmddOiBhbnl9KSB7fVxuXG4gIGJ1aWxkU3R5bGVzKHBhcmFtczoge1trZXk6IHN0cmluZ106IGFueX0sIGVycm9yczogc3RyaW5nW10pOiDJtVN0eWxlRGF0YSB7XG4gICAgY29uc3QgZmluYWxTdHlsZXM6IMm1U3R5bGVEYXRhID0ge307XG4gICAgY29uc3QgY29tYmluZWRQYXJhbXMgPSBjb3B5T2JqKHRoaXMuZGVmYXVsdFBhcmFtcyk7XG4gICAgT2JqZWN0LmtleXMocGFyYW1zKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBjb25zdCB2YWx1ZSA9IHBhcmFtc1trZXldO1xuICAgICAgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgY29tYmluZWRQYXJhbXNba2V5XSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuc3R5bGVzLnN0eWxlcy5mb3JFYWNoKHZhbHVlID0+IHtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGNvbnN0IHN0eWxlT2JqID0gdmFsdWUgYXMgYW55O1xuICAgICAgICBPYmplY3Qua2V5cyhzdHlsZU9iaikuZm9yRWFjaChwcm9wID0+IHtcbiAgICAgICAgICBsZXQgdmFsID0gc3R5bGVPYmpbcHJvcF07XG4gICAgICAgICAgaWYgKHZhbC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICB2YWwgPSBpbnRlcnBvbGF0ZVBhcmFtcyh2YWwsIGNvbWJpbmVkUGFyYW1zLCBlcnJvcnMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBmaW5hbFN0eWxlc1twcm9wXSA9IHZhbDtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGZpbmFsU3R5bGVzO1xuICB9XG59XG4iXX0=