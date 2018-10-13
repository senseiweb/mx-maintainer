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
  Generation,
  GenerationAsset,
  SpConfigData,
  ActionItem,
  AssetTriggerTask,
  Asset,
  Assumption,
  Producer,
  RegistrationHelper,
  SpMetadata,
  Trigger,
  TriggerProductionCapability,
  WorkShift
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
    Generation,
    GenerationAsset,
    SpConfigData,
    SpConfigDataRepoService,
    ActionItem,
    AssetTriggerTask,
    Asset,
    Assumption,
    Producer,
    AssetRepoService,
    RegistrationHelper,
    SpMetadata,
    Trigger,
    TriggerProductionCapability,
    WorkShift
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
