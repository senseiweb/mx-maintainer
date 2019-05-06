import { MxmAppName, SpListName } from 'app/app-config.service';
import {
    BzProp,
    BzEntity,
    SpEntityBase,
} from 'app/global-data';
import { Validator } from 'breeze-client';
import * as _m from 'moment';
import { Generation } from './generation';
import { TriggerAction } from './trigger-action';

@BzEntity(MxmAppName.Aagt, { shortName: SpListName.Trigger })
export class Trigger extends SpEntityBase {

    @BzProp('data', {spInternalName: 'Title'})
    milestone: string;

    get completionTime(): number {
        if (!this.triggerActions) {
            return;
        }
        return this.triggerActions
            .map(tra => tra.actionItem.duration)
            .reduce((duration1, duration2) => duration1 + duration2, 0);
    }

    @BzProp('data', {})
    triggerStart?: Date;

    @BzProp('data', {})
    triggerStop?: Date;

    triggerDateRange: Date[];

    @BzProp('data', {
        dataCfg: {isNullable: false}
    })
    generationId: number;

    @BzProp('nav', {
        relativeEntity: SpListName.Generation,
        navCfg: {
            isScalar: true
        }
    })
    generation: Generation;

    @BzProp('nav', {
        relativeEntity: SpListName.TriggerAction
    })
    triggerActions: TriggerAction[];

    // TODO: Need to handle this registeration
    validateTrigger(): Validator {
        return new Validator('duplicateTriggerMiles', (entity: this, ctx) => {
            if (!entity || !entity.milestone) {
                return true;
            }
            const existing = entity.generation.triggers.map(trig => {
                if (trig.milestone && trig.milestone) {
                    return trig.milestone;
                }
            });
            if (!existing) {
                return true;
            }
            if (existing.includes(entity.milestone)) {
                return false;
            }
            return true;
        });
    }
}
