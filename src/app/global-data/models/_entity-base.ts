import { DataMembers, Instantiable } from '@ctypes/breeze-type-customization';
import { DataType, Entity, EntityAspect, EntityType } from 'breeze-client';
import { EntityDefinition } from './custom-entity-def';
import { SpMetadata } from './sp-metadata';

export class SpEntityBase implements Entity {
    private iD: number; // sharepoint includes this property but we dont use it;
    entityAspect: EntityAspect;
    entityType: EntityType;
    id: number;
    modified: Date;
    created: Date;
    authorId: number;
    editorId: number;
    __metadata?: SpMetadata;
    // get $typeName(): string {
    //     if (!this.entityAspect) {return; }
    //     return this.entityType.shortName;
    // }
}

export class MetadataBase<T> {
    protected dt = DataType;

    protected baseDataProperties: DataMembers<SpEntityBase> = {
        id: {
            dataType: this.dt.Int32,
            isPartOfKey: true
        },
        __metadata: {
            complexTypeName: '__metadata',
            dataType: null,
            isNullable: false
        },
        modified: { dataType: this.dt.DateTime },
        created: { dataType: this.dt.DateTime },
        authorId: { dataType: this.dt.Int32 },
        editorId: { dataType: this.dt.Int32 }
    };

    entityDefinition = new EntityDefinition<T>();

    metadataFor: Instantiable<T>;

    constructor(shortName: string) {
        this.entityDefinition.shortName = shortName;
        this.entityDefinition.defaultResourceName = `web/lists/getByTitle('${shortName}')/items`;
    }

    addDefaultSelect(type: EntityType): EntityType {
        const customProp = type.custom;
        const excludeProps = ['__metadata'];

        if (type.isComplexType) {
            return;
        }

        if (!customProp || !customProp['defaultSelect']) {
            const selectItems = [];
            type.dataProperties.forEach(prop => {
                const isExcluded = excludeProps.some(exProp => exProp === prop.name);
                if (!prop.isUnmapped && !isExcluded) {
                    selectItems.push(prop.name);
                }
            });
            if (selectItems.length) {
                if (!customProp) {
                    type.custom = {};
                }
                type.custom = { defaultSelect: selectItems.join(',') };
            }
        }
        return type;
    }

    initializer(_entity: T) {}
}
