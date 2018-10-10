import { EntityBase } from './_entity-base';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ActionItem extends EntityBase {
  constructor() {
    super('ActionItem');
    this.self = this;
    this.entityDefinition.dataProperties.action = { dataType: this.dt.String };
    this.entityDefinition.dataProperties.shortCode = { dataType: this.dt.String };
    this.entityDefinition.dataProperties.duration = { dataType: this.dt.Int16 };

    // this.entityDefinition.navigationProperties.Producer = {
    //   entityTypeName: ''
    // };
    Object.assign(this.entityDefinition.dataProperties, this.coreProperties);
  }

  title: string;

  initializer(entity: ActionItem) { }

}
