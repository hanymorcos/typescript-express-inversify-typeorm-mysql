"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OrmUtils_1 = require("../../util/OrmUtils");
/**
 * Transforms raw sql results returned from the database into entity object.
 * Entity is constructed based on its entity metadata.
 */
var RawSqlResultsToEntityTransformer = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function RawSqlResultsToEntityTransformer(driver, aliasMap, joinMappings, relationCountMetas, enableRelationIdValues) {
        this.driver = driver;
        this.aliasMap = aliasMap;
        this.joinMappings = joinMappings;
        this.relationCountMetas = relationCountMetas;
        this.enableRelationIdValues = enableRelationIdValues;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    RawSqlResultsToEntityTransformer.prototype.transform = function (rawSqlResults) {
        // console.log("rawSqlResults: ", rawSqlResults);
        return this.groupAndTransform(rawSqlResults, this.aliasMap.mainAlias);
    };
    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------
    /**
     * Since db returns a duplicated rows of the data where accuracies of the same object can be duplicated
     * we need to group our result and we must have some unique id (primary key in our case)
     */
    RawSqlResultsToEntityTransformer.prototype.groupAndTransform = function (rawSqlResults, alias) {
        var _this = this;
        var metadata = this.aliasMap.getEntityMetadataByAlias(alias);
        if (!metadata)
            throw new Error("Cannot get entity metadata for the given alias " + alias.name);
        var groupedResults = OrmUtils_1.OrmUtils.groupBy(rawSqlResults, function (result) {
            if (!metadata)
                return;
            return metadata.primaryColumnsWithParentIdColumns.map(function (column) { return result[alias.name + "_" + column.name]; }).join("_"); // todo: check it
        });
        // console.log("groupedResults: ", groupedResults);
        return groupedResults
            .map(function (group) {
            if (!metadata)
                return;
            return _this.transformIntoSingleResult(group.items, alias, metadata);
        })
            .filter(function (res) { return !!res; });
    };
    /**
     * Transforms set of data results into single entity.
     */
    RawSqlResultsToEntityTransformer.prototype.transformIntoSingleResult = function (rawSqlResults, alias, metadata) {
        var _this = this;
        var entity = metadata.create();
        var hasData = false;
        // console.log(rawSqlResults);
        // add special columns that contains relation ids
        if (this.enableRelationIdValues) {
            metadata.columns
                .filter(function (column) { return !!column.relationMetadata; })
                .forEach(function (column) {
                var valueInObject = rawSqlResults[0][alias.name + "_" + column.name]; // we use zero index since its grouped data
                if (valueInObject !== undefined && valueInObject !== null && column.propertyName) {
                    var value = _this.driver.prepareHydratedValue(valueInObject, column);
                    entity[column.propertyName] = value;
                    hasData = true;
                }
            });
        } // */
        this.joinMappings
            .filter(function (joinMapping) { return joinMapping.parentName === alias.name && !joinMapping.alias.parentAliasName && joinMapping.alias.target; })
            .map(function (joinMapping) {
            var relatedEntities = _this.groupAndTransform(rawSqlResults, joinMapping.alias);
            var isResultArray = joinMapping.isMany;
            var result = !isResultArray ? relatedEntities[0] : relatedEntities;
            if (result && (!isResultArray || result.length > 0)) {
                entity[joinMapping.propertyName] = result;
                hasData = true;
            }
        });
        // get value from columns selections and put them into object
        metadata.columns.forEach(function (column) {
            var columnName = column.name;
            var valueInObject = rawSqlResults[0][alias.name + "_" + columnName]; // we use zero index since its grouped data
            if (valueInObject !== undefined && valueInObject !== null && column.propertyName && !column.isVirtual && !column.isParentId && !column.isDiscriminator) {
                var value = _this.driver.prepareHydratedValue(valueInObject, column);
                if (column.isInEmbedded) {
                    if (!entity[column.embeddedProperty])
                        entity[column.embeddedProperty] = column.embeddedMetadata.create();
                    entity[column.embeddedProperty][column.propertyName] = value;
                }
                else {
                    entity[column.propertyName] = value;
                }
                hasData = true;
            }
        });
        // add parent tables metadata
        // console.log(rawSqlResults);
        if (metadata.parentEntityMetadata) {
            metadata.parentEntityMetadata.columns.forEach(function (column) {
                var columnName = column.name;
                var valueInObject = rawSqlResults[0]["parentIdColumn_" + metadata.parentEntityMetadata.table.name + "_" + columnName]; // we use zero index since its grouped data
                if (valueInObject !== undefined && valueInObject !== null && column.propertyName && !column.isVirtual && !column.isParentId && !column.isDiscriminator) {
                    var value = _this.driver.prepareHydratedValue(valueInObject, column);
                    if (column.isInEmbedded) {
                        if (!entity[column.embeddedProperty])
                            entity[column.embeddedProperty] = column.embeddedMetadata.create();
                        entity[column.embeddedProperty][column.propertyName] = value;
                    }
                    else {
                        entity[column.propertyName] = value;
                    }
                    hasData = true;
                }
            });
        }
        // if relation is loaded then go into it recursively and transform its values too
        metadata.relations.forEach(function (relation) {
            var relationAlias = _this.aliasMap.findAliasByParent(alias.name, relation.propertyName);
            if (relationAlias) {
                var joinMapping = _this.joinMappings.find(function (joinMapping) { return joinMapping.type === "join" && joinMapping.alias === relationAlias; });
                var relatedEntities = _this.groupAndTransform(rawSqlResults, relationAlias);
                var isResultArray = relation.isManyToMany || relation.isOneToMany;
                var result = !isResultArray ? relatedEntities[0] : relatedEntities;
                if (result) {
                    var propertyName = relation.propertyName;
                    if (joinMapping) {
                        propertyName = joinMapping.propertyName;
                    }
                    if (relation.isLazy) {
                        entity["__" + propertyName + "__"] = result;
                    }
                    else {
                        entity[propertyName] = result;
                    }
                    if (!isResultArray || result.length > 0)
                        hasData = true;
                }
            }
            // if relation has id field then relation id/ids to that field.
            if (relation.isManyToMany) {
                if (relationAlias) {
                    var ids_1 = [];
                    var joinMapping = _this.joinMappings.find(function (joinMapping) { return joinMapping.type === "relationId" && joinMapping.alias === relationAlias; });
                    if (relation.idField || joinMapping) {
                        var propertyName = joinMapping ? joinMapping.propertyName : relation.idField;
                        var junctionMetadata = relation.junctionEntityMetadata;
                        var columnName_1 = relation.isOwning ? junctionMetadata.columns[1].name : junctionMetadata.columns[0].name;
                        rawSqlResults.forEach(function (results) {
                            if (relationAlias) {
                                var resultsKey = relationAlias.name + "_" + columnName_1;
                                var value = _this.driver.prepareHydratedValue(results[resultsKey], relation.referencedColumn);
                                if (value !== undefined && value !== null)
                                    ids_1.push(value);
                            }
                        });
                        if (ids_1 && ids_1.length)
                            entity[propertyName] = ids_1;
                    }
                }
            }
            else if (relation.idField) {
                var relationName = relation.name;
                entity[relation.idField] = _this.driver.prepareHydratedValue(rawSqlResults[0][alias.name + "_" + relationName], relation.referencedColumn);
            }
            // if relation counter
            _this.relationCountMetas.forEach(function (joinMeta) {
                if (joinMeta.alias === relationAlias) {
                    // console.log("relation count was found for relation: ", relation);
                    // joinMeta.entity = entity;
                    joinMeta.entities.push({ entity: entity, metadata: metadata });
                    // console.log(joinMeta);
                    // console.log("---------------------");
                }
            });
        });
        return hasData ? entity : null;
    };
    return RawSqlResultsToEntityTransformer;
}());
exports.RawSqlResultsToEntityTransformer = RawSqlResultsToEntityTransformer;

//# sourceMappingURL=RawSqlResultsToEntityTransformer.js.map
