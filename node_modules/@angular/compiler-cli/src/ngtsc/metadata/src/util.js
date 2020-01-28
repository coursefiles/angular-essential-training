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
        define("@angular/compiler-cli/src/ngtsc/metadata/src/util", ["require", "exports", "tslib", "typescript", "@angular/compiler-cli/src/ngtsc/imports", "@angular/compiler-cli/src/ngtsc/reflection", "@angular/compiler-cli/src/ngtsc/util/src/typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var ts = require("typescript");
    var imports_1 = require("@angular/compiler-cli/src/ngtsc/imports");
    var reflection_1 = require("@angular/compiler-cli/src/ngtsc/reflection");
    var typescript_1 = require("@angular/compiler-cli/src/ngtsc/util/src/typescript");
    function extractReferencesFromType(checker, def, ngModuleImportedFrom, resolutionContext) {
        if (!ts.isTupleTypeNode(def)) {
            return [];
        }
        return def.elementTypes.map(function (element) {
            if (!ts.isTypeQueryNode(element)) {
                throw new Error("Expected TypeQueryNode: " + typescript_1.nodeDebugInfo(element));
            }
            var type = element.exprName;
            var _a = reflection_1.reflectTypeEntityToDeclaration(type, checker), node = _a.node, from = _a.from;
            if (!reflection_1.isNamedClassDeclaration(node)) {
                throw new Error("Expected named ClassDeclaration: " + typescript_1.nodeDebugInfo(node));
            }
            var specifier = (from !== null && !from.startsWith('.') ? from : ngModuleImportedFrom);
            if (specifier !== null) {
                return new imports_1.Reference(node, { specifier: specifier, resolutionContext: resolutionContext });
            }
            else {
                return new imports_1.Reference(node);
            }
        });
    }
    exports.extractReferencesFromType = extractReferencesFromType;
    function readStringType(type) {
        if (!ts.isLiteralTypeNode(type) || !ts.isStringLiteral(type.literal)) {
            return null;
        }
        return type.literal.text;
    }
    exports.readStringType = readStringType;
    function readStringMapType(type) {
        if (!ts.isTypeLiteralNode(type)) {
            return {};
        }
        var obj = {};
        type.members.forEach(function (member) {
            if (!ts.isPropertySignature(member) || member.type === undefined || member.name === undefined ||
                !ts.isStringLiteral(member.name)) {
                return;
            }
            var value = readStringType(member.type);
            if (value === null) {
                return null;
            }
            obj[member.name.text] = value;
        });
        return obj;
    }
    exports.readStringMapType = readStringMapType;
    function readStringArrayType(type) {
        if (!ts.isTupleTypeNode(type)) {
            return [];
        }
        var res = [];
        type.elementTypes.forEach(function (el) {
            if (!ts.isLiteralTypeNode(el) || !ts.isStringLiteral(el.literal)) {
                return;
            }
            res.push(el.literal.text);
        });
        return res;
    }
    exports.readStringArrayType = readStringArrayType;
    function extractDirectiveGuards(node, reflector) {
        var methods = nodeStaticMethodNames(node, reflector);
        var ngTemplateGuards = methods.filter(function (method) { return method.startsWith('ngTemplateGuard_'); })
            .map(function (method) { return method.split('_', 2)[1]; });
        var hasNgTemplateContextGuard = methods.some(function (name) { return name === 'ngTemplateContextGuard'; });
        return { hasNgTemplateContextGuard: hasNgTemplateContextGuard, ngTemplateGuards: ngTemplateGuards };
    }
    exports.extractDirectiveGuards = extractDirectiveGuards;
    function nodeStaticMethodNames(node, reflector) {
        return reflector.getMembersOfClass(node)
            .filter(function (member) { return member.kind === reflection_1.ClassMemberKind.Method && member.isStatic; })
            .map(function (member) { return member.name; });
    }
    /**
     * A `MetadataReader` that reads from an ordered set of child readers until it obtains the requested
     * metadata.
     *
     * This is used to combine `MetadataReader`s that read from different sources (e.g. from a registry
     * and from .d.ts files).
     */
    var CompoundMetadataReader = /** @class */ (function () {
        function CompoundMetadataReader(readers) {
            this.readers = readers;
        }
        CompoundMetadataReader.prototype.getDirectiveMetadata = function (node) {
            var e_1, _a;
            try {
                for (var _b = tslib_1.__values(this.readers), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var reader = _c.value;
                    var meta = reader.getDirectiveMetadata(node);
                    if (meta !== null) {
                        return meta;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return null;
        };
        CompoundMetadataReader.prototype.getNgModuleMetadata = function (node) {
            var e_2, _a;
            try {
                for (var _b = tslib_1.__values(this.readers), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var reader = _c.value;
                    var meta = reader.getNgModuleMetadata(node);
                    if (meta !== null) {
                        return meta;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return null;
        };
        CompoundMetadataReader.prototype.getPipeMetadata = function (node) {
            var e_3, _a;
            try {
                for (var _b = tslib_1.__values(this.readers), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var reader = _c.value;
                    var meta = reader.getPipeMetadata(node);
                    if (meta !== null) {
                        return meta;
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return null;
        };
        return CompoundMetadataReader;
    }());
    exports.CompoundMetadataReader = CompoundMetadataReader;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvbWV0YWRhdGEvc3JjL3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7O0lBRUgsK0JBQWlDO0lBRWpDLG1FQUF3QztJQUN4Qyx5RUFBNEk7SUFDNUksa0ZBQXdEO0lBSXhELFNBQWdCLHlCQUF5QixDQUNyQyxPQUF1QixFQUFFLEdBQWdCLEVBQUUsb0JBQW1DLEVBQzlFLGlCQUF5QjtRQUMzQixJQUFJLENBQUMsRUFBRSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUM1QixPQUFPLEVBQUUsQ0FBQztTQUNYO1FBQ0QsT0FBTyxHQUFHLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxVQUFBLE9BQU87WUFDakMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ2hDLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTJCLDBCQUFhLENBQUMsT0FBTyxDQUFHLENBQUMsQ0FBQzthQUN0RTtZQUNELElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7WUFDeEIsSUFBQSwrREFBNEQsRUFBM0QsY0FBSSxFQUFFLGNBQXFELENBQUM7WUFDbkUsSUFBSSxDQUFDLG9DQUF1QixDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNsQyxNQUFNLElBQUksS0FBSyxDQUFDLHNDQUFvQywwQkFBYSxDQUFDLElBQUksQ0FBRyxDQUFDLENBQUM7YUFDNUU7WUFDRCxJQUFNLFNBQVMsR0FBRyxDQUFDLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUM7WUFDekYsSUFBSSxT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QkFDZixJQUFNLElBQUksR0FBRyxNQUFNLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzlDLElBQUksSUFBSSxLQUFLLElBQUksRUFBRTt3QkFDakIsT0FBTyxJQUFJLENBQUM7cUJBQ2I7aUJBQ0Y7Ozs7Ozs7OztZQUNELE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUNELGdEQUFlLEdBQWYsVUFBZ0IsSUFBaUQ7OztnQkFDL0QsS0FBcUIsSUFBQSxLQUFBLGlCQUFBLElBQUksQ0FBQyxPQUFPLENBQUEsZ0JBQUEsNEJBQUU7b0JBQTlCLElBQU0sTUFBTSxXQUFBO29CQUNmLElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzFDLElBQUksSUFBSSxLQUFLLElBQUksRUFBRTt3QkFDakIsT0FBTyxJQUFJLENBQUM7cUJBQ2I7aUJBQ0Y7Ozs7Ozs7OztZQUNELE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUNILDZCQUFDO0lBQUQsQ0FBQyxBQS9CRCxJQStCQztJQS9CWSx3REFBc0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge1JlZmVyZW5jZX0gZnJvbSAnLi4vLi4vaW1wb3J0cyc7XG5pbXBvcnQge0NsYXNzRGVjbGFyYXRpb24sIENsYXNzTWVtYmVyS2luZCwgUmVmbGVjdGlvbkhvc3QsIGlzTmFtZWRDbGFzc0RlY2xhcmF0aW9uLCByZWZsZWN0VHlwZUVudGl0eVRvRGVjbGFyYXRpb259IGZyb20gJy4uLy4uL3JlZmxlY3Rpb24nO1xuaW1wb3J0IHtub2RlRGVidWdJbmZvfSBmcm9tICcuLi8uLi91dGlsL3NyYy90eXBlc2NyaXB0JztcblxuaW1wb3J0IHtEaXJlY3RpdmVNZXRhLCBNZXRhZGF0YVJlYWRlciwgTmdNb2R1bGVNZXRhLCBQaXBlTWV0YX0gZnJvbSAnLi9hcGknO1xuXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdFJlZmVyZW5jZXNGcm9tVHlwZShcbiAgICBjaGVja2VyOiB0cy5UeXBlQ2hlY2tlciwgZGVmOiB0cy5UeXBlTm9kZSwgbmdNb2R1bGVJbXBvcnRlZEZyb206IHN0cmluZyB8IG51bGwsXG4gICAgcmVzb2x1dGlvbkNvbnRleHQ6IHN0cmluZyk6IFJlZmVyZW5jZTxDbGFzc0RlY2xhcmF0aW9uPltdIHtcbiAgaWYgKCF0cy5pc1R1cGxlVHlwZU5vZGUoZGVmKSkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICByZXR1cm4gZGVmLmVsZW1lbnRUeXBlcy5tYXAoZWxlbWVudCA9PiB7XG4gICAgaWYgKCF0cy5pc1R5cGVRdWVyeU5vZGUoZWxlbWVudCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgVHlwZVF1ZXJ5Tm9kZTogJHtub2RlRGVidWdJbmZvKGVsZW1lbnQpfWApO1xuICAgIH1cbiAgICBjb25zdCB0eXBlID0gZWxlbWVudC5leHByTmFtZTtcbiAgICBjb25zdCB7bm9kZSwgZnJvbX0gPSByZWZsZWN0VHlwZUVudGl0eVRvRGVjbGFyYXRpb24odHlwZSwgY2hlY2tlcik7XG4gICAgaWYgKCFpc05hbWVkQ2xhc3NEZWNsYXJhdGlvbihub2RlKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBuYW1lZCBDbGFzc0RlY2xhcmF0aW9uOiAke25vZGVEZWJ1Z0luZm8obm9kZSl9YCk7XG4gICAgfVxuICAgIGNvbnN0IHNwZWNpZmllciA9IChmcm9tICE9PSBudWxsICYmICFmcm9tLnN0YXJ0c1dpdGgoJy4nKSA/IGZyb20gOiBuZ01vZHVsZUltcG9ydGVkRnJvbSk7XG4gICAgaWYgKHNwZWNpZmllciAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG5ldyBSZWZlcmVuY2Uobm9kZSwge3NwZWNpZmllciwgcmVzb2x1dGlvbkNvbnRleHR9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG5ldyBSZWZlcmVuY2Uobm9kZSk7XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlYWRTdHJpbmdUeXBlKHR5cGU6IHRzLlR5cGVOb2RlKTogc3RyaW5nfG51bGwge1xuICBpZiAoIXRzLmlzTGl0ZXJhbFR5cGVOb2RlKHR5cGUpIHx8ICF0cy5pc1N0cmluZ0xpdGVyYWwodHlwZS5saXRlcmFsKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiB0eXBlLmxpdGVyYWwudGV4dDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlYWRTdHJpbmdNYXBUeXBlKHR5cGU6IHRzLlR5cGVOb2RlKToge1trZXk6IHN0cmluZ106IHN0cmluZ30ge1xuICBpZiAoIXRzLmlzVHlwZUxpdGVyYWxOb2RlKHR5cGUpKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG4gIGNvbnN0IG9iajoge1trZXk6IHN0cmluZ106IHN0cmluZ30gPSB7fTtcbiAgdHlwZS5tZW1iZXJzLmZvckVhY2gobWVtYmVyID0+IHtcbiAgICBpZiAoIXRzLmlzUHJvcGVydHlTaWduYXR1cmUobWVtYmVyKSB8fCBtZW1iZXIudHlwZSA9PT0gdW5kZWZpbmVkIHx8IG1lbWJlci5uYW1lID09PSB1bmRlZmluZWQgfHxcbiAgICAgICAgIXRzLmlzU3RyaW5nTGl0ZXJhbChtZW1iZXIubmFtZSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgdmFsdWUgPSByZWFkU3RyaW5nVHlwZShtZW1iZXIudHlwZSk7XG4gICAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgb2JqW21lbWJlci5uYW1lLnRleHRdID0gdmFsdWU7XG4gIH0pO1xuICByZXR1cm4gb2JqO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVhZFN0cmluZ0FycmF5VHlwZSh0eXBlOiB0cy5UeXBlTm9kZSk6IHN0cmluZ1tdIHtcbiAgaWYgKCF0cy5pc1R1cGxlVHlwZU5vZGUodHlwZSkpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgY29uc3QgcmVzOiBzdHJpbmdbXSA9IFtdO1xuICB0eXBlLmVsZW1lbnRUeXBlcy5mb3JFYWNoKGVsID0+IHtcbiAgICBpZiAoIXRzLmlzTGl0ZXJhbFR5cGVOb2RlKGVsKSB8fCAhdHMuaXNTdHJpbmdMaXRlcmFsKGVsLmxpdGVyYWwpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJlcy5wdXNoKGVsLmxpdGVyYWwudGV4dCk7XG4gIH0pO1xuICByZXR1cm4gcmVzO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0RGlyZWN0aXZlR3VhcmRzKG5vZGU6IENsYXNzRGVjbGFyYXRpb24sIHJlZmxlY3RvcjogUmVmbGVjdGlvbkhvc3QpOiB7XG4gIG5nVGVtcGxhdGVHdWFyZHM6IHN0cmluZ1tdLFxuICBoYXNOZ1RlbXBsYXRlQ29udGV4dEd1YXJkOiBib29sZWFuLFxufSB7XG4gIGNvbnN0IG1ldGhvZHMgPSBub2RlU3RhdGljTWV0aG9kTmFtZXMobm9kZSwgcmVmbGVjdG9yKTtcbiAgY29uc3QgbmdUZW1wbGF0ZUd1YXJkcyA9IG1ldGhvZHMuZmlsdGVyKG1ldGhvZCA9PiBtZXRob2Quc3RhcnRzV2l0aCgnbmdUZW1wbGF0ZUd1YXJkXycpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAobWV0aG9kID0+IG1ldGhvZC5zcGxpdCgnXycsIDIpWzFdKTtcbiAgY29uc3QgaGFzTmdUZW1wbGF0ZUNvbnRleHRHdWFyZCA9IG1ldGhvZHMuc29tZShuYW1lID0+IG5hbWUgPT09ICduZ1RlbXBsYXRlQ29udGV4dEd1YXJkJyk7XG4gIHJldHVybiB7aGFzTmdUZW1wbGF0ZUNvbnRleHRHdWFyZCwgbmdUZW1wbGF0ZUd1YXJkc307XG59XG5cbmZ1bmN0aW9uIG5vZGVTdGF0aWNNZXRob2ROYW1lcyhub2RlOiBDbGFzc0RlY2xhcmF0aW9uLCByZWZsZWN0b3I6IFJlZmxlY3Rpb25Ib3N0KTogc3RyaW5nW10ge1xuICByZXR1cm4gcmVmbGVjdG9yLmdldE1lbWJlcnNPZkNsYXNzKG5vZGUpXG4gICAgICAuZmlsdGVyKG1lbWJlciA9PiBtZW1iZXIua2luZCA9PT0gQ2xhc3NNZW1iZXJLaW5kLk1ldGhvZCAmJiBtZW1iZXIuaXNTdGF0aWMpXG4gICAgICAubWFwKG1lbWJlciA9PiBtZW1iZXIubmFtZSk7XG59XG5cbi8qKlxuICogQSBgTWV0YWRhdGFSZWFkZXJgIHRoYXQgcmVhZHMgZnJvbSBhbiBvcmRlcmVkIHNldCBvZiBjaGlsZCByZWFkZXJzIHVudGlsIGl0IG9idGFpbnMgdGhlIHJlcXVlc3RlZFxuICogbWV0YWRhdGEuXG4gKlxuICogVGhpcyBpcyB1c2VkIHRvIGNvbWJpbmUgYE1ldGFkYXRhUmVhZGVyYHMgdGhhdCByZWFkIGZyb20gZGlmZmVyZW50IHNvdXJjZXMgKGUuZy4gZnJvbSBhIHJlZ2lzdHJ5XG4gKiBhbmQgZnJvbSAuZC50cyBmaWxlcykuXG4gKi9cbmV4cG9ydCBjbGFzcyBDb21wb3VuZE1ldGFkYXRhUmVhZGVyIGltcGxlbWVudHMgTWV0YWRhdGFSZWFkZXIge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRlcnM6IE1ldGFkYXRhUmVhZGVyW10pIHt9XG5cbiAgZ2V0RGlyZWN0aXZlTWV0YWRhdGEobm9kZTogUmVmZXJlbmNlPENsYXNzRGVjbGFyYXRpb248dHMuRGVjbGFyYXRpb24+Pik6IERpcmVjdGl2ZU1ldGF8bnVsbCB7XG4gICAgZm9yIChjb25zdCByZWFkZXIgb2YgdGhpcy5yZWFkZXJzKSB7XG4gICAgICBjb25zdCBtZXRhID0gcmVhZGVyLmdldERpcmVjdGl2ZU1ldGFkYXRhKG5vZGUpO1xuICAgICAgaWYgKG1ldGEgIT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG1ldGE7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZ2V0TmdNb2R1bGVNZXRhZGF0YShub2RlOiBSZWZlcmVuY2U8Q2xhc3NEZWNsYXJhdGlvbjx0cy5EZWNsYXJhdGlvbj4+KTogTmdNb2R1bGVNZXRhfG51bGwge1xuICAgIGZvciAoY29uc3QgcmVhZGVyIG9mIHRoaXMucmVhZGVycykge1xuICAgICAgY29uc3QgbWV0YSA9IHJlYWRlci5nZXROZ01vZHVsZU1ldGFkYXRhKG5vZGUpO1xuICAgICAgaWYgKG1ldGEgIT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG1ldGE7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGdldFBpcGVNZXRhZGF0YShub2RlOiBSZWZlcmVuY2U8Q2xhc3NEZWNsYXJhdGlvbjx0cy5EZWNsYXJhdGlvbj4+KTogUGlwZU1ldGF8bnVsbCB7XG4gICAgZm9yIChjb25zdCByZWFkZXIgb2YgdGhpcy5yZWFkZXJzKSB7XG4gICAgICBjb25zdCBtZXRhID0gcmVhZGVyLmdldFBpcGVNZXRhZGF0YShub2RlKTtcbiAgICAgIGlmIChtZXRhICE9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBtZXRhO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuIl19