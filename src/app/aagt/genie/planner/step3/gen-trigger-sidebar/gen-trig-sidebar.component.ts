import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { Trigger, Asset, GenerationAsset, TriggerAction, Generation } from 'app/aagt/data';
import { PlannerUowService } from '../../planner-uow.service';

@Component({
    selector: 'gen-trig-sidebar',
    templateUrl: './gen-trig-sidebar.component.html',
    styleUrls: ['./gen-trig-sidebar.component.scss']
})
export class GenTriggerSidebarComponent implements OnInit, OnDestroy {
    @Input() plannedGen: Generation;

    trigger: Trigger;
    triggerFilterBy: number | 'all';
    assetFilterBy: number | 'all';
    genAssets: GenerationAsset[];
    triggerActions: TriggerAction[];

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
                this.triggerActions = trigActions;
            });
        this.planUow.onGenerationAssetsChange
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(genAssets => this.genAssets = genAssets);
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    filterActionsByAsset(genAsset: GenerationAsset | null): void {
        if (genAsset === null) {
            this.planUow.onAssetFilterChange.next('all');
        }
        this.assetFilterBy = genAsset.id;
        this.planUow.onAssetFilterChange.next(genAsset.id);
    }

    filterActionsByTrigger(trigAction: TriggerAction | null): void {
        if (trigAction === null) {
            this.planUow.onTriggerFilterChange.next('all');
        }
        this.triggerFilterBy = trigAction.id;
        this.planUow.onTriggerFilterChange.next(trigAction.id);
    }
}

