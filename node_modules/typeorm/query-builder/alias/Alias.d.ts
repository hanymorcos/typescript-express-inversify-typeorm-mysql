/**
 */
export declare class Alias {
    isMain: boolean;
    name: string;
    target: Function | string;
    parentPropertyName: string;
    parentAliasName: string;
    constructor(name: string);
    readonly selection: string;
}
