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
var QueryBuilder_1 = require("../query-builder/QueryBuilder");
var PlainObjectToNewEntityTransformer_1 = require("../query-builder/transformer/PlainObjectToNewEntityTransformer");
var PlainObjectToDatabaseEntityTransformer_1 = require("../query-builder/transformer/PlainObjectToDatabaseEntityTransformer");
var FindOptionsUtils_1 = require("../find-options/FindOptionsUtils");
var QueryRunnerProvider_1 = require("../query-runner/QueryRunnerProvider");
var SubjectOperationExecutor_1 = require("../persistence/SubjectOperationExecutor");
var SubjectBuilder_1 = require("../persistence/SubjectBuilder");
/**
 * Repository is supposed to work with your entity objects. Find entities, insert, update, delete, etc.
 */
var Repository = (function () {
    function Repository() {
    }
    Object.defineProperty(Repository.prototype, "target", {
        // -------------------------------------------------------------------------
        // Public Methods
        // -------------------------------------------------------------------------
        /**
         * Returns object that is managed by this repository.
         * If this repository manages entity from schema,
         * then it returns a name of that schema instead.
         */
        get: function () {
            return this.metadata.target;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Checks if entity has an id.
     * If entity contains compose ids, then it checks them all.
     */
    Repository.prototype.hasId = function (entity) {
        return this.metadata.hasId(entity);
    };
    /**
     * Creates a new query builder that can be used to build a sql query.
     */
    Repository.prototype.createQueryBuilder = function (alias, queryRunnerProvider) {
        return new QueryBuilder_1.QueryBuilder(this.connection, queryRunnerProvider || this.queryRunnerProvider)
            .select(alias)
            .from(this.metadata.target, alias);
    };
    /**
     * Creates a new entity instance or instances.
     * Can copy properties from the given object into new entities.
     */
    Repository.prototype.create = function (plainObjectOrObjects) {
        var _this = this;
        if (plainObjectOrObjects instanceof Array)
            return plainObjectOrObjects.map(function (object) { return _this.create(object); });
        var newEntity = this.metadata.create();
        if (plainObjectOrObjects) {
            var plainObjectToEntityTransformer = new PlainObjectToNewEntityTransformer_1.PlainObjectToNewEntityTransformer();
            plainObjectToEntityTransformer.transform(newEntity, plainObjectOrObjects, this.metadata);
        }
        return newEntity;
    };
    /**
     * Creates a new entity from the given plan javascript object. If entity already exist in the database, then
     * it loads it (and everything related to it), replaces all values with the new ones from the given object
     * and returns this new entity. This new entity is actually a loaded from the db entity with all properties
     * replaced from the new object.
     */
    Repository.prototype.preload = function (object) {
        var queryBuilder = this.createQueryBuilder(this.metadata.table.name);
        var plainObjectToDatabaseEntityTransformer = new PlainObjectToDatabaseEntityTransformer_1.PlainObjectToDatabaseEntityTransformer();
        return plainObjectToDatabaseEntityTransformer.transform(object, this.metadata, queryBuilder);
    };
    /**
     * Merges multiple entities (or entity-like objects) into a one new entity.
     */
    Repository.prototype.merge = function () {
        var _this = this;
        var objects = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            objects[_i] = arguments[_i];
        }
        var newEntity = this.metadata.create();
        var plainObjectToEntityTransformer = new PlainObjectToNewEntityTransformer_1.PlainObjectToNewEntityTransformer();
        objects.forEach(function (object) { return plainObjectToEntityTransformer.transform(newEntity, object, _this.metadata); });
        return newEntity;
    };
    /**
     * Persists one or many given entities.
     */
    Repository.prototype.persist = function (entityOrEntities) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var queryRunnerProvider, transactionEntityManager, databaseEntityLoader, executor;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // if multiple entities given then go throw all of them and save them
                        if (entityOrEntities instanceof Array)
                            return [2 /*return*/, Promise.all(entityOrEntities.map(function (entity) { return _this.persist(entity); }))];
                        queryRunnerProvider = this.queryRunnerProvider || new QueryRunnerProvider_1.QueryRunnerProvider(this.connection.driver, true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 4, 7]);
                        transactionEntityManager = this.connection.createEntityManagerWithSingleDatabaseConnection(queryRunnerProvider);
                        databaseEntityLoader = new SubjectBuilder_1.SubjectBuilder(this.connection, queryRunnerProvider);
                        return [4 /*yield*/, databaseEntityLoader.persist(entityOrEntities, this.metadata)];
                    case 2:
                        _a.sent();
                        executor = new SubjectOperationExecutor_1.SubjectOperationExecutor(this.connection, transactionEntityManager, queryRunnerProvider);
                        return [4 /*yield*/, executor.execute(databaseEntityLoader.operateSubjects)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, entityOrEntities];
                    case 4:
                        if (!!this.queryRunnerProvider) return [3 /*break*/, 6];
                        return [4 /*yield*/, queryRunnerProvider.releaseReused()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Removes one or many given entities.
     */
    Repository.prototype.remove = function (entityOrEntities) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var queryRunnerProvider, transactionEntityManager, databaseEntityLoader, executor;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // if multiple entities given then go throw all of them and save them
                        if (entityOrEntities instanceof Array)
                            return [2 /*return*/, Promise.all(entityOrEntities.map(function (entity) { return _this.remove(entity); }))];
                        queryRunnerProvider = this.queryRunnerProvider || new QueryRunnerProvider_1.QueryRunnerProvider(this.connection.driver, true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 4, 7]);
                        transactionEntityManager = this.connection.createEntityManagerWithSingleDatabaseConnection(queryRunnerProvider);
                        databaseEntityLoader = new SubjectBuilder_1.SubjectBuilder(this.connection, queryRunnerProvider);
                        return [4 /*yield*/, databaseEntityLoader.remove(entityOrEntities, this.metadata)];
                    case 2:
                        _a.sent();
                        executor = new SubjectOperationExecutor_1.SubjectOperationExecutor(this.connection, transactionEntityManager, queryRunnerProvider);
                        return [4 /*yield*/, executor.execute(databaseEntityLoader.operateSubjects)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, entityOrEntities];
                    case 4:
                        if (!!this.queryRunnerProvider) return [3 /*break*/, 6];
                        return [4 /*yield*/, queryRunnerProvider.releaseReused()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Counts entities that match given conditions and/or find options.
     */
    Repository.prototype.count = function (conditionsOrFindOptions, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.createFindQueryBuilder(conditionsOrFindOptions, options)
                        .getCount()];
            });
        });
    };
    /**
     * Finds entities that match given conditions and/or find options.
     */
    Repository.prototype.find = function (conditionsOrFindOptions, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.createFindQueryBuilder(conditionsOrFindOptions, options)
                        .getMany()];
            });
        });
    };
    /**
     * Finds entities that match given conditions.
     * Also counts all entities that match given conditions,
     * but ignores pagination settings (maxResults, firstResult) options.
     */
    Repository.prototype.findAndCount = function (conditionsOrFindOptions, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.createFindQueryBuilder(conditionsOrFindOptions, options)
                        .getManyAndCount()];
            });
        });
    };
    /**
     * Finds first entity that matches given conditions and/or find options.
     */
    Repository.prototype.findOne = function (conditionsOrFindOptions, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.createFindQueryBuilder(conditionsOrFindOptions, options)
                        .getOne()];
            });
        });
    };
    /**
     * Finds entities with ids.
     * Optionally find options can be applied.
     */
    Repository.prototype.findByIds = function (ids, options) {
        return __awaiter(this, void 0, void 0, function () {
            var qb;
            return __generator(this, function (_a) {
                qb = this.createFindQueryBuilder(undefined, options);
                return [2 /*return*/, qb.andWhereInIds(ids).getMany()];
            });
        });
    };
    /**
     * Finds entity with given id.
     * Optionally find options can be applied.
     */
    Repository.prototype.findOneById = function (id, options) {
        return __awaiter(this, void 0, void 0, function () {
            var qb;
            return __generator(this, function (_a) {
                qb = this.createFindQueryBuilder(undefined, options);
                return [2 /*return*/, qb.andWhereInIds([id]).getOne()];
            });
        });
    };
    /**
     * Executes a raw SQL query and returns a raw database results.
     */
    Repository.prototype.query = function (query, parameters) {
        return __awaiter(this, void 0, void 0, function () {
            var queryRunnerProvider, queryRunner;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryRunnerProvider = this.queryRunnerProvider || new QueryRunnerProvider_1.QueryRunnerProvider(this.connection.driver);
                        return [4 /*yield*/, queryRunnerProvider.provide()];
                    case 1:
                        queryRunner = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, , 4, 6]);
                        return [4 /*yield*/, queryRunner.query(query, parameters)];
                    case 3: return [2 /*return*/, _a.sent()]; // await is needed here because we are using finally
                    case 4: return [4 /*yield*/, queryRunnerProvider.release(queryRunner)];
                    case 5:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Wraps given function execution (and all operations made there) in a transaction.
     * All database operations must be executed using provided repository.
     */
    Repository.prototype.transaction = function (runInTransaction) {
        return __awaiter(this, void 0, void 0, function () {
            var queryRunnerProvider, queryRunner, transactionRepository, result, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryRunnerProvider = this.queryRunnerProvider || new QueryRunnerProvider_1.QueryRunnerProvider(this.connection.driver, true);
                        return [4 /*yield*/, queryRunnerProvider.provide()];
                    case 1:
                        queryRunner = _a.sent();
                        transactionRepository = new Repository();
                        transactionRepository["connection"] = this.connection;
                        transactionRepository["metadata"] = this.metadata;
                        transactionRepository["queryRunnerProvider"] = queryRunnerProvider;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 6, 8, 12]);
                        return [4 /*yield*/, queryRunner.beginTransaction()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, runInTransaction(transactionRepository)];
                    case 4:
                        result = _a.sent();
                        return [4 /*yield*/, queryRunner.commitTransaction()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, result];
                    case 6:
                        err_1 = _a.sent();
                        return [4 /*yield*/, queryRunner.rollbackTransaction()];
                    case 7:
                        _a.sent();
                        throw err_1;
                    case 8: return [4 /*yield*/, queryRunnerProvider.release(queryRunner)];
                    case 9:
                        _a.sent();
                        if (!!this.queryRunnerProvider) return [3 /*break*/, 11];
                        return [4 /*yield*/, queryRunnerProvider.releaseReused()];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11: return [7 /*endfinally*/];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Clears all the data from the given table (truncates/drops it).
     */
    Repository.prototype.clear = function () {
        return __awaiter(this, void 0, void 0, function () {
            var queryRunnerProvider, queryRunner;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryRunnerProvider = this.queryRunnerProvider || new QueryRunnerProvider_1.QueryRunnerProvider(this.connection.driver);
                        return [4 /*yield*/, queryRunnerProvider.provide()];
                    case 1:
                        queryRunner = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, , 4, 6]);
                        return [4 /*yield*/, queryRunner.truncate(this.metadata.table.name)];
                    case 3: return [2 /*return*/, _a.sent()]; // await is needed here because we are using finally
                    case 4: return [4 /*yield*/, queryRunnerProvider.release(queryRunner)];
                    case 5:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Creates a query builder from the given conditions or find options.
     * Used to create a query builder for find* methods.
     */
    Repository.prototype.createFindQueryBuilder = function (conditionsOrFindOptions, options) {
        var findOptions = FindOptionsUtils_1.FindOptionsUtils.isFindOptions(conditionsOrFindOptions) ? conditionsOrFindOptions : options;
        var conditions = FindOptionsUtils_1.FindOptionsUtils.isFindOptions(conditionsOrFindOptions) ? undefined : conditionsOrFindOptions;
        var alias = findOptions ? findOptions.alias : this.metadata.table.name;
        var qb = this.createQueryBuilder(alias);
        // if find options are given then apply them to query builder
        if (findOptions)
            FindOptionsUtils_1.FindOptionsUtils.applyOptionsToQueryBuilder(qb, findOptions);
        // if conditions are given then apply them to query builder
        if (conditions) {
            Object.keys(conditions).forEach(function (key) {
                var name = key.indexOf(".") === -1 ? alias + "." + key : key;
                if (conditions[key] === null) {
                    qb.andWhere(name + " IS NULL");
                }
                else {
                    qb.andWhere(name + "=:" + key);
                }
            });
            qb.setParameters(conditions);
        }
        return qb;
    };
    return Repository;
}());
exports.Repository = Repository;

//# sourceMappingURL=Repository.js.map
