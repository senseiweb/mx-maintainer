import { Injectable } from '@angular/core';
import { BaseRepoService, EmProviderService } from 'app/data';
import { GenerationAsset, AagtListName } from '../models';
import { AagtDataModule } from '../aagt-data.module';
import { EntityState } from 'breeze-client';

@Injectable({  providedIn: AagtDataModule })
export class GenAssetRepoService extends BaseRepoService<GenerationAsset> {
    constructor (entityService: EmProviderService) {
        super(AagtListName.GenAsset, entityService);
    }

    createGenerationAsset(data: { generationId: number, assetId: number }): void {
        const deletedTrigAction = this.entityManager
            .getEntities(this.entityType, EntityState.Deleted)
            .filter((entity: GenerationAsset) => entity.generationId === data.generationId
                && entity.assetId === data.assetId)[0] as GenerationAsset;

        if (deletedTrigAction) {
            deletedTrigAction.entityAspect.setUnchanged();
        } else {
            this.createBase(data);
        }
    }

    // getAllGenerationAssets(data: { gernationId: number, triggerId: number }): GenerationAsset[] {
    //     return this.entityManager
    //         .getEntities(this.entityType)
    //         .filter((entity: GenerationAsset) => entity.generationId === data.gernationId &&
    //             entity.triggerId === data.triggerId) as GenerationAsset[]
    // }
}
