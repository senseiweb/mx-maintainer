import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { AimUowService } from '../aim-uow.service';
import { FilesDataSource } from './action-item-datasource';

@Component({
    selector: 'app-action-items',
    templateUrl: './action-items.component.html',
    styleUrls: ['./action-items.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class ActionItemsComponent implements OnInit {
    dataSource: FilesDataSource;
    displayedColumns = ['id', 'shortCode', 'action', 'assignedTeamType', 'duration', 'availability', 'notes'];
    @ViewChild(MatPaginator)
    paginator: MatPaginator;

    @ViewChild(MatSort)
    sort: MatSort;

    @ViewChild('filter')
    filter: ElementRef;

    private unsubscribeAll: Subject<any>;

    constructor (private aimUow: AimUowService, private route: ActivatedRoute) {
        this.unsubscribeAll = new Subject();

    }

    ngOnInit() {
        this.dataSource = new FilesDataSource(this.aimUow, this.paginator, this.sort, this.route);

        fromEvent(this.filter.nativeElement, 'keyup')
            .pipe(
                takeUntil(this.unsubscribeAll),
                debounceTime(1500),
                distinctUntilChanged()
            )
            .subscribe(() => {
                if (!this.dataSource) { return; }
                this.dataSource.filter = this.filter.nativeElement.value;
            });

    }
}
