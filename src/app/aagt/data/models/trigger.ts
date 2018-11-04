import * as ebase from 'app/data/models/_entity-base';
import { Injectable } from '@angular/core';
import { AagtModule } from 'app/aagt/aagt.module';

export class Trigger extends ebase.SpEntityBase {
    title: string;
    milestone: string;
    generationOffset?: number;
    triggerStart?: Date;
    triggerStop?: Date;
    generationId: number;
}

@Injectable({
    providedIn: AagtModule
})
export class TriggerMetadata extends ebase.MetadataBase<Trigger> {

    metadataFor = Trigger;

    constructor () {
        super('Trigger');
        this.entityDefinition.dataProperties.title = { dataType: this.dt.String };
        this.entityDefinition.dataProperties.milestone = { dataType: this.dt.String };
        this.entityDefinition.dataProperties.generationOffset = { dataType: this.dt.Int16 };
        this.entityDefinition.dataProperties.triggerStart = { dataType: this.dt.DateTime };
        this.entityDefinition.dataProperties.triggerStop = { dataType: this.dt.DateTime };
        this.entityDefinition.dataProperties.generationId = { dataType: this.dt.Int32, isNullable: false };


        Object.assign(this.entityDefinition.dataProperties, this.baseDataProperties);
    }
}
