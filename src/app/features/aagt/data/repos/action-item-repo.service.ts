import { Injectable } from '@angular/core';
import { ActionItem, AagtListName } from '../models';
import { AagtDataModule } from '../aagt-data.module';
import { BaseRepoService, EmProviderService } from 'app/global-data';

@Injectable({ providedIn: AagtDataModule })
export class ActionItemRepo extends BaseRepoService<ActionItem> {
    constructor(emService: EmProviderService) {
        super(AagtListName.ActionItem, emService);
    }

    create(): ActionItem {
        return this.createBase({
            availableForUse: false,
            duration: 0
        });
    }
}
