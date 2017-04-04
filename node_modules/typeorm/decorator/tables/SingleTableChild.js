"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../index");
/**
 * Special type of the table used in the single-table inherited tables.
 *
 * @deprecated Use @SingleEntityChild decorator instead.
 */
function SingleTableChild() {
    return function (target) {
        var args = {
            target: target,
            name: undefined,
            type: "single-table-child",
            orderBy: undefined
        };
        index_1.getMetadataArgsStorage().tables.add(args);
    };
}
exports.SingleTableChild = SingleTableChild;

//# sourceMappingURL=SingleTableChild.js.map
