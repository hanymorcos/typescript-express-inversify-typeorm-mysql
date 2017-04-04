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
var QueryRunnerAlreadyReleasedError_1 = require("../../query-runner/error/QueryRunnerAlreadyReleasedError");
/**
 * Runs queries on a single mysql database connection.
 *
 * todo: this driver is not 100% finished yet, need to fix all issues that are left
 */
var OracleQueryRunner = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function OracleQueryRunner(databaseConnection, driver, logger) {
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
    OracleQueryRunner.prototype.release = function () {
        if (this.databaseConnection.releaseCallback) {
            this.isReleased = true;
            return this.databaseConnection.releaseCallback();
        }
        return Promise.resolve();
    };
    /**
     * Removes all tables from the currently connected database.
     */
    OracleQueryRunner.prototype.clearDatabase = function () {
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
    OracleQueryRunner.prototype.beginTransaction = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.isReleased)
                    throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                if (this.databaseConnection.isTransactionActive)
                    throw new TransactionAlreadyStartedError_1.TransactionAlreadyStartedError();
                // await this.query("START TRANSACTION");
                this.databaseConnection.isTransactionActive = true;
                return [2 /*return*/];
            });
        });
    };
    /**
     * Commits transaction.
     */
    OracleQueryRunner.prototype.commitTransaction = function () {
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
    OracleQueryRunner.prototype.rollbackTransaction = function () {
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
    OracleQueryRunner.prototype.isTransactionActive = function () {
        return this.databaseConnection.isTransactionActive;
    };
    /**
     * Executes a given SQL query.
     */
    OracleQueryRunner.prototype.query = function (query, parameters) {
        var _this = this;
        if (this.isReleased)
            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
        return new Promise(function (ok, fail) {
            _this.logger.logQuery(query, parameters);
            var handler = function (err, result) {
                if (err) {
                    _this.logger.logFailedQuery(query, parameters);
                    _this.logger.logQueryError(err);
                    return fail(err);
                }
                ok(result.rows || result.outBinds);
            };
            var executionOptions = {
                autoCommit: _this.databaseConnection.isTransactionActive ? false : true
            };
            _this.databaseConnection.connection.execute(query, parameters || {}, executionOptions, handler);
        });
    };
    /**
     * Insert a new row with given values into given table.
     */
    OracleQueryRunner.prototype.insert = function (tableName, keyValues, generatedColumn) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var keys, columns, values, parameters, insertSql, sql2, saveResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        keys = Object.keys(keyValues);
                        columns = keys.map(function (key) { return _this.driver.escapeColumnName(key); }).join(", ");
                        values = keys.map(function (key) { return ":" + key; }).join(", ");
                        parameters = keys.map(function (key) { return keyValues[key]; });
                        insertSql = columns.length > 0
                            ? "INSERT INTO " + this.driver.escapeTableName(tableName) + "(" + columns + ") VALUES (" + values + ")"
                            : "INSERT INTO " + this.driver.escapeTableName(tableName) + " DEFAULT VALUES";
                        if (!generatedColumn) return [3 /*break*/, 2];
                        sql2 = "declare lastId number; begin " + insertSql + " returning \"id\" into lastId; dbms_output.enable; dbms_output.put_line(lastId); dbms_output.get_line(:ln, :st); end;";
                        return [4 /*yield*/, this.query(sql2, parameters.concat([
                                { dir: this.driver.oracle.BIND_OUT, type: this.driver.oracle.STRING, maxSize: 32767 },
                                { dir: this.driver.oracle.BIND_OUT, type: this.driver.oracle.NUMBER }
                            ]))];
                    case 1:
                        saveResult = _a.sent();
                        return [2 /*return*/, parseInt(saveResult[0])];
                    case 2: return [2 /*return*/, this.query(insertSql, parameters)];
                }
            });
        });
    };
    /**
     * Updates rows that match given conditions in the given table.
     */
    OracleQueryRunner.prototype.update = function (tableName, valuesMap, conditions) {
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
    OracleQueryRunner.prototype.delete = function (tableName, conditions, maybeParameters) {
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
    OracleQueryRunner.prototype.insertIntoClosureTable = function (tableName, newEntityId, parentId, hasLevel) {
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
    OracleQueryRunner.prototype.loadTableSchema = function (tableName) {
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
    OracleQueryRunner.prototype.loadTableSchemas = function (tableNames) {
        return __awaiter(this, void 0, void 0, function () {
            var tableNamesString, tablesSql, columnsSql, indicesSql, foreignKeysSql, uniqueKeysSql, constraintsSql, _a, dbTables, dbColumns, constraints;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        // if no tables given then no need to proceed
                        if (!tableNames || !tableNames.length)
                            return [2 /*return*/, []];
                        tableNamesString = tableNames.map(function (name) { return "'" + name + "'"; }).join(", ");
                        tablesSql = "SELECT TABLE_NAME FROM user_tables WHERE TABLE_NAME IN (" + tableNamesString + ")";
                        columnsSql = "SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, DATA_LENGTH, DATA_PRECISION, DATA_SCALE, NULLABLE, IDENTITY_COLUMN FROM all_tab_cols WHERE TABLE_NAME IN (" + tableNamesString + ")";
                        indicesSql = "SELECT * FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_SCHEMA = '" + this.dbName + "' AND INDEX_NAME != 'PRIMARY'";
                        foreignKeysSql = "SELECT * FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = '" + this.dbName + "' AND REFERENCED_COLUMN_NAME IS NOT NULL";
                        uniqueKeysSql = "SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA = '" + this.dbName + "' AND CONSTRAINT_TYPE = 'UNIQUE'";
                        constraintsSql = "SELECT cols.table_name, cols.column_name, cols.position, cons.constraint_type, cons.constraint_name\nFROM all_constraints cons, all_cons_columns cols WHERE cols.table_name IN (" + tableNamesString + ") \nAND cons.constraint_name = cols.constraint_name AND cons.owner = cols.owner ORDER BY cols.table_name, cols.position";
                        return [4 /*yield*/, Promise.all([
                                this.query(tablesSql),
                                this.query(columnsSql),
                                // this.query(indicesSql),
                                // this.query(foreignKeysSql),
                                // this.query(uniqueKeysSql),
                                this.query(constraintsSql),
                            ])];
                    case 1:
                        _a = _b.sent(), dbTables = _a[0], dbColumns = _a[1], constraints = _a[2];
                        // if tables were not found in the db, no need to proceed
                        if (!dbTables.length)
                            return [2 /*return*/, []];
                        // create table schemas for loaded tables
                        return [2 /*return*/, dbTables.map(function (dbTable) {
                                var tableSchema = new TableSchema_1.TableSchema(dbTable["TABLE_NAME"]);
                                // create column schemas from the loaded columns
                                tableSchema.columns = dbColumns
                                    .filter(function (dbColumn) { return dbColumn["TABLE_NAME"] === tableSchema.name; })
                                    .map(function (dbColumn) {
                                    var isPrimary = !!constraints
                                        .find(function (constraint) {
                                        return constraint["TABLE_NAME"] === tableSchema.name &&
                                            constraint["CONSTRAINT_TYPE"] === "P" &&
                                            constraint["COLUMN_NAME"] === dbColumn["COLUMN_NAME"];
                                    });
                                    var columnType = dbColumn["DATA_TYPE"].toLowerCase();
                                    if (dbColumn["DATA_TYPE"].toLowerCase() === "varchar2" && dbColumn["DATA_LENGTH"] !== null) {
                                        columnType += "(" + dbColumn["DATA_LENGTH"] + ")";
                                    }
                                    else if (dbColumn["DATA_PRECISION"] !== null && dbColumn["DATA_SCALE"] !== null) {
                                        columnType += "(" + dbColumn["DATA_PRECISION"] + "," + dbColumn["DATA_SCALE"] + ")";
                                    }
                                    else if (dbColumn["DATA_SCALE"] !== null) {
                                        columnType += "(0," + dbColumn["DATA_SCALE"] + ")";
                                    }
                                    else if (dbColumn["DATA_PRECISION"] !== null) {
                                        columnType += "(" + dbColumn["DATA_PRECISION"] + ")";
                                    }
                                    var columnSchema = new ColumnSchema_1.ColumnSchema();
                                    columnSchema.name = dbColumn["COLUMN_NAME"];
                                    columnSchema.type = columnType;
                                    columnSchema.default = dbColumn["COLUMN_DEFAULT"] !== null && dbColumn["COLUMN_DEFAULT"] !== undefined ? dbColumn["COLUMN_DEFAULT"] : undefined;
                                    columnSchema.isNullable = dbColumn["NULLABLE"] !== "N";
                                    columnSchema.isPrimary = isPrimary;
                                    columnSchema.isGenerated = dbColumn["IDENTITY_COLUMN"] === "YES"; // todo
                                    columnSchema.comment = ""; // todo
                                    return columnSchema;
                                });
                                // create primary key schema
                                tableSchema.primaryKeys = constraints
                                    .filter(function (constraint) { return constraint["TABLE_NAME"] === tableSchema.name && constraint["CONSTRAINT_TYPE"] === "P"; })
                                    .map(function (constraint) { return new PrimaryKeySchema_1.PrimaryKeySchema(constraint["CONSTRAINT_NAME"], constraint["COLUMN_NAME"]); });
                                // create foreign key schemas from the loaded indices
                                tableSchema.foreignKeys = constraints
                                    .filter(function (constraint) { return constraint["TABLE_NAME"] === tableSchema.name && constraint["CONSTRAINT_TYPE"] === "R"; })
                                    .map(function (constraint) { return new ForeignKeySchema_1.ForeignKeySchema(constraint["CONSTRAINT_NAME"], [], [], "", ""); }); // todo: fix missing params
                                // console.log(tableSchema);
                                // create index schemas from the loaded indices
                                // tableSchema.indices = dbIndices
                                //     .filter(dbIndex => {
                                //         return  dbIndex["table_name"] === tableSchema.name &&
                                //             (!tableSchema.foreignKeys.find(foreignKey => foreignKey.name === dbIndex["INDEX_NAME"])) &&
                                //             (!tableSchema.primaryKeys.find(primaryKey => primaryKey.name === dbIndex["INDEX_NAME"]));
                                //     })
                                //     .map(dbIndex => dbIndex["INDEX_NAME"])
                                //     .filter((value, index, self) => self.indexOf(value) === index) // unqiue
                                //     .map(dbIndexName => {
                                //         const columnNames = dbIndices
                                //             .filter(dbIndex => dbIndex["TABLE_NAME"] === tableSchema.name && dbIndex["INDEX_NAME"] === dbIndexName)
                                //             .map(dbIndex => dbIndex["COLUMN_NAME"]);
                                //
                                //         return new IndexSchema(dbTable["TABLE_NAME"], dbIndexName, columnNames, false /* todo: uniqueness */);
                                //     });
                                return tableSchema;
                            })];
                }
            });
        });
    };
    /**
     * Checks if table with the given name exist in the database.
     */
    OracleQueryRunner.prototype.hasTable = function (tableName) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "SELECT TABLE_NAME FROM user_tables WHERE TABLE_NAME = '" + tableName + "'";
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
    OracleQueryRunner.prototype.createTable = function (table) {
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
    OracleQueryRunner.prototype.hasColumn = function (tableName, columnName) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "SELECT COLUMN_NAME FROM all_tab_cols WHERE TABLE_NAME = '" + tableName + "' AND COLUMN_NAME = '" + columnName + "'";
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
    OracleQueryRunner.prototype.addColumn = function (tableSchemaOrName, column) {
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
    OracleQueryRunner.prototype.addColumns = function (tableSchemaOrName, columns) {
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
    OracleQueryRunner.prototype.renameColumn = function (tableSchemaOrName, oldColumnSchemaOrName, newColumnSchemaOrName) {
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
    OracleQueryRunner.prototype.changeColumn = function (tableSchemaOrName, oldColumnSchemaOrName, newColumn) {
        return __awaiter(this, void 0, void 0, function () {
            var tableSchema, oldColumn, dropPrimarySql, dropSql, createSql, sql, sql, sql;
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
                        if (!(newColumn.isGenerated !== oldColumn.isGenerated)) return [3 /*break*/, 10];
                        if (!newColumn.isGenerated) return [3 /*break*/, 8];
                        if (!(tableSchema.primaryKeys.length > 0 && oldColumn.isPrimary)) return [3 /*break*/, 5];
                        dropPrimarySql = "ALTER TABLE \"" + tableSchema.name + "\" DROP CONSTRAINT \"" + tableSchema.primaryKeys[0].name + "\"";
                        return [4 /*yield*/, this.query(dropPrimarySql)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        dropSql = "ALTER TABLE \"" + tableSchema.name + "\" DROP COLUMN \"" + newColumn.name + "\"";
                        return [4 /*yield*/, this.query(dropSql)];
                    case 6:
                        _a.sent();
                        createSql = "ALTER TABLE \"" + tableSchema.name + "\" ADD " + this.buildCreateColumnSql(newColumn);
                        return [4 /*yield*/, this.query(createSql)];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 10];
                    case 8:
                        sql = "ALTER TABLE \"" + tableSchema.name + "\" MODIFY \"" + newColumn.name + "\" DROP IDENTITY";
                        return [4 /*yield*/, this.query(sql)];
                    case 9:
                        _a.sent();
                        _a.label = 10;
                    case 10:
                        if (!(newColumn.isNullable !== oldColumn.isNullable)) return [3 /*break*/, 12];
                        sql = "ALTER TABLE \"" + tableSchema.name + "\" MODIFY \"" + newColumn.name + "\" " + newColumn.type + " " + (newColumn.isNullable ? "NULL" : "NOT NULL");
                        return [4 /*yield*/, this.query(sql)];
                    case 11:
                        _a.sent();
                        return [3 /*break*/, 14];
                    case 12:
                        if (!(newColumn.type !== oldColumn.type)) return [3 /*break*/, 14];
                        sql = "ALTER TABLE \"" + tableSchema.name + "\" MODIFY \"" + newColumn.name + "\" " + newColumn.type;
                        return [4 /*yield*/, this.query(sql)];
                    case 13:
                        _a.sent();
                        _a.label = 14;
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Changes a column in the table.
     */
    OracleQueryRunner.prototype.changeColumns = function (tableSchema, changedColumns) {
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
    OracleQueryRunner.prototype.dropColumn = function (tableSchemaOrName, columnSchemaOrName) {
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
    OracleQueryRunner.prototype.dropColumns = function (tableSchemaOrName, columnSchemasOrNames) {
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
    OracleQueryRunner.prototype.updatePrimaryKeys = function (dbTable) {
        return __awaiter(this, void 0, void 0, function () {
            var primaryColumnNames;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        primaryColumnNames = dbTable.primaryKeys.map(function (primaryKey) { return "\"" + primaryKey.columnName + "\""; });
                        if (!(dbTable.primaryKeys.length > 0 && dbTable.primaryKeys[0].name)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.query("ALTER TABLE \"" + dbTable.name + "\" DROP CONSTRAINT \"" + dbTable.primaryKeys[0].name + "\"")];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!(primaryColumnNames.length > 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.query("ALTER TABLE \"" + dbTable.name + "\" ADD PRIMARY KEY (" + primaryColumnNames.join(", ") + ")")];
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
    OracleQueryRunner.prototype.createForeignKey = function (tableSchemaOrName, foreignKey) {
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
    OracleQueryRunner.prototype.createForeignKeys = function (tableSchemaOrName, foreignKeys) {
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
    OracleQueryRunner.prototype.dropForeignKey = function (tableSchemaOrName, foreignKey) {
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
    OracleQueryRunner.prototype.dropForeignKeys = function (tableSchemaOrName, foreignKeys) {
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
    OracleQueryRunner.prototype.createIndex = function (tableName, index) {
        return __awaiter(this, void 0, void 0, function () {
            var columns, sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        columns = index.columnNames.map(function (columnName) { return "\"" + columnName + "\""; }).join(", ");
                        sql = "CREATE " + (index.isUnique ? "UNIQUE" : "") + " INDEX \"" + index.name + "\" ON \"" + tableName + "\"(" + columns + ")";
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
    OracleQueryRunner.prototype.dropIndex = function (tableName, indexName) {
        return __awaiter(this, void 0, void 0, function () {
            var sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        sql = "ALTER TABLE \"" + tableName + "\" DROP INDEX \"" + indexName + "\"";
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
    OracleQueryRunner.prototype.normalizeType = function (typeOptions) {
        switch (typeOptions.type) {
            case "string":
                return "varchar2(" + (typeOptions.length ? typeOptions.length : 255) + ")";
            case "text":
                return "clob";
            case "boolean":
                return "number(1)";
            case "integer":
            case "int":
                // if (column.isGenerated)
                //     return `number(22)`;
                if (typeOptions.precision && typeOptions.scale)
                    return "number(" + typeOptions.precision + "," + typeOptions.scale + ")";
                if (typeOptions.precision)
                    return "number(" + typeOptions.precision + ",0)";
                if (typeOptions.scale)
                    return "number(0," + typeOptions.scale + ")";
                return "number(10,0)";
            case "smallint":
                return "number(5)";
            case "bigint":
                return "number(20)";
            case "float":
                if (typeOptions.precision && typeOptions.scale)
                    return "float(" + typeOptions.precision + "," + typeOptions.scale + ")";
                if (typeOptions.precision)
                    return "float(" + typeOptions.precision + ",0)";
                if (typeOptions.scale)
                    return "float(0," + typeOptions.scale + ")";
                return "float(126)";
            case "double":
            case "number":
                return "float(126)";
            case "decimal":
                if (typeOptions.precision && typeOptions.scale) {
                    return "decimal(" + typeOptions.precision + "," + typeOptions.scale + ")";
                }
                else if (typeOptions.scale) {
                    return "decimal(0," + typeOptions.scale + ")";
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
                return "date";
            case "datetime":
                return "timestamp(0)";
            case "json":
                return "clob";
            case "simple_array":
                return typeOptions.length ? "varchar2(" + typeOptions.length + ")" : "text";
        }
        throw new DataTypeNotSupportedByDriverError_1.DataTypeNotSupportedByDriverError(typeOptions.type, "Oracle");
    };
    /**
     * Checks if "DEFAULT" values in the column metadata and in the database schema are equal.
     */
    OracleQueryRunner.prototype.compareDefaultValues = function (columnMetadataValue, databaseValue) {
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
    OracleQueryRunner.prototype.truncate = function (tableName) {
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
    Object.defineProperty(OracleQueryRunner.prototype, "dbName", {
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
    OracleQueryRunner.prototype.parametrize = function (objectLiteral) {
        var _this = this;
        return Object.keys(objectLiteral).map(function (key) { return _this.driver.escapeColumnName(key) + "=:" + key; });
    };
    /**
     * Builds a query for create column.
     */
    OracleQueryRunner.prototype.buildCreateColumnSql = function (column) {
        var c = "\"" + column.name + "\" " + column.type;
        if (column.isNullable !== true && !column.isGenerated)
            c += " NOT NULL";
        // if (column.isPrimary === true && addPrimary)
        //     c += " PRIMARY KEY";
        if (column.isGenerated === true)
            c += " GENERATED BY DEFAULT ON NULL AS IDENTITY";
        // if (column.comment) // todo: less priority, fix it later
        //     c += " COMMENT '" + column.comment + "'";
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
    return OracleQueryRunner;
}());
exports.OracleQueryRunner = OracleQueryRunner;

//# sourceMappingURL=OracleQueryRunner.js.map
