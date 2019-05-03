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
import { AagtDataModule } from '../aagt-data.module';
import { Asset } from './asset';
import { AssetTriggerAction } from './asset-trigger-action';
import { Generation } from './generation';

export type AssetStatus = 'FMC' | 'PMC' | 'NMC' | 'UNKNOWN';

@BzEntity(MxmAppName.Aagt, { shortName: SpListName.GenerationAsset })
export class GenerationAsset extends SpEntityBase {
    @BzDataProp({
        spInternalName: 'Title'
    })
    health: AssetStatus;

    @BzDataProp()
    mxPosition: number;

    @BzNavProp<GenerationAsset>({
        rt: 'Asset',
        fk: 'assetId'
    })
    asset: Asset;

    @BzNavProp<GenerationAsset>({
        rt: 'Generation',
        fk: 'generationId'
    })
    generation: Generation;

    @BzDataProp()
    generationId: number;

    @BzDataProp()
    @BzValid_IsRequired
    assetId: number;

    @BzNavProp({ rt: 'AssetTriggerAction' })
    assetTriggerActions: AssetTriggerAction[];
}
