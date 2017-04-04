"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../index");
/**
 * Special decorator used to extract relation id into separate entity property.
 */
function RelationId(relation) {
    return function (object, propertyName) {
        var args = {
            target: object.constructor,
            propertyName: propertyName,
            relation: relation
        };
        index_1.getMetadataArgsStorage().relationIds.add(args);
    };
}
exports.RelationId = RelationId;

//# sourceMappingURL=RelationId.js.map
