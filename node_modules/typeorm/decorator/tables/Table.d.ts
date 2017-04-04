import { EntityOptions } from "../options/EntityOptions";
/**
 * This decorator is used to mark classes that will be a tables. Database schema will be created for all classes
 * decorated with it, and Repository can be retrieved and used for it.
 *
 * @deprecated Use @Entity decorator instead.
 */
export declare function Table(name?: string, options?: EntityOptions): (target: Function) => void;
