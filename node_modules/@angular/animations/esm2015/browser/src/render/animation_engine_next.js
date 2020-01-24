/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { buildAnimationAst } from '../dsl/animation_ast_builder';
import { buildTrigger } from '../dsl/animation_trigger';
import { parseTimelineCommand } from './shared';
import { TimelineAnimationEngine } from './timeline_animation_engine';
import { TransitionAnimationEngine } from './transition_animation_engine';
export class AnimationEngine {
    /**
     * @param {?} bodyNode
     * @param {?} _driver
     * @param {?} normalizer
     */
    constructor(bodyNode, _driver, normalizer) {
        this.bodyNode = bodyNode;
        this._driver = _driver;
        this._triggerCache = {};
        // this method is designed to be overridden by the code that uses this engine
        this.onRemovalComplete = (/**
         * @param {?} element
         * @param {?} context
         * @return {?}
         */
        (element, context) => { });
        this._transitionEngine = new TransitionAnimationEngine(bodyNode, _driver, normalizer);
        this._timelineEngine = new TimelineAnimationEngine(bodyNode, _driver, normalizer);
        this._transitionEngine.onRemovalComplete = (/**
         * @param {?} element
         * @param {?} context
         * @return {?}
         */
        (element, context) => this.onRemovalComplete(element, context));
    }
    /**
     * @param {?} componentId
     * @param {?} namespaceId
     * @param {?} hostElement
     * @param {?} name
     * @param {?} metadata
     * @return {?}
     */
    registerTrigger(componentId, namespaceId, hostElement, name, metadata) {
        /** @type {?} */
        const cacheKey = componentId + '-' + name;
        /** @type {?} */
        let trigger = this._triggerCache[cacheKey];
        if (!trigger) {
            /** @type {?} */
            const errors = [];
            /** @type {?} */
            const ast = (/** @type {?} */ (buildAnimationAst(this._driver, (/** @type {?} */ (metadata)), errors)));
            if (errors.length) {
                throw new Error(`The animation trigger "${name}" has failed to build due to the following errors:\n - ${errors.join("\n - ")}`);
            }
            trigger = buildTrigger(name, ast);
            this._triggerCache[cacheKey] = trigger;
        }
        this._transitionEngine.registerTrigger(namespaceId, name, trigger);
    }
    /**
     * @param {?} namespaceId
     * @param {?} hostElement
     * @return {?}
     */
    register(namespaceId, hostElement) {
        this._transitionEngine.register(namespaceId, hostElement);
    }
    /**
     * @param {?} namespaceId
     * @param {?} context
     * @return {?}
     */
    destroy(namespaceId, context) {
        this._transitionEngine.destroy(namespaceId, context);
    }
    /**
     * @param {?} namespaceId
     * @param {?} element
     * @param {?} parent
     * @param {?} insertBefore
     * @return {?}
     */
    onInsert(namespaceId, element, parent, insertBefore) {
        this._transitionEngine.insertNode(namespaceId, element, parent, insertBefore);
    }
    /**
     * @param {?} namespaceId
     * @param {?} element
     * @param {?} context
     * @param {?=} isHostElement
     * @return {?}
     */
    onRemove(namespaceId, element, context, isHostElement) {
        this._transitionEngine.removeNode(namespaceId, element, isHostElement || false, context);
    }
    /**
     * @param {?} element
     * @param {?} disable
     * @return {?}
     */
    disableAnimations(element, disable) {
        this._transitionEngine.markElementAsDisabled(element, disable);
    }
    /**
     * @param {?} namespaceId
     * @param {?} element
     * @param {?} property
     * @param {?} value
     * @return {?}
     */
    process(namespaceId, element, property, value) {
        if (property.charAt(0) == '@') {
            const [id, action] = parseTimelineCommand(property);
            /** @type {?} */
            const args = (/** @type {?} */ (value));
            this._timelineEngine.command(id, element, action, args);
        }
        else {
            this._transitionEngine.trigger(namespaceId, element, property, value);
        }
    }
    /**
     * @param {?} namespaceId
     * @param {?} element
     * @param {?} eventName
     * @param {?} eventPhase
     * @param {?} callback
     * @return {?}
     */
    listen(namespaceId, element, eventName, eventPhase, callback) {
        // @@listen
        if (eventName.charAt(0) == '@') {
            const [id, action] = parseTimelineCommand(eventName);
            return this._timelineEngine.listen(id, element, action, callback);
        }
        return this._transitionEngine.listen(namespaceId, element, eventName, eventPhase, callback);
    }
    /**
     * @param {?=} microtaskId
     * @return {?}
     */
    flush(microtaskId = -1) { this._transitionEngine.flush(microtaskId); }
    /**
     * @return {?}
     */
    get players() {
        return ((/** @type {?} */ (this._transitionEngine.players)))
            .concat((/** @type {?} */ (this._timelineEngine.players)));
    }
    /**
     * @return {?}
     */
    whenRenderingDone() { return this._transitionEngine.whenRenderingDone(); }
}
if (false) {
    /**
     * @type {?}
     * @private
     */
    AnimationEngine.prototype._transitionEngine;
    /**
     * @type {?}
     * @private
     */
    AnimationEngine.prototype._timelineEngine;
    /**
     * @type {?}
     * @private
     */
    AnimationEngine.prototype._triggerCache;
    /** @type {?} */
    AnimationEngine.prototype.onRemovalComplete;
    /**
     * @type {?}
     * @private
     */
    AnimationEngine.prototype.bodyNode;
    /**
     * @type {?}
     * @private
     */
    AnimationEngine.prototype._driver;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX2VuZ2luZV9uZXh0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYW5pbWF0aW9ucy9icm93c2VyL3NyYy9yZW5kZXIvYW5pbWF0aW9uX2VuZ2luZV9uZXh0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFTQSxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSw4QkFBOEIsQ0FBQztBQUMvRCxPQUFPLEVBQW1CLFlBQVksRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBSXhFLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUM5QyxPQUFPLEVBQUMsdUJBQXVCLEVBQUMsTUFBTSw2QkFBNkIsQ0FBQztBQUNwRSxPQUFPLEVBQUMseUJBQXlCLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQztBQUV4RSxNQUFNLE9BQU8sZUFBZTs7Ozs7O0lBUzFCLFlBQ1ksUUFBYSxFQUFVLE9BQXdCLEVBQ3ZELFVBQW9DO1FBRDVCLGFBQVEsR0FBUixRQUFRLENBQUs7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFpQjtRQU5uRCxrQkFBYSxHQUFzQyxFQUFFLENBQUM7O1FBR3ZELHNCQUFpQjs7Ozs7UUFBRyxDQUFDLE9BQVksRUFBRSxPQUFZLEVBQUUsRUFBRSxHQUFFLENBQUMsRUFBQztRQUs1RCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSx5QkFBeUIsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3RGLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSx1QkFBdUIsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBRWxGLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxpQkFBaUI7Ozs7O1FBQUcsQ0FBQyxPQUFZLEVBQUUsT0FBWSxFQUFFLEVBQUUsQ0FDdEUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxPQUFP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LE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLEVBQUU7a0JBQ3hCLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxHQUFHLG9CQUFvQixDQUFDLFNBQVMsQ0FBQztZQUNwRCxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQ25FO1FBQ0QsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM5RixDQUFDOzs7OztJQUVELEtBQUssQ0FBQyxjQUFzQixDQUFDLENBQUMsSUFBVSxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7OztJQUVwRixJQUFJLE9BQU87UUFDVCxPQUFPLENBQUMsbUJBQUEsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sRUFBcUIsQ0FBQzthQUN2RCxNQUFNLENBQUMsbUJBQUEsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQXFCLENBQUMsQ0FBQztJQUNqRSxDQUFDOzs7O0lBRUQsaUJBQWlCLEtBQW1CLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxDQUFDO0NBQ3pGOzs7Ozs7SUF0RkMsNENBQXFEOzs7OztJQUNyRCwwQ0FBaUQ7Ozs7O0lBRWpELHdDQUE4RDs7SUFHOUQsNENBQThEOzs7OztJQUcxRCxtQ0FBcUI7Ozs7O0lBQUUsa0NBQWdDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtBbmltYXRpb25NZXRhZGF0YSwgQW5pbWF0aW9uUGxheWVyLCBBbmltYXRpb25UcmlnZ2VyTWV0YWRhdGF9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtUcmlnZ2VyQXN0fSBmcm9tICcuLi9kc2wvYW5pbWF0aW9uX2FzdCc7XG5pbXBvcnQge2J1aWxkQW5pbWF0aW9uQXN0fSBmcm9tICcuLi9kc2wvYW5pbWF0aW9uX2FzdF9idWlsZGVyJztcbmltcG9ydCB7QW5pbWF0aW9uVHJpZ2dlciwgYnVpbGRUcmlnZ2VyfSBmcm9tICcuLi9kc2wvYW5pbWF0aW9uX3RyaWdnZXInO1xuaW1wb3J0IHtBbmltYXRpb25TdHlsZU5vcm1hbGl6ZXJ9IGZyb20gJy4uL2RzbC9zdHlsZV9ub3JtYWxpemF0aW9uL2FuaW1hdGlvbl9zdHlsZV9ub3JtYWxpemVyJztcblxuaW1wb3J0IHtBbmltYXRpb25Ecml2ZXJ9IGZyb20gJy4vYW5pbWF0aW9uX2RyaXZlcic7XG5pbXBvcnQge3BhcnNlVGltZWxpbmVDb21tYW5kfSBmcm9tICcuL3NoYXJlZCc7XG5pbXBvcnQge1RpbWVsaW5lQW5pbWF0aW9uRW5naW5lfSBmcm9tICcuL3RpbWVsaW5lX2FuaW1hdGlvbl9lbmdpbmUnO1xuaW1wb3J0IHtUcmFuc2l0aW9uQW5pbWF0aW9uRW5naW5lfSBmcm9tICcuL3RyYW5zaXRpb25fYW5pbWF0aW9uX2VuZ2luZSc7XG5cbmV4cG9ydCBjbGFzcyBBbmltYXRpb25FbmdpbmUge1xuICBwcml2YXRlIF90cmFuc2l0aW9uRW5naW5lOiBUcmFuc2l0aW9uQW5pbWF0aW9uRW5naW5lO1xuICBwcml2YXRlIF90aW1lbGluZUVuZ2luZTogVGltZWxpbmVBbmltYXRpb25FbmdpbmU7XG5cbiAgcHJpdmF0ZSBfdHJpZ2dlckNhY2hlOiB7W2tleTogc3RyaW5nXTogQW5pbWF0aW9uVHJpZ2dlcn0gPSB7fTtcblxuICAvLyB0aGlzIG1ldGhvZCBpcyBkZXNpZ25lZCB0byBiZSBvdmVycmlkZGVuIGJ5IHRoZSBjb2RlIHRoYXQgdXNlcyB0aGlzIGVuZ2luZVxuICBwdWJsaWMgb25SZW1vdmFsQ29tcGxldGUgPSAoZWxlbWVudDogYW55LCBjb250ZXh0OiBhbnkpID0+IHt9O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBib2R5Tm9kZTogYW55LCBwcml2YXRlIF9kcml2ZXI6IEFuaW1hdGlvbkRyaXZlcixcbiAgICAgIG5vcm1hbGl6ZXI6IEFuaW1hdGlvblN0eWxlTm9ybWFsaXplcikge1xuICAgIHRoaXMuX3RyYW5zaXRpb25FbmdpbmUgPSBuZXcgVHJhbnNpdGlvbkFuaW1hdGlvbkVuZ2luZShib2R5Tm9kZSwgX2RyaXZlciwgbm9ybWFsaXplcik7XG4gICAgdGhpcy5fdGltZWxpbmVFbmdpbmUgPSBuZXcgVGltZWxpbmVBbmltYXRpb25FbmdpbmUoYm9keU5vZGUsIF9kcml2ZXIsIG5vcm1hbGl6ZXIpO1xuXG4gICAgdGhpcy5fdHJhbnNpdGlvbkVuZ2luZS5vblJlbW92YWxDb21wbGV0ZSA9IChlbGVtZW50OiBhbnksIGNvbnRleHQ6IGFueSkgPT5cbiAgICAgICAgdGhpcy5vblJlbW92YWxDb21wbGV0ZShlbGVtZW50LCBjb250ZXh0KTtcbiAgfVxuXG4gIHJlZ2lzdGVyVHJpZ2dlcihcbiAgICAgIGNvbXBvbmVudElkOiBzdHJpbmcsIG5hbWVzcGFjZUlkOiBzdHJpbmcsIGhvc3RFbGVtZW50OiBhbnksIG5hbWU6IHN0cmluZyxcbiAgICAgIG1ldGFkYXRhOiBBbmltYXRpb25UcmlnZ2VyTWV0YWRhdGEpOiB2b2lkIHtcbiAgICBjb25zdCBjYWNoZUtleSA9IGNvbXBvbmVudElkICsgJy0nICsgbmFtZTtcbiAgICBsZXQgdHJpZ2dlciA9IHRoaXMuX3RyaWdnZXJDYWNoZVtjYWNoZUtleV07XG4gICAgaWYgKCF0cmlnZ2VyKSB7XG4gICAgICBjb25zdCBlcnJvcnM6IGFueVtdID0gW107XG4gICAgICBjb25zdCBhc3QgPVxuICAgICAgICAgIGJ1aWxkQW5pbWF0aW9uQXN0KHRoaXMuX2RyaXZlciwgbWV0YWRhdGEgYXMgQW5pbWF0aW9uTWV0YWRhdGEsIGVycm9ycykgYXMgVHJpZ2dlckFzdDtcbiAgICAgIGlmIChlcnJvcnMubGVuZ3RoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIGBUaGUgYW5pbWF0aW9uIHRyaWdnZXIgXCIke25hbWV9XCIgaGFzIGZhaWxlZCB0byBidWlsZCBkdWUgdG8gdGhlIGZvbGxvd2luZyBlcnJvcnM6XFxuIC0gJHtlcnJvcnMuam9pbihcIlxcbiAtIFwiKX1gKTtcbiAgICAgIH1cbiAgICAgIHRyaWdnZXIgPSBidWlsZFRyaWdnZXIobmFtZSwgYXN0KTtcbiAgICAgIHRoaXMuX3RyaWdnZXJDYWNoZVtjYWNoZUtleV0gPSB0cmlnZ2VyO1xuICAgIH1cbiAgICB0aGlzLl90cmFuc2l0aW9uRW5naW5lLnJlZ2lzdGVyVHJpZ2dlcihuYW1lc3BhY2VJZCwgbmFtZSwgdHJpZ2dlcik7XG4gIH1cblxuICByZWdpc3RlcihuYW1lc3BhY2VJZDogc3RyaW5nLCBob3N0RWxlbWVudDogYW55KSB7XG4gICAgdGhpcy5fdHJhbnNpdGlvbkVuZ2luZS5yZWdpc3RlcihuYW1lc3BhY2VJZCwgaG9zdEVsZW1lbnQpO1xuICB9XG5cbiAgZGVzdHJveShuYW1lc3BhY2VJZDogc3RyaW5nLCBjb250ZXh0OiBhbnkpIHtcbiAgICB0aGlzLl90cmFuc2l0aW9uRW5naW5lLmRlc3Ryb3kobmFtZXNwYWNlSWQsIGNvbnRleHQpO1xuICB9XG5cbiAgb25JbnNlcnQobmFtZXNwYWNlSWQ6IHN0cmluZywgZWxlbWVudDogYW55LCBwYXJlbnQ6IGFueSwgaW5zZXJ0QmVmb3JlOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5fdHJhbnNpdGlvbkVuZ2luZS5pbnNlcnROb2RlKG5hbWVzcGFjZUlkLCBlbGVtZW50LCBwYXJlbnQsIGluc2VydEJlZm9yZSk7XG4gIH1cblxuICBvblJlbW92ZShuYW1lc3BhY2VJZDogc3RyaW5nLCBlbGVtZW50OiBhbnksIGNvbnRleHQ6IGFueSwgaXNIb3N0RWxlbWVudD86IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLl90cmFuc2l0aW9uRW5naW5lLnJlbW92ZU5vZGUobmFtZXNwYWNlSWQsIGVsZW1lbnQsIGlzSG9zdEVsZW1lbnQgfHwgZmFsc2UsIGNvbnRleHQpO1xuICB9XG5cbiAgZGlzYWJsZUFuaW1hdGlvbnMoZWxlbWVudDogYW55LCBkaXNhYmxlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fdHJhbnNpdGlvbkVuZ2luZS5tYXJrRWxlbWVudEFzRGlzYWJsZWQoZWxlbWVudCwgZGlzYWJsZSk7XG4gIH1cblxuICBwcm9jZXNzKG5hbWVzcGFjZUlkOiBzdHJpbmcsIGVsZW1lbnQ6IGFueSwgcHJvcGVydHk6IHN0cmluZywgdmFsdWU6IGFueSkge1xuICAgIGlmIChwcm9wZXJ0eS5jaGFyQXQoMCkgPT0gJ0AnKSB7XG4gICAgICBjb25zdCBbaWQsIGFjdGlvbl0gPSBwYXJzZVRpbWVsaW5lQ29tbWFuZChwcm9wZXJ0eSk7XG4gICAgICBjb25zdCBhcmdzID0gdmFsdWUgYXMgYW55W107XG4gICAgICB0aGlzLl90aW1lbGluZUVuZ2luZS5jb21tYW5kKGlkLCBlbGVtZW50LCBhY3Rpb24sIGFyZ3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl90cmFuc2l0aW9uRW5naW5lLnRyaWdnZXIobmFtZXNwYWNlSWQsIGVsZW1lbnQsIHByb3BlcnR5LCB2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgbGlzdGVuKFxuICAgICAgbmFtZXNwYWNlSWQ6IHN0cmluZywgZWxlbWVudDogYW55LCBldmVudE5hbWU6IHN0cmluZywgZXZlbnRQaGFzZTogc3RyaW5nLFxuICAgICAgY2FsbGJhY2s6IChldmVudDogYW55KSA9PiBhbnkpOiAoKSA9PiBhbnkge1xuICAgIC8vIEBAbGlzdGVuXG4gICAgaWYgKGV2ZW50TmFtZS5jaGFyQXQoMCkgPT0gJ0AnKSB7XG4gICAgICBjb25zdCBbaWQsIGFjdGlvbl0gPSBwYXJzZVRpbWVsaW5lQ29tbWFuZChldmVudE5hbWUpO1xuICAgICAgcmV0dXJuIHRoaXMuX3RpbWVsaW5lRW5naW5lLmxpc3RlbihpZCwgZWxlbWVudCwgYWN0aW9uLCBjYWxsYmFjayk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl90cmFuc2l0aW9uRW5naW5lLmxpc3RlbihuYW1lc3BhY2VJZCwgZWxlbWVudCwgZXZlbnROYW1lLCBldmVudFBoYXNlLCBjYWxsYmFjayk7XG4gIH1cblxuICBmbHVzaChtaWNyb3Rhc2tJZDogbnVtYmVyID0gLTEpOiB2b2lkIHsgdGhpcy5fdHJhbnNpdGlvbkVuZ2luZS5mbHVzaChtaWNyb3Rhc2tJZCk7IH1cblxuICBnZXQgcGxheWVycygpOiBBbmltYXRpb25QbGF5ZXJbXSB7XG4gICAgcmV0dXJuICh0aGlzLl90cmFuc2l0aW9uRW5naW5lLnBsYXllcnMgYXMgQW5pbWF0aW9uUGxheWVyW10pXG4gICAgICAgIC5jb25jYXQodGhpcy5fdGltZWxpbmVFbmdpbmUucGxheWVycyBhcyBBbmltYXRpb25QbGF5ZXJbXSk7XG4gIH1cblxuICB3aGVuUmVuZGVyaW5nRG9uZSgpOiBQcm9taXNlPGFueT4geyByZXR1cm4gdGhpcy5fdHJhbnNpdGlvbkVuZ2luZS53aGVuUmVuZGVyaW5nRG9uZSgpOyB9XG59XG4iXX0=