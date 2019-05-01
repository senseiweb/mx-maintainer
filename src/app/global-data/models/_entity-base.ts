import { AbstractControl, Validators, ValidatorFn } from '@angular/forms';
import {
    bareEntity,
    DataMembers,
    EntityChildren,
    FilterEntityCollection,
    Instantiable,
    Omit
} from '@ctypes/breeze-type-customization';
import { SpListName } from 'app/app-config.service';
import {
    DataType,
    Entity,
    EntityAspect,
    EntityType,
    Validator
} from 'breeze-client';
import * as _ from 'lodash';
import { BzDataProp } from './_entity-decorators';
import { EntityDefinition } from './custom-entity-def';
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

export class SpEntityBase implements Entity {
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
        isNullable: false
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

export class MetadataBase<T> {
    protected dt = DataType;

    protected baseDataProperties: DataMembers<SpEntityBase> = {
        id: {
            dataType: this.dt.Int32,
            isPartOfKey: true
        },
        __metadata: {
            complexTypeName: '__metadata:#SP.Data',
            isNullable: false
        },
        modified: { dataType: this.dt.DateTime },
        created: { dataType: this.dt.DateTime },
        authorId: { dataType: this.dt.Int32 },
        editorId: { dataType: this.dt.Int32 }
    };

    entityDefinition = new EntityDefinition<T>();

    entityValidators: Validator[];

    metadataFor: Instantiable<T>;

    constructor(shortName: keyof typeof SpListName) {
        this.entityDefinition.shortName = shortName;
        this.entityDefinition.defaultResourceName = `web/lists/getByTitle('${shortName}')/items`;
    }

    addDefaultSelect(type: ISpEntityType): ISpEntityType {
        const excludeProps = ['__metadata'];

        if (type.isComplexType) {
            return;
        }

        if (type.custom && !type.custom.defaultSelect) {
            return type;
        }
        const selectItems = [];
        type.dataProperties.forEach(prop => {
            const isExcluded = excludeProps.some(
                exProp => exProp === prop.name
            );
            if (!prop.isUnmapped && !isExcluded) {
                selectItems.push(prop.name);
            }
        });

        if (!selectItems.length) {
            return type;
        }
        const selectList = selectItems.join(',');

        type.custom = type.custom
            ? (type.custom.defaultSelect = selectList)
            : ({ defaultSelect: selectList } as any);

        return type;
    }

    transformValidators(type: ISpEntityType): void {
        const customProp = type.custom ? type.custom : {};
        const valMap = (customProp.validatorMap = {});
        type.dataProperties.forEach(dp => {
            dp.validators.forEach(validator => {
                let currentVal: ValidatorFn;
                switch (validator.name) {
                    case 'required':
                        currentVal = Validators.required;
                        break;
                    case 'emailAddress':
                        currentVal = Validators.email;
                        break;
                    case 'maxLength':
                        currentVal = Validators.maxLength(
                            validator.context.value
                        );
                        break;
                    default:
                        currentVal = this.bzValidatorWrapper(validator);
                }
                if (!currentVal) {
                    return;
                }
                valMap[dp.name] = valMap[dp.name] || [];
                valMap[dp.name].push(currentVal);
            });
        });
    }

    private bzValidatorWrapper = (validator: Validator): ValidatorFn => {
        return (c: AbstractControl): { [error: string]: any } => {
            const result = validator.validate(c.value, validator.context);
            return result
                ? { [result.propertyName]: result.errorMessage }
                : null;
        };
    }

    private createValidatorBase(
        vname: string,
        validator: (
            entityOrProp: T | keyof T,
            ctx: {
                value: T;
                name: string;
                displayName: string;
                messageTemplate: string;
                message?: string;
            }
        ) => boolean
    ) {
        const eValidator = new Validator(vname, validator);
        this.entityValidators = this.entityValidators
            ? this.entityValidators
            : [];
        this.entityValidators.push(eValidator);
    }

    protected createEntityValidator(
        validatorName: string,
        validator: (entity: T, ctx: IValidatorCtx<T>) => boolean
    ) {
        this.createValidatorBase(validatorName, validator);
    }

    protected createPropValidator(
        validatorName: string,
        validator: (entity: keyof T, ctx: IValidatorCtx<T>) => boolean
    ) {
        this.createValidatorBase(validatorName, validator);
    }

    initializer = (_entity: T) => {};
}
