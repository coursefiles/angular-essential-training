/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const EMPTY_ANIMATION_OPTIONS = {};
/**
 * @record
 */
export function AstVisitor() { }
if (false) {
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstVisitor.prototype.visitTrigger = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstVisitor.prototype.visitState = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstVisitor.prototype.visitTransition = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstVisitor.prototype.visitSequence = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstVisitor.prototype.visitGroup = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstVisitor.prototype.visitAnimate = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstVisitor.prototype.visitStyle = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstVisitor.prototype.visitKeyframes = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstVisitor.prototype.visitReference = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstVisitor.prototype.visitAnimateChild = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstVisitor.prototype.visitAnimateRef = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstVisitor.prototype.visitQuery = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstVisitor.prototype.visitStagger = function (ast, context) { };
}
/**
 * @record
 * @template T
 */
export function Ast() { }
if (false) {
    /** @type {?} */
    Ast.prototype.type;
    /** @type {?} */
    Ast.prototype.options;
}
/**
 * @record
 */
export function TriggerAst() { }
if (false) {
    /** @type {?} */
    TriggerAst.prototype.type;
    /** @type {?} */
    TriggerAst.prototype.name;
    /** @type {?} */
    TriggerAst.prototype.states;
    /** @type {?} */
    TriggerAst.prototype.transitions;
    /** @type {?} */
    TriggerAst.prototype.queryCount;
    /** @type {?} */
    TriggerAst.prototype.depCount;
}
/**
 * @record
 */
export function StateAst() { }
if (false) {
    /** @type {?} */
    StateAst.prototype.type;
    /** @type {?} */
    StateAst.prototype.name;
    /** @type {?} */
    StateAst.prototype.style;
}
/**
 * @record
 */
export function TransitionAst() { }
if (false) {
    /** @type {?} */
    TransitionAst.prototype.matchers;
    /** @type {?} */
    TransitionAst.prototype.animation;
    /** @type {?} */
    TransitionAst.prototype.queryCount;
    /** @type {?} */
    TransitionAst.prototype.depCount;
}
/**
 * @record
 */
export function SequenceAst() { }
if (false) {
    /** @type {?} */
    SequenceAst.prototype.steps;
}
/**
 * @record
 */
export function GroupAst() { }
if (false) {
    /** @type {?} */
    GroupAst.prototype.steps;
}
/**
 * @record
 */
export function AnimateAst() { }
if (false) {
    /** @type {?} */
    AnimateAst.prototype.timings;
    /** @type {?} */
    AnimateAst.prototype.style;
}
/**
 * @record
 */
export function StyleAst() { }
if (false) {
    /** @type {?} */
    StyleAst.prototype.styles;
    /** @type {?} */
    StyleAst.prototype.easing;
    /** @type {?} */
    StyleAst.prototype.offset;
    /** @type {?} */
    StyleAst.prototype.containsDynamicStyles;
    /** @type {?|undefined} */
    StyleAst.prototype.isEmptyStep;
}
/**
 * @record
 */
export function KeyframesAst() { }
if (false) {
    /** @type {?} */
    KeyframesAst.prototype.styles;
}
/**
 * @record
 */
export function ReferenceAst() { }
if (false) {
    /** @type {?} */
    ReferenceAst.prototype.animation;
}
/**
 * @record
 */
export function AnimateChildAst() { }
/**
 * @record
 */
export function AnimateRefAst() { }
if (false) {
    /** @type {?} */
    AnimateRefAst.prototype.animation;
}
/**
 * @record
 */
export function QueryAst() { }
if (false) {
    /** @type {?} */
    QueryAst.prototype.selector;
    /** @type {?} */
    QueryAst.prototype.limit;
    /** @type {?} */
    QueryAst.prototype.optional;
    /** @type {?} */
    QueryAst.prototype.includeSelf;
    /** @type {?} */
    QueryAst.prototype.animation;
    /** @type {?} */
    QueryAst.prototype.originalSelector;
}
/**
 * @record
 */
export function StaggerAst() { }
if (false) {
    /** @type {?} */
    StaggerAst.prototype.timings;
    /** @type {?} */
    StaggerAst.prototype.animation;
}
/**
 * @record
 */
export function TimingAst() { }
if (false) {
    /** @type {?} */
    TimingAst.prototype.duration;
    /** @type {?} */
    TimingAst.prototype.delay;
    /** @type {?} */
    TimingAst.prototype.easing;
    /** @type {?|undefined} */
    TimingAst.prototype.dynamic;
}
/**
 * @record
 */
export function DynamicTimingAst() { }
if (false) {
    /** @type {?} */
    DynamicTimingAst.prototype.strValue;
    /** @type {?} */
    DynamicTimingAst.prototype.dynamic;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX2FzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2FuaW1hdGlvbnMvYnJvd3Nlci9zcmMvZHNsL2FuaW1hdGlvbl9hc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7TUFTTSx1QkFBdUIsR0FBcUIsRUFBRTs7OztBQUVwRCxnQ0FjQzs7Ozs7OztJQWJDLGdFQUFpRDs7Ozs7O0lBQ2pELDhEQUE2Qzs7Ozs7O0lBQzdDLG1FQUF1RDs7Ozs7O0lBQ3ZELGlFQUFtRDs7Ozs7O0lBQ25ELDhEQUE2Qzs7Ozs7O0lBQzdDLGdFQUFpRDs7Ozs7O0lBQ2pELDhEQUE2Qzs7Ozs7O0lBQzdDLGtFQUFxRDs7Ozs7O0lBQ3JELGtFQUFxRDs7Ozs7O0lBQ3JELHFFQUEyRDs7Ozs7O0lBQzNELG1FQUF1RDs7Ozs7O0lBQ3ZELDhEQUE2Qzs7Ozs7O0lBQzdDLGdFQUFpRDs7Ozs7O0FBR25ELHlCQUdDOzs7SUFGQyxtQkFBUTs7SUFDUixzQkFBK0I7Ozs7O0FBR2pDLGdDQU9DOzs7SUFOQywwQkFBb0M7O0lBQ3BDLDBCQUFhOztJQUNiLDRCQUFtQjs7SUFDbkIsaUNBQTZCOztJQUM3QixnQ0FBbUI7O0lBQ25CLDhCQUFpQjs7Ozs7QUFHbkIsOEJBSUM7OztJQUhDLHdCQUFrQzs7SUFDbEMsd0JBQWE7O0lBQ2IseUJBQWdCOzs7OztBQUdsQixtQ0FNQzs7O0lBTEMsaUNBQytGOztJQUMvRixrQ0FBc0M7O0lBQ3RDLG1DQUFtQjs7SUFDbkIsaUNBQWlCOzs7OztBQUduQixpQ0FFQzs7O0lBREMsNEJBQW9DOzs7OztBQUd0Qyw4QkFFQzs7O0lBREMseUJBQW9DOzs7OztBQUd0QyxnQ0FHQzs7O0lBRkMsNkJBQW1COztJQUNuQiwyQkFBNkI7Ozs7O0FBRy9CLDhCQU1DOzs7SUFMQywwQkFBOEI7O0lBQzlCLDBCQUFvQjs7SUFDcEIsMEJBQW9COztJQUNwQix5Q0FBK0I7O0lBQy9CLCtCQUFzQjs7Ozs7QUFHeEIsa0NBQWtHOzs7SUFBckIsOEJBQW1COzs7OztBQUVoRyxrQ0FFQzs7O0lBREMsaUNBQXNDOzs7OztBQUd4QyxxQ0FBbUY7Ozs7QUFFbkYsbUNBRUM7OztJQURDLGtDQUF3Qjs7Ozs7QUFHMUIsOEJBT0M7OztJQU5DLDRCQUFpQjs7SUFDakIseUJBQWM7O0lBQ2QsNEJBQWtCOztJQUNsQiwrQkFBcUI7O0lBQ3JCLDZCQUFzQzs7SUFDdEMsb0NBQXlCOzs7OztBQUczQixnQ0FHQzs7O0lBRkMsNkJBQXdCOztJQUN4QiwrQkFBc0M7Ozs7O0FBR3hDLCtCQUtDOzs7SUFKQyw2QkFBaUI7O0lBQ2pCLDBCQUFjOztJQUNkLDJCQUFvQjs7SUFDcEIsNEJBQWtCOzs7OztBQUdwQixzQ0FHQzs7O0lBRkMsb0NBQWlCOztJQUNqQixtQ0FBYyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7QW5pbWF0ZVRpbWluZ3MsIEFuaW1hdGlvbk1ldGFkYXRhVHlwZSwgQW5pbWF0aW9uT3B0aW9ucywgybVTdHlsZURhdGF9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuXG5jb25zdCBFTVBUWV9BTklNQVRJT05fT1BUSU9OUzogQW5pbWF0aW9uT3B0aW9ucyA9IHt9O1xuXG5leHBvcnQgaW50ZXJmYWNlIEFzdFZpc2l0b3Ige1xuICB2aXNpdFRyaWdnZXIoYXN0OiBUcmlnZ2VyQXN0LCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0U3RhdGUoYXN0OiBTdGF0ZUFzdCwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdFRyYW5zaXRpb24oYXN0OiBUcmFuc2l0aW9uQXN0LCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0U2VxdWVuY2UoYXN0OiBTZXF1ZW5jZUFzdCwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdEdyb3VwKGFzdDogR3JvdXBBc3QsIGNvbnRleHQ6IGFueSk6IGFueTtcbiAgdmlzaXRBbmltYXRlKGFzdDogQW5pbWF0ZUFzdCwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdFN0eWxlKGFzdDogU3R5bGVBc3QsIGNvbnRleHQ6IGFueSk6IGFueTtcbiAgdmlzaXRLZXlmcmFtZXMoYXN0OiBLZXlmcmFtZXNBc3QsIGNvbnRleHQ6IGFueSk6IGFueTtcbiAgdmlzaXRSZWZlcmVuY2UoYXN0OiBSZWZlcmVuY2VBc3QsIGNvbnRleHQ6IGFueSk6IGFueTtcbiAgdmlzaXRBbmltYXRlQ2hpbGQoYXN0OiBBbmltYXRlQ2hpbGRBc3QsIGNvbnRleHQ6IGFueSk6IGFueTtcbiAgdmlzaXRBbmltYXRlUmVmKGFzdDogQW5pbWF0ZVJlZkFzdCwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdFF1ZXJ5KGFzdDogUXVlcnlBc3QsIGNvbnRleHQ6IGFueSk6IGFueTtcbiAgdmlzaXRTdGFnZ2VyKGFzdDogU3RhZ2dlckFzdCwgY29udGV4dDogYW55KTogYW55O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFzdDxUIGV4dGVuZHMgQW5pbWF0aW9uTWV0YWRhdGFUeXBlPiB7XG4gIHR5cGU6IFQ7XG4gIG9wdGlvbnM6IEFuaW1hdGlvbk9wdGlvbnN8bnVsbDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUcmlnZ2VyQXN0IGV4dGVuZHMgQXN0PEFuaW1hdGlvbk1ldGFkYXRhVHlwZS5UcmlnZ2VyPiB7XG4gIHR5cGU6IEFuaW1hdGlvbk1ldGFkYXRhVHlwZS5UcmlnZ2VyO1xuICBuYW1lOiBzdHJpbmc7XG4gIHN0YXRlczogU3RhdGVBc3RbXTtcbiAgdHJhbnNpdGlvbnM6IFRyYW5zaXRpb25Bc3RbXTtcbiAgcXVlcnlDb3VudDogbnVtYmVyO1xuICBkZXBDb3VudDogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFN0YXRlQXN0IGV4dGVuZHMgQXN0PEFuaW1hdGlvbk1ldGFkYXRhVHlwZS5TdGF0ZT4ge1xuICB0eXBlOiBBbmltYXRpb25NZXRhZGF0YVR5cGUuU3RhdGU7XG4gIG5hbWU6IHN0cmluZztcbiAgc3R5bGU6IFN0eWxlQXN0O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRyYW5zaXRpb25Bc3QgZXh0ZW5kcyBBc3Q8QW5pbWF0aW9uTWV0YWRhdGFUeXBlLlRyYW5zaXRpb24+IHtcbiAgbWF0Y2hlcnM6ICgoZnJvbVN0YXRlOiBzdHJpbmcsIHRvU3RhdGU6IHN0cmluZywgZWxlbWVudDogYW55LCBwYXJhbXM6IHtba2V5OiBzdHJpbmddOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbnl9KSA9PiBib29sZWFuKVtdO1xuICBhbmltYXRpb246IEFzdDxBbmltYXRpb25NZXRhZGF0YVR5cGU+O1xuICBxdWVyeUNvdW50OiBudW1iZXI7XG4gIGRlcENvdW50OiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2VxdWVuY2VBc3QgZXh0ZW5kcyBBc3Q8QW5pbWF0aW9uTWV0YWRhdGFUeXBlLlNlcXVlbmNlPiB7XG4gIHN0ZXBzOiBBc3Q8QW5pbWF0aW9uTWV0YWRhdGFUeXBlPltdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdyb3VwQXN0IGV4dGVuZHMgQXN0PEFuaW1hdGlvbk1ldGFkYXRhVHlwZS5Hcm91cD4ge1xuICBzdGVwczogQXN0PEFuaW1hdGlvbk1ldGFkYXRhVHlwZT5bXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBbmltYXRlQXN0IGV4dGVuZHMgQXN0PEFuaW1hdGlvbk1ldGFkYXRhVHlwZS5BbmltYXRlPiB7XG4gIHRpbWluZ3M6IFRpbWluZ0FzdDtcbiAgc3R5bGU6IFN0eWxlQXN0fEtleWZyYW1lc0FzdDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTdHlsZUFzdCBleHRlbmRzIEFzdDxBbmltYXRpb25NZXRhZGF0YVR5cGUuU3R5bGU+IHtcbiAgc3R5bGVzOiAoybVTdHlsZURhdGF8c3RyaW5nKVtdO1xuICBlYXNpbmc6IHN0cmluZ3xudWxsO1xuICBvZmZzZXQ6IG51bWJlcnxudWxsO1xuICBjb250YWluc0R5bmFtaWNTdHlsZXM6IGJvb2xlYW47XG4gIGlzRW1wdHlTdGVwPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBLZXlmcmFtZXNBc3QgZXh0ZW5kcyBBc3Q8QW5pbWF0aW9uTWV0YWRhdGFUeXBlLktleWZyYW1lcz4geyBzdHlsZXM6IFN0eWxlQXN0W107IH1cblxuZXhwb3J0IGludGVyZmFjZSBSZWZlcmVuY2VBc3QgZXh0ZW5kcyBBc3Q8QW5pbWF0aW9uTWV0YWRhdGFUeXBlLlJlZmVyZW5jZT4ge1xuICBhbmltYXRpb246IEFzdDxBbmltYXRpb25NZXRhZGF0YVR5cGU+O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFuaW1hdGVDaGlsZEFzdCBleHRlbmRzIEFzdDxBbmltYXRpb25NZXRhZGF0YVR5cGUuQW5pbWF0ZUNoaWxkPiB7fVxuXG5leHBvcnQgaW50ZXJmYWNlIEFuaW1hdGVSZWZBc3QgZXh0ZW5kcyBBc3Q8QW5pbWF0aW9uTWV0YWRhdGFUeXBlLkFuaW1hdGVSZWY+IHtcbiAgYW5pbWF0aW9uOiBSZWZlcmVuY2VBc3Q7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUXVlcnlBc3QgZXh0ZW5kcyBBc3Q8QW5pbWF0aW9uTWV0YWRhdGFUeXBlLlF1ZXJ5PiB7XG4gIHNlbGVjdG9yOiBzdHJpbmc7XG4gIGxpbWl0OiBudW1iZXI7XG4gIG9wdGlvbmFsOiBib29sZWFuO1xuICBpbmNsdWRlU2VsZjogYm9vbGVhbjtcbiAgYW5pbWF0aW9uOiBBc3Q8QW5pbWF0aW9uTWV0YWRhdGFUeXBlPjtcbiAgb3JpZ2luYWxTZWxlY3Rvcjogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFN0YWdnZXJBc3QgZXh0ZW5kcyBBc3Q8QW5pbWF0aW9uTWV0YWRhdGFUeXBlLlN0YWdnZXI+IHtcbiAgdGltaW5nczogQW5pbWF0ZVRpbWluZ3M7XG4gIGFuaW1hdGlvbjogQXN0PEFuaW1hdGlvbk1ldGFkYXRhVHlwZT47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVGltaW5nQXN0IHtcbiAgZHVyYXRpb246IG51bWJlcjtcbiAgZGVsYXk6IG51bWJlcjtcbiAgZWFzaW5nOiBzdHJpbmd8bnVsbDtcbiAgZHluYW1pYz86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRHluYW1pY1RpbWluZ0FzdCBleHRlbmRzIFRpbWluZ0FzdCB7XG4gIHN0clZhbHVlOiBzdHJpbmc7XG4gIGR5bmFtaWM6IHRydWU7XG59XG4iXX0=