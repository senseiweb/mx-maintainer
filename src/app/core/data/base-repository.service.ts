import { Injectable } from '@angular/core';
import * as breeze from 'breeze-client';
import { EmProviderService } from './em-provider';
import { EntityBase, bareEntity } from '../entities/_entity-base';

@Injectable({
  providedIn: 'root'
})
export class BaseRepoService<T extends EntityBase> {
  protected entityManager: breeze.EntityManager;
  protected resourceName: string;
  protected entityType: string;
  protected isCachedBundle: boolean;
  protected _defaultFetchStrategy: breeze.FetchStrategySymbol;

  constructor(_entityData: EntityBase, _entityService: EmProviderService) {
    this.entityManager = _entityService.coreEntityManager;
    this.resourceName = _entityData.entityDefinition.defaultResourceName;
    this.entityType = _entityData.shortName;
    this._defaultFetchStrategy = breeze.FetchStrategy.FromServer;
  }

  async all(): Promise<Array<T>> {
    const query = this.baseQuery();
    return <any> await this.executeQuery(query)
      .then(data => {
        this.isCachedBundle = true;
        this._defaultFetchStrategy = breeze.FetchStrategy.FromLocalCache;
        return data;
    });
  }

  protected createBase(options?: bareEntity<T>): T {
    return this.entityManager.createEntity(this.entityType, options) as any;
  }

  protected baseQuery(): breeze.EntityQuery {
    return breeze.EntityQuery.from(this.resourceName);
  }

  protected executeQuery(query: breeze.EntityQuery, fetchStrat?: breeze.FetchStrategySymbol): Promise<Array<T>> {
    console.log(`fetch strategy: ${fetchStrat}`);
    console.log(`default strategy: ${this._defaultFetchStrategy}`);
    const queryType = query.using(fetchStrat || this._defaultFetchStrategy);
    return <any>this.entityManager.executeQuery(queryType)
      .then((data) => {
        console.log(data.results);
        return data.results;
      })
      .catch(this.queryFailed);
  }

  protected executeCacheQuery(query: breeze.EntityQuery): breeze.Entity[] {
    return this.entityManager.executeQueryLocally(query);
  }

  withId(key: number): Promise<T> {
    return this.entityManager.fetchEntityByKey(this.entityType, key, true)
      .then((data) => {
        console.log(data.entity);
        return <T><any>data.entity;
      }).catch(this.queryFailed);
  }

  where(predicate: breeze.Predicate): Promise<Array<T>> {
    const query = this.baseQuery().where(predicate);
    return this.executeQuery(query);
  }

  whereInCache(predicate: breeze.Predicate): Array<T> {
    const query = this.baseQuery().where(predicate);
    return <Array<any>>this.executeCacheQuery(query);
  }

  queryFailed(error): Promise<any> {
    console.log(error);
   return Promise.reject('queryfailed');
  }
}
