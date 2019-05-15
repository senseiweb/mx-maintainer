import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MxmAppName } from 'app/app-config.service';
import { GlobalEntityMgrProviderService } from 'app/global-data';
import { BaseEmProviderService } from 'app/global-data/repos/base-emprovider.service';
import { CustomNameConventionService } from 'app/global-data/service-adapter/custom-namingConventionDict';
import * as _ from 'lodash';
import { AagtDataModule } from './aagt-data.module';

/** Builds off the base emService to add additional functional */

@Injectable({ providedIn: AagtDataModule })
export class AagtEmProviderService extends BaseEmProviderService {
    constructor(
        httpClient: HttpClient,
        nameCov: CustomNameConventionService,
        emProviderService: GlobalEntityMgrProviderService
    ) {
        super(
            httpClient,
            nameCov,
            emProviderService,
            'aagt',
            'SP.Data.Aagt',
            MxmAppName.Aagt
        );
    }
}
