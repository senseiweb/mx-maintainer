import { Injectable } from '@angular/core';
import { BaseRepoService } from './base-repository.service';
import { Generation, genStatusEnum } from '../entities';
import { EmProviderService } from './em-provider';


@Injectable({
  providedIn: 'root'
})
export class GenerationRepoService extends BaseRepoService<Generation> {

  constructor(generation: Generation, entityService: EmProviderService) {
    super(generation, entityService);
  }

  createDraftGen(): Generation {
    return this.createBase({status: genStatusEnum.draft});
  }
}
