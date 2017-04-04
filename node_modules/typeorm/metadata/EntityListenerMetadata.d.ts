import { EventListenerType } from "./types/EventListenerTypes";
import { EntityListenerMetadataArgs } from "../metadata-args/EntityListenerMetadataArgs";
/**
 * This metadata contains all information about entity's listeners.
 */
export declare class EntityListenerMetadata {
    /**
     * Target class to which metadata is applied.
     */
    readonly target: Function | string;
    /**
     * Target's property name to which this metadata is applied.
     */
    readonly propertyName: string;
    /**
     * The type of the listener.
     */
    readonly type: EventListenerType;
    constructor(args: EntityListenerMetadataArgs);
}
