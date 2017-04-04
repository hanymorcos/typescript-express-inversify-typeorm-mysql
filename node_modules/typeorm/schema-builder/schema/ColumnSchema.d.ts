import { ColumnMetadata } from "../../metadata/ColumnMetadata";
/**
 * Table's column's schema in the database represented in this class.
 */
export declare class ColumnSchema {
    /**
     * Column name.
     */
    name: string;
    /**
     * Column type.
     */
    type: string;
    /**
     * Column's default value.
     */
    default: any;
    /**
     * Indicates if column is NULL, or is NOT NULL in the database.
     */
    isNullable: boolean;
    /**
     * Indicates if column is auto-generated sequence.
     */
    isGenerated: boolean;
    /**
     * Indicates if column is a primary key.
     */
    isPrimary: boolean;
    /**
     * Indicates if column has unique value.
     */
    isUnique: boolean;
    /**
     * Column's comment.
     */
    comment: string | undefined;
    constructor(options?: {
        name?: string;
        type?: string;
        default?: string;
        isNullable?: boolean;
        isGenerated?: boolean;
        isPrimary?: boolean;
        isUnique?: boolean;
        comment?: string;
    });
    /**
     * Clones this column schema to a new column schema with exact same properties as this column schema has.
     */
    clone(): ColumnSchema;
    /**
     * Creates a new column based on the given column metadata.
     */
    static create(columnMetadata: ColumnMetadata, normalizedType: string): ColumnSchema;
}
