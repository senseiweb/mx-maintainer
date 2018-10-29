import { NgModule } from '@angular/core';
import {
  GenerationRepoService,
  GenAssetRepoService,
  TriggerRepoService,
  AssetRepoService,
  TagRepoService
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
  TriggerActionMetadata
} from './models';


import { DataModule, MxmTagMetadata } from 'app/data';

const appEntities = [
  ActionItemMetadata,
  AssetTriggerTaskMetadata,
  AssetMetadata,
  AssumptionMetadata,
  GenerationMetadata,
  TeamMetadata,
  TeamAvailabilityMetadata,
  TriggerActionMetadata,
  TriggerMetadata,
  MxmTagMetadata
];

const repos = [
  GenerationRepoService,
  GenAssetRepoService,
  TriggerRepoService,
  AssetRepoService,
  TagRepoService
] as any;

@NgModule({
  imports: [
    DataModule.forFeature({
      entities: appEntities,
      serviceEndpoint: '5mos/programs/codi/',
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
