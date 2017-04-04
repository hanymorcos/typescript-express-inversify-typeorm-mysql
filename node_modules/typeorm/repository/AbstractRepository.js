"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CustomRepositoryDoesNotHaveEntityError_1 = require("./error/CustomRepositoryDoesNotHaveEntityError");
/**
 * Provides abstract class for custom repositories that do not inherit from original orm Repository.
 * Contains all most-necessary methods to simplify code in the custom repository.
 * All methods are protected thus not exposed and it allows to create encapsulated custom repository.
 *
 * @experimental
 */
var AbstractRepository = (function () {
    function AbstractRepository() {
    }
    Object.defineProperty(AbstractRepository.prototype, "entityManager", {
        // -------------------------------------------------------------------------
        // Protected Accessors
        // -------------------------------------------------------------------------
        /**
         * Gets entity manager that allows to perform repository operations with any entity.
         */
        get: function () {
            return this.connection.entityManager;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractRepository.prototype, "repository", {
        /**
         * Gets the original ORM repository for the entity that is managed by this repository.
         * If current repository does not manage any entity, then exception will be thrown.
         */
        get: function () {
            var target = this.connection.getCustomRepositoryTarget(this);
            if (!target)
                throw new CustomRepositoryDoesNotHaveEntityError_1.CustomRepositoryDoesNotHaveEntityError(this.constructor);
            return this.connection.getRepository(target);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractRepository.prototype, "treeRepository", {
        /**
         * Gets the original ORM tree repository for the entity that is managed by this repository.
         * If current repository does not manage any entity, then exception will be thrown.
         */
        get: function () {
            var target = this.connection.getCustomRepositoryTarget(this);
            if (!target)
                throw new CustomRepositoryDoesNotHaveEntityError_1.CustomRepositoryDoesNotHaveEntityError(this.constructor);
            return this.connection.getTreeRepository(target);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractRepository.prototype, "specificRepository", {
        /**
         * Gets the original ORM specific repository for the entity that is managed by this repository.
         * If current repository does not manage any entity, then exception will be thrown.
         */
        get: function () {
            var target = this.connection.getCustomRepositoryTarget(this);
            if (!target)
                throw new CustomRepositoryDoesNotHaveEntityError_1.CustomRepositoryDoesNotHaveEntityError(this.constructor);
            return this.connection.getSpecificRepository(target);
        },
        enumerable: true,
        configurable: true
    });
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Creates a new query builder for the repository's entity that can be used to build a sql query.
     * If current repository does not manage any entity, then exception will be thrown.
     */
    AbstractRepository.prototype.createQueryBuilder = function (alias) {
        var target = this.connection.getCustomRepositoryTarget(this.constructor);
        if (!target)
            throw new CustomRepositoryDoesNotHaveEntityError_1.CustomRepositoryDoesNotHaveEntityError(this.constructor);
        return this.connection.getRepository(target).createQueryBuilder(alias);
    };
    /**
     * Creates a new query builder for the given entity that can be used to build a sql query.
     */
    AbstractRepository.prototype.createQueryBuilderFor = function (entity, alias) {
        return this.getRepositoryFor(entity).createQueryBuilder(alias);
    };
    /**
     * Gets the original ORM repository for the given entity class.
     */
    AbstractRepository.prototype.getRepositoryFor = function (entity) {
        return this.entityManager.getRepository(entity);
    };
    /**
     * Gets the original ORM tree repository for the given entity class.
     */
    AbstractRepository.prototype.getTreeRepositoryFor = function (entity) {
        return this.entityManager.getTreeRepository(entity);
    };
    /**
     * Gets the original ORM specific repository for the given entity class.
     */
    AbstractRepository.prototype.getSpecificRepositoryFor = function (entity) {
        return this.entityManager.getSpecificRepository(entity);
    };
    return AbstractRepository;
}());
exports.AbstractRepository = AbstractRepository;

//# sourceMappingURL=AbstractRepository.js.map
