
import { LibavoidEdge } from 'sprotty-routing-libavoid';
import { RelationshipType } from '../generated/ast.js';
export class NotationEdge extends LibavoidEdge {
    isSource: boolean;
    notation: string;
    connectivity: string;
    relationshipType: string;

    
}
