import { NgModule } from '@angular/core';
// import {
//   ActionItemRepo,
//   AssetRepoService,
//   GenAssetRepoService,
//   GenerationRepoService,
//   TriggerRepoService,
//   SpAagtRepoService
// } from './repos';

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

import { MxmTagMetadata, SpMetadataMetadata } from '../../data';
import { DataModule } from '../../data/data.module';

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

// const repos = [
//     GenerationRepoService,
//     GenAssetRepoService,
//     SpAagtRepoService,
//     ActionItemRepo,
//     TriggerRepoService,
//     AssetRepoService
// ] as any;

@NgModule({
  imports: [
    DataModule.forFeature({
      entities: appEntities,
      serviceEndpoint: '/aagt/',
      nameSpace: 'SP.Data.Aagt'
    })
  ],
  exports: [],
  providers: [],
  declarations: []
})
export class AagtDataModule {
  constructor() {}
}
