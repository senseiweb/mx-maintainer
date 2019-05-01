import { Injectable } from '@angular/core';
import { GlobalDataModule } from '../data.module';
import * as ebase from './_entity-base';
import { BzEntity, BzDataProp } from './_entity-decorators';

@BzEntity('All', {
    shortName: 'SpMetadata',
    isComplexType: true
})
export class SpMetadata {
    @BzDataProp()
    id: string;
    @BzDataProp()
    uri: string;
    @BzDataProp()
    etag: string;
    @BzDataProp()
    type: string;
}

// @Injectable({
//     providedIn: GlobalDataModule
// })
// export class SpMetadataMetadata extends ebase.MetadataBase<SpMetadata> {
//     metadataFor = SpMetadata as any;

//     constructor() {
//         super('__metadata' as any);
//         this.entityDefinition.namespace = 'SP.Data';
//         this.entityDefinition.defaultResourceName = undefined;
//         this.entityDefinition.isComplexType = true;
//         this.entityDefinition.navigationProperties = undefined;
//         this.entityDefinition.dataProperties.id = { dataType: this.dt.String };
//         this.entityDefinition.dataProperties.uri = { dataType: this.dt.String };
//         this.entityDefinition.dataProperties.etag = {
//             dataType: this.dt.String
//         };
//         this.entityDefinition.dataProperties.type = {
//             dataType: this.dt.String
//         };
//     }
//}
