export declare class TargetMetadataArgsCollection<T extends {
    target?: Function | string;
}> {
    protected items: T[];
    readonly length: number;
    filter(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): this;
    filterByTarget(cls?: Function | string): this;
    filterByTargets(classes: Array<Function | string>): this;
    add(metadata: T, checkForDuplicateTargets?: boolean): void;
    toArray(): T[];
    private hasWithTarget(constructor);
}
