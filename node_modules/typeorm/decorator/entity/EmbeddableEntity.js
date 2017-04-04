"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../index");
/**
 * This decorator is used on the entities that must be embedded into another entities.
 */
function EmbeddableEntity() {
    return function (target) {
        var args = {
            target: target,
            type: "embeddable",
            orderBy: undefined
        };
        index_1.getMetadataArgsStorage().tables.add(args);
    };
}
exports.EmbeddableEntity = EmbeddableEntity;

//# sourceMappingURL=EmbeddableEntity.js.map
