"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RelationTypes_1 = require("./types/RelationTypes");
// todo: IDEA. store all entity metadata in the EntityMetadata too? (this will open more features for metadata objects + no need to access connection in lot of places)
/**
 * Contains all entity metadata.
 */
var EntityMetadata = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function EntityMetadata(args, lazyRelationsWrapper) {
        var _this = this;
        this.lazyRelationsWrapper = lazyRelationsWrapper;
        /**
         * Entity's foreign key metadatas.
         */
        this.foreignKeys = [];
        this.target = args.target;
        this.junction = args.junction;
        this.tablesPrefix = args.tablesPrefix;
        this.namingStrategy = args.namingStrategy;
        this.table = args.tableMetadata;
        this._columns = args.columnMetadatas || [];
        this.relations = args.relationMetadatas || [];
        this.indices = args.indexMetadatas || [];
        this.foreignKeys = args.foreignKeyMetadatas || [];
        this.embeddeds = args.embeddedMetadatas || [];
        this.discriminatorValue = args.discriminatorValue;
        this.inheritanceType = args.inheritanceType;
        this.table.entityMetadata = this;
        this._columns.forEach(function (column) { return column.entityMetadata = _this; });
        this.relations.forEach(function (relation) { return relation.entityMetadata = _this; });
        this.foreignKeys.forEach(function (foreignKey) { return foreignKey.entityMetadata = _this; });
        this.indices.forEach(function (index) { return index.entityMetadata = _this; });
        this.embeddeds.forEach(function (embedded) {
            embedded.entityMetadata = _this;
            embedded.columns.forEach(function (column) { return column.entityMetadata = _this; });
        });
    }
    Object.defineProperty(EntityMetadata.prototype, "name", {
        // -------------------------------------------------------------------------
        // Accessors
        // -------------------------------------------------------------------------
        /**
         * Entity's name. Equal to entity target class's name if target is set to table, or equals to table name if its set.
         */
        get: function () {
            if (!this.table)
                throw new Error("No table target set to the entity metadata.");
            return this.targetName ? this.targetName : this.table.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityMetadata.prototype, "columns", {
        /**
         * Columns of the entity, including columns that are coming from the embeddeds of this entity.
         */
        get: function () {
            var allColumns = [].concat(this._columns);
            this.embeddeds.forEach(function (embedded) {
                allColumns = allColumns.concat(embedded.columns);
            });
            return allColumns;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityMetadata.prototype, "allColumns", {
        /**
         * All columns of the entity, including columns that are coming from the embeddeds of this entity,
         * and including columns from the parent entities.
         */
        get: function () {
            var columns = this.columns;
            if (this.parentEntityMetadata)
                columns = columns.concat(this.parentEntityMetadata.columns);
            return columns;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityMetadata.prototype, "allRelations", {
        /**
         * All relations of the entity, including relations from the parent entities.
         */
        get: function () {
            var relations = this.relations;
            if (this.parentEntityMetadata)
                relations = relations.concat(this.parentEntityMetadata.relations);
            return relations;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityMetadata.prototype, "targetName", {
        /**
         * Gets the name of the target.
         */
        get: function () {
            if (typeof this.target === "string")
                return this.target;
            if (this.target instanceof Function)
                return this.target.name;
            return "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityMetadata.prototype, "hasMultiplePrimaryKeys", {
        /**
         * Checks if entity's table has multiple primary columns.
         */
        get: function () {
            return this.primaryColumns.length > 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityMetadata.prototype, "primaryColumn", {
        /**
         * Gets the primary column.
         *
         * @deprecated
         */
        get: function () {
            var primaryKey = this.primaryColumns[0];
            if (!primaryKey)
                throw new Error("Primary key is not set for the " + this.name + " entity.");
            return primaryKey;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityMetadata.prototype, "hasGeneratedColumn", {
        /**
         * Checks if table has generated column.
         */
        get: function () {
            return !!this.generatedColumnIfExist;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityMetadata.prototype, "generatedColumn", {
        /**
         * Gets the column with generated flag.
         */
        get: function () {
            var generatedColumn = this.generatedColumnIfExist;
            if (!generatedColumn)
                throw new Error("Generated column was not found");
            return generatedColumn;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityMetadata.prototype, "generatedColumnIfExist", {
        /**
         * Gets the generated column if it exists, or returns undefined if it does not.
         */
        get: function () {
            return this._columns.find(function (column) { return column.isGenerated; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityMetadata.prototype, "firstPrimaryColumn", {
        /**
         * Gets first primary column. In the case if table contains multiple primary columns it
         * throws error.
         */
        get: function () {
            if (this.hasMultiplePrimaryKeys)
                throw new Error("Entity " + this.name + " has multiple primary keys. This operation is not supported on entities with multiple primary keys");
            return this.primaryColumns[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityMetadata.prototype, "primaryColumns", {
        /**
         * Gets the primary columns.
         */
        get: function () {
            // const originalPrimaryColumns = this._columns.filter(column => column.isPrimary);
            // const parentEntityPrimaryColumns = this.hasParentIdColumn ? [this.parentIdColumn] : [];
            // return originalPrimaryColumns.concat(parentEntityPrimaryColumns);
            return this._columns.filter(function (column) { return column.isPrimary; });
            // const originalPrimaryColumns = this._columns.filter(column => column.isPrimary);
            // const parentEntityPrimaryColumns = this.parentEntityMetadata ? this.parentEntityMetadata.primaryColumns : [];
            // return originalPrimaryColumns.concat(parentEntityPrimaryColumns);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityMetadata.prototype, "primaryColumnsWithParentIdColumns", {
        get: function () {
            return this.primaryColumns.concat(this.parentIdColumns);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityMetadata.prototype, "allPrimaryColumns", {
        /**
         * Gets all primary columns including columns from the parent entities.
         */
        get: function () {
            return this.primaryColumns.concat(this.parentPrimaryColumns);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityMetadata.prototype, "parentPrimaryColumns", {
        /**
         * Gets the primary columns of the parent entity metadata.
         * If parent entity metadata does not exist then it simply returns empty array.
         */
        get: function () {
            if (this.parentEntityMetadata)
                return this.parentEntityMetadata.primaryColumns;
            return [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityMetadata.prototype, "ownPimaryColumns", {
        /**
         * Gets only primary columns owned by this entity.
         */
        get: function () {
            return this._columns.filter(function (column) { return column.isPrimary; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityMetadata.prototype, "hasCreateDateColumn", {
        /**
         * Checks if entity has a create date column.
         */
        get: function () {
            return !!this._columns.find(function (column) { return column.mode === "createDate"; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityMetadata.prototype, "createDateColumn", {
        /**
         * Gets entity column which contains a create date value.
         */
        get: function () {
            var column = this._columns.find(function (column) { return column.mode === "createDate"; });
            if (!column)
                throw new Error("CreateDateColumn was not found in entity " + this.name);
            return column;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityMetadata.prototype, "hasUpdateDateColumn", {
        /**
         * Checks if entity has an update date column.
         */
        get: function () {
            return !!this._columns.find(function (column) { return column.mode === "updateDate"; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityMetadata.prototype, "updateDateColumn", {
        /**
         * Gets entity column which contains an update date value.
         */
        get: function () {
            var column = this._columns.find(function (column) { return column.mode === "updateDate"; });
            if (!column)
                throw new Error("UpdateDateColumn was not found in entity " + this.name);
            return column;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityMetadata.prototype, "hasVersionColumn", {
        /**
         * Checks if entity has a version column.
         */
        get: function () {
            return !!this._columns.find(function (column) { return column.mode === "version"; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityMetadata.prototype, "versionColumn", {
        /**
         * Gets entity column which contains an entity version.
         */
        get: function () {
            var column = this._columns.find(function (column) { return column.mode === "version"; });
            if (!column)
                throw new Error("VersionColumn was not found in entity " + this.name);
            return column;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityMetadata.prototype, "hasDiscriminatorColumn", {
        /**
         * Checks if entity has a discriminator column.
         */
        get: function () {
            return !!this._columns.find(function (column) { return column.mode === "discriminator"; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityMetadata.prototype, "discriminatorColumn", {
        /**
         * Gets the discriminator column used to store entity identificator in single-table inheritance tables.
         */
        get: function () {
            var column = this._columns.find(function (column) { return column.mode === "discriminator"; });
            if (!column)
                throw new Error("DiscriminatorColumn was not found in entity " + this.name);
            return column;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityMetadata.prototype, "hasTreeLevelColumn", {
        /**
         * Checks if entity has a tree level column.
         */
        get: function () {
            return !!this._columns.find(function (column) { return column.mode === "treeLevel"; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityMetadata.prototype, "treeLevelColumn", {
        get: function () {
            var column = this._columns.find(function (column) { return column.mode === "treeLevel"; });
            if (!column)
                throw new Error("TreeLevelColumn was not found in entity " + this.name);
            return column;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityMetadata.prototype, "hasParentIdColumn", {
        /**
         * Checks if entity has a tree level column.
         */
        get: function () {
            return !!this._columns.find(function (column) { return column.mode === "parentId"; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityMetadata.prototype, "parentIdColumn", {
        get: function () {
            var column = this._columns.find(function (column) { return column.mode === "parentId"; });
            if (!column)
                throw new Error("Parent id column was not found in entity " + this.name);
            return column;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityMetadata.prototype, "parentIdColumns", {
        get: function () {
            return this._columns.filter(function (column) { return column.mode === "parentId"; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityMetadata.prototype, "singleValueRelations", {
        /**
         * Gets single (values of which does not contain arrays) relations.
         */
        get: function () {
            return this.relations.filter(function (relation) {
                return relation.relationType === RelationTypes_1.RelationTypes.ONE_TO_ONE || relation.relationType === RelationTypes_1.RelationTypes.ONE_TO_MANY;
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityMetadata.prototype, "multiValueRelations", {
        /**
         * Gets single (values of which does not contain arrays) relations.
         */
        get: function () {
            return this.relations.filter(function (relation) {
                return relation.relationType === RelationTypes_1.RelationTypes.ONE_TO_ONE || relation.relationType === RelationTypes_1.RelationTypes.ONE_TO_MANY;
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityMetadata.prototype, "oneToOneRelations", {
        /**
         * Gets only one-to-one relations of the entity.
         */
        get: function () {
            return this.relations.filter(function (relation) { return relation.relationType === RelationTypes_1.RelationTypes.ONE_TO_ONE; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityMetadata.prototype, "ownerOneToOneRelations", {
        /**
         * Gets only owner one-to-one relations of the entity.
         */
        get: function () {
            return this.relations.filter(function (relation) { return relation.relationType === RelationTypes_1.RelationTypes.ONE_TO_ONE && relation.isOwning; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityMetadata.prototype, "oneToManyRelations", {
        /**
         * Gets only one-to-many relations of the entity.
         */
        get: function () {
            return this.relations.filter(function (relation) { return relation.relationType === RelationTypes_1.RelationTypes.ONE_TO_MANY; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityMetadata.prototype, "manyToOneRelations", {
        /**
         * Gets only many-to-one relations of the entity.
         */
        get: function () {
            return this.relations.filter(function (relation) { return relation.relationType === RelationTypes_1.RelationTypes.MANY_TO_ONE; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityMetadata.prototype, "manyToManyRelations", {
        /**
         * Gets only many-to-many relations of the entity.
         */
        get: function () {
            return this.relations.filter(function (relation) { return relation.relationType === RelationTypes_1.RelationTypes.MANY_TO_MANY; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityMetadata.prototype, "ownerManyToManyRelations", {
        /**
         * Gets only owner many-to-many relations of the entity.
         */
        get: function () {
            return this.relations.filter(function (relation) { return relation.relationType === RelationTypes_1.RelationTypes.MANY_TO_MANY && relation.isOwning; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityMetadata.prototype, "relationsWithJoinColumns", {
        /**
         * Gets only owner one-to-one and many-to-one relations.
         */
        get: function () {
            return this.ownerOneToOneRelations.concat(this.manyToOneRelations);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityMetadata.prototype, "hasTreeParentRelation", {
        /**
         * Checks if there is a tree parent relation. Used only in tree-tables.
         */
        get: function () {
            return !!this.relations.find(function (relation) { return relation.isTreeParent; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityMetadata.prototype, "treeParentRelation", {
        /**
         * Tree parent relation. Used only in tree-tables.
         */
        get: function () {
            var relation = this.relations.find(function (relation) { return relation.isTreeParent; });
            if (!relation)
                throw new Error("TreeParent relation was not found in entity " + this.name);
            return relation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityMetadata.prototype, "hasTreeChildrenRelation", {
        /**
         * Checks if there is a tree children relation. Used only in tree-tables.
         */
        get: function () {
            return !!this.relations.find(function (relation) { return relation.isTreeChildren; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityMetadata.prototype, "treeChildrenRelation", {
        /**
         * Tree children relation. Used only in tree-tables.
         */
        get: function () {
            var relation = this.relations.find(function (relation) { return relation.isTreeChildren; });
            if (!relation)
                throw new Error("TreeParent relation was not found in entity " + this.name);
            return relation;
        },
        enumerable: true,
        configurable: true
    });
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Creates a new entity.
     */
    EntityMetadata.prototype.create = function () {
        var _this = this;
        // if target is set to a function (e.g. class) that can be created then create it
        if (this.target instanceof Function)
            return new this.target();
        // otherwise simply return a new empty object
        var newObject = {};
        this.relations
            .filter(function (relation) { return relation.isLazy; })
            .forEach(function (relation) { return _this.lazyRelationsWrapper.wrap(newObject, relation); });
        return newObject;
    };
    /**
     * Creates an object - map of columns and relations of the entity.
     */
    EntityMetadata.prototype.createPropertiesMap = function () {
        var entity = {};
        this._columns.forEach(function (column) { return entity[column.propertyName] = column.propertyName; });
        this.relations.forEach(function (relation) { return entity[relation.propertyName] = relation.propertyName; });
        return entity;
    };
    /**
     * Computes property name of the entity using given PropertyTypeInFunction.
     */
    EntityMetadata.prototype.computePropertyName = function (nameOrFn) {
        return typeof nameOrFn === "string" ? nameOrFn : nameOrFn(this.createPropertiesMap());
    };
    /**
     * todo: undefined entities should not go there
     */
    EntityMetadata.prototype.getEntityIdMap = function (entity) {
        var _this = this;
        if (!entity)
            return undefined;
        var map = {};
        if (this.parentEntityMetadata) {
            this.primaryColumnsWithParentIdColumns.forEach(function (column) {
                var entityValue = entity[column.propertyName];
                if (entityValue === null || entityValue === undefined)
                    return;
                // if entity id is a relation, then extract referenced column from that relation
                var columnRelation = _this.relations.find(function (relation) { return relation.propertyName === column.propertyName; });
                if (columnRelation && columnRelation.joinColumn) {
                    map[column.propertyName] = entityValue[columnRelation.joinColumn.referencedColumn.propertyName];
                }
                else if (columnRelation && columnRelation.inverseRelation.joinColumn) {
                    map[column.propertyName] = entityValue[columnRelation.inverseRelation.joinColumn.referencedColumn.propertyName];
                }
                else {
                    map[column.propertyName] = entityValue;
                }
            });
        }
        else {
            this.primaryColumns.forEach(function (column) {
                var entityValue = entity[column.propertyName];
                if (entityValue === null || entityValue === undefined)
                    return;
                // if entity id is a relation, then extract referenced column from that relation
                var columnRelation = _this.relations.find(function (relation) { return relation.propertyName === column.propertyName; });
                if (columnRelation && columnRelation.joinColumn) {
                    map[column.propertyName] = entityValue[columnRelation.joinColumn.referencedColumn.propertyName];
                }
                else if (columnRelation && columnRelation.inverseRelation.joinColumn) {
                    map[column.propertyName] = entityValue[columnRelation.inverseRelation.joinColumn.referencedColumn.propertyName];
                }
                else {
                    map[column.propertyName] = entityValue;
                }
            });
        }
        return Object.keys(map).length > 0 ? map : undefined;
    };
    /**
     * Same as getEntityIdMap, but instead of id column property names it returns database column names.
     */
    EntityMetadata.prototype.getDatabaseEntityIdMap = function (entity) {
        var _this = this;
        var map = {};
        if (this.parentEntityMetadata) {
            this.primaryColumnsWithParentIdColumns.forEach(function (column) {
                var entityValue = entity[column.propertyName];
                if (entityValue === null || entityValue === undefined)
                    return;
                // if entity id is a relation, then extract referenced column from that relation
                var columnRelation = _this.relations.find(function (relation) { return relation.propertyName === column.propertyName; });
                if (columnRelation && columnRelation.joinColumn) {
                    map[column.name] = entityValue[columnRelation.joinColumn.referencedColumn.propertyName];
                }
                else if (columnRelation && columnRelation.inverseRelation.joinColumn) {
                    map[column.name] = entityValue[columnRelation.inverseRelation.joinColumn.referencedColumn.propertyName];
                }
                else {
                    map[column.name] = entityValue;
                }
            });
        }
        else {
            this.primaryColumns.forEach(function (column) {
                var entityValue = entity[column.propertyName];
                if (entityValue === null || entityValue === undefined)
                    return;
                // if entity id is a relation, then extract referenced column from that relation
                var columnRelation = _this.relations.find(function (relation) { return relation.propertyName === column.propertyName; });
                if (columnRelation && columnRelation.joinColumn) {
                    map[column.name] = entityValue[columnRelation.joinColumn.referencedColumn.propertyName];
                }
                else if (columnRelation && columnRelation.inverseRelation.joinColumn) {
                    map[column.name] = entityValue[columnRelation.inverseRelation.joinColumn.referencedColumn.propertyName];
                }
                else {
                    map[column.name] = entityValue;
                }
            });
        }
        var hasAllIds = Object.keys(map).every(function (key) {
            return map[key] !== undefined && map[key] !== null;
        });
        return hasAllIds ? map : undefined;
    };
    /**

    createSimpleIdMap(id: any): ObjectLiteral {
        const map: ObjectLiteral = {};
        if (this.parentEntityMetadata) {
            this.primaryColumnsWithParentIdColumns.forEach(column => {
                map[column.propertyName] = id;
            });

        } else {
            this.primaryColumns.forEach(column => {
                map[column.propertyName] = id;
            });
        }
        return map;
    } */
    /**
     * Same as createSimpleIdMap, but instead of id column property names it returns database column names.

    createSimpleDatabaseIdMap(id: any): ObjectLiteral {
        const map: ObjectLiteral = {};
        if (this.parentEntityMetadata) {
            this.primaryColumnsWithParentIdColumns.forEach(column => {
                map[column.name] = id;
            });

        } else {
            this.primaryColumns.forEach(column => {
                map[column.name] = id;
            });
        }
        return map;
    }*/
    /**
     * todo: undefined entities should not go there??
     * todo: shouldnt be entity ObjectLiteral here?
     */
    EntityMetadata.prototype.getEntityIdMixedMap = function (entity) {
        if (!entity)
            return undefined;
        var idMap = this.getEntityIdMap(entity);
        if (this.hasMultiplePrimaryKeys) {
            return idMap;
        }
        else if (idMap) {
            return idMap[this.firstPrimaryColumn.propertyName]; // todo: what about parent primary column?
        }
        return idMap;
    };
    /**
     * Same as `getEntityIdMap` but the key of the map will be the column names instead of the property names.
     */
    EntityMetadata.prototype.getEntityIdColumnMap = function (entity) {
        return this.transformIdMapToColumnNames(this.getEntityIdMap(entity));
    };
    EntityMetadata.prototype.transformIdMapToColumnNames = function (idMap) {
        var _this = this;
        if (!idMap) {
            return idMap;
        }
        var map = {};
        Object.keys(idMap).forEach(function (propertyName) {
            var column = _this.getColumnByPropertyName(propertyName);
            if (column) {
                map[column.name] = idMap[propertyName];
            }
        });
        return map;
    };
    EntityMetadata.prototype.getColumnByPropertyName = function (propertyName) {
        return this._columns.find(function (column) { return column.propertyName === propertyName; });
    };
    /**
     * Checks if column with the given property name exist.
     */
    EntityMetadata.prototype.hasColumnWithPropertyName = function (propertyName) {
        return !!this._columns.find(function (column) { return column.propertyName === propertyName; });
    };
    /**
     * Checks if column with the given database name exist.
     */
    EntityMetadata.prototype.hasColumnWithDbName = function (name) {
        return !!this._columns.find(function (column) { return column.name === name; });
    };
    /**
     * Checks if relation with the given property name exist.
     */
    EntityMetadata.prototype.hasRelationWithPropertyName = function (propertyName) {
        return !!this.relations.find(function (relation) { return relation.propertyName === propertyName; });
    };
    /**
     * Finds relation with the given property name.
     */
    EntityMetadata.prototype.findRelationWithPropertyName = function (propertyName) {
        var relation = this.relations.find(function (relation) { return relation.propertyName === propertyName; });
        if (!relation)
            throw new Error("Relation with property name " + propertyName + " in " + this.name + " entity was not found.");
        return relation;
    };
    /**
     * Checks if relation with the given name exist.
     */
    EntityMetadata.prototype.hasRelationWithDbName = function (dbName) {
        return !!this.relationsWithJoinColumns.find(function (relation) { return relation.name === dbName; });
    };
    /**
     * Finds relation with the given name.
     */
    EntityMetadata.prototype.findRelationWithDbName = function (name) {
        var relation = this.relationsWithJoinColumns.find(function (relation) { return relation.name === name; });
        if (!relation)
            throw new Error("Relation with name " + name + " in " + this.name + " entity was not found.");
        return relation;
    };
    EntityMetadata.prototype.addColumn = function (column) {
        this._columns.push(column);
        column.entityMetadata = this;
    };
    EntityMetadata.prototype.extractNonEmptyColumns = function (object) {
        return this.columns.filter(function (column) { return !!object[column.propertyName]; });
    };
    EntityMetadata.prototype.extractNonEmptySingleValueRelations = function (object) {
        return this.relations.filter(function (relation) {
            return (relation.relationType === RelationTypes_1.RelationTypes.ONE_TO_ONE || relation.relationType === RelationTypes_1.RelationTypes.MANY_TO_ONE)
                && !!object[relation.propertyName];
        });
    };
    EntityMetadata.prototype.extractNonEmptyMultiValueRelations = function (object) {
        return this.relations.filter(function (relation) {
            return (relation.relationType === RelationTypes_1.RelationTypes.MANY_TO_MANY || relation.relationType === RelationTypes_1.RelationTypes.ONE_TO_MANY)
                && !!object[relation.propertyName];
        });
    };
    EntityMetadata.prototype.extractExistSingleValueRelations = function (object) {
        return this.relations.filter(function (relation) {
            return (relation.relationType === RelationTypes_1.RelationTypes.ONE_TO_ONE || relation.relationType === RelationTypes_1.RelationTypes.MANY_TO_ONE)
                && object.hasOwnProperty(relation.propertyName);
        });
    };
    EntityMetadata.prototype.extractExistMultiValueRelations = function (object) {
        return this.relations.filter(function (relation) {
            return (relation.relationType === RelationTypes_1.RelationTypes.MANY_TO_MANY || relation.relationType === RelationTypes_1.RelationTypes.ONE_TO_MANY)
                && object.hasOwnProperty(relation.propertyName);
        });
    };
    EntityMetadata.prototype.checkIfObjectContainsAllPrimaryKeys = function (object) {
        return this.primaryColumns.every(function (primaryColumn) {
            return object.hasOwnProperty(primaryColumn.propertyName);
        });
    };
    EntityMetadata.prototype.compareEntities = function (firstEntity, secondEntity) {
        var firstEntityIds = this.getEntityIdMap(firstEntity);
        var secondEntityIds = this.getEntityIdMap(secondEntity);
        return this.compareIds(firstEntityIds, secondEntityIds);
    };
    EntityMetadata.prototype.compareIds = function (firstId, secondId) {
        if (firstId === undefined || firstId === null || secondId === undefined || secondId === null)
            return false;
        return Object.keys(firstId).every(function (key) {
            return firstId[key] === secondId[key];
        });
    };
    /**
     * Compares two entity ids.
     * If any of the given value is empty then it will return false.
     */
    EntityMetadata.prototype.compareEntityMixedIds = function (firstId, secondId) {
        if (firstId === undefined || firstId === null || secondId === undefined || secondId === null)
            return false;
        if (this.hasMultiplePrimaryKeys) {
            return Object.keys(firstId).every(function (key) {
                return firstId[key] === secondId[key];
            });
        }
        else {
            return firstId === secondId;
        }
    };
    /**
     * Iterates throw entity and finds and extracts all values from relations in the entity.
     * If relation value is an array its being flattened.
     */
    EntityMetadata.prototype.extractRelationValuesFromEntity = function (entity, relations) {
        var relationsAndValues = [];
        relations.forEach(function (relation) {
            var value = relation.getEntityValue(entity);
            if (value instanceof Array) {
                value.forEach(function (subValue) { return relationsAndValues.push([relation, subValue, relation.inverseEntityMetadata]); });
            }
            else if (value) {
                relationsAndValues.push([relation, value, relation.inverseEntityMetadata]);
            }
        });
        return relationsAndValues;
    };
    /**
     * Checks if given entity has an id.
     */
    EntityMetadata.prototype.hasId = function (entity) {
        // if (this.metadata.parentEntityMetadata) {
        //     return this.metadata.parentEntityMetadata.parentIdColumns.every(parentIdColumn => {
        //         const columnName = parentIdColumn.propertyName;
        //         return !!entity &&
        //             entity.hasOwnProperty(columnName) &&
        //             entity[columnName] !== null &&
        //             entity[columnName] !== undefined &&
        //             entity[columnName] !== "";
        //     });
        // } else {
        return this.primaryColumns.every(function (primaryColumn) {
            var columnName = primaryColumn.propertyName;
            return !!entity &&
                entity.hasOwnProperty(columnName) &&
                entity[columnName] !== null &&
                entity[columnName] !== undefined &&
                entity[columnName] !== "";
        });
        // }
    };
    Object.defineProperty(EntityMetadata.prototype, "hasNonNullableColumns", {
        /**
         * Checks if there any non-nullable column exist in this entity.
         */
        get: function () {
            return this.relationsWithJoinColumns.some(function (relation) { return !relation.isNullable || relation.isPrimary; });
            // return this.relationsWithJoinColumns.some(relation => relation.isNullable || relation.isPrimary);
        },
        enumerable: true,
        configurable: true
    });
    return EntityMetadata;
}());
exports.EntityMetadata = EntityMetadata;

//# sourceMappingURL=EntityMetadata.js.map
