import { Injectable } from '@angular/core';
import { ActionItem, ActionItemRepo } from 'app/aagt/data';
import { Resolve } from '@angular/router';
import { GenieModule } from '../genie.module';

@Injectable({ providedIn: GenieModule })
export class AimUowService implements Resolve<ActionItem[]> {

    actions: ActionItem[];

    constructor(private actionItemRepo: ActionItemRepo) { }

    async resolve(): Promise<any> {
        return await this.actionItemRepo.all();
    }

    async onActionItemsChanged(): Promise<any> {
        return null;
    }
}
