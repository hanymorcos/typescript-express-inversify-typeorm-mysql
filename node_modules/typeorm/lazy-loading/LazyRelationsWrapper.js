"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var QueryBuilder_1 = require("../query-builder/QueryBuilder");
/**
 * This class wraps entities and provides functions there to lazily load its relations.
 */
var LazyRelationsWrapper = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function LazyRelationsWrapper(connection) {
        this.connection = connection;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    LazyRelationsWrapper.prototype.wrap = function (object, relation) {
        var connection = this.connection;
        var index = "__" + relation.propertyName + "__";
        var promiseIndex = "__promise__" + relation.propertyName + "__";
        var resolveIndex = "__has__" + relation.propertyName + "__";
        Object.defineProperty(object, relation.propertyName, {
            get: function () {
                var _this = this;
                if (this[resolveIndex] === true)
                    return Promise.resolve(this[index]);
                if (this[promiseIndex])
                    return this[promiseIndex];
                // create shortcuts for better readability
                var escapeAlias = function (alias) { return connection.driver.escapeAliasName(alias); };
                var escapeColumn = function (column) { return connection.driver.escapeColumnName(column); };
                var qb = new QueryBuilder_1.QueryBuilder(connection);
                if (relation.isManyToMany) {
                    if (relation.isManyToManyOwner) {
                        qb.select(relation.propertyName)
                            .from(relation.type, relation.propertyName)
                            .innerJoin(relation.junctionEntityMetadata.table.name, relation.junctionEntityMetadata.table.name, escapeAlias(relation.junctionEntityMetadata.table.name) + "." + escapeColumn(relation.joinTable.joinColumnName) + "=:" + relation.propertyName + "Id AND " +
                            (escapeAlias(relation.junctionEntityMetadata.table.name) + "." + escapeColumn(relation.joinTable.inverseJoinColumnName) + "=" + escapeAlias(relation.propertyName) + "." + escapeColumn(relation.joinTable.referencedColumn.propertyName)))
                            .setParameter(relation.propertyName + "Id", this[relation.referencedColumn.propertyName]);
                    }
                    else {
                        qb.select(relation.propertyName)
                            .from(relation.type, relation.propertyName)
                            .innerJoin(relation.junctionEntityMetadata.table.name, relation.junctionEntityMetadata.table.name, escapeAlias(relation.junctionEntityMetadata.table.name) + "." + escapeColumn(relation.inverseRelation.joinTable.inverseJoinColumnName) + "=:" + relation.propertyName + "Id AND " +
                            (escapeAlias(relation.junctionEntityMetadata.table.name) + "." + escapeColumn(relation.inverseRelation.joinTable.joinColumnName) + "=" + escapeAlias(relation.propertyName) + "." + escapeColumn(relation.inverseRelation.joinTable.referencedColumn.propertyName)))
                            .setParameter(relation.propertyName + "Id", this[relation.inverseRelation.referencedColumn.propertyName]);
                    }
                    this[promiseIndex] = qb.getMany().then(function (results) {
                        _this[index] = results;
                        _this[resolveIndex] = true;
                        delete _this[promiseIndex];
                        return _this[index];
                    }).catch(function (err) {
                        throw err;
                    });
                    return this[promiseIndex];
                }
                else if (relation.isOneToMany) {
                    qb.select(relation.propertyName)
                        .from(relation.inverseRelation.entityMetadata.target, relation.propertyName)
                        .innerJoin(relation.propertyName + "." + relation.inverseRelation.propertyName, relation.entityMetadata.targetName)
                        .where(relation.entityMetadata.targetName + "." + relation.inverseEntityMetadata.firstPrimaryColumn.propertyName + "=:id", { id: relation.entityMetadata.getEntityIdMixedMap(this) });
                    this[promiseIndex] = qb.getMany().then(function (results) {
                        _this[index] = results;
                        _this[resolveIndex] = true;
                        delete _this[promiseIndex];
                        return _this[index];
                    }).catch(function (err) {
                        throw err;
                    });
                    return this[promiseIndex];
                }
                else {
                    if (relation.hasInverseSide) {
                        qb.select(relation.propertyName)
                            .from(relation.inverseRelation.entityMetadata.target, relation.propertyName)
                            .innerJoin(relation.propertyName + "." + relation.inverseRelation.propertyName, relation.entityMetadata.targetName)
                            .where(relation.entityMetadata.targetName + "." + relation.joinColumn.referencedColumn.name + "=:id", { id: relation.entityMetadata.getEntityIdMixedMap(this) }); // is referenced column usage is correct here?
                    }
                    else {
                        // (ow) post.category<=>category.post
                        // loaded: category from post
                        // example: SELECT category.id AS category_id, category.name AS category_name FROM category category
                        //              INNER JOIN post Post ON Post.category=category.id WHERE Post.id=1
                        qb.select(relation.propertyName) // category
                            .from(relation.type, relation.propertyName) // Category, category
                            .innerJoin(relation.entityMetadata.target, relation.entityMetadata.name, escapeAlias(relation.entityMetadata.name) + "." + escapeColumn(relation.propertyName) + "=" + escapeAlias(relation.propertyName) + "." + escapeColumn(relation.referencedColumn.propertyName))
                            .where(relation.entityMetadata.name + "." + relation.joinColumn.referencedColumn.name + "=:id", { id: relation.entityMetadata.getEntityIdMixedMap(this) }); // is referenced column usage is correct here?
                    }
                    this[promiseIndex] = qb.getOne().then(function (result) {
                        _this[index] = result;
                        _this[resolveIndex] = true;
                        delete _this[promiseIndex];
                        return _this[index];
                    }).catch(function (err) {
                        throw err;
                    });
                    return this[promiseIndex];
                }
            },
            set: function (promise) {
                var _this = this;
                if (promise instanceof Promise) {
                    promise.then(function (result) {
                        _this[index] = result;
                        _this[resolveIndex] = true;
                    });
                }
                else {
                    this[index] = promise;
                    this[resolveIndex] = true;
                }
            },
            configurable: true
        });
    };
    return LazyRelationsWrapper;
}());
exports.LazyRelationsWrapper = LazyRelationsWrapper;

//# sourceMappingURL=LazyRelationsWrapper.js.map
