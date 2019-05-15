import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { IDialogResult, RawEntity } from '@ctypes/breeze-type-customization';
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
    private stepValid = false;
    selectedCache: ActionItem[] = [];
    unSelectedCache: ActionItem[] = [];
    triggerSelectionFormGroup: FormGroup;
    completionTime: number;

    private unsubscribeAll: Subject<any>;

    constructor(
        private formBuilder: FormBuilder,
        private trigdialog: MatDialog,
        private planUow: PlannerUowService
    ) {
        this.unsubscribeAll = new Subject();
    }

    ngOnInit() {
        /**
         * At this point filter out soft deleted trigger, but need to re
         * rethink this, as there isn't current way to ui to allow for
         * reverting trigger deletions.
         */
        this.triggers = this.planUow.currentGen.triggers;

        this.triggers.sort(this.triggerSorter);

        /** Creates the trigger selection group */
        this.triggerSelectionFormGroup = this.formBuilder.group({
            trigger: new FormControl(this.currentTrigger)
        });

        /**
         * Listen for changes on the trigger selection form.
         * On change filter the selected action based on each
         * of the selected trigger
         */
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
        this.updateStepValidity(!!this.planUow.currentGen.triggers.length);
    }

    ngOnDestroy(): void {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    /**
     * Method called the user input moves over Actions from the
     * available Action list to the assigned Trigger Action.
     */
    addActionItem($event: { items: ActionItem[] }): void {
        const triggerActions = this.currentTrigger.triggerActions;
        const genAssets = this.planUow.currentGen.generationAssets;

        /** Flatten all AssetTriggerAction to undelete if found */
        const assetTrigActions = _.flatMap(
            triggerActions,
            x => x.assetTriggerActions
        );

        /**
         * Loap over all the asset items that were added to the selected list
         * for this generation.
         */ $event.items.forEach(actionItem => {
            /** Check if this TriggerActionItem was already created */
            const existingTrigAct = triggerActions.find(
                ta => ta.actionItemId === actionItem.id
            );

            /**
             * If a matching TriggerActionItem is found, then it must have been
             * soft deleted, instead of recreating simply un-softDelete them.
             * Then check if any grand children (Asset Trig Action) are eligible
             * to unsoft delete it.
             */
            if (existingTrigAct) {
                existingTrigAct.isSoftDeleted = false;

                /**
                 * Filter through all the Asset Trigger Actions and selected the
                 * ones where the co-parenet (GenerationAsset) has not been softDeleted
                 * and is a child of this TriggerActionItem. If any exisit set their
                 * soft deletion flag to false.
                 */
                assetTrigActions
                    .filter(
                        ata =>
                            !ata.genAsset.isSoftDeleted &&
                            ata.triggerActionId === existingTrigAct.id
                    )
                    .forEach(ata => (ata.isSoftDeleted = false));
            } else {
                /**
                 * Since an exisiting TriggerActionItem doesn't exists,
                 * create a new one, then loop through the exisiting but not
                 * soft-deleted co-parent (GenerationAsset) and create children
                 */
                const defaultProps: RawEntity<TriggerAction> = {
                    trigger: this.currentTrigger,
                    actionItem
                };

                const triggerAction = this.currentTrigger.createChild(
                    'TriggerAction',
                    defaultProps
                );

                genAssets
                    .filter(ga => !ga.isSoftDeleted)
                    .forEach(genAsset => {
                        genAsset.createChild('AssetTriggerAction', {
                            genAsset,
                            triggerAction
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
        const actionItems = this.planUow.allActionItems;
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
                    if (!this.planUow.currentGen.triggers.length) {
                        this.triggerSelectionFormGroup.controls[
                            'trigger'
                        ].setValue('');
                    }
                    this.updateStepValidity(
                        !!this.planUow.currentGen.triggers.length
                    );
                } else {
                    // ReSort just in case the date was changed;
                    this.triggers.sort(this.triggerSorter);
                }
            });
    }

    createNewTrigger(): void {
        const dialogCfg = new MatDialogConfig();
        dialogCfg.data = this.planUow.createNewTrigger(
            this.planUow.currentGen.id
        );
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

                this.triggers = this.planUow.currentGen.triggers;

                if (!this.triggers.length) {
                    this.currentTrigger = undefined;
                    return;
                }

                this.triggers.sort(this.triggerSorter);

                this.triggerSelectionFormGroup.controls['trigger'].setValue(
                    result.value || this.triggers[0]
                );

                this.updateStepValidity(true);
            });
    }

    /** Called by the picker when items are added to selected list */
    removeActionItem($event: { items: ActionItem[] }): void {
        const triggerActions = this.currentTrigger.triggerActions;
        /**
         * Loap over all the asset items that were removed from the selected list
         * for this generation.
         */
        $event.items.forEach(actionItem => {
            /**
             * Marked the removed GenAsset as softDeleted and popagate the
             * the changes to any exisiting children (Asset Trigger Actions)
             */
            const existingTrigAct = triggerActions.find(
                trigAct => trigAct.actionItemId === actionItem.id
            );

            existingTrigAct.isSoftDeleted = true;
            existingTrigAct.assetTriggerActions.forEach(
                ata => (ata.isSoftDeleted = true)
            );

            /**
             * Finally set the "sequence" as undefined so that the picker will
             * use the correct template.
             */
            actionItem['sequence'] = undefined;
        });

        this.completionTime = this.calculateCompeletionTime();
        this.updateStepValidity(!!this.planUow.currentGen.triggers.length);
        this.reSequence();
    }

    /**
     * Called by the picker when items are shuffled by the picker
     * or called internally whenever items are added or removed to
     * ensure the sequece are in a consistenent state.
     */
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

    /**
     * Every time the step is change from this step [index 1]
     * check if the step is still valid, in this case step
     * is considered valid if there are triggers present/
     */
    private updateStepValidity(hasTriggers: boolean): void {
        if (this.stepValid === hasTriggers) {
            return;
        }

        this.stepValid = hasTriggers;

        this.planUow.onStepValidityChange.next({
            [PlannerSteps[PlannerSteps.TrigAction]]: {
                isValid: hasTriggers
            }
        });
    }
}
