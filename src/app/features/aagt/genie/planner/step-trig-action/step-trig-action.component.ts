import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { bareEntity, IDialogResult } from '@ctypes/breeze-type-customization';
import { fuseAnimations } from '@fuse/animations';
import { MinutesExpand } from 'app/common';
import { ActionItem, Trigger, TriggerAction } from 'app/features/aagt/data';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { PlannerUowService } from '../planner-uow.service';
import { PlannerSteps } from '../planner.component';
import { TriggerDetailDialogComponent } from './trigger-detail/trigger-detail.dialog';

@Component({
    selector: 'genie-plan-trig-actions',
    templateUrl: './step-trig-action.component.html',
    styleUrls: ['./step-trig-action.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
    providers: [MinutesExpand]
})
export class StepTrigActionComponent implements OnInit, OnDestroy {
    currentTrigger: Trigger;
    triggers: Trigger[];
    selectedCache: ActionItem[] = [];
    unSelectedCache: ActionItem[] = [];
    triggerSelectionFormGroup: FormGroup;
    completionTime: number;

    private unsubscribeAll: Subject<any>;

    constructor(
        private formBuilder: FormBuilder,
        private trigdialog: MatDialog,
        private uow: PlannerUowService
    ) {
        this.unsubscribeAll = new Subject();
    }

    ngOnInit() {
        this.triggers = this.uow.currentGen.triggers.filter(
            t => !t.isSoftDeleted
        );
        this.triggers.sort(this.triggerSorter);

        this.uow.onStepperChange
            .pipe(
                filter(sc => sc.selectedIndex === 1),
                takeUntil(this.unsubscribeAll)
            )
            .subscribe(_ => {
                this.uow.onStepValidityChange.next({
                    [PlannerSteps[PlannerSteps.TrigAction]]: {
                        isValid: !!this.triggers.filter(t => !t.isSoftDeleted)
                            .length
                    }
                });
            });

        this.triggerSelectionFormGroup = this.formBuilder.group({
            trigger: new FormControl(this.currentTrigger)
        });

        this.triggerSelectionFormGroup
            .get('trigger')
            .valueChanges.pipe(takeUntil(this.unsubscribeAll))
            .subscribe(selectedTrigger => {
                this.currentTrigger = selectedTrigger;
                this.filterBasedOnTrigger(selectedTrigger);
            });

        // if triggers exist set a defult selected value
        if (this.triggers.length) {
            this.triggerSelectionFormGroup.setValue({
                triggerSelect: this.triggers[0]
            });
        }
    }

    ngOnDestroy(): void {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    /**
     * Method called when the user input moves over Actions from the
     * available Action list to the assigned Trigger Action.
     */
    addActionItem($event: { items: ActionItem[] }): void {
        const triggerActions = this.currentTrigger.triggerActions;

        /** Loop over the available, */
        $event.items.forEach(actionItem => {
            const existingTrigAct = triggerActions.find(
                ta => ta.actionItemId === actionItem.id
            );

            if (existingTrigAct) {
                existingTrigAct.isSoftDeleted = false;
                existingTrigAct.assetTriggerActions.forEach(
                    atas => !atas.isSoftDeleted
                );
            } else {
                const defaultProps: bareEntity<TriggerAction> = {
                    trigger: this.currentTrigger,
                    actionItem
                };

                const newTrigAction = this.currentTrigger.createChild('Trigger', {
                    generationId: 
                });
                this.currentTrigger.generation.generationAssets.forEach(ga => {
                    ga.createChild('GenerationAsset', {
                        asset: ga.asset
                    });
                });
            }
        });

        this.completionTime = this.calculateCompeletionTime();

        this.reSequence();
    }

    calculateCompeletionTime(): number {
        return this.selectedCache
            .map(x => x.duration)
            .reduce((duration1, duration2) => duration1 + duration2, 0);
    }

    compareTrigger(trig1: Trigger, trig2: Trigger): boolean {
        return trig1 && trig2 ? trig1.id === trig2.id : trig1 === trig2;
    }

    filterBasedOnTrigger(selectedTrigger: Trigger): void {
        const actionItems = this.uow.allActionItems;
        const triggerActionItems = selectedTrigger
            ? selectedTrigger.triggerActions.filter(
                  trigAct => !trigAct.isSoftDeleted
              )
            : [];

        this.unSelectedCache.length = 0;
        this.selectedCache.length = 0;

        actionItems.forEach(ai => {
            const existingTrigAct = triggerActionItems.find(
                trigAct => trigAct.actionItemId === ai.id
            );

            if (existingTrigAct) {
                ai['sequence'] = existingTrigAct.sequence;
                this.selectedCache.push(ai);
            } else {
                ai['sequnce'] = undefined;
                this.unSelectedCache.push(ai);
            }
        });

        this.selectedCache.sort(this.selectCacheSorter);
        this.unSelectedCache.sort(this.unselectedCacheSorter);
    }

    editTrigger(): void {
        const dialogCfg = new MatDialogConfig();
        dialogCfg.data = this.currentTrigger;
        this.trigdialog
            .open(TriggerDetailDialogComponent, dialogCfg)
            .afterClosed()
            .pipe<IDialogResult<Trigger>>(takeUntil(this.unsubscribeAll))
            .subscribe(reesult => {
                if (reesult.confirmDeletion) {
                    if (!this.uow.currentGen.triggers.length) {
                        this.triggerSelectionFormGroup.controls[
                            'trigger'
                        ].setValue('');
                    }
                } else {
                    // ReSort just in case the date was changed;
                    this.triggers.sort(this.triggerSorter);
                }
            });
    }

    createNewTrigger(): void {
        const dialogCfg = new MatDialogConfig();
        dialogCfg.data = this.uow.createNewTrigger(this.uow.currentGen.id);
        dialogCfg.disableClose = true;
        dialogCfg.panelClass = 'trigger-detail-dialog';
        this.trigdialog
            .open(TriggerDetailDialogComponent, dialogCfg)
            .afterClosed()
            .pipe<IDialogResult<Trigger>>(takeUntil(this.unsubscribeAll))
            .subscribe(result => {
                if (result.wasConceled) {
                    return;
                }

                this.triggers = this.uow.currentGen.triggers.filter(
                    t => !t.isSoftDeleted
                );

                this.triggers.sort(this.triggerSorter);

                this.triggerSelectionFormGroup.controls['trigger'].setValue(
                    result.value || this.triggers[0]
                );

                this.uow.onStepValidityChange.next({
                    [PlannerSteps[PlannerSteps.TrigAction]]: {
                        isValid: true
                    }
                });
            });
    }

    removeActionItem($event: { items: ActionItem[] }): void {
        const triggerActions = this.currentTrigger.triggerActions;

        $event.items.forEach(actionItem => {
            const existingTrigAct = triggerActions.find(
                trigAct => trigAct.actionItemId === actionItem.id
            );

            existingTrigAct.isSoftDeleted = true;

            actionItem['sequence'] = undefined;
        });

        this.completionTime = this.calculateCompeletionTime();
        this.reSequence();
    }

    reSequence(): void {
        const triggerActions = this.currentTrigger.triggerActions;

        this.selectedCache.forEach((scAction, index) => {
            const sequence = index + 1;
            const trigAction = triggerActions.find(
                trigAct =>
                    trigAct.actionItemId === scAction.id &&
                    !trigAct.isSoftDeleted
            );

            trigAction.sequence = trigAction.sequence !== sequence && sequence;

            scAction['sequence'] = sequence;
        });

        this.unSelectedCache.sort(this.unselectedCacheSorter);
    }

    private selectCacheSorter = (a: ActionItem, b: ActionItem): number => {
        return a['sequence'] < b['sequence'] ? -1 : 1;
    }

    private triggerSorter = (a: Trigger, b: Trigger) => {
        return a.triggerStart < b.triggerStart ? -1 : 1;
    }

    private unselectedCacheSorter = (a: ActionItem, b: ActionItem): number => {
        return a.teamCategory.teamType < b.teamCategory.teamType ? -1 : 1;
    }
}
