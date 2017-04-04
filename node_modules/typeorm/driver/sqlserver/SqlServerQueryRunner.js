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
var SqlServerQueryRunner = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function SqlServerQueryRunner(databaseConnection, driver, logger) {
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
    SqlServerQueryRunner.prototype.release = function () {
        if (this.databaseConnection.releaseCallback) {
            this.isReleased = true;
            return this.databaseConnection.releaseCallback();
        }
        return Promise.resolve();
    };
    /**
     * Removes all tables from the currently connected database.
     */
    SqlServerQueryRunner.prototype.clearDatabase = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var allTablesSql, allTablesResults, tableNames, error_1;
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
                        _a.trys.push([2, 7, 9, 11]);
                        allTablesSql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'";
                        return [4 /*yield*/, this.query(allTablesSql)];
                    case 3:
                        allTablesResults = _a.sent();
                        tableNames = allTablesResults.map(function (result) { return result["TABLE_NAME"]; });
                        return [4 /*yield*/, Promise.all(tableNames.map(function (tableName) { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                var dropForeignKeySql, dropFkQueries;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            dropForeignKeySql = "SELECT 'ALTER TABLE ' +  OBJECT_SCHEMA_NAME(parent_object_id) + '.[' + OBJECT_NAME(parent_object_id) + '] DROP CONSTRAINT ' + name as query FROM sys.foreign_keys WHERE referenced_object_id = object_id('" + tableName + "')";
                                            return [4 /*yield*/, this.query(dropForeignKeySql)];
                                        case 1:
                                            dropFkQueries = _a.sent();
                                            return [2 /*return*/, Promise.all(dropFkQueries.map(function (result) { return result["query"]; }).map(function (dropQuery) {
                                                    return _this.query(dropQuery);
                                                }))];
                                    }
                                });
                            }); }))];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, Promise.all(tableNames.map(function (tableName) {
                                var dropTableSql = "DROP TABLE \"" + tableName + "\"";
                                return _this.query(dropTableSql);
                            }))];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.commitTransaction()];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 11];
                    case 7:
                        error_1 = _a.sent();
                        return [4 /*yield*/, this.rollbackTransaction()];
                    case 8:
                        _a.sent();
                        throw error_1;
                    case 9: return [4 /*yield*/, this.release()];
                    case 10:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Starts transaction.
     */
    SqlServerQueryRunner.prototype.beginTransaction = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.isReleased)
                    throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                if (this.databaseConnection.isTransactionActive)
                    throw new TransactionAlreadyStartedError_1.TransactionAlreadyStartedError();
                return [2 /*return*/, new Promise(function (ok, fail) {
                        _this.databaseConnection.isTransactionActive = true;
                        _this.databaseConnection.transaction = _this.databaseConnection.connection.transaction();
                        _this.databaseConnection.transaction.begin(function (err) {
                            if (err) {
                                _this.databaseConnection.isTransactionActive = false;
                                return fail(err);
                            }
                            ok();
                        });
                    })];
            });
        });
    };
    /**
     * Commits transaction.
     */
    SqlServerQueryRunner.prototype.commitTransaction = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.isReleased)
                    throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                if (!this.databaseConnection.isTransactionActive)
                    throw new TransactionNotStartedError_1.TransactionNotStartedError();
                return [2 /*return*/, new Promise(function (ok, fail) {
                        _this.databaseConnection.transaction.commit(function (err) {
                            if (err)
                                return fail(err);
                            _this.databaseConnection.isTransactionActive = false;
                            ok();
                        });
                    })];
            });
        });
    };
    /**
     * Rollbacks transaction.
     */
    SqlServerQueryRunner.prototype.rollbackTransaction = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.isReleased)
                    throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                if (!this.databaseConnection.isTransactionActive)
                    throw new TransactionNotStartedError_1.TransactionNotStartedError();
                return [2 /*return*/, new Promise(function (ok, fail) {
                        _this.databaseConnection.transaction.rollback(function (err) {
                            if (err)
                                return fail(err);
                            _this.databaseConnection.isTransactionActive = false;
                            ok();
                        });
                    })];
            });
        });
    };
    /**
     * Checks if transaction is in progress.
     */
    SqlServerQueryRunner.prototype.isTransactionActive = function () {
        return this.databaseConnection.isTransactionActive;
    };
    /**
     * Executes a given SQL query.
     */
    SqlServerQueryRunner.prototype.query = function (query, parameters) {
        var _this = this;
        if (this.isReleased)
            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
        return new Promise(function (ok, fail) {
            _this.logger.logQuery(query, parameters);
            var request = new _this.driver.mssql.Request(_this.isTransactionActive() ? _this.databaseConnection.transaction : _this.databaseConnection.connection);
            if (parameters && parameters.length) {
                parameters.forEach(function (parameter, index) {
                    request.input(index, parameters[index]);
                });
            }
            request.query(query, function (err, result) {
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
    SqlServerQueryRunner.prototype.insert = function (tableName, keyValues, generatedColumn) {
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
                        values = keys.map(function (key, index) { return "@" + index; }).join(",");
                        parameters = keys.map(function (key) { return keyValues[key]; });
                        sql = columns.length > 0
                            ? "INSERT INTO " + this.driver.escapeTableName(tableName) + "(" + columns + ") " + (generatedColumn ? "OUTPUT INSERTED." + generatedColumn.name + " " : "") + "VALUES (" + values + ")"
                            : "INSERT INTO " + this.driver.escapeTableName(tableName) + " " + (generatedColumn ? "OUTPUT INSERTED." + generatedColumn.name + " " : "") + "DEFAULT VALUES ";
                        return [4 /*yield*/, this.query(sql, parameters)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, generatedColumn ? result instanceof Array ? result[0][generatedColumn.name] : result[generatedColumn.name] : undefined];
                }
            });
        });
    };
    /**
     * Updates rows that match given conditions in the given table.
     */
    SqlServerQueryRunner.prototype.update = function (tableName, valuesMap, conditions) {
        return __awaiter(this, void 0, void 0, function () {
            var conditionParams, updateParams, allParameters, updateValues, conditionString, sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        conditionParams = Object.keys(conditions).map(function (key) { return conditions[key]; });
                        updateParams = Object.keys(valuesMap).map(function (key) { return valuesMap[key]; });
                        allParameters = updateParams.concat(conditionParams);
                        updateValues = this.parametrize(valuesMap).join(", ");
                        conditionString = this.parametrize(conditions, updateParams.length).join(" AND ");
                        sql = "UPDATE " + this.driver.escapeTableName(tableName) + " SET " + updateValues + " " + (conditionString ? (" WHERE " + conditionString) : "");
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
    SqlServerQueryRunner.prototype.delete = function (tableName, conditions, maybeParameters) {
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
    SqlServerQueryRunner.prototype.insertIntoClosureTable = function (tableName, newEntityId, parentId, hasLevel) {
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
    SqlServerQueryRunner.prototype.loadTableSchema = function (tableName) {
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
    SqlServerQueryRunner.prototype.loadTableSchemas = function (tableNames) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var tableNamesString, tablesSql, columnsSql, constraintsSql, identityColumnsSql, indicesSql, _a, dbTables, dbColumns, dbConstraints, dbIdentityColumns, dbIndices;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        // if no tables given then no need to proceed
                        if (!tableNames || !tableNames.length)
                            return [2 /*return*/, []];
                        tableNamesString = tableNames.map(function (tableName) { return "'" + tableName + "'"; }).join(", ");
                        tablesSql = "SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_CATALOG = '" + this.dbName + "' AND TABLE_NAME IN (" + tableNamesString + ")";
                        columnsSql = "SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_CATALOG = '" + this.dbName + "'";
                        constraintsSql = "SELECT columnUsages.*, tableConstraints.CONSTRAINT_TYPE FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE columnUsages " +
                            "LEFT JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS tableConstraints ON tableConstraints.CONSTRAINT_NAME = columnUsages.CONSTRAINT_NAME " +
                            ("WHERE columnUsages.TABLE_CATALOG = '" + this.dbName + "' AND tableConstraints.TABLE_CATALOG = '" + this.dbName + "'");
                        identityColumnsSql = "SELECT COLUMN_NAME, TABLE_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_CATALOG = '" + this.dbName + "' AND COLUMNPROPERTY(object_id(TABLE_NAME), COLUMN_NAME, 'IsIdentity') = 1;";
                        indicesSql = "SELECT TABLE_NAME = t.name, INDEX_NAME = ind.name, IndexId = ind.index_id, ColumnId = ic.index_column_id, COLUMN_NAME = col.name, ind.*, ic.*, col.* " +
                            "FROM sys.indexes ind INNER JOIN sys.index_columns ic ON ind.object_id = ic.object_id and ind.index_id = ic.index_id INNER JOIN sys.columns col ON ic.object_id = col.object_id and ic.column_id = col.column_id " +
                            "INNER JOIN sys.tables t ON ind.object_id = t.object_id WHERE ind.is_primary_key = 0 AND ind.is_unique = 0 AND ind.is_unique_constraint = 0 AND t.is_ms_shipped = 0 ORDER BY t.name, ind.name, ind.index_id, ic.index_column_id";
                        return [4 /*yield*/, Promise.all([
                                this.query(tablesSql),
                                this.query(columnsSql),
                                this.query(constraintsSql),
                                this.query(identityColumnsSql),
                                this.query(indicesSql),
                            ])];
                    case 1:
                        _a = _b.sent(), dbTables = _a[0], dbColumns = _a[1], dbConstraints = _a[2], dbIdentityColumns = _a[3], dbIndices = _a[4];
                        // if tables were not found in the db, no need to proceed
                        if (!dbTables.length)
                            return [2 /*return*/, []];
                        // create table schemas for loaded tables
                        return [2 /*return*/, Promise.all(dbTables.map(function (dbTable) { return __awaiter(_this, void 0, void 0, function () {
                                var tableSchema;
                                return __generator(this, function (_a) {
                                    tableSchema = new TableSchema_1.TableSchema(dbTable["TABLE_NAME"]);
                                    // create column schemas from the loaded columns
                                    tableSchema.columns = dbColumns
                                        .filter(function (dbColumn) { return dbColumn["TABLE_NAME"] === tableSchema.name; })
                                        .map(function (dbColumn) {
                                        var isPrimary = !!dbConstraints.find(function (dbConstraint) {
                                            return dbConstraint["TABLE_NAME"] === tableSchema.name &&
                                                dbConstraint["COLUMN_NAME"] === dbColumn["COLUMN_NAME"] &&
                                                dbConstraint["CONSTRAINT_TYPE"] === "PRIMARY KEY";
                                        });
                                        var isGenerated = !!dbIdentityColumns.find(function (column) {
                                            return column["TABLE_NAME"] === tableSchema.name &&
                                                column["COLUMN_NAME"] === dbColumn["COLUMN_NAME"];
                                        });
                                        var isUnique = !!dbConstraints.find(function (dbConstraint) {
                                            return dbConstraint["TABLE_NAME"] === tableSchema.name &&
                                                dbConstraint["COLUMN_NAME"] === dbColumn["COLUMN_NAME"] &&
                                                dbConstraint["CONSTRAINT_TYPE"] === "UNIQUE";
                                        });
                                        var columnSchema = new ColumnSchema_1.ColumnSchema();
                                        columnSchema.name = dbColumn["COLUMN_NAME"];
                                        columnSchema.type = dbColumn["DATA_TYPE"].toLowerCase() + (dbColumn["CHARACTER_MAXIMUM_LENGTH"] ? "(" + dbColumn["CHARACTER_MAXIMUM_LENGTH"] + ")" : ""); // todo: use normalize type?
                                        columnSchema.default = dbColumn["COLUMN_DEFAULT"] !== null && dbColumn["COLUMN_DEFAULT"] !== undefined ? dbColumn["COLUMN_DEFAULT"] : undefined;
                                        columnSchema.isNullable = dbColumn["IS_NULLABLE"] === "YES";
                                        columnSchema.isPrimary = isPrimary;
                                        columnSchema.isGenerated = isGenerated;
                                        columnSchema.isUnique = isUnique;
                                        columnSchema.comment = ""; // todo: less priority, implement this later
                                        return columnSchema;
                                    });
                                    // create primary key schema
                                    tableSchema.primaryKeys = dbConstraints
                                        .filter(function (dbConstraint) {
                                        return dbConstraint["TABLE_NAME"] === tableSchema.name &&
                                            dbConstraint["CONSTRAINT_TYPE"] === "PRIMARY KEY";
                                    })
                                        .map(function (keyColumnUsage) {
                                        return new PrimaryKeySchema_1.PrimaryKeySchema(keyColumnUsage["CONSTRAINT_NAME"], keyColumnUsage["COLUMN_NAME"]);
                                    });
                                    // create foreign key schemas from the loaded indices
                                    tableSchema.foreignKeys = dbConstraints
                                        .filter(function (dbConstraint) {
                                        return dbConstraint["TABLE_NAME"] === tableSchema.name &&
                                            dbConstraint["CONSTRAINT_TYPE"] === "FOREIGN KEY";
                                    })
                                        .map(function (dbConstraint) { return new ForeignKeySchema_1.ForeignKeySchema(dbConstraint["CONSTRAINT_NAME"], [], [], "", ""); }); // todo: fix missing params
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
                                        var columnNames = dbIndices
                                            .filter(function (dbIndex) { return dbIndex["TABLE_NAME"] === tableSchema.name && dbIndex["INDEX_NAME"] === dbIndexName; })
                                            .map(function (dbIndex) { return dbIndex["COLUMN_NAME"]; });
                                        return new IndexSchema_1.IndexSchema(dbTable["TABLE_NAME"], dbIndexName, columnNames, false /* todo: uniqueness? */);
                                    });
                                    return [2 /*return*/, tableSchema];
                                });
                            }); }))];
                }
            });
        });
    };
    /**
     * Checks if table with the given name exist in the database.
     */
    SqlServerQueryRunner.prototype.hasTable = function (tableName) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_CATALOG = '" + this.dbName + "' AND TABLE_NAME = '" + tableName + "'";
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
    SqlServerQueryRunner.prototype.createTable = function (table) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var columnDefinitions, sql, primaryKeyColumns;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        columnDefinitions = table.columns.map(function (column) { return _this.buildCreateColumnSql(column, false); }).join(", ");
                        sql = "CREATE TABLE \"" + table.name + "\" (" + columnDefinitions;
                        sql += table.columns
                            .filter(function (column) { return column.isUnique; })
                            .map(function (column) { return ", CONSTRAINT \"uk_" + table.name + "_" + column.name + "\" UNIQUE (\"" + column.name + "\")"; })
                            .join(" ");
                        primaryKeyColumns = table.columns.filter(function (column) { return column.isPrimary; });
                        if (primaryKeyColumns.length > 0)
                            sql += ", PRIMARY KEY(" + primaryKeyColumns.map(function (column) { return "\"" + column.name + "\""; }).join(", ") + ")";
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
    SqlServerQueryRunner.prototype.hasColumn = function (tableName, columnName) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_CATALOG = '" + this.dbName + "' AND TABLE_NAME = '" + tableName + "' AND COLUMN_NAME = '" + columnName + "'";
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
    SqlServerQueryRunner.prototype.addColumn = function (tableSchemaOrName, column) {
        return __awaiter(this, void 0, void 0, function () {
            var tableName, sql;
            return __generator(this, function (_a) {
                if (this.isReleased)
                    throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                tableName = tableSchemaOrName instanceof TableSchema_1.TableSchema ? tableSchemaOrName.name : tableSchemaOrName;
                sql = "ALTER TABLE \"" + tableName + "\" ADD " + this.buildCreateColumnSql(column);
                return [2 /*return*/, this.query(sql)];
            });
        });
    };
    /**
     * Creates a new columns from the column schema in the table.
     */
    SqlServerQueryRunner.prototype.addColumns = function (tableSchemaOrName, columns) {
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
    SqlServerQueryRunner.prototype.renameColumn = function (tableSchemaOrName, oldColumnSchemaOrName, newColumnSchemaOrName) {
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
    SqlServerQueryRunner.prototype.changeColumn = function (tableSchemaOrName, oldColumnSchemaOrName, newColumn) {
        return __awaiter(this, void 0, void 0, function () {
            var tableSchema, oldColumn, sql;
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
                        if (!(newColumn.isGenerated !== oldColumn.isGenerated)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.query("ALTER TABLE \"" + tableSchema.name + "\" DROP COLUMN \"" + newColumn.name + "\"")];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.query("ALTER TABLE \"" + tableSchema.name + "\" ADD " + this.buildCreateColumnSql(newColumn))];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        sql = "ALTER TABLE \"" + tableSchema.name + "\" ALTER COLUMN " + this.buildCreateColumnSql(newColumn, true);
                        return [4 /*yield*/, this.query(sql)];
                    case 7:
                        _a.sent();
                        if (!(newColumn.isUnique !== oldColumn.isUnique)) return [3 /*break*/, 11];
                        if (!(newColumn.isUnique === true)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.query("ALTER TABLE \"" + tableSchema.name + "\" ADD CONSTRAINT \"uk_" + newColumn.name + "\" UNIQUE (\"" + newColumn.name + "\")")];
                    case 8:
                        _a.sent();
                        return [3 /*break*/, 11];
                    case 9:
                        if (!(newColumn.isUnique === false)) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.query("ALTER TABLE \"" + tableSchema.name + "\" DROP CONSTRAINT \"uk_" + newColumn.name + "\"")];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Changes a column in the table.
     */
    SqlServerQueryRunner.prototype.changeColumns = function (tableSchema, changedColumns) {
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
    SqlServerQueryRunner.prototype.dropColumn = function (tableSchemaOrName, columnSchemaOrName) {
        return __awaiter(this, void 0, void 0, function () {
            var tableName, columnName;
            return __generator(this, function (_a) {
                tableName = tableSchemaOrName instanceof TableSchema_1.TableSchema ? tableSchemaOrName.name : tableSchemaOrName;
                columnName = columnSchemaOrName instanceof ColumnSchema_1.ColumnSchema ? columnSchemaOrName.name : columnSchemaOrName;
                return [2 /*return*/, this.query("ALTER TABLE \"" + tableName + "\" DROP COLUMN \"" + columnName + "\"")];
            });
        });
    };
    /**
     * Drops the columns in the table.
     */
    SqlServerQueryRunner.prototype.dropColumns = function (tableSchemaOrName, columnSchemasOrNames) {
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
    SqlServerQueryRunner.prototype.updatePrimaryKeys = function (dbTable) {
        return __awaiter(this, void 0, void 0, function () {
            var oldPrimaryKeySql, oldPrimaryKey, primaryColumnNames;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        oldPrimaryKeySql = "SELECT columnUsages.*, tableConstraints.CONSTRAINT_TYPE FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE columnUsages\nLEFT JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS tableConstraints ON tableConstraints.CONSTRAINT_NAME = columnUsages.CONSTRAINT_NAME AND tableConstraints.CONSTRAINT_TYPE = 'PRIMARY KEY'\nWHERE columnUsages.TABLE_CATALOG = '" + this.dbName + "' AND tableConstraints.TABLE_CATALOG = '" + this.dbName + "'";
                        return [4 /*yield*/, this.query(oldPrimaryKeySql)];
                    case 1:
                        oldPrimaryKey = _a.sent();
                        if (!(oldPrimaryKey.length > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.query("ALTER TABLE \"" + dbTable.name + "\" DROP CONSTRAINT \"" + oldPrimaryKey[0]["CONSTRAINT_NAME"] + "\"")];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        primaryColumnNames = dbTable.primaryKeys.map(function (primaryKey) { return "\"" + primaryKey.columnName + "\""; });
                        if (!(primaryColumnNames.length > 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.query("ALTER TABLE \"" + dbTable.name + "\" ADD PRIMARY KEY (" + primaryColumnNames.join(", ") + ")")];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Creates a new foreign key.
     */
    SqlServerQueryRunner.prototype.createForeignKey = function (tableSchemaOrName, foreignKey) {
        return __awaiter(this, void 0, void 0, function () {
            var tableName, columnNames, referencedColumnNames, sql;
            return __generator(this, function (_a) {
                if (this.isReleased)
                    throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                tableName = tableSchemaOrName instanceof TableSchema_1.TableSchema ? tableSchemaOrName.name : tableSchemaOrName;
                columnNames = foreignKey.columnNames.map(function (column) { return "\"" + column + "\""; }).join(", ");
                referencedColumnNames = foreignKey.referencedColumnNames.map(function (column) { return "\"" + column + "\""; }).join(",");
                sql = "ALTER TABLE \"" + tableName + "\" ADD CONSTRAINT \"" + foreignKey.name + "\" " +
                    ("FOREIGN KEY (" + columnNames + ") ") +
                    ("REFERENCES \"" + foreignKey.referencedTableName + "\"(" + referencedColumnNames + ")");
                if (foreignKey.onDelete)
                    sql += " ON DELETE " + foreignKey.onDelete;
                return [2 /*return*/, this.query(sql)];
            });
        });
    };
    /**
     * Creates a new foreign keys.
     */
    SqlServerQueryRunner.prototype.createForeignKeys = function (tableSchemaOrName, foreignKeys) {
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
    SqlServerQueryRunner.prototype.dropForeignKey = function (tableSchemaOrName, foreignKey) {
        return __awaiter(this, void 0, void 0, function () {
            var tableName, sql;
            return __generator(this, function (_a) {
                if (this.isReleased)
                    throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                tableName = tableSchemaOrName instanceof TableSchema_1.TableSchema ? tableSchemaOrName.name : tableSchemaOrName;
                sql = "ALTER TABLE \"" + tableName + "\" DROP CONSTRAINT \"" + foreignKey.name + "\"";
                return [2 /*return*/, this.query(sql)];
            });
        });
    };
    /**
     * Drops a foreign keys from the table.
     */
    SqlServerQueryRunner.prototype.dropForeignKeys = function (tableSchemaOrName, foreignKeys) {
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
    SqlServerQueryRunner.prototype.createIndex = function (tableName, index) {
        return __awaiter(this, void 0, void 0, function () {
            var columns, sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        columns = index.columnNames.map(function (columnName) { return "\"" + columnName + "\""; }).join(", ");
                        sql = "CREATE " + (index.isUnique ? "UNIQUE " : "") + "INDEX \"" + index.name + "\" ON \"" + tableName + "\"(" + columns + ")";
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
    SqlServerQueryRunner.prototype.dropIndex = function (tableName, indexName) {
        return __awaiter(this, void 0, void 0, function () {
            var sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        sql = "DROP INDEX \"" + tableName + "\".\"" + indexName + "\"";
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
    SqlServerQueryRunner.prototype.normalizeType = function (typeOptions) {
        switch (typeOptions.type) {
            case "string":
                return "nvarchar(" + (typeOptions.length ? typeOptions.length : 255) + ")";
            case "text":
                return "ntext";
            case "boolean":
                return "bit";
            case "integer":
            case "int":
                return "int";
            case "smallint":
                return "smallint";
            case "bigint":
                return "bigint";
            case "float":
                return "float";
            case "double":
            case "number":
                return "real";
            case "decimal":
                // if (column.precision && column.scale) {
                //     return `decimal(${column.precision},${column.scale})`;
                //
                // } else if (column.scale) {
                //     return `decimal(${column.scale})`;
                //
                // } else if (column.precision) {
                //     return `decimal(${column.precision})`;
                //
                // } else {
                return "decimal";
            // }
            case "date":
                return "date";
            case "time":
                return "time";
            case "datetime":
                return "datetime";
            case "json":
                return "text";
            case "simple_array":
                return typeOptions.length ? "nvarchar(" + typeOptions.length + ")" : "text";
        }
        throw new DataTypeNotSupportedByDriverError_1.DataTypeNotSupportedByDriverError(typeOptions.type, "SQLServer");
    };
    /**
     * Checks if "DEFAULT" values in the column metadata and in the database schema are equal.
     */
    SqlServerQueryRunner.prototype.compareDefaultValues = function (columnMetadataValue, databaseValue) {
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
    SqlServerQueryRunner.prototype.truncate = function (tableName) {
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
    Object.defineProperty(SqlServerQueryRunner.prototype, "dbName", {
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
    SqlServerQueryRunner.prototype.parametrize = function (objectLiteral, startFrom) {
        var _this = this;
        if (startFrom === void 0) { startFrom = 0; }
        return Object.keys(objectLiteral).map(function (key, index) {
            return _this.driver.escapeColumnName(key) + "=@" + (startFrom + index);
        });
    };
    /**
     * Builds a query for create column.
     */
    SqlServerQueryRunner.prototype.buildCreateColumnSql = function (column, skipIdentity) {
        if (skipIdentity === void 0) { skipIdentity = false; }
        var c = "\"" + column.name + "\" " + column.type;
        if (column.isNullable !== true)
            c += " NOT NULL";
        if (column.isGenerated === true && !skipIdentity)
            c += " IDENTITY(1,1)";
        // if (column.isPrimary === true && !skipPrimary)
        //     c += " PRIMARY KEY";
        if (column.comment)
            c += " COMMENT '" + column.comment + "'";
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
    return SqlServerQueryRunner;
}());
exports.SqlServerQueryRunner = SqlServerQueryRunner;

//# sourceMappingURL=SqlServerQueryRunner.js.map
