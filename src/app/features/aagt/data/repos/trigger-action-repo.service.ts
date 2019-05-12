import { Injectable } from '@angular/core';
import { BaseRepoService } from 'app/global-data';
import { AagtDataModule } from '../aagt-data.module';
import { AagtEmProviderService } from '../aagt-emprovider.service';
import { TriggerAction } from '../models';

@Injectable({ providedIn: AagtDataModule })
export class TriggerActionRepoService extends BaseRepoService<TriggerAction> {
    constructor(emService: AagtEmProviderService) {
        super('TriggerAction', emService);
    }
}
