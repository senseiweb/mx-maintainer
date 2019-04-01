import {
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { MinutesExpand } from 'app/common';
import {
    ActionItem,
    Generation,
    ITriggerActionItemShell,
    Trigger,
    TriggerAction
} from 'app/features/aagt/data';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { PlannerUowService } from '../planner-uow.service';

@Component({
    selector: 'genie-plan-step3',
    templateUrl: './step3.component.html',
    styleUrls: ['./step3.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
    providers: [MinutesExpand]
})
export class Step3Component implements OnInit, OnDestroy {
    currentTrigger: Trigger;

    triggers: Trigger[] = [];
    searchInput: FormControl;
    private unsubscribeAll: Subject<any>;

    constructor(
        private uow: PlannerUowService,
        private formBuilder: FormBuilder,
        private trigdialog: MatDialog,
        private deleteDialog: MatDialog,
        private planUow: PlannerUowService
    ) {
        this.unsubscribeAll = new Subject();
        this.searchInput = new FormControl('');
    }

    ngOnInit() {
        this.searchInput.valueChanges
            .pipe(
                takeUntil(this.unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                // this._contactsService.onSearchTextChanged.next(searchText);
            });
        this.uow.onStepperChange.subscribe(stepEvent => {
            if (stepEvent.selectedIndex === 3) {
                this.uow.reviewChanges();
            }
        });
    }

    ngOnDestroy(): void {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    private sortActionItem(data: ActionItem[], key): ActionItem[] {
        return data.sort((a: ActionItem, b: ActionItem) => {
            const propA: number | string = a[key];
            const propB: number | string = b[key];

            const valueA = isNaN(+propA) ? propA : +propA;
            const valueB = isNaN(+propB) ? propB : +propB;

            return valueA < valueB ? -1 : 1;
        });
    }
}
