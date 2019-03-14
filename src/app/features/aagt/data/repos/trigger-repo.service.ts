import { Injectable } from '@angular/core';
import { BaseRepoService, EmProviderService } from 'app/global-data';
import { Trigger, AagtListName } from '../models';
import { AagtDataModule } from '../aagt-data.module';

@Injectable({ providedIn: AagtDataModule })
export class TriggerRepoService extends BaseRepoService<Trigger> {
    constructor(emService: EmProviderService) {
        super(AagtListName.Trigger, emService);
    }

    newTrigger(generationId: number): Trigger {
        return this.createBase({ generationId });
    }
}
