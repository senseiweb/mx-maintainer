import { Injectable } from '@angular/core';
import * as ebase from 'app/global-data';
import * as _ from 'lodash';
import { AagtDataModule } from '../aagt-data.module';
import * as aagtCfg from './_aagt-feature-cfg';
import { AssetTriggerAction } from './asset-trigger-action';
import { Assumption } from './assumption';
import { GenerationAsset } from './generation-asset';
import { Trigger } from './trigger';

export enum GenStatusEnum {
    draft = 'Draft',
    planned = 'Planned',
    active = 'Active',
    historical = 'Historical'
}

export interface IDraftAsset {
    priority: number;
    id: number;
}

export class Generation extends ebase.SpEntityBase {
    title: string;
    isActive: boolean;
    iso: string;
    genStatus: GenStatusEnum;
    assignedAssetCount: number;
    genStartDate: Date;
    genEndDate: Date;
    draftAssets: IDraftAsset[];
    assumptions: Assumption[];
    triggers: Trigger[];
    generationAssets: GenerationAsset[];
    get assetTrigActions(): AssetTriggerAction[] {
        if (!this.generationAssets) {
            return;
        }
        return _.flatMap(this.generationAssets, x => x.assetTriggerActions);
    }
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
        this.entityDefinition.dataProperties.isActive = {
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

        Object.assign(
            this.entityDefinition.dataProperties,
            this.baseDataProperties
        );
    }
}
