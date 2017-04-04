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
var TableSchema_1 = require("./schema/TableSchema");
var ColumnSchema_1 = require("./schema/ColumnSchema");
var ForeignKeySchema_1 = require("./schema/ForeignKeySchema");
var IndexSchema_1 = require("./schema/IndexSchema");
var PrimaryKeySchema_1 = require("./schema/PrimaryKeySchema");
var PromiseUtils_1 = require("../util/PromiseUtils");
/**
 * Creates complete tables schemas in the database based on the entity metadatas.
 *
 * Steps how schema is being built:
 * 1. load list of all tables with complete column and keys information from the db
 * 2. drop all (old) foreign keys that exist in the table, but does not exist in the metadata
 * 3. create new tables that does not exist in the db, but exist in the metadata
 * 4. drop all columns exist (left old) in the db table, but does not exist in the metadata
 * 5. add columns from metadata which does not exist in the table
 * 6. update all exist columns which metadata has changed
 * 7. update primary keys - update old and create new primary key from changed columns
 * 8. create foreign keys which does not exist in the table yet
 * 9. create indices which are missing in db yet, and drops indices which exist in the db, but does not exist in the metadata anymore
 */
var SchemaBuilder = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    /**
     * @param driver Driver needs to create a query runner
     * @param logger Used to log schema creation events
     * @param entityMetadatas All entities to create schema for
     */
    function SchemaBuilder(driver, logger, entityMetadatas) {
        this.driver = driver;
        this.logger = logger;
        this.entityMetadatas = entityMetadatas;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Creates complete schemas for the given entity metadatas.
     */
    SchemaBuilder.prototype.build = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.driver.createQueryRunner()];
                    case 1:
                        _a.queryRunner = _c.sent();
                        _b = this;
                        return [4 /*yield*/, this.loadTableSchemas()];
                    case 2:
                        _b.tableSchemas = _c.sent();
                        return [4 /*yield*/, this.queryRunner.beginTransaction()];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4:
                        _c.trys.push([4, 14, 16, 18]);
                        return [4 /*yield*/, this.dropOldForeignKeys()];
                    case 5:
                        _c.sent();
                        // await this.dropOldPrimaryKeys(); // todo: need to drop primary column because column updates are not possible
                        return [4 /*yield*/, this.createNewTables()];
                    case 6:
                        // await this.dropOldPrimaryKeys(); // todo: need to drop primary column because column updates are not possible
                        _c.sent();
                        return [4 /*yield*/, this.dropRemovedColumns()];
                    case 7:
                        _c.sent();
                        return [4 /*yield*/, this.addNewColumns()];
                    case 8:
                        _c.sent();
                        return [4 /*yield*/, this.updateExistColumns()];
                    case 9:
                        _c.sent();
                        return [4 /*yield*/, this.updatePrimaryKeys()];
                    case 10:
                        _c.sent();
                        return [4 /*yield*/, this.createForeignKeys()];
                    case 11:
                        _c.sent();
                        return [4 /*yield*/, this.createIndices()];
                    case 12:
                        _c.sent();
                        return [4 /*yield*/, this.queryRunner.commitTransaction()];
                    case 13:
                        _c.sent();
                        return [3 /*break*/, 18];
                    case 14:
                        error_1 = _c.sent();
                        return [4 /*yield*/, this.queryRunner.rollbackTransaction()];
                    case 15:
                        _c.sent();
                        throw error_1;
                    case 16: return [4 /*yield*/, this.queryRunner.release()];
                    case 17:
                        _c.sent();
                        return [7 /*endfinally*/];
                    case 18: return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(SchemaBuilder.prototype, "entityToSyncMetadatas", {
        // -------------------------------------------------------------------------
        // Private Methods
        // -------------------------------------------------------------------------
        get: function () {
            return this.entityMetadatas.filter(function (metadata) { return !metadata.table.skipSchemaSync; });
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Loads all table schemas from the database.
     */
    SchemaBuilder.prototype.loadTableSchemas = function () {
        var tableNames = this.entityToSyncMetadatas.map(function (metadata) { return metadata.table.name; });
        return this.queryRunner.loadTableSchemas(tableNames);
    };
    /**
     * Drops all (old) foreign keys that exist in the table schemas, but do not exist in the entity metadata.
     */
    SchemaBuilder.prototype.dropOldForeignKeys = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, PromiseUtils_1.PromiseUtils.runInSequence(this.entityToSyncMetadatas, function (metadata) { return __awaiter(_this, void 0, void 0, function () {
                            var tableSchema, foreignKeySchemasToDrop;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        tableSchema = this.tableSchemas.find(function (table) { return table.name === metadata.table.name; });
                                        if (!tableSchema)
                                            return [2 /*return*/];
                                        foreignKeySchemasToDrop = tableSchema.foreignKeys.filter(function (foreignKeySchema) {
                                            return !metadata.foreignKeys.find(function (metadataForeignKey) { return metadataForeignKey.name === foreignKeySchema.name; });
                                        });
                                        if (foreignKeySchemasToDrop.length === 0)
                                            return [2 /*return*/];
                                        this.logger.logSchemaBuild("dropping old foreign keys of " + tableSchema.name + ": " + foreignKeySchemasToDrop.map(function (dbForeignKey) { return dbForeignKey.name; }).join(", "));
                                        // remove foreign keys from the table schema
                                        tableSchema.removeForeignKeys(foreignKeySchemasToDrop);
                                        // drop foreign keys from the database
                                        return [4 /*yield*/, this.queryRunner.dropForeignKeys(tableSchema, foreignKeySchemasToDrop)];
                                    case 1:
                                        // drop foreign keys from the database
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Creates tables that do not exist in the database yet.
     * New tables are created without foreign and primary keys.
     * Primary key only can be created in conclusion with auto generated column.
     */
    SchemaBuilder.prototype.createNewTables = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, PromiseUtils_1.PromiseUtils.runInSequence(this.entityToSyncMetadatas, function (metadata) { return __awaiter(_this, void 0, void 0, function () {
                            var existTableSchema, tableSchema;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        existTableSchema = this.tableSchemas.find(function (table) { return table.name === metadata.table.name; });
                                        if (existTableSchema)
                                            return [2 /*return*/];
                                        this.logger.logSchemaBuild("creating a new table: " + metadata.table.name);
                                        tableSchema = new TableSchema_1.TableSchema(metadata.table.name, this.metadataColumnsToColumnSchemas(metadata.columns), true);
                                        this.tableSchemas.push(tableSchema);
                                        return [4 /*yield*/, this.queryRunner.createTable(tableSchema)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Drops all columns that exist in the table, but does not exist in the metadata (left old).
     * We drop their keys too, since it should be safe.
     */
    SchemaBuilder.prototype.dropRemovedColumns = function () {
        var _this = this;
        return PromiseUtils_1.PromiseUtils.runInSequence(this.entityToSyncMetadatas, function (metadata) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            var tableSchema, droppedColumnSchemas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tableSchema = this.tableSchemas.find(function (table) { return table.name === metadata.table.name; });
                        if (!tableSchema)
                            return [2 /*return*/];
                        droppedColumnSchemas = tableSchema.columns.filter(function (columnSchema) {
                            return !metadata.columns.find(function (columnMetadata) { return columnMetadata.name === columnSchema.name; });
                        });
                        if (droppedColumnSchemas.length === 0)
                            return [2 /*return*/];
                        // drop all foreign keys that has column to be removed in its columns
                        return [4 /*yield*/, Promise.all(droppedColumnSchemas.map(function (droppedColumnSchema) {
                                return _this.dropColumnReferencedForeignKeys(metadata.table.name, droppedColumnSchema.name);
                            }))];
                    case 1:
                        // drop all foreign keys that has column to be removed in its columns
                        _a.sent();
                        // drop all indices that point to this column
                        return [4 /*yield*/, Promise.all(droppedColumnSchemas.map(function (droppedColumnSchema) {
                                return _this.dropColumnReferencedIndices(metadata.table.name, droppedColumnSchema.name);
                            }))];
                    case 2:
                        // drop all indices that point to this column
                        _a.sent();
                        this.logger.logSchemaBuild("columns dropped in " + tableSchema.name + ": " + droppedColumnSchemas.map(function (column) { return column.name; }).join(", "));
                        // remove columns from the table schema and primary keys of it if its used in the primary keys
                        tableSchema.removeColumns(droppedColumnSchemas);
                        tableSchema.removePrimaryKeysOfColumns(droppedColumnSchemas);
                        // drop columns from the database
                        return [4 /*yield*/, this.queryRunner.dropColumns(tableSchema, droppedColumnSchemas)];
                    case 3:
                        // drop columns from the database
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * Adds columns from metadata which does not exist in the table.
     * Columns are created without keys.
     */
    SchemaBuilder.prototype.addNewColumns = function () {
        var _this = this;
        return PromiseUtils_1.PromiseUtils.runInSequence(this.entityToSyncMetadatas, function (metadata) { return __awaiter(_this, void 0, void 0, function () {
            var tableSchema, newColumnMetadatas, newColumnSchemas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tableSchema = this.tableSchemas.find(function (table) { return table.name === metadata.table.name; });
                        if (!tableSchema)
                            return [2 /*return*/];
                        newColumnMetadatas = metadata.columns.filter(function (columnMetadata) {
                            return !tableSchema.columns.find(function (columnSchema) { return columnSchema.name === columnMetadata.name; });
                        });
                        if (newColumnMetadatas.length === 0)
                            return [2 /*return*/];
                        this.logger.logSchemaBuild("new columns added: " + newColumnMetadatas.map(function (column) { return column.name; }).join(", "));
                        newColumnSchemas = this.metadataColumnsToColumnSchemas(newColumnMetadatas);
                        return [4 /*yield*/, this.queryRunner.addColumns(tableSchema, newColumnSchemas)];
                    case 1:
                        _a.sent();
                        tableSchema.addColumns(newColumnSchemas);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * Update all exist columns which metadata has changed.
     * Still don't create keys. Also we don't touch foreign keys of the changed columns.
     */
    SchemaBuilder.prototype.updateExistColumns = function () {
        var _this = this;
        return PromiseUtils_1.PromiseUtils.runInSequence(this.entityToSyncMetadatas, function (metadata) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            var tableSchema, updatedColumnSchemas, dropRelatedForeignKeysPromises, dropRelatedIndicesPromises, newAndOldColumnSchemas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tableSchema = this.tableSchemas.find(function (table) { return table.name === metadata.table.name; });
                        if (!tableSchema)
                            return [2 /*return*/];
                        updatedColumnSchemas = tableSchema.findChangedColumns(this.queryRunner, metadata.columns);
                        if (updatedColumnSchemas.length === 0)
                            return [2 /*return*/];
                        this.logger.logSchemaBuild("columns changed in " + tableSchema.name + ". updating: " + updatedColumnSchemas.map(function (column) { return column.name; }).join(", "));
                        dropRelatedForeignKeysPromises = updatedColumnSchemas
                            .filter(function (changedColumnSchema) { return !!metadata.columns.find(function (columnMetadata) { return columnMetadata.name === changedColumnSchema.name; }); })
                            .map(function (changedColumnSchema) { return _this.dropColumnReferencedForeignKeys(metadata.table.name, changedColumnSchema.name); });
                        // wait until all related foreign keys are dropped
                        return [4 /*yield*/, Promise.all(dropRelatedForeignKeysPromises)];
                    case 1:
                        // wait until all related foreign keys are dropped
                        _a.sent();
                        dropRelatedIndicesPromises = updatedColumnSchemas
                            .filter(function (changedColumnSchema) { return !!metadata.columns.find(function (columnMetadata) { return columnMetadata.name === changedColumnSchema.name; }); })
                            .map(function (changedColumnSchema) { return _this.dropColumnReferencedIndices(metadata.table.name, changedColumnSchema.name); });
                        // wait until all related indices are dropped
                        return [4 /*yield*/, Promise.all(dropRelatedIndicesPromises)];
                    case 2:
                        // wait until all related indices are dropped
                        _a.sent();
                        newAndOldColumnSchemas = updatedColumnSchemas.map(function (changedColumnSchema) {
                            var columnMetadata = metadata.columns.find(function (column) { return column.name === changedColumnSchema.name; });
                            var newColumnSchema = ColumnSchema_1.ColumnSchema.create(columnMetadata, _this.queryRunner.normalizeType(columnMetadata));
                            tableSchema.replaceColumn(changedColumnSchema, newColumnSchema);
                            return {
                                newColumn: newColumnSchema,
                                oldColumn: changedColumnSchema
                            };
                        });
                        return [2 /*return*/, this.queryRunner.changeColumns(tableSchema, newAndOldColumnSchemas)];
                }
            });
        }); });
    };
    /**
     * Creates primary keys which does not exist in the table yet.
     */
    SchemaBuilder.prototype.updatePrimaryKeys = function () {
        var _this = this;
        return PromiseUtils_1.PromiseUtils.runInSequence(this.entityToSyncMetadatas, function (metadata) { return __awaiter(_this, void 0, void 0, function () {
            var tableSchema, metadataPrimaryColumns, addedKeys, droppedKeys;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tableSchema = this.tableSchemas.find(function (table) { return table.name === metadata.table.name && !table.justCreated; });
                        if (!tableSchema)
                            return [2 /*return*/];
                        metadataPrimaryColumns = metadata.columns.filter(function (column) { return column.isPrimary && !column.isGenerated; });
                        addedKeys = metadataPrimaryColumns
                            .filter(function (primaryKey) {
                            return !tableSchema.primaryKeysWithoutGenerated.find(function (dbPrimaryKey) { return dbPrimaryKey.columnName === primaryKey.name; });
                        })
                            .map(function (primaryKey) { return new PrimaryKeySchema_1.PrimaryKeySchema("", primaryKey.name); });
                        droppedKeys = tableSchema.primaryKeysWithoutGenerated.filter(function (primaryKeySchema) {
                            return !metadataPrimaryColumns.find(function (primaryKeyMetadata) { return primaryKeyMetadata.name === primaryKeySchema.columnName; });
                        });
                        if (addedKeys.length === 0 && droppedKeys.length === 0)
                            return [2 /*return*/];
                        this.logger.logSchemaBuild("primary keys of " + tableSchema.name + " has changed: dropped - " + (droppedKeys.map(function (key) { return key.columnName; }).join(", ") || "nothing") + "; added - " + (addedKeys.map(function (key) { return key.columnName; }).join(", ") || "nothing"));
                        tableSchema.addPrimaryKeys(addedKeys);
                        tableSchema.removePrimaryKeys(droppedKeys);
                        return [4 /*yield*/, this.queryRunner.updatePrimaryKeys(tableSchema)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * Creates foreign keys which does not exist in the table yet.
     */
    SchemaBuilder.prototype.createForeignKeys = function () {
        var _this = this;
        return PromiseUtils_1.PromiseUtils.runInSequence(this.entityToSyncMetadatas, function (metadata) { return __awaiter(_this, void 0, void 0, function () {
            var tableSchema, newKeys, dbForeignKeys;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tableSchema = this.tableSchemas.find(function (table) { return table.name === metadata.table.name; });
                        if (!tableSchema)
                            return [2 /*return*/];
                        newKeys = metadata.foreignKeys.filter(function (foreignKey) {
                            return !tableSchema.foreignKeys.find(function (dbForeignKey) { return dbForeignKey.name === foreignKey.name; });
                        });
                        if (newKeys.length === 0)
                            return [2 /*return*/];
                        dbForeignKeys = newKeys.map(function (foreignKeyMetadata) { return ForeignKeySchema_1.ForeignKeySchema.create(foreignKeyMetadata); });
                        this.logger.logSchemaBuild("creating a foreign keys: " + newKeys.map(function (key) { return key.name; }).join(", "));
                        return [4 /*yield*/, this.queryRunner.createForeignKeys(tableSchema, dbForeignKeys)];
                    case 1:
                        _a.sent();
                        tableSchema.addForeignKeys(dbForeignKeys);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * Creates indices which are missing in db yet, and drops indices which exist in the db,
     * but does not exist in the metadata anymore.
     */
    SchemaBuilder.prototype.createIndices = function () {
        var _this = this;
        // return Promise.all(this.entityMetadatas.map(metadata => this.createIndices(metadata.table, metadata.indices)));
        return PromiseUtils_1.PromiseUtils.runInSequence(this.entityToSyncMetadatas, function (metadata) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            var tableSchema, dropQueries, addQueries;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tableSchema = this.tableSchemas.find(function (table) { return table.name === metadata.table.name; });
                        if (!tableSchema)
                            return [2 /*return*/];
                        dropQueries = tableSchema.indices
                            .filter(function (indexSchema) { return !metadata.indices.find(function (indexMetadata) { return indexMetadata.name === indexSchema.name; }); })
                            .map(function (indexSchema) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        this.logger.logSchemaBuild("dropping an index: " + indexSchema.name);
                                        tableSchema.removeIndex(indexSchema);
                                        return [4 /*yield*/, this.queryRunner.dropIndex(metadata.table.name, indexSchema.name)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        addQueries = metadata.indices
                            .filter(function (indexMetadata) { return !tableSchema.indices.find(function (indexSchema) { return indexSchema.name === indexMetadata.name; }); })
                            .map(function (indexMetadata) { return __awaiter(_this, void 0, void 0, function () {
                            var indexSchema;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        indexSchema = IndexSchema_1.IndexSchema.create(indexMetadata);
                                        tableSchema.indices.push(indexSchema);
                                        this.logger.logSchemaBuild("adding new index: " + indexSchema.name);
                                        return [4 /*yield*/, this.queryRunner.createIndex(indexSchema.tableName, indexSchema)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(dropQueries.concat(addQueries))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * Drops all indices where given column of the given table is being used.
     */
    SchemaBuilder.prototype.dropColumnReferencedIndices = function (tableName, columnName) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var allIndexMetadatas, tableSchema, dependIndices, dependIndicesInTable, dropPromises;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        allIndexMetadatas = this.entityMetadatas.reduce(function (all, metadata) { return all.concat(metadata.indices); }, []);
                        tableSchema = this.tableSchemas.find(function (table) { return table.name === tableName; });
                        if (!tableSchema)
                            return [2 /*return*/];
                        dependIndices = allIndexMetadatas.filter(function (indexMetadata) {
                            return indexMetadata.tableName === tableName && indexMetadata.columns.indexOf(columnName) !== -1;
                        });
                        if (!dependIndices.length)
                            return [2 /*return*/];
                        dependIndicesInTable = tableSchema.indices.filter(function (indexSchema) {
                            return !!dependIndices.find(function (indexMetadata) { return indexSchema.name === indexMetadata.name; });
                        });
                        if (dependIndicesInTable.length === 0)
                            return [2 /*return*/];
                        this.logger.logSchemaBuild("dropping related indices of " + tableName + "#" + columnName + ": " + dependIndicesInTable.map(function (index) { return index.name; }).join(", "));
                        dropPromises = dependIndicesInTable.map(function (index) {
                            tableSchema.removeIndex(index);
                            return _this.queryRunner.dropIndex(tableSchema.name, index.name);
                        });
                        return [4 /*yield*/, Promise.all(dropPromises)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Drops all foreign keys where given column of the given table is being used.
     */
    SchemaBuilder.prototype.dropColumnReferencedForeignKeys = function (tableName, columnName) {
        return __awaiter(this, void 0, void 0, function () {
            var allForeignKeyMetadatas, tableSchema, dependForeignKeys, dependForeignKeyInTable, foreignKeySchemas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        allForeignKeyMetadatas = this.entityMetadatas.reduce(function (all, metadata) { return all.concat(metadata.foreignKeys); }, []);
                        tableSchema = this.tableSchemas.find(function (table) { return table.name === tableName; });
                        if (!tableSchema)
                            return [2 /*return*/];
                        dependForeignKeys = allForeignKeyMetadatas.filter(function (foreignKey) {
                            if (foreignKey.tableName === tableName) {
                                return !!foreignKey.columns.find(function (fkColumn) {
                                    return fkColumn.name === columnName;
                                });
                            }
                            else if (foreignKey.referencedTableName === tableName) {
                                return !!foreignKey.referencedColumns.find(function (fkColumn) {
                                    return fkColumn.name === columnName;
                                });
                            }
                            return false;
                        });
                        if (!dependForeignKeys.length)
                            return [2 /*return*/];
                        dependForeignKeyInTable = dependForeignKeys.filter(function (fk) {
                            return !!tableSchema.foreignKeys.find(function (dbForeignKey) { return dbForeignKey.name === fk.name; });
                        });
                        if (dependForeignKeyInTable.length === 0)
                            return [2 /*return*/];
                        this.logger.logSchemaBuild("dropping related foreign keys of " + tableName + "#" + columnName + ": " + dependForeignKeyInTable.map(function (foreignKey) { return foreignKey.name; }).join(", "));
                        foreignKeySchemas = dependForeignKeyInTable.map(function (foreignKeyMetadata) { return ForeignKeySchema_1.ForeignKeySchema.create(foreignKeyMetadata); });
                        tableSchema.removeForeignKeys(foreignKeySchemas);
                        return [4 /*yield*/, this.queryRunner.dropForeignKeys(tableSchema, foreignKeySchemas)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Creates new column schemas from the given column metadatas.
     */
    SchemaBuilder.prototype.metadataColumnsToColumnSchemas = function (columns) {
        var _this = this;
        return columns.map(function (columnMetadata) {
            return ColumnSchema_1.ColumnSchema.create(columnMetadata, _this.queryRunner.normalizeType(columnMetadata));
        });
    };
    return SchemaBuilder;
}());
exports.SchemaBuilder = SchemaBuilder;

//# sourceMappingURL=SchemaBuilder.js.map
