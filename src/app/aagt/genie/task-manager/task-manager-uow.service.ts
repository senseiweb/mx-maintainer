import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import * as bz from 'breeze-client';
import { FuseUtils } from '@fuse/utils';
import { Task, TaskRepo, TaskMetadata } from '../../data';
import { UserService } from 'app/core';
import { ScriptKey } from 'app/app-script-model';
import { TagsRepoService } from 'app/aagt/data/repos/tag-repo.service';
import { MxmTag, MxmTagFilter } from 'app/data';


@Injectable()
export class TaskManagerUow implements Resolve<any> {
    tasks: Array<Task>;
    // taskModel: Task;
    selectedTasks: Array<Task>;
    currentTask: Task;
    searchText: string;
    filters: Array<MxmTag>;
    tags: Array<MxmTag>;
    routeParams: any;

    onTaskChanged: BehaviorSubject<any>;
    onSelectedTaskChanged: BehaviorSubject<any>;
    onCurrentTaskChanged: BehaviorSubject<any>;
    onFiltersChanged: BehaviorSubject<any>;
    onTagsChanged: BehaviorSubject<any>;
    onSearchTextChanged: BehaviorSubject<any>;
    onNewTaskClicked: Subject<any>;

    constructor(
        private location: Location,
        private tagsRepo: TagsRepoService,
        private taskRepo: TaskRepo,
        private userService: UserService
    ) {
        // Set the defaults
        // this.taskModel = new taskMeta.metadataFor();
        this.selectedTasks = [];
        this.searchText = '';
        this.onTaskChanged = new BehaviorSubject([]);
        this.onSelectedTaskChanged = new BehaviorSubject([]);
        this.onCurrentTaskChanged = new BehaviorSubject([]);
        this.onFiltersChanged = new BehaviorSubject([]);
        this.onTagsChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new BehaviorSubject('');
        this.onNewTaskClicked = new Subject();
    }

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
      this.routeParams = route.params;
        await Promise.all([
            this.getTags(),
            this.getFilters(),
            this.getTasks()
        ]);
        if (this.routeParams.taskId) {
            this.setCurrentTask(this.routeParams.taskId);
        } else {
            this.setCurrentTask();
        }

        this.onSearchTextChanged.subscribe(searchText => {
            this.searchText = searchText;
            this.getTasks();
        });
    }

    async getTags() {
        try {
            const tagFilters = await this.tagsRepo.fetchTags();
            if (tagFilters.length) {
                this.tags = tagFilters.filter(tf => !tf.isFilter);
                this.onTagsChanged.next(this.tags);
            }
            return Promise.resolve(this.tags);
        } catch (e) {

        }

    }

    async getFilters(): Promise<any> {
        try {
            const tagFilters = await this.tagsRepo.fetchTags();
            if (tagFilters.length) {
                this.tags = tagFilters.filter(tf => tf.isFilter);
                this.onFiltersChanged.next(this.tags);
            }
            return Promise.resolve(this.tags);
        } catch (e) {

        }
    }

    async getTasks(): Promise<Array<Task>> {
        try {
            this.tags = await this.tagsRepo.all();
            if ( this.routeParams.tagHandle ) {
                return this.getTasksByTag(this.routeParams.tagHandle);
            }

            if ( this.routeParams.filterHandle ) {
                return this.getTasksByFilter(this.routeParams.filterHandle);
            }

            return this.getTaskByParams();
        } catch (e) {
            console.error(e);
        }

    }

    getTaskByParams(): Array<Task> {
        this.tasks = FuseUtils.filterArrayByString(this.tasks, this.searchText);
        this.onTaskChanged.next(this.tasks);
        return this.tasks;
    }

    getTasksByFilter(handle: MxmTagFilter): Array<Task> {
        let filteredTasks: Array<Task>;

        switch (handle) {
            case 'createdByMe':
                filteredTasks = this.tasks.filter(task => task.authorId === this.userService.id);
                break;

        }
        this.tasks = FuseUtils.filterArrayByString(filteredTasks, this.searchText);
        this.onTagsChanged.next(this.tasks);
        return this.tasks;
    }

    getTasksByTag(handle: string): Array<Task> {
            this.tasks = this.tasks.filter(task => {
                task.tags.filter(tag => tag.tagHandle === handle);
            });

            this.tasks = FuseUtils.filterArrayByString(this.tags, this.searchText);
            this.onTagsChanged.next(this.tasks);
            return this.tasks;
    }

    toggleSelectedTask(id: number): void {
        // First, check if we already have that todo as selected...
        let selectedItemIndex;
        const alreadySelected = this.selectedTasks.find((task, i) => {
            if (task.id === id) { selectedItemIndex = i; return true; }
        });

        if (alreadySelected) {
            this.selectedTasks.splice(selectedItemIndex, 1);
            this.onSelectedTaskChanged.next(this.selectedTasks);
            return;
        }

        this.selectedTasks.push(this.tasks.find(t => t.id === id));

        this.onSelectedTaskChanged.next(this.selectedTasks);
    }

    toggleSelectAll(): void {
        if ( this.selectedTasks.length > 0 ) {
            this.deselectTasks();
        } else {
            this.selectTasks();
        }

    }

    selectTasks(filterParameter?: string, filterValue?: string): void {
        this.selectedTasks = [];

        // If there is no filter, select all todos
        if ( filterParameter === undefined || filterValue === undefined ) {
            this.selectedTasks = this.tasks;
        } else {
            this.selectedTasks.push(...
                this.tasks.filter(task => {
                    return task[filterParameter] === filterValue;
                })
            );
        }

        // Trigger the next event
        this.onSelectedTaskChanged.next(this.selectedTasks);
    }

    deselectTasks(): void {
        this.selectedTasks = [];

        // Trigger the next event
        this.onSelectedTaskChanged.next(this.selectedTasks);
    }

    setCurrentTask(id?: number): void {
        this.currentTask = this.tasks.find(task => {
            return task.id === id;
        });

        this.onCurrentTaskChanged.next([this.currentTask, 'edit']);

        const tagHandle    = this.routeParams.tagHandle,
            filterHandle = this.routeParams.filterHandle;

        const currentPath = this.location.path;

        if (tagHandle) {
            this.location.go(`${currentPath}/tag/${tagHandle}/${id}`);
        } else if (filterHandle) {
            this.location.go(`${currentPath}/filter/${filterHandle}/${id}`);
        } else {
            this.location.go(`${currentPath}/all/${id}`);
        }
    }

    toggleTagOnSelectedTasks(tagId: number): void {
        this.selectedTasks.map(task => {
            this.toggleTagOnTask(tagId, task);
        });
    }

    toggleTagOnTask(tagId: number, task: Task): void {
        const index = task.tags.findIndex(tag => tag.id === tagId);

        if ( index !== -1 ) {
            task.tags.splice(index, 1);
        } else {
            task.tags.push(this.tags.find(tag => tag.id === tagId));
        }

        this.updateTask();
    }

    hasTag(tagId: number, task: Task): boolean {
        if ( !task.tags.length ) {
            return false;
        }

        return task.tags.findIndex(tag => tag.id === tagId) !== -1;
    }

    async updateTask(): Promise<any> {
      return await this.taskRepo.saveChanges();
    }
}
