import { AbstractControl } from '@angular/forms';
import { DataType, Validator } from 'breeze-client';
import { SpEntityBase } from '../_entity-base';
import { SpMetadata } from '../sp-metadata';
import {
    BzPropType,
    BzScaffodPropType,
    ExtractConfigParameters,
    IBreezeScaffoldProto,
    IBzDataConfig,
    IBzNavConfig
} from './breeze-entity';

export interface IBzCustomValidator<T> {
    validatorScope: 'property' | 'entity';
    targetedProperty: Extract<keyof T, string>;
    reqProps?: Array<Extract<keyof T, string>>;
    validator?: () => Validator;
}

/**
 * A part of the scaffold decorators to setup and
 * register classes as Breeze entities. When decorated
 * on class members, an instance of this class will be created on the
 * classes prototype as "propCollection" [[IBreezeScaffoldProto]].
 */
export class BzPropCollection {
    props: BzScaffodPropType[] = [];
    propNameDictionary: Map<string, { [index: string]: string }> = new Map();
    customBzValidators: {
        propVal: Map<string, Array<() => Validator>>;
        entityVal: Array<IBzCustomValidator<any>>;
    } = {
        propVal: new Map(),
        entityVal: []
    };
}

/**
 * Wraps a typical Breeze validator into a Form Control validator.
 * The standard Breeze validator is passed during the
 *  [[NewTypeForStore.step7_CreateFormValidation]] and the resulting
 * Form validation function is stored in each individual data property
 * on the Breeze entity type.
 */
export const bzPropValidatorWrapper = (validator: Validator) => {
    return (c: AbstractControl): { [error: string]: any } => {
        const result = validator.validate(c.value, validator.context);
        return result ? { [c.value]: result.errorMessage } : null;
    };
};

/**
 * Wraps a typical Breeze validator into a Form Control validator.
 * The standard Breeze validator is passed during the
 * [[NewTypeForStore.step7_CreateFormValidation]] and the resulting
 * function will be called during the formgroup generation
 * so that the represented entity value and properities needed for validation
 * can be passed into the Form Validation function stored in each on the
 * Breeze entity type.
 */
export const bzEntityValidatorWrapper = (
    validator: Validator,
    neededProps: string[]
) => {
    return (entity: SpEntityBase) => {
        return (c: AbstractControl): { [error: string]: any } => {
            validator.context = validator.context || {};

            neededProps.forEach(
                np => (validator.context[np] = c.get(np).value)
            );

            const result = validator.validate(entity, validator.context);

            return result
                ? { [entity.entityType.shortName]: result.errorMessage }
                : null;
        };
    };
};

/**
 * Decorator factory that takes are validatorc config param and returns a
 * propert decorator.
 * @param validatorConfig: expects the configuartion object from the decorated
 * validator located on individual entities. See [[IBzCustomValidator]]
 * @returns MethodDecorator
 */
export const BzCustomValidator = <T>(
    validatorConfig: IBzCustomValidator<T>
) => {
    return (
        proto: IBreezeScaffoldProto | SpEntityBase,
        key: string,
        propDescript: PropertyDescriptor
    ) => {
        if (!Object.getOwnPropertyDescriptor(proto, 'propCollection')) {
            Object.defineProperty(proto, 'propCollection', {
                enumerable: false,
                value: new BzPropCollection(),
                writable: true,
                configurable: true
            });
        }

        validatorConfig.validator = propDescript.value;

        /** Register validator with Breeze */
        Validator.registerFactory(validatorConfig.validator as any, key);

        /**
         * Push all "property type" validators into the Map array for the
         * the property, if this is the first validator for the property
         * create a new entry.
         * --else--
         * assumed that if not a property custom validator, it must be
         * an entity level validator, so push the validator into the
         * entity level array of validators.
         */
        if (validatorConfig.validatorScope === 'property') {
            const validatorListForProp = (proto as IBreezeScaffoldProto).propCollection.customBzValidators.propVal.get(
                validatorConfig.targetedProperty
            );

            if (validatorListForProp) {
                validatorListForProp.push(validatorConfig.validator);
            } else {
                (proto as IBreezeScaffoldProto).propCollection.customBzValidators.propVal.set(
                    validatorConfig.targetedProperty,
                    [validatorConfig.validator]
                );
            }
        } else {
            (proto as IBreezeScaffoldProto).propCollection.customBzValidators.entityVal.push(
                validatorConfig
            );
        }
    };
};

/**
 * Method Decorator for capturing Breeze entity initializer and assigned it to the
 * class prototype.
 */
export function BzEntityInitializer(proto, key, descritor) {
    proto.bzEntityInit = descritor;
}

/**
 * Helper method that uses a property's type to translate into a standard Breeze
 * Datatype. Any unknown types will throw an error.
 */
const translateDataType = (_arg: IBzDataConfig, keyPropType: string) => {
    if (!_arg.dataCfg.dataType && !_arg.dataCfg.complexTypeName) {
        switch (keyPropType.toLowerCase()) {
            case 'string':
                _arg.dataCfg.dataType = DataType.String;
                break;
            case 'number':
                _arg.dataCfg.dataType = DataType.Int16;
                break;
            case 'boolean':
                _arg.dataCfg.dataType = DataType.Boolean;
                break;
            case 'date':
                _arg.dataCfg.dataType = DataType.DateTime;
                break;
            default:
                throw new Error(
                    `Datatype ${keyPropType} unknown or missing on Entity`
                );
        }
    }
};

/**
 * A property decorator factory takes in the string value of the property type TPropType i.e.
 * "data" or "nav", and filters the expected args ExtractConfigParameters minus the
 * the TPropType property.
 */
export function BzProp<TPropType extends BzPropType>(
    type: TPropType,
    args: ExtractConfigParameters<BzScaffodPropType, TPropType>
) {
    return <TClass extends SpEntityBase | SpMetadata>(
        // proto: Pick<TClass, keyof TClass>,
        proto: any,
        key: string
    ): void => {
        /**
         * Check if the class has the propCollection attribute already, if not add it to
         * the class as non enumerable so that Breeze does not add it as unmapped property
         * during registering of the ctor.
         * Object.getOwnPropertyDescriptor When checking ensure that we are looking at the
         * current classes property and not the base class prototype
         */
        if (!Object.getOwnPropertyDescriptor(proto, 'propCollection')) {
            Object.defineProperty(proto, 'propCollection', {
                enumerable: false,
                value: new BzPropCollection(),
                writable: true,
                configurable: true
            });
        }

        const propCollection = (proto as any).propCollection;

        /** If a property is data property setup up the configuration appropriately  */
        if (type === 'data') {
            const arg: IBzDataConfig = args as any;
            arg.dataCfg = arg.dataCfg || {};
            arg.dataCfg.name = key;

            if (arg.spInternalName) {
                const nameDictKey = proto.constructor.name;

                if (propCollection.propNameDictionary.has(nameDictKey)) {
                    const dictProp = propCollection.propNameDictionary.get(
                        nameDictKey
                    );
                    dictProp[key] = arg.spInternalName;
                } else {
                    propCollection.propNameDictionary.set(nameDictKey, {
                        [key]: arg.spInternalName
                    });
                }
            }

            // @ts-ignore
            translateDataType(
                arg,
                // @ts-ignore
                Reflect.getMetadata('design:type', proto, key).name
            );
        }

        if (type === 'nav') {
            const arg: IBzNavConfig = args as any;
            arg.navCfg = arg.navCfg || {};

            arg.navCfg.isScalar = !!(arg.navCfg && arg.navCfg.isScalar);
            arg.navCfg.name = key;
            arg.navCfg.entityTypeName = arg.relativeEntity;
            arg.navCfg.associationName = arg.navCfg.isScalar
                ? `${arg.relativeEntity}_${proto.constructor.name}`
                : `${proto.constructor.name}_${arg.relativeEntity}`;

            if (arg.navCfg.isScalar) {
                arg.navCfg.foreignKeyNames = arg.navCfg.foreignKeyNames || [
                    key + 'Id'
                ];
            }
        }
        (args as any).propType = type;
        propCollection.props.push(args as any);
    };
}
