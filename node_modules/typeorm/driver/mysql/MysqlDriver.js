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
var DriverUtils_1 = require("../DriverUtils");
var MysqlQueryRunner_1 = require("./MysqlQueryRunner");
var ColumnTypes_1 = require("../../metadata/types/ColumnTypes");
var DriverOptionNotSetError_1 = require("../error/DriverOptionNotSetError");
var DataTransformationUtils_1 = require("../../util/DataTransformationUtils");
var PlatformTools_1 = require("../../platform/PlatformTools");
/**
 * Organizes communication with MySQL DBMS.
 */
var MysqlDriver = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function MysqlDriver(options, logger, mysql) {
        /**
         * Pool of database connections.
         */
        this.databaseConnectionPool = [];
        this.options = DriverUtils_1.DriverUtils.buildDriverOptions(options);
        this.logger = logger;
        this.mysql = mysql;
        // validate options to make sure everything is set
        if (!(this.options.host || (this.options.extra && this.options.extra.socketPath)))
            throw new DriverOptionNotSetError_1.DriverOptionNotSetError("socketPath and host");
        if (!this.options.username)
            throw new DriverOptionNotSetError_1.DriverOptionNotSetError("username");
        if (!this.options.database)
            throw new DriverOptionNotSetError_1.DriverOptionNotSetError("database");
        // if mysql package instance was not set explicitly then try to load it
        if (!mysql)
            this.loadDependencies();
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Performs connection to the database.
     * Based on pooling options, it can either create connection immediately,
     * either create a pool and create connection when needed.
     */
    MysqlDriver.prototype.connect = function () {
        var _this = this;
        // build connection options for the driver
        var options = Object.assign({}, {
            host: this.options.host,
            user: this.options.username,
            password: this.options.password,
            database: this.options.database,
            port: this.options.port
        }, this.options.extra || {});
        // pooling is enabled either when its set explicitly to true,
        // either when its not defined at all (e.g. enabled by default)
        if (this.options.usePool === undefined || this.options.usePool === true) {
            this.pool = this.mysql.createPool(options);
            return Promise.resolve();
        }
        else {
            return new Promise(function (ok, fail) {
                var connection = _this.mysql.createConnection(options);
                _this.databaseConnection = {
                    id: 1,
                    connection: connection,
                    isTransactionActive: false
                };
                _this.databaseConnection.connection.connect(function (err) { return err ? fail(err) : ok(); });
            });
        }
    };
    /**
     * Closes connection with the database.
     */
    MysqlDriver.prototype.disconnect = function () {
        var _this = this;
        if (!this.databaseConnection && !this.pool)
            throw new ConnectionIsNotSetError_1.ConnectionIsNotSetError("mysql");
        return new Promise(function (ok, fail) {
            var handler = function (err) { return err ? fail(err) : ok(); };
            // if pooling is used, then disconnect from it
            if (_this.pool) {
                _this.pool.end(handler);
                _this.pool = undefined;
                _this.databaseConnectionPool = [];
            }
            // if single connection is opened, then close it
            if (_this.databaseConnection) {
                _this.databaseConnection.connection.end(handler);
                _this.databaseConnection = undefined;
            }
        });
    };
    /**
     * Creates a query runner used for common queries.
     */
    MysqlDriver.prototype.createQueryRunner = function () {
        return __awaiter(this, void 0, void 0, function () {
            var databaseConnection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.databaseConnection && !this.pool)
                            return [2 /*return*/, Promise.reject(new ConnectionIsNotSetError_1.ConnectionIsNotSetError("mysql"))];
                        return [4 /*yield*/, this.retrieveDatabaseConnection()];
                    case 1:
                        databaseConnection = _a.sent();
                        return [2 /*return*/, new MysqlQueryRunner_1.MysqlQueryRunner(databaseConnection, this, this.logger)];
                }
            });
        });
    };
    /**
     * Access to the native implementation of the database.
     */
    MysqlDriver.prototype.nativeInterface = function () {
        return {
            driver: this.mysql,
            connection: this.databaseConnection ? this.databaseConnection.connection : undefined,
            pool: this.pool
        };
    };
    /**
     * Replaces parameters in the given sql with special escaping character
     * and an array of parameter names to be passed to a query.
     */
    MysqlDriver.prototype.escapeQueryWithParameters = function (sql, parameters) {
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
    MysqlDriver.prototype.escapeColumnName = function (columnName) {
        return "`" + columnName + "`";
    };
    /**
     * Escapes an alias.
     */
    MysqlDriver.prototype.escapeAliasName = function (aliasName) {
        return "`" + aliasName + "`";
    };
    /**
     * Escapes a table name.
     */
    MysqlDriver.prototype.escapeTableName = function (tableName) {
        return "`" + tableName + "`";
    };
    /**
     * Prepares given value to a value to be persisted, based on its column type and metadata.
     */
    MysqlDriver.prototype.preparePersistentValue = function (value, columnMetadata) {
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
    MysqlDriver.prototype.prepareHydratedValue = function (value, columnMetadata) {
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
    MysqlDriver.prototype.retrieveDatabaseConnection = function () {
        var _this = this;
        if (this.pool) {
            return new Promise(function (ok, fail) {
                _this.pool.getConnection(function (err, connection) {
                    if (err)
                        return fail(err);
                    var dbConnection = _this.databaseConnectionPool.find(function (dbConnection) { return dbConnection.connection === connection; });
                    if (!dbConnection) {
                        dbConnection = {
                            id: _this.databaseConnectionPool.length,
                            connection: connection,
                            isTransactionActive: false
                        };
                        dbConnection.releaseCallback = function () {
                            if (_this.pool && dbConnection) {
                                connection.release();
                                _this.databaseConnectionPool.splice(_this.databaseConnectionPool.indexOf(dbConnection), 1);
                            }
                            return Promise.resolve();
                        };
                        _this.databaseConnectionPool.push(dbConnection);
                    }
                    ok(dbConnection);
                });
            });
        }
        if (this.databaseConnection)
            return Promise.resolve(this.databaseConnection);
        throw new ConnectionIsNotSetError_1.ConnectionIsNotSetError("mysql");
    };
    /**
     * If driver dependency is not given explicitly, then try to load it via "require".
     */
    MysqlDriver.prototype.loadDependencies = function () {
        try {
            this.mysql = PlatformTools_1.PlatformTools.load("mysql"); // try to load first supported package
        }
        catch (e) {
            try {
                this.mysql = PlatformTools_1.PlatformTools.load("mysql2"); // try to load second supported package
            }
            catch (e) {
                throw new DriverPackageNotInstalledError_1.DriverPackageNotInstalledError("Mysql", "mysql");
            }
        }
    };
    return MysqlDriver;
}());
exports.MysqlDriver = MysqlDriver;

//# sourceMappingURL=MysqlDriver.js.map
