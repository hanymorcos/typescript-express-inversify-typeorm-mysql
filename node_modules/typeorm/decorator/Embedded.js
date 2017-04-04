"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../index");
/**
 * Property in entity can be marked as Embedded, and on persist all columns from the embedded are mapped to the
 * single table of the entity where Embedded is used. And on hydration all columns which supposed to be in the
 * embedded will be mapped to it from the single table.
 */
function Embedded(typeFunction) {
    return function (object, propertyName) {
        // const reflectedType = (Reflect as any).getMetadata("design:type", object, propertyName);
        var args = {
            target: object.constructor,
            propertyName: propertyName,
            // propertyType: reflectedType,
            type: typeFunction
        };
        index_1.getMetadataArgsStorage().embeddeds.add(args);
    };
}
exports.Embedded = Embedded;

//# sourceMappingURL=Embedded.js.map
