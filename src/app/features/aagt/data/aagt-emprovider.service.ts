import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MxmAppName } from 'app/app-config.service';
import { CoreEmProviderService } from 'app/global-data';
import { BaseEmProviderService } from 'app/global-data/repos/base-emprovider.service';
import { CustomMetadataHelperService } from 'app/global-data/service-adapter/custom-metadata-helper';
import { CustomNameConventionService } from 'app/global-data/service-adapter/custom-namingConventionDict';
import { Entity, EntityAction } from 'breeze-client';
import * as _ from 'lodash';
import { AagtDataModule } from './aagt-data.module';
// import {
//     ActionItemMetadata,
//     AssetMetadata,
//     AssetTriggerActionMetadata,
//     AssumptionMetadata,
//     GenerationAssetMetadata,
//     GenerationMetadata,
//     TeamAvailabilityMetadata,
//     TeamCategoryMetadata,
//     TeamMetadata,
//     TriggerActionMetadata,
//     TriggerMetadata
// } from './models';

// const appEntities = [
//     ActionItemMetadata,
//     AssetTriggerActionMetadata,
//     AssetMetadata,
//     AssumptionMetadata,
//     TeamCategoryMetadata,
//     GenerationMetadata,
//     GenerationAssetMetadata,
//     TeamMetadata,
//     TeamAvailabilityMetadata,
//     TriggerActionMetadata,
//     TriggerMetadata
// ];

export interface IEntityChange {
    entityAction: EntityAction;
    entity: Entity;
    args: any;
}
@Injectable({ providedIn: AagtDataModule })
export class AagtEmProviderService extends BaseEmProviderService {
    constructor(
        httpClient: HttpClient,
        metaHelper: CustomMetadataHelperService,
        nameCov: CustomNameConventionService,
        emProviderService: CoreEmProviderService
    ) {
        super(
            httpClient,
            metaHelper,
            nameCov,
            emProviderService,
            'aagt',
            'SP.Data.Aagt',
            MxmAppName.Aagt
        );
    }
}
