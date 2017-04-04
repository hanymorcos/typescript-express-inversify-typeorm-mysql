import { EntityMetadata } from "../metadata/EntityMetadata";
import { NamingStrategyInterface } from "../naming-strategy/NamingStrategyInterface";
import { EntitySchema } from "../entity-schema/EntitySchema";
import { LazyRelationsWrapper } from "../lazy-loading/LazyRelationsWrapper";
import { Driver } from "../driver/Driver";
/**
 * Aggregates all metadata: table, column, relation into one collection grouped by tables for a given set of classes.
 */
export declare class EntityMetadataBuilder {
    buildFromSchemas(driver: Driver, lazyRelationsWrapper: LazyRelationsWrapper, namingStrategy: NamingStrategyInterface, schemas: EntitySchema[]): EntityMetadata[];
    /**
     * Builds a complete metadata aggregations for the given entity classes.
     */
    buildFromMetadataArgsStorage(driver: Driver, lazyRelationsWrapper: LazyRelationsWrapper, namingStrategy: NamingStrategyInterface, entityClasses?: Function[]): EntityMetadata[];
    private build(driver, lazyRelationsWrapper, metadataArgsStorage, namingStrategy, entityClasses?);
}
