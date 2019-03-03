import { NgModule } from '@angular/core';
import {
  MxmTagMetadata,
  SpMetadataMetadata,
  SpMultiLookupMeta
} from './models';
import {
  EmProviderService,
} from './repos/';

import { ModuleWithProviders } from '@angular/compiler/src/core';
import { EmProviderConfig } from './repos/em-provider-config';

const appEntities = [SpMetadataMetadata, SpMultiLookupMeta, MxmTagMetadata] as any;

@NgModule({
  imports: [],
  exports: [
  ],
  providers: [EmProviderService],
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
  constructor() {}
}
