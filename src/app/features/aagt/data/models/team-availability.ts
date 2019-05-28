import { MxmAppName } from 'app/app-config.service';
import { BzEntity, BzProp, SpEntityBase } from 'app/global-data';
import * as _ from 'lodash';
import * as _m from 'moment';
import { Team } from './team';
import { TeamJobReservation } from './team-job-reservation';

@BzEntity(MxmAppName.Aagt, {})
export class TeamAvailability extends SpEntityBase {
    readonly shortname = 'TeamAvailability';

    @BzProp('data', {
        spInternalName: 'Title'
    })
    availabilityTitle: string;

    get isFullyBooked(): boolean {
        const availShiftTime = _m.duration(this.manHoursAvail, 'minutes');
        return availShiftTime.subtract(this.totalReservation).asHours() <= 1;
    }

    get totalReservation(): _m.Duration {
        const totalJobTime = _m.duration(0);
        if (!this.teamJobReservations) {
            return _m.duration(0);
        }
        this.teamJobReservations.forEach(jr => {
            const jobStart = _m(jr.reservationStart);
            const jobEnd = _m(jr.reservationEnd);
            totalJobTime.add(_m.duration(jobEnd.diff(jobStart)));
        });

        return totalJobTime;
    }

    @BzProp('data', {
        dataCfg: { isNullable: false }
    })
    teamId: number;

    @BzProp('data', {})
    availStart: Date;

    // nextAvail: _m.Moment;

    @BzProp('data', {})
    availEnd: Date;

    @BzProp('data', {})
    manHoursAvail: number;

    @BzProp('nav', {
        relativeEntity: 'Team',
        navCfg: {
            isScalar: true
        }
    })
    team: Team;

    @BzProp('nav', {
        relativeEntity: 'TeamJobReservation'
    })
    teamJobReservations: TeamJobReservation[];

    durationFromStart = (start: _m.Moment): number => {
        const availStart = _m(this.availStart);
        return _m
            .duration(availStart.diff(start))
            .abs()
            .asMinutes();
    }
}
