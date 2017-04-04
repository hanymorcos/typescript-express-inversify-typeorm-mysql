"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var RepositoryAggregator_1 = require("../repository/RepositoryAggregator");
var RepositoryNotTreeError_1 = require("../connection/error/RepositoryNotTreeError");
var NoNeedToReleaseEntityManagerError_1 = require("./error/NoNeedToReleaseEntityManagerError");
var QueryRunnerProviderAlreadyReleasedError_1 = require("../query-runner/error/QueryRunnerProviderAlreadyReleasedError");
/**
 * Common functions shared between different entity manager types.
 */
var BaseEntityManager = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    /**
     * @param connection Connection to be used in this entity manager
     * @param queryRunnerProvider Custom query runner to be used for operations in this entity manager
     */
    function BaseEntityManager(connection, queryRunnerProvider) {
        this.connection = connection;
        this.queryRunnerProvider = queryRunnerProvider;
        // -------------------------------------------------------------------------
        // Private Properties
        // -------------------------------------------------------------------------
        /**
         * Stores all registered repositories.
         * Used when custom queryRunnerProvider is provided.
         */
        this.repositoryAggregators = [];
    }
    /**
     * Gets repository for the given entity class or name.
     * If single database connection mode is used, then repository is obtained from the
     * repository aggregator, where each repository is individually created for this entity manager.
     * When single database connection is not used, repository is being obtained from the connection.
     */
    BaseEntityManager.prototype.getRepository = function (entityClassOrName) {
        // if single db connection is used then create its own repository with reused query runner
        if (this.queryRunnerProvider)
            return this.obtainRepositoryAggregator(entityClassOrName).repository;
        return this.connection.getRepository(entityClassOrName);
    };
    /**
     * Gets tree repository for the given entity class or name.
     * If single database connection mode is used, then repository is obtained from the
     * repository aggregator, where each repository is individually created for this entity manager.
     * When single database connection is not used, repository is being obtained from the connection.
     */
    BaseEntityManager.prototype.getTreeRepository = function (entityClassOrName) {
        // if single db connection is used then create its own repository with reused query runner
        if (this.queryRunnerProvider) {
            var treeRepository = this.obtainRepositoryAggregator(entityClassOrName).treeRepository;
            if (!treeRepository)
                throw new RepositoryNotTreeError_1.RepositoryNotTreeError(entityClassOrName);
            return treeRepository;
        }
        return this.connection.getTreeRepository(entityClassOrName);
    };
    /**
     * Gets specific repository for the given entity class or name.
     * If single database connection mode is used, then repository is obtained from the
     * repository aggregator, where each repository is individually created for this entity manager.
     * When single database connection is not used, repository is being obtained from the connection.
     */
    BaseEntityManager.prototype.getSpecificRepository = function (entityClassOrName) {
        // if single db connection is used then create its own repository with reused query runner
        if (this.queryRunnerProvider)
            return this.obtainRepositoryAggregator(entityClassOrName).specificRepository;
        return this.connection.getSpecificRepository(entityClassOrName);
    };
    /**
     * Gets custom entity repository marked with @EntityRepository decorator.
     */
    BaseEntityManager.prototype.getCustomRepository = function (customRepository) {
        return this.connection.getCustomRepository(customRepository);
    };
    /**
     * Checks if entity has an id by its Function type or schema name.
     */
    BaseEntityManager.prototype.hasId = function (targetOrEntity, maybeEntity) {
        var target = arguments.length === 2 ? targetOrEntity : targetOrEntity.constructor;
        var entity = arguments.length === 2 ? maybeEntity : targetOrEntity;
        return this.getRepository(target).hasId(entity);
    };
    /**
     * Creates a new query builder that can be used to build an sql query.
     */
    BaseEntityManager.prototype.createQueryBuilder = function (entityClass, alias) {
        return this.getRepository(entityClass).createQueryBuilder(alias);
    };
    /**
     * Creates a new entity instance or instances.
     * Can copy properties from the given object into new entities.
     */
    BaseEntityManager.prototype.create = function (entityClass, plainObjectOrObjects) {
        if (plainObjectOrObjects instanceof Array) {
            return this.getRepository(entityClass).create(plainObjectOrObjects);
        }
        else if (plainObjectOrObjects) {
            return this.getRepository(entityClass).create(plainObjectOrObjects);
        }
        else {
            return this.getRepository(entityClass).create();
        }
    };
    /**
     * Creates a new entity from the given plan javascript object. If entity already exist in the database, then
     * it loads it (and everything related to it), replaces all values with the new ones from the given object
     * and returns this new entity. This new entity is actually a loaded from the db entity with all properties
     * replaced from the new object.
     */
    BaseEntityManager.prototype.preload = function (entityClass, object) {
        return this.getRepository(entityClass).preload(object);
    };
    /**
     * Merges two entities into one new entity.
     */
    BaseEntityManager.prototype.merge = function (entityClass) {
        var objects = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            objects[_i - 1] = arguments[_i];
        }
        return (_a = this.getRepository(entityClass)).merge.apply(_a, objects);
        var _a;
    };
    /**
     * Releases all resources used by entity manager.
     * This is used when entity manager is created with a single query runner,
     * and this single query runner needs to be released after job with entity manager is done.
     */
    BaseEntityManager.prototype.release = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.queryRunnerProvider)
                    throw new NoNeedToReleaseEntityManagerError_1.NoNeedToReleaseEntityManagerError();
                return [2 /*return*/, this.queryRunnerProvider.releaseReused()];
            });
        });
    };
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Gets, or if does not exist yet, creates and returns a repository aggregator for a particular entity target.
     */
    BaseEntityManager.prototype.obtainRepositoryAggregator = function (entityClassOrName) {
        if (this.queryRunnerProvider && this.queryRunnerProvider.isReleased)
            throw new QueryRunnerProviderAlreadyReleasedError_1.QueryRunnerProviderAlreadyReleasedError();
        var metadata = this.connection.getMetadata(entityClassOrName);
        var repositoryAggregator = this.repositoryAggregators.find(function (repositoryAggregate) { return repositoryAggregate.metadata === metadata; });
        if (!repositoryAggregator) {
            repositoryAggregator = new RepositoryAggregator_1.RepositoryAggregator(this.connection, this.connection.getMetadata(entityClassOrName), this.queryRunnerProvider);
            this.repositoryAggregators.push(repositoryAggregator); // todo: check isnt memory leak here?
        }
        return repositoryAggregator;
    };
    return BaseEntityManager;
}());
exports.BaseEntityManager = BaseEntityManager;

//# sourceMappingURL=BaseEntityManager.js.map
