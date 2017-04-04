"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Contains all information about entity's embedded property.
 */
var EmbeddedMetadata = (function () {
    // ---------------------------------------------------------------------
    // Constructor
    // ---------------------------------------------------------------------
    function EmbeddedMetadata(type, propertyName, table, columns) {
        var _this = this;
        this.type = type;
        this.propertyName = propertyName;
        this.table = table;
        this.columns = columns;
        this.columns.forEach(function (column) {
            column.embeddedMetadata = _this;
        });
    }
    // ---------------------------------------------------------------------
    // Public Methods
    // ---------------------------------------------------------------------
    /**
     * Creates a new embedded object.
     */
    EmbeddedMetadata.prototype.create = function () {
        return new this.type;
    };
    return EmbeddedMetadata;
}());
exports.EmbeddedMetadata = EmbeddedMetadata;

//# sourceMappingURL=EmbeddedMetadata.js.map
