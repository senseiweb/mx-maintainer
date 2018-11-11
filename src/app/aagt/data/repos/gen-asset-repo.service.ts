import { Injectable } from '@angular/core';
import { AagtModule } from 'app/aagt/aagt.module';
import { BaseRepoService, EmProviderService } from 'app/data';
import { GenerationAsset, AagtListName } from '../models';
import { AagtDataModule } from '../aagt-data.module';

@Injectable({  providedIn: AagtDataModule })
export class GenAssetRepoService extends BaseRepoService<GenerationAsset> {
    constructor (entityService: EmProviderService) {
        super(AagtListName.GenAsset, entityService);
    }
}
