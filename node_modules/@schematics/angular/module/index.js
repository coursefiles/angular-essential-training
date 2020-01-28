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
const schematics_1 = require("@angular-devkit/schematics");
const ts = require("../third_party/github.com/Microsoft/TypeScript/lib/typescript");
const ast_utils_1 = require("../utility/ast-utils");
const change_1 = require("../utility/change");
const find_module_1 = require("../utility/find-module");
const lint_fix_1 = require("../utility/lint-fix");
const parse_name_1 = require("../utility/parse-name");
const workspace_1 = require("../utility/workspace");
function addDeclarationToNgModule(options) {
    return (host) => {
        if (!options.module) {
            return host;
        }
        const modulePath = options.module;
        const text = host.read(modulePath);
        if (text === null) {
            throw new schematics_1.SchematicsException(`File ${modulePath} does not exist.`);
        }
        const sourceText = text.toString('utf-8');
        const source = ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
        const importModulePath = core_1.normalize(`/${options.path}/`
            + (options.flat ? '' : core_1.strings.dasherize(options.name) + '/')
            + core_1.strings.dasherize(options.name)
            + '.module');
        const relativePath = find_module_1.buildRelativePath(modulePath, importModulePath);
        const changes = ast_utils_1.addImportToModule(source, modulePath, core_1.strings.classify(`${options.name}Module`), relativePath);
        const recorder = host.beginUpdate(modulePath);
        for (const change of changes) {
            if (change instanceof change_1.InsertChange) {
                recorder.insertLeft(change.pos, change.toAdd);
            }
        }
        host.commitUpdate(recorder);
        return host;
    };
}
function default_1(options) {
    return async (host) => {
        if (options.path === undefined) {
            options.path = await workspace_1.createDefaultPath(host, options.project);
        }
        if (options.module) {
            options.module = find_module_1.findModuleFromOptions(host, options);
        }
        const parsedPath = parse_name_1.parseName(options.path, options.name);
        options.name = parsedPath.name;
        options.path = parsedPath.path;
        const templateSource = schematics_1.apply(schematics_1.url('./files'), [
            options.routing ? schematics_1.noop() : schematics_1.filter(path => !path.endsWith('-routing.module.ts.template')),
            schematics_1.applyTemplates({
                ...core_1.strings,
                'if-flat': (s) => options.flat ? '' : s,
                ...options,
            }),
            schematics_1.move(parsedPath.path),
        ]);
        return schematics_1.chain([
            addDeclarationToNgModule(options),
            schematics_1.mergeWith(templateSource),
            options.lintFix ? lint_fix_1.applyLintFix(options.path) : schematics_1.noop(),
        ]);
    };
}
exports.default = default_1;
