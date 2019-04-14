import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { MinutesExpand } from 'app/common';
import {
    ActionItem,
    ITriggerActionItemShell,
    Trigger
} from 'app/features/aagt/data';
import { Subject, Observable } from 'rxjs';
import { takeUntil, map, switchMap } from 'rxjs/operators';
import * as sa from 'sweetalert2';
import { PlannerUowService } from '../planner-uow.service';
import { NewTriggerDialogComponent } from './new-trigger/new-trigger-dialog';
import { bareEntity } from '@ctypes/breeze-type-customization';
import { trigger } from '@angular/animations';

type TriggerModelProps = keyof bareEntity<Trigger> | 'triggerDateRange';
type TriggerFormModel = { [key in TriggerModelProps]: any };

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
    allActionItems: Observable<ActionItem[]>;
    selectedActionItems: ActionItem[];
    triggerSelectionFormGroup: FormGroup;
    completionTime: number;
    private modelProps: TriggerModelProps[] = [
        'milestone',
        'triggerStart',
        'triggerStop',
        'triggerDateRange'
    ]
    private unsubscribeAll: Subject<any>;

    constructor(
        private formBuilder: FormBuilder,
        private trigdialog: MatDialog,
        private uow: PlannerUowService
    ) {
        this.unsubscribeAll = new Subject();
        this.selectedActionItems = [];
    }

    ngOnInit() {

        this.uow.onStepperChange
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(stepEvent => {
            if (stepEvent.previouslySelectedIndex === 1) {
                this.uow.triggerActionSelectionCheck();
            }
            });

        const formModel: TriggerFormModel = {} as any;
        const genType = gen.entityType;

        this.triggerSelectionFormGroup = this.formBuilder.group({
            triggerSelect: new FormControl(this.currentTrigger)
        })

        this.triggerSelectionFormGroup
            .valueChanges
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((selectedTrigger: Trigger) => {
                if (!selectedTrigger) {
                    return;
                }

            });
        
        this.allActionItems = this.uow.allActionItems.pipe(
            map(ai => ai.filter(a => a.assignable)),
            switchMap(ais => {
                return 
            },
            map()
            takeUntil(this.unsubscribeAll)
        );
        
        this.triggers = this.uow.currentGen.triggers;

        this.uow.onStepValidityChange.next({
            trigAction: {
                isValid: !!this.triggers.length
            }
        });

        // this.triggerFormGroup
        //     .get('trigger')
        //     .valueChanges.pipe(takeUntil(this.unsubscribeAll))
        //     .subscribe((selectedTrigger: Trigger) => {
        //         if (!selectedTrigger) {
        //             return;
        //         }

        //         // clear all previous selected actionItem and put them back in the unselected pile
        //         if (this.selectedActionItems.length) {
        //             this.allActionItems = this.allActionItems.concat(
        //                 this.selectedActionItems.splice(0)
        //             );
        //         }

        //         // reset all sequence numbers to null
        //         this.allActionItems.forEach(ai => {
        //             ai['sequence'] = undefined;
        //         });

        //         // map temp items, if they do not exist
        //         if (
        //             !selectedTrigger.tempActionItems.length &&
        //             selectedTrigger.triggerActions.length
        //         ) {
        //             selectedTrigger.tempActionItems = selectedTrigger.triggerActions.map(
        //                 tra => {
        //                     return {
        //                         actionItemId: tra.actionItemId,
        //                         sequence: tra.sequence
        //                     };
        //                 }
        //             );
        //         }

        //         // re-calcuate selected action items based on new selected triggers

        //         selectedTrigger.tempActionItems.forEach(actItem => {
        //             const index = this.allActionItems.findIndex(
        //                 ai => ai.id === actItem.actionItemId
        //             );
        //             const actionItem = this.allActionItems.splice(index, 1)[0];
        //             actionItem['sequence'] = actItem.sequence;
        //             this.selectedActionItems.push(actionItem);
        //         });
        //         this.sortActionItem(this.selectedActionItems, 'sequence');
        //         this.sortActionItem(this.allActionItems, 'teamType');
        //         this.currentTrigger = selectedTrigger;
        //         this.completionTime = this.calculateCompeletionTime();
        //     });
    }

    ngOnDestroy(): void {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    addShell($event: { items: ITriggerActionItemShell[] }): void {
        $event.items.forEach(item => {
            const sequence = (item.sequence =
                this.selectedActionItems.findIndex(ai => ai.id === item.id) +
                1);

            this.currentTrigger.tempActionItems.push({
                actionItemId: item.id,
                sequence
            });

            this.completionTime = this.calculateCompeletionTime();
        });
    }

    calculateCompeletionTime(): number {
        return this.selectedActionItems
            .map(x => x.duration)
            .reduce((duration1, duration2) => duration1 + duration2, 0);
    }

    compareTrigger(trig1: Trigger, trig2: Trigger): boolean {
        return trig1 && trig2 ? trig1.id === trig2.id : trig1 === trig2;
    }

    deleteTrigger(): void {
        const config: sa.SweetAlertOptions = {
            title: 'Delete Trigger?',
            text: `Are you sure you?
            All associated trigger action will be deleted as well!
            This action cannot be undone!`,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        };
        sa.default.fire(config).then(result => {
            if (!result.value) {
                return;
            }
            this.uow.deleteTriggerGraph(this.currentTrigger);
            const index = this.triggers.findIndex(
                trig => this.currentTrigger.id === trig.id
            );
            this.triggers.splice(index, 1);
            sa.default.fire('Deleted!', 'Trigger has been deleted', 'success');
        });
        
        this.uow.onStepValidityChange.next({
            trigAction: {
                isValid: !!this.triggers.length
            }
        });
    }
    
    filterBySelectedTriger(actionItems: ActionItem[]): Observable<ActionItem[]> {
        return this.triggerSelectionFormGroup.valueChanges.pipe(
            map((selectedTrigger: Trigger) => {
                const ids = selectedTrigger.tempActionItems.map(tai => tai.actionItemId);
                 return actionItems.filter(ai => !ids.includes(ai.id))
            })
        );    }

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
                    this.uow.onTriggersChange.next(this.triggers);
                    this.triggerFormGroup.controls['trigger'].setValue(data);
                    this.uow.onStep2ValidityChange.next(!!this.triggers.length);
                }
            });
    }

    removeShell($event: { items: ITriggerActionItemShell[] }): void {
        $event.items.forEach(item => {
            const index = this.currentTrigger.tempActionItems.findIndex(
                ai => ai.actionItemId === item.id
            );
            this.currentTrigger.tempActionItems.splice(index, 1);
            item.sequence = undefined;
        });
        this.reSequence();
        this.completionTime = this.calculateCompeletionTime();
    }

    reSequence($event?: { items: ITriggerActionItemShell[] }): void {
        this.selectedActionItems.forEach((sta, i) => {
            const sequence = i + 1;
            const relatedTra = this.currentTrigger.tempActionItems.filter(
                item => item.actionItemId === sta.id
            )[0];

            if (relatedTra.sequence !== sequence) {
                relatedTra.sequence = sta['sequence'] = sequence;
            }
        });
        this.completionTime = this.currentTrigger.completionTime;
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
