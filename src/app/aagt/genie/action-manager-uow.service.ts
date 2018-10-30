import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { FuseUtils } from '@fuse/utils';
import { ActionItem, ActionItemRepo } from '../data';
import { UserService } from 'app/data';
import { TagRepoService } from 'app/aagt/data/repos';
import { MxFilterTag, MxKnownFilters } from 'app/data';

@Injectable()
export class ActionManagerUow implements Resolve<any> {
    actions: Array<ActionItem>;
    // taskModel: Task;
    selectedActions: Array<ActionItem>;
    currentAction: ActionItem;
    searchText: string;
    filters: Array<MxFilterTag>;
    tags: Array<MxFilterTag>;
    routeParams: any;

    onActionChanged: BehaviorSubject<any>;
    onSelectedActionChanged: BehaviorSubject<any>;
    onCurrentActionChanged: BehaviorSubject<any>;
    onFiltersChanged: BehaviorSubject<any>;
    onTagsChanged: BehaviorSubject<any>;
    onSearchTextChanged: BehaviorSubject<any>;
    onNewActionClicked: Subject<any>;

    constructor(
        private location: Location,
        private tagsRepo: TagRepoService,
        private actionRepo: ActionItemRepo,
        private userService: UserService
    ) {
        // Set the defaults
        // this.taskModel = new taskMeta.metadataFor();
        this.selectedActions = [];
        this.searchText = '';
        this.onActionChanged = new BehaviorSubject([]);
        this.onSelectedActionChanged = new BehaviorSubject([]);
        this.onCurrentActionChanged = new BehaviorSubject([]);
        this.onFiltersChanged = new BehaviorSubject([]);
        this.onTagsChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new BehaviorSubject('');
        this.onNewActionClicked = new Subject();
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

    async getTasks(): Promise<Array<ActionItem>> {
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

    getTaskByParams(): Array<ActionItem> {
        this.actions = FuseUtils.filterArrayByString(this.actions, this.searchText);
        this.onActionChanged.next(this.actions);
        return this.actions;
    }

    getTasksByFilter(handle: MxKnownFilters): Array<ActionItem> {
        let filteredTasks: Array<ActionItem>;

        switch (handle) {
            case 'createdByMe':
                filteredTasks = this.actions.filter(task => task.authorId === this.userService.id);
                break;

        }
        this.actions = FuseUtils.filterArrayByString(filteredTasks, this.searchText);
        this.onTagsChanged.next(this.actions);
        return this.actions;
    }

    getTasksByTag(handle: string): Array<ActionItem> {
            this.actions = this.actions.filter(task => {
                task.tags.filter(tag => tag.tagHandle === handle);
            });

            this.actions = FuseUtils.filterArrayByString(this.tags, this.searchText);
            this.onTagsChanged.next(this.actions);
            return this.actions;
    }

    toggleSelectedTask(id: number): void {
        // First, check if we already have that todo as selected...
        let selectedItemIndex;
        const alreadySelected = this.selectedActions.find((task, i) => {
            if (task.id === id) { selectedItemIndex = i; return true; }
        });

        if (alreadySelected) {
            this.selectedActions.splice(selectedItemIndex, 1);
            this.onSelectedActionChanged.next(this.selectedActions);
            return;
        }

        this.selectedActions.push(this.actions.find(t => t.id === id));

        this.onSelectedActionChanged.next(this.selectedActions);
    }

    toggleSelectAll(): void {
        if ( this.selectedActions.length > 0 ) {
            this.deselectTasks();
        } else {
            this.selectTasks();
        }

    }

    selectTasks(filterParameter?: string, filterValue?: string): void {
        this.selectedActions = [];

        // If there is no filter, select all todos
        if ( filterParameter === undefined || filterValue === undefined ) {
            this.selectedActions = this.actions;
        } else {
            this.selectedActions.push(...
                this.actions.filter(task => {
                    return task[filterParameter] === filterValue;
                })
            );
        }

        // Trigger the next event
        this.onSelectedActionChanged.next(this.selectedActions);
    }

    deselectTasks(): void {
        this.selectedActions = [];

        // Trigger the next event
        this.onSelectedActionChanged.next(this.selectedActions);
    }

    setCurrentTask(id?: number): void {
        this.currentAction = this.actions.find(task => {
            return task.id === id;
        });

        this.onCurrentActionChanged.next([this.currentAction, 'edit']);

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
        this.selectedActions.map(task => {
            this.toggleTagOnTask(tagId, task);
        });
    }

    toggleTagOnTask(tagId: number, task: ActionItem): void {
        const index = task.tags.findIndex(tag => tag.id === tagId);

        if ( index !== -1 ) {
            task.tags.splice(index, 1);
        } else {
            task.tags.push(this.tags.find(tag => tag.id === tagId));
        }

        this.updateTask();
    }

    hasTag(tagId: number, task: ActionItem): boolean {
        if ( !task.tags.length ) {
            return false;
        }

        return task.tags.findIndex(tag => tag.id === tagId) !== -1;
    }

    async updateTask(): Promise<any> {
      return await this.actionRepo.saveChanges();
    }
}
