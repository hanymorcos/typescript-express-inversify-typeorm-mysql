"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Database's table index stored in this class.
 */
var IndexSchema = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function IndexSchema(tableName, name, columnNames, isUnique) {
        this.tableName = tableName;
        this.name = name;
        this.columnNames = columnNames;
        this.isUnique = isUnique;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Creates a new copy of this index with exactly same properties.
     */
    IndexSchema.prototype.clone = function () {
        return new IndexSchema(this.tableName, this.name, this.columnNames.map(function (name) { return name; }), this.isUnique);
    };
    // -------------------------------------------------------------------------
    // Static Methods
    // -------------------------------------------------------------------------
    /**
     * Creates index from the index metadata object.
     */
    IndexSchema.create = function (indexMetadata) {
        return new IndexSchema(indexMetadata.entityMetadata.table.name, indexMetadata.name, indexMetadata.columns, indexMetadata.isUnique);
    };
    return IndexSchema;
}());
exports.IndexSchema = IndexSchema;

//# sourceMappingURL=IndexSchema.js.map
