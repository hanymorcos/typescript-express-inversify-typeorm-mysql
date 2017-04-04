import { TableMetadata } from "./TableMetadata";
import { ColumnMetadata } from "./ColumnMetadata";
import { RelationMetadata, PropertyTypeInFunction } from "./RelationMetadata";
import { IndexMetadata } from "./IndexMetadata";
import { ForeignKeyMetadata } from "./ForeignKeyMetadata";
import { NamingStrategyInterface } from "../naming-strategy/NamingStrategyInterface";
import { EntityMetadataArgs } from "../metadata-args/EntityMetadataArgs";
import { EmbeddedMetadata } from "./EmbeddedMetadata";
import { ObjectLiteral } from "../common/ObjectLiteral";
import { LazyRelationsWrapper } from "../lazy-loading/LazyRelationsWrapper";
/**
 * Contains all entity metadata.
 */
export declare class EntityMetadata {
    private lazyRelationsWrapper;
    /**
     * If entity's table is a closure-typed table, then this entity will have a closure junction table metadata.
     */
    closureJunctionTable: EntityMetadata;
    /**
     * Parent's entity metadata. Used in inheritance patterns.
     */
    parentEntityMetadata: EntityMetadata;
    /**
     * Naming strategy used to generate and normalize names.
     */
    readonly namingStrategy: NamingStrategyInterface;
    /**
     * Target class to which this entity metadata is bind.
     * Note, that when using table inheritance patterns target can be different rather then table's target.
     */
    readonly target: Function | string;
    /**
     * Indicates if this entity metadata of a junction table, or not.
     */
    readonly junction: boolean;
    /**
     * Entity's table metadata.
     */
    readonly table: TableMetadata;
    /**
     * Entity's relation metadatas.
     */
    readonly relations: RelationMetadata[];
    /**
     * Entity's index metadatas.
     */
    readonly indices: IndexMetadata[];
    /**
     * Entity's foreign key metadatas.
     */
    readonly foreignKeys: ForeignKeyMetadata[];
    /**
     * Entity's embedded metadatas.
     */
    readonly embeddeds: EmbeddedMetadata[];
    /**
     * If this entity metadata's table using one of the inheritance patterns,
     * then this will contain what pattern it uses.
     */
    readonly inheritanceType?: "single-table" | "class-table";
    /**
     * If this entity metadata is a child table of some table, it should have a discriminator value.
     * Used to store a value in a discriminator column.
     */
    readonly discriminatorValue?: string;
    /**
     * Global tables prefix. Customer can set a global table prefix for all tables in the database.
     */
    readonly tablesPrefix?: string;
    /**
     * Entity's column metadatas.
     */
    private readonly _columns;
    constructor(args: EntityMetadataArgs, lazyRelationsWrapper: LazyRelationsWrapper);
    /**
     * Entity's name. Equal to entity target class's name if target is set to table, or equals to table name if its set.
     */
    readonly name: string;
    /**
     * Columns of the entity, including columns that are coming from the embeddeds of this entity.
     */
    readonly columns: ColumnMetadata[];
    /**
     * All columns of the entity, including columns that are coming from the embeddeds of this entity,
     * and including columns from the parent entities.
     */
    readonly allColumns: ColumnMetadata[];
    /**
     * All relations of the entity, including relations from the parent entities.
     */
    readonly allRelations: RelationMetadata[];
    /**
     * Gets the name of the target.
     */
    readonly targetName: string;
    /**
     * Checks if entity's table has multiple primary columns.
     */
    readonly hasMultiplePrimaryKeys: boolean;
    /**
     * Gets the primary column.
     *
     * @deprecated
     */
    readonly primaryColumn: ColumnMetadata;
    /**
     * Checks if table has generated column.
     */
    readonly hasGeneratedColumn: boolean;
    /**
     * Gets the column with generated flag.
     */
    readonly generatedColumn: ColumnMetadata;
    /**
     * Gets the generated column if it exists, or returns undefined if it does not.
     */
    readonly generatedColumnIfExist: ColumnMetadata | undefined;
    /**
     * Gets first primary column. In the case if table contains multiple primary columns it
     * throws error.
     */
    readonly firstPrimaryColumn: ColumnMetadata;
    /**
     * Gets the primary columns.
     */
    readonly primaryColumns: ColumnMetadata[];
    readonly primaryColumnsWithParentIdColumns: ColumnMetadata[];
    /**
     * Gets all primary columns including columns from the parent entities.
     */
    readonly allPrimaryColumns: ColumnMetadata[];
    /**
     * Gets the primary columns of the parent entity metadata.
     * If parent entity metadata does not exist then it simply returns empty array.
     */
    readonly parentPrimaryColumns: ColumnMetadata[];
    /**
     * Gets only primary columns owned by this entity.
     */
    readonly ownPimaryColumns: ColumnMetadata[];
    /**
     * Checks if entity has a create date column.
     */
    readonly hasCreateDateColumn: boolean;
    /**
     * Gets entity column which contains a create date value.
     */
    readonly createDateColumn: ColumnMetadata;
    /**
     * Checks if entity has an update date column.
     */
    readonly hasUpdateDateColumn: boolean;
    /**
     * Gets entity column which contains an update date value.
     */
    readonly updateDateColumn: ColumnMetadata;
    /**
     * Checks if entity has a version column.
     */
    readonly hasVersionColumn: boolean;
    /**
     * Gets entity column which contains an entity version.
     */
    readonly versionColumn: ColumnMetadata;
    /**
     * Checks if entity has a discriminator column.
     */
    readonly hasDiscriminatorColumn: boolean;
    /**
     * Gets the discriminator column used to store entity identificator in single-table inheritance tables.
     */
    readonly discriminatorColumn: ColumnMetadata;
    /**
     * Checks if entity has a tree level column.
     */
    readonly hasTreeLevelColumn: boolean;
    readonly treeLevelColumn: ColumnMetadata;
    /**
     * Checks if entity has a tree level column.
     */
    readonly hasParentIdColumn: boolean;
    readonly parentIdColumn: ColumnMetadata;
    readonly parentIdColumns: ColumnMetadata[];
    /**
     * Gets single (values of which does not contain arrays) relations.
     */
    readonly singleValueRelations: RelationMetadata[];
    /**
     * Gets single (values of which does not contain arrays) relations.
     */
    readonly multiValueRelations: RelationMetadata[];
    /**
     * Gets only one-to-one relations of the entity.
     */
    readonly oneToOneRelations: RelationMetadata[];
    /**
     * Gets only owner one-to-one relations of the entity.
     */
    readonly ownerOneToOneRelations: RelationMetadata[];
    /**
     * Gets only one-to-many relations of the entity.
     */
    readonly oneToManyRelations: RelationMetadata[];
    /**
     * Gets only many-to-one relations of the entity.
     */
    readonly manyToOneRelations: RelationMetadata[];
    /**
     * Gets only many-to-many relations of the entity.
     */
    readonly manyToManyRelations: RelationMetadata[];
    /**
     * Gets only owner many-to-many relations of the entity.
     */
    readonly ownerManyToManyRelations: RelationMetadata[];
    /**
     * Gets only owner one-to-one and many-to-one relations.
     */
    readonly relationsWithJoinColumns: RelationMetadata[];
    /**
     * Checks if there is a tree parent relation. Used only in tree-tables.
     */
    readonly hasTreeParentRelation: boolean;
    /**
     * Tree parent relation. Used only in tree-tables.
     */
    readonly treeParentRelation: RelationMetadata;
    /**
     * Checks if there is a tree children relation. Used only in tree-tables.
     */
    readonly hasTreeChildrenRelation: boolean;
    /**
     * Tree children relation. Used only in tree-tables.
     */
    readonly treeChildrenRelation: RelationMetadata;
    /**
     * Creates a new entity.
     */
    create(): any;
    /**
     * Creates an object - map of columns and relations of the entity.
     */
    createPropertiesMap(): {
        [name: string]: string | any;
    };
    /**
     * Computes property name of the entity using given PropertyTypeInFunction.
     */
    computePropertyName(nameOrFn: PropertyTypeInFunction<any>): any;
    /**
     * todo: undefined entities should not go there
     */
    getEntityIdMap(entity: any): ObjectLiteral | undefined;
    /**
     * Same as getEntityIdMap, but instead of id column property names it returns database column names.
     */
    getDatabaseEntityIdMap(entity: ObjectLiteral): ObjectLiteral | undefined;
    /**

    createSimpleIdMap(id: any): ObjectLiteral {
        const map: ObjectLiteral = {};
        if (this.parentEntityMetadata) {
            this.primaryColumnsWithParentIdColumns.forEach(column => {
                map[column.propertyName] = id;
            });

        } else {
            this.primaryColumns.forEach(column => {
                map[column.propertyName] = id;
            });
        }
        return map;
    } */
    /**
     * Same as createSimpleIdMap, but instead of id column property names it returns database column names.

    createSimpleDatabaseIdMap(id: any): ObjectLiteral {
        const map: ObjectLiteral = {};
        if (this.parentEntityMetadata) {
            this.primaryColumnsWithParentIdColumns.forEach(column => {
                map[column.name] = id;
            });

        } else {
            this.primaryColumns.forEach(column => {
                map[column.name] = id;
            });
        }
        return map;
    }*/
    /**
     * todo: undefined entities should not go there??
     * todo: shouldnt be entity ObjectLiteral here?
     */
    getEntityIdMixedMap(entity: any): any;
    /**
     * Same as `getEntityIdMap` but the key of the map will be the column names instead of the property names.
     */
    getEntityIdColumnMap(entity: any): ObjectLiteral | undefined;
    transformIdMapToColumnNames(idMap: ObjectLiteral | undefined): ObjectLiteral | undefined;
    getColumnByPropertyName(propertyName: string): ColumnMetadata | undefined;
    /**
     * Checks if column with the given property name exist.
     */
    hasColumnWithPropertyName(propertyName: string): boolean;
    /**
     * Checks if column with the given database name exist.
     */
    hasColumnWithDbName(name: string): boolean;
    /**
     * Checks if relation with the given property name exist.
     */
    hasRelationWithPropertyName(propertyName: string): boolean;
    /**
     * Finds relation with the given property name.
     */
    findRelationWithPropertyName(propertyName: string): RelationMetadata;
    /**
     * Checks if relation with the given name exist.
     */
    hasRelationWithDbName(dbName: string): boolean;
    /**
     * Finds relation with the given name.
     */
    findRelationWithDbName(name: string): RelationMetadata;
    addColumn(column: ColumnMetadata): void;
    extractNonEmptyColumns(object: ObjectLiteral): ColumnMetadata[];
    extractNonEmptySingleValueRelations(object: ObjectLiteral): RelationMetadata[];
    extractNonEmptyMultiValueRelations(object: ObjectLiteral): RelationMetadata[];
    extractExistSingleValueRelations(object: ObjectLiteral): RelationMetadata[];
    extractExistMultiValueRelations(object: ObjectLiteral): RelationMetadata[];
    checkIfObjectContainsAllPrimaryKeys(object: ObjectLiteral): boolean;
    compareEntities(firstEntity: any, secondEntity: any): boolean;
    compareIds(firstId: ObjectLiteral | undefined, secondId: ObjectLiteral | undefined): boolean;
    /**
     * Compares two entity ids.
     * If any of the given value is empty then it will return false.
     */
    compareEntityMixedIds(firstId: any, secondId: any): boolean;
    /**
     * Iterates throw entity and finds and extracts all values from relations in the entity.
     * If relation value is an array its being flattened.
     */
    extractRelationValuesFromEntity(entity: ObjectLiteral, relations: RelationMetadata[]): [RelationMetadata, any, EntityMetadata][];
    /**
     * Checks if given entity has an id.
     */
    hasId(entity: ObjectLiteral): boolean;
    /**
     * Checks if there any non-nullable column exist in this entity.
     */
    readonly hasNonNullableColumns: boolean;
}
