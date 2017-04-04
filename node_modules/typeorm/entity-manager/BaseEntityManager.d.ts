import { Connection } from "../connection/Connection";
import { QueryBuilder } from "../query-builder/QueryBuilder";
import { Repository } from "../repository/Repository";
import { ObjectType } from "../common/ObjectType";
import { TreeRepository } from "../repository/TreeRepository";
import { ObjectLiteral } from "../common/ObjectLiteral";
import { QueryRunnerProvider } from "../query-runner/QueryRunnerProvider";
import { RepositoryAggregator } from "../repository/RepositoryAggregator";
import { SpecificRepository } from "../repository/SpecificRepository";
/**
 * Common functions shared between different entity manager types.
 */
export declare abstract class BaseEntityManager {
    protected connection: Connection;
    protected queryRunnerProvider: QueryRunnerProvider;
    /**
     * Stores all registered repositories.
     * Used when custom queryRunnerProvider is provided.
     */
    private readonly repositoryAggregators;
    /**
     * @param connection Connection to be used in this entity manager
     * @param queryRunnerProvider Custom query runner to be used for operations in this entity manager
     */
    constructor(connection: Connection, queryRunnerProvider?: QueryRunnerProvider);
    /**
     * Gets repository for the given entity class.
     * If single database connection mode is used, then repository is obtained from the
     * repository aggregator, where each repository is individually created for this entity manager.
     * When single database connection is not used, repository is being obtained from the connection.
     */
    getRepository<Entity>(entityClass: ObjectType<Entity>): Repository<Entity>;
    /**
     * Gets repository for the given entity name.
     * If single database connection mode is used, then repository is obtained from the
     * repository aggregator, where each repository is individually created for this entity manager.
     * When single database connection is not used, repository is being obtained from the connection.
     */
    getRepository<Entity>(entityName: string): Repository<Entity>;
    /**
     * Gets tree repository for the given entity class.
     * If single database connection mode is used, then repository is obtained from the
     * repository aggregator, where each repository is individually created for this entity manager.
     * When single database connection is not used, repository is being obtained from the connection.
     */
    getTreeRepository<Entity>(entityClass: ObjectType<Entity>): TreeRepository<Entity>;
    /**
     * Gets tree repository for the given entity name.
     * If single database connection mode is used, then repository is obtained from the
     * repository aggregator, where each repository is individually created for this entity manager.
     * When single database connection is not used, repository is being obtained from the connection.
     */
    getTreeRepository<Entity>(entityName: string): TreeRepository<Entity>;
    /**
     * Gets specific repository for the given entity class.
     * If single database connection mode is used, then repository is obtained from the
     * repository aggregator, where each repository is individually created for this entity manager.
     * When single database connection is not used, repository is being obtained from the connection.
     */
    getSpecificRepository<Entity>(entityClass: ObjectType<Entity>): SpecificRepository<Entity>;
    /**
     * Gets specific repository for the given entity name.
     * If single database connection mode is used, then repository is obtained from the
     * repository aggregator, where each repository is individually created for this entity manager.
     * When single database connection is not used, repository is being obtained from the connection.
     */
    getSpecificRepository<Entity>(entityName: string): SpecificRepository<Entity>;
    /**
     * Gets custom entity repository marked with @EntityRepository decorator.
     */
    getCustomRepository<T>(customRepository: ObjectType<T>): T;
    /**
     * Checks if entity has an id.
     */
    hasId(entity: Object): boolean;
    /**
     * Checks if entity of given schema name has an id.
     */
    hasId(target: string, entity: Object): boolean;
    /**
     * Creates a new query builder that can be used to build an sql query.
     */
    createQueryBuilder<Entity>(entityClass: ObjectType<Entity> | Function | string, alias: string): QueryBuilder<Entity>;
    /**
     * Creates a new entity instance.
     */
    create<Entity>(entityClass: ObjectType<Entity>): Entity;
    /**
     * Creates a new entity instance and copies all entity properties from this object into a new entity.
     * Note that it copies only properties that present in entity schema.
     */
    create<Entity>(entityClass: ObjectType<Entity>, plainObject: Object): Entity;
    /**
     * Creates a new entities and copies all entity properties from given objects into their new entities.
     * Note that it copies only properties that present in entity schema.
     */
    create<Entity>(entityClass: ObjectType<Entity>, plainObjects: Object[]): Entity[];
    /**
     * Creates a new entity from the given plan javascript object. If entity already exist in the database, then
     * it loads it (and everything related to it), replaces all values with the new ones from the given object
     * and returns this new entity. This new entity is actually a loaded from the db entity with all properties
     * replaced from the new object.
     */
    preload<Entity>(entityClass: ObjectType<Entity>, object: Object): Promise<Entity>;
    /**
     * Merges two entities into one new entity.
     */
    merge<Entity>(entityClass: ObjectType<Entity>, ...objects: ObjectLiteral[]): Entity;
    /**
     * Releases all resources used by entity manager.
     * This is used when entity manager is created with a single query runner,
     * and this single query runner needs to be released after job with entity manager is done.
     */
    release(): Promise<void>;
    /**
     * Gets, or if does not exist yet, creates and returns a repository aggregator for a particular entity target.
     */
    protected obtainRepositoryAggregator<Entity>(entityClassOrName: ObjectType<Entity> | string): RepositoryAggregator;
}
