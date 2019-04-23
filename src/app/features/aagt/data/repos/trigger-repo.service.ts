import { Injectable } from '@angular/core';
import { SpListName } from 'app/app-config.service';
import { BaseRepoService, CoreEmProviderService } from 'app/global-data';
import { AagtDataModule } from '../aagt-data.module';
import { AagtEmProviderService } from '../aagt-emprovider.service';
import { Trigger } from '../models';

@Injectable({ providedIn: AagtDataModule })
export class TriggerRepoService extends BaseRepoService<Trigger> {
    constructor(emService: AagtEmProviderService) {
        super(SpListName.Trigger, emService);
    }

    newTrigger(generationId: number): Trigger {
        return this.createBase({ generationId });
    }
}
