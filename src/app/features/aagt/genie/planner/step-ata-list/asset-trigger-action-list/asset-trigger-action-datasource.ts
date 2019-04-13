import { DataSource } from '@angular/cdk/table';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlannerUowService } from '../../planner-uow.service';

@Injectable()
export class AssetTriggerActionDataSource extends DataSource<any> {
    constructor(private uow: PlannerUowService) {
        super();
    }

    connect(): Observable<any[]> {
        this.uow.onAssetTriggerActionChange.subscribe(ata => {
            console.log(ata);
        });
        return this.uow.onAssetTriggerActionChange;
    }

    disconnect(): void {}
}
