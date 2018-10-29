import * as ebase from 'app/data/models/_entity-base';
import { Injectable } from '@angular/core';

export enum MxAppEnum {
  aagt = 'aagt'
}

export type MxKnownFilters = 'createdByMe' | 'modifiedByMe';

export class MxFilterTag extends ebase.SpEntityBase {
  tagHandle: string;
  tagTitle: string;
  tagIcon: string;
  isFilter: boolean;
  appReference: MxAppEnum;
}

@Injectable({providedIn: 'root'})
export class MxmTagMetadata extends ebase.MetadataBase<MxFilterTag> {

  metadataFor = MxFilterTag;

  constructor() {
    super('MxFilterTag');
    this.entityDefinition.dataProperties.tagHandle = { dataType: this.dt.String };
    this.entityDefinition.dataProperties.tagTitle = { dataType: this.dt.String };
    this.entityDefinition.dataProperties.tagIcon = { dataType: this.dt.String };
    this.entityDefinition.dataProperties.isFilter = { dataType: this.dt.Boolean };
    this.entityDefinition.dataProperties.appReference = { dataType: this.dt.String };

    // this.entityDefinition.navigationProperties.Producer = {
    //   entityTypeName: ''
    // };
    Object.assign(this.entityDefinition.dataProperties, this.baseDataProperties);
  }
  initializer(entity: MxFilterTag) { }
}
