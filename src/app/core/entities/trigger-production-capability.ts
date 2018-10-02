import { EntityBase } from './_entity-base';
import { Injectable } from '@angular/core';
import { Producer } from './producer';
import { Trigger } from './trigger';
import { WorkShift } from './work-shift';

@Injectable()
export class TriggerProductionCapability extends EntityBase {

  shortName = 'TriggerProductionCapability';

  constructor() {
    super();
    this.self = this;
    this.entityDefinition.shortName = this.shortName;
    this.entityDefinition.defaultResourceName = `/lists/getByTitle('${this.shortName}')/items`;
    this.entityDefinition.dataProperties.Notes = { dataType: this.dt.String, isNullable: true };
    this.entityDefinition.dataProperties.ProducerId = { dataType: this.dt.Int32, isNullable: false };
    this.entityDefinition.dataProperties.TriggerId = { dataType: this.dt.Int32, isNullable: false};
    this.entityDefinition.dataProperties.WorkShiftId = { dataType: this.dt.Int32, isNullable: false };

    Object.assign(this.entityDefinition.dataProperties, this.coreProperties);
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
