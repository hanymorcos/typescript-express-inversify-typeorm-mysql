import { RelationMetadata } from "../metadata/RelationMetadata";
import { Connection } from "../connection/Connection";
/**
 * This class wraps entities and provides functions there to lazily load its relations.
 */
export declare class LazyRelationsWrapper {
    private connection;
    constructor(connection: Connection);
    wrap(object: Object, relation: RelationMetadata): void;
}
