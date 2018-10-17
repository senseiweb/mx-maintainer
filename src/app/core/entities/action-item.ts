import * as ebase from './_entity-base';
import { Injectable } from '@angular/core';

export class ActionItem extends ebase.SpEntityBase {
  action: string;
  shortCode: string;
  duration: string;
}

@Injectable({
  providedIn: 'root'
})
export class ActionItemMetadata extends ebase.MetadataBase {

  constructor() {
    super('ActionItem');
    this.entityDefinition.dataProperties.action = { dataType: this.dt.String };
    this.entityDefinition.dataProperties.shortCode = { dataType: this.dt.String };
    this.entityDefinition.dataProperties.duration = { dataType: this.dt.Int16 };

    // this.entityDefinition.navigationProperties.Producer = {
    //   entityTypeName: ''
    // };
    Object.assign(this.entityDefinition.dataProperties, this.baseDataProperties);
  }
  initializer(entity: ActionItem) { }
}
