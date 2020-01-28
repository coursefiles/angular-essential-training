/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken, NgModuleFactory } from '@angular/core';
import { from, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { LoadedRouterConfig, standardizeConfig } from './config';
import { flatten, wrapIntoObservable } from './utils/collection';
/**
 * @docsNotRequired
 * @publicApi
 */
export var ROUTES = new InjectionToken('ROUTES');
var RouterConfigLoader = /** @class */ (function () {
    function RouterConfigLoader(loader, compiler, onLoadStartListener, onLoadEndListener) {
        this.loader = loader;
        this.compiler = compiler;
        this.onLoadStartListener = onLoadStartListener;
        this.onLoadEndListener = onLoadEndListener;
    }
    RouterConfigLoader.prototype.load = function (parentInjector, route) {
        var _this = this;
        if (this.onLoadStartListener) {
            this.onLoadStartListener(route);
        }
        var moduleFactory$ = this.loadModuleFactory(route.loadChildren);
        return moduleFactory$.pipe(map(function (factory) {
            if (_this.onLoadEndListener) {
                _this.onLoadEndListener(route);
            }
            var module = factory.create(parentInjector);
            return new LoadedRouterConfig(flatten(module.injector.get(ROUTES)).map(standardizeConfig), module);
        }));
    };
    RouterConfigLoader.prototype.loadModuleFactory = function (loadChildren) {
        var _this = this;
        if (typeof loadChildren === 'string') {
            return from(this.loader.load(loadChildren));
        }
        else {
            return wrapIntoObservable(loadChildren()).pipe(mergeMap(function (t) {
                if (t instanceof NgModuleFactory) {
                    return of(t);
                }
                else {
                    return from(_this.compiler.compileModuleAsync(t));
                }
            }));
        }
    };
    return RouterConfigLoader;
}());
export { RouterConfigLoader };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX2NvbmZpZ19sb2FkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9yb3V0ZXIvc3JjL3JvdXRlcl9jb25maWdfbG9hZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBVyxjQUFjLEVBQVksZUFBZSxFQUF3QixNQUFNLGVBQWUsQ0FBQztBQUN6RyxPQUFPLEVBQWEsSUFBSSxFQUFFLEVBQUUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMzQyxPQUFPLEVBQUMsR0FBRyxFQUFFLFFBQVEsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBZSxrQkFBa0IsRUFBUyxpQkFBaUIsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUNwRixPQUFPLEVBQUMsT0FBTyxFQUFFLGtCQUFrQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFFL0Q7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLElBQU0sTUFBTSxHQUFHLElBQUksY0FBYyxDQUFZLFFBQVEsQ0FBQyxDQUFDO0FBRTlEO0lBQ0UsNEJBQ1ksTUFBNkIsRUFBVSxRQUFrQixFQUN6RCxtQkFBd0MsRUFDeEMsaUJBQXNDO1FBRnRDLFdBQU0sR0FBTixNQUFNLENBQXVCO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUN6RCx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQ3hDLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBcUI7SUFBRyxDQUFDO0lBRXRELGlDQUFJLEdBQUosVUFBSyxjQUF3QixFQUFFLEtBQVk7UUFBM0MsaUJBaUJDO1FBaEJDLElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFO1lBQzVCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNqQztRQUVELElBQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsWUFBYyxDQUFDLENBQUM7UUFFcEUsT0FBTyxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFDLE9BQTZCO1lBQzNELElBQUksS0FBSSxDQUFDLGlCQUFpQixFQUFFO2dCQUMxQixLQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDL0I7WUFFRCxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBRTlDLE9BQU8sSUFBSSxrQkFBa0IsQ0FDekIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDM0UsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNOLENBQUM7SUFFTyw4Q0FBaUIsR0FBekIsVUFBMEIsWUFBMEI7UUFBcEQsaUJBWUM7UUFYQyxJQUFJLE9BQU8sWUFBWSxLQUFLLFFBQVEsRUFBRTtZQUNwQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1NBQzdDO2FBQU07WUFDTCxPQUFPLGtCQUFrQixDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFDLENBQU07Z0JBQzdELElBQUksQ0FBQyxZQUFZLGVBQWUsRUFBRTtvQkFDaEMsT0FBTyxFQUFFLENBQUUsQ0FBQyxDQUFDLENBQUM7aUJBQ2Y7cUJBQU07b0JBQ0wsT0FBTyxJQUFJLENBQUMsS0FBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNsRDtZQUNILENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDTDtJQUNILENBQUM7SUFDSCx5QkFBQztBQUFELENBQUMsQUF0Q0QsSUFzQ0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tcGlsZXIsIEluamVjdGlvblRva2VuLCBJbmplY3RvciwgTmdNb2R1bGVGYWN0b3J5LCBOZ01vZHVsZUZhY3RvcnlMb2FkZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBmcm9tLCBvZiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHttYXAsIG1lcmdlTWFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge0xvYWRDaGlsZHJlbiwgTG9hZGVkUm91dGVyQ29uZmlnLCBSb3V0ZSwgc3RhbmRhcmRpemVDb25maWd9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7ZmxhdHRlbiwgd3JhcEludG9PYnNlcnZhYmxlfSBmcm9tICcuL3V0aWxzL2NvbGxlY3Rpb24nO1xuXG4vKipcbiAqIEBkb2NzTm90UmVxdWlyZWRcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNvbnN0IFJPVVRFUyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxSb3V0ZVtdW10+KCdST1VURVMnKTtcblxuZXhwb3J0IGNsYXNzIFJvdXRlckNvbmZpZ0xvYWRlciB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBsb2FkZXI6IE5nTW9kdWxlRmFjdG9yeUxvYWRlciwgcHJpdmF0ZSBjb21waWxlcjogQ29tcGlsZXIsXG4gICAgICBwcml2YXRlIG9uTG9hZFN0YXJ0TGlzdGVuZXI/OiAocjogUm91dGUpID0+IHZvaWQsXG4gICAgICBwcml2YXRlIG9uTG9hZEVuZExpc3RlbmVyPzogKHI6IFJvdXRlKSA9PiB2b2lkKSB7fVxuXG4gIGxvYWQocGFyZW50SW5qZWN0b3I6IEluamVjdG9yLCByb3V0ZTogUm91dGUpOiBPYnNlcnZhYmxlPExvYWRlZFJvdXRlckNvbmZpZz4ge1xuICAgIGlmICh0aGlzLm9uTG9hZFN0YXJ0TGlzdGVuZXIpIHtcbiAgICAgIHRoaXMub25Mb2FkU3RhcnRMaXN0ZW5lcihyb3V0ZSk7XG4gICAgfVxuXG4gICAgY29uc3QgbW9kdWxlRmFjdG9yeSQgPSB0aGlzLmxvYWRNb2R1bGVGYWN0b3J5KHJvdXRlLmxvYWRDaGlsZHJlbiAhKTtcblxuICAgIHJldHVybiBtb2R1bGVGYWN0b3J5JC5waXBlKG1hcCgoZmFjdG9yeTogTmdNb2R1bGVGYWN0b3J5PGFueT4pID0+IHtcbiAgICAgIGlmICh0aGlzLm9uTG9hZEVuZExpc3RlbmVyKSB7XG4gICAgICAgIHRoaXMub25Mb2FkRW5kTGlzdGVuZXIocm91dGUpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBtb2R1bGUgPSBmYWN0b3J5LmNyZWF0ZShwYXJlbnRJbmplY3Rvcik7XG5cbiAgICAgIHJldHVybiBuZXcgTG9hZGVkUm91dGVyQ29uZmlnKFxuICAgICAgICAgIGZsYXR0ZW4obW9kdWxlLmluamVjdG9yLmdldChST1VURVMpKS5tYXAoc3RhbmRhcmRpemVDb25maWcpLCBtb2R1bGUpO1xuICAgIH0pKTtcbiAgfVxuXG4gIHByaXZhdGUgbG9hZE1vZHVsZUZhY3RvcnkobG9hZENoaWxkcmVuOiBMb2FkQ2hpbGRyZW4pOiBPYnNlcnZhYmxlPE5nTW9kdWxlRmFjdG9yeTxhbnk+PiB7XG4gICAgaWYgKHR5cGVvZiBsb2FkQ2hpbGRyZW4gPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gZnJvbSh0aGlzLmxvYWRlci5sb2FkKGxvYWRDaGlsZHJlbikpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gd3JhcEludG9PYnNlcnZhYmxlKGxvYWRDaGlsZHJlbigpKS5waXBlKG1lcmdlTWFwKCh0OiBhbnkpID0+IHtcbiAgICAgICAgaWYgKHQgaW5zdGFuY2VvZiBOZ01vZHVsZUZhY3RvcnkpIHtcbiAgICAgICAgICByZXR1cm4gb2YgKHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmcm9tKHRoaXMuY29tcGlsZXIuY29tcGlsZU1vZHVsZUFzeW5jKHQpKTtcbiAgICAgICAgfVxuICAgICAgfSkpO1xuICAgIH1cbiAgfVxufVxuIl19