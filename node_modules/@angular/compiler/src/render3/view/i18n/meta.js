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
        define("@angular/compiler/src/render3/view/i18n/meta", ["require", "exports", "tslib", "@angular/compiler/src/i18n/digest", "@angular/compiler/src/i18n/i18n_ast", "@angular/compiler/src/i18n/i18n_parser", "@angular/compiler/src/ml_parser/ast", "@angular/compiler/src/ml_parser/interpolation_config", "@angular/compiler/src/ml_parser/parser", "@angular/compiler/src/render3/view/i18n/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var digest_1 = require("@angular/compiler/src/i18n/digest");
    var i18n = require("@angular/compiler/src/i18n/i18n_ast");
    var i18n_parser_1 = require("@angular/compiler/src/i18n/i18n_parser");
    var html = require("@angular/compiler/src/ml_parser/ast");
    var interpolation_config_1 = require("@angular/compiler/src/ml_parser/interpolation_config");
    var parser_1 = require("@angular/compiler/src/ml_parser/parser");
    var util_1 = require("@angular/compiler/src/render3/view/i18n/util");
    function setI18nRefs(html, i18n) {
        html.i18n = i18n;
    }
    /**
     * This visitor walks over HTML parse tree and converts information stored in
     * i18n-related attributes ("i18n" and "i18n-*") into i18n meta object that is
     * stored with other element's and attribute's information.
     */
    var I18nMetaVisitor = /** @class */ (function () {
        function I18nMetaVisitor(interpolationConfig, keepI18nAttrs) {
            if (interpolationConfig === void 0) { interpolationConfig = interpolation_config_1.DEFAULT_INTERPOLATION_CONFIG; }
            if (keepI18nAttrs === void 0) { keepI18nAttrs = false; }
            this.interpolationConfig = interpolationConfig;
            this.keepI18nAttrs = keepI18nAttrs;
            // i18n message generation factory
            this._createI18nMessage = i18n_parser_1.createI18nMessageFactory(interpolationConfig);
        }
        I18nMetaVisitor.prototype._generateI18nMessage = function (nodes, meta, visitNodeFn) {
            if (meta === void 0) { meta = ''; }
            var parsed = typeof meta === 'string' ? util_1.parseI18nMeta(meta) : util_1.metaFromI18nMessage(meta);
            var message = this._createI18nMessage(nodes, parsed.meaning || '', parsed.description || '', parsed.id || '', visitNodeFn);
            if (!message.id) {
                // generate (or restore) message id if not specified in template
                message.id = typeof meta !== 'string' && meta.id || digest_1.decimalDigest(message);
            }
            return message;
        };
        I18nMetaVisitor.prototype.visitElement = function (element, context) {
            var e_1, _a, e_2, _b;
            if (util_1.hasI18nAttrs(element)) {
                var attrs = [];
                var attrsMeta = {};
                try {
                    for (var _c = tslib_1.__values(element.attrs), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var attr = _d.value;
                        if (attr.name === util_1.I18N_ATTR) {
                            // root 'i18n' node attribute
                            var i18n_1 = element.i18n || attr.value;
                            var message = this._generateI18nMessage(element.children, i18n_1, setI18nRefs);
                            // do not assign empty i18n meta
                            if (message.nodes.length) {
                                element.i18n = message;
                            }
                        }
                        else if (attr.name.startsWith(util_1.I18N_ATTR_PREFIX)) {
                            // 'i18n-*' attributes
                            var key = attr.name.slice(util_1.I18N_ATTR_PREFIX.length);
                            attrsMeta[key] = attr.value;
                        }
                        else {
                            // non-i18n attributes
                            attrs.push(attr);
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                // set i18n meta for attributes
                if (Object.keys(attrsMeta).length) {
                    try {
                        for (var attrs_1 = tslib_1.__values(attrs), attrs_1_1 = attrs_1.next(); !attrs_1_1.done; attrs_1_1 = attrs_1.next()) {
                            var attr = attrs_1_1.value;
                            var meta = attrsMeta[attr.name];
                            // do not create translation for empty attributes
                            if (meta !== undefined && attr.value) {
                                attr.i18n = this._generateI18nMessage([attr], attr.i18n || meta);
                            }
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (attrs_1_1 && !attrs_1_1.done && (_b = attrs_1.return)) _b.call(attrs_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
                if (!this.keepI18nAttrs) {
                    // update element's attributes,
                    // keeping only non-i18n related ones
                    element.attrs = attrs;
                }
            }
            html.visitAll(this, element.children);
            return element;
        };
        I18nMetaVisitor.prototype.visitExpansion = function (expansion, context) {
            var message;
            var meta = expansion.i18n;
            if (meta instanceof i18n.IcuPlaceholder) {
                // set ICU placeholder name (e.g. "ICU_1"),
                // generated while processing root element contents,
                // so we can reference it when we output translation
                var name_1 = meta.name;
                message = this._generateI18nMessage([expansion], meta);
                var icu = util_1.icuFromI18nMessage(message);
                icu.name = name_1;
            }
            else {
                // when ICU is a root level translation
                message = this._generateI18nMessage([expansion], meta);
            }
            expansion.i18n = message;
            return expansion;
        };
        I18nMetaVisitor.prototype.visitText = function (text, context) { return text; };
        I18nMetaVisitor.prototype.visitAttribute = function (attribute, context) { return attribute; };
        I18nMetaVisitor.prototype.visitComment = function (comment, context) { return comment; };
        I18nMetaVisitor.prototype.visitExpansionCase = function (expansionCase, context) { return expansionCase; };
        return I18nMetaVisitor;
    }());
    exports.I18nMetaVisitor = I18nMetaVisitor;
    function processI18nMeta(htmlAstWithErrors, interpolationConfig) {
        if (interpolationConfig === void 0) { interpolationConfig = interpolation_config_1.DEFAULT_INTERPOLATION_CONFIG; }
        return new parser_1.ParseTreeResult(html.visitAll(new I18nMetaVisitor(interpolationConfig, /* keepI18nAttrs */ false), htmlAstWithErrors.rootNodes), htmlAstWithErrors.errors);
    }
    exports.processI18nMeta = processI18nMeta;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9yZW5kZXIzL3ZpZXcvaTE4bi9tZXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7OztJQUVILDREQUFtRDtJQUNuRCwwREFBK0M7SUFDL0Msc0VBQW1FO0lBQ25FLDBEQUErQztJQUMvQyw2RkFBMEc7SUFDMUcsaUVBQTBEO0lBRTFELHFFQUFtSTtJQUVuSSxTQUFTLFdBQVcsQ0FBQyxJQUFrQyxFQUFFLElBQWU7UUFDdEUsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDbkIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSDtRQUdFLHlCQUNZLG1CQUF1RSxFQUN2RSxhQUE4QjtZQUQ5QixvQ0FBQSxFQUFBLHNCQUEyQyxtREFBNEI7WUFDdkUsOEJBQUEsRUFBQSxxQkFBOEI7WUFEOUIsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFvRDtZQUN2RSxrQkFBYSxHQUFiLGFBQWEsQ0FBaUI7WUFDeEMsa0NBQWtDO1lBQ2xDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxzQ0FBd0IsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQzFFLENBQUM7UUFFTyw4Q0FBb0IsR0FBNUIsVUFDSSxLQUFrQixFQUFFLElBQTBCLEVBQzlDLFdBQXdEO1lBRHBDLHFCQUFBLEVBQUEsU0FBMEI7WUFFaEQsSUFBTSxNQUFNLEdBQ1IsT0FBTyxJQUFJLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxvQkFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQywwQkFBbUIsQ0FBQyxJQUFvQixDQUFDLENBQUM7WUFDL0YsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUNuQyxLQUFLLEVBQUUsTUFBTSxDQUFDLE9BQU8sSUFBSSxFQUFFLEVBQUUsTUFBTSxDQUFDLFdBQVcsSUFB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QkFBbUIsQ0FBQyxLQUFLLENBQUMsRUFDbkUsaUJBQWlCLENBQUMsU0FBUyxDQUFDLEVBQ2hDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFSRCwwQ0FRQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtkZWNpbWFsRGlnZXN0fSBmcm9tICcuLi8uLi8uLi9pMThuL2RpZ2VzdCc7XG5pbXBvcnQgKiBhcyBpMThuIGZyb20gJy4uLy4uLy4uL2kxOG4vaTE4bl9hc3QnO1xuaW1wb3J0IHtjcmVhdGVJMThuTWVzc2FnZUZhY3Rvcnl9IGZyb20gJy4uLy4uLy4uL2kxOG4vaTE4bl9wYXJzZXInO1xuaW1wb3J0ICogYXMgaHRtbCBmcm9tICcuLi8uLi8uLi9tbF9wYXJzZXIvYXN0JztcbmltcG9ydCB7REVGQVVMVF9JTlRFUlBPTEFUSU9OX0NPTkZJRywgSW50ZXJwb2xhdGlvbkNvbmZpZ30gZnJvbSAnLi4vLi4vLi4vbWxfcGFyc2VyL2ludGVycG9sYXRpb25fY29uZmlnJztcbmltcG9ydCB7UGFyc2VUcmVlUmVzdWx0fSBmcm9tICcuLi8uLi8uLi9tbF9wYXJzZXIvcGFyc2VyJztcblxuaW1wb3J0IHtJMThOX0FUVFIsIEkxOE5fQVRUUl9QUkVGSVgsIEkxOG5NZXRhLCBoYXNJMThuQXR0cnMsIGljdUZyb21JMThuTWVzc2FnZSwgbWV0YUZyb21JMThuTWVzc2FnZSwgcGFyc2VJMThuTWV0YX0gZnJvbSAnLi91dGlsJztcblxuZnVuY3Rpb24gc2V0STE4blJlZnMoaHRtbDogaHRtbC5Ob2RlICYge2kxOG46IGkxOG4uQVNUfSwgaTE4bjogaTE4bi5Ob2RlKSB7XG4gIGh0bWwuaTE4biA9IGkxOG47XG59XG5cbi8qKlxuICogVGhpcyB2aXNpdG9yIHdhbGtzIG92ZXIgSFRNTCBwYXJzZSB0cmVlIGFuZCBjb252ZXJ0cyBpbmZvcm1hdGlvbiBzdG9yZWQgaW5cbiAqIGkxOG4tcmVsYXRlZCBhdHRyaWJ1dGVzIChcImkxOG5cIiBhbmQgXCJpMThuLSpcIikgaW50byBpMThuIG1ldGEgb2JqZWN0IHRoYXQgaXNcbiAqIHN0b3JlZCB3aXRoIG90aGVyIGVsZW1lbnQncyBhbmQgYXR0cmlidXRlJ3MgaW5mb3JtYXRpb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBJMThuTWV0YVZpc2l0b3IgaW1wbGVtZW50cyBodG1sLlZpc2l0b3Ige1xuICBwcml2YXRlIF9jcmVhdGVJMThuTWVzc2FnZTogYW55O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBpbnRlcnBvbGF0aW9uQ29uZmlnOiBJbnRlcnBvbGF0aW9uQ29uZmlnID0gREVGQVVMVF9JTlRFUlBPTEFUSU9OX0NPTkZJRyxcbiAgICAgIHByaXZhdGUga2VlcEkxOG5BdHRyczogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgLy8gaTE4biBtZXNzYWdlIGdlbmVyYXRpb24gZmFjdG9yeVxuICAgIHRoaXMuX2NyZWF0ZUkxOG5NZXNzYWdlID0gY3JlYXRlSTE4bk1lc3NhZ2VGYWN0b3J5KGludGVycG9sYXRpb25Db25maWcpO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2VuZXJhdGVJMThuTWVzc2FnZShcbiAgICAgIG5vZGVzOiBodG1sLk5vZGVbXSwgbWV0YTogc3RyaW5nfGkxOG4uQVNUID0gJycsXG4gICAgICB2aXNpdE5vZGVGbj86IChodG1sOiBodG1sLk5vZGUsIGkxOG46IGkxOG4uTm9kZSkgPT4gdm9pZCk6IGkxOG4uTWVzc2FnZSB7XG4gICAgY29uc3QgcGFyc2VkOiBJMThuTWV0YSA9XG4gICAgICAgIHR5cGVvZiBtZXRhID09PSAnc3RyaW5nJyA/IHBhcnNlSTE4bk1ldGEobWV0YSkgOiBtZXRhRnJvbUkxOG5NZXNzYWdlKG1ldGEgYXMgaTE4bi5NZXNzYWdlKTtcbiAgICBjb25zdCBtZXNzYWdlID0gdGhpcy5fY3JlYXRlSTE4bk1lc3NhZ2UoXG4gICAgICAgIG5vZGVzLCBwYXJzZWQubWVhbmluZyB8fCAnJywgcGFyc2VkLmRlc2NyaXB0aW9uIHx8ICcnLCBwYXJzZWQuaWQgfHwgJycsIHZpc2l0Tm9kZUZuKTtcbiAgICBpZiAoIW1lc3NhZ2UuaWQpIHtcbiAgICAgIC8vIGdlbmVyYXRlIChvciByZXN0b3JlKSBtZXNzYWdlIGlkIGlmIG5vdCBzcGVjaWZpZWQgaW4gdGVtcGxhdGVcbiAgICAgIG1lc3NhZ2UuaWQgPSB0eXBlb2YgbWV0YSAhPT0gJ3N0cmluZycgJiYgKG1ldGEgYXMgaTE4bi5NZXNzYWdlKS5pZCB8fCBkZWNpbWFsRGlnZXN0KG1lc3NhZ2UpO1xuICAgIH1cbiAgICByZXR1cm4gbWVzc2FnZTtcbiAgfVxuXG4gIHZpc2l0RWxlbWVudChlbGVtZW50OiBodG1sLkVsZW1lbnQsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgaWYgKGhhc0kxOG5BdHRycyhlbGVtZW50KSkge1xuICAgICAgY29uc3QgYXR0cnM6IGh0bWwuQXR0cmlidXRlW10gPSBbXTtcbiAgICAgIGNvbnN0IGF0dHJzTWV0YToge1trZXk6IHN0cmluZ106IHN0cmluZ30gPSB7fTtcblxuICAgICAgZm9yIChjb25zdCBhdHRyIG9mIGVsZW1lbnQuYXR0cnMpIHtcbiAgICAgICAgaWYgKGF0dHIubmFtZSA9PT0gSTE4Tl9BVFRSKSB7XG4gICAgICAgICAgLy8gcm9vdCAnaTE4bicgbm9kZSBhdHRyaWJ1dGVcbiAgICAgICAgICBjb25zdCBpMThuID0gZWxlbWVudC5pMThuIHx8IGF0dHIudmFsdWU7XG4gICAgICAgICAgY29uc3QgbWVzc2FnZSA9IHRoaXMuX2dlbmVyYXRlSTE4bk1lc3NhZ2UoZWxlbWVudC5jaGlsZHJlbiwgaTE4biwgc2V0STE4blJlZnMpO1xuICAgICAgICAgIC8vIGRvIG5vdCBhc3NpZ24gZW1wdHkgaTE4biBtZXRhXG4gICAgICAgICAgaWYgKG1lc3NhZ2Uubm9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBlbGVtZW50LmkxOG4gPSBtZXNzYWdlO1xuICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2UgaWYgKGF0dHIubmFtZS5zdGFydHNXaXRoKEkxOE5fQVRUUl9QUkVGSVgpKSB7XG4gICAgICAgICAgLy8gJ2kxOG4tKicgYXR0cmlidXRlc1xuICAgICAgICAgIGNvbnN0IGtleSA9IGF0dHIubmFtZS5zbGljZShJMThOX0FUVFJfUFJFRklYLmxlbmd0aCk7XG4gICAgICAgICAgYXR0cnNNZXRhW2tleV0gPSBhdHRyLnZhbHVlO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gbm9uLWkxOG4gYXR0cmlidXRlc1xuICAgICAgICAgIGF0dHJzLnB1c2goYXR0cik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gc2V0IGkxOG4gbWV0YSBmb3IgYXR0cmlidXRlc1xuICAgICAgaWYgKE9iamVjdC5rZXlzKGF0dHJzTWV0YSkubGVuZ3RoKSB7XG4gICAgICAgIGZvciAoY29uc3QgYXR0ciBvZiBhdHRycykge1xuICAgICAgICAgIGNvbnN0IG1ldGEgPSBhdHRyc01ldGFbYXR0ci5uYW1lXTtcbiAgICAgICAgICAvLyBkbyBub3QgY3JlYXRlIHRyYW5zbGF0aW9uIGZvciBlbXB0eSBhdHRyaWJ1dGVzXG4gICAgICAgICAgaWYgKG1ldGEgIT09IHVuZGVmaW5lZCAmJiBhdHRyLnZhbHVlKSB7XG4gICAgICAgICAgICBhdHRyLmkxOG4gPSB0aGlzLl9nZW5lcmF0ZUkxOG5NZXNzYWdlKFthdHRyXSwgYXR0ci5pMThuIHx8IG1ldGEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMua2VlcEkxOG5BdHRycykge1xuICAgICAgICAvLyB1cGRhdGUgZWxlbWVudCdzIGF0dHJpYnV0ZXMsXG4gICAgICAgIC8vIGtlZXBpbmcgb25seSBub24taTE4biByZWxhdGVkIG9uZXNcbiAgICAgICAgZWxlbWVudC5hdHRycyA9IGF0dHJzO1xuICAgICAgfVxuICAgIH1cbiAgICBodG1sLnZpc2l0QWxsKHRoaXMsIGVsZW1lbnQuY2hpbGRyZW4pO1xuICAgIHJldHVybiBlbGVtZW50O1xuICB9XG5cbiAgdmlzaXRFeHBhbnNpb24oZXhwYW5zaW9uOiBodG1sLkV4cGFuc2lvbiwgY29udGV4dDogYW55KTogYW55IHtcbiAgICBsZXQgbWVzc2FnZTtcbiAgICBjb25zdCBtZXRhID0gZXhwYW5zaW9uLmkxOG47XG4gICAgaWYgKG1ldGEgaW5zdGFuY2VvZiBpMThuLkljdVBsYWNlaG9sZGVyKSB7XG4gICAgICAvLyBzZXQgSUNVIHBsYWNlaG9sZGVyIG5hbWUgKGUuZy4gXCJJQ1VfMVwiKSxcbiAgICAgIC8vIGdlbmVyYXRlZCB3aGlsZSBwcm9jZXNzaW5nIHJvb3QgZWxlbWVudCBjb250ZW50cyxcbiAgICAgIC8vIHNvIHdlIGNhbiByZWZlcmVuY2UgaXQgd2hlbiB3ZSBvdXRwdXQgdHJhbnNsYXRpb25cbiAgICAgIGNvbnN0IG5hbWUgPSBtZXRhLm5hbWU7XG4gICAgICBtZXNzYWdlID0gdGhpcy5fZ2VuZXJhdGVJMThuTWVzc2FnZShbZXhwYW5zaW9uXSwgbWV0YSk7XG4gICAgICBjb25zdCBpY3UgPSBpY3VGcm9tSTE4bk1lc3NhZ2UobWVzc2FnZSk7XG4gICAgICBpY3UubmFtZSA9IG5hbWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHdoZW4gSUNVIGlzIGEgcm9vdCBsZXZlbCB0cmFuc2xhdGlvblxuICAgICAgbWVzc2FnZSA9IHRoaXMuX2dlbmVyYXRlSTE4bk1lc3NhZ2UoW2V4cGFuc2lvbl0sIG1ldGEpO1xuICAgIH1cbiAgICBleHBhbnNpb24uaTE4biA9IG1lc3NhZ2U7XG4gICAgcmV0dXJuIGV4cGFuc2lvbjtcbiAgfVxuXG4gIHZpc2l0VGV4dCh0ZXh0OiBodG1sLlRleHQsIGNvbnRleHQ6IGFueSk6IGFueSB7IHJldHVybiB0ZXh0OyB9XG4gIHZpc2l0QXR0cmlidXRlKGF0dHJpYnV0ZTogaHRtbC5BdHRyaWJ1dGUsIGNvbnRleHQ6IGFueSk6IGFueSB7IHJldHVybiBhdHRyaWJ1dGU7IH1cbiAgdmlzaXRDb21tZW50KGNvbW1lbnQ6IGh0bWwuQ29tbWVudCwgY29udGV4dDogYW55KTogYW55IHsgcmV0dXJuIGNvbW1lbnQ7IH1cbiAgdmlzaXRFeHBhbnNpb25DYXNlKGV4cGFuc2lvbkNhc2U6IGh0bWwuRXhwYW5zaW9uQ2FzZSwgY29udGV4dDogYW55KTogYW55IHsgcmV0dXJuIGV4cGFuc2lvbkNhc2U7IH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb2Nlc3NJMThuTWV0YShcbiAgICBodG1sQXN0V2l0aEVycm9yczogUGFyc2VUcmVlUmVzdWx0LFxuICAgIGludGVycG9sYXRpb25Db25maWc6IEludGVycG9sYXRpb25Db25maWcgPSBERUZBVUxUX0lOVEVSUE9MQVRJT05fQ09ORklHKTogUGFyc2VUcmVlUmVzdWx0IHtcbiAgcmV0dXJuIG5ldyBQYXJzZVRyZWVSZXN1bHQoXG4gICAgICBodG1sLnZpc2l0QWxsKFxuICAgICAgICAgIG5ldyBJMThuTWV0YVZpc2l0b3IoaW50ZXJwb2xhdGlvbkNvbmZpZywgLyoga2VlcEkxOG5BdHRycyAqLyBmYWxzZSksXG4gICAgICAgICAgaHRtbEFzdFdpdGhFcnJvcnMucm9vdE5vZGVzKSxcbiAgICAgIGh0bWxBc3RXaXRoRXJyb3JzLmVycm9ycyk7XG59Il19