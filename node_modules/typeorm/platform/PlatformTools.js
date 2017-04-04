"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs = require("fs");
/**
 * Platform-specific tools.
 */
var PlatformTools = (function () {
    function PlatformTools() {
    }
    /**
     * Gets global variable where global stuff can be stored.
     */
    PlatformTools.getGlobalVariable = function () {
        return global;
    };
    /**
     * Loads ("require"-s) given file or package.
     * This operation only supports on node platform
     */
    PlatformTools.load = function (name) {
        // if name is not absolute or relative, then try to load package from the node_modules of the directory we are currenly in
        // this is useful when we are using typeorm package globally installed and it accesses drivers
        // that are not installed globally
        try {
            return require(name);
        }
        catch (err) {
            if (!path.isAbsolute(name) && name.substr(0, 2) !== "./" && name.substr(0, 3) !== "../") {
                return require(path.resolve(process.cwd() + "/node_modules/" + name));
            }
            throw err;
        }
    };
    /**
     * Normalizes given path. Does "path.normalize".
     */
    PlatformTools.pathNormilize = function (pathStr) {
        return path.normalize(pathStr);
    };
    /**
     * Gets file extension. Does "path.extname".
     */
    PlatformTools.pathExtname = function (pathStr) {
        return path.extname(pathStr);
    };
    /**
     * Resolved given path. Does "path.resolve".
     */
    PlatformTools.pathResolve = function (pathStr) {
        return path.resolve(pathStr);
    };
    /**
     * Synchronously checks if file exist. Does "fs.existsSync".
     */
    PlatformTools.fileExist = function (pathStr) {
        return fs.existsSync(pathStr);
    };
    /**
     * Gets environment variable.
     */
    PlatformTools.getEnvVariable = function (name) {
        return process.env[name];
    };
    return PlatformTools;
}());
/**
 * Type of the currently running platform.
 */
PlatformTools.type = "node";
exports.PlatformTools = PlatformTools;

//# sourceMappingURL=PlatformTools.js.map
