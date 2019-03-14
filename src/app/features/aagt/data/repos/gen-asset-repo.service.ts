import { Injectable } from '@angular/core';
import { BaseRepoService, EmProviderService } from 'app/global-data';
import { GenerationAsset, AagtListName } from '../models';
import { AagtDataModule } from '../aagt-data.module';
import { EntityState } from 'breeze-client';

@Injectable({ providedIn: AagtDataModule })
export class GenAssetRepoService extends BaseRepoService<GenerationAsset> {
    constructor(entityService: EmProviderService) {
        super(AagtListName.GenAsset, entityService);
    }

    createGenerationAsset(data: { generationId: number; assetId: number }): GenerationAsset {
        return this.createBase(data);
    }

    recoverDeletedGenAssets(data: { generationId: number; assetId: number }): GenerationAsset | null {
        const deletedGenAssets = this.entityManager.getEntities(this.entityType, EntityState.Deleted) as GenerationAsset[];

        const recoveredGenAsset = deletedGenAssets.filter(ga => ga.generationId === data.generationId && ga.assetId === data.assetId)[0];

        if (recoveredGenAsset) {
            recoveredGenAsset.entityAspect.setUnchanged();
            return recoveredGenAsset;
        }
        return null;
    }

    // getAllGenerationAssets(data: { gernationId: number, triggerId: number }): GenerationAsset[] {
    //     return this.entityManager
    //         .getEntities(this.entityType)
    //         .filter((entity: GenerationAsset) => entity.generationId === data.gernationId &&
    //             entity.triggerId === data.triggerId) as GenerationAsset[]
    // }
}
