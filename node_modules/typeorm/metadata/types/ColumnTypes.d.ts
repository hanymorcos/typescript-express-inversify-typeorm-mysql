/**
 * All data types that column can be.
 */
export declare type ColumnType = "string" | "text" | "number" | "integer" | "int" | "smallint" | "bigint" | "float" | "double" | "decimal" | "date" | "time" | "datetime" | "boolean" | "json" | "jsonb" | "simple_array" | "uuid";
/**
 * All data types that column can be.
 */
export declare class ColumnTypes {
    /**
     * SQL VARCHAR type. Your class's property type should be a "string".
     */
    static STRING: ColumnType;
    /**
     * SQL CLOB type. Your class's property type should be a "string".
     */
    static TEXT: ColumnType;
    /**
     * SQL FLOAT type. Your class's property type should be a "number".
     */
    static NUMBER: ColumnType;
    /**
     * SQL INT type. Your class's property type should be a "number".
     */
    static INTEGER: ColumnType;
    /**
     * SQL INT type. Your class's property type should be a "number".
     */
    static INT: ColumnType;
    /**
     * SQL SMALLINT type. Your class's property type should be a "number".
     */
    static SMALLINT: ColumnType;
    /**
     * SQL BIGINT type. Your class's property type should be a "number".
     */
    static BIGINT: ColumnType;
    /**
     * SQL FLOAT type. Your class's property type should be a "number".
     */
    static FLOAT: ColumnType;
    /**
     * SQL FLOAT type. Your class's property type should be a "number".
     */
    static DOUBLE: ColumnType;
    /**
     * SQL DECIMAL type. Your class's property type should be a "string".
     */
    static DECIMAL: ColumnType;
    /**
     * SQL DATETIME type. Your class's property type should be a "Date" object.
     */
    static DATE: ColumnType;
    /**
     * SQL TIME type. Your class's property type should be a "Date" object.
     */
    static TIME: ColumnType;
    /**
     * SQL DATETIME/TIMESTAMP type. Your class's property type should be a "Date" object.
     */
    static DATETIME: ColumnType;
    /**
     * SQL BOOLEAN type. Your class's property type should be a "boolean".
     */
    static BOOLEAN: ColumnType;
    /**
     * SQL CLOB type. Your class's property type should be any Object.
     */
    static JSON: ColumnType;
    /**
     * Postgres jsonb type. Your class's property type should be any Object.
     */
    static JSONB: ColumnType;
    /**
     * SQL CLOB type. Your class's property type should be array of string. Note: value in this column should not contain
     * a comma (",") since this symbol is used to create a string from the array, using .join(",") operator.
     */
    static SIMPLE_ARRAY: ColumnType;
    /**
     * UUID type. Serialized to a string in typescript or javascript
     */
    static UUID: ColumnType;
    /**
     * Checks if given type in a string format is supported by ORM.
     */
    static isTypeSupported(type: string): boolean;
    /**
     * Returns list of all supported types by the ORM.
     */
    static readonly supportedTypes: ColumnType[];
    /**
     * Tries to guess a column type from the given function.
     */
    static determineTypeFromFunction(type: Function): ColumnType;
    static typeToString(type: Function): string;
    /**
     * Checks if column type is numeric.
     */
    static isNumeric(type: ColumnType): boolean;
}
