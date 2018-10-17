import * as ebase from './_entity-base';
import { Injectable } from '@angular/core';

export type AssetStatus = 'FMC'|'PMC'|'NMC';

export class GenerationAsset extends ebase.SpEntityBase {
  health: AssetStatus;
  title: string;
  linePosition: number;
  generationId: string;
  assetId: string;
}

@Injectable({
  providedIn: 'root'
})
export class GenerationAssetMetadata extends ebase.MetadataBase {

  constructor() {
    super('GenerationAsset');
    this.entityDefinition.dataProperties.title = { dataType: this.dt.String, isNullable: false };
    this.entityDefinition.dataProperties.linePosition = { dataType: this.dt.Int16 };
    this.entityDefinition.dataProperties.generationId = { dataType: this.dt.Int16 };
    this.entityDefinition.dataProperties.assetId = { dataType: this.dt.Int16 };

    // this.entityDefinition.navigationProperties.AssetTriggerTasks = {
    //  entityTypeName: this._assetTriggerTask.shortName,
    //  foreignKeyNames: ['AssetId']
    // };
    Object.assign(this.entityDefinition.dataProperties, this.baseDataProperties);
  }

  initializer(entity: GenerationAsset) { }

}
