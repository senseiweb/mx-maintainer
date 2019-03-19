import { Injectable } from '@angular/core';
import { AagtDataModule } from '../aagt-data.module';
import * as ebase from 'app/global-data';

export class AagtSpMetadata {
    id: string;
    uri: string;
    etag: string;
    type: string;
}

@Injectable({
    providedIn: AagtDataModule
})
export class AagtSpMetadataMetadata extends ebase.MetadataBase<AagtSpMetadata> {
    metadataFor = AagtSpMetadata as any;

    constructor() {
        super('__metadata');
        this.entityDefinition.defaultResourceName = undefined;
        this.entityDefinition.isComplexType = true;
        this.entityDefinition.navigationProperties = undefined;
        this.entityDefinition.dataProperties.id = { dataType: this.dt.String };
        this.entityDefinition.dataProperties.uri = { dataType: this.dt.String };
        this.entityDefinition.dataProperties.etag = { dataType: this.dt.String };
        this.entityDefinition.dataProperties.type = { dataType: this.dt.String };
    }
}
