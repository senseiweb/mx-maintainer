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
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import * as _ from 'lodash';
import { AssetTriggerActionRepoService } from 'app/aagt/data/repos/asset-trigger-action-repo.service';

@Injectable({ providedIn: AagtDataModule })
export class PlannerUowService implements Resolve<any> {
    isoLookups: string[];
    allAssetsOptions: Asset[];
    allIsoOptions: string[];
    allActionItemOptions: ActionItem[];
    canDeactivatePlaaner: BehaviorSubject<boolean>;
    currentGen: Generation;
    currentTrigger: Trigger;
    onStep1ValidityChange: BehaviorSubject<boolean>;
    onStep2ValidityChange: BehaviorSubject<boolean>;
    onStep3ValidityChange: BehaviorSubject<boolean>;
    onStep4ValidityChange: BehaviorSubject<boolean>;
    onTriggersChange: BehaviorSubject<Trigger[]>;
    onTriggerActionsChange: BehaviorSubject<TriggerAction[]>;
    onGenerationAssetsChange: BehaviorSubject<GenerationAsset[]>;
    onAssetTriggerActionChange: BehaviorSubject<AssetTriggerAction[]>;
    assetFilterBy: string;
    triggerFilterBy: string;
    onAssetFilterChange: Subject<string>;
    onTriggerFilterChange: Subject<string>;
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
        this.canDeactivatePlaaner = new BehaviorSubject(true);
        this.onStep1ValidityChange = new BehaviorSubject(false);
        this.onStep2ValidityChange = new BehaviorSubject(false);
        this.onStep3ValidityChange = new BehaviorSubject(false);
        this.onStep4ValidityChange = new BehaviorSubject(false);
        this.onAssetFilterChange = new Subject();
        this.onTriggerFilterChange = new Subject();
        this.onTriggersChange = new BehaviorSubject([]);
        this.onTriggerActionsChange = new BehaviorSubject([]);
        this.onGenerationAssetsChange = new BehaviorSubject([]);
        this.onAssetTriggerActionChange = new BehaviorSubject([]);
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<any> {
        const id = route.params.id;
        this.planGen(id);
        return new Promise(async (resolve, reject) => {
            const dataNeeded = [
                this.fetchAllActionItems,
                this.fetchISOoptions,
                this.fetchAllAssets
            ];

            if (id !== 'new') {
                dataNeeded.concat([
                    this.fetchGenerationAssets,
                    this.fetchGenerationTriggers
                ]);
            }

            try {
                const value = await Promise
                    .all(dataNeeded)
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

    async fetchAllActionItems(): Promise<void> {
        try {
            this.allActionItemOptions = await this.actionItemRepo.all();
        } catch (e) {

        }
    }

    async fetchAllAssets(): Promise<void> {
        try {
            this.allAssetsOptions = await this.assetRepo.all();
        } catch (e) {

        }
    }

    async fetchAssetTriggerActions(genAssetIds: number[]): Promise<void> {

    }

    async fetchISOoptions(): Promise<void> {
        try {
            this.allIsoOptions = await this.spRepo.getIsoLookup()
        } catch (e) {

        }
    }

    async fetchGenerationAssets(): Promise<void> {
        const predicate = this.genAssetRepo.makePredicate('generationId', this.currentGen.id);
        const queryName = `allGenAssets${this.currentGen.id}`;
        try {
            await this.genAssetRepo.where(queryName, predicate, 'assetTriggerActions');
        } catch (e) {

        }
    }

    async fetchGenerationTriggers(): Promise<void> {
        const predicate = this.triggerRepo.makePredicate('generationId', this.currentGen.id);
        const queryName1 = `allGenTrigger${this.currentGen.id}`;
        const queryName2 = `allTriggerActions${this.currentGen.id}`;
        try {
            const triggers = await this.triggerRepo.where(queryName1, predicate, 'triggerActions');
            // let trigActionPredicate: Predicate;
            // triggers.forEach(trig => {
            //     const pred = this.triggerActionRepo.makePredicate('triggerId', trig.id);
            //     if (!trigActionPredicate) {
            //         trigActionPredicate = pred;
            //     } else {
            //         pred.or(trigActionPredicate);
            //     }
            // });
            // await this.triggerActionRepo.where(queryName2, trigActionPredicate);
        } catch (e) {

        }
    }

    createGenerationAsset(data: { generationId: number, assetId: number }): void {
        const recoverableGenAsset = this.genAssetRepo.recoverDeletedGenAssets(data);
        if (recoverableGenAsset) {
            this.assetTrigActionRepo.recoverAssetTriggerActions('genAssetId', recoverableGenAsset.id);
            this.onGenerationAssetsChange.next(this.currentGen.generationAssets);
        } else {
            this.genAssetRepo.createGenerationAsset(data);
            this.updateAssetTriggerActions();
            // this.onTriggerActionsChange
            // this.getGenerationAssets();
        }
    }

    // getAllAssetTriggerActions(): void {
    //     let predicate: Predicate;
    //     this.onTriggerActionsChange.value.forEach(triggerAction => {
    //         const trigPredicate = this.assetTrigActionRepo.makePredicate('triggerActionId', FilterQueryOp.Equals, triggerAction.id);
    //         if (!predicate) {
    //             predicate = trigPredicate;
    //         } else {
    //             predicate.or(trigPredicate);
    //         }
    //     });
    //     this.assetTrigActionRepo
    //         .where(predicate)
    //         .then(assetTrigActions => {
    //             this.onAssetTriggerActionChange.next(assetTrigActions);
    //         });
    // }

    getTriggerAction(data: { triggerId: number, actionItemId: number, sequence: number }): TriggerAction {
        const recoverableTrigAction = this.triggerActionRepo.recoverDeletedTrigAction(data);
        let newTrigAction: TriggerAction;
        if (recoverableTrigAction) {
            this.assetTrigActionRepo.recoverAssetTriggerActions('triggerActionId', recoverableTrigAction.id);
            newTrigAction = recoverableTrigAction;
        } else {
            newTrigAction = this.triggerActionRepo.createTrigAction(data);
            this.currentGen.generationAssets.forEach(genAsset => {
                const assetTrigActionData = {
                    genAssetId: genAsset.id,
                    triggerActionId: newTrigAction.id,
                    sequence: newTrigAction.sequence
                }
                this.assetTrigActionRepo.createAssetTriggerAction(assetTrigActionData);
            });
        }

        this.updateTriggerActions();
        this.updateAssetTriggerActions();
        return newTrigAction;
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
            // this.createGenerationPredicate();
        } else {
            // this.createGenerationPredicate(genId);
            this.currentGen = this.genRepo.whereInCache(this.generationPredicate)[0];        }
    }

    // getGenerationAssets(): void {
    //     const predicate = this.genAssetRepo.makePredicate('generationId', FilterQueryOp.Equals, this.currentGen.id);
    //     if (this.currentGen.entityAspect.entityState.isAdded()) {
    //         const localGenAsset = this.genAssetRepo
    //             .whereInCache(predicate);
            
    //         this.onGenerationAssetsChange.next(localGenAsset);
    //     } else {
    //         this.genAssetRepo
    //             .where(predicate)
    //             .then(data => {
    //                 this.onGenerationAssetsChange.next(data);
    //             });
    //     }
    // }

    updateTriggerActions(): void {
        const tra = _.flatMap(this.currentGen.triggers, (x) => x.triggerActions);
        this.onTriggerActionsChange.next(tra);
    }

    updateAssetTriggerActions(): void {
        const tra = _.flatMap(this.currentGen.triggers, (x) => x.triggerActions);
        const atas = _.flatMap(tra, (x) => x.assetTriggerActions);
        this.onAssetTriggerActionChange.next(atas);
    }

    // private createGenerationPredicate(genId?: number): void  {
    //     this.generationPredicate = this.genRepo.makePredicate(
    //         'id',
    //         FilterQueryOp.Equals,
    //         genId || this.currentGen.id
    //     );
    // }
}
