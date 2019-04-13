import { Injectable } from '@angular/core';
import * as ebase from 'app/global-data';
import * as _ from 'lodash';
import * as _m from 'moment';
import { AagtDataModule } from '../aagt-data.module';
import * as aagtCfg from './_aagt-feature-cfg';
import { IJobReservation, TeamAvailability } from './team-availability';
import { TeamCategory } from './team-category';

export class Team extends ebase.SpEntityBase {
    teamName: string;
    teamCategoryId: number;
    teamCategory: TeamCategory;
    numTeamMembers: number;
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
        this.entityDefinition.dataProperties.teamCategoryId = {
            dataType: this.dt.String,
            isNullable: false
        };
        this.entityDefinition.dataProperties.teamName = {
            dataType: this.dt.String,
            isNullable: false,
            spInternalName: 'Title'
        };
        this.entityDefinition.dataProperties.numTeamMembers = {
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
            },

            teamCategory: {
                entityTypeName: aagtCfg.AagtListName.TeamCategory,
                associationName: 'TeamCategory_Teams',
                foreignKeyNames: ['teamCategoryId']
            }
        };

        Object.assign(
            this.entityDefinition.dataProperties,
            this.baseDataProperties
        );
    }
}
