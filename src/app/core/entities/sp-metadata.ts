import { Injectable } from '@angular/core';
import { EntityBase, dt } from './_entity-base';


@Injectable({
  providedIn: 'root'
})
export class SpMetadata extends EntityBase {

  constructor() {
    super('__metadata');
    this.entityDefinition.defaultResourceName = undefined;
    this.entityDefinition.isComplexType = true;
    this.entityDefinition.shortName = this.shortName;
    this.entityDefinition.navigationProperties = undefined;
    this.entityDefinition.dataProperties.id = { dataType: dt.String };
    this.entityDefinition.dataProperties.uri = { dataType: dt.String };
    this.entityDefinition.dataProperties.etag = { dataType: dt.String };
    this.entityDefinition.dataProperties.type = { dataType: dt.String };
  }

  uri: string;
  etag: string;
  type: string;
}
