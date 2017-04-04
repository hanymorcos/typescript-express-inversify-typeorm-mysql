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
var OrmUtils_1 = require("../util/OrmUtils");
var PromiseUtils_1 = require("../util/PromiseUtils");
/**
 * Executes all database operations (inserts, updated, deletes) that must be executed
 * with given persistence subjects.
 */
var SubjectOperationExecutor = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function SubjectOperationExecutor(connection, transactionEntityManager, queryRunnerProvider) {
        this.connection = connection;
        this.transactionEntityManager = transactionEntityManager;
        this.queryRunnerProvider = queryRunnerProvider;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Executes all operations over given array of subjects.
     * Executes queries using given query runner.
     */
    SubjectOperationExecutor.prototype.execute = function (subjects) {
        return __awaiter(this, void 0, void 0, function () {
            var isTransactionStartedByItself, _a, error_1, secondaryError_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        /*subjects.forEach(subject => {
                            console.log(subject.entity);
                            console.log("mustBeInserted: ", subject.mustBeInserted);
                            console.log("mustBeUpdated: ", subject.mustBeUpdated);
                            console.log("mustBeRemoved: ", subject.mustBeRemoved);
                        });*/
                        // validate all subjects first
                        subjects.forEach(function (subject) { return subject.validate(); });
                        // set class properties for easy use
                        this.allSubjects = subjects;
                        this.insertSubjects = subjects.filter(function (subject) { return subject.mustBeInserted; });
                        this.updateSubjects = subjects.filter(function (subject) { return subject.mustBeUpdated; });
                        this.removeSubjects = subjects.filter(function (subject) { return subject.mustBeRemoved; });
                        this.relationUpdateSubjects = subjects.filter(function (subject) { return subject.hasRelationUpdates; });
                        // if there are no operations to execute then don't need to do something including opening a transaction
                        if (!this.insertSubjects.length &&
                            !this.updateSubjects.length &&
                            !this.removeSubjects.length &&
                            !this.relationUpdateSubjects.length &&
                            subjects.every(function (subject) { return !subject.junctionInserts.length; }) &&
                            subjects.every(function (subject) { return !subject.junctionRemoves.length; }))
                            return [2 /*return*/];
                        isTransactionStartedByItself = false;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 17, , 22]);
                        _a = this;
                        return [4 /*yield*/, this.queryRunnerProvider.provide()];
                    case 2:
                        _a.queryRunner = _b.sent();
                        if (!!this.queryRunner.isTransactionActive()) return [3 /*break*/, 4];
                        isTransactionStartedByItself = true;
                        return [4 /*yield*/, this.queryRunner.beginTransaction()];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4: 
                    // broadcast "before" events before we start updating
                    return [4 /*yield*/, this.connection.broadcaster.broadcastBeforeEventsForAll(this.transactionEntityManager, this.insertSubjects, this.updateSubjects, this.removeSubjects)];
                    case 5:
                        // broadcast "before" events before we start updating
                        _b.sent();
                        // since events can trigger some internal changes (for example update depend property) we need to perform some re-computations here
                        this.updateSubjects.forEach(function (subject) { return subject.recompute(); });
                        return [4 /*yield*/, this.executeInsertOperations()];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, this.executeInsertClosureTableOperations()];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, this.executeInsertJunctionsOperations()];
                    case 8:
                        _b.sent();
                        return [4 /*yield*/, this.executeRemoveJunctionsOperations()];
                    case 9:
                        _b.sent();
                        return [4 /*yield*/, this.executeUpdateOperations()];
                    case 10:
                        _b.sent();
                        return [4 /*yield*/, this.executeUpdateRelations()];
                    case 11:
                        _b.sent();
                        return [4 /*yield*/, this.executeRemoveOperations()];
                    case 12:
                        _b.sent();
                        if (!(isTransactionStartedByItself === true)) return [3 /*break*/, 14];
                        return [4 /*yield*/, this.queryRunner.commitTransaction()];
                    case 13:
                        _b.sent();
                        _b.label = 14;
                    case 14: 
                    // update all special columns in persisted entities, like inserted id or remove ids from the removed entities
                    return [4 /*yield*/, this.updateSpecialColumnsInPersistedEntities()];
                    case 15:
                        // update all special columns in persisted entities, like inserted id or remove ids from the removed entities
                        _b.sent();
                        // finally broadcast "after" events
                        // note that we are broadcasting events after commit because we want to have ids of the entities inside them to be available in subscribers
                        return [4 /*yield*/, this.connection.broadcaster.broadcastAfterEventsForAll(this.transactionEntityManager, this.insertSubjects, this.updateSubjects, this.removeSubjects)];
                    case 16:
                        // finally broadcast "after" events
                        // note that we are broadcasting events after commit because we want to have ids of the entities inside them to be available in subscribers
                        _b.sent();
                        return [3 /*break*/, 22];
                    case 17:
                        error_1 = _b.sent();
                        if (!isTransactionStartedByItself) return [3 /*break*/, 21];
                        _b.label = 18;
                    case 18:
                        _b.trys.push([18, 20, , 21]);
                        return [4 /*yield*/, this.queryRunner.rollbackTransaction()];
                    case 19:
                        _b.sent();
                        return [3 /*break*/, 21];
                    case 20:
                        secondaryError_1 = _b.sent();
                        return [3 /*break*/, 21];
                    case 21: throw error_1;
                    case 22: return [2 /*return*/];
                }
            });
        });
    };
    // -------------------------------------------------------------------------
    // Private Methods: Insertion
    // -------------------------------------------------------------------------
    /**
     * Executes insert operations.
     *
     * For insertion we separate two groups of entities:
     * - first group of entities are entities which do not have any relations
     *      or entities which do not have any non-nullable relation
     * - second group of entities are entities which does have non-nullable relations
     *
     * Insert process of the entities from the first group which can only have nullable relations are actually a two-step process:
     * - first we insert entities without their relations, explicitly left them NULL
     * - later we update inserted entity once again with id of the object inserted with it
     *
     * Yes, two queries are being executed, but this is by design.
     * There is no better way to solve this problem and others at the same time.
     *
     * Insert process of the entities from the second group which can have only non nullable relations is a single-step process:
     * - we simply insert all entities and get into attention all its dependencies which were inserted in the first group
     */
    SubjectOperationExecutor.prototype.executeInsertOperations = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var firstInsertSubjects, secondInsertSubjects, updatePromises;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        firstInsertSubjects = this.insertSubjects.filter(function (subject) { return !subject.metadata.hasNonNullableColumns; });
                        secondInsertSubjects = this.insertSubjects.filter(function (subject) { return subject.metadata.hasNonNullableColumns; });
                        // note: these operations should be executed in sequence, not in parallel
                        // because second group depend of obtained data from the first group
                        return [4 /*yield*/, Promise.all(firstInsertSubjects.map(function (subject) { return _this.insert(subject, []); }))];
                    case 1:
                        // note: these operations should be executed in sequence, not in parallel
                        // because second group depend of obtained data from the first group
                        _a.sent();
                        return [4 /*yield*/, Promise.all(secondInsertSubjects.map(function (subject) { return _this.insert(subject, firstInsertSubjects); }))];
                    case 2:
                        _a.sent();
                        updatePromises = [];
                        firstInsertSubjects.forEach(function (subject) {
                            // first update relations with join columns (one-to-one owner and many-to-one relations)
                            var updateOptions = {};
                            subject.metadata.relationsWithJoinColumns.forEach(function (relation) {
                                var referencedColumn = relation.joinColumn.referencedColumn;
                                var relatedEntity = relation.getEntityValue(subject.entity);
                                // if relation value is not set then nothing to do here
                                if (!relatedEntity)
                                    return;
                                // check if relation reference column is a relation
                                var relationId;
                                var columnRelation = relation.inverseEntityMetadata.relations.find(function (rel) { return rel.propertyName === relation.joinColumn.referencedColumn.propertyName; });
                                if (columnRelation) {
                                    var insertSubject = _this.insertSubjects.find(function (insertedSubject) { return insertedSubject.entity === relatedEntity[referencedColumn.propertyName]; });
                                    // if this relation was just inserted
                                    if (insertSubject) {
                                        // check if we have this relation id already
                                        relationId = relatedEntity[referencedColumn.propertyName][columnRelation.propertyName];
                                        if (!relationId) {
                                            // if we don't have relation id then use special values
                                            if (referencedColumn.isGenerated) {
                                                relationId = insertSubject.newlyGeneratedId;
                                            }
                                            // todo: handle other special types too
                                        }
                                    }
                                }
                                else {
                                    var insertSubject = _this.insertSubjects.find(function (insertedSubject) { return insertedSubject.entity === relatedEntity; });
                                    // if this relation was just inserted
                                    if (insertSubject) {
                                        // check if we have this relation id already
                                        relationId = relatedEntity[referencedColumn.propertyName];
                                        if (!relationId) {
                                            // if we don't have relation id then use special values
                                            if (referencedColumn.isGenerated) {
                                                relationId = insertSubject.newlyGeneratedId;
                                            }
                                            // todo: handle other special types too
                                        }
                                    }
                                }
                                if (relationId) {
                                    updateOptions[relation.name] = relationId;
                                }
                            });
                            // if we found relations which we can update - then update them
                            if (Object.keys(updateOptions).length > 0 /*&& subject.hasEntity*/) {
                                // const relatedEntityIdMap = subject.getPersistedEntityIdMap; // todo: this works incorrectly
                                var columns = subject.metadata.parentEntityMetadata ? subject.metadata.primaryColumnsWithParentIdColumns : subject.metadata.primaryColumns;
                                var conditions_1 = {};
                                columns.forEach(function (column) {
                                    var entityValue = subject.entity[column.propertyName];
                                    // if entity id is a relation, then extract referenced column from that relation
                                    var columnRelation = subject.metadata.relations.find(function (relation) { return relation.propertyName === column.propertyName; });
                                    if (entityValue && columnRelation && columnRelation.joinColumn) {
                                        var relationIdOfEntityValue = entityValue[columnRelation.joinColumn.referencedColumn.propertyName];
                                        if (!relationIdOfEntityValue) {
                                            var entityValueInsertSubject = _this.insertSubjects.find(function (subject) { return subject.entity === entityValue; });
                                            if (entityValueInsertSubject && columnRelation.joinColumn.referencedColumn.isGenerated) {
                                                relationIdOfEntityValue = entityValueInsertSubject.newlyGeneratedId;
                                            }
                                        }
                                        if (relationIdOfEntityValue) {
                                            conditions_1[column.name] = relationIdOfEntityValue;
                                        }
                                    }
                                    else {
                                        if (entityValue) {
                                            conditions_1[column.name] = entityValue;
                                        }
                                        else {
                                            if (subject.newlyGeneratedId) {
                                                conditions_1[column.name] = subject.newlyGeneratedId;
                                            }
                                        }
                                    }
                                });
                                if (!Object.keys(conditions_1).length)
                                    return;
                                var updatePromise = _this.queryRunner.update(subject.metadata.table.name, updateOptions, conditions_1);
                                updatePromises.push(updatePromise);
                            }
                            // we need to update relation ids if newly inserted objects are used from inverse side in one-to-many inverse relation
                            // we also need to update relation ids if newly inserted objects are used from inverse side in one-to-one inverse relation
                            var oneToManyAndOneToOneNonOwnerRelations = subject.metadata.oneToManyRelations.concat(subject.metadata.oneToOneRelations.filter(function (relation) { return !relation.isOwning; }));
                            subject.metadata.extractRelationValuesFromEntity(subject.entity, oneToManyAndOneToOneNonOwnerRelations)
                                .forEach(function (_a) {
                                var relation = _a[0], subRelatedEntity = _a[1], inverseEntityMetadata = _a[2];
                                var referencedColumn = relation.inverseRelation.joinColumn.referencedColumn;
                                var columns = inverseEntityMetadata.parentEntityMetadata ? inverseEntityMetadata.primaryColumnsWithParentIdColumns : inverseEntityMetadata.primaryColumns;
                                var conditions = {};
                                columns.forEach(function (column) {
                                    var entityValue = subRelatedEntity[column.propertyName];
                                    // if entity id is a relation, then extract referenced column from that relation
                                    var columnRelation = inverseEntityMetadata.relations.find(function (relation) { return relation.propertyName === column.propertyName; });
                                    if (entityValue && columnRelation && columnRelation.joinColumn) {
                                        var relationIdOfEntityValue = entityValue[columnRelation.joinColumn.referencedColumn.propertyName];
                                        if (!relationIdOfEntityValue) {
                                            var entityValueInsertSubject = _this.insertSubjects.find(function (subject) { return subject.entity === entityValue; });
                                            if (entityValueInsertSubject && columnRelation.joinColumn.referencedColumn.isGenerated) {
                                                relationIdOfEntityValue = entityValueInsertSubject.newlyGeneratedId;
                                            }
                                        }
                                        if (relationIdOfEntityValue) {
                                            conditions[column.name] = relationIdOfEntityValue;
                                        }
                                    }
                                    else {
                                        var entityValueInsertSubject = _this.insertSubjects.find(function (subject) { return subject.entity === subRelatedEntity; });
                                        if (entityValue) {
                                            conditions[column.name] = entityValue;
                                        }
                                        else {
                                            if (entityValueInsertSubject && entityValueInsertSubject.newlyGeneratedId) {
                                                conditions[column.name] = entityValueInsertSubject.newlyGeneratedId;
                                            }
                                        }
                                    }
                                });
                                if (!Object.keys(conditions).length)
                                    return;
                                var updateOptions = {};
                                var columnRelation = relation.inverseEntityMetadata.relations.find(function (rel) { return rel.propertyName === referencedColumn.propertyName; });
                                if (columnRelation) {
                                    var id = subject.entity[referencedColumn.propertyName][columnRelation.propertyName];
                                    if (!id) {
                                        var insertSubject = _this.insertSubjects.find(function (subject) { return subject.entity === subject.entity[referencedColumn.propertyName]; });
                                        if (insertSubject) {
                                            id = insertSubject.newlyGeneratedId;
                                        }
                                    }
                                    updateOptions[relation.inverseRelation.joinColumn.name] = id;
                                }
                                else {
                                    updateOptions[relation.inverseRelation.joinColumn.name] = subject.entity[referencedColumn.propertyName] || subject.newlyGeneratedId;
                                }
                                var updatePromise = _this.queryRunner.update(relation.inverseEntityMetadata.table.name, updateOptions, conditions);
                                updatePromises.push(updatePromise);
                            });
                        });
                        return [4 /*yield*/, Promise.all(updatePromises)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Inserts an entity from the given insert operation into the database.
     * If entity has an generated column, then after saving new generated value will be stored to the InsertOperation.
     * If entity uses class-table-inheritance, then multiple inserts may by performed to save all entities.
     */
    SubjectOperationExecutor.prototype.insert = function (subject, alreadyInsertedSubjects) {
        return __awaiter(this, void 0, void 0, function () {
            var parentEntityMetadata, metadata, entity, newlyGeneratedId, parentGeneratedId, parentValuesMap, childValuesMap, secondGeneratedId, valuesMap;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parentEntityMetadata = subject.metadata.parentEntityMetadata;
                        metadata = subject.metadata;
                        entity = subject.entity;
                        if (!metadata.table.isClassTableChild) return [3 /*break*/, 3];
                        parentValuesMap = this.collectColumnsAndValues(parentEntityMetadata, entity, subject.date, undefined, metadata.discriminatorValue, alreadyInsertedSubjects);
                        return [4 /*yield*/, this.queryRunner.insert(parentEntityMetadata.table.name, parentValuesMap, parentEntityMetadata.generatedColumnIfExist)];
                    case 1:
                        newlyGeneratedId = parentGeneratedId = _a.sent();
                        childValuesMap = this.collectColumnsAndValues(metadata, entity, subject.date, newlyGeneratedId, undefined, alreadyInsertedSubjects);
                        return [4 /*yield*/, this.queryRunner.insert(metadata.table.name, childValuesMap, metadata.generatedColumnIfExist)];
                    case 2:
                        secondGeneratedId = _a.sent();
                        if (!newlyGeneratedId && secondGeneratedId)
                            newlyGeneratedId = secondGeneratedId;
                        return [3 /*break*/, 5];
                    case 3:
                        valuesMap = this.collectColumnsAndValues(metadata, entity, subject.date, undefined, undefined, alreadyInsertedSubjects);
                        return [4 /*yield*/, this.queryRunner.insert(metadata.table.name, valuesMap, metadata.generatedColumnIfExist)];
                    case 4:
                        newlyGeneratedId = _a.sent();
                        _a.label = 5;
                    case 5:
                        if (parentGeneratedId)
                            subject.parentGeneratedId = parentGeneratedId;
                        if (newlyGeneratedId && metadata.hasGeneratedColumn)
                            subject.newlyGeneratedId = newlyGeneratedId;
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Collects columns and values for the insert operation.
     */
    SubjectOperationExecutor.prototype.collectColumnsAndValues = function (metadata, entity, date, parentIdColumnValue, discriminatorValue, alreadyInsertedSubjects) {
        var _this = this;
        // extract all columns
        var columns = metadata.columns.filter(function (column) {
            return !column.isVirtual && !column.isParentId && !column.isDiscriminator && column.hasEntityValue(entity);
        });
        var relationColumns = [];
        var relationValues = [];
        metadata.relationsWithJoinColumns.forEach(function (relation) {
            var relationValue;
            var value = relation.getEntityValue(entity);
            if (value) {
                // if relation value is stored in the entity itself then use it from there
                var relationId = relation.getInverseEntityRelationId(value); // todo: check it
                if (relationId) {
                    relationValue = relationId;
                }
                // otherwise try to find relational value from just inserted subjects
                var alreadyInsertedSubject = alreadyInsertedSubjects.find(function (insertedSubject) {
                    return insertedSubject.entity === value;
                });
                if (alreadyInsertedSubject) {
                    var referencedColumn = relation.joinColumn.referencedColumn;
                    // if join column references to the primary generated column then seek in the newEntityId of the insertedSubject
                    if (referencedColumn.referencedColumn && referencedColumn.referencedColumn.isGenerated) {
                        if (referencedColumn.isParentId) {
                            relationValue = alreadyInsertedSubject.parentGeneratedId;
                        }
                        // todo: what if reference column is not generated?
                        // todo: what if reference column is not related to table inheritance?
                    }
                    if (referencedColumn.isGenerated)
                        relationValue = alreadyInsertedSubject.newlyGeneratedId;
                    // if it references to create or update date columns
                    if (referencedColumn.isCreateDate || referencedColumn.isUpdateDate)
                        relationValue = _this.connection.driver.preparePersistentValue(alreadyInsertedSubject.date, referencedColumn);
                    // if it references to version column
                    if (referencedColumn.isVersion)
                        relationValue = _this.connection.driver.preparePersistentValue(1, referencedColumn);
                }
            }
            else if (relation.hasInverseSide) {
                var inverseSubject = _this.allSubjects.find(function (subject) {
                    if (!subject.hasEntity || subject.entityTarget !== relation.inverseRelation.target)
                        return false;
                    var inverseRelationValue = subject.entity[relation.inverseRelation.propertyName];
                    if (inverseRelationValue) {
                        if (inverseRelationValue instanceof Array) {
                            return inverseRelationValue.find(function (subValue) { return subValue === subValue; });
                        }
                        else {
                            return inverseRelationValue === entity;
                        }
                    }
                });
                if (inverseSubject && inverseSubject.entity[relation.joinColumn.referencedColumn.propertyName]) {
                    relationValue = inverseSubject.entity[relation.joinColumn.referencedColumn.propertyName];
                }
            }
            if (relationValue) {
                relationColumns.push(relation);
                relationValues.push(relationValue);
            }
        });
        var columnNames = columns.map(function (column) { return column.name; });
        var relationColumnNames = relationColumns.map(function (relation) { return relation.name; });
        var allColumnNames = columnNames.concat(relationColumnNames);
        var columnValues = columns.map(function (column) {
            return _this.connection.driver.preparePersistentValue(column.getEntityValue(entity), column);
        });
        var allValues = columnValues.concat(relationValues);
        // add special column and value - date of creation
        if (metadata.hasCreateDateColumn) {
            allColumnNames.push(metadata.createDateColumn.name);
            allValues.push(this.connection.driver.preparePersistentValue(date, metadata.createDateColumn));
        }
        // add special column and value - date of updating
        if (metadata.hasUpdateDateColumn) {
            allColumnNames.push(metadata.updateDateColumn.name);
            allValues.push(this.connection.driver.preparePersistentValue(date, metadata.updateDateColumn));
        }
        // add special column and value - version column
        if (metadata.hasVersionColumn) {
            allColumnNames.push(metadata.versionColumn.name);
            allValues.push(this.connection.driver.preparePersistentValue(1, metadata.versionColumn));
        }
        // add special column and value - discriminator value (for tables using table inheritance)
        if (metadata.hasDiscriminatorColumn) {
            allColumnNames.push(metadata.discriminatorColumn.name);
            allValues.push(this.connection.driver.preparePersistentValue(discriminatorValue || metadata.discriminatorValue, metadata.discriminatorColumn));
        }
        // add special column and value - tree level and tree parents (for tree-type tables)
        if (metadata.hasTreeLevelColumn && metadata.hasTreeParentRelation) {
            var parentEntity = entity[metadata.treeParentRelation.propertyName];
            var parentLevel = parentEntity ? (parentEntity[metadata.treeLevelColumn.propertyName] || 0) : 0;
            allColumnNames.push(metadata.treeLevelColumn.name);
            allValues.push(parentLevel + 1);
        }
        // add special column and value - parent id column (for tables using table inheritance)
        if (metadata.parentEntityMetadata && metadata.hasParentIdColumn) {
            allColumnNames.push(metadata.parentIdColumn.name); // todo: should be array of primary keys
            allValues.push(parentIdColumnValue || entity[metadata.parentEntityMetadata.firstPrimaryColumn.propertyName]); // todo: should be array of primary keys
        }
        return OrmUtils_1.OrmUtils.zipObject(allColumnNames, allValues);
    };
    // -------------------------------------------------------------------------
    // Private Methods: Insertion into closure tables
    // -------------------------------------------------------------------------
    /**
     * Inserts all given subjects into closure table.
     */
    SubjectOperationExecutor.prototype.executeInsertClosureTableOperations = function () {
        var _this = this;
        var promises = this.insertSubjects
            .filter(function (subject) { return subject.metadata.table.isClosure; })
            .map(function (subject) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // const relationsUpdateMap = this.findUpdateOperationForEntity(updatesByRelations, insertSubjects, subject.entity);
                    // subject.treeLevel = await this.insertIntoClosureTable(subject, relationsUpdateMap);
                    return [4 /*yield*/, this.insertClosureTableValues(subject)];
                    case 1:
                        // const relationsUpdateMap = this.findUpdateOperationForEntity(updatesByRelations, insertSubjects, subject.entity);
                        // subject.treeLevel = await this.insertIntoClosureTable(subject, relationsUpdateMap);
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        return Promise.all(promises);
    };
    /**
     * Inserts given subject into closure table.
     */
    SubjectOperationExecutor.prototype.insertClosureTableValues = function (subject) {
        return __awaiter(this, void 0, void 0, function () {
            var tableName, referencedColumn, newEntityId, parentEntity, parentEntityId, parentInsertedSubject, parentSubject, _a, values, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        tableName = subject.metadata.closureJunctionTable.table.name;
                        referencedColumn = subject.metadata.treeParentRelation.joinColumn.referencedColumn;
                        newEntityId = subject.entity[referencedColumn.propertyName];
                        if (!newEntityId && referencedColumn.isGenerated) {
                            newEntityId = subject.newlyGeneratedId;
                        } // todo: implement other special column types too
                        parentEntity = subject.entity[subject.metadata.treeParentRelation.propertyName];
                        parentEntityId = 0;
                        if (parentEntity) {
                            parentEntityId = parentEntity[referencedColumn.propertyName];
                            if (!parentEntityId && referencedColumn.isGenerated) {
                                parentInsertedSubject = this.insertSubjects.find(function (subject) { return subject.entity === parentEntity; });
                                // todo: throw exception if parentInsertedSubject is not set
                                parentEntityId = parentInsertedSubject.newlyGeneratedId;
                            } // todo: implement other special column types too
                        }
                        // try to find parent entity id in some other entity that has this entity in its children
                        if (!parentEntityId) {
                            parentSubject = this.allSubjects.find(function (allSubject) {
                                if (!allSubject.hasEntity || !allSubject.metadata.table.isClosure || !allSubject.metadata.hasTreeChildrenRelation)
                                    return false;
                                var children = allSubject.entity[subject.metadata.treeChildrenRelation.propertyName];
                                return children instanceof Array ? children.indexOf(subject.entity) !== -1 : false;
                            });
                            if (parentSubject) {
                                parentEntityId = parentSubject.entity[referencedColumn.propertyName];
                                if (!parentEntityId && parentSubject.newlyGeneratedId) {
                                    parentEntityId = parentSubject.newlyGeneratedId;
                                }
                            }
                        }
                        // if parent entity exist then insert a new row into closure table
                        _a = subject;
                        return [4 /*yield*/, this.queryRunner.insertIntoClosureTable(tableName, newEntityId, parentEntityId, subject.metadata.hasTreeLevelColumn)];
                    case 1:
                        // if parent entity exist then insert a new row into closure table
                        _a.treeLevel = _d.sent();
                        if (!subject.metadata.hasTreeLevelColumn) return [3 /*break*/, 3];
                        values = (_b = {}, _b[subject.metadata.treeLevelColumn.name] = subject.treeLevel, _b);
                        return [4 /*yield*/, this.queryRunner.update(subject.metadata.table.name, values, (_c = {}, _c[referencedColumn.name] = newEntityId, _c))];
                    case 2:
                        _d.sent();
                        _d.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // -------------------------------------------------------------------------
    // Private Methods: Update
    // -------------------------------------------------------------------------
    /**
     * Updates all given subjects in the database.
     */
    SubjectOperationExecutor.prototype.executeUpdateOperations = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(this.updateSubjects.map(function (subject) { return _this.update(subject); }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Updates given subject in the database.
     */
    SubjectOperationExecutor.prototype.update = function (subject) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var entity, valueMaps, valueMap, valueMap, valueMap, valueMap;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        entity = subject.entity;
                        valueMaps = [];
                        subject.diffColumns.forEach(function (column) {
                            if (!column.entityTarget)
                                return; // todo: how this can be possible?
                            var metadata = _this.connection.getMetadata(column.entityTarget);
                            var valueMap = valueMaps.find(function (valueMap) { return valueMap.tableName === metadata.table.name; });
                            if (!valueMap) {
                                valueMap = { tableName: metadata.table.name, metadata: metadata, values: {} };
                                valueMaps.push(valueMap);
                            }
                            valueMap.values[column.name] = _this.connection.driver.preparePersistentValue(column.getEntityValue(entity), column);
                        });
                        subject.diffRelations.forEach(function (relation) {
                            var metadata = _this.connection.getMetadata(relation.entityTarget);
                            var valueMap = valueMaps.find(function (valueMap) { return valueMap.tableName === metadata.table.name; });
                            if (!valueMap) {
                                valueMap = { tableName: metadata.table.name, metadata: metadata, values: {} };
                                valueMaps.push(valueMap);
                            }
                            var value = relation.getEntityValue(entity);
                            valueMap.values[relation.name] = value !== null && value !== undefined ? value[relation.inverseEntityMetadata.firstPrimaryColumn.propertyName] : null; // todo: should not have a call to primaryColumn, instead join column metadata should be used
                        });
                        // if number of updated columns = 0 no need to update updated date and version columns
                        if (Object.keys(valueMaps).length === 0)
                            return [2 /*return*/];
                        if (subject.metadata.hasUpdateDateColumn) {
                            valueMap = valueMaps.find(function (valueMap) { return valueMap.tableName === subject.metadata.table.name; });
                            if (!valueMap) {
                                valueMap = { tableName: subject.metadata.table.name, metadata: subject.metadata, values: {} };
                                valueMaps.push(valueMap);
                            }
                            valueMap.values[subject.metadata.updateDateColumn.name] = this.connection.driver.preparePersistentValue(new Date(), subject.metadata.updateDateColumn);
                        }
                        if (subject.metadata.hasVersionColumn) {
                            valueMap = valueMaps.find(function (valueMap) { return valueMap.tableName === subject.metadata.table.name; });
                            if (!valueMap) {
                                valueMap = { tableName: subject.metadata.table.name, metadata: subject.metadata, values: {} };
                                valueMaps.push(valueMap);
                            }
                            valueMap.values[subject.metadata.versionColumn.name] = this.connection.driver.preparePersistentValue(entity[subject.metadata.versionColumn.propertyName] + 1, subject.metadata.versionColumn);
                        }
                        if (subject.metadata.parentEntityMetadata) {
                            if (subject.metadata.parentEntityMetadata.hasUpdateDateColumn) {
                                valueMap = valueMaps.find(function (valueMap) { return valueMap.tableName === subject.metadata.parentEntityMetadata.table.name; });
                                if (!valueMap) {
                                    valueMap = {
                                        tableName: subject.metadata.parentEntityMetadata.table.name,
                                        metadata: subject.metadata.parentEntityMetadata,
                                        values: {}
                                    };
                                    valueMaps.push(valueMap);
                                }
                                valueMap.values[subject.metadata.parentEntityMetadata.updateDateColumn.name] = this.connection.driver.preparePersistentValue(new Date(), subject.metadata.parentEntityMetadata.updateDateColumn);
                            }
                            if (subject.metadata.parentEntityMetadata.hasVersionColumn) {
                                valueMap = valueMaps.find(function (valueMap) { return valueMap.tableName === subject.metadata.parentEntityMetadata.table.name; });
                                if (!valueMap) {
                                    valueMap = {
                                        tableName: subject.metadata.parentEntityMetadata.table.name,
                                        metadata: subject.metadata.parentEntityMetadata,
                                        values: {}
                                    };
                                    valueMaps.push(valueMap);
                                }
                                valueMap.values[subject.metadata.parentEntityMetadata.versionColumn.name] = this.connection.driver.preparePersistentValue(entity[subject.metadata.parentEntityMetadata.versionColumn.propertyName] + 1, subject.metadata.parentEntityMetadata.versionColumn);
                            }
                        }
                        return [4 /*yield*/, Promise.all(valueMaps.map(function (valueMap) {
                                var idMap = valueMap.metadata.getDatabaseEntityIdMap(entity);
                                if (!idMap)
                                    throw new Error("Internal error. Cannot get id of the updating entity.");
                                return _this.queryRunner.update(valueMap.tableName, valueMap.values, idMap);
                            }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // -------------------------------------------------------------------------
    // Private Methods: Update only relations
    // -------------------------------------------------------------------------
    /**
     * Updates relations of all given subjects in the database.
     */
    SubjectOperationExecutor.prototype.executeUpdateRelations = function () {
        var _this = this;
        return Promise.all(this.relationUpdateSubjects.map(function (subject) { return _this.updateRelations(subject); }));
    };
    /**
     * Updates relations of the given subject in the database.
     */
    SubjectOperationExecutor.prototype.updateRelations = function (subject) {
        return __awaiter(this, void 0, void 0, function () {
            var values, idMap;
            return __generator(this, function (_a) {
                values = {};
                subject.relationUpdates.forEach(function (setRelation) {
                    var value = setRelation.value ? setRelation.value[setRelation.relation.joinColumn.referencedColumn.propertyName] : null;
                    values[setRelation.relation.name] = value; // todo: || fromInsertedSubjects ??
                });
                idMap = subject.metadata.getDatabaseEntityIdMap(subject.databaseEntity);
                if (!idMap)
                    throw new Error("Internal error. Cannot get id of the updating entity.");
                return [2 /*return*/, this.queryRunner.update(subject.metadata.table.name, values, idMap)];
            });
        });
    };
    // -------------------------------------------------------------------------
    // Private Methods: Remove
    // -------------------------------------------------------------------------
    /**
     * Removes all given subjects from the database.
     */
    SubjectOperationExecutor.prototype.executeRemoveOperations = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, PromiseUtils_1.PromiseUtils.runInSequence(this.removeSubjects, function (subject) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.remove(subject)];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Updates given subject from the database.
     */
    SubjectOperationExecutor.prototype.remove = function (subject) {
        return __awaiter(this, void 0, void 0, function () {
            var parentConditions_1, childConditions_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!subject.metadata.parentEntityMetadata) return [3 /*break*/, 3];
                        parentConditions_1 = {};
                        subject.metadata.parentPrimaryColumns.forEach(function (column) {
                            parentConditions_1[column.name] = subject.databaseEntity[column.propertyName];
                        });
                        return [4 /*yield*/, this.queryRunner.delete(subject.metadata.parentEntityMetadata.table.name, parentConditions_1)];
                    case 1:
                        _a.sent();
                        childConditions_1 = {};
                        subject.metadata.primaryColumnsWithParentIdColumns.forEach(function (column) {
                            childConditions_1[column.name] = subject.databaseEntity[column.propertyName];
                        });
                        return [4 /*yield*/, this.queryRunner.delete(subject.metadata.table.name, childConditions_1)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.queryRunner.delete(subject.metadata.table.name, subject.metadata.getEntityIdColumnMap(subject.databaseEntity))];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // -------------------------------------------------------------------------
    // Private Methods: Insertion into junction tables
    // -------------------------------------------------------------------------
    /**
     * Inserts into database junction tables all given array of subjects junction data.
     */
    SubjectOperationExecutor.prototype.executeInsertJunctionsOperations = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var promises;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises = [];
                        this.allSubjects.forEach(function (subject) {
                            subject.junctionInserts.forEach(function (junctionInsert) {
                                promises.push(_this.insertJunctions(subject, junctionInsert));
                            });
                        });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Inserts into database junction table given subject's junction insert data.
     */
    SubjectOperationExecutor.prototype.insertJunctions = function (subject, junctionInsert) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var relation, joinTable, firstColumn, secondColumn, ownId, promises;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        relation = junctionInsert.relation;
                        joinTable = relation.isOwning ? relation.joinTable : relation.inverseRelation.joinTable;
                        firstColumn = relation.isOwning ? joinTable.referencedColumn : joinTable.inverseReferencedColumn;
                        secondColumn = relation.isOwning ? joinTable.inverseReferencedColumn : joinTable.referencedColumn;
                        ownId = relation.getOwnEntityRelationId(subject.entity);
                        if (!ownId) {
                            if (firstColumn.isGenerated) {
                                ownId = subject.newlyGeneratedId;
                            }
                            // todo: implement other special referenced column types (update date, create date, version, discriminator column, etc.)
                        }
                        if (!ownId)
                            throw new Error("Cannot insert object of " + subject.entityTarget + " type. Looks like its not persisted yet, or cascades are not set on the relation."); // todo: better error message
                        promises = junctionInsert.junctionEntities.map(function (newBindEntity) {
                            // get relation id from the newly bind entity
                            var relationId;
                            if (relation.isManyToManyOwner) {
                                relationId = newBindEntity[relation.joinTable.inverseReferencedColumn.propertyName];
                            }
                            else if (relation.isManyToManyNotOwner) {
                                relationId = newBindEntity[relation.inverseRelation.joinTable.referencedColumn.propertyName];
                            }
                            // if relation id is missing in the newly bind entity then check maybe it was just persisted
                            // and we can use special newly generated value
                            if (!relationId) {
                                var insertSubject = _this.insertSubjects.find(function (subject) { return subject.entity === newBindEntity; });
                                if (insertSubject) {
                                    if (secondColumn.isGenerated) {
                                        relationId = insertSubject.newlyGeneratedId;
                                    }
                                    // todo: implement other special values too
                                }
                            }
                            // if relation id still does not exist - we arise an error
                            if (!relationId)
                                throw new Error("Cannot insert object of " + newBindEntity.constructor.name + " type. Looks like its not persisted yet, or cascades are not set on the relation."); // todo: better error message
                            var columns = relation.junctionEntityMetadata.columns.map(function (column) { return column.name; });
                            var values = relation.isOwning ? [ownId, relationId] : [relationId, ownId];
                            return _this.queryRunner.insert(relation.junctionEntityMetadata.table.name, OrmUtils_1.OrmUtils.zipObject(columns, values));
                        });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // -------------------------------------------------------------------------
    // Private Methods: Remove from junction tables
    // -------------------------------------------------------------------------
    /**
     * Removes from database junction tables all given array of subjects removal junction data.
     */
    SubjectOperationExecutor.prototype.executeRemoveJunctionsOperations = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var promises;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises = [];
                        this.allSubjects.forEach(function (subject) {
                            subject.junctionRemoves.forEach(function (junctionRemove) {
                                promises.push(_this.removeJunctions(subject, junctionRemove));
                            });
                        });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Removes from database junction table all given subject's removal junction data.
     */
    SubjectOperationExecutor.prototype.removeJunctions = function (subject, junctionRemove) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var junctionMetadata, entity, ownId, ownColumn, relateColumn, removePromises;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        junctionMetadata = junctionRemove.relation.junctionEntityMetadata;
                        entity = subject.hasEntity ? subject.entity : subject.databaseEntity;
                        ownId = junctionRemove.relation.getOwnEntityRelationId(entity);
                        ownColumn = junctionRemove.relation.isOwning ? junctionMetadata.columns[0] : junctionMetadata.columns[1];
                        relateColumn = junctionRemove.relation.isOwning ? junctionMetadata.columns[1] : junctionMetadata.columns[0];
                        removePromises = junctionRemove.junctionRelationIds.map(function (relationId) {
                            return _this.queryRunner.delete(junctionMetadata.table.name, (_a = {},
                                _a[ownColumn.name] = ownId,
                                _a[relateColumn.name] = relationId,
                                _a));
                            var _a;
                        });
                        return [4 /*yield*/, Promise.all(removePromises)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // -------------------------------------------------------------------------
    // Private Methods: Refresh entity values after persistence
    // -------------------------------------------------------------------------
    /**
     * Updates all special columns of the saving entities (create date, update date, versioning).
     */
    SubjectOperationExecutor.prototype.updateSpecialColumnsInPersistedEntities = function () {
        // update entity columns that gets updated on each entity insert
        this.insertSubjects.forEach(function (subject) {
            subject.metadata.primaryColumns.forEach(function (primaryColumn) {
                if (subject.newlyGeneratedId)
                    subject.entity[primaryColumn.propertyName] = subject.newlyGeneratedId;
            });
            subject.metadata.parentPrimaryColumns.forEach(function (primaryColumn) {
                if (subject.parentGeneratedId)
                    subject.entity[primaryColumn.propertyName] = subject.parentGeneratedId;
            });
            if (subject.metadata.hasUpdateDateColumn)
                subject.entity[subject.metadata.updateDateColumn.propertyName] = subject.date;
            if (subject.metadata.hasCreateDateColumn)
                subject.entity[subject.metadata.createDateColumn.propertyName] = subject.date;
            if (subject.metadata.hasVersionColumn)
                subject.entity[subject.metadata.versionColumn.propertyName]++;
            if (subject.metadata.hasTreeLevelColumn) {
                // const parentEntity = insertOperation.entity[metadata.treeParentMetadata.propertyName];
                // const parentLevel = parentEntity ? (parentEntity[metadata.treeLevelColumn.propertyName] || 0) : 0;
                subject.entity[subject.metadata.treeLevelColumn.propertyName] = subject.treeLevel;
            }
            /*if (subject.metadata.hasTreeChildrenCountColumn) {
                 subject.entity[subject.metadata.treeChildrenCountColumn.propertyName] = 0;
            }*/
        });
        // update special columns that gets updated on each entity update
        this.updateSubjects.forEach(function (subject) {
            if (subject.metadata.hasUpdateDateColumn)
                subject.entity[subject.metadata.updateDateColumn.propertyName] = subject.date;
            if (subject.metadata.hasVersionColumn)
                subject.entity[subject.metadata.versionColumn.propertyName]++;
        });
        // remove ids from the entities that were removed
        this.removeSubjects
            .filter(function (subject) { return subject.hasEntity; })
            .forEach(function (subject) {
            subject.metadata.primaryColumns.forEach(function (primaryColumn) {
                subject.entity[primaryColumn.propertyName] = undefined;
            });
        });
    };
    return SubjectOperationExecutor;
}());
exports.SubjectOperationExecutor = SubjectOperationExecutor;

//# sourceMappingURL=SubjectOperationExecutor.js.map
