import {
    EntityManager,
    EntityType,
    EntityQuery,
    Predicate,
    FilterQueryOpSymbol,
    FetchStrategySymbol,
    FetchStrategy,
} from 'breeze-client';
import * as moment from 'moment';
import {
    bareEntity,
    SpEntityBase
} from '../models/_entity-base';
import { EmProviderService } from './em-provider.service';

export class BaseRepoService<T extends SpEntityBase> {
    protected entityManager: EntityManager;
    protected entityType: EntityType;
    protected resourceName: string;
    private cachedDate: moment.Moment;
    private cachedAll: boolean;
    private queryCache: {
        [index: string]: moment.Moment
    } = {};
    private inFlightCalls: {
        [index: string]: Promise<T[]> | Promise<T> | null
    } = {};

    protected defaultFetchStrategy: FetchStrategySymbol;

    constructor(entityTypeName: string, _entityService: EmProviderService) {
        this.entityType = _entityService.entityManager.metadataStore.getEntityType(entityTypeName) as EntityType;
        this.entityManager = _entityService.entityManager;
        this.resourceName = this.entityType.defaultResourceName;
        this.defaultFetchStrategy = FetchStrategy.FromServer;
    }

    all(): Promise<T[]> {
        const query = this.baseQuery();
        console.warn(`all assets request on ${this.entityType.shortName} and query ${query}`);
        if (this.isCachedBundle()) {
            return Promise.resolve(this.executeCacheQuery(query));
        }
        if (this.inFlightCalls.all) { return this.inFlightCalls.all as Promise<T[]>; }

        this.inFlightCalls.all = new Promise(async (resolve, reject) => {
            try {
                const data = await this.executeQuery(query);
                this.isCachedBundle(true);
                // tslint:disable-next-line:no-console
                console.info(`return this info ==>`);
                console.log(data);
                resolve(data);
            } catch (error) {
                return reject(this.queryFailed(error));
            } finally {
                this.inFlightCalls.all = null;
            }
        }) as any;
        return this.inFlightCalls.all as Promise<T[]>;
    }

    protected createBase(options?: bareEntity<T>): T {
        console.log(this.entityManager.exportEntities);
        return this.entityManager.createEntity(this.entityType.shortName, options) as any;
    }

    protected baseQuery(): EntityQuery {
        return EntityQuery.from(this.resourceName);
    }

    protected isCachedBundle(refreshedAll?: true): boolean {
        if (refreshedAll) {
            this.cachedAll = true;
            this.cachedDate = moment();
            this.defaultFetchStrategy = FetchStrategy.FromLocalCache;
            return false;
        }

        if (!this.cachedAll) { return false; }

        const now = moment();

        if (this.cachedAll && this.cachedDate.diff(now, 'm') > 5) {
            this.defaultFetchStrategy = FetchStrategy.FromServer;
            this.cachedAll = false;
            return false;
        }
        return true;
    }

    protected async executeQuery(query: EntityQuery, fetchStrat?: FetchStrategySymbol): Promise<T[]> {
        try {
            const queryType = query.using(fetchStrat || this.defaultFetchStrategy);
            const dataQueryResult = await this.entityManager.executeQuery(queryType);
            return Promise.resolve(dataQueryResult.results) as Promise<T[]>;
        } catch (error) {
            return this.queryFailed(error);
        }
    }

    protected executeCacheQuery(query: EntityQuery): T[] {
        const localCache = this.entityManager.executeQueryLocally(query) as T[];
        console.log(`from local cache ==> ${localCache}`);
        return localCache;
    }

    makePredicate(property: keyof T, filter: FilterQueryOpSymbol, condition: string): Predicate {
        return Predicate.create(property as any, filter, condition);
    }

    async withId(key: number): Promise<T> {
        try {
            const data = await this.entityManager.fetchEntityByKey(this.entityType.shortName, key, true);
            return Promise.resolve(data.entity) as Promise<T>;
        } catch (error) {
            return this.queryFailed(error);
        }
    }

    async where(predicate: Predicate, refreshFromServer = false): Promise<T[]> {
        console.log(`A where predicate was passed ==> ${predicate.toString()}`);
        const query = this.baseQuery().where(predicate);
        const lastQueryed = this.queryCache[predicate.toString()];
        const now = moment();
        try {
            if (refreshFromServer || (lastQueryed && lastQueryed.diff(now, 'm') >= 5)) {
                const data = await this.executeQuery(query, FetchStrategy.FromServer);
                this.queryCache[predicate.toString()] = moment();
                return Promise.resolve(data);
            }
            return Promise.resolve(this.executeCacheQuery(query));
        } catch (error) {
            this.queryFailed(error);
        }
    }

    whereInCache(predicate: Predicate): T[] {
        const query = this.baseQuery().where(predicate);
        return this.executeCacheQuery(query) as any[];
    }

    queryFailed(error): Promise<any> {
        const err = new Error(error);
        return Promise.reject(err);
    }

    async saveChanges(): Promise<void> {
        try {
            const results = await this.entityManager.saveChanges();
            console.log(results.entities.length);
        } catch (e) {
            console.error(`Saving changes failed ==> ${e}`);
        }
    }
}
