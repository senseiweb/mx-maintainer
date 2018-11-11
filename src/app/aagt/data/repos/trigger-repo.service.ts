import { Injectable } from '@angular/core';
import { BaseRepoService, EmProviderService } from 'app/data';
import { Trigger, AagtListName } from '../models';
import { AagtModule } from 'app/aagt/aagt.module';
import { AagtDataModule } from '../aagt-data.module';

@Injectable({ providedIn: AagtDataModule })
export class TriggerRepoService extends BaseRepoService<Trigger> {

    constructor (emService: EmProviderService) {
        super(AagtListName.Trigger, emService);
    }

}
