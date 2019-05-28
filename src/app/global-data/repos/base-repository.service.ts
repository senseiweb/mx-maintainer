import {
    EntityChildrenKind,
    RawEntity
} from '@ctypes/breeze-type-customization';
import {
    EntityManager,
    EntityQuery,
    EntityState,
    EntityType,
    FetchStrategy,
    FilterQueryOp,
    Predicate,
    SaveResult
} from 'breeze-client';
import { QueryResult } from 'breeze-client/src/entity-manager';
import * as _m from 'moment';
import { defer, from, BehaviorSubject, Observable, Subject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { SpEntityBase } from '../models';
// import { FilterEntityColNames } from '../models/_entity-base';
import { BaseEmProviderService } from './base-emprovider.service';

type RepoPredicateCache = { [index in string | 'all']: _m.Moment };

type SpChoiceCache<T> = { [index in keyof T]: string[] };
export abstract class BaseRepoService<TRepoFor extends SpEntityBase> {
    protected entityManager: EntityManager;
    protected entityType: EntityType;
    protected resourceName: string;
    private cached: Observable<TRepoFor[]>;
    private predicateCache: RepoPredicateCache = {};
    private reload: Subject<any>;
    onSaveInProgressChange: BehaviorSubject<boolean>;
    private spChoiceFieldCache: SpChoiceCache<TRepoFor> = {} as any;

    protected defaultFetchStrategy: FetchStrategy;

    constructor(
        entityTypeName: TRepoFor['shortname'],
        emProviderService: BaseEmProviderService
    ) {
        this.entityType = emProviderService.entityManager.metadataStore.getEntityType(
            entityTypeName
        ) as EntityType;

        this.entityManager = emProviderService.entityManager;
        this.onSaveInProgressChange = emProviderService.onSaveInProgressChange;
        this.resourceName = this.entityType.defaultResourceName;
        this.reload = new Subject();
        this.defaultFetchStrategy = FetchStrategy.FromServer;
    }

    get all(): Observable<TRepoFor[]> {
        const freshTimeLimit = 6;

        const cachedTime = this.predicateCache.all;

        const timeSinceLastServerQuery = cachedTime
            ? this.minutesSinceLastServerQuery(cachedTime)
            : freshTimeLimit + 1;

        if (timeSinceLastServerQuery < 5) {
            return from([
                this.entityManager.getEntities(this.entityType) as TRepoFor[]
            ]);
        }

        return this.allEntities();
    }

    forceReload(): void {
        this.reload.next();
        this.cached = null;
    }

    private allEntities(): Observable<TRepoFor[]> {
        return defer(() =>
            this.executeQuery(this.baseQuery(), undefined, 'all')
        );
    }

    protected baseQuery(toBaseType = true): EntityQuery {
        const query = EntityQuery.from(this.resourceName);
        if (!toBaseType) {
            return query;
        }
        return query.toType(this.entityType);
    }

    protected createBase(options?: RawEntity<TRepoFor>): TRepoFor {
        return this.entityManager.createEntity(
            this.entityType.shortName,
            options
        ) as any;
    }

    protected async executeQuery(
        query: EntityQuery,
        fetchStrategy: FetchStrategy = this.defaultFetchStrategy,
        queryName?: string
    ): Promise<TRepoFor[]> {
        const queryType = query.using(fetchStrategy);
        const dataQueryResult = await this.entityManager.executeQuery(
            queryType
        );
        this.predicateCache[queryName] = _m();
        return dataQueryResult.results as TRepoFor[];
    }

    protected executeCacheQuery(query: EntityQuery): TRepoFor[] {
        const localCache = this.entityManager.executeQueryLocally(
            query
        ) as TRepoFor[];
        console.log(localCache);
        return localCache;
    }

    makePredicate(
        property: keyof TRepoFor,
        condition: string | number,
        filter = FilterQueryOp.Equals
    ): Predicate {
        return Predicate.create(property as any, filter, condition);
    }

    private minutesSinceLastServerQuery(cachedTime: _m.Moment) {
        return _m
            .duration(cachedTime.diff(_m()))
            .abs()
            .asMinutes();
    }

    async spChoiceValues(fieldName: keyof TRepoFor): Promise<string[]> {
        const cached = this.spChoiceFieldCache[fieldName];
        if (cached) {
            return cached;
        }
        const defaultResourceName = this.entityType.defaultResourceName;

        const fieldsResourceName = defaultResourceName.replace(
            '/items',
            '/fields'
        );

        const dp = this.entityType.dataProperties.find(
            prop => prop.name === fieldName
        );

        const predicate = Predicate.create(
            'EntityPropertyName',
            FilterQueryOp.Equals,
            dp.nameOnServer
        );

        const query = EntityQuery.from(fieldsResourceName)
            .where(predicate)
            .noTracking();

        let response: QueryResult;

        try {
            response = await this.entityManager.executeQuery(query);
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }

        const choices = response.results[0]['Choices'].results as string[];

        this.spChoiceFieldCache[fieldName] = choices;
        return choices;
    }

    async withId(key: number): Promise<TRepoFor> {
        const result = await this.entityManager.fetchEntityByKey(
            this.entityType.shortName,
            key,
            true
        );
        return result.entity as TRepoFor;
    }

    async where(queryName: string, predicate: Predicate): Promise<TRepoFor[]> {
        const freshTimeLimit = 6;

        const cachedTime = this.predicateCache[queryName];

        const timeSinceLastServerQuery = cachedTime
            ? this.minutesSinceLastServerQuery(cachedTime)
            : freshTimeLimit + 1;

        const query = this.baseQuery().where(predicate);

        if (timeSinceLastServerQuery < 5) {
            return Promise.resolve(this.executeCacheQuery(query));
        }

        const results = await this.executeQuery(query, undefined, queryName);

        return results;
    }

    async whereWithChildren<TChild extends EntityChildrenKind<TRepoFor>>(
        predicate: Predicate,
        childRepoService: BaseRepoService<TChild>,
        childLookupKey: keyof TChild
    ): Promise<{ parent: TRepoFor[]; children: TChild[] }> {
        const queryName = `qForChild-${predicate.toString()}`;

        const parent = await this.where(queryName, predicate);

        const pIds = parent.map(et => et.id).sort();

        const childPreds: Predicate[] = [];

        pIds.forEach(id => {
            childPreds.push(childRepoService.makePredicate(childLookupKey, id));
        });

        const cPredicate = Predicate.create(childPreds);

        const cQueryName = `${queryName}-${pIds.join('|')}-${childLookupKey}`;

        const children = await childRepoService.where(cQueryName, cPredicate);

        return { parent, children };
    }

    whereInCache(predicate?: Predicate): TRepoFor[] {
        if (!predicate) {
            return this.entityManager.getEntities(this.entityType, [
                EntityState.Unchanged,
                EntityState.Added,
                EntityState.Modified
            ]) as TRepoFor[];
        }
        const query = this.baseQuery().where(predicate);
        return this.executeCacheQuery(query) as TRepoFor[];
    }

    async saveEntityChanges(): Promise<SaveResult | undefined> {
        const entities = this.entityManager.getChanges(this.entityType);
        if (!entities.length) {
            return undefined;
        }
        this.onSaveInProgressChange.next(true);

        const results = await this.entityManager.saveChanges(entities);
        this.onSaveInProgressChange.next(false);
        return results;
    }
}
