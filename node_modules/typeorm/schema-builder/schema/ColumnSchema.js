"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Table's column's schema in the database represented in this class.
 */
var ColumnSchema = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function ColumnSchema(options) {
        /**
         * Indicates if column is NULL, or is NOT NULL in the database.
         */
        this.isNullable = false;
        /**
         * Indicates if column is auto-generated sequence.
         */
        this.isGenerated = false;
        /**
         * Indicates if column is a primary key.
         */
        this.isPrimary = false;
        /**
         * Indicates if column has unique value.
         */
        this.isUnique = false;
        if (options) {
            this.name = options.name || "";
            this.type = options.type || "";
            this.default = options.default;
            this.isNullable = options.isNullable || false;
            this.isGenerated = options.isGenerated || false;
            this.isPrimary = options.isPrimary || false;
            this.isUnique = options.isUnique || false;
            this.comment = options.comment;
        }
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Clones this column schema to a new column schema with exact same properties as this column schema has.
     */
    ColumnSchema.prototype.clone = function () {
        var newColumnSchema = new ColumnSchema();
        newColumnSchema.name = this.name;
        newColumnSchema.type = this.type;
        newColumnSchema.default = this.default;
        newColumnSchema.isNullable = this.isNullable;
        newColumnSchema.isGenerated = this.isGenerated;
        newColumnSchema.isPrimary = this.isPrimary;
        newColumnSchema.isUnique = this.isUnique;
        newColumnSchema.comment = this.comment;
        return newColumnSchema;
    };
    // -------------------------------------------------------------------------
    // Static Methods
    // -------------------------------------------------------------------------
    /**
     * Creates a new column based on the given column metadata.
     */
    ColumnSchema.create = function (columnMetadata, normalizedType) {
        var columnSchema = new ColumnSchema();
        columnSchema.name = columnMetadata.name;
        columnSchema.default = columnMetadata.default;
        columnSchema.comment = columnMetadata.comment;
        columnSchema.isGenerated = columnMetadata.isGenerated;
        columnSchema.isNullable = columnMetadata.isNullable;
        columnSchema.type = normalizedType;
        columnSchema.isPrimary = columnMetadata.isPrimary;
        columnSchema.isUnique = columnMetadata.isUnique;
        return columnSchema;
    };
    return ColumnSchema;
}());
exports.ColumnSchema = ColumnSchema;

//# sourceMappingURL=ColumnSchema.js.map
