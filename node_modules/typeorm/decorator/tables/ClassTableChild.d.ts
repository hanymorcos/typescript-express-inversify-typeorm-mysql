import { EntityOptions } from "../options/EntityOptions";
/**
 * Special type of the table used in the class-table inherited tables.
 *
 * @deprecated Use @ClassEntityChild decorator instead.
 */
export declare function ClassTableChild(tableName?: string, options?: EntityOptions): (target: Function) => void;
