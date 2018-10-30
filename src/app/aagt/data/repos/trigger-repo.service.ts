import { Injectable } from '@angular/core';
import { BaseRepoService, EmProviderService } from 'app/data';
import { Trigger } from '../models';
import { AagtModule } from 'app/aagt/aagt.module';

@Injectable({
  providedIn: AagtModule
})
export class TriggerRepoService extends BaseRepoService<Trigger> {

  constructor(emService: EmProviderService) {
    super('Trigger', emService);
  }

}
