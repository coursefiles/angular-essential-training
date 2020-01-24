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
        define("@angular/compiler-cli/ngcc/src/packages/build_marker", ["require", "exports", "fs"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var fs_1 = require("fs");
    exports.NGCC_VERSION = '8.0.1';
    /**
     * Check whether ngcc has already processed a given entry-point format.
     *
     * The entry-point is defined by the package.json contents provided.
     * The format is defined by the provided property name of the path to the bundle in the package.json
     *
     * @param packageJson The parsed contents of the package.json file for the entry-point.
     * @param format The entry-point format property in the package.json to check.
     * @returns true if the entry-point and format have already been processed with this ngcc version.
     * @throws Error if the `packageJson` property is not an object.
     * @throws Error if the entry-point has already been processed with a different ngcc version.
     */
    function hasBeenProcessed(packageJson, format) {
        if (!packageJson.__processed_by_ivy_ngcc__) {
            return false;
        }
        if (Object.keys(packageJson.__processed_by_ivy_ngcc__)
            .some(function (property) { return packageJson.__processed_by_ivy_ngcc__[property] !== exports.NGCC_VERSION; })) {
            throw new Error('The ngcc compiler has changed since the last ngcc build.\n' +
                'Please completely remove `node_modules` and try again.');
        }
        return packageJson.__processed_by_ivy_ngcc__[format] === exports.NGCC_VERSION;
    }
    exports.hasBeenProcessed = hasBeenProcessed;
    /**
     * Write a build marker for the given entry-point and format property, to indicate that it has
     * been compiled by this version of ngcc.
     *
     * @param entryPoint the entry-point to write a marker.
     * @param format the property in the package.json of the format for which we are writing the marker.
     */
    function markAsProcessed(packageJson, packageJsonPath, format) {
        if (!packageJson.__processed_by_ivy_ngcc__)
            packageJson.__processed_by_ivy_ngcc__ = {};
        packageJson.__processed_by_ivy_ngcc__[format] = exports.NGCC_VERSION;
        fs_1.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
    }
    exports.markAsProcessed = markAsProcessed;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGRfbWFya2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL25nY2Mvc3JjL3BhY2thZ2VzL2J1aWxkX21hcmtlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztJQUVILHlCQUFpQztJQU1wQixRQUFBLFlBQVksR0FBRyxtQkFBbUIsQ0FBQztJQUVoRDs7Ozs7Ozs7Ozs7T0FXRztJQUNILFNBQWdCLGdCQUFnQixDQUM1QixXQUFrQyxFQUFFLE1BQThCO1FBQ3BFLElBQUksQ0FBQyxXQUFXLENBQUMseUJBQXlCLEVBQUU7WUFDMUMsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMseUJBQXlCLENBQUM7YUFDN0MsSUFBSSxDQUFDLFVBQUEsUUFBUSxJQUFJLE9BQUEsV0FBVyxDQUFDLHlCQUEyQixDQUFDLFFBQVEsQ0FBQyxLQUFLLG9CQUFZLEVBQWxFLENBQWtFLENBQUMsRUFBRTtZQUM3RixNQUFNLElBQUksS0FBSyxDQUNYLDREQUE0RDtnQkFDNUQsd0RBQXdELENBQUMsQ0FBQztTQUMvRDtRQUVELE9BQU8sV0FBVyxDQUFDLHlCQUF5QixDQUFDLE1BQU0sQ0FBQyxLQUFLLG9CQUFZLENBQUM7SUFDeEUsQ0FBQztJQWJELDRDQWFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsU0FBZ0IsZUFBZSxDQUMzQixXQUFrQyxFQUFFLGVBQStCLEVBQ25FLE1BQThCO1FBQ2hDLElBQUksQ0FBQyxXQUFXLENBQUMseUJBQXlCO1lBQUUsV0FBVyxDQUFDLHlCQUF5QixHQUFHLEVBQUUsQ0FBQztRQUN2RixXQUFXLENBQUMseUJBQXlCLENBQUMsTUFBTSxDQUFDLEdBQUcsb0JBQVksQ0FBQztRQUM3RCxrQkFBYSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDL0UsQ0FBQztJQU5ELDBDQU1DIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge3dyaXRlRmlsZVN5bmN9IGZyb20gJ2ZzJztcblxuaW1wb3J0IHtBYnNvbHV0ZUZzUGF0aH0gZnJvbSAnLi4vLi4vLi4vc3JjL25ndHNjL3BhdGgnO1xuXG5pbXBvcnQge0VudHJ5UG9pbnRKc29uUHJvcGVydHksIEVudHJ5UG9pbnRQYWNrYWdlSnNvbn0gZnJvbSAnLi9lbnRyeV9wb2ludCc7XG5cbmV4cG9ydCBjb25zdCBOR0NDX1ZFUlNJT04gPSAnMC4wLjAtUExBQ0VIT0xERVInO1xuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgbmdjYyBoYXMgYWxyZWFkeSBwcm9jZXNzZWQgYSBnaXZlbiBlbnRyeS1wb2ludCBmb3JtYXQuXG4gKlxuICogVGhlIGVudHJ5LXBvaW50IGlzIGRlZmluZWQgYnkgdGhlIHBhY2thZ2UuanNvbiBjb250ZW50cyBwcm92aWRlZC5cbiAqIFRoZSBmb3JtYXQgaXMgZGVmaW5lZCBieSB0aGUgcHJvdmlkZWQgcHJvcGVydHkgbmFtZSBvZiB0aGUgcGF0aCB0byB0aGUgYnVuZGxlIGluIHRoZSBwYWNrYWdlLmpzb25cbiAqXG4gKiBAcGFyYW0gcGFja2FnZUpzb24gVGhlIHBhcnNlZCBjb250ZW50cyBvZiB0aGUgcGFja2FnZS5qc29uIGZpbGUgZm9yIHRoZSBlbnRyeS1wb2ludC5cbiAqIEBwYXJhbSBmb3JtYXQgVGhlIGVudHJ5LXBvaW50IGZvcm1hdCBwcm9wZXJ0eSBpbiB0aGUgcGFja2FnZS5qc29uIHRvIGNoZWNrLlxuICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgZW50cnktcG9pbnQgYW5kIGZvcm1hdCBoYXZlIGFscmVhZHkgYmVlbiBwcm9jZXNzZWQgd2l0aCB0aGlzIG5nY2MgdmVyc2lvbi5cbiAqIEB0aHJvd3MgRXJyb3IgaWYgdGhlIGBwYWNrYWdlSnNvbmAgcHJvcGVydHkgaXMgbm90IGFuIG9iamVjdC5cbiAqIEB0aHJvd3MgRXJyb3IgaWYgdGhlIGVudHJ5LXBvaW50IGhhcyBhbHJlYWR5IGJlZW4gcHJvY2Vzc2VkIHdpdGggYSBkaWZmZXJlbnQgbmdjYyB2ZXJzaW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFzQmVlblByb2Nlc3NlZChcbiAgICBwYWNrYWdlSnNvbjogRW50cnlQb2ludFBhY2thZ2VKc29uLCBmb3JtYXQ6IEVudHJ5UG9pbnRKc29uUHJvcGVydHkpOiBib29sZWFuIHtcbiAgaWYgKCFwYWNrYWdlSnNvbi5fX3Byb2Nlc3NlZF9ieV9pdnlfbmdjY19fKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChPYmplY3Qua2V5cyhwYWNrYWdlSnNvbi5fX3Byb2Nlc3NlZF9ieV9pdnlfbmdjY19fKVxuICAgICAgICAgIC5zb21lKHByb3BlcnR5ID0+IHBhY2thZ2VKc29uLl9fcHJvY2Vzc2VkX2J5X2l2eV9uZ2NjX18gIVtwcm9wZXJ0eV0gIT09IE5HQ0NfVkVSU0lPTikpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdUaGUgbmdjYyBjb21waWxlciBoYXMgY2hhbmdlZCBzaW5jZSB0aGUgbGFzdCBuZ2NjIGJ1aWxkLlxcbicgK1xuICAgICAgICAnUGxlYXNlIGNvbXBsZXRlbHkgcmVtb3ZlIGBub2RlX21vZHVsZXNgIGFuZCB0cnkgYWdhaW4uJyk7XG4gIH1cblxuICByZXR1cm4gcGFja2FnZUpzb24uX19wcm9jZXNzZWRfYnlfaXZ5X25nY2NfX1tmb3JtYXRdID09PSBOR0NDX1ZFUlNJT047XG59XG5cbi8qKlxuICogV3JpdGUgYSBidWlsZCBtYXJrZXIgZm9yIHRoZSBnaXZlbiBlbnRyeS1wb2ludCBhbmQgZm9ybWF0IHByb3BlcnR5LCB0byBpbmRpY2F0ZSB0aGF0IGl0IGhhc1xuICogYmVlbiBjb21waWxlZCBieSB0aGlzIHZlcnNpb24gb2YgbmdjYy5cbiAqXG4gKiBAcGFyYW0gZW50cnlQb2ludCB0aGUgZW50cnktcG9pbnQgdG8gd3JpdGUgYSBtYXJrZXIuXG4gKiBAcGFyYW0gZm9ybWF0IHRoZSBwcm9wZXJ0eSBpbiB0aGUgcGFja2FnZS5qc29uIG9mIHRoZSBmb3JtYXQgZm9yIHdoaWNoIHdlIGFyZSB3cml0aW5nIHRoZSBtYXJrZXIuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYXJrQXNQcm9jZXNzZWQoXG4gICAgcGFja2FnZUpzb246IEVudHJ5UG9pbnRQYWNrYWdlSnNvbiwgcGFja2FnZUpzb25QYXRoOiBBYnNvbHV0ZUZzUGF0aCxcbiAgICBmb3JtYXQ6IEVudHJ5UG9pbnRKc29uUHJvcGVydHkpIHtcbiAgaWYgKCFwYWNrYWdlSnNvbi5fX3Byb2Nlc3NlZF9ieV9pdnlfbmdjY19fKSBwYWNrYWdlSnNvbi5fX3Byb2Nlc3NlZF9ieV9pdnlfbmdjY19fID0ge307XG4gIHBhY2thZ2VKc29uLl9fcHJvY2Vzc2VkX2J5X2l2eV9uZ2NjX19bZm9ybWF0XSA9IE5HQ0NfVkVSU0lPTjtcbiAgd3JpdGVGaWxlU3luYyhwYWNrYWdlSnNvblBhdGgsIEpTT04uc3RyaW5naWZ5KHBhY2thZ2VKc29uLCBudWxsLCAyKSwgJ3V0ZjgnKTtcbn1cbiJdfQ==