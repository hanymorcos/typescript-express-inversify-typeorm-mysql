"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EntityMetadata_1 = require("../metadata/EntityMetadata");
var ColumnMetadata_1 = require("../metadata/ColumnMetadata");
var ForeignKeyMetadata_1 = require("../metadata/ForeignKeyMetadata");
var EntityMetadataValidator_1 = require("./EntityMetadataValidator");
var IndexMetadata_1 = require("../metadata/IndexMetadata");
var JoinColumnMetadata_1 = require("../metadata/JoinColumnMetadata");
var TableMetadata_1 = require("../metadata/TableMetadata");
var index_1 = require("../index");
var RelationMetadata_1 = require("../metadata/RelationMetadata");
var JoinTableMetadata_1 = require("../metadata/JoinTableMetadata");
var JunctionEntityMetadataBuilder_1 = require("./JunctionEntityMetadataBuilder");
var ClosureJunctionEntityMetadataBuilder_1 = require("./ClosureJunctionEntityMetadataBuilder");
var EmbeddedMetadata_1 = require("../metadata/EmbeddedMetadata");
var MetadataArgsStorage_1 = require("../metadata-args/MetadataArgsStorage");
/**
 * Aggregates all metadata: table, column, relation into one collection grouped by tables for a given set of classes.
 */
var EntityMetadataBuilder = (function () {
    function EntityMetadataBuilder() {
    }
    // todo: type in function validation, inverse side function validation
    // todo: check on build for duplicate names, since naming checking was removed from MetadataStorage
    // todo: duplicate name checking for: table, relation, column, index, naming strategy, join tables/columns?
    // todo: check if multiple tree parent metadatas in validator
    // todo: tree decorators can be used only on closure table (validation)
    // todo: throw error if parent tree metadata was not specified in a closure table
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    EntityMetadataBuilder.prototype.buildFromSchemas = function (driver, lazyRelationsWrapper, namingStrategy, schemas) {
        var metadataArgsStorage = new MetadataArgsStorage_1.MetadataArgsStorage();
        // extract into separate class?
        schemas.forEach(function (schema) {
            // add table metadata args from the schema
            var tableSchema = schema.table || {};
            var table = {
                target: schema.target || schema.name,
                name: tableSchema.name,
                type: tableSchema.type || "regular",
                // targetId: schema.name,
                orderBy: tableSchema.orderBy
            };
            metadataArgsStorage.tables.add(table);
            // add columns metadata args from the schema
            Object.keys(schema.columns).forEach(function (columnName) {
                var columnSchema = schema.columns[columnName];
                var mode = "regular";
                if (columnSchema.createDate)
                    mode = "createDate";
                if (columnSchema.updateDate)
                    mode = "updateDate";
                if (columnSchema.version)
                    mode = "version";
                if (columnSchema.treeChildrenCount)
                    mode = "treeChildrenCount";
                if (columnSchema.treeLevel)
                    mode = "treeLevel";
                var column = {
                    target: schema.target || schema.name,
                    mode: mode,
                    propertyName: columnName,
                    // todo: what to do with it?: propertyType: 
                    options: {
                        type: columnSchema.type,
                        name: columnSchema.name,
                        length: columnSchema.length,
                        primary: columnSchema.primary,
                        generated: columnSchema.generated,
                        unique: columnSchema.unique,
                        nullable: columnSchema.nullable,
                        comment: columnSchema.comment,
                        default: columnSchema.default,
                        precision: columnSchema.precision,
                        scale: columnSchema.scale
                    }
                };
                metadataArgsStorage.columns.add(column);
            });
            // add relation metadata args from the schema
            if (schema.relations) {
                Object.keys(schema.relations).forEach(function (relationName) {
                    var relationSchema = schema.relations[relationName];
                    var relation = {
                        target: schema.target || schema.name,
                        propertyName: relationName,
                        relationType: relationSchema.type,
                        isLazy: relationSchema.isLazy || false,
                        type: relationSchema.target,
                        inverseSideProperty: relationSchema.inverseSide,
                        isTreeParent: relationSchema.isTreeParent,
                        isTreeChildren: relationSchema.isTreeChildren,
                        options: {
                            cascadeAll: relationSchema.cascadeAll,
                            cascadeInsert: relationSchema.cascadeInsert,
                            cascadeUpdate: relationSchema.cascadeUpdate,
                            cascadeRemove: relationSchema.cascadeRemove,
                            nullable: relationSchema.nullable,
                            onDelete: relationSchema.onDelete
                        }
                    };
                    metadataArgsStorage.relations.add(relation);
                    // add join column
                    if (relationSchema.joinColumn) {
                        if (typeof relationSchema.joinColumn === "boolean") {
                            var joinColumn = {
                                target: schema.target || schema.name,
                                propertyName: relationName
                            };
                            metadataArgsStorage.joinColumns.add(joinColumn);
                        }
                        else {
                            var joinColumn = {
                                target: schema.target || schema.name,
                                propertyName: relationName,
                                name: relationSchema.joinColumn.name,
                                referencedColumnName: relationSchema.joinColumn.referencedColumnName
                            };
                            metadataArgsStorage.joinColumns.add(joinColumn);
                        }
                    }
                    // add join table
                    if (relationSchema.joinTable) {
                        if (typeof relationSchema.joinTable === "boolean") {
                            var joinTable = {
                                target: schema.target || schema.name,
                                propertyName: relationName
                            };
                            metadataArgsStorage.joinTables.add(joinTable);
                        }
                        else {
                            var joinTable = {
                                target: schema.target || schema.name,
                                propertyName: relationName,
                                name: relationSchema.joinTable.name,
                                joinColumn: relationSchema.joinTable.joinColumn,
                                inverseJoinColumn: relationSchema.joinTable.inverseJoinColumn
                            };
                            metadataArgsStorage.joinTables.add(joinTable);
                        }
                    }
                });
            }
        });
        return this.build(driver, lazyRelationsWrapper, metadataArgsStorage, namingStrategy);
    };
    /**
     * Builds a complete metadata aggregations for the given entity classes.
     */
    EntityMetadataBuilder.prototype.buildFromMetadataArgsStorage = function (driver, lazyRelationsWrapper, namingStrategy, entityClasses) {
        return this.build(driver, lazyRelationsWrapper, index_1.getMetadataArgsStorage(), namingStrategy, entityClasses);
    };
    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------
    EntityMetadataBuilder.prototype.build = function (driver, lazyRelationsWrapper, metadataArgsStorage, namingStrategy, entityClasses) {
        var embeddableMergedArgs = metadataArgsStorage.getMergedEmbeddableTableMetadatas(entityClasses);
        var entityMetadatas = [];
        var allMergedArgs = metadataArgsStorage.getMergedTableMetadatas(entityClasses);
        allMergedArgs.forEach(function (mergedArgs) {
            var tables = [mergedArgs.table].concat(mergedArgs.children);
            tables.forEach(function (tableArgs) {
                // find embeddable tables for embeddeds registered in this table and create EmbeddedMetadatas from them
                var embeddeds = [];
                mergedArgs.embeddeds.toArray().forEach(function (embedded) {
                    var embeddableTable = embeddableMergedArgs.find(function (embeddedMergedArgs) { return embeddedMergedArgs.table.target === embedded.type(); });
                    if (embeddableTable) {
                        var table_1 = new TableMetadata_1.TableMetadata(embeddableTable.table);
                        var columns_1 = embeddableTable.columns.toArray().map(function (args) { return new ColumnMetadata_1.ColumnMetadata(args); });
                        embeddeds.push(new EmbeddedMetadata_1.EmbeddedMetadata(embedded.type(), embedded.propertyName, table_1, columns_1));
                    }
                });
                // create metadatas from args
                var argsForTable = mergedArgs.inheritance && mergedArgs.inheritance.type === "single-table" ? mergedArgs.table : tableArgs;
                var table = new TableMetadata_1.TableMetadata(argsForTable);
                var columns = mergedArgs.columns.toArray().map(function (args) {
                    // if column's target is a child table then this column should have all nullable columns
                    if (mergedArgs.inheritance &&
                        mergedArgs.inheritance.type === "single-table" &&
                        args.target !== mergedArgs.table.target && !!mergedArgs.children.find(function (childTable) { return childTable.target === args.target; })) {
                        args.options.nullable = true;
                    }
                    return new ColumnMetadata_1.ColumnMetadata(args);
                });
                var relations = mergedArgs.relations.toArray().map(function (args) { return new RelationMetadata_1.RelationMetadata(args); });
                var indices = mergedArgs.indices.toArray().map(function (args) { return new IndexMetadata_1.IndexMetadata(args); });
                var discriminatorValueArgs = mergedArgs.discriminatorValues.find(function (discriminatorValueArgs) {
                    return discriminatorValueArgs.target === tableArgs.target;
                });
                // create a new entity metadata
                var entityMetadata = new EntityMetadata_1.EntityMetadata({
                    junction: false,
                    target: tableArgs.target,
                    tablesPrefix: driver.options.tablesPrefix,
                    namingStrategy: namingStrategy,
                    tableMetadata: table,
                    columnMetadatas: columns,
                    relationMetadatas: relations,
                    indexMetadatas: indices,
                    embeddedMetadatas: embeddeds,
                    inheritanceType: mergedArgs.inheritance ? mergedArgs.inheritance.type : undefined,
                    discriminatorValue: discriminatorValueArgs ? discriminatorValueArgs.value : tableArgs.target.name // todo: pass this to naming strategy to generate a name
                }, lazyRelationsWrapper);
                entityMetadatas.push(entityMetadata);
                // create entity's relations join tables
                entityMetadata.manyToManyRelations.forEach(function (relation) {
                    var joinTableMetadata = mergedArgs.joinTables.findByProperty(relation.propertyName);
                    if (joinTableMetadata) {
                        var joinTable = new JoinTableMetadata_1.JoinTableMetadata(joinTableMetadata);
                        relation.joinTable = joinTable;
                        joinTable.relation = relation;
                    }
                });
                // create entity's relations join columns
                entityMetadata.oneToOneRelations
                    .concat(entityMetadata.manyToOneRelations)
                    .forEach(function (relation) {
                    // since for many-to-one relations having JoinColumn is not required on decorators level, we need to go
                    // throw all of them which don't have JoinColumn decorators and create it for them
                    var joinColumnMetadata = mergedArgs.joinColumns.findByProperty(relation.propertyName);
                    if (!joinColumnMetadata && relation.isManyToOne) {
                        joinColumnMetadata = {
                            target: relation.entityMetadata.target,
                            propertyName: relation.propertyName
                        };
                    }
                    if (joinColumnMetadata) {
                        var joinColumn = new JoinColumnMetadata_1.JoinColumnMetadata(joinColumnMetadata);
                        relation.joinColumn = joinColumn;
                        joinColumn.relation = relation;
                    }
                });
                // save relation id-s data
                entityMetadata.relations.forEach(function (relation) {
                    var relationIdMetadata = mergedArgs.relationIds.toArray().find(function (relationId) {
                        if (relationId.relation instanceof Function)
                            return relation.propertyName === relationId.relation(entityMetadata.createPropertiesMap());
                        return relation.propertyName === relationId.relation;
                    });
                    if (relationIdMetadata) {
                        if (relation.isOneToOneNotOwner || relation.isOneToMany)
                            throw new Error("RelationId cannot be used for the one-to-one without join column or one-to-many relations.");
                        relation.idField = relationIdMetadata.propertyName;
                    }
                });
                // save relation counter-s data
                entityMetadata.relations.forEach(function (relation) {
                    var relationCountMetadata = mergedArgs.relationCounts.toArray().find(function (relationCount) {
                        if (relationCount.relation instanceof Function)
                            return relation.propertyName === relationCount.relation(entityMetadata.createPropertiesMap());
                        return relation.propertyName === relationCount.relation;
                    });
                    if (relationCountMetadata)
                        relation.countField = relationCountMetadata.propertyName;
                });
                // add lazy initializer for entity relations
                if (entityMetadata.target instanceof Function) {
                    entityMetadata.relations
                        .filter(function (relation) { return relation.isLazy; })
                        .forEach(function (relation) {
                        lazyRelationsWrapper.wrap(entityMetadata.target.prototype, relation);
                    });
                }
            });
        });
        // after all metadatas created we set inverse side (related) entity metadatas for all relation metadatas
        entityMetadatas.forEach(function (entityMetadata) {
            entityMetadata.relations.forEach(function (relation) {
                var inverseEntityMetadata = entityMetadatas.find(function (m) { return m.target === relation.type || (typeof relation.type === "string" && m.targetName === relation.type); });
                if (!inverseEntityMetadata)
                    throw new Error("Entity metadata for " + entityMetadata.name + "#" + relation.propertyName + " was not found.");
                relation.inverseEntityMetadata = inverseEntityMetadata;
            });
        });
        // after all metadatas created we set parent entity metadata for class-table inheritance
        entityMetadatas.forEach(function (entityMetadata) {
            var mergedArgs = allMergedArgs.find(function (mergedArgs) {
                return mergedArgs.table.target === entityMetadata.target;
            });
            if (mergedArgs && mergedArgs.parent) {
                var parentEntityMetadata = entityMetadatas.find(function (entityMetadata) { return entityMetadata.table.target === mergedArgs.parent.target; }); // todo: weird compiler error here, thats why type casing is used
                if (parentEntityMetadata)
                    entityMetadata.parentEntityMetadata = parentEntityMetadata;
            }
        });
        // generate keys for tables with single-table inheritance
        entityMetadatas
            .filter(function (metadata) { return metadata.inheritanceType === "single-table" && metadata.hasDiscriminatorColumn; })
            .forEach(function (metadata) {
            var indexForKey = new IndexMetadata_1.IndexMetadata({
                target: metadata.target,
                columns: [metadata.discriminatorColumn.name],
                unique: false
            });
            indexForKey.entityMetadata = metadata;
            metadata.indices.push(indexForKey);
            var indexForKeyWithPrimary = new IndexMetadata_1.IndexMetadata({
                target: metadata.target,
                columns: [metadata.firstPrimaryColumn.propertyName, metadata.discriminatorColumn.propertyName],
                unique: false
            });
            indexForKeyWithPrimary.entityMetadata = metadata;
            metadata.indices.push(indexForKeyWithPrimary);
        });
        // generate virtual column with foreign key for class-table inheritance
        entityMetadatas
            .filter(function (metadata) { return !!metadata.parentEntityMetadata; })
            .forEach(function (metadata) {
            var parentEntityMetadataPrimaryColumn = metadata.parentEntityMetadata.firstPrimaryColumn; // todo: make sure to create columns for all its primary columns
            var columnName = namingStrategy.classTableInheritanceParentColumnName(metadata.parentEntityMetadata.table.name, parentEntityMetadataPrimaryColumn.propertyName);
            var parentRelationColumn = new ColumnMetadata_1.ColumnMetadata({
                target: metadata.parentEntityMetadata.table.target,
                propertyName: parentEntityMetadataPrimaryColumn.propertyName,
                // propertyType: parentEntityMetadataPrimaryColumn.propertyType,
                mode: "parentId",
                options: {
                    name: columnName,
                    type: parentEntityMetadataPrimaryColumn.type,
                    unique: true,
                    nullable: false,
                    primary: false
                }
            });
            // add column
            metadata.addColumn(parentRelationColumn);
            // add foreign key
            var foreignKey = new ForeignKeyMetadata_1.ForeignKeyMetadata([parentRelationColumn], metadata.parentEntityMetadata.table, [parentEntityMetadataPrimaryColumn], "CASCADE");
            foreignKey.entityMetadata = metadata;
            metadata.foreignKeys.push(foreignKey);
        });
        // generate columns and foreign keys for tables with relations
        entityMetadatas.forEach(function (metadata) {
            metadata.relationsWithJoinColumns.forEach(function (relation) {
                // find relational column and if it does not exist - add it
                var inverseSideColumn = relation.joinColumn.referencedColumn;
                var relationalColumn = metadata.columns.find(function (column) { return column.name === relation.name; });
                if (!relationalColumn) {
                    relationalColumn = new ColumnMetadata_1.ColumnMetadata({
                        target: metadata.target,
                        propertyName: relation.name,
                        // propertyType: inverseSideColumn.propertyType,
                        mode: "virtual",
                        options: {
                            type: inverseSideColumn.type,
                            nullable: relation.isNullable,
                            primary: relation.isPrimary
                        }
                    });
                    relationalColumn.relationMetadata = relation;
                    metadata.addColumn(relationalColumn);
                }
                // create and add foreign key
                var foreignKey = new ForeignKeyMetadata_1.ForeignKeyMetadata([relationalColumn], relation.inverseEntityMetadata.table, [inverseSideColumn], relation.onDelete);
                foreignKey.entityMetadata = metadata;
                metadata.foreignKeys.push(foreignKey);
            });
        });
        // generate junction tables for all closure tables
        entityMetadatas.forEach(function (metadata) {
            if (!metadata.table.isClosure)
                return;
            if (metadata.primaryColumns.length > 1)
                throw new Error("Cannot use given entity " + metadata.name + " as a closure table, because it have multiple primary keys. Entities with multiple primary keys are not supported in closure tables.");
            var closureJunctionEntityMetadata = index_1.getFromContainer(ClosureJunctionEntityMetadataBuilder_1.ClosureJunctionEntityMetadataBuilder).build(driver, lazyRelationsWrapper, {
                namingStrategy: namingStrategy,
                table: metadata.table,
                primaryColumn: metadata.firstPrimaryColumn,
                hasTreeLevelColumn: metadata.hasTreeLevelColumn
            });
            metadata.closureJunctionTable = closureJunctionEntityMetadata;
            entityMetadatas.push(closureJunctionEntityMetadata);
        });
        // generate junction tables for all many-to-many tables
        entityMetadatas.forEach(function (metadata) {
            metadata.ownerManyToManyRelations.forEach(function (relation) {
                var junctionEntityMetadata = index_1.getFromContainer(JunctionEntityMetadataBuilder_1.JunctionEntityMetadataBuilder).build(driver, lazyRelationsWrapper, {
                    namingStrategy: namingStrategy,
                    firstTable: metadata.table,
                    secondTable: relation.inverseEntityMetadata.table,
                    joinTable: relation.joinTable
                });
                relation.junctionEntityMetadata = junctionEntityMetadata;
                if (relation.hasInverseSide)
                    relation.inverseRelation.junctionEntityMetadata = junctionEntityMetadata;
                entityMetadatas.push(junctionEntityMetadata);
            });
        });
        // check for errors in a built metadata schema (we need to check after relationEntityMetadata is set)
        index_1.getFromContainer(EntityMetadataValidator_1.EntityMetadataValidator).validateMany(entityMetadatas);
        return entityMetadatas;
    };
    return EntityMetadataBuilder;
}());
exports.EntityMetadataBuilder = EntityMetadataBuilder;

//# sourceMappingURL=EntityMetadataBuilder.js.map
