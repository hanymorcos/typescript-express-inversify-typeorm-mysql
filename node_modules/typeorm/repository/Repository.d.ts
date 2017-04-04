import { Connection } from "../connection/Connection";
import { EntityMetadata } from "../metadata/EntityMetadata";
import { QueryBuilder } from "../query-builder/QueryBuilder";
import { FindOptions } from "../find-options/FindOptions";
import { ObjectLiteral } from "../common/ObjectLiteral";
import { QueryRunnerProvider } from "../query-runner/QueryRunnerProvider";
/**
 * Repository is supposed to work with your entity objects. Find entities, insert, update, delete, etc.
 */
export declare class Repository<Entity extends ObjectLiteral> {
    /**
     * Connection used by this repository.
     */
    protected connection: Connection;
    /**
     * Entity metadata of the entity current repository manages.
     */
    protected metadata: EntityMetadata;
    /**
     * Query runner provider used for this repository.
     */
    protected queryRunnerProvider?: QueryRunnerProvider;
    /**
     * Returns object that is managed by this repository.
     * If this repository manages entity from schema,
     * then it returns a name of that schema instead.
     */
    readonly target: Function | string;
    /**
     * Checks if entity has an id.
     * If entity contains compose ids, then it checks them all.
     */
    hasId(entity: Entity): boolean;
    /**
     * Creates a new query builder that can be used to build a sql query.
     */
    createQueryBuilder(alias: string, queryRunnerProvider?: QueryRunnerProvider): QueryBuilder<Entity>;
    /**
     * Creates a new entity instance.
     */
    create(): Entity;
    /**
     * Creates a new entities and copies all entity properties from given objects into their new entities.
     * Note that it copies only properties that present in entity schema.
     */
    create(plainObjects: Object[]): Entity[];
    /**
     * Creates a new entity instance and copies all entity properties from this object into a new entity.
     * Note that it copies only properties that present in entity schema.
     */
    create(plainObject: Object): Entity;
    /**
     * Creates a new entity from the given plan javascript object. If entity already exist in the database, then
     * it loads it (and everything related to it), replaces all values with the new ones from the given object
     * and returns this new entity. This new entity is actually a loaded from the db entity with all properties
     * replaced from the new object.
     */
    preload(object: Object): Promise<Entity>;
    /**
     * Merges multiple entities (or entity-like objects) into a one new entity.
     */
    merge(...objects: ObjectLiteral[]): Entity;
    /**
     * Persists (saves) all given entities in the database.
     * If entities do not exist in the database then inserts, otherwise updates.
     */
    persist(entities: Entity[]): Promise<Entity[]>;
    /**
     * Persists (saves) a given entity in the database.
     * If entity does not exist in the database then inserts, otherwise updates.
     */
    persist(entity: Entity): Promise<Entity>;
    /**
     * Removes a given entities from the database.
     */
    remove(entities: Entity[]): Promise<Entity[]>;
    /**
     * Removes a given entity from the database.
     */
    remove(entity: Entity): Promise<Entity>;
    /**
     * Counts all entities.
     */
    count(): Promise<number>;
    /**
     * Counts entities that match given conditions.
     */
    count(conditions: ObjectLiteral): Promise<number>;
    /**
     * Counts entities with given find options.
     */
    count(options: FindOptions): Promise<number>;
    /**
     * Counts entities that match given conditions and find options.
     */
    count(conditions: ObjectLiteral, options: FindOptions): Promise<number>;
    /**
     * Finds all entities.
     */
    find(): Promise<Entity[]>;
    /**
     * Finds entities that match given conditions.
     */
    find(conditions: ObjectLiteral): Promise<Entity[]>;
    /**
     * Finds entities with given find options.
     */
    find(options: FindOptions): Promise<Entity[]>;
    /**
     * Finds entities that match given conditions and find options.
     */
    find(conditions: ObjectLiteral, options: FindOptions): Promise<Entity[]>;
    /**
     * Finds entities that match given conditions.
     * Also counts all entities that match given conditions,
     * but ignores pagination settings (maxResults, firstResult) options.
     */
    findAndCount(): Promise<[Entity[], number]>;
    /**
     * Finds entities that match given conditions.
     * Also counts all entities that match given conditions,
     * but ignores pagination settings (maxResults, firstResult) options.
     */
    findAndCount(conditions: ObjectLiteral): Promise<[Entity[], number]>;
    /**
     * Finds entities that match given conditions.
     * Also counts all entities that match given conditions,
     * but ignores pagination settings (maxResults, firstResult) options.
     */
    findAndCount(options: FindOptions): Promise<[Entity[], number]>;
    /**
     * Finds entities that match given conditions.
     * Also counts all entities that match given conditions,
     * but ignores pagination settings (maxResults, firstResult) options.
     */
    findAndCount(conditions: ObjectLiteral, options: FindOptions): Promise<[Entity[], number]>;
    /**
     * Finds first entity that matches given conditions.
     */
    findOne(): Promise<Entity | undefined>;
    /**
     * Finds first entity that matches given conditions.
     */
    findOne(conditions: ObjectLiteral): Promise<Entity | undefined>;
    /**
     * Finds first entity that matches given find options.
     */
    findOne(options: FindOptions): Promise<Entity | undefined>;
    /**
     * Finds first entity that matches given conditions and find options.
     */
    findOne(conditions: ObjectLiteral, options: FindOptions): Promise<Entity | undefined>;
    /**
     * Finds entities with ids.
     * Optionally find options can be applied.
     */
    findByIds(ids: any[], options?: FindOptions): Promise<Entity[]>;
    /**
     * Finds entity with given id.
     * Optionally find options can be applied.
     */
    findOneById(id: any, options?: FindOptions): Promise<Entity | undefined>;
    /**
     * Executes a raw SQL query and returns a raw database results.
     */
    query(query: string, parameters?: any[]): Promise<any>;
    /**
     * Wraps given function execution (and all operations made there) in a transaction.
     * All database operations must be executed using provided repository.
     */
    transaction(runInTransaction: (repository: Repository<Entity>) => Promise<any> | any): Promise<any>;
    /**
     * Clears all the data from the given table (truncates/drops it).
     */
    clear(): Promise<void>;
    /**
     * Creates a query builder from the given conditions or find options.
     * Used to create a query builder for find* methods.
     */
    protected createFindQueryBuilder(conditionsOrFindOptions?: ObjectLiteral | FindOptions, options?: FindOptions): QueryBuilder<Entity>;
}
