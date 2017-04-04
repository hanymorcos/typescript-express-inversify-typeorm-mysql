"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ConnectionIsNotSetError_1 = require("../error/ConnectionIsNotSetError");
var DriverUtils_1 = require("../DriverUtils");
var ColumnTypes_1 = require("../../metadata/types/ColumnTypes");
var DriverOptionNotSetError_1 = require("../error/DriverOptionNotSetError");
var DataTransformationUtils_1 = require("../../util/DataTransformationUtils");
var WebsqlQueryRunner_1 = require("./WebsqlQueryRunner");
/**
 * Organizes communication with WebSQL in the browser.
 */
var WebsqlDriver = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function WebsqlDriver(options, logger) {
        this.options = DriverUtils_1.DriverUtils.buildDriverOptions(options);
        this.logger = logger;
        // validate options to make sure everything is set
        // if (!this.options.host)
        //     throw new DriverOptionNotSetError("host");
        // if (!this.options.username)
        //     throw new DriverOptionNotSetError("username");
        if (!this.options.database)
            throw new DriverOptionNotSetError_1.DriverOptionNotSetError("database");
        // todo: what about extra options: version, description, size
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Performs connection to the database.
     * Based on pooling options, it can either create connection immediately,
     * either create a pool and create connection when needed.
     */
    WebsqlDriver.prototype.connect = function () {
        var _this = this;
        // build connection options for the driver
        var options = Object.assign({}, {
            database: this.options.database,
        }, this.options.extra || {});
        return new Promise(function (ok, fail) {
            var connection = openDatabase(options.database, options.version, options.description, options.size);
            _this.databaseConnection = {
                id: 1,
                connection: connection,
                isTransactionActive: false
            };
            ok();
        });
    };
    /**
     * Closes connection with the database.
     */
    WebsqlDriver.prototype.disconnect = function () {
        if (!this.databaseConnection)
            throw new ConnectionIsNotSetError_1.ConnectionIsNotSetError("websql");
        return new Promise(function (ok, fail) {
            // const handler = (err: any) => err ? fail(err) : ok();
            // todo: find out how to close connection
            ok();
        });
    };
    /**
     * Creates a query runner used for common queries.
     */
    WebsqlDriver.prototype.createQueryRunner = function () {
        return __awaiter(this, void 0, void 0, function () {
            var databaseConnection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.databaseConnection)
                            return [2 /*return*/, Promise.reject(new ConnectionIsNotSetError_1.ConnectionIsNotSetError("websql"))];
                        return [4 /*yield*/, this.retrieveDatabaseConnection()];
                    case 1:
                        databaseConnection = _a.sent();
                        return [2 /*return*/, new WebsqlQueryRunner_1.WebsqlQueryRunner(databaseConnection, this, this.logger)];
                }
            });
        });
    };
    /**
     * Access to the native implementation of the database.
     */
    WebsqlDriver.prototype.nativeInterface = function () {
        return {
            connection: this.databaseConnection ? this.databaseConnection.connection : undefined
        };
    };
    /**
     * Replaces parameters in the given sql with special escaping character
     * and an array of parameter names to be passed to a query.
     */
    WebsqlDriver.prototype.escapeQueryWithParameters = function (sql, parameters) {
        if (!parameters || !Object.keys(parameters).length)
            return [sql, []];
        var escapedParameters = [];
        var keys = Object.keys(parameters).map(function (parameter) { return "(:" + parameter + "\\b)"; }).join("|");
        sql = sql.replace(new RegExp(keys, "g"), function (key) {
            escapedParameters.push(parameters[key.substr(1)]);
            return "?";
        }); // todo: make replace only in value statements, otherwise problems
        return [sql, escapedParameters];
    };
    /**
     * Escapes a column name.
     */
    WebsqlDriver.prototype.escapeColumnName = function (columnName) {
        return columnName; // "`" + columnName + "`";
    };
    /**
     * Escapes an alias.
     */
    WebsqlDriver.prototype.escapeAliasName = function (aliasName) {
        return aliasName; // "`" + aliasName + "`";
    };
    /**
     * Escapes a table name.
     */
    WebsqlDriver.prototype.escapeTableName = function (tableName) {
        return tableName; // "`" + tableName + "`";
    };
    /**
     * Prepares given value to a value to be persisted, based on its column type and metadata.
     */
    WebsqlDriver.prototype.preparePersistentValue = function (value, columnMetadata) {
        if (value === null || value === undefined)
            return null;
        switch (columnMetadata.type) {
            case ColumnTypes_1.ColumnTypes.BOOLEAN:
                return value === true ? 1 : 0;
            case ColumnTypes_1.ColumnTypes.DATE:
                return DataTransformationUtils_1.DataTransformationUtils.mixedDateToDateString(value);
            case ColumnTypes_1.ColumnTypes.TIME:
                return DataTransformationUtils_1.DataTransformationUtils.mixedDateToTimeString(value);
            case ColumnTypes_1.ColumnTypes.DATETIME:
                if (columnMetadata.localTimezone) {
                    return DataTransformationUtils_1.DataTransformationUtils.mixedDateToDatetimeString(value);
                }
                else {
                    return DataTransformationUtils_1.DataTransformationUtils.mixedDateToUtcDatetimeString(value);
                }
            case ColumnTypes_1.ColumnTypes.JSON:
                return JSON.stringify(value);
            case ColumnTypes_1.ColumnTypes.SIMPLE_ARRAY:
                return DataTransformationUtils_1.DataTransformationUtils.simpleArrayToString(value);
        }
        return value;
    };
    /**
     * Prepares given value to a value to be persisted, based on its column type or metadata.
     */
    WebsqlDriver.prototype.prepareHydratedValue = function (value, columnMetadata) {
        switch (columnMetadata.type) {
            case ColumnTypes_1.ColumnTypes.BOOLEAN:
                return value ? true : false;
            case ColumnTypes_1.ColumnTypes.DATETIME:
                return DataTransformationUtils_1.DataTransformationUtils.normalizeHydratedDate(value, columnMetadata.localTimezone === true);
            case ColumnTypes_1.ColumnTypes.TIME:
                return DataTransformationUtils_1.DataTransformationUtils.mixedTimeToString(value);
            case ColumnTypes_1.ColumnTypes.JSON:
                return JSON.parse(value);
            case ColumnTypes_1.ColumnTypes.SIMPLE_ARRAY:
                return DataTransformationUtils_1.DataTransformationUtils.stringToSimpleArray(value);
        }
        return value;
    };
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Retrieves a new database connection.
     * If pooling is enabled then connection from the pool will be retrieved.
     * Otherwise active connection will be returned.
     */
    WebsqlDriver.prototype.retrieveDatabaseConnection = function () {
        if (this.databaseConnection)
            return Promise.resolve(this.databaseConnection);
        throw new ConnectionIsNotSetError_1.ConnectionIsNotSetError("websql");
    };
    return WebsqlDriver;
}());
exports.WebsqlDriver = WebsqlDriver;

//# sourceMappingURL=WebsqlDriver.js.map
