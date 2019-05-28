import { Injectable } from '@angular/core';
import { Entity, FilterQueryOp, Predicate, SaveResult } from 'breeze-client';

import {
    AagtDataModule,
    ActionItem,
    ActionItemRepo,
    Asset,
    AssetRepoService,
    AssetTriggerAction,
    Generation,
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
import {} from 'app/features/aagt/data/repos/trigger-action-repo.service';
import { BaseRepoService } from 'app/global-data';
import * as _ from 'lodash';
import * as _m from 'moment';
import {
    defer,
    forkJoin,
    from,
    BehaviorSubject,
    Observable,
    Subject
} from 'rxjs';

import { SpListEntities } from '@ctypes/app-config';

import { AagtEmProviderService } from '../../data/aagt-emprovider.service';
import { AssetTriggerActionRepoService } from '../../data/repos/asset-trigger-action-repo.service';
import { TeamRepoService } from '../../data/repos/team-repo.service';
import { IStepperModel } from './planner.component';

interface ISchedTriggerTask {
    [triggerIndex: number]: {
        triggerRunTime: _m.Duration;
        assetSchedule: Map<
            number,
            {
                requestedStart: _m.Moment;
                scheduledTasks: AssetTriggerAction[];
                failedTasks: AssetTriggerAction[];
                assetRunTime: _m.Duration;
            }
        >;
    };
}

@Injectable({ providedIn: AagtDataModule })
export class PlannerUowService implements Resolve<any> {
    allAssets: Asset[] = [];
    allIsoOptions: string[] = [];
    allActionItems: ActionItem[] = [];
    allTeamCats: TeamCategory[] = [];
    allTeams: Team[] = [];
    canDeactivatePlaaner: BehaviorSubject<boolean>;
    currentGen: Generation;
    onStepValidityChange: BehaviorSubject<IStepperModel>;
    onStepperChange: Subject<StepperSelectionEvent>;
    private entityChangeSet: Entity[];
    saveAll: any;

    constructor(
        public aagtEmService: AagtEmProviderService,
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
        this.onStepValidityChange = new BehaviorSubject({});
        this.onStepperChange = new Subject();
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        const id = route.params.id;

        this.planGen(id);

        const requiredData: Array<Observable<any>> = [
            this.actionItemRepo.all,
            defer(() => this.genRepo.spChoiceValues('iso')),
            this.teamCatRepo.all,
            this.teamRepo.all,
            this.assetRepo.all
        ];

        if (id === 'new') {
            const resolver = forkJoin(requiredData);

            resolver.subscribe(
                ([actionItems, isoChoices, teamCats, teams, assets]) => {
                    this.allActionItems = actionItems;
                    this.allIsoOptions = isoChoices;
                    this.allTeamCats = teamCats;
                    this.allTeams = teams;
                    this.allAssets = assets;
                }
            );

            return resolver;
        }

        const additionalData = [
            defer(this.fetchGenerationAssets),
            defer(this.fetchGenTrigAndActions)
        ];
        requiredData.concat(additionalData);

        const extendResolver = forkJoin(requiredData);

        extendResolver.subscribe(
            ([
                actionItems,
                isoChoices,
                teamCats,
                teams,
                assets,
                genAssets,
                genTrigAndActions
            ]) => {
                this.allActionItems = actionItems;
                this.allIsoOptions = isoChoices;
                this.allTeamCats = teamCats;
                this.allTeams = teams;
                this.allAssets = assets;
            }
        );

        return extendResolver;
    }

    private fetchGenerationAssets(): Observable<any> {
        const genAssetPredicate = this.genAssetRepo.makePredicate(
            'generationId',
            this.currentGen.id
        );

        const query = this.genAssetRepo.whereWithChildren<AssetTriggerAction>(
            genAssetPredicate,
            this.assetTrigActionRepo,
            'generationAssetId'
        );

        return from(query);
    }

    private fetchGenTrigAndActions(): Observable<any> {
        const predicate = this.triggerRepo.makePredicate(
            'generationId',
            this.currentGen.id
        );
        const query = this.triggerRepo.whereWithChildren<TriggerAction>(
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

    async planAssetTaskActions(triggerId?: number): Promise<void> {
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
        const taskForTrigger: ISchedTriggerTask = {};

        const assetIds = this.currentGen.generationAssets.map(ga => ga.assetId);

        this.currentGen.triggers.sort(this.triggerSort).forEach(trigger => {
            taskForTrigger[trigger.id] = {
                triggerRunTime: _m.duration(0),
                assetSchedule: new Map()
            };

            assetIds.forEach(aid => {
                taskForTrigger[trigger.id].assetSchedule.set(aid, {
                    assetRunTime: _m.duration(0),
                    get requestedStart() {
                        return _m(trigger.triggerStart).add(this.assetRunTime);
                    },
                    scheduledTasks: [],
                    failedTasks: []
                });
            });
        });

        let prioritizedATAs = _.orderBy(allAssetTrigActions, [
            x => x.generationAsset.mxPosition,
            x => x.triggerAction.trigger.triggerStart,
            x => x.triggerAction.sequence
        ]);

        prioritizedATAs = prioritizedATAs.filter(
            pata => !pata.plannedStart || !pata.plannedStop
        );

        if (triggerId) {
            prioritizedATAs = prioritizedATAs.filter(
                pata => pata.triggerAction.triggerId === triggerId
            );
        }

        prioritizedATAs.forEach(pata => {
            const trigger = pata.triggerAction.trigger;
            const asset = pata.generationAsset.asset;

            const start = taskForTrigger[trigger.id].assetSchedule.get(
                asset.id
            );

            const reservationRequest: IJobReservateionRequest = {
                taskId: pata.id,
                genId: this.currentGen.id,
                taskDuration: _m.duration(
                    pata.triggerAction.actionItem.duration,
                    'minute'
                ),
                requestedStartDate: start.requestedStart
            };
            const receipt = pata.triggerAction.actionItem.teamCategory.addJobReservation(
                reservationRequest
            );

            pata.plannedStart =
                receipt.plannedStart && receipt.plannedStart.toDate();
            pata.plannedStop =
                receipt.plannedEnd && receipt.plannedEnd.toDate();

            if (!receipt.plannedEnd || !receipt.plannedStart) {
                // in case a start could be schedule but not an end;
                return;
            } else {
                pata.actionStatus = 'planned';
            }

            // if a task can be done concurrently, do not update runtime or start date;
            if (pata.isConcurrentable) {
                return;
            }
            taskForTrigger[trigger.id].triggerRunTime.add(
                receipt.durationPlanned
            );
            const assetInfo = taskForTrigger[trigger.id].assetSchedule.get(
                asset.id
            );

            assetInfo.assetRunTime.add(receipt.durationPlanned);
        });
    }

    reviewChanges(): Entity[] {
        this.entityChangeSet = this.emProvider.entityManager.getChanges();
        return this.entityChangeSet;
    }

    async saveEntityChanges(
        entityName: SpListEntities['shortname']
    ): Promise<SaveResult> {
        let repo: BaseRepoService<any>;
        switch (entityName) {
            case 'Generation':
                repo = this.genRepo;
                break;
            case 'GenerationAsset':
                repo = this.genAssetRepo;
                break;
            case 'Trigger':
                repo = this.triggerRepo;
                break;
            case 'TriggerAction':
                repo = this.triggerActionRepo;
                break;
            case 'AssetTriggerAction':
                repo = this.assetTrigActionRepo;
                break;
        }
        const success = await repo.saveEntityChanges();
        return success;
    }

    triggerSort(a: Trigger, b: Trigger): number {
        return a.triggerStart < b.triggerStart ? -1 : 1;
    }
}
