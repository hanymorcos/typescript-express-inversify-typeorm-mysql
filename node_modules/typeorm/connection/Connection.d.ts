import { Driver } from "../driver/Driver";
import { Repository } from "../repository/Repository";
import { ObjectType } from "../common/ObjectType";
import { EntityManager } from "../entity-manager/EntityManager";
import { TreeRepository } from "../repository/TreeRepository";
import { NamingStrategyInterface } from "../naming-strategy/NamingStrategyInterface";
import { EntitySchema } from "../entity-schema/EntitySchema";
import { Broadcaster } from "../subscriber/Broadcaster";
import { LazyRelationsWrapper } from "../lazy-loading/LazyRelationsWrapper";
import { SpecificRepository } from "../repository/SpecificRepository";
import { RepositoryAggregator } from "../repository/RepositoryAggregator";
import { EntityMetadata } from "../metadata/EntityMetadata";
import { SchemaBuilder } from "../schema-builder/SchemaBuilder";
import { Logger } from "../logger/Logger";
import { QueryRunnerProvider } from "../query-runner/QueryRunnerProvider";
import { MigrationInterface } from "../migration/MigrationInterface";
/**
 * Connection is a single database connection to a specific database of a database management system.
 * You can have multiple connections to multiple databases in your application.
 */
export declare class Connection {
    /**
     * Connection name.
     */
    readonly name: string;
    /**
     * Database driver used by this connection.
     */
    readonly driver: Driver;
    /**
     * Logger used to log orm events.
     */
    readonly logger: Logger;
    /**
     * All entity metadatas that are registered for this connection.
     */
    readonly entityMetadatas: EntityMetadata[];
    /**
     * Used to broadcast connection events.
     */
    readonly broadcaster: Broadcaster;
    /**
     * Gets EntityManager of this connection.
     */
    private readonly _entityManager;
    /**
     * Stores all registered repositories.
     */
    private readonly repositoryAggregators;
    /**
     * Stores all entity repository instances.
     */
    private readonly entityRepositories;
    /**
     * Entity listeners that are registered for this connection.
     */
    private readonly entityListeners;
    /**
     * Entity subscribers that are registered for this connection.
     */
    private readonly entitySubscribers;
    /**
     * Registered entity classes to be used for this connection.
     */
    private readonly entityClasses;
    /**
     * Registered entity schemas to be used for this connection.
     */
    private readonly entitySchemas;
    /**
     * Registered subscriber classes to be used for this connection.
     */
    private readonly subscriberClasses;
    /**
     * Registered naming strategy classes to be used for this connection.
     */
    private readonly namingStrategyClasses;
    /**
     * Registered migration classes to be used for this connection.
     */
    private readonly migrationClasses;
    /**
     * Naming strategy to be used in this connection.
     */
    private usedNamingStrategy;
    /**
     * Indicates if connection has been done or not.
     */
    private _isConnected;
    constructor(name: string, driver: Driver, logger: Logger);
    /**
     * Indicates if connection to the database already established for this connection.
     */
    readonly isConnected: boolean;
    /**
     * Gets entity manager that allows to perform repository operations with any entity in this connection.
     */
    readonly entityManager: EntityManager;
    /**
     * Performs connection to the database.
     */
    connect(): Promise<this>;
    /**
     * Closes connection with the database.
     * Once connection is closed, you cannot use repositories and perform any operations except
     * opening connection again.
     */
    close(): Promise<void>;
    /**
     * Drops the database and all its data.
     */
    dropDatabase(): Promise<void>;
    /**
     * Creates database schema for all entities registered in this connection.
     *
     * @param dropBeforeSync If set to true then it drops the database with all its tables and data
     */
    syncSchema(dropBeforeSync?: boolean): Promise<void>;
    /**
     * Runs all pending migrations.
     */
    runMigrations(): Promise<void>;
    /**
     * Reverts last executed migration.
     */
    undoLastMigration(): Promise<void>;
    /**
     * Imports entities from the given paths (directories) and registers them in the current connection.
     */
    importEntitiesFromDirectories(paths: string[]): this;
    /**
     * Imports entity schemas from the given paths (directories) and registers them in the current connection.
     */
    importEntitySchemaFromDirectories(paths: string[]): this;
    /**
     * Imports subscribers from the given paths (directories) and registers them in the current connection.
     */
    importSubscribersFromDirectories(paths: string[]): this;
    /**
     * Imports naming strategies from the given paths (directories) and registers them in the current connection.
     */
    importNamingStrategiesFromDirectories(paths: string[]): this;
    /**
     * Imports migrations from the given paths (directories) and registers them in the current connection.
     */
    importMigrationsFromDirectories(paths: string[]): this;
    /**
     * Imports entities and registers them in the current connection.
     */
    importEntities(entities: Function[]): this;
    /**
     * Imports schemas and registers them in the current connection.
     */
    importEntitySchemas(schemas: EntitySchema[]): this;
    /**
     * Imports subscribers and registers them in the current connection.
     */
    importSubscribers(subscriberClasses: Function[]): this;
    /**
     * Imports naming strategies and registers them in the current connection.
     */
    importNamingStrategies(strategies: Function[]): this;
    /**
     * Imports migrations and registers them in the current connection.
     */
    importMigrations(migrations: Function[]): this;
    /**
     * Sets given naming strategy to be used.
     * Naming strategy must be set to be used before connection is established.
     */
    useNamingStrategy(name: string): this;
    /**
     * Sets given naming strategy to be used.
     * Naming strategy must be set to be used before connection is established.
     */
    useNamingStrategy(strategy: Function): this;
    /**
     * Gets the entity metadata of the given entity class.
     */
    getMetadata(target: Function): EntityMetadata;
    /**
     * Gets the entity metadata of the given entity name.
     */
    getMetadata(target: string): EntityMetadata;
    /**
     * Gets the entity metadata of the given entity class or schema name.
     */
    getMetadata(target: Function | string): EntityMetadata;
    /**
     * Gets repository for the given entity class.
     */
    getRepository<Entity>(entityClass: ObjectType<Entity>): Repository<Entity>;
    /**
     * Gets repository for the given entity name.
     */
    getRepository<Entity>(entityName: string): Repository<Entity>;
    /**
     * Gets repository for the given entity name.
     */
    getRepository<Entity>(entityClassOrName: ObjectType<Entity> | string): Repository<Entity>;
    /**
     * Gets tree repository for the given entity class.
     * Only tree-type entities can have a TreeRepository,
     * like ones decorated with @ClosureEntity decorator.
     */
    getTreeRepository<Entity>(entityClass: ObjectType<Entity>): TreeRepository<Entity>;
    /**
     * Gets tree repository for the given entity class.
     * Only tree-type entities can have a TreeRepository,
     * like ones decorated with @ClosureEntity decorator.
     */
    getTreeRepository<Entity>(entityClassOrName: ObjectType<Entity> | string): TreeRepository<Entity>;
    /**
     * Gets tree repository for the given entity class.
     * Only tree-type entities can have a TreeRepository,
     * like ones decorated with @ClosureEntity decorator.
     */
    getTreeRepository<Entity>(entityName: string): TreeRepository<Entity>;
    /**
     * Gets specific repository for the given entity class.
     * SpecificRepository is a special repository that contains specific and non standard repository methods.
     */
    getSpecificRepository<Entity>(entityClass: ObjectType<Entity>): SpecificRepository<Entity>;
    /**
     * Gets specific repository for the given entity name.
     * SpecificRepository is a special repository that contains specific and non standard repository methods.
     */
    getSpecificRepository<Entity>(entityName: string): SpecificRepository<Entity>;
    /**
     * Gets specific repository for the given entity class or name.
     * SpecificRepository is a special repository that contains specific and non standard repository methods.
     */
    getSpecificRepository<Entity>(entityClassOrName: ObjectType<Entity> | string): SpecificRepository<Entity>;
    /**
     * Creates a new entity manager with a single opened connection to the database.
     * This may be useful if you want to perform all db queries within one connection.
     * After finishing with entity manager, don't forget to release it, to release connection back to pool.
     */
    createEntityManagerWithSingleDatabaseConnection(queryRunnerProvider?: QueryRunnerProvider): EntityManager;
    /**
     * Gets migration instances that are registered for this connection.
     */
    getMigrations(): MigrationInterface[];
    /**
     * Gets custom entity repository marked with @EntityRepository decorator.
     */
    getCustomRepository<T>(customRepository: ObjectType<T>): T;
    /**
     * Gets custom repository's managed entity.
     * If given custom repository does not manage any entity then undefined will be returned.
     */
    getCustomRepositoryTarget<T>(customRepository: any): Function | string | undefined;
    /**
     * Finds repository aggregator of the given entity class or name.
     */
    protected findRepositoryAggregator(entityClassOrName: ObjectType<any> | string): RepositoryAggregator;
    /**
     * Builds all registered metadatas.
     */
    protected buildMetadatas(): void;
    /**
     * Creates a naming strategy to be used for this connection.
     */
    protected createNamingStrategy(): NamingStrategyInterface;
    /**
     * Creates a new default entity manager without single connection setup.
     */
    protected createEntityManager(): EntityManager;
    /**
     * Creates a new entity broadcaster using in this connection.
     */
    protected createBroadcaster(): Broadcaster;
    /**
     * Creates a schema builder used to build a database schema for the entities of the current connection.
     */
    protected createSchemaBuilder(): SchemaBuilder;
    /**
     * Creates a lazy relations wrapper.
     */
    protected createLazyRelationsWrapper(): LazyRelationsWrapper;
}
