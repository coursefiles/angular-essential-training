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
 * A programmatic controller for a group of reusable animations.
 * Used internally to control animations.
 *
 * @see `AnimationPlayer`
 * @see `{\@link animations/group group()}`
 *
 */
export class AnimationGroupPlayer {
    /**
     * @param {?} _players
     */
    constructor(_players) {
        this._onDoneFns = [];
        this._onStartFns = [];
        this._finished = false;
        this._started = false;
        this._destroyed = false;
        this._onDestroyFns = [];
        this.parentPlayer = null;
        this.totalTime = 0;
        this.players = _players;
        /** @type {?} */
        let doneCount = 0;
        /** @type {?} */
        let destroyCount = 0;
        /** @type {?} */
        let startCount = 0;
        /** @type {?} */
        const total = this.players.length;
        if (total == 0) {
            scheduleMicroTask((/**
             * @return {?}
             */
            () => this._onFinish()));
        }
        else {
            this.players.forEach((/**
             * @param {?} player
             * @return {?}
             */
            player => {
                player.onDone((/**
                 * @return {?}
                 */
                () => {
                    if (++doneCount == total) {
                        this._onFinish();
                    }
                }));
                player.onDestroy((/**
                 * @return {?}
                 */
                () => {
                    if (++destroyCount == total) {
                        this._onDestroy();
                    }
                }));
                player.onStart((/**
                 * @return {?}
                 */
                () => {
                    if (++startCount == total) {
                        this._onStart();
                    }
                }));
            }));
        }
        this.totalTime = this.players.reduce((/**
         * @param {?} time
         * @param {?} player
         * @return {?}
         */
        (time, player) => Math.max(time, player.totalTime)), 0);
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
     * @return {?}
     */
    init() { this.players.forEach((/**
     * @param {?} player
     * @return {?}
     */
    player => player.init())); }
    /**
     * @param {?} fn
     * @return {?}
     */
    onStart(fn) { this._onStartFns.push(fn); }
    /**
     * @private
     * @return {?}
     */
    _onStart() {
        if (!this.hasStarted()) {
            this._started = true;
            this._onStartFns.forEach((/**
             * @param {?} fn
             * @return {?}
             */
            fn => fn()));
            this._onStartFns = [];
        }
    }
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
    play() {
        if (!this.parentPlayer) {
            this.init();
        }
        this._onStart();
        this.players.forEach((/**
         * @param {?} player
         * @return {?}
         */
        player => player.play()));
    }
    /**
     * @return {?}
     */
    pause() { this.players.forEach((/**
     * @param {?} player
     * @return {?}
     */
    player => player.pause())); }
    /**
     * @return {?}
     */
    restart() { this.players.forEach((/**
     * @param {?} player
     * @return {?}
     */
    player => player.restart())); }
    /**
     * @return {?}
     */
    finish() {
        this._onFinish();
        this.players.forEach((/**
         * @param {?} player
         * @return {?}
         */
        player => player.finish()));
    }
    /**
     * @return {?}
     */
    destroy() { this._onDestroy(); }
    /**
     * @private
     * @return {?}
     */
    _onDestroy() {
        if (!this._destroyed) {
            this._destroyed = true;
            this._onFinish();
            this.players.forEach((/**
             * @param {?} player
             * @return {?}
             */
            player => player.destroy()));
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
    reset() {
        this.players.forEach((/**
         * @param {?} player
         * @return {?}
         */
        player => player.reset()));
        this._destroyed = false;
        this._finished = false;
        this._started = false;
    }
    /**
     * @param {?} p
     * @return {?}
     */
    setPosition(p) {
        /** @type {?} */
        const timeAtPosition = p * this.totalTime;
        this.players.forEach((/**
         * @param {?} player
         * @return {?}
         */
        player => {
            /** @type {?} */
            const position = player.totalTime ? Math.min(1, timeAtPosition / player.totalTime) : 1;
            player.setPosition(position);
        }));
    }
    /**
     * @return {?}
     */
    getPosition() {
        /** @type {?} */
        let min = 0;
        this.players.forEach((/**
         * @param {?} player
         * @return {?}
         */
        player => {
            /** @type {?} */
            const p = player.getPosition();
            min = Math.min(p, min);
        }));
        return min;
    }
    /**
     * @return {?}
     */
    beforeDestroy() {
        this.players.forEach((/**
         * @param {?} player
         * @return {?}
         */
        player => {
            if (player.beforeDestroy) {
                player.beforeDestroy();
            }
        }));
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
}
if (false) {
    /**
     * @type {?}
     * @private
     */
    AnimationGroupPlayer.prototype._onDoneFns;
    /**
     * @type {?}
     * @private
     */
    AnimationGroupPlayer.prototype._onStartFns;
    /**
     * @type {?}
     * @private
     */
    AnimationGroupPlayer.prototype._finished;
    /**
     * @type {?}
     * @private
     */
    AnimationGroupPlayer.prototype._started;
    /**
     * @type {?}
     * @private
     */
    AnimationGroupPlayer.prototype._destroyed;
    /**
     * @type {?}
     * @private
     */
    AnimationGroupPlayer.prototype._onDestroyFns;
    /** @type {?} */
    AnimationGroupPlayer.prototype.parentPlayer;
    /** @type {?} */
    AnimationGroupPlayer.prototype.totalTime;
    /** @type {?} */
    AnimationGroupPlayer.prototype.players;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX2dyb3VwX3BsYXllci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2FuaW1hdGlvbnMvc3JjL3BsYXllcnMvYW5pbWF0aW9uX2dyb3VwX3BsYXllci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLFNBQVMsQ0FBQzs7Ozs7Ozs7O0FBVzFDLE1BQU0sT0FBTyxvQkFBb0I7Ozs7SUFZL0IsWUFBWSxRQUEyQjtRQVgvQixlQUFVLEdBQWUsRUFBRSxDQUFDO1FBQzVCLGdCQUFXLEdBQWUsRUFBRSxDQUFDO1FBQzdCLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFDbEIsYUFBUSxHQUFHLEtBQUssQ0FBQztRQUNqQixlQUFVLEdBQUcsS0FBSyxDQUFDO1FBQ25CLGtCQUFhLEdBQWUsRUFBRSxDQUFDO1FBRWhDLGlCQUFZLEdBQXlCLElBQUksQ0FBQztRQUMxQyxjQUFTLEdBQVcsQ0FBQyxDQUFDO1FBSTNCLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDOztZQUNwQixTQUFTLEdBQUcsQ0FBQzs7WUFDYixZQUFZLEdBQUcsQ0FBQzs7WUFDaEIsVUFBVSxHQUFHLENBQUM7O2NBQ1osS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTTtRQUVqQyxJQUFJLEtBQUssSUFBSSxDQUFDLEVBQUU7WUFDZCxpQkFBaUI7OztZQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBQyxDQUFDO1NBQzNDO2FBQU07WUFDTCxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU87Ozs7WUFBQyxNQUFNLENBQUMsRUFBRTtnQkFDNUIsTUFBTSxDQUFDLE1BQU07OztnQkFBQyxHQUFHLEVBQUU7b0JBQ2pCLElBQUksRUFBRSxTQUFTLElBQUksS0FBSyxFQUFFO3dCQUN4QixJQUFJLENBQUMsU0FBUyxFQUFF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Qjs7Ozs7SUFDM0IsNkNBQXVDOztJQUV2Qyw0Q0FBaUQ7O0lBQ2pELHlDQUE2Qjs7SUFDN0IsdUNBQTJDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge3NjaGVkdWxlTWljcm9UYXNrfSBmcm9tICcuLi91dGlsJztcbmltcG9ydCB7QW5pbWF0aW9uUGxheWVyfSBmcm9tICcuL2FuaW1hdGlvbl9wbGF5ZXInO1xuXG4vKipcbiAqIEEgcHJvZ3JhbW1hdGljIGNvbnRyb2xsZXIgZm9yIGEgZ3JvdXAgb2YgcmV1c2FibGUgYW5pbWF0aW9ucy5cbiAqIFVzZWQgaW50ZXJuYWxseSB0byBjb250cm9sIGFuaW1hdGlvbnMuXG4gKlxuICogQHNlZSBgQW5pbWF0aW9uUGxheWVyYFxuICogQHNlZSBge0BsaW5rIGFuaW1hdGlvbnMvZ3JvdXAgZ3JvdXAoKX1gXG4gKlxuICovXG5leHBvcnQgY2xhc3MgQW5pbWF0aW9uR3JvdXBQbGF5ZXIgaW1wbGVtZW50cyBBbmltYXRpb25QbGF5ZXIge1xuICBwcml2YXRlIF9vbkRvbmVGbnM6IEZ1bmN0aW9uW10gPSBbXTtcbiAgcHJpdmF0ZSBfb25TdGFydEZuczogRnVuY3Rpb25bXSA9IFtdO1xuICBwcml2YXRlIF9maW5pc2hlZCA9IGZhbHNlO1xuICBwcml2YXRlIF9zdGFydGVkID0gZmFsc2U7XG4gIHByaXZhdGUgX2Rlc3Ryb3llZCA9IGZhbHNlO1xuICBwcml2YXRlIF9vbkRlc3Ryb3lGbnM6IEZ1bmN0aW9uW10gPSBbXTtcblxuICBwdWJsaWMgcGFyZW50UGxheWVyOiBBbmltYXRpb25QbGF5ZXJ8bnVsbCA9IG51bGw7XG4gIHB1YmxpYyB0b3RhbFRpbWU6IG51bWJlciA9IDA7XG4gIHB1YmxpYyByZWFkb25seSBwbGF5ZXJzOiBBbmltYXRpb25QbGF5ZXJbXTtcblxuICBjb25zdHJ1Y3RvcihfcGxheWVyczogQW5pbWF0aW9uUGxheWVyW10pIHtcbiAgICB0aGlzLnBsYXllcnMgPSBfcGxheWVycztcbiAgICBsZXQgZG9uZUNvdW50ID0gMDtcbiAgICBsZXQgZGVzdHJveUNvdW50ID0gMDtcbiAgICBsZXQgc3RhcnRDb3VudCA9IDA7XG4gICAgY29uc3QgdG90YWwgPSB0aGlzLnBsYXllcnMubGVuZ3RoO1xuXG4gICAgaWYgKHRvdGFsID09IDApIHtcbiAgICAgIHNjaGVkdWxlTWljcm9UYXNrKCgpID0+IHRoaXMuX29uRmluaXNoKCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnBsYXllcnMuZm9yRWFjaChwbGF5ZXIgPT4ge1xuICAgICAgICBwbGF5ZXIub25Eb25lKCgpID0+IHtcbiAgICAgICAgICBpZiAoKytkb25lQ291bnQgPT0gdG90YWwpIHtcbiAgICAgICAgICAgIHRoaXMuX29uRmluaXNoKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcGxheWVyLm9uRGVzdHJveSgoKSA9PiB7XG4gICAgICAgICAgaWYgKCsrZGVzdHJveUNvdW50ID09IHRvdGFsKSB7XG4gICAgICAgICAgICB0aGlzLl9vbkRlc3Ryb3koKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBwbGF5ZXIub25TdGFydCgoKSA9PiB7XG4gICAgICAgICAgaWYgKCsrc3RhcnRDb3VudCA9PSB0b3RhbCkge1xuICAgICAgICAgICAgdGhpcy5fb25TdGFydCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLnRvdGFsVGltZSA9IHRoaXMucGxheWVycy5yZWR1Y2UoKHRpbWUsIHBsYXllcikgPT4gTWF0aC5tYXgodGltZSwgcGxheWVyLnRvdGFsVGltZSksIDApO1xuICB9XG5cbiAgcHJpdmF0ZSBfb25GaW5pc2goKSB7XG4gICAgaWYgKCF0aGlzLl9maW5pc2hlZCkge1xuICAgICAgdGhpcy5fZmluaXNoZWQgPSB0cnVlO1xuICAgICAgdGhpcy5fb25Eb25lRm5zLmZvckVhY2goZm4gPT4gZm4oKSk7XG4gICAgICB0aGlzLl9vbkRvbmVGbnMgPSBbXTtcbiAgICB9XG4gIH1cblxuICBpbml0KCk6IHZvaWQgeyB0aGlzLnBsYXllcnMuZm9yRWFjaChwbGF5ZXIgPT4gcGxheWVyLmluaXQoKSk7IH1cblxuICBvblN0YXJ0KGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7IHRoaXMuX29uU3RhcnRGbnMucHVzaChmbik7IH1cblxuICBwcml2YXRlIF9vblN0YXJ0KCkge1xuICAgIGlmICghdGhpcy5oYXNTdGFydGVkKCkpIHtcbiAgICAgIHRoaXMuX3N0YXJ0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5fb25TdGFydEZucy5mb3JFYWNoKGZuID0+IGZuKCkpO1xuICAgICAgdGhpcy5fb25TdGFydEZucyA9IFtdO1xuICAgIH1cbiAgfVxuXG4gIG9uRG9uZShmbjogKCkgPT4gdm9pZCk6IHZvaWQgeyB0aGlzLl9vbkRvbmVGbnMucHVzaChmbik7IH1cblxuICBvbkRlc3Ryb3koZm46ICgpID0+IHZvaWQpOiB2b2lkIHsgdGhpcy5fb25EZXN0cm95Rm5zLnB1c2goZm4pOyB9XG5cbiAgaGFzU3RhcnRlZCgpIHsgcmV0dXJuIHRoaXMuX3N0YXJ0ZWQ7IH1cblxuICBwbGF5KCkge1xuICAgIGlmICghdGhpcy5wYXJlbnRQbGF5ZXIpIHtcbiAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH1cbiAgICB0aGlzLl9vblN0YXJ0KCk7XG4gICAgdGhpcy5wbGF5ZXJzLmZvckVhY2gocGxheWVyID0+IHBsYXllci5wbGF5KCkpO1xuICB9XG5cbiAgcGF1c2UoKTogdm9pZCB7IHRoaXMucGxheWVycy5mb3JFYWNoKHBsYXllciA9PiBwbGF5ZXIucGF1c2UoKSk7IH1cblxuICByZXN0YXJ0KCk6IHZvaWQgeyB0aGlzLnBsYXllcnMuZm9yRWFjaChwbGF5ZXIgPT4gcGxheWVyLnJlc3RhcnQoKSk7IH1cblxuICBmaW5pc2goKTogdm9pZCB7XG4gICAgdGhpcy5fb25GaW5pc2goKTtcbiAgICB0aGlzLnBsYXllcnMuZm9yRWFjaChwbGF5ZXIgPT4gcGxheWVyLmZpbmlzaCgpKTtcbiAgfVxuXG4gIGRlc3Ryb3koKTogdm9pZCB7IHRoaXMuX29uRGVzdHJveSgpOyB9XG5cbiAgcHJpdmF0ZSBfb25EZXN0cm95KCkge1xuICAgIGlmICghdGhpcy5fZGVzdHJveWVkKSB7XG4gICAgICB0aGlzLl9kZXN0cm95ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5fb25GaW5pc2goKTtcbiAgICAgIHRoaXMucGxheWVycy5mb3JFYWNoKHBsYXllciA9PiBwbGF5ZXIuZGVzdHJveSgpKTtcbiAgICAgIHRoaXMuX29uRGVzdHJveUZucy5mb3JFYWNoKGZuID0+IGZuKCkpO1xuICAgICAgdGhpcy5fb25EZXN0cm95Rm5zID0gW107XG4gICAgfVxuICB9XG5cbiAgcmVzZXQoKTogdm9pZCB7XG4gICAgdGhpcy5wbGF5ZXJzLmZvckVhY2gocGxheWVyID0+IHBsYXllci5yZXNldCgpKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9maW5pc2hlZCA9IGZhbHNlO1xuICAgIHRoaXMuX3N0YXJ0ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIHNldFBvc2l0aW9uKHA6IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IHRpbWVBdFBvc2l0aW9uID0gcCAqIHRoaXMudG90YWxUaW1lO1xuICAgIHRoaXMucGxheWVycy5mb3JFYWNoKHBsYXllciA9PiB7XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHBsYXllci50b3RhbFRpbWUgPyBNYXRoLm1pbigxLCB0aW1lQXRQb3NpdGlvbiAvIHBsYXllci50b3RhbFRpbWUpIDogMTtcbiAgICAgIHBsYXllci5zZXRQb3NpdGlvbihwb3NpdGlvbik7XG4gICAgfSk7XG4gIH1cblxuICBnZXRQb3NpdGlvbigpOiBudW1iZXIge1xuICAgIGxldCBtaW4gPSAwO1xuICAgIHRoaXMucGxheWVycy5mb3JFYWNoKHBsYXllciA9PiB7XG4gICAgICBjb25zdCBwID0gcGxheWVyLmdldFBvc2l0aW9uKCk7XG4gICAgICBtaW4gPSBNYXRoLm1pbihwLCBtaW4pO1xuICAgIH0pO1xuICAgIHJldHVybiBtaW47XG4gIH1cblxuICBiZWZvcmVEZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMucGxheWVycy5mb3JFYWNoKHBsYXllciA9PiB7XG4gICAgICBpZiAocGxheWVyLmJlZm9yZURlc3Ryb3kpIHtcbiAgICAgICAgcGxheWVyLmJlZm9yZURlc3Ryb3koKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgdHJpZ2dlckNhbGxiYWNrKHBoYXNlTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3QgbWV0aG9kcyA9IHBoYXNlTmFtZSA9PSAnc3RhcnQnID8gdGhpcy5fb25TdGFydEZucyA6IHRoaXMuX29uRG9uZUZucztcbiAgICBtZXRob2RzLmZvckVhY2goZm4gPT4gZm4oKSk7XG4gICAgbWV0aG9kcy5sZW5ndGggPSAwO1xuICB9XG59XG4iXX0=