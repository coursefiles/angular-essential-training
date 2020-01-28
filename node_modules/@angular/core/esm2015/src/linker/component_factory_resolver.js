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
import { stringify } from '../util/stringify';
import { ComponentFactory } from './component_factory';
/**
 * @param {?} component
 * @return {?}
 */
export function noComponentFactoryError(component) {
    /** @type {?} */
    const error = Error(`No component factory found for ${stringify(component)}. Did you add it to @NgModule.entryComponents?`);
    ((/** @type {?} */ (error)))[ERROR_COMPONENT] = component;
    return error;
}
/** @type {?} */
const ERROR_COMPONENT = 'ngComponent';
/**
 * @param {?} error
 * @return {?}
 */
export function getComponent(error) {
    return ((/** @type {?} */ (error)))[ERROR_COMPONENT];
}
class _NullComponentFactoryResolver {
    /**
     * @template T
     * @param {?} component
     * @return {?}
     */
    resolveComponentFactory(component) {
        throw noComponentFactoryError(component);
    }
}
/**
 * \@publicApi
 * @abstract
 */
export class ComponentFactoryResolver {
}
ComponentFactoryResolver.NULL = new _NullComponentFactoryResolver();
if (false) {
    /** @type {?} */
    ComponentFactoryResolver.NULL;
    /**
     * @abstract
     * @template T
     * @param {?} component
     * @return {?}
     */
    ComponentFactoryResolver.prototype.resolveComponentFactory = function (component) { };
}
export class CodegenComponentFactoryResolver {
    /**
     * @param {?} factories
     * @param {?} _parent
     * @param {?} _ngModule
     */
    constructor(factories, _parent, _ngModule) {
        this._parent = _parent;
        this._ngModule = _ngModule;
        this._factories = new Map();
        for (let i = 0; i < factories.length; i++) {
            /** @type {?} */
            const factory = factories[i];
            this._factories.set(factory.componentType, factory);
        }
    }
    /**
     * @template T
     * @param {?} component
     * @return {?}
     */
    resolveComponentFactory(component) {
        /** @type {?} */
        let factory = this._factories.get(component);
        if (!factory && this._parent) {
            factory = this._parent.resolveComponentFactory(component);
        }
        if (!factory) {
            throw noComponentFactoryError(component);
        }
        return new ComponentFactoryBoundToModule(factory, this._ngModule);
    }
}
if (false) {
    /**
     * @type {?}
     * @private
     */
    CodegenComponentFactoryResolver.prototype._factories;
    /**
     * @type {?}
     * @private
     */
    CodegenComponentFactoryResolver.prototype._parent;
    /**
     * @type {?}
     * @private
     */
    CodegenComponentFactoryResolver.prototype._ngModule;
}
/**
 * @template C
 */
export class ComponentFactoryBoundToModule extends ComponentFactory {
    /**
     * @param {?} factory
     * @param {?} ngModule
     */
    constructor(factory, ngModule) {
        super();
        this.factory = factory;
        this.ngModule = ngModule;
        this.selector = factory.selector;
        this.componentType = factory.componentType;
        this.ngContentSelectors = factory.ngContentSelectors;
        this.inputs = factory.inputs;
        this.outputs = factory.outputs;
    }
    /**
     * @param {?} injector
     * @param {?=} projectableNodes
     * @param {?=} rootSelectorOrNode
     * @param {?=} ngModule
     * @return {?}
     */
    create(injector, projectableNodes, rootSelectorOrNode, ngModule) {
        return this.factory.create(injector, projectableNodes, rootSelectorOrNode, ngModule || this.ngModule);
    }
}
if (false) {
    /** @type {?} */
    ComponentFactoryBoundToModule.prototype.selector;
    /** @type {?} */
    ComponentFactoryBoundToModule.prototype.componentType;
    /** @type {?} */
    ComponentFactoryBoundToModule.prototype.ngContentSelectors;
    /** @type {?} */
    ComponentFactoryBoundToModule.prototype.inputs;
    /** @type {?} */
    ComponentFactoryBoundToModule.prototype.outputs;
    /**
     * @type {?}
     * @private
     */
    ComponentFactoryBoundToModule.prototype.factory;
    /**
     * @type {?}
     * @private
     */
    ComponentFactoryBoundToModule.prototype.ngModule;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9uZW50X2ZhY3RvcnlfcmVzb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9saW5rZXIvY29tcG9uZW50X2ZhY3RvcnlfcmVzb2x2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFVQSxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFFNUMsT0FBTyxFQUFDLGdCQUFnQixFQUFlLE1BQU0scUJBQXFCLENBQUM7Ozs7O0FBR25FLE1BQU0sVUFBVSx1QkFBdUIsQ0FBQyxTQUFtQjs7VUFDbkQsS0FBSyxHQUFHLEtBQUssQ0FDZixrQ0FBa0MsU0FBUyxDQUFDLFNBQVMsQ0FBQyxnREFBZ0QsQ0FBQztJQUMzRyxDQUFDLG1CQUFBLEtBQUssRUFBTyxDQUFDLENBQUMsZUFBZSxDQUFDLEdBQUcsU0FBUyxDQUFDO0lBQzVDLE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQzs7TUFFSyxlQUFlLEdBQUcsYUFBYTs7Ozs7QUFFckMsTUFBTSxVQUFVLFlBQVksQ0FBQyxLQUFZO0lBQ3ZDLE9BQU8sQ0FBQyxtQkFBQSxLQUFLLEVBQU8sQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pDLENBQUM7QUFHRCxNQUFNLDZCQUE2Qjs7Ozs7O0lBQ2pDLHVCQUF1QixDQUFJLFNBQW9DO1FBQzdELE1BQU0sdUJBQXVCLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDM0MsQ0FBQztDQUNGOzs7OztBQUtELE1BQU0sT0FBZ0Isd0JBQXdCOztBQUNyQyw2QkFBSSxHQUE2QixJQUFJLDZCQUE2QixFQUFFLENBQUM7OztJQUE1RSw4QkFBNEU7Ozs7Ozs7SUFDNUUsc0ZBQTZFOztBQUcvRSxNQUFNLE9BQU8sK0JBQStCOzs7Ozs7SUFHMUMsWUFDSSxTQUFrQyxFQUFVLE9BQWlDLEVBQ3JFLFNBQTJCO1FBRFMsWUFBTyxHQUFQLE9BQU8sQ0FBMEI7UUFDckUsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFKL0IsZUFBVSxHQUFHLElBQUksR0FBRyxFQUE4QixDQUFDO1FBS3pELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFOztrQkFDbkMsT0FBTyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDNUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsQ0FBQztTQUNyRDtJQUNILENBQUM7Ozs7OztJQUVELHVCQUF1QixDQUFJLFNBQW9DOztZQUN6RCxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDO1FBQzVDLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUM1QixPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUMzRDtRQUNELElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixNQUFNLHVCQUF1QixDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQzFDO1FBQ0QsT0FBTyxJQUFJLDZCQUE2QixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDcEUsQ0FBQztDQUNGOzs7Ozs7SUFyQkMscURBQTJEOzs7OztJQUduQixrREFBeUM7Ozs7O0lBQzdFLG9EQUFtQzs7Ozs7QUFtQnpDLE1BQU0sT0FBTyw2QkFBaUMsU0FBUSxnQkFBbUI7Ozs7O0lBT3ZFLFlBQW9CLE9BQTRCLEVBQVUsUUFBMEI7UUFDbEYsS0FBSyxFQUFFLENBQUM7UUFEVSxZQUFPLEdBQVAsT0FBTyxDQUFxQjtRQUFVLGFBQVEsR0FBUixRQUFRLENBQWtCO1FBRWxGLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQztRQUNqQyxJQUFJLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUM7UUFDM0MsSUFBSSxDQUFDLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQztRQUNyRCxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFDN0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO0lBQ2pDLENBQUM7Ozs7Ozs7O0lBRUQsTUFBTSxDQUNGLFFBQWtCLEVBQUUsZ0JBQTBCLEVBQUUsa0JBQStCLEVBQy9FLFFBQTJCO1FBQzdCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQ3RCLFFBQVEsRUFBRSxnQkFBZ0IsRUFBRSxrQkFBa0IsRUFBRSxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2pGLENBQUM7Q0FDRjs7O0lBckJDLGlEQUEwQjs7SUFDMUIsc0RBQWtDOztJQUNsQywyREFBc0M7O0lBQ3RDLCtDQUE0RDs7SUFDNUQsZ0RBQTZEOzs7OztJQUVqRCxnREFBb0M7Ozs7O0lBQUUsaURBQWtDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0luamVjdG9yfSBmcm9tICcuLi9kaS9pbmplY3Rvcic7XG5pbXBvcnQge1R5cGV9IGZyb20gJy4uL2ludGVyZmFjZS90eXBlJztcbmltcG9ydCB7c3RyaW5naWZ5fSBmcm9tICcuLi91dGlsL3N0cmluZ2lmeSc7XG5cbmltcG9ydCB7Q29tcG9uZW50RmFjdG9yeSwgQ29tcG9uZW50UmVmfSBmcm9tICcuL2NvbXBvbmVudF9mYWN0b3J5JztcbmltcG9ydCB7TmdNb2R1bGVSZWZ9IGZyb20gJy4vbmdfbW9kdWxlX2ZhY3RvcnknO1xuXG5leHBvcnQgZnVuY3Rpb24gbm9Db21wb25lbnRGYWN0b3J5RXJyb3IoY29tcG9uZW50OiBGdW5jdGlvbikge1xuICBjb25zdCBlcnJvciA9IEVycm9yKFxuICAgICAgYE5vIGNvbXBvbmVudCBmYWN0b3J5IGZvdW5kIGZvciAke3N0cmluZ2lmeShjb21wb25lbnQpfS4gRGlkIHlvdSBhZGQgaXQgdG8gQE5nTW9kdWxlLmVudHJ5Q29tcG9uZW50cz9gKTtcbiAgKGVycm9yIGFzIGFueSlbRVJST1JfQ09NUE9ORU5UXSA9IGNvbXBvbmVudDtcbiAgcmV0dXJuIGVycm9yO1xufVxuXG5jb25zdCBFUlJPUl9DT01QT05FTlQgPSAnbmdDb21wb25lbnQnO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29tcG9uZW50KGVycm9yOiBFcnJvcik6IFR5cGU8YW55PiB7XG4gIHJldHVybiAoZXJyb3IgYXMgYW55KVtFUlJPUl9DT01QT05FTlRdO1xufVxuXG5cbmNsYXNzIF9OdWxsQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyIGltcGxlbWVudHMgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyIHtcbiAgcmVzb2x2ZUNvbXBvbmVudEZhY3Rvcnk8VD4oY29tcG9uZW50OiB7bmV3ICguLi5hcmdzOiBhbnlbXSk6IFR9KTogQ29tcG9uZW50RmFjdG9yeTxUPiB7XG4gICAgdGhyb3cgbm9Db21wb25lbnRGYWN0b3J5RXJyb3IoY29tcG9uZW50KTtcbiAgfVxufVxuXG4vKipcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciB7XG4gIHN0YXRpYyBOVUxMOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIgPSBuZXcgX051bGxDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIoKTtcbiAgYWJzdHJhY3QgcmVzb2x2ZUNvbXBvbmVudEZhY3Rvcnk8VD4oY29tcG9uZW50OiBUeXBlPFQ+KTogQ29tcG9uZW50RmFjdG9yeTxUPjtcbn1cblxuZXhwb3J0IGNsYXNzIENvZGVnZW5Db21wb25lbnRGYWN0b3J5UmVzb2x2ZXIgaW1wbGVtZW50cyBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIge1xuICBwcml2YXRlIF9mYWN0b3JpZXMgPSBuZXcgTWFwPGFueSwgQ29tcG9uZW50RmFjdG9yeTxhbnk+PigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgZmFjdG9yaWVzOiBDb21wb25lbnRGYWN0b3J5PGFueT5bXSwgcHJpdmF0ZSBfcGFyZW50OiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgICBwcml2YXRlIF9uZ01vZHVsZTogTmdNb2R1bGVSZWY8YW55Pikge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmFjdG9yaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBmYWN0b3J5ID0gZmFjdG9yaWVzW2ldO1xuICAgICAgdGhpcy5fZmFjdG9yaWVzLnNldChmYWN0b3J5LmNvbXBvbmVudFR5cGUsIGZhY3RvcnkpO1xuICAgIH1cbiAgfVxuXG4gIHJlc29sdmVDb21wb25lbnRGYWN0b3J5PFQ+KGNvbXBvbmVudDoge25ldyAoLi4uYXJnczogYW55W10pOiBUfSk6IENvbXBvbmVudEZhY3Rvcnk8VD4ge1xuICAgIGxldCBmYWN0b3J5ID0gdGhpcy5fZmFjdG9yaWVzLmdldChjb21wb25lbnQpO1xuICAgIGlmICghZmFjdG9yeSAmJiB0aGlzLl9wYXJlbnQpIHtcbiAgICAgIGZhY3RvcnkgPSB0aGlzLl9wYXJlbnQucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkoY29tcG9uZW50KTtcbiAgICB9XG4gICAgaWYgKCFmYWN0b3J5KSB7XG4gICAgICB0aHJvdyBub0NvbXBvbmVudEZhY3RvcnlFcnJvcihjb21wb25lbnQpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IENvbXBvbmVudEZhY3RvcnlCb3VuZFRvTW9kdWxlKGZhY3RvcnksIHRoaXMuX25nTW9kdWxlKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ29tcG9uZW50RmFjdG9yeUJvdW5kVG9Nb2R1bGU8Qz4gZXh0ZW5kcyBDb21wb25lbnRGYWN0b3J5PEM+IHtcbiAgcmVhZG9ubHkgc2VsZWN0b3I6IHN0cmluZztcbiAgcmVhZG9ubHkgY29tcG9uZW50VHlwZTogVHlwZTxhbnk+O1xuICByZWFkb25seSBuZ0NvbnRlbnRTZWxlY3RvcnM6IHN0cmluZ1tdO1xuICByZWFkb25seSBpbnB1dHM6IHtwcm9wTmFtZTogc3RyaW5nLCB0ZW1wbGF0ZU5hbWU6IHN0cmluZ31bXTtcbiAgcmVhZG9ubHkgb3V0cHV0czoge3Byb3BOYW1lOiBzdHJpbmcsIHRlbXBsYXRlTmFtZTogc3RyaW5nfVtdO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZmFjdG9yeTogQ29tcG9uZW50RmFjdG9yeTxDPiwgcHJpdmF0ZSBuZ01vZHVsZTogTmdNb2R1bGVSZWY8YW55Pikge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5zZWxlY3RvciA9IGZhY3Rvcnkuc2VsZWN0b3I7XG4gICAgdGhpcy5jb21wb25lbnRUeXBlID0gZmFjdG9yeS5jb21wb25lbnRUeXBlO1xuICAgIHRoaXMubmdDb250ZW50U2VsZWN0b3JzID0gZmFjdG9yeS5uZ0NvbnRlbnRTZWxlY3RvcnM7XG4gICAgdGhpcy5pbnB1dHMgPSBmYWN0b3J5LmlucHV0cztcbiAgICB0aGlzLm91dHB1dHMgPSBmYWN0b3J5Lm91dHB1dHM7XG4gIH1cblxuICBjcmVhdGUoXG4gICAgICBpbmplY3RvcjogSW5qZWN0b3IsIHByb2plY3RhYmxlTm9kZXM/OiBhbnlbXVtdLCByb290U2VsZWN0b3JPck5vZGU/OiBzdHJpbmd8YW55LFxuICAgICAgbmdNb2R1bGU/OiBOZ01vZHVsZVJlZjxhbnk+KTogQ29tcG9uZW50UmVmPEM+IHtcbiAgICByZXR1cm4gdGhpcy5mYWN0b3J5LmNyZWF0ZShcbiAgICAgICAgaW5qZWN0b3IsIHByb2plY3RhYmxlTm9kZXMsIHJvb3RTZWxlY3Rvck9yTm9kZSwgbmdNb2R1bGUgfHwgdGhpcy5uZ01vZHVsZSk7XG4gIH1cbn1cbiJdfQ==