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
    Asset,
    AssetTriggerAction,
    GenerationAsset,
    Trigger,
    TriggerAction
} from 'app/features/aagt/data';
import * as _l from 'lodash';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PlannerUowService } from '../planner-uow.service';
import { TriggerDetailDialogComponent } from '../step-trig-action/trigger-detail/trigger-detail.dialog';
import { AssetTriggerActionDataSource } from './asset-trig-action.datasource';

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
    assetTriggerActions: AssetTriggerAction[];
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
        private trigdialog: MatDialog,
        private deleteDialog: MatDialog,
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

    planGeneration(triggerId?: number): void {
        this.planUow.planAssetTaskActions();
    }

    reactToModelChanges(): void {
        this.planUow.aagtEmService
            .onModelChanges('Trigger', 'PropertyChange', 'milestone')
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(_ => {
                this.updateTrigger();
            });
    }

    // editTrigger(): void {
    //     const dialogCfg = new MatDialogConfig();
    //     dialogCfg.data = this.currentTrigger;
    //     this.trigdialog
    //         .open(TriggerDetailDialogComponent, dialogCfg)
    //         .afterClosed()
    //         .pipe<IDialogResult<Trigger>>(takeUntil(this.unsubscribeAll))
    //         .subscribe(reesult => {
    //             if (reesult.confirmDeletion) {
    //                 if (!this.planUow.currentGen.triggers.length) {
    //                     this.triggerSelectionFormGroup.controls[
    //                         'trigger'
    //                     ].setValue('');
    //                 }
    //             } else {
    //                 // ReSort just in case the date was changed;
    //                 this.triggers.sort(this.triggerSorter);
    //             }
    //         });
    // }

    // setFilterLookups(): void {
    //     this.triggers = this.planUow.currentGen.triggers;
    //     const assets = _l.flatMap(
    //         this.planUow.currentGen.generationAssets,
    //         x => x.asset
    //     );
    //     this.assets = _l.uniqBy(assets, 'id');
    // }

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
