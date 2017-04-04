"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Common driver utility functions.
 */
var DriverUtils = (function () {
    function DriverUtils() {
    }
    // -------------------------------------------------------------------------
    // Public Static Methods
    // -------------------------------------------------------------------------
    /**
     * Normalizes and builds a new driver options.
     * Extracts settings from connection url and sets to a new options object.
     */
    DriverUtils.buildDriverOptions = function (options, buildOptions) {
        if (options.url) {
            var parsedUrl = this.parseConnectionUrl(options.url);
            if (buildOptions && buildOptions.useSid) {
                var urlDriverOptions = {
                    type: options.type,
                    host: parsedUrl.host,
                    username: parsedUrl.username,
                    password: parsedUrl.password,
                    port: parsedUrl.port,
                    sid: parsedUrl.database
                };
                return Object.assign(urlDriverOptions, options);
            }
            else {
                var urlDriverOptions = {
                    type: options.type,
                    host: parsedUrl.host,
                    username: parsedUrl.username,
                    password: parsedUrl.password,
                    port: parsedUrl.port,
                    database: parsedUrl.database
                };
                return Object.assign(urlDriverOptions, options);
            }
        }
        return Object.assign({}, options);
    };
    // -------------------------------------------------------------------------
    // Private Static Methods
    // -------------------------------------------------------------------------
    /**
     * Extracts connection data from the connection url.
     */
    DriverUtils.parseConnectionUrl = function (url) {
        var firstSlashes = url.indexOf("//");
        var preBase = url.substr(firstSlashes + 2);
        var secondSlash = preBase.indexOf("/");
        var base = (secondSlash !== -1) ? preBase.substr(0, secondSlash) : preBase;
        var afterBase = (secondSlash !== -1) ? preBase.substr(secondSlash + 1) : undefined;
        var _a = base.split("@"), usernameAndPassword = _a[0], hostAndPort = _a[1];
        var _b = usernameAndPassword.split(":"), username = _b[0], password = _b[1];
        var _c = hostAndPort.split(":"), host = _c[0], port = _c[1];
        return {
            host: host,
            username: username,
            password: password,
            port: port ? parseInt(port) : undefined,
            database: afterBase || undefined
        };
    };
    return DriverUtils;
}());
exports.DriverUtils = DriverUtils;

//# sourceMappingURL=DriverUtils.js.map
