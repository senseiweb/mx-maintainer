import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { FuseUtils } from '@fuse/utils';
import { ActionItem, ActionItemRepo } from '../data';
import { UserService } from 'app/data';
import { TagRepoService } from 'app/aagt/data/repos';
import { MxFilterTag, MxKnownFilters } from 'app/data';
import { Action } from 'rxjs/internal/scheduler/Action';

@Injectable()
export class ActionManagerUow implements Resolve<any> {
    actions: Array<ActionItem>;
    // taskModel: Task;
    selectedActions: Array<ActionItem>;
    currentAction: ActionItem;
    searchText: string;
    tags: Array<MxFilterTag>;
    routeParams: any;

    onActionsChanged: BehaviorSubject<Array<ActionItem>>;
    onSelectedActionChanged: BehaviorSubject<Array<ActionItem>>;
    onCurrentActionChanged: BehaviorSubject<{action?: ActionItem, mode?: string}>;
    onTagsChanged: BehaviorSubject<Array<MxFilterTag>>;
    onSearchTextChanged: BehaviorSubject<string>;
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
        this.onActionsChanged = new BehaviorSubject([] as Array<ActionItem>);
        this.onSelectedActionChanged = new BehaviorSubject([] as Array<ActionItem>);
        this.onCurrentActionChanged = new BehaviorSubject({} as any);
        this.onTagsChanged = new BehaviorSubject([] as Array<MxFilterTag>);
        this.onSearchTextChanged = new BehaviorSubject('');
        this.onNewActionClicked = new Subject();
    }

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
      this.routeParams = route.params;
        await Promise.all([
            this.getTags(),
            this.getActions()
        ]);
        if (this.routeParams.taskId) {
            this.setCurrentAction(this.routeParams.taskId);
        } else {
            this.setCurrentAction();
        }

        this.onSearchTextChanged.subscribe(searchText => {
            this.searchText = searchText;
            this.getActions();
        });
    }

    async getTags() {
        try {
            const tagFilters = await this.tagsRepo.fetchTags();
            if (tagFilters.length) {
                this.tags = tagFilters;
                this.onTagsChanged.next(this.tags);
            }
            return Promise.resolve(this.tags);
        } catch (e) {

        }

    }

    async getActions(): Promise<Array<ActionItem>> {
        try {
            this.actions = await this.actionRepo.all();
            if ( this.routeParams.tagHandle ) {
                return this.getActionsByTag(this.routeParams.tagHandle);
            }

            if ( this.routeParams.filterHandle ) {
                return this.getActionsByFilter(this.routeParams.filterHandle);
            }

            return this.getActionByParams();
        } catch (e) {
            console.error(e);
        }

    }

    getActionByParams(): Array<ActionItem> {
        this.actions = FuseUtils.filterArrayByString(this.actions, this.searchText);
        this.onActionsChanged.next(this.actions);
        return this.actions;
    }

    getActionsByFilter(handle: MxKnownFilters): Array<ActionItem> {
        let filteredTasks: Array<ActionItem>;

        switch (handle) {
            case 'createdByMe':
                filteredTasks = this.actions.filter(task => task.authorId === this.userService.id);
                break;

        }
        this.actions = FuseUtils.filterArrayByString(filteredTasks, this.searchText);
        this.onActionsChanged.next(this.actions);
        return this.actions;
    }

    getActionsByTag(handle: string): Array<ActionItem> {
            this.actions = this.actions.filter(task => {
                task.tags.filter(tag => tag.tagHandle === handle);
            });

            this.actions = FuseUtils.filterArrayByString(this.tags, this.searchText);
            this.onActionsChanged.next(this.actions);
            return this.actions;
    }

    toggleSelectedAction(id: number): void {
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
            this.deselectActions();
        } else {
            this.selectActions();
        }

    }

    selectActions(filterParameter?: string, filterValue?: string): void {
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

    deselectActions(): void {
        this.selectedActions = [];

        // Trigger the next event
        this.onSelectedActionChanged.next(this.selectedActions);
    }

    setCurrentAction(id?: number): void {
        this.currentAction = this.actions.find(task => {
            return task.id === id;
        });

        this.onCurrentActionChanged.next({ action: this.currentAction, mode: 'edit' });

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

    toggleTagOnSelectedActions(tagId: number): void {
        this.selectedActions.map(action => {
            this.toggleTagOnAction(tagId, action);
        });
    }

    toggleTagOnAction(tagId: number, action: ActionItem): void {
        const index = action.tags.findIndex(tag => tag.id === tagId);

        if ( index !== -1 ) {
            action.tags.splice(index, 1);
        } else {
            action.tags.push(this.tags.find(tag => tag.id === tagId));
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
