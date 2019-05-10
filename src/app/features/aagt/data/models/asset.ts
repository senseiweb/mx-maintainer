import { Injectable } from '@angular/core';
import { MxmAppName, SpListName } from 'app/app-config.service';
import { BzEntity, BzProp, SpEntityBase } from 'app/global-data';
import { DataType } from 'breeze-client';
import { AagtDataModule } from '../aagt-data.module';
import { GenerationAsset } from './generation-asset';

@BzEntity(MxmAppName.Aagt, {
    shortName: SpListName.Asset
})
export class Asset extends SpEntityBase {
    readonly shortname = 'Asset';

    @BzProp('data', {
        dataCfg: { isNullable: false },
        spInternalName: 'Title'
    })
    alias: string;

    @BzProp('data', {})
    location: string;

    @BzProp('data', {})
    notes: string;

    @BzProp('nav', {
        relativeEntity: SpListName.GenerationAsset
    })
    assetGenerations: GenerationAsset[];
}
