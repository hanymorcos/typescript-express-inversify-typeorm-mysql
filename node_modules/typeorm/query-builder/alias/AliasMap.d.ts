import { EntityMetadata } from "../../metadata/EntityMetadata";
import { Alias } from "./Alias";
import { Connection } from "../../connection/Connection";
/**
 */
export declare class AliasMap {
    private connection;
    aliases: Alias[];
    constructor(connection: Connection);
    addMainAlias(alias: Alias): void;
    addAlias(alias: Alias): void;
    readonly hasMainAlias: boolean;
    readonly mainAlias: Alias;
    findAliasByName(name: string): Alias | undefined;
    findAliasByParent(parentAliasName: string, parentPropertyName: string): Alias | undefined;
    getEntityMetadataByAlias(alias: Alias): EntityMetadata | undefined;
}
