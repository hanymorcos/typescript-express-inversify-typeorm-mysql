import { QueryRunner } from "./QueryRunner";
import { Driver } from "../driver/Driver";
/**
 * Represents functionality to provide a new query runners, and release old ones.
 * Also can provide always same query runner.
 */
export declare class QueryRunnerProvider {
    protected driver: Driver;
    protected useSingleQueryRunner: boolean;
    protected reusableQueryRunner: QueryRunner;
    protected reusableQueryRunnerPromise: Promise<QueryRunner>;
    /**
     * Indicates if this entity manager is released.
     * Entity manager can be released only if custom queryRunnerProvider is provided.
     * Once entity manager is released, its repositories and some other methods can't be used anymore.
     */
    protected _isReleased: boolean;
    constructor(driver: Driver, useSingleQueryRunner?: boolean);
    readonly isReleased: boolean;
    /**
     * Provides a new query runner used to run repository queries.
     * If use useSingleQueryRunner mode is enabled then reusable query runner will be provided instead.
     */
    provide(): Promise<QueryRunner>;
    /**
     * Query runner release logic extracted into separated methods intently,
     * to make possible to create a subclass with its own release query runner logic.
     * Note: release only query runners that provided by a provide() method.
     * This is important and by design.
     */
    release(queryRunner: QueryRunner): Promise<void>;
    /**
     * Releases reused query runner.
     */
    releaseReused(): Promise<void>;
}
