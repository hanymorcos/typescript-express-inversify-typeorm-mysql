"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ColumnTypes_1 = require("../../metadata/types/ColumnTypes");
var index_1 = require("../../index");
/**
 * This column will store a number - version of the entity.
 * Every time your entity will be persisted, this number will be increased by one -
 * so you can organize visioning and update strategies of your entity.
 */
function VersionColumn(options) {
    return function (object, propertyName) {
        // const reflectedType = ColumnTypes.typeToString((Reflect as any).getMetadata("design:type", object, propertyName));
        // if column options are not given then create a new empty options
        if (!options)
            options = {};
        // implicitly set a type, because this column's type cannot be anything else except date
        options = Object.assign({ type: ColumnTypes_1.ColumnTypes.INTEGER }, options);
        // todo: check if reflectedType is number too
        // create and register a new column metadata
        var args = {
            target: object.constructor,
            propertyName: propertyName,
            // propertyType: reflectedType,
            mode: "version",
            options: options
        };
        index_1.getMetadataArgsStorage().columns.add(args);
    };
}
exports.VersionColumn = VersionColumn;

//# sourceMappingURL=VersionColumn.js.map
