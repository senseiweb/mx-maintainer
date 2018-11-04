import { Injectable } from '@angular/core';
import { AagtModule } from 'app/aagt/aagt.module';
import { BaseRepoService, EmProviderService } from 'app/data';
import { GenerationAsset } from '../models';

@Injectable({ providedIn: AagtModule })
export class GenAssetRepoService extends BaseRepoService<GenerationAsset> {
    constructor (entityService: EmProviderService) {
        super('GenerationAsset', entityService);
    }
}
