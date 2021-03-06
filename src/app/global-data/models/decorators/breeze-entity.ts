import { Validators } from '@angular/forms';
import { SpListEntities } from '@ctypes/app-config';
import { SpEntityDef } from '@ctypes/breeze-type-customization';
import { MxmAppName, MxmAssignedModels } from 'app/app-config.service';
import { CustomNameConventionService } from 'app/global-data/service-adapter/custom-namingConventionDict';
import {
    AutoGeneratedKeyType,
    ComplexType,
    DataType,
    EntityType,
    MetadataStore,
    Validator
} from 'breeze-client';
import {
    DataProperty,
    DataPropertyConfig,
    NavigationPropertyConfig
} from 'breeze-client/src/entity-metadata';
import { ISpEntityType, SpConstructor, SpEntityBase } from '../_entity-base';
import { SpMetadata } from '../sp-metadata';
import {
    bzEntityValidatorWrapper,
    bzPropValidatorWrapper,
    BzPropCollection
} from './breeze-prop';

interface ICustomNameDictionary {
    [index: string]: {
        [index: string]: string;
    };
}

export interface IBzDataConfig {
    propType: 'data';
    spInternalName?: string;
    dataCfg?: Partial<DataPropertyConfig>;
}

export interface IBzNavConfig {
    propType: 'nav';
    navCfg: Partial<NavigationPropertyConfig>;
    relativeEntity: SpListEntities['shortname'];
}

export type BzPropType = BzScaffodPropType['propType'];

export type BzScaffodPropType = IBzDataConfig | IBzNavConfig;

export type ExcludePropTypeKey<TProp> = TProp extends 'propType'
    ? never
    : TProp;

export type ExcludeTypeField<A> = Partial<
    { [K in ExcludePropTypeKey<keyof A>]: A[K] }
>;

export type ExtractConfigParameters<A, T> = A extends { propType: T }
    ? ExcludeTypeField<A>
    : never;

export interface IBreezeScaffoldProto {
    spBzEntity: ISpBreezeEntity;
    propCollection: BzPropCollection;
    spBzNameDict: ICustomNameDictionary;
    bzEntityInit: () => void;
}

export interface ISpBreezeEntity {
    entityProps: IBzEntityProps;
    createTypeForStore: (
        store: MetadataStore,
        nameDictionaryService: CustomNameConventionService,
        namespace: string
    ) => void;
}

export interface IBzEntityProps {
    shortName?: string;
    isComplexType?: boolean;
    namespace?: string;
    autoKeyGenType?: AutoGeneratedKeyType;
}

class NewTypeForStore {
    public typeDef: Partial<SpEntityDef<any>> = {};
    public newBzEntityType: EntityType | ComplexType;
    private entityProps: IBzEntityProps = {} as any;
    // tslint:disable-next-line: ban-types
    private etConstructor: Function;
    private initializer: { [index: string]: (entity: any) => void } = {};

    constructor(
        private target: IBreezeScaffoldProto,
        private dictService: CustomNameConventionService,
        private store: MetadataStore
    ) {
        this.etConstructor = this.target as any;
        this.target = (this.target as any).prototype;

        Object.assign(this.entityProps, this.target.spBzEntity.entityProps);
        if (this.target.bzEntityInit) {
            Object.assign(this.initializer, this.target.bzEntityInit);
        }
        this.step1_SetDefaults()
            .step2_FixUpProps()
            .step3_AddEntityBaseProps()
            .step4_MakeDefaultSelect()
            .step5_AddNameDictToService()
            .step6_CreateTypeAndRegister()
            .step7_CreateFormValidation()
            .step8_RemoveEntityScaffold()
            .step9_RegisterEntity();
    }

    private addValidator(prop: DataProperty, validator: Validator): void {
        if (!validator) {
            return;
        } // no validator arg
        const valName = validator.name;
        const validators = prop.validators;
        const exists = validators.some(val => val.name === valName);
        if (!exists) {
            validators.push(validator);
        }
    }

    private step1_SetDefaults(): this {
        const ep = this.entityProps;
        this.typeDef.shortName = ep.shortName;
        this.typeDef.dataProperties = {};
        this.typeDef.custom = {};
        this.typeDef.isComplexType = ep.isComplexType;
        if (!ep.isComplexType) {
            this.typeDef.navigationProperties = {};
        }
        this.typeDef.namespace = ep.namespace;
        return this;
    }

    private step2_FixUpProps(propColl?: BzPropCollection): this {
        const decoratedProps = propColl || this.target.propCollection;
        decoratedProps.props
            .filter(dp => dp.propType === 'data')
            .forEach((dp: IBzDataConfig) => {
                if (dp.dataCfg.complexTypeName) {
                    let cplxName = dp.dataCfg.complexTypeName;
                    const nsStart = cplxName.indexOf(':#');
                    if (nsStart === -1) {
                        cplxName += ':#' + this.entityProps.namespace;
                    }
                    dp.dataCfg.complexTypeName = cplxName;
                }
                this.typeDef.dataProperties[
                    dp.dataCfg.name
                ] = dp.dataCfg as any;
            });

        decoratedProps.props
            .filter(dp => dp.propType === 'nav')
            .forEach((dp: IBzNavConfig) => {
                if (dp.navCfg.entityTypeName) {
                    let etName = dp.navCfg.entityTypeName;
                    const nsStart = etName.indexOf(':#');
                    if (nsStart === -1) {
                        etName += ':#' + this.entityProps.namespace;
                    }
                    dp.navCfg.entityTypeName = etName;
                }
                this.typeDef.navigationProperties[
                    dp.navCfg.name
                ] = dp.navCfg as any;
            });

        return this;
    }

    private step3_AddEntityBaseProps(): this {
        const baseEntityProps = Object.getPrototypeOf(this.target);
        if (baseEntityProps && baseEntityProps.propCollection) {
            this.step2_FixUpProps(baseEntityProps.propCollection);
        }
        return this;
    }

    private step4_MakeDefaultSelect(): this {
        if (this.typeDef.isComplexType) {
            return this;
        }

        const keys = Object.keys(this.typeDef.dataProperties);
        const dpNames = [];

        for (const key of keys) {
            if (this.typeDef.dataProperties[key].complexTypeName) {
                continue;
            }
            dpNames.push(key);
        }

        this.typeDef.custom['defaultSelect'] = dpNames.join(',');

        return this;
    }

    private step5_AddNameDictToService(): this {
        const dict = this.target.propCollection.propNameDictionary;
        const dictForType = {};

        const keys = dict.keys();
        for (const key of keys) {
            const dictKey = `${key}:#${this.entityProps.namespace}`;
            const dictProp = dict.get(key);
            if (dictForType[dictKey]) {
                Object.assign(dict[dictKey], dictProp);
            } else {
                const newEntry = { [dictKey]: dictProp };
                Object.assign(dictForType, newEntry);
            }
        }

        if (Object.keys(dictForType).length !== 0) {
            this.dictService.updateDictionary(dictForType);
        }
        return this;
    }

    private step6_CreateTypeAndRegister(): this {
        const ep = this.entityProps;
        ep.isComplexType
            ? this.subStep6_CreateComplexType()
            : this.subStep6_CreateEntityype();
        this.store.addEntityType(this.newBzEntityType);
        return this;
    }

    private subStep6_CreateComplexType(): void {
        this.newBzEntityType = new ComplexType(this.typeDef as any);
    }

    private subStep6_CreateEntityype(): void {
        const ep = this.entityProps;
        this.typeDef.autoGeneratedKeyType =
            ep.autoKeyGenType || AutoGeneratedKeyType.Identity;
        this.typeDef.defaultResourceName = `web/lists/getByTitle('${
            ep.shortName
        }')/items`;
        this.newBzEntityType = new EntityType(this.typeDef as any);
    }

    private step7_CreateFormValidation(dataProps?: DataProperty[]): this {
        /**
         * setups the defaults container for the form validators and
         * sets a local variable to reference the validators.
         */
        const formValidators = ((this
            .newBzEntityType as ISpEntityType).custom.formValidators = {
            entityVal: [],
            propVal: new Map()
        });

        /** Set a local variable for the entity's found collection */
        const customValidatorConfigs = this.target.propCollection
            .customBzValidators;

        /**
         * Method is setup to be recursive so that we can process
         * the base classes validators, if there are any. So look for
         * the parameter first, if not present process the class
         * entityType.
         */
        const dps = dataProps || this.newBzEntityType.dataProperties;

        /**
         * Iterate oveer the data properties and filter out any
         * properties that does not have a data type assigned, i.e.
         * complex properties.
         */
        dps.filter(dp => dp.dataType).forEach(dp => {
            const dt = dp.dataType as DataType;

            /** Set required Validator for non-nullable types */
            if (!dp.isNullable) {
                this.addValidator(dp, Validator.required());
            }

            /** Set maxlength Validator  types */
            if (dp.maxLength != null && dp.dataType === DataType.String) {
                this.addValidator(
                    dp,
                    Validator.maxLength({ maxLength: dp.maxLength })
                );
            }

            /**
             * Look at each of the non-string data types
             * and discover if there are any Breeze validator based
             * solely on the datatype. i.e. int16 validator in a
             * range of numbers. if they exists and haven't alread
             * been added push them into the data property validators.
             */
            if (dp.dataType !== DataType.String) {
                if (dt.validatorCtor) {
                    this.addValidator(dp, dt.validatorCtor());
                }
            }

            /**
             * Look at all the data property's validators and wrap them
             * into a Form validator and add them into a new array.
             */
            const frmValidatorWrappers = dp.validators.map(validator =>
                bzPropValidatorWrapper(validator)
            );

            /**
             * Look at the collection of decorated property validators
             * and find ones that belongs to this property
             */
            const targetedPropCustomValidator = customValidatorConfigs.propVal.get(
                dp.name
            );

            /**
             * if there are any validators for this decorated property
             * push in them into data property validator collection, and
             * then wrap them into Form Validation and push them into the
             * type's collection validators.
             */
            if (targetedPropCustomValidator) {
                targetedPropCustomValidator.forEach(tpcv => {
                    dp.validators.push(tpcv as any);
                });
                targetedPropCustomValidator.forEach(tpcv =>
                    frmValidatorWrappers.push(bzPropValidatorWrapper(tpcv()))
                );
            }

            /**
             * Once all the Breeze property validators have been arrayed
             * and them to the entity type's formValidator map.
             */
            formValidators.propVal.set(dp.name, frmValidatorWrappers);
        });

        /**
         * Loop over the configuration's entity level validators that
         * were found on class, wrap them into a Form Validator [[bzEntityValidatorWrapper]] then push into the formValidator's
         * entity array.
         */
        customValidatorConfigs.entityVal.forEach(cfg => {
            formValidators.entityVal.push(
                bzEntityValidatorWrapper(cfg.validator(), cfg.reqProps)
            );
        });

        return this;
    }

    /**
     * Clean up the entity's class prototype so that these property
     * do not show as unnecessary unmapped properties on the Breeze entity
     * type when the ctor is registered [[step9_RegisterEntity]]
     */
    private step8_RemoveEntityScaffold(): this {
        delete this.target.propCollection;
        delete this.target.spBzEntity;
        delete this.target.bzEntityInit;
        return this;
    }

    /**
     * Last step in the entity creation process is the register
     * the class as a constructor for this entity type and add any
     * initializer that may exist on the class.
     */
    private step9_RegisterEntity(): this {
        this.store.registerEntityTypeCtor(
            this.entityProps.shortName,
            this.etConstructor,
            this.initializer.value
        );
        return this;
    }
}

export const BzEntity = <
    TClass extends SpConstructor<SpEntityBase | SpMetadata>
>(
    forAppNamed: MxmAppName | 'Global',
    entityProps: IBzEntityProps
) => {
    return (constructor: TClass): void => {
        // TODO: check constructor name after uglify
        entityProps.shortName = (constructor as any).ENTITY_SHORTNAME =
            entityProps.shortName || constructor.name;

        class SpBreezeEntity implements ISpBreezeEntity {
            entityProps = entityProps;

            constructor() {}

            createTypeForStore = (
                store: MetadataStore,
                nameDictionaryService: CustomNameConventionService,
                namespace?: string
            ) => {
                entityProps.namespace = entityProps.namespace || namespace;
                return new NewTypeForStore(
                    constructor as any,
                    nameDictionaryService,
                    store
                );
            }
        }

        if (!Object.getOwnPropertyDescriptor(constructor, 'spBzEntity')) {
            Object.defineProperty(constructor.prototype, 'spBzEntity', {
                enumerable: false,
                value: new SpBreezeEntity(),
                writable: true,
                configurable: true
            });
        }

        if (constructor.name !== 'SpEntityBase') {
            const modelCollection = MxmAssignedModels.has(forAppNamed)
                ? MxmAssignedModels.get(forAppNamed)
                : [];
            modelCollection.push(constructor as any);
            MxmAssignedModels.set(forAppNamed, modelCollection);
        }
    };
};
