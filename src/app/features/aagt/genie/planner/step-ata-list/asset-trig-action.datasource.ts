import { DataSource } from '@angular/cdk/table';
import { AssetTriggerAction } from 'app/features/aagt/data';
import { BehaviorSubject, Observable, merge } from 'rxjs';
import * as _ from 'lodash';
import { filter, distinctUntilKeyChanged, tap, map } from 'rxjs/operators';
import { PlannerUowService } from '../planner-uow.service';
import { EntityAction } from 'breeze-client';

export class AssetTriggerActionDataSource extends DataSource<AssetTriggerAction> {
    assetFilterChange = new BehaviorSubject('');
    get assetFilter(): string {
        return this.assetFilterChange.value;
    }
    set assetFilter(assetFilterText: string) {
        this.assetFilterChange.next(assetFilterText);
    }

    triggerFilterChange = new BehaviorSubject('');

    get triggerFilter(): string {
        return this.triggerFilterChange.value;
    }
    set triggerFilter(triggerFilterText: string) {
        this.assetFilterChange.next(triggerFilterText);
    }

    private assetTrigActs = _.flatMap(this.planUow.currentGen.triggers, x =>
        _.flatMap(x.triggerActions, m => m.assetTriggerActions)
    );

    private datasource = this.planUow.aagtEmService.onEntityManagerChange.pipe(
        filter(x => x.entity.shortname === 'AssetTriggerAction'),
        filter(
            ec =>
                ec.entityAction === EntityAction.EntityStateChange ||
                (ec.entityAction === EntityAction.PropertyChange &&
                    ec.args.propertyName === 'isSoftDeleted')
        ),
        distinctUntilKeyChanged(
            'entity',
            (entity1, entity2) => entity1.id === entity2.id
        )
    );

    constructor(private planUow: PlannerUowService) {
        super();
    }

    connect(): Observable<AssetTriggerAction[]> {
        const displayDataChanges = [
            this.datasource,
            this.assetFilterChange,
            this.triggerFilterChange
        ];

        return merge(...displayDataChanges).pipe(
            tap(ec => console.log(ec)),
            map(noChoice =>
                this.assetTrigActs.slice().filter(ata => {
                    let matchedRecord = false;
                    if (!this.assetFilter && !this.triggerFilter) {
                        return true;
                    }
                    if (this.assetFilter) {
                        matchedRecord =
                            ata.genAsset.asset.alias === this.assetFilter;
                    }
                    if (!matchedRecord || this.triggerFilter) {
                        matchedRecord =
                            ata.triggerAction.trigger.milestone ===
                            this.triggerFilter;
                    }
                    return matchedRecord;
                })
            )
        );
    }

    disconnect() {}
}
