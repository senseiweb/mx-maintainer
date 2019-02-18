import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Generation, ActionItem, Trigger, TriggerAction, ITriggerActionItemShell } from 'app/aagt/data';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { PlannerUowService } from '../planner-uow.service';
import { fuseAnimations } from '@fuse/animations';
import { MinutesExpand } from 'app/common';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { NewTriggerDialogComponent } from './new-trigger/new-trigger-dialog';
import { takeUntil } from 'rxjs/operators';
import { ConfirmDeleteModalComponent } from 'app/common/confirm-delete-modal/confirm-delete-modal.component';
import { Subject } from 'rxjs';

@Component({
    selector: 'genie-plan-step2',
    templateUrl: './step2.component.html',
    styleUrls: ['./step2.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
    providers: [MinutesExpand]
})
export class Step2Component implements OnInit, OnDestroy {
    currentTrigger: Trigger;
    @Output() step2Status = new EventEmitter<boolean>();
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
        this.allActionItems = this.planUow.allActionItems.filter((ai: ActionItem) => ai.availableForUse);
        this.triggerFormGroup = this.formBuilder.group({
            trigger: new FormControl()
        });

        this.updateStep2Status();

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

    addShell($event: { items: ITriggerActionItemShell[] }): void {
        $event.items.forEach(item  => {
            const trigActEntity = this.planUow
                .getOrCreateTriggerAction({ triggerId: this.currentTrigger.id, actionItemId: item.id });
            trigActEntity.sequence = item.sequence = this.selectedTriggersAction
                .findIndex(ai => ai.id === item.id) + 1;
        });
    }

    compareTrigger(trig1: Trigger, trig2: Trigger): boolean {
        return trig1 && trig2 ? trig1.id === trig2.id : trig1 === trig2;
    }

    deleteTrigger(): void {
        const dialogCfg = new MatDialogConfig();
        dialogCfg.data = { deleteItem: 'Trigger' };
        this.deleteDialog.open(ConfirmDeleteModalComponent, dialogCfg)
            .afterClosed()
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(confirmDelete => {
                if (!confirmDelete) { return; }
                this.currentTrigger.triggerActions.forEach(tra => { tra.entityAspect.setDeleted(); });
                this.currentTrigger.entityAspect.setDeleted();
                const index = this.triggers.findIndex(trig => this.currentTrigger.id === trig.id);
                this.triggers.splice(index, 1);
            });
        this.updateStep2Status();
    }

    editTrigger(): void {
        const dialogCfg = new MatDialogConfig();
        dialogCfg.data = this.currentTrigger;
        this.trigdialog.open(NewTriggerDialogComponent, dialogCfg)
            .afterClosed()
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(data => {
                if (!data) {
                    this.currentTrigger.entityAspect.rejectChanges();
                }
            });
    }

    newTrigger(): void {
        const dialogCfg = new MatDialogConfig();
        dialogCfg.data = this.planUow.newTrigger(this.planUow.currentGen.id);
        this.trigdialog.open(NewTriggerDialogComponent, dialogCfg)
            .afterClosed()
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(data => {
                if (data) {
                    this.triggers.push(data);
                    this.triggerFormGroup.controls['trigger']
                        .setValue(data);
                    this.updateStep2Status();
                }
            });
    }

    removeShell($event: { items: ITriggerActionItemShell[] }): void {
        $event.items.forEach(shell => {
            const trigAct = this.currentTrigger.triggerActions
                .filter(item => item.actionItemId === shell.id)[0];
            trigAct.entityAspect.setDeleted();
            shell.sequence = null;
        });
    }

    reSequence($event: { items: ITriggerActionItemShell[] }): void {
        this.selectedTriggersAction.forEach((sta, i) => {
            const relatedTrigger = this.currentTrigger
                .triggerActions
                .filter(item => item.actionItemId === sta.id)[0];

            relatedTrigger.sequence = sta['sequence'] =  i + 1;
        });
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

    private updateStep2Status(): void {
        this.step2Status.emit(!!this.triggers.length);
    }
}
