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
var TransactionAlreadyStartedError_1 = require("../error/TransactionAlreadyStartedError");
var TransactionNotStartedError_1 = require("../error/TransactionNotStartedError");
var DataTypeNotSupportedByDriverError_1 = require("../error/DataTypeNotSupportedByDriverError");
var ColumnSchema_1 = require("../../schema-builder/schema/ColumnSchema");
var TableSchema_1 = require("../../schema-builder/schema/TableSchema");
var ForeignKeySchema_1 = require("../../schema-builder/schema/ForeignKeySchema");
var PrimaryKeySchema_1 = require("../../schema-builder/schema/PrimaryKeySchema");
var IndexSchema_1 = require("../../schema-builder/schema/IndexSchema");
var QueryRunnerAlreadyReleasedError_1 = require("../../query-runner/error/QueryRunnerAlreadyReleasedError");
/**
 * Runs queries on a single mysql database connection.
 */
var MysqlQueryRunner = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function MysqlQueryRunner(databaseConnection, driver, logger) {
        this.databaseConnection = databaseConnection;
        this.driver = driver;
        this.logger = logger;
        // -------------------------------------------------------------------------
        // Protected Properties
        // -------------------------------------------------------------------------
        /**
         * Indicates if connection for this query runner is released.
         * Once its released, query runner cannot run queries anymore.
         */
        this.isReleased = false;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Releases database connection. This is needed when using connection pooling.
     * If connection is not from a pool, it should not be released.
     * You cannot use this class's methods after its released.
     */
    MysqlQueryRunner.prototype.release = function () {
        if (this.databaseConnection.releaseCallback) {
            this.isReleased = true;
            return this.databaseConnection.releaseCallback();
        }
        return Promise.resolve();
    };
    /**
     * Removes all tables from the currently connected database.
     * Be careful with using this method and avoid using it in production or migrations
     * (because it can clear all your database).
     */
    MysqlQueryRunner.prototype.clearDatabase = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var disableForeignKeysCheckQuery, dropTablesQuery, enableForeignKeysCheckQuery, dropQueries, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        return [4 /*yield*/, this.beginTransaction()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 8, 10, 12]);
                        disableForeignKeysCheckQuery = "SET FOREIGN_KEY_CHECKS = 0;";
                        dropTablesQuery = "SELECT concat('DROP TABLE IF EXISTS ', table_name, ';') AS query FROM information_schema.tables WHERE table_schema = '" + this.dbName + "'";
                        enableForeignKeysCheckQuery = "SET FOREIGN_KEY_CHECKS = 1;";
                        return [4 /*yield*/, this.query(disableForeignKeysCheckQuery)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.query(dropTablesQuery)];
                    case 4:
                        dropQueries = _a.sent();
                        return [4 /*yield*/, Promise.all(dropQueries.map(function (query) { return _this.query(query["query"]); }))];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.query(enableForeignKeysCheckQuery)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.commitTransaction()];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 12];
                    case 8:
                        error_1 = _a.sent();
                        return [4 /*yield*/, this.rollbackTransaction()];
                    case 9:
                        _a.sent();
                        throw error_1;
                    case 10: return [4 /*yield*/, this.release()];
                    case 11:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Starts transaction.
     */
    MysqlQueryRunner.prototype.beginTransaction = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        if (this.databaseConnection.isTransactionActive)
                            throw new TransactionAlreadyStartedError_1.TransactionAlreadyStartedError();
                        this.databaseConnection.isTransactionActive = true;
                        return [4 /*yield*/, this.query("START TRANSACTION")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Commits transaction.
     */
    MysqlQueryRunner.prototype.commitTransaction = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        if (!this.databaseConnection.isTransactionActive)
                            throw new TransactionNotStartedError_1.TransactionNotStartedError();
                        return [4 /*yield*/, this.query("COMMIT")];
                    case 1:
                        _a.sent();
                        this.databaseConnection.isTransactionActive = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Rollbacks transaction.
     */
    MysqlQueryRunner.prototype.rollbackTransaction = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        if (!this.databaseConnection.isTransactionActive)
                            throw new TransactionNotStartedError_1.TransactionNotStartedError();
                        return [4 /*yield*/, this.query("ROLLBACK")];
                    case 1:
                        _a.sent();
                        this.databaseConnection.isTransactionActive = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Checks if transaction is in progress.
     */
    MysqlQueryRunner.prototype.isTransactionActive = function () {
        return this.databaseConnection.isTransactionActive;
    };
    /**
     * Executes a given SQL query.
     */
    MysqlQueryRunner.prototype.query = function (query, parameters) {
        var _this = this;
        if (this.isReleased)
            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
        return new Promise(function (ok, fail) {
            _this.logger.logQuery(query, parameters);
            _this.databaseConnection.connection.query(query, parameters, function (err, result) {
                if (err) {
                    _this.logger.logFailedQuery(query, parameters);
                    _this.logger.logQueryError(err);
                    return fail(err);
                }
                ok(result);
            });
        });
    };
    /**
     * Insert a new row with given values into given table.
     */
    MysqlQueryRunner.prototype.insert = function (tableName, keyValues, generatedColumn) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var keys, columns, values, parameters, sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        keys = Object.keys(keyValues);
                        columns = keys.map(function (key) { return _this.driver.escapeColumnName(key); }).join(", ");
                        values = keys.map(function (key) { return "?"; }).join(",");
                        parameters = keys.map(function (key) { return keyValues[key]; });
                        sql = "INSERT INTO " + this.driver.escapeTableName(tableName) + "(" + columns + ") VALUES (" + values + ")";
                        return [4 /*yield*/, this.query(sql, parameters)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, generatedColumn ? result.insertId : undefined];
                }
            });
        });
    };
    /**
     * Updates rows that match given conditions in the given table.
     */
    MysqlQueryRunner.prototype.update = function (tableName, valuesMap, conditions) {
        return __awaiter(this, void 0, void 0, function () {
            var updateValues, conditionString, sql, conditionParams, updateParams, allParameters;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        updateValues = this.parametrize(valuesMap).join(", ");
                        conditionString = this.parametrize(conditions).join(" AND ");
                        sql = "UPDATE " + this.driver.escapeTableName(tableName) + " SET " + updateValues + " " + (conditionString ? (" WHERE " + conditionString) : "");
                        conditionParams = Object.keys(conditions).map(function (key) { return conditions[key]; });
                        updateParams = Object.keys(valuesMap).map(function (key) { return valuesMap[key]; });
                        allParameters = updateParams.concat(conditionParams);
                        return [4 /*yield*/, this.query(sql, allParameters)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Deletes from the given table by a given conditions.
     */
    MysqlQueryRunner.prototype.delete = function (tableName, conditions, maybeParameters) {
        return __awaiter(this, void 0, void 0, function () {
            var conditionString, parameters, sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        conditionString = typeof conditions === "string" ? conditions : this.parametrize(conditions).join(" AND ");
                        parameters = conditions instanceof Object ? Object.keys(conditions).map(function (key) { return conditions[key]; }) : maybeParameters;
                        sql = "DELETE FROM " + this.driver.escapeTableName(tableName) + " WHERE " + conditionString;
                        return [4 /*yield*/, this.query(sql, parameters)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Inserts rows into the closure table.
     */
    MysqlQueryRunner.prototype.insertIntoClosureTable = function (tableName, newEntityId, parentId, hasLevel) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        sql = "";
                        if (hasLevel) {
                            sql = "INSERT INTO " + this.driver.escapeTableName(tableName) + "(ancestor, descendant, level) " +
                                ("SELECT ancestor, " + newEntityId + ", level + 1 FROM " + this.driver.escapeTableName(tableName) + " WHERE descendant = " + parentId + " ") +
                                ("UNION ALL SELECT " + newEntityId + ", " + newEntityId + ", 1");
                        }
                        else {
                            sql = "INSERT INTO " + this.driver.escapeTableName(tableName) + "(ancestor, descendant) " +
                                ("SELECT ancestor, " + newEntityId + " FROM " + this.driver.escapeTableName(tableName) + " WHERE descendant = " + parentId + " ") +
                                ("UNION ALL SELECT " + newEntityId + ", " + newEntityId);
                        }
                        return [4 /*yield*/, this.query(sql)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.query("SELECT MAX(level) as level FROM " + this.driver.escapeTableName(tableName) + " WHERE descendant = " + parentId)];
                    case 2:
                        results = _a.sent();
                        return [2 /*return*/, results && results[0] && results[0]["level"] ? parseInt(results[0]["level"]) + 1 : 1];
                }
            });
        });
    };
    /**
     * Loads given table's data from the database.
     */
    MysqlQueryRunner.prototype.loadTableSchema = function (tableName) {
        return __awaiter(this, void 0, void 0, function () {
            var tableSchemas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadTableSchemas([tableName])];
                    case 1:
                        tableSchemas = _a.sent();
                        return [2 /*return*/, tableSchemas.length > 0 ? tableSchemas[0] : undefined];
                }
            });
        });
    };
    /**
     * Loads all tables (with given names) from the database and creates a TableSchema from them.
     */
    MysqlQueryRunner.prototype.loadTableSchemas = function (tableNames) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var tableNamesString, tablesSql, columnsSql, indicesSql, foreignKeysSql, _a, dbTables, dbColumns, dbIndices, dbForeignKeys;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        // if no tables given then no need to proceed
                        if (!tableNames || !tableNames.length)
                            return [2 /*return*/, []];
                        tableNamesString = tableNames.map(function (tableName) { return "'" + tableName + "'"; }).join(", ");
                        tablesSql = "SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '" + this.dbName + "' AND TABLE_NAME IN (" + tableNamesString + ")";
                        columnsSql = "SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = '" + this.dbName + "'";
                        indicesSql = "SELECT * FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_SCHEMA = '" + this.dbName + "' AND INDEX_NAME != 'PRIMARY'";
                        foreignKeysSql = "SELECT * FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = '" + this.dbName + "' AND REFERENCED_COLUMN_NAME IS NOT NULL";
                        return [4 /*yield*/, Promise.all([
                                this.query(tablesSql),
                                this.query(columnsSql),
                                this.query(indicesSql),
                                this.query(foreignKeysSql)
                            ])];
                    case 1:
                        _a = _b.sent(), dbTables = _a[0], dbColumns = _a[1], dbIndices = _a[2], dbForeignKeys = _a[3];
                        // if tables were not found in the db, no need to proceed
                        if (!dbTables.length)
                            return [2 /*return*/, []];
                        // create table schemas for loaded tables
                        return [2 /*return*/, Promise.all(dbTables.map(function (dbTable) { return __awaiter(_this, void 0, void 0, function () {
                                var tableSchema, primaryKeys;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            tableSchema = new TableSchema_1.TableSchema(dbTable["TABLE_NAME"]);
                                            return [4 /*yield*/, this.query("SHOW INDEX FROM `" + dbTable["TABLE_NAME"] + "` WHERE Key_name = 'PRIMARY'")];
                                        case 1:
                                            primaryKeys = _a.sent();
                                            // create column schemas from the loaded columns
                                            tableSchema.columns = dbColumns
                                                .filter(function (dbColumn) { return dbColumn["TABLE_NAME"] === tableSchema.name; })
                                                .map(function (dbColumn) {
                                                var columnSchema = new ColumnSchema_1.ColumnSchema();
                                                columnSchema.name = dbColumn["COLUMN_NAME"];
                                                columnSchema.type = dbColumn["COLUMN_TYPE"].toLowerCase();
                                                columnSchema.default = dbColumn["COLUMN_DEFAULT"] !== null && dbColumn["COLUMN_DEFAULT"] !== undefined ? dbColumn["COLUMN_DEFAULT"] : undefined;
                                                columnSchema.isNullable = dbColumn["IS_NULLABLE"] === "YES";
                                                columnSchema.isPrimary = dbColumn["COLUMN_KEY"].indexOf("PRI") !== -1;
                                                columnSchema.isUnique = dbColumn["COLUMN_KEY"].indexOf("UNI") !== -1;
                                                columnSchema.isGenerated = dbColumn["EXTRA"].indexOf("auto_increment") !== -1;
                                                columnSchema.comment = dbColumn["COLUMN_COMMENT"];
                                                return columnSchema;
                                            });
                                            // create primary keys
                                            tableSchema.primaryKeys = primaryKeys.map(function (primaryKey) {
                                                return new PrimaryKeySchema_1.PrimaryKeySchema(primaryKey["Key_name"], primaryKey["Column_name"]);
                                            });
                                            // create foreign key schemas from the loaded indices
                                            tableSchema.foreignKeys = dbForeignKeys
                                                .filter(function (dbForeignKey) { return dbForeignKey["TABLE_NAME"] === tableSchema.name; })
                                                .map(function (dbForeignKey) { return new ForeignKeySchema_1.ForeignKeySchema(dbForeignKey["CONSTRAINT_NAME"], [], [], "", ""); }); // todo: fix missing params
                                            // create index schemas from the loaded indices
                                            tableSchema.indices = dbIndices
                                                .filter(function (dbIndex) {
                                                return dbIndex["TABLE_NAME"] === tableSchema.name &&
                                                    (!tableSchema.foreignKeys.find(function (foreignKey) { return foreignKey.name === dbIndex["INDEX_NAME"]; })) &&
                                                    (!tableSchema.primaryKeys.find(function (primaryKey) { return primaryKey.name === dbIndex["INDEX_NAME"]; }));
                                            })
                                                .map(function (dbIndex) { return dbIndex["INDEX_NAME"]; })
                                                .filter(function (value, index, self) { return self.indexOf(value) === index; }) // unqiue
                                                .map(function (dbIndexName) {
                                                var currentDbIndices = dbIndices.filter(function (dbIndex) { return dbIndex["TABLE_NAME"] === tableSchema.name && dbIndex["INDEX_NAME"] === dbIndexName; });
                                                var columnNames = currentDbIndices.map(function (dbIndex) { return dbIndex["COLUMN_NAME"]; });
                                                // find a special index - unique index and
                                                if (currentDbIndices.length === 1 && currentDbIndices[0]["NON_UNIQUE"] === 0) {
                                                    var column = tableSchema.columns.find(function (column) { return column.name === currentDbIndices[0]["INDEX_NAME"] && column.name === currentDbIndices[0]["COLUMN_NAME"]; });
                                                    if (column) {
                                                        column.isUnique = true;
                                                        return;
                                                    }
                                                }
                                                return new IndexSchema_1.IndexSchema(dbTable["TABLE_NAME"], dbIndexName, columnNames, false /* todo: uniqueness */);
                                            })
                                                .filter(function (index) { return !!index; }); // remove empty returns
                                            return [2 /*return*/, tableSchema];
                                    }
                                });
                            }); }))];
                }
            });
        });
    };
    /**
     * Checks if table with the given name exist in the database.
     */
    MysqlQueryRunner.prototype.hasTable = function (tableName) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = '" + this.dbName + "' AND TABLE_NAME = '" + tableName + "'";
                        return [4 /*yield*/, this.query(sql)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.length ? true : false];
                }
            });
        });
    };
    /**
     * Creates a new table from the given table schema and column schemas inside it.
     */
    MysqlQueryRunner.prototype.createTable = function (table) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var columnDefinitions, sql, primaryKeyColumns;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        columnDefinitions = table.columns.map(function (column) { return _this.buildCreateColumnSql(column, false); }).join(", ");
                        sql = "CREATE TABLE `" + table.name + "` (" + columnDefinitions;
                        primaryKeyColumns = table.columns.filter(function (column) { return column.isPrimary && !column.isGenerated; });
                        if (primaryKeyColumns.length > 0)
                            sql += ", PRIMARY KEY(" + primaryKeyColumns.map(function (column) { return "`" + column.name + "`"; }).join(", ") + ")";
                        sql += ") ENGINE=InnoDB;"; // todo: remove engine from here
                        return [4 /*yield*/, this.query(sql)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Checks if column with the given name exist in the given table.
     */
    MysqlQueryRunner.prototype.hasColumn = function (tableName, columnName) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = '" + this.dbName + "' AND TABLE_NAME = '" + tableName + "' AND COLUMN_NAME = '" + columnName + "'";
                        return [4 /*yield*/, this.query(sql)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.length ? true : false];
                }
            });
        });
    };
    /**
     * Creates a new column from the column schema in the table.
     */
    MysqlQueryRunner.prototype.addColumn = function (tableSchemaOrName, column) {
        return __awaiter(this, void 0, void 0, function () {
            var tableName, sql;
            return __generator(this, function (_a) {
                if (this.isReleased)
                    throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                tableName = tableSchemaOrName instanceof TableSchema_1.TableSchema ? tableSchemaOrName.name : tableSchemaOrName;
                sql = "ALTER TABLE `" + tableName + "` ADD " + this.buildCreateColumnSql(column, false);
                return [2 /*return*/, this.query(sql)];
            });
        });
    };
    /**
     * Creates a new columns from the column schema in the table.
     */
    MysqlQueryRunner.prototype.addColumns = function (tableSchemaOrName, columns) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var queries;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        queries = columns.map(function (column) { return _this.addColumn(tableSchemaOrName, column); });
                        return [4 /*yield*/, Promise.all(queries)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Renames column in the given table.
     */
    MysqlQueryRunner.prototype.renameColumn = function (tableSchemaOrName, oldColumnSchemaOrName, newColumnSchemaOrName) {
        return __awaiter(this, void 0, void 0, function () {
            var tableSchema, oldColumn, newColumn;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tableSchema = undefined;
                        if (!(tableSchemaOrName instanceof TableSchema_1.TableSchema)) return [3 /*break*/, 1];
                        tableSchema = tableSchemaOrName;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.loadTableSchema(tableSchemaOrName)];
                    case 2:
                        tableSchema = _a.sent();
                        _a.label = 3;
                    case 3:
                        if (!tableSchema)
                            throw new Error("Table " + tableSchemaOrName + " was not found.");
                        oldColumn = undefined;
                        if (oldColumnSchemaOrName instanceof ColumnSchema_1.ColumnSchema) {
                            oldColumn = oldColumnSchemaOrName;
                        }
                        else {
                            oldColumn = tableSchema.columns.find(function (column) { return column.name === oldColumnSchemaOrName; });
                        }
                        if (!oldColumn)
                            throw new Error("Column \"" + oldColumnSchemaOrName + "\" was not found in the \"" + tableSchemaOrName + "\" table.");
                        newColumn = undefined;
                        if (newColumnSchemaOrName instanceof ColumnSchema_1.ColumnSchema) {
                            newColumn = newColumnSchemaOrName;
                        }
                        else {
                            newColumn = oldColumn.clone();
                            newColumn.name = newColumnSchemaOrName;
                        }
                        return [2 /*return*/, this.changeColumn(tableSchema, oldColumn, newColumn)];
                }
            });
        });
    };
    /**
     * Changes a column in the table.
     */
    MysqlQueryRunner.prototype.changeColumn = function (tableSchemaOrName, oldColumnSchemaOrName, newColumn) {
        return __awaiter(this, void 0, void 0, function () {
            var tableSchema, oldColumn;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        tableSchema = undefined;
                        if (!(tableSchemaOrName instanceof TableSchema_1.TableSchema)) return [3 /*break*/, 1];
                        tableSchema = tableSchemaOrName;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.loadTableSchema(tableSchemaOrName)];
                    case 2:
                        tableSchema = _a.sent();
                        _a.label = 3;
                    case 3:
                        if (!tableSchema)
                            throw new Error("Table " + tableSchemaOrName + " was not found.");
                        oldColumn = undefined;
                        if (oldColumnSchemaOrName instanceof ColumnSchema_1.ColumnSchema) {
                            oldColumn = oldColumnSchemaOrName;
                        }
                        else {
                            oldColumn = tableSchema.columns.find(function (column) { return column.name === oldColumnSchemaOrName; });
                        }
                        if (!oldColumn)
                            throw new Error("Column \"" + oldColumnSchemaOrName + "\" was not found in the \"" + tableSchemaOrName + "\" table.");
                        if (!(newColumn.isUnique === false && oldColumn.isUnique === true)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.query("ALTER TABLE `" + tableSchema.name + "` DROP INDEX `" + oldColumn.name + "`")];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/, this.query("ALTER TABLE `" + tableSchema.name + "` CHANGE `" + oldColumn.name + "` " + this.buildCreateColumnSql(newColumn, oldColumn.isPrimary))];
                }
            });
        });
    };
    /**
     * Changes a column in the table.
     */
    MysqlQueryRunner.prototype.changeColumns = function (tableSchema, changedColumns) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var updatePromises;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        updatePromises = changedColumns.map(function (changedColumn) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, this.changeColumn(tableSchema, changedColumn.oldColumn, changedColumn.newColumn)];
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(updatePromises)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Drops column in the table.
     */
    MysqlQueryRunner.prototype.dropColumn = function (tableSchemaOrName, columnSchemaOrName) {
        return __awaiter(this, void 0, void 0, function () {
            var tableName, columnName;
            return __generator(this, function (_a) {
                tableName = tableSchemaOrName instanceof TableSchema_1.TableSchema ? tableSchemaOrName.name : tableSchemaOrName;
                columnName = columnSchemaOrName instanceof ColumnSchema_1.ColumnSchema ? columnSchemaOrName.name : columnSchemaOrName;
                return [2 /*return*/, this.query("ALTER TABLE `" + tableName + "` DROP `" + columnName + "`")];
            });
        });
    };
    /**
     * Drops the columns in the table.
     */
    MysqlQueryRunner.prototype.dropColumns = function (tableSchemaOrName, columnSchemasOrNames) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var dropPromises;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        dropPromises = columnSchemasOrNames.map(function (column) { return _this.dropColumn(tableSchemaOrName, column); });
                        return [4 /*yield*/, Promise.all(dropPromises)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Updates table's primary keys.
     */
    MysqlQueryRunner.prototype.updatePrimaryKeys = function (tableSchema) {
        return __awaiter(this, void 0, void 0, function () {
            var primaryColumnNames;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        if (!!tableSchema.hasGeneratedColumn) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.query("ALTER TABLE " + tableSchema.name + " DROP PRIMARY KEY")];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        primaryColumnNames = tableSchema.columns.filter(function (column) { return column.isPrimary && !column.isGenerated; }).map(function (column) { return "`" + column.name + "`"; });
                        if (!(primaryColumnNames.length > 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.query("ALTER TABLE " + tableSchema.name + " ADD PRIMARY KEY (" + primaryColumnNames.join(", ") + ")")];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Creates a new foreign key.
     */
    MysqlQueryRunner.prototype.createForeignKey = function (tableSchemaOrName, foreignKey) {
        return __awaiter(this, void 0, void 0, function () {
            var tableName, columnNames, referencedColumnNames, sql;
            return __generator(this, function (_a) {
                if (this.isReleased)
                    throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                tableName = tableSchemaOrName instanceof TableSchema_1.TableSchema ? tableSchemaOrName.name : tableSchemaOrName;
                columnNames = foreignKey.columnNames.map(function (column) { return "`" + column + "`"; }).join(", ");
                referencedColumnNames = foreignKey.referencedColumnNames.map(function (column) { return "`" + column + "`"; }).join(",");
                sql = "ALTER TABLE " + tableName + " ADD CONSTRAINT `" + foreignKey.name + "` " +
                    ("FOREIGN KEY (" + columnNames + ") ") +
                    ("REFERENCES `" + foreignKey.referencedTableName + "`(" + referencedColumnNames + ")");
                if (foreignKey.onDelete)
                    sql += " ON DELETE " + foreignKey.onDelete;
                return [2 /*return*/, this.query(sql)];
            });
        });
    };
    /**
     * Creates a new foreign keys.
     */
    MysqlQueryRunner.prototype.createForeignKeys = function (tableSchemaOrName, foreignKeys) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var promises;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        promises = foreignKeys.map(function (foreignKey) { return _this.createForeignKey(tableSchemaOrName, foreignKey); });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Drops a foreign key from the table.
     */
    MysqlQueryRunner.prototype.dropForeignKey = function (tableSchemaOrName, foreignKey) {
        return __awaiter(this, void 0, void 0, function () {
            var tableName;
            return __generator(this, function (_a) {
                if (this.isReleased)
                    throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                tableName = tableSchemaOrName instanceof TableSchema_1.TableSchema ? tableSchemaOrName.name : tableSchemaOrName;
                return [2 /*return*/, this.query("ALTER TABLE `" + tableName + "` DROP FOREIGN KEY `" + foreignKey.name + "`")];
            });
        });
    };
    /**
     * Drops a foreign keys from the table.
     */
    MysqlQueryRunner.prototype.dropForeignKeys = function (tableSchemaOrName, foreignKeys) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var promises;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        promises = foreignKeys.map(function (foreignKey) { return _this.dropForeignKey(tableSchemaOrName, foreignKey); });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Creates a new index.
     */
    MysqlQueryRunner.prototype.createIndex = function (tableName, index) {
        return __awaiter(this, void 0, void 0, function () {
            var columns, sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        columns = index.columnNames.map(function (columnName) { return "`" + columnName + "`"; }).join(", ");
                        sql = "CREATE " + (index.isUnique ? "UNIQUE " : "") + "INDEX `" + index.name + "` ON `" + tableName + "`(" + columns + ")";
                        return [4 /*yield*/, this.query(sql)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Drops an index from the table.
     */
    MysqlQueryRunner.prototype.dropIndex = function (tableName, indexName) {
        return __awaiter(this, void 0, void 0, function () {
            var sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        sql = "ALTER TABLE `" + tableName + "` DROP INDEX `" + indexName + "`";
                        return [4 /*yield*/, this.query(sql)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Creates a database type from a given column metadata.
     */
    MysqlQueryRunner.prototype.normalizeType = function (typeOptions) {
        switch (typeOptions.type) {
            case "string":
                return "varchar(" + (typeOptions.length ? typeOptions.length : 255) + ")";
            case "text":
                return "text";
            case "boolean":
                return "tinyint(1)";
            case "integer":
            case "int":
                return "int(" + (typeOptions.length ? typeOptions.length : 11) + ")";
            case "smallint":
                return "smallint(" + (typeOptions.length ? typeOptions.length : 11) + ")";
            case "bigint":
                return "bigint(" + (typeOptions.length ? typeOptions.length : 11) + ")";
            case "float":
                return "float";
            case "double":
            case "number":
                return "double";
            case "decimal":
                if (typeOptions.precision && typeOptions.scale) {
                    return "decimal(" + typeOptions.precision + "," + typeOptions.scale + ")";
                }
                else if (typeOptions.scale) {
                    return "decimal(" + typeOptions.scale + ")";
                }
                else if (typeOptions.precision) {
                    return "decimal(" + typeOptions.precision + ")";
                }
                else {
                    return "decimal";
                }
            case "date":
                return "date";
            case "time":
                return "time";
            case "datetime":
                return "datetime";
            case "json":
                return "text";
            case "simple_array":
                return typeOptions.length ? "varchar(" + typeOptions.length + ")" : "text";
        }
        throw new DataTypeNotSupportedByDriverError_1.DataTypeNotSupportedByDriverError(typeOptions.type, "MySQL/MariaDB");
    };
    /**
     * Checks if "DEFAULT" values in the column metadata and in the database schema are equal.
     */
    MysqlQueryRunner.prototype.compareDefaultValues = function (columnMetadataValue, databaseValue) {
        if (typeof columnMetadataValue === "number")
            return columnMetadataValue === parseInt(databaseValue);
        if (typeof columnMetadataValue === "boolean")
            return columnMetadataValue === (!!databaseValue || databaseValue === "false");
        if (typeof columnMetadataValue === "function")
            return columnMetadataValue() === databaseValue;
        return columnMetadataValue === databaseValue;
    };
    /**
     * Truncates table.
     */
    MysqlQueryRunner.prototype.truncate = function (tableName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.query("TRUNCATE TABLE " + this.driver.escapeTableName(tableName))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(MysqlQueryRunner.prototype, "dbName", {
        // -------------------------------------------------------------------------
        // Protected Methods
        // -------------------------------------------------------------------------
        /**
         * Database name shortcut.
         */
        get: function () {
            return this.driver.options.database;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Parametrizes given object of values. Used to create column=value queries.
     */
    MysqlQueryRunner.prototype.parametrize = function (objectLiteral) {
        var _this = this;
        return Object.keys(objectLiteral).map(function (key) { return _this.driver.escapeColumnName(key) + "=?"; });
    };
    /**
     * Builds a query for create column.
     */
    MysqlQueryRunner.prototype.buildCreateColumnSql = function (column, skipPrimary) {
        var c = "`" + column.name + "` " + column.type;
        if (column.isNullable !== true)
            c += " NOT NULL";
        if (column.isUnique === true)
            c += " UNIQUE";
        if (column.isGenerated && column.isPrimary && !skipPrimary)
            c += " PRIMARY KEY";
        if (column.isGenerated === true)
            c += " AUTO_INCREMENT";
        if (column.comment)
            c += " COMMENT '" + column.comment + "'";
        if (column.default !== undefined && column.default !== null) {
            if (typeof column.default === "number") {
                c += " DEFAULT " + column.default + "";
            }
            else if (typeof column.default === "boolean") {
                c += " DEFAULT " + (column.default === true ? "TRUE" : "FALSE") + "";
            }
            else if (typeof column.default === "function") {
                c += " DEFAULT " + column.default() + "";
            }
            else if (typeof column.default === "string") {
                c += " DEFAULT '" + column.default + "'";
            }
            else {
                c += " DEFAULT " + column.default + "";
            }
        }
        return c;
    };
    return MysqlQueryRunner;
}());
exports.MysqlQueryRunner = MysqlQueryRunner;

//# sourceMappingURL=MysqlQueryRunner.js.map
