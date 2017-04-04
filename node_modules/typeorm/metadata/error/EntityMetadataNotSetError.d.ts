/**
 * Thrown when accessed to the class with entity metadata,
 * however on that time entity metadata is not set in the class.
 */
export declare class EntityMetadataNotSetError extends Error {
    name: string;
    constructor(type: Function, target: Function | string | undefined, tableName: string | undefined);
}
