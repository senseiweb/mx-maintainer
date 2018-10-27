import { Entity, EntityAspect, EntityType } from 'breeze-client';
import { SpMetadata } from './sp-metadata';
import * as breeze from 'breeze-client';
import 'breeze-client-labs/breeze.metadata-helper';

export interface Instantiable<T> {
    new(...args: any[]): T;
}

export declare type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

declare type ExtreBareEntityProps = 'entityType' | 'entityAspect' | 'initializer' | 'entityDefinition' | '$typeName' | 'registerMe';

export declare type bareEntity<T> = Pick<T, Exclude<keyof T, keyof breeze.Entity |ExtreBareEntityProps>>;

declare type etDef = Omit<breeze.config.EntityTypeDef, 'dataProperties'|'navigationProperties'>;

declare type dtDef = Omit<breeze.config.DataPropertyDef, 'dataType'>;

export interface SpDataDef extends dtDef {
    dataType: breeze.DataTypeSymbol;
    hasMany?: boolean;
}
export interface SpNavDef extends dtDef {
    dataType: breeze.DataTypeSymbol;
}
export type DataMembers<T> = {
    [key in keyof bareEntity<T>]: SpDataDef;
};
export interface NavMembers {
    [key: string]: breeze.config.NavigationPropertyDef;
}
export interface SpEntityDef<T> extends etDef {
    dataProperties: DataMembers<T>;
    isComplexType: boolean;
    navigationProperties?: NavMembers;
}

export class SpEntityBase implements Entity {
    entityAspect: EntityAspect;
    entityType: EntityType;
    id?: number;
    modified?: Date;
    created?: Date;
    authorId?: number;
    editorId?: number;
    __metadata?: SpMetadata;
}

export class MetadataBase<T> {

    protected dt = breeze.DataType;

    protected baseDataProperties: DataMembers<SpEntityBase> = {
        id: {
            dataType: this.dt.Int32,
            isPartOfKey: true,
        },
        '__metadata': {
            complexTypeName: '__metadata',
            dataType: null,
            isNullable: false
        },
        modified: { dataType: this.dt.DateTime },
        created: { dataType: this.dt.DateTime },
        authorId: { dataType: this.dt.Int32 },
        editorId: { dataType: this.dt.Int32 }
    };

    entityDefinition = {
        dataProperties: {},
        navigationProperties: {},
        shortName: '',
        defaultResourceName: '',
    } as SpEntityDef<T>;

    metadataFor: Instantiable<T>;

    constructor(shortName: string) {
        this.entityDefinition.shortName = shortName;
        this.entityDefinition.defaultResourceName = `lists/getByTitle('${shortName}')/items`;
    }

    // get $typeName(): string {
    //     if (!this.entityAspect) {return; }
    //     return this.entityAspect.getKey().entityType.shortName;
    // }

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

    initializer(entity: T) { }

    registerMe(store: breeze.MetadataStore,
        metadataHelper: breeze.config.MetadataHelper,
        spEntity: any,
        initializer?: (entity: Entity) => void): void {

        const addedType = metadataHelper.addTypeToStore(store, this.entityDefinition as any) as EntityType;
        store.registerEntityTypeCtor(this.entityDefinition.shortName, spEntity , initializer);
        if (this.entityDefinition.defaultResourceName) {
            store.setEntityTypeForResourceName(this.entityDefinition.defaultResourceName, addedType);
        }
        this.addDefaultSelect(addedType);

    }
}
