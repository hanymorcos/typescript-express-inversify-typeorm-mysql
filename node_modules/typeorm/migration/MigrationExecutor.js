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
var TableSchema_1 = require("../schema-builder/schema/TableSchema");
var ColumnSchema_1 = require("../schema-builder/schema/ColumnSchema");
var ColumnTypes_1 = require("../metadata/types/ColumnTypes");
var QueryBuilder_1 = require("../query-builder/QueryBuilder");
var QueryRunnerProvider_1 = require("../query-runner/QueryRunnerProvider");
var Migration_1 = require("./Migration");
var PromiseUtils_1 = require("../util/PromiseUtils");
/**
 * Executes migrations: runs pending and reverts previously executed migrations.
 */
var MigrationExecutor = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function MigrationExecutor(connection, queryRunnerProvider) {
        this.connection = connection;
        this.queryRunnerProvider = queryRunnerProvider || new QueryRunnerProvider_1.QueryRunnerProvider(connection.driver, true);
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Executes all pending migrations. Pending migrations are migrations that are not yet executed,
     * thus not saved in the database.
     */
    MigrationExecutor.prototype.executePendingMigrations = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var queryRunner, entityManager, executedMigrations, lastTimeExecutedMigration, allMigrations, pendingMigrations, transactionStartedByUs, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryRunnerProvider.provide()];
                    case 1:
                        queryRunner = _a.sent();
                        entityManager = this.connection.createEntityManagerWithSingleDatabaseConnection(this.queryRunnerProvider);
                        // create migrations table if its not created yet
                        return [4 /*yield*/, this.createMigrationsTableIfNotExist()];
                    case 2:
                        // create migrations table if its not created yet
                        _a.sent();
                        return [4 /*yield*/, this.loadExecutedMigrations()];
                    case 3:
                        executedMigrations = _a.sent();
                        lastTimeExecutedMigration = this.getLatestMigration(executedMigrations);
                        allMigrations = this.getMigrations();
                        pendingMigrations = allMigrations.filter(function (migration) {
                            // check if we already have executed migration
                            var executedMigration = executedMigrations.find(function (executedMigration) { return executedMigration.name === migration.name; });
                            if (executedMigration)
                                return false;
                            // migration is new and not executed. now check if its timestamp is correct
                            if (lastTimeExecutedMigration && migration.timestamp < lastTimeExecutedMigration.timestamp)
                                throw new Error("New migration found: " + migration.name + ", however this migration's timestamp is not valid. Migration's timestamp should not be older then migrations already executed in the database.");
                            // every check is passed means that migration was not run yet and we need to run it
                            return true;
                        });
                        // if no migrations are pending then nothing to do here
                        if (!pendingMigrations.length) {
                            this.connection.logger.log("info", "No migrations are pending");
                            return [2 /*return*/];
                        }
                        // log information about migration execution
                        this.connection.logger.log("info", executedMigrations.length + " migrations are already loaded in the database.");
                        this.connection.logger.log("info", allMigrations.length + " migrations were found in the source code.");
                        if (lastTimeExecutedMigration)
                            this.connection.logger.log("info", lastTimeExecutedMigration.name + " is the last executed migration. It was executed on " + new Date(lastTimeExecutedMigration.timestamp * 1000).toString() + ".");
                        this.connection.logger.log("info", pendingMigrations.length + " migrations are new migrations that needs to be executed.");
                        transactionStartedByUs = false;
                        if (!!queryRunner.isTransactionActive()) return [3 /*break*/, 5];
                        return [4 /*yield*/, queryRunner.beginTransaction()];
                    case 4:
                        _a.sent();
                        transactionStartedByUs = true;
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 9, , 12]);
                        return [4 /*yield*/, PromiseUtils_1.PromiseUtils.runInSequence(pendingMigrations, function (migration) {
                                return migration.instance.up(queryRunner, _this.connection, entityManager)
                                    .then(function () {
                                    return _this.insertExecutedMigration(migration);
                                })
                                    .then(function () {
                                    _this.connection.logger.log("info", "Migration " + migration.name + " has been executed successfully.");
                                });
                            })];
                    case 6:
                        _a.sent();
                        if (!transactionStartedByUs) return [3 /*break*/, 8];
                        return [4 /*yield*/, queryRunner.commitTransaction()];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8: return [3 /*break*/, 12];
                    case 9:
                        err_1 = _a.sent();
                        if (!transactionStartedByUs) return [3 /*break*/, 11];
                        return [4 /*yield*/, queryRunner.rollbackTransaction()];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11: throw err_1;
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Reverts last migration that were run.
     */
    MigrationExecutor.prototype.undoLastMigration = function () {
        return __awaiter(this, void 0, void 0, function () {
            var queryRunner, entityManager, executedMigrations, lastTimeExecutedMigration, allMigrations, migrationToRevert, transactionStartedByUs, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryRunnerProvider.provide()];
                    case 1:
                        queryRunner = _a.sent();
                        entityManager = this.connection.createEntityManagerWithSingleDatabaseConnection(this.queryRunnerProvider);
                        // create migrations table if its not created yet
                        return [4 /*yield*/, this.createMigrationsTableIfNotExist()];
                    case 2:
                        // create migrations table if its not created yet
                        _a.sent();
                        return [4 /*yield*/, this.loadExecutedMigrations()];
                    case 3:
                        executedMigrations = _a.sent();
                        lastTimeExecutedMigration = this.getLatestMigration(executedMigrations);
                        // if no migrations found in the database then nothing to revert
                        if (!lastTimeExecutedMigration) {
                            this.connection.logger.log("info", "No migrations was found in the database. Nothing to revert!");
                            return [2 /*return*/];
                        }
                        allMigrations = this.getMigrations();
                        migrationToRevert = allMigrations.find(function (migration) { return migration.name === lastTimeExecutedMigration.name; });
                        // if no migrations found in the database then nothing to revert
                        if (!migrationToRevert)
                            throw new Error("No migration " + lastTimeExecutedMigration.name + " was found in the source code. Make sure you have this migration in your codebase and its included in the connection options.");
                        // log information about migration execution
                        this.connection.logger.log("info", executedMigrations.length + " migrations are already loaded in the database.");
                        this.connection.logger.log("info", lastTimeExecutedMigration.name + " is the last executed migration. It was executed on " + new Date(lastTimeExecutedMigration.timestamp * 1000).toString() + ".");
                        this.connection.logger.log("info", "Now reverting it...");
                        transactionStartedByUs = false;
                        if (!!queryRunner.isTransactionActive()) return [3 /*break*/, 5];
                        return [4 /*yield*/, queryRunner.beginTransaction()];
                    case 4:
                        _a.sent();
                        transactionStartedByUs = true;
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 10, , 13]);
                        return [4 /*yield*/, migrationToRevert.instance.down(queryRunner, this.connection, entityManager)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.deleteExecutedMigration(migrationToRevert)];
                    case 7:
                        _a.sent();
                        this.connection.logger.log("info", "Migration " + migrationToRevert.name + " has been reverted successfully.");
                        if (!transactionStartedByUs) return [3 /*break*/, 9];
                        return [4 /*yield*/, queryRunner.commitTransaction()];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9: return [3 /*break*/, 13];
                    case 10:
                        err_2 = _a.sent();
                        if (!transactionStartedByUs) return [3 /*break*/, 12];
                        return [4 /*yield*/, queryRunner.rollbackTransaction()];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12: throw err_2;
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Creates table "migrations" that will store information about executed migrations.
     */
    MigrationExecutor.prototype.createMigrationsTableIfNotExist = function () {
        return __awaiter(this, void 0, void 0, function () {
            var queryRunner, tableExist;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryRunnerProvider.provide()];
                    case 1:
                        queryRunner = _a.sent();
                        return [4 /*yield*/, queryRunner.hasTable("migrations")];
                    case 2:
                        tableExist = _a.sent();
                        if (!!tableExist) return [3 /*break*/, 4];
                        return [4 /*yield*/, queryRunner.createTable(new TableSchema_1.TableSchema("migrations", [
                                new ColumnSchema_1.ColumnSchema({
                                    name: "timestamp",
                                    type: queryRunner.normalizeType({
                                        type: ColumnTypes_1.ColumnTypes.NUMBER
                                    }),
                                    isPrimary: true,
                                    isNullable: false
                                }),
                                new ColumnSchema_1.ColumnSchema({
                                    name: "name",
                                    type: queryRunner.normalizeType({
                                        type: ColumnTypes_1.ColumnTypes.STRING
                                    }),
                                    isNullable: false
                                }),
                            ]))];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Loads all migrations that were executed and saved into the database.
     */
    MigrationExecutor.prototype.loadExecutedMigrations = function () {
        return __awaiter(this, void 0, void 0, function () {
            var migrationsRaw;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new QueryBuilder_1.QueryBuilder(this.connection, this.queryRunnerProvider)
                            .select()
                            .fromTable("migrations", "migrations")
                            .getRawMany()];
                    case 1:
                        migrationsRaw = _a.sent();
                        return [2 /*return*/, migrationsRaw.map(function (migrationRaw) {
                                return new Migration_1.Migration(parseInt(migrationRaw["timestamp"]), migrationRaw["name"]);
                            })];
                }
            });
        });
    };
    /**
     * Gets all migrations that setup for this connection.
     */
    MigrationExecutor.prototype.getMigrations = function () {
        var migrations = this.connection.getMigrations().map(function (migration) {
            var migrationClassName = migration.constructor.name;
            var migrationTimestamp = parseInt(migrationClassName.substr(-13));
            if (!migrationTimestamp)
                throw new Error("Migration class name should contain a class name at the end of the file. " + migrationClassName + " migration name is wrong.");
            return new Migration_1.Migration(migrationTimestamp, migrationClassName, migration);
        });
        // sort them by timestamp
        return migrations.sort(function (a, b) { return a.timestamp - b.timestamp; });
    };
    /**
     * Finds the latest migration (sorts by timestamp) in the given array of migrations.
     */
    MigrationExecutor.prototype.getLatestMigration = function (migrations) {
        var sortedMigrations = migrations.map(function (migration) { return migration; }).sort(function (a, b) { return (a.timestamp - b.timestamp) * -1; });
        return sortedMigrations.length > 0 ? sortedMigrations[0] : undefined;
    };
    /**
     * Inserts new executed migration's data into migrations table.
     */
    MigrationExecutor.prototype.insertExecutedMigration = function (migration) {
        return __awaiter(this, void 0, void 0, function () {
            var queryRunner;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryRunnerProvider.provide()];
                    case 1:
                        queryRunner = _a.sent();
                        return [4 /*yield*/, queryRunner.insert("migrations", {
                                timestamp: migration.timestamp,
                                name: migration.name,
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete previously executed migration's data from the migrations table.
     */
    MigrationExecutor.prototype.deleteExecutedMigration = function (migration) {
        return __awaiter(this, void 0, void 0, function () {
            var queryRunner;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryRunnerProvider.provide()];
                    case 1:
                        queryRunner = _a.sent();
                        return [4 /*yield*/, queryRunner.delete("migrations", {
                                timestamp: migration.timestamp,
                                name: migration.name,
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return MigrationExecutor;
}());
exports.MigrationExecutor = MigrationExecutor;

//# sourceMappingURL=MigrationExecutor.js.map
