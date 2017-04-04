"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../index");
/**
 * This decorator is used to mark classes that will be a tables. Database schema will be created for all classes
 * decorated with it, and Repository can be retrieved and used for it.
 *
 * @deprecated Use @Entity decorator instead.
 */
function Table(name, options) {
    return function (target) {
        var args = {
            target: target,
            name: name,
            type: "regular",
            orderBy: options && options.orderBy ? options.orderBy : undefined,
            engine: options && options.engine ? options.engine : undefined,
            skipSchemaSync: !!(options && options.skipSchemaSync === true)
        };
        index_1.getMetadataArgsStorage().tables.add(args);
    };
}
exports.Table = Table;

//# sourceMappingURL=Table.js.map
