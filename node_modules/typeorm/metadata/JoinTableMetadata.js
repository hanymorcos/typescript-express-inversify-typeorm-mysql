"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * JoinTableMetadata contains all information about relation's join table.
 */
var JoinTableMetadata = (function () {
    // ---------------------------------------------------------------------
    // Constructor
    // ---------------------------------------------------------------------
    function JoinTableMetadata(args) {
        this.target = args.target;
        this.propertyName = args.propertyName;
        this._name = args.name;
        if (args.joinColumn) {
            if (args.joinColumn.name)
                this._joinColumnName = args.joinColumn.name;
            if (args.joinColumn.referencedColumnName)
                this._joinColumnReferencedColumnName = args.joinColumn.referencedColumnName;
        }
        if (args.inverseJoinColumn) {
            if (args.inverseJoinColumn.name)
                this._inverseJoinColumnName = args.inverseJoinColumn.name;
            if (args.inverseJoinColumn.referencedColumnName)
                this._inverseJoinColumnReferencedColumnName = args.inverseJoinColumn.referencedColumnName;
        }
    }
    Object.defineProperty(JoinTableMetadata.prototype, "name", {
        // ---------------------------------------------------------------------
        // Accessors
        // ---------------------------------------------------------------------
        /**
         * Join table name.
         */
        get: function () {
            if (this._name)
                return this._name;
            return this.relation.entityMetadata.namingStrategy.joinTableName(this.relation.entityMetadata.table.nameWithoutPrefix, this.relation.inverseEntityMetadata.table.nameWithoutPrefix, this.relation.propertyName, this.relation.hasInverseSide ? this.relation.inverseRelation.propertyName : "", this.referencedColumn.name, this.inverseReferencedColumn.name);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JoinTableMetadata.prototype, "joinColumnName", {
        /**
         * Join column name.
         */
        get: function () {
            if (this._joinColumnName)
                return this._joinColumnName;
            return this.relation
                .entityMetadata
                .namingStrategy
                .joinTableColumnName(this.relation.entityMetadata.table.nameWithoutPrefix, this.referencedColumn.name, this.relation.inverseEntityMetadata.table.nameWithoutPrefix, this.inverseReferencedColumn.name);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JoinTableMetadata.prototype, "inverseJoinColumnName", {
        /**
         * Join column name of the inverse side.
         */
        get: function () {
            if (this._inverseJoinColumnName)
                return this._inverseJoinColumnName;
            return this.relation
                .entityMetadata
                .namingStrategy
                .joinTableInverseColumnName(this.relation.inverseEntityMetadata.table.nameWithoutPrefix, this.inverseReferencedColumn.name, this.relation.entityMetadata.table.nameWithoutPrefix, this.referencedColumn.name);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JoinTableMetadata.prototype, "referencedColumn", {
        /**
         * Referenced join column.
         */
        get: function () {
            var _this = this;
            if (this._joinColumnReferencedColumnName) {
                var referencedColumn = this.relation.entityMetadata.columns.find(function (column) { return column.name === _this._joinColumnReferencedColumnName; });
                if (!referencedColumn)
                    throw new Error("Referenced column " + this._joinColumnReferencedColumnName + " was not found in entity " + this.name);
                return referencedColumn;
            }
            if (this.relation.entityMetadata.primaryColumns.length > 1)
                throw new Error("Cannot automatically determine a referenced column of the \"" + this.relation.entityMetadata.name + "\", because it has multiple primary columns. Try to specify a referenced column explicitly.");
            return this.relation.entityMetadata.firstPrimaryColumn;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JoinTableMetadata.prototype, "inverseReferencedColumn", {
        /**
         * Referenced join column of the inverse side.
         */
        get: function () {
            var _this = this;
            if (this._inverseJoinColumnReferencedColumnName) {
                var referencedColumn = this.relation.inverseEntityMetadata.columns.find(function (column) { return column.name === _this._inverseJoinColumnReferencedColumnName; });
                if (!referencedColumn)
                    throw new Error("Referenced column " + this._inverseJoinColumnReferencedColumnName + " was not found in entity " + this.name);
                return referencedColumn;
            }
            if (this.relation.inverseEntityMetadata.primaryColumns.length > 1)
                throw new Error("Cannot automatically determine inverse referenced column of the \"" + this.relation.inverseEntityMetadata.name + "\", because it has multiple primary columns. Try to specify a referenced column explicitly.");
            return this.relation.inverseEntityMetadata.firstPrimaryColumn;
        },
        enumerable: true,
        configurable: true
    });
    return JoinTableMetadata;
}());
exports.JoinTableMetadata = JoinTableMetadata;

//# sourceMappingURL=JoinTableMetadata.js.map
