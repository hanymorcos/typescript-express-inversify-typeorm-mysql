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
 * Thrown when consumer tries to change used naming strategy after connection is established.
 */
var CannotUseNamingStrategyNotConnectedError = (function (_super) {
    __extends(CannotUseNamingStrategyNotConnectedError, _super);
    function CannotUseNamingStrategyNotConnectedError(connectionName) {
        var _this = _super.call(this) || this;
        _this.name = "CannotUseNamingStrategyNotConnectedError";
        _this.message = "Cannot use a given naming strategy for \"" + connectionName + "\" connection because connection to the database already established.";
        _this.stack = new Error().stack;
        return _this;
    }
    return CannotUseNamingStrategyNotConnectedError;
}(Error));
exports.CannotUseNamingStrategyNotConnectedError = CannotUseNamingStrategyNotConnectedError;

//# sourceMappingURL=CannotUseNamingStrategyNotConnectedError.js.map
