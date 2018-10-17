import { Injectable } from '@angular/core';
import { BaseRepoService } from './base-repository.service';
import { EmProviderService } from './em-provider';
import { Asset, AssetMetadata } from '../entities';

@Injectable({
  providedIn: 'root'
})
export class AssetRepoService extends BaseRepoService<Asset> {

constructor(entityService: EmProviderService, assetMeta: AssetMetadata) {
  super(assetMeta, entityService);

 }
}
