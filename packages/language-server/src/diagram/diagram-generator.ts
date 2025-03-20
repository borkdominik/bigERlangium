import { GeneratorContext, LangiumDiagramGenerator } from "langium-sprotty";
import { SModelRoot, SNode, SLabel, SEdge } from "sprotty-protocol";
import { Entity, Model, Relationship } from "../generated/ast.js";

/**
 * Generates a seralizable SModel representation of language elements
 * See: https://sprotty.org/docs/smodel/
 */
export class ERDiagramGenerator extends LangiumDiagramGenerator {

    protected generateRoot(args: GeneratorContext<Model>): SModelRoot {
        const { document } = args;
        const model = document.parseResult.value;

        const entityNodes = model.entities.map(e => this.generateNode(e, args))
        const relationshipEdges = model.relationships.map(r => this.generateEdge(r, args))
        
        const graph = {
            type: 'graph',
            id: 'root',
            children: [
                ...entityNodes,
                ...relationshipEdges
            ]
        };

        this.traceProvider.trace(graph, model);
        return graph;
    }

    protected generateNode(entity: Entity, ctx: GeneratorContext<Model>): SNode {
        const { idCache } = ctx;
        const nodeId = idCache.uniqueId(entity.name, entity);

        const label: SLabel = {
            type: 'label:name',
            id: idCache.uniqueId(nodeId + '.label'),
            text: entity.name
        };
        this.traceProvider.trace(label, entity, 'name');

        const node: SNode = {
            type: 'node',
            id: nodeId,
            children: [
                label
            ],
            layout: 'stack',
            layoutOptions: {
                paddingTop: 10.0,
                paddingBottom: 10.0,
                paddingLeft: 10.0,
                paddingRight: 10.0
            }
        };
        this.traceProvider.trace(node, entity);
        this.markerProvider.addDiagnosticMarker(node, entity, ctx);
        return node;
    }

    protected generateEdge(relationship: Relationship, ctx: GeneratorContext<Model>): SEdge {
        const { idCache } = ctx;
        const sourceId = idCache.getId(relationship.source.ref);
        const targetId = idCache.getId(relationship.target.ref);
        const edgeId = idCache.uniqueId(`${sourceId}:${relationship.name}:${targetId}`, relationship);
        
        const edge: SEdge = {
            type: 'edge',
            id: edgeId,
            sourceId: sourceId!,
            targetId: targetId!,
            children: []
        };

        this.traceProvider.trace(edge, relationship);
        this.markerProvider.addDiagnosticMarker(edge, relationship, ctx);
        return edge;
    }
}