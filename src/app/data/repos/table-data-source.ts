import { DataSource } from '@angular/cdk/table';
import { MatPaginator, MatSort } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { FuseUtils } from '@fuse/utils';
import { ActionItem } from 'app/aagt/data';
import { bareEntity } from 'app/data';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class FilesDataSource<T> extends DataSource<T> {

    private filterChange = new BehaviorSubject('');
    private filterDataChange: BehaviorSubject<T[]>;
    constructor (
        private tableData: T[],
        private matPaginator: MatPaginator,
        private matSort: MatSort,
        private dataSourceObsverable: BehaviorSubject<T>
    ) {
        super();
        this.filterDataChange = new BehaviorSubject('') as any;
        this.filteredData = tableData;
        console.log(tableData);
    }

    connect(): Observable<T[]> {
        const displayDataChanges = [
            this.dataSourceObsverable,
            this.matPaginator.page,
            this.filterChange,
            this.matSort.sortChange
        ];

        return merge(...displayDataChanges)
            .pipe(
                map(() => {
                    let data = this.tableData.slice();
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

    get filteredData(): T[] {
        return this.filterDataChange.value;
    }

    set filteredData(value: T[]) {
        this.filterDataChange.next(value);
    }

    filterData(data: T[]): T[] {
        if (!this.filter) {
            return data;
        }
        return FuseUtils.filterArrayByString(data, this.filter) as T[];
    }

    sortData(data: T[]): T[] {
        if (!this.matSort.active || this.matSort.direction === '') {
            return data;
        }
        return data.sort((a: any, b: any) => {
            const propA: number | string = a[this.matSort.active];
            const propB: number | string = b[this.matSort.active];

            const valueA = isNaN(+propA) ? propA : +propA;
            const valueB = isNaN(+propB) ? propB : +propB;

            return (valueA < valueB ? -1 : 1) * (this.matSort.direction === 'asc' ? 1 : -1);
        });
    }

    disconnect(): void {

    }
}
