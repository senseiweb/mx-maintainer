import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { ActionItem } from 'app/aagt/data/';
import { ActionManagerUow } from '../../action-manager-uow.service';
import { MxFilterTag } from 'app/data';

@Component({
    selector: 'genie-action-manager',
    templateUrl: './action-manager.component.html',
    styleUrls: ['./action-manager.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ActionManagerComponent implements OnInit, OnDestroy {
    hasSelectedActions: boolean;
    isIndeterminate: boolean;
    filters: Array<MxFilterTag>;
    tags: Array<MxFilterTag>;
    searchInput: FormControl;
    currentAction: ActionItem;

    private _unsubscribeAll: Subject<any>;

    constructor(private _fuseSidebarService: FuseSidebarService,
        private actionUow: ActionManagerUow) {
        this.searchInput = new FormControl('');
        this._unsubscribeAll = new Subject();
    }

    ngOnInit() {
        this.actionUow.onSelectedActionChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedActions => {

                setTimeout(() => {
                    this.hasSelectedActions = selectedActions.length > 0;
                    this.isIndeterminate = (selectedActions.length !== this.actionUow.actions.length && selectedActions.length > 0);
                }, 0);
            });

        this.actionUow.onFiltersChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(folders => {
                this.filters = this.actionUow.filters;
            });

        this.actionUow.onTagsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(tags => {
                this.tags = this.actionUow.tags;
            });

        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                this.actionUow.onSearchTextChanged.next(searchText);
            });

        this.actionUow.onCurrentActionChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(([currentTask, formType]) => {
                if (!currentTask) {
                    this.currentAction = null;
                } else {
                    this.currentAction = currentTask;
                }
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    deselectCurrentTask(): void {
        this.actionUow.onCurrentActionChanged.next([null, null]);
    }


    toggleSelectAll(): void {
        this.actionUow.toggleSelectAll();
    }

    selectTasks(filterParameter?, filterValue?): void {
        this.actionUow.selectTasks(filterParameter, filterValue);
    }

    deselectTasks(): void {
        this.actionUow.deselectTasks();
    }

    toggleTagOnSelectedTasks(tagId): void {
        this.actionUow.toggleSelectedTask(tagId);
    }

    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
}
