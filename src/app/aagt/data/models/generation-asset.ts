import * as ebase from 'app/data/models/_entity-base';
import { Injectable } from '@angular/core';
import { AagtModule } from 'app/aagt/aagt.module';
import { Asset } from './asset';
import { Generation } from './generation';

export type AssetStatus = 'FMC'|'PMC'|'NMC';

export class GenerationAsset extends ebase.SpEntityBase {
  health: AssetStatus;
  title: string;
  mxPosition: number;
  asset: Asset;
  generation: Generation;
  generationId: string;
  assetId: string;
}

@Injectable({
  providedIn: AagtModule
})
export class GenerationAssetMetadata extends ebase.MetadataBase<GenerationAsset> {

  metadataFor = GenerationAsset;

  constructor() {
    super('GenerationAsset');
    this.entityDefinition.dataProperties.title = { dataType: this.dt.String, isNullable: false };
    this.entityDefinition.dataProperties.health = { dataType: this.dt.String };
    this.entityDefinition.dataProperties.mxPosition = { dataType: this.dt.Int16 };
    this.entityDefinition.dataProperties.generationId = { dataType: this.dt.Int16 };
    this.entityDefinition.dataProperties.assetId = { dataType: this.dt.Int16, isNullable: false };

    this.entityDefinition.navigationProperties = {
      asset: {
        entityTypeName: 'Asset',
        foreignKeyNames: ['assetId'],
        associationName: 'Asset_Generations'
      },
      generation: {
        entityTypeName: 'Generation',
        associationName: 'Generation_Assets',
        foreignKeyNames: ['generationId']
      }
    };

    Object.assign(this.entityDefinition.dataProperties, this.baseDataProperties);
  }

  initializer(entity: GenerationAsset) { }

}
