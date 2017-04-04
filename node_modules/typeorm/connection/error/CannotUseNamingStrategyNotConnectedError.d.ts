/**
 * Thrown when consumer tries to change used naming strategy after connection is established.
 */
export declare class CannotUseNamingStrategyNotConnectedError extends Error {
    name: string;
    constructor(connectionName: string);
}
