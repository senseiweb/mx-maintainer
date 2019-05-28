import { MxmAppName } from 'app/app-config.service';
import { BzEntity, BzProp, SpEntityBase } from 'app/global-data';
import { AssetTriggerAction } from './asset-trigger-action';
import { Generation } from './generation';
import { TeamAvailability } from './team-availability';

/**
 * Entity to capture the relationship between Asset Trigger Action and
 * a available Team that is assigned to accomplish the the task.
 */
@BzEntity(MxmAppName.Aagt, {})
export class TeamJobReservation extends SpEntityBase {
    readonly shortname = 'TeamJobReservation';

    @BzProp('data', {})
    teamAvailabilityId: number;

    @BzProp('data', {})
    assetTriggerActionId: number;

    @BzProp('data', {})
    generationId: number;

    @BzProp('data', {})
    reservationStart: Date;

    @BzProp('data', {})
    reservationEnd: Date;

    @BzProp('nav', {
        relativeEntity: 'AssetTriggerAction',
        navCfg: { isScalar: true }
    })
    assetTriggerAction: AssetTriggerAction;

    @BzProp('nav', {
        relativeEntity: 'Generation',
        navCfg: { isScalar: true }
    })
    generation: Generation;

    @BzProp('nav', {
        relativeEntity: 'TeamAvailability',
        navCfg: { isScalar: true }
    })
    teamAvailability: TeamAvailability;
}
