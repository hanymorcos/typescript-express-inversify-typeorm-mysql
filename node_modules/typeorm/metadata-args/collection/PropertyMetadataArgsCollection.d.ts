import { TargetMetadataArgsCollection } from "./TargetMetadataArgsCollection";
export declare class PropertyMetadataArgsCollection<T extends {
    target?: Function | string;
    propertyName?: string;
}> extends TargetMetadataArgsCollection<T> {
    filterRepeatedMetadatas(existsMetadatas: T[]): this;
    findByProperty(propertyName: string): T | undefined;
    hasWithProperty(propertyName: string): boolean;
}
