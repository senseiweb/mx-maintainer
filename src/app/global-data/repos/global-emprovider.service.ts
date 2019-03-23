import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from 'app/app-config.service';
import { EmProviderService } from 'app/global-data';
import { BaseEmProviderService } from 'app/global-data/repos/base-emprovider.service';
import { CustomMetadataHelperService } from 'app/global-data/service-adapter/custom-metadata-helper';
import { CustomNameConventionService } from 'app/global-data/service-adapter/custom-namingConventionDict';
import { GlobalDataModule } from '../data.module';

@Injectable({ providedIn: GlobalDataModule })
export class GlobalEmProviderService extends BaseEmProviderService {
    constructor(httpClient: HttpClient, metaHelper: CustomMetadataHelperService, appCfg: AppConfig, nameCov: CustomNameConventionService, emProviderService: EmProviderService) {
        super(httpClient, metaHelper, appCfg, nameCov, emProviderService, '', '');
    }
}
