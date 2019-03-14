import * as ebase from 'app/global-data';
import { GenerationAsset } from './generation-asset';
import { Injectable } from '@angular/core';
import * as aagtCfg from './_aagt-feature-cfg';
import { AagtDataModule } from '../aagt-data.module';

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
            spInternalName: 'Title'
        };
        this.entityDefinition.dataProperties.location = { dataType: this.dt.String };
        this.entityDefinition.dataProperties.notes = { dataType: this.dt.String };

        Object.assign(this.entityDefinition.dataProperties, this.baseDataProperties);
    }
}
