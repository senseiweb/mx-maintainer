import * as ebase from './_entity-base';
import { Injectable } from '@angular/core';


export class AssetTriggerTask extends ebase.SpEntityBase {
  sequenceNumber: number;
  currentStatus: 'In-progress' | 'Scheduled' | 'Rescheduled' | 'Delayed';
  outcome: 'PCW' | 'On-time' | 'Under-time' | 'Over-time' | 'Blamed';
  plannedStart: Date;
  plannedStop: Date;
  scheduledStart: Date;
  scheduledStop: Date;
  actualStart: Date;
  actualStop: Date;
  assetId: number;
  triggerTaskId: number;
  triggerId: number;
}

@Injectable({
  providedIn: 'root'
})
export class AssetTriggerTaskMetadata extends ebase.MetadataBase {

  constructor() {
    super('AssetTriggerTask');
    this.entityDefinition.dataProperties.status = { dataType: this.dt.String };
    this.entityDefinition.dataProperties.sequenceNumber = { dataType: this.dt.Int16 };
    this.entityDefinition.dataProperties.plannedStart = { dataType: this.dt.DateTime, isNullable: false };
    this.entityDefinition.dataProperties.plannedStop = { dataType: this.dt.DateTime, isNullable: false };
    this.entityDefinition.dataProperties.scheduledStart = { dataType: this.dt.DateTime, isNullable: false };
    this.entityDefinition.dataProperties.scheduledStop = { dataType: this.dt.DateTime, isNullable: false };
    this.entityDefinition.dataProperties.actualStart = { dataType: this.dt.DateTime, isNullable: false };
    this.entityDefinition.dataProperties.actualStop = { dataType: this.dt.DateTime, isNullable: false };
    this.entityDefinition.dataProperties.assetId = { dataType: this.dt.Int32, isNullable: false };
    this.entityDefinition.dataProperties.triggerTaskId = { dataType: this.dt.Int32, isNullable: false };
    this.entityDefinition.dataProperties.triggerId = { dataType: this.dt.Int32, isNullable: false };


    Object.assign(this.entityDefinition.dataProperties, this.baseDataProperties);
  }

  initializer(entity: AssetTriggerTask) { }

}
