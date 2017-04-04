import { ObjectLiteral } from "../../common/ObjectLiteral";
import { EntityMetadata } from "../../metadata/EntityMetadata";
import { QueryBuilder } from "../QueryBuilder";
/**
 * Transforms plain old javascript object
 * Entity is constructed based on its entity metadata.
 */
export declare class PlainObjectToDatabaseEntityTransformer {
    transform<Entity extends ObjectLiteral>(plainObject: ObjectLiteral, metadata: EntityMetadata, queryBuilder: QueryBuilder<Entity>): Promise<Entity | undefined>;
    private join<Entity>(qb, needToLoad, parentAlias);
    private buildLoadMap(object, metadata, isFirstLevelDepth?);
}
