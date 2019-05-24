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
    selector: 'asset-sidebar',
    templateUrl: './asset-sidebar.component.html',
    styleUrls: ['./asset-sidebar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssetSidebarComponent implements OnInit, OnDestroy {
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
        if (alias !== 'all') {
            const start = alias.indexOf('|');
            alias = alias.substring(start + 2);
        }
        this.assetFilterChange.emit(alias);
    }

    private getAssetNames(): void {
        const assetNames = this.planUow.currentGen.generationAssets.map(
            ga => `Mx Position: ${ga.mxPosition} | ${ga.asset.alias}`
        );

        /* Since the reference is changing should not need to call check for changes */
        this.assetNames = [...new Set(assetNames)].sort();
    }

    private reactToModelChanges(): void {
        this.planUow.aagtEmService
            .onModelChanges('GenerationAsset', 'PropertyChange', 'mxPosition')
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(_ => this.getAssetNames());
    }
}
