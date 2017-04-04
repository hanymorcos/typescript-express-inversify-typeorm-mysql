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
var Alias_1 = require("./alias/Alias");
var AliasMap_1 = require("./alias/AliasMap");
var RawSqlResultsToEntityTransformer_1 = require("./transformer/RawSqlResultsToEntityTransformer");
var SqlServerDriver_1 = require("../driver/sqlserver/SqlServerDriver");
var QueryRunnerProvider_1 = require("../query-runner/QueryRunnerProvider");
/**
 * Allows to build complex sql queries in a fashion way and execute those queries.
 */
var QueryBuilder = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function QueryBuilder(connection, queryRunnerProvider) {
        this.connection = connection;
        this.queryRunnerProvider = queryRunnerProvider;
        this.type = "select";
        this.selects = [];
        this.joins = [];
        this.joinRelationIds = [];
        this.relationCountMetas = [];
        this.groupBys = [];
        this.wheres = [];
        this.havings = [];
        this.orderBys = {};
        this.parameters = {};
        this.ignoreParentTablesJoins = false;
        /**
         * Indicates if virtual columns should be included in entity result.
         */
        this.enableRelationIdValues = false;
        this.aliasMap = new AliasMap_1.AliasMap(connection);
    }
    Object.defineProperty(QueryBuilder.prototype, "alias", {
        // -------------------------------------------------------------------------
        // Accessors
        // -------------------------------------------------------------------------
        /**
         * Gets the main alias string used in this query builder.
         */
        get: function () {
            return this.aliasMap.mainAlias.name;
        },
        enumerable: true,
        configurable: true
    });
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Creates DELETE query.
     */
    QueryBuilder.prototype.delete = function () {
        this.type = "delete";
        return this;
    };
    /**
     * Creates UPDATE query and applies given update values.
     */
    QueryBuilder.prototype.update = function (tableNameOrEntityOrUpdateSet, maybeUpdateSet) {
        var updateSet = maybeUpdateSet ? maybeUpdateSet : tableNameOrEntityOrUpdateSet;
        if (tableNameOrEntityOrUpdateSet instanceof Function) {
            var aliasName = tableNameOrEntityOrUpdateSet.name;
            var aliasObj = new Alias_1.Alias(aliasName);
            aliasObj.target = tableNameOrEntityOrUpdateSet;
            this.aliasMap.addMainAlias(aliasObj);
            this.fromEntity = { alias: aliasObj };
        }
        else if (typeof tableNameOrEntityOrUpdateSet === "string") {
            this.fromTableName = tableNameOrEntityOrUpdateSet;
        }
        this.type = "update";
        this.updateQuerySet = updateSet;
        return this;
    };
    /**
     * Creates SELECT query and selects given data.
     * Replaces all old selections if they exist.
     */
    QueryBuilder.prototype.select = function (selection) {
        this.type = "select";
        if (selection) {
            if (selection instanceof Array) {
                this.selects = selection;
            }
            else {
                this.selects = [selection];
            }
        }
        return this;
    };
    /**
     * Adds new selection to the SELECT query.
     */
    QueryBuilder.prototype.addSelect = function (selection) {
        if (selection instanceof Array)
            this.selects = this.selects.concat(selection);
        else
            this.selects.push(selection);
        return this;
    };
    /**
     * Specifies FROM which entity's table select/update/delete will be executed.
     * Also sets a main string alias of the selection data.
     */
    QueryBuilder.prototype.from = function (entityTarget, alias) {
        var aliasObj = new Alias_1.Alias(alias);
        aliasObj.target = entityTarget;
        this.aliasMap.addMainAlias(aliasObj);
        this.fromEntity = { alias: aliasObj };
        return this;
    };
    /**
     * Specifies FROM which table select/update/delete will be executed.
     * Also sets a main string alias of the selection data.
     */
    QueryBuilder.prototype.fromTable = function (tableName, alias) {
        this.fromTableName = tableName;
        this.fromTableAlias = alias;
        return this;
    };
    /**
     * INNER JOINs (without selection).
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    QueryBuilder.prototype.innerJoin = function (entityOrProperty, alias, condition, options) {
        if (condition === void 0) { condition = ""; }
        return this.join("INNER", entityOrProperty, alias, condition, options);
    };
    /**
     * LEFT JOINs (without selection).
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    QueryBuilder.prototype.leftJoin = function (entityOrProperty, alias, condition, options) {
        if (condition === void 0) { condition = ""; }
        return this.join("LEFT", entityOrProperty, alias, condition, options);
    };
    /**
     * INNER JOINs and adds all selection properties to SELECT.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    QueryBuilder.prototype.innerJoinAndSelect = function (entityOrProperty, alias, condition, options) {
        if (condition === void 0) { condition = ""; }
        this.addSelect(alias);
        return this.join("INNER", entityOrProperty, alias, condition, options);
    };
    /**
     * LEFT JOINs and adds all selection properties to SELECT.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    QueryBuilder.prototype.leftJoinAndSelect = function (entityOrProperty, alias, condition, options) {
        if (condition === void 0) { condition = ""; }
        this.addSelect(alias);
        return this.join("LEFT", entityOrProperty, alias, condition, options);
    };
    /**
     * INNER JOINs, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there are multiple rows of selecting data, and mapped result will be an array.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    QueryBuilder.prototype.innerJoinAndMapMany = function (mapToProperty, entityOrProperty, alias, condition, options) {
        if (condition === void 0) { condition = ""; }
        this.addSelect(alias);
        return this.join("INNER", entityOrProperty, alias, condition, options, mapToProperty, true);
    };
    /**
     * INNER JOINs, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there is a single row of selecting data, and mapped result will be a single selected value.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    QueryBuilder.prototype.innerJoinAndMapOne = function (mapToProperty, entityOrProperty, alias, condition, options) {
        if (condition === void 0) { condition = ""; }
        this.addSelect(alias);
        return this.join("INNER", entityOrProperty, alias, condition, options, mapToProperty, false);
    };
    /**
     * LEFT JOINs, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there are multiple rows of selecting data, and mapped result will be an array.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    QueryBuilder.prototype.leftJoinAndMapMany = function (mapToProperty, entityOrProperty, alias, condition, options) {
        if (condition === void 0) { condition = ""; }
        this.addSelect(alias);
        return this.join("LEFT", entityOrProperty, alias, condition, options, mapToProperty, true);
    };
    /**
     * LEFT JOINs, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there is a single row of selecting data, and mapped result will be a single selected value.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    QueryBuilder.prototype.leftJoinAndMapOne = function (mapToProperty, entityOrProperty, alias, condition, options) {
        if (condition === void 0) { condition = ""; }
        this.addSelect(alias);
        return this.join("LEFT", entityOrProperty, alias, condition, options, mapToProperty, false);
    };
    /**
     * LEFT JOINs relation id.
     * Optionally, you can add condition and parameters used in condition.
     *
     * @experimental
     */
    QueryBuilder.prototype.leftJoinRelationId = function (property, condition) {
        return this.joinRelationId("LEFT", undefined, property, condition);
    };
    /**
     * INNER JOINs relation id.
     * Optionally, you can add condition and parameters used in condition.
     *
     * @experimental
     */
    QueryBuilder.prototype.innerJoinRelationId = function (property, condition) {
        return this.joinRelationId("INNER", undefined, property, condition);
    };
    /**
     * LEFT JOINs relation id and maps it into some entity's property.
     * Optionally, you can add condition and parameters used in condition.
     *
     * @experimental
     */
    QueryBuilder.prototype.leftJoinRelationIdAndMap = function (mapToProperty, property, condition) {
        if (condition === void 0) { condition = ""; }
        return this.joinRelationId("INNER", mapToProperty, property, condition);
    };
    /**
     * INNER JOINs relation id and maps it into some entity's property.
     * Optionally, you can add condition and parameters used in condition.
     *
     * @experimental
     */
    QueryBuilder.prototype.innerJoinRelationIdAndMap = function (mapToProperty, property, condition) {
        if (condition === void 0) { condition = ""; }
        return this.joinRelationId("INNER", mapToProperty, property, condition);
    };
    /**
     * Counts number of entities of entity's relation.
     * Optionally, you can add condition and parameters used in condition.
     *
     * @experimental
     */
    QueryBuilder.prototype.countRelation = function (property, condition) {
        if (condition === void 0) { condition = ""; }
        var _a = property.split("."), parentAliasName = _a[0], parentPropertyName = _a[1];
        var alias = parentAliasName + "_" + parentPropertyName + "_relation_count";
        var aliasObj = new Alias_1.Alias(alias);
        this.aliasMap.addAlias(aliasObj);
        aliasObj.parentAliasName = parentAliasName;
        aliasObj.parentPropertyName = parentPropertyName;
        var relationCountMeta = {
            condition: condition,
            alias: aliasObj,
            entities: []
        };
        this.relationCountMetas.push(relationCountMeta);
        return this;
    };
    /**
     * Counts number of entities of entity's relation and maps the value into some entity's property.
     * Optionally, you can add condition and parameters used in condition.
     *
     * @experimental
     */
    QueryBuilder.prototype.countRelationAndMap = function (mapProperty, property, condition) {
        if (condition === void 0) { condition = ""; }
        var _a = property.split("."), parentAliasName = _a[0], parentPropertyName = _a[1];
        var alias = parentAliasName + "_" + parentPropertyName + "_relation_count";
        var aliasObj = new Alias_1.Alias(alias);
        this.aliasMap.addAlias(aliasObj);
        aliasObj.parentAliasName = parentAliasName;
        aliasObj.parentPropertyName = parentPropertyName;
        var relationCountMeta = {
            mapToProperty: mapProperty,
            condition: condition,
            alias: aliasObj,
            entities: []
        };
        this.relationCountMetas.push(relationCountMeta);
        return this;
    };
    /**
     * Sets WHERE condition in the query builder.
     * If you had previously WHERE expression defined,
     * calling this function will override previously set WHERE conditions.
     * Additionally you can add parameters used in where expression.
     */
    QueryBuilder.prototype.where = function (where, parameters) {
        this.wheres.push({ type: "simple", condition: where });
        if (parameters)
            this.setParameters(parameters);
        return this;
    };
    /**
     * Adds new AND WHERE condition in the query builder.
     * Additionally you can add parameters used in where expression.
     */
    QueryBuilder.prototype.andWhere = function (where, parameters) {
        this.wheres.push({ type: "and", condition: where });
        if (parameters)
            this.setParameters(parameters);
        return this;
    };
    /**
     * Adds new AND WHERE with conditions for the given ids.
     *
     * @experimental Maybe this method should be moved to repository?
     */
    QueryBuilder.prototype.andWhereInIds = function (ids) {
        var _a = this.createWhereIdsExpression(ids), whereExpression = _a[0], parameters = _a[1];
        this.andWhere(whereExpression, parameters);
        return this;
    };
    /**
     * Adds new OR WHERE condition in the query builder.
     * Additionally you can add parameters used in where expression.
     */
    QueryBuilder.prototype.orWhere = function (where, parameters) {
        this.wheres.push({ type: "or", condition: where });
        if (parameters)
            this.setParameters(parameters);
        return this;
    };
    /**
     * Adds new OR WHERE with conditions for the given ids.
     *
     * @experimental Maybe this method should be moved to repository?
     */
    QueryBuilder.prototype.orWhereInIds = function (ids) {
        var _a = this.createWhereIdsExpression(ids), whereExpression = _a[0], parameters = _a[1];
        this.orWhere(whereExpression, parameters);
        return this;
    };
    /**
     * Sets HAVING condition in the query builder.
     * If you had previously HAVING expression defined,
     * calling this function will override previously set HAVING conditions.
     * Additionally you can add parameters used in where expression.
     */
    QueryBuilder.prototype.having = function (having, parameters) {
        this.havings.push({ type: "simple", condition: having });
        if (parameters)
            this.setParameters(parameters);
        return this;
    };
    /**
     * Adds new AND HAVING condition in the query builder.
     * Additionally you can add parameters used in where expression.
     */
    QueryBuilder.prototype.andHaving = function (having, parameters) {
        this.havings.push({ type: "and", condition: having });
        if (parameters)
            this.setParameters(parameters);
        return this;
    };
    /**
     * Adds new OR HAVING condition in the query builder.
     * Additionally you can add parameters used in where expression.
     */
    QueryBuilder.prototype.orHaving = function (having, parameters) {
        this.havings.push({ type: "or", condition: having });
        if (parameters)
            this.setParameters(parameters);
        return this;
    };
    /**
     * Sets GROUP BY condition in the query builder.
     * If you had previously GROUP BY expression defined,
     * calling this function will override previously set GROUP BY conditions.
     */
    QueryBuilder.prototype.groupBy = function (groupBy) {
        this.groupBys = [groupBy];
        return this;
    };
    /**
     * Adds GROUP BY condition in the query builder.
     */
    QueryBuilder.prototype.addGroupBy = function (groupBy) {
        this.groupBys.push(groupBy);
        return this;
    };
    /**
     * Sets ORDER BY condition in the query builder.
     * If you had previously ORDER BY expression defined,
     * calling this function will override previously set ORDER BY conditions.
     */
    QueryBuilder.prototype.orderBy = function (sort, order) {
        if (order === void 0) { order = "ASC"; }
        this.orderBys = (_a = {}, _a[sort] = order, _a);
        return this;
        var _a;
    };
    /**
     * Adds ORDER BY condition in the query builder.
     */
    QueryBuilder.prototype.addOrderBy = function (sort, order) {
        if (order === void 0) { order = "ASC"; }
        this.orderBys[sort] = order;
        return this;
    };
    /**
     * Set's LIMIT - maximum number of rows to be selected.
     * NOTE that it may not work as you expect if you are using joins.
     * If you want to implement pagination, and you are having join in your query,
     * then use instead setMaxResults instead.
     */
    QueryBuilder.prototype.setLimit = function (limit) {
        this.limit = limit;
        return this;
    };
    /**
     * Set's OFFSET - selection offset.
     * NOTE that it may not work as you expect if you are using joins.
     * If you want to implement pagination, and you are having join in your query,
     * then use instead setFirstResult instead.
     */
    QueryBuilder.prototype.setOffset = function (offset) {
        this.offset = offset;
        return this;
    };
    /**
     * Set's maximum number of entities to be selected.
     */
    QueryBuilder.prototype.setMaxResults = function (maxResults) {
        this.maxResults = maxResults;
        return this;
    };
    /**
     * Set's offset of entities to be selected.
     */
    QueryBuilder.prototype.setFirstResult = function (firstResult) {
        this.firstResult = firstResult;
        return this;
    };
    /**
     * Sets given parameter's value.
     */
    QueryBuilder.prototype.setParameter = function (key, value) {
        this.parameters[key] = value;
        return this;
    };
    /**
     * Adds all parameters from the given object.
     * Unlike setParameters method it does not clear all previously set parameters.
     */
    QueryBuilder.prototype.setParameters = function (parameters) {
        var _this = this;
        Object.keys(parameters).forEach(function (key) {
            _this.parameters[key] = parameters[key];
        });
        return this;
    };
    /**
     * Adds all parameters from the given object.
     * Unlike setParameters method it does not clear all previously set parameters.
     *
     * @deprecated use setParameters instead
     */
    QueryBuilder.prototype.addParameters = function (parameters) {
        var _this = this;
        Object.keys(parameters).forEach(function (key) {
            _this.parameters[key] = parameters[key];
        });
        return this;
    };
    /**
     * Gets all parameters.
     */
    QueryBuilder.prototype.getParameters = function () {
        var parameters = Object.assign({}, this.parameters);
        // add discriminator column parameter if it exist
        if (!this.fromTableName) {
            var mainMetadata = this.connection.getMetadata(this.aliasMap.mainAlias.target);
            if (mainMetadata.hasDiscriminatorColumn)
                parameters["discriminatorColumnValue"] = mainMetadata.discriminatorValue;
        }
        return parameters;
    };
    /**
     * Gets generated sql that will be executed.
     * Parameters in the query are escaped for the currently used driver.
     */
    QueryBuilder.prototype.getSql = function () {
        var sql = this.createSelectExpression();
        sql += this.createJoinExpression();
        sql += this.createJoinRelationIdsExpression();
        sql += this.createWhereExpression();
        sql += this.createGroupByExpression();
        sql += this.createHavingExpression();
        sql += this.createOrderByExpression();
        sql += this.createLimitExpression();
        sql += this.createOffsetExpression();
        sql = this.connection.driver.escapeQueryWithParameters(sql, this.parameters)[0];
        return sql;
    };
    /**
     * Gets generated sql without parameters being replaced.
     *
     * @experimental
     */
    QueryBuilder.prototype.getGeneratedQuery = function () {
        var sql = this.createSelectExpression();
        sql += this.createJoinExpression();
        sql += this.createJoinRelationIdsExpression();
        sql += this.createWhereExpression();
        sql += this.createGroupByExpression();
        sql += this.createHavingExpression();
        sql += this.createOrderByExpression();
        sql += this.createLimitExpression();
        sql += this.createOffsetExpression();
        return sql;
    };
    /**
     * Gets sql to be executed with all parameters used in it.
     *
     * @experimental
     */
    QueryBuilder.prototype.getSqlWithParameters = function (options) {
        var sql = this.createSelectExpression();
        sql += this.createJoinExpression();
        sql += this.createJoinRelationIdsExpression();
        sql += this.createWhereExpression();
        sql += this.createGroupByExpression();
        sql += this.createHavingExpression();
        if (!options || !options.skipOrderBy)
            sql += this.createOrderByExpression();
        sql += this.createLimitExpression();
        sql += this.createOffsetExpression();
        return this.connection.driver.escapeQueryWithParameters(sql, this.getParameters());
    };
    /**
     * Executes sql generated by query builder and returns raw database results.
     */
    QueryBuilder.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var queryRunner, _a, sql, parameters;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getQueryRunner()];
                    case 1:
                        queryRunner = _b.sent();
                        _a = this.getSqlWithParameters(), sql = _a[0], parameters = _a[1];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, , 4, 7]);
                        return [4 /*yield*/, queryRunner.query(sql, parameters)];
                    case 3: return [2 /*return*/, _b.sent()]; // await is needed here because we are using finally
                    case 4:
                        if (!this.hasOwnQueryRunner()) return [3 /*break*/, 6];
                        return [4 /*yield*/, queryRunner.release()];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6: return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Executes sql generated by query builder and returns object with raw results and entities created from them.
     */
    QueryBuilder.prototype.getEntitiesAndRawResults = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var queryRunner, mainAliasName, rawResults, _a, sql, parameters, _b, selects, orderBys, distinctAlias_1, metadata_1, idsQuery, _c, sql, parameters;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!this.aliasMap.hasMainAlias)
                            throw new Error("Alias is not set. Looks like nothing is selected. Use select*, delete, update method to set an alias.");
                        return [4 /*yield*/, this.getQueryRunner()];
                    case 1:
                        queryRunner = _d.sent();
                        mainAliasName = this.fromTableName ? this.fromTableName : this.aliasMap.mainAlias.name;
                        if (!(this.firstResult || this.maxResults)) return [3 /*break*/, 8];
                        _a = this.getSqlWithParameters({ skipOrderBy: true }), sql = _a[0], parameters = _a[1];
                        _b = this.createOrderByCombinedWithSelectExpression("distinctAlias"), selects = _b[0], orderBys = _b[1];
                        distinctAlias_1 = this.connection.driver.escapeTableName("distinctAlias");
                        metadata_1 = this.connection.getMetadata(this.fromEntity.alias.target);
                        idsQuery = "SELECT ";
                        idsQuery += metadata_1.primaryColumns.map(function (primaryColumn, index) {
                            var propertyName = _this.connection.driver.escapeAliasName(mainAliasName + "_" + primaryColumn.name);
                            if (index === 0) {
                                return "DISTINCT(" + distinctAlias_1 + "." + propertyName + ") as ids_" + primaryColumn.name;
                            }
                            else {
                                return distinctAlias_1 + "." + propertyName + ") as ids_" + primaryColumn.name;
                            }
                        }).join(", ");
                        if (selects.length > 0)
                            idsQuery += ", " + selects;
                        idsQuery += " FROM (" + sql + ") " + distinctAlias_1; // TODO: WHAT TO DO WITH PARAMETERS HERE? DO THEY WORK?
                        if (orderBys.length > 0) {
                            idsQuery += " ORDER BY " + orderBys;
                        }
                        else {
                            idsQuery += " ORDER BY \"ids_" + metadata_1.firstPrimaryColumn.name + "\""; // this is required for mssql driver if firstResult is used. Other drivers don't care about it
                        }
                        if (this.connection.driver instanceof SqlServerDriver_1.SqlServerDriver) {
                            if (this.firstResult || this.maxResults) {
                                idsQuery += " OFFSET " + (this.firstResult || 0) + " ROWS";
                                if (this.maxResults)
                                    idsQuery += " FETCH NEXT " + this.maxResults + " ROWS ONLY";
                            }
                        }
                        else {
                            if (this.maxResults)
                                idsQuery += " LIMIT " + this.maxResults;
                            if (this.firstResult)
                                idsQuery += " OFFSET " + this.firstResult;
                        }
                        _d.label = 2;
                    case 2:
                        _d.trys.push([2, , 4, 7]);
                        return [4 /*yield*/, queryRunner.query(idsQuery, parameters)
                                .then(function (results) {
                                rawResults = results;
                                if (results.length === 0)
                                    return [];
                                var condition = "";
                                var parameters = {};
                                if (metadata_1.hasMultiplePrimaryKeys) {
                                    condition = results.map(function (result) {
                                        return metadata_1.primaryColumns.map(function (primaryColumn) {
                                            parameters["ids_" + primaryColumn.propertyName] = result["ids_" + primaryColumn.propertyName];
                                            return mainAliasName + "." + primaryColumn.propertyName + "=:ids_" + primaryColumn.propertyName;
                                        }).join(" AND ");
                                    }).join(" OR ");
                                }
                                else {
                                    var ids = results.map(function (result) { return result["ids_" + metadata_1.firstPrimaryColumn.propertyName]; });
                                    var areAllNumbers = ids.map(function (id) { return typeof id === "number"; });
                                    if (areAllNumbers) {
                                        // fixes #190. if all numbers then its safe to perform query without parameter
                                        condition = mainAliasName + "." + metadata_1.firstPrimaryColumn.propertyName + " IN (" + ids.join(", ") + ")";
                                    }
                                    else {
                                        parameters["ids"] = ids;
                                        condition = mainAliasName + "." + metadata_1.firstPrimaryColumn.propertyName + " IN (:ids)";
                                    }
                                }
                                var _a = _this.clone({ queryRunnerProvider: _this.queryRunnerProvider })
                                    .andWhere(condition, parameters)
                                    .getSqlWithParameters(), queryWithIdsSql = _a[0], queryWithIdsParameters = _a[1];
                                return queryRunner.query(queryWithIdsSql, queryWithIdsParameters);
                            })
                                .then(function (results) {
                                return _this.rawResultsToEntities(results);
                            })
                                .then(function (results) {
                                return _this.loadRelationCounts(queryRunner, results)
                                    .then(function (counts) {
                                    // console.log("counts: ", counts);
                                    return results;
                                });
                            })
                                .then(function (results) {
                                if (!_this.fromTableName)
                                    return _this.connection.broadcaster.broadcastLoadEventsForAll(_this.aliasMap.mainAlias.target, results).then(function () { return results; });
                                return results;
                            })
                                .then(function (results) {
                                return {
                                    entities: results,
                                    rawResults: rawResults
                                };
                            })];
                    case 3: return [2 /*return*/, _d.sent()];
                    case 4:
                        if (!this.hasOwnQueryRunner()) return [3 /*break*/, 6];
                        return [4 /*yield*/, queryRunner.release()];
                    case 5:
                        _d.sent();
                        _d.label = 6;
                    case 6: return [7 /*endfinally*/];
                    case 7: return [3 /*break*/, 14];
                    case 8:
                        _c = this.getSqlWithParameters(), sql = _c[0], parameters = _c[1];
                        _d.label = 9;
                    case 9:
                        _d.trys.push([9, , 11, 14]);
                        return [4 /*yield*/, queryRunner.query(sql, parameters)
                                .then(function (results) {
                                rawResults = results;
                                return _this.rawResultsToEntities(results);
                            })
                                .then(function (results) {
                                return _this.loadRelationCounts(queryRunner, results)
                                    .then(function (counts) {
                                    // console.log("counts: ", counts);
                                    return results;
                                });
                            })
                                .then(function (results) {
                                if (!_this.fromTableName) {
                                    return _this.connection.broadcaster
                                        .broadcastLoadEventsForAll(_this.aliasMap.mainAlias.target, results)
                                        .then(function () { return results; });
                                }
                                return results;
                            })
                                .then(function (results) {
                                return {
                                    entities: results,
                                    rawResults: rawResults
                                };
                            })];
                    case 10: 
                    // console.log(sql);
                    return [2 /*return*/, _d.sent()];
                    case 11:
                        if (!this.hasOwnQueryRunner()) return [3 /*break*/, 13];
                        return [4 /*yield*/, queryRunner.release()];
                    case 12:
                        _d.sent();
                        _d.label = 13;
                    case 13: return [7 /*endfinally*/];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Gets count - number of entities selected by sql generated by this query builder.
     * Count excludes all limitations set by setFirstResult and setMaxResults methods call.
     */
    QueryBuilder.prototype.getCount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var queryRunner, mainAlias, metadata, distinctAlias, countSql, countQuery, _a, countQuerySql, countQueryParameters, results;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getQueryRunner()];
                    case 1:
                        queryRunner = _b.sent();
                        mainAlias = this.fromTableName ? this.fromTableName : this.aliasMap.mainAlias.name;
                        metadata = this.connection.getMetadata(this.fromEntity.alias.target);
                        distinctAlias = this.connection.driver.escapeAliasName(mainAlias);
                        countSql = "COUNT(" + metadata.primaryColumnsWithParentIdColumns.map(function (primaryColumn, index) {
                            var propertyName = _this.connection.driver.escapeColumnName(primaryColumn.name);
                            if (index === 0) {
                                return "DISTINCT(" + distinctAlias + "." + propertyName + ")";
                            }
                            else {
                                return distinctAlias + "." + propertyName + ")";
                            }
                        }).join(", ") + ") as cnt";
                        countQuery = this
                            .clone({
                            queryRunnerProvider: this.queryRunnerProvider,
                            skipOrderBys: true,
                            ignoreParentTablesJoins: true,
                            skipLimit: true,
                            skipOffset: true
                        })
                            .select(countSql);
                        _a = countQuery.getSqlWithParameters(), countQuerySql = _a[0], countQueryParameters = _a[1];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, , 4, 7]);
                        return [4 /*yield*/, queryRunner.query(countQuerySql, countQueryParameters)];
                    case 3:
                        results = _b.sent();
                        if (!results || !results[0] || !results[0]["cnt"])
                            return [2 /*return*/, 0];
                        return [2 /*return*/, parseInt(results[0]["cnt"])];
                    case 4:
                        if (!this.hasOwnQueryRunner()) return [3 /*break*/, 6];
                        return [4 /*yield*/, queryRunner.release()];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6: return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Gets all raw results returned by execution of generated query builder sql.
     */
    QueryBuilder.prototype.getRawMany = function () {
        return this.execute();
    };
    /**
     * Gets first raw result returned by execution of generated query builder sql.
     */
    QueryBuilder.prototype.getRawOne = function () {
        return this.getRawMany().then(function (results) { return results[0]; });
    };
    /**
     * Gets entities and count returned by execution of generated query builder sql.
     */
    QueryBuilder.prototype.getManyAndCount = function () {
        // todo: share database connection and counter
        return Promise.all([
            this.getMany(),
            this.getCount()
        ]);
    };
    /**
     * Gets entities returned by execution of generated query builder sql.
     */
    QueryBuilder.prototype.getMany = function () {
        return this.getEntitiesAndRawResults().then(function (results) {
            return results.entities;
        });
    };
    /**
     * Gets single entity returned by execution of generated query builder sql.
     */
    QueryBuilder.prototype.getOne = function () {
        return this.getMany().then(function (entities) { return entities[0]; });
    };
    /**
     * Clones query builder as it is.
     */
    QueryBuilder.prototype.clone = function (options) {
        var _this = this;
        var qb = new QueryBuilder(this.connection, options ? options.queryRunnerProvider : undefined);
        if (options && options.ignoreParentTablesJoins)
            qb.ignoreParentTablesJoins = options.ignoreParentTablesJoins;
        switch (this.type) {
            case "select":
                qb.select(this.selects);
                break;
            case "update":
                qb.update(this.updateQuerySet);
                break;
            case "delete":
                qb.delete();
                break;
        }
        if (this.fromEntity && this.fromEntity.alias && this.fromEntity.alias.target) {
            qb.from(this.fromEntity.alias.target, this.fromEntity.alias.name);
        }
        else if (this.fromTableName) {
            qb.fromTable(this.fromTableName, this.fromTableAlias);
        }
        this.joins.forEach(function (join) {
            var property = join.tableName || join.alias.target || (join.alias.parentAliasName + "." + join.alias.parentPropertyName);
            qb.join(join.type, property, join.alias.name, join.condition || "", undefined, join.mapToProperty, join.isMappingMany);
        });
        this.groupBys.forEach(function (groupBy) { return qb.addGroupBy(groupBy); });
        this.wheres.forEach(function (where) {
            switch (where.type) {
                case "simple":
                    qb.where(where.condition);
                    break;
                case "and":
                    qb.andWhere(where.condition);
                    break;
                case "or":
                    qb.orWhere(where.condition);
                    break;
            }
        });
        this.havings.forEach(function (having) {
            switch (having.type) {
                case "simple":
                    qb.having(having.condition);
                    break;
                case "and":
                    qb.andHaving(having.condition);
                    break;
                case "or":
                    qb.orHaving(having.condition);
                    break;
            }
        });
        if (!options || !options.skipOrderBys)
            Object.keys(this.orderBys).forEach(function (columnName) { return qb.addOrderBy(columnName, _this.orderBys[columnName]); });
        Object.keys(this.parameters).forEach(function (key) { return qb.setParameter(key, _this.parameters[key]); });
        if (!options || !options.skipLimit)
            qb.setLimit(this.limit);
        if (!options || !options.skipOffset)
            qb.setOffset(this.offset);
        qb.setFirstResult(this.firstResult)
            .setMaxResults(this.maxResults);
        return qb;
    };
    /**
     * Enables special query builder options.
     */
    QueryBuilder.prototype.enableOption = function (option) {
        switch (option) {
            case "RELATION_ID_VALUES":
                this.enableRelationIdValues = true;
        }
        return this;
    };
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    QueryBuilder.prototype.loadRelationCounts = function (queryRunner, results) {
        var _this = this;
        var promises = this.relationCountMetas.map(function (relationCountMeta) {
            var parentAlias = relationCountMeta.alias.parentAliasName;
            var foundAlias = _this.aliasMap.findAliasByName(parentAlias);
            if (!foundAlias)
                throw new Error("Alias \"" + parentAlias + "\" was not found");
            var parentMetadata = _this.aliasMap.getEntityMetadataByAlias(foundAlias);
            if (!parentMetadata)
                throw new Error("Cannot get entity metadata for the given alias " + foundAlias.name);
            var relation = parentMetadata.findRelationWithPropertyName(relationCountMeta.alias.parentPropertyName);
            var queryBuilder = new QueryBuilder(_this.connection, _this.queryRunnerProvider);
            var condition = "";
            var metadata = _this.aliasMap.getEntityMetadataByAlias(relationCountMeta.alias);
            if (!metadata)
                throw new Error("Cannot get entity metadata for the given alias " + relationCountMeta.alias.name);
            var joinTableName = metadata.table.name;
            var junctionMetadata = relation.junctionEntityMetadata;
            var appendedCondition = relationCountMeta.condition ? " AND " + _this.replacePropertyNames(relationCountMeta.condition) : "";
            /*if (relation.isManyToMany) {
             const junctionTable = junctionMetadata.table.name;
             const junctionAlias = relationCountMeta.alias.parentAliasName + "_" + relationCountMeta.alias.name;
             const joinAlias = relationCountMeta.alias.name;
             const joinTable = relation.isOwning ? relation.joinTable : relation.inverseRelation.joinTable; // not sure if this is correct
             const joinTableColumn = joinTable.referencedColumn.name; // not sure if this is correct
             const inverseJoinColumnName = joinTable.inverseReferencedColumn.name; // not sure if this is correct

             let condition1 = "", condition2 = "";
             if (relation.isOwning) {
             condition1 = junctionAlias + "." + junctionMetadata.columns[0].name + "=" + parentAlias + "." + joinTableColumn;
             condition2 = joinAlias + "." + inverseJoinColumnName + "=" + junctionAlias + "." + junctionMetadata.columns[1].name;
             } else {
             condition1 = junctionAlias + "." + junctionMetadata.columns[1].name + "=" + parentAlias + "." + joinTableColumn;
             condition2 = joinAlias + "." + inverseJoinColumnName + "=" + junctionAlias + "." + junctionMetadata.columns[0].name;
             }

             condition = " LEFT JOIN " + junctionTable + " " + junctionAlias + " " + relationCountMeta.conditionType + " " + condition1 +
             " LEFT JOIN " + joinTableName + " " + joinAlias + " " + relationCountMeta.conditionType + " " + condition2 + appendedCondition;

             } else if (relation.isManyToOne || (relation.isOneToOne && relation.isOwning)) {
             const joinTableColumn = relation.joinColumn.referencedColumn.name;
             const condition2 = relationCountMeta.alias.name + "." + joinTableColumn + "=" + parentAlias + "." + relation.name;
             condition = " LEFT JOIN " + joinTableName + " " + relationCountMeta.alias.name + " " + relationCountMeta.conditionType + " " + condition2 + appendedCondition;

             } else {
             throw new Error(`Relation count can be applied only `); // this should be done on entity build
             }*/
            // if (relationCountMeta.condition)
            //     condition += relationCountMeta.condition;
            // relationCountMeta.alias.target;
            // todo: FIX primaryColumn usages
            var ids = relationCountMeta.entities
                .map(function (entityWithMetadata) { return entityWithMetadata.metadata.getEntityIdMap(entityWithMetadata.entity); })
                .filter(function (idMap) { return idMap !== undefined; })
                .map(function (idMap) { return idMap[parentMetadata.primaryColumn.propertyName]; });
            if (!ids || !ids.length)
                return Promise.resolve(); // todo: need to set zero to relationCount column in this case?
            return queryBuilder
                .select(parentMetadata.name + "." + parentMetadata.primaryColumn.propertyName + " AS id")
                .addSelect("COUNT(" + (_this.connection.driver.escapeAliasName(relation.propertyName) + "." + _this.connection.driver.escapeColumnName(relation.inverseEntityMetadata.primaryColumn.name)) + ") as cnt")
                .from(parentMetadata.target, parentMetadata.name)
                .leftJoin(parentMetadata.name + "." + relation.propertyName, relation.propertyName, relationCountMeta.condition)
                .setParameters(_this.parameters)
                .where(parentMetadata.name + "." + parentMetadata.primaryColumn.propertyName + " IN (:relationCountIds)", { relationCountIds: ids })
                .groupBy(parentMetadata.name + "." + parentMetadata.primaryColumn.propertyName)
                .getRawMany()
                .then(function (results) {
                // console.log(relationCountMeta.entities);
                relationCountMeta.entities.forEach(function (entityWithMetadata) {
                    var entityId = entityWithMetadata.entity[entityWithMetadata.metadata.primaryColumn.propertyName];
                    var entityResult = results.find(function (result) {
                        return entityId === _this.connection.driver.prepareHydratedValue(result.id, entityWithMetadata.metadata.primaryColumn);
                    });
                    if (entityResult) {
                        if (relationCountMeta.mapToProperty) {
                            var _a = relationCountMeta.mapToProperty.split("."), parentName = _a[0], propertyName = _a[1];
                            // todo: right now mapping is working only on the currently countRelation class, but
                            // different properties are working. make different classes to work too
                            entityWithMetadata.entity[propertyName] = parseInt(entityResult.cnt);
                        }
                        else if (relation.countField) {
                            entityWithMetadata.entity[relation.countField] = parseInt(entityResult.cnt);
                        }
                    }
                });
            });
        });
        return Promise.all(promises);
    };
    QueryBuilder.prototype.rawResultsToEntities = function (results) {
        var transformer = new RawSqlResultsToEntityTransformer_1.RawSqlResultsToEntityTransformer(this.connection.driver, this.aliasMap, this.extractJoinMappings(), this.relationCountMetas, this.enableRelationIdValues);
        return transformer.transform(results);
    };
    QueryBuilder.prototype.createSelectExpression = function () {
        // todo throw exception if selects or from is missing
        var _this = this;
        var alias = "", tableName;
        var allSelects = [];
        if (this.fromTableName) {
            tableName = this.fromTableName;
            alias = this.fromTableAlias;
            // console.log("ALIAS F:", alias);
        }
        else if (this.fromEntity) {
            var metadata = this.aliasMap.getEntityMetadataByAlias(this.fromEntity.alias);
            if (!metadata)
                throw new Error("Cannot get entity metadata for the given alias " + this.fromEntity.alias.name);
            tableName = metadata.table.name;
            alias = this.fromEntity.alias.name;
            // console.log("ALIAS N:", this.fromEntity.alias);
            // console.log("ALIAS N:", alias);
            // add select from the main table
            if (this.selects.indexOf(alias) !== -1) {
                metadata.columns.forEach(function (column) {
                    allSelects.push(_this.connection.driver.escapeAliasName(alias) + "." + _this.connection.driver.escapeColumnName(column.name) + " AS " + _this.connection.driver.escapeAliasName(alias + "_" + column.name));
                });
            }
        }
        else {
            throw new Error("No from given");
        }
        // add selects from joins
        this.joins
            .filter(function (join) { return _this.selects.indexOf(join.alias.name) !== -1; })
            .forEach(function (join) {
            var joinMetadata = _this.aliasMap.getEntityMetadataByAlias(join.alias);
            if (joinMetadata) {
                joinMetadata.columns.forEach(function (column) {
                    allSelects.push(_this.connection.driver.escapeAliasName(join.alias.name) + "." + _this.connection.driver.escapeColumnName(column.name) + " AS " + _this.connection.driver.escapeAliasName(join.alias.name + "_" + column.name));
                });
            }
            else {
                allSelects.push(_this.connection.driver.escapeAliasName(join.alias.name));
            }
        });
        if (!this.ignoreParentTablesJoins && !this.fromTableName) {
            var metadata = this.connection.getMetadata(this.aliasMap.mainAlias.target);
            if (metadata.parentEntityMetadata && metadata.parentIdColumns) {
                var alias_1 = "parentIdColumn_" + this.connection.driver.escapeAliasName(metadata.parentEntityMetadata.table.name);
                metadata.parentEntityMetadata.columns.forEach(function (column) {
                    allSelects.push(alias_1 + "." + _this.connection.driver.escapeColumnName(column.name) + " AS " + alias_1 + "_" + _this.connection.driver.escapeAliasName(column.name));
                });
            }
        }
        // add selects from relation id joins
        this.joinRelationIds.forEach(function (join) {
            // const joinMetadata = this.aliasMap.getEntityMetadataByAlias(join.alias);
            var parentAlias = join.alias.parentAliasName;
            var foundAlias = _this.aliasMap.findAliasByName(parentAlias);
            if (!foundAlias)
                throw new Error("Alias \"" + parentAlias + "\" was not found");
            var parentMetadata = _this.aliasMap.getEntityMetadataByAlias(foundAlias);
            if (!parentMetadata)
                throw new Error("Cannot get entity metadata for the given alias " + foundAlias.name);
            var relation = parentMetadata.findRelationWithPropertyName(join.alias.parentPropertyName);
            var junctionMetadata = relation.junctionEntityMetadata;
            // const junctionTable = junctionMetadata.table.name;
            junctionMetadata.columns.forEach(function (column) {
                allSelects.push(_this.connection.driver.escapeAliasName(join.alias.name) + "." + _this.connection.driver.escapeColumnName(column.name) + " AS " + _this.connection.driver.escapeAliasName(join.alias.name + "_" + column.name));
            });
        });
        //
        /*if (this.enableRelationIdValues) {
            const parentMetadata = this.aliasMap.getEntityMetadataByAlias(this.aliasMap.mainAlias);
            if (!parentMetadata)
                throw new Error("Cannot get entity metadata for the given alias " + this.aliasMap.mainAlias.name);

            const metadata = this.connection.entityMetadatas.findByTarget(this.aliasMap.mainAlias.target);
            metadata.manyToManyRelations.forEach(relation => {

                const junctionMetadata = relation.junctionEntityMetadata;
                junctionMetadata.columns.forEach(column => {
                    const select = this.connection.driver.escapeAliasName(this.aliasMap.mainAlias.name + "_" + junctionMetadata.table.name + "_ids") + "." +
                        this.connection.driver.escapeColumnName(column.name) + " AS " +
                        this.connection.driver.escapeAliasName(this.aliasMap.mainAlias.name + "_" + relation.name + "_ids_" + column.name);
                    allSelects.push(select);
                });
            });
        }*/
        // add all other selects
        this.selects.filter(function (select) {
            return select !== alias && !_this.joins.find(function (join) { return join.alias.name === select; });
        }).forEach(function (select) { return allSelects.push(_this.replacePropertyNames(select)); });
        // if still selection is empty, then simply set it to all (*)
        if (allSelects.length === 0)
            allSelects.push("*");
        // create a selection query
        switch (this.type) {
            case "select":
                return "SELECT " + allSelects.join(", ") + " FROM " + this.connection.driver.escapeTableName(tableName) + " " + this.connection.driver.escapeAliasName(alias);
            case "delete":
                return "DELETE FROM " + this.connection.driver.escapeTableName(tableName);
            // return "DELETE " + (alias ? this.connection.driver.escapeAliasName(alias) : "") + " FROM " + this.connection.driver.escapeTableName(tableName) + " " + (alias ? this.connection.driver.escapeAliasName(alias) : ""); // TODO: only mysql supports aliasing, so what to do with aliases in DELETE queries? right now aliases are used however we are relaying that they will always match a table names
            case "update":
                var updateSet = Object.keys(this.updateQuerySet).map(function (key) { return key + "=:updateQuerySet_" + key; });
                var params = Object.keys(this.updateQuerySet).reduce(function (object, key) {
                    // todo: map propertyNames to names ?
                    object["updateQuerySet_" + key] = _this.updateQuerySet[key];
                    return object;
                }, {});
                this.setParameters(params);
                return "UPDATE " + tableName + " " + (alias ? this.connection.driver.escapeAliasName(alias) : "") + " SET " + updateSet;
        }
        throw new Error("No query builder type is specified.");
    };
    QueryBuilder.prototype.createWhereExpression = function () {
        var _this = this;
        var conditions = this.wheres.map(function (where, index) {
            switch (where.type) {
                case "and":
                    return (index > 0 ? "AND " : "") + _this.replacePropertyNames(where.condition);
                case "or":
                    return (index > 0 ? "OR " : "") + _this.replacePropertyNames(where.condition);
                default:
                    return _this.replacePropertyNames(where.condition);
            }
        }).join(" ");
        if (!this.fromTableName) {
            var mainMetadata = this.connection.getMetadata(this.aliasMap.mainAlias.target);
            if (mainMetadata.hasDiscriminatorColumn)
                return " WHERE " + (conditions.length ? "(" + conditions + ") AND" : "") + " " + mainMetadata.discriminatorColumn.name + "=:discriminatorColumnValue";
        }
        if (!conditions.length)
            return "";
        return " WHERE " + conditions;
    };
    /**
     * Replaces all entity's propertyName to name in the given statement.
     */
    QueryBuilder.prototype.replacePropertyNames = function (statement) {
        var _this = this;
        this.aliasMap.aliases.forEach(function (alias) {
            var metadata = _this.aliasMap.getEntityMetadataByAlias(alias);
            if (!metadata)
                return;
            metadata.embeddeds.forEach(function (embedded) {
                embedded.columns.forEach(function (column) {
                    var expression = alias.name + "\\." + embedded.propertyName + "\\." + column.propertyName + "([ =]|.{0}$)";
                    statement = statement.replace(new RegExp(expression, "gm"), _this.connection.driver.escapeAliasName(alias.name) + "." + _this.connection.driver.escapeColumnName(column.name) + "$1");
                });
                // todo: what about embedded relations here?
            });
            metadata.columns.filter(function (column) { return !column.isInEmbedded; }).forEach(function (column) {
                var expression = alias.name + "\\." + column.propertyName + "([ =]|.{0}$)";
                statement = statement.replace(new RegExp(expression, "gm"), _this.connection.driver.escapeAliasName(alias.name) + "." + _this.connection.driver.escapeColumnName(column.name) + "$1");
            });
            metadata.relationsWithJoinColumns /*.filter(relation => !relation.isInEmbedded)*/.forEach(function (relation) {
                var expression = alias.name + "\\." + relation.propertyName + "([ =]|.{0}$)";
                statement = statement.replace(new RegExp(expression, "gm"), _this.connection.driver.escapeAliasName(alias.name) + "." + _this.connection.driver.escapeColumnName(relation.name) + "$1");
            });
        });
        return statement;
    };
    QueryBuilder.prototype.createJoinRelationIdsExpression = function () {
        var _this = this;
        return this.joinRelationIds.map(function (join) {
            var parentAlias = join.alias.parentAliasName;
            var foundAlias = _this.aliasMap.findAliasByName(parentAlias);
            if (!foundAlias)
                throw new Error("Alias \"" + parentAlias + "\" was not found");
            var parentMetadata = _this.aliasMap.getEntityMetadataByAlias(foundAlias);
            if (!parentMetadata)
                throw new Error("Cannot get entity metadata for the given alias " + foundAlias.name);
            var relation = parentMetadata.findRelationWithPropertyName(join.alias.parentPropertyName);
            var junctionMetadata = relation.junctionEntityMetadata;
            var junctionTable = junctionMetadata.table.name;
            var junctionAlias = join.alias.name;
            var joinTable = relation.isOwning ? relation.joinTable : relation.inverseRelation.joinTable; // not sure if this is correct
            var joinTableColumn = joinTable.referencedColumn.name; // not sure if this is correct
            var condition1 = "";
            if (relation.isOwning) {
                condition1 = _this.connection.driver.escapeAliasName(junctionAlias) + "." + _this.connection.driver.escapeColumnName(junctionMetadata.columns[0].name) + "=" + _this.connection.driver.escapeAliasName(parentAlias) + "." + _this.connection.driver.escapeColumnName(joinTableColumn);
                // condition2 = joinAlias + "." + inverseJoinColumnName + "=" + junctionAlias + "." + junctionMetadata.columns[1].name;
            }
            else {
                condition1 = _this.connection.driver.escapeAliasName(junctionAlias) + "." + _this.connection.driver.escapeColumnName(junctionMetadata.columns[1].name) + "=" + _this.connection.driver.escapeAliasName(parentAlias) + "." + _this.connection.driver.escapeColumnName(joinTableColumn);
                // condition2 = joinAlias + "." + inverseJoinColumnName + "=" + junctionAlias + "." + junctionMetadata.columns[0].name;
            }
            return " " + join.type + " JOIN " + junctionTable + " " + _this.connection.driver.escapeAliasName(junctionAlias) + " ON " + condition1;
            // " " + joinType + " JOIN " + joinTableName + " " + joinAlias + " " + join.conditionType + " " + condition2 + appendedCondition;
            // console.log(join);
            // return " " + join.type + " JOIN " + joinTableName + " " + join.alias.name + " " + (join.condition ? (join.conditionType + " " + join.condition) : "");
        });
    };
    QueryBuilder.prototype.createJoinExpression = function () {
        var _this = this;
        var joins = this.joins.map(function (join) {
            var joinType = join.type; // === "INNER" ? "INNER" : "LEFT";
            var joinTableName = join.tableName;
            if (!joinTableName) {
                var metadata = _this.aliasMap.getEntityMetadataByAlias(join.alias);
                if (!metadata)
                    throw new Error("Cannot get entity metadata for the given alias " + join.alias.name);
                joinTableName = metadata.table.name;
            }
            var parentAlias = join.alias.parentAliasName;
            if (!parentAlias) {
                return " " + joinType + " JOIN " + _this.connection.driver.escapeTableName(joinTableName) + " " + _this.connection.driver.escapeAliasName(join.alias.name) + " " + (join.condition ? ("ON " + _this.replacePropertyNames(join.condition)) : "");
            }
            var foundAlias = _this.aliasMap.findAliasByName(parentAlias);
            if (!foundAlias)
                throw new Error("Alias \"" + parentAlias + "\" was not found");
            var parentMetadata = _this.aliasMap.getEntityMetadataByAlias(foundAlias);
            if (!parentMetadata)
                throw new Error("Cannot get entity metadata for the given alias " + foundAlias.name);
            var relation = parentMetadata.findRelationWithPropertyName(join.alias.parentPropertyName);
            var junctionMetadata = relation.junctionEntityMetadata;
            var appendedCondition = join.condition ? " AND " + _this.replacePropertyNames(join.condition) : "";
            if (relation.isManyToMany) {
                var junctionTable = junctionMetadata.table.name;
                var junctionAlias = join.alias.parentAliasName + "_" + join.alias.name;
                var joinAlias = join.alias.name;
                var joinTable = relation.isOwning ? relation.joinTable : relation.inverseRelation.joinTable;
                var joinTableColumn = relation.isOwning ? joinTable.referencedColumn.name : joinTable.inverseReferencedColumn.name;
                var inverseJoinColumnName = relation.isOwning ? joinTable.inverseReferencedColumn.name : joinTable.referencedColumn.name;
                var condition1 = "", condition2 = "";
                if (relation.isOwning) {
                    condition1 = _this.connection.driver.escapeAliasName(junctionAlias) + "." + _this.connection.driver.escapeColumnName(junctionMetadata.columns[0].name) + "=" + _this.connection.driver.escapeAliasName(parentAlias) + "." + _this.connection.driver.escapeColumnName(joinTableColumn);
                    condition2 = _this.connection.driver.escapeAliasName(joinAlias) + "." + _this.connection.driver.escapeColumnName(inverseJoinColumnName) + "=" + _this.connection.driver.escapeAliasName(junctionAlias) + "." + _this.connection.driver.escapeColumnName(junctionMetadata.columns[1].name);
                }
                else {
                    condition1 = _this.connection.driver.escapeAliasName(junctionAlias) + "." + _this.connection.driver.escapeColumnName(junctionMetadata.columns[1].name) + "=" + _this.connection.driver.escapeAliasName(parentAlias) + "." + _this.connection.driver.escapeColumnName(joinTableColumn);
                    condition2 = _this.connection.driver.escapeAliasName(joinAlias) + "." + _this.connection.driver.escapeColumnName(inverseJoinColumnName) + "=" + _this.connection.driver.escapeAliasName(junctionAlias) + "." + _this.connection.driver.escapeColumnName(junctionMetadata.columns[0].name);
                }
                return " " + joinType + " JOIN " + _this.connection.driver.escapeTableName(junctionTable) + " " + _this.connection.driver.escapeAliasName(junctionAlias) + " ON " + condition1 +
                    " " + joinType + " JOIN " + _this.connection.driver.escapeTableName(joinTableName) + " " + _this.connection.driver.escapeAliasName(joinAlias) + " ON " + condition2 + appendedCondition;
            }
            else if (relation.isManyToOne || (relation.isOneToOne && relation.isOwning)) {
                var joinTableColumn = relation.joinColumn.referencedColumn.name;
                var condition = _this.connection.driver.escapeAliasName(join.alias.name) + "." + _this.connection.driver.escapeColumnName(joinTableColumn) + "=" + _this.connection.driver.escapeAliasName(parentAlias) + "." + _this.connection.driver.escapeColumnName(relation.name);
                return " " + joinType + " JOIN " + _this.connection.driver.escapeTableName(joinTableName) + " " + _this.connection.driver.escapeAliasName(join.alias.name) + " ON " + condition + appendedCondition;
            }
            else if (relation.isOneToMany || (relation.isOneToOne && !relation.isOwning)) {
                var joinTableColumn = relation.inverseRelation.joinColumn.referencedColumn.name;
                var condition = _this.connection.driver.escapeAliasName(join.alias.name) + "." + _this.connection.driver.escapeColumnName(relation.inverseRelation.name) + "=" + _this.connection.driver.escapeAliasName(parentAlias) + "." + _this.connection.driver.escapeColumnName(joinTableColumn);
                return " " + joinType + " JOIN " + _this.connection.driver.escapeTableName(joinTableName) + " " + _this.connection.driver.escapeAliasName(join.alias.name) + " ON " + condition + appendedCondition;
            }
            else {
                throw new Error("Unexpected relation type"); // this should not be possible
            }
        }).join(" ");
        if (!this.ignoreParentTablesJoins && !this.fromTableName) {
            var metadata = this.connection.getMetadata(this.aliasMap.mainAlias.target);
            if (metadata.parentEntityMetadata && metadata.parentIdColumns) {
                var alias_2 = this.connection.driver.escapeAliasName("parentIdColumn_" + metadata.parentEntityMetadata.table.name);
                joins += " JOIN " + this.connection.driver.escapeTableName(metadata.parentEntityMetadata.table.name)
                    + " " + alias_2 + " ON ";
                joins += metadata.parentIdColumns.map(function (parentIdColumn) {
                    return _this.aliasMap.mainAlias.name + "." + parentIdColumn.name + "=" + alias_2 + "." + parentIdColumn.propertyName;
                });
            }
        }
        /*if (this.enableRelationIdValues) {
            const parentMetadata = this.aliasMap.getEntityMetadataByAlias(this.aliasMap.mainAlias);
            if (!parentMetadata)
                throw new Error("Cannot get entity metadata for the given alias " + this.aliasMap.mainAlias.name);

            const metadata = this.connection.entityMetadatas.findByTarget(this.aliasMap.mainAlias.target);
            joins += metadata.manyToManyRelations.map(relation => {

                const junctionMetadata = relation.junctionEntityMetadata;
                const junctionTable = junctionMetadata.table.name;
                const junctionAlias = this.aliasMap.mainAlias.name + "_" + junctionTable + "_ids";
                const joinTable = relation.isOwning ? relation.joinTable : relation.inverseRelation.joinTable; // not sure if this is correct
                const joinTableColumn = joinTable.referencedColumn.name; // not sure if this is correct

                let condition1 = "";
                if (relation.isOwning) {
                    condition1 = this.connection.driver.escapeAliasName(junctionAlias) + "." +
                        this.connection.driver.escapeColumnName(junctionMetadata.columns[0].name) + "=" +
                        this.connection.driver.escapeAliasName(this.aliasMap.mainAlias.name) + "." +
                        this.connection.driver.escapeColumnName(joinTableColumn);
                } else {
                    condition1 = this.connection.driver.escapeAliasName(junctionAlias) + "." +
                        this.connection.driver.escapeColumnName(junctionMetadata.columns[1].name) + "=" +
                        this.connection.driver.escapeAliasName(this.aliasMap.mainAlias.name) + "." +
                        this.connection.driver.escapeColumnName(joinTableColumn);
                }

                return " LEFT JOIN " + junctionTable + " " + this.connection.driver.escapeAliasName(junctionAlias) + " ON " + condition1;
            }).join(" ");
        }*/
        return joins;
    };
    QueryBuilder.prototype.createGroupByExpression = function () {
        if (!this.groupBys || !this.groupBys.length)
            return "";
        return " GROUP BY " + this.replacePropertyNames(this.groupBys.join(", "));
    };
    QueryBuilder.prototype.createHavingExpression = function () {
        var _this = this;
        if (!this.havings || !this.havings.length)
            return "";
        return " HAVING " + this.havings.map(function (having) {
            switch (having.type) {
                case "and":
                    return " AND " + _this.replacePropertyNames(having.condition);
                case "or":
                    return " OR " + _this.replacePropertyNames(having.condition);
                default:
                    return " " + _this.replacePropertyNames(having.condition);
            }
        }).join(" ");
    };
    QueryBuilder.prototype.createOrderByCombinedWithSelectExpression = function (parentAlias) {
        var _this = this;
        // if table has a default order then apply it
        var orderBys = this.orderBys;
        if (!Object.keys(orderBys).length && !this.fromTableName) {
            var metadata = this.connection.getMetadata(this.aliasMap.mainAlias.target);
            orderBys = metadata.table.orderBy || {};
        }
        var selectString = Object.keys(orderBys)
            .map(function (columnName) {
            var _a = columnName.split("."), alias = _a[0], column = _a[1], embeddedProperties = _a.slice(2);
            return _this.connection.driver.escapeAliasName(parentAlias) + "." + _this.connection.driver.escapeColumnName(alias + "_" + column + embeddedProperties.join("_"));
        })
            .join(", ");
        var orderByString = Object.keys(orderBys)
            .map(function (columnName) {
            var _a = columnName.split("."), alias = _a[0], column = _a[1], embeddedProperties = _a.slice(2);
            return _this.connection.driver.escapeAliasName(parentAlias) + "." + _this.connection.driver.escapeColumnName(alias + "_" + column + embeddedProperties.join("_")) + " " + _this.orderBys[columnName];
        })
            .join(", ");
        return [selectString, orderByString];
    };
    QueryBuilder.prototype.createOrderByExpression = function () {
        var _this = this;
        var orderBys = this.orderBys;
        // if table has a default order then apply it
        if (!Object.keys(orderBys).length && !this.fromTableName) {
            var metadata = this.connection.getMetadata(this.aliasMap.mainAlias.target);
            orderBys = metadata.table.orderBy || {};
        }
        // if user specified a custom order then apply it
        if (Object.keys(orderBys).length > 0)
            return " ORDER BY " + Object.keys(orderBys)
                .map(function (columnName) {
                return _this.replacePropertyNames(columnName) + " " + _this.orderBys[columnName];
            })
                .join(", ");
        return "";
    };
    QueryBuilder.prototype.createLimitExpression = function () {
        if (!this.limit)
            return "";
        return " LIMIT " + this.limit;
    };
    QueryBuilder.prototype.createOffsetExpression = function () {
        if (!this.offset)
            return "";
        return " OFFSET " + this.offset;
    };
    QueryBuilder.prototype.extractJoinMappings = function () {
        var mappings = [];
        this.joins
            .filter(function (join) { return !!join.mapToProperty; })
            .forEach(function (join) {
            var _a = join.mapToProperty.split("."), parentName = _a[0], propertyName = _a[1];
            mappings.push({
                type: "join",
                alias: join.alias,
                parentName: parentName,
                propertyName: propertyName,
                isMany: join.isMappingMany
            });
        });
        this.joinRelationIds
            .filter(function (join) { return !!join.mapToProperty; })
            .forEach(function (join) {
            var _a = join.mapToProperty.split("."), parentName = _a[0], propertyName = _a[1];
            mappings.push({
                type: "relationId",
                alias: join.alias,
                parentName: parentName,
                propertyName: propertyName,
                isMany: false
            });
        });
        return mappings;
    };
    QueryBuilder.prototype.join = function (joinType, entityOrProperty, alias, condition, options, mapToProperty, isMappingMany) {
        // todo: entityOrProperty can be a table name. implement if its a table
        // todo: entityOrProperty can be target name. implement proper behaviour if it is.
        if (condition === void 0) { condition = ""; }
        if (isMappingMany === void 0) { isMappingMany = false; }
        var tableName = "";
        var aliasObj = new Alias_1.Alias(alias);
        this.aliasMap.addAlias(aliasObj);
        if (entityOrProperty instanceof Function) {
            aliasObj.target = entityOrProperty;
        }
        else if (this.isPropertyAlias(entityOrProperty)) {
            _a = entityOrProperty.split("."), aliasObj.parentAliasName = _a[0], aliasObj.parentPropertyName = _a[1];
        }
        else if (typeof entityOrProperty === "string") {
            tableName = entityOrProperty;
            if (!mapToProperty)
                mapToProperty = entityOrProperty;
        }
        var join = {
            type: joinType,
            alias: aliasObj,
            tableName: tableName,
            condition: condition,
            options: options,
            mapToProperty: mapToProperty,
            isMappingMany: isMappingMany
        };
        this.joins.push(join);
        return this;
        var _a;
    };
    QueryBuilder.prototype.joinRelationId = function (joinType, mapToProperty, property, condition) {
        if (!this.isPropertyAlias(property))
            throw new Error("Only entity relations are allowed in the leftJoinRelationId operation"); // todo: also check if that relation really has entityId
        var _a = property.split("."), parentAliasName = _a[0], parentPropertyName = _a[1];
        var alias = parentAliasName + "_" + parentPropertyName + "_relation_id";
        var aliasObj = new Alias_1.Alias(alias);
        this.aliasMap.addAlias(aliasObj);
        aliasObj.parentAliasName = parentAliasName;
        aliasObj.parentPropertyName = parentPropertyName;
        this.joinRelationIds.push({
            type: joinType,
            mapToProperty: mapToProperty,
            alias: aliasObj,
            condition: condition
        });
        return this;
    };
    QueryBuilder.prototype.isValueSimpleString = function (str) {
        return /^[A-Za-z0-9_-]+$/.test(str);
    };
    QueryBuilder.prototype.isPropertyAlias = function (str) {
        if (!(typeof str === "string"))
            return false;
        if (str.indexOf(".") === -1)
            return false;
        var aliasName = str.split(".")[0];
        var propertyName = str.split(".")[1];
        if (!aliasName || !propertyName)
            return false;
        var aliasNameRegexp = /^[a-zA-Z0-9_-]+$/;
        var propertyNameRegexp = aliasNameRegexp;
        if (!aliasNameRegexp.test(aliasName) || !propertyNameRegexp.test(propertyName))
            return false;
        return true;
    };
    /**
     * Creates "WHERE" expression and variables for the given "ids".
     */
    QueryBuilder.prototype.createWhereIdsExpression = function (ids) {
        var _this = this;
        var metadata = this.connection.getMetadata(this.aliasMap.mainAlias.target);
        // create shortcuts for better readability
        var escapeAlias = function (alias) { return _this.connection.driver.escapeAliasName(alias); };
        var escapeColumn = function (column) { return _this.connection.driver.escapeColumnName(column); };
        var alias = this.aliasMap.mainAlias.name;
        var parameters = {};
        var whereStrings = ids.map(function (id, index) {
            var whereSubStrings = [];
            if (metadata.hasMultiplePrimaryKeys) {
                metadata.primaryColumns.forEach(function (primaryColumn, secondIndex) {
                    whereSubStrings.push(escapeAlias(alias) + "." + escapeColumn(primaryColumn.name) + "=:id_" + index + "_" + secondIndex);
                    parameters["id_" + index + "_" + secondIndex] = id[primaryColumn.name];
                });
                metadata.parentIdColumns.forEach(function (primaryColumn, secondIndex) {
                    whereSubStrings.push(escapeAlias(alias) + "." + escapeColumn(id[primaryColumn.name]) + "=:parentId_" + index + "_" + secondIndex);
                    parameters["parentId_" + index + "_" + secondIndex] = id[primaryColumn.propertyName];
                });
            }
            else {
                if (metadata.primaryColumns.length > 0) {
                    whereSubStrings.push(escapeAlias(alias) + "." + escapeColumn(metadata.firstPrimaryColumn.name) + "=:id_" + index);
                    parameters["id_" + index] = id;
                }
                else if (metadata.parentIdColumns.length > 0) {
                    whereSubStrings.push(escapeAlias(alias) + "." + escapeColumn(metadata.parentIdColumns[0].name) + "=:parentId_" + index);
                    parameters["parentId_" + index] = id;
                }
            }
            return whereSubStrings.join(" AND ");
        });
        var whereString = whereStrings.length > 1 ? "(" + whereStrings.join(" OR ") + ")" : whereStrings[0];
        return [whereString, parameters];
    };
    QueryBuilder.prototype.getQueryRunner = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.queryRunnerProvider instanceof QueryRunnerProvider_1.QueryRunnerProvider) {
                    return [2 /*return*/, this.queryRunnerProvider.provide()];
                }
                else {
                    return [2 /*return*/, this.connection.driver.createQueryRunner()];
                }
                return [2 /*return*/];
            });
        });
    };
    QueryBuilder.prototype.hasOwnQueryRunner = function () {
        return !this.queryRunnerProvider;
    };
    return QueryBuilder;
}());
exports.QueryBuilder = QueryBuilder;

//# sourceMappingURL=QueryBuilder.js.map
