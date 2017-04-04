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
var DriverPackageNotInstalledError_1 = require("../error/DriverPackageNotInstalledError");
var ColumnTypes_1 = require("../../metadata/types/ColumnTypes");
var SqliteQueryRunner_1 = require("./SqliteQueryRunner");
var DriverOptionNotSetError_1 = require("../error/DriverOptionNotSetError");
var DataTransformationUtils_1 = require("../../util/DataTransformationUtils");
var PlatformTools_1 = require("../../platform/PlatformTools");
/**
 * Organizes communication with sqlite DBMS.
 */
var SqliteDriver = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function SqliteDriver(connectionOptions, logger, sqlite) {
        this.options = connectionOptions;
        this.logger = logger;
        this.sqlite = sqlite;
        // validate options to make sure everything is set
        if (!this.options.storage)
            throw new DriverOptionNotSetError_1.DriverOptionNotSetError("storage");
        // if sqlite package instance was not set explicitly then try to load it
        if (!sqlite)
            this.loadDependencies();
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Performs connection to the database.
     */
    SqliteDriver.prototype.connect = function () {
        var _this = this;
        return new Promise(function (ok, fail) {
            var connection = new _this.sqlite.Database(_this.options.storage, function (err) {
                if (err)
                    return fail(err);
                _this.databaseConnection = {
                    id: 1,
                    connection: connection,
                    isTransactionActive: false
                };
                // we need to enable foreign keys in sqlite to make sure all foreign key related features
                // working properly. this also makes onDelete to work with sqlite.
                connection.run("PRAGMA foreign_keys = ON;", function (err, result) {
                    ok();
                });
            });
        });
    };
    /**
     * Closes connection with database.
     */
    SqliteDriver.prototype.disconnect = function () {
        var _this = this;
        return new Promise(function (ok, fail) {
            var handler = function (err) { return err ? fail(err) : ok(); };
            if (!_this.databaseConnection)
                return fail(new ConnectionIsNotSetError_1.ConnectionIsNotSetError("sqlite"));
            _this.databaseConnection.connection.close(handler);
        });
    };
    /**
     * Creates a query runner used for common queries.
     */
    SqliteDriver.prototype.createQueryRunner = function () {
        return __awaiter(this, void 0, void 0, function () {
            var databaseConnection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.databaseConnection)
                            return [2 /*return*/, Promise.reject(new ConnectionIsNotSetError_1.ConnectionIsNotSetError("sqlite"))];
                        return [4 /*yield*/, this.retrieveDatabaseConnection()];
                    case 1:
                        databaseConnection = _a.sent();
                        return [2 /*return*/, new SqliteQueryRunner_1.SqliteQueryRunner(databaseConnection, this, this.logger)];
                }
            });
        });
    };
    /**
     * Access to the native implementation of the database.
     */
    SqliteDriver.prototype.nativeInterface = function () {
        return {
            driver: this.sqlite,
            connection: this.databaseConnection ? this.databaseConnection.connection : undefined
        };
    };
    /**
     * Prepares given value to a value to be persisted, based on its column type and metadata.
     */
    SqliteDriver.prototype.preparePersistentValue = function (value, columnMetadata) {
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
    SqliteDriver.prototype.prepareHydratedValue = function (value, columnMetadata) {
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
    /**
     * Replaces parameters in the given sql with special escaping character
     * and an array of parameter names to be passed to a query.
     */
    SqliteDriver.prototype.escapeQueryWithParameters = function (sql, parameters) {
        if (!parameters || !Object.keys(parameters).length)
            return [sql, []];
        var builtParameters = [];
        var keys = Object.keys(parameters).map(function (parameter) { return "(:" + parameter + "\\b)"; }).join("|");
        sql = sql.replace(new RegExp(keys, "g"), function (key) {
            var value = parameters[key.substr(1)];
            if (value instanceof Array) {
                return value.map(function (v) {
                    builtParameters.push(v);
                    return "$" + builtParameters.length;
                }).join(", ");
            }
            else {
                builtParameters.push(value);
            }
            return "$" + builtParameters.length;
        }); // todo: make replace only in value statements, otherwise problems
        return [sql, builtParameters];
    };
    /**
     * Escapes a column name.
     */
    SqliteDriver.prototype.escapeColumnName = function (columnName) {
        return "\"" + columnName + "\"";
    };
    /**
     * Escapes an alias.
     */
    SqliteDriver.prototype.escapeAliasName = function (aliasName) {
        return "\"" + aliasName + "\"";
    };
    /**
     * Escapes a table name.
     */
    SqliteDriver.prototype.escapeTableName = function (tableName) {
        return "\"" + tableName + "\"";
    };
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Retrieves a new database connection.
     * If pooling is enabled then connection from the pool will be retrieved.
     * Otherwise active connection will be returned.
     */
    SqliteDriver.prototype.retrieveDatabaseConnection = function () {
        if (this.databaseConnection)
            return Promise.resolve(this.databaseConnection);
        throw new ConnectionIsNotSetError_1.ConnectionIsNotSetError("sqlite");
    };
    /**
     * If driver dependency is not given explicitly, then try to load it via "require".
     */
    SqliteDriver.prototype.loadDependencies = function () {
        try {
            this.sqlite = PlatformTools_1.PlatformTools.load("sqlite3").verbose();
        }
        catch (e) {
            throw new DriverPackageNotInstalledError_1.DriverPackageNotInstalledError("SQLite", "sqlite3");
        }
    };
    return SqliteDriver;
}());
exports.SqliteDriver = SqliteDriver;

//# sourceMappingURL=SqliteDriver.js.map
