"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const node_1 = require("@angular-devkit/core/node");
// Resolve dependencies within the target project.
function resolveProjectModule(root, moduleName) {
    return node_1.resolve(moduleName, {
        basedir: root,
        checkGlobal: false,
        checkLocal: true,
    });
}
exports.resolveProjectModule = resolveProjectModule;
// Require dependencies within the target project.
function requireProjectModule(root, moduleName) {
    return require(resolveProjectModule(root, moduleName));
}
exports.requireProjectModule = requireProjectModule;
