import { Injectable } from '@angular/core';
import { AagtModule } from 'app/aagt/aagt.module';
import { BaseRepoService, EmProviderService } from 'app/data';
import { ActionItem } from '../models';

@Injectable({ providedIn: AagtModule })
export class ActionItemRepo extends BaseRepoService<ActionItem> {
    constructor (emService: EmProviderService) {
        super('ActionItem', emService);
    }

    create(): ActionItem {
        return this.createBase({ availableForUse: false });
    }
}
