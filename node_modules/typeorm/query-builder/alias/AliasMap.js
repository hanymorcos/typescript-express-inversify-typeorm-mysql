"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 */
var AliasMap = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function AliasMap(connection) {
        this.connection = connection;
        // -------------------------------------------------------------------------
        // Properties
        // -------------------------------------------------------------------------
        this.aliases = [];
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    AliasMap.prototype.addMainAlias = function (alias) {
        if (this.hasMainAlias)
            this.aliases.splice(this.aliases.indexOf(this.mainAlias), 1);
        alias.isMain = true;
        this.aliases.push(alias);
    };
    AliasMap.prototype.addAlias = function (alias) {
        this.aliases.push(alias);
    };
    Object.defineProperty(AliasMap.prototype, "hasMainAlias", {
        get: function () {
            return !!this.aliases.find(function (alias) { return alias.isMain; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AliasMap.prototype, "mainAlias", {
        get: function () {
            var alias = this.aliases.find(function (alias) { return alias.isMain; });
            if (!alias)
                throw new Error("Main alias is not set.");
            return alias;
        },
        enumerable: true,
        configurable: true
    });
    AliasMap.prototype.findAliasByName = function (name) {
        return this.aliases.find(function (alias) { return alias.name === name; });
    };
    AliasMap.prototype.findAliasByParent = function (parentAliasName, parentPropertyName) {
        return this.aliases.find(function (alias) {
            return alias.parentAliasName === parentAliasName && alias.parentPropertyName === parentPropertyName;
        });
    };
    AliasMap.prototype.getEntityMetadataByAlias = function (alias) {
        if (alias.target) {
            // todo: use connection.getMetadata instead?
            return this.connection.getMetadata(alias.target);
        }
        else if (alias.parentAliasName && alias.parentPropertyName) {
            var parentAlias = this.findAliasByName(alias.parentAliasName);
            if (!parentAlias)
                throw new Error("Alias \"" + alias.parentAliasName + "\" was not found");
            var parentEntityMetadata = this.getEntityMetadataByAlias(parentAlias);
            if (!parentEntityMetadata)
                throw new Error("Cannot get entity metadata for the given alias " + alias.name);
            if (!parentEntityMetadata.hasRelationWithPropertyName(alias.parentPropertyName))
                throw new Error("Relation metadata for " + alias.parentAliasName + "#" + alias.parentPropertyName + " was not found.");
            var relation = parentEntityMetadata.findRelationWithPropertyName(alias.parentPropertyName);
            return relation.inverseEntityMetadata;
        }
        return undefined;
    };
    return AliasMap;
}());
exports.AliasMap = AliasMap;

//# sourceMappingURL=AliasMap.js.map
