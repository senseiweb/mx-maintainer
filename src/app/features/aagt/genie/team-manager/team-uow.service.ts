import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { SaveResult } from 'breeze-client';
import { forkJoin, BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
    AagtDataModule,
    Team,
    TeamCategory,
    TeamCategoryRepoService
} from '../../data';
import { AagtEmProviderService } from '../../data/aagt-emprovider.service';
import { TeamRepoService } from '../../data/repos/team-repo.service';

@Injectable({ providedIn: AagtDataModule })
export class TeamUowService implements Resolve<any> {
    allTeams: Team[] = [];
    currentTeam: Team;
    routeParams: any;
    teamCategories: TeamCategory[] = [];
    isSaving: Observable<boolean>;

    constructor(
        private teamRepo: TeamRepoService,
        private teamCatRepo: TeamCategoryRepoService,
        aagtEmService: AagtEmProviderService
    ) {
        this.isSaving = aagtEmService.onSaveInProgressChange;
    }

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        return forkJoin(
            this.teamCatRepo.all.pipe(
                tap(teamCats => (this.teamCategories = teamCats))
            ),
            this.teamRepo.all.pipe(tap(teams => (this.allTeams = teams)))
        );
    }

    createTeamCategory(): TeamCategory {
        return this.teamCatRepo.create();
    }

    createTeam(): Team {
        return this.teamRepo.create();
    }

    async getTeam(id: string): Promise<Team> {
        const team = await this.teamRepo.withId(+id);

        return team;
    }

    async saveTeamCategory(): Promise<SaveResult> {
        if (this.teamCatRepo.hasChanges()) {
            const teamCatSaveResult = await this.teamCatRepo.saveEntityChanges();
            this.teamCategories = this.teamCatRepo.whereInCache();
            return teamCatSaveResult;
        }
        return Promise.resolve(undefined);
    }

    async saveTeam(): Promise<SaveResult> {
        const result = await this.teamRepo.saveEntityChanges();
        this.allTeams = this.teamRepo.whereInCache();
        return result;
    }
}
