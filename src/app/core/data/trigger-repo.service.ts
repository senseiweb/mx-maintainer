import { Injectable } from '@angular/core';
import { BaseRepoService } from './base-repository.service';
import { Trigger } from '../entities';
import { EmProviderService } from './em-provider';

@Injectable({
  providedIn: 'root'
})
export class TriggerRepoService extends BaseRepoService<Trigger> {

  constructor(trigger: Trigger, emService: EmProviderService) {
    super(trigger, emService);
  }

}
