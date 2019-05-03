import { SpNavDef } from '@ctypes/breeze-type-customization';
import { SpEntityDecorator } from './breeze-entity';

// rt = reflective type
export const BzNavProp = <T>(meta: {
    rt: string;
    fk?: keyof T;
}): PropertyDecorator => {
    return (target: SpEntityDecorator, key: string) => {
        target._bzNavProps = !Object.getOwnPropertyDescriptor(
            target,
            '_bzNavProps'
        )
            ? new Map()
            : target._bzNavProps;

        // const foreignTypeName = undefined;
        const navProp: Partial<SpNavDef<any>> = {
            entityTypeName: meta.rt
        };

        navProp.isScalar = !!meta.fk;

        navProp.associationName = navProp.isScalar
            ? `${meta.rt}_${target.constructor.name}`
            : `${target.constructor.name}_${meta.rt}`;

        if (navProp.isScalar) {
            navProp.foreignKeyNames = [meta.fk];
        }

        target._bzNavProps.set(key, navProp);
    };
};
