import { Injectable } from '@angular/core';
import { BaseRepoService } from './base-repository.service';
import { Generation } from '../entities';
import { EmProviderService } from './em-provider';
import { GenerationAsset } from '../entities/generation-asset';

@Injectable({
  providedIn: 'root'
})
export class GenAssetRepoService extends BaseRepoService<GenerationAsset> {

  constructor(genAsset: GenerationAsset, entityService: EmProviderService) {
    super(genAsset, entityService);
  }

}
