/**
 * Thrown when consumer tries to run/revert migrations without connection set.
 */
export declare class CannotRunMigrationNotConnectedError extends Error {
    name: string;
    constructor(connectionName: string);
}
