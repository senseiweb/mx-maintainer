import { Injectable } from '@angular/core';
import { bareEntity } from '@ctypes/breeze-type-customization';
import { BaseRepoService } from 'app/global-data';
import { AagtDataModule } from '../aagt-data.module';
import { AagtEmProviderService } from '../aagt-emprovider.service';
import { AagtListName, AssetTriggerAction } from '../models';

@Injectable({ providedIn: AagtDataModule })
export class AssetTriggerActionRepoService extends BaseRepoService<
    AssetTriggerAction
> {
    constructor(entityService: AagtEmProviderService) {
        super(AagtListName.AssetTrigAct, entityService);
    }

    createAssetTriggerAction(data: bareEntity<AssetTriggerAction>): void {
        data.actionStatus = 'Unscheduled';
        this.createBase(data);
    }
}
