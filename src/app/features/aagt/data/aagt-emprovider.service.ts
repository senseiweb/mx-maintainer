import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MxmAppName } from 'app/app-config.service';
import { GlobalEntityMgrProviderService, SpEntityBase } from 'app/global-data';
import { BaseEmProviderService } from 'app/global-data/repos/base-emprovider.service';
import { CustomNameConventionService } from 'app/global-data/service-adapter/custom-namingConventionDict';
import * as _ from 'lodash';
import { AagtDataModule } from './aagt-data.module';
import {
    ActionItem,
    Asset,
    AssetTriggerAction,
    Generation,
    GenerationAsset,
    Team,
    TeamAvailability,
    TeamCategory,
    Trigger,
    TriggerAction
} from './models';
import { TeamJobReservation } from './models/team-job-reservation';

const APP_MODELS: Array<typeof SpEntityBase> = [
    ActionItem,
    AssetTriggerAction,
    Asset,
    GenerationAsset,
    Generation,
    TeamAvailability,
    TeamCategory,
    TeamJobReservation,
    Team,
    TriggerAction,
    Trigger
];
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
