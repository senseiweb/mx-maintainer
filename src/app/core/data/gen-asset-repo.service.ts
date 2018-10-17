import { Injectable } from '@angular/core';
import { BaseRepoService } from './base-repository.service';
import { GenerationAsset, GenerationAssetMetadata } from '../entities';
import { EmProviderService } from './em-provider';

@Injectable({
  providedIn: 'root'
})
export class GenAssetRepoService extends BaseRepoService<GenerationAsset> {

  constructor(genAssetMeta: GenerationAssetMetadata, entityService: EmProviderService) {
    super(genAssetMeta, entityService);
  }

}
