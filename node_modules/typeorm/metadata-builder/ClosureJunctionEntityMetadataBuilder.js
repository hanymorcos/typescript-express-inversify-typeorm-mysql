"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EntityMetadata_1 = require("../metadata/EntityMetadata");
var ColumnMetadata_1 = require("../metadata/ColumnMetadata");
var ForeignKeyMetadata_1 = require("../metadata/ForeignKeyMetadata");
var TableMetadata_1 = require("../metadata/TableMetadata");
var ColumnTypes_1 = require("../metadata/types/ColumnTypes");
/**
 * Helps to create EntityMetadatas for junction tables for closure tables.
 */
var ClosureJunctionEntityMetadataBuilder = (function () {
    function ClosureJunctionEntityMetadataBuilder() {
    }
    ClosureJunctionEntityMetadataBuilder.prototype.build = function (driver, lazyRelationsWrapper, args) {
        var columns = [
            new ColumnMetadata_1.ColumnMetadata({
                target: "__virtual__",
                propertyName: "__virtual__",
                propertyType: args.primaryColumn.type,
                mode: "virtual",
                options: {
                    length: args.primaryColumn.length,
                    type: args.primaryColumn.type,
                    name: "ancestor"
                }
            }),
            new ColumnMetadata_1.ColumnMetadata({
                target: "__virtual__",
                propertyName: "__virtual__",
                propertyType: args.primaryColumn.type,
                mode: "virtual",
                options: {
                    length: args.primaryColumn.length,
                    type: args.primaryColumn.type,
                    name: "descendant"
                }
            })
        ];
        if (args.hasTreeLevelColumn) {
            columns.push(new ColumnMetadata_1.ColumnMetadata({
                target: "__virtual__",
                propertyName: "__virtual__",
                propertyType: ColumnTypes_1.ColumnTypes.INTEGER,
                mode: "virtual",
                options: {
                    type: ColumnTypes_1.ColumnTypes.INTEGER,
                    name: "level"
                }
            }));
        }
        var closureJunctionTableMetadata = new TableMetadata_1.TableMetadata({
            target: "__virtual__",
            name: args.table.name,
            type: "closure-junction"
        });
        return new EntityMetadata_1.EntityMetadata({
            junction: true,
            target: "__virtual__",
            tablesPrefix: driver.options.tablesPrefix,
            namingStrategy: args.namingStrategy,
            tableMetadata: closureJunctionTableMetadata,
            columnMetadatas: columns,
            foreignKeyMetadatas: [
                new ForeignKeyMetadata_1.ForeignKeyMetadata([columns[0]], args.table, [args.primaryColumn]),
                new ForeignKeyMetadata_1.ForeignKeyMetadata([columns[1]], args.table, [args.primaryColumn])
            ]
        }, lazyRelationsWrapper);
    };
    return ClosureJunctionEntityMetadataBuilder;
}());
exports.ClosureJunctionEntityMetadataBuilder = ClosureJunctionEntityMetadataBuilder;

//# sourceMappingURL=ClosureJunctionEntityMetadataBuilder.js.map
