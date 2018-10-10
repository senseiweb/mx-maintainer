import { EntityBase } from './_entity-base';
import { Injectable } from '@angular/core';
import { AssetTriggerTask } from './asset-trigger-task';

@Injectable({
  providedIn: 'root'
})
export class GenerationAsset extends EntityBase {

  constructor(
    private _assetTriggerTask: AssetTriggerTask
  ) {
    super('GenerationAsset');
    this.self = this;
    this.entityDefinition.dataProperties.title = { dataType: this.dt.String, isNullable: false };
    this.entityDefinition.dataProperties.linePosition = { dataType: this.dt.Int16 };
    this.entityDefinition.dataProperties.generationId = { dataType: this.dt.Int16 };
    this.entityDefinition.dataProperties.assetId = { dataType: this.dt.Int16 };

    // this.entityDefinition.navigationProperties.AssetTriggerTasks = {
    //  entityTypeName: this._assetTriggerTask.shortName,
    //  foreignKeyNames: ['AssetId']
    // };
    Object.assign(this.entityDefinition.dataProperties, this.coreProperties);
  }


  title: string;
  linePosition: number;
  generationId: string;
  assetId: string;

  initializer(entity: GenerationAsset) { }

}
