import { MxmAppName, SpListName } from 'app/app-config.service';
import {
    BzDataProp,
    BzEntity,
    BzNavProp,
    BzValid_CustomValidator,
    BzValid_IsRequired,
    SpEntityBase
} from 'app/global-data';
import { Validator } from 'breeze-client';
import * as _m from 'moment';
import { Generation } from './generation';
import { TriggerAction } from './trigger-action';

@BzEntity(MxmAppName.Aagt, { shortName: SpListName.Trigger })
export class Trigger extends SpEntityBase {
    @BzDataProp({
        spInternalName: 'Title'
    })
    milestone: string;

    get completionTime(): number {
        if (!this.triggerActions) {
            return;
        }
        return this.triggerActions
            .map(tra => tra.actionItem.duration)
            .reduce((duration1, duration2) => duration1 + duration2, 0);
    }

    @BzDataProp()
    triggerStart?: Date;

    @BzDataProp()
    triggerStop?: Date;

    triggerDateRange: Date[];

    @BzDataProp()
    generationId: number;

    @BzNavProp<Trigger>({
        rt: SpListName.Generation,
        fk: 'generationId'
    })
    generation: Generation;

    @BzNavProp({ rt: SpListName.TriggerAction })
    triggerActions: TriggerAction[];

    @BzValid_CustomValidator<Trigger>()
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
