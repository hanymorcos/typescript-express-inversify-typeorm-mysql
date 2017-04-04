"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../index");
/**
 * Used on a tables that stores its children in a tree using closure deisgn pattern.
 *
 * @deprecated Use @ClosureEntity decorator instead.
 */
function ClosureTable(name, options) {
    return function (target) {
        var args = {
            target: target,
            name: name,
            type: "closure",
            orderBy: options && options.orderBy ? options.orderBy : undefined,
            skipSchemaSync: !!(options && options.skipSchemaSync === true)
        };
        index_1.getMetadataArgsStorage().tables.add(args);
    };
}
exports.ClosureTable = ClosureTable;

//# sourceMappingURL=ClosureTable.js.map
