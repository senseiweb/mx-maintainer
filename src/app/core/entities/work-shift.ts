import { EntityBase } from './_entity-base';
import { Injectable } from '@angular/core';

@Injectable()
export class WorkShift extends EntityBase {

  shortName = 'WorkShift';

  constructor() {
    super();
    this.self = this;
    this.entityDefinition.shortName = this.shortName;
    this.entityDefinition.defaultResourceName = `/lists/getByTitle('${this.shortName}')/items`;
    this.entityDefinition.dataProperties.ShortTitle = { dataType: this.dt.String };
    this.entityDefinition.dataProperties.TeamsOnShift = { dataType: this.dt.Int16 };
    this.entityDefinition.dataProperties.ShiftStart = { dataType: this.dt.Int16 };
    this.entityDefinition.dataProperties.ShiftLength = { dataType: this.dt.Int16 };
    this.entityDefinition.dataProperties.ShiftLayover = { dataType: this.dt.Int16 };

    Object.assign(this.entityDefinition.dataProperties, this.coreProperties);
  }

  shortTitle: string;
  teamsOnShift: number;
  shiftStart: number;
  shiftLength: number;
  shiftLayover: number;

  initializer(entity: WorkShift) { }

}
