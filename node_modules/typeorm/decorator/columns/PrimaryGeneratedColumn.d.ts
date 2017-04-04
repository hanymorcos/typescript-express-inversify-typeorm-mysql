import { ColumnOptions } from "../options/ColumnOptions";
/**
 * Column decorator is used to mark a specific class property as a table column.
 * Only properties decorated with this decorator will be persisted to the database when entity be saved.
 * This column creates an integer PRIMARY COLUMN with generated set to true.
 * This column creates is an alias for @PrimaryColumn("int", { generated: true }).
 */
export declare function PrimaryGeneratedColumn(options?: ColumnOptions): Function;
