import { EntityManager, EntityType, EntityQuery, Predicate, FetchStrategy, FilterQueryOp, SaveResult } from 'breeze-client';
import * as moment from 'moment';
import { SpEntityBase } from '../models/_entity-base';
import { EmProviderService } from './em-provider.service';
import { bareEntity, EntityChildren } from '@ctypes/breeze-type-customization';
import { Observable, BehaviorSubject } from 'rxjs';

export class BaseRepoService<T extends SpEntityBase> {
    protected entityManager: EntityManager;
    protected entityType: EntityType;
    protected resourceName: string;
    private cachedDate: moment.Moment;
    private cachedAll: boolean;
    onSaveInProgressChange: BehaviorSubject<boolean>;
    spChoiceFieldCache: { key: string; values: string[] }[];
    private queryCache: {
        [index: string]: moment.Moment;
    } = {};
    private inFlightCalls: {
        [index: string]: Promise<T[]> | Promise<T> | null;
    } = {};

    protected defaultFetchStrategy: FetchStrategy;

    constructor(entityTypeName: string, _entityService: EmProviderService) {
        this.entityType = _entityService.entityManager.metadataStore.getEntityType(entityTypeName) as EntityType;
        this.entityManager = _entityService.entityManager;
        this.resourceName = this.entityType.defaultResourceName;
        this.defaultFetchStrategy = FetchStrategy.FromServer;
        this.spChoiceFieldCache = [];
        this.onSaveInProgressChange = new BehaviorSubject(false);
        console.log(`base created from ${entityTypeName}`);
    }

    all(): Promise<T[]> {
        const query = this.baseQuery();
        if (this.isCachedBundle()) {
            return Promise.resolve(this.executeCacheQuery(query));
        }
        if (this.inFlightCalls.all) {
            return this.inFlightCalls.all as Promise<T[]>;
        }

        this.inFlightCalls.all = new Promise(async (resolve, reject) => {
            try {
                const data = await this.executeQuery(query);
                this.isCachedBundle(true);
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
        return this.entityManager.createEntity(this.entityType.shortName, options) as any;
    }

    protected baseQuery(toBaseType = true): EntityQuery {
        const query = EntityQuery.from(this.resourceName);
        if (!toBaseType) {
            return query;
        }
        return query.toType(this.entityType);
    }

    protected isCachedBundle(refreshedData?: true): boolean {
        if (refreshedData) {
            this.cachedAll = true;
            this.cachedDate = moment();
            this.defaultFetchStrategy = FetchStrategy.FromLocalCache;
            return false;
        }

        if (!this.cachedAll) {
            return false;
        }

        const now = moment();

        if (this.cachedAll && this.cachedDate.diff(now, 'm') > 5) {
            this.defaultFetchStrategy = FetchStrategy.FromServer;
            this.cachedAll = false;
            return false;
        }
        return true;
    }

    protected async executeQuery(query: EntityQuery, fetchStrat?: FetchStrategy): Promise<T[]> {
        try {
            const queryType = query.using(fetchStrat || this.defaultFetchStrategy);
            const dataQueryResult = await this.entityManager.executeQuery(queryType);
            console.log(dataQueryResult);
            return Promise.resolve(dataQueryResult.results) as Promise<T[]>;
        } catch (error) {
            return Promise.reject(this.queryFailed(error));
        }
    }

    protected executeCacheQuery(query: EntityQuery): T[] {
        const localCache = this.entityManager.executeQueryLocally(query) as T[];
        console.log(localCache);
        return localCache;
    }

    makePredicate(property: keyof T, condition: string | number, filter = FilterQueryOp.Equals): Predicate {
        return Predicate.create(property as any, filter, condition);
    }

    async spChoiceValues(fieldName: string): Promise<string[]> {
        const retrievedChoiceFields = this.spChoiceFieldCache.filter(sp => sp.key === fieldName)[0];
        if (retrievedChoiceFields) {
            return Promise.resolve(retrievedChoiceFields.values);
        }
        const defaultResourceName = this.entityType.defaultResourceName;
        const fieldsResourceName = defaultResourceName.replace('/items', '/fields');
        const predicate = Predicate.create('EntityPropertyName', FilterQueryOp.Equals, fieldName);
        const query = EntityQuery.from(fieldsResourceName)
            .where(predicate)
            .noTracking();

        try {
            const response = await this.entityManager.executeQuery(query);
            const choices = response.results[0]['choices'] as string[];
            this.spChoiceFieldCache.push({ key: fieldName, values: choices });
            console.log(choices);
            return choices as any;
        } catch (e) {
            console.log(e);
            Promise.reject(this.queryFailed(e));
        }
    }

    async withId(key: number): Promise<T> {
        try {
            const data = await this.entityManager.fetchEntityByKey(this.entityType.shortName, key, true);
            return Promise.resolve(data.entity) as Promise<T>;
        } catch (error) {
            return Promise.reject(this.queryFailed(error));
        }
    }

    async where(queryName: string, predicate: Predicate, includeChildren?: EntityChildren<T>, refreshFromServer = false): Promise<T[]> {
        const query = this.baseQuery();

        if (includeChildren) {
            query.expand(includeChildren);
        }

        query.where(predicate);
        const lastQueryed = this.queryCache[queryName];
        const now = moment();
        try {
            if (refreshFromServer || (!lastQueryed || lastQueryed.diff(now, 'm') >= 5)) {
                const data = await this.executeQuery(query, FetchStrategy.FromServer);
                this.queryCache[queryName] = moment();
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

    queryFailed(error): Error {
        const err = new Error(error);
        return err;
    }

    async saveEntityChanges(entities: T[]): Promise<SaveResult> {
        try {
            this.onSaveInProgressChange.next(true);
            const results = await this.entityManager.saveChanges(entities);
            console.log(results);
            return results;
        } catch (error) {
            console.log(error);
            Promise.reject();
        } finally {
            this.onSaveInProgressChange.next(false);
        }
    }

    async saveChanges(): Promise<void> {
        try {
            this.onSaveInProgressChange.next(true);
            const results = await this.entityManager.saveChanges();
            console.log(results.entities.length);
        } catch (e) {
            console.error(`Saving changes failed ==> ${e}`);
            Promise.reject();
        } finally {
            this.onSaveInProgressChange.next(false);
        }
    }
}