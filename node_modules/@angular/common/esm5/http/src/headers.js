/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
/**
 * `HttpHeaders` class represents the header configuration options for an HTTP request.
 * Instances should be assumed immutable with lazy parsing.
 *
 * @publicApi
 */
var HttpHeaders = /** @class */ (function () {
    /**  Constructs a new HTTP header object with the given values.*/
    function HttpHeaders(headers) {
        var _this = this;
        /**
         * Internal map of lowercased header names to the normalized
         * form of the name (the form seen first).
         */
        this.normalizedNames = new Map();
        /**
         * Queued updates to be materialized the next initialization.
         */
        this.lazyUpdate = null;
        if (!headers) {
            this.headers = new Map();
        }
        else if (typeof headers === 'string') {
            this.lazyInit = function () {
                _this.headers = new Map();
                headers.split('\n').forEach(function (line) {
                    var index = line.indexOf(':');
                    if (index > 0) {
                        var name_1 = line.slice(0, index);
                        var key = name_1.toLowerCase();
                        var value = line.slice(index + 1).trim();
                        _this.maybeSetNormalizedName(name_1, key);
                        if (_this.headers.has(key)) {
                            _this.headers.get(key).push(value);
                        }
                        else {
                            _this.headers.set(key, [value]);
                        }
                    }
                });
            };
        }
        else {
            this.lazyInit = function () {
                _this.headers = new Map();
                Object.keys(headers).forEach(function (name) {
                    var values = headers[name];
                    var key = name.toLowerCase();
                    if (typeof values === 'string') {
                        values = [values];
                    }
                    if (values.length > 0) {
                        _this.headers.set(key, values);
                        _this.maybeSetNormalizedName(name, key);
                    }
                });
            };
        }
    }
    /**
     * Checks for existence of a header by a given name.
     *
     * @param name The header name to check for existence.
     *
     * @returns Whether the header exits.
     */
    HttpHeaders.prototype.has = function (name) {
        this.init();
        return this.headers.has(name.toLowerCase());
    };
    /**
     * Returns the first header value that matches a given name.
     *
     * @param name The header name to retrieve.
     *
     * @returns A string if the header exists, null otherwise
     */
    HttpHeaders.prototype.get = function (name) {
        this.init();
        var values = this.headers.get(name.toLowerCase());
        return values && values.length > 0 ? values[0] : null;
    };
    /**
     * Returns the names of the headers.
     *
     * @returns A list of header names.
     */
    HttpHeaders.prototype.keys = function () {
        this.init();
        return Array.from(this.normalizedNames.values());
    };
    /**
     * Returns a list of header values for a given header name.
     *
     * @param name The header name from which to retrieve the values.
     *
     * @returns A string of values if the header exists, null otherwise.
     */
    HttpHeaders.prototype.getAll = function (name) {
        this.init();
        return this.headers.get(name.toLowerCase()) || null;
    };
    /**
     * Appends a new header value to the existing set of
     * header values.
     *
     * @param name The header name for which to append the values.
     *
     * @returns A clone of the HTTP header object with the value appended.
     */
    HttpHeaders.prototype.append = function (name, value) {
        return this.clone({ name: name, value: value, op: 'a' });
    };
    /**
     * Sets a header value for a given name. If the header name already exists,
     * its value is replaced with the given value.
     *
     * @param name The header name.
     * @param value Provides the value to set or overide for a given name.
     *
     * @returns A clone of the HTTP header object with the newly set header value.
     */
    HttpHeaders.prototype.set = function (name, value) {
        return this.clone({ name: name, value: value, op: 's' });
    };
    /**
     * Deletes all header values for a given name.
     *
     * @param name The header name.
     * @param value The header values to delete for a given name.
     *
     * @returns A clone of the HTTP header object.
     */
    HttpHeaders.prototype.delete = function (name, value) {
        return this.clone({ name: name, value: value, op: 'd' });
    };
    HttpHeaders.prototype.maybeSetNormalizedName = function (name, lcName) {
        if (!this.normalizedNames.has(lcName)) {
            this.normalizedNames.set(lcName, name);
        }
    };
    HttpHeaders.prototype.init = function () {
        var _this = this;
        if (!!this.lazyInit) {
            if (this.lazyInit instanceof HttpHeaders) {
                this.copyFrom(this.lazyInit);
            }
            else {
                this.lazyInit();
            }
            this.lazyInit = null;
            if (!!this.lazyUpdate) {
                this.lazyUpdate.forEach(function (update) { return _this.applyUpdate(update); });
                this.lazyUpdate = null;
            }
        }
    };
    HttpHeaders.prototype.copyFrom = function (other) {
        var _this = this;
        other.init();
        Array.from(other.headers.keys()).forEach(function (key) {
            _this.headers.set(key, other.headers.get(key));
            _this.normalizedNames.set(key, other.normalizedNames.get(key));
        });
    };
    HttpHeaders.prototype.clone = function (update) {
        var clone = new HttpHeaders();
        clone.lazyInit =
            (!!this.lazyInit && this.lazyInit instanceof HttpHeaders) ? this.lazyInit : this;
        clone.lazyUpdate = (this.lazyUpdate || []).concat([update]);
        return clone;
    };
    HttpHeaders.prototype.applyUpdate = function (update) {
        var key = update.name.toLowerCase();
        switch (update.op) {
            case 'a':
            case 's':
                var value = update.value;
                if (typeof value === 'string') {
                    value = [value];
                }
                if (value.length === 0) {
                    return;
                }
                this.maybeSetNormalizedName(update.name, key);
                var base = (update.op === 'a' ? this.headers.get(key) : undefined) || [];
                base.push.apply(base, tslib_1.__spread(value));
                this.headers.set(key, base);
                break;
            case 'd':
                var toDelete_1 = update.value;
                if (!toDelete_1) {
                    this.headers.delete(key);
                    this.normalizedNames.delete(key);
                }
                else {
                    var existing = this.headers.get(key);
                    if (!existing) {
                        return;
                    }
                    existing = existing.filter(function (value) { return toDelete_1.indexOf(value) === -1; });
                    if (existing.length === 0) {
                        this.headers.delete(key);
                        this.normalizedNames.delete(key);
                    }
                    else {
                        this.headers.set(key, existing);
                    }
                }
                break;
        }
    };
    /**
     * @internal
     */
    HttpHeaders.prototype.forEach = function (fn) {
        var _this = this;
        this.init();
        Array.from(this.normalizedNames.keys())
            .forEach(function (key) { return fn(_this.normalizedNames.get(key), _this.headers.get(key)); });
    };
    return HttpHeaders;
}());
export { HttpHeaders };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbW1vbi9odHRwL3NyYy9oZWFkZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFRSDs7Ozs7R0FLRztBQUNIO0lBeUJFLGlFQUFpRTtJQUVqRSxxQkFBWSxPQUFvRDtRQUFoRSxpQkFxQ0M7UUF4REQ7OztXQUdHO1FBQ0ssb0JBQWUsR0FBd0IsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQVF6RDs7V0FFRztRQUNLLGVBQVUsR0FBa0IsSUFBSSxDQUFDO1FBS3ZDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRyxFQUFvQixDQUFDO1NBQzVDO2FBQU0sSUFBSSxPQUFPLE9BQU8sS0FBSyxRQUFRLEVBQUU7WUFDdEMsSUFBSSxDQUFDLFFBQVEsR0FBRztnQkFDZCxLQUFJLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRyxFQUFvQixDQUFDO2dCQUMzQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUk7b0JBQzlCLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ2hDLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRTt3QkFDYixJQUFNLE1BQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQzt3QkFDbEMsSUFBTSxHQUFHLEdBQUcsTUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO3dCQUMvQixJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQzt3QkFDM0MsS0FBSSxDQUFDLHNCQUFzQixDQUFDLE1BQUksRUFBRSxHQUFHLENB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LEVBQUU7d0JBQ3pCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUN6QixJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztxQkFDbEM7eUJBQU07d0JBQ0wsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO3FCQUNqQztpQkFDRjtnQkFDRCxNQUFNO1NBQ1Q7SUFDSCxDQUFDO0lBRUQ7O09BRUc7SUFDSCw2QkFBTyxHQUFQLFVBQVEsRUFBNEM7UUFBcEQsaUJBSUM7UUFIQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWixLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDbEMsT0FBTyxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsRUFBRSxDQUFDLEtBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBRyxFQUFFLEtBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBRyxDQUFDLEVBQTVELENBQTRELENBQUMsQ0FBQztJQUNwRixDQUFDO0lBQ0gsa0JBQUM7QUFBRCxDQUFDLEFBN09ELElBNk9DIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbnRlcmZhY2UgVXBkYXRlIHtcbiAgbmFtZTogc3RyaW5nO1xuICB2YWx1ZT86IHN0cmluZ3xzdHJpbmdbXTtcbiAgb3A6ICdhJ3wncyd8J2QnO1xufVxuXG4vKipcbiAqIGBIdHRwSGVhZGVyc2AgY2xhc3MgcmVwcmVzZW50cyB0aGUgaGVhZGVyIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBmb3IgYW4gSFRUUCByZXF1ZXN0LlxuICogSW5zdGFuY2VzIHNob3VsZCBiZSBhc3N1bWVkIGltbXV0YWJsZSB3aXRoIGxhenkgcGFyc2luZy5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBjbGFzcyBIdHRwSGVhZGVycyB7XG4gIC8qKlxuICAgKiBJbnRlcm5hbCBtYXAgb2YgbG93ZXJjYXNlIGhlYWRlciBuYW1lcyB0byB2YWx1ZXMuXG4gICAqL1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcHJpdmF0ZSBoZWFkZXJzICE6IE1hcDxzdHJpbmcsIHN0cmluZ1tdPjtcblxuXG4gIC8qKlxuICAgKiBJbnRlcm5hbCBtYXAgb2YgbG93ZXJjYXNlZCBoZWFkZXIgbmFtZXMgdG8gdGhlIG5vcm1hbGl6ZWRcbiAgICogZm9ybSBvZiB0aGUgbmFtZSAodGhlIGZvcm0gc2VlbiBmaXJzdCkuXG4gICAqL1xuICBwcml2YXRlIG5vcm1hbGl6ZWROYW1lczogTWFwPHN0cmluZywgc3RyaW5nPiA9IG5ldyBNYXAoKTtcblxuICAvKipcbiAgICogQ29tcGxldGUgdGhlIGxhenkgaW5pdGlhbGl6YXRpb24gb2YgdGhpcyBvYmplY3QgKG5lZWRlZCBiZWZvcmUgcmVhZGluZykuXG4gICAqL1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcHJpdmF0ZSBsYXp5SW5pdCAhOiBIdHRwSGVhZGVycyB8IEZ1bmN0aW9uIHwgbnVsbDtcblxuICAvKipcbiAgICogUXVldWVkIHVwZGF0ZXMgdG8gYmUgbWF0ZXJpYWxpemVkIHRoZSBuZXh0IGluaXRpYWxpemF0aW9uLlxuICAgKi9cbiAgcHJpdmF0ZSBsYXp5VXBkYXRlOiBVcGRhdGVbXXxudWxsID0gbnVsbDtcblxuICAvKiogIENvbnN0cnVjdHMgYSBuZXcgSFRUUCBoZWFkZXIgb2JqZWN0IHdpdGggdGhlIGdpdmVuIHZhbHVlcy4qL1xuXG4gIGNvbnN0cnVjdG9yKGhlYWRlcnM/OiBzdHJpbmd8e1tuYW1lOiBzdHJpbmddOiBzdHJpbmcgfCBzdHJpbmdbXX0pIHtcbiAgICBpZiAoIWhlYWRlcnMpIHtcbiAgICAgIHRoaXMuaGVhZGVycyA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmdbXT4oKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBoZWFkZXJzID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5sYXp5SW5pdCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5oZWFkZXJzID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZ1tdPigpO1xuICAgICAgICBoZWFkZXJzLnNwbGl0KCdcXG4nKS5mb3JFYWNoKGxpbmUgPT4ge1xuICAgICAgICAgIGNvbnN0IGluZGV4ID0gbGluZS5pbmRleE9mKCc6Jyk7XG4gICAgICAgICAgaWYgKGluZGV4ID4gMCkge1xuICAgICAgICAgICAgY29uc3QgbmFtZSA9IGxpbmUuc2xpY2UoMCwgaW5kZXgpO1xuICAgICAgICAgICAgY29uc3Qga2V5ID0gbmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBsaW5lLnNsaWNlKGluZGV4ICsgMSkudHJpbSgpO1xuICAgICAgICAgICAgdGhpcy5tYXliZVNldE5vcm1hbGl6ZWROYW1lKG5hbWUsIGtleSk7XG4gICAgICAgICAgICBpZiAodGhpcy5oZWFkZXJzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgICAgIHRoaXMuaGVhZGVycy5nZXQoa2V5KSAhLnB1c2godmFsdWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5oZWFkZXJzLnNldChrZXksIFt2YWx1ZV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxhenlJbml0ID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmhlYWRlcnMgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nW10+KCk7XG4gICAgICAgIE9iamVjdC5rZXlzKGhlYWRlcnMpLmZvckVhY2gobmFtZSA9PiB7XG4gICAgICAgICAgbGV0IHZhbHVlczogc3RyaW5nfHN0cmluZ1tdID0gaGVhZGVyc1tuYW1lXTtcbiAgICAgICAgICBjb25zdCBrZXkgPSBuYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB2YWx1ZXMgPSBbdmFsdWVzXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHZhbHVlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KGtleSwgdmFsdWVzKTtcbiAgICAgICAgICAgIHRoaXMubWF5YmVTZXROb3JtYWxpemVkTmFtZShuYW1lLCBrZXkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgZm9yIGV4aXN0ZW5jZSBvZiBhIGhlYWRlciBieSBhIGdpdmVuIG5hbWUuXG4gICAqXG4gICAqIEBwYXJhbSBuYW1lIFRoZSBoZWFkZXIgbmFtZSB0byBjaGVjayBmb3IgZXhpc3RlbmNlLlxuICAgKlxuICAgKiBAcmV0dXJucyBXaGV0aGVyIHRoZSBoZWFkZXIgZXhpdHMuXG4gICAqL1xuICBoYXMobmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgdGhpcy5pbml0KCk7XG5cbiAgICByZXR1cm4gdGhpcy5oZWFkZXJzLmhhcyhuYW1lLnRvTG93ZXJDYXNlKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGZpcnN0IGhlYWRlciB2YWx1ZSB0aGF0IG1hdGNoZXMgYSBnaXZlbiBuYW1lLlxuICAgKlxuICAgKiBAcGFyYW0gbmFtZSBUaGUgaGVhZGVyIG5hbWUgdG8gcmV0cmlldmUuXG4gICAqXG4gICAqIEByZXR1cm5zIEEgc3RyaW5nIGlmIHRoZSBoZWFkZXIgZXhpc3RzLCBudWxsIG90aGVyd2lzZVxuICAgKi9cbiAgZ2V0KG5hbWU6IHN0cmluZyk6IHN0cmluZ3xudWxsIHtcbiAgICB0aGlzLmluaXQoKTtcblxuICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMuaGVhZGVycy5nZXQobmFtZS50b0xvd2VyQ2FzZSgpKTtcbiAgICByZXR1cm4gdmFsdWVzICYmIHZhbHVlcy5sZW5ndGggPiAwID8gdmFsdWVzWzBdIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBuYW1lcyBvZiB0aGUgaGVhZGVycy5cbiAgICpcbiAgICogQHJldHVybnMgQSBsaXN0IG9mIGhlYWRlciBuYW1lcy5cbiAgICovXG4gIGtleXMoKTogc3RyaW5nW10ge1xuICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5ub3JtYWxpemVkTmFtZXMudmFsdWVzKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBsaXN0IG9mIGhlYWRlciB2YWx1ZXMgZm9yIGEgZ2l2ZW4gaGVhZGVyIG5hbWUuXG4gICAqXG4gICAqIEBwYXJhbSBuYW1lIFRoZSBoZWFkZXIgbmFtZSBmcm9tIHdoaWNoIHRvIHJldHJpZXZlIHRoZSB2YWx1ZXMuXG4gICAqXG4gICAqIEByZXR1cm5zIEEgc3RyaW5nIG9mIHZhbHVlcyBpZiB0aGUgaGVhZGVyIGV4aXN0cywgbnVsbCBvdGhlcndpc2UuXG4gICAqL1xuICBnZXRBbGwobmFtZTogc3RyaW5nKTogc3RyaW5nW118bnVsbCB7XG4gICAgdGhpcy5pbml0KCk7XG5cbiAgICByZXR1cm4gdGhpcy5oZWFkZXJzLmdldChuYW1lLnRvTG93ZXJDYXNlKCkpIHx8IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQXBwZW5kcyBhIG5ldyBoZWFkZXIgdmFsdWUgdG8gdGhlIGV4aXN0aW5nIHNldCBvZlxuICAgKiBoZWFkZXIgdmFsdWVzLlxuICAgKlxuICAgKiBAcGFyYW0gbmFtZSBUaGUgaGVhZGVyIG5hbWUgZm9yIHdoaWNoIHRvIGFwcGVuZCB0aGUgdmFsdWVzLlxuICAgKlxuICAgKiBAcmV0dXJucyBBIGNsb25lIG9mIHRoZSBIVFRQIGhlYWRlciBvYmplY3Qgd2l0aCB0aGUgdmFsdWUgYXBwZW5kZWQuXG4gICAqL1xuXG4gIGFwcGVuZChuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmd8c3RyaW5nW10pOiBIdHRwSGVhZGVycyB7XG4gICAgcmV0dXJuIHRoaXMuY2xvbmUoe25hbWUsIHZhbHVlLCBvcDogJ2EnfSk7XG4gIH1cbiAgLyoqXG4gICAqIFNldHMgYSBoZWFkZXIgdmFsdWUgZm9yIGEgZ2l2ZW4gbmFtZS4gSWYgdGhlIGhlYWRlciBuYW1lIGFscmVhZHkgZXhpc3RzLFxuICAgKiBpdHMgdmFsdWUgaXMgcmVwbGFjZWQgd2l0aCB0aGUgZ2l2ZW4gdmFsdWUuXG4gICAqXG4gICAqIEBwYXJhbSBuYW1lIFRoZSBoZWFkZXIgbmFtZS5cbiAgICogQHBhcmFtIHZhbHVlIFByb3ZpZGVzIHRoZSB2YWx1ZSB0byBzZXQgb3Igb3ZlcmlkZSBmb3IgYSBnaXZlbiBuYW1lLlxuICAgKlxuICAgKiBAcmV0dXJucyBBIGNsb25lIG9mIHRoZSBIVFRQIGhlYWRlciBvYmplY3Qgd2l0aCB0aGUgbmV3bHkgc2V0IGhlYWRlciB2YWx1ZS5cbiAgICovXG4gIHNldChuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmd8c3RyaW5nW10pOiBIdHRwSGVhZGVycyB7XG4gICAgcmV0dXJuIHRoaXMuY2xvbmUoe25hbWUsIHZhbHVlLCBvcDogJ3MnfSk7XG4gIH1cbiAgLyoqXG4gICAqIERlbGV0ZXMgYWxsIGhlYWRlciB2YWx1ZXMgZm9yIGEgZ2l2ZW4gbmFtZS5cbiAgICpcbiAgICogQHBhcmFtIG5hbWUgVGhlIGhlYWRlciBuYW1lLlxuICAgKiBAcGFyYW0gdmFsdWUgVGhlIGhlYWRlciB2YWx1ZXMgdG8gZGVsZXRlIGZvciBhIGdpdmVuIG5hbWUuXG4gICAqXG4gICAqIEByZXR1cm5zIEEgY2xvbmUgb2YgdGhlIEhUVFAgaGVhZGVyIG9iamVjdC5cbiAgICovXG4gIGRlbGV0ZSAobmFtZTogc3RyaW5nLCB2YWx1ZT86IHN0cmluZ3xzdHJpbmdbXSk6IEh0dHBIZWFkZXJzIHtcbiAgICByZXR1cm4gdGhpcy5jbG9uZSh7bmFtZSwgdmFsdWUsIG9wOiAnZCd9KTtcbiAgfVxuXG4gIHByaXZhdGUgbWF5YmVTZXROb3JtYWxpemVkTmFtZShuYW1lOiBzdHJpbmcsIGxjTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLm5vcm1hbGl6ZWROYW1lcy5oYXMobGNOYW1lKSkge1xuICAgICAgdGhpcy5ub3JtYWxpemVkTmFtZXMuc2V0KGxjTmFtZSwgbmFtZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBpbml0KCk6IHZvaWQge1xuICAgIGlmICghIXRoaXMubGF6eUluaXQpIHtcbiAgICAgIGlmICh0aGlzLmxhenlJbml0IGluc3RhbmNlb2YgSHR0cEhlYWRlcnMpIHtcbiAgICAgICAgdGhpcy5jb3B5RnJvbSh0aGlzLmxhenlJbml0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubGF6eUluaXQoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMubGF6eUluaXQgPSBudWxsO1xuICAgICAgaWYgKCEhdGhpcy5sYXp5VXBkYXRlKSB7XG4gICAgICAgIHRoaXMubGF6eVVwZGF0ZS5mb3JFYWNoKHVwZGF0ZSA9PiB0aGlzLmFwcGx5VXBkYXRlKHVwZGF0ZSkpO1xuICAgICAgICB0aGlzLmxhenlVcGRhdGUgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY29weUZyb20ob3RoZXI6IEh0dHBIZWFkZXJzKSB7XG4gICAgb3RoZXIuaW5pdCgpO1xuICAgIEFycmF5LmZyb20ob3RoZXIuaGVhZGVycy5rZXlzKCkpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIHRoaXMuaGVhZGVycy5zZXQoa2V5LCBvdGhlci5oZWFkZXJzLmdldChrZXkpICEpO1xuICAgICAgdGhpcy5ub3JtYWxpemVkTmFtZXMuc2V0KGtleSwgb3RoZXIubm9ybWFsaXplZE5hbWVzLmdldChrZXkpICEpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBjbG9uZSh1cGRhdGU6IFVwZGF0ZSk6IEh0dHBIZWFkZXJzIHtcbiAgICBjb25zdCBjbG9uZSA9IG5ldyBIdHRwSGVhZGVycygpO1xuICAgIGNsb25lLmxhenlJbml0ID1cbiAgICAgICAgKCEhdGhpcy5sYXp5SW5pdCAmJiB0aGlzLmxhenlJbml0IGluc3RhbmNlb2YgSHR0cEhlYWRlcnMpID8gdGhpcy5sYXp5SW5pdCA6IHRoaXM7XG4gICAgY2xvbmUubGF6eVVwZGF0ZSA9ICh0aGlzLmxhenlVcGRhdGUgfHwgW10pLmNvbmNhdChbdXBkYXRlXSk7XG4gICAgcmV0dXJuIGNsb25lO1xuICB9XG5cbiAgcHJpdmF0ZSBhcHBseVVwZGF0ZSh1cGRhdGU6IFVwZGF0ZSk6IHZvaWQge1xuICAgIGNvbnN0IGtleSA9IHVwZGF0ZS5uYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgc3dpdGNoICh1cGRhdGUub3ApIHtcbiAgICAgIGNhc2UgJ2EnOlxuICAgICAgY2FzZSAncyc6XG4gICAgICAgIGxldCB2YWx1ZSA9IHVwZGF0ZS52YWx1ZSAhO1xuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIHZhbHVlID0gW3ZhbHVlXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmFsdWUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubWF5YmVTZXROb3JtYWxpemVkTmFtZSh1cGRhdGUubmFtZSwga2V5KTtcbiAgICAgICAgY29uc3QgYmFzZSA9ICh1cGRhdGUub3AgPT09ICdhJyA/IHRoaXMuaGVhZGVycy5nZXQoa2V5KSA6IHVuZGVmaW5lZCkgfHwgW107XG4gICAgICAgIGJhc2UucHVzaCguLi52YWx1ZSk7XG4gICAgICAgIHRoaXMuaGVhZGVycy5zZXQoa2V5LCBiYXNlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdkJzpcbiAgICAgICAgY29uc3QgdG9EZWxldGUgPSB1cGRhdGUudmFsdWUgYXMgc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgICAgICBpZiAoIXRvRGVsZXRlKSB7XG4gICAgICAgICAgdGhpcy5oZWFkZXJzLmRlbGV0ZShrZXkpO1xuICAgICAgICAgIHRoaXMubm9ybWFsaXplZE5hbWVzLmRlbGV0ZShrZXkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxldCBleGlzdGluZyA9IHRoaXMuaGVhZGVycy5nZXQoa2V5KTtcbiAgICAgICAgICBpZiAoIWV4aXN0aW5nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGV4aXN0aW5nID0gZXhpc3RpbmcuZmlsdGVyKHZhbHVlID0+IHRvRGVsZXRlLmluZGV4T2YodmFsdWUpID09PSAtMSk7XG4gICAgICAgICAgaWYgKGV4aXN0aW5nLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5oZWFkZXJzLmRlbGV0ZShrZXkpO1xuICAgICAgICAgICAgdGhpcy5ub3JtYWxpemVkTmFtZXMuZGVsZXRlKGtleSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaGVhZGVycy5zZXQoa2V5LCBleGlzdGluZyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIGZvckVhY2goZm46IChuYW1lOiBzdHJpbmcsIHZhbHVlczogc3RyaW5nW10pID0+IHZvaWQpIHtcbiAgICB0aGlzLmluaXQoKTtcbiAgICBBcnJheS5mcm9tKHRoaXMubm9ybWFsaXplZE5hbWVzLmtleXMoKSlcbiAgICAgICAgLmZvckVhY2goa2V5ID0+IGZuKHRoaXMubm9ybWFsaXplZE5hbWVzLmdldChrZXkpICEsIHRoaXMuaGVhZGVycy5nZXQoa2V5KSAhKSk7XG4gIH1cbn1cbiJdfQ==