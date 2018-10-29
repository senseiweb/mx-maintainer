import * as ebase from 'app/data/models/_entity-base';
import { Injectable } from '@angular/core';
import { AagtModule } from 'app/aagt/aagt.module';
import { Trigger } from './trigger';
import { ActionItem } from './action-item';

export class TriggerAction extends ebase.SpEntityBase {
  title: string;
  sequence: number;
  totalExecutionTime: number;
  averageExecutionTime: number;
  actionItemId: number;
  triggerId: number;
  actionItem: ActionItem;
  trigger: Trigger;
}

@Injectable({
  providedIn: AagtModule
})
export class TriggerActionMetadata extends ebase.MetadataBase<TriggerAction> {

  metadataFor = TriggerAction;

  constructor() {
    super('TriggerAction');
    this.entityDefinition.dataProperties.title = { dataType: this.dt.String, isNullable: false };
    this.entityDefinition.dataProperties.sequence = { dataType: this.dt.Int16, isNullable: false };
    this.entityDefinition.dataProperties.totalExecutionTime = { dataType: this.dt.Int16, isNullable: false };
    this.entityDefinition.dataProperties.averageExecutionTime = { dataType: this.dt.Int16, isNullable: false };
    this.entityDefinition.dataProperties.actionItemId = { dataType: this.dt.Int16, isNullable: false };
    this.entityDefinition.dataProperties.triggerId = { dataType: this.dt.Int16, isNullable: false };
    Object.assign(this.entityDefinition.dataProperties, this.baseDataProperties);
  }

  initializer(entity: TriggerAction) { }

}

