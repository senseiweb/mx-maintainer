import { EntityBase, dt, baseDataProperties} from './_entity-base';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Producer extends EntityBase {

  constructor() {
    super('Producer');
    this.entityDefinition.dataProperties.teamType = { dataType: dt.String, isNullable: false };

    Object.assign(this.entityDefinition.dataProperties, baseDataProperties);
  }

  teamType: string;

  initializer(entity: Producer) { }

}
