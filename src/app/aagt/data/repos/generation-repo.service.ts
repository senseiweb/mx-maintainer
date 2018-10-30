import { Injectable } from '@angular/core';
import { BaseRepoService, EmProviderService } from 'app/data';
import { Generation, genStatusEnum, GenerationMetadata } from '../models';
import * as breeze from 'breeze-client';


@Injectable({
  providedIn: 'root'
})
export class GenerationRepoService extends BaseRepoService<Generation> {

  constructor(entityService: EmProviderService) {
    super('Generation', entityService);
  }

  createDraftGen(): Generation {
    const existingDraft = this.entityManager.getEntities(this.entityType.shortName, breeze.EntityState.Added)[0] as Generation;
    if (existingDraft) {
      return existingDraft;
    }
    return this.createBase({status: genStatusEnum.draft});
  }
}
