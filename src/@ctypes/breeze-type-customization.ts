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

export type SelectedEntityKind<T extends SpListEntities['shortname']> = Extract<
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

export interface IEntityPropertyChange<
    TShortName extends SpListEntities['shortname'],
    TProperty extends GetEntityProp<TShortName>
> {
    entityAction: 'PropertyChange';
    propertyName: TProperty;
    entity: GetEntityType<TShortName>;
    newValue: Pick<
        GetEntityType<TShortName>,
        TProperty & keyof GetEntityType<TShortName>
    >;
    oldValue: Pick<
        GetEntityType<TShortName>,
        TProperty & keyof GetEntityType<TShortName>
    >;
    parent: GetEntityType<TShortName>;
    property: SpDataDef;
}
export interface IEntityStateChange<
    TShortName extends SpListEntities['shortname']
> {
    entityAction: 'EntityState';
}

export type EntityChangeArgType<
    TShortName extends SpListEntities['shortname'],
    TProperty extends GetEntityProp<TShortName>
> =
    | IEntityPropertyChange<TShortName, TProperty>
    | IEntityStateChange<TShortName>;

export type SelectedEntityChangeArgs<
    TShortName extends SpListEntities['shortname'],
    TProperty extends GetEntityProp<TShortName>,
    TEntityAction extends EntityChangeArgType<
        TShortName,
        TProperty
    >['entityAction']
> = Extract<
    EntityChangeArgType<TShortName, TProperty>,
    { entityAction: TEntityAction }
>;

export type GetEntityType<
    T extends SpListEntities['shortname']
> = SpListEntities extends (infer E)
    ? E extends SpListEntities
        ? E['shortname'] extends T
            ? E
            : never
        : never
    : never;

export type GetEntityProp<
    T extends SpListEntities['shortname']
> = SpListEntities extends (infer E)
    ? E extends SpListEntities
        ? E['shortname'] extends T
            ? keyof E
            : never
        : never
    : never;

export interface IEntityChangedEvent<
    TShortName extends SpListEntities['shortname'],
    TEntityAction extends EntityChangeArgType<
        TShortName,
        TProperty
    >['entityAction'],
    TProperty extends GetEntityProp<TShortName>
> {
    shortName: TShortName;
    entityAction: TEntityAction;
    entity: GetEntityType<TShortName>;
    args: SelectedEntityChangeArgs<TShortName, TProperty, TEntityAction>;
}
