"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TableTypes_1 = require("./types/TableTypes");
var EntityMetadataAlreadySetError_1 = require("./error/EntityMetadataAlreadySetError");
var EntityMetadataNotSetError_1 = require("./error/EntityMetadataNotSetError");
/**
 * TableMetadata contains all entity's table metadata and information.
 */
var TableMetadata = (function () {
    // ---------------------------------------------------------------------
    // Constructor
    // ---------------------------------------------------------------------
    /**
     * Creates a new TableMetadata based on the given arguments object.
     */
    function TableMetadata(args) {
        // ---------------------------------------------------------------------
        // Private Properties
        // ---------------------------------------------------------------------
        /**
         * Table type. Tables can be abstract, closure, junction, embedded, etc.
         */
        this.tableType = "regular";
        this.target = args.target;
        this.tableType = args.type;
        this._name = args.name;
        this._orderBy = args.orderBy;
        this.engine = args.engine;
        this.skipSchemaSync = args.skipSchemaSync;
    }
    Object.defineProperty(TableMetadata.prototype, "entityMetadata", {
        /**
         * Gets entity metadata of this table metadata.
         * If entity metadata was not set then exception will be thrown.
         */
        get: function () {
            if (!this._entityMetadata)
                throw new EntityMetadataNotSetError_1.EntityMetadataNotSetError(TableMetadata, this.target, this._name);
            return this._entityMetadata;
        },
        // ---------------------------------------------------------------------
        // Accessors
        // ---------------------------------------------------------------------
        /**
         * Sets the entity metadata of this table metadata.
         * Note that entity metadata can be set only once.
         * Once you set it, you can't change it anymore.
         */
        set: function (metadata) {
            if (this._entityMetadata)
                throw new EntityMetadataAlreadySetError_1.EntityMetadataAlreadySetError(TableMetadata, this.target, this._name);
            this._entityMetadata = metadata;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TableMetadata.prototype, "nameWithoutPrefix", {
        /**
         * Gets the table name without global table prefix.
         * When querying table you need a table name with prefix, but in some scenarios,
         * for example when you want to name a junction table that contains names of two other tables,
         * you may want a table name without prefix.
         */
        get: function () {
            if (this.isClosureJunction && this._name)
                return this.entityMetadata.namingStrategy.closureJunctionTableName(this._name);
            // otherwise generate table name from target's name
            var name = this.target instanceof Function ? this.target.name : this.target;
            return this.entityMetadata.namingStrategy.tableName(name, this._name);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TableMetadata.prototype, "name", {
        /**
         * Table name in the database.
         * This name includes global table prefix if it was set.
         */
        get: function () {
            if (this.entityMetadata.tablesPrefix)
                return this.entityMetadata.namingStrategy.prefixTableName(this.entityMetadata.tablesPrefix, this.nameWithoutPrefix);
            return this.nameWithoutPrefix;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TableMetadata.prototype, "orderBy", {
        /**
         * Specifies a default order by used for queries from this table when no explicit order by is specified.
         * If default order by was not set, then returns undefined.
         */
        get: function () {
            if (this._orderBy instanceof Function)
                return this._orderBy(this.entityMetadata.createPropertiesMap());
            return this._orderBy;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TableMetadata.prototype, "isRegular", {
        /**
         * Checks if this table is regular.
         * All non-specific tables are just regular tables. Its a default table type.
         */
        get: function () {
            return this.tableType === TableTypes_1.TableTypes.REGULAR;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TableMetadata.prototype, "isAbstract", {
        /**
         * Checks if this table is abstract.
         * This type is for the tables that does not exist in the database,
         * but provide columns and relations for the tables of the child classes who inherit them.
         */
        get: function () {
            return this.tableType === TableTypes_1.TableTypes.ABSTRACT;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TableMetadata.prototype, "isJunction", {
        /**
         * Checks if this table is abstract.
         * Junction table is a table automatically created by many-to-many relationship.
         */
        get: function () {
            return this.tableType === TableTypes_1.TableTypes.JUNCTION;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TableMetadata.prototype, "isClosure", {
        /**
         * Checks if this table is a closure table.
         * Closure table is one of the tree-specific tables that supports closure database pattern.
         */
        get: function () {
            return this.tableType === TableTypes_1.TableTypes.CLOSURE;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TableMetadata.prototype, "isClosureJunction", {
        /**
         * Checks if this table is a junction table of the closure table.
         * This type is for tables that contain junction metadata of the closure tables.
         */
        get: function () {
            return this.tableType === TableTypes_1.TableTypes.CLOSURE_JUNCTION;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TableMetadata.prototype, "isEmbeddable", {
        /**
         * Checks if this table is an embeddable table.
         * Embeddable tables are not stored in the database as separate tables.
         * Instead their columns are embed into tables who owns them.
         */
        get: function () {
            return this.tableType === TableTypes_1.TableTypes.EMBEDDABLE;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TableMetadata.prototype, "isSingleTableChild", {
        /**
         * Checks if this table is a single table child.
         * Special table type for tables that are mapped into single table using Single Table Inheritance pattern.
         */
        get: function () {
            return this.tableType === TableTypes_1.TableTypes.SINGLE_TABLE_CHILD;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TableMetadata.prototype, "isClassTableChild", {
        /**
         * Checks if this table is a class table child.
         * Special table type for tables that are mapped into multiple tables using Class Table Inheritance pattern.
         */
        get: function () {
            return this.tableType === TableTypes_1.TableTypes.CLASS_TABLE_CHILD;
        },
        enumerable: true,
        configurable: true
    });
    return TableMetadata;
}());
exports.TableMetadata = TableMetadata;

//# sourceMappingURL=TableMetadata.js.map
