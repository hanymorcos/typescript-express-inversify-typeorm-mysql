import { Connection } from "../connection/Connection";
import { FindOptions } from "../find-options/FindOptions";
import { ObjectType } from "../common/ObjectType";
import { BaseEntityManager } from "./BaseEntityManager";
import { QueryRunnerProvider } from "../query-runner/QueryRunnerProvider";
import { ObjectLiteral } from "../common/ObjectLiteral";
/**
 * Entity manager supposed to work with any entity, automatically find its repository and call its methods,
 * whatever entity type are you passing.
 */
export declare class EntityManager extends BaseEntityManager {
    constructor(connection: Connection, queryRunnerProvider?: QueryRunnerProvider);
    /**
     * Persists (saves) all given entities in the database.
     * If entities do not exist in the database then inserts, otherwise updates.
     */
    persist<Entity>(entity: Entity): Promise<Entity>;
    /**
     * Persists (saves) all given entities in the database.
     * If entities do not exist in the database then inserts, otherwise updates.
     */
    persist<Entity>(targetOrEntity: Function, entity: Entity): Promise<Entity>;
    /**
     * Persists (saves) all given entities in the database.
     * If entities do not exist in the database then inserts, otherwise updates.
     */
    persist<Entity>(targetOrEntity: string, entity: Entity): Promise<Entity>;
    /**
     * Persists (saves) all given entities in the database.
     * If entities do not exist in the database then inserts, otherwise updates.
     */
    persist<Entity>(entities: Entity[]): Promise<Entity[]>;
    /**
     * Persists (saves) all given entities in the database.
     * If entities do not exist in the database then inserts, otherwise updates.
     */
    persist<Entity>(targetOrEntity: Function, entities: Entity[]): Promise<Entity[]>;
    /**
     * Persists (saves) all given entities in the database.
     * If entities do not exist in the database then inserts, otherwise updates.
     */
    persist<Entity>(targetOrEntity: string, entities: Entity[]): Promise<Entity[]>;
    /**
     * Removes a given entity from the database.
     */
    remove<Entity>(entity: Entity): Promise<Entity>;
    /**
     * Removes a given entity from the database.
     */
    remove<Entity>(targetOrEntity: Function, entity: Entity): Promise<Entity>;
    /**
     * Removes a given entity from the database.
     */
    remove<Entity>(targetOrEntity: string, entity: Entity): Promise<Entity>;
    /**
     * Removes a given entity from the database.
     */
    remove<Entity>(entity: Entity[]): Promise<Entity>;
    /**
     * Removes a given entity from the database.
     */
    remove<Entity>(targetOrEntity: Function, entity: Entity[]): Promise<Entity[]>;
    /**
     * Removes a given entity from the database.
     */
    remove<Entity>(targetOrEntity: string, entity: Entity[]): Promise<Entity[]>;
    /**
     * Counts entities that match given conditions.
     */
    count<Entity>(entityClass: ObjectType<Entity>): Promise<number>;
    /**
     * Counts entities that match given conditions.
     */
    count<Entity>(entityClass: ObjectType<Entity>, conditions: ObjectLiteral): Promise<number>;
    /**
     * Counts entities that match given conditions.
     */
    count<Entity>(entityClass: ObjectType<Entity>, options: FindOptions): Promise<number>;
    /**
     * Counts entities that match given conditions.
     */
    count<Entity>(entityClass: ObjectType<Entity>, conditions: ObjectLiteral, options: FindOptions): Promise<number>;
    /**
     * Finds entities that match given conditions.
     */
    find<Entity>(entityClass: ObjectType<Entity>): Promise<Entity[]>;
    /**
     * Finds entities that match given conditions.
     */
    find<Entity>(entityClass: ObjectType<Entity>, conditions: ObjectLiteral): Promise<Entity[]>;
    /**
     * Finds entities that match given conditions.
     */
    find<Entity>(entityClass: ObjectType<Entity>, options: FindOptions): Promise<Entity[]>;
    /**
     * Finds entities that match given conditions.
     */
    find<Entity>(entityClass: ObjectType<Entity>, conditions: ObjectLiteral, options: FindOptions): Promise<Entity[]>;
    /**
     * Finds entities that match given conditions.
     * Also counts all entities that match given conditions,
     * but ignores pagination settings (maxResults, firstResult) options.
     */
    findAndCount<Entity>(entityClass: ObjectType<Entity>): Promise<[Entity[], number]>;
    /**
     * Finds entities that match given conditions.
     * Also counts all entities that match given conditions,
     * but ignores pagination settings (maxResults, firstResult) options.
     */
    findAndCount<Entity>(entityClass: ObjectType<Entity>, conditions: ObjectLiteral): Promise<[Entity[], number]>;
    /**
     * Finds entities that match given conditions.
     * Also counts all entities that match given conditions,
     * but ignores pagination settings (maxResults, firstResult) options.
     */
    findAndCount<Entity>(entityClass: ObjectType<Entity>, options: FindOptions): Promise<[Entity[], number]>;
    /**
     * Finds entities that match given conditions.
     * Also counts all entities that match given conditions,
     * but ignores pagination settings (maxResults, firstResult) options.
     */
    findAndCount<Entity>(entityClass: ObjectType<Entity>, conditions: ObjectLiteral, options: FindOptions): Promise<[Entity[], number]>;
    /**
     * Finds first entity that matches given conditions.
     */
    findOne<Entity>(entityClass: ObjectType<Entity>): Promise<Entity | undefined>;
    /**
     * Finds first entity that matches given conditions.
     */
    findOne<Entity>(entityClass: ObjectType<Entity>, conditions: ObjectLiteral): Promise<Entity | undefined>;
    /**
     * Finds first entity that matches given conditions.
     */
    findOne<Entity>(entityClass: ObjectType<Entity>, options: FindOptions): Promise<Entity | undefined>;
    /**
     * Finds first entity that matches given conditions.
     */
    findOne<Entity>(entityClass: ObjectType<Entity>, conditions: ObjectLiteral, options: FindOptions): Promise<Entity | undefined>;
    /**
     * Finds entities with ids.
     * Optionally find options can be applied.
     */
    findByIds<Entity>(entityClass: ObjectType<Entity>, ids: any[], options?: FindOptions): Promise<Entity[]>;
    /**
     * Finds entity with given id.
     */
    findOneById<Entity>(entityClass: ObjectType<Entity>, id: any, options?: FindOptions): Promise<Entity | undefined>;
    /**
     * Executes raw SQL query and returns raw database results.
     */
    query(query: string, parameters?: any[]): Promise<any>;
    /**
     * Wraps given function execution (and all operations made there) in a transaction.
     * All database operations must be executed using provided entity manager.
     */
    transaction(runInTransaction: (entityManger: EntityManager) => Promise<any>): Promise<any>;
    /**
     * Clears all the data from the given table (truncates/drops it).
     */
    clear<Entity>(entityClass: ObjectType<Entity>): Promise<void>;
}
