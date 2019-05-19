import {
    Component,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
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
import { EntityAction } from 'breeze-client';
import * as _ from 'lodash';
import { BehaviorSubject, Subject } from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    filter,
    takeUntil
} from 'rxjs/operators';
import { PlannerUowService } from '../planner-uow.service';
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
        this.searchInput.valueChanges
            .pipe(
                takeUntil(this.unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                // this._contactsService.onSearchTextChanged.next(searchText);
            });
        // this.planUow.onStepperChange.subscribe(stepEvent => {
        //     if (stepEvent.selectedIndex === 3) {
        //         this.planUow.reviewChanges();
        //     }
        // });

        this.planUow.aagtEmService
            .onModelChanges('TriggerAction', 'EntityState')
            .pipe(
                filter(
                    ec =>
                        ec.entityAction === EntityAction.EntityStateChange &&
                        (ec.entity.shortname === 'TriggerAction' ||
                            ec.entity.shortname === 'GenerationAsset')
                )
            )
            .subscribe(notUsed => this.setFilterLookups());
    }

    ngOnDestroy(): void {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    get assetFilter(): string {
        return this.assetFilterChange.value;
    }
    set assetFilter(assetFilterText: string) {
        this.assetFilterChange.next(assetFilterText);
    }

    setFilterLookups(): void {
        this.triggers = this.planUow.currentGen.triggers;
        const assets = _.flatMap(
            this.planUow.currentGen.generationAssets,
            x => x.asset
        );
        this.assets = _.uniqBy(assets, 'id');
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
}
