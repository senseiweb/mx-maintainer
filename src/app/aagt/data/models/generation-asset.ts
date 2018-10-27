import * as ebase from 'app/data/models/_entity-base';
import { Injectable } from '@angular/core';
import { AagtModule } from 'app/aagt/aagt.module';

export type AssetStatus = 'FMC'|'PMC'|'NMC';

export class GenerationAsset extends ebase.SpEntityBase {
  health: AssetStatus;
  title: string;
  linePosition: number;
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
