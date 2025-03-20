import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type { Entity, EntityRelationshipAstType } from './generated/ast.js';
import type { EntityRelationshipServices } from './entity-relationship-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: EntityRelationshipServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.EntityRelationshipValidator;
    const checks: ValidationChecks<EntityRelationshipAstType> = {
        Entity: validator.checkEntityStartsWithCapital
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class EntityRelationshipValidator {

    checkEntityStartsWithCapital(entity: Entity, accept: ValidationAcceptor): void {
        if (entity.name) {
            const firstChar = entity.name.substring(0, 1);
            if (firstChar.toUpperCase() !== firstChar) {
                accept('warning', 'Entity name should start with a capital.', { node: entity, property: 'name' });
            }
        }
    }

}
