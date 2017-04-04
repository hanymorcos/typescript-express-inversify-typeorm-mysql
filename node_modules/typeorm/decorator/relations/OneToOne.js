"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RelationTypes_1 = require("../../metadata/types/RelationTypes");
var index_1 = require("../../index");
/**
 * One-to-one relation allows to create direct relation between two entities. Entity1 have only one Entity2.
 * Entity1 is an owner of the relationship, and storages Entity1 id on its own side.
 */
function OneToOne(typeFunction, inverseSideOrOptions, options) {
    var inverseSideProperty;
    if (typeof inverseSideOrOptions === "object") {
        options = inverseSideOrOptions;
    }
    else {
        inverseSideProperty = inverseSideOrOptions;
    }
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
        var args = {
            target: object.constructor,
            propertyName: propertyName,
            // propertyType: reflectedType,
            isLazy: isLazy,
            relationType: RelationTypes_1.RelationTypes.ONE_TO_ONE,
            type: typeFunction,
            inverseSideProperty: inverseSideProperty,
            options: options
        };
        index_1.getMetadataArgsStorage().relations.add(args);
    };
}
exports.OneToOne = OneToOne;

//# sourceMappingURL=OneToOne.js.map
