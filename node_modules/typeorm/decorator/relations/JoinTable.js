"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../index");
/**
 * JoinTable decorator is used in many-to-many relationship to specify owner side of relationship.
 * Its also used to set a custom junction table's name, column names and referenced columns.
 */
function JoinTable(options) {
    return function (object, propertyName) {
        options = options || {};
        var args = {
            target: object.constructor,
            propertyName: propertyName,
            name: options.name,
            joinColumn: options.joinColumn,
            inverseJoinColumn: options.inverseJoinColumn
        };
        index_1.getMetadataArgsStorage().joinTables.add(args);
    };
}
exports.JoinTable = JoinTable;

//# sourceMappingURL=JoinTable.js.map
