import { EntityBase } from './_entity-base';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Producer extends EntityBase {

  constructor() {
    super('Producer');
    this.self = this;
    this.entityDefinition.dataProperties.teamType = { dataType: this.dt.String, isNullable: false };

    Object.assign(this.entityDefinition.dataProperties, this.coreProperties);
  }

  teamType: string;

  initializer(entity: Producer) { }

}
