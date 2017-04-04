/**
 * Platform-specific tools.
 */
export declare class PlatformTools {
    /**
     * Type of the currently running platform.
     */
    static type: "browser" | "node";
    /**
     * Gets global variable where global stuff can be stored.
     */
    static getGlobalVariable(): any;
    /**
     * Loads ("require"-s) given file or package.
     * This operation only supports on node platform
     */
    static load(name: string): any;
    /**
     * Normalizes given path. Does "path.normalize".
     */
    static pathNormilize(pathStr: string): string;
    /**
     * Gets file extension. Does "path.extname".
     */
    static pathExtname(pathStr: string): string;
    /**
     * Resolved given path. Does "path.resolve".
     */
    static pathResolve(pathStr: string): string;
    /**
     * Synchronously checks if file exist. Does "fs.existsSync".
     */
    static fileExist(pathStr: string): boolean;
    /**
     * Gets environment variable.
     */
    static getEnvVariable(name: string): any;
}
