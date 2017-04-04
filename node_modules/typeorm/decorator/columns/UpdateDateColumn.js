"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ColumnTypes_1 = require("../../metadata/types/ColumnTypes");
var index_1 = require("../../index");
/**
 * This column will store an update date of the updated object.
 * This date is being updated each time you persist the object.
 */
function UpdateDateColumn(options) {
    return function (object, propertyName) {
        // const reflectedType = ColumnTypes.typeToString((Reflect as any).getMetadata("design:type", object, propertyName));
        // if column options are not given then create a new empty options
        if (!options)
            options = {};
        // implicitly set a type, because this column's type cannot be anything else except date
        options = Object.assign({ type: ColumnTypes_1.ColumnTypes.DATETIME }, options);
        // create and register a new column metadata
        var args = {
            target: object.constructor,
            propertyName: propertyName,
            // propertyType: reflectedType,
            mode: "updateDate",
            options: options
        };
        index_1.getMetadataArgsStorage().columns.add(args);
    };
}
exports.UpdateDateColumn = UpdateDateColumn;

//# sourceMappingURL=UpdateDateColumn.js.map
