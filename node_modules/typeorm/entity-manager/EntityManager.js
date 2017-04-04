"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var BaseEntityManager_1 = require("./BaseEntityManager");
var QueryRunnerProviderAlreadyReleasedError_1 = require("../query-runner/error/QueryRunnerProviderAlreadyReleasedError");
var QueryRunnerProvider_1 = require("../query-runner/QueryRunnerProvider");
/**
 * Entity manager supposed to work with any entity, automatically find its repository and call its methods,
 * whatever entity type are you passing.
 */
var EntityManager = (function (_super) {
    __extends(EntityManager, _super);
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function EntityManager(connection, queryRunnerProvider) {
        return _super.call(this, connection, queryRunnerProvider) || this;
    }
    /**
     * Persists (saves) a given entity in the database.
     */
    EntityManager.prototype.persist = function (targetOrEntity, maybeEntity) {
        var _this = this;
        var target = arguments.length === 2 ? maybeEntity : targetOrEntity;
        var entity = arguments.length === 2 ? maybeEntity : targetOrEntity;
        return Promise.resolve().then(function () {
            if (typeof target === "string") {
                return _this.getRepository(target).persist(entity);
            }
            else {
                if (target instanceof Array) {
                    if (target.length === 0)
                        return Promise.resolve(target);
                    return Promise.all(target.map(function (t, i) {
                        return _this.getRepository(t.constructor).persist(entity[i]);
                    }));
                }
                else {
                    return _this.getRepository(target.constructor).persist(entity);
                }
            }
        });
    };
    /**
     * Removes a given entity from the database.
     */
    EntityManager.prototype.remove = function (targetOrEntity, maybeEntity) {
        var _this = this;
        var target = arguments.length === 2 ? maybeEntity : targetOrEntity;
        var entity = arguments.length === 2 ? maybeEntity : targetOrEntity;
        if (typeof target === "string") {
            return this.getRepository(target).remove(entity);
        }
        else {
            if (target instanceof Array) {
                return Promise.all(target.map(function (t, i) {
                    return _this.getRepository(t.constructor).remove(entity[i]);
                }));
            }
            else {
                return this.getRepository(target.constructor).remove(entity);
            }
        }
    };
    /**
     * Counts entities that match given conditions.
     */
    EntityManager.prototype.count = function (entityClass, conditionsOrFindOptions, options) {
        if (conditionsOrFindOptions && options) {
            return this.getRepository(entityClass).count(conditionsOrFindOptions, options);
        }
        else if (conditionsOrFindOptions) {
            return this.getRepository(entityClass).count(conditionsOrFindOptions);
        }
        else {
            return this.getRepository(entityClass).count();
        }
    };
    /**
     * Finds entities that match given conditions.
     */
    EntityManager.prototype.find = function (entityClass, conditionsOrFindOptions, options) {
        if (conditionsOrFindOptions && options) {
            return this.getRepository(entityClass).find(conditionsOrFindOptions, options);
        }
        else if (conditionsOrFindOptions) {
            return this.getRepository(entityClass).find(conditionsOrFindOptions);
        }
        else {
            return this.getRepository(entityClass).find();
        }
    };
    /**
     * Finds entities that match given conditions.
     * Also counts all entities that match given conditions,
     * but ignores pagination settings (maxResults, firstResult) options.
     */
    EntityManager.prototype.findAndCount = function (entityClass, conditionsOrFindOptions, options) {
        if (conditionsOrFindOptions && options) {
            return this.getRepository(entityClass).findAndCount(conditionsOrFindOptions, options);
        }
        else if (conditionsOrFindOptions) {
            return this.getRepository(entityClass).findAndCount(conditionsOrFindOptions);
        }
        else {
            return this.getRepository(entityClass).findAndCount();
        }
    };
    /**
     * Finds first entity that matches given conditions.
     */
    EntityManager.prototype.findOne = function (entityClass, conditionsOrFindOptions, options) {
        if (conditionsOrFindOptions && options) {
            return this.getRepository(entityClass).findOne(conditionsOrFindOptions, options);
        }
        else if (conditionsOrFindOptions) {
            return this.getRepository(entityClass).findOne(conditionsOrFindOptions);
        }
        else {
            return this.getRepository(entityClass).findOne();
        }
    };
    /**
     * Finds entities with ids.
     * Optionally find options can be applied.
     */
    EntityManager.prototype.findByIds = function (entityClass, ids, options) {
        return this.getRepository(entityClass).findByIds(ids, options);
    };
    /**
     * Finds entity with given id.
     */
    EntityManager.prototype.findOneById = function (entityClass, id, options) {
        return this.getRepository(entityClass).findOneById(id, options);
    };
    /**
     * Executes raw SQL query and returns raw database results.
     */
    EntityManager.prototype.query = function (query, parameters) {
        return __awaiter(this, void 0, void 0, function () {
            var queryRunnerProvider, queryRunner;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.queryRunnerProvider && this.queryRunnerProvider.isReleased)
                            throw new QueryRunnerProviderAlreadyReleasedError_1.QueryRunnerProviderAlreadyReleasedError();
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
     * All database operations must be executed using provided entity manager.
     */
    EntityManager.prototype.transaction = function (runInTransaction) {
        return __awaiter(this, void 0, void 0, function () {
            var queryRunnerProvider, queryRunner, transactionEntityManager, result, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.queryRunnerProvider && this.queryRunnerProvider.isReleased)
                            throw new QueryRunnerProviderAlreadyReleasedError_1.QueryRunnerProviderAlreadyReleasedError();
                        queryRunnerProvider = this.queryRunnerProvider || new QueryRunnerProvider_1.QueryRunnerProvider(this.connection.driver, true);
                        return [4 /*yield*/, queryRunnerProvider.provide()];
                    case 1:
                        queryRunner = _a.sent();
                        transactionEntityManager = new EntityManager(this.connection, queryRunnerProvider);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 6, 8, 12]);
                        return [4 /*yield*/, queryRunner.beginTransaction()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, runInTransaction(transactionEntityManager)];
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
    EntityManager.prototype.clear = function (entityClass) {
        return this.getRepository(entityClass).clear();
    };
    return EntityManager;
}(BaseEntityManager_1.BaseEntityManager));
exports.EntityManager = EntityManager;

//# sourceMappingURL=EntityManager.js.map
