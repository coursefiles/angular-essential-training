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
 * @type {?}
 */
const ELAPSED_TIME_MAX_DECIMAL_PLACES = 3;
/** @type {?} */
const ANIMATION_PROP = 'animation';
/** @type {?} */
const ANIMATIONEND_EVENT = 'animationend';
/** @type {?} */
const ONE_SECOND = 1000;
export class ElementAnimationStyleHandler {
    /**
     * @param {?} _element
     * @param {?} _name
     * @param {?} _duration
     * @param {?} _delay
     * @param {?} _easing
     * @param {?} _fillMode
     * @param {?} _onDoneFn
     */
    constructor(_element, _name, _duration, _delay, _easing, _fillMode, _onDoneFn) {
        this._element = _element;
        this._name = _name;
        this._duration = _duration;
        this._delay = _delay;
        this._easing = _easing;
        this._fillMode = _fillMode;
        this._onDoneFn = _onDoneFn;
        this._finished = false;
        this._destroyed = false;
        this._startTime = 0;
        this._position = 0;
        this._eventFn = (/**
         * @param {?} e
         * @return {?}
         */
        (e) => this._handleCallback(e));
    }
    /**
     * @return {?}
     */
    apply() {
        applyKeyframeAnimation(this._element, `${this._duration}ms ${this._easing} ${this._delay}ms 1 normal ${this._fillMode} ${this._name}`);
        addRemoveAnimationEvent(this._element, this._eventFn, false);
        this._startTime = Date.now();
    }
    /**
     * @return {?}
     */
    pause() { playPauseAnimation(this._element, this._name, 'paused'); }
    /**
     * @return {?}
     */
    resume() { playPauseAnimation(this._element, this._name, 'running'); }
    /**
     * @param {?} position
     * @return {?}
     */
    setPosition(position) {
        /** @type {?} */
        const index = findIndexForAnimation(this._element, this._name);
        this._position = position * this._duration;
        setAnimationStyle(this._element, 'Delay', `-${this._position}ms`, index);
    }
    /**
     * @return {?}
     */
    getPosition() { return this._position; }
    /**
     * @private
     * @param {?} event
     * @return {?}
     */
    _handleCallback(event) {
        /** @type {?} */
        const timestamp = event._ngTestManualTimestamp || Date.now();
        /** @type {?} */
        const elapsedTime = parseFloat(event.elapsedTime.toFixed(ELAPSED_TIME_MAX_DECIMAL_PLACES)) * ONE_SECOND;
        if (event.animationName == this._name &&
            Math.max(timestamp - this._startTime, 0) >= this._delay && elapsedTime >= this._duration) {
            this.finish();
        }
    }
    /**
     * @return {?}
     */
    finish() {
        if (this._finished)
            return;
        this._finished = true;
        this._onDoneFn();
        addRemoveAnimationEvent(this._element, this._eventFn, true);
    }
    /**
     * @return {?}
     */
    destroy() {
        if (this._destroyed)
            return;
        this._destroyed = true;
        this.finish();
        removeKeyframeAnimation(this._element, this._name);
    }
}
if (false) {
    /**
     * @type {?}
     * @private
     */
    ElementAnimationStyleHandler.prototype._eventFn;
    /**
     * @type {?}
     * @private
     */
    ElementAnimationStyleHandler.prototype._finished;
    /**
     * @type {?}
     * @private
     */
    ElementAnimationStyleHandler.prototype._destroyed;
    /**
     * @type {?}
     * @private
     */
    ElementAnimationStyleHandler.prototype._startTime;
    /**
     * @type {?}
     * @private
     */
    ElementAnimationStyleHandler.prototype._position;
    /**
     * @type {?}
     * @private
     */
    ElementAnimationStyleHandler.prototype._element;
    /**
     * @type {?}
     * @private
     */
    ElementAnimationStyleHandler.prototype._name;
    /**
     * @type {?}
     * @private
     */
    ElementAnimationStyleHandler.prototype._duration;
    /**
     * @type {?}
     * @private
     */
    ElementAnimationStyleHandler.prototype._delay;
    /**
     * @type {?}
     * @private
     */
    ElementAnimationStyleHandler.prototype._easing;
    /**
     * @type {?}
     * @private
     */
    ElementAnimationStyleHandler.prototype._fillMode;
    /**
     * @type {?}
     * @private
     */
    ElementAnimationStyleHandler.prototype._onDoneFn;
}
/**
 * @param {?} element
 * @param {?} name
 * @param {?} status
 * @return {?}
 */
function playPauseAnimation(element, name, status) {
    /** @type {?} */
    const index = findIndexForAnimation(element, name);
    setAnimationStyle(element, 'PlayState', status, index);
}
/**
 * @param {?} element
 * @param {?} value
 * @return {?}
 */
function applyKeyframeAnimation(element, value) {
    /** @type {?} */
    const anim = getAnimationStyle(element, '').trim();
    /** @type {?} */
    let index = 0;
    if (anim.length) {
        index = countChars(anim, ',') + 1;
        value = `${anim}, ${value}`;
    }
    setAnimationStyle(element, '', value);
    return index;
}
/**
 * @param {?} element
 * @param {?} name
 * @return {?}
 */
function removeKeyframeAnimation(element, name) {
    /** @type {?} */
    const anim = getAnimationStyle(element, '');
    /** @type {?} */
    const tokens = anim.split(',');
    /** @type {?} */
    const index = findMatchingTokenIndex(tokens, name);
    if (index >= 0) {
        tokens.splice(index, 1);
        /** @type {?} */
        const newValue = tokens.join(',');
        setAnimationStyle(element, '', newValue);
    }
}
/**
 * @param {?} element
 * @param {?} value
 * @return {?}
 */
function findIndexForAnimation(element, value) {
    /** @type {?} */
    const anim = getAnimationStyle(element, '');
    if (anim.indexOf(',') > 0) {
        /** @type {?} */
        const tokens = anim.split(',');
        return findMatchingTokenIndex(tokens, value);
    }
    return findMatchingTokenIndex([anim], value);
}
/**
 * @param {?} tokens
 * @param {?} searchToken
 * @return {?}
 */
function findMatchingTokenIndex(tokens, searchToken) {
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].indexOf(searchToken) >= 0) {
            return i;
        }
    }
    return -1;
}
/**
 * @param {?} element
 * @param {?} fn
 * @param {?} doRemove
 * @return {?}
 */
function addRemoveAnimationEvent(element, fn, doRemove) {
    doRemove ? element.removeEventListener(ANIMATIONEND_EVENT, fn) :
        element.addEventListener(ANIMATIONEND_EVENT, fn);
}
/**
 * @param {?} element
 * @param {?} name
 * @param {?} value
 * @param {?=} index
 * @return {?}
 */
function setAnimationStyle(element, name, value, index) {
    /** @type {?} */
    const prop = ANIMATION_PROP + name;
    if (index != null) {
        /** @type {?} */
        const oldValue = element.style[prop];
        if (oldValue.length) {
            /** @type {?} */
            const tokens = oldValue.split(',');
            tokens[index] = value;
            value = tokens.join(',');
        }
    }
    element.style[prop] = value;
}
/**
 * @param {?} element
 * @param {?} name
 * @return {?}
 */
function getAnimationStyle(element, name) {
    return element.style[ANIMATION_PROP + name];
}
/**
 * @param {?} value
 * @param {?} char
 * @return {?}
 */
function countChars(value, char) {
    /** @type {?} */
    let count = 0;
    for (let i = 0; i < value.length; i++) {
        /** @type {?} */
        const c = value.charAt(i);
        if (c === char)
            count++;
    }
    return count;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxlbWVudF9hbmltYXRpb25fc3R5bGVfaGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2FuaW1hdGlvbnMvYnJvd3Nlci9zcmMvcmVuZGVyL2Nzc19rZXlmcmFtZXMvZWxlbWVudF9hbmltYXRpb25fc3R5bGVfaGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7TUFPTSwrQkFBK0IsR0FBRyxDQUFDOztNQUNuQyxjQUFjLEdBQUcsV0FBVzs7TUFDNUIsa0JBQWtCLEdBQUcsY0FBYzs7TUFDbkMsVUFBVSxHQUFHLElBQUk7QUFFdkIsTUFBTSxPQUFPLDRCQUE0Qjs7Ozs7Ozs7OztJQU92QyxZQUNxQixRQUFhLEVBQW1CLEtBQWEsRUFDN0MsU0FBaUIsRUFBbUIsTUFBYyxFQUNsRCxPQUFlLEVBQW1CLFNBQStCLEVBQ2pFLFNBQW9CO1FBSHBCLGFBQVEsR0FBUixRQUFRLENBQUs7UUFBbUIsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUM3QyxjQUFTLEdBQVQsU0FBUyxDQUFRO1FBQW1CLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDbEQsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUFtQixjQUFTLEdBQVQsU0FBUyxDQUFzQjtRQUNqRSxjQUFTLEdBQVQsU0FBUyxDQUFXO1FBVGpDLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFDbEIsZUFBVSxHQUFHLEtBQUssQ0FBQztRQUNuQixlQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQ2YsY0FBUyxHQUFHLENBQUMsQ0FBQztRQU9wQixJQUFJLENBQUMsUUFBUTs7OztRQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFBLENBQUM7SUFDakQsQ0FBQzs7OztJQUVELEtBQUs7UUFDSCxzQkFBc0IsQ0FDbEIsSUFBSSxDQUFDLFFBQVEsRUFDYixHQUFHLElBQUksQ0FB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QyxNQUFNLEVBQUU7O2tCQUNiLE1BQU0sR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztZQUNsQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDO1lBQ3RCLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzFCO0tBQ0Y7SUFDRCxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQztBQUM5QixDQUFDOzs7Ozs7QUFFRCxTQUFTLGlCQUFpQixDQUFDLE9BQVksRUFBRSxJQUFZO0lBQ25ELE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDOUMsQ0FBQzs7Ozs7O0FBRUQsU0FBUyxVQUFVLENBQUMsS0FBYSxFQUFFLElBQVk7O1FBQ3pDLEtBQUssR0FBRyxDQUFDO0lBQ2IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7O2NBQy9CLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFJLENBQUMsS0FBSyxJQUFJO1lBQUUsS0FBSyxFQUFFLENBQUM7S0FDekI7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5jb25zdCBFTEFQU0VEX1RJTUVfTUFYX0RFQ0lNQUxfUExBQ0VTID0gMztcbmNvbnN0IEFOSU1BVElPTl9QUk9QID0gJ2FuaW1hdGlvbic7XG5jb25zdCBBTklNQVRJT05FTkRfRVZFTlQgPSAnYW5pbWF0aW9uZW5kJztcbmNvbnN0IE9ORV9TRUNPTkQgPSAxMDAwO1xuXG5leHBvcnQgY2xhc3MgRWxlbWVudEFuaW1hdGlvblN0eWxlSGFuZGxlciB7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2V2ZW50Rm46IChlOiBhbnkpID0+IGFueTtcbiAgcHJpdmF0ZSBfZmluaXNoZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfZGVzdHJveWVkID0gZmFsc2U7XG4gIHByaXZhdGUgX3N0YXJ0VGltZSA9IDA7XG4gIHByaXZhdGUgX3Bvc2l0aW9uID0gMDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgcmVhZG9ubHkgX2VsZW1lbnQ6IGFueSwgcHJpdmF0ZSByZWFkb25seSBfbmFtZTogc3RyaW5nLFxuICAgICAgcHJpdmF0ZSByZWFkb25seSBfZHVyYXRpb246IG51bWJlciwgcHJpdmF0ZSByZWFkb25seSBfZGVsYXk6IG51bWJlcixcbiAgICAgIHByaXZhdGUgcmVhZG9ubHkgX2Vhc2luZzogc3RyaW5nLCBwcml2YXRlIHJlYWRvbmx5IF9maWxsTW9kZTogJyd8J2JvdGgnfCdmb3J3YXJkcycsXG4gICAgICBwcml2YXRlIHJlYWRvbmx5IF9vbkRvbmVGbjogKCkgPT4gYW55KSB7XG4gICAgdGhpcy5fZXZlbnRGbiA9IChlKSA9PiB0aGlzLl9oYW5kbGVDYWxsYmFjayhlKTtcbiAgfVxuXG4gIGFwcGx5KCkge1xuICAgIGFwcGx5S2V5ZnJhbWVBbmltYXRpb24oXG4gICAgICAgIHRoaXMuX2VsZW1lbnQsXG4gICAgICAgIGAke3RoaXMuX2R1cmF0aW9ufW1zICR7dGhpcy5fZWFzaW5nfSAke3RoaXMuX2RlbGF5fW1zIDEgbm9ybWFsICR7dGhpcy5fZmlsbE1vZGV9ICR7dGhpcy5fbmFtZX1gKTtcbiAgICBhZGRSZW1vdmVBbmltYXRpb25FdmVudCh0aGlzLl9lbGVtZW50LCB0aGlzLl9ldmVudEZuLCBmYWxzZSk7XG4gICAgdGhpcy5fc3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcbiAgfVxuXG4gIHBhdXNlKCkgeyBwbGF5UGF1c2VBbmltYXRpb24odGhpcy5fZWxlbWVudCwgdGhpcy5fbmFtZSwgJ3BhdXNlZCcpOyB9XG5cbiAgcmVzdW1lKCkgeyBwbGF5UGF1c2VBbmltYXRpb24odGhpcy5fZWxlbWVudCwgdGhpcy5fbmFtZSwgJ3J1bm5pbmcnKTsgfVxuXG4gIHNldFBvc2l0aW9uKHBvc2l0aW9uOiBudW1iZXIpIHtcbiAgICBjb25zdCBpbmRleCA9IGZpbmRJbmRleEZvckFuaW1hdGlvbih0aGlzLl9lbGVtZW50LCB0aGlzLl9uYW1lKTtcbiAgICB0aGlzLl9wb3NpdGlvbiA9IHBvc2l0aW9uICogdGhpcy5fZHVyYXRpb247XG4gICAgc2V0QW5pbWF0aW9uU3R5bGUodGhpcy5fZWxlbWVudCwgJ0RlbGF5JywgYC0ke3RoaXMuX3Bvc2l0aW9ufW1zYCwgaW5kZXgpO1xuICB9XG5cbiAgZ2V0UG9zaXRpb24oKSB7IHJldHVybiB0aGlzLl9wb3NpdGlvbjsgfVxuXG4gIHByaXZhdGUgX2hhbmRsZUNhbGxiYWNrKGV2ZW50OiBhbnkpIHtcbiAgICBjb25zdCB0aW1lc3RhbXAgPSBldmVudC5fbmdUZXN0TWFudWFsVGltZXN0YW1wIHx8IERhdGUubm93KCk7XG4gICAgY29uc3QgZWxhcHNlZFRpbWUgPVxuICAgICAgICBwYXJzZUZsb2F0KGV2ZW50LmVsYXBzZWRUaW1lLnRvRml4ZWQoRUxBUFNFRF9USU1FX01BWF9ERUNJTUFMX1BMQUNFUykpICogT05FX1NFQ09ORDtcbiAgICBpZiAoZXZlbnQuYW5pbWF0aW9uTmFtZSA9PSB0aGlzLl9uYW1lICYmXG4gICAgICAgIE1hdGgubWF4KHRpbWVzdGFtcCAtIHRoaXMuX3N0YXJ0VGltZSwgMCkgPj0gdGhpcy5fZGVsYXkgJiYgZWxhcHNlZFRpbWUgPj0gdGhpcy5fZHVyYXRpb24pIHtcbiAgICAgIHRoaXMuZmluaXNoKCk7XG4gICAgfVxuICB9XG5cbiAgZmluaXNoKCkge1xuICAgIGlmICh0aGlzLl9maW5pc2hlZCkgcmV0dXJuO1xuICAgIHRoaXMuX2ZpbmlzaGVkID0gdHJ1ZTtcbiAgICB0aGlzLl9vbkRvbmVGbigpO1xuICAgIGFkZFJlbW92ZUFuaW1hdGlvbkV2ZW50KHRoaXMuX2VsZW1lbnQsIHRoaXMuX2V2ZW50Rm4sIHRydWUpO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5fZGVzdHJveWVkKSByZXR1cm47XG4gICAgdGhpcy5fZGVzdHJveWVkID0gdHJ1ZTtcbiAgICB0aGlzLmZpbmlzaCgpO1xuICAgIHJlbW92ZUtleWZyYW1lQW5pbWF0aW9uKHRoaXMuX2VsZW1lbnQsIHRoaXMuX25hbWUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHBsYXlQYXVzZUFuaW1hdGlvbihlbGVtZW50OiBhbnksIG5hbWU6IHN0cmluZywgc3RhdHVzOiAncnVubmluZycgfCAncGF1c2VkJykge1xuICBjb25zdCBpbmRleCA9IGZpbmRJbmRleEZvckFuaW1hdGlvbihlbGVtZW50LCBuYW1lKTtcbiAgc2V0QW5pbWF0aW9uU3R5bGUoZWxlbWVudCwgJ1BsYXlTdGF0ZScsIHN0YXR1cywgaW5kZXgpO1xufVxuXG5mdW5jdGlvbiBhcHBseUtleWZyYW1lQW5pbWF0aW9uKGVsZW1lbnQ6IGFueSwgdmFsdWU6IHN0cmluZyk6IG51bWJlciB7XG4gIGNvbnN0IGFuaW0gPSBnZXRBbmltYXRpb25TdHlsZShlbGVtZW50LCAnJykudHJpbSgpO1xuICBsZXQgaW5kZXggPSAwO1xuICBpZiAoYW5pbS5sZW5ndGgpIHtcbiAgICBpbmRleCA9IGNvdW50Q2hhcnMoYW5pbSwgJywnKSArIDE7XG4gICAgdmFsdWUgPSBgJHthbmltfSwgJHt2YWx1ZX1gO1xuICB9XG4gIHNldEFuaW1hdGlvblN0eWxlKGVsZW1lbnQsICcnLCB2YWx1ZSk7XG4gIHJldHVybiBpbmRleDtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlS2V5ZnJhbWVBbmltYXRpb24oZWxlbWVudDogYW55LCBuYW1lOiBzdHJpbmcpIHtcbiAgY29uc3QgYW5pbSA9IGdldEFuaW1hdGlvblN0eWxlKGVsZW1lbnQsICcnKTtcbiAgY29uc3QgdG9rZW5zID0gYW5pbS5zcGxpdCgnLCcpO1xuICBjb25zdCBpbmRleCA9IGZpbmRNYXRjaGluZ1Rva2VuSW5kZXgodG9rZW5zLCBuYW1lKTtcbiAgaWYgKGluZGV4ID49IDApIHtcbiAgICB0b2tlbnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IHRva2Vucy5qb2luKCcsJyk7XG4gICAgc2V0QW5pbWF0aW9uU3R5bGUoZWxlbWVudCwgJycsIG5ld1ZhbHVlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBmaW5kSW5kZXhGb3JBbmltYXRpb24oZWxlbWVudDogYW55LCB2YWx1ZTogc3RyaW5nKSB7XG4gIGNvbnN0IGFuaW0gPSBnZXRBbmltYXRpb25TdHlsZShlbGVtZW50LCAnJyk7XG4gIGlmIChhbmltLmluZGV4T2YoJywnKSA+IDApIHtcbiAgICBjb25zdCB0b2tlbnMgPSBhbmltLnNwbGl0KCcsJyk7XG4gICAgcmV0dXJuIGZpbmRNYXRjaGluZ1Rva2VuSW5kZXgodG9rZW5zLCB2YWx1ZSk7XG4gIH1cbiAgcmV0dXJuIGZpbmRNYXRjaGluZ1Rva2VuSW5kZXgoW2FuaW1dLCB2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIGZpbmRNYXRjaGluZ1Rva2VuSW5kZXgodG9rZW5zOiBzdHJpbmdbXSwgc2VhcmNoVG9rZW46IHN0cmluZyk6IG51bWJlciB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHRva2Vuc1tpXS5pbmRleE9mKHNlYXJjaFRva2VuKSA+PSAwKSB7XG4gICAgICByZXR1cm4gaTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG5mdW5jdGlvbiBhZGRSZW1vdmVBbmltYXRpb25FdmVudChlbGVtZW50OiBhbnksIGZuOiAoZTogYW55KSA9PiBhbnksIGRvUmVtb3ZlOiBib29sZWFuKSB7XG4gIGRvUmVtb3ZlID8gZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKEFOSU1BVElPTkVORF9FVkVOVCwgZm4pIDpcbiAgICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoQU5JTUFUSU9ORU5EX0VWRU5ULCBmbik7XG59XG5cbmZ1bmN0aW9uIHNldEFuaW1hdGlvblN0eWxlKGVsZW1lbnQ6IGFueSwgbmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCBpbmRleD86IG51bWJlcikge1xuICBjb25zdCBwcm9wID0gQU5JTUFUSU9OX1BST1AgKyBuYW1lO1xuICBpZiAoaW5kZXggIT0gbnVsbCkge1xuICAgIGNvbnN0IG9sZFZhbHVlID0gZWxlbWVudC5zdHlsZVtwcm9wXTtcbiAgICBpZiAob2xkVmFsdWUubGVuZ3RoKSB7XG4gICAgICBjb25zdCB0b2tlbnMgPSBvbGRWYWx1ZS5zcGxpdCgnLCcpO1xuICAgICAgdG9rZW5zW2luZGV4XSA9IHZhbHVlO1xuICAgICAgdmFsdWUgPSB0b2tlbnMuam9pbignLCcpO1xuICAgIH1cbiAgfVxuICBlbGVtZW50LnN0eWxlW3Byb3BdID0gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIGdldEFuaW1hdGlvblN0eWxlKGVsZW1lbnQ6IGFueSwgbmFtZTogc3RyaW5nKSB7XG4gIHJldHVybiBlbGVtZW50LnN0eWxlW0FOSU1BVElPTl9QUk9QICsgbmFtZV07XG59XG5cbmZ1bmN0aW9uIGNvdW50Q2hhcnModmFsdWU6IHN0cmluZywgY2hhcjogc3RyaW5nKTogbnVtYmVyIHtcbiAgbGV0IGNvdW50ID0gMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGMgPSB2YWx1ZS5jaGFyQXQoaSk7XG4gICAgaWYgKGMgPT09IGNoYXIpIGNvdW50Kys7XG4gIH1cbiAgcmV0dXJuIGNvdW50O1xufVxuIl19