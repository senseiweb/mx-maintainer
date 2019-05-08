import { Injectable } from '@angular/core';
import {
    Entity,
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
    GenerationRepoService,
    GenAssetRepoService,
    IJobReservateionRequest,
    Team,
    TeamAvailability,
    TeamAvailRepoService,
    TeamCategory,
    TeamCategoryRepoService,
    Trigger,
    TriggerActionRepoService,
    TriggerRepoService
} from '../../data';

import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot
} from '@angular/router';

import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { bareEntity } from '@ctypes/breeze-type-customization';
import { AssetTriggerActionRepoService } from 'app/features/aagt/data/repos/asset-trigger-action-repo.service';
import {} from 'app/features/aagt/data/repos/trigger-action-repo.service';
import { BaseRepoService, SpEntityBase } from 'app/global-data';
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

import { SpListName } from 'app/app-config.service';
import {
    AagtEmProviderService
} from '../../data/aagt-emprovider.service';
import { TeamRepoService } from '../../data/repos/team-repo.service';
import { IStepperModel } from './planner.component';

export type FilterType = 'asset' | 'trigger';
export type FilterChange = {
    [key in FilterType]?: {
        filterText: string;
    }
};

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
    onFilterChange: BehaviorSubject<FilterChange>;
    onEntitiesChange: Observable<SpEntityBase[]>;
    private entityChangeSet: Entity[];
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
        this.onStepValidityChange = new BehaviorSubject({});
        this.onFilterChange = new BehaviorSubject({
            asset: {
                filterText: 'all'
            },
            trigger: {
                filterText: 'all'
            }
        });
        this.onStepperChange = new Subject();
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        const id = route.params.id;

        this.planGen(id);

        this.onStepperChange.subscribe((stepEvent: StepperSelectionEvent) => {
            switch (stepEvent.previouslySelectedIndex) {
                case 0:
                    break;
                case 1:
                    break;
            }
        });

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

    createTeamAvailability = (info: {
        teamId: number;
        availStart: Date;
        availEnd: Date;
        manHoursAvail: number;
    }) => this.teamAvailRepo.create(info)


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

    createNewTrigger(generationId: number): Trigger {
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

    async saveEntityChanges(entityName: SpListName): Promise<SaveResult> {
        let repo: BaseRepoService<any>;
        switch (entityName) {
            case SpListName.Generation:
                repo = this.genRepo;
                break;
            case SpListName.GenerationAsset:
                repo = this.genAssetRepo;
                break;
            case SpListName.Trigger:
                repo = this.triggerRepo;
                break;
            case SpListName.TriggerAction:
                repo = this.triggerActionRepo;
                break;
            case SpListName.AssetTriggerAction:
                repo = this.assetTrigActionRepo;
                break;
        }
        const success = await repo.saveEntityChanges();
        return success;
    }
}
