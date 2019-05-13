import { MxmAppName } from 'app/app-config.service';
import { BzEntity, BzProp, SpEntityBase } from 'app/global-data';
import { GenerationAsset } from './generation-asset';
import { Team } from './team';
import { TriggerAction } from './trigger-action';

type AtaAllowedActionStatus =
    | 'Planned'
    | 'Unscheduled'
    | 'In-progress'
    | 'Scheduled'
    | 'Rescheduled'
    | 'Delayed';

type AtaAllowedOutcomes =
    | 'PCW'
    | 'completed [on-time]'
    | 'completed [early]'
    | 'completed [late]'
    | 'blamed'
    | 'untouched';

@BzEntity(MxmAppName.Aagt, {})
export class AssetTriggerAction extends SpEntityBase {

    readonly shortname = 'AssetTriggerAction';

    @BzProp('data', {})
    sequence: number;

    @BzProp('data', {
        dataCfg: {
            isNullable: false
        },
        spInternalName: 'Title'
    })
    actionStatus: AtaAllowedActionStatus;

    @BzProp('data', {})
    outcome: AtaAllowedOutcomes;

    @BzProp('data', {})
    plannedStart: Date;

    @BzProp('data', {})
    plannedStop: Date;

    @BzProp('data', {})
    scheduledStart: Date;

    @BzProp('data', {})
    scheduledStop: Date;

    @BzProp('data', {})
    actualStart: Date;

    @BzProp('data', {})
    actualStop: Date;

    @BzProp('data', {})
    completedByTeamId: number;

    completedByTeam?: Team;

    @BzProp('data', {})
    genAssetId: number;

    @BzProp('data', {})
    triggerActionId: number;

    @BzProp('data', {})
    isConcurrentable: boolean;

    @BzProp('nav', {
        relativeEntity: 'GenerationAsset',
        navCfg: { isScalar: true }
    })
    genAsset: GenerationAsset;

    @BzProp('nav', {
        relativeEntity: 'Trigger',
        navCfg: { isScalar: true }
    })
    triggerAction: TriggerAction;
}
