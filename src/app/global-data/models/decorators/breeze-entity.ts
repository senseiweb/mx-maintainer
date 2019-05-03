import { Validators } from '@angular/forms';
import { SpDataDef, SpNavDef } from '@ctypes/breeze-type-customization';
import {
    MxmAppName,
    MxmAssignedModels,
    SpListName
} from 'app/app-config.service';
import {
    AutoGeneratedKeyType,
    ComplexType,
    DataType,
    EntityType,
    MetadataStore,
    Validator
} from 'breeze-client';
import { SpEntityBase } from '../_entity-base';
import { bzValidatorWrapper } from './breeze-validation';

export type SpEntityDecorator = SpEntityBase &
    Partial<IBzEntityPropDecorator> &
    Partial<IBzValidators>;

interface IBzEntityPropDecorator {
    _bzDataProps: Map<string, Partial<SpDataDef>>;
    _bzNavProps: Map<string, Partial<SpNavDef<any>>>;
    _bzDefaultSelect: string[];
    _makeNameingDict: (
        namespace: string,
        customDictionary: ICustomNameDictionary,
        entity: SpEntityDecorator
    ) => ICustomNameDictionary;
    _createTypeInStore: (store: MetadataStore) => void;
    // Naming Dictionary SpListName:#Namespace:{propName: spInternalName}
    _bzNamingDict: Map<string, { [key: string]: string }>;
}

interface ICustomNameDictionary {
    [index: string]: {
        [index: string]: string;
    };
}

export interface IBzValidators {
    bzValidator?: {
        [index: string]: {
            entityValidators: Validator[];
            formValidators: Validators[];
        };
    };
}

const copyDataProps = (
    typeDef: { dataProperties: {}; navigationProperties?: {} },
    targetConstructor: Function,
    entityProps: {
        shortName: keyof typeof SpListName | '__metadata';
        isComplexType?: boolean;
        namespace?: string;
    }
): string[] => {
    const dataProps: Map<string, Partial<SpDataDef>> =
        targetConstructor.prototype._bzDataProps || [];

    const navProps: Map<string, Partial<SpDataDef>> =
        targetConstructor.prototype._bzNavProps || [];

    // dataProps.delete('spInternalName');

    dataProps.forEach((dpValue, dpKey) => {
        const propTypeName = dpValue['complexTypeName'];

        if (propTypeName) {
            // append the namespace to entityTypeName if missing
            const nsStart = propTypeName && propTypeName.indexOf(':#');

            if (nsStart === -1) {
                // name is unqualified; append the namespace
                dpValue['complexTypeName'] += ':#' + entityProps.namespace;
            }
        }

        typeDef.dataProperties[dpKey] = dpValue;
    });

    navProps.forEach((dpValue, dpKey) => {
        let propTypeName = dpValue['entityTypeName'];

        // append the namespace to entityTypeName if missing
        const nsStart = propTypeName.indexOf(':#');
        if (nsStart === -1) {
            // name is unqualified; append the namespace
            dpValue['entityTypeName'] += ':#' + entityProps.namespace;
        } else {
            propTypeName = propTypeName.slice(0, nsStart);
        }

        typeDef.navigationProperties[dpKey] = dpValue;
    });

    // if (entityProps.isComplexType) {
    //     delete typeDef.navigationProperties;
    //     return typeDef;
    // }
    const baseEntityProps = Object.getPrototypeOf(targetConstructor);
    let parentDefaultSelect: string[];
    if (
        baseEntityProps &&
        baseEntityProps.prototype &&
        baseEntityProps.prototype._bzDataProps
    ) {
        baseEntityProps.prototype._bzDataProps.forEach((dpValue, dpKey) => {
            typeDef.dataProperties[dpKey] = dpValue;
        });

        parentDefaultSelect = baseEntityProps.prototype._bzDefaultSelect;
    }

    const targetDefaultSelect = targetConstructor.prototype._bzDefaultSelect;

    return parentDefaultSelect
        ? targetDefaultSelect.concat(parentDefaultSelect)
        : targetDefaultSelect;
};

const setValidations = (etType: EntityType, bzValidators: IBzValidators) => {
    etType.dataProperties.forEach(dp => {
        const propBzValidator =
            bzValidators && bzValidators[dp.name]
                ? bzValidators[dp.name]
                : ((bzValidators as any) = {}[dp.name] = {
                      entityValidators: [],
                      formValidators: []
                  });

        const dt = dp.dataType as any;

        // add validators that breeze auto finds based on datatype
        const validateCtor =
            !dt || dt === DataType.String ? null : dt.validatorCtor;

        if (validateCtor) {
            const validator = validateCtor();
            const exists = dp.validators.some(
                val => val.name === validator.name
            );

            if (!exists) {
                dp.validators.push(validator);
                propBzValidator.formValidators.push(
                    bzValidatorWrapper(validator)
                );
            }
        }

        // process props that have validation annotations
        const annotatedValidators = Object.keys(bzValidators);

        const hasEntityLevelValidation = annotatedValidators.includes('entity');

        if (hasEntityLevelValidation) {
            const entityLevelValidators =
                bzValidators['entity'].entityValidators;
            entityLevelValidators.forEach(val => {
                if (etType.validators.some(val.name)) {
                    return;
                }
                etType.validators.push(val);
            });
        }

        // const hasPropLevelValidation = annotatedValidators.includes(dp.name);
        // if (hasPropLevelValidation) {
        //     const validators = bzValidators[dp.name].entityValidators;
        //     validators.forEach(val => {
        //         if (dp.validators.some(val.name)) {
        //             return;
        //         }
        //         dp.validators.push(val);
        //     });
        // }
    });
};

const removedEntityScaffold = (constructor: Function) => {
    delete constructor.prototype.defaultResourceName;
    delete constructor.prototype._bzDataProps;
    delete constructor.prototype._bzNavProps;
    delete constructor.prototype._createTypeInStore;
    delete constructor.prototype._bzNamingDict;
    delete constructor.prototype._bzDefaultSelect;
    delete constructor.prototype.initializer;
};

const makeNamingDictionary = (
    namespace: string,
    customDictionary: ICustomNameDictionary,
    entity: SpEntityDecorator
): ICustomNameDictionary => {
    if (!entity._bzNamingDict) {
        return customDictionary;
    }
    const keys = entity._bzNamingDict.keys();
    for (const key of keys) {
        const dictKey = key + namespace;
        const dictProp = entity._bzNamingDict.get(key);
        if (customDictionary[dictKey]) {
            Object.assign(customDictionary[dictKey], dictProp);
        } else {
            const newEntry = { [dictKey]: dictProp };
            Object.assign(customDictionary, newEntry);
        }
    }
    return customDictionary;
};

const createTypeInStore = (
    constructor: Function,
    entityProps: {
        shortName: keyof typeof SpListName | '__metadata';
        isComplexType?: boolean;
        namespace?: string;
    },
    featureNamespace: string,
    store: MetadataStore,
    autoGenKeyType?: AutoGeneratedKeyType
) => {
    const typeDef: {
        shortName: string;
        dataProperties: {};
        navigationProperties?: {};
        defaultResourceName?: string;
        autoGeneratedKeyType: AutoGeneratedKeyType;
        namespace: string;
    } = {
        shortName: entityProps.shortName,
        dataProperties: {},
        namespace: '',
        autoGeneratedKeyType: undefined
    };

    if (!entityProps.isComplexType) {
        typeDef.navigationProperties = {};
    }

    const defaultSelect = copyDataProps(typeDef, constructor, entityProps);

    typeDef.namespace = entityProps.namespace || featureNamespace;

    let type: EntityType | ComplexType;

    if (entityProps.isComplexType) {
        type = new ComplexType(typeDef as any);
    } else {
        typeDef.autoGeneratedKeyType =
            autoGenKeyType || AutoGeneratedKeyType.Identity;

        typeDef.defaultResourceName = `web/lists/getByTitle('${
            typeDef.shortName
        }')/items`;

        type = new EntityType(typeDef as any);

        const selectStatement = defaultSelect.join(',');

        type.custom = type.custom
            ? (type.custom['defaultSelect'] = selectStatement)
            : ({ defaultSelect: selectStatement } as any);

        console.log(type.custom['defaultSelect']);
    }

    store.addEntityType(type);

    if (!type.isComplexType) {
        store.setEntityTypeForResourceName(
            entityProps.shortName,
            type as EntityType
        );
    }

    const intializer = constructor.prototype.initializer;
    removedEntityScaffold(constructor);

    store.registerEntityTypeCtor(type.shortName, constructor, intializer);

    setValidations(type as EntityType, constructor.prototype.bzValidator);
};

export const BzEntity = (
    forAppNamed: MxmAppName | 'Global',
    entityProps: {
        shortName: keyof typeof SpListName | '__metadata';
        isComplexType?: boolean;
        namespace?: string;
    }
): ClassDecorator => {
    return constructor => {
        if (constructor.name !== 'SpEntityBase') {
            const modelCollection = MxmAssignedModels.has(forAppNamed)
                ? MxmAssignedModels.get(forAppNamed)
                : [];
            modelCollection.push(constructor);
            MxmAssignedModels.set(forAppNamed, modelCollection);
        }

        constructor.prototype._createTypeInStore = (
            store: MetadataStore,
            namespace: string,
            autoGenKeyType?: AutoGeneratedKeyType
        ) =>
            createTypeInStore(
                constructor,
                entityProps,
                namespace,
                store,
                autoGenKeyType
            );

        constructor.prototype._makeNameingDict = makeNamingDictionary;
    };
};