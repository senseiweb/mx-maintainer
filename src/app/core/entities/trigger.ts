import { EntityBase } from './_entity-base';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Trigger extends EntityBase {

  constructor() {
    super('Trigger');
    this.self = this;
    this.entityDefinition.dataProperties.milestone = { dataType: this.dt.String };
    this.entityDefinition.dataProperties.uriggerStart = { dataType: this.dt.DateTime };
    this.entityDefinition.dataProperties.uriggerStop = { dataType: this.dt.DateTime };
    this.entityDefinition.dataProperties.generationId = { dataType: this.dt.Int32, isNullable: false };


    Object.assign(this.entityDefinition.dataProperties, this.coreProperties);
  }

  milestone: string;
  generationOffset?: number;
  triggerStart?: Date;
  triggerStop?: Date;

  initializer(entity: Trigger) { }

}
