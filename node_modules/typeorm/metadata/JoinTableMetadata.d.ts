import { RelationMetadata } from "./RelationMetadata";
import { ColumnMetadata } from "./ColumnMetadata";
import { JoinTableMetadataArgs } from "../metadata-args/JoinTableMetadataArgs";
/**
 * JoinTableMetadata contains all information about relation's join table.
 */
export declare class JoinTableMetadata {
    /**
     * Relation - owner of this join table metadata.
     */
    relation: RelationMetadata;
    /**
     * Target class to which metadata is applied.
     */
    readonly target: Function | string;
    /**
     * Target's property name to which this metadata is applied.
     */
    readonly propertyName: string;
    /**
     * Join table name.
     */
    private readonly _name?;
    /**
     * Join column name.
     */
    private readonly _joinColumnName;
    /**
     * Join column referenced column name.
     */
    private readonly _joinColumnReferencedColumnName;
    /**
     * Join column name of the inverse side.
     */
    private readonly _inverseJoinColumnName;
    /**
     * Join column referenced column name of the inverse side.
     */
    private readonly _inverseJoinColumnReferencedColumnName;
    constructor(args: JoinTableMetadataArgs);
    /**
     * Join table name.
     */
    readonly name: string;
    /**
     * Join column name.
     */
    readonly joinColumnName: string;
    /**
     * Join column name of the inverse side.
     */
    readonly inverseJoinColumnName: string;
    /**
     * Referenced join column.
     */
    readonly referencedColumn: ColumnMetadata;
    /**
     * Referenced join column of the inverse side.
     */
    readonly inverseReferencedColumn: ColumnMetadata;
}
