"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Thrown when connection is trying to be created automatically from connection options found in the ormconfig.json
 * or environment variables, but failed due to missing these configurations.
 */
var CannotDetermineConnectionOptionsError = (function (_super) {
    __extends(CannotDetermineConnectionOptionsError, _super);
    function CannotDetermineConnectionOptionsError() {
        var _this = _super.call(this) || this;
        _this.name = "CannotDetermineConnectionOptionsError";
        _this.message = "Cannot create connection, because connection options are missing. " +
            "You either need to explicitly pass connection options, either create a ormconfig.json with connection options " +
            "and \"default\" connection name, either to set proper environment variables. Also, if you are using environment-specific " +
            "configurations in your ormconfig.json make sure your are running under correct NODE_ENV.";
        _this.stack = new Error().stack;
        return _this;
    }
    return CannotDetermineConnectionOptionsError;
}(Error));
exports.CannotDetermineConnectionOptionsError = CannotDetermineConnectionOptionsError;

//# sourceMappingURL=CannotDetermineConnectionOptionsError.js.map
