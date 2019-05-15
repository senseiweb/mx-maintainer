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
import { MinutesExpand } from 'app/common';
import { ActionItem, Trigger, AssetTriggerAction, GenerationAsset, TriggerAction } from 'app/features/aagt/data';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { PlannerUowService } from '../planner-uow.service';
import { AssetTriggerActionDataSource } from './asset-trig-action.datasource';
import { FuseConfirmDialogModule } from '@fuse/components';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'genie-plan-step-ata-list',
    templateUrl: './step-ata-list.component.html',
    styleUrls: ['./step-ata-list.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
    providers: [MinutesExpand]
})
export class StepAtaListComponent implements OnInit, OnDestroy {

    @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;

    currentTrigger: Trigger;

    triggers: Trigger[] = [];
    searchInput: FormControl;
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
    checkboxes: {};
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
        this.dataSource = new AssetTriggerActionDataSource(this.planUow);
        this.searchInput.valueChanges
            .pipe(
                takeUntil(this.unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                // this._contactsService.onSearchTextChanged.next(searchText);
            });
        this.planUow.onStepperChange.subscribe(stepEvent => {
            if (stepEvent.selectedIndex === 3) {
                this.planUow.reviewChanges();
            }
        });
    }

    ngOnDestroy(): void {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
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
