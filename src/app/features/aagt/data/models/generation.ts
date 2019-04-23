import { Injectable } from '@angular/core';
import { SpListName } from 'app/app-config.service';
import * as ebase from 'app/global-data';
import * as _ from 'lodash';
import { AagtDataModule } from '../aagt-data.module';
import { Asset } from './asset';
import { AssetTriggerAction } from './asset-trigger-action';
import { Assumption } from './assumption';
import { GenerationAsset } from './generation-asset';
import { Trigger } from './trigger';

export enum GenStatusEnum {
    Draft = 'Draft',
    Planned = 'Planned',
    Active = 'Active',
    Historical = 'Historical'
}

export interface IDraftAsset {
    priority: number;
    asset: Asset;
}

export class Generation extends ebase.SpEntityBase {
    title: string;
    isActive: boolean;
    iso: string;
    genStatus: GenStatusEnum;
    assignedAssetCount: number;
    genStartDate: Date;
    genEndDate: Date;
    // draftAssets: Map<number, IDraftAsset>;
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
        super(SpListName.Generation);

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
                entityTypeName: SpListName.Trigger,
                associationName: 'Generation_Triggers',
                isScalar: false
            },
            generationAssets: {
                entityTypeName: SpListName.GenerationAsset,
                associationName: 'Generation_Assets',
                isScalar: false
            }
        };

        Object.assign(
            this.entityDefinition.dataProperties,
            this.baseDataProperties
        );

        this.initializer = (_entity: Generation) => {
            // _entity.draftAssets = new Map();
            // _entity.generationAssets.forEach(ga => {
            //     _entity.draftAssets.set(ga.assetId, {
            //         priority: ga.mxPosition,
            //         asset: ga.asset
            //     });
            // });
        };
    }
}
