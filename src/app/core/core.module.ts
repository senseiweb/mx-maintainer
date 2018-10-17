import { NgModule, Optional, SkipSelf } from '@angular/core';
import {
  EmProviderService,
  BaseRepoService,
  GenerationRepoService,
  GenAssetRepoService,
  TriggerRepoService,
  AssetRepoService,
  SpConfigDataRepoService
} from './data';
import {
  GenerationMetadata,
  GenerationAssetMetadata,
  SpConfigDataMetadata,
  ActionItemMetadata,
  AssetTriggerTaskMetadata,
  AssetMetadata,
  AssumptionMetadata,
  ProducerMetadata,
  RegistrationHelper,
  SpMetadataMetadata,
  TriggerMetadata,
  TriggerProductionCapabilityMetadata,
  WorkShiftMetadata
} from './entities';

import { AagtAppConfig } from './aagt-app-config';
import * as navStructure from './app-nav-structure';

@NgModule({
  imports: [],
  exports: [
  ],
  providers: [
    EmProviderService,
    BaseRepoService,
    GenerationRepoService,
    GenAssetRepoService,
    TriggerRepoService,
    AagtAppConfig,
    GenerationMetadata,
    GenerationAssetMetadata,
    SpConfigDataMetadata,
    SpConfigDataRepoService,
    ActionItemMetadata,
    AssetTriggerTaskMetadata,
    AssetMetadata,
    AssumptionMetadata,
    ProducerMetadata,
    AssetRepoService,
    RegistrationHelper,
    SpMetadataMetadata,
    TriggerMetadata,
    TriggerProductionCapabilityMetadata,
    WorkShiftMetadata
  ],
  declarations: []
})
export class CoreModule {

  constructor(@Optional() @SkipSelf() core: CoreModule) {
    if (core) {
      throw new Error('Core Module is injected only once into the main app module');
    }
  }
}
