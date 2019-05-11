import { Injectable } from '@angular/core';
import { BaseRepoService } from 'app/global-data';
import * as breeze from 'breeze-client';
import { AagtDataModule } from '../aagt-data.module';
import { AagtEmProviderService } from '../aagt-emprovider.service';
import { Generation, GenStatusEnum } from '../models';

@Injectable({ providedIn: AagtDataModule })
export class GenerationRepoService extends BaseRepoService<'Generation'> {
    constructor(entityService: AagtEmProviderService) {
        super('Generation', entityService);
    }

    createDraftGen(): Generation {
        const existingDraft = this.entityManager.getEntities(
            this.entityType.shortName,
            breeze.EntityState.Added
        )[0] as Generation;
        if (existingDraft) {
            return existingDraft;
        }
        return this.createBase({ genStatus: GenStatusEnum.Draft });
    }
}
