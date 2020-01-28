/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import localeEn from './locale_en';
import { LOCALE_DATA } from './locale_data';
import { CURRENCIES_EN } from './currencies';
/**
 * Format styles that can be used to represent numbers.
 * @see `getLocaleNumberFormat()`.
 * @see [Internationalization (i18n) Guide](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export var NumberFormatStyle;
(function (NumberFormatStyle) {
    NumberFormatStyle[NumberFormatStyle["Decimal"] = 0] = "Decimal";
    NumberFormatStyle[NumberFormatStyle["Percent"] = 1] = "Percent";
    NumberFormatStyle[NumberFormatStyle["Currency"] = 2] = "Currency";
    NumberFormatStyle[NumberFormatStyle["Scientific"] = 3] = "Scientific";
})(NumberFormatStyle || (NumberFormatStyle = {}));
/**
 * Plurality cases used for translating plurals to different languages.
 *
 * @see `NgPlural`
 * @see `NgPluralCase`
 * @see [Internationalization (i18n) Guide](https://angular.io/guide/i18n)
 *
 * @publicApi */
export var Plural;
(function (Plural) {
    Plural[Plural["Zero"] = 0] = "Zero";
    Plural[Plural["One"] = 1] = "One";
    Plural[Plural["Two"] = 2] = "Two";
    Plural[Plural["Few"] = 3] = "Few";
    Plural[Plural["Many"] = 4] = "Many";
    Plural[Plural["Other"] = 5] = "Other";
})(Plural || (Plural = {}));
/**
 * Context-dependant translation forms for strings.
 * Typically the standalone version is for the nominative form of the word,
 * and the format version is used for the genitive case.
 * @see [CLDR website](http://cldr.unicode.org/translation/date-time#TOC-Stand-Alone-vs.-Format-Styles)
 * @see [Internationalization (i18n) Guide](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export var FormStyle;
(function (FormStyle) {
    FormStyle[FormStyle["Format"] = 0] = "Format";
    FormStyle[FormStyle["Standalone"] = 1] = "Standalone";
})(FormStyle || (FormStyle = {}));
/**
 * String widths available for translations.
 * The specific character widths are locale-specific.
 * Examples are given for the word "Sunday" in English.
 *
 * @publicApi
 */
export var TranslationWidth;
(function (TranslationWidth) {
    /** 1 character for `en-US`. For example: 'S' */
    TranslationWidth[TranslationWidth["Narrow"] = 0] = "Narrow";
    /** 3 characters for `en-US`. For example: 'Sun' */
    TranslationWidth[TranslationWidth["Abbreviated"] = 1] = "Abbreviated";
    /** Full length for `en-US`. For example: "Sunday" */
    TranslationWidth[TranslationWidth["Wide"] = 2] = "Wide";
    /** 2 characters for `en-US`, For example: "Su" */
    TranslationWidth[TranslationWidth["Short"] = 3] = "Short";
})(TranslationWidth || (TranslationWidth = {}));
/**
 * String widths available for date-time formats.
 * The specific character widths are locale-specific.
 * Examples are given for `en-US`.
 *
 * @see `getLocaleDateFormat()`
 * @see `getLocaleTimeFormat()``
 * @see `getLocaleDateTimeFormat()`
 * @see [Internationalization (i18n) Guide](https://angular.io/guide/i18n)
 * @publicApi
 */
export var FormatWidth;
(function (FormatWidth) {
    /**
     * For `en-US`, 'M/d/yy, h:mm a'`
     * (Example: `6/15/15, 9:03 AM`)
     */
    FormatWidth[FormatWidth["Short"] = 0] = "Short";
    /**
     * For `en-US`, `'MMM d, y, h:mm:ss a'`
     * (Example: `Jun 15, 2015, 9:03:01 AM`)
     */
    FormatWidth[FormatWidth["Medium"] = 1] = "Medium";
    /**
     * For `en-US`, `'MMMM d, y, h:mm:ss a z'`
     * (Example: `June 15, 2015 at 9:03:01 AM GMT+1`)
     */
    FormatWidth[FormatWidth["Long"] = 2] = "Long";
    /**
     * For `en-US`, `'EEEE, MMMM d, y, h:mm:ss a zzzz'`
     * (Example: `Monday, June 15, 2015 at 9:03:01 AM GMT+01:00`)
     */
    FormatWidth[FormatWidth["Full"] = 3] = "Full";
})(FormatWidth || (FormatWidth = {}));
/**
 * Symbols that can be used to replace placeholders in number patterns.
 * Examples are based on `en-US` values.
 *
 * @see `getLocaleNumberSymbol()`
 * @see [Internationalization (i18n) Guide](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export var NumberSymbol;
(function (NumberSymbol) {
    /**
     * Decimal separator.
     * For `en-US`, the dot character.
     * Example : 2,345`.`67
     */
    NumberSymbol[NumberSymbol["Decimal"] = 0] = "Decimal";
    /**
     * Grouping separator, typically for thousands.
     * For `en-US`, the comma character.
     * Example: 2`,`345.67
     */
    NumberSymbol[NumberSymbol["Group"] = 1] = "Group";
    /**
     * List-item separator.
     * Example: "one, two, and three"
     */
    NumberSymbol[NumberSymbol["List"] = 2] = "List";
    /**
     * Sign for percentage (out of 100).
     * Example: 23.4%
     */
    NumberSymbol[NumberSymbol["PercentSign"] = 3] = "PercentSign";
    /**
     * Sign for positive numbers.
     * Example: +23
     */
    NumberSymbol[NumberSymbol["PlusSign"] = 4] = "PlusSign";
    /**
     * Sign for negative numbers.
     * Example: -23
     */
    NumberSymbol[NumberSymbol["MinusSign"] = 5] = "MinusSign";
    /**
     * Computer notation for exponential value (n times a power of 10).
     * Example: 1.2E3
     */
    NumberSymbol[NumberSymbol["Exponential"] = 6] = "Exponential";
    /**
     * Human-readable format of exponential.
     * Example: 1.2x103
     */
    NumberSymbol[NumberSymbol["SuperscriptingExponent"] = 7] = "SuperscriptingExponent";
    /**
     * Sign for permille (out of 1000).
     * Example: 23.4‰
     */
    NumberSymbol[NumberSymbol["PerMille"] = 8] = "PerMille";
    /**
     * Infinity, can be used with plus and minus.
     * Example: ∞, +∞, -∞
     */
    NumberSymbol[NumberSymbol["Infinity"] = 9] = "Infinity";
    /**
     * Not a number.
     * Example: NaN
     */
    NumberSymbol[NumberSymbol["NaN"] = 10] = "NaN";
    /**
     * Symbol used between time units.
     * Example: 10:52
     */
    NumberSymbol[NumberSymbol["TimeSeparator"] = 11] = "TimeSeparator";
    /**
     * Decimal separator for currency values (fallback to `Decimal`).
     * Example: $2,345.67
     */
    NumberSymbol[NumberSymbol["CurrencyDecimal"] = 12] = "CurrencyDecimal";
    /**
     * Group separator for currency values (fallback to `Group`).
     * Example: $2,345.67
     */
    NumberSymbol[NumberSymbol["CurrencyGroup"] = 13] = "CurrencyGroup";
})(NumberSymbol || (NumberSymbol = {}));
/**
 * The value for each day of the week, based on the `en-US` locale
 *
 * @publicApi
 */
export var WeekDay;
(function (WeekDay) {
    WeekDay[WeekDay["Sunday"] = 0] = "Sunday";
    WeekDay[WeekDay["Monday"] = 1] = "Monday";
    WeekDay[WeekDay["Tuesday"] = 2] = "Tuesday";
    WeekDay[WeekDay["Wednesday"] = 3] = "Wednesday";
    WeekDay[WeekDay["Thursday"] = 4] = "Thursday";
    WeekDay[WeekDay["Friday"] = 5] = "Friday";
    WeekDay[WeekDay["Saturday"] = 6] = "Saturday";
})(WeekDay || (WeekDay = {}));
/**
 * Retrieves the locale ID from the currently loaded locale.
 * The loaded locale could be, for example, a global one rather than a regional one.
 * @param locale A locale code, such as `fr-FR`.
 * @returns The locale code. For example, `fr`.
 * @see [Internationalization (i18n) Guide](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleId(locale) {
    return findLocaleData(locale)[0 /* LocaleId */];
}
/**
 * Retrieves day period strings for the given locale.
 *
 * @param locale A locale code for the locale format rules to use.
 * @param formStyle The required grammatical form.
 * @param width The required character width.
 * @returns An array of localized period strings. For example, `[AM, PM]` for `en-US`.
 * @see [Internationalization (i18n) Guide](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleDayPeriods(locale, formStyle, width) {
    var data = findLocaleData(locale);
    var amPmData = [data[1 /* DayPeriodsFormat */], data[2 /* DayPeriodsStandalone */]];
    var amPm = getLastDefinedValue(amPmData, formStyle);
    return getLastDefinedValue(amPm, width);
}
/**
 * Retrieves days of the week for the given locale, using the Gregorian calendar.
 *
 * @param locale A locale code for the locale format rules to use.
 * @param formStyle The required grammatical form.
 * @param width The required character width.
 * @returns An array of localized name strings.
 * For example,`[Sunday, Monday, ... Saturday]` for `en-US`.
 * @see [Internationalization (i18n) Guide](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleDayNames(locale, formStyle, width) {
    var data = findLocaleData(locale);
    var daysData = [data[3 /* DaysFormat */], data[4 /* DaysStandalone */]];
    var days = getLastDefinedValue(daysData, formStyle);
    return getLastDefinedValue(days, width);
}
/**
 * Retrieves months of the year for the given locale, using the Gregorian calendar.
 *
 * @param locale A locale code for the locale format rules to use.
 * @param formStyle The required grammatical form.
 * @param width The required character width.
 * @returns An array of localized name strings.
 * For example,  `[January, February, ...]` for `en-US`.
 * @see [Internationalization (i18n) Guide](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleMonthNames(locale, formStyle, width) {
    var data = findLocaleData(locale);
    var monthsData = [data[5 /* MonthsFormat */], data[6 /* MonthsStandalone */]];
    var months = getLastDefinedValue(monthsData, formStyle);
    return getLastDefinedValue(months, width);
}
/**
 * Retrieves Gregorian-calendar eras for the given locale.
 * @param locale A locale code for the locale format rules to use.
 * @param formStyle The required grammatical form.
 * @param width The required character width.

 * @returns An array of localized era strings.
 * For example, `[AD, BC]` for `en-US`.
 * @see [Internationalization (i18n) Guide](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleEraNames(locale, width) {
    var data = findLocaleData(locale);
    var erasData = data[7 /* Eras */];
    return getLastDefinedValue(erasData, width);
}
/**
 * Retrieves the first day of the week for the given locale.
 *
 * @param locale A locale code for the locale format rules to use.
 * @returns A day index number, using the 0-based week-day index for `en-US`
 * (Sunday = 0, Monday = 1, ...).
 * For example, for `fr-FR`, returns 1 to indicate that the first day is Monday.
 * @see [Internationalization (i18n) Guide](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleFirstDayOfWeek(locale) {
    var data = findLocaleData(locale);
    return data[8 /* FirstDayOfWeek */];
}
/**
 * Range of week days that are considered the week-end for the given locale.
 *
 * @param locale A locale code for the locale format rules to use.
 * @returns The range of day values, `[startDay, endDay]`.
 * @see [Internationalization (i18n) Guide](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleWeekEndRange(locale) {
    var data = findLocaleData(locale);
    return data[9 /* WeekendRange */];
}
/**
 * Retrieves a localized date-value formating string.
 *
 * @param locale A locale code for the locale format rules to use.
 * @param width The format type.
 * @returns The localized formating string.
 * @see `FormatWidth`
 * @see [Internationalization (i18n) Guide](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleDateFormat(locale, width) {
    var data = findLocaleData(locale);
    return getLastDefinedValue(data[10 /* DateFormat */], width);
}
/**
 * Retrieves a localized time-value formatting string.
 *
 * @param locale A locale code for the locale format rules to use.
 * @param width The format type.
 * @returns The localized formatting string.
 * @see `FormatWidth`
 * @see [Internationalization (i18n) Guide](https://angular.io/guide/i18n)

 * @publicApi
 */
export function getLocaleTimeFormat(locale, width) {
    var data = findLocaleData(locale);
    return getLastDefinedValue(data[11 /* TimeFormat */], width);
}
/**
 * Retrieves a localized date-time formatting string.
 *
 * @param locale A locale code for the locale format rules to use.
 * @param width The format type.
 * @returns The localized formatting string.
 * @see `FormatWidth`
 * @see [Internationalization (i18n) Guide](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleDateTimeFormat(locale, width) {
    var data = findLocaleData(locale);
    var dateTimeFormatData = data[12 /* DateTimeFormat */];
    return getLastDefinedValue(dateTimeFormatData, width);
}
/**
 * Retrieves a localized number symbol that can be used to replace placeholders in number formats.
 * @param locale The locale code.
 * @param symbol The symbol to localize.
 * @returns The character for the localized symbol.
 * @see `NumberSymbol`
 * @see [Internationalization (i18n) Guide](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleNumberSymbol(locale, symbol) {
    var data = findLocaleData(locale);
    var res = data[13 /* NumberSymbols */][symbol];
    if (typeof res === 'undefined') {
        if (symbol === NumberSymbol.CurrencyDecimal) {
            return data[13 /* NumberSymbols */][NumberSymbol.Decimal];
        }
        else if (symbol === NumberSymbol.CurrencyGroup) {
            return data[13 /* NumberSymbols */][NumberSymbol.Group];
        }
    }
    return res;
}
/**
 * Retrieves a number format for a given locale.
 *
 * Numbers are formatted using patterns, like `#,###.00`. For example, the pattern `#,###.00`
 * when used to format the number 12345.678 could result in "12'345,678". That would happen if the
 * grouping separator for your language is an apostrophe, and the decimal separator is a comma.
 *
 * <b>Important:</b> The characters `.` `,` `0` `#` (and others below) are special placeholders
 * that stand for the decimal separator, and so on, and are NOT real characters.
 * You must NOT "translate" the placeholders. For example, don't change `.` to `,` even though in
 * your language the decimal point is written with a comma. The symbols should be replaced by the
 * local equivalents, using the appropriate `NumberSymbol` for your language.
 *
 * Here are the special characters used in number patterns:
 *
 * | Symbol | Meaning |
 * |--------|---------|
 * | . | Replaced automatically by the character used for the decimal point. |
 * | , | Replaced by the "grouping" (thousands) separator. |
 * | 0 | Replaced by a digit (or zero if there aren't enough digits). |
 * | # | Replaced by a digit (or nothing if there aren't enough). |
 * | ¤ | Replaced by a currency symbol, such as $ or USD. |
 * | % | Marks a percent format. The % symbol may change position, but must be retained. |
 * | E | Marks a scientific format. The E symbol may change position, but must be retained. |
 * | ' | Special characters used as literal characters are quoted with ASCII single quotes. |
 *
 * @param locale A locale code for the locale format rules to use.
 * @param type The type of numeric value to be formatted (such as `Decimal` or `Currency`.)
 * @returns The localized format string.
 * @see `NumberFormatStyle`
 * @see [CLDR website](http://cldr.unicode.org/translation/number-patterns)
 * @see [Internationalization (i18n) Guide](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleNumberFormat(locale, type) {
    var data = findLocaleData(locale);
    return data[14 /* NumberFormats */][type];
}
/**
 * Retrieves the symbol used to represent the currency for the main country
 * corresponding to a given locale. For example, '$' for `en-US`.
 *
 * @param locale A locale code for the locale format rules to use.
 * @returns The localized symbol character,
 * or `null` if the main country cannot be determined.
 * @see [Internationalization (i18n) Guide](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleCurrencySymbol(locale) {
    var data = findLocaleData(locale);
    return data[15 /* CurrencySymbol */] || null;
}
/**
 * Retrieves the name of the currency for the main country corresponding
 * to a given locale. For example, 'US Dollar' for `en-US`.
 * @param locale A locale code for the locale format rules to use.
 * @returns The currency name,
 * or `null` if the main country cannot be determined.
 * @see [Internationalization (i18n) Guide](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleCurrencyName(locale) {
    var data = findLocaleData(locale);
    return data[16 /* CurrencyName */] || null;
}
/**
 * Retrieves the currency values for a given locale.
 * @param locale A locale code for the locale format rules to use.
 * @returns The currency values.
 * @see [Internationalization (i18n) Guide](https://angular.io/guide/i18n)
 */
function getLocaleCurrencies(locale) {
    var data = findLocaleData(locale);
    return data[17 /* Currencies */];
}
/**
 * Retrieves the plural function used by ICU expressions to determine the plural case to use
 * for a given locale.
 * @param locale A locale code for the locale format rules to use.
 * @returns The plural function for the locale.
 * @see `NgPlural`
 * @see [Internationalization (i18n) Guide](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocalePluralCase(locale) {
    var data = findLocaleData(locale);
    return data[18 /* PluralCase */];
}
function checkFullData(data) {
    if (!data[19 /* ExtraData */]) {
        throw new Error("Missing extra locale data for the locale \"" + data[0 /* LocaleId */] + "\". Use \"registerLocaleData\" to load new data. See the \"I18n guide\" on angular.io to know more.");
    }
}
/**
 * Retrieves locale-specific rules used to determine which day period to use
 * when more than one period is defined for a locale.
 *
 * There is a rule for each defined day period. The
 * first rule is applied to the first day period and so on.
 * Fall back to AM/PM when no rules are available.
 *
 * A rule can specify a period as time range, or as a single time value.
 *
 * This functionality is only available when you have loaded the full locale data.
 * See the ["I18n guide"](guide/i18n#i18n-pipes).
 *
 * @param locale A locale code for the locale format rules to use.
 * @returns The rules for the locale, a single time value or array of *from-time, to-time*,
 * or null if no periods are available.
 *
 * @see `getLocaleExtraDayPeriods()`
 * @see [Internationalization (i18n) Guide](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleExtraDayPeriodRules(locale) {
    var data = findLocaleData(locale);
    checkFullData(data);
    var rules = data[19 /* ExtraData */][2 /* ExtraDayPeriodsRules */] || [];
    return rules.map(function (rule) {
        if (typeof rule === 'string') {
            return extractTime(rule);
        }
        return [extractTime(rule[0]), extractTime(rule[1])];
    });
}
/**
 * Retrieves locale-specific day periods, which indicate roughly how a day is broken up
 * in different languages.
 * For example, for `en-US`, periods are morning, noon, afternoon, evening, and midnight.
 *
 * This functionality is only available when you have loaded the full locale data.
 * See the ["I18n guide"](guide/i18n#i18n-pipes).
 *
 * @param locale A locale code for the locale format rules to use.
 * @param formStyle The required grammatical form.
 * @param width The required character width.
 * @returns The translated day-period strings.
 * @see `getLocaleExtraDayPeriodRules()`
 * @see [Internationalization (i18n) Guide](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleExtraDayPeriods(locale, formStyle, width) {
    var data = findLocaleData(locale);
    checkFullData(data);
    var dayPeriodsData = [
        data[19 /* ExtraData */][0 /* ExtraDayPeriodFormats */],
        data[19 /* ExtraData */][1 /* ExtraDayPeriodStandalone */]
    ];
    var dayPeriods = getLastDefinedValue(dayPeriodsData, formStyle) || [];
    return getLastDefinedValue(dayPeriods, width) || [];
}
/**
 * Retrieves the first value that is defined in an array, going backwards from an index position.
 *
 * To avoid repeating the same data (as when the "format" and "standalone" forms are the same)
 * add the first value to the locale data arrays, and add other values only if they are different.
 *
 * @param data The data array to retrieve from.
 * @param index A 0-based index into the array to start from.
 * @returns The value immediately before the given index position.
 * @see [Internationalization (i18n) Guide](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
function getLastDefinedValue(data, index) {
    for (var i = index; i > -1; i--) {
        if (typeof data[i] !== 'undefined') {
            return data[i];
        }
    }
    throw new Error('Locale data API: locale data undefined');
}
/**
 * Extracts the hours and minutes from a string like "15:45"
 */
function extractTime(time) {
    var _a = tslib_1.__read(time.split(':'), 2), h = _a[0], m = _a[1];
    return { hours: +h, minutes: +m };
}
/**
 * Finds the locale data for a given locale.
 *
 * @param locale The locale code.
 * @returns The locale data.
 * @see [Internationalization (i18n) Guide](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function findLocaleData(locale) {
    var normalizedLocale = locale.toLowerCase().replace(/_/g, '-');
    var match = LOCALE_DATA[normalizedLocale];
    if (match) {
        return match;
    }
    // let's try to find a parent locale
    var parentLocale = normalizedLocale.split('-')[0];
    match = LOCALE_DATA[parentLocale];
    if (match) {
        return match;
    }
    if (parentLocale === 'en') {
        return localeEn;
    }
    throw new Error("Missing locale data for the locale \"" + locale + "\".");
}
/**
 * Retrieves the currency symbol for a given currency code.
 *
 * For example, for the default `en-US` locale, the code `USD` can
 * be represented by the narrow symbol `$` or the wide symbol `US$`.
 *
 * @param code The currency code.
 * @param format The format, `wide` or `narrow`.
 * @param locale A locale code for the locale format rules to use.
 *
 * @returns The symbol, or the currency code if no symbol is available.0
 * @see [Internationalization (i18n) Guide](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getCurrencySymbol(code, format, locale) {
    if (locale === void 0) { locale = 'en'; }
    var currency = getLocaleCurrencies(locale)[code] || CURRENCIES_EN[code] || [];
    var symbolNarrow = currency[1 /* SymbolNarrow */];
    if (format === 'narrow' && typeof symbolNarrow === 'string') {
        return symbolNarrow;
    }
    return currency[0 /* Symbol */] || code;
}
// Most currencies have cents, that's why the default is 2
var DEFAULT_NB_OF_CURRENCY_DIGITS = 2;
/**
 * Reports the number of decimal digits for a given currency.
 * The value depends upon the presence of cents in that particular currency.
 *
 * @param code The currency code.
 * @returns The number of decimal digits, typically 0 or 2.
 * @see [Internationalization (i18n) Guide](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getNumberOfCurrencyDigits(code) {
    var digits;
    var currency = CURRENCIES_EN[code];
    if (currency) {
        digits = currency[2 /* NbOfDigits */];
    }
    return typeof digits === 'number' ? digits : DEFAULT_NB_OF_CURRENCY_DIGITS;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxlX2RhdGFfYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tbW9uL3NyYy9pMThuL2xvY2FsZV9kYXRhX2FwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxRQUFRLE1BQU0sYUFBYSxDQUFDO0FBQ25DLE9BQU8sRUFBQyxXQUFXLEVBQXVELE1BQU0sZUFBZSxDQUFDO0FBQ2hHLE9BQU8sRUFBQyxhQUFhLEVBQW9CLE1BQU0sY0FBYyxDQUFDO0FBRTlEOzs7Ozs7R0FNRztBQUNILE1BQU0sQ0FBTixJQUFZLGlCQUtYO0FBTEQsV0FBWSxpQkFBaUI7SUFDM0IsK0RBQU8sQ0FBQTtJQUNQLCtEQUFPLENBQUE7SUFDUCxpRUFBUSxDQUFBO0lBQ1IscUVBQVUsQ0FBQTtBQUNaLENBQUMsRUFMVyxpQkFBaUIsS0FBakIsaUJBQWlCLFFBSzVCO0FBRUQ7Ozs7Ozs7Z0JBT2dCO0FBQ2hCLE1BQU0sQ0FBTixJQUFZLE1BT1g7QUFQRCxXQUFZLE1BQU07SUFDaEIsbUNBQVEsQ0FBQTtJQUNSLGlDQUFPLENBQUE7SUFDUCxpQ0FBTyxDQUFBO0lBQ1AsaUNBQU8sQ0FBQTtJQUNQLG1DQUFRLENBQUE7SUFDUixxQ0FBUyxDQUFBO0FBQ1gsQ0FBQyxFQVBXLE1BQU0sS0FBTixNQUFNLFFBT2pCO0FBRUQ7Ozs7Ozs7O0dBUUc7QUFDSCxNQUFNLENBQU4sSUFBWSxTQUdYO0FBSEQsV0FBWSxTQUFTO0lBQ25CLDZDQUFNLENBQUE7SUFDTixxREFBVSxDQUFBO0FBQ1osQ0FBQyxFQUhXLFNBQVMsS0FBVCxTQUFTLFFBR3BCO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsTUFBTSxDQUFOLElBQVksZ0JBU1g7QUFURCxXQUFZLGdCQUFnQjtJQUMxQixnREFBZ0Q7SUFDaEQsMkRBQU0sQ0FBQTtJQUNOLG1EQUFtRDtJQUNuRCxxRUFBVyxDQUFBO0lBQ1gscURBQXFEO0lBQ3JELHVEQUFJLENBQUE7SUFDSixrREFBa0Q7SUFDbEQseURBQUssQ0FBQTtBQUNQLENBQUMsRUFUVyxnQkFBZ0IsS0FBaEIsZ0JBQWdCLFFBUzNCO0FBRUQ7Ozs7Ozs7Ozs7R0FVRztBQUNILE1BQU0sQ0FBTixJQUFZLFdBcUJYO0FBckJELFdBQVksV0FBVztJQUNyQjs7O09BR0c7SUFDSCwrQ0FBSyxDQUFBO0lBQ0w7OztPQUdHO0lBQ0gsaURBQU0sQ0FBQTtJQUNOOzs7T0FHRztJQUNILDZDQUFJLENBQUE7SUFDSjs7O09BR0c7SUFDSCw2Q0FBSSxDQUFBO0FBQ04sQ0FBQyxFQXJCVyxXQUFXLEtBQVgsV0FBVyxRQXFCdEI7QUFFRDs7Ozs7Ozs7R0FRRztBQUNILE1BQU0sQ0FBTixJQUFZLFlBeUVYO0FBekVELFdBQVksWUFBWTtJQUN0Qjs7OztPQUlHO0lBQ0gscURBQU8sQ0FBQTtJQUNQOzs7O09BSUc7SUFDSCxpREFBSyxDQUFBO0lBQ0w7OztPQUdHO0lBQ0gsK0NBQUksQ0FBQTtJQUNKOzs7T0FHRztJQUNILDZEQUFXLENBQUE7SUFDWDs7O09BR0c7SUFDSCx1REFBUSxDQUFBO0lBQ1I7OztPQUdHO0lBQ0gseURBQVMsQ0FBQTtJQUNUOzs7T0FHRztJQUNILDZEQUFXLENBQUE7SUFDWDs7O09BR0c7SUFDSCxtRkFBc0IsQ0FBQTtJQUN0Qjs7O09BR0c7SUFDSCx1REFBUSxDQUFBO0lBQ1I7OztPQUdHO0lBQ0gsdURBQVEsQ0FBQTtJQUNSOzs7T0FHRztJQUNILDhDQUFHLENBQUE7SUFDSDs7O09BR0c7SUFDSCxrRUFBYSxDQUFBO0lBQ2I7OztPQUdHO0lBQ0gsc0VBQWUsQ0FBQTtJQUNmOzs7T0FHRztJQUNILGtFQUFhLENBQUE7QUFDZixDQUFDLEVBekVXLFlBQVksS0FBWixZQUFZLFFBeUV2QjtBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLENBQU4sSUFBWSxPQVFYO0FBUkQsV0FBWSxPQUFPO0lBQ2pCLHlDQUFVLENBQUE7SUFDVix5Q0FBTSxDQUFBO0lBQ04sMkNBQU8sQ0FBQTtJQUNQLCtDQUFTLENBQUE7SUFDVCw2Q0FBUSxDQUFBO0lBQ1IseUNBQU0sQ0FBQTtJQUNOLDZDQUFRLENBQUE7QUFDVixDQUFDLEVBUlcsT0FBTyxLQUFQLE9BQU8sUUFRbEI7QUFFRDs7Ozs7Ozs7R0FRRztBQUNILE1BQU0sVUFBVSxXQUFXLENBQUMsTUFBYztJQUN4QyxPQUFPLGNBQWMsQ0FBQyxNQUFNLENBQUMsa0JBQTBCLENBQUM7QUFDMUQsQ0FBQztBQUVEOzs7Ozs7Ozs7O0dBVUc7QUFDSCxNQUFNLFVBQVUsbUJBQW1CLENBQy9CLE1BQWMsRUFBRSxTQUFvQixFQUFFLEtBQXVCO0lBQy9ELElBQU0sSUFBSSxHQUFHLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNwQyxJQUFNLFFBQVEsR0FFUixDQUFDLElBQUksMEJBQWtDLEVBQUUsSUFBSSw4QkFBc0MsQ0FBQyxDQUFDO0lBQzNGLElBQU0sSUFBSSxHQUFHLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUN0RCxPQUFPLG1CQUFtQixDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztBQUMxQyxDQUFDO0FBRUQ7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCxNQUFNLFVBQVUsaUJBQWlCLENBQzdCLE1BQWMsRUFBRSxTQUFvQixFQUFFLEtBQXVCO0lBQy9ELElBQU0sSUFBSSxHQUFHLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNwQyxJQUFNLFFBQVEsR0FDSSxDQUFDLElBQUksb0JBQTRCLEVBQUUsSUFBSSx3QkFBZ0MsQ0FBQyxDQUFDO0lBQzNGLElBQU0sSUFBSSxHQUFHLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUN0RCxPQUFPLG1CQUFtQixDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztBQUMxQyxDQUFDO0FBRUQ7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCxNQUFNLFVBQVUsbUJBQW1CLENBQy9CLE1BQWMsRUFBRSxTQUFvQixFQUFFLEtBQXVCO0lBQy9ELElBQU0sSUFBSSxHQUFHLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNwQyxJQUFNLFVBQVUsR0FDRSxDQUFDLElBQUksc0JBQThCLEVBQUUsSUFBSSwwQkFBa0MsQ0FBQyxDQUFDO0lBQy9GLElBQU0sTUFBTSxHQUFHLG1CQUFtQixDQUFDLFVBQVUsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMxRCxPQUFPLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztBQUM1QyxDQUFDO0FBRUQ7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCxNQUFNLFVBQVUsaUJBQWlCLENBQUMsTUFBYyxFQUFFLEtBQXVCO0lBQ3ZFLElBQU0sSUFBSSxHQUFHLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNwQyxJQUFNLFFBQVEsR0FBdUIsSUFBSSxjQUFzQixDQUFDO0lBQ2hFLE9BQU8sbUJBQW1CLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzlDLENBQUM7QUFFRDs7Ozs7Ozs7OztHQVVHO0FBQ0gsTUFBTSxVQUFVLHVCQUF1QixDQUFDLE1BQWM7SUFDcEQsSUFBTSxJQUFJLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3BDLE9BQU8sSUFBSSx3QkFBZ0MsQ0FBQztBQUM5QyxDQUFDO0FBRUQ7Ozs7Ozs7O0dBUUc7QUFDSCxNQUFNLFVBQVUscUJBQXFCLENBQUMsTUFBYztJQUNsRCxJQUFNLElBQUksR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDcEMsT0FBTyxJQUFJLHNCQUE4QixDQUFDO0FBQzVDLENBQUM7QUFFRDs7Ozs7Ozs7OztHQVVHO0FBQ0gsTUFBTSxVQUFVLG1CQUFtQixDQUFDLE1BQWMsRUFBRSxLQUFrQjtJQUNwRSxJQUFNLElBQUksR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDcEMsT0FBTyxtQkFBbUIsQ0FBQyxJQUFJLHFCQUE0QixFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3RFLENBQUM7QUFFRDs7Ozs7Ozs7OztHQVVHO0FBQ0gsTUFBTSxVQUFVLG1CQUFtQixDQUFDLE1BQWMsRUFBRSxLQUFrQjtJQUNwRSxJQUFNLElBQUksR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDcEMsT0FBTyxtQkFBbUIsQ0FBQyxJQUFJLHFCQUE0QixFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3RFLENBQUM7QUFFRDs7Ozs7Ozs7OztHQVVHO0FBQ0gsTUFBTSxVQUFVLHVCQUF1QixDQUFDLE1BQWMsRUFBRSxLQUFrQjtJQUN4RSxJQUFNLElBQUksR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDcEMsSUFBTSxrQkFBa0IsR0FBYSxJQUFJLHlCQUFnQyxDQUFDO0lBQzFFLE9BQU8sbUJBQW1CLENBQUMsa0JBQWtCLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDeEQsQ0FBQztBQUVEOzs7Ozs7Ozs7R0FTRztBQUNILE1BQU0sVUFBVSxxQkFBcUIsQ0FBQyxNQUFjLEVBQUUsTUFBb0I7SUFDeEUsSUFBTSxJQUFJLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3BDLElBQU0sR0FBRyxHQUFHLElBQUksd0JBQStCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDeEQsSUFBSSxPQUFPLEdBQUcsS0FBSyxXQUFXLEVBQUU7UUFDOUIsSUFBSSxNQUFNLEtBQUssWUFBWSxDQUFDLGVBQWUsRUFBRTtZQUMzQyxPQUFPLElBQUksd0JBQStCLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ2xFO2FBQU0sSUFBSSxNQUFNLEtBQUssWUFBWSxDQUFDLGFBQWEsRUFBRTtZQUNoRCxPQUFPLElBQUksd0JBQStCLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ2hFO0tBQ0Y7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWtDRztBQUNILE1BQU0sVUFBVSxxQkFBcUIsQ0FBQyxNQUFjLEVBQUUsSUFBdUI7SUFDM0UsSUFBTSxJQUFJLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3BDLE9BQU8sSUFBSSx3QkFBK0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNuRCxDQUFDO0FBRUQ7Ozs7Ozs7Ozs7R0FVRztBQUNILE1BQU0sVUFBVSx1QkFBdUIsQ0FBQyxNQUFjO0lBQ3BELElBQU0sSUFBSSxHQUFHLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNwQyxPQUFPLElBQUkseUJBQWdDLElBQUksSUFBSSxDQUFDO0FBQ3RELENBQUM7QUFFRDs7Ozs7Ozs7O0dBU0c7QUFDSCxNQUFNLFVBQVUscUJBQXFCLENBQUMsTUFBYztJQUNsRCxJQUFNLElBQUksR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDcEMsT0FBTyxJQUFJLHVCQUE4QixJQUFJLElBQUksQ0FBQztBQUNwRCxDQUFDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxTQUFTLG1CQUFtQixDQUFDLE1BQWM7SUFDekMsSUFBTSxJQUFJLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3BDLE9BQU8sSUFBSSxxQkFBNEIsQ0FBQztBQUMxQyxDQUFDO0FBRUQ7Ozs7Ozs7OztHQVNHO0FBQ0gsTUFBTSxVQUFVLG1CQUFtQixDQUFDLE1BQWM7SUFDaEQsSUFBTSxJQUFJLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3BDLE9BQU8sSUFBSSxxQkFBNEIsQ0FBQztBQUMxQyxDQUFDO0FBRUQsU0FBUyxhQUFhLENBQUMsSUFBUztJQUM5QixJQUFJLENBQUMsSUFBSSxvQkFBMkIsRUFBRTtRQUNwQyxNQUFNLElBQUksS0FBSyxDQUNYLGdEQUE2QyxJQUFJLGtCQUEwQix3R0FBZ0csQ0FBQyxDQUFDO0tBQ2xMO0FBQ0gsQ0FBQztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FxQkc7QUFDSCxNQUFNLFVBQVUsNEJBQTRCLENBQUMsTUFBYztJQUN6RCxJQUFNLElBQUksR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDcEMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3BCLElBQU0sS0FBSyxHQUFHLElBQUksb0JBQTJCLDhCQUEyQyxJQUFJLEVBQUUsQ0FBQztJQUMvRixPQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQyxJQUErQjtRQUMvQyxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtZQUM1QixPQUFPLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMxQjtRQUNELE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEQsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFDSCxNQUFNLFVBQVUsd0JBQXdCLENBQ3BDLE1BQWMsRUFBRSxTQUFvQixFQUFFLEtBQXVCO0lBQy9ELElBQU0sSUFBSSxHQUFHLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNwQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEIsSUFBTSxjQUFjLEdBQWlCO1FBQ25DLElBQUksb0JBQTJCLCtCQUE0QztRQUMzRSxJQUFJLG9CQUEyQixrQ0FBK0M7S0FDL0UsQ0FBQztJQUNGLElBQU0sVUFBVSxHQUFHLG1CQUFtQixDQUFDLGNBQWMsRUFBRSxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDeEUsT0FBTyxtQkFBbUIsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3RELENBQUM7QUFFRDs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCxTQUFTLG1CQUFtQixDQUFJLElBQVMsRUFBRSxLQUFhO0lBQ3RELEtBQUssSUFBSSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUMvQixJQUFJLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLFdBQVcsRUFBRTtZQUNsQyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNoQjtLQUNGO0lBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO0FBQzVELENBQUM7QUFZRDs7R0FFRztBQUNILFNBQVMsV0FBVyxDQUFDLElBQVk7SUFDekIsSUFBQSx1Q0FBd0IsRUFBdkIsU0FBQyxFQUFFLFNBQW9CLENBQUM7SUFDL0IsT0FBTyxFQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQztBQUNsQyxDQUFDO0FBRUQ7Ozs7Ozs7O0dBUUc7QUFDSCxNQUFNLFVBQVUsY0FBYyxDQUFDLE1BQWM7SUFDM0MsSUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztJQUVqRSxJQUFJLEtBQUssR0FBRyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUMxQyxJQUFJLEtBQUssRUFBRTtRQUNULE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFFRCxvQ0FBb0M7SUFDcEMsSUFBTSxZQUFZLEdBQUcsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BELEtBQUssR0FBRyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7SUFFbEMsSUFBSSxLQUFLLEVBQUU7UUFDVCxPQUFPLEtBQUssQ0FBQztLQUNkO0lBRUQsSUFBSSxZQUFZLEtBQUssSUFBSSxFQUFFO1FBQ3pCLE9BQU8sUUFBUSxDQUFDO0tBQ2pCO0lBRUQsTUFBTSxJQUFJLEtBQUssQ0FBQywwQ0FBdUMsTUFBTSxRQUFJLENBQUMsQ0FBQztBQUNyRSxDQUFDO0FBRUQ7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFDSCxNQUFNLFVBQVUsaUJBQWlCLENBQUMsSUFBWSxFQUFFLE1BQXlCLEVBQUUsTUFBYTtJQUFiLHVCQUFBLEVBQUEsYUFBYTtJQUN0RixJQUFNLFFBQVEsR0FBRyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2hGLElBQU0sWUFBWSxHQUFHLFFBQVEsc0JBQTRCLENBQUM7SUFFMUQsSUFBSSxNQUFNLEtBQUssUUFBUSxJQUFJLE9BQU8sWUFBWSxLQUFLLFFBQVEsRUFBRTtRQUMzRCxPQUFPLFlBQVksQ0FBQztLQUNyQjtJQUVELE9BQU8sUUFBUSxnQkFBc0IsSUFBSSxJQUFJLENBQUM7QUFDaEQsQ0FBQztBQUVELDBEQUEwRDtBQUMxRCxJQUFNLDZCQUE2QixHQUFHLENBQUMsQ0FBQztBQUV4Qzs7Ozs7Ozs7O0dBU0c7QUFDSCxNQUFNLFVBQVUseUJBQXlCLENBQUMsSUFBWTtJQUNwRCxJQUFJLE1BQU0sQ0FBQztJQUNYLElBQU0sUUFBUSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyQyxJQUFJLFFBQVEsRUFBRTtRQUNaLE1BQU0sR0FBRyxRQUFRLG9CQUEwQixDQUFDO0tBQzdDO0lBQ0QsT0FBTyxPQUFPLE1BQU0sS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsNkJBQTZCLENBQUM7QUFDN0UsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IGxvY2FsZUVuIGZyb20gJy4vbG9jYWxlX2VuJztcbmltcG9ydCB7TE9DQUxFX0RBVEEsIExvY2FsZURhdGFJbmRleCwgRXh0cmFMb2NhbGVEYXRhSW5kZXgsIEN1cnJlbmN5SW5kZXh9IGZyb20gJy4vbG9jYWxlX2RhdGEnO1xuaW1wb3J0IHtDVVJSRU5DSUVTX0VOLCBDdXJyZW5jaWVzU3ltYm9sc30gZnJvbSAnLi9jdXJyZW5jaWVzJztcblxuLyoqXG4gKiBGb3JtYXQgc3R5bGVzIHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVwcmVzZW50IG51bWJlcnMuXG4gKiBAc2VlIGBnZXRMb2NhbGVOdW1iZXJGb3JtYXQoKWAuXG4gKiBAc2VlIFtJbnRlcm5hdGlvbmFsaXphdGlvbiAoaTE4bikgR3VpZGVdKGh0dHBzOi8vYW5ndWxhci5pby9ndWlkZS9pMThuKVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGVudW0gTnVtYmVyRm9ybWF0U3R5bGUge1xuICBEZWNpbWFsLFxuICBQZXJjZW50LFxuICBDdXJyZW5jeSxcbiAgU2NpZW50aWZpY1xufVxuXG4vKipcbiAqIFBsdXJhbGl0eSBjYXNlcyB1c2VkIGZvciB0cmFuc2xhdGluZyBwbHVyYWxzIHRvIGRpZmZlcmVudCBsYW5ndWFnZXMuXG4gKlxuICogQHNlZSBgTmdQbHVyYWxgXG4gKiBAc2VlIGBOZ1BsdXJhbENhc2VgXG4gKiBAc2VlIFtJbnRlcm5hdGlvbmFsaXphdGlvbiAoaTE4bikgR3VpZGVdKGh0dHBzOi8vYW5ndWxhci5pby9ndWlkZS9pMThuKVxuICpcbiAqIEBwdWJsaWNBcGkgKi9cbmV4cG9ydCBlbnVtIFBsdXJhbCB7XG4gIFplcm8gPSAwLFxuICBPbmUgPSAxLFxuICBUd28gPSAyLFxuICBGZXcgPSAzLFxuICBNYW55ID0gNCxcbiAgT3RoZXIgPSA1LFxufVxuXG4vKipcbiAqIENvbnRleHQtZGVwZW5kYW50IHRyYW5zbGF0aW9uIGZvcm1zIGZvciBzdHJpbmdzLlxuICogVHlwaWNhbGx5IHRoZSBzdGFuZGFsb25lIHZlcnNpb24gaXMgZm9yIHRoZSBub21pbmF0aXZlIGZvcm0gb2YgdGhlIHdvcmQsXG4gKiBhbmQgdGhlIGZvcm1hdCB2ZXJzaW9uIGlzIHVzZWQgZm9yIHRoZSBnZW5pdGl2ZSBjYXNlLlxuICogQHNlZSBbQ0xEUiB3ZWJzaXRlXShodHRwOi8vY2xkci51bmljb2RlLm9yZy90cmFuc2xhdGlvbi9kYXRlLXRpbWUjVE9DLVN0YW5kLUFsb25lLXZzLi1Gb3JtYXQtU3R5bGVzKVxuICogQHNlZSBbSW50ZXJuYXRpb25hbGl6YXRpb24gKGkxOG4pIEd1aWRlXShodHRwczovL2FuZ3VsYXIuaW8vZ3VpZGUvaTE4bilcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBlbnVtIEZvcm1TdHlsZSB7XG4gIEZvcm1hdCxcbiAgU3RhbmRhbG9uZVxufVxuXG4vKipcbiAqIFN0cmluZyB3aWR0aHMgYXZhaWxhYmxlIGZvciB0cmFuc2xhdGlvbnMuXG4gKiBUaGUgc3BlY2lmaWMgY2hhcmFjdGVyIHdpZHRocyBhcmUgbG9jYWxlLXNwZWNpZmljLlxuICogRXhhbXBsZXMgYXJlIGdpdmVuIGZvciB0aGUgd29yZCBcIlN1bmRheVwiIGluIEVuZ2xpc2guXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgZW51bSBUcmFuc2xhdGlvbldpZHRoIHtcbiAgLyoqIDEgY2hhcmFjdGVyIGZvciBgZW4tVVNgLiBGb3IgZXhhbXBsZTogJ1MnICovXG4gIE5hcnJvdyxcbiAgLyoqIDMgY2hhcmFjdGVycyBmb3IgYGVuLVVTYC4gRm9yIGV4YW1wbGU6ICdTdW4nICovXG4gIEFiYnJldmlhdGVkLFxuICAvKiogRnVsbCBsZW5ndGggZm9yIGBlbi1VU2AuIEZvciBleGFtcGxlOiBcIlN1bmRheVwiICovXG4gIFdpZGUsXG4gIC8qKiAyIGNoYXJhY3RlcnMgZm9yIGBlbi1VU2AsIEZvciBleGFtcGxlOiBcIlN1XCIgKi9cbiAgU2hvcnRcbn1cblxuLyoqXG4gKiBTdHJpbmcgd2lkdGhzIGF2YWlsYWJsZSBmb3IgZGF0ZS10aW1lIGZvcm1hdHMuXG4gKiBUaGUgc3BlY2lmaWMgY2hhcmFjdGVyIHdpZHRocyBhcmUgbG9jYWxlLXNwZWNpZmljLlxuICogRXhhbXBsZXMgYXJlIGdpdmVuIGZvciBgZW4tVVNgLlxuICpcbiAqIEBzZWUgYGdldExvY2FsZURhdGVGb3JtYXQoKWBcbiAqIEBzZWUgYGdldExvY2FsZVRpbWVGb3JtYXQoKWBgXG4gKiBAc2VlIGBnZXRMb2NhbGVEYXRlVGltZUZvcm1hdCgpYFxuICogQHNlZSBbSW50ZXJuYXRpb25hbGl6YXRpb24gKGkxOG4pIEd1aWRlXShodHRwczovL2FuZ3VsYXIuaW8vZ3VpZGUvaTE4bilcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGVudW0gRm9ybWF0V2lkdGgge1xuICAvKipcbiAgICogRm9yIGBlbi1VU2AsICdNL2QveXksIGg6bW0gYSdgXG4gICAqIChFeGFtcGxlOiBgNi8xNS8xNSwgOTowMyBBTWApXG4gICAqL1xuICBTaG9ydCxcbiAgLyoqXG4gICAqIEZvciBgZW4tVVNgLCBgJ01NTSBkLCB5LCBoOm1tOnNzIGEnYFxuICAgKiAoRXhhbXBsZTogYEp1biAxNSwgMjAxNSwgOTowMzowMSBBTWApXG4gICAqL1xuICBNZWRpdW0sXG4gIC8qKlxuICAgKiBGb3IgYGVuLVVTYCwgYCdNTU1NIGQsIHksIGg6bW06c3MgYSB6J2BcbiAgICogKEV4YW1wbGU6IGBKdW5lIDE1LCAyMDE1IGF0IDk6MDM6MDEgQU0gR01UKzFgKVxuICAgKi9cbiAgTG9uZyxcbiAgLyoqXG4gICAqIEZvciBgZW4tVVNgLCBgJ0VFRUUsIE1NTU0gZCwgeSwgaDptbTpzcyBhIHp6enonYFxuICAgKiAoRXhhbXBsZTogYE1vbmRheSwgSnVuZSAxNSwgMjAxNSBhdCA5OjAzOjAxIEFNIEdNVCswMTowMGApXG4gICAqL1xuICBGdWxsXG59XG5cbi8qKlxuICogU3ltYm9scyB0aGF0IGNhbiBiZSB1c2VkIHRvIHJlcGxhY2UgcGxhY2Vob2xkZXJzIGluIG51bWJlciBwYXR0ZXJucy5cbiAqIEV4YW1wbGVzIGFyZSBiYXNlZCBvbiBgZW4tVVNgIHZhbHVlcy5cbiAqXG4gKiBAc2VlIGBnZXRMb2NhbGVOdW1iZXJTeW1ib2woKWBcbiAqIEBzZWUgW0ludGVybmF0aW9uYWxpemF0aW9uIChpMThuKSBHdWlkZV0oaHR0cHM6Ly9hbmd1bGFyLmlvL2d1aWRlL2kxOG4pXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgZW51bSBOdW1iZXJTeW1ib2wge1xuICAvKipcbiAgICogRGVjaW1hbCBzZXBhcmF0b3IuXG4gICAqIEZvciBgZW4tVVNgLCB0aGUgZG90IGNoYXJhY3Rlci5cbiAgICogRXhhbXBsZSA6IDIsMzQ1YC5gNjdcbiAgICovXG4gIERlY2ltYWwsXG4gIC8qKlxuICAgKiBHcm91cGluZyBzZXBhcmF0b3IsIHR5cGljYWxseSBmb3IgdGhvdXNhbmRzLlxuICAgKiBGb3IgYGVuLVVTYCwgdGhlIGNvbW1hIGNoYXJhY3Rlci5cbiAgICogRXhhbXBsZTogMmAsYDM0NS42N1xuICAgKi9cbiAgR3JvdXAsXG4gIC8qKlxuICAgKiBMaXN0LWl0ZW0gc2VwYXJhdG9yLlxuICAgKiBFeGFtcGxlOiBcIm9uZSwgdHdvLCBhbmQgdGhyZWVcIlxuICAgKi9cbiAgTGlzdCxcbiAgLyoqXG4gICAqIFNpZ24gZm9yIHBlcmNlbnRhZ2UgKG91dCBvZiAxMDApLlxuICAgKiBFeGFtcGxlOiAyMy40JVxuICAgKi9cbiAgUGVyY2VudFNpZ24sXG4gIC8qKlxuICAgKiBTaWduIGZvciBwb3NpdGl2ZSBudW1iZXJzLlxuICAgKiBFeGFtcGxlOiArMjNcbiAgICovXG4gIFBsdXNTaWduLFxuICAvKipcbiAgICogU2lnbiBmb3IgbmVnYXRpdmUgbnVtYmVycy5cbiAgICogRXhhbXBsZTogLTIzXG4gICAqL1xuICBNaW51c1NpZ24sXG4gIC8qKlxuICAgKiBDb21wdXRlciBub3RhdGlvbiBmb3IgZXhwb25lbnRpYWwgdmFsdWUgKG4gdGltZXMgYSBwb3dlciBvZiAxMCkuXG4gICAqIEV4YW1wbGU6IDEuMkUzXG4gICAqL1xuICBFeHBvbmVudGlhbCxcbiAgLyoqXG4gICAqIEh1bWFuLXJlYWRhYmxlIGZvcm1hdCBvZiBleHBvbmVudGlhbC5cbiAgICogRXhhbXBsZTogMS4yeDEwM1xuICAgKi9cbiAgU3VwZXJzY3JpcHRpbmdFeHBvbmVudCxcbiAgLyoqXG4gICAqIFNpZ24gZm9yIHBlcm1pbGxlIChvdXQgb2YgMTAwMCkuXG4gICAqIEV4YW1wbGU6IDIzLjTigLBcbiAgICovXG4gIFBlck1pbGxlLFxuICAvKipcbiAgICogSW5maW5pdHksIGNhbiBiZSB1c2VkIHdpdGggcGx1cyBhbmQgbWludXMuXG4gICAqIEV4YW1wbGU6IOKIniwgK+KIniwgLeKInlxuICAgKi9cbiAgSW5maW5pdHksXG4gIC8qKlxuICAgKiBOb3QgYSBudW1iZXIuXG4gICAqIEV4YW1wbGU6IE5hTlxuICAgKi9cbiAgTmFOLFxuICAvKipcbiAgICogU3ltYm9sIHVzZWQgYmV0d2VlbiB0aW1lIHVuaXRzLlxuICAgKiBFeGFtcGxlOiAxMDo1MlxuICAgKi9cbiAgVGltZVNlcGFyYXRvcixcbiAgLyoqXG4gICAqIERlY2ltYWwgc2VwYXJhdG9yIGZvciBjdXJyZW5jeSB2YWx1ZXMgKGZhbGxiYWNrIHRvIGBEZWNpbWFsYCkuXG4gICAqIEV4YW1wbGU6ICQyLDM0NS42N1xuICAgKi9cbiAgQ3VycmVuY3lEZWNpbWFsLFxuICAvKipcbiAgICogR3JvdXAgc2VwYXJhdG9yIGZvciBjdXJyZW5jeSB2YWx1ZXMgKGZhbGxiYWNrIHRvIGBHcm91cGApLlxuICAgKiBFeGFtcGxlOiAkMiwzNDUuNjdcbiAgICovXG4gIEN1cnJlbmN5R3JvdXBcbn1cblxuLyoqXG4gKiBUaGUgdmFsdWUgZm9yIGVhY2ggZGF5IG9mIHRoZSB3ZWVrLCBiYXNlZCBvbiB0aGUgYGVuLVVTYCBsb2NhbGVcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBlbnVtIFdlZWtEYXkge1xuICBTdW5kYXkgPSAwLFxuICBNb25kYXksXG4gIFR1ZXNkYXksXG4gIFdlZG5lc2RheSxcbiAgVGh1cnNkYXksXG4gIEZyaWRheSxcbiAgU2F0dXJkYXlcbn1cblxuLyoqXG4gKiBSZXRyaWV2ZXMgdGhlIGxvY2FsZSBJRCBmcm9tIHRoZSBjdXJyZW50bHkgbG9hZGVkIGxvY2FsZS5cbiAqIFRoZSBsb2FkZWQgbG9jYWxlIGNvdWxkIGJlLCBmb3IgZXhhbXBsZSwgYSBnbG9iYWwgb25lIHJhdGhlciB0aGFuIGEgcmVnaW9uYWwgb25lLlxuICogQHBhcmFtIGxvY2FsZSBBIGxvY2FsZSBjb2RlLCBzdWNoIGFzIGBmci1GUmAuXG4gKiBAcmV0dXJucyBUaGUgbG9jYWxlIGNvZGUuIEZvciBleGFtcGxlLCBgZnJgLlxuICogQHNlZSBbSW50ZXJuYXRpb25hbGl6YXRpb24gKGkxOG4pIEd1aWRlXShodHRwczovL2FuZ3VsYXIuaW8vZ3VpZGUvaTE4bilcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRMb2NhbGVJZChsb2NhbGU6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBmaW5kTG9jYWxlRGF0YShsb2NhbGUpW0xvY2FsZURhdGFJbmRleC5Mb2NhbGVJZF07XG59XG5cbi8qKlxuICogUmV0cmlldmVzIGRheSBwZXJpb2Qgc3RyaW5ncyBmb3IgdGhlIGdpdmVuIGxvY2FsZS5cbiAqXG4gKiBAcGFyYW0gbG9jYWxlIEEgbG9jYWxlIGNvZGUgZm9yIHRoZSBsb2NhbGUgZm9ybWF0IHJ1bGVzIHRvIHVzZS5cbiAqIEBwYXJhbSBmb3JtU3R5bGUgVGhlIHJlcXVpcmVkIGdyYW1tYXRpY2FsIGZvcm0uXG4gKiBAcGFyYW0gd2lkdGggVGhlIHJlcXVpcmVkIGNoYXJhY3RlciB3aWR0aC5cbiAqIEByZXR1cm5zIEFuIGFycmF5IG9mIGxvY2FsaXplZCBwZXJpb2Qgc3RyaW5ncy4gRm9yIGV4YW1wbGUsIGBbQU0sIFBNXWAgZm9yIGBlbi1VU2AuXG4gKiBAc2VlIFtJbnRlcm5hdGlvbmFsaXphdGlvbiAoaTE4bikgR3VpZGVdKGh0dHBzOi8vYW5ndWxhci5pby9ndWlkZS9pMThuKVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldExvY2FsZURheVBlcmlvZHMoXG4gICAgbG9jYWxlOiBzdHJpbmcsIGZvcm1TdHlsZTogRm9ybVN0eWxlLCB3aWR0aDogVHJhbnNsYXRpb25XaWR0aCk6IFtzdHJpbmcsIHN0cmluZ10ge1xuICBjb25zdCBkYXRhID0gZmluZExvY2FsZURhdGEobG9jYWxlKTtcbiAgY29uc3QgYW1QbURhdGEgPSA8W1xuICAgIHN0cmluZywgc3RyaW5nXG4gIF1bXVtdPltkYXRhW0xvY2FsZURhdGFJbmRleC5EYXlQZXJpb2RzRm9ybWF0XSwgZGF0YVtMb2NhbGVEYXRhSW5kZXguRGF5UGVyaW9kc1N0YW5kYWxvbmVdXTtcbiAgY29uc3QgYW1QbSA9IGdldExhc3REZWZpbmVkVmFsdWUoYW1QbURhdGEsIGZvcm1TdHlsZSk7XG4gIHJldHVybiBnZXRMYXN0RGVmaW5lZFZhbHVlKGFtUG0sIHdpZHRoKTtcbn1cblxuLyoqXG4gKiBSZXRyaWV2ZXMgZGF5cyBvZiB0aGUgd2VlayBmb3IgdGhlIGdpdmVuIGxvY2FsZSwgdXNpbmcgdGhlIEdyZWdvcmlhbiBjYWxlbmRhci5cbiAqXG4gKiBAcGFyYW0gbG9jYWxlIEEgbG9jYWxlIGNvZGUgZm9yIHRoZSBsb2NhbGUgZm9ybWF0IHJ1bGVzIHRvIHVzZS5cbiAqIEBwYXJhbSBmb3JtU3R5bGUgVGhlIHJlcXVpcmVkIGdyYW1tYXRpY2FsIGZvcm0uXG4gKiBAcGFyYW0gd2lkdGggVGhlIHJlcXVpcmVkIGNoYXJhY3RlciB3aWR0aC5cbiAqIEByZXR1cm5zIEFuIGFycmF5IG9mIGxvY2FsaXplZCBuYW1lIHN0cmluZ3MuXG4gKiBGb3IgZXhhbXBsZSxgW1N1bmRheSwgTW9uZGF5LCAuLi4gU2F0dXJkYXldYCBmb3IgYGVuLVVTYC5cbiAqIEBzZWUgW0ludGVybmF0aW9uYWxpemF0aW9uIChpMThuKSBHdWlkZV0oaHR0cHM6Ly9hbmd1bGFyLmlvL2d1aWRlL2kxOG4pXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9jYWxlRGF5TmFtZXMoXG4gICAgbG9jYWxlOiBzdHJpbmcsIGZvcm1TdHlsZTogRm9ybVN0eWxlLCB3aWR0aDogVHJhbnNsYXRpb25XaWR0aCk6IHN0cmluZ1tdIHtcbiAgY29uc3QgZGF0YSA9IGZpbmRMb2NhbGVEYXRhKGxvY2FsZSk7XG4gIGNvbnN0IGRheXNEYXRhID1cbiAgICAgIDxzdHJpbmdbXVtdW10+W2RhdGFbTG9jYWxlRGF0YUluZGV4LkRheXNGb3JtYXRdLCBkYXRhW0xvY2FsZURhdGFJbmRleC5EYXlzU3RhbmRhbG9uZV1dO1xuICBjb25zdCBkYXlzID0gZ2V0TGFzdERlZmluZWRWYWx1ZShkYXlzRGF0YSwgZm9ybVN0eWxlKTtcbiAgcmV0dXJuIGdldExhc3REZWZpbmVkVmFsdWUoZGF5cywgd2lkdGgpO1xufVxuXG4vKipcbiAqIFJldHJpZXZlcyBtb250aHMgb2YgdGhlIHllYXIgZm9yIHRoZSBnaXZlbiBsb2NhbGUsIHVzaW5nIHRoZSBHcmVnb3JpYW4gY2FsZW5kYXIuXG4gKlxuICogQHBhcmFtIGxvY2FsZSBBIGxvY2FsZSBjb2RlIGZvciB0aGUgbG9jYWxlIGZvcm1hdCBydWxlcyB0byB1c2UuXG4gKiBAcGFyYW0gZm9ybVN0eWxlIFRoZSByZXF1aXJlZCBncmFtbWF0aWNhbCBmb3JtLlxuICogQHBhcmFtIHdpZHRoIFRoZSByZXF1aXJlZCBjaGFyYWN0ZXIgd2lkdGguXG4gKiBAcmV0dXJucyBBbiBhcnJheSBvZiBsb2NhbGl6ZWQgbmFtZSBzdHJpbmdzLlxuICogRm9yIGV4YW1wbGUsICBgW0phbnVhcnksIEZlYnJ1YXJ5LCAuLi5dYCBmb3IgYGVuLVVTYC5cbiAqIEBzZWUgW0ludGVybmF0aW9uYWxpemF0aW9uIChpMThuKSBHdWlkZV0oaHR0cHM6Ly9hbmd1bGFyLmlvL2d1aWRlL2kxOG4pXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9jYWxlTW9udGhOYW1lcyhcbiAgICBsb2NhbGU6IHN0cmluZywgZm9ybVN0eWxlOiBGb3JtU3R5bGUsIHdpZHRoOiBUcmFuc2xhdGlvbldpZHRoKTogc3RyaW5nW10ge1xuICBjb25zdCBkYXRhID0gZmluZExvY2FsZURhdGEobG9jYWxlKTtcbiAgY29uc3QgbW9udGhzRGF0YSA9XG4gICAgICA8c3RyaW5nW11bXVtdPltkYXRhW0xvY2FsZURhdGFJbmRleC5Nb250aHNGb3JtYXRdLCBkYXRhW0xvY2FsZURhdGFJbmRleC5Nb250aHNTdGFuZGFsb25lXV07XG4gIGNvbnN0IG1vbnRocyA9IGdldExhc3REZWZpbmVkVmFsdWUobW9udGhzRGF0YSwgZm9ybVN0eWxlKTtcbiAgcmV0dXJuIGdldExhc3REZWZpbmVkVmFsdWUobW9udGhzLCB3aWR0aCk7XG59XG5cbi8qKlxuICogUmV0cmlldmVzIEdyZWdvcmlhbi1jYWxlbmRhciBlcmFzIGZvciB0aGUgZ2l2ZW4gbG9jYWxlLlxuICogQHBhcmFtIGxvY2FsZSBBIGxvY2FsZSBjb2RlIGZvciB0aGUgbG9jYWxlIGZvcm1hdCBydWxlcyB0byB1c2UuXG4gKiBAcGFyYW0gZm9ybVN0eWxlIFRoZSByZXF1aXJlZCBncmFtbWF0aWNhbCBmb3JtLlxuICogQHBhcmFtIHdpZHRoIFRoZSByZXF1aXJlZCBjaGFyYWN0ZXIgd2lkdGguXG5cbiAqIEByZXR1cm5zIEFuIGFycmF5IG9mIGxvY2FsaXplZCBlcmEgc3RyaW5ncy5cbiAqIEZvciBleGFtcGxlLCBgW0FELCBCQ11gIGZvciBgZW4tVVNgLlxuICogQHNlZSBbSW50ZXJuYXRpb25hbGl6YXRpb24gKGkxOG4pIEd1aWRlXShodHRwczovL2FuZ3VsYXIuaW8vZ3VpZGUvaTE4bilcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRMb2NhbGVFcmFOYW1lcyhsb2NhbGU6IHN0cmluZywgd2lkdGg6IFRyYW5zbGF0aW9uV2lkdGgpOiBbc3RyaW5nLCBzdHJpbmddIHtcbiAgY29uc3QgZGF0YSA9IGZpbmRMb2NhbGVEYXRhKGxvY2FsZSk7XG4gIGNvbnN0IGVyYXNEYXRhID0gPFtzdHJpbmcsIHN0cmluZ11bXT5kYXRhW0xvY2FsZURhdGFJbmRleC5FcmFzXTtcbiAgcmV0dXJuIGdldExhc3REZWZpbmVkVmFsdWUoZXJhc0RhdGEsIHdpZHRoKTtcbn1cblxuLyoqXG4gKiBSZXRyaWV2ZXMgdGhlIGZpcnN0IGRheSBvZiB0aGUgd2VlayBmb3IgdGhlIGdpdmVuIGxvY2FsZS5cbiAqXG4gKiBAcGFyYW0gbG9jYWxlIEEgbG9jYWxlIGNvZGUgZm9yIHRoZSBsb2NhbGUgZm9ybWF0IHJ1bGVzIHRvIHVzZS5cbiAqIEByZXR1cm5zIEEgZGF5IGluZGV4IG51bWJlciwgdXNpbmcgdGhlIDAtYmFzZWQgd2Vlay1kYXkgaW5kZXggZm9yIGBlbi1VU2BcbiAqIChTdW5kYXkgPSAwLCBNb25kYXkgPSAxLCAuLi4pLlxuICogRm9yIGV4YW1wbGUsIGZvciBgZnItRlJgLCByZXR1cm5zIDEgdG8gaW5kaWNhdGUgdGhhdCB0aGUgZmlyc3QgZGF5IGlzIE1vbmRheS5cbiAqIEBzZWUgW0ludGVybmF0aW9uYWxpemF0aW9uIChpMThuKSBHdWlkZV0oaHR0cHM6Ly9hbmd1bGFyLmlvL2d1aWRlL2kxOG4pXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9jYWxlRmlyc3REYXlPZldlZWsobG9jYWxlOiBzdHJpbmcpOiBXZWVrRGF5IHtcbiAgY29uc3QgZGF0YSA9IGZpbmRMb2NhbGVEYXRhKGxvY2FsZSk7XG4gIHJldHVybiBkYXRhW0xvY2FsZURhdGFJbmRleC5GaXJzdERheU9mV2Vla107XG59XG5cbi8qKlxuICogUmFuZ2Ugb2Ygd2VlayBkYXlzIHRoYXQgYXJlIGNvbnNpZGVyZWQgdGhlIHdlZWstZW5kIGZvciB0aGUgZ2l2ZW4gbG9jYWxlLlxuICpcbiAqIEBwYXJhbSBsb2NhbGUgQSBsb2NhbGUgY29kZSBmb3IgdGhlIGxvY2FsZSBmb3JtYXQgcnVsZXMgdG8gdXNlLlxuICogQHJldHVybnMgVGhlIHJhbmdlIG9mIGRheSB2YWx1ZXMsIGBbc3RhcnREYXksIGVuZERheV1gLlxuICogQHNlZSBbSW50ZXJuYXRpb25hbGl6YXRpb24gKGkxOG4pIEd1aWRlXShodHRwczovL2FuZ3VsYXIuaW8vZ3VpZGUvaTE4bilcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRMb2NhbGVXZWVrRW5kUmFuZ2UobG9jYWxlOiBzdHJpbmcpOiBbV2Vla0RheSwgV2Vla0RheV0ge1xuICBjb25zdCBkYXRhID0gZmluZExvY2FsZURhdGEobG9jYWxlKTtcbiAgcmV0dXJuIGRhdGFbTG9jYWxlRGF0YUluZGV4LldlZWtlbmRSYW5nZV07XG59XG5cbi8qKlxuICogUmV0cmlldmVzIGEgbG9jYWxpemVkIGRhdGUtdmFsdWUgZm9ybWF0aW5nIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0gbG9jYWxlIEEgbG9jYWxlIGNvZGUgZm9yIHRoZSBsb2NhbGUgZm9ybWF0IHJ1bGVzIHRvIHVzZS5cbiAqIEBwYXJhbSB3aWR0aCBUaGUgZm9ybWF0IHR5cGUuXG4gKiBAcmV0dXJucyBUaGUgbG9jYWxpemVkIGZvcm1hdGluZyBzdHJpbmcuXG4gKiBAc2VlIGBGb3JtYXRXaWR0aGBcbiAqIEBzZWUgW0ludGVybmF0aW9uYWxpemF0aW9uIChpMThuKSBHdWlkZV0oaHR0cHM6Ly9hbmd1bGFyLmlvL2d1aWRlL2kxOG4pXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9jYWxlRGF0ZUZvcm1hdChsb2NhbGU6IHN0cmluZywgd2lkdGg6IEZvcm1hdFdpZHRoKTogc3RyaW5nIHtcbiAgY29uc3QgZGF0YSA9IGZpbmRMb2NhbGVEYXRhKGxvY2FsZSk7XG4gIHJldHVybiBnZXRMYXN0RGVmaW5lZFZhbHVlKGRhdGFbTG9jYWxlRGF0YUluZGV4LkRhdGVGb3JtYXRdLCB3aWR0aCk7XG59XG5cbi8qKlxuICogUmV0cmlldmVzIGEgbG9jYWxpemVkIHRpbWUtdmFsdWUgZm9ybWF0dGluZyBzdHJpbmcuXG4gKlxuICogQHBhcmFtIGxvY2FsZSBBIGxvY2FsZSBjb2RlIGZvciB0aGUgbG9jYWxlIGZvcm1hdCBydWxlcyB0byB1c2UuXG4gKiBAcGFyYW0gd2lkdGggVGhlIGZvcm1hdCB0eXBlLlxuICogQHJldHVybnMgVGhlIGxvY2FsaXplZCBmb3JtYXR0aW5nIHN0cmluZy5cbiAqIEBzZWUgYEZvcm1hdFdpZHRoYFxuICogQHNlZSBbSW50ZXJuYXRpb25hbGl6YXRpb24gKGkxOG4pIEd1aWRlXShodHRwczovL2FuZ3VsYXIuaW8vZ3VpZGUvaTE4bilcblxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9jYWxlVGltZUZvcm1hdChsb2NhbGU6IHN0cmluZywgd2lkdGg6IEZvcm1hdFdpZHRoKTogc3RyaW5nIHtcbiAgY29uc3QgZGF0YSA9IGZpbmRMb2NhbGVEYXRhKGxvY2FsZSk7XG4gIHJldHVybiBnZXRMYXN0RGVmaW5lZFZhbHVlKGRhdGFbTG9jYWxlRGF0YUluZGV4LlRpbWVGb3JtYXRdLCB3aWR0aCk7XG59XG5cbi8qKlxuICogUmV0cmlldmVzIGEgbG9jYWxpemVkIGRhdGUtdGltZSBmb3JtYXR0aW5nIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0gbG9jYWxlIEEgbG9jYWxlIGNvZGUgZm9yIHRoZSBsb2NhbGUgZm9ybWF0IHJ1bGVzIHRvIHVzZS5cbiAqIEBwYXJhbSB3aWR0aCBUaGUgZm9ybWF0IHR5cGUuXG4gKiBAcmV0dXJucyBUaGUgbG9jYWxpemVkIGZvcm1hdHRpbmcgc3RyaW5nLlxuICogQHNlZSBgRm9ybWF0V2lkdGhgXG4gKiBAc2VlIFtJbnRlcm5hdGlvbmFsaXphdGlvbiAoaTE4bikgR3VpZGVdKGh0dHBzOi8vYW5ndWxhci5pby9ndWlkZS9pMThuKVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldExvY2FsZURhdGVUaW1lRm9ybWF0KGxvY2FsZTogc3RyaW5nLCB3aWR0aDogRm9ybWF0V2lkdGgpOiBzdHJpbmcge1xuICBjb25zdCBkYXRhID0gZmluZExvY2FsZURhdGEobG9jYWxlKTtcbiAgY29uc3QgZGF0ZVRpbWVGb3JtYXREYXRhID0gPHN0cmluZ1tdPmRhdGFbTG9jYWxlRGF0YUluZGV4LkRhdGVUaW1lRm9ybWF0XTtcbiAgcmV0dXJuIGdldExhc3REZWZpbmVkVmFsdWUoZGF0ZVRpbWVGb3JtYXREYXRhLCB3aWR0aCk7XG59XG5cbi8qKlxuICogUmV0cmlldmVzIGEgbG9jYWxpemVkIG51bWJlciBzeW1ib2wgdGhhdCBjYW4gYmUgdXNlZCB0byByZXBsYWNlIHBsYWNlaG9sZGVycyBpbiBudW1iZXIgZm9ybWF0cy5cbiAqIEBwYXJhbSBsb2NhbGUgVGhlIGxvY2FsZSBjb2RlLlxuICogQHBhcmFtIHN5bWJvbCBUaGUgc3ltYm9sIHRvIGxvY2FsaXplLlxuICogQHJldHVybnMgVGhlIGNoYXJhY3RlciBmb3IgdGhlIGxvY2FsaXplZCBzeW1ib2wuXG4gKiBAc2VlIGBOdW1iZXJTeW1ib2xgXG4gKiBAc2VlIFtJbnRlcm5hdGlvbmFsaXphdGlvbiAoaTE4bikgR3VpZGVdKGh0dHBzOi8vYW5ndWxhci5pby9ndWlkZS9pMThuKVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldExvY2FsZU51bWJlclN5bWJvbChsb2NhbGU6IHN0cmluZywgc3ltYm9sOiBOdW1iZXJTeW1ib2wpOiBzdHJpbmcge1xuICBjb25zdCBkYXRhID0gZmluZExvY2FsZURhdGEobG9jYWxlKTtcbiAgY29uc3QgcmVzID0gZGF0YVtMb2NhbGVEYXRhSW5kZXguTnVtYmVyU3ltYm9sc11bc3ltYm9sXTtcbiAgaWYgKHR5cGVvZiByZXMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKHN5bWJvbCA9PT0gTnVtYmVyU3ltYm9sLkN1cnJlbmN5RGVjaW1hbCkge1xuICAgICAgcmV0dXJuIGRhdGFbTG9jYWxlRGF0YUluZGV4Lk51bWJlclN5bWJvbHNdW051bWJlclN5bWJvbC5EZWNpbWFsXTtcbiAgICB9IGVsc2UgaWYgKHN5bWJvbCA9PT0gTnVtYmVyU3ltYm9sLkN1cnJlbmN5R3JvdXApIHtcbiAgICAgIHJldHVybiBkYXRhW0xvY2FsZURhdGFJbmRleC5OdW1iZXJTeW1ib2xzXVtOdW1iZXJTeW1ib2wuR3JvdXBdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzO1xufVxuXG4vKipcbiAqIFJldHJpZXZlcyBhIG51bWJlciBmb3JtYXQgZm9yIGEgZ2l2ZW4gbG9jYWxlLlxuICpcbiAqIE51bWJlcnMgYXJlIGZvcm1hdHRlZCB1c2luZyBwYXR0ZXJucywgbGlrZSBgIywjIyMuMDBgLiBGb3IgZXhhbXBsZSwgdGhlIHBhdHRlcm4gYCMsIyMjLjAwYFxuICogd2hlbiB1c2VkIHRvIGZvcm1hdCB0aGUgbnVtYmVyIDEyMzQ1LjY3OCBjb3VsZCByZXN1bHQgaW4gXCIxMiczNDUsNjc4XCIuIFRoYXQgd291bGQgaGFwcGVuIGlmIHRoZVxuICogZ3JvdXBpbmcgc2VwYXJhdG9yIGZvciB5b3VyIGxhbmd1YWdlIGlzIGFuIGFwb3N0cm9waGUsIGFuZCB0aGUgZGVjaW1hbCBzZXBhcmF0b3IgaXMgYSBjb21tYS5cbiAqXG4gKiA8Yj5JbXBvcnRhbnQ6PC9iPiBUaGUgY2hhcmFjdGVycyBgLmAgYCxgIGAwYCBgI2AgKGFuZCBvdGhlcnMgYmVsb3cpIGFyZSBzcGVjaWFsIHBsYWNlaG9sZGVyc1xuICogdGhhdCBzdGFuZCBmb3IgdGhlIGRlY2ltYWwgc2VwYXJhdG9yLCBhbmQgc28gb24sIGFuZCBhcmUgTk9UIHJlYWwgY2hhcmFjdGVycy5cbiAqIFlvdSBtdXN0IE5PVCBcInRyYW5zbGF0ZVwiIHRoZSBwbGFjZWhvbGRlcnMuIEZvciBleGFtcGxlLCBkb24ndCBjaGFuZ2UgYC5gIHRvIGAsYCBldmVuIHRob3VnaCBpblxuICogeW91ciBsYW5ndWFnZSB0aGUgZGVjaW1hbCBwb2ludCBpcyB3cml0dGVuIHdpdGggYSBjb21tYS4gVGhlIHN5bWJvbHMgc2hvdWxkIGJlIHJlcGxhY2VkIGJ5IHRoZVxuICogbG9jYWwgZXF1aXZhbGVudHMsIHVzaW5nIHRoZSBhcHByb3ByaWF0ZSBgTnVtYmVyU3ltYm9sYCBmb3IgeW91ciBsYW5ndWFnZS5cbiAqXG4gKiBIZXJlIGFyZSB0aGUgc3BlY2lhbCBjaGFyYWN0ZXJzIHVzZWQgaW4gbnVtYmVyIHBhdHRlcm5zOlxuICpcbiAqIHwgU3ltYm9sIHwgTWVhbmluZyB8XG4gKiB8LS0tLS0tLS18LS0tLS0tLS0tfFxuICogfCAuIHwgUmVwbGFjZWQgYXV0b21hdGljYWxseSBieSB0aGUgY2hhcmFjdGVyIHVzZWQgZm9yIHRoZSBkZWNpbWFsIHBvaW50LiB8XG4gKiB8ICwgfCBSZXBsYWNlZCBieSB0aGUgXCJncm91cGluZ1wiICh0aG91c2FuZHMpIHNlcGFyYXRvci4gfFxuICogfCAwIHwgUmVwbGFjZWQgYnkgYSBkaWdpdCAob3IgemVybyBpZiB0aGVyZSBhcmVuJ3QgZW5vdWdoIGRpZ2l0cykuIHxcbiAqIHwgIyB8IFJlcGxhY2VkIGJ5IGEgZGlnaXQgKG9yIG5vdGhpbmcgaWYgdGhlcmUgYXJlbid0IGVub3VnaCkuIHxcbiAqIHwgwqQgfCBSZXBsYWNlZCBieSBhIGN1cnJlbmN5IHN5bWJvbCwgc3VjaCBhcyAkIG9yIFVTRC4gfFxuICogfCAlIHwgTWFya3MgYSBwZXJjZW50IGZvcm1hdC4gVGhlICUgc3ltYm9sIG1heSBjaGFuZ2UgcG9zaXRpb24sIGJ1dCBtdXN0IGJlIHJldGFpbmVkLiB8XG4gKiB8IEUgfCBNYXJrcyBhIHNjaWVudGlmaWMgZm9ybWF0LiBUaGUgRSBzeW1ib2wgbWF5IGNoYW5nZSBwb3NpdGlvbiwgYnV0IG11c3QgYmUgcmV0YWluZWQuIHxcbiAqIHwgJyB8IFNwZWNpYWwgY2hhcmFjdGVycyB1c2VkIGFzIGxpdGVyYWwgY2hhcmFjdGVycyBhcmUgcXVvdGVkIHdpdGggQVNDSUkgc2luZ2xlIHF1b3Rlcy4gfFxuICpcbiAqIEBwYXJhbSBsb2NhbGUgQSBsb2NhbGUgY29kZSBmb3IgdGhlIGxvY2FsZSBmb3JtYXQgcnVsZXMgdG8gdXNlLlxuICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgbnVtZXJpYyB2YWx1ZSB0byBiZSBmb3JtYXR0ZWQgKHN1Y2ggYXMgYERlY2ltYWxgIG9yIGBDdXJyZW5jeWAuKVxuICogQHJldHVybnMgVGhlIGxvY2FsaXplZCBmb3JtYXQgc3RyaW5nLlxuICogQHNlZSBgTnVtYmVyRm9ybWF0U3R5bGVgXG4gKiBAc2VlIFtDTERSIHdlYnNpdGVdKGh0dHA6Ly9jbGRyLnVuaWNvZGUub3JnL3RyYW5zbGF0aW9uL251bWJlci1wYXR0ZXJucylcbiAqIEBzZWUgW0ludGVybmF0aW9uYWxpemF0aW9uIChpMThuKSBHdWlkZV0oaHR0cHM6Ly9hbmd1bGFyLmlvL2d1aWRlL2kxOG4pXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9jYWxlTnVtYmVyRm9ybWF0KGxvY2FsZTogc3RyaW5nLCB0eXBlOiBOdW1iZXJGb3JtYXRTdHlsZSk6IHN0cmluZyB7XG4gIGNvbnN0IGRhdGEgPSBmaW5kTG9jYWxlRGF0YShsb2NhbGUpO1xuICByZXR1cm4gZGF0YVtMb2NhbGVEYXRhSW5kZXguTnVtYmVyRm9ybWF0c11bdHlwZV07XG59XG5cbi8qKlxuICogUmV0cmlldmVzIHRoZSBzeW1ib2wgdXNlZCB0byByZXByZXNlbnQgdGhlIGN1cnJlbmN5IGZvciB0aGUgbWFpbiBjb3VudHJ5XG4gKiBjb3JyZXNwb25kaW5nIHRvIGEgZ2l2ZW4gbG9jYWxlLiBGb3IgZXhhbXBsZSwgJyQnIGZvciBgZW4tVVNgLlxuICpcbiAqIEBwYXJhbSBsb2NhbGUgQSBsb2NhbGUgY29kZSBmb3IgdGhlIGxvY2FsZSBmb3JtYXQgcnVsZXMgdG8gdXNlLlxuICogQHJldHVybnMgVGhlIGxvY2FsaXplZCBzeW1ib2wgY2hhcmFjdGVyLFxuICogb3IgYG51bGxgIGlmIHRoZSBtYWluIGNvdW50cnkgY2Fubm90IGJlIGRldGVybWluZWQuXG4gKiBAc2VlIFtJbnRlcm5hdGlvbmFsaXphdGlvbiAoaTE4bikgR3VpZGVdKGh0dHBzOi8vYW5ndWxhci5pby9ndWlkZS9pMThuKVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldExvY2FsZUN1cnJlbmN5U3ltYm9sKGxvY2FsZTogc3RyaW5nKTogc3RyaW5nfG51bGwge1xuICBjb25zdCBkYXRhID0gZmluZExvY2FsZURhdGEobG9jYWxlKTtcbiAgcmV0dXJuIGRhdGFbTG9jYWxlRGF0YUluZGV4LkN1cnJlbmN5U3ltYm9sXSB8fCBudWxsO1xufVxuXG4vKipcbiAqIFJldHJpZXZlcyB0aGUgbmFtZSBvZiB0aGUgY3VycmVuY3kgZm9yIHRoZSBtYWluIGNvdW50cnkgY29ycmVzcG9uZGluZ1xuICogdG8gYSBnaXZlbiBsb2NhbGUuIEZvciBleGFtcGxlLCAnVVMgRG9sbGFyJyBmb3IgYGVuLVVTYC5cbiAqIEBwYXJhbSBsb2NhbGUgQSBsb2NhbGUgY29kZSBmb3IgdGhlIGxvY2FsZSBmb3JtYXQgcnVsZXMgdG8gdXNlLlxuICogQHJldHVybnMgVGhlIGN1cnJlbmN5IG5hbWUsXG4gKiBvciBgbnVsbGAgaWYgdGhlIG1haW4gY291bnRyeSBjYW5ub3QgYmUgZGV0ZXJtaW5lZC5cbiAqIEBzZWUgW0ludGVybmF0aW9uYWxpemF0aW9uIChpMThuKSBHdWlkZV0oaHR0cHM6Ly9hbmd1bGFyLmlvL2d1aWRlL2kxOG4pXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9jYWxlQ3VycmVuY3lOYW1lKGxvY2FsZTogc3RyaW5nKTogc3RyaW5nfG51bGwge1xuICBjb25zdCBkYXRhID0gZmluZExvY2FsZURhdGEobG9jYWxlKTtcbiAgcmV0dXJuIGRhdGFbTG9jYWxlRGF0YUluZGV4LkN1cnJlbmN5TmFtZV0gfHwgbnVsbDtcbn1cblxuLyoqXG4gKiBSZXRyaWV2ZXMgdGhlIGN1cnJlbmN5IHZhbHVlcyBmb3IgYSBnaXZlbiBsb2NhbGUuXG4gKiBAcGFyYW0gbG9jYWxlIEEgbG9jYWxlIGNvZGUgZm9yIHRoZSBsb2NhbGUgZm9ybWF0IHJ1bGVzIHRvIHVzZS5cbiAqIEByZXR1cm5zIFRoZSBjdXJyZW5jeSB2YWx1ZXMuXG4gKiBAc2VlIFtJbnRlcm5hdGlvbmFsaXphdGlvbiAoaTE4bikgR3VpZGVdKGh0dHBzOi8vYW5ndWxhci5pby9ndWlkZS9pMThuKVxuICovXG5mdW5jdGlvbiBnZXRMb2NhbGVDdXJyZW5jaWVzKGxvY2FsZTogc3RyaW5nKToge1tjb2RlOiBzdHJpbmddOiBDdXJyZW5jaWVzU3ltYm9sc30ge1xuICBjb25zdCBkYXRhID0gZmluZExvY2FsZURhdGEobG9jYWxlKTtcbiAgcmV0dXJuIGRhdGFbTG9jYWxlRGF0YUluZGV4LkN1cnJlbmNpZXNdO1xufVxuXG4vKipcbiAqIFJldHJpZXZlcyB0aGUgcGx1cmFsIGZ1bmN0aW9uIHVzZWQgYnkgSUNVIGV4cHJlc3Npb25zIHRvIGRldGVybWluZSB0aGUgcGx1cmFsIGNhc2UgdG8gdXNlXG4gKiBmb3IgYSBnaXZlbiBsb2NhbGUuXG4gKiBAcGFyYW0gbG9jYWxlIEEgbG9jYWxlIGNvZGUgZm9yIHRoZSBsb2NhbGUgZm9ybWF0IHJ1bGVzIHRvIHVzZS5cbiAqIEByZXR1cm5zIFRoZSBwbHVyYWwgZnVuY3Rpb24gZm9yIHRoZSBsb2NhbGUuXG4gKiBAc2VlIGBOZ1BsdXJhbGBcbiAqIEBzZWUgW0ludGVybmF0aW9uYWxpemF0aW9uIChpMThuKSBHdWlkZV0oaHR0cHM6Ly9hbmd1bGFyLmlvL2d1aWRlL2kxOG4pXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9jYWxlUGx1cmFsQ2FzZShsb2NhbGU6IHN0cmluZyk6ICh2YWx1ZTogbnVtYmVyKSA9PiBQbHVyYWwge1xuICBjb25zdCBkYXRhID0gZmluZExvY2FsZURhdGEobG9jYWxlKTtcbiAgcmV0dXJuIGRhdGFbTG9jYWxlRGF0YUluZGV4LlBsdXJhbENhc2VdO1xufVxuXG5mdW5jdGlvbiBjaGVja0Z1bGxEYXRhKGRhdGE6IGFueSkge1xuICBpZiAoIWRhdGFbTG9jYWxlRGF0YUluZGV4LkV4dHJhRGF0YV0pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBNaXNzaW5nIGV4dHJhIGxvY2FsZSBkYXRhIGZvciB0aGUgbG9jYWxlIFwiJHtkYXRhW0xvY2FsZURhdGFJbmRleC5Mb2NhbGVJZF19XCIuIFVzZSBcInJlZ2lzdGVyTG9jYWxlRGF0YVwiIHRvIGxvYWQgbmV3IGRhdGEuIFNlZSB0aGUgXCJJMThuIGd1aWRlXCIgb24gYW5ndWxhci5pbyB0byBrbm93IG1vcmUuYCk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXRyaWV2ZXMgbG9jYWxlLXNwZWNpZmljIHJ1bGVzIHVzZWQgdG8gZGV0ZXJtaW5lIHdoaWNoIGRheSBwZXJpb2QgdG8gdXNlXG4gKiB3aGVuIG1vcmUgdGhhbiBvbmUgcGVyaW9kIGlzIGRlZmluZWQgZm9yIGEgbG9jYWxlLlxuICpcbiAqIFRoZXJlIGlzIGEgcnVsZSBmb3IgZWFjaCBkZWZpbmVkIGRheSBwZXJpb2QuIFRoZVxuICogZmlyc3QgcnVsZSBpcyBhcHBsaWVkIHRvIHRoZSBmaXJzdCBkYXkgcGVyaW9kIGFuZCBzbyBvbi5cbiAqIEZhbGwgYmFjayB0byBBTS9QTSB3aGVuIG5vIHJ1bGVzIGFyZSBhdmFpbGFibGUuXG4gKlxuICogQSBydWxlIGNhbiBzcGVjaWZ5IGEgcGVyaW9kIGFzIHRpbWUgcmFuZ2UsIG9yIGFzIGEgc2luZ2xlIHRpbWUgdmFsdWUuXG4gKlxuICogVGhpcyBmdW5jdGlvbmFsaXR5IGlzIG9ubHkgYXZhaWxhYmxlIHdoZW4geW91IGhhdmUgbG9hZGVkIHRoZSBmdWxsIGxvY2FsZSBkYXRhLlxuICogU2VlIHRoZSBbXCJJMThuIGd1aWRlXCJdKGd1aWRlL2kxOG4jaTE4bi1waXBlcykuXG4gKlxuICogQHBhcmFtIGxvY2FsZSBBIGxvY2FsZSBjb2RlIGZvciB0aGUgbG9jYWxlIGZvcm1hdCBydWxlcyB0byB1c2UuXG4gKiBAcmV0dXJucyBUaGUgcnVsZXMgZm9yIHRoZSBsb2NhbGUsIGEgc2luZ2xlIHRpbWUgdmFsdWUgb3IgYXJyYXkgb2YgKmZyb20tdGltZSwgdG8tdGltZSosXG4gKiBvciBudWxsIGlmIG5vIHBlcmlvZHMgYXJlIGF2YWlsYWJsZS5cbiAqXG4gKiBAc2VlIGBnZXRMb2NhbGVFeHRyYURheVBlcmlvZHMoKWBcbiAqIEBzZWUgW0ludGVybmF0aW9uYWxpemF0aW9uIChpMThuKSBHdWlkZV0oaHR0cHM6Ly9hbmd1bGFyLmlvL2d1aWRlL2kxOG4pXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9jYWxlRXh0cmFEYXlQZXJpb2RSdWxlcyhsb2NhbGU6IHN0cmluZyk6IChUaW1lIHwgW1RpbWUsIFRpbWVdKVtdIHtcbiAgY29uc3QgZGF0YSA9IGZpbmRMb2NhbGVEYXRhKGxvY2FsZSk7XG4gIGNoZWNrRnVsbERhdGEoZGF0YSk7XG4gIGNvbnN0IHJ1bGVzID0gZGF0YVtMb2NhbGVEYXRhSW5kZXguRXh0cmFEYXRhXVtFeHRyYUxvY2FsZURhdGFJbmRleC5FeHRyYURheVBlcmlvZHNSdWxlc10gfHwgW107XG4gIHJldHVybiBydWxlcy5tYXAoKHJ1bGU6IHN0cmluZyB8IFtzdHJpbmcsIHN0cmluZ10pID0+IHtcbiAgICBpZiAodHlwZW9mIHJ1bGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gZXh0cmFjdFRpbWUocnVsZSk7XG4gICAgfVxuICAgIHJldHVybiBbZXh0cmFjdFRpbWUocnVsZVswXSksIGV4dHJhY3RUaW1lKHJ1bGVbMV0pXTtcbiAgfSk7XG59XG5cbi8qKlxuICogUmV0cmlldmVzIGxvY2FsZS1zcGVjaWZpYyBkYXkgcGVyaW9kcywgd2hpY2ggaW5kaWNhdGUgcm91Z2hseSBob3cgYSBkYXkgaXMgYnJva2VuIHVwXG4gKiBpbiBkaWZmZXJlbnQgbGFuZ3VhZ2VzLlxuICogRm9yIGV4YW1wbGUsIGZvciBgZW4tVVNgLCBwZXJpb2RzIGFyZSBtb3JuaW5nLCBub29uLCBhZnRlcm5vb24sIGV2ZW5pbmcsIGFuZCBtaWRuaWdodC5cbiAqXG4gKiBUaGlzIGZ1bmN0aW9uYWxpdHkgaXMgb25seSBhdmFpbGFibGUgd2hlbiB5b3UgaGF2ZSBsb2FkZWQgdGhlIGZ1bGwgbG9jYWxlIGRhdGEuXG4gKiBTZWUgdGhlIFtcIkkxOG4gZ3VpZGVcIl0oZ3VpZGUvaTE4biNpMThuLXBpcGVzKS5cbiAqXG4gKiBAcGFyYW0gbG9jYWxlIEEgbG9jYWxlIGNvZGUgZm9yIHRoZSBsb2NhbGUgZm9ybWF0IHJ1bGVzIHRvIHVzZS5cbiAqIEBwYXJhbSBmb3JtU3R5bGUgVGhlIHJlcXVpcmVkIGdyYW1tYXRpY2FsIGZvcm0uXG4gKiBAcGFyYW0gd2lkdGggVGhlIHJlcXVpcmVkIGNoYXJhY3RlciB3aWR0aC5cbiAqIEByZXR1cm5zIFRoZSB0cmFuc2xhdGVkIGRheS1wZXJpb2Qgc3RyaW5ncy5cbiAqIEBzZWUgYGdldExvY2FsZUV4dHJhRGF5UGVyaW9kUnVsZXMoKWBcbiAqIEBzZWUgW0ludGVybmF0aW9uYWxpemF0aW9uIChpMThuKSBHdWlkZV0oaHR0cHM6Ly9hbmd1bGFyLmlvL2d1aWRlL2kxOG4pXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9jYWxlRXh0cmFEYXlQZXJpb2RzKFxuICAgIGxvY2FsZTogc3RyaW5nLCBmb3JtU3R5bGU6IEZvcm1TdHlsZSwgd2lkdGg6IFRyYW5zbGF0aW9uV2lkdGgpOiBzdHJpbmdbXSB7XG4gIGNvbnN0IGRhdGEgPSBmaW5kTG9jYWxlRGF0YShsb2NhbGUpO1xuICBjaGVja0Z1bGxEYXRhKGRhdGEpO1xuICBjb25zdCBkYXlQZXJpb2RzRGF0YSA9IDxzdHJpbmdbXVtdW10+W1xuICAgIGRhdGFbTG9jYWxlRGF0YUluZGV4LkV4dHJhRGF0YV1bRXh0cmFMb2NhbGVEYXRhSW5kZXguRXh0cmFEYXlQZXJpb2RGb3JtYXRzXSxcbiAgICBkYXRhW0xvY2FsZURhdGFJbmRleC5FeHRyYURhdGFdW0V4dHJhTG9jYWxlRGF0YUluZGV4LkV4dHJhRGF5UGVyaW9kU3RhbmRhbG9uZV1cbiAgXTtcbiAgY29uc3QgZGF5UGVyaW9kcyA9IGdldExhc3REZWZpbmVkVmFsdWUoZGF5UGVyaW9kc0RhdGEsIGZvcm1TdHlsZSkgfHwgW107XG4gIHJldHVybiBnZXRMYXN0RGVmaW5lZFZhbHVlKGRheVBlcmlvZHMsIHdpZHRoKSB8fCBbXTtcbn1cblxuLyoqXG4gKiBSZXRyaWV2ZXMgdGhlIGZpcnN0IHZhbHVlIHRoYXQgaXMgZGVmaW5lZCBpbiBhbiBhcnJheSwgZ29pbmcgYmFja3dhcmRzIGZyb20gYW4gaW5kZXggcG9zaXRpb24uXG4gKlxuICogVG8gYXZvaWQgcmVwZWF0aW5nIHRoZSBzYW1lIGRhdGEgKGFzIHdoZW4gdGhlIFwiZm9ybWF0XCIgYW5kIFwic3RhbmRhbG9uZVwiIGZvcm1zIGFyZSB0aGUgc2FtZSlcbiAqIGFkZCB0aGUgZmlyc3QgdmFsdWUgdG8gdGhlIGxvY2FsZSBkYXRhIGFycmF5cywgYW5kIGFkZCBvdGhlciB2YWx1ZXMgb25seSBpZiB0aGV5IGFyZSBkaWZmZXJlbnQuXG4gKlxuICogQHBhcmFtIGRhdGEgVGhlIGRhdGEgYXJyYXkgdG8gcmV0cmlldmUgZnJvbS5cbiAqIEBwYXJhbSBpbmRleCBBIDAtYmFzZWQgaW5kZXggaW50byB0aGUgYXJyYXkgdG8gc3RhcnQgZnJvbS5cbiAqIEByZXR1cm5zIFRoZSB2YWx1ZSBpbW1lZGlhdGVseSBiZWZvcmUgdGhlIGdpdmVuIGluZGV4IHBvc2l0aW9uLlxuICogQHNlZSBbSW50ZXJuYXRpb25hbGl6YXRpb24gKGkxOG4pIEd1aWRlXShodHRwczovL2FuZ3VsYXIuaW8vZ3VpZGUvaTE4bilcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmZ1bmN0aW9uIGdldExhc3REZWZpbmVkVmFsdWU8VD4oZGF0YTogVFtdLCBpbmRleDogbnVtYmVyKTogVCB7XG4gIGZvciAobGV0IGkgPSBpbmRleDsgaSA+IC0xOyBpLS0pIHtcbiAgICBpZiAodHlwZW9mIGRhdGFbaV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gZGF0YVtpXTtcbiAgICB9XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKCdMb2NhbGUgZGF0YSBBUEk6IGxvY2FsZSBkYXRhIHVuZGVmaW5lZCcpO1xufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgYSB0aW1lIHZhbHVlIHdpdGggaG91cnMgYW5kIG1pbnV0ZXMuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgdHlwZSBUaW1lID0ge1xuICBob3VyczogbnVtYmVyLFxuICBtaW51dGVzOiBudW1iZXJcbn07XG5cbi8qKlxuICogRXh0cmFjdHMgdGhlIGhvdXJzIGFuZCBtaW51dGVzIGZyb20gYSBzdHJpbmcgbGlrZSBcIjE1OjQ1XCJcbiAqL1xuZnVuY3Rpb24gZXh0cmFjdFRpbWUodGltZTogc3RyaW5nKTogVGltZSB7XG4gIGNvbnN0IFtoLCBtXSA9IHRpbWUuc3BsaXQoJzonKTtcbiAgcmV0dXJuIHtob3VyczogK2gsIG1pbnV0ZXM6ICttfTtcbn1cblxuLyoqXG4gKiBGaW5kcyB0aGUgbG9jYWxlIGRhdGEgZm9yIGEgZ2l2ZW4gbG9jYWxlLlxuICpcbiAqIEBwYXJhbSBsb2NhbGUgVGhlIGxvY2FsZSBjb2RlLlxuICogQHJldHVybnMgVGhlIGxvY2FsZSBkYXRhLlxuICogQHNlZSBbSW50ZXJuYXRpb25hbGl6YXRpb24gKGkxOG4pIEd1aWRlXShodHRwczovL2FuZ3VsYXIuaW8vZ3VpZGUvaTE4bilcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kTG9jYWxlRGF0YShsb2NhbGU6IHN0cmluZyk6IGFueSB7XG4gIGNvbnN0IG5vcm1hbGl6ZWRMb2NhbGUgPSBsb2NhbGUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9fL2csICctJyk7XG5cbiAgbGV0IG1hdGNoID0gTE9DQUxFX0RBVEFbbm9ybWFsaXplZExvY2FsZV07XG4gIGlmIChtYXRjaCkge1xuICAgIHJldHVybiBtYXRjaDtcbiAgfVxuXG4gIC8vIGxldCdzIHRyeSB0byBmaW5kIGEgcGFyZW50IGxvY2FsZVxuICBjb25zdCBwYXJlbnRMb2NhbGUgPSBub3JtYWxpemVkTG9jYWxlLnNwbGl0KCctJylbMF07XG4gIG1hdGNoID0gTE9DQUxFX0RBVEFbcGFyZW50TG9jYWxlXTtcblxuICBpZiAobWF0Y2gpIHtcbiAgICByZXR1cm4gbWF0Y2g7XG4gIH1cblxuICBpZiAocGFyZW50TG9jYWxlID09PSAnZW4nKSB7XG4gICAgcmV0dXJuIGxvY2FsZUVuO1xuICB9XG5cbiAgdGhyb3cgbmV3IEVycm9yKGBNaXNzaW5nIGxvY2FsZSBkYXRhIGZvciB0aGUgbG9jYWxlIFwiJHtsb2NhbGV9XCIuYCk7XG59XG5cbi8qKlxuICogUmV0cmlldmVzIHRoZSBjdXJyZW5jeSBzeW1ib2wgZm9yIGEgZ2l2ZW4gY3VycmVuY3kgY29kZS5cbiAqXG4gKiBGb3IgZXhhbXBsZSwgZm9yIHRoZSBkZWZhdWx0IGBlbi1VU2AgbG9jYWxlLCB0aGUgY29kZSBgVVNEYCBjYW5cbiAqIGJlIHJlcHJlc2VudGVkIGJ5IHRoZSBuYXJyb3cgc3ltYm9sIGAkYCBvciB0aGUgd2lkZSBzeW1ib2wgYFVTJGAuXG4gKlxuICogQHBhcmFtIGNvZGUgVGhlIGN1cnJlbmN5IGNvZGUuXG4gKiBAcGFyYW0gZm9ybWF0IFRoZSBmb3JtYXQsIGB3aWRlYCBvciBgbmFycm93YC5cbiAqIEBwYXJhbSBsb2NhbGUgQSBsb2NhbGUgY29kZSBmb3IgdGhlIGxvY2FsZSBmb3JtYXQgcnVsZXMgdG8gdXNlLlxuICpcbiAqIEByZXR1cm5zIFRoZSBzeW1ib2wsIG9yIHRoZSBjdXJyZW5jeSBjb2RlIGlmIG5vIHN5bWJvbCBpcyBhdmFpbGFibGUuMFxuICogQHNlZSBbSW50ZXJuYXRpb25hbGl6YXRpb24gKGkxOG4pIEd1aWRlXShodHRwczovL2FuZ3VsYXIuaW8vZ3VpZGUvaTE4bilcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDdXJyZW5jeVN5bWJvbChjb2RlOiBzdHJpbmcsIGZvcm1hdDogJ3dpZGUnIHwgJ25hcnJvdycsIGxvY2FsZSA9ICdlbicpOiBzdHJpbmcge1xuICBjb25zdCBjdXJyZW5jeSA9IGdldExvY2FsZUN1cnJlbmNpZXMobG9jYWxlKVtjb2RlXSB8fCBDVVJSRU5DSUVTX0VOW2NvZGVdIHx8IFtdO1xuICBjb25zdCBzeW1ib2xOYXJyb3cgPSBjdXJyZW5jeVtDdXJyZW5jeUluZGV4LlN5bWJvbE5hcnJvd107XG5cbiAgaWYgKGZvcm1hdCA9PT0gJ25hcnJvdycgJiYgdHlwZW9mIHN5bWJvbE5hcnJvdyA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gc3ltYm9sTmFycm93O1xuICB9XG5cbiAgcmV0dXJuIGN1cnJlbmN5W0N1cnJlbmN5SW5kZXguU3ltYm9sXSB8fCBjb2RlO1xufVxuXG4vLyBNb3N0IGN1cnJlbmNpZXMgaGF2ZSBjZW50cywgdGhhdCdzIHdoeSB0aGUgZGVmYXVsdCBpcyAyXG5jb25zdCBERUZBVUxUX05CX09GX0NVUlJFTkNZX0RJR0lUUyA9IDI7XG5cbi8qKlxuICogUmVwb3J0cyB0aGUgbnVtYmVyIG9mIGRlY2ltYWwgZGlnaXRzIGZvciBhIGdpdmVuIGN1cnJlbmN5LlxuICogVGhlIHZhbHVlIGRlcGVuZHMgdXBvbiB0aGUgcHJlc2VuY2Ugb2YgY2VudHMgaW4gdGhhdCBwYXJ0aWN1bGFyIGN1cnJlbmN5LlxuICpcbiAqIEBwYXJhbSBjb2RlIFRoZSBjdXJyZW5jeSBjb2RlLlxuICogQHJldHVybnMgVGhlIG51bWJlciBvZiBkZWNpbWFsIGRpZ2l0cywgdHlwaWNhbGx5IDAgb3IgMi5cbiAqIEBzZWUgW0ludGVybmF0aW9uYWxpemF0aW9uIChpMThuKSBHdWlkZV0oaHR0cHM6Ly9hbmd1bGFyLmlvL2d1aWRlL2kxOG4pXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TnVtYmVyT2ZDdXJyZW5jeURpZ2l0cyhjb2RlOiBzdHJpbmcpOiBudW1iZXIge1xuICBsZXQgZGlnaXRzO1xuICBjb25zdCBjdXJyZW5jeSA9IENVUlJFTkNJRVNfRU5bY29kZV07XG4gIGlmIChjdXJyZW5jeSkge1xuICAgIGRpZ2l0cyA9IGN1cnJlbmN5W0N1cnJlbmN5SW5kZXguTmJPZkRpZ2l0c107XG4gIH1cbiAgcmV0dXJuIHR5cGVvZiBkaWdpdHMgPT09ICdudW1iZXInID8gZGlnaXRzIDogREVGQVVMVF9OQl9PRl9DVVJSRU5DWV9ESUdJVFM7XG59XG4iXX0=