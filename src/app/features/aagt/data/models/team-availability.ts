import { Injectable } from '@angular/core';
import * as ebase from 'app/global-data';
import { AagtDataModule } from '../aagt-data.module';
import * as aagtCfg from './_aagt-feature-cfg';
import { Team } from './team';

export class TeamAvailability extends ebase.SpEntityBase {
    availabilityTitle: string;
    teamId: number;
    availDateTime: Date;
    nonavailDateTime: Date;
    manHoursAvail: number;
    team: Team;
}

@Injectable({
    providedIn: AagtDataModule
})
export class TeamAvailabilityMetadata extends ebase.MetadataBase<
    TeamAvailability
> {
    metadataFor = TeamAvailability;

    constructor() {
        super(aagtCfg.AagtListName.TeamAvail);
        this.entityDefinition.dataProperties.availabilityTitle = {
            dataType: this.dt.String,
            isNullable: false
        };
        this.entityDefinition.dataProperties.teamId = {
            dataType: this.dt.Int32,
            isNullable: false
        };
        this.entityDefinition.dataProperties.availDateTime = {
            dataType: this.dt.DateTime,
            isNullable: false
        };
        this.entityDefinition.dataProperties.nonavailDateTime = {
            dataType: this.dt.DateTime,
            isNullable: false
        };
        this.entityDefinition.dataProperties.manHoursAvail = {
            dataType: this.dt.Int32,
            isNullable: false
        };

        this.entityDefinition.navigationProperties = {
            team: {
                entityTypeName: aagtCfg.AagtListName.Team,
                associationName: 'Team_TeamAvailabilities',
                foreignKeyNames: ['teamId']
            }
        };

        Object.assign(
            this.entityDefinition.dataProperties,
            this.baseDataProperties
        );
    }
}
