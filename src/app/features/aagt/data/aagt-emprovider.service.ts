import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from 'app/app-config.service';
import { EmProviderService } from 'app/global-data';
import { BaseEmProviderService } from 'app/global-data/repos/base-emprovider.service';
import { CustomMetadataHelperService } from 'app/global-data/service-adapter/custom-metadata-helper';
import { CustomNameConventionService } from 'app/global-data/service-adapter/custom-namingConventionDict';
import { AagtDataModule } from './aagt-data.module';
import {
    ActionItemMetadata,
    AssetMetadata,
    AssetTriggerActionMetadata,
    AssumptionMetadata,
    GenerationAssetMetadata,
    GenerationMetadata,
    TeamAvailabilityMetadata,
    TeamMetadata,
    TriggerActionMetadata,
    TriggerMetadata
} from './models';

const appEntities = [
    ActionItemMetadata,
    AssetTriggerActionMetadata,
    AssetMetadata,
    AssumptionMetadata,
    GenerationMetadata,
    GenerationAssetMetadata,
    TeamMetadata,
    TeamAvailabilityMetadata,
    TriggerActionMetadata,
    TriggerMetadata
];
@Injectable({ providedIn: AagtDataModule })
export class AagtEmProviderService extends BaseEmProviderService {
    constructor(httpClient: HttpClient, metaHelper: CustomMetadataHelperService, appCfg: AppConfig, nameCov: CustomNameConventionService, emProviderService: EmProviderService) {
        super(httpClient, metaHelper, appCfg, nameCov, emProviderService, 'aagt', 'SP.Data.Aagt', appEntities);
    }
}
