import { Injectable } from '@angular/core';
import * as ebase from 'app/global-data';
import { EntityState } from 'breeze-client';
import { AagtDataModule } from '../aagt-data.module';
import * as aagtCfg from './_aagt-feature-cfg';
import { Asset } from './asset';
import { AssetTriggerAction } from './asset-trigger-action';
import { Generation } from './generation';

export type AssetStatus = 'FMC' | 'PMC' | 'NMC' | 'UNKNOWN';

export class GenerationAsset extends ebase.SpEntityBase {
    health: AssetStatus;
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
export class GenerationAssetMetadata extends ebase.MetadataBase<
    GenerationAsset
> {
    metadataFor = GenerationAsset;

    constructor() {
        super(aagtCfg.AagtListName.GenAsset);
        this.entityDefinition.dataProperties.health = {
            spInternalName: 'Title',
            dataType: this.dt.String,
            isNullable: false
        };
        this.entityDefinition.dataProperties.mxPosition = {
            dataType: this.dt.Int16
        };
        this.entityDefinition.dataProperties.generationId = {
            dataType: this.dt.Int16
        };
        this.entityDefinition.dataProperties.assetId = {
            dataType: this.dt.Int16,
            isNullable: false
        };

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

        Object.assign(
            this.entityDefinition.dataProperties,
            this.baseDataProperties
        );
    }
}
