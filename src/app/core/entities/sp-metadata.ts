import * as ebase from './_entity-base';
import { Injectable } from '@angular/core';

export class SpMetadata extends ebase.SpEntityBase {
  uri: string;
  etag: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class SpMetadataMetadata extends ebase.MetadataBase {

  constructor() {
    super('__metadata');
    this.entityDefinition.defaultResourceName = undefined;
    this.entityDefinition.isComplexType = true;
    this.entityDefinition.navigationProperties = undefined;
    this.entityDefinition.dataProperties.uri = { dataType: this.dt.String };
    this.entityDefinition.dataProperties.etag = { dataType: this.dt.String };
    this.entityDefinition.dataProperties.type = { dataType: this.dt.String };
  }

}
