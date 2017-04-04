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
 * Thrown when consumer tries to run/revert migrations without connection set.
 */
var CannotRunMigrationNotConnectedError = (function (_super) {
    __extends(CannotRunMigrationNotConnectedError, _super);
    function CannotRunMigrationNotConnectedError(connectionName) {
        var _this = _super.call(this) || this;
        _this.name = "CannotRunMigrationNotConnectedError";
        _this.message = "Cannot run/revert migrations on \"" + connectionName + "\" connection because connection is not yet established.";
        _this.stack = new Error().stack;
        return _this;
    }
    return CannotRunMigrationNotConnectedError;
}(Error));
exports.CannotRunMigrationNotConnectedError = CannotRunMigrationNotConnectedError;

//# sourceMappingURL=CannotRunMigrationNotConnectedError.js.map
