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

    @BzDataProp({
        spInternalName: 'Title'
    })
    teamName: string;

    @BzDataProp()
    teamCategoryId: number;

    @BzNavProp<Team>({
        rt: SpListName.TeamCategory,
        fk: 'teamCategoryId'
    })
    teamCategory: TeamCategory;

    @BzDataProp()
    numTeamMembers: number;

    @BzDataProp()
    notes: string;

    @BzNavProp<Team>({
        rt: SpListName.TeamAvailability
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
