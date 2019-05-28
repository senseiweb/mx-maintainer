import { DataSource } from '@angular/cdk/table';
import { AssetTriggerAction } from 'app/features/aagt/data';
import * as _l from 'lodash';
import { merge, BehaviorSubject, Observable, Subject } from 'rxjs';
import {
    debounceTime,
    distinctUntilKeyChanged,
    map,
    takeUntil
} from 'rxjs/operators';
import { PlannerUowService } from '../planner-uow.service';

export class AssetTriggerActionDataSource extends DataSource<
    AssetTriggerAction
> {
    onAssetTrigActData: BehaviorSubject<AssetTriggerAction[]>;
    private unsubscribeAll: Subject<any>;

    constructor(
        private planUow: PlannerUowService,
        private triggerFilterChange: BehaviorSubject<string>,
        private assetFilterChange: BehaviorSubject<string>,
        private actionItemFilterChange: BehaviorSubject<string>
    ) {
        super();
        this.unsubscribeAll = new Subject();
        this.onAssetTrigActData = new BehaviorSubject([]);
        this.planUow.aagtEmService
            .onModelChanges('AssetTriggerAction')
            .pipe(
                distinctUntilKeyChanged(
                    'entity',
                    (entity1, entity2) => entity1.id === entity2.id
                ),
                debounceTime(1500),
                takeUntil(this.unsubscribeAll)
            )
            .subscribe(_ => {
                const atas = _l.flatMap(this.planUow.currentGen.triggers, x =>
                    _l.flatMap(x.triggerActions, m => m.assetTriggerActions)
                );

                const sortedAtas = _l.orderBy(atas, [
                    x => x.generationAsset.mxPosition,
                    x => x.triggerAction.trigger.triggerStart,
                    x => x.sequence
                ]);
                this.onAssetTrigActData.next(sortedAtas);
            });
    }

    connect(): Observable<AssetTriggerAction[]> {
        const displayDataChanges = [
            this.onAssetTrigActData,
            this.assetFilterChange,
            this.triggerFilterChange,
            this.actionItemFilterChange
        ];

        return merge(...displayDataChanges).pipe(
            map(noChoice => {
                const assetFilter = this.assetFilterChange.value;
                const triggerFilter = this.triggerFilterChange.value;
                const actionItemFilter = this.actionItemFilterChange.value;
                return this.onAssetTrigActData.value.slice().filter(ata => {
                    let assetMatch = true;
                    let actionItemMatch = true;
                    let triggerMatch = true;

                    if (assetFilter !== 'all') {
                        assetMatch =
                            ata.generationAsset.asset.alias === assetFilter;
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

    disconnect() {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }
}
