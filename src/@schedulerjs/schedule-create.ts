import * as _ from 'lodash';
import * as _m from 'moment';
import { SchedDependencyGraph } from './dependency-graph';
import { SchedResourceManager } from './resource-manager';
import { ScheduleResource } from './schedule-resource';
import { ScheduleTask, SchedDepTask } from './schedule-task';
import { Scheduler } from './scheduler';
import { ResType } from './utils';

export interface IFwdDeps {
    [index: string]: [{ depCount: number; start: _m.Moment }];
}

export class ScheduleManager {
    dependencyGraph: SchedDependencyGraph;
    resourceManager: SchedResourceManager;
    scheduledTasks: SchedDepTask[];
    failedTasks: ScheduleTask[];
    private longestEnd: _m.Moment;
    constructor(
        private tasks: ScheduleTask[],
        private resources: ScheduleResource[],
        private sched: any,
        private scheduleStart: _m.Moment
    ) {
        this.scheduledTasks = [];
        this.failedTasks = [];
        this.dependencyGraph = new SchedDependencyGraph(tasks, scheduleStart);
        const sortedTask = _.orderBy(
            this.dependencyGraph.tasks,
            x => x.lateFinish,
            ['desc']
        );
        this.longestEnd = sortedTask[0].lateFinish;
        this.resourceManager = new SchedResourceManager(
            resources,
            scheduleStart,
            this.dependencyGraph.end
        );
    }

    /**
     * Calculates when a task must be completed by before it ends up slipping
     * one of its dependencies or the schedule. Tasks with zero float amount
     * are in the critical path.
     */
    backwardPass(leaves: string[], finishDate: _m.Moment): void {
        leaves.forEach((taskId, index) => {
            const sTask = this.scheduledTasks[leaves[taskId]];
            const dependsOn = this.dependencyGraph.tasks[leaves[taskId]]
                .dependsOn;

            if (sTask) {
                sTask.lateFinish = finishDate.clone();
                sTask.floatAmt = _m.duration(
                    sTask.lateFinish.diff(sTask.earlyFinish)
                );

                if (dependsOn) {
                    this.backwardPass(dependsOn as string[], sTask.earlyStart);
                }
            }
        });
    }

    create(): any {
        const ps = new Scheduler(true);
        ps.availStart = this.scheduleStart.clone();
        ps.availEnd = this.longestEnd.clone();
        ps.addShiftAvailability(ps.availStart, ps.availEnd);
        this.resourceManager.addResource(
            [
                {
                    id: ResType.Project,
                    available: ps,
                    isNotReservable: true
                }
            ] as any,
            this.scheduleStart
        );
        this.resourceManager.addResource(
            this.tasks,
            this.scheduleStart,
            ResType.Task
        );

        this.forwardPass(this.dependencyGraph.roots);
        const range = this.getSummary(this.tasks, this.failedTasks);
        this.backwardPass(this.dependencyGraph.leaves, range[1]);
        return {
            scheduledTasks: this.scheduledTasks,
            failedTasks: this.failedTasks.length ? this.failedTasks : null,
            success: this.failedTasks.length === 0,
            start: range[0],
            end: range[1]
        };
    }

    private forwardPass(roots: string[]): void {
        const readyTasks: string[] = roots.slice();
        const dependencies: IFwdDeps = {};

        roots.forEach(tId => {
            dependencies[tId] = [{ depCount: 0, start: this.scheduleStart }];
        });

        readyTasks.sort(this.sortReadyTasks).forEach(taskId => {
            const processTask = this.dependencyGraph.tasks[taskId];
            const start = dependencies[processTask.id][0].start;
            const end = this.forwardPassTask(processTask, start);

            if (end && processTask.requiredBy) {
                this.updateDependencies(
                    readyTasks,
                    dependencies,
                    processTask.requiredBy,
                    end
                );
            }
        });
    }

    private forwardPassTask(task: SchedDepTask, start: _m.Moment): _m.Moment {
        const resAll = [ResType.Project, ResType.Task + task.id];
        const resources = task.resources
            ? resAll.concat(task.resources)
            : resAll;
        const duration = task.duration;
        let next = start.clone();
        const scheduleTask = new SchedDepTask(false);
        scheduleTask.duration = duration;
        while (duration.asMinutes()) {
            const r = this.resourceManager.makeReservation(
                resources,
                next,
                task.minSchedule,
                duration
            );
            if (!r.success) {
                return undefined;
            }
            scheduleTask.earlyStart =
                scheduleTask.earlyStart.clone() || r.start.clone();
            scheduleTask.schedule.push(r);
            duration.subtract(r.duration);
            next = r.end.clone();
        }
        scheduleTask.earlyFinish = next.clone();
        this.scheduledTasks[task.id] = scheduleTask;
        return next;
    }

    /**
     * Finds the start and end date of the schedule and adds any tasks that were
     * scheduled to the failedTasks array.
     */
    getSummary(tasks: ScheduleTask[], failedTask: ScheduleTask[]): _m.Moment[] {
        let start: _m.Moment;
        let end: _m.Moment;

        tasks.forEach((task, index) => {
            const t = this.scheduledTasks[task[index].id];
            if (t) {
                start =
                    !start || t.earlyStart.isBefore(start)
                        ? t.earlyStart
                        : start;
                end = !end || t.earlyFinish.isAfter(end) ? t.earlyFinish : end;
            } else {
                failedTask.push(task[index].id);
            }
        });
        return [start, end];
    }

    private sortReadyTasks = (a: string, b: string) => {
        const ta = this.dependencyGraph.tasks[a];
        const tb = this.dependencyGraph.tasks[b];

        if (tb.priority && (!ta.priority || tb.priority > ta.priority)) {
            return -1;
        }

        if (ta.priority && (!tb.priority || ta.priority > tb.priority)) {
            return 1;
        }
        const tbFloat = tb.floatAmt.asMinutes();
        const taFloat = ta.floatAmt.asMinutes();

        if (tbFloat > taFloat) {
            return -1;
        }

        if (taFloat > tbFloat) {
            return;
        }
    }

    /**
     * As tasks are scheduled, the information is tracked in the dependencies
     * array. As a tasks dependencies are all met, the task is pushed onto the
     * readyTasks array which means it is available to be scheduled.
     */
    private updateDependencies(
        readyTasks: string[],
        dependencies: IFwdDeps,
        tasks: string[],
        end: _m.Moment
    ) {
        tasks.forEach(taskId => {
            const dependsOn = this.dependencyGraph.tasks[taskId].dependsOn;
            const metDeps =
                dependencies[taskId] ||
                (dependencies[taskId] = [
                    { depCount: 0, start: this.scheduleStart.clone() }
                ]);
            metDeps[0].depCount += 1;
            metDeps[0].start = end.isAfter(metDeps[0].start.clone())
                ? end
                : metDeps[0].start;

            if (!dependsOn || metDeps[0].depCount >= dependsOn.length) {
                readyTasks.push(taskId);
            }
        });
    }
}
