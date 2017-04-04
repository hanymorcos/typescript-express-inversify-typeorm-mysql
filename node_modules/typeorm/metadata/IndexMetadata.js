"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Index metadata contains all information about table's index.
 */
var IndexMetadata = (function () {
    // ---------------------------------------------------------------------
    // Constructor
    // ---------------------------------------------------------------------
    function IndexMetadata(args) {
        this.target = args.target;
        this._columns = args.columns;
        this._name = args.name;
        this.isUnique = args.unique;
    }
    Object.defineProperty(IndexMetadata.prototype, "name", {
        // ---------------------------------------------------------------------
        // Accessors
        // ---------------------------------------------------------------------
        /**
         * Gets index's name.
         */
        get: function () {
            return this.entityMetadata.namingStrategy.indexName(this._name, this.entityMetadata.table.name, this.columns);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IndexMetadata.prototype, "tableName", {
        /**
         * Gets the table name on which index is applied.
         */
        get: function () {
            return this.entityMetadata.table.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IndexMetadata.prototype, "columns", {
        /**
         * Gets the column names which are in this index.
         */
        get: function () {
            var _this = this;
            // if columns already an array of string then simply return it
            var columnPropertyNames = [];
            if (this._columns instanceof Array) {
                columnPropertyNames = this._columns;
            }
            else {
                // if columns is a function that returns array of field names then execute it and get columns names from it
                var propertiesMap = this.entityMetadata.createPropertiesMap();
                columnPropertyNames = this._columns(propertiesMap).map(function (i) { return String(i); });
            }
            var columns = this.entityMetadata.columns.filter(function (column) { return columnPropertyNames.indexOf(column.propertyName) !== -1; });
            var missingColumnNames = columnPropertyNames.filter(function (columnPropertyName) { return !_this.entityMetadata.columns.find(function (column) { return column.propertyName === columnPropertyName; }); });
            if (missingColumnNames.length > 0) {
                // console.log(this.entityMetadata.columns);
                throw new Error("Index " + (this._name ? "\"" + this._name + "\" " : "") + "contains columns that are missing in the entity: " + missingColumnNames.join(", "));
            }
            return columns.map(function (column) { return column.name; });
        },
        enumerable: true,
        configurable: true
    });
    return IndexMetadata;
}());
exports.IndexMetadata = IndexMetadata;

//# sourceMappingURL=IndexMetadata.js.map
