import { Injectable } from '@angular/core';
import { BaseRepoService, EmProviderService } from 'app/global-data';
import { Asset, AagtListName } from '../models';
import { AagtDataModule } from '../aagt-data.module';

@Injectable({ providedIn: AagtDataModule })
export class AssetRepoService extends BaseRepoService<Asset> {
    constructor(entityService: EmProviderService) {
        super(AagtListName.Asset, entityService);
    }
}
