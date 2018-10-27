import * as ebase from 'app/data/models/_entity-base';
import { Injectable } from '@angular/core';

export enum MxAppEnum {
  aagt = 'aagt'
}

export type MxmTagFilter = 'createdByMe' | 'modifiedByMe';

export class MxmTag extends ebase.SpEntityBase {
  tagHandle: string;
  tagTitle: string;
  tagIcon: string;
  isFilter: boolean;
  supportedApp: MxAppEnum;
}

@Injectable({providedIn: 'root'})
export class MxmTagMetadata extends ebase.MetadataBase<MxmTag> {

  metadataFor = MxmTag;

  constructor() {
    super('MxmTags');
    this.entityDefinition.dataProperties.tagHandle = { dataType: this.dt.String };
    this.entityDefinition.dataProperties.tagTitle = { dataType: this.dt.String };
    this.entityDefinition.dataProperties.tagIcon = { dataType: this.dt.String };
    this.entityDefinition.dataProperties.isFilter = { dataType: this.dt.Boolean };
    this.entityDefinition.dataProperties.supportedApp = { dataType: this.dt.String };

    // this.entityDefinition.navigationProperties.Producer = {
    //   entityTypeName: ''
    // };
    Object.assign(this.entityDefinition.dataProperties, this.baseDataProperties);
  }
  initializer(entity: MxmTag) { }
}
