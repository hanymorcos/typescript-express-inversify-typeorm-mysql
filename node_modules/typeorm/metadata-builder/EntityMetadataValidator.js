"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UsingJoinTableIsNotAllowedError_1 = require("./error/UsingJoinTableIsNotAllowedError");
var UsingJoinTableOnlyOnOneSideAllowedError_1 = require("./error/UsingJoinTableOnlyOnOneSideAllowedError");
var UsingJoinColumnIsNotAllowedError_1 = require("./error/UsingJoinColumnIsNotAllowedError");
var UsingJoinColumnOnlyOnOneSideAllowedError_1 = require("./error/UsingJoinColumnOnlyOnOneSideAllowedError");
var MissingJoinColumnError_1 = require("./error/MissingJoinColumnError");
var MissingJoinTableError_1 = require("./error/MissingJoinTableError");
var MissingPrimaryColumnError_1 = require("./error/MissingPrimaryColumnError");
var CircularRelationsError_1 = require("./error/CircularRelationsError");
var DepGraph_1 = require("../util/DepGraph");
/// todo: add check if there are multiple tables with the same name
/// todo: add checks when generated column / table names are too long for the specific driver
/**
 * Validates built entity metadatas.
 */
var EntityMetadataValidator = (function () {
    function EntityMetadataValidator() {
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Validates all given entity metadatas.
     */
    EntityMetadataValidator.prototype.validateMany = function (entityMetadatas) {
        var _this = this;
        entityMetadatas.forEach(function (entityMetadata) { return _this.validate(entityMetadata, entityMetadatas); });
        this.validateDependencies(entityMetadatas);
    };
    /**
     * Validates given entity metadata.
     */
    EntityMetadataValidator.prototype.validate = function (entityMetadata, allEntityMetadatas) {
        // check if table metadata has an id
        if (!entityMetadata.table.isClassTableChild && !entityMetadata.primaryColumns.length && !entityMetadata.junction)
            throw new MissingPrimaryColumnError_1.MissingPrimaryColumnError(entityMetadata);
        // validate if table is using inheritance it has a discriminator
        // also validate if discriminator values are not empty and not repeated
        if (entityMetadata.inheritanceType === "single-table") {
            if (!entityMetadata.hasDiscriminatorColumn)
                throw new Error("Entity " + entityMetadata.name + " using single-table inheritance, it should also have a discriminator column. Did you forget to put @DiscriminatorColumn decorator?");
            if (["", undefined, null].indexOf(entityMetadata.discriminatorValue) !== -1)
                throw new Error("Entity " + entityMetadata.name + " has empty discriminator value. Discriminator value should not be empty.");
            var sameDiscriminatorValueEntityMetadata = allEntityMetadatas.find(function (metadata) {
                return metadata !== entityMetadata && metadata.discriminatorValue === entityMetadata.discriminatorValue;
            });
            if (sameDiscriminatorValueEntityMetadata)
                throw new Error("Entities " + entityMetadata.name + " and " + sameDiscriminatorValueEntityMetadata.name + " as equal discriminator values. Make sure their discriminator values are not equal using @DiscriminatorValue decorator.");
        }
        // validate relations
        entityMetadata.relations.forEach(function (relation) {
            // check join tables:
            // using JoinTable is possible only on one side of the many-to-many relation
            if (relation.joinTable) {
                if (!relation.isManyToMany)
                    throw new UsingJoinTableIsNotAllowedError_1.UsingJoinTableIsNotAllowedError(entityMetadata, relation);
                // if there is inverse side of the relation, then check if it does not have join table too
                if (relation.hasInverseSide && relation.inverseRelation.joinTable)
                    throw new UsingJoinTableOnlyOnOneSideAllowedError_1.UsingJoinTableOnlyOnOneSideAllowedError(entityMetadata, relation);
            }
            // check join columns:
            // using JoinColumn is possible only on one side of the relation and on one-to-one, many-to-one relation types
            // first check if relation is one-to-one or many-to-one
            if (relation.joinColumn) {
                // join column can be applied only on one-to-one and many-to-one relations
                if (!relation.isOneToOne && !relation.isManyToOne)
                    throw new UsingJoinColumnIsNotAllowedError_1.UsingJoinColumnIsNotAllowedError(entityMetadata, relation);
                // if there is inverse side of the relation, then check if it does not have join table too
                if (relation.hasInverseSide && relation.inverseRelation.joinColumn && relation.isOneToOne)
                    throw new UsingJoinColumnOnlyOnOneSideAllowedError_1.UsingJoinColumnOnlyOnOneSideAllowedError(entityMetadata, relation);
                // check if join column really has referenced column
                if (relation.joinColumn && !relation.joinColumn.referencedColumn)
                    throw new Error("Join column does not have referenced column set");
            }
            // if its a one-to-one relation and JoinColumn is missing on both sides of the relation
            // or its one-side relation without JoinColumn we should give an error
            if (!relation.joinColumn && relation.isOneToOne && (!relation.hasInverseSide || !relation.inverseRelation.joinColumn))
                throw new MissingJoinColumnError_1.MissingJoinColumnError(entityMetadata, relation);
            // if its a many-to-many relation and JoinTable is missing on both sides of the relation
            // or its one-side relation without JoinTable we should give an error
            if (!relation.joinTable && relation.isManyToMany && (!relation.hasInverseSide || !relation.inverseRelation.joinTable))
                throw new MissingJoinTableError_1.MissingJoinTableError(entityMetadata, relation);
            // todo: validate if its one-to-one and side which does not have join column MUST have inverse side
            // todo: validate if its many-to-many and side which does not have join table MUST have inverse side
            // todo: if there is a relation, and inverse side is specified only on one side, shall we give error
            // todo: with message like: "Inverse side is specified only on one side of the relationship. Specify on other side too to prevent confusion".
            // todo: add validation if there two entities with the same target, and show error message with description of the problem (maybe file was renamed/moved but left in output directory)
            // todo: check if there are multiple columns on the same column applied.
        });
        // make sure cascade remove is not set for both sides of relationships (can be set in OneToOne decorators)
        entityMetadata.relations.forEach(function (relation) {
            var isCircularCascadeRemove = relation.isCascadeRemove && relation.hasInverseSide && relation.inverseRelation.isCascadeRemove;
            if (isCircularCascadeRemove)
                throw new Error("Relation " + entityMetadata.name + "#" + relation.propertyName + " and " + relation.inverseRelation.entityMetadata.name + "#" + relation.inverseRelation.propertyName + " both has cascade remove set. " +
                    "This may lead to unexpected circular removals. Please set cascade remove only from one side of relationship.");
        }); // todo: maybe better just deny removal from one to one relation without join column?
    };
    /**
     * Validates dependencies of the entity metadatas.
     */
    EntityMetadataValidator.prototype.validateDependencies = function (entityMetadatas) {
        var graph = new DepGraph_1.DepGraph();
        entityMetadatas.forEach(function (entityMetadata) {
            graph.addNode(entityMetadata.name);
        });
        entityMetadatas.forEach(function (entityMetadata) {
            entityMetadata.relationsWithJoinColumns
                .filter(function (relation) { return !relation.isNullable; })
                .forEach(function (relation) {
                graph.addDependency(entityMetadata.name, relation.inverseEntityMetadata.name);
            });
        });
        try {
            graph.overallOrder();
        }
        catch (err) {
            throw new CircularRelationsError_1.CircularRelationsError(err.toString().replace("Error: Dependency Cycle Found: ", ""));
        }
    };
    return EntityMetadataValidator;
}());
exports.EntityMetadataValidator = EntityMetadataValidator;

//# sourceMappingURL=EntityMetadataValidator.js.map
