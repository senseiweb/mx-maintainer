import { Injectable } from '@angular/core';
import { MxmAppName, SpListName } from 'app/app-config.service';
import {
    BzDataProp,
    BzEntity,
    BzNavProp,
    BzValid_IsRequired,
    SpEntityBase
} from 'app/global-data';
import { DataType } from 'breeze-client';
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

@BzEntity(MxmAppName.Aagt, { shortName: SpListName.Generation })
export class Generation extends SpEntityBase {
    @BzDataProp()
    title: string;

    @BzDataProp()
    isActive: boolean;

    @BzDataProp()
    iso: string;

    @BzDataProp({
        dataType: DataType.String
    })
    genStatus: GenStatusEnum;

    @BzDataProp()
    assignedAssetCount: number;

    @BzDataProp()
    genStartDate: Date;

    @BzDataProp()
    genEndDate: Date;

    assumptions: Assumption[];

    @BzNavProp({ rt: SpListName.Trigger })
    triggers: Trigger[];

    @BzNavProp({ rt: SpListName.GenerationAsset })
    generationAssets: GenerationAsset[];

    get assetTrigActions(): AssetTriggerAction[] {
        if (!this.generationAssets) {
            return;
        }
        return _.flatMap(this.generationAssets, x => x.assetTriggerActions);
    }
}
