import * as ebase from 'app/data/models/_entity-base';
import { Injectable } from '@angular/core';
import { AagtModule } from 'app/aagt/aagt.module';

export class TriggerTask extends ebase.SpEntityBase {
  sequence: number;
  taskId: number;
  triggerId: number;
  task: any;
  trigger: any;
}

@Injectable({
  providedIn: AagtModule
})
export class TriggerTaskMetadata extends ebase.MetadataBase<TriggerTask> {

  metadataFor = TriggerTask;

  constructor() {
    super('TriggerTask');
    this.entityDefinition.dataProperties.sequence = { dataType: this.dt.Int16, isNullable: false };

    Object.assign(this.entityDefinition.dataProperties, this.baseDataProperties);
  }

  initializer(entity: TriggerTask) { }

}

