import { DataSource } from '@angular/cdk/table';
import { MatPaginator, MatSort } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { FuseUtils } from '@fuse/utils';
import { ActionItem } from 'app/aagt/data';
import { bareEntity } from 'app/data';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AimUowService } from '../aim-uow.service';

export class FilesDataSource extends DataSource<ActionItem> {

    private filterChange = new BehaviorSubject('');
    private filterDataChange: BehaviorSubject<ActionItem[]>;
    constructor (
        private aimUow: AimUowService,
        private matPaginator: MatPaginator,
        private matSort: MatSort,
        route: ActivatedRoute
    ) {
        super();
        this.filterDataChange = new BehaviorSubject('') as any;
        this.filterData = route.snapshot.params.actionItems;
        console.log(route);
        console.log(aimUow);
    }

    connect(): Observable<ActionItem[]> {
        const displayDataChanges = [
            this.aimUow.onActionItemsChanged,
            this.matPaginator.page,
            this.filterChange,
            this.matSort.sortChange
        ];

        return merge(...displayDataChanges)
            .pipe(
                map(() => {
                    let data = this.aimUow.actions.slice();
                    data = this.filterData(data);
                    this.filteredData = [...data];
                    data = this.sortData(data);

                    // Grab the page's slice of data.
                    const startIndex = this.matPaginator.pageIndex * this.matPaginator.pageSize;
                    return data.splice(startIndex, this.matPaginator.pageSize);

                })
            );
    }

    get filter(): string {
        return this.filterChange.value;
    }

    set filter(filter: string) {
        this.filterChange.next(filter);
    }

    get filteredData(): ActionItem[] {
        return this.filterDataChange.value;
    }

    set filteredData(value: ActionItem[]) {
        this.filterDataChange.next(value);
    }

    filterData(data: ActionItem[]): ActionItem[] {
        if (!this.filter) {
            return data;
        }
        return FuseUtils.filterArrayByString(data, this.filter) as ActionItem[];
    }

    sortData(data: ActionItem[]): ActionItem[] {
        if (!this.matSort.active || this.matSort.direction === '') {
            return data;
        }
        return data.sort((a: bareEntity<ActionItem>, b: bareEntity<ActionItem>) => {
            let propA: number | string = '';
            let propB: number | string = '';

            switch (this.matSort.active) {
                case 'id':
                    [propA, propB] = [a.id, b.id];
                    break;
            }

            const valueA = isNaN(+propA) ? propA : +propA;
            const valueB = isNaN(+propB) ? propB : +propB;

            return (valueA < valueB ? -1 : 1) * (this.matSort.direction === 'asc' ? 1 : -1);
        });
    }

    disconnect(): void {

    }
}
