import { RelationMetadata } from "./RelationMetadata";
import { ColumnMetadata } from "./ColumnMetadata";
import { JoinColumnMetadataArgs } from "../metadata-args/JoinColumnMetadataArgs";
/**
 * JoinColumnMetadata contains all information about relation's join column.
 */
export declare class JoinColumnMetadata {
    /**
     * Relation - owner of this join column metadata.
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
     * Join column name.
     */
    private readonly _name;
    /**
     * Join column referenced column name.
     */
    private readonly referencedColumnName;
    constructor(args: JoinColumnMetadataArgs);
    /**
     * Join column name.
     */
    readonly name: string;
    /**
     * Referenced join column.
     */
    readonly referencedColumn: ColumnMetadata;
}
