import { Connection } from "./Connection";
import { ConnectionOptions } from "./ConnectionOptions";
import { DriverOptions } from "../driver/DriverOptions";
import { Driver } from "../driver/Driver";
import { Logger } from "../logger/Logger";
/**
 * ConnectionManager is used to store and manage all these different connections.
 * It also provides useful factory methods to simplify connection creation.
 */
export declare class ConnectionManager {
    /**
     * List of connections registered in this connection manager.
     */
    protected connections: Connection[];
    /**
     * Checks if connection with the given name exist in the manager.
     */
    has(name: string): boolean;
    /**
     * Gets registered connection with the given name.
     * If connection name is not given then it will get a default connection.
     * Throws exception if connection with the given name was not found.
     */
    get(name?: string): Connection;
    /**
     * Creates a new connection based on the given connection options and registers it in the manager.
     * You need to manually call #connect method to establish connection.
     * Note that dropSchemaOnConnection and autoSchemaSync options of a ConnectionOptions will not work there - use
     * createAndConnect method to use them.
     */
    create(options: ConnectionOptions): Connection;
    /**
     * Creates a new connection and registers it in the manager.
     *
     * If connection options were not specified, then it will try to create connection automatically.
     *
     * First, it will try to find a "default" configuration from ormconfig.json.
     * You can also specify a connection name to use from ormconfig.json,
     * and you even can specify a path to custom ormconfig.json file.
     *
     * In the case if options were not specified, and ormconfig.json file also wasn't found,
     * it will try to create connection from environment variables.
     * There are several environment variables you can set:
     *
     * - TYPEORM_DRIVER_TYPE - driver type. Can be "mysql", "postgres", "mariadb", "sqlite", "oracle" or "mssql".
     * - TYPEORM_URL - database connection url. Should be a string.
     * - TYPEORM_HOST - database host. Should be a string.
     * - TYPEORM_PORT - database access port. Should be a number.
     * - TYPEORM_USERNAME - database username. Should be a string.
     * - TYPEORM_PASSWORD - database user's password. Should be a string.
     * - TYPEORM_SID - database's SID. Used only for oracle databases. Should be a string.
     * - TYPEORM_STORAGE - database's storage url. Used only for sqlite databases. Should be a string.
     * - TYPEORM_USE_POOL - indicates if connection pooling should be enabled. By default its enabled. Should be boolean-like value.
     * - TYPEORM_DRIVER_EXTRA - extra options to be passed to the driver. Should be a serialized json string of options.
     * - TYPEORM_AUTO_SCHEMA_SYNC - indicates if automatic schema synchronization will be performed on each application run. Should be boolean-like value.
     * - TYPEORM_ENTITIES - list of directories containing entities to load. Should be string - directory names (can be patterns) split by a comma.
     * - TYPEORM_SUBSCRIBERS - list of directories containing subscribers to load. Should be string - directory names (can be patterns) split by a comma.
     * - TYPEORM_ENTITY_SCHEMAS - list of directories containing entity schemas to load. Should be string - directory names (can be patterns) split by a comma.
     * - TYPEORM_NAMING_STRATEGIES - list of directories containing custom naming strategies to load. Should be string - directory names (can be patterns) split by a comma.
     * - TYPEORM_LOGGING_QUERIES - indicates if each executed query must be logged. Should be boolean-like value.
     * - TYPEORM_LOGGING_FAILED_QUERIES - indicates if logger should log failed query's error. Should be boolean-like value.
     * - TYPEORM_LOGGING_ONLY_FAILED_QUERIES - indicates if only failed queries must be logged. Should be boolean-like value.
     *
     * TYPEORM_DRIVER_TYPE variable is required. Depend on the driver type some other variables may be required too.
     */
    createAndConnect(): Promise<Connection>;
    /**
     * Creates connection from the given connection options and registers it in the manager.
     */
    createAndConnect(options: ConnectionOptions): Promise<Connection>;
    /**
     * Creates connection with the given connection name from the ormconfig.json file and registers it in the manager.
     * Optionally you can specify a path to custom ormconfig.json file.
     */
    createAndConnect(connectionNameFromConfig: string, ormConfigPath?: string): Promise<Connection>;
    /**
     * Creates new connections and registers them in the manager.
     *
     * If array of connection options were not specified, then it will try to create them automatically
     * from ormconfig.json. You can also specify path to your custom ormconfig.json file.
     *
     * In the case if options were not specified, and ormconfig.json file also wasn't found,
     * it will try to create connection from environment variables.
     * There are several environment variables you can set:
     *
     * - TYPEORM_DRIVER_TYPE - driver type. Can be "mysql", "postgres", "mariadb", "sqlite", "oracle" or "mssql".
     * - TYPEORM_URL - database connection url. Should be a string.
     * - TYPEORM_HOST - database host. Should be a string.
     * - TYPEORM_PORT - database access port. Should be a number.
     * - TYPEORM_USERNAME - database username. Should be a string.
     * - TYPEORM_PASSWORD - database user's password. Should be a string.
     * - TYPEORM_SID - database's SID. Used only for oracle databases. Should be a string.
     * - TYPEORM_STORAGE - database's storage url. Used only for sqlite databases. Should be a string.
     * - TYPEORM_USE_POOL - indicates if connection pooling should be enabled. By default its enabled. Should be boolean-like value.
     * - TYPEORM_DRIVER_EXTRA - extra options to be passed to the driver. Should be a serialized json string of options.
     * - TYPEORM_AUTO_SCHEMA_SYNC - indicates if automatic schema synchronization will be performed on each application run. Should be boolean-like value.
     * - TYPEORM_ENTITIES - list of directories containing entities to load. Should be string - directory names (can be patterns) split by a comma.
     * - TYPEORM_SUBSCRIBERS - list of directories containing subscribers to load. Should be string - directory names (can be patterns) split by a comma.
     * - TYPEORM_ENTITY_SCHEMAS - list of directories containing entity schemas to load. Should be string - directory names (can be patterns) split by a comma.
     * - TYPEORM_NAMING_STRATEGIES - list of directories containing custom naming strategies to load. Should be string - directory names (can be patterns) split by a comma.
     * - TYPEORM_LOGGING_QUERIES - indicates if each executed query must be logged. Should be boolean-like value.
     * - TYPEORM_LOGGING_FAILED_QUERIES - indicates if logger should log failed query's error. Should be boolean-like value.
     * - TYPEORM_LOGGING_ONLY_FAILED_QUERIES - indicates if only failed queries must be logged. Should be boolean-like value.
     *
     * TYPEORM_DRIVER_TYPE variable is required. Depend on the driver type some other variables may be required too.
     */
    createAndConnectToAll(): Promise<Connection[]>;
    /**
     * Creates connections from the given connection options and registers them in the manager.
     */
    createAndConnectToAll(options?: ConnectionOptions[]): Promise<Connection[]>;
    /**
     * Creates connections from the ormconfig.json file.
     * Optionally you can specify a path to custom ormconfig.json file.
     */
    createAndConnectToAll(ormConfigPath?: string): Promise<Connection[]>;
    /**
     * Checks if ormconfig.json exists.
     */
    protected hasOrmConfigurationFile(): boolean;
    /**
     * Checks if there is a default connection in the ormconfig.json file.
     */
    protected hasDefaultConfigurationInConfigurationFile(): boolean;
    /**
     * Checks if environment variables contains connection options.
     */
    protected hasDefaultConfigurationInEnvironmentVariables(): boolean;
    /**
     * Allows to quickly create a connection based on the environment variable values.
     */
    protected createFromEnvAndConnect(): Promise<Connection>;
    /**
     * Creates a new connection based on the connection options from "ormconfig.json"
     * and registers a new connection in the manager.
     * Optionally you can specify a path to the json configuration.
     * If path is not given, then ormconfig.json file will be searched near node_modules directory.
     */
    protected createFromConfigAndConnectToAll(path?: string): Promise<Connection[]>;
    /**
     * Creates a new connection based on the connection options from "ormconfig.json"
     * and registers a new connection in the manager.
     * Optionally you can specify a path to the json configuration.
     * If path is not given, then ormconfig.json file will be searched near node_modules directory.
     */
    protected createFromConfigAndConnect(connectionName: string, path?: string): Promise<Connection>;
    /**
     * Creates a new connection based on the given connection options and registers a new connection in the manager.
     */
    protected createAndConnectByConnectionOptions(options: ConnectionOptions): Promise<Connection>;
    /**
     * Splits given array of mixed strings and / or functions into two separate array of string and array of functions.
     */
    protected splitStringsAndClasses<T>(strAndClses: string[] | T[]): [string[], T[]];
    /**
     * Creates a new driver based on the given driver type and options.
     */
    protected createDriver(options: DriverOptions, logger: Logger): Driver;
    /**
     * Creates a new connection and registers it in the connection manager.
     */
    protected createConnection(name: string, driver: Driver, logger: Logger): Connection;
}
