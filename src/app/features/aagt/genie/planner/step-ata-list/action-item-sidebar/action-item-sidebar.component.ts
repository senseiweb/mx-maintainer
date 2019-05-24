import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import * as _l from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PlannerUowService } from '../../planner-uow.service';

@Component({
    selector: 'action-item-sidebar',
    templateUrl: './action-item-sidebar.component.html',
    styleUrls: ['./action-item-sidebar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionItemSidebarComponent implements OnInit, OnDestroy {
    @Output() actionItemFilterChange = new EventEmitter<string>();
    actionNames: string[];
    actionItemFilterBy: string;

    private unsubscribeAll: Subject<any>;

    constructor(
        private planUow: PlannerUowService,
        private cdRef: ChangeDetectorRef
    ) {
        // Set the private defaults
        this.unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.actionItemFilterBy = 'all';
        this.getActionNames();
        this.reactToModelChanges();
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    filterActionBy(actionName: string) {
        this.actionItemFilterBy = actionName;
        this.actionItemFilterChange.emit(actionName);
    }

    private getActionNames(): void {
        const actionNames = _l.flatMap(this.planUow.currentGen.triggers, x =>
            x.triggerActions.map(ta => ta.actionItem.action)
        );

        /* Since the reference is changing should not need to call check for changes */
        this.actionNames = [...new Set(actionNames)];
    }

    private reactToModelChanges(): void {
        this.planUow.aagtEmService
            .onModelChanges('TriggerAction', 'EntityState')
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(_ => this.getActionNames());
    }
}
