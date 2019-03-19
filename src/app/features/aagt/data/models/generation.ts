import * as ebase from 'app/global-data';
import { Injectable } from '@angular/core';
import { Assumption } from './assumption';
import { Trigger } from './trigger';
import { GenerationAsset } from './generation-asset';
import * as aagtCfg from './_aagt-feature-cfg';
import { AagtDataModule } from '../aagt-data.module';

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
    genStatus: genStatusEnum;
    assignedAssetCount: number;
    genStartDate: Date;
    genEndDate: Date;
    draftAssets: number[];
    assumptions: Assumption[];
    triggers: Trigger[];
    generationAssets: GenerationAsset[];
}

@Injectable({
    providedIn: AagtDataModule
})
export class GenerationMetadata extends ebase.MetadataBase<Generation> {
    metadataFor = Generation;

    constructor() {
        super(aagtCfg.AagtListName.Gen);

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
        this.entityDefinition.dataProperties.genStatus = {
            dataType: this.dt.String,
            isNullable: false
        };
        this.entityDefinition.dataProperties.assignedAssetCount = {
            dataType: this.dt.Int16,
            isNullable: false
        };
        this.entityDefinition.dataProperties.genStartDate = {
            dataType: this.dt.DateTime,
            isNullable: true
        };
        this.entityDefinition.dataProperties.genEndDate = {
            dataType: this.dt.DateTime
        };

        this.entityDefinition.navigationProperties = {
            triggers: {
                entityTypeName: aagtCfg.AagtListName.Trigger,
                associationName: 'Generation_Triggers',
                isScalar: false
            },
            generationAssets: {
                entityTypeName: aagtCfg.AagtListName.GenAsset,
                associationName: 'Generation_Assets',
                isScalar: false
            }
        };

        Object.assign(this.entityDefinition.dataProperties, this.baseDataProperties);
    }
}
