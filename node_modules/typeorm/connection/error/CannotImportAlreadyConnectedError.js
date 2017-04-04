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
 * Thrown when consumer tries to import entities / entity schemas / subscribers / naming strategies after connection
 * is established.
 */
var CannotImportAlreadyConnectedError = (function (_super) {
    __extends(CannotImportAlreadyConnectedError, _super);
    function CannotImportAlreadyConnectedError(importStuff, connectionName) {
        var _this = _super.call(this) || this;
        _this.name = "CannotImportAlreadyConnected";
        _this.message = "Cannot import " + importStuff + " for \"" + connectionName + "\" connection because connection to the database already established.";
        _this.stack = new Error().stack;
        return _this;
    }
    return CannotImportAlreadyConnectedError;
}(Error));
exports.CannotImportAlreadyConnectedError = CannotImportAlreadyConnectedError;

//# sourceMappingURL=CannotImportAlreadyConnectedError.js.map
