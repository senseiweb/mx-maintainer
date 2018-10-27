import * as ebase from 'app/data/models/_entity-base';
import { Injectable } from '@angular/core';
import { AagtModule } from 'app/aagt/aagt.module';

export class Producer extends ebase.SpEntityBase {
  teamType: string;
}

@Injectable({
  providedIn: AagtModule
})
export class ProducerMetadata extends ebase.MetadataBase<Producer> {

  metadataFor = Producer;

  constructor() {
    super('Producer');
    this.entityDefinition.dataProperties.teamType = { dataType: this.dt.String, isNullable: false };

    Object.assign(this.entityDefinition.dataProperties, this.baseDataProperties);
  }

  initializer(entity: Producer) { }

}
