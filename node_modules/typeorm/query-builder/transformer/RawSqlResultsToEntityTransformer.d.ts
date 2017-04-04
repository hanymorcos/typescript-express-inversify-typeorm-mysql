import { AliasMap } from "../alias/AliasMap";
import { Driver } from "../../driver/Driver";
import { JoinMapping, RelationCountMeta } from "../QueryBuilder";
/**
 * Transforms raw sql results returned from the database into entity object.
 * Entity is constructed based on its entity metadata.
 */
export declare class RawSqlResultsToEntityTransformer {
    private driver;
    private aliasMap;
    private joinMappings;
    private relationCountMetas;
    private enableRelationIdValues;
    constructor(driver: Driver, aliasMap: AliasMap, joinMappings: JoinMapping[], relationCountMetas: RelationCountMeta[], enableRelationIdValues: boolean);
    transform(rawSqlResults: any[]): any[];
    /**
     * Since db returns a duplicated rows of the data where accuracies of the same object can be duplicated
     * we need to group our result and we must have some unique id (primary key in our case)
     */
    private groupAndTransform(rawSqlResults, alias);
    /**
     * Transforms set of data results into single entity.
     */
    private transformIntoSingleResult(rawSqlResults, alias, metadata);
}
