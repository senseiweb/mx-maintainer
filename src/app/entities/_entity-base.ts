import { Entity, EntityAspect, EntityType } from "breeze-client";
import * as breeze from 'breeze-client';
import 'breeze-client-labs/breeze.metadata-helper';
import { MetadataStore, EntityActionSymbol } from "breeze";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type etDef = Omit<breeze.config.EntityTypeDef, 'dataProperties'|'navigationProperties'>;

export type dtDef = Omit<breeze.config.DataPropertyDef, 'dataType'>;

export interface spDataDef extends dtDef {
    dataType: breeze.DataTypeSymbol
}
export interface spNavDef extends dtDef {
    dataType: breeze.DataTypeSymbol
}
export interface dataMembers {
    [key: string]: spDataDef
}
export interface navMembers {
    [key: string]: breeze.config.NavigationPropertyDef;
}
export interface SpEntityDef extends etDef {
    dataProperties: dataMembers;
    navigationProperties?: navMembers;
}

export class EntityBase implements Entity {
    shortName: string;
    entityAspect: EntityAspect;
    entityType: EntityType;
    def = {} as SpEntityDef;
    protected dt = breeze.DataType;
    self: any;

    coreProperties: dataMembers = {
        "__metadata": {
            dataType: this.dt.String,
            complexTypeName: 'Metadata:#NSP.Squad.Mgr',
            isNullable: false
        }
    }

    get $typeName(): string {
        if (!this.entityAspect) {return;}
        return this.entityAspect.getKey().entityType.shortName;
    }

    initializer(entity: Entity): void { };

    registerMe(store: breeze.MetadataStore, metadataHelper: breeze.config.MetadataHelper ): void {
        metadataHelper.addTypeToStore(store, this.def as any)
        store.registerEntityTypeCtor(this.shortName, this.self,this.initializer)
    }
}