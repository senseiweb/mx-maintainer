import { Injectable } from '@angular/core';
import { RawEntity } from '@ctypes/breeze-type-customization';
import { BaseRepoService } from 'app/global-data';
import { AagtDataModule } from '../aagt-data.module';
import { AagtEmProviderService } from '../aagt-emprovider.service';
import { GenerationAsset } from '../models';

@Injectable({ providedIn: AagtDataModule })
export class GenAssetRepoService extends BaseRepoService<GenerationAsset> {
    constructor(entityService: AagtEmProviderService) {
        super('GenerationAsset', entityService);
    }

    createGenerationAsset(data: RawEntity<GenerationAsset>): GenerationAsset {
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
