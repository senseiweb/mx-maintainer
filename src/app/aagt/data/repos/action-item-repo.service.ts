import { Injectable } from '@angular/core';
import { BaseRepoService, EmProviderService } from 'app/data';
import { ActionItem, ActionItemMetadata } from '../models';
import { AagtModule } from 'app/aagt/aagt.module';

@Injectable({
  providedIn: AagtModule
})
export class ActionItemRepo extends BaseRepoService<ActionItem> {

  constructor(emService: EmProviderService) {
    super('ActionItem', emService);
  }

}
