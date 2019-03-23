import { Injectable } from '@angular/core';
import { BaseRepoService, EmProviderService } from 'app/global-data';
import { AagtDataModule } from '../aagt-data.module';
import { AagtEmProviderService } from '../aagt-emprovider.service';
import { AagtListName, ActionItem } from '../models';

@Injectable({ providedIn: AagtDataModule })
export class ActionItemRepo extends BaseRepoService<ActionItem> {
    constructor(emService: AagtEmProviderService) {
        super(AagtListName.ActionItem, emService);
    }

    create(): ActionItem {
        return this.createBase({
            assignable: false,
            duration: 0
        });
    }
}
