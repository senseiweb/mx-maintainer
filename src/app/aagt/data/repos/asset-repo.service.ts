import { Injectable } from '@angular/core';
import { AagtModule } from 'app/aagt/aagt.module';
import { BaseRepoService, EmProviderService } from 'app/data';
import { Asset } from '../models';

@Injectable({ providedIn: AagtModule })
export class AssetRepoService extends BaseRepoService<Asset> {
    constructor (entityService: EmProviderService) {
        super('Asset', entityService);
    }
}
