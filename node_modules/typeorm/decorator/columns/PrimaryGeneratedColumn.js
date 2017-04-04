"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../index");
var PrimaryColumnCannotBeNullableError_1 = require("../error/PrimaryColumnCannotBeNullableError");
/**
 * Column decorator is used to mark a specific class property as a table column.
 * Only properties decorated with this decorator will be persisted to the database when entity be saved.
 * This column creates an integer PRIMARY COLUMN with generated set to true.
 * This column creates is an alias for @PrimaryColumn("int", { generated: true }).
 */
function PrimaryGeneratedColumn(options) {
    return function (object, propertyName) {
        // const reflectedType = ColumnTypes.typeToString((Reflect as any).getMetadata("design:type", object, propertyName));
        // if column options are not given then create a new empty options
        if (!options)
            options = {};
        // check if there is no type in column options then set the int type - by default for auto generated column
        if (!options.type)
            options = Object.assign({ type: "int" }, options);
        // check if column is not nullable, because we cannot allow a primary key to be nullable
        if (options.nullable)
            throw new PrimaryColumnCannotBeNullableError_1.PrimaryColumnCannotBeNullableError(object, propertyName);
        // implicitly set a primary and generated to column options
        options = Object.assign({ primary: true, generated: true }, options);
        // create and register a new column metadata
        var args = {
            target: object.constructor,
            propertyName: propertyName,
            // propertyType: reflectedType,
            mode: "regular",
            options: options
        };
        index_1.getMetadataArgsStorage().columns.add(args);
    };
}
exports.PrimaryGeneratedColumn = PrimaryGeneratedColumn;

//# sourceMappingURL=PrimaryGeneratedColumn.js.map
