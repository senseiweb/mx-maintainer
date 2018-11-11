import * as ebase from './_entity-base';
import { Injectable } from '@angular/core';
import { SpMetadata } from './sp-metadata';
import { Omit } from './_entity-base';

export class SpMultiLookup {
    __metadata: Omit<SpMetadata, 'uri' | 'etag'>;
    results: Array<number>;
}

@Injectable({
    providedIn: 'root'
})
export class SpMultiLookupMeta extends ebase.MetadataBase<SpMultiLookup> {

    metadataFor = SpMultiLookup as any;

    constructor() {
        super('spMultiLookup');
        this.entityDefinition.defaultResourceName = undefined;
        this.entityDefinition.isComplexType = true;
        this.entityDefinition.navigationProperties = undefined;
        this.entityDefinition.dataProperties.__metadata = {
            complexTypeName: '__metadata',
            dataType: undefined,
            isNullable: false
        };
        this.entityDefinition.dataProperties.results = { dataType: this.dt.Int16, hasMany: true };
    }

}
