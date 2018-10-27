import * as ebase from 'app/data/models/_entity-base';
import { GenerationAsset } from './generation-asset';
import { Injectable } from '@angular/core';
import { AagtModule } from 'app/aagt/aagt.module';


export class Asset extends ebase.SpEntityBase {
  health: string;
  alias: string;
  notes: string;
  triggerAssets: Array<GenerationAsset>;
}

@Injectable({providedIn: AagtModule})
export class AssetMetadata extends ebase.MetadataBase<Asset> {

  metadataFor = Asset;

  constructor() {
    super('Asset');
    this.entityDefinition.dataProperties.health = { dataType: this.dt.String };
    this.entityDefinition.dataProperties.alias = { dataType: this.dt.String };
    this.entityDefinition.dataProperties.notes = { dataType: this.dt.String };

    // this.entityDefinition.navigationProperties.AssetTriggerTasks = {
    //  entityTypeName: this._assetTriggerTask.shortName,
    //  foreignKeyNames: ['AssetId']
    // };
    Object.assign(this.entityDefinition.dataProperties, this.baseDataProperties);
  }

  initializer(entity: Asset) { }
}
