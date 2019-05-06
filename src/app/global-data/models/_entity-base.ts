import { Validators, ValidatorFn } from '@angular/forms';
import {
    bareEntity,
    FilterEntityCollection,
    Omit
} from '@ctypes/breeze-type-customization';
import { SpListName } from 'app/app-config.service';
import { Entity, EntityAspect, EntityType } from 'breeze-client';
import * as _ from 'lodash';
import { SpMetadata } from './sp-metadata';
import { BzProp } from './decorators';

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
        formValidators?: Map<string, ValidatorFn[]>;
    };
}

export abstract class SpEntityBase implements Entity {
    private iD: number; // sharepoint includes this property but we dont use it;
    // client-side only; soft delete options
    isSoftDeleted: boolean;
    entityAspect: EntityAspect;
    entityType: ISpEntityType;

    @BzProp('data', {
        dataCfg: {isPartOfKey: true}
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
            complexTypeName: '__metadata:#SP.Data', 
            
        }
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


}

export type SpConstructor<T> = new (...args: any[]) => T;
