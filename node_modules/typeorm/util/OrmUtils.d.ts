import { ObjectLiteral } from "../common/ObjectLiteral";
export declare class OrmUtils {
    static groupBy<T, R>(array: T[], propertyCallback: (item: T) => R): {
        id: R;
        items: T[];
    }[];
    /**
     * Transforms given value into boolean value.
     */
    static toBoolean(value: any): boolean;
    /**
     * Composes an object from the given array of keys and values.
     */
    static zipObject(keys: any[], values: any[]): ObjectLiteral;
}
