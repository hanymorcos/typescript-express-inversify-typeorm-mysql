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
var Repository_1 = require("../repository/Repository");
var RepositoryNotFoundError_1 = require("./error/RepositoryNotFoundError");
var EntityListenerMetadata_1 = require("../metadata/EntityListenerMetadata");
var EntityManager_1 = require("../entity-manager/EntityManager");
var DirectoryExportedClassesLoader_1 = require("../util/DirectoryExportedClassesLoader");
var index_1 = require("../index");
var EntityMetadataBuilder_1 = require("../metadata-builder/EntityMetadataBuilder");
var DefaultNamingStrategy_1 = require("../naming-strategy/DefaultNamingStrategy");
var CannotImportAlreadyConnectedError_1 = require("./error/CannotImportAlreadyConnectedError");
var CannotCloseNotConnectedError_1 = require("./error/CannotCloseNotConnectedError");
var CannotConnectAlreadyConnectedError_1 = require("./error/CannotConnectAlreadyConnectedError");
var NamingStrategyNotFoundError_1 = require("./error/NamingStrategyNotFoundError");
var RepositoryNotTreeError_1 = require("./error/RepositoryNotTreeError");
var CannotSyncNotConnectedError_1 = require("./error/CannotSyncNotConnectedError");
var CannotUseNamingStrategyNotConnectedError_1 = require("./error/CannotUseNamingStrategyNotConnectedError");
var Broadcaster_1 = require("../subscriber/Broadcaster");
var LazyRelationsWrapper_1 = require("../lazy-loading/LazyRelationsWrapper");
var RepositoryAggregator_1 = require("../repository/RepositoryAggregator");
var SchemaBuilder_1 = require("../schema-builder/SchemaBuilder");
var QueryRunnerProvider_1 = require("../query-runner/QueryRunnerProvider");
var EntityMetadataNotFound_1 = require("../metadata-args/error/EntityMetadataNotFound");
var MigrationExecutor_1 = require("../migration/MigrationExecutor");
var CannotRunMigrationNotConnectedError_1 = require("./error/CannotRunMigrationNotConnectedError");
var PlatformTools_1 = require("../platform/PlatformTools");
var AbstractRepository_1 = require("../repository/AbstractRepository");
var CustomRepositoryNotFoundError_1 = require("../repository/error/CustomRepositoryNotFoundError");
var CustomRepositoryReusedError_1 = require("../repository/error/CustomRepositoryReusedError");
var CustomRepositoryCannotInheritRepositoryError_1 = require("../repository/error/CustomRepositoryCannotInheritRepositoryError");
/**
 * Connection is a single database connection to a specific database of a database management system.
 * You can have multiple connections to multiple databases in your application.
 */
var Connection = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function Connection(name, driver, logger) {
        /**
         * All entity metadatas that are registered for this connection.
         */
        this.entityMetadatas = [];
        /**
         * Stores all registered repositories.
         */
        this.repositoryAggregators = [];
        /**
         * Stores all entity repository instances.
         */
        this.entityRepositories = [];
        /**
         * Entity listeners that are registered for this connection.
         */
        this.entityListeners = [];
        /**
         * Entity subscribers that are registered for this connection.
         */
        this.entitySubscribers = [];
        /**
         * Registered entity classes to be used for this connection.
         */
        this.entityClasses = [];
        /**
         * Registered entity schemas to be used for this connection.
         */
        this.entitySchemas = [];
        /**
         * Registered subscriber classes to be used for this connection.
         */
        this.subscriberClasses = [];
        /**
         * Registered naming strategy classes to be used for this connection.
         */
        this.namingStrategyClasses = [];
        /**
         * Registered migration classes to be used for this connection.
         */
        this.migrationClasses = [];
        /**
         * Indicates if connection has been done or not.
         */
        this._isConnected = false;
        this.name = name;
        this.driver = driver;
        this.logger = logger;
        this._entityManager = this.createEntityManager();
        this.broadcaster = this.createBroadcaster();
    }
    Object.defineProperty(Connection.prototype, "isConnected", {
        // -------------------------------------------------------------------------
        // Accessors
        // -------------------------------------------------------------------------
        /**
         * Indicates if connection to the database already established for this connection.
         */
        get: function () {
            return this._isConnected;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Connection.prototype, "entityManager", {
        /**
         * Gets entity manager that allows to perform repository operations with any entity in this connection.
         */
        get: function () {
            // if (!this.isConnected)
            //     throw new CannotGetEntityManagerNotConnectedError(this.name);
            return this._entityManager;
        },
        enumerable: true,
        configurable: true
    });
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Performs connection to the database.
     */
    Connection.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isConnected)
                            throw new CannotConnectAlreadyConnectedError_1.CannotConnectAlreadyConnectedError(this.name);
                        // connect to the database via its driver
                        return [4 /*yield*/, this.driver.connect()];
                    case 1:
                        // connect to the database via its driver
                        _a.sent();
                        // set connected status for the current connection
                        this._isConnected = true;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 3, , 5]);
                        this.buildMetadatas();
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _a.sent();
                        // if for some reason build metadata fail (for example validation error during entity metadata check)
                        // connection needs to be closed
                        return [4 /*yield*/, this.close()];
                    case 4:
                        // if for some reason build metadata fail (for example validation error during entity metadata check)
                        // connection needs to be closed
                        _a.sent();
                        throw error_1;
                    case 5: return [2 /*return*/, this];
                }
            });
        });
    };
    /**
     * Closes connection with the database.
     * Once connection is closed, you cannot use repositories and perform any operations except
     * opening connection again.
     */
    Connection.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isConnected)
                            throw new CannotCloseNotConnectedError_1.CannotCloseNotConnectedError(this.name);
                        return [4 /*yield*/, this.driver.disconnect()];
                    case 1:
                        _a.sent();
                        this._isConnected = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Drops the database and all its data.
     */
    Connection.prototype.dropDatabase = function () {
        return __awaiter(this, void 0, void 0, function () {
            var queryRunner;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.driver.createQueryRunner()];
                    case 1:
                        queryRunner = _a.sent();
                        return [4 /*yield*/, queryRunner.clearDatabase()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Creates database schema for all entities registered in this connection.
     *
     * @param dropBeforeSync If set to true then it drops the database with all its tables and data
     */
    Connection.prototype.syncSchema = function (dropBeforeSync) {
        if (dropBeforeSync === void 0) { dropBeforeSync = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isConnected)
                            return [2 /*return*/, Promise.reject(new CannotSyncNotConnectedError_1.CannotSyncNotConnectedError(this.name))];
                        if (!dropBeforeSync) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.dropDatabase()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.createSchemaBuilder().build()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Runs all pending migrations.
     */
    Connection.prototype.runMigrations = function () {
        return __awaiter(this, void 0, void 0, function () {
            var migrationExecutor;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isConnected)
                            return [2 /*return*/, Promise.reject(new CannotRunMigrationNotConnectedError_1.CannotRunMigrationNotConnectedError(this.name))];
                        migrationExecutor = new MigrationExecutor_1.MigrationExecutor(this);
                        return [4 /*yield*/, migrationExecutor.executePendingMigrations()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Reverts last executed migration.
     */
    Connection.prototype.undoLastMigration = function () {
        return __awaiter(this, void 0, void 0, function () {
            var migrationExecutor;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isConnected)
                            return [2 /*return*/, Promise.reject(new CannotRunMigrationNotConnectedError_1.CannotRunMigrationNotConnectedError(this.name))];
                        migrationExecutor = new MigrationExecutor_1.MigrationExecutor(this);
                        return [4 /*yield*/, migrationExecutor.undoLastMigration()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Imports entities from the given paths (directories) and registers them in the current connection.
     */
    Connection.prototype.importEntitiesFromDirectories = function (paths) {
        this.importEntities(DirectoryExportedClassesLoader_1.importClassesFromDirectories(paths));
        return this;
    };
    /**
     * Imports entity schemas from the given paths (directories) and registers them in the current connection.
     */
    Connection.prototype.importEntitySchemaFromDirectories = function (paths) {
        this.importEntitySchemas(DirectoryExportedClassesLoader_1.importJsonsFromDirectories(paths));
        return this;
    };
    /**
     * Imports subscribers from the given paths (directories) and registers them in the current connection.
     */
    Connection.prototype.importSubscribersFromDirectories = function (paths) {
        this.importSubscribers(DirectoryExportedClassesLoader_1.importClassesFromDirectories(paths));
        return this;
    };
    /**
     * Imports naming strategies from the given paths (directories) and registers them in the current connection.
     */
    Connection.prototype.importNamingStrategiesFromDirectories = function (paths) {
        this.importEntities(DirectoryExportedClassesLoader_1.importClassesFromDirectories(paths));
        return this;
    };
    /**
     * Imports migrations from the given paths (directories) and registers them in the current connection.
     */
    Connection.prototype.importMigrationsFromDirectories = function (paths) {
        this.importMigrations(DirectoryExportedClassesLoader_1.importClassesFromDirectories(paths));
        return this;
    };
    /**
     * Imports entities and registers them in the current connection.
     */
    Connection.prototype.importEntities = function (entities) {
        var _this = this;
        if (this.isConnected)
            throw new CannotImportAlreadyConnectedError_1.CannotImportAlreadyConnectedError("entities", this.name);
        entities.forEach(function (cls) { return _this.entityClasses.push(cls); });
        return this;
    };
    /**
     * Imports schemas and registers them in the current connection.
     */
    Connection.prototype.importEntitySchemas = function (schemas) {
        var _this = this;
        if (this.isConnected)
            throw new CannotImportAlreadyConnectedError_1.CannotImportAlreadyConnectedError("schemas", this.name);
        schemas.forEach(function (schema) { return _this.entitySchemas.push(schema); });
        return this;
    };
    /**
     * Imports subscribers and registers them in the current connection.
     */
    Connection.prototype.importSubscribers = function (subscriberClasses) {
        var _this = this;
        if (this.isConnected)
            throw new CannotImportAlreadyConnectedError_1.CannotImportAlreadyConnectedError("entity subscribers", this.name);
        subscriberClasses.forEach(function (cls) { return _this.subscriberClasses.push(cls); });
        return this;
    };
    /**
     * Imports naming strategies and registers them in the current connection.
     */
    Connection.prototype.importNamingStrategies = function (strategies) {
        var _this = this;
        if (this.isConnected)
            throw new CannotImportAlreadyConnectedError_1.CannotImportAlreadyConnectedError("naming strategies", this.name);
        strategies.forEach(function (cls) { return _this.namingStrategyClasses.push(cls); });
        return this;
    };
    /**
     * Imports migrations and registers them in the current connection.
     */
    Connection.prototype.importMigrations = function (migrations) {
        var _this = this;
        if (this.isConnected)
            throw new CannotImportAlreadyConnectedError_1.CannotImportAlreadyConnectedError("migrations", this.name);
        migrations.forEach(function (cls) { return _this.migrationClasses.push(cls); });
        return this;
    };
    /**
     * Sets given naming strategy to be used.
     * Naming strategy must be set to be used before connection is established.
     */
    Connection.prototype.useNamingStrategy = function (strategyClassOrName) {
        if (this.isConnected)
            throw new CannotUseNamingStrategyNotConnectedError_1.CannotUseNamingStrategyNotConnectedError(this.name);
        this.usedNamingStrategy = strategyClassOrName;
        return this;
    };
    /**
     Gets entity metadata for the given entity class or schema name.
     */
    Connection.prototype.getMetadata = function (target) {
        var metadata = this.entityMetadatas.find(function (metadata) { return metadata.target === target || (typeof target === "string" && metadata.targetName === target); });
        if (!metadata)
            throw new EntityMetadataNotFound_1.EntityMetadataNotFound(target);
        return metadata;
    };
    /**
     * Gets repository for the given entity class or name.
     */
    Connection.prototype.getRepository = function (entityClassOrName) {
        return this.findRepositoryAggregator(entityClassOrName).repository;
    };
    /**
     * Gets tree repository for the given entity class or name.
     * Only tree-type entities can have a TreeRepository,
     * like ones decorated with @ClosureEntity decorator.
     */
    Connection.prototype.getTreeRepository = function (entityClassOrName) {
        var repository = this.findRepositoryAggregator(entityClassOrName).treeRepository;
        if (!repository)
            throw new RepositoryNotTreeError_1.RepositoryNotTreeError(entityClassOrName);
        return repository;
    };
    /**
     * Gets specific repository for the given entity class or name.
     * SpecificRepository is a special repository that contains specific and non standard repository methods.
     */
    Connection.prototype.getSpecificRepository = function (entityClassOrName) {
        return this.findRepositoryAggregator(entityClassOrName).specificRepository;
    };
    /**
     * Creates a new entity manager with a single opened connection to the database.
     * This may be useful if you want to perform all db queries within one connection.
     * After finishing with entity manager, don't forget to release it, to release connection back to pool.
     */
    Connection.prototype.createEntityManagerWithSingleDatabaseConnection = function (queryRunnerProvider) {
        if (!queryRunnerProvider)
            queryRunnerProvider = new QueryRunnerProvider_1.QueryRunnerProvider(this.driver, true);
        return new EntityManager_1.EntityManager(this, queryRunnerProvider);
    };
    /**
     * Gets migration instances that are registered for this connection.
     */
    Connection.prototype.getMigrations = function () {
        if (this.migrationClasses && this.migrationClasses.length) {
            return this.migrationClasses.map(function (migrationClass) {
                return index_1.getFromContainer(migrationClass);
            });
        }
        return [];
    };
    /**
     * Gets custom entity repository marked with @EntityRepository decorator.
     */
    Connection.prototype.getCustomRepository = function (customRepository) {
        var entityRepositoryMetadataArgs = index_1.getMetadataArgsStorage().entityRepositories.toArray().find(function (repository) {
            return repository.target === (customRepository instanceof Function ? customRepository : customRepository.constructor);
        });
        if (!entityRepositoryMetadataArgs)
            throw new CustomRepositoryNotFoundError_1.CustomRepositoryNotFoundError(customRepository);
        var entityRepositoryInstance = this.entityRepositories.find(function (entityRepository) { return entityRepository.constructor === customRepository; });
        if (!entityRepositoryInstance) {
            if (entityRepositoryMetadataArgs.useContainer) {
                entityRepositoryInstance = index_1.getFromContainer(entityRepositoryMetadataArgs.target);
                // if we get custom entity repository from container then there is a risk that it already was used
                // in some different connection. If it was used there then we check it and throw an exception
                // because we cant override its connection there again
                if (entityRepositoryInstance instanceof AbstractRepository_1.AbstractRepository || entityRepositoryInstance instanceof Repository_1.Repository) {
                    // NOTE: dynamic access to protected properties. We need this to prevent unwanted properties in those classes to be exposed,
                    // however we need these properties for internal work of the class
                    if (entityRepositoryInstance["connection"] && entityRepositoryInstance["connection"] !== this)
                        throw new CustomRepositoryReusedError_1.CustomRepositoryReusedError(customRepository);
                }
            }
            else {
                entityRepositoryInstance = new entityRepositoryMetadataArgs.target();
            }
            if (entityRepositoryInstance instanceof AbstractRepository_1.AbstractRepository) {
                // NOTE: dynamic access to protected properties. We need this to prevent unwanted properties in those classes to be exposed,
                // however we need these properties for internal work of the class
                if (!entityRepositoryInstance["connection"])
                    entityRepositoryInstance["connection"] = this;
            }
            if (entityRepositoryInstance instanceof Repository_1.Repository) {
                if (!entityRepositoryMetadataArgs.entity)
                    throw new CustomRepositoryCannotInheritRepositoryError_1.CustomRepositoryCannotInheritRepositoryError(customRepository);
                // NOTE: dynamic access to protected properties. We need this to prevent unwanted properties in those classes to be exposed,
                // however we need these properties for internal work of the class
                entityRepositoryInstance["connection"] = this;
                entityRepositoryInstance["metadata"] = this.getMetadata(entityRepositoryMetadataArgs.entity);
            }
            // register entity repository
            this.entityRepositories.push(entityRepositoryInstance);
        }
        return entityRepositoryInstance;
    };
    /**
     * Gets custom repository's managed entity.
     * If given custom repository does not manage any entity then undefined will be returned.
     */
    Connection.prototype.getCustomRepositoryTarget = function (customRepository) {
        var entityRepositoryMetadataArgs = index_1.getMetadataArgsStorage().entityRepositories.toArray().find(function (repository) {
            return repository.target === (customRepository instanceof Function ? customRepository : customRepository.constructor);
        });
        if (!entityRepositoryMetadataArgs)
            throw new CustomRepositoryNotFoundError_1.CustomRepositoryNotFoundError(customRepository);
        return entityRepositoryMetadataArgs.entity;
    };
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Finds repository aggregator of the given entity class or name.
     */
    Connection.prototype.findRepositoryAggregator = function (entityClassOrName) {
        // if (!this.isConnected)
        //     throw new NoConnectionForRepositoryError(this.name);
        if (!this.entityMetadatas.find(function (metadata) { return metadata.target === entityClassOrName || (typeof entityClassOrName === "string" && metadata.targetName === entityClassOrName); }))
            throw new RepositoryNotFoundError_1.RepositoryNotFoundError(this.name, entityClassOrName);
        var metadata = this.getMetadata(entityClassOrName);
        var repositoryAggregator = this.repositoryAggregators.find(function (repositoryAggregate) { return repositoryAggregate.metadata === metadata; });
        if (!repositoryAggregator)
            throw new RepositoryNotFoundError_1.RepositoryNotFoundError(this.name, entityClassOrName);
        return repositoryAggregator;
    };
    /**
     * Builds all registered metadatas.
     */
    Connection.prototype.buildMetadatas = function () {
        var _this = this;
        this.entitySubscribers.length = 0;
        this.entityListeners.length = 0;
        this.repositoryAggregators.length = 0;
        this.entityMetadatas.length = 0;
        var namingStrategy = this.createNamingStrategy();
        this.driver.namingStrategy = namingStrategy;
        var lazyRelationsWrapper = this.createLazyRelationsWrapper();
        // take imported event subscribers
        if (this.subscriberClasses && this.subscriberClasses.length && !PlatformTools_1.PlatformTools.getEnvVariable("SKIP_SUBSCRIBERS_LOADING")) {
            index_1.getMetadataArgsStorage()
                .entitySubscribers
                .filterByTargets(this.subscriberClasses)
                .toArray()
                .map(function (metadata) { return index_1.getFromContainer(metadata.target); })
                .forEach(function (subscriber) { return _this.entitySubscribers.push(subscriber); });
        }
        // take imported entity listeners
        if (this.entityClasses && this.entityClasses.length) {
            index_1.getMetadataArgsStorage()
                .entityListeners
                .filterByTargets(this.entityClasses)
                .toArray()
                .forEach(function (metadata) { return _this.entityListeners.push(new EntityListenerMetadata_1.EntityListenerMetadata(metadata)); });
        }
        // build entity metadatas from metadata args storage (collected from decorators)
        if (this.entityClasses && this.entityClasses.length) {
            index_1.getFromContainer(EntityMetadataBuilder_1.EntityMetadataBuilder)
                .buildFromMetadataArgsStorage(this.driver, lazyRelationsWrapper, namingStrategy, this.entityClasses)
                .forEach(function (metadata) {
                _this.entityMetadatas.push(metadata);
                _this.repositoryAggregators.push(new RepositoryAggregator_1.RepositoryAggregator(_this, metadata));
            });
        }
        // build entity metadatas from given entity schemas
        if (this.entitySchemas && this.entitySchemas.length) {
            index_1.getFromContainer(EntityMetadataBuilder_1.EntityMetadataBuilder)
                .buildFromSchemas(this.driver, lazyRelationsWrapper, namingStrategy, this.entitySchemas)
                .forEach(function (metadata) {
                _this.entityMetadatas.push(metadata);
                _this.repositoryAggregators.push(new RepositoryAggregator_1.RepositoryAggregator(_this, metadata));
            });
        }
    };
    /**
     * Creates a naming strategy to be used for this connection.
     */
    Connection.prototype.createNamingStrategy = function () {
        var _this = this;
        // if naming strategies are not loaded, or used naming strategy is not set then use default naming strategy
        if (!this.namingStrategyClasses || !this.namingStrategyClasses.length || !this.usedNamingStrategy)
            return index_1.getFromContainer(DefaultNamingStrategy_1.DefaultNamingStrategy);
        // try to find used naming strategy in the list of loaded naming strategies
        var namingMetadata = index_1.getMetadataArgsStorage()
            .namingStrategies
            .filterByTargets(this.namingStrategyClasses)
            .toArray()
            .find(function (strategy) {
            if (typeof _this.usedNamingStrategy === "string") {
                return strategy.name === _this.usedNamingStrategy;
            }
            else {
                return strategy.target === _this.usedNamingStrategy;
            }
        });
        // throw an error if not found
        if (!namingMetadata)
            throw new NamingStrategyNotFoundError_1.NamingStrategyNotFoundError(this.usedNamingStrategy, this.name);
        // initialize a naming strategy instance
        return index_1.getFromContainer(namingMetadata.target);
    };
    /**
     * Creates a new default entity manager without single connection setup.
     */
    Connection.prototype.createEntityManager = function () {
        return new EntityManager_1.EntityManager(this);
    };
    /**
     * Creates a new entity broadcaster using in this connection.
     */
    Connection.prototype.createBroadcaster = function () {
        return new Broadcaster_1.Broadcaster(this, this.entitySubscribers, this.entityListeners);
    };
    /**
     * Creates a schema builder used to build a database schema for the entities of the current connection.
     */
    Connection.prototype.createSchemaBuilder = function () {
        return new SchemaBuilder_1.SchemaBuilder(this.driver, this.logger, this.entityMetadatas);
    };
    /**
     * Creates a lazy relations wrapper.
     */
    Connection.prototype.createLazyRelationsWrapper = function () {
        return new LazyRelationsWrapper_1.LazyRelationsWrapper(this);
    };
    return Connection;
}());
exports.Connection = Connection;

//# sourceMappingURL=Connection.js.map
