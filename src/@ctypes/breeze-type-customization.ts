import { SpEntityBase } from 'app/global-data';
import {
    DataProperty,
    DataType,
    Entity,
    EntityType,
    NavigationProperty
} from 'breeze-client';
import { SpListEntities } from './app-config';

// tslint:disable: interface-name
export type Instantiable<T> = new (...args: any[]) => T;

// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html
export type Unarray<T> = T extends Array<infer U> ? U : T;

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// https://github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript#keyof-and-lookup-types
export type EntityChildrenKind<T extends SpEntityBase> = Extract<
    { [P in keyof T]: T[P] extends Array<infer U> ? U : never }[keyof T],
    SpEntityBase
>;

export type ForeignEntityKind<T extends SpEntityBase> = {
    [P in keyof T]: T[P] extends SpEntityBase ? T : never
}[keyof T];

export type EntityChildShortName<T extends SpEntityBase> = EntityChildrenKind<
    T
>['shortname'];

export type ForeignEntityShortName<T extends SpEntityBase> = ForeignEntityKind<
    T
>['shortname'];

export type SelectedEntityKind<T extends string> = Extract<
    SpListEntities,
    { shortname: T }
>;

export type ExtreBareEntityProps =
    | 'entityType'
    | 'entityAspect'
    | 'entityDefinition'
    | '$typeName';

export type RawEntity<T> = Partial<
    Pick<T, Exclude<keyof T, keyof Entity | ExtreBareEntityProps>>
>;

export type CustomEtDef = Omit<
    EntityType,
    'dataProperties' | 'navigationProperties'
>;

export type dtDef = Omit<DataProperty, 'dataType'>;

export type navDef = Omit<NavigationProperty, 'foreignKeyNames'>;

export interface SpDataDef extends dtDef {
    dataType: DataType;
    // hasMany: boolean;
    // spInternalName: string;
}
export interface IDialogResult<T> {
    wasConceled?: boolean;
    confirmDeletion?: boolean;
    confirmChange?: boolean;
    confirmAdd?: boolean;
    value?: T;
}

// tslint:disable-next-line: interface-name
export interface SpNavDef<T> extends navDef {
    foreignKeyNames?: Array<keyof RawEntity<T>>;
}
export type DataMembers<T> = {
    [key in keyof RawEntity<T>]: Partial<SpDataDef>
};

export type ClientNameDict<T> = { [bkey in keyof RawEntity<T>]: string };
export type NavMembers<T> = {
    [key in keyof RawEntity<T>]: Partial<SpNavDef<T>>
};

export interface SpEntityDef<T> extends Partial<CustomEtDef> {
    dataProperties?: DataMembers<T>;
    isComplexType?: boolean;
    navigationProperties?: NavMembers<T>;
}
