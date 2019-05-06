import { Injectable } from '@angular/core';
import { MxmAppName, SpListName } from 'app/app-config.service';
import {
    BzProp,
    BzEntity,
    SpEntityBase,
} from 'app/global-data';
import { DataType } from 'breeze-client';
import * as _ from 'lodash';
import * as _m from 'moment';
import { AagtDataModule } from '../aagt-data.module';
import { TeamAvailability } from './team-availability';
import { TeamCategory } from './team-category';

@BzEntity(MxmAppName.Aagt, { shortName: SpListName.Team })
export class Team extends SpEntityBase {
    totalAvailDuringGen:  number;

    @BzProp('data', {spInternalName: 'Title'})
    teamName: string;

    @BzProp('data', {})
    teamCategoryId: number;


    @BzProp('nav', {
        navCfg: {
            isScalar: true
        },
        relativeEntity: SpListName.TeamCategory
    })
    teamCategory: TeamCategory;

    @BzProp('data', {})
    numTeamMembers: number;

    @BzProp('data', {})
    notes: string;
    
    @BzProp('nav', {
        relativeEntity: SpListName.TeamAvailability
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
