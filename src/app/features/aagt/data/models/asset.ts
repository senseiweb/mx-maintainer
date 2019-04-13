import { Injectable } from '@angular/core';
import * as ebase from 'app/global-data';
import { AagtDataModule } from '../aagt-data.module';
import * as aagtCfg from './_aagt-feature-cfg';
import { GenerationAsset } from './generation-asset';

export class Asset extends ebase.SpEntityBase {
    alias: string;
    location: string;
    notes: string;
    assetGenerations: GenerationAsset[];
}

@Injectable({ providedIn: AagtDataModule })
export class AssetMetadata extends ebase.MetadataBase<Asset> {
    metadataFor = Asset;

    constructor() {
        super(aagtCfg.AagtListName.Asset);
        this.entityDefinition.dataProperties.alias = {
            dataType: this.dt.String,
            spInternalName: 'Title',
            isNullable: false
        };
        this.entityDefinition.dataProperties.location = {
            dataType: this.dt.String
        };
        this.entityDefinition.dataProperties.notes = {
            dataType: this.dt.String
        };

        Object.assign(
            this.entityDefinition.dataProperties,
            this.baseDataProperties
        );
    }
}
