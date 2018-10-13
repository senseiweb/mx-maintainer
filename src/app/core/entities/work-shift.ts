import { EntityBase, dt, baseDataProperties} from './_entity-base';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WorkShift extends EntityBase {

  constructor() {
    super('WorkShift');
    this.entityDefinition.dataProperties.shortTitle = { dataType: dt.String };
    this.entityDefinition.dataProperties.teamsOnShift = { dataType: dt.Int16 };
    this.entityDefinition.dataProperties.shiftStart = { dataType: dt.Int16 };
    this.entityDefinition.dataProperties.shiftLength = { dataType: dt.Int16 };
    this.entityDefinition.dataProperties.shiftLayover = { dataType: dt.Int16 };

    Object.assign(this.entityDefinition.dataProperties, baseDataProperties);
  }

  shortTitle: string;
  teamsOnShift: number;
  shiftStart: number;
  shiftLength: number;
  shiftLayover: number;

  initializer(entity: WorkShift) { }

}
