import { Injectable } from '@angular/core';
import { BaseRepoService, EmProviderService } from 'app/data';
import { Asset, AssetMetadata } from '../models';
import { AagtModule } from 'app/aagt/aagt.module';

@Injectable({
  providedIn: AagtModule
})
export class AssetRepoService extends BaseRepoService<Asset> {

constructor(entityService: EmProviderService, assetMeta: AssetMetadata) {
  super(assetMeta, entityService);
 }
}
