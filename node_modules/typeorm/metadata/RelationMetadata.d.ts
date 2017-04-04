import { RelationType } from "./types/RelationTypes";
import { EntityMetadata } from "./EntityMetadata";
import { OnDeleteType } from "./ForeignKeyMetadata";
import { JoinTableMetadata } from "./JoinTableMetadata";
import { JoinColumnMetadata } from "./JoinColumnMetadata";
import { RelationMetadataArgs } from "../metadata-args/RelationMetadataArgs";
import { ColumnMetadata } from "./ColumnMetadata";
import { ObjectLiteral } from "../common/ObjectLiteral";
/**
 * Function that returns a type of the field. Returned value must be a class used on the relation.
 */
export declare type RelationTypeInFunction = ((type?: any) => Function) | Function | string;
/**
 * Contains the name of the property of the object, or the function that returns this name.
 */
export declare type PropertyTypeInFunction<T> = string | ((t: T) => string | any);
/**
 * Contains all information about some entity's relation.
 */
export declare class RelationMetadata {
    /**
     * Its own entity metadata.
     */
    entityMetadata: EntityMetadata;
    /**
     * Related entity metadata.
     */
    inverseEntityMetadata: EntityMetadata;
    /**
     * Junction entity metadata.
     */
    junctionEntityMetadata: EntityMetadata;
    /**
     * Join table metadata.
     */
    joinTable: JoinTableMetadata;
    /**
     * Join column metadata.
     */
    joinColumn: JoinColumnMetadata;
    /**
     * The name of the field that will contain id or ids of this relation. This is used in the case if user
     * wants to save relation without having to load related object, or in the cases if user wants to have id
     * of the object it relates with, but don't want to load that object because of it. Also its used in the
     * cases when user wants to add / remove / load in the many-to-many junction tables.
     */
    idField: string | undefined;
    /**
     * The name of the field that will contain count of the rows of the relation.
     */
    countField: string | undefined;
    /**
     * Target class to which metadata is applied.
     */
    readonly target: Function | string;
    /**
     * Target's property name to which this metadata is applied.
     */
    readonly propertyName: string;
    /**
     * Indicates if this is a parent (can be only many-to-one relation) relation in the tree tables.
     */
    readonly isTreeParent: boolean;
    /**
     * Indicates if this is a children (can be only one-to-many relation) relation in the tree tables.
     */
    readonly isTreeChildren: boolean;
    /**
     * Relation type.
     */
    readonly relationType: RelationType;
    /**
     * Indicates if this relation will be a primary key.
     * Can be used only for many-to-one and owner one-to-one relations.
     */
    readonly isPrimary: boolean;
    /**
     * Indicates if this relation will be lazily loaded.
     */
    readonly isLazy: boolean;
    /**
     * If set to true then it means that related object can be allowed to be inserted to the db.
     */
    readonly isCascadeInsert: boolean;
    /**
     * If set to true then it means that related object can be allowed to be updated in the db.
     */
    readonly isCascadeUpdate: boolean;
    /**
     * If set to true then it means that related object can be allowed to be remove from the db.
     */
    readonly isCascadeRemove: boolean;
    /**
     * Indicates if relation column value can be nullable or not.
     */
    readonly isNullable: boolean;
    /**
     * What to do with a relation on deletion of the row containing a foreign key.
     */
    readonly onDelete: OnDeleteType;
    /**
     * The real reflected property type.
     */
    /**
     * The type of the field.
     */
    private _type;
    /**
     * Inverse side of the relation.
     */
    private _inverseSideProperty;
    constructor(args: RelationMetadataArgs);
    /**
     * Gets relation's entity target.
     * Original target returns target of the class where relation is.
     * This class can be an abstract class, but relation even is from that class,
     * but its more related to a specific entity. That's why we need this field.
     */
    readonly entityTarget: Function | string;
    /**
     * Gets the name of column in the database.
     * //Cannot be used with many-to-many relations since they don't have a column in the database.
     * //Also only owning sides of the relations have this property.
     */
    readonly name: string;
    /**
     * Gets the name of column to which this relation is referenced.
     * //Cannot be used with many-to-many relations since all referenced are in the junction table.
     * //Also only owning sides of the relations have this property.
     */
    readonly referencedColumnName: string;
    /**
     * Gets the column to which this relation is referenced.
     */
    readonly referencedColumn: ColumnMetadata;
    /**
     * Gets the property's type to which this relation is applied.
     */
    readonly type: Function | string;
    /**
     * Indicates if this side is an owner of this relation.
     */
    readonly isOwning: boolean;
    /**
     * Checks if this relation's type is "one-to-one".
     */
    readonly isOneToOne: boolean;
    /**
     * Checks if this relation is owner side of the "one-to-one" relation.
     * Owner side means this side of relation has a join column in the table.
     */
    readonly isOneToOneOwner: boolean;
    /**
     * Checks if this relation is NOT owner side of the "one-to-one" relation.
     * NOT owner side means this side of relation does not have a join column in the table.
     */
    readonly isOneToOneNotOwner: boolean;
    /**
     * Checks if this relation's type is "one-to-many".
     */
    readonly isOneToMany: boolean;
    /**
     * Checks if this relation's type is "many-to-one".
     */
    readonly isManyToOne: boolean;
    /**
     * Checks if this relation's type is "many-to-many".
     */
    readonly isManyToMany: boolean;
    /**
     * Checks if this relation's type is "many-to-many", and is owner side of the relationship.
     * Owner side means this side of relation has a join table.
     */
    readonly isManyToManyOwner: boolean;
    /**
     * Checks if this relation's type is "many-to-many", and is NOT owner side of the relationship.
     * Not owner side means this side of relation does not have a join table.
     */
    readonly isManyToManyNotOwner: boolean;
    /**
     * Checks if inverse side is specified by a relation.
     */
    readonly hasInverseSide: boolean;
    /**
     * Gets the property name of the inverse side of the relation.
     */
    readonly inverseSideProperty: string;
    /**
     * Gets the relation metadata of the inverse side of this relation.
     */
    readonly inverseRelation: RelationMetadata;
    /**
     * Gets given entity's relation's value.
     * Using of this method helps to access value of the lazy loaded relation.
     */
    getEntityValue(entity: ObjectLiteral): any;
    /**
     * Checks if given entity has a value in a relation.
     */
    hasEntityValue(entity: ObjectLiteral): boolean;
    /**
     * todo: lazy relations are not supported here? implement logic?
     *
     * examples:
     *
     * - isOneToOneNotOwner or isOneToMany:
     *  Post has a Category.
     *  Post is owner side.
     *  Category is inverse side.
     *  Post.category is mapped to Category.id
     *
     *  if from Post relation we are passing Category here,
     *  it should return a post.category
     */
    getOwnEntityRelationId(ownEntity: ObjectLiteral): any;
    /**
     *
     * examples:
     *
     * - isOneToOneNotOwner or isOneToMany:
     *  Post has a Category.
     *  Post is owner side.
     *  Category is inverse side.
     *  Post.category is mapped to Category.id
     *
     *  if from Post relation we are passing Category here,
     *  it should return a category.id
     *
     *  @deprecated Looks like this method does not make sence and does same as getOwnEntityRelationId ?
     */
    getInverseEntityRelationId(inverseEntity: ObjectLiteral): any;
    /**
     * Inverse side set in the relation can be either string - property name of the column on inverse side,
     * either can be a function that accepts a map of properties with the object and returns one of them.
     * Second approach is used to achieve type-safety.
     */
    private computeInverseSide(inverseSide);
}
