"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RandomGenerator_1 = require("../util/RandomGenerator");
var StringUtils_1 = require("../util/StringUtils");
/**
 * Naming strategy that is used by default.
 */
var DefaultNamingStrategy = (function () {
    function DefaultNamingStrategy() {
    }
    DefaultNamingStrategy.prototype.tableName = function (className, customName) {
        return customName ? customName : StringUtils_1.snakeCase(className);
    };
    DefaultNamingStrategy.prototype.columnName = function (propertyName, customName) {
        return customName ? customName : propertyName;
    };
    DefaultNamingStrategy.prototype.embeddedColumnName = function (embeddedPropertyName, columnPropertyName, columnCustomName) {
        return StringUtils_1.camelCase(embeddedPropertyName + "_" + (columnCustomName ? columnCustomName : columnPropertyName));
    };
    DefaultNamingStrategy.prototype.relationName = function (propertyName) {
        return propertyName;
    };
    DefaultNamingStrategy.prototype.indexName = function (customName, tableName, columns) {
        if (customName)
            return customName;
        var key = "ind_" + tableName + "_" + columns.join("_");
        return "ind_" + RandomGenerator_1.RandomGenerator.sha1(key).substr(0, 27);
    };
    DefaultNamingStrategy.prototype.joinColumnInverseSideName = function (joinColumnName, propertyName) {
        if (joinColumnName)
            return joinColumnName;
        return propertyName;
    };
    DefaultNamingStrategy.prototype.joinTableName = function (firstTableName, secondTableName, firstPropertyName, secondPropertyName, firstColumnName, secondColumnName) {
        return StringUtils_1.snakeCase(firstTableName + "_" + firstPropertyName + "_" + secondTableName + "_" + secondColumnName);
    };
    DefaultNamingStrategy.prototype.joinTableColumnName = function (tableName, columnName, secondTableName, secondColumnName) {
        var column1 = StringUtils_1.camelCase(tableName + "_" + columnName);
        var column2 = StringUtils_1.camelCase(secondTableName + "_" + secondColumnName);
        return column1 === column2 ? column1 + "_1" : column1; // todo: do we still need _1 prefix?!
    };
    DefaultNamingStrategy.prototype.joinTableInverseColumnName = function (tableName, columnName, secondTableName, secondColumnName) {
        var column1 = StringUtils_1.camelCase(tableName + "_" + columnName);
        var column2 = StringUtils_1.camelCase(secondTableName + "_" + secondColumnName);
        return column1 === column2 ? column1 + "_2" : column1; // todo: do we still need _2 prefix?!
    };
    DefaultNamingStrategy.prototype.closureJunctionTableName = function (tableName) {
        return tableName + "_closure";
    };
    DefaultNamingStrategy.prototype.foreignKeyName = function (tableName, columnNames, referencedTableName, referencedColumnNames) {
        var key = tableName + "_" + columnNames.join("_") + "_" + referencedTableName + "_" + referencedColumnNames.join("_");
        return "fk_" + RandomGenerator_1.RandomGenerator.sha1(key).substr(0, 27); // todo: use crypto instead?
    };
    DefaultNamingStrategy.prototype.classTableInheritanceParentColumnName = function (parentTableName, parentTableIdPropertyName) {
        return StringUtils_1.camelCase(parentTableName + "_" + parentTableIdPropertyName);
    };
    /**
     * Adds prefix to the table.
     */
    DefaultNamingStrategy.prototype.prefixTableName = function (prefix, originalTableName) {
        return prefix + originalTableName;
    };
    return DefaultNamingStrategy;
}());
exports.DefaultNamingStrategy = DefaultNamingStrategy;

//# sourceMappingURL=DefaultNamingStrategy.js.map
