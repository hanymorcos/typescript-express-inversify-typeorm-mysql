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
var IndexSchema_1 = require("../../schema-builder/schema/IndexSchema");
var ForeignKeySchema_1 = require("../../schema-builder/schema/ForeignKeySchema");
var PrimaryKeySchema_1 = require("../../schema-builder/schema/PrimaryKeySchema");
var QueryRunnerAlreadyReleasedError_1 = require("../../query-runner/error/QueryRunnerAlreadyReleasedError");
/**
 * Runs queries on a single postgres database connection.
 */
var PostgresQueryRunner = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function PostgresQueryRunner(databaseConnection, driver, logger) {
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
        this.schemaName = driver.schemaName || "public";
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Releases database connection. This is needed when using connection pooling.
     * If connection is not from a pool, it should not be released.
     */
    PostgresQueryRunner.prototype.release = function () {
        if (this.databaseConnection.releaseCallback) {
            this.isReleased = true;
            return this.databaseConnection.releaseCallback();
        }
        return Promise.resolve();
    };
    /**
     * Removes all tables from the currently connected database.
     */
    PostgresQueryRunner.prototype.clearDatabase = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var selectDropsQuery, dropQueries, error_1;
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
                        _a.trys.push([2, 6, 8, 10]);
                        selectDropsQuery = "SELECT 'DROP TABLE IF EXISTS \"' || tablename || '\" CASCADE;' as query FROM pg_tables WHERE schemaname = '" + this.schemaName + "'";
                        return [4 /*yield*/, this.query(selectDropsQuery)];
                    case 3:
                        dropQueries = _a.sent();
                        return [4 /*yield*/, Promise.all(dropQueries.map(function (q) { return _this.query(q["query"]); }))];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.commitTransaction()];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 10];
                    case 6:
                        error_1 = _a.sent();
                        return [4 /*yield*/, this.rollbackTransaction()];
                    case 7:
                        _a.sent();
                        throw error_1;
                    case 8: return [4 /*yield*/, this.release()];
                    case 9:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Starts transaction.
     */
    PostgresQueryRunner.prototype.beginTransaction = function () {
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
    PostgresQueryRunner.prototype.commitTransaction = function () {
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
    PostgresQueryRunner.prototype.rollbackTransaction = function () {
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
    PostgresQueryRunner.prototype.isTransactionActive = function () {
        return this.databaseConnection.isTransactionActive;
    };
    /**
     * Executes a given SQL query.
     */
    PostgresQueryRunner.prototype.query = function (query, parameters) {
        var _this = this;
        if (this.isReleased)
            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
        // console.log("query: ", query);
        // console.log("parameters: ", parameters);
        return new Promise(function (ok, fail) {
            _this.logger.logQuery(query, parameters);
            _this.databaseConnection.connection.query(query, parameters, function (err, result) {
                if (err) {
                    _this.logger.logFailedQuery(query, parameters);
                    _this.logger.logQueryError(err);
                    fail(err);
                }
                else {
                    ok(result.rows);
                }
            });
        });
    };
    /**
     * Insert a new row into given table.
     */
    PostgresQueryRunner.prototype.insert = function (tableName, keyValues, generatedColumn) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var keys, columns, values, sql, parameters, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        keys = Object.keys(keyValues);
                        columns = keys.map(function (key) { return _this.driver.escapeColumnName(key); }).join(", ");
                        values = keys.map(function (key, index) { return "$" + (index + 1); }).join(",");
                        sql = columns.length > 0
                            ? "INSERT INTO " + this.driver.escapeTableName(tableName) + "(" + columns + ") VALUES (" + values + ") " + (generatedColumn ? " RETURNING " + this.driver.escapeColumnName(generatedColumn.name) : "")
                            : "INSERT INTO " + this.driver.escapeTableName(tableName) + " DEFAULT VALUES " + (generatedColumn ? " RETURNING " + this.driver.escapeColumnName(generatedColumn.name) : "");
                        parameters = keys.map(function (key) { return keyValues[key]; });
                        return [4 /*yield*/, this.query(sql, parameters)];
                    case 1:
                        result = _a.sent();
                        if (generatedColumn)
                            return [2 /*return*/, result[0][generatedColumn.name]];
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Updates rows that match given conditions in the given table.
     */
    PostgresQueryRunner.prototype.update = function (tableName, valuesMap, conditions) {
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
    PostgresQueryRunner.prototype.delete = function (tableName, conditions, maybeParameters) {
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
    PostgresQueryRunner.prototype.insertIntoClosureTable = function (tableName, newEntityId, parentId, hasLevel) {
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
    PostgresQueryRunner.prototype.loadTableSchema = function (tableName) {
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
    PostgresQueryRunner.prototype.loadTableSchemas = function (tableNames) {
        return __awaiter(this, void 0, void 0, function () {
            var tableNamesString, tablesSql, columnsSql, indicesSql, foreignKeysSql, uniqueKeysSql, primaryKeysSql, _a, dbTables, dbColumns, dbIndices, dbForeignKeys, dbUniqueKeys, primaryKeys;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        // if no tables given then no need to proceed
                        if (!tableNames || !tableNames.length)
                            return [2 /*return*/, []];
                        tableNamesString = tableNames.map(function (name) { return "'" + name + "'"; }).join(", ");
                        tablesSql = "SELECT * FROM information_schema.tables WHERE table_catalog = '" + this.dbName + "' AND table_schema = '" + this.schemaName + "' AND table_name IN (" + tableNamesString + ")";
                        columnsSql = "SELECT * FROM information_schema.columns WHERE table_catalog = '" + this.dbName + "' AND table_schema = '" + this.schemaName + "'";
                        indicesSql = "SELECT t.relname AS table_name, i.relname AS index_name, a.attname AS column_name  FROM pg_class t, pg_class i, pg_index ix, pg_attribute a\nWHERE t.oid = ix.indrelid AND i.oid = ix.indexrelid AND a.attrelid = t.oid\nAND a.attnum = ANY(ix.indkey) AND t.relkind = 'r' AND t.relname IN (" + tableNamesString + ") ORDER BY t.relname, i.relname";
                        foreignKeysSql = "SELECT table_name, constraint_name FROM information_schema.table_constraints WHERE table_catalog = '" + this.dbName + "' AND constraint_type = 'FOREIGN KEY'";
                        uniqueKeysSql = "SELECT * FROM information_schema.table_constraints WHERE table_catalog = '" + this.dbName + "' AND constraint_type = 'UNIQUE'";
                        primaryKeysSql = "SELECT c.column_name, tc.table_name, tc.constraint_name FROM information_schema.table_constraints tc\nJOIN information_schema.constraint_column_usage AS ccu USING (constraint_schema, constraint_name)\nJOIN information_schema.columns AS c ON c.table_schema = tc.constraint_schema AND tc.table_name = c.table_name AND ccu.column_name = c.column_name\nwhere constraint_type = 'PRIMARY KEY' and tc.table_catalog = '" + this.dbName + "'";
                        return [4 /*yield*/, Promise.all([
                                this.query(tablesSql),
                                this.query(columnsSql),
                                this.query(indicesSql),
                                this.query(foreignKeysSql),
                                this.query(uniqueKeysSql),
                                this.query(primaryKeysSql),
                            ])];
                    case 1:
                        _a = _b.sent(), dbTables = _a[0], dbColumns = _a[1], dbIndices = _a[2], dbForeignKeys = _a[3], dbUniqueKeys = _a[4], primaryKeys = _a[5];
                        // if tables were not found in the db, no need to proceed
                        if (!dbTables.length)
                            return [2 /*return*/, []];
                        // create table schemas for loaded tables
                        return [2 /*return*/, dbTables.map(function (dbTable) {
                                var tableSchema = new TableSchema_1.TableSchema(dbTable["table_name"]);
                                // create column schemas from the loaded columns
                                tableSchema.columns = dbColumns
                                    .filter(function (dbColumn) { return dbColumn["table_name"] === tableSchema.name; })
                                    .map(function (dbColumn) {
                                    var columnType = dbColumn["data_type"].toLowerCase() + (dbColumn["character_maximum_length"] !== undefined && dbColumn["character_maximum_length"] !== null ? ("(" + dbColumn["character_maximum_length"] + ")") : "");
                                    var isGenerated = dbColumn["column_default"] === "nextval('" + dbColumn["table_name"] + "_id_seq'::regclass)"
                                        || dbColumn["column_default"] === "nextval('\"" + dbColumn["table_name"] + "_id_seq\"'::regclass)"
                                        || /^uuid\_generate\_v\d\(\)/.test(dbColumn["column_default"]);
                                    var columnSchema = new ColumnSchema_1.ColumnSchema();
                                    columnSchema.name = dbColumn["column_name"];
                                    columnSchema.type = columnType;
                                    columnSchema.default = dbColumn["column_default"] !== null && dbColumn["column_default"] !== undefined ? dbColumn["column_default"] : undefined;
                                    columnSchema.isNullable = dbColumn["is_nullable"] === "YES";
                                    // columnSchema.isPrimary = dbColumn["column_key"].indexOf("PRI") !== -1;
                                    columnSchema.isGenerated = isGenerated;
                                    columnSchema.comment = ""; // dbColumn["COLUMN_COMMENT"];
                                    columnSchema.isUnique = !!dbUniqueKeys.find(function (key) { return key["constraint_name"] === "uk_" + dbColumn["table_name"] + "_" + dbColumn["column_name"]; });
                                    return columnSchema;
                                });
                                // create primary key schema
                                tableSchema.primaryKeys = primaryKeys
                                    .filter(function (primaryKey) { return primaryKey["table_name"] === tableSchema.name; })
                                    .map(function (primaryKey) { return new PrimaryKeySchema_1.PrimaryKeySchema(primaryKey["constraint_name"], primaryKey["column_name"]); });
                                // create foreign key schemas from the loaded indices
                                tableSchema.foreignKeys = dbForeignKeys
                                    .filter(function (dbForeignKey) { return dbForeignKey["table_name"] === tableSchema.name; })
                                    .map(function (dbForeignKey) { return new ForeignKeySchema_1.ForeignKeySchema(dbForeignKey["constraint_name"], [], [], "", ""); }); // todo: fix missing params
                                // create unique key schemas from the loaded indices
                                /*tableSchema.uniqueKeys = dbUniqueKeys
                                    .filter(dbUniqueKey => dbUniqueKey["table_name"] === tableSchema.name)
                                    .map(dbUniqueKey => {
                                        return new UniqueKeySchema(dbUniqueKey["TABLE_NAME"], dbUniqueKey["CONSTRAINT_NAME"], [/!* todo *!/]);
                                    });*/
                                // create index schemas from the loaded indices
                                tableSchema.indices = dbIndices
                                    .filter(function (dbIndex) {
                                    return dbIndex["table_name"] === tableSchema.name &&
                                        (!tableSchema.foreignKeys.find(function (foreignKey) { return foreignKey.name === dbIndex["index_name"]; })) &&
                                        (!tableSchema.primaryKeys.find(function (primaryKey) { return primaryKey.name === dbIndex["index_name"]; })) &&
                                        (!dbUniqueKeys.find(function (key) { return key["constraint_name"] === dbIndex["index_name"]; }));
                                })
                                    .map(function (dbIndex) { return dbIndex["index_name"]; })
                                    .filter(function (value, index, self) { return self.indexOf(value) === index; }) // unqiue
                                    .map(function (dbIndexName) {
                                    var columnNames = dbIndices
                                        .filter(function (dbIndex) { return dbIndex["table_name"] === tableSchema.name && dbIndex["index_name"] === dbIndexName; })
                                        .map(function (dbIndex) { return dbIndex["column_name"]; });
                                    return new IndexSchema_1.IndexSchema(dbTable["TABLE_NAME"], dbIndexName, columnNames, false /* todo: uniqueness */);
                                });
                                return tableSchema;
                            })];
                }
            });
        });
    };
    /**
     * Checks if table with the given name exist in the database.
     */
    PostgresQueryRunner.prototype.hasTable = function (tableName) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "SELECT * FROM information_schema.tables WHERE table_catalog = '" + this.dbName + "' AND table_schema = '" + this.schemaName + "' AND table_name = '" + tableName + "'";
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
    PostgresQueryRunner.prototype.createTable = function (table) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var columnDefinitions, sql, primaryKeyColumns;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        columnDefinitions = table.columns.map(function (column) { return _this.buildCreateColumnSql(column, false); }).join(", ");
                        sql = "CREATE SCHEMA IF NOT EXISTS \"" + this.schemaName + "\";CREATE TABLE \"" + table.name + "\" (" + columnDefinitions;
                        sql += table.columns
                            .filter(function (column) { return column.isUnique; })
                            .map(function (column) { return ", CONSTRAINT \"uk_" + table.name + "_" + column.name + "\" UNIQUE (\"" + column.name + "\")"; })
                            .join(" ");
                        primaryKeyColumns = table.columns.filter(function (column) { return column.isPrimary && !column.isGenerated; });
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
    PostgresQueryRunner.prototype.hasColumn = function (tableName, columnName) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "SELECT * FROM information_schema.columns WHERE table_catalog = '" + this.dbName + "' AND table_schema = '" + this.schemaName + "' AND table_name = '" + tableName + "' AND column_name = '" + columnName + "'";
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
    PostgresQueryRunner.prototype.addColumn = function (tableSchemaOrName, column) {
        return __awaiter(this, void 0, void 0, function () {
            var tableName, sql;
            return __generator(this, function (_a) {
                if (this.isReleased)
                    throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                tableName = tableSchemaOrName instanceof TableSchema_1.TableSchema ? tableSchemaOrName.name : tableSchemaOrName;
                sql = "ALTER TABLE \"" + tableName + "\" ADD " + this.buildCreateColumnSql(column, false);
                return [2 /*return*/, this.query(sql)];
            });
        });
    };
    /**
     * Creates a new columns from the column schema in the table.
     */
    PostgresQueryRunner.prototype.addColumns = function (tableSchemaOrName, columns) {
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
    PostgresQueryRunner.prototype.renameColumn = function (tableSchemaOrName, oldColumnSchemaOrName, newColumnSchemaOrName) {
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
    PostgresQueryRunner.prototype.changeColumn = function (tableSchemaOrName, oldColumnSchemaOrName, newColumn) {
        return __awaiter(this, void 0, void 0, function () {
            var tableSchema, oldColumn, sql, sql;
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
                        if (!(oldColumn.type !== newColumn.type ||
                            oldColumn.name !== newColumn.name)) return [3 /*break*/, 5];
                        sql = "ALTER TABLE \"" + tableSchema.name + "\" ALTER COLUMN \"" + oldColumn.name + "\"";
                        if (oldColumn.type !== newColumn.type) {
                            sql += " TYPE " + newColumn.type;
                        }
                        if (oldColumn.name !== newColumn.name) {
                            sql += " RENAME TO " + newColumn.name;
                        }
                        return [4 /*yield*/, this.query(sql)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        if (!(oldColumn.isNullable !== newColumn.isNullable)) return [3 /*break*/, 7];
                        sql = "ALTER TABLE \"" + tableSchema.name + "\" ALTER COLUMN \"" + oldColumn.name + "\"";
                        if (newColumn.isNullable) {
                            sql += " DROP NOT NULL";
                        }
                        else {
                            sql += " SET NOT NULL";
                        }
                        return [4 /*yield*/, this.query(sql)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        if (!(oldColumn.isGenerated !== newColumn.isGenerated)) return [3 /*break*/, 13];
                        if (!(!oldColumn.isGenerated && newColumn.type !== "uuid")) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.query("CREATE SEQUENCE \"" + tableSchema.name + "_id_seq\" OWNED BY \"" + tableSchema.name + "\".\"" + oldColumn.name + "\"")];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, this.query("ALTER TABLE \"" + tableSchema.name + "\" ALTER COLUMN \"" + oldColumn.name + "\" SET DEFAULT nextval('\"" + tableSchema.name + "_id_seq\"')")];
                    case 9:
                        _a.sent();
                        return [3 /*break*/, 13];
                    case 10: return [4 /*yield*/, this.query("ALTER TABLE \"" + tableSchema.name + "\" ALTER COLUMN \"" + oldColumn.name + "\" DROP DEFAULT")];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, this.query("DROP SEQUENCE \"" + tableSchema.name + "_id_seq\"")];
                    case 12:
                        _a.sent();
                        _a.label = 13;
                    case 13:
                        if (!(oldColumn.comment !== newColumn.comment)) return [3 /*break*/, 15];
                        return [4 /*yield*/, this.query("COMMENT ON COLUMN \"" + tableSchema.name + "\".\"" + oldColumn.name + "\" is '" + newColumn.comment + "'")];
                    case 14:
                        _a.sent();
                        _a.label = 15;
                    case 15:
                        if (!(oldColumn.isUnique !== newColumn.isUnique)) return [3 /*break*/, 19];
                        if (!(newColumn.isUnique === true)) return [3 /*break*/, 17];
                        return [4 /*yield*/, this.query("ALTER TABLE \"" + tableSchema.name + "\" ADD CONSTRAINT \"uk_" + newColumn.name + "\" UNIQUE (\"" + newColumn.name + "\")")];
                    case 16:
                        _a.sent();
                        return [3 /*break*/, 19];
                    case 17:
                        if (!(newColumn.isUnique === false)) return [3 /*break*/, 19];
                        return [4 /*yield*/, this.query("ALTER TABLE \"" + tableSchema.name + "\" DROP CONSTRAINT \"uk_" + newColumn.name + "\"")];
                    case 18:
                        _a.sent();
                        _a.label = 19;
                    case 19: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Changes a column in the table.
     */
    PostgresQueryRunner.prototype.changeColumns = function (tableSchema, changedColumns) {
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
    PostgresQueryRunner.prototype.dropColumn = function (tableSchemaOrName, columnSchemaOrName) {
        return __awaiter(this, void 0, void 0, function () {
            var tableName, columnName;
            return __generator(this, function (_a) {
                tableName = tableSchemaOrName instanceof TableSchema_1.TableSchema ? tableSchemaOrName.name : tableSchemaOrName;
                columnName = columnSchemaOrName instanceof ColumnSchema_1.ColumnSchema ? columnSchemaOrName.name : columnSchemaOrName;
                return [2 /*return*/, this.query("ALTER TABLE \"" + tableName + "\" DROP \"" + columnName + "\"")];
            });
        });
    };
    /**
     * Drops the columns in the table.
     */
    PostgresQueryRunner.prototype.dropColumns = function (tableSchemaOrName, columnSchemasOrNames) {
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
    PostgresQueryRunner.prototype.updatePrimaryKeys = function (dbTable) {
        return __awaiter(this, void 0, void 0, function () {
            var primaryColumnNames;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        primaryColumnNames = dbTable.primaryKeys.map(function (primaryKey) { return "\"" + primaryKey.columnName + "\""; });
                        return [4 /*yield*/, this.query("ALTER TABLE \"" + dbTable.name + "\" DROP CONSTRAINT IF EXISTS \"" + dbTable.name + "_pkey\"")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.query("DROP INDEX IF EXISTS \"" + dbTable.name + "_pkey\"")];
                    case 2:
                        _a.sent();
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
    PostgresQueryRunner.prototype.createForeignKey = function (tableSchemaOrName, foreignKey) {
        return __awaiter(this, void 0, void 0, function () {
            var tableName, sql;
            return __generator(this, function (_a) {
                if (this.isReleased)
                    throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                tableName = tableSchemaOrName instanceof TableSchema_1.TableSchema ? tableSchemaOrName.name : tableSchemaOrName;
                sql = "ALTER TABLE \"" + tableName + "\" ADD CONSTRAINT \"" + foreignKey.name + "\" " +
                    ("FOREIGN KEY (\"" + foreignKey.columnNames.join("\", \"") + "\") ") +
                    ("REFERENCES \"" + foreignKey.referencedTableName + "\"(\"" + foreignKey.referencedColumnNames.join("\", \"") + "\")");
                if (foreignKey.onDelete)
                    sql += " ON DELETE " + foreignKey.onDelete;
                return [2 /*return*/, this.query(sql)];
            });
        });
    };
    /**
     * Creates a new foreign keys.
     */
    PostgresQueryRunner.prototype.createForeignKeys = function (tableSchemaOrName, foreignKeys) {
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
    PostgresQueryRunner.prototype.dropForeignKey = function (tableSchemaOrName, foreignKey) {
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
    PostgresQueryRunner.prototype.dropForeignKeys = function (tableSchemaOrName, foreignKeys) {
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
    PostgresQueryRunner.prototype.createIndex = function (tableName, index) {
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
    PostgresQueryRunner.prototype.dropIndex = function (tableName, indexName, isGenerated) {
        if (isGenerated === void 0) { isGenerated = false; }
        return __awaiter(this, void 0, void 0, function () {
            var sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        if (!isGenerated) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.query("ALTER SEQUENCE \"" + tableName + "_id_seq\" OWNED BY NONE")];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        sql = "DROP INDEX \"" + indexName + "\"";
                        return [4 /*yield*/, this.query(sql)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Creates a database type from a given column metadata.
     */
    PostgresQueryRunner.prototype.normalizeType = function (typeOptions) {
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
            case "jsonb":
                return "jsonb";
            case "simple_array":
                return typeOptions.length ? "character varying(" + typeOptions.length + ")" : "text";
            case "uuid":
                return "uuid";
        }
        throw new DataTypeNotSupportedByDriverError_1.DataTypeNotSupportedByDriverError(typeOptions.type, "Postgres");
    };
    /**
     * Checks if "DEFAULT" values in the column metadata and in the database schema are equal.
     */
    PostgresQueryRunner.prototype.compareDefaultValues = function (columnMetadataValue, databaseValue) {
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
    PostgresQueryRunner.prototype.truncate = function (tableName) {
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
    Object.defineProperty(PostgresQueryRunner.prototype, "dbName", {
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
    PostgresQueryRunner.prototype.parametrize = function (objectLiteral, startIndex) {
        var _this = this;
        if (startIndex === void 0) { startIndex = 0; }
        return Object.keys(objectLiteral).map(function (key, index) { return _this.driver.escapeColumnName(key) + "=$" + (startIndex + index + 1); });
    };
    /**
     * Builds a query for create column.
     */
    PostgresQueryRunner.prototype.buildCreateColumnSql = function (column, skipPrimary) {
        var c = "\"" + column.name + "\"";
        if (column.isGenerated === true && column.type !== "uuid")
            c += " SERIAL";
        if (!column.isGenerated || column.type === "uuid")
            c += " " + column.type;
        if (column.isNullable !== true)
            c += " NOT NULL";
        if (column.isGenerated)
            c += " PRIMARY KEY";
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
        if (column.isGenerated && column.type === "uuid" && !column.default)
            c += " DEFAULT uuid_generate_v4()";
        return c;
    };
    return PostgresQueryRunner;
}());
exports.PostgresQueryRunner = PostgresQueryRunner;

//# sourceMappingURL=PostgresQueryRunner.js.map
