import { EntitySubscriberMetadataArgs } from "../metadata-args/EntitySubscriberMetadataArgs";
/**
 * Contains metadata information about ORM event subscribers.
 */
export declare class EntitySubscriberMetadata {
    /**
     * Target class to which metadata is applied.
     */
    readonly target: Function | string;
    constructor(args: EntitySubscriberMetadataArgs);
}
