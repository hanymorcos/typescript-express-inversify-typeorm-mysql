"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OrmUtils = (function () {
    function OrmUtils() {
    }
    OrmUtils.groupBy = function (array, propertyCallback) {
        return array.reduce(function (groupedArray, value) {
            var key = propertyCallback(value);
            var grouped = groupedArray.find(function (i) { return i.id === key; });
            if (!grouped) {
                grouped = { id: key, items: [] };
                groupedArray.push(grouped);
            }
            grouped.items.push(value);
            return groupedArray;
        }, []);
    };
    /**
     * Transforms given value into boolean value.
     */
    OrmUtils.toBoolean = function (value) {
        if (typeof value === "boolean")
            return value;
        if (typeof value === "string")
            return value === "true" || value === "1";
        if (typeof value === "number")
            return value > 0;
        return false;
    };
    /**
     * Composes an object from the given array of keys and values.
     */
    OrmUtils.zipObject = function (keys, values) {
        return keys.reduce(function (object, column, index) {
            object[column] = values[index];
            return object;
        }, {});
    };
    return OrmUtils;
}());
exports.OrmUtils = OrmUtils;

//# sourceMappingURL=OrmUtils.js.map
