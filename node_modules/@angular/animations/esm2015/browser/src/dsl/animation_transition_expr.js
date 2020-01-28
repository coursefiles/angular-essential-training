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
export const ANY_STATE = '*';
/**
 * @param {?} transitionValue
 * @param {?} errors
 * @return {?}
 */
export function parseTransitionExpr(transitionValue, errors) {
    /** @type {?} */
    const expressions = [];
    if (typeof transitionValue == 'string') {
        ((/** @type {?} */ (transitionValue)))
            .split(/\s*,\s*/)
            .forEach((/**
         * @param {?} str
         * @return {?}
         */
        str => parseInnerTransitionStr(str, expressions, errors)));
    }
    else {
        expressions.push((/** @type {?} */ (transitionValue)));
    }
    return expressions;
}
/**
 * @param {?} eventStr
 * @param {?} expressions
 * @param {?} errors
 * @return {?}
 */
function parseInnerTransitionStr(eventStr, expressions, errors) {
    if (eventStr[0] == ':') {
        /** @type {?} */
        const result = parseAnimationAlias(eventStr, errors);
        if (typeof result == 'function') {
            expressions.push(result);
            return;
        }
        eventStr = (/** @type {?} */ (result));
    }
    /** @type {?} */
    const match = eventStr.match(/^(\*|[-\w]+)\s*(<?[=-]>)\s*(\*|[-\w]+)$/);
    if (match == null || match.length < 4) {
        errors.push(`The provided transition expression "${eventStr}" is not supported`);
        return expressions;
    }
    /** @type {?} */
    const fromState = match[1];
    /** @type {?} */
    const separator = match[2];
    /** @type {?} */
    const toState = match[3];
    expressions.push(makeLambdaFromStates(fromState, toState));
    /** @type {?} */
    const isFullAnyStateExpr = fromState == ANY_STATE && toState == ANY_STATE;
    if (separator[0] == '<' && !isFullAnyStateExpr) {
        expressions.push(makeLambdaFromStates(toState, fromState));
    }
}
/**
 * @param {?} alias
 * @param {?} errors
 * @return {?}
 */
function parseAnimationAlias(alias, errors) {
    switch (alias) {
        case ':enter':
            return 'void => *';
        case ':leave':
            return '* => void';
        case ':increment':
            return (/**
             * @param {?} fromState
             * @param {?} toState
             * @return {?}
             */
            (fromState, toState) => parseFloat(toState) > parseFloat(fromState));
        case ':decrement':
            return (/**
             * @param {?} fromState
             * @param {?} toState
             * @return {?}
             */
            (fromState, toState) => parseFloat(toState) < parseFloat(fromState));
        default:
            errors.push(`The transition alias value "${alias}" is not supported`);
            return '* => *';
    }
}
// DO NOT REFACTOR ... keep the follow set instantiations
// with the values intact (closure compiler for some reason
// removes follow-up lines that add the values outside of
// the constructor...
/** @type {?} */
const TRUE_BOOLEAN_VALUES = new Set(['true', '1']);
/** @type {?} */
const FALSE_BOOLEAN_VALUES = new Set(['false', '0']);
/**
 * @param {?} lhs
 * @param {?} rhs
 * @return {?}
 */
function makeLambdaFromStates(lhs, rhs) {
    /** @type {?} */
    const LHS_MATCH_BOOLEAN = TRUE_BOOLEAN_VALUES.has(lhs) || FALSE_BOOLEAN_VALUES.has(lhs);
    /** @type {?} */
    const RHS_MATCH_BOOLEAN = TRUE_BOOLEAN_VALUES.has(rhs) || FALSE_BOOLEAN_VALUES.has(rhs);
    return (/**
     * @param {?} fromState
     * @param {?} toState
     * @return {?}
     */
    (fromState, toState) => {
        /** @type {?} */
        let lhsMatch = lhs == ANY_STATE || lhs == fromState;
        /** @type {?} */
        let rhsMatch = rhs == ANY_STATE || rhs == toState;
        if (!lhsMatch && LHS_MATCH_BOOLEAN && typeof fromState === 'boolean') {
            lhsMatch = fromState ? TRUE_BOOLEAN_VALUES.has(lhs) : FALSE_BOOLEAN_VALUES.has(lhs);
        }
        if (!rhsMatch && RHS_MATCH_BOOLEAN && typeof toState === 'boolean') {
            rhsMatch = toState ? TRUE_BOOLEAN_VALUES.has(rhs) : FALSE_BOOLEAN_VALUES.has(rhs);
        }
        return lhsMatch && rhsMatch;
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX3RyYW5zaXRpb25fZXhwci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2FuaW1hdGlvbnMvYnJvd3Nlci9zcmMvZHNsL2FuaW1hdGlvbl90cmFuc2l0aW9uX2V4cHIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBT0EsTUFBTSxPQUFPLFNBQVMsR0FBRyxHQUFHOzs7Ozs7QUFJNUIsTUFBTSxVQUFVLG1CQUFtQixDQUMvQixlQUE2QyxFQUFFLE1BQWdCOztVQUMzRCxXQUFXLEdBQTBCLEVBQUU7SUFDN0MsSUFBSSxPQUFPLGVBQWUsSUFBSSxRQUFRLEVBQUU7UUFDdEMsQ0FBQyxtQkFBUSxlQUFlLEVBQUEsQ0FBQzthQUNwQixLQUFLLENBQUMsU0FBUyxDQUFDO2FBQ2hCLE9BQU87Ozs7UUFBQyxHQUFHLENBQUMsRUFBRSxDQUFDLHVCQUF1QixDQUFDLEdBQUcsRUFBRSxXQUFXLEVBQUUsTUFBTSxDQUFDLEVBQUMsQ0FBQztLQUN4RTtTQUFNO1FBQ0wsV0FBVyxDQUFDLElBQUksQ0FBQyxtQkFBcUIsZUFBZSxFQUFBLENBQUMsQ0FBQztLQUN4RDtJQUNELE9BQU8sV0FBVyxDQUFDO0FBQ3JCLENBQUM7Ozs7Ozs7QUFFRCxTQUFTLHVCQUF1QixDQUM1QixRQUFnQixFQUFFLFdBQWtDLEVBQUUsTUFBZ0I7SUFDeEUsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxFQUFFOztjQUNoQixNQUFNLEdBQUcsbUJBQW1CLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQztRQUNwRCxJQUFJLE9BQU8sTUFBTSxJQUFJLFVBQVUsRUFBRTtZQUMvQixXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3pCLE9BQU87U0FDUjtRQUNELFFBQVEsR0FBRyxtQkFBQSxNQUFNLEVBQVUsQ0FBQztLQUM3Qjs7VUFFSyxLQUFLLEdBQUcsUUFB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QkFBbUIsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNuRjtRQUVELE9BQU8sUUFBUSxJQUFJLFFBQVEsQ0FBQztJQUM5QixDQUFDLEVBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuZXhwb3J0IGNvbnN0IEFOWV9TVEFURSA9ICcqJztcbmV4cG9ydCBkZWNsYXJlIHR5cGUgVHJhbnNpdGlvbk1hdGNoZXJGbiA9XG4gICAgKGZyb21TdGF0ZTogYW55LCB0b1N0YXRlOiBhbnksIGVsZW1lbnQ6IGFueSwgcGFyYW1zOiB7W2tleTogc3RyaW5nXTogYW55fSkgPT4gYm9vbGVhbjtcblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVHJhbnNpdGlvbkV4cHIoXG4gICAgdHJhbnNpdGlvblZhbHVlOiBzdHJpbmcgfCBUcmFuc2l0aW9uTWF0Y2hlckZuLCBlcnJvcnM6IHN0cmluZ1tdKTogVHJhbnNpdGlvbk1hdGNoZXJGbltdIHtcbiAgY29uc3QgZXhwcmVzc2lvbnM6IFRyYW5zaXRpb25NYXRjaGVyRm5bXSA9IFtdO1xuICBpZiAodHlwZW9mIHRyYW5zaXRpb25WYWx1ZSA9PSAnc3RyaW5nJykge1xuICAgICg8c3RyaW5nPnRyYW5zaXRpb25WYWx1ZSlcbiAgICAgICAgLnNwbGl0KC9cXHMqLFxccyovKVxuICAgICAgICAuZm9yRWFjaChzdHIgPT4gcGFyc2VJbm5lclRyYW5zaXRpb25TdHIoc3RyLCBleHByZXNzaW9ucywgZXJyb3JzKSk7XG4gIH0gZWxzZSB7XG4gICAgZXhwcmVzc2lvbnMucHVzaCg8VHJhbnNpdGlvbk1hdGNoZXJGbj50cmFuc2l0aW9uVmFsdWUpO1xuICB9XG4gIHJldHVybiBleHByZXNzaW9ucztcbn1cblxuZnVuY3Rpb24gcGFyc2VJbm5lclRyYW5zaXRpb25TdHIoXG4gICAgZXZlbnRTdHI6IHN0cmluZywgZXhwcmVzc2lvbnM6IFRyYW5zaXRpb25NYXRjaGVyRm5bXSwgZXJyb3JzOiBzdHJpbmdbXSkge1xuICBpZiAoZXZlbnRTdHJbMF0gPT0gJzonKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gcGFyc2VBbmltYXRpb25BbGlhcyhldmVudFN0ciwgZXJyb3JzKTtcbiAgICBpZiAodHlwZW9mIHJlc3VsdCA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBleHByZXNzaW9ucy5wdXNoKHJlc3VsdCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGV2ZW50U3RyID0gcmVzdWx0IGFzIHN0cmluZztcbiAgfVxuXG4gIGNvbnN0IG1hdGNoID0gZXZlbnRTdHIubWF0Y2goL14oXFwqfFstXFx3XSspXFxzKig8P1s9LV0+KVxccyooXFwqfFstXFx3XSspJC8pO1xuICBpZiAobWF0Y2ggPT0gbnVsbCB8fCBtYXRjaC5sZW5ndGggPCA0KSB7XG4gICAgZXJyb3JzLnB1c2goYFRoZSBwcm92aWRlZCB0cmFuc2l0aW9uIGV4cHJlc3Npb24gXCIke2V2ZW50U3RyfVwiIGlzIG5vdCBzdXBwb3J0ZWRgKTtcbiAgICByZXR1cm4gZXhwcmVzc2lvbnM7XG4gIH1cblxuICBjb25zdCBmcm9tU3RhdGUgPSBtYXRjaFsxXTtcbiAgY29uc3Qgc2VwYXJhdG9yID0gbWF0Y2hbMl07XG4gIGNvbnN0IHRvU3RhdGUgPSBtYXRjaFszXTtcbiAgZXhwcmVzc2lvbnMucHVzaChtYWtlTGFtYmRhRnJvbVN0YXRlcyhmcm9tU3RhdGUsIHRvU3RhdGUpKTtcblxuICBjb25zdCBpc0Z1bGxBbnlTdGF0ZUV4cHIgPSBmcm9tU3RhdGUgPT0gQU5ZX1NUQVRFICYmIHRvU3RhdGUgPT0gQU5ZX1NUQVRFO1xuICBpZiAoc2VwYXJhdG9yWzBdID09ICc8JyAmJiAhaXNGdWxsQW55U3RhdGVFeHByKSB7XG4gICAgZXhwcmVzc2lvbnMucHVzaChtYWtlTGFtYmRhRnJvbVN0YXRlcyh0b1N0YXRlLCBmcm9tU3RhdGUpKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwYXJzZUFuaW1hdGlvbkFsaWFzKGFsaWFzOiBzdHJpbmcsIGVycm9yczogc3RyaW5nW10pOiBzdHJpbmd8VHJhbnNpdGlvbk1hdGNoZXJGbiB7XG4gIHN3aXRjaCAoYWxpYXMpIHtcbiAgICBjYXNlICc6ZW50ZXInOlxuICAgICAgcmV0dXJuICd2b2lkID0+IConO1xuICAgIGNhc2UgJzpsZWF2ZSc6XG4gICAgICByZXR1cm4gJyogPT4gdm9pZCc7XG4gICAgY2FzZSAnOmluY3JlbWVudCc6XG4gICAgICByZXR1cm4gKGZyb21TdGF0ZTogYW55LCB0b1N0YXRlOiBhbnkpOiBib29sZWFuID0+IHBhcnNlRmxvYXQodG9TdGF0ZSkgPiBwYXJzZUZsb2F0KGZyb21TdGF0ZSk7XG4gICAgY2FzZSAnOmRlY3JlbWVudCc6XG4gICAgICByZXR1cm4gKGZyb21TdGF0ZTogYW55LCB0b1N0YXRlOiBhbnkpOiBib29sZWFuID0+IHBhcnNlRmxvYXQodG9TdGF0ZSkgPCBwYXJzZUZsb2F0KGZyb21TdGF0ZSk7XG4gICAgZGVmYXVsdDpcbiAgICAgIGVycm9ycy5wdXNoKGBUaGUgdHJhbnNpdGlvbiBhbGlhcyB2YWx1ZSBcIiR7YWxpYXN9XCIgaXMgbm90IHN1cHBvcnRlZGApO1xuICAgICAgcmV0dXJuICcqID0+IConO1xuICB9XG59XG5cbi8vIERPIE5PVCBSRUZBQ1RPUiAuLi4ga2VlcCB0aGUgZm9sbG93IHNldCBpbnN0YW50aWF0aW9uc1xuLy8gd2l0aCB0aGUgdmFsdWVzIGludGFjdCAoY2xvc3VyZSBjb21waWxlciBmb3Igc29tZSByZWFzb25cbi8vIHJlbW92ZXMgZm9sbG93LXVwIGxpbmVzIHRoYXQgYWRkIHRoZSB2YWx1ZXMgb3V0c2lkZSBvZlxuLy8gdGhlIGNvbnN0cnVjdG9yLi4uXG5jb25zdCBUUlVFX0JPT0xFQU5fVkFMVUVTID0gbmV3IFNldDxzdHJpbmc+KFsndHJ1ZScsICcxJ10pO1xuY29uc3QgRkFMU0VfQk9PTEVBTl9WQUxVRVMgPSBuZXcgU2V0PHN0cmluZz4oWydmYWxzZScsICcwJ10pO1xuXG5mdW5jdGlvbiBtYWtlTGFtYmRhRnJvbVN0YXRlcyhsaHM6IHN0cmluZywgcmhzOiBzdHJpbmcpOiBUcmFuc2l0aW9uTWF0Y2hlckZuIHtcbiAgY29uc3QgTEhTX01BVENIX0JPT0xFQU4gPSBUUlVFX0JPT0xFQU5fVkFMVUVTLmhhcyhsaHMpIHx8IEZBTFNFX0JPT0xFQU5fVkFMVUVTLmhhcyhsaHMpO1xuICBjb25zdCBSSFNfTUFUQ0hfQk9PTEVBTiA9IFRSVUVfQk9PTEVBTl9WQUxVRVMuaGFzKHJocykgfHwgRkFMU0VfQk9PTEVBTl9WQUxVRVMuaGFzKHJocyk7XG5cbiAgcmV0dXJuIChmcm9tU3RhdGU6IGFueSwgdG9TdGF0ZTogYW55KTogYm9vbGVhbiA9PiB7XG4gICAgbGV0IGxoc01hdGNoID0gbGhzID09IEFOWV9TVEFURSB8fCBsaHMgPT0gZnJvbVN0YXRlO1xuICAgIGxldCByaHNNYXRjaCA9IHJocyA9PSBBTllfU1RBVEUgfHwgcmhzID09IHRvU3RhdGU7XG5cbiAgICBpZiAoIWxoc01hdGNoICYmIExIU19NQVRDSF9CT09MRUFOICYmIHR5cGVvZiBmcm9tU3RhdGUgPT09ICdib29sZWFuJykge1xuICAgICAgbGhzTWF0Y2ggPSBmcm9tU3RhdGUgPyBUUlVFX0JPT0xFQU5fVkFMVUVTLmhhcyhsaHMpIDogRkFMU0VfQk9PTEVBTl9WQUxVRVMuaGFzKGxocyk7XG4gICAgfVxuICAgIGlmICghcmhzTWF0Y2ggJiYgUkhTX01BVENIX0JPT0xFQU4gJiYgdHlwZW9mIHRvU3RhdGUgPT09ICdib29sZWFuJykge1xuICAgICAgcmhzTWF0Y2ggPSB0b1N0YXRlID8gVFJVRV9CT09MRUFOX1ZBTFVFUy5oYXMocmhzKSA6IEZBTFNFX0JPT0xFQU5fVkFMVUVTLmhhcyhyaHMpO1xuICAgIH1cblxuICAgIHJldHVybiBsaHNNYXRjaCAmJiByaHNNYXRjaDtcbiAgfTtcbn1cbiJdfQ==