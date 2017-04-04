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
var ColumnMetadata_1 = require("../../metadata/ColumnMetadata");
var TableSchema_1 = require("../../schema-builder/schema/TableSchema");
var IndexSchema_1 = require("../../schema-builder/schema/IndexSchema");
var ForeignKeySchema_1 = require("../../schema-builder/schema/ForeignKeySchema");
var PrimaryKeySchema_1 = require("../../schema-builder/schema/PrimaryKeySchema");
var QueryRunnerAlreadyReleasedError_1 = require("../../query-runner/error/QueryRunnerAlreadyReleasedError");
/**
 * Runs queries on a single sqlite database connection.
 *
 * Does not support compose primary keys with autoincrement field.
 * todo: need to throw exception for this case.
 */
var SqliteQueryRunner = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function SqliteQueryRunner(databaseConnection, driver, logger) {
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
     */
    SqliteQueryRunner.prototype.release = function () {
        if (this.databaseConnection.releaseCallback) {
            this.isReleased = true;
            return this.databaseConnection.releaseCallback();
        }
        return Promise.resolve();
    };
    /**
     * Removes all tables from the currently connected database.
     */
    SqliteQueryRunner.prototype.clearDatabase = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var selectDropsQuery, dropQueries, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        return [4 /*yield*/, this.query("PRAGMA foreign_keys = OFF;")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.beginTransaction()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 7, 9, 12]);
                        selectDropsQuery = "select 'drop table ' || name || ';' as query from sqlite_master where type = 'table' and name != 'sqlite_sequence'";
                        return [4 /*yield*/, this.query(selectDropsQuery)];
                    case 4:
                        dropQueries = _a.sent();
                        return [4 /*yield*/, Promise.all(dropQueries.map(function (q) { return _this.query(q["query"]); }))];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.commitTransaction()];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 12];
                    case 7:
                        error_1 = _a.sent();
                        return [4 /*yield*/, this.rollbackTransaction()];
                    case 8:
                        _a.sent();
                        throw error_1;
                    case 9: return [4 /*yield*/, this.release()];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, this.query("PRAGMA foreign_keys = ON;")];
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
    SqliteQueryRunner.prototype.beginTransaction = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        if (this.databaseConnection.isTransactionActive)
                            throw new TransactionAlreadyStartedError_1.TransactionAlreadyStartedError();
                        this.databaseConnection.isTransactionActive = true;
                        return [4 /*yield*/, this.query("BEGIN TRANSACTION")];
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
    SqliteQueryRunner.prototype.commitTransaction = function () {
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
    SqliteQueryRunner.prototype.rollbackTransaction = function () {
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
    SqliteQueryRunner.prototype.isTransactionActive = function () {
        return this.databaseConnection.isTransactionActive;
    };
    /**
     * Executes a given SQL query.
     */
    SqliteQueryRunner.prototype.query = function (query, parameters) {
        var _this = this;
        if (this.isReleased)
            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
        return new Promise(function (ok, fail) {
            _this.logger.logQuery(query, parameters);
            _this.databaseConnection.connection.all(query, parameters, function (err, result) {
                if (err) {
                    _this.logger.logFailedQuery(query, parameters);
                    _this.logger.logQueryError(err);
                    fail(err);
                }
                else {
                    ok(result);
                }
            });
        });
    };
    /**
     * Insert a new row into given table.
     */
    SqliteQueryRunner.prototype.insert = function (tableName, keyValues, generatedColumn) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var keys, columns, values, sql, parameters;
            return __generator(this, function (_a) {
                if (this.isReleased)
                    throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                keys = Object.keys(keyValues);
                columns = keys.map(function (key) { return _this.driver.escapeColumnName(key); }).join(", ");
                values = keys.map(function (key, index) { return "$" + (index + 1); }).join(",");
                sql = columns.length > 0 ? ("INSERT INTO " + this.driver.escapeTableName(tableName) + "(" + columns + ") VALUES (" + values + ")") : "INSERT INTO " + this.driver.escapeTableName(tableName) + " DEFAULT VALUES";
                parameters = keys.map(function (key) { return keyValues[key]; });
                return [2 /*return*/, new Promise(function (ok, fail) {
                        _this.logger.logQuery(sql, parameters);
                        var __this = _this;
                        _this.databaseConnection.connection.run(sql, parameters, function (err) {
                            if (err) {
                                __this.logger.logFailedQuery(sql, parameters);
                                __this.logger.logQueryError(err);
                                fail(err);
                            }
                            else {
                                if (generatedColumn)
                                    return ok(this["lastID"]);
                                ok();
                            }
                        });
                    })];
            });
        });
    };
    /**
     * Updates rows that match given conditions in the given table.
     */
    SqliteQueryRunner.prototype.update = function (tableName, valuesMap, conditions) {
        return __awaiter(this, void 0, void 0, function () {
            var updateValues, conditionString, query, updateParams, conditionParams, allParameters;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        updateValues = this.parametrize(valuesMap).join(", ");
                        conditionString = this.parametrize(conditions, Object.keys(valuesMap).length).join(" AND ");
                        query = "UPDATE " + this.driver.escapeTableName(tableName) + " SET " + updateValues + " " + (conditionString ? (" WHERE " + conditionString) : "");
                        updateParams = Object.keys(valuesMap).map(function (key) { return valuesMap[key]; });
                        conditionParams = Object.keys(conditions).map(function (key) { return conditions[key]; });
                        allParameters = updateParams.concat(conditionParams);
                        return [4 /*yield*/, this.query(query, allParameters)];
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
    SqliteQueryRunner.prototype.delete = function (tableName, conditions, maybeParameters) {
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
     * Inserts rows into closure table.
     */
    SqliteQueryRunner.prototype.insertIntoClosureTable = function (tableName, newEntityId, parentId, hasLevel) {
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
                        return [4 /*yield*/, this.query("SELECT MAX(level) as level FROM " + tableName + " WHERE descendant = " + parentId)];
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
    SqliteQueryRunner.prototype.loadTableSchema = function (tableName) {
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
    SqliteQueryRunner.prototype.loadTableSchemas = function (tableNames) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var tableNamesString, dbTables;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        // if no tables given then no need to proceed
                        if (!tableNames || !tableNames.length)
                            return [2 /*return*/, []];
                        tableNamesString = tableNames.map(function (tableName) { return "'" + tableName + "'"; }).join(", ");
                        return [4 /*yield*/, this.query("SELECT * FROM sqlite_master WHERE type = 'table' AND name IN (" + tableNamesString + ")")];
                    case 1:
                        dbTables = _a.sent();
                        // if tables were not found in the db, no need to proceed
                        if (!dbTables || !dbTables.length)
                            return [2 /*return*/, []];
                        // create table schemas for loaded tables
                        return [2 /*return*/, Promise.all(dbTables.map(function (dbTable) { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                var tableSchema, _a, dbColumns, dbIndices, dbForeignKeys, autoIncrementColumnName, tableSql, comma, bracket, indicesPromises, indices;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            tableSchema = new TableSchema_1.TableSchema(dbTable["name"]);
                                            return [4 /*yield*/, Promise.all([
                                                    this.query("PRAGMA table_info(\"" + dbTable["name"] + "\")"),
                                                    this.query("PRAGMA index_list(\"" + dbTable["name"] + "\")"),
                                                    this.query("PRAGMA foreign_key_list(\"" + dbTable["name"] + "\")"),
                                                ])];
                                        case 1:
                                            _a = _b.sent(), dbColumns = _a[0], dbIndices = _a[1], dbForeignKeys = _a[2];
                                            autoIncrementColumnName = undefined;
                                            tableSql = dbTable["sql"];
                                            if (tableSql.indexOf("AUTOINCREMENT") !== -1) {
                                                autoIncrementColumnName = tableSql.substr(0, tableSql.indexOf("AUTOINCREMENT"));
                                                comma = autoIncrementColumnName.lastIndexOf(",");
                                                bracket = autoIncrementColumnName.lastIndexOf("(");
                                                if (comma !== -1) {
                                                    autoIncrementColumnName = autoIncrementColumnName.substr(comma);
                                                    autoIncrementColumnName = autoIncrementColumnName.substr(0, autoIncrementColumnName.lastIndexOf("\""));
                                                    autoIncrementColumnName = autoIncrementColumnName.substr(autoIncrementColumnName.indexOf("\"") + 1);
                                                }
                                                else if (bracket !== -1) {
                                                    autoIncrementColumnName = autoIncrementColumnName.substr(bracket);
                                                    autoIncrementColumnName = autoIncrementColumnName.substr(0, autoIncrementColumnName.lastIndexOf("\""));
                                                    autoIncrementColumnName = autoIncrementColumnName.substr(autoIncrementColumnName.indexOf("\"") + 1);
                                                }
                                            }
                                            // create column schemas from the loaded columns
                                            tableSchema.columns = dbColumns.map(function (dbColumn) {
                                                var columnSchema = new ColumnSchema_1.ColumnSchema();
                                                columnSchema.name = dbColumn["name"];
                                                columnSchema.type = dbColumn["type"].toLowerCase();
                                                columnSchema.default = dbColumn["dflt_value"] !== null && dbColumn["dflt_value"] !== undefined ? dbColumn["dflt_value"] : undefined;
                                                columnSchema.isNullable = dbColumn["notnull"] === 0;
                                                columnSchema.isPrimary = dbColumn["pk"] === 1;
                                                columnSchema.comment = ""; // todo later
                                                columnSchema.isGenerated = autoIncrementColumnName === dbColumn["name"];
                                                var columnForeignKeys = dbForeignKeys
                                                    .filter(function (foreignKey) { return foreignKey["from"] === dbColumn["name"]; })
                                                    .map(function (foreignKey) {
                                                    var keyName = _this.driver.namingStrategy.foreignKeyName(dbTable["name"], [foreignKey["from"]], foreignKey["table"], [foreignKey["to"]]);
                                                    return new ForeignKeySchema_1.ForeignKeySchema(keyName, [foreignKey["from"]], [foreignKey["to"]], foreignKey["table"], foreignKey["on_delete"]); // todo: how sqlite return from and to when they are arrays? (multiple column foreign keys)
                                                });
                                                tableSchema.addForeignKeys(columnForeignKeys);
                                                return columnSchema;
                                            });
                                            // create primary key schema
                                            return [4 /*yield*/, Promise.all(dbIndices
                                                    .filter(function (index) { return index["origin"] === "pk"; })
                                                    .map(function (index) { return __awaiter(_this, void 0, void 0, function () {
                                                    var indexInfos, indexColumns;
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0: return [4 /*yield*/, this.query("PRAGMA index_info(\"" + index["name"] + "\")")];
                                                            case 1:
                                                                indexInfos = _a.sent();
                                                                indexColumns = indexInfos.map(function (indexInfo) { return indexInfo["name"]; });
                                                                indexColumns.forEach(function (indexColumn) {
                                                                    tableSchema.primaryKeys.push(new PrimaryKeySchema_1.PrimaryKeySchema(index["name"], indexColumn));
                                                                });
                                                                return [2 /*return*/];
                                                        }
                                                    });
                                                }); }))];
                                        case 2:
                                            // create primary key schema
                                            _b.sent();
                                            indicesPromises = dbIndices
                                                .filter(function (dbIndex) {
                                                return dbIndex["origin"] !== "pk" &&
                                                    (!tableSchema.foreignKeys.find(function (foreignKey) { return foreignKey.name === dbIndex["name"]; })) &&
                                                    (!tableSchema.primaryKeys.find(function (primaryKey) { return primaryKey.name === dbIndex["name"]; }));
                                            })
                                                .map(function (dbIndex) { return dbIndex["name"]; })
                                                .filter(function (value, index, self) { return self.indexOf(value) === index; }) // unqiue
                                                .map(function (dbIndexName) { return __awaiter(_this, void 0, void 0, function () {
                                                var dbIndex, indexInfos, indexColumns;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            dbIndex = dbIndices.find(function (dbIndex) { return dbIndex["name"] === dbIndexName; });
                                                            return [4 /*yield*/, this.query("PRAGMA index_info(\"" + dbIndex["name"] + "\")")];
                                                        case 1:
                                                            indexInfos = _a.sent();
                                                            indexColumns = indexInfos.map(function (indexInfo) { return indexInfo["name"]; });
                                                            // check if db index is generated by sqlite itself and has special use case
                                                            if (dbIndex["name"].substr(0, "sqlite_autoindex".length) === "sqlite_autoindex") {
                                                                if (dbIndex["unique"] === 1) {
                                                                    // so we find and update the column
                                                                    indexColumns.forEach(function (columnName) {
                                                                        var column = tableSchema.columns.find(function (column) { return column.name === columnName; });
                                                                        if (column)
                                                                            column.isUnique = true;
                                                                    });
                                                                }
                                                                return [2 /*return*/, Promise.resolve(undefined)];
                                                            }
                                                            else {
                                                                return [2 /*return*/, new IndexSchema_1.IndexSchema(dbTable["name"], dbIndex["name"], indexColumns, dbIndex["unique"] === "1")];
                                                            }
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            }); });
                                            return [4 /*yield*/, Promise.all(indicesPromises)];
                                        case 3:
                                            indices = _b.sent();
                                            tableSchema.indices = indices.filter(function (index) { return !!index; });
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
    SqliteQueryRunner.prototype.hasTable = function (tableName) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "SELECT * FROM sqlite_master WHERE type = 'table' AND name = '" + tableName + "'";
                        return [4 /*yield*/, this.query(sql)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.length ? true : false];
                }
            });
        });
    };
    /**
     * Creates a new table from the given table metadata and column metadatas.
     */
    SqliteQueryRunner.prototype.createTable = function (table) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var columnDefinitions, sql, primaryKeyColumns;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        columnDefinitions = table.columns.map(function (column) { return _this.buildCreateColumnSql(column); }).join(", ");
                        sql = "CREATE TABLE \"" + table.name + "\" (" + columnDefinitions;
                        primaryKeyColumns = table.columns.filter(function (column) { return column.isPrimary && !column.isGenerated; });
                        if (primaryKeyColumns.length > 0)
                            sql += ", PRIMARY KEY(" + primaryKeyColumns.map(function (column) { return "" + column.name; }).join(", ") + ")"; // for some reason column escaping here generates a wrong schema
                        sql += ")";
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
    SqliteQueryRunner.prototype.hasColumn = function (tableName, columnName) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, columns;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "PRAGMA table_info(\"" + tableName + "\")";
                        return [4 /*yield*/, this.query(sql)];
                    case 1:
                        columns = _a.sent();
                        return [2 /*return*/, !!columns.find(function (column) { return column["name"] === columnName; })];
                }
            });
        });
    };
    /**
     * Creates a new column from the column schema in the table.
     */
    SqliteQueryRunner.prototype.addColumn = function (tableSchemaOrName, column) {
        return __awaiter(this, void 0, void 0, function () {
            var tableSchema, newTableSchema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        return [4 /*yield*/, this.getTableSchema(tableSchemaOrName)];
                    case 1:
                        tableSchema = _a.sent();
                        newTableSchema = tableSchema.clone();
                        newTableSchema.addColumns([column]);
                        return [4 /*yield*/, this.recreateTable(newTableSchema, tableSchema)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Creates a new columns from the column schema in the table.
     */
    SqliteQueryRunner.prototype.addColumns = function (tableSchemaOrName, columns) {
        return __awaiter(this, void 0, void 0, function () {
            var tableSchema, newTableSchema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        return [4 /*yield*/, this.getTableSchema(tableSchemaOrName)];
                    case 1:
                        tableSchema = _a.sent();
                        newTableSchema = tableSchema.clone();
                        newTableSchema.addColumns(columns);
                        return [4 /*yield*/, this.recreateTable(newTableSchema, tableSchema)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Renames column in the given table.
     */
    SqliteQueryRunner.prototype.renameColumn = function (tableSchemaOrName, oldColumnSchemaOrName, newColumnSchemaOrName) {
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
    SqliteQueryRunner.prototype.changeColumn = function (tableSchemaOrName, oldColumnSchemaOrName, newColumn) {
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
                        // todo: fix it. it should not depend on tableSchema
                        return [2 /*return*/, this.recreateTable(tableSchema)];
                }
            });
        });
    };
    /**
     * Changes a column in the table.
     * Changed column looses all its keys in the db.
     */
    SqliteQueryRunner.prototype.changeColumns = function (tableSchema, changedColumns) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.isReleased)
                    throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                // todo: fix it. it should not depend on tableSchema
                return [2 /*return*/, this.recreateTable(tableSchema)];
            });
        });
    };
    /**
     * Drops column in the table.
     */
    SqliteQueryRunner.prototype.dropColumn = function (tableSchemaOrName, columnSchemaOrName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.dropColumns(tableSchemaOrName, [columnSchemaOrName])];
            });
        });
    };
    /**
     * Drops the columns in the table.
     */
    SqliteQueryRunner.prototype.dropColumns = function (tableSchemaOrName, columnSchemasOrNames) {
        return __awaiter(this, void 0, void 0, function () {
            var tableSchema, updatingTableSchema, columns;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        return [4 /*yield*/, this.getTableSchema(tableSchemaOrName)];
                    case 1:
                        tableSchema = _a.sent();
                        updatingTableSchema = tableSchema.clone();
                        columns = columnSchemasOrNames.map(function (columnSchemasOrName) {
                            if (typeof columnSchemasOrName === "string") {
                                var column = tableSchema.columns.find(function (column) { return column.name === columnSchemasOrName; });
                                if (!column)
                                    throw new Error("Cannot drop a column - column \"" + columnSchemasOrName + "\" was not found in the \"" + tableSchema.name + "\" table.");
                                return column;
                            }
                            else {
                                return columnSchemasOrName;
                            }
                        });
                        updatingTableSchema.removeColumns(columns);
                        return [2 /*return*/, this.recreateTable(updatingTableSchema)];
                }
            });
        });
    };
    /**
     * Updates table's primary keys.
     */
    SqliteQueryRunner.prototype.updatePrimaryKeys = function (dbTable) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.isReleased)
                    throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                return [2 /*return*/, this.recreateTable(dbTable)];
            });
        });
    };
    /**
     * Creates a new foreign key.
     */
    SqliteQueryRunner.prototype.createForeignKey = function (tableSchemaOrName, foreignKey) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.isReleased)
                    throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                return [2 /*return*/, this.createForeignKeys(tableSchemaOrName, [foreignKey])];
            });
        });
    };
    /**
     * Creates a new foreign keys.
     */
    SqliteQueryRunner.prototype.createForeignKeys = function (tableSchemaOrName, foreignKeys) {
        return __awaiter(this, void 0, void 0, function () {
            var tableSchema, changedTableSchema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        return [4 /*yield*/, this.getTableSchema(tableSchemaOrName)];
                    case 1:
                        tableSchema = _a.sent();
                        changedTableSchema = tableSchema.clone();
                        changedTableSchema.addForeignKeys(foreignKeys);
                        return [2 /*return*/, this.recreateTable(changedTableSchema)];
                }
            });
        });
    };
    /**
     * Drops a foreign key from the table.
     */
    SqliteQueryRunner.prototype.dropForeignKey = function (tableSchemaOrName, foreignKey) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.isReleased)
                    throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                return [2 /*return*/, this.dropForeignKeys(tableSchemaOrName, [foreignKey])];
            });
        });
    };
    /**
     * Drops a foreign keys from the table.
     */
    SqliteQueryRunner.prototype.dropForeignKeys = function (tableSchemaOrName, foreignKeys) {
        return __awaiter(this, void 0, void 0, function () {
            var tableSchema, changedTableSchema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        return [4 /*yield*/, this.getTableSchema(tableSchemaOrName)];
                    case 1:
                        tableSchema = _a.sent();
                        changedTableSchema = tableSchema.clone();
                        changedTableSchema.removeForeignKeys(foreignKeys);
                        return [2 /*return*/, this.recreateTable(changedTableSchema)];
                }
            });
        });
    };
    /**
     * Creates a new index.
     */
    SqliteQueryRunner.prototype.createIndex = function (tableName, index) {
        return __awaiter(this, void 0, void 0, function () {
            var columnNames, sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        columnNames = index.columnNames.map(function (columnName) { return "\"" + columnName + "\""; }).join(",");
                        sql = "CREATE " + (index.isUnique ? "UNIQUE " : "") + "INDEX \"" + index.name + "\" ON \"" + tableName + "\"(" + columnNames + ")";
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
    SqliteQueryRunner.prototype.dropIndex = function (tableName, indexName) {
        return __awaiter(this, void 0, void 0, function () {
            var sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        sql = "DROP INDEX \"" + indexName + "\"";
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
    SqliteQueryRunner.prototype.normalizeType = function (typeOptions) {
        switch (typeOptions.type) {
            case "string":
                return "character varying(" + (typeOptions.length ? typeOptions.length : 255) + ")";
            case "text":
                return "text";
            case "boolean":
                return "boolean";
            case "integer":
            case "int":
                return "integer";
            case "smallint":
                return "smallint";
            case "bigint":
                return "bigint";
            case "float":
                return "real";
            case "double":
            case "number":
                return "double precision";
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
                if (typeOptions.timezone) {
                    return "time with time zone";
                }
                else {
                    return "time without time zone";
                }
            case "datetime":
                if (typeOptions.timezone) {
                    return "timestamp with time zone";
                }
                else {
                    return "timestamp without time zone";
                }
            case "json":
                return "json";
            case "simple_array":
                return typeOptions.length ? "character varying(" + typeOptions.length + ")" : "text";
        }
        throw new DataTypeNotSupportedByDriverError_1.DataTypeNotSupportedByDriverError(typeOptions.type, "SQLite");
    };
    /**
     * Checks if "DEFAULT" values in the column metadata and in the database schema are equal.
     */
    SqliteQueryRunner.prototype.compareDefaultValues = function (columnMetadataValue, databaseValue) {
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
    SqliteQueryRunner.prototype.truncate = function (tableName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.query("DELETE FROM " + this.driver.escapeTableName(tableName))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Parametrizes given object of values. Used to create column=value queries.
     */
    SqliteQueryRunner.prototype.parametrize = function (objectLiteral, startIndex) {
        var _this = this;
        if (startIndex === void 0) { startIndex = 0; }
        return Object.keys(objectLiteral).map(function (key, index) { return _this.driver.escapeColumnName(key) + "=$" + (startIndex + index + 1); });
    };
    /**
     * Builds a query for create column.
     */
    SqliteQueryRunner.prototype.buildCreateColumnSql = function (column) {
        var c = "\"" + column.name + "\"";
        if (column instanceof ColumnMetadata_1.ColumnMetadata) {
            c += " " + this.normalizeType(column);
        }
        else {
            c += " " + column.type;
        }
        if (column.isNullable !== true)
            c += " NOT NULL";
        if (column.isUnique === true)
            c += " UNIQUE";
        if (column.isGenerated === true)
            c += " PRIMARY KEY AUTOINCREMENT";
        if (column.default !== undefined && column.default !== null) {
            if (typeof column.default === "number") {
                c += " DEFAULT " + column.default + "";
            }
            else if (typeof column.default === "boolean") {
                c += " DEFAULT " + (column.default === true ? "1" : "0") + "";
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
    SqliteQueryRunner.prototype.recreateTable = function (tableSchema, oldTableSchema, migrateData) {
        if (migrateData === void 0) { migrateData = true; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var columnDefinitions, columnNames, sql1, primaryKeyColumns, oldColumnNames, sql2, sql3, sql4, indexPromises;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        columnDefinitions = tableSchema.columns.map(function (dbColumn) { return _this.buildCreateColumnSql(dbColumn); }).join(", ");
                        columnNames = tableSchema.columns.map(function (column) { return "\"" + column.name + "\""; }).join(", ");
                        sql1 = "CREATE TABLE \"temporary_" + tableSchema.name + "\" (" + columnDefinitions;
                        // if (options && options.createForeignKeys) {
                        tableSchema.foreignKeys.forEach(function (foreignKey) {
                            var columnNames = foreignKey.columnNames.map(function (name) { return "\"" + name + "\""; }).join(", ");
                            var referencedColumnNames = foreignKey.referencedColumnNames.map(function (name) { return "\"" + name + "\""; }).join(", ");
                            sql1 += ", FOREIGN KEY(" + columnNames + ") REFERENCES \"" + foreignKey.referencedTableName + "\"(" + referencedColumnNames + ")";
                            if (foreignKey.onDelete)
                                sql1 += " ON DELETE " + foreignKey.onDelete;
                        });
                        primaryKeyColumns = tableSchema.columns.filter(function (column) { return column.isPrimary && !column.isGenerated; });
                        if (primaryKeyColumns.length > 0)
                            sql1 += ", PRIMARY KEY(" + primaryKeyColumns.map(function (column) { return "" + column.name; }).join(", ") + ")"; // for some reason column escaping here generate a wrong schema
                        sql1 += ")";
                        // todo: need also create uniques and indices?
                        // recreate a table with a temporary name
                        return [4 /*yield*/, this.query(sql1)];
                    case 1:
                        // todo: need also create uniques and indices?
                        // recreate a table with a temporary name
                        _a.sent();
                        oldColumnNames = oldTableSchema ? oldTableSchema.columns.map(function (column) { return "\"" + column.name + "\""; }).join(", ") : columnNames;
                        if (!migrateData) return [3 /*break*/, 3];
                        sql2 = "INSERT INTO \"temporary_" + tableSchema.name + "\"(" + oldColumnNames + ") SELECT " + oldColumnNames + " FROM \"" + tableSchema.name + "\"";
                        return [4 /*yield*/, this.query(sql2)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        sql3 = "DROP TABLE \"" + tableSchema.name + "\"";
                        return [4 /*yield*/, this.query(sql3)];
                    case 4:
                        _a.sent();
                        sql4 = "ALTER TABLE \"temporary_" + tableSchema.name + "\" RENAME TO \"" + tableSchema.name + "\"";
                        return [4 /*yield*/, this.query(sql4)];
                    case 5:
                        _a.sent();
                        indexPromises = tableSchema.indices.map(function (index) { return _this.createIndex(tableSchema.name, index); });
                        // const uniquePromises = tableSchema.uniqueKeys.map(key => this.createIndex(key));
                        return [4 /*yield*/, Promise.all(indexPromises /*.concat(uniquePromises)*/)];
                    case 6:
                        // const uniquePromises = tableSchema.uniqueKeys.map(key => this.createIndex(key));
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * If given value is a table name then it loads its table schema representation from the database.
     */
    SqliteQueryRunner.prototype.getTableSchema = function (tableSchemaOrName) {
        return __awaiter(this, void 0, void 0, function () {
            var tableSchema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(tableSchemaOrName instanceof TableSchema_1.TableSchema)) return [3 /*break*/, 1];
                        return [2 /*return*/, tableSchemaOrName];
                    case 1: return [4 /*yield*/, this.loadTableSchema(tableSchemaOrName)];
                    case 2:
                        tableSchema = _a.sent();
                        if (!tableSchema)
                            throw new Error("Table named " + tableSchemaOrName + " was not found in the database.");
                        return [2 /*return*/, tableSchema];
                }
            });
        });
    };
    return SqliteQueryRunner;
}());
exports.SqliteQueryRunner = SqliteQueryRunner;

//# sourceMappingURL=SqliteQueryRunner.js.map
