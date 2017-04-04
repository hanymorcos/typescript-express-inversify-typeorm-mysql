"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../index");
/**
 * This decorators is used on the entities that must be embedded into the tables.
 *
 * @deprecated Use @EmbeddableEntity decorator instead.
 */
function EmbeddableTable() {
    return function (target) {
        var args = {
            target: target,
            type: "embeddable",
            orderBy: undefined
        };
        index_1.getMetadataArgsStorage().tables.add(args);
    };
}
exports.EmbeddableTable = EmbeddableTable;

//# sourceMappingURL=EmbeddableTable.js.map
