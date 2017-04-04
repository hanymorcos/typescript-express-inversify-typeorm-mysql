"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ColumnMetadata_1 = require("../metadata/ColumnMetadata");
var ForeignKeyMetadata_1 = require("../metadata/ForeignKeyMetadata");
var TableMetadata_1 = require("../metadata/TableMetadata");
var IndexMetadata_1 = require("../metadata/IndexMetadata");
var EntityMetadata_1 = require("../metadata/EntityMetadata");
/**
 * Helps to create EntityMetadatas for junction tables.
 */
var JunctionEntityMetadataBuilder = (function () {
    function JunctionEntityMetadataBuilder() {
    }
    JunctionEntityMetadataBuilder.prototype.build = function (driver, lazyRelationsWrapper, args) {
        var column1 = args.joinTable.referencedColumn;
        var column2 = args.joinTable.inverseReferencedColumn;
        var tableMetadata = new TableMetadata_1.TableMetadata({
            target: "",
            name: args.joinTable.name,
            type: "junction"
        });
        var junctionColumn1 = new ColumnMetadata_1.ColumnMetadata({
            target: "__virtual__",
            // propertyType: column1.type,
            propertyName: args.joinTable.joinColumnName,
            mode: "virtual",
            options: {
                length: column1.length,
                type: column1.type,
                name: args.joinTable.joinColumnName,
                nullable: false,
                primary: true
            }
        });
        var junctionColumn2 = new ColumnMetadata_1.ColumnMetadata({
            target: "__virtual__",
            // propertyType: column2.type,
            propertyName: args.joinTable.inverseJoinColumnName,
            mode: "virtual",
            options: {
                length: column2.length,
                type: column2.type,
                name: args.joinTable.inverseJoinColumnName,
                nullable: false,
                primary: true
            }
        });
        var entityMetadata = new EntityMetadata_1.EntityMetadata({
            junction: true,
            target: "__virtual__",
            tablesPrefix: driver.options.tablesPrefix,
            namingStrategy: args.namingStrategy,
            tableMetadata: tableMetadata,
            columnMetadatas: [
                junctionColumn1,
                junctionColumn2
            ],
            foreignKeyMetadatas: [
                new ForeignKeyMetadata_1.ForeignKeyMetadata([junctionColumn1], args.firstTable, [column1]),
                new ForeignKeyMetadata_1.ForeignKeyMetadata([junctionColumn2], args.secondTable, [column2])
            ],
            indexMetadatas: [
                new IndexMetadata_1.IndexMetadata({ columns: [args.joinTable.joinColumnName], unique: false }),
                new IndexMetadata_1.IndexMetadata({ columns: [args.joinTable.inverseJoinColumnName], unique: false })
            ]
        }, lazyRelationsWrapper);
        entityMetadata.columns[0].entityMetadata = entityMetadata;
        entityMetadata.columns[1].entityMetadata = entityMetadata;
        return entityMetadata;
    };
    return JunctionEntityMetadataBuilder;
}());
exports.JunctionEntityMetadataBuilder = JunctionEntityMetadataBuilder;

//# sourceMappingURL=JunctionEntityMetadataBuilder.js.map
