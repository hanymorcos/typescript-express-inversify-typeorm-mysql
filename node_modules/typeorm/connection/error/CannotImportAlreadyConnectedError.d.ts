/**
 * Thrown when consumer tries to import entities / entity schemas / subscribers / naming strategies after connection
 * is established.
 */
export declare class CannotImportAlreadyConnectedError extends Error {
    name: string;
    constructor(importStuff: string, connectionName: string);
}
