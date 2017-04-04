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
var Connection_1 = require("./Connection");
var ConnectionNotFoundError_1 = require("./error/ConnectionNotFoundError");
var MysqlDriver_1 = require("../driver/mysql/MysqlDriver");
var MissingDriverError_1 = require("./error/MissingDriverError");
var PostgresDriver_1 = require("../driver/postgres/PostgresDriver");
var AlreadyHasActiveConnectionError_1 = require("./error/AlreadyHasActiveConnectionError");
var Logger_1 = require("../logger/Logger");
var SqliteDriver_1 = require("../driver/sqlite/SqliteDriver");
var OracleDriver_1 = require("../driver/oracle/OracleDriver");
var SqlServerDriver_1 = require("../driver/sqlserver/SqlServerDriver");
var OrmUtils_1 = require("../util/OrmUtils");
var CannotDetermineConnectionOptionsError_1 = require("./error/CannotDetermineConnectionOptionsError");
var PlatformTools_1 = require("../platform/PlatformTools");
var WebsqlDriver_1 = require("../driver/websql/WebsqlDriver");
/**
 * ConnectionManager is used to store and manage all these different connections.
 * It also provides useful factory methods to simplify connection creation.
 */
var ConnectionManager = (function () {
    function ConnectionManager() {
        // -------------------------------------------------------------------------
        // Protected Properties
        // -------------------------------------------------------------------------
        /**
         * List of connections registered in this connection manager.
         */
        this.connections = [];
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Checks if connection with the given name exist in the manager.
     */
    ConnectionManager.prototype.has = function (name) {
        return !!this.connections.find(function (connection) { return connection.name === name; });
    };
    /**
     * Gets registered connection with the given name.
     * If connection name is not given then it will get a default connection.
     * Throws exception if connection with the given name was not found.
     */
    ConnectionManager.prototype.get = function (name) {
        if (name === void 0) { name = "default"; }
        var connection = this.connections.find(function (connection) { return connection.name === name; });
        if (!connection)
            throw new ConnectionNotFoundError_1.ConnectionNotFoundError(name);
        return connection;
    };
    /**
     * Creates a new connection based on the given connection options and registers it in the manager.
     * You need to manually call #connect method to establish connection.
     * Note that dropSchemaOnConnection and autoSchemaSync options of a ConnectionOptions will not work there - use
     * createAndConnect method to use them.
     */
    ConnectionManager.prototype.create = function (options) {
        var logger = new Logger_1.Logger(options.logging || {});
        var driver = this.createDriver(options.driver, logger);
        var connection = this.createConnection(options.name || "default", driver, logger);
        // import entity schemas
        if (options.entitySchemas) {
            var _a = this.splitStringsAndClasses(options.entitySchemas), directories = _a[0], classes = _a[1];
            connection
                .importEntitySchemas(classes)
                .importEntitySchemaFromDirectories(directories);
        }
        // import entities
        if (options.entities) {
            var _b = this.splitStringsAndClasses(options.entities), directories = _b[0], classes = _b[1];
            connection
                .importEntities(classes)
                .importEntitiesFromDirectories(directories);
        }
        // import subscriber
        if (options.subscribers) {
            var _c = this.splitStringsAndClasses(options.subscribers), directories = _c[0], classes = _c[1];
            connection
                .importSubscribers(classes)
                .importSubscribersFromDirectories(directories);
        }
        // import naming strategies
        if (options.namingStrategies) {
            var _d = this.splitStringsAndClasses(options.namingStrategies), directories = _d[0], classes = _d[1];
            connection
                .importNamingStrategies(classes)
                .importNamingStrategiesFromDirectories(directories);
        }
        // import migrations
        if (options.migrations) {
            var _e = this.splitStringsAndClasses(options.migrations), directories = _e[0], classes = _e[1];
            connection
                .importMigrations(classes)
                .importMigrationsFromDirectories(directories);
        }
        // set naming strategy to be used for this connection
        if (options.usedNamingStrategy)
            connection.useNamingStrategy(options.usedNamingStrategy);
        return connection;
    };
    /**
     * Creates connection and and registers it in the manager.
     */
    ConnectionManager.prototype.createAndConnect = function (optionsOrConnectionNameFromConfig, ormConfigPath) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // if connection options are given, then create connection from them
                if (optionsOrConnectionNameFromConfig && optionsOrConnectionNameFromConfig instanceof Object)
                    return [2 /*return*/, this.createAndConnectByConnectionOptions(optionsOrConnectionNameFromConfig)];
                // if connection name is specified then explicitly try to load connection options from it
                if (typeof optionsOrConnectionNameFromConfig === "string")
                    return [2 /*return*/, this.createFromConfigAndConnect(optionsOrConnectionNameFromConfig || "default", ormConfigPath)];
                // if nothing is specified then try to silently load config from ormconfig.json
                if (this.hasDefaultConfigurationInConfigurationFile())
                    return [2 /*return*/, this.createFromConfigAndConnect("default")];
                // if driver type is set in environment variables then try to create connection from env variables
                if (this.hasDefaultConfigurationInEnvironmentVariables())
                    return [2 /*return*/, this.createFromEnvAndConnect()];
                throw new CannotDetermineConnectionOptionsError_1.CannotDetermineConnectionOptionsError();
            });
        });
    };
    /**
     * Creates connections and and registers them in the manager.
     */
    ConnectionManager.prototype.createAndConnectToAll = function (optionsOrOrmConfigFilePath) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // if connection options are given, then create connection from them
                        if (optionsOrOrmConfigFilePath && optionsOrOrmConfigFilePath instanceof Array)
                            return [2 /*return*/, Promise.all(optionsOrOrmConfigFilePath.map(function (options) {
                                    return _this.createAndConnectByConnectionOptions(options);
                                }))];
                        // if connection name is specified then explicitly try to load connection options from it
                        if (typeof optionsOrOrmConfigFilePath === "string")
                            return [2 /*return*/, this.createFromConfigAndConnectToAll(optionsOrOrmConfigFilePath)];
                        // if nothing is specified then try to silently load config from ormconfig.json
                        if (this.hasOrmConfigurationFile())
                            return [2 /*return*/, this.createFromConfigAndConnectToAll()];
                        if (!this.hasDefaultConfigurationInEnvironmentVariables()) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.createFromEnvAndConnect()];
                    case 1: return [2 /*return*/, [_b.sent()]];
                    case 2: throw new CannotDetermineConnectionOptionsError_1.CannotDetermineConnectionOptionsError();
                }
            });
        });
    };
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Checks if ormconfig.json exists.
     */
    ConnectionManager.prototype.hasOrmConfigurationFile = function () {
        var path = PlatformTools_1.PlatformTools.load("app-root-path").path + "/ormconfig.json";
        if (!PlatformTools_1.PlatformTools.fileExist(path))
            return false;
        var configuration = PlatformTools_1.PlatformTools.load(path);
        if (configuration instanceof Array) {
            return configuration
                .filter(function (options) { return !options.environment || options.environment === PlatformTools_1.PlatformTools.getEnvVariable("NODE_ENV"); })
                .length > 0;
        }
        else if (configuration instanceof Object) {
            if (configuration.environment && configuration.environment !== PlatformTools_1.PlatformTools.getEnvVariable("NODE_ENV"))
                return false;
            return Object.keys(configuration).length > 0;
        }
        return false;
    };
    /**
     * Checks if there is a default connection in the ormconfig.json file.
     */
    ConnectionManager.prototype.hasDefaultConfigurationInConfigurationFile = function () {
        var path = PlatformTools_1.PlatformTools.load("app-root-path").path + "/ormconfig.json";
        if (!PlatformTools_1.PlatformTools.fileExist(path))
            return false;
        var configuration = PlatformTools_1.PlatformTools.load(path);
        if (configuration instanceof Array) {
            return !!configuration
                .filter(function (options) { return !options.environment || options.environment === PlatformTools_1.PlatformTools.getEnvVariable("NODE_ENV"); })
                .find(function (config) { return !!config.name || config.name === "default"; });
        }
        else if (configuration instanceof Object) {
            if (!configuration.name ||
                configuration.name !== "default")
                return false;
            if (configuration.environment && configuration.environment !== PlatformTools_1.PlatformTools.getEnvVariable("NODE_ENV"))
                return false;
            return true;
        }
        return false;
    };
    /**
     * Checks if environment variables contains connection options.
     */
    ConnectionManager.prototype.hasDefaultConfigurationInEnvironmentVariables = function () {
        return !!PlatformTools_1.PlatformTools.getEnvVariable("TYPEORM_DRIVER_TYPE");
    };
    /**
     * Allows to quickly create a connection based on the environment variable values.
     */
    ConnectionManager.prototype.createFromEnvAndConnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.createAndConnectByConnectionOptions({
                        driver: {
                            type: PlatformTools_1.PlatformTools.getEnvVariable("TYPEORM_DRIVER_TYPE"),
                            url: PlatformTools_1.PlatformTools.getEnvVariable("TYPEORM_URL"),
                            host: PlatformTools_1.PlatformTools.getEnvVariable("TYPEORM_HOST"),
                            port: PlatformTools_1.PlatformTools.getEnvVariable("TYPEORM_PORT"),
                            username: PlatformTools_1.PlatformTools.getEnvVariable("TYPEORM_USERNAME"),
                            password: PlatformTools_1.PlatformTools.getEnvVariable("TYPEORM_PASSWORD"),
                            database: PlatformTools_1.PlatformTools.getEnvVariable("TYPEORM_DATABASE"),
                            sid: PlatformTools_1.PlatformTools.getEnvVariable("TYPEORM_SID"),
                            storage: PlatformTools_1.PlatformTools.getEnvVariable("TYPEORM_STORAGE"),
                            usePool: PlatformTools_1.PlatformTools.getEnvVariable("TYPEORM_USE_POOL") !== undefined ? OrmUtils_1.OrmUtils.toBoolean(PlatformTools_1.PlatformTools.getEnvVariable("TYPEORM_USE_POOL")) : undefined,
                            extra: PlatformTools_1.PlatformTools.getEnvVariable("TYPEORM_DRIVER_EXTRA") ? JSON.parse(PlatformTools_1.PlatformTools.getEnvVariable("TYPEORM_DRIVER_EXTRA")) : undefined
                        },
                        autoSchemaSync: OrmUtils_1.OrmUtils.toBoolean(PlatformTools_1.PlatformTools.getEnvVariable("TYPEORM_AUTO_SCHEMA_SYNC")),
                        entities: PlatformTools_1.PlatformTools.getEnvVariable("TYPEORM_ENTITIES") ? PlatformTools_1.PlatformTools.getEnvVariable("TYPEORM_ENTITIES").split(",") : [],
                        subscribers: PlatformTools_1.PlatformTools.getEnvVariable("TYPEORM_SUBSCRIBERS") ? PlatformTools_1.PlatformTools.getEnvVariable("TYPEORM_SUBSCRIBERS").split(",") : [],
                        entitySchemas: PlatformTools_1.PlatformTools.getEnvVariable("TYPEORM_ENTITY_SCHEMAS") ? PlatformTools_1.PlatformTools.getEnvVariable("TYPEORM_ENTITY_SCHEMAS").split(",") : [],
                        namingStrategies: PlatformTools_1.PlatformTools.getEnvVariable("TYPEORM_NAMING_STRATEGIES") ? PlatformTools_1.PlatformTools.getEnvVariable("TYPEORM_NAMING_STRATEGIES").split(",") : [],
                        usedNamingStrategy: PlatformTools_1.PlatformTools.getEnvVariable("TYPEORM_USED_NAMING_STRATEGY"),
                        logging: {
                            logQueries: OrmUtils_1.OrmUtils.toBoolean(PlatformTools_1.PlatformTools.getEnvVariable("TYPEORM_LOGGING_QUERIES")),
                            logFailedQueryError: OrmUtils_1.OrmUtils.toBoolean(PlatformTools_1.PlatformTools.getEnvVariable("TYPEORM_LOGGING_FAILED_QUERIES")),
                            logOnlyFailedQueries: OrmUtils_1.OrmUtils.toBoolean(PlatformTools_1.PlatformTools.getEnvVariable("TYPEORM_LOGGING_ONLY_FAILED_QUERIES")),
                        }
                    })];
            });
        });
    };
    /**
     * Creates a new connection based on the connection options from "ormconfig.json"
     * and registers a new connection in the manager.
     * Optionally you can specify a path to the json configuration.
     * If path is not given, then ormconfig.json file will be searched near node_modules directory.
     */
    ConnectionManager.prototype.createFromConfigAndConnectToAll = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var optionsArray, promises;
            return __generator(this, function (_a) {
                optionsArray = PlatformTools_1.PlatformTools.load(path || (PlatformTools_1.PlatformTools.load("app-root-path").path + "/ormconfig.json"));
                if (!optionsArray)
                    throw new Error("Configuration " + (path || "ormconfig.json") + " was not found. Add connection configuration inside ormconfig.json file.");
                promises = optionsArray
                    .filter(function (options) { return !options.environment || options.environment === PlatformTools_1.PlatformTools.getEnvVariable("NODE_ENV"); }) // skip connection creation if environment is set in the options, and its not equal to the value in the NODE_ENV variable
                    .map(function (options) { return _this.createAndConnectByConnectionOptions(options); });
                return [2 /*return*/, Promise.all(promises)];
            });
        });
    };
    /**
     * Creates a new connection based on the connection options from "ormconfig.json"
     * and registers a new connection in the manager.
     * Optionally you can specify a path to the json configuration.
     * If path is not given, then ormconfig.json file will be searched near node_modules directory.
     */
    ConnectionManager.prototype.createFromConfigAndConnect = function (connectionName, path) {
        return __awaiter(this, void 0, void 0, function () {
            var optionsArray, environmentLessOptions, options;
            return __generator(this, function (_a) {
                optionsArray = PlatformTools_1.PlatformTools.load(path || (PlatformTools_1.PlatformTools.load("app-root-path").path + "/ormconfig.json"));
                if (!optionsArray)
                    throw new Error("Configuration " + (path || "ormconfig.json") + " was not found. Add connection configuration inside ormconfig.json file.");
                environmentLessOptions = optionsArray.filter(function (options) { return (options.name || "default") === connectionName; });
                options = environmentLessOptions.filter(function (options) { return !options.environment || options.environment === PlatformTools_1.PlatformTools.getEnvVariable("NODE_ENV"); });
                if (!options.length)
                    throw new Error("Connection \"" + connectionName + "\" " + (PlatformTools_1.PlatformTools.getEnvVariable("NODE_ENV") ? "for the environment " + PlatformTools_1.PlatformTools.getEnvVariable("NODE_ENV") + " " : "") + "was not found in the json configuration file." +
                        (environmentLessOptions.length ? " However there are such configurations for other environments: " + environmentLessOptions.map(function (options) { return options.environment; }).join(", ") + "." : ""));
                return [2 /*return*/, this.createAndConnectByConnectionOptions(options[0])];
            });
        });
    };
    /**
     * Creates a new connection based on the given connection options and registers a new connection in the manager.
     */
    ConnectionManager.prototype.createAndConnectByConnectionOptions = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var connection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        connection = this.create(options);
                        // connect to the database
                        return [4 /*yield*/, connection.connect()];
                    case 1:
                        // connect to the database
                        _a.sent();
                        if (!(options.dropSchemaOnConnection && !PlatformTools_1.PlatformTools.getEnvVariable("SKIP_SCHEMA_CREATION"))) return [3 /*break*/, 3];
                        return [4 /*yield*/, connection.dropDatabase()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        if (!(options.autoSchemaSync && !PlatformTools_1.PlatformTools.getEnvVariable("SKIP_SCHEMA_CREATION"))) return [3 /*break*/, 5];
                        return [4 /*yield*/, connection.syncSchema()];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        if (!(options.autoMigrationsRun && !PlatformTools_1.PlatformTools.getEnvVariable("SKIP_MIGRATIONS_RUN"))) return [3 /*break*/, 7];
                        return [4 /*yield*/, connection.runMigrations()];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [2 /*return*/, connection];
                }
            });
        });
    };
    /**
     * Splits given array of mixed strings and / or functions into two separate array of string and array of functions.
     */
    ConnectionManager.prototype.splitStringsAndClasses = function (strAndClses) {
        return [
            strAndClses.filter(function (str) { return typeof str === "string"; }),
            strAndClses.filter(function (cls) { return typeof cls !== "string"; }),
        ];
    };
    /**
     * Creates a new driver based on the given driver type and options.
     */
    ConnectionManager.prototype.createDriver = function (options, logger) {
        switch (options.type) {
            case "mysql":
                return new MysqlDriver_1.MysqlDriver(options, logger, undefined);
            case "postgres":
                return new PostgresDriver_1.PostgresDriver(options, logger);
            case "mariadb":
                return new MysqlDriver_1.MysqlDriver(options, logger);
            case "sqlite":
                return new SqliteDriver_1.SqliteDriver(options, logger);
            case "oracle":
                return new OracleDriver_1.OracleDriver(options, logger);
            case "mssql":
                return new SqlServerDriver_1.SqlServerDriver(options, logger);
            case "websql":
                return new WebsqlDriver_1.WebsqlDriver(options, logger);
            default:
                throw new MissingDriverError_1.MissingDriverError(options.type);
        }
    };
    /**
     * Creates a new connection and registers it in the connection manager.
     */
    ConnectionManager.prototype.createConnection = function (name, driver, logger) {
        var existConnection = this.connections.find(function (connection) { return connection.name === name; });
        if (existConnection) {
            if (existConnection.isConnected)
                throw new AlreadyHasActiveConnectionError_1.AlreadyHasActiveConnectionError(name);
            this.connections.splice(this.connections.indexOf(existConnection), 1);
        }
        var connection = new Connection_1.Connection(name, driver, logger);
        this.connections.push(connection);
        return connection;
    };
    return ConnectionManager;
}());
exports.ConnectionManager = ConnectionManager;

//# sourceMappingURL=ConnectionManager.js.map
