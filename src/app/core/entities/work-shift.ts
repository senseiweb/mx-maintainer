import { EntityBase } from './_entity-base';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WorkShift extends EntityBase {

  constructor() {
    super('WorkShift');
    this.self = this;
    this.entityDefinition.dataProperties.shortTitle = { dataType: this.dt.String };
    this.entityDefinition.dataProperties.teamsOnShift = { dataType: this.dt.Int16 };
    this.entityDefinition.dataProperties.shiftStart = { dataType: this.dt.Int16 };
    this.entityDefinition.dataProperties.shiftLength = { dataType: this.dt.Int16 };
    this.entityDefinition.dataProperties.shiftLayover = { dataType: this.dt.Int16 };

    Object.assign(this.entityDefinition.dataProperties, this.coreProperties);
  }

  shortTitle: string;
  teamsOnShift: number;
  shiftStart: number;
  shiftLength: number;
  shiftLayover: number;

  initializer(entity: WorkShift) { }

}
