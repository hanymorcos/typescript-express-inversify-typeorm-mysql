import { FindOptions } from "./FindOptions";
import { QueryBuilder } from "../query-builder/QueryBuilder";
/**
 * Utilities to work with FindOptions.
 */
export declare class FindOptionsUtils {
    /**
     * Checks if given object is really instance of FindOptions interface.
     */
    static isFindOptions(object: any): object is FindOptions;
    /**
     * Applies give find options to the given query builder.
     */
    static applyOptionsToQueryBuilder(qb: QueryBuilder<any>, options: FindOptions): QueryBuilder<any>;
}
