"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../index");
var RelationTypes_1 = require("../../metadata/types/RelationTypes");
/**
 * Marks a specific property of the class as a children of the tree.
 */
function TreeChildren(options) {
    return function (object, propertyName) {
        if (!options)
            options = {};
        // now try to determine it its lazy relation
        var isLazy = options && options.lazy === true ? true : false;
        if (!isLazy && Reflect && Reflect.getMetadata) {
            var reflectedType = Reflect.getMetadata("design:type", object, propertyName);
            if (reflectedType && typeof reflectedType.name === "string" && reflectedType.name.toLowerCase() === "promise")
                isLazy = true;
        }
        // add one-to-many relation for this 
        var args = {
            isTreeChildren: true,
            target: object.constructor,
            propertyName: propertyName,
            // propertyType: reflectedType,
            isLazy: isLazy,
            relationType: RelationTypes_1.RelationTypes.ONE_TO_MANY,
            type: function () { return object.constructor; },
            options: options
        };
        index_1.getMetadataArgsStorage().relations.add(args);
    };
}
exports.TreeChildren = TreeChildren;

//# sourceMappingURL=TreeChildren.js.map
