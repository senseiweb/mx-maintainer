import { Injectable } from '@angular/core';
import * as breeze from 'breeze-client';
import * as moment from 'moment';
import { EmProviderService } from './em-provider.service';
import {
  MetadataBase,
  bareEntity,
  SpEntityBase
} from '../models/_entity-base';


@Injectable({
  providedIn: 'root'
})
export class BaseRepoService<T extends SpEntityBase> {
  protected entityManager: breeze.EntityManager;
  protected resourceName: string;
  protected entityTypeName: string;
  private cachedDate: moment.Moment;
  private cachedAll: boolean;
  private queryCache: {
    [index: string]: moment.Moment
  } = {};

  protected defaultFetchStrategy: breeze.FetchStrategySymbol;

  constructor(_entityData: MetadataBase<any>, _entityService: EmProviderService) {
    this.entityManager = _entityService.entityManager;
    this.resourceName = _entityData.entityDefinition.defaultResourceName;
    this.entityTypeName = _entityData.entityDefinition.shortName;
    this.defaultFetchStrategy = breeze.FetchStrategy.FromServer;
  }

  async all(): Promise<Array<T>> {
    const query = this.baseQuery();
    // tslint:disable-next-line:no-console
    console.info(`all assets request on ${this.entityTypeName} and query ${query}`);
    if (this.isCachedBundle()) {
      return Promise.resolve(this.executeCacheQuery(query));
    }
    try {
      const data = await this.executeQuery(query);
      this.isCachedBundle(true);
      // tslint:disable-next-line:no-console
      console.info(`return this info ==>`);
      console.log(data);
      return Promise.resolve(data) as Promise<Array<T>>;
    } catch (error) {
      return this.queryFailed(error);
    }
  }

  protected createBase(options?: bareEntity<T>): T {
    return this.entityManager.createEntity(this.entityTypeName, options) as any;
  }

  protected baseQuery(): breeze.EntityQuery {
    return breeze.EntityQuery.from(this.resourceName);
  }

  protected isCachedBundle(refreshedAll?: true): boolean {
    if (refreshedAll) {
      this.cachedAll = true;
      this.cachedDate = moment();
      this.defaultFetchStrategy = breeze.FetchStrategy.FromLocalCache;
      return false;
    }

    if (!this.cachedAll) { return false; }

    const now = moment();

    if (this.cachedAll && this.cachedDate.diff(now, 'm') > 5) {
      this.defaultFetchStrategy = breeze.FetchStrategy.FromServer;
      this.cachedAll = false;
      return false;
    }
    return true;
  }

  protected async executeQuery(query: breeze.EntityQuery, fetchStrat?: breeze.FetchStrategySymbol): Promise<Array<T>> {
    try {
      const queryType = query.using(fetchStrat || this.defaultFetchStrategy);
      const dataQueryResult = await this.entityManager.executeQuery(queryType);
      return Promise.resolve(dataQueryResult.results) as Promise<Array<T>>;
    } catch (error) {
      return this.queryFailed(error);
    }
  }

  protected executeCacheQuery(query: breeze.EntityQuery): Array<T> {
    const localCache = this.entityManager.executeQueryLocally(query) as Array<T>;
    console.log(`from local cache ==> ${localCache}`);
    return localCache;
  }

  makePredicate(property: keyof T, filter: breeze.FilterQueryOpSymbol, condition: string): breeze.Predicate {
    return breeze.Predicate.create(property as any, filter, condition);
  }

  async withId(key: number): Promise<T> {
    try {
      const data = await this.entityManager.fetchEntityByKey(this.entityTypeName, key, true);
      return Promise.resolve(data.entity) as Promise<T>;
    } catch (error) {
      return this.queryFailed(error);
    }
  }

  async where(predicate: breeze.Predicate, refreshFromServer = false): Promise<Array<T>> {
    // tslint:disable-next-line:no-console
    console.info(`A where predicate was passed ==> ${predicate.toString()}`);
    const query = this.baseQuery().where(predicate);
    const lastQueryed = this.queryCache[predicate.toString()];
    const now = moment();
    try {
      if (refreshFromServer || (lastQueryed && lastQueryed.diff(now, 'm') >= 5)) {
        const data = await this.executeQuery(query, breeze.FetchStrategy.FromServer);
        this.queryCache[predicate.toString()] = moment();
        return Promise.resolve(data);
      }
      return Promise.resolve(this.executeCacheQuery(query));
    } catch (error) {
      this.queryFailed(error);
    }
  }

  whereInCache(predicate: breeze.Predicate): Array<T> {
    const query = this.baseQuery().where(predicate);
    return <Array<any>>this.executeCacheQuery(query);
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
