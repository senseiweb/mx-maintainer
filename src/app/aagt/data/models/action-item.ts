import * as ebase from 'app/data/models/_entity-base';
import { Injectable } from '@angular/core';
import { AagtModule } from 'app/aagt/aagt.module';

export class ActionItem extends ebase.SpEntityBase {
  action: string;
  shortCode: string;
  duration: string;
}

@Injectable({providedIn: AagtModule})
export class ActionItemMetadata extends ebase.MetadataBase<ActionItem> {

  metadataFor = ActionItem;

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
