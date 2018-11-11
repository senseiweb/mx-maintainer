import { Injectable } from '@angular/core';
import { ActionItem, ActionItemRepo } from 'app/aagt/data';
import { Resolve, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { AagtModule } from 'app/aagt/aagt.module';
import { AagtDataModule } from 'app/aagt/data/aagt-data.module';

@Injectable({ providedIn: AagtDataModule })
export class AimUowService implements Resolve<ActionItem[]> {

    actions: ActionItem[];
    onActionItemsChanged: BehaviorSubject<ActionItem[]>;
    onActionItemChanged: BehaviorSubject<ActionItem>;
    routeParams: any;

    constructor(private actionItemRepo: ActionItemRepo
    ) {
        this.onActionItemsChanged = new BehaviorSubject({}) as any;
        this.onActionItemChanged = new BehaviorSubject({}) as any;
    }

    async resolve(route: ActivatedRouteSnapshot): Promise<any> {
        if (route.params.id) {
            const actionItem = await this.getActionItem(route.params.id);
            return this.onActionItemChanged.next(actionItem);
        }
        const ais = await this.actionItemRepo.all();
        this.onActionItemsChanged.next(ais);
        return ais;
    }

    async getActionItem(id: string): Promise<ActionItem> {
        if (id === 'new') {
            const newActionItem = this.actionItemRepo.create();
            return Promise.resolve(newActionItem);
        }
        return await this.actionItemRepo.withId(+id);
    }
}
