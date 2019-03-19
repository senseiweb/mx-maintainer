import { NgModule } from '@angular/core';

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
    TriggerMetadata,
    AagtSpMetadataMetadata
} from './models';

import { GlobalDataModule, EmProviderConfig } from 'app/global-data';

const appEntities = [
    ActionItemMetadata,
    AssetTriggerActionMetadata,
    AssetMetadata,
    AssumptionMetadata,
    GenerationMetadata,
    GenerationAssetMetadata,
    TeamMetadata,
    AagtSpMetadataMetadata as any,
    TeamAvailabilityMetadata,
    TriggerActionMetadata,
    TriggerMetadata
];

const emCfg = new EmProviderConfig(appEntities);
emCfg.featureSpAppName = 'aagt';
emCfg.nameSpace = 'SP.Data.Aagt';

@NgModule({
    imports: [GlobalDataModule.forFeature(emCfg)],
    exports: [],
    providers: [],
    declarations: []
})
export class AagtDataModule {
    constructor() {}
}
