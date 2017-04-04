import { LoggerOptions } from "./LoggerOptions";
/**
 * Performs logging of the events in TypeORM.
 */
export declare class Logger {
    private options;
    constructor(options: LoggerOptions);
    /**
     * Logs query and parameters used in it.
     */
    logQuery(query: string, parameters?: any[]): void;
    /**
     * Logs query that failed.
     */
    logFailedQuery(query: string, parameters?: any[]): void;
    /**
     * Logs failed query's error.
     */
    logQueryError(error: any): void;
    /**
     * Logs events from the schema build process.
     */
    logSchemaBuild(message: string): void;
    /**
     * Perform logging using given logger, or by default to the console.
     * Log has its own level and message.
     */
    log(level: "log" | "info" | "warn" | "error", message: any): void;
    /**
     * Converts parameters to a string.
     * Sometimes parameters can have circular objects and therefor we are handle this case too.
     */
    protected stringifyParams(parameters: any[]): string | any[];
}
