export enum RelationshipType {
    RELA_DEFAULT = '->',
    AGGREGATION_LEFT = 'o-', 
    AGGREGATION_RIGHT = '-o',
    COMPOSITION_LEFT = '*-', 
    COMPOSITION_RIGHT = '-*'
}

export function isAggregation(type: RelationshipType|string): boolean {
    return type === RelationshipType.AGGREGATION_LEFT || type === RelationshipType.AGGREGATION_RIGHT;
}

export function isComposition(type: RelationshipType|string): boolean {
    return type === RelationshipType.COMPOSITION_LEFT || type === RelationshipType.COMPOSITION_RIGHT;
}