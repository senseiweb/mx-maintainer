import * as ebase from './_entity-base';
import { Injectable } from '@angular/core';
import { Producer  } from './producer';

export class Task extends ebase.SpEntityBase {
  shortCode: string;
  title: string;
  plannedDuration: number;
  notes: string;
  producerId: string;
  producer: Producer;
}

@Injectable({
  providedIn: 'root'
})
export class TaskMetadata extends ebase.MetadataBase {

  constructor() {
    super('Task');
    this.entityDefinition.dataProperties.shortCode = { dataType: this.dt.String, isNullable: false };
    this.entityDefinition.dataProperties.shortCode = { dataType: this.dt.String, isNullable: false };
    Object.assign(this.entityDefinition.dataProperties, this.baseDataProperties);
  }

  initializer(entity: Producer) { }

}
