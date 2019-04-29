import { Injectable } from '@angular/core';
import { MxmAppName, SpListName } from 'app/app-config.service';
import * as ebase from 'app/global-data';
import {
    BzDataProp,
    BzEntity,
    BzNavProp
} from 'app/global-data/models/_entity-decorators';
import { DataType } from 'breeze-client';
import { AagtDataModule } from '../aagt-data.module';
import { GenerationAsset } from './generation-asset';

@BzEntity(MxmAppName.Aagt, {
    shortName: SpListName.Asset
})
export class Asset extends ebase.SpEntityBase {
    @BzDataProp({
        spInternalName: 'Title',
        isNullable: false
    })
    alias: string;

    @BzDataProp()
    location: string;

    @BzDataProp()
    notes: string;

    @BzNavProp()
    assetGenerations: GenerationAsset[];
}

// @Injectable({ providedIn: AagtDataModule })
// export class AssetMetadata extends ebase.MetadataBase<Asset> {
//     metadataFor = Asset;

//     constructor() {
//         super(SpListName.Asset);
//         this.entityDefinition.dataProperties.alias = {
//             dataType: this.dt.String,
//             spInternalName: 'Title',
//             isNullable: false
//         };
//         this.entityDefinition.dataProperties.location = {
//             dataType: this.dt.String
//         };
//         this.entityDefinition.dataProperties.notes = {
//             dataType: this.dt.String
//         };

//         Object.assign(
//             this.entityDefinition.dataProperties,
//             this.baseDataProperties
//         );
//     }
// }
