/**
 * Thrown when consumer tries to sync a database schema after connection is established
 */
export declare class CannotSyncNotConnectedError extends Error {
    name: string;
    constructor(connectionName: string);
}
