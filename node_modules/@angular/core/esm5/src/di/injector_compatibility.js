/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { stringify } from '../util/stringify';
import { getInjectableDef } from './interface/defs';
import { InjectFlags } from './interface/injector';
import { Inject, Optional, Self, SkipSelf } from './metadata';
/**
 * Current injector value used by `inject`.
 * - `undefined`: it is an error to call `inject`
 * - `null`: `inject` can be called but there is no injector (limp-mode).
 * - Injector instance: Use the injector for resolution.
 */
var _currentInjector = undefined;
export function setCurrentInjector(injector) {
    var former = _currentInjector;
    _currentInjector = injector;
    return former;
}
/**
 * Current implementation of inject.
 *
 * By default, it is `injectInjectorOnly`, which makes it `Injector`-only aware. It can be changed
 * to `directiveInject`, which brings in the `NodeInjector` system of ivy. It is designed this
 * way for two reasons:
 *  1. `Injector` should not depend on ivy logic.
 *  2. To maintain tree shake-ability we don't want to bring in unnecessary code.
 */
var _injectImplementation;
/**
 * Sets the current inject implementation.
 */
export function setInjectImplementation(impl) {
    var previous = _injectImplementation;
    _injectImplementation = impl;
    return previous;
}
export function injectInjectorOnly(token, flags) {
    if (flags === void 0) { flags = InjectFlags.Default; }
    if (_currentInjector === undefined) {
        throw new Error("inject() must be called from an injection context");
    }
    else if (_currentInjector === null) {
        return injectRootLimpMode(token, undefined, flags);
    }
    else {
        return _currentInjector.get(token, flags & InjectFlags.Optional ? null : undefined, flags);
    }
}
export function ɵɵinject(token, flags) {
    if (flags === void 0) { flags = InjectFlags.Default; }
    return (_injectImplementation || injectInjectorOnly)(token, flags);
}
/**
 * Injects a token from the currently active injector.
 *
 * Must be used in the context of a factory function such as one defined for an
 * `InjectionToken`. Throws an error if not called from such a context.
 *
 * Within such a factory function, using this function to request injection of a dependency
 * is faster and more type-safe than providing an additional array of dependencies
 * (as has been common with `useFactory` providers).
 *
 * @param token The injection token for the dependency to be injected.
 * @param flags Optional flags that control how injection is executed.
 * The flags correspond to injection strategies that can be specified with
 * parameter decorators `@Host`, `@Self`, `@SkipSef`, and `@Optional`.
 * @returns True if injection is successful, null otherwise.
 *
 * @usageNotes
 *
 * ### Example
 *
 * {@example core/di/ts/injector_spec.ts region='ShakableInjectionToken'}
 *
 * @publicApi
 */
export var inject = ɵɵinject;
/**
 * Injects `root` tokens in limp mode.
 *
 * If no injector exists, we can still inject tree-shakable providers which have `providedIn` set to
 * `"root"`. This is known as the limp mode injection. In such case the value is stored in the
 * `InjectableDef`.
 */
export function injectRootLimpMode(token, notFoundValue, flags) {
    var injectableDef = getInjectableDef(token);
    if (injectableDef && injectableDef.providedIn == 'root') {
        return injectableDef.value === undefined ? injectableDef.value = injectableDef.factory() :
            injectableDef.value;
    }
    if (flags & InjectFlags.Optional)
        return null;
    if (notFoundValue !== undefined)
        return notFoundValue;
    throw new Error("Injector: NOT_FOUND [" + stringify(token) + "]");
}
export function injectArgs(types) {
    var args = [];
    for (var i = 0; i < types.length; i++) {
        var arg = types[i];
        if (Array.isArray(arg)) {
            if (arg.length === 0) {
                throw new Error('Arguments array must have arguments.');
            }
            var type = undefined;
            var flags = InjectFlags.Default;
            for (var j = 0; j < arg.length; j++) {
                var meta = arg[j];
                if (meta instanceof Optional || meta.ngMetadataName === 'Optional') {
                    flags |= InjectFlags.Optional;
                }
                else if (meta instanceof SkipSelf || meta.ngMetadataName === 'SkipSelf') {
                    flags |= InjectFlags.SkipSelf;
                }
                else if (meta instanceof Self || meta.ngMetadataName === 'Self') {
                    flags |= InjectFlags.Self;
                }
                else if (meta instanceof Inject) {
                    type = meta.token;
                }
                else {
                    type = meta;
                }
            }
            args.push(ɵɵinject(type, flags));
        }
        else {
            args.push(ɵɵinject(arg));
        }
    }
    return args;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5qZWN0b3JfY29tcGF0aWJpbGl0eS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL2RpL2luamVjdG9yX2NvbXBhdGliaWxpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBR0gsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBSTVDLE9BQU8sRUFBQyxnQkFBZ0IsRUFBa0IsTUFBTSxrQkFBa0IsQ0FBQztBQUNuRSxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDakQsT0FBTyxFQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUk1RDs7Ozs7R0FLRztBQUNILElBQUksZ0JBQWdCLEdBQTRCLFNBQVMsQ0FBQztBQUUxRCxNQUFNLFVBQVUsa0JBQWtCLENBQUMsUUFBcUM7SUFDdEUsSUFBTSxNQUFNLEdBQUcsZ0JBQWdCLENBQUM7SUFDaEMsZ0JBQWdCLEdBQUcsUUFBUSxDQUFDO0lBQzVCLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFFRDs7Ozs7Ozs7R0FRRztBQUNILElBQUkscUJBQ1MsQ0FBQztBQUVkOztHQUVHO0FBQ0gsTUFBTSxVQUFVLHVCQUF1QixDQUNuQyxJQUEyRjtJQUU3RixJQUFNLFFBQVEsR0FBRyxxQkFBcUIsQ0FBQztJQUN2QyxxQkFBcUIsR0FBRyxJQUFJLENBQUM7SUFDN0IsT0FBTyxRQUFRLENBQUM7QUFDbEIsQ0FBQztBQUtELE1BQU0sVUFBVSxrQkFBa0IsQ0FDOUIsS0FBaUMsRUFBRSxLQUEyQjtJQUEzQixzQkFBQSxFQUFBLFFBQVEsV0FBVyxDQUFDLE9BQU87SUFDaEUsSUFBSSxnQkFBZ0IsS0FBSyxTQUFTLEVBQUU7UUFDbEMsTUFBTSxJQUFJLEtBQUssQ0FBQyxtREFBbUQsQ0FBQyxD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QUksQ0FBQztpQkFDM0I7cUJBQU0sSUFBSSxJQUFJLFlBQVksTUFBTSxFQUFFO29CQUNqQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztpQkFDbkI7cUJBQU07b0JBQ0wsSUFBSSxHQUFHLElBQUksQ0FBQztpQkFDYjthQUNGO1lBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDcEM7YUFBTTtZQUNMLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDMUI7S0FDRjtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtUeXBlfSBmcm9tICcuLi9pbnRlcmZhY2UvdHlwZSc7XG5pbXBvcnQge3N0cmluZ2lmeX0gZnJvbSAnLi4vdXRpbC9zdHJpbmdpZnknO1xuXG5pbXBvcnQge0luamVjdGlvblRva2VufSBmcm9tICcuL2luamVjdGlvbl90b2tlbic7XG5pbXBvcnQge0luamVjdG9yfSBmcm9tICcuL2luamVjdG9yJztcbmltcG9ydCB7Z2V0SW5qZWN0YWJsZURlZiwgybXJtUluamVjdGFibGVEZWZ9IGZyb20gJy4vaW50ZXJmYWNlL2RlZnMnO1xuaW1wb3J0IHtJbmplY3RGbGFnc30gZnJvbSAnLi9pbnRlcmZhY2UvaW5qZWN0b3InO1xuaW1wb3J0IHtJbmplY3QsIE9wdGlvbmFsLCBTZWxmLCBTa2lwU2VsZn0gZnJvbSAnLi9tZXRhZGF0YSc7XG5cblxuXG4vKipcbiAqIEN1cnJlbnQgaW5qZWN0b3IgdmFsdWUgdXNlZCBieSBgaW5qZWN0YC5cbiAqIC0gYHVuZGVmaW5lZGA6IGl0IGlzIGFuIGVycm9yIHRvIGNhbGwgYGluamVjdGBcbiAqIC0gYG51bGxgOiBgaW5qZWN0YCBjYW4gYmUgY2FsbGVkIGJ1dCB0aGVyZSBpcyBubyBpbmplY3RvciAobGltcC1tb2RlKS5cbiAqIC0gSW5qZWN0b3IgaW5zdGFuY2U6IFVzZSB0aGUgaW5qZWN0b3IgZm9yIHJlc29sdXRpb24uXG4gKi9cbmxldCBfY3VycmVudEluamVjdG9yOiBJbmplY3Rvcnx1bmRlZmluZWR8bnVsbCA9IHVuZGVmaW5lZDtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldEN1cnJlbnRJbmplY3RvcihpbmplY3RvcjogSW5qZWN0b3IgfCBudWxsIHwgdW5kZWZpbmVkKTogSW5qZWN0b3J8dW5kZWZpbmVkfG51bGwge1xuICBjb25zdCBmb3JtZXIgPSBfY3VycmVudEluamVjdG9yO1xuICBfY3VycmVudEluamVjdG9yID0gaW5qZWN0b3I7XG4gIHJldHVybiBmb3JtZXI7XG59XG5cbi8qKlxuICogQ3VycmVudCBpbXBsZW1lbnRhdGlvbiBvZiBpbmplY3QuXG4gKlxuICogQnkgZGVmYXVsdCwgaXQgaXMgYGluamVjdEluamVjdG9yT25seWAsIHdoaWNoIG1ha2VzIGl0IGBJbmplY3RvcmAtb25seSBhd2FyZS4gSXQgY2FuIGJlIGNoYW5nZWRcbiAqIHRvIGBkaXJlY3RpdmVJbmplY3RgLCB3aGljaCBicmluZ3MgaW4gdGhlIGBOb2RlSW5qZWN0b3JgIHN5c3RlbSBvZiBpdnkuIEl0IGlzIGRlc2lnbmVkIHRoaXNcbiAqIHdheSBmb3IgdHdvIHJlYXNvbnM6XG4gKiAgMS4gYEluamVjdG9yYCBzaG91bGQgbm90IGRlcGVuZCBvbiBpdnkgbG9naWMuXG4gKiAgMi4gVG8gbWFpbnRhaW4gdHJlZSBzaGFrZS1hYmlsaXR5IHdlIGRvbid0IHdhbnQgdG8gYnJpbmcgaW4gdW5uZWNlc3NhcnkgY29kZS5cbiAqL1xubGV0IF9pbmplY3RJbXBsZW1lbnRhdGlvbjogKDxUPih0b2tlbjogVHlwZTxUPnwgSW5qZWN0aW9uVG9rZW48VD4sIGZsYWdzOiBJbmplY3RGbGFncykgPT4gVCB8IG51bGwpfFxuICAgIHVuZGVmaW5lZDtcblxuLyoqXG4gKiBTZXRzIHRoZSBjdXJyZW50IGluamVjdCBpbXBsZW1lbnRhdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldEluamVjdEltcGxlbWVudGF0aW9uKFxuICAgIGltcGw6ICg8VD4odG9rZW46IFR5cGU8VD58IEluamVjdGlvblRva2VuPFQ+LCBmbGFncz86IEluamVjdEZsYWdzKSA9PiBUIHwgbnVsbCkgfCB1bmRlZmluZWQpOlxuICAgICg8VD4odG9rZW46IFR5cGU8VD58IEluamVjdGlvblRva2VuPFQ+LCBmbGFncz86IEluamVjdEZsYWdzKSA9PiBUIHwgbnVsbCl8dW5kZWZpbmVkIHtcbiAgY29uc3QgcHJldmlvdXMgPSBfaW5qZWN0SW1wbGVtZW50YXRpb247XG4gIF9pbmplY3RJbXBsZW1lbnRhdGlvbiA9IGltcGw7XG4gIHJldHVybiBwcmV2aW91cztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluamVjdEluamVjdG9yT25seTxUPih0b2tlbjogVHlwZTxUPnwgSW5qZWN0aW9uVG9rZW48VD4pOiBUO1xuZXhwb3J0IGZ1bmN0aW9uIGluamVjdEluamVjdG9yT25seTxUPih0b2tlbjogVHlwZTxUPnwgSW5qZWN0aW9uVG9rZW48VD4sIGZsYWdzPzogSW5qZWN0RmxhZ3MpOiBUfFxuICAgIG51bGw7XG5leHBvcnQgZnVuY3Rpb24gaW5qZWN0SW5qZWN0b3JPbmx5PFQ+KFxuICAgIHRva2VuOiBUeXBlPFQ+fCBJbmplY3Rpb25Ub2tlbjxUPiwgZmxhZ3MgPSBJbmplY3RGbGFncy5EZWZhdWx0KTogVHxudWxsIHtcbiAgaWYgKF9jdXJyZW50SW5qZWN0b3IgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgaW5qZWN0KCkgbXVzdCBiZSBjYWxsZWQgZnJvbSBhbiBpbmplY3Rpb24gY29udGV4dGApO1xuICB9IGVsc2UgaWYgKF9jdXJyZW50SW5qZWN0b3IgPT09IG51bGwpIHtcbiAgICByZXR1cm4gaW5qZWN0Um9vdExpbXBNb2RlKHRva2VuLCB1bmRlZmluZWQsIGZsYWdzKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gX2N1cnJlbnRJbmplY3Rvci5nZXQodG9rZW4sIGZsYWdzICYgSW5qZWN0RmxhZ3MuT3B0aW9uYWwgPyBudWxsIDogdW5kZWZpbmVkLCBmbGFncyk7XG4gIH1cbn1cblxuLyoqXG4gKiBHZW5lcmF0ZWQgaW5zdHJ1Y3Rpb246IEluamVjdHMgYSB0b2tlbiBmcm9tIHRoZSBjdXJyZW50bHkgYWN0aXZlIGluamVjdG9yLlxuICpcbiAqIE11c3QgYmUgdXNlZCBpbiB0aGUgY29udGV4dCBvZiBhIGZhY3RvcnkgZnVuY3Rpb24gc3VjaCBhcyBvbmUgZGVmaW5lZCBmb3IgYW5cbiAqIGBJbmplY3Rpb25Ub2tlbmAuIFRocm93cyBhbiBlcnJvciBpZiBub3QgY2FsbGVkIGZyb20gc3VjaCBhIGNvbnRleHQuXG4gKlxuICogKEFkZGl0aW9uYWwgZG9jdW1lbnRhdGlvbiBtb3ZlZCB0byBgaW5qZWN0YCwgYXMgaXQgaXMgdGhlIHB1YmxpYyBBUEksIGFuZCBhbiBhbGlhcyBmb3IgdGhpcyBpbnN0cnVjdGlvbilcbiAqXG4gKiBAc2VlIGluamVjdFxuICogQGNvZGVHZW5BcGlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIMm1ybVpbmplY3Q8VD4odG9rZW46IFR5cGU8VD58IEluamVjdGlvblRva2VuPFQ+KTogVDtcbmV4cG9ydCBmdW5jdGlvbiDJtcm1aW5qZWN0PFQ+KHRva2VuOiBUeXBlPFQ+fCBJbmplY3Rpb25Ub2tlbjxUPiwgZmxhZ3M/OiBJbmplY3RGbGFncyk6IFR8bnVsbDtcbmV4cG9ydCBmdW5jdGlvbiDJtcm1aW5qZWN0PFQ+KHRva2VuOiBUeXBlPFQ+fCBJbmplY3Rpb25Ub2tlbjxUPiwgZmxhZ3MgPSBJbmplY3RGbGFncy5EZWZhdWx0KTogVHxcbiAgICBudWxsIHtcbiAgcmV0dXJuIChfaW5qZWN0SW1wbGVtZW50YXRpb24gfHwgaW5qZWN0SW5qZWN0b3JPbmx5KSh0b2tlbiwgZmxhZ3MpO1xufVxuXG4vKipcbiAqIEluamVjdHMgYSB0b2tlbiBmcm9tIHRoZSBjdXJyZW50bHkgYWN0aXZlIGluamVjdG9yLlxuICpcbiAqIE11c3QgYmUgdXNlZCBpbiB0aGUgY29udGV4dCBvZiBhIGZhY3RvcnkgZnVuY3Rpb24gc3VjaCBhcyBvbmUgZGVmaW5lZCBmb3IgYW5cbiAqIGBJbmplY3Rpb25Ub2tlbmAuIFRocm93cyBhbiBlcnJvciBpZiBub3QgY2FsbGVkIGZyb20gc3VjaCBhIGNvbnRleHQuXG4gKlxuICogV2l0aGluIHN1Y2ggYSBmYWN0b3J5IGZ1bmN0aW9uLCB1c2luZyB0aGlzIGZ1bmN0aW9uIHRvIHJlcXVlc3QgaW5qZWN0aW9uIG9mIGEgZGVwZW5kZW5jeVxuICogaXMgZmFzdGVyIGFuZCBtb3JlIHR5cGUtc2FmZSB0aGFuIHByb3ZpZGluZyBhbiBhZGRpdGlvbmFsIGFycmF5IG9mIGRlcGVuZGVuY2llc1xuICogKGFzIGhhcyBiZWVuIGNvbW1vbiB3aXRoIGB1c2VGYWN0b3J5YCBwcm92aWRlcnMpLlxuICpcbiAqIEBwYXJhbSB0b2tlbiBUaGUgaW5qZWN0aW9uIHRva2VuIGZvciB0aGUgZGVwZW5kZW5jeSB0byBiZSBpbmplY3RlZC5cbiAqIEBwYXJhbSBmbGFncyBPcHRpb25hbCBmbGFncyB0aGF0IGNvbnRyb2wgaG93IGluamVjdGlvbiBpcyBleGVjdXRlZC5cbiAqIFRoZSBmbGFncyBjb3JyZXNwb25kIHRvIGluamVjdGlvbiBzdHJhdGVnaWVzIHRoYXQgY2FuIGJlIHNwZWNpZmllZCB3aXRoXG4gKiBwYXJhbWV0ZXIgZGVjb3JhdG9ycyBgQEhvc3RgLCBgQFNlbGZgLCBgQFNraXBTZWZgLCBhbmQgYEBPcHRpb25hbGAuXG4gKiBAcmV0dXJucyBUcnVlIGlmIGluamVjdGlvbiBpcyBzdWNjZXNzZnVsLCBudWxsIG90aGVyd2lzZS5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBFeGFtcGxlXG4gKlxuICoge0BleGFtcGxlIGNvcmUvZGkvdHMvaW5qZWN0b3Jfc3BlYy50cyByZWdpb249J1NoYWthYmxlSW5qZWN0aW9uVG9rZW4nfVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNvbnN0IGluamVjdCA9IMm1ybVpbmplY3Q7XG5cbi8qKlxuICogSW5qZWN0cyBgcm9vdGAgdG9rZW5zIGluIGxpbXAgbW9kZS5cbiAqXG4gKiBJZiBubyBpbmplY3RvciBleGlzdHMsIHdlIGNhbiBzdGlsbCBpbmplY3QgdHJlZS1zaGFrYWJsZSBwcm92aWRlcnMgd2hpY2ggaGF2ZSBgcHJvdmlkZWRJbmAgc2V0IHRvXG4gKiBgXCJyb290XCJgLiBUaGlzIGlzIGtub3duIGFzIHRoZSBsaW1wIG1vZGUgaW5qZWN0aW9uLiBJbiBzdWNoIGNhc2UgdGhlIHZhbHVlIGlzIHN0b3JlZCBpbiB0aGVcbiAqIGBJbmplY3RhYmxlRGVmYC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluamVjdFJvb3RMaW1wTW9kZTxUPihcbiAgICB0b2tlbjogVHlwZTxUPnwgSW5qZWN0aW9uVG9rZW48VD4sIG5vdEZvdW5kVmFsdWU6IFQgfCB1bmRlZmluZWQsIGZsYWdzOiBJbmplY3RGbGFncyk6IFR8bnVsbCB7XG4gIGNvbnN0IGluamVjdGFibGVEZWY6IMm1ybVJbmplY3RhYmxlRGVmPFQ+fG51bGwgPSBnZXRJbmplY3RhYmxlRGVmKHRva2VuKTtcbiAgaWYgKGluamVjdGFibGVEZWYgJiYgaW5qZWN0YWJsZURlZi5wcm92aWRlZEluID09ICdyb290Jykge1xuICAgIHJldHVybiBpbmplY3RhYmxlRGVmLnZhbHVlID09PSB1bmRlZmluZWQgPyBpbmplY3RhYmxlRGVmLnZhbHVlID0gaW5qZWN0YWJsZURlZi5mYWN0b3J5KCkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmplY3RhYmxlRGVmLnZhbHVlO1xuICB9XG4gIGlmIChmbGFncyAmIEluamVjdEZsYWdzLk9wdGlvbmFsKSByZXR1cm4gbnVsbDtcbiAgaWYgKG5vdEZvdW5kVmFsdWUgIT09IHVuZGVmaW5lZCkgcmV0dXJuIG5vdEZvdW5kVmFsdWU7XG4gIHRocm93IG5ldyBFcnJvcihgSW5qZWN0b3I6IE5PVF9GT1VORCBbJHtzdHJpbmdpZnkodG9rZW4pfV1gKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluamVjdEFyZ3ModHlwZXM6IChUeXBlPGFueT58IEluamVjdGlvblRva2VuPGFueT58IGFueVtdKVtdKTogYW55W10ge1xuICBjb25zdCBhcmdzOiBhbnlbXSA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHR5cGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgYXJnID0gdHlwZXNbaV07XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoYXJnKSkge1xuICAgICAgaWYgKGFyZy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBcmd1bWVudHMgYXJyYXkgbXVzdCBoYXZlIGFyZ3VtZW50cy4nKTtcbiAgICAgIH1cbiAgICAgIGxldCB0eXBlOiBUeXBlPGFueT58dW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICAgICAgbGV0IGZsYWdzOiBJbmplY3RGbGFncyA9IEluamVjdEZsYWdzLkRlZmF1bHQ7XG5cbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgYXJnLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGNvbnN0IG1ldGEgPSBhcmdbal07XG4gICAgICAgIGlmIChtZXRhIGluc3RhbmNlb2YgT3B0aW9uYWwgfHwgbWV0YS5uZ01ldGFkYXRhTmFtZSA9PT0gJ09wdGlvbmFsJykge1xuICAgICAgICAgIGZsYWdzIHw9IEluamVjdEZsYWdzLk9wdGlvbmFsO1xuICAgICAgICB9IGVsc2UgaWYgKG1ldGEgaW5zdGFuY2VvZiBTa2lwU2VsZiB8fCBtZXRhLm5nTWV0YWRhdGFOYW1lID09PSAnU2tpcFNlbGYnKSB7XG4gICAgICAgICAgZmxhZ3MgfD0gSW5qZWN0RmxhZ3MuU2tpcFNlbGY7XG4gICAgICAgIH0gZWxzZSBpZiAobWV0YSBpbnN0YW5jZW9mIFNlbGYgfHwgbWV0YS5uZ01ldGFkYXRhTmFtZSA9PT0gJ1NlbGYnKSB7XG4gICAgICAgICAgZmxhZ3MgfD0gSW5qZWN0RmxhZ3MuU2VsZjtcbiAgICAgICAgfSBlbHNlIGlmIChtZXRhIGluc3RhbmNlb2YgSW5qZWN0KSB7XG4gICAgICAgICAgdHlwZSA9IG1ldGEudG9rZW47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdHlwZSA9IG1ldGE7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgYXJncy5wdXNoKMm1ybVpbmplY3QodHlwZSAhLCBmbGFncykpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcmdzLnB1c2goybXJtWluamVjdChhcmcpKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGFyZ3M7XG59XG4iXX0=