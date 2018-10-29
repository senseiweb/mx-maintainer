import * as ebase from 'app/data/models/_entity-base';
import { GenerationAsset } from './generation-asset';
import { Injectable } from '@angular/core';
import { AagtModule } from 'app/aagt/aagt.module';


export class Asset extends ebase.SpEntityBase {
  alias: string;
  notes: string;
  generationAssets: Array<GenerationAsset>;
}

@Injectable({providedIn: AagtModule})
export class AssetMetadata extends ebase.MetadataBase<Asset> {

  metadataFor = Asset;

  constructor() {
    super('Asset');
    this.entityDefinition.dataProperties.alias = { dataType: this.dt.String };
    this.entityDefinition.dataProperties.notes = { dataType: this.dt.String };

    this.entityDefinition.navigationProperties.generationAssets = {
     entityTypeName: 'GenerationAsset',
     foreignKeyNames: ['AssetId']
    };
    Object.assign(this.entityDefinition.dataProperties, this.baseDataProperties);
  }

  initializer(entity: Asset) { }
}