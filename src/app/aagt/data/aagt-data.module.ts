import { NgModule } from '@angular/core';
import {
  ActionItemRepo,
  AssetRepoService,
  GenAssetRepoService,
  GenerationRepoService,
  TagRepoService,
  TriggerRepoService
} from './repos';

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
  TriggerMetadata
} from './models';

import { DataModule, MxmTagMetadata, SpMetadataMetadata } from 'app/data';

const appEntities = [
  ActionItemMetadata,
  AssetTriggerActionMetadata,
  AssetMetadata,
  AssumptionMetadata,
  GenerationMetadata,
  GenerationAssetMetadata,
  TeamMetadata,
  SpMetadataMetadata as any,
  TeamAvailabilityMetadata,
  TriggerActionMetadata,
  TriggerMetadata,
  MxmTagMetadata
];

const repos = [
  GenerationRepoService,
  GenAssetRepoService,
  ActionItemRepo,
  TriggerRepoService,
  AssetRepoService,
  TagRepoService
] as any;

@NgModule({
  imports: [
    DataModule.forFeature({
      entities: appEntities,
      serviceEndpoint: '/aagt',
      nameSpace: 'SP.Data.Aagt'
    })
  ],
  exports: [],
  providers: appEntities.concat(repos),
  declarations: []
})
export class AagtDataModule {
  constructor() {}
}
