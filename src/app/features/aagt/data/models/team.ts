import { MxmAppName } from 'app/app-config.service';
import { BzEntity, BzProp, SpEntityBase } from 'app/global-data';
import * as _ from 'lodash';
import * as _m from 'moment';
import { TeamAvailability } from './team-availability';
import { TeamCategory } from './team-category';

@BzEntity(MxmAppName.Aagt, {})
export class Team extends SpEntityBase {
    readonly shortname = 'Team';

    totalAvailDuringGen: number;

    @BzProp('data', { spInternalName: 'Title' })
    teamName: string;

    @BzProp('data', {})
    teamCategoryId: number;

    @BzProp('nav', {
        navCfg: {
            isScalar: true
        },
        relativeEntity: 'TeamCategory'
    })
    teamCategory: TeamCategory;

    @BzProp('data', {})
    numTeamMembers: number;

    @BzProp('data', {})
    notes: string;

    @BzProp('nav', {
        relativeEntity: 'TeamAvailability'
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
