import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { SpEntityBase } from 'app/global-data';
import { Predicate } from 'breeze-client';
import * as _l from 'lodash';
import { defer, forkJoin, BehaviorSubject, Observable } from 'rxjs';
import {
    AagtDataModule,
    ActionItem,
    Generation,
    GenerationRepoService,
    GenAssetRepoService,
    TeamAvailRepoService,
    TeamCategoryRepoService,
    TeamJobReservationRepoService,
    TriggerActionRepoService,
    TriggerRepoService
} from '../data';
import { AagtEmProviderService } from '../data/aagt-emprovider.service';
import { TeamCategory } from '../data/models/team-category';
import { AssetTriggerActionRepoService } from '../data/repos/asset-trigger-action-repo.service';
import { TeamRepoService } from '../data/repos/team-repo.service';

@Injectable({ providedIn: AagtDataModule })
export class GenMgrUowService implements Resolve<Generation[]> {
    allGenerations: Generation[];
    allActionItems: ActionItem[] = [];
    onActionItemChanged: BehaviorSubject<ActionItem>;
    routeParams: any;
    selectedGen: Generation;
    teamCategories: TeamCategory[];
    onEntitiesChange: Observable<SpEntityBase[]>;
    isSaving: Observable<boolean>;

    constructor(
        private genRepo: GenerationRepoService,
        private triggerRepo: TriggerRepoService,
        private genAssetRepo: GenAssetRepoService,
        private ataRepo: AssetTriggerActionRepoService,
        private triggerActionRepo: TriggerActionRepoService,
        private tmCatRepo: TeamCategoryRepoService,
        private tmRepo: TeamRepoService,
        private tmAvail: TeamAvailRepoService,
        private tmJobResRepo: TeamJobReservationRepoService,
        public aagtEmService: AagtEmProviderService
    ) {
        this.onEntitiesChange = new Observable();
        this.isSaving = aagtEmService.onSaveInProgressChange;
    }

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        const id = route.params.id;
        let resolver: Observable<any>;
        if (!id) {
            resolver = forkJoin([this.genRepo.all]);
            resolver.subscribe(([allGenerations]) => {
                this.allGenerations = allGenerations;
            });

            return resolver;
        }

        const genPred = this.genRepo.makePredicate('id', +id);
        this.selectedGen = this.genRepo.whereInCache(genPred)[0];

        resolver = forkJoin([
            this.tmCatRepo.all,
            this.tmRepo.all,
            defer(() => this.fetchGenerationData(+id))
        ]);
        return resolver;
    }

    private fetchGenerationData(id: number): Promise<any> {
        const genPredicate = this.genAssetRepo.makePredicate(
            'generationId',
            id
        );
        const genAssetsAndChildren = this.genAssetRepo.whereWithChildren(
            genPredicate,
            this.ataRepo,
            'generationAssetId'
        );

        const tjrPredicate = this.tmJobResRepo.makePredicate(
            'generationId',
            +id
        );

        const teamJobReservations = this.tmJobResRepo.where(
            `resourcesFor-${id}`,
            tjrPredicate
        );

        const trigPredicate = this.triggerRepo.makePredicate(
            'generationId',
            id
        );
        const trigAndChildren = this.triggerRepo.whereWithChildren(
            trigPredicate,
            this.triggerActionRepo,
            'triggerId'
        );

        return Promise.all([
            genAssetsAndChildren,
            trigAndChildren,
            teamJobReservations
        ]);
    }
}
