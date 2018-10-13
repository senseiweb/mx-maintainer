import { EntityBase, dt, baseDataProperties } from './_entity-base';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ActionItem extends EntityBase {
  constructor() {
    super('ActionItem');
    this.entityDefinition.dataProperties.action = { dataType: dt.String };
    this.entityDefinition.dataProperties.shortCode = { dataType: dt.String };
    this.entityDefinition.dataProperties.duration = { dataType: dt.Int16 };

    // this.entityDefinition.navigationProperties.Producer = {
    //   entityTypeName: ''
    // };
    Object.assign(this.entityDefinition.dataProperties, baseDataProperties);
  }

  title: string;

  initializer(entity: ActionItem) { }

}
