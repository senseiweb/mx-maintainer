import { NgModule } from '@angular/core';
import {
  GenerationRepoService,
  GenAssetRepoService,
  TriggerRepoService,
  AssetRepoService,
  TagRepoService,
  ActionItemRepo
} from './repos';

import {
  ActionItemMetadata,
  AssetTriggerTaskMetadata,
  AssetMetadata,
  AssumptionMetadata,
  GenerationMetadata,
  TeamMetadata,
  TeamAvailabilityMetadata,
  TriggerMetadata,
  TriggerActionMetadata,
  GenerationAssetMetadata
} from './models';


import { DataModule, MxmTagMetadata, SpMetadataMetadata } from 'app/data';

const appEntities = [
  ActionItemMetadata,
  AssetTriggerTaskMetadata,
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
    })  ],
  exports: [
  ],
  providers: appEntities.concat(repos),
  declarations: []
})
export class AagtDataModule {
  constructor() {
  }
}
