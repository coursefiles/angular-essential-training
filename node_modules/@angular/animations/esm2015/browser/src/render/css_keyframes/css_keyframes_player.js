/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { computeStyle } from '../../util';
import { ElementAnimationStyleHandler } from './element_animation_style_handler';
/** @type {?} */
const DEFAULT_FILL_MODE = 'forwards';
/** @type {?} */
const DEFAULT_EASING = 'linear';
/** @enum {number} */
const AnimatorControlState = {
    INITIALIZED: 1, STARTED: 2, FINISHED: 3, DESTROYED: 4,
};
export { AnimatorControlState };
export class CssKeyframesPlayer {
    /**
     * @param {?} element
     * @param {?} keyframes
     * @param {?} animationName
     * @param {?} _duration
     * @param {?} _delay
     * @param {?} easing
     * @param {?} _finalStyles
     * @param {?=} _specialStyles
     */
    constructor(element, keyframes, animationName, _duration, _delay, easing, _finalStyles, _specialStyles) {
        this.element = element;
        this.keyframes = keyframes;
        this.animationName = animationName;
        this._duration = _duration;
        this._delay = _delay;
        this._finalStyles = _finalStyles;
        this._specialStyles = _specialStyles;
        this._onDoneFns = [];
        this._onStartFns = [];
        this._onDestroyFns = [];
        this._started = false;
        this.currentSnapshot = {};
        this._state = 0;
        this.easing = easing || DEFAULT_EASING;
        this.totalTime = _duration + _delay;
        this._buildStyler();
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
    destroy() {
        this.init();
        if (this._state >= 4 /* DESTROYED */)
            return;
        this._state = 4 /* DESTROYED */;
        this._styler.destroy();
        this._flushStartFns();
        this._flushDoneFns();
        if (this._specialStyles) {
            this._specialStyles.destroy();
        }
        this._onDestroyFns.forEach((/**
         * @param {?} fn
         * @return {?}
         */
        fn => fn()));
        this._onDestroyFns = [];
    }
    /**
     * @private
     * @return {?}
     */
    _flushDoneFns() {
        this._onDoneFns.forEach((/**
         * @param {?} fn
         * @return {?}
         */
        fn => fn()));
        this._onDoneFns = [];
    }
    /**
     * @private
     * @return {?}
     */
    _flushStartFns() {
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
    finish() {
        this.init();
        if (this._state >= 3 /* FINISHED */)
            return;
        this._state = 3 /* FINISHED */;
        this._styler.finish();
        this._flushStartFns();
        if (this._specialStyles) {
            this._specialStyles.finish();
        }
        this._flushDoneFns();
    }
    /**
     * @param {?} value
     * @return {?}
     */
    setPosition(value) { this._styler.setPosition(value); }
    /**
     * @return {?}
     */
    getPosition() { return this._styler.getPosition(); }
    /**
     * @return {?}
     */
    hasStarted() { return this._state >= 2 /* STARTED */; }
    /**
     * @return {?}
     */
    init() {
        if (this._state >= 1 /* INITIALIZED */)
            return;
        this._state = 1 /* INITIALIZED */;
        /** @type {?} */
        const elm = this.element;
        this._styler.apply();
        if (this._delay) {
            this._styler.pause();
        }
    }
    /**
     * @return {?}
     */
    play() {
        this.init();
        if (!this.hasStarted()) {
            this._flushStartFns();
            this._state = 2 /* STARTED */;
            if (this._specialStyles) {
                this._specialStyles.start();
            }
        }
        this._styler.resume();
    }
    /**
     * @return {?}
     */
    pause() {
        this.init();
        this._styler.pause();
    }
    /**
     * @return {?}
     */
    restart() {
        this.reset();
        this.play();
    }
    /**
     * @return {?}
     */
    reset() {
        this._styler.destroy();
        this._buildStyler();
        this._styler.apply();
    }
    /**
     * @private
     * @return {?}
     */
    _buildStyler() {
        this._styler = new ElementAnimationStyleHandler(this.element, this.animationName, this._duration, this._delay, this.easing, DEFAULT_FILL_MODE, (/**
         * @return {?}
         */
        () => this.finish()));
    }
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
    /**
     * @return {?}
     */
    beforeDestroy() {
        this.init();
        /** @type {?} */
        const styles = {};
        if (this.hasStarted()) {
            /** @type {?} */
            const finished = this._state >= 3 /* FINISHED */;
            Object.keys(this._finalStyles).forEach((/**
             * @param {?} prop
             * @return {?}
             */
            prop => {
                if (prop != 'offset') {
                    styles[prop] = finished ? this._finalStyles[prop] : computeStyle(this.element, prop);
                }
            }));
        }
        this.currentSnapshot = styles;
    }
}
if (false) {
    /**
     * @type {?}
     * @private
     */
    CssKeyframesPlayer.prototype._onDoneFns;
    /**
     * @type {?}
     * @private
     */
    CssKeyframesPlayer.prototype._onStartFns;
    /**
     * @type {?}
     * @private
     */
    CssKeyframesPlayer.prototype._onDestroyFns;
    /**
     * @type {?}
     * @private
     */
    CssKeyframesPlayer.prototype._started;
    /**
     * @type {?}
     * @private
     */
    CssKeyframesPlayer.prototype._styler;
    /** @type {?} */
    CssKeyframesPlayer.prototype.parentPlayer;
    /** @type {?} */
    CssKeyframesPlayer.prototype.totalTime;
    /** @type {?} */
    CssKeyframesPlayer.prototype.easing;
    /** @type {?} */
    CssKeyframesPlayer.prototype.currentSnapshot;
    /**
     * @type {?}
     * @private
     */
    CssKeyframesPlayer.prototype._state;
    /** @type {?} */
    CssKeyframesPlayer.prototype.element;
    /** @type {?} */
    CssKeyframesPlayer.prototype.keyframes;
    /** @type {?} */
    CssKeyframesPlayer.prototype.animationName;
    /**
     * @type {?}
     * @private
     */
    CssKeyframesPlayer.prototype._duration;
    /**
     * @type {?}
     * @private
     */
    CssKeyframesPlayer.prototype._delay;
    /**
     * @type {?}
     * @private
     */
    CssKeyframesPlayer.prototype._finalStyles;
    /**
     * @type {?}
     * @private
     */
    CssKeyframesPlayer.prototype._specialStyles;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3NzX2tleWZyYW1lc19wbGF5ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9hbmltYXRpb25zL2Jyb3dzZXIvc3JjL3JlbmRlci9jc3Nfa2V5ZnJhbWVzL2Nzc19rZXlmcmFtZXNfcGxheWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFTQSxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBRXhDLE9BQU8sRUFBQyw0QkFBNEIsRUFBQyxNQUFNLG1DQUFtQyxDQUFDOztNQUV6RSxpQkFBaUIsR0FBRyxVQUFVOztNQUM5QixjQUFjLEdBQUcsUUFBUTs7O0lBRVMsY0FBZSxFQUFFLFVBQVcsRUFBRSxXQUFZLEVBQUUsWUFBYTs7O0FBRWpHLE1BQU0sT0FBTyxrQkFBa0I7Ozs7Ozs7Ozs7O0lBaUI3QixZQUNvQixPQUFZLEVBQWtCLFNBQTZDLEVBQzNFLGFBQXFCLEVBQW1CLFNBQWlCLEVBQ3hELE1BQWMsRUFBRSxNQUFjLEVBQzlCLFlBQWtDLEVBQ2xDLGNBQXdDO1FBSnpDLFlBQU8sR0FBUCxPQUFPLENBQUs7UUFBa0IsY0FBUyxHQUFULFNBQVMsQ0FBb0M7UUFDM0Usa0JBQWEsR0FBYixhQUFhLENBQVE7UUFBbUIsY0FBUyxHQUFULFNBQVMsQ0FBUTtRQUN4RCxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsaUJBQVksR0FBWixZQUFZLENBQXNCO1FBQ2xDLG1CQUFjLEdBQWQsY0FBYyxDQUEwQjtRQXJCckQsZUFBVSxHQUFlLEVBQUUsQ0FBQztRQUM1QixnQkFBVyxHQUFlLEVBQUUsQ0FBQztRQUM3QixrQkFBYSxHQUFlLEVBQUUsQ0FBQztRQUUvQixhQUFRLEdBQUcsS0FBSyxDQUFDO1FBUWxCLG9CQUFlLEdBQTRCLEVBQUUsQ0FBQztRQUU3QyxXQUFNLEdBQXlCLENBQUMsQ0FBQztRQVF2QyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sSUFBSSxj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QUMvQiwwQ0FBbUQ7Ozs7O0lBQ25ELDRDQUF5RCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7QW5pbWF0aW9uUGxheWVyfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcblxuaW1wb3J0IHtjb21wdXRlU3R5bGV9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtTcGVjaWFsQ2FzZWRTdHlsZXN9IGZyb20gJy4uL3NwZWNpYWxfY2FzZWRfc3R5bGVzJztcbmltcG9ydCB7RWxlbWVudEFuaW1hdGlvblN0eWxlSGFuZGxlcn0gZnJvbSAnLi9lbGVtZW50X2FuaW1hdGlvbl9zdHlsZV9oYW5kbGVyJztcblxuY29uc3QgREVGQVVMVF9GSUxMX01PREUgPSAnZm9yd2FyZHMnO1xuY29uc3QgREVGQVVMVF9FQVNJTkcgPSAnbGluZWFyJztcblxuZXhwb3J0IGNvbnN0IGVudW0gQW5pbWF0b3JDb250cm9sU3RhdGUge0lOSVRJQUxJWkVEID0gMSwgU1RBUlRFRCA9IDIsIEZJTklTSEVEID0gMywgREVTVFJPWUVEID0gNH1cblxuZXhwb3J0IGNsYXNzIENzc0tleWZyYW1lc1BsYXllciBpbXBsZW1lbnRzIEFuaW1hdGlvblBsYXllciB7XG4gIHByaXZhdGUgX29uRG9uZUZuczogRnVuY3Rpb25bXSA9IFtdO1xuICBwcml2YXRlIF9vblN0YXJ0Rm5zOiBGdW5jdGlvbltdID0gW107XG4gIHByaXZhdGUgX29uRGVzdHJveUZuczogRnVuY3Rpb25bXSA9IFtdO1xuXG4gIHByaXZhdGUgX3N0YXJ0ZWQgPSBmYWxzZTtcbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIHByaXZhdGUgX3N0eWxlciAhOiBFbGVtZW50QW5pbWF0aW9uU3R5bGVIYW5kbGVyO1xuXG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBwdWJsaWMgcGFyZW50UGxheWVyICE6IEFuaW1hdGlvblBsYXllcjtcbiAgcHVibGljIHJlYWRvbmx5IHRvdGFsVGltZTogbnVtYmVyO1xuICBwdWJsaWMgcmVhZG9ubHkgZWFzaW5nOiBzdHJpbmc7XG4gIHB1YmxpYyBjdXJyZW50U25hcHNob3Q6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9ID0ge307XG5cbiAgcHJpdmF0ZSBfc3RhdGU6IEFuaW1hdG9yQ29udHJvbFN0YXRlID0gMDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHB1YmxpYyByZWFkb25seSBlbGVtZW50OiBhbnksIHB1YmxpYyByZWFkb25seSBrZXlmcmFtZXM6IHtba2V5OiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXJ9W10sXG4gICAgICBwdWJsaWMgcmVhZG9ubHkgYW5pbWF0aW9uTmFtZTogc3RyaW5nLCBwcml2YXRlIHJlYWRvbmx5IF9kdXJhdGlvbjogbnVtYmVyLFxuICAgICAgcHJpdmF0ZSByZWFkb25seSBfZGVsYXk6IG51bWJlciwgZWFzaW5nOiBzdHJpbmcsXG4gICAgICBwcml2YXRlIHJlYWRvbmx5IF9maW5hbFN0eWxlczoge1trZXk6IHN0cmluZ106IGFueX0sXG4gICAgICBwcml2YXRlIHJlYWRvbmx5IF9zcGVjaWFsU3R5bGVzPzogU3BlY2lhbENhc2VkU3R5bGVzfG51bGwpIHtcbiAgICB0aGlzLmVhc2luZyA9IGVhc2luZyB8fCBERUZBVUxUX0VBU0lORztcbiAgICB0aGlzLnRvdGFsVGltZSA9IF9kdXJhdGlvbiArIF9kZWxheTtcbiAgICB0aGlzLl9idWlsZFN0eWxlcigpO1xuICB9XG5cbiAgb25TdGFydChmbjogKCkgPT4gdm9pZCk6IHZvaWQgeyB0aGlzLl9vblN0YXJ0Rm5zLnB1c2goZm4pOyB9XG5cbiAgb25Eb25lKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7IHRoaXMuX29uRG9uZUZucy5wdXNoKGZuKTsgfVxuXG4gIG9uRGVzdHJveShmbjogKCkgPT4gdm9pZCk6IHZvaWQgeyB0aGlzLl9vbkRlc3Ryb3lGbnMucHVzaChmbik7IH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuaW5pdCgpO1xuICAgIGlmICh0aGlzLl9zdGF0ZSA+PSBBbmltYXRvckNvbnRyb2xTdGF0ZS5ERVNUUk9ZRUQpIHJldHVybjtcbiAgICB0aGlzLl9zdGF0ZSA9IEFuaW1hdG9yQ29udHJvbFN0YXRlLkRFU1RST1lFRDtcbiAgICB0aGlzLl9zdHlsZXIuZGVzdHJveSgpO1xuICAgIHRoaXMuX2ZsdXNoU3RhcnRGbnMoKTtcbiAgICB0aGlzLl9mbHVzaERvbmVGbnMoKTtcbiAgICBpZiAodGhpcy5fc3BlY2lhbFN0eWxlcykge1xuICAgICAgdGhpcy5fc3BlY2lhbFN0eWxlcy5kZXN0cm95KCk7XG4gICAgfVxuICAgIHRoaXMuX29uRGVzdHJveUZucy5mb3JFYWNoKGZuID0+IGZuKCkpO1xuICAgIHRoaXMuX29uRGVzdHJveUZucyA9IFtdO1xuICB9XG5cbiAgcHJpdmF0ZSBfZmx1c2hEb25lRm5zKCkge1xuICAgIHRoaXMuX29uRG9uZUZucy5mb3JFYWNoKGZuID0+IGZuKCkpO1xuICAgIHRoaXMuX29uRG9uZUZucyA9IFtdO1xuICB9XG5cbiAgcHJpdmF0ZSBfZmx1c2hTdGFydEZucygpIHtcbiAgICB0aGlzLl9vblN0YXJ0Rm5zLmZvckVhY2goZm4gPT4gZm4oKSk7XG4gICAgdGhpcy5fb25TdGFydEZucyA9IFtdO1xuICB9XG5cbiAgZmluaXNoKCkge1xuICAgIHRoaXMuaW5pdCgpO1xuICAgIGlmICh0aGlzLl9zdGF0ZSA+PSBBbmltYXRvckNvbnRyb2xTdGF0ZS5GSU5JU0hFRCkgcmV0dXJuO1xuICAgIHRoaXMuX3N0YXRlID0gQW5pbWF0b3JDb250cm9sU3RhdGUuRklOSVNIRUQ7XG4gICAgdGhpcy5fc3R5bGVyLmZpbmlzaCgpO1xuICAgIHRoaXMuX2ZsdXNoU3RhcnRGbnMoKTtcbiAgICBpZiAodGhpcy5fc3BlY2lhbFN0eWxlcykge1xuICAgICAgdGhpcy5fc3BlY2lhbFN0eWxlcy5maW5pc2goKTtcbiAgICB9XG4gICAgdGhpcy5fZmx1c2hEb25lRm5zKCk7XG4gIH1cblxuICBzZXRQb3NpdGlvbih2YWx1ZTogbnVtYmVyKSB7IHRoaXMuX3N0eWxlci5zZXRQb3NpdGlvbih2YWx1ZSk7IH1cblxuICBnZXRQb3NpdGlvbigpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fc3R5bGVyLmdldFBvc2l0aW9uKCk7IH1cblxuICBoYXNTdGFydGVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fc3RhdGUgPj0gQW5pbWF0b3JDb250cm9sU3RhdGUuU1RBUlRFRDsgfVxuICBpbml0KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9zdGF0ZSA+PSBBbmltYXRvckNvbnRyb2xTdGF0ZS5JTklUSUFMSVpFRCkgcmV0dXJuO1xuICAgIHRoaXMuX3N0YXRlID0gQW5pbWF0b3JDb250cm9sU3RhdGUuSU5JVElBTElaRUQ7XG4gICAgY29uc3QgZWxtID0gdGhpcy5lbGVtZW50O1xuICAgIHRoaXMuX3N0eWxlci5hcHBseSgpO1xuICAgIGlmICh0aGlzLl9kZWxheSkge1xuICAgICAgdGhpcy5fc3R5bGVyLnBhdXNlKCk7XG4gICAgfVxuICB9XG5cbiAgcGxheSgpOiB2b2lkIHtcbiAgICB0aGlzLmluaXQoKTtcbiAgICBpZiAoIXRoaXMuaGFzU3RhcnRlZCgpKSB7XG4gICAgICB0aGlzLl9mbHVzaFN0YXJ0Rm5zKCk7XG4gICAgICB0aGlzLl9zdGF0ZSA9IEFuaW1hdG9yQ29udHJvbFN0YXRlLlNUQVJURUQ7XG4gICAgICBpZiAodGhpcy5fc3BlY2lhbFN0eWxlcykge1xuICAgICAgICB0aGlzLl9zcGVjaWFsU3R5bGVzLnN0YXJ0KCk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuX3N0eWxlci5yZXN1bWUoKTtcbiAgfVxuXG4gIHBhdXNlKCk6IHZvaWQge1xuICAgIHRoaXMuaW5pdCgpO1xuICAgIHRoaXMuX3N0eWxlci5wYXVzZSgpO1xuICB9XG4gIHJlc3RhcnQoKTogdm9pZCB7XG4gICAgdGhpcy5yZXNldCgpO1xuICAgIHRoaXMucGxheSgpO1xuICB9XG4gIHJlc2V0KCk6IHZvaWQge1xuICAgIHRoaXMuX3N0eWxlci5kZXN0cm95KCk7XG4gICAgdGhpcy5fYnVpbGRTdHlsZXIoKTtcbiAgICB0aGlzLl9zdHlsZXIuYXBwbHkoKTtcbiAgfVxuXG4gIHByaXZhdGUgX2J1aWxkU3R5bGVyKCkge1xuICAgIHRoaXMuX3N0eWxlciA9IG5ldyBFbGVtZW50QW5pbWF0aW9uU3R5bGVIYW5kbGVyKFxuICAgICAgICB0aGlzLmVsZW1lbnQsIHRoaXMuYW5pbWF0aW9uTmFtZSwgdGhpcy5fZHVyYXRpb24sIHRoaXMuX2RlbGF5LCB0aGlzLmVhc2luZyxcbiAgICAgICAgREVGQVVMVF9GSUxMX01PREUsICgpID0+IHRoaXMuZmluaXNoKCkpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICB0cmlnZ2VyQ2FsbGJhY2socGhhc2VOYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBtZXRob2RzID0gcGhhc2VOYW1lID09ICdzdGFydCcgPyB0aGlzLl9vblN0YXJ0Rm5zIDogdGhpcy5fb25Eb25lRm5zO1xuICAgIG1ldGhvZHMuZm9yRWFjaChmbiA9PiBmbigpKTtcbiAgICBtZXRob2RzLmxlbmd0aCA9IDA7XG4gIH1cblxuICBiZWZvcmVEZXN0cm95KCkge1xuICAgIHRoaXMuaW5pdCgpO1xuICAgIGNvbnN0IHN0eWxlczoge1trZXk6IHN0cmluZ106IHN0cmluZ30gPSB7fTtcbiAgICBpZiAodGhpcy5oYXNTdGFydGVkKCkpIHtcbiAgICAgIGNvbnN0IGZpbmlzaGVkID0gdGhpcy5fc3RhdGUgPj0gQW5pbWF0b3JDb250cm9sU3RhdGUuRklOSVNIRUQ7XG4gICAgICBPYmplY3Qua2V5cyh0aGlzLl9maW5hbFN0eWxlcykuZm9yRWFjaChwcm9wID0+IHtcbiAgICAgICAgaWYgKHByb3AgIT0gJ29mZnNldCcpIHtcbiAgICAgICAgICBzdHlsZXNbcHJvcF0gPSBmaW5pc2hlZCA/IHRoaXMuX2ZpbmFsU3R5bGVzW3Byb3BdIDogY29tcHV0ZVN0eWxlKHRoaXMuZWxlbWVudCwgcHJvcCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLmN1cnJlbnRTbmFwc2hvdCA9IHN0eWxlcztcbiAgfVxufVxuIl19