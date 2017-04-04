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
 * Thrown when consumer tries close not opened connection.
 */
var CannotCloseNotConnectedError = (function (_super) {
    __extends(CannotCloseNotConnectedError, _super);
    function CannotCloseNotConnectedError(connectionName) {
        var _this = _super.call(this) || this;
        _this.name = "CannotCloseNotConnectedError";
        _this.message = "Cannot close \"" + connectionName + "\" connection because connection is not yet established.";
        _this.stack = new Error().stack;
        return _this;
    }
    return CannotCloseNotConnectedError;
}(Error));
exports.CannotCloseNotConnectedError = CannotCloseNotConnectedError;

//# sourceMappingURL=CannotCloseNotConnectedError.js.map
