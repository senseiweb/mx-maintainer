import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmProviderService, BaseRepoService, GenerationRepoService } from './data';
import {
  EntityBase,
  GeneratorOps,
  SpAppConfig,
  ActionItem,
  AssetTriggerTask,
  Asset,
  Assumption,
  Producer,
  RegistrationHelper,
  SpMetadata,
  Trigger,
  TriggerProductionCapability,
  WorkShift,
  AagtAppConfig
} from './entities';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    EmProviderService,
    AagtAppConfig,
    BaseRepoService,
    EntityBase,
    GeneratorOps,
    SpAppConfig,
    ActionItem,
    AssetTriggerTask,
    Asset,
    Assumption,
    Producer,
    RegistrationHelper,
    SpAppConfig,
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
