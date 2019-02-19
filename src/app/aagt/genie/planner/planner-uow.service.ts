import { Injectable } from '@angular/core';
import {
    FilterQueryOp,
    Predicate,
    FilterQueryOpSymbol
} from 'breeze-client';
import {
    TriggerRepoService,
    SpAagtRepoService,
    ActionItem,
    ActionItemRepo,
    Trigger,
    TriggerAction,
    AssetTriggerAction
} from '../../data';
import {
    Asset,
    AssetRepoService,
    GenAssetRepoService,
    Generation,
    GenerationAsset,
    GenerationRepoService
} from '../../data';

import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot
} from '@angular/router';

import { AagtDataModule } from 'app/aagt/data/aagt-data.module';
import { TriggerActionRepoService } from 'app/aagt/data/repos/trigger-action-repo.service';
import { Subject, BehaviorSubject } from 'rxjs';
import { AssetTriggerActionRepoService } from 'app/aagt/data/repos/asset-trigger-action-repo.service';

@Injectable({ providedIn: AagtDataModule })
export class PlannerUowService implements Resolve<any> {
    isoLookups: string[];
    allAssets: Asset[];
    allActionItems: ActionItem[];
    currentGen: Generation;
    onTriggersChange: BehaviorSubject<Trigger[]>;
    onTriggerActionsChange: BehaviorSubject<TriggerAction[]>;
    onGenerationAssetsChange: BehaviorSubject<GenerationAsset[]>;
    onAssetTriggerActionChange: BehaviorSubject<AssetTriggerAction[]>;
    assetFilterBy: number | 'all';
    triggerFilterBy: number | 'all';
    onAssetFilterChange: Subject<number | 'all'>;
    onTriggerFilterChange: Subject<number | 'all'>;
    private generationPredicate: Predicate;

    constructor(
        private genRepo: GenerationRepoService,
        private triggerRepo: TriggerRepoService,
        private triggerActionRepo: TriggerActionRepoService,
        private assetRepo: AssetRepoService,
        private genAssetRepo: GenAssetRepoService,
        private spRepo: SpAagtRepoService,
        private actionItemRepo: ActionItemRepo,
        private assetTrigActionRepo: AssetTriggerActionRepoService
    ) {
        this.onAssetFilterChange = new Subject();
        this.onTriggerFilterChange = new Subject();
        this.onTriggersChange = new BehaviorSubject([]);
        this.onTriggerActionsChange = new BehaviorSubject([]);
        this.onGenerationAssetsChange = new BehaviorSubject([]);
        this.onAssetTriggerActionChange = new BehaviorSubject([]);
     }

    resolve(
        _route: ActivatedRouteSnapshot,
        _state: RouterStateSnapshot
    ): Promise<any> {
        console.log('hit the resolver');
        return new Promise(async (resolve, reject) => {
            const assets = this.assetRepo.all().then(data => this.allAssets = data);
            const ai = this.actionItemRepo.all().then(data => this.allActionItems = data);
            const trig = this.triggerRepo.all().then(data => this.onTriggersChange.next(data));
            const isoLookups = this.spRepo.getIsoLookup().then((data) => this.isoLookups = data);
            try {
                const value = await Promise
                    .all([assets, isoLookups, ai, trig])
                    .then(() => {
                        this.onAssetFilterChange.subscribe(filter => {
                            this.assetFilterBy = filter;

                        });
                        this.onTriggerFilterChange.subscribe(filter => {
                            this.triggerFilterBy = filter;
                        });
                    });
                return resolve(value);
            } catch (reason) {
                return reject(reason);
            }
        });
    }

    createGenerationAsset(data: { generationId: number, assetId: number }): void {
        this.genAssetRepo.createGenerationAsset(data);
        this.getGenerationAssets();
    }

    getAllAssetTriggerActions(): void {
        let predicate: Predicate;
        this.onTriggerActionsChange.value.forEach(triggerAction => {
            const trigPredicate = this.assetTrigActionRepo.makePredicate('triggerActionId', FilterQueryOp.Equals, triggerAction.id);
            if (!predicate) {
                predicate = trigPredicate;
            } else {
                predicate.or(trigPredicate);
            }
        });
        this.assetTrigActionRepo
            .where(predicate)
            .then(assetTrigActions => {
                this.onAssetTriggerActionChange.next(assetTrigActions);
            });
    }

    getOrCreateTriggerAction(data: { triggerId: number, actionItemId: number }): TriggerAction {
        return this.triggerActionRepo.getOrCreateTriggerAction(data);
    }

    getAllMilestones(): string[] {
        return this.onTriggersChange.value.map(trig => trig.milestone);
    }

    newTrigger(generationId: number): Trigger {
        const newTrigger = this.triggerRepo.newTrigger(generationId);
        this.triggerRepo
            .all()
            .then(triggers => {
                this.onTriggersChange.next(triggers);
            });
        return newTrigger;
    }

    planGen(genId: number | 'new'): void {
        if (genId === 'new') {
            this.currentGen = this.genRepo.createDraftGen();
            this.createGenerationPredicate();
        } else {
            this.createGenerationPredicate(genId);
            this.currentGen = this.genRepo.whereInCache(this.generationPredicate)[0];
            this.triggerRepo.where(this.generationPredicate);
        }
    }

    getGenerationAssets(): void {
        const predicate = this.genAssetRepo.makePredicate('generationId', FilterQueryOp.Equals, this.currentGen.id);
        if (this.currentGen.entityAspect.entityState.isAdded()) {
            const localGenAsset = this.genAssetRepo
                .whereInCache(predicate);
            
            this.onGenerationAssetsChange.next(localGenAsset);

        } else {
            this.genAssetRepo
                .where(predicate)
                .then(data => {
                    this.onGenerationAssetsChange.next(data);
                });
        }
    }

    getTriggerActions(): void {
        const triggerIds = this.triggerRepo.whereInCache(this.generationPredicate);
        let predicate: Predicate;
        triggerIds.forEach(trigger => {
            const trigPredicate = this.triggerActionRepo.makePredicate('triggerId', FilterQueryOp.Equals, trigger.id);
            if (!predicate) {
                predicate = trigPredicate;
            } else {
                predicate.or(trigPredicate);
            }
        });

        this.triggerActionRepo
            .where(predicate)
            .then(trigActions => {
                this.onTriggerActionsChange.next(trigActions);
            });
    }

    private createGenerationPredicate(genId?: number): void  {
        this.generationPredicate = this.genRepo.makePredicate(
            'id',
            FilterQueryOp.Equals,
            genId || this.currentGen.id
        );
    }
}
