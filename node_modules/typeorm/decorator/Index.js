"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../index");
/**
 * Composite index must be set on entity classes and must specify entity's fields to be indexed.
 */
function Index(nameOrFieldsOrOptions, maybeFieldsOrOptions, maybeOptions) {
    var name = typeof nameOrFieldsOrOptions === "string" ? nameOrFieldsOrOptions : undefined;
    var fields = typeof nameOrFieldsOrOptions === "string" ? maybeFieldsOrOptions : nameOrFieldsOrOptions;
    var options = (typeof nameOrFieldsOrOptions === "object" && !Array.isArray(nameOrFieldsOrOptions)) ? nameOrFieldsOrOptions : maybeOptions;
    if (!options)
        options = (typeof maybeFieldsOrOptions === "object" && !Array.isArray(maybeFieldsOrOptions)) ? nameOrFieldsOrOptions : maybeOptions;
    return function (clsOrObject, propertyName) {
        var args = {
            target: propertyName ? clsOrObject.constructor : clsOrObject,
            name: name,
            columns: propertyName ? [propertyName] : fields,
            unique: options && options.unique ? true : false
        };
        index_1.getMetadataArgsStorage().indices.add(args);
    };
}
exports.Index = Index;

//# sourceMappingURL=Index.js.map
