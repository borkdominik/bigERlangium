import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type { Entity, EntityRelationshipAstType, Model, Relationship, RelationEntity, Attribute } from './generated/ast.js';
import type { EntityRelationshipServices } from './entity-relationship-module.js';
import { startsWithUppercaseLetter } from './validation-helper.js'
import { isModel } from './generated/ast.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: EntityRelationshipServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.EntityRelationshipValidator;
    const checks: ValidationChecks<EntityRelationshipAstType> = {
        Model: [validator.checkModelName, validator.checkModelEntityNamesForDuplicates, validator.checkModelRelationshipNamesForDuplicates],
        Entity: [validator.checkEntityOrRelationshipAttributes, validator.checkEntityStartsWithCapitalLetter,],
        Relationship: [validator.checkEntityOrRelationshipAttributes],
        RelationEntity: [validator.checkRelationEntityCardinality]
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class EntityRelationshipValidator {
    /*
    *   MODEL
    */
   // Check if the model has a name
    checkModelName(model: Model, accept: ValidationAcceptor): void {
        if (!model.name || model.name.trim() === "") {
            accept("error", "Missing model header 'erdiagram <name>'", { node: model, range: { start: { line: 0, character: 0 }, end: { line: 1, character: 0 } } });
        }
    }

    // Performs a check on all entities of the model for name duplicates
    checkModelEntityNamesForDuplicates(model: Model, accept: ValidationAcceptor): void {
        let entities = model.entities;
        let entityNames = entities.map(entity => entity.name);
        entities.forEach(entity => {
            if (entityNames.filter(n => n === entity.name).length > 1) {
                accept('error', `Multiple entities named \"${entity.name}\".`, { node: entity, property: 'name' });
            }
        })
    }

    // Performs a check on all relationships of the model for name duplicates
    checkModelRelationshipNamesForDuplicates(model: Model, accept: ValidationAcceptor): void {
        let relationships = model.relationships;
        let relationshipNames = relationships.map(entity => entity.name);
        relationships.forEach(relationship => {
            if (relationshipNames.filter(n => n === relationship.name).length > 1) {
                accept('error', `Multiple entities named \"${relationship.name}\".`, { node: relationship, property: 'name' });
            }
        })
    }

    /*
    *   ENTITY
    */
    // Performs a check on an entity name to check for the capitalization of the first letter of its name
    checkEntityStartsWithCapitalLetter(entity: Entity, accept: ValidationAcceptor): void {
        if (entity.name) {
            if (!startsWithUppercaseLetter(entity.name)) {
                accept('warning', 'Entity name should start with a capital letter.', { node: entity, property: 'name' })
            }
        }
    }

    // Performs a check on an entity to confirm that it has a valid key
    checkEntityKeys(entity: Entity, accept: ValidationAcceptor) {
        if (entity.weak) {
            // Check for weak entities
            if (entity.attributes.filter(attr => attr.type?.PARTIAL_KEY != undefined).length < 1) {
                let extendedEntity = entity.extends?.ref
                let notation = entity.$container.notation;

                // recursive check for inherited partial-keys, do not warn if any are found
                while (extendedEntity) {
                    let partialKeys = []
                    if(notation?.notationType?.UML != undefined) { //if uml is used don't consider private variables
                        partialKeys = extendedEntity.attributes.filter(attr => attr.type?.PARTIAL_KEY != undefined && attr.visibility?.PRIVATE == undefined)
                    }
                    else {
                        partialKeys = extendedEntity.attributes.filter(attr => attr.type?.PARTIAL_KEY != undefined)
                    }
                    if (partialKeys.length >= 1) {
                        return;
                    }
                    extendedEntity = extendedEntity.extends?.ref;
                }

                accept('warning', `Missing partial key for weak entity`, { node: entity, property: "attributes" });
            }
        }
        else {
            // Check for non-weak entities
            if (entity.attributes.filter(attr => attr.type?.KEY != undefined).length < 1) {
                let extendedEntity = entity.extends?.ref
                let notation = entity.$container.notation;

                // recursive check for inherited keys, do not warn if any are found
                while (extendedEntity) {
                    let partialKeys = []
                    if(notation?.notationType?.UML != undefined) { //if uml is used don't consider private variables
                        partialKeys = extendedEntity.attributes.filter(attr => attr.type?.KEY != attr.visibility?.PRIVATE == undefined)
                    }
                    else {
                        partialKeys = extendedEntity.attributes.filter(attr => attr.type?.KEY != undefined)
                    }
                    if (partialKeys.length >= 1) {
                        return;
                    }
                    extendedEntity = extendedEntity.extends?.ref;
                }

                accept('warning', `Missing primary key for entity`, { node: entity, property: "attributes" });
            }
        }
    }

    /*
    *   RELATIONSHIP
    */
    checkRelationshipAggregationComposition(relationship: Relationship, accept: ValidationAcceptor){
        let model = relationship.$container;
        if (isModel(model)) {
            let notation = model.notation?.notationType;
            if (notation !== null){
                if(notation?.UML != undefined){
                    //TODO
                }
                else{

                }
            }
        }
    }

    /*
    *   RELATION ENTITY
    */
    // checks the cardinality of a relationship entity when the notation is set to bachman, chen or crowsfoot to discourage incorrect use of cardinalities
    checkRelationEntityCardinality(relation: RelationEntity, accept: ValidationAcceptor) {
        let model = relation.$container.$container;
        if (isModel(model)) {
            let notation = model.notation?.notationType
            if (notation !== null) {
                if (notation?.BACHMAN != undefined ||
                    notation?.CHEN != undefined ||
                    notation?.CROWSFOOT != undefined) {
                    if (!(relation.cardinality?.ZERO_OR_MORE != undefined || relation.cardinality?.ONE != undefined || relation.cardinality?.MANY != undefined || relation.cardinality?.ZERO_OR_ONE != undefined)) {
                            accept('warning', `Invalid cardinality for '${relation.entity.ref?.name}'${'\n\n'}Use [0..1], [0..N], [1] or [N]`,
                                { node: relation, property: "cardinality" });
                    }
                }
            }
        }
    }

    /*
    *   ATTRIBUTE
    */
    checkAttributeVisibility(attribute: Attribute, accept: ValidationAcceptor){

    }

    /*
    *   ENTITY & RELATIONSHIP
    */
    // Performs a check on duplicate attribute names within an element
    checkEntityOrRelationshipAttributes(element: Entity | Relationship, accept: ValidationAcceptor) {
        let attributes = element.attributes;
        let attributeNames = element.attributes.map(attribute => attribute.name);
        attributes.forEach(attribute => {
            if (attributeNames.filter(n => n === attribute.name).length > 1) {
                accept('error', `Multiple attributes named \"'${attribute.name}'\".`, { node: attribute, property: 'name' });
            }
        });
    }
}