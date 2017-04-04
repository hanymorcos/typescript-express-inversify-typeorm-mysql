"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Converts string into camelCase.
 *
 * @see http://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
 */
function camelCase(str) {
    return str.replace(/^([A-Z])|[\s-_](\w)/g, function (match, p1, p2, offset) {
        if (p2)
            return p2.toUpperCase();
        return p1.toLowerCase();
    });
}
exports.camelCase = camelCase;
/**
 * Converts string into snake-case.
 *
 * @see http://stackoverflow.com/questions/30521224/javascript-convert-pascalcase-to-underscore-case
 */
function snakeCase(str) {
    return str.replace(/(?:^|\.?)([A-Z])/g, function (x, y) { return "_" + y.toLowerCase(); }).replace(/^_/, "");
}
exports.snakeCase = snakeCase;

//# sourceMappingURL=StringUtils.js.map
