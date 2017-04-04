import { ColumnMetadata } from "./ColumnMetadata";
import { TableMetadata } from "./TableMetadata";
import { EntityMetadata } from "./EntityMetadata";
/**
 * ON_DELETE type to be used to specify delete strategy when some relation is being deleted from the database.
 */
export declare type OnDeleteType = "RESTRICT" | "CASCADE" | "SET NULL";
/**
 * Contains all information about entity's foreign key.
 */
export declare class ForeignKeyMetadata {
    /**
     * Entity metadata where this foreign key is.
     */
    entityMetadata: EntityMetadata;
    /**
     * Array of columns of this foreign key.
     */
    readonly columns: ColumnMetadata[];
    /**
     * Table to which this foreign key is references.
     */
    readonly referencedTable: TableMetadata;
    /**
     * Array of referenced columns.
     */
    readonly referencedColumns: ColumnMetadata[];
    /**
     * What to do with a relation on deletion of the row containing a foreign key.
     */
    readonly onDelete: OnDeleteType;
    constructor(columns: ColumnMetadata[], referencedTable: TableMetadata, referencedColumns: ColumnMetadata[], onDelete?: OnDeleteType);
    /**
     * Gets the table name to which this foreign key is applied.
     */
    readonly tableName: string;
    /**
     * Gets the table name to which this foreign key is referenced.
     */
    readonly referencedTableName: string;
    /**
     * Gets foreign key name.
     */
    readonly name: string;
    /**
     * Gets array of column names.
     */
    readonly columnNames: string[];
    /**
     * Gets array of referenced column names.
     */
    readonly referencedColumnNames: string[];
}
