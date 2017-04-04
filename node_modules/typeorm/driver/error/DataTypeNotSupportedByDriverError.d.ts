/**
 * Thrown if some data type is not supported by a driver.
 */
export declare class DataTypeNotSupportedByDriverError extends Error {
    name: string;
    constructor(dataType: string, driverName: string);
}
