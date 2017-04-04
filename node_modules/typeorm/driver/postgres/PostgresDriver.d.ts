import { Driver } from "../Driver";
import { DriverOptions } from "../DriverOptions";
import { ObjectLiteral } from "../../common/ObjectLiteral";
import { DatabaseConnection } from "../DatabaseConnection";
import { ColumnMetadata } from "../../metadata/ColumnMetadata";
import { Logger } from "../../logger/Logger";
import { QueryRunner } from "../../query-runner/QueryRunner";
import { NamingStrategyInterface } from "../../naming-strategy/NamingStrategyInterface";
/**
 * Organizes communication with PostgreSQL DBMS.
 */
export declare class PostgresDriver implements Driver {
    /**
     * Naming strategy used in the connection where this driver is used.
     */
    namingStrategy: NamingStrategyInterface;
    /**
     * Driver connection options.
     */
    readonly options: DriverOptions;
    /**
     * Postgres library.
     */
    protected postgres: any;
    /**
     * Connection to postgres database.
     */
    protected databaseConnection: DatabaseConnection | undefined;
    /**
     * Postgres pool.
     */
    protected pool: any;
    /**
     * Pool of database connections.
     */
    protected databaseConnectionPool: DatabaseConnection[];
    /**
     * Logger used go log queries and errors.
     */
    protected logger: Logger;
    /**
     * Schema name. (Only used in Postgres)
     * default: "public"
     */
    schemaName?: string;
    constructor(connectionOptions: DriverOptions, logger: Logger, postgres?: any);
    /**
     * Performs connection to the database.
     * Based on pooling options, it can either create connection immediately,
     * either create a pool and create connection when needed.
     */
    connect(): Promise<void>;
    /**
     * Closes connection with database.
     */
    disconnect(): Promise<void>;
    /**
     * Creates a query runner used for common queries.
     */
    createQueryRunner(): Promise<QueryRunner>;
    /**
     * Access to the native implementation of the database.
     */
    nativeInterface(): {
        driver: any;
        connection: any;
        pool: any;
    };
    /**
     * Prepares given value to a value to be persisted, based on its column type and metadata.
     */
    preparePersistentValue(value: any, column: ColumnMetadata): any;
    /**
     * Prepares given value to a value to be persisted, based on its column type or metadata.
     */
    prepareHydratedValue(value: any, columnMetadata: ColumnMetadata): any;
    /**
     * Replaces parameters in the given sql with special escaping character
     * and an array of parameter names to be passed to a query.
     */
    escapeQueryWithParameters(sql: string, parameters: ObjectLiteral): [string, any[]];
    /**
     * Escapes a column name.
     */
    escapeColumnName(columnName: string): string;
    /**
     * Escapes an alias.
     */
    escapeAliasName(aliasName: string): string;
    /**
     * Escapes a table name.
     */
    escapeTableName(tableName: string): string;
    /**
     * Retrieves a new database connection.
     * If pooling is enabled then connection from the pool will be retrieved.
     * Otherwise active connection will be returned.
     */
    protected retrieveDatabaseConnection(): Promise<DatabaseConnection>;
    /**
     * If driver dependency is not given explicitly, then try to load it via "require".
     */
    protected loadDependencies(): void;
}
