import { EntityMetadata } from "./EntityMetadata";
import { TableMetadata } from "./TableMetadata";
import { ColumnMetadata } from "./ColumnMetadata";
/**
 * Contains all information about entity's embedded property.
 */
export declare class EmbeddedMetadata {
    /**
     * Its own entity metadata.
     */
    entityMetadata: EntityMetadata;
    /**
     * Property name on which this embedded is attached.
     */
    readonly propertyName: string;
    /**
     * Embeddable table.
     */
    readonly table: TableMetadata;
    /**
     * Embeddable table's columns.
     */
    readonly columns: ColumnMetadata[];
    /**
     * Embedded type.
     */
    readonly type: Function;
    constructor(type: Function, propertyName: string, table: TableMetadata, columns: ColumnMetadata[]);
    /**
     * Creates a new embedded object.
     */
    create(): any;
}
