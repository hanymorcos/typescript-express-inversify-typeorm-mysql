import { EntityMetadata } from "../metadata/EntityMetadata";
/**
 * Validates built entity metadatas.
 */
export declare class EntityMetadataValidator {
    /**
     * Validates all given entity metadatas.
     */
    validateMany(entityMetadatas: EntityMetadata[]): void;
    /**
     * Validates given entity metadata.
     */
    validate(entityMetadata: EntityMetadata, allEntityMetadatas: EntityMetadata[]): void;
    /**
     * Validates dependencies of the entity metadatas.
     */
    protected validateDependencies(entityMetadatas: EntityMetadata[]): void;
}
