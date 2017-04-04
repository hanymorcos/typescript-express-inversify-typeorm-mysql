/**
 * Wraps some method into the transaction.
 * Note, method result will return a promise if this decorator applied.
 * Note, all database operations in the wrapped method should be executed using entity managed passed as a first parameter
 * into the wrapped method.
 * If you want to control at what position in your method parameters entity manager should be injected,
 * then use @TransactionEntityManager() decorator.
 */
export declare function Transaction(connectionName?: string): Function;
