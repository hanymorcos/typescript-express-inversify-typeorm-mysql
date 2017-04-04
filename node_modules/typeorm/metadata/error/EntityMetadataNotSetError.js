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
 * Thrown when accessed to the class with entity metadata,
 * however on that time entity metadata is not set in the class.
 */
var EntityMetadataNotSetError = (function (_super) {
    __extends(EntityMetadataNotSetError, _super);
    function EntityMetadataNotSetError(type, target, tableName) {
        var _this = _super.call(this) || this;
        _this.name = "EntityMetadataNotSetError";
        var targetMessage = target ? " for " + (target instanceof Function ? target.constructor.name : target) : "";
        var tableNameMessage = tableName ? " with " + tableName + " table name" : "";
        _this.message = "Entity metadata" + targetMessage + tableNameMessage + " is not set in " + type.constructor.name;
        return _this;
    }
    return EntityMetadataNotSetError;
}(Error));
exports.EntityMetadataNotSetError = EntityMetadataNotSetError;

//# sourceMappingURL=EntityMetadataNotSetError.js.map
