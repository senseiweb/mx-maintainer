import { Injectable } from '@angular/core';
import { AagtModule } from 'app/aagt/aagt.module';
import * as ebase from 'app/data/models/_entity-base';
import { ActionItem } from './action-item';
import { Trigger } from './trigger';
import * as aagtCfg from './sp-aagt-config';
import { AagtDataModule } from '../aagt-data.module';

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
    providedIn: AagtDataModule
})
export class TriggerActionMetadata extends ebase.MetadataBase<TriggerAction> {

    metadataFor = TriggerAction;

    constructor () {
        super(aagtCfg.AagtListName.TriggerAct);
        this.entityDefinition.dataProperties.title = { dataType: this.dt.String, isNullable: false };
        this.entityDefinition.dataProperties.sequence = { dataType: this.dt.Int16, isNullable: false };
        this.entityDefinition.dataProperties.totalExecutionTime = { dataType: this.dt.Int16, isNullable: false };
        this.entityDefinition.dataProperties.averageExecutionTime = { dataType: this.dt.Int16, isNullable: false };
        this.entityDefinition.dataProperties.actionItemId = { dataType: this.dt.Int16, isNullable: false };
        this.entityDefinition.dataProperties.triggerId = { dataType: this.dt.Int16, isNullable: false };
        Object.assign(this.entityDefinition.dataProperties, this.baseDataProperties);
    }

}
