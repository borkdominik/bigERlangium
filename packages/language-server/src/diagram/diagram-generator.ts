import { GeneratorContext, LangiumDiagramGenerator } from "langium-sprotty";
import { SModelRoot, SNode, SLabel, SEdge, SCompartment } from "sprotty-protocol";
import { Attribute, Entity, Model, Relationship } from "../generated/ast.js";
//import { NotationEdge } from "./model-elements.js";
import { GRAPH_TYPE } from '@biger/common';

/**
 * Generates a seralizable SModel representation of language elements
 * See: https://sprotty.org/docs/ref/smodel/
 */
export class ERDiagramGenerator extends LangiumDiagramGenerator {

    protected generateRoot(args: GeneratorContext<Model>): SModelRoot {
        
        const { document } = args;
        const model = document.parseResult.value;

        const entityNodes = model.entities.map(e => this.generateNode(e, args))
        const relationshipNodes = model.relationships.map(r => this.generateRelationshipNode(r, args))
        //const relationshipEdges = model.relationships.map(r => this.generateEdge(r, args))
        
        const graph = {
            type: GRAPH_TYPE,
            id: 'root',
            children: [
                ...entityNodes,
                ...relationshipNodes,
                //...relationshipEdges
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

        const attributes = entity.attributes.map(attr => this.createAttributeLabels(attr, nodeId, ctx));
        const attrCompartment = <SCompartment>{
            type: 'compartment:attributes',
            id: idCache.uniqueId(nodeId + '.attributes'),
            layout: 'vbox',
            layoutOptions: {
                hAlign: 'left',
                vGap: 1.0
            },
            children: attributes
        };
        this.traceProvider.trace(attrCompartment, entity, 'attributes');
        //this.markerProvider.addDiagnosticMarker(attrCompartment, entity, ctx);

        const node: SNode = {
            type: 'node',
            id: nodeId,
            children: [
                label,
                attrCompartment
            ],
            layout: 'vbox',
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

    /**
     * generates edges connecting the relationship node to the entity nodes
     * @param relationship the {@link Relationship} to be rendered
     * @param args {@link GeneratorContext} containing the langium document and idCache.
     * @returns an array of up to 3 {@link SEdge}s representing each connection in the relationship
     */
    /*
    protected generateRelationEdges(relationship: Relationship, ctx: GeneratorContext<Model>): SEdge[] {
        const { idCache } = ctx;
        const { document } = ctx;
        const model = document.parseResult.value;

        const relationshipNodeId = idCache.getId(relationship);
        const sourceId = idCache.getId(relationship.source?.entity.ref);
        const targetId = idCache.getId(relationship.target?.entity.ref);
        //const secondaryTargetIds = relationship.secondaryTargets?.map(target => idCache.getId(target.entity.ref)) || [];
        const secondaryTargets = relationship.secondaryTargets || [];

        let edges = [];
        let relationshipType = relationship.type;
        if (model.notation && model.notation.notationType.UML && secondaryTargets.length === 0) {
            //TODO: handle UML notation
        }

        if (sourceId) { //add edge from the source entity to the relationship node
            const sourceEdge = this.createEdge(relationship.source!, null, sourceId, relationshipNodeId!, relationshipType.toString(), ctx);
            edges.push(sourceEdge);
        }

        if (targetId) { //add edge from the target entity to the relationship node
            let secondRelationshipType = relationship.secondaryTypes?.[0];
            let type: RelationshipType = RelationshipType.RELA_DEFAULT;
            if (relationshipType.AGGREGATION_RIGHT || relationshipType.COMPOSITION_RIGHT) {
                type = relationshipType.toString() as RelationshipType;
            } else if (secondRelationshipType.AGGREGATION_LEFT) {
                type = RelationshipType.AGGREGATION_RIGHT;
            } else if (secondRelationshipType.COMPOSITION_LEFT) {
                type = RelationshipType.COMPOSITION_RIGHT;
            }
            const targetEdge = this.createEdge(relationship.target!, null, relationshipNodeId!, targetId, type, ctx);
            edges.push(targetEdge);
        }

        for (let i = 0; i < secondaryTargets.length; i++) { //add edges from the secondary targets to the relationship node
            const secondaryTarget = secondaryTargets[i];
            const secondRelationshipType = relationship.secondaryTypes?.[i];

            const secondaryTargetId = idCache.getId(secondaryTarget);
            const secondaryEdge = this.createEdge(secondaryTarget, null, relationshipNodeId!, secondaryTargetId!, secondRelationshipType.toString(), ctx);
            edges.push(secondaryEdge);
        }
        
        return edges;
    }
        */

    /**
     * Creates an edge based on the given parameters
     * @param target semantic source of the relationship (comes from Langium model)
     * @param source 
     * @param sourceId logical source of the relationship (ID of the sprotty node)
     * @param targetId logical target of the relationship (ID of the sprotty node)
     * @param relType
     * @param ctx {@link GeneratorContext} containing the langium document and idCache.
     * @returns a {@link NotationEdge} containing all relevant information for rendering.
     */
    /*
    protected createEdge(target: RelationEntity, source: RelationEntity | null, sourceId: string, targetId: string, relationshipType: string, ctx: GeneratorContext<Model>): SEdge {
        let { idCache } = ctx;
        let { document } = ctx;
        let model = document.parseResult.value;

        const notationType = model.notation?.notationType;
        const relationship = target.$container as Relationship;
        const edgeId = idCache.uniqueId(`${sourceId}:${relationship.name}:${targetId}`, relationship);
        const type = this.getEdgeType(target, notationType);

        let labels = this.createEdgeLabels(target, source, notationType, edgeId, ctx);
        const edge = <NotationEdge>{ //TODO: replace SEdge with NotationEdge when available
            type: type,
            id: edgeId,
            sourceId: sourceId,
            targetId: targetId,
            notation: notationType,
            connectivity: this.getCardinality(target),
            isSource: target === relationship.source,
            relationshipType: relationshipType,
            children: labels
        };
        this.traceProvider.trace(edge, relationship);
        return edge;


    }
        */
        

    /**
     * Generates a node for a relationship
     * @param relationship the relationship to be rendered.
     * @param idCache the {@link IdCache} for the current diagram 
     * @returns An {@link SNode} representing the relationship
     */
    protected generateRelationshipNode(relationship: Relationship, ctx: GeneratorContext<Model>): SNode {
        const { idCache } = ctx;
        const nodeId = idCache.uniqueId(relationship.name, relationship);

        const label: SLabel = {
            type: 'label:relationship',
            id: idCache.uniqueId(nodeId + '.label'),
            text: relationship.name
        };

        this.traceProvider.trace(label, relationship);

        const relationshipNode: SNode = {
            type: 'node:relationship',
            id: nodeId,
            children: [label],
            layout: 'stack',
            layoutOptions: {
                paddingTop: 25.0,
                paddingBottom: 25.0,
                paddingLeft: 10.0,
                paddingRight: 10.0
            }
        };
        this.traceProvider.trace(relationshipNode, relationship);
        this.markerProvider.addDiagnosticMarker(relationshipNode, relationship, ctx);
        return relationshipNode;

    }

    /**
     * Generates label compartments for an attribute
     * @param attr the attribute to be rendered
     * @param entityId the ID of the entity the attribute belongs to
     * @param idCache the {@link IdCache} for the current diagram
     * @returns An {@link SCompartment} containing an {@link SLabel} for name, datatype and (optionally) visibility of the attribute
     */
    protected createAttributeLabels(attr: Attribute, entityId: string, ctx: GeneratorContext<Model>): SCompartment {
        const { idCache } = ctx;
        const attributeId = idCache.uniqueId(entityId + '.' + attr.name, attr)
        const labelType = this.getAttributeLabelType(attr);

        const { document } = ctx;
        const model = document.parseResult.value;

        let labels = [];

        const visibilityLabel = <SLabel>{
            type: 'label:visibility',
            id: attributeId + '.visibility',
            text: attr.visibility ? attr.visibility?.toString() : ''
        }

        const nameLabel = <SLabel>{
            type: labelType,
            id: attributeId + '.name',
            text: attr.name
        }

        const typeLabel = <SLabel>{
            type: labelType,
            id: attributeId + '.datatype',
            text: this.attributeDatatypeString(attr)
        }
        
        if (model.notation?.notationType.UML && attr.visibility != undefined && !attr.visibility?.VISI_NONE) {
            labels.push(visibilityLabel)
            this.traceProvider.trace(visibilityLabel, attr);
        }
        labels.push(nameLabel, typeLabel)
        this.traceProvider.trace(nameLabel, attr);
        this.traceProvider.trace(typeLabel, attr);
    
        const attrRowCompartment = <SCompartment>{
            type: 'compartment:attribute-row',
            id: attributeId,
            layout: 'hbox',
            layoutOptions: {
                vAlign: 'center',
                hGap: 5
            },
            children: labels
        }
        this.traceProvider.trace(attrRowCompartment, attr);

        return attrRowCompartment;
    }

    /**
     * Transorms an attribute's datatype into a string.
     * @param attr the attribute whose datatype is to be transformed.
     * @returns a string representation of the datatype.
     */
        protected attributeDatatypeString(attr: Attribute): string {
            if (attr.datatype) {
                let size = attr.datatype.size;
                let d = attr.datatype.d; //specifies the number of digits after the decimal point
                if(size && size !== 0) {
                    if (d && d !== 0) {
                        return attr.datatype?.type + '(' + attr.datatype?.size + ', ' + attr.datatype?.d + ')'
                    } else if (!d || d === 0) {
                        return attr.datatype.type + '(' + attr.datatype.size + ')';
                    }
            }
                return attr.datatype.type;
            }
            return ' ';
        }

    /**
     * Determines the label type for an attribute based on its type
     * @param attr the attribute whose label type is to be determined
     * @returns a string representing the label type, starting with 'label:' 
     */
        protected getAttributeLabelType(attr: Attribute): string {
            console.debug(attr)
            if (attr.type?.KEY) {
                return 'label:key'
            } else if (attr.type?.PARTIAL_KEY) {
                return 'label:partial-key'
            } else if (attr.type?.DERIVED) {
                return 'label:derived'
            } else {
                return 'label:text'
            }
        }
}