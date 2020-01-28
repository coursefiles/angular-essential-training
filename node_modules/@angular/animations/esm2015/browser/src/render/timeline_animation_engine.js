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
import { AUTO_STYLE } from '@angular/animations';
import { buildAnimationAst } from '../dsl/animation_ast_builder';
import { buildAnimationTimelines } from '../dsl/animation_timeline_builder';
import { ElementInstructionMap } from '../dsl/element_instruction_map';
import { ENTER_CLASSNAME, LEAVE_CLASSNAME } from '../util';
import { getOrSetAsInMap, listenOnPlayer, makeAnimationEvent, normalizeKeyframes, optimizeGroupPlayer } from './shared';
/** @type {?} */
const EMPTY_INSTRUCTION_MAP = new ElementInstructionMap();
export class TimelineAnimationEngine {
    /**
     * @param {?} bodyNode
     * @param {?} _driver
     * @param {?} _normalizer
     */
    constructor(bodyNode, _driver, _normalizer) {
        this.bodyNode = bodyNode;
        this._driver = _driver;
        this._normalizer = _normalizer;
        this._animations = {};
        this._playersById = {};
        this.players = [];
    }
    /**
     * @param {?} id
     * @param {?} metadata
     * @return {?}
     */
    register(id, metadata) {
        /** @type {?} */
        const errors = [];
        /** @type {?} */
        const ast = buildAnimationAst(this._driver, metadata, errors);
        if (errors.length) {
            throw new Error(`Unable to build the animation due to the following errors: ${errors.join("\n")}`);
        }
        else {
            this._animations[id] = ast;
        }
    }
    /**
     * @private
     * @param {?} i
     * @param {?} preStyles
     * @param {?=} postStyles
     * @return {?}
     */
    _buildPlayer(i, preStyles, postStyles) {
        /** @type {?} */
        const element = i.element;
        /** @type {?} */
        const keyframes = normalizeKeyframes(this._driver, this._normalizer, element, i.keyframes, preStyles, postStyles);
        return this._driver.animate(element, keyframes, i.duration, i.delay, i.easing, [], true);
    }
    /**
     * @param {?} id
     * @param {?} element
     * @param {?=} options
     * @return {?}
     */
    create(id, element, options = {}) {
        /** @type {?} */
        const errors = [];
        /** @type {?} */
        const ast = this._animations[id];
        /** @type {?} */
        let instructions;
        /** @type {?} */
        const autoStylesMap = new Map();
        if (ast) {
            instructions = buildAnimationTimelines(this._driver, element, ast, ENTER_CLASSNAME, LEAVE_CLASSNAME, {}, {}, options, EMPTY_INSTRUCTION_MAP, errors);
            instructions.forEach((/**
             * @param {?} inst
             * @return {?}
             */
            inst => {
                /** @type {?} */
                const styles = getOrSetAsInMap(autoStylesMap, inst.element, {});
                inst.postStyleProps.forEach((/**
                 * @param {?} prop
                 * @return {?}
                 */
                prop => styles[prop] = null));
            }));
        }
        else {
            errors.push('The requested animation doesn\'t exist or has already been destroyed');
            instructions = [];
        }
        if (errors.length) {
            throw new Error(`Unable to create the animation due to the following errors: ${errors.join("\n")}`);
        }
        autoStylesMap.forEach((/**
         * @param {?} styles
         * @param {?} element
         * @return {?}
         */
        (styles, element) => {
            Object.keys(styles).forEach((/**
             * @param {?} prop
             * @return {?}
             */
            prop => { styles[prop] = this._driver.computeStyle(element, prop, AUTO_STYLE); }));
        }));
        /** @type {?} */
        const players = instructions.map((/**
         * @param {?} i
         * @return {?}
         */
        i => {
            /** @type {?} */
            const styles = autoStylesMap.get(i.element);
            return this._buildPlayer(i, {}, styles);
        }));
        /** @type {?} */
        const player = optimizeGroupPlayer(players);
        this._playersById[id] = player;
        player.onDestroy((/**
         * @return {?}
         */
        () => this.destroy(id)));
        this.players.push(player);
        return player;
    }
    /**
     * @param {?} id
     * @return {?}
     */
    destroy(id) {
        /** @type {?} */
        const player = this._getPlayer(id);
        player.destroy();
        delete this._playersById[id];
        /** @type {?} */
        const index = this.players.indexOf(player);
        if (index >= 0) {
            this.players.splice(index, 1);
        }
    }
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    _getPlayer(id) {
        /** @type {?} */
        const player = this._playersById[id];
        if (!player) {
            throw new Error(`Unable to find the timeline player referenced by ${id}`);
        }
        return player;
    }
    /**
     * @param {?} id
     * @param {?} element
     * @param {?} eventName
     * @param {?} callback
     * @return {?}
     */
    listen(id, element, eventName, callback) {
        // triggerName, fromState, toState are all ignored for timeline animations
        /** @type {?} */
        const baseEvent = makeAnimationEvent(element, '', '', '');
        listenOnPlayer(this._getPlayer(id), eventName, baseEvent, callback);
        return (/**
         * @return {?}
         */
        () => { });
    }
    /**
     * @param {?} id
     * @param {?} element
     * @param {?} command
     * @param {?} args
     * @return {?}
     */
    command(id, element, command, args) {
        if (command == 'register') {
            this.register(id, (/** @type {?} */ (args[0])));
            return;
        }
        if (command == 'create') {
            /** @type {?} */
            const options = (/** @type {?} */ ((args[0] || {})));
            this.create(id, element, options);
            return;
        }
        /** @type {?} */
        const player = this._getPlayer(id);
        switch (command) {
            case 'play':
                player.play();
                break;
            case 'pause':
                player.pause();
                break;
            case 'reset':
                player.reset();
                break;
            case 'restart':
                player.restart();
                break;
            case 'finish':
                player.finish();
                break;
            case 'init':
                player.init();
                break;
            case 'setPosition':
                player.setPosition(parseFloat((/** @type {?} */ (args[0]))));
                break;
            case 'destroy':
                this.destroy(id);
                break;
        }
    }
}
if (false) {
    /**
     * @type {?}
     * @private
     */
    TimelineAnimationEngine.prototype._animations;
    /**
     * @type {?}
     * @private
     */
    TimelineAnimationEngine.prototype._playersById;
    /** @type {?} */
    TimelineAnimationEngine.prototype.players;
    /** @type {?} */
    TimelineAnimationEngine.prototype.bodyNode;
    /**
     * @type {?}
     * @private
     */
    TimelineAnimationEngine.prototype._driver;
    /**
     * @type {?}
     * @private
     */
    TimelineAnimationEngine.prototype._normalizer;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZWxpbmVfYW5pbWF0aW9uX2VuZ2luZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2FuaW1hdGlvbnMvYnJvd3Nlci9zcmMvcmVuZGVyL3RpbWVsaW5lX2FuaW1hdGlvbl9lbmdpbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFPQSxPQUFPLEVBQUMsVUFBVSxFQUEwRixNQUFNLHFCQUFxQixDQUFDO0FBR3hJLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLDhCQUE4QixDQUFDO0FBQy9ELE9BQU8sRUFBQyx1QkFBdUIsRUFBQyxNQUFNLG1DQUFtQyxDQUFDO0FBRTFFLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLGdDQUFnQyxDQUFDO0FBRXJFLE9BQU8sRUFBQyxlQUFlLEVBQUUsZUFBZSxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBR3pELE9BQU8sRUFBQyxlQUFlLEVBQUUsY0FBYyxFQUFFLGtCQUFrQixFQUFFLGtCQUFrQixFQUFFLG1CQUFtQixFQUFDLE1BQU0sVUFBVSxDQUFDOztNQUVoSCxxQkFBcUIsR0FBRyxJQUFJLHFCQUFxQixFQUFFO0FBRXpELE1BQU0sT0FBTyx1QkFBdUI7Ozs7OztJQUtsQyxZQUNXLFFBQWEsRUFBVSxPQUF3QixFQUM5QyxXQUFxQztRQUR0QyxhQUFRLEdBQVIsUUFBUSxDQUFLO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBaUI7UUFDOUMsZ0JBQVcsR0FBWCxXQUFXLENBQTBCO1FBTnpDLGdCQUFXLEdBQStDLEVBQUUsQ0FBQztRQUM3RCxpQkFBWSxHQUFvQyxFQUFFLENBQUM7UUFDcEQsWUFBTyxHQUFzQixFQUFFLENBQUM7SUFJYSxDQUFDOzs7Ozs7SUFFckQsUUFBUSxDQUFDLEVBQVUsRUFBRSxRQUErQzs7Y0FDNUQsTUFBTSxHQUFVLEVBQUU7O2NBQ2xCLEdBQUcsR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsT0FB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O2dCQUNoQixNQUFNLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxtQkFBQSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xELE1BQU07WUFDUixLQUFLLFNBQVM7Z0JBQ1osSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDakIsTUFBTTtTQUNUO0lBQ0gsQ0FBQztDQUNGOzs7Ozs7SUF4SUMsOENBQXFFOzs7OztJQUNyRSwrQ0FBMkQ7O0lBQzNELDBDQUF1Qzs7SUFHbkMsMkNBQW9COzs7OztJQUFFLDBDQUFnQzs7Ozs7SUFDdEQsOENBQTZDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtBVVRPX1NUWUxFLCBBbmltYXRpb25NZXRhZGF0YSwgQW5pbWF0aW9uTWV0YWRhdGFUeXBlLCBBbmltYXRpb25PcHRpb25zLCBBbmltYXRpb25QbGF5ZXIsIMm1U3R5bGVEYXRhfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcblxuaW1wb3J0IHtBc3R9IGZyb20gJy4uL2RzbC9hbmltYXRpb25fYXN0JztcbmltcG9ydCB7YnVpbGRBbmltYXRpb25Bc3R9IGZyb20gJy4uL2RzbC9hbmltYXRpb25fYXN0X2J1aWxkZXInO1xuaW1wb3J0IHtidWlsZEFuaW1hdGlvblRpbWVsaW5lc30gZnJvbSAnLi4vZHNsL2FuaW1hdGlvbl90aW1lbGluZV9idWlsZGVyJztcbmltcG9ydCB7QW5pbWF0aW9uVGltZWxpbmVJbnN0cnVjdGlvbn0gZnJvbSAnLi4vZHNsL2FuaW1hdGlvbl90aW1lbGluZV9pbnN0cnVjdGlvbic7XG5pbXBvcnQge0VsZW1lbnRJbnN0cnVjdGlvbk1hcH0gZnJvbSAnLi4vZHNsL2VsZW1lbnRfaW5zdHJ1Y3Rpb25fbWFwJztcbmltcG9ydCB7QW5pbWF0aW9uU3R5bGVOb3JtYWxpemVyfSBmcm9tICcuLi9kc2wvc3R5bGVfbm9ybWFsaXphdGlvbi9hbmltYXRpb25fc3R5bGVfbm9ybWFsaXplcic7XG5pbXBvcnQge0VOVEVSX0NMQVNTTkFNRSwgTEVBVkVfQ0xBU1NOQU1FfSBmcm9tICcuLi91dGlsJztcblxuaW1wb3J0IHtBbmltYXRpb25Ecml2ZXJ9IGZyb20gJy4vYW5pbWF0aW9uX2RyaXZlcic7XG5pbXBvcnQge2dldE9yU2V0QXNJbk1hcCwgbGlzdGVuT25QbGF5ZXIsIG1ha2VBbmltYXRpb25FdmVudCwgbm9ybWFsaXplS2V5ZnJhbWVzLCBvcHRpbWl6ZUdyb3VwUGxheWVyfSBmcm9tICcuL3NoYXJlZCc7XG5cbmNvbnN0IEVNUFRZX0lOU1RSVUNUSU9OX01BUCA9IG5ldyBFbGVtZW50SW5zdHJ1Y3Rpb25NYXAoKTtcblxuZXhwb3J0IGNsYXNzIFRpbWVsaW5lQW5pbWF0aW9uRW5naW5lIHtcbiAgcHJpdmF0ZSBfYW5pbWF0aW9uczoge1tpZDogc3RyaW5nXTogQXN0PEFuaW1hdGlvbk1ldGFkYXRhVHlwZT59ID0ge307XG4gIHByaXZhdGUgX3BsYXllcnNCeUlkOiB7W2lkOiBzdHJpbmddOiBBbmltYXRpb25QbGF5ZXJ9ID0ge307XG4gIHB1YmxpYyBwbGF5ZXJzOiBBbmltYXRpb25QbGF5ZXJbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHVibGljIGJvZHlOb2RlOiBhbnksIHByaXZhdGUgX2RyaXZlcjogQW5pbWF0aW9uRHJpdmVyLFxuICAgICAgcHJpdmF0ZSBfbm9ybWFsaXplcjogQW5pbWF0aW9uU3R5bGVOb3JtYWxpemVyKSB7fVxuXG4gIHJlZ2lzdGVyKGlkOiBzdHJpbmcsIG1ldGFkYXRhOiBBbmltYXRpb25NZXRhZGF0YXxBbmltYXRpb25NZXRhZGF0YVtdKSB7XG4gICAgY29uc3QgZXJyb3JzOiBhbnlbXSA9IFtdO1xuICAgIGNvbnN0IGFzdCA9IGJ1aWxkQW5pbWF0aW9uQXN0KHRoaXMuX2RyaXZlciwgbWV0YWRhdGEsIGVycm9ycyk7XG4gICAgaWYgKGVycm9ycy5sZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgVW5hYmxlIHRvIGJ1aWxkIHRoZSBhbmltYXRpb24gZHVlIHRvIHRoZSBmb2xsb3dpbmcgZXJyb3JzOiAke2Vycm9ycy5qb2luKFwiXFxuXCIpfWApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9hbmltYXRpb25zW2lkXSA9IGFzdDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9idWlsZFBsYXllcihcbiAgICAgIGk6IEFuaW1hdGlvblRpbWVsaW5lSW5zdHJ1Y3Rpb24sIHByZVN0eWxlczogybVTdHlsZURhdGEsXG4gICAgICBwb3N0U3R5bGVzPzogybVTdHlsZURhdGEpOiBBbmltYXRpb25QbGF5ZXIge1xuICAgIGNvbnN0IGVsZW1lbnQgPSBpLmVsZW1lbnQ7XG4gICAgY29uc3Qga2V5ZnJhbWVzID0gbm9ybWFsaXplS2V5ZnJhbWVzKFxuICAgICAgICB0aGlzLl9kcml2ZXIsIHRoaXMuX25vcm1hbGl6ZXIsIGVsZW1lbnQsIGkua2V5ZnJhbWVzLCBwcmVTdHlsZXMsIHBvc3RTdHlsZXMpO1xuICAgIHJldHVybiB0aGlzLl9kcml2ZXIuYW5pbWF0ZShlbGVtZW50LCBrZXlmcmFtZXMsIGkuZHVyYXRpb24sIGkuZGVsYXksIGkuZWFzaW5nLCBbXSwgdHJ1ZSk7XG4gIH1cblxuICBjcmVhdGUoaWQ6IHN0cmluZywgZWxlbWVudDogYW55LCBvcHRpb25zOiBBbmltYXRpb25PcHRpb25zID0ge30pOiBBbmltYXRpb25QbGF5ZXIge1xuICAgIGNvbnN0IGVycm9yczogYW55W10gPSBbXTtcbiAgICBjb25zdCBhc3QgPSB0aGlzLl9hbmltYXRpb25zW2lkXTtcbiAgICBsZXQgaW5zdHJ1Y3Rpb25zOiBBbmltYXRpb25UaW1lbGluZUluc3RydWN0aW9uW107XG5cbiAgICBjb25zdCBhdXRvU3R5bGVzTWFwID0gbmV3IE1hcDxhbnksIMm1U3R5bGVEYXRhPigpO1xuXG4gICAgaWYgKGFzdCkge1xuICAgICAgaW5zdHJ1Y3Rpb25zID0gYnVpbGRBbmltYXRpb25UaW1lbGluZXMoXG4gICAgICAgICAgdGhpcy5fZHJpdmVyLCBlbGVtZW50LCBhc3QsIEVOVEVSX0NMQVNTTkFNRSwgTEVBVkVfQ0xBU1NOQU1FLCB7fSwge30sIG9wdGlvbnMsXG4gICAgICAgICAgRU1QVFlfSU5TVFJVQ1RJT05fTUFQLCBlcnJvcnMpO1xuICAgICAgaW5zdHJ1Y3Rpb25zLmZvckVhY2goaW5zdCA9PiB7XG4gICAgICAgIGNvbnN0IHN0eWxlcyA9IGdldE9yU2V0QXNJbk1hcChhdXRvU3R5bGVzTWFwLCBpbnN0LmVsZW1lbnQsIHt9KTtcbiAgICAgICAgaW5zdC5wb3N0U3R5bGVQcm9wcy5mb3JFYWNoKHByb3AgPT4gc3R5bGVzW3Byb3BdID0gbnVsbCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXJyb3JzLnB1c2goJ1RoZSByZXF1ZXN0ZWQgYW5pbWF0aW9uIGRvZXNuXFwndCBleGlzdCBvciBoYXMgYWxyZWFkeSBiZWVuIGRlc3Ryb3llZCcpO1xuICAgICAgaW5zdHJ1Y3Rpb25zID0gW107XG4gICAgfVxuXG4gICAgaWYgKGVycm9ycy5sZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgVW5hYmxlIHRvIGNyZWF0ZSB0aGUgYW5pbWF0aW9uIGR1ZSB0byB0aGUgZm9sbG93aW5nIGVycm9yczogJHtlcnJvcnMuam9pbihcIlxcblwiKX1gKTtcbiAgICB9XG5cbiAgICBhdXRvU3R5bGVzTWFwLmZvckVhY2goKHN0eWxlcywgZWxlbWVudCkgPT4ge1xuICAgICAgT2JqZWN0LmtleXMoc3R5bGVzKS5mb3JFYWNoKFxuICAgICAgICAgIHByb3AgPT4geyBzdHlsZXNbcHJvcF0gPSB0aGlzLl9kcml2ZXIuY29tcHV0ZVN0eWxlKGVsZW1lbnQsIHByb3AsIEFVVE9fU1RZTEUpOyB9KTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHBsYXllcnMgPSBpbnN0cnVjdGlvbnMubWFwKGkgPT4ge1xuICAgICAgY29uc3Qgc3R5bGVzID0gYXV0b1N0eWxlc01hcC5nZXQoaS5lbGVtZW50KTtcbiAgICAgIHJldHVybiB0aGlzLl9idWlsZFBsYXllcihpLCB7fSwgc3R5bGVzKTtcbiAgICB9KTtcbiAgICBjb25zdCBwbGF5ZXIgPSBvcHRpbWl6ZUdyb3VwUGxheWVyKHBsYXllcnMpO1xuICAgIHRoaXMuX3BsYXllcnNCeUlkW2lkXSA9IHBsYXllcjtcbiAgICBwbGF5ZXIub25EZXN0cm95KCgpID0+IHRoaXMuZGVzdHJveShpZCkpO1xuXG4gICAgdGhpcy5wbGF5ZXJzLnB1c2gocGxheWVyKTtcbiAgICByZXR1cm4gcGxheWVyO1xuICB9XG5cbiAgZGVzdHJveShpZDogc3RyaW5nKSB7XG4gICAgY29uc3QgcGxheWVyID0gdGhpcy5fZ2V0UGxheWVyKGlkKTtcbiAgICBwbGF5ZXIuZGVzdHJveSgpO1xuICAgIGRlbGV0ZSB0aGlzLl9wbGF5ZXJzQnlJZFtpZF07XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLnBsYXllcnMuaW5kZXhPZihwbGF5ZXIpO1xuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICB0aGlzLnBsYXllcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9nZXRQbGF5ZXIoaWQ6IHN0cmluZyk6IEFuaW1hdGlvblBsYXllciB7XG4gICAgY29uc3QgcGxheWVyID0gdGhpcy5fcGxheWVyc0J5SWRbaWRdO1xuICAgIGlmICghcGxheWVyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBmaW5kIHRoZSB0aW1lbGluZSBwbGF5ZXIgcmVmZXJlbmNlZCBieSAke2lkfWApO1xuICAgIH1cbiAgICByZXR1cm4gcGxheWVyO1xuICB9XG5cbiAgbGlzdGVuKGlkOiBzdHJpbmcsIGVsZW1lbnQ6IHN0cmluZywgZXZlbnROYW1lOiBzdHJpbmcsIGNhbGxiYWNrOiAoZXZlbnQ6IGFueSkgPT4gYW55KTpcbiAgICAgICgpID0+IHZvaWQge1xuICAgIC8vIHRyaWdnZXJOYW1lLCBmcm9tU3RhdGUsIHRvU3RhdGUgYXJlIGFsbCBpZ25vcmVkIGZvciB0aW1lbGluZSBhbmltYXRpb25zXG4gICAgY29uc3QgYmFzZUV2ZW50ID0gbWFrZUFuaW1hdGlvbkV2ZW50KGVsZW1lbnQsICcnLCAnJywgJycpO1xuICAgIGxpc3Rlbk9uUGxheWVyKHRoaXMuX2dldFBsYXllcihpZCksIGV2ZW50TmFtZSwgYmFzZUV2ZW50LCBjYWxsYmFjayk7XG4gICAgcmV0dXJuICgpID0+IHt9O1xuICB9XG5cbiAgY29tbWFuZChpZDogc3RyaW5nLCBlbGVtZW50OiBhbnksIGNvbW1hbmQ6IHN0cmluZywgYXJnczogYW55W10pOiB2b2lkIHtcbiAgICBpZiAoY29tbWFuZCA9PSAncmVnaXN0ZXInKSB7XG4gICAgICB0aGlzLnJlZ2lzdGVyKGlkLCBhcmdzWzBdIGFzIEFuaW1hdGlvbk1ldGFkYXRhIHwgQW5pbWF0aW9uTWV0YWRhdGFbXSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGNvbW1hbmQgPT0gJ2NyZWF0ZScpIHtcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSAoYXJnc1swXSB8fCB7fSkgYXMgQW5pbWF0aW9uT3B0aW9ucztcbiAgICAgIHRoaXMuY3JlYXRlKGlkLCBlbGVtZW50LCBvcHRpb25zKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLl9nZXRQbGF5ZXIoaWQpO1xuICAgIHN3aXRjaCAoY29tbWFuZCkge1xuICAgICAgY2FzZSAncGxheSc6XG4gICAgICAgIHBsYXllci5wbGF5KCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncGF1c2UnOlxuICAgICAgICBwbGF5ZXIucGF1c2UoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdyZXNldCc6XG4gICAgICAgIHBsYXllci5yZXNldCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3Jlc3RhcnQnOlxuICAgICAgICBwbGF5ZXIucmVzdGFydCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2ZpbmlzaCc6XG4gICAgICAgIHBsYXllci5maW5pc2goKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdpbml0JzpcbiAgICAgICAgcGxheWVyLmluaXQoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzZXRQb3NpdGlvbic6XG4gICAgICAgIHBsYXllci5zZXRQb3NpdGlvbihwYXJzZUZsb2F0KGFyZ3NbMF0gYXMgc3RyaW5nKSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZGVzdHJveSc6XG4gICAgICAgIHRoaXMuZGVzdHJveShpZCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxufVxuIl19