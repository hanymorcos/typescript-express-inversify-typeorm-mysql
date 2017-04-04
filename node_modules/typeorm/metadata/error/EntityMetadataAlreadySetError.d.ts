/**
 * Thrown when user tries to execute operation that requires connection to be established.
 */
export declare class EntityMetadataAlreadySetError extends Error {
    name: string;
    constructor(type: Function, target: Function | string | undefined, tableName: string | undefined);
}
