import { EntityBase } from './_entity-base';
import { Injectable } from '@angular/core';
import { Generation } from './generation';

@Injectable()
export class Trigger extends EntityBase {

   shortName = 'Trigger';

  constructor() {
    super();
    this.self = this;
    this.entityDefinition.shortName = this.shortName;
    this.entityDefinition.defaultResourceName = `/lists/getByTitle('${this.shortName}')/items`;
    this.entityDefinition.dataProperties.Milestone = { dataType: this.dt.String };
    this.entityDefinition.dataProperties.TriggerStart = { dataType: this.dt.DateTime };
    this.entityDefinition.dataProperties.TriggerStop = { dataType: this.dt.DateTime };
    this.entityDefinition.dataProperties.GenerationId = { dataType: this.dt.Int32, isNullable: false };


    Object.assign(this.entityDefinition.dataProperties, this.coreProperties);
  }

  milestone: string;
  generationOffset?: number;
  triggerStart?: Date;
  triggerStop?: Date;

  initializer(entity: Trigger) { }

}
