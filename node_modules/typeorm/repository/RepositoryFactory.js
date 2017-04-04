"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TreeRepository_1 = require("./TreeRepository");
var Repository_1 = require("./Repository");
var SpecificRepository_1 = require("./SpecificRepository");
/**
 * Factory used to create different types of repositories.
 */
var RepositoryFactory = (function () {
    function RepositoryFactory() {
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Creates a regular repository.
     */
    RepositoryFactory.prototype.createRepository = function (connection, metadata, queryRunnerProvider) {
        // NOTE: dynamic access to protected properties. We need this to prevent unwanted properties in those classes to be exposed,
        // however we need these properties for internal work of the class
        var repository = new Repository_1.Repository();
        repository["connection"] = connection;
        repository["metadata"] = metadata;
        repository["queryRunnerProvider"] = queryRunnerProvider;
        return repository;
    };
    /**
     * Creates a tree repository.
     */
    RepositoryFactory.prototype.createTreeRepository = function (connection, metadata, queryRunnerProvider) {
        // NOTE: dynamic access to protected properties. We need this to prevent unwanted properties in those classes to be exposed,
        // however we need these properties for internal work of the class
        var repository = new TreeRepository_1.TreeRepository();
        repository["connection"] = connection;
        repository["metadata"] = metadata;
        repository["queryRunnerProvider"] = queryRunnerProvider;
        return repository;
    };
    /**
     * Creates a specific repository.
     */
    RepositoryFactory.prototype.createSpecificRepository = function (connection, metadata, repository, queryRunnerProvider) {
        return new SpecificRepository_1.SpecificRepository(connection, metadata, queryRunnerProvider);
    };
    return RepositoryFactory;
}());
exports.RepositoryFactory = RepositoryFactory;

//# sourceMappingURL=RepositoryFactory.js.map
