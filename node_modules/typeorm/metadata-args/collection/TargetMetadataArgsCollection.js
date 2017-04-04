"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MetadataAlreadyExistsError_1 = require("../../metadata-builder/error/MetadataAlreadyExistsError");
var TargetMetadataArgsCollection = (function () {
    function TargetMetadataArgsCollection() {
        // -------------------------------------------------------------------------
        // Protected Properties
        // -------------------------------------------------------------------------
        this.items = [];
    }
    Object.defineProperty(TargetMetadataArgsCollection.prototype, "length", {
        // -------------------------------------------------------------------------
        // Public Properties
        // -------------------------------------------------------------------------
        get: function () {
            return this.items.length;
        },
        enumerable: true,
        configurable: true
    });
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    TargetMetadataArgsCollection.prototype.filter = function (callbackfn, thisArg) {
        var collection = new this.constructor();
        this.items.filter(callbackfn).forEach(function (metadata) { return collection.add(metadata); });
        return collection;
    };
    TargetMetadataArgsCollection.prototype.filterByTarget = function (cls) {
        // if no class specified then simply return empty collection
        if (!cls)
            return new this.constructor();
        return this.filterByTargets([cls]);
    };
    TargetMetadataArgsCollection.prototype.filterByTargets = function (classes) {
        return this.filter(function (metadata) {
            if (!metadata.target)
                return false;
            return classes.indexOf(metadata.target) !== -1;
        });
    };
    TargetMetadataArgsCollection.prototype.add = function (metadata, checkForDuplicateTargets) {
        if (checkForDuplicateTargets === void 0) { checkForDuplicateTargets = false; }
        if (checkForDuplicateTargets) {
            if (!metadata.target || !(metadata.target instanceof Function))
                throw new Error("Target is not set in the given metadata.");
            if (this.hasWithTarget(metadata.target))
                throw new MetadataAlreadyExistsError_1.MetadataAlreadyExistsError(metadata.constructor.name, metadata.target);
        }
        this.items.push(metadata);
    };
    TargetMetadataArgsCollection.prototype.toArray = function () {
        return this.items.map(function (item) { return item; });
    };
    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------
    TargetMetadataArgsCollection.prototype.hasWithTarget = function (constructor) {
        return !!this.items.find(function (metadata) { return metadata.target === constructor; });
    };
    return TargetMetadataArgsCollection;
}());
exports.TargetMetadataArgsCollection = TargetMetadataArgsCollection;

//# sourceMappingURL=TargetMetadataArgsCollection.js.map
