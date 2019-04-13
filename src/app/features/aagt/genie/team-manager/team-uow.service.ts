import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import {
    AagtDataModule,
    Team,
    TeamCategory,
    TeamCategoryRepoService
} from '../../data';
import { TeamRepoService } from '../../data/repos/team-repo.service';

@Injectable({ providedIn: AagtDataModule })
export class TeamUowService implements Resolve<any> {
    teams: Team[];
    onTeamListChange: BehaviorSubject<Team[]>;
    onTeamChange: BehaviorSubject<Team>;
    routeParams: any;
    teamCategories: TeamCategory[];

    constructor(
        private teamRepo: TeamRepoService,
        private teamCatRepo: TeamCategoryRepoService
    ) {
        this.onTeamListChange = new BehaviorSubject([]);
        this.onTeamChange = new BehaviorSubject({} as any);
    }

    resolve(route: ActivatedRouteSnapshot): Promise<any> {
        return new Promise((resolve, reject) => {
            if (route.params.id) {
                return Promise.all([
                    this.fetchAllTeams(),
                    this.fetchTeamCategories(),
                    this.getTeam(route.params.id)
                ])
                    .then(resolve)
                    .catch(e => {
                        reject(e);
                        throw new Error(e);
                    });
            }
            return Promise.all([
                this.fetchAllTeams(),
                this.fetchTeamCategories()
            ])
                .then(resolve)
                .catch(e => {
                    reject(e);
                    throw new Error(e);
                });
        });
    }

    fetchAllTeams(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.teamRepo
                .all()
                .then(allTeams => {
                    this.onTeamListChange.next(allTeams);
                    resolve();
                })
                .catch(e => {
                    reject(e);
                    throw new Error(e);
                });
        });
    }

    fetchTeamCategories(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.teamCatRepo
                .all()
                .then(teamCats => {
                    this.teamCategories = teamCats;
                    resolve();
                })
                .catch(e => {
                    reject(e);
                    throw new Error(e);
                });
        });
    }

    getTeam(id: string): Promise<void> {
        let newTeam: Team;
        return new Promise((resolve, reject) => {
            if (id === 'new') {
                newTeam = this.teamRepo.create();
                this.onTeamChange.next(newTeam);
                return resolve();
            }
            this.teamRepo
                .withId(+id)
                .then(team => {
                    this.onTeamChange.next(team);
                    return resolve();
                })
                .catch(e => {
                    reject(e);
                    throw new Error(e);
                });
        });
    }

    saveTeam(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.teamRepo
                .saveEntityChanges()
                .then(() => {
                    return resolve();
                })
                .catch(reject);
        });
    }
}
