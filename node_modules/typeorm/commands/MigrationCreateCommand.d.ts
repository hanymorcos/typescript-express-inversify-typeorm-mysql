/**
 * Creates a new migration file.
 */
export declare class MigrationCreateCommand {
    command: string;
    describe: string;
    builder(yargs: any): any;
    handler(argv: any): Promise<void>;
    /**
     * Creates a file with the given content in the given path.
     */
    protected static createFile(path: string, content: string): Promise<void>;
    /**
     * Gets contents of the migration file.
     */
    protected static getTemplate(name: string, timestamp: number): string;
}
