import * as ebase from 'app/data/models/_entity-base';
import { Injectable } from '@angular/core';
import { Team } from './team';
import { AagtModule } from 'app/aagt/aagt.module';

export class TeamAvailability extends ebase.SpEntityBase {
  availabilityTitle: string;
  teamId: number;
  availDateTime: Date;
  nonavailDateTime: Date;
  manHoursAvail: number;
  team: Team;
}

@Injectable({
  providedIn: AagtModule
})
export class TeamAvailabilityMetadata extends ebase.MetadataBase<TeamAvailability> {

  metadataFor = TeamAvailability;

  constructor() {
    super('TeamAvailability');
    this.entityDefinition.dataProperties.availabilityTitle = { dataType: this.dt.String, isNullable: false };
    this.entityDefinition.dataProperties.teamId = { dataType: this.dt.Int32, isNullable: false };
    this.entityDefinition.dataProperties.availDateTime = { dataType: this.dt.DateTime, isNullable: false};
    this.entityDefinition.dataProperties.nonavailDateTime = { dataType: this.dt.DateTime, isNullable: false };
    this.entityDefinition.dataProperties.manHoursAvail = { dataType: this.dt.Int32, isNullable: false };

    Object.assign(this.entityDefinition.dataProperties, this.baseDataProperties);
  }

  initializer(entity: TeamAvailability) { }

}
