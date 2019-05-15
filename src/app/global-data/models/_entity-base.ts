import { Validators, ValidatorFn } from '@angular/forms';
import { SpListEntities } from '@ctypes/app-config';
import {
    EntityChildShortName,
    Omit,
    SelectedEntityKind
} from '@ctypes/breeze-type-customization';
import { Entity, EntityAspect, EntityType } from 'breeze-client';
import * as _ from 'lodash';
import { BzProp } from './decorators';
import { SpMetadata } from './sp-metadata';

export interface IValidatorCtx<T> {
    value: T;
    name: string;
    displayName: string;
    messageTemplate: string;
    message?: string;
}

export type IBreezeNgValidator<T> = { [key in keyof T]: Validators[] };

export type SpConstructor<T> = new (...args: any[]) => T;

type SpEntityType = Omit<EntityType, 'custom'>;

export interface IBzCustomFormValidators {
    propVal: Map<string, ValidatorFn[]>;
    entityVal: Array<(entity: SpEntityBase) => ValidatorFn>;
}

export interface ISpEntityType extends SpEntityType {
    custom?: {
        defaultSelect?: string;
        formValidators?: IBzCustomFormValidators;
    };
}

/**
 * Represent the base class for all non-complex Breeze
 * entities.
 */
export abstract class SpEntityBase implements Entity {
    /** Provided by Breeze after the entity is created */
    entityAspect: EntityAspect;

    /** Provided by Breeze after the entity is created */
    entityType: ISpEntityType;

    abstract readonly shortname: SpListEntities['shortname'];

    @BzProp('data', {
        dataCfg: { isPartOfKey: true }
    })
    id?: number;

    @BzProp('data', {})
    modified?: Date;

    @BzProp('data', {})
    created?: Date;

    @BzProp('data', {})
    authorId?: number;

    @BzProp('data', {})
    editorId?: number;

    @BzProp('data', {
        dataCfg: {
            isNullable: false,
            complexTypeName: '__metadata:#SP.Data'
        }
    })
    __metadata?: SpMetadata;

    /**
     * Convientant method for creating child entities for a
     * given parenet.
     */
    createChild = <TChild extends EntityChildShortName<this>>(
        childType: TChild,
        defaultProps?: Partial<SelectedEntityKind<TChild>>
    ): SelectedEntityKind<TChild> => {
        const em = this.entityAspect.entityManager;
        // creates and attaches itself to the current em;
        const newEntity = em.createEntity(childType as any, defaultProps);
        return newEntity as SelectedEntityKind<TChild>;
    }
}
