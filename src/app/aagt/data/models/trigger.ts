import * as ebase from 'app/data/models/_entity-base';
import { Injectable } from '@angular/core';
import { AagtModule } from 'app/aagt/aagt.module';
import * as aagtCfg from './sp-aagt-config';
import { AagtDataModule } from '../aagt-data.module';
import { TriggerAction, ITriggerActionItemShell } from './trigger-action';
import { Generation } from './generation';

export class Trigger extends ebase.SpEntityBase {
    title: string;
    milestone: string;
    get completionTime(): number {
        if (!this.triggerActions) { return; }
        return this.triggerActions
            .map(tra => tra.actionItem.duration)
            .reduce((duration1, duration2) => duration1 + duration2, 0);
    }
    generationOffset?: number;
    triggerStart?: Date;
    triggerStop?: Date;
    generationId: number;
    generation: Generation;
    triggerActions: TriggerAction[];
}

@Injectable({
    providedIn: AagtDataModule
})
export class TriggerMetadata extends ebase.MetadataBase<Trigger> {

    metadataFor = Trigger;

    constructor () {
        super(aagtCfg.AagtListName.Trigger);
        this.entityDefinition.dataProperties.title = { dataType: this.dt.String };
        this.entityDefinition.dataProperties.milestone = { dataType: this.dt.String };
        this.entityDefinition.dataProperties.generationOffset = { dataType: this.dt.Int16 };
        this.entityDefinition.dataProperties.triggerStart = { dataType: this.dt.DateTime };
        this.entityDefinition.dataProperties.triggerStop = { dataType: this.dt.DateTime };
        this.entityDefinition.dataProperties.generationId = { dataType: this.dt.Int32, isNullable: false };

        this.entityDefinition.navigationProperties = {
            generation: {
                entityTypeName: aagtCfg.AagtListName.Gen,
                associationName: 'Generation_Triggers',
                foreignKeyNames: ['generationId']
            },
            triggerActions: {
                entityTypeName: aagtCfg.AagtListName.TriggerAct,
                associationName: 'Trigger_Action',
                isScalar: false
            }
        };

        Object.assign(this.entityDefinition.dataProperties, this.baseDataProperties);
    }
}
