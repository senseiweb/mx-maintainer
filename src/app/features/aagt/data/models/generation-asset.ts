import * as ebase from 'app/global-data';
import { Injectable } from '@angular/core';
import { Asset } from './asset';
import { Generation } from './generation';
import * as aagtCfg from './_aagt-feature-cfg';
import { AagtDataModule } from '../aagt-data.module';
import { AssetTriggerAction } from './asset-trigger-action';

export type AssetStatus = 'FMC' | 'PMC' | 'NMC';

export class GenerationAsset extends ebase.SpEntityBase {
    health: AssetStatus;
    title: string;
    mxPosition: number;
    asset: Asset;
    generation: Generation;
    generationId: number;
    assetId: number;
    assetTriggerActions: AssetTriggerAction[];
}

@Injectable({
    providedIn: AagtDataModule
})
export class GenerationAssetMetadata extends ebase.MetadataBase<GenerationAsset> {
    metadataFor = GenerationAsset;

    constructor() {
        super(aagtCfg.AagtListName.GenAsset);
        this.entityDefinition.dataProperties.title = { dataType: this.dt.String, isNullable: false };
        this.entityDefinition.dataProperties.health = { dataType: this.dt.String };
        this.entityDefinition.dataProperties.mxPosition = { dataType: this.dt.Int16 };
        this.entityDefinition.dataProperties.generationId = { dataType: this.dt.Int16 };
        this.entityDefinition.dataProperties.assetId = { dataType: this.dt.Int16, isNullable: false };

        this.entityDefinition.navigationProperties = {
            asset: {
                entityTypeName: 'Asset',
                foreignKeyNames: ['assetId'],
                associationName: 'Asset_Generations'
            },
            generation: {
                entityTypeName: 'Generation',
                associationName: 'Generation_Assets',
                foreignKeyNames: ['generationId']
            },
            assetTriggerActions: {
                entityTypeName: 'AssetTriggerAction',
                associationName: 'GenAsset_AssetTrigAction',
                isScalar: false
            }
        };

        Object.assign(this.entityDefinition.dataProperties, this.baseDataProperties);
    }
}
