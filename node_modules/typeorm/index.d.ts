import { ConnectionManager } from "./connection/ConnectionManager";
import { Connection } from "./connection/Connection";
import { MetadataArgsStorage } from "./metadata-args/MetadataArgsStorage";
import { ConnectionOptions } from "./connection/ConnectionOptions";
import { ObjectType } from "./common/ObjectType";
import { Repository } from "./repository/Repository";
import { EntityManager } from "./entity-manager/EntityManager";
export * from "./container";
export * from "./decorator/columns/Column";
export * from "./decorator/columns/CreateDateColumn";
export * from "./decorator/columns/DiscriminatorColumn";
export * from "./decorator/columns/PrimaryGeneratedColumn";
export * from "./decorator/columns/PrimaryColumn";
export * from "./decorator/columns/UpdateDateColumn";
export * from "./decorator/columns/VersionColumn";
export * from "./decorator/listeners/AfterInsert";
export * from "./decorator/listeners/AfterLoad";
export * from "./decorator/listeners/AfterRemove";
export * from "./decorator/listeners/AfterUpdate";
export * from "./decorator/listeners/BeforeInsert";
export * from "./decorator/listeners/BeforeRemove";
export * from "./decorator/listeners/BeforeUpdate";
export * from "./decorator/listeners/EventSubscriber";
export * from "./decorator/options/ColumnOptions";
export * from "./decorator/options/IndexOptions";
export * from "./decorator/options/JoinColumnOptions";
export * from "./decorator/options/JoinTableOptions";
export * from "./decorator/options/RelationOptions";
export * from "./decorator/options/EntityOptions";
export * from "./decorator/relations/RelationCount";
export * from "./decorator/relations/JoinColumn";
export * from "./decorator/relations/JoinTable";
export * from "./decorator/relations/ManyToMany";
export * from "./decorator/relations/ManyToOne";
export * from "./decorator/relations/OneToMany";
export * from "./decorator/relations/OneToOne";
export * from "./decorator/relations/RelationCount";
export * from "./decorator/relations/RelationId";
export * from "./decorator/entity/Entity";
export * from "./decorator/entity/AbstractEntity";
export * from "./decorator/entity/ClassEntityChild";
export * from "./decorator/entity/ClosureEntity";
export * from "./decorator/entity/EmbeddableEntity";
export * from "./decorator/entity/SingleEntityChild";
export * from "./decorator/entity/Entity";
export * from "./decorator/entity/TableInheritance";
export * from "./decorator/transaction/Transaction";
export * from "./decorator/transaction/TransactionEntityManager";
export * from "./decorator/tree/TreeLevelColumn";
export * from "./decorator/tree/TreeParent";
export * from "./decorator/tree/TreeChildren";
export * from "./decorator/Index";
export * from "./decorator/NamingStrategy";
export * from "./decorator/Embedded";
export * from "./decorator/DiscriminatorValue";
export * from "./decorator/EntityRepository";
export * from "./schema-builder/schema/ColumnSchema";
export * from "./schema-builder/schema/ForeignKeySchema";
export * from "./schema-builder/schema/IndexSchema";
export * from "./schema-builder/schema/PrimaryKeySchema";
export * from "./schema-builder/schema/TableSchema";
export { Connection } from "./connection/Connection";
export { ConnectionManager } from "./connection/ConnectionManager";
export { ConnectionOptions } from "./connection/ConnectionOptions";
export { DriverOptions } from "./driver/DriverOptions";
export { Driver } from "./driver/Driver";
export { QueryBuilder } from "./query-builder/QueryBuilder";
export { QueryRunner } from "./query-runner/QueryRunner";
export { EntityManager } from "./entity-manager/EntityManager";
export { MigrationInterface } from "./migration/MigrationInterface";
export { DefaultNamingStrategy } from "./naming-strategy/DefaultNamingStrategy";
export { NamingStrategyInterface } from "./naming-strategy/NamingStrategyInterface";
export { Repository } from "./repository/Repository";
export { TreeRepository } from "./repository/TreeRepository";
export { SpecificRepository } from "./repository/SpecificRepository";
export { FindOptions } from "./find-options/FindOptions";
export { InsertEvent } from "./subscriber/event/InsertEvent";
export { UpdateEvent } from "./subscriber/event/UpdateEvent";
export { RemoveEvent } from "./subscriber/event/RemoveEvent";
export { EntitySubscriberInterface } from "./subscriber/EntitySubscriberInterface";
export { ObjectLiteral } from "./common/ObjectLiteral";
export { ObjectType } from "./common/ObjectType";
export * from "./decorator/tables/Table";
export * from "./decorator/tables/AbstractTable";
export * from "./decorator/tables/ClassTableChild";
export * from "./decorator/tables/ClosureTable";
export * from "./decorator/tables/EmbeddableTable";
export * from "./decorator/tables/SingleTableChild";
export * from "./decorator/tables/Table";
/**
 * Gets metadata args storage.
 */
export declare function getMetadataArgsStorage(): MetadataArgsStorage;
/**
 * Gets a ConnectionManager which creates connections.
 */
export declare function getConnectionManager(): ConnectionManager;
/**
 * Creates a new connection and registers it in the manager.
 *
 * If connection options were not specified, then it will try to create connection automatically.
 *
 * First, it will try to find a "default" configuration from ormconfig.json.
 * You can also specify a connection name to use from ormconfig.json,
 * and you even can specify a path to your custom ormconfig.json.
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
export declare function createConnection(): Promise<Connection>;
/**
 * Creates connection from the given connection options and registers it in the manager.
 */
export declare function createConnection(options?: ConnectionOptions): Promise<Connection>;
/**
 * Creates connection with the given connection name from the ormconfig.json file and registers it in the manager.
 * Optionally you can specify a path to custom ormconfig.json file.
 */
export declare function createConnection(connectionNameFromConfig: string, ormConfigPath?: string): Promise<Connection>;
/**
 * Creates new connections and registers them in the manager.
 *
 * If array of connection options were not specified, then it will try to create them automatically
 * from ormconfig.json. You can also specify path to your custom ormconfig.json.
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
export declare function createConnections(): Promise<Connection[]>;
/**
 * Creates connections from the given connection options and registers them in the manager.
 */
export declare function createConnections(options?: ConnectionOptions[]): Promise<Connection[]>;
/**
 * Creates connection with the given connection name from the ormconfig.json file and registers it in the manager.
 * Optionally you can specify a path to custom ormconfig.json file.
 */
export declare function createConnections(ormConfigPath?: string): Promise<Connection[]>;
/**
 * Gets connection from the connection manager.
 * If connection name wasn't specified, then "default" connection will be retrieved.
 */
export declare function getConnection(connectionName?: string): Connection;
/**
 * Gets entity manager from the connection.
 * If connection name wasn't specified, then "default" connection will be retrieved.
 */
export declare function getEntityManager(connectionName?: string): EntityManager;
/**
 * Gets repository for the given entity class.
 */
export declare function getRepository<Entity>(entityClass: ObjectType<Entity>, connectionName: string): Repository<Entity>;
/**
 * Gets repository for the given entity name.
 */
export declare function getRepository<Entity>(entityName: string, connectionName: string): Repository<Entity>;
