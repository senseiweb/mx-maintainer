import { EntityBase, dt, baseDataProperties} from './_entity-base';
import { Injectable } from '@angular/core';
import { Producer } from './producer';
import { Trigger } from './trigger';
import { WorkShift } from './work-shift';

@Injectable({
  providedIn: 'root'
})
export class TriggerProductionCapability extends EntityBase {

  constructor() {
    super('TriggerProductionCapability');
    this.entityDefinition.dataProperties.notes = { dataType: dt.String, isNullable: true };
    this.entityDefinition.dataProperties.producerId = { dataType: dt.Int32, isNullable: false };
    this.entityDefinition.dataProperties.triggerId = { dataType: dt.Int32, isNullable: false};
    this.entityDefinition.dataProperties.workShiftId = { dataType: dt.Int32, isNullable: false };

    Object.assign(this.entityDefinition.dataProperties, baseDataProperties);
  }

  notes: string;
  producerId: number;
  triggerId: number;
  workShiftId: number;
  producer: Producer;
  trigger: Trigger;
  workShift: WorkShift;

  initializer(entity: TriggerProductionCapability) { }

}
