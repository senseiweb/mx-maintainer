import { Injectable } from '@angular/core';
import { BaseRepoService } from './base-repository.service';
import { EmProviderService } from './em-provider';
import { SpConfigData, configKeyEnum, SpCfgIsoType } from '../entities';
import { AagtAppConfig } from '../aagt-app-config';
import * as breeze from 'breeze-client';

@Injectable({
  providedIn: 'root'
})
export class SpConfigDataRepoService extends BaseRepoService<SpConfigData> {

  cachedConfigData: configKeyEnum[] = [];

  constructor(entityService: EmProviderService,
    spConfigData: SpConfigData,
    appConfig: AagtAppConfig) {
    super(spConfigData, entityService);

    appConfig.initSpConfigData.forEach(cfg => {
      const configEntity = {} as SpConfigData;
      configEntity.id = cfg.id;
      configEntity.configKey = configKeyEnum[cfg.configKey];
      configEntity.configValue = cfg.configValue;
      this.entityManager.createEntity(
        spConfigData.entityType, configEntity,
        breeze.EntityState.Unchanged,
        breeze.MergeStrategy.PreserveChanges);
    });
  }

  async getIsoTypes(): Promise<SpCfgIsoType> {
    const predicate = breeze.Predicate.create(
      'configKey',
      breeze.FilterQueryOp.Equals,
      configKeyEnum.isoTypes);

    if (this.cachedConfigData.some(type => type === configKeyEnum.isoTypes)) {
      return <any> await this.whereInCache(predicate);
    } else {
      return <any> await this.where(predicate);
    }
  }
}
