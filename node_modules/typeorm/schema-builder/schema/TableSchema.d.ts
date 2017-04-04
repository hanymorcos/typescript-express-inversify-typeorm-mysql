import { ColumnSchema } from "./ColumnSchema";
import { IndexSchema } from "./IndexSchema";
import { ForeignKeySchema } from "./ForeignKeySchema";
import { PrimaryKeySchema } from "./PrimaryKeySchema";
import { ColumnMetadata } from "../../metadata/ColumnMetadata";
import { QueryRunner } from "../../query-runner/QueryRunner";
import { ObjectLiteral } from "../../common/ObjectLiteral";
/**
 * Table schema in the database represented in this class.
 */
export declare class TableSchema {
    /**
     * Table name.
     */
    name: string;
    /**
     * Table columns.
     */
    columns: ColumnSchema[];
    /**
     * Table indices.
     */
    indices: IndexSchema[];
    /**
     * Table foreign keys.
     */
    foreignKeys: ForeignKeySchema[];
    /**
     * Table primary keys.
     */
    primaryKeys: PrimaryKeySchema[];
    /**
     * Indicates if table schema was just created.
     * This is needed, for example to check if we need to skip primary keys creation
     * for new table schemas.
     */
    justCreated: boolean;
    constructor(name: string, columns?: ColumnSchema[] | ObjectLiteral[], justCreated?: boolean);
    /**
     * Gets only those primary keys that does not
     */
    readonly primaryKeysWithoutGenerated: PrimaryKeySchema[];
    readonly hasGeneratedColumn: boolean;
    /**
     * Clones this table schema to a new table schema with all properties cloned.
     */
    clone(): TableSchema;
    /**
     * Adds column schemas.
     */
    addColumns(columns: ColumnSchema[]): void;
    /**
     * Replaces given column.
     */
    replaceColumn(oldColumn: ColumnSchema, newColumn: ColumnSchema): void;
    /**
     * Removes a column schema from this table schema.
     */
    removeColumn(columnToRemove: ColumnSchema): void;
    /**
     * Remove all column schemas from this table schema.
     */
    removeColumns(columns: ColumnSchema[]): void;
    /**
     * Adds all given primary keys.
     */
    addPrimaryKeys(addedKeys: PrimaryKeySchema[]): void;
    /**
     * Removes all given primary keys.
     */
    removePrimaryKeys(droppedKeys: PrimaryKeySchema[]): void;
    /**
     * Removes primary keys of the given columns.
     */
    removePrimaryKeysOfColumns(columns: ColumnSchema[]): void;
    /**
     * Adds foreign key schemas.
     */
    addForeignKeys(foreignKeys: ForeignKeySchema[]): void;
    /**
     * Removes foreign key from this table schema.
     */
    removeForeignKey(removedForeignKey: ForeignKeySchema): void;
    /**
     * Removes all foreign keys from this table schema.
     */
    removeForeignKeys(dbForeignKeys: ForeignKeySchema[]): void;
    /**
     * Removes index schema from this table schema.
     */
    removeIndex(indexSchema: IndexSchema): void;
    /**
     * Differentiate columns of this table schema and columns from the given column metadatas columns
     * and returns only changed.
     */
    findChangedColumns(queryRunner: QueryRunner, columnMetadatas: ColumnMetadata[]): ColumnSchema[];
}
