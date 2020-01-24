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
 * @param definition
 *
 * @codeGenApi
 */
export function ɵɵProvidersFeature(providers, viewProviders) {
    if (viewProviders === void 0) { viewProviders = []; }
    return function (definition) {
        definition.providersResolver =
            function (def, processProvidersFn) {
                return providersResolver(def, //
                processProvidersFn ? processProvidersFn(providers) : providers, //
                viewProviders);
            };
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdmlkZXJzX2ZlYXR1cmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9yZW5kZXIzL2ZlYXR1cmVzL3Byb3ZpZGVyc19mZWF0dXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVFBLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUc5Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E2Qkc7QUFDSCxNQUFNLFVBQVUsa0JBQWtCLENBQUksU0FBcUIsRUFBRSxhQUE4QjtJQUE5Qiw4QkFBQSxFQUFBLGtCQUE4QjtJQUN6RixPQUFPLFVBQUMsVUFBMkI7UUFDakMsVUFBVSxDQUFDLGlCQUFpQjtZQUN4QixVQUFDLEdBQW9CLEVBQUUsa0JBQTZDO2dCQUNsRSxPQUFPLGlCQUFpQixDQUNwQixHQUFHLEVBQThELEVBQUU7Z0JBQ25FLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFHLEVBQUU7Z0JBQ25FLGFBQWEsQ0FBQyxDQUFDO1lBQ3JCLENBQUMsQ0FBQztJQUNSLENBQUMsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge1Byb2Nlc3NQcm92aWRlcnNGdW5jdGlvbiwgUHJvdmlkZXJ9IGZyb20gJy4uLy4uL2RpL2ludGVyZmFjZS9wcm92aWRlcic7XG5pbXBvcnQge3Byb3ZpZGVyc1Jlc29sdmVyfSBmcm9tICcuLi9kaV9zZXR1cCc7XG5pbXBvcnQge0RpcmVjdGl2ZURlZn0gZnJvbSAnLi4vaW50ZXJmYWNlcy9kZWZpbml0aW9uJztcblxuLyoqXG4gKiBUaGlzIGZlYXR1cmUgcmVzb2x2ZXMgdGhlIHByb3ZpZGVycyBvZiBhIGRpcmVjdGl2ZSAob3IgY29tcG9uZW50KSxcbiAqIGFuZCBwdWJsaXNoIHRoZW0gaW50byB0aGUgREkgc3lzdGVtLCBtYWtpbmcgaXQgdmlzaWJsZSB0byBvdGhlcnMgZm9yIGluamVjdGlvbi5cbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqIGNsYXNzIENvbXBvbmVudFdpdGhQcm92aWRlcnMge1xuICogICBjb25zdHJ1Y3Rvcihwcml2YXRlIGdyZWV0ZXI6IEdyZWV0ZXJERSkge31cbiAqXG4gKiAgIHN0YXRpYyBuZ0NvbXBvbmVudERlZiA9IGRlZmluZUNvbXBvbmVudCh7XG4gKiAgICAgdHlwZTogQ29tcG9uZW50V2l0aFByb3ZpZGVycyxcbiAqICAgICBzZWxlY3RvcnM6IFtbJ2NvbXBvbmVudC13aXRoLXByb3ZpZGVycyddXSxcbiAqICAgIGZhY3Rvcnk6ICgpID0+IG5ldyBDb21wb25lbnRXaXRoUHJvdmlkZXJzKGRpcmVjdGl2ZUluamVjdChHcmVldGVyREUgYXMgYW55KSksXG4gKiAgICBjb25zdHM6IDEsXG4gKiAgICB2YXJzOiAxLFxuICogICAgdGVtcGxhdGU6IGZ1bmN0aW9uKGZzOiBSZW5kZXJGbGFncywgY3R4OiBDb21wb25lbnRXaXRoUHJvdmlkZXJzKSB7XG4gKiAgICAgIGlmIChmcyAmIFJlbmRlckZsYWdzLkNyZWF0ZSkge1xuICogICAgICAgIHRleHQoMCk7XG4gKiAgICAgIH1cbiAqICAgICAgaWYgKGZzICYgUmVuZGVyRmxhZ3MuVXBkYXRlKSB7XG4gKiAgICAgICAgdGV4dEJpbmRpbmcoMCwgYmluZChjdHguZ3JlZXRlci5ncmVldCgpKSk7XG4gKiAgICAgIH1cbiAqICAgIH0sXG4gKiAgICBmZWF0dXJlczogW1Byb3ZpZGVyc0ZlYXR1cmUoW0dyZWV0ZXJERV0pXVxuICogIH0pO1xuICogfVxuICpcbiAqIEBwYXJhbSBkZWZpbml0aW9uXG4gKlxuICogQGNvZGVHZW5BcGlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIMm1ybVQcm92aWRlcnNGZWF0dXJlPFQ+KHByb3ZpZGVyczogUHJvdmlkZXJbXSwgdmlld1Byb3ZpZGVyczogUHJvdmlkZXJbXSA9IFtdKSB7XG4gIHJldHVybiAoZGVmaW5pdGlvbjogRGlyZWN0aXZlRGVmPFQ+KSA9PiB7XG4gICAgZGVmaW5pdGlvbi5wcm92aWRlcnNSZXNvbHZlciA9XG4gICAgICAgIChkZWY6IERpcmVjdGl2ZURlZjxUPiwgcHJvY2Vzc1Byb3ZpZGVyc0ZuPzogUHJvY2Vzc1Byb3ZpZGVyc0Z1bmN0aW9uKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHByb3ZpZGVyc1Jlc29sdmVyKFxuICAgICAgICAgICAgICBkZWYsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgIHByb2Nlc3NQcm92aWRlcnNGbiA/IHByb2Nlc3NQcm92aWRlcnNGbihwcm92aWRlcnMpIDogcHJvdmlkZXJzLCAgLy9cbiAgICAgICAgICAgICAgdmlld1Byb3ZpZGVycyk7XG4gICAgICAgIH07XG4gIH07XG59XG4iXX0=