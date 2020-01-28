"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const path = require("path");
const augment_index_html_1 = require("../utilities/index-file/augment-index-html");
function readFile(filename, compilation) {
    return new Promise((resolve, reject) => {
        compilation.inputFileSystem.readFile(filename, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            let content;
            if (data.length >= 3 && data[0] === 0xEF && data[1] === 0xBB && data[2] === 0xBF) {
                // Strip UTF-8 BOM
                content = data.toString('utf8', 3);
            }
            else if (data.length >= 2 && data[0] === 0xFF && data[1] === 0xFE) {
                // Strip UTF-16 LE BOM
                content = data.toString('utf16le', 2);
            }
            else {
                content = data.toString();
            }
            resolve(content);
        });
    });
}
class IndexHtmlWebpackPlugin {
    constructor(options) {
        this._options = {
            input: 'index.html',
            output: 'index.html',
            entrypoints: ['polyfills', 'main'],
            noModuleEntrypoints: [],
            sri: false,
            ...options,
        };
    }
    apply(compiler) {
        compiler.hooks.emit.tapPromise('index-html-webpack-plugin', async (compilation) => {
            // Get input html file
            const inputContent = await readFile(this._options.input, compilation);
            compilation
                .fileDependencies.add(this._options.input);
            // Get all files for selected entrypoints
            const files = [];
            const noModuleFiles = [];
            for (const [entryName, entrypoint] of compilation.entrypoints) {
                const entryFiles = (entrypoint && entrypoint.getFiles() || [])
                    .map((f) => ({
                    name: entryName,
                    file: f,
                    extension: path.extname(f),
                }));
                if (this._options.noModuleEntrypoints.includes(entryName)) {
                    noModuleFiles.push(...entryFiles);
                }
                else {
                    files.push(...entryFiles);
                }
            }
            const loadOutputFile = (name) => compilation.assets[name].source();
            const indexSource = await augment_index_html_1.augmentIndexHtml({
                input: this._options.input,
                inputContent,
                baseHref: this._options.baseHref,
                deployUrl: this._options.deployUrl,
                sri: this._options.sri,
                files,
                noModuleFiles,
                loadOutputFile,
                entrypoints: this._options.entrypoints,
            });
            // Add to compilation assets
            compilation.assets[this._options.output] = indexSource;
        });
    }
}
exports.IndexHtmlWebpackPlugin = IndexHtmlWebpackPlugin;
