import { Injectable } from '@angular/core';
import * as breeze from 'breeze-client';
import { EmProviderService } from './em-provider';
import { EntityBase } from '../entities/_entity-base';

@Injectable({
  providedIn: 'root'
})
export class BaseRepoService<T> {
  protected entityManager: breeze.EntityManager;
  protected resourceName: string;
  protected entityType: string;
  protected isCachedBundle: boolean;
  protected _defaultFetchStrategy: breeze.FetchStrategySymbol;

  constructor(_entityData: EntityBase, _entityService: EmProviderService, ) {
    this.entityManager = _entityService.coreEntityManager;
    this.resourceName = _entityData.entityDefinition.defaultResourceName;
    this.entityType = _entityData.shortName;
  }

  all(): Promise<Array<T>> {
    const query = this.baseQuery();
    return this.executeQuery(query);
  }

  protected createBase(options?: Pick<T, Exclude<keyof T, keyof EntityBase>>): T {
    return this.entityManager.createEntity(this.entityType, options) as any;
  }

  protected baseQuery(): breeze.EntityQuery {
    return breeze.EntityQuery.from(this.resourceName);
  }

  protected executeQuery(query: breeze.EntityQuery, fetchStrat?: breeze.FetchStrategySymbol): Promise<Array<T>> {
    const queryType = query.using(fetchStrat || this._defaultFetchStrategy);
    return <any>this.entityManager.executeQuery(queryType)
      .then((data) => {
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
   return Promise.reject('queryfailed');
  }
}
