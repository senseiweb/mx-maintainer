import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { Task } from 'app/aagt/data/';
import { TaskManagerUow } from '../task-manager-uow.service';
import { MxmTag } from 'app/data';

@Component({
    selector: 'genie-task-manager',
    templateUrl: './task-manager.component.html',
    styleUrls: ['./task-manager.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class TaskManagerComponent implements OnInit, OnDestroy {
    hasSelectedTasks: boolean;
    isIndeterminate: boolean;
    filters: Array<MxmTag>;
    tags: Array<MxmTag>;
    searchInput: FormControl;
    currentTask: Task;

    private _unsubscribeAll: Subject<any>;

    constructor(private _fuseSidebarService: FuseSidebarService,
        private taskUow: TaskManagerUow) {
        this.searchInput = new FormControl('');
        this._unsubscribeAll = new Subject();
    }

    ngOnInit() {
        this.taskUow.onSelectedTaskChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedTasks => {

                setTimeout(() => {
                    this.hasSelectedTasks = selectedTasks.length > 0;
                    this.isIndeterminate = (selectedTasks.length !== this.taskUow.tasks.length && selectedTasks.length > 0);
                }, 0);
            });

        this.taskUow.onFiltersChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(folders => {
                this.filters = this.taskUow.filters;
            });

        this.taskUow.onTagsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(tags => {
                this.tags = this.taskUow.tags;
            });

        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                this.taskUow.onSearchTextChanged.next(searchText);
            });

        this.taskUow.onCurrentTaskChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(([currentTask, formType]) => {
                if (!currentTask) {
                    this.currentTask = null;
                } else {
                    this.currentTask = currentTask;
                }
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    deselectCurrentTask(): void {
        this.taskUow.onCurrentTaskChanged.next([null, null]);
    }


    toggleSelectAll(): void {
        this.taskUow.toggleSelectAll();
    }

    selectTasks(filterParameter?, filterValue?): void {
        this.taskUow.selectTasks(filterParameter, filterValue);
    }

    deselectTasks(): void {
        this.taskUow.deselectTasks();
    }

    toggleTagOnSelectedTasks(tagId): void {
        this.taskUow.toggleSelectedTask(tagId);
    }

    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
}
