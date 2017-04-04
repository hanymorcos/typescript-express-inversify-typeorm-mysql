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
var index_1 = require("../index");
/**
 * Synchronizes database schema with entities.
 */
var SchemaSyncCommand = (function () {
    function SchemaSyncCommand() {
        this.command = "schema:sync";
        this.describe = "Synchronizes your entities with database schema. It runs schema update queries on all connections you have. " +
            "To run update queries on a concrete connection use -c option.";
    }
    SchemaSyncCommand.prototype.builder = function (yargs) {
        return yargs
            .option("c", {
            alias: "connection",
            default: "default",
            describe: "Name of the connection on which schema synchronization needs to to run."
        })
            .option("cf", {
            alias: "config",
            default: "ormconfig.json",
            describe: "Name of the file with connection configuration."
        });
    };
    SchemaSyncCommand.prototype.handler = function (argv) {
        return __awaiter(this, void 0, void 0, function () {
            var connection, connections, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        connection = undefined, connections = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 9, 10, 14]);
                        process.env.LOGGER_CLI_SCHEMA_SYNC = true;
                        process.env.SKIP_SCHEMA_CREATION = true;
                        if (!argv.connection) return [3 /*break*/, 5];
                        return [4 /*yield*/, index_1.createConnection(argv.connection, process.cwd() + "/" + argv.config)];
                    case 2:
                        connection = _a.sent();
                        return [4 /*yield*/, connection.syncSchema(false)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, connection.close()];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 5: return [4 /*yield*/, index_1.createConnections()];
                    case 6:
                        connections = _a.sent();
                        return [4 /*yield*/, Promise.all(connections.map(function (connection) { return connection.syncSchema(false); }))];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8: return [3 /*break*/, 14];
                    case 9:
                        err_1 = _a.sent();
                        if (connection)
                            connection.logger.log("error", err_1);
                        throw err_1;
                    case 10:
                        if (!connection) return [3 /*break*/, 12];
                        return [4 /*yield*/, connection.close()];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12: return [4 /*yield*/, Promise.all(connections.map(function (connection) { return connection.close(); }))];
                    case 13:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    return SchemaSyncCommand;
}());
exports.SchemaSyncCommand = SchemaSyncCommand;

//# sourceMappingURL=SchemaSyncCommand.js.map
