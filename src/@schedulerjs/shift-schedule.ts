import * as _ from 'lodash';
import * as _m from 'moment';
import { OverLapJobResError } from './utils';

export interface IJobReservation {
    taskId: string;
    jobStart: _m.Moment;
    jobEnd: _m.Moment;
}

export class ShiftSchedule {
    workableHours: _m.Duration;
    private jobReservations: Array<{
        taskId: string;
        jobStart: _m.Moment;
        jobEnd: _m.Moment;
        unavailDuration: _m.Duration;
    }> = [];
    constructor(
        public readonly start: _m.Moment,
        public readonly end: _m.Moment,
        workHours: number,
        private isNotReservable: boolean
    ) {
        this.workableHours = workHours
            ? _m.duration(workHours, 'minutes')
            : _m.duration(end.diff(start));
    }

    addJobReservation(
        taskId: string,
        jobStart: _m.Moment,
        jobEnd: _m.Moment
    ): void {
        try {
            if (!this.isNotReservable) {
                this.isValidJobReservation(taskId, jobStart, jobEnd);
            }
        } catch (e) {
            throw e;
        }
        const unavailDuration = _m.duration(jobEnd.diff(jobStart));
        console.log(this.jobReservations);
        this.jobReservations.push({
            taskId,
            jobStart,
            jobEnd,
            unavailDuration
        });
        this.jobReservations = this.sort();
    }

    get availTimeOnShift(): _m.Duration {
        const calTotalUsed = _m.duration(0);
        const totalUsed = this.jobReservations.reduce((accumlator, curr) => {
            accumlator.add(curr.unavailDuration);
            return accumlator;
        }, calTotalUsed);
        return this.workableHours.clone().subtract(totalUsed);
    }

    get isBookedUp(): boolean {
        return !this.isNotReservable && this.availTimeOnShift.asHours() < 1;
    }

    private isValidJobReservation(
        taskId: string,
        tentativeJobStart: _m.Moment,
        tentativeJobEnd: _m.Moment
    ) {
        const existing = this.jobReservations.find(
            x =>
                tentativeJobStart.isBetween(x.jobStart, x.jobEnd) ||
                tentativeJobEnd.isBetween(x.jobStart, x.jobEnd)
        );
        if (existing) {
            throw new OverLapJobResError(
                taskId,
                `Cannot schedule task
            ${taskId} due to scheduling overlapping
            conflict ${existing.taskId}`
            );
        }
    }

    get lastScheduleReservation(): IJobReservation {
        const jobres = this.sort();
        return {} || jobres[jobres.length - 1];
    }

    private sort(rev = false): any[] {
        return _.orderBy(
            this.jobReservations,
            x => x.jobStart.format('x'),
            rev ? ['asc'] : ['desc']
        );
    }
}
