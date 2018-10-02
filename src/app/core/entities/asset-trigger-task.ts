import { EntityBase } from './_entity-base';
import { Injectable } from '@angular/core';

export type AssetStatus = 'FMC'|'PMC'|'NMC';

@Injectable()
export class AssetTriggerTask extends EntityBase {

  shortName = 'AssetTriggerTask';

  constructor() {
    super();
    this.self = this;
    this.entityDefinition.shortName = this.shortName;
    this.entityDefinition.defaultResourceName = `/lists/getByTitle('${this.shortName}')/items`;
    this.entityDefinition.dataProperties.Status = { dataType: this.dt.String };
    this.entityDefinition.dataProperties.SequenceNumber = { dataType: this.dt.Int16 };
    this.entityDefinition.dataProperties.PlannedStart = { dataType: this.dt.DateTime, isNullable: false };
    this.entityDefinition.dataProperties.PlannedStop = { dataType: this.dt.DateTime, isNullable: false };
    this.entityDefinition.dataProperties.ScheduledStart = { dataType: this.dt.DateTime, isNullable: false };
    this.entityDefinition.dataProperties.ScheduledStop = { dataType: this.dt.DateTime, isNullable: false };
    this.entityDefinition.dataProperties.ActualStart = { dataType: this.dt.DateTime, isNullable: false };
    this.entityDefinition.dataProperties.ActualStop = { dataType: this.dt.DateTime, isNullable: false };
    this.entityDefinition.dataProperties.AssetId = { dataType: this.dt.Int32, isNullable: false };
    this.entityDefinition.dataProperties.TriggerTaskId = { dataType: this.dt.Int32, isNullable: false };
    this.entityDefinition.dataProperties.TriggerId = { dataType: this.dt.Int32, isNullable: false };


    Object.assign(this.entityDefinition.dataProperties, this.coreProperties);
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
