import { Connection } from "../connection/Connection";
import { EntityMetadata } from "../metadata/EntityMetadata";
import { ObjectLiteral } from "../common/ObjectLiteral";
import { QueryRunnerProvider } from "../query-runner/QueryRunnerProvider";
import { Subject } from "../persistence/Subject";
import { RelationMetadata } from "../metadata/RelationMetadata";
import { ColumnMetadata } from "../metadata/ColumnMetadata";
/**
 * Repository for more specific operations.
 */
export declare class SpecificRepository<Entity extends ObjectLiteral> {
    protected connection: Connection;
    protected metadata: EntityMetadata;
    protected queryRunnerProvider: QueryRunnerProvider;
    constructor(connection: Connection, metadata: EntityMetadata, queryRunnerProvider?: QueryRunnerProvider);
    /**
     * Sets given relatedEntityId to the value of the relation of the entity with entityId id.
     * Should be used when you want quickly and efficiently set a relation (for many-to-one and one-to-many) to some entity.
     * Note that event listeners and event subscribers won't work (and will not send any events) when using this operation.
     */
    setRelation(relationName: string, entityId: any, relatedEntityId: any): Promise<void>;
    /**
     * Sets given relatedEntityId to the value of the relation of the entity with entityId id.
     * Should be used when you want quickly and efficiently set a relation (for many-to-one and one-to-many) to some entity.
     * Note that event listeners and event subscribers won't work (and will not send any events) when using this operation.
     */
    setRelation(relationName: ((t: Entity) => string | any), entityId: any, relatedEntityId: any): Promise<void>;
    /**
     * Sets given relatedEntityId to the value of the relation of the entity with entityId id.
     * Should be used when you want quickly and efficiently set a relation (for many-to-one and one-to-many) to some entity.
     * Note that event listeners and event subscribers won't work (and will not send any events) when using this operation.
     */
    setInverseRelation(relationName: string, relatedEntityId: any, entityId: any): Promise<void>;
    /**
     * Sets given relatedEntityId to the value of the relation of the entity with entityId id.
     * Should be used when you want quickly and efficiently set a relation (for many-to-one and one-to-many) to some entity.
     * Note that event listeners and event subscribers won't work (and will not send any events) when using this operation.
     */
    setInverseRelation(relationName: ((t: Entity) => string | any), relatedEntityId: any, entityId: any): Promise<void>;
    /**
     * Adds a new relation between two entities into relation's many-to-many table.
     * Should be used when you want quickly and efficiently add a relation between two entities.
     * Note that event listeners and event subscribers won't work (and will not send any events) when using this operation.
     */
    addToRelation(relationName: string, entityId: any, relatedEntityIds: any[]): Promise<void>;
    /**
     * Adds a new relation between two entities into relation's many-to-many table.
     * Should be used when you want quickly and efficiently add a relation between two entities.
     * Note that event listeners and event subscribers won't work (and will not send any events) when using this operation.
     */
    addToRelation(relationName: ((t: Entity) => string | any), entityId: any, relatedEntityIds: any[]): Promise<void>;
    /**
     * Adds a new relation between two entities into relation's many-to-many table from inverse side of the given relation.
     * Should be used when you want quickly and efficiently add a relation between two entities.
     * Note that event listeners and event subscribers won't work (and will not send any events) when using this operation.
     */
    addToInverseRelation(relationName: string, relatedEntityId: any, entityIds: any[]): Promise<void>;
    /**
     * Adds a new relation between two entities into relation's many-to-many table from inverse side of the given relation.
     * Should be used when you want quickly and efficiently add a relation between two entities.
     * Note that event listeners and event subscribers won't work (and will not send any events) when using this operation.
     */
    addToInverseRelation(relationName: ((t: Entity) => string | any), relatedEntityId: any, entityIds: any[]): Promise<void>;
    /**
     * Removes a relation between two entities from relation's many-to-many table.
     * Should be used when you want quickly and efficiently remove a many-to-many relation between two entities.
     * Note that event listeners and event subscribers won't work (and will not send any events) when using this operation.
     */
    removeFromRelation(relationName: string, entityId: any, relatedEntityIds: any[]): Promise<void>;
    /**
     * Removes a relation between two entities from relation's many-to-many table.
     * Should be used when you want quickly and efficiently remove a many-to-many relation between two entities.
     * Note that event listeners and event subscribers won't work (and will not send any events) when using this operation.
     */
    removeFromRelation(relationName: ((t: Entity) => string | any), entityId: any, relatedEntityIds: any[]): Promise<void>;
    /**
     * Removes a relation between two entities from relation's many-to-many table.
     * Should be used when you want quickly and efficiently remove a many-to-many relation between two entities.
     * Note that event listeners and event subscribers won't work (and will not send any events) when using this operation.
     */
    removeFromInverseRelation(relationName: string, relatedEntityId: any, entityIds: any[]): Promise<void>;
    /**
     * Removes a relation between two entities from relation's many-to-many table.
     * Should be used when you want quickly and efficiently remove a many-to-many relation between two entities.
     * Note that event listeners and event subscribers won't work (and will not send any events) when using this operation.
     */
    removeFromInverseRelation(relationName: ((t: Entity) => string | any), relatedEntityId: any, entityIds: any[]): Promise<void>;
    /**
     * Performs both #addToRelation and #removeFromRelation operations.
     * Should be used when you want quickly and efficiently and and remove a many-to-many relation between two entities.
     * Note that event listeners and event subscribers won't work (and will not send any events) when using this operation.
     */
    addAndRemoveFromRelation(relation: string, entityId: any, addRelatedEntityIds: any[], removeRelatedEntityIds: any[]): Promise<void>;
    /**
     * Performs both #addToRelation and #removeFromRelation operations.
     * Should be used when you want quickly and efficiently and and remove a many-to-many relation between two entities.
     * Note that event listeners and event subscribers won't work (and will not send any events) when using this operation.
     */
    addAndRemoveFromRelation(relation: ((t: Entity) => string | any), entityId: any, addRelatedEntityIds: any[], removeRelatedEntityIds: any[]): Promise<void>;
    /**
     * Performs both #addToRelation and #removeFromRelation operations.
     * Should be used when you want quickly and efficiently and and remove a many-to-many relation between two entities.
     * Note that event listeners and event subscribers won't work (and will not send any events) when using this operation.
     */
    addAndRemoveFromInverseRelation(relation: string, relatedEntityId: any, addEntityIds: any[], removeEntityIds: any[]): Promise<void>;
    /**
     * Performs both #addToRelation and #removeFromRelation operations.
     * Should be used when you want quickly and efficiently and and remove a many-to-many relation between two entities.
     * Note that event listeners and event subscribers won't work (and will not send any events) when using this operation.
     */
    addAndRemoveFromInverseRelation(relation: ((t: Entity) => string | any), relatedEntityId: any, addEntityIds: any[], removeEntityIds: any[]): Promise<void>;
    /**
     * Removes entity with the given id.
     * Note that event listeners and event subscribers won't work (and will not send any events) when using this operation.
     */
    removeById(id: any): Promise<void>;
    /**
     * Removes all entities with the given ids.
     * Note that event listeners and event subscribers won't work (and will not send any events) when using this operation.
     */
    removeByIds(ids: any[]): Promise<void>;
    /**
     * Finds all relation ids in the given entities.
     */
    findRelationIds(relationOrName: RelationMetadata | string | ((...args: any[]) => any), entityOrEntities: Entity[] | Entity | any | any[], inIds?: any[], notInIds?: any[]): Promise<any[]>;
    /**
     * Converts entity or entities to id or ids map.
     */
    protected convertEntityOrEntitiesToIdOrIds(column: ColumnMetadata, entityOrEntities: Entity[] | Entity | any | any[]): any | any[];
    /**
     * Converts relation name, relation name in function into RelationMetadata.
     */
    protected convertMixedRelationToMetadata(relationOrName: RelationMetadata | string | ((...args: any[]) => any)): RelationMetadata;
    /**
     * Extracts unique objects from given entity and all its downside relations.
     */
    protected extractObjectsById(entity: any, metadata: EntityMetadata, entityWithIds?: Subject[]): Promise<Subject[]>;
}
