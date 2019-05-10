import { DiscriminateUnion, SpListEntities } from '@ctypes/app-config';
import { bareEntity } from '@ctypes/breeze-type-customization';
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
import { defer, BehaviorSubject, Observable, Subject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { FilterEntityColNames, SpEntityBase } from '../models/_entity-base';
import { BaseEmProviderService } from './base-emprovider.service';

interface IRepoPredicateCache {
    [index: string]: _m.Moment;
}

type SpChoiceCache<T> = { [index in keyof T]: string[] };

export class BaseRepoService<
    TEnityName extends SpListEntities['shortname'],
    TEntity extends DiscriminateUnion<TEnityName>
> {
    protected entityManager: EntityManager;
    protected entityType: EntityType;
    protected resourceName: string;
    private cached: Observable<TEntity[]>;
    private predicateCache: IRepoPredicateCache = {};
    private reload: Subject<any>;
    onSaveInProgressChange: BehaviorSubject<boolean>;
    private spChoiceFieldCache: SpChoiceCache<TEntity> = {} as any;

    protected defaultFetchStrategy: FetchStrategy;

    constructor(
        entityTypeName: TEnityName,
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

    get all(): Observable<TEntity[]> {
        const freshTimeLimit = 6;

        const cachedTime = this.predicateCache['all'];

        const timeSinceLastServerQuery = cachedTime
            ? _m.duration(cachedTime.diff(_m(), 'minutes'))
            : freshTimeLimit + 1;

        if (timeSinceLastServerQuery < 5 && this.cached) {
            return this.cached;
        }

        this.cached = this.allEntities().pipe(shareReplay(1));
        return this.cached;
    }

    forceReload(): void {
        this.reload.next();
        this.cached = null;
    }

    private allEntities(): Observable<TEntity[]> {
        return defer(() => this.executeQuery(this.baseQuery()));
    }

    protected createBase(options?: bareEntity<TEntity>): TEntity {
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
    ): Promise<TEntity[]> {
        const queryType = query.using(fetchStrat || this.defaultFetchStrategy);
        const dataQueryResult = await this.entityManager.executeQuery(
            queryType
        );
        console.log(dataQueryResult);
        return Promise.resolve(dataQueryResult.results) as Promise<TEntity[]>;
    }

    protected executeCacheQuery(query: EntityQuery): TEntity[] {
        const localCache = this.entityManager.executeQueryLocally(
            query
        ) as TEntity[];
        console.log(localCache);
        return localCache;
    }

    makePredicate(
        property: keyof TEntity,
        condition: string | number,
        filter = FilterQueryOp.Equals
    ): Predicate {
        return Predicate.create(property as any, filter, condition);
    }

    async spChoiceValues(fieldName: keyof TEntity): Promise<string[]> {
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

    async withId(key: number): Promise<TEntity> {
        const result = await this.entityManager.fetchEntityByKey(
            this.entityType.shortName,
            key,
            true
        );
        return result.entity as TEntity;
    }

    where(queryName: string, predicate: Predicate): Promise<TEntity[]> {
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

    async whereWithChildren<U extends FilterEntityColNames<TEntity>>(
        queryName: string,
        predicate: Predicate,
        childrenRepo: BaseRepoService<U, DiscriminateUnion<U>>,
        childLookupKey: keyof DiscriminateUnion<U>
    ): Promise<{ parent: TEntity[]; children: Array<DiscriminateUnion<U>> }> {
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

    whereInCache(predicate?: Predicate): TEntity[] {
        if (!predicate) {
            return this.entityManager.getEntities(this.entityType, [
                EntityState.Unchanged,
                EntityState.Added,
                EntityState.Modified
            ]) as TEntity[];
        }
        const query = this.baseQuery().where(predicate);
        return this.executeCacheQuery(query) as TEntity[];
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
