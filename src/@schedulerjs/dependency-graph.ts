import { NumberSymbol } from '@angular/common';
import { deepStrictEqual } from 'assert';
import * as _ from 'lodash';
import * as _m from 'moment';

import { ScheduleResource } from './schedule-resource';
import { ScheduleTask, SchedDepTask } from './schedule-task';
import { ResType } from './utils';

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
export interface IDepends {
    [index: string]: { depCount: number; start: _m.Moment };
}

export interface IDepTask {
    [index: string]: SchedDepTask;
}
export class SchedDependencyGraph {
    tasks: IDepTask = {};
    roots: string[] = [];
    leaves: string[] = [];
    resources: string[] = [];
    depth = 0;
    end: _m.Moment;

    constructor(taskArr: ScheduleTask[], private start: _m.Moment) {
        this.end = this.start;
        this.createDependency(taskArr);
    }

    backwardPass(
        depEnding: IDepends = {},
        leaves = this.leaves,
        end = this.end
    ): this {
        this.updateDependencies(depEnding, leaves, end, true);
        leaves.forEach((id, index) => {
            const task = this.tasks[id];
            const requiredBy = task.requiredBy;
            const dep = depEnding[id];

            if (
                _.isEmpty(requiredBy) ||
                (dep && dep.depCount === requiredBy.length)
            ) {
                task.lateStart = dep.start.clone().subtract(task.duration);
                task.lateFinish = dep.start.clone();
                task.floatAmt = _m.duration(
                    task.lateFinish.diff(task.earlyFinish)
                );

                if (!_.isEmpty(task.dependsOn)) {
                    this.backwardPass(
                        depEnding,
                        task.dependsOn as string[],
                        task.lateStart
                    );
                }
            }
        });
        return this;
    }

    createDependency(taskArr: ScheduleTask[]) {
        taskArr.forEach(x => {
            this.tasks[x.id] = x as SchedDepTask;
        });
        this.setResources()
            .setRequiredBy()
            .setRootAndLeaves()
            .setDepth()
            .forwardPass()
            .setEnd()
            .backwardPass();
    }

    /**
     * Generates an optimistic (assume all resources are available when needed)
     * forward schedule for each node in the graph, respecting node dependencies.
     */
    private forwardPass(
        roots = this.roots,
        start = this.start,
        depEnding: IDepends = {}
    ): this {
        this.updateDependencies(depEnding, roots, start);
        roots.forEach(id => {
            const task = this.tasks[id];
            const dependsOn = task.dependsOn;
            const dep = depEnding[id];

            if (
                !task.earlyFinish &&
                (_.isEmpty(dependsOn) ||
                    (dep && dep.depCount === dependsOn.length))
            ) {
                task.earlyStart = dep.start.clone();
                task.earlyFinish = dep.start.clone().add(task.duration);

                if (!_.isEmpty(task.requiredBy)) {
                    this.forwardPass(
                        task.requiredBy,
                        task.earlyFinish,
                        depEnding
                    );
                }
            }
        });
        return this;
    }

    /**
     * Determines the depth (maximum number of nodes that depend on the current
     * node) of each node in the dependency graph.
     */
    private setDepth(leaves = this.leaves, depth = 0): this {
        leaves.forEach((tId, i) => {
            const task = this.tasks[tId];
            const dependsOn = task.dependsOn;
            task.depth = !task.depth || depth > task.depth ? depth : task.depth;
            this.depth = depth > this.depth ? depth : this.depth;

            if (!_.isEmpty(dependsOn)) {
                this.setDepth(dependsOn as string[], task.depth + 1);
            }
        });
        this.depth += 1; // increment depth so it is 1 based
        return this;
    }

    private setEnd(): this {
        this.leaves.forEach(id => {
            const finish = this.tasks[id].earlyFinish;
            this.end =
                finish && finish.isAfter(this.end) ? finish.clone() : this.end;
        });
        return this;
    }

    private setRootAndLeaves(): this {
        const keys = Object.keys(this.tasks);

        keys.forEach(tId => {
            const task = this.tasks[tId];
            if (_.isEmpty(task.dependsOn)) {
                this.roots.push(task.id);
            }
            if (_.isEmpty(task.requiredBy)) {
                this.leaves.push(task.id);
            }
        });
        return this;
    }

    private setRequiredBy(): this {
        const keys = Object.keys(this.tasks);

        keys.forEach(tId => {
            const task = this.tasks[tId];
            const child = task;
            const dependsOn = task.dependsOn as string[];

            if (_.isEmpty(dependsOn)) {
                return;
            }
            dependsOn.forEach(id => {
                const parent = this.tasks[id];
                parent.requiredBy = parent.requiredBy || [];
                parent.requiredBy.push(child.id);
            });
        });
        return this;
    }

    private setResources(): this {
        const allResourceIds = _.flatMap(this.tasks, m =>
            _.flatMap(m.resources, x => x)
        );
        this.resources = [...new Set(allResourceIds)];
        return this;
    }

    /**
     * Tracks dependencies between nodes to ensure nodes are only scheduled once
     * their dependencies have completed.
     */
    private updateDependencies(
        deps: IDepends,
        tasks: string[],
        start = this.start,
        rev?: boolean
    ): this {
        const compare = rev
            ? (a: _m.Moment, b: _m.Moment) => b.isAfter(a)
            : (a: _m.Moment, b: _m.Moment) => a.isAfter(b);
        tasks.forEach(id => {
            if (deps[id]) {
                deps[id].depCount = deps[id].depCount + 1;
                deps[id].start = compare(start, deps[id].start)
                    ? start
                    : deps[id].start;
            } else {
                deps[id] = { depCount: 1, start };
            }
        });
        return this;
    }
}
