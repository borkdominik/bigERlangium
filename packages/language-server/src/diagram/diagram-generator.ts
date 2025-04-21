import { GeneratorContext, LangiumDiagramGenerator } from "langium-sprotty";
import { SModelRoot, SNode, SLabel, SEdge, SCompartment } from "sprotty-protocol";
import { Attribute, Entity, Model, Relationship } from "../generated/ast.js";

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
        this.markerProvider.addDiagnosticMarker(attrCompartment, entity, ctx);

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

    protected generateEdge(relationship: Relationship, ctx: GeneratorContext<Model>): SEdge {
        const { idCache } = ctx;
        const sourceId = idCache.getId(relationship.source.entity.ref);
        const targetId = idCache.getId(relationship.target.entity.ref);
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

        let children = [];
        
        if (model.notation?.notationType.UML && !attr.visibility?.VISI_NONE) {
            children.push(<SLabel>{
                type: 'label:visibility',
                id: attributeId + '.visibility',
                text: attr.visibility?.toString()
            })
        }
            children.push(
            <SLabel>{
                type: labelType,
                id: attributeId + '.name',
                text: attr.name
            },
            <SLabel>{
                type: labelType,
                id: attributeId + '.datatype',
                text: this.attributeDatatypeString(attr)
            })
    

        return <SCompartment>{
            type: 'compartment:attribute-row',
            id: attributeId,
            layout: 'hbox',
            layoutOptions: {
                vAlign: 'center',
                hGap: 5
            },
            children: children
        }
    }

    /**
     * Transorms an attribute's datatype into a string.
     * @param attr the attribute whose datatype is to be transformed.
     * @returns a string representation of the datatype.
     */
        protected attributeDatatypeString(attr: Attribute): string {
            if (attr.datatype) {
                let size = attr.datatype.size;
                let d = attr.datatype.d;
                if(size){
                    if (size !== 0 && (d && d !== 0)) {
                        return attr.datatype?.type + '(' + attr.datatype?.size + ', ' + attr.datatype?.d + ')'
                    } else if (size !== 0 && (!d || d === 0)) {
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