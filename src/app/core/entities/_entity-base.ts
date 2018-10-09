import { Entity, EntityAspect, EntityType } from 'breeze-client';
import { SpMetadata } from './sp-metadata';
import * as breeze from 'breeze-client';
import 'breeze-client-labs/breeze.metadata-helper';
import { MetadataStore, EntityActionSymbol } from 'breeze';
import { Injectable } from '@angular/core';

export declare type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type ConfigKeys = 'isolist' | '';

export type etDef = Omit<breeze.config.EntityTypeDef, 'dataProperties'|'navigationProperties'>;

export type dtDef = Omit<breeze.config.DataPropertyDef, 'dataType'>;

export interface SpDataDef extends dtDef {
    dataType: breeze.DataTypeSymbol;
}
export interface SpNavDef extends dtDef {
    dataType: breeze.DataTypeSymbol;
}
export interface DataMembers {
    [key: string]: SpDataDef;
}
export interface NavMembers {
    [key: string]: breeze.config.NavigationPropertyDef;
}
export interface SpEntityDef extends etDef {
    dataProperties: DataMembers;
    isComplexType: boolean;
    navigationProperties?: NavMembers;
}

@Injectable()
export class EntityBase implements Entity {
    shortName: string;
    entityAspect: EntityAspect;
    entityType: EntityType;
    entityDefinition = {
        dataProperties: {},
        navigationProperties: {}
    } as SpEntityDef;

    protected dt = breeze.DataType;
    self: any;

    coreProperties: DataMembers = {
        Id: {
            dataType: this.dt.Int32,
            isPartOfKey: true,
        },
        '__metadata': {
            complexTypeName: '__metadata',
            dataType: null,
            isNullable: false
        },
        Modified: { dataType: this.dt.DateTime},
        Created: { dataType: this.dt.DateTime },
        AuthorId: { dataType: this.dt.Int32 },
        EditorId: { dataType: this.dt.Int32 }
    };

    id?: number;
    modified?: Date;
    created?: Date;
    authorId?: number;
    editorId?: number;
    __metadata?: SpMetadata;

    get $typeName(): string {
        if (!this.entityAspect) {return; }
        return this.entityAspect.getKey().entityType.shortName;
    }

    initializer(entity: Entity): void { }

    private addDefaultSelect(type: EntityType): EntityType {
        const customPropExist = type.custom;
        if (!customPropExist || !customPropExist.defaultSelect) {
            const selectItems = [];
            type.dataProperties.forEach((prop) => {
                if (!prop.isUnmapped) { selectItems.push(prop.name); }
            });
            if (selectItems.length) {
                if (!customPropExist) {
                    type.custom = {};
                }
                type.custom.defaultSelect = selectItems.join(',');
            }
        }
        return type;
    }

    registerMe(store: breeze.MetadataStore, metadataHelper: breeze.config.MetadataHelper): void {
        const addedType = metadataHelper.addTypeToStore(store, this.entityDefinition as any) as EntityType;
        store.registerEntityTypeCtor(this.shortName, this.self.constructor, this.initializer);
        // store.setEntityTypeForResourceName(this.entityDefinition.defaultResourceName, addedType);
        this.addDefaultSelect(addedType);

    }
}
