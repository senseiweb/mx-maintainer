import { Injectable } from '@angular/core';
import * as ebase from 'app/global-data';
import { AagtDataModule } from '../aagt-data.module';
import * as aagtCfg from './_aagt-feature-cfg';
import { TeamAvailability } from './team-availability';

export class Team extends ebase.SpEntityBase {
    teamName: string;
    teamType: string;
    numberOfTeamMembers: number;
    notes: string;
    teamAvailabilites: TeamAvailability[];
}

@Injectable({
    providedIn: AagtDataModule
})
export class TeamMetadata extends ebase.MetadataBase<Team> {
    metadataFor = Team;

    constructor() {
        super(aagtCfg.AagtListName.Team);
        this.entityDefinition.dataProperties.teamType = {
            dataType: this.dt.String,
            isNullable: false
        };
        this.entityDefinition.dataProperties.teamName = {
            dataType: this.dt.String,
            isNullable: false,
            spInternalName: 'Title'
        };
        this.entityDefinition.dataProperties.numberOfTeamMembers = {
            dataType: this.dt.Int16,
            isNullable: false
        };
        this.entityDefinition.dataProperties.notes = {
            dataType: this.dt.String
        };

        this.entityDefinition.navigationProperties = {
            teamAvailabilites: {
                entityTypeName: aagtCfg.AagtListName.TeamAvail,
                associationName: 'Team_TeamAvailabilities',
                isScalar: false
            }
        };

        Object.assign(
            this.entityDefinition.dataProperties,
            this.baseDataProperties
        );
    }
}
