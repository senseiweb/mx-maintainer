import { Injectable } from '@angular/core';
import { BaseRepoService, EmProviderService } from 'app/data';
import { AagtListName, AssetTriggerAction } from '../models';
import { AagtDataModule } from '../aagt-data.module';

@Injectable({ providedIn: AagtDataModule })
export class AssetTriggerActionRepoService extends BaseRepoService<AssetTriggerAction> {
    constructor (entityService: EmProviderService) {
        super(AagtListName.AssetTrigAct, entityService);
    }

    // getAssetTriggerActions(data: { gernationId: number, triggerId: number }): AssetTriggerAction[] {
    //     return this.entityManager
    //         .getEntities(this.entityType)
    //         .filter((entity: AssetTriggerAction) => entity.as === data.gernationId &&
    //             entity.triggerId === data.triggerId) as GenerationAsset[]
    // }
}
