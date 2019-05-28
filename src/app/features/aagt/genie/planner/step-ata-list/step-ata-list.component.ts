import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { IDialogResult } from '@ctypes/breeze-type-customization';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MinutesExpand } from 'app/common';
import {
    ActionItem,
    AssetTriggerAction,
    Trigger
} from 'app/features/aagt/data';
import * as _l from 'lodash';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PlannerUowService } from '../planner-uow.service';
import { AssetTriggerActionDataSource } from './asset-trig-action.datasource';
import { AtaDetailDialogComponent } from './ata-detail/ata-detail.dialog';

@Component({
    selector: 'genie-plan-step-ata-list',
    templateUrl: './step-ata-list.component.html',
    styleUrls: ['./step-ata-list.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
    providers: [MinutesExpand],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepAtaListComponent implements OnInit, OnDestroy {
    assetFilterChange = new BehaviorSubject('all');
    actionFilterChange = new BehaviorSubject('all');
    triggerFilterChange = new BehaviorSubject('all');

    triggerMilestones: string[] = [];
    triggerSelectionFormGroup: FormGroup;
    // assetTriggerActions: AssetTriggerAction[];
    dataSource: AssetTriggerActionDataSource;
    displayedColumns = [
        'sequence',
        'alias',
        'action',
        'trigger',
        'status',
        'plannedStart',
        'buttons'
    ];

    selectedContacts: any[];
    checkboxes = {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    private unsubscribeAll: Subject<any> = new Subject();

    constructor(
        private planUow: PlannerUowService,
        private formBuilder: FormBuilder,
        private ataDialog: MatDialog,
        private cdRef: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.dataSource = new AssetTriggerActionDataSource(
            this.planUow,
            this.triggerFilterChange,
            this.assetFilterChange,
            this.actionFilterChange
        );

        this.createFormGroup();
        this.reactToModelChanges();
    }

    ngOnDestroy(): void {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    changeAssetFilter(assetFilterText: string) {
        this.assetFilterChange.next(assetFilterText);
    }

    changeActionFilter(actionFilterText: string) {
        this.actionFilterChange.next(actionFilterText);
    }

    createFormGroup(): void {
        const triggerMilestone = new FormControl('all');

        triggerMilestone.valueChanges
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(milestone => this.triggerFilterChange.next(milestone));

        /** Creates the trigger selection group */
        this.triggerSelectionFormGroup = this.formBuilder.group({
            triggerMilestone
        });

        this.updateTrigger();
    }

    editAta(ata: AssetTriggerAction): void {
        const dialogCfg = new MatDialogConfig();
        dialogCfg.panelClass = 'generation-detail-dialog';
        dialogCfg.data = ata;
        dialogCfg.disableClose = true;
        this.ataDialog
            .open(AtaDetailDialogComponent, dialogCfg)
            .afterClosed()
            .pipe<IDialogResult<AssetTriggerAction>>(
                takeUntil(this.unsubscribeAll)
            )
            .subscribe(result => {
                if (!result || result.wasConceled) {
                    return;
                }
            });
    }

    planAll(): void {
        const atas = _l.flatMap(
            this.planUow.currentGen.teamJobReservations,
            x => x.assetTriggerAction
        );

        atas.forEach(ata => {
            ata.plannedStart = undefined;
            ata.plannedStop = undefined;
        });

        this.planUow.currentGen.teamJobReservations.forEach(tjr =>
            tjr.entityAspect.setDeleted()
        );
        this.planAtas();
    }

    planAtas(triggerId?: number): void {
        const trigId = triggerId && +triggerId;
        this.planUow.planAssetTaskActions(trigId);
    }

    reactToModelChanges(): void {
        this.planUow.aagtEmService
            .onModelChanges('Trigger', 'PropertyChange', 'milestone')
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(_ => {
                this.updateTrigger();
            });
    }

    reSequenceTask($event: CdkDragDrop<AssetTriggerAction>): void {
        /**
         * Access the ATA entity that has been dropped.
         */
        const ataElement = $event.item.data as AssetTriggerAction;

        /**
         * Looking at the current Generation, flatMap all the ATAs that
         * are siblings on the dropped ATA by first filtering the parent
         * GenerationAsset, then filtering out all the sibling ATA will a lower
         * sequence number that will not have to be reSequenced and finally
         * filtering out the dropped ATA element.
         */
        const ataElementSiblings = _l.flatMap(
            this.planUow.currentGen.generationAssets.filter(
                ga => ga.id === ataElement.generationAssetId
            ),
            x =>
                x.assetTriggerActions.filter(
                    ata => ata.sequence >= ataElement.sequence
                )
        );

        /**
         * Sort affected ATA by their sequence number.
         */
        const orderedAtas = _l.orderBy(ataElementSiblings, x => x.sequence);

        /**
         * set the new sequence by adding 1 to convert sequence from zero based to
         * 1 based number and adding another 1 to account from the ataElement that
         * was dropped in this spot.
         */
        let newSequence = $event.currentIndex + 2;

        /**
         * Loop through the affected ATAs and reSequence them according to their previous
         * sequence +1.
         */
        orderedAtas.forEach(ata => {
            ata.sequence = newSequence;
            newSequence++;
        });

        /**
         * Last step is to set the dropped ataElement's sequence to its dropped
         * location + 1 (to current from zero-based index)
         */
        ataElement.sequence = newSequence + 1;
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

    private triggerSorter = (a: Trigger, b: Trigger) => {
        return a.triggerStart < b.triggerStart ? -1 : 1;
    }

    private updateTrigger(): void {
        const triggers = this.planUow.currentGen.triggers;
        triggers.sort(this.triggerSorter);
        this.triggerMilestones = triggers.map(trig => trig.milestone);
    }
}
