import { Injectable } from '@angular/core';
import { BaseRepoService, CoreEmProviderService } from 'app/global-data';
import { AagtDataModule } from '../aagt-data.module';
import { AagtEmProviderService } from '../aagt-emprovider.service';
import { ActionItem } from '../models';

@Injectable({ providedIn: AagtDataModule })
export class ActionItemRepo extends BaseRepoService<ActionItem> {
    constructor(emService: AagtEmProviderService) {
        super(SpListName.ActionItem, emService);
    }

    create(): ActionItem {
        return this.createBase({
            assignable: false,
            duration: 0
        });
    }
}
