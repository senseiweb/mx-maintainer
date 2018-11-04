import * as ebase from 'app/data/models/_entity-base';
import { Injectable } from '@angular/core';
import { AagtModule } from 'app/aagt/aagt.module';
import { TeamAvailability } from './team-availability';

export class Team extends ebase.SpEntityBase {
    teamName: string;
    teamType: string;
    numberOfTeamMembers: number;
    notes: string;
    teamAvailabilites: Array<TeamAvailability>;
}

@Injectable({
    providedIn: AagtModule
})
export class TeamMetadata extends ebase.MetadataBase<Team> {

    metadataFor = Team;

    constructor () {
        super('Team');
        this.entityDefinition.dataProperties.teamType = { dataType: this.dt.String, isNullable: false };
        this.entityDefinition.dataProperties.teamName = { dataType: this.dt.String, isNullable: false };
        this.entityDefinition.dataProperties.numberOfTeamMembers = { dataType: this.dt.Int16, isNullable: false };
        this.entityDefinition.dataProperties.notes = { dataType: this.dt.String };

        Object.assign(this.entityDefinition.dataProperties, this.baseDataProperties);
    }
}
