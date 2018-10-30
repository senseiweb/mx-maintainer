import * as ebase from './_entity-base';
import { Injectable } from '@angular/core';

export class SpMetadata {
  id: string;
  uri: string;
  etag: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class SpMetadataMetadata extends ebase.MetadataBase<SpMetadata> {

  metadataFor = SpMetadata as any;

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
