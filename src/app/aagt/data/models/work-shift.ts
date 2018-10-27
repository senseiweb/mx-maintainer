import * as ebase from 'app/data/models/_entity-base';
import { Injectable } from '@angular/core';
import { AagtModule } from 'app/aagt/aagt.module';

export class WorkShift extends ebase.SpEntityBase {
  shortTitle: string;
  teamsOnShift: number;
  shiftStart: number;
  shiftLength: number;
  shiftLayover: number;
}

@Injectable({
  providedIn: AagtModule
})
export class WorkShiftMetadata extends ebase.MetadataBase<WorkShift> {

  metadataFor = WorkShift;

  constructor() {
    super('WorkShift');
    this.entityDefinition.dataProperties.shortTitle = { dataType: this.dt.String };
    this.entityDefinition.dataProperties.teamsOnShift = { dataType: this.dt.Int16 };
    this.entityDefinition.dataProperties.shiftStart = { dataType: this.dt.Int16 };
    this.entityDefinition.dataProperties.shiftLength = { dataType: this.dt.Int16 };
    this.entityDefinition.dataProperties.shiftLayover = { dataType: this.dt.Int16 };

    Object.assign(this.entityDefinition.dataProperties, this.baseDataProperties);
  }

  initializer(entity: WorkShift) { }

}
