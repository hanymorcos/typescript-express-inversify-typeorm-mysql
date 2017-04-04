/**
 * Thrown if database driver does not support pooling.
 */
export declare class DriverPoolingNotSupportedError extends Error {
    name: string;
    constructor(driverName: string);
}
