"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TargetMetadataArgsCollection_1 = require("./collection/TargetMetadataArgsCollection");
var PropertyMetadataArgsCollection_1 = require("./collection/PropertyMetadataArgsCollection");
/**
 * Storage all metadatas of all available types: tables, fields, subscribers, relations, etc.
 * Each metadata represents some specifications of what it represents.
 */
var MetadataArgsStorage = (function () {
    function MetadataArgsStorage() {
        // todo: type in function validation, inverse side function validation
        // todo: check on build for duplicate names, since naming checking was removed from MetadataStorage
        // todo: duplicate name checking for: table, relation, column, index, naming strategy, join tables/columns?
        // todo: check for duplicate targets too since this check has been removed too
        // -------------------------------------------------------------------------
        // Properties
        // -------------------------------------------------------------------------
        this.tables = new TargetMetadataArgsCollection_1.TargetMetadataArgsCollection();
        this.entityRepositories = new TargetMetadataArgsCollection_1.TargetMetadataArgsCollection();
        this.transactionEntityManagers = new TargetMetadataArgsCollection_1.TargetMetadataArgsCollection();
        this.namingStrategies = new TargetMetadataArgsCollection_1.TargetMetadataArgsCollection();
        this.entitySubscribers = new TargetMetadataArgsCollection_1.TargetMetadataArgsCollection();
        this.indices = new PropertyMetadataArgsCollection_1.PropertyMetadataArgsCollection();
        this.columns = new PropertyMetadataArgsCollection_1.PropertyMetadataArgsCollection();
        this.relations = new PropertyMetadataArgsCollection_1.PropertyMetadataArgsCollection();
        this.joinColumns = new PropertyMetadataArgsCollection_1.PropertyMetadataArgsCollection();
        this.joinTables = new PropertyMetadataArgsCollection_1.PropertyMetadataArgsCollection();
        this.entityListeners = new PropertyMetadataArgsCollection_1.PropertyMetadataArgsCollection();
        this.relationCounts = new PropertyMetadataArgsCollection_1.PropertyMetadataArgsCollection();
        this.relationIds = new PropertyMetadataArgsCollection_1.PropertyMetadataArgsCollection();
        this.embeddeds = new PropertyMetadataArgsCollection_1.PropertyMetadataArgsCollection();
        this.inheritances = new TargetMetadataArgsCollection_1.TargetMetadataArgsCollection();
        this.discriminatorValues = new TargetMetadataArgsCollection_1.TargetMetadataArgsCollection();
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Gets merged (with all abstract classes) table metadatas for the given classes.
     */
    MetadataArgsStorage.prototype.getMergedTableMetadatas = function (classes) {
        var _this = this;
        var allTableMetadataArgs = classes ? this.tables.filterByTargets(classes) : this.tables;
        var tableMetadatas = allTableMetadataArgs.filter(function (table) { return table.type === "regular" || table.type === "closure" || table.type === "class-table-child"; });
        return tableMetadatas.toArray().map(function (tableMetadata) {
            return _this.mergeWithAbstract(allTableMetadataArgs, tableMetadata);
        });
    };
    /**
     * Gets merged (with all abstract classes) embeddable table metadatas for the given classes.
     */
    MetadataArgsStorage.prototype.getMergedEmbeddableTableMetadatas = function (classes) {
        var _this = this;
        var tables = classes ? this.tables.filterByTargets(classes) : this.tables;
        var embeddableTableMetadatas = tables.filter(function (table) { return table.type === "embeddable"; });
        return embeddableTableMetadatas.toArray().map(function (embeddableTableMetadata) {
            return _this.mergeWithEmbeddable(embeddableTableMetadatas, embeddableTableMetadata);
        });
    };
    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------
    /**
     */
    MetadataArgsStorage.prototype.mergeWithAbstract = function (allTableMetadatas, table) {
        var _this = this;
        var indices = this.indices.filterByTarget(table.target);
        var columns = this.columns.filterByTarget(table.target);
        var relations = this.relations.filterByTarget(table.target);
        var joinColumns = this.joinColumns.filterByTarget(table.target);
        var joinTables = this.joinTables.filterByTarget(table.target);
        var entityListeners = this.entityListeners.filterByTarget(table.target);
        var relationCounts = this.relationCounts.filterByTarget(table.target);
        var relationIds = this.relationIds.filterByTarget(table.target);
        var embeddeds = this.embeddeds.filterByTarget(table.target);
        var inheritances = this.inheritances.filterByTarget(table.target);
        var inheritance = (inheritances.length > 0) ? inheritances.toArray()[0] : undefined;
        var discriminatorValues = [];
        // find parent if this table is class-table-child
        var parent = undefined;
        // merge metadata from abstract tables
        allTableMetadatas.toArray().forEach(function (inheritedTable) {
            if (table.type === "single-table-child")
                return;
            if (!table.target || !inheritedTable.target)
                return;
            if (!(table.target instanceof Function) || !(inheritedTable.target instanceof Function))
                return;
            if (!_this.isInherited(table.target, inheritedTable.target))
                return;
            // check if inheritedTable is a class with class table inheritance - then we don't need to merge its columns, relations, etc. things
            if (!!_this.inheritances.filterByTarget(inheritedTable.target).toArray().find(function (inheritance) { return inheritance.type === "class-table"; })) {
                parent = inheritedTable;
                return;
            }
            var metadatasFromAbstract = _this.mergeWithAbstract(allTableMetadatas, inheritedTable);
            metadatasFromAbstract.indices
                .toArray()
                .filter(function (index) {
                return !index.name || !indices.toArray().find(function (existIndex) { return existIndex.name === index.name; });
            })
                .forEach(function (index) { return indices.add(index); });
            metadatasFromAbstract.columns
                .filterRepeatedMetadatas(columns.toArray())
                .toArray()
                .forEach(function (metadata) { return columns.add(metadata); });
            metadatasFromAbstract.relations
                .filterRepeatedMetadatas(relations.toArray())
                .toArray()
                .forEach(function (metadata) { return relations.add(metadata); });
            metadatasFromAbstract.joinColumns
                .filterRepeatedMetadatas(joinColumns.toArray())
                .toArray()
                .forEach(function (metadata) { return joinColumns.add(metadata); });
            metadatasFromAbstract.joinTables
                .filterRepeatedMetadatas(joinTables.toArray())
                .toArray()
                .forEach(function (metadata) { return joinTables.add(metadata); });
            metadatasFromAbstract.entityListeners
                .filterRepeatedMetadatas(entityListeners.toArray())
                .toArray()
                .forEach(function (metadata) { return entityListeners.add(metadata); });
            metadatasFromAbstract.relationCounts
                .filterRepeatedMetadatas(relationCounts.toArray())
                .toArray()
                .forEach(function (metadata) { return relationCounts.add(metadata); });
            metadatasFromAbstract.relationIds
                .filterRepeatedMetadatas(relationIds.toArray())
                .toArray()
                .forEach(function (metadata) { return relationIds.add(metadata); });
            metadatasFromAbstract.embeddeds
                .filterRepeatedMetadatas(embeddeds.toArray())
                .toArray()
                .forEach(function (metadata) { return embeddeds.add(metadata); });
        });
        // merge metadata from child tables for single-table inheritance
        var children = [];
        if (inheritance && inheritance.type === "single-table") {
            allTableMetadatas.toArray().forEach(function (childTable) {
                if (childTable.type !== "single-table-child")
                    return;
                if (!childTable.target || !table.target)
                    return;
                if (!(childTable.target instanceof Function) || !(table.target instanceof Function))
                    return;
                if (!_this.isInherited(childTable.target, table.target))
                    return;
                children.push(childTable);
                _this.discriminatorValues
                    .filterByTarget(childTable.target)
                    .toArray()
                    .forEach(function (metadata) { return discriminatorValues.push(metadata); });
                // for single table inheritance we also merge all columns, relation, etc. into same table
                if (inheritance.type === "single-table") {
                    var metadatasFromAbstract = _this.mergeWithAbstract(allTableMetadatas, childTable);
                    metadatasFromAbstract.indices
                        .toArray()
                        .filter(function (index) {
                        return !indices.toArray().find(function (existIndex) { return existIndex.name === index.name; });
                    })
                        .forEach(function (index) { return indices.add(index); });
                    metadatasFromAbstract.columns
                        .filterRepeatedMetadatas(columns.toArray())
                        .toArray()
                        .forEach(function (metadata) { return columns.add(metadata); });
                    metadatasFromAbstract.relations
                        .filterRepeatedMetadatas(relations.toArray())
                        .toArray()
                        .forEach(function (metadata) { return relations.add(metadata); });
                    metadatasFromAbstract.joinColumns
                        .filterRepeatedMetadatas(joinColumns.toArray())
                        .toArray()
                        .forEach(function (metadata) { return joinColumns.add(metadata); });
                    metadatasFromAbstract.joinTables
                        .filterRepeatedMetadatas(joinTables.toArray())
                        .toArray()
                        .forEach(function (metadata) { return joinTables.add(metadata); });
                    metadatasFromAbstract.entityListeners
                        .filterRepeatedMetadatas(entityListeners.toArray())
                        .toArray()
                        .forEach(function (metadata) { return entityListeners.add(metadata); });
                    metadatasFromAbstract.relationCounts
                        .filterRepeatedMetadatas(relationCounts.toArray())
                        .toArray()
                        .forEach(function (metadata) { return relationCounts.add(metadata); });
                    metadatasFromAbstract.relationIds
                        .filterRepeatedMetadatas(relationIds.toArray())
                        .toArray()
                        .forEach(function (metadata) { return relationIds.add(metadata); });
                    metadatasFromAbstract.embeddeds
                        .filterRepeatedMetadatas(embeddeds.toArray())
                        .toArray()
                        .forEach(function (metadata) { return embeddeds.add(metadata); });
                    metadatasFromAbstract.children
                        .forEach(function (metadata) { return children.push(metadata); });
                }
            });
        }
        return {
            table: table,
            parent: parent,
            inheritance: inheritance,
            children: children,
            indices: indices,
            columns: columns,
            relations: relations,
            joinColumns: joinColumns,
            joinTables: joinTables,
            entityListeners: entityListeners,
            relationCounts: relationCounts,
            relationIds: relationIds,
            embeddeds: embeddeds,
            discriminatorValues: discriminatorValues
        };
    };
    /**
     */
    MetadataArgsStorage.prototype.mergeWithEmbeddable = function (allTableMetadatas, tableMetadata) {
        var _this = this;
        var columns = this.columns.filterByTarget(tableMetadata.target);
        allTableMetadatas
            .filter(function (metadata) {
            if (!tableMetadata.target || !metadata.target)
                return false;
            if (!(tableMetadata.target instanceof Function) || !(metadata.target instanceof Function))
                return false;
            return _this.isInherited(tableMetadata.target, metadata.target); // todo: fix it for entity schema
        })
            .toArray()
            .forEach(function (parentMetadata) {
            var metadatasFromParents = _this.mergeWithEmbeddable(allTableMetadatas, parentMetadata);
            metadatasFromParents.columns
                .filterRepeatedMetadatas(columns.toArray())
                .toArray()
                .forEach(function (metadata) { return columns.add(metadata); });
        });
        return {
            table: tableMetadata,
            columns: columns
        };
    };
    /**
     * Checks if this table is inherited from another table.
     */
    MetadataArgsStorage.prototype.isInherited = function (target1, target2) {
        // we cannot use instanceOf in this method, because we need order of inherited tables, to ensure that
        // properties get inherited in a right order. To achieve it we can only check a first parent of the class
        // return this.target.prototype instanceof anotherTable.target;
        return Object.getPrototypeOf(target1.prototype).constructor === target2;
    };
    return MetadataArgsStorage;
}());
exports.MetadataArgsStorage = MetadataArgsStorage;

//# sourceMappingURL=MetadataArgsStorage.js.map
