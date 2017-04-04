import { Driver } from "../Driver";
import { DriverOptions } from "../DriverOptions";
import { DatabaseConnection } from "../DatabaseConnection";
import { Logger } from "../../logger/Logger";
import { QueryRunner } from "../../query-runner/QueryRunner";
import { ObjectLiteral } from "../../common/ObjectLiteral";
import { ColumnMetadata } from "../../metadata/ColumnMetadata";
import { NamingStrategyInterface } from "../../naming-strategy/NamingStrategyInterface";
/**
 * Organizes communication with Oracle DBMS.
 *
 * todo: this driver is not 100% finished yet, need to fix all issues that are left
 */
export declare class OracleDriver implements Driver {
    /**
     * Naming strategy used in the connection where this driver is used.
     */
    namingStrategy: NamingStrategyInterface;
    /**
     * Driver connection options.
     */
    readonly options: DriverOptions;
    /**
     * Oracle library.
     */
    oracle: any;
    /**
     * Connection to oracle database.
     */
    protected databaseConnection: DatabaseConnection | undefined;
    /**
     * Oracle pool.
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
    constructor(options: DriverOptions, logger: Logger, oracle?: any);
    /**
     * Performs connection to the database.
     * Based on pooling options, it can either create connection immediately,
     * either create a pool and create connection when needed.
     */
    connect(): Promise<void>;
    /**
     * Closes connection with the database.
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
     * Prepares given value to a value to be persisted, based on its column type and metadata.
     */
    preparePersistentValue(value: any, columnMetadata: ColumnMetadata): any;
    /**
     * Prepares given value to a value to be persisted, based on its column type or metadata.
     */
    prepareHydratedValue(value: any, columnMetadata: ColumnMetadata): any;
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
