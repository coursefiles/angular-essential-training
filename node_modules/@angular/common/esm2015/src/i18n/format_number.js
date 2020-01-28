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
import { NumberFormatStyle, NumberSymbol, getLocaleNumberFormat, getLocaleNumberSymbol, getNumberOfCurrencyDigits } from './locale_data_api';
/** @type {?} */
export const NUMBER_FORMAT_REGEXP = /^(\d+)?\.((\d+)(-(\d+))?)?$/;
/** @type {?} */
const MAX_DIGITS = 22;
/** @type {?} */
const DECIMAL_SEP = '.';
/** @type {?} */
const ZERO_CHAR = '0';
/** @type {?} */
const PATTERN_SEP = ';';
/** @type {?} */
const GROUP_SEP = ',';
/** @type {?} */
const DIGIT_CHAR = '#';
/** @type {?} */
const CURRENCY_CHAR = '¤';
/** @type {?} */
const PERCENT_CHAR = '%';
/**
 * Transforms a number to a locale string based on a style and a format.
 * @param {?} value
 * @param {?} pattern
 * @param {?} locale
 * @param {?} groupSymbol
 * @param {?} decimalSymbol
 * @param {?=} digitsInfo
 * @param {?=} isPercent
 * @return {?}
 */
function formatNumberToLocaleString(value, pattern, locale, groupSymbol, decimalSymbol, digitsInfo, isPercent = false) {
    /** @type {?} */
    let formattedText = '';
    /** @type {?} */
    let isZero = false;
    if (!isFinite(value)) {
        formattedText = getLocaleNumberSymbol(locale, NumberSymbol.Infinity);
    }
    else {
        /** @type {?} */
        let parsedNumber = parseNumber(value);
        if (isPercent) {
            parsedNumber = toPercent(parsedNumber);
        }
        /** @type {?} */
        let minInt = pattern.minInt;
        /** @type {?} */
        let minFraction = pattern.minFrac;
        /** @type {?} */
        let maxFraction = pattern.maxFrac;
        if (digitsInfo) {
            /** @type {?} */
            const parts = digitsInfo.match(NUMBER_FORMAT_REGEXP);
            if (parts === null) {
                throw new Error(`${digitsInfo} is not a valid digit info`);
            }
            /** @type {?} */
            const minIntPart = parts[1];
            /** @type {?} */
            const minFractionPart = parts[3];
            /** @type {?} */
            const maxFractionPart = parts[5];
            if (minIntPart != null) {
                minInt = parseIntAutoRadix(minIntPart);
            }
            if (minFractionPart != null) {
                minFraction = parseIntAutoRadix(minFractionPart);
            }
            if (maxFractionPart != null) {
                maxFraction = parseIntAutoRadix(maxFractionPart);
            }
            else if (minFractionPart != null && minFraction > maxFraction) {
                maxFraction = minFraction;
            }
        }
        roundNumber(parsedNumber, minFraction, maxFraction);
        /** @type {?} */
        let digits = parsedNumber.digits;
        /** @type {?} */
        let integerLen = parsedNumber.integerLen;
        /** @type {?} */
        const exponent = parsedNumber.exponent;
        /** @type {?} */
        let decimals = [];
        isZero = digits.every((/**
         * @param {?} d
         * @return {?}
         */
        d => !d));
        // pad zeros for small numbers
        for (; integerLen < minInt; integerLen++) {
            digits.unshift(0);
        }
        // pad zeros for small numbers
        for (; integerLen < 0; integerLen++) {
            digits.unshift(0);
        }
        // extract decimals digits
        if (integerLen > 0) {
            decimals = digits.splice(integerLen, digits.length);
        }
        else {
            decimals = digits;
            digits = [0];
        }
        // format the integer digits with grouping separators
        /** @type {?} */
        const groups = [];
        if (digits.length >= pattern.lgSize) {
            groups.unshift(digits.splice(-pattern.lgSize, digits.length).join(''));
        }
        while (digits.length > pattern.gSize) {
            groups.unshift(digits.splice(-pattern.gSize, digits.length).join(''));
        }
        if (digits.length) {
            groups.unshift(digits.join(''));
        }
        formattedText = groups.join(getLocaleNumberSymbol(locale, groupSymbol));
        // append the decimal digits
        if (decimals.length) {
            formattedText += getLocaleNumberSymbol(locale, decimalSymbol) + decimals.join('');
        }
        if (exponent) {
            formattedText += getLocaleNumberSymbol(locale, NumberSymbol.Exponential) + '+' + exponent;
        }
    }
    if (value < 0 && !isZero) {
        formattedText = pattern.negPre + formattedText + pattern.negSuf;
    }
    else {
        formattedText = pattern.posPre + formattedText + pattern.posSuf;
    }
    return formattedText;
}
/**
 * \@ngModule CommonModule
 * \@description
 *
 * Formats a number as currency using locale rules.
 *
 * @see `formatNumber()` / `DecimalPipe` / [Internationalization (i18n) Guide](https://angular.io/guide/i18n)
 *
 * \@publicApi
 * @param {?} value The number to format.
 * @param {?} locale A locale code for the locale format rules to use.
 * @param {?} currency A string containing the currency symbol or its name,
 * such as "$" or "Canadian Dollar". Used in output string, but does not affect the operation
 * of the function.
 * @param {?=} currencyCode The [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217)
 * currency code to use in the result string, such as `USD` for the US dollar and `EUR` for the euro.
 * @param {?=} digitsInfo
 * @return {?} The formatted currency value.
 *
 */
export function formatCurrency(value, locale, currency, currencyCode, digitsInfo) {
    /** @type {?} */
    const format = getLocaleNumberFormat(locale, NumberFormatStyle.Currency);
    /** @type {?} */
    const pattern = parseNumberFormat(format, getLocaleNumberSymbol(locale, NumberSymbol.MinusSign));
    pattern.minFrac = getNumberOfCurrencyDigits((/** @type {?} */ (currencyCode)));
    pattern.maxFrac = pattern.minFrac;
    /** @type {?} */
    const res = formatNumberToLocaleString(value, pattern, locale, NumberSymbol.CurrencyGroup, NumberSymbol.CurrencyDecimal, digitsInfo);
    return res
        .replace(CURRENCY_CHAR, currency)
        // if we have 2 time the currency character, the second one is ignored
        .replace(CURRENCY_CHAR, '');
}
/**
 * \@ngModule CommonModule
 * \@description
 *
 * Formats a number as a percentage according to locale rules.
 *
 * @see `formatNumber()` / `DecimalPipe` / [Internationalization (i18n) Guide](https://angular.io/guide/i18n)
 * \@publicApi
 *
 * @param {?} value The number to format.
 * @param {?} locale A locale code for the locale format rules to use.
 * @param {?=} digitsInfo
 * @return {?} The formatted percentage value.
 *
 */
export function formatPercent(value, locale, digitsInfo) {
    /** @type {?} */
    const format = getLocaleNumberFormat(locale, NumberFormatStyle.Percent);
    /** @type {?} */
    const pattern = parseNumberFormat(format, getLocaleNumberSymbol(locale, NumberSymbol.MinusSign));
    /** @type {?} */
    const res = formatNumberToLocaleString(value, pattern, locale, NumberSymbol.Group, NumberSymbol.Decimal, digitsInfo, true);
    return res.replace(new RegExp(PERCENT_CHAR, 'g'), getLocaleNumberSymbol(locale, NumberSymbol.PercentSign));
}
/**
 * \@ngModule CommonModule
 * \@description
 *
 * Formats a number as text, with group sizing, separator, and other
 * parameters based on the locale.
 *
 * @see [Internationalization (i18n) Guide](https://angular.io/guide/i18n)
 *
 * \@publicApi
 * @param {?} value The number to format.
 * @param {?} locale A locale code for the locale format rules to use.
 * @param {?=} digitsInfo
 * @return {?} The formatted text string.
 */
export function formatNumber(value, locale, digitsInfo) {
    /** @type {?} */
    const format = getLocaleNumberFormat(locale, NumberFormatStyle.Decimal);
    /** @type {?} */
    const pattern = parseNumberFormat(format, getLocaleNumberSymbol(locale, NumberSymbol.MinusSign));
    return formatNumberToLocaleString(value, pattern, locale, NumberSymbol.Group, NumberSymbol.Decimal, digitsInfo);
}
/**
 * @record
 */
function ParsedNumberFormat() { }
if (false) {
    /** @type {?} */
    ParsedNumberFormat.prototype.minInt;
    /** @type {?} */
    ParsedNumberFormat.prototype.minFrac;
    /** @type {?} */
    ParsedNumberFormat.prototype.maxFrac;
    /** @type {?} */
    ParsedNumberFormat.prototype.posPre;
    /** @type {?} */
    ParsedNumberFormat.prototype.posSuf;
    /** @type {?} */
    ParsedNumberFormat.prototype.negPre;
    /** @type {?} */
    ParsedNumberFormat.prototype.negSuf;
    /** @type {?} */
    ParsedNumberFormat.prototype.gSize;
    /** @type {?} */
    ParsedNumberFormat.prototype.lgSize;
}
/**
 * @param {?} format
 * @param {?=} minusSign
 * @return {?}
 */
function parseNumberFormat(format, minusSign = '-') {
    /** @type {?} */
    const p = {
        minInt: 1,
        minFrac: 0,
        maxFrac: 0,
        posPre: '',
        posSuf: '',
        negPre: '',
        negSuf: '',
        gSize: 0,
        lgSize: 0
    };
    /** @type {?} */
    const patternParts = format.split(PATTERN_SEP);
    /** @type {?} */
    const positive = patternParts[0];
    /** @type {?} */
    const negative = patternParts[1];
    /** @type {?} */
    const positiveParts = positive.indexOf(DECIMAL_SEP) !== -1 ?
        positive.split(DECIMAL_SEP) :
        [
            positive.substring(0, positive.lastIndexOf(ZERO_CHAR) + 1),
            positive.substring(positive.lastIndexOf(ZERO_CHAR) + 1)
        ];
    /** @type {?} */
    const integer = positiveParts[0];
    /** @type {?} */
    const fraction = positiveParts[1] || '';
    p.posPre = integer.substr(0, integer.indexOf(DIGIT_CHAR));
    for (let i = 0; i < fraction.length; i++) {
        /** @type {?} */
        const ch = fraction.charAt(i);
        if (ch === ZERO_CHAR) {
            p.minFrac = p.maxFrac = i + 1;
        }
        else if (ch === DIGIT_CHAR) {
            p.maxFrac = i + 1;
        }
        else {
            p.posSuf += ch;
        }
    }
    /** @type {?} */
    const groups = integer.split(GROUP_SEP);
    p.gSize = groups[1] ? groups[1].length : 0;
    p.lgSize = (groups[2] || groups[1]) ? (groups[2] || groups[1]).length : 0;
    if (negative) {
        /** @type {?} */
        const trunkLen = positive.length - p.posPre.length - p.posSuf.length;
        /** @type {?} */
        const pos = negative.indexOf(DIGIT_CHAR);
        p.negPre = negative.substr(0, pos).replace(/'/g, '');
        p.negSuf = negative.substr(pos + trunkLen).replace(/'/g, '');
    }
    else {
        p.negPre = minusSign + p.posPre;
        p.negSuf = p.posSuf;
    }
    return p;
}
/**
 * @record
 */
function ParsedNumber() { }
if (false) {
    /** @type {?} */
    ParsedNumber.prototype.digits;
    /** @type {?} */
    ParsedNumber.prototype.exponent;
    /** @type {?} */
    ParsedNumber.prototype.integerLen;
}
// Transforms a parsed number into a percentage by multiplying it by 100
/**
 * @param {?} parsedNumber
 * @return {?}
 */
function toPercent(parsedNumber) {
    // if the number is 0, don't do anything
    if (parsedNumber.digits[0] === 0) {
        return parsedNumber;
    }
    // Getting the current number of decimals
    /** @type {?} */
    const fractionLen = parsedNumber.digits.length - parsedNumber.integerLen;
    if (parsedNumber.exponent) {
        parsedNumber.exponent += 2;
    }
    else {
        if (fractionLen === 0) {
            parsedNumber.digits.push(0, 0);
        }
        else if (fractionLen === 1) {
            parsedNumber.digits.push(0);
        }
        parsedNumber.integerLen += 2;
    }
    return parsedNumber;
}
/**
 * Parses a number.
 * Significant bits of this parse algorithm came from https://github.com/MikeMcl/big.js/
 * @param {?} num
 * @return {?}
 */
function parseNumber(num) {
    /** @type {?} */
    let numStr = Math.abs(num) + '';
    /** @type {?} */
    let exponent = 0;
    /** @type {?} */
    let digits;
    /** @type {?} */
    let integerLen;
    /** @type {?} */
    let i;
    /** @type {?} */
    let j;
    /** @type {?} */
    let zeros;
    // Decimal point?
    if ((integerLen = numStr.indexOf(DECIMAL_SEP)) > -1) {
        numStr = numStr.replace(DECIMAL_SEP, '');
    }
    // Exponential form?
    if ((i = numStr.search(/e/i)) > 0) {
        // Work out the exponent.
        if (integerLen < 0)
            integerLen = i;
        integerLen += +numStr.slice(i + 1);
        numStr = numStr.substring(0, i);
    }
    else if (integerLen < 0) {
        // There was no decimal point or exponent so it is an integer.
        integerLen = numStr.length;
    }
    // Count the number of leading zeros.
    for (i = 0; numStr.charAt(i) === ZERO_CHAR; i++) { /* empty */
    }
    if (i === (zeros = numStr.length)) {
        // The digits are all zero.
        digits = [0];
        integerLen = 1;
    }
    else {
        // Count the number of trailing zeros
        zeros--;
        while (numStr.charAt(zeros) === ZERO_CHAR)
            zeros--;
        // Trailing zeros are insignificant so ignore them
        integerLen -= i;
        digits = [];
        // Convert string to array of digits without leading/trailing zeros.
        for (j = 0; i <= zeros; i++, j++) {
            digits[j] = Number(numStr.charAt(i));
        }
    }
    // If the number overflows the maximum allowed digits then use an exponent.
    if (integerLen > MAX_DIGITS) {
        digits = digits.splice(0, MAX_DIGITS - 1);
        exponent = integerLen - 1;
        integerLen = 1;
    }
    return { digits, exponent, integerLen };
}
/**
 * Round the parsed number to the specified number of decimal places
 * This function changes the parsedNumber in-place
 * @param {?} parsedNumber
 * @param {?} minFrac
 * @param {?} maxFrac
 * @return {?}
 */
function roundNumber(parsedNumber, minFrac, maxFrac) {
    if (minFrac > maxFrac) {
        throw new Error(`The minimum number of digits after fraction (${minFrac}) is higher than the maximum (${maxFrac}).`);
    }
    /** @type {?} */
    let digits = parsedNumber.digits;
    /** @type {?} */
    let fractionLen = digits.length - parsedNumber.integerLen;
    /** @type {?} */
    const fractionSize = Math.min(Math.max(minFrac, fractionLen), maxFrac);
    // The index of the digit to where rounding is to occur
    /** @type {?} */
    let roundAt = fractionSize + parsedNumber.integerLen;
    /** @type {?} */
    let digit = digits[roundAt];
    if (roundAt > 0) {
        // Drop fractional digits beyond `roundAt`
        digits.splice(Math.max(parsedNumber.integerLen, roundAt));
        // Set non-fractional digits beyond `roundAt` to 0
        for (let j = roundAt; j < digits.length; j++) {
            digits[j] = 0;
        }
    }
    else {
        // We rounded to zero so reset the parsedNumber
        fractionLen = Math.max(0, fractionLen);
        parsedNumber.integerLen = 1;
        digits.length = Math.max(1, roundAt = fractionSize + 1);
        digits[0] = 0;
        for (let i = 1; i < roundAt; i++)
            digits[i] = 0;
    }
    if (digit >= 5) {
        if (roundAt - 1 < 0) {
            for (let k = 0; k > roundAt; k--) {
                digits.unshift(0);
                parsedNumber.integerLen++;
            }
            digits.unshift(1);
            parsedNumber.integerLen++;
        }
        else {
            digits[roundAt - 1]++;
        }
    }
    // Pad out with zeros to get the required fraction length
    for (; fractionLen < Math.max(0, fractionSize); fractionLen++)
        digits.push(0);
    /** @type {?} */
    let dropTrailingZeros = fractionSize !== 0;
    // Minimal length = nb of decimals required + current nb of integers
    // Any number besides that is optional and can be removed if it's a trailing 0
    /** @type {?} */
    const minLen = minFrac + parsedNumber.integerLen;
    // Do any carrying, e.g. a digit was rounded up to 10
    /** @type {?} */
    const carry = digits.reduceRight((/**
     * @param {?} carry
     * @param {?} d
     * @param {?} i
     * @param {?} digits
     * @return {?}
     */
    function (carry, d, i, digits) {
        d = d + carry;
        digits[i] = d < 10 ? d : d - 10; // d % 10
        if (dropTrailingZeros) {
            // Do not keep meaningless fractional trailing zeros (e.g. 15.52000 --> 15.52)
            if (digits[i] === 0 && i >= minLen) {
                digits.pop();
            }
            else {
                dropTrailingZeros = false;
            }
        }
        return d >= 10 ? 1 : 0; // Math.floor(d / 10);
    }), 0);
    if (carry) {
        digits.unshift(carry);
        parsedNumber.integerLen++;
    }
}
/**
 * @param {?} text
 * @return {?}
 */
export function parseIntAutoRadix(text) {
    /** @type {?} */
    const result = parseInt(text);
    if (isNaN(result)) {
        throw new Error('Invalid integer literal when parsing ' + text);
    }
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0X251bWJlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbW1vbi9zcmMvaTE4bi9mb3JtYXRfbnVtYmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLGlCQUFpQixFQUFFLFlBQVksRUFBRSxxQkFBcUIsRUFBRSxxQkFBcUIsRUFBRSx5QkFBeUIsRUFBQyxNQUFNLG1CQUFtQixDQUFDOztBQUUzSSxNQUFNLE9BQU8sb0JBQW9CLEdBQUcsNkJBQTZCOztNQUMzRCxVQUFVLEdBQUcsRUFBRTs7TUFDZixXQUFXLEdBQUcsR0FBRzs7TUFDakIsU0FBUyxHQUFHLEdBQUc7O01BQ2YsV0FBVyxHQUFHLEdBQUc7O01BQ2pCLFNBQVMsR0FBRyxHQUFHOztNQUNmLFVBQVUsR0FBRyxHQUFHOztNQUNoQixhQUFhLEdBQUcsR0FBRzs7TUFDbkIsWUFBWSxHQUFHLEdBQUc7Ozs7Ozs7Ozs7OztBQUt4QixTQUFTLDBCQUEwQixDQUMvQixLQUFhLEVBQUUsT0FBMkIsRUFBRSxNQUFjLEVBQUUsV0FBeUIsRUFDckYsYUFBMkIsRUFBRSxVQUFtQixFQUFFLFNBQVMsR0FBRyxLQUFLOztRQUNqRSxhQUFhLEdBQUcsRUFBRTs7UUFDbEIsTUFBTSxHQUFHLEtBQUs7SUFFbEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUNwQixhQUFhLEdBQUcscUJBQXFCLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUN0RTtTQUFNOztZQUNELFlBQVksR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDO1FBRXJDLElBQUksU0FBUyxFQUFFO1lBQ2IsWUFBWSxHQUFHLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUN4Qzs7WUFFRyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU07O1lBQ3ZCLFdBQVcsR0FBRyxPQUFPLENBQUMs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QUU7WUFDckIsOEVBQThFO1lBQzlFLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksTUFBTSxFQUFFO2dCQUNsQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7YUFDZDtpQkFBTTtnQkFDTCxpQkFBaUIsR0FBRyxLQUFLLENBQUM7YUFDM0I7U0FDRjtRQUNELE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBRSxzQkFBc0I7SUFDakQsQ0FBQyxHQUFFLENBQUMsQ0FBQztJQUNMLElBQUksS0FBSyxFQUFFO1FBQ1QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0QixZQUFZLENBQUMsVUFBVSxFQUFFLENBQUM7S0FDM0I7QUFDSCxDQUFDOzs7OztBQUVELE1BQU0sVUFBVSxpQkFBaUIsQ0FBQyxJQUFZOztVQUN0QyxNQUFNLEdBQVcsUUFBUSxDQUFDLElBQUksQ0FBQztJQUNyQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUNqQixNQUFNLElBQUksS0FBSyxDQUFDLHVDQUF1QyxHQUFHLElBQUksQ0FBQyxDQUFDO0tBQ2pFO0lBQ0QsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtOdW1iZXJGb3JtYXRTdHlsZSwgTnVtYmVyU3ltYm9sLCBnZXRMb2NhbGVOdW1iZXJGb3JtYXQsIGdldExvY2FsZU51bWJlclN5bWJvbCwgZ2V0TnVtYmVyT2ZDdXJyZW5jeURpZ2l0c30gZnJvbSAnLi9sb2NhbGVfZGF0YV9hcGknO1xuXG5leHBvcnQgY29uc3QgTlVNQkVSX0ZPUk1BVF9SRUdFWFAgPSAvXihcXGQrKT9cXC4oKFxcZCspKC0oXFxkKykpPyk/JC87XG5jb25zdCBNQVhfRElHSVRTID0gMjI7XG5jb25zdCBERUNJTUFMX1NFUCA9ICcuJztcbmNvbnN0IFpFUk9fQ0hBUiA9ICcwJztcbmNvbnN0IFBBVFRFUk5fU0VQID0gJzsnO1xuY29uc3QgR1JPVVBfU0VQID0gJywnO1xuY29uc3QgRElHSVRfQ0hBUiA9ICcjJztcbmNvbnN0IENVUlJFTkNZX0NIQVIgPSAnwqQnO1xuY29uc3QgUEVSQ0VOVF9DSEFSID0gJyUnO1xuXG4vKipcbiAqIFRyYW5zZm9ybXMgYSBudW1iZXIgdG8gYSBsb2NhbGUgc3RyaW5nIGJhc2VkIG9uIGEgc3R5bGUgYW5kIGEgZm9ybWF0LlxuICovXG5mdW5jdGlvbiBmb3JtYXROdW1iZXJUb0xvY2FsZVN0cmluZyhcbiAgICB2YWx1ZTogbnVtYmVyLCBwYXR0ZXJuOiBQYXJzZWROdW1iZXJGb3JtYXQsIGxvY2FsZTogc3RyaW5nLCBncm91cFN5bWJvbDogTnVtYmVyU3ltYm9sLFxuICAgIGRlY2ltYWxTeW1ib2w6IE51bWJlclN5bWJvbCwgZGlnaXRzSW5mbz86IHN0cmluZywgaXNQZXJjZW50ID0gZmFsc2UpOiBzdHJpbmcge1xuICBsZXQgZm9ybWF0dGVkVGV4dCA9ICcnO1xuICBsZXQgaXNaZXJvID0gZmFsc2U7XG5cbiAgaWYgKCFpc0Zpbml0ZSh2YWx1ZSkpIHtcbiAgICBmb3JtYXR0ZWRUZXh0ID0gZ2V0TG9jYWxlTnVtYmVyU3ltYm9sKGxvY2FsZSwgTnVtYmVyU3ltYm9sLkluZmluaXR5KTtcbiAgfSBlbHNlIHtcbiAgICBsZXQgcGFyc2VkTnVtYmVyID0gcGFyc2VOdW1iZXIodmFsdWUpO1xuXG4gICAgaWYgKGlzUGVyY2VudCkge1xuICAgICAgcGFyc2VkTnVtYmVyID0gdG9QZXJjZW50KHBhcnNlZE51bWJlcik7XG4gICAgfVxuXG4gICAgbGV0IG1pbkludCA9IHBhdHRlcm4ubWluSW50O1xuICAgIGxldCBtaW5GcmFjdGlvbiA9IHBhdHRlcm4ubWluRnJhYztcbiAgICBsZXQgbWF4RnJhY3Rpb24gPSBwYXR0ZXJuLm1heEZyYWM7XG5cbiAgICBpZiAoZGlnaXRzSW5mbykge1xuICAgICAgY29uc3QgcGFydHMgPSBkaWdpdHNJbmZvLm1hdGNoKE5VTUJFUl9GT1JNQVRfUkVHRVhQKTtcbiAgICAgIGlmIChwYXJ0cyA9PT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7ZGlnaXRzSW5mb30gaXMgbm90IGEgdmFsaWQgZGlnaXQgaW5mb2ApO1xuICAgICAgfVxuICAgICAgY29uc3QgbWluSW50UGFydCA9IHBhcnRzWzFdO1xuICAgICAgY29uc3QgbWluRnJhY3Rpb25QYXJ0ID0gcGFydHNbM107XG4gICAgICBjb25zdCBtYXhGcmFjdGlvblBhcnQgPSBwYXJ0c1s1XTtcbiAgICAgIGlmIChtaW5JbnRQYXJ0ICE9IG51bGwpIHtcbiAgICAgICAgbWluSW50ID0gcGFyc2VJbnRBdXRvUmFkaXgobWluSW50UGFydCk7XG4gICAgICB9XG4gICAgICBpZiAobWluRnJhY3Rpb25QYXJ0ICE9IG51bGwpIHtcbiAgICAgICAgbWluRnJhY3Rpb24gPSBwYXJzZUludEF1dG9SYWRpeChtaW5GcmFjdGlvblBhcnQpO1xuICAgICAgfVxuICAgICAgaWYgKG1heEZyYWN0aW9uUGFydCAhPSBudWxsKSB7XG4gICAgICAgIG1heEZyYWN0aW9uID0gcGFyc2VJbnRBdXRvUmFkaXgobWF4RnJhY3Rpb25QYXJ0KTtcbiAgICAgIH0gZWxzZSBpZiAobWluRnJhY3Rpb25QYXJ0ICE9IG51bGwgJiYgbWluRnJhY3Rpb24gPiBtYXhGcmFjdGlvbikge1xuICAgICAgICBtYXhGcmFjdGlvbiA9IG1pbkZyYWN0aW9uO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJvdW5kTnVtYmVyKHBhcnNlZE51bWJlciwgbWluRnJhY3Rpb24sIG1heEZyYWN0aW9uKTtcblxuICAgIGxldCBkaWdpdHMgPSBwYXJzZWROdW1iZXIuZGlnaXRzO1xuICAgIGxldCBpbnRlZ2VyTGVuID0gcGFyc2VkTnVtYmVyLmludGVnZXJMZW47XG4gICAgY29uc3QgZXhwb25lbnQgPSBwYXJzZWROdW1iZXIuZXhwb25lbnQ7XG4gICAgbGV0IGRlY2ltYWxzID0gW107XG4gICAgaXNaZXJvID0gZGlnaXRzLmV2ZXJ5KGQgPT4gIWQpO1xuXG4gICAgLy8gcGFkIHplcm9zIGZvciBzbWFsbCBudW1iZXJzXG4gICAgZm9yICg7IGludGVnZXJMZW4gPCBtaW5JbnQ7IGludGVnZXJMZW4rKykge1xuICAgICAgZGlnaXRzLnVuc2hpZnQoMCk7XG4gICAgfVxuXG4gICAgLy8gcGFkIHplcm9zIGZvciBzbWFsbCBudW1iZXJzXG4gICAgZm9yICg7IGludGVnZXJMZW4gPCAwOyBpbnRlZ2VyTGVuKyspIHtcbiAgICAgIGRpZ2l0cy51bnNoaWZ0KDApO1xuICAgIH1cblxuICAgIC8vIGV4dHJhY3QgZGVjaW1hbHMgZGlnaXRzXG4gICAgaWYgKGludGVnZXJMZW4gPiAwKSB7XG4gICAgICBkZWNpbWFscyA9IGRpZ2l0cy5zcGxpY2UoaW50ZWdlckxlbiwgZGlnaXRzLmxlbmd0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlY2ltYWxzID0gZGlnaXRzO1xuICAgICAgZGlnaXRzID0gWzBdO1xuICAgIH1cblxuICAgIC8vIGZvcm1hdCB0aGUgaW50ZWdlciBkaWdpdHMgd2l0aCBncm91cGluZyBzZXBhcmF0b3JzXG4gICAgY29uc3QgZ3JvdXBzID0gW107XG4gICAgaWYgKGRpZ2l0cy5sZW5ndGggPj0gcGF0dGVybi5sZ1NpemUpIHtcbiAgICAgIGdyb3Vwcy51bnNoaWZ0KGRpZ2l0cy5zcGxpY2UoLXBhdHRlcm4ubGdTaXplLCBkaWdpdHMubGVuZ3RoKS5qb2luKCcnKSk7XG4gICAgfVxuXG4gICAgd2hpbGUgKGRpZ2l0cy5sZW5ndGggPiBwYXR0ZXJuLmdTaXplKSB7XG4gICAgICBncm91cHMudW5zaGlmdChkaWdpdHMuc3BsaWNlKC1wYXR0ZXJuLmdTaXplLCBkaWdpdHMubGVuZ3RoKS5qb2luKCcnKSk7XG4gICAgfVxuXG4gICAgaWYgKGRpZ2l0cy5sZW5ndGgpIHtcbiAgICAgIGdyb3Vwcy51bnNoaWZ0KGRpZ2l0cy5qb2luKCcnKSk7XG4gICAgfVxuXG4gICAgZm9ybWF0dGVkVGV4dCA9IGdyb3Vwcy5qb2luKGdldExvY2FsZU51bWJlclN5bWJvbChsb2NhbGUsIGdyb3VwU3ltYm9sKSk7XG5cbiAgICAvLyBhcHBlbmQgdGhlIGRlY2ltYWwgZGlnaXRzXG4gICAgaWYgKGRlY2ltYWxzLmxlbmd0aCkge1xuICAgICAgZm9ybWF0dGVkVGV4dCArPSBnZXRMb2NhbGVOdW1iZXJTeW1ib2wobG9jYWxlLCBkZWNpbWFsU3ltYm9sKSArIGRlY2ltYWxzLmpvaW4oJycpO1xuICAgIH1cblxuICAgIGlmIChleHBvbmVudCkge1xuICAgICAgZm9ybWF0dGVkVGV4dCArPSBnZXRMb2NhbGVOdW1iZXJTeW1ib2wobG9jYWxlLCBOdW1iZXJTeW1ib2wuRXhwb25lbnRpYWwpICsgJysnICsgZXhwb25lbnQ7XG4gICAgfVxuICB9XG5cbiAgaWYgKHZhbHVlIDwgMCAmJiAhaXNaZXJvKSB7XG4gICAgZm9ybWF0dGVkVGV4dCA9IHBhdHRlcm4ubmVnUHJlICsgZm9ybWF0dGVkVGV4dCArIHBhdHRlcm4ubmVnU3VmO1xuICB9IGVsc2Uge1xuICAgIGZvcm1hdHRlZFRleHQgPSBwYXR0ZXJuLnBvc1ByZSArIGZvcm1hdHRlZFRleHQgKyBwYXR0ZXJuLnBvc1N1ZjtcbiAgfVxuXG4gIHJldHVybiBmb3JtYXR0ZWRUZXh0O1xufVxuXG4vKipcbiAqIEBuZ01vZHVsZSBDb21tb25Nb2R1bGVcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqIEZvcm1hdHMgYSBudW1iZXIgYXMgY3VycmVuY3kgdXNpbmcgbG9jYWxlIHJ1bGVzLlxuICpcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgbnVtYmVyIHRvIGZvcm1hdC5cbiAqIEBwYXJhbSBsb2NhbGUgQSBsb2NhbGUgY29kZSBmb3IgdGhlIGxvY2FsZSBmb3JtYXQgcnVsZXMgdG8gdXNlLlxuICogQHBhcmFtIGN1cnJlbmN5IEEgc3RyaW5nIGNvbnRhaW5pbmcgdGhlIGN1cnJlbmN5IHN5bWJvbCBvciBpdHMgbmFtZSxcbiAqIHN1Y2ggYXMgXCIkXCIgb3IgXCJDYW5hZGlhbiBEb2xsYXJcIi4gVXNlZCBpbiBvdXRwdXQgc3RyaW5nLCBidXQgZG9lcyBub3QgYWZmZWN0IHRoZSBvcGVyYXRpb25cbiAqIG9mIHRoZSBmdW5jdGlvbi5cbiAqIEBwYXJhbSBjdXJyZW5jeUNvZGUgVGhlIFtJU08gNDIxN10oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvSVNPXzQyMTcpXG4gKiBjdXJyZW5jeSBjb2RlIHRvIHVzZSBpbiB0aGUgcmVzdWx0IHN0cmluZywgc3VjaCBhcyBgVVNEYCBmb3IgdGhlIFVTIGRvbGxhciBhbmQgYEVVUmAgZm9yIHRoZSBldXJvLlxuICogQHBhcmFtIGRpZ2l0SW5mbyBEZWNpbWFsIHJlcHJlc2VudGF0aW9uIG9wdGlvbnMsIHNwZWNpZmllZCBieSBhIHN0cmluZyBpbiB0aGUgZm9sbG93aW5nIGZvcm1hdDpcbiAqIGB7bWluSW50ZWdlckRpZ2l0c30ue21pbkZyYWN0aW9uRGlnaXRzfS17bWF4RnJhY3Rpb25EaWdpdHN9YC4gU2VlIGBEZWNpbWFsUGlwZWAgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBAcmV0dXJucyBUaGUgZm9ybWF0dGVkIGN1cnJlbmN5IHZhbHVlLlxuICpcbiAqIEBzZWUgYGZvcm1hdE51bWJlcigpYFxuICogQHNlZSBgRGVjaW1hbFBpcGVgXG4gKiBAc2VlIFtJbnRlcm5hdGlvbmFsaXphdGlvbiAoaTE4bikgR3VpZGVdKGh0dHBzOi8vYW5ndWxhci5pby9ndWlkZS9pMThuKVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdEN1cnJlbmN5KFxuICAgIHZhbHVlOiBudW1iZXIsIGxvY2FsZTogc3RyaW5nLCBjdXJyZW5jeTogc3RyaW5nLCBjdXJyZW5jeUNvZGU/OiBzdHJpbmcsXG4gICAgZGlnaXRzSW5mbz86IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IGZvcm1hdCA9IGdldExvY2FsZU51bWJlckZvcm1hdChsb2NhbGUsIE51bWJlckZvcm1hdFN0eWxlLkN1cnJlbmN5KTtcbiAgY29uc3QgcGF0dGVybiA9IHBhcnNlTnVtYmVyRm9ybWF0KGZvcm1hdCwgZ2V0TG9jYWxlTnVtYmVyU3ltYm9sKGxvY2FsZSwgTnVtYmVyU3ltYm9sLk1pbnVzU2lnbikpO1xuXG4gIHBhdHRlcm4ubWluRnJhYyA9IGdldE51bWJlck9mQ3VycmVuY3lEaWdpdHMoY3VycmVuY3lDb2RlICEpO1xuICBwYXR0ZXJuLm1heEZyYWMgPSBwYXR0ZXJuLm1pbkZyYWM7XG5cbiAgY29uc3QgcmVzID0gZm9ybWF0TnVtYmVyVG9Mb2NhbGVTdHJpbmcoXG4gICAgICB2YWx1ZSwgcGF0dGVybiwgbG9jYWxlLCBOdW1iZXJTeW1ib2wuQ3VycmVuY3lHcm91cCwgTnVtYmVyU3ltYm9sLkN1cnJlbmN5RGVjaW1hbCwgZGlnaXRzSW5mbyk7XG4gIHJldHVybiByZXNcbiAgICAgIC5yZXBsYWNlKENVUlJFTkNZX0NIQVIsIGN1cnJlbmN5KVxuICAgICAgLy8gaWYgd2UgaGF2ZSAyIHRpbWUgdGhlIGN1cnJlbmN5IGNoYXJhY3RlciwgdGhlIHNlY29uZCBvbmUgaXMgaWdub3JlZFxuICAgICAgLnJlcGxhY2UoQ1VSUkVOQ1lfQ0hBUiwgJycpO1xufVxuXG4vKipcbiAqIEBuZ01vZHVsZSBDb21tb25Nb2R1bGVcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqIEZvcm1hdHMgYSBudW1iZXIgYXMgYSBwZXJjZW50YWdlIGFjY29yZGluZyB0byBsb2NhbGUgcnVsZXMuXG4gKlxuICogQHBhcmFtIHZhbHVlIFRoZSBudW1iZXIgdG8gZm9ybWF0LlxuICogQHBhcmFtIGxvY2FsZSBBIGxvY2FsZSBjb2RlIGZvciB0aGUgbG9jYWxlIGZvcm1hdCBydWxlcyB0byB1c2UuXG4gKiBAcGFyYW0gZGlnaXRJbmZvIERlY2ltYWwgcmVwcmVzZW50YXRpb24gb3B0aW9ucywgc3BlY2lmaWVkIGJ5IGEgc3RyaW5nIGluIHRoZSBmb2xsb3dpbmcgZm9ybWF0OlxuICogYHttaW5JbnRlZ2VyRGlnaXRzfS57bWluRnJhY3Rpb25EaWdpdHN9LXttYXhGcmFjdGlvbkRpZ2l0c31gLiBTZWUgYERlY2ltYWxQaXBlYCBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIEByZXR1cm5zIFRoZSBmb3JtYXR0ZWQgcGVyY2VudGFnZSB2YWx1ZS5cbiAqXG4gKiBAc2VlIGBmb3JtYXROdW1iZXIoKWBcbiAqIEBzZWUgYERlY2ltYWxQaXBlYFxuICogQHNlZSBbSW50ZXJuYXRpb25hbGl6YXRpb24gKGkxOG4pIEd1aWRlXShodHRwczovL2FuZ3VsYXIuaW8vZ3VpZGUvaTE4bilcbiAqIEBwdWJsaWNBcGlcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRQZXJjZW50KHZhbHVlOiBudW1iZXIsIGxvY2FsZTogc3RyaW5nLCBkaWdpdHNJbmZvPzogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgZm9ybWF0ID0gZ2V0TG9jYWxlTnVtYmVyRm9ybWF0KGxvY2FsZSwgTnVtYmVyRm9ybWF0U3R5bGUuUGVyY2VudCk7XG4gIGNvbnN0IHBhdHRlcm4gPSBwYXJzZU51bWJlckZvcm1hdChmb3JtYXQsIGdldExvY2FsZU51bWJlclN5bWJvbChsb2NhbGUsIE51bWJlclN5bWJvbC5NaW51c1NpZ24pKTtcbiAgY29uc3QgcmVzID0gZm9ybWF0TnVtYmVyVG9Mb2NhbGVTdHJpbmcoXG4gICAgICB2YWx1ZSwgcGF0dGVybiwgbG9jYWxlLCBOdW1iZXJTeW1ib2wuR3JvdXAsIE51bWJlclN5bWJvbC5EZWNpbWFsLCBkaWdpdHNJbmZvLCB0cnVlKTtcbiAgcmV0dXJuIHJlcy5yZXBsYWNlKFxuICAgICAgbmV3IFJlZ0V4cChQRVJDRU5UX0NIQVIsICdnJyksIGdldExvY2FsZU51bWJlclN5bWJvbChsb2NhbGUsIE51bWJlclN5bWJvbC5QZXJjZW50U2lnbikpO1xufVxuXG4vKipcbiAqIEBuZ01vZHVsZSBDb21tb25Nb2R1bGVcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqIEZvcm1hdHMgYSBudW1iZXIgYXMgdGV4dCwgd2l0aCBncm91cCBzaXppbmcsIHNlcGFyYXRvciwgYW5kIG90aGVyXG4gKiBwYXJhbWV0ZXJzIGJhc2VkIG9uIHRoZSBsb2NhbGUuXG4gKlxuICogQHBhcmFtIHZhbHVlIFRoZSBudW1iZXIgdG8gZm9ybWF0LlxuICogQHBhcmFtIGxvY2FsZSBBIGxvY2FsZSBjb2RlIGZvciB0aGUgbG9jYWxlIGZvcm1hdCBydWxlcyB0byB1c2UuXG4gKiBAcGFyYW0gZGlnaXRJbmZvIERlY2ltYWwgcmVwcmVzZW50YXRpb24gb3B0aW9ucywgc3BlY2lmaWVkIGJ5IGEgc3RyaW5nIGluIHRoZSBmb2xsb3dpbmcgZm9ybWF0OlxuICogYHttaW5JbnRlZ2VyRGlnaXRzfS57bWluRnJhY3Rpb25EaWdpdHN9LXttYXhGcmFjdGlvbkRpZ2l0c31gLiBTZWUgYERlY2ltYWxQaXBlYCBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIEByZXR1cm5zIFRoZSBmb3JtYXR0ZWQgdGV4dCBzdHJpbmcuXG4gKiBAc2VlIFtJbnRlcm5hdGlvbmFsaXphdGlvbiAoaTE4bikgR3VpZGVdKGh0dHBzOi8vYW5ndWxhci5pby9ndWlkZS9pMThuKVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdE51bWJlcih2YWx1ZTogbnVtYmVyLCBsb2NhbGU6IHN0cmluZywgZGlnaXRzSW5mbz86IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IGZvcm1hdCA9IGdldExvY2FsZU51bWJlckZvcm1hdChsb2NhbGUsIE51bWJlckZvcm1hdFN0eWxlLkRlY2ltYWwpO1xuICBjb25zdCBwYXR0ZXJuID0gcGFyc2VOdW1iZXJGb3JtYXQoZm9ybWF0LCBnZXRMb2NhbGVOdW1iZXJTeW1ib2wobG9jYWxlLCBOdW1iZXJTeW1ib2wuTWludXNTaWduKSk7XG4gIHJldHVybiBmb3JtYXROdW1iZXJUb0xvY2FsZVN0cmluZyhcbiAgICAgIHZhbHVlLCBwYXR0ZXJuLCBsb2NhbGUsIE51bWJlclN5bWJvbC5Hcm91cCwgTnVtYmVyU3ltYm9sLkRlY2ltYWwsIGRpZ2l0c0luZm8pO1xufVxuXG5pbnRlcmZhY2UgUGFyc2VkTnVtYmVyRm9ybWF0IHtcbiAgbWluSW50OiBudW1iZXI7XG4gIC8vIHRoZSBtaW5pbXVtIG51bWJlciBvZiBkaWdpdHMgcmVxdWlyZWQgaW4gdGhlIGZyYWN0aW9uIHBhcnQgb2YgdGhlIG51bWJlclxuICBtaW5GcmFjOiBudW1iZXI7XG4gIC8vIHRoZSBtYXhpbXVtIG51bWJlciBvZiBkaWdpdHMgcmVxdWlyZWQgaW4gdGhlIGZyYWN0aW9uIHBhcnQgb2YgdGhlIG51bWJlclxuICBtYXhGcmFjOiBudW1iZXI7XG4gIC8vIHRoZSBwcmVmaXggZm9yIGEgcG9zaXRpdmUgbnVtYmVyXG4gIHBvc1ByZTogc3RyaW5nO1xuICAvLyB0aGUgc3VmZml4IGZvciBhIHBvc2l0aXZlIG51bWJlclxuICBwb3NTdWY6IHN0cmluZztcbiAgLy8gdGhlIHByZWZpeCBmb3IgYSBuZWdhdGl2ZSBudW1iZXIgKGUuZy4gYC1gIG9yIGAoYCkpXG4gIG5lZ1ByZTogc3RyaW5nO1xuICAvLyB0aGUgc3VmZml4IGZvciBhIG5lZ2F0aXZlIG51bWJlciAoZS5nLiBgKWApXG4gIG5lZ1N1Zjogc3RyaW5nO1xuICAvLyBudW1iZXIgb2YgZGlnaXRzIGluIGVhY2ggZ3JvdXAgb2Ygc2VwYXJhdGVkIGRpZ2l0c1xuICBnU2l6ZTogbnVtYmVyO1xuICAvLyBudW1iZXIgb2YgZGlnaXRzIGluIHRoZSBsYXN0IGdyb3VwIG9mIGRpZ2l0cyBiZWZvcmUgdGhlIGRlY2ltYWwgc2VwYXJhdG9yXG4gIGxnU2l6ZTogbnVtYmVyO1xufVxuXG5mdW5jdGlvbiBwYXJzZU51bWJlckZvcm1hdChmb3JtYXQ6IHN0cmluZywgbWludXNTaWduID0gJy0nKTogUGFyc2VkTnVtYmVyRm9ybWF0IHtcbiAgY29uc3QgcCA9IHtcbiAgICBtaW5JbnQ6IDEsXG4gICAgbWluRnJhYzogMCxcbiAgICBtYXhGcmFjOiAwLFxuICAgIHBvc1ByZTogJycsXG4gICAgcG9zU3VmOiAnJyxcbiAgICBuZWdQcmU6ICcnLFxuICAgIG5lZ1N1ZjogJycsXG4gICAgZ1NpemU6IDAsXG4gICAgbGdTaXplOiAwXG4gIH07XG5cbiAgY29uc3QgcGF0dGVyblBhcnRzID0gZm9ybWF0LnNwbGl0KFBBVFRFUk5fU0VQKTtcbiAgY29uc3QgcG9zaXRpdmUgPSBwYXR0ZXJuUGFydHNbMF07XG4gIGNvbnN0IG5lZ2F0aXZlID0gcGF0dGVyblBhcnRzWzFdO1xuXG4gIGNvbnN0IHBvc2l0aXZlUGFydHMgPSBwb3NpdGl2ZS5pbmRleE9mKERFQ0lNQUxfU0VQKSAhPT0gLTEgP1xuICAgICAgcG9zaXRpdmUuc3BsaXQoREVDSU1BTF9TRVApIDpcbiAgICAgIFtcbiAgICAgICAgcG9zaXRpdmUuc3Vic3RyaW5nKDAsIHBvc2l0aXZlLmxhc3RJbmRleE9mKFpFUk9fQ0hBUikgKyAxKSxcbiAgICAgICAgcG9zaXRpdmUuc3Vic3RyaW5nKHBvc2l0aXZlLmxhc3RJbmRleE9mKFpFUk9fQ0hBUikgKyAxKVxuICAgICAgXSxcbiAgICAgICAgaW50ZWdlciA9IHBvc2l0aXZlUGFydHNbMF0sIGZyYWN0aW9uID0gcG9zaXRpdmVQYXJ0c1sxXSB8fCAnJztcblxuICBwLnBvc1ByZSA9IGludGVnZXIuc3Vic3RyKDAsIGludGVnZXIuaW5kZXhPZihESUdJVF9DSEFSKSk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFjdGlvbi5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGNoID0gZnJhY3Rpb24uY2hhckF0KGkpO1xuICAgIGlmIChjaCA9PT0gWkVST19DSEFSKSB7XG4gICAgICBwLm1pbkZyYWMgPSBwLm1heEZyYWMgPSBpICsgMTtcbiAgICB9IGVsc2UgaWYgKGNoID09PSBESUdJVF9DSEFSKSB7XG4gICAgICBwLm1heEZyYWMgPSBpICsgMTtcbiAgICB9IGVsc2Uge1xuICAgICAgcC5wb3NTdWYgKz0gY2g7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgZ3JvdXBzID0gaW50ZWdlci5zcGxpdChHUk9VUF9TRVApO1xuICBwLmdTaXplID0gZ3JvdXBzWzFdID8gZ3JvdXBzWzFdLmxlbmd0aCA6IDA7XG4gIHAubGdTaXplID0gKGdyb3Vwc1syXSB8fCBncm91cHNbMV0pID8gKGdyb3Vwc1syXSB8fCBncm91cHNbMV0pLmxlbmd0aCA6IDA7XG5cbiAgaWYgKG5lZ2F0aXZlKSB7XG4gICAgY29uc3QgdHJ1bmtMZW4gPSBwb3NpdGl2ZS5sZW5ndGggLSBwLnBvc1ByZS5sZW5ndGggLSBwLnBvc1N1Zi5sZW5ndGgsXG4gICAgICAgICAgcG9zID0gbmVnYXRpdmUuaW5kZXhPZihESUdJVF9DSEFSKTtcblxuICAgIHAubmVnUHJlID0gbmVnYXRpdmUuc3Vic3RyKDAsIHBvcykucmVwbGFjZSgvJy9nLCAnJyk7XG4gICAgcC5uZWdTdWYgPSBuZWdhdGl2ZS5zdWJzdHIocG9zICsgdHJ1bmtMZW4pLnJlcGxhY2UoLycvZywgJycpO1xuICB9IGVsc2Uge1xuICAgIHAubmVnUHJlID0gbWludXNTaWduICsgcC5wb3NQcmU7XG4gICAgcC5uZWdTdWYgPSBwLnBvc1N1ZjtcbiAgfVxuXG4gIHJldHVybiBwO1xufVxuXG5pbnRlcmZhY2UgUGFyc2VkTnVtYmVyIHtcbiAgLy8gYW4gYXJyYXkgb2YgZGlnaXRzIGNvbnRhaW5pbmcgbGVhZGluZyB6ZXJvcyBhcyBuZWNlc3NhcnlcbiAgZGlnaXRzOiBudW1iZXJbXTtcbiAgLy8gdGhlIGV4cG9uZW50IGZvciBudW1iZXJzIHRoYXQgd291bGQgbmVlZCBtb3JlIHRoYW4gYE1BWF9ESUdJVFNgIGRpZ2l0cyBpbiBgZGBcbiAgZXhwb25lbnQ6IG51bWJlcjtcbiAgLy8gdGhlIG51bWJlciBvZiB0aGUgZGlnaXRzIGluIGBkYCB0aGF0IGFyZSB0byB0aGUgbGVmdCBvZiB0aGUgZGVjaW1hbCBwb2ludFxuICBpbnRlZ2VyTGVuOiBudW1iZXI7XG59XG5cbi8vIFRyYW5zZm9ybXMgYSBwYXJzZWQgbnVtYmVyIGludG8gYSBwZXJjZW50YWdlIGJ5IG11bHRpcGx5aW5nIGl0IGJ5IDEwMFxuZnVuY3Rpb24gdG9QZXJjZW50KHBhcnNlZE51bWJlcjogUGFyc2VkTnVtYmVyKTogUGFyc2VkTnVtYmVyIHtcbiAgLy8gaWYgdGhlIG51bWJlciBpcyAwLCBkb24ndCBkbyBhbnl0aGluZ1xuICBpZiAocGFyc2VkTnVtYmVyLmRpZ2l0c1swXSA9PT0gMCkge1xuICAgIHJldHVybiBwYXJzZWROdW1iZXI7XG4gIH1cblxuICAvLyBHZXR0aW5nIHRoZSBjdXJyZW50IG51bWJlciBvZiBkZWNpbWFsc1xuICBjb25zdCBmcmFjdGlvbkxlbiA9IHBhcnNlZE51bWJlci5kaWdpdHMubGVuZ3RoIC0gcGFyc2VkTnVtYmVyLmludGVnZXJMZW47XG4gIGlmIChwYXJzZWROdW1iZXIuZXhwb25lbnQpIHtcbiAgICBwYXJzZWROdW1iZXIuZXhwb25lbnQgKz0gMjtcbiAgfSBlbHNlIHtcbiAgICBpZiAoZnJhY3Rpb25MZW4gPT09IDApIHtcbiAgICAgIHBhcnNlZE51bWJlci5kaWdpdHMucHVzaCgwLCAwKTtcbiAgICB9IGVsc2UgaWYgKGZyYWN0aW9uTGVuID09PSAxKSB7XG4gICAgICBwYXJzZWROdW1iZXIuZGlnaXRzLnB1c2goMCk7XG4gICAgfVxuICAgIHBhcnNlZE51bWJlci5pbnRlZ2VyTGVuICs9IDI7XG4gIH1cblxuICByZXR1cm4gcGFyc2VkTnVtYmVyO1xufVxuXG4vKipcbiAqIFBhcnNlcyBhIG51bWJlci5cbiAqIFNpZ25pZmljYW50IGJpdHMgb2YgdGhpcyBwYXJzZSBhbGdvcml0aG0gY2FtZSBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWtlTWNsL2JpZy5qcy9cbiAqL1xuZnVuY3Rpb24gcGFyc2VOdW1iZXIobnVtOiBudW1iZXIpOiBQYXJzZWROdW1iZXIge1xuICBsZXQgbnVtU3RyID0gTWF0aC5hYnMobnVtKSArICcnO1xuICBsZXQgZXhwb25lbnQgPSAwLCBkaWdpdHMsIGludGVnZXJMZW47XG4gIGxldCBpLCBqLCB6ZXJvcztcblxuICAvLyBEZWNpbWFsIHBvaW50P1xuICBpZiAoKGludGVnZXJMZW4gPSBudW1TdHIuaW5kZXhPZihERUNJTUFMX1NFUCkpID4gLTEpIHtcbiAgICBudW1TdHIgPSBudW1TdHIucmVwbGFjZShERUNJTUFMX1NFUCwgJycpO1xuICB9XG5cbiAgLy8gRXhwb25lbnRpYWwgZm9ybT9cbiAgaWYgKChpID0gbnVtU3RyLnNlYXJjaCgvZS9pKSkgPiAwKSB7XG4gICAgLy8gV29yayBvdXQgdGhlIGV4cG9uZW50LlxuICAgIGlmIChpbnRlZ2VyTGVuIDwgMCkgaW50ZWdlckxlbiA9IGk7XG4gICAgaW50ZWdlckxlbiArPSArbnVtU3RyLnNsaWNlKGkgKyAxKTtcbiAgICBudW1TdHIgPSBudW1TdHIuc3Vic3RyaW5nKDAsIGkpO1xuICB9IGVsc2UgaWYgKGludGVnZXJMZW4gPCAwKSB7XG4gICAgLy8gVGhlcmUgd2FzIG5vIGRlY2ltYWwgcG9pbnQgb3IgZXhwb25lbnQgc28gaXQgaXMgYW4gaW50ZWdlci5cbiAgICBpbnRlZ2VyTGVuID0gbnVtU3RyLmxlbmd0aDtcbiAgfVxuXG4gIC8vIENvdW50IHRoZSBudW1iZXIgb2YgbGVhZGluZyB6ZXJvcy5cbiAgZm9yIChpID0gMDsgbnVtU3RyLmNoYXJBdChpKSA9PT0gWkVST19DSEFSOyBpKyspIHsgLyogZW1wdHkgKi9cbiAgfVxuXG4gIGlmIChpID09PSAoemVyb3MgPSBudW1TdHIubGVuZ3RoKSkge1xuICAgIC8vIFRoZSBkaWdpdHMgYXJlIGFsbCB6ZXJvLlxuICAgIGRpZ2l0cyA9IFswXTtcbiAgICBpbnRlZ2VyTGVuID0gMTtcbiAgfSBlbHNlIHtcbiAgICAvLyBDb3VudCB0aGUgbnVtYmVyIG9mIHRyYWlsaW5nIHplcm9zXG4gICAgemVyb3MtLTtcbiAgICB3aGlsZSAobnVtU3RyLmNoYXJBdCh6ZXJvcykgPT09IFpFUk9fQ0hBUikgemVyb3MtLTtcblxuICAgIC8vIFRyYWlsaW5nIHplcm9zIGFyZSBpbnNpZ25pZmljYW50IHNvIGlnbm9yZSB0aGVtXG4gICAgaW50ZWdlckxlbiAtPSBpO1xuICAgIGRpZ2l0cyA9IFtdO1xuICAgIC8vIENvbnZlcnQgc3RyaW5nIHRvIGFycmF5IG9mIGRpZ2l0cyB3aXRob3V0IGxlYWRpbmcvdHJhaWxpbmcgemVyb3MuXG4gICAgZm9yIChqID0gMDsgaSA8PSB6ZXJvczsgaSsrLCBqKyspIHtcbiAgICAgIGRpZ2l0c1tqXSA9IE51bWJlcihudW1TdHIuY2hhckF0KGkpKTtcbiAgICB9XG4gIH1cblxuICAvLyBJZiB0aGUgbnVtYmVyIG92ZXJmbG93cyB0aGUgbWF4aW11bSBhbGxvd2VkIGRpZ2l0cyB0aGVuIHVzZSBhbiBleHBvbmVudC5cbiAgaWYgKGludGVnZXJMZW4gPiBNQVhfRElHSVRTKSB7XG4gICAgZGlnaXRzID0gZGlnaXRzLnNwbGljZSgwLCBNQVhfRElHSVRTIC0gMSk7XG4gICAgZXhwb25lbnQgPSBpbnRlZ2VyTGVuIC0gMTtcbiAgICBpbnRlZ2VyTGVuID0gMTtcbiAgfVxuXG4gIHJldHVybiB7ZGlnaXRzLCBleHBvbmVudCwgaW50ZWdlckxlbn07XG59XG5cbi8qKlxuICogUm91bmQgdGhlIHBhcnNlZCBudW1iZXIgdG8gdGhlIHNwZWNpZmllZCBudW1iZXIgb2YgZGVjaW1hbCBwbGFjZXNcbiAqIFRoaXMgZnVuY3Rpb24gY2hhbmdlcyB0aGUgcGFyc2VkTnVtYmVyIGluLXBsYWNlXG4gKi9cbmZ1bmN0aW9uIHJvdW5kTnVtYmVyKHBhcnNlZE51bWJlcjogUGFyc2VkTnVtYmVyLCBtaW5GcmFjOiBudW1iZXIsIG1heEZyYWM6IG51bWJlcikge1xuICBpZiAobWluRnJhYyA+IG1heEZyYWMpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBUaGUgbWluaW11bSBudW1iZXIgb2YgZGlnaXRzIGFmdGVyIGZyYWN0aW9uICgke21pbkZyYWN9KSBpcyBoaWdoZXIgdGhhbiB0aGUgbWF4aW11bSAoJHttYXhGcmFjfSkuYCk7XG4gIH1cblxuICBsZXQgZGlnaXRzID0gcGFyc2VkTnVtYmVyLmRpZ2l0cztcbiAgbGV0IGZyYWN0aW9uTGVuID0gZGlnaXRzLmxlbmd0aCAtIHBhcnNlZE51bWJlci5pbnRlZ2VyTGVuO1xuICBjb25zdCBmcmFjdGlvblNpemUgPSBNYXRoLm1pbihNYXRoLm1heChtaW5GcmFjLCBmcmFjdGlvbkxlbiksIG1heEZyYWMpO1xuXG4gIC8vIFRoZSBpbmRleCBvZiB0aGUgZGlnaXQgdG8gd2hlcmUgcm91bmRpbmcgaXMgdG8gb2NjdXJcbiAgbGV0IHJvdW5kQXQgPSBmcmFjdGlvblNpemUgKyBwYXJzZWROdW1iZXIuaW50ZWdlckxlbjtcbiAgbGV0IGRpZ2l0ID0gZGlnaXRzW3JvdW5kQXRdO1xuXG4gIGlmIChyb3VuZEF0ID4gMCkge1xuICAgIC8vIERyb3AgZnJhY3Rpb25hbCBkaWdpdHMgYmV5b25kIGByb3VuZEF0YFxuICAgIGRpZ2l0cy5zcGxpY2UoTWF0aC5tYXgocGFyc2VkTnVtYmVyLmludGVnZXJMZW4sIHJvdW5kQXQpKTtcblxuICAgIC8vIFNldCBub24tZnJhY3Rpb25hbCBkaWdpdHMgYmV5b25kIGByb3VuZEF0YCB0byAwXG4gICAgZm9yIChsZXQgaiA9IHJvdW5kQXQ7IGogPCBkaWdpdHMubGVuZ3RoOyBqKyspIHtcbiAgICAgIGRpZ2l0c1tqXSA9IDA7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIFdlIHJvdW5kZWQgdG8gemVybyBzbyByZXNldCB0aGUgcGFyc2VkTnVtYmVyXG4gICAgZnJhY3Rpb25MZW4gPSBNYXRoLm1heCgwLCBmcmFjdGlvbkxlbik7XG4gICAgcGFyc2VkTnVtYmVyLmludGVnZXJMZW4gPSAxO1xuICAgIGRpZ2l0cy5sZW5ndGggPSBNYXRoLm1heCgxLCByb3VuZEF0ID0gZnJhY3Rpb25TaXplICsgMSk7XG4gICAgZGlnaXRzWzBdID0gMDtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IHJvdW5kQXQ7IGkrKykgZGlnaXRzW2ldID0gMDtcbiAgfVxuXG4gIGlmIChkaWdpdCA+PSA1KSB7XG4gICAgaWYgKHJvdW5kQXQgLSAxIDwgMCkge1xuICAgICAgZm9yIChsZXQgayA9IDA7IGsgPiByb3VuZEF0OyBrLS0pIHtcbiAgICAgICAgZGlnaXRzLnVuc2hpZnQoMCk7XG4gICAgICAgIHBhcnNlZE51bWJlci5pbnRlZ2VyTGVuKys7XG4gICAgICB9XG4gICAgICBkaWdpdHMudW5zaGlmdCgxKTtcbiAgICAgIHBhcnNlZE51bWJlci5pbnRlZ2VyTGVuKys7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpZ2l0c1tyb3VuZEF0IC0gMV0rKztcbiAgICB9XG4gIH1cblxuICAvLyBQYWQgb3V0IHdpdGggemVyb3MgdG8gZ2V0IHRoZSByZXF1aXJlZCBmcmFjdGlvbiBsZW5ndGhcbiAgZm9yICg7IGZyYWN0aW9uTGVuIDwgTWF0aC5tYXgoMCwgZnJhY3Rpb25TaXplKTsgZnJhY3Rpb25MZW4rKykgZGlnaXRzLnB1c2goMCk7XG5cbiAgbGV0IGRyb3BUcmFpbGluZ1plcm9zID0gZnJhY3Rpb25TaXplICE9PSAwO1xuICAvLyBNaW5pbWFsIGxlbmd0aCA9IG5iIG9mIGRlY2ltYWxzIHJlcXVpcmVkICsgY3VycmVudCBuYiBvZiBpbnRlZ2Vyc1xuICAvLyBBbnkgbnVtYmVyIGJlc2lkZXMgdGhhdCBpcyBvcHRpb25hbCBhbmQgY2FuIGJlIHJlbW92ZWQgaWYgaXQncyBhIHRyYWlsaW5nIDBcbiAgY29uc3QgbWluTGVuID0gbWluRnJhYyArIHBhcnNlZE51bWJlci5pbnRlZ2VyTGVuO1xuICAvLyBEbyBhbnkgY2FycnlpbmcsIGUuZy4gYSBkaWdpdCB3YXMgcm91bmRlZCB1cCB0byAxMFxuICBjb25zdCBjYXJyeSA9IGRpZ2l0cy5yZWR1Y2VSaWdodChmdW5jdGlvbihjYXJyeSwgZCwgaSwgZGlnaXRzKSB7XG4gICAgZCA9IGQgKyBjYXJyeTtcbiAgICBkaWdpdHNbaV0gPSBkIDwgMTAgPyBkIDogZCAtIDEwOyAgLy8gZCAlIDEwXG4gICAgaWYgKGRyb3BUcmFpbGluZ1plcm9zKSB7XG4gICAgICAvLyBEbyBub3Qga2VlcCBtZWFuaW5nbGVzcyBmcmFjdGlvbmFsIHRyYWlsaW5nIHplcm9zIChlLmcuIDE1LjUyMDAwIC0tPiAxNS41MilcbiAgICAgIGlmIChkaWdpdHNbaV0gPT09IDAgJiYgaSA+PSBtaW5MZW4pIHtcbiAgICAgICAgZGlnaXRzLnBvcCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZHJvcFRyYWlsaW5nWmVyb3MgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGQgPj0gMTAgPyAxIDogMDsgIC8vIE1hdGguZmxvb3IoZCAvIDEwKTtcbiAgfSwgMCk7XG4gIGlmIChjYXJyeSkge1xuICAgIGRpZ2l0cy51bnNoaWZ0KGNhcnJ5KTtcbiAgICBwYXJzZWROdW1iZXIuaW50ZWdlckxlbisrO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUludEF1dG9SYWRpeCh0ZXh0OiBzdHJpbmcpOiBudW1iZXIge1xuICBjb25zdCByZXN1bHQ6IG51bWJlciA9IHBhcnNlSW50KHRleHQpO1xuICBpZiAoaXNOYU4ocmVzdWx0KSkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBpbnRlZ2VyIGxpdGVyYWwgd2hlbiBwYXJzaW5nICcgKyB0ZXh0KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuIl19