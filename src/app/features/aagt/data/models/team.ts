import { Injectable } from '@angular/core';
import { MxmAppName, SpListName } from 'app/app-config.service';
import {
    BzDataProp,
    BzEntity,
    BzNavProp,
    BzValid_IsRequired,
    SpEntityBase
} from 'app/global-data';
import { DataType } from 'breeze-client';
import * as _ from 'lodash';
import * as _m from 'moment';
import { AagtDataModule } from '../aagt-data.module';
import { TeamAvailability } from './team-availability';
import { TeamCategory } from './team-category';

@BzEntity(MxmAppName.Aagt, { shortName: SpListName.Team })
export class Team extends SpEntityBase {
    totalAvailDuringGen: number;

    @BzDataProp()
    teamName: string;

    @BzDataProp()
    teamCategoryId: number;

    @BzNavProp<Team>({
        rt: 'TeamCategory',
        fk: 'teamCategoryId'
    })
    teamCategory: TeamCategory;

    @BzDataProp()
    numTeamMembers: number;

    @BzDataProp()
    notes: string;

    @BzNavProp<Team>({
        rt: 'TeamAvailability'
    })
    teamAvailabilites: TeamAvailability[];

    calTotalAvailDuringGen = (start: Date, end: Date) => {
        let teamAvails = 0;

        this.teamAvailabilites
            .filter(
                ta =>
                    _m(ta.availStart).isBetween(start, end) ||
                    _m(ta.availEnd).isBetween(start, end)
            )
            .forEach(avail => {
                const tickStart = _m(avail.availStart).isBefore(start)
                    ? start
                    : avail.availStart;
                const tickEnd = _m(avail.availEnd).isAfter(end)
                    ? end
                    : avail.availEnd;

                teamAvails += _m(tickEnd).diff(tickStart, 'minute');
            });
        this.totalAvailDuringGen = teamAvails;
    }
}

// @Injectable({
//     providedIn: AagtDataModule
// })
// export class TeamMetadata extends ebase.MetadataBase<Team> {
//     metadataFor = Team;

//     constructor() {
//         super(SpListName.Team);
//         this.entityDefinition.dataProperties.teamCategoryId = {
//             dataType: this.dt.Int16,
//             isNullable: false
//         };
//         this.entityDefinition.dataProperties.teamName = {
//             dataType: this.dt.String,
//             isNullable: false,
//             spInternalName: 'Title'
//         };
//         this.entityDefinition.dataProperties.numTeamMembers = {
//             dataType: this.dt.Int16,
//             isNullable: false
//         };
//         this.entityDefinition.dataProperties.notes = {
//             dataType: this.dt.String
//         };

//         this.entityDefinition.navigationProperties = {
//             teamAvailabilites: {
//                 entityTypeName: SpListName.TeamAvailability,
//                 associationName: 'Team_TeamAvailabilities',
//                 isScalar: false
//             },

//             teamCategory: {
//                 entityTypeName: SpListName.TeamCategory,
//                 associationName: 'TeamCategory_Teams',
//                 foreignKeyNames: ['teamCategoryId']
//             }
//         };

//         Object.assign(
//             this.entityDefinition.dataProperties,
//             this.baseDataProperties
//         );
//     }
// }
