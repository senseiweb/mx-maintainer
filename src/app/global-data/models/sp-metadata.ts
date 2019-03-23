import { Injectable } from '@angular/core';
import { GlobalDataModule } from '../data.module';
import * as ebase from './_entity-base';

export class SpMetadata {
    id: string;
    uri: string;
    etag: string;
    type: string;
}

@Injectable({
    providedIn: GlobalDataModule
})
export class SpMetadataMetadata extends ebase.MetadataBase<SpMetadata> {
    metadataFor = SpMetadata as any;

    constructor() {
        super('__metadata');
        this.entityDefinition.namespace = 'SP.Data';
        this.entityDefinition.defaultResourceName = undefined;
        this.entityDefinition.isComplexType = true;
        this.entityDefinition.navigationProperties = undefined;
        this.entityDefinition.dataProperties.id = { dataType: this.dt.String };
        this.entityDefinition.dataProperties.uri = { dataType: this.dt.String };
        this.entityDefinition.dataProperties.etag = { dataType: this.dt.String };
        this.entityDefinition.dataProperties.type = { dataType: this.dt.String };
    }
}
