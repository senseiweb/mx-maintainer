import {
    DataProperty,
    DataType,
    Entity,
    EntityType,
    NavigationProperty
} from 'breeze-client';

// tslint:disable: interface-name

export type Instantiable<T> = new (...args: any[]) => T;

export type FilterType<T, U> = { [key in keyof T]: T extends U ? key : never };

// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html
export type FilterEntityCollection<T> = Unarray<
    T[FilterEntityPropCollection<T>]
>;

export type Unarray<T> = T extends Array<infer U> ? U : T;

export type FilterEntityPropCollection<T> = keyof Partial<
    Pick<T, { [K in keyof T]: T[K] extends Entity[] ? K : never }[keyof T]>
>;

export type EntityChildren<T> = Extract<FilterEntityPropCollection<T>, string>;

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type ExtreBareEntityProps =
    | 'entityType'
    | 'entityAspect'
    | 'entityDefinition'
    | '$typeName';

export type bareEntity<T> = Partial<
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
    hasMany: boolean;
    spInternalName: string;
}
export interface SpDataDef extends dtDef {
    dataType: DataType;
    hasMany: boolean;
    spInternalName: string;
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
    foreignKeyNames?: Array<keyof bareEntity<T>>;
}
export type DataMembers<T> = {
    [key in keyof bareEntity<T>]: Partial<SpDataDef>
};

export type ClientNameDict<T> = { [bkey in keyof bareEntity<T>]: string };
export type NavMembers<T> = {
    [key in keyof bareEntity<T>]: Partial<SpNavDef<T>>
};

export interface SpEntityDef<T> extends Partial<CustomEtDef> {
    dataProperties?: DataMembers<T>;
    isComplexType?: boolean;
    navigationProperties?: NavMembers<T>;
}
