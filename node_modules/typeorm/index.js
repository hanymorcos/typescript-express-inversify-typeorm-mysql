"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var ConnectionManager_1 = require("./connection/ConnectionManager");
var MetadataArgsStorage_1 = require("./metadata-args/MetadataArgsStorage");
var container_1 = require("./container");
var PlatformTools_1 = require("./platform/PlatformTools");
// -------------------------------------------------------------------------
// Commonly Used exports
// -------------------------------------------------------------------------
__export(require("./container"));
__export(require("./decorator/columns/Column"));
__export(require("./decorator/columns/CreateDateColumn"));
__export(require("./decorator/columns/DiscriminatorColumn"));
__export(require("./decorator/columns/PrimaryGeneratedColumn"));
__export(require("./decorator/columns/PrimaryColumn"));
__export(require("./decorator/columns/UpdateDateColumn"));
__export(require("./decorator/columns/VersionColumn"));
__export(require("./decorator/listeners/AfterInsert"));
__export(require("./decorator/listeners/AfterLoad"));
__export(require("./decorator/listeners/AfterRemove"));
__export(require("./decorator/listeners/AfterUpdate"));
__export(require("./decorator/listeners/BeforeInsert"));
__export(require("./decorator/listeners/BeforeRemove"));
__export(require("./decorator/listeners/BeforeUpdate"));
__export(require("./decorator/listeners/EventSubscriber"));
__export(require("./decorator/relations/RelationCount"));
__export(require("./decorator/relations/JoinColumn"));
__export(require("./decorator/relations/JoinTable"));
__export(require("./decorator/relations/ManyToMany"));
__export(require("./decorator/relations/ManyToOne"));
__export(require("./decorator/relations/OneToMany"));
__export(require("./decorator/relations/OneToOne"));
__export(require("./decorator/relations/RelationCount"));
__export(require("./decorator/relations/RelationId"));
__export(require("./decorator/entity/Entity"));
__export(require("./decorator/entity/AbstractEntity"));
__export(require("./decorator/entity/ClassEntityChild"));
__export(require("./decorator/entity/ClosureEntity"));
__export(require("./decorator/entity/EmbeddableEntity"));
__export(require("./decorator/entity/SingleEntityChild"));
__export(require("./decorator/entity/Entity"));
__export(require("./decorator/entity/TableInheritance"));
__export(require("./decorator/transaction/Transaction"));
__export(require("./decorator/transaction/TransactionEntityManager"));
__export(require("./decorator/tree/TreeLevelColumn"));
__export(require("./decorator/tree/TreeParent"));
__export(require("./decorator/tree/TreeChildren"));
__export(require("./decorator/Index"));
__export(require("./decorator/NamingStrategy"));
__export(require("./decorator/Embedded"));
__export(require("./decorator/DiscriminatorValue"));
__export(require("./decorator/EntityRepository"));
__export(require("./schema-builder/schema/ColumnSchema"));
__export(require("./schema-builder/schema/ForeignKeySchema"));
__export(require("./schema-builder/schema/IndexSchema"));
__export(require("./schema-builder/schema/PrimaryKeySchema"));
__export(require("./schema-builder/schema/TableSchema"));
var Connection_1 = require("./connection/Connection");
exports.Connection = Connection_1.Connection;
var ConnectionManager_2 = require("./connection/ConnectionManager");
exports.ConnectionManager = ConnectionManager_2.ConnectionManager;
var QueryBuilder_1 = require("./query-builder/QueryBuilder");
exports.QueryBuilder = QueryBuilder_1.QueryBuilder;
var EntityManager_1 = require("./entity-manager/EntityManager");
exports.EntityManager = EntityManager_1.EntityManager;
var DefaultNamingStrategy_1 = require("./naming-strategy/DefaultNamingStrategy");
exports.DefaultNamingStrategy = DefaultNamingStrategy_1.DefaultNamingStrategy;
var Repository_1 = require("./repository/Repository");
exports.Repository = Repository_1.Repository;
var TreeRepository_1 = require("./repository/TreeRepository");
exports.TreeRepository = TreeRepository_1.TreeRepository;
var SpecificRepository_1 = require("./repository/SpecificRepository");
exports.SpecificRepository = SpecificRepository_1.SpecificRepository;
// -------------------------------------------------------------------------
// Deprecated
// -------------------------------------------------------------------------
__export(require("./decorator/tables/Table"));
__export(require("./decorator/tables/AbstractTable"));
__export(require("./decorator/tables/ClassTableChild"));
__export(require("./decorator/tables/ClosureTable"));
__export(require("./decorator/tables/EmbeddableTable"));
__export(require("./decorator/tables/SingleTableChild"));
__export(require("./decorator/tables/Table"));
// -------------------------------------------------------------------------
// Commonly used functionality
// -------------------------------------------------------------------------
/**
 * Gets metadata args storage.
 */
function getMetadataArgsStorage() {
    // we should store metadata storage in a global variable otherwise it brings too much problems
    // one of the problem is that if any entity (or any other) will be imported before consumer will call
    // useContainer method with his own container implementation, that entity will be registered in the
    // old old container (default one post probably) and consumer will his entity.
    // calling useContainer before he imports any entity (or any other) is not always convenient.
    // another reason is that when we run migrations typeorm is being called from a global package
    // and it may load entities which register decorators in typeorm of local package
    // this leads to impossibility of usage of entities in migrations and cli related operations
    var globalScope = PlatformTools_1.PlatformTools.getGlobalVariable();
    if (!globalScope.typeormMetadataArgsStorage)
        globalScope.typeormMetadataArgsStorage = new MetadataArgsStorage_1.MetadataArgsStorage();
    return globalScope.typeormMetadataArgsStorage;
}
exports.getMetadataArgsStorage = getMetadataArgsStorage;
/**
 * Gets a ConnectionManager which creates connections.
 */
function getConnectionManager() {
    return container_1.getFromContainer(ConnectionManager_1.ConnectionManager);
}
exports.getConnectionManager = getConnectionManager;
/**
 * Creates connection and and registers it in the manager.
 */
function createConnection(optionsOrConnectionNameFromConfig, ormConfigPath) {
    return getConnectionManager().createAndConnect(optionsOrConnectionNameFromConfig, ormConfigPath);
}
exports.createConnection = createConnection;
/**
 * Creates connections and and registers them in the manager.
 */
function createConnections(optionsOrOrmConfigFilePath) {
    return getConnectionManager().createAndConnectToAll(optionsOrOrmConfigFilePath);
}
exports.createConnections = createConnections;
/**
 * Gets connection from the connection manager.
 * If connection name wasn't specified, then "default" connection will be retrieved.
 */
function getConnection(connectionName) {
    if (connectionName === void 0) { connectionName = "default"; }
    return getConnectionManager().get(connectionName);
}
exports.getConnection = getConnection;
/**
 * Gets entity manager from the connection.
 * If connection name wasn't specified, then "default" connection will be retrieved.
 */
function getEntityManager(connectionName) {
    if (connectionName === void 0) { connectionName = "default"; }
    return getConnectionManager().get(connectionName).entityManager;
}
exports.getEntityManager = getEntityManager;
/**
 * Gets repository for the given entity class or name.
 */
function getRepository(entityClassOrName, connectionName) {
    if (connectionName === void 0) { connectionName = "default"; }
    return getConnectionManager().get(connectionName).getRepository(entityClassOrName);
}
exports.getRepository = getRepository;

//# sourceMappingURL=index.js.map
