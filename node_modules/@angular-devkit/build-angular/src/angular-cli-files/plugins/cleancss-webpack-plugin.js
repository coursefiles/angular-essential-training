"use strict";
// tslint:disable
// TODO: cleanup this file, it's copied as is from Angular CLI.
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_sources_1 = require("webpack-sources");
const CleanCSS = require('clean-css');
function hook(compiler, action) {
    compiler.hooks.compilation.tap('cleancss-webpack-plugin', (compilation) => {
        compilation.hooks.optimizeChunkAssets.tapPromise('cleancss-webpack-plugin', (chunks) => action(compilation, chunks));
    });
}
class CleanCssWebpackPlugin {
    constructor(options) {
        this._options = {
            sourceMap: false,
            test: (file) => file.endsWith('.css'),
            ...options,
        };
    }
    apply(compiler) {
        hook(compiler, (compilation, chunks) => {
            const cleancss = new CleanCSS({
                compatibility: 'ie9',
                level: {
                    2: {
                        skipProperties: [
                            'transition',
                            'font',
                        ]
                    }
                },
                inline: false,
                returnPromise: true,
                sourceMap: this._options.sourceMap,
            });
            const files = [...compilation.additionalChunkAssets];
            chunks.forEach(chunk => {
                if (chunk.files && chunk.files.length > 0) {
                    files.push(...chunk.files);
                }
            });
            const actions = files
                .filter(file => this._options.test(file))
                .map(file => {
                const asset = compilation.assets[file];
                if (!asset) {
                    return Promise.resolve();
                }
                let content;
                let map;
                if (this._options.sourceMap && asset.sourceAndMap) {
                    const sourceAndMap = asset.sourceAndMap();
                    content = sourceAndMap.source;
                    map = sourceAndMap.map;
                }
                else {
                    content = asset.source();
                }
                if (content.length === 0) {
                    return Promise.resolve();
                }
                return Promise.resolve()
                    .then(() => map ? cleancss.minify(content, map) : cleancss.minify(content))
                    .then((output) => {
                    let hasWarnings = false;
                    if (output.warnings && output.warnings.length > 0) {
                        compilation.warnings.push(...output.warnings);
                        hasWarnings = true;
                    }
                    if (output.errors && output.errors.length > 0) {
                        output.errors
                            .forEach((error) => compilation.errors.push(new Error(error)));
                        return;
                    }
                    // generally means invalid syntax so bail
                    if (hasWarnings && output.stats.minifiedSize === 0) {
                        return;
                    }
                    let newSource;
                    if (output.sourceMap) {
                        newSource = new webpack_sources_1.SourceMapSource(output.styles, file, output.sourceMap.toString(), content, map);
                    }
                    else {
                        newSource = new webpack_sources_1.RawSource(output.styles);
                    }
                    compilation.assets[file] = newSource;
                });
            });
            return Promise.all(actions);
        });
    }
}
exports.CleanCssWebpackPlugin = CleanCssWebpackPlugin;
