import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AagtDataModule, ActionItem, ActionItemRepo } from '../../data';

@Injectable({ providedIn: AagtDataModule })
export class AimUowService implements Resolve<ActionItem[]> {
    actions: ActionItem[];
    onActionItemsChanged: BehaviorSubject<ActionItem[]>;
    onActionItemChanged: BehaviorSubject<ActionItem>;
    routeParams: any;
    teamTypes: string[];

    constructor(private actionItemRepo: ActionItemRepo) {
        this.onActionItemsChanged = new BehaviorSubject([]);
        this.onActionItemChanged = new BehaviorSubject({} as any);
    }

    resolve(route: ActivatedRouteSnapshot): Promise<any> {
        const preload = [this.fetchAllActionItems(), this.fetchAllTeamTypes()];

        if (route.params.id) {
            preload.push(this.getActionItem(route.params.id));
        }
        return new Promise(async (resolve, reject) => {
            try {
                await Promise.all(preload);
                return resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

    async fetchAllActionItems(): Promise<void> {
        try {
            const actionItems = await this.actionItemRepo.all();
            this.onActionItemsChanged.next(actionItems);
        } catch (e) {
            console.log(e);
        }
    }

    async fetchAllTeamTypes(): Promise<void> {
        try {
            this.teamTypes = await this.actionItemRepo.spChoiceValues('TeamType');
        } catch (error) {
            console.log(error);
        }
    }

    async getActionItem(id: string): Promise<void> {
        let newActionItem: ActionItem;

        if (id === 'new') {
            newActionItem = this.actionItemRepo.create();
            Promise.resolve();
        } else {
            try {
                newActionItem = await this.actionItemRepo.withId(+id);
                Promise.resolve();
            } catch (e) {
                console.log(e);
            }
        }
        this.onActionItemChanged.next(newActionItem);
    }

    async saveActionItems(actionItem: ActionItem): Promise<void> {
        this.actionItemRepo.saveEntityChanges([actionItem]);
    }
}
