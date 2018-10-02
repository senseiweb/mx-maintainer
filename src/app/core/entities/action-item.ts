import { EntityBase } from './_entity-base';
import { Injectable } from '@angular/core';

@Injectable()
export class ActionItem extends EntityBase {
  shortName = 'ActionItem';
  constructor() {
    super();
    this.self = this;
    this.entityDefinition.shortName = this.shortName;
    this.entityDefinition.defaultResourceName = `/lists/getByTitle('${this.shortName}')/items`;
    this.entityDefinition.dataProperties.Action = { dataType: this.dt.String };
    this.entityDefinition.dataProperties.ShortCode = { dataType: this.dt.String };
    this.entityDefinition.dataProperties.Duration = { dataType: this.dt.Int16 };

    this.entityDefinition.navigationProperties.Producer = {
      entityTypeName: ''
    };


    Object.assign(this.entityDefinition.dataProperties, this.coreProperties);
  }

  title: string;

  initializer(entity: ActionItem) { }

}
