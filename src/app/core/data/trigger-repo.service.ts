import { Injectable } from '@angular/core';
import { BaseRepoService } from './base-repository.service';
import { Trigger, TriggerMetadata, configKeyEnum, SpCfgIsoType } from '../entities';
import { EmProviderService } from './em-provider';

@Injectable({
  providedIn: 'root'
})
export class TriggerRepoService extends BaseRepoService<Trigger> {

  constructor(triggerMeta: TriggerMetadata, emService: EmProviderService) {
    super(triggerMeta, emService);
  }

}
