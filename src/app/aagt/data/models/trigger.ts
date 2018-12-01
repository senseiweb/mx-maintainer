import * as ebase from 'app/data/models/_entity-base';
import { Injectable } from '@angular/core';
import { AagtModule } from 'app/aagt/aagt.module';
import * as aagtCfg from './sp-aagt-config';
import { AagtDataModule } from '../aagt-data.module';
import { TriggerAction } from './trigger-action';
import { Generation } from './generation';

export class Trigger extends ebase.SpEntityBase {
    title: string;
    milestone: string;
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
                entityTypeName: 'Generation',
                associationName: 'Generation_Triggers'
            }
        };

        this.entityDefinition.navigationProperties = {
            triggerActions: {
                entityTypeName: 'TriggerAction',
                associationName: 'Trigger_Actions',
                isScalar: false
            }
        };

        Object.assign(this.entityDefinition.dataProperties, this.baseDataProperties);
    }
}
