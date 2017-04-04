import { ColumnOptions } from "../options/ColumnOptions";
import { ColumnType } from "../../metadata/types/ColumnTypes";
/**
 * Column decorator is used to mark a specific class property as a table column. Only properties decorated with this
 * decorator will be persisted to the database when entity be saved.
 */
export declare function Column(): Function;
/**
 * Column decorator is used to mark a specific class property as a table column.
 * Only properties decorated with this decorator will be persisted to the database when entity be saved.
 */
export declare function Column(type: ColumnType): Function;
/**
 * Column decorator is used to mark a specific class property as a table column.
 * Only properties decorated with this decorator will be persisted to the database when entity be saved.
 */
export declare function Column(options: ColumnOptions): Function;
/**
 * Column decorator is used to mark a specific class property as a table column.
 * Only properties decorated with this decorator will be persisted to the database when entity be saved.
 */
export declare function Column(type: ColumnType, options: ColumnOptions): Function;
