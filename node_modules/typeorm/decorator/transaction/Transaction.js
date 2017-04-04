"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../index");
/**
 * Wraps some method into the transaction.
 * Note, method result will return a promise if this decorator applied.
 * Note, all database operations in the wrapped method should be executed using entity managed passed as a first parameter
 * into the wrapped method.
 * If you want to control at what position in your method parameters entity manager should be injected,
 * then use @TransactionEntityManager() decorator.
 */
function Transaction(connectionName) {
    if (connectionName === void 0) { connectionName = "default"; }
    return function (target, methodName, descriptor) {
        // save original method - we gonna need it
        var originalMethod = descriptor.value;
        // override method descriptor with proxy method
        descriptor.value = function () {
            var _this = this;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return index_1.getConnection(connectionName)
                .entityManager
                .transaction(function (entityManager) {
                // gets all @TransactionEntityManager() decorator usages for this method
                var indices = index_1.getMetadataArgsStorage()
                    .transactionEntityManagers
                    .filterByTarget(target.constructor)
                    .toArray()
                    .filter(function (transactionEntityManager) { return transactionEntityManager.methodName === methodName; })
                    .map(function (transactionEntityManager) { return transactionEntityManager.index; });
                var argsWithInjectedEntityManager;
                if (indices.length) {
                    argsWithInjectedEntityManager = args.slice();
                    indices.forEach(function (index) { return argsWithInjectedEntityManager.splice(index, 0, entityManager); });
                }
                else {
                    argsWithInjectedEntityManager = [entityManager].concat(args);
                }
                return originalMethod.apply(_this, argsWithInjectedEntityManager);
            });
        };
    };
}
exports.Transaction = Transaction;

//# sourceMappingURL=Transaction.js.map
