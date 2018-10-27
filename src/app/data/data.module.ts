import { NgModule } from '@angular/core';
import {
  EmProviderService,
  BaseRepoService,
} from './repos/';
import {
  SpMetadataMetadata,
  SpMultiLookupMeta
} from './models';

import { ModuleWithProviders } from '@angular/compiler/src/core';
import { EmProviderConfig } from './repos/em-provider.service';

const appEntities = [SpMetadataMetadata, SpMultiLookupMeta] as any;

@NgModule({
  imports: [],
  exports: [
  ],
  providers: [
    EmProviderService,
    BaseRepoService,
    SpMetadataMetadata
  ].concat(appEntities),
  declarations: []
})
export class DataModule {
  static forRoot(): ModuleWithProviders {
    const mainConfig = new EmProviderConfig();
    mainConfig.entities = appEntities;
    return {
      ngModule: DataModule,
      providers: [{
        provide: EmProviderConfig,
        useValue: EmProviderConfig
      }]
    };
  }

  static forFeature(config: EmProviderConfig) {
    return {
      ngModule: DataModule,
      providers: [{
        provide: EmProviderConfig,
        useValue: config
      }]
    };
  }
  constructor() {

  }
}
