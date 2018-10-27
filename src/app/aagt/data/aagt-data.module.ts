import { NgModule } from '@angular/core';
import {
  GenerationRepoService,
  GenAssetRepoService,
  TriggerRepoService,
  AssetRepoService,
  TagsRepoService
} from './repos';

import {
  ActionItemMetadata,
  AssetTriggerTaskMetadata,
  AssetMetadata,
  AssumptionMetadata,
  GenerationMetadata,
  ProducerMetadata,
  TaskMetadata,
  TriggerProductionCapabilityMetadata,
  TriggerMetadata,
  WorkShiftMetadata,
  TriggerTaskMetadata
} from './models';


import { DataModule, MxmTagMetadata } from 'app/data';

const appEntities = [
  ActionItemMetadata,
  AssetTriggerTaskMetadata,
  AssetMetadata,
  AssumptionMetadata,
  GenerationMetadata,
  ProducerMetadata,
  TaskMetadata,
  TriggerProductionCapabilityMetadata,
  TriggerTaskMetadata,
  TriggerMetadata,
  WorkShiftMetadata,
  MxmTagMetadata
];

const repos = [
  GenerationRepoService,
  GenAssetRepoService,
  TriggerRepoService,
  AssetRepoService,
  TagsRepoService
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
