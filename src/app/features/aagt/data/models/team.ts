import { MxmAppName } from 'app/app-config.service';
import { BzEntity, BzProp, SpEntityBase } from 'app/global-data';
import * as _ from 'lodash';
import * as _m from 'moment';
import { TeamAvailability } from './team-availability';
import { TeamCategory } from './team-category';

@BzEntity(MxmAppName.Aagt, {})
export class Team extends SpEntityBase {
    readonly shortname = 'Team';

    /** Tuple to hold the memorized time calculation */
    totalAvailDuringGen: [string, number];

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

    calTotalAvailDuringGen = (start: Date, end: Date): number => {
        let teamAvails = 0;

        if (!start || !end || !this.teamAvailabilites.length) {
            return 0;
        }
        const cachedKey =
            start.toString() +
            end.toString() +
            this.teamAvailabilites.join('|');

        if (
            this.totalAvailDuringGen &&
            this.totalAvailDuringGen[0] === cachedKey
        ) {
            return this.totalAvailDuringGen[1];
        }

        console.time('Cal team avails');
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

        console.timeEnd('Cal team avails');

        this.totalAvailDuringGen = [cachedKey, teamAvails];
        return this.totalAvailDuringGen[1];
    }
}
