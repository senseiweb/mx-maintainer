import { EntityBase } from './_entity-base';
import { Injectable } from '@angular/core';

@Injectable()
export class Producer extends EntityBase {

  shortName = 'Producer';

  constructor() {
    super();
    this.self = this;
    this.entityDefinition.shortName = this.shortName;
    this.entityDefinition.defaultResourceName = `/lists/getByTitle('${this.shortName}')/items`;
    this.entityDefinition.dataProperties.TeamType = { dataType: this.dt.String, isNullable: false };

    Object.assign(this.entityDefinition.dataProperties, this.coreProperties);
  }

  teamType: string;

  initializer(entity: Producer) { }

}
