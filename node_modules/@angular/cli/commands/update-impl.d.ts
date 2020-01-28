import { Arguments, Option } from '../models/interface';
import { SchematicCommand } from '../models/schematic-command';
import { Schema as UpdateCommandSchema } from './update';
export declare class UpdateCommand extends SchematicCommand<UpdateCommandSchema> {
    readonly allowMissingWorkspace = true;
    parseArguments(_schematicOptions: string[], _schema: Option[]): Promise<Arguments>;
    run(options: UpdateCommandSchema & Arguments): Promise<number | void>;
    checkCleanGit(): boolean;
}
