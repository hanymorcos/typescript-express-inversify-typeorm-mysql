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
 * Thrown when consumer tries to sync a database schema after connection is established
 */
var CannotSyncNotConnectedError = (function (_super) {
    __extends(CannotSyncNotConnectedError, _super);
    function CannotSyncNotConnectedError(connectionName) {
        var _this = _super.call(this) || this;
        _this.name = "CannotSyncNotConnectedError";
        _this.message = "Cannot sync schema of the \"" + connectionName + "\" connection because connection is not yet established.";
        _this.stack = new Error().stack;
        return _this;
    }
    return CannotSyncNotConnectedError;
}(Error));
exports.CannotSyncNotConnectedError = CannotSyncNotConnectedError;

//# sourceMappingURL=CannotSyncNotConnectedError.js.map
