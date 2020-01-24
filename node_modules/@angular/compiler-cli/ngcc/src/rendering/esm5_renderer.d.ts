/// <amd-module name="@angular/compiler-cli/ngcc/src/rendering/esm5_renderer" />
import MagicString from 'magic-string';
import { NgccReflectionHost } from '../host/ngcc_host';
import { CompiledClass } from '../analysis/decoration_analyzer';
import { EsmRenderer } from './esm_renderer';
import { EntryPointBundle } from '../packages/entry_point_bundle';
import { Logger } from '../logging/logger';
export declare class Esm5Renderer extends EsmRenderer {
    constructor(logger: Logger, host: NgccReflectionHost, isCore: boolean, bundle: EntryPointBundle, sourcePath: string);
    /**
     * Add the definitions to each decorated class
     */
    addDefinitions(output: MagicString, compiledClass: CompiledClass, definitions: string): void;
}
