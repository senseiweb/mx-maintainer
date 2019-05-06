import { BzScaffodPropType, BzPropType, ExtractConfigParameters,  IBzDataConfig, IBzNavConfig } from './breeze-entity';
import { SpEntityBase } from '../_entity-base';
import { DataType } from 'breeze-client';
import { SpMetadata } from '../sp-metadata';

// // rt = reflective type
// export const BzNavProp = <T>(meta: {
//     // Reflective Type this property represent i.e. teams represent a 
//     // rt of Team
//     rt: SpListName;
//     fk?: keyof T;
// }): PropertyDecorator => {
//     return (target: SpEntityDecorator, key: string) => {
//         target._bzNavProps = !Object.getOwnPropertyDescriptor(
//             target,
//             '_bzNavProps'
//         )
//             ? new Map()
//             : target._bzNavProps;

//         // const foreignTypeName = undefined;
//         const navProp: Partial<SpNavDef<any>> = {
//             entityTypeName: meta.rt
//         };

//         navProp.isScalar = !!meta.fk;

//         navProp.associationName = navProp.isScalar
//             ? `${meta.rt}_${target.constructor.name}`
//             : `${target.constructor.name}_${meta.rt}`;

//         if (navProp.isScalar) {
//             navProp.foreignKeyNames = [meta.fk];
//         }

//         target._bzNavProps.set(key, navProp);
//     };
// };

export function BzEntityInitializer(proto, key, descritor) {
    proto.bzEntityInit = proto[key];
}

export interface IBzPropCollection {
    props: BzScaffodPropType[];
    propNameDictionary: Map<string, { [index: string]: string }>;
    translateDataType: (_arg: IBzDataConfig) => void;
}

export function BzProp<TPropType extends BzPropType>(
        type: TPropType,
        args: ExtractConfigParameters<BzScaffodPropType, TPropType>
    ) {
    return <TClass extends SpEntityBase|SpMetadata>(proto: Pick<TClass, keyof TClass>, key: string): void => {
        class BzPropCollection implements IBzPropCollection {
            props: BzScaffodPropType[] = [];
            propNameDictionary = new Map();
            
            translateDataType = (_arg: IBzDataConfig) => {

                // @ts-ignore
                const propType = Reflect.getMetadata('design:type', proto, key).name;
                // const propType = undefined;

                if (!_arg.dataCfg.dataType && !_arg.dataCfg.complexTypeName) {
                    switch (propType.toLowerCase()) {
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
                                `Datatype ${propType} unknown or missing on Entity ${
                                proto.constructor.name
                                }`
                            );
                    }
                }
            }
        }
        if (!Object.getOwnPropertyDescriptor(
            proto,
            'propCollection'
        )) {
            Object.defineProperty(proto, 'propCollection', {
                enumerable: false,
                value: new BzPropCollection(),
                writable: true,
                configurable: true
            });
        }
                                  
        const propCollection = (proto as any).propCollection;
        if (type === 'data') {
            const arg: IBzDataConfig = args as any;
            arg.dataCfg = arg.dataCfg || {};
            arg.dataCfg.name = key;

            if (arg.spInternalName) {
                
                const nameDictKey = proto.constructor.name;
                
                if (propCollection.propNameDictionary.has(nameDictKey)) {
                    const dictProp = propCollection.propNameDictionary.get(nameDictKey);
                    dictProp[key] = arg.spInternalName;
                } else {
                    propCollection.propNameDictionary.set(nameDictKey, {
                        [key]: arg.spInternalName
                    });
                }
            }

            propCollection.translateDataType(arg);
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
                arg.navCfg.foreignKeyNames = arg.navCfg.foreignKeyNames || [key + 'Id'];
            }
        }
        (args as any).propType = type;
        propCollection.props.push(args as any);
        
    };
}

// export declare function BzProp<T extends BzScaffodPropType<T>>(
//     type: T,
//     args: 
// ): void;