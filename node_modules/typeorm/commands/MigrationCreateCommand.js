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
var fs = require("fs");
/**
 * Creates a new migration file.
 */
var MigrationCreateCommand = (function () {
    function MigrationCreateCommand() {
        this.command = "migrations:create";
        this.describe = "Creates a new migration file.";
    }
    MigrationCreateCommand.prototype.builder = function (yargs) {
        return yargs
            .option("c", {
            alias: "connection",
            default: "default",
            describe: "Name of the connection on which run a query."
        })
            .option("n", {
            alias: "name",
            describe: "Name of the migration class.",
            demand: true
        })
            .option("d", {
            alias: "dir",
            describe: "Directory where migration should be created."
        })
            .option("cf", {
            alias: "config",
            default: "ormconfig.json",
            describe: "Name of the file with connection configuration."
        });
    };
    MigrationCreateCommand.prototype.handler = function (argv) {
        return __awaiter(this, void 0, void 0, function () {
            var timestamp, fileContent, filename, directory, connections, connection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        timestamp = new Date().getTime();
                        fileContent = MigrationCreateCommand.getTemplate(argv.name, timestamp);
                        filename = timestamp + "-" + argv.name + ".ts";
                        directory = argv.dir;
                        // if directory is not set then try to open tsconfig and find default path there
                        if (!directory) {
                            try {
                                connections = require(process.cwd() + "/" + argv.config);
                                if (connections) {
                                    connection = connections.find(function (connection) {
                                        return connection.name === argv.connection || ((argv.connection === "default" || !argv.connection) && !connection.name);
                                    });
                                    if (connection && connection.cli) {
                                        directory = connection.cli.migrationsDir;
                                    }
                                }
                            }
                            catch (err) { }
                        }
                        return [4 /*yield*/, MigrationCreateCommand.createFile(process.cwd() + "/" + (directory ? (directory + "/") : "") + filename, fileContent)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // -------------------------------------------------------------------------
    // Protected Static Methods
    // -------------------------------------------------------------------------
    /**
     * Creates a file with the given content in the given path.
     */
    MigrationCreateCommand.createFile = function (path, content) {
        return new Promise(function (ok, fail) {
            fs.writeFile(path, content, function (err) { return err ? fail(err) : ok(); });
        });
    };
    /**
     * Gets contents of the migration file.
     */
    MigrationCreateCommand.getTemplate = function (name, timestamp) {
        return "import {Connection, EntityManager, MigrationInterface, QueryRunner} from \"typeorm\";\n\nexport class " + name + timestamp + " implements MigrationInterface {\n\n    public async up(queryRunner: QueryRunner, connection: Connection, entityManager?: EntityManager): Promise<any> {\n    }\n\n    public async down(queryRunner: QueryRunner, connection: Connection, entityManager?: EntityManager): Promise<any> {\n    }\n\n}\n";
    };
    return MigrationCreateCommand;
}());
exports.MigrationCreateCommand = MigrationCreateCommand;

//# sourceMappingURL=MigrationCreateCommand.js.map
