import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { PlannerUowService } from '../../planner-uow.service';

@Injectable()
export class AssetTriggerActionDataSource extends DataSource<any> {

    constructor(
        private uow: PlannerUowService
    ) {
        super();
    }

    connect(): Observable<any[]> {
        return this.uow.onAssetTriggerActionChange;
    }

    disconnect(): void {
    }
}
