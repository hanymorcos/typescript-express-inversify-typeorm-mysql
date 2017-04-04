"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 */
var Alias = (function () {
    function Alias(name) {
        this.name = name;
    }
    Object.defineProperty(Alias.prototype, "selection", {
        get: function () {
            return this.parentAliasName + "." + this.parentPropertyName;
        },
        enumerable: true,
        configurable: true
    });
    return Alias;
}());
exports.Alias = Alias;

//# sourceMappingURL=Alias.js.map
