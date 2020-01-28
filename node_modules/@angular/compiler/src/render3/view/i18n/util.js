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
        define("@angular/compiler/src/render3/view/i18n/util", ["require", "exports", "tslib", "@angular/compiler/src/i18n/i18n_ast", "@angular/compiler/src/i18n/serializers/xmb", "@angular/compiler/src/output/map_util", "@angular/compiler/src/output/output_ast", "@angular/compiler/src/render3/r3_identifiers"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var i18n = require("@angular/compiler/src/i18n/i18n_ast");
    var xmb_1 = require("@angular/compiler/src/i18n/serializers/xmb");
    var map_util_1 = require("@angular/compiler/src/output/map_util");
    var o = require("@angular/compiler/src/output/output_ast");
    var r3_identifiers_1 = require("@angular/compiler/src/render3/r3_identifiers");
    /* Closure variables holding messages must be named `MSG_[A-Z0-9]+` */
    var CLOSURE_TRANSLATION_PREFIX = 'MSG_';
    /* Prefix for non-`goog.getMsg` i18n-related vars */
    exports.TRANSLATION_PREFIX = 'I18N_';
    /** Closure uses `goog.getMsg(message)` to lookup translations */
    var GOOG_GET_MSG = 'goog.getMsg';
    /** Name of the global variable that is used to determine if we use Closure translations or not */
    var NG_I18N_CLOSURE_MODE = 'ngI18nClosureMode';
    /** I18n separators for metadata **/
    var I18N_MEANING_SEPARATOR = '|';
    var I18N_ID_SEPARATOR = '@@';
    /** Name of the i18n attributes **/
    exports.I18N_ATTR = 'i18n';
    exports.I18N_ATTR_PREFIX = 'i18n-';
    /** Prefix of var expressions used in ICUs */
    exports.I18N_ICU_VAR_PREFIX = 'VAR_';
    /** Prefix of ICU expressions for post processing */
    exports.I18N_ICU_MAPPING_PREFIX = 'I18N_EXP_';
    /** Placeholder wrapper for i18n expressions **/
    exports.I18N_PLACEHOLDER_SYMBOL = '�';
    function i18nTranslationToDeclStmt(variable, closureVar, message, meta, params) {
        var statements = [];
        // var I18N_X;
        statements.push(new o.DeclareVarStmt(variable.name, undefined, o.INFERRED_TYPE, null, variable.sourceSpan));
        var args = [o.literal(message)];
        if (params && Object.keys(params).length) {
            args.push(map_util_1.mapLiteral(params, true));
        }
        // Closure JSDoc comments
        var docStatements = i18nMetaToDocStmt(meta);
        var thenStatements = docStatements ? [docStatements] : [];
        var googFnCall = o.variable(GOOG_GET_MSG).callFn(args);
        // const MSG_... = goog.getMsg(..);
        thenStatements.push(closureVar.set(googFnCall).toConstDecl());
        // I18N_X = MSG_...;
        thenStatements.push(new o.ExpressionStatement(variable.set(closureVar)));
        var localizeFnCall = o.importExpr(r3_identifiers_1.Identifiers.i18nLocalize).callFn(args);
        // I18N_X = i18nLocalize(...);
        var elseStatements = [new o.ExpressionStatement(variable.set(localizeFnCall))];
        // if(ngI18nClosureMode) { ... } else { ... }
        statements.push(o.ifStmt(o.variable(NG_I18N_CLOSURE_MODE), thenStatements, elseStatements));
        return statements;
    }
    // Converts i18n meta information for a message (id, description, meaning)
    // to a JsDoc statement formatted as expected by the Closure compiler.
    function i18nMetaToDocStmt(meta) {
        var tags = [];
        if (meta.description) {
            tags.push({ tagName: "desc" /* Desc */, text: meta.description });
        }
        if (meta.meaning) {
            tags.push({ tagName: "meaning" /* Meaning */, text: meta.meaning });
        }
        return tags.length == 0 ? null : new o.JSDocCommentStmt(tags);
    }
    function isI18nAttribute(name) {
        return name === exports.I18N_ATTR || name.startsWith(exports.I18N_ATTR_PREFIX);
    }
    exports.isI18nAttribute = isI18nAttribute;
    function isI18nRootNode(meta) {
        return meta instanceof i18n.Message;
    }
    exports.isI18nRootNode = isI18nRootNode;
    function isSingleI18nIcu(meta) {
        return isI18nRootNode(meta) && meta.nodes.length === 1 && meta.nodes[0] instanceof i18n.Icu;
    }
    exports.isSingleI18nIcu = isSingleI18nIcu;
    function hasI18nAttrs(element) {
        return element.attrs.some(function (attr) { return isI18nAttribute(attr.name); });
    }
    exports.hasI18nAttrs = hasI18nAttrs;
    function metaFromI18nMessage(message, id) {
        if (id === void 0) { id = null; }
        return {
            id: typeof id === 'string' ? id : message.id || '',
            meaning: message.meaning || '',
            description: message.description || ''
        };
    }
    exports.metaFromI18nMessage = metaFromI18nMessage;
    function icuFromI18nMessage(message) {
        return message.nodes[0];
    }
    exports.icuFromI18nMessage = icuFromI18nMessage;
    function wrapI18nPlaceholder(content, contextId) {
        if (contextId === void 0) { contextId = 0; }
        var blockId = contextId > 0 ? ":" + contextId : '';
        return "" + exports.I18N_PLACEHOLDER_SYMBOL + content + blockId + exports.I18N_PLACEHOLDER_SYMBOL;
    }
    exports.wrapI18nPlaceholder = wrapI18nPlaceholder;
    function assembleI18nBoundString(strings, bindingStartIndex, contextId) {
        if (bindingStartIndex === void 0) { bindingStartIndex = 0; }
        if (contextId === void 0) { contextId = 0; }
        if (!strings.length)
            return '';
        var acc = '';
        var lastIdx = strings.length - 1;
        for (var i = 0; i < lastIdx; i++) {
            acc += "" + strings[i] + wrapI18nPlaceholder(bindingStartIndex + i, contextId);
        }
        acc += strings[lastIdx];
        return acc;
    }
    exports.assembleI18nBoundString = assembleI18nBoundString;
    function getSeqNumberGenerator(startsAt) {
        if (startsAt === void 0) { startsAt = 0; }
        var current = startsAt;
        return function () { return current++; };
    }
    exports.getSeqNumberGenerator = getSeqNumberGenerator;
    function placeholdersToParams(placeholders) {
        var params = {};
        placeholders.forEach(function (values, key) {
            params[key] = o.literal(values.length > 1 ? "[" + values.join('|') + "]" : values[0]);
        });
        return params;
    }
    exports.placeholdersToParams = placeholdersToParams;
    function updatePlaceholderMap(map, name) {
        var values = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            values[_i - 2] = arguments[_i];
        }
        var current = map.get(name) || [];
        current.push.apply(current, tslib_1.__spread(values));
        map.set(name, current);
    }
    exports.updatePlaceholderMap = updatePlaceholderMap;
    function assembleBoundTextPlaceholders(meta, bindingStartIndex, contextId) {
        if (bindingStartIndex === void 0) { bindingStartIndex = 0; }
        if (contextId === void 0) { contextId = 0; }
        var startIdx = bindingStartIndex;
        var placeholders = new Map();
        var node = meta instanceof i18n.Message ? meta.nodes.find(function (node) { return node instanceof i18n.Container; }) : meta;
        if (node) {
            node
                .children.filter(function (child) { return child instanceof i18n.Placeholder; })
                .forEach(function (child, idx) {
                var content = wrapI18nPlaceholder(startIdx + idx, contextId);
                updatePlaceholderMap(placeholders, child.name, content);
            });
        }
        return placeholders;
    }
    exports.assembleBoundTextPlaceholders = assembleBoundTextPlaceholders;
    function findIndex(items, callback) {
        for (var i = 0; i < items.length; i++) {
            if (callback(items[i])) {
                return i;
            }
        }
        return -1;
    }
    exports.findIndex = findIndex;
    /**
     * Parses i18n metas like:
     *  - "@@id",
     *  - "description[@@id]",
     *  - "meaning|description[@@id]"
     * and returns an object with parsed output.
     *
     * @param meta String that represents i18n meta
     * @returns Object with id, meaning and description fields
     */
    function parseI18nMeta(meta) {
        var _a, _b;
        var id;
        var meaning;
        var description;
        if (meta) {
            var idIndex = meta.indexOf(I18N_ID_SEPARATOR);
            var descIndex = meta.indexOf(I18N_MEANING_SEPARATOR);
            var meaningAndDesc = void 0;
            _a = tslib_1.__read((idIndex > -1) ? [meta.slice(0, idIndex), meta.slice(idIndex + 2)] : [meta, ''], 2), meaningAndDesc = _a[0], id = _a[1];
            _b = tslib_1.__read((descIndex > -1) ?
                [meaningAndDesc.slice(0, descIndex), meaningAndDesc.slice(descIndex + 1)] :
                ['', meaningAndDesc], 2), meaning = _b[0], description = _b[1];
        }
        return { id: id, meaning: meaning, description: description };
    }
    exports.parseI18nMeta = parseI18nMeta;
    /**
     * Converts internal placeholder names to public-facing format
     * (for example to use in goog.getMsg call).
     * Example: `START_TAG_DIV_1` is converted to `startTagDiv_1`.
     *
     * @param name The placeholder name that should be formatted
     * @returns Formatted placeholder name
     */
    function formatI18nPlaceholderName(name) {
        var chunks = xmb_1.toPublicName(name).split('_');
        if (chunks.length === 1) {
            // if no "_" found - just lowercase the value
            return name.toLowerCase();
        }
        var postfix;
        // eject last element if it's a number
        if (/^\d+$/.test(chunks[chunks.length - 1])) {
            postfix = chunks.pop();
        }
        var raw = chunks.shift().toLowerCase();
        if (chunks.length) {
            raw += chunks.map(function (c) { return c.charAt(0).toUpperCase() + c.slice(1).toLowerCase(); }).join('');
        }
        return postfix ? raw + "_" + postfix : raw;
    }
    exports.formatI18nPlaceholderName = formatI18nPlaceholderName;
    /**
     * Generates a prefix for translation const name.
     *
     * @param extra Additional local prefix that should be injected into translation var name
     * @returns Complete translation const prefix
     */
    function getTranslationConstPrefix(extra) {
        return ("" + CLOSURE_TRANSLATION_PREFIX + extra).toUpperCase();
    }
    exports.getTranslationConstPrefix = getTranslationConstPrefix;
    /**
     * Generates translation declaration statements.
     *
     * @param variable Translation value reference
     * @param closureVar Variable for Closure `goog.getMsg` calls
     * @param message Text message to be translated
     * @param meta Object that contains meta information (id, meaning and description)
     * @param params Object with placeholders key-value pairs
     * @param transformFn Optional transformation (post processing) function reference
     * @returns Array of Statements that represent a given translation
     */
    function getTranslationDeclStmts(variable, closureVar, message, meta, params, transformFn) {
        if (params === void 0) { params = {}; }
        var statements = [];
        statements.push.apply(statements, tslib_1.__spread(i18nTranslationToDeclStmt(variable, closureVar, message, meta, params)));
        if (transformFn) {
            statements.push(new o.ExpressionStatement(variable.set(transformFn(variable))));
        }
        return statements;
    }
    exports.getTranslationDeclStmts = getTranslationDeclStmts;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9yZW5kZXIzL3ZpZXcvaTE4bi91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7OztJQUVILDBEQUErQztJQUMvQyxrRUFBMkQ7SUFFM0Qsa0VBQW9EO0lBQ3BELDJEQUFnRDtJQUNoRCwrRUFBdUQ7SUFHdkQsc0VBQXNFO0lBQ3RFLElBQU0sMEJBQTBCLEdBQUcsTUFBTSxDQUFDO0lBRTFDLG9EQUFvRDtJQUN2QyxRQUFBLGtCQUFrQixHQUFHLE9BQU8sQ0FBQztJQUUxQyxpRUFBaUU7SUFDakUsSUFBTSxZQUFZLEdBQUcsYUFBYSxDQUFDO0lBRW5DLGtHQUFrRztJQUNsRyxJQUFNLG9CQUFvQixHQUFHLG1CQUFtQixDQUFDO0lBRWpELG9DQUFvQztJQUNwQyxJQUFNLHNCQUFzQixHQUFHLEdBQUcsQ0FBQztJQUNuQyxJQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQztJQUUvQixtQ0FBbUM7SUFDdEIsUUFBQSxTQUFTLEdBQUcsTUFBTSxDQUFDO0lBQ25CLFFBQUEsZ0JBQWdCLEdBQUcsT0FBTyxDQUFDO0lBRXhDLDZDQUE2QztJQUNoQyxRQUFBLG1CQUFtQixHQUFHLE1BQU0sQ0FBQztJQUUxQyxvREFBb0Q7SUFDdkMsUUFBQSx1QkFBdUIsR0FBRyxXQUFXLENBQUM7SUFFbkQsZ0RBQWdEO0lBQ25DLFFBQUEsdUJBQXVCLEdBQUcsR0FBRyxDQUFDO0lBUTNDLFNBQVMseUJBQXlCLENBQzlCLFFBQXVCLEVBQUUsVUFBeUIsRUFBRSxPQUFlLEVBQUUsSUFBYyxFQUNuRixNQUF1QztRQUN6QyxJQUFNLFVBQVUsR0FBa0IsRUFBRSxDQUFDO1FBQ3JDLGNBQWM7UUFDZCxVQUFVLENBQUMsSUFBSSxDQUNYLElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENB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QUNuQyxRQUF1QixFQUFFLFVBQXlCLEVBQUUsT0FBZSxFQUFFLElBQWMsRUFDbkYsTUFBMkMsRUFDM0MsV0FBa0Q7UUFEbEQsdUJBQUEsRUFBQSxXQUEyQztRQUU3QyxJQUFNLFVBQVUsR0FBa0IsRUFBRSxDQUFDO1FBRXJDLFVBQVUsQ0FBQyxJQUFJLE9BQWYsVUFBVSxtQkFBUyx5QkFBeUIsQ0FBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLEdBQUU7UUFFM0YsSUFBSSxXQUFXLEVBQUU7WUFDZixVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2pGO1FBRUQsT0FBTyxVQUFVLENBQUM7SUFDcEIsQ0FBQztJQWJELDBEQWFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgKiBhcyBpMThuIGZyb20gJy4uLy4uLy4uL2kxOG4vaTE4bl9hc3QnO1xuaW1wb3J0IHt0b1B1YmxpY05hbWV9IGZyb20gJy4uLy4uLy4uL2kxOG4vc2VyaWFsaXplcnMveG1iJztcbmltcG9ydCAqIGFzIGh0bWwgZnJvbSAnLi4vLi4vLi4vbWxfcGFyc2VyL2FzdCc7XG5pbXBvcnQge21hcExpdGVyYWx9IGZyb20gJy4uLy4uLy4uL291dHB1dC9tYXBfdXRpbCc7XG5pbXBvcnQgKiBhcyBvIGZyb20gJy4uLy4uLy4uL291dHB1dC9vdXRwdXRfYXN0JztcbmltcG9ydCB7SWRlbnRpZmllcnMgYXMgUjN9IGZyb20gJy4uLy4uL3IzX2lkZW50aWZpZXJzJztcblxuXG4vKiBDbG9zdXJlIHZhcmlhYmxlcyBob2xkaW5nIG1lc3NhZ2VzIG11c3QgYmUgbmFtZWQgYE1TR19bQS1aMC05XStgICovXG5jb25zdCBDTE9TVVJFX1RSQU5TTEFUSU9OX1BSRUZJWCA9ICdNU0dfJztcblxuLyogUHJlZml4IGZvciBub24tYGdvb2cuZ2V0TXNnYCBpMThuLXJlbGF0ZWQgdmFycyAqL1xuZXhwb3J0IGNvbnN0IFRSQU5TTEFUSU9OX1BSRUZJWCA9ICdJMThOXyc7XG5cbi8qKiBDbG9zdXJlIHVzZXMgYGdvb2cuZ2V0TXNnKG1lc3NhZ2UpYCB0byBsb29rdXAgdHJhbnNsYXRpb25zICovXG5jb25zdCBHT09HX0dFVF9NU0cgPSAnZ29vZy5nZXRNc2cnO1xuXG4vKiogTmFtZSBvZiB0aGUgZ2xvYmFsIHZhcmlhYmxlIHRoYXQgaXMgdXNlZCB0byBkZXRlcm1pbmUgaWYgd2UgdXNlIENsb3N1cmUgdHJhbnNsYXRpb25zIG9yIG5vdCAqL1xuY29uc3QgTkdfSTE4Tl9DTE9TVVJFX01PREUgPSAnbmdJMThuQ2xvc3VyZU1vZGUnO1xuXG4vKiogSTE4biBzZXBhcmF0b3JzIGZvciBtZXRhZGF0YSAqKi9cbmNvbnN0IEkxOE5fTUVBTklOR19TRVBBUkFUT1IgPSAnfCc7XG5jb25zdCBJMThOX0lEX1NFUEFSQVRPUiA9ICdAQCc7XG5cbi8qKiBOYW1lIG9mIHRoZSBpMThuIGF0dHJpYnV0ZXMgKiovXG5leHBvcnQgY29uc3QgSTE4Tl9BVFRSID0gJ2kxOG4nO1xuZXhwb3J0IGNvbnN0IEkxOE5fQVRUUl9QUkVGSVggPSAnaTE4bi0nO1xuXG4vKiogUHJlZml4IG9mIHZhciBleHByZXNzaW9ucyB1c2VkIGluIElDVXMgKi9cbmV4cG9ydCBjb25zdCBJMThOX0lDVV9WQVJfUFJFRklYID0gJ1ZBUl8nO1xuXG4vKiogUHJlZml4IG9mIElDVSBleHByZXNzaW9ucyBmb3IgcG9zdCBwcm9jZXNzaW5nICovXG5leHBvcnQgY29uc3QgSTE4Tl9JQ1VfTUFQUElOR19QUkVGSVggPSAnSTE4Tl9FWFBfJztcblxuLyoqIFBsYWNlaG9sZGVyIHdyYXBwZXIgZm9yIGkxOG4gZXhwcmVzc2lvbnMgKiovXG5leHBvcnQgY29uc3QgSTE4Tl9QTEFDRUhPTERFUl9TWU1CT0wgPSAn77+9JztcblxuZXhwb3J0IHR5cGUgSTE4bk1ldGEgPSB7XG4gIGlkPzogc3RyaW5nLFxuICBkZXNjcmlwdGlvbj86IHN0cmluZyxcbiAgbWVhbmluZz86IHN0cmluZ1xufTtcblxuZnVuY3Rpb24gaTE4blRyYW5zbGF0aW9uVG9EZWNsU3RtdChcbiAgICB2YXJpYWJsZTogby5SZWFkVmFyRXhwciwgY2xvc3VyZVZhcjogby5SZWFkVmFyRXhwciwgbWVzc2FnZTogc3RyaW5nLCBtZXRhOiBJMThuTWV0YSxcbiAgICBwYXJhbXM/OiB7W25hbWU6IHN0cmluZ106IG8uRXhwcmVzc2lvbn0pOiBvLlN0YXRlbWVudFtdIHtcbiAgY29uc3Qgc3RhdGVtZW50czogby5TdGF0ZW1lbnRbXSA9IFtdO1xuICAvLyB2YXIgSTE4Tl9YO1xuICBzdGF0ZW1lbnRzLnB1c2goXG4gICAgICBuZXcgby5EZWNsYXJlVmFyU3RtdCh2YXJpYWJsZS5uYW1lICEsIHVuZGVmaW5lZCwgby5JTkZFUlJFRF9UWVBFLCBudWxsLCB2YXJpYWJsZS5zb3VyY2VTcGFuKSk7XG5cbiAgY29uc3QgYXJncyA9IFtvLmxpdGVyYWwobWVzc2FnZSkgYXMgby5FeHByZXNzaW9uXTtcbiAgaWYgKHBhcmFtcyAmJiBPYmplY3Qua2V5cyhwYXJhbXMpLmxlbmd0aCkge1xuICAgIGFyZ3MucHVzaChtYXBMaXRlcmFsKHBhcmFtcywgdHJ1ZSkpO1xuICB9XG5cbiAgLy8gQ2xvc3VyZSBKU0RvYyBjb21tZW50c1xuICBjb25zdCBkb2NTdGF0ZW1lbnRzID0gaTE4bk1ldGFUb0RvY1N0bXQobWV0YSk7XG4gIGNvbnN0IHRoZW5TdGF0ZW1lbnRzOiBvLlN0YXRlbWVudFtdID0gZG9jU3RhdGVtZW50cyA/IFtkb2NTdGF0ZW1lbnRzXSA6IFtdO1xuICBjb25zdCBnb29nRm5DYWxsID0gby52YXJpYWJsZShHT09HX0dFVF9NU0cpLmNhbGxGbihhcmdzKTtcbiAgLy8gY29uc3QgTVNHXy4uLiA9IGdvb2cuZ2V0TXNnKC4uKTtcbiAgdGhlblN0YXRlbWVudHMucHVzaChjbG9zdXJlVmFyLnNldChnb29nRm5DYWxsKS50b0NvbnN0RGVjbCgpKTtcbiAgLy8gSTE4Tl9YID0gTVNHXy4uLjtcbiAgdGhlblN0YXRlbWVudHMucHVzaChuZXcgby5FeHByZXNzaW9uU3RhdGVtZW50KHZhcmlhYmxlLnNldChjbG9zdXJlVmFyKSkpO1xuICBjb25zdCBsb2NhbGl6ZUZuQ2FsbCA9IG8uaW1wb3J0RXhwcihSMy5pMThuTG9jYWxpemUpLmNhbGxGbihhcmdzKTtcbiAgLy8gSTE4Tl9YID0gaTE4bkxvY2FsaXplKC4uLik7XG4gIGNvbnN0IGVsc2VTdGF0ZW1lbnRzID0gW25ldyBvLkV4cHJlc3Npb25TdGF0ZW1lbnQodmFyaWFibGUuc2V0KGxvY2FsaXplRm5DYWxsKSldO1xuICAvLyBpZihuZ0kxOG5DbG9zdXJlTW9kZSkgeyAuLi4gfSBlbHNlIHsgLi4uIH1cbiAgc3RhdGVtZW50cy5wdXNoKG8uaWZTdG10KG8udmFyaWFibGUoTkdfSTE4Tl9DTE9TVVJFX01PREUpLCB0aGVuU3RhdGVtZW50cywgZWxzZVN0YXRlbWVudHMpKTtcblxuICByZXR1cm4gc3RhdGVtZW50cztcbn1cblxuLy8gQ29udmVydHMgaTE4biBtZXRhIGluZm9ybWF0aW9uIGZvciBhIG1lc3NhZ2UgKGlkLCBkZXNjcmlwdGlvbiwgbWVhbmluZylcbi8vIHRvIGEgSnNEb2Mgc3RhdGVtZW50IGZvcm1hdHRlZCBhcyBleHBlY3RlZCBieSB0aGUgQ2xvc3VyZSBjb21waWxlci5cbmZ1bmN0aW9uIGkxOG5NZXRhVG9Eb2NTdG10KG1ldGE6IEkxOG5NZXRhKTogby5KU0RvY0NvbW1lbnRTdG10fG51bGwge1xuICBjb25zdCB0YWdzOiBvLkpTRG9jVGFnW10gPSBbXTtcbiAgaWYgKG1ldGEuZGVzY3JpcHRpb24pIHtcbiAgICB0YWdzLnB1c2goe3RhZ05hbWU6IG8uSlNEb2NUYWdOYW1lLkRlc2MsIHRleHQ6IG1ldGEuZGVzY3JpcHRpb259KTtcbiAgfVxuICBpZiAobWV0YS5tZWFuaW5nKSB7XG4gICAgdGFncy5wdXNoKHt0YWdOYW1lOiBvLkpTRG9jVGFnTmFtZS5NZWFuaW5nLCB0ZXh0OiBtZXRhLm1lYW5pbmd9KTtcbiAgfVxuICByZXR1cm4gdGFncy5sZW5ndGggPT0gMCA/IG51bGwgOiBuZXcgby5KU0RvY0NvbW1lbnRTdG10KHRhZ3MpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNJMThuQXR0cmlidXRlKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gbmFtZSA9PT0gSTE4Tl9BVFRSIHx8IG5hbWUuc3RhcnRzV2l0aChJMThOX0FUVFJfUFJFRklYKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzSTE4blJvb3ROb2RlKG1ldGE/OiBpMThuLkFTVCk6IG1ldGEgaXMgaTE4bi5NZXNzYWdlIHtcbiAgcmV0dXJuIG1ldGEgaW5zdGFuY2VvZiBpMThuLk1lc3NhZ2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1NpbmdsZUkxOG5JY3UobWV0YT86IGkxOG4uQVNUKTogYm9vbGVhbiB7XG4gIHJldHVybiBpc0kxOG5Sb290Tm9kZShtZXRhKSAmJiBtZXRhLm5vZGVzLmxlbmd0aCA9PT0gMSAmJiBtZXRhLm5vZGVzWzBdIGluc3RhbmNlb2YgaTE4bi5JY3U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNJMThuQXR0cnMoZWxlbWVudDogaHRtbC5FbGVtZW50KTogYm9vbGVhbiB7XG4gIHJldHVybiBlbGVtZW50LmF0dHJzLnNvbWUoKGF0dHI6IGh0bWwuQXR0cmlidXRlKSA9PiBpc0kxOG5BdHRyaWJ1dGUoYXR0ci5uYW1lKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXRhRnJvbUkxOG5NZXNzYWdlKG1lc3NhZ2U6IGkxOG4uTWVzc2FnZSwgaWQ6IHN0cmluZyB8IG51bGwgPSBudWxsKTogSTE4bk1ldGEge1xuICByZXR1cm4ge1xuICAgIGlkOiB0eXBlb2YgaWQgPT09ICdzdHJpbmcnID8gaWQgOiBtZXNzYWdlLmlkIHx8ICcnLFxuICAgIG1lYW5pbmc6IG1lc3NhZ2UubWVhbmluZyB8fCAnJyxcbiAgICBkZXNjcmlwdGlvbjogbWVzc2FnZS5kZXNjcmlwdGlvbiB8fCAnJ1xuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaWN1RnJvbUkxOG5NZXNzYWdlKG1lc3NhZ2U6IGkxOG4uTWVzc2FnZSkge1xuICByZXR1cm4gbWVzc2FnZS5ub2Rlc1swXSBhcyBpMThuLkljdVBsYWNlaG9sZGVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gd3JhcEkxOG5QbGFjZWhvbGRlcihjb250ZW50OiBzdHJpbmcgfCBudW1iZXIsIGNvbnRleHRJZDogbnVtYmVyID0gMCk6IHN0cmluZyB7XG4gIGNvbnN0IGJsb2NrSWQgPSBjb250ZXh0SWQgPiAwID8gYDoke2NvbnRleHRJZH1gIDogJyc7XG4gIHJldHVybiBgJHtJMThOX1BMQUNFSE9MREVSX1NZTUJPTH0ke2NvbnRlbnR9JHtibG9ja0lkfSR7STE4Tl9QTEFDRUhPTERFUl9TWU1CT0x9YDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VtYmxlSTE4bkJvdW5kU3RyaW5nKFxuICAgIHN0cmluZ3M6IHN0cmluZ1tdLCBiaW5kaW5nU3RhcnRJbmRleDogbnVtYmVyID0gMCwgY29udGV4dElkOiBudW1iZXIgPSAwKTogc3RyaW5nIHtcbiAgaWYgKCFzdHJpbmdzLmxlbmd0aCkgcmV0dXJuICcnO1xuICBsZXQgYWNjID0gJyc7XG4gIGNvbnN0IGxhc3RJZHggPSBzdHJpbmdzLmxlbmd0aCAtIDE7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGFzdElkeDsgaSsrKSB7XG4gICAgYWNjICs9IGAke3N0cmluZ3NbaV19JHt3cmFwSTE4blBsYWNlaG9sZGVyKGJpbmRpbmdTdGFydEluZGV4ICsgaSwgY29udGV4dElkKX1gO1xuICB9XG4gIGFjYyArPSBzdHJpbmdzW2xhc3RJZHhdO1xuICByZXR1cm4gYWNjO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2VxTnVtYmVyR2VuZXJhdG9yKHN0YXJ0c0F0OiBudW1iZXIgPSAwKTogKCkgPT4gbnVtYmVyIHtcbiAgbGV0IGN1cnJlbnQgPSBzdGFydHNBdDtcbiAgcmV0dXJuICgpID0+IGN1cnJlbnQrKztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBsYWNlaG9sZGVyc1RvUGFyYW1zKHBsYWNlaG9sZGVyczogTWFwPHN0cmluZywgc3RyaW5nW10+KTpcbiAgICB7W25hbWU6IHN0cmluZ106IG8uRXhwcmVzc2lvbn0ge1xuICBjb25zdCBwYXJhbXM6IHtbbmFtZTogc3RyaW5nXTogby5FeHByZXNzaW9ufSA9IHt9O1xuICBwbGFjZWhvbGRlcnMuZm9yRWFjaCgodmFsdWVzOiBzdHJpbmdbXSwga2V5OiBzdHJpbmcpID0+IHtcbiAgICBwYXJhbXNba2V5XSA9IG8ubGl0ZXJhbCh2YWx1ZXMubGVuZ3RoID4gMSA/IGBbJHt2YWx1ZXMuam9pbignfCcpfV1gIDogdmFsdWVzWzBdKTtcbiAgfSk7XG4gIHJldHVybiBwYXJhbXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVQbGFjZWhvbGRlck1hcChtYXA6IE1hcDxzdHJpbmcsIGFueVtdPiwgbmFtZTogc3RyaW5nLCAuLi52YWx1ZXM6IGFueVtdKSB7XG4gIGNvbnN0IGN1cnJlbnQgPSBtYXAuZ2V0KG5hbWUpIHx8IFtdO1xuICBjdXJyZW50LnB1c2goLi4udmFsdWVzKTtcbiAgbWFwLnNldChuYW1lLCBjdXJyZW50KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VtYmxlQm91bmRUZXh0UGxhY2Vob2xkZXJzKFxuICAgIG1ldGE6IGkxOG4uQVNULCBiaW5kaW5nU3RhcnRJbmRleDogbnVtYmVyID0gMCwgY29udGV4dElkOiBudW1iZXIgPSAwKTogTWFwPHN0cmluZywgYW55W10+IHtcbiAgY29uc3Qgc3RhcnRJZHggPSBiaW5kaW5nU3RhcnRJbmRleDtcbiAgY29uc3QgcGxhY2Vob2xkZXJzID0gbmV3IE1hcDxzdHJpbmcsIGFueT4oKTtcbiAgY29uc3Qgbm9kZSA9XG4gICAgICBtZXRhIGluc3RhbmNlb2YgaTE4bi5NZXNzYWdlID8gbWV0YS5ub2Rlcy5maW5kKG5vZGUgPT4gbm9kZSBpbnN0YW5jZW9mIGkxOG4uQ29udGFpbmVyKSA6IG1ldGE7XG4gIGlmIChub2RlKSB7XG4gICAgKG5vZGUgYXMgaTE4bi5Db250YWluZXIpXG4gICAgICAgIC5jaGlsZHJlbi5maWx0ZXIoKGNoaWxkOiBpMThuLk5vZGUpID0+IGNoaWxkIGluc3RhbmNlb2YgaTE4bi5QbGFjZWhvbGRlcilcbiAgICAgICAgLmZvckVhY2goKGNoaWxkOiBpMThuLlBsYWNlaG9sZGVyLCBpZHg6IG51bWJlcikgPT4ge1xuICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSB3cmFwSTE4blBsYWNlaG9sZGVyKHN0YXJ0SWR4ICsgaWR4LCBjb250ZXh0SWQpO1xuICAgICAgICAgIHVwZGF0ZVBsYWNlaG9sZGVyTWFwKHBsYWNlaG9sZGVycywgY2hpbGQubmFtZSwgY29udGVudCk7XG4gICAgICAgIH0pO1xuICB9XG4gIHJldHVybiBwbGFjZWhvbGRlcnM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kSW5kZXgoaXRlbXM6IGFueVtdLCBjYWxsYmFjazogKGl0ZW06IGFueSkgPT4gYm9vbGVhbik6IG51bWJlciB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoY2FsbGJhY2soaXRlbXNbaV0pKSB7XG4gICAgICByZXR1cm4gaTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG4vKipcbiAqIFBhcnNlcyBpMThuIG1ldGFzIGxpa2U6XG4gKiAgLSBcIkBAaWRcIixcbiAqICAtIFwiZGVzY3JpcHRpb25bQEBpZF1cIixcbiAqICAtIFwibWVhbmluZ3xkZXNjcmlwdGlvbltAQGlkXVwiXG4gKiBhbmQgcmV0dXJucyBhbiBvYmplY3Qgd2l0aCBwYXJzZWQgb3V0cHV0LlxuICpcbiAqIEBwYXJhbSBtZXRhIFN0cmluZyB0aGF0IHJlcHJlc2VudHMgaTE4biBtZXRhXG4gKiBAcmV0dXJucyBPYmplY3Qgd2l0aCBpZCwgbWVhbmluZyBhbmQgZGVzY3JpcHRpb24gZmllbGRzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUkxOG5NZXRhKG1ldGE/OiBzdHJpbmcpOiBJMThuTWV0YSB7XG4gIGxldCBpZDogc3RyaW5nfHVuZGVmaW5lZDtcbiAgbGV0IG1lYW5pbmc6IHN0cmluZ3x1bmRlZmluZWQ7XG4gIGxldCBkZXNjcmlwdGlvbjogc3RyaW5nfHVuZGVmaW5lZDtcblxuICBpZiAobWV0YSkge1xuICAgIGNvbnN0IGlkSW5kZXggPSBtZXRhLmluZGV4T2YoSTE4Tl9JRF9TRVBBUkFUT1IpO1xuICAgIGNvbnN0IGRlc2NJbmRleCA9IG1ldGEuaW5kZXhPZihJMThOX01FQU5JTkdfU0VQQVJBVE9SKTtcbiAgICBsZXQgbWVhbmluZ0FuZERlc2M6IHN0cmluZztcbiAgICBbbWVhbmluZ0FuZERlc2MsIGlkXSA9XG4gICAgICAgIChpZEluZGV4ID4gLTEpID8gW21ldGEuc2xpY2UoMCwgaWRJbmRleCksIG1ldGEuc2xpY2UoaWRJbmRleCArIDIpXSA6IFttZXRhLCAnJ107XG4gICAgW21lYW5pbmcsIGRlc2NyaXB0aW9uXSA9IChkZXNjSW5kZXggPiAtMSkgP1xuICAgICAgICBbbWVhbmluZ0FuZERlc2Muc2xpY2UoMCwgZGVzY0luZGV4KSwgbWVhbmluZ0FuZERlc2Muc2xpY2UoZGVzY0luZGV4ICsgMSldIDpcbiAgICAgICAgWycnLCBtZWFuaW5nQW5kRGVzY107XG4gIH1cblxuICByZXR1cm4ge2lkLCBtZWFuaW5nLCBkZXNjcmlwdGlvbn07XG59XG5cbi8qKlxuICogQ29udmVydHMgaW50ZXJuYWwgcGxhY2Vob2xkZXIgbmFtZXMgdG8gcHVibGljLWZhY2luZyBmb3JtYXRcbiAqIChmb3IgZXhhbXBsZSB0byB1c2UgaW4gZ29vZy5nZXRNc2cgY2FsbCkuXG4gKiBFeGFtcGxlOiBgU1RBUlRfVEFHX0RJVl8xYCBpcyBjb252ZXJ0ZWQgdG8gYHN0YXJ0VGFnRGl2XzFgLlxuICpcbiAqIEBwYXJhbSBuYW1lIFRoZSBwbGFjZWhvbGRlciBuYW1lIHRoYXQgc2hvdWxkIGJlIGZvcm1hdHRlZFxuICogQHJldHVybnMgRm9ybWF0dGVkIHBsYWNlaG9sZGVyIG5hbWVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdEkxOG5QbGFjZWhvbGRlck5hbWUobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgY2h1bmtzID0gdG9QdWJsaWNOYW1lKG5hbWUpLnNwbGl0KCdfJyk7XG4gIGlmIChjaHVua3MubGVuZ3RoID09PSAxKSB7XG4gICAgLy8gaWYgbm8gXCJfXCIgZm91bmQgLSBqdXN0IGxvd2VyY2FzZSB0aGUgdmFsdWVcbiAgICByZXR1cm4gbmFtZS50b0xvd2VyQ2FzZSgpO1xuICB9XG4gIGxldCBwb3N0Zml4O1xuICAvLyBlamVjdCBsYXN0IGVsZW1lbnQgaWYgaXQncyBhIG51bWJlclxuICBpZiAoL15cXGQrJC8udGVzdChjaHVua3NbY2h1bmtzLmxlbmd0aCAtIDFdKSkge1xuICAgIHBvc3RmaXggPSBjaHVua3MucG9wKCk7XG4gIH1cbiAgbGV0IHJhdyA9IGNodW5rcy5zaGlmdCgpICEudG9Mb3dlckNhc2UoKTtcbiAgaWYgKGNodW5rcy5sZW5ndGgpIHtcbiAgICByYXcgKz0gY2h1bmtzLm1hcChjID0+IGMuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBjLnNsaWNlKDEpLnRvTG93ZXJDYXNlKCkpLmpvaW4oJycpO1xuICB9XG4gIHJldHVybiBwb3N0Zml4ID8gYCR7cmF3fV8ke3Bvc3RmaXh9YCA6IHJhdztcbn1cblxuLyoqXG4gKiBHZW5lcmF0ZXMgYSBwcmVmaXggZm9yIHRyYW5zbGF0aW9uIGNvbnN0IG5hbWUuXG4gKlxuICogQHBhcmFtIGV4dHJhIEFkZGl0aW9uYWwgbG9jYWwgcHJlZml4IHRoYXQgc2hvdWxkIGJlIGluamVjdGVkIGludG8gdHJhbnNsYXRpb24gdmFyIG5hbWVcbiAqIEByZXR1cm5zIENvbXBsZXRlIHRyYW5zbGF0aW9uIGNvbnN0IHByZWZpeFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0VHJhbnNsYXRpb25Db25zdFByZWZpeChleHRyYTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIGAke0NMT1NVUkVfVFJBTlNMQVRJT05fUFJFRklYfSR7ZXh0cmF9YC50b1VwcGVyQ2FzZSgpO1xufVxuXG4vKipcbiAqIEdlbmVyYXRlcyB0cmFuc2xhdGlvbiBkZWNsYXJhdGlvbiBzdGF0ZW1lbnRzLlxuICpcbiAqIEBwYXJhbSB2YXJpYWJsZSBUcmFuc2xhdGlvbiB2YWx1ZSByZWZlcmVuY2VcbiAqIEBwYXJhbSBjbG9zdXJlVmFyIFZhcmlhYmxlIGZvciBDbG9zdXJlIGBnb29nLmdldE1zZ2AgY2FsbHNcbiAqIEBwYXJhbSBtZXNzYWdlIFRleHQgbWVzc2FnZSB0byBiZSB0cmFuc2xhdGVkXG4gKiBAcGFyYW0gbWV0YSBPYmplY3QgdGhhdCBjb250YWlucyBtZXRhIGluZm9ybWF0aW9uIChpZCwgbWVhbmluZyBhbmQgZGVzY3JpcHRpb24pXG4gKiBAcGFyYW0gcGFyYW1zIE9iamVjdCB3aXRoIHBsYWNlaG9sZGVycyBrZXktdmFsdWUgcGFpcnNcbiAqIEBwYXJhbSB0cmFuc2Zvcm1GbiBPcHRpb25hbCB0cmFuc2Zvcm1hdGlvbiAocG9zdCBwcm9jZXNzaW5nKSBmdW5jdGlvbiByZWZlcmVuY2VcbiAqIEByZXR1cm5zIEFycmF5IG9mIFN0YXRlbWVudHMgdGhhdCByZXByZXNlbnQgYSBnaXZlbiB0cmFuc2xhdGlvblxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0VHJhbnNsYXRpb25EZWNsU3RtdHMoXG4gICAgdmFyaWFibGU6IG8uUmVhZFZhckV4cHIsIGNsb3N1cmVWYXI6IG8uUmVhZFZhckV4cHIsIG1lc3NhZ2U6IHN0cmluZywgbWV0YTogSTE4bk1ldGEsXG4gICAgcGFyYW1zOiB7W25hbWU6IHN0cmluZ106IG8uRXhwcmVzc2lvbn0gPSB7fSxcbiAgICB0cmFuc2Zvcm1Gbj86IChyYXc6IG8uUmVhZFZhckV4cHIpID0+IG8uRXhwcmVzc2lvbik6IG8uU3RhdGVtZW50W10ge1xuICBjb25zdCBzdGF0ZW1lbnRzOiBvLlN0YXRlbWVudFtdID0gW107XG5cbiAgc3RhdGVtZW50cy5wdXNoKC4uLmkxOG5UcmFuc2xhdGlvblRvRGVjbFN0bXQodmFyaWFibGUsIGNsb3N1cmVWYXIsIG1lc3NhZ2UsIG1ldGEsIHBhcmFtcykpO1xuXG4gIGlmICh0cmFuc2Zvcm1Gbikge1xuICAgIHN0YXRlbWVudHMucHVzaChuZXcgby5FeHByZXNzaW9uU3RhdGVtZW50KHZhcmlhYmxlLnNldCh0cmFuc2Zvcm1Gbih2YXJpYWJsZSkpKSk7XG4gIH1cblxuICByZXR1cm4gc3RhdGVtZW50cztcbn1cbiJdfQ==