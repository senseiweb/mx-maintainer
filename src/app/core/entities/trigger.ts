import { EntityBase, dt, baseDataProperties} from './_entity-base';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Trigger extends EntityBase {

  constructor() {
    super('Trigger');
    this.entityDefinition.dataProperties.milestone = { dataType: dt.String };
    this.entityDefinition.dataProperties.uriggerStart = { dataType: dt.DateTime };
    this.entityDefinition.dataProperties.uriggerStop = { dataType: dt.DateTime };
    this.entityDefinition.dataProperties.generationId = { dataType: dt.Int32, isNullable: false };


    Object.assign(this.entityDefinition.dataProperties, baseDataProperties);
  }

  milestone: string;
  generationOffset?: number;
  triggerStart?: Date;
  triggerStop?: Date;

  initializer(entity: Trigger) { }

}
