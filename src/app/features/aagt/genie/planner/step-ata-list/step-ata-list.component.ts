import {
    Component,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewChild,
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
    providers: [MinutesExpand]
})
export class StepAtaListComponent implements OnInit, OnDestroy {
    assetFilterChange = new BehaviorSubject('');

    @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;

    currentTrigger: Trigger;

    triggers: Trigger[] = [];
    triggerSelectionFormGroup: FormGroup;
    triggerFilterChange = new BehaviorSubject('');
    searchInput: FormControl;
    assets: Asset[];
    assetTriggerActions: AssetTriggerAction[];
    user: any;
    dataSource: AssetTriggerActionDataSource;
    displayedColumns = [
        'checkbox',
        'sequence',
        'alias',
        'action',
        'trigger',
        'status',
        'outcome'
    ];

    selectedContacts: any[];
    checkboxes = {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    private unsubscribeAll: Subject<any>;
    private genAssets: GenerationAsset[];
    private triggerActions: TriggerAction[];

    constructor(
        private planUow: PlannerUowService,
        private formBuilder: FormBuilder,
        private trigdialog: MatDialog,
        private deleteDialog: MatDialog
    ) {
        this.unsubscribeAll = new Subject();
        this.searchInput = new FormControl('');
    }

    ngOnInit() {
        this.dataSource = new AssetTriggerActionDataSource(
            this.planUow,
            this.triggerFilterChange,
            this.assetFilterChange
        );

        /** Creates the trigger selection group */
        this.triggerSelectionFormGroup = this.formBuilder.group({
            trigger: new FormControl(this.currentTrigger)
        });

        // this.planUow.onStepperChange.subscribe(stepEvent => {
        //     if (stepEvent.selectedIndex === 3) {
        //         this.planUow.reviewChanges();
        //     }
        // });

        this.planUow.aagtEmService
            .onModelChanges(['TriggerAction', 'GenerationAsset'], 'EntityState')
            .subscribe(notUsed => this.setFilterLookups());
    }

    ngOnDestroy(): void {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    changeAssetFilter(assetFilterText: string) {
        this.assetFilterChange.next(assetFilterText);
    }

    compareTrigger(trig1: Trigger, trig2: Trigger): boolean {
        return trig1 && trig2 ? trig1.id === trig2.id : trig1 === trig2;
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
                } else {
                    // ReSort just in case the date was changed;
                    this.triggers.sort(this.triggerSorter);
                }
            });
    }

    setFilterLookups(): void {
        this.triggers = this.planUow.currentGen.triggers;
        const assets = _l.flatMap(
            this.planUow.currentGen.generationAssets,
            x => x.asset
        );
        this.assets = _l.uniqBy(assets, 'id');
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

    get triggerFilter(): string {
        return this.triggerFilterChange.value;
    }
    set triggerFilter(triggerFilterText: string) {
        this.triggerFilterChange.next(triggerFilterText);
    }

    private triggerSorter = (a: Trigger, b: Trigger) => {
        return a.triggerStart < b.triggerStart ? -1 : 1;
    }
}
