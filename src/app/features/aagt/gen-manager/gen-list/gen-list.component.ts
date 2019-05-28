import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { fromEvent, BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { GenMgrUowService } from '../gen-mgr-uow.service';
import { GenListDataSource } from './gen-list.datasource';

@Component({
    selector: 'app-gen-list',
    templateUrl: './gen-list.component.html',
    animations: fuseAnimations,
    styleUrls: ['./gen-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class GenListComponent implements OnInit {
    dataSource: GenListDataSource;
    onFilterTextChange = new BehaviorSubject('');

    displayedColumns = [
        'id',
        'title',
        'iso',
        'status',
        'genStart',
        'assignedAssetCount'
    ];

    @ViewChild(MatPaginator)
    paginator: MatPaginator;

    @ViewChild(MatSort)
    sort: MatSort;

    @ViewChild('filter')
    filter: ElementRef;

    private _unsubscribeAll: Subject<any>;

    constructor(private genMgrUow: GenMgrUowService) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.dataSource = new GenListDataSource(
            this.genMgrUow,
            this.paginator,
            this.sort,
            this.onFilterTextChange
        );

        fromEvent(this.filter.nativeElement, 'keyup')
            .pipe(
                debounceTime(150),
                distinctUntilChanged(),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(() => {
                if (!this.dataSource) {
                    return;
                }
                this.onFilterTextChange.next(this.filter.nativeElement);
            });
    }
}
