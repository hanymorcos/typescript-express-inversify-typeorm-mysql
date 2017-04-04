"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../index");
/**
 * Abstract table is a table that contains columns and relations for all tables that will inherit this table.
 * Database table for the abstract table is not created.
 *
 * @deprecated Use @AbstractEntity decorator instead.
 */
function AbstractTable() {
    return function (target) {
        var args = {
            target: target,
            name: undefined,
            type: "abstract"
        };
        index_1.getMetadataArgsStorage().tables.add(args);
    };
}
exports.AbstractTable = AbstractTable;

//# sourceMappingURL=AbstractTable.js.map
