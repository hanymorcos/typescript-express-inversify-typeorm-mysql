/**
 * Thrown when consumer tries close not opened connection.
 */
export declare class CannotCloseNotConnectedError extends Error {
    name: string;
    constructor(connectionName: string);
}
