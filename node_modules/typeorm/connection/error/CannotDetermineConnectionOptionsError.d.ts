/**
 * Thrown when connection is trying to be created automatically from connection options found in the ormconfig.json
 * or environment variables, but failed due to missing these configurations.
 */
export declare class CannotDetermineConnectionOptionsError extends Error {
    name: string;
    constructor();
}
