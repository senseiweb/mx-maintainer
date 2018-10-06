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
import {
  MatButtonModule,
  MatDividerModule,
  MatFormFieldModule,
  MatIconModule,
  MatMenuModule,
  MatSelectModule,
  MatTableModule,
  MatTabsModule
} from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule, FuseSidebarModule } from '@fuse/components';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    MatTableModule,
    MatTabsModule,
    FuseSharedModule,
    FuseWidgetModule,
    FuseSidebarModule
  ],
  exports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    MatTableModule,
    MatTabsModule,
    FuseSharedModule,
    FuseWidgetModule,
    FuseSidebarModule
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

  constructor(@Optional() @SkipSelf()core: CoreModule) {
    if (core) {
      throw new Error('Core Module is injected only once into the main app module');
    }
  }
}
