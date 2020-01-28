"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// tslint:disable
// TODO: cleanup this file, it's copied as is from Angular CLI.
const core_1 = require("@angular-devkit/core");
const { bold, green, red, reset, white, yellow } = core_1.terminal;
function formatSize(size) {
    if (size <= 0) {
        return '0 bytes';
    }
    const abbreviations = ['bytes', 'kB', 'MB', 'GB'];
    const index = Math.floor(Math.log(size) / Math.log(1024));
    return `${+(size / Math.pow(1024, index)).toPrecision(3)} ${abbreviations[index]}`;
}
exports.formatSize = formatSize;
function statsToString(json, statsConfig) {
    const colors = statsConfig.colors;
    const rs = (x) => colors ? reset(x) : x;
    const w = (x) => colors ? bold(white(x)) : x;
    const g = (x) => colors ? bold(green(x)) : x;
    const y = (x) => colors ? bold(yellow(x)) : x;
    const changedChunksStats = json.chunks
        .filter((chunk) => chunk.rendered)
        .map((chunk) => {
        const asset = json.assets.filter((x) => x.name == chunk.files[0])[0];
        const size = asset ? ` ${formatSize(asset.size)}` : '';
        const files = chunk.files.join(', ');
        const names = chunk.names ? ` (${chunk.names.join(', ')})` : '';
        const initial = y(chunk.entry ? '[entry]' : chunk.initial ? '[initial]' : '');
        const flags = ['rendered', 'recorded']
            .map(f => f && chunk[f] ? g(` [${f}]`) : '')
            .join('');
        return `chunk {${y(chunk.id)}} ${g(files)}${names}${size} ${initial}${flags}`;
    });
    const unchangedChunkNumber = json.chunks.length - changedChunksStats.length;
    if (unchangedChunkNumber > 0) {
        return '\n' + rs(core_1.tags.stripIndents `
      Date: ${w(new Date().toISOString())} - Hash: ${w(json.hash)} - Time: ${w('' + json.time)}ms
      ${unchangedChunkNumber} unchanged chunks
      ${changedChunksStats.join('\n')}
      `);
    }
    else {
        return '\n' + rs(core_1.tags.stripIndents `
      Date: ${w(new Date().toISOString())}
      Hash: ${w(json.hash)}
      Time: ${w('' + json.time)}ms
      ${changedChunksStats.join('\n')}
      `);
    }
}
exports.statsToString = statsToString;
function statsWarningsToString(json, statsConfig) {
    const colors = statsConfig.colors;
    const rs = (x) => colors ? reset(x) : x;
    const y = (x) => colors ? bold(yellow(x)) : x;
    return rs('\n' + json.warnings.map((warning) => y(`WARNING in ${warning}`)).join('\n\n'));
}
exports.statsWarningsToString = statsWarningsToString;
function statsErrorsToString(json, statsConfig) {
    const colors = statsConfig.colors;
    const rs = (x) => colors ? reset(x) : x;
    const r = (x) => colors ? bold(red(x)) : x;
    return rs('\n' + json.errors.map((error) => r(`ERROR in ${error}`)).join('\n'));
}
exports.statsErrorsToString = statsErrorsToString;
