"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Primary key from the database stored in this class.
 */
var PrimaryKeySchema = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function PrimaryKeySchema(name, columnName) {
        this.name = name;
        this.columnName = columnName;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Creates a new copy of this primary key with exactly same properties.
     */
    PrimaryKeySchema.prototype.clone = function () {
        return new PrimaryKeySchema(this.name, this.columnName);
    };
    return PrimaryKeySchema;
}());
exports.PrimaryKeySchema = PrimaryKeySchema;

//# sourceMappingURL=PrimaryKeySchema.js.map
