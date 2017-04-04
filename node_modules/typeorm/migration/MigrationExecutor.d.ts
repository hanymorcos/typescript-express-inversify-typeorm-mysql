import { Connection } from "../connection/Connection";
import { QueryRunnerProvider } from "../query-runner/QueryRunnerProvider";
import { Migration } from "./Migration";
/**
 * Executes migrations: runs pending and reverts previously executed migrations.
 */
export declare class MigrationExecutor {
    protected connection: Connection;
    protected queryRunnerProvider: QueryRunnerProvider;
    constructor(connection: Connection, queryRunnerProvider?: QueryRunnerProvider);
    /**
     * Executes all pending migrations. Pending migrations are migrations that are not yet executed,
     * thus not saved in the database.
     */
    executePendingMigrations(): Promise<void>;
    /**
     * Reverts last migration that were run.
     */
    undoLastMigration(): Promise<void>;
    /**
     * Creates table "migrations" that will store information about executed migrations.
     */
    protected createMigrationsTableIfNotExist(): Promise<void>;
    /**
     * Loads all migrations that were executed and saved into the database.
     */
    protected loadExecutedMigrations(): Promise<Migration[]>;
    /**
     * Gets all migrations that setup for this connection.
     */
    protected getMigrations(): Migration[];
    /**
     * Finds the latest migration (sorts by timestamp) in the given array of migrations.
     */
    protected getLatestMigration(migrations: Migration[]): Migration | undefined;
    /**
     * Inserts new executed migration's data into migrations table.
     */
    protected insertExecutedMigration(migration: Migration): Promise<void>;
    /**
     * Delete previously executed migration's data from the migrations table.
     */
    protected deleteExecutedMigration(migration: Migration): Promise<void>;
}
