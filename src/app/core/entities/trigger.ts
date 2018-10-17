import * as ebase from './_entity-base';
import { Injectable } from '@angular/core';

export class Trigger extends ebase.SpEntityBase {
  milestone: string;
  generationOffset?: number;
  triggerStart?: Date;
  triggerStop?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TriggerMetadata extends ebase.MetadataBase {

  constructor() {
    super('Trigger');
    this.entityDefinition.dataProperties.milestone = { dataType: this.dt.String };
    this.entityDefinition.dataProperties.triggerStart = { dataType: this.dt.DateTime };
    this.entityDefinition.dataProperties.triggerStop = { dataType: this.dt.DateTime };
    this.entityDefinition.dataProperties.generationId = { dataType: this.dt.Int32, isNullable: false };


    Object.assign(this.entityDefinition.dataProperties, this.baseDataProperties);
  }

  initializer(entity: Trigger) { }
}
