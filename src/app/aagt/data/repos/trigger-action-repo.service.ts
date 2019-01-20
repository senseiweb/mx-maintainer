import { Injectable } from '@angular/core';
import { BaseRepoService, EmProviderService } from 'app/data';
import { Trigger, AagtListName, TriggerAction } from '../models';
import { AagtDataModule } from '../aagt-data.module';
import { EntityState } from 'breeze-client';

@Injectable({ providedIn: AagtDataModule })
export class TriggerActionRepoService extends BaseRepoService<TriggerAction> {

    constructor (emService: EmProviderService) {
        super(AagtListName.TriggerAct, emService);
    }

    getOrCreateTriggerAction(data: { triggerId: number, actionItemId: number }): TriggerAction {
        const deletedTrigAction = this.entityManager
            .getEntities(this.entityType, EntityState.Deleted)
            .filter((entity: TriggerAction) => entity.actionItemId === data.actionItemId
                && entity.triggerId === data.triggerId)[0] as TriggerAction;

        if (deletedTrigAction) {
            deletedTrigAction.entityAspect.setUnchanged();
            return deletedTrigAction;
        }

        return this.createBase(data);
    }

}
