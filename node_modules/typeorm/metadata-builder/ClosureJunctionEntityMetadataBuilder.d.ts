import { EntityMetadata } from "../metadata/EntityMetadata";
import { NamingStrategyInterface } from "../naming-strategy/NamingStrategyInterface";
import { ColumnMetadata } from "../metadata/ColumnMetadata";
import { TableMetadata } from "../metadata/TableMetadata";
import { LazyRelationsWrapper } from "../lazy-loading/LazyRelationsWrapper";
import { Driver } from "../driver/Driver";
/**
 * Helps to create EntityMetadatas for junction tables.
 */
export interface ClosureJunctionEntityMetadataBuilderArgs {
    namingStrategy: NamingStrategyInterface;
    table: TableMetadata;
    primaryColumn: ColumnMetadata;
    hasTreeLevelColumn: boolean;
}
/**
 * Helps to create EntityMetadatas for junction tables for closure tables.
 */
export declare class ClosureJunctionEntityMetadataBuilder {
    build(driver: Driver, lazyRelationsWrapper: LazyRelationsWrapper, args: ClosureJunctionEntityMetadataBuilderArgs): EntityMetadata;
}
