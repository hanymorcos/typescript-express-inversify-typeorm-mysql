"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../index");
/**
 * JoinColumn decorator used on one-to-one relations to specify owner side of relationship.
 * It also can be used on both one-to-one and many-to-one relations to specify custom column name
 * or custom referenced column.
 */
function JoinColumn(options) {
    return function (object, propertyName) {
        options = options || {};
        var args = {
            target: object.constructor,
            propertyName: propertyName,
            name: options.name,
            referencedColumnName: options.referencedColumnName
        };
        index_1.getMetadataArgsStorage().joinColumns.add(args);
    };
}
exports.JoinColumn = JoinColumn;

//# sourceMappingURL=JoinColumn.js.map
