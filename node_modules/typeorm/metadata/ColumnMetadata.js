"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This metadata contains all information about entity's column.
 */
var ColumnMetadata = (function () {
    // ---------------------------------------------------------------------
    // Constructor
    // ---------------------------------------------------------------------
    function ColumnMetadata(args) {
        /**
         * Type's length in the database.
         */
        this.length = "";
        /**
         * Indicates if this column is a primary key.
         */
        this.isPrimary = false;
        /**
         * Indicates if this column is generated (auto increment or generated other way).
         */
        this.isGenerated = false;
        /**
         * Indicates if value in the database should be unique or not.
         */
        this.isUnique = false;
        /**
         * Indicates if column can contain nulls or not.
         */
        this.isNullable = false;
        /**
         * Column comment.
         */
        this.comment = "";
        this.target = args.target;
        this.propertyName = args.propertyName;
        if (args.mode)
            this.mode = args.mode;
        // if (args.propertyType)
        //     this.propertyType = args.propertyType.toLowerCase();
        if (args.options.name)
            this._name = args.options.name;
        if (args.options.type)
            this.type = args.options.type;
        if (args.options.length)
            this.length = String(args.options.length);
        if (args.options.primary)
            this.isPrimary = args.options.primary;
        if (args.options.generated)
            this.isGenerated = args.options.generated;
        if (args.options.unique)
            this.isUnique = args.options.unique;
        if (args.options.nullable)
            this.isNullable = args.options.nullable;
        if (args.options.comment)
            this.comment = args.options.comment;
        if (args.options.default !== undefined && args.options.default !== null)
            this.default = args.options.default;
        if (args.options.scale)
            this.scale = args.options.scale;
        if (args.options.precision)
            this.precision = args.options.precision;
        if (args.options.timezone)
            this.timezone = args.options.timezone;
        if (args.options.localTimezone)
            this.localTimezone = args.options.localTimezone;
    }
    Object.defineProperty(ColumnMetadata.prototype, "entityTarget", {
        // ---------------------------------------------------------------------
        // Accessors
        // ---------------------------------------------------------------------
        /**
         * Gets column's entity target.
         * Original target returns target of the class where column is.
         * This class can be an abstract class, but column even is from that class,
         * but its more related to a specific entity. That's why we need this field.
         */
        get: function () {
            return this.entityMetadata.target;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColumnMetadata.prototype, "name", {
        /**
         * Column name in the database.
         */
        get: function () {
            // if this column is embedded's column then apply different entity
            if (this.embeddedMetadata)
                return this.embeddedMetadata.entityMetadata.namingStrategy.embeddedColumnName(this.embeddedMetadata.propertyName, this.propertyName, this._name);
            // if there is a naming strategy then use it to normalize propertyName as column name
            if (this.entityMetadata)
                return this.entityMetadata.namingStrategy.columnName(this.propertyName, this._name);
            throw new Error("Column " + (this._name ? this._name + " " : "") + "is not attached to any entity or embedded.");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColumnMetadata.prototype, "isInEmbedded", {
        /**
         * Indicates if this column is in embedded, not directly in the table.
         */
        get: function () {
            return !!this.embeddedMetadata;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColumnMetadata.prototype, "isVirtual", {
        /**
         * Indicates if column is virtual. Virtual columns are not mapped to the entity.
         */
        get: function () {
            return this.mode === "virtual";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColumnMetadata.prototype, "isParentId", {
        /**
         * Indicates if column is a parent id. Parent id columns are not mapped to the entity.
         */
        get: function () {
            return this.mode === "parentId";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColumnMetadata.prototype, "isDiscriminator", {
        /**
         * Indicates if column is discriminator. Discriminator columns are not mapped to the entity.
         */
        get: function () {
            return this.mode === "discriminator";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColumnMetadata.prototype, "isCreateDate", {
        /**
         * Indicates if this column contains an entity creation date.
         */
        get: function () {
            return this.mode === "createDate";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColumnMetadata.prototype, "isUpdateDate", {
        /**
         * Indicates if this column contains an entity update date.
         */
        get: function () {
            return this.mode === "updateDate";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColumnMetadata.prototype, "isVersion", {
        /**
         * Indicates if this column contains an entity version.
         */
        get: function () {
            return this.mode === "version";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColumnMetadata.prototype, "referencedColumn", {
        /**
         * If this column references some column, it gets the first referenced column of this column.
         */
        get: function () {
            var _this = this;
            var foreignKey = this.entityMetadata.foreignKeys.find(function (foreignKey) { return foreignKey.columns.indexOf(_this) !== -1; });
            if (foreignKey) {
                return foreignKey.referencedColumns[0];
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColumnMetadata.prototype, "embeddedProperty", {
        /**
         * Gets embedded property in which column is.
         */
        get: function () {
            if (!this.embeddedMetadata)
                throw new Error("This column" + (this._name ? this._name + " " : "") + " is not in embedded entity.");
            return this.embeddedMetadata.propertyName;
        },
        enumerable: true,
        configurable: true
    });
    // ---------------------------------------------------------------------
    // Public Methods
    // ---------------------------------------------------------------------
    ColumnMetadata.prototype.hasEntityValue = function (entity) {
        if (!entity)
            return false;
        if (this.isInEmbedded) {
            return entity[this.embeddedProperty] !== undefined &&
                entity[this.embeddedProperty] !== null &&
                entity[this.embeddedProperty][this.propertyName] !== undefined &&
                entity[this.embeddedProperty][this.propertyName] !== null;
        }
        else {
            return entity[this.propertyName] !== undefined &&
                entity[this.propertyName] !== null;
        }
    };
    ColumnMetadata.prototype.getEntityValue = function (entity) {
        if (this.isInEmbedded) {
            if (entity[this.embeddedProperty] === undefined ||
                entity[this.embeddedProperty] === null)
                return undefined;
            return entity[this.embeddedProperty][this.propertyName];
        }
        else {
            return entity[this.propertyName];
        }
    };
    return ColumnMetadata;
}());
exports.ColumnMetadata = ColumnMetadata;

//# sourceMappingURL=ColumnMetadata.js.map
