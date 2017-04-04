import { QueryRunner } from "../../query-runner/QueryRunner";
import { ObjectLiteral } from "../../common/ObjectLiteral";
import { Logger } from "../../logger/Logger";
import { DatabaseConnection } from "../DatabaseConnection";
import { PostgresDriver } from "./PostgresDriver";
import { ColumnSchema } from "../../schema-builder/schema/ColumnSchema";
import { ColumnMetadata } from "../../metadata/ColumnMetadata";
import { TableSchema } from "../../schema-builder/schema/TableSchema";
import { IndexSchema } from "../../schema-builder/schema/IndexSchema";
import { ForeignKeySchema } from "../../schema-builder/schema/ForeignKeySchema";
import { ColumnType } from "../../metadata/types/ColumnTypes";
/**
 * Runs queries on a single postgres database connection.
 */
export declare class PostgresQueryRunner implements QueryRunner {
    protected databaseConnection: DatabaseConnection;
    protected driver: PostgresDriver;
    protected logger: Logger;
    /**
     * Indicates if connection for this query runner is released.
     * Once its released, query runner cannot run queries anymore.
     */
    protected isReleased: boolean;
    private schemaName;
    constructor(databaseConnection: DatabaseConnection, driver: PostgresDriver, logger: Logger);
    /**
     * Releases database connection. This is needed when using connection pooling.
     * If connection is not from a pool, it should not be released.
     */
    release(): Promise<void>;
    /**
     * Removes all tables from the currently connected database.
     */
    clearDatabase(): Promise<void>;
    /**
     * Starts transaction.
     */
    beginTransaction(): Promise<void>;
    /**
     * Commits transaction.
     */
    commitTransaction(): Promise<void>;
    /**
     * Rollbacks transaction.
     */
    rollbackTransaction(): Promise<void>;
    /**
     * Checks if transaction is in progress.
     */
    isTransactionActive(): boolean;
    /**
     * Executes a given SQL query.
     */
    query(query: string, parameters?: any[]): Promise<any>;
    /**
     * Insert a new row into given table.
     */
    insert(tableName: string, keyValues: ObjectLiteral, generatedColumn?: ColumnMetadata): Promise<any>;
    /**
     * Updates rows that match given conditions in the given table.
     */
    update(tableName: string, valuesMap: ObjectLiteral, conditions: ObjectLiteral): Promise<void>;
    /**
     * Deletes from the given table by a given conditions.
     */
    delete(tableName: string, condition: string, parameters?: any[]): Promise<void>;
    /**
     * Deletes from the given table by a given conditions.
     */
    delete(tableName: string, conditions: ObjectLiteral): Promise<void>;
    /**
     * Inserts rows into closure table.
     */
    insertIntoClosureTable(tableName: string, newEntityId: any, parentId: any, hasLevel: boolean): Promise<number>;
    /**
     * Loads given table's data from the database.
     */
    loadTableSchema(tableName: string): Promise<TableSchema | undefined>;
    /**
     * Loads all tables (with given names) from the database and creates a TableSchema from them.
     */
    loadTableSchemas(tableNames: string[]): Promise<TableSchema[]>;
    /**
     * Checks if table with the given name exist in the database.
     */
    hasTable(tableName: string): Promise<boolean>;
    /**
     * Creates a new table from the given table metadata and column metadatas.
     */
    createTable(table: TableSchema): Promise<void>;
    /**
     * Checks if column with the given name exist in the given table.
     */
    hasColumn(tableName: string, columnName: string): Promise<boolean>;
    /**
     * Creates a new column from the column schema in the table.
     */
    addColumn(tableName: string, column: ColumnSchema): Promise<void>;
    /**
     * Creates a new column from the column schema in the table.
     */
    addColumn(tableSchema: TableSchema, column: ColumnSchema): Promise<void>;
    /**
     * Creates a new columns from the column schema in the table.
     */
    addColumns(tableName: string, columns: ColumnSchema[]): Promise<void>;
    /**
     * Creates a new columns from the column schema in the table.
     */
    addColumns(tableSchema: TableSchema, columns: ColumnSchema[]): Promise<void>;
    /**
     * Renames column in the given table.
     */
    renameColumn(table: TableSchema, oldColumn: ColumnSchema, newColumn: ColumnSchema): Promise<void>;
    /**
     * Renames column in the given table.
     */
    renameColumn(tableName: string, oldColumnName: string, newColumnName: string): Promise<void>;
    /**
     * Changes a column in the table.
     */
    changeColumn(tableSchema: TableSchema, oldColumn: ColumnSchema, newColumn: ColumnSchema): Promise<void>;
    /**
     * Changes a column in the table.
     */
    changeColumn(tableSchema: string, oldColumn: string, newColumn: ColumnSchema): Promise<void>;
    /**
     * Changes a column in the table.
     */
    changeColumns(tableSchema: TableSchema, changedColumns: {
        newColumn: ColumnSchema;
        oldColumn: ColumnSchema;
    }[]): Promise<void>;
    /**
     * Drops column in the table.
     */
    dropColumn(tableName: string, columnName: string): Promise<void>;
    /**
     * Drops column in the table.
     */
    dropColumn(tableSchema: TableSchema, column: ColumnSchema): Promise<void>;
    /**
     * Drops the columns in the table.
     */
    dropColumns(tableName: string, columnNames: string[]): Promise<void>;
    /**
     * Drops the columns in the table.
     */
    dropColumns(tableSchema: TableSchema, columns: ColumnSchema[]): Promise<void>;
    /**
     * Updates table's primary keys.
     */
    updatePrimaryKeys(dbTable: TableSchema): Promise<void>;
    /**
     * Creates a new foreign key.
     */
    createForeignKey(tableName: string, foreignKey: ForeignKeySchema): Promise<void>;
    /**
     * Creates a new foreign key.
     */
    createForeignKey(tableSchema: TableSchema, foreignKey: ForeignKeySchema): Promise<void>;
    /**
     * Creates a new foreign keys.
     */
    createForeignKeys(tableName: string, foreignKeys: ForeignKeySchema[]): Promise<void>;
    /**
     * Creates a new foreign keys.
     */
    createForeignKeys(tableSchema: TableSchema, foreignKeys: ForeignKeySchema[]): Promise<void>;
    /**
     * Drops a foreign key from the table.
     */
    dropForeignKey(tableName: string, foreignKey: ForeignKeySchema): Promise<void>;
    /**
     * Drops a foreign key from the table.
     */
    dropForeignKey(tableSchema: TableSchema, foreignKey: ForeignKeySchema): Promise<void>;
    /**
     * Drops a foreign keys from the table.
     */
    dropForeignKeys(tableName: string, foreignKeys: ForeignKeySchema[]): Promise<void>;
    /**
     * Drops a foreign keys from the table.
     */
    dropForeignKeys(tableSchema: TableSchema, foreignKeys: ForeignKeySchema[]): Promise<void>;
    /**
     * Creates a new index.
     */
    createIndex(tableName: string, index: IndexSchema): Promise<void>;
    /**
     * Drops an index from the table.
     */
    dropIndex(tableName: string, indexName: string, isGenerated?: boolean): Promise<void>;
    /**
     * Creates a database type from a given column metadata.
     */
    normalizeType(typeOptions: {
        type: ColumnType;
        length?: string | number;
        precision?: number;
        scale?: number;
        timezone?: boolean;
    }): string;
    /**
     * Checks if "DEFAULT" values in the column metadata and in the database schema are equal.
     */
    compareDefaultValues(columnMetadataValue: any, databaseValue: any): boolean;
    /**
     * Truncates table.
     */
    truncate(tableName: string): Promise<void>;
    /**
     * Database name shortcut.
     */
    protected readonly dbName: string;
    /**
     * Parametrizes given object of values. Used to create column=value queries.
     */
    protected parametrize(objectLiteral: ObjectLiteral, startIndex?: number): string[];
    /**
     * Builds a query for create column.
     */
    protected buildCreateColumnSql(column: ColumnSchema, skipPrimary: boolean): string;
}
