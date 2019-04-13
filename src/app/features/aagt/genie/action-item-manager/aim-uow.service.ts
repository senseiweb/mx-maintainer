import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import {
    AagtDataModule,
    ActionItem,
    ActionItemRepo,
    TeamCategoryRepoService
} from '../../data';
import { TeamCategory } from '../../data/models/team-category';

@Injectable({ providedIn: AagtDataModule })
export class AimUowService implements Resolve<ActionItem[]> {
    actions: ActionItem[];
    onActionItemsChanged: BehaviorSubject<ActionItem[]>;
    onActionItemChanged: BehaviorSubject<ActionItem>;
    routeParams: any;
    teamCategories: TeamCategory[];

    constructor(
        private actionItemRepo: ActionItemRepo,
        private teamCatRepo: TeamCategoryRepoService
    ) {
        this.onActionItemsChanged = new BehaviorSubject([]);
        this.onActionItemChanged = new BehaviorSubject({} as any);
    }

    resolve(route: ActivatedRouteSnapshot): Promise<any> {
        return new Promise((resolve, reject) => {
            if (route.params.id) {
                return Promise.all([
                    this.fetchAllActionItems(),
                    this.fetchAllTeamCategories(),
                    this.getActionItem(route.params.id)
                ])
                    .then(resolve)
                    .catch(e => {
                        reject(e);
                        throw new Error(e);
                    });
            }
            return Promise.all([
                this.fetchAllActionItems(),
                this.fetchAllTeamCategories()
            ])
                .then(resolve)
                .catch(e => {
                    reject(e);
                    throw new Error(e);
                });
        });
    }

    fetchAllActionItems(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.actionItemRepo
                .all()
                .then(allAI => {
                    this.onActionItemsChanged.next(allAI);
                    resolve();
                })
                .catch(e => {
                    reject(e);
                    throw new Error(e);
                });
        });
    }

    fetchAllTeamCategories(): Promise<void> {
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

    getActionItem(id: string): Promise<void> {
        let newActionItem: ActionItem;
        return new Promise((resolve, reject) => {
            if (id === 'new') {
                newActionItem = this.actionItemRepo.create();
                this.onActionItemChanged.next(newActionItem);
                return resolve();
            }
            this.actionItemRepo
                .withId(+id)
                .then(newAction => {
                    this.onActionItemChanged.next(newAction);
                    return resolve();
                })
                .catch(e => {
                    reject(e);
                    throw new Error(e);
                });
        });
    }

    saveActionItems(actionItem: ActionItem): Promise<void> {
        return new Promise((resolve, reject) => {
            this.actionItemRepo
                .saveEntityChanges()
                .then(() => {
                    return resolve();
                })
                .catch(reject);
        });
    }
}
