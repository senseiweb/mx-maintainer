import { Injectable } from '@angular/core';
import { BaseRepoService, EmProviderService } from 'app/global-data';
import { EntityState } from 'breeze-client';
import { AagtDataModule } from '../aagt-data.module';
import { AagtEmProviderService } from '../aagt-emprovider.service';
import { AagtListName, Trigger, TriggerAction } from '../models';

@Injectable({ providedIn: AagtDataModule })
export class TriggerActionRepoService extends BaseRepoService<TriggerAction> {
    constructor(emService: AagtEmProviderService) {
        super(AagtListName.TriggerAct, emService);
    }

    createTrigAction(data: { triggerId: number; actionItemId: number }): TriggerAction {
        return this.createBase(data);
    }

    recoverDeletedTrigAction(data: { triggerId: number; actionItemId: number }): TriggerAction | null {
        const deletedTrigActions = this.entityManager.getEntities(this.entityType, EntityState.Deleted) as TriggerAction[];

        const recoveredTrigAction = deletedTrigActions.filter(ta => ta.triggerId === data.triggerId && ta.actionItemId === data.actionItemId)[0];

        if (recoveredTrigAction) {
            recoveredTrigAction.entityAspect.setUnchanged();
            return recoveredTrigAction;
        }
        return null;
    }
}
