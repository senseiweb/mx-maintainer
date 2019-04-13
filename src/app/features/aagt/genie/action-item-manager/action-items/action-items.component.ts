import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { ActionItem } from 'app/features/aagt/data';
import { FilesDataSource } from 'app/global-data/';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { AimUowService } from '../aim-uow.service';

@Component({
    selector: 'app-action-items',
    templateUrl: './action-items.component.html',
    styleUrls: ['./action-items.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class ActionItemsComponent implements OnInit, OnDestroy {
    dataSource: FilesDataSource<ActionItem>;
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

    private unsubscribeAll: Subject<any>;

    constructor(private aimUow: AimUowService, private route: ActivatedRoute) {
        this.unsubscribeAll = new Subject();
    }

    ngOnInit() {
        this.dataSource = new FilesDataSource(
            this.aimUow.onActionItemsChanged.value,
            this.paginator,
            this.sort,
            this.aimUow.onActionItemsChanged
        );

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
}
