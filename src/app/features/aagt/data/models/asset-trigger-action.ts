import { MxmAppName } from 'app/app-config.service';
import {
    BzEntity,
    BzEntityInitializer,
    BzProp,
    SpEntityBase
} from 'app/global-data';
import { GenerationAsset } from './generation-asset';
import { Team } from './team';
import { TeamJobReservation } from './team-job-reservation';
import { TriggerAction } from './trigger-action';

type AtaAllowedActionStatus =
    | 'unplanned'
    | 'planned'
    | 'unscheduled'
    | 'in-progress [on-time]'
    | 'in-progress [late]'
    | 'in-progress [early]'
    | 'scheduled'
    | 'rescheduled'
    | 'delayed';

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

    /**
     * When used, indicates that child entity will be deleted
     * during the next save operation. Prefer to use this method
     * when entities may be deleted and restored several times
     * before actual saving is done to store.
     *
     * Used instead of Breeze internal setDeleted() method becuase
     * setDeleted() assume the entity will not longer be reference, '
     * which cases all child and parent references to this entity
     * be dropped and a pain in the butt to be recovered later.
     */
    isSoftDeleted?: boolean;

    @BzProp('data', {})
    sequence: number;

    @BzProp('data', {
        dataCfg: {
            isNullable: false
        },
        spInternalName: 'Task Status'
    })
    actionStatus: AtaAllowedActionStatus;

    @BzProp('data', {})
    outcome: AtaAllowedOutcomes;

    @BzProp('data', {})
    plannedStart: Date;

    @BzProp('data', {})
    plannedStop: Date;

    @BzProp('data', {
        spInternalName: 'Start Date'
    })
    scheduledStart: Date;

    @BzProp('data', {
        spInternalName: 'Due Date'
    })
    scheduledStop: Date;

    @BzProp('data', {})
    actualStart: Date;

    @BzProp('data', {})
    actualStop: Date;

    @BzProp('data', {})
    completedByTeamId: number;

    completedByTeam?: Team;

    @BzProp('data', {})
    generationAssetId: number;

    @BzProp('data', {})
    triggerActionId: number;

    @BzProp('data', {})
    isConcurrentable: boolean;

    @BzProp('nav', {
        relativeEntity: 'GenerationAsset',
        navCfg: { isScalar: true }
    })
    generationAsset: GenerationAsset;

    @BzProp('nav', {
        relativeEntity: 'TriggerAction',
        navCfg: { isScalar: true }
    })
    triggerAction: TriggerAction;

    @BzProp('nav', {
        relativeEntity: 'TeamJobReservation'
    })
    teamJobReservations: TeamJobReservation[];

    @BzEntityInitializer
    private ataInitializer(entity: this) {
        entity.outcome = entity.outcome || 'untouched';
        entity.actionStatus = entity.actionStatus || 'unplanned';
    }
}
