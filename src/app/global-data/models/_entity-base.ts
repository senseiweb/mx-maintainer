import { Validators, ValidatorFn } from '@angular/forms';
import {
    DiscriminateUnion,
    SpEntityOfType,
    SpListEntities,
    DiscriminateChildUnion,
    SpChildOfType,
} from '@ctypes/app-config';
import {
    bareEntity,
    FilterEntityCollection,
    Omit,
    Unarray,
    FilterEntityPropCollection
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

export type FilterEntityCollection2<T extends SpEntityOfType> =
    { [K in keyof T]: T[K] extends SpEntityBase[] ? (K extends Array<infer U> ? U : K) : never }['shortname'];

// export type SpChildOfType<T> = T extends SpListEntities ? SpListEntities['shortname']: never;

// export type SpChildOfType<T> =
//     FilterEntityChildProp<T> extends SpListEntities ? T['shortname'] : never;


    // export type FilterChildEntityProp<T> =
    // Pick<T, { [K in keyof T]: T[K] extends SpEntityBase[] ? T['shortname'] : never }>;

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
    /**
     * When used, indicates that child entity will be deleted
     * during the next save operation. Prefer to use this method
     * when entities may be deleted and restored several times
     * before actual saving is done to store.
     *
     * Used instead of Breeze internal setDeleted() method becuase
     * setDeleted() assume the entity will not longer be reference, '
     * which cases all child and parent references to this entity
     * be dropped and a pain in the butt to be recovered later.
     */
    isSoftDeleted?: boolean;

    /** Provided by Breeze after the entity is created */
    entityAspect: EntityAspect;

    /** Provided by Breeze after the entity is created */
    entityType: ISpEntityType;

    abstract readonly shortname: string;

    @BzProp('data', {
        dataCfg: { isPartOfKey: true }
    })
    id: number;

    @BzProp('data', {})
    modified: Date;

    @BzProp('data', {})
    created: Date;

    @BzProp('data', {})
    authorId: number;

    @BzProp('data', {})
    editorId: number;

    @BzProp('data', {
        dataCfg: {
            isNullable: false,
            complexTypeName: '__metadata:#SP.Data'
        }
    })
    __metadata: SpMetadata;

    /**
     * Convientant method for creating child entities for a
     * given parenet.
     */
    createChild = <TChild extends SpEntityOfType>(
        childType: TChild,
        defaultProps?: DiscriminateChildUnion<TChild>
    ): any => {
        const em = this.entityAspect.entityManager;
        try {
            // creates and attaches itself to the current em;
            const newEntity = em.createEntity(childType, defaultProps);
            return (newEntity as any) as T;
        } catch (e) {
            const err = new Error(e);
            console.log(err);
        }
    }
    // createChild = <T extends FilterEntityCollection<this>>(
    //     childType: SpListName
    //     defaultProps?: bareEntity<T>
    // ): T => {
    //     const em = this.entityAspect.entityManager;
    //     try {
    //         // creates and attaches itself to the current em;
    //         const newEntity = em.createEntity(entityType, defaultProps);
    //         return (newEntity as any) as T;
    //     } catch (e) {
    //         const err = new Error(e);
    //         console.log(err);
    //     }
    // }
}
