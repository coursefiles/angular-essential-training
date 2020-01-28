/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/src/ngtsc/annotations/src/base_def", ["require", "exports", "tslib", "@angular/compiler", "@angular/compiler-cli/src/ngtsc/transform", "@angular/compiler-cli/src/ngtsc/annotations/src/directive", "@angular/compiler-cli/src/ngtsc/annotations/src/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var compiler_1 = require("@angular/compiler");
    var transform_1 = require("@angular/compiler-cli/src/ngtsc/transform");
    var directive_1 = require("@angular/compiler-cli/src/ngtsc/annotations/src/directive");
    var util_1 = require("@angular/compiler-cli/src/ngtsc/annotations/src/util");
    function containsNgTopLevelDecorator(decorators, isCore) {
        if (!decorators) {
            return false;
        }
        return decorators.some(function (decorator) { return util_1.isAngularDecorator(decorator, 'Component', isCore) ||
            util_1.isAngularDecorator(decorator, 'Directive', isCore) ||
            util_1.isAngularDecorator(decorator, 'NgModule', isCore); });
    }
    var BaseDefDecoratorHandler = /** @class */ (function () {
        function BaseDefDecoratorHandler(reflector, evaluator, isCore) {
            this.reflector = reflector;
            this.evaluator = evaluator;
            this.isCore = isCore;
            this.precedence = transform_1.HandlerPrecedence.WEAK;
        }
        BaseDefDecoratorHandler.prototype.detect = function (node, decorators) {
            var _this = this;
            if (containsNgTopLevelDecorator(decorators, this.isCore)) {
                // If the class is already decorated by @Component or @Directive let that
                // DecoratorHandler handle this. BaseDef is unnecessary.
                return undefined;
            }
            var result = undefined;
            this.reflector.getMembersOfClass(node).forEach(function (property) {
                var e_1, _a;
                var decorators = property.decorators;
                if (!decorators) {
                    return;
                }
                try {
                    for (var decorators_1 = tslib_1.__values(decorators), decorators_1_1 = decorators_1.next(); !decorators_1_1.done; decorators_1_1 = decorators_1.next()) {
                        var decorator = decorators_1_1.value;
                        if (util_1.isAngularDecorator(decorator, 'Input', _this.isCore)) {
                            result = result || {};
                            var inputs = result.inputs = result.inputs || [];
                            inputs.push({ decorator: decorator, property: property });
                        }
                        else if (util_1.isAngularDecorator(decorator, 'Output', _this.isCore)) {
                            result = result || {};
                            var outputs = result.outputs = result.outputs || [];
                            outputs.push({ decorator: decorator, property: property });
                        }
                        else if (util_1.isAngularDecorator(decorator, 'ViewChild', _this.isCore) ||
                            util_1.isAngularDecorator(decorator, 'ViewChildren', _this.isCore)) {
                            result = result || {};
                            var viewQueries = result.viewQueries = result.viewQueries || [];
                            viewQueries.push({ member: property, decorators: decorators });
                        }
                        else if (util_1.isAngularDecorator(decorator, 'ContentChild', _this.isCore) ||
                            util_1.isAngularDecorator(decorator, 'ContentChildren', _this.isCore)) {
                            result = result || {};
                            var queries = result.queries = result.queries || [];
                            queries.push({ member: property, decorators: decorators });
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (decorators_1_1 && !decorators_1_1.done && (_a = decorators_1.return)) _a.call(decorators_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            });
            if (result !== undefined) {
                return {
                    metadata: result,
                    trigger: null,
                };
            }
            else {
                return undefined;
            }
        };
        BaseDefDecoratorHandler.prototype.analyze = function (node, metadata) {
            var _this = this;
            var analysis = {};
            if (metadata.inputs) {
                var inputs_1 = analysis.inputs = {};
                metadata.inputs.forEach(function (_a) {
                    var decorator = _a.decorator, property = _a.property;
                    var propName = property.name;
                    var args = decorator.args;
                    var value;
                    if (args && args.length > 0) {
                        var resolvedValue = _this.evaluator.evaluate(args[0]);
                        if (typeof resolvedValue !== 'string') {
                            throw new TypeError('Input alias does not resolve to a string value');
                        }
                        value = [resolvedValue, propName];
                    }
                    else {
                        value = propName;
                    }
                    inputs_1[propName] = value;
                });
            }
            if (metadata.outputs) {
                var outputs_1 = analysis.outputs = {};
                metadata.outputs.forEach(function (_a) {
                    var decorator = _a.decorator, property = _a.property;
                    var propName = property.name;
                    var args = decorator.args;
                    var value;
                    if (args && args.length > 0) {
                        var resolvedValue = _this.evaluator.evaluate(args[0]);
                        if (typeof resolvedValue !== 'string') {
                            throw new TypeError('Output alias does not resolve to a string value');
                        }
                        value = resolvedValue;
                    }
                    else {
                        value = propName;
                    }
                    outputs_1[propName] = value;
                });
            }
            if (metadata.viewQueries) {
                analysis.viewQueries =
                    directive_1.queriesFromFields(metadata.viewQueries, this.reflector, this.evaluator);
            }
            if (metadata.queries) {
                analysis.queries = directive_1.queriesFromFields(metadata.queries, this.reflector, this.evaluator);
            }
            return { analysis: analysis };
        };
        BaseDefDecoratorHandler.prototype.compile = function (node, analysis, pool) {
            var _a = compiler_1.compileBaseDefFromMetadata(analysis, pool), expression = _a.expression, type = _a.type;
            return {
                name: 'ngBaseDef',
                initializer: expression, type: type,
                statements: [],
            };
        };
        return BaseDefDecoratorHandler;
    }());
    exports.BaseDefDecoratorHandler = BaseDefDecoratorHandler;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZV9kZWYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL2Fubm90YXRpb25zL3NyYy9iYXNlX2RlZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7SUFFSCw4Q0FBOEY7SUFJOUYsdUVBQWlIO0lBRWpILHVGQUE4QztJQUM5Qyw2RUFBMEM7SUFFMUMsU0FBUywyQkFBMkIsQ0FBQyxVQUE4QixFQUFFLE1BQWU7UUFDbEYsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNmLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFDRCxPQUFPLFVBQVUsQ0FBQyxJQUFJLENBQ2xCLFVBQUEsU0FBUyxJQUFJLE9BQUEseUJBQWtCLENBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRSxNQUFNLENBQUM7WUFDM0QseUJBQWtCLENBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRSxNQUFNLENBQUM7WUFDbEQseUJBQWtCLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLENBQUMsRUFGeEMsQ0FFd0MsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFRDtRQUVFLGlDQUNZLFNBQXlCLEVBQVUsU0FBMkIsRUFDOUQsTUFBZTtZQURmLGNBQVMsR0FBVCxTQUFTLENBQWdCO1lBQVUsY0FBUyxHQUFULFNBQVMsQ0FBa0I7WUFDOUQsV0FBTSxHQUFOLE1BQU0sQ0FBUztZQUVsQixlQUFVLEdBQUcsNkJBQWlCLENBQUMsSUFBSSxDQUFDO1FBRmYsQ0FBQztRQUkvQix3Q0FBTSxHQUFOLFVBQU8sSUFBc0IsRUFBRSxVQUE0QjtZQUEzRCxpQkFnREM7WUE5Q0MsSUFBSSwyQkFBMkIsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUN4RCx5RUFBeUU7Z0JBQ3pFLHdEQUF3RDtnQkFDeEQsT0FBTyxTQUFTLENBQUM7YUFDbEI7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Qzt3QkFDdkQsSUFBSSxPQUFPLGFBQWEsS0FBSyxRQUFRLEVBQUU7NEJBQ3JDLE1BQU0sSUFBSSxTQUFTLENBQUMsaURBQWlELENBQUMsQ0FBQzt5QkFDeEU7d0JBQ0QsS0FBSyxHQUFHLGFBQWEsQ0FBQztxQkFDdkI7eUJBQU07d0JBQ0wsS0FBSyxHQUFHLFFBQVEsQ0FBQztxQkFDbEI7b0JBQ0QsU0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEtBQUssQ0FBQztnQkFDNUIsQ0FBQyxDQUFDLENBQUM7YUFDSjtZQUVELElBQUksUUFBUSxDQUFDLFdBQVcsRUFBRTtnQkFDeEIsUUFBUSxDQUFDLFdBQVc7b0JBQ2hCLDZCQUFpQixDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDN0U7WUFFRCxJQUFJLFFBQVEsQ0FBQyxPQUFPLEVBQUU7Z0JBQ3BCLFFBQVEsQ0FBQyxPQUFPLEdBQUcsNkJBQWlCLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUN4RjtZQUVELE9BQU8sRUFBQyxRQUFRLFVBQUEsRUFBQyxDQUFDO1FBQ3BCLENBQUM7UUFFRCx5Q0FBTyxHQUFQLFVBQVEsSUFBc0IsRUFBRSxRQUEyQixFQUFFLElBQWtCO1lBRXZFLElBQUEsMERBQStELEVBQTlELDBCQUFVLEVBQUUsY0FBa0QsQ0FBQztZQUV0RSxPQUFPO2dCQUNMLElBQUksRUFBRSxXQUFXO2dCQUNqQixXQUFXLEVBQUUsVUFBVSxFQUFFLElBQUksTUFBQTtnQkFDN0IsVUFBVSxFQUFFLEVBQUU7YUFDZixDQUFDO1FBQ0osQ0FBQztRQUNILDhCQUFDO0lBQUQsQ0FBQyxBQXpIRCxJQXlIQztJQXpIWSwwREFBdUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29uc3RhbnRQb29sLCBSM0Jhc2VSZWZNZXRhRGF0YSwgY29tcGlsZUJhc2VEZWZGcm9tTWV0YWRhdGF9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyJztcblxuaW1wb3J0IHtQYXJ0aWFsRXZhbHVhdG9yfSBmcm9tICcuLi8uLi9wYXJ0aWFsX2V2YWx1YXRvcic7XG5pbXBvcnQge0NsYXNzRGVjbGFyYXRpb24sIENsYXNzTWVtYmVyLCBEZWNvcmF0b3IsIFJlZmxlY3Rpb25Ib3N0fSBmcm9tICcuLi8uLi9yZWZsZWN0aW9uJztcbmltcG9ydCB7QW5hbHlzaXNPdXRwdXQsIENvbXBpbGVSZXN1bHQsIERlY29yYXRvckhhbmRsZXIsIERldGVjdFJlc3VsdCwgSGFuZGxlclByZWNlZGVuY2V9IGZyb20gJy4uLy4uL3RyYW5zZm9ybSc7XG5cbmltcG9ydCB7cXVlcmllc0Zyb21GaWVsZHN9IGZyb20gJy4vZGlyZWN0aXZlJztcbmltcG9ydCB7aXNBbmd1bGFyRGVjb3JhdG9yfSBmcm9tICcuL3V0aWwnO1xuXG5mdW5jdGlvbiBjb250YWluc05nVG9wTGV2ZWxEZWNvcmF0b3IoZGVjb3JhdG9yczogRGVjb3JhdG9yW10gfCBudWxsLCBpc0NvcmU6IGJvb2xlYW4pOiBib29sZWFuIHtcbiAgaWYgKCFkZWNvcmF0b3JzKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiBkZWNvcmF0b3JzLnNvbWUoXG4gICAgICBkZWNvcmF0b3IgPT4gaXNBbmd1bGFyRGVjb3JhdG9yKGRlY29yYXRvciwgJ0NvbXBvbmVudCcsIGlzQ29yZSkgfHxcbiAgICAgICAgICBpc0FuZ3VsYXJEZWNvcmF0b3IoZGVjb3JhdG9yLCAnRGlyZWN0aXZlJywgaXNDb3JlKSB8fFxuICAgICAgICAgIGlzQW5ndWxhckRlY29yYXRvcihkZWNvcmF0b3IsICdOZ01vZHVsZScsIGlzQ29yZSkpO1xufVxuXG5leHBvcnQgY2xhc3MgQmFzZURlZkRlY29yYXRvckhhbmRsZXIgaW1wbGVtZW50c1xuICAgIERlY29yYXRvckhhbmRsZXI8UjNCYXNlUmVmTWV0YURhdGEsIFIzQmFzZVJlZkRlY29yYXRvckRldGVjdGlvbj4ge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgcmVmbGVjdG9yOiBSZWZsZWN0aW9uSG9zdCwgcHJpdmF0ZSBldmFsdWF0b3I6IFBhcnRpYWxFdmFsdWF0b3IsXG4gICAgICBwcml2YXRlIGlzQ29yZTogYm9vbGVhbikge31cblxuICByZWFkb25seSBwcmVjZWRlbmNlID0gSGFuZGxlclByZWNlZGVuY2UuV0VBSztcblxuICBkZXRlY3Qobm9kZTogQ2xhc3NEZWNsYXJhdGlvbiwgZGVjb3JhdG9yczogRGVjb3JhdG9yW118bnVsbCk6XG4gICAgICBEZXRlY3RSZXN1bHQ8UjNCYXNlUmVmRGVjb3JhdG9yRGV0ZWN0aW9uPnx1bmRlZmluZWQge1xuICAgIGlmIChjb250YWluc05nVG9wTGV2ZWxEZWNvcmF0b3IoZGVjb3JhdG9ycywgdGhpcy5pc0NvcmUpKSB7XG4gICAgICAvLyBJZiB0aGUgY2xhc3MgaXMgYWxyZWFkeSBkZWNvcmF0ZWQgYnkgQENvbXBvbmVudCBvciBARGlyZWN0aXZlIGxldCB0aGF0XG4gICAgICAvLyBEZWNvcmF0b3JIYW5kbGVyIGhhbmRsZSB0aGlzLiBCYXNlRGVmIGlzIHVubmVjZXNzYXJ5LlxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBsZXQgcmVzdWx0OiBSM0Jhc2VSZWZEZWNvcmF0b3JEZXRlY3Rpb258dW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuXG4gICAgdGhpcy5yZWZsZWN0b3IuZ2V0TWVtYmVyc09mQ2xhc3Mobm9kZSkuZm9yRWFjaChwcm9wZXJ0eSA9PiB7XG4gICAgICBjb25zdCB7ZGVjb3JhdG9yc30gPSBwcm9wZXJ0eTtcbiAgICAgIGlmICghZGVjb3JhdG9ycykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBmb3IgKGNvbnN0IGRlY29yYXRvciBvZiBkZWNvcmF0b3JzKSB7XG4gICAgICAgIGlmIChpc0FuZ3VsYXJEZWNvcmF0b3IoZGVjb3JhdG9yLCAnSW5wdXQnLCB0aGlzLmlzQ29yZSkpIHtcbiAgICAgICAgICByZXN1bHQgPSByZXN1bHQgfHwge307XG4gICAgICAgICAgY29uc3QgaW5wdXRzID0gcmVzdWx0LmlucHV0cyA9IHJlc3VsdC5pbnB1dHMgfHwgW107XG4gICAgICAgICAgaW5wdXRzLnB1c2goe2RlY29yYXRvciwgcHJvcGVydHl9KTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0FuZ3VsYXJEZWNvcmF0b3IoZGVjb3JhdG9yLCAnT3V0cHV0JywgdGhpcy5pc0NvcmUpKSB7XG4gICAgICAgICAgcmVzdWx0ID0gcmVzdWx0IHx8IHt9O1xuICAgICAgICAgIGNvbnN0IG91dHB1dHMgPSByZXN1bHQub3V0cHV0cyA9IHJlc3VsdC5vdXRwdXRzIHx8IFtdO1xuICAgICAgICAgIG91dHB1dHMucHVzaCh7ZGVjb3JhdG9yLCBwcm9wZXJ0eX0pO1xuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgaXNBbmd1bGFyRGVjb3JhdG9yKGRlY29yYXRvciwgJ1ZpZXdDaGlsZCcsIHRoaXMuaXNDb3JlKSB8fFxuICAgICAgICAgICAgaXNBbmd1bGFyRGVjb3JhdG9yKGRlY29yYXRvciwgJ1ZpZXdDaGlsZHJlbicsIHRoaXMuaXNDb3JlKSkge1xuICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCB8fCB7fTtcbiAgICAgICAgICBjb25zdCB2aWV3UXVlcmllcyA9IHJlc3VsdC52aWV3UXVlcmllcyA9IHJlc3VsdC52aWV3UXVlcmllcyB8fCBbXTtcbiAgICAgICAgICB2aWV3UXVlcmllcy5wdXNoKHttZW1iZXI6IHByb3BlcnR5LCBkZWNvcmF0b3JzfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICBpc0FuZ3VsYXJEZWNvcmF0b3IoZGVjb3JhdG9yLCAnQ29udGVudENoaWxkJywgdGhpcy5pc0NvcmUpIHx8XG4gICAgICAgICAgICBpc0FuZ3VsYXJEZWNvcmF0b3IoZGVjb3JhdG9yLCAnQ29udGVudENoaWxkcmVuJywgdGhpcy5pc0NvcmUpKSB7XG4gICAgICAgICAgcmVzdWx0ID0gcmVzdWx0IHx8IHt9O1xuICAgICAgICAgIGNvbnN0IHF1ZXJpZXMgPSByZXN1bHQucXVlcmllcyA9IHJlc3VsdC5xdWVyaWVzIHx8IFtdO1xuICAgICAgICAgIHF1ZXJpZXMucHVzaCh7bWVtYmVyOiBwcm9wZXJ0eSwgZGVjb3JhdG9yc30pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAocmVzdWx0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1ldGFkYXRhOiByZXN1bHQsXG4gICAgICAgIHRyaWdnZXI6IG51bGwsXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIGFuYWx5emUobm9kZTogQ2xhc3NEZWNsYXJhdGlvbiwgbWV0YWRhdGE6IFIzQmFzZVJlZkRlY29yYXRvckRldGVjdGlvbik6XG4gICAgICBBbmFseXNpc091dHB1dDxSM0Jhc2VSZWZNZXRhRGF0YT4ge1xuICAgIGNvbnN0IGFuYWx5c2lzOiBSM0Jhc2VSZWZNZXRhRGF0YSA9IHt9O1xuICAgIGlmIChtZXRhZGF0YS5pbnB1dHMpIHtcbiAgICAgIGNvbnN0IGlucHV0cyA9IGFuYWx5c2lzLmlucHV0cyA9IHt9IGFze1trZXk6IHN0cmluZ106IHN0cmluZyB8IFtzdHJpbmcsIHN0cmluZ119O1xuICAgICAgbWV0YWRhdGEuaW5wdXRzLmZvckVhY2goKHtkZWNvcmF0b3IsIHByb3BlcnR5fSkgPT4ge1xuICAgICAgICBjb25zdCBwcm9wTmFtZSA9IHByb3BlcnR5Lm5hbWU7XG4gICAgICAgIGNvbnN0IGFyZ3MgPSBkZWNvcmF0b3IuYXJncztcbiAgICAgICAgbGV0IHZhbHVlOiBzdHJpbmd8W3N0cmluZywgc3RyaW5nXTtcbiAgICAgICAgaWYgKGFyZ3MgJiYgYXJncy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgY29uc3QgcmVzb2x2ZWRWYWx1ZSA9IHRoaXMuZXZhbHVhdG9yLmV2YWx1YXRlKGFyZ3NbMF0pO1xuICAgICAgICAgIGlmICh0eXBlb2YgcmVzb2x2ZWRWYWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0lucHV0IGFsaWFzIGRvZXMgbm90IHJlc29sdmUgdG8gYSBzdHJpbmcgdmFsdWUnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFsdWUgPSBbcmVzb2x2ZWRWYWx1ZSwgcHJvcE5hbWVdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbHVlID0gcHJvcE5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgaW5wdXRzW3Byb3BOYW1lXSA9IHZhbHVlO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKG1ldGFkYXRhLm91dHB1dHMpIHtcbiAgICAgIGNvbnN0IG91dHB1dHMgPSBhbmFseXNpcy5vdXRwdXRzID0ge30gYXN7W2tleTogc3RyaW5nXTogc3RyaW5nfTtcbiAgICAgIG1ldGFkYXRhLm91dHB1dHMuZm9yRWFjaCgoe2RlY29yYXRvciwgcHJvcGVydHl9KSA9PiB7XG4gICAgICAgIGNvbnN0IHByb3BOYW1lID0gcHJvcGVydHkubmFtZTtcbiAgICAgICAgY29uc3QgYXJncyA9IGRlY29yYXRvci5hcmdzO1xuICAgICAgICBsZXQgdmFsdWU6IHN0cmluZztcbiAgICAgICAgaWYgKGFyZ3MgJiYgYXJncy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgY29uc3QgcmVzb2x2ZWRWYWx1ZSA9IHRoaXMuZXZhbHVhdG9yLmV2YWx1YXRlKGFyZ3NbMF0pO1xuICAgICAgICAgIGlmICh0eXBlb2YgcmVzb2x2ZWRWYWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ091dHB1dCBhbGlhcyBkb2VzIG5vdCByZXNvbHZlIHRvIGEgc3RyaW5nIHZhbHVlJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhbHVlID0gcmVzb2x2ZWRWYWx1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWx1ZSA9IHByb3BOYW1lO1xuICAgICAgICB9XG4gICAgICAgIG91dHB1dHNbcHJvcE5hbWVdID0gdmFsdWU7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAobWV0YWRhdGEudmlld1F1ZXJpZXMpIHtcbiAgICAgIGFuYWx5c2lzLnZpZXdRdWVyaWVzID1cbiAgICAgICAgICBxdWVyaWVzRnJvbUZpZWxkcyhtZXRhZGF0YS52aWV3UXVlcmllcywgdGhpcy5yZWZsZWN0b3IsIHRoaXMuZXZhbHVhdG9yKTtcbiAgICB9XG5cbiAgICBpZiAobWV0YWRhdGEucXVlcmllcykge1xuICAgICAgYW5hbHlzaXMucXVlcmllcyA9IHF1ZXJpZXNGcm9tRmllbGRzKG1ldGFkYXRhLnF1ZXJpZXMsIHRoaXMucmVmbGVjdG9yLCB0aGlzLmV2YWx1YXRvcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHthbmFseXNpc307XG4gIH1cblxuICBjb21waWxlKG5vZGU6IENsYXNzRGVjbGFyYXRpb24sIGFuYWx5c2lzOiBSM0Jhc2VSZWZNZXRhRGF0YSwgcG9vbDogQ29uc3RhbnRQb29sKTpcbiAgICAgIENvbXBpbGVSZXN1bHRbXXxDb21waWxlUmVzdWx0IHtcbiAgICBjb25zdCB7ZXhwcmVzc2lvbiwgdHlwZX0gPSBjb21waWxlQmFzZURlZkZyb21NZXRhZGF0YShhbmFseXNpcywgcG9vbCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ25nQmFzZURlZicsXG4gICAgICBpbml0aWFsaXplcjogZXhwcmVzc2lvbiwgdHlwZSxcbiAgICAgIHN0YXRlbWVudHM6IFtdLFxuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBSM0Jhc2VSZWZEZWNvcmF0b3JEZXRlY3Rpb24ge1xuICBpbnB1dHM/OiBBcnJheTx7cHJvcGVydHk6IENsYXNzTWVtYmVyLCBkZWNvcmF0b3I6IERlY29yYXRvcn0+O1xuICBvdXRwdXRzPzogQXJyYXk8e3Byb3BlcnR5OiBDbGFzc01lbWJlciwgZGVjb3JhdG9yOiBEZWNvcmF0b3J9PjtcbiAgdmlld1F1ZXJpZXM/OiB7bWVtYmVyOiBDbGFzc01lbWJlciwgZGVjb3JhdG9yczogRGVjb3JhdG9yW119W107XG4gIHF1ZXJpZXM/OiB7bWVtYmVyOiBDbGFzc01lbWJlciwgZGVjb3JhdG9yczogRGVjb3JhdG9yW119W107XG59XG4iXX0=