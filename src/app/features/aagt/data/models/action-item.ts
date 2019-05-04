import { MxmAppName, SpListName } from 'app/app-config.service';
import {
    BzDataProp,
    BzEntity,
    BzNavProp,
    BzValid_IsRequired,
    SpEntityBase
} from 'app/global-data';
import { TeamCategory } from './team-category';
import { TriggerAction } from './trigger-action';

@BzEntity(MxmAppName.Aagt, { shortName: SpListName.ActionItem })
export class ActionItem extends SpEntityBase {
    @BzDataProp({
        isNullable: false,
        spInternalName: 'Title'
    })
    action: string;

    @BzDataProp()
    @BzValid_IsRequired
    shortCode: string;

    @BzDataProp()
    duration: number;

    @BzDataProp()
    @BzValid_IsRequired
    teamCategoryId: number;

    @BzNavProp<ActionItem>({
        rt: SpListName.TeamCategory,
        fk: 'teamCategoryId'
    })
    teamCategory: TeamCategory;

    @BzDataProp()
    assignable: boolean;

    // @BzDataProp()
    notes: string;

    @BzNavProp({ rt: SpListName.TriggerAction })
    actionTriggers: TriggerAction[];
}
