"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../index");
var ColumnTypes_1 = require("../../metadata/types/ColumnTypes");
/**
 * Creates a "level"/"length" column to the table that holds a closure table.
 */
function TreeLevelColumn() {
    return function (object, propertyName) {
        // const reflectedType = ColumnTypes.typeToString((Reflect as any).getMetadata("design:type", object, propertyName));
        // implicitly set a type, because this column's type cannot be anything else except number
        var options = { type: ColumnTypes_1.ColumnTypes.INTEGER };
        // create and register a new column metadata
        var args = {
            target: object.constructor,
            propertyName: propertyName,
            // propertyType: reflectedType,
            mode: "treeLevel",
            options: options
        };
        index_1.getMetadataArgsStorage().columns.add(args);
    };
}
exports.TreeLevelColumn = TreeLevelColumn;

//# sourceMappingURL=TreeLevelColumn.js.map
