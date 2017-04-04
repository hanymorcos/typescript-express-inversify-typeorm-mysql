import { Connection } from "../connection/Connection";
import { QueryBuilder } from "../query-builder/QueryBuilder";
import { ObjectLiteral } from "../common/ObjectLiteral";
import { EntityManager } from "../entity-manager/EntityManager";
import { Repository } from "./Repository";
import { TreeRepository } from "./TreeRepository";
import { SpecificRepository } from "./SpecificRepository";
import { ObjectType } from "../common/ObjectType";
/**
 * Provides abstract class for custom repositories that do not inherit from original orm Repository.
 * Contains all most-necessary methods to simplify code in the custom repository.
 * All methods are protected thus not exposed and it allows to create encapsulated custom repository.
 *
 * @experimental
 */
export declare class AbstractRepository<Entity extends ObjectLiteral> {
    /**
     * Connection used by this repository.
     */
    protected connection: Connection;
    /**
     * Gets entity manager that allows to perform repository operations with any entity.
     */
    protected readonly entityManager: EntityManager;
    /**
     * Gets the original ORM repository for the entity that is managed by this repository.
     * If current repository does not manage any entity, then exception will be thrown.
     */
    protected readonly repository: Repository<Entity>;
    /**
     * Gets the original ORM tree repository for the entity that is managed by this repository.
     * If current repository does not manage any entity, then exception will be thrown.
     */
    protected readonly treeRepository: TreeRepository<Entity>;
    /**
     * Gets the original ORM specific repository for the entity that is managed by this repository.
     * If current repository does not manage any entity, then exception will be thrown.
     */
    protected readonly specificRepository: SpecificRepository<Entity>;
    /**
     * Creates a new query builder for the repository's entity that can be used to build a sql query.
     * If current repository does not manage any entity, then exception will be thrown.
     */
    protected createQueryBuilder(alias: string): QueryBuilder<Entity>;
    /**
     * Creates a new query builder for the given entity that can be used to build a sql query.
     */
    protected createQueryBuilderFor<T>(entity: ObjectType<T>, alias: string): QueryBuilder<T>;
    /**
     * Gets the original ORM repository for the given entity class.
     */
    protected getRepositoryFor<T>(entity: ObjectType<T>): Repository<T>;
    /**
     * Gets the original ORM tree repository for the given entity class.
     */
    protected getTreeRepositoryFor<T>(entity: ObjectType<T>): TreeRepository<T>;
    /**
     * Gets the original ORM specific repository for the given entity class.
     */
    protected getSpecificRepositoryFor<T>(entity: ObjectType<T>): SpecificRepository<T>;
}
