import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { Trigger, Asset, GenerationAsset, TriggerAction, Generation } from 'app/features/aagt/data';
import { PlannerUowService } from '../../planner-uow.service';

@Component({
    selector: 'asset-trigger-sidebar',
    templateUrl: './asset-trigger-sidebar.component.html',
    styleUrls: ['./asset-trigger-sidebar.component.scss']
})
export class AssetTriggerSidebarComponent implements OnInit, OnDestroy {

    triggerNames: string[];
    triggerFilterBy: string;
    assetFilterBy: string;
    assetNames: string[];
    // Private
    private unsubscribeAll: Subject<any>;

    constructor(
        private planUow: PlannerUowService
    ) {
        // Set the private defaults
        this.unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.assetFilterBy = this.planUow.assetFilterBy || 'all';
        this.triggerFilterBy = this.planUow.triggerFilterBy || 'all';
        this.planUow.onTriggerActionsChange
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(trigActions => {
                this.triggerNames = [...new Set(trigActions.map(ta => ta.trigger.milestone))];
            });
        this.planUow.onGenerationAssetsChange
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(genAssets => {
                this.assetNames = [...new Set(genAssets.map(ga => ga.asset.alias))];
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    filterActionsByAsset(alias: string): void {
        if (!alias) {
            this.planUow.onAssetFilterChange.next('all');
            this.assetFilterBy = 'all';
        } else {
            this.planUow.onAssetFilterChange.next(alias);
            this.assetFilterBy = alias;
        }
    }

    filterActionsByTrigger(trigName: string): void {
        if (!trigName) {
            this.planUow.onTriggerFilterChange.next('all');
            this.triggerFilterBy = 'all';
        } else {
            this.planUow.onTriggerFilterChange.next(trigName);
            this.triggerFilterBy = trigName;
        }
    }
}

