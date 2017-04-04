import { ObjectType } from "../common/ObjectType";
/**
 * Property in entity can be marked as Embedded, and on persist all columns from the embedded are mapped to the
 * single table of the entity where Embedded is used. And on hydration all columns which supposed to be in the
 * embedded will be mapped to it from the single table.
 */
export declare function Embedded<T>(typeFunction: (type?: any) => ObjectType<T>): (object: Object, propertyName: string) => void;
