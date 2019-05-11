import { Injectable } from '@angular/core';
import { BaseRepoService, } from 'app/global-data';
import { AagtDataModule } from '../aagt-data.module';
import { AagtEmProviderService } from '../aagt-emprovider.service';
import { Trigger } from '../models';

@Injectable({ providedIn: AagtDataModule })
export class TriggerRepoService extends BaseRepoService<'Trigger'> {
    constructor(emService: AagtEmProviderService) {
        super('Trigger', emService);
    }

    newTrigger(generationId: number): Trigger {
        return this.createBase({ generationId });
    }
}
