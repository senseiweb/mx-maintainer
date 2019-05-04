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
import { GenerationAsset } from './generation-asset';

@BzEntity(MxmAppName.Aagt, {
    shortName: SpListName.Asset
})
export class Asset extends SpEntityBase {
    @BzDataProp({
        spInternalName: 'Title',
        isNullable: false
    })
    alias: string;

    @BzDataProp()
    location: string;

    @BzDataProp()
    notes: string;

    @BzNavProp({ rt: SpListName.GenerationAsset })
    assetGenerations: GenerationAsset[];
}
