/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { providersResolver } from '../di_setup';
/**
 * This feature resolves the providers of a directive (or component),
 * and publish them into the DI system, making it visible to others for injection.
 *
 * For example:
 * class ComponentWithProviders {
 *   constructor(private greeter: GreeterDE) {}
 *
 *   static ngComponentDef = defineComponent({
 *     type: ComponentWithProviders,
 *     selectors: [['component-with-providers']],
 *    factory: () => new ComponentWithProviders(directiveInject(GreeterDE as any)),
 *    consts: 1,
 *    vars: 1,
 *    template: function(fs: RenderFlags, ctx: ComponentWithProviders) {
 *      if (fs & RenderFlags.Create) {
 *        text(0);
 *      }
 *      if (fs & RenderFlags.Update) {
 *        textBinding(0, bind(ctx.greeter.greet()));
 *      }
 *    },
 *    features: [ProvidersFeature([GreeterDE])]
 *  });
 * }
 *
 * \@codeGenApi
 * @template T
 * @param {?} providers
 * @param {?=} viewProviders
 * @return {?}
 */
export function ɵɵProvidersFeature(providers, viewProviders = []) {
    return (/**
     * @param {?} definition
     * @return {?}
     */
    (definition) => {
        definition.providersResolver =
            (/**
             * @param {?} def
             * @param {?=} processProvidersFn
             * @return {?}
             */
            (def, processProvidersFn) => {
                return providersResolver(def, //
                processProvidersFn ? processProvidersFn(providers) : providers, //
                viewProviders);
            });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdmlkZXJzX2ZlYXR1cmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9yZW5kZXIzL2ZlYXR1cmVzL3Byb3ZpZGVyc19mZWF0dXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFRQSxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxhQUFhLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlDOUMsTUFBTSxVQUFVLGtCQUFrQixDQUFJLFNBQXFCLEVBQUUsZ0JBQTRCLEVBQUU7SUFDekY7Ozs7SUFBTyxDQUFDLFVBQTJCLEVBQUUsRUFBRTtRQUNyQyxVQUFVLENBQUMsaUJBQWlCOzs7Ozs7WUFDeEIsQ0FBQyxHQUFvQixFQUFFLGtCQUE2QyxFQUFFLEVBQUU7Z0JBQ3RFLE9BQU8saUJBQWlCLENBQ3BCLEdBQUcsRUFBOEQsRUFBRTtnQkFDbkUsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUcsRUFBRTtnQkFDbkUsYUFBYSxDQUFDLENBQUM7WUFDckIsQ0FBQyxDQUFBLENBQUM7SUFDUixDQUFDLEVBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtQcm9jZXNzUHJvdmlkZXJzRnVuY3Rpb24sIFByb3ZpZGVyfSBmcm9tICcuLi8uLi9kaS9pbnRlcmZhY2UvcHJvdmlkZXInO1xuaW1wb3J0IHtwcm92aWRlcnNSZXNvbHZlcn0gZnJvbSAnLi4vZGlfc2V0dXAnO1xuaW1wb3J0IHtEaXJlY3RpdmVEZWZ9IGZyb20gJy4uL2ludGVyZmFjZXMvZGVmaW5pdGlvbic7XG5cbi8qKlxuICogVGhpcyBmZWF0dXJlIHJlc29sdmVzIHRoZSBwcm92aWRlcnMgb2YgYSBkaXJlY3RpdmUgKG9yIGNvbXBvbmVudCksXG4gKiBhbmQgcHVibGlzaCB0aGVtIGludG8gdGhlIERJIHN5c3RlbSwgbWFraW5nIGl0IHZpc2libGUgdG8gb3RoZXJzIGZvciBpbmplY3Rpb24uXG4gKlxuICogRm9yIGV4YW1wbGU6XG4gKiBjbGFzcyBDb21wb25lbnRXaXRoUHJvdmlkZXJzIHtcbiAqICAgY29uc3RydWN0b3IocHJpdmF0ZSBncmVldGVyOiBHcmVldGVyREUpIHt9XG4gKlxuICogICBzdGF0aWMgbmdDb21wb25lbnREZWYgPSBkZWZpbmVDb21wb25lbnQoe1xuICogICAgIHR5cGU6IENvbXBvbmVudFdpdGhQcm92aWRlcnMsXG4gKiAgICAgc2VsZWN0b3JzOiBbWydjb21wb25lbnQtd2l0aC1wcm92aWRlcnMnXV0sXG4gKiAgICBmYWN0b3J5OiAoKSA9PiBuZXcgQ29tcG9uZW50V2l0aFByb3ZpZGVycyhkaXJlY3RpdmVJbmplY3QoR3JlZXRlckRFIGFzIGFueSkpLFxuICogICAgY29uc3RzOiAxLFxuICogICAgdmFyczogMSxcbiAqICAgIHRlbXBsYXRlOiBmdW5jdGlvbihmczogUmVuZGVyRmxhZ3MsIGN0eDogQ29tcG9uZW50V2l0aFByb3ZpZGVycykge1xuICogICAgICBpZiAoZnMgJiBSZW5kZXJGbGFncy5DcmVhdGUpIHtcbiAqICAgICAgICB0ZXh0KDApO1xuICogICAgICB9XG4gKiAgICAgIGlmIChmcyAmIFJlbmRlckZsYWdzLlVwZGF0ZSkge1xuICogICAgICAgIHRleHRCaW5kaW5nKDAsIGJpbmQoY3R4LmdyZWV0ZXIuZ3JlZXQoKSkpO1xuICogICAgICB9XG4gKiAgICB9LFxuICogICAgZmVhdHVyZXM6IFtQcm92aWRlcnNGZWF0dXJlKFtHcmVldGVyREVdKV1cbiAqICB9KTtcbiAqIH1cbiAqXG4gKiBAcGFyYW0gZGVmaW5pdGlvblxuICpcbiAqIEBjb2RlR2VuQXBpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiDJtcm1UHJvdmlkZXJzRmVhdHVyZTxUPihwcm92aWRlcnM6IFByb3ZpZGVyW10sIHZpZXdQcm92aWRlcnM6IFByb3ZpZGVyW10gPSBbXSkge1xuICByZXR1cm4gKGRlZmluaXRpb246IERpcmVjdGl2ZURlZjxUPikgPT4ge1xuICAgIGRlZmluaXRpb24ucHJvdmlkZXJzUmVzb2x2ZXIgPVxuICAgICAgICAoZGVmOiBEaXJlY3RpdmVEZWY8VD4sIHByb2Nlc3NQcm92aWRlcnNGbj86IFByb2Nlc3NQcm92aWRlcnNGdW5jdGlvbikgPT4ge1xuICAgICAgICAgIHJldHVybiBwcm92aWRlcnNSZXNvbHZlcihcbiAgICAgICAgICAgICAgZGVmLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICBwcm9jZXNzUHJvdmlkZXJzRm4gPyBwcm9jZXNzUHJvdmlkZXJzRm4ocHJvdmlkZXJzKSA6IHByb3ZpZGVycywgIC8vXG4gICAgICAgICAgICAgIHZpZXdQcm92aWRlcnMpO1xuICAgICAgICB9O1xuICB9O1xufVxuIl19