import { MxmAppName } from 'app/app-config.service';
import { BzEntity, BzProp, SpEntityBase } from 'app/global-data';
import * as _ from 'lodash';
import * as _m from 'moment';
import { Team } from './team';
export interface IJobReservation {
    taskId: number;
    jobStart: _m.Moment;
    jobEnd: _m.Moment;
}

@BzEntity(MxmAppName.Aagt, {})
export class TeamAvailability extends SpEntityBase {
    readonly shortname = 'TeamAvailability';

    @BzProp('data', {
        spInternalName: 'Title'
    })
    availabilityTitle: string;

    jobReservations: IJobReservation[] = [];

    get isFullyBooked(): boolean {
        const totalJobTime = _m.duration(0);
        const availShiftTime = _m.duration(this.manHoursAvail);
        this.jobReservations.forEach(jr => {
            const jobTime = _m.duration(jr.jobEnd.diff(jr.jobStart));
            totalJobTime.add(jobTime);
        });
        return availShiftTime.subtract(totalJobTime).asHours() < 1;
    }

    get jobResSerialize(): string {
        return JSON.stringify(this.jobReservations);
    }

    set jobResSerialize(serializeJob) {
        if (!serializeJob) {
            return;
        }
        const parsedJobRes = JSON.parse(serializeJob) as IJobReservation[];
        parsedJobRes.forEach(jr => {
            jr.jobStart = _m(jr.jobStart);
            jr.jobEnd = _m(jr.jobEnd);
        });
        this.jobReservations = [];
    }

    @BzProp('data', {
        dataCfg: { isNullable: false }
    })
    teamId: number;

    @BzProp('data', {})
    availStart: Date;

    nextAvail: _m.Moment;

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

    durationFromStart = (start: _m.Moment): number => {
        const availStart = this.nextAvail || _m(this.availStart);
        return _m
            .duration(availStart.diff(start))
            .abs()
            .asMinutes();
    }
}
