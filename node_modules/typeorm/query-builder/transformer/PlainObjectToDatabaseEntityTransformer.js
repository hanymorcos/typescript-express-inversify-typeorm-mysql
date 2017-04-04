"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Transforms plain old javascript object
 * Entity is constructed based on its entity metadata.
 */
var PlainObjectToDatabaseEntityTransformer = (function () {
    function PlainObjectToDatabaseEntityTransformer() {
    }
    // constructor(protected namingStrategy: NamingStrategyInterface) {
    // }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    PlainObjectToDatabaseEntityTransformer.prototype.transform = function (plainObject, metadata, queryBuilder) {
        return __awaiter(this, void 0, void 0, function () {
            var alias, needToLoad;
            return __generator(this, function (_a) {
                // if plain object does not have id then nothing to load really
                if (!metadata.checkIfObjectContainsAllPrimaryKeys(plainObject))
                    return [2 /*return*/, Promise.reject("Given object does not have a primary column, cannot transform it to database entity.")];
                alias = queryBuilder.alias;
                needToLoad = this.buildLoadMap(plainObject, metadata, true);
                this.join(queryBuilder, needToLoad, alias);
                metadata.primaryColumns.forEach(function (primaryColumn) {
                    queryBuilder
                        .andWhere(alias + "." + primaryColumn.propertyName + "=:" + primaryColumn.propertyName)
                        .setParameter(primaryColumn.propertyName, plainObject[primaryColumn.propertyName]);
                });
                if (metadata.parentEntityMetadata) {
                    metadata.parentEntityMetadata.primaryColumns.forEach(function (primaryColumn) {
                        var parentIdColumn = metadata.parentIdColumns.find(function (parentIdColumn) {
                            return parentIdColumn.propertyName === primaryColumn.propertyName;
                        });
                        if (!parentIdColumn)
                            throw new Error("Prent id column for the given primary column was not found.");
                        queryBuilder
                            .andWhere(alias + "." + parentIdColumn.propertyName + "=:" + primaryColumn.propertyName)
                            .setParameter(primaryColumn.propertyName, plainObject[primaryColumn.propertyName]);
                    });
                }
                return [2 /*return*/, queryBuilder.getOne()];
            });
        });
    };
    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------
    PlainObjectToDatabaseEntityTransformer.prototype.join = function (qb, needToLoad, parentAlias) {
        var _this = this;
        needToLoad.forEach(function (i) {
            var alias = parentAlias + "_" + i.name;
            qb.leftJoinAndSelect(parentAlias + "." + i.name, alias);
            if (i.child && i.child.length)
                _this.join(qb, i.child, alias);
        });
    };
    PlainObjectToDatabaseEntityTransformer.prototype.buildLoadMap = function (object, metadata, isFirstLevelDepth) {
        var _this = this;
        if (isFirstLevelDepth === void 0) { isFirstLevelDepth = false; }
        // todo: rething the way we are trying to load things using left joins cause there are situations when same
        // todo: entities are loaded multiple times and become different objects (problem with duplicate entities in dbEntities)
        return metadata.relations
            .filter(function (relation) { return object.hasOwnProperty(relation.propertyName); })
            .filter(function (relation) {
            // we only need to load empty relations for first-level depth objects, otherwise removal can break
            // this is not reliable, refactor this part later
            var value = (object[relation.propertyName] instanceof Promise && relation.isLazy) ? object["__" + relation.propertyName + "__"] : object[relation.propertyName];
            return isFirstLevelDepth || !(value instanceof Array) || value.length > 0;
        })
            .map(function (relation) {
            var value = (object[relation.propertyName] instanceof Promise && relation.isLazy) ? object["__" + relation.propertyName + "__"] : object[relation.propertyName];
            // let value = object[relation.propertyName];
            if (value instanceof Array)
                value = Object.assign.apply(Object, [{}].concat(value));
            var child = value ? _this.buildLoadMap(value, relation.inverseEntityMetadata) : [];
            return { name: relation.propertyName, child: child };
        });
    };
    return PlainObjectToDatabaseEntityTransformer;
}());
exports.PlainObjectToDatabaseEntityTransformer = PlainObjectToDatabaseEntityTransformer;

//# sourceMappingURL=PlainObjectToDatabaseEntityTransformer.js.map
