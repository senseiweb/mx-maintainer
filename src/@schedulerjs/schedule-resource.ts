import { Scheduler } from './scheduler';

export class ScheduleResource {
    constructor(isNotReservable: boolean) {
        this.available = new Scheduler(isNotReservable);
    }
    id: string;
    available: Scheduler;
    isNotReservable = false;
}
