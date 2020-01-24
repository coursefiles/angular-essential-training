"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const require_project_module_1 = require("../utilities/require-project-module");
function readTsconfig(tsconfigPath) {
    const projectTs = require_project_module_1.requireProjectModule(path.dirname(tsconfigPath), 'typescript');
    const configResult = projectTs.readConfigFile(tsconfigPath, projectTs.sys.readFile);
    const tsConfig = projectTs.parseJsonConfigFileContent(configResult.config, projectTs.sys, path.dirname(tsconfigPath), undefined, tsconfigPath);
    if (tsConfig.errors.length > 0) {
        throw new Error(`Errors found while reading ${tsconfigPath}:\n  ${tsConfig.errors.map(e => e.messageText).join('\n  ')}`);
    }
    return tsConfig;
}
exports.readTsconfig = readTsconfig;
