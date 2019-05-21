import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import * as _l from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PlannerUowService } from '../../planner-uow.service';

@Component({
    selector: 'asset-trigger-sidebar',
    templateUrl: './asset-trigger-sidebar.component.html',
    styleUrls: ['./asset-trigger-sidebar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssetTriggerSidebarComponent implements OnInit, OnDestroy {
    @Output() assetFilterChange = new EventEmitter<string>();
    triggerNames: string[];
    assetFilterBy: string;
    assetNames: string[];
    // Private
    private unsubscribeAll: Subject<any>;

    constructor(
        private planUow: PlannerUowService,
        private cdRef: ChangeDetectorRef
    ) {
        // Set the private defaults
        this.unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.assetFilterBy = 'all';
        this.getAssetNames();
        this.reactToModelChanges();
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    filterByAsset(alias: string) {
        this.assetFilterBy = alias;
        this.assetFilterChange.emit(alias);
    }

    private getAssetNames(): void {
        const assetNames = this.planUow.currentGen.generationAssets.map(
            ga => ga.asset.alias
        );

        /* Since the reference is changing should not need to call check for changes */
        this.assetNames = [...new Set(assetNames)];
    }

    private reactToModelChanges(): void {
        this.planUow.aagtEmService
            .onModelChanges('GenerationAsset', 'EntityState')
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(_ => this.getAssetNames);
    }
}
