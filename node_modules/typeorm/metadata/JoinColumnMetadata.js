"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * JoinColumnMetadata contains all information about relation's join column.
 */
var JoinColumnMetadata = (function () {
    // ---------------------------------------------------------------------
    // Constructor
    // ---------------------------------------------------------------------
    function JoinColumnMetadata(args) {
        this.target = args.target;
        this.propertyName = args.propertyName;
        this._name = args.name;
        this.referencedColumnName = args.referencedColumnName;
    }
    Object.defineProperty(JoinColumnMetadata.prototype, "name", {
        // ---------------------------------------------------------------------
        // Accessors
        // ---------------------------------------------------------------------
        /**
         * Join column name.
         */
        get: function () {
            return this.relation.entityMetadata.namingStrategy.joinColumnInverseSideName(this._name, this.relation.propertyName);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JoinColumnMetadata.prototype, "referencedColumn", {
        /**
         * Referenced join column.
         */
        get: function () {
            var _this = this;
            if (this.referencedColumnName) {
                var referencedColumn = this.relation.inverseEntityMetadata.allColumns.find(function (column) { return column.name === _this.referencedColumnName; });
                if (!referencedColumn)
                    throw new Error("Referenced column " + this.referencedColumnName + " was not found in entity " + this.name);
                return referencedColumn;
            }
            var inverseEntityMetadata = this.relation.inverseEntityMetadata;
            var primaryColumns = inverseEntityMetadata.primaryColumnsWithParentIdColumns;
            if (primaryColumns.length > 1)
                throw new Error("Cannot automatically determine a referenced column of the \"" + inverseEntityMetadata.name + "\", because it has multiple primary columns. Try to specify a referenced column explicitly.");
            return primaryColumns[0];
        },
        enumerable: true,
        configurable: true
    });
    return JoinColumnMetadata;
}());
exports.JoinColumnMetadata = JoinColumnMetadata;

//# sourceMappingURL=JoinColumnMetadata.js.map
