import { NgModule } from '@angular/core';
import {
  EmProviderService,
  BaseRepoService,
  SpDataRepoService,
  UserService,
} from './repos/';
import {
  SpMetadataMetadata,
  SpMultiLookupMeta,
  MxmTagMetadata
} from './models';

import { ModuleWithProviders } from '@angular/compiler/src/core';
import { EmProviderConfig } from './repos/em-provider.service';

const appEntities = [SpMetadataMetadata, SpMultiLookupMeta, MxmTagMetadata] as any;

@NgModule({
  imports: [],
  exports: [
  ],
  providers: [
    EmProviderService,
    UserService,
    BaseRepoService,
    SpDataRepoService,
    SpMetadataMetadata
  ].concat(appEntities),
  declarations: []
})
export class DataModule {
  static forRoot(): ModuleWithProviders {
    const mainConfig = { entities: appEntities };
    return {
      ngModule: DataModule,
      providers: [{
        provide: EmProviderConfig,
        useValue: mainConfig
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
