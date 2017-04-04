"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PlatformTools_1 = require("../platform/PlatformTools");
/**
 * Performs logging of the events in TypeORM.
 */
var Logger = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function Logger(options) {
        this.options = options;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Logs query and parameters used in it.
     */
    Logger.prototype.logQuery = function (query, parameters) {
        if (this.options.logQueries ||
            PlatformTools_1.PlatformTools.getEnvVariable("LOGGER_CLI_SCHEMA_SYNC"))
            this.log("log", "executing query: " + query + (parameters && parameters.length ? " -- PARAMETERS: " + this.stringifyParams(parameters) : ""));
    };
    /**
     * Logs query that failed.
     */
    Logger.prototype.logFailedQuery = function (query, parameters) {
        if (this.options.logQueries ||
            this.options.logOnlyFailedQueries ||
            PlatformTools_1.PlatformTools.getEnvVariable("LOGGER_CLI_SCHEMA_SYNC"))
            this.log("error", "query failed: " + query + (parameters && parameters.length ? " -- PARAMETERS: " + this.stringifyParams(parameters) : ""));
    };
    /**
     * Logs failed query's error.
     */
    Logger.prototype.logQueryError = function (error) {
        if (this.options.logFailedQueryError ||
            PlatformTools_1.PlatformTools.getEnvVariable("LOGGER_CLI_SCHEMA_SYNC"))
            this.log("error", "error during executing query:" + error);
    };
    /**
     * Logs events from the schema build process.
     */
    Logger.prototype.logSchemaBuild = function (message) {
        if (this.options.logSchemaCreation ||
            PlatformTools_1.PlatformTools.getEnvVariable("LOGGER_CLI_SCHEMA_SYNC"))
            this.log("info", message);
    };
    /**
     * Perform logging using given logger, or by default to the console.
     * Log has its own level and message.
     */
    Logger.prototype.log = function (level, message) {
        if (!this.options)
            return;
        if (this.options.logger) {
            this.options.logger(level, message);
        }
        else {
            switch (level) {
                case "log":
                    console.log(message);
                    break;
                case "info":
                    console.info(message);
                    break;
                case "warn":
                    console.warn(message);
                    break;
                case "error":
                    console.error(message);
                    break;
            }
        }
    };
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Converts parameters to a string.
     * Sometimes parameters can have circular objects and therefor we are handle this case too.
     */
    Logger.prototype.stringifyParams = function (parameters) {
        try {
            return JSON.stringify(parameters);
        }
        catch (error) {
            return parameters;
        }
    };
    return Logger;
}());
exports.Logger = Logger;

//# sourceMappingURL=Logger.js.map
