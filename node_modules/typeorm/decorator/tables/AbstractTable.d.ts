/**
 * Abstract table is a table that contains columns and relations for all tables that will inherit this table.
 * Database table for the abstract table is not created.
 *
 * @deprecated Use @AbstractEntity decorator instead.
 */
export declare function AbstractTable(): (target: Function) => void;
