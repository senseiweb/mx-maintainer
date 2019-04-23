import { Injectable } from '@angular/core';
import { bareEntity } from '@ctypes/breeze-type-customization';
import { SpListName } from 'app/app-config.service';
import { BaseRepoService, CoreEmProviderService } from 'app/global-data';
import { EntityState } from 'breeze-client';
import { AagtDataModule } from '../aagt-data.module';
import { AagtEmProviderService } from '../aagt-emprovider.service';
import { GenerationAsset } from '../models';

@Injectable({ providedIn: AagtDataModule })
export class GenAssetRepoService extends BaseRepoService<GenerationAsset> {
    constructor(entityService: AagtEmProviderService) {
        super(SpListName.GenerationAsset, entityService);
    }

    createGenerationAsset(data: bareEntity<GenerationAsset>): GenerationAsset {
        data.health = 'UNKNOWN';
        return this.createBase(data);
    }

    // recoverDeletedGenAssets(data: {
    //     generationId: number;
    //     assetId: number;
    // }): GenerationAsset | undefined {
    //     const deletedGenAssets = this.entityManager.getEntities(
    //         this.entityType,
    //         EntityState.Deleted
    //     ) as GenerationAsset[];

    //     const recoveredGenAsset = deletedGenAssets.filter(
    //         ga =>
    //             ga.generationId === data.generationId &&
    //             ga.assetId === data.assetId
    //     )[0];

    //     if (recoveredGenAsset) {
    //         recoveredGenAsset.entityAspect.setModified();
    //         return recoveredGenAsset;
    //     }
    //     return undefined;
    // }

    // getAllGenerationAssets(data: { gernationId: number, triggerId: number }): GenerationAsset[] {
    //     return this.entityManager
    //         .getEntities(this.entityType)
    //         .filter((entity: GenerationAsset) => entity.generationId === data.gernationId &&
    //             entity.triggerId === data.triggerId) as GenerationAsset[]
    // }
}
