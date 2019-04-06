import * as _ from 'lodash';
import * as _m from 'moment';
import RestProxy from 'sp-rest-proxy/dist/RestProxy';
import { ScheduleResource } from './schedule-resource';
import { ScheduleTask } from './schedule-task';
import { IWorkAvailableTime, Scheduler } from './scheduler';
import { ShiftSchedule } from './shift-schedule';
import { ResType } from './utils';

export interface IDelay {
    [index: string]: {
        needed: _m.Moment;
        available: _m.Moment;
    };
}

export interface IRange {
    id: string;
    range: IWorkAvailableTime;
    subRanges?: IRange[];
}

export interface IResourceMap {
    [index: string]: {
        schedule: Scheduler;
        isNotReservable: boolean;
    };
}
export interface IReservation {
    success: boolean;
    delays: IDelay;
    start: _m.Moment;
    end: _m.Moment;
    duration: _m.Duration;
}
export class SchedResourceManager {
    constructor(
        private resourceDefs: ScheduleResource[],
        startDate: _m.Moment,
        end: _m.Moment
    ) {
        resourceDefs.forEach(def => this.addResourcesToMap(def, startDate));
    }
    private resourceMap: IResourceMap = {};
    private defaultSchedule: Scheduler;

    addResource(
        resources: Array<string | ScheduleResource | ScheduleTask>,
        start: _m.Moment,
        prefix?: string
    ): any {
        resources.forEach((res: string | ScheduleResource | ScheduleTask) => {
            const id =
                typeof res === 'string'
                    ? prefix
                        ? prefix + res
                        : res
                    : prefix
                    ? prefix + res.id
                    : res.id;

            const def = {
                id,
                available: (res as any).available,
                isNotReservable: (res as any).isNotReservable
            } as any;
            this.addResourcesToMap(def, start);
        });
    }

    private addResourcesToMap(
        def: {
            id: string;
            available: Scheduler;
            isNotReservable: boolean;
        },
        start: _m.Moment
    ): void {
        if (!def.available) {
            def.available = new Scheduler(def.isNotReservable);
            def.available.addShiftAvailability(start);
        }
        this.resourceMap[def.id] = {
            schedule: def.available || this.defaultSchedule,
            isNotReservable: def.isNotReservable || false
        };
    }

    initRanges(
        resources: Array<string | string[]>,
        start: _m.Moment,
        ranges: IRange[],
        delays: IDelay
    ): void {
        resources.forEach((resId: string | string[]) => {
            if (Array.isArray(resId)) {
                const subRanges: IRange[] = [];
                const subDelay: IDelay = {};

                this.initRanges(resId, start, subRanges, subDelay);

                const longDelayId = this.getLongestDelay(subDelay);

                if (longDelayId) {
                    delays[longDelayId] = subDelay[longDelayId];
                }
                const schedule = this.setEarliestSubRanges(subRanges);
                ranges.push(schedule);
            } else {
                const res = this.resourceMap[resId];
                const range = res.schedule.nextAvailableAfter(start);
                if (range && resId !== ResType.Project) {
                    delays[resId] = {
                        needed: start,
                        available: range.freeTimeStart
                    };
                }
                ranges.push({ id: resId, range });
            }
        });
    }

    private getLongestDelay(delay: IDelay): number {
        const temp_delays: Array<{ id: number; available: _m.Moment }> = [];
        const delayKeys = Object.keys(delay);
        delayKeys.forEach(key =>
            temp_delays.push({ id: +key, available: delay[+key].available })
        );
        return _.orderBy(temp_delays, x => x.available.format('x'), [
            'asc'
        ]).shift().id;
    }

    /**
     * Attempts to find the next time that all resources are available, starting
     * from the start time, with a duration of at least min minutes but no more
     * than max minutes.
     */
    private getReservation(
        resources: string[],
        start: _m.Moment,
        min: _m.Duration,
        max: _m.Duration
    ): IReservation {
        let reservation: IReservation = {} as any;
        const schedules: IRange[] = [];
        const delays: IDelay = {};
        this.initRanges(resources, start, schedules, delays);
        let success = false;
        do {
            reservation = this.tryReservations(schedules, min, max);
            success = reservation.success;
            this.updateRanges(
                schedules,
                this.nextValidStart(schedules),
                delays
            );
        } while (success);
        reservation.delays = delays;
        return reservation;
    }

    makeReservation(
        resources: string[],
        next: _m.Moment,
        minSchedule: _m.Duration,
        duration: _m.Duration
    ): IReservation {
        minSchedule = minSchedule || _m.duration(1, 'hour');
        return this.getReservation(resources, next, minSchedule, duration);
    }

    private nextValidStart(ranges: IRange[]): _m.Moment {
        const sortedRanges = _.orderBy(
            ranges,
            x => x.range.freeTimeStart.format('x'),
            ['asc']
        );
        return sortedRanges[0].range.freeTimeStart;
    }

    private setEarliestSubRanges(subRanges: IRange[]): IRange {
        return _.orderBy(subRanges, x =>
            x.range.freeTimeStart.format('x')
        ).shift();
    }

    tryReservations(
        schedules: IRange[],
        min: _m.Duration,
        max: _m.Duration
    ): IReservation {
        let reservation: IReservation = {
            success: false
        } as any;
        const isInternal = (id: string) => id[0] === '_';
        const startSortedArray = _.orderBy(
            schedules,
            x => x.range.freeTimeStart.format('x'),
            ['desc']
        );
        const start = startSortedArray[0].range.freeTimeStart;
        const endSortedArray = _.orderBy(
            schedules,
            x => x.range.freeTimeEnd.format('x'),
            ['asc']
        );
        const end = endSortedArray[0].range.freeTimeEnd;
        const resources = schedules
            .filter(r => !isInternal(r.id))
            .map(r => r.id);
        let duration = _m.duration(start.diff(end));
        if (
            duration.asMinutes() >= min.asMinutes() ||
            duration.asMinutes() >= max.asMinutes()
        ) {
            duration =
                max && duration.asMinutes() > max.asMinutes() ? max : duration;
            reservation = this.createReservation(
                resources,
                start.clone(),
                duration.clone()
            );
        }
        return reservation;
    }

    /**
     * Generates a new reservation object and reserves the associated resources.
     */
    createReservation(
        resources: string[],
        start: _m.Moment,
        duration: _m.Duration
    ): IReservation {
        const end = start.clone().add(duration);
        const reservation = {
            resources,
            start,
            end,
            duration,
            delays: {},
            success: true
        };
        this.applyReservation(resources, start, end);
        return reservation;
    }

    applyReservation(
        resources: string[],
        start: _m.Moment,
        end: _m.Moment
    ): any {
        resources.forEach(resId => {
            const res = this.resourceMap[resId];
            if (res.isNotReservable) {
                return;
            }
            if (!start.isSame(res.schedule.nextJobFreeTime().freeTimeStart)) {
                try {
                    res.schedule.addJobReservation(resId, start, end);
                } catch (e) {}
            }
        });
    }

    /**
     * Updates ranges after a failed reservation attempt. Resources that were not
     * immediately available are captured in the delays array to be reported with
     * the reservation.
     */
    private updateRanges(
        resources: IRange[],
        start: _m.Moment,
        delays: IDelay
    ): any {
        resources.forEach(res => {
            if (res.range.freeTimeEnd.isAfter(start)) {
                return;
            }
            if (res.subRanges) {
                this.updateRanges(res.subRanges, start, {});
                res = this.setEarliestSubRanges(res.subRanges);
            } else {
                res.range = this.resourceDefs[res.id].available.firstAvailable(
                    start
                );
                if (res.id !== ResType.Project && !delays[res.id]) {
                    delays[res.id] = {
                        needed: start,
                        available: res.range.freeTimeStart
                    };
                }
            }
        });
    }
}
