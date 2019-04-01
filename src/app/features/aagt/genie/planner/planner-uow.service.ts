import { Injectable } from '@angular/core';
import {
    Entity,
    EntityAction,
    FilterQueryOp,
    Predicate,
    SaveResult
} from 'breeze-client';
import {
    AagtDataModule,
    ActionItem,
    ActionItemRepo,
    Asset,
    AssetRepoService,
    AssetTriggerAction,
    Generation,
    GenerationAsset,
    GenerationRepoService,
    GenAssetRepoService,
    Trigger,
    TriggerAction,
    TriggerActionRepoService,
    TriggerRepoService
} from '../../data';

import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot
} from '@angular/router';

import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { AssetTriggerActionRepoService } from 'app/features/aagt/data/repos/asset-trigger-action-repo.service';
import {} from 'app/features/aagt/data/repos/trigger-action-repo.service';
import * as _ from 'lodash';
import { BehaviorSubject, Subject } from 'rxjs';
import { AagtEmProviderService } from '../../data/aagt-emprovider.service';

@Injectable({ providedIn: AagtDataModule })
export class PlannerUowService implements Resolve<any> {
    isoLookups: string[];
    allAssetsOptions: Asset[];
    allIsoOptions: string[];
    allActionItemOptions: ActionItem[];
    allAssetTriggerActions: AssetTriggerAction[];
    canDeactivatePlaaner: BehaviorSubject<boolean>;
    currentGen: Generation;
    genTriggers: Trigger[];
    onStep1ValidityChange: BehaviorSubject<boolean>;
    onStep2ValidityChange: BehaviorSubject<boolean>;
    onStep3ValidityChange: BehaviorSubject<boolean>;
    onStep4ValidityChange: BehaviorSubject<boolean>;
    onStepperChange: Subject<StepperSelectionEvent>;
    onTriggersChange: BehaviorSubject<Trigger[]>;
    onTriggerActionsChange: BehaviorSubject<TriggerAction[]>;
    onGenerationAssetsChange: BehaviorSubject<GenerationAsset[]>;
    onAssetTriggerActionChange: BehaviorSubject<AssetTriggerAction[]>;
    onAssetFilterChange: BehaviorSubject<string>;
    onEntityMngrChange: Subject<any>;
    onTriggerFilterChange: BehaviorSubject<string>;
    selectedAssets: Asset[];
    entityManagerSubscriptionId: number;
    private entityChangeSet: Entity[];

    constructor(
        private aagtEmService: AagtEmProviderService,
        private genRepo: GenerationRepoService,
        private triggerRepo: TriggerRepoService,
        private triggerActionRepo: TriggerActionRepoService,
        private assetRepo: AssetRepoService,
        private genAssetRepo: GenAssetRepoService,
        private actionItemRepo: ActionItemRepo,
        private assetTrigActionRepo: AssetTriggerActionRepoService,
        private emProvider: AagtEmProviderService
    ) {
        this.canDeactivatePlaaner = new BehaviorSubject(true);
        this.onStep1ValidityChange = new BehaviorSubject(false);
        this.onStep2ValidityChange = new BehaviorSubject(false);
        this.onStep3ValidityChange = new BehaviorSubject(true);
        this.onStep4ValidityChange = new BehaviorSubject(true);
        this.onAssetFilterChange = new BehaviorSubject('all');
        this.onTriggerFilterChange = new BehaviorSubject('all');
        this.onTriggersChange = new BehaviorSubject([]);
        this.onTriggerActionsChange = new BehaviorSubject([]);
        this.onGenerationAssetsChange = new BehaviorSubject([]);
        this.onAssetTriggerActionChange = new BehaviorSubject([]);
        this.onEntityMngrChange = new Subject();
        this.onStepperChange = new Subject();
        this.onStepperChange.subscribe(stepEvent => {
            if (stepEvent.selectedIndex !== 3) {
                if (!this.entityManagerSubscriptionId) {
                    return;
                }
                emProvider.entityManager.entityChanged.unsubscribe(
                    this.entityManagerSubscriptionId
                );
                return (this.entityManagerSubscriptionId = undefined);
            }
            this.entityManagerSubscriptionId = emProvider.entityManager.entityChanged.subscribe(
                data => {
                    const entityAction: EntityAction = data.entityAction;
                    if (
                        entityAction !== EntityAction.EntityStateChange &&
                        entityAction !== EntityAction.PropertyChange
                    ) {
                        return;
                    }
                    console.log(data);
                    this.onEntityMngrChange.next(data);
                }
            );
        });
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<any> {
        const id = route.params.id;
        this.planGen(id);

        this.onAssetFilterChange.subscribe(assetFilter => {
            let atas = this.updateAssetTriggerActions();

            const triggerFilter = this.onTriggerFilterChange.value;

            if (triggerFilter !== 'all') {
                atas = atas.filter(
                    ata => ata.triggerAction.trigger.milestone === triggerFilter
                );
            }
            if (assetFilter !== 'all') {
                atas = atas.filter(
                    ata => ata.genAsset.asset.alias === assetFilter
                );
            }
            this.onAssetTriggerActionChange.next(atas);
        });

        this.onTriggerFilterChange.subscribe(triggerFilter => {
            let atas = this.updateAssetTriggerActions();

            const assetFilter = this.onAssetFilterChange.value;

            if (assetFilter !== 'all') {
                atas = atas.filter(
                    ata => ata.genAsset.asset.alias === assetFilter
                );
            }
            if (triggerFilter !== 'all') {
                atas = atas.filter(
                    ata => ata.triggerAction.trigger.milestone === triggerFilter
                );
            }
            this.onAssetTriggerActionChange.next(atas);
        });

        return new Promise((resolve, reject) => {
            let preloadData: Promise<any>;

            if (id !== 'new') {
                preloadData = Promise.all([
                    this.fetchAllActionItems(),
                    this.fetchISOoptions(),
                    this.fetchAllAssets(),
                    this.fetchGenerationAssets(),
                    this.fetchGenerationTriggers()
                ]);
            } else {
                preloadData = Promise.all([
                    this.fetchAllActionItems(),
                    this.fetchISOoptions(),
                    this.fetchAllAssets()
                ]);
            }

            return preloadData
                .then(() => {
                    resolve();
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    assetSelectionCheck(): void {
        this.currentGen.generationAssets.forEach(genAsset => {
            const genAssetDeselected = !this.selectedAssets.some(
                assets => genAsset.assetId === assets.id
            );
            if (genAssetDeselected) {
                genAsset.assetTriggerActions.forEach(ata => {
                    ata.entityAspect.setDeleted();
                });
                genAsset.entityAspect.setDeleted();
            }
        });

        this.selectedAssets.forEach(asset => {
            const newGenAssetSelected = !this.currentGen.generationAssets.some(
                genAsset => genAsset.assetId === asset.id
            );
            if (newGenAssetSelected) {
                const data = {
                    generationId: this.currentGen.id,
                    assetId: asset.id
                };
                this.createGenerationAsset(data);
            }
        });
        this.updateAssetTriggerActions();
    }

    createGenerationAsset(data: {
        generationId: number;
        assetId: number;
    }): GenerationAsset {
        const genAsset = this.genAssetRepo.createGenerationAsset(data);
        const trigActions = _.flatMap(
            this.currentGen.triggers,
            x => x.triggerActions
        );
        trigActions.forEach(tra => {
            const assetTrigActionData = {
                genAssetId: genAsset.id,
                triggerActionId: tra.id,
                sequence: tra.sequence
            };
            this.assetTrigActionRepo.createAssetTriggerAction(
                assetTrigActionData
            );
        });
        this.onGenerationAssetsChange.next(this.currentGen.generationAssets);
        this.updateAssetTriggerActions();
        return genAsset;
    }

    createTriggerAction(data: {
        triggerId: number;
        actionItemId: number;
        sequence: number;
    }): TriggerAction {
        const newTrigAction = this.triggerActionRepo.createTrigAction(data);
        this.currentGen.generationAssets.forEach(genAsset => {
            const assetTrigActionData = {
                genAssetId: genAsset.id,
                triggerActionId: newTrigAction.id,
                sequence: newTrigAction.sequence
            };
            this.assetTrigActionRepo.createAssetTriggerAction(
                assetTrigActionData
            );
        });

        this.updateTriggerActions();
        this.updateAssetTriggerActions();
        return newTrigAction;
    }

    deleteTriggerGraph(trigger: Trigger): void {
        const tras = trigger.triggerActions;
        if (tras) {
            tras.forEach(tra => this.deleteTriggerActionGraph(tra));
        }
        trigger.entityAspect.setDeleted();
    }

    deleteTriggerActionGraph(triggerAction: TriggerAction): void {
        const atas = triggerAction.assetTriggerActions;
        if (atas) {
            atas.forEach(ata => {
                const state = ata.entityAspect.entityState;
                if (!state.isDeleted()) {
                    ata.preDeleteState = state;
                }
                ata.entityAspect.setDeleted();
            });
        }
        triggerAction.entityAspect.setDeleted();
    }

    fetchAllActionItems(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.actionItemRepo
                .all()
                .then(allActionItems => {
                    this.allActionItemOptions = allActionItems;
                    resolve();
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    fetchAllAssets(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.assetRepo
                .all()
                .then(allAssects => {
                    this.allAssetsOptions = allAssects;
                    resolve();
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    fetchISOoptions(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.genRepo
                .spChoiceValues('Iso')
                .then(allIso => {
                    this.allIsoOptions = allIso;
                    resolve();
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    fetchGenerationAssets(): Promise<void> {
        const predicate = this.genAssetRepo.makePredicate(
            'generationId',
            this.currentGen.id
        );
        const queryName = `allGenAssets${this.currentGen.id}`;
        return new Promise((resolve, reject) => {
            this.genAssetRepo
                .where(queryName, predicate, 'assetTriggerActions')
                .then(() => resolve())
                .catch(error => {
                    reject(error);
                });
        });
    }

    fetchGenerationTriggers(): Promise<void> {
        const predicate = this.triggerRepo.makePredicate(
            'generationId',
            this.currentGen.id
        );
        const queryName1 = `allGenTrigger${this.currentGen.id}`;
        const queryName2 = `allTriggerActions${this.currentGen.id}`;

        return new Promise((resolve, reject) => {
            this.triggerRepo
                .where(queryName1, predicate, 'triggerActions')
                .then(triggers => {
                    this.genTriggers = triggers;
                    this.onTriggersChange.next(triggers);
                    resolve();
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    getAllMilestones(): string[] {
        return this.currentGen.triggers.map(trig => trig.milestone);
    }

    newTrigger(generationId: number): Trigger {
        const newTrigger = this.triggerRepo.newTrigger(generationId);
        this.triggerRepo.all().then(triggers => {
            this.onTriggersChange.next(triggers);
        });
        return newTrigger;
    }

    rejectAllChanges(): void {
        this.aagtEmService.entityManager.rejectChanges();
    }

    planGen(genId: number | 'new'): void {
        const genPredicate = this.genRepo.makePredicate(
            'id',
            genId,
            FilterQueryOp.Equals
        );
        this.currentGen =
            genId === 'new'
                ? this.genRepo.createDraftGen()
                : this.genRepo.whereInCache(genPredicate)[0];
    }

    reviewChanges(): Entity[] {
        this.entityChangeSet = this.emProvider.entityManager.getChanges();
        return this.entityChangeSet;
    }

     async saveAssetTrigActions(): Promise<SaveResult> {
        try {
            const success = await this.assetTrigActionRepo.saveEntityChanges();
            return success;
        } catch (e) {
            return e;
        }
    }

   async saveGeneration(): Promise<SaveResult> {
        try {
            const success = await this.genRepo.saveEntityChanges();
            return success;
        } catch (e) {
            return e;
        }
    }

    async saveGenAssets(): Promise<SaveResult> {
        try {
            const success = await this.genAssetRepo.saveEntityChanges();
            return success;
        } catch (e) {
            return e;
        }
    }

    async saveTriggers(): Promise<SaveResult> {
        try {
            const success = await this.triggerRepo.saveEntityChanges();
            return success;
        } catch (e) {
            return e;
        }
    }

    async saveTrigActions(): Promise<SaveResult> {
        try {
            const success = await this.triggerActionRepo.saveEntityChanges();
            return success;
        } catch (e) {
            return e;
        }
    }

    triggerActionSelectionCheck(): void {
        const triggers = this.onTriggersChange.value;
        triggers.forEach(trig => {
            // ignore if nothing change on the trigger, i.e. just visited the step

            // delete triggerActions and AssetTrigActions graphs
            const actionItemIds = trig.tempActionItems;
            trig.triggerActions.forEach(tra => {
                let existingItemIndex: number;

                const existActionItem = actionItemIds.find((ai, index) => {
                    if (ai.actionItemId === tra.actionItemId) {
                        existingItemIndex = index;
                        return true;
                    }
                    return false;
                });

                if (existActionItem) {
                    // if triggerAction already exist, check if the sequences has changed
                    if (existActionItem.sequence !== tra.sequence) {
                        tra.sequence = existActionItem.sequence;
                    }
                    // remove the id from the action item list
                    actionItemIds.splice(existingItemIndex, 1);
                } else {
                    // assumes the triggerAction was deleted, so delete graph
                    this.deleteTriggerActionGraph(tra);
                }
            });

            // create new triggerActions, only new action item should be left in array
            actionItemIds.forEach(aii => {
                this.createTriggerAction({
                    triggerId: trig.id,
                    actionItemId: aii.actionItemId,
                    sequence: aii.sequence
                });
            });

            // reset the action items list with the result of deletion and creations
            trig.tempActionItems = trig.triggerActions.map(tra => {
                return {
                    actionItemId: tra.actionItemId,
                    sequence: tra.sequence
                };
            });
        });
    }

    updateTriggerActions(): void {
        const tra = _.flatMap(this.currentGen.triggers, x => x.triggerActions);
        this.onTriggerActionsChange.next(tra);
    }

    updateAssetTriggerActions(): AssetTriggerAction[] {
        const atas = _.flatMap(this.currentGen.triggers, x =>
            _.flatMap(x.triggerActions, m => m.assetTriggerActions)
        );
        this.onAssetTriggerActionChange.next(atas);
        return atas;
    }
}
