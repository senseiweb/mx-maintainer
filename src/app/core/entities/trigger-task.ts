import * as ebase from './_entity-base';
import { Injectable } from '@angular/core';
import { Trigger } from './trigger';
import { Task  } from './task';

export class TriggerTask extends ebase.SpEntityBase {
  sequence: number;
  taskId: number;
  triggerId: number;
  task: Task;
  trigger: Trigger;
}

@Injectable({
  providedIn: 'root'
})
export class TriggerTaskMetadata extends ebase.MetadataBase {

  constructor() {
    super('TriggerTask');
    this.entityDefinition.dataProperties.shortCode = { dataType: this.dt.String, isNullable: false };
    this.entityDefinition.dataProperties.shortCode = { dataType: this.dt.String, isNullable: false };
    Object.assign(this.entityDefinition.dataProperties, this.baseDataProperties);
  }

  initializer(entity: TriggerTask) { }

}
