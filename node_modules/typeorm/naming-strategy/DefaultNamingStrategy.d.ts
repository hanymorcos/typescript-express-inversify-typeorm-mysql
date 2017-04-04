import { NamingStrategyInterface } from "./NamingStrategyInterface";
/**
 * Naming strategy that is used by default.
 */
export declare class DefaultNamingStrategy implements NamingStrategyInterface {
    tableName(className: string, customName: string): string;
    columnName(propertyName: string, customName: string): string;
    embeddedColumnName(embeddedPropertyName: string, columnPropertyName: string, columnCustomName?: string): string;
    relationName(propertyName: string): string;
    indexName(customName: string | undefined, tableName: string, columns: string[]): string;
    joinColumnInverseSideName(joinColumnName: string, propertyName: string): string;
    joinTableName(firstTableName: string, secondTableName: string, firstPropertyName: string, secondPropertyName: string, firstColumnName: string, secondColumnName: string): string;
    joinTableColumnName(tableName: string, columnName: string, secondTableName: string, secondColumnName: string): string;
    joinTableInverseColumnName(tableName: string, columnName: string, secondTableName: string, secondColumnName: string): string;
    closureJunctionTableName(tableName: string): string;
    foreignKeyName(tableName: string, columnNames: string[], referencedTableName: string, referencedColumnNames: string[]): string;
    classTableInheritanceParentColumnName(parentTableName: any, parentTableIdPropertyName: any): string;
    /**
     * Adds prefix to the table.
     */
    prefixTableName(prefix: string, originalTableName: string): string;
}
