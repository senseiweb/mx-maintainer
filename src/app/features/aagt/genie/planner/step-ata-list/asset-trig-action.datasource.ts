import { DataSource } from '@angular/cdk/table';
import { AssetTriggerAction } from 'app/features/aagt/data';
import * as _ from 'lodash';
import { merge, BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilKeyChanged, filter, map, tap } from 'rxjs/operators';
import { PlannerUowService } from '../planner-uow.service';

export class AssetTriggerActionDataSource extends DataSource<
    AssetTriggerAction
> {
    private datasource = this.planUow.aagtEmService
        .onModelChanges('AssetTriggerAction', 'EntityState')
        .pipe(
            distinctUntilKeyChanged(
                'entity',
                (entity1, entity2) => entity1.id === entity2.id
            )
        );

    constructor(
        private planUow: PlannerUowService,
        private triggerFilterChange: BehaviorSubject<string>,
        private assetFilterChange: BehaviorSubject<string>,
        private actionItemFilterChange: BehaviorSubject<string>
    ) {
        super();
    }

    get assetTrigActData() {
        return _.flatMap(this.planUow.currentGen.triggers, x =>
            _.flatMap(x.triggerActions, m => m.assetTriggerActions)
        );
    }

    connect(): Observable<AssetTriggerAction[]> {
        const displayDataChanges = [
            this.datasource,
            this.assetFilterChange,
            this.triggerFilterChange,
            this.actionItemFilterChange
        ];

        return merge(...displayDataChanges).pipe(
            map(noChoice => {
                const assetFilter = this.assetFilterChange.value;
                const triggerFilter = this.triggerFilterChange.value;
                const actionItemFilter = this.actionItemFilterChange.value;
                return this.assetTrigActData.slice().filter(ata => {
                    let assetMatch = true;
                    let actionItemMatch = true;
                    let triggerMatch = true;

                    if (assetFilter !== 'all') {
                        assetMatch = ata.genAsset.asset.alias === assetFilter;
                    }
                    if (actionItemFilter !== 'all') {
                        actionItemMatch =
                            ata.triggerAction.actionItem.action ===
                            actionItemFilter;
                    }
                    if (triggerFilter !== 'all') {
                        triggerMatch =
                            ata.triggerAction.trigger.milestone ===
                            triggerFilter;
                    }
                    return assetMatch && actionItemMatch && triggerMatch;
                });
            })
        );
    }

    disconnect() {}
}
