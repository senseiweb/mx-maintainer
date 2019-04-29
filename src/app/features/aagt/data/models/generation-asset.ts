import { Injectable } from '@angular/core';
import { MxmAppName, SpListName } from 'app/app-config.service';
import * as ebase from 'app/global-data';
import {
    BzDataProp,
    BzEntity,
    BzNavProp,
    BzValid_IsRequired
} from 'app/global-data/models/_entity-decorators';
import { DataType } from 'breeze-client';
import { AagtDataModule } from '../aagt-data.module';
import { Asset } from './asset';
import { AssetTriggerAction } from './asset-trigger-action';
import { Generation } from './generation';

export type AssetStatus = 'FMC' | 'PMC' | 'NMC' | 'UNKNOWN';

@BzEntity(MxmAppName.Aagt, { shortName: SpListName.GenerationAsset })
export class GenerationAsset extends ebase.SpEntityBase {
    @BzDataProp({
        spInternalName: 'Title'
    })
    health: AssetStatus;

    @BzDataProp()
    mxPosition: number;

    @BzNavProp<GenerationAsset>('assetId')
    asset: Asset;

    @BzNavProp<GenerationAsset>('generationId')
    generation: Generation;

    @BzDataProp()
    generationId: number;

    @BzDataProp()
    @BzValid_IsRequired
    assetId: number;

    @BzNavProp()
    assetTriggerActions: AssetTriggerAction[];
}

// @Injectable({
//     providedIn: AagtDataModule
// })
// export class GenerationAssetMetadata extends ebase.MetadataBase<
//     GenerationAsset
// > {
//     metadataFor = GenerationAsset;

//     constructor() {
//         super(SpListName.GenerationAsset);
//         this.entityDefinition.dataProperties.health = {
//             spInternalName: 'Title',
//             dataType: this.dt.String,
//             isNullable: false
//         };
//         this.entityDefinition.dataProperties.mxPosition = {
//             dataType: this.dt.Int16
//         };
//         this.entityDefinition.dataProperties.generationId = {
//             dataType: this.dt.Int16,
//             isNullable: false
//         };
//         this.entityDefinition.dataProperties.assetId = {
//             dataType: this.dt.Int16,
//             isNullable: false
//         };

//         this.entityDefinition.navigationProperties = {
//             asset: {
//                 entityTypeName: SpListName.Asset,
//                 foreignKeyNames: ['assetId'],
//                 associationName: 'Asset_Generations'
//             },
//             generation: {
//                 entityTypeName: SpListName.Generation,
//                 associationName: 'Generation_Assets',
//                 foreignKeyNames: ['generationId']
//             },
//             assetTriggerActions: {
//                 entityTypeName: SpListName.AssetTriggerAction,
//                 associationName: 'GenAsset_AssetTrigAction',
//                 isScalar: false
//             }
//         };

//         Object.assign(
//             this.entityDefinition.dataProperties,
//             this.baseDataProperties
//         );
//     }
// }
