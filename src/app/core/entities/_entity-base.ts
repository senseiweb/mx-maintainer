import { Entity, EntityAspect, EntityType } from 'breeze-client';
import { SpMetadata } from './sp-metadata';
import * as breeze from 'breeze-client';
import 'breeze-client-labs/breeze.metadata-helper';

export declare type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

declare type ExtreBareEntityProps = 'entityType' | 'entityAspect' | 'initializer' | 'entityDefinition' | '$typeName' | 'registerMe';

export declare type bareEntity<T> = Pick<T, Exclude<keyof T, keyof breeze.Entity |ExtreBareEntityProps>>;

declare type etDef = Omit<breeze.config.EntityTypeDef, 'dataProperties'|'navigationProperties'>;

declare type dtDef = Omit<breeze.config.DataPropertyDef, 'dataType'>;

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

export const dt = breeze.DataType;

export const baseDataProperties: DataMembers = {
    id: {
        dataType: dt.Int32,
        isPartOfKey: true,
    },
    '__metadata': {
        complexTypeName: '__metadata',
        dataType: null,
        isNullable: false
    },
    modified: { dataType: dt.DateTime },
    created: { dataType: dt.DateTime },
    authorId: { dataType: dt.Int32 },
    editorId: { dataType: dt.Int32 }
};


export class EntityBase implements Entity {
    shortName?: string;
    entityAspect: EntityAspect;
    entityType: EntityType;
    entityDefinition = {
        dataProperties: {},
        navigationProperties: {},
        shortName: '',
        defaultResourceName: '',
    } as SpEntityDef;

    id?: number;
    modified?: Date;
    created?: Date;
    authorId?: number;
    editorId?: number;
    __metadata?: SpMetadata;

    constructor(shortName: string) {
        this.entityDefinition.shortName = shortName;
        this.shortName = shortName;
        this.entityDefinition.defaultResourceName = `lists/getByTitle('${shortName}')/items`;
    }

    get $typeName(): string {
        if (!this.entityAspect) {return; }
        return this.entityAspect.getKey().entityType.shortName;
    }

    initializer(entity: Entity): void { }

    private addDefaultSelect(type: EntityType): EntityType {
        const customPropExist = type.custom;
        const excludeProps = ['__metadata'];

        if (!customPropExist || !customPropExist.defaultSelect) {
            const selectItems = [];
            type.dataProperties.forEach((prop) => {
                const isExcluded = excludeProps.some(exProp => exProp === prop.name);
                if (!prop.isUnmapped && !isExcluded) { selectItems.push(prop.name); }
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
        store.registerEntityTypeCtor(this.shortName, this.constructor, this.initializer);
        // store.setEntityTypeForResourceName(this.entityDefinition.defaultResourceName, addedType);
        this.addDefaultSelect(addedType);

    }
}
