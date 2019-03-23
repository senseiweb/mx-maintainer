import { Injectable } from '@angular/core';
import { BaseRepoService, EmProviderService } from 'app/global-data';
import { AagtDataModule } from '../aagt-data.module';
import { AagtEmProviderService } from '../aagt-emprovider.service';
import { AagtListName, Trigger } from '../models';

@Injectable({ providedIn: AagtDataModule })
export class TriggerRepoService extends BaseRepoService<Trigger> {
    constructor(emService: AagtEmProviderService) {
        super(AagtListName.Trigger, emService);
    }

    newTrigger(generationId: number): Trigger {
        return this.createBase({ generationId });
    }
}
