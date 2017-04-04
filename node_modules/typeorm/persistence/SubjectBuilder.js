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
var Subject_1 = require("./Subject");
var SpecificRepository_1 = require("../repository/SpecificRepository");
/**
 * To be able to execute persistence operations we need to load all entities from the database we need.
 * Loading should be efficient - we need to load entities in as few queries as possible + load as less data as we can.
 * This is how we determine which entities needs to be loaded from db:
 *
 * 1. example with cascade updates and inserts:
 *
 * [Y] - means "yes, we load"
 * [N] - means "no, we don't load"
 * in {} braces we specify what cascade options are set between relations
 *
 * if Post is new, author is not set in the post
 *
 * [Y] Post -> {all} // yes because of "update" and "insert" cascades, no because of "remove"
 *   [Y] Author -> {all} // no because author is not set
 *     [Y] Photo -> {all} // no because author and its photo are not set
 *       [Y] Tag -> {all} // no because author and its photo and its tag are not set
 *
 * if Post is new, author is new (or anything else is new)
 * if Post is updated
 * if Post and/or Author are updated
 *
 * [Y] Post -> {all} // yes because of "update" and "insert" cascades, no because of "remove"
 *   [Y] Author -> {all} // yes because of "update" and "insert" cascades, no because of "remove"
 *     [Y] Photo -> {all} // yes because of "update" and "insert" cascades, no because of "remove"
 *       [Y] Tag -> {all} // yes because of "update" and "insert" cascades, no because of "remove"
 *
 * Here we load post, author, photo, tag to check if they are new or not to persist insert or update operation.
 * We load post, author, photo, tag only if they exist in the relation.
 * From these examples we can see that we always load entity relations when it has "update" or "insert" cascades.
 *
 * 2. example with cascade removes
 *
 * if entity is new its remove operations by cascades should not be executed
 * if entity is updated then values that are null or missing in array (not undefined!, undefined means skip - don't do anything) are treated as removed
 * if entity is removed then all its downside relations which has cascade remove should be removed
 *
 * Once we find removed entity - we load it, and every downside entity which has "remove" cascade set.
 *
 * At the end we have all entities we need to operate with.
 * Next step is to store all loaded entities to manipulate them efficiently.
 *
 * Rules of updating by cascades.
 * Insert operation can lead to:
 *  - insert operations
 *  - update operations
 * Update operation can lead to:
 *  - insert operations
 *  - update operations
 *  - remove operations
 * Remove operation can lead to:
 *  - remove operation
 */
var SubjectBuilder = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function SubjectBuilder(connection, queryRunnerProvider) {
        this.connection = connection;
        this.queryRunnerProvider = queryRunnerProvider;
        // -------------------------------------------------------------------------
        // Protected properties
        // -------------------------------------------------------------------------
        /**
         * If this gonna be reused then what to do with marked flags?
         * One of solution can be clone this object and reset all marked states for this persistence.
         * Or from reused just extract databaseEntities from their subjects? (looks better)
         */
        this.operateSubjects = [];
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Builds operations for entity that is being inserted/updated.
     */
    SubjectBuilder.prototype.persist = function (entity, metadata) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var mainPersistedSubject, operateSubjectsWithDatabaseEntities;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mainPersistedSubject = new Subject_1.Subject(metadata, entity);
                        mainPersistedSubject.canBeInserted = true;
                        mainPersistedSubject.canBeUpdated = true;
                        this.operateSubjects.push(mainPersistedSubject);
                        // next step we build list of subjects we will operate with
                        // these subjects are subjects that we need to insert or update alongside with main persisted entity
                        this.buildCascadeUpdateAndInsertOperateSubjects(mainPersistedSubject);
                        // next step is to load database entities of all operate subjects
                        return [4 /*yield*/, this.loadOperateSubjectsDatabaseEntities()];
                    case 1:
                        // next step is to load database entities of all operate subjects
                        _a.sent();
                        operateSubjectsWithDatabaseEntities = this.operateSubjects.filter(function (subject) { return subject.hasDatabaseEntity; });
                        return [4 /*yield*/, Promise.all(operateSubjectsWithDatabaseEntities.map(function (subject) {
                                return _this.buildCascadeRemovedAndRelationUpdateOperateSubjects(subject);
                            }))];
                    case 2:
                        _a.sent();
                        // finally find which operate subjects have insert and remove operations in their junction tables
                        return [4 /*yield*/, this.buildJunctionOperations({ insert: true, remove: true })];
                    case 3:
                        // finally find which operate subjects have insert and remove operations in their junction tables
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Builds only remove operations for entity that is being removed.
     */
    SubjectBuilder.prototype.remove = function (entity, metadata) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var mainRemovedSubject, operateSubjectsWithDatabaseEntities;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mainRemovedSubject = new Subject_1.Subject(metadata, entity);
                        mainRemovedSubject.mustBeRemoved = true;
                        this.operateSubjects.push(mainRemovedSubject);
                        // next step we build list of subjects we will operate with
                        // these subjects are subjects that we need to remove alongside with main removed entity
                        this.buildCascadeRemoveOperateSubjects(mainRemovedSubject);
                        // next step is to load database entities for all operate subjects
                        return [4 /*yield*/, this.loadOperateSubjectsDatabaseEntities()];
                    case 1:
                        // next step is to load database entities for all operate subjects
                        _a.sent();
                        operateSubjectsWithDatabaseEntities = this.operateSubjects.filter(function (subject) { return subject.hasDatabaseEntity; });
                        return [4 /*yield*/, Promise.all(operateSubjectsWithDatabaseEntities.map(function (subject) {
                                return _this.buildCascadeRemovedAndRelationUpdateOperateSubjects(subject);
                            }))];
                    case 2:
                        _a.sent();
                        // finally find which operate subjects have remove operations in their junction tables
                        return [4 /*yield*/, this.buildJunctionOperations({ insert: false, remove: true })];
                    case 3:
                        // finally find which operate subjects have remove operations in their junction tables
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Builds and pushes to array of operate entities all entities that we will work with.
     * These are only relational entities which has insert and update cascades.
     * All such entities will be loaded from the database, because they can be inserted or updated.
     * That's why we load them - to understand if they should be inserted or updated, or which columns we need to update.
     * We can't add removed entities here, because to know which entity was removed we need first to
     * load original entity (particularly its id) from the database.
     * That's why we first need to load all changed entities, then extract ids of the removed entities from them,
     * and only then load removed entities by extracted ids.
     */
    SubjectBuilder.prototype.buildCascadeUpdateAndInsertOperateSubjects = function (subject) {
        var _this = this;
        subject.metadata
            .extractRelationValuesFromEntity(subject.entity, subject.metadata.relations)
            .filter(function (_a) {
            var relation = _a[0], value = _a[1], valueMetadata = _a[2];
            // we need only defined values and insert or update cascades of the relation should be set
            return value !== undefined && value !== null && (relation.isCascadeInsert || relation.isCascadeUpdate);
        })
            .forEach(function (_a) {
            var relation = _a[0], value = _a[1], valueMetadata = _a[2];
            // if we already has this entity in list of operated subjects then skip it to avoid recursion
            var alreadyExistValueSubject = _this.findByEntityLike(valueMetadata.target, value);
            if (alreadyExistValueSubject) {
                if (alreadyExistValueSubject.canBeInserted === false)
                    alreadyExistValueSubject.canBeInserted = relation.isCascadeInsert === true;
                if (alreadyExistValueSubject.canBeUpdated === false)
                    alreadyExistValueSubject.canBeUpdated = relation.isCascadeUpdate === true;
                return;
            }
            // mark subject with what we can do with it
            // and add to the array of subjects to load only if there is no same entity there already
            var valueSubject = new Subject_1.Subject(valueMetadata, value);
            valueSubject.canBeInserted = relation.isCascadeInsert === true;
            valueSubject.canBeUpdated = relation.isCascadeUpdate === true;
            _this.operateSubjects.push(valueSubject);
            // go recursively and find other entities we need to operate with
            _this.buildCascadeUpdateAndInsertOperateSubjects(valueSubject);
        });
    };
    /**
     * Builds and pushes to array of operate entities all entities that must be removed.
     */
    SubjectBuilder.prototype.buildCascadeRemoveOperateSubjects = function (subject) {
        var _this = this;
        subject.metadata
            .extractRelationValuesFromEntity(subject.entity, subject.metadata.relations)
            .filter(function (_a) {
            var relation = _a[0], value = _a[1], valueMetadata = _a[2];
            // we need only defined values and insert cascades of the relation should be set
            return value !== undefined && value !== null && relation.isCascadeRemove;
        })
            .forEach(function (_a) {
            var relation = _a[0], value = _a[1], valueMetadata = _a[2];
            // if we already has this entity in list of operated subjects then skip it to avoid recursion
            var alreadyExistValueSubject = _this.findByEntityLike(valueMetadata.target, value);
            if (alreadyExistValueSubject) {
                alreadyExistValueSubject.mustBeRemoved = true;
                return;
            }
            // add to the array of subjects to load only if there is no same entity there already
            var valueSubject = new Subject_1.Subject(valueMetadata, value);
            valueSubject.mustBeRemoved = true;
            _this.operateSubjects.push(valueSubject);
            // go recursively and find other entities to load by cascades in currently inserted entities
            _this.buildCascadeRemoveOperateSubjects(valueSubject);
        });
    };
    /**
     * Loads database entities for all operate subjects which do not have database entity set.
     * All entities that we load database entities for are marked as updated or inserted.
     * To understand which of them really needs to be inserted or updated we need to load
     * their original representations from the database.
     */
    SubjectBuilder.prototype.loadOperateSubjectsDatabaseEntities = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var promises;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises = this.groupByEntityTargets().map(function (subjectGroup) { return __awaiter(_this, void 0, void 0, function () {
                            var _this = this;
                            var allIds, entities;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        allIds = subjectGroup.subjects
                                            .filter(function (subject) { return !subject.hasDatabaseEntity; }) // we don't load if subject already has a database entity loaded
                                            .map(function (subject) { return subject.metadata.getEntityIdMixedMap(subject.entity); }) // we only need entity id
                                            .filter(function (mixedId) {
                                            if (mixedId instanceof Object)
                                                return Object.keys(mixedId).every(function (key) { return mixedId[key] !== undefined && mixedId[key] !== null && mixedId[key] !== ""; });
                                            return mixedId !== undefined && mixedId !== null && mixedId !== "";
                                        });
                                        // if there no ids found (which means all entities are new and have generated ids) - then nothing to load there
                                        if (!allIds.length)
                                            return [2 /*return*/];
                                        return [4 /*yield*/, this.connection
                                                .getRepository(subjectGroup.target)
                                                .createQueryBuilder("operateSubject", this.queryRunnerProvider)
                                                .andWhereInIds(allIds)
                                                .enableOption("RELATION_ID_VALUES")
                                                .getMany()];
                                    case 1:
                                        entities = _a.sent();
                                        // now when we have entities we need to find subject of each entity
                                        // and insert that entity into database entity of the found subject
                                        entities.forEach(function (entity) {
                                            var subject = _this.findByEntityLike(subjectGroup.target, entity);
                                            if (subject)
                                                subject.databaseEntity = entity;
                                        });
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * We need to load removed entity when:
     *  - entity with relations is not new (this can be determined only after entity is loaded from db)
     *      (note: simple "id" check will not work because id can be not generated)
     *  - entity missing relation. When relation is simple
     *      - in the case of one-to-one owner (with join column) relation we need to load owner entity
     *      - in the case of one-to-one (without join column) relation we need to load inverse side entity
     *      - in the case of many-to-one relations we need to load entity itself
     *      - in the case of one-to-many relations we need to load entities by relation from inverse side
     *
     *  Before loading each entity we need to check in the loaded subjects - maybe it was already loaded.
     *
     *  BIG NOTE: objects are being removed by cascades not only when relation is removed, but also when
     *  relation is replaced (e.g. changed with different object).
     */
    SubjectBuilder.prototype.buildCascadeRemovedAndRelationUpdateOperateSubjects = function (subject) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var promises;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises = subject.metadata.relations.map(function (relation) { return __awaiter(_this, void 0, void 0, function () {
                            var _this = this;
                            var valueMetadata, qbAlias, relationIdInDatabaseEntity_1, persistValueRelationId, persistValue, alreadyLoadedRelatedDatabaseSubject, databaseEntity, persistValueRelationId, persistValue, relationIdInDatabaseEntity_2, alreadyLoadedRelatedDatabaseSubject, databaseEntity, inverseEntityRelationId, persistValue_1, databaseEntities_1, escapeAlias, escapeColumn, relationIdInDatabaseEntity, relationIdInDatabaseEntity, relationIdInDatabaseEntity, promises_1, promises_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        valueMetadata = relation.inverseEntityMetadata;
                                        qbAlias = valueMetadata.table.name;
                                        // added for type-safety, but subject without databaseEntity cant come here anyway because of checks on upper levels
                                        if (!subject.hasDatabaseEntity)
                                            return [2 /*return*/];
                                        if (!(relation.isOneToOneOwner || relation.isManyToOne)) return [3 /*break*/, 4];
                                        // we only work with cascade removes here
                                        if (!relation.isCascadeRemove)
                                            return [2 /*return*/];
                                        relationIdInDatabaseEntity_1 = subject.databaseEntity[relation.joinColumn.propertyName];
                                        // if database relation id does not exist in the database object then nothing to remove
                                        if (relationIdInDatabaseEntity_1 === null || relationIdInDatabaseEntity_1 === undefined)
                                            return [2 /*return*/];
                                        persistValueRelationId = undefined;
                                        if (subject.hasEntity) {
                                            persistValue = relation.getEntityValue(subject.entity);
                                            if (persistValue === null)
                                                persistValueRelationId = null;
                                            if (persistValue)
                                                persistValueRelationId = persistValue[relation.joinColumn.referencedColumn.propertyName];
                                            if (persistValueRelationId === undefined)
                                                return [2 /*return*/]; // skip undefined properties
                                        }
                                        // object is removed only if relation id in the persisted entity is empty or is changed
                                        if (persistValueRelationId !== null && persistValueRelationId === relationIdInDatabaseEntity_1)
                                            return [2 /*return*/];
                                        alreadyLoadedRelatedDatabaseSubject = this.operateSubjects.find(function (relatedSubject) {
                                            // (example) filter only subject that has database entity loaded and its target is Details
                                            if (!relatedSubject.hasDatabaseEntity || relatedSubject.entityTarget !== valueMetadata.target)
                                                return false;
                                            // (example) here we seek a Details loaded from the database in the subjects
                                            // (example) here relatedSubject.databaseEntity is a Details
                                            // (example) and we need to compare details.id === post.detailsId
                                            return relatedSubject.databaseEntity[relation.joinColumn.referencedColumn.propertyName] === relationIdInDatabaseEntity_1;
                                        });
                                        if (!!alreadyLoadedRelatedDatabaseSubject) return [3 /*break*/, 2];
                                        return [4 /*yield*/, this.connection
                                                .getRepository(valueMetadata.target)
                                                .createQueryBuilder(qbAlias, this.queryRunnerProvider)
                                                .where(qbAlias + "." + relation.joinColumn.referencedColumn.propertyName + "=:id")
                                                .setParameter("id", relationIdInDatabaseEntity_1) // (example) subject.entity is a post here
                                                .enableOption("RELATION_ID_VALUES")
                                                .getOne()];
                                    case 1:
                                        databaseEntity = _a.sent();
                                        if (databaseEntity) {
                                            alreadyLoadedRelatedDatabaseSubject = new Subject_1.Subject(valueMetadata, undefined, databaseEntity);
                                            this.operateSubjects.push(alreadyLoadedRelatedDatabaseSubject);
                                        }
                                        _a.label = 2;
                                    case 2:
                                        if (!alreadyLoadedRelatedDatabaseSubject) return [3 /*break*/, 4];
                                        // if object is already marked as removed then no need to proceed because it already was proceed
                                        // if we remove this it will cause a recursion
                                        if (alreadyLoadedRelatedDatabaseSubject.mustBeRemoved)
                                            return [2 /*return*/];
                                        alreadyLoadedRelatedDatabaseSubject.mustBeRemoved = true;
                                        return [4 /*yield*/, this.buildCascadeRemovedAndRelationUpdateOperateSubjects(alreadyLoadedRelatedDatabaseSubject)];
                                    case 3:
                                        _a.sent();
                                        _a.label = 4;
                                    case 4:
                                        if (!relation.isOneToOneNotOwner) return [3 /*break*/, 8];
                                        // we only work with cascade removes here
                                        if (!relation.isCascadeRemove)
                                            return [2 /*return*/]; // todo: no
                                        persistValueRelationId = undefined;
                                        if (subject.hasEntity && !subject.mustBeRemoved) {
                                            persistValue = relation.getEntityValue(subject.entity);
                                            if (persistValue)
                                                persistValueRelationId = persistValue[relation.inverseRelation.joinColumn.propertyName];
                                            if (persistValueRelationId === undefined)
                                                return [2 /*return*/]; // skip undefined properties
                                        }
                                        relationIdInDatabaseEntity_2 = subject.databaseEntity[relation.inverseRelation.joinColumn.referencedColumn.propertyName];
                                        // if database relation id does not exist then nothing to remove (but can this be possible?)
                                        if (relationIdInDatabaseEntity_2 === null || relationIdInDatabaseEntity_2 === undefined)
                                            return [2 /*return*/];
                                        alreadyLoadedRelatedDatabaseSubject = this.operateSubjects.find(function (relatedSubject) {
                                            // (example) filter only subject that has database entity loaded and its target is Post
                                            if (!relatedSubject.hasDatabaseEntity || relatedSubject.entityTarget !== valueMetadata.target)
                                                return false;
                                            // (example) here we seek a Post loaded from the database in the subjects
                                            // (example) here relatedSubject.databaseEntity is a Post
                                            // (example) and we need to compare post.detailsId === details.id
                                            return relatedSubject.databaseEntity[relation.inverseRelation.joinColumn.propertyName] === relationIdInDatabaseEntity_2;
                                        });
                                        if (!!alreadyLoadedRelatedDatabaseSubject) return [3 /*break*/, 6];
                                        return [4 /*yield*/, this.connection
                                                .getRepository(valueMetadata.target)
                                                .createQueryBuilder(qbAlias, this.queryRunnerProvider)
                                                .where(qbAlias + "." + relation.inverseSideProperty + "=:id")
                                                .setParameter("id", relationIdInDatabaseEntity_2) // (example) subject.entity is a details here, and the value is details.id
                                                .enableOption("RELATION_ID_VALUES")
                                                .getOne()];
                                    case 5:
                                        databaseEntity = _a.sent();
                                        // add only if database entity exist - because in the case of inverse side of the one-to-one relation
                                        // we cannot check if it was removed or not until we query the database
                                        // and it can be a situation that relation wasn't exist at all. This is particular that case
                                        alreadyLoadedRelatedDatabaseSubject = new Subject_1.Subject(valueMetadata, undefined, databaseEntity);
                                        this.operateSubjects.push(alreadyLoadedRelatedDatabaseSubject);
                                        _a.label = 6;
                                    case 6:
                                        if (!(alreadyLoadedRelatedDatabaseSubject && alreadyLoadedRelatedDatabaseSubject.hasDatabaseEntity)) return [3 /*break*/, 8];
                                        inverseEntityRelationId = alreadyLoadedRelatedDatabaseSubject.databaseEntity[relation.inverseRelation.joinColumn.propertyName];
                                        if (persistValueRelationId && persistValueRelationId === inverseEntityRelationId)
                                            return [2 /*return*/];
                                        // if object is already marked as removed then no need to proceed because it already was proceed
                                        // if we remove this it will cause a recursion
                                        if (alreadyLoadedRelatedDatabaseSubject.mustBeRemoved)
                                            return [2 /*return*/];
                                        alreadyLoadedRelatedDatabaseSubject.mustBeRemoved = true;
                                        return [4 /*yield*/, this.buildCascadeRemovedAndRelationUpdateOperateSubjects(alreadyLoadedRelatedDatabaseSubject)];
                                    case 7:
                                        _a.sent();
                                        _a.label = 8;
                                    case 8:
                                        if (!(relation.isOneToMany || relation.isManyToMany)) return [3 /*break*/, 18];
                                        persistValue_1 = undefined;
                                        if (subject.hasEntity) {
                                            persistValue_1 = relation.getEntityValue(subject.entity);
                                            if (persistValue_1 === undefined)
                                                return [2 /*return*/]; // skip undefined properties
                                        }
                                        databaseEntities_1 = [];
                                        escapeAlias = function (alias) { return _this.connection.driver.escapeAliasName(alias); };
                                        escapeColumn = function (column) { return _this.connection.driver.escapeColumnName(column); };
                                        if (!relation.isManyToManyOwner) return [3 /*break*/, 10];
                                        relationIdInDatabaseEntity = subject.databaseEntity[relation.joinTable.referencedColumn.propertyName];
                                        // we only need to load inverse entities if cascade removes are set
                                        // because remove by cascades is the only reason we need relational entities here
                                        if (!relation.isCascadeRemove)
                                            return [2 /*return*/];
                                        return [4 /*yield*/, this.connection
                                                .getRepository(valueMetadata.target)
                                                .createQueryBuilder(qbAlias, this.queryRunnerProvider)
                                                .innerJoin(relation.junctionEntityMetadata.table.name, "persistenceJoinedRelation", escapeAlias("persistenceJoinedRelation") + "." + escapeColumn(relation.joinTable.inverseJoinColumnName) + "=" + escapeAlias(qbAlias) + "." + escapeColumn(relation.joinTable.inverseReferencedColumn.name) +
                                                " AND " + escapeAlias("persistenceJoinedRelation") + "." + escapeColumn(relation.joinTable.joinColumnName) + "=:id")
                                                .setParameter("id", relationIdInDatabaseEntity)
                                                .enableOption("RELATION_ID_VALUES")
                                                .getMany()];
                                    case 9:
                                        databaseEntities_1 = _a.sent();
                                        return [3 /*break*/, 14];
                                    case 10:
                                        if (!relation.isManyToManyNotOwner) return [3 /*break*/, 12];
                                        relationIdInDatabaseEntity = subject.databaseEntity[relation.inverseRelation.joinTable.inverseReferencedColumn.propertyName];
                                        // we only need to load inverse entities if cascade removes are set
                                        // because remove by cascades is the only reason we need relational entities here
                                        if (!relation.isCascadeRemove)
                                            return [2 /*return*/];
                                        return [4 /*yield*/, this.connection
                                                .getRepository(valueMetadata.target)
                                                .createQueryBuilder(qbAlias, this.queryRunnerProvider)
                                                .innerJoin(relation.junctionEntityMetadata.table.name, "persistenceJoinedRelation", escapeAlias("persistenceJoinedRelation") + "." + escapeColumn(relation.joinTable.joinColumnName) + "=" + escapeAlias(qbAlias) + "." + escapeColumn(relation.joinTable.referencedColumn.name) +
                                                " AND " + escapeAlias("persistenceJoinedRelation") + "." + escapeColumn(relation.inverseRelation.joinTable.inverseJoinColumnName) + "=:id")
                                                .setParameter("id", relationIdInDatabaseEntity)
                                                .enableOption("RELATION_ID_VALUES")
                                                .getMany()];
                                    case 11:
                                        databaseEntities_1 = _a.sent();
                                        return [3 /*break*/, 14];
                                    case 12:
                                        relationIdInDatabaseEntity = subject.databaseEntity[relation.inverseRelation.joinColumn.referencedColumn.propertyName];
                                        return [4 /*yield*/, this.connection
                                                .getRepository(valueMetadata.target)
                                                .createQueryBuilder(qbAlias, this.queryRunnerProvider)
                                                .where(qbAlias + "." + relation.inverseSideProperty + "=:id")
                                                .setParameter("id", relationIdInDatabaseEntity)
                                                .enableOption("RELATION_ID_VALUES")
                                                .getMany()];
                                    case 13:
                                        // in this case we need inverse entities not only because of cascade removes
                                        // because we also need inverse entities to be able to perform update of entities
                                        // in the inverse side when entities is detached from one-to-many relation
                                        databaseEntities_1 = _a.sent();
                                        _a.label = 14;
                                    case 14:
                                        // add to loadMap loaded entities if some of them are missing
                                        databaseEntities_1.forEach(function (databaseEntity) {
                                            var subjectInLoadMap = _this.findByEntityLike(valueMetadata.target, databaseEntity);
                                            if (subjectInLoadMap && !subjectInLoadMap.hasDatabaseEntity) {
                                                subjectInLoadMap.databaseEntity = databaseEntity;
                                            }
                                            else if (!subjectInLoadMap) {
                                                var subject_1 = new Subject_1.Subject(valueMetadata, undefined, databaseEntity);
                                                _this.operateSubjects.push(subject_1);
                                            }
                                        });
                                        if (!(relation.isOneToMany && persistValue_1)) return [3 /*break*/, 16];
                                        promises_1 = persistValue_1.map(function (persistValue) { return __awaiter(_this, void 0, void 0, function () {
                                            var persistedValueInDatabaseEntity, loadedSubject, id, databaseEntity;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        persistedValueInDatabaseEntity = databaseEntities_1.find(function (databaseEntity) {
                                                            return valueMetadata.compareEntities(persistValue, databaseEntity);
                                                        });
                                                        if (!!persistedValueInDatabaseEntity) return [3 /*break*/, 3];
                                                        loadedSubject = this.findByDatabaseEntityLike(valueMetadata.target, persistValue);
                                                        if (!!loadedSubject) return [3 /*break*/, 2];
                                                        id = valueMetadata.getEntityIdMixedMap(persistValue);
                                                        if (!id) return [3 /*break*/, 2];
                                                        return [4 /*yield*/, this.connection
                                                                .getRepository(valueMetadata.target)
                                                                .createQueryBuilder(qbAlias, this.queryRunnerProvider)
                                                                .andWhereInIds([id])
                                                                .enableOption("RELATION_ID_VALUES")
                                                                .getOne()];
                                                    case 1:
                                                        databaseEntity = _a.sent();
                                                        if (databaseEntity) {
                                                            loadedSubject = new Subject_1.Subject(valueMetadata, undefined, databaseEntity); // todo: what if entity like object exist in the loaded subjects but without databaseEntity?
                                                            this.operateSubjects.push(loadedSubject);
                                                        }
                                                        _a.label = 2;
                                                    case 2:
                                                        if (loadedSubject)
                                                            loadedSubject.relationUpdates.push({
                                                                relation: relation.inverseRelation,
                                                                value: subject.entity
                                                            });
                                                        _a.label = 3;
                                                    case 3: return [2 /*return*/];
                                                }
                                            });
                                        }); });
                                        return [4 /*yield*/, Promise.all(promises_1)];
                                    case 15:
                                        _a.sent();
                                        _a.label = 16;
                                    case 16:
                                        promises_2 = databaseEntities_1.map(function (databaseEntity) { return __awaiter(_this, void 0, void 0, function () {
                                            var relatedEntitySubject, relatedValue;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        relatedEntitySubject = this.findByDatabaseEntityLike(valueMetadata.target, databaseEntity);
                                                        if (!relatedEntitySubject)
                                                            return [2 /*return*/]; // should not be possible, anyway add it for type-safety
                                                        // if object is already marked as removed then no need to proceed because it already was proceed
                                                        // if we remove this check it will cause a recursion
                                                        if (relatedEntitySubject.mustBeRemoved)
                                                            return [2 /*return*/]; // todo: add another check for entity in unsetRelations?
                                                        relatedValue = (persistValue_1 || []).find(function (persistValueItem) {
                                                            return valueMetadata.compareEntities(relatedEntitySubject.databaseEntity, persistValueItem);
                                                        });
                                                        if (!(persistValue_1 === null || !relatedValue)) return [3 /*break*/, 3];
                                                        if (!relation.isCascadeRemove) return [3 /*break*/, 2];
                                                        relatedEntitySubject.mustBeRemoved = true;
                                                        // mark as removed all underlying entities that has cascade remove
                                                        return [4 /*yield*/, this.buildCascadeRemovedAndRelationUpdateOperateSubjects(relatedEntitySubject)];
                                                    case 1:
                                                        // mark as removed all underlying entities that has cascade remove
                                                        _a.sent();
                                                        return [3 /*break*/, 3];
                                                    case 2:
                                                        if (relation.isOneToMany && relation.inverseRelation) {
                                                            relatedEntitySubject.relationUpdates.push({
                                                                relation: relation.inverseRelation,
                                                                value: null
                                                            }); // todo: implement same for one-to-one
                                                        }
                                                        _a.label = 3;
                                                    case 3: return [2 /*return*/];
                                                }
                                            });
                                        }); });
                                        return [4 /*yield*/, Promise.all(promises_2)];
                                    case 17:
                                        _a.sent();
                                        _a.label = 18;
                                    case 18: return [2 /*return*/];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Builds all junction insert and remove operations used to insert new bind data into junction tables,
     * or remove old junction records.
     * Options specifies which junction operations should be built - insert, remove or both.
     */
    SubjectBuilder.prototype.buildJunctionOperations = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var promises;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises = this.operateSubjects.filter(function (subject) { return subject.hasEntity; }).map(function (subject) {
                            var promises = subject.metadata.manyToManyRelations.map(function (relation) { return __awaiter(_this, void 0, void 0, function () {
                                var specificRepository, existInverseEntityRelationIds_1, relatedValue, existInverseEntityRelationIds, specificRepository, changedInverseEntityRelationIds, removedJunctionEntityIds, newJunctionEntities;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!(subject.mustBeRemoved && options.remove)) return [3 /*break*/, 2];
                                            specificRepository = new SpecificRepository_1.SpecificRepository(this.connection, subject.metadata, this.queryRunnerProvider);
                                            return [4 /*yield*/, specificRepository
                                                    .findRelationIds(relation, subject.databaseEntity)];
                                        case 1:
                                            existInverseEntityRelationIds_1 = _a.sent();
                                            // finally create a new junction remove operation and push it to the array of such operations
                                            if (existInverseEntityRelationIds_1.length > 0) {
                                                subject.junctionRemoves.push({
                                                    relation: relation,
                                                    junctionRelationIds: existInverseEntityRelationIds_1
                                                });
                                            }
                                            return [2 /*return*/];
                                        case 2:
                                            // if entity don't have entity then no need to find something that should be inserted or removed
                                            if (!subject.hasEntity)
                                                return [2 /*return*/];
                                            relatedValue = relation.getEntityValue(subject.entity);
                                            if (!(relatedValue instanceof Array))
                                                return [2 /*return*/];
                                            existInverseEntityRelationIds = [];
                                            if (!subject.hasDatabaseEntity) return [3 /*break*/, 4];
                                            specificRepository = new SpecificRepository_1.SpecificRepository(this.connection, subject.metadata, this.queryRunnerProvider);
                                            return [4 /*yield*/, specificRepository
                                                    .findRelationIds(relation, subject.databaseEntity)];
                                        case 3:
                                            existInverseEntityRelationIds = _a.sent();
                                            _a.label = 4;
                                        case 4:
                                            changedInverseEntityRelationIds = relatedValue
                                                .map(function (subRelationValue) {
                                                return relation.isManyToManyOwner
                                                    ? subRelationValue[relation.joinTable.inverseReferencedColumn.propertyName]
                                                    : subRelationValue[relation.inverseRelation.joinTable.referencedColumn.propertyName];
                                            })
                                                .filter(function (subRelationValue) { return subRelationValue !== undefined && subRelationValue !== null; });
                                            removedJunctionEntityIds = existInverseEntityRelationIds.filter(function (existRelationId) {
                                                return !changedInverseEntityRelationIds.find(function (changedRelationId) {
                                                    return changedRelationId === existRelationId;
                                                });
                                            });
                                            newJunctionEntities = relatedValue.filter(function (subRelatedValue) {
                                                var relationValue = relation.isManyToManyOwner
                                                    ? subRelatedValue[relation.joinTable.inverseReferencedColumn.propertyName]
                                                    : subRelatedValue[relation.inverseRelation.joinTable.referencedColumn.propertyName];
                                                return !existInverseEntityRelationIds.find(function (relationId) { return relationValue === relationId; });
                                            });
                                            // finally create a new junction insert operation and push it to the array of such operations
                                            if (newJunctionEntities.length > 0 && options.insert) {
                                                subject.junctionInserts.push({
                                                    relation: relation,
                                                    junctionEntities: newJunctionEntities
                                                });
                                            }
                                            // finally create a new junction remove operation and push it to the array of such operations
                                            if (removedJunctionEntityIds.length > 0 && options.remove) {
                                                subject.junctionRemoves.push({
                                                    relation: relation,
                                                    junctionRelationIds: removedJunctionEntityIds
                                                });
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                            return Promise.all(promises);
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
     * Finds subject where entity like given subject's entity.
     * Comparision made by entity id.
     */
    SubjectBuilder.prototype.findByEntityLike = function (entityTarget, entity) {
        return this.operateSubjects.find(function (subject) {
            if (!subject.hasEntity)
                return false;
            if (subject.entity === entity)
                return true;
            return subject.entityTarget === entityTarget && subject.metadata.compareEntities(subject.entity, entity);
        });
    };
    /**
     * Finds subject where entity like given subject's database entity.
     * Comparision made by entity id.
     */
    SubjectBuilder.prototype.findByDatabaseEntityLike = function (entityTarget, entity) {
        return this.operateSubjects.find(function (subject) {
            if (!subject.hasDatabaseEntity)
                return false;
            return subject.entityTarget === entityTarget && subject.metadata.compareEntities(subject.databaseEntity, entity);
        });
    };
    /**
     * Groups given Subject objects into groups separated by entity targets.
     */
    SubjectBuilder.prototype.groupByEntityTargets = function () {
        return this.operateSubjects.reduce(function (groups, operatedEntity) {
            var group = groups.find(function (group) { return group.target === operatedEntity.entityTarget; });
            if (!group) {
                group = { target: operatedEntity.entityTarget, subjects: [] };
                groups.push(group);
            }
            group.subjects.push(operatedEntity);
            return groups;
        }, []);
    };
    return SubjectBuilder;
}());
exports.SubjectBuilder = SubjectBuilder;

//# sourceMappingURL=SubjectBuilder.js.map
