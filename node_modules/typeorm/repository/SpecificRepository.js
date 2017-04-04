"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var QueryRunnerProvider_1 = require("../query-runner/QueryRunnerProvider");
var Subject_1 = require("../persistence/Subject");
var RelationMetadata_1 = require("../metadata/RelationMetadata");
var QueryBuilder_1 = require("../query-builder/QueryBuilder");
/**
 * Repository for more specific operations.
 */
var SpecificRepository = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function SpecificRepository(connection, metadata, queryRunnerProvider) {
        this.connection = connection;
        this.metadata = metadata;
        this.queryRunnerProvider = queryRunnerProvider;
    }
    /**
     * Sets given relatedEntityId to the value of the relation of the entity with entityId id.
     * Should be used when you want quickly and efficiently set a relation (for many-to-one and one-to-many) to some entity.
     * Note that event listeners and event subscribers won't work (and will not send any events) when using this operation.
     */
    SpecificRepository.prototype.setRelation = function (relationName, entityId, relatedEntityId) {
        return __awaiter(this, void 0, void 0, function () {
            var propertyName, relation, table, values, conditions, queryRunnerProvider, queryRunner;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        propertyName = this.metadata.computePropertyName(relationName);
                        if (!this.metadata.hasRelationWithPropertyName(propertyName))
                            throw new Error("Relation " + propertyName + " was not found in the " + this.metadata.name + " entity.");
                        relation = this.metadata.findRelationWithPropertyName(propertyName);
                        // if (relation.isManyToMany || relation.isOneToMany || relation.isOneToOneNotOwner)
                        //     throw new Error(`Only many-to-one and one-to-one with join column are supported for this operation. ${this.metadata.name}#${propertyName} relation type is ${relation.relationType}`);
                        if (relation.isManyToMany)
                            throw new Error("Many-to-many relation is not supported for this operation. Use #addToRelation method for many-to-many relations.");
                        values = {}, conditions = {};
                        if (relation.isOwning) {
                            table = relation.entityMetadata.table.name;
                            values[relation.name] = relatedEntityId;
                            conditions[relation.joinColumn.referencedColumn.name] = entityId;
                        }
                        else {
                            table = relation.inverseEntityMetadata.table.name;
                            values[relation.inverseRelation.name] = relatedEntityId;
                            conditions[relation.inverseRelation.joinColumn.referencedColumn.name] = entityId;
                        }
                        queryRunnerProvider = this.queryRunnerProvider ? this.queryRunnerProvider : new QueryRunnerProvider_1.QueryRunnerProvider(this.connection.driver);
                        return [4 /*yield*/, queryRunnerProvider.provide()];
                    case 1:
                        queryRunner = _a.sent();
                        return [4 /*yield*/, queryRunner.update(table, values, conditions)];
                    case 2:
                        _a.sent();
                        if (!!this.queryRunnerProvider) return [3 /*break*/, 4];
                        return [4 /*yield*/, queryRunnerProvider.release(queryRunner)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Sets given relatedEntityId to the value of the relation of the entity with entityId id.
     * Should be used when you want quickly and efficiently set a relation (for many-to-one and one-to-many) to some entity.
     * Note that event listeners and event subscribers won't work (and will not send any events) when using this operation.
     */
    SpecificRepository.prototype.setInverseRelation = function (relationName, relatedEntityId, entityId) {
        return __awaiter(this, void 0, void 0, function () {
            var propertyName, relation, table, values, conditions, queryRunnerProvider, queryRunner;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        propertyName = this.metadata.computePropertyName(relationName);
                        if (!this.metadata.hasRelationWithPropertyName(propertyName))
                            throw new Error("Relation " + propertyName + " was not found in the " + this.metadata.name + " entity.");
                        relation = this.metadata.findRelationWithPropertyName(propertyName);
                        // if (relation.isManyToMany || relation.isOneToMany || relation.isOneToOneNotOwner)
                        //     throw new Error(`Only many-to-one and one-to-one with join column are supported for this operation. ${this.metadata.name}#${propertyName} relation type is ${relation.relationType}`);
                        if (relation.isManyToMany)
                            throw new Error("Many-to-many relation is not supported for this operation. Use #addToRelation method for many-to-many relations.");
                        values = {}, conditions = {};
                        if (relation.isOwning) {
                            table = relation.inverseEntityMetadata.table.name;
                            values[relation.inverseRelation.name] = relatedEntityId;
                            conditions[relation.inverseRelation.joinColumn.referencedColumn.name] = entityId;
                        }
                        else {
                            table = relation.entityMetadata.table.name;
                            values[relation.name] = relatedEntityId;
                            conditions[relation.joinColumn.referencedColumn.name] = entityId;
                        }
                        queryRunnerProvider = this.queryRunnerProvider ? this.queryRunnerProvider : new QueryRunnerProvider_1.QueryRunnerProvider(this.connection.driver);
                        return [4 /*yield*/, queryRunnerProvider.provide()];
                    case 1:
                        queryRunner = _a.sent();
                        return [4 /*yield*/, queryRunner.update(table, values, conditions)];
                    case 2:
                        _a.sent();
                        if (!!this.queryRunnerProvider) return [3 /*break*/, 4];
                        return [4 /*yield*/, queryRunnerProvider.release(queryRunner)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Adds a new relation between two entities into relation's many-to-many table.
     * Should be used when you want quickly and efficiently add a relation between two entities.
     * Note that event listeners and event subscribers won't work (and will not send any events) when using this operation.
     */
    SpecificRepository.prototype.addToRelation = function (relationName, entityId, relatedEntityIds) {
        return __awaiter(this, void 0, void 0, function () {
            var propertyName, relation, queryRunnerProvider, queryRunner, insertPromises;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        propertyName = this.metadata.computePropertyName(relationName);
                        if (!this.metadata.hasRelationWithPropertyName(propertyName))
                            throw new Error("Relation " + propertyName + " was not found in the " + this.metadata.name + " entity.");
                        relation = this.metadata.findRelationWithPropertyName(propertyName);
                        if (!relation.isManyToMany)
                            throw new Error("Only many-to-many relation supported for this operation. However " + this.metadata.name + "#" + propertyName + " relation type is " + relation.relationType);
                        queryRunnerProvider = this.queryRunnerProvider ? this.queryRunnerProvider : new QueryRunnerProvider_1.QueryRunnerProvider(this.connection.driver);
                        return [4 /*yield*/, queryRunnerProvider.provide()];
                    case 1:
                        queryRunner = _a.sent();
                        insertPromises = relatedEntityIds.map(function (relatedEntityId) {
                            var values = {};
                            if (relation.isOwning) {
                                values[relation.junctionEntityMetadata.columns[0].name] = entityId;
                                values[relation.junctionEntityMetadata.columns[1].name] = relatedEntityId;
                            }
                            else {
                                values[relation.junctionEntityMetadata.columns[1].name] = entityId;
                                values[relation.junctionEntityMetadata.columns[0].name] = relatedEntityId;
                            }
                            return queryRunner.insert(relation.junctionEntityMetadata.table.name, values);
                        });
                        return [4 /*yield*/, Promise.all(insertPromises)];
                    case 2:
                        _a.sent();
                        if (!!this.queryRunnerProvider) return [3 /*break*/, 4];
                        return [4 /*yield*/, queryRunnerProvider.release(queryRunner)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Adds a new relation between two entities into relation's many-to-many table from inverse side of the given relation.
     * Should be used when you want quickly and efficiently add a relation between two entities.
     * Note that event listeners and event subscribers won't work (and will not send any events) when using this operation.
     */
    SpecificRepository.prototype.addToInverseRelation = function (relationName, relatedEntityId, entityIds) {
        return __awaiter(this, void 0, void 0, function () {
            var propertyName, relation, queryRunnerProvider, queryRunner, insertPromises;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        propertyName = this.metadata.computePropertyName(relationName);
                        if (!this.metadata.hasRelationWithPropertyName(propertyName))
                            throw new Error("Relation " + propertyName + " was not found in the " + this.metadata.name + " entity.");
                        relation = this.metadata.findRelationWithPropertyName(propertyName);
                        if (!relation.isManyToMany)
                            throw new Error("Only many-to-many relation supported for this operation. However " + this.metadata.name + "#" + propertyName + " relation type is " + relation.relationType);
                        queryRunnerProvider = this.queryRunnerProvider ? this.queryRunnerProvider : new QueryRunnerProvider_1.QueryRunnerProvider(this.connection.driver);
                        return [4 /*yield*/, queryRunnerProvider.provide()];
                    case 1:
                        queryRunner = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, , 4, 7]);
                        insertPromises = entityIds.map(function (entityId) {
                            var values = {};
                            if (relation.isOwning) {
                                values[relation.junctionEntityMetadata.columns[0].name] = entityId;
                                values[relation.junctionEntityMetadata.columns[1].name] = relatedEntityId;
                            }
                            else {
                                values[relation.junctionEntityMetadata.columns[1].name] = entityId;
                                values[relation.junctionEntityMetadata.columns[0].name] = relatedEntityId;
                            }
                            return queryRunner.insert(relation.junctionEntityMetadata.table.name, values);
                        });
                        return [4 /*yield*/, Promise.all(insertPromises)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 4:
                        if (!!this.queryRunnerProvider) return [3 /*break*/, 6];
                        return [4 /*yield*/, queryRunnerProvider.release(queryRunner)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Removes a relation between two entities from relation's many-to-many table.
     * Should be used when you want quickly and efficiently remove a many-to-many relation between two entities.
     * Note that event listeners and event subscribers won't work (and will not send any events) when using this operation.
     */
    SpecificRepository.prototype.removeFromRelation = function (relationName, entityId, relatedEntityIds) {
        return __awaiter(this, void 0, void 0, function () {
            var propertyName, relation, qb, firstColumnName, secondColumnName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        propertyName = this.metadata.computePropertyName(relationName);
                        if (!this.metadata.hasRelationWithPropertyName(propertyName))
                            throw new Error("Relation " + propertyName + " was not found in the " + this.metadata.name + " entity.");
                        relation = this.metadata.findRelationWithPropertyName(propertyName);
                        if (!relation.isManyToMany)
                            throw new Error("Only many-to-many relation supported for this operation. However " + this.metadata.name + "#" + propertyName + " relation type is " + relation.relationType);
                        // check if given relation entity ids is empty - then nothing to do here (otherwise next code will remove all ids)
                        if (!relatedEntityIds || !relatedEntityIds.length)
                            return [2 /*return*/, Promise.resolve()];
                        qb = new QueryBuilder_1.QueryBuilder(this.connection, this.queryRunnerProvider)
                            .delete()
                            .fromTable(relation.junctionEntityMetadata.table.name, "junctionEntity");
                        firstColumnName = this.connection.driver.escapeColumnName(relation.isOwning ? relation.junctionEntityMetadata.columns[0].name : relation.junctionEntityMetadata.columns[1].name);
                        secondColumnName = this.connection.driver.escapeColumnName(relation.isOwning ? relation.junctionEntityMetadata.columns[1].name : relation.junctionEntityMetadata.columns[0].name);
                        relatedEntityIds.forEach(function (relatedEntityId, index) {
                            qb.orWhere("(" + firstColumnName + "=:entityId AND " + secondColumnName + "=:relatedEntity_" + index + ")")
                                .setParameter("relatedEntity_" + index, relatedEntityId);
                        });
                        return [4 /*yield*/, qb
                                .setParameter("entityId", entityId)
                                .execute()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Removes a relation between two entities from relation's many-to-many table.
     * Should be used when you want quickly and efficiently remove a many-to-many relation between two entities.
     * Note that event listeners and event subscribers won't work (and will not send any events) when using this operation.
     */
    SpecificRepository.prototype.removeFromInverseRelation = function (relationName, relatedEntityId, entityIds) {
        return __awaiter(this, void 0, void 0, function () {
            var propertyName, relation, qb, firstColumnName, secondColumnName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        propertyName = this.metadata.computePropertyName(relationName);
                        if (!this.metadata.hasRelationWithPropertyName(propertyName))
                            throw new Error("Relation " + propertyName + " was not found in the " + this.metadata.name + " entity.");
                        relation = this.metadata.findRelationWithPropertyName(propertyName);
                        if (!relation.isManyToMany)
                            throw new Error("Only many-to-many relation supported for this operation. However " + this.metadata.name + "#" + propertyName + " relation type is " + relation.relationType);
                        // check if given entity ids is empty - then nothing to do here (otherwise next code will remove all ids)
                        if (!entityIds || !entityIds.length)
                            return [2 /*return*/, Promise.resolve()];
                        qb = new QueryBuilder_1.QueryBuilder(this.connection, this.queryRunnerProvider)
                            .delete()
                            .from(relation.junctionEntityMetadata.table.name, "junctionEntity");
                        firstColumnName = relation.isOwning ? relation.junctionEntityMetadata.columns[1].name : relation.junctionEntityMetadata.columns[0].name;
                        secondColumnName = relation.isOwning ? relation.junctionEntityMetadata.columns[0].name : relation.junctionEntityMetadata.columns[1].name;
                        entityIds.forEach(function (entityId, index) {
                            qb.orWhere("(" + firstColumnName + "=:relatedEntityId AND " + secondColumnName + "=:entity_" + index + ")")
                                .setParameter("entity_" + index, entityId);
                        });
                        return [4 /*yield*/, qb.setParameter("relatedEntityId", relatedEntityId).execute()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Performs both #addToRelation and #removeFromRelation operations.
     * Should be used when you want quickly and efficiently and and remove a many-to-many relation between two entities.
     * Note that event listeners and event subscribers won't work (and will not send any events) when using this operation.
     */
    SpecificRepository.prototype.addAndRemoveFromRelation = function (relation, entityId, addRelatedEntityIds, removeRelatedEntityIds) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            this.addToRelation(relation, entityId, addRelatedEntityIds),
                            this.removeFromRelation(relation, entityId, removeRelatedEntityIds)
                        ])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Performs both #addToRelation and #removeFromRelation operations.
     * Should be used when you want quickly and efficiently and and remove a many-to-many relation between two entities.
     * Note that event listeners and event subscribers won't work (and will not send any events) when using this operation.
     */
    SpecificRepository.prototype.addAndRemoveFromInverseRelation = function (relation, relatedEntityId, addEntityIds, removeEntityIds) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            this.addToInverseRelation(relation, relatedEntityId, addEntityIds),
                            this.removeFromInverseRelation(relation, relatedEntityId, removeEntityIds)
                        ])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Removes entity with the given id.
     * Note that event listeners and event subscribers won't work (and will not send any events) when using this operation.
     */
    SpecificRepository.prototype.removeById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var alias, parameters, condition;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        alias = this.metadata.table.name;
                        parameters = {};
                        condition = "";
                        if (this.metadata.hasMultiplePrimaryKeys) {
                            condition = this.metadata.primaryColumns.map(function (primaryColumn) {
                                parameters[primaryColumn.propertyName] = id[primaryColumn.propertyName];
                                return alias + "." + primaryColumn.propertyName + "=:" + primaryColumn.propertyName;
                            }).join(" AND ");
                        }
                        else {
                            condition = alias + "." + this.metadata.firstPrimaryColumn.propertyName + "=:id";
                            parameters["id"] = id;
                        }
                        return [4 /*yield*/, new QueryBuilder_1.QueryBuilder(this.connection, this.queryRunnerProvider)
                                .delete()
                                .from(this.metadata.target, alias)
                                .where(condition, parameters)
                                .execute()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Removes all entities with the given ids.
     * Note that event listeners and event subscribers won't work (and will not send any events) when using this operation.
     */
    SpecificRepository.prototype.removeByIds = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var alias, parameters, condition;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        alias = this.metadata.table.name;
                        parameters = {};
                        condition = "";
                        if (this.metadata.hasMultiplePrimaryKeys) {
                            condition = ids.map(function (id, idIndex) {
                                _this.metadata.primaryColumns.map(function (primaryColumn) {
                                    parameters[primaryColumn.propertyName + "_" + idIndex] = id[primaryColumn.propertyName];
                                    return alias + "." + primaryColumn.propertyName + "=:" + primaryColumn.propertyName + "_" + idIndex;
                                }).join(" AND ");
                            }).join(" OR ");
                        }
                        else {
                            condition = alias + "." + this.metadata.firstPrimaryColumn.propertyName + " IN (:ids)";
                            parameters["ids"] = ids;
                        }
                        return [4 /*yield*/, new QueryBuilder_1.QueryBuilder(this.connection, this.queryRunnerProvider)
                                .delete()
                                .from(this.metadata.target, alias)
                                .where(condition, parameters)
                                .execute()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Finds all relation ids in the given entities.
     */
    SpecificRepository.prototype.findRelationIds = function (relationOrName, entityOrEntities, inIds, notInIds) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var relation, entityReferencedColumn, ownerEntityColumn, inverseEntityColumn, entityIds, escapeAlias, escapeColumn, ids, promises;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        relation = this.convertMixedRelationToMetadata(relationOrName);
                        if (!(entityOrEntities instanceof Array))
                            entityOrEntities = [entityOrEntities];
                        entityReferencedColumn = relation.isOwning ? relation.joinTable.referencedColumn : relation.inverseRelation.joinTable.inverseReferencedColumn;
                        ownerEntityColumn = relation.isOwning ? relation.junctionEntityMetadata.columns[0] : relation.junctionEntityMetadata.columns[1];
                        inverseEntityColumn = relation.isOwning ? relation.junctionEntityMetadata.columns[1] : relation.junctionEntityMetadata.columns[0];
                        entityIds = this.convertEntityOrEntitiesToIdOrIds(entityReferencedColumn, entityOrEntities);
                        if (!(entityIds instanceof Array))
                            entityIds = [entityIds];
                        // filter out empty entity ids
                        entityIds = entityIds.filter(function (entityId) { return entityId !== null && entityId !== undefined; });
                        // if no entity ids at the end, then we don't need to load anything
                        if (entityIds.length === 0)
                            return [2 /*return*/, []];
                        escapeAlias = function (alias) { return _this.connection.driver.escapeAliasName(alias); };
                        escapeColumn = function (column) { return _this.connection.driver.escapeColumnName(column); };
                        ids = [];
                        promises = entityIds.map(function (entityId) {
                            var qb = new QueryBuilder_1.QueryBuilder(_this.connection, _this.queryRunnerProvider)
                                .select(escapeAlias("junction") + "." + escapeColumn(inverseEntityColumn.name) + " AS id")
                                .fromTable(relation.junctionEntityMetadata.table.name, "junction")
                                .andWhere(escapeAlias("junction") + "." + escapeColumn(ownerEntityColumn.name) + "=:entityId", { entityId: entityId });
                            if (inIds && inIds.length > 0)
                                qb.andWhere(escapeAlias("junction") + "." + escapeColumn(inverseEntityColumn.name) + " IN (:inIds)", { inIds: inIds });
                            if (notInIds && notInIds.length > 0)
                                qb.andWhere(escapeAlias("junction") + "." + escapeColumn(inverseEntityColumn.name) + " NOT IN (:notInIds)", { notInIds: notInIds });
                            return qb.getRawMany()
                                .then(function (results) {
                                results.forEach(function (result) { return ids.push(result.id); }); // todo: prepare result?
                            });
                        });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, ids];
                }
            });
        });
    };
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Converts entity or entities to id or ids map.
     */
    SpecificRepository.prototype.convertEntityOrEntitiesToIdOrIds = function (column, entityOrEntities) {
        var _this = this;
        if (entityOrEntities instanceof Array) {
            return entityOrEntities.map(function (entity) { return _this.convertEntityOrEntitiesToIdOrIds(column, entity); });
        }
        else {
            if (entityOrEntities instanceof Object) {
                return entityOrEntities[column.propertyName];
            }
            else {
                return entityOrEntities;
            }
        }
    };
    /**
     * Converts relation name, relation name in function into RelationMetadata.
     */
    SpecificRepository.prototype.convertMixedRelationToMetadata = function (relationOrName) {
        if (relationOrName instanceof RelationMetadata_1.RelationMetadata)
            return relationOrName;
        var relationName = relationOrName instanceof Function ? relationOrName(this.metadata.createPropertiesMap()) : relationOrName;
        return this.metadata.findRelationWithPropertyName(relationName);
    };
    /**
     * Extracts unique objects from given entity and all its downside relations.
     */
    SpecificRepository.prototype.extractObjectsById = function (entity, metadata, entityWithIds) {
        var _this = this;
        if (entityWithIds === void 0) { entityWithIds = []; }
        var promises = metadata.relations.map(function (relation) {
            var relMetadata = relation.inverseEntityMetadata;
            var value = relation.isLazy ? entity["__" + relation.propertyName + "__"] : entity[relation.propertyName];
            if (!value)
                return undefined;
            if (value instanceof Array) {
                var subPromises = value.map(function (subEntity) {
                    return _this.extractObjectsById(subEntity, relMetadata, entityWithIds);
                });
                return Promise.all(subPromises);
            }
            else {
                return _this.extractObjectsById(value, relMetadata, entityWithIds);
            }
        });
        return Promise.all(promises.filter(function (result) { return !!result; })).then(function () {
            if (!entityWithIds.find(function (entityWithId) { return entityWithId.entity === entity; })) {
                var entityWithId = new Subject_1.Subject(metadata, entity);
                entityWithIds.push(entityWithId);
            }
            return entityWithIds;
        });
    };
    return SpecificRepository;
}());
exports.SpecificRepository = SpecificRepository;

//# sourceMappingURL=SpecificRepository.js.map
