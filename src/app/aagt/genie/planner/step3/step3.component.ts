import { Component, OnInit, Input, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Generation, ActionItem, Trigger, TriggerAction, ITriggerActionItemShell } from 'app/aagt/data';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { PlannerUowService } from '../planner-uow.service';
import { fuseAnimations } from '@fuse/animations';
import { MinutesExpand } from 'app/common';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

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
    @Input() plannedGen: Generation;

    triggers: Trigger[] = [];
    allActionItems: ActionItem[];
    selectedTriggersAction: ActionItem[];
    triggerFormGroup: FormGroup;
    private unsubscribeAll: Subject<any>;

    constructor(private formBuilder: FormBuilder,
        private trigdialog: MatDialog,
        private deleteDialog: MatDialog,
        private planUow: PlannerUowService) {
        this.unsubscribeAll = new Subject();
        this.selectedTriggersAction = [];
    }

    ngOnInit() {
        this.allActionItems = this.planUow.allActionItems;
        this.allActionItems.filter((ai: ActionItem) => ai.availableForUse);
        this.triggerFormGroup = this.formBuilder.group({
            trigger: new FormControl()
        });
        this.triggerFormGroup.get('trigger').valueChanges
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((selectedTrigger: Trigger) => {
                if (!selectedTrigger) { return; }

                this.allActionItems = this.allActionItems.concat(this.selectedTriggersAction.splice(0));

                this.allActionItems.forEach(item => item['sequence'] = null);

                selectedTrigger.triggerActions.forEach((item, i, a) => {
                    const actionItemIndex = this.allActionItems
                        .findIndex(ai => ai.id === item.actionItemId);
                    const actionItem = this.allActionItems.splice(actionItemIndex, 1)[0];
                    actionItem['sequence'] = item.sequence;
                    this.selectedTriggersAction.push(actionItem as any);
                });
                this.sortActionItem(this.selectedTriggersAction, 'sequence');
                this.sortActionItem(this.allActionItems, 'teamType');
                this.currentTrigger = selectedTrigger;
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

            return (valueA < valueB ? -1 : 1);
        });
    }
}
