import * as ebase from './_entity-base';
import { Injectable } from '@angular/core';

export class Producer extends ebase.SpEntityBase {
  teamType: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProducerMetadata extends ebase.MetadataBase {

  constructor() {
    super('Producer');
    this.entityDefinition.dataProperties.teamType = { dataType: this.dt.String, isNullable: false };

    Object.assign(this.entityDefinition.dataProperties, this.baseDataProperties);
  }

  initializer(entity: Producer) { }

}
