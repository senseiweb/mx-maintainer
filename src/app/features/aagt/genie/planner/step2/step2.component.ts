import { Component, OnInit, Output, EventEmitter, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { PlannerUowService } from '../planner-uow.service';
import { fuseAnimations } from '@fuse/animations';
import { MinutesExpand } from 'app/common';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { NewTriggerDialogComponent } from './new-trigger/new-trigger-dialog';
import { takeUntil } from 'rxjs/operators';
import { ConfirmDeleteModalComponent } from 'app/common/confirm-delete-modal/confirm-delete-modal.component';
import { Subject } from 'rxjs';
import { Trigger, ActionItem, ITriggerActionItemShell } from 'app/features/aagt/data';

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

    constructor(private formBuilder: FormBuilder, private trigdialog: MatDialog, private deleteDialog: MatDialog, private uow: PlannerUowService) {
        this.unsubscribeAll = new Subject();
        this.selectedTriggersAction = [];
    }

    ngOnInit() {
        this.allActionItems = this.uow.allActionItemOptions.filter((ai: ActionItem) => ai.assignable);
        this.triggerFormGroup = this.formBuilder.group({
            trigger: new FormControl()
        });

        this.updateStep2Status();

        this.triggerFormGroup
            .get('trigger')
            .valueChanges.pipe(takeUntil(this.unsubscribeAll))
            .subscribe((selectedTrigger: Trigger) => {
                if (!selectedTrigger) {
                    return;
                }
                this.uow.currentTrigger = selectedTrigger;
                this.allActionItems = this.allActionItems.concat(this.selectedTriggersAction.splice(0));

                this.allActionItems.forEach(item => (item['sequence'] = null));

                selectedTrigger.triggerActions.forEach(item => {
                    const actionItemIndex = this.allActionItems.findIndex(ai => ai.id === item.actionItemId);
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
        $event.items.forEach(item => {
            item.sequence = this.selectedTriggersAction.findIndex(ai => ai.id === item.id) + 1;

            this.uow.getTriggerAction({
                triggerId: this.currentTrigger.id,
                actionItemId: item.id,
                sequence: item.sequence
            });
        });
    }

    compareTrigger(trig1: Trigger, trig2: Trigger): boolean {
        return trig1 && trig2 ? trig1.id === trig2.id : trig1 === trig2;
    }

    deleteTrigger(): void {
        const dialogCfg = new MatDialogConfig();
        dialogCfg.data = { deleteItem: 'Trigger' };
        this.deleteDialog
            .open(ConfirmDeleteModalComponent, dialogCfg)
            .afterClosed()
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(confirmDelete => {
                if (!confirmDelete) {
                    return;
                }
                this.currentTrigger.triggerActions.forEach(tra => {
                    tra.assetTriggerActions.forEach(ata => ata.entityAspect.setDeleted());
                    tra.entityAspect.setDeleted();
                });
                this.currentTrigger.entityAspect.setDeleted();
                const index = this.triggers.findIndex(trig => this.currentTrigger.id === trig.id);
                this.triggers.splice(index, 1);
            });
        this.updateStep2Status();
    }

    editTrigger(): void {
        const dialogCfg = new MatDialogConfig();
        dialogCfg.data = this.currentTrigger;
        this.trigdialog
            .open(NewTriggerDialogComponent, dialogCfg)
            .afterClosed()
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(confirmedChange => {
                if (!confirmedChange) {
                    this.currentTrigger.entityAspect.rejectChanges();
                }
            });
    }

    newTrigger(): void {
        const dialogCfg = new MatDialogConfig();
        dialogCfg.data = this.uow.newTrigger(this.uow.currentGen.id);
        this.trigdialog
            .open(NewTriggerDialogComponent, dialogCfg)
            .afterClosed()
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(data => {
                if (data) {
                    this.triggers.push(data);
                    this.triggerFormGroup.controls['trigger'].setValue(data);
                    this.updateStep2Status();
                }
            });
    }

    removeShell($event: { items: ITriggerActionItemShell[] }): void {
        $event.items.forEach(shell => {
            const trigAct = this.currentTrigger.triggerActions.filter(item => item.actionItemId === shell.id)[0];
            trigAct.assetTriggerActions.forEach(ata => ata.entityAspect.setDeleted());
            trigAct.entityAspect.setDeleted();
            shell.sequence = null;
        });
    }

    reSequence($event: { items: ITriggerActionItemShell[] }): void {
        this.selectedTriggersAction.forEach((sta, i) => {
            const relatedTrigger = this.currentTrigger.triggerActions.filter(item => item.actionItemId === sta.id)[0];

            relatedTrigger.sequence = sta['sequence'] = i + 1;
        });
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

    private updateStep2Status(): void {
        this.uow.onStep2ValidityChange.next(!!this.triggers.length);
    }
}
