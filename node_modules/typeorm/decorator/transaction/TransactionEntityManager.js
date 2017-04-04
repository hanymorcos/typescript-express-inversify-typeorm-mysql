"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../index");
/**
 * Injects transaction's entity manager into the method wrapped with @Transaction decorator.
 */
function TransactionEntityManager() {
    return function (object, methodName, index) {
        var args = {
            target: object.constructor,
            methodName: methodName,
            index: index,
        };
        index_1.getMetadataArgsStorage().transactionEntityManagers.add(args);
    };
}
exports.TransactionEntityManager = TransactionEntityManager;

//# sourceMappingURL=TransactionEntityManager.js.map
