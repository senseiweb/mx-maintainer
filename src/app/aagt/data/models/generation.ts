import * as ebase from 'app/data/models/_entity-base';
import { Injectable } from '@angular/core';
import { Assumption } from './assumption';
import { Trigger } from './trigger';
import { AagtModule } from 'app/aagt/aagt.module';
import { GenerationAsset } from './generation-asset';

export enum genStatusEnum {
    draft = 'Draft',
    planned = 'Planned',
    active = 'Active',
    historical = 'Historical'
}

export class Generation extends ebase.SpEntityBase {
    title: string;
    active: boolean;
    iso: string;
    status: genStatusEnum;
    numberAssetsRequired: number;
    startDateTime: Date;
    stopDateTime: Date;
    draftAssets: Array<number>;
    assumptions: Array<Assumption>;
    triggers: Array<Trigger>;
    generationAssets: Array<GenerationAsset>;
}


@Injectable({
    providedIn: AagtModule
  })
export class GenerationMetadata extends ebase.MetadataBase<Generation> {

    metadataFor = Generation;

    constructor() {
        super('Generation');

        this.entityDefinition.dataProperties.title = {
            dataType: this.dt.String,
            isNullable: false
        };
        this.entityDefinition.dataProperties.active = {
            dataType: this.dt.Boolean,
            isNullable: false
        };
        this.entityDefinition.dataProperties.iso = {
            dataType: this.dt.String,
            isNullable: true
        };
        this.entityDefinition.dataProperties.status = {
            dataType: this.dt.String,
            isNullable: false,
        };
        this.entityDefinition.dataProperties.numberAssetsRequired = {
            dataType: this.dt.Int16,
            isNullable: false
        };
        this.entityDefinition.dataProperties.startDateTime = {
            dataType: this.dt.DateTime,
            isNullable: true
        };
        this.entityDefinition.dataProperties.stopDateTime = {
            dataType: this.dt.DateTime
        };
        this.entityDefinition.navigationProperties = {
            generationAssets: {
                entityTypeName: 'GenerationAsset',
                associationName: 'Generation_Assets',
                isScalar: false
            }
        };
        Object.assign(this.entityDefinition.dataProperties, this.baseDataProperties);
    }
    initializer(entity: Generation) { }
}
