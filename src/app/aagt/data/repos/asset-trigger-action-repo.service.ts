import { Injectable } from '@angular/core';
import { BaseRepoService, EmProviderService } from 'app/data';
import { AagtListName, AssetTriggerAction } from '../models';
import { AagtDataModule } from '../aagt-data.module';
import { EntityState } from 'breeze-client';

@Injectable({ providedIn: AagtDataModule })
export class AssetTriggerActionRepoService extends BaseRepoService<AssetTriggerAction> {
    constructor (entityService: EmProviderService) {
        super(AagtListName.AssetTrigAct, entityService);
    }

    createAssetTriggerAction(data: { triggerActionId: number, genAssetId: number }): void {
        data['actionStatus'] = 'unscheduled';
        this.createBase(data);
    }

    recoverAssetTriggerActions(key: 'genAssetId' | 'triggerActionId', id: number): void {
        const deletedAssetTriggerAction = this.entityManager
            .getEntities(this.entityType, EntityState.Deleted) as AssetTriggerAction[];

        deletedAssetTriggerAction
            .filter(data => data[key] === id && data.entityAspect.validateEntity())
            .forEach(data => data.entityAspect.setUnchanged());
    }

    // getAssetTriggerActions(data: { gernationId: number, triggerId: number }): AssetTriggerAction[] {
    //     return this.entityManager
    //         .getEntities(this.entityType)
    //         .filter((entity: AssetTriggerAction) => entity.as === data.gernationId &&
    //             entity.triggerId === data.triggerId) as GenerationAsset[]
    // }
}
