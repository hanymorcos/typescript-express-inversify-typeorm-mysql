"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ColumnSchema_1 = require("./ColumnSchema");
/**
 * Table schema in the database represented in this class.
 */
var TableSchema = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function TableSchema(name, columns, justCreated) {
        /**
         * Table columns.
         */
        this.columns = [];
        /**
         * Table indices.
         */
        this.indices = [];
        /**
         * Table foreign keys.
         */
        this.foreignKeys = [];
        /**
         * Table primary keys.
         */
        this.primaryKeys = [];
        /**
         * Indicates if table schema was just created.
         * This is needed, for example to check if we need to skip primary keys creation
         * for new table schemas.
         */
        this.justCreated = false;
        this.name = name;
        if (columns) {
            this.columns = columns.map(function (column) {
                if (column instanceof ColumnSchema_1.ColumnSchema) {
                    return column;
                }
                else {
                    return new ColumnSchema_1.ColumnSchema(column);
                }
            });
        }
        if (justCreated !== undefined)
            this.justCreated = justCreated;
    }
    Object.defineProperty(TableSchema.prototype, "primaryKeysWithoutGenerated", {
        // -------------------------------------------------------------------------
        // Accessors
        // -------------------------------------------------------------------------
        /**
         * Gets only those primary keys that does not
         */
        get: function () {
            var generatedColumn = this.columns.find(function (column) { return column.isGenerated; });
            if (!generatedColumn)
                return this.primaryKeys;
            return this.primaryKeys.filter(function (primaryKey) {
                return primaryKey.columnName !== generatedColumn.name;
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TableSchema.prototype, "hasGeneratedColumn", {
        get: function () {
            return !!this.columns.find(function (column) { return column.isGenerated; });
        },
        enumerable: true,
        configurable: true
    });
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Clones this table schema to a new table schema with all properties cloned.
     */
    TableSchema.prototype.clone = function () {
        var cloned = new TableSchema(this.name);
        cloned.columns = this.columns.map(function (column) { return column.clone(); });
        cloned.indices = this.indices.map(function (index) { return index.clone(); });
        cloned.foreignKeys = this.foreignKeys.map(function (key) { return key.clone(); });
        cloned.primaryKeys = this.primaryKeys.map(function (key) { return key.clone(); });
        return cloned;
    };
    /**
     * Adds column schemas.
     */
    TableSchema.prototype.addColumns = function (columns) {
        this.columns = this.columns.concat(columns);
    };
    /**
     * Replaces given column.
     */
    TableSchema.prototype.replaceColumn = function (oldColumn, newColumn) {
        this.columns[this.columns.indexOf(oldColumn)] = newColumn;
    };
    /**
     * Removes a column schema from this table schema.
     */
    TableSchema.prototype.removeColumn = function (columnToRemove) {
        var foundColumn = this.columns.find(function (column) { return column.name === columnToRemove.name; });
        if (foundColumn)
            this.columns.splice(this.columns.indexOf(foundColumn), 1);
    };
    /**
     * Remove all column schemas from this table schema.
     */
    TableSchema.prototype.removeColumns = function (columns) {
        var _this = this;
        columns.forEach(function (column) { return _this.removeColumn(column); });
    };
    /**
     * Adds all given primary keys.
     */
    TableSchema.prototype.addPrimaryKeys = function (addedKeys) {
        var _this = this;
        addedKeys.forEach(function (key) { return _this.primaryKeys.push(key); });
    };
    /**
     * Removes all given primary keys.
     */
    TableSchema.prototype.removePrimaryKeys = function (droppedKeys) {
        var _this = this;
        droppedKeys.forEach(function (key) {
            _this.primaryKeys.splice(_this.primaryKeys.indexOf(key), 1);
        });
    };
    /**
     * Removes primary keys of the given columns.
     */
    TableSchema.prototype.removePrimaryKeysOfColumns = function (columns) {
        this.primaryKeys = this.primaryKeys.filter(function (primaryKey) {
            return !columns.find(function (column) { return column.name === primaryKey.columnName; });
        });
    };
    /**
     * Adds foreign key schemas.
     */
    TableSchema.prototype.addForeignKeys = function (foreignKeys) {
        this.foreignKeys = this.foreignKeys.concat(foreignKeys);
    };
    /**
     * Removes foreign key from this table schema.
     */
    TableSchema.prototype.removeForeignKey = function (removedForeignKey) {
        var fk = this.foreignKeys.find(function (foreignKey) { return foreignKey.name === removedForeignKey.name; }); // this must be by name
        if (fk)
            this.foreignKeys.splice(this.foreignKeys.indexOf(fk), 1);
    };
    /**
     * Removes all foreign keys from this table schema.
     */
    TableSchema.prototype.removeForeignKeys = function (dbForeignKeys) {
        var _this = this;
        dbForeignKeys.forEach(function (foreignKey) { return _this.removeForeignKey(foreignKey); });
    };
    /**
     * Removes index schema from this table schema.
     */
    TableSchema.prototype.removeIndex = function (indexSchema) {
        var index = this.indices.find(function (index) { return index.name === indexSchema.name; });
        if (index)
            this.indices.splice(this.indices.indexOf(index), 1);
    };
    /**
     * Differentiate columns of this table schema and columns from the given column metadatas columns
     * and returns only changed.
     */
    TableSchema.prototype.findChangedColumns = function (queryRunner, columnMetadatas) {
        return this.columns.filter(function (columnSchema) {
            var columnMetadata = columnMetadatas.find(function (columnMetadata) { return columnMetadata.name === columnSchema.name; });
            if (!columnMetadata)
                return false; // we don't need new columns, we only need exist and changed
            return columnSchema.name !== columnMetadata.name ||
                columnSchema.type !== queryRunner.normalizeType(columnMetadata) ||
                columnSchema.comment !== columnMetadata.comment ||
                (!columnSchema.isGenerated && !queryRunner.compareDefaultValues(columnMetadata.default, columnSchema.default)) ||
                columnSchema.isNullable !== columnMetadata.isNullable ||
                columnSchema.isUnique !== columnMetadata.isUnique ||
                // columnSchema.isPrimary !== columnMetadata.isPrimary ||
                columnSchema.isGenerated !== columnMetadata.isGenerated;
        });
    };
    return TableSchema;
}());
exports.TableSchema = TableSchema;

//# sourceMappingURL=TableSchema.js.map
