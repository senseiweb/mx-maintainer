import { Injectable } from '@angular/core';
import {
    BaseRepoService,
    GlobalEntityMgrProviderService
} from 'app/global-data';
import { AagtDataModule } from '../aagt-data.module';
import { AagtEmProviderService } from '../aagt-emprovider.service';
import { Asset } from '../models';

@Injectable({ providedIn: AagtDataModule })
export class AssetRepoService extends BaseRepoService<Asset> {
    constructor(entityService: AagtEmProviderService) {
        super('Asset', entityService);
    }
}
