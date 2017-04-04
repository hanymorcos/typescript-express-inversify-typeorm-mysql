import { JoinTableOptions } from "../options/JoinTableOptions";
/**
 * JoinTable decorator is used in many-to-many relationship to specify owner side of relationship.
 * Its also used to set a custom junction table's name, column names and referenced columns.
 */
export declare function JoinTable(options?: JoinTableOptions): Function;
