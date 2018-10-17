import { Injectable } from '@angular/core';
import { BaseRepoService } from './base-repository.service';
import { Generation, genStatusEnum, GenerationMetadata } from '../entities';
import { EmProviderService } from './em-provider';
import * as breeze from 'breeze-client';


@Injectable({
  providedIn: 'root'
})
export class GenerationRepoService extends BaseRepoService<Generation> {

  constructor(generationMeta: GenerationMetadata, entityService: EmProviderService) {
    super(generationMeta, entityService);
  }

  createDraftGen(): Generation {
    const existingDraft = this.entityManager.getEntities(this.entityTypeName, breeze.EntityState.Added)[0];
    if (existingDraft) {
      return existingDraft;
    }
    return this.createBase({status: genStatusEnum.draft});
  }
}
