import { EntityBase } from './_entity-base';
import { Injectable } from '@angular/core';
import { AssetTriggerTask } from './asset-trigger-task';

@Injectable()
export class Asset extends EntityBase {

  shortName = 'Asset';

  constructor(
    private _assetTriggerTask: AssetTriggerTask
  ) {
    super();
    this.self = this;
    this.entityDefinition.shortName = this.shortName;
    this.entityDefinition.defaultResourceName = `/lists/getByTitle('${this.shortName}')/items`;
    this.entityDefinition.dataProperties.Health = { dataType: this.dt.String };
    this.entityDefinition.dataProperties.LinePosition = { dataType: this.dt.Int16 };
    this.entityDefinition.dataProperties.Alias = { dataType: this.dt.String };
    this.entityDefinition.dataProperties.Notes = { dataType: this.dt.String };

    this.entityDefinition.navigationProperties.AssetTriggerTasks = {
      entityTypeName: this._assetTriggerTask.shortName,
      foreignKeyNames: ['AssetId']
    };
    Object.assign(this.entityDefinition.dataProperties, this.coreProperties);
  }

  health: string;
  linePosition: number;
  alias: string;
  notes: string;
  triggerTasks: Array<AssetTriggerTask>;

  initializer(entity: Asset) { }

}
