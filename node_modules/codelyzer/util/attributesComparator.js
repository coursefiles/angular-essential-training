"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getAttributeValue_1 = require("./getAttributeValue");
var getLiteralValue_1 = require("./getLiteralValue");
function attributesComparator(baseAttributes, el) {
    if (baseAttributes === void 0) { baseAttributes = []; }
    var attributes = el.attrs.concat(el.inputs);
    return baseAttributes.every(function (baseAttr) {
        return attributes.some(function (attribute) {
            if (el.name === 'a' && attribute.name === 'routerLink') {
                return true;
            }
            if (baseAttr.name !== attribute.name) {
                return false;
            }
            if (baseAttr.value && baseAttr.value !== getLiteralValue_1.getLiteralValue(getAttributeValue_1.getAttributeValue(el, baseAttr.name))) {
                return false;
            }
            return true;
        });
    });
}
exports.attributesComparator = attributesComparator;
