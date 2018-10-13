import { EntityBase, dt, baseDataProperties} from './_entity-base';
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
    this.entityDefinition.dataProperties.health = { dataType: dt.String };
    this.entityDefinition.dataProperties.alias = { dataType: dt.String };
    this.entityDefinition.dataProperties.notes = { dataType: dt.String };

    // this.entityDefinition.navigationProperties.AssetTriggerTasks = {
    //  entityTypeName: this._assetTriggerTask.shortName,
    //  foreignKeyNames: ['AssetId']
    // };
    Object.assign(this.entityDefinition.dataProperties, baseDataProperties);
  }

  health: string;
  alias: string;
  notes: string;
  triggerAssets: Array<GenerationAsset>;

  initializer(entity: Asset) { }

}
