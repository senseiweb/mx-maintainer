import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';

import { takeUntil } from 'rxjs/operators';
import { ActionItem } from 'app/aagt/data';
import { ActionManagerUow } from '../../action-manager-uow.service';

@Component({
    selector     : 'am-list',
    templateUrl  : './am-list.component.html',
    styleUrls    : ['./am-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AmListComponent implements OnInit, OnDestroy {
    actions: Array<ActionItem>;
    currentAction: ActionItem;

    private unsubscribeAll: Subject<any>;

    constructor(
        private activatedRoute: ActivatedRoute,
        private actionMngrUow: ActionManagerUow,
        private location: Location
    ) {
        this.unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        // Subscribe to update todos on changes
        this.actionMngrUow.onActionsChanged
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(actions => {
                this.actions = actions;
            });

        // Subscribe to update current todo on changes
        this.actionMngrUow.onCurrentActionChanged
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(curr => {
                if ( !curr.action ) {
                    // Set the current todo id to null to deselect the current todo
                    this.currentAction = null;

                    // Handle the location changes
                    const tagHandle    = this.activatedRoute.snapshot.params.tagHandle,
                          filterHandle = this.activatedRoute.snapshot.params.filterHandle;

                    if ( tagHandle ) {
                        this.location.go('action-manager/action/tag/' + tagHandle);
                    } else if ( filterHandle ) {
                        this.location.go('action-manager/action/filter/' + filterHandle);
                    } else {
                        this.location.go('action-manager/action/all');
                    }
                } else {
                    this.currentAction = curr.action;
                }
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    readTodo(todoId): void {
        // Set current todo
        this.actionMngrUow.setCurrentAction(todoId);
    }

    onDrop(ev): void {

    }
}
