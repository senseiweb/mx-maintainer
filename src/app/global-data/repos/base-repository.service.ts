import { bareEntity, EntityChildren } from '@ctypes/breeze-type-customization';
import {
    EntityKey,
    EntityManager,
    EntityQuery,
    EntityType,
    FetchStrategy,
    FilterQueryOp,
    Predicate,
    SaveResult
} from 'breeze-client';
import * as _m from 'moment';
import { from, timer, BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, shareReplay, switchMap, take, takeUntil } from 'rxjs/operators';
import { SpEntityBase } from '../models/_entity-base';
import { BaseEmProviderService } from './base-emprovider.service';

interface IRepoPredicateCache<T> {
    [index: string]: _m.Moment;
}

type SpChoiceCache<T> = { [index in keyof T]: string[] };

export class BaseRepoService<T extends SpEntityBase> {
    protected entityManager: EntityManager;
    protected entityType: EntityType;
    protected resourceName: string;
    private cached: Observable<T[]>;
    private predicateCache: IRepoPredicateCache<T> = {};
    private reload: Subject<any>;
    onSaveInProgressChange: BehaviorSubject<boolean>;
    private spChoiceFieldCache: SpChoiceCache<T> = {} as any;
    // private queryCache: {
    //     [index: string]: _m.Moment;
    // } = {};
    // private inFlightCalls: {
    //     [index: string]: Promise<T[]> | Promise<T> | null;
    // } = {};

    protected defaultFetchStrategy: FetchStrategy;

    constructor(
        entityTypeName: string,
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
        console.log(`base created from ${entityTypeName}`);
    }

    get all(): Observable<T[]> {
        if (this.cached) {
            return this.cached;
        }
        const refreshTimer = timer(0, 300000);
        this.cached = refreshTimer.pipe(
            switchMap(_ => this.allEntities()),
            takeUntil(this.reload),
            _ => this.cached.pipe(shareReplay(1))
        );
        return this.cached;
    }

    forceReload(): void {
        this.reload.next();
        this.cached = null;
    }

    private allEntities(): Observable<T[]> {
        return from(this.executeQuery(this.baseQuery()));
    }

    protected createBase(options?: bareEntity<T>): T {
        return this.entityManager.createEntity(
            this.entityType.shortName,
            options
        ) as any;
    }

    protected baseQuery(toBaseType = true): EntityQuery {
        const query = EntityQuery.from(this.resourceName);
        if (!toBaseType) {
            return query;
        }
        return query.toType(this.entityType);
    }

    protected async executeQuery(
        query: EntityQuery,
        fetchStrat?: FetchStrategy
    ): Promise<T[]> {
        const queryType = query.using(fetchStrat || this.defaultFetchStrategy);
        const dataQueryResult = await this.entityManager.executeQuery(
            queryType
        );
        console.log(dataQueryResult);
        return Promise.resolve(dataQueryResult.results) as Promise<T[]>;
    }

    protected executeCacheQuery(query: EntityQuery): T[] {
        const localCache = this.entityManager.executeQueryLocally(query) as T[];
        console.log(localCache);
        return localCache;
    }

    makePredicate(
        property: keyof T,
        condition: string | number,
        filter = FilterQueryOp.Equals
    ): Predicate {
        return Predicate.create(property as any, filter, condition);
    }

    async spChoiceValues(fieldName: keyof T): Promise<string[]> {
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

        const response = await this.entityManager.executeQuery(query);
        const choices = response.results[0]['Choices'].results as string[];

        this.spChoiceFieldCache[fieldName] = choices;
        return choices;
    }

    async withId(key: number): Promise<T> {
        const result = await this.entityManager.fetchEntityByKey(
            this.entityType.shortName,
            key,
            true
        );
        return result.entity as T;
    }

    where(queryName: string, predicate: Predicate): Promise<T[]> {
        const freshTimeLimit = 6;
        const cachedTime = this.predicateCache[queryName];
        const timeSinceLastServerQuery = cachedTime
            ? _m.duration(cachedTime.diff(_m(), 'minutes'))
            : freshTimeLimit + 1;
        const query = this.baseQuery().where(predicate);
        if (timeSinceLastServerQuery < 5) {
            return Promise.resolve(this.executeCacheQuery(query));
        }
        return this.executeQuery(query);
    }

    async whereWithChildren<U extends SpEntityBase>(
        queryName: string,
        predicate: Predicate,
        childrenRepo: BaseRepoService<U>,
        childLookupKey: keyof U
    ): Promise<{ parent: T[]; children: U[] }> {
        const parent = await this.where(queryName, predicate);
        const pIds = parent.map(et => et.id).sort();

        const childPreds: Predicate[] = [];

        pIds.forEach(id => {
            childPreds.push(childrenRepo.makePredicate(childLookupKey, id));
        });

        const cPredicate = Predicate.create(childPreds);

        const cQueryName = `${queryName}-${pIds.toString()}-${childLookupKey}`;

        const children = await childrenRepo.where(cQueryName, cPredicate);

        return { parent, children };
    }

    // async where(
    //     queryName: string,
    //     predicate: Predicate,
    //     includeChildren?: EntityChildren<T>,
    // ): Promise<T[]> {
    //     const query = this.baseQuery();

    //     if (includeChildren) {
    //         query.expand(includeChildren);
    //     }

    //     query.where(predicate);
    //     const lastQueryed = this.queryCache[queryName];
    //     const now = moment();
    //     try {
    //         if (
    //             refreshFromServer ||
    //             (!lastQueryed || lastQueryed.diff(now, 'm') >= 5)
    //         ) {
    //             const data = await this.executeQuery(
    //                 query,
    //                 FetchStrategy.FromServer
    //             );
    //             this.queryCache[queryName] = moment();
    //             return Promise.resolve(data);
    //         }
    //         return Promise.resolve(this.executeCacheQuery(query));
    //     } catch (error) {
    //         this.queryFailed(error);
    //     }
    // }

    whereInCache(predicate: Predicate): T[] {
        const query = this.baseQuery().where(predicate);
        return this.executeCacheQuery(query) as T[];
    }

    // queryFailed(error): Promise<Error> {
    //     const err = new Error(error);
    //     return Promise.reject(err);
    // }

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
