import * as _ from 'lodash';
import * as _m from 'moment';
import { ShiftSchedule } from './shift-schedule';
import { NoAvailableTimeError, OverLapJobResError } from './utils';

export interface IWorkAvailableTime {
    freeTimeStart: _m.Moment;
    freeTimeEnd: _m.Moment;
}

export class Scheduler {
    private availabilityList: ShiftSchedule[] = [];
    // availStart: _m.Moment;
    // availEnd: _m.Moment;
    exceptions: Error[] = [];
    constructor(private isNotReservable: boolean) {}

    addShiftAvailability(
        start: _m.Moment | Date,
        end?: _m.Moment | Date,
        labourHours?: number
    ): void {
        console.log(start);
        console.log(end);
        start = _m.isMoment(start) ? start : _m(start);
        if (!end) {
            end = start.add(1, 'year'); // if no end, set an atributary date one year out from start
        }
        end = _m.isMoment(end) ? end : _m(end);
        const newShiftAvailablitiy = new ShiftSchedule(
            start,
            end,
            labourHours,
            this.isNotReservable
        );
        console.log(newShiftAvailablitiy);
        this.availabilityList.push(newShiftAvailablitiy);
        console.log(this.availabilityList);
        // debugger;
        this.availabilityList = this.sort(this.availabilityList);
        // this.availStart = this.availabilityList[0].start;
        // this.availEnd = this.availabilityList[
        //    this.availabilityList.length - 1
        // ].end;
    }

    get currentAvailableShift(): ShiftSchedule {
        return this.availabilityList.find(x => !x.isBookedUp);
    }

    addJobReservation(taskId: string, start: _m.Moment, end: _m.Moment): void {
        try {
            this.currentAvailableShift.addJobReservation(taskId, start, end);
        } catch (e) {
            if (e instanceof OverLapJobResError) {
                this.exceptions.push(e);
            }
            throw e;
        }
    }

    nextJobFreeTime(shiftCheck?: ShiftSchedule): IWorkAvailableTime {
        const currentShift = shiftCheck || this.currentAvailableShift;
        if (!currentShift) {
            throw new NoAvailableTimeError('', 'no time slots available');
        }
        const currLastRes = currentShift.lastScheduleReservation;
        const lastres = {
            freeTimeStart: currLastRes.jobEnd || currentShift.start,
            freeTimeEnd: currentShift.end
        };
        return lastres;
    }

    nextAvailableAfter(current: _m.Moment): IWorkAvailableTime {
        const firstAvailableShift = this.isNotReservable
            ? this.availabilityList[0]
            : this.availabilityList.find(
                  a => a.start.isSameOrAfter(current) && !a.isBookedUp
              );
        if (firstAvailableShift) {
            return this.nextJobFreeTime(firstAvailableShift);
        }
        return undefined;
    }

    // setNextAvailableAfter(moment: _m.Moment): ShiftSchedule {
    //     const nextAvailableMoment = this._availabilityList.findIndex(a =>
    //         a.start.isSameOrAfter(moment)
    //     );
    //     if (nextAvailableMoment) {
    //     }
    //     const next = this._availabilityList.slice();
    //     this._usedAvailability.unshift(next);
    //     return next;
    // }

    private sort(schedule: ShiftSchedule[], rev = false): ShiftSchedule[] {
        const sortedArray = _.orderBy(
            schedule,
            x => x.start.format('x'),
            rev ? ['desc'] : ['asc']
        );
        return sortedArray;
    }
}
