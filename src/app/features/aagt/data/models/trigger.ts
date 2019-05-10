import { ValidatorFn } from '@angular/forms';
import { MxmAppName, SpListName } from 'app/app-config.service';
import {
    BzCustomValidator,
    BzEntity,
    BzProp,
    SpEntityBase
} from 'app/global-data';
import { Validator } from 'breeze-client';
import * as _m from 'moment';
import { Generation } from './generation';
import { TriggerAction } from './trigger-action';

@BzEntity(MxmAppName.Aagt, {})
export class Trigger extends SpEntityBase {
    readonly shortname = 'Trigger';

    @BzProp('data', { spInternalName: 'Title' })
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
        dataCfg: { isNullable: false }
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

    @BzCustomValidator<Trigger>({
        validatorScope: 'entity',
        targetedProperty: 'milestone',
        reqProps: ['milestone']
    })
    duplicateTriggerMiles(): Validator {
        const validatorName = 'duplicateTriggerMiles';
        const validatorFn = (entity: this, ctx: any): boolean => {
            let isValid = true;
            if (!ctx || !ctx.milestone) {
                return isValid;
            }
            isValid = !entity.generation.triggers.some(
                trig =>
                    trig.milestone &&
                    trig.milestone.toLowerCase() === ctx.milestone.toLowerCase()
            );
            return isValid;
        };
        const additionalCtx = {
            message: context =>
                `The milesont "${
                    context.milestone
                }" matches an already existing milestone for this generation!`
        };

        return new Validator(validatorName, validatorFn, additionalCtx);
    }
}
