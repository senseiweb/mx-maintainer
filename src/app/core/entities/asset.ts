import { EntityBase } from './_entity-base';
import { Injectable } from '@angular/core';
import { GenerationAsset } from './generation-asset';

@Injectable({
  providedIn: 'root'
})
export class Asset extends EntityBase {

  constructor(
    private gnerationAsset: GenerationAsset
  ) {
    super('Asset');
    this.self = this;
    this.entityDefinition.dataProperties.health = { dataType: this.dt.String };
    this.entityDefinition.dataProperties.alias = { dataType: this.dt.String };
    this.entityDefinition.dataProperties.notes = { dataType: this.dt.String };

    // this.entityDefinition.navigationProperties.AssetTriggerTasks = {
    //  entityTypeName: this._assetTriggerTask.shortName,
    //  foreignKeyNames: ['AssetId']
    // };
    Object.assign(this.entityDefinition.dataProperties, this.coreProperties);
  }

  health: string;
  alias: string;
  notes: string;
  triggerAssets: Array<GenerationAsset>;

  initializer(entity: Asset) { }

}
