import { TableSchema } from "./schema/TableSchema";
import { ColumnSchema } from "./schema/ColumnSchema";
import { Driver } from "../driver/Driver";
import { QueryRunner } from "../query-runner/QueryRunner";
import { Logger } from "../logger/Logger";
import { ColumnMetadata } from "../metadata/ColumnMetadata";
import { EntityMetadata } from "../metadata/EntityMetadata";
/**
 * Creates complete tables schemas in the database based on the entity metadatas.
 *
 * Steps how schema is being built:
 * 1. load list of all tables with complete column and keys information from the db
 * 2. drop all (old) foreign keys that exist in the table, but does not exist in the metadata
 * 3. create new tables that does not exist in the db, but exist in the metadata
 * 4. drop all columns exist (left old) in the db table, but does not exist in the metadata
 * 5. add columns from metadata which does not exist in the table
 * 6. update all exist columns which metadata has changed
 * 7. update primary keys - update old and create new primary key from changed columns
 * 8. create foreign keys which does not exist in the table yet
 * 9. create indices which are missing in db yet, and drops indices which exist in the db, but does not exist in the metadata anymore
 */
export declare class SchemaBuilder {
    protected driver: Driver;
    protected logger: Logger;
    protected entityMetadatas: EntityMetadata[];
    /**
     * Used to execute schema creation queries in a single connection.
     */
    protected queryRunner: QueryRunner;
    /**
     * All synchronized tables in the database.
     */
    protected tableSchemas: TableSchema[];
    /**
     * @param driver Driver needs to create a query runner
     * @param logger Used to log schema creation events
     * @param entityMetadatas All entities to create schema for
     */
    constructor(driver: Driver, logger: Logger, entityMetadatas: EntityMetadata[]);
    /**
     * Creates complete schemas for the given entity metadatas.
     */
    build(): Promise<void>;
    protected readonly entityToSyncMetadatas: EntityMetadata[];
    /**
     * Loads all table schemas from the database.
     */
    protected loadTableSchemas(): Promise<TableSchema[]>;
    /**
     * Drops all (old) foreign keys that exist in the table schemas, but do not exist in the entity metadata.
     */
    protected dropOldForeignKeys(): Promise<void>;
    /**
     * Creates tables that do not exist in the database yet.
     * New tables are created without foreign and primary keys.
     * Primary key only can be created in conclusion with auto generated column.
     */
    protected createNewTables(): Promise<void>;
    /**
     * Drops all columns that exist in the table, but does not exist in the metadata (left old).
     * We drop their keys too, since it should be safe.
     */
    protected dropRemovedColumns(): Promise<void[]>;
    /**
     * Adds columns from metadata which does not exist in the table.
     * Columns are created without keys.
     */
    protected addNewColumns(): Promise<void[]>;
    /**
     * Update all exist columns which metadata has changed.
     * Still don't create keys. Also we don't touch foreign keys of the changed columns.
     */
    protected updateExistColumns(): Promise<void[]>;
    /**
     * Creates primary keys which does not exist in the table yet.
     */
    protected updatePrimaryKeys(): Promise<void[]>;
    /**
     * Creates foreign keys which does not exist in the table yet.
     */
    protected createForeignKeys(): Promise<void[]>;
    /**
     * Creates indices which are missing in db yet, and drops indices which exist in the db,
     * but does not exist in the metadata anymore.
     */
    protected createIndices(): Promise<void[]>;
    /**
     * Drops all indices where given column of the given table is being used.
     */
    protected dropColumnReferencedIndices(tableName: string, columnName: string): Promise<void>;
    /**
     * Drops all foreign keys where given column of the given table is being used.
     */
    protected dropColumnReferencedForeignKeys(tableName: string, columnName: string): Promise<void>;
    /**
     * Creates new column schemas from the given column metadatas.
     */
    protected metadataColumnsToColumnSchemas(columns: ColumnMetadata[]): ColumnSchema[];
}
