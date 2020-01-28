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
import { scheduleMicroTask } from '../util';
/**
 * Provides programmatic control of a reusable animation sequence,
 * built using the `build()` method of `AnimationBuilder`. The `build()` method
 * returns a factory, whose `create()` method instantiates and initializes this interface.
 *
 * @see `AnimationBuilder`
 * @see `AnimationFactory`
 * @see `animate()`
 *
 * \@publicApi
 * @record
 */
export function AnimationPlayer() { }
if (false) {
    /**
     * The parent of this player, if any.
     * @type {?}
     */
    AnimationPlayer.prototype.parentPlayer;
    /**
     * The total run time of the animation, in milliseconds.
     * @type {?}
     */
    AnimationPlayer.prototype.totalTime;
    /**
     * Provides a callback to invoke before the animation is destroyed.
     * @type {?|undefined}
     */
    AnimationPlayer.prototype.beforeDestroy;
    /**
     * \@internal
     * Internal
     * @type {?|undefined}
     */
    AnimationPlayer.prototype.triggerCallback;
    /**
     * \@internal
     * Internal
     * @type {?|undefined}
     */
    AnimationPlayer.prototype.disabled;
    /**
     * Provides a callback to invoke when the animation finishes.
     * @see `finish()`
     * @param {?} fn The callback function.
     * @return {?}
     */
    AnimationPlayer.prototype.onDone = function (fn) { };
    /**
     * Provides a callback to invoke when the animation starts.
     * @see `run()`
     * @param {?} fn The callback function.
     * @return {?}
     */
    AnimationPlayer.prototype.onStart = function (fn) { };
    /**
     * Provides a callback to invoke after the animation is destroyed.
     * @see `destroy()` / `beforeDestroy()`
     * @param {?} fn The callback function.
     * @return {?}
     */
    AnimationPlayer.prototype.onDestroy = function (fn) { };
    /**
     * Initializes the animation.
     * @return {?}
     */
    AnimationPlayer.prototype.init = function () { };
    /**
     * Reports whether the animation has started.
     * @return {?} True if the animation has started, false otherwise.
     */
    AnimationPlayer.prototype.hasStarted = function () { };
    /**
     * Runs the animation, invoking the `onStart()` callback.
     * @return {?}
     */
    AnimationPlayer.prototype.play = function () { };
    /**
     * Pauses the animation.
     * @return {?}
     */
    AnimationPlayer.prototype.pause = function () { };
    /**
     * Restarts the paused animation.
     * @return {?}
     */
    AnimationPlayer.prototype.restart = function () { };
    /**
     * Ends the animation, invoking the `onDone()` callback.
     * @return {?}
     */
    AnimationPlayer.prototype.finish = function () { };
    /**
     * Destroys the animation, after invoking the `beforeDestroy()` callback.
     * Calls the `onDestroy()` callback when destruction is completed.
     * @return {?}
     */
    AnimationPlayer.prototype.destroy = function () { };
    /**
     * Resets the animation to its initial state.
     * @return {?}
     */
    AnimationPlayer.prototype.reset = function () { };
    /**
     * Sets the position of the animation.
     * @param {?} position A 0-based offset into the duration, in milliseconds.
     * @return {?}
     */
    AnimationPlayer.prototype.setPosition = function (position) { };
    /**
     * Reports the current position of the animation.
     * @return {?} A 0-based offset into the duration, in milliseconds.
     */
    AnimationPlayer.prototype.getPosition = function () { };
}
/**
 * An empty programmatic controller for reusable animations.
 * Used internally when animations are disabled, to avoid
 * checking for the null case when an animation player is expected.
 *
 * @see `animate()`
 * @see `AnimationPlayer`
 * @see `GroupPlayer`
 *
 * \@publicApi
 */
export class NoopAnimationPlayer {
    /**
     * @param {?=} duration
     * @param {?=} delay
     */
    constructor(duration = 0, delay = 0) {
        this._onDoneFns = [];
        this._onStartFns = [];
        this._onDestroyFns = [];
        this._started = false;
        this._destroyed = false;
        this._finished = false;
        this.parentPlayer = null;
        this.totalTime = duration + delay;
    }
    /**
     * @private
     * @return {?}
     */
    _onFinish() {
        if (!this._finished) {
            this._finished = true;
            this._onDoneFns.forEach((/**
             * @param {?} fn
             * @return {?}
             */
            fn => fn()));
            this._onDoneFns = [];
        }
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    onStart(fn) { this._onStartFns.push(fn); }
    /**
     * @param {?} fn
     * @return {?}
     */
    onDone(fn) { this._onDoneFns.push(fn); }
    /**
     * @param {?} fn
     * @return {?}
     */
    onDestroy(fn) { this._onDestroyFns.push(fn); }
    /**
     * @return {?}
     */
    hasStarted() { return this._started; }
    /**
     * @return {?}
     */
    init() { }
    /**
     * @return {?}
     */
    play() {
        if (!this.hasStarted()) {
            this._onStart();
            this.triggerMicrotask();
        }
        this._started = true;
    }
    /**
     * \@internal
     * @return {?}
     */
    triggerMicrotask() { scheduleMicroTask((/**
     * @return {?}
     */
    () => this._onFinish())); }
    /**
     * @private
     * @return {?}
     */
    _onStart() {
        this._onStartFns.forEach((/**
         * @param {?} fn
         * @return {?}
         */
        fn => fn()));
        this._onStartFns = [];
    }
    /**
     * @return {?}
     */
    pause() { }
    /**
     * @return {?}
     */
    restart() { }
    /**
     * @return {?}
     */
    finish() { this._onFinish(); }
    /**
     * @return {?}
     */
    destroy() {
        if (!this._destroyed) {
            this._destroyed = true;
            if (!this.hasStarted()) {
                this._onStart();
            }
            this.finish();
            this._onDestroyFns.forEach((/**
             * @param {?} fn
             * @return {?}
             */
            fn => fn()));
            this._onDestroyFns = [];
        }
    }
    /**
     * @return {?}
     */
    reset() { }
    /**
     * @param {?} position
     * @return {?}
     */
    setPosition(position) { }
    /**
     * @return {?}
     */
    getPosition() { return 0; }
    /**
     * \@internal
     * @param {?} phaseName
     * @return {?}
     */
    triggerCallback(phaseName) {
        /** @type {?} */
        const methods = phaseName == 'start' ? this._onStartFns : this._onDoneFns;
        methods.forEach((/**
         * @param {?} fn
         * @return {?}
         */
        fn => fn()));
        methods.length = 0;
    }
}
if (false) {
    /**
     * @type {?}
     * @private
     */
    NoopAnimationPlayer.prototype._onDoneFns;
    /**
     * @type {?}
     * @private
     */
    NoopAnimationPlayer.prototype._onStartFns;
    /**
     * @type {?}
     * @private
     */
    NoopAnimationPlayer.prototype._onDestroyFns;
    /**
     * @type {?}
     * @private
     */
    NoopAnimationPlayer.prototype._started;
    /**
     * @type {?}
     * @private
     */
    NoopAnimationPlayer.prototype._destroyed;
    /**
     * @type {?}
     * @private
     */
    NoopAnimationPlayer.prototype._finished;
    /** @type {?} */
    NoopAnimationPlayer.prototype.parentPlayer;
    /** @type {?} */
    NoopAnimationPlayer.prototype.totalTime;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX3BsYXllci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2FuaW1hdGlvbnMvc3JjL3BsYXllcnMvYW5pbWF0aW9uX3BsYXllci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQU9BLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLFNBQVMsQ0FBQzs7Ozs7Ozs7Ozs7OztBQWExQyxxQ0FvRkM7Ozs7OztJQWpCQyx1Q0FBbUM7Ozs7O0lBSW5DLG9DQUEyQjs7Ozs7SUFJM0Isd0NBQTBCOzs7Ozs7SUFJMUIsMENBQThDOzs7Ozs7SUFJOUMsbUNBQW1COzs7Ozs7O0lBN0VuQixxREFBNkI7Ozs7Ozs7SUFNN0Isc0RBQThCOzs7Ozs7O0lBTzlCLHdEQUFnQzs7Ozs7SUFJaEMsaURBQWE7Ozs7O0lBS2IsdURBQXNCOzs7OztJQUl0QixpREFBYTs7Ozs7SUFJYixrREFBYzs7Ozs7SUFJZCxvREFBZ0I7Ozs7O0lBSWhCLG1EQUFlOzs7Ozs7SUFLZixvREFBZ0I7Ozs7O0lBSWhCLGtEQUFjOzs7Ozs7SUFLZCxnRUFBbUQ7Ozs7O0lBS25ELHdEQUFzQjs7Ozs7Ozs7Ozs7OztBQWtDeEIsTUFBTSxPQUFPLG1CQUFtQjs7Ozs7SUFTOUIsWUFBWSxXQUFtQixDQUFDLEVBQUUsUUFBZ0IsQ0FBQztRQVIzQyxlQUFVLEdBQWUsRUFBRSxDQUFDO1FBQzVCLGdCQUFXLEdBQWUsRUFBRSxDQUFDO1FBQzdCLGtCQUFhLEdBQWUsRUFBRSxDQUFDO1FBQy9CLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFDakIsZUFBVSxHQUFHLEtBQUssQ0FBQztRQUNuQixjQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ25CLGlCQUFZLEdBQXlCLElBQUksQ0FBQztRQUVNLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxHQUFHLEtBQUssQ0FBQztJQUFDLENBQUM7Ozs7O0lBQ25GLFNBQVM7UUFDZixJQUFJLENB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Q0FBaUQ7O0lBQ2pELHdDQUFrQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7c2NoZWR1bGVNaWNyb1Rhc2t9IGZyb20gJy4uL3V0aWwnO1xuXG4vKipcbiAqIFByb3ZpZGVzIHByb2dyYW1tYXRpYyBjb250cm9sIG9mIGEgcmV1c2FibGUgYW5pbWF0aW9uIHNlcXVlbmNlLFxuICogYnVpbHQgdXNpbmcgdGhlIGBidWlsZCgpYCBtZXRob2Qgb2YgYEFuaW1hdGlvbkJ1aWxkZXJgLiBUaGUgYGJ1aWxkKClgIG1ldGhvZFxuICogcmV0dXJucyBhIGZhY3RvcnksIHdob3NlIGBjcmVhdGUoKWAgbWV0aG9kIGluc3RhbnRpYXRlcyBhbmQgaW5pdGlhbGl6ZXMgdGhpcyBpbnRlcmZhY2UuXG4gKlxuICogQHNlZSBgQW5pbWF0aW9uQnVpbGRlcmBcbiAqIEBzZWUgYEFuaW1hdGlvbkZhY3RvcnlgXG4gKiBAc2VlIGBhbmltYXRlKClgXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFuaW1hdGlvblBsYXllciB7XG4gIC8qKlxuICAgKiBQcm92aWRlcyBhIGNhbGxiYWNrIHRvIGludm9rZSB3aGVuIHRoZSBhbmltYXRpb24gZmluaXNoZXMuXG4gICAqIEBwYXJhbSBmbiBUaGUgY2FsbGJhY2sgZnVuY3Rpb24uXG4gICAqIEBzZWUgYGZpbmlzaCgpYFxuICAgKi9cbiAgb25Eb25lKGZuOiAoKSA9PiB2b2lkKTogdm9pZDtcbiAgLyoqXG4gICAqIFByb3ZpZGVzIGEgY2FsbGJhY2sgdG8gaW52b2tlIHdoZW4gdGhlIGFuaW1hdGlvbiBzdGFydHMuXG4gICAqIEBwYXJhbSBmbiBUaGUgY2FsbGJhY2sgZnVuY3Rpb24uXG4gICAqIEBzZWUgYHJ1bigpYFxuICAgKi9cbiAgb25TdGFydChmbjogKCkgPT4gdm9pZCk6IHZvaWQ7XG4gIC8qKlxuICAgKiBQcm92aWRlcyBhIGNhbGxiYWNrIHRvIGludm9rZSBhZnRlciB0aGUgYW5pbWF0aW9uIGlzIGRlc3Ryb3llZC5cbiAgICogQHBhcmFtIGZuIFRoZSBjYWxsYmFjayBmdW5jdGlvbi5cbiAgICogQHNlZSBgZGVzdHJveSgpYFxuICAgKiBAc2VlIGBiZWZvcmVEZXN0cm95KClgXG4gICAqL1xuICBvbkRlc3Ryb3koZm46ICgpID0+IHZvaWQpOiB2b2lkO1xuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgdGhlIGFuaW1hdGlvbi5cbiAgICovXG4gIGluaXQoKTogdm9pZDtcbiAgLyoqXG4gICAqIFJlcG9ydHMgd2hldGhlciB0aGUgYW5pbWF0aW9uIGhhcyBzdGFydGVkLlxuICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBhbmltYXRpb24gaGFzIHN0YXJ0ZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG4gIGhhc1N0YXJ0ZWQoKTogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFJ1bnMgdGhlIGFuaW1hdGlvbiwgaW52b2tpbmcgdGhlIGBvblN0YXJ0KClgIGNhbGxiYWNrLlxuICAgKi9cbiAgcGxheSgpOiB2b2lkO1xuICAvKipcbiAgICogUGF1c2VzIHRoZSBhbmltYXRpb24uXG4gICAqL1xuICBwYXVzZSgpOiB2b2lkO1xuICAvKipcbiAgICogUmVzdGFydHMgdGhlIHBhdXNlZCBhbmltYXRpb24uXG4gICAqL1xuICByZXN0YXJ0KCk6IHZvaWQ7XG4gIC8qKlxuICAgKiBFbmRzIHRoZSBhbmltYXRpb24sIGludm9raW5nIHRoZSBgb25Eb25lKClgIGNhbGxiYWNrLlxuICAgKi9cbiAgZmluaXNoKCk6IHZvaWQ7XG4gIC8qKlxuICAgKiBEZXN0cm95cyB0aGUgYW5pbWF0aW9uLCBhZnRlciBpbnZva2luZyB0aGUgYGJlZm9yZURlc3Ryb3koKWAgY2FsbGJhY2suXG4gICAqIENhbGxzIHRoZSBgb25EZXN0cm95KClgIGNhbGxiYWNrIHdoZW4gZGVzdHJ1Y3Rpb24gaXMgY29tcGxldGVkLlxuICAgKi9cbiAgZGVzdHJveSgpOiB2b2lkO1xuICAvKipcbiAgICogUmVzZXRzIHRoZSBhbmltYXRpb24gdG8gaXRzIGluaXRpYWwgc3RhdGUuXG4gICAqL1xuICByZXNldCgpOiB2b2lkO1xuICAvKipcbiAgICogU2V0cyB0aGUgcG9zaXRpb24gb2YgdGhlIGFuaW1hdGlvbi5cbiAgICogQHBhcmFtIHBvc2l0aW9uIEEgMC1iYXNlZCBvZmZzZXQgaW50byB0aGUgZHVyYXRpb24sIGluIG1pbGxpc2Vjb25kcy5cbiAgICovXG4gIHNldFBvc2l0aW9uKHBvc2l0aW9uOiBhbnkgLyoqIFRPRE8gIzkxMDAgKi8pOiB2b2lkO1xuICAvKipcbiAgICogUmVwb3J0cyB0aGUgY3VycmVudCBwb3NpdGlvbiBvZiB0aGUgYW5pbWF0aW9uLlxuICAgKiBAcmV0dXJucyBBIDAtYmFzZWQgb2Zmc2V0IGludG8gdGhlIGR1cmF0aW9uLCBpbiBtaWxsaXNlY29uZHMuXG4gICAqL1xuICBnZXRQb3NpdGlvbigpOiBudW1iZXI7XG4gIC8qKlxuICAgKiBUaGUgcGFyZW50IG9mIHRoaXMgcGxheWVyLCBpZiBhbnkuXG4gICAqL1xuICBwYXJlbnRQbGF5ZXI6IEFuaW1hdGlvblBsYXllcnxudWxsO1xuICAvKipcbiAgICogVGhlIHRvdGFsIHJ1biB0aW1lIG9mIHRoZSBhbmltYXRpb24sIGluIG1pbGxpc2Vjb25kcy5cbiAgICovXG4gIHJlYWRvbmx5IHRvdGFsVGltZTogbnVtYmVyO1xuICAvKipcbiAgICogUHJvdmlkZXMgYSBjYWxsYmFjayB0byBpbnZva2UgYmVmb3JlIHRoZSBhbmltYXRpb24gaXMgZGVzdHJveWVkLlxuICAgKi9cbiAgYmVmb3JlRGVzdHJveT86ICgpID0+IGFueTtcbiAgLyoqIEBpbnRlcm5hbFxuICAgKiBJbnRlcm5hbFxuICAgKi9cbiAgdHJpZ2dlckNhbGxiYWNrPzogKHBoYXNlTmFtZTogc3RyaW5nKSA9PiB2b2lkO1xuICAvKiogQGludGVybmFsXG4gICAqIEludGVybmFsXG4gICAqL1xuICBkaXNhYmxlZD86IGJvb2xlYW47XG59XG5cbi8qKlxuICogQW4gZW1wdHkgcHJvZ3JhbW1hdGljIGNvbnRyb2xsZXIgZm9yIHJldXNhYmxlIGFuaW1hdGlvbnMuXG4gKiBVc2VkIGludGVybmFsbHkgd2hlbiBhbmltYXRpb25zIGFyZSBkaXNhYmxlZCwgdG8gYXZvaWRcbiAqIGNoZWNraW5nIGZvciB0aGUgbnVsbCBjYXNlIHdoZW4gYW4gYW5pbWF0aW9uIHBsYXllciBpcyBleHBlY3RlZC5cbiAqXG4gKiBAc2VlIGBhbmltYXRlKClgXG4gKiBAc2VlIGBBbmltYXRpb25QbGF5ZXJgXG4gKiBAc2VlIGBHcm91cFBsYXllcmBcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBjbGFzcyBOb29wQW5pbWF0aW9uUGxheWVyIGltcGxlbWVudHMgQW5pbWF0aW9uUGxheWVyIHtcbiAgcHJpdmF0ZSBfb25Eb25lRm5zOiBGdW5jdGlvbltdID0gW107XG4gIHByaXZhdGUgX29uU3RhcnRGbnM6IEZ1bmN0aW9uW10gPSBbXTtcbiAgcHJpdmF0ZSBfb25EZXN0cm95Rm5zOiBGdW5jdGlvbltdID0gW107XG4gIHByaXZhdGUgX3N0YXJ0ZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfZGVzdHJveWVkID0gZmFsc2U7XG4gIHByaXZhdGUgX2ZpbmlzaGVkID0gZmFsc2U7XG4gIHB1YmxpYyBwYXJlbnRQbGF5ZXI6IEFuaW1hdGlvblBsYXllcnxudWxsID0gbnVsbDtcbiAgcHVibGljIHJlYWRvbmx5IHRvdGFsVGltZTogbnVtYmVyO1xuICBjb25zdHJ1Y3RvcihkdXJhdGlvbjogbnVtYmVyID0gMCwgZGVsYXk6IG51bWJlciA9IDApIHsgdGhpcy50b3RhbFRpbWUgPSBkdXJhdGlvbiArIGRlbGF5OyB9XG4gIHByaXZhdGUgX29uRmluaXNoKCkge1xuICAgIGlmICghdGhpcy5fZmluaXNoZWQpIHtcbiAgICAgIHRoaXMuX2ZpbmlzaGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuX29uRG9uZUZucy5mb3JFYWNoKGZuID0+IGZuKCkpO1xuICAgICAgdGhpcy5fb25Eb25lRm5zID0gW107XG4gICAgfVxuICB9XG4gIG9uU3RhcnQoZm46ICgpID0+IHZvaWQpOiB2b2lkIHsgdGhpcy5fb25TdGFydEZucy5wdXNoKGZuKTsgfVxuICBvbkRvbmUoZm46ICgpID0+IHZvaWQpOiB2b2lkIHsgdGhpcy5fb25Eb25lRm5zLnB1c2goZm4pOyB9XG4gIG9uRGVzdHJveShmbjogKCkgPT4gdm9pZCk6IHZvaWQgeyB0aGlzLl9vbkRlc3Ryb3lGbnMucHVzaChmbik7IH1cbiAgaGFzU3RhcnRlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX3N0YXJ0ZWQ7IH1cbiAgaW5pdCgpOiB2b2lkIHt9XG4gIHBsYXkoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmhhc1N0YXJ0ZWQoKSkge1xuICAgICAgdGhpcy5fb25TdGFydCgpO1xuICAgICAgdGhpcy50cmlnZ2VyTWljcm90YXNrKCk7XG4gICAgfVxuICAgIHRoaXMuX3N0YXJ0ZWQgPSB0cnVlO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICB0cmlnZ2VyTWljcm90YXNrKCkgeyBzY2hlZHVsZU1pY3JvVGFzaygoKSA9PiB0aGlzLl9vbkZpbmlzaCgpKTsgfVxuXG4gIHByaXZhdGUgX29uU3RhcnQoKSB7XG4gICAgdGhpcy5fb25TdGFydEZucy5mb3JFYWNoKGZuID0+IGZuKCkpO1xuICAgIHRoaXMuX29uU3RhcnRGbnMgPSBbXTtcbiAgfVxuXG4gIHBhdXNlKCk6IHZvaWQge31cbiAgcmVzdGFydCgpOiB2b2lkIHt9XG4gIGZpbmlzaCgpOiB2b2lkIHsgdGhpcy5fb25GaW5pc2goKTsgfVxuICBkZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fZGVzdHJveWVkKSB7XG4gICAgICB0aGlzLl9kZXN0cm95ZWQgPSB0cnVlO1xuICAgICAgaWYgKCF0aGlzLmhhc1N0YXJ0ZWQoKSkge1xuICAgICAgICB0aGlzLl9vblN0YXJ0KCk7XG4gICAgICB9XG4gICAgICB0aGlzLmZpbmlzaCgpO1xuICAgICAgdGhpcy5fb25EZXN0cm95Rm5zLmZvckVhY2goZm4gPT4gZm4oKSk7XG4gICAgICB0aGlzLl9vbkRlc3Ryb3lGbnMgPSBbXTtcbiAgICB9XG4gIH1cbiAgcmVzZXQoKTogdm9pZCB7fVxuICBzZXRQb3NpdGlvbihwb3NpdGlvbjogbnVtYmVyKTogdm9pZCB7fVxuICBnZXRQb3NpdGlvbigpOiBudW1iZXIgeyByZXR1cm4gMDsgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgdHJpZ2dlckNhbGxiYWNrKHBoYXNlTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3QgbWV0aG9kcyA9IHBoYXNlTmFtZSA9PSAnc3RhcnQnID8gdGhpcy5fb25TdGFydEZucyA6IHRoaXMuX29uRG9uZUZucztcbiAgICBtZXRob2RzLmZvckVhY2goZm4gPT4gZm4oKSk7XG4gICAgbWV0aG9kcy5sZW5ndGggPSAwO1xuICB9XG59XG4iXX0=