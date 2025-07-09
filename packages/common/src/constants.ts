export const GRAPH_TYPE = 'graph';

/*
* definiition of supported diagram types
*/
export namespace DiagramType {
    export const DEFAULT_NOTATION = "default";
    export const BACHMAN_NOTATION = "bachman";
    export const CHEN_NOTATION = "chen";
    export const CROWSFOOT_NOTATION = "crowsfoot";
    export const UML = "uml";
}

/*
* definition of supported relationship types
*/
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

