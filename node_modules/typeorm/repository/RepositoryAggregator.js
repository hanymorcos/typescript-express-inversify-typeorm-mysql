"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../index");
var RepositoryFactory_1 = require("./RepositoryFactory");
/**
 * Aggregates all repositories of the specific metadata.
 */
var RepositoryAggregator = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function RepositoryAggregator(connection, metadata, queryRunnerProvider) {
        var repositoryFactory = index_1.getFromContainer(RepositoryFactory_1.RepositoryFactory);
        this.metadata = metadata;
        if (metadata.table.isClosure) {
            this.repository = this.treeRepository = repositoryFactory.createTreeRepository(connection, metadata, queryRunnerProvider);
        }
        else {
            this.repository = repositoryFactory.createRepository(connection, metadata, queryRunnerProvider);
        }
        this.specificRepository = repositoryFactory.createSpecificRepository(connection, metadata, this.repository, queryRunnerProvider);
    }
    return RepositoryAggregator;
}());
exports.RepositoryAggregator = RepositoryAggregator;

//# sourceMappingURL=RepositoryAggregator.js.map
