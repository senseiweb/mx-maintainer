import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {
    MatDialog,
    MatDialogConfig,
    MatPaginator,
    MatSort,
    MatTableDataSource
} from '@angular/material';
import { IDialogResult } from '@ctypes/breeze-type-customization';
import { fuseAnimations } from '@fuse/animations';
import { ActionItem } from 'app/features/aagt/data';
import { fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ActionItemDetailDialogComponent } from '../action-item-detail/action-item-detail.dialog';
import { AimUowService } from '../aim-uow.service';

@Component({
    selector: 'app-action-items',
    templateUrl: './action-items.component.html',
    styleUrls: ['./action-items.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionItemsComponent implements OnInit, OnDestroy {
    dataSource: MatTableDataSource<ActionItem>;
    displayedColumns = [
        'id',
        'shortCode',
        'action',
        'teamCategory',
        'duration',
        'availability'
    ];
    @ViewChild(MatPaginator)
    paginator: MatPaginator;

    @ViewChild(MatSort)
    sort: MatSort;

    @ViewChild('filter')
    filter: ElementRef;

    isSaving: Observable<boolean>;

    private unsubscribeAll: Subject<any>;

    constructor(
        private aimUow: AimUowService,
        private actionItemDialog: MatDialog,
        private cdRef: ChangeDetectorRef
    ) {
        this.unsubscribeAll = new Subject();
    }

    ngOnInit() {
        this.dataSource = new MatTableDataSource(this.aimUow.allActionItems);

        fromEvent(this.filter.nativeElement, 'keyup')
            .pipe(
                takeUntil(this.unsubscribeAll),
                debounceTime(1500),
                distinctUntilChanged()
            )
            .subscribe(() => {
                if (!this.dataSource) {
                    return;
                }
                this.dataSource.filter = this.filter.nativeElement.value;
            });
    }

    ngOnDestroy() {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    addNewActionItem(): void {
        const newAction = this.aimUow.createActionItem();
        this.editActionItem(newAction);
    }

    editActionItem(selectedItem: ActionItem) {
        const dialogCfg = new MatDialogConfig();
        dialogCfg.panelClass = 'action-item-detail-dialog';
        dialogCfg.data = selectedItem;
        dialogCfg.disableClose = true;
        this.actionItemDialog
            .open(ActionItemDetailDialogComponent, dialogCfg)
            .afterClosed()
            .pipe<IDialogResult<ActionItem>>(takeUntil(this.unsubscribeAll))
            .subscribe(result => {});
    }
}
