"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../index");
/**
 * Decorator registers a new naming strategy to be used in naming things.
 */
function NamingStrategy(name) {
    return function (target) {
        var strategyName = name ? name : target.name;
        var args = {
            target: target,
            name: strategyName
        };
        index_1.getMetadataArgsStorage().namingStrategies.add(args);
    };
}
exports.NamingStrategy = NamingStrategy;

//# sourceMappingURL=NamingStrategy.js.map
