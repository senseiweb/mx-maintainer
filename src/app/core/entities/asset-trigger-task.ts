import { EntityBase, dt, baseDataProperties} from './_entity-base';
import { Injectable } from '@angular/core';

export type AssetStatus = 'FMC'|'PMC'|'NMC';

@Injectable({
  providedIn: 'root'
})
export class AssetTriggerTask extends EntityBase {

  constructor() {
    super('AssetTriggerTask');
    this.entityDefinition.dataProperties.status = { dataType: dt.String };
    this.entityDefinition.dataProperties.sequenceNumber = { dataType: dt.Int16 };
    this.entityDefinition.dataProperties.plannedStart = { dataType: dt.DateTime, isNullable: false };
    this.entityDefinition.dataProperties.plannedStop = { dataType: dt.DateTime, isNullable: false };
    this.entityDefinition.dataProperties.scheduledStart = { dataType: dt.DateTime, isNullable: false };
    this.entityDefinition.dataProperties.scheduledStop = { dataType: dt.DateTime, isNullable: false };
    this.entityDefinition.dataProperties.actualStart = { dataType: dt.DateTime, isNullable: false };
    this.entityDefinition.dataProperties.actualStop = { dataType: dt.DateTime, isNullable: false };
    this.entityDefinition.dataProperties.assetId = { dataType: dt.Int32, isNullable: false };
    this.entityDefinition.dataProperties.triggerTaskId = { dataType: dt.Int32, isNullable: false };
    this.entityDefinition.dataProperties.triggerId = { dataType: dt.Int32, isNullable: false };


    Object.assign(this.entityDefinition.dataProperties, baseDataProperties);
  }

  status: AssetStatus;
  sequenceNumber: number;
  plannedStart: Date;
  plannedStop: Date;
  scheduledStart: Date;
  scheduledStop: Date;
  actualStart: Date;
  actualStop: Date;
  assetId: number;
  triggerTaskId: number;
  triggerId: number;

  initializer(entity: AssetTriggerTask) { }

}
