/**
 * All types that relation can be.
 */
export declare type RelationType = "one-to-one" | "one-to-many" | "many-to-one" | "many-to-many";
/**
 * Provides a constants for each relation type.
 */
export declare class RelationTypes {
    static ONE_TO_ONE: RelationType;
    static ONE_TO_MANY: RelationType;
    static MANY_TO_ONE: RelationType;
    static MANY_TO_MANY: RelationType;
}
