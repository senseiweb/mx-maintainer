import { Injectable } from '@angular/core';
import { ActionItem, ActionItemRepo } from 'app/aagt/data';
import { Resolve } from '@angular/router';
import { GenieModule } from '../genie.module';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: GenieModule })
export class AimUowService implements Resolve<ActionItem[]> {

    actions: ActionItem[];
    onActionItemsChanged: BehaviorSubject<ActionItem[]>;


    constructor(private actionItemRepo: ActionItemRepo) {
        this.onActionItemsChanged = new BehaviorSubject({}) as any;
    }

    async resolve(): Promise<any> {
        const ais = await this.actionItemRepo.all();
        this.onActionItemsChanged.next(ais);
        return ais;
    }

    // async onActionItemsChanged(): Promise<any> {
    //     return null;
    // }
}
