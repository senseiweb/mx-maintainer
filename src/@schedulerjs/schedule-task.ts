import { _MatInkBarPositioner } from '@angular/material';
import { Duration, Moment } from 'moment';
import { IReservation } from './resource-manager';
import { ScheduleResource } from './schedule-resource';
import { Scheduler } from './scheduler';

/**
 * Dependency graph
 * (c) 2013 Bill, BunKat LLC.
 *
 * Generates a dependency graph from a set of tasks and finds the root nodes,
 * leaf nodes, depth, and optimistic float (time between when a schedule starts
 * and when it must start to prevent a schedule slip). This information is used
 * by the schedule generator to schedule tasks against an actual timeline.
 *
 * Schedule is freely distributable under the MIT license.
 * For all details and documentation:
 *     http://github.com/bunkat/schedule
 */

export class ScheduleTask {
    constructor(isNotReservable: boolean) {
        this.available = new Scheduler(isNotReservable);
    }
    id: string;
    duration: Duration;
    resources: string[] = [];
    priority: number;
    dependsOn: Array<string | string[]> = [];
    available: Scheduler;
    minSchedule: Duration;
}

export class SchedDepTask extends ScheduleTask {
    constructor(isNotReservable: boolean) {
        super(isNotReservable);
    }
    depth?: number;
    requiredBy?: string[] = [];
    schedule?: IReservation[] = [];
    earlyFinish?: Moment;
    earlyStart?: Moment;
    lateStart?: Moment;
    lateFinish?: Moment;
    floatAmt: Duration;
}
