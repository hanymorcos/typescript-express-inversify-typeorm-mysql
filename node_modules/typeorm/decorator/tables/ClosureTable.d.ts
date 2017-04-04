import { EntityOptions } from "../options/EntityOptions";
/**
 * Used on a tables that stores its children in a tree using closure deisgn pattern.
 *
 * @deprecated Use @ClosureEntity decorator instead.
 */
export declare function ClosureTable(name?: string, options?: EntityOptions): (target: Function) => void;
