"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * All data types that column can be.
 */
var ColumnTypes = (function () {
    function ColumnTypes() {
    }
    /**
     * Checks if given type in a string format is supported by ORM.
     */
    ColumnTypes.isTypeSupported = function (type) {
        return this.supportedTypes.indexOf(type) !== -1;
    };
    Object.defineProperty(ColumnTypes, "supportedTypes", {
        /**
         * Returns list of all supported types by the ORM.
         */
        get: function () {
            return [
                this.STRING,
                this.TEXT,
                this.NUMBER,
                this.INTEGER,
                this.INT,
                this.SMALLINT,
                this.BIGINT,
                this.FLOAT,
                this.DOUBLE,
                this.DECIMAL,
                this.DATE,
                this.TIME,
                this.DATETIME,
                this.BOOLEAN,
                this.JSON,
                this.JSONB,
                this.SIMPLE_ARRAY,
                this.UUID
            ];
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Tries to guess a column type from the given function.
     */
    ColumnTypes.determineTypeFromFunction = function (type) {
        if (type instanceof Date) {
            return ColumnTypes.DATETIME;
        }
        else if (type instanceof Function) {
            var typeName = type.name.toLowerCase();
            switch (typeName) {
                case "number":
                    return ColumnTypes.NUMBER;
                case "boolean":
                    return ColumnTypes.BOOLEAN;
                case "string":
                    return ColumnTypes.STRING;
                case "date":
                    return ColumnTypes.DATETIME;
                case "object":
                    return ColumnTypes.JSON;
            }
        }
        else if (type instanceof Object) {
            return ColumnTypes.JSON;
        }
        throw new Error("Column type of " + type + " cannot be determined.");
        // return undefined;
    };
    ColumnTypes.typeToString = function (type) {
        return type.name.toLowerCase();
    };
    /**
     * Checks if column type is numeric.
     */
    ColumnTypes.isNumeric = function (type) {
        return type === ColumnTypes.NUMBER ||
            type === ColumnTypes.INT ||
            type === ColumnTypes.INTEGER ||
            type === ColumnTypes.BIGINT ||
            type === ColumnTypes.SMALLINT ||
            type === ColumnTypes.DOUBLE ||
            type === ColumnTypes.FLOAT;
    };
    return ColumnTypes;
}());
/**
 * SQL VARCHAR type. Your class's property type should be a "string".
 */
ColumnTypes.STRING = "string";
/**
 * SQL CLOB type. Your class's property type should be a "string".
 */
ColumnTypes.TEXT = "text";
/**
 * SQL FLOAT type. Your class's property type should be a "number".
 */
ColumnTypes.NUMBER = "number";
/**
 * SQL INT type. Your class's property type should be a "number".
 */
ColumnTypes.INTEGER = "integer";
/**
 * SQL INT type. Your class's property type should be a "number".
 */
ColumnTypes.INT = "int";
/**
 * SQL SMALLINT type. Your class's property type should be a "number".
 */
ColumnTypes.SMALLINT = "smallint";
/**
 * SQL BIGINT type. Your class's property type should be a "number".
 */
ColumnTypes.BIGINT = "bigint";
/**
 * SQL FLOAT type. Your class's property type should be a "number".
 */
ColumnTypes.FLOAT = "float";
/**
 * SQL FLOAT type. Your class's property type should be a "number".
 */
ColumnTypes.DOUBLE = "double";
/**
 * SQL DECIMAL type. Your class's property type should be a "string".
 */
ColumnTypes.DECIMAL = "decimal";
/**
 * SQL DATETIME type. Your class's property type should be a "Date" object.
 */
ColumnTypes.DATE = "date";
/**
 * SQL TIME type. Your class's property type should be a "Date" object.
 */
ColumnTypes.TIME = "time";
/**
 * SQL DATETIME/TIMESTAMP type. Your class's property type should be a "Date" object.
 */
ColumnTypes.DATETIME = "datetime";
/**
 * SQL BOOLEAN type. Your class's property type should be a "boolean".
 */
ColumnTypes.BOOLEAN = "boolean";
/**
 * SQL CLOB type. Your class's property type should be any Object.
 */
ColumnTypes.JSON = "json";
/**
 * Postgres jsonb type. Your class's property type should be any Object.
 */
ColumnTypes.JSONB = "jsonb";
/**
 * SQL CLOB type. Your class's property type should be array of string. Note: value in this column should not contain
 * a comma (",") since this symbol is used to create a string from the array, using .join(",") operator.
 */
ColumnTypes.SIMPLE_ARRAY = "simple_array";
/**
 * UUID type. Serialized to a string in typescript or javascript
 */
ColumnTypes.UUID = "uuid";
exports.ColumnTypes = ColumnTypes;

//# sourceMappingURL=ColumnTypes.js.map
