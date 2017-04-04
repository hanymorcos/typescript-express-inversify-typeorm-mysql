import { Repository } from "./Repository";
import { EntityMetadata } from "../metadata/EntityMetadata";
import { SpecificRepository } from "./SpecificRepository";
import { Connection } from "../connection/Connection";
import { TreeRepository } from "./TreeRepository";
import { QueryRunnerProvider } from "../query-runner/QueryRunnerProvider";
/**
 * Aggregates all repositories of the specific metadata.
 */
export declare class RepositoryAggregator {
    /**
     * Entity metadata which owns repositories.
     */
    readonly metadata: EntityMetadata;
    /**
     * Ordinary repository.
     */
    readonly repository: Repository<any>;
    /**
     * Tree repository.
     */
    readonly treeRepository?: TreeRepository<any>;
    /**
     * Repository with specific functions.
     */
    readonly specificRepository: SpecificRepository<any>;
    constructor(connection: Connection, metadata: EntityMetadata, queryRunnerProvider?: QueryRunnerProvider);
}
