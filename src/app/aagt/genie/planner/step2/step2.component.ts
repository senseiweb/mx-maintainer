import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Generation, ActionItem, Trigger, TriggerAction } from 'app/aagt/data';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { PlannerUowService } from '../planner-uow.service';
import { BehaviorSubject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { MinutesExpand } from 'app/common';
import { MatDialog, MatDialogClose, MatDialogConfig } from '@angular/material';
import { NewTriggerDialogComponent } from './new-trigger/new-trigger-dialog';

interface ITriggerActionItemShell {
    id?: number;
    sequence?: number;
    shortCode?: string;
    action?: string;
    duration?: number;
    formattedDuration: string;
    teamType?: string;
}

@Component({
    selector: 'genie-plan-step2',
    templateUrl: './step2.component.html',
    styleUrls: ['./step2.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
    providers: [MinutesExpand]
})
export class Step2Component implements OnInit {
    currentTrigger: Trigger;
    @Input() plannedGen: Generation;

    triggers: Trigger[] = [];
    allActionItems: ITriggerActionItemShell[];
    selectedTriggersAction = [];
    onActionItemsChanged: BehaviorSubject<ActionItem[]>;
    triggerFormGroup: FormGroup;
    triggersEmpty = true;
    columnsToDisplay: string[];

    constructor(private formBuilder: FormBuilder,
        private minExpand: MinutesExpand,
        private trigdialog: MatDialog,
        private planUow: PlannerUowService) {
    }

    ngOnInit() {
        this.allActionItems = this.planUow.allActionItems.map((ai) => {
            return {
                id: ai.id,
                sequence: null,
                duration: ai.duration,
                shortCode: ai.shortCode,
                teamType: ai.teamType,
                action: ai.action,
                formattedDuration: this.minExpand.transform(ai.duration as any)

            } as ITriggerActionItemShell;
        });
        const trig1 = new Trigger();
        const trig2 = new Trigger();
        trig1.id = 1;
        trig2.id = 2;
        trig1.milestone = 'Warning Order';
        trig2.milestone = 'Execution Order';
        this.triggers = [trig1, trig2];
        this.triggerFormGroup = this.formBuilder.group({
            trigger: new FormControl({value: null, disabled: !this.triggers.length})
        });
    }

    addSequence($event: { items: ActionItem[] }): void {
        this.selectedTriggersAction.forEach((ai, i) => {
            ai.sequence = i + 1;
        });
        console.log($event);
    }

    compareTrigger(trig1: Trigger, trig2: Trigger): boolean {
        return trig1 && trig2 ? trig1.id === trig2.id : trig1 === trig2;
    }

    editTrigger(): void {
        const dialogCfg = new MatDialogConfig();
        dialogCfg.data = this.currentTrigger;
        this.trigdialog.open(NewTriggerDialogComponent, dialogCfg)
            .afterClosed()
            .subscribe(data => {
                if (data) { this.currentTrigger = data; }
            });
    }

    removeSequence($event: { items: any[] }): void {
        $event.items.forEach(i => i.sequence = null);
        console.log($event);
    }

    reSequence(): void {
        this.selectedTriggersAction.forEach((ai, i) => {
            ai.sequence = i;
        });
    }

    newTrigger(): void {
        const dialogCfg = new MatDialogConfig();
        dialogCfg.data = this.planUow.newTrigger(this.plannedGen.id);
        this.trigdialog.open(NewTriggerDialogComponent, dialogCfg)
            .afterClosed()
            .subscribe(data => {
                if (data) {
                    this.triggersEmpty = false;
                    this.triggers.push(data);
                    this.currentTrigger = data;
                    this.triggerFormGroup.controls['trigger'].setValue = data;
                }
            });
    }

    remove($event): void {
        console.log($event);
    }


}
