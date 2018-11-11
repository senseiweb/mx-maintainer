import * as ebase from 'app/data/models/_entity-base';
import { GenerationAsset } from './generation-asset';
import { Injectable } from '@angular/core';
import { AagtModule } from 'app/aagt/aagt.module';
import * as aagtCfg from './sp-aagt-config';
import { AagtDataModule } from '../aagt-data.module';

export class Asset extends ebase.SpEntityBase {
    alias: string;
    notes: string;
    assetGenerations: GenerationAsset[];
}

@Injectable({ providedIn: AagtDataModule })
export class AssetMetadata extends ebase.MetadataBase<Asset> {
    metadataFor = Asset;

    constructor () {
        super(aagtCfg.AagtListName.Asset);
        this.entityDefinition.dataProperties.alias = { dataType: this.dt.String };
        this.entityDefinition.dataProperties.notes = { dataType: this.dt.String };

        this.entityDefinition.navigationProperties = {
            assetGenerations: {
                entityTypeName: 'GenerationAsset',
                isScalar: false,
                associationName: 'Asset_Generations'
            }
        };
        Object.assign(
            this.entityDefinition.dataProperties,
            this.baseDataProperties
        );
    }
}
