"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ColumnTypes_1 = require("../metadata/types/ColumnTypes");
var DataTransformationUtils_1 = require("../util/DataTransformationUtils");
/**
 * Subject is a subject of persistence.
 * It holds information about each entity that needs to be persisted:
 * - what entity should be persisted
 * - what is database representation of the persisted entity
 * - what entity metadata of the persisted entity
 * - what is allowed to with persisted entity (insert/update/remove)
 *
 * Having this collection of subjects we can perform database queries.
 */
var Subject = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function Subject(metadata, entity, databaseEntity) {
        /**
         * Date when this entity is persisted.
         */
        this.date = new Date();
        // -------------------------------------------------------------------------
        // Public Properties
        // -------------------------------------------------------------------------
        /**
         * Indicates if this subject can be inserted into the database.
         * This means that this subject either is newly persisted, either can be inserted by cascades.
         */
        this.canBeInserted = false;
        /**
         * Indicates if this subject can be updated in the database.
         * This means that this subject either was persisted, either can be updated by cascades.
         */
        this.canBeUpdated = false;
        /**
         * Indicates if this subject MUST be removed from the database.
         * This means that this subject either was removed, either was removed by cascades.
         */
        this.mustBeRemoved = false;
        /**
         * Differentiated columns between persisted and database entities.
         */
        this.diffColumns = [];
        /**
         * Differentiated relations between persisted and database entities.
         */
        this.diffRelations = [];
        /**
         * List of relations which need to be unset.
         * This is used to update relation from inverse side.
         */
        this.relationUpdates = [];
        /**
         * Records that needs to be inserted into the junction tables of this subject.
         */
        this.junctionInserts = [];
        /**
         * Records that needs to be removed from the junction tables of this subject.
         */
        this.junctionRemoves = [];
        this.metadata = metadata;
        this._persistEntity = entity;
        this._databaseEntity = databaseEntity;
    }
    Object.defineProperty(Subject.prototype, "entity", {
        // -------------------------------------------------------------------------
        // Accessors
        // -------------------------------------------------------------------------
        /**
         * Gets entity sent to the persistence (e.g. changed entity).
         * Throws error if persisted entity was not set.
         */
        get: function () {
            if (!this._persistEntity)
                throw new Error("Persistence entity is not set for the given subject.");
            return this._persistEntity;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Subject.prototype, "hasEntity", {
        /**
         * Checks if subject has a persisted entity.
         */
        get: function () {
            return !!this._persistEntity;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Subject.prototype, "databaseEntity", {
        /**
         * Gets entity from the database (e.g. original entity).
         * Throws error if database entity was not set.
         */
        get: function () {
            if (!this._databaseEntity)
                throw new Error("Database entity is not set for the given subject.");
            return this._databaseEntity;
        },
        /**
         * Sets entity from the database (e.g. original entity).
         * Once database entity set it calculates differentiated columns and relations
         * between persistent entity and database entity.
         */
        set: function (databaseEntity) {
            this._databaseEntity = databaseEntity;
            this.recompute();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Subject.prototype, "hasDatabaseEntity", {
        /**
         * Checks if subject has a database entity.
         */
        get: function () {
            return !!this._databaseEntity;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Subject.prototype, "entityTarget", {
        /**
         * Gets entity target from the entity metadata of this subject.
         */
        get: function () {
            return this.metadata.target;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Subject.prototype, "mustBeInserted", {
        /**
         * Checks if this subject must be inserted into the database.
         * Subject can be inserted into the database if it is allowed to be inserted (explicitly persisted or by cascades)
         * and if it does not have database entity set.
         */
        get: function () {
            return this.canBeInserted && !this.hasDatabaseEntity;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Subject.prototype, "mustBeUpdated", {
        /**
         * Checks if this subject must be updated into the database.
         * Subject can be updated in the database if it is allowed to be updated (explicitly persisted or by cascades)
         * and if it does have differentiated columns or relations.
         */
        get: function () {
            return this.canBeUpdated && (this.diffColumns.length > 0 || this.diffRelations.length > 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Subject.prototype, "hasRelationUpdates", {
        /**
         * Checks if this subject has relations to be updated.
         */
        get: function () {
            return this.relationUpdates.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets id of the persisted entity.
     * If entity is not set then it returns undefined.
     * If entity itself has an id then it simply returns it.
     * If entity does not have an id then it returns newly generated id.

    get getPersistedEntityIdMap(): any|undefined {
        if (!this.hasEntity)
            return undefined;

        const entityIdMap = this.metadata.getDatabaseEntityIdMap(this.entity);
        if (entityIdMap)
            return entityIdMap;

        if (this.newlyGeneratedId)
            return this.metadata.createSimpleDatabaseIdMap(this.newlyGeneratedId);

        return undefined;
    }*/
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Validates this subject for errors.
     * Subject cannot be at the same time inserted and updated, removed and inserted, removed and updated.
     */
    Subject.prototype.validate = function () {
        if (this.mustBeInserted && this.mustBeRemoved)
            throw new Error("Removed entity " + this.metadata.name + " is also scheduled for insert operation. This looks like ORM problem. Please report a github issue.");
        if (this.mustBeUpdated && this.mustBeRemoved)
            throw new Error("Removed entity \"" + this.metadata.name + "\" is also scheduled for update operation. " +
                "Make sure you are not updating and removing same object (note that update or remove may be executed by cascade operations).");
        if (this.mustBeInserted && this.mustBeUpdated)
            throw new Error("Inserted entity " + this.metadata.name + " is also scheduled for updated operation. This looks like ORM problem. Please report a github issue.");
    };
    /**
     * Performs entity re-computations.
     */
    Subject.prototype.recompute = function () {
        if (this.hasEntity && this._databaseEntity) {
            this.computeDiffColumns();
            this.computeDiffRelationalColumns();
        }
    };
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Differentiate columns from the updated entity and entity stored in the database.
     */
    Subject.prototype.computeDiffColumns = function () {
        var _this = this;
        this.diffColumns = this.metadata.allColumns.filter(function (column) {
            // prepare both entity and database values to make comparision
            var entityValue = column.getEntityValue(_this.entity);
            var databaseValue = column.getEntityValue(_this.databaseEntity);
            // normalize special values to make proper comparision
            if (entityValue !== null && entityValue !== undefined) {
                if (column.type === ColumnTypes_1.ColumnTypes.DATE) {
                    entityValue = DataTransformationUtils_1.DataTransformationUtils.mixedDateToDateString(entityValue);
                }
                else if (column.type === ColumnTypes_1.ColumnTypes.TIME) {
                    entityValue = DataTransformationUtils_1.DataTransformationUtils.mixedDateToTimeString(entityValue);
                }
                else if (column.type === ColumnTypes_1.ColumnTypes.DATETIME) {
                    // if (column.loadInLocalTimezone) {
                    //     entityValue = DataTransformationUtils.mixedDateToDatetimeString(entityValue);
                    //     databaseValue = DataTransformationUtils.mixedDateToDatetimeString(databaseValue);
                    // } else {
                    entityValue = DataTransformationUtils_1.DataTransformationUtils.mixedDateToUtcDatetimeString(entityValue);
                    databaseValue = DataTransformationUtils_1.DataTransformationUtils.mixedDateToUtcDatetimeString(databaseValue);
                    // }
                }
                else if (column.type === ColumnTypes_1.ColumnTypes.JSON) {
                    entityValue = JSON.stringify(entityValue);
                    if (databaseValue !== null && databaseValue !== undefined)
                        databaseValue = JSON.stringify(databaseValue);
                }
                else if (column.type === ColumnTypes_1.ColumnTypes.SIMPLE_ARRAY) {
                    entityValue = DataTransformationUtils_1.DataTransformationUtils.simpleArrayToString(entityValue);
                    databaseValue = DataTransformationUtils_1.DataTransformationUtils.simpleArrayToString(databaseValue);
                }
            }
            // if value is not defined then no need to update it
            if (!column.isInEmbedded && _this.entity[column.propertyName] === undefined)
                return false;
            // if value is in embedded and is not defined then no need to update it
            if (column.isInEmbedded && (_this.entity[column.embeddedProperty] === undefined || _this.entity[column.embeddedProperty][column.propertyName] === undefined))
                return false;
            // if its a special column or value is not changed - then do nothing
            if (column.isVirtual ||
                column.isParentId ||
                column.isDiscriminator ||
                column.isUpdateDate ||
                column.isVersion ||
                column.isCreateDate ||
                entityValue === databaseValue)
                return false;
            // filter out "relational columns" only in the case if there is a relation object in entity
            if (!column.isInEmbedded && _this.metadata.hasRelationWithDbName(column.propertyName)) {
                var relation = _this.metadata.findRelationWithDbName(column.propertyName); // todo: why with dbName ?
                if (_this.entity[relation.propertyName] !== null && _this.entity[relation.propertyName] !== undefined)
                    return false;
            }
            return true;
        });
    };
    /**
     * Difference columns of the owning one-to-one and many-to-one columns.
     */
    Subject.prototype.computeDiffRelationalColumns = function () {
        var _this = this;
        this.diffRelations = this.metadata.allRelations.filter(function (relation) {
            if (!relation.isManyToOne && !(relation.isOneToOne && relation.isOwning))
                return false;
            // here we cover two scenarios:
            // 1. related entity can be another entity which is natural way
            // 2. related entity can be entity id which is hacked way of updating entity
            // todo: what to do if there is a column with relationId? (cover this too?)
            var updatedEntityRelationId = _this.entity[relation.propertyName] instanceof Object ?
                relation.inverseEntityMetadata.getEntityIdMixedMap(_this.entity[relation.propertyName])
                : _this.entity[relation.propertyName];
            // here because we have enabled RELATION_ID_VALUES option in the QueryBuilder when we loaded db entities
            // we have in the dbSubject only relationIds.
            // this allows us to compare relation id in the updated subject with id in the database.
            // note that we used relation.name instead of relation.propertyName because query builder with RELATION_ID_VALUES
            // returns values in the relation.name column, not relation.propertyName column
            var dbEntityRelationId = _this.databaseEntity[relation.name];
            // todo: try to find if there is update by relation operation - we dont need to generate update relation operation for this
            // todo: if (updatesByRelations.find(operation => operation.targetEntity === this && operation.updatedRelation === relation))
            // todo:     return false;
            // we don't perform operation over undefined properties
            if (updatedEntityRelationId === undefined)
                return false;
            // if both are empty totally no need to do anything
            if ((updatedEntityRelationId === undefined || updatedEntityRelationId === null) &&
                (dbEntityRelationId === undefined || dbEntityRelationId === null))
                return false;
            // if relation ids aren't equal then we need to update them
            return updatedEntityRelationId !== dbEntityRelationId;
        });
    };
    return Subject;
}());
exports.Subject = Subject;

//# sourceMappingURL=Subject.js.map
