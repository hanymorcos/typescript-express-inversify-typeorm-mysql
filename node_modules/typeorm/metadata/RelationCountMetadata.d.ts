import { RelationCountMetadataArgs } from "../metadata-args/RelationCountMetadataArgs";
/**
 * Contains all information about entity's relation count.
 */
export declare class RelationCountMetadata {
    /**
     * Relation which need to count.
     */
    readonly relation: string | ((object: any) => any);
    /**
     * Target class to which metadata is applied.
     */
    readonly target: Function | string;
    /**
     * Target's property name to which this metadata is applied.
     */
    readonly propertyName: string;
    constructor(args: RelationCountMetadataArgs);
}
