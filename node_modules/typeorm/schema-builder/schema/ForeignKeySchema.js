"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Foreign key from the database stored in this class.
 */
var ForeignKeySchema = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function ForeignKeySchema(name, columnNames, referencedColumnNames, referencedTable, onDelete) {
        this.name = name;
        this.columnNames = columnNames;
        this.referencedColumnNames = referencedColumnNames;
        this.referencedTableName = referencedTable;
        this.onDelete = onDelete;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Creates a new copy of this foreign key with exactly same properties.
     */
    ForeignKeySchema.prototype.clone = function () {
        return new ForeignKeySchema(this.name, this.columnNames, this.referencedColumnNames, this.referencedTableName);
    };
    // -------------------------------------------------------------------------
    // Static Methods
    // -------------------------------------------------------------------------
    /**
     * Creates a new foreign schema from the given foreign key metadata.
     */
    ForeignKeySchema.create = function (metadata) {
        return new ForeignKeySchema(metadata.name, metadata.columnNames, metadata.referencedColumnNames, metadata.referencedTableName, metadata.onDelete);
    };
    return ForeignKeySchema;
}());
exports.ForeignKeySchema = ForeignKeySchema;

//# sourceMappingURL=ForeignKeySchema.js.map
