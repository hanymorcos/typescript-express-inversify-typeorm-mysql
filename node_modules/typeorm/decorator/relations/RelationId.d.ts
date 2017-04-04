/**
 * Special decorator used to extract relation id into separate entity property.
 */
export declare function RelationId<T>(relation: string | ((object: T) => any)): Function;
