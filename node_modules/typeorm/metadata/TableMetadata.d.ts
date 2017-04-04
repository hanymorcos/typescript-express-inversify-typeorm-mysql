import { EntityMetadata } from "./EntityMetadata";
import { TableMetadataArgs } from "../metadata-args/TableMetadataArgs";
import { OrderByCondition } from "../find-options/OrderByCondition";
/**
 * TableMetadata contains all entity's table metadata and information.
 */
export declare class TableMetadata {
    /**
     * Target class to which metadata is applied.
     * Function target is a table defined in the class.
     * String target is a table defined in a json schema.
     * "__virtual__" is a table defined without target class (like junction tables).
     */
    readonly target: Function | string | "__virtual__";
    /**
     * Specifies a default order by used for queries from this table when no explicit order by is specified.
     */
    readonly _orderBy?: OrderByCondition | ((object: any) => OrderByCondition | any);
    /**
     * Table's database engine type (like "InnoDB", "MyISAM", etc).
     */
    readonly engine?: string;
    /**
     * Whether table must be synced during schema build or not
     */
    readonly skipSchemaSync?: boolean;
    /**
     * Table type. Tables can be abstract, closure, junction, embedded, etc.
     */
    private readonly tableType;
    /**
     * Table name in the database. If name is not set then table's name will be generated from target's name.
     */
    private readonly _name?;
    /**
     * EntityMetadata of this table metadata, where this table metadata contained.
     */
    private _entityMetadata?;
    /**
     * Creates a new TableMetadata based on the given arguments object.
     */
    constructor(args: TableMetadataArgs);
    /**
     * Gets entity metadata of this table metadata.
     * If entity metadata was not set then exception will be thrown.
     */
    /**
     * Sets the entity metadata of this table metadata.
     * Note that entity metadata can be set only once.
     * Once you set it, you can't change it anymore.
     */
    entityMetadata: EntityMetadata;
    /**
     * Gets the table name without global table prefix.
     * When querying table you need a table name with prefix, but in some scenarios,
     * for example when you want to name a junction table that contains names of two other tables,
     * you may want a table name without prefix.
     */
    readonly nameWithoutPrefix: string;
    /**
     * Table name in the database.
     * This name includes global table prefix if it was set.
     */
    readonly name: string;
    /**
     * Specifies a default order by used for queries from this table when no explicit order by is specified.
     * If default order by was not set, then returns undefined.
     */
    readonly orderBy: OrderByCondition | undefined;
    /**
     * Checks if this table is regular.
     * All non-specific tables are just regular tables. Its a default table type.
     */
    readonly isRegular: boolean;
    /**
     * Checks if this table is abstract.
     * This type is for the tables that does not exist in the database,
     * but provide columns and relations for the tables of the child classes who inherit them.
     */
    readonly isAbstract: boolean;
    /**
     * Checks if this table is abstract.
     * Junction table is a table automatically created by many-to-many relationship.
     */
    readonly isJunction: boolean;
    /**
     * Checks if this table is a closure table.
     * Closure table is one of the tree-specific tables that supports closure database pattern.
     */
    readonly isClosure: boolean;
    /**
     * Checks if this table is a junction table of the closure table.
     * This type is for tables that contain junction metadata of the closure tables.
     */
    readonly isClosureJunction: boolean;
    /**
     * Checks if this table is an embeddable table.
     * Embeddable tables are not stored in the database as separate tables.
     * Instead their columns are embed into tables who owns them.
     */
    readonly isEmbeddable: boolean;
    /**
     * Checks if this table is a single table child.
     * Special table type for tables that are mapped into single table using Single Table Inheritance pattern.
     */
    readonly isSingleTableChild: boolean;
    /**
     * Checks if this table is a class table child.
     * Special table type for tables that are mapped into multiple tables using Class Table Inheritance pattern.
     */
    readonly isClassTableChild: boolean;
}
