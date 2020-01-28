"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
const child_process_1 = require("child_process");
async function default_1(packageName, logger, packageManager, projectRoot, save = true) {
    const installArgs = [];
    switch (packageManager) {
        case 'cnpm':
        case 'pnpm':
        case 'npm':
            installArgs.push('install');
            break;
        case 'yarn':
            installArgs.push('add');
            break;
        default:
            packageManager = 'npm';
            installArgs.push('install');
            break;
    }
    logger.info(core_1.terminal.green(`Installing packages for tooling via ${packageManager}.`));
    if (packageName) {
        installArgs.push(packageName);
    }
    if (!save) {
        installArgs.push('--no-save');
    }
    installArgs.push('--quiet');
    await new Promise((resolve, reject) => {
        child_process_1.spawn(packageManager, installArgs, { stdio: 'inherit', shell: true })
            .on('close', (code) => {
            if (code === 0) {
                logger.info(core_1.terminal.green(`Installed packages for tooling via ${packageManager}.`));
                resolve();
            }
            else {
                reject('Package install failed, see above.');
            }
        });
    });
}
exports.default = default_1;
