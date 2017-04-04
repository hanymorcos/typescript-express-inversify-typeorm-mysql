"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ColumnTypeUndefinedError_1 = require("../error/ColumnTypeUndefinedError");
var GeneratedOnlyForPrimaryError_1 = require("../error/GeneratedOnlyForPrimaryError");
var index_1 = require("../../index");
var ColumnTypes_1 = require("../../metadata/types/ColumnTypes");
/**
 * Column decorator is used to mark a specific class property as a table column.
 * Only properties decorated with this decorator will be persisted to the database when entity be saved.
 */
function Column(typeOrOptions, options) {
    var type;
    if (typeof typeOrOptions === "string") {
        type = typeOrOptions;
    }
    else if (typeOrOptions) {
        options = typeOrOptions;
        type = typeOrOptions.type;
    }
    return function (object, propertyName) {
        // todo: need to store not string type, but original type instead? (like in relation metadata)
        // const reflectedType = ColumnTypes.typeToString((Reflect as any).getMetadata("design:type", object, propertyName));
        // if type is not given implicitly then try to guess it
        if (!type) {
            var reflectMetadataType = Reflect && Reflect.getMetadata ? Reflect.getMetadata("design:type", object, propertyName) : undefined;
            if (reflectMetadataType)
                type = ColumnTypes_1.ColumnTypes.determineTypeFromFunction(reflectMetadataType);
        }
        // if column options are not given then create a new empty options
        if (!options)
            options = {};
        // check if there is no type in column options then set type from first function argument, or guessed one
        if (!options.type && type)
            options = Object.assign({ type: type }, options);
        // if we still don't have a type then we need to give error to user that type is required
        if (!options.type)
            throw new ColumnTypeUndefinedError_1.ColumnTypeUndefinedError(object, propertyName);
        // check if auto increment is not set for simple column
        if (options.generated)
            throw new GeneratedOnlyForPrimaryError_1.GeneratedOnlyForPrimaryError(object, propertyName);
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
exports.Column = Column;

//# sourceMappingURL=Column.js.map
