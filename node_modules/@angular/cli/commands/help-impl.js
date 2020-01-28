"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const core_1 = require("@angular-devkit/core");
const command_1 = require("../models/command");
class HelpCommand extends command_1.Command {
    async run() {
        this.logger.info(`Available Commands:`);
        for (const name of Object.keys(command_1.Command.commandMap)) {
            const cmd = command_1.Command.commandMap[name];
            if (cmd.hidden) {
                continue;
            }
            const aliasInfo = cmd.aliases.length > 0 ? ` (${cmd.aliases.join(', ')})` : '';
            this.logger.info(`  ${core_1.terminal.cyan(cmd.name)}${aliasInfo} ${cmd.description}`);
        }
        this.logger.info(`\nFor more detailed help run "ng [command name] --help"`);
    }
}
exports.HelpCommand = HelpCommand;
