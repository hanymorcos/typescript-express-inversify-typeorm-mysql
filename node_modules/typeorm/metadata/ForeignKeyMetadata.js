"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Contains all information about entity's foreign key.
 */
var ForeignKeyMetadata = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function ForeignKeyMetadata(columns, referencedTable, referencedColumns, onDelete) {
        this.columns = columns;
        this.referencedTable = referencedTable;
        this.referencedColumns = referencedColumns;
        if (onDelete)
            this.onDelete = onDelete;
    }
    Object.defineProperty(ForeignKeyMetadata.prototype, "tableName", {
        // -------------------------------------------------------------------------
        // Accessors
        // -------------------------------------------------------------------------
        /**
         * Gets the table name to which this foreign key is applied.
         */
        get: function () {
            return this.entityMetadata.table.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ForeignKeyMetadata.prototype, "referencedTableName", {
        /**
         * Gets the table name to which this foreign key is referenced.
         */
        get: function () {
            return this.referencedTable.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ForeignKeyMetadata.prototype, "name", {
        /**
         * Gets foreign key name.
         */
        get: function () {
            return this.entityMetadata.namingStrategy.foreignKeyName(this.tableName, this.columnNames, this.referencedTable.name, this.referencedColumnNames);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ForeignKeyMetadata.prototype, "columnNames", {
        /**
         * Gets array of column names.
         */
        get: function () {
            return this.columns.map(function (column) { return column.name; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ForeignKeyMetadata.prototype, "referencedColumnNames", {
        /**
         * Gets array of referenced column names.
         */
        get: function () {
            return this.referencedColumns.map(function (column) { return column.name; });
        },
        enumerable: true,
        configurable: true
    });
    return ForeignKeyMetadata;
}());
exports.ForeignKeyMetadata = ForeignKeyMetadata;

//# sourceMappingURL=ForeignKeyMetadata.js.map
