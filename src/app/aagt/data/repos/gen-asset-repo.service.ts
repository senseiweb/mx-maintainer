import { Injectable } from '@angular/core';
import { BaseRepoService, EmProviderService } from 'app/data';
import { GenerationAsset, GenerationAssetMetadata } from '../models';
import { AagtModule } from 'app/aagt/aagt.module';

@Injectable({
  providedIn: AagtModule
})
export class GenAssetRepoService extends BaseRepoService<GenerationAsset> {

  constructor(entityService: EmProviderService) {
    super('GenerationAsset', entityService);
  }

}
