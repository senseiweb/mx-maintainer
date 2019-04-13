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
    AagtListName,
    ActionItem,
    ActionItemRepo,
    Asset,
    AssetRepoService,
    AssetTriggerAction,
    Generation,
    GenerationAsset,
    GenerationRepoService,
    GenAssetRepoService,
    IJobReservateionRequest,
    Team,
    TeamAvailability,
    TeamAvailRepoService,
    TeamCategory,
    TeamCategoryRepoService,
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
import { prepareSyntheticListenerFunctionName } from '@angular/compiler/src/render3/util';
import { bareEntity } from '@ctypes/breeze-type-customization';
import { trimLabel } from '@swimlane/ngx-charts';
import { AssetTriggerActionRepoService } from 'app/features/aagt/data/repos/asset-trigger-action-repo.service';
import {} from 'app/features/aagt/data/repos/trigger-action-repo.service';
import { BaseRepoService, SpEntityBase } from 'app/global-data';
import * as _ from 'lodash';
import * as _m from 'moment';
import { forkJoin, from, BehaviorSubject, Observable, Subject } from 'rxjs';
import { concatMap, filter, map, mergeMap } from 'rxjs/operators';
import {
    AagtEmProviderService,
    IEntityChange
} from '../../data/aagt-emprovider.service';
import { TeamRepoService } from '../../data/repos/team-repo.service';
import { IStepperModel } from './planner.component';

export type FilterType = 'asset' | 'trigger';
export type FilterChange = {
    [key in FilterType]: {
        filterText: string;
    }
};

@Injectable({ providedIn: AagtDataModule })
export class PlannerUowService implements Resolve<any> {
    allAssetsOptions: Asset[];
    allIsoOptions: string[];
    allActionItems: Observable<ActionItem[]>;
    allAssetTriggerActions: AssetTriggerAction[];
    allTeamCats: TeamCategory[];
    canDeactivatePlaaner: BehaviorSubject<boolean>;
    currentGen: Generation;
    genTriggers: Trigger[];
    onStepValidityChange: BehaviorSubject<IStepperModel>;
    onStepperChange: Subject<StepperSelectionEvent>;
    onFilterChange: BehaviorSubject<FilterChange>;
    onEntitiesChange: Observable<SpEntityBase[]>;
    selectedAssets: Asset[];
    private entityChangeSet: Entity[];
    private emSubsId: number;
    saveAll: any;

    constructor(
        private aagtEmService: AagtEmProviderService,
        private genRepo: GenerationRepoService,
        private teamRepo: TeamRepoService,
        private teamCatRepo: TeamCategoryRepoService,
        private teamAvailRepo: TeamAvailRepoService,
        private triggerRepo: TriggerRepoService,
        private triggerActionRepo: TriggerActionRepoService,
        private assetRepo: AssetRepoService,
        private genAssetRepo: GenAssetRepoService,
        private actionItemRepo: ActionItemRepo,
        private assetTrigActionRepo: AssetTriggerActionRepoService,
        private emProvider: AagtEmProviderService
    ) {
        this.canDeactivatePlaaner = new BehaviorSubject(true);
        this.onEntitiesChange = new Observable();
        this.onStepValidityChange = new BehaviorSubject({} as any);
        this.onFilterChange = new BehaviorSubject({} as any);
        this.onStepperChange = new Subject();
        this.emProvider.onEntityChange.subscribe(this.entityChanges);
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        const id = route.params.id;

        this.planGen(id);

        const neededObs = [
            this.actionItemRepo.all,
            this.teamCatRepo.all,
            from(this.genRepo.spChoiceValues('iso')),
            this.assetRepo.all
        ];

        if (id === 'new') {
            return this.onEntitiesChange.pipe(x => forkJoin(neededObs));
        }

        neededObs.push(from(this.fetchGenerationAssets));
        neededObs.push(from(this.fetchGenTrigAndActions));

        return this.onEntitiesChange.pipe(x => forkJoin(neededObs));

        // this.onFilterChange
        //     .pipe(filter(fil => !!(fil.asset && fil.asset.filterText)))
        //     .subscribe(fil => {
        //         let atas = this.updateAssetTriggerActions();

        //         if (fil.asset.filterText !== 'all') {
        //             atas = atas.filter(
        //                 ata =>
        //                     ata.triggerAction.trigger.milestone ===
        //                     fil.asset.filterText
        //             );
        //         }
        //         if (fil.asset.filterText !== 'all') {
        //             atas = atas.filter(
        //                 ata => ata.genAsset.asset.alias === fil.asset.filterText
        //             );
        //         }
        //         this.onEntitiesChange.next(atas);
        //     });

        // this.onFilterChange.subscribe(txtFilter => {
        //     let atas = this.updateAssetTriggerActions();

        //     const assetFilter =
        //         (txtFilter.asset && txtFilter.asset.filterText) || 'all';

        //     const triggerFilter =
        //         (txtFilter.trigger && txtFilter.trigger.filterText) || 'all';

        //     if (assetFilter !== 'all') {
        //         atas = atas.filter(
        //             ata => ata.genAsset.asset.alias === assetFilter
        //         );
        //     }

        //     if (triggerFilter !== 'all') {
        //         atas = atas.filter(
        //             ata => ata.triggerAction.trigger.milestone === triggerFilter
        //         );
        //     }
        //     this.onEntitiesChange.next(atas);
        // });
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

    private entityChanges(entityChanges: IEntityChange[]): void {
        const propChanges = entityChanges.filter(
            chng => chng.entityAction === EntityAction.PropertyChange
        );
        if (!propChanges.length) {
            return;
        }
        const genChanges = propChanges.filter(
            chng => chng.entity.entityType.shortName === AagtListName.Gen
        );
        if (genChanges) {
            if (
                genChanges.some(chng => {
                    const propName: keyof bareEntity<Generation> =
                        chng.args.propertyName;
                    return (
                        propName === 'genEndDate' || propName === 'genStartDate'
                    );
                })
            ) {
                this.planAssetTaskActions();
                return;
            }
        }
        const triggerChanges = propChanges.filter(
            chng => chng.entity.entityType.shortName === AagtListName.Trigger
        );
        if (triggerChanges) {
            if (
                triggerChanges.some(chng => {
                    const propName: keyof bareEntity<Trigger> =
                        chng.args.propertyName;
                    return (
                        propName === 'triggerStart' ||
                        propName === 'triggerStop'
                    );
                })
            ) {
                this.planAssetTaskActions();
                return;
            }
        }
        const trigActions = propChanges.filter(
            chng => chng.entity.entityType.shortName === AagtListName.TriggerAct
        );
        if (trigActions) {
            if (
                trigActions.some(chng => {
                    const propName: keyof bareEntity<TriggerAction> =
                        chng.args.propertyName;
                    return propName === 'sequence';
                })
            ) {
                this.planAssetTaskActions();
                return;
            }
        }
        const assetTrigActs = propChanges.filter(
            chng =>
                chng.entity.entityType.shortName === AagtListName.AssetTrigAct
        );
        if (assetTrigActs) {
            if (
                assetTrigActs.some(chng => {
                    const propName: keyof bareEntity<AssetTriggerAction> =
                        chng.args.propertyName;
                    return propName === 'sequence';
                })
            ) {
                this.planAssetTaskActions();
                return;
            }
        }
    }

    private fetchGenerationAssets(): Observable<any> {
        const genAssetPredicate = this.genAssetRepo.makePredicate(
            'generationId',
            this.currentGen.id
        );
        const genAssetQueryName = `genAssetFor-${this.currentGen.id}`;

        const query = this.genAssetRepo.whereWithChildren(
            genAssetQueryName,
            genAssetPredicate,
            this.assetTrigActionRepo,
            'genAssetId'
        );

        return from(query);
    }

    private fetchGenTrigAndActions(): Observable<any> {
        const predicate = this.triggerRepo.makePredicate(
            'generationId',
            this.currentGen.id
        );
        const genTrigQueryName = `triggersFor-${this.currentGen.id}`;

        const query = this.genAssetRepo.whereWithChildren(
            genTrigQueryName,
            predicate,
            this.triggerActionRepo,
            'triggerId'
        );
        return from(query);
    }

    async fetchTeamsAndAvail(teamCats: number[]): Promise<TeamAvailability[]> {
        let teamCatPredicate: Predicate;
        teamCats.forEach(tc => {
            const pred = this.teamRepo.makePredicate('teamCategoryId', tc);
            teamCatPredicate = teamCatPredicate
                ? teamCatPredicate.and(pred)
                : pred;
        });
        try {
            const teams = await this.teamRepo.where(
                teamCats.toString(),
                teamCatPredicate
            );

            let teamAvailPredicate: Predicate;

            teams
                .map(t => t.id)
                .forEach(teamId => {
                    const predPart = this.teamAvailRepo.makePredicate(
                        'teamId',
                        teamId
                    );
                    teamAvailPredicate = teamAvailPredicate
                        ? teamAvailPredicate.and(predPart)
                        : predPart;
                });

            if (!teamAvailPredicate) {
                return;
            }
            teamAvailPredicate.and(
                this.teamAvailRepo.makePredicate(
                    'availStart',
                    this.currentGen.genStartDate.toString(),
                    FilterQueryOp.GreaterThanOrEqual
                )
            );
            return await this.teamAvailRepo.where(
                teams.toString(),
                teamAvailPredicate
            );
        } catch (e) {
            throw e;
        }
    }

    getAllMilestones(): string[] {
        return this.currentGen.triggers.map(trig => trig.milestone);
    }

    newTrigger(generationId: number): Trigger {
        const newTrigger = this.triggerRepo.newTrigger(generationId);
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

    async planAssetTaskActions(): Promise<void> {
        // Step 1: Get all asset trig actions
        const allAssetTrigActions = _.flatMap(
            this.currentGen.generationAssets,
            x => x.assetTriggerActions
        );

        // if none exists; get out of here
        if (!allAssetTrigActions.length) {
            return;
        }

        // setup a container to hold planned tasks by taskid and
        // then assetid
        const taskForTrigger: {
            [index: number]: {
                triggerRunTime?: _m.Duration;
                [index: number]: {
                    requestedStart: _m.Moment;
                    scheduledTasks: AssetTriggerAction[];
                    failedTasks: AssetTriggerAction[];
                    assetRunTime: _m.Duration;
                };
            };
        } = {};

        const assetIds = _.flatMap(
            this.currentGen.generationAssets,
            x => x.generationId
        );

        this.currentGen.triggers.forEach(trigger => {
            taskForTrigger[trigger.id].triggerRunTime = _m.duration(0);

            assetIds.forEach(aid => {
                taskForTrigger[trigger.id][aid] = {
                    assetRunTime: _m.duration(0),
                    get requestedStart() {
                        return _m(trigger.triggerStart).add(this.assetRunTime);
                    },
                    scheduledTasks: [],
                    failedTasks: []
                };
            });
        });

        // Step 2: Get the team category IDs to fetch the
        // associated teams
        const teamCatIds = allAssetTrigActions.map(
            ata => ata.triggerAction.actionItem.teamCategoryId
        );

        // Step 3: Get all teams and team availabilities
        // within the range of this generation

        await this.fetchTeamsAndAvail(teamCatIds);

        const prioritizedATAs = _.orderBy(allAssetTrigActions, [
            x => x.genAsset.mxPosition,
            x => x.triggerAction.trigger.milestone,
            x => x.triggerAction.sequence
        ]);

        prioritizedATAs.forEach(pata => {
            const trigger = pata.triggerAction.trigger;
            const asset = pata.genAsset.asset;

            const start = taskForTrigger[trigger.id][asset.id].requestedStart;

            const reservationRequest: IJobReservateionRequest = {
                taskId: pata.id,
                taskDuration: _m.duration(
                    pata.triggerAction.actionItem.duration
                ),
                requestedStartDate: start
            };
            const receipt = pata.triggerAction.actionItem.teamCategory.addJobReservation(
                reservationRequest
            );

            pata.plannedStart =
                receipt.plannedStart && receipt.plannedStart.toDate();
            pata.plannedStart =
                receipt.plannedEnd && receipt.plannedEnd.toDate();

            if (!receipt.plannedEnd || !receipt.plannedStart) {
                // in case a start could be schedule but not an end;
                return;
            }

            // if a task can be done concurrently, do not update runtime or start date;
            if (pata.isConcurrentable) {
                return;
            }
            taskForTrigger[trigger.id].triggerRunTime.add(
                receipt.durationPlanned
            );
            taskForTrigger[trigger.id][asset.id].assetRunTime.add(
                receipt.durationPlanned
            );
        });
    }

    reviewChanges(): Entity[] {
        this.entityChangeSet = this.emProvider.entityManager.getChanges();
        return this.entityChangeSet;
    }

    async saveEntityChanges(entityName: AagtListName): Promise<SaveResult> {
        let repo: BaseRepoService<any>;
        switch (entityName) {
            case AagtListName.Gen:
                repo = this.genRepo;
                break;
            case AagtListName.GenAsset:
                repo = this.genAssetRepo;
                break;
            case AagtListName.Trigger:
                repo = this.triggerRepo;
                break;
            case AagtListName.TriggerAct:
                repo = this.triggerActionRepo;
                break;
            case AagtListName.AssetTrigAct:
                repo = this.assetTrigActionRepo;
                break;
        }
        const success = await repo.saveEntityChanges();
        return success;
    }

    triggerActionSelectionCheck(): void {
        this.currentGen.triggers.forEach(trig => {
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

    // updateTriggerActions(): void {
    //     const tra = _.flatMap(this.currentGen.triggers, x => x.triggerActions);
    //     this.next(tra);
    // }

    // updateAssetTriggerActions(): AssetTriggerAction[] {
    //     const atas = _.flatMap(this.currentGen.triggers, x =>
    //         _.flatMap(x.triggerActions, m => m.assetTriggerActions)
    //     );
    //     this.onEntitiesChange.next(atas);
    //     return atas;
    // }
}
