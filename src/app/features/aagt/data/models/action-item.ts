import { MxmAppName } from 'app/app-config.service';
import { BzEntity, BzProp, SpEntityBase } from 'app/global-data';
import { TeamCategory } from './team-category';
import { TriggerAction } from './trigger-action';

@BzEntity(MxmAppName.Aagt, {})
export class ActionItem extends SpEntityBase {

    readonly shortname = 'ActionItem';

    @BzProp('data', {
        dataCfg: {
            isNullable: false
        },
        spInternalName: 'Title'
    })
    action: string;

    @BzProp('data', {})
    shortCode: string;

    @BzProp('data', {})
    duration: number;

    @BzProp('data', {})
    teamCategoryId: number;

    @BzProp('nav', {
        relativeEntity: 'TeamCategory',
        navCfg: { isScalar: true }
    })
    teamCategory: TeamCategory;

    @BzProp('data', {})
    assignable: boolean;

    // @BzDataProp()
    notes: string;

    @BzProp('nav', {
        relativeEntity: 'TriggerAction'
    })
    actionTriggers: TriggerAction[];
}
