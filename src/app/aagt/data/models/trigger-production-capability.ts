import * as ebase from 'app/data/models/_entity-base';
import { Injectable } from '@angular/core';
import { Producer } from './producer';
import { Trigger } from './trigger';
import { WorkShift } from './work-shift';
import { AagtModule } from 'app/aagt/aagt.module';

export class TriggerProductionCapability extends ebase.SpEntityBase {
  notes: string;
  producerId: number;
  triggerId: number;
  workShiftId: number;
  producer: Producer;
  trigger: Trigger;
  workShift: WorkShift;
}

@Injectable({
  providedIn: AagtModule
})
export class TriggerProductionCapabilityMetadata extends ebase.MetadataBase<TriggerProductionCapability> {

  metadataFor = TriggerProductionCapability;

  constructor() {
    super('TriggerProductionCapability');
    this.entityDefinition.dataProperties.notes = { dataType: this.dt.String, isNullable: true };
    this.entityDefinition.dataProperties.producerId = { dataType: this.dt.Int32, isNullable: false };
    this.entityDefinition.dataProperties.triggerId = { dataType: this.dt.Int32, isNullable: false};
    this.entityDefinition.dataProperties.workShiftId = { dataType: this.dt.Int32, isNullable: false };

    Object.assign(this.entityDefinition.dataProperties, this.baseDataProperties);
  }

  initializer(entity: TriggerProductionCapability) { }

}
