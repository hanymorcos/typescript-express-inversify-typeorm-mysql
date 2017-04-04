"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../index");
/**
 * Holds a number of children in the closure table of the column.
 */
function RelationCount(relation) {
    return function (object, propertyName) {
        // todo: need to check if property type is number?
        // const reflectedType = ColumnTypes.typeToString((Reflect as any).getMetadata("design:type", object, propertyName));
        // create and register a new column metadata
        var args = {
            target: object.constructor,
            propertyName: propertyName,
            relation: relation
        };
        index_1.getMetadataArgsStorage().relationCounts.add(args);
    };
}
exports.RelationCount = RelationCount;

//# sourceMappingURL=RelationCount.js.map
