import {  Validators, ValidatorFn } from '@angular/forms';
import {
    bareEntity,
       FilterEntityCollection,
        Omit
} from '@ctypes/breeze-type-customization';
import { SpListName } from 'app/app-config.service';
import {
    
    Entity,
    EntityAspect,
    EntityType,
} from 'breeze-client';
import * as _ from 'lodash';
import { BzDataProp } from './decorators';
import { SpMetadata } from './sp-metadata';

export interface IValidatorCtx<T> {
    value: T;
    name: string;
    displayName: string;
    messageTemplate: string;
    message?: string;
}

export type IBreezeNgValidator<T> = { [key in keyof T]: Validators[] };
type SpEntityType = Omit<EntityType, 'custom'>;

export interface ISpEntityType extends SpEntityType {
    custom?: {
        defaultSelect?: string;
        validatorMap?: {
            [index: string]: ValidatorFn[];
        };
    };
}

export abstract class SpEntityBase implements Entity {
    private iD: number; // sharepoint includes this property but we dont use it;
    // client-side only; soft delete options
    isSoftDeleted: boolean;
    entityAspect: EntityAspect;
    entityType: ISpEntityType;

    @BzDataProp({
        isPartOfKey: true
    })
    id: number;
    @BzDataProp()
    modified: Date;
    @BzDataProp()
    created: Date;
    @BzDataProp()
    authorId: number;
    @BzDataProp()
    editorId: number;
    @BzDataProp({
        complexTypeName: '__metadata:#SP.Data',
        isNullable: false,
        isScalar: true
    })
    __metadata: SpMetadata;
    createChild = <T extends FilterEntityCollection<this>>(
        entityType: keyof typeof SpListName,
        defaultProps?: bareEntity<T>
    ): T => {
        const em = this.entityAspect.entityManager;
        try {
            // creates and attaches itself to the current em;
            const newEntity = em.createEntity(entityType, defaultProps);
            return (newEntity as any) as T;
        } catch (e) {
            const err = new Error(e);
            console.log(err);
        }
    }
    // get $typeName(): string {
    //     if (!this.entityAspect) {return; }
    //     return this.entityType.shortName;
    // }
}
