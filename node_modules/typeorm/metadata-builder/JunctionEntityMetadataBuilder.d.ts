import { NamingStrategyInterface } from "../naming-strategy/NamingStrategyInterface";
import { TableMetadata } from "../metadata/TableMetadata";
import { JoinTableMetadata } from "../metadata/JoinTableMetadata";
import { LazyRelationsWrapper } from "../lazy-loading/LazyRelationsWrapper";
import { EntityMetadata } from "../metadata/EntityMetadata";
import { Driver } from "../driver/Driver";
/**
 * Helps to create EntityMetadatas for junction tables.
 */
export interface JunctionEntityMetadataBuilderArgs {
    namingStrategy: NamingStrategyInterface;
    firstTable: TableMetadata;
    secondTable: TableMetadata;
    joinTable: JoinTableMetadata;
}
/**
 * Helps to create EntityMetadatas for junction tables.
 */
export declare class JunctionEntityMetadataBuilder {
    build(driver: Driver, lazyRelationsWrapper: LazyRelationsWrapper, args: JunctionEntityMetadataBuilderArgs): EntityMetadata;
}
