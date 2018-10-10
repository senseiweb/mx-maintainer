import { Injectable } from '@angular/core';
import { EntityBase } from './_entity-base';
import { unwatchFile } from 'fs';


@Injectable({
  providedIn: 'root'
})
export class SpMetadata extends EntityBase {

  constructor() {
    super('__metadata');
    this.self = this;
    this.entityDefinition.defaultResourceName = undefined;
    this.entityDefinition.isComplexType = true;
    this.entityDefinition.shortName = this.shortName;
    this.entityDefinition.navigationProperties = undefined;
    this.entityDefinition.dataProperties.id = { dataType: this.dt.String };
    this.entityDefinition.dataProperties.uri = { dataType: this.dt.String };
    this.entityDefinition.dataProperties.etag = { dataType: this.dt.String };
    this.entityDefinition.dataProperties.type = { dataType: this.dt.String };
  }

  uri: string;
  etag: string;
  type: string;
}
