/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { assembleBoundTextPlaceholders, findIndex, getSeqNumberGenerator, updatePlaceholderMap, wrapI18nPlaceholder } from './util';
var TagType;
(function (TagType) {
    TagType[TagType["ELEMENT"] = 0] = "ELEMENT";
    TagType[TagType["TEMPLATE"] = 1] = "TEMPLATE";
})(TagType || (TagType = {}));
/**
 * Generates an object that is used as a shared state between parent and all child contexts.
 */
function setupRegistry() {
    return { getUniqueId: getSeqNumberGenerator(), icus: new Map() };
}
/**
 * I18nContext is a helper class which keeps track of all i18n-related aspects
 * (accumulates placeholders, bindings, etc) between i18nStart and i18nEnd instructions.
 *
 * When we enter a nested template, the top-level context is being passed down
 * to the nested component, which uses this context to generate a child instance
 * of I18nContext class (to handle nested template) and at the end, reconciles it back
 * with the parent context.
 *
 * @param index Instruction index of i18nStart, which initiates this context
 * @param ref Reference to a translation const that represents the content if thus context
 * @param level Nestng level defined for child contexts
 * @param templateIndex Instruction index of a template which this context belongs to
 * @param meta Meta information (id, meaning, description, etc) associated with this context
 */
export class I18nContext {
    constructor(index, ref, level = 0, templateIndex = null, meta, registry) {
        this.index = index;
        this.ref = ref;
        this.level = level;
        this.templateIndex = templateIndex;
        this.meta = meta;
        this.registry = registry;
        this.bindings = new Set();
        this.placeholders = new Map();
        this.isEmitted = false;
        this._unresolvedCtxCount = 0;
        this._registry = registry || setupRegistry();
        this.id = this._registry.getUniqueId();
    }
    appendTag(type, node, index, closed) {
        if (node.isVoid && closed) {
            return; // ignore "close" for void tags
        }
        const ph = node.isVoid || !closed ? node.startName : node.closeName;
        const content = { type, index, ctx: this.id, isVoid: node.isVoid, closed };
        updatePlaceholderMap(this.placeholders, ph, content);
    }
    get icus() { return this._registry.icus; }
    get isRoot() { return this.level === 0; }
    get isResolved() { return this._unresolvedCtxCount === 0; }
    getSerializedPlaceholders() {
        const result = new Map();
        this.placeholders.forEach((values, key) => result.set(key, values.map(serializePlaceholderValue)));
        return result;
    }
    // public API to accumulate i18n-related content
    appendBinding(binding) { this.bindings.add(binding); }
    appendIcu(name, ref) {
        updatePlaceholderMap(this._registry.icus, name, ref);
    }
    appendBoundText(node) {
        const phs = assembleBoundTextPlaceholders(node, this.bindings.size, this.id);
        phs.forEach((values, key) => updatePlaceholderMap(this.placeholders, key, ...values));
    }
    appendTemplate(node, index) {
        // add open and close tags at the same time,
        // since we process nested templates separately
        this.appendTag(TagType.TEMPLATE, node, index, false);
        this.appendTag(TagType.TEMPLATE, node, index, true);
        this._unresolvedCtxCount++;
    }
    appendElement(node, index, closed) {
        this.appendTag(TagType.ELEMENT, node, index, closed);
    }
    /**
     * Generates an instance of a child context based on the root one,
     * when we enter a nested template within I18n section.
     *
     * @param index Instruction index of corresponding i18nStart, which initiates this context
     * @param templateIndex Instruction index of a template which this context belongs to
     * @param meta Meta information (id, meaning, description, etc) associated with this context
     *
     * @returns I18nContext instance
     */
    forkChildContext(index, templateIndex, meta) {
        return new I18nContext(index, this.ref, this.level + 1, templateIndex, meta, this._registry);
    }
    /**
     * Reconciles child context into parent one once the end of the i18n block is reached (i18nEnd).
     *
     * @param context Child I18nContext instance to be reconciled with parent context.
     */
    reconcileChildContext(context) {
        // set the right context id for open and close
        // template tags, so we can use it as sub-block ids
        ['start', 'close'].forEach((op) => {
            const key = context.meta[`${op}Name`];
            const phs = this.placeholders.get(key) || [];
            const tag = phs.find(findTemplateFn(this.id, context.templateIndex));
            if (tag) {
                tag.ctx = context.id;
            }
        });
        // reconcile placeholders
        const childPhs = context.placeholders;
        childPhs.forEach((values, key) => {
            const phs = this.placeholders.get(key);
            if (!phs) {
                this.placeholders.set(key, values);
                return;
            }
            // try to find matching template...
            const tmplIdx = findIndex(phs, findTemplateFn(context.id, context.templateIndex));
            if (tmplIdx >= 0) {
                // ... if found - replace it with nested template content
                const isCloseTag = key.startsWith('CLOSE');
                const isTemplateTag = key.endsWith('NG-TEMPLATE');
                if (isTemplateTag) {
                    // current template's content is placed before or after
                    // parent template tag, depending on the open/close atrribute
                    phs.splice(tmplIdx + (isCloseTag ? 0 : 1), 0, ...values);
                }
                else {
                    const idx = isCloseTag ? values.length - 1 : 0;
                    values[idx].tmpl = phs[tmplIdx];
                    phs.splice(tmplIdx, 1, ...values);
                }
            }
            else {
                // ... otherwise just append content to placeholder value
                phs.push(...values);
            }
            this.placeholders.set(key, phs);
        });
        this._unresolvedCtxCount--;
    }
}
//
// Helper methods
//
function wrap(symbol, index, contextId, closed) {
    const state = closed ? '/' : '';
    return wrapI18nPlaceholder(`${state}${symbol}${index}`, contextId);
}
function wrapTag(symbol, { index, ctx, isVoid }, closed) {
    return isVoid ? wrap(symbol, index, ctx) + wrap(symbol, index, ctx, true) :
        wrap(symbol, index, ctx, closed);
}
function findTemplateFn(ctx, templateIndex) {
    return (token) => typeof token === 'object' && token.type === TagType.TEMPLATE &&
        token.index === templateIndex && token.ctx === ctx;
}
function serializePlaceholderValue(value) {
    const element = (data, closed) => wrapTag('#', data, closed);
    const template = (data, closed) => wrapTag('*', data, closed);
    switch (value.type) {
        case TagType.ELEMENT:
            // close element tag
            if (value.closed) {
                return element(value, true) + (value.tmpl ? template(value.tmpl, true) : '');
            }
            // open element tag that also initiates a template
            if (value.tmpl) {
                return template(value.tmpl) + element(value) +
                    (value.isVoid ? template(value.tmpl, true) : '');
            }
            return element(value);
        case TagType.TEMPLATE:
            return template(value, value.closed);
        default:
            return value;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9yZW5kZXIzL3ZpZXcvaTE4bi9jb250ZXh0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQU1ILE9BQU8sRUFBQyw2QkFBNkIsRUFBRSxTQUFTLEVBQUUscUJBQXFCLEVBQUUsb0JBQW9CLEVBQUUsbUJBQW1CLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFFbEksSUFBSyxPQUdKO0FBSEQsV0FBSyxPQUFPO0lBQ1YsMkNBQU8sQ0FBQTtJQUNQLDZDQUFRLENBQUE7QUFDVixDQUFDLEVBSEksT0FBTyxLQUFQLE9BQU8sUUFHWDtBQUVEOztHQUVHO0FBQ0gsU0FBUyxhQUFhO0lBQ3BCLE9BQU8sRUFBQyxXQUFXLEVBQUUscUJBQXFCLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxHQUFHLEVBQWlCLEVBQUMsQ0FBQztBQUNoRixDQUFDO0FBRUQ7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFDSCxNQUFNLE9BQU8sV0FBVztJQVN0QixZQUNhLEtBQWEsRUFBVyxHQUFrQixFQUFXLFFBQWdCLENBQUMsRUFDdEUsZ0JBQTZCLElBQUksRUFBVyxJQUFjLEVBQVUsUUFBYztRQURsRixVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQVcsUUFBRyxHQUFILEdBQUcsQ0FBZTtRQUFXLFVBQUssR0FBTCxLQUFLLENBQVk7UUFDdEUsa0JBQWEsR0FBYixhQUFhLENBQW9CO1FBQVcsU0FBSSxHQUFKLElBQUksQ0FBVTtRQUFVLGFBQVEsR0FBUixRQUFRLENBQU07UUFUeEYsYUFBUSxHQUFHLElBQUksR0FBRyxFQUFPLENBQUM7UUFDMUIsaUJBQVksR0FBRyxJQUFJLEdBQUcsRUFBaUIsQ0FBQztRQUN4QyxjQUFTLEdBQVksS0FBSyxDQUFDO1FBRzFCLHdCQUFtQixHQUFXLENBQUMsQ0FBQztRQUt0QyxJQUFJLENB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QUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM1RSxNQUFNLFFBQVEsR0FBRyxDQUFDLElBQVMsRUFBRSxNQUFnQixFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUU3RSxRQUFRLEtBQUssQ0FBQyxJQUFJLEVBQUU7UUFDbEIsS0FBSyxPQUFPLENBQUMsT0FBTztZQUNsQixvQkFBb0I7WUFDcEIsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFO2dCQUNoQixPQUFPLE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7YUFDOUU7WUFDRCxrREFBa0Q7WUFDbEQsSUFBSSxLQUFLLENBQUMsSUFBSSxFQUFFO2dCQUNkLE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO29CQUN4QyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQzthQUN0RDtZQUNELE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXhCLEtBQUssT0FBTyxDQUFDLFFBQVE7WUFDbkIsT0FBTyxRQUFRLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUV2QztZQUNFLE9BQU8sS0FBSyxDQUFDO0tBQ2hCO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtBU1R9IGZyb20gJy4uLy4uLy4uL2V4cHJlc3Npb25fcGFyc2VyL2FzdCc7XG5pbXBvcnQgKiBhcyBpMThuIGZyb20gJy4uLy4uLy4uL2kxOG4vaTE4bl9hc3QnO1xuaW1wb3J0ICogYXMgbyBmcm9tICcuLi8uLi8uLi9vdXRwdXQvb3V0cHV0X2FzdCc7XG5cbmltcG9ydCB7YXNzZW1ibGVCb3VuZFRleHRQbGFjZWhvbGRlcnMsIGZpbmRJbmRleCwgZ2V0U2VxTnVtYmVyR2VuZXJhdG9yLCB1cGRhdGVQbGFjZWhvbGRlck1hcCwgd3JhcEkxOG5QbGFjZWhvbGRlcn0gZnJvbSAnLi91dGlsJztcblxuZW51bSBUYWdUeXBlIHtcbiAgRUxFTUVOVCxcbiAgVEVNUExBVEVcbn1cblxuLyoqXG4gKiBHZW5lcmF0ZXMgYW4gb2JqZWN0IHRoYXQgaXMgdXNlZCBhcyBhIHNoYXJlZCBzdGF0ZSBiZXR3ZWVuIHBhcmVudCBhbmQgYWxsIGNoaWxkIGNvbnRleHRzLlxuICovXG5mdW5jdGlvbiBzZXR1cFJlZ2lzdHJ5KCkge1xuICByZXR1cm4ge2dldFVuaXF1ZUlkOiBnZXRTZXFOdW1iZXJHZW5lcmF0b3IoKSwgaWN1czogbmV3IE1hcDxzdHJpbmcsIGFueVtdPigpfTtcbn1cblxuLyoqXG4gKiBJMThuQ29udGV4dCBpcyBhIGhlbHBlciBjbGFzcyB3aGljaCBrZWVwcyB0cmFjayBvZiBhbGwgaTE4bi1yZWxhdGVkIGFzcGVjdHNcbiAqIChhY2N1bXVsYXRlcyBwbGFjZWhvbGRlcnMsIGJpbmRpbmdzLCBldGMpIGJldHdlZW4gaTE4blN0YXJ0IGFuZCBpMThuRW5kIGluc3RydWN0aW9ucy5cbiAqXG4gKiBXaGVuIHdlIGVudGVyIGEgbmVzdGVkIHRlbXBsYXRlLCB0aGUgdG9wLWxldmVsIGNvbnRleHQgaXMgYmVpbmcgcGFzc2VkIGRvd25cbiAqIHRvIHRoZSBuZXN0ZWQgY29tcG9uZW50LCB3aGljaCB1c2VzIHRoaXMgY29udGV4dCB0byBnZW5lcmF0ZSBhIGNoaWxkIGluc3RhbmNlXG4gKiBvZiBJMThuQ29udGV4dCBjbGFzcyAodG8gaGFuZGxlIG5lc3RlZCB0ZW1wbGF0ZSkgYW5kIGF0IHRoZSBlbmQsIHJlY29uY2lsZXMgaXQgYmFja1xuICogd2l0aCB0aGUgcGFyZW50IGNvbnRleHQuXG4gKlxuICogQHBhcmFtIGluZGV4IEluc3RydWN0aW9uIGluZGV4IG9mIGkxOG5TdGFydCwgd2hpY2ggaW5pdGlhdGVzIHRoaXMgY29udGV4dFxuICogQHBhcmFtIHJlZiBSZWZlcmVuY2UgdG8gYSB0cmFuc2xhdGlvbiBjb25zdCB0aGF0IHJlcHJlc2VudHMgdGhlIGNvbnRlbnQgaWYgdGh1cyBjb250ZXh0XG4gKiBAcGFyYW0gbGV2ZWwgTmVzdG5nIGxldmVsIGRlZmluZWQgZm9yIGNoaWxkIGNvbnRleHRzXG4gKiBAcGFyYW0gdGVtcGxhdGVJbmRleCBJbnN0cnVjdGlvbiBpbmRleCBvZiBhIHRlbXBsYXRlIHdoaWNoIHRoaXMgY29udGV4dCBiZWxvbmdzIHRvXG4gKiBAcGFyYW0gbWV0YSBNZXRhIGluZm9ybWF0aW9uIChpZCwgbWVhbmluZywgZGVzY3JpcHRpb24sIGV0YykgYXNzb2NpYXRlZCB3aXRoIHRoaXMgY29udGV4dFxuICovXG5leHBvcnQgY2xhc3MgSTE4bkNvbnRleHQge1xuICBwdWJsaWMgcmVhZG9ubHkgaWQ6IG51bWJlcjtcbiAgcHVibGljIGJpbmRpbmdzID0gbmV3IFNldDxBU1Q+KCk7XG4gIHB1YmxpYyBwbGFjZWhvbGRlcnMgPSBuZXcgTWFwPHN0cmluZywgYW55W10+KCk7XG4gIHB1YmxpYyBpc0VtaXR0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBwcml2YXRlIF9yZWdpc3RyeSAhOiBhbnk7XG4gIHByaXZhdGUgX3VucmVzb2x2ZWRDdHhDb3VudDogbnVtYmVyID0gMDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHJlYWRvbmx5IGluZGV4OiBudW1iZXIsIHJlYWRvbmx5IHJlZjogby5SZWFkVmFyRXhwciwgcmVhZG9ubHkgbGV2ZWw6IG51bWJlciA9IDAsXG4gICAgICByZWFkb25seSB0ZW1wbGF0ZUluZGV4OiBudW1iZXJ8bnVsbCA9IG51bGwsIHJlYWRvbmx5IG1ldGE6IGkxOG4uQVNULCBwcml2YXRlIHJlZ2lzdHJ5PzogYW55KSB7XG4gICAgdGhpcy5fcmVnaXN0cnkgPSByZWdpc3RyeSB8fCBzZXR1cFJlZ2lzdHJ5KCk7XG4gICAgdGhpcy5pZCA9IHRoaXMuX3JlZ2lzdHJ5LmdldFVuaXF1ZUlkKCk7XG4gIH1cblxuICBwcml2YXRlIGFwcGVuZFRhZyh0eXBlOiBUYWdUeXBlLCBub2RlOiBpMThuLlRhZ1BsYWNlaG9sZGVyLCBpbmRleDogbnVtYmVyLCBjbG9zZWQ/OiBib29sZWFuKSB7XG4gICAgaWYgKG5vZGUuaXNWb2lkICYmIGNsb3NlZCkge1xuICAgICAgcmV0dXJuOyAgLy8gaWdub3JlIFwiY2xvc2VcIiBmb3Igdm9pZCB0YWdzXG4gICAgfVxuICAgIGNvbnN0IHBoID0gbm9kZS5pc1ZvaWQgfHwgIWNsb3NlZCA/IG5vZGUuc3RhcnROYW1lIDogbm9kZS5jbG9zZU5hbWU7XG4gICAgY29uc3QgY29udGVudCA9IHt0eXBlLCBpbmRleCwgY3R4OiB0aGlzLmlkLCBpc1ZvaWQ6IG5vZGUuaXNWb2lkLCBjbG9zZWR9O1xuICAgIHVwZGF0ZVBsYWNlaG9sZGVyTWFwKHRoaXMucGxhY2Vob2xkZXJzLCBwaCwgY29udGVudCk7XG4gIH1cblxuICBnZXQgaWN1cygpIHsgcmV0dXJuIHRoaXMuX3JlZ2lzdHJ5LmljdXM7IH1cbiAgZ2V0IGlzUm9vdCgpIHsgcmV0dXJuIHRoaXMubGV2ZWwgPT09IDA7IH1cbiAgZ2V0IGlzUmVzb2x2ZWQoKSB7IHJldHVybiB0aGlzLl91bnJlc29sdmVkQ3R4Q291bnQgPT09IDA7IH1cblxuICBnZXRTZXJpYWxpemVkUGxhY2Vob2xkZXJzKCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBNYXA8c3RyaW5nLCBhbnlbXT4oKTtcbiAgICB0aGlzLnBsYWNlaG9sZGVycy5mb3JFYWNoKFxuICAgICAgICAodmFsdWVzLCBrZXkpID0+IHJlc3VsdC5zZXQoa2V5LCB2YWx1ZXMubWFwKHNlcmlhbGl6ZVBsYWNlaG9sZGVyVmFsdWUpKSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8vIHB1YmxpYyBBUEkgdG8gYWNjdW11bGF0ZSBpMThuLXJlbGF0ZWQgY29udGVudFxuICBhcHBlbmRCaW5kaW5nKGJpbmRpbmc6IEFTVCkgeyB0aGlzLmJpbmRpbmdzLmFkZChiaW5kaW5nKTsgfVxuICBhcHBlbmRJY3UobmFtZTogc3RyaW5nLCByZWY6IG8uRXhwcmVzc2lvbikge1xuICAgIHVwZGF0ZVBsYWNlaG9sZGVyTWFwKHRoaXMuX3JlZ2lzdHJ5LmljdXMsIG5hbWUsIHJlZik7XG4gIH1cbiAgYXBwZW5kQm91bmRUZXh0KG5vZGU6IGkxOG4uQVNUKSB7XG4gICAgY29uc3QgcGhzID0gYXNzZW1ibGVCb3VuZFRleHRQbGFjZWhvbGRlcnMobm9kZSwgdGhpcy5iaW5kaW5ncy5zaXplLCB0aGlzLmlkKTtcbiAgICBwaHMuZm9yRWFjaCgodmFsdWVzLCBrZXkpID0+IHVwZGF0ZVBsYWNlaG9sZGVyTWFwKHRoaXMucGxhY2Vob2xkZXJzLCBrZXksIC4uLnZhbHVlcykpO1xuICB9XG4gIGFwcGVuZFRlbXBsYXRlKG5vZGU6IGkxOG4uQVNULCBpbmRleDogbnVtYmVyKSB7XG4gICAgLy8gYWRkIG9wZW4gYW5kIGNsb3NlIHRhZ3MgYXQgdGhlIHNhbWUgdGltZSxcbiAgICAvLyBzaW5jZSB3ZSBwcm9jZXNzIG5lc3RlZCB0ZW1wbGF0ZXMgc2VwYXJhdGVseVxuICAgIHRoaXMuYXBwZW5kVGFnKFRhZ1R5cGUuVEVNUExBVEUsIG5vZGUgYXMgaTE4bi5UYWdQbGFjZWhvbGRlciwgaW5kZXgsIGZhbHNlKTtcbiAgICB0aGlzLmFwcGVuZFRhZyhUYWdUeXBlLlRFTVBMQVRFLCBub2RlIGFzIGkxOG4uVGFnUGxhY2Vob2xkZXIsIGluZGV4LCB0cnVlKTtcbiAgICB0aGlzLl91bnJlc29sdmVkQ3R4Q291bnQrKztcbiAgfVxuICBhcHBlbmRFbGVtZW50KG5vZGU6IGkxOG4uQVNULCBpbmRleDogbnVtYmVyLCBjbG9zZWQ/OiBib29sZWFuKSB7XG4gICAgdGhpcy5hcHBlbmRUYWcoVGFnVHlwZS5FTEVNRU5ULCBub2RlIGFzIGkxOG4uVGFnUGxhY2Vob2xkZXIsIGluZGV4LCBjbG9zZWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyBhbiBpbnN0YW5jZSBvZiBhIGNoaWxkIGNvbnRleHQgYmFzZWQgb24gdGhlIHJvb3Qgb25lLFxuICAgKiB3aGVuIHdlIGVudGVyIGEgbmVzdGVkIHRlbXBsYXRlIHdpdGhpbiBJMThuIHNlY3Rpb24uXG4gICAqXG4gICAqIEBwYXJhbSBpbmRleCBJbnN0cnVjdGlvbiBpbmRleCBvZiBjb3JyZXNwb25kaW5nIGkxOG5TdGFydCwgd2hpY2ggaW5pdGlhdGVzIHRoaXMgY29udGV4dFxuICAgKiBAcGFyYW0gdGVtcGxhdGVJbmRleCBJbnN0cnVjdGlvbiBpbmRleCBvZiBhIHRlbXBsYXRlIHdoaWNoIHRoaXMgY29udGV4dCBiZWxvbmdzIHRvXG4gICAqIEBwYXJhbSBtZXRhIE1ldGEgaW5mb3JtYXRpb24gKGlkLCBtZWFuaW5nLCBkZXNjcmlwdGlvbiwgZXRjKSBhc3NvY2lhdGVkIHdpdGggdGhpcyBjb250ZXh0XG4gICAqXG4gICAqIEByZXR1cm5zIEkxOG5Db250ZXh0IGluc3RhbmNlXG4gICAqL1xuICBmb3JrQ2hpbGRDb250ZXh0KGluZGV4OiBudW1iZXIsIHRlbXBsYXRlSW5kZXg6IG51bWJlciwgbWV0YTogaTE4bi5BU1QpIHtcbiAgICByZXR1cm4gbmV3IEkxOG5Db250ZXh0KGluZGV4LCB0aGlzLnJlZiwgdGhpcy5sZXZlbCArIDEsIHRlbXBsYXRlSW5kZXgsIG1ldGEsIHRoaXMuX3JlZ2lzdHJ5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWNvbmNpbGVzIGNoaWxkIGNvbnRleHQgaW50byBwYXJlbnQgb25lIG9uY2UgdGhlIGVuZCBvZiB0aGUgaTE4biBibG9jayBpcyByZWFjaGVkIChpMThuRW5kKS5cbiAgICpcbiAgICogQHBhcmFtIGNvbnRleHQgQ2hpbGQgSTE4bkNvbnRleHQgaW5zdGFuY2UgdG8gYmUgcmVjb25jaWxlZCB3aXRoIHBhcmVudCBjb250ZXh0LlxuICAgKi9cbiAgcmVjb25jaWxlQ2hpbGRDb250ZXh0KGNvbnRleHQ6IEkxOG5Db250ZXh0KSB7XG4gICAgLy8gc2V0IHRoZSByaWdodCBjb250ZXh0IGlkIGZvciBvcGVuIGFuZCBjbG9zZVxuICAgIC8vIHRlbXBsYXRlIHRhZ3MsIHNvIHdlIGNhbiB1c2UgaXQgYXMgc3ViLWJsb2NrIGlkc1xuICAgIFsnc3RhcnQnLCAnY2xvc2UnXS5mb3JFYWNoKChvcDogc3RyaW5nKSA9PiB7XG4gICAgICBjb25zdCBrZXkgPSAoY29udGV4dC5tZXRhIGFzIGFueSlbYCR7b3B9TmFtZWBdO1xuICAgICAgY29uc3QgcGhzID0gdGhpcy5wbGFjZWhvbGRlcnMuZ2V0KGtleSkgfHwgW107XG4gICAgICBjb25zdCB0YWcgPSBwaHMuZmluZChmaW5kVGVtcGxhdGVGbih0aGlzLmlkLCBjb250ZXh0LnRlbXBsYXRlSW5kZXgpKTtcbiAgICAgIGlmICh0YWcpIHtcbiAgICAgICAgdGFnLmN0eCA9IGNvbnRleHQuaWQ7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyByZWNvbmNpbGUgcGxhY2Vob2xkZXJzXG4gICAgY29uc3QgY2hpbGRQaHMgPSBjb250ZXh0LnBsYWNlaG9sZGVycztcbiAgICBjaGlsZFBocy5mb3JFYWNoKCh2YWx1ZXM6IGFueVtdLCBrZXk6IHN0cmluZykgPT4ge1xuICAgICAgY29uc3QgcGhzID0gdGhpcy5wbGFjZWhvbGRlcnMuZ2V0KGtleSk7XG4gICAgICBpZiAoIXBocykge1xuICAgICAgICB0aGlzLnBsYWNlaG9sZGVycy5zZXQoa2V5LCB2YWx1ZXMpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyB0cnkgdG8gZmluZCBtYXRjaGluZyB0ZW1wbGF0ZS4uLlxuICAgICAgY29uc3QgdG1wbElkeCA9IGZpbmRJbmRleChwaHMsIGZpbmRUZW1wbGF0ZUZuKGNvbnRleHQuaWQsIGNvbnRleHQudGVtcGxhdGVJbmRleCkpO1xuICAgICAgaWYgKHRtcGxJZHggPj0gMCkge1xuICAgICAgICAvLyAuLi4gaWYgZm91bmQgLSByZXBsYWNlIGl0IHdpdGggbmVzdGVkIHRlbXBsYXRlIGNvbnRlbnRcbiAgICAgICAgY29uc3QgaXNDbG9zZVRhZyA9IGtleS5zdGFydHNXaXRoKCdDTE9TRScpO1xuICAgICAgICBjb25zdCBpc1RlbXBsYXRlVGFnID0ga2V5LmVuZHNXaXRoKCdORy1URU1QTEFURScpO1xuICAgICAgICBpZiAoaXNUZW1wbGF0ZVRhZykge1xuICAgICAgICAgIC8vIGN1cnJlbnQgdGVtcGxhdGUncyBjb250ZW50IGlzIHBsYWNlZCBiZWZvcmUgb3IgYWZ0ZXJcbiAgICAgICAgICAvLyBwYXJlbnQgdGVtcGxhdGUgdGFnLCBkZXBlbmRpbmcgb24gdGhlIG9wZW4vY2xvc2UgYXRycmlidXRlXG4gICAgICAgICAgcGhzLnNwbGljZSh0bXBsSWR4ICsgKGlzQ2xvc2VUYWcgPyAwIDogMSksIDAsIC4uLnZhbHVlcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgaWR4ID0gaXNDbG9zZVRhZyA/IHZhbHVlcy5sZW5ndGggLSAxIDogMDtcbiAgICAgICAgICB2YWx1ZXNbaWR4XS50bXBsID0gcGhzW3RtcGxJZHhdO1xuICAgICAgICAgIHBocy5zcGxpY2UodG1wbElkeCwgMSwgLi4udmFsdWVzKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gLi4uIG90aGVyd2lzZSBqdXN0IGFwcGVuZCBjb250ZW50IHRvIHBsYWNlaG9sZGVyIHZhbHVlXG4gICAgICAgIHBocy5wdXNoKC4uLnZhbHVlcyk7XG4gICAgICB9XG4gICAgICB0aGlzLnBsYWNlaG9sZGVycy5zZXQoa2V5LCBwaHMpO1xuICAgIH0pO1xuICAgIHRoaXMuX3VucmVzb2x2ZWRDdHhDb3VudC0tO1xuICB9XG59XG5cbi8vXG4vLyBIZWxwZXIgbWV0aG9kc1xuLy9cblxuZnVuY3Rpb24gd3JhcChzeW1ib2w6IHN0cmluZywgaW5kZXg6IG51bWJlciwgY29udGV4dElkOiBudW1iZXIsIGNsb3NlZD86IGJvb2xlYW4pOiBzdHJpbmcge1xuICBjb25zdCBzdGF0ZSA9IGNsb3NlZCA/ICcvJyA6ICcnO1xuICByZXR1cm4gd3JhcEkxOG5QbGFjZWhvbGRlcihgJHtzdGF0ZX0ke3N5bWJvbH0ke2luZGV4fWAsIGNvbnRleHRJZCk7XG59XG5cbmZ1bmN0aW9uIHdyYXBUYWcoc3ltYm9sOiBzdHJpbmcsIHtpbmRleCwgY3R4LCBpc1ZvaWR9OiBhbnksIGNsb3NlZD86IGJvb2xlYW4pOiBzdHJpbmcge1xuICByZXR1cm4gaXNWb2lkID8gd3JhcChzeW1ib2wsIGluZGV4LCBjdHgpICsgd3JhcChzeW1ib2wsIGluZGV4LCBjdHgsIHRydWUpIDpcbiAgICAgICAgICAgICAgICAgIHdyYXAoc3ltYm9sLCBpbmRleCwgY3R4LCBjbG9zZWQpO1xufVxuXG5mdW5jdGlvbiBmaW5kVGVtcGxhdGVGbihjdHg6IG51bWJlciwgdGVtcGxhdGVJbmRleDogbnVtYmVyIHwgbnVsbCkge1xuICByZXR1cm4gKHRva2VuOiBhbnkpID0+IHR5cGVvZiB0b2tlbiA9PT0gJ29iamVjdCcgJiYgdG9rZW4udHlwZSA9PT0gVGFnVHlwZS5URU1QTEFURSAmJlxuICAgICAgdG9rZW4uaW5kZXggPT09IHRlbXBsYXRlSW5kZXggJiYgdG9rZW4uY3R4ID09PSBjdHg7XG59XG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZVBsYWNlaG9sZGVyVmFsdWUodmFsdWU6IGFueSk6IHN0cmluZyB7XG4gIGNvbnN0IGVsZW1lbnQgPSAoZGF0YTogYW55LCBjbG9zZWQ/OiBib29sZWFuKSA9PiB3cmFwVGFnKCcjJywgZGF0YSwgY2xvc2VkKTtcbiAgY29uc3QgdGVtcGxhdGUgPSAoZGF0YTogYW55LCBjbG9zZWQ/OiBib29sZWFuKSA9PiB3cmFwVGFnKCcqJywgZGF0YSwgY2xvc2VkKTtcblxuICBzd2l0Y2ggKHZhbHVlLnR5cGUpIHtcbiAgICBjYXNlIFRhZ1R5cGUuRUxFTUVOVDpcbiAgICAgIC8vIGNsb3NlIGVsZW1lbnQgdGFnXG4gICAgICBpZiAodmFsdWUuY2xvc2VkKSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50KHZhbHVlLCB0cnVlKSArICh2YWx1ZS50bXBsID8gdGVtcGxhdGUodmFsdWUudG1wbCwgdHJ1ZSkgOiAnJyk7XG4gICAgICB9XG4gICAgICAvLyBvcGVuIGVsZW1lbnQgdGFnIHRoYXQgYWxzbyBpbml0aWF0ZXMgYSB0ZW1wbGF0ZVxuICAgICAgaWYgKHZhbHVlLnRtcGwpIHtcbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlKHZhbHVlLnRtcGwpICsgZWxlbWVudCh2YWx1ZSkgK1xuICAgICAgICAgICAgKHZhbHVlLmlzVm9pZCA/IHRlbXBsYXRlKHZhbHVlLnRtcGwsIHRydWUpIDogJycpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGVsZW1lbnQodmFsdWUpO1xuXG4gICAgY2FzZSBUYWdUeXBlLlRFTVBMQVRFOlxuICAgICAgcmV0dXJuIHRlbXBsYXRlKHZhbHVlLCB2YWx1ZS5jbG9zZWQpO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgfVxufVxuIl19