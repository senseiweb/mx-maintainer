import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { SpEntityBase } from 'app/global-data';
import { SaveResult } from 'breeze-client';
import { forkJoin, BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
    AagtDataModule,
    ActionItem,
    ActionItemRepo,
    TeamCategoryRepoService
} from '../../data';
import { AagtEmProviderService } from '../../data/aagt-emprovider.service';
import { TeamCategory } from '../../data/models/team-category';

@Injectable({ providedIn: AagtDataModule })
export class AimUowService implements Resolve<ActionItem[]> {
    actions: ActionItem[];
    allActionItems: ActionItem[] = [];
    onActionItemChanged: BehaviorSubject<ActionItem>;
    routeParams: any;
    teamCategories: TeamCategory[];
    onEntitiesChange: Observable<SpEntityBase[]>;
    isSaving: Observable<boolean>;

    constructor(
        private actionItemRepo: ActionItemRepo,
        private teamCatRepo: TeamCategoryRepoService,
        aagtEmService: AagtEmProviderService
    ) {
        this.onEntitiesChange = new Observable();
        this.isSaving = aagtEmService.onSaveInProgressChange;
    }

    resolve(): Observable<any> {
        const resolver = forkJoin(
            this.actionItemRepo.all,
            this.teamCatRepo.all
        );

        resolver.subscribe(([allActionItems, allTeamCats]) => {
            this.allActionItems = allActionItems;
            this.teamCategories = allTeamCats;
        });

        return resolver;
    }

    createActionItem(): ActionItem {
        return this.actionItemRepo.create();
    }

    createTeamCategory(): TeamCategory {
        return this.teamCatRepo.create();
    }

    async saveTeamCategory(): Promise<SaveResult> {
        if (this.teamCatRepo.hasChanges()) {
            const teamCatSaveResult = await this.teamCatRepo.saveEntityChanges();
            this.teamCategories = this.teamCatRepo.whereInCache();
            return teamCatSaveResult;
        }
        return Promise.resolve(undefined);
    }

    async saveActionItem(): Promise<SaveResult> {
        const aiSaveResult = await this.actionItemRepo.saveEntityChanges();
        return aiSaveResult;
    }
}
