import { ColumnMetadataArgs } from "../metadata-args/ColumnMetadataArgs";
import { ColumnType } from "./types/ColumnTypes";
import { EntityMetadata } from "./EntityMetadata";
import { EmbeddedMetadata } from "./EmbeddedMetadata";
import { RelationMetadata } from "./RelationMetadata";
/**
 * Kinda type of the column. Not a type in the database, but locally used type to determine what kind of column
 * we are working with.
 * For example, "primary" means that it will be a primary column, or "createDate" means that it will create a create
 * date column.
 */
export declare type ColumnMode = "regular" | "virtual" | "createDate" | "updateDate" | "version" | "treeChildrenCount" | "treeLevel" | "discriminator" | "parentId";
/**
 * This metadata contains all information about entity's column.
 */
export declare class ColumnMetadata {
    /**
     * Entity metadata where this column metadata is.
     */
    entityMetadata: EntityMetadata;
    /**
     * Embedded metadata where this column metadata is.
     */
    embeddedMetadata: EmbeddedMetadata;
    /**
     * If this column is foreign key of some relation then this relation's metadata will be here.
     */
    relationMetadata: RelationMetadata;
    /**
     * Target class to which metadata is applied.
     */
    readonly target: Function | string | "__virtual__";
    /**
     * Target's property name to which this metadata is applied.
     */
    readonly propertyName: string;
    /**
     * The real reflected property type.
     */
    /**
     * The database type of the column.
     */
    readonly type: ColumnType;
    /**
     * Column's mode in which this column is working.
     */
    readonly mode: ColumnMode;
    /**
     * Type's length in the database.
     */
    readonly length: string;
    /**
     * Indicates if this column is a primary key.
     */
    readonly isPrimary: boolean;
    /**
     * Indicates if this column is generated (auto increment or generated other way).
     */
    readonly isGenerated: boolean;
    /**
     * Indicates if value in the database should be unique or not.
     */
    readonly isUnique: boolean;
    /**
     * Indicates if column can contain nulls or not.
     */
    readonly isNullable: boolean;
    /**
     * Column comment.
     */
    readonly comment: string;
    /**
     * Default database value.
     */
    readonly default: any;
    /**
     * The precision for a decimal (exact numeric) column (applies only for decimal column), which is the maximum
     * number of digits that are stored for the values.
     */
    readonly precision: number;
    /**
     * The scale for a decimal (exact numeric) column (applies only for decimal column), which represents the number
     * of digits to the right of the decimal point and must not be greater than precision.
     */
    readonly scale: number;
    /**
     * Indicates if this date column will contain a timezone.
     * Used only for date-typed column types.
     * Note that timezone option is not supported by all databases (only postgres for now).
     */
    readonly timezone: boolean;
    /**
     * Indicates if date object must be stored in given date's timezone.
     * By default date is saved in UTC timezone.
     * Works only with "datetime" columns.
     */
    readonly localTimezone?: boolean;
    /**
     * Column name to be used in the database.
     */
    private _name;
    constructor(args: ColumnMetadataArgs);
    /**
     * Gets column's entity target.
     * Original target returns target of the class where column is.
     * This class can be an abstract class, but column even is from that class,
     * but its more related to a specific entity. That's why we need this field.
     */
    readonly entityTarget: Function | string;
    /**
     * Column name in the database.
     */
    readonly name: string;
    /**
     * Indicates if this column is in embedded, not directly in the table.
     */
    readonly isInEmbedded: boolean;
    /**
     * Indicates if column is virtual. Virtual columns are not mapped to the entity.
     */
    readonly isVirtual: boolean;
    /**
     * Indicates if column is a parent id. Parent id columns are not mapped to the entity.
     */
    readonly isParentId: boolean;
    /**
     * Indicates if column is discriminator. Discriminator columns are not mapped to the entity.
     */
    readonly isDiscriminator: boolean;
    /**
     * Indicates if this column contains an entity creation date.
     */
    readonly isCreateDate: boolean;
    /**
     * Indicates if this column contains an entity update date.
     */
    readonly isUpdateDate: boolean;
    /**
     * Indicates if this column contains an entity version.
     */
    readonly isVersion: boolean;
    /**
     * If this column references some column, it gets the first referenced column of this column.
     */
    readonly referencedColumn: ColumnMetadata | undefined;
    /**
     * Gets embedded property in which column is.
     */
    readonly embeddedProperty: string;
    hasEntityValue(entity: any): boolean;
    getEntityValue(entity: any): any;
}
