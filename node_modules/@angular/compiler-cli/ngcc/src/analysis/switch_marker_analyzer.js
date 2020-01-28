(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/analysis/switch_marker_analyzer", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SwitchMarkerAnalyses = Map;
    /**
     * This Analyzer will analyse the files that have an R3 switch marker in them
     * that will be replaced.
     */
    var SwitchMarkerAnalyzer = /** @class */ (function () {
        function SwitchMarkerAnalyzer(host) {
            this.host = host;
        }
        /**
         * Analyze the files in the program to identify declarations that contain R3
         * switch markers.
         * @param program The program to analyze.
         * @return A map of source files to analysis objects. The map will contain only the
         * source files that had switch markers, and the analysis will contain an array of
         * the declarations in that source file that contain the marker.
         */
        SwitchMarkerAnalyzer.prototype.analyzeProgram = function (program) {
            var _this = this;
            var analyzedFiles = new exports.SwitchMarkerAnalyses();
            program.getSourceFiles().forEach(function (sourceFile) {
                var declarations = _this.host.getSwitchableDeclarations(sourceFile);
                if (declarations.length) {
                    analyzedFiles.set(sourceFile, { sourceFile: sourceFile, declarations: declarations });
                }
            });
            return analyzedFiles;
        };
        return SwitchMarkerAnalyzer;
    }());
    exports.SwitchMarkerAnalyzer = SwitchMarkerAnalyzer;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dpdGNoX21hcmtlcl9hbmFseXplci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9uZ2NjL3NyYy9hbmFseXNpcy9zd2l0Y2hfbWFya2VyX2FuYWx5emVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBZ0JhLFFBQUEsb0JBQW9CLEdBQUcsR0FBRyxDQUFDO0lBRXhDOzs7T0FHRztJQUNIO1FBQ0UsOEJBQW9CLElBQXdCO1lBQXhCLFNBQUksR0FBSixJQUFJLENBQW9CO1FBQUcsQ0FBQztRQUNoRDs7Ozs7OztXQU9HO1FBQ0gsNkNBQWMsR0FBZCxVQUFlLE9BQW1CO1lBQWxDLGlCQVNDO1lBUkMsSUFBTSxhQUFhLEdBQUcsSUFBSSw0QkFBb0IsRUFBRSxDQUFDO1lBQ2pELE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxPQUFPLENBQUMsVUFBQSxVQUFVO2dCQUN6QyxJQUFNLFlBQVksR0FBRyxLQUFJLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUNyRSxJQUFJLFlBQVksQ0FBQyxNQUFNLEVBQUU7b0JBQ3ZCLGFBQWEsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLEVBQUMsVUFBVSxZQUFBLEVBQUUsWUFBWSxjQUFBLEVBQUMsQ0FBQyxDQUFDO2lCQUMzRDtZQUNILENBQUMsQ0FBQyxDQUFDO1lBQ0gsT0FBTyxhQUFhLENBQUM7UUFDdkIsQ0FBQztRQUNILDJCQUFDO0lBQUQsQ0FBQyxBQXBCRCxJQW9CQztJQXBCWSxvREFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcbmltcG9ydCB7TmdjY1JlZmxlY3Rpb25Ib3N0LCBTd2l0Y2hhYmxlVmFyaWFibGVEZWNsYXJhdGlvbn0gZnJvbSAnLi4vaG9zdC9uZ2NjX2hvc3QnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFN3aXRjaE1hcmtlckFuYWx5c2lzIHtcbiAgc291cmNlRmlsZTogdHMuU291cmNlRmlsZTtcbiAgZGVjbGFyYXRpb25zOiBTd2l0Y2hhYmxlVmFyaWFibGVEZWNsYXJhdGlvbltdO1xufVxuXG5leHBvcnQgdHlwZSBTd2l0Y2hNYXJrZXJBbmFseXNlcyA9IE1hcDx0cy5Tb3VyY2VGaWxlLCBTd2l0Y2hNYXJrZXJBbmFseXNpcz47XG5leHBvcnQgY29uc3QgU3dpdGNoTWFya2VyQW5hbHlzZXMgPSBNYXA7XG5cbi8qKlxuICogVGhpcyBBbmFseXplciB3aWxsIGFuYWx5c2UgdGhlIGZpbGVzIHRoYXQgaGF2ZSBhbiBSMyBzd2l0Y2ggbWFya2VyIGluIHRoZW1cbiAqIHRoYXQgd2lsbCBiZSByZXBsYWNlZC5cbiAqL1xuZXhwb3J0IGNsYXNzIFN3aXRjaE1hcmtlckFuYWx5emVyIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBob3N0OiBOZ2NjUmVmbGVjdGlvbkhvc3QpIHt9XG4gIC8qKlxuICAgKiBBbmFseXplIHRoZSBmaWxlcyBpbiB0aGUgcHJvZ3JhbSB0byBpZGVudGlmeSBkZWNsYXJhdGlvbnMgdGhhdCBjb250YWluIFIzXG4gICAqIHN3aXRjaCBtYXJrZXJzLlxuICAgKiBAcGFyYW0gcHJvZ3JhbSBUaGUgcHJvZ3JhbSB0byBhbmFseXplLlxuICAgKiBAcmV0dXJuIEEgbWFwIG9mIHNvdXJjZSBmaWxlcyB0byBhbmFseXNpcyBvYmplY3RzLiBUaGUgbWFwIHdpbGwgY29udGFpbiBvbmx5IHRoZVxuICAgKiBzb3VyY2UgZmlsZXMgdGhhdCBoYWQgc3dpdGNoIG1hcmtlcnMsIGFuZCB0aGUgYW5hbHlzaXMgd2lsbCBjb250YWluIGFuIGFycmF5IG9mXG4gICAqIHRoZSBkZWNsYXJhdGlvbnMgaW4gdGhhdCBzb3VyY2UgZmlsZSB0aGF0IGNvbnRhaW4gdGhlIG1hcmtlci5cbiAgICovXG4gIGFuYWx5emVQcm9ncmFtKHByb2dyYW06IHRzLlByb2dyYW0pOiBTd2l0Y2hNYXJrZXJBbmFseXNlcyB7XG4gICAgY29uc3QgYW5hbHl6ZWRGaWxlcyA9IG5ldyBTd2l0Y2hNYXJrZXJBbmFseXNlcygpO1xuICAgIHByb2dyYW0uZ2V0U291cmNlRmlsZXMoKS5mb3JFYWNoKHNvdXJjZUZpbGUgPT4ge1xuICAgICAgY29uc3QgZGVjbGFyYXRpb25zID0gdGhpcy5ob3N0LmdldFN3aXRjaGFibGVEZWNsYXJhdGlvbnMoc291cmNlRmlsZSk7XG4gICAgICBpZiAoZGVjbGFyYXRpb25zLmxlbmd0aCkge1xuICAgICAgICBhbmFseXplZEZpbGVzLnNldChzb3VyY2VGaWxlLCB7c291cmNlRmlsZSwgZGVjbGFyYXRpb25zfSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGFuYWx5emVkRmlsZXM7XG4gIH1cbn1cbiJdfQ==