import { Injectable } from '@angular/core';
import { BaseRepoService, EmProviderService } from 'app/data';
import { Trigger, TriggerMetadata } from '../models';
import { AagtModule } from 'app/aagt/aagt.module';

@Injectable({
  providedIn: AagtModule
})
export class TriggerRepoService extends BaseRepoService<Trigger> {

  constructor(triggerMeta: TriggerMetadata, emService: EmProviderService) {
    super(triggerMeta, emService);
  }

}
