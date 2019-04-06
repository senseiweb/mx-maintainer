import { Injectable } from '@angular/core';
import { ScheduleManager } from '@schedulerjs/schedule-create';
import { ScheduleResource } from '@schedulerjs/schedule-resource';
import { ScheduleTask } from '@schedulerjs/schedule-task';
import * as _m from 'moment';

@Injectable({ providedIn: 'root' })
export class TestSchedulerService {
    constructor() {
        const tasks = this.reservations.map(res => {
            const task = new ScheduleTask(false);
            task.id = res.name;
            task.duration = _m.duration(res.length, 'hours');
            if (res.availability) {
                res.availability.forEach(r => {
                    task.available.addShiftAvailability(r.start, r.end);
                });
            }
            if (res.resource) {
                task.resources = res.resource;
            }
            return task;
        });
        const resources = this.elevators.map(e => {
            const res = new ScheduleResource(false);
            res.id = e.name;
            e.availability.forEach(re => {
                res.available.addShiftAvailability(re.start, re.end);
            });
            return res;
        });
        const scheduler = new ScheduleManager(
            tasks,
            resources,
            null,
            _m('20130214T12:00', 'YYYYMMDDTHH:mm')
        );
        console.log(scheduler.create());
    }

    // Step 1: Define our reservations (tasks)
    private reservations = [
        {
            name: 'Joe',
            length: 12,
            resource: ['E1'],
            dependsOn: ['Peter'],
            availability: [
                {
                    start: _m('20130215T12:00', 'YYYYMMDDTHH:mm'),
                    end: _m('20130215T16:00', 'YYYYMMDDTHH:mm')
                },
                {
                    start: _m('20130216T12:00', 'YYYYMMDDTHH:mm'),
                    end: _m('20130216T16:00', 'YYYYMMDDTHH:mm')
                },
                {
                    start: _m('20130217T12:00', 'YYYYMMDDTHH:mm'),
                    end: _m('20130217T16:00', 'YYYYMMDDTHH:mm')
                },
                {
                    start: _m('20130218T12:00', 'YYYYMMDDTHH:mm'),
                    end: _m('20130218T16:00', 'YYYYMMDDTHH:mm')
                }
            ]
        },
        { name: 'Mike', length: 2, resource: ['E1'] },
        { name: 'Frank', length: 8 },
        {
            name: 'John',
            length: 10,
            resource: ['E1', 'E2'],
            availability: [
                {
                    start: _m('20130215T08:00', 'YYYYMMDDTHH:mm'),
                    end: _m('20130215T16:00', 'YYYYMMDDTHH:mm')
                },
                {
                    start: _m('20130216T08:00', 'YYYYMMDDTHH:mm'),
                    end: _m('20130216T16:00', 'YYYYMMDDTHH:mm')
                },
                {
                    start: _m('20130217T08:00', 'YYYYMMDDTHH:mm'),
                    end: _m('20130217T16:00', 'YYYYMMDDTHH:mm')
                },
                {
                    start: _m('20130218T08:00', 'YYYYMMDDTHH:mm'),
                    end: _m('20130218T16:00', 'YYYYMMDDTHH:mm')
                }
            ]
        },
        {
            name: 'Peter',
            length: 10,
            resource: ['E1'],
            availability: [
                {
                    start: _m('20130215T12:00', 'YYYYMMDDTHH:mm'),
                    end: _m('20130215T16:00', 'YYYYMMDDTHH:mm')
                },
                {
                    start: _m('20130216T12:00', 'YYYYMMDDTHH:mm'),
                    end: _m('20130216T16:00', 'YYYYMMDDTHH:mm')
                },
                {
                    start: _m('20130217T12:00', 'YYYYMMDDTHH:mm'),
                    end: _m('20130217T16:00', 'YYYYMMDDTHH:mm')
                },
                {
                    start: _m('20130218T12:00', 'YYYYMMDDTHH:mm'),
                    end: _m('20130218T16:00', 'YYYYMMDDTHH:mm')
                }
            ]
        },
        { name: 'Sam', length: 2 },
        { name: 'Alan', length: 2 },
        { name: 'James', length: 8 },
        {
            name: 'Steve',
            length: 19,
            resource: ['E2'],
            availability: [
                {
                    start: _m('20130215T21:00', 'YYYYMMDDTHH:mm'),
                    end: _m('20130216T06:00', 'YYYYMMDDTHH:mm')
                },
                {
                    start: _m('20130216T21:00', 'YYYYMMDDTHH:mm'),
                    end: _m('20130217T06:00', 'YYYYMMDDTHH:mm')
                },
                {
                    start: _m('20130217T21:00', 'YYYYMMDDTHH:mm'),
                    end: _m('20130218T06:00', 'YYYYMMDDTHH:mm')
                },
                {
                    start: _m('20130218T21:00', 'YYYYMMDDTHH:mm'),
                    end: _m('20130219T06:00', 'YYYYMMDDTHH:mm')
                }
            ]
        },
        { name: 'Mark', length: 2 },
        { name: 'Alex', length: 8 }
    ];

    // Step 2: Define our elevators (resources)
    private elevators = [
        {
            name: 'E1',
            availability: [
                {
                    start: _m('20130215T01:00', 'YYYYMMDDTHH:mm'),
                    end: _m('20130215T0600', 'YYYYMMDDTHH:mm')
                },
                {
                    start: _m('20130216T08:00', 'YYYYMMDDTHH:mm'),
                    end: _m('20130216T16:00', 'YYYYMMDDTHH:mm')
                },
                {
                    start: _m('20130217T11:00', 'YYYYMMDDTHH:mm'),
                    end: _m('20130217T23:00', 'YYYYMMDDTHH:mm')
                },
                {
                    start: _m('20130218T01:00', 'YYYYMMDDTHH:mm'),
                    end: _m('20130218T21:30', 'YYYYMMDDTHH:mm')
                }
            ]
        },
        {
            name: 'E2',
            availability: [
                {
                    start: _m('20130215T06:00', 'YYYYMMDDTHH:mm'),
                    end: _m('20130216T06:00', 'YYYYMMDDTHH:mm')
                },
                {
                    start: _m('20130217T08:00', 'YYYYMMDDTHH:mm'),
                    end: _m('20130217T11:00', 'YYYYMMDDTHH:mm')
                },
                {
                    start: _m('20130218T12:00', 'YYYYMMDDTHH:mm'),
                    end: _m('20130218T16:00', 'YYYYMMDDTHH:mm')
                },
                {
                    start: _m('20130218T09:00', 'YYYYMMDDTHH:mm'),
                    end: _m('20130218T06:00', 'YYYYMMDDTHH:mm')
                }
            ]
        }
    ];
}
