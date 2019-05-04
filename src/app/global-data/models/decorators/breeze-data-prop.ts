import { enumerable } from '@ctypes/app-config';
import { SpDataDef } from '@ctypes/breeze-type-customization';
import { DataType } from 'breeze-client';
import { SpEntityBase } from '../_entity-base';
import { SpEntityDecorator } from './breeze-entity';

export const BzDataProp = (props?: Partial<SpDataDef>): PropertyDecorator => {
    return (target: SpEntityDecorator, key: string) => {
        if (
            target &&
            target.constructor &&
            target.constructor.name === 'SpEntityBase'
        ) {
            if (!Object.getOwnPropertyDescriptor(target, '_bzDataProps')) {
                // Define properties on the base case so we can re-used them in future classes
                // but remove enumerablility so breeze doesn't add them as unmapped properties
                Object.defineProperties(target, {
                    _bzDataProps: {
                        enumerable: false,
                        writable: true,
                        value: new Map()
                    },
                    _bzDefaultSelect: {
                        value: [],
                        writable: true,
                        enumerable: false
                    }
                });
            }
        } else {
            target._bzDataProps = !Object.getOwnPropertyDescriptor(
                target,
                '_bzDataProps'
            )
                ? new Map()
                : target._bzDataProps;

            target._bzDefaultSelect = !Object.getOwnPropertyDescriptor(
                target,
                '_bzDefaultSelect'
            )
                ? []
                : target._bzDefaultSelect;
        }

        props = props || {};

        if (key !== '__metadata') {
            target._bzDefaultSelect.push(key);
        }

        if (props.spInternalName) {
            target._bzNamingDict = target._bzNamingDict || new Map();

            const nameDictKey = target.constructor.name;

            if (target._bzNamingDict.has(nameDictKey)) {
                const dictProp = target._bzNamingDict.get(nameDictKey);
                dictProp[key] = props.spInternalName;
            } else {
                target._bzNamingDict.set(nameDictKey, {
                    [key]: props.spInternalName
                });
            }
            delete props.spInternalName;
        }

        // @ts-ignore
        const propType = Reflect.getMetadata('design:type', target, key).name;
        // const propType = undefined;

        if (!props.dataType && !props.complexTypeName) {
            switch (propType.toLowerCase()) {
                case 'string':
                    props.dataType = DataType.String;
                    break;
                case 'number':
                    props.dataType = DataType.Int16;
                    break;
                case 'boolean':
                    props.dataType = DataType.Boolean;
                    break;
                case 'date':
                    props.dataType = DataType.DateTime;
                    break;
                default:
                    throw new Error(
                        `Datatype ${propType} unknown or missing on Entity ${
                            target.constructor.name
                        }`
                    );
            }
        }
        target._bzDataProps.set(key, props);
    };
};
